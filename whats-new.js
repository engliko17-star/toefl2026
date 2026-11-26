// =====================================================================
// whats-new.js — окно «Что нового на платформе» для учениц.
//
// Подключается сам из auth.js на всех страницах. Новости пишет преподаватель
// во вкладке «Что нового» панели преподавателя (news-admin.js), они лежат
// в таблице platform_news, картинки — в хранилище Supabase (bucket news).
//
// Когда показываем: ученица открыла любую страницу платформы, кроме входа,
// страниц преподавателя и экранов заданий/экзаменов (см. SKIP). Берём
// опубликованные новости, которых она ещё не видела (RPC news_unseen),
// показываем карточками; после закрытия отмечаем как прочитанные
// (RPC news_mark_seen) — на любом устройстве окно больше не появится.
//
// API: WhatsNew.open() — показать последние новости ещё раз (например,
// из пункта меню); WhatsNew.preview(item) — предпросмотр для преподавателя.
// =====================================================================
(function () {
    'use strict';
    if (window.WhatsNew) return;

    const file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    // Где окно само НЕ всплывает: вход, страницы преподавателя, задания и экзамены
    // (чтобы не мешать посреди работы с таймером), повторение слов.
    const SKIP = /^(login|guest|teacher-board|student-profile|content-lab|exam-reports|mock-lab|listening-import|speaking-import|ge-builder|ge-students)\.html$|task|player|mock|test|practice|interview|listen_repeat|listen-repeat|review|lesson\.html$/;
    const autoShow = !SKIP.test(file);

    const RU = (function () { try { return localStorage.getItem('appLang') !== 'en'; } catch (e) { return true; } })();
    const T = RU
        ? { head: 'Что нового', next: 'Дальше', back: 'Назад', done: 'Понятно', close: 'Закрыть', open: 'Открыть' }
        : { head: "What's new", next: 'Next', back: 'Back', done: 'Got it', close: 'Close', open: 'Open' };

    const db = () => window.supabaseClient || null;
    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    // Простое оформление текста: пустая строка — новый абзац, «- » или «• » — пункт
    // списка, **жирный**. Всё остальное выводится как обычный текст.
    function formatBody(text) {
        const inline = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
        const blocks = String(text || '').replace(/\r/g, '').split(/\n{2,}/);
        return blocks.map(b => {
            const lines = b.split('\n').filter(l => l.trim() !== '');
            if (!lines.length) return '';
            if (lines.every(l => /^\s*[-•]\s+/.test(l))) {
                return '<ul>' + lines.map(l => '<li>' + inline(l.replace(/^\s*[-•]\s+/, '')) + '</li>').join('') + '</ul>';
            }
            return '<p>' + lines.map(inline).join('<br>') + '</p>';
        }).join('');
    }

    const CSS = `
.wn-back{position:fixed;inset:0;z-index:2147483000;background:rgba(15,23,42,.55);display:flex;align-items:center;justify-content:center;padding:16px;opacity:0;transition:opacity .2s;font-family:Inter,'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif}
.wn-back.wn-in{opacity:1}
.wn-card{position:relative;width:100%;max-width:460px;max-height:calc(100vh - 32px);max-height:calc(100dvh - 32px);background:#fff;color:#0f172a;border-radius:22px;box-shadow:0 24px 60px rgba(15,23,42,.28);display:flex;flex-direction:column;overflow:hidden;transform:translateY(12px) scale(.98);transition:transform .25s}
.wn-in .wn-card{transform:none}
.wn-top{display:flex;align-items:center;justify-content:space-between;padding:14px 16px 10px 20px}
.wn-head{font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#4f46e5;display:flex;align-items:center;gap:8px}
.wn-head span{display:inline-block;width:8px;height:8px;border-radius:50%;background:#4f46e5;box-shadow:0 0 0 4px rgba(79,70,229,.15)}
.wn-x{width:34px;height:34px;border:0;border-radius:50%;background:#f1f5f9;color:#475569;font-size:20px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center}
.wn-x:hover{background:#e2e8f0}
.wn-scroll{overflow-y:auto;-webkit-overflow-scrolling:touch;flex:1}
.wn-img{display:block;width:100%;max-height:300px;object-fit:cover;background:#f1f5f9}
.wn-body{padding:18px 22px 6px}
.wn-date{font-size:12px;color:#94a3b8;font-weight:600;margin-bottom:6px}
.wn-title{font-size:21px;line-height:1.25;font-weight:800;margin:0 0 10px;color:#0f172a}
.wn-text{font-size:15px;line-height:1.6;color:#334155}
.wn-text p{margin:0 0 10px}
.wn-text ul{margin:0 0 10px;padding-left:20px;list-style:disc}
.wn-text li{margin:0 0 4px;display:list-item}
.wn-text b{color:#0f172a}
.wn-cta{display:inline-flex;align-items:center;gap:6px;margin:6px 0 10px;padding:10px 16px;border-radius:12px;background:#eef2ff;color:#4338ca;font-weight:700;font-size:14px;text-decoration:none}
.wn-cta:hover{background:#e0e7ff}
.wn-foot{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 16px 16px 20px;border-top:1px solid #f1f5f9}
.wn-dots{display:flex;gap:6px}
.wn-dots i{width:7px;height:7px;border-radius:50%;background:#cbd5e1;transition:all .2s}
.wn-dots i.on{width:20px;border-radius:4px;background:#4f46e5}
.wn-btns{display:flex;gap:8px;margin-left:auto}
.wn-btn{border:0;border-radius:12px;padding:11px 18px;font-weight:800;font-size:14px;cursor:pointer;font-family:inherit}
.wn-btn.wn-main{background:#4f46e5;color:#fff}
.wn-btn.wn-main:hover{background:#4338ca}
.wn-btn.wn-ghost{background:#f1f5f9;color:#334155}
@media (max-width:520px){
  .wn-back{align-items:flex-end;padding:0}
  .wn-card{max-width:none;border-radius:22px 22px 0 0;max-height:92vh;max-height:92dvh;transform:translateY(40px)}
  .wn-foot{padding-bottom:calc(16px + env(safe-area-inset-bottom))}
}
/* тёмная тема приложения T-Vocab */
  html[data-theme="dark"] .wn-card{background:#171a23;color:#e5e7eb}
  html[data-theme="dark"] .wn-title,html[data-theme="dark"] .wn-text b{color:#f8fafc}
  html[data-theme="dark"] .wn-text{color:#cbd5e1}
  html[data-theme="dark"] .wn-x,html[data-theme="dark"] .wn-btn.wn-ghost{background:#262a36;color:#cbd5e1}
  html[data-theme="dark"] .wn-foot{border-color:#262a36}
  html[data-theme="dark"] .wn-cta{background:#262a49;color:#c7d2fe}`;

    function fmtDate(iso) {
        if (!iso) return '';
        try { return new Date(iso).toLocaleDateString(RU ? 'ru-RU' : 'en-US', { day: 'numeric', month: 'long' }); } catch (e) { return ''; }
    }

    let open = null;   // текущее окно

    function show(items, opts) {
        opts = opts || {};
        if (!items || !items.length || open) return;
        if (!document.getElementById('wn-style')) {
            const st = document.createElement('style'); st.id = 'wn-style'; st.textContent = CSS; document.head.appendChild(st);
        }
        let i = 0;
        const back = document.createElement('div');
        back.className = 'wn-back';
        back.setAttribute('role', 'dialog');
        back.setAttribute('aria-modal', 'true');
        back.setAttribute('aria-label', T.head);
        back.innerHTML = `<div class="wn-card">
            <div class="wn-top"><div class="wn-head"><span></span>${esc(T.head)}</div><button type="button" class="wn-x" aria-label="${esc(T.close)}">×</button></div>
            <div class="wn-scroll"></div>
            <div class="wn-foot"><div class="wn-dots"></div><div class="wn-btns"></div></div></div>`;
        const scroll = back.querySelector('.wn-scroll'), dots = back.querySelector('.wn-dots'), btns = back.querySelector('.wn-btns');

        function render() {
            const n = items[i];
            scroll.innerHTML = `${n.image_url ? `<img class="wn-img" src="${esc(n.image_url)}" alt="">` : ''}
                <div class="wn-body">
                    ${n.published_at ? `<div class="wn-date">${esc(fmtDate(n.published_at))}</div>` : ''}
                    <h2 class="wn-title">${esc(n.title)}</h2>
                    <div class="wn-text">${formatBody(n.body)}</div>
                    ${n.button_url ? `<a class="wn-cta" href="${esc(n.button_url)}">${esc(n.button_label || T.open)} →</a>` : ''}
                </div>`;
            scroll.scrollTop = 0;
            dots.innerHTML = items.length > 1 ? items.map((_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('') : '';
            const last = i === items.length - 1;
            btns.innerHTML = (i > 0 ? `<button type="button" class="wn-btn wn-ghost" data-wn="back">${esc(T.back)}</button>` : '')
                + `<button type="button" class="wn-btn wn-main" data-wn="${last ? 'done' : 'next'}">${esc(last ? T.done : T.next)}</button>`;
        }
        function close() {
            back.classList.remove('wn-in');
            document.removeEventListener('keydown', onKey);
            setTimeout(() => back.remove(), 200);
            open = null;
            if (opts.onClose) opts.onClose();
        }
        function onKey(e) {
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowRight' && i < items.length - 1) { i++; render(); }
            if (e.key === 'ArrowLeft' && i > 0) { i--; render(); }
        }
        back.addEventListener('click', e => {
            if (e.target === back || e.target.closest('.wn-x')) return close();
            const b = e.target.closest('[data-wn]');
            if (!b) return;
            if (b.dataset.wn === 'next') { i++; render(); }
            else if (b.dataset.wn === 'back') { i--; render(); }
            else close();
        });
        // Переход по кнопке «Открыть» — тоже значит «прочитано»
        back.addEventListener('click', e => { if (e.target.closest('.wn-cta') && opts.onClose) { opts.onClose(); opts.onClose = null; } });
        document.addEventListener('keydown', onKey);
        render();
        document.body.appendChild(back);
        requestAnimationFrame(() => requestAnimationFrame(() => back.classList.add('wn-in')));
        open = back;
        const main = back.querySelector('.wn-main'); if (main) try { main.focus({ preventScroll: true }); } catch (e) { /* */ }
    }

    async function session() {
        const c = db(); if (!c) return null;
        try { const { data } = await c.auth.getSession(); return data && data.session ? data.session.user : null; } catch (e) { return null; }
    }

    async function autoCheck() {
        const user = await session();
        if (!user) return;
        const c = db();
        const { data, error } = await c.rpc('news_unseen');
        if (error) { if (!/news_unseen|function|schema cache/i.test(error.message || '')) console.warn('Что нового:', error.message); return; }
        const items = (data || []).filter(n => n && n.title);
        if (!items.length) return;
        const until = items.reduce((m, n) => (n.published_at > m ? n.published_at : m), items[0].published_at);
        let marked = false;
        show(items, {
            onClose: () => {
                if (marked) return; marked = true;
                c.rpc('news_mark_seen', { p_until: until }).then(r => { if (r.error) console.warn('Что нового:', r.error.message); });
            }
        });
    }

    window.WhatsNew = {
        // Показать последние опубликованные новости ещё раз
        open: async function (limit) {
            const c = db(); if (!c) return;
            const { data } = await c.from('platform_news').select('*').eq('is_published', true)
                .order('published_at', { ascending: false }).limit(limit || 5);
            show(data || []);
        },
        // Предпросмотр для преподавателя (ничего не отмечает)
        preview: function (item) { show(Array.isArray(item) ? item : [item]); },
        format: formatBody
    };

    if (autoShow) {
        const start = () => setTimeout(() => { autoCheck().catch(e => console.warn('Что нового:', e)); }, 900);
        if (document.readyState === 'complete') start(); else window.addEventListener('load', start);
    }
})();
