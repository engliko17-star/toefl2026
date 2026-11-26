// =====================================================================
// reading-module.js — отметка «из какого модуля» для заданий Reading.
//
// Колонка module в таблицах complete_words_tasks, daily_life_tasks и
// academic_tasks. Значения:
//   module_1       — как первый модуль экзамена (router, средняя сложность)
//   module_2_hard  — как сложный (upper) второй модуль
//   module_2_easy  — как лёгкий (lower) второй модуль
// Пусто — у задания нет отметки, плашки нет.
//
// Используется на страницах списков (плашка на карточке + фильтр в
// topic-filter.js) и на страницах заданий (плашка рядом с названием):
//   ReadingModule.badge(test.module)          → html плашки или ''
//   ReadingModule.place(titleElement, module) → дописывает плашку к заголовку
// Если файл не загрузился, страницы работают как раньше, просто без плашек.
// =====================================================================
(function () {
    'use strict';

    const MODULES = {
        module_1: {
            label: 'Module 1',
            hint: 'Like Module 1 of the real test: medium difficulty, everyone gets it',
            cls: 'bg-sky-50 text-sky-700 border-sky-200',
            dot: 'bg-sky-500'
        },
        module_2_hard: {
            label: 'Module 2 · Hard',
            hint: 'Like the harder (upper) Module 2 of the real test',
            cls: 'bg-rose-50 text-rose-700 border-rose-200',
            dot: 'bg-rose-500'
        },
        module_2_easy: {
            label: 'Module 2 · Easy',
            hint: 'Like the easier (lower) Module 2 of the real test',
            cls: 'bg-amber-50 text-amber-700 border-amber-200',
            dot: 'bg-amber-500'
        }
    };
    const ORDER = Object.keys(MODULES);

    // На случай, если в базе написали по-другому: «Module 1», «m2_hard», «module 2 easy»…
    const ALIASES = {
        m1: 'module_1', module1: 'module_1', '1': 'module_1',
        m2_hard: 'module_2_hard', module2_hard: 'module_2_hard', module_2_upper: 'module_2_hard', m2_upper: 'module_2_hard',
        m2_easy: 'module_2_easy', module2_easy: 'module_2_easy', module_2_lower: 'module_2_easy', m2_lower: 'module_2_easy'
    };

    function norm(value) {
        const t = String(value === null || value === undefined ? '' : value).toLowerCase().trim().replace(/[\s-]+/g, '_');
        if (MODULES[t]) return t;
        return ALIASES[t] || '';
    }

    function esc(s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function label(value) {
        const m = MODULES[norm(value)];
        return m ? m.label : '';
    }

    // Маленькая плашка: точка цвета модуля + название
    function badge(value, extraClass) {
        const key = norm(value);
        if (!key) return '';
        const m = MODULES[key];
        return `<span class="rm-badge inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border whitespace-nowrap align-middle ${m.cls} ${extraClass || ''}" title="${esc(m.hint)}" data-module="${key}"><span class="w-1.5 h-1.5 rounded-full ${m.dot}"></span>${esc(m.label)}</span>`;
    }

    // Для страницы задания: плашка перед названием. Перед, а не после, потому что
    // длинное название в шапке обрезается многоточием — плашка не должна пропасть.
    function place(titleEl, value) {
        if (!titleEl) return;
        titleEl.querySelectorAll('.rm-badge').forEach(b => b.remove());
        const html = badge(value, 'mr-2 -translate-y-px');
        if (html) titleEl.insertAdjacentHTML('afterbegin', html);
    }

    window.ReadingModule = { MODULES, ORDER, norm, label, badge, place };
})();
