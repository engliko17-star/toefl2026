// ==========================================
// SPEAKING ENGINE — большой мок-тест
// ==========================================
// По официальному гайду TOEFL: в Speaking-секции нет ни Next, ни Back,
// ни Review — только Volume. Всё происходит автоматически: проиграли
// промпт -> бип -> запись -> сохранение -> следующий вопрос.
// Формат: 7 Listen & Repeat + 4 Interview = 11 заданий (как на реальном тесте).

let speakingItems = [];        // строки full_test_speaking_tasks + вложенный .question (speaking_questions)
let speakingIndex = 0;
let speakingMediaStream = null;
let speakingMediaRecorder = null;
let speakingAudioChunks = [];
let speakingAttemptId = null;
let speakingAudioCtx = null;
let speakingRecordingMimeType = '';
let speakingQuestionTimerInterval = null;

// ==========================================
// 1. ЗАГРУЗКА ЗАДАНИЙ
// ==========================================
async function fetchAndParseSpeakingTasks(testId) {
    const client = getSupabaseClient();
    if (!client) return [];

    const { data: items, error } = await client
        .from('full_test_speaking_tasks')
        .select('*, question:speaking_questions!full_test_speaking_tasks_task_id_fkey(*)')
        .eq('test_id', testId)
        .order('order_num', { ascending: true });

    if (error) {
        console.error('Error loading speaking tasks:', error);
        return [];
    }
    return items || [];
}

// ==========================================
// 2. СТАРТ ДВИЖКА (экран разрешения микрофона внутри engine-content)
// ==========================================
async function startSpeakingEngine(testId, testTitle) {
    window.engineType = 'speaking';
    if (typeof resetEngineHeaderButtons === 'function') resetEngineHeaderButtons();
    window.currentActiveTestId = testId;
    window.currentActiveTestTitle = testTitle || 'Speaking Section';

    const resultsView = document.getElementById('results-view');
    if (resultsView) {
        resultsView.classList.add('hidden');
        resultsView.classList.remove('flex');
    }

    document.getElementById('main-interface').classList.add('hidden');
    document.getElementById('exam-engine-view').classList.remove('hidden');
    document.getElementById('exam-engine-view').classList.add('flex');
    document.getElementById('engine-title').innerText = `Speaking Section — ${window.currentActiveTestTitle}`;

    // Speaking: ни Review, ни Back, ни Next — как в реальном TOEFL
    const reviewBtn = document.getElementById('engine-review');
    const prevBtn = document.getElementById('engine-prev');
    const nextBtn = document.getElementById('engine-next');
    if (reviewBtn) reviewBtn.classList.add('hidden');
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';

    document.getElementById('engine-content').innerHTML = `
        <div class="m-auto text-center max-w-sm p-6">
            <div class="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i data-lucide="mic" class="w-8 h-8"></i>
            </div>
            <h2 class="text-xl font-bold text-slate-800 mb-2">Ready to start Speaking?</h2>
            <p class="text-sm text-slate-500 mb-6">Make sure you are in a quiet place and your microphone works. This section mixes Listen &amp; Repeat and Interview questions, with no way to go back once started.</p>
            <button id="speakingStartBtn" class="bg-slate-900 hover:bg-indigo-600 transition text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center shadow-md mx-auto cursor-pointer">
                Allow Mic &amp; Start <i data-lucide="play" class="w-4 h-4 ml-2 fill-current"></i>
            </button>
        </div>
    `;
    if (typeof lucide !== 'undefined') lucide.createIcons();

    try {
        speakingItems = await fetchAndParseSpeakingTasks(testId);
        if (speakingItems.length === 0) {
            alert("This Speaking section has no tasks configured in Supabase (full_test_speaking_tasks / speaking_questions)!");
            if (typeof exitExamEngine === 'function') exitExamEngine();
            return;
        }
    } catch (err) {
        console.error("Speaking Engine crash:", err);
        alert("Error loading Speaking tasks structure.");
        if (typeof exitExamEngine === 'function') exitExamEngine();
        return;
    }

    document.getElementById('speakingStartBtn').onclick = beginSpeakingSection;
}

