// Ключи. Имена намеренно с префиксом AUTH_: почти каждая страница
// объявляет свои SUPABASE_URL/SUPABASE_ANON_KEY, а два одинаковых const
// в глобальной области роняют ВЕСЬ скрипт страницы (SyntaxError).
// С префиксом auth.js можно подключать куда угодно, ничего не ломая.
const AUTH_SB_URL = 'https://gmsdixqjhlycovsgwbzq.supabase.co';
const AUTH_SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdtc2RpeHFqaGx5Y292c2d3YnpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NTEwODIsImV4cCI6MjA5NTAyNzA4Mn0.gPEOviqSGTuczqoSHvb_BX4mBSdxjh8Bg6BV13l58LQ';

// Создаем единый клиент для работы с базой
// window.supabase — явно, чтобы не подхватить одноимённую переменную страницы
const _supabase = window.supabase.createClient(AUTH_SB_URL, AUTH_SB_KEY);

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

    // --- Listening ---
    'listening.html':       'listening',
    'practice-view.html':   'listening',
    'choose-response-test.html':    'listening',
    'mock-test-view.html':  'listening',

    // --- Writing ---
    'writing.html': 'writing',
    'task-list.html':       'writing',
    'writing-practice.html':'writing',
    'mini-mock-writing.html':       'writing',
    'mini-mock-results.html':       'writing',

    // --- Speaking ---
    'speaking.html':    'speaking',
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

