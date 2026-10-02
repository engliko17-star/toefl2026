// ==========================================
// WRITING ENGINE — большой мок-тест, формат TOEFL 2026
// Build a Sentence (6 мин) -> Email (7 мин) -> Academic Discussion (10 мин)
// ==========================================
//
// ВАЖНО: этот файл НЕ объявляет openTestView / globalNext / globalPrev /
// window.onerror. Единственные их версии живут в tests.html (и в
// reading-engine.js для onerror). Если такие функции снова появятся здесь,
// они начнут молча перетирать версии из tests.html — именно так раньше
// ломались соседние секции.
//
// Данные: full_test_writing_tasks(test_id, task_id, order_num) -> writing_tasks.
// Тип задания берётся из writing_tasks.type ('sentence' | 'email' | 'academic').
//   sentence: prompt_context, avatar_left, avatar_right, structure (jsonb:
//             [{type:'text', value}, {type:'slot'}]), bank (text[]), sample_answer
//   email:    title, prompt_context, instructions (text[]), meta_to, meta_subject
//   academic: title, instruction_box, professor_name, professor_avatar,
//             professor_prompt, peers (jsonb: [{name, avatar, text}])
// Сохранение: big_mock_writing_attempts + big_mock_writing_answers
// (essay_text / word_count; score / feedback выставляет учитель).

const WRITING_PHASE_MINUTES = { sentence: 6, email: 7, academic: 10 };

let sentencesData = [];
let emailData = null;
let academicData = null;

let writingPhase = 'sentence'; // 'sentence' | 'sentence-review' | 'transition' | 'email' | 'academic' | 'saving' | 'done'
let currentSentenceIndex = 0;
let writingUserAnswers = {};      // { taskId: "текст" } — email / academic
let writingSentenceAnswers = {};  // { taskId: "собранное предложение" }
let writingTimerInterval = null;
let writingSessionId = 0;         // защита от «призраков» после Abort
let writingDragJustEnded = false; // чтобы клик после перетаскивания не сработал второй раз
let writingSecondsLeft = 0;        // остаток таймера текущей фазы — для паузы при перезагрузке
let writingTransitionNext = null;  // куда ведёт экран-переход ('email' | 'academic')

// ------------------------------------------
// Автосохранение (см. mtSaveProgress в tests.html)
// ------------------------------------------
function writingSlotsSnapshot() {
    const snap = {};
    sentencesData.forEach((q, i) => {
        const slots = [...document.querySelectorAll(`[id^="wslot-${i}-"]`)];
        if (slots.length) snap[q.id] = slots.map(sl => sl.children.length ? sl.children[0].textContent.trim() : null);
    });
    return snap;
}

function saveWritingProgress() {
    if (window.engineType !== 'writing' || typeof mtSaveProgress !== 'function') return;
    if (writingPhase === 'saving' || writingPhase === 'done') return;
    if (!sentencesData.length && !emailData && !academicData) return;
    const phase = writingPhase === 'sentence-review' ? 'sentence' : writingPhase;
    const hint = phase === 'sentence' ? `Build a Sentence ${currentSentenceIndex + 1}/${sentencesData.length}`
        : phase === 'email' ? 'Email' : phase === 'academic' ? 'Academic Discussion' : 'between tasks';
    mtSaveProgress('writing', {
        phase,
        next: writingTransitionNext,
        idx: currentSentenceIndex,
        slots: phase === 'sentence' ? writingSlotsSnapshot() : null,
        sentenceAnswers: writingSentenceAnswers,
        texts: writingUserAnswers,
        time: writingSecondsLeft,
        ids: { s: sentencesData.map(q => q.id), e: emailData ? emailData.id : null, a: academicData ? academicData.id : null }
    }, hint);
}

// ------------------------------------------
// Вспомогательное
// ------------------------------------------
function writingDb() {
    if (typeof getSupabaseClient === 'function') return getSupabaseClient();
    if (typeof supabaseClient !== 'undefined') return supabaseClient;
    return window.supabaseClient || null;
}

