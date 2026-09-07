// Подключаем ключи от твоего проекта Supabase
const SUPABASE_URL = 'https://gmsdixqjhlycovsgwbzq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdtc2RpeHFqaGx5Y292c2d3YnpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NTEwODIsImV4cCI6MjA5NTAyNzA4Mn0.gPEOviqSGTuczqoSHvb_BX4mBSdxjh8Bg6BV13l58LQ';

// Создаем единый клиент для работы с базой
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
    // при регистрации на guest.html) и пускаем его гулять по демо-режиму —
    // на все страницы практики, но не на учительские инструменты. Сами
    // ограничения "сколько заданий видно" применяются на каждой странице
    // отдельно через applyGuestDemoLimit()/renderGuestLockedCard().
    if (isGuest) {
        const currentPath = window.location.pathname;
        const blockedForGuest = ['teacher-board.html', 'student-profile.html'];
        if (blockedForGuest.some(p => currentPath.includes(p))) {
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

        if (currentPath.includes('reading.html')) {
            hasSectionAccess = profile.access_reading;
            sectionName = 'Reading';
        } else if (currentPath.includes('listening.html')) {
            hasSectionAccess = profile.access_listening;
            sectionName = 'Listening';
        } else if (currentPath.includes('speaking.html')) {
            hasSectionAccess = profile.access_speaking;
            sectionName = 'Speaking';
        } else if (currentPath.includes('writing.html')) {
            hasSectionAccess = profile.access_writing;
            sectionName = 'Writing';
        } else if (currentPath.includes('tests.html')) {
            hasSectionAccess = profile.access_tests;
            sectionName = 'Mock Tests';
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
    
    // Если всё хорошо — возвращаем объект юзера
    return {
        ...session.user,
        role: profile ? profile.role : 'student',
        profile: profile
    };
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
