// Ключи. Имена намеренно с префиксом AUTH_: почти каждая страница
// объявляет свои SUPABASE_URL/SUPABASE_ANON_KEY, а два одинаковых const
// в глобальной области роняют ВЕСЬ скрипт страницы (SyntaxError).
// С префиксом auth.js можно подключать куда угодно, ничего не ломая.
const AUTH_SB_URL = 'https://gmsdixqjhlycovsgwbzq.supabase.co';
const AUTH_SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdtc2RpeHFqaGx5Y292c2d3YnpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NTEwODIsImV4cCI6MjA5NTAyNzA4Mn0.gPEOviqSGTuczqoSHvb_BX4mBSdxjh8Bg6BV13l58LQ';

// Создаем единый клиент для работы с базой
// window.supabase — явно, чтобы не подхватить одноимённую переменную страницы
const _supabase = window.supabase.createClient(AUTH_SB_URL, AUTH_SB_KEY);

// Совместимость в обе стороны.
// Кладём ключи в window (а НЕ через const), поэтому:
//   • страница со своими const SUPABASE_URL — просто перекрывает их, ошибки нет;
//   • страница, которая рассчитывает получить ключи из auth.js, — получает их.
// Раньше это были const, и любой из двух случаев ронял весь скрипт страницы.
window.SUPABASE_URL = AUTH_SB_URL;
window.SUPABASE_ANON_KEY = AUTH_SB_KEY;
window.supabaseClient = window.supabaseClient || _supabase;

// Карта «страница -> секция». ЕСЛИ ДОБАВЛЯЕТЕ НОВУЮ СТРАНИЦУ С ЗАДАНИЯМИ —
// впишите её сюда, иначе она будет открыта всем и ссылка на неё не заблокируется.
const PAGE_SECTIONS = {
    // --- Reading ---
    'reading.html': 'reading',
    'read-academic.html':   'reading',
    'read-academic-task.html':      'reading',
    'read-daily-task.html': 'reading',
    'read-daily.html':      'reading',
    'complete-words.html':  'reading',
    'complete-words-task.html':     'reading',
    'take-mock-test.html':  'reading',
    'mini-mock-test.html':  'reading',
    'reading-articles.html': 'reading',

    // --- Listening ---
    'listening.html':       'listening',
    'practice-view.html':   'listening',
    'choose-response-test.html':    'listening',
    'mock-test-view.html':  'listening',
    'choose-response-list.html':   'listening',
    'listening-practice.html':     'listening',
    'listening-mini-mock.html':    'listening',
    'listening-articles.html':     'listening',
    'listening-article-view.html': 'listening',
    'article-general-listening.html': 'listening',
    'article-listen-choose-a-response.html': 'listening',
    'article-listen-to-a-conversation.html': 'listening',
    'article-listen-announcement.html': 'listening',
    'article-listening-academic.html': 'listening',
    'article-listening-main-idea.html': 'listening',
    'article-listening-factual.html': 'listening',
    'article-listening-inference.html': 'listening',
    'article-listening-purpose.html': 'listening',
    'article-listening-attitude.html': 'listening',
    'article-listening-method.html': 'listening',

    // --- Writing ---
    'writing.html': 'writing',
    'task-list.html':       'writing',
    'writing-practice.html':'writing',
    'mini-mock-writing.html':       'writing',
    'mini-mock-results.html':       'writing',
    'mini-mock-writing-list.html':  'writing',
    'sentence-practice.html':       'writing',
    'writing-articles.html':        'writing',
    'article-write-an-email.html':  'writing',
    'article-email-tone.html':      'writing',
    'article-email-anatomy.html':   'writing',
    'article-email-opening.html':   'writing',
    'article-email-details.html':   'writing',
    'article-email-politeness.html': 'writing',
    'article-email-closing.html':   'writing',
    'article-email-practice.html':  'writing',

    // --- Speaking ---
    'speaking.html':    'speaking',
    'general-speaking.html':     'speaking',
    'article-speaking-listen-repeat.html': 'speaking',
    'article-speaking-interview.html': 'speaking',
    'article-speaking-personal-experience.html': 'speaking',
    'article-speaking-plans-goals.html': 'speaking',
    'article-speaking-preferences.html': 'speaking',
    'article-speaking-observations.html': 'speaking',
    'article-speaking-opinions.html': 'speaking',
    'article-speaking-future.html': 'speaking',
    'article-speaking-hypothetical.html': 'speaking',
    'speaking-articles.html':    'speaking',
    'speaking_player.html':     'speaking',
    'speaking_results.html':    'speaking',
    'interview.html':   'speaking',
    'interview_results.html':   'speaking',
    'listen_repeat.html':       'speaking',
    'listen-repeat-practice.html':      'speaking',
    'speaking_mini_mock.html':  'speaking',
    'speaking_mini_mock_player.html':   'speaking',
    'speaking_mini_mock_results.html':  'speaking',

    // --- Mock Tests ---
    'tests.html':   'tests'
};

