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

const supabaseUrl = 'https://gmsdixqjhlycovsgwbzq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdtc2RpeHFqaGx5Y292c2d3YnpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NTEwODIsImV4cCI6MjA5NTAyNzA4Mn0.gPEOviqSGTuczqoSHvb_BX4mBSdxjh8Bg6BV13l58LQ';

// Один клиент на страницу: если auth.js уже создал свой — используем его,
// иначе в браузере живут два GoTrue-клиента на одном хранилище сессии.
const supabaseClient = (window.supabaseClient && typeof window.supabaseClient.from === 'function')
    ? window.supabaseClient
    : window.supabase.createClient(supabaseUrl, supabaseKey);
window.supabaseClient = supabaseClient;

// Общая точка доступа к базе для всех движков (writing/speaking используют её)
function getSupabaseClient() { return supabaseClient; }

if (typeof lucide !== 'undefined') lucide.createIcons();

// Экранирование для HTML-атрибутов и текста
function readingEsc(s) {
    return String(s === null || s === undefined ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// Номер сессии Reading: после await проверяем, что ученица не нажала Abort
let readingSessionId = 0;
function readingAlive(id) { return id === readingSessionId && window.engineType === 'reading'; }

// Фаза Reading для автосохранения: 'task' | 'transition' | 'saving' | 'done'
let readingPhase = 'task';

// Пишет прогресс на устройство после каждого действия (см. tests.html, mtSaveProgress)
function saveReadingProgress() {
    if (window.engineType !== 'reading' || typeof mtSaveProgress !== 'function') return;
    if (!currentTasks.length || readingPhase === 'saving' || readingPhase === 'done') return;
    const stages = ['1'];
    const m2task = currentTasks.find(t => String(t.stage).startsWith('2'));
    if (m2task) stages.push(String(m2task.stage));
    const inModule2 = module2StartIndex !== null && currentIndex >= module2StartIndex;
    const hint = readingPhase === 'transition'
        ? 'Module 2 is ready'
        : `${inModule2 ? 'Module 2' : 'Module 1'}, question ${itemNumberLabel(currentIndex)}`;
    mtSaveProgress('reading', {
        stages,
        count: currentTasks.length,
        answers: currentTasks.map(t => t.type === 'complete_words'
            ? { w: (t.userWords || []).slice() }
            : { a: (t.userAnswer === undefined ? null : t.userAnswer) }),
        index: currentIndex,
        m2: module2StartIndex,
        phase: readingPhase,
        time: timeRemaining
    }, hint);
}

let currentActiveTestId = null;
let currentTasks = [];
let currentIndex = 0;
let timerInterval;
let timeRemaining = 35 * 60; 

// Раздельные таймеры на Module 1 и Module 2 (в минутах) — поменяйте эти два
// числа под нужные значения, они независимы друг от друга.
// Спецификация TOEFL 2026, Reading: роутер 18-21 мин, Модуль 2 = 9 мин
// (для обеих ветвей). Состав по Technical Manual Table 1:
// роутер 20 зачётных айтемов, Модуль 2 = 15, итого 35 в любом пути.
// ВРЕМЯ. Раньше минуты были прибиты гвоздями, из-за чего модуль на 20 айтемов
// получал столько же времени, сколько модуль на 35. Теперь время считается от
// состава: у каждого типа задания своя цена за текст и за айтем.
// timerMode: 'budget' — считать по составу, 'fixed' — старые жёсткие минуты.
let timerMode = 'budget';

// Калибровка под спеку: на составе Table 1 (20 айтемов) даёт 19 мин при норме
// 18-21, на втором модуле (15 айтемов) — ровно 9.
const TIME_BUDGET = {
    complete_words: { passage: 45,  perItem: 12 },
    daily_life:     { passage: 60,  perItem: 35 },
    academic:       { passage: 120, perItem: 45 },
    default:        { passage: 60,  perItem: 40 }
};
const MIN_MODULE_MINUTES = 4;
const MAX_MODULE_MINUTES = 45;
// Роутер по спеке щедрее второго модуля (~63 сек на айтем против ~36)
const MODULE1_TIME_FACTOR = 1.35;

function estimateMinutes(tasks, factor) {
    let seconds = 0;
    const counted = new Set();
    (tasks || []).forEach(t => {
        const b = TIME_BUDGET[t.type] || TIME_BUDGET.default;
        const key = `${t.type}:${t.taskId}`;
        if (!counted.has(key)) { seconds += b.passage; counted.add(key); }
        seconds += b.perItem * taskItemCount(t);
    });
    const minutes = Math.ceil(seconds * (factor || 1) / 60);
    return Math.min(MAX_MODULE_MINUTES, Math.max(MIN_MODULE_MINUTES, minutes));
}

function moduleMinutes(stagePrefix) {
    const isModule1 = (stagePrefix === '1');
    if (timerMode === 'fixed') return isModule1 ? module1TimeMinutes : module2TimeMinutes;
    const slice = currentTasks.filter(t => isModule1 ? t.stage === '1' : String(t.stage).startsWith('2'));
    const minutes = estimateMinutes(slice, isModule1 ? MODULE1_TIME_FACTOR : 1);
    console.log(`[reading] Module ${isModule1 ? 1 : 2}: ${slice.reduce((n, t) => n + taskItemCount(t), 0)} айтемов -> ${minutes} мин`);
    return minutes;
}

// Запасные значения для timerMode = 'fixed'
let module1TimeMinutes = 21;
let module2TimeMinutes = 9;

// Индекс, с которого начинается Module 2 в currentTasks — нужен для кнопки Review,
// чтобы не давать перепрыгивать обратно в Module 1 (как и на настоящем TOEFL)
let module2StartIndex = null;

// Эталонный ответ. Для обычных вопросов это текст выбранного варианта, но два
// типа устроены иначе, и раньше они считались неверно:
//   Insert Text — при клике в ответ пишется НОМЕР позиции ("1"), а не текст,
//     поэтому сравнение с options[correct] ("Position B") не совпадало никогда.
//   Select a Sentence — options пустой, options[correct] давало undefined,
//     и вопрос молча выпадал из подсчёта вместе со своим баллом.
// Текст предложения сравниваем без учёта переносов строк и повторных пробелов:
// в пассаже предложение может переноситься (\n), и раньше клик по правильному
// предложению давал "vital\npollinators", а эталон — "vital pollinators".
function normSentence(t) {
    return String(t || '').replace(/[\u00A0\u2009\u202F]/g, ' ').replace(/\s+/g, ' ').trim();
}

// Эталон берём из той же разметки, по которой кликает ученица (через DOM, а не
// регуляркой): так совпадают и сущности (&amp;), и вложенные теги.
// Номер — из метки [sN] (data-id), а не порядковый: метки не обязаны идти подряд.
function sentenceTextByMarker(passageHtml, markerNumber) {
    const box = document.createElement('div');
    box.innerHTML = String(passageHtml || '');
    const spans = [...box.querySelectorAll('.clickable-sentence')];
    const el = spans.find(s => String(s.getAttribute('data-id')) === String(markerNumber)) || spans[markerNumber - 1];
    return el ? normSentence(el.textContent) : null;
}

function buildCorrectAnswer(q, qType, passageHtml) {
    if (q.correct === undefined || q.correct === null) return null;

    if (qType === 'Insert Text') return String(q.correct);

    if (qType === 'Select a Sentence') {
        const text = sentenceTextByMarker(passageHtml, q.correct);
        if (!text) console.warn('[reading] Select a Sentence: не найдено предложение с меткой', q.correct);
        return text;
    }

    const opts = q.options || [];
    return opts[q.correct] !== undefined ? opts[q.correct] : null;
}

// Complete the Words лежит в currentTasks ОДНИМ элементом, но это 10 отдельных
// зачётных айтемов, поэтому счётчик и Review считают айтемы, а не элементы массива.
function taskItemCount(t) {
    if (!t) return 0;
    if (t.type === 'complete_words') {
        const n = (t.correctWords || []).length;
        return n > 0 ? n : 1;
    }
    return 1;
}

// Модуль 2 нумеруется заново с единицы
function numberingBaseFor(i) {
    return (module2StartIndex !== null && i >= module2StartIndex) ? module2StartIndex : 0;
}

// Диапазон номеров элемента i: {first, last, count}
function itemNumberRange(i) {
    const base = numberingBaseFor(i);
    let n = 0;
    for (let k = base; k < i; k++) n += taskItemCount(currentTasks[k]);
    const count = taskItemCount(currentTasks[i]);
    return { first: n + 1, last: n + count, count: count };
}

// Подпись элемента: "1-10" для Complete the Words, "21" для обычного вопроса
function itemNumberLabel(i) {
    const r = itemNumberRange(i);
    return r.count > 1 ? `${r.first}-${r.last}` : `${r.first}`;
}

// Всего айтемов в текущей области нумерации
function numberingTotal(i) {
    const base = numberingBaseFor(i);
    let n = 0;
    for (let k = base; k < currentTasks.length; k++) n += taskItemCount(currentTasks[k]);
    return n;
}

function renderDailyLifeLayout(passage, layoutType, taskTitle) {
    if (!passage) return "";
    const cleanPassage = passage.replace(/[\[\]]/g, ''); 
    
    // БЕЗОПАСНО: Если макет пустой или не задан, откатываемся на дефолтный 'notice'
    const safeLayout = (layoutType || 'notice').toLowerCase().trim();

    switch(safeLayout) {
        case 'email': {
            // Шапка берётся из первых строк текста (To:/From:/Date:/Subject:), а не
            // подставляется жёстко: в заданиях письмо часто адресовано не студенту.
            const lines = cleanPassage.split('\n');
            const meta = {};
            let bodyStart = 0;
            for (let i = 0; i < lines.length; i++) {
                const m = lines[i].match(/^\s*(To|From|Date|Subject)\s*:\s*(.*)$/i);
                if (m) { meta[m[1].toLowerCase()] = m[2].trim(); bodyStart = i + 1; }
                else if (!lines[i].trim()) { if (bodyStart === i) bodyStart = i + 1; }
                else break;
            }
            const body = lines.slice(bodyStart).join('\n').replace(/^\n+/, '');
            const row = (label, value) => value
                ? `<div><span class="inline-block w-16 font-semibold text-slate-400">${label}:</span> <span class="text-slate-700">${value}</span></div>`
                : '';
            return `<div class="max-w-xl mx-auto bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs font-sans text-sm"><div class="bg-slate-50 p-4 border-b border-slate-200 space-y-1.5 text-slate-700"><div><span class="inline-block w-16 font-semibold text-slate-400">To:</span> <span class="bg-white px-2 py-0.5 border border-slate-200 rounded text-xs">${meta.to || 'student@toeflprep.com'}</span></div>${row('From', meta.from || 'admin')}${row('Date', meta.date)}<div><span class="inline-block w-16 font-semibold text-slate-400">Subject:</span> <span class="font-medium text-slate-900">${meta.subject || taskTitle}</span></div></div><div class="p-6 text-slate-800 space-y-4 leading-relaxed font-normal bg-white">${body.replace(/\n/g, '<br>')}</div></div>`;
        }
        case 'social_media': 
            return `<div class="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl p-5 shadow-xs font-sans"><div class="flex items-center space-x-3 mb-4"><div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm"><i data-lucide="user" class="w-5 h-5"></i></div><div><div class="font-bold text-sm text-slate-900">Community Board</div><div class="text-[11px] text-slate-400 font-normal">Posted recently</div></div></div><div class="text-slate-700 space-y-3 font-normal text-sm leading-relaxed mb-4">${cleanPassage.replace(/\n/g, '<br>')}</div></div>`;
        case 'notice': 
            return `<div class="max-w-lg mx-auto bg-white border-2 border-slate-800 p-8 shadow-xs font-sans relative"><h3 class="text-lg font-bold text-slate-900 text-center tracking-tight mb-6 uppercase">${taskTitle}</h3><div class="text-slate-700 space-y-4 font-normal text-sm leading-relaxed relative z-10">${cleanPassage.replace(/\n/g, '<br>')}</div></div>`;
        case 'chat': {
            // Разбираем построчно: "Имя (любой формат времени): текст" — не привязываемся
            // к конкретному формату времени (09:15 AM / 9:15 A.M. / 21:15 и т.д.),
            // иначе чат не парсится и падает в один сплошной блок текста.
            const lines = cleanPassage.split('\n');
            const chatHtml = lines.map(line => {
                if (!line.trim()) return '';
                const match = line.match(/^([^\(]+(?:\([^)]+\))?):\s*(.*)$/);
                if (match) {
                    return `<div class="mb-4 font-sans"><div class="text-[11px] font-bold text-slate-500 mb-0.5 px-1">${match[1].trim()}</div><div class="inline-block bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-tl-none px-4 py-2.5 max-w-[90%] text-sm font-normal shadow-2xs">${match[2]}</div></div>`;
                }
                return `<p class="text-xs text-slate-400 italic my-2 text-center">${line}</p>`;
            }).join('');
            return `<div class="max-w-sm mx-auto bg-slate-50 border border-slate-200 rounded-[24px] overflow-hidden shadow-xs font-sans flex flex-col h-[550px]"><div class="bg-[#111827] p-4 text-white text-center font-bold text-[13px] flex items-center justify-center gap-2 shadow-sm shrink-0"><span class="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span> Group Chat</div><div class="p-5 overflow-y-auto flex-1 custom-scrollbar">${chatHtml}</div></div>`;
        }
        case 'advertisement': 
            return `<div class="max-w-md mx-auto bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-dashed border-orange-200 p-8 rounded-2xl shadow-sm font-sans text-center relative overflow-hidden"><div class="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">Ad</div><h3 class="text-2xl font-extrabold text-orange-600 mb-4 tracking-tight">${taskTitle}</h3><div class="text-slate-700 space-y-3 font-medium text-sm leading-relaxed mb-6">${cleanPassage.replace(/\n/g, '<br>')}</div><button class="bg-orange-500 text-white font-bold py-2 px-6 rounded-full shadow-md text-sm cursor-default hover:bg-orange-600 transition">Learn More</button></div>`;
        case 'article': {
            // Газетная заметка: строка-датлайн вида "RICHMOND (APRIL 13)" уходит
            // в шапку, остальное идёт абзацами под заголовком.
            const lines = cleanPassage.split('\n').map(l => l.trim()).filter(Boolean);
            let dateline = '';
            if (lines.length && /^[A-Z0-9][A-Z0-9\s.,'\u2019-]*\([^)]+\)\s*$/.test(lines[0])) {
                dateline = lines.shift();
            }
            const body = lines.map(p => `<p>${p}</p>`).join('');
            return `<div class="max-w-xl mx-auto bg-white border border-slate-300 shadow-xs font-serif"><div class="px-8 pt-7 pb-4 border-b-4 border-double border-slate-800">${dateline ? `<div class="font-sans text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase mb-2">${dateline}</div>` : ''}<h3 class="text-2xl font-bold text-slate-900 leading-tight tracking-tight">${taskTitle}</h3></div><div class="px-8 py-6 text-slate-700 text-sm leading-relaxed space-y-4">${body}</div></div>`;
        }
        default: 
            return `<div class="text-slate-700 space-y-4 font-normal leading-relaxed text-base">${cleanPassage.replace(/\n/g, '<br>')}</div>`;
    }
}

function setupInputs() {
    const inputs = document.querySelectorAll('.letter-input');
    const task = currentTasks[currentIndex];
    
    // ИСПРАВЛЕНИЕ: опираемся на correctWords для корректного инкремента charIndex
    if (task && task.type === 'complete_words' && task.correctWords) {
        let charIndex = 0;
        task.correctWords.forEach((correctWord, wordIdx) => {
            let uWord = (task.userWords && task.userWords[wordIdx]) ? task.userWords[wordIdx] : "";
            for (let i = 0; i < correctWord.length; i++) {
                if (inputs[charIndex] && uWord[i] && uWord[i] !== '_') {
                    inputs[charIndex].value = uWord[i];
                }
                charIndex++;
            }
        });
    }

    inputs.forEach((input, index) => {
        input.setAttribute('maxlength', '1');
        input.addEventListener('input', function() {
            this.value = this.value.replace(/[^a-zA-Z]/g, '').toLowerCase();
            updateCompleteWordsState(); 
            if (this.value.length === 1 && index < inputs.length - 1) inputs[index + 1].focus();
        });
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && this.value === '' && index > 0) inputs[index - 1].focus();
        });
    });
}

