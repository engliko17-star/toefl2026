// =====================================================================
// task-marks.js — личные закладки ученика на заданиях («вернуться позже»).
//
// Идея ученика: «сделал задание с ошибками, хочу перерешать позже, но если
// перерешаю сразу — будет 100%, и я его потеряю». Закладка не зависит от
// результата: отмеченное задание остаётся отмеченным, пока ученик сам не снимет.
//
// Где хранится:
//   • таблица task_marks в Supabase (task_marks.sql) — видно с любого устройства;
//   • копия в localStorage — работает сразу и если таблицы ещё нет.
//
// На странице:
//   await TaskMarks.init(user);                 // загрузить закладки ученика
//   TaskMarks.button('daily', 12)               // html кнопки-закладки для карточки
//   TaskMarks.headerButton('daily', 12, el)     // кнопка рядом с заголовком задания
//   TaskMarks.has('daily', 12)                  // отмечено ли
//   TaskMarks.onChange(fn)                      // вызвать fn после любого изменения
//   TaskMarks.paint(root)                       // обновить вид всех кнопок внутри root
// Клик по любой кнопке [data-task-mark] переключает закладку (обработчик общий).
// Если файл не загрузился, страницы работают как раньше, без закладок.
// =====================================================================
(function () {
    'use strict';

    const TABLE = 'task_marks';
    let uid = 'anon';
    let marks = new Set();          // ключи «тип:id»
    let remote = false;             // таблица в базе доступна
    const listeners = [];
    let ready = null;

    const key = (type, id) => String(type) + ':' + String(id);
    const L = (en, ru) => (typeof authL === 'function' ? authL(en, ru) : ru);
    const lsKey = () => 'taskMarks:v1:' + uid;

    function db() {
        if (typeof supabaseClient !== 'undefined' && supabaseClient) return supabaseClient;
        return window.supabaseClient || null;
    }
    function loadLocal() {
        try { return new Set(JSON.parse(localStorage.getItem(lsKey()) || '[]')); } catch (e) { return new Set(); }
    }
    function saveLocal() {
        try { localStorage.setItem(lsKey(), JSON.stringify([...marks])); } catch (e) { /* приватный режим */ }
    }
    function emit() {
        paint(document);
        listeners.forEach(fn => { try { fn(); } catch (e) { console.warn('[закладки]', e); } });
    }

    async function init(user) {
        if (ready) return ready;
        ready = (async () => {
            uid = (user && user.id) || 'anon';
            marks = loadLocal();
            paint(document);
            const client = db();
            if (!client || uid === 'anon') return;
            try {
                const { data, error } = await client.from(TABLE).select('task_type, task_id').eq('user_id', uid);
                if (error) throw error;
                remote = true;
                const fromDb = new Set((data || []).map(r => key(r.task_type, r.task_id)));
                // Закладки, поставленные, пока таблицы не было, переносим в базу
                const onlyLocal = [...marks].filter(k => !fromDb.has(k));
                if (onlyLocal.length) {
                    const rows = onlyLocal.map(k => { const i = k.indexOf(':'); return { user_id: uid, task_type: k.slice(0, i), task_id: Number(k.slice(i + 1)) }; })
                        .filter(r => Number.isFinite(r.task_id));
                    if (rows.length) await client.from(TABLE).upsert(rows, { onConflict: 'user_id,task_type,task_id' });
                    onlyLocal.forEach(k => fromDb.add(k));
                }
                marks = fromDb;
                saveLocal();
            } catch (e) {
                remote = false;   // нет таблицы или нет сети — работаем на localStorage
                console.warn('[закладки] база недоступна, храню в браузере:', e && (e.message || e));
            }
            emit();
        })();
        return ready;
    }

    function has(type, id) { return marks.has(key(type, id)); }
    function count(type) {
        const p = String(type) + ':';
        return [...marks].filter(k => k.startsWith(p)).length;
    }

    async function toggle(type, id) {
        const k = key(type, id);
        const on = !marks.has(k);
        if (on) marks.add(k); else marks.delete(k);
        saveLocal();
        emit();
        if (!remote) return on;
        const client = db();
        try {
            const res = on
                ? await client.from(TABLE).upsert([{ user_id: uid, task_type: String(type), task_id: Number(id) }], { onConflict: 'user_id,task_type,task_id' })
                : await client.from(TABLE).delete().eq('user_id', uid).eq('task_type', String(type)).eq('task_id', Number(id));
            if (res && res.error) throw res.error;
        } catch (e) {
            console.warn('[закладки] не сохранилось в базе, осталось в браузере:', e && (e.message || e));
        }
        return on;
    }

    // ---------- Кнопки ----------
    const ICON_OFF = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>';
    const ICON_ON = ICON_OFF.replace('fill="none"', 'fill="currentColor"');

    function look(btn, on) {
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
        const t = on ? L('Marked — click to remove the mark', 'Отмечено — нажмите, чтобы снять')
                     : L('Mark this task to come back to it later', 'Отметить, чтобы вернуться позже');
        btn.title = t;
        btn.setAttribute('aria-label', t);
        btn.classList.toggle('text-indigo-600', on);
        btn.classList.toggle('bg-indigo-50', on);
        btn.classList.toggle('border-indigo-200', on);
        btn.classList.toggle('text-gray-400', !on);
        btn.classList.toggle('bg-white', !on);
        btn.classList.toggle('border-gray-200', !on);
        const icon = btn.querySelector('.tm-icon');
        if (icon) icon.innerHTML = on ? ICON_ON : ICON_OFF;
        const label = btn.querySelector('.tm-label');
        if (label) label.textContent = on ? L('Marked', 'Отмечено') : L('Mark', 'Отметить');
    }

    function button(type, id) {
        const on = has(type, id);
        return `<button type="button" data-task-mark="${key(type, id)}" aria-pressed="${on}"
            class="tm-btn relative z-20 inline-flex items-center justify-center w-7 h-7 rounded-lg border transition hover:text-indigo-600 hover:border-indigo-200 ${on ? 'text-indigo-600 bg-indigo-50 border-indigo-200' : 'text-gray-400 bg-white border-gray-200'}"
            title="${on ? L('Marked — click to remove the mark', 'Отмечено — нажмите, чтобы снять') : L('Mark this task to come back to it later', 'Отметить, чтобы вернуться позже')}"><span class="tm-icon">${on ? ICON_ON : ICON_OFF}</span></button>`;
    }

    // Кнопка с подписью для шапки задания — ставится сразу после заголовка
    function headerButton(type, id, titleEl) {
        if (!titleEl || !titleEl.parentNode) return;
        const old = titleEl.parentNode.querySelector('.tm-head');
        if (old) old.remove();
        const on = has(type, id);
        titleEl.insertAdjacentHTML('afterend',
            `<button type="button" data-task-mark="${key(type, id)}" aria-pressed="${on}"
                class="tm-btn tm-head shrink-0 inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg border text-xs font-bold transition hover:text-indigo-600 hover:border-indigo-200 ${on ? 'text-indigo-600 bg-indigo-50 border-indigo-200' : 'text-gray-400 bg-white border-gray-200'}">
                <span class="tm-icon">${on ? ICON_ON : ICON_OFF}</span><span class="tm-label hidden sm:inline">${on ? L('Marked', 'Отмечено') : L('Mark', 'Отметить')}</span></button>`);
        // Если заголовок стоит в обычном блоке (а не в строке-flex), кнопка уходит
        // на следующую строку — даём ей отступ сверху
        const btn = titleEl.nextElementSibling;
        try { if (btn && getComputedStyle(titleEl.parentNode).display.indexOf('flex') === -1) btn.classList.add('mt-2'); } catch (e) { /* */ }
        paint(titleEl.parentNode);
    }

    function paint(root) {
        (root || document).querySelectorAll('[data-task-mark]').forEach(btn => look(btn, marks.has(btn.getAttribute('data-task-mark'))));
    }

    // Один обработчик на всю страницу. Захват — чтобы клик по закладке
    // не открывал карточку и не срабатывал как клик по ссылке под ней.
    document.addEventListener('click', e => {
        const btn = e.target.closest && e.target.closest('[data-task-mark]');
        if (!btn) return;
        e.preventDefault();
        e.stopPropagation();
        const k = btn.getAttribute('data-task-mark');
        const i = k.indexOf(':');
        toggle(k.slice(0, i), k.slice(i + 1));
    }, true);

    window.TaskMarks = {
        init, has, count, toggle, button, headerButton, paint,
        key,
        hasKey: k => marks.has(k),
        onChange: fn => { if (typeof fn === 'function') listeners.push(fn); }
    };
})();
