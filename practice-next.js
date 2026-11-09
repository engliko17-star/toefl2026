// =====================================================================
// practice-next.js — кнопка «Next test» в практике:
//   Reading (Daily Life, Academic, Complete the Words),
//   Listening (Choose a Response), Writing (Build a Sentence, Email,
//   Academic Discussion), Speaking (Listen and Repeat, Interview).
//   Listening Conversation / Announcement / Academic Talk — на самой
//   practice-view.html (там список и тест на одной странице).
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
        },
        // Listening — Choose a Response: номер набора (?set=), разбор — &review=true
        response: {
            list: 'choose-response-list.html', task: 'choose-response-test.html',
            param: 'set', reviewQuery: 'review=true', review: true, noDashboard: true,
            fromDb: responseFromDb,
            btn: 'flex-1 py-3.5 text-sm bg-purple-600 hover:bg-purple-700 text-white'
        },
        // Writing: тип в адресе (?type=…&id=…); сделанное — карточка «Review Results»
        'w-sentence': { list: 'task-list.html?type=sentence', task: 'writing-practice.html', extra: 'type=sentence&', noDashboard: true,
            btn: 'w-full py-3.5 text-sm bg-emerald-600 hover:bg-emerald-700 text-white' },
        'w-email': { list: 'task-list.html?type=email', task: 'writing-practice.html', extra: 'type=email&', noDashboard: true,
            btn: 'w-full py-3.5 text-sm bg-emerald-600 hover:bg-emerald-700 text-white' },
        'w-academic': { list: 'task-list.html?type=academic', task: 'writing-practice.html', extra: 'type=academic&', noDashboard: true,
            btn: 'w-full py-3.5 text-sm bg-emerald-600 hover:bg-emerald-700 text-white' },
        // Speaking: сделанное — в карточке есть ссылка на разбор
        's-listen_repeat': { list: 'listen_repeat.html', task: 'speaking_player.html', extra: 'type=listen_repeat&', noDashboard: true,
            doneSel: 'a[href^="speaking_results.html"]',
            btn: 'px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white' },
        's-interview': { list: 'interview.html', task: 'speaking_player.html', extra: 'type=interview&', noDashboard: true,
            doneSel: 'a[href^="interview_results.html"]',
            btn: 'px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white' }
    };

    // Слова кнопки на языке интерфейса (i18n.js); названия заданий не переводятся
    function L(en, ru) {
        var lang = 'en';
        try { lang = (window.I18N && window.I18N.lang) || window.localStorage.getItem('appLang') || 'en'; } catch (e) { /* по умолчанию */ }
        return lang === 'ru' ? ru : en;
    }

    function hrefFor(cfg, id, done) {
        var reviewQ = cfg.reviewQuery || 'mode=review';
        return cfg.task + '?' + (cfg.extra || '') + (cfg.param || 'id') + '=' + encodeURIComponent(id) + (done && cfg.review ? '&' + reviewQ : '');
    }

    // Choose a Response без запомненного порядка: наборы по номеру + сделанные
    async function responseFromDb(client, userId) {
        var sets = {}, hidden = {};
        for (var from = 0; from < 20000; from += 1000) {
            var r = await client.from('listening_questions').select('set_number, is_hidden')
                .or('is_mock_only.eq.false,is_mock_only.is.null').order('id', { ascending: true }).range(from, from + 999);
            if (r && r.error) r = await client.from('listening_questions').select('set_number')
                .or('is_mock_only.eq.false,is_mock_only.is.null').order('id', { ascending: true }).range(from, from + 999);
            if (!r || r.error || !Array.isArray(r.data)) return null;
            r.data.forEach(function (q) { if (q.set_number) { sets[q.set_number] = true; if (q.is_hidden === true) hidden[q.set_number] = true; } });
            if (r.data.length < 1000) break;
        }
        var done = {};
        if (userId) {
            var r2 = await client.from('response_results').select('set_number').eq('user_id', userId);
            if (r2 && !r2.error && Array.isArray(r2.data)) r2.data.forEach(function (x) { done[String(x.set_number)] = true; });
        }
        return Object.keys(sets).filter(function (n) { return !hidden[n]; }).map(Number).sort(function (a, b) { return a - b; })
            .map(function (n) { return { id: String(n), done: !!done[String(n)], title: '', label: 'Set #' + n }; });
    }

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
        update(kind, function (st) { st.focus = String(id); st.last = String(id); st.lastAt = Date.now(); });
    }

    function markDone(kind, id) {
        update(kind, function (st) {
            st.items.forEach(function (it) { if (it.id === String(id)) it.done = true; });
        });
    }

    function idFromHref(href, cfg) {
        try {
            var u = new URL(href, window.location.href);
            var rq = ((cfg && cfg.reviewQuery) || 'mode=review').split('=');
            return { id: u.searchParams.get((cfg && cfg.param) || 'id'), review: u.searchParams.get(rq[0]) === rq[1] };
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
            var p = idFromHref(a.getAttribute('href'), cfg);
            if (!p.id || seen[p.id]) return;
            // Закрытое в бесплатной версии в «Next test» не попадает
            if (a.closest && a.closest('[data-guest-locked]')) return;
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
                    if (/^(Test|Set) #\d+$/.test(t)) { label = t; break; }
                }
            }
            var reviewSel = 'a[href*="' + (cfg.reviewQuery || 'mode=review') + '"]';
            var done = p.review || /review/i.test(a.textContent)
                || !!(card && (card.querySelector(reviewSel) || (cfg.doneSel && card.querySelector(cfg.doneSel))));
            items.push({ id: String(p.id), done: done, title: title, label: label });
        });

        var old = load(kind);
        var focus = old && old.focus;
        // focus — «вернуть список к этой карточке» (один раз); last — последний открытый тест (для дашборда)
        save(kind, { uid: userId || null, items: items, at: Date.now(), last: old && old.last, lastAt: old && old.lastAt });

        // Запоминаем, какой тест открыли из списка
        if (!listEl.__pnClicks) {
            listEl.__pnClicks = true;
            listEl.addEventListener('click', function (e) {
                var a = e.target && e.target.closest ? e.target.closest(selector(cfg)) : null;
                if (a) setFocus(kind, idFromHref(a.getAttribute('href'), cfg).id);
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
        if (cfg.fromDb) {
            try {
                var own = await cfg.fromDb(client, userId);
                if (!own) return null;
                var prev = load(kind);
                save(kind, { uid: userId || null, items: own, at: Date.now(), focus: prev && prev.focus, last: prev && prev.last, lastAt: prev && prev.lastAt, source: 'db' });
                return own;
            } catch (e) { return null; }
        }
        if (!cfg.table) return null;   // без запомненного порядка кнопки нет (откройте тест из списка)
        try {
            // is_hidden — глазик: скрытое в практике не предлагаем (пока колонки нет — без неё)
            var r = await client.from(cfg.table).select('id, title, is_hidden').eq('is_mock_only', false).order('id', { ascending: true });
            if (r && r.error) r = await client.from(cfg.table).select('id, title').eq('is_mock_only', false).order('id', { ascending: true });
            if (!r || r.error || !Array.isArray(r.data)) return null;
            var done = {};
            if (userId) {
                var q = client.from(cfg.results).select('task_id').eq('user_id', userId);
                if (cfg.resultType) q = q.eq('task_type', cfg.resultType);
                var r2 = await q;
                if (r2 && !r2.error && Array.isArray(r2.data)) r2.data.forEach(function (x) { done[String(x.task_id)] = true; });
            }
            var items = r.data.filter(function (t) { return t.is_hidden !== true; }).map(function (t) {
                return { id: String(t.id), done: !!done[String(t.id)], title: String(t.title || '').slice(0, 140), label: '' };
            });
            var old = load(kind);
            save(kind, { uid: userId || null, items: items, at: Date.now(), focus: old && old.focus, last: old && old.last, lastAt: old && old.lastAt, source: 'db' });
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
            caption.textContent = L('Every test in this list is done', 'Все тесты из этого списка сделаны');
        } else {
            var a = document.createElement('a');
            a.className = 'pn-next font-bold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ' + cfg.btn
                + (opts.buttonClass ? ' ' + opts.buttonClass : '');
            a.href = hrefFor(cfg, next.id, next.done);
            a.innerHTML = '<span>' + L('Next test', 'Следующий тест') + '</span>' + ARROW;
            a.addEventListener('click', function () { setFocus(kind, next.id); });
            if (opts.prepend) row.insertBefore(a, row.firstChild); else row.appendChild(a);

            var name = [next.label, next.title].filter(Boolean).join(' · ');
            if (name) {
                a.title = name;
                caption.textContent = L('Next: ', 'Дальше: ') + name;
            } else {
                caption = null;
            }
        }
        if (caption) row.insertAdjacentElement('afterend', caption);
    }

    // opts: { row: элемент или id ряда кнопок, currentId, client, userId, align, buttonClass, prepend }
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

    // ---------- Дашборд: «что дальше» ----------
    // Практика, которую открывали последней, и тест в ней: недоделанный — его,
    // сделанный — следующий несделанный.
    var LABELS = { daily: 'Read in Daily Life', academic: 'Read an Academic Passage', words: 'Complete the Words' };
    function suggest(userId) {
        var best = null;
        Object.keys(KINDS).forEach(function (kind) {
            if (KINDS[kind].noDashboard) return;   // на главной пока только Reading
            var st = load(kind);
            if (!st || !st.last || !Array.isArray(st.items) || !st.items.length) return;
            if (st.uid && userId && st.uid !== userId) return;
            if (!best || (st.lastAt || 0) > (best.st.lastAt || 0)) best = { kind: kind, st: st };
        });
        if (!best) return null;
        var cfg = KINDS[best.kind];
        var cur = null;
        best.st.items.forEach(function (i) { if (i.id === String(best.st.last)) cur = i; });
        var next = cur && !cur.done ? cur : pick(best.st.items, best.st.last);
        if (!next) return null;
        if (next.none) return { kind: best.kind, label: LABELS[best.kind], allDone: true, list: cfg.list, at: best.st.lastAt || null };
        return {
            kind: best.kind, label: LABELS[best.kind], at: best.st.lastAt || null,
            resume: !!(cur && !cur.done), item: next, list: cfg.list,
            href: hrefFor(cfg, next.id, false)
        };
    }

    window.PracticeNext = { remember: remember, mount: mount, suggest: suggest, _pick: pick };
})();
