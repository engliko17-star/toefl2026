// =====================================================================
// review-inbox.js — вкладка «На проверку» на Teacher Board
//
// Собирает со всех учениц работы, которые ждут проверки:
//   • эссе практики Writing (Email / Academic) без оценки и правок;
//   • Mini-Mock Writing, где оценены не оба эссе;
//   • Writing большого мок-теста без итогового балла;
//   • законченные наборы Speaking-практики без балла;
//   • Mini-Mock Speaking со статусом «ждёт проверки»;
//   • Speaking большого мок-теста без балла.
// Правила «проверено / не проверено» — те же, что в профиле ученицы.
// Нажатие на работу открывает её проверку.
//
// Там же — карточка Telegram: подключение бота для уведомлений
// (функции из notifications.sql).
// =====================================================================
(function () {
    'use strict';

    var TYPES = {
        essay:     { label: 'Writing practice',     icon: 'pen-line',   color: 'indigo',  group: 'writing' },
        miniW:     { label: 'Mini-Mock Writing',    icon: 'file-text',  color: 'violet',  group: 'writing' },
        fullW:     { label: 'Mock Test · Writing',  icon: 'book-open',  color: 'sky',     group: 'writing' },
        practiceS: { label: 'Speaking practice',    icon: 'mic',        color: 'teal',    group: 'speaking' },
        miniS:     { label: 'Mini-Mock Speaking',   icon: 'mic-vocal',  color: 'emerald', group: 'speaking' },
        fullS:     { label: 'Mock Test · Speaking', icon: 'headphones', color: 'amber',   group: 'speaking' }
    };
    // Классы целиком (Tailwind CDN видит только написанные полностью)
    var COLORS = {
        indigo:  'bg-indigo-50 text-indigo-600',
        violet:  'bg-violet-50 text-violet-600',
        sky:     'bg-sky-50 text-sky-600',
        teal:    'bg-teal-50 text-teal-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        amber:   'bg-amber-50 text-amber-600'
    };

    var state = { items: [], errors: [], loaded: false, loading: null, filter: 'all', period: 'all', teacherId: null, tg: null };
    try { state.period = localStorage.getItem('reviewInbox:period') || 'all'; } catch (e) { /* без памяти */ }

    function db() { return typeof _supabase !== 'undefined' ? _supabase : null; }
    function esc(s) {
        return String(s === null || s === undefined ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    function $(id) { return document.getElementById(id); }
    function chunks(arr, n) { var out = []; for (var i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n)); return out; }
    function uniq(arr) { var s = {}; return arr.filter(function (v) { if (v === null || v === undefined || s[v]) return false; s[v] = true; return true; }); }
    function filled(v) { return v !== null && v !== undefined && String(v).trim() !== ''; }

    // Тот же балл эссе, что в профиле: «4.5» или «4.5/6.0»; «0/6.0» — заглушка, не оценка
    function essayScore(raw) {
        if (!filled(raw)) return null;
        var s = String(raw).trim();
        if (/^0\s*\/\s*6(\.0+)?$/.test(s)) return null;
        var m = s.match(/^(\d+(?:\.\d+)?)(?:\s*\/\s*6(?:\.0+)?)?$/);
        return m ? parseFloat(m[1]) : null;
    }
    function essayChecked(r) {
        return filled(r.correction) || filled(r.teacher_correction) || essayScore(r.score) !== null
            || ['purpose_score', 'grammar_score', 'vocabulary_score'].some(function (k) { return filled(r[k]) && !isNaN(parseFloat(r[k])); });
    }

    async function selectIn(table, cols, col, ids) {
        var out = [];
        for (var part of chunks(uniq(ids), 100)) {
            var res = await db().from(table).select(cols).in(col, part);
            if (res.error) throw res.error;
            out = out.concat(res.data || []);
        }
        return out;
    }
    async function titles(table, ids) {
        var map = {};
        if (!ids.length) return map;
        try {
            (await selectIn(table, '*', 'id', ids)).forEach(function (t) { map[String(t.id)] = t.title || ''; });
        } catch (e) { /* без названий */ }
        return map;
    }

    // ---------- Источники ----------
    var SOURCES = [
        { key: 'essay', name: 'эссе практики', load: async function () {
            var res = await db().from('student_responses').select('*')
                .or('task_type.ilike.email,task_type.ilike.academic')
                .order('created_at', { ascending: false }).limit(800);
            if (res.error) throw res.error;
            var rows = (res.data || []).filter(function (r) { return !essayChecked(r); });
            var tmap = await titles('writing_tasks', rows.map(function (r) { return r.task_id; }));
            return rows.map(function (r) {
                var kind = String(r.task_type || '').toLowerCase() === 'email' ? 'Email' : 'Academic Discussion';
                var att = Number(r.attempt_no);
                return { type: 'essay', id: r.id, user: r.user_id, at: r.created_at,
                    title: (tmap[String(r.task_id)] || 'Task #' + r.task_id),
                    sub: kind + (att > 1 ? ' · попытка ' + att : ''),
                    href: 'student-profile.html?id=' + encodeURIComponent(r.user_id) + '&tab=writing&open=essay:' + encodeURIComponent(r.id) };
            });
        } },
        { key: 'miniW', name: 'Mini-Mock Writing', load: async function () {
            var res = await db().from('mini_mock_writing_attempts').select('*').order('created_at', { ascending: false }).limit(400);
            if (res.error) throw res.error;
            var attempts = res.data || [];
            if (!attempts.length) return [];
            var resp = await selectIn('mini_mock_writing_responses', 'attempt_id, task_type, score', 'attempt_id', attempts.map(function (a) { return a.id; }));
            var byAttempt = {};
            resp.forEach(function (r) { (byAttempt[String(r.attempt_id)] = byAttempt[String(r.attempt_id)] || []).push(r); });
            var pending = attempts.filter(function (a) {
                var list = byAttempt[String(a.id)] || [];
                var essays = list.filter(function (r) { return ['email', 'academic'].indexOf(String(r.task_type || '').toLowerCase()) >= 0; });
                if (!essays.length) return false;                                   // работа не дошла — проверять нечего
                var scored = essays.filter(function (r) { return filled(r.score) && !isNaN(parseFloat(r.score)); });
                var manual = a.status === 'reviewed' && filled(a.overall_score);
                return scored.length < essays.length && !manual;
            });
            var tmap = await titles('mini_mock_writing', pending.map(function (a) { return a.mock_id; }));
            return pending.map(function (a) {
                return { type: 'miniW', id: a.id, user: a.user_id, at: a.completed_at || a.created_at,
                    title: tmap[String(a.mock_id)] || 'Mini-Mock Writing', sub: 'Email + Academic',
                    href: 'mini-mock-results.html?attempt_id=' + encodeURIComponent(a.id) + '&back=' + encodeURIComponent('teacher-board.html?tab=review') };
            });
        } },
        { key: 'fullW', name: 'Writing мок-тестов', load: async function () {
            var res = await db().from('big_mock_writing_attempts').select('*').not('completed_at', 'is', null)
                .is('total_score', null).order('completed_at', { ascending: false }).limit(300);
            if (res.error) throw res.error;
            var rows = (res.data || []).filter(function (a) { return a.status !== 'reviewed'; });
            var tmap = await titles('full_tests', rows.map(function (a) { return a.test_id; }));
            return rows.map(function (a) {
                return { type: 'fullW', id: a.id, user: a.user_id, at: a.completed_at,
                    title: tmap[String(a.test_id)] || 'Full Mock Test', sub: 'Email + Academic',
                    href: 'student-profile.html?id=' + encodeURIComponent(a.user_id) + '&tab=writing&open=fullwriting:' + encodeURIComponent(a.id) };
            });
        } },
        { key: 'practiceS', name: 'Speaking-практики', load: async function () {
            var res = await db().from('speaking_attempts').select('*').eq('status', 'completed').is('score', null)
                .order('created_at', { ascending: false }).limit(300);
            if (res.error) throw res.error;
            var rows = res.data || [];
            if (!rows.length) return [];
            // только наборы, где есть записи
            var withAnswers = {};
            (await selectIn('speaking_responses', 'attempt_id', 'attempt_id', rows.map(function (a) { return a.id; })))
                .forEach(function (r) { withAnswers[String(r.attempt_id)] = true; });
            rows = rows.filter(function (a) { return withAnswers[String(a.id)]; });
            var tmap = await titles('speaking_tests', rows.map(function (a) { return a.test_id; }));
            return rows.map(function (a) {
                return { type: 'practiceS', id: a.id, user: a.user_id, at: a.completed_at || a.created_at,
                    title: tmap[String(a.test_id)] || 'Speaking set', sub: 'Interview / Listen & Repeat',
                    href: 'student-profile.html?id=' + encodeURIComponent(a.user_id) + '&tab=speaking&open=practice:' + encodeURIComponent(a.id) };
            });
        } },
        { key: 'miniS', name: 'Mini-Mock Speaking', load: async function () {
            var res = await db().from('mini_mock_speaking_attempts').select('*').eq('status', 'pending_review')
                .order('created_at', { ascending: false }).limit(300);
            if (res.error) throw res.error;
            var rows = (res.data || []).filter(function (a) { return !filled(a.overall_score); });
            var tmap = await titles('mini_mock_speaking_tests', rows.map(function (a) { return a.test_id; }));
            return rows.map(function (a) {
                return { type: 'miniS', id: a.id, user: a.user_id, at: a.completed_at || a.created_at,
                    title: tmap[String(a.test_id)] || 'Mini-Mock Speaking', sub: '',
                    href: 'student-profile.html?id=' + encodeURIComponent(a.user_id) + '&tab=speaking&open=mini:' + encodeURIComponent(a.id) };
            });
        } },
        { key: 'fullS', name: 'Speaking мок-тестов', load: async function () {
            var res = await db().from('big_mock_speaking_attempts').select('*').not('completed_at', 'is', null)
                .is('total_score', null).order('completed_at', { ascending: false }).limit(300);
            if (res.error) throw res.error;
            var rows = (res.data || []).filter(function (a) { return a.status !== 'reviewed'; });
            var tmap = await titles('full_tests', rows.map(function (a) { return a.test_id; }));
            return rows.map(function (a) {
                return { type: 'fullS', id: a.id, user: a.user_id, at: a.completed_at,
                    title: tmap[String(a.test_id)] || 'Full Mock Test', sub: '',
                    href: 'student-profile.html?id=' + encodeURIComponent(a.user_id) + '&tab=speaking&open=full:' + encodeURIComponent(a.id) };
            });
        } }
    ];

    async function loadAll() {
        if (!db()) return;
        var results = await Promise.all(SOURCES.map(function (s) {
            return s.load().then(function (items) { return { items: items }; }, function (e) {
                console.warn('[На проверку] ' + s.name + ':', e);
                return { items: [], error: s.name };
            });
        }));
        var items = [];
        var errors = [];
        results.forEach(function (r) { items = items.concat(r.items); if (r.error) errors.push(r.error); });
        // свои пробные работы преподавателя не показываем
        items = items.filter(function (it) { return it.user && String(it.user) !== String(state.teacherId); });

        // имена учениц
        var names = {};
        var known = (state.students ? state.students() : []) || [];
        known.forEach(function (s) { names[String(s.id)] = s; });
        var missing = uniq(items.map(function (it) { return String(it.user); })).filter(function (id) { return !names[id]; });
        if (missing.length) {
            try { (await selectIn('profiles', '*', 'id', missing)).forEach(function (p) { names[String(p.id)] = p; }); } catch (e) { /* без имён */ }
        }
        items.forEach(function (it) {
            var p = names[String(it.user)];
            if (p && p.role === 'teacher') it.teacher = true;
            it.name = p ? (p.full_name || p.name || (p.email ? String(p.email).split('@')[0] : '')) : '';
            it.name = it.name || 'Ученица';
        });
        items = items.filter(function (it) { return !it.teacher; });
        items.sort(function (a, b) { return String(b.at || '').localeCompare(String(a.at || '')); });
        state.items = items;
        state.errors = errors;
        state.loaded = true;
    }

    function load() {
        if (!state.loading) state.loading = loadAll().catch(function (e) { console.warn(e); }).then(function () { state.loading = null; updateBadge(); render(); });
        return state.loading;
    }

    function periodOk(it) {
        if (state.period === 'all') return true;
        var days = state.period === '7' ? 7 : 30;
        var t = Date.parse(it.at || '');
        return !isNaN(t) && Date.now() - t <= days * 864e5;
    }

    function updateBadge() {
        var b = $('reviewBadge');
        if (!b) return;
        var n = state.items.length;
        b.textContent = n > 99 ? '99+' : String(n);
        b.classList.toggle('hidden', !n);
        b.classList.toggle('flex', !!n);
        // на телефоне ряд вкладок прокручивается: число не должно уехать за край
        var view = $('reviewView');
        if (view && !view.classList.contains('hidden') && b.parentElement && b.parentElement.parentElement) {
            var row = b.parentElement.parentElement;
            if (row.scrollWidth > row.clientWidth) row.scrollLeft = row.scrollWidth;
        }
    }

    function ago(iso) {
        var t = Date.parse(iso || '');
        if (isNaN(t)) return '';
        var m = Math.round((Date.now() - t) / 60000);
        if (m < 1) return 'только что';
        if (m < 60) return m + ' мин назад';
        var h = Math.round(m / 60);
        if (h < 24) return h + ' ч назад';
        var d = Math.round(h / 24);
        if (d === 1) return 'вчера';
        if (d < 7) return d + ' дн. назад';
        return new Date(t).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
    }

    function chip(value, text, n) {
        var on = state.filter === value;
        return '<button type="button" data-review-filter="' + value + '" class="px-3.5 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer '
            + (on ? 'bg-white shadow-sm text-slate-800' : 'text-gray-500 hover:text-slate-700') + '">'
            + esc(text) + ' <span class="' + (on ? 'text-slate-400' : 'text-gray-400') + ' font-semibold">' + n + '</span></button>';
    }

    function render() {
        var list = $('reviewList');
        if (!list) return;
        var inPeriod = state.items.filter(periodOk);
        var count = function (g) { return inPeriod.filter(function (it) { return g === 'all' || TYPES[it.type].group === g; }).length; };
        var bar = $('reviewFilters');
        if (bar) bar.innerHTML = chip('all', 'Все', count('all')) + chip('writing', 'Writing', count('writing')) + chip('speaking', 'Speaking', count('speaking'));
        var per = $('reviewPeriod');
        if (per) per.value = state.period;

        if (!state.loaded) {
            list.innerHTML = '<div class="text-center py-12 text-gray-400 text-sm">Собираю работы учениц…</div>';
            return;
        }
        var shown = inPeriod.filter(function (it) { return state.filter === 'all' || TYPES[it.type].group === state.filter; });
        var warn = state.errors.length
            ? '<div class="mb-3 text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">Не удалось загрузить: '
              + esc(state.errors.join(', ')) + '. Остальное — ниже.</div>'
            : '';
        if (!shown.length) {
            list.innerHTML = warn + '<div class="text-center py-14 bg-white rounded-2xl border border-dashed border-gray-200">'
                + '<div class="text-3xl mb-2">🎉</div><p class="text-sm font-bold text-slate-700">Всё проверено</p>'
                + '<p class="text-xs text-gray-400 mt-1">Новые работы появятся здесь сами' + (state.tg && state.tg.connected ? ' — и придут в Telegram' : '') + '.</p></div>';
            return;
        }
        list.innerHTML = warn + shown.map(function (it) {
            var t = TYPES[it.type];
            return '<a href="' + esc(it.href) + '" class="review-item flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition group">'
                + '<div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ' + COLORS[t.color] + '"><i data-lucide="' + t.icon + '" class="w-5 h-5"></i></div>'
                + '<div class="flex-1 min-w-0">'
                +   '<div class="flex items-center gap-2 flex-wrap"><span class="text-sm font-bold text-slate-900">' + esc(it.name) + '</span>'
                +   '<span class="text-[10px] font-bold uppercase tracking-wider text-gray-400">' + esc(t.label) + '</span></div>'
                +   '<p class="text-xs text-slate-600 truncate mt-0.5">' + esc(it.title) + (it.sub ? ' <span class="text-gray-400">· ' + esc(it.sub) + '</span>' : '') + '</p>'
                + '</div>'
                + '<div class="text-right shrink-0">'
                +   '<div class="text-[11px] font-semibold text-gray-400" title="' + esc(it.at ? new Date(it.at).toLocaleString('ru-RU') : '') + '">' + esc(ago(it.at)) + '</div>'
                +   '<div class="mt-1 text-xs font-bold text-indigo-600 flex items-center justify-end gap-1 group-hover:gap-1.5 transition-all">Проверить <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i></div>'
                + '</div></a>';
        }).join('');
        if (window.lucide) lucide.createIcons();
    }

    // ---------- Telegram ----------
    function tgMissing(err) {
        return err && (err.code === 'PGRST202' || /Could not find the function|does not exist/i.test(String(err.message || '')));
    }
    function tgExplain(desc) {
        var d = String(desc || '');
        if (/chat not found/i.test(d)) return 'Telegram не нашёл чат. Откройте своего бота в Telegram и нажмите «Start», затем проверьте Chat ID.';
        if (/unauthorized/i.test(d)) return 'Telegram не принял токен. Скопируйте токен из @BotFather заново.';
        if (/blocked by the user/i.test(d)) return 'Бот заблокирован. Откройте бота в Telegram и разблокируйте (Restart).';
        if (/timeout/i.test(d)) return 'Telegram не ответил вовремя. Попробуйте ещё раз через минуту.';
        return d ? 'Telegram ответил: ' + d : 'Telegram не ответил.';
    }

    async function tgLoad() {
        try {
            var r = await db().rpc('tg_settings_get');
            if (r.error) throw r.error;
            state.tg = r.data || { connected: false };
        } catch (e) {
            state.tg = tgMissing(e) ? { missing: true } : { error: String(e.message || e) };
        }
        tgRender(false);
    }

    function tgRender(open) {
        var box = $('tgCard');
        if (!box) return;
        var s = state.tg || {};
        var status;
        if (s.missing) {
            status = '<div class="flex items-start gap-3"><div class="w-9 h-9 rounded-xl bg-gray-100 text-gray-400 flex items-center justify-center shrink-0"><i data-lucide="send" class="w-4 h-4"></i></div>'
                + '<div class="text-xs text-gray-500 leading-relaxed"><b class="text-slate-700">Уведомления в Telegram</b><br>Чтобы новые работы приходили вам в Telegram, один раз запустите <b>notifications.sql</b> в Supabase (SQL Editor).</div></div>';
            box.innerHTML = '<div class="bg-white border border-gray-100 rounded-2xl p-4 mb-5 shadow-sm">' + status + '</div>';
        } else {
            var on = s.connected && s.enabled;
            status = '<div class="flex flex-wrap items-center gap-3">'
                + '<div class="w-9 h-9 rounded-xl ' + (on ? 'bg-sky-50 text-sky-600' : 'bg-gray-100 text-gray-400') + ' flex items-center justify-center shrink-0"><i data-lucide="' + (on ? 'bell-ring' : 'bell-off') + '" class="w-4 h-4"></i></div>'
                + '<div class="flex-1 min-w-[180px] text-xs leading-relaxed">'
                + (s.error ? '<b class="text-rose-600">Telegram: ошибка</b><br><span class="text-gray-500">' + esc(s.error) + '</span>'
                   : on ? '<b class="text-slate-800">Telegram подключён</b><br><span class="text-gray-500">Новые работы приходят в чат ' + esc(s.chat_id || '') + '</span>'
                   : s.connected ? '<b class="text-slate-800">Уведомления выключены</b><br><span class="text-gray-500">Бот подключён, но сообщения не отправляются</span>'
                   : '<b class="text-slate-800">Подключите Telegram</b><br><span class="text-gray-500">и новые эссе и Speaking будут приходить вам сообщением</span>')
                + '</div>'
                + '<div class="flex items-center gap-2">'
                + (on ? '<button type="button" data-tg="test" class="text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 px-3 py-2 rounded-xl transition cursor-pointer">Отправить тест</button>' : '')
                + (s.connected && !s.enabled ? '<button type="button" data-tg="enable" class="text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 px-3 py-2 rounded-xl transition cursor-pointer">Включить</button>' : '')
                + '<button type="button" data-tg="toggle" class="text-xs font-bold ' + (s.connected ? 'text-slate-600 bg-gray-100 hover:bg-gray-200' : 'text-white bg-sky-600 hover:bg-sky-700') + ' px-3 py-2 rounded-xl transition cursor-pointer">'
                + (open ? 'Свернуть' : s.connected ? 'Настроить' : 'Подключить') + '</button>'
                + '</div></div>';
            var form = !open ? '' :
                '<div class="mt-4 pt-4 border-t border-gray-100 grid md:grid-cols-2 gap-5">'
                + '<ol class="text-xs text-slate-600 space-y-2 list-decimal pl-4 leading-relaxed">'
                + '<li>В Telegram откройте <b>@BotFather</b> → <b>/newbot</b> → придумайте имя и адрес бота. В ответ придёт <b>токен</b> (вида <code class="bg-gray-100 px-1 rounded">123456789:AA…</code>).</li>'
                + '<li>Откройте своего нового бота по ссылке из ответа и нажмите <b>Start</b>.</li>'
                + '<li>Узнайте свой <b>Chat ID</b>: напишите боту <b>@userinfobot</b> — он пришлёт число «Id».</li>'
                + '<li>Вставьте токен и Chat ID справа → <b>Сохранить</b> → <b>Отправить тест</b>.</li>'
                + '</ol>'
                + '<div class="space-y-3">'
                + '<label class="block"><span class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Токен бота</span>'
                + '<input id="tgToken" type="password" autocomplete="off" placeholder="' + (s.token_end ? 'сохранён (…' + esc(s.token_end) + ') — оставьте пустым' : '123456789:AA…') + '" class="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-200"></label>'
                + '<label class="block"><span class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Chat ID</span>'
                + '<input id="tgChat" type="text" inputmode="numeric" autocomplete="off" value="' + esc(s.chat_id || '') + '" placeholder="123456789" class="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-200"></label>'
                + '<label class="flex items-center gap-2 text-xs font-medium text-slate-600"><input id="tgEnabled" type="checkbox" class="w-4 h-4 accent-sky-600" ' + (s.enabled === false ? '' : 'checked') + '> Присылать уведомления</label>'
                + '<div class="flex flex-wrap gap-2"><button type="button" data-tg="save" class="text-xs font-bold text-white bg-slate-900 hover:bg-sky-700 px-4 py-2 rounded-xl transition cursor-pointer">Сохранить</button>'
                + (s.connected ? '<button type="button" data-tg="test" class="text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 px-4 py-2 rounded-xl transition cursor-pointer">Отправить тест</button>' : '')
                + '</div></div></div>';
            box.innerHTML = '<div class="bg-white border border-gray-100 rounded-2xl p-4 mb-5 shadow-sm">' + status + form
                + '<p id="tgMsg" class="hidden mt-3 text-xs font-medium rounded-xl px-3 py-2"></p></div>';
        }
        box.dataset.open = open ? '1' : '';
        if (window.lucide) lucide.createIcons();
    }

    function tgMsg(text, kind) {
        var el = $('tgMsg');
        if (!el) return;
        el.textContent = text;
        el.className = 'mt-3 text-xs font-medium rounded-xl px-3 py-2 ' + (kind === 'ok' ? 'bg-emerald-50 text-emerald-700' : kind === 'wait' ? 'bg-gray-50 text-gray-500' : 'bg-rose-50 text-rose-700');
    }

    async function tgSave(enabledOverride) {
        var token = $('tgToken') ? $('tgToken').value.trim() : '';
        var chat = $('tgChat') ? $('tgChat').value.trim() : (state.tg && state.tg.chat_id) || '';
        var enabled = enabledOverride !== undefined ? enabledOverride : ($('tgEnabled') ? $('tgEnabled').checked : true);
        tgMsg('Сохраняю…', 'wait');
        var r = await db().rpc('tg_settings_save', { p_token: token || null, p_chat_id: chat || null, p_enabled: enabled });
        if (r.error) { tgMsg(r.error.message || String(r.error), 'err'); return false; }
        state.tg = r.data;
        var wasOpen = $('tgCard') && $('tgCard').dataset.open === '1';
        tgRender(wasOpen && !(state.tg.connected && enabled));
        tgMsg(state.tg.connected ? (enabled ? 'Сохранено. Нажмите «Отправить тест», чтобы проверить.' : 'Сохранено. Уведомления выключены.') : 'Сохранено. Добавьте и токен, и Chat ID.', 'ok');
        render();
        return true;
    }

    async function tgTest() {
        tgMsg('Отправляю тестовое сообщение…', 'wait');
        var r = await db().rpc('tg_send_test');
        if (r.error) { tgMsg(r.error.message || String(r.error), 'err'); return; }
        var id = r.data;
        for (var i = 0; i < 8; i++) {
            await new Promise(function (res) { setTimeout(res, 1500); });
            var q = await db().rpc('tg_test_result', { p_id: id });
            if (q.error) { tgMsg(q.error.message || String(q.error), 'err'); return; }
            if (q.data && !q.data.pending) {
                if (q.data.ok) tgMsg('Готово — сообщение пришло в Telegram ✓', 'ok');
                else tgMsg(tgExplain(q.data.description), 'err');
                return;
            }
        }
        tgMsg('Сообщение отправлено, но Telegram пока не ответил. Проверьте чат с ботом через минуту.', 'wait');
    }

    function bind() {
        document.addEventListener('click', function (e) {
            var f = e.target.closest && e.target.closest('[data-review-filter]');
            if (f) { state.filter = f.getAttribute('data-review-filter'); render(); return; }
            var t = e.target.closest && e.target.closest('[data-tg]');
            if (!t) return;
            var act = t.getAttribute('data-tg');
            if (act === 'toggle') tgRender(!($('tgCard').dataset.open === '1'));
            else if (act === 'save') tgSave();
            else if (act === 'enable') { tgRender(false); tgSave(true); }
            else if (act === 'test') tgTest();
            else if (act === 'refresh') { state.loaded = false; render(); load(); }
        });
        document.addEventListener('change', function (e) {
            if (e.target && e.target.id === 'reviewPeriod') {
                state.period = e.target.value;
                try { localStorage.setItem('reviewInbox:period', state.period); } catch (err) { /* без памяти */ }
                render();
            }
        });
    }

    var started = false;
    window.ReviewInbox = {
        // Вызывается при загрузке Teacher Board: число на вкладке видно сразу
        init: function (opts) {
            opts = opts || {};
            state.teacherId = opts.teacherId || null;
            state.students = opts.students || null;
            if (!started) { started = true; bind(); }
            load();
        },
        // Открыли вкладку
        show: function () {
            render();
            if (!state.tg) tgLoad();
            if (state.loaded && !state.loading) load();   // свежий список при каждом открытии
        },
        _state: state,
        _essayChecked: essayChecked
    };
})();