function writingEsc(s) {
    return String(s === null || s === undefined ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function writingSessionAlive(id) {
    return id === writingSessionId && window.engineType === 'writing';
}

// Нормализация типа: в базе встречаются варианты написания
function writingNormalizeType(t) {
    const s = String(t || '').toLowerCase();
    if (s.includes('sentence')) return 'sentence';
    if (s.includes('email')) return 'email';
    if (s.includes('academic') || s.includes('discussion')) return 'academic';
    return s;
}

function writingParseJson(v) {
    if (typeof v !== 'string') return v;
    try { return JSON.parse(v); } catch (e) { return v; }
}

// Счёт слов как в обычных редакторах: артикли считаются, апострофы не рвут слово
function countWords(text) {
    const trimmed = (text || '').trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
}

// Сравнение собранного предложения с эталоном. Регистр, лишние пробелы и
// типографские кавычки/апострофы (’ ‘ ` “ ”) на результат не влияют.
function writingNormalizeSentence(s) {
    return String(s || '')
        .replace(/[\u2018\u2019\u201B`\u00B4]/g, "'")
        .replace(/[\u201C\u201D]/g, '"')
        .replace(/\s+([.?!,;:])/g, '$1')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
}

function writingIsSentenceCorrect(task, answer) {
    const correct = (task && task.sample_answer) ? task.sample_answer : '';
    if (!correct || !answer) return false;
    return writingNormalizeSentence(answer) === writingNormalizeSentence(correct);
}

// ==========================================
// 1. ЗАГРУЗКА ЗАДАНИЙ
// ==========================================
async function fetchAndParseWritingTasks(testId) {
    const result = { sentences: [], email: null, academic: null, warnings: [] };
    const client = writingDb();
    if (!client) throw new Error('Supabase client is not available');

    const { data: plan, error: planErr } = await client
        .from('full_test_writing_tasks')
        .select('*')
        .eq('test_id', testId)
        .order('order_num', { ascending: true });

    if (planErr) throw planErr;
    if (!plan || plan.length === 0) return result;

    const taskIds = [...new Set(plan.map(p => p.task_id))];
    const { data: tasksData, error: tasksErr } = await client
        .from('writing_tasks')
        .select('*')
        .in('id', taskIds);

    if (tasksErr) throw tasksErr;

    const tasksById = {};
    (tasksData || []).forEach(t => {
        t.structure = writingParseJson(t.structure);
        t.bank = writingParseJson(t.bank);
        t.instructions = writingParseJson(t.instructions);
        t.peers = writingParseJson(t.peers);
        tasksById[String(t.id)] = t;
    });

    plan.forEach(p => {
        const t = tasksById[String(p.task_id)];
        if (!t) {
            result.warnings.push(`writing_tasks id=${p.task_id} не найден (или закрыт RLS)`);
            return;
        }
        const type = writingNormalizeType(t.type);
        if (type === 'sentence') {
            result.sentences.push(t);
        } else if (type === 'email') {
            if (!result.email) result.email = t;
            else result.warnings.push(`лишнее Email-задание id=${t.id} — используется первое (id=${result.email.id})`);
        } else if (type === 'academic') {
            if (!result.academic) result.academic = t;
            else result.warnings.push(`лишнее Academic-задание id=${t.id} — используется первое (id=${result.academic.id})`);
        } else {
            result.warnings.push(`неизвестный type='${t.type}' у writing_tasks id=${t.id}`);
        }
    });

    if (result.warnings.length) console.warn('[writing] состав теста:', result.warnings);
    return result;
}

// ==========================================
// 2. СТАРТ
// ==========================================
async function startWritingEngine(testId, testTitle, resume) {
    window.engineType = 'writing';
    writingSessionId++;
    const mySession = writingSessionId;
    if (typeof resetEngineHeaderButtons === 'function') resetEngineHeaderButtons();
    clearInterval(writingTimerInterval);

    currentActiveTestId = testId;
    window.currentActiveTestTitle = testTitle || 'Writing Section';

    sentencesData = [];
    emailData = null;
    academicData = null;
    writingUserAnswers = {};
    writingSentenceAnswers = {};
    currentSentenceIndex = 0;
    writingPhase = 'sentence';

    const resultsView = document.getElementById('results-view');
    if (resultsView) {
        resultsView.classList.add('hidden');
        resultsView.classList.remove('flex');
    }
    document.getElementById('main-interface').classList.add('hidden');
    document.getElementById('exam-engine-view').classList.remove('hidden');
    document.getElementById('exam-engine-view').classList.add('flex');

    document.getElementById('engine-title').innerText = 'Loading Writing Section...';
    document.getElementById('engine-progress').innerText = '';
    setWritingHeader({ review: false, prev: false, next: false });
    document.getElementById('engine-content').innerHTML = `
        <div class="m-auto text-center">
            <div class="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p class="text-slate-600 font-bold text-sm animate-pulse">Building writing workspace...</p>
        </div>
    `;

    let data;
    try {
        data = await fetchAndParseWritingTasks(testId);
    } catch (err) {
        console.error('Writing Engine crash:', err);
        if (!writingSessionAlive(mySession)) return;
        alert('Не удалось загрузить задания Writing.\n\n' + (err.message || err));
        if (typeof exitExamEngine === 'function') exitExamEngine();
        return;
    }
    if (!writingSessionAlive(mySession)) return; // ученица нажала Abort, пока шла загрузка

    sentencesData = data.sentences;
    emailData = data.email;
    academicData = data.academic;

    if (sentencesData.length === 0 && !emailData && !academicData) {
        const msg = 'В этом тесте нет заданий Writing (full_test_writing_tasks / writing_tasks).';
        if (typeof handleEmptySection === 'function') handleEmptySection('Writing', msg);
        else { alert(msg); if (typeof exitExamEngine === 'function') exitExamEngine(); }
        return;
    }

    document.getElementById('engine-title').innerText = `Writing Section — ${window.currentActiveTestTitle}`;

    if (resume && resume.ids) {
        const sameTest = JSON.stringify(resume.ids.s || []) === JSON.stringify(sentencesData.map(q => q.id))
            && (resume.ids.e || null) === (emailData ? emailData.id : null)
            && (resume.ids.a || null) === (academicData ? academicData.id : null);
        if (!sameTest) {
            alert('Состав теста изменился с момента сохранения — секцию придётся начать заново.');
            if (typeof mtClearProgress === 'function') mtClearProgress();
        } else {
            writingUserAnswers = Object.assign({}, resume.texts || {});
            writingSentenceAnswers = Object.assign({}, resume.sentenceAnswers || {});
            currentSentenceIndex = Math.min(Math.max(0, resume.idx || 0), Math.max(0, sentencesData.length - 1));
            const left = resume.time && resume.time > 0 ? resume.time : null;
            if (resume.phase === 'sentence' && sentencesData.length) return initPhaseSentence(resume.slots || {}, left);
            if (resume.phase === 'transition' && resume.next) return showWritingPhaseTransition(resume.next);
            if (resume.phase === 'email' && emailData) return initPhaseEmail(left);
            if (resume.phase === 'academic' && academicData) return initPhaseAcademic(left);
        }
    }

    if (sentencesData.length > 0) initPhaseSentence();
    else if (emailData) initPhaseEmail();
    else initPhaseAcademic();
}

// Видимость кнопок хедера для текущей фазы
function setWritingHeader({ review, prev, next, prevDisabled, nextHtml }) {
    const reviewBtn = document.getElementById('engine-review');
    const prevBtn = document.getElementById('engine-prev');
    const nextBtn = document.getElementById('engine-next');
    if (reviewBtn) {
        if (review) { reviewBtn.classList.remove('hidden'); reviewBtn.classList.add('flex'); }
        else { reviewBtn.classList.add('hidden'); reviewBtn.classList.remove('flex'); }
    }
    if (prevBtn) {
        prevBtn.style.display = prev ? 'flex' : 'none';
        prevBtn.disabled = !!prevDisabled;
    }
    if (nextBtn) {
        nextBtn.style.display = next ? 'flex' : 'none';
        nextBtn.disabled = false;
        if (nextHtml) nextBtn.innerHTML = nextHtml;
    }
    if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

// ==========================================
// 3. ТАЙМЕР ФАЗЫ
// ==========================================
function startWritingPhaseTimer(minutes, onTimeout, secondsOverride) {
    clearInterval(writingTimerInterval);
    const mySession = writingSessionId;
    const timerContainer = document.getElementById('engine-timer-container');
    const display = document.getElementById('engine-timer');
    if (timerContainer) timerContainer.classList.remove('hidden');

    let seconds = secondsOverride ? Math.round(secondsOverride) : Math.round(minutes * 60);
    const update = () => {
        writingSecondsLeft = seconds;
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        if (display) display.textContent = `${m}:${s}`;
    };
    update();

    writingTimerInterval = setInterval(() => {
        if (!writingSessionAlive(mySession)) { clearInterval(writingTimerInterval); return; }
        seconds--;
        update();
        saveWritingProgress();
        if (seconds <= 0) {
            clearInterval(writingTimerInterval);
            onTimeout();
        }
    }, 1000);
}

// ==========================================
// 4. ФАЗА 1: BUILD A SENTENCE
// ==========================================
function getWritingEndPunctuation(q) {
    const sample = (q.sample_answer || '').trim();
    const lastChar = sample.slice(-1);
    return ['.', '?', '!'].includes(lastChar) ? lastChar : '.';
}

function initPhaseSentence(savedSlots, secondsLeft) {
    writingPhase = 'sentence';
    const content = document.getElementById('engine-content');
    content.innerHTML = `<div id="sentencesWrapper" class="w-full h-full flex flex-col flex-1 overflow-y-auto"></div>`;
    const wrapper = document.getElementById('sentencesWrapper');

    sentencesData.forEach((q, index) => {
        let sentenceHTML = '';
        (Array.isArray(q.structure) ? q.structure : []).forEach((item, sIndex) => {
            if (item.type === 'text') {
                sentenceHTML += `<div class="inline-flex shrink-0 px-1.5 py-2 text-sm font-bold text-slate-800">${writingEsc(item.value)}</div>`;
            } else if (item.type === 'slot') {
                sentenceHTML += `<div class="word-slot inline-flex shrink-0 items-center justify-center border-b-2 border-gray-300 mx-1 pb-1 align-bottom" id="wslot-${index}-${sIndex}" data-sentence="${index}"></div>`;
            }
        });

        const bankWords = [...(Array.isArray(q.bank) ? q.bank : [])].sort(() => Math.random() - 0.5);
        const bankHTML = bankWords.map(word =>
            `<div class="writing-word bg-white border border-gray-200 text-slate-700 text-sm font-bold px-4 py-2 rounded-xl shadow-sm cursor-grab select-none hover:border-indigo-300 transition" data-sentence="${index}">${writingEsc(word)}</div>`
        ).join('');

        const div = document.createElement('div');
        div.id = `wsentence-container-${index}`;
        div.className = 'w-full flex-1 flex-col items-center justify-center p-4 md:p-8';
        div.style.display = index === 0 ? 'flex' : 'none';
        div.innerHTML = `
            <div class="w-full max-w-6xl space-y-8 mb-10 bg-gray-50 p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm mt-4 shrink-0">
                <div class="flex items-start space-x-4">
                    <div class="w-10 h-10 bg-blue-50 border rounded-full flex items-center justify-center text-lg shrink-0">${writingEsc(q.avatar_left || '👨‍🏫')}</div>
                    <div class="bg-white border rounded-2xl px-5 py-3 text-sm text-slate-700 mt-1 shadow-sm font-medium">${q.prompt_context || ''}</div>
                </div>
                <div class="flex items-start space-x-4 pt-4 border-t border-dashed border-gray-200">
                    <div class="w-10 h-10 bg-rose-50 border rounded-full flex items-center justify-center text-lg shrink-0">${writingEsc(q.avatar_right || '👩‍🏫')}</div>
                    <div class="flex-1 flex flex-wrap items-end gap-y-3 pt-1 pb-2">${sentenceHTML}<span class="shrink-0 text-2xl font-bold text-slate-400 select-none ml-1 leading-none">${getWritingEndPunctuation(q)}</span></div>
                </div>
            </div>
            <div class="w-full max-w-4xl mx-auto shrink-0 pb-10">
                <div class="flex flex-wrap justify-center gap-2.5 bg-gray-50 border border-gray-200 p-5 rounded-3xl min-h-[80px]" id="wbank-${index}" data-sentence="${index}">${bankHTML}</div>
                <p class="text-[11px] text-slate-400 text-center mt-3">Drag the words into the blanks, or tap a word to place it. Tap a placed word to return it.</p>
            </div>
        `;
        wrapper.appendChild(div);

        // Перетаскивание (если SortableJS загрузился с CDN)
        if (typeof Sortable !== 'undefined') {
            const onEnd = () => { writingDragJustEnded = true; setTimeout(() => { writingDragJustEnded = false; }, 80); saveWritingProgress(); };
            new Sortable(div.querySelector(`#wbank-${index}`), { group: `wshared-${index}`, animation: 150, onEnd });
            div.querySelectorAll(`[id^="wslot-${index}-"]`).forEach(slot => {
                new Sortable(slot, {
                    group: { name: `wshared-${index}`, put: (to) => to.el.children.length === 0 },
                    animation: 150,
                    onEnd
                });
            });
        } else {
            console.warn('[writing] SortableJS не загрузился — работает только размещение по нажатию');
        }

        // Размещение по нажатию: работает и без SortableJS, и на телефоне
        div.addEventListener('click', (e) => {
            if (writingDragJustEnded) return;
            const word = e.target.closest('.writing-word');
            if (!word || !div.contains(word)) return;
            const bank = div.querySelector(`#wbank-${index}`);
            if (word.parentElement === bank) {
                const empty = [...div.querySelectorAll(`[id^="wslot-${index}-"]`)].find(s => s.children.length === 0);
                if (empty) empty.appendChild(word);
            } else {
                bank.appendChild(word);
            }
            saveWritingProgress();
        });

        // Продолжение: расставляем сохранённые слова по ячейкам
        const saved = savedSlots && savedSlots[q.id];
        if (Array.isArray(saved)) {
            const bank = div.querySelector(`#wbank-${index}`);
            const slots = [...div.querySelectorAll(`[id^="wslot-${index}-"]`)];
            saved.forEach((w, k) => {
                if (!w || !slots[k]) return;
                const el = [...bank.querySelectorAll('.writing-word')].find(x => x.textContent.trim() === w);
                if (el) slots[k].appendChild(el);
            });
        }
    });

    startWritingPhaseTimer(WRITING_PHASE_MINUTES.sentence, finishSentencePhase, secondsLeft);
    updateSentenceUI();
}

function updateSentenceUI() {
    writingPhase = 'sentence';
    const wrapper = document.getElementById('sentencesWrapper');
    if (wrapper) wrapper.style.display = 'flex';
    const reviewDiv = document.getElementById('sentenceReviewWrapper');
    if (reviewDiv) reviewDiv.remove();

    document.getElementById('engine-progress').innerText = `Sentence ${currentSentenceIndex + 1} / ${sentencesData.length}`;
    sentencesData.forEach((_, i) => {
        const c = document.getElementById(`wsentence-container-${i}`);
        if (c) c.style.display = i === currentSentenceIndex ? 'flex' : 'none';
    });

    setWritingHeader({
        review: true,
        prev: true,
        prevDisabled: currentSentenceIndex === 0,
        next: true,
        nextHtml: (currentSentenceIndex === sentencesData.length - 1)
            ? 'Next Part <i data-lucide="chevron-right" class="w-4 h-4 ml-1"></i>'
            : 'Next <i data-lucide="chevron-right" class="w-4 h-4 ml-1"></i>'
    });
    saveWritingProgress();
}

function getSentenceAnswer(index) {
    const q = sentencesData[index];
    const parts = [];
    let filled = 0;
    (Array.isArray(q.structure) ? q.structure : []).forEach((item, sIndex) => {
        if (item.type === 'text') parts.push(item.value);
        else if (item.type === 'slot') {
            const s = document.getElementById(`wslot-${index}-${sIndex}`);
            if (s && s.children.length > 0) { parts.push(s.children[0].textContent.trim()); filled++; }
            else parts.push('____');
        }
    });
    if (filled === 0) return ''; // ничего не собрано — пустой ответ, а не строка из подчёркиваний

    let sentence = parts.join(' ')
        .replace(/\s+/g, ' ')
        .replace(/\s+([.?!,;:])/g, '$1')
        .trim();
    if (!['.', '?', '!'].includes(sentence.slice(-1))) sentence += getWritingEndPunctuation(q);
    return sentence;
}

function isSentenceComplete(index) {
    const slots = document.querySelectorAll(`[id^="wslot-${index}-"]`);
    if (slots.length === 0) return false;
    for (const slot of slots) if (slot.children.length === 0) return false;
    return true;
}

function showSentenceReview() {
    if (writingPhase !== 'sentence') return;
    writingPhase = 'sentence-review';
    document.getElementById('engine-progress').innerText = 'Review Sentences';

    const wrapper = document.getElementById('sentencesWrapper');
    if (wrapper) wrapper.style.display = 'none';

    const listHTML = sentencesData.map((s, i) => `
        <div class="flex justify-between items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 transition" onclick="returnToSentence(${i})">
            <div class="flex items-center gap-3">
                <span class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">${i + 1}</span>
                <span class="font-bold text-slate-700">Sentence ${i + 1}</span>
            </div>
            ${isSentenceComplete(i)
                ? '<span class="text-emerald-500 bg-emerald-50 px-3 py-1 rounded-lg font-bold text-xs flex items-center"><i data-lucide="check" class="w-3 h-3 mr-1"></i> Answered</span>'
                : '<span class="text-rose-500 bg-rose-50 px-3 py-1 rounded-lg font-bold text-xs flex items-center"><i data-lucide="alert-circle" class="w-3 h-3 mr-1"></i> Not answered</span>'}
        </div>
    `).join('');

    const reviewDiv = document.createElement('div');
    reviewDiv.id = 'sentenceReviewWrapper';
    reviewDiv.className = 'w-full h-full overflow-y-auto';
    reviewDiv.innerHTML = `
        <div class="p-4 md:p-8 max-w-3xl mx-auto w-full">
            <h2 class="text-2xl font-black text-slate-900 mb-6 text-center">Review Sentences</h2>
            <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">${listHTML}</div>
            <div class="text-center">
                <button onclick="returnToSentence(currentSentenceIndex)" class="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-indigo-600 transition text-sm cursor-pointer">Return</button>
            </div>
        </div>
    `;
    document.getElementById('engine-content').appendChild(reviewDiv);
    setWritingHeader({ review: false, prev: false, next: false });
}

function returnToSentence(i) {
    if (writingPhase !== 'sentence-review' && writingPhase !== 'sentence') return;
    currentSentenceIndex = Math.max(0, Math.min(sentencesData.length - 1, i));
    updateSentenceUI();
}

function collectSentenceAnswers() {
    sentencesData.forEach((q, i) => { writingSentenceAnswers[q.id] = getSentenceAnswer(i); });
}

function finishSentencePhase() {
    if (writingPhase !== 'sentence' && writingPhase !== 'sentence-review') return;
    clearInterval(writingTimerInterval);
    collectSentenceAnswers();

    if (emailData) showWritingPhaseTransition('email');
    else if (academicData) showWritingPhaseTransition('academic');
    else saveWritingAttemptAndFinish();
}

// ==========================================
// ЭКРАН-ПЕРЕХОД перед Email и перед Academic
// ==========================================
function showWritingPhaseTransition(nextPhase) {
    writingPhase = 'transition';
    writingTransitionNext = nextPhase;
    clearInterval(writingTimerInterval);
    setWritingHeader({ review: false, prev: false, next: false });
    const timerContainer = document.getElementById('engine-timer-container');
    if (timerContainer) timerContainer.classList.add('hidden');

    const essayCount = (emailData ? 1 : 0) + (academicData ? 1 : 0);
    const taskNo = nextPhase === 'email' ? 1 : (emailData ? 2 : 1);
    const label = nextPhase === 'email' ? 'Write an Email' : 'Academic Discussion';
    const minutes = WRITING_PHASE_MINUTES[nextPhase];

    document.getElementById('engine-progress').innerText = `Task ${taskNo} of ${essayCount}`;
    document.getElementById('engine-content').innerHTML = `
        <div class="flex-1 flex items-center justify-center p-6 bg-slate-50 w-full h-full">
            <div class="w-full max-w-xl bg-white rounded-3xl p-10 text-center border border-gray-200 shadow-sm">
                <div class="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-indigo-100 shadow-inner">
                    <i data-lucide="pen-tool" class="w-8 h-8"></i>
                </div>
                <p class="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-2">Task ${taskNo} of ${essayCount}</p>
                <h2 class="text-3xl font-black text-slate-900 mb-3">${label}</h2>
                <p class="text-slate-500 mb-8 max-w-md mx-auto text-[15px] leading-relaxed">
                    You will have <b>${minutes} minutes</b> for this task. Once you move on, you cannot return to the previous part.
                </p>
                <button id="writingTransitionBtn" class="inline-flex bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl text-sm font-bold transition shadow-sm items-center cursor-pointer">
                    Start ${label} <i data-lucide="arrow-right" class="w-4 h-4 ml-2"></i>
                </button>
            </div>
        </div>
    `;
    if (typeof lucide !== 'undefined') lucide.createIcons();
    document.getElementById('writingTransitionBtn').onclick = () => {
        if (nextPhase === 'email') initPhaseEmail();
        else initPhaseAcademic();
    };
    saveWritingProgress();
}

// ==========================================
// ФАЗА 2: EMAIL
// ==========================================
function initPhaseEmail(secondsLeft) {
    writingPhase = 'email';
    writingTransitionNext = null;
    const essayCount = academicData ? 2 : 1;
    document.getElementById('engine-progress').innerText = `Task 1 of ${essayCount} (Email)`;
    setWritingHeader({
        review: false, prev: false, next: true,
        nextHtml: academicData
            ? 'Next Task <i data-lucide="chevron-right" class="w-4 h-4 ml-1"></i>'
            : 'Submit Writing <i data-lucide="check" class="w-4 h-4 ml-1"></i>'
    });

    const instr = (Array.isArray(emailData.instructions) ? emailData.instructions : [])
        .map(li => `<li>${li}</li>`).join('');
    document.getElementById('engine-content').innerHTML = `
        <div class="flex flex-col md:flex-row h-full divide-y md:divide-y-0 md:divide-x divide-gray-200 w-full overflow-y-auto md:overflow-hidden">
            <div class="w-full md:w-1/2 p-6 overflow-y-auto bg-white">
                <h2 class="text-xl font-bold mb-4 text-slate-900">${emailData.title || 'Write an Email'}</h2>
                <p class="text-sm text-slate-700 leading-relaxed whitespace-pre-line">${emailData.prompt_context || ''}</p>
                <hr class="my-6 border-gray-100">
                <div class="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                    <h3 class="text-sm font-bold uppercase tracking-wide text-indigo-900">Write an email to ${emailData.meta_to || 'the recipient'}. In your email:</h3>
                    <ul class="list-disc pl-5 text-sm text-indigo-800 mt-3 space-y-1.5">${instr}</ul>
                </div>
            </div>
            <div class="w-full md:w-1/2 p-6 bg-slate-50 flex flex-col">
                <div class="bg-white border border-gray-200 rounded-2xl flex flex-col h-full shadow-sm overflow-hidden min-h-[300px]">
                    <div class="bg-gray-50 border-b border-gray-200 px-5 py-4 text-sm flex justify-between items-center shrink-0">
                        <div>
                            <p><span class="font-bold text-gray-400">To:</span> <span class="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold ml-1">${emailData.meta_to || 'Recipient'}</span></p>
                            <p class="mt-2"><span class="font-bold text-gray-400">Subject:</span> <span class="font-semibold text-slate-700 ml-1">${emailData.meta_subject || ''}</span></p>
                        </div>
                        <span class="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">Words: <span id="emailWordCount">0</span></span>
                    </div>
                    <textarea id="emailResponse" spellcheck="false" autocomplete="off" placeholder="Write your email here..." class="exam-textarea flex-1 p-5 text-sm text-slate-700 w-full h-full resize-none outline-none"></textarea>
                </div>
            </div>
        </div>
    `;
    const ta = document.getElementById('emailResponse');
    ta.value = writingUserAnswers[emailData.id] || '';
    const counter = document.getElementById('emailWordCount');
    counter.textContent = countWords(ta.value);
    ta.addEventListener('input', () => {
        writingUserAnswers[emailData.id] = ta.value;
        counter.textContent = countWords(ta.value);
        saveWritingProgress();
    });
    if (typeof lucide !== 'undefined') lucide.createIcons();
    startWritingPhaseTimer(WRITING_PHASE_MINUTES.email, finishEmailPhase, secondsLeft);
    saveWritingProgress();
}

function finishEmailPhase() {
    if (writingPhase !== 'email') return;
    clearInterval(writingTimerInterval);
    const ta = document.getElementById('emailResponse');
    writingUserAnswers[emailData.id] = ta ? ta.value : (writingUserAnswers[emailData.id] || '');
    if (academicData) showWritingPhaseTransition('academic');
    else saveWritingAttemptAndFinish();
}

// ==========================================
// ФАЗА 3: ACADEMIC DISCUSSION
// ==========================================
function initPhaseAcademic(secondsLeft) {
    writingPhase = 'academic';
    writingTransitionNext = null;
    const essayCount = emailData ? 2 : 1;
    document.getElementById('engine-progress').innerText = `Task ${essayCount} of ${essayCount} (Academic Discussion)`;
    setWritingHeader({
        review: false, prev: false, next: true,
        nextHtml: 'Submit Writing <i data-lucide="check" class="w-4 h-4 ml-1"></i>'
    });

    const peersHTML = (Array.isArray(academicData.peers) ? academicData.peers : []).map(p => `
        <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex gap-4 shrink-0">
            <div class="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-lg shrink-0 border border-indigo-100">${p.avatar || '👤'}</div>
            <div>
                <p class="text-xs font-bold text-slate-400 uppercase mb-1">${p.name || ''}</p>
                <p class="text-sm text-slate-700 leading-relaxed">${p.text || ''}</p>
            </div>
        </div>
    `).join('');

    document.getElementById('engine-content').innerHTML = `
        <div class="flex flex-col md:flex-row h-full divide-y md:divide-y-0 md:divide-x divide-gray-200 w-full overflow-y-auto md:overflow-hidden">
            <div class="w-full md:w-1/2 p-6 overflow-y-auto bg-white">
                <h2 class="text-xl font-bold mb-4 text-slate-900">${academicData.title || 'Academic Discussion'}</h2>
                ${academicData.instruction_box ? `<div class="bg-teal-50 text-teal-900 p-4 rounded-xl text-sm font-medium mb-6 border border-teal-100 leading-relaxed">${academicData.instruction_box}</div>` : ''}
                <div class="bg-gray-50 p-5 rounded-2xl border border-gray-200 flex gap-4 shrink-0">
                    <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shrink-0 border border-gray-200 shadow-sm">${academicData.professor_avatar || '👨‍🏫'}</div>
                    <div>
                        <p class="text-xs font-black text-slate-500 uppercase tracking-wide mb-1.5">${academicData.professor_name || 'Professor'}</p>
                        <div class="text-sm text-slate-800 leading-relaxed font-medium whitespace-pre-line">${academicData.professor_prompt || ''}</div>
                    </div>
                </div>
            </div>
            <div class="w-full md:w-1/2 p-6 bg-slate-50 flex flex-col gap-4 overflow-y-auto">
                <div class="flex flex-col gap-4 shrink-0">${peersHTML}</div>
                <div class="bg-white border border-gray-200 rounded-2xl flex flex-col mt-4 flex-1 min-h-[300px] shadow-sm overflow-hidden">
                    <div class="flex justify-between items-center bg-gray-50 px-4 py-3 border-b border-gray-200 shrink-0">
                        <span class="text-xs font-black text-slate-400 uppercase tracking-wide">Your Response</span>
                        <span class="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">Words: <span id="academicWordCount">0</span></span>
                    </div>
                    <textarea id="academicResponse" spellcheck="false" autocomplete="off" placeholder="Write your contribution here..." class="exam-textarea flex-1 p-5 text-sm text-slate-700 w-full h-full resize-none outline-none"></textarea>
                </div>
            </div>
        </div>
    `;
    const ta = document.getElementById('academicResponse');
    ta.value = writingUserAnswers[academicData.id] || '';
    const counter = document.getElementById('academicWordCount');
    counter.textContent = countWords(ta.value);
    ta.addEventListener('input', () => {
        writingUserAnswers[academicData.id] = ta.value;
        counter.textContent = countWords(ta.value);
        saveWritingProgress();
    });
    if (typeof lucide !== 'undefined') lucide.createIcons();
    startWritingPhaseTimer(WRITING_PHASE_MINUTES.academic, finishAcademicPhase, secondsLeft);
    saveWritingProgress();
}

function finishAcademicPhase() {
    if (writingPhase !== 'academic') return;
    clearInterval(writingTimerInterval);
    const ta = document.getElementById('academicResponse');
    writingUserAnswers[academicData.id] = ta ? ta.value : (writingUserAnswers[academicData.id] || '');
    saveWritingAttemptAndFinish();
}

// ==========================================
// NEXT / BACK — сюда направляет globalNext()/globalPrev() из tests.html
// ==========================================
function handleWritingNextStep() {
    if (writingPhase === 'sentence') {
        if (currentSentenceIndex < sentencesData.length - 1) {
            currentSentenceIndex++;
            updateSentenceUI();
        } else {
            const unanswered = sentencesData.filter((_, i) => !isSentenceComplete(i)).length;
            const msg = unanswered > 0
                ? `You have ${unanswered} unfinished sentence(s). You cannot return to Build a Sentence after this. Continue?`
                : 'You cannot return to Build a Sentence after this. Continue?';
            if (confirm(msg)) finishSentencePhase();
        }
    } else if (writingPhase === 'email') {
        if (confirm('Finish the email now? You cannot return to it.')) finishEmailPhase();
    } else if (writingPhase === 'academic') {
        if (confirm('Submit your Writing section now?')) finishAcademicPhase();
    }
}

function handleWritingPrevStep() {
    if (writingPhase === 'sentence' && currentSentenceIndex > 0) {
        currentSentenceIndex--;
        updateSentenceUI();
    }
}

// ==========================================
// 5. СОХРАНЕНИЕ
// ==========================================
// Sentence проверяется автоматически (точное совпадение с sample_answer),
// Email/Academic — учителем. Поэтому попытка сохраняется как pending_review
// с total_score = null; итог (50% Sentence + 50% эссе) выставляет учитель
// в student-profile.html.
function buildWritingResponses() {
    const rows = [];
    sentencesData.forEach(q => {
        const text = writingSentenceAnswers[q.id] || '';
        rows.push({ task_id: q.id, task_type: 'sentence', essay_text: text, word_count: countWords(text) });
    });
    if (emailData) {
        const text = (writingUserAnswers[emailData.id] || '').trim();
        rows.push({ task_id: emailData.id, task_type: 'email', essay_text: text, word_count: countWords(text) });
    }
    if (academicData) {
        const text = (writingUserAnswers[academicData.id] || '').trim();
        rows.push({ task_id: academicData.id, task_type: 'academic', essay_text: text, word_count: countWords(text) });
    }
    return rows;
}

async function saveWritingAttemptAndFinish() {
    if (writingPhase === 'saving' || writingPhase === 'done') return; // двойной клик / таймер + клик
    writingPhase = 'saving';
    clearInterval(writingTimerInterval);
    const mySession = writingSessionId;

    setWritingHeader({ review: false, prev: false, next: false });
    const timerContainer = document.getElementById('engine-timer-container');
    if (timerContainer) timerContainer.classList.add('hidden');
    document.getElementById('engine-content').innerHTML = `
        <div class="m-auto flex flex-col items-center justify-center text-slate-500">
            <i data-lucide="loader-2" class="w-10 h-10 animate-spin mb-4 text-purple-600"></i>
            <p class="font-bold text-slate-700 text-lg">Saving writing responses...</p>
        </div>
    `;
    if (typeof lucide !== 'undefined') lucide.createIcons();

    const responses = buildWritingResponses();
    const attemptId = mtUuid();
    const attemptRow = {
        id: attemptId,
        test_id: currentActiveTestId,
        user_id: window.currentUser ? window.currentUser.id : null,
        total_score: null,
        status: 'pending_review',
        completed_at: new Date().toISOString()
    };
    const res = await mtSubmit({
        section: 'writing',
        attempt: { table: 'big_mock_writing_attempts', row: attemptRow },
        answers: { table: 'big_mock_writing_answers', rows: responses.map(r => ({ ...r, id: mtUuid(), attempt_id: attemptId })) }
    });
    if (!res.ok) {
        console.error('Error saving Writing attempt:', res.error);
        alert('Нет связи с сервером — ответы Writing сохранены на этом устройстве и отправятся автоматически, когда интернет вернётся.\n\n'
            + (res.error && res.error.message ? res.error.message : res.error));
    }

    if (!writingSessionAlive(mySession)) return; // ушли со страницы во время сохранения
    writingPhase = 'done';

    if (window.fullTestMode && typeof continueFullTestSequence === 'function') { continueFullTestSequence(); return; }

    renderWritingReviewUI({
        attemptRow,
        sentences: sentencesData,
        email: emailData,
        academic: academicData,
        answers: responses
    });
}

// ==========================================
// 6. РЕВЬЮ
// ==========================================
// Строим разбор от СОХРАНЁННЫХ ответов, а не от текущего состава теста:
// если учитель потом поменяет задания в тесте, старая попытка всё равно
// откроется целиком.
async function loadWritingReviewMode(attemptId, testId, testTitle) {
    window.engineType = 'writing';
    writingSessionId++;
    clearInterval(writingTimerInterval);
    currentActiveTestId = testId;
    if (testTitle) window.currentActiveTestTitle = testTitle;

    const mainInterface = document.getElementById('main-interface');
    if (mainInterface) mainInterface.classList.add('hidden');
    const resultsView = document.getElementById('results-view');
    resultsView.className = 'fixed inset-0 z-50 bg-[#f8f9fa] overflow-y-auto';
    resultsView.innerHTML = `<div class="min-h-full flex items-center justify-center text-slate-500"><div class="text-center"><i data-lucide="loader-2" class="w-10 h-10 animate-spin mb-4 text-purple-600 mx-auto"></i><p class="font-bold">Reconstructing Writing attempt...</p></div></div>`;
    if (typeof lucide !== 'undefined') lucide.createIcons();

    try {
        const client = writingDb();
        const { data: attemptRow, error: attErr } = await client
            .from('big_mock_writing_attempts').select('*').eq('id', attemptId).single();
        if (attErr) throw attErr;

        const { data: answers, error: ansErr } = await client
            .from('big_mock_writing_answers').select('*').eq('attempt_id', attemptId);
        if (ansErr) throw ansErr;

        const ids = [...new Set((answers || []).map(a => a.task_id))];
        let tasks = [];
        if (ids.length) {
            const { data: t, error: tErr } = await client.from('writing_tasks').select('*').in('id', ids);
            if (tErr) throw tErr;
            tasks = t || [];
        }
        const byId = {};
        tasks.forEach(t => { t.structure = writingParseJson(t.structure); t.peers = writingParseJson(t.peers); t.instructions = writingParseJson(t.instructions); byId[String(t.id)] = t; });

        // Порядок предложений — как в текущем составе теста, если он есть
        let order = {};
        try {
            const { data: plan } = await client.from('full_test_writing_tasks')
                .select('task_id, order_num').eq('test_id', testId).order('order_num', { ascending: true });
            (plan || []).forEach((p, i) => { order[String(p.task_id)] = i; });
        } catch (e) { /* не критично */ }

        const sorted = [...(answers || [])].sort((a, b) => {
            const oa = order[String(a.task_id)], ob = order[String(b.task_id)];
            if (oa !== undefined && ob !== undefined) return oa - ob;
            if (oa !== undefined) return -1;
            if (ob !== undefined) return 1;
            return String(a.created_at || '').localeCompare(String(b.created_at || ''));
        });

        const sentences = [], answersOut = [];
        let email = null, academic = null;
        sorted.forEach(a => {
            const t = byId[String(a.task_id)] || { id: a.task_id, title: '(задание удалено)' };
            const type = writingNormalizeType(a.task_type || t.type);
            answersOut.push(a);
            if (type === 'sentence') sentences.push(t);
            else if (type === 'email' && !email) email = t;
            else if (type === 'academic' && !academic) academic = t;
        });

        renderWritingReviewUI({ attemptRow, sentences, email, academic, answers: answersOut });
    } catch (err) {
        console.error('Error loading writing review:', err);
        alert('Не удалось открыть разбор Writing.\n\n' + (err.message || err));
        if (typeof exitExamEngine === 'function') exitExamEngine();
    }
}

function renderWritingReviewUI({ attemptRow, sentences, email, academic, answers }) {
    const examView = document.getElementById('exam-engine-view');
    if (examView) { examView.classList.add('hidden'); examView.classList.remove('flex'); }
    const mainInterface = document.getElementById('main-interface');
    if (mainInterface) mainInterface.classList.add('hidden');

    const resultsView = document.getElementById('results-view');
    resultsView.className = 'fixed inset-0 z-50 bg-[#f8f9fa] overflow-y-auto';

    const findAnswer = (taskId) => (answers || []).find(a => String(a.task_id) === String(taskId)) || null;

    let correctCount = 0;
    const sentencesHtml = (sentences || []).map((q, i) => {
        const ans = findAnswer(q.id);
        const userSentence = ans ? (ans.essay_text || '') : '';
        const correct = (q.sample_answer || '').trim();
        const ok = writingIsSentenceCorrect(q, userSentence);
        if (ok) correctCount++;
        return `
            <div class="bg-white p-5 rounded-2xl border ${ok ? 'border-emerald-200' : 'border-rose-200'} shadow-sm mb-4">
                <div class="flex items-center justify-between mb-3">
                    <span class="text-sm font-bold text-slate-400">Sentence ${i + 1}</span>
                    ${ok
                        ? '<span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg uppercase tracking-wide">Correct</span>'
                        : (userSentence
                            ? '<span class="text-[10px] font-bold text-rose-500 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-lg uppercase tracking-wide">Incorrect</span>'
                            : '<span class="text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg uppercase tracking-wide">No answer</span>')}
                </div>
                ${q.prompt_context ? `<p class="text-xs text-slate-500 mb-3">${q.prompt_context}</p>` : ''}
                <p class="text-xs font-bold text-gray-400 uppercase mb-1">Your Answer</p>
                <p class="text-sm ${ok ? 'text-slate-700' : 'text-rose-600'} mb-3">${userSentence ? writingEsc(userSentence) : '—'}</p>
                ${!ok && correct ? `
                    <div class="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <p class="text-[10px] font-bold text-gray-400 uppercase mb-1">Correct Answer</p>
                        <p class="text-sm text-slate-600">${writingEsc(correct)}</p>
                    </div>` : ''}
                ${q.explanation ? `<div class="mt-3 p-3 bg-amber-50 text-amber-900 text-xs rounded-xl border border-amber-100">${q.explanation}</div>` : ''}
            </div>
        `;
    }).join('');

    const renderEssayCard = (taskLabel, task, colorClass, promptHtml) => {
        if (!task) return '';
        const ans = findAnswer(task.id);
        const text = ans ? (ans.essay_text || '') : '';
        const hasScore = ans && ans.score !== null && ans.score !== undefined;
        return `
            <div class="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm mb-8">
                <div class="flex items-center justify-between mb-4 pb-4 border-b border-gray-100 gap-3 flex-wrap">
                    <span class="text-xs font-bold uppercase tracking-wider ${colorClass} px-3 py-1 rounded-lg">${taskLabel}</span>
                    <div class="flex items-center gap-3">
                        <span class="text-xs font-extrabold text-slate-500">Words: ${countWords(text)}</span>
                        ${hasScore
                            ? `<span class="text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">Score: ${Number(ans.score).toFixed(1)}</span>`
                            : '<span class="text-xs font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-lg">Pending Review</span>'}
                    </div>
                </div>
                <h3 class="text-lg font-bold text-slate-900 mb-3">${task.title || taskLabel}</h3>
                ${promptHtml ? `<div class="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-sm text-slate-700 mb-6">${promptHtml}</div>` : ''}
                <h4 class="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Your Response</h4>
                <div class="p-6 bg-white border border-slate-200 rounded-2xl text-slate-800 leading-relaxed whitespace-pre-wrap text-sm">${text ? writingEsc(text) : '<span class="text-slate-400 italic">No response submitted.</span>'}</div>
                ${ans && ans.feedback ? `
                    <div class="mt-5 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                        <p class="text-[10px] font-bold text-indigo-500 uppercase tracking-wider mb-1.5">Teacher's Feedback</p>
                        <p class="text-sm text-indigo-900 leading-relaxed whitespace-pre-wrap">${writingEsc(ans.feedback)}</p>
                    </div>` : ''}
            </div>
        `;
    };

    const sentenceTotal = (sentences || []).length;
    const reviewed = attemptRow && attemptRow.status === 'reviewed' && attemptRow.total_score !== null && attemptRow.total_score !== undefined;

    const headerStats = `
        ${sentenceTotal > 0 ? `
            <div class="px-8 text-center ${email || academic ? 'border-r border-gray-100' : ''}">
                <div class="text-3xl font-bold text-slate-700 mb-1 mt-1">${correctCount} <span class="text-gray-300 text-xl">/</span> <span class="text-gray-400 text-2xl">${sentenceTotal}</span></div>
                <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Build a Sentence</div>
            </div>` : ''}
        <div class="px-8 text-center">
            ${reviewed
                ? `<div class="text-4xl font-extrabold text-emerald-600 mb-1">${Number(attemptRow.total_score).toFixed(1)}</div><div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Teacher Score</div>`
                : '<div class="text-lg font-bold text-amber-600 mt-2">Pending</div><div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Teacher Review</div>'}
        </div>
    `;

    const emailPrompt = email ? `${email.prompt_context || ''}${Array.isArray(email.instructions) && email.instructions.length ? `<ul class="list-disc pl-5 mt-3 space-y-1">${email.instructions.map(i => `<li>${i}</li>`).join('')}</ul>` : ''}` : '';
    const academicPrompt = academic ? (academic.professor_prompt || '') : '';

    resultsView.innerHTML = `
        <div class="w-full min-h-full p-6 md:p-10 bg-[#f8f9fa]">
            <div class="max-w-5xl mx-auto">
                <div class="bg-white rounded-[2rem] p-8 border border-purple-100 shadow-sm text-center mb-10 max-w-2xl mx-auto">
                    <div class="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-inner">✍️</div>
                    <h2 class="text-2xl font-bold text-slate-900 mb-2">Writing Section</h2>
                    <p class="text-xs text-slate-400 mb-6 font-medium">Build a Sentence is checked automatically. Email and Academic Discussion are graded by your teacher.</p>
                    <div class="flex justify-center items-center mb-8">${headerStats}</div>
                    <div class="flex justify-center space-x-3">
                        <button onclick="startWritingEngine(currentActiveTestId, document.getElementById('dynamic-test-title').innerText)" class="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-purple-600 transition shadow-md text-sm flex items-center cursor-pointer">
                            <i data-lucide="rotate-ccw" class="w-4 h-4 mr-2"></i> Retake Writing
                        </button>
                        <button onclick="exitExamEngine()" class="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition shadow-sm text-sm cursor-pointer">
                            Back to Dashboard
                        </button>
                    </div>
                </div>

                ${sentenceTotal > 0 ? `<h3 class="text-lg font-bold text-slate-800 mb-4">Part 1: Build a Sentence</h3><div class="mb-8">${sentencesHtml}</div>` : ''}
                ${renderEssayCard('Email', email, 'text-indigo-600 bg-indigo-50', emailPrompt)}
                ${renderEssayCard('Academic Discussion', academic, 'text-teal-600 bg-teal-50', academicPrompt)}
            </div>
        </div>
    `;
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// ==========================================
// 7. ЭКСПОРТ
// ==========================================
window.startWritingEngine = startWritingEngine;
window.loadWritingReviewMode = loadWritingReviewMode;
window.handleWritingNextStep = handleWritingNextStep;
window.handleWritingPrevStep = handleWritingPrevStep;
window.nextWritingTask = handleWritingNextStep;   // старые имена — на всякий случай
window.prevWritingTask = handleWritingPrevStep;
window.showSentenceReview = showSentenceReview;
window.returnToSentence = returnToSentence;
window.fetchAndParseWritingTasks = fetchAndParseWritingTasks;
