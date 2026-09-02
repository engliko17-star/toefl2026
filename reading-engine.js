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

const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

lucide.createIcons();

let currentActiveTestId = null;
let currentTasks = [];
let currentIndex = 0;
let timerInterval;
let timeRemaining = 35 * 60; 

function renderDailyLifeLayout(passage, layoutType, taskTitle) {
    if (!passage) return "";
    const cleanPassage = passage.replace(/[\[\]]/g, ''); 
    
    // БЕЗОПАСНО: Если макет пустой или не задан, откатываемся на дефолтный 'notice'
    const safeLayout = (layoutType || 'notice').toLowerCase().trim();

    switch(safeLayout) {
        case 'email': 
            return `<div class="max-w-xl mx-auto bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs font-sans text-sm"><div class="bg-slate-50 p-4 border-b border-slate-200 space-y-1.5 text-slate-700"><div><span class="inline-block w-14 font-semibold text-slate-400">To:</span> <span class="bg-white px-2 py-0.5 border border-slate-200 rounded text-xs">student@toeflprep.com</span></div><div><span class="inline-block w-14 font-semibold text-slate-400">From:</span> <span class="text-slate-600">admin</span></div><div><span class="inline-block w-14 font-semibold text-slate-400">Subject:</span> <span class="font-medium text-slate-900">${taskTitle}</span></div></div><div class="p-6 text-slate-800 space-y-4 leading-relaxed font-normal bg-white">${cleanPassage.replace(/\n/g, '<br>')}</div></div>`;
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

                if (step.task_type === 'academic') {
                    if (qType === 'Select a Sentence') {
                        parsedPassage = parsedPassage.replace(/\[s\d+\]\s*([^\[\n]+)/g, '<span class="clickable-sentence">$1</span>');
                    } else if (qType === 'Insert Text') {
                        parsedPassage = parsedPassage.replace(/\[s\d+\]/g, '<span class="insert-square">■</span>').replace(/\[■\]/g, '<span class="insert-square">■</span>');
                    } else {
                        parsedPassage = parsedPassage.replace(/\[s\d+\]\s*/g, '').replace(/\[■\]\s*/g, '');
                    }
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
                    stage: stageName,
                    correctAnswer: q.correct !== undefined ? q.options[q.correct] : null,
                    explanation: q.explanation || "",
                    userAnswer: null
                });
            });
        }
    }
    return parsedTasks;
}

