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
    }
];
