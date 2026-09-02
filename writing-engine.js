// ==========================================
// 🚨 МОБИЛЬНЫЙ ОТЛАДЧИК (ЛОКАЛИЗАТОР ОШИБОК)
// ==========================================
window.onerror = function (message, source, lineno, colno, error) {
    const errorDiv = document.createElement('div');
    errorDiv.style.position = 'fixed';
    errorDiv.style.bottom = '10px';
    errorDiv.style.left = '10px';
    errorDiv.style.right = '10px';
    errorDiv.style.backgroundColor = '#fee2e2';
    errorDiv.style.border = '2px solid #ef4444';
    errorDiv.style.color = '#991b1b';
    errorDiv.style.padding = '15px';
    errorDiv.style.borderRadius = '12px';
    errorDiv.style.zIndex = '999999';
    errorDiv.style.fontFamily = 'monospace';
    errorDiv.style.fontSize = '11px';
    errorDiv.style.maxHeight = '200px';
    errorDiv.style.overflowY = 'auto';
    errorDiv.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
    errorDiv.innerHTML = `<strong>JS Error:</strong> ${message}<br><small>File: ${source} (Line: ${lineno}:${colno})</small>`;
    document.body.appendChild(errorDiv);
    return false;
};

// ==========================================
// ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ WRITING (формат TOEFL 2026:
// Build a Sentence + Email + Academic Discussion, 23 мин суммарно)
// ==========================================
function getSupabaseClient() {
    return supabaseClient;
}

let sentencesData = [];
let emailData = null;
let academicData = null;

let writingPhase = 'sentence'; // 'sentence' | 'transition' | 'email' | 'academic'
let currentSentenceIndex = 0;
let writingUserAnswers = {};      // { taskId: "text essay" } — для email/academic
let userWritingResponses = [];    // накопленные { task_id, task_type, response_content } для сохранения

let writingTimerInterval = null;

// ==========================================
// 1. ЗАГРУЗКА ЗАДАНИЙ СЕКЦИИ WRITING
// ==========================================
// Достаёт для теста набор writing-заданий (sentence[] + email + academic) из
// связки full_test_writing_tasks -> writing_tasks. Использует ТЕ ЖЕ строки
// writing_tasks (type: 'sentence'/'email'/'academic', structure/bank/sample_answer
// и т.д.), что и mini-mock-writing.html — так что данные полностью переиспользуемы.
async function fetchAndParseWritingTasks(testId) {
    const empty = { sentences: [], email: null, academic: null };
    const client = getSupabaseClient();
    if (!client) return empty;

    const { data: plan, error: planErr } = await client
        .from('full_test_writing_tasks')
        .select('*')
        .eq('test_id', testId)
        .order('order_num', { ascending: true });

    if (planErr || !plan || plan.length === 0) return empty;

    const taskIds = plan.map(p => p.task_id);
    const { data: tasksData, error: tasksErr } = await client
        .from('writing_tasks')
        .select('*')
        .in('id', taskIds);

    if (tasksErr || !tasksData) return empty;

    const tasksById = {};
    tasksData.forEach(t => {
        if (typeof t.structure === 'string') { try { t.structure = JSON.parse(t.structure); } catch (e) {} }
        if (typeof t.bank === 'string') { try { t.bank = JSON.parse(t.bank); } catch (e) {} }
        if (typeof t.instructions === 'string') { try { t.instructions = JSON.parse(t.instructions); } catch (e) {} }
        if (typeof t.peers === 'string') { try { t.peers = JSON.parse(t.peers); } catch (e) {} }
        tasksById[t.id] = t;
    });

    const result = { sentences: [], email: null, academic: null };
    plan.forEach(p => {
        const t = tasksById[p.task_id];
        if (!t) return;
        const type = t.type || p.task_type;
        if (type === 'sentence') result.sentences.push(t);
        else if (type === 'email') result.email = t;
        else if (type === 'academic') result.academic = t;
    });

    return result;
}

// ==========================================
// 2. СТАРТ ДВИЖКА WRITING
// ==========================================
async function startWritingEngine(testId, testTitle) {
    window.engineType = 'writing';
    if (typeof resetEngineHeaderButtons === 'function') resetEngineHeaderButtons();
    window.currentActiveTestId = testId;
    window.currentActiveTestTitle = testTitle || 'Writing Section';
    writingUserAnswers = {};
    userWritingResponses = [];
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

    document.getElementById('engine-title').innerText = `Loading Writing Section...`;
    document.getElementById('engine-content').innerHTML = `
        <div class="m-auto text-center">
            <div class="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p class="text-slate-600 font-bold text-sm animate-pulse">Building writing workspace...</p>
        </div>
    `;

    try {
        const data = await fetchAndParseWritingTasks(testId);
        sentencesData = data.sentences;
        emailData = data.email;
        academicData = data.academic;

        if (sentencesData.length === 0 && !emailData && !academicData) {
            alert("This Writing section has no tasks configured in Supabase (full_test_writing_tasks / writing_tasks)!");
            if (typeof exitExamEngine === 'function') exitExamEngine();
            return;
        }

        document.getElementById('engine-title').innerText = `Writing Section — ${window.currentActiveTestTitle}`;

        if (sentencesData.length > 0) {
            initPhaseSentence();
        } else if (emailData) {
            initPhaseEmail();
        } else if (academicData) {
            initPhaseAcademic();
        }

    } catch (err) {
        console.error("Writing Engine crash:", err);
        alert("Error loading Writing tasks structure.");
        if (typeof exitExamEngine === 'function') exitExamEngine();
    }
}