const ACCESS_FIELD = {
    reading:   { field: 'access_reading',   label: 'Reading' },
    listening: { field: 'access_listening', label: 'Listening' },
    speaking:  { field: 'access_speaking',  label: 'Speaking' },
    writing:   { field: 'access_writing',   label: 'Writing' },
    tests:     { field: 'access_tests',     label: 'Mock Tests' }
};

// ==========================================
// ПРОВЕРКА ДОСТУПА — «закрыто по умолчанию»
// ==========================================
// Почему переписано. Раньше доступ проверялся только когда страница сама
// вызывала requireAuth(), а до ответа страница раздела была полностью
// открыта. Проверка шла через _supabase.auth.getSession(), а клиент Supabase
// ждёт общую для ВСЕХ вкладок «блокировку» сессии: если её держит другая
// вкладка платформы (особенно свёрнутая — браузер её «замораживает») или
// второй клиент на той же странице, ожидание длится секунды или бесконечно.
// Ученица видела это так: после перезагрузки замки пропадали, разделы
// открывались, а замок появлялся через несколько секунд или не появлялся вовсе.
//
// Теперь:
//  1) страница раздела скрыта с первой миллисекунды, пока доступ не подтверждён;
//  2) профиль читается напрямую одним запросом с токеном из браузера —
//     без ожидания блокировки; клиент Supabase — только запасной путь;
//  3) если проверка не ответила за 15 секунд — экран «Не удалось проверить
//     доступ», а не открытая страница;
//  4) клик по закрытому разделу перехватывается на всей странице, включая
//     ссылки, которые страница дорисовала позже.

const AUTH_TEACHER_ONLY = ['teacher-board.html', 'student-profile.html', 'content-lab.html', 'mock-lab.html', 'exam-reports.html'];
const AUTH_PROFILE_COLS = 'role,is_approved,access_reading,access_listening,access_speaking,access_writing,access_tests,guest_completed_demo';

// ---------- Язык экранов доступа ----------
// Тот же выбор, что у меню (nav.js) и i18n.js: сохранённый в браузере, иначе язык браузера
const AUTH_LANG = (function () {
    if (window.I18N) return window.I18N.lang;
    try { const s = localStorage.getItem('appLang'); if (s === 'en' || s === 'ru') return s; } catch (e) { /* по браузеру */ }
    const list = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'en'];
    for (const l of list) {
        if (/^(ru|be|uk|kk)\b/i.test(l)) return 'ru';
        if (/^en\b/i.test(l)) return 'en';
    }
    return 'en';
})();
const authL = (en, ru) => (AUTH_LANG === 'ru' ? ru : en);

// ---------- Гость (бесплатная версия) ----------
// Куда ведёт «Получить полный доступ». Сейчас — Telegram преподавателя,
// потом сюда встанет страница оплаты.
const AUTH_FULL_ACCESS_URL = 'https://t.me/LIKO_17';
// Задания гостю ограничивает база (guest_access.sql). Статьи — обычные файлы,
// поэтому их ограничивает страница: открыты две статьи каждого раздела —
// те, что стоят карточками на главной странице раздела.
const AUTH_GUEST_FREE_ARTICLES = [
    'general-reading.html', 'article-inference.html',
    'article-general-listening.html', 'article-listen-to-a-conversation.html',
    'article-write-an-academic.html', 'article-write-an-email.html',
    'general-speaking.html', 'article-speaking-interview.html'
];
const AUTH_GUEST_BLOCKED = ['listening-import.html', 'speaking-import.html'];   // инструменты преподавателя
function authIsArticle(file) {
    return /^article-/.test(file) || ['general-reading.html', 'general-speaking.html', 'reading-logic.html',
        'reading-time-management.html', 'writing-article-view.html', 'listening-article-view.html'].includes(file);
}
function authGuestLockedFile(file) {
    return authIsArticle(file) && !AUTH_GUEST_FREE_ARTICLES.includes(file);
}
const AUTH_STORAGE_KEY = 'sb-' + new URL(AUTH_SB_URL).hostname.split('.')[0] + '-auth-token';
const AUTH_TIMEOUT_MS = 8000;      // на один запрос
const AUTH_GATE_LIMIT_MS = 15000;  // на всю проверку: дольше — экран ошибки

