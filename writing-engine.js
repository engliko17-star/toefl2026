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
// ИНИЦИАЛИЗАЦИЯ SUPABASE & ГЛОБАЛЬНЫХ ПЕРЕМЕННЫХ
// ==========================================
function getSupabaseClient() {
    if (window.supabaseClient) {
        return window.supabaseClient;
    }
    if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
        // Резервная инициализация, если вдруг клиент еще не создан в auth.js
        window.supabaseClient = window.supabase.createClient(
            'https://gmsdixqjhlycovsgwbzq.supabase.co',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdtc2RpeHFqaGx5Y292c2d3YnpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NTEwODIsImV4cCI6MjA5NTAyNzA4Mn0.gPEOviqSGTuczqoSHvb_BX4mBSdxjh8Bg6BV13l58LQ'
        );
        return window.supabaseClient;
    }
    console.warn("Supabase SDK is not loaded yet.");
    return null;
}

let writingTasks = [];
let writingIndex = 0;
let writingTimerInterval = null;
let writingTimeRemaining = 29 * 60; // 29 минут по умолчанию для Writing
let writingUserAnswers = {}; // { taskId: "text essay" }
let currentActiveTestId = null;

// Помогаем globalNext / globalPrev из tests.html правильно направлять вызовы
window.globalNext = function() {
    if (window.engineType === 'reading' && typeof nextTask === 'function') nextTask();
    else if (window.engineType === 'listening' && typeof handleListeningNextStep === 'function') handleListeningNextStep();
    else if (window.engineType === 'writing') nextWritingTask();
};

window.globalPrev = function() {
    if (window.engineType === 'reading' && typeof prevTask === 'function') prevTask();
    else if (window.engineType === 'writing') prevWritingTask();
};

// ==========================================
// 1. ЗАГРУЗКА ЗАДАНИЙ СЕКЦИИ WRITING
// ==========================================
async function fetchAndParseWritingTasks(testId) {
    let parsedTasks = [];
    const client = getSupabaseClient();
    if (!client) return parsedTasks;

    // Попытка 1: Загрузка из таблицы связей full_test_writing_tasks
    const { data: plan, error: planErr } = await client
        .from('full_test_writing_tasks')
        .select('*')
        .eq('test_id', testId)
        .order('order_num', { ascending: true });

    if (!planErr && plan && plan.length > 0) {
        for (let step of plan) {
            const { data: taskData } = await client
                .from('writing_tasks')
                .select('*')
                .eq('id', step.task_id)
                .single();

            if (taskData) {
                parsedTasks.push({
                    taskId: taskData.id,
                    type: taskData.task_type || step.task_type || 'academic_discussion',
                    title: taskData.title || `Task ${parsedTasks.length + 1}`,
                    prompt: taskData.prompt || taskData.question || '',
                    passage: taskData.passage || taskData.reading_passage || '',
                    audioUrl: taskData.audio_url || null,
                    minWords: taskData.min_words || 100
                });
            }
        }
    } else {
        // Попытка 2: Резервная загрузка из общих full_test_tasks
        const { data: fallbackPlan } = await client
            .from('full_test_tasks')
            .select('*')
            .eq('test_id', testId)
            .eq('stage', 'writing')
            .order('order_num', { ascending: true });

        if (fallbackPlan && fallbackPlan.length > 0) {
            for (let step of fallbackPlan) {
                const { data: taskData } = await client
                    .from('writing_tasks')
                    .select('*')
                    .eq('id', step.task_id)
                    .single();

                if (taskData) {
                    parsedTasks.push({
                        taskId: taskData.id,
                        type: taskData.task_type || 'academic_discussion',
                        title: taskData.title || 'Writing Task',
                        prompt: taskData.prompt || taskData.question || '',
                        passage: taskData.passage || '',
                        audioUrl: taskData.audio_url || null,
                        minWords: taskData.min_words || 100
                    });
                }
            }
        }
    }
    return parsedTasks;
}