async function beginSpeakingSection() {
    if (!window.isSecureContext && location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
        alert(`ОШИБКА БЕЗОПАСНОСТИ:\nБраузеры блокируют микрофон на сайтах без HTTPS!\n\nПожалуйста, откройте сайт по безопасному адресу https:// (не http://).`);
        return;
    }

    if (typeof window.MediaRecorder === 'undefined') {
        alert(`Ваше устройство не поддерживает запись звука в этом браузере.\n\nНа iPhone/iPad/Mac это означает, что версия iOS/iPadOS/macOS слишком старая (нужна iOS 14.3 или новее, либо Safari 14.1+).\n\nПожалуйста, обновите систему и попробуйте снова.`);
        return;
    }

    speakingRecordingMimeType = getSpeakingSupportedMimeType();
    speakingAudioCtx = new (window.AudioContext || window.webkitAudioContext)();

    try {
        speakingMediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });

        const client = getSupabaseClient();
        const { data: { session } } = await client.auth.getSession();
        const { data: attemptData, error: attemptError } = await client
            .from('big_mock_speaking_attempts')
            .insert([{ test_id: window.currentActiveTestId, user_id: session.user.id, status: 'pending_review' }])
            .select()
            .single();

        if (attemptError) {
            console.error("Ошибка создания попытки Speaking:", attemptError);
            alert("Ошибка базы данных (big_mock_speaking_attempts): " + attemptError.message);
        } else if (attemptData) {
            speakingAttemptId = attemptData.id;
        }

        speakingIndex = 0;
        loadSpeakingQuestion(0);
    } catch (err) {
        console.error("Media access error:", err);
        let details = "";
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            details = `Доступ к микрофону заблокирован браузером.\n\nКак исправить:\n1. Нажмите на иконку "Замок" слева в адресной строке.\n2. Переключите доступ к Микрофону в состояние "Разрешить".\n3. Перезагрузите страницу.`;
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
            details = "Микрофон не обнаружен на вашем устройстве.";
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
            details = "Микрофон занят другим приложением. Закройте фоновые приложения.";
        } else {
            details = `Код ошибки браузера: ${err.name}\n${err.message}`;
        }
        alert(`Не удалось включить микрофон!\n\n${details}`);
    }
}

// Подбирает mimeType, который реально поддерживается текущим браузером
// (та же логика, что уже проверена и работает в speaking_player.html)
function getSpeakingSupportedMimeType() {
    if (typeof MediaRecorder === 'undefined' || typeof MediaRecorder.isTypeSupported !== 'function') return '';
    const candidates = ['audio/mp4', 'audio/aac', 'audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus'];
    for (const type of candidates) {
        try { if (MediaRecorder.isTypeSupported(type)) return type; } catch (e) {}
    }
    return '';
}

function playSpeakingBeep() {
    return new Promise((resolve) => {
        if (speakingAudioCtx && speakingAudioCtx.state === 'suspended') speakingAudioCtx.resume();
        const oscillator = speakingAudioCtx.createOscillator();
        const gainNode = speakingAudioCtx.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, speakingAudioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.8, speakingAudioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, speakingAudioCtx.currentTime + 0.4);
        oscillator.connect(gainNode);
        gainNode.connect(speakingAudioCtx.destination);
        oscillator.start();
        oscillator.stop(speakingAudioCtx.currentTime + 0.4);
        setTimeout(resolve, 400);
    });
}