// Имя файла страницы в одном виде: «choose-response-list», «choose-response-list.html»
// и «/toefl2026/» → «choose-response-list.html» / «index.html».
// GitHub Pages отдаёт страницу и по адресу без .html — раньше такое имя не находилось
// в PAGE_SECTIONS, и проверка доступа к разделу (и к страницам преподавателя)
// просто пропускалась: достаточно было стереть «.html» в адресе.
function authNormalizeFile(name) {
    let file = String(name || '').toLowerCase();
    try { file = decodeURIComponent(file); } catch (e) { /* оставляем как есть */ }
    if (!file) return 'index.html';
    if (!/\.[a-z0-9]+$/.test(file)) file += '.html';
    return file;
}

function authFileName() {
    return authNormalizeFile(window.location.pathname.split('/').pop());
}

function authWithTimeout(promise, ms, label) {
    return new Promise((resolve, reject) => {
        const t = setTimeout(() => reject(new Error('Таймаут: ' + label)), ms);
        Promise.resolve(promise).then(v => { clearTimeout(t); resolve(v); }, e => { clearTimeout(t); reject(e); });
    });
}

// Сессия, сохранённая Supabase в браузере (читается мгновенно, без блокировки)
function authReadStoredSession() {
    try {
        const raw = localStorage.getItem(AUTH_STORAGE_KEY);
        if (!raw) return null;
        let s = JSON.parse(raw);
        if (s && s.currentSession) s = s.currentSession;
        if (!s || !s.access_token || !s.user || !s.user.id) return null;
        return s;
    } catch (e) { return null; }
}

// Быстрый путь: профиль одним запросом к базе с токеном из браузера
async function authFetchProfileDirect(stored) {
    const url = AUTH_SB_URL + '/rest/v1/profiles?select=' + AUTH_PROFILE_COLS + '&id=eq.' + encodeURIComponent(stored.user.id);
    const res = await authWithTimeout(fetch(url, {
        headers: { apikey: AUTH_SB_KEY, Authorization: 'Bearer ' + stored.access_token, Accept: 'application/json' }
    }), AUTH_TIMEOUT_MS, 'profiles');
    if (res.status === 401 || res.status === 403) return { retry: true };  // токен устарел — пусть клиент его обновит
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const rows = await res.json();
    return { profile: Array.isArray(rows) ? (rows[0] || null) : null };
}

// Запасной путь: через клиент Supabase (он сам обновит устаревший токен)
async function authFetchProfileViaClient() {
    const { data: { session } } = await authWithTimeout(_supabase.auth.getSession(), AUTH_TIMEOUT_MS, 'getSession');
    if (!session) return { user: null, profile: null };
    const once = () => authWithTimeout(
        _supabase.from('profiles').select(AUTH_PROFILE_COLS).eq('id', session.user.id).maybeSingle(),
        AUTH_TIMEOUT_MS, 'profiles');
    let { data, error } = await once();
    if (error) {
        await new Promise(r => setTimeout(r, 800)); // сетевые сбои обычно разовые
        ({ data, error } = await once());
    }
    if (error) throw error;
    return { user: session.user, profile: data || null };
}

// Одна проверка на страницу — её ждут и скрытие страницы, и requireAuth(), и замки ссылок
let _authAccessPromise = null;
function authLoadAccess() {
    if (_authAccessPromise) return _authAccessPromise;
    _authAccessPromise = (async () => {
        const stored = authReadStoredSession();
        if (stored && (!stored.expires_at || stored.expires_at * 1000 > Date.now() + 30000)) {
            try {
                const r = await authFetchProfileDirect(stored);
                if (!r.retry) return { user: stored.user, profile: r.profile };
            } catch (e) {
                console.warn('[auth] прямая проверка не удалась, пробуем через клиент:', e.message || e);
            }
        }
        return await authFetchProfileViaClient();
    })();
    _authAccessPromise.catch(() => { _authAccessPromise = null; }); // ошибку не запоминаем навсегда
    return _authAccessPromise;
}