// ==========================================
// 3. СЧЁТ СЛОВ (как на реальном TOEFL / в стандартных редакторах:
// без исключения артиклей, без разрыва слов с апострофом)
// ==========================================
function countWords(text) {
    const trimmed = (text || '').trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
}

function setupWordCounter(textareaId, counterId) {
    const textarea = document.getElementById(textareaId);
    const counter = document.getElementById(counterId);
    if (textarea && counter) {
        textarea.addEventListener('input', () => { counter.textContent = countWords(textarea.value); });
    }
}

// ==========================================
// 4. ТАЙМЕР ФАЗЫ (у каждой из 3 фаз своё время: 6 / 7 / 10 мин)
// ==========================================
function startWritingPhaseTimer(minutes, timeoutCallback) {
    clearInterval(writingTimerInterval);
    const timerContainer = document.getElementById('engine-timer-container');
    const display = document.getElementById('engine-timer');
    if (timerContainer) timerContainer.classList.remove('hidden');

    let seconds = minutes * 60;

    const update = () => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        if (display) display.textContent = `${m}:${s}`;
    };
    update();

    writingTimerInterval = setInterval(() => {
        seconds--;
        update();
        if (seconds <= 0) {
            clearInterval(writingTimerInterval);
            timeoutCallback();
        }
    }, 1000);
}

// ==========================================
// 5. ФАЗА 1: BUILD A SENTENCE
// ==========================================
function initPhaseSentence() {
    writingPhase = 'sentence';

    let wrapper = document.getElementById('sentencesWrapper');

    if (!wrapper) {
        document.getElementById('engine-content').innerHTML = `<div id="sentencesWrapper" class="w-full h-full flex flex-col flex-1 overflow-y-auto"></div>`;
        wrapper = document.getElementById('sentencesWrapper');

        sentencesData.forEach((q, index) => {
            let sentenceHTML = '';
            (q.structure || []).forEach((item, sIndex) => {
                if (item.type === 'text') {
                    sentenceHTML += `<div class="inline-flex shrink-0 px-1.5 py-2 text-sm font-bold text-slate-800 whitespace-nowrap">${item.value}</div>`;
                } else if (item.type === 'slot') {
                    sentenceHTML += `<div class="word-slot inline-flex shrink-0 items-center justify-center border-b-2 border-gray-300 mx-1 pb-1 align-bottom" id="wslot-${index}-${sIndex}"></div>`;
                }
            });

            const div = document.createElement('div');
            div.id = `wsentence-container-${index}`;
            div.className = `w-full flex-1 flex flex-col items-center justify-center p-4 md:p-8 overflow-y-auto`;
            div.style.display = index === 0 ? 'flex' : 'none';

            let bankWords = [...(q.bank || [])].sort(() => Math.random() - 0.5);
            let bankHTML = bankWords.map(word => `<div class="bg-white border border-gray-200 text-slate-700 text-sm font-bold px-4 py-2 rounded-xl shadow-sm cursor-grab select-none hover:border-indigo-300 transition">${word}</div>`).join('');

            div.innerHTML = `
                <div class="w-full max-w-6xl space-y-8 mb-12 bg-gray-50 p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm mt-4 shrink-0">
                    <div class="flex items-start space-x-4">
                        <div class="w-10 h-10 bg-blue-50 border rounded-full flex items-center justify-center text-lg shrink-0">${q.avatar_left || '👨‍🏫'}</div>
                        <div class="bg-white border rounded-2xl px-5 py-3 text-sm text-slate-700 mt-1 shadow-sm font-medium">${q.prompt_context || ''}</div>
                    </div>
                    <div class="flex items-start space-x-4 pt-4 border-t border-dashed border-gray-200">
                        <div class="w-10 h-10 bg-rose-50 border rounded-full flex items-center justify-center text-lg shrink-0">${q.avatar_right || '👩‍🏫'}</div>
                        <div class="flex-1 flex flex-wrap items-end gap-y-3 pt-1 pb-2">${sentenceHTML}<span class="shrink-0 text-2xl font-bold text-slate-400 select-none ml-1 align-bottom leading-none">${getWritingEndPunctuation(q)}</span></div>
                    </div>
                </div>
                <div class="w-full max-w-3xl mx-auto shrink-0 pb-10">
                    <div class="flex flex-wrap justify-center gap-2.5 bg-gray-50 border border-gray-200 p-5 rounded-3xl min-h-[80px]" id="wbank-${index}">${bankHTML}</div>
                </div>
            `;
            wrapper.appendChild(div);

            new Sortable(div.querySelector(`#wbank-${index}`), { group: `wshared-${index}`, animation: 150 });
            div.querySelectorAll(`[id^="wslot-${index}-"]`).forEach(slot => {
                new Sortable(slot, {
                    group: {
                        name: `wshared-${index}`,
                        put: function (to) { return to.el.children.length === 0; }
                    },
                    animation: 150
                });
            });
        });

        startWritingPhaseTimer(6, finishSentencePhase);
    }

    wrapper.style.display = 'flex';
    updateSentenceUI();
}

