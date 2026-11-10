// =====================================================================
// i18n-pages.js — перевод страниц учениц вокруг заданий (RU / EN).
//
// Подключается сам из auth.js на страницах учениц. Ищет на странице
// надписи интерфейса из словаря ниже и меняет их на язык, выбранный
// в меню (EN / RU). Страница может дорисовать карточки позже — новые
// надписи тоже переводятся (MutationObserver).
//
// Что НЕ переводится (правило из i18n.js): сам экзамен — экраны заданий,
// кнопки Next / Back / Review, инструкции внутри задания, названия типов
// заданий (Complete the Words, Choose a Response…), названия тестов из базы.
// Поэтому в словаре только надписи вокруг: заголовки, кнопки списков,
// статусы, результаты, пустые списки, ошибки.
//
// Как добавить надпись: строка [английский, русский] в PHRASES (текст —
// точно как на странице, лишние пробелы не важны). Работает в обе стороны:
// на английском интерфейсе русская надпись станет английской.
// Надпись, которая на странице написана по-русски: [русский, английский, 'ru'].
// Слово, которое встречается и внутри экзамена (Ready, Practice), —
// в PAGE_PHRASES только для своей страницы. Метки тем карточек — в TOPICS.
// Не переводить кусок страницы: атрибут data-i18n-skip на контейнере.
// =====================================================================
(function () {
    'use strict';
    if (window.__i18nPages) return;
    window.__i18nPages = true;

    // Свои словари у главной и входа (i18n.js), страницы преподавателя — на русском
    const file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const SKIP_PAGES = ['index.html', 'login.html', 'guest.html', 'teacher-board.html', 'student-profile.html', 'content-lab.html',
        'exam-reports.html', 'listening-import.html', 'speaking-import.html', 'vocabulary.html', 'review.html',
        // сами экзамены — без перевода
        'speaking_player.html', 'speaking_mini_mock_player.html', 'mini-mock-writing.html'];
    if (SKIP_PAGES.includes(file) || /^ge-/.test(file)) return;

    function detect() {
        try { const s = localStorage.getItem('appLang'); if (s === 'en' || s === 'ru') return s; } catch (e) { /* по браузеру */ }
        const list = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'en'];
        for (const l of list) {
            const x = String(l || '').toLowerCase();
            if (/^(ru|be|uk|kk)\b/.test(x)) return 'ru';
            if (/^en\b/.test(x)) return 'en';
        }
        return 'en';
    }
    const lang = (window.I18N && window.I18N.lang) || detect();

    // Русские формы числа: plural(5, ['вопрос', 'вопроса', 'вопросов'])
    function plural(n, f) {
        const a = Math.abs(n) % 100, b = a % 10;
        if (a > 10 && a < 20) return f[2];
        if (b === 1) return f[0];
        if (b >= 2 && b <= 4) return f[1];
        return f[2];
    }
    const W = {
        q: ['вопрос', 'вопроса', 'вопросов'], word: ['слово', 'слова', 'слов'], gap: ['пропуск', 'пропуска', 'пропусков'],
        text: ['текст', 'текста', 'текстов'], art: ['статья', 'статьи', 'статей'], lvl: ['уровень', 'уровня', 'уровней'],
        essay: ['проверенное эссе', 'проверенных эссе', 'проверенных эссе']
    };
    const n_ = (n, k) => n + ' ' + plural(Number(n), W[k]);

    // ---------- Точные фразы: [английский, русский] ----------
    const PHRASES = [
        // Общие
        ['All', 'Все'], ['Start Test', 'Начать тест'], ['Start', 'Начать'], ['Start Practice', 'Начать практику'],
        ['Completed', 'Пройдено'], ['Not started', 'Не начато'], ['Not Started', 'Не начато'], ['In Progress', 'В процессе'],
        ['Review Results', 'Посмотреть результаты'], ['Review Answers', 'Разбор ответов'], ['View Review', 'Разбор'],
        ['Retake', 'Пройти ещё раз'], ['Try Again', 'Попробовать ещё раз'], ['Practice Again', 'Ещё раз'],
        ['Resume Test', 'Продолжить тест'], ['Rewrite', 'Переписать'], ['Reviewed', 'Проверено'], ['New', 'Новое'],
        ['Progress', 'Прогресс'], ['Score', 'Балл'], ['Raw Score', 'Верных ответов'], ['Band Score', 'Балл (band)'],
        ['Est. Band', 'Примерный балл'], ['Est. Band Score', 'Примерный балл'], ['Avg. Accuracy', 'Средняя точность'],
        ['Pending Review', 'Ждёт проверки'], ['Pending teacher review', 'Ждёт проверки преподавателем'], ['Pending Teacher Review', 'Ждёт проверки преподавателем'],
        ['Waiting for review', 'Ждёт проверки'], ['Needs Review', 'Нужна проверка'], ['Latest Result', 'Последний результат'],
        ['Back to Dashboard', 'Назад к списку'], ['Back to List', 'Назад к списку'], ['Back to the list', 'Назад к списку'], ['Return to List', 'Назад к списку'],
        ['Return to Dashboard', 'Назад к списку'], ['Return to Library', 'Назад к списку'], ['Back to tests', 'Назад к тестам'], ['Back to Tasks', 'Назад к заданиям'],
        ['Back to Library', 'Назад к тестам'], ['Exit Review', 'Закрыть разбор'], ['Back to Levels', 'Назад к уровням'], ['All Levels', 'Все уровни'],
        ['Back to Reading', 'Назад в Reading'], ['Back to Listening', 'Назад в Listening'], ['Back to Speaking', 'Назад в Speaking'],
        ['← Back to Writing', '← Назад в Writing'], ['All Listening Tasks', 'Все задания Listening'],
        ['Transcript', 'Расшифровка'], ['Audio Transcript', 'Расшифровка аудио'], ['Show/Hide Transcript', 'Показать / скрыть расшифровку'],
        ['Loading...', 'Загрузка…'], ['Loading test...', 'Загружаем тест…'], ['Loading Test...', 'Загружаем тест…'], ['Loading task...', 'Загружаем задание…'],
        ['Loading test data...', 'Загружаем тест…'], ['Loading results...', 'Загружаем результаты…'], ['Loading tests from database...', 'Загружаем тесты…'],
        ['Loading academic tests...', 'Загружаем тексты…'], ['Loading test packages...', 'Загружаем наборы…'], ['Loading your tests...', 'Загружаем тесты…'],
        ['Loading Mini-Mock Sets...', 'Загружаем мини-моки…'], ['Loading exercises from database...', 'Загружаем упражнения…'],
        ['Loading exercises from Supabase...', 'Загружаем упражнения…'], ['Loading secure database...', 'Загружаем глаголы…'],
        ['Loading prompt...', 'Загружаем задание…'], ['Loading your responses...', 'Загружаем ваши ответы…'], ['Loading your review...', 'Загружаем разбор…'],
        ['Loading your interview performance...', 'Загружаем ваше интервью…'], ['Loading tests and results...', 'Загружаем тесты и результаты…'],
        ['Fetching tests...', 'Загружаем тесты…'], ['Fetching data from the server', 'Получаем данные'], ['Saving results...', 'Сохраняем результат…'],
        ['Failed to load tests. Please refresh the page.', 'Не удалось загрузить тесты. Обновите страницу.'],
        ['Failed to load tests. Please check console.', 'Не удалось загрузить тесты. Обновите страницу.'],
        ['Failed to load tests. Please check your connection and try again.', 'Не удалось загрузить тесты. Проверьте интернет и попробуйте ещё раз.'],
        ['Failed to load tasks. Check your connection and refresh the page.', 'Не удалось загрузить задания. Проверьте интернет и обновите страницу.'],
        ['Failed to load data. Check console.', 'Не удалось загрузить данные. Обновите страницу.'],
        ['Failed to load levels from database.', 'Не удалось загрузить уровни.'], ['Failed to load results', 'Не удалось загрузить результаты'],
        ['Failed to connect to database. Please check console.', 'Нет связи с базой. Обновите страницу.'],
        ['Oops, an error occurred', 'Что-то пошло не так'], ['Oops, something went wrong!', 'Что-то пошло не так'],
        ['Could not load review', 'Не удалось открыть разбор'], ['Could not load your result', 'Не удалось загрузить результат'],
        ['Page failed to load. Please refresh it.', 'Страница не загрузилась. Обновите её.'],
        ['The recording file could not be opened. Please tell your teacher.', 'Не удалось открыть запись. Сообщите преподавателю.'],
        ['Authorization required.', 'Нужно войти в аккаунт.'],
        ['@aria-label:Filter by topic', 'Фильтр по теме'], ['@aria-label:Filter by subject', 'Фильтр по предмету'], ['@aria-label:Filter by text type', 'Фильтр по типу текста'],
        ['@title:Reset results', 'Сбросить результат'], ['@title:Reset Test', 'Сбросить тест'], ['@title:Reset Score', 'Сбросить результат'],
        ['@title:Reset Entire Test', 'Сбросить весь тест'], ['@title:Exit Practice', 'Выйти из практики'],

        // Пустые списки
        ['No practice tests available yet.', 'Тестов пока нет.'], ['Tests have not been added yet.', 'Тесты пока не добавлены.'],
        ['No tasks found.', 'Заданий пока нет.'], ['No Tests Found', 'Тестов пока нет'], ['No tests found in the database.', 'Тестов пока нет.'],
        ['No practice sets found in the database.', 'Наборов пока нет.'], ['No exercises found in the database.', 'Упражнений пока нет.'],
        ['No levels available yet.', 'Уровней пока нет.'], ['No Mini-Mock Tests Available', 'Мини-моков пока нет'],
        ['There are currently no mini-mock tests available. Check back later!', 'Мини-моков пока нет. Загляните позже.'],
        ['Check back later or try practice sets in the main section.', 'Загляните позже или потренируйтесь на заданиях раздела.'],
        ['No tests available yet. Add them in Supabase!', 'Тестов пока нет.'], ['No interview tests available yet. Add them in Supabase!', 'Тестов пока нет.'],
        ['No tests available. Add some in Supabase!', 'Тестов пока нет.'], ["No tests found in 'full_tests' table.", 'Мок-тестов пока нет.'],
        ['No responses found for this attempt.', 'В этой попытке нет ответов.'], ['No responses found for this interview session.', 'В этом интервью нет ответов.'],
        ['No recording found.', 'Записи нет.'], ['No response recorded.', 'Ответа нет.'], ['No sentence building responses found.', 'Ответов Build a Sentence нет.'],

        // Reading
        ['Select a test to practice your academic spelling and context reading.', 'Выберите тест: правописание академических слов и чтение по контексту.'],
        ['Short passages from everyday situations. Select a test to practice.', 'Короткие тексты из повседневных ситуаций. Выберите тест.'],
        ['Academic Reading Passages', 'Академические тексты'],
        ['Advanced long-form texts reflecting authentic TOEFL university-level content.', 'Длинные академические тексты уровня настоящего TOEFL.'],
        ['Start Academic Practice', 'Начать'], ['Mini Mock Tests', 'Мини-моки'], ['Select a test to simulate the real exam experience.', 'Выберите тест — всё как на настоящем экзамене.'],
        ['Reading Home', 'Раздел Reading'], ['Master the Reading Section', 'Как пройти Reading'],
        ['Learn & Strategies', 'Теория и стратегии'], ['All Guides', 'Все статьи'], ['Theoretical Prep', 'Теория'], ['THEORETICAL PREP', 'ТЕОРИЯ'],
        ['Core Strategies', 'Основные стратегии'], ['Question Types', 'Типы вопросов'], ['Task Types', 'Типы заданий'], ['Read', 'Читать'], ['READ', 'ЧИТАТЬ'],
        ['Strategy', 'Стратегия'], ['Word Roots', 'Корни слов'], ['Overview', 'Обзор'],
        ['Task Type', 'Тип задания'], ['Question Type', 'Тип вопроса'], ['Template', 'Шаблон'], ['Templates', 'Шаблоны'], ['Task', 'Задание'],
        ['Grammar & Syntax', 'Грамматика и синтаксис'], ['Email Course', 'Курс по email'], ['Answer Topics', 'Темы ответов'], ['Answer Topic', 'Тема ответа'],
        ['Изучи пошаговые алгоритмы разбора каждого типа вопросов в TOEFL Reading и прокачай навыки тайм-менеджмента для высокого балла.',
            'Step-by-step methods for every TOEFL Reading question type, plus time management for a high score.', 'ru'],
        ['Master the fundamentals of skimming, scanning, and active reading to efficiently tackle passages.', 'Основы skimming, scanning и активного чтения: как быстро работать с текстом.'],
        ['Learn how to use context clues to determine the meaning of unfamiliar words.', 'Как понять значение незнакомого слова по контексту.'],
        ['How to avoid scanning traps and find the specific detail required by the question prompt.', 'Как не попасться в ловушки и найти именно ту деталь, о которой спрашивают.'],
        ['A complete guide to understanding implied meanings in academic texts without overthinking.', 'Как находить подразумеваемый смысл в академическом тексте и не додумывать лишнего.'],
        ['Using transition words and pronouns to perfectly place context sentences into paragraphs.', 'Связки и местоимения: как точно вставить предложение в абзац.'],
        ['Quickly and accurately identify what pronouns and demonstratives refer to in the text.', 'Как быстро понять, к чему относится местоимение или указательное слово.'],
        ['Identify essential information in complex sentences without getting confused by distractors.', 'Как найти главное в сложном предложении и не запутаться в отвлекающих вариантах.'],
        ['Analyze why the author includes specific words, quotes, or paragraphs in the passage.', 'Зачем автор добавил в текст слово, цитату или целый абзац.'],
        ['Strategies for questions asking you to identify and select specific sentences within the passage.', 'Стратегии для вопросов, где нужно найти и выбрать предложение в тексте.'],
        ['Techniques and context clue strategies to correctly complete words and fill vocabulary gaps.', 'Приёмы и подсказки контекста, чтобы правильно дописать слово.'],
        ['Short everyday texts — emails, notices, chats, schedules — with 2 or 3 questions each: what they test and how to read them fast.',
            'Короткие тексты из жизни — письма, объявления, чаты, расписания — по 2–3 вопроса к каждому: что проверяют и как быстро читать.'],
        // Группы статей Reading (reading-articles.html)
        ['Skills', 'Навыки'], ['Academic only', 'Только Academic'],
        ['Start here: how the Reading section works.', 'Начните отсюда: как устроена секция Reading.'],
        ['The three tasks of the Reading section.', 'Три задания секции Reading.'],
        ['Questions you meet in Read in Daily Life and Read an Academic Passage.', 'Вопросы к заданиям Read in Daily Life и Read an Academic Passage.'],
        ['Skills that help in every task.', 'Навыки, которые помогают во всех заданиях.'],
        ['Understand the structure of complex academic texts to navigate dense passages with confidence.', 'Как устроены сложные академические тексты и как уверенно в них ориентироваться.'],
        ['Decode unfamiliar academic words by recognising their roots, prefixes and suffixes.', 'Как разгадать незнакомое слово по корню, приставке и суффиксу.'],

        // Listening
        ['Listen in Daily Life', 'Повседневные диалоги'], ['Short conversations from campus situations. Select a test to practice.', 'Короткие диалоги из жизни на кампусе. Выберите тест.'],
        ['Test in Progress', 'Идёт тест'], ['Test Review', 'Разбор теста'], ['Review your answers and read the explanations.', 'Посмотрите свои ответы и пояснения.'],
        ['Listening Practice', 'Практика Listening'], ['Select a test to practice.', 'Выберите тест.'],
        ['Listen to short statements and pick the best logical answer or continuation.', 'Короткая реплика — выберите самый уместный ответ или продолжение.'],
        ['Contains 2 interactive audio responses.', 'В наборе 2 аудиовопроса.'], ['Completed. Score:', 'Пройдено. Балл:'], ['tasks.', 'заданий.'],
        ['Campus Announcements', 'Объявления на кампусе'], ['Focus on short broadcasts about campus policies, events, or changes.', 'Короткие объявления о правилах, событиях и изменениях в кампусе.'],
        ['Academic Lectures', 'Академические лекции'], ['Listen to comprehensive university lectures. Requires strong note-taking skills.', 'Полноценные университетские лекции. Пригодится умение конспектировать.'],
        ['Listening Mini Mocks', 'Мини-моки Listening'], ['Practice with full-length simulations to test your stamina.', 'Весь раздел целиком — проверьте, на сколько хватает концентрации.'],
        ['Mock Test', 'Мок-тест'], ['Audio', 'Аудио'], ['Full-length listening simulation.', 'Полная симуляция Listening.'],
        ['Listening Home', 'Раздел Listening'], ['Master the Listening Section', 'Как пройти Listening'],
        ['Изучи пошаговые алгоритмы разбора каждого типа вопросов в TOEFL Listening и прокачай навыки активного конспектирования (note-taking) для высокого балла.',
            'Step-by-step methods for every TOEFL Listening question type, plus active note-taking for a high score.', 'ru'],
        ['Как устроена секция Listening в формате 2026: четыре типа заданий, порядок, тайминг и на что реально смотрят.',
            'How the 2026 Listening section works: four task types, order, timing and what really counts.', 'ru'],
        ['Короткие реплики: как за секунды понять намерение говорящего и выбрать естественный ответ.', 'Short lines: how to catch the speaker’s intent in seconds and pick a natural reply.', 'ru'],
        ['Диалоги на кампусе: как держать в голове проблему собеседника, детали и отношение говорящих.', 'Campus dialogues: keeping track of the speaker’s problem, the details and attitudes.', 'ru'],
        ['Объявления: как быстро схватить цель сообщения и ключевые детали — время, место, условия.', 'Announcements: catching the purpose and the key details — time, place, conditions.', 'ru'],
        ['Лекции: структура изложения, конспектирование и вопросы на вывод — самая сложная часть секции.', 'Lectures: structure, note-taking and inference questions — the hardest part of the section.', 'ru'],
        ['Как за первые секунды поймать общую тему и цель записи и не спутать её с деталью.', 'How to catch the main topic and purpose in the first seconds without mixing it up with a detail.', 'ru'],
        ['Вопросы на конкретный факт: что именно прозвучало, а не что вам показалось.', 'Fact questions: what was actually said, not what you think you heard.', 'ru'],
        ['Вывод из сказанного: как достроить смысл, не додумывая лишнего.', 'Inference: how to complete the meaning without reading too much into it.', 'ru'],
        ['Зачем говорящий это сказал: назначение реплики и всего сообщения.', 'Why the speaker said it: the purpose of a line and of the whole message.', 'ru'],
        ['Отношение и уверенность говорящего: интонация, оговорки и выбор слов.', 'The speaker’s attitude and certainty: intonation, hedges and word choice.', 'ru'],
        ['Как говорящий объясняет мысль и строит рассказ: сравнение, пример, шаги, причина и следствие.', 'How the speaker explains an idea and builds the talk: comparison, example, steps, cause and effect.', 'ru'],
        // Группы статей Listening (listening-articles.html)
        ['Start here: how the Listening section works.', 'Начните отсюда: как устроена секция Listening.'],
        ['The four tasks of the Listening section.', 'Четыре задания секции Listening.'],
        ['Questions after conversations, announcements and academic talks. Listen and Choose a Response has its own format.',
            'Вопросы к диалогам, объявлениям и лекциям. У Listen and Choose a Response свой формат.'],
        ['Main Idea Questions', 'Main Idea Questions'],

        // Writing
        ['Writing Practice', 'Практика Writing'], ['Your criteria', 'Ваши критерии'], ['Communicative purpose', 'Коммуникативная задача'],
        ['Mini-Mock Tests', 'Мини-моки'], ['Select a full writing simulation to practice under exam conditions.', 'Выберите мини-мок — всё как на экзамене.'],
        ['Complete a full writing simulation consisting of 3 consecutive tasks under exam time limits.', 'Три задания подряд с таймерами как на экзамене.'],
        ['Start Simulation', 'Начать'], ['Writing Home', 'Раздел Writing'], ['Master the Writing Section', 'Как пройти Writing'],
        ['Изучи пошаговые алгоритмы, шаблоны ответов и продвинутую грамматику для получения максимального балла за эссе.',
            'Step-by-step methods, answer templates and advanced grammar for a top essay score.', 'ru'],
        ['Proven tactical structure, response analysis, and templates for the 10-minute forum discussion task.', 'Проверенная структура, разбор ответов и шаблоны для дискуссии за 10 минут.'],
        ['How the task looks, phrases for each email purpose, templates, scoring and model emails.', 'Как выглядит задание, фразы под каждую цель письма, шаблоны, оценка и образцы писем.'],
        // Группы статей Writing (writing-articles.html)
        ['The three tasks of the Writing section, in exam order.', 'Три задания секции Writing — в том порядке, в каком они идут на экзамене.'],
        ['Write an Email: Full Course', 'Write an Email: полный курс'],
        ['Rules behind the most common mistakes in emails and essays.', 'Правила, на которых чаще всего ошибаются в письмах и эссе.'],
        ['Word combinations and idioms that make your writing sound natural.', 'Сочетания слов и идиомы, с которыми текст звучит естественно.'],
        ['7 уроков с упражнениями и образцовыми письмами на реальных заданиях TOEFL', '7 lessons with exercises and model emails on real TOEFL tasks', 'ru'],
        ['Task Anatomy', 'Анатомия задания'], ['Как устроено задание и как его оценивают', 'How the task works and how it is scored', 'ru'],
        ['Audience & Tone', 'Адресат и тон'], ['Dear или Hi, регистр, благодарности, подписи', 'Dear or Hi, register, thanks and sign-offs', 'ru'],
        ['The Opening Line', 'Первая фраза'], ['Первая фраза: зачем вы пишете', 'The first line: why you are writing', 'ru'],
        ['Details', 'Детали'], ['Как развернуть каждый пункт', 'How to develop every point', 'ru'],
        ['Politeness & the Sandwich', 'Вежливость и сэндвич'], ['Жалобы и критика без наездов', 'Complaints and criticism without sounding rude', 'ru'],
        ['Closing & Final Check', 'Концовка и проверка'], ['Концовка и проверка за минуту', 'The closing and a one-minute check', 'ru'],
        ['Practice Lab', 'Практикум'], ['10 реальных заданий с образцами', '10 real tasks with model answers', 'ru'],
        ['Put the words of a reply in the right order: what the screen shows, strategies and worked examples.', 'Как собрать ответ из слов в правильном порядке: что на экране, стратегии и разобранные примеры.'],
        ['Suggest, recommend, propose + -ing or that + base verb; advise, allow, permit with and without an object.', 'Suggest, recommend, propose + -ing или that + базовая форма; advise, allow, permit с дополнением и без.'],
        ['Master the use of definite and indefinite articles for accurate and natural-sounding academic writing.', 'Артикли a/an/the: как писать точно и естественно.'],
        ['Learn essential word combinations to make your writing sound more native and achieve a higher score.', 'Устойчивые сочетания слов, с которыми текст звучит естественно.'],
        ['Natural phrases that make writing and speech sound fluent — and the ones that are too informal for the exam.', 'Фразы, с которыми речь звучит свободно, — и те, что слишком разговорные для экзамена.'],
        ['Commas, semicolons, colons, apostrophes and dashes: where each one goes in an email or essay.', 'Запятая, точка с запятой, двоеточие, апостроф и тире: где что ставить в письме и эссе.'],
        ['Which nouns never take a/an or -s, much vs many, few vs little, and how to count what can’t be counted.', 'Какие существительные не берут a/an и -s, much или many, few или little и как «посчитать» неисчисляемое.'],
        ['Interested in, good at, responsible for: fixed prepositions after adjectives, verbs and nouns, and verbs that take none.', 'Interested in, good at, responsible for: какие предлоги стоят после прилагательных, глаголов и существительных — и после каких глаголов предлога нет.'],
        ['Clear rules and common verbs that dictate whether to use an -ing form or a to-infinitive.', 'Правила и частые глаголы: когда -ing, а когда to + инфинитив.'],
        ['Perfect your use of in, on, at, and other key prepositions for accurate spatial and temporal references.', 'In, on, at и другие предлоги времени и места.'],
        ['Explain to me, not explain me: verbs that need to before a person, verbs with two objects, and spend time doing.', 'Explain to me, а не explain me: каким глаголам нужен to перед человеком, какие берут два дополнения, и spend time doing.'],
        ['Results Overview', 'Итоги'], ['Teacher Score', 'Оценка преподавателя'], ['Total Score', 'Итоговый балл'], ['Practice Completed', 'Практика завершена'],
        ['Not answered', 'Нет ответа'], ['Sample Answer', 'Образец ответа'], ['Original Context & Prompt', 'Задание и контекст'],
        ["Teacher's Corrections", 'Исправления преподавателя'], ["Teacher's Explanation", 'Пояснение преподавателя'], ["Teacher's Note", 'Комментарий преподавателя'],
        ['Simulation Results', 'Результаты мини-мока'], ['Part 1: Sentence Building', 'Часть 1: Build a Sentence'], ['Part 2: Email Writing', 'Часть 2: Email'],
        ['Part 3: Academic Discussion', 'Часть 3: Academic Discussion'], ['Your Response', 'Ваш ответ'], ["Your teacher hasn't reviewed this task yet.", 'Преподаватель ещё не проверил это задание.'],
        ["Teacher's Correction & Feedback", 'Исправления и комментарий преподавателя'], ['Correct Structure (Sample Answer)', 'Правильный вариант (образец)'],
        ['Exact Match', 'Полное совпадение'], ['Task Prompt & Instructions', 'Задание'], ['Task Prompt & Discussion', 'Задание и дискуссия'],

        // Speaking
        ['Listen to short audio clips and repeat exactly what you hear. Select a test to practice.', 'Прослушайте короткие фразы и повторите их точно. Выберите тест.'],
        ['Interview Practice', 'Практика Interview'],
        ['Simulate a live interview environment. Watch the video question and respond within 45 seconds.', 'Как настоящее интервью: смотрите видеовопрос и отвечайте за 45 секунд.'],
        ['Speaking Mini-Mock Tests', 'Мини-моки Speaking'], ['Full simulation mode with mixed question types and strict timers.', 'Полная симуляция: оба типа заданий и строгие таймеры.'],
        ['Exam Conditions', 'Как на экзамене'], ['Mixed Format Practice', 'Оба задания подряд'], ['Strict Timers', 'Строгие таймеры'], ['Combined Score', 'Общий балл'], ['Full Recording', 'Полная запись'],
        ['Каждый Mini-Mock включает в себя комбинацию заданий: сначала проверка интонации и повторение (Listen & Repeat), а затем спонтанные ответы на вопросы интервьюеров (Interview).',
            'Each Mini Mock combines both tasks: first intonation and repetition (Listen & Repeat), then spontaneous answers to the interviewer (Interview).', 'ru'],
        ['Full-length speaking simulation combining phrase repetitions and live interview prompts.', 'Полная симуляция Speaking: повтор фраз и вопросы интервью.'],
        ['Speaking Home', 'Раздел Speaking'], ['Master the Speaking Section', 'Как пройти Speaking'],
        ['Разбор обоих заданий секции и языка, который нужен для ответа: как строить высказывание, держать темп и звучать уверенно за 45 секунд.',
            'Both Speaking tasks and the language you need: how to build an answer, keep the pace and sound confident in 45 seconds.', 'ru'],
        ['Как устроена секция Speaking в формате 2026: два типа заданий, тайминг и критерии оценки.', 'How the 2026 Speaking section works: two task types, timing and scoring.', 'ru'],
        ['Семь фраз от короткой к длинной: как их оценивают — точность и понятность — и как удержать длинную фразу в памяти.', 'Seven sentences from short to long: how they are scored — accuracy and intelligibility — and how to hold a long one in memory.', 'ru'],
        ['Четыре вопроса по нарастанию за 45 секунд каждый: как строить ответ и не замолкать на середине.', 'Four questions of rising difficulty, 45 seconds each: how to build an answer and keep going.', 'ru'],
        ['Случай из жизни: что произошло и чем закончилось — прошедшие времена и детали вместо общих слов.', 'A story from your life: what happened and how it ended — past tenses and details instead of general words.', 'ru'],
        ['Планы, желания и цели: разные способы говорить о будущем — going to, present continuous, hope, plan, would like.', 'Plans, wishes and goals: different ways to talk about the future — going to, the present continuous, hope, plan, would like.', 'ru'],
        ['Что вам нравится и почему: enjoy + -ing, prefer A to B, would rather — вместо бесконечного «I like».', 'What you like and why: enjoy + -ing, prefer A to B, would rather — instead of endless “I like”.', 'ru'],
        ['Друзья, семья, соседи: их привычки и характер — третье лицо -s, usually, tend to.', 'Friends, family, roommates: their habits and character — third-person -s, usually, tend to.', 'ru'],
        ['Как занять позицию и обосновать её: связки, аргумент и уступка вместо расплывчатого ответа.', 'Taking a position and supporting it: linkers, an argument and a concession instead of a vague answer.', 'ru'],
        ['Прогнозы: будущие времена, степень уверенности и как показать, что вы рассуждаете, а не гадаете.', 'Predictions: future tenses, certainty and showing you reason rather than guess.', 'ru'],
        ['Ситуации «если бы»: второй тип условных предложений, на котором строится весь ответ.', '“What if” situations: the second conditional your whole answer is built on.', 'ru'],
        // Группы статей Speaking (speaking-articles.html)
        ['Start here: how the Speaking section works.', 'Начните отсюда: как устроена секция Speaking.'],
        ['The two tasks of the Speaking section.', 'Два задания секции Speaking.'],
        ['Interview Questions', 'Вопросы интервью'],
        ['Seven kinds of questions in Take an Interview: personal ones come first, abstract ones later.', 'Семь видов вопросов в Take an Interview: сначала личные, потом абстрактные.'],
        ['Shadowing Simulator', 'Тренажёр Shadowing'], ['Choose a difficulty level to practice your pronunciation.', 'Выберите уровень сложности для тренировки произношения.'],
        ['Advanced', 'Продвинутый'], ['Beginner', 'Начальный'], ['Intermediate', 'Средний'],
        ['Select a phrase to practice. Cards will turn green as you master them.', 'Выберите фразу. Освоенные карточки становятся зелёными.'],
        ['Listen to the target phrase', 'Прослушайте фразу'], ['Click to start speaking', 'Нажмите и говорите'], ['Your Result', 'Ваш результат'],
        ['Words Matched', 'Совпало слов'], ['Previous', 'Назад'], ['Next Audio', 'Следующая фраза'], ['You said:', 'Вы сказали:'], ['Word match analysis:', 'Совпадение слов:'],
        ['Your Practice Results', 'Ваши результаты'], ['Practice Results', 'Результаты'], ['Review your answers and compare them with the original audio.', 'Послушайте свои ответы и сравните с оригиналом.'],
        ['Interview Review', 'Разбор интервью'], ['Interview Results', 'Результаты интервью'],
        ["Analyze your performance, listen to your answers, and check the interviewer's questions.", 'Послушайте свои ответы и вопросы интервьюера.'],
        ['Interviewer Prompt', 'Вопрос интервьюера'], ['Spoken Question:', 'Вопрос:'], ['Your Answer', 'Ваш ответ'], ['Your Recording', 'Ваша запись'], ['Original Task', 'Задание'],
        ['Review your fluency, pauses, and grammatical accuracy for this answer.', 'Обратите внимание на беглость, паузы и грамматику в этом ответе.'],
        ['Listen to your pronunciation and compare it with the original transcript on the left.', 'Послушайте своё произношение и сравните с текстом слева.'],
        ['Mini-Mock Results', 'Результаты мини-мока'], ['Teacher Feedback', 'Комментарий преподавателя'],
        ['Speaking по темам', 'Speaking by topic', 'ru'], ['Говорим на темы TOEFL', 'Talking about TOEFL topics', 'ru'],
        ['В каждой теме — лексика для ответов, опоры для построения фраз и вопросы в формате Interview от простых к сложным. Таймер и запись встроены прямо в страницу.',
            'Each topic has vocabulary for your answers, phrase starters and Interview-style questions from easy to hard. The timer and recording are built into the page.', 'ru'],
        ['Режим чтения', 'Reading mode', 'ru'], ['Загрузка…', 'Loading…', 'ru'], ['перевод', 'translation', 'ru'],
        ['"Question text not provided."', '«Текст вопроса не найден.»'],

        // Мок-тесты (tests.html) — вокруг экзамена
        ['Mock Tests', 'Мок-тесты'], ['Select a full test to begin your simulation or review past results.', 'Выберите полный тест — пройдите его или посмотрите прошлые результаты.'],
        ['Full Exam Simulation', 'Полная симуляция экзамена'], ['Start Full Test', 'Пройти весь тест'], ['Start Section', 'Начать раздел'], ['All Sections', 'Все разделы'],
        ['Complete the Words, Daily Life, and Academic Passages.', 'Complete the Words, Daily Life и Academic Passage.'],
        ['Conversations, Announcements, Academic Talks, and Responses.', 'Диалоги, объявления, лекции и Choose a Response.'],
        ['Build a Sentence, Write an Email, and Academic Discussion.', 'Build a Sentence, Email и Academic Discussion.'],
        ['Listen & Repeat and Take an Interview questions.', 'Listen & Repeat и Take an Interview.'], ['Adaptive', 'Адаптивный'],
        ['Reading Section', 'Раздел Reading'], ['Listening Section', 'Раздел Listening'], ['Writing Section', 'Раздел Writing'], ['Speaking Section', 'Раздел Speaking'],
        ['Complete TOEFL Simulation', 'Полная симуляция TOEFL'], ['Start over', 'Начать заново'], ['Send now', 'Отправить сейчас'],

        // Неправильные глаголы и тренажёр предложений
        ['Grammar Reference', 'Справочник'], ['Three Verb Forms', 'Три формы глагола'], ['Bookmark verbs to create your personal study list.', 'Отмечайте глаголы флажком — получится свой список для тренировки.'],
        ['Practice Saved', 'Тренировать отмеченные'], ['SAVE', 'В СПИСОК'], ['Infinitive (V1)', 'Инфинитив (V1)'], ['Past Simple (V2)', 'Past Simple (V2)'],
        ['Past Participle (V3)', 'Past Participle (V3)'], ['Translation', 'Перевод'], ['@placeholder:Search verb...', 'Найти глагол…'],
        ['@title:Save for practice', 'Добавить в список'], ['@title:Remove from saved', 'Убрать из списка'], ['@title:Listen', 'Послушать'],
        ['Build a Sentence Trainer', 'Тренажёр Build a Sentence'], ['Grammar Mastery', 'Грамматика'], ['Interactive Trainer', 'Тренажёр'],
        ['Choose Your Practice Level', 'Выберите уровень'], ['Select a grammar level to complete step-by-step sentence assembly drills.', 'Выберите уровень — и собирайте предложения шаг за шагом.'],
        ['Context Prompt', 'Ситуация'], ['Assemble your response:', 'Соберите ответ:'], ['Drag words into the slots above', 'Перетащите слова в ячейки выше'],
        ['Check Answer', 'Проверить'], ['Next Question', 'Следующий вопрос'], ['Level Complete', 'Уровень пройден'], ['Level Finished!', 'Уровень пройден!'],
        ['Great job! You have completed all sentence building exercises in this section.', 'Отлично! Все упражнения этого уровня сделаны.'],

        // Экраны результатов в заданиях (после проверки)
        ['Test Completed!', 'Тест пройден!'], ['Task Completed', 'Задание выполнено'], ['Review Answers & Explanations', 'Разбор ответов и пояснения'],
        ['Detailed Test Review', 'Подробный разбор'], ['Correct Answer', 'Правильный ответ']
    ];

    // ---------- Только на своей странице (слово встречается и в экзамене) ----------
    const PAGE_PHRASES = {
        'choose-response-list.html': [['Ready', 'Доступно']],
        'listening-mini-mock.html': [['Ready', 'Доступно']],
        'sentence-practice.html': [['Practice', 'Практика'], ['Word order', 'Порядок слов']],
        // метки вопросов интервью: личные / абстрактные (Official Guide)
        'speaking-articles.html': [['Personal', 'Личные'], ['Abstract', 'Абстрактные']]
    };

    // ---------- Темы карточек (метки из базы) — только в списках и статьях ----------
    const TOPIC_PAGES = /^(complete-words|read-daily|read-academic|practice-view|choose-response-list|task-list|listen_repeat|interview|lessons|(reading|listening|writing|speaking)-articles)\.html$/;
    const TOPICS = [
        ['Biology', 'Биология'], ['History', 'История'], ['Science', 'Наука'], ['Education', 'Образование'], ['Campus', 'Кампус'],
        ['Campus Life', 'Жизнь в кампусе'], ['Life', 'Жизнь'], ['Work', 'Работа'], ['Grammar', 'Грамматика'], ['Vocabulary', 'Лексика'],
        ['Art', 'Искусство'], ['Arts', 'Искусство'], ['Psychology', 'Психология'], ['Sociology', 'Социология'], ['Economics', 'Экономика'],
        ['Business', 'Бизнес'], ['Technology', 'Технологии'], ['Environment', 'Экология'], ['Ecology', 'Экология'], ['Geology', 'Геология'],
        ['Astronomy', 'Астрономия'], ['Anthropology', 'Антропология'], ['Archaeology', 'Археология'], ['Literature', 'Литература'],
        ['Music', 'Музыка'], ['Health', 'Здоровье'], ['Travel', 'Путешествия'], ['Sports', 'Спорт'], ['Culture', 'Культура'],
        ['Society', 'Общество'], ['Physics', 'Физика'], ['Chemistry', 'Химия'], ['Zoology', 'Зоология'], ['Botany', 'Ботаника'],
        ['Linguistics', 'Лингвистика'], ['Architecture', 'Архитектура'], ['Agriculture', 'Сельское хозяйство'], ['Geography', 'География'],
        ['Medicine', 'Медицина'], ['Engineering', 'Инженерия'], ['Philosophy', 'Философия'], ['Politics', 'Политика'], ['Food', 'Еда'],
        ['Shopping', 'Покупки'], ['Housing', 'Жильё'], ['Transportation', 'Транспорт'], ['Family', 'Семья'], ['Hobbies', 'Хобби'],
        ['Nature', 'Природа'], ['Animals', 'Животные'], ['Media', 'Медиа'], ['Personal', 'Личное'], ['Opinion', 'Мнение'],
        ['Friends', 'Друзья'], ['Study', 'Учёба'], ['Studies', 'Учёба'], ['Career', 'Карьера'], ['Entertainment', 'Развлечения'],
        ['Communication', 'Общение'], ['Relationships', 'Отношения'], ['Money', 'Деньги'], ['Social Media', 'Соцсети']
    ];

    // ---------- Шаблоны с числами (английский → русский) ----------
    const up = (s, src) => (src === src.toUpperCase() ? s.toUpperCase() : s);
    const PATTERNS = [
        [/^(\d+) min read$/, m => `${m[1]} мин чтения`],
        [/^Test #(\d+)$/, m => `Тест №${m[1]}`],
        [/^(\d+) words • (\d+) missing letters$/, m => `${n_(m[1], 'word')} • ${n_(m[2], 'gap')}`],
        [/^(\d+) Questions • 1 answer type$/, m => `${n_(m[1], 'q')} • 1 тип ответа`],
        [/^(\d+) Questions • Advanced Level$/, m => `${n_(m[1], 'q')} • продвинутый уровень`],
        [/^(\d+) Questions?$/, m => n_(m[1], 'q')],
        [/^• (\d+) Questions? • Audio recording$/, m => `• ${n_(m[1], 'q')} • запись голоса`],
        [/^• (\d+) Questions? • 45s Response$/, m => `• ${n_(m[1], 'q')} • ответ 45 сек`],
        [/^(\d+) Passages?$/, m => n_(m[1], 'text')],
        [/^(\d+) mins?$/i, m => up(`${m[1]} мин`, m[0])],
        [/^~(\d+) min$/, m => `~${m[1]} мин`],
        [/^~(\d+)-(\d+) min$/, m => `~${m[1]}–${m[2]} мин`],
        [/^(\d+) Articles?$/i, m => up(n_(m[1], 'art'), m[0])],
        [/^Practice Set #(\d+)$/, m => `Набор №${m[1]}`],
        [/^Practice Set (\d+)$/, m => `Набор ${m[1]}`],
        [/^Set (\d+)$/i, m => up(`Набор ${m[1]}`, m[0])],
        [/^Mock #(\d+)$/, m => `Мок №${m[1]}`],
        [/^Level (\d+)$/, m => `Уровень ${m[1]}`],
        [/^(\d+) Levels?$/, m => n_(m[1], 'lvl')],
        [/^(\d+) Audio Tracks?$/, m => `${m[1]} аудио`],
        [/^Audio #(\d+)$/, m => `Аудио №${m[1]}`],
        [/^(\d+)\/(\d+) done$/, m => `сделано ${m[1]}/${m[2]}`],
        [/^(\d+)% Accuracy$/, m => `Точность ${m[1]}%`],
        // «Question N» есть и внутри экзамена — переводим только на страницах результатов
        [/^Question (\d+)$/, m => `Вопрос ${m[1]}`, /results\.html$|^mock-test-view\.html$/],
        [/^(\d+) reviewed essays? · out of 6$/, m => `${n_(m[1], 'essay')} · из 6`],
        [/^Task Type (\d+)$/, m => `Тип задания ${m[1]}`]
    ];
    // и в обратную сторону (русские надписи на английском интерфейсе)
    const PATTERNS_EN = [
        [/^Тема (\d+)$/, m => `Topic ${m[1]}`]
    ];

    // ---------- Словари в нужную сторону ----------
    const exact = new Map();   // текст → перевод
    const attrs = new Map();   // 'title:текст' → перевод
    const norm = t => String(t).replace(/\s+/g, ' ').trim();
    PHRASES.forEach(([a, b, srcLang]) => {
        // Обычная запись: [английский, русский]. С пометкой 'ru': [русский, английский] —
        // надпись на странице по-русски, её переводим только на английский.
        const isAttr = /^@[\w-]+:/.test(a);
        const name = isAttr ? a.slice(1, a.indexOf(':')) : null;
        const first = norm(isAttr ? a.slice(a.indexOf(':') + 1) : a);
        const second = norm(b);
        if (first === second) return;
        const put = (from, to) => (isAttr ? attrs.set(name + ':' + from, to) : exact.set(from, to));
        if (srcLang === 'ru') { if (lang === 'en') put(first, second); return; }
        if (lang === 'ru') put(first, second);      // английский → русский
        else if (lang === 'en') put(second, first); // если где-то осталось по-русски
    });
    // Свои слова страницы и метки тем — только английский → русский
    if (lang === 'ru') {
        (PAGE_PHRASES[file] || []).forEach(([a, b]) => exact.set(a, b));
        if (TOPIC_PAGES.test(file)) TOPICS.forEach(([a, b]) => { if (!exact.has(a)) exact.set(a, b); });
    }

    function translate(text) {
        const core = text.replace(/\s+/g, ' ').trim();
        if (!core || core.length > 400) return null;
        let out = exact.get(core);
        if (out === undefined && (lang === 'ru' || lang === 'en')) {
            for (const [re, fn, only] of (lang === 'ru' ? PATTERNS : PATTERNS_EN)) {
                if (only && !only.test(file)) continue;
                const m = core.match(re);
                if (m) { out = fn(m); break; }
            }
        }
        if (out === undefined || out === null || out === core) return null;
        const lead = text.match(/^\s*/)[0], tail = text.match(/\s*$/)[0];
        return lead + out + tail;
    }

    const SKIP_TAGS = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, INPUT: 1, SELECT: 1, OPTION: 1, CODE: 1, PRE: 1 };
    function skipped(el) {
        for (let e = el; e && e !== document.body; e = e.parentElement) {
            if (SKIP_TAGS[e.tagName] || e.isContentEditable || (e.hasAttribute && e.hasAttribute('data-i18n-skip'))) return true;
            if (e.id === 'app-sidebar') return true;   // меню переводит nav.js
        }
        return false;
    }
    function doText(node) {
        if (!node.parentElement || skipped(node.parentElement)) return;
        const t = translate(node.nodeValue);
        if (t !== null) node.nodeValue = t;
    }
    function doAttrs(el) {
        ['title', 'placeholder', 'aria-label'].forEach(a => {
            const v = el.getAttribute && el.getAttribute(a);
            if (!v) return;
            const t = attrs.get(a + ':' + v.replace(/\s+/g, ' ').trim());
            if (t && t !== v) el.setAttribute(a, t);
        });
    }
    function walk(root) {
        if (!root) return;
        if (root.nodeType === 3) { doText(root); return; }
        if (root.nodeType !== 1 || skipped(root)) return;
        doAttrs(root);
        const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
        let n;
        while ((n = tw.nextNode())) {
            if (n.nodeType === 3) doText(n);
            else if (attrs.size) doAttrs(n);
        }
    }

    function start() {
        if (!exact.size && !attrs.size && lang !== 'ru' && lang !== 'en') return;
        walk(document.body);
        let queue = [], scheduled = false;
        const flush = () => { scheduled = false; const q = queue; queue = []; q.forEach(walk); };
        new MutationObserver(list => {
            list.forEach(m => {
                if (m.type === 'childList') m.addedNodes.forEach(n => queue.push(n));
                else if (m.type === 'characterData') queue.push(m.target);
                else if (m.type === 'attributes') queue.push(m.target);
            });
            if (!scheduled && queue.length) { scheduled = true; Promise.resolve().then(flush); }
        }).observe(document.body, { childList: true, characterData: true, subtree: true, attributes: true, attributeFilter: ['title', 'placeholder', 'aria-label'] });
        try { document.documentElement.lang = lang; } catch (e) { /* без атрибута */ }
    }

    window.I18NPages = { lang, translate };
    if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
