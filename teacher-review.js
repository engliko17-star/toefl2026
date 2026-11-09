// =====================================================================
// teacher-review.js — разбор попытки ученицы, открытый из её профиля.
//
// Профиль (student-profile.html) ссылается на разбор так:
//   take-mock-test.html?id=<тест>&mode=review&attempt=<id попытки>&back=student-profile.html?id=…&tab=stats
//   mock-test-view.html?id=<тест>&review=true&attempt=<id попытки>&back=…
//   tests.html?review=reading|listening&test=<тест>&attempt=<id попытки>&back=…
// Страница разбора берёт попытку по attempt (а не «последнюю свою»), а кнопки
// под результатом ([data-review-actions]) заменяются на «Назад к ученице».
// Чужие попытки база отдаёт только преподавателю; ученица по такой ссылке
// увидит только свою попытку.
// =====================================================================
(function () {
    'use strict';
    const p = new URLSearchParams(location.search);
    const attempt = p.get('attempt');
    let back = p.get('back');
    if (back && !/^[a-z0-9_.-]+\.html(\?[^\s]*)?$/i.test(back)) back = null;   // только своя страница
    const studentId = back ? new URLSearchParams(back.split('?')[1] || '').get('id') : null;
    const ru = (() => { try { return (window.I18N && window.I18N.lang) || localStorage.getItem('appLang') || 'ru'; } catch (e) { return 'ru'; } })() !== 'en';
    const L = (en, r) => (ru ? r : en);
    let name = null;

    const TR = {
        on: !!attempt,
        attempt,
        back,
        exit() { location.href = back || 'index.html'; }
    };
    window.TeacherReview = TR;
    if (!TR.on) return;

    const esc = s => String(s === null || s === undefined ? '' : s)
        .replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    function actionsHtml() {
        return `<div style="display:flex;flex-direction:column;align-items:center;gap:10px;width:100%">
                ${name ? `<p style="margin:0;font-size:13px;color:#64748b">${esc(L('Answers of', 'Ответы ученицы'))} <b style="color:#0f172a">${esc(name)}</b></p>` : ''}
                <a href="${esc(back || 'index.html')}" style="display:inline-flex;align-items:center;gap:8px;padding:11px 22px;border-radius:12px;background:#0f172a;color:#fff;font-size:13px;font-weight:700;text-decoration:none">
                    ← ${esc(back && back.startsWith('student-profile') ? L('Back to the student', 'Назад к ученице') : L('Back', 'Назад'))}
                </a>
            </div>`;
    }

    // Кнопки «Try Again / Retake / Dashboard» под результатом → «Назад к ученице»
    function swap(root) {
        (root || document).querySelectorAll('[data-review-actions]').forEach(el => {
            if (el.getAttribute('data-review-swapped') === String(!!name)) return;
            el.setAttribute('data-review-swapped', String(!!name));
            el.innerHTML = actionsHtml();
        });
    }
    function watch() {
        swap();
        new MutationObserver(() => swap()).observe(document.body, { childList: true, subtree: true });
    }
    if (document.body) watch(); else document.addEventListener('DOMContentLoaded', watch);

    // Имя ученицы — для подписи (преподавателю профиль ученицы доступен)
    async function loadName() {
        if (!studentId) return;
        for (let i = 0; i < 40 && !(window.supabaseClient || typeof _supabase !== 'undefined'); i++) await new Promise(r => setTimeout(r, 100));
        const client = window.supabaseClient || (typeof _supabase !== 'undefined' ? _supabase : null);
        if (!client) return;
        try {
            const { data } = await client.from('profiles').select('full_name, email').eq('id', studentId).maybeSingle();
            if (data) { name = data.full_name || data.email || null; if (document.body) swap(); }
        } catch (e) { /* без имени */ }
    }
    loadName();
})();