// Функция контроля доступа
async function requireAuth() {
    // Спрашиваем у Supabase, есть ли активная сессия в браузере
    const { data: { session }, error } = await _supabase.auth.getSession();
    
    // Если сессии нет — принудительно отправляем на страницу входа
    if (!session) {
        window.location.href = 'login.html';
        return null;
    }
    
    // Получаем профиль текущего пользователя
    const { data: profile } = await _supabase
        .from('profiles')
        .select('role, is_approved, access_reading, access_listening, access_speaking, access_writing, access_tests')
        .eq('id', session.user.id)
        .maybeSingle();

    const isTeacher = profile && profile.role === 'teacher';
    const isGuest = profile && profile.role === 'guest';

    // 0. Гость: пропускаем проверку is_approved (гость подтверждается сразу
    // при регистрации на guest.html) и разрешаем ему только tests.html —
    // с любой другой страницы сразу уводим обратно. (Демо-режим "гулять по
    // всем разделам" пока отложен — когда будем его доделывать, здесь нужно
    // будет заменить на блок-лист вместо allow-листа из одной страницы.)
    if (isGuest) {
        const currentPath = window.location.pathname;
        if (!currentPath.includes('tests.html')) {
            window.location.href = 'tests.html';
            return null;
        }
        return {
            ...session.user,
            role: 'guest',
            profile: profile
        };
    }

    // 1. Проверка подтверждения аккаунта (ТОЛЬКО ДЛЯ УЧЕНИКОВ)
    if (!isTeacher && (!profile || !profile.is_approved)) {
        document.body.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                z-index: 99999;
                display: flex; 
                flex-direction: column; 
                align-items: center; 
                justify-content: center; 
                margin: 0; 
                padding: 20px; 
                box-sizing: border-box; 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                text-align: center; 
                background-color: #f9f9f9;
            ">
                <div style="font-size: 64px; margin-bottom: 16px;">⏳</div>
                <h2 style="margin: 0 0 12px 0; color: #1a1a1a; font-size: 22px; font-weight: 700;">Аккаунт на проверке</h2>
                <p style="margin: 0 0 32px 0; color: #666; font-size: 14px; max-width: 280px; line-height: 1.5;">
                    Доступ к платформе TOEFL появится сразу после подтверждения преподавателем. Обычно это занимает совсем немного времени!
                </p>
                <button onclick="logoutUser()" style="
                    padding: 14px 28px; 
                    font-size: 14px; 
                    font-weight: 600; 
                    color: #fff; 
                    background-color: #000; 
                    border: none; 
                    border-radius: 12px; 
                    cursor: pointer;
                    width: 100%;
                    max-width: 200px;
                    transition: background-color 0.2s;
                ">Выйти из аккаунта</button>
            </div>
        `;
        return null;
    }

    const currentPath = window.location.pathname;

    // 2. Ученикам запрещен доступ в кабинет преподавателя
    if (currentPath.includes('teacher-board.html') && !isTeacher) {
        window.location.href = 'index.html';
        return null;
    }

    // 3. Точечные проверки модулей (ТОЛЬКО ДЛЯ УЧЕНИКОВ)
    if (!isTeacher) {
        let hasSectionAccess = true;
        let sectionName = '';

        // ВАЖНО: раньше проверялись только пять страниц-хабов
        // (reading/listening/speaking/writing/tests.html), а весь реальный
        // контент лежит на других файлах — и они были открыты любому
        // ученику по прямой ссылке, даже с закрытым доступом к секции.
        // Теперь проверяется каждая страница по имени файла.
        //
        // ЕСЛИ ДОБАВЛЯЕТЕ НОВУЮ СТРАНИЦУ С ЗАДАНИЯМИ — впишите её сюда,
        // иначе она окажется доступна всем.
        // Берём именно имя файла, а не подстроку всего пути —
        // includes() ловил бы лишнее и пропускал нужное.
        const fileName = (currentPath.split('/').pop() || '').toLowerCase();
        const section = PAGE_SECTIONS[fileName];

        if (section) {
            const rule = ACCESS_FIELD[section];
            hasSectionAccess = profile[rule.field];
            sectionName = rule.label;
        }

        if (!hasSectionAccess) {
            document.body.innerHTML = `
                <div style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    z-index: 99999;
                    display: flex; 
                    flex-direction: column; 
                    align-items: center; 
                    justify-content: center; 
                    margin: 0; 
                    padding: 20px; 
                    box-sizing: border-box; 
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                    text-align: center; 
                    background-color: #f9f9f9;
                ">
                    <div style="font-size: 64px; margin-bottom: 16px;">🔒</div>
                    <h2 style="margin: 0 0 12px 0; color: #1a1a1a; font-size: 22px; font-weight: 700;">Раздел закрыт</h2>
                    <p style="margin: 0 0 32px 0; color: #666; font-size: 14px; max-width: 280px; line-height: 1.5;">
                        Доступ к разделу <strong>${sectionName}</strong> пока не активирован преподавателем. Вы можете продолжить работу в других открытых вкладках.
                    </p>
                    <a href="index.html" style="
                        display: inline-block;
                        text-decoration: none;
                        text-align: center;
                        padding: 14px 28px; 
                        font-size: 14px; 
                        font-weight: 600; 
                        color: #fff; 
                        background-color: #000; 
                        border: none; 
                        border-radius: 12px; 
                        cursor: pointer;
                        width: 100%;
                        max-width: 200px;
                        box-sizing: border-box;
                        transition: background-color 0.2s;
                    ">На главную</a>
                </div>
            `;
            return null;
        }
    }
    
    // Гасим ссылки на закрытые секции на этой странице
    applySectionLocks(profile);

    // Если всё хорошо — возвращаем объект юзера
    return {
        ...session.user,
        role: profile ? profile.role : 'student',
        profile: profile
    };
}

// ==========================================
// Блокировка ссылок на закрытые секции.
// Вызывается автоматически из requireAuth() на КАЖДОЙ странице, поэтому
// закрывает разом все входы: боковое меню, карточки на дашборде, нижнее
// меню на телефоне и любые другие ссылки — без правок самих страниц.
// ==========================================
function applySectionLocks(profile) {
    if (!profile) return;

    const run = () => {
        document.querySelectorAll('a[href]').forEach(link => {
            const href = link.getAttribute('href') || '';
            if (!href || href.startsWith('#') || href.startsWith('http')) return;

            const file = (href.split('?')[0].split('/').pop() || '').toLowerCase();
            const section = PAGE_SECTIONS[file];
            if (!section) return;

            const rule = ACCESS_FIELD[section];
            if (profile[rule.field]) return; // доступ есть — не трогаем

            // Доступа нет: гасим ссылку и вешаем замок
            link.style.opacity = '0.4';
            link.style.cursor = 'not-allowed';
            link.setAttribute('aria-disabled', 'true');
            link.setAttribute('title', 'Раздел ' + rule.label + ' пока не открыт преподавателем');

            if (!link.querySelector('.section-lock-badge')) {
                const badge = document.createElement('span');
                badge.className = 'section-lock-badge';
                badge.textContent = ' 🔒';
                badge.style.fontSize = '11px';
                link.appendChild(badge);
            }

            link.addEventListener('click', e => {
                e.preventDefault();
                e.stopPropagation();
                alert('Раздел «' + rule.label + '» пока не открыт преподавателем.');
            }, true);
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run);
    } else {
        run();
    }
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
let _cachedProfile = null;

async function getCachedProfile() {
    if (_cachedProfile) return _cachedProfile;
    try {
        const { data: { session } } = await _supabase.auth.getSession();
        if (!session) return null;
        const { data } = await _supabase
            .from('profiles')
            .select('role, is_approved, access_reading, access_listening, access_speaking, access_writing, access_tests')
            .eq('id', session.user.id)
            .maybeSingle();
        _cachedProfile = data || null;
        return _cachedProfile;
    } catch (err) {
        console.error('Не удалось получить профиль для блокировки ссылок:', err);
        return null;
    }
}

(async function autoLockSectionLinks() {
    // На странице логина блокировать нечего
    const here = (window.location.pathname.split('/').pop() || '').toLowerCase();
    if (here === 'login.html' || here === 'register.html') return;

    const profile = await getCachedProfile();
    if (!profile) return;
    if (profile.role === 'teacher') return;   // учителю доступно всё
    if (profile.role === 'guest') return;     // у гостя свои правила

    applySectionLocks(profile);
})();
