// listening-engine.js

let listQueue = []; 
let listBlockIdx = 0; 
let listSubQIdx = 0; 
let listPhase = 'audio'; // 'audio', 'questions' или 'transition'
        
// Новые переменные для поответочных таймеров
let listQuestionTimerInterval = null;
let listQuestionTimeRemaining = 0;

// Совместимость с глобальной структурой (legacy)
let listTimeRemaining = 0; 
let listTimerInterval = null;

let listSelectedOption = null;
let listUserAnswers = {}; 

// Таймер автовоспроизведения аудио — хранится отдельно, чтобы его можно было
// гарантированно отменить при выходе из движка (иначе он стреляет уже после
// перехода в другую секцию и падает на несуществующих элементах)
let listAutoplayTimeout = null;

window.engineType = null; // Глобальный флаг для роутинга кнопок в tests.html

// Флаг для предотвращения гонки состояний при переходах
let isProcessingNextStep = false;

// Вспомогательная функция определения длительности таймера по типу задания
function getQuestionTimerDuration(block) {
    if (!block || !block.block_type) return 20;
    const type = block.block_type.toLowerCase();
    
    if (type === 'response' || type === 'conversation' || type === 'announcement') {
        return 20; // 20 секунд на вопрос
    } else if (type === 'academic') {
        return 30; // 30 секунд на вопрос
    }
    return 20; // Значение по умолчанию
}

// Запуск поответочного таймера
function startQuestionTimer(duration) {
    stopQuestionTimer(); // Сбрасываем предыдущий интервал перед стартом нового
    listQuestionTimeRemaining = duration;
    
    const display = document.getElementById('engine-timer');
    const container = document.getElementById('engine-timer-container');
    
    if (container) {
        container.classList.remove('hidden');
        // Стандартный изумрудный стиль для таймера
        container.className = "flex items-center space-x-1.5 text-sm font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-4 py-1.5 rounded-lg";
    }
    
    const updateDisplay = () => {
        if (display) {
            display.innerText = `${listQuestionTimeRemaining}s`;
        }
    };
    updateDisplay();
    
    listQuestionTimerInterval = setInterval(() => {
        listQuestionTimeRemaining--;
        updateDisplay();
        
        // Когда остается 5 секунд или меньше - таймер становится красным и пульсирует
        if (listQuestionTimeRemaining <= 5 && listQuestionTimeRemaining > 0) {
            if (container) {
                container.className = "flex items-center space-x-1.5 text-sm font-bold text-rose-600 bg-rose-50 border border-rose-100 px-4 py-1.5 rounded-lg animate-pulse";
            }
        }
        
        // Время вышло - автосабмит
        if (listQuestionTimeRemaining <= 0) {
            stopQuestionTimer();
            handleTimerExpiration();
        }
    }, 1000);
}

// Остановка таймера и скрытие его контейнера
function stopQuestionTimer() {
    if (listQuestionTimerInterval) {
        clearInterval(listQuestionTimerInterval);
        listQuestionTimerInterval = null;
    }
    const container = document.getElementById('engine-timer-container');
    if (container) {
        container.classList.add('hidden');
    }
}

// Обработка истечения таймера
async function handleTimerExpiration() {
    await handleListeningNextStep();
}

// 1. Сборка и парсинг структуры Listening
async function fetchAndParseListeningTasks(testId, stageName) {
    let parsedBlocks = [];
    
    const { data: plan, error: planErr } = await supabaseClient
        .from('full_test_listening_tasks')
        .select('*')
        .eq('test_id', testId)
        .eq('stage', stageName)
        .order('order_num', { ascending: true });

    if (planErr) throw planErr;
    if (!plan || plan.length === 0) return parsedBlocks;

    for (let step of plan) {
        if (step.task_type === 'response') {
            const { data: qData, error: qErr } = await supabaseClient
                .from('listening_questions')
                .select('*')
                .eq('set_number', step.task_id)
                .order('id', { ascending: true });

            if (qErr) console.error("Error fetching response tasks:", qErr);
            if (qData && qData.length > 0) {
                qData.forEach((q, idx) => {
                    q.uniqueId = `resp_${step.task_id}_${q.id || idx}`;
                });
                parsedBlocks.push({
                    block_type: 'response',
                    db_id: step.task_id,
                    stage: stageName,
                    questions: qData
                });
            }
        } else {
            const { data: taskData, error: taskErr } = await supabaseClient
                .from('listening_tests')
                .select('*')
                .eq('id', step.task_id)
                .single();

            if (taskErr) {
                console.warn(`Could not load listening task ${step.task_id}`);
                continue;
            }

            if (taskData.questions && Array.isArray(taskData.questions)) {
                taskData.questions.forEach((q, idx) => {
                    q.uniqueId = `std_${step.task_id}_${idx}`;
                });
                parsedBlocks.push({
                    block_type: step.task_type,
                    db_id: step.task_id,
                    stage: stageName,
                    title: taskData.title,
                    image_url: taskData.image_url,
                    audio_url: taskData.audio_url,
                    transcript: taskData.transcript,
                    questions: taskData.questions
                });
            }
        }
    }
    return parsedBlocks;
}

