// ==========================================
// «ГЛАЗИК»: скрыть задание от учеников, пока преподаватель его проверяет
// ==========================================
// Подключается на страницах-списках после auth.js:
//   <script src="content-visibility.js"></script>
//
// Скрывает по-настоящему база (content_visibility.sql): скрытые строки
// она отдаёт только преподавателю, ученица не откроет их и по прямой ссылке.
// Этот файл — только кнопка для преподавателя и отметка на карточке.
//
// На странице:
//   ContentVisibility.init({ user, reload: loadTests });
//   rows = ContentVisibility.visibleFor(rows, user);         // ученице — без скрытых
//   ContentVisibility.cardClass(hidden)                       // рамка скрытой карточки
//   ContentVisibility.withEye(actionHtml, table, ids, hidden) // кнопка рядом с действием
//   ContentVisibility.eye(table, ids, hidden, { compact })    // только кнопка
(function () {
    const TABLES = ['complete_words_tasks', 'daily_life_tasks', 'academic_tasks',
                    'mock_tests', 'writing_tasks', 'mini_mock_writing'];

    // Иконки встроены, чтобы глазик не зависел от загрузки lucide
    const ICON_EYE = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>';
    const ICON_EYE_OFF = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>';

    // Свои стили, а не Tailwind: на одних страницах Tailwind 3, на других 4
    const CSS = `
        .cv-row { display: flex; gap: .5rem; align-items: stretch; width: 100%; margin-top: auto; }
        .cv-row > .cv-main { flex: 1 1 auto; min-width: 0; margin-top: 0; }
        .cv-eye { flex: 0 0 auto; display: inline-flex; align-items: center; justify-content: center; gap: .35rem;
                  min-width: 2.5rem; min-height: 2rem; padding: 0 .65rem; border-radius: .75rem;
                  border: 1px solid #e2e8f0; background: #fff; color: #64748b; cursor: pointer;
                  font-family: inherit; font-size: 11px; font-weight: 700; letter-spacing: .02em; line-height: 1;
                  transition: background-color .15s, color .15s, border-color .15s; }
        .cv-eye:hover { background: #f1f5f9; color: #0f172a; border-color: #cbd5e1; }
        .cv-eye[data-cv-hidden="1"] { background: #fef3c7; border-color: #fcd34d; color: #b45309; }
        .cv-eye[data-cv-hidden="1"]:hover { background: #fde68a; }
        .cv-eye:disabled { opacity: .55; cursor: wait; }
        .cv-eye:focus-visible { outline: 2px solid #6366f1; outline-offset: 2px; }
        .cv-hidden { outline: 2px dashed #f59e0b; outline-offset: -2px; }
        .cv-toast { position: fixed; left: 50%; bottom: 1.5rem; transform: translateX(-50%); z-index: 10000;
                    background: #0f172a; color: #fff; font: 600 13px/1.35 system-ui, -apple-system, sans-serif;
                    padding: .7rem 1rem; border-radius: .75rem; box-shadow: 0 10px 25px rgba(0,0,0,.2);
                    max-width: min(90vw, 420px); text-align: center; pointer-events: none;
                    transition: opacity .2s; }
        @media (max-width: 767px) { .cv-toast { bottom: 5.5rem; } }
    `;

    let currentUser = null;
    let reloadFn = null;

    function esc(s) {
        return String(s === null || s === undefined ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function injectCss() {
        if (document.getElementById('cv-styles')) return;
        const st = document.createElement('style');
        st.id = 'cv-styles';
        st.textContent = CSS;
        document.head.appendChild(st);
    }

    function isTeacher(user) {
        return !!user && user.role === 'teacher';
    }

    function isHidden(row) {
        return !!row && row.is_hidden === true;
    }

    // Ученице скрытое не показываем, даже если база его вдруг отдала
    // (например, SQL ещё не запущен, а отметка уже стоит)
    function visibleFor(rows, user) {
        const list = rows || [];
        return isTeacher(user || currentUser) ? list : list.filter(r => !isHidden(r));
    }

    function cardClass(hidden) {
        return hidden && isTeacher(currentUser) ? 'cv-hidden' : '';
    }

    // opts.compact — только значок, без надписи Hidden (для тесных карточек)
    function eye(table, ids, hidden, opts) {
        if (!isTeacher(currentUser)) return '';
        const idList = (Array.isArray(ids) ? ids : [ids]).map(String);
        const title = hidden
            ? 'Скрыто от учеников — нажмите, чтобы открыть'
            : 'Видно ученикам — нажмите, чтобы скрыть';
        return `<button type="button" class="cv-eye" data-cv-table="${esc(table)}" data-cv-ids="${esc(JSON.stringify(idList))}" data-cv-hidden="${hidden ? '1' : '0'}" title="${title}" aria-label="${title}">${hidden ? ICON_EYE_OFF + (opts && opts.compact ? '' : '<span>Hidden</span>') : ICON_EYE}</button>`;
    }

    // Кнопка рядом с главным действием карточки (Start / Review ...)
    function withEye(actionHtml, table, ids, hidden) {
        if (!isTeacher(currentUser)) return actionHtml;
        return `<div class="cv-row"><div class="cv-main">${actionHtml}</div>${eye(table, ids, hidden)}</div>`;
    }

    let toastTimer = null;
    function toast(text) {
        let el = document.getElementById('cv-toast');
        if (!el) {
            el = document.createElement('div');
            el.id = 'cv-toast';
            el.className = 'cv-toast';
            el.setAttribute('role', 'status');
            document.body.appendChild(el);
        }
        el.textContent = text;
        el.style.opacity = '1';
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => { el.style.opacity = '0'; }, 2600);
    }

    function db() {
        if (window.supabaseClient && typeof window.supabaseClient.rpc === 'function') return window.supabaseClient;
        if (typeof _supabase !== 'undefined') return _supabase; // eslint-disable-line no-undef
        return null;
    }

    async function onClick(e) {
        const btn = e.target.closest && e.target.closest('.cv-eye[data-cv-table]');
        if (!btn) return;
        e.preventDefault();
        e.stopPropagation();
        if (btn.disabled) return;

        const table = btn.getAttribute('data-cv-table');
        let ids;
        try { ids = JSON.parse(btn.getAttribute('data-cv-ids')); } catch (err) { return; }
        if (!TABLES.includes(table) || !Array.isArray(ids) || !ids.length) return;
        const hide = btn.getAttribute('data-cv-hidden') !== '1';

        const client = db();
        if (!client) { alert('Нет подключения к базе — обновите страницу.'); return; }

        btn.disabled = true;
        let res;
        try {
            res = await client.rpc('set_content_hidden', { p_table: table, p_ids: ids.map(String), p_hidden: hide });
        } catch (err) {
            res = { error: err };
        }
        btn.disabled = false;

        if (res.error) {
            const msg = res.error.message || String(res.error);
            if (res.error.code === 'PGRST202' || /set_content_hidden/.test(msg)) {
                alert('Глазик ещё не подключён в базе.\n\nЗапустите в Supabase файл content_visibility.sql и обновите страницу.');
            } else if (res.error.code === '42501') {
                alert('Скрывать и открывать задания может только преподаватель.');
            } else {
                alert('Не получилось изменить видимость:\n\n' + msg);
            }
            return;
        }

        const data = res.data || {};
        if (data.changed === 0) {
            alert('Ничего не изменилось — задание не найдено. Обновите страницу.');
        } else {
            toast(hide ? 'Скрыто от учеников' : 'Ученики снова видят это задание');
            const used = Array.isArray(data.used_in) ? data.used_in : [];
            if (hide && used.length) {
                alert('Скрыто. Учтите: это задание стоит ещё в\n\n• ' + used.join('\n• ')
                    + '\n\nПока оно скрыто, ученики не увидят его и там — тест пройдёт без него. '
                    + 'Если это не нужно, нажмите на глазик ещё раз.');
            }
        }
        if (typeof reloadFn === 'function') {
            try { await reloadFn(); } catch (err) { console.error('[глазик] не удалось обновить список:', err); }
        }
    }

    function init(opts) {
        currentUser = (opts && opts.user) || currentUser;
        if (opts && typeof opts.reload === 'function') reloadFn = opts.reload;
        if (isTeacher(currentUser)) injectCss();
    }

    document.addEventListener('click', onClick);

    window.ContentVisibility = { init, isTeacher, isHidden, visibleFor, cardClass, eye, withEye, toast, TABLES };
})();
