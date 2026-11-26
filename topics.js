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
    },
    {
        slug: 'tech',
        file: 'topic-tech.html',
        title_en: 'Technology & Social Media',
        title_ru: 'Технологии и соцсети',
        category: 'society',
        description: 'Телефон и экранное время, соцсети, общение онлайн и недопонимание, видеозвонки, ИИ, приватность и цифровое неравенство.',
        cover_icon: 'smartphone',
        order_num: 9,
        frames: 10,
        words: 27, idioms: 9, sets: 8, questions: 87,
        guest: false
    },
    {
        slug: 'hobbies',
        file: 'topic-hobbies.html',
        title_en: 'Hobbies & Free Time',
        title_ru: 'Хобби и свободное время',
        category: 'culture',
        description: 'Хобби и досуг, одному или в компании, дома или на улице, хобби и счастье, сад и растения, питомцы, хобби и деньги.',
        cover_icon: 'guitar',
        order_num: 10,
        frames: 10,
        words: 27, idioms: 9, sets: 6, questions: 74,
        guest: false
    },
    {
        slug: 'arts',
        file: 'topic-arts.html',
        title_en: 'Art & Music',
        title_ru: 'Искусство и музыка',
        category: 'culture',
        description: 'Любимая музыка, концерты и стриминг, песни и воспоминания, творчество, искусство в школе, музеи и современное искусство.',
        cover_icon: 'palette',
        order_num: 11,
        frames: 10,
        words: 27, idioms: 9, sets: 5, questions: 64,
        guest: false
    },
    {
        slug: 'holidays',
        file: 'topic-holidays.html',
        title_en: 'Holidays, Traditions & Volunteering',
        title_ru: 'Праздники, традиции и волонтёрство',
        category: 'culture',
        description: 'Любимые праздники и семейные традиции, фестивали и разнообразие культур, волонтёрство, благотворительность и жизнь сообщества.',
        cover_icon: 'gift',
        order_num: 12,
        frames: 10,
        words: 27, idioms: 9, sets: 6, questions: 67,
        guest: false
    },
    {
        slug: 'nature',
        file: 'topic-nature.html',
        title_en: 'Nature & Ecology',
        title_ru: 'Природа и экология',
        category: 'society',
        description: 'Природа и отдых на улице, городские парки, погода и настроение, экопривычки и переработка, изменение климата и кто должен действовать.',
        cover_icon: 'leaf',
        order_num: 13,
        frames: 10,
        words: 27, idioms: 9, sets: 6, questions: 68,
        guest: false
    },
    {
        slug: 'books',
        file: 'topic-books.html',
        title_en: 'Books & Film',
        title_ru: 'Книги и кино',
        category: 'culture',
        description: 'Что читаешь и смотришь, бумага, e-books и аудиокниги, классика, кинотеатр или стриминг, сериалы запоем и сила историй.',
        cover_icon: 'book-open',
        order_num: 14,
        frames: 10,
        words: 27, idioms: 9, sets: 5, questions: 55,
        guest: false
    },
    {
        slug: 'friends',
        file: 'topic-friends.html',
        title_en: 'Friends, Family & Gatherings',
        title_ru: 'Друзья, семья и встречи',
        category: 'personal',
        description: 'Много друзей или мало, что делает дружбу крепкой, вечеринки и нетворкинг, семья и её ценности, дружба онлайн, ссоры и примирения.',
        cover_icon: 'users',
        order_num: 15,
        frames: 10,
        words: 27, idioms: 9, sets: 3, questions: 47,
        guest: false
    },
    {
        slug: 'city',
        file: 'topic-city.html',
        title_en: 'City & Transport',
        title_ru: 'Город и транспорт',
        category: 'society',
        description: 'Жизнь в городе и за городом, дорога на учёбу и работу, общественный транспорт и велосипеды, жильё, безопасность на улицах и город будущего.',
        cover_icon: 'bus',
        order_num: 16,
        frames: 10,
        words: 27, idioms: 9, sets: 8, questions: 71,
        guest: false
    },
    {
        slug: 'education',
        file: 'topic-education.html',
        title_en: 'Education & Learning',
        title_ru: 'Образование и обучение',
        category: 'work_study',
        description: 'Школьные годы, выбор вуза и студенческая жизнь, как мы учимся, онлайн-обучение, оценки и давление, система образования и учёба всю жизнь.',
        cover_icon: 'graduation-cap',
        order_num: 17,
        frames: 10,
        words: 27, idioms: 9, sets: 11, questions: 106,
        guest: false
    },
    {
        slug: 'travel',
        file: 'topic-travel.html',
        title_en: 'Travel & Tourism',
        title_ru: 'Путешествия',
        category: 'culture',
        description: 'Последняя поездка и идеальный отпуск, план или спонтанность, путешествия в одиночку, культурные различия, экотуризм и толпы туристов.',
        cover_icon: 'plane',
        order_num: 18,
        frames: 10,
        words: 27, idioms: 9, sets: 6, questions: 61,
        guest: false
    }
];