function updateCompleteWordsState() {
    const task = currentTasks[currentIndex];
    if (!task || task.type !== 'complete_words') return;
    
    const containers = document.querySelectorAll('.letters-container');
    let userWords = [];
    containers.forEach(container => {
        let word = '';
        container.querySelectorAll('input').forEach(inp => word += (inp.value || '_'));
        userWords.push(word);
    });
    task.userWords = userWords;
    saveReadingProgress();
}

async function fetchAndParseTasks(testId, stageName) {
    let parsedTasks = [];
    const { data: plan, error: planErr } = await supabaseClient
        .from('full_test_tasks')
        .select('*')
        .eq('test_id', testId)
        .eq('stage', stageName)
        .order('order_num', { ascending: true });

    if (planErr) throw planErr;
    if (!plan || plan.length === 0) return parsedTasks;

    for (let step of plan) {
        let tableName = step.task_type + '_tasks'; 
        
        const { data: taskData, error: taskErr } = await supabaseClient
            .from(tableName)
            .select('*')
            .eq('id', step.task_id)
            .single();

        if (taskErr) {
            console.warn(`Could not load task ${step.task_id} from ${tableName}`);
            continue; 
        }

        if (step.task_type === 'complete_words') {
            let correctWords = [];
            let parsedPassage = taskData.passage.replace(/(?:\[[a-zA-Z]\])+/g, (match) => {
                let letters = match.replace(/[\[\]]/g, '').split('');
                correctWords.push(letters.join(''));
                let inputsHtml = letters.map(l => `<input type="text" class="letter-input" data-answer="${l}">`).join('');
                return `<span class="letters-container">${inputsHtml}</span>`;
            });
            
            parsedTasks.push({ 
                taskId: step.task_id,
                type: 'complete_words', 
                title: taskData.title, 
                passage: parsedPassage,
                originalPassage: taskData.passage, 
                stage: stageName,
                correctWords: correctWords, 
                userWords: new Array(correctWords.length).fill(""), 
                correctAnswer: null, 
                userAnswer: null
            });
        
        } else if (step.task_type === 'daily_life' || step.task_type === 'academic') {
            let questions = [];
            if (typeof taskData.questions === 'string') {
                try { questions = JSON.parse(taskData.questions); } catch(e) { questions = []; }
            } else if (Array.isArray(taskData.questions)) {
                questions = taskData.questions;
            }
            
            questions.forEach(q => {
                let parsedPassage = taskData.passage;
                let qType = q.type || 'Standard';

                // Разбор общий для всех страниц: метки разных типов больше
                // не мешают друг другу. Раньше в режиме Insert Text метки
                // [s1] тоже превращались в квадраты, и в одном пассаже
                // нельзя было держать два особых типа вопросов.
                if (step.task_type === 'academic') {
                    parsedPassage = PassageMarkup.parsePassage(parsedPassage);
                }

                parsedTasks.push({
                    taskId: step.task_id,
                    type: step.task_type,
                    title: taskData.title,
                    layout: taskData.layout_type || 'notice',
                    passage: parsedPassage,
                    question: q.text,
                    options: q.options || [],
                    qType: qType,
                    insertSentence: q.insertSentence || "",
                    highlight: q.highlight || "",
                    highlightOccurrence: q.highlight_occurrence || null,
                    stage: stageName,
                    correctAnswer: buildCorrectAnswer(q, qType, parsedPassage),
                    explanation: q.explanation || "",
                    userAnswer: null
                });
            });
        }
    }
    return parsedTasks;
}