// ==========================================
// 3. РЕНДЕР ВОПРОСА
// ==========================================
function loadSpeakingQuestion(i) {
    speakingIndex = i;
    const item = speakingItems[i];
    const q = item.question || {};
    const isInterview = item.task_type === 'interview';

    document.getElementById('engine-progress').innerText = `Question ${i + 1} of ${speakingItems.length}`;

    document.getElementById('engine-content').innerHTML = `
        <div class="m-auto flex flex-col items-center p-6 w-full max-w-md">
            <span class="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-4">${isInterview ? 'Spontaneous Response' : 'Repeat Exactly'}</span>

            <div class="w-full aspect-square bg-black border border-gray-200 rounded-[2rem] overflow-hidden shadow-lg flex items-center justify-center relative mb-6" id="speakingMediaContainer">
                <video id="speakingVideo" class="w-full h-full object-cover hidden" playsinline preload="auto"></video>
                <img id="speakingImage" class="w-full h-full object-cover hidden" src="" alt="Task Image">
            </div>

            <div class="w-full bg-white border border-gray-200 rounded-[2rem] shadow-md flex flex-col items-center p-6">
                <div id="speakingStatusBanner" class="text-[10px] font-bold uppercase mb-4 tracking-widest text-slate-400 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100">Ready</div>
                <div class="flex items-center justify-center space-x-6 w-full">
                    <div id="speakingMicIcon" class="w-14 h-14 rounded-full bg-gray-100 text-slate-400 flex items-center justify-center shadow-inner shrink-0">
                        <i data-lucide="mic" class="w-6 h-6"></i>
                    </div>
                    <div id="speakingTimerDisplay" class="text-4xl font-mono font-black text-slate-800 tabular-nums">00:00</div>
                </div>
                <div class="w-full bg-gray-100 h-2 rounded-full mt-6 overflow-hidden">
                    <div id="speakingProgressBar" class="h-full bg-indigo-600 w-0 transition-all duration-1000 ease-linear"></div>
                </div>
            </div>
        </div>
    `;
    if (typeof lucide !== 'undefined') lucide.createIcons();

    const video = document.getElementById('speakingVideo');
    const img = document.getElementById('speakingImage');
    const audio = document.getElementById('globalAudio'); // общий audio-элемент из tests.html (тот же, что у Listening)

    if (isInterview) {
        if (!q.media_url) {
            alert("Ошибка: не заполнена ссылка на видео (media_url) для этого вопроса!");
            return;
        }
        video.src = q.media_url;
        video.load();
        video.classList.remove('hidden');

        setSpeakingStatus('Listening to Question...', 'bg-sky-100 text-sky-700 border-sky-200');
        video.onerror = () => alert("Ошибка загрузки видео:\n" + q.media_url);
        video.onended = async () => {
            setSpeakingStatus('Get Ready...', 'bg-amber-100 text-amber-700 border-amber-200');
            await playSpeakingBeep();
            startSpeakingRecording(q.time_limit || 45);
        };
        const p = video.play();
        if (p !== undefined) p.catch(e => console.error("Video autoplay blocked:", e));

    } else {
        if (q.media_url) {
            img.src = q.media_url;
            img.classList.remove('hidden');
        }
        if (!q.audio_prompt_url) {
            alert("Ошибка: отсутствует ссылка на аудио (audio_prompt_url) для этого задания.");
            return;
        }
        if (audio) {
            audio.src = q.audio_prompt_url;
            audio.load();
            audio.onerror = () => alert("Ошибка загрузки аудио:\n" + q.audio_prompt_url);
            audio.onended = async () => {
                setSpeakingStatus('Get Ready...', 'bg-amber-100 text-amber-700 border-amber-200');
                await playSpeakingBeep();
                startSpeakingRecording(q.time_limit || 8);
            };
            setSpeakingStatus('Listening to Phrase...', 'bg-sky-100 text-sky-700 border-sky-200');
            const p = audio.play();
            if (p !== undefined) p.catch(e => console.error("Audio autoplay blocked:", e));
        }
    }
}

function setSpeakingStatus(text, classes) {
    const banner = document.getElementById('speakingStatusBanner');
    if (!banner) return;
    banner.className = `text-[10px] font-bold uppercase mb-4 tracking-widest px-4 py-1.5 rounded-full border transition-colors shadow-sm ${classes}`;
    banner.innerText = text;
}

// ==========================================
// 4. ЗАПИСЬ ОТВЕТА
// ==========================================
function startSpeakingRecording(limit) {
    setSpeakingStatus('Recording...', 'bg-red-500 text-white border-red-500');
    const micIcon = document.getElementById('speakingMicIcon');
    if (micIcon) { micIcon.classList.remove('bg-gray-100', 'text-slate-400'); micIcon.classList.add('bg-transparent', 'text-white'); }

    speakingAudioChunks = [];
    try {
        speakingMediaRecorder = new MediaRecorder(speakingMediaStream, speakingRecordingMimeType ? { mimeType: speakingRecordingMimeType } : undefined);
    } catch (err) {
        console.error("MediaRecorder init error:", err);
        try {
            speakingMediaRecorder = new MediaRecorder(speakingMediaStream);
        } catch (err2) {
            console.error("MediaRecorder fallback init error:", err2);
            setSpeakingStatus('Recording failed', 'bg-red-100 text-red-700 border-red-200');
            alert(`Не удалось начать запись звука на этом устройстве.\n\nПопробуйте обновить iOS/Safari и перезагрузить страницу.\n\nТехническая причина: ${err2.message || err2.name}`);
            return;
        }
    }

    speakingMediaRecorder.onerror = (e) => {
        console.error("MediaRecorder runtime error:", e.error || e);
        setSpeakingStatus('Recording error', 'bg-red-100 text-red-700 border-red-200');
    };
    speakingMediaRecorder.ondataavailable = e => { if (e.data.size > 0) speakingAudioChunks.push(e.data); };
    speakingMediaRecorder.start();

    let time = limit;
    const progress = document.getElementById('speakingProgressBar');
    const display = document.getElementById('speakingTimerDisplay');
    const update = () => {
        if (display) display.innerText = `00:${time < 10 ? '0' + time : time}`;
        if (progress) progress.style.width = `${((limit - time) / limit) * 100}%`;
    };
    update();

    clearInterval(speakingQuestionTimerInterval);
    speakingQuestionTimerInterval = setInterval(() => {
        time--;
        update();
        if (time <= 0) {
            clearInterval(speakingQuestionTimerInterval);
            stopSpeakingRecording();
        }
    }, 1000);
}

