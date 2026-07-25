// ==========================================
// WRITING ENGINE
// ==========================================

// 1. Изолированные переменные (Namespacing)
let writeMockData = null;
let writeSentencesData = [];
let writeEmailData = null;
let writeAcademicData = null;
let writeCurrentPhase = 'sentence'; // 'sentence', 'sentence-review', 'transition', 'email', 'academic'
let writeCurrentSentenceIndex = 0;
let writeUserResponses = [];
let writeTimerInterval;

// Предполагается, что переменная currentUser уже инициализирована в глобальном скоупе (tests.html)
// и supabaseClient доступен глобально.

/**
 * Инициализация секции Writing
 */
async function startWritingSection(mockId) {
    window.engineType = 'writing'; // Устанавливаем флаг для глобального роутера
    const container = document.getElementById('dynamicTaskArea');
    if (!container) return;

    container.innerHTML = `<div class="flex items-center justify-center w-full h-full"><span class="animate-pulse text-slate-500 font-bold">Loading Writing Section...</span></div>`;

    try {
        const { data: mock } = await supabaseClient.from('mini_mock_writing').select('*').eq('id', mockId).single();
        writeMockData = mock;

        const { data: firstSentence } = await supabaseClient.from('writing_tasks').select('test_id').eq('id', mock.sentence_task_id).single();
        const targetTestId = (firstSentence && firstSentence.test_id) ? firstSentence.test_id : mock.sentence_task_id;

        const [sentencesRes, emailRes, academicRes] = await Promise.all([
            supabaseClient.from('writing_tasks').select('*').eq('type', 'sentence').eq('test_id', targetTestId).order('id'),
            supabaseClient.from('writing_tasks').select('*').eq('id', mock.email_task_id).single(),
            supabaseClient.from('writing_tasks').select('*').eq('id', mock.academic_task_id).single()
        ]);

        writeSentencesData = sentencesRes.data || [];
        writeEmailData = emailRes.data;
        writeAcademicData = academicRes.data;

        // Парсинг JSON
        writeSentencesData.forEach(q => {
            if (typeof q.structure === 'string') q.structure = JSON.parse(q.structure);
            if (typeof q.bank === 'string') q.bank = JSON.parse(q.bank);
        });
        if (typeof writeEmailData.instructions === 'string') writeEmailData.instructions = JSON.parse(writeEmailData.instructions);
        if (typeof writeAcademicData.peers === 'string') writeAcademicData.peers = JSON.parse(writeAcademicData.peers);

        initWritePhaseSentence();
    } catch (err) {
        console.error("Error loading writing test data:", err);
        container.innerHTML = `<div class="text-red-500 flex items-center justify-center w-full h-full">Error loading tasks.</div>`;
    }
}

// ==========================================
// ГЛОБАЛЬНЫЕ ХУКИ ДЛЯ РОУТЕРА (tests.html)
// ==========================================
function handleWritingNextStep() {
    if (writeCurrentPhase === 'sentence') {
        if (writeCurrentSentenceIndex === writeSentencesData.length - 1) {
            finishWriteSentencePhase();
        } else {
            writeCurrentSentenceIndex++;
            updateWriteSentenceUI();
        }
    } else if (writeCurrentPhase === 'sentence-review') {
        finishWriteSentencePhase();
    } else if (writeCurrentPhase === 'transition') {
        initWritePhaseEmail();
    } else if (writeCurrentPhase === 'email') {
        finishWriteEmailPhase();
    } else if (writeCurrentPhase === 'academic') {
        submitWritingSimulation();
    }
}

function handleWritingPrevStep() {
    if (writeCurrentPhase === 'sentence') {
        if (writeCurrentSentenceIndex > 0) {
            writeCurrentSentenceIndex--;
            updateWriteSentenceUI();
        }
    } else if (writeCurrentPhase === 'sentence-review') {
        initWritePhaseSentence();
    }
}

// ==========================================
// УТИЛИТЫ И ТАЙМЕР
// ==========================================
function countWriteWords(text) {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const articles = ['a', 'an', 'the'];
    return words.filter(w => !articles.includes(w)).length;
}