// ==========================================
// 2. СТАРТ ДВИЖКА WRITING
// ==========================================
async function startWritingEngine(testId, testTitle) {
    window.engineType = 'writing';
    currentActiveTestId = testId;
    writingUserAnswers = {};
    writingIndex = 0;

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
        writingTasks = await fetchAndParseWritingTasks(testId);

        if (writingTasks.length === 0) {
            alert("This Writing section has no tasks configured in Supabase!");
            exitExamEngine();
            return;
        }

        document.getElementById('engine-title').innerText = `Writing Section — ${testTitle}`;
        writingTimeRemaining = 29 * 60;
        startWritingTimer();
        renderWritingEngine();

    } catch (err) {
        console.error("Writing Engine crash:", err);
        alert("Error loading Writing tasks structure.");
        exitExamEngine();
    }
}

// ==========================================
// 3. РЕНДЕРИНГ ИНТЕРФЕЙСА ДВИЖКА
// ==========================================
function renderWritingEngine() {
    const task = writingTasks[writingIndex];
    if (!task) return;

    const contentDiv = document.getElementById('engine-content');
    
    document.getElementById('engine-progress').innerText = `Task ${writingIndex + 1} / ${writingTasks.length}`;
    
    const prevBtn = document.getElementById('engine-prev');
    if (prevBtn) prevBtn.disabled = (writingIndex === 0);

    const nextBtn = document.getElementById('engine-next');
    if (nextBtn) {
        nextBtn.disabled = false;
        nextBtn.innerHTML = (writingIndex === writingTasks.length - 1)
            ? 'Submit Writing <i data-lucide="check" class="w-4 h-4 ml-1"></i>'
            : 'Next Task <i data-lucide="chevron-right" class="w-4 h-4 ml-1"></i>';
    }

    const currentSavedText = writingUserAnswers[task.taskId] || '';
    const wordCount = countWords(currentSavedText);

    let typeLabel = task.type === 'integrated' ? 'INTEGRATED TASK' : 'ACADEMIC DISCUSSION';

    contentDiv.innerHTML = `
        <div class="flex flex-col lg:flex-row w-full h-full custom-scrollbar overflow-y-auto lg:overflow-hidden bg-[#f8f9fa]">
            
            <section class="w-full lg:w-1/2 p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-slate-200 overflow-y-auto custom-scrollbar bg-white flex flex-col">
                <div class="flex items-center space-x-2 mb-4">
                    <span class="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-100 rounded-lg text-[11px] font-bold uppercase tracking-wider">
                        ${typeLabel}
                    </span>
                    <span class="text-xs text-slate-400 font-medium">Recommended length: ${task.minWords}+ words</span>
                </div>

                <h2 class="text-xl font-bold text-slate-900 mb-4">${task.title}</h2>

                ${task.audioUrl ? `
                    <div class="mb-6 p-4 bg-purple-50/50 border border-purple-100 rounded-2xl flex items-center space-x-3">
                        <i data-lucide="volume-2" class="w-5 h-5 text-purple-600 shrink-0"></i>
                        <audio src="${task.audioUrl}" controls class="w-full outline-none h-8"></audio>
                    </div>
                ` : ''}

                ${task.passage ? `
                    <div class="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 mb-6 text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-wrap">
                        ${task.passage}
                    </div>
                ` : ''}

                <div class="bg-white border-2 border-slate-800 rounded-2xl p-6 shadow-xs mt-auto">
                    <h3 class="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Question / Task Prompt</h3>
                    <div class="text-slate-900 font-semibold text-base leading-relaxed">${task.prompt}</div>
                </div>
            </section>

            <section class="w-full lg:w-1/2 p-6 lg:p-8 bg-[#f8f9fa] flex flex-col justify-between h-full">
                <div class="flex-1 flex flex-col bg-white border border-slate-200 rounded-3xl p-6 shadow-xs relative">
                    <div class="flex justify-between items-center mb-3 pb-3 border-b border-slate-100">
                        <span class="text-xs font-bold text-slate-500 flex items-center">
                            <i data-lucide="pen-tool" class="w-3.5 h-3.5 mr-1.5 text-purple-600"></i> Your Response
                        </span>
                        <div class="flex items-center space-x-3">
                            <span id="writing-word-count" class="text-xs font-extrabold px-2.5 py-1 rounded-md ${wordCount >= task.minWords ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'}">
                                Words: ${wordCount}
                            </span>
                        </div>
                    </div>

                    <textarea 
                        id="writing-textarea"
                        oninput="handleEssayInput(${task.taskId}, ${task.minWords})"
                        placeholder="Type your response here..."
                        class="w-full flex-1 min-h-[300px] lg:min-h-0 bg-transparent text-slate-800 text-base leading-relaxed outline-none resize-none font-sans"
                    >${currentSavedText}</textarea>
                </div>
            </section>

        </div>
    `;

    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

// ==========================================
// 4. ОБРАБОТКА ВВОДА И ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ==========================================
function countWords(str) {
    if (!str) return 0;
    const matches = str.trim().match(/\b[\w'-]+\b/g);
    return matches ? matches.length : 0;
}

function handleEssayInput(taskId, minWords) {
    const textarea = document.getElementById('writing-textarea');
    if (!textarea) return;

    const text = textarea.value;
    writingUserAnswers[taskId] = text;

    const words = countWords(text);
    const counterBadge = document.getElementById('writing-word-count');
    if (counterBadge) {
        counterBadge.innerText = `Words: ${words}`;
        if (words >= minWords) {
            counterBadge.className = 'text-xs font-extrabold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200';
        } else {
            counterBadge.className = 'text-xs font-extrabold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600';
        }
    }
}

function nextWritingTask() {
    if (writingIndex < writingTasks.length - 1) {
        writingIndex++;
        renderWritingEngine();
    } else {
        saveWritingAttemptAndFinish();
    }
}

function prevWritingTask() {
    if (writingIndex > 0) {
        writingIndex--;
        renderWritingEngine();
    }
}

function startWritingTimer() {
    clearInterval(writingTimerInterval);
    const timerEl = document.getElementById('engine-timer');

    writingTimerInterval = setInterval(() => {
        writingTimeRemaining--;

        if (writingTimeRemaining <= 0) {
            clearInterval(writingTimerInterval);
            alert("Time is up! Submitting your Writing response...");
            saveWritingAttemptAndFinish();
            return;
        }

        let m = Math.floor(writingTimeRemaining / 60);
        let s = writingTimeRemaining % 60;
        if (timerEl) {
            timerEl.innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
        }
    }, 1000);
}

// ==========================================
// 5. СОХРАНЕНИЕ ПОПЫТКИ И ВЫВОД РЕЗУЛЬТАТОВ
// ==========================================
async function saveWritingAttemptAndFinish() {
    clearInterval(writingTimerInterval);
    const client = getSupabaseClient();

    const contentDiv = document.getElementById('engine-content');
    contentDiv.innerHTML = `
        <div class="m-auto flex flex-col items-center justify-center text-slate-500">
            <i data-lucide="loader-2" class="w-10 h-10 animate-spin mb-4 text-purple-600"></i>
            <p class="font-bold text-slate-700 text-lg">Saving writing responses...</p>
        </div>
    `;
    if (typeof lucide !== 'undefined') lucide.createIcons();

    let totalWords = 0;
    writingTasks.forEach(task => {
        totalWords += countWords(writingUserAnswers[task.taskId] || '');
    });

    let estimatedScore = totalWords > 200 ? "5.0" : totalWords > 100 ? "4.0" : "3.0";

    if (client) {
        try {
            let attemptId = null;

            const { data: attempt, error: attErr } = await client
                .from('big_mock_writing_attempts')
                .insert([{
                    test_id: currentActiveTestId,
                    total_score: parseFloat(estimatedScore),
                    status: 'completed',
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
                        test_id: currentActiveTestId,
                        section_name: 'writing',
                        total_score: parseFloat(estimatedScore),
                        status: 'completed',
                        completed_at: new Date().toISOString()
                    }])
                    .select()
                    .single();
                if (fallbackAttempt) attemptId = fallbackAttempt.id;
            }

            if (attemptId) {
                const answersToSave = writingTasks.map(task => ({
                    attempt_id: attemptId,
                    task_id: task.taskId,
                    task_type: task.type,
                    essay_text: writingUserAnswers[task.taskId] || '',
                    word_count: countWords(writingUserAnswers[task.taskId] || '')
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

    renderWritingReviewUI(estimatedScore, totalWords);
}

// ==========================================
// 6. РЕЖИМ РЕВЬЮ / ПРОСМОТРА РЕЗУЛЬТАТОВ
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
        currentActiveTestId = testId;
        writingTasks = await fetchAndParseWritingTasks(testId);

        let savedAnswers = [];
        if (client) {
            const { data: ans1 } = await client.from('big_mock_writing_answers').select('*').eq('attempt_id', attemptId);
            if (ans1) savedAnswers = ans1;
            else {
                const { data: ans2 } = await client.from('big_mock_answers').select('*').eq('attempt_id', attemptId);
                if (ans2) savedAnswers = ans2;
            }
        }

        let totalWords = 0;
        writingTasks.forEach(task => {
            const match = savedAnswers.find(a => a.task_id === task.taskId);
            const text = match ? (match.essay_text || match.answer_text || '') : '';
            writingUserAnswers[task.taskId] = text;
            totalWords += countWords(text);
        });

        renderWritingReviewUI("Submitted", totalWords);

    } catch (err) {
        console.error("Error loading writing review:", err);
        alert("Could not load review mode.");
        exitExamEngine();
    }
}

function renderWritingReviewUI(score, totalWords) {
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

    let tasksHtml = writingTasks.map((task, idx) => {
        const essay = writingUserAnswers[task.taskId] || 'No response submitted.';
        const words = countWords(essay);

        return `
            <div class="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm mb-8">
                <div class="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                    <span class="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-lg">
                        Task ${idx + 1}: ${task.type.toUpperCase()}
                    </span>
                    <span class="text-xs font-extrabold text-slate-500">
                        Words written: ${words}
                    </span>
                </div>

                <h3 class="text-lg font-bold text-slate-900 mb-3">${task.title}</h3>
                <div class="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-sm text-slate-700 mb-6 font-medium">
                    ${task.prompt}
                </div>

                <div class="mt-4">
                    <h4 class="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Submitted Response</h4>
                    <div class="p-6 bg-white border border-slate-200 rounded-2xl text-slate-800 leading-relaxed font-normal whitespace-pre-wrap text-sm">
                        ${essay}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    resultsView.innerHTML = `
        <div class="w-full h-full overflow-y-auto custom-scrollbar p-6 md:p-10 bg-[#f8f9fa]">
            <div class="max-w-5xl mx-auto">
                <div class="bg-white rounded-[2rem] p-8 border border-purple-100 shadow-sm text-center mb-10 relative overflow-hidden max-w-2xl mx-auto">
                    <div class="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-inner">
                        ✍️
                    </div>
                    <h2 class="text-2xl font-bold text-slate-900 mb-2">Writing Section Completed</h2>
                    <p class="text-xs text-slate-400 mb-6 font-medium">Response saved for review</p>

                    <div class="flex justify-center items-center mb-8">
                        <div class="px-8 text-center border-r border-gray-100">
                            <div class="text-5xl font-extrabold text-purple-600 mb-1">${score}</div>
                            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status / Est. Score</div>
                        </div>
                        <div class="px-8 text-center">
                            <div class="text-3xl font-bold text-slate-700 mb-1 mt-1">${totalWords}</div>
                            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Words</div>
                        </div>
                    </div>

                    <div class="flex justify-center space-x-3">
                        <button onclick="startWritingEngine(currentActiveTestId, document.getElementById('dynamic-test-title').innerText)" class="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-purple-600 transition shadow-md text-sm flex items-center cursor-pointer">
                            <i data-lucide="rotate-ccw" class="w-4 h-4 mr-2"></i> Retake Writing
                        </button>
                        <button onclick="exitExamEngine()" class="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition shadow-sm text-sm cursor-pointer">
                            Back to Dashboard
                        </button>
                    </div>
                </div>

                <div class="space-y-6">${tasksHtml}</div>
            </div>
        </div>
    `;
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// ==========================================
// 7. УНИВЕРСАЛЬНЫЙ OPEN TEST VIEW DEDICATED FOR TESTS.HTML
// ==========================================
async function openTestView(testId, title, emoji) {
    currentActiveTestId = testId;
    const client = getSupabaseClient(); // Используем безопасный клиент

    document.getElementById('view-tests-grid').classList.add('hidden');
    document.getElementById('view-test-detail').classList.remove('hidden');

    document.getElementById('dynamic-test-title').innerText = title;
    document.getElementById('dynamic-emoji-container').innerText = emoji || '📝';

    const sections = [
        { name: 'reading', scoreId: 'reading-score-container', actionId: 'reading-action-buttons', startFn: 'startExamEngine', reviewFn: 'loadReviewMode', table: 'big_mock_attempts' },
        { name: 'listening', scoreId: 'listening-score-container', actionId: 'listening-action-buttons', startFn: 'startListeningEngine', reviewFn: 'loadListeningReviewMode', table: 'big_mock_listening_attempts' },
        { name: 'writing', scoreId: 'writing-score-container', actionId: 'writing-action-buttons', startFn: 'startWritingEngine', reviewFn: 'loadWritingReviewMode', table: 'big_mock_writing_attempts' }
    ];

    for (let sec of sections) {
        const scoreEl = document.getElementById(sec.scoreId);
        const actionEl = document.getElementById(sec.actionId);

        if (scoreEl) scoreEl.innerHTML = '<div class="text-xs text-gray-400 flex items-center"><i data-lucide="loader-2" class="w-3 h-3 mr-1 animate-spin"></i> Checking...</div>';
        if (actionEl) actionEl.innerHTML = '';

        try {
            let attempt = null;

            if (client) {
                // Сначала пробуем специфичную таблицу
                const { data: specificData } = await client
                    .from(sec.table)
                    .select('*')
                    .eq('test_id', testId)
                    .order('completed_at', { ascending: false })
                    .limit(1);

                if (specificData && specificData.length > 0) {
                    attempt = specificData[0];
                } else {
                    // Иначе проверяем общую таблицу big_mock_attempts
                    const { data: commonData } = await client
                        .from('big_mock_attempts')
                        .select('*')
                        .eq('test_id', testId)
                        .eq('section_name', sec.name)
                        .order('completed_at', { ascending: false })
                        .limit(1);

                    if (commonData && commonData.length > 0) attempt = commonData[0];
                }
            }

            if (attempt && attempt.status === 'completed') {
                if (scoreEl) {
                    scoreEl.innerHTML = `
                        <div class="inline-flex items-center bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg shadow-xs">
                            <span class="text-[10px] font-bold text-green-800 uppercase tracking-wider mr-2">Est. Score</span>
                            <span class="text-lg font-extrabold text-green-600">${attempt.total_score}</span>
                        </div>
                    `;
                }
                if (actionEl) {
                    actionEl.innerHTML = `
                        <button onclick="${sec.reviewFn}('${attempt.id}', ${testId}, '${title}')" class="flex-1 py-2.5 bg-white border border-gray-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition text-sm flex items-center justify-center shadow-xs">
                            <i data-lucide="search" class="w-4 h-4 mr-1.5"></i> Review
                        </button>
                        <button onclick="${sec.startFn}(${testId}, '${title}')" class="flex-1 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-indigo-600 transition text-sm flex items-center justify-center shadow-xs">
                            Retake <i data-lucide="rotate-cw" class="w-4 h-4 ml-1.5"></i>
                        </button>
                    `;
                }
            } else {
                if (scoreEl) scoreEl.innerHTML = '';
                if (actionEl) {
                    actionEl.innerHTML = `
                        <button onclick="${sec.startFn}(${testId}, '${title}')" class="w-full text-center py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-indigo-600 transition text-sm flex items-center justify-center shadow-xs">
                            Start Section <i data-lucide="arrow-right" class="w-4 h-4 ml-1.5"></i>
                        </button>
                    `;
                }
            }
        } catch (e) {
            console.error(`Error checking attempt for section ${sec.name}:`, e);
            if (scoreEl) scoreEl.innerHTML = '';
            if (actionEl) {
                actionEl.innerHTML = `
                    <button onclick="${sec.startFn}(${testId}, '${title}')" class="w-full text-center py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-indigo-600 transition text-sm flex items-center justify-center shadow-xs">
                        Start Section <i data-lucide="arrow-right" class="w-4 h-4 ml-1.5"></i>
                    </button>
                `;
            }
        }
    }
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// ==========================================
// 8. ЯВНЫЙ ЭКСПОРТ В ГЛОБАЛЬНУЮ ОБЛАСТЬ WINDOW
// ==========================================
window.startWritingEngine = startWritingEngine;
window.loadWritingReviewMode = loadWritingReviewMode;
window.handleEssayInput = handleEssayInput;
window.nextWritingTask = nextWritingTask;
window.prevWritingTask = prevWritingTask;
window.fetchAndParseWritingTasks = fetchAndParseWritingTasks;
window.openTestView = openTestView;
