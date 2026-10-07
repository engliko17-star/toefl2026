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

const AUTH_TEACHER_ONLY = ['teacher-board.html', 'student-profile.html', 'content-lab.html', 'mock-lab.html'];
const AUTH_PROFILE_COLS = 'role,is_approved,access_reading,access_listening,access_speaking,access_writing,access_tests';
const AUTH_STORAGE_KEY = 'sb-' + new URL(AUTH_SB_URL).hostname.split('.')[0] + '-auth-token';
const AUTH_TIMEOUT_MS = 8000;      // на один запрос
const AUTH_GATE_LIMIT_MS = 15000;  // на всю проверку: дольше — экран ошибки

function authFileName() {
    return (window.location.pathname.split('/').pop() || '').toLowerCase();
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
    const path = window.location.pathname;
    const isTeacher = profile && profile.role === 'teacher';
    const isGuest = profile && profile.role === 'guest';

    // Гость: только tests.html (демо-режим «гулять по разделам» отложен)
    if (isGuest) return path.includes('tests.html') ? { kind: 'allow' } : { kind: 'redirect', to: 'tests.html' };

    // Ученик без подтверждения преподавателем
    if (!isTeacher && (!profile || !profile.is_approved)) return { kind: 'pending' };

    // Страницы преподавателя
    if (AUTH_TEACHER_ONLY.some(p => path.includes(p)) && !isTeacher) return { kind: 'redirect', to: 'index.html' };

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
const AUTH_GATED = !!PAGE_SECTIONS[authFileName()] || AUTH_TEACHER_ONLY.some(p => window.location.pathname.includes(p));

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
        authReveal();
    });
}

const AUTH_SCREEN_STYLE = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;margin:0;padding:20px;box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif;text-align:center;background-color:#f9f9f9;';
const AUTH_BTN_STYLE = 'display:inline-block;text-decoration:none;text-align:center;padding:14px 28px;font-size:14px;font-weight:600;color:#fff;background-color:#000;border:none;border-radius:12px;cursor:pointer;width:100%;max-width:200px;box-sizing:border-box;';

function authShowPending() {
    authScreen(`
        <div style="${AUTH_SCREEN_STYLE}">
            <div style="font-size:64px;margin-bottom:16px;">⏳</div>
            <h2 style="margin:0 0 12px 0;color:#1a1a1a;font-size:22px;font-weight:700;">Аккаунт на проверке</h2>
            <p style="margin:0 0 32px 0;color:#666;font-size:14px;max-width:280px;line-height:1.5;">
                Доступ к платформе TOEFL появится сразу после подтверждения преподавателем. Обычно это занимает совсем немного времени!
            </p>
            <button onclick="logoutUser()" style="${AUTH_BTN_STYLE}">Выйти из аккаунта</button>
        </div>`);
}

function authShowBlocked(sectionName) {
    authScreen(`
        <div style="${AUTH_SCREEN_STYLE}">
            <div style="font-size:64px;margin-bottom:16px;">🔒</div>
            <h2 style="margin:0 0 12px 0;color:#1a1a1a;font-size:22px;font-weight:700;">Раздел закрыт</h2>
            <p style="margin:0 0 32px 0;color:#666;font-size:14px;max-width:280px;line-height:1.5;">
                Доступ к разделу <strong>${sectionName}</strong> пока не активирован преподавателем. Вы можете продолжить работу в других открытых вкладках.
            </p>
            <a href="index.html" style="${AUTH_BTN_STYLE}">На главную</a>
        </div>`);
}

function authShowError() {
    authScreen(`
        <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;font-family:'Plus Jakarta Sans',sans-serif;background:#f8f9fa;padding:24px;">
            <div style="max-width:420px;text-align:center;background:#fff;padding:32px;border-radius:24px;border:1px solid #f0f0f0;">
                <h2 style="margin:0 0 12px;font-size:20px;font-weight:700;color:#1a1a1a;">Не удалось проверить доступ</h2>
                <p style="margin:0 0 20px;color:#666;font-size:14px;line-height:1.5;">
                    Связь с базой прервалась. Это не значит, что с аккаунтом что-то не так — просто попробуйте ещё раз.
                </p>
                <button onclick="location.reload()" style="background:#0f172a;color:#fff;border:0;padding:12px 24px;border-radius:12px;font-weight:700;font-size:14px;cursor:pointer;">
                    Обновить страницу
                </button>
            </div>
        </div>`);
}

// Применить решение. Возвращает true, если страницу можно показывать.
function authApply(decision) {
    if (decision.kind === 'redirect') { window.location.href = decision.to; return false; }
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
        w.textContent = 'Проверяем доступ…';
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
    const file = (href.split('?')[0].split('#')[0].split('/').pop() || '').toLowerCase();
    const section = PAGE_SECTIONS[file];
    if (!section) return null;
    const rule = ACCESS_FIELD[section];
    return _authLockProfile[rule.field] ? null : rule;
}

function authDecorateLink(link) {
    const rule = authLockRule(link.getAttribute('href') || '');
    if (!rule || link.querySelector('.section-lock-badge')) return;
    link.style.opacity = '0.4';
    link.style.cursor = 'not-allowed';
    link.setAttribute('aria-disabled', 'true');
    link.setAttribute('title', 'Раздел ' + rule.label + ' пока не открыт преподавателем');
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
    if (!profile || profile.role === 'teacher' || profile.role === 'guest') return;
    _authLockProfile = profile;

    if (!applySectionLocks._installed) {
        applySectionLocks._installed = true;

        document.addEventListener('click', e => {
            const link = e.target && e.target.closest ? e.target.closest('a[href]') : null;
            if (!link) return;
            const rule = authLockRule(link.getAttribute('href') || '');
            if (!rule) return;
            e.preventDefault();
            e.stopPropagation();
            alert('Раздел «' + rule.label + '» пока не открыт преподавателем.');
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
            <h3 class="font-bold text-lg mb-2">Ещё ${lockedCount} ${sectionLabel} по подписке</h3>
            <p class="text-sm text-white/70 mb-6 max-w-sm mx-auto">Вы попробовали демо-версию платформы. Оформите подписку, чтобы открыть весь материал.</p>
            <a href="https://t.me/" target="_blank" class="inline-flex items-center justify-center bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition">
                Оформить подписку
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
    if (profile.role === 'guest') return;     // у гостя свои правила

    applySectionLocks(profile);
})();