// Решение по текущей странице. Логика та же, что была в requireAuth().
function authDecide(profile) {
    const isTeacher = profile && profile.role === 'teacher';
    const isGuest = profile && profile.role === 'guest';

    // Гость ходит по страницам ученицы; задания ему ограничивает база
    // (guest_access.sql), статьи кроме бесплатных — закрыты здесь
    if (isGuest) {
        const file = authFileName();
        if (AUTH_TEACHER_ONLY.includes(file) || AUTH_GUEST_BLOCKED.includes(file)) return { kind: 'redirect', to: 'index.html' };
        if (authGuestLockedFile(file)) return { kind: 'guestLocked' };
        return { kind: 'allow' };
    }

    // Ученик без подтверждения преподавателем
    if (!isTeacher && (!profile || !profile.is_approved)) return { kind: 'pending' };

    // Страницы преподавателя
    if (AUTH_TEACHER_ONLY.includes(authFileName()) && !isTeacher) return { kind: 'redirect', to: 'index.html' };

    // Закрытый раздел (проверяется каждая страница по имени файла)
    if (!isTeacher) {
        const section = PAGE_SECTIONS[authFileName()];
        if (section) {
            const rule = ACCESS_FIELD[section];
            if (!profile[rule.field]) return { kind: 'blocked', label: rule.label };
        }
    }
    return { kind: 'allow' };
}

// ---------- скрытие страницы до проверки ----------
const AUTH_GATED = !!PAGE_SECTIONS[authFileName()] || AUTH_TEACHER_ONLY.includes(authFileName());

function authReveal() {
    document.documentElement.classList.remove('auth-gate');
    const w = document.getElementById('auth-gate-wait');
    if (w) w.remove();
}

function authWhenBody(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, { once: true });
    else fn();
}

function authScreen(html) {
    authWhenBody(() => {
        document.body.innerHTML = html;
        // Часть страниц держит <body class="opacity-0"> и проявляет его сама после
        // проверки. Экран «Раздел закрыт / на проверке» оставался невидимым —
        // ученица видела пустую серую страницу.
        document.body.classList.remove('opacity-0');
        document.body.style.opacity = '1';
        authReveal();
    });
}

const AUTH_SCREEN_STYLE = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;margin:0;padding:20px;box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif;text-align:center;background-color:#f9f9f9;';
const AUTH_BTN_STYLE = 'display:inline-block;text-decoration:none;text-align:center;padding:14px 28px;font-size:14px;font-weight:600;color:#fff;background-color:#000;border:none;border-radius:12px;cursor:pointer;width:100%;max-width:200px;box-sizing:border-box;';

function authShowPending() {
    authScreen(`
        <div style="${AUTH_SCREEN_STYLE}">
            <div style="font-size:64px;margin-bottom:16px;">⏳</div>
            <h2 style="margin:0 0 12px 0;color:#1a1a1a;font-size:22px;font-weight:700;">${authL('Your account is being reviewed', 'Аккаунт на проверке')}</h2>
            <p style="margin:0 0 32px 0;color:#666;font-size:14px;max-width:300px;line-height:1.5;">
                ${authL('You will get access to the platform as soon as your teacher confirms your account. It usually doesn’t take long.',
                        'Доступ к платформе появится сразу после подтверждения преподавателем. Обычно это занимает совсем немного времени.')}
            </p>
            <button onclick="logoutUser()" style="${AUTH_BTN_STYLE}">${authL('Log out', 'Выйти из аккаунта')}</button>
        </div>`);
}

function authShowBlocked(sectionName) {
    authScreen(`
        <div style="${AUTH_SCREEN_STYLE}">
            <div style="font-size:64px;margin-bottom:16px;">🔒</div>
            <h2 style="margin:0 0 12px 0;color:#1a1a1a;font-size:22px;font-weight:700;">${authL('This section is closed', 'Раздел закрыт')}</h2>
            <p style="margin:0 0 32px 0;color:#666;font-size:14px;max-width:300px;line-height:1.5;">
                ${authL('Your teacher hasn’t opened <strong>' + sectionName + '</strong> for you yet. You can keep working in the other sections.',
                        'Доступ к разделу <strong>' + sectionName + '</strong> пока не открыт преподавателем. Вы можете продолжить работу в других разделах.')}
            </p>
            <a href="index.html" style="${AUTH_BTN_STYLE}">${authL('Back to dashboard', 'На главную')}</a>
        </div>`);
}