async function startExamEngine(testId, testTitle, resume) {
    window.engineType = 'reading';
    readingSessionId++;
    const mySession = readingSessionId;
    clearInterval(timerInterval);
    if (typeof resetEngineHeaderButtons === 'function') resetEngineHeaderButtons();
    const reviewBtn = document.getElementById('engine-review');
    if (reviewBtn) reviewBtn.classList.remove('hidden'); // в Reading Review доступна всегда (кроме заставки)
    document.getElementById('results-view').classList.add('hidden');
    document.getElementById('results-view').classList.remove('flex');

    document.getElementById('main-interface').classList.add('hidden');
    document.getElementById('exam-engine-view').classList.remove('hidden');
    document.getElementById('exam-engine-view').classList.add('flex');
    
    document.getElementById('engine-title').innerText = `Loading ${testTitle}...`;
    document.getElementById('engine-content').innerHTML = `
        <div class="m-auto text-center">
            <div class="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p class="text-slate-600 font-bold text-sm animate-pulse">Building test layout...</p>
        </div>
    `;
    
    currentTasks = [];
    currentActiveTestId = testId;
    window.currentActiveTestTitle = testTitle;
    module2StartIndex = null;
    module2LoadPromise = null;
    
    readingPhase = 'task';
    try {
        let loaded = await fetchAndParseTasks(testId, '1');
        if (resume && resume.stages && resume.stages[1]) {
            loaded = loaded.concat(await fetchAndParseTasks(testId, resume.stages[1]));
        }
        if (!readingAlive(mySession)) return; // нажали Abort, пока шла загрузка
        currentTasks = loaded;

        // Продолжение сохранённой попытки
        if (resume && Array.isArray(resume.answers)) {
            if (resume.count !== currentTasks.length) {
                alert('Состав теста изменился с момента сохранения — секцию придётся начать заново.');
                if (typeof mtClearProgress === 'function') mtClearProgress();
                currentTasks = currentTasks.filter(t => t.stage === '1');
            } else {
                currentTasks.forEach((t, i) => {
                    const a = resume.answers[i] || {};
                    if (t.type === 'complete_words') t.userWords = Array.isArray(a.w) ? a.w : t.userWords;
                    else t.userAnswer = (a.a === undefined ? null : (t.qType === 'Select a Sentence' && a.a ? normSentence(a.a) : a.a));
                });
                currentIndex = Math.min(Math.max(0, resume.index || 0), currentTasks.length - 1);
                module2StartIndex = (resume.m2 === null || resume.m2 === undefined) ? null : resume.m2;
                if (resume.stages && resume.stages[1]) module2LoadPromise = Promise.resolve(true);
                timeRemaining = Math.max(1, resume.time || 60);
                document.getElementById('engine-title').innerText = testTitle;
                if (resume.phase === 'transition') { renderModuleTransition(); return; }
                startTimer();
                renderEngine();
                return;
            }
        }

        if (currentTasks.length === 0) {
            const msg = "В этом тесте нет заданий Reading (full_test_tasks, stage = '1').";
            if (typeof handleEmptySection === 'function') handleEmptySection('Reading', msg);
            else { alert(msg); exitExamEngine(); }
            return;
        }

        currentIndex = 0;
        module2StartIndex = null;
        module2LoadPromise = null;
        document.getElementById('engine-title').innerText = testTitle;
        
        timeRemaining = moduleMinutes('1') * 60;
        startTimer();
        renderEngine();

    } catch (err) {
        console.error("Engine crash:", err);
        if (!readingAlive(mySession)) return;
        alert("Не удалось загрузить Reading.\n\n" + (err.message || err));
        exitExamEngine();
    }
}

function renderReadingTimer() {
    const timerEl = document.getElementById('engine-timer');
    if (!timerEl) return;
    const m = Math.floor(Math.max(0, timeRemaining) / 60);
    const s = Math.max(0, timeRemaining) % 60;
    timerEl.innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
}

function startTimer() {
    clearInterval(timerInterval);
    const mySession = readingSessionId;
    renderReadingTimer(); // сразу показать полное время, а не остаток от прошлой секции
    timerInterval = setInterval(() => {
        if (!readingAlive(mySession)) { clearInterval(timerInterval); return; }
        timeRemaining--;
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            handleReadingTimeUp();
            return;
        }
        renderReadingTimer();
        saveReadingProgress();
    }, 1000);
}

