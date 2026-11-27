// =====================================================================
// vocab-sw.js — service worker приложения T-Vocab (vocabulary.html).
//
// Только push-напоминания: «слова ждут повторения», «пора выучить новые».
// Страницы НЕ кэширует и запросы не перехватывает (обработчика fetch нет),
// поэтому на работу сайта не влияет.
//
// Уведомления отправляет функция Supabase vocab-push (раз в день, в час,
// который ученица выбрала в настройках). Содержимое push — JSON:
//   { title, body, url, tag }
// =====================================================================
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

self.addEventListener('push', event => {
    let data = {};
    try { data = event.data ? event.data.json() : {}; } catch (e) {
        data = { body: event.data ? event.data.text() : '' };
    }
    const title = data.title || 'T-Vocab';
    const options = {
        body: data.body || 'Пора позаниматься словами',
        icon: 'vocab-icon-192.png',
        badge: 'vocab-icon-192.png',
        tag: data.tag || 'vocab-reminder',     // новое напоминание заменяет старое, а не копится
        renotify: true,
        data: { url: data.url || 'vocabulary.html#home' }
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    const target = new URL((event.notification.data && event.notification.data.url) || 'vocabulary.html#home', self.registration.scope).href;
    event.waitUntil((async () => {
        const list = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
        // Приложение уже открыто — переключаемся на него, иначе открываем новое окно
        for (const c of list) {
            if (c.url.includes('vocabulary.html') && 'focus' in c) {
                try { await c.navigate(target); } catch (e) { /* в некоторых браузерах navigate недоступен */ }
                return c.focus();
            }
        }
        return self.clients.openWindow(target);
    })());
});