function authShowError() {
    authScreen(`
        <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;font-family:'Plus Jakarta Sans',sans-serif;background:#f8f9fa;padding:24px;">
            <div style="max-width:420px;text-align:center;background:#fff;padding:32px;border-radius:24px;border:1px solid #f0f0f0;">
                <h2 style="margin:0 0 12px;font-size:20px;font-weight:700;color:#1a1a1a;">${authL('Couldn’t check your access', 'Не удалось проверить доступ')}</h2>
                <p style="margin:0 0 20px;color:#666;font-size:14px;line-height:1.5;">
                    ${authL('The connection to the server dropped. Your account is fine, just try again.',
                            'Связь с базой прервалась. Это не значит, что с аккаунтом что-то не так — просто попробуйте ещё раз.')}
                </p>
                <button onclick="location.reload()" style="background:#0f172a;color:#fff;border:0;padding:12px 24px;border-radius:12px;font-weight:700;font-size:14px;cursor:pointer;">
                    ${authL('Refresh the page', 'Обновить страницу')}
                </button>
            </div>
        </div>`);
}

// Текст о бесплатной версии — один на баннер, окно и экран
function authGuestOffer() {
    return authL('The free version includes two tasks of every type, a mini mock in each section and one full practice test. Full access opens every task, article and mock test, plus your teacher’s feedback.',
                 'В бесплатной версии — по два задания каждого типа, мини-мок в каждом разделе и один полный пробный тест. Полный доступ открывает все задания, статьи и мок-тесты, а ещё проверку преподавателем.');
}
const AUTH_CTA_STYLE = 'display:inline-block;text-decoration:none;text-align:center;padding:13px 22px;font-size:14px;font-weight:700;color:#fff;background:#4f46e5;border:0;border-radius:12px;cursor:pointer;';
const AUTH_GHOST_STYLE = 'display:inline-block;text-decoration:none;text-align:center;padding:13px 22px;font-size:14px;font-weight:700;color:#334155;background:#f1f5f9;border:0;border-radius:12px;cursor:pointer;';

function authShowGuestLocked() {
    authScreen(`
        <div style="${AUTH_SCREEN_STYLE}">
            <div style="max-width:420px;background:#fff;padding:32px 28px;border-radius:24px;border:1px solid #eef0f4;">
                <div style="font-size:44px;margin-bottom:12px;">🔒</div>
                <h2 style="margin:0 0 12px;color:#0f172a;font-size:21px;font-weight:800;">${authL('This article is in the full version', 'Эта статья — в полной версии')}</h2>
                <p style="margin:0 0 24px;color:#64748b;font-size:14px;line-height:1.6;">${authGuestOffer()}</p>
                <div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;">
                    <a href="${AUTH_FULL_ACCESS_URL}" target="_blank" rel="noopener" style="${AUTH_CTA_STYLE}">${authL('Get full access', 'Получить полный доступ')}</a>
                    <a href="index.html" style="${AUTH_GHOST_STYLE}">${authL('Back to dashboard', 'На главную')}</a>
                </div>
            </div>
        </div>`);
}

// Окно «Полный доступ» поверх страницы (клик по закрытой статье и т. п.)
function authShowUpsell(title) {
    let m = document.getElementById('auth-upsell');
    if (m) m.remove();
    m = document.createElement('div');
    m.id = 'auth-upsell';
    m.setAttribute('role', 'dialog');
    m.setAttribute('aria-modal', 'true');
    m.style.cssText = 'position:fixed;inset:0;z-index:99990;background:rgba(15,23,42,.45);display:flex;align-items:center;justify-content:center;padding:16px;font-family:\'Plus Jakarta Sans\',-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif;';
    m.innerHTML = `
        <div style="max-width:420px;width:100%;background:#fff;border-radius:24px;padding:28px 24px;text-align:center;box-shadow:0 20px 50px rgba(15,23,42,.25);">
            <div style="font-size:40px;margin-bottom:10px;">🔒</div>
            <h2 style="margin:0 0 10px;color:#0f172a;font-size:20px;font-weight:800;">${title || authL('Available with full access', 'Доступно в полной версии')}</h2>
            <p style="margin:0 0 22px;color:#64748b;font-size:14px;line-height:1.6;">${authGuestOffer()}</p>
            <div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;">
                <a href="${AUTH_FULL_ACCESS_URL}" target="_blank" rel="noopener" style="${AUTH_CTA_STYLE}">${authL('Get full access', 'Получить полный доступ')}</a>
                <button type="button" data-auth-close style="${AUTH_GHOST_STYLE}">${authL('Not now', 'Не сейчас')}</button>
            </div>
        </div>`;
    m.addEventListener('click', e => { if (e.target === m || e.target.closest('[data-auth-close]')) m.remove(); });
    document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { m.remove(); document.removeEventListener('keydown', esc); } });
    document.body.appendChild(m);
    const b = m.querySelector('a');
    if (b) b.focus();
}

