// =====================================================================
// topic-filter.js — кнопки-фильтры над списком заданий (Reading).
//
// Страница сама собирает ВСЕ карточки в массив { topic, html } — в обычном
// порядке, с уже посчитанными номерами «Test #N». Модуль рисует над списком
// кнопки «All / тема 1 / тема 2 …» со счётчиками и показывает только карточки
// выбранной темы. Номера при этом не меняются: они уже внутри html.
//
//   const tf = TopicFilter.create({
//       bar:  document.getElementById('topicFilter'),   // куда рисовать кнопки
//       list: document.getElementById('testList'),      // куда рисовать карточки
//       storageKey: 'readingTopic:daily',               // выбор запоминается
//       order: ['email', 'chat', ...],                  // порядок известных тем
//       label: value => 'Email',                        // подпись кнопки
//       afterRender: () => lucide.createIcons()
//   });
//   tf.setCards(cards, { enabled: true, tail: '<div>…</div>' });
//
// Задания без темы попадают в кнопку «Other» (значение TopicFilter.NONE).
// Если ни у одного задания нет темы — кнопок нет, показан весь список.
//
// Второй ряд кнопок — по модулю (колонка module, см. reading-module.js).
// Включается опцией modules: ReadingModule и полем module у карточек:
//   TopicFilter.create({ ..., modules: window.ReadingModule });
//   tf.setCards([{ topic, module, html }, …]);
// Ряд появляется сам над кнопками тем, только если хотя бы у одного
// задания модуль заполнен. Оба фильтра работают вместе.
//
// В том же ряду — кнопка «Marked»: только задания, которые ученик отметил
// закладкой (task-marks.js). Включается опцией marks: window.TaskMarks и полем
// markKey у карточек ('daily:12'). Кнопка видна, когда есть хоть одна закладка.
// Если этот файл не загрузился, страница показывает весь список, как раньше.
// =====================================================================
(function () {
    'use strict';

    const NONE = '__other__';

    function esc(s) {
        return String(s === null || s === undefined ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function readSaved(key) {
        try { return (key && localStorage.getItem(key)) || 'all'; } catch (e) { return 'all'; }
    }
    function save(key, value) {
        try { if (key) localStorage.setItem(key, value); } catch (e) { /* без запоминания */ }
    }

    // Текст темы из базы: пробелы по краям не считаются, пусто — «без темы»
    function clean(value) {
        const t = String(value === null || value === undefined ? '' : value).trim();
        return t || NONE;
    }

    function create(opts) {
        const bar = opts.bar;
        const list = opts.list;
        const order = opts.order || [];
        const label = typeof opts.label === 'function' ? opts.label : (v => v);
        let cards = [];
        let tail = '';
        let enabled = false;
        let active = readSaved(opts.storageKey);

        // ----- Фильтр по модулю и по закладкам -----
        const MOD = opts.modules && typeof opts.modules.norm === 'function' ? opts.modules : null;
        const MARKS = opts.marks && typeof opts.marks.hasKey === 'function' ? opts.marks : null;
        const modKey = opts.storageKey ? opts.storageKey + ':module' : '';
        let modActive = MOD ? readSaved(modKey) : 'all';
        let markActive = false;
        let modBar = null;
        if ((MOD || MARKS) && bar && bar.parentNode) {
            modBar = document.createElement('div');
            modBar.className = 'hidden flex-wrap items-center gap-2 mb-3';
            modBar.setAttribute('role', 'group');
            modBar.setAttribute('aria-label', 'Filter by module');
            bar.parentNode.insertBefore(modBar, bar);
            modBar.addEventListener('click', e => {
                if (e.target.closest('.marks-chip')) {
                    markActive = !markActive;
                    renderBar();
                    renderList();
                    return;
                }
                const btn = e.target.closest('.module-chip');
                if (!btn) return;
                modActive = btn.getAttribute('data-module') || 'all';
                save(modKey, modActive);
                renderBar();
                renderList();
            });
        }
        const NO_MODULE = '__none__';
        const isMarked = card => !!(MARKS && card.markKey && MARKS.hasKey(card.markKey));
        const inMarks = card => !markActive || isMarked(card);
        const inModule = card => inMarks(card) && (modActive === 'all' || card.module === modActive);
        if (MARKS && typeof MARKS.onChange === 'function') {
            MARKS.onChange(() => {
                if (!cards.length) return;
                const wasActive = markActive;
                renderBar();
                if (wasActive) renderList();   // снятая закладка убирает карточку из «Marked»
            });
        }

        function renderModuleBar() {
            if (!modBar) return;
            const marked = MARKS ? cards.filter(isMarked).length : 0;
            if (!marked) markActive = false;
            const pool = cards.filter(inMarks);
            const c = {};
            pool.forEach(card => { c[card.module] = (c[card.module] || 0) + 1; });
            const keys = MOD ? MOD.ORDER.filter(k => cards.some(card => card.module === k)) : [];
            if (!enabled || (!keys.length && !marked)) {
                modActive = 'all';
                modBar.innerHTML = '';
                modBar.classList.add('hidden');
                modBar.classList.remove('flex');
                return;
            }
            if (modActive !== 'all' && !keys.includes(modActive) && !(modActive === NO_MODULE && cards.some(card => card.module === NO_MODULE))) modActive = 'all';
            const chip = (value, text, n, dot) => {
                const on = value === modActive;
                return `<button type="button" data-module="${esc(value)}" aria-pressed="${on}"
                    class="module-chip inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold border transition
                           ${on ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-white text-slate-600 border-gray-200 hover:border-slate-400 hover:text-slate-900'}">
                    ${dot ? `<span class="w-2 h-2 rounded-full ${dot}"></span>` : ''}
                    <span>${esc(text)}</span>
                    <span class="${on ? 'text-slate-300' : 'text-gray-400'} font-semibold">${n || 0}</span>
                </button>`;
            };
            const markChip = marked ? `<button type="button" aria-pressed="${markActive}"
                    class="marks-chip inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold border transition
                           ${markActive ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white text-indigo-600 border-indigo-200 hover:border-indigo-400'}">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round" class="w-3.5 h-3.5"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                    <span>Marked</span>
                    <span class="${markActive ? 'text-indigo-200' : 'text-indigo-300'} font-semibold">${marked}</span>
                </button>` : '';
            const moduleChips = keys.length
                ? '<span class="text-[11px] font-bold uppercase tracking-wider text-gray-400 mr-1' + (marked ? ' ml-2' : '') + '">Module</span>'
                    + chip('all', 'All', pool.length)
                    + keys.map(k => chip(k, MOD.MODULES[k].label, c[k], MOD.MODULES[k].dot)).join('')
                    + (cards.some(card => card.module === NO_MODULE) ? chip(NO_MODULE, 'No module', c[NO_MODULE]) : '')
                : '';
            modBar.innerHTML = markChip + moduleChips;
            modBar.classList.remove('hidden');
            modBar.classList.add('flex');
        }

        function counts() {
            const c = {};
            cards.filter(inModule).forEach(card => { c[card.topic] = (c[card.topic] || 0) + 1; });
            return c;
        }

        function hideBar() {
            if (!bar) return;
            bar.innerHTML = '';
            bar.classList.add('hidden');
            bar.classList.remove('flex');
        }

        function renderBar() {
            renderModuleBar();
            const c = counts();
            const hasTopics = enabled && cards.some(card => card.topic !== NONE);
            if (!hasTopics) {
                active = 'all';
                hideBar();
                return;
            }
            const topics = [
                ...order.filter(t => c[t]),
                ...Object.keys(c).filter(t => t !== NONE && !order.includes(t))
                    .sort((a, b) => String(label(a)).localeCompare(String(label(b)))),
                ...(c[NONE] ? [NONE] : [])
            ];
            if (active !== 'all' && !c[active]) active = 'all';

            const chip = (value, text, n) => {
                const on = value === active;
                return `<button type="button" data-topic="${esc(value)}" aria-pressed="${on}"
                    class="topic-chip inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold border transition
                           ${on ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-white text-slate-600 border-gray-200 hover:border-slate-400 hover:text-slate-900'}">
                    <span>${esc(text)}</span>
                    <span class="${on ? 'text-slate-300' : 'text-gray-400'} font-semibold">${n}</span>
                </button>`;
            };
            bar.innerHTML = chip('all', 'All', cards.filter(inModule).length)
                + topics.map(t => chip(t, t === NONE ? 'Other' : label(t), c[t])).join('');
            bar.classList.remove('hidden');
            bar.classList.add('flex');
        }

        function renderList() {
            const shown = cards.filter(card => inModule(card) && (active === 'all' || card.topic === active));
            list.innerHTML = shown.map(card => card.html).join('') + tail;
            if (MARKS && typeof MARKS.paint === 'function') MARKS.paint(list);   // закладки — по текущему состоянию
            if (typeof opts.afterRender === 'function') {
                try { opts.afterRender(); } catch (e) { console.warn('[фильтр] afterRender:', e); }
            }
        }

        function select(value) {
            active = value || 'all';
            save(opts.storageKey, active);
            renderBar();
            renderList();
        }

        if (bar) {
            bar.addEventListener('click', e => {
                const btn = e.target.closest('.topic-chip');
                if (btn && bar.contains(btn)) select(btn.getAttribute('data-topic'));
            });
        }

        return {
            setCards(newCards, o) {
                cards = (newCards || []).map(card => ({
                    topic: clean(card.topic),
                    module: MOD ? (MOD.norm(card.module) || NO_MODULE) : NO_MODULE,
                    markKey: card.markKey || '',
                    html: card.html
                }));
                enabled = !o || o.enabled !== false;
                tail = (o && o.tail) || '';
                renderBar();
                renderList();
            },
            select,
            get active() { return active; }
        };
    }

    // Предметы академических текстов — общий список для Read an Academic Passage
    // и Complete the Words (колонка topic в academic_tasks и complete_words_tasks).
    // Это порядок кнопок. Предмет, которого здесь нет, всё равно получит кнопку
    // (после этих, по алфавиту), так что новый предмет можно завести прямо в базе.
    // Темы проставляет reading_topics.sql:
    //   Biology — животные, растения, гены, эволюция, окаменелости
    //   Health & Medicine — тело человека, медицина, здоровье
    //   Earth Science — геология, погода, климат, океаны
    //   Environment & Agriculture — экология, охрана природы, загрязнение, сельское хозяйство
    //   Space — астрономия, космос
    //   Technology — технологии, инженерия, компьютеры, математика, физика, химия
    //   Psychology & Philosophy — психология, мышление, философия, логика, лингвистика
    //   Society & Economics — общество, города, экономика, бизнес
    //   History & Archaeology — история, археология, первобытные люди
    //   Arts & Literature — искусство, архитектура, музыка, театр, кино, литература
    const READING_SUBJECTS = [
        'Biology',
        'Health & Medicine',
        'Earth Science',
        'Environment & Agriculture',
        'Space',
        'Technology',
        'Psychology & Philosophy',
        'Society & Economics',
        'History & Archaeology',
        'Arts & Literature'
    ];

    // Темы наборов Speaking (колонка topic в speaking_tests, их проставляет
    // speaking_topics.sql). Это порядок кнопок; тема, которой здесь нет,
    // тоже получит кнопку — после этих, по алфавиту.
    const SPEAKING_TOPICS = {
        // Interview — о чём интервью
        interview: [
            'Education',
            'Work & Money',
            'Shopping & Fashion',
            'Food & Health',
            'Hobbies & Entertainment',
            'Technology & Media',
            'Travel & Cities',
            'People & Community',
            'Daily Life & Goals',
            'Nature & Environment'
        ],
        // Listen & Repeat — где происходит сценарий
        listen_repeat: [
            'Campus Services',
            'Library',
            'Shops & Services',
            'Museums & Public Places',
            'Nature & Animals',
            'Sports & Fitness',
            'Cooking & Crafts'
        ]
    };

    window.TopicFilter = { create, NONE, clean, esc, READING_SUBJECTS, SPEAKING_TOPICS };
})();
