// =====================================================================
// section-hub.js — страница раздела: Reading, Listening, Writing, Speaking.
//
// Все четыре страницы теперь собраны по одному шаблону:
//   статьи и стратегии → практика по типам заданий → мини-мок → тренажёры,
//   справа — цель недели и «Ваши результаты».
// Страница раздела — это пустая разметка с <div id="hub" data-section="reading">;
// всё остальное рисует этот файл. Цвет раздела — как на главной
// (Reading голубой, Listening сиреневый, Writing зелёный, Speaking розовый).
//
// Что где поменять:
//   • текст, статьи, ссылки, цели недели — в HUBS ниже;
//   • слова интерфейса на двух языках — в I18N.add(...) ниже.
// Названия заданий TOEFL (Complete the Words, Academic Discussion…) не переводятся.
//
// Числа берутся из базы: всего заданий (у гостя — из каталога guest_catalog,
// вместе с закрытыми), сколько сделано (свои результаты), цель недели.
// =====================================================================
(function () {
    'use strict';

    const L = (en, ru) => [en, ru];

    // ---------- Цвета разделов (как в «Практике по разделам» на главной) ----------
    const THEME = {
        reading:   { bg: '#f0f8f4', line: '#d5ece0', chip: '#d9f0e4', ink: '#22775a', bar: '#6cc3a0', track: '#dcefe5', deep: '#155640' },
        listening: { bg: '#f7f3fd', line: '#ebe1f8', chip: '#ece2fa', ink: '#7148ab', bar: '#b394e0', track: '#ece4f7', deep: '#53308a' },
        writing:   { bg: '#f2f6fe', line: '#dce6fb', chip: '#dfe8fc', ink: '#2f56b8', bar: '#7f9fe6', track: '#e0e8fa', deep: '#213f8a' },
        speaking:  { bg: '#fff5f1', line: '#fbe0d6', chip: '#fde3d8', ink: '#c2502e', bar: '#f39a7b', track: '#fbe5dc', deep: '#963a1f' }
    };

    // ---------- Свой цвет у каждого типа задания (как на старых страницах разделов) ----------
    const ACCENT = {
        violet:  { chip: '#f3e8ff', ink: '#7e22ce', bar: '#a855f7' },
        emerald: { chip: '#d1fae5', ink: '#047857', bar: '#10b981' },
        orange:  { chip: '#ffedd5', ink: '#c2410c', bar: '#f97316' },
        blue:    { chip: '#dbeafe', ink: '#1d4ed8', bar: '#3b82f6' },
        amber:   { chip: '#fef3c7', ink: '#b45309', bar: '#f59e0b' },
        teal:    { chip: '#ccfbf1', ink: '#0f766e', bar: '#14b8a6' },
        rose:    { chip: '#ffe4e6', ink: '#be123c', bar: '#f43f5e' },
        indigo:  { chip: '#e0e7ff', ink: '#4338ca', bar: '#6366f1' },
        sky:     { chip: '#e0f2fe', ink: '#0369a1', bar: '#0ea5e9' }
    };
    // Типы вопросов в «Точности по типам» — каждый своим цветом
    const QCOLOR = { 'Detail': 'indigo', 'Inference': 'rose', 'Vocabulary In Context': 'emerald', 'Negative Factual': 'sky',
        'Sentence Simplification': 'violet', 'Insert Text': 'orange', 'Main Idea': 'teal', 'Gist Content': 'teal', 'Gist Purpose': 'emerald',
        'Main Purpose': 'emerald', 'Rhetorical Purpose': 'violet', 'Function': 'blue', 'Attitude': 'amber', 'Organization': 'violet' };
    const QCYCLE = ['indigo', 'rose', 'emerald', 'amber', 'sky', 'violet', 'teal', 'orange'];

    // ---------- Содержимое разделов ----------
    // count — откуда считать «всего»:
    //   table, mock: 'eq' | 'or' (отбросить задания только для мини-мока), field/value — тип задания,
    //   sets: 'set_number' | 'test_id' — считать наборы, а не строки; levels — уровни тренажёра.
    const HUBS = {
        reading: {
            name: 'Reading', icon: 'book-open-text', goal: 10,
            tagline: L('Read. Analyze. Get the score you aim for.', 'Читайте, разбирайте, выходите на нужный балл.'),
            sub: L('Strategies, practice by task type and a timed mini mock.', 'Стратегии, практика по типам заданий и мини-мок на время.'),
            articlesSub: L('How to read fast and answer every question type.', 'Как читать быстро и отвечать на вопросы каждого типа.'),
            articlesHub: 'reading-articles.html',
            allArticlesSub: L('Every question type, strategies and tips — all in one place.', 'Все типы вопросов, стратегии и советы — в одном месте.'),
            articles: [
                { href: 'general-reading.html', tag: L('Strategy', 'Стратегия'), title: 'General Reading Guide', min: 8,
                  desc: L('Skimming, scanning and active reading — how to get through passages fast.', 'Skimming, scanning и активное чтение: как быстро работать с текстом.') },
                { href: 'article-inference.html', tag: L('Question type', 'Тип вопроса'), title: 'Inference Questions', min: 12,
                  desc: L('How to find implied meaning in academic texts without overthinking.', 'Как находить подразумеваемый смысл в академическом тексте и не додумывать лишнего.') }
            ],
            types: [
                { id: 'cw', title: 'Complete the Words', icon: 'spell-check', accent: 'violet', href: 'complete-words.html', unit: 'common.tasks',
                  desc: L('Fill in the missing letters of words in a short academic text.', 'Допишите недостающие буквы в словах короткого академического текста.'),
                  count: { table: 'complete_words_tasks', mock: 'eq' } },
                { id: 'dl', title: 'Read in Daily Life', icon: 'coffee', accent: 'emerald', href: 'read-daily.html', unit: 'common.tasks',
                  desc: L('Short everyday texts: emails, notices, chats.', 'Короткие тексты из жизни: письма, объявления, переписки.'),
                  count: { table: 'daily_life_tasks', mock: 'eq' } },
                { id: 'ac', title: 'Academic Passage', icon: 'file-text', accent: 'orange', href: 'read-academic.html', unit: 'common.tasks', wide: true,
                  desc: L('Longer academic texts with exam-style questions.', 'Академические тексты подлиннее с вопросами как на экзамене.'),
                  count: { table: 'academic_tasks', mock: 'eq' } }
            ],
            mock: { href: 'mini-mock-test.html', table: 'mock_tests',
                    desc: L('All Reading task types in one go, with an exam timer.', 'Все типы заданий Reading подряд, с таймером как на экзамене.') },
            trainers: []
        },
        listening: {
            name: 'Listening', icon: 'headphones', goal: 8,
            tagline: L('Listen. Take notes. Catch every detail.', 'Слушайте, конспектируйте, ловите каждую деталь.'),
            sub: L('Strategies, practice by task type and a mini mock without pauses.', 'Стратегии, практика по типам заданий и мини-мок без пауз.'),
            articlesSub: L('Note-taking and how to recognise question types.', 'Конспект на слух и как узнавать типы вопросов.'),
            articlesHub: 'listening-articles.html',
            allArticlesSub: L('Every task type, note-taking and strategies — all in one place.', 'Все типы заданий, конспект и стратегии — в одном месте.'),
            articles: [
                { href: 'article-general-listening.html', tag: L('Overview', 'Обзор'), title: 'Listening Overview', min: 9,
                  desc: L('How the 2026 section works: four task types, order and timing.', 'Как устроена секция в формате 2026: четыре типа заданий, порядок и тайминг.') },
                { href: 'article-listen-to-a-conversation.html', tag: L('Task type', 'Тип задания'), title: 'Listen to a Conversation', min: 10,
                  desc: L('Campus dialogues: the speaker’s problem, details and attitudes.', 'Диалоги на кампусе: проблема собеседника, детали и отношение говорящих.') }
            ],
            types: [
                { id: 'cr', title: 'Choose a Response', icon: 'message-circle-reply', accent: 'violet', href: 'choose-response-list.html', unit: 'common.sets',
                  desc: L('Hear a short line and pick the best reply.', 'Короткая реплика — выберите самый уместный ответ.'),
                  count: { table: 'listening_questions', mock: 'or', sets: 'set_number' } },
                { id: 'conversation', title: 'Listen to a Conversation', icon: 'messages-square', accent: 'blue', href: 'practice-view.html?type=conversation', unit: 'common.tasks',
                  desc: L('Campus dialogues between students, professors and staff.', 'Диалоги на кампусе: студенты, преподаватели, сотрудники.'),
                  count: { table: 'listening_tests', mock: 'or', field: 'task_type', value: 'conversation' } },
                { id: 'announcement', title: 'Listen to an Announcement', icon: 'megaphone', accent: 'amber', href: 'practice-view.html?type=announcement', unit: 'common.tasks',
                  desc: L('Campus announcements: rules, changes and key details.', 'Объявления на кампусе: правила, изменения и главные детали.'),
                  count: { table: 'listening_tests', mock: 'or', field: 'task_type', value: 'announcement' } },
                { id: 'academic', title: 'Listen to an Academic Talk', icon: 'graduation-cap', accent: 'teal', href: 'practice-view.html?type=academic', unit: 'common.tasks',
                  desc: L('Short lectures with questions on meaning and structure.', 'Короткие лекции с вопросами на смысл и структуру.'),
                  count: { table: 'listening_tests', mock: 'or', field: 'task_type', value: 'academic' } }
            ],
            mock: { href: 'listening-mini-mock.html', table: 'listening_mock_tests',
                    desc: L('All Listening task types in one go, without pauses.', 'Все типы заданий Listening подряд, без пауз.') },
            trainers: []
        },
        writing: {
            name: 'Writing', icon: 'pen-tool', goal: 5,
            tagline: L('Plan. Write. Make every word count.', 'Планируйте, пишите — пусть каждое слово работает.'),
            sub: L('Guides and templates, practice by task type and a timed mini mock.', 'Разборы и шаблоны, практика по типам заданий и мини-мок на время.'),
            articlesSub: L('Task guides, templates and grammar.', 'Разборы заданий, шаблоны и грамматика.'),
            articlesHub: 'writing-articles.html',
            allArticlesSub: L('Task guides, templates and grammar — all in one place.', 'Разборы заданий, шаблоны и грамматика — в одном месте.'),
            articles: [
                { href: 'article-write-an-academic.html', tag: L('Template', 'Шаблон'), title: 'The Perfect Academic Template', min: 3,
                  desc: L('A clear structure for the 10-minute Academic Discussion.', 'Понятная структура ответа для Academic Discussion за 10 минут.') },
                { href: 'article-write-an-email.html', tag: L('Task type', 'Тип задания'), title: 'Write an Email Task', min: null,
                  desc: L('Tone, structure and the details your email has to cover.', 'Тон, структура и детали, которые должно покрыть письмо.') }
            ],
            types: [
                { id: 'sentence', title: 'Build a Sentence', icon: 'blocks', accent: 'rose', href: 'task-list.html?type=sentence', unit: 'common.sets',
                  desc: L('Put the words in order to make a correct sentence.', 'Соберите из слов правильное предложение.'),
                  count: { table: 'writing_tasks', mock: 'or', field: 'type', value: 'sentence', sets: 'test_id' } },
                { id: 'email', title: 'Write an Email', icon: 'mail', accent: 'blue', href: 'task-list.html?type=email', unit: 'common.tasks',
                  desc: L('A short email for a real-life situation, 7 minutes.', 'Короткое письмо по жизненной ситуации, 7 минут.'),
                  count: { table: 'writing_tasks', mock: 'or', field: 'type', value: 'email' } },
                { id: 'academic', title: 'Academic Discussion', icon: 'messages-square', accent: 'teal', href: 'task-list.html?type=academic', unit: 'common.tasks', wide: true,
                  desc: L('Join a class discussion and defend your opinion, 10 minutes.', 'Ответ в учебной дискуссии со своим мнением, 10 минут.'),
                  count: { table: 'writing_tasks', mock: 'or', field: 'type', value: 'academic' } }
            ],
            mock: { href: 'mini-mock-writing-list.html', table: 'mini_mock_writing',
                    desc: L('Build a Sentence, Email and Academic Discussion in a row, with exam timers.', 'Build a Sentence, Email и Academic Discussion подряд, с таймерами как на экзамене.') },
            trainers: [
                { id: 'sp', title: 'Sentence Preparation', icon: 'list-ordered', accent: 'violet', href: 'sentence-practice.html', unit: 'hub.levels',
                  desc: L('Grammar and word order, step by step by level.', 'Грамматика и порядок слов в предложении — шаг за шагом по уровням.'),
                  count: { table: 'trainer_sentence_levels', published: true } }
            ]
        },
        speaking: {
            name: 'Speaking', icon: 'mic', goal: 6,
            tagline: L('Listen. Respond. Sound confident.', 'Слушайте, отвечайте, звучите уверенно.'),
            sub: L('Answer structure and timing, practice by task type and a timed mini mock.', 'Структура ответа и тайминг, практика по типам заданий и мини-мок на время.'),
            articlesSub: L('Answer structure and timing.', 'Структура ответа и тайминг.'),
            articlesHub: 'speaking-articles.html',
            allArticlesSub: L('Every task type, templates and timing — all in one place.', 'Все типы заданий, шаблоны и тайминг — в одном месте.'),
            articles: [
                { href: 'general-speaking.html', tag: L('Overview', 'Обзор'), title: 'Speaking Overview', min: 9,
                  desc: L('How the section works: two task types, timing and scoring.', 'Как устроена секция: два типа заданий, тайминг и критерии оценки.') },
                { href: 'article-speaking-interview.html', tag: L('Task type', 'Тип задания'), title: 'Take an Interview', min: 12,
                  desc: L('Four questions, 45 seconds each: how to build an answer and keep going.', 'Четыре вопроса по 45 секунд: как строить ответ и не замолкать на середине.') }
            ],
            types: [
                { id: 'listen_repeat', title: 'Listen and Repeat', icon: 'repeat', accent: 'indigo', href: 'listen_repeat.html', unit: 'common.sets',
                  desc: L('Hear a sentence and repeat it exactly.', 'Прослушайте предложение и повторите его точно.'),
                  count: { table: 'speaking_tests', field: 'type', value: 'listen_repeat' } },
                { id: 'interview', title: 'Take an Interview', icon: 'mic', accent: 'sky', href: 'interview.html', unit: 'common.sets',
                  desc: L('Four questions, 45 seconds for each answer.', 'Четыре вопроса, на каждый ответ 45 секунд.'),
                  count: { table: 'speaking_tests', field: 'type', value: 'interview' } }
            ],
            mock: { href: 'speaking_mini_mock.html', table: 'mini_mock_speaking_tests', published: true,
                    desc: L('Listen and Repeat and Interview in a row, with exam timers.', 'Listen and Repeat и Interview подряд, с таймерами как на экзамене.') },
            trainers: [
                { id: 'sh', title: 'Listen & Repeat (Shadowing)', icon: 'audio-lines', accent: 'violet', href: 'listen-repeat-practice.html', unit: 'hub.levels',
                  desc: L('Pronunciation, fluency and intonation by level.', 'Произношение, беглость и интонация — по уровням.'),
                  count: { table: 'shadowing_exercises', levels: 'level_name' } }
            ]
        }
    };

    // Таблицы, где у задания может быть «глазик» (is_hidden): скрытое ученице не считаем
    const HIDEABLE = ['complete_words_tasks', 'daily_life_tasks', 'academic_tasks', 'writing_tasks', 'listening_tests', 'listening_questions', 'speaking_tests'];

    // ---------- Слова интерфейса ----------
    const I = window.I18N || null;
    if (I) I.add({
        'hub.articles': ['Articles & strategies', 'Статьи и стратегии'],
        'hub.allArticles': ['All {name} articles', 'Все статьи раздела {name}'],
        'hub.allShort': ['All articles', 'Все статьи'],
        'hub.minRead': ['{n} min read', '{n} мин чтения'],
        'hub.guide': ['Guide', 'Разбор'],
        'hub.practice': ['Practice', 'Практика'],
        'hub.practiceSub': ['Choose a task type', 'Выберите тип задания'],
        'hub.start': ['Start', 'Начать'],
        'hub.open': ['Open', 'Открыть'],
        'hub.free': ['{n} free', '{n} бесплатно'],
        'hub.done': ['{a} of {b} done', 'Сделано {a} из {b}'],
        'hub.counting': ['Counting…', 'Считаем…'],
        'hub.levels': { en: ['level', 'levels'], ru: ['уровень', 'уровня', 'уровней'] },
        'hub.tests': { en: ['test', 'tests'], ru: ['тест', 'теста', 'тестов'] },
        'hub.mockTag': ['Full section', 'Весь раздел'],
        'hub.mockBtn': ['Choose a test', 'Выбрать тест'],
        'hub.mockLast': ['Last attempt: {d}', 'Последняя попытка: {d}'],
        'hub.mockScore': ['score {s}', 'балл {s}'],
        'hub.trainers': ['Trainers', 'Тренажёры'],
        'hub.trainersSub': ['Step-by-step drills by level', 'Пошаговые упражнения по уровням'],
        'hub.goal': ['This week', 'Цель недели'],
        'hub.goalText': ['Do {n} {name} tasks this week — any type counts, mini mocks too.', 'Сделайте {n} заданий {name} за неделю — подходит любой тип, мини-мок тоже.'],
        'hub.goalDone': ['Goal reached — great week!', 'Цель выполнена — отличная неделя!'],
        'hub.results': ['Your results', 'Ваши результаты'],
        'hub.progress': ['progress', 'прогресс'],
        'hub.byType': ['Done by task type', 'Сделано по типам заданий'],
        'hub.accuracy': ['Accuracy', 'Точность'],
        'hub.accuracyNote': ['Average over all your answers', 'Среднее по всем вашим ответам'],
        'hub.byQType': ['Accuracy by question type', 'Точность по типам вопросов'],
        'hub.qTypeNote': ['Weakest first', 'Сначала слабые места'],
        'hub.noData': ['Results will appear here after your first task.', 'Результаты появятся здесь после первого задания.'],
        'hub.loadError': ['Could not load your results. Please refresh the page.', 'Не получилось загрузить результаты. Обновите страницу.'],
        'hub.w.sentence': ['Build a Sentence accuracy', 'Точность Build a Sentence'],
        'hub.w.email': ['Email (teacher score)', 'Email (оценка преподавателя)'],
        'hub.w.academic': ['Academic Discussion (teacher score)', 'Academic Discussion (оценка преподавателя)'],
        'hub.w.reviewed': ['Essays reviewed', 'Проверено эссе'],
        'hub.w.of': ['{a} of {b}', '{a} из {b}'],
        'hub.w.criteria': ['By criteria', 'По критериям'],
        'hub.w.critNote': ['{n} reviewed essays, out of 6', 'по {n} проверенным эссе, из 6'],
        'hub.w.purpose': ['Communicative purpose', 'Коммуникативная задача'],
        'hub.w.grammar': ['Grammar', 'Грамматика'],
        'hub.w.vocab': ['Vocabulary', 'Лексика'],
        'hub.s.score': ['Teacher score', 'Оценка преподавателя'],
        'hub.s.scoreNote': ['Average over {n} reviewed sets, out of 6', 'Среднее по {n} проверенным наборам, из 6'],
        'hub.s.pending': ['Your teacher checks the recordings — scores will appear here.', 'Записи проверяет преподаватель — оценки появятся здесь.']
    });
    const lang = I ? I.lang : 'en';
    const tr = pair => (Array.isArray(pair) ? (lang === 'ru' ? pair[1] : pair[0]) : String(pair || ''));
    const t = (k, v) => (I ? I.t(k, v) : k);
    const cnt = (n, k) => (I ? I.count(n, k) : n + '');
    const fmtDate = d => (I ? I.date(d, { day: 'numeric', month: 'short' }) : new Date(d).toLocaleDateString()).replace(/\s*г\.$/, '');

    const esc = s => String(s === null || s === undefined ? '' : s)
        .replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const icons = () => { try { window.lucide && window.lucide.createIcons(); } catch (e) { /* без иконок */ } };
    const db = () => window.supabaseClient || (typeof _supabase !== 'undefined' ? _supabase : null);

    // ---------- Стили (цвет раздела — через переменные) ----------
    function injectStyle() {
        if (document.getElementById('hub-style')) return;
        const st = document.createElement('style');
        st.id = 'hub-style';
        st.textContent = `
            .tnum{font-variant-numeric:tabular-nums}
            .hub-card{background:#fff;border:1px solid #eef0f4;border-radius:24px;box-shadow:0 1px 2px rgba(15,23,42,.03)}
            .hub-ink{color:var(--c-ink)}
            .hub-fill{background:var(--c-bar)}
            .hub-pill{background:rgba(255,255,255,.16);color:#fff}

            /* Шапка раздела: крупное название, круг, рисунок и кольцо прогресса */
            .hub-hero{position:relative;overflow:hidden;isolation:isolate;border-radius:32px;
                background:linear-gradient(120deg,var(--c-bg) 0%,#fff 55%,var(--c-bg) 100%);border:1px solid var(--c-line)}
            .hub-hero-circle{position:absolute;right:120px;top:-120px;width:340px;height:340px;border-radius:50%;background:var(--c-chip);opacity:.75;z-index:-2}
            .hub-hero-art{position:absolute;right:20px;bottom:-30px;width:310px;height:260px;color:var(--c-ink);z-index:-1;
                -webkit-mask-image:linear-gradient(to right,transparent 0%,#000 30%);mask-image:linear-gradient(to right,transparent 0%,#000 30%)}
            .hub-hero-tag{background:var(--c-chip);color:var(--c-ink)}
            .hub-hero-title{font-size:clamp(44px,8vw,76px);line-height:.95;letter-spacing:-.035em;font-weight:800;color:#0f1735}
            .hub-ring{position:absolute;right:28px;top:50%;transform:translateY(-50%);width:132px;height:132px;border-radius:50%;
                background:rgba(255,255,255,.9);box-shadow:0 10px 30px -12px rgba(15,23,42,.25);display:flex;align-items:center;justify-content:center}
            @media (max-width:639px){
                .hub-hero-circle{right:-120px;top:-140px;width:280px;height:280px}
                .hub-hero-art{width:190px;height:150px;right:-30px;bottom:-30px;opacity:.6}
                .hub-ring{position:relative;right:auto;top:auto;transform:none;width:96px;height:96px;margin-top:18px;box-shadow:0 6px 18px -10px rgba(15,23,42,.3)}
            }

            /* Заголовок блока с тонкой линией до края */
            .hub-zone-line{flex:1;height:1px;background:linear-gradient(90deg,var(--c-line),transparent)}

            /* Карточка с рисунком справа (статьи, задания, тренажёры) */
            .hub-tile{position:relative;overflow:hidden;isolation:isolate;border-radius:24px;border:1px solid #eef0f4;
                background:linear-gradient(135deg,#fff 0%,#fff 50%,var(--c-bg) 100%);transition:border-color .15s, box-shadow .15s, transform .15s}
            .hub-tile:hover{border-color:var(--c-line);box-shadow:0 14px 30px -18px rgba(15,23,42,.28)}
            .hub-tile:focus-visible{outline:2px solid var(--c-ink);outline-offset:2px}
            .hub-ill{position:absolute;right:-18px;bottom:-22px;width:168px;height:146px;color:var(--c-ink);z-index:-1;
                -webkit-mask-image:linear-gradient(to right,transparent 0%,#000 32%);mask-image:linear-gradient(to right,transparent 0%,#000 32%);
                transition:transform .25s}
            .hub-tile:hover .hub-ill{transform:translate(-4px,-3px) rotate(-1deg)}
            .hub-tile-text{max-width:60%}
            .hub-wide .hub-tile-text{max-width:min(62%,460px)}
            /* у заданий рисунок сверху справа — внизу справа кнопка «Начать» */
            .hub-ill-top{top:12px;bottom:auto;right:-14px;width:132px;height:116px}
            .hub-art-tile .hub-ill{width:150px;height:130px}
            @media (max-width:639px){.hub-tile-text{max-width:66%}.hub-ill-top{width:116px;height:100px}}
            .hub-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
            .hub-go{background:var(--c-ink);color:#fff;transition:background .15s}
            .hub-tile:hover .hub-go{background:var(--c-deep)}
            .hub-track{background:rgba(148,163,184,.22)}

            /* Все статьи — строка-ссылка */
            .hub-all{border:1px dashed var(--c-line);background:rgba(255,255,255,.7)}
            .hub-all:hover{border-style:solid;background:#fff}

            /* Мини-мок: яркая полоса в цвете раздела */
            .hub-mock{background:linear-gradient(135deg,var(--c-ink),var(--c-deep));color:#fff;position:relative;overflow:hidden;isolation:isolate}
            .hub-mock-art{position:absolute;right:-24px;bottom:-34px;z-index:-1;opacity:.16}
            .hub-mock-circle{position:absolute;left:-80px;top:-120px;width:260px;height:260px;border-radius:50%;background:rgba(255,255,255,.06);z-index:-1}
            .hub-mock .hub-mock-btn{background:#fff;color:var(--c-deep)}
            .hub-mock .hub-mock-btn:hover{background:var(--c-bg)}
            .hub-mock a:focus-visible{outline:2px solid #fff;outline-offset:2px}

            /* Справа: цель недели и результаты */
            .hub-goal{background:linear-gradient(140deg,#1e293b,#0f172a);color:#fff;position:relative;overflow:hidden;isolation:isolate}
            .hub-goal::after{content:'';position:absolute;right:-40px;top:-40px;width:150px;height:150px;border-radius:50%;border:22px solid rgba(255,255,255,.1);z-index:-1}
            .hub-goal-track{background:rgba(255,255,255,.14)}
            .hub-goal-bar{background:linear-gradient(90deg,#fbbf24,#f59e0b)}
            .hub-ring-track{stroke:#eef2f7}
            @media (prefers-reduced-motion: reduce){.hub-tile,.hub-ill,.hub-go{transition:none}.hub-tile:hover .hub-ill{transform:none}}
        `;
        document.head.appendChild(st);
    }

    // ---------- Рисунки: мягкий объём, градиенты и тени (без внешних файлов) ----------
    // Цвета берутся из раздела (--c-chip, --c-bar, --c-ink), поэтому рисунок сам
    // перекрашивается вместе с разделом. Каждый тип задания показывает то, что в нём
    // происходит: буквы, переписка, варианты ответа, волна звука, видеозвонок…
    let artSeq = 0;
    const AS = (prop, v) => `style="${prop}:${v}"`;
    function artDefs(u) {
        return `<defs>
            <linearGradient id="${u}p" x1="0" y1="0" x2="1" y2="1"><stop offset="0" ${AS('stop-color', '#ffffff')}/><stop offset="1" ${AS('stop-color', 'var(--c-chip)')}/></linearGradient>
            <linearGradient id="${u}a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" ${AS('stop-color', 'var(--c-bar)')}/><stop offset="1" ${AS('stop-color', 'var(--c-ink)')}/></linearGradient>
            <linearGradient id="${u}m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" ${AS('stop-color', 'var(--c-chip)')}/><stop offset="1" ${AS('stop-color', 'var(--c-bar)')}/></linearGradient>
            <radialGradient id="${u}g" cx=".3" cy=".25" r=".9"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
            <filter id="${u}s" x="-40%" y="-40%" width="180%" height="190%"><feDropShadow dx="0" dy="7" stdDeviation="7" flood-color="#0f172a" flood-opacity=".13"/></filter>
            <filter id="${u}t" x="-40%" y="-40%" width="180%" height="190%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#0f172a" flood-opacity=".12"/></filter>
        </defs>`;
    }
    // Детали: «бумага» с тенью, акцент-градиент, полоски текста, блик, искорка
    const AP = u => `url(#${u}p)`, AA = u => `url(#${u}a)`, AM = u => `url(#${u}m)`;
    const acard = (u, x, y, w, h, r, rot, inner, fill) => `<g transform="rotate(${rot || 0} ${x + w / 2} ${y + h / 2})" filter="url(#${u}s)"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill || AP(u)}"/>${inner || ''}</g>`;
    const abar = (x, y, w, o, fill) => `<rect x="${x}" y="${y}" width="${w}" height="5" rx="2.5" ${fill ? `fill="${fill}"` : AS('fill', 'var(--c-bar)')} opacity="${o === undefined ? .35 : o}"/>`;
    const abars = (x, y, ws, gap, o) => ws.map((w, i) => abar(x, y + i * (gap || 11), w, o)).join('');
    const ashine = (u, x, y, w, h, r) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="url(#${u}g)" opacity=".7"/>`;
    const aspark = (x, y, s) => `<path d="M${x} ${y - s}C${x + s * .18} ${y - s * .18} ${x + s * .18} ${y - s * .18} ${x + s} ${y}C${x + s * .18} ${y + s * .18} ${x + s * .18} ${y + s * .18} ${x} ${y + s}C${x - s * .18} ${y + s * .18} ${x - s * .18} ${y + s * .18} ${x - s} ${y}C${x - s * .18} ${y - s * .18} ${x - s * .18} ${y - s * .18} ${x} ${y - s}Z" ${AS('fill', 'var(--c-bar)')} opacity=".55"/>`;
    const adisc = (u, cx, cy, r, inner) => `<g filter="url(#${u}t)"><circle cx="${cx}" cy="${cy}" r="${r}" fill="${AA(u)}"/>${inner || ''}</g>`;
    const atick = (cx, cy, s) => `<path d="M${cx - s} ${cy}l${s * .7} ${s * .7} ${s * 1.3}-${s * 1.4}" fill="none" stroke="#fff" stroke-width="${Math.max(2.4, s * .55)}" stroke-linecap="round" stroke-linejoin="round"/>`;
    const apill = (u, x, y, w, h, solid) => `<g filter="url(#${u}t)"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${solid ? AA(u) : '#fff'}"/></g>`;
    const aavatar = (u, cx, cy, r, solid) => `<g filter="url(#${u}t)"><circle cx="${cx}" cy="${cy}" r="${r}" fill="${solid ? AA(u) : AM(u)}"/><circle cx="${cx}" cy="${cy - r * .22}" r="${r * .32}" fill="#fff" opacity=".9"/><path d="M${cx - r * .55} ${cy + r * .55}a${r * .55} ${r * .45} 0 0 1 ${r * 1.1} 0" fill="#fff" opacity=".9"/></g>`;

    const ART = {
        sheets: u => acard(u, 62, 26, 86, 112, 12, 9, abars(74, 46, [52, 44, 58, 36, 50, 42], 11, .3))
            + acard(u, 30, 14, 88, 116, 12, -5, `<rect x="30" y="14" width="88" height="26" rx="12" ${AS('fill', 'var(--c-chip)')} opacity=".7"/>` + abar(42, 24, 40, .6) + abars(42, 52, [62, 48, 58, 54, 40, 56], 11) + ashine(u, 34, 18, 50, 40, 10))
            + adisc(u, 128, 30, 15, `<path d="M122 22h12v17l-6-4-6 4z" fill="#fff"/>`) + aspark(22, 120, 7),
        document: u => acard(u, 40, 12, 98, 130, 14, 4, `<rect x="52" y="26" width="46" height="8" rx="4" fill="${AA(u)}"/>` + abars(52, 46, [72, 64, 74]) + `<rect x="50" y="80" width="76" height="14" rx="5" ${AS('fill', 'var(--c-chip)')}/>` + abar(56, 85, 52, .7) + abars(52, 104, [70, 60, 72]) + ashine(u, 44, 16, 56, 44, 12))
            + `<g filter="url(#${u}t)"><circle cx="132" cy="112" r="17" fill="#fff"/><circle cx="132" cy="112" r="11" fill="none" ${AS('stroke', 'var(--c-ink)')} stroke-width="5"/><path d="M140 120l10 10" ${AS('stroke', 'var(--c-ink)')} stroke-width="6" stroke-linecap="round"/></g>`,
        email: u => acard(u, 40, 14, 104, 126, 14, 6, `<rect x="40" y="14" width="104" height="30" rx="14" fill="${AA(u)}"/><rect x="40" y="32" width="104" height="12" fill="${AA(u)}"/><circle cx="56" cy="29" r="5" fill="#fff" opacity=".9"/>` + abar(66, 26, 44, .9, '#fff') + abars(54, 58, [76, 62, 80, 54, 70, 46], 11) + ashine(u, 44, 46, 60, 40, 10))
            + `<g filter="url(#${u}t)" transform="rotate(-38 30 108)"><rect x="12" y="102" width="56" height="13" rx="6.5" fill="${AA(u)}"/><path d="M68 102l12 6.5-12 6.5z" ${AS('fill', 'var(--c-ink)')}/><rect x="12" y="102" width="12" height="13" rx="5" fill="#fff" opacity=".55"/></g>`,
        letters: u => [0, 1, 2].map(i => `<g filter="url(#${u}s)" transform="rotate(${[-6, 3, 8][i]} ${50 + i * 40} ${58})"><rect x="${32 + i * 40}" y="34" width="36" height="46" rx="12" fill="${i ? AP(u) : AA(u)}"/>${i ? `<rect x="${42 + i * 40}" y="66" width="16" height="5" rx="2.5" ${AS('fill', 'var(--c-bar)')} opacity=".7"/>` : `<text x="50" y="68" text-anchor="middle" font-size="26" font-weight="800" fill="#fff" font-family="inherit">A</text>`}</g>`).join('')
            + acard(u, 28, 98, 124, 34, 12, 0, abars(40, 110, [62, 92], 10, .3)) + aspark(150, 26, 8) + aspark(20, 30, 5),
        chat: u => acard(u, 14, 20, 96, 32, 16, 0, abar(30, 33, 58, .4)) + `<circle cx="20" cy="48" r="6" fill="${AP(u)}" filter="url(#${u}t)"/>`
            + acard(u, 58, 62, 102, 34, 17, 0, abar(74, 76, 64, .85, '#fff'), AA(u)) + acard(u, 14, 106, 74, 30, 15, 0, abar(28, 118, 40, .4))
            + `<g filter="url(#${u}t)"><rect x="98" y="110" width="46" height="22" rx="11" fill="#fff"/>${[110, 121, 132].map(x => `<circle cx="${x}" cy="121" r="3" ${AS('fill', 'var(--c-bar)')}/>`).join('')}</g>`,
        reply: u => acard(u, 26, 12, 118, 34, 17, 0, abar(44, 26, 70, .85, '#fff'), AA(u)) + `<path d="M48 44l-4 12 14-12z" ${AS('fill', 'var(--c-ink)')} opacity=".85"/>`
            + [0, 1, 2].map(i => `<g filter="url(#${u}t)"><rect x="${40 + i * 6}" y="${62 + i * 28}" width="112" height="22" rx="11" fill="${i === 1 ? AM(u) : '#fff'}"/>${i === 1 ? `<circle cx="${54 + i * 6}" cy="${73 + i * 28}" r="7" fill="${AA(u)}"/>` + atick(54 + i * 6, 73 + i * 28, 3.2) : `<circle cx="${54 + i * 6}" cy="${73 + i * 28}" r="6" fill="none" ${AS('stroke', 'var(--c-bar)')} stroke-width="2.5" opacity=".6"/>`}${abar(68 + i * 6, 71 + i * 28, 58, i === 1 ? .7 : .35)}</g>`).join(''),
        conversation: u => aavatar(u, 28, 34, 16, true) + acard(u, 50, 18, 98, 32, 16, 0, abar(66, 31, 60, .4))
            + aavatar(u, 146, 98, 16, false) + acard(u, 22, 82, 104, 34, 17, 0, abar(38, 96, 64, .85, '#fff'), AA(u)) + acard(u, 52, 124, 66, 22, 11, 0, `${[66, 77, 88].map(x => `<circle cx="${x}" cy="135" r="3" ${AS('fill', 'var(--c-bar)')}/>`).join('')}`),
        megaphone: u => `<g filter="url(#${u}s)"><path d="M44 58 L104 30 Q112 27 112 36 V114 Q112 123 104 120 L44 92 Z" fill="${AA(u)}"/><rect x="24" y="56" width="26" height="38" rx="10" fill="${AP(u)}"/><path d="M56 92 l8 26 q2 6 9 6 h4 q6 0 4-6 l-6-20" fill="${AM(u)}"/></g>`
            + ashine(u, 50, 36, 40, 30, 12) + `<path d="M124 56 q14 19 0 38 M138 44 q24 31 0 62" fill="none" ${AS('stroke', 'var(--c-bar)')} stroke-width="6" stroke-linecap="round" opacity=".55"/>` + adisc(u, 140, 22, 12, `<rect x="138.5" y="15" width="3" height="9" rx="1.5" fill="#fff"/><circle cx="140" cy="28" r="1.8" fill="#fff"/>`),
        lecture: u => acard(u, 18, 14, 136, 90, 14, 0, `<rect x="34" y="72" width="16" height="18" rx="5" ${AS('fill', 'var(--c-bar)')} opacity=".45"/><rect x="56" y="56" width="16" height="34" rx="5" ${AS('fill', 'var(--c-bar)')} opacity=".7"/><rect x="78" y="38" width="16" height="52" rx="5" fill="${AA(u)}"/>` + abars(104, 40, [36, 28, 34, 22]) + ashine(u, 22, 18, 70, 40, 12))
            + `<g filter="url(#${u}t)"><path d="M86 112 l40 -14 l40 14 l-40 14 z" fill="${AA(u)}"/><path d="M104 120 v12 q22 12 44 0 v-12 l-22 8 z" fill="${AM(u)}"/><path d="M162 113 v16" ${AS('stroke', 'var(--c-ink)')} stroke-width="3" stroke-linecap="round"/></g>`,
        blocks: u => [[18, 26, 50, 1, -4], [74, 22, 34, 0, 3], [114, 28, 46, 0, -2], [24, 66, 40, 0, 2], [70, 62, 60, 1, -3], [134, 68, 30, 0, 4], [40, 104, 64, 0, -2], [110, 102, 44, 1, 3]]
            .map(([x, y, w, f, r]) => `<g filter="url(#${u}t)" transform="rotate(${r} ${x + w / 2} ${y + 13})"><rect x="${x}" y="${y}" width="${w}" height="26" rx="10" fill="${f ? AA(u) : '#fff'}"/>${abar(x + 10, y + 10.5, w - 20, f ? .85 : .35, f ? '#fff' : '')}</g>`).join('')
            + `<path d="M150 118 l0 22 l6-6 l5 9 l4-2 l-5-9 l8-1 z" fill="#0f172a" opacity=".8" stroke="#fff" stroke-width="2" stroke-linejoin="round"/>`,
        discussion: u => [0, 1, 2].map(i => acard(u, 22 + i * 12, 14 + i * 42, 124, 36, 14, 0, `<circle cx="${40 + i * 12}" cy="${32 + i * 42}" r="9" fill="${i === 2 ? '#fff' : AA(u)}" opacity="${i === 2 ? .9 : .85}"/>` + abar(56 + i * 12, 24 + i * 42, 70, i === 2 ? .85 : .4, i === 2 ? '#fff' : '') + abar(56 + i * 12, 35 + i * 42, 46, i === 2 ? .6 : .25, i === 2 ? '#fff' : ''), i === 2 ? AA(u) : '')).join('')
            + adisc(u, 148, 22, 11, `<path d="M148 27c-6-4-8-6-8-9a3.5 3.5 0 0 1 8-1.5 3.5 3.5 0 0 1 8 1.5c0 3-2 5-8 9z" fill="#fff"/>`),
        wave: u => acard(u, 14, 26, 144, 78, 18, 0, [16, 30, 46, 26, 58, 38, 64, 44, 30, 50, 24, 36, 18].map((h, i) => `<rect x="${26 + i * 10.4}" y="${65 - h / 2}" width="6" height="${h}" rx="3" fill="${i % 4 === 2 ? AA(u) : AM(u)}"/>`).join('') + ashine(u, 18, 30, 70, 34, 14))
            + `<g filter="url(#${u}t)"><rect x="54" y="114" width="64" height="26" rx="13" fill="${AA(u)}"/><circle cx="70" cy="127" r="5" fill="#fff"/>${abar(80, 124.5, 28, .85, '#fff')}</g>`,
        interview: u => acard(u, 22, 12, 128, 92, 16, 0, `<rect x="22" y="12" width="128" height="92" rx="16" fill="${AM(u)}" opacity=".55"/>` + `<circle cx="86" cy="46" r="15" fill="#fff" opacity=".95"/><path d="M58 98 q28 -36 56 0 z" fill="#fff" opacity=".95"/>` + `<rect x="120" y="22" width="22" height="12" rx="6" fill="#ef4444"/><circle cx="126" cy="28" r="2.5" fill="#fff"/>` + ashine(u, 26, 16, 70, 40, 14))
            + `<g filter="url(#${u}t)"><rect x="52" y="112" width="68" height="28" rx="14" fill="#fff"/><circle cx="72" cy="126" r="9" fill="${AA(u)}"/><rect x="69.5" y="120" width="5" height="9" rx="2.5" fill="#fff"/><circle cx="100" cy="126" r="9" fill="#ef4444"/><rect x="95" y="124.5" width="10" height="3" rx="1.5" fill="#fff"/></g>`,
        steps: u => [0, 1, 2, 3].map(i => `<g filter="url(#${u}s)"><rect x="${22 + i * 34}" y="${112 - i * 24}" width="30" height="${24 + i * 24}" rx="9" fill="${i === 3 ? AA(u) : AP(u)}"/></g>`).join('')
            + `<path d="M38 96 L72 72 L106 48 L140 24" fill="none" ${AS('stroke', 'var(--c-bar)')} stroke-width="3" stroke-dasharray="1 8" stroke-linecap="round"/>`
            + `<g filter="url(#${u}t)"><path d="M146 6 v26" ${AS('stroke', 'var(--c-ink)')} stroke-width="3" stroke-linecap="round"/><path d="M147 7 h18 l-5 6 5 6 h-18 z" fill="${AA(u)}"/></g>` + aspark(24, 72, 6),
        shadow: u => acard(u, 12, 18, 148, 58, 18, 0, [16, 30, 44, 24, 50, 34, 56, 38, 22, 42, 20].map((h, i) => `<rect x="${26 + i * 12}" y="${47 - h / 2}" width="6" height="${h}" rx="3" fill="${AA(u)}"/>`).join(''))
            + acard(u, 24, 86, 148, 52, 18, 0, [16, 30, 44, 24, 50, 34, 56, 38, 22, 42, 20].map((h, i) => `<rect x="${40 + i * 12}" y="${112 - h * .4}" width="6" height="${h * .8}" rx="3" fill="${AM(u)}"/>`).join('')),
        headphones: u => `<g filter="url(#${u}s)"><path d="M34 96 v-16 a52 52 0 0 1 104 0 v16" fill="none" ${AS('stroke', 'var(--c-ink)')} stroke-width="10" stroke-linecap="round"/><rect x="20" y="84" width="32" height="50" rx="14" fill="${AA(u)}"/><rect x="120" y="84" width="32" height="50" rx="14" fill="${AA(u)}"/></g>`
            + ashine(u, 24, 88, 14, 30, 7) + ashine(u, 124, 88, 14, 30, 7) + [12, 26, 38, 22, 14].map((h, i) => `<rect x="${66 + i * 9}" y="${108 - h / 2}" width="5" height="${h}" rx="2.5" ${AS('fill', 'var(--c-bar)')}/>`).join('') + aspark(150, 30, 8),
        mic: u => `<g filter="url(#${u}s)"><rect x="64" y="14" width="44" height="74" rx="22" fill="${AA(u)}"/></g>` + ashine(u, 68, 18, 20, 40, 10) + [0, 1, 2].map(i => `<rect x="74" y="${34 + i * 12}" width="24" height="4" rx="2" fill="#fff" opacity=".45"/>`).join('')
            + `<path d="M50 66 a36 36 0 0 0 72 0 M86 102 v20 M64 128 h44" fill="none" ${AS('stroke', 'var(--c-ink)')} stroke-width="7" stroke-linecap="round" opacity=".85"/>`
            + acard(u, 118, 18, 46, 26, 13, 0, `${[130, 141, 152].map(x => `<circle cx="${x}" cy="31" r="3" ${AS('fill', 'var(--c-bar)')}/>`).join('')}`) + aspark(28, 34, 8)
    };
    // Рисунок к шапке раздела — побольше
    const HERO_ART = { reading: 'sheets', listening: 'headphones', writing: 'email', speaking: 'mic' };
    const ART_FOR = { cw: 'letters', dl: 'chat', ac: 'document', cr: 'reply', conversation: 'conversation', announcement: 'megaphone',
        sentence: 'blocks', email: 'email', listen_repeat: 'wave', interview: 'interview', sp: 'steps', sh: 'shadow' };
    const ARTICLE_ART = { 'general-reading.html': 'sheets', 'article-inference.html': 'document', 'article-general-listening.html': 'headphones',
        'article-listen-to-a-conversation.html': 'conversation', 'article-write-an-academic.html': 'sheets', 'article-write-an-email.html': 'email',
        'general-speaking.html': 'mic', 'article-speaking-interview.html': 'interview' };
    const artFor = (key, id) => ART_FOR[id] || (id === 'academic' ? (key === 'listening' ? 'lecture' : 'discussion') : 'sheets');
    const svgArt = (name, cls, vb) => {
        const u = 'ha' + (++artSeq) + '_';
        return `<svg class="${cls}" viewBox="${vb || '0 0 172 150'}" aria-hidden="true" focusable="false">${artDefs(u)}${(ART[name] || ART.sheets)(u)}</svg>`;
    };
    const WATCH_SVG = `<svg class="hub-mock-art" width="210" height="210" viewBox="0 0 100 100" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" aria-hidden="true">
            <circle cx="50" cy="56" r="34"/><path d="M50 56V36"/><path d="M50 56l14 10"/><path d="M42 12h16"/><path d="M50 12v10"/><path d="M80 26l6-6"/>
        </svg>`;
    // Заголовок блока: название, подпись и тонкая линия до края
    const zoneHead = (id, title, subtitle) => `<div class="flex items-end gap-4 mb-4">
            <div class="min-w-0"><h2 id="${id}" class="text-xl font-extrabold text-slate-900 tracking-tight leading-tight">${esc(title)}</h2>
            <p class="text-[13px] text-slate-500 mt-0.5">${esc(subtitle)}</p></div>
            <span class="hub-zone-line mb-2.5 hidden sm:block" aria-hidden="true"></span>
        </div>`;

    // ---------- Разметка ----------
    function articleCard(a, i) {
        const meta = a.min ? t('hub.minRead', { n: a.min }) : t('hub.guide');
        const dot = i === 0 ? 'var(--c-bar)' : '#f59e0b';
        return `<a href="${esc(a.href)}" class="hub-tile hub-art-tile block p-5 sm:p-6 min-h-[168px] min-w-0">
                ${svgArt(ARTICLE_ART[a.href] || 'sheets', 'hub-ill')}
                <div class="hub-tile-text">
                    <p class="flex items-center gap-2 text-[13px] font-semibold hub-ink"><span class="hub-dot" style="background:${dot}"></span>${esc(tr(a.tag))}</p>
                    <h3 class="mt-2.5 text-[17px] font-extrabold text-slate-900 leading-snug tracking-tight">${esc(a.title)}</h3>
                    <p class="mt-1.5 text-[13px] text-slate-500 leading-relaxed">${esc(tr(a.desc))}</p>
                    <p class="mt-4 text-[13px] text-slate-500 flex items-center gap-1.5"><i data-lucide="clock" class="w-4 h-4"></i>${esc(meta)}</p>
                </div>
            </a>`;
    }

    function taskCard(x, isTrainer, key) {
        const free = `<span data-free class="hidden shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-100"></span>`;
        const head = `<p class="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] font-semibold hub-ink"><span class="hub-dot" style="background:var(--c-bar)"></span><span data-total class="tnum whitespace-nowrap">${esc(t('hub.counting'))}</span>${free}</p>`;
        const text = `<h3 class="mt-2.5 text-[17px] font-extrabold text-slate-900 leading-snug tracking-tight">${esc(x.title)}</h3>
                <p class="mt-1.5 text-[13px] text-slate-500 leading-relaxed">${esc(tr(x.desc))}</p>`;
        const progress = isTrainer ? '' : `<div class="h-1.5 rounded-full hub-track overflow-hidden"><div data-bar class="h-full hub-fill rounded-full" style="width:0%"></div></div>
                    <p data-done class="mt-1.5 text-[11px] text-slate-500 tnum">&nbsp;</p>`;
        const go = `<span class="hub-go shrink-0 inline-flex items-center gap-1.5 text-[13px] font-bold px-4 py-2.5 rounded-xl">${esc(t('hub.start'))}<i data-lucide="arrow-right" class="w-4 h-4"></i></span>`;
        return `<a href="${esc(x.href)}" data-hub-type="${esc(x.id)}" class="hub-tile ${x.wide ? 'hub-wide sm:col-span-2' : ''} flex flex-col p-5 sm:p-6 min-h-[220px] min-w-0">
                ${svgArt(artFor(key, x.id), 'hub-ill hub-ill-top')}
                <div class="hub-tile-text">${head}${text}</div>
                <div class="mt-auto pt-5 flex items-end justify-between gap-4">
                    <div class="min-w-0 flex-1 ${x.wide ? 'max-w-[300px]' : 'max-w-[58%]'}">${progress}</div>
                    ${go}
                </div>
            </a>`;
    }

    function mockBanner(h) {
        return `<section class="hub-mock rounded-[28px] p-6 sm:p-8" aria-labelledby="hubMockTitle">
                <span class="hub-mock-circle" aria-hidden="true"></span>
                ${WATCH_SVG}
                <div class="flex flex-col md:flex-row md:items-center gap-5 md:gap-8">
                    <div class="min-w-0 flex-1">
                        <span class="hub-pill inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full"><i data-lucide="timer" class="w-3.5 h-3.5"></i>${esc(t('hub.mockTag'))}</span>
                        <h2 id="hubMockTitle" class="mt-3 text-[28px] sm:text-[34px] leading-none font-extrabold tracking-tight">Mini Mock</h2>
                        <p class="mt-2 text-sm sm:text-[15px] text-white/85 leading-relaxed max-w-xl">${esc(tr(h.mock.desc))}</p>
                        <p id="hubMockMeta" class="mt-3 text-[13px] font-semibold text-white/90 tnum">&nbsp;</p>
                    </div>
                    <a href="${esc(h.mock.href)}" class="hub-mock-btn self-start md:self-center shrink-0 inline-flex items-center gap-2 text-sm font-bold px-5 py-3 rounded-2xl transition">${esc(t('hub.mockBtn'))}<i data-lucide="arrow-right" class="w-4 h-4"></i></a>
                </div>
            </section>`;
    }

    function render(root, key) {
        const h = HUBS[key];
        const c = THEME[key];
        Object.entries(c).forEach(([k, v]) => root.style.setProperty('--c-' + k, v));
        root.innerHTML = `
            <header class="hub-hero p-6 sm:p-10 mb-8 sm:mb-10">
                <span class="hub-hero-circle" aria-hidden="true"></span>
                ${svgArt(HERO_ART[key], 'hub-hero-art', '0 0 172 150')}
                <div class="max-w-xl sm:pr-40">
                    <span class="hub-hero-tag inline-block text-[13px] font-bold px-3.5 py-1.5 rounded-full">TOEFL</span>
                    <h1 class="hub-hero-title mt-4">${h.name}</h1>
                    <p class="mt-3 text-[15px] sm:text-lg text-slate-600">${esc(tr(h.tagline))}</p>
                </div>
                <div class="hub-ring" aria-live="polite">
                    <svg class="absolute inset-0 w-full h-full" viewBox="0 0 120 120" aria-hidden="true">
                        <circle cx="60" cy="60" r="52" fill="none" stroke="var(--c-chip)" stroke-width="8"/>
                        <circle id="hubRingArc" cx="60" cy="60" r="52" fill="none" stroke="var(--c-ink)" stroke-width="8" stroke-linecap="round"
                            stroke-dasharray="0 327" transform="rotate(-90 60 60)" style="transition:stroke-dasharray .8s ease"/>
                    </svg>
                    <div class="relative text-center">
                        <div id="hubRingNum" class="text-[26px] sm:text-[30px] font-extrabold text-slate-900 leading-none tnum">—</div>
                        <div class="text-[12px] text-slate-500 mt-1">${esc(t('hub.progress'))}</div>
                    </div>
                </div>
            </header>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
                <div class="lg:col-span-2 space-y-10 sm:space-y-12 min-w-0">
                    <section aria-labelledby="hubArtTitle">
                        ${zoneHead('hubArtTitle', t('hub.articles'), tr(h.articlesSub))}
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">${h.articles.map(articleCard).join('')}</div>
                        <a href="${h.articlesHub}" class="hub-all mt-4 flex items-center gap-3 sm:gap-4 rounded-2xl px-4 py-3.5 group transition">
                            <i data-lucide="library" class="w-5 h-5 hub-ink shrink-0"></i>
                            <span class="min-w-0 flex-1">
                                <span class="flex items-center gap-2 text-sm font-bold text-slate-900">${esc(t('hub.allArticles', { name: h.name }))}
                                    <span data-articles-count="${h.articlesHub}" class="hidden text-[12px] font-bold hub-ink tnum"></span></span>
                                <span class="block text-xs text-slate-500 mt-0.5">${esc(tr(h.allArticlesSub))}</span>
                            </span>
                            <i data-lucide="arrow-right" class="w-5 h-5 hub-ink shrink-0 transition-transform group-hover:translate-x-0.5"></i>
                        </a>
                    </section>

                    <section aria-labelledby="hubPracticeTitle">
                        ${zoneHead('hubPracticeTitle', t('hub.practice'), t('hub.practiceSub'))}
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">${h.types.map(x => taskCard(x, false, key)).join('')}</div>
                    </section>

                    ${mockBanner(h)}

                    ${h.trainers.length ? `<section aria-labelledby="hubTrainTitle">
                        ${zoneHead('hubTrainTitle', t('hub.trainers'), t('hub.trainersSub'))}
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">${h.trainers.map(x => taskCard(x, true, key)).join('')}</div>
                    </section>` : ''}
                </div>

                <aside class="space-y-6 min-w-0 lg:sticky lg:top-6">
                    <section class="hub-goal rounded-3xl p-5 sm:p-6" aria-labelledby="hubGoalTitle">
                        <span class="hub-pill inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full"><i data-lucide="target" class="w-3.5 h-3.5"></i><span id="hubGoalTitle">${esc(t('hub.goal'))}</span></span>
                        <div class="mt-3 flex items-end justify-between gap-3">
                            <span id="hubGoalNum" class="text-[34px] leading-none font-extrabold tnum">—<span class="text-lg text-white/70"> / ${h.goal}</span></span>
                        </div>
                        <div class="mt-3 h-2 rounded-full hub-goal-track overflow-hidden"><div id="hubGoalBar" class="h-full rounded-full hub-goal-bar" style="width:0%;transition:width .6s ease"></div></div>
                        <p id="hubGoalText" class="mt-3 text-[13px] text-white/85 leading-relaxed">${esc(t('hub.goalText', { n: h.goal, name: h.name }))}</p>
                    </section>
                    <section class="hub-card p-5 sm:p-6" aria-labelledby="hubResTitle">
                        <h2 id="hubResTitle" class="text-base font-bold text-slate-900">${esc(t('hub.results'))}</h2>
                        <div id="hubResults" class="mt-4 space-y-5"><p class="text-[13px] text-slate-400">${esc(t('hub.counting'))}</p></div>
                    </section>
                </aside>
            </div>`;
        icons();
    }

    // Кольцо прогресса в шапке: сколько сделано из всех заданий раздела
    function paintHero(h, totals, own) {
        const num = document.getElementById('hubRingNum');
        const arc = document.getElementById('hubRingArc');
        if (!num || !arc) return;
        let d = 0, all = 0;
        h.types.forEach(x => { const info = totals[x.id]; if (!info) return; all += info.total; d += Math.min((own.done || {})[x.id] || 0, info.total); });
        if (!all) { num.textContent = '—'; return; }
        const pct = Math.round(d / all * 100);
        num.textContent = pct + '%';
        const C = 2 * Math.PI * 52;
        requestAnimationFrame(() => arc.setAttribute('stroke-dasharray', `${(C * pct / 100).toFixed(1)} ${C.toFixed(1)}`));
    }

    // ---------- Данные: сколько всего ----------
    // Лёгкие строки таблицы (id + поле типа + набор), постранично — у Supabase не больше 1000 за раз.
    async function lightRows(table, cols, opts) {
        const client = db();
        let want = cols.slice();
        const rows = [];
        for (let from = 0; from < 50000; from += 1000) {
            let q = client.from(table).select(want.join(', ')).order('id', { ascending: true }).range(from, from + 999);
            if (opts.mock === 'eq') q = q.eq('is_mock_only', false);
            if (opts.mock === 'or') q = q.or('is_mock_only.eq.false,is_mock_only.is.null');
            if (opts.published) q = q.eq('is_published', true);
            const { data, error } = await q;
            if (error) {
                // нет необязательной колонки (is_hidden) — читаем без неё
                const miss = want.find(c => c === 'is_hidden' && new RegExp(c).test(error.message || ''));
                if (miss) { want = want.filter(c => c !== miss); from -= 1000; continue; }
                throw error;
            }
            rows.push(...(data || []));
            if (!data || data.length < 1000) break;
        }
        return rows;
    }

    // Всего по типу: у гостя — из каталога (видны и закрытые), у остальных — из таблицы
    async function loadTotals(h, ctx) {
        const groups = {};
        [...h.types, ...h.trainers, { id: '__mock', count: { table: h.mock.table, published: h.mock.published } }]
            .forEach(x => { (groups[x.count.table] = groups[x.count.table] || []).push(x); });
        const out = {};      // id → { total, free }
        const maps = {};     // table → строки (для «сделано»: тип задания и набор по id)
        await Promise.all(Object.keys(groups).map(async table => {
            const items = groups[table];
            let rows = null, guest = false;
            try {
                if (ctx.guest && typeof window.authGuestCatalog === 'function') {
                    rows = await window.authGuestCatalog(table);
                    guest = !!rows;
                }
                if (!rows) {
                    const cols = ['id'];
                    items.forEach(x => {
                        if (x.count.field && !cols.includes(x.count.field)) cols.push(x.count.field);
                        if (x.count.sets && !cols.includes(x.count.sets)) cols.push(x.count.sets);
                        if (x.count.levels && !cols.includes(x.count.levels)) cols.push(x.count.levels);
                    });
                    if (!ctx.teacher && HIDEABLE.includes(table)) cols.push('is_hidden');
                    const first = items[0].count;
                    rows = await lightRows(table, cols, { mock: first.mock, published: first.published });
                    if (!ctx.teacher) rows = rows.filter(r => r.is_hidden !== true);
                }
            } catch (e) {
                console.warn('Не удалось посчитать задания ' + table + ':', e.message || e);
                items.forEach(x => { out[x.id] = null; });
                return;
            }
            if (guest && items[0].count.published) rows = rows.filter(r => r.is_published !== false);
            maps[table] = rows;
            items.forEach(x => {
                const cfg = x.count;
                let list = rows;
                if (cfg.field) list = list.filter(r => String(r[cfg.field] || '').toLowerCase() === cfg.value);
                const keyOf = cfg.sets ? (r => r[cfg.sets] === null || r[cfg.sets] === undefined ? 'id:' + r.id : String(r[cfg.sets]))
                    : cfg.levels ? (r => String(r[cfg.levels] || ''))
                    : (r => String(r.id));
                const all = new Set(list.map(keyOf));
                // у Shadowing гостю открыты 2 упражнения, а не целый уровень — «бесплатно» не пишем
                const free = guest && !cfg.levels ? new Set(list.filter(r => r.__open).map(keyOf)) : null;
                out[x.id] = { total: all.size, free: free ? free.size : null };
            });
        }));
        return { totals: out, maps };
    }

    // ---------- Данные: свои результаты ----------
    async function own(table, cols, uid) {
        try {
            const rows = [];
            for (let from = 0; from < 20000; from += 1000) {
                const { data, error } = await db().from(table).select(cols).eq('user_id', uid).range(from, from + 999);
                if (error) throw error;
                rows.push(...(data || []));
                if (!data || data.length < 1000) break;
            }
            return rows;
        } catch (e) {
            console.warn('Результаты ' + table + ':', e.message || e);
            return null;
        }
    }
    const monday = () => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d.getTime(); };
    const when = r => Date.parse(r.completed_at || r.created_at || '') || 0;
    const thisWeek = r => when(r) >= monday();
    const num = v => { const n = parseFloat(v); return isNaN(n) ? null : n; };
    const latest = list => (list || []).slice().sort((a, b) => when(b) - when(a))[0] || null;

    function parseStats(v) {
        if (!v) return null;
        if (typeof v === 'string') { try { v = JSON.parse(v); } catch (e) { return null; } }
        return v && typeof v === 'object' ? v : null;
    }
    // «detail», «Detail», «Detail Question» — одна категория
    function normCategory(name) {
        const s = String(name || '').replace(/[_-]+/g, ' ').replace(/\s+question$/i, '').replace(/\s+/g, ' ').trim();
        if (!s || /^question$/i.test(s)) return 'Other';
        return s.toLowerCase().replace(/\b[a-z]/g, c => c.toUpperCase());
    }
    // Reading: типы вопросов — только как в официальных заданиях. Старые попытки
    // сохранены со старыми названиями — считаем их в официальные типы.
    const READING_ALIAS = {
        'Detail': 'Factual', 'Factual Information': 'Factual', 'Not Mentioned': 'Negative Factual',
        'Negative Factual Information': 'Negative Factual', 'Sentence Simplification': 'Simplification',
        'Vocabulary In Context': 'Vocabulary', 'Purpose': 'Main Idea'
    };
    function readingCategory(name, row) {
        const k = normCategory(name);
        // Gist Purpose: в Daily — цель всего текста, в Academic — зачем нужен абзац
        if (k === 'Gist Purpose') return String(row && row.task_type).toLowerCase() === 'academic' ? 'Rhetorical Purpose' : 'Main Idea';
        return READING_ALIAS[k] || k;
    }
    function accuracyOf(rows, catOf) {
        let e = 0, tt = 0;
        const cats = {};
        rows.forEach(r => {
            e += Number(r.score_earned) || 0; tt += Number(r.score_total) || 0;
            const st = parseStats(r.category_stats);
            if (st) Object.entries(st).forEach(([name, v]) => {
                const k = catOf ? catOf(name, r) : normCategory(name);
                cats[k] = cats[k] || { e: 0, t: 0 };
                cats[k].e += Number(v && (v.earned !== undefined ? v.earned : v.correct)) || 0;
                cats[k].t += Number(v && v.total) || 0;
            });
        });
        const list = Object.entries(cats).filter(([, v]) => v.t > 0).map(([name, v]) => ({ name, pct: Math.round(v.e / v.t * 100) }))
            .sort((a, b) => a.pct - b.pct);
        return { pct: tt ? Math.round(e / tt * 100) : null, cats: list };
    }

    // Writing: балл эссе («4.5» или «4.5/6.0»; «0/6.0» — заглушка, не оценка)
    function essayScore(r) {
        if (!r || r.score === null || r.score === undefined) return null;
        const s = String(r.score).trim();
        if (!s || /^0\s*\/\s*6(\.0+)?$/.test(s)) return null;
        const m = s.match(/^(\d+(?:\.\d+)?)(?:\s*\/\s*6(?:\.0+)?)?$/);
        return m ? parseFloat(m[1]) : null;
    }
    const CRITERIA = [
        { key: 'purpose_score', label: 'hub.w.purpose' },
        { key: 'grammar_score', label: 'hub.w.grammar' },
        { key: 'vocabulary_score', label: 'hub.w.vocab' }
    ];
    const critVal = (r, k) => (r && r[k] !== null && r[k] !== undefined && r[k] !== '' ? num(r[k]) : null);
    function isReviewed(r) {
        const filled = v => String(v || '').trim() !== '';
        return !!r && (filled(r.correction) || filled(r.teacher_correction) || essayScore(r) !== null || CRITERIA.some(c => critVal(r, c.key) !== null));
    }
    function sortAttempts(list) {
        return [...list].sort((a, b) => {
            const an = Number(a.attempt_no), bn = Number(b.attempt_no);
            if (an && bn && an !== bn) return an - bn;
            const at = String(a.created_at || ''), bt = String(b.created_at || '');
            if (at !== bt) return at < bt ? -1 : 1;
            return Number(a.id) - Number(b.id);
        });
    }

    // Что сделано (по типам), цель недели, последний мини-мок и блоки «Ваших результатов»
    async function loadOwn(key, uid, maps) {
        const typeOf = (table, field) => {
            const m = new Map();
            (maps[table] || []).forEach(r => m.set(String(r.id), r[field]));
            return m;
        };
        const res = { done: {}, week: 0, mock: null, blocks: [], failed: false };

        if (key === 'reading') {
            const [rr, cw, mm] = await Promise.all([
                own('reading_results', '*', uid), own('complete_words_results', 'task_id, created_at', uid),
                own('mock_test_results', 'test_id, band_score, created_at', uid)
            ]);
            if (!rr && !cw && !mm) res.failed = true;
            const r = rr || [];
            res.done.cw = new Set((cw || []).map(x => String(x.task_id))).size;
            res.done.dl = new Set(r.filter(x => String(x.task_type).toLowerCase() !== 'academic').map(x => String(x.task_id))).size;
            res.done.ac = new Set(r.filter(x => String(x.task_type).toLowerCase() === 'academic').map(x => String(x.task_id))).size;
            res.week = r.filter(thisWeek).length + (cw || []).filter(thisWeek).length + (mm || []).filter(thisWeek).length;
            const last = latest(mm);
            if (last) res.mock = { at: when(last), score: num(last.band_score) };
            res.blocks.push(accuracyBlock(accuracyOf(r, readingCategory)));
        }

        if (key === 'listening') {
            const [lr, rs, mm] = await Promise.all([
                own('listening_results', '*', uid), own('response_results', 'set_number, score_earned, score_total, created_at', uid),
                own('listening_mini_mock_results', '*', uid)
            ]);
            if (!lr && !rs && !mm) res.failed = true;
            const l = lr || [];
            const tType = typeOf('listening_tests', 'task_type');
            const kind = x => String(tType.get(String(x.task_id)) || x.task_type || '').toLowerCase();
            res.done.cr = new Set((rs || []).map(x => String(x.set_number))).size;
            ['conversation', 'announcement', 'academic'].forEach(k => { res.done[k] = new Set(l.filter(x => kind(x) === k).map(x => String(x.task_id))).size; });
            res.week = l.filter(thisWeek).length + (rs || []).filter(thisWeek).length + (mm || []).filter(thisWeek).length;
            const last = latest(mm);
            if (last) res.mock = { at: when(last), score: num(last.final_calculated_score) };
            res.blocks.push(accuracyBlock(accuracyOf(l.concat(rs || []))));
        }

        if (key === 'writing') {
            const [sr, mm] = await Promise.all([own('student_responses', '*', uid), own('mini_mock_writing_attempts', '*', uid)]);
            if (!sr && !mm) res.failed = true;
            const rows = (sr || []).filter(r => ['sentence', 'email', 'academic'].includes(String(r.task_type).toLowerCase()));
            const setOf = typeOf('writing_tasks', 'test_id');
            const setKey = r => { const s = setOf.get(String(r.task_id)); return s !== undefined && s !== null ? 'set:' + s : 'task:' + r.task_id; };
            const sent = rows.filter(r => String(r.task_type).toLowerCase() === 'sentence');
            const essays = rows.filter(r => String(r.task_type).toLowerCase() !== 'sentence');
            res.done.sentence = new Set(sent.map(setKey)).size;
            res.done.email = new Set(essays.filter(r => String(r.task_type).toLowerCase() === 'email').map(r => String(r.task_id))).size;
            res.done.academic = new Set(essays.filter(r => String(r.task_type).toLowerCase() === 'academic').map(r => String(r.task_id))).size;
            res.week = new Set(sent.filter(thisWeek).map(setKey)).size + essays.filter(thisWeek).length + (mm || []).filter(thisWeek).length;
            const last = latest(mm);
            if (last) res.mock = { at: when(last), score: num(last.overall_score) };
            res.blocks.push(writingBlock(sent, essays));
        }

        if (key === 'speaking') {
            const [sa, mm] = await Promise.all([own('speaking_attempts', '*', uid), own('mini_mock_speaking_attempts', '*', uid)]);
            if (!sa && !mm) res.failed = true;
            const att = sa || [];
            // набор засчитан, если он завершён или в нём есть хоть одна запись
            const answered = new Set();
            const ids = att.map(a => a.id).filter(Boolean);
            for (let i = 0; i < ids.length; i += 100) {
                try {
                    const { data } = await db().from('speaking_responses').select('attempt_id').in('attempt_id', ids.slice(i, i + 100));
                    (data || []).forEach(r => answered.add(String(r.attempt_id)));
                } catch (e) { /* без записей */ }
            }
            const real = att.filter(a => a.status === 'completed' || answered.has(String(a.id)));
            const tType = typeOf('speaking_tests', 'type');
            ['listen_repeat', 'interview'].forEach(k => {
                res.done[k] = new Set(real.filter(a => String(tType.get(String(a.test_id)) || '').toLowerCase() === k).map(a => String(a.test_id))).size;
            });
            const mocks = (mm || []).filter(a => a.status && a.status !== 'in_progress');
            res.week = real.filter(thisWeek).length + mocks.filter(thisWeek).length;
            const last = latest(mocks);
            if (last) res.mock = { at: when(last), score: num(last.overall_score) };
            res.blocks.push(speakingBlock(real));
        }
        return res;
    }

    // ---------- Блоки «Ваших результатов» ----------
    // Полоска: цвет — свой у каждой строки (тип задания, тип вопроса, критерий)
    const bar = (pct, max, color) => `<div class="mt-1.5 h-2 rounded-full bg-slate-100 overflow-hidden"><div class="h-full rounded-full ${color ? '' : 'hub-fill'}" style="width:${Math.max(0, Math.min(100, max ? pct / max * 100 : pct))}%;${color ? 'background:' + color : ''}"></div></div>`;
    const dot = color => `<span class="inline-block w-2 h-2 rounded-full shrink-0" style="background:${color}"></span>`;
    // Кольцо с процентом: зелёное — отлично, синее — хорошо, оранжевое — есть над чем поработать
    function ring(pct, labelTop, max) {
        const v = max ? pct / max : pct / 100;
        const tone = v >= 0.8 ? { c: '#10b981', l: tr(L('Excellent', 'Отлично')) } : v >= 0.6 ? { c: '#3b82f6', l: tr(L('Good', 'Хорошо')) } : { c: '#f97316', l: tr(L('Keep going', 'Есть над чем поработать')) };
        const C = 2 * Math.PI * 30;
        const shown = max ? (Math.round(pct * 10) / 10).toFixed(1) : pct + '%';
        return `<div class="flex items-center gap-4">
            <svg width="76" height="76" viewBox="0 0 76 76" class="shrink-0" aria-hidden="true">
                <circle cx="38" cy="38" r="30" fill="none" class="hub-ring-track" stroke-width="8"/>
                <circle cx="38" cy="38" r="30" fill="none" stroke="${tone.c}" stroke-width="8" stroke-linecap="round"
                    stroke-dasharray="${(C * Math.max(0, Math.min(1, v))).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 38 38)"/>
                <text x="38" y="43" text-anchor="middle" font-size="${max ? 17 : 15}" font-weight="800" fill="#0f172a" font-family="inherit">${shown}</text>
            </svg>
            <div class="min-w-0">${labelTop}<p class="mt-1.5 text-xs font-bold" style="color:${tone.c}">${esc(tone.l)}</p></div>
        </div>`;
    }
    const sub = (title, note) => `<div class="min-w-0"><p class="text-xs font-bold text-slate-800">${esc(title)}</p>${note ? `<p class="text-[11px] text-slate-400 mt-0.5">${esc(note)}</p>` : ''}</div>`;

    function accuracyBlock(a) {
        if (a.pct === null && !a.cats.length) return '';
        let html = '';
        if (a.pct !== null) html += `<div>${ring(a.pct, sub(t('hub.accuracy'), t('hub.accuracyNote')))}</div>`;
        if (a.cats.length) html += `<div>${sub(t('hub.byQType'), a.cats.length > 1 ? t('hub.qTypeNote') : '')}
                <div class="mt-2.5 space-y-2.5">${a.cats.slice(0, 8).map((c, i) => {
                    const col = ACCENT[QCOLOR[c.name] || QCYCLE[i % QCYCLE.length]].bar;
                    return `<div>
                    <div class="flex items-center justify-between gap-3 text-xs"><span class="text-slate-600 min-w-0 truncate flex items-center gap-2">${dot(col)}${esc(c.name)}</span><span class="font-bold text-slate-800 tnum">${c.pct}%</span></div>
                    ${bar(c.pct, 0, col)}</div>`;
                }).join('')}</div></div>`;
        return html;
    }

    function writingBlock(sent, essays) {
        const avg = arr => (arr.length ? arr.reduce((x, y) => x + y, 0) / arr.length : null);
        const f1 = v => (v === null ? '—' : (Math.round(v * 10) / 10).toFixed(1));
        let sE = 0, sT = 0;
        sent.forEach(r => {
            const s = String(r.score || '');
            if (s.includes('/')) { const [e, m] = s.split('/').map(Number); if (!isNaN(e) && m > 0) { sE += e; sT += m; } }
        });
        const byTask = {};
        essays.forEach(r => { const k = String(r.task_id); (byTask[k] = byTask[k] || []).push(r); });
        Object.keys(byTask).forEach(k => { byTask[k] = sortAttempts(byTask[k]); });
        const lastScore = list => { const r = [...list].reverse().find(x => essayScore(x) !== null); return r ? essayScore(r) : null; };
        const lists = Object.values(byTask);
        const email = lists.filter(l => String(l[0].task_type).toLowerCase() === 'email').map(lastScore).filter(v => v !== null);
        const acad = lists.filter(l => String(l[0].task_type).toLowerCase() === 'academic').map(lastScore).filter(v => v !== null);
        const reviewed = lists.filter(l => isReviewed(l[l.length - 1])).length;
        if (!sT && !lists.length) return '';
        const row = (label, val, col) => `<div class="flex items-center justify-between gap-3 py-2 border-b border-gray-100 last:border-0 text-[13px]"><span class="text-slate-600 min-w-0 flex items-center gap-2">${dot(col)}${esc(label)}</span><span class="font-bold text-slate-900 tnum shrink-0">${esc(val)}</span></div>`;
        let html = `<div>${row(t('hub.w.sentence'), sT ? Math.round(sE / sT * 100) + '%' : '—', ACCENT.rose.bar)}
            ${row(t('hub.w.email'), email.length ? f1(avg(email)) + ' / 6' : '—', ACCENT.blue.bar)}
            ${row(t('hub.w.academic'), acad.length ? f1(avg(acad)) + ' / 6' : '—', ACCENT.teal.bar)}
            ${row(t('hub.w.reviewed'), lists.length ? t('hub.w.of', { a: reviewed, b: lists.length }) : '—', ACCENT.indigo.bar)}</div>`;
        // По критериям: у каждого эссе — последняя попытка с оценками
        const sum = {}, n = {};
        let k = 0;
        lists.forEach(list => {
            const r = [...list].reverse().find(x => CRITERIA.some(c => critVal(x, c.key) !== null));
            if (!r) return;
            k++;
            CRITERIA.forEach(c => { const v = critVal(r, c.key); if (v !== null) { sum[c.key] = (sum[c.key] || 0) + v; n[c.key] = (n[c.key] || 0) + 1; } });
        });
        const critCol = [ACCENT.emerald.bar, ACCENT.indigo.bar, ACCENT.sky.bar];
        if (k) html += `<div>${sub(t('hub.w.criteria'), t('hub.w.critNote', { n: k }))}<div class="mt-2.5 space-y-2.5">${CRITERIA.map((c, i) => {
            const a = n[c.key] ? sum[c.key] / n[c.key] : null;
            return `<div><div class="flex items-center justify-between gap-3 text-xs"><span class="text-slate-600 flex items-center gap-2">${dot(critCol[i])}${esc(t(c.label))}</span><span class="font-bold text-slate-800 tnum">${f1(a)}</span></div>${bar(a || 0, 6, critCol[i])}</div>`;
        }).join('')}</div></div>`;
        return html;
    }

    function speakingBlock(real) {
        if (!real.length) return '';
        const scores = real.map(a => num(a.score)).filter(v => v !== null);
        if (!scores.length) return `<p class="text-[13px] text-slate-500 leading-relaxed">${esc(t('hub.s.pending'))}</p>`;
        const a = scores.reduce((x, y) => x + y, 0) / scores.length;
        return `<div>${ring(a, sub(t('hub.s.score'), t('hub.s.scoreNote', { n: scores.length })), 6)}</div>`;
    }

    // ---------- Сборка ----------
    function paintTotals(h, totals, done) {
        [...h.types, ...h.trainers].forEach(x => {
            const card = document.querySelector(`[data-hub-type="${x.id}"]`);
            if (!card) return;
            const info = totals[x.id];
            const totalEl = card.querySelector('[data-total]');
            if (!info) { totalEl.innerHTML = '&nbsp;'; return; }
            totalEl.textContent = cnt(info.total, x.unit);
            if (info.free !== null && info.free !== undefined) {
                card.querySelectorAll('[data-free], [data-free-wide]').forEach(f => {
                    f.textContent = t('hub.free', { n: info.free });
                    f.classList.remove('hidden');
                });
            }
            const d = done && done[x.id] !== undefined ? Math.min(done[x.id], info.total) : null;
            const barEl = card.querySelector('[data-bar]');
            const doneEl = card.querySelector('[data-done]');
            if (barEl && d !== null) {
                barEl.style.width = (info.total ? Math.round(d / info.total * 100) : 0) + '%';
                doneEl.textContent = t('hub.done', { a: d, b: info.total });
            }
        });
    }

    function paintMock(h, totals, mock) {
        const el = document.getElementById('hubMockMeta');
        if (!el) return;
        const parts = [];
        const info = totals.__mock;
        if (info) parts.push(cnt(info.total, 'hub.tests') + (info.free !== null && info.free !== undefined ? ' · ' + t('hub.free', { n: info.free }) : ''));
        if (mock) parts.push(t('hub.mockLast', { d: fmtDate(mock.at) }) + (mock.score !== null ? ', ' + t('hub.mockScore', { s: mock.score.toFixed(1) }) : ''));
        el.innerHTML = parts.length ? esc(parts.join(' · ')) : '&nbsp;';
    }

    function paintGoal(h, week) {
        const n = Math.min(week, h.goal);
        document.getElementById('hubGoalNum').innerHTML = `${n}<span class="text-lg text-white/70"> / ${h.goal}</span>`;
        requestAnimationFrame(() => { document.getElementById('hubGoalBar').style.width = Math.round(n / h.goal * 100) + '%'; });
        if (week >= h.goal) document.getElementById('hubGoalText').textContent = t('hub.goalDone');
    }

    function paintResults(h, totals, own) {
        const box = document.getElementById('hubResults');
        if (!box) return;
        if (own.failed) { box.innerHTML = `<p class="text-[13px] text-rose-600">${esc(t('hub.loadError'))}</p>`; return; }
        const rows = h.types.map(x => {
            const info = totals[x.id];
            if (!info) return '';
            const d = Math.min(own.done[x.id] || 0, info.total);
            const col = (ACCENT[x.accent] || ACCENT.indigo).bar;
            return `<div><div class="flex items-center justify-between gap-3 text-xs"><span class="text-slate-600 min-w-0 truncate flex items-center gap-2">${dot(col)}${esc(x.title)}</span><span class="font-bold text-slate-800 tnum shrink-0">${d} / ${info.total}</span></div>${bar(info.total ? d / info.total * 100 : 0, 0, col)}</div>`;
        }).join('');
        const any = Object.values(own.done).some(v => v > 0);
        const extra = own.blocks.filter(Boolean).join('');
        box.innerHTML = `<div>${sub(t('hub.byType'))}<div class="mt-2.5 space-y-2.5">${rows}</div></div>
            ${extra || (!any ? `<p class="text-[13px] text-slate-400 leading-relaxed">${esc(t('hub.noData'))}</p>` : '')}`;
    }

    async function start() {
        const root = document.getElementById('hub');
        if (!root) return;
        const key = root.getAttribute('data-section');
        const h = HUBS[key];
        if (!h) return;
        injectStyle();
        render(root, key);

        if (typeof window.requireAuth !== 'function') return;
        const user = await window.requireAuth();
        if (!user) return;
        const ctx = { teacher: user.role === 'teacher', guest: user.role === 'guest' };

        const { totals, maps } = await loadTotals(h, ctx);
        paintTotals(h, totals, null);
        paintMock(h, totals, null);

        let ownRes;
        try { ownRes = await loadOwn(key, user.id, maps); } catch (e) { console.error('Результаты раздела:', e); ownRes = { done: {}, week: 0, mock: null, blocks: [], failed: true }; }
        paintTotals(h, totals, ownRes.done);
        paintMock(h, totals, ownRes.mock);
        paintGoal(h, ownRes.week);
        paintResults(h, totals, ownRes);
        paintHero(h, totals, ownRes);
        icons();
    }

    // для проверки на стенде
    window.SectionHub = { HUBS, THEME };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();
})();
