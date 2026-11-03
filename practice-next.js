// =====================================================================
// practice-next.js — кнопка «Next test» в практике Reading
// (Daily Life, Academic, Complete the Words).
//
// Список (read-daily.html и др.) после каждой отрисовки запоминает
// порядок карточек, как их видит ученица — с учётом фильтра по теме, —
// и какие уже сделаны. На странице задания после проверки (и в режиме
// review) появляется «Next test →»: следующий НЕсделанный тест после
// текущего. Дальше по списку все сделаны — берётся первый несделанный
// сначала; сделано всё — кнопки нет, только подпись.
//
// Вернувшись к списку, ученица оказывается у карточки последнего
// открытого теста (она коротко подсвечивается) — не надо листать
// до 200-го заново.
//
// Если порядка в памяти нет (тест открыт по прямой ссылке, другой
// браузер), порядок берётся из базы: по номеру, без фильтра.
// Порядок хранится в localStorage этого браузера, данных учениц там нет —
// только номера тестов, названия и отметка «сделан».
// =====================================================================
(function () {
    'use strict';

    var KINDS = {
        daily: {
            list: 'read-daily.html', task: 'read-daily-task.html',
            table: 'daily_life_tasks', results: 'reading_results', resultType: 'daily',
            review: true,
            btn: 'flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white'
        },
        academic: {
            list: 'read-academic.html', task: 'read-academic-task.html',
            table: 'academic_tasks', results: 'reading_results', resultType: 'academic',
            review: true,
            btn: 'flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white'
        },
        words: {
            list: 'complete-words.html', task: 'complete-words-task.html',
            table: 'complete_words_tasks', results: 'complete_words_results', resultType: null,
            review: false,
            btn: 'px-5 py-3 bg-slate-900 hover:bg-purple-600 text-white'
        }
    };

    var ARROW = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" '
        + 'stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
        + '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';

    function key(kind) { return 'practiceNext:' + kind; }

    function load(kind) {
        try {
            var raw = window.localStorage.getItem(key(kind));
            var st = raw ? JSON.parse(raw) : null;
            return st && Array.isArray(st.items) ? st : null;
        } catch (e) { return null; }
    }

    function save(kind, st) {
        try { window.localStorage.setItem(key(kind), JSON.stringify(st)); } catch (e) { /* приватное окно — без памяти */ }
    }

    function update(kind, fn) {
        var st = load(kind) || { uid: null, items: [] };
        fn(st);
        save(kind, st);
    }

    function setFocus(kind, id) {
        if (id === null || id === undefined) return;
        update(kind, function (st) { st.focus = String(id); });
    }

    function markDone(kind, id) {
        update(kind, function (st) {
            st.items.forEach(function (it) { if (it.id === String(id)) it.done = true; });
        });
    }

    function idFromHref(href) {
        try {
            var u = new URL(href, window.location.href);
            return { id: u.searchParams.get('id'), review: u.searchParams.get('mode') === 'review' };
        } catch (e) { return { id: null, review: false }; }
    }

    // Карточка — прямой потомок контейнера списка
    function cardOf(el, listEl) {
        var c = el;
        while (c && c.parentElement && c.parentElement !== listEl) c = c.parentElement;
        return c && c.parentElement === listEl ? c : null;
    }

    function selector(cfg) { return 'a[href^="' + cfg.task + '?"]'; }

    function flash(card) {
        var prev = card.style.boxShadow;
        card.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.45)';
        setTimeout(function () { card.style.boxShadow = prev; }, 2200);
    }

    // ---------- Страница списка ----------
    function remember(kind, listEl, userId) {
        var cfg = KINDS[kind];
        if (!cfg || !listEl) return;

        var seen = {};
        var items = [];
        var cards = {};
        listEl.querySelectorAll(selector(cfg)).forEach(function (a) {
            var p = idFromHref(a.getAttribute('href'));
            if (!p.id || seen[p.id]) return;
            seen[p.id] = true;
            var card = cardOf(a, listEl);
            var title = '', label = '';
            if (card) {
                cards[p.id] = card;
                var h = card.querySelector('h3');
                title = h ? h.textContent.replace(/\s+/g, ' ').trim().slice(0, 140) : '';
                var spans = card.querySelectorAll('span');
                for (var i = 0; i < spans.length; i++) {
                    var t = spans[i].textContent.trim();
                    if (/^Test #\d+$/.test(t)) { label = t; break; }
                }
            }
            items.push({ id: String(p.id), done: p.review || /review/i.test(a.textContent), title: title, label: label });
        });

        var old = load(kind);
        var focus = old && old.focus;
        save(kind, { uid: userId || null, items: items, at: Date.now() });

        // Запоминаем, какой тест открыли из списка
        if (!listEl.__pnClicks) {
            listEl.__pnClicks = true;
            listEl.addEventListener('click', function (e) {
                var a = e.target && e.target.closest ? e.target.closest(selector(cfg)) : null;
                if (a) setFocus(kind, idFromHref(a.getAttribute('href')).id);
            }, true);
        }

        // Вернулись из теста — к его карточке
        var card = focus ? cards[focus] : null;
        if (card) {
            var go = function () {
                try { card.scrollIntoView({ block: 'center' }); } catch (e) { card.scrollIntoView(); }
                flash(card);
            };
            if (window.requestAnimationFrame) requestAnimationFrame(go); else go();
        }
    }

    // ---------- Страница теста ----------
    function pick(items, currentId) {
        var cur = String(currentId);
        var idx = -1;
        for (var i = 0; i < items.length; i++) if (items[i].id === cur) { idx = i; break; }
        if (idx < 0) return null;
        for (var j = idx + 1; j < items.length; j++) if (!items[j].done) return items[j];
        for (var k = 0; k < idx; k++) if (!items[k].done) return items[k];
        return { none: true };
    }

    async function fromDb(kind, client, userId) {
        var cfg = KINDS[kind];
        try {
            var r = await client.from(cfg.table).select('id, title').eq('is_mock_only', false).order('id', { ascending: true });
            if (!r || r.error || !Array.isArray(r.data)) return null;
            var done = {};
            if (userId) {
                var q = client.from(cfg.results).select('task_id').eq('user_id', userId);
                if (cfg.resultType) q = q.eq('task_type', cfg.resultType);
                var r2 = await q;
                if (r2 && !r2.error && Array.isArray(r2.data)) r2.data.forEach(function (x) { done[String(x.task_id)] = true; });
            }
            var items = r.data.map(function (t) {
                return { id: String(t.id), done: !!done[String(t.id)], title: String(t.title || '').slice(0, 140), label: '' };
            });
            var old = load(kind);
            save(kind, { uid: userId || null, items: items, at: Date.now(), focus: old && old.focus, source: 'db' });
            return items;
        } catch (e) {
            return null;
        }
    }

    function render(kind, row, opts, next) {
        var cfg = KINDS[kind];
        var host = row.parentElement;
        Array.prototype.forEach.call(row.querySelectorAll('.pn-next'), function (n) { n.remove(); });
        if (host) Array.prototype.forEach.call(host.querySelectorAll('.pn-caption'), function (n) { n.remove(); });
        if (!next) return;

        var caption = document.createElement('p');
        caption.className = 'pn-caption text-[11px] text-slate-400 mt-2.5 truncate ' + (opts.align === 'right' ? 'text-right' : 'text-center');

        if (next.none) {
            caption.textContent = 'Every test in this list is done';
        } else {
            var a = document.createElement('a');
            a.className = 'pn-next font-bold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ' + cfg.btn
                + (opts.buttonClass ? ' ' + opts.buttonClass : '');
            a.href = cfg.task + '?id=' + encodeURIComponent(next.id) + (next.done && cfg.review ? '&mode=review' : '');
            a.innerHTML = '<span>Next test</span>' + ARROW;
            a.addEventListener('click', function () { setFocus(kind, next.id); });
            row.appendChild(a);

            var name = [next.label, next.title].filter(Boolean).join(' · ');
            if (name) {
                a.title = name;
                caption.textContent = 'Next: ' + name;
            } else {
                caption = null;
            }
        }
        if (caption) row.insertAdjacentElement('afterend', caption);
    }

    // opts: { row: элемент или id ряда кнопок, currentId, client, userId, align, buttonClass }
    function mount(kind, opts) {
        var cfg = KINDS[kind];
        opts = opts || {};
        var row = typeof opts.row === 'string' ? document.getElementById(opts.row) : opts.row;
        if (!cfg || !row || opts.currentId === null || opts.currentId === undefined || opts.currentId === '') return;

        markDone(kind, opts.currentId);
        setFocus(kind, opts.currentId);

        var st = load(kind);
        var sameUser = st && (!st.uid || !opts.userId || st.uid === opts.userId);
        var next = sameUser ? pick(st.items, opts.currentId) : null;
        if (next) { render(kind, row, opts, next); return; }

        if (!opts.client) return;
        fromDb(kind, opts.client, opts.userId).then(function (items) {
            if (!items) return;
            items.forEach(function (it) { if (it.id === String(opts.currentId)) it.done = true; });
            render(kind, row, opts, pick(items, opts.currentId));
        });
    }

    window.PracticeNext = { remember: remember, mount: mount, _pick: pick };
})();