function setupWriteWordCounter(textareaId, counterId) {
    const textarea = document.getElementById(textareaId);
    const counter = document.getElementById(counterId);
    if (textarea && counter) {
        textarea.addEventListener('input', () => { counter.textContent = countWriteWords(textarea.value); });
    }
}

function startWritePhaseTimer(minutes, timeoutCallback) {
    clearInterval(writeTimerInterval);
    const timerBadge = document.getElementById('timerBadge');
    if(timerBadge) timerBadge.classList.remove('hidden');
    
    let seconds = minutes * 60;
    const display = document.getElementById('timeLeft');
    if(display) display.classList.remove('text-red-400');

    writeTimerInterval = setInterval(() => {
        seconds--;
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        if(display) display.textContent = `${m}:${s}`;
        
        if (seconds <= 60 && display) display.classList.add('text-red-400');
        if (seconds <= 0) {
            clearInterval(writeTimerInterval);
            timeoutCallback(); 
        }
    }, 1000);
}

// ==========================================
// PHASE 1: SENTENCES
// ==========================================
function initWritePhaseSentence() {
    writeCurrentPhase = 'sentence';
    const dynamicTaskArea = document.getElementById('dynamicTaskArea');
    const navNextText = document.getElementById('navNextText');
    const navNextIcon = document.getElementById('navNextIcon');
    const navReview = document.getElementById('navReview');
    const navBack = document.getElementById('navBack');
    const navNext = document.getElementById('navNext');

    if(navReview) navReview.classList.remove('hidden');
    if(navNext) navNext.classList.remove('hidden');
    if(navNextText) navNextText.textContent = "Next";
    if(navNextIcon) navNextIcon.classList.remove('hidden');
    
    let wrapper = document.getElementById('writeSentencesWrapper');
    
    if (!wrapper) {
        dynamicTaskArea.innerHTML = `<div id="writeSentencesWrapper" class="w-full h-full flex flex-col flex-1 overflow-y-auto"></div>`;
        wrapper = document.getElementById('writeSentencesWrapper');
        
        writeSentencesData.forEach((q, index) => {
            let sentenceHTML = '';
            (q.structure || []).forEach((item, sIndex) => {
                if (item.type === 'text') {
                    sentenceHTML += `<div class="inline-flex px-1.5 py-2 text-sm font-bold text-slate-800">${item.value}</div>`;
                } else if (item.type === 'slot') {
                    sentenceHTML += `<div class="word-slot inline-flex items-center justify-center border-b-2 border-gray-300 mx-1 pb-1 align-bottom" id="write-slot-${index}-${sIndex}"></div>`;
                }
            });

            const div = document.createElement('div');
            div.id = `write-sentence-container-${index}`;
            div.className = `w-full flex-1 flex flex-col items-center p-4 md:p-8`;
            div.style.display = index === 0 ? 'flex' : 'none';
            
            let bankWords = [...(q.bank || [])].sort(() => Math.random() - 0.5);
            let bankHTML = bankWords.map(word => `<div class="bg-white border border-gray-200 text-slate-700 text-sm font-bold px-4 py-2 rounded-xl shadow-sm cursor-grab select-none hover:border-indigo-300 transition">${word}</div>`).join('');

            div.innerHTML = `
                <div class="w-full max-w-3xl space-y-8 mb-12 bg-gray-50 p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm mt-4 shrink-0">
                    <div class="flex items-start space-x-4">
                        <div class="w-10 h-10 bg-blue-50 border rounded-full flex items-center justify-center text-lg shrink-0">${q.avatar_left || '👨‍🏫'}</div>
                        <div class="bg-white border rounded-2xl px-5 py-3 text-sm text-slate-700 mt-1 shadow-sm font-medium">${q.prompt_context}</div>
                    </div>
                    <div class="flex items-start space-x-4 pt-4 border-t border-dashed border-gray-200">
                        <div class="w-10 h-10 bg-rose-50 border rounded-full flex items-center justify-center text-lg shrink-0">${q.avatar_right || '👩‍🏫'}</div>
                        <div class="flex-1 flex flex-wrap items-end gap-y-3 pt-1">${sentenceHTML}<span class="text-2xl font-bold text-slate-400 select-none ml-1 align-bottom leading-none">.</span></div>
                    </div>
                </div>
                <div class="w-full max-w-2xl mx-auto shrink-0 pb-10">
                    <div class="flex flex-wrap justify-center gap-2.5 bg-gray-50 border border-gray-200 p-5 rounded-3xl min-h-[80px]" id="write-bank-${index}">${bankHTML}</div>
                </div>
            `;
            wrapper.appendChild(div);

            new Sortable(div.querySelector(`#write-bank-${index}`), { group: `write-shared-${index}`, animation: 150 });
            div.querySelectorAll(`[id^="write-slot-${index}-"]`).forEach(slot => {
                new Sortable(slot, { 
                    group: { name: `write-shared-${index}`, put: (to) => to.el.children.length === 0 }, 
                    animation: 150 
                });
            });
        });

        startWritePhaseTimer(10, finishWriteSentencePhase);
    }

    const reviewWrapper = document.getElementById('writeSentenceReviewWrapper');
    if (reviewWrapper) reviewWrapper.style.display = 'none';
    wrapper.style.display = 'flex';

    updateWriteSentenceUI();
}

