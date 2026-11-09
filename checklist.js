// =====================================================================
// checklist.js — чек-листы ошибок учениц (таблица из checklist.sql)
//
//   Checklist.teacher(box, studentId)      — вкладка «Домашка» в профиле ученицы
//                                            (student-profile.html): создать, вставить
//                                            текст, править, «исправлено», удалить.
//   Checklist.studentCard(box, user)       — карточка на дашборде (index.html).
//   Checklist.writing(user, taskType)      — Writing (writing-practice.html): кнопка
//                                            в редакторе и проверка перед Submit.
//   Checklist.beforeSubmit()               — Promise<boolean>: показать «Final check»
//                                            перед отправкой (true — отправлять).
//   Checklist.speaking(box, user, type)    — Speaking (speaking_player.html): блок
//                                            «перед началом» на стартовом экране.
//
// Чек-лист = группы с пунктами. Группа без пунктов — раздел (заголовок
// с пояснением). Группа с отметкой «перед сдачей» показывается ученице
// перед Submit в Writing и на стартовом экране Speaking.
// В тексте пункта: **жирный**, *курсив*, «(было: …)» — показывается
// как ошибка ученицы.
// Страницы ученицы — на английском, страницы преподавателя — на русском;
// сами пункты — как их написал преподаватель.
// =====================================================================
(function () {
    'use strict';

    var TABLE = 'student_checklists';
    var SCOPES = [
        { id: 'writing',       ru: 'Writing — все задания',  en: 'Writing',             sec: 'writing'  },
        { id: 'email',         ru: 'Write an Email',         en: 'Write an Email',      sec: 'writing'  },
        { id: 'academic',      ru: 'Academic Discussion',    en: 'Academic Discussion', sec: 'writing'  },
        { id: 'speaking',      ru: 'Speaking — все задания', en: 'Speaking',            sec: 'speaking' },
        { id: 'listen_repeat', ru: 'Listen & Repeat',        en: 'Listen & Repeat',     sec: 'speaking' },
        { id: 'interview',     ru: 'Take an Interview',      en: 'Take an Interview',   sec: 'speaking' }
    ];
    var SEC_COLOR = { writing: '#059669', speaking: '#e11d48' };
    var LIMITS = { title: 200, note: 2000, text: 1000, groups: 150, items: 600 };
    var FINAL_RE = /перед\s+(сдачей|отправкой|началом|ответом|submit)|финальн|последн\S*\s+проверк|final\s+check|before\s+(you\s+)?(submit|start|answer|send)/i;

    function scopeOf(id) { return SCOPES.find(function (s) { return s.id === id; }) || SCOPES[0]; }
    function db() {
        if (typeof _supabase !== 'undefined' && _supabase) return _supabase;
        return window.supabaseClient || null;
    }
    function esc(s) {
        return String(s === null || s === undefined ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    function str(v) { return v === null || v === undefined ? '' : String(v); }

    // Язык того, что видит ученица (дашборд, панель чек-листа, Writing и Speaking):
    // из i18n.js, иначе выбор в меню или язык браузера (как в nav.js).
    // Редактор преподавателя остаётся на русском.
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
    // «5 points to watch» / «5 пунктов на контроле»
    function toWatch(n) { return RU ? plural(n, W_ITEM) + ' на контроле' : n + (n === 1 ? ' point' : ' points') + ' to watch'; }
    function fixedN(n) { return RU ? 'исправлено: ' + n : n + ' fixed'; }
    function nid(p) { return p + Math.random().toString(36).slice(2, 10); }
    function icons() { if (window.lucide) try { lucide.createIcons(); } catch (e) { /* без иконок */ } }
    function missingTable(err) {
        return err && (err.code === '42P01' || err.code === 'PGRST205'
            || /does not exist|Could not find the table/i.test(String(err.message || '')));
    }
    function plural(n, f) {
        var a = Math.abs(n) % 100, b = a % 10;
        return n + ' ' + ((a > 10 && a < 20) ? f[2] : b === 1 ? f[0] : (b >= 2 && b <= 4) ? f[1] : f[2]);
    }
    var W_ITEM = ['пункт', 'пункта', 'пунктов'];
    var W_GROUP = ['группа', 'группы', 'групп'];
    function shortDate(iso, en) {
        var t = Date.parse(iso || '');
        if (isNaN(t)) return '';
        return new Date(t).toLocaleDateString(en ? 'en-US' : 'ru-RU', { day: 'numeric', month: 'short' });
    }

    // ---------- Общие стили (одни на страницу) ----------
    function injectStyle() {
        if (document.getElementById('ck-style')) return;
        var st = document.createElement('style');
        st.id = 'ck-style';
        st.textContent = ''
            + '.ck-was{color:#be123c;font-size:.92em;white-space:nowrap}'
            + '.ck-was s{text-decoration-thickness:1px;text-decoration-color:rgba(190,18,60,.55)}'
            + '.ck-txt b{font-weight:700;color:#0f172a}.ck-txt i{font-style:italic}'
            + '.ck-panel{transition:transform .28s cubic-bezier(.2,.8,.2,1)}'
            + '.ck-shade{transition:opacity .2s ease}'
            + '.ck-auto{resize:none;overflow:hidden}'
            + '@media (prefers-reduced-motion:reduce){.ck-panel,.ck-shade{transition:none}}'
            + '.ck-row .ck-tools{opacity:0}.ck-row:hover .ck-tools,.ck-row:focus-within .ck-tools{opacity:1}'
            + '@media (hover:none){.ck-row .ck-tools{opacity:1}}';
        document.head.appendChild(st);
    }

    // Текст пункта: экранирование, «(было: …)», **жирный**, *курсив*
    function fmt(s) {
        var h = esc(s);
        h = h.replace(/\((было|was)\s*:\s*([^()]*?)\)/gi, function (m, w, x) {
            return '<span class="ck-was">' + w + ': <s>' + x + '</s></span>';
        });
        h = h.replace(/\*\*([^*\n]+?)\*\*/g, '<b>$1</b>');
        h = h.replace(/(^|[^\w*])\*([^\s*](?:[^*\n]*[^\s*])?)\*(?![\w*])/g, '$1<i>$2</i>');
        return h;
    }

    // ---------- Содержание: проверка формы, подсчёты ----------
    function normalize(c) {
        c = (c && typeof c === 'object') ? c : {};
        var seen = {};
        function uniq(id, p) { id = str(id); if (!id || seen[id]) id = nid(p); seen[id] = 1; return id; }
        var groups = Array.isArray(c.groups) ? c.groups : [];
        return {
            groups: groups.filter(function (g) { return g && typeof g === 'object'; }).map(function (g) {
                return {
                    id: uniq(g.id, 'g'),
                    title: str(g.title),
                    note: str(g.note),
                    final: !!g.final,
                    items: (Array.isArray(g.items) ? g.items : []).map(function (i) {
                        if (typeof i === 'string') i = { text: i };
                        if (!i || typeof i !== 'object') return null;
                        return { id: uniq(i.id, 'i'), text: str(i.text), fixed: !!i.fixed, fixedAt: i.fixed ? (i.fixedAt || null) : null };
                    }).filter(Boolean)
                };
            })
        };
    }
    // Перед сохранением: обрезать пробелы, убрать пустые пункты и пустые группы
    function clean(c) {
        return {
            groups: normalize(c).groups.map(function (g) {
                return {
                    id: g.id,
                    title: g.title.trim().slice(0, LIMITS.title),
                    note: g.note.trim().slice(0, LIMITS.note),
                    final: g.final,
                    items: g.items.map(function (i) {
                        return { id: i.id, text: i.text.replace(/\s+/g, ' ').trim().slice(0, LIMITS.text), fixed: i.fixed, fixedAt: i.fixedAt };
                    }).filter(function (i) { return i.text; })
                };
            }).filter(function (g) { return g.title || g.note || g.items.length; })
        };
    }
    function stats(c) {
        var s = { groups: 0, items: 0, fixed: 0, active: 0, finalItems: 0 };
        normalize(c).groups.forEach(function (g) {
            s.groups++;
            g.items.forEach(function (i) {
                s.items++;
                if (i.fixed) s.fixed++; else { s.active++; if (g.final) s.finalItems++; }
            });
        });
        return s;
    }
    function copyGroup(g) {
        return { id: nid('g'), title: g.title, note: g.note, final: !!g.final,
                 items: g.items.map(function (i) { return { id: nid('i'), text: i.text, fixed: false, fixedAt: null }; }) };
    }

    // ---------- Разбор вставленного текста ----------
    // Понимает: документ из PDF (строки перенесены), текст из Word/Docs
    // (одна строка — один абзац) и Markdown (#, ##, -, - [ ]).
    var STRONG = /^(?:[•●○◦▪▫■□☐☑☒✓✔✗✘]|[-*+](?=\s)|\d{1,2}[.)](?=\s)|\[[ xX]?\](?=\s))\s*/;
    var WEAK = /^[–—·](?=\s)\s*/;
    var MD_HEAD = /^(#{1,6})\s+(.*)$/;
    var TERMINAL = /[.!?…)»"]$/;
    var JUNK = /^[•●○◦▪▫■□☐\-*+·–—_=\s]+$/;
    function stripBullets(s) {
        var prev;
        do { prev = s; s = s.replace(STRONG, '').replace(WEAK, '').trim(); } while (s !== prev);
        return s;
    }
    function guessScope(text) {
        var t = String(text || '');
        if (/e-?mail/i.test(t)) return 'email';
        if (/academic|discussion/i.test(t)) return 'academic';
        if (/interview/i.test(t)) return 'interview';
        if (/listen/i.test(t)) return 'listen_repeat';
        if (/speaking|спикинг|говорени/i.test(t)) return 'speaking';
        return null;
    }
    function parseText(raw) {
        var phys = String(raw || '').replace(/\r\n?/g, '\n').split('\n').map(function (l) {
            return l.replace(/[\t   ]/g, ' ').replace(/\s+$/, '');
        });
        var lens = phys.map(function (l) { return l.trim().length; }).filter(function (n) { return n > 3; }).sort(function (a, b) { return a - b; });
        var p90 = lens.length ? lens[Math.min(lens.length - 1, Math.floor(lens.length * 0.9))] : 0;
        // Похоже на текст из PDF: длинные строки одной ширины, абзацы перенесены
        var wrapMode = lens.length >= 6 && p90 <= 125 && lens.filter(function (n) { return n >= p90 * 0.8; }).length >= 3;
        // Строка «во всю ширину» — абзац продолжается на следующей
        var longAt = Math.max(40, Math.round(Math.min(p90 * 0.86, p90 - 11)));
        var LOWER = /^[a-zа-яё0-9(«"'…,.;:)\]–—-]/;

        var logical = [];
        var cont = null, contLen = 0, contTerm = false;
        phys.forEach(function (line) {
            var t = line.trim();
            if (!t || JUNK.test(t)) { cont = null; return; }
            var md = t.match(MD_HEAD);
            if (md) { logical.push({ kind: 'head', text: md[2].replace(/[#\s]+$/, '').trim(), md: md[1].length }); cont = null; return; }
            var strong = STRONG.test(t);
            var join = cont && wrapMode && !strong && (
                (LOWER.test(t) && contLen >= p90 * 0.6) ||      // продолжение с маленькой буквы
                (contLen >= longAt && !contTerm));              // предыдущая строка оборвана на полуслове
            if (join) {
                cont.text += ' ' + t; cont.joined = true; contLen = t.length; contTerm = TERMINAL.test(t);
                return;
            }
            var bullet = strong || WEAK.test(t);
            var entry = bullet ? { kind: 'item', text: stripBullets(t) } : { kind: 'text', text: t };
            if (!entry.text) { cont = null; return; }
            logical.push(entry);
            cont = entry; contLen = t.length; contTerm = TERMINAL.test(t);
        });

        var hasItems = logical.some(function (e) { return e.kind === 'item'; });
        logical.forEach(function (e) {
            if (e.kind !== 'text') return;
            if (!hasItems) { e.kind = /:$/.test(e.text) && e.text.length <= 80 ? 'head' : 'item'; return; }
            e.kind = (!e.joined && e.text.length <= 80 && !/[.!?…;,]$/.test(e.text)) ? 'head' : 'note';
        });

        // Заголовок документа и строка с датой/автором в самом начале
        var title = '';
        var start = 0;
        if (logical[0] && logical[0].kind === 'head' && (logical[0].md === 1 || /чек-?\s?лист|check-?\s?list/i.test(logical[0].text))) {
            title = logical[0].text; start = 1;
        }
        while (start < Math.min(logical.length, 3) && logical[start].kind !== 'item' && logical[start].text.length < 70
               && (/(^|\s)@\w/.test(logical[start].text) || /^(\d{1,2}[./]\d{1,2}[./]\d{2,4}|[A-Za-zА-Яа-яё]{3,9}\.?\s+\d{1,2},?\s+\d{4}|\d{1,2}\s+[A-Za-zА-Яа-яё]{3,9}\.?\s+\d{4})/.test(logical[start].text))) {
            start++;
        }

        var groups = [], g = null;
        function newGroup(t) { g = { id: nid('g'), title: t || '', note: '', final: FINAL_RE.test(t || ''), items: [] }; groups.push(g); }
        logical.slice(start).forEach(function (e) {
            if (e.kind === 'head') newGroup(e.text.replace(/\s*:\s*$/, '').slice(0, LIMITS.title));
            else if (e.kind === 'note') {
                if (!g || g.items.length) newGroup('');
                g.note = (g.note ? g.note + '\n' : '') + e.text;
                if (!g.final && FINAL_RE.test(e.text) && !g.items.length && !g.title) g.final = true;
            } else {
                if (!g) newGroup('');
                g.items.push({ id: nid('i'), text: e.text.slice(0, LIMITS.text), fixed: false, fixedAt: null });
            }
        });

        // «София — чек-лист Write an Email» → «Write an Email», «Speaking — чек-лист» → «Speaking»
        var shortTitle = title.replace(/^.*?(чек-?\s?лист|check-?\s?list)\s*[:—–-]?\s*/i, '').trim()
            || title.replace(/\s*[:—–-]?\s*(чек-?\s?лист|check-?\s?list)\s*$/i, '').trim() || title;
        var nItems = groups.reduce(function (s, x) { return s + x.items.length; }, 0);
        return {
            title: shortTitle.slice(0, LIMITS.title),
            scope: guessScope(title) || guessScope(groups.map(function (x) { return x.title; }).join(' ')),
            groups: groups,
            nItems: nItems,
            noBullets: !hasItems && nItems > 0
        };
    }

    // ---------- Загрузка ----------
    async function loadFor(studentId) {
        var r = await db().from(TABLE).select('*').eq('student_id', studentId).order('position', { ascending: true }).order('id', { ascending: true });
        if (r.error) throw r.error;
        return (r.data || []).map(function (l) { l.content = normalize(l.content); return l; });
    }
    function forScopes(lists, scopes) {
        return lists.filter(function (l) { return scopes.indexOf(l.scope) >= 0; });
    }

    // =================== Боковая панель с чек-листом (ученица) ===================
    // lists — чек-листы; opts.title — заголовок панели; opts.preview — показ
    // преподавателю «как видит ученица»
    var drawer = null;
    function openDrawer(lists, opts) {
        injectStyle();
        opts = opts || {};
        lists = (lists || []).filter(function (l) { return l && l.content; });
        if (!lists.length) return;
        var cur = 0;
        if (opts.selectId) { var k = lists.findIndex(function (l) { return String(l.id) === String(opts.selectId); }); if (k >= 0) cur = k; }
        var lastFocus = document.activeElement;

        if (!drawer) {
            drawer = document.createElement('div');
            drawer.className = 'fixed inset-0 z-[200] hidden';
            drawer.setAttribute('role', 'dialog');
            drawer.setAttribute('aria-modal', 'true');
            drawer.setAttribute('aria-labelledby', 'ckDrawerTitle');
            drawer.innerHTML = '<div data-ck-shade class="ck-shade absolute inset-0 bg-slate-900/40" style="opacity:0"></div>'
                + '<div data-ck-panel class="ck-panel absolute top-0 right-0 h-full w-full sm:max-w-md bg-white shadow-2xl flex flex-col" style="transform:translateX(100%)"></div>';
            document.body.appendChild(drawer);
            drawer.addEventListener('click', function (e) {
                if (e.target.closest('[data-ck-shade]') || e.target.closest('[data-ck-close]')) { drawer.__close(); return; }
                var tab = e.target.closest('[data-ck-tab]');
                if (tab) { drawer.__select(Number(tab.getAttribute('data-ck-tab'))); }
            });
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape' && drawer && !drawer.classList.contains('hidden')) drawer.__close();
            });
        }
        var panel = drawer.querySelector('[data-ck-panel]');
        var shade = drawer.querySelector('[data-ck-shade]');

        function render() {
            var l = lists[cur];
            var s = stats(l.content);
            var sc = scopeOf(l.scope);
            var sameAsScope = (l.title || '').trim().toLowerCase() === sc.en.toLowerCase();
            panel.innerHTML = ''
                + '<div class="px-5 sm:px-6 pt-5 pb-4 border-b border-gray-100 shrink-0">'
                +   '<div class="flex items-start justify-between gap-3">'
                +     '<div class="min-w-0">'
                +       '<p class="text-xs font-semibold text-slate-500">' + esc(opts.preview ? 'Как видит ученица' : L('My checklist', 'Мой чек-лист')) + '</p>'
                +       '<h2 id="ckDrawerTitle" class="text-lg font-extrabold text-slate-900 tracking-tight mt-0.5">' + esc(l.title || sc.en) + '</h2>'
                +       '<p class="text-xs text-slate-500 mt-1">' + (sameAsScope ? '' : esc(sc.en) + ' · ') + toWatch(s.active)
                +         (s.fixed ? ' · ' + fixedN(s.fixed) : '') + '</p>'
                +     '</div>'
                +     '<button type="button" data-ck-close class="shrink-0 w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 text-slate-500 hover:text-slate-900 flex items-center justify-center transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300" aria-label="' + L('Close', 'Закрыть') + '">'
                +       '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>'
                +   '</div>'
                +   (lists.length > 1 ? '<div class="flex gap-1.5 mt-4 overflow-x-auto -mx-1 px-1 pb-0.5" role="tablist">' + lists.map(function (x, i) {
                        return '<button type="button" role="tab" aria-selected="' + (i === cur) + '" data-ck-tab="' + i + '" class="shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg transition cursor-pointer '
                            + (i === cur ? 'bg-slate-900 text-white' : 'bg-gray-100 text-slate-600 hover:bg-gray-200') + '">' + esc(x.title || scopeOf(x.scope).en) + '</button>';
                    }).join('') + '</div>' : '')
                + '</div>'
                + '<div class="flex-1 overflow-y-auto px-5 sm:px-6 py-5">' + bodyHtml(l) + '</div>';
        }
        function bodyHtml(l) {
            var groups = l.content.groups;
            var fixed = [];
            var sc = scopeOf(l.scope);
            var html = groups.map(function (g) {
                var active = g.items.filter(function (i) { return !i.fixed; });
                g.items.forEach(function (i) { if (i.fixed) fixed.push(i); });
                if (g.items.length && !active.length && !g.note) return '';
                var isSection = !g.items.length;
                var finalBox = g.final && active.length;
                return '<section class="' + (isSection ? 'pt-3 first:pt-0 mb-3' : 'mb-6') + (finalBox ? ' bg-indigo-50/60 border border-indigo-100 rounded-2xl p-4' : '') + '">'
                    + (finalBox ? '<p class="text-[11px] font-bold text-indigo-600 mb-1">' + (sc.sec === 'speaking' ? L('Before you start', 'Перед началом') : L('Before you submit', 'Перед отправкой')) + '</p>' : '')
                    + (g.title ? '<h3 class="' + (isSection ? 'text-base font-extrabold text-slate-900 tracking-tight' : 'text-sm font-bold text-slate-900') + '">' + esc(g.title) + '</h3>' : '')
                    + (g.note ? '<p class="text-xs text-slate-500 leading-relaxed mt-1 whitespace-pre-line">' + fmt(g.note) + '</p>' : '')
                    + (active.length ? '<ul class="mt-2.5 space-y-2">' + active.map(function (i) {
                        return '<li class="flex gap-2.5 text-sm text-slate-700 leading-relaxed"><span class="mt-[0.55em] w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0"></span><span class="ck-txt min-w-0">' + fmt(i.text) + '</span></li>';
                    }).join('') + '</ul>' : '')
                    + '</section>';
            }).join('');
            if (!html.trim()) html = '<p class="text-sm text-slate-500">' + L('Everything here is fixed. Nice work!', 'Здесь всё исправлено. Отличная работа!') + '</p>';
            if (fixed.length) {
                html += '<details class="mt-2 border-t border-gray-100 pt-4 group">'
                    + '<summary class="cursor-pointer select-none text-xs font-bold text-emerald-700 list-none flex items-center gap-1.5">'
                    + '<span class="w-4 h-4 rounded bg-emerald-500 text-white text-[10px] font-black flex items-center justify-center">✓</span>' + L('Fixed', 'Исправлено') + ' (' + fixed.length + ')'
                    + '<span class="text-gray-400 font-semibold">· ' + L('your teacher marked these as done', 'преподаватель отметил их как исправленные') + '</span></summary>'
                    + '<ul class="mt-3 space-y-1.5">' + fixed.map(function (i) {
                        return '<li class="flex gap-2.5 text-sm text-slate-400 leading-relaxed"><span class="text-emerald-500 shrink-0">✓</span><span class="ck-txt min-w-0">' + fmt(i.text)
                            + (i.fixedAt ? ' <span class="text-[11px] text-gray-300 whitespace-nowrap">' + esc(shortDate(i.fixedAt, !RU)) + '</span>' : '') + '</span></li>';
                    }).join('') + '</ul></details>';
            }
            return html;
        }

        drawer.__select = function (i) { cur = i; render(); var b = panel.querySelector('[data-ck-tab="' + i + '"]'); if (b) b.focus(); };
        drawer.__close = function () {
            panel.style.transform = 'translateX(100%)';
            shade.style.opacity = '0';
            document.documentElement.style.overflow = drawer.__overflow || '';
            setTimeout(function () { drawer.classList.add('hidden'); }, 260);
            if (lastFocus && lastFocus.focus) try { lastFocus.focus(); } catch (e) { /* ок */ }
        };
        render();
        drawer.__overflow = document.documentElement.style.overflow;
        document.documentElement.style.overflow = 'hidden';
        drawer.classList.remove('hidden');
        requestAnimationFrame(function () {
            requestAnimationFrame(function () { panel.style.transform = 'translateX(0)'; shade.style.opacity = '1'; });
        });
        var cl = panel.querySelector('[data-ck-close]');
        if (cl) cl.focus();
    }

    // =================== Ученица: карточка на дашборде ===================
    function studentCard(box, user) {
        if (!box || !db() || !user || user.role === 'teacher' || user.role === 'guest') return;
        injectStyle();
        var lists = [];
        function render() {
            var shown = lists.filter(function (l) { return stats(l.content).items > 0; });
            if (!shown.length) { box.classList.add('hidden'); box.innerHTML = ''; return; }
            box.classList.remove('hidden');
            box.innerHTML = '<div class="bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-xs">'
                + '<div class="flex items-center gap-3 mb-4">'
                +   '<div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0"><i data-lucide="list-checks" class="w-5 h-5"></i></div>'
                +   '<div><h3 class="text-base font-bold text-slate-900 tracking-tight">' + L('My checklist', 'Мой чек-лист') + '</h3>'
                +   '<p class="text-xs text-gray-500 mt-0.5">' + L('What your teacher wants you to watch for. It also opens in Writing and Speaking tasks.', 'На что преподаватель просит обращать внимание. Чек-лист открывается и в заданиях Writing и Speaking.') + '</p></div>'
                + '</div>'
                + '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">' + shown.map(function (l) {
                    var s = stats(l.content), sc = scopeOf(l.scope);
                    var heads = l.content.groups.filter(function (g) { return g.title && g.items.some(function (i) { return !i.fixed; }); }).map(function (g) { return g.title; });
                    return '<button type="button" data-ck-open="' + esc(l.id) + '" class="text-left rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-indigo-200 hover:shadow-sm p-4 transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 min-w-0">'
                        + '<span class="flex items-center gap-2 text-[11px] font-bold text-gray-400"><span class="w-2 h-2 rounded-full shrink-0" style="background:' + SEC_COLOR[sc.sec] + '"></span>'
                        +   (sc.sec === 'speaking' ? 'Speaking' : 'Writing') + '</span>'
                        + '<span class="block text-sm font-bold text-slate-900 mt-1 truncate">' + esc(l.title || sc.en) + '</span>'
                        + (heads.length ? '<span class="block text-xs text-slate-500 mt-1 truncate">' + esc(heads.slice(0, 4).join(' · ')) + '</span>' : '')
                        + '<span class="flex items-center justify-between gap-2 mt-3">'
                        +   '<span class="text-xs font-bold text-slate-700">' + toWatch(s.active)
                        +   (s.fixed ? '<span class="text-emerald-600"> · ' + fixedN(s.fixed) + '</span>' : '') + '</span>'
                        +   '<span class="text-xs font-bold text-indigo-600">' + L('Open', 'Открыть') + '</span>'
                        + '</span></button>';
                }).join('') + '</div></div>';
            icons();
        }
        box.addEventListener('click', function (e) {
            var b = e.target.closest && e.target.closest('[data-ck-open]');
            if (!b) return;
            openDrawer(lists.filter(function (l) { return stats(l.content).items > 0; }), { selectId: b.getAttribute('data-ck-open') });
        });
        loadFor(user.id).then(function (l) { lists = l; render(); }, function (err) {
            if (!missingTable(err)) console.warn('Чек-лист не загрузился:', err);
            box.classList.add('hidden');
        });
    }

    // =================== Ученица: Writing ===================
    // Кнопка в редакторе — в каждый элемент [data-ck-slot] (их создаёт
    // страница), проверка «Final check» — перед Submit.
    var writingLists = null;     // null — ещё не загружены
    var writingLoad = null;
    var ticks = {};              // отметки в окне «Final check» (только на этой странице)
    function writing(user, taskType) {
        if (!db() || !user || writingLoad) return writingLoad;
        injectStyle();
        var scopes = ['writing', taskType];
        writingLoad = loadFor(user.id).then(function (l) {
            writingLists = forScopes(l, scopes).filter(function (x) { return stats(x.content).active > 0; });
        }, function (err) {
            if (!missingTable(err)) console.warn('Чек-лист не загрузился:', err);
            writingLists = [];
        }).then(function () {
            fillSlots();
            if (writingLists.length && window.MutationObserver) {
                new MutationObserver(fillSlots).observe(document.body, { childList: true, subtree: true });
            }
        });
        document.addEventListener('click', function (e) {
            var b = e.target.closest && e.target.closest('[data-ck-writing]');
            if (b) { e.preventDefault(); openDrawer(writingLists); }
        });
        return writingLoad;
    }
    function fillSlots() {
        if (!writingLists || !writingLists.length) return;
        var n = writingLists.reduce(function (s, l) { return s + stats(l.content).active; }, 0);
        document.querySelectorAll('[data-ck-slot]:not([data-ck-filled])').forEach(function (slot) {
            slot.setAttribute('data-ck-filled', '1');
            slot.innerHTML = '<button type="button" data-ck-writing title="' + L('Open your checklist', 'Открыть чек-лист') + '" class="flex items-center gap-1.5 py-1 px-2 rounded bg-white border border-indigo-100 text-indigo-600 hover:bg-indigo-50 shadow-sm transition cursor-pointer">'
                + '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/></svg>'
                + '<span>' + L('Checklist', 'Чек-лист') + '</span><span class="text-indigo-300 font-semibold">' + n + '</span></button>';
        });
    }
    function finalGroups(lists) {
        var out = [];
        (lists || []).forEach(function (l) {
            l.content.groups.forEach(function (g) {
                var items = g.items.filter(function (i) { return !i.fixed; });
                if (g.final && items.length) out.push({ list: l, group: g, items: items });
            });
        });
        return out;
    }
    var pendingCheck = null;
    async function beforeSubmit() {
        if (pendingCheck) return pendingCheck;
        if (writingLoad) { try { await writingLoad; } catch (e) { /* без чек-листа */ } }
        var fg = finalGroups(writingLists);
        if (!fg.length) return true;
        injectStyle();
        pendingCheck = new Promise(function (resolve) {
            var lastFocus = document.activeElement;
            var all = [];
            fg.forEach(function (f) { f.items.forEach(function (i) { all.push(i.id); }); });
            var m = document.createElement('div');
            m.className = 'fixed inset-0 z-[210] bg-slate-900/50 flex items-end sm:items-center justify-center sm:p-4';
            m.setAttribute('role', 'dialog');
            m.setAttribute('aria-modal', 'true');
            m.setAttribute('aria-labelledby', 'ckFinalTitle');
            var multi = fg.length > 1;
            m.innerHTML = '<div class="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col">'
                + '<div class="px-5 sm:px-6 pt-5 pb-3 shrink-0">'
                +   '<h2 id="ckFinalTitle" class="text-lg font-extrabold text-slate-900 tracking-tight">' + L('Final check', 'Финальная проверка') + '</h2>'
                +   '<p class="text-xs text-slate-500 mt-1">' + L('Read your text once more with your teacher\'s list. Tick what you\'ve checked.', 'Перечитайте текст по списку преподавателя и отметьте, что проверили.') + '</p>'
                + '</div>'
                + '<div class="flex-1 overflow-y-auto px-5 sm:px-6 pb-2">' + fg.map(function (f) {
                    return '<div class="mb-4">'
                        + ((multi || f.group.title) ? '<p class="text-xs font-bold text-slate-900 mb-1">' + esc(f.group.title || f.list.title) + '</p>' : '')
                        + (f.group.note ? '<p class="text-xs text-slate-500 mb-2 leading-relaxed">' + fmt(f.group.note) + '</p>' : '')
                        + '<ul class="space-y-1">' + f.items.map(function (i) {
                            return '<li><label class="flex items-start gap-3 py-1.5 cursor-pointer">'
                                + '<input type="checkbox" data-ck-tick="' + esc(i.id) + '"' + (ticks[i.id] ? ' checked' : '') + ' class="mt-0.5 w-[18px] h-[18px] shrink-0 accent-indigo-600 cursor-pointer">'
                                + '<span class="ck-txt text-sm text-slate-700 leading-relaxed">' + fmt(i.text) + '</span></label></li>';
                        }).join('') + '</ul></div>';
                }).join('') + '</div>'
                + '<div class="px-5 sm:px-6 py-4 border-t border-gray-100 flex flex-wrap items-center gap-3 shrink-0">'
                +   '<span data-ck-count class="text-xs font-bold text-slate-500 mr-auto"></span>'
                +   '<button type="button" data-ck-back class="text-sm font-bold text-slate-700 bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-xl transition cursor-pointer">' + L('Back to my text', 'Вернуться к тексту') + '</button>'
                +   '<button type="button" data-ck-go class="text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 rounded-xl shadow-sm transition cursor-pointer">Submit</button>'
                + '</div></div>';
            function count() {
                var n = all.filter(function (id) { return ticks[id]; }).length;
                m.querySelector('[data-ck-count]').textContent = RU ? 'Отмечено ' + n + ' из ' + all.length : n + ' of ' + all.length + ' checked';
            }
            function done(v) {
                m.remove();
                document.removeEventListener('keydown', onKey, true);
                pendingCheck = null;
                if (!v && lastFocus && lastFocus.focus) try { lastFocus.focus(); } catch (e) { /* ок */ }
                resolve(v);
            }
            function onKey(e) { if (e.key === 'Escape') { e.stopPropagation(); done(false); } }
            m.addEventListener('change', function (e) {
                var cb = e.target.closest('[data-ck-tick]');
                if (cb) { ticks[cb.getAttribute('data-ck-tick')] = cb.checked; count(); }
            });
            m.addEventListener('click', function (e) {
                if (e.target === m || e.target.closest('[data-ck-back]')) done(false);
                else if (e.target.closest('[data-ck-go]')) done(true);
            });
            document.addEventListener('keydown', onKey, true);
            document.body.appendChild(m);
            count();
            var first = m.querySelector('[data-ck-tick]');
            if (first) first.focus();
        });
        return pendingCheck;
    }

    // =================== Ученица: Speaking (стартовый экран) ===================
    function speaking(box, user, taskType) {
        if (!box || !db() || !user) return;
        injectStyle();
        loadFor(user.id).then(function (all) {
            var lists = forScopes(all, ['speaking', taskType]).filter(function (x) { return stats(x.content).active > 0; });
            if (!lists.length) { box.classList.add('hidden'); return; }
            var fg = finalGroups(lists);
            var n = lists.reduce(function (s, l) { return s + stats(l.content).active; }, 0);
            box.innerHTML = '<div class="w-full text-left bg-indigo-50/60 border border-indigo-100 rounded-2xl p-4">'
                + (fg.length ? '<p class="text-xs font-bold text-indigo-700">' + L('Before you start', 'Перед началом') + '</p>'
                    + '<div class="max-h-[38vh] overflow-y-auto mt-2 pr-1">' + fg.map(function (f) {
                        return (f.group.title && fg.length > 1 ? '<p class="text-[11px] font-bold text-slate-700 mt-2">' + esc(f.group.title) + '</p>' : '')
                            + '<ul class="space-y-1.5 mt-1">' + f.items.map(function (i) {
                                return '<li class="flex gap-2 text-sm text-slate-700 leading-relaxed"><span class="mt-[0.55em] w-1.5 h-1.5 rounded-full bg-indigo-300 shrink-0"></span><span class="ck-txt min-w-0">' + fmt(i.text) + '</span></li>';
                            }).join('') + '</ul>';
                    }).join('') + '</div>'
                    : '<p class="text-sm text-slate-700">' + (RU ? 'Преподаватель оставил вам чек-лист: <b>' + plural(n, W_ITEM) + '</b> на контроле.'
                                               : 'Your teacher left you a checklist: <b>' + n + (n === 1 ? ' point' : ' points') + '</b> to watch.') + '</p>')
                + '<button type="button" data-ck-speak class="mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer">' + L('Open my full checklist', 'Открыть весь чек-лист') + '</button>'
                + '</div>';
            box.classList.remove('hidden');
            box.addEventListener('click', function (e) {
                if (e.target.closest('[data-ck-speak]')) openDrawer(lists);
            });
        }, function (err) {
            if (!missingTable(err)) console.warn('Чек-лист не загрузился:', err);
            box.classList.add('hidden');
        });
    }

    // =================== Преподаватель: вкладка «Домашка» ===================
    function teacher(box, studentId) {
        if (!box || !db() || !studentId) return;
        if (box.__ckReload) { box.__ckReload(); return; }
        injectStyle();

        var lists = [];        // чек-листы из базы
        var selId = null;      // какой открыт
        var cur = null;        // черновик открытого: { id, title, scope, content, version, updated_at }
        var dirty = false;
        var panel = null;      // 'new' | 'import' | 'copy' | null
        var draftText = '';    // текст во «вставить текст»
        var importMode = 'append';
        var newScope = 'email', newTitle = '';
        var others = null;     // чек-листы других учениц (для «взять из другого»)
        var copyFrom = null, copyPick = {};
        var busy = false;
        var focusNext = null;  // что сфокусировать после перерисовки
        var conflict = false;

        function sel() { return lists.find(function (l) { return String(l.id) === String(selId); }) || null; }
        function openList(id) {
            selId = id;
            var l = sel();
            cur = l ? { id: l.id, title: l.title, scope: l.scope, content: normalize(JSON.parse(JSON.stringify(l.content))), version: l.version, updated_at: l.updated_at } : null;
            dirty = false; conflict = false;
        }
        function setDirty() {
            if (!dirty) { dirty = true; var bar = box.querySelector('[data-ck-savebar]'); if (bar) renderSaveBar(bar); }
        }
        function findGroup(gid) { return cur.content.groups.find(function (g) { return g.id === gid; }); }

        // ----- разметка -----
        function render() {
            var html = '<section class="mt-12" aria-labelledby="ckTeacherTitle">'
                + '<div class="flex flex-wrap items-end justify-between gap-3 mb-4">'
                +   '<div class="min-w-0"><h3 id="ckTeacherTitle" class="text-lg font-bold text-slate-900 tracking-tight">Чек-листы ошибок</h3>'
                +   '<p class="text-xs text-gray-500 mt-0.5 max-w-2xl">Ученица видит их на дашборде, в Writing — кнопкой в редакторе и перед отправкой, в Speaking — перед началом набора. Группа с отметкой «перед сдачей» показывается отдельно, как финальная проверка.</p></div>'
                +   '<button type="button" data-ck="new" class="shrink-0 text-xs font-bold text-white bg-slate-900 hover:bg-indigo-600 px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5"><i data-lucide="plus" class="w-3.5 h-3.5"></i>Новый чек-лист</button>'
                + '</div>';
            if (lists.length) {
                html += '<div class="flex flex-wrap gap-2 mb-4" role="tablist">' + lists.map(function (l) {
                    var s = stats(String(l.id) === String(selId) && cur ? cur.content : l.content);
                    var on = String(l.id) === String(selId);
                    var sc = scopeOf(on && cur ? cur.scope : l.scope);
                    return '<button type="button" role="tab" aria-selected="' + on + '" data-ck-sel="' + esc(l.id) + '" class="text-left px-3.5 py-2 rounded-xl border transition cursor-pointer '
                        + (on ? 'bg-white border-indigo-300 ring-2 ring-indigo-100' : 'bg-white border-gray-200 hover:border-gray-300') + '">'
                        + '<span class="flex items-center gap-1.5 text-[10px] font-bold text-gray-400"><span class="w-1.5 h-1.5 rounded-full" style="background:' + SEC_COLOR[sc.sec] + '"></span>' + esc(sc.ru) + '</span>'
                        + '<span class="block text-sm font-bold text-slate-900">' + esc((on && cur ? cur.title : l.title) || 'Без названия') + '</span>'
                        + '<span class="block text-[11px] text-gray-400">' + plural(s.items, W_ITEM) + (s.fixed ? ' · исправлено ' + s.fixed : '') + '</span>'
                        + '</button>';
                }).join('') + '</div>';
            }
            html += '<div data-ck-panelbox>' + panelHtml() + '</div>';
            if (cur) html += editorHtml();
            else if (!lists.length && panel !== 'new') {
                html += '<div class="text-center py-10 px-6 text-gray-500 text-sm bg-gray-50 rounded-2xl border border-dashed border-gray-200">'
                    + 'Чек-листов пока нет. Нажмите «Новый чек-лист» и вставьте текст — например, тот, что вы писали ученице в документе: группы и пункты разберутся сами.</div>';
            }
            html += '<p data-ck-msg class="hidden mt-3 text-xs font-medium rounded-xl px-3 py-2"></p></section>';
            box.innerHTML = html;
            box.querySelectorAll('textarea.ck-auto').forEach(autosize);
            icons();
            if (focusNext) {
                var el = box.querySelector(focusNext);
                if (el) { el.focus(); if (el.setSelectionRange && el.value !== undefined) { var n = el.value.length; try { el.setSelectionRange(n, n); } catch (e) { /* ок */ } } }
                focusNext = null;
            }
        }

        function scopeOptions(selected) {
            return '<optgroup label="Writing">' + SCOPES.filter(function (s) { return s.sec === 'writing'; }).map(function (s) {
                    return '<option value="' + s.id + '"' + (s.id === selected ? ' selected' : '') + '>' + esc(s.ru) + '</option>';
                }).join('') + '</optgroup>'
                + '<optgroup label="Speaking">' + SCOPES.filter(function (s) { return s.sec === 'speaking'; }).map(function (s) {
                    return '<option value="' + s.id + '"' + (s.id === selected ? ' selected' : '') + '>' + esc(s.ru) + '</option>';
                }).join('') + '</optgroup>';
        }
        var INPUT = 'w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:bg-white';
        var LABEL = 'text-[10px] font-bold uppercase tracking-wider text-gray-400';
        var BTN2 = 'text-xs font-bold text-slate-700 bg-gray-100 hover:bg-gray-200 px-3.5 py-2 rounded-xl transition cursor-pointer';

        function previewHtml(p) {
            if (!draftText.trim()) return '<p class="text-xs text-gray-400">Здесь появится, как разобрался текст.</p>';
            if (!p.nItems && !p.groups.length) return '<p class="text-xs text-rose-600">Не нашла ни одного пункта.</p>';
            return '<p class="text-xs font-bold text-slate-700">Найдено: ' + plural(p.groups.filter(function (g) { return g.items.length; }).length, W_GROUP) + ', ' + plural(p.nItems, W_ITEM)
                + (p.title ? ' · название: «' + esc(p.title) + '»' : '') + '</p>'
                + (p.noBullets ? '<p class="text-[11px] text-amber-700 mt-1">В тексте нет маркеров пунктов (☐, •, -), поэтому каждая строка стала пунктом. Если есть заголовки групп — поставьте перед пунктами «- » или поправьте после.</p>' : '')
                + '<ol class="mt-2 space-y-1 text-xs text-slate-600 max-h-64 overflow-y-auto pr-1">' + p.groups.map(function (g) {
                    return '<li class="flex gap-2"><span class="' + (g.items.length ? 'font-semibold text-slate-800' : 'font-extrabold text-slate-900') + ' min-w-0 truncate">' + esc(g.title || (g.note ? '(пояснение)' : '(без названия)')) + '</span>'
                        + '<span class="shrink-0 text-gray-400">' + (g.items.length ? plural(g.items.length, W_ITEM) : 'раздел') + (g.final ? ' · перед сдачей' : '') + '</span></li>';
                }).join('') + '</ol>';
        }

        function panelHtml() {
            if (panel === 'new' || panel === 'import') {
                var p = parseText(draftText);
                var isNew = panel === 'new';
                return '<div class="bg-white rounded-3xl border border-indigo-200 ring-2 ring-indigo-50 p-5 sm:p-6 mb-6">'
                    + '<div class="flex items-start justify-between gap-3 mb-4"><div>'
                    +   '<h4 class="text-base font-bold text-slate-900">' + (isNew ? 'Новый чек-лист' : 'Добавить из текста') + '</h4>'
                    +   '<p class="text-[11px] text-gray-400 mt-0.5">Скопируйте чек-лист из документа или PDF и вставьте сюда. Заголовки станут группами, строки с ☐, •, - — пунктами, абзацы под заголовком — пояснениями.</p></div>'
                    +   '<button type="button" data-ck="close-panel" class="shrink-0 text-gray-400 hover:text-slate-700 cursor-pointer" aria-label="Закрыть"><i data-lucide="x" class="w-5 h-5"></i></button></div>'
                    + (isNew ? '<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">'
                        + '<label class="block"><span class="' + LABEL + '">Где показывать</span><select data-ck-f="new-scope" class="mt-1 ' + INPUT + '">' + scopeOptions(newScope) + '</select></label>'
                        + '<label class="block"><span class="' + LABEL + '">Название</span><input data-ck-f="new-title" maxlength="200" value="' + esc(newTitle) + '" placeholder="' + esc(p.title || scopeOf(newScope).en) + '" class="mt-1 ' + INPUT + '"></label>'
                        + '</div>' : '')
                    + '<label class="block"><span class="' + LABEL + '">Текст чек-листа' + (isNew ? ' (можно оставить пустым и заполнить потом)' : '') + '</span>'
                    + '<textarea data-ck-f="draft" rows="9" class="mt-1 ' + INPUT + ' leading-relaxed font-[inherit]" placeholder="Правописание: слова-ловушки&#10;☐ accommodation — два c и два m (было: accomodation)&#10;☐ will — два l (было: wil)&#10;&#10;Финальная проверка перед сдачей&#10;☐ Все пункты задания закрыты">' + esc(draftText) + '</textarea></label>'
                    + '<div data-ck-preview class="mt-3 bg-gray-50 border border-gray-100 rounded-2xl p-3">' + previewHtml(p) + '</div>'
                    + (!isNew ? '<div class="flex flex-wrap gap-4 mt-3 text-xs text-slate-700">'
                        + '<label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="ck-mode" value="append" data-ck-f="mode"' + (importMode === 'append' ? ' checked' : '') + ' class="accent-indigo-600">Добавить в конец</label>'
                        + '<label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="ck-mode" value="replace" data-ck-f="mode"' + (importMode === 'replace' ? ' checked' : '') + ' class="accent-indigo-600">Заменить всё содержимое</label></div>' : '')
                    + '<div class="flex flex-wrap gap-2 mt-4">'
                    +   '<button type="button" data-ck="' + (isNew ? 'create' : 'apply-import') + '" class="text-xs font-bold text-white bg-slate-900 hover:bg-indigo-600 px-4 py-2.5 rounded-xl transition cursor-pointer">' + (isNew ? 'Создать чек-лист' : 'Добавить') + '</button>'
                    +   '<button type="button" data-ck="close-panel" class="' + BTN2 + '">Отмена</button>'
                    + '</div></div>';
            }
            if (panel === 'copy') {
                var body;
                if (others === null) body = '<p class="text-xs text-gray-400 py-4">Загрузка…</p>';
                else if (!others.length) body = '<p class="text-xs text-gray-500 py-2">Других чек-листов пока нет.</p>';
                else {
                    var src = copyFrom ? others.find(function (o) { return String(o.id) === String(copyFrom); }) : null;
                    body = '<label class="block"><span class="' + LABEL + '">Откуда</span><select data-ck-f="copy-from" class="mt-1 ' + INPUT + '">'
                        + '<option value="">Выберите чек-лист…</option>' + others.map(function (o) {
                            return '<option value="' + esc(o.id) + '"' + (String(o.id) === String(copyFrom) ? ' selected' : '') + '>' + esc(o.who + ' — ' + (o.title || scopeOf(o.scope).ru) + ' (' + plural(stats(o.content).items, W_ITEM) + ')') + '</option>';
                        }).join('') + '</select></label>';
                    if (src) {
                        body += '<div class="mt-3 flex items-center justify-between gap-3"><span class="text-xs font-bold text-slate-700">Какие группы взять</span>'
                            + '<button type="button" data-ck="copy-all" class="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer">выбрать все / ни одной</button></div>'
                            + '<ul class="mt-2 space-y-1 max-h-72 overflow-y-auto pr-1">' + src.content.groups.map(function (g) {
                                return '<li><label class="flex items-start gap-2.5 text-sm text-slate-700 py-1 cursor-pointer">'
                                    + '<input type="checkbox" data-ck-pick="' + esc(g.id) + '"' + (copyPick[g.id] ? ' checked' : '') + ' class="mt-1 accent-indigo-600">'
                                    + '<span class="min-w-0"><span class="' + (g.items.length ? 'font-semibold' : 'font-extrabold') + '">' + esc(g.title || '(без названия)') + '</span>'
                                    + ' <span class="text-xs text-gray-400">' + (g.items.length ? plural(g.items.length, W_ITEM) : 'раздел') + '</span></span></label></li>';
                            }).join('') + '</ul>'
                            + '<p class="text-[11px] text-gray-400 mt-2">Отметки «исправлено» не копируются. Группы добавятся в конец — потом их можно поправить под эту ученицу.</p>';
                    }
                }
                return '<div class="bg-white rounded-3xl border border-indigo-200 ring-2 ring-indigo-50 p-5 sm:p-6 mb-6">'
                    + '<div class="flex items-start justify-between gap-3 mb-4"><div>'
                    +   '<h4 class="text-base font-bold text-slate-900">Взять из другого чек-листа</h4>'
                    +   '<p class="text-[11px] text-gray-400 mt-0.5">Свои же группы из чек-листов других учениц — например, стандартные фразы или финальную проверку.</p></div>'
                    +   '<button type="button" data-ck="close-panel" class="shrink-0 text-gray-400 hover:text-slate-700 cursor-pointer" aria-label="Закрыть"><i data-lucide="x" class="w-5 h-5"></i></button></div>'
                    + body
                    + '<div class="flex flex-wrap gap-2 mt-4">'
                    +   '<button type="button" data-ck="apply-copy" class="text-xs font-bold text-white bg-slate-900 hover:bg-indigo-600 px-4 py-2.5 rounded-xl transition cursor-pointer">Добавить выбранное</button>'
                    +   '<button type="button" data-ck="close-panel" class="' + BTN2 + '">Отмена</button>'
                    + '</div></div>';
            }
            return '';
        }

        function editorHtml() {
            var s = stats(cur.content);
            var sc = scopeOf(cur.scope);
            var finalWord = sc.sec === 'speaking' ? 'перед началом' : 'перед сдачей';
            var ICON = 'w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-slate-800 hover:bg-gray-100 transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300';
            var groups = cur.content.groups.map(function (g, gi) {
                return '<div class="ck-group border border-gray-100 rounded-2xl p-3 sm:p-4 ' + (g.final ? 'bg-indigo-50/40 border-indigo-100' : 'bg-gray-50/30') + '" data-g="' + esc(g.id) + '">'
                    + '<div class="ck-row flex flex-wrap sm:flex-nowrap items-start gap-2">'
                    +   '<input data-ck-f="g-title" value="' + esc(g.title) + '" maxlength="200" placeholder="Название группы" aria-label="Название группы" class="basis-full sm:basis-auto flex-1 min-w-0 px-2 py-1.5 bg-transparent border border-transparent hover:border-gray-200 focus:border-indigo-200 focus:bg-white rounded-lg text-sm font-bold text-slate-900 focus:outline-none">'
                    +   '<label class="shrink-0 flex items-center gap-1.5 text-[11px] font-bold px-2 py-1.5 rounded-lg cursor-pointer select-none ' + (g.final ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-slate-500 hover:text-slate-800') + '" title="Показывать ученице отдельно, ' + finalWord + '">'
                    +     '<input type="checkbox" data-ck-f="g-final"' + (g.final ? ' checked' : '') + ' class="sr-only">' + finalWord + '</label>'
                    +   '<span class="ck-tools shrink-0 flex items-center transition-opacity">'
                    +     '<button type="button" data-ck="g-up" class="' + ICON + '"' + (gi === 0 ? ' disabled style="visibility:hidden"' : '') + ' title="Выше" aria-label="Группу выше"><i data-lucide="chevron-up" class="w-4 h-4"></i></button>'
                    +     '<button type="button" data-ck="g-down" class="' + ICON + '"' + (gi === cur.content.groups.length - 1 ? ' disabled style="visibility:hidden"' : '') + ' title="Ниже" aria-label="Группу ниже"><i data-lucide="chevron-down" class="w-4 h-4"></i></button>'
                    +     '<button type="button" data-ck="g-del" class="' + ICON + ' hover:!text-rose-600" title="Удалить группу" aria-label="Удалить группу"><i data-lucide="trash-2" class="w-4 h-4"></i></button>'
                    +   '</span></div>'
                    + (g.note || g.__noteOpen
                        ? '<textarea data-ck-f="g-note" rows="1" maxlength="2000" placeholder="Пояснение к группе" aria-label="Пояснение к группе" class="ck-auto mt-1 w-full px-2 py-1.5 bg-transparent border border-transparent hover:border-gray-200 focus:border-indigo-200 focus:bg-white rounded-lg text-xs text-slate-600 leading-relaxed focus:outline-none">' + esc(g.note) + '</textarea>'
                        : '')
                    + '<ul class="mt-1 space-y-0.5">' + g.items.map(function (i, ii) {
                        return '<li class="ck-row flex items-start gap-2 rounded-lg ' + (i.fixed ? 'bg-emerald-50/60' : '') + '" data-i="' + esc(i.id) + '">'
                            + '<label class="shrink-0 pt-2 pl-1.5 cursor-pointer" title="Исправлено — ученица увидит пункт в разделе Fixed">'
                            +   '<input type="checkbox" data-ck-f="i-fixed"' + (i.fixed ? ' checked' : '') + ' class="w-4 h-4 accent-emerald-600 cursor-pointer" aria-label="Исправлено"></label>'
                            + '<textarea data-ck-f="i-text" rows="1" maxlength="1000" placeholder="Пункт" aria-label="Пункт" class="ck-auto flex-1 min-w-0 px-2 py-1.5 bg-transparent border border-transparent hover:border-gray-200 focus:border-indigo-200 focus:bg-white rounded-lg text-sm leading-relaxed focus:outline-none ' + (i.fixed ? 'text-gray-400' : 'text-slate-700') + '">' + esc(i.text) + '</textarea>'
                            + (i.fixed ? '<span class="shrink-0 pt-2 text-[10px] font-bold text-emerald-600 whitespace-nowrap">исправлено' + (i.fixedAt ? ' ' + esc(shortDate(i.fixedAt)) : '') + '</span>' : '')
                            + '<span class="ck-tools shrink-0 flex items-center pt-0.5 transition-opacity">'
                            +   '<button type="button" data-ck="i-up" class="hidden sm:flex ' + ICON + '"' + (ii === 0 ? ' disabled style="visibility:hidden"' : '') + ' aria-label="Пункт выше"><i data-lucide="chevron-up" class="w-3.5 h-3.5"></i></button>'
                            +   '<button type="button" data-ck="i-down" class="hidden sm:flex ' + ICON + '"' + (ii === g.items.length - 1 ? ' disabled style="visibility:hidden"' : '') + ' aria-label="Пункт ниже"><i data-lucide="chevron-down" class="w-3.5 h-3.5"></i></button>'
                            +   '<button type="button" data-ck="i-del" class="' + ICON + ' hover:!text-rose-600" aria-label="Удалить пункт"><i data-lucide="x" class="w-3.5 h-3.5"></i></button>'
                            + '</span></li>';
                    }).join('') + '</ul>'
                    + '<div class="flex flex-wrap gap-3 mt-2 pl-1.5">'
                    +   '<button type="button" data-ck="i-add" class="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer">+ пункт</button>'
                    +   (!g.note && !g.__noteOpen ? '<button type="button" data-ck="g-note" class="text-xs font-bold text-gray-400 hover:text-slate-700 cursor-pointer">+ пояснение</button>' : '')
                    + '</div></div>';
            }).join('');

            return '<div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 sm:p-6">'
                + '<div class="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-3">'
                +   '<label class="block"><span class="' + LABEL + '">Название</span><input data-ck-f="title" maxlength="200" value="' + esc(cur.title) + '" class="mt-1 ' + INPUT + ' font-bold"></label>'
                +   '<label class="block"><span class="' + LABEL + '">Где показывать</span><select data-ck-f="scope" class="mt-1 ' + INPUT + '">' + scopeOptions(cur.scope) + '</select></label>'
                + '</div>'
                + '<p class="text-xs text-gray-500 mt-4">' + plural(s.items, W_ITEM) + (s.fixed ? ' · исправлено ' + s.fixed : '')
                +   (s.finalItems ? ' · ' + finalWord + ': ' + s.finalItems : '') + (cur.updated_at ? ' · сохранено ' + esc(shortDate(cur.updated_at)) : '')
                +   '<span class="block text-[11px] text-gray-400 mt-0.5">Галочка слева от пункта — «исправлено»: у ученицы он уйдёт в раздел Fixed. Enter — новый пункт, Backspace в пустом — удалить. Можно **жирный**, *курсив* и (было: …).</span></p>'
                + '<div class="flex flex-wrap items-center gap-2 mt-3 pb-4 border-b border-gray-100">'
                +   '<button type="button" data-ck="preview" class="' + BTN2 + ' flex items-center gap-1.5"><i data-lucide="eye" class="w-3.5 h-3.5"></i>Как видит ученица</button>'
                +   '<button type="button" data-ck="import" class="' + BTN2 + ' flex items-center gap-1.5"><i data-lucide="clipboard-paste" class="w-3.5 h-3.5"></i>Добавить из текста</button>'
                +   '<button type="button" data-ck="copy" class="' + BTN2 + ' flex items-center gap-1.5"><i data-lucide="copy" class="w-3.5 h-3.5"></i>Взять из другого</button>'
                +   '<button type="button" data-ck="delete" class="ml-auto text-xs font-bold text-gray-400 hover:text-rose-600 px-2 py-2 cursor-pointer">Удалить чек-лист</button>'
                + '</div>'
                + '<div class="space-y-3 mt-4">' + (groups || '<p class="text-sm text-gray-400 py-6 text-center">Пусто. Добавьте группу или вставьте текст.</p>') + '</div>'
                + '<button type="button" data-ck="g-add" class="mt-3 text-xs font-bold text-slate-700 bg-gray-50 hover:bg-gray-100 border border-dashed border-gray-200 w-full py-2.5 rounded-xl transition cursor-pointer">+ группа</button>'
                + '<div data-ck-savebar class="sticky bottom-0 -mx-4 sm:-mx-6 -mb-4 sm:-mb-6 mt-4 px-4 sm:px-6 py-3 rounded-b-3xl border-t border-gray-100 bg-white/95 backdrop-blur flex flex-wrap items-center gap-3"></div>'
                + '</div>';
        }

        function renderSaveBar(bar) {
            bar = bar || box.querySelector('[data-ck-savebar]');
            if (!bar) return;
            bar.innerHTML = conflict
                ? '<span class="text-xs font-bold text-rose-700 mr-auto">Этот чек-лист изменили в другой вкладке или на другом устройстве.</span>'
                  + '<button type="button" data-ck="reload-list" class="' + BTN2 + '">Загрузить их версию</button>'
                  + '<button type="button" data-ck="force-save" class="text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 px-4 py-2.5 rounded-xl transition cursor-pointer">Сохранить мою поверх</button>'
                : dirty
                    ? '<span class="text-xs font-bold text-amber-700 mr-auto">Есть несохранённые изменения</span>'
                      + '<button type="button" data-ck="revert" class="' + BTN2 + '">Отменить</button>'
                      + '<button type="button" data-ck="save" class="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 rounded-xl shadow-sm transition cursor-pointer">Сохранить</button>'
                    : '<span class="text-xs text-gray-400 mr-auto">Все изменения сохранены</span>';
        }

        function autosize(t) { t.style.height = 'auto'; t.style.height = (t.scrollHeight + 2) + 'px'; }
        function msg(text, ok) {
            var el = box.querySelector('[data-ck-msg]');
            if (!el) return;
            el.textContent = text || '';
            el.className = 'mt-3 text-xs font-medium rounded-xl px-3 py-2 ' + (ok ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700');
            if (!text) el.classList.add('hidden');
        }
        function full() { render(); renderSaveBar(); }

        // ----- база -----
        async function reload(keepSel) {
            try {
                lists = await loadFor(studentId);
                if (!keepSel || !lists.some(function (l) { return String(l.id) === String(selId); })) selId = lists.length ? lists[0].id : null;
                openList(selId);
                full();
            } catch (err) {
                box.innerHTML = missingTable(err)
                    ? '<div class="mt-12 bg-white p-6 rounded-3xl border border-gray-100 text-sm text-slate-600">Чтобы вести чек-листы ошибок, один раз запустите <b>checklist.sql</b> в Supabase (SQL Editor).</div>'
                    : '<div class="mt-12 text-rose-500 text-center py-10 text-sm font-bold">Чек-листы не загрузились: ' + esc(err.message || err) + '</div>';
            }
        }
        function contentTooBig(c) {
            var s = stats(c);
            if (s.items > LIMITS.items) return 'Слишком много пунктов (' + s.items + '). Максимум — ' + LIMITS.items + '.';
            if (c.groups.length > LIMITS.groups) return 'Слишком много групп. Максимум — ' + LIMITS.groups + '.';
            if (JSON.stringify(c).length > 350000) return 'Чек-лист слишком большой. Разделите его на два.';
            return '';
        }
        async function save(force) {
            if (busy || !cur) return;
            var title = (cur.title || '').trim() || scopeOf(cur.scope).en;
            var content = clean(cur.content);
            var big = contentTooBig(content);
            if (big) { msg(big); return; }
            busy = true;
            try {
                var q = db().from(TABLE).update({ title: title, scope: cur.scope, content: content }).eq('id', cur.id);
                if (!force) q = q.eq('version', cur.version);
                var r = await q.select('id, version, updated_at');
                if (r.error) throw r.error;
                if (!r.data || !r.data.length) {
                    var chk = await db().from(TABLE).select('id, version').eq('id', cur.id).maybeSingle();
                    if (chk.error) throw chk.error;
                    if (!chk.data) { msg('Этот чек-лист уже удалён (в другой вкладке?). Обновите страницу.'); return; }
                    if (!force && chk.data.version !== cur.version) { conflict = true; renderSaveBar(); return; }
                    throw new Error('база не дала сохранить (нет прав?)');
                }
                var row = r.data[0];
                var l = sel();
                if (l) { l.title = title; l.scope = cur.scope; l.content = normalize(JSON.parse(JSON.stringify(content))); l.version = row.version; l.updated_at = row.updated_at; }
                cur.title = title; cur.content = normalize(JSON.parse(JSON.stringify(content))); cur.version = row.version; cur.updated_at = row.updated_at;
                dirty = false; conflict = false;
                full();
                msg('Сохранено — ученица увидит изменения, когда откроет страницу.', true);
            } catch (err) {
                msg('Не сохранилось: ' + (err.message || err) + '. Изменения остались на странице — попробуйте ещё раз.');
            } finally {
                busy = false;
            }
        }
        async function create() {
            if (busy) return;
            var p = parseText(draftText);
            var scope = newScope;
            var title = (newTitle || '').trim() || p.title || scopeOf(scope).en;
            var content = clean({ groups: p.groups });
            var big = contentTooBig(content);
            if (big) { msg(big); return; }
            busy = true;
            try {
                var pos = lists.reduce(function (m, l) { return Math.max(m, Number(l.position) || 0); }, -1) + 1;
                var r = await db().from(TABLE).insert([{ student_id: studentId, scope: scope, title: title, content: content, position: pos }]).select('*').single();
                if (r.error) throw r.error;
                panel = null; draftText = ''; newTitle = '';
                selId = r.data.id;
                await reload(true);
                msg(stats(content).items ? 'Чек-лист создан — ученица уже видит его.' : 'Чек-лист создан. Добавьте группы и пункты и нажмите «Сохранить».', true);
            } catch (err) {
                msg(missingTable(err) ? 'Сначала запустите checklist.sql в Supabase.' : 'Не создалось: ' + (err.message || err));
            } finally {
                busy = false;
            }
        }
        async function removeList() {
            if (!cur || busy) return;
            if (!confirm('Удалить чек-лист «' + (cur.title || 'Без названия') + '»? Ученица перестанет его видеть. Вернуть будет нельзя.')) return;
            busy = true;
            try {
                var r = await db().from(TABLE).delete().eq('id', cur.id).select('id');
                if (r.error) throw r.error;
                if (!r.data || !r.data.length) throw new Error('нет прав или уже удалён');
                dirty = false;
                await reload(false);
                msg('Чек-лист удалён.', true);
            } catch (err) {
                msg('Не удалилось: ' + (err.message || err));
            } finally {
                busy = false;
            }
        }
        async function loadOthers() {
            others = null; full();
            try {
                var r = await db().from(TABLE).select('id, student_id, scope, title, content');
                if (r.error) throw r.error;
                var rows = (r.data || []).filter(function (o) { return !cur || String(o.id) !== String(cur.id); });
                var ids = rows.map(function (o) { return o.student_id; }).filter(function (v, i, a) { return a.indexOf(v) === i; });
                var names = {};
                if (ids.length) {
                    var p = await db().from('profiles').select('id, full_name, email').in('id', ids);
                    (p.data || []).forEach(function (x) { names[String(x.id)] = (x.full_name || '').trim() || (x.email || '').split('@')[0] || 'Ученица'; });
                }
                others = rows.map(function (o) {
                    o.content = normalize(o.content);
                    o.who = String(o.student_id) === String(studentId) ? 'Эта ученица' : (names[String(o.student_id)] || 'Ученица');
                    return o;
                }).filter(function (o) { return o.content.groups.length; })
                  .sort(function (a, b) { return a.who.localeCompare(b.who, 'ru') || String(a.title).localeCompare(String(b.title)); });
            } catch (err) {
                others = [];
                msg('Не загрузились другие чек-листы: ' + (err.message || err));
            }
            full();
        }

        // ----- ввод -----
        box.addEventListener('input', function (e) {
            var t = e.target, f = t.getAttribute && t.getAttribute('data-ck-f');
            if (!f) return;
            if (t.classList.contains('ck-auto')) autosize(t);
            if (f === 'draft') {
                draftText = t.value;
                var pv = box.querySelector('[data-ck-preview]');
                if (pv) pv.innerHTML = previewHtml(parseText(draftText));
                if (panel === 'new') {
                    var p = parseText(draftText), g = p.scope;
                    var ti = box.querySelector('[data-ck-f="new-title"]');
                    if (ti) ti.placeholder = p.title || scopeOf(newScope).en;
                    if (g && !box.__scopeTouched) { newScope = g; var se = box.querySelector('[data-ck-f="new-scope"]'); if (se) se.value = g; }
                }
                return;
            }
            if (f === 'new-title') { newTitle = t.value; return; }
            if (!cur) return;
            if (f === 'title') { cur.title = t.value; setDirty(); return; }
            var gEl = t.closest('[data-g]'); var g = gEl && findGroup(gEl.getAttribute('data-g'));
            if (!g) return;
            if (f === 'g-title') { g.title = t.value; setDirty(); return; }
            if (f === 'g-note') { g.note = t.value; setDirty(); return; }
            var iEl = t.closest('[data-i]'); var it = iEl && g.items.find(function (x) { return x.id === iEl.getAttribute('data-i'); });
            if (it && f === 'i-text') { it.text = t.value; setDirty(); }
        });
        box.addEventListener('change', function (e) {
            var t = e.target, f = t.getAttribute && t.getAttribute('data-ck-f');
            if (!f) return;
            if (f === 'new-scope') { newScope = t.value; box.__scopeTouched = true; var ti = box.querySelector('[data-ck-f="new-title"]'); if (ti) ti.placeholder = parseText(draftText).title || scopeOf(newScope).en; return; }
            if (f === 'mode') { importMode = t.value; return; }
            if (f === 'copy-from') {
                copyFrom = t.value || null; copyPick = {};
                var src = copyFrom && others && others.find(function (o) { return String(o.id) === String(copyFrom); });
                if (src) src.content.groups.forEach(function (g) { copyPick[g.id] = true; });
                full(); return;
            }
            var pk = t.getAttribute('data-ck-pick');
            if (!cur) return;
            if (f === 'scope') { cur.scope = t.value; setDirty(); full(); return; }
            var gEl = t.closest('[data-g]'); var g = gEl && findGroup(gEl.getAttribute('data-g'));
            if (!g) return;
            if (f === 'g-final') { g.final = t.checked; setDirty(); full(); return; }
            var iEl = t.closest('[data-i]'); var it = iEl && g.items.find(function (x) { return x.id === iEl.getAttribute('data-i'); });
            if (it && f === 'i-fixed') {
                it.fixed = t.checked; it.fixedAt = t.checked ? new Date().toISOString() : null;
                setDirty();
                focusNext = '[data-i="' + it.id + '"] [data-ck-f="i-fixed"]';
                full();
            }
        });
        box.addEventListener('change', function (e) {
            var pk = e.target.getAttribute && e.target.getAttribute('data-ck-pick');
            if (pk) copyPick[pk] = e.target.checked;
        });
        box.addEventListener('keydown', function (e) {
            var t = e.target;
            if (!cur || !t.getAttribute || t.getAttribute('data-ck-f') !== 'i-text') return;
            var gEl = t.closest('[data-g]'), iEl = t.closest('[data-i]');
            var g = gEl && findGroup(gEl.getAttribute('data-g'));
            if (!g || !iEl) return;
            var idx = g.items.findIndex(function (x) { return x.id === iEl.getAttribute('data-i'); });
            if (e.key === 'Enter' && !e.shiftKey) {
                // Enter — новый пункт ниже (как в списке в документе)
                e.preventDefault();
                var ni = { id: nid('i'), text: '', fixed: false, fixedAt: null };
                g.items.splice(idx + 1, 0, ni);
                setDirty();
                focusNext = '[data-i="' + ni.id + '"] [data-ck-f="i-text"]';
                full();
            } else if (e.key === 'Backspace' && !t.value && g.items.length) {
                // Backspace в пустом пункте — удалить его и перейти к предыдущему
                e.preventDefault();
                g.items.splice(idx, 1);
                setDirty();
                var prev = g.items[Math.max(0, idx - 1)];
                focusNext = prev ? '[data-i="' + prev.id + '"] [data-ck-f="i-text"]' : '[data-g="' + g.id + '"] [data-ck-f="g-title"]';
                full();
            }
        });
        box.addEventListener('click', function (e) {
            var b = e.target.closest && e.target.closest('[data-ck],[data-ck-sel]');
            if (!b || b.disabled) return;
            var selBtn = b.getAttribute('data-ck-sel');
            if (selBtn) {
                if (String(selBtn) === String(selId)) return;
                if (dirty && !confirm('В открытом чек-листе есть несохранённые изменения. Перейти без сохранения?')) return;
                openList(selBtn); panel = panel === 'new' ? panel : null; full(); return;
            }
            var a = b.getAttribute('data-ck');
            var gEl = b.closest('[data-g]'); var g = gEl && cur && findGroup(gEl.getAttribute('data-g'));
            var gs = cur && cur.content.groups;
            var gi = g ? gs.indexOf(g) : -1;
            var iEl = b.closest('[data-i]');
            var ii = g && iEl ? g.items.findIndex(function (x) { return x.id === iEl.getAttribute('data-i'); }) : -1;
            switch (a) {
                case 'new':
                    panel = 'new'; draftText = ''; newTitle = ''; newScope = 'email'; box.__scopeTouched = false;
                    focusNext = '[data-ck-f="draft"]'; full(); break;
                case 'import': panel = 'import'; draftText = ''; importMode = 'append'; focusNext = '[data-ck-f="draft"]'; full(); break;
                case 'copy': panel = 'copy'; copyFrom = null; copyPick = {}; loadOthers(); break;
                case 'close-panel': panel = null; full(); break;
                case 'create': create(); break;
                case 'apply-import': {
                    var p = parseText(draftText);
                    if (!p.groups.length) { msg('В тексте не нашлось пунктов.'); break; }
                    if (importMode === 'replace') {
                        if (stats(cur.content).items && !confirm('Заменить всё содержимое чек-листа? Старые пункты и отметки «исправлено» пропадут после сохранения.')) break;
                        cur.content.groups = p.groups;
                    } else cur.content.groups = cur.content.groups.concat(p.groups);
                    if (!cur.title.trim() && p.title) cur.title = p.title;
                    panel = null; draftText = ''; setDirty(); full();
                    msg('Добавлено: ' + plural(p.nItems, W_ITEM) + '. Проверьте и нажмите «Сохранить».', true);
                    break;
                }
                case 'copy-all': {
                    var src = others && others.find(function (o) { return String(o.id) === String(copyFrom); });
                    if (!src) break;
                    var allOn = src.content.groups.every(function (x) { return copyPick[x.id]; });
                    src.content.groups.forEach(function (x) { copyPick[x.id] = !allOn; });
                    full(); break;
                }
                case 'apply-copy': {
                    var src2 = others && others.find(function (o) { return String(o.id) === String(copyFrom); });
                    var pick = src2 ? src2.content.groups.filter(function (x) { return copyPick[x.id]; }) : [];
                    if (!pick.length) { msg('Выберите чек-лист и хотя бы одну группу.'); break; }
                    cur.content.groups = cur.content.groups.concat(pick.map(copyGroup));
                    panel = null; setDirty(); full();
                    msg('Добавлено ' + plural(pick.length, W_GROUP) + '. Проверьте и нажмите «Сохранить».', true);
                    break;
                }
                case 'preview': {
                    var pv = { id: cur.id, scope: cur.scope, title: (cur.title || '').trim() || scopeOf(cur.scope).en, content: clean(cur.content) };
                    if (!stats(pv.content).items) { msg('Пока нечего показывать — в чек-листе нет пунктов.'); break; }
                    openDrawer([pv], { preview: true });
                    break;
                }
                case 'delete': removeList(); break;
                case 'save': save(false); break;
                case 'force-save': save(true); break;
                case 'revert':
                    if (!confirm('Отменить все несохранённые изменения?')) break;
                    openList(selId); full(); break;
                case 'reload-list': reload(true); break;
                case 'g-add': {
                    var ng = { id: nid('g'), title: '', note: '', final: false, items: [{ id: nid('i'), text: '', fixed: false, fixedAt: null }] };
                    gs.push(ng); setDirty();
                    focusNext = '[data-g="' + ng.id + '"] [data-ck-f="g-title"]'; full(); break;
                }
                case 'g-up': if (gi > 0) { gs.splice(gi - 1, 0, gs.splice(gi, 1)[0]); setDirty(); focusNext = '[data-g="' + g.id + '"] [data-ck="g-up"]'; full(); } break;
                case 'g-down': if (gi >= 0 && gi < gs.length - 1) { gs.splice(gi + 1, 0, gs.splice(gi, 1)[0]); setDirty(); focusNext = '[data-g="' + g.id + '"] [data-ck="g-down"]'; full(); } break;
                case 'g-del':
                    if (g.items.some(function (x) { return x.text.trim(); }) && !confirm('Удалить группу «' + (g.title || 'без названия') + '» вместе с ' + plural(g.items.length, W_ITEM) + '?')) break;
                    gs.splice(gi, 1); setDirty(); full(); break;
                case 'g-note': g.__noteOpen = true; focusNext = '[data-g="' + g.id + '"] [data-ck-f="g-note"]'; full(); break;
                case 'i-add': {
                    var it = { id: nid('i'), text: '', fixed: false, fixedAt: null };
                    g.items.push(it); setDirty();
                    focusNext = '[data-i="' + it.id + '"] [data-ck-f="i-text"]'; full(); break;
                }
                case 'i-up': if (ii > 0) { g.items.splice(ii - 1, 0, g.items.splice(ii, 1)[0]); setDirty(); focusNext = '[data-i="' + iEl.getAttribute('data-i') + '"] [data-ck="i-up"]'; full(); } break;
                case 'i-down': if (ii >= 0 && ii < g.items.length - 1) { g.items.splice(ii + 1, 0, g.items.splice(ii, 1)[0]); setDirty(); focusNext = '[data-i="' + iEl.getAttribute('data-i') + '"] [data-ck="i-down"]'; full(); } break;
                case 'i-del': g.items.splice(ii, 1); setDirty(); full(); break;
            }
        });
        window.addEventListener('beforeunload', function (e) { if (dirty) { e.preventDefault(); e.returnValue = ''; } });

        box.__ckReload = function () { if (!busy && !dirty && !panel) reload(true); };
        box.innerHTML = '<div class="mt-12 text-center py-6 text-gray-400 text-sm">Загрузка чек-листов…</div>';
        reload(false);
    }

    window.Checklist = {
        teacher: teacher,
        studentCard: studentCard,
        writing: writing,
        beforeSubmit: beforeSubmit,
        speaking: speaking,
        open: openDrawer,
        _parse: parseText,
        _fmt: fmt,
        _clean: clean,
        _stats: stats
    };
})();