// Полоска «бесплатная версия» вверху страниц с меню (на экранах заданий её нет)
function authGuestBanner() {
    authWhenBody(() => {
        if (document.getElementById('auth-guest-bar') || !document.querySelector('.app-nav, #mainSidebar')) return;
        if (authFileName() === 'index.html') return;   // на главной то же самое говорит билет вверху
        try { if (sessionStorage.getItem('authGuestBarClosed') === '1') return; } catch (e) { /* показываем */ }
        const bar = document.createElement('div');
        bar.id = 'auth-guest-bar';
        bar.setAttribute('role', 'region');
        bar.setAttribute('aria-label', authL('Free version', 'Бесплатная версия'));
        bar.style.cssText = 'display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin:0 0 16px;padding:12px 14px 12px 16px;border-radius:16px;background:#eef2ff;border:1px solid #e0e7ff;color:#312e81;font-size:13px;line-height:1.45;font-family:inherit;';
        bar.innerHTML = `
            <span style="flex:1 1 260px;min-width:0;"><b>${authL('Free version.', 'Бесплатная версия.')}</b> ${authL('Two tasks of every type, a mini mock in each section and one full practice test.', 'По два задания каждого типа, мини-мок в каждом разделе и один полный пробный тест.')}</span>
            <a href="${AUTH_FULL_ACCESS_URL}" target="_blank" rel="noopener" style="flex-shrink:0;text-decoration:none;font-weight:700;color:#fff;background:#4f46e5;padding:8px 14px;border-radius:10px;">${authL('Get full access', 'Получить полный доступ')}</a>
            <button type="button" aria-label="${authL('Hide', 'Скрыть')}" style="flex-shrink:0;border:0;background:transparent;color:#6366f1;font-size:18px;line-height:1;cursor:pointer;padding:4px 6px;border-radius:8px;">×</button>`;
        bar.querySelector('button').addEventListener('click', () => {
            bar.remove();
            try { sessionStorage.setItem('authGuestBarClosed', '1'); } catch (e) { /* только до перезагрузки */ }
        });
        const main = document.querySelector('main');
        const host = main ? (main.firstElementChild && main.firstElementChild.matches('div[class*="max-w"]') ? main.firstElementChild : main) : document.body;
        host.insertBefore(bar, host.firstChild);
    });
}

// Применить решение. Возвращает true, если страницу можно показывать.
function authApply(decision) {
    if (decision.kind === 'redirect') { window.location.href = decision.to; return false; }
    if (decision.kind === 'guestLocked') { authShowGuestLocked(); return false; }
    if (decision.kind === 'pending') { authShowPending(); return false; }
    if (decision.kind === 'blocked') { authShowBlocked(decision.label); return false; }
    authReveal();
    return true;
}