function updateWriteSentenceUI() {
    const taskCounter = document.getElementById('taskCounterLabel');
    if(taskCounter) taskCounter.textContent = `Question ${writeCurrentSentenceIndex + 1} of ${writeSentencesData.length} (Sentence Build)`;
    
    writeSentencesData.forEach((_, i) => {
        const c = document.getElementById(`write-sentence-container-${i}`);
        if (c) c.style.display = i === writeCurrentSentenceIndex ? 'flex' : 'none';
    });

    const navBack = document.getElementById('navBack');
    const navNextText = document.getElementById('navNextText');
    const navReview = document.getElementById('navReview');

    if (writeCurrentSentenceIndex === 0) {
        if(navBack) navBack.classList.add('hidden');
    } else {
        if(navBack) navBack.classList.remove('hidden');
    }
    
    if (writeCurrentSentenceIndex === writeSentencesData.length - 1) {
        if(navNextText) navNextText.textContent = "Next Part";
    } else {
        if(navNextText) navNextText.textContent = "Next";
    }
    
    // Переопределяем клик на кнопку Review (если она есть в глобальном UI)
    if(navReview) navReview.onclick = showWriteSentenceReview;
}

function isWriteSentenceComplete(index) {
    const slots = document.querySelectorAll(`[id^="write-slot-${index}-"]`);
    for (let slot of slots) {
        if (slot.children.length === 0) return false;
    }
    return true;
}

function getWriteSentenceAnswer(index) {
    let parts = [];
    (writeSentencesData[index].structure || []).forEach((item, sIndex) => {
        if (item.type === 'text') parts.push(item.value);
        else if (item.type === 'slot') {
            const s = document.getElementById(`write-slot-${index}-${sIndex}`);
            parts.push(s && s.children.length > 0 ? s.children[0].textContent.trim() : "____");
        }
    });
    return parts.join(" ").replace(/\s+([.?!])/g, "$1").trim() + ".";
}

