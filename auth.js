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