function updateSentenceUI() {
    document.getElementById('engine-progress').innerText = `Sentence ${currentSentenceIndex + 1} / ${sentencesData.length}`;

    sentencesData.forEach((_, i) => {
        const c = document.getElementById(`wsentence-container-${i}`);
        if (c) c.style.display = i === currentSentenceIndex ? 'flex' : 'none';
    });

    // Review — виден в Build a Sentence; Back есть, но неактивен на первом
    // предложении (возвращаться некуда), активен на остальных.
    const reviewBtn = document.getElementById('engine-review');
    const prevBtn = document.getElementById('engine-prev');
    const nextBtn = document.getElementById('engine-next');
    if (reviewBtn) reviewBtn.classList.remove('hidden');
    if (prevBtn) {
        prevBtn.style.display = 'flex';
        prevBtn.disabled = (currentSentenceIndex === 0);
    }
    if (nextBtn) {
        nextBtn.style.display = 'flex';
        nextBtn.disabled = false;
        nextBtn.innerHTML = (currentSentenceIndex === sentencesData.length - 1)
            ? 'Next Part <i data-lucide="chevron-right" class="w-4 h-4 ml-1"></i>'
            : 'Next <i data-lucide="chevron-right" class="w-4 h-4 ml-1"></i>';
    }
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Определяет верный финальный знак препинания на основе sample_answer задания
// (может быть "." или "?" или "!"), вместо того чтобы всегда считать, что это точка.
function getWritingEndPunctuation(q) {
    const sample = (q.sample_answer || '').trim();
    const lastChar = sample.slice(-1);
    return ['.', '?', '!'].includes(lastChar) ? lastChar : '.';
}

function getSentenceAnswer(index) {
    const q = sentencesData[index];
    let parts = [];
    (q.structure || []).forEach((item, sIndex) => {
        if (item.type === 'text') parts.push(item.value);
        else if (item.type === 'slot') {
            const s = document.getElementById(`wslot-${index}-${sIndex}`);
            parts.push(s && s.children.length > 0 ? s.children[0].textContent.trim() : "____");
        }
    });
    let sentence = parts.join(" ")
        .replace(/\s+/g, " ")
        .replace(/\s+([.?!])/g, "$1")
        .trim();

    if (!['.', '?', '!'].includes(sentence.slice(-1))) {
        sentence += getWritingEndPunctuation(q);
    }
    return sentence;
}

function isSentenceComplete(index) {
    const slots = document.querySelectorAll(`[id^="wslot-${index}-"]`);
    for (let slot of slots) {
        if (slot.children.length === 0) return false;
    }
    return true;
}

function showSentenceReview() {
    writingPhase = 'sentence-review';
    document.getElementById('engine-progress').innerText = 'Review Sentences';

    const wrapper = document.getElementById('sentencesWrapper');
    if (wrapper) wrapper.style.display = 'none';

    let reviewDiv = document.getElementById('sentenceReviewWrapper');
    if (!reviewDiv) {
        reviewDiv = document.createElement('div');
        reviewDiv.id = 'sentenceReviewWrapper';
        reviewDiv.className = 'p-4 md:p-8 max-w-3xl mx-auto w-full h-full flex flex-col flex-1 overflow-y-auto';
        document.getElementById('engine-content').appendChild(reviewDiv);
    }

    let listHTML = sentencesData.map((s, i) => `
        <div class="flex justify-between items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 transition" onclick="returnToSentence(${i})">
            <div class="flex items-center gap-3">
                <span class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">${i + 1}</span>
                <span class="font-bold text-slate-700">Sentence ${i + 1}</span>
            </div>
            ${isSentenceComplete(i)
                ? `<span class="text-emerald-500 bg-emerald-50 px-3 py-1 rounded-lg font-bold text-xs flex items-center"><i data-lucide="check" class="w-3 h-3 mr-1"></i> Complete</span>`
                : `<span class="text-rose-500 bg-rose-50 px-3 py-1 rounded-lg font-bold text-xs flex items-center"><i data-lucide="alert-circle" class="w-3 h-3 mr-1"></i> Incomplete</span>`}
        </div>
    `).join('');

    reviewDiv.innerHTML = `
        <h2 class="text-2xl font-black text-slate-900 mb-6 text-center">Section 1 Review</h2>
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex-1 shrink-0">
            ${listHTML}
        </div>
    `;
    reviewDiv.style.display = 'flex';

    const prevBtn = document.getElementById('engine-prev');
    const nextBtn = document.getElementById('engine-next');
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) {
        nextBtn.style.display = 'flex';
        nextBtn.innerHTML = 'Next Part <i data-lucide="chevron-right" class="w-4 h-4 ml-1"></i>';
    }

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function returnToSentence(i) {
    currentSentenceIndex = i;
    writingPhase = 'sentence';
    const reviewDiv = document.getElementById('sentenceReviewWrapper');
    const wrapper = document.getElementById('sentencesWrapper');
    if (reviewDiv) reviewDiv.style.display = 'none';
    if (wrapper) wrapper.style.display = 'flex';
    updateSentenceUI();
}

async function finishSentencePhase() {
    sentencesData.forEach((q, i) => {
        userWritingResponses.push({
            task_id: q.id,
            task_type: 'sentence',
            response_content: getSentenceAnswer(i)
        });
    });
    if (emailData || academicData) {
        showWritingPhaseTransition();
    } else {
        saveWritingAttemptAndFinish();
    }
}

// ==========================================
// ЭКРАН-ПЕРЕХОД МЕЖДУ ЧАСТЯМИ
// ==========================================
function showWritingPhaseTransition() {
    writingPhase = 'transition';

    const reviewBtn = document.getElementById('engine-review');
    const prevBtn = document.getElementById('engine-prev');
    const nextBtn = document.getElementById('engine-next');
    const timerContainer = document.getElementById('engine-timer-container');
    if (reviewBtn) reviewBtn.classList.add('hidden');
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    if (timerContainer) timerContainer.classList.add('hidden');
    clearInterval(writingTimerInterval);

    document.getElementById('engine-progress').innerText = 'Section Transition';

    document.getElementById('engine-content').innerHTML = `
        <div class="flex-1 flex items-center justify-center p-6 bg-slate-50 w-full h-full">
            <div class="w-full max-w-xl bg-white rounded-3xl p-10 text-center border border-gray-200 shadow-sm">
                <div class="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-indigo-100 shadow-inner">
                    <i data-lucide="pen-tool" class="w-8 h-8"></i>
                </div>
                <h2 class="text-3xl font-black text-slate-900 mb-3">Email Task</h2>
                <p class="text-slate-500 mb-8 max-w-md mx-auto text-[15px] leading-relaxed">
                    You have successfully completed the <b>Sentence Building</b> tasks. <br><br>
                    Next, you will write an <b>Email</b> response. This task has its own time limit.
                </p>
                <button onclick="startWritingTasksAfterTransition()" class="inline-flex bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl text-sm font-bold transition shadow-sm items-center cursor-pointer">
                    Start Email Task <i data-lucide="arrow-right" class="w-4 h-4 ml-2"></i>
                </button>
            </div>
        </div>
    `;
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function startWritingTasksAfterTransition() {
    const prevBtn = document.getElementById('engine-prev');
    const nextBtn = document.getElementById('engine-next');
    if (prevBtn) prevBtn.style.display = 'flex';
    if (nextBtn) nextBtn.style.display = 'flex';

    if (emailData) initPhaseEmail();
    else if (academicData) initPhaseAcademic();
    else saveWritingAttemptAndFinish();
}

// ==========================================
// ФАЗА 2: EMAIL
// ==========================================
function initPhaseEmail() {
    writingPhase = 'email';

    const reviewBtn = document.getElementById('engine-review');
    const prevBtn = document.getElementById('engine-prev');
    const nextBtn = document.getElementById('engine-next');
    if (reviewBtn) reviewBtn.classList.add('hidden');
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) {
        nextBtn.style.display = 'flex';
        nextBtn.disabled = false;
        nextBtn.innerHTML = 'Next Task <i data-lucide="chevron-right" class="w-4 h-4 ml-1"></i>';
    }

    document.getElementById('engine-progress').innerText = academicData ? 'Task 1 of 2 (Email)' : 'Email';

    let instr = (emailData.instructions || []).map(li => `<li>${li}</li>`).join('');
    document.getElementById('engine-content').innerHTML = `
        <div class="flex flex-col md:flex-row h-full divide-y md:divide-y-0 md:divide-x divide-gray-200 w-full overflow-y-auto md:overflow-hidden">
            <div class="w-full md:w-1/2 p-6 overflow-y-auto bg-white">
                <h2 class="text-xl font-bold mb-4 text-slate-900">${emailData.title || 'Email Writing'}</h2>
                <p class="text-sm text-slate-700 leading-relaxed">${emailData.prompt_context || ''}</p>
                <hr class="my-6 border-gray-100">
                <div class="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                    <h3 class="text-sm font-bold uppercase tracking-wide text-indigo-900">Write an email to ${emailData.meta_to || 'Recipient'}. In the email:</h3>
                    <ul class="list-disc pl-5 text-sm text-indigo-800 mt-3 space-y-1.5">${instr}</ul>
                </div>
            </div>
            <div class="w-full md:w-1/2 p-6 bg-slate-50 flex flex-col">
                <div class="bg-white border border-gray-200 rounded-2xl flex flex-col h-full shadow-sm overflow-hidden min-h-[300px]">
                    <div class="bg-gray-50 border-b border-gray-200 px-5 py-4 text-sm flex justify-between items-center shrink-0">
                        <div>
                            <p><span class="font-bold text-gray-400">To:</span> <span class="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold ml-1">${emailData.meta_to || 'Recipient'}</span></p>
                            <p class="mt-2"><span class="font-bold text-gray-400">Subject:</span> <span class="font-semibold text-slate-700 ml-1">${emailData.meta_subject || 'Topic'}</span></p>
                        </div>
                        <span class="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">Words: <span id="emailWordCount">0</span></span>
                    </div>
                    <textarea id="emailResponse" placeholder="Write your email here..." class="exam-textarea flex-1 p-5 text-sm text-slate-700 w-full h-full resize-none outline-none">${writingUserAnswers[emailData.id] || ''}</textarea>
                </div>
            </div>
        </div>
    `;
    setupWordCounter('emailResponse', 'emailWordCount');
    document.getElementById('emailWordCount').textContent = countWords(writingUserAnswers[emailData.id] || '');
    if (typeof lucide !== 'undefined') lucide.createIcons();
    startWritingPhaseTimer(7, finishEmailPhase);
}

async function finishEmailPhase() {
    const ans = document.getElementById('emailResponse') ? document.getElementById('emailResponse').value.trim() : "";
    writingUserAnswers[emailData.id] = ans;
    userWritingResponses.push({
        task_id: emailData.id,
        task_type: 'email',
        response_content: ans
    });

    if (academicData) {
        showEmailToAcademicTransition();
    } else {
        saveWritingAttemptAndFinish();
    }
}

// Заставка перед Academic Discussion (после Email)
function showEmailToAcademicTransition() {
    writingPhase = 'transition';

    const prevBtn = document.getElementById('engine-prev');
    const nextBtn = document.getElementById('engine-next');
    const timerContainer = document.getElementById('engine-timer-container');
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    if (timerContainer) timerContainer.classList.add('hidden');
    clearInterval(writingTimerInterval);

    document.getElementById('engine-progress').innerText = 'Section Transition';

    document.getElementById('engine-content').innerHTML = `
        <div class="flex-1 flex items-center justify-center p-6 bg-slate-50 w-full h-full">
            <div class="w-full max-w-xl bg-white rounded-3xl p-10 text-center border border-gray-200 shadow-sm">
                <div class="w-16 h-16 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-teal-100 shadow-inner">
                    <i data-lucide="users" class="w-8 h-8"></i>
                </div>
                <h2 class="text-3xl font-black text-slate-900 mb-3">Academic Discussion</h2>
                <p class="text-slate-500 mb-8 max-w-md mx-auto text-[15px] leading-relaxed">
                    You have completed the <b>Email</b> task. <br><br>
                    Next, you will read a professor's post and classmates' replies, then write your own contribution to the discussion.
                </p>
                <button onclick="startAcademicAfterTransition()" class="inline-flex bg-teal-600 hover:bg-teal-700 text-white px-8 py-3.5 rounded-xl text-sm font-bold transition shadow-sm items-center cursor-pointer">
                    Start Academic Discussion <i data-lucide="arrow-right" class="w-4 h-4 ml-2"></i>
                </button>
            </div>
        </div>
    `;
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function startAcademicAfterTransition() {
    const prevBtn = document.getElementById('engine-prev');
    const nextBtn = document.getElementById('engine-next');
    if (prevBtn) prevBtn.style.display = 'flex';
    if (nextBtn) nextBtn.style.display = 'flex';
    initPhaseAcademic();
}

// ==========================================
// ФАЗА 3: ACADEMIC DISCUSSION
// ==========================================
function initPhaseAcademic() {
    writingPhase = 'academic';

    const prevBtn = document.getElementById('engine-prev');
    const nextBtn = document.getElementById('engine-next');
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) {
        nextBtn.style.display = 'flex';
        nextBtn.disabled = false;
        nextBtn.innerHTML = 'Submit Writing <i data-lucide="check" class="w-4 h-4 ml-1"></i>';
    }

    document.getElementById('engine-progress').innerText = emailData ? 'Task 2 of 2 (Academic Discussion)' : 'Academic Discussion';

    let peersHTML = (academicData.peers || []).map(p => `
        <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex gap-4 shrink-0">
            <div class="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-lg shrink-0 border border-indigo-100">${p.avatar || '👤'}</div>
            <div>
                <p class="text-xs font-bold text-slate-400 uppercase mb-1">${p.name}</p>
                <p class="text-sm text-slate-700 leading-relaxed">${p.text}</p>
            </div>
        </div>
    `).join('');

    document.getElementById('engine-content').innerHTML = `
        <div class="flex flex-col md:flex-row h-full divide-y md:divide-y-0 md:divide-x divide-gray-200 w-full overflow-y-auto md:overflow-hidden">
            <div class="w-full md:w-1/2 p-6 overflow-y-auto bg-white">
                <h2 class="text-xl font-bold mb-4 text-slate-900">${academicData.title || 'Academic Discussion'}</h2>
                <div class="bg-teal-50 text-teal-900 p-4 rounded-xl text-sm font-medium mb-6 border border-teal-100 leading-relaxed">
                    ${academicData.instruction_box || ''}
                </div>
                <div class="bg-gray-50 p-5 rounded-2xl border border-gray-200 flex gap-4 shrink-0">
                    <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shrink-0 border border-gray-200 shadow-sm">${academicData.professor_avatar || '👨‍🏫'}</div>
                    <div>
                        <p class="text-xs font-black text-slate-500 uppercase tracking-wide mb-1.5">${academicData.professor_name || 'Professor'}</p>
                        <div class="text-sm text-slate-800 leading-relaxed font-medium">${academicData.professor_prompt || ''}</div>
                    </div>
                </div>
            </div>
            <div class="w-full md:w-1/2 p-6 bg-slate-50 flex flex-col gap-4 overflow-y-auto">
                <div class="flex flex-col gap-4 shrink-0">
                    ${peersHTML}
                </div>
                <div class="bg-white border border-gray-200 rounded-2xl flex flex-col mt-4 flex-1 min-h-[300px] shadow-sm overflow-hidden">
                    <div class="flex justify-between items-center bg-gray-50 px-4 py-3 border-b border-gray-200 shrink-0">
                        <span class="text-xs font-black text-slate-400 uppercase tracking-wide">TOEFL Editor</span>
                        <span class="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">Words: <span id="academicWordCount">0</span></span>
                    </div>
                    <textarea id="academicResponse" placeholder="Write your contribution here..." class="exam-textarea flex-1 p-5 text-sm text-slate-700 w-full h-full resize-none outline-none">${writingUserAnswers[academicData.id] || ''}</textarea>
                </div>
            </div>
        </div>
    `;
    setupWordCounter('academicResponse', 'academicWordCount');
    document.getElementById('academicWordCount').textContent = countWords(writingUserAnswers[academicData.id] || '');
    if (typeof lucide !== 'undefined') lucide.createIcons();
    startWritingPhaseTimer(10, saveWritingAttemptAndFinish);
}

// ==========================================
// NEXT / PREV — единая точка входа для globalNext()/globalPrev() из tests.html
// ==========================================
function nextWritingTask() {
    if (writingPhase === 'sentence') {
        if (currentSentenceIndex < sentencesData.length - 1) {
            currentSentenceIndex++;
            updateSentenceUI();
        } else {
            finishSentencePhase();
        }
    } else if (writingPhase === 'sentence-review') {
        finishSentencePhase();
    } else if (writingPhase === 'email') {
        finishEmailPhase();
    } else if (writingPhase === 'academic') {
        saveWritingAttemptAndFinish();
    }
    // 'transition' — кнопки скрыты, обрабатывать нечего
}

function prevWritingTask() {
    if (writingPhase === 'sentence' && currentSentenceIndex > 0) {
        currentSentenceIndex--;
        updateSentenceUI();
    } else if (writingPhase === 'sentence-review') {
        returnToSentence(currentSentenceIndex);
    }
}

// ==========================================
// 6. СОХРАНЕНИЕ ПОПЫТКИ
// ==========================================
// Как и остальные "живые" (не-mock) задания на платформе: Sentence считается
// автоматически (точное совпадение), Email/Academic — по паттерну "Pending
// Teacher Review": сохраняем ответы, итоговый балл выставляет учитель позже.
async function saveWritingAttemptAndFinish() {
    if (academicData) {
        const ans = document.getElementById('academicResponse') ? document.getElementById('academicResponse').value.trim() : "";
        writingUserAnswers[academicData.id] = ans;
        userWritingResponses.push({
            task_id: academicData.id,
            task_type: 'academic',
            response_content: ans
        });
    }

    clearInterval(writingTimerInterval);
    const client = getSupabaseClient();

    const contentDiv = document.getElementById('engine-content');
    const nextBtn = document.getElementById('engine-next');
    const prevBtn = document.getElementById('engine-prev');
    if (nextBtn) nextBtn.style.display = 'none';
    if (prevBtn) prevBtn.style.display = 'none';

    contentDiv.innerHTML = `
        <div class="m-auto flex flex-col items-center justify-center text-slate-500">
            <i data-lucide="loader-2" class="w-10 h-10 animate-spin mb-4 text-purple-600"></i>
            <p class="font-bold text-slate-700 text-lg">Saving writing responses...</p>
        </div>
    `;
    if (typeof lucide !== 'undefined') lucide.createIcons();

    if (client) {
        try {
            let attemptId = null;

            const { data: attempt, error: attErr } = await client
                .from('big_mock_writing_attempts')
                .insert([{
                    test_id: window.currentActiveTestId,
                    user_id: window.currentUser.id,
                    total_score: null,
                    status: 'pending_review',
                    completed_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (!attErr && attempt) {
                attemptId = attempt.id;
            } else {
                const { data: fallbackAttempt } = await client
                    .from('big_mock_attempts')
                    .insert([{
                        test_id: window.currentActiveTestId,
                        section_name: 'writing',
                        user_id: window.currentUser.id,
                        total_score: null,
                        status: 'pending_review',
                        completed_at: new Date().toISOString()
                    }])
                    .select()
                    .single();
                if (fallbackAttempt) attemptId = fallbackAttempt.id;
            }

            if (attemptId) {
                const answersToSave = userWritingResponses.map(r => ({
                    attempt_id: attemptId,
                    task_id: r.task_id,
                    task_type: r.task_type,
                    essay_text: r.response_content,
                    word_count: countWords(r.response_content)
                }));

                const { error: ansErr } = await client.from('big_mock_writing_answers').insert(answersToSave);
                if (ansErr) {
                    await client.from('big_mock_answers').insert(answersToSave.map(a => ({
                        attempt_id: a.attempt_id,
                        task_id: a.task_id,
                        task_type: a.task_type,
                        answer_text: a.essay_text,
                        answer_json: { word_count: a.word_count }
                    })));
                }
            }
        } catch (e) {
            console.error("Error saving Writing attempt:", e);
        }
    }

    if (window.fullTestMode && typeof continueFullTestSequence === 'function') { continueFullTestSequence(); return; }
    renderWritingReviewUI();
}

// ==========================================
// 7. РЕЖИМ РЕВЬЮ / ПРОСМОТРА РЕЗУЛЬТАТОВ
// ==========================================
async function loadWritingReviewMode(attemptId, testId, testTitle) {
    window.engineType = 'writing';
    const client = getSupabaseClient();

    const mainInterface = document.getElementById('main-interface');
    if (mainInterface) mainInterface.classList.add('hidden');

    const resultsView = document.getElementById('results-view');
    resultsView.classList.remove('hidden');
    resultsView.className = 'fixed inset-0 z-50 bg-[#f8f9fa] flex flex-col w-screen h-screen overflow-hidden';
    resultsView.innerHTML = `<div class="m-auto flex flex-col items-center justify-center text-slate-500"><i data-lucide="loader-2" class="w-10 h-10 animate-spin mb-4 text-purple-600"></i><p class="font-bold">Reconstructing Writing attempt...</p></div>`;
    if (typeof lucide !== 'undefined') lucide.createIcons();

    try {
        window.currentActiveTestId = testId;
        const data = await fetchAndParseWritingTasks(testId);
        sentencesData = data.sentences;
        emailData = data.email;
        academicData = data.academic;

        let savedAnswers = [];
        let attemptRow = null;
        if (client) {
            const { data: att } = await client.from('big_mock_writing_attempts').select('*').eq('id', attemptId).single();
            attemptRow = att;

            const { data: ans1 } = await client.from('big_mock_writing_answers').select('*').eq('attempt_id', attemptId);
            if (ans1 && ans1.length > 0) savedAnswers = ans1;
            else {
                const { data: ans2 } = await client.from('big_mock_answers').select('*').eq('attempt_id', attemptId);
                if (ans2) savedAnswers = ans2.map(a => ({ ...a, essay_text: a.answer_text }));
            }
        }

        userWritingResponses = savedAnswers.map(a => ({
            task_id: a.task_id,
            task_type: a.task_type,
            response_content: a.essay_text || a.answer_text || ''
        }));

        renderWritingReviewUI(attemptRow);

    } catch (err) {
        console.error("Error loading writing review:", err);
        alert("Could not load review mode.");
        if (typeof exitExamEngine === 'function') exitExamEngine();
    }
}

function renderWritingReviewUI(attemptRow) {
    const examView = document.getElementById('exam-engine-view');
    if (examView) {
        examView.classList.add('hidden');
        examView.classList.remove('flex');
    }

    const mainInterface = document.getElementById('main-interface');
    if (mainInterface) mainInterface.classList.add('hidden');

    const resultsView = document.getElementById('results-view');
    resultsView.classList.remove('hidden');
    resultsView.className = 'fixed inset-0 z-50 bg-[#f8f9fa] flex flex-col w-screen h-screen overflow-hidden';

    const findResponse = (taskId) => {
        const r = userWritingResponses.find(x => x.task_id === taskId);
        return r ? r.response_content : '';
    };

    let sentencesHtml = sentencesData.map((q, i) => {
        const userSentence = findResponse(q.id) || 'No response submitted.';
        const correct = (q.sample_answer || '').trim();
        const isMatch = correct && userSentence.trim().toLowerCase().replace(/\s+/g, ' ') === correct.toLowerCase().replace(/\s+/g, ' ');

        return `
            <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm mb-4">
                <div class="flex items-center justify-between mb-3">
                    <span class="text-sm font-bold text-slate-400">Sentence ${i + 1}</span>
                    ${isMatch
                        ? `<span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg uppercase tracking-wide">Exact Match</span>`
                        : `<span class="text-[10px] font-bold text-rose-500 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-lg uppercase tracking-wide">Needs Review</span>`}
                </div>
                <p class="text-xs font-bold text-gray-400 uppercase mb-1">Your Answer</p>
                <p class="text-sm ${isMatch ? 'text-slate-700' : 'text-rose-600'} mb-3">${userSentence}</p>
                ${correct ? `
                    <div class="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <p class="text-[10px] font-bold text-gray-400 uppercase mb-1">Correct Structure (Sample Answer)</p>
                        <p class="text-sm text-slate-600">${correct}</p>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');

    const renderEssayCard = (taskLabel, taskData, colorClass) => {
        if (!taskData) return '';
        const text = findResponse(taskData.id) || 'No response submitted.';
        const words = countWords(text);
        return `
            <div class="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm mb-8">
                <div class="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                    <span class="text-xs font-bold uppercase tracking-wider ${colorClass} px-3 py-1 rounded-lg">${taskLabel}</span>
                    <span class="text-xs font-extrabold text-slate-500">Words written: ${words}</span>
                </div>
                <h3 class="text-lg font-bold text-slate-900 mb-3">${taskData.title || taskLabel}</h3>
                <div class="mt-4">
                    <h4 class="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Submitted Response</h4>
                    <div class="p-6 bg-white border border-slate-200 rounded-2xl text-slate-800 leading-relaxed font-normal whitespace-pre-wrap text-sm">${text}</div>
                </div>
            </div>
        `;
    };

    const statusBadgeHtml = (attemptRow && attemptRow.status === 'reviewed')
        ? `<div class="text-lg font-bold text-emerald-600">${attemptRow.total_score !== null && attemptRow.total_score !== undefined ? Number(attemptRow.total_score).toFixed(1) : 'Reviewed'}</div><div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Teacher Score</div>`
        : `<div class="text-lg font-bold text-amber-600">Pending</div><div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Teacher Review</div>`;

    resultsView.innerHTML = `
        <div class="w-full h-full overflow-y-auto custom-scrollbar p-6 md:p-10 bg-[#f8f9fa]">
            <div class="max-w-5xl mx-auto">
                <div class="bg-white rounded-[2rem] p-8 border border-purple-100 shadow-sm text-center mb-10 relative overflow-hidden max-w-2xl mx-auto">
                    <div class="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-inner">✍️</div>
                    <h2 class="text-2xl font-bold text-slate-900 mb-2">Writing Section Completed</h2>
                    <p class="text-xs text-slate-400 mb-6 font-medium">Responses saved for review</p>

                    <div class="flex justify-center items-center mb-8">
                        <div class="px-8 text-center">
                            ${statusBadgeHtml}
                        </div>
                    </div>

                    <div class="flex justify-center space-x-3">
                        <button onclick="startWritingEngine('${window.currentActiveTestId}', document.getElementById('dynamic-test-title').innerText)" class="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-purple-600 transition shadow-md text-sm flex items-center cursor-pointer">
                            <i data-lucide="rotate-ccw" class="w-4 h-4 mr-2"></i> Retake Writing
                        </button>
                        <button onclick="typeof exitExamEngine === 'function' ? exitExamEngine() : console.log('Exit requested')" class="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition shadow-sm text-sm cursor-pointer">
                            Back to Dashboard
                        </button>
                    </div>
                </div>

                ${sentencesData.length > 0 ? `<h3 class="text-lg font-bold text-slate-800 mb-4">Part 1: Sentence Building</h3><div class="mb-8">${sentencesHtml}</div>` : ''}
                ${renderEssayCard('Email', emailData, 'text-indigo-600 bg-indigo-50')}
                ${renderEssayCard('Academic Discussion', academicData, 'text-teal-600 bg-teal-50')}
            </div>
        </div>
    `;
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// ==========================================
// 8. ЯВНЫЙ ЭКСПОРТ В ГЛОБАЛЬНУЮ ОБЛАСТЬ WINDOW
// ==========================================
window.startWritingEngine = startWritingEngine;
window.loadWritingReviewMode = loadWritingReviewMode;
window.nextWritingTask = nextWritingTask;
window.prevWritingTask = prevWritingTask;
window.handleWritingNextStep = nextWritingTask;  // алиас — именно это имя вызывает globalNext() из tests.html
window.handleWritingPrevStep = prevWritingTask;  // алиас — именно это имя вызывает globalPrev() из tests.html
window.fetchAndParseWritingTasks = fetchAndParseWritingTasks;
window.startWritingTasksAfterTransition = startWritingTasksAfterTransition;
