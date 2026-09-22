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

    // ---------- ПУНКТЫ МЕНЮ. Новый пункт добавляется только здесь. ----------
    const NAV_GROUPS = [
        { title: 'Главное', items: [
            { href: 'index.html',  icon: 'home',       label: 'Dashboard' },
            { href: 'tests.html',  icon: 'file-check', label: 'Mock Tests' }
        ]},
        { title: 'Секции TOEFL', items: [
            { href: 'reading.html',   icon: 'book-text',  label: 'Reading' },
            { href: 'listening.html', icon: 'headphones', label: 'Listening' },
            { href: 'writing.html',   icon: 'pen-tool',   label: 'Writing' },
            { href: 'speaking.html',  icon: 'mic',        label: 'Speaking' }
        ]},
        { title: 'Практика', items: [
            { href: 'vocabulary.html',      icon: 'book-open',      label: 'Vocabulary' },
            { href: 'irregular-verbs.html', icon: 'repeat',         label: 'Irregular Verbs' },
            { href: 'lessons.html',         icon: 'message-circle', label: 'Speaking Topics' }
        ]}
    ];
    const TEACHER_ITEM = { href: 'teacher-board.html', icon: 'users', label: 'Teacher Board' };

    // Внутренние страницы подсвечивают свой раздел в меню
    const PARENT_OF = {
        'read-academic.html': 'reading.html', 'read-academic-task.html': 'reading.html',
        'read-daily.html': 'reading.html', 'read-daily-task.html': 'reading.html',
        'complete-words.html': 'reading.html', 'complete-words-task.html': 'reading.html',
        'take-mock-test.html': 'reading.html', 'mini-mock-test.html': 'reading.html',
        'reading-articles.html': 'reading.html',
        'practice-view.html': 'listening.html', 'choose-response-test.html': 'listening.html',
        'mock-test-view.html': 'listening.html',
        'task-list.html': 'writing.html', 'writing-practice.html': 'writing.html',
        'mini-mock-writing.html': 'writing.html', 'mini-mock-results.html': 'writing.html',
        'speaking_player.html': 'speaking.html', 'speaking_results.html': 'speaking.html',
        'interview.html': 'speaking.html', 'interview_results.html': 'speaking.html',
        'listen_repeat.html': 'speaking.html', 'listen-repeat-practice.html': 'speaking.html',
        'speaking_mini_mock.html': 'speaking.html', 'speaking_mini_mock_player.html': 'speaking.html',
        'speaking_mini_mock_results.html': 'speaking.html',
        'review.html': 'vocabulary.html',
        'lesson-unit.html': 'lessons.html',
        'student-profile.html': 'teacher-board.html'
    };

    const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const activeHref = PARENT_OF[here] || here;
    const STORE_KEY = 'appNavCollapsed';

    // ---------- Стили меню ----------
    const css = `
    .app-nav{box-sizing:border-box;width:256px;background:#fff;border-right:1px solid #f3f4f6;
        padding:24px 16px;height:100vh;position:sticky;top:0;flex-shrink:0;display:none;
        flex-direction:column;font-size:14px;line-height:1.25;transition:width .2s ease;z-index:10;
        overflow-y:auto;overflow-x:hidden}
    @media (min-width:768px){.app-nav{display:flex}}
    .app-nav *{box-sizing:border-box}
    .app-nav-brand{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;padding:0 8px;min-height:32px}
    .app-nav-logo{font-weight:700;font-size:24px;letter-spacing:-.05em;display:flex;align-items:center;gap:8px;color:#0f172a;text-decoration:none}
    .app-nav-logo i{width:6px;height:6px;border-radius:9999px;background:#4f46e5;margin-top:8px;display:inline-block}
    .app-nav-toggle{border:0;background:transparent;color:#9ca3af;cursor:pointer;padding:6px;border-radius:8px;display:flex}
    .app-nav-toggle:hover{background:#f9fafb;color:#334155}
    .app-nav-toggle svg{width:18px;height:18px}
    .app-nav-body{flex:1;display:flex;flex-direction:column}
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
    .app-nav-logout{margin-top:auto;display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:12px;
        color:#f43f5e;background:transparent;border:1px dashed transparent;font:inherit;font-size:14px;font-weight:500;cursor:pointer;white-space:nowrap;width:100%}
    .app-nav-logout:hover{background:rgba(255,241,242,.6);border-color:#ffe4e6}
    .app-nav-logout svg{width:20px;height:20px;flex-shrink:0}

    /* Свёрнутое меню — полоса с иконками */
    .app-nav.is-collapsed{width:76px;padding:24px 12px}
    .app-nav.is-collapsed .app-nav-brand{justify-content:center;padding:0}
    .app-nav.is-collapsed .app-nav-logo{display:none}
    .app-nav.is-collapsed .app-nav-label{display:none}
    .app-nav.is-collapsed .app-nav-title{font-size:0;height:1px;background:#f3f4f6;margin:4px 8px 10px;padding:0}
    .app-nav.is-collapsed .app-nav-link,.app-nav.is-collapsed .app-nav-logout{justify-content:center;padding:12px 0}

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
    /* Место под мобильное меню ДОБАВЛЯЕТСЯ к отступу страницы, а не заменяет его:
       у некоторых страниц свой большой отступ (например, под таймер урока). */
    @media (max-width:767px){ body.app-has-mnav main::after{content:'';display:block;height:calc(72px + env(safe-area-inset-bottom))} }
    /* Ссылка преподавателя скрыта для всех, кроме учителя — независимо от порядка стилей */
    .app-nav .hidden,.app-mnav .hidden{display:none !important}
    `;
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
    aside.innerHTML = `
        <div class="app-nav-brand">
            <a href="index.html" class="app-nav-logo"><span>TOEFL</span><i></i></a>
            <button type="button" class="app-nav-toggle" aria-label="Свернуть меню" title="Свернуть меню">
                <i data-lucide="panel-left-close"></i>
            </button>
        </div>
        <nav class="app-nav-body">
            ${NAV_GROUPS.map(g => `
                <div class="app-nav-group">
                    <p class="app-nav-title">${esc(g.title)}</p>
                    ${g.items.map(it => linkHtml(it)).join('')}
                </div>`).join('')}
            ${linkHtml(TEACHER_ITEM, ' is-teacher hidden', 'teacherLinkDesktop')}
            <button type="button" class="app-nav-logout" onclick="logoutUser()" title="Log Out">
                <i data-lucide="log-out"></i><span class="app-nav-label">Log Out</span>
            </button>
        </nav>`;

    const placeholder = document.getElementById('app-sidebar');
    if (placeholder) placeholder.replaceWith(aside);
    else document.body.insertBefore(aside, document.body.firstChild);

    // Мобильное меню
    const allItems = NAV_GROUPS.flatMap(g => g.items);
    const mnav = document.createElement('nav');
    mnav.className = 'app-mnav';
    mnav.innerHTML = `<div class="app-mnav-row">
        ${allItems.map(it => `<a href="${it.href}" class="app-mnav-link${it.href === activeHref ? ' is-active' : ''}">
            <i data-lucide="${it.icon}"></i><span>${esc(it.label.replace('Speaking Topics', 'Topics').replace('Irregular Verbs', 'Verbs'))}</span></a>`).join('')}
        <a href="${TEACHER_ITEM.href}" id="teacherLinkMobile" class="app-mnav-link hidden${TEACHER_ITEM.href === activeHref ? ' is-active' : ''}">
            <i data-lucide="${TEACHER_ITEM.icon}"></i><span>Teacher</span></a>
        <button type="button" class="app-mnav-link is-logout" onclick="logoutUser()"><i data-lucide="log-out"></i><span>Exit</span></button>
    </div>`;
    document.body.appendChild(mnav);
    document.body.classList.add('app-has-mnav');

    // ---------- Сворачивание ----------
    const toggleBtn = aside.querySelector('.app-nav-toggle');
    function applyCollapsed(collapsed) {
        aside.classList.toggle('is-collapsed', collapsed);
        const label = collapsed ? 'Развернуть меню' : 'Свернуть меню';
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

    // ---------- Ссылка для преподавателя ----------
    // Страницы и так раскрывают teacherLink* для учителя; дублируем здесь,
    // чтобы ссылка появлялась и там, где страница этого не делает.
    function showTeacher() {
        ['teacherLinkDesktop', 'teacherLinkMobile'].forEach(id => {
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