if (AUTH_GATED) {
    // Прячем страницу ещё до того, как браузер нарисует её содержимое
    document.documentElement.classList.add('auth-gate');
    const gateStyle = document.createElement('style');
    gateStyle.textContent = 'html.auth-gate body{visibility:hidden!important}html.auth-gate #auth-gate-wait{visibility:visible!important}';
    (document.head || document.documentElement).appendChild(gateStyle);

    // Если проверка дольше 0.7 с — показываем «Проверяем доступ…», чтобы не было пустого экрана
    const waitTimer = setTimeout(() => authWhenBody(() => {
        if (!document.documentElement.classList.contains('auth-gate') || document.getElementById('auth-gate-wait')) return;
        const w = document.createElement('div');
        w.id = 'auth-gate-wait';
        w.style.cssText = 'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif;color:#64748b;font-size:14px;background:#f8f9fa;z-index:99998;';
        w.textContent = authL('Checking access…', 'Проверяем доступ…');
        document.body.appendChild(w);
    }), 700);

    // Жёсткий предел: страница не может остаться открытой из-за зависшей проверки
    const limitTimer = setTimeout(() => {
        if (document.documentElement.classList.contains('auth-gate')) {
            console.error('[auth] проверка доступа не ответила за ' + (AUTH_GATE_LIMIT_MS / 1000) + ' с');
            authShowError();
        }
    }, AUTH_GATE_LIMIT_MS);

    authLoadAccess().then(access => {
        clearTimeout(waitTimer); clearTimeout(limitTimer);
        if (!access.user) { window.location.href = 'login.html'; return; }
        if (authApply(authDecide(access.profile))) applySectionLocks(access.profile);
    }).catch(err => {
        clearTimeout(waitTimer); clearTimeout(limitTimer);
        console.error('Не удалось проверить доступ:', err);
        authShowError();
    });
}

// Функция контроля доступа — вызывают сами страницы. Возвращает пользователя
// или null (тогда страница уже показала нужный экран или ушла на логин).
async function requireAuth() {
    let access;
    try {
        access = await authLoadAccess();
    } catch (err) {
        console.error('Не удалось прочитать профиль:', err);
        authShowError();
        return null;
    }

    if (!access.user) {
        window.location.href = 'login.html';
        return null;
    }

    const profile = access.profile;
    if (!authApply(authDecide(profile))) return null;

    if (profile && profile.role === 'guest') {
        applySectionLocks(profile);   // для гостя: замки на закрытых статьях и полоска «бесплатная версия»
        return { ...access.user, role: 'guest', profile: profile };
    }

    // Гасим ссылки на закрытые секции на этой странице
    applySectionLocks(profile);

    return {
        ...access.user,
        role: profile ? profile.role : 'student',
        profile: profile
    };
}

// ==========================================
// Блокировка ссылок на закрытые секции.
// Клик перехватывается на уровне всей страницы (до обработчиков самой
// страницы), поэтому закрыты и ссылки, которые страница дорисует позже —
// карточки, списки, меню. Замок и полупрозрачность навешиваются и на новые
// ссылки (MutationObserver).
// ==========================================
let _authLockProfile = null;

function authLockRule(href) {
    if (!_authLockProfile || !href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:')) return null;
    const file = authNormalizeFile(href.split('?')[0].split('#')[0].split('/').pop());
    if (_authLockProfile.role === 'guest') return authGuestLockedFile(file) ? { guest: true } : null;
    const section = PAGE_SECTIONS[file];
    if (!section) return null;
    const rule = ACCESS_FIELD[section];
    return _authLockProfile[rule.field] ? null : rule;
}

function authDecorateLink(link) {
    const rule = authLockRule(link.getAttribute('href') || '');
    if (!rule || link.querySelector('.section-lock-badge')) return;
    link.style.opacity = rule.guest ? '0.6' : '0.4';
    link.style.cursor = 'not-allowed';
    link.setAttribute('aria-disabled', 'true');
    link.setAttribute('title', rule.guest ? authL('Available with full access', 'Доступно в полной версии')
                                          : authL(rule.label + ' isn’t open for you yet', 'Раздел ' + rule.label + ' пока не открыт преподавателем'));
    const badge = document.createElement('span');
    badge.className = 'section-lock-badge';
    badge.textContent = ' 🔒';
    badge.style.fontSize = '11px';
    link.appendChild(badge);
}

function authDecorateAll(root) {
    if (!root || !root.querySelectorAll) return;
    if (root.matches && root.matches('a[href]')) authDecorateLink(root);
    root.querySelectorAll('a[href]').forEach(authDecorateLink);
}

function applySectionLocks(profile) {
    if (!profile || profile.role === 'teacher') return;
    _authLockProfile = profile;
    if (profile.role === 'guest') authGuestBanner();

    if (!applySectionLocks._installed) {
        applySectionLocks._installed = true;

        document.addEventListener('click', e => {
            const link = e.target && e.target.closest ? e.target.closest('a[href]') : null;
            if (!link) return;
            const rule = authLockRule(link.getAttribute('href') || '');
            if (!rule) return;
            e.preventDefault();
            e.stopPropagation();
            if (rule.guest) authShowUpsell();
            else alert(authL('The ' + rule.label + ' section isn’t open for you yet.', 'Раздел «' + rule.label + '» пока не открыт преподавателем.'));
        }, true);

        new MutationObserver(mutations => {
            mutations.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType === 1) authDecorateAll(n); }));
        }).observe(document.documentElement, { childList: true, subtree: true });
    }

    authWhenBody(() => authDecorateAll(document));
}

