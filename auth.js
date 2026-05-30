// Подключаем ключи от твоего проекта Supabase
const SUPABASE_URL = 'https://gmsdixqjhlycovsgwbzq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdtc2RpeHFqaGx5Y292c2d3YnpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NTEwODIsImV4cCI6MjA5NTAyNzA4Mn0.gPEOviqSGTuczqoSHvb_BX4mBSdxjh8Bg6BV13l58LQ';

// Создаем единый клиент для работы с базой
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Эта функция будет стоять охранником на страницах с тестами
async function requireAuth() {
    // Спрашиваем у Supabase, есть ли активная сессия в браузере
    const { data: { session }, error } = await _supabase.auth.getSession();
    
    // Если сессии нет — принудительно отправляем на страницу входа
    if (!session) {
        window.location.href = 'login.html';
        return null;
    }
    
    // Если все ок — возвращаем данные пользователя (включая его user.id)
    return session.user;
}

// Функция для выхода из аккаунта
async function logoutUser() {
    await _supabase.auth.signOut();
    window.location.href = 'login.html';
}