// Истечение времени зависит от модуля. На реальном тесте конец времени
// Модуля 1 просто переводит дальше, а не завершает секцию — иначе
// медленный ученик не увидит Модуль 2 вообще и вдобавок получит
// потолок 4.0 (ветка определится как 2_easy из-за отсутствия айтемов
// 2_hard в currentTasks), то есть будет наказан дважды.
async function handleReadingTimeUp() {
    const isModule1Finished = !currentTasks.some(t => t.stage.startsWith('2'));

    const mySession = readingSessionId;
    if (isModule1Finished) {
        const loaded = await loadModule2Tasks();
        if (!readingAlive(mySession)) return;
        if (loaded === 'error') { readingModule2NetworkError(); return; }
        if (loaded) {
            // Неотвеченные айтемы Модуля 1 так и остаются неотвеченными —
            // роутер и итоговый балл корректно считают их как неверные.
            //
            // Время могло кончиться на любом вопросе, а startReadingModuleTwo()
            // делает currentIndex++ и считает, что мы на ПОСЛЕДНЕМ айтеме
            // Модуля 1. Ставим курсор на границу модулей, чтобы этот ++
            // попал ровно на первый айтем Модуля 2 и module2StartIndex
            // (по нему Review ограничивает модуль) встал верно.
            const module1Count = currentTasks.filter(t => t.stage === '1').length;
            currentIndex = module1Count - 1;

            alert("Time is up for Module 1. Moving on to Module 2.");
            renderModuleTransition();
            return;
        }
        // Если Модуль 2 не сконфигурирован в базе — честно завершаем секцию.
    }

    alert("Time is up!");
    saveAttemptAndFinish();
}