function showWriteSentenceReview() {
    writeCurrentPhase = 'sentence-review';
    
    const taskCounter = document.getElementById('taskCounterLabel');
    const navReview = document.getElementById('navReview');
    const navBack = document.getElementById('navBack');
    const navNextText = document.getElementById('navNextText');
    
    if(taskCounter) taskCounter.textContent = "Review Sentences";
    if(navReview) navReview.classList.add('hidden');
    if(navBack) navBack.classList.remove('hidden');
    if(navNextText) navNextText.textContent = "Next Part";

    document.getElementById('writeSentencesWrapper').style.display = 'none';

    let reviewDiv = document.getElementById('writeSentenceReviewWrapper');
    if (!reviewDiv) {
        reviewDiv = document.createElement('div');
        reviewDiv.id = 'writeSentenceReviewWrapper';
        reviewDiv.className = 'p-4 md:p-8 max-w-3xl mx-auto w-full h-full flex flex-col flex-1 overflow-y-auto';
        document.getElementById('dynamicTaskArea').appendChild(reviewDiv);
    }

    let listHTML = writeSentencesData.map((s, i) => `
        <div class="flex justify-between items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 transition" onclick="returnToWriteSentence(${i})">
            <div class="flex items-center gap-3">
                <span class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">${i+1}</span>
                <span class="font-bold text-slate-700">Sentence ${i + 1}</span>
            </div>
            ${isWriteSentenceComplete(i) 
                ? `<span class="text-emerald-500 bg-emerald-50 px-3 py-1 rounded-lg font-bold text-xs flex items-center">Complete</span>` 
                : `<span class="text-rose-500 bg-rose-50 px-3 py-1 rounded-lg font-bold text-xs flex items-center">Incomplete</span>`}
        </div>
    `).join('');

    reviewDiv.innerHTML = `
        <h2 class="text-2xl font-black text-slate-900 mb-6 text-center">Section 1 Review</h2>
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex-1 shrink-0">
            ${listHTML}
        </div>
    `;
    reviewDiv.style.display = 'flex';
}

window.returnToWriteSentence = function(i) {
    writeCurrentSentenceIndex = i;
    initWritePhaseSentence(); 
};

function finishWriteSentencePhase() {
    writeSentencesData.forEach((q, i) => {
        writeUserResponses.push({
            task_id: q.id,
            task_type: 'sentence',
            response_content: getWriteSentenceAnswer(i),
            user_id: currentUser.id
        });
    });
    showWritePhaseTransition();
}

// ==========================================
// TRANSITION SCREEN
// ==========================================
function showWritePhaseTransition() {
    writeCurrentPhase = 'transition';
    
    const navReview = document.getElementById('navReview');
    const navBack = document.getElementById('navBack');
    const navNext = document.getElementById('navNext');
    const navNextText = document.getElementById('navNextText');
    const timerBadge = document.getElementById('timerBadge');
    
    if(navReview) navReview.classList.add('hidden');
    if(navBack) navBack.classList.add('hidden');
    if(navNext) navNext.classList.remove('hidden');
    if(navNextText) navNextText.textContent = "Start Tasks";
    if(timerBadge) timerBadge.classList.add('hidden');
    
    clearInterval(writeTimerInterval);

    const taskCounter = document.getElementById('taskCounterLabel');
    if(taskCounter) taskCounter.textContent = "Section Transition";

    document.getElementById('dynamicTaskArea').innerHTML = `
        <div class="flex-1 flex items-center justify-center p-6 bg-slate-50 w-full h-full">
            <div class="w-full max-w-xl bg-white rounded-3xl p-10 text-center border border-gray-200 shadow-sm">
                <div class="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-indigo-100 shadow-inner">
                    📝
                </div>
                <h2 class="text-3xl font-black text-slate-900 mb-3">Writing Section</h2>
                <p class="text-slate-500 mb-8 max-w-md mx-auto text-[15px] leading-relaxed">
                    You have successfully completed the <b>Sentence Building</b> tasks. <br><br>
                    Next, you will write an <b>Email</b> and participate in an <b>Academic Discussion</b>. Each of these tasks will have its own time limit.
                </p>
            </div>
        </div>
    `;
}

