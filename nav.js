// =============================================================
// ЕДИНОЕ МЕНЮ САЙТА.
//
// Раньше меню копировалось в каждую страницу, и копии разъехались:
// где-то не хватало пунктов, где-то был другой шрифт, на тестах не было
// мобильного меню вообще. Теперь меню описано ОДИН раз — здесь.
//
// Как подключить на странице: там, где было <aside>…</aside>, поставить
//     <div id="app-sidebar"></div>
//     <script src="nav.js"></script>
// Старое мобильное меню (<nav class="md:hidden fixed bottom-0 …">) удалить —
// этот скрипт добавит его сам.
//
// Стили у меню свои (префикс app-nav), поэтому оно выглядит одинаково
// независимо от версии Tailwind на странице.
// =============================================================
(function () {

    // ---------- Язык меню ----------
    // Берётся из i18n.js, если он подключён на странице; иначе тот же выбор
    // из браузера (сохранённый в меню или язык браузера).
    const LANG = (function () {
        if (window.I18N) return window.I18N.lang;
        try { const s = localStorage.getItem('appLang'); if (s === 'en' || s === 'ru') return s; } catch (e) {}
        const list = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'en'];
        for (const l of list) { if (/^(ru|be|uk|kk)\b/i.test(l)) return 'ru'; if (/^en\b/i.test(l)) return 'en'; }
        return 'en';
    })();
    const L = (en, ru) => (LANG === 'ru' ? ru : en);
    function setLang(l) {
        if (window.I18N) { window.I18N.setLang(l); return; }
        try { localStorage.setItem('appLang', l); } catch (e) {}
        location.reload();
    }

    // ---------- ПУНКТЫ МЕНЮ. Новый пункт добавляется только здесь. ----------
    // Названия разделов TOEFL (Reading, Listening…) не переводятся — как на экзамене.
    const NAV_GROUPS = [
        { title: L('Main', 'Главное'), items: [
            { href: 'index.html',  icon: 'home',       label: L('Dashboard', 'Главная'),  short: L('Home', 'Главная') },
            { href: 'tests.html',  icon: 'file-check', label: L('Mock Tests', 'Мок-тесты'), short: L('Mocks', 'Мок-тесты') }
        ]},
        { title: L('TOEFL Sections', 'Разделы TOEFL'), items: [
            { href: 'reading.html',   icon: 'book-text',  label: 'Reading' },
            { href: 'listening.html', icon: 'headphones', label: 'Listening' },
            { href: 'writing.html',   icon: 'pen-tool',   label: 'Writing' },
            { href: 'speaking.html',  icon: 'mic',        label: 'Speaking' }
        ]},
        { title: L('Practice', 'Практика'), items: [
            { href: 'vocabulary.html',      icon: 'book-open',      label: L('Vocabulary', 'Словарь') },
            { href: 'grammar.html',         icon: 'spell-check',    label: L('Grammar', 'Грамматика') },
            { href: 'irregular-verbs.html', icon: 'repeat',         label: L('Irregular Verbs', 'Неправильные глаголы'), short: L('Verbs', 'Глаголы') },
            { href: 'lessons.html',         icon: 'message-circle', label: L('Speaking Topics', 'Темы для Speaking'), short: L('Topics', 'Темы') }
        ]}
    ];
    // Пункты преподавателя — скрыты, пока роль не подтверждена (страницы преподавателя на русском)
    const TEACHER_ITEMS = [
        { href: 'teacher-board.html', icon: 'users',  label: 'Teacher Board', id: 'teacherLinkDesktop', mid: 'teacherLinkMobile', short: 'Teacher' },
        { href: 'content-lab.html',   icon: 'flask-conical', label: 'Обкатка материала', id: 'teacherLinkLab', mid: 'teacherLinkLabMobile', short: 'Обкатка' },
        { href: 'exam-reports.html',  icon: 'calendar-check', label: 'Экзамены учениц', id: 'teacherLinkExams', mid: 'teacherLinkExamsMobile', short: 'Экзамены' }
    ];
    const TEACHER_ITEM = TEACHER_ITEMS[0];   // для совместимости со старым кодом страниц

    // Внутренние страницы подсвечивают свой раздел в меню
    const PARENT_OF = {
        'read-academic.html': 'reading.html', 'read-academic-task.html': 'reading.html',
        'read-daily.html': 'reading.html', 'read-daily-task.html': 'reading.html',
        'complete-words.html': 'reading.html', 'complete-words-task.html': 'reading.html',
        'take-mock-test.html': 'reading.html', 'mini-mock-test.html': 'reading.html',
        'reading-articles.html': 'reading.html',
        'practice-view.html': 'listening.html', 'choose-response-test.html': 'listening.html',
        'mock-test-view.html': 'listening.html', 'choose-response-list.html': 'listening.html',
        'listening-practice.html': 'listening.html', 'listening-mini-mock.html': 'listening.html',
        'listening-articles.html': 'listening.html', 'listening-article-view.html': 'listening.html',
        // --- статьи Listening ---
        'article-listening-main-idea.html': 'listening.html', 'article-listening-factual.html': 'listening.html', 'article-listening-inference.html': 'listening.html', 'article-listening-purpose.html': 'listening.html', 'article-listening-attitude.html': 'listening.html', 'article-listening-method.html': 'listening.html',
        'article-general-listening.html': 'listening.html', 'article-listen-choose-a-response.html': 'listening.html', 'article-listen-to-a-conversation.html': 'listening.html', 'article-listen-announcement.html': 'listening.html', 'article-listening-academic.html': 'listening.html',
        'task-list.html': 'writing.html', 'writing-practice.html': 'writing.html',
        'mini-mock-writing.html': 'writing.html', 'mini-mock-results.html': 'writing.html',
        'mini-mock-writing-list.html': 'writing.html', 'sentence-practice.html': 'writing.html',
        'writing-articles.html': 'writing.html',
        'speaking_player.html': 'speaking.html',
        // --- статьи Speaking ---
        'article-speaking-observations.html': 'speaking.html', 'article-speaking-opinions.html': 'speaking.html', 'article-speaking-future.html': 'speaking.html', 'article-speaking-hypothetical.html': 'speaking.html',
        'general-speaking.html': 'speaking.html', 'article-speaking-listen-repeat.html': 'speaking.html', 'article-speaking-interview.html': 'speaking.html', 'article-speaking-personal-experience.html': 'speaking.html', 'article-speaking-plans-goals.html': 'speaking.html', 'article-speaking-preferences.html': 'speaking.html', 'speaking-articles.html': 'speaking.html', 'speaking_results.html': 'speaking.html',
        'interview.html': 'speaking.html', 'interview_results.html': 'speaking.html',
        'listen_repeat.html': 'speaking.html', 'listen-repeat-practice.html': 'speaking.html',
        'speaking_mini_mock.html': 'speaking.html', 'speaking_mini_mock_player.html': 'speaking.html',
        'speaking_mini_mock_results.html': 'speaking.html',
        'review.html': 'vocabulary.html',
        'lesson-unit.html': 'lessons.html',
        'student-profile.html': 'teacher-board.html', 'mock-lab.html': 'content-lab.html',

        // Статьи обеих секций начинаются на article-, поэтому по префиксу их
        // не различить — каждая вписана явно. Новую статью добавлять сюда.
        // --- статьи Reading ---
        'general-reading.html': 'reading.html', 'article-greek-latin.html': 'reading.html',
        'article-academic-passage.html': 'reading.html', 'article-complete-words.html': 'reading.html',
        'article-factual.html': 'reading.html', 'article-inference.html': 'reading.html',
        'article-insert-text.html': 'reading.html', 'article-read-in-daily.html': 'reading.html',
        'article-reference.html': 'reading.html', 'article-rhetorical-purpose.html': 'reading.html',
        'article-select-sentence.html': 'reading.html', 'article-time-management.html': 'reading.html',
        'article-sentence-simplification.html': 'reading.html', 'article-vocabulary.html': 'reading.html',
        // --- статьи Writing (задания и лексика) ---
        'article-idioms.html': 'writing.html', 'article-build-a-sentence.html': 'writing.html',
        'article-collocations.html': 'writing.html',
        'article-write-an-academic.html': 'writing.html', 'article-write-an-email.html': 'writing.html',
        // --- грамматика: статьи только на странице Грамматики ---
        'article-articles.html': 'grammar.html', 'article-countable-uncountable.html': 'grammar.html',
        'article-prepositions.html': 'grammar.html', 'article-dependent-prepositions.html': 'grammar.html',
        'article-verb-government.html': 'grammar.html', 'article-verb-patterns.html': 'grammar.html',
        'article-gerund-infinitive.html': 'grammar.html', 'article-indirect-questions.html': 'grammar.html',
        'article-punctuation.html': 'grammar.html',
        // --- курс Write an Email (Writing) ---
        'article-email-anatomy.html': 'writing.html', 'article-email-tone.html': 'writing.html',
        'article-email-opening.html': 'writing.html', 'article-email-details.html': 'writing.html',
        'article-email-politeness.html': 'writing.html', 'article-email-closing.html': 'writing.html',
        'article-email-practice.html': 'writing.html'
    };

    const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    // Статья открыта со страницы, которая собирает статьи из разных разделов
    // (ссылка с ?from=grammar): в меню подсвечена эта страница, а не раздел статьи,
    // и ссылка «Назад» в статье ведёт обратно на неё.
    const FROM_PAGES = {
        grammar: { href: 'grammar.html', back: L('Back to Grammar', 'К грамматике') }
    };
    const FROM = (function () {
        try { return FROM_PAGES[(new URLSearchParams(location.search).get('from') || '').toLowerCase()] || null; } catch (e) { return null; }
    })();
    const activeHref = (FROM && FROM.href) || PARENT_OF[here] || here;
    const STORE_KEY = 'appNavCollapsed';

    // ---------- Стили меню ----------
    const css = `
    .app-nav{box-sizing:border-box;width:256px;background:#fff;border-right:1px solid #f3f4f6;
        padding:24px 16px;height:100vh;height:100dvh;position:sticky;top:0;flex-shrink:0;display:none;
        flex-direction:column;font-size:14px;line-height:1.25;transition:width .2s ease;z-index:10;
        overflow:hidden}
    @media (min-width:768px){.app-nav{display:flex}}
    .app-nav *{box-sizing:border-box}
    .app-nav-brand{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;padding:0 8px;min-height:32px}
    .app-nav-logo{font-weight:700;font-size:24px;letter-spacing:-.05em;display:flex;align-items:center;gap:8px;color:#0f172a;text-decoration:none}
    .app-nav-logo i{width:6px;height:6px;border-radius:9999px;background:#4f46e5;margin-top:8px;display:inline-block}
    .app-nav-toggle{border:0;background:transparent;color:#9ca3af;cursor:pointer;padding:6px;border-radius:8px;display:flex}
    .app-nav-toggle:hover{background:#f9fafb;color:#334155}
    .app-nav-toggle svg{width:18px;height:18px}
    .app-nav-body{flex:1;min-height:0;display:flex;flex-direction:column;overflow-y:auto;overflow-x:hidden;
        margin:0 -6px;padding:0 6px;scrollbar-width:thin;scrollbar-color:#e5e7eb transparent}
    .app-nav-foot{flex-shrink:0;margin-top:8px;padding-top:10px;border-top:1px solid #f3f4f6}
    .app-nav-group{margin-bottom:16px}
    .app-nav-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#9ca3af;padding:0 12px;margin-bottom:6px;white-space:nowrap}
    .app-nav-link{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:12px;color:#9ca3af;
        text-decoration:none;font-weight:500;font-size:14px;white-space:nowrap;transition:background .15s,color .15s;margin-bottom:2px}
    .app-nav-link:hover{background:#f9fafb;color:#334155}
    .app-nav-link svg{width:20px;height:20px;flex-shrink:0}
    .app-nav-link.is-active{background:#0f172a;color:#fff;box-shadow:0 1px 2px rgba(0,0,0,.08)}
    .app-nav-link.is-teacher{background:#eef2ff;color:#4338ca;font-weight:700;border:1px solid #c7d2fe}
    .app-nav-link.is-teacher:hover{background:#e0e7ff}
    .app-nav-link.is-teacher.is-active{background:#4338ca;color:#fff}
    .app-nav-logout{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:12px;
        color:#f43f5e;background:transparent;border:1px dashed transparent;font:inherit;font-size:14px;font-weight:500;cursor:pointer;white-space:nowrap;width:100%}
    .app-nav-logout:hover{background:rgba(255,241,242,.6);border-color:#ffe4e6}
    .app-nav-logout svg{width:20px;height:20px;flex-shrink:0}
    .app-nav-lang{margin-bottom:4px;display:flex;align-items:center;gap:10px;padding:6px 12px}
    .app-nav-lang svg{width:18px;height:18px;color:#9ca3af;flex-shrink:0}
    .app-nav-lang-seg{display:inline-flex;background:#f3f4f6;border-radius:10px;padding:3px}
    .app-nav-lang-seg button{border:0;background:transparent;font:inherit;font-size:12px;font-weight:700;color:#6b7280;
        padding:4px 10px;border-radius:8px;cursor:pointer;letter-spacing:.02em}
    .app-nav-lang-seg button:hover{color:#0f172a}
    .app-nav-lang-seg button.is-on{background:#fff;color:#0f172a;box-shadow:0 1px 2px rgba(0,0,0,.08)}
    .app-nav-lang-seg button:focus-visible,.app-nav-lang-mini:focus-visible{outline:2px solid #4f46e5;outline-offset:1px}
    .app-nav-lang-mini{display:none;border:0;background:#f3f4f6;color:#334155;font:inherit;font-size:11px;font-weight:800;
        width:36px;height:30px;border-radius:9px;cursor:pointer;margin:0 auto}
    /* Свёрнутое меню — полоса с иконками */
    .app-nav.is-collapsed{width:76px;padding:24px 12px}
    .app-nav.is-collapsed .app-nav-brand{justify-content:center;padding:0}
    .app-nav.is-collapsed .app-nav-logo{display:none}
    .app-nav.is-collapsed .app-nav-label{display:none}
    .app-nav.is-collapsed .app-nav-title{font-size:0;height:1px;background:#f3f4f6;margin:4px 8px 10px;padding:0}
    .app-nav.is-collapsed .app-nav-link,.app-nav.is-collapsed .app-nav-logout{justify-content:center;padding:12px 0}
    .app-nav.is-collapsed .app-nav-lang{justify-content:center;padding:6px 0}
    .app-nav.is-collapsed .app-nav-lang svg,.app-nav.is-collapsed .app-nav-lang-seg{display:none}
    .app-nav.is-collapsed .app-nav-lang-mini{display:block}

    /* Невысокий экран (ноутбук): пункты плотнее, чтобы всё помещалось без прокрутки */
    @media (max-height:860px){
        .app-nav{padding:18px 14px}
        .app-nav-brand{margin-bottom:14px}
        .app-nav-group{margin-bottom:10px}
        .app-nav-title{margin-bottom:4px}
        .app-nav-link,.app-nav-logout{padding:8px 12px}
        .app-nav.is-collapsed{padding:18px 12px}
        .app-nav.is-collapsed .app-nav-link,.app-nav.is-collapsed .app-nav-logout{padding:10px 0}
    }
    @media (max-height:720px){
        .app-nav{padding:14px 12px}
        .app-nav-brand{margin-bottom:10px}
        .app-nav-group{margin-bottom:6px}
        .app-nav-link,.app-nav-logout{padding:6px 12px}
        .app-nav-foot{margin-top:6px;padding-top:6px}
        .app-nav.is-collapsed{padding:14px 12px}
        .app-nav.is-collapsed .app-nav-link,.app-nav.is-collapsed .app-nav-logout{padding:8px 0}
        .app-nav.is-collapsed .app-nav-title{margin:2px 8px 6px}
    }

    /* Мобильное меню */
    .app-mnav{position:fixed;left:0;right:0;bottom:0;z-index:50;background:#fff;border-top:1px solid #f3f4f6;
        padding:8px 0 calc(8px + env(safe-area-inset-bottom));display:block}
    @media (min-width:768px){.app-mnav{display:none}}
    .app-mnav-row{display:flex;gap:4px;padding:0 12px;overflow-x:auto;scrollbar-width:none}
    .app-mnav-row::-webkit-scrollbar{display:none}
    .app-mnav-link{display:flex;flex-direction:column;align-items:center;min-width:58px;padding:4px 2px;color:#9ca3af;
        text-decoration:none;background:transparent;border:0;font:inherit;cursor:pointer;border-radius:10px}
    .app-mnav-link svg{width:20px;height:20px}
    .app-mnav-link span{font-size:9px;font-weight:700;margin-top:4px;white-space:nowrap}
    .app-mnav-link.is-active{color:#0f172a}
    .app-mnav-link.is-active svg{stroke-width:2.5}
    .app-mnav-link.is-logout{color:#fb7185}
    .app-mnav-link.is-lang b{font-size:12px;font-weight:800;line-height:20px;height:20px;color:#334155}
    /* Место под мобильное меню ДОБАВЛЯЕТСЯ к отступу страницы, а не заменяет его:
       у некоторых страниц свой большой отступ (например, под таймер урока). */
    @media (max-width:767px){ body.app-has-mnav main::after{content:'';display:block;height:calc(72px + env(safe-area-inset-bottom))} }
    /* Ссылка преподавателя скрыта для всех, кроме учителя — независимо от порядка стилей */
    .app-nav .hidden,.app-mnav .hidden{display:none !important}
    /* Страница может спрятать всё меню целиком (режим фокуса в упражнении) */
    .app-nav.hidden,.app-mnav.hidden{display:none !important}
    `;

    // ---------- Иконка вкладки ----------
    // Вшита прямо сюда: появляется на всех страницах, включая будущие,
    // и не требует отдельного файла на сервере.
    (function setFavicon() {
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
            <rect width="64" height="64" rx="14" fill="#0f172a"/>
            <text x="29" y="45" font-family="Helvetica,Arial,sans-serif" font-size="38"
                  font-weight="bold" fill="#ffffff" text-anchor="middle">T</text>
            <circle cx="50" cy="20" r="6" fill="#4f46e5"/>
        </svg>`;
        const href = 'data:image/svg+xml,' + encodeURIComponent(svg.replace(/\s+/g, ' '));

        document.querySelectorAll("link[rel~='icon']").forEach(l => l.remove());
        const link = document.createElement('link');
        link.rel = 'icon';
        link.type = 'image/svg+xml';
        link.href = href;
        document.head.appendChild(link);

        // Цвет адресной строки на телефоне — в тон логотипу
        if (!document.querySelector("meta[name='theme-color']")) {
            const meta = document.createElement('meta');
            meta.name = 'theme-color';
            meta.content = '#0f172a';
            document.head.appendChild(meta);
        }
    })();

    const style = document.createElement('style');
    style.id = 'app-nav-styles';
    style.textContent = css;
    document.head.appendChild(style);

    // ---------- Разметка ----------
    const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    function linkHtml(item, extraClass, id) {
        const active = item.href === activeHref ? ' is-active' : '';
        return `<a href="${item.href}" ${id ? `id="${id}"` : ''} class="app-nav-link${active}${extraClass || ''}" title="${esc(item.label)}">
                    <i data-lucide="${item.icon}"></i><span class="app-nav-label">${esc(item.label)}</span>
                </a>`;
    }

    // Структура <aside><nav><a> сохранена намеренно: на tests.html код
    // для гостя ищет ссылки через 'aside nav a'.
    const aside = document.createElement('aside');
    aside.className = 'app-nav';
    // Старые id сохранены намеренно: страницы с упражнениями (practice-view)
    // прячут меню на время выполнения задания, находя его по этим id.
    aside.id = 'mainSidebar';
    aside.innerHTML = `
        <div class="app-nav-brand">
            <a href="index.html" class="app-nav-logo"><span>TOEFL</span><i></i></a>
            <button type="button" class="app-nav-toggle" aria-label="${esc(L('Collapse menu', 'Свернуть меню'))}" title="${esc(L('Collapse menu', 'Свернуть меню'))}">
                <i data-lucide="panel-left-close"></i>
            </button>
        </div>
        <nav class="app-nav-body">
            ${NAV_GROUPS.map(g => `
                <div class="app-nav-group">
                    <p class="app-nav-title">${esc(g.title)}</p>
                    ${g.items.map(it => linkHtml(it)).join('')}
                </div>`).join('')}
            ${TEACHER_ITEMS.map(it => linkHtml(it, ' is-teacher hidden', it.id)).join('')}
        </nav>
        <div class="app-nav-foot">
            <div class="app-nav-lang" role="group" aria-label="${esc(L('Language', 'Язык'))}">
                <i data-lucide="globe"></i>
                <span class="app-nav-lang-seg">
                    <button type="button" data-app-lang="en" class="${LANG === 'en' ? 'is-on' : ''}" aria-pressed="${LANG === 'en'}" lang="en">EN</button>
                    <button type="button" data-app-lang="ru" class="${LANG === 'ru' ? 'is-on' : ''}" aria-pressed="${LANG === 'ru'}" lang="ru">RU</button>
                </span>
                <button type="button" class="app-nav-lang-mini" data-app-lang="${LANG === 'ru' ? 'en' : 'ru'}" title="${esc(L('Switch to Russian', 'Switch to English'))}">${LANG === 'ru' ? 'RU' : 'EN'}</button>
            </div>
            <button type="button" class="app-nav-logout" onclick="logoutUser()" title="${esc(L('Log Out', 'Выйти'))}">
                <i data-lucide="log-out"></i><span class="app-nav-label">${esc(L('Log Out', 'Выйти'))}</span>
            </button>
        </div>`;

    // Старые браузеры без 100dvh: высота меню = видимая высота окна
    if (!(window.CSS && CSS.supports && CSS.supports('height', '100dvh'))) {
        const fitHeight = () => { aside.style.height = window.innerHeight + 'px'; };
        fitHeight();
        window.addEventListener('resize', fitHeight);
    }

    const placeholder = document.getElementById('app-sidebar');
    if (placeholder) placeholder.replaceWith(aside);
    else document.body.insertBefore(aside, document.body.firstChild);

    // Мобильное меню
    const allItems = NAV_GROUPS.flatMap(g => g.items);
    const mnav = document.createElement('nav');
    mnav.className = 'app-mnav';
    mnav.id = 'mobileBottomNav';
    mnav.innerHTML = `<div class="app-mnav-row">
        ${allItems.map(it => `<a href="${it.href}" class="app-mnav-link${it.href === activeHref ? ' is-active' : ''}">
            <i data-lucide="${it.icon}"></i><span>${esc(it.short || it.label)}</span></a>`).join('')}
        ${TEACHER_ITEMS.map(it => `<a href="${it.href}" id="${it.mid}" class="app-mnav-link hidden${it.href === activeHref ? ' is-active' : ''}">
            <i data-lucide="${it.icon}"></i><span>${esc(it.short)}</span></a>`).join('')}
        <button type="button" class="app-mnav-link is-lang" data-app-lang="${LANG === 'ru' ? 'en' : 'ru'}" aria-label="${esc(L('Switch to Russian', 'Switch to English'))}"><b>${LANG === 'ru' ? 'EN' : 'RU'}</b><span>${esc(L('Language', 'Язык'))}</span></button>
        <button type="button" class="app-mnav-link is-logout" onclick="logoutUser()"><i data-lucide="log-out"></i><span>${esc(L('Exit', 'Выйти'))}</span></button>
    </div>`;
    document.body.appendChild(mnav);
    document.body.classList.add('app-has-mnav');
    // Пунктов больше, чем влезает на телефоне: прокручиваем строку так, чтобы текущий раздел был виден
    (function showActiveMobile() {
        const row = mnav.querySelector('.app-mnav-row');
        const act = mnav.querySelector('.app-mnav-link.is-active');
        if (!row || !act || row.scrollWidth <= row.clientWidth) return;
        row.scrollLeft = Math.max(0, act.offsetLeft - (row.clientWidth - act.offsetWidth) / 2);
    })();

    // ---------- Переключатель языка ----------
    [aside, mnav].forEach(root => root.addEventListener('click', e => {
        const b = e.target.closest('[data-app-lang]');
        if (b) setLang(b.getAttribute('data-app-lang'));
    }));

    // ---------- Сворачивание ----------
    const toggleBtn = aside.querySelector('.app-nav-toggle');
    function applyCollapsed(collapsed) {
        aside.classList.toggle('is-collapsed', collapsed);
        const label = collapsed ? L('Expand menu', 'Развернуть меню') : L('Collapse menu', 'Свернуть меню');
        toggleBtn.setAttribute('aria-label', label);
        toggleBtn.title = label;
        toggleBtn.innerHTML = `<i data-lucide="${collapsed ? 'panel-left-open' : 'panel-left-close'}"></i>`;
        drawIcons();
    }
    let saved = null;
    try { saved = localStorage.getItem(STORE_KEY); } catch (e) {}
    // Без сохранённого выбора: на планшетах свёрнуто, на широких экранах раскрыто
    applyCollapsed(saved === null ? window.innerWidth < 1280 : saved === '1');
    toggleBtn.addEventListener('click', () => {
        const next = !aside.classList.contains('is-collapsed');
        try { localStorage.setItem(STORE_KEY, next ? '1' : '0'); } catch (e) {}
        applyCollapsed(next);
    });

    // ---------- Иконки ----------
    function drawIcons() {
        try { if (window.lucide && lucide.createIcons) lucide.createIcons(); } catch (e) {}
    }
    drawIcons();
    // Если lucide подключён позже этого скрипта — дорисуем после загрузки
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', drawIcons);
    window.addEventListener('load', drawIcons);

    // ---------- «Назад» в статье, открытой с другой страницы (?from=…) ----------
    // Первая ссылка в начале статьи, ведущая на раздел статей (…-articles.html),
    // теперь ведёт туда, откуда пришли.
    if (FROM) {
        const fixBack = () => {
            const main = document.querySelector('main');
            const back = main && Array.prototype.find.call(main.querySelectorAll('a[href]'),
                a => /(^|\/)[a-z-]+-articles\.html$/i.test(a.getAttribute('href')));
            if (!back) return;
            back.setAttribute('href', FROM.href);
            const txt = Array.prototype.filter.call(back.childNodes, n => n.nodeType === 3 && n.textContent.trim()).pop();
            if (txt) txt.textContent = ' ' + FROM.back;
        };
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fixBack);
        else fixBack();
    }

    // ---------- Ссылка для преподавателя ----------
    // Страницы и так раскрывают teacherLink* для учителя; дублируем здесь,
    // чтобы ссылка появлялась и там, где страница этого не делает.
    function showTeacher() {
        TEACHER_ITEMS.flatMap(it => [it.id, it.mid]).forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.remove('hidden');
        });
    }
    try {
        if (typeof getCachedProfile === 'function') {
            getCachedProfile().then(p => { if (p && p.role === 'teacher') showTeacher(); }).catch(() => {});
        }
    } catch (e) {}

})();