// 2. Старт движка
async function startListeningEngine(testId, testTitle) {
    window.engineType = 'listening';
    if (typeof resetEngineHeaderButtons === 'function') resetEngineHeaderButtons();
    isProcessingNextStep = false;
    
    const resultsView = document.getElementById('results-view');
    if (resultsView) {
        resultsView.classList.add('hidden');
        resultsView.classList.remove('flex');
    }

    document.getElementById('main-interface').classList.add('hidden');
    document.getElementById('exam-engine-view').classList.remove('hidden');
    document.getElementById('exam-engine-view').classList.add('flex');
    
    document.getElementById('engine-prev').style.display = 'none';

    document.getElementById('engine-title').innerText = `Loading Listening Section...`;
    document.getElementById('engine-content').innerHTML = `
        <div class="m-auto text-center">
            <div class="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p class="text-slate-600 font-bold text-sm animate-pulse">Building audio layout...</p>
        </div>
    `;
    
    listQueue = [];
    listUserAnswers = {};
    currentActiveTestId = testId;
    
    try {
        listQueue = await fetchAndParseListeningTasks(testId, '1');

        if (listQueue.length === 0) {
            alert("This listening section is empty! Please configure 'full_test_listening_tasks' in Supabase.");
            exitExamEngine();
            return;
        }

        listBlockIdx = 0;
        listSubQIdx = 0;
        listPhase = listQueue[0].block_type === 'response' ? 'questions' : 'audio';
        
        document.getElementById('engine-title').innerText = `Listening Section — ${testTitle}`;
        
        renderListeningEngine();

    } catch (err) {
        console.error("Listening Engine crash:", err);
        alert("Error loading listening structure.");
        exitExamEngine();
    }
}

// Заглушка для обратной совместимости
function startListeningTimer() {}

// Глобальная функция для кнопки экрана перехода к Module 2
window.startModuleTwo = function() {
    listPhase = listQueue[listBlockIdx].block_type === 'response' ? 'questions' : 'audio';
    renderListeningEngine();
};

// 3. Рендеринг интерфейса
function renderListeningEngine() {
    const contentDiv = document.getElementById('engine-content');
    const block = listQueue[listBlockIdx];
    listSelectedOption = null;
    
    // Пересчет прогресса
    let totalQ = listQueue.reduce((acc, b) => acc + b.questions.length, 0);
    let passedQ = 0;
    for(let i=0; i<listBlockIdx; i++) passedQ += listQueue[i].questions.length;
    if(listPhase === 'questions') passedQ += listSubQIdx + 1;
    
    document.getElementById('engine-progress').innerText = `${passedQ} / ${totalQ}`;

    const nextBtn = document.getElementById('engine-next');
    nextBtn.disabled = true;
    nextBtn.className = 'px-6 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center shadow-xs';
    nextBtn.innerHTML = 'Next <i data-lucide="chevron-right" class="w-4 h-4 ml-1"></i>';

    const globalAudio = document.getElementById('globalAudio');
    if (globalAudio) {
        globalAudio.pause(); 
        globalAudio.onended = null; 
        globalAudio.ontimeupdate = null;
        globalAudio.onerror = null;
    }

    // Сбрасываем любой активный таймер при перерисовке экрана
    stopQuestionTimer();

    // Экран перехода между модулями (Intermission)
    if (listPhase === 'transition') {
        contentDiv.innerHTML = `
            <div class="flex-1 flex flex-col items-center justify-center fade-in h-full p-8 w-full">
                <div class="bg-white p-10 rounded-[2rem] border border-slate-200/60 w-full max-w-lg text-center shadow-sm">
                    <div class="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <i data-lucide="check-circle" class="w-8 h-8"></i>
                    </div>
                    <h2 class="text-2xl font-bold text-slate-900 mb-3">Module 1 Completed</h2>
                    <p class="text-slate-500 mb-8 font-medium text-sm">The system has analyzed your responses and prepared the adaptive module.</p>
                    <button onclick="startModuleTwo()" class="px-8 py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-emerald-600 transition shadow-md w-full flex items-center justify-center cursor-pointer">
                        Start Module 2 <i data-lucide="arrow-right" class="w-5 h-5 ml-2"></i>
                    </button>
                </div>
            </div>
        `;
        document.getElementById('engine-progress').innerText = "Module 2 Ready";
        nextBtn.style.display = 'none';
        lucide.createIcons();
        return;
    } else {
        nextBtn.style.display = 'flex';
    }

    if (block.block_type === 'response') {
        const q = block.questions[listSubQIdx];
        contentDiv.innerHTML = getListResponseHTML(q, listSubQIdx, block.questions.length);
        initListResponseLogic(q);
    } else {
        if (listPhase === 'audio') {
            contentDiv.innerHTML = getListStandardAudioHTML(block);
            initListStandardAudioLogic(block);
        } else {
            contentDiv.innerHTML = getListStandardQuestionsHTML(block, listSubQIdx);
            
            const duration = getQuestionTimerDuration(block);
            startQuestionTimer(duration);
        }
    }
    lucide.createIcons();
}