// ==========================================
// PHASE 2: EMAIL
// ==========================================
function initWritePhaseEmail() {
    writeCurrentPhase = 'email';
    
    const navNextText = document.getElementById('navNextText');
    const taskCounter = document.getElementById('taskCounterLabel');
    
    if(navNextText) navNextText.textContent = "Next Task";
    if(taskCounter) taskCounter.textContent = "Task 1 of 2 (Email)";
    
    let instr = (writeEmailData.instructions || []).map(li => `<li>${li}</li>`).join('');
    document.getElementById('dynamicTaskArea').innerHTML = `
        <div class="flex flex-col md:flex-row h-full divide-y md:divide-y-0 md:divide-x divide-gray-200 w-full">
            <div class="w-full md:w-1/2 p-6 overflow-y-auto bg-white">
                <h2 class="text-xl font-bold mb-4 text-slate-900">${writeEmailData.title || 'Email Writing'}</h2>
                <p class="text-sm text-slate-700 leading-relaxed">${writeEmailData.prompt_context}</p>
                <hr class="my-6 border-gray-100">
                <div class="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                    <h3 class="text-sm font-bold uppercase tracking-wide text-indigo-900">Write an email to ${writeEmailData.meta_to || 'Recipient'}. In the email:</h3>
                    <ul class="list-disc pl-5 text-sm text-indigo-800 mt-3 space-y-1.5">${instr}</ul>
                </div>
            </div>
            <div class="w-full md:w-1/2 p-6 bg-slate-50 flex flex-col">
                <div class="bg-white border border-gray-200 rounded-2xl flex flex-col h-full shadow-sm overflow-hidden min-h-[300px]">
                    <div class="bg-gray-50 border-b border-gray-200 px-5 py-4 text-sm flex justify-between items-center shrink-0">
                        <div>
                            <p><span class="font-bold text-gray-400">To:</span> <span class="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold ml-1">${writeEmailData.meta_to || 'Recipient'}</span></p>
                            <p class="mt-2"><span class="font-bold text-gray-400">Subject:</span> <span class="font-semibold text-slate-700 ml-1">${writeEmailData.meta_subject || 'Topic'}</span></p>
                        </div>
                        <span class="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">Words: <span id="writeEmailWordCount">0</span></span>
                    </div>
                    <textarea id="writeEmailResponse" placeholder="Write your email here..." class="exam-textarea flex-1 p-5 text-sm text-slate-700 w-full h-full resize-none outline-none"></textarea>
                </div>
            </div>
        </div>
    `;
    setupWriteWordCounter('writeEmailResponse', 'writeEmailWordCount');
    startWritePhaseTimer(7, finishWriteEmailPhase); 
}

function finishWriteEmailPhase() {
    const ans = document.getElementById('writeEmailResponse') ? document.getElementById('writeEmailResponse').value.trim() : "";
    writeUserResponses.push({
        task_id: writeEmailData.id,
        task_type: 'email',
        response_content: ans,
        user_id: currentUser.id
    });
    initWritePhaseAcademic();
}

// ==========================================
// PHASE 3: ACADEMIC
// ==========================================
function initWritePhaseAcademic() {
    writeCurrentPhase = 'academic';
    
    const navNextText = document.getElementById('navNextText');
    const taskCounter = document.getElementById('taskCounterLabel');
    
    if(navNextText) navNextText.textContent = "Submit Simulation";
    if(taskCounter) taskCounter.textContent = "Task 2 of 2 (Academic Discussion)";

    let peersHTML = (writeAcademicData.peers || []).map(p => `
        <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex gap-4 shrink-0">
            <div class="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-lg shrink-0 border border-indigo-100">${p.avatar || '👤'}</div>
            <div>
                <p class="text-xs font-bold text-slate-400 uppercase mb-1">${p.name}</p>
                <p class="text-sm text-slate-700 leading-relaxed">${p.text}</p>
            </div>
        </div>
    `).join('');

    document.getElementById('dynamicTaskArea').innerHTML = `
        <div class="flex flex-col md:flex-row h-full divide-y md:divide-y-0 md:divide-x divide-gray-200 w-full">
            <div class="w-full md:w-1/2 p-6 overflow-y-auto bg-white">
                <h2 class="text-xl font-bold mb-4 text-slate-900">${writeAcademicData.title || 'Academic Discussion'}</h2>
                <div class="bg-teal-50 text-teal-900 p-4 rounded-xl text-sm font-medium mb-6 border border-teal-100 leading-relaxed">
                    ${writeAcademicData.instruction_box || ''}
                </div>
                <div class="bg-gray-50 p-5 rounded-2xl border border-gray-200 flex gap-4 shrink-0">
                    <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shrink-0 border border-gray-200 shadow-sm">${writeAcademicData.professor_avatar || '👨‍🏫'}</div>
                    <div>
                        <p class="text-xs font-black text-slate-500 uppercase tracking-wide mb-1.5">${writeAcademicData.professor_name || 'Professor'}</p>
                        <div class="text-sm text-slate-800 leading-relaxed font-medium">${writeAcademicData.professor_prompt || ''}</div>
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
                        <span class="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">Words: <span id="writeAcademicWordCount">0</span></span>
                    </div>
                    <textarea id="writeAcademicResponse" placeholder="Write your contribution here..." class="exam-textarea flex-1 p-5 text-sm text-slate-700 w-full h-full resize-none outline-none"></textarea>
                </div>
            </div>
        </div>
    `;
    setupWriteWordCounter('writeAcademicResponse', 'writeAcademicWordCount');
    startWritePhaseTimer(10, submitWritingSimulation); 
}