async function stopSpeakingRecording() {
    if (!speakingMediaRecorder || speakingMediaRecorder.state === 'inactive') return;
    speakingMediaRecorder.stop();
    setSpeakingStatus('Saving to Cloud...', 'bg-amber-100 text-amber-700 border-amber-200');
    const micIcon = document.getElementById('speakingMicIcon');
    if (micIcon) { micIcon.classList.remove('bg-transparent', 'text-white'); micIcon.classList.add('bg-amber-100', 'text-amber-500'); }

    speakingMediaRecorder.onstop = async () => {
        try {
            const client = getSupabaseClient();
            const mimeType = speakingMediaRecorder.mimeType || speakingRecordingMimeType || 'audio/webm';
            let fileExt = 'webm';
            if (mimeType.includes('mp4')) fileExt = 'm4a';
            else if (mimeType.includes('aac')) fileExt = 'aac';
            else if (mimeType.includes('ogg')) fileExt = 'ogg';

            const currentItem = speakingItems[speakingIndex];
            const blob = new Blob(speakingAudioChunks, { type: mimeType });
            const { data: { session } } = await client.auth.getSession();
            const fileName = `${session.user.id}/big_mock_${currentItem.task_type}_item${currentItem.task_id}_${Date.now()}.${fileExt}`;

            const { error: uploadError } = await client.storage
                .from('student_recordings')
                .upload(fileName, blob, { contentType: mimeType, upsert: true });

            if (uploadError) {
                console.error("Upload error:", uploadError);
                alert("Ошибка загрузки файла в Storage: " + uploadError.message);
            } else if (speakingAttemptId) {
                const { error: dbError } = await client
                    .from('big_mock_speaking_answers')
                    .insert([{
                        attempt_id: speakingAttemptId,
                        task_id: currentItem.task_id,
                        task_type: currentItem.task_type,
                        audio_url: fileName
                    }]);
                if (dbError) console.error("Database save error:", dbError);
            }
        } catch (err) {
            console.error("Save process error:", err);
            alert("Критическая ошибка сохранения: " + err.message);
        }

        speakingIndex++;
        if (speakingIndex < speakingItems.length) {
            loadSpeakingQuestion(speakingIndex);
        } else {
            finishSpeakingSection();
        }
    };
}

// ==========================================
// 5. ЗАВЕРШЕНИЕ
// ==========================================
async function finishSpeakingSection() {
    if (speakingMediaStream) speakingMediaStream.getTracks().forEach(track => track.stop());
    clearInterval(speakingQuestionTimerInterval);

    const client = getSupabaseClient();
    if (speakingAttemptId && client) {
        try {
            await client
                .from('big_mock_speaking_attempts')
                .update({ status: 'pending_review', completed_at: new Date().toISOString() })
                .eq('id', speakingAttemptId);
        } catch (err) {
            console.error("Ошибка обновления статуса попытки Speaking:", err);
        }
    }

    if (window.fullTestMode && typeof continueFullTestSequence === 'function') { continueFullTestSequence(); return; }
    await loadSpeakingReviewMode(speakingAttemptId, window.currentActiveTestId, window.currentActiveTestTitle);
}

// ==========================================
// 6. РЕЖИМ РЕВЬЮ
// ==========================================
async function loadSpeakingReviewMode(attemptId, testId, testTitle) {
    window.engineType = 'speaking';
    const client = getSupabaseClient();

    const mainInterface = document.getElementById('main-interface');
    if (mainInterface) mainInterface.classList.add('hidden');

    const resultsView = document.getElementById('results-view');
    resultsView.classList.remove('hidden');
    resultsView.className = 'fixed inset-0 z-50 bg-[#f8f9fa] overflow-y-auto';
    resultsView.innerHTML = `<div class="m-auto flex flex-col items-center justify-center text-slate-500"><i data-lucide="loader-2" class="w-10 h-10 animate-spin mb-4 text-indigo-600"></i><p class="font-bold">Loading Speaking results...</p></div>`;
    if (typeof lucide !== 'undefined') lucide.createIcons();

    try {
        window.currentActiveTestId = testId;

        const { data: attemptRow } = await client.from('big_mock_speaking_attempts').select('*').eq('id', attemptId).single();

        const items = await fetchAndParseSpeakingTasks(testId);
        const { data: answers } = await client.from('big_mock_speaking_answers').select('*').eq('attempt_id', attemptId);

        const signedUrls = {};
        await Promise.all((answers || []).map(async (a) => {
            if (!a.audio_url) return;
            const { data } = await client.storage.from('student_recordings').createSignedUrl(a.audio_url, 3600);
            if (data) signedUrls[a.task_id] = data.signedUrl;
        }));

        renderSpeakingReviewUI(attemptRow, items, answers || [], signedUrls);
    } catch (err) {
        console.error("Error loading speaking review:", err);
        alert("Could not load Speaking review mode.");
        if (typeof exitExamEngine === 'function') exitExamEngine();
    }
}