function renderEngine() {
    try {
        const task = currentTasks[currentIndex];
        if (!task) throw new Error("No task found at index " + currentIndex);

        const contentDiv = document.getElementById('engine-content');
        if (!contentDiv) throw new Error("engine-content element not found");
        
        // БЕЗОПАСНО: обновляем элементы, только если они физически есть на странице
        const progressEl = document.getElementById('engine-progress');
        if (progressEl) {
            progressEl.innerText = `${itemNumberLabel(currentIndex)} / ${numberingTotal(currentIndex)}`;
        }

        const prevEl = document.getElementById('engine-prev');
        if (prevEl) {
            prevEl.disabled = (currentIndex === 0);
        }

        const nextEl = document.getElementById('engine-next');
        if (nextEl) {
            nextEl.style.display = 'flex';
            nextEl.innerHTML = (currentIndex === currentTasks.length - 1) 
                ? 'Finish <i data-lucide="check" class="w-4 h-4 ml-1"></i>' 
                : 'Next <i data-lucide="chevron-right" class="w-4 h-4 ml-1"></i>';
        }

        contentDiv.innerHTML = '';

        if (task.type === 'complete_words') {
            contentDiv.innerHTML = `
                <div class="w-full p-10 overflow-y-auto custom-scrollbar flex items-center justify-center bg-[#f8f9fa]">
                    <div class="max-w-3xl w-full bg-white p-10 rounded-3xl border border-gray-100 shadow-sm">
                        <h2 class="text-xl font-bold mb-6 text-center text-slate-900">${task.title}</h2>
                        <div class="text-lg leading-loose text-slate-700 text-center">${task.passage}</div>
                    </div>
                </div>
            `;
            setTimeout(() => setupInputs(), 50);
        } 
        else if (task.type === 'daily_life') {
            const renderedLayout = renderDailyLifeLayout(task.passage, task.layout, task.title);
            contentDiv.innerHTML = `
                <section class="w-1/2 bg-white p-10 overflow-y-auto custom-scrollbar border-r border-slate-200 flex flex-col">
                    <div class="my-auto w-full">${renderedLayout}</div>
                </section>
                <section class="w-1/2 bg-slate-50 p-10 overflow-y-auto custom-scrollbar">
                    <div class="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs max-w-xl mx-auto mt-10">
                        <h3 class="font-bold text-slate-900 mb-6">${task.question}</h3>
                        <div class="space-y-3">
                            ${(task.options || []).map((opt, oi) => `
                                <label class="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-slate-50 transition">
                                    <input type="radio" name="q" value="${oi}"
                                        ${task.userAnswer === opt ? 'checked' : ''}
                                        onchange="currentTasks[${currentIndex}].userAnswer = currentTasks[${currentIndex}].options[${oi}]; saveReadingProgress()"
                                        class="w-4 h-4 text-indigo-600 mr-3">
                                    <span class="text-sm text-slate-700">${opt}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                </section>
            `;
        }
        else if (task.type === 'academic') {
            let rightPanelContent = '';

            if (task.qType === 'Select a Sentence') {
                rightPanelContent = `<div class="bg-amber-50 border border-amber-100 p-3 rounded-xl mb-6 text-xs text-amber-800 flex items-center"><i data-lucide="mouse-pointer-click" class="w-4 h-4 mr-2"></i> Click a sentence on the left.</div><h3 class="font-bold text-slate-900">${task.question}</h3>`;
            } else if (task.qType === 'Insert Text') {
                // Кнопки позиций добавляются после отрисовки текста —
                // буквы берутся из самого пассажа.
                rightPanelContent = `<h3 class="font-bold text-slate-900 mb-4">${task.question}</h3><div id="insertOptions"></div>`;
            } else {
                rightPanelContent = `<h3 class="font-bold text-slate-900 mb-6">${task.question}</h3><div class="space-y-3">${(task.options || []).map((opt, oi) => `<label class="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-slate-50 transition"><input type="radio" name="q" value="${oi}" ${task.userAnswer === opt ? 'checked' : ''} onchange="currentTasks[${currentIndex}].userAnswer = currentTasks[${currentIndex}].options[${oi}]; saveReadingProgress()" class="w-4 h-4 text-indigo-600 mr-3"><span class="text-sm text-slate-700">${opt}</span></label>`).join('')}</div>`;
            }

            contentDiv.innerHTML = `
                <section class="w-1/2 bg-white p-10 overflow-y-auto custom-scrollbar border-r border-slate-200">
                    <h2 class="text-xl font-bold text-slate-900 mb-6">${task.title}</h2>
                    <div id="academicPassageContainer" class="text-sm text-slate-700 leading-relaxed space-y-4 whitespace-pre-wrap">${task.passage}</div>
                </section>
                <section class="w-1/2 bg-slate-50 p-10 overflow-y-auto custom-scrollbar">
                     <div class="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs max-w-xl mx-auto">${rightPanelContent}</div>
                </section>
            `;

            setTimeout(() => {
                document.querySelectorAll('.clickable-sentence').forEach(el => {
                    const sentenceText = normSentence(el.textContent);
                    if (task.userAnswer === sentenceText) el.classList.add('selected');
                    el.onclick = function() {
                        if (task.qType !== 'Select a Sentence') return;
                        document.querySelectorAll('.clickable-sentence').forEach(s => s.classList.remove('selected'));
                        this.classList.add('selected');
                        currentTasks[currentIndex].userAnswer = normSentence(this.textContent);
                        saveReadingProgress();
                    };
                });

                const passageBox = document.getElementById('academicPassageContainer');

                // Выбор позиции вставки: и кликом по букве в тексте,
                // и кнопкой справа — это один и тот же выбор.
                window.chooseInsertPosition = function(pos) {
                    currentTasks[currentIndex].userAnswer = String(pos);
                    PassageMarkup.choosePosition(passageBox, pos, task.insertSentence);
                    saveReadingProgress();
                };

                document.querySelectorAll('.insert-square').forEach((el, index) => {
                    el.onclick = function() {
                        if (task.qType !== 'Insert Text') return;
                        window.chooseInsertPosition(index);
                    };
                });

                if (task.qType === 'Insert Text') {
                    const box = document.getElementById('insertOptions');
                    if (box) box.innerHTML = PassageMarkup.positionButtons(passageBox, task.insertSentence, 'chooseInsertPosition');
                    if (task.userAnswer !== undefined && task.userAnswer !== '') {
                        PassageMarkup.choosePosition(passageBox, Number(task.userAnswer), task.insertSentence, { silent: true });
                    }
                }

                // Подсветка фрагмента для Sentence Simplification и Reference
                PassageMarkup.applyHighlight(passageBox, {
                    type: task.qType,
                    highlight: task.highlight,
                    highlight_occurrence: task.highlightOccurrence
                });

                // Подсветка слова в тексте для Vocabulary-вопросов, как в реальном TOEFL
                const passageContainer = document.getElementById('academicPassageContainer');
                clearVocabHighlight(passageContainer);
                if (task.qType && task.qType.toLowerCase() === 'vocabulary') {
                    highlightVocabWord(task, passageContainer);
                }
            }, 50);
        }
        
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
        readingPhase = 'task';
        saveReadingProgress();
    } catch (err) {
        console.error("Critical render error:", err);
        alert("Render error: " + err.message);
    }
}

// ---- Vocabulary highlight helpers ----

function clearVocabHighlight(container) {
    (container || document).querySelectorAll('.vocab-highlight').forEach(el => {
        const parent = el.parentNode;
        if (!parent) return;
        parent.replaceChild(document.createTextNode(el.textContent), el);
        parent.normalize();
    });
}

function extractVocabWord(task) {
    if (task.word) return task.word;
    const src = task.question || '';
    const match = src.match(/["“']([^"”']+)["”']/);
    return match ? match[1].trim() : null;
}

function highlightVocabWord(task, container) {
    if (!container) return;
    const word = extractVocabWord(task);
    if (!word) return;

    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b(${escaped})\\b`, 'i');

    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
    let node;
    while ((node = walker.nextNode())) {
        const m = node.textContent.match(regex);
        if (m) {
            const range = document.createRange();
            range.setStart(node, m.index);
            range.setEnd(node, m.index + m[0].length);
            const mark = document.createElement('mark');
            mark.className = 'vocab-highlight';
            range.surroundContents(mark);
            mark.scrollIntoView({ behavior: 'smooth', block: 'center' });
            break;
        }
    }
}

// Модуль 2 запрашивают ДВА пути: клик по Next и истечение таймера. Оба проверяют
// "модуль 1 закончен?" ДО await, поэтому при совпадении по времени оба видели true
// и склеивали модуль дважды (в URANUS это давало 57 айтемов вместо 42).
// Держим общий промис: второй вызов дожидается первого, а не грузит заново.
let module2LoadPromise = null;

async function loadModule2Tasks() {
    if (module2LoadPromise) return module2LoadPromise;
    module2LoadPromise = doLoadModule2Tasks();
    const ok = await module2LoadPromise;
    if (ok !== true) module2LoadPromise = null;
    return ok;
}

// Модуль 2 не загрузился из-за сети: остаёмся на последнем вопросе Модуля 1
function readingModule2NetworkError() {
    const module1Count = currentTasks.filter(t => t.stage === '1').length;
    currentIndex = Math.max(0, module1Count - 1);
    renderEngine();
    alert('Не удалось загрузить Модуль 2 — нет связи с сервером.\n\nОтветы сохранены. Проверьте интернет и нажмите Next ещё раз.');
}

async function doLoadModule2Tasks() {
    document.getElementById('engine-next').innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin mr-1"></i> Loading Module 2...';
    
    let correctCount = 0;
    let module1Total = 0;

    // Учет заданий complete_words для расчета прохождения модуля:
    // каждый пропуск = отдельный балл (а не вся задача целиком).
    for (let task of currentTasks) {
        if (task.stage === '1') {
            if (task.type === 'complete_words') {
                const s = scoreCompleteWords(task);
                module1Total += s.total;
                correctCount += s.correct;
            } else if (task.correctAnswer !== null && task.correctAnswer !== undefined) {
                module1Total++;
                if (task.userAnswer && task.userAnswer === task.correctAnswer) correctCount++;
            }
        }
    }

    // Порог роутинга. Знаменатель теперь ~30 айтемов (после починки
    // подсчёта Complete the Words), стартовое значение по спеке 18/30 = 0.6.
    // Дальше подстраивать так, чтобы примерно половина учеников уходила в Upper.
    const thresholdPercentage = 0.6; 
    const isHardModule = (module1Total > 0) && (correctCount / module1Total >= thresholdPercentage);
    const nextStage = isHardModule ? '2_hard' : '2_easy';
    
    try {
        const module2Tasks = await fetchAndParseTasks(currentActiveTestId, nextStage);
        if (module2Tasks.length > 0) {
            currentTasks = currentTasks.concat(module2Tasks);
            return true; 
        }
    } catch(e) { console.error("Error loading module 2:", e); return 'error'; }
    return false; 
}

// Complete the Words считается по пропускам, а не «всё или ничего»:
// каждый угаданный пропуск = отдельный балл.
function scoreCompleteWords(task) {
    const correct = task.correctWords || [];
    const user = task.userWords || [];
    let hit = 0;
    correct.forEach((w, i) => {
        const u = (user[i] || '').trim().toLowerCase();
        if (u && u === String(w).trim().toLowerCase()) hit++;
    });
    return { correct: hit, total: correct.length };
}

// Балл зависит от того, в какую ветку ушёл ученик.
// Обоснование по Technical Manual (Table 9, band -> CEFR):
//   Lower 1.0-4.5: роутер = B1/B2, лёгкий модуль ниже него, поэтому
//     максимум продемонстрированного уровня B2, а B2 = 4-4.5.
//   Upper 3.0-6.0: порог роутера B1/B2 уже пройден (B1 = 3-3.5),
//     верхний модуль содержит C1/C2-контент, поэтому потолок 6.0 (C2).
// Перекрытие 3.0-4.5 — зона, где обе ветки дают сопоставимую оценку,
// что соответствует требованию мануала: один и тот же уровень владения
// языком даёт один и тот же балл независимо от выданного модуля.
// ==========================================================
// ШКАЛА БАЛЛА READING
//
// Раньше было две шкалы: лёгкая ветка 1.0–4.5, трудная 3.0–6.0, а все
// верные ответы складывались в один процент. На пороге это давало скачок:
// ученица, перешагнувшая порог на один вопрос и проваившая трудный модуль,
// получала 4.0–4.5, а та, что чуть не дотянула и решила лёгкий модуль
// идеально, — 3.5. Меньше верных ответов — выше балл.
//
// Теперь шкала одна, 1.0–6.0, для всех. Ветка влияет только на ВЕС
// вопросов второго модуля: трудный стоит дороже, лёгкий дешевле.
// Вес берётся из этапа задания (stage), отдельно прописывать не нужно.
//
// Это приближение, а не шкала ETS: та строится по статистической модели
// с калибровкой каждого вопроса. Веса стоит подстроить по реальным данным.
// ==========================================================
const ITEM_WEIGHT = { '1': 1.0, '2_easy': 0.5, '2_hard': 1.4 };
// Знаменатель всегда считается по весу трудного модуля: так потолок
// лёгкой ветки получается около 4.5, как и задумано по уровню B2.
const MAX_MODULE2_WEIGHT = 1.4;

function itemWeight(stage) {
    return ITEM_WEIGHT[String(stage)] !== undefined ? ITEM_WEIGHT[String(stage)] : 1.0;
}

// Возвращает { score, points, maxPoints, correct, total }
// или null, если в тесте нет ни одного вопроса с правильным ответом.
function calculateWeightedScore(tasks) {
    let points = 0, maxPoints = 0, correct = 0, total = 0;

    (tasks || []).forEach(task => {
        const stage = String(task.stage);
        const w = itemWeight(stage);
        const wMax = stage === '1' ? 1.0 : MAX_MODULE2_WEIGHT;

        let c = 0, t = 0;
        if (task.type === 'complete_words') {
            const s = scoreCompleteWords(task);
            c = s.correct; t = s.total;
        } else if (task.correctAnswer !== null && task.correctAnswer !== undefined) {
            t = 1;
            if (task.userAnswer === task.correctAnswer) c = 1;
        }

        correct += c; total += t;
        points += c * w;
        maxPoints += t * wMax;
    });

    if (maxPoints === 0) return null;
    const raw = 1 + 5 * (points / maxPoints);
    const score = Math.min(6, Math.max(1, Math.round(raw * 2) / 2));
    return { score: score.toFixed(1), points, maxPoints, correct, total };
}

async function nextTask() {
    if (currentIndex < currentTasks.length - 1) {
        currentIndex++;
        renderEngine();
    } else {
        const isModule1Finished = !currentTasks.some(t => t.stage.startsWith('2'));
        const mySession = readingSessionId;
        if (isModule1Finished) {
            const loaded = await loadModule2Tasks();
            if (!readingAlive(mySession)) return;
            if (loaded === 'error') { readingModule2NetworkError(); return; }
            if (loaded) {
                renderModuleTransition();
                return;
            }
        }
        saveAttemptAndFinish();
    }
}

// Экран-заставка между Module 1 и Module 2 (как в Listening)
function renderModuleTransition() {
    clearInterval(timerInterval); // таймер Module 1 больше не должен тикать на заставке
    readingPhase = 'transition';
    saveReadingProgress();
    const timerContainer = document.getElementById('engine-timer-container');
    if (timerContainer) timerContainer.classList.add('hidden');

    const contentDiv = document.getElementById('engine-content');
    const nextBtn = document.getElementById('engine-next');
    const prevBtn = document.getElementById('engine-prev');
    const reviewBtn = document.getElementById('engine-review');
    if (nextBtn) nextBtn.style.display = 'none';
    if (prevBtn) prevBtn.style.display = 'none';
    if (reviewBtn) reviewBtn.classList.add('hidden');

    const progressEl = document.getElementById('engine-progress');
    if (progressEl) progressEl.innerText = 'Module 2 Ready';

    contentDiv.innerHTML = `
        <div class="flex-1 flex flex-col items-center justify-center fade-in h-full p-8 w-full">
            <div class="bg-white p-10 rounded-[2rem] border border-slate-200/60 w-full max-w-lg text-center shadow-sm">
                <div class="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <i data-lucide="check-circle" class="w-8 h-8"></i>
                </div>
                <h2 class="text-2xl font-bold text-slate-900 mb-3">Module 1 Completed</h2>
                <p class="text-slate-500 mb-8 font-medium text-sm">The system has analyzed your responses and prepared the adaptive module.</p>
                <button onclick="startReadingModuleTwo()" class="px-8 py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-indigo-600 transition shadow-md w-full flex items-center justify-center cursor-pointer">
                    Start Module 2 <i data-lucide="arrow-right" class="w-5 h-5 ml-2"></i>
                </button>
            </div>
        </div>
    `;
    if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

function startReadingModuleTwo() {
    // Заставку могут вызвать и клик, и таймер: второй вызов сдвинул бы currentIndex
    // ещё раз и перескочил первый айтем Модуля 2.
    if (module2StartIndex !== null) return;

    const nextBtn = document.getElementById('engine-next');
    const prevBtn = document.getElementById('engine-prev');
    const reviewBtn = document.getElementById('engine-review');
    const timerContainer = document.getElementById('engine-timer-container');
    if (nextBtn) nextBtn.style.display = 'flex';
    if (prevBtn) prevBtn.style.display = 'flex';
    if (reviewBtn) reviewBtn.classList.remove('hidden');
    if (timerContainer) timerContainer.classList.remove('hidden');

    currentIndex++;
    module2StartIndex = currentIndex; // с этого индекса начинается Module 2 — Review не пустит раньше

    // Отдельный, свежий таймер именно для Module 2
    timeRemaining = moduleMinutes('2') * 60;
    startTimer();

    renderEngine();
}

// ---- Review в рамках текущего модуля (как в реальном TOEFL Reading) ----
function isReadingTaskAnswered(t) {
    if (t.type === 'complete_words') {
        // Блок = 10 айтемов и одна строка в Review, поэтому Answered только когда
        // заполнены все пропуски: иначе ученик увидит галочку и не вернётся к пустым.
        const total = (t.correctWords || []).length;
        if (!total) return false;
        const user = t.userWords || [];
        for (let k = 0; k < total; k++) {
            const w = user[k] ? String(user[k]) : '';
            if (!w.length || w.indexOf('_') !== -1) return false;
        }
        return true;
    }
    return t.userAnswer !== null && t.userAnswer !== undefined && t.userAnswer !== '';
}

function showReadingReview() {
    const startIdx = module2StartIndex !== null ? module2StartIndex : 0;
    const endIdx = currentTasks.length;

    const progressEl = document.getElementById('engine-progress');
    if (progressEl) progressEl.innerText = 'Review';
    const nextBtn = document.getElementById('engine-next');
    if (nextBtn) nextBtn.style.display = 'none';

    let listHTML = '';
    for (let i = startIdx; i < endIdx; i++) {
        const t = currentTasks[i];
        const displayNum = itemNumberLabel(i);
        const answered = isReadingTaskAnswered(t);
        listHTML += `
            <div class="flex justify-between items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 transition" onclick="returnToReadingTask(${i})">
                <div class="flex items-center gap-3">
                    <span class="min-w-8 h-8 px-2 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">${displayNum}</span>
                    <span class="font-bold text-slate-700">${t.type === 'complete_words' ? `Complete the Words ${displayNum}` : `Question ${displayNum}`}</span>
                </div>
                ${answered
                    ? `<span class="text-emerald-500 bg-emerald-50 px-3 py-1 rounded-lg font-bold text-xs flex items-center"><i data-lucide="check" class="w-3 h-3 mr-1"></i> Answered</span>`
                    : `<span class="text-rose-500 bg-rose-50 px-3 py-1 rounded-lg font-bold text-xs flex items-center"><i data-lucide="alert-circle" class="w-3 h-3 mr-1"></i> Not answered</span>`}
            </div>
        `;
    }

    document.getElementById('engine-content').innerHTML = `
        <div class="w-full h-full overflow-y-auto">
            <div class="p-4 md:p-8 max-w-3xl mx-auto w-full">
                <h2 class="text-2xl font-black text-slate-900 mb-6 text-center">Module Review</h2>
                <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
                    ${listHTML}
                </div>
            </div>
        </div>
    `;
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function returnToReadingTask(i) {
    currentIndex = i;
    renderEngine();
}

function prevTask() {
    if (currentIndex > 0) {
        currentIndex--;
        renderEngine();
    }
}

async function saveAttemptAndFinish() {
    clearInterval(timerInterval);
    const saveSession = readingSessionId;
    // Повторный вызов (таймер + клик одновременно) не должен сохранить попытку дважды
    if (window.__readingSaving === saveSession) return;
    window.__readingSaving = saveSession;
    
    const engineContent = document.getElementById('engine-content');
    engineContent.innerHTML = `<div class="m-auto flex flex-col items-center justify-center text-slate-500"><i data-lucide="loader-2" class="w-8 h-8 animate-spin mb-4 text-indigo-600"></i><p class="font-bold text-slate-700">Saving results to database...</p></div>`;
    lucide.createIcons();

    const result = calculateWeightedScore(currentTasks);

    // В тесте нет ни одного вопроса с отмеченным правильным ответом.
    // Раньше движок молча ставил 1.0 — поломанный тест выглядел как самый
    // низкий результат ученицы, и никто не догадывался, что виноват тест.
    if (!result) {
        clearInterval(timerInterval);
        engineContent.innerHTML = `<div class="m-auto max-w-md text-center p-8">
            <p class="text-lg font-bold text-rose-600 mb-2">Тест не удалось оценить</p>
            <p class="text-sm text-slate-500">В нём нет вопросов с отмеченным правильным ответом.
            Это ошибка в составе теста, а не в ваших ответах. Сообщите преподавателю.</p></div>`;
        console.error('[reading] нет ни одного оцениваемого вопроса — проверьте поле correct в заданиях теста');
        if (window.fullTestMode && typeof continueFullTestSequence === 'function') {
            alert('Reading: в тесте нет вопросов с отмеченным правильным ответом. Секция пропущена.');
            continueFullTestSequence({ skipped: true });
        }
        return;
    }

    const correctAnswers = result.correct;
    const totalQuestions = result.total;
    const finalScore = result.score;

    readingPhase = 'saving';
    const attemptId = mtUuid();
    const answersToSave = currentTasks.map((task, idx) => {
        let isCorrect = false;
        let answerText = null;
        let answerJson = { question: task.question, stage: task.stage, order: idx };

        if (task.type === 'complete_words') {
            // Кладём частичный результат, чтобы потом было видно «7 из 10»,
            // а не только голое true/false.
            const sc = scoreCompleteWords(task);
            answerJson.userWords = task.userWords;
            answerJson.correctWords = task.correctWords;
            answerJson.correctCount = sc.correct;
            answerJson.totalCount = sc.total;
            isCorrect = sc.correct === sc.total && sc.total > 0;
        } else {
            answerText = task.userAnswer;
            isCorrect = task.userAnswer === task.correctAnswer;
        }

        return {
            id: mtUuid(),
            attempt_id: attemptId,
            task_id: task.taskId || 0,
            task_type: task.type,
            answer_text: answerText,
            answer_json: answerJson,
            is_correct: isCorrect
        };
    });

    // Сначала результат ложится в очередь на устройстве, потом уходит в базу.
    // Если связи нет — он отправится сам, когда интернет вернётся.
    const res = await mtSubmit({
        section: 'reading',
        attempt: { table: 'big_mock_attempts', row: {
            id: attemptId,
            test_id: currentActiveTestId,
            section_name: 'reading',
            user_id: window.currentUser.id,
            total_score: parseFloat(finalScore),
            status: 'completed',
            completed_at: new Date().toISOString()
        } },
        answers: { table: 'big_mock_answers', rows: answersToSave }
    });
    readingPhase = 'done';
    if (!res.ok) {
        console.error("Error saving test:", res.error);
        alert('Нет связи с сервером — результат Reading сохранён на этом устройстве и отправится автоматически, когда интернет вернётся.\n\n'
            + (res.error && res.error.message ? res.error.message : res.error));
    }

    if (!readingAlive(saveSession)) return;
    if (window.fullTestMode && typeof continueFullTestSequence === 'function') { continueFullTestSequence(); return; }
    renderResultsUI(currentTasks, finalScore, correctAnswers, totalQuestions);
}

async function loadReviewMode(attemptId, testId, testTitle) {
    window.engineType = 'reading';
    readingSessionId++;
    clearInterval(timerInterval);
    document.getElementById('view-tests-grid').classList.add('hidden');
    document.getElementById('main-interface').classList.add('hidden');

    const resultsView = document.getElementById('results-view');
    resultsView.className = 'fixed inset-0 z-50 bg-[#f8f9fa] overflow-y-auto';
    resultsView.innerHTML = `<div class="min-h-full flex items-center justify-center text-slate-500"><div class="text-center"><i data-lucide="loader-2" class="w-8 h-8 animate-spin mb-4 text-indigo-600 mx-auto"></i><p class="font-bold">Reconstructing your past attempt...</p></div></div>`;
    if (typeof lucide !== 'undefined') lucide.createIcons();

    try {
        currentActiveTestId = testId;
        if (testTitle) document.getElementById('dynamic-test-title').innerText = testTitle;

        const { data: attempt, error: attErr } = await supabaseClient.from('big_mock_attempts').select('*').eq('id', attemptId).single();
        if (attErr) throw attErr;
        const { data: answersRaw, error: ansErr } = await supabaseClient.from('big_mock_answers').select('*').eq('attempt_id', attemptId);
        if (ansErr) throw ansErr;
        const answers = answersRaw || [];

        const [stage1, stage2E, stage2H] = await Promise.all([
            fetchAndParseTasks(testId, '1'),
            fetchAndParseTasks(testId, '2_easy'),
            fetchAndParseTasks(testId, '2_hard')
        ]);

        // Какая ветка была у ученицы. Новые попытки хранят stage в answer_json —
        // это точно. Для старых попыток угадываем по task_id (как раньше).
        const savedStages = new Set(answers.map(a => a.answer_json && a.answer_json.stage).filter(Boolean).map(String));
        let tookEasy, tookHard;
        if (savedStages.size > 0) {
            tookEasy = savedStages.has('2_easy');
            tookHard = savedStages.has('2_hard');
        } else {
            const stage1Ids = new Set(stage1.map(t => String(t.taskId)));
            const answerTaskIds = new Set(answers.map(a => String(a.task_id)));
            const onlyIn = (tasks) => tasks.some(t => answerTaskIds.has(String(t.taskId)) && !stage1Ids.has(String(t.taskId)));
            tookEasy = onlyIn(stage2E);
            tookHard = onlyIn(stage2H);
            if (tookEasy && tookHard) tookEasy = false; // обе ветки сразу быть не может
        }

        let reconstructedTasks = [...stage1];
        if (tookEasy) reconstructedTasks = reconstructedTasks.concat(stage2E);
        if (tookHard) reconstructedTasks = reconstructedTasks.concat(stage2H);

        // Каждый сохранённый ответ используем один раз: если в пассаже два
        // вопроса с одинаковым текстом, они больше не получают один и тот же ответ.
        const used = new Set();
        const takeAnswer = (pred) => {
            const idx = answers.findIndex((a, i) => !used.has(i) && pred(a));
            if (idx === -1) return null;
            used.add(idx);
            return answers[idx];
        };
        const stageMatches = (a, task) => !(a.answer_json && a.answer_json.stage) || String(a.answer_json.stage) === String(task.stage);

        let correctCount = 0;
        let totalCount = 0;

        reconstructedTasks.forEach(task => {
            if (task.type === 'complete_words') {
                const ans = takeAnswer(a => String(a.task_id) === String(task.taskId) && a.task_type === 'complete_words' && stageMatches(a, task));
                if (ans && ans.answer_json) task.userWords = ans.answer_json.userWords || [];
                const sc = scoreCompleteWords(task);
                totalCount += sc.total;
                correctCount += sc.correct;
            } else {
                const ans = takeAnswer(a => String(a.task_id) === String(task.taskId) && a.answer_json && a.answer_json.question === task.question && stageMatches(a, task));
                if (ans) task.userAnswer = (task.qType === 'Select a Sentence' && ans.answer_text) ? normSentence(ans.answer_text) : ans.answer_text;
                if (task.correctAnswer !== null && task.correctAnswer !== undefined) {
                    totalCount++;
                    if (task.userAnswer === task.correctAnswer) correctCount++;
                }
            }
        });

        renderResultsUI(reconstructedTasks, attempt.total_score, correctCount, totalCount);

    } catch (err) {
        console.error("Error loading review:", err);
        alert("Не удалось открыть разбор Reading.\n\n" + (err.message || err));
        closeResults();
    }
}

function renderResultsUI(tasksArray, finalScore, correctAnswers, totalQuestions) {
    document.getElementById('exam-engine-view').classList.add('hidden');
    document.getElementById('exam-engine-view').classList.remove('flex');
    document.getElementById('main-interface').classList.add('hidden');
    
    const resultsView = document.getElementById('results-view');
    resultsView.className = 'fixed inset-0 z-50 bg-[#f8f9fa] overflow-y-auto';

    const modules = {};

    tasksArray.forEach((task, index) => {
        let stageName = task.stage.startsWith('2') ? 'Module 2' : 'Module 1';
        if (!modules[stageName]) modules[stageName] = [];

        let pObj = modules[stageName].find(p => p.title === task.title && p.type === task.type);
        if (!pObj) {
            pObj = { title: task.title, type: task.type, passage: task.passage, layout: task.layout, questions: [] };
            modules[stageName].push(pObj);
        }
        pObj.questions.push({...task, globalIndex: index + 1});
    });

    let blocksHtml = '';

    Object.keys(modules).forEach(modName => {
        blocksHtml += `<div class="mt-12 mb-6 font-extrabold text-2xl text-slate-800 border-b pb-3 border-gray-200 uppercase tracking-wide">${modName}</div>`;

        modules[modName].forEach(pObj => {
            let passageQuestionsHtml = '';

            pObj.questions.forEach(q => {
                if (q.type === 'complete_words') {
                    let wordsListHtml = '';
                    if (q.correctWords && q.userWords) {
                        q.correctWords.forEach((correctWord, i) => {
                            let userW = q.userWords[i] || '_'.repeat(correctWord.length);
                            let displayUserW = userW.replace(/_/g, '-');
                            let isCorrect = userW.toLowerCase() === correctWord.toLowerCase();
                            
                            wordsListHtml += `
                                <div class="p-4 rounded-xl border mb-3 flex flex-row items-center justify-between gap-4 ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}">
                                    <div class="flex items-center space-x-2">
                                        <span class="text-[11px] font-bold opacity-70 uppercase tracking-wider ${isCorrect ? 'text-green-800' : 'text-red-800'} mr-2">GAP ${i + 1}</span>
                                        <span class="w-10 font-bold text-slate-400 text-[10px] uppercase tracking-wider text-right">You:</span> 
                                        <span class="font-mono ${isCorrect ? 'text-green-900 font-bold' : 'text-red-900 font-bold'} tracking-widest text-[15px]">${displayUserW}</span>
                                    </div>
                                    ${!isCorrect ? `
                                    <div class="flex items-center space-x-2 border-l border-red-200 pl-4">
                                        <span class="w-16 font-bold text-slate-400 text-[10px] uppercase tracking-wider text-right">Correct:</span> 
                                        <span class="font-mono text-slate-900 font-bold tracking-widest text-[15px]">${correctWord}</span>
                                    </div>` : ''}
                                    <div class="flex-shrink-0">
                                        ${isCorrect ? '<div class="w-5 h-5 bg-green-500 text-white rounded-md flex items-center justify-center"><i data-lucide="check" class="w-3.5 h-3.5"></i></div>' : '<div class="w-5 h-5 bg-red-500 text-white rounded-md flex items-center justify-center"><i data-lucide="x" class="w-3.5 h-3.5"></i></div>'}
                                    </div>
                                </div>`;
                        });
                    }

                    passageQuestionsHtml += `<div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-4"><div class="flex justify-between items-center mb-5"><span class="bg-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center shadow-sm"><i data-lucide="puzzle" class="w-3 h-3 mr-1"></i> COMPLETE WORDS</span></div><h4 class="font-bold text-slate-900 mb-5 text-[15px]">Word Puzzle Breakdown</h4><div class="space-y-1">${wordsListHtml || '<div class="text-sm text-slate-500">No data available</div>'}</div></div>`;
                    return;
                }

                let optionsHtml = '';
                if (q.qType === 'Select a Sentence' || q.qType === 'Insert Text') {
                    let isCorrect = q.userAnswer === q.correctAnswer;
                    optionsHtml = `
                        <div class="p-4 rounded-xl border flex flex-row items-center justify-between gap-4 ${isCorrect ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}">
                            <div class="flex-1">
                                <div class="text-[10px] uppercase tracking-wider font-bold mb-1 opacity-70">Your Answer:</div>
                                <div class="text-sm font-medium">${q.userAnswer || 'No answer'}</div>
                            </div>
                            ${!isCorrect ? `
                            <div class="flex-1 border-l pl-4 border-red-200">
                                <div class="text-[10px] uppercase tracking-wider font-bold mb-1 opacity-70">Correct Answer:</div>
                                <div class="text-sm font-medium">${q.correctAnswer}</div>
                            </div>` : ''}
                        </div>`;
                } else if (q.options) {
                    optionsHtml = q.options.map(opt => {
                        let isUserChoice = (q.userAnswer === opt);
                        let isCorrectChoice = (q.correctAnswer === opt);
                        let boxClass = "bg-white border-gray-200 text-slate-600";
                        let iconBox = '<div class="w-5 h-5 rounded-full border border-gray-300 mr-3 flex-shrink-0 bg-gray-50"></div>';

                        if (isCorrectChoice && isUserChoice) { boxClass = "bg-green-50 border-green-400 text-green-900 shadow-sm"; iconBox = `<div class="w-5 h-5 rounded bg-green-500 text-white flex items-center justify-center mr-3 flex-shrink-0"><i data-lucide="check" class="w-3.5 h-3.5"></i></div>`; }
                        else if (isUserChoice && !isCorrectChoice) { boxClass = "bg-red-50 border-red-300 text-red-900 shadow-sm"; iconBox = `<div class="w-5 h-5 rounded bg-red-500 text-white flex items-center justify-center mr-3 flex-shrink-0"><i data-lucide="x" class="w-3.5 h-3.5"></i></div>`; }
                        else if (!isUserChoice && isCorrectChoice) { boxClass = "bg-green-50 border-green-400 text-green-900 shadow-sm"; iconBox = `<div class="w-5 h-5 rounded bg-green-500 text-white flex items-center justify-center mr-3 flex-shrink-0"><i data-lucide="check" class="w-3.5 h-3.5"></i></div>`; }

                        return `<div class="flex items-center justify-between p-3 border rounded-xl mb-2.5 ${boxClass} transition-colors">
                            <div class="flex items-center"><div class="mr-3">${iconBox}</div><span class="text-sm font-medium">${opt}</span></div>
                            ${isUserChoice && !isCorrectChoice ? `<span class="text-[10px] font-bold text-red-700 uppercase tracking-wider ml-4">Your Answer</span>` : ''}
                            ${isCorrectChoice ? `<span class="text-[10px] font-bold text-green-700 uppercase tracking-wider ml-4">Correct Answer</span>` : ''}
                        </div>`;
                    }).join('');
                }

                let badgeLabel = q.qType ? q.qType.toUpperCase() : 'DETAIL';
                passageQuestionsHtml += `<div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-4 relative overflow-hidden"><div class="flex justify-between items-center mb-5"><span class="bg-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center"><i data-lucide="target" class="w-3 h-3 mr-1"></i> TYPE: ${badgeLabel}</span><span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Q${q.globalIndex}</span></div><h4 class="font-bold text-slate-900 mb-5 text-[15px] leading-relaxed">${q.question}</h4><div class="space-y-1">${optionsHtml}</div>${q.explanation ? `<div class="mt-5 p-4 bg-amber-50 text-amber-900 text-sm rounded-xl border border-amber-100 leading-relaxed"><strong class="font-bold uppercase tracking-wider text-[10px] block mb-1.5 opacity-60">Explanation</strong> ${q.explanation}</div>` : ''}</div>`;
            });

            let renderedPassage = '';
            if (pObj.type === 'daily_life') {
                renderedPassage = renderDailyLifeLayout(pObj.passage, pObj.layout, pObj.title);
            } else if (pObj.type === 'complete_words') {
                let taskData = pObj.questions[0]; 
                let reviewPassage = pObj.passage; 
                if (taskData && taskData.originalPassage && taskData.correctWords) {
                    let gapIdx = 0;
                    reviewPassage = taskData.originalPassage.replace(/(?:\[[a-zA-Z]\])+/g, (match) => {
                        let correctWord = taskData.correctWords[gapIdx];
                        let simpleHtml = `<span class="inline-flex mx-1 px-1.5 py-0.5 rounded text-sm font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-sm">${correctWord}</span>`;
                        gapIdx++;
                        return simpleHtml;
                    });
                }
                renderedPassage = `<div class="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm"><div class="text-slate-800 leading-loose text-sm">${reviewPassage}</div></div>`;
            } else {
                renderedPassage = `<div class="bg-white p-8 border border-gray-200 rounded-2xl shadow-sm text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">${pObj.passage}</div>`;
            }
            
            let passageTitle = pObj.type === 'academic' ? 'Academic Text' : (pObj.type === 'complete_words' ? 'Word Puzzle Text' : 'Reading Passage');

            blocksHtml += `<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 items-start"><div class="space-y-4 lg:sticky lg:top-6"><h3 class="text-lg font-bold text-slate-900 bg-slate-100 px-4 py-2 rounded-xl inline-block">${passageTitle}: ${pObj.title}</h3>${renderedPassage}</div><div class="space-y-4">${passageQuestionsHtml}</div></div>`;
        });
    });

    resultsView.innerHTML = `
        <div class="w-full min-h-full p-6 md:p-10 bg-[#f8f9fa]">
            <div class="max-w-7xl mx-auto">
                <div class="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm text-center mb-10 relative overflow-hidden max-w-2xl mx-auto">
                    <div class="w-16 h-16 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-inner">🏆</div>
                    <h2 class="text-2xl font-bold text-slate-900 mb-8">Review Mode</h2>
                    <div class="flex justify-center items-center mb-8">
                        <div class="px-8 text-center border-r border-gray-100">
                            <div class="text-6xl font-extrabold text-indigo-600 mb-2">${finalScore}</div>
                            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Est. Band Score</div>
                        </div>
                        <div class="px-8 text-center">
                            <div class="text-3xl font-bold text-slate-700 mb-2 mt-2">${correctAnswers} <span class="text-gray-300 text-xl">/</span> <span class="text-gray-400 text-2xl">${totalQuestions}</span></div>
                            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Raw Score</div>
                        </div>
                    </div>
                    <div class="flex justify-center space-x-3">
                        <button onclick="startExamEngine(currentActiveTestId, document.getElementById('dynamic-test-title').innerText)" class="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-indigo-600 transition shadow-md text-sm flex items-center">
                            <i data-lucide="rotate-ccw" class="w-4 h-4 mr-2"></i> Retake Test
                        </button>
                        <button onclick="closeResults()" class="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition shadow-sm text-sm">
                            Back to Dashboard
                        </button>
                    </div>
                </div>
                <div class="flex items-center space-x-2 mb-8 text-yellow-500 justify-center">
                    <i data-lucide="lightbulb" class="w-6 h-6"></i><h3 class="text-xl font-bold text-slate-900">Review Answers & Explanations</h3>
                </div>
                <div class="space-y-6">${blocksHtml}</div>
            </div>
        </div>
    `;
    lucide.createIcons();
}

function closeResults() {
    if (typeof exitExamEngine === 'function') { exitExamEngine(); return; }
    document.getElementById('results-view').classList.add('hidden');
    document.getElementById('results-view').classList.remove('flex');
    document.getElementById('main-interface').classList.remove('hidden');
    loadTestsGrid();
}
