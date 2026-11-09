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
        reading:   { bg: '#f3f6fd', line: '#e0e8f8', chip: '#e1e9fa', ink: '#3d5ca8', bar: '#8aa3e0', track: '#e2e9f7', deep: '#2b4482' },
        listening: { bg: '#f7f3fd', line: '#ebe1f8', chip: '#ece2fa', ink: '#7148ab', bar: '#b394e0', track: '#ece4f7', deep: '#53308a' },
        writing:   { bg: '#f1f8f5', line: '#d9ede3', chip: '#dbefe5', ink: '#2e7a5b', bar: '#82c4a6', track: '#ddefe6', deep: '#1d5a41' },
        speaking:  { bg: '#fcf3f5', line: '#f5dfe5', chip: '#f8e1e7', ink: '#b04560', bar: '#e89eb0', track: '#f5e3e8', deep: '#8a2f47' }
    };

    // ---------- Содержимое разделов ----------
    // count — откуда считать «всего»:
    //   table, mock: 'eq' | 'or' (отбросить задания только для мини-мока), field/value — тип задания,
    //   sets: 'set_number' | 'test_id' — считать наборы, а не строки; levels — уровни тренажёра.
    const HUBS = {
        reading: {
            name: 'Reading', icon: 'book-open-text', goal: 10,
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
                { id: 'cw', title: 'Complete the Words', icon: 'spell-check', href: 'complete-words.html', unit: 'common.tasks',
                  desc: L('Fill in the missing letters of words in a short academic text.', 'Допишите недостающие буквы в словах короткого академического текста.'),
                  count: { table: 'complete_words_tasks', mock: 'eq' } },
                { id: 'dl', title: 'Read in Daily Life', icon: 'coffee', href: 'read-daily.html', unit: 'common.tasks',
                  desc: L('Short everyday texts: emails, notices, chats.', 'Короткие тексты из жизни: письма, объявления, переписки.'),
                  count: { table: 'daily_life_tasks', mock: 'eq' } },
                { id: 'ac', title: 'Academic Passage', icon: 'file-text', href: 'read-academic.html', unit: 'common.tasks', wide: true,
                  desc: L('Longer academic texts with exam-style questions.', 'Академические тексты подлиннее с вопросами как на экзамене.'),
                  count: { table: 'academic_tasks', mock: 'eq' } }
            ],
            mock: { href: 'mini-mock-test.html', table: 'mock_tests',
                    desc: L('All Reading task types in one go, with an exam timer.', 'Все типы заданий Reading подряд, с таймером как на экзамене.') },
            trainers: []
        },
        listening: {
            name: 'Listening', icon: 'headphones', goal: 8,
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
                { id: 'cr', title: 'Choose a Response', icon: 'message-circle-reply', href: 'choose-response-list.html', unit: 'common.sets',
                  desc: L('Hear a short line and pick the best reply.', 'Короткая реплика — выберите самый уместный ответ.'),
                  count: { table: 'listening_questions', mock: 'or', sets: 'set_number' } },
                { id: 'conversation', title: 'Listen to a Conversation', icon: 'messages-square', href: 'practice-view.html?type=conversation', unit: 'common.tasks',
                  desc: L('Campus dialogues between students, professors and staff.', 'Диалоги на кампусе: студенты, преподаватели, сотрудники.'),
                  count: { table: 'listening_tests', mock: 'or', field: 'task_type', value: 'conversation' } },
                { id: 'announcement', title: 'Listen to an Announcement', icon: 'megaphone', href: 'practice-view.html?type=announcement', unit: 'common.tasks',
                  desc: L('Campus announcements: rules, changes and key details.', 'Объявления на кампусе: правила, изменения и главные детали.'),
                  count: { table: 'listening_tests', mock: 'or', field: 'task_type', value: 'announcement' } },
                { id: 'academic', title: 'Listen to an Academic Talk', icon: 'graduation-cap', href: 'practice-view.html?type=academic', unit: 'common.tasks',
                  desc: L('Short lectures with questions on meaning and structure.', 'Короткие лекции с вопросами на смысл и структуру.'),
                  count: { table: 'listening_tests', mock: 'or', field: 'task_type', value: 'academic' } }
            ],
            mock: { href: 'listening-mini-mock.html', table: 'listening_mock_tests',
                    desc: L('All Listening task types in one go, without pauses.', 'Все типы заданий Listening подряд, без пауз.') },
            trainers: []
        },
        writing: {
            name: 'Writing', icon: 'pen-tool', goal: 5,
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
                { id: 'sentence', title: 'Build a Sentence', icon: 'blocks', href: 'task-list.html?type=sentence', unit: 'common.sets',
                  desc: L('Put the words in order to make a correct sentence.', 'Соберите из слов правильное предложение.'),
                  count: { table: 'writing_tasks', mock: 'or', field: 'type', value: 'sentence', sets: 'test_id' } },
                { id: 'email', title: 'Write an Email', icon: 'mail', href: 'task-list.html?type=email', unit: 'common.tasks',
                  desc: L('A short email for a real-life situation, 7 minutes.', 'Короткое письмо по жизненной ситуации, 7 минут.'),
                  count: { table: 'writing_tasks', mock: 'or', field: 'type', value: 'email' } },
                { id: 'academic', title: 'Academic Discussion', icon: 'messages-square', href: 'task-list.html?type=academic', unit: 'common.tasks', wide: true,
                  desc: L('Join a class discussion and defend your opinion, 10 minutes.', 'Ответ в учебной дискуссии со своим мнением, 10 минут.'),
                  count: { table: 'writing_tasks', mock: 'or', field: 'type', value: 'academic' } }
            ],
            mock: { href: 'mini-mock-writing-list.html', table: 'mini_mock_writing',
                    desc: L('Build a Sentence, Email and Academic Discussion in a row, with exam timers.', 'Build a Sentence, Email и Academic Discussion подряд, с таймерами как на экзамене.') },
            trainers: [
                { id: 'sp', title: 'Sentence Preparation', icon: 'list-ordered', href: 'sentence-practice.html', unit: 'hub.levels',
                  desc: L('Grammar and word order, step by step by level.', 'Грамматика и порядок слов в предложении — шаг за шагом по уровням.'),
                  count: { table: 'trainer_sentence_levels', published: true } }
            ]
        },
        speaking: {
            name: 'Speaking', icon: 'mic', goal: 6,
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
                { id: 'listen_repeat', title: 'Listen and Repeat', icon: 'repeat', href: 'listen_repeat.html', unit: 'common.sets',
                  desc: L('Hear a sentence and repeat it exactly.', 'Прослушайте предложение и повторите его точно.'),
                  count: { table: 'speaking_tests', field: 'type', value: 'listen_repeat' } },
                { id: 'interview', title: 'Take an Interview', icon: 'mic', href: 'interview.html', unit: 'common.sets',
                  desc: L('Four questions, 45 seconds for each answer.', 'Четыре вопроса, на каждый ответ 45 секунд.'),
                  count: { table: 'speaking_tests', field: 'type', value: 'interview' } }
            ],
            mock: { href: 'speaking_mini_mock.html', table: 'mini_mock_speaking_tests', published: true,
                    desc: L('Listen and Repeat and Interview in a row, with exam timers.', 'Listen and Repeat и Interview подряд, с таймерами как на экзамене.') },
            trainers: [
                { id: 'sh', title: 'Listen & Repeat (Shadowing)', icon: 'audio-lines', href: 'listen-repeat-practice.html', unit: 'hub.levels',
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
            .hub-card{background:#fff;border:1px solid #f1f2f4;border-radius:24px;box-shadow:0 1px 2px rgba(15,23,42,.03)}
            .hub-tint{background:var(--c-bg);border:1px solid var(--c-line)}
            .hub-chip{background:var(--c-chip);color:var(--c-ink)}
            .hub-ink{color:var(--c-ink)}
            .hub-btn{background:var(--c-chip);color:var(--c-ink);transition:background .15s}
            .hub-btn:hover{background:var(--c-line)}
            .hub-solid{background:var(--c-ink);color:#fff;transition:background .15s}
            .hub-solid:hover{background:var(--c-deep)}
            .hub-track{background:var(--c-track)}
            .hub-fill{background:var(--c-bar)}
            .hub-task{transition:border-color .15s, box-shadow .15s}
            .hub-task:hover{border-color:var(--c-line);box-shadow:0 6px 18px -10px rgba(15,23,42,.18)}
            .hub-task:focus-visible,.hub-art:focus-visible,.hub-all:focus-visible,.hub-mock a:focus-visible{outline:2px solid var(--c-ink);outline-offset:2px}
            .hub-art{border-left:3px solid var(--c-bar)}
            .hub-mock{background:linear-gradient(135deg,var(--c-ink),var(--c-deep));color:#fff;position:relative;overflow:hidden;isolation:isolate}
            .hub-mock::after{content:'';position:absolute;right:-60px;top:-60px;width:220px;height:220px;border-radius:50%;border:28px solid rgba(255,255,255,.08);z-index:-1}
            .hub-mock .hub-mock-btn{background:#fff;color:var(--c-deep)}
            .hub-mock .hub-mock-btn:hover{background:var(--c-bg)}
            .hub-pill{background:rgba(255,255,255,.16);color:#fff}
            @media (prefers-reduced-motion: reduce){.hub-task,.hub-btn,.hub-solid{transition:none}}
        `;
        document.head.appendChild(st);
    }

    // ---------- Разметка ----------
    function articleCard(a) {
        const meta = a.min ? t('hub.minRead', { n: a.min }) : t('hub.guide');
        return `<a href="${esc(a.href)}" class="hub-art hub-task block bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 min-w-0">
                <span class="hub-chip inline-block text-[11px] font-bold px-2 py-0.5 rounded-md">${esc(tr(a.tag))}</span>
                <h3 class="mt-2.5 text-[15px] font-bold text-slate-900 leading-snug">${esc(a.title)}</h3>
                <p class="mt-1 text-[13px] text-slate-500 leading-relaxed">${esc(tr(a.desc))}</p>
                <p class="mt-3 text-xs text-slate-400 flex items-center gap-1.5"><i data-lucide="clock" class="w-3.5 h-3.5"></i>${esc(meta)}</p>
            </a>`;
    }

    function taskCard(x, isTrainer) {
        const icon = `<span class="hub-chip w-10 h-10 rounded-xl flex items-center justify-center shrink-0"><i data-lucide="${esc(x.icon)}" class="w-5 h-5"></i></span>`;
        const free = `<span data-free class="hidden shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-100"></span>`;
        const text = `<h3 class="text-base font-bold text-slate-900 leading-snug">${esc(x.title)}</h3>
                <p class="mt-1 text-[13px] text-slate-500 leading-relaxed">${esc(tr(x.desc))}</p>`;
        const foot = `<div class="flex items-end justify-between gap-3">
                    <div class="min-w-0 flex-1">
                        <p data-total class="text-xs font-semibold text-slate-600 tnum">${esc(t('hub.counting'))}</p>
                        ${isTrainer ? '' : `<div class="mt-2 h-1.5 rounded-full hub-track overflow-hidden"><div data-bar class="h-full hub-fill rounded-full" style="width:0%"></div></div>
                        <p data-done class="mt-1.5 text-[11px] text-slate-400 tnum">&nbsp;</p>`}
                    </div>
                    <span class="hub-btn shrink-0 inline-flex items-center gap-1 text-[13px] font-bold px-3.5 py-2 rounded-xl">${esc(t('hub.start'))}<i data-lucide="arrow-right" class="w-3.5 h-3.5"></i></span>
                </div>`;
        // Широкая карточка (третья из трёх): на телефоне — как обычная, шире — в одну строку
        if (x.wide) return `<a href="${esc(x.href)}" data-hub-type="${esc(x.id)}" class="hub-task hub-card sm:col-span-2 p-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 min-w-0">
                <div class="flex flex-col sm:flex-row sm:items-start gap-3.5 sm:gap-4 min-w-0 flex-1">
                    <div class="flex items-start justify-between gap-3">${icon}<span class="sm:hidden">${free}</span></div>
                    <div class="min-w-0"><div class="flex items-start justify-between gap-3"><div class="min-w-0">${text}</div><span class="hidden sm:inline">${free.replace('data-free', 'data-free-wide')}</span></div></div>
                </div>
                <div class="sm:w-60 shrink-0">${foot}</div>
            </a>`;
        return `<a href="${esc(x.href)}" data-hub-type="${esc(x.id)}" class="hub-task hub-card p-5 flex flex-col min-w-0">
                <div class="flex items-start justify-between gap-3">${icon}${free}</div>
                <div class="mt-3.5">${text}</div>
                <div class="mt-auto pt-4">${foot}</div>
            </a>`;
    }

    function mockBanner(h) {
        return `<section class="hub-mock rounded-3xl p-6 sm:p-8" aria-labelledby="hubMockTitle">
                <div class="flex flex-col md:flex-row md:items-center gap-5 md:gap-8">
                    <div class="min-w-0 flex-1">
                        <span class="hub-pill inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full"><i data-lucide="timer" class="w-3.5 h-3.5"></i>${esc(t('hub.mockTag'))}</span>
                        <h2 id="hubMockTitle" class="mt-3 text-2xl sm:text-[28px] font-extrabold tracking-tight">Mini Mock</h2>
                        <p class="mt-1.5 text-sm sm:text-[15px] text-white/85 leading-relaxed max-w-xl">${esc(tr(h.mock.desc))}</p>
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
            <header class="flex items-center gap-3.5 sm:gap-4 mb-6 sm:mb-8">
                <span class="hub-chip w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0"><i data-lucide="${h.icon}" class="w-6 h-6 sm:w-7 sm:h-7"></i></span>
                <div class="min-w-0">
                    <h1 class="text-[26px] sm:text-[32px] leading-tight font-extrabold text-slate-900 tracking-tight">${h.name}</h1>
                    <p class="text-sm text-slate-500 mt-0.5">${esc(tr(h.sub))}</p>
                </div>
            </header>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
                <div class="lg:col-span-2 space-y-8 sm:space-y-10 min-w-0">
                    <section class="hub-card p-5 sm:p-6" aria-labelledby="hubArtTitle">
                        <div class="flex items-start justify-between gap-3 mb-4">
                            <div class="min-w-0">
                                <h2 id="hubArtTitle" class="text-lg font-bold text-slate-900 tracking-tight">${esc(t('hub.articles'))}</h2>
                                <p class="text-[13px] text-slate-500 mt-0.5">${esc(tr(h.articlesSub))}</p>
                            </div>
                            <a href="${h.articlesHub}" class="hub-btn hidden sm:inline-flex shrink-0 items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl">
                                <i data-lucide="library" class="w-3.5 h-3.5"></i>${esc(t('hub.allShort'))}
                                <span data-articles-count="${h.articlesHub}" class="hidden tnum"></span>
                            </a>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">${h.articles.map(articleCard).join('')}</div>
                        <a href="${h.articlesHub}" class="hub-all hub-tint mt-3 sm:mt-4 flex items-center gap-3 sm:gap-4 rounded-2xl p-3.5 sm:p-4 group">
                            <span class="hub-solid w-10 h-10 rounded-xl flex items-center justify-center shrink-0"><i data-lucide="library" class="w-5 h-5"></i></span>
                            <span class="min-w-0 flex-1">
                                <span class="flex items-center gap-2 text-sm font-bold text-slate-900">${esc(t('hub.allArticles', { name: h.name }))}
                                    <span data-articles-count="${h.articlesHub}" class="hidden hub-chip text-[11px] font-bold px-1.5 py-0.5 rounded-md tnum"></span></span>
                                <span class="block text-xs text-slate-500 mt-0.5">${esc(tr(h.allArticlesSub))}</span>
                            </span>
                            <i data-lucide="chevron-right" class="w-5 h-5 hub-ink shrink-0 transition-transform group-hover:translate-x-0.5"></i>
                        </a>
                    </section>

                    <section aria-labelledby="hubPracticeTitle">
                        <h2 id="hubPracticeTitle" class="text-lg font-bold text-slate-900 tracking-tight">${esc(t('hub.practice'))}</h2>
                        <p class="text-[13px] text-slate-500 mt-0.5 mb-4">${esc(t('hub.practiceSub'))}</p>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">${h.types.map(x => taskCard(x, false)).join('')}</div>
                    </section>

                    ${mockBanner(h)}

                    ${h.trainers.length ? `<section aria-labelledby="hubTrainTitle">
                        <h2 id="hubTrainTitle" class="text-lg font-bold text-slate-900 tracking-tight">${esc(t('hub.trainers'))}</h2>
                        <p class="text-[13px] text-slate-500 mt-0.5 mb-4">${esc(t('hub.trainersSub'))}</p>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">${h.trainers.map(x => taskCard(x, true)).join('')}</div>
                    </section>` : ''}
                </div>

                <aside class="space-y-6 min-w-0 lg:sticky lg:top-6">
                    <section class="hub-tint rounded-3xl p-5 sm:p-6" aria-labelledby="hubGoalTitle">
                        <div class="flex items-center justify-between gap-3">
                            <h2 id="hubGoalTitle" class="text-sm font-bold hub-ink flex items-center gap-1.5"><i data-lucide="target" class="w-4 h-4"></i>${esc(t('hub.goal'))}</h2>
                            <span id="hubGoalNum" class="text-sm font-extrabold hub-ink tnum">— / ${h.goal}</span>
                        </div>
                        <div class="mt-3 h-2 rounded-full bg-white overflow-hidden"><div id="hubGoalBar" class="h-full rounded-full hub-solid" style="width:0%;transition:width .6s ease"></div></div>
                        <p id="hubGoalText" class="mt-3 text-[13px] text-slate-600 leading-relaxed">${esc(t('hub.goalText', { n: h.goal, name: h.name }))}</p>
                    </section>
                    <section class="hub-card p-5 sm:p-6" aria-labelledby="hubResTitle">
                        <h2 id="hubResTitle" class="text-base font-bold text-slate-900">${esc(t('hub.results'))}</h2>
                        <div id="hubResults" class="mt-4 space-y-5"><p class="text-[13px] text-slate-400">${esc(t('hub.counting'))}</p></div>
                    </section>
                </aside>
            </div>`;
        icons();
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
    function accuracyOf(rows) {
        let e = 0, tt = 0;
        const cats = {};
        rows.forEach(r => {
            e += Number(r.score_earned) || 0; tt += Number(r.score_total) || 0;
            const st = parseStats(r.category_stats);
            if (st) Object.entries(st).forEach(([name, v]) => {
                const k = normCategory(name);
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
            res.blocks.push(accuracyBlock(accuracyOf(r)));
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
    const bar = (pct, max) => `<div class="mt-1.5 h-1.5 rounded-full hub-track overflow-hidden"><div class="h-full hub-fill rounded-full" style="width:${Math.max(0, Math.min(100, max ? pct / max * 100 : pct))}%"></div></div>`;
    const sub = (title, note) => `<div class="min-w-0"><p class="text-xs font-bold text-slate-800">${esc(title)}</p>${note ? `<p class="text-[11px] text-slate-400 mt-0.5">${esc(note)}</p>` : ''}</div>`;

    function accuracyBlock(a) {
        if (a.pct === null && !a.cats.length) return '';
        let html = '';
        if (a.pct !== null) html += `<div>
                <div class="flex items-baseline justify-between gap-3">${sub(t('hub.accuracy'), t('hub.accuracyNote'))}<span class="text-xl font-extrabold hub-ink tnum">${a.pct}%</span></div>
                ${bar(a.pct)}</div>`;
        if (a.cats.length) html += `<div>${sub(t('hub.byQType'), a.cats.length > 1 ? t('hub.qTypeNote') : '')}
                <div class="mt-2.5 space-y-2.5">${a.cats.slice(0, 8).map(c => `<div>
                    <div class="flex items-center justify-between gap-3 text-xs"><span class="text-slate-600 min-w-0 truncate">${esc(c.name)}</span><span class="font-bold text-slate-800 tnum">${c.pct}%</span></div>
                    ${bar(c.pct)}</div>`).join('')}</div></div>`;
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
        const row = (label, val) => `<div class="flex items-center justify-between gap-3 py-2 border-b border-gray-100 last:border-0 text-[13px]"><span class="text-slate-600 min-w-0">${esc(label)}</span><span class="font-bold text-slate-900 tnum shrink-0">${esc(val)}</span></div>`;
        let html = `<div>${row(t('hub.w.sentence'), sT ? Math.round(sE / sT * 100) + '%' : '—')}
            ${row(t('hub.w.email'), email.length ? f1(avg(email)) + ' / 6' : '—')}
            ${row(t('hub.w.academic'), acad.length ? f1(avg(acad)) + ' / 6' : '—')}
            ${row(t('hub.w.reviewed'), lists.length ? t('hub.w.of', { a: reviewed, b: lists.length }) : '—')}</div>`;
        // По критериям: у каждого эссе — последняя попытка с оценками
        const sum = {}, n = {};
        let k = 0;
        lists.forEach(list => {
            const r = [...list].reverse().find(x => CRITERIA.some(c => critVal(x, c.key) !== null));
            if (!r) return;
            k++;
            CRITERIA.forEach(c => { const v = critVal(r, c.key); if (v !== null) { sum[c.key] = (sum[c.key] || 0) + v; n[c.key] = (n[c.key] || 0) + 1; } });
        });
        if (k) html += `<div>${sub(t('hub.w.criteria'), t('hub.w.critNote', { n: k }))}<div class="mt-2.5 space-y-2.5">${CRITERIA.map(c => {
            const a = n[c.key] ? sum[c.key] / n[c.key] : null;
            return `<div><div class="flex items-center justify-between gap-3 text-xs"><span class="text-slate-600">${esc(t(c.label))}</span><span class="font-bold text-slate-800 tnum">${f1(a)}</span></div>${bar(a || 0, 6)}</div>`;
        }).join('')}</div></div>`;
        return html;
    }

    function speakingBlock(real) {
        if (!real.length) return '';
        const scores = real.map(a => num(a.score)).filter(v => v !== null);
        if (!scores.length) return `<p class="text-[13px] text-slate-500 leading-relaxed">${esc(t('hub.s.pending'))}</p>`;
        const a = scores.reduce((x, y) => x + y, 0) / scores.length;
        return `<div><div class="flex items-baseline justify-between gap-3">${sub(t('hub.s.score'), t('hub.s.scoreNote', { n: scores.length }))}<span class="text-xl font-extrabold hub-ink tnum">${(Math.round(a * 10) / 10).toFixed(1)}</span></div>${bar(a, 6)}</div>`;
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
        document.getElementById('hubGoalNum').textContent = `${n} / ${h.goal}`;
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
            return `<div><div class="flex items-center justify-between gap-3 text-xs"><span class="text-slate-600 min-w-0 truncate">${esc(x.title)}</span><span class="font-bold text-slate-800 tnum shrink-0">${d} / ${info.total}</span></div>${bar(info.total ? d / info.total * 100 : 0)}</div>`;
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
        icons();
    }

    // для проверки на стенде
    window.SectionHub = { HUBS, THEME };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();
})();
