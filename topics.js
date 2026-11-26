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
//   category    — personal | society | work_study | health
//   cover_icon  — имя иконки Lucide (если для темы нет своей картинки в lessons.html)
//   order_num   — место в списке
//   frames      — сколько шагов в уроке (для полоски прогресса на карточке)
//   words / idioms / sets / questions — цифры на карточке
//   guest       — true: тема открыта в бесплатной версии; false: под замком
// =============================================================
var TOPICS = [
    {
        slug: 'budget',
        file: 'topic-budget.html',
        title_en: 'Budget & Money',
        title_ru: 'Бюджет и деньги',
        category: 'personal',
        description: 'Бюджет, траты и сбережения, деньги студента, подработки и финансовая грамотность.',
        cover_icon: 'wallet',
        order_num: 2,
        frames: 10,
        words: 25, idioms: 9, sets: 7, questions: 107,
        guest: true
    },
    {
        slug: 'shopping',
        file: 'topic-shopping.html',
        title_en: 'Shopping & Fashion',
        title_ru: 'Шопинг и мода',
        category: 'personal',
        description: 'Онлайн и офлайн покупки, импульсивные траты, реклама, бренды, fast fashion и экология.',
        cover_icon: 'shopping-bag',
        order_num: 3,
        frames: 10,
        words: 27, idioms: 9, sets: 8, questions: 92,
        guest: false
    },
    {
        slug: 'work',
        file: 'topic-work.html',
        title_en: 'Work & Career',
        title_ru: 'Работа и карьера',
        category: 'work_study',
        description: 'Подработки и стажировки, выбор профессии, коллеги и начальники, баланс, удалёнка, ИИ и своё дело.',
        cover_icon: 'briefcase',
        order_num: 4,
        frames: 10,
        words: 27, idioms: 9, sets: 8, questions: 98,
        guest: false
    },
    {
        slug: 'time',
        file: 'topic-time.html',
        title_en: 'Time, Goals & Organization',
        title_ru: 'Время, цели и организованность',
        category: 'personal',
        description: 'Распорядок дня, планирование, прокрастинация и дедлайны, фокус, цели и мотивация.',
        cover_icon: 'alarm-clock',
        order_num: 5,
        frames: 10,
        words: 27, idioms: 9, sets: 7, questions: 91,
        guest: false
    },
    {
        slug: 'sport',
        file: 'topic-sport.html',
        title_en: 'Sport & Exercise',
        title_ru: 'Спорт и физическая активность',
        category: 'health',
        description: 'Любимый спорт, зал или улица, одному или в команде, мотивация, фитнес-приложения, дети и контактный спорт, большой спорт.',
        cover_icon: 'dumbbell',
        order_num: 6,
        frames: 10,
        words: 27, idioms: 9, sets: 5, questions: 72,
        guest: false
    },
    {
        slug: 'health',
        file: 'topic-health.html',
        title_en: 'Health, Sleep & Well-being',
        title_ru: 'Здоровье, сон и самочувствие',
        category: 'health',
        description: 'Сон и вечерние ритуалы, энергия, экраны, здоровые привычки, стресс и ментальное здоровье, природа и люди.',
        cover_icon: 'heart-pulse',
        order_num: 7,
        frames: 10,
        words: 27, idioms: 9, sets: 4, questions: 68,
        guest: false
    },
    {
        slug: 'food',
        file: 'topic-food.html',
        title_en: 'Food & Nutrition',
        title_ru: 'Еда и питание',
        category: 'health',
        description: 'Что ты ешь, готовить или заказать, рестораны и кухни, здоровое питание и диеты, растительное меню, еда и культура.',
        cover_icon: 'utensils',
        order_num: 8,
        frames: 10,
        words: 27, idioms: 9, sets: 7, questions: 80,
        guest: false
    }
];
