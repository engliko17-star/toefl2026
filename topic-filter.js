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

        function counts() {
            const c = {};
            cards.forEach(card => { c[card.topic] = (c[card.topic] || 0) + 1; });
            return c;
        }

        function hideBar() {
            if (!bar) return;
            bar.innerHTML = '';
            bar.classList.add('hidden');
            bar.classList.remove('flex');
        }

        function renderBar() {
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
            bar.innerHTML = chip('all', 'All', cards.length)
                + topics.map(t => chip(t, t === NONE ? 'Other' : label(t), c[t])).join('');
            bar.classList.remove('hidden');
            bar.classList.add('flex');
        }

        function renderList() {
            const shown = active === 'all' ? cards : cards.filter(card => card.topic === active);
            list.innerHTML = shown.map(card => card.html).join('') + tail;
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
                cards = (newCards || []).map(card => ({ topic: clean(card.topic), html: card.html }));
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