// Функция выхода
async function logoutUser() {
    await _supabase.auth.signOut();
    window.location.href = 'login.html';
}

// ==========================================
// ДЕМО-РЕЖИМ ДЛЯ ГОСТЯ: общий механизм ограничения списков заданий.
// Используется на страницах со списками (Reading/Listening/Writing/
// Speaking practice, Vocabulary, Grammar Articles) — вместо того, чтобы
// на каждой странице заново писать логику "гость видит только N штук",
// весь список просто прогоняется через applyGuestDemoLimit().
// ==========================================

function isGuestUser(currentUser) {
    return !!(currentUser && currentUser.role === 'guest');
}

// items — обычный массив (задания/темы/слова, что угодно), limit — сколько
// показать не-гостю ничего не меняет; гостю — обрезает и считает остаток.
function applyGuestDemoLimit(items, currentUser, limit = 1) {
    if (!isGuestUser(currentUser)) {
        return { visible: items, lockedCount: 0, isLimited: false };
    }
    return {
        visible: items.slice(0, limit),
        lockedCount: Math.max(0, items.length - limit),
        isLimited: items.length > limit
    };
}

// Единая карточка-заглушка "остальное по подписке" — вставляется в конец
// сетки/списка вместо оставшихся элементов. sectionLabel — во множественном
// числе, например "задания", "темы", "слова".
function renderGuestLockedCard(lockedCount, sectionLabel) {
    if (lockedCount <= 0) return '';
    return `
        <div class="col-span-full bg-gradient-to-br from-slate-900 to-indigo-900 text-white rounded-2xl p-8 text-center shadow-lg my-2">
            <div class="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i data-lucide="lock" class="w-6 h-6"></i>
            </div>
            <h3 class="font-bold text-lg mb-2">${authL(lockedCount + ' more in the full version', 'Ещё ' + lockedCount + ' ' + sectionLabel + ' в полной версии')}</h3>
            <p class="text-sm text-white/70 mb-6 max-w-sm mx-auto">${authGuestOffer()}</p>
            <a href="${AUTH_FULL_ACCESS_URL}" target="_blank" rel="noopener" class="inline-flex items-center justify-center bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition">
                ${authL('Get full access', 'Получить полный доступ')}
            </a>
        </div>
    `;
}


// ==========================================
// САМОЗАПУСК блокировки ссылок.
//
// Раньше замки вешались только изнутри requireAuth(), поэтому страницы,
// которые делают проверку сессии по-своему (vocabulary.html,
// irregular-verbs.html и т.п.), оставляли все ссылки на закрытые секции
// рабочими — именно так ученики и попадали в Writing/Speaking.
//
// Теперь auth.js сам, при подключении к ЛЮБОЙ странице, догружает профиль
// и гасит недоступные ссылки. Профиль кэшируется, чтобы не дублировать
// запрос там, где requireAuth() уже отработал.
// ==========================================
// getCachedProfile() оставлен для совместимости (его вызывает nav.js),
// теперь он берёт профиль из той же единой проверки.
async function getCachedProfile() {
    try {
        const access = await authLoadAccess();
        return access.profile || null;
    } catch (err) {
        console.error('Не удалось получить профиль для блокировки ссылок:', err);
        return null;
    }
}

(async function autoLockSectionLinks() {
    // На странице логина блокировать нечего
    const here = authFileName();
    if (here === 'login.html' || here === 'register.html' || here === 'guest.html') return;

    const profile = await getCachedProfile();
    if (!profile) return;
    if (profile.role === 'teacher') return;   // учителю доступно всё

    // Статьи, которых нет в PAGE_SECTIONS, не прячутся до проверки (у ученицы
    // они открываются сразу). Гостю закрытую статью закрываем, как только узнали роль.
    if (profile.role === 'guest' && !AUTH_GATED && authGuestLockedFile(here)) { authShowGuestLocked(); return; }

    applySectionLocks(profile);               // гостю — замки статей и полоска «бесплатная версия»
})();