async function startExamEngine(testId, testTitle) {
    window.engineType = 'reading';
    if (typeof resetEngineHeaderButtons === 'function') resetEngineHeaderButtons();
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
    
    try {
        currentTasks = await fetchAndParseTasks(testId, '1');

        if (currentTasks.length === 0) {
            alert("This test is empty! Please add tasks in Supabase 'full_test_tasks'.");
            exitExamEngine();
            return;
        }

        currentIndex = 0;
        document.getElementById('engine-title').innerText = testTitle;
        
        timeRemaining = 35 * 60;
        startTimer();
        renderEngine();

    } catch (err) {
        console.error("Engine crash:", err);
        alert("Error loading test structure.");
        exitExamEngine();
    }
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeRemaining--;
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            alert("Time is up!");
            saveAttemptAndFinish();
            return;
        }
        let m = Math.floor(timeRemaining / 60);
        let s = timeRemaining % 60;
        
        // БЕЗОПАСНО: обновляем таймер, только если элемент присутствует в HTML
        const timerEl = document.getElementById('engine-timer');
        if (timerEl) {
            timerEl.innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
        }
    }, 1000);
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
            progressEl.innerText = `${currentIndex + 1} / ${currentTasks.length}`;
        }

        const prevEl = document.getElementById('engine-prev');
        if (prevEl) {
            prevEl.disabled = (currentIndex === 0);
        }

        const nextEl = document.getElementById('engine-next');
        if (nextEl) {
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
                <section class="w-1/2 bg-white p-10 overflow-y-auto custom-scrollbar border-r border-slate-200 flex flex-col justify-center">
                    <div>${renderedLayout}</div>
                </section>
                <section class="w-1/2 bg-slate-50 p-10 overflow-y-auto custom-scrollbar">
                    <div class="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs max-w-xl mx-auto mt-10">
                        <h3 class="font-bold text-slate-900 mb-6">${task.question}</h3>
                        <div class="space-y-3">
                            ${(task.options || []).map((opt) => `
                                <label class="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-slate-50 transition">
                                    <input type="radio" name="q" value="${opt}"
                                        ${task.userAnswer === opt ? 'checked' : ''}
                                        onchange="currentTasks[${currentIndex}].userAnswer = this.value"
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
                rightPanelContent = `<div class="bg-blue-50 border border-blue-100 p-3 rounded-xl mb-6 text-xs text-blue-800 flex items-center"><i data-lucide="mouse-pointer-click" class="w-4 h-4 mr-2"></i> Click on a square [■] to insert the sentence.</div><h3 class="font-bold text-slate-900 mb-4">${task.question}</h3><div class="p-4 bg-white border-2 border-dashed border-indigo-300 rounded-xl text-sm font-bold text-indigo-900 text-center shadow-xs">"${task.insertSentence}"</div>`;
            } else {
                rightPanelContent = `<h3 class="font-bold text-slate-900 mb-6">${task.question}</h3><div class="space-y-3">${(task.options || []).map((opt) => `<label class="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-slate-50 transition"><input type="radio" name="q" value="${opt}" ${task.userAnswer === opt ? 'checked' : ''} onchange="currentTasks[${currentIndex}].userAnswer = this.value" class="w-4 h-4 text-indigo-600 mr-3"><span class="text-sm text-slate-700">${opt}</span></label>`).join('')}</div>`;
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
                    const sentenceText = el.textContent.trim();
                    if (task.userAnswer === sentenceText) el.classList.add('selected');
                    el.onclick = function() {
                        if (task.qType !== 'Select a Sentence') return;
                        document.querySelectorAll('.clickable-sentence').forEach(s => s.classList.remove('selected'));
                        this.classList.add('selected');
                        currentTasks[currentIndex].userAnswer = this.textContent.trim();
                    };
                });

                document.querySelectorAll('.insert-square').forEach((el, index) => {
                    const squareIndexStr = index.toString();
                    if (task.userAnswer === squareIndexStr) el.classList.add('selected');
                    el.onclick = function() {
                        if (task.qType !== 'Insert Text') return;
                        document.querySelectorAll('.insert-square').forEach(s => s.classList.remove('selected'));
                        this.classList.add('selected');
                        currentTasks[currentIndex].userAnswer = squareIndexStr;
                    };
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

async function loadModule2Tasks() {
    document.getElementById('engine-next').innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin mr-1"></i> Loading Module 2...';
    
    let correctCount = 0;
    let module1Total = 0;

    // ИСПРАВЛЕНИЕ: Учет заданий complete_words для расчета прохождения модуля
    for (let task of currentTasks) {
        if (task.stage === '1') {
            if (task.type === 'complete_words') {
                module1Total++;
                let isTaskCorrect = task.userWords && task.correctWords && task.userWords.join(',').toLowerCase() === task.correctWords.join(',').toLowerCase();
                if (isTaskCorrect) correctCount++;
            } else if (task.correctAnswer !== null && task.correctAnswer !== undefined) {
                module1Total++;
                if (task.userAnswer && task.userAnswer === task.correctAnswer) correctCount++;
            }
        }
    }

    const thresholdPercentage = 0.5; 
    const isHardModule = (module1Total > 0) && (correctCount / module1Total >= thresholdPercentage);
    const nextStage = isHardModule ? '2_hard' : '2_easy';
    
    try {
        const module2Tasks = await fetchAndParseTasks(currentActiveTestId, nextStage);
        if (module2Tasks.length > 0) {
            currentTasks = currentTasks.concat(module2Tasks);
            return true; 
        }
    } catch(e) { console.error("Error loading module 2:", e); }
    return false; 
}

function calculateTOEFLScore(correct, total) {
    if (total === 0) return "1.0";
    const ratio = correct / total;
    let score = 1.0 + (ratio * 5.0);
    return (Math.round(score * 2) / 2).toFixed(1);
}

async function nextTask() {
    if (currentIndex < currentTasks.length - 1) {
        currentIndex++;
        renderEngine();
    } else {
        const isModule1Finished = !currentTasks.some(t => t.stage.startsWith('2'));
        if (isModule1Finished) {
            const loaded = await loadModule2Tasks();
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
    const contentDiv = document.getElementById('engine-content');
    const nextBtn = document.getElementById('engine-next');
    const prevBtn = document.getElementById('engine-prev');
    if (nextBtn) nextBtn.style.display = 'none';
    if (prevBtn) prevBtn.style.display = 'none';

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
    const nextBtn = document.getElementById('engine-next');
    const prevBtn = document.getElementById('engine-prev');
    if (nextBtn) nextBtn.style.display = 'flex';
    if (prevBtn) prevBtn.style.display = 'flex';

    currentIndex++;
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
    
    const engineContent = document.getElementById('engine-content');
    engineContent.innerHTML = `<div class="m-auto flex flex-col items-center justify-center text-slate-500"><i data-lucide="loader-2" class="w-8 h-8 animate-spin mb-4 text-indigo-600"></i><p class="font-bold text-slate-700">Saving results to database...</p></div>`;
    lucide.createIcons();

    let correctAnswers = 0;
    let totalQuestions = 0;

    // ИСПРАВЛЕНИЕ: Подсчет баллов включая complete_words
    currentTasks.forEach((task) => {
        if (task.type === 'complete_words') {
            totalQuestions++;
            let isTaskCorrect = task.userWords && task.correctWords && task.userWords.join(',').toLowerCase() === task.correctWords.join(',').toLowerCase();
            if (isTaskCorrect) correctAnswers++;
        } else if (task.correctAnswer !== null && task.correctAnswer !== undefined) { 
            totalQuestions++;
            if (task.userAnswer === task.correctAnswer) correctAnswers++;
        }
    });

    const finalScore = calculateTOEFLScore(correctAnswers, totalQuestions);

    try {
        const { data: attempt, error: attemptErr } = await supabaseClient
            .from('big_mock_attempts')
            .insert([{ 
                test_id: currentActiveTestId, 
                section_name: 'reading', 
                user_id: window.currentUser.id,
                total_score: parseFloat(finalScore), 
                status: 'completed',
                completed_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (attemptErr) throw attemptErr;

        const answersToSave = currentTasks.map(task => {
            let isCorrect = false;
            let answerText = null;
            let answerJson = { question: task.question }; 

            if (task.type === 'complete_words') {
                answerJson.userWords = task.userWords;
                answerJson.correctWords = task.correctWords;
                isCorrect = task.userWords && task.correctWords && task.userWords.join(',').toLowerCase() === task.correctWords.join(',').toLowerCase();
            } else {
                answerText = task.userAnswer;
                isCorrect = task.userAnswer === task.correctAnswer;
            }

            return {
                attempt_id: attempt.id,
                task_id: task.taskId || 0,
                task_type: task.type,
                answer_text: answerText,
                answer_json: answerJson,
                is_correct: isCorrect
            };
        });

        const { error: answersErr } = await supabaseClient.from('big_mock_answers').insert(answersToSave);
        if (answersErr) throw answersErr;

        if (window.fullTestMode && typeof continueFullTestSequence === 'function') { continueFullTestSequence(); return; }
        renderResultsUI(currentTasks, finalScore, correctAnswers, totalQuestions);

    } catch(e) {
        console.error("Error saving test:", e);
        alert("Could not save results to database, but we will show your score.");
        if (window.fullTestMode && typeof continueFullTestSequence === 'function') { continueFullTestSequence(); return; }
        renderResultsUI(currentTasks, finalScore, correctAnswers, totalQuestions);
    }
}

async function loadReviewMode(attemptId, testId, testTitle) {
    window.engineType = 'reading';
    document.getElementById('view-tests-grid').classList.add('hidden');
    document.getElementById('main-interface').classList.add('hidden');

    const resultsView = document.getElementById('results-view');
    resultsView.classList.remove('hidden');
    resultsView.className = 'fixed inset-0 z-50 bg-[#f8f9fa] flex flex-col w-screen h-screen overflow-hidden';
    
    resultsView.innerHTML = `<div class="m-auto flex flex-col items-center justify-center text-slate-500"><i data-lucide="loader-2" class="w-8 h-8 animate-spin mb-4 text-indigo-600"></i><p class="font-bold">Reconstructing your past attempt...</p></div>`;
    lucide.createIcons();

    try {
        currentActiveTestId = testId;
        document.getElementById('dynamic-test-title').innerText = testTitle;

        const { data: attempt } = await supabaseClient.from('big_mock_attempts').select('*').eq('id', attemptId).single();
        const { data: answers } = await supabaseClient.from('big_mock_answers').select('*').eq('attempt_id', attemptId);

        const stage1 = await fetchAndParseTasks(testId, '1');
        const stage2E = await fetchAndParseTasks(testId, '2_easy');
        const stage2H = await fetchAndParseTasks(testId, '2_hard');

        let reconstructedTasks = [...stage1];
        const answerTaskIds = answers.map(a => a.task_id);
        const tookEasy = stage2E.some(t => answerTaskIds.includes(t.taskId));
        const tookHard = stage2H.some(t => answerTaskIds.includes(t.taskId));
        
        if (tookEasy) reconstructedTasks = reconstructedTasks.concat(stage2E);
        if (tookHard) reconstructedTasks = reconstructedTasks.concat(stage2H);

        let correctCount = 0;
        let totalCount = 0;

        // ИСПРАВЛЕНИЕ: Восстановление результатов с учетом complete_words
        reconstructedTasks.forEach(task => {
            if (task.type === 'complete_words') {
                let ans = answers.find(a => a.task_id === task.taskId && a.task_type === 'complete_words');
                if (ans && ans.answer_json) task.userWords = ans.answer_json.userWords || [];
                
                totalCount++;
                let isTaskCorrect = task.userWords && task.correctWords && task.userWords.join(',').toLowerCase() === task.correctWords.join(',').toLowerCase();
                if (isTaskCorrect) correctCount++;
            } else {
                let ans = answers.find(a => a.task_id === task.taskId && a.answer_json && a.answer_json.question === task.question);
                if (ans) task.userAnswer = ans.answer_text;
                
                if (task.correctAnswer !== null && task.correctAnswer !== undefined) { 
                    totalCount++;
                    if (task.userAnswer === task.correctAnswer) correctCount++;
                }
            }
        });

        renderResultsUI(reconstructedTasks, attempt.total_score, correctCount, totalCount);

    } catch (err) {
        console.error("Error loading review:", err);
        alert("Could not load review mode from database.");
        closeResults();
    }
}

function renderResultsUI(tasksArray, finalScore, correctAnswers, totalQuestions) {
    document.getElementById('exam-engine-view').classList.add('hidden');
    document.getElementById('exam-engine-view').classList.remove('flex');
    document.getElementById('main-interface').classList.add('hidden');
    
    const resultsView = document.getElementById('results-view');
    resultsView.classList.remove('hidden');
    resultsView.className = 'fixed inset-0 z-50 bg-[#f8f9fa] flex flex-col w-screen h-screen overflow-hidden';

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
        <div class="w-full h-full overflow-y-auto custom-scrollbar p-6 md:p-10 bg-[#f8f9fa]">
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
    document.getElementById('results-view').classList.add('hidden');
    document.getElementById('results-view').classList.remove('flex');
    document.getElementById('main-interface').classList.remove('hidden');
    loadTestsGrid(); 
}