function getListResponseHTML(question, qIdx, totalInBlock) {
    return `
        <div class="flex flex-col md:flex-row gap-8 md:gap-12 w-full max-w-5xl mx-auto p-8 fade-in h-full items-center">
            <div class="w-full md:w-1/2 flex flex-col shrink-0">
                <div class="relative w-full aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-sm border border-gray-100 bg-white mb-6">
                    <img id="speakerImage" src="${question.speaker_image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600'}" class="w-full h-full object-cover transition-opacity duration-300">
                    <div class="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 shadow-sm flex items-center">
                        <span class="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                        <span class="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Choose a Response</span>
                    </div>
                </div>
                <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div class="flex items-center space-x-4">
                        <button id="playBtn" class="w-12 h-12 shrink-0 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-md flex items-center justify-center">
                            <span id="playIconContainer"><i data-lucide="play" class="w-5 h-5 ml-1"></i></span>
                        </button>
                        <div class="flex-1">
                            <div class="h-2 bg-gray-100 rounded-full overflow-hidden relative">
                                <div id="progressBar" class="absolute top-0 left-0 h-full bg-emerald-500 w-0 transition-all duration-100 ease-linear"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="w-full md:w-1/2 flex flex-col justify-center">
                <h2 class="text-xl font-bold text-slate-800 mb-6">Select the best response:</h2>
                <div id="optionsList" class="space-y-3 opacity-30 pointer-events-none transition-all duration-500 ease-in-out"></div>
            </div>
        </div>
    `;
}

function initListResponseLogic(question) {
    const audioEl = document.getElementById('globalAudio');
    const playBtn = document.getElementById('playBtn');
    const optionsList = document.getElementById('optionsList');
    
    // Обработка ошибок загрузки аудио
    audioEl.onerror = () => {
        console.error("Audio failed to load");
        const nextBtn = document.getElementById('engine-next');
        if (nextBtn) {
            nextBtn.disabled = false;
            nextBtn.innerHTML = 'Skip Error <i data-lucide="alert-triangle" class="w-4 h-4 ml-1"></i>';
            lucide.createIcons();
        }
    };

    audioEl.src = question.audio_url;
    audioEl.load();

    optionsList.innerHTML = '';
    question.options.forEach((optText, i) => {
        const btn = document.createElement('button');
        btn.className = 'w-full text-left p-4 rounded-xl border-2 border-gray-100 bg-white hover:border-emerald-200 hover:bg-emerald-50/50 transition-all text-sm font-medium text-slate-700 flex items-center group shadow-xs cursor-pointer';
        btn.innerHTML = `<div class="w-5 h-5 rounded-full border-2 border-gray-200 mr-3 flex items-center justify-center group-hover:border-emerald-400 option-circle shrink-0"><div class="w-2.5 h-2.5 rounded-full bg-emerald-500 opacity-0 scale-50 transition-all option-dot"></div></div><span>${optText}</span>`;
        btn.onclick = () => {
            listSelectedOption = i;
            document.querySelectorAll('#optionsList button').forEach(b => {
                b.classList.remove('border-emerald-500', 'bg-emerald-50'); b.classList.add('border-gray-100');
                b.querySelector('.option-circle').classList.remove('border-emerald-500'); b.querySelector('.option-dot').classList.remove('opacity-100', 'scale-100');
            });
            btn.classList.remove('border-gray-100'); btn.classList.add('border-emerald-500', 'bg-emerald-50');
            btn.querySelector('.option-circle').classList.add('border-emerald-500'); btn.querySelector('.option-dot').classList.add('opacity-100', 'scale-100');
            document.getElementById('engine-next').disabled = false;
        };
        optionsList.appendChild(btn);
    });

    const setPlayIcon = (icon) => {
        const el = document.getElementById('playIconContainer');
        if (!el) return; // мы уже могли покинуть Listening — молча выходим, без падения
        el.innerHTML = `<i data-lucide="${icon}" class="w-5 h-5 ${icon==='play'?'ml-1':''}"></i>`;
    };
    
    playBtn.onclick = () => {
        if (audioEl.paused) { audioEl.play().then(() => setPlayIcon('pause')).catch(() => setPlayIcon('play')); } 
        else { audioEl.pause(); setPlayIcon('play'); }
        lucide.createIcons();
    };

    audioEl.ontimeupdate = () => {
        const prog = document.getElementById('progressBar');
        if (prog && audioEl.duration) prog.style.width = `${(audioEl.currentTime / audioEl.duration) * 100}%`;
    };

    audioEl.onended = () => {
        setPlayIcon('play');
        if (!optionsList) return;
        optionsList.classList.remove('opacity-30', 'pointer-events-none');
        optionsList.classList.add('opacity-100');
        lucide.createIcons();
        
        const duration = getQuestionTimerDuration(listQueue[listBlockIdx]);
        startQuestionTimer(duration);
    };
    
    clearTimeout(listAutoplayTimeout);
    listAutoplayTimeout = setTimeout(() => { audioEl.play().then(() => {setPlayIcon('pause'); lucide.createIcons();}).catch(e=>console.log(e)); }, 500);
}

