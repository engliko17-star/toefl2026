// =============================================================
// ТЕМЫ SPEAKING TOPICS В НОВОМ ФОРМАТЕ (отдельные страницы topic-*.html)
//
// Новая тема = файл topic-<slug>.html + одна запись здесь.
// lessons.html показывает только темы из этого списка (Supabase для тем не используется).
//
// Поля:
//   slug        — тот же, что LESSON.slug внутри страницы (по нему читается прогресс)
//   file        — имя файла страницы
//   title_en / title_ru / description — текст карточки
//   category    — personal | society | work_study (как у старых тем)
//   cover_icon  — имя иконки Lucide
//   order_num   — место в списке
//   frames      — сколько шагов в уроке (для полоски прогресса на карточке)
//   guest       — true: тема открыта в бесплатной версии; false: под замком
// =============================================================
var TOPICS = [
    {
        slug: 'budget',
        file: 'topic-budget.html',
        title_en: 'Budget & Money',
        title_ru: 'Бюджет и деньги',
        category: 'personal',      // personal | society | work_study
        description: 'Бюджет, траты, сбережения и деньги студента: лексика, идиомы, реальные сеты TOEFL и Speaking Club на 80 вопросов.',
        cover_icon: 'wallet',
        order_num: 2,
        frames: 10,
        guest: true
    },
    {
        slug: 'shopping',
        file: 'topic-shopping.html',
        title_en: 'Shopping & Fashion',
        title_ru: 'Шопинг и мода',
        category: 'personal',      // personal | society | work_study
        description: 'Онлайн или в магазине, отзывы и бренды, реклама, личный стиль и быстрая мода: лексика, идиомы, все сеты TOEFL по теме и Speaking Club.',
        cover_icon: 'shopping-bag',
        order_num: 3,
        frames: 10,
        guest: false
    },
    {
        slug: 'work',
        file: 'topic-work.html',
        title_en: 'Work & Career',
        title_ru: 'Работа и карьера',
        category: 'work_study',
        description: 'Работа и подработки, выбор профессии, коллеги и начальники, баланс, удалёнка, ИИ и своё дело: лексика, идиомы, 8 сетов и Speaking Club на 98 вопросов.',
        cover_icon: 'briefcase',
        order_num: 4,
        frames: 10,
        guest: false
    },
    {
        slug: 'time',
        file: 'topic-time.html',
        title_en: 'Time, Goals & Organization',
        title_ru: 'Время, цели и организованность',
        category: 'personal',
        description: 'Распорядок дня, планирование, прокрастинация, фокус, цели и мотивация: лексика, идиомы, 7 сетов и Speaking Club на 91 вопрос.',
        cover_icon: 'alarm-clock',
        order_num: 5,
        frames: 10,
        guest: false
    }
];