// ==========================================
// SUBMIT LOGIC
// ==========================================
async function submitWritingSimulation() {
    const navNext = document.getElementById('navNext');
    const navNextText = document.getElementById('navNextText');
    
    if(navNext) navNext.disabled = true;
    if(navNextText) navNextText.innerHTML = `<span class="animate-pulse">Submitting...</span>`;
    
    const ans = document.getElementById('writeAcademicResponse') ? document.getElementById('writeAcademicResponse').value.trim() : "";
    writeUserResponses.push({
        task_id: writeAcademicData.id,
        task_type: 'academic',
        response_content: ans,
        user_id: currentUser.id
    });
    
    try {
        const { data: attempt, error: attemptError } = await supabaseClient
            .from('mini_mock_writing_attempts')
            .insert([{ user_id: currentUser.id, mock_id: writeMockData.id }])
            .select()
            .single();

        if (attemptError) throw attemptError;

        const responsesWithAttempt = writeUserResponses.map(resp => ({
            ...resp,
            attempt_id: attempt.id
        }));

        const { error: responsesError } = await supabaseClient
            .from('mini_mock_writing_responses')
            .insert(responsesWithAttempt);
            
        if (responsesError) throw responsesError;
        
        // Показываем Success Screen
        document.getElementById('examContainer').classList.add('hidden');
        document.getElementById('topHeader').classList.add('hidden');
        
        let successScreen = document.getElementById('successScreen');
        if (!successScreen) {
             successScreen = document.createElement('main');
             successScreen.id = 'successScreen';
             successScreen.className = 'flex-1 flex items-center justify-center p-4 h-full';
             document.body.appendChild(successScreen);
        }
        
        successScreen.classList.remove('hidden');
        successScreen.innerHTML = `
            <div class="w-full max-w-2xl bg-white rounded-3xl p-10 text-center border border-gray-100 shadow-lg">
                <div class="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    ✅
                </div>
                <h2 class="text-2xl font-black text-slate-900 mb-2">Simulation Complete!</h2>
                <p class="text-gray-500 mb-8 max-w-md mx-auto">All responses have been successfully saved to the database.</p>
                <div class="flex flex-col sm:flex-row justify-center gap-4">
                    <a href="mini-mock-writing-list.html" class="inline-flex justify-center bg-gray-100 hover:bg-gray-200 text-slate-700 px-6 py-3.5 rounded-xl text-sm font-bold transition shadow-sm items-center">
                        Dashboard
                    </a>
                    <a href="mini-mock-results.html?attempt_id=${attempt.id}" class="inline-flex justify-center bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-xl text-sm font-bold transition shadow-sm items-center">
                        View Full Review
                    </a>
                </div>
            </div>
        `;
    } catch (err) {
        console.error("Full error object:", err);
        alert("Error submitting. Please try again.\n" + (err.message || JSON.stringify(err)));
        if(navNext) navNext.disabled = false;
        if(navNextText) navNextText.textContent = "Submit Simulation";
    }
}

