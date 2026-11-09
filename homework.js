// =====================================================================
// homework.js — домашнее задание (таблицы из homework.sql)
//
//   Homework.student(box, user)      — карточка на дашборде ученицы (index.html):
//                                      задания, срок, пункты с отметкой «сделано».
//   Homework.teacher(box, studentId) — вкладка «Домашка» в профиле ученицы
//                                      (student-profile.html): выдать, изменить,
//                                      удалить, посмотреть отметки.
//
// Пункт задания — одна строка текста. Ссылку на задание платформы можно
// вставить прямо в строку: у ученицы появится кнопка «Open».
// =====================================================================
(function () {
    'use strict';

    function db() { return typeof _supabase !== 'undefined' ? _supabase : null; }

    // Язык карточки ученицы: из i18n.js, иначе выбор в меню или язык браузера (как в nav.js).
    // Вкладка преподавателя в профиле ученицы остаётся на русском.
    var RU = (function () {
        if (window.I18N) return window.I18N.lang === 'ru';
        try { var s = localStorage.getItem('appLang'); if (s === 'en' || s === 'ru') return s === 'ru'; } catch (e) { /* по браузеру */ }
        var list = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'en'];
        for (var i = 0; i < list.length; i++) {
            if (/^(ru|be|uk|kk)\b/i.test(list[i])) return true;
            if (/^en\b/i.test(list[i])) return false;
        }
        return false;
    })();
    function L(en, ru) { return RU ? ru : en; }
    function esc(s) {
        return String(s === null || s === undefined ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    function icons() { if (window.lucide) try { lucide.createIcons(); } catch (e) { /* без иконок */ } }
    function missingTable(err) {
        return err && (err.code === '42P01' || err.code === 'PGRST205' || err.code === 'PGRST202'
            || /does not exist|Could not find the (table|function)/i.test(String(err.message || '')));
    }

    // Ссылки: только http(s) и страницы сайта (xxx.html?...). Ссылки на этот же
    // сайт превращаются в относительные — работают с любого адреса сайта.
    var URL_RE = /(https?:\/\/[^\s<>"']+|\b[\w.-]+\.html(?:\?[^\s<>"']*)?(?:#[^\s<>"']*)?)/i;
    function safeUrl(u) {
        if (!u) return null;
        u = String(u).trim();
        if (/^https?:\/\/[^\s<>"']+$/i.test(u)) {
            var here = location.origin + location.pathname.replace(/[^/]*$/, '');
            if (u.indexOf(here) === 0 && /^[\w.-]+\.html/i.test(u.slice(here.length))) return u.slice(here.length);
            return u;
        }
        return /^[\w.-]+\.html(?:\?[^\s<>"']*)?(?:#[^\s<>"']*)?$/i.test(u) ? u : null;
    }
    function parseLines(text) {
        return String(text || '').split(/\r?\n/).map(function (l) { return l.trim(); }).filter(Boolean).map(function (line) {
            var m = line.match(URL_RE);
            var url = m ? safeUrl(m[1]) : null;
            var t = m ? (line.slice(0, m.index) + ' ' + line.slice(m.index + m[1].length)) : line;
            t = t.replace(/\s+/g, ' ').replace(/[\s\-–—:|·→]+$/, '').replace(/^[\s\-–—•·*]+/, '').trim();
            if (!t) t = url ? 'Задание по ссылке' : line;
            return { text: t.slice(0, 500), url: url };
        });
    }
    function itemsToText(items) {
        return items.map(function (i) { return i.text + (i.url ? ' ' + i.url : ''); }).join('\n');
    }

    var MONTHS = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
    var MONTHS_FULL = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    var MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    function fmtDate(iso, en) {
        var p = String(iso || '').split('-');
        if (p.length !== 3) return '';
        return en ? MONTHS_EN[(+p[1]) - 1] + ' ' + (+p[2]) : (+p[2]) + ' ' + MONTHS[(+p[1]) - 1];
    }
    // forStudent — подписи для ученицы (на её языке), иначе коротко по-русски (профиль, преподаватель)
    function dueChip(iso, allDone, forStudent) {
        if (!iso) return '';
        var p = String(iso).split('-').map(Number);
        var due = new Date(p[0], p[1] - 1, p[2]);
        var t = new Date(); t.setHours(0, 0, 0, 0);
        var days = Math.round((due - t) / 864e5);
        var en = forStudent && !RU, ruSt = forStudent && RU;
        var dayRu = (+p[2]) + ' ' + MONTHS_FULL[(+p[1]) - 1];
        var text = en ? 'Due ' + fmtDate(iso, true) : ruSt ? 'Срок: ' + dayRu : 'до ' + fmtDate(iso);
        var cls = 'bg-gray-50 text-gray-500 border-gray-100';
        if (!allDone) {
            if (days < 0) { text = en ? 'Overdue, was due ' + fmtDate(iso, true) : ruSt ? 'Просрочено, срок был ' + dayRu : 'просрочено · ' + fmtDate(iso); cls = 'bg-rose-50 text-rose-600 border-rose-100'; }
            else if (days === 0) { text = en ? 'Due today' : ruSt ? 'Сдать сегодня' : 'сегодня'; cls = 'bg-amber-50 text-amber-700 border-amber-100'; }
            else if (days === 1) { text = en ? 'Due tomorrow' : ruSt ? 'Сдать завтра' : 'до завтра'; cls = 'bg-amber-50 text-amber-700 border-amber-100'; }
        }
        return '<span class="shrink-0 text-[10px] font-bold px-2 py-1 rounded-lg border ' + cls + '">' + esc(text) + '</span>';
    }
    function doneAt(iso) {
        var t = Date.parse(iso || '');
        return isNaN(t) ? '' : new Date(t).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
    }

    async function loadFor(studentId) {
        var r = await db().from('homework').select('*').eq('student_id', studentId).order('created_at', { ascending: false });
        if (r.error) throw r.error;
        var list = r.data || [];
        if (!list.length) return [];
        var ids = list.map(function (h) { return h.id; });
        var r2 = await db().from('homework_items').select('*').in('homework_id', ids).order('position', { ascending: true });
        if (r2.error) throw r2.error;
        var by = {};
        (r2.data || []).forEach(function (i) { (by[String(i.homework_id)] = by[String(i.homework_id)] || []).push(i); });
        list.forEach(function (h) {
            h.items = (by[String(h.id)] || []).sort(function (a, b) { return (a.position - b.position) || (a.id - b.id); });
            h.nDone = h.items.filter(function (i) { return i.done; }).length;
            h.allDone = h.items.length > 0 && h.nDone === h.items.length;
            h.lastDone = h.items.reduce(function (m, i) { return i.done_at && i.done_at > m ? i.done_at : m; }, '');
        });
        return list;
    }

    // =================== Ученица: карточка на дашборде ===================
    function student(box, user) {
        if (!box || !db() || !user || user.role === 'teacher' || user.role === 'guest') return;
        var list = [];
        var showDone = false;

        function isRecent(h) {
            var t = Date.parse(h.lastDone || '');
            return !isNaN(t) && Date.now() - t < 3 * 864e5;
        }

        function render() {
            var active = list.filter(function (h) { return h.items.length && (!h.allDone || isRecent(h)); });
            var done = list.filter(function (h) { return h.items.length && h.allDone && !isRecent(h); });
            box.dispatchEvent(new CustomEvent('homework:rendered', { detail: { count: active.length, open: active.filter(function (h) { return !h.allDone; }).length } }));
            if (!active.length && !done.length) { box.classList.add('hidden'); box.innerHTML = ''; return; }
            var open = active.filter(function (h) { return !h.allDone; });
            var left = open.reduce(function (s, h) { return s + h.items.length - h.nDone; }, 0);

            box.classList.remove('hidden');
            box.innerHTML = '<div class="bg-white p-5 sm:p-6 rounded-3xl border border-amber-100 shadow-sm">'
                + '<div class="flex items-center justify-between gap-3 mb-4">'
                +   '<div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0"><i data-lucide="notebook-pen" class="w-5 h-5"></i></div>'
                +   '<div><h3 class="text-base font-bold text-slate-900 tracking-tight">' + L('Homework', 'Домашнее задание') + '</h3>'
                +   '<p class="text-xs text-gray-500 mt-0.5">' + L('Tick each task when it\'s done, your teacher sees your progress', 'Отмечайте задания, когда сделаете: преподаватель видит ваш прогресс') + '</p></div></div>'
                +   (left ? '<span class="shrink-0 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-lg">' + L(left + ' left', 'осталось ' + left) + '</span>'
                          : '<span class="shrink-0 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg">' + L('All done ✓', 'Всё сделано ✓') + '</span>')
                + '</div>'
                + '<div class="space-y-3">' + active.map(card).join('') + '</div>'
                + (done.length ? '<button type="button" data-hw-showdone class="mt-3 text-xs font-bold text-gray-400 hover:text-slate-700 transition cursor-pointer">'
                    + (showDone ? L('Hide completed', 'Скрыть выполненные') : L('Completed earlier', 'Выполненные раньше') + ' (' + done.length + ')') + '</button>'
                    + (showDone ? '<div class="space-y-3 mt-3">' + done.map(card).join('') + '</div>' : '') : '')
                + '<p data-hw-msg class="hidden mt-3 text-xs font-medium text-rose-600"></p>'
                + '</div>';
            icons();
        }

        function card(h) {
            var pct = h.items.length ? Math.round(h.nDone / h.items.length * 100) : 0;
            return '<div class="rounded-2xl border ' + (h.allDone ? 'border-emerald-100 bg-emerald-50/30' : 'border-gray-100 bg-gray-50/40') + ' p-4">'
                + '<div class="flex items-start justify-between gap-3">'
                +   '<div class="min-w-0"><h4 class="text-sm font-bold text-slate-900">' + esc(h.title || L('Homework', 'Домашнее задание')) + '</h4>'
                +   (h.note ? '<p class="text-xs text-slate-500 mt-1 whitespace-pre-line leading-relaxed">' + esc(h.note) + '</p>' : '') + '</div>'
                +   dueChip(h.due_date, h.allDone, true)
                + '</div>'
                + '<div class="flex items-center gap-3 mt-3"><div class="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div class="h-full ' + (h.allDone ? 'bg-emerald-500' : 'bg-amber-500') + ' rounded-full transition-all" style="width:' + pct + '%"></div></div>'
                +   '<span class="text-[11px] font-bold text-gray-400">' + h.nDone + L(' of ', ' из ') + h.items.length + '</span></div>'
                + '<ul class="mt-3 space-y-1">' + h.items.map(function (i) {
                    var url = safeUrl(i.url);
                    return '<li class="flex items-center gap-3 py-1">'
                        + '<label class="flex items-center gap-3 flex-1 min-w-0 cursor-pointer">'
                        +   '<input type="checkbox" data-hw-item="' + esc(i.id) + '" ' + (i.done ? 'checked' : '') + ' class="w-[18px] h-[18px] shrink-0 accent-emerald-600 cursor-pointer">'
                        +   '<span class="text-sm ' + (i.done ? 'text-gray-400 line-through' : 'text-slate-700') + '">' + esc(i.text) + '</span>'
                        + '</label>'
                        + (url ? '<a href="' + esc(url) + '"' + (/^https?:/i.test(url) ? ' target="_blank" rel="noopener"' : '')
                            + ' class="shrink-0 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition flex items-center gap-1">' + L('Open', 'Открыть') + ' <i data-lucide="arrow-right" class="w-3 h-3"></i></a>' : '')
                        + '</li>';
                }).join('') + '</ul></div>';
        }

        function msg(text) {
            var el = box.querySelector('[data-hw-msg]');
            if (!el) return;
            el.textContent = text || '';
            el.classList.toggle('hidden', !text);
        }

        box.addEventListener('change', async function (e) {
            var cb = e.target && e.target.closest ? e.target.closest('[data-hw-item]') : null;
            if (!cb) return;
            var id = cb.getAttribute('data-hw-item');
            var want = cb.checked;
            var item = null, hw = null;
            list.forEach(function (h) { h.items.forEach(function (i) { if (String(i.id) === id) { item = i; hw = h; } }); });
            if (!item) return;
            cb.disabled = true;
            var r = await db().rpc('homework_set_done', { p_item: Number(id), p_done: want });
            if (r.error) {
                cb.checked = !want;
                cb.disabled = false;
                msg(L('The tick wasn\'t saved. Check your connection and try again.', 'Отметка не сохранилась. Проверьте интернет и попробуйте ещё раз.'));
                return;
            }
            item.done = want;
            item.done_at = want ? new Date().toISOString() : null;
            hw.nDone = hw.items.filter(function (i) { return i.done; }).length;
            hw.allDone = hw.items.length > 0 && hw.nDone === hw.items.length;
            hw.lastDone = hw.items.reduce(function (m, i) { return i.done_at && i.done_at > m ? i.done_at : m; }, '');
            render();
        });
        box.addEventListener('click', function (e) {
            if (e.target && e.target.closest && e.target.closest('[data-hw-showdone]')) { showDone = !showDone; render(); }
        });

        loadFor(user.id).then(function (l) { list = l; render(); }, function (err) {
            if (!missingTable(err)) console.warn('Домашнее задание не загрузилось:', err);
            box.classList.add('hidden');
            box.dispatchEvent(new CustomEvent('homework:rendered', { detail: { count: 0 } }));
        });
    }

    // =================== Преподаватель: вкладка в профиле ===================
    function teacher(box, studentId) {
        if (!box || !db() || !studentId) return;
        // вкладку открывают много раз — обработчики вешаем один раз, дальше только обновляем
        if (box.__hwReload) { box.__hwReload(); return; }
        var list = [];
        var editing = null;   // id задания, которое правим
        var busy = false;

        function form() {
            var h = editing ? list.find(function (x) { return String(x.id) === String(editing); }) : null;
            return '<form data-hw-form class="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 self-start">'
                + '<div><h3 class="text-base font-bold text-slate-900">' + (h ? 'Изменить задание' : 'Новое задание') + '</h3>'
                + '<p class="text-[11px] text-gray-400 mt-0.5">Ученица увидит его на своём дашборде</p></div>'
                + '<label class="block"><span class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Название</span>'
                + '<input name="title" maxlength="200" value="' + esc(h ? h.title : '') + '" placeholder="Homework" class="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"></label>'
                + '<label class="block"><span class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Срок</span>'
                + '<input name="due" type="date" value="' + esc(h && h.due_date ? h.due_date : '') + '" class="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"></label>'
                + '<label class="block"><span class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Пункты — каждый с новой строки</span>'
                + '<textarea name="items" rows="6" placeholder="Read in Daily Life: тесты 12–15 read-daily.html&#10;Write an Email: Library hours&#10;Vocabulary: список 4" class="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-200">'
                + esc(h ? itemsToText(h.items) : '') + '</textarea>'
                + '<span class="block text-[11px] text-gray-400 mt-1">Ссылку на задание можно вставить прямо в строку — у ученицы появится кнопка «Open». Дашборд ученицы на английском, так что название и пункты можно писать по-английски.</span></label>'
                + '<label class="block"><span class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Комментарий (необязательно)</span>'
                + '<textarea name="note" rows="2" maxlength="2000" class="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200">' + esc(h && h.note ? h.note : '') + '</textarea></label>'
                + '<div class="flex flex-wrap gap-2"><button type="submit" class="text-xs font-bold text-white bg-slate-900 hover:bg-indigo-600 px-4 py-2.5 rounded-xl transition cursor-pointer">' + (h ? 'Сохранить изменения' : 'Выдать задание') + '</button>'
                + (h ? '<button type="button" data-hw-cancel class="text-xs font-bold text-slate-600 bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-xl transition cursor-pointer">Отмена</button>' : '') + '</div>'
                + '<p data-hw-msg class="hidden text-xs font-medium rounded-xl px-3 py-2"></p>'
                + '</form>';
        }

        function listHtml() {
            if (!list.length) return '<div class="text-center py-12 text-gray-400 text-sm bg-gray-50 rounded-2xl border border-dashed border-gray-200">Заданий пока нет — выдайте первое слева.</div>';
            return list.map(function (h) {
                return '<div class="bg-white p-5 rounded-2xl border ' + (String(editing) === String(h.id) ? 'border-indigo-300 ring-2 ring-indigo-100' : 'border-gray-100') + ' shadow-sm">'
                    + '<div class="flex items-start justify-between gap-3">'
                    +   '<div class="min-w-0"><h4 class="text-sm font-bold text-slate-900">' + esc(h.title || 'Homework') + '</h4>'
                    +   '<p class="text-[10px] text-gray-400 mt-0.5">выдано ' + esc(doneAt(h.created_at)) + '</p></div>'
                    +   '<div class="flex items-center gap-2 shrink-0">' + dueChip(h.due_date, h.allDone)
                    +   '<span class="text-[10px] font-extrabold px-2 py-1 rounded-lg ' + (h.allDone ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-slate-600') + '">' + h.nDone + ' / ' + h.items.length + '</span></div>'
                    + '</div>'
                    + (h.note ? '<p class="text-xs text-slate-500 mt-2 whitespace-pre-line">' + esc(h.note) + '</p>' : '')
                    + '<ul class="mt-3 space-y-1.5">' + h.items.map(function (i) {
                        return '<li class="flex items-start gap-2 text-sm">'
                            + (i.done ? '<span class="w-4 h-4 mt-0.5 rounded bg-emerald-500 text-white flex items-center justify-center shrink-0 text-[10px] font-black">✓</span>'
                                      : '<span class="w-4 h-4 mt-0.5 rounded border-2 border-gray-300 shrink-0"></span>')
                            + '<span class="flex-1 ' + (i.done ? 'text-gray-500' : 'text-slate-700') + '">' + esc(i.text)
                            + (safeUrl(i.url) ? ' <a href="' + esc(safeUrl(i.url)) + '" target="_blank" rel="noopener" class="text-indigo-600 text-xs font-bold hover:underline">ссылка</a>' : '') + '</span>'
                            + (i.done ? '<span class="text-[10px] font-semibold text-emerald-600 shrink-0">' + esc(doneAt(i.done_at)) + '</span>' : '')
                            + '</li>';
                    }).join('') + '</ul>'
                    + '<div class="flex gap-3 mt-4 pt-3 border-t border-gray-50">'
                    + '<button type="button" data-hw-edit="' + esc(h.id) + '" class="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer">Изменить</button>'
                    + '<button type="button" data-hw-del="' + esc(h.id) + '" class="text-xs font-bold text-gray-400 hover:text-rose-600 cursor-pointer">Удалить</button>'
                    + '</div></div>';
            }).join('');
        }

        function render() {
            box.innerHTML = '<div class="grid grid-cols-1 lg:grid-cols-5 gap-6">' + form()
                + '<div class="lg:col-span-3 space-y-3">' + listHtml() + '</div></div>';
            icons();
        }

        function msg(text, ok) {
            var el = box.querySelector('[data-hw-msg]');
            if (!el) return;
            el.textContent = text || '';
            el.className = 'text-xs font-medium rounded-xl px-3 py-2 ' + (ok ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700');
            if (!text) el.classList.add('hidden');
        }

        async function reload() {
            try {
                list = await loadFor(studentId);
                render();
            } catch (err) {
                box.innerHTML = missingTable(err)
                    ? '<div class="bg-white p-6 rounded-3xl border border-gray-100 text-sm text-slate-600">Чтобы выдавать домашние задания, один раз запустите <b>homework.sql</b> в Supabase (SQL Editor).</div>'
                    : '<div class="text-rose-500 text-center py-10 text-sm font-bold">Ошибка загрузки: ' + esc(err.message || err) + '</div>';
            }
        }

        async function save(f) {
            if (busy) return;
            var items = parseLines(f.items.value);
            if (!items.length) { msg('Добавьте хотя бы один пункт.'); return; }
            var row = {
                title: f.title.value.trim() || 'Homework',
                due_date: f.due.value || null,
                note: f.note.value.trim() || null,
                updated_at: new Date().toISOString()
            };
            busy = true;
            try {
                var hwId;
                if (editing) {
                    hwId = editing;
                    var u = await db().from('homework').update(row).eq('id', hwId).select('id');
                    if (u.error) throw u.error;
                    if (!u.data || !u.data.length) throw new Error('База не дала сохранить (нет прав?)');
                    // Пункты: совпавшие по тексту и ссылке сохраняют отметку «сделано»
                    var old = (list.find(function (x) { return String(x.id) === String(hwId); }) || { items: [] }).items.slice();
                    var keep = [], add = [];
                    items.forEach(function (it, pos) {
                        var k = old.findIndex(function (o) { return o.text === it.text && (o.url || null) === (it.url || null); });
                        if (k >= 0) { keep.push({ id: old[k].id, position: pos }); old.splice(k, 1); }
                        else add.push({ homework_id: hwId, position: pos, text: it.text, url: it.url });
                    });
                    if (old.length) {
                        var d = await db().from('homework_items').delete().in('id', old.map(function (o) { return o.id; }));
                        if (d.error) throw d.error;
                    }
                    for (var i = 0; i < keep.length; i++) {
                        var p = await db().from('homework_items').update({ position: keep[i].position }).eq('id', keep[i].id);
                        if (p.error) throw p.error;
                    }
                    if (add.length) {
                        var a = await db().from('homework_items').insert(add);
                        if (a.error) throw a.error;
                    }
                } else {
                    row.student_id = studentId;
                    var ins = await db().from('homework').insert([row]).select('id').single();
                    if (ins.error) throw ins.error;
                    hwId = ins.data.id;
                    var it2 = await db().from('homework_items').insert(items.map(function (it, pos) {
                        return { homework_id: hwId, position: pos, text: it.text, url: it.url };
                    }));
                    if (it2.error) {
                        await db().from('homework').delete().eq('id', hwId);   // без пунктов задание не нужно
                        throw it2.error;
                    }
                }
                var wasEdit = !!editing;
                editing = null;
                await reload();
                msg(wasEdit ? 'Изменения сохранены.' : 'Задание выдано — ученица увидит его на дашборде.', true);
            } catch (err) {
                msg(missingTable(err) ? 'Сначала запустите homework.sql в Supabase.' : 'Не сохранилось: ' + (err.message || err));
            } finally {
                busy = false;
            }
        }

        box.addEventListener('submit', function (e) {
            var f = e.target.closest && e.target.closest('[data-hw-form]');
            if (!f) return;
            e.preventDefault();
            save(f);
        });
        box.addEventListener('click', async function (e) {
            var t = e.target;
            if (!t || !t.closest) return;
            var ed = t.closest('[data-hw-edit]');
            if (ed) { editing = ed.getAttribute('data-hw-edit'); render(); var f = box.querySelector('[data-hw-form]'); if (f) f.scrollIntoView({ block: 'nearest' }); return; }
            if (t.closest('[data-hw-cancel]')) { editing = null; render(); return; }
            var del = t.closest('[data-hw-del]');
            if (del) {
                var id = del.getAttribute('data-hw-del');
                var h = list.find(function (x) { return String(x.id) === String(id); });
                if (!confirm('Удалить задание «' + ((h && h.title) || 'Домашнее задание') + '»? Отметки ученицы тоже удалятся.')) return;
                var r = await db().from('homework').delete().eq('id', id).select('id');
                if (r.error || !r.data || !r.data.length) { alert('Не удалилось: ' + ((r.error && r.error.message) || 'нет прав')); return; }
                if (String(editing) === String(id)) editing = null;
                reload();
            }
        });

        box.__hwReload = function () { if (!busy && !editing) reload(); };
        box.innerHTML = '<div class="text-center py-10 text-gray-400 text-sm">Загрузка…</div>';
        reload();
    }

    window.Homework = { student: student, teacher: teacher, _parse: parseLines, _safeUrl: safeUrl };
})();