function getListStandardAudioHTML(block) {
    return `
        <div class="flex-1 flex flex-col items-center justify-center fade-in h-full p-8">
            <img src="${block.image_url}" class="w-full max-w-md rounded-2xl shadow-sm mb-8 border border-slate-200/60 object-cover aspect-video">
            <div class="bg-white p-8 rounded-3xl border border-slate-200/60 w-full max-w-md text-center shadow-sm">
                <span class="bg-amber-100 text-amber-800 text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-wider mb-4 inline-block">Active Listening</span>
                <p class="text-sm font-bold text-slate-800 mb-6">Listen to the audio track. You cannot pause or skip.</p>
                
                <div class="flex items-center space-x-4 mb-4">
                    <button id="mainAudioBtn" class="w-14 h-14 shrink-0 rounded-full bg-emerald-600 text-white shadow-md flex items-center justify-center cursor-default">
                        <span id="mainAudioIcon"><i data-lucide="volume-2" class="w-6 h-6"></i></span>
                    </button>
                    <div class="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden relative">
                        <div id="mainProgressBar" class="absolute top-0 left-0 h-full bg-emerald-500 w-0 transition-all duration-100 ease-linear"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function initListStandardAudioLogic(block) {
    const audioEl = document.getElementById('globalAudio');
    
    // Обработка ошибок загрузки аудио
    audioEl.onerror = () => {
        console.error("Audio failed to load");
        const nextBtn = document.getElementById('engine-next');
        if (nextBtn) {
            nextBtn.disabled = false;
            nextBtn.innerHTML = 'Skip Error <i data-lucide="alert-triangle" class="w-4 h-4 ml-1"></i>';
            lucide.createIcons();
        }
    };

    audioEl.src = block.audio_url;
    audioEl.load();

    audioEl.ontimeupdate = () => {
        const prog = document.getElementById('mainProgressBar');
        if (prog && audioEl.duration) prog.style.width = `${(audioEl.currentTime / audioEl.duration) * 100}%`;
    };

    // АВТО-ПЕРЕХОД: Как только аудио закончилось, ждем 1.5 сек и переходим к вопросам
    audioEl.onended = () => {
        const nextBtn = document.getElementById('engine-next');
        if (!nextBtn) return; // могли уже покинуть Listening
        nextBtn.disabled = true;
        nextBtn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin mr-1"></i> Loading questions...';
        lucide.createIcons();
        
        clearTimeout(listAutoplayTimeout);
        listAutoplayTimeout = setTimeout(() => {
            handleListeningNextStep();
        }, 1500);
    };

    clearTimeout(listAutoplayTimeout);
    listAutoplayTimeout = setTimeout(() => { audioEl.play().catch(e => { console.log(e); const btn = document.getElementById('engine-next'); if (btn) btn.disabled = false; }); }, 500);
}

function getListStandardQuestionsHTML(block, qIdx) {
    const question = block.questions[qIdx];
    let optionsHTML = '';
    
    question.options.forEach((opt, idx) => {
        optionsHTML += `
            <label class="relative block cursor-pointer group">
                <input type="radio" name="listOption" value="${idx}" class="peer radio-peer hidden" onchange="document.getElementById('engine-next').disabled = false;">
                <div class="flex items-center p-5 rounded-2xl border-2 border-slate-100 group-hover:border-slate-200 transition-colors bg-white shadow-sm">
                    <div class="radio-circle w-5 h-5 rounded-full border-2 border-slate-300 mr-4 shrink-0 transition-all"></div>
                    <span class="text-slate-700 text-[15px] font-medium select-none">${opt}</span>
                </div>
            </label>
        `;
    });

    return `
        <div class="flex flex-col md:flex-row gap-10 w-full max-w-5xl mx-auto fade-in p-8 items-center h-full">
            <div class="md:w-2/5 shrink-0">
                <img src="${block.image_url}" class="w-full rounded-2xl border border-slate-200/80 object-cover aspect-video mb-6 shadow-sm">
                <div class="bg-slate-50 text-slate-600 text-sm p-5 rounded-2xl font-medium border border-slate-200/80">
                    <span class="font-bold text-slate-900 block mb-1">Question ${qIdx + 1} of ${block.questions.length}</span>
                    Answer based on your notes. You cannot return to previous questions.
                </div>
            </div>
            <div class="md:w-3/5 w-full">
                <div class="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col">
                    <h4 class="text-xl font-bold text-slate-900 mb-8 leading-snug">${question.text}</h4>
                    <div class="space-y-4">${optionsHTML}</div>
                </div>
            </div>
        </div>
    `;
}

// 4. Логика маршрутизации и переходов
async function handleListeningNextStep() {
    if (isProcessingNextStep) return;
    isProcessingNextStep = true;

    try {
        stopQuestionTimer();

        const block = listQueue[listBlockIdx];
        if (!block) {
            console.warn("Critical: Current block is undefined. Ignoring next step trigger.");
            return;
        }
        
        // Сохранение ответа
        if (listPhase === 'questions' || block.block_type === 'response') {
            let qId = block.questions[listSubQIdx].uniqueId;
            if (block.block_type === 'response') {
                // Если ответ не был выбран, сохраняем null без ошибки, чтобы не сломать авто-пропуск по таймеру
                listUserAnswers[qId] = listSelectedOption !== null ? listSelectedOption : null;
            } else {
                const radio = document.querySelector('input[name="listOption"]:checked');
                listUserAnswers[qId] = radio ? parseInt(radio.value) : null;
            }
        }

        // Переход фаз внутри стандартного блока
        if (listPhase === 'audio') {
            listPhase = 'questions';
            listSubQIdx = 0;
            renderListeningEngine();
            return;
        }

        // Переход вопросов
        if (listSubQIdx < block.questions.length - 1) {
            listSubQIdx++;
            renderListeningEngine();
            return;
        }

        // Переход блоков и MST логика
        if (listBlockIdx < listQueue.length - 1) {
            listBlockIdx++;
            listSubQIdx = 0;
            
            // Проверяем, закончили ли мы Stage 1 перед переходом к блокам Stage 2
            const isStage1Finished = !listQueue.some(t => t.stage.startsWith('2')) && listQueue[listBlockIdx].stage.startsWith('2');
            
            if (isStage1Finished || listPhase === 'transition_trigger') {
                // Этот блок срабатывает если переходим на 2 этап
            }

            // Проверяем смену с Stage 1 на Stage 2 специально через заставку
            const prevBlockStage = listQueue[listBlockIdx - 1]?.stage;
            const currentBlockStage = listQueue[listBlockIdx]?.stage;
            
            if (prevBlockStage === '1' && currentBlockStage && currentBlockStage.startsWith('2')) {
                listPhase = 'transition';
                renderListeningEngine();
                return;
            }

            listPhase = listQueue[listBlockIdx].block_type === 'response' ? 'questions' : 'audio';
            renderListeningEngine();
        } else {
            // Проверяем, закончили ли мы Stage 1 (если после него больше нет элементов в очереди)
            const isStage1Finished = !listQueue.some(t => t.stage.startsWith('2'));
            if (isStage1Finished) {
                document.getElementById('engine-next').innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin mr-1"></i> Adapting...';
                const loaded = await loadListeningStage2();
                if (loaded) {
                    listBlockIdx++;
                    listSubQIdx = 0;
                    listPhase = 'transition'; // Показываем экран-заставку перед Module 2
                    renderListeningEngine();
                    return;
                }
            }
            // Если Stage 2 пройден или не загрузился - финиш
            await saveListeningAttemptAndFinish();
        }
    } finally {
        isProcessingNextStep = false;
    }
}

async function loadListeningStage2() {
    let correctCount = 0;
    let totalStage1 = 0;

    for (let block of listQueue) {
        if (block.stage === '1') {
            for (let q of block.questions) {
                totalStage1++;
                const correctIdx = q.correct_index !== undefined ? q.correct_index : q.correct_answer;
                if (listUserAnswers[q.uniqueId] === correctIdx) correctCount++;
            }
        }
    }

    const threshold = 0.50; 
    const nextStage = (totalStage1 > 0 && (correctCount / totalStage1 >= threshold)) ? '2_upper' : '2_lower';
    
    try {
        const stage2Blocks = await fetchAndParseListeningTasks(currentActiveTestId, nextStage);
        if (stage2Blocks.length > 0) {
            listQueue = listQueue.concat(stage2Blocks);
            return true; 
        }
    } catch(e) { console.error("Error loading Listening Stage 2:", e); }
    return false;
}

// 5. Финализация и сохранение (УМНЫЙ ПОДСЧЕТ БАЛЛОВ С УЧЕТОМ СЛОЖНОСТИ)
async function saveListeningAttemptAndFinish() {
    stopQuestionTimer(); 
    
    document.getElementById('engine-content').innerHTML = `
        <div class="m-auto flex flex-col items-center justify-center text-slate-500">
            <i data-lucide="loader-2" class="w-10 h-10 animate-spin mb-4 text-emerald-600"></i>
            <p class="font-bold text-slate-700 text-lg">Saving results and calculating weighted score...</p>
        </div>
    `;
    lucide.createIcons();

    let totalQuestions = 0;
    let correctAnswers = 0;
    
    // Переменные для взвешенного (IRT) подсчета
    let weightedScoreEarned = 0;
    let maxPossibleWeightedScore = 0;
    let isLowerTrack = false;

    listQueue.forEach(block => {
        const isUpper = block.stage.includes('2_upper');
        const isLower = block.stage.includes('2_lower');
        
        if (isLower) isLowerTrack = true;

        block.questions.forEach(q => {
            totalQuestions++;
            
            // Назначаем веса вопросам
            let weight = 1.0; // По умолчанию для Stage 1
            if (isUpper) weight = 1.25; // Сложный модуль ценится выше
            if (isLower) weight = 0.75; // Легкий модуль ценится ниже
            
            maxPossibleWeightedScore += weight;

            const correctObj = typeof q.correct_answer === 'string' ? JSON.parse(q.correct_answer) : q.correct_answer;
            const correctIdx = correctObj?.index !== undefined ? correctObj.index : correctObj;
            
            if (listUserAnswers[q.uniqueId] === correctIdx) {
                correctAnswers++;
                weightedScoreEarned += weight;
            }
        });
    });

    // Высчитываем пропорцию на основе весов
    let scoreRatio = maxPossibleWeightedScore > 0 ? (weightedScoreEarned / maxPossibleWeightedScore) : 0;
    let proportionalScore = 1.0 + (scoreRatio * 5.0);

    // Ограничение балла (Ceiling): 
    // Если студент попал в легкий модуль (Lower), он физически не может получить высший балл.
    // Максимум для Lower модуля ограничивается уровнем B2 (4.5 балла).
    if (isLowerTrack) {
        proportionalScore = Math.min(proportionalScore, 4.5);
    }

    // Округляем до ближайшей половинки (1.0, 1.5, 2.0 ... 6.0)
    let finalCalculatedScore = Math.min(Math.round(proportionalScore * 2) / 2, 6.0);

    try {
        const client = supabaseClient;
        if (client) {
            const { data: { session } } = await client.auth.getSession();
            if (session?.user) {
                const { data: attempt, error: attemptErr } = await client
                    .from('big_mock_listening_attempts')
                    .insert([{ 
                        test_id: currentActiveTestId, 
                        user_id: session.user.id,
                        total_score: finalCalculatedScore, 
                        score_earned: correctAnswers,
                        score_total: totalQuestions,
                        status: 'completed',
                        completed_at: new Date().toISOString()
                    }])
                    .select()
                    .single();

                if (attemptErr) throw attemptErr;

                const answersToSave = listQueue.flatMap(block => {
                    return block.questions.map(q => {
                        const correctObj = typeof q.correct_answer === 'string' ? JSON.parse(q.correct_answer) : q.correct_answer;
                        const correctIdx = correctObj?.index !== undefined ? correctObj.index : correctObj;
                        return {
                            attempt_id: attempt.id,
                            task_id: block.db_id,
                            task_type: block.block_type,
                            answer_json: { question_id: q.id, unique_id: q.uniqueId, question_text: q.text },
                            user_choice_index: listUserAnswers[q.uniqueId] !== undefined ? listUserAnswers[q.uniqueId] : null,
                            is_correct: listUserAnswers[q.uniqueId] === correctIdx
                        };
                    });
                });

                const { error: answersErr } = await client.from('big_mock_listening_answers').insert(answersToSave);
                if (answersErr) throw answersErr;
            }
        }
    } catch(e) {
        console.error("Error saving Listening test:", e);
    }

    if (window.fullTestMode && typeof continueFullTestSequence === 'function') { continueFullTestSequence(); return; }
    renderListeningReview(finalCalculatedScore, correctAnswers, totalQuestions);
}

// 7. Режим Ревью
async function loadListeningReviewMode(attemptId, testId, testTitle) {
    window.engineType = 'listening';
    
    const grid = document.getElementById('view-tests-grid');
    if (grid) grid.classList.add('hidden');
    
    const mainInterface = document.getElementById('main-interface');
    if (mainInterface) mainInterface.classList.add('hidden');

    const resultsView = document.getElementById('results-view');
    resultsView.classList.remove('hidden');
    resultsView.className = 'fixed inset-0 z-50 bg-[#f8f9fa] flex flex-col w-screen h-screen overflow-hidden';
    resultsView.innerHTML = `<div class="m-auto flex flex-col items-center justify-center text-slate-500"><i data-lucide="loader-2" class="w-10 h-10 animate-spin mb-4 text-emerald-600"></i><p class="font-bold">Reconstructing Listening attempt...</p></div>`;
    lucide.createIcons();

    try {
        currentActiveTestId = testId;
        const client = supabaseClient;
        const { data: attempt } = await client.from('big_mock_listening_attempts').select('*').eq('id', attemptId).single();
        const { data: answers } = await client.from('big_mock_listening_answers').select('*').eq('attempt_id', attemptId);

        const stage1 = await fetchAndParseListeningTasks(testId, '1');
        const stage2L = await fetchAndParseListeningTasks(testId, '2_lower');
        const stage2U = await fetchAndParseListeningTasks(testId, '2_upper');

        listQueue = [...stage1];
        const answerBlockIds = answers.map(a => a.task_id);
        
        const tookLower = stage2L.some(t => answerBlockIds.includes(t.db_id));
        const tookUpper = stage2U.some(t => answerBlockIds.includes(t.db_id));
        
        if (tookLower) listQueue = listQueue.concat(stage2L);
        if (tookUpper) listQueue = listQueue.concat(stage2U);

        listQueue.forEach(block => {
            block.questions.forEach(q => {
                let ansRow = answers.find(a => a.answer_json && a.answer_json.unique_id === q.uniqueId);
                if(ansRow) listUserAnswers[q.uniqueId] = ansRow.user_choice_index;
            });
        });

        renderListeningReview(attempt.total_score, attempt.score_earned, attempt.score_total);

    } catch (err) {
        console.error("Error loading listening review:", err);
        alert("Could not load review mode.");
        exitExamEngine();
    }
}

function renderListeningReview(finalScore, correctAnswers, totalQuestions) {
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

    let blocksHtml = '';

    listQueue.forEach((block, bIdx) => {
        let qsHTML = '';
        
        block.questions.forEach((q, qIdx) => {
            const userAns = listUserAnswers[q.uniqueId];
            const correctIdx = q.correct_index !== undefined ? q.correct_index : q.correct_answer;
            const isCorrect = userAns === correctIdx;

            let optionsHTML = '<div class="space-y-2 mt-4">';
            q.options.forEach((opt, oIdx) => {
                const isUserChoice = (oIdx === userAns);
                const isRightChoice = (oIdx === correctIdx);
                let styleClass = "border-slate-100 bg-gray-50 text-gray-500 opacity-60";
                let icon = `<div class="w-4 h-4 mr-2 shrink-0"></div>`;
                
                if (isRightChoice) {
                    styleClass = "border-emerald-200 bg-emerald-50 text-emerald-900 font-medium";
                    icon = `<i data-lucide="check" class="w-4 h-4 text-emerald-600 mt-0.5 mr-2 shrink-0"></i>`;
                } else if (isUserChoice && !isRightChoice) {
                    styleClass = "border-rose-200 bg-rose-50 text-rose-900";
                    icon = `<i data-lucide="x" class="w-4 h-4 text-rose-500 mt-0.5 mr-2 shrink-0"></i>`;
                }
                
                // ОБНОВЛЕНО: выравнивание ответа и иконки по краям
                optionsHTML += `
                    <div class="flex items-center justify-between p-3 rounded-lg border ${styleClass}">
                        <div class="flex items-center">
                            ${icon}
                            <span class="text-sm">${opt}</span>
                        </div>
                    </div>`;
            });
            optionsHTML += '</div>';

            const explanationHTML = q.explanation ? `<div class="mt-4 bg-slate-50 p-4 rounded-xl border border-slate-100 flex gap-3"><i data-lucide="lightbulb" class="w-4 h-4 text-amber-500 shrink-0 mt-0.5"></i><p class="text-xs text-slate-600 leading-relaxed">${q.explanation}</p></div>` : '';
            const statusBadge = isCorrect ? `<span class="text-xs font-extrabold tracking-wide text-emerald-500 uppercase">Correct</span>` : (userAns === null || userAns === undefined) ? `<span class="text-xs font-extrabold tracking-wide text-gray-400 uppercase">Skipped</span>` : `<span class="text-xs font-extrabold tracking-wide text-rose-500 uppercase">Incorrect</span>`;

            qsHTML += `<div class="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm mb-6"><div class="flex justify-between items-start mb-2"><h4 class="font-bold text-slate-800 text-base leading-snug pr-4">${q.text || "Select the best response:"}</h4><div class="shrink-0 mt-1">${statusBadge}</div></div>${optionsHTML}${explanationHTML}</div>`;
        });

        if (block.block_type === 'response') {
            blocksHtml += `<div class="mb-12 border-t border-slate-200 pt-8"><h3 class="text-sm font-extrabold text-emerald-900 mb-6 bg-emerald-50 inline-block px-4 py-2 rounded-lg uppercase tracking-wider">Section ${bIdx + 1}: Choose a Response</h3><div class="grid grid-cols-1 lg:grid-cols-2 gap-8">${qsHTML}</div></div>`;
        } else {
            blocksHtml += `
                <div class="mb-12 border-t border-slate-200 pt-8">
                    <h3 class="text-sm font-extrabold text-emerald-900 mb-6 bg-emerald-50 inline-block px-4 py-2 rounded-lg uppercase tracking-wider">Section ${bIdx + 1}: ${block.block_type.toUpperCase()}</h3>
                    <div class="flex flex-col lg:flex-row gap-8">
                        <div class="lg:w-5/12 shrink-0">
                            <div class="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm sticky top-6">
                                ${block.image_url ? `<img src="${block.image_url}" class="w-full rounded-xl border border-slate-100 object-cover aspect-video mb-5">` : ''}
                                <audio src="${block.audio_url}" controls class="w-full mb-2 outline-none"></audio>
                                ${block.transcript ? `<div class="mt-5 pt-5 border-t border-slate-100"><h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center"><i data-lucide="file-text" class="w-3.5 h-3.5 mr-1.5"></i> Transcript</h4><div class="h-64 overflow-y-auto text-sm text-slate-600 leading-relaxed pr-3 whitespace-pre-wrap">${block.transcript}</div></div>` : ''}
                            </div>
                        </div>
                        <div class="lg:w-7/12">${qsHTML}</div>
                    </div>
                </div>
            `;
        }
    });

    resultsView.innerHTML = `
        <div class="w-full h-full overflow-y-auto custom-scrollbar p-6 md:p-10 bg-[#f8f9fa]">
            <div class="max-w-7xl mx-auto">
                <div class="bg-white rounded-[2rem] p-8 border border-emerald-100 shadow-sm text-center mb-10 relative overflow-hidden max-w-2xl mx-auto">
                    <div class="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-inner"><i data-lucide="headphones" class="w-8 h-8"></i></div>
                    <h2 class="text-2xl font-bold text-slate-900 mb-8">Listening Section Review</h2>
                    
                    <!-- ОБНОВЛЕНО: Двойное отображение результатов (TOEFL + Raw Score) -->
                    <div class="flex justify-center items-center mb-8">
                        <div class="px-8 text-center border-r border-gray-100">
                            <div class="text-6xl font-extrabold text-emerald-600 mb-2">${parseFloat(finalScore).toFixed(1)}</div>
                            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">TOEFL Score</div>
                        </div>
                        <div class="px-8 text-center">
                            <div class="text-3xl font-bold text-slate-700 mb-2 mt-2">${correctAnswers} <span class="text-gray-300 text-xl">/</span> <span class="text-gray-400 text-2xl">${totalQuestions}</span></div>
                            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Raw Score</div>
                        </div>
                    </div>
                    
                    <div class="flex justify-center space-x-3">
                        <button onclick="startListeningEngine(currentActiveTestId, document.getElementById('dynamic-test-title').innerText)" class="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-emerald-600 transition shadow-md text-sm flex items-center cursor-pointer">
                            <i data-lucide="rotate-ccw" class="w-4 h-4 mr-2"></i> Retake Listening
                        </button>
                        <button onclick="exitExamEngine()" class="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition shadow-sm text-sm cursor-pointer">
                            Back to Dashboard
                        </button>
                    </div>
                </div>
                <div class="space-y-6">${blocksHtml}</div>
            </div>
        </div>
    `;
    lucide.createIcons();
}