function renderSpeakingReviewUI(attemptRow, items, answers, signedUrls) {
    const examView = document.getElementById('exam-engine-view');
    if (examView) { examView.classList.add('hidden'); examView.classList.remove('flex'); }

    const mainInterface = document.getElementById('main-interface');
    if (mainInterface) mainInterface.classList.add('hidden');

    const resultsView = document.getElementById('results-view');
    resultsView.classList.remove('hidden');
    resultsView.className = 'fixed inset-0 z-50 bg-[#f8f9fa] overflow-y-auto';

    const statusHtml = (attemptRow && attemptRow.status === 'reviewed')
        ? `<div class="text-lg font-bold text-emerald-600">${attemptRow.total_score !== null && attemptRow.total_score !== undefined ? Number(attemptRow.total_score).toFixed(1) : 'Reviewed'}</div><div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Teacher Score</div>`
        : `<div class="text-lg font-bold text-amber-600">Pending</div><div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Teacher Review</div>`;

    let itemsHtml = items.map((item, i) => {
        const q = item.question || {};
        const isInterview = item.task_type === 'interview';
        const answer = answers.find(a => a.task_id === item.task_id);
        const audioUrl = answer ? signedUrls[item.task_id] : null;

        return `
            <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm mb-4">
                <div class="flex items-center justify-between mb-3">
                    <span class="text-sm font-bold text-slate-400">Question ${i + 1}</span>
                    <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${isInterview ? 'text-violet-600 bg-violet-50 border-violet-200' : 'text-sky-600 bg-sky-50 border-sky-200'}">
                        ${isInterview ? 'Interview' : 'Listen & Repeat'}
                    </span>
                </div>
                ${q.transcript ? `
                    <div class="mb-3">
                        <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">${isInterview ? 'Question' : 'Target Phrase'}</p>
                        <p class="text-sm text-slate-700 leading-relaxed">${q.transcript}</p>
                    </div>
                ` : ''}
                ${audioUrl ? `
                    <div class="mt-3">
                        <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Your Recording</p>
                        <audio controls class="w-full h-10" src="${audioUrl}"></audio>
                    </div>
                ` : `<p class="text-xs text-gray-400 italic">No recording found.</p>`}
            </div>
        `;
    }).join('');

    resultsView.innerHTML = `
        <div class="w-full min-h-full p-6 md:p-10 bg-[#f8f9fa]">
            <div class="max-w-4xl mx-auto">
                <div class="bg-white rounded-[2rem] p-8 border border-indigo-100 shadow-sm text-center mb-10 relative overflow-hidden max-w-2xl mx-auto">
                    <div class="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-inner">🎤</div>
                    <h2 class="text-2xl font-bold text-slate-900 mb-2">Speaking Section Completed</h2>
                    <p class="text-xs text-slate-400 mb-6 font-medium">Responses saved for review</p>
                    <div class="flex justify-center items-center mb-8">
                        <div class="px-8 text-center">${statusHtml}</div>
                    </div>
                    <div class="flex justify-center space-x-3">
                        <button onclick="startSpeakingEngine('${window.currentActiveTestId}', document.getElementById('dynamic-test-title').innerText)" class="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-indigo-600 transition shadow-md text-sm flex items-center cursor-pointer">
                            <i data-lucide="rotate-ccw" class="w-4 h-4 mr-2"></i> Retake Speaking
                        </button>
                        <button onclick="typeof exitExamEngine === 'function' ? exitExamEngine() : console.log('Exit requested')" class="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition shadow-sm text-sm cursor-pointer">
                            Back to Dashboard
                        </button>
                    </div>
                </div>
                <div class="space-y-4">${itemsHtml}</div>
            </div>
        </div>
    `;
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// ==========================================
// 7. ЭКСПОРТ В WINDOW
// ==========================================
window.startSpeakingEngine = startSpeakingEngine;
window.loadSpeakingReviewMode = loadSpeakingReviewMode;
window.fetchAndParseSpeakingTasks = fetchAndParseSpeakingTasks;
