/* =====================================================================
   ge-core.js — движок заданий General English.

   Один файл на все страницы GE (урок, конструктор, курсы, ученики):
   разметка заданий, отрисовка, проверка, сохранение ответов, файлы.
   Всё лежит внутри window.GE — ни одной глобальной функции, чтобы этот
   файл не мог перетереть функции других скриптов платформы (и наоборот).

   Подключать ПОСЛЕ supabase-js и auth.js (нужен window.supabaseClient).
   ===================================================================== */
(function (root) {
    'use strict';
    if (root.GE && root.GE.__core) return;           // защита от двойного подключения
    const GE = root.GE = root.GE || {};
    GE.__core = true;
    GE.BUCKET = 'ge-media';

    GE.db = function () {
        const c = root.supabaseClient;
        if (!c) throw new Error('Не найден клиент Supabase: подключите auth.js раньше ge-core.js');
        return c;
    };

    // =================================================================
    // Типы заданий и подсказки для конструктора
    // =================================================================
    GE.TYPE_ORDER = ['gaps', 'drag_words', 'match', 'order', 'mcq', 'open', 'speaking', 'info'];
    GE.TYPES = {
        gaps: {
            label: 'Пропуски и выбор', icon: '✏️', auto: true,
            help: 'Пропуск для ввода — слово в фигурных скобках: <code>She {is} a teacher.</code><br>' +
                  'Несколько верных вариантов — через косую черту: <code>{is not/isn\'t}</code><br>' +
                  'Выпадающий список — варианты через вертикальную черту, <b>верный первым</b> (ученику они перемешаются): <code>They {live|lives|living} here.</code>',
            example: { text: 'I {am} a teacher and I {live|lives|living} in Minsk.\nMy brother {is not/isn\'t} a student.\nWe {usually} have dinner at seven.' }
        },
        drag_words: {
            label: 'Перетащить слова', icon: '🧩', auto: true,
            help: 'Пропуски в фигурных скобках, как в «Пропусках»: <code>I {usually} get up at 7.</code><br>' +
                  'Все слова из скобок попадут в банк слов. В поле «Лишние слова» можно добавить отвлекающие — через запятую.',
            example: { text: 'I {usually} get up at seven, but on Sundays I {often} sleep until ten.\nI {never} drink coffee in the evening.', extra: 'always, sometimes' }
        },
        match: {
            label: 'Сопоставление', icon: '🔗', auto: true,
            help: 'Каждая пара — с новой строки, через знак равно: <code>big = small</code><br>' +
                  'Левая часть остаётся по порядку, правые варианты ученик выбирает из списка. Отвлекающие варианты — в поле «Лишние варианты».',
            example: { text: 'big = small\nhot = cold\nfast = slow\nhappy = sad', extra: 'tall' }
        },
        order: {
            label: 'Расставить по порядку', icon: '↕️', auto: true,
            help: '<b>Слова в предложении:</b> напишите предложения правильно, каждое с новой строки — ученику слова перемешаются. ' +
                  'Чтобы фраза двигалась целиком, разделите куски косой чертой: <code>I / usually / have / a big breakfast</code><br>' +
                  '<b>Строки по порядку:</b> напишите строки (реплики диалога, шаги истории) в правильном порядке — ученик расставит их сам.',
            example: { mode: 'words', text: 'I always drink coffee in the morning.\nShe / doesn\'t / like / getting up early.' }
        },
        mcq: {
            label: 'Вопросы с вариантами', icon: '☑️', auto: true,
            help: 'Первая строка — вопрос, ниже варианты, верный отмечен звёздочкой. Вопросы разделяйте пустой строкой:<br>' +
                  '<code>Where does Anna work?<br>*In a hospital<br>In a school</code><br>' +
                  'Несколько звёздочек в одном вопросе — ученик выбирает несколько ответов. Для True/False просто напишите варианты <code>*True</code> и <code>False</code>.',
            example: { text: 'Where does Anna work?\n*In a hospital\nIn a school\nIn a bank\n\nDoes she like her job?\n*Yes\nNo\n\nWhich of these does she do every day? (two answers)\n*Gets up early\n*Takes the bus\nCooks dinner' }
        },
        open: {
            label: 'Письменный ответ', icon: '📝', auto: false, review: true,
            help: 'Ученик пишет свободный текст, ответ приходит тебе на проверку. Можно задать минимум слов.',
            example: { prompt: 'Write 4–5 sentences about your typical morning.', min_words: 30 }
        },
        speaking: {
            label: 'Запись голоса', icon: '🎙️', auto: false, review: true,
            help: 'Ученик записывает ответ голосом прямо на странице, запись приходит тебе на проверку.',
            example: { prompt: 'Describe your favourite place in your city. Why do you like it?', max_seconds: 90 }
        },
        info: {
            label: 'Теория / текст', icon: '📖', auto: false,
            help: 'Блок без ответов: правило, текст для чтения, аудио или видео. Заполни «Текст для чтения» и/или прикрепи файлы ниже.',
            example: {}
        }
    };

    // =================================================================
    // Мелкие утилиты
    // =================================================================
    GE.esc = function (s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    };
    // Текст из конструктора: экранирование + **жирный**. Переносы строк сохраняет CSS (pre-wrap).
    GE.fmt = function (s) {
        return GE.esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    };
    // Нормализация для проверки: регистр, «умные» апострофы, пробелы, точка в конце
    GE.norm = function (s) {
        return String(s == null ? '' : s).normalize('NFC').toLowerCase()
            .replace(/[’‘`´ʼ]/g, "'")
            .replace(/[“”«»]/g, '"')
            .replace(/\s+/g, ' ').trim()
            .replace(/[.!?]+$/, '').trim();
    };
    GE.parseList = function (s) {
        return String(s || '').split(/[\n,]/).map(x => x.trim()).filter(Boolean);
    };
    GE.wordCount = function (s) {
        const m = String(s || '').trim().match(/[^\s]+/g);
        return m ? m.length : 0;
    };
    GE.personName = function (p) {
        if (!p) return 'Без имени';
        const full = [p.first_name, p.last_name].filter(Boolean).join(' ');
        return p.full_name || p.name || p.display_name || p.username || full || p.email || 'Без имени';
    };
    GE.safeName = function (name) {
        const n = String(name || 'file').normalize('NFKD').replace(/[^\w.\-]+/g, '_').replace(/_+/g, '_');
        return n.slice(-80) || 'file';
    };
    GE.param = function (name) {
        return new URLSearchParams(root.location.search).get(name);
    };
    GE.timeAgo = function (iso) {
        if (!iso) return '';
        const sec = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
        if (sec < 60) return 'только что';
        if (sec < 3600) return Math.floor(sec / 60) + ' мин назад';
        if (sec < 86400) return Math.floor(sec / 3600) + ' ч назад';
        if (sec < 86400 * 7) return Math.floor(sec / 86400) + ' дн назад';
        return new Date(iso).toLocaleDateString('ru-RU');
    };
    GE.byName = function (a, b) {
        return GE.personName(a).localeCompare(GE.personName(b), 'ru');
    };
    GE.bySort = function (a, b) {
        return (a.sort_order || 0) - (b.sort_order || 0) || String(a.created_at || '').localeCompare(String(b.created_at || ''));
    };
    GE.PART_LABEL = { class: 'Урок', homework: 'Домашка' };

    // Детерминированное перемешивание: у одного ученика порядок не скачет при перезагрузке
    function hash(str) {
        let h = 2166136261;
        for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
        return h >>> 0;
    }
    function rng(seed) {
        let a = seed >>> 0;
        return function () {
            a |= 0; a = a + 0x6D2B79F5 | 0;
            let t = Math.imul(a ^ a >>> 15, 1 | a);
            t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
    }
    GE.shuffle = function (arr, seed) {
        const a = arr.slice();
        const r = rng(hash(String(seed)));
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(r() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    };
    // То же, но гарантирует, что порядок не совпадёт с правильным (если это возможно)
    GE.shuffleNotSame = function (arr, seed, same) {
        if (arr.length < 2) return arr.slice();
        const eq = same || ((x, y) => x === y);
        let s = GE.shuffle(arr, seed);
        if (s.every((x, i) => eq(x, arr[i]))) s = s.slice(1).concat([s[0]]);
        return s;
    };

    // =================================================================
    // Разбор разметки
    // =================================================================
    // {ответ} {ответ/вариант} — пропуск;  {верный|неверный|неверный} — выбор
    GE.parseInline = function (text) {
        const src = String(text || '').replace(/\r/g, '');
        const tokens = [];
        const re = /\{([^{}]*)\}/g;
        let last = 0, m, n = 0;
        while ((m = re.exec(src))) {
            if (m.index > last) tokens.push({ t: 'text', v: src.slice(last, m.index) });
            const inner = m[1];
            if (inner.indexOf('|') !== -1) {
                const options = inner.split('|').map(s => s.trim()).filter(Boolean);
                tokens.push({ t: 'choice', i: n++, options: options, correct: options[0] || '' });
            } else {
                const answers = inner.split('/').map(s => s.trim()).filter(Boolean);
                tokens.push({ t: 'gap', i: n++, answers: answers });
            }
            last = re.lastIndex;
        }
        if (last < src.length) tokens.push({ t: 'text', v: src.slice(last) });
        return { tokens: tokens, count: n };
    };

    GE.parseMatch = function (text) {
        return String(text || '').replace(/\r/g, '').split('\n').map(l => l.trim()).filter(Boolean).map(l => {
            const k = l.indexOf('=');
            if (k < 0) return null;
            return { left: l.slice(0, k).trim(), right: l.slice(k + 1).trim() };
        }).filter(p => p && p.left && p.right);
    };

    GE.parseMcq = function (text) {
        const blocks = String(text || '').replace(/\r/g, '').split(/\n\s*\n/)
            .map(b => b.split('\n').map(l => l.trim()).filter(Boolean))
            .filter(b => b.length);
        return blocks.map(lines => {
            let question = '';
            if (lines.length > 1 && lines[0].charAt(0) !== '*') question = lines.shift();
            const options = lines.map(l => {
                const correct = l.charAt(0) === '*';
                return { text: correct ? l.slice(1).trim() : l, correct: correct };
            });
            return { question: question, options: options, multi: options.filter(o => o.correct).length > 1 };
        });
    };

    GE.parseOrder = function (content) {
        const c = content || {};
        const lines = String(c.text || '').replace(/\r/g, '').split('\n').map(l => l.trim()).filter(Boolean);
        if (c.mode === 'lines') return { mode: 'lines', items: lines };
        return {
            mode: 'words',
            sentences: lines.map(l => l.indexOf('/') !== -1
                ? l.split('/').map(w => w.trim()).filter(Boolean)
                : l.split(/\s+/).filter(Boolean))
        };
    };

    // Проблемы в разметке — показываются в конструкторе
    GE.validateTask = function (task) {
        const c = task.content || {};
        const issues = [];
        switch (task.type) {
            case 'gaps': case 'drag_words': {
                const p = GE.parseInline(c.text);
                if (!p.count) issues.push('Нет ни одного пропуска — отметьте их фигурными скобками {…}.');
                p.tokens.forEach(t => {
                    if (t.t === 'gap' && !t.answers.length) issues.push('Пустые скобки {} в пропуске №' + (t.i + 1) + '.');
                    if (t.t === 'choice' && t.options.length < 2) issues.push('В выборе №' + (t.i + 1) + ' меньше двух вариантов.');
                });
                if (/[{}]/.test(p.tokens.filter(t => t.t === 'text').map(t => t.v).join(''))) issues.push('Где-то незакрытая фигурная скобка.');
                break;
            }
            case 'match': {
                const pairs = GE.parseMatch(c.text);
                if (pairs.length < 2) issues.push('Нужно хотя бы две пары вида «левое = правое».');
                break;
            }
            case 'order': {
                const o = GE.parseOrder(c);
                if (o.mode === 'lines' && o.items.length < 2) issues.push('Нужно хотя бы две строки.');
                if (o.mode === 'words' && !o.sentences.length) issues.push('Добавьте хотя бы одно предложение.');
                if (o.mode === 'words' && o.sentences.some(s => s.length < 2)) issues.push('В каждом предложении должно быть хотя бы два слова.');
                break;
            }
            case 'mcq': {
                const qs = GE.parseMcq(c.text);
                if (!qs.length) issues.push('Нет ни одного вопроса.');
                qs.forEach((q, i) => {
                    if (q.options.length < 2) issues.push('В вопросе ' + (i + 1) + ' меньше двух вариантов.');
                    if (!q.options.some(o => o.correct)) issues.push('В вопросе ' + (i + 1) + ' не отмечен верный ответ (звёздочка *).');
                });
                break;
            }
        }
        return issues;
    };

    // =================================================================
    // Файлы: подписанные ссылки, загрузка
    // =================================================================
    const urlCache = new Map();
    GE.signedUrl = async function (path) {
        const hit = urlCache.get(path);
        if (hit && hit.exp > Date.now()) return hit.url;
        const { data, error } = await GE.db().storage.from(GE.BUCKET).createSignedUrl(path, 3600);
        if (error) throw error;
        urlCache.set(path, { url: data.signedUrl, exp: Date.now() + 50 * 60 * 1000 });
        return data.signedUrl;
    };
    GE.uploadFile = async function (path, file, contentType) {
        const { error } = await GE.db().storage.from(GE.BUCKET).upload(path, file, {
            contentType: contentType || file.type || undefined,
            upsert: false
        });
        if (error) throw error;
        return path;
    };
    GE.youtubeEmbed = function (url) {
        const s = String(url || '').trim();
        const m = s.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
        if (!m) return null;
        const t = s.match(/[?&](?:t|start)=(\d+)/);
        return 'https://www.youtube-nocookie.com/embed/' + m[1] + (t ? '?start=' + t[1] : '');
    };
    GE.renderMedia = function (task) {
        const parts = [];
        if (task.audio_path) parts.push('<audio class="ge-audio" controls preload="metadata" data-ge-src="' + GE.esc(task.audio_path) + '"></audio>');
        if (task.video_url) {
            const yt = GE.youtubeEmbed(task.video_url);
            if (yt) parts.push('<div class="ge-video"><iframe src="' + GE.esc(yt) + '" title="Видео" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>');
            else if (/^https?:\/\//i.test(task.video_url)) parts.push('<video class="ge-video-file" controls preload="metadata" src="' + GE.esc(task.video_url) + '"></video>');
        }
        if (task.image_path) parts.push('<img class="ge-img" alt="" data-ge-src="' + GE.esc(task.image_path) + '">');
        if (task.passage) parts.push('<div class="ge-passage">' + GE.fmt(task.passage) + '</div>');
        if (!parts.length) return null;
        const box = el('div', 'ge-media');
        box.innerHTML = parts.join('');
        GE.hydrateMedia(box);
        return box;
    };
    GE.hydrateMedia = function (scope) {
        scope.querySelectorAll('[data-ge-src]').forEach(async node => {
            const path = node.getAttribute('data-ge-src');
            node.removeAttribute('data-ge-src');
            try {
                node.src = await GE.signedUrl(path);
            } catch (e) {
                const n = el('div', 'ge-warn');
                n.textContent = 'Файл не загрузился: ' + (e.message || e);
                node.replaceWith(n);
            }
        });
    };

    // =================================================================
    // Сохранение ответа ученика
    // =================================================================
    GE.saveAnswer = async function (taskId, studentId, payload) {
        const row = {
            task_id: taskId,
            student_id: studentId,
            answer: payload.answer || {},
            correct_count: payload.correct_count == null ? null : payload.correct_count,
            total_count: payload.total_count == null ? null : payload.total_count,
            status: payload.status || 'checked'
        };
        const { data, error } = await GE.db().from('ge_answers')
            .upsert(row, { onConflict: 'task_id,student_id' })
            .select().single();
        if (error) throw error;
        return data;
    };

    // =================================================================
    // DOM-помощники
    // =================================================================
    function el(tag, cls, text) {
        const n = document.createElement(tag);
        if (cls) n.className = cls;
        if (text != null) n.textContent = text;
        return n;
    }
    function elHtml(tag, cls, html) {
        const n = el(tag, cls);
        n.innerHTML = html;
        return n;
    }
    function btn(text, cls) {
        const b = el('button', 'ge-btn ' + (cls || ''), text);
        b.type = 'button';
        return b;
    }
    function note(text, cls) {
        return el('div', cls || 'ge-hint', text);
    }
    GE.el = el;

    function setMark(wrap, ok, solution) {
        wrap.classList.remove('ge-ok', 'ge-bad');
        const old = wrap.querySelector(':scope > .ge-sol');
        if (old) old.remove();
        if (ok === true) wrap.classList.add('ge-ok');
        if (ok === false) {
            wrap.classList.add('ge-bad');
            if (solution) wrap.appendChild(el('span', 'ge-sol', solution));
        }
    }
    function clearMark(wrap) { setMark(wrap, null); }

    function gapWidth(answers) {
        const L = Math.max(3, ...answers.map(a => a.length));
        return Math.min(32, Math.ceil((L + 2) / 4) * 4) + 'ch';
    }
    function isRight(tok, value) {
        const v = GE.norm(value);
        if (!v) return false;
        if (tok.t === 'choice') return v === GE.norm(tok.correct);
        return tok.answers.some(a => GE.norm(a) === v);
    }
    function solutionOf(tok) {
        return tok.t === 'choice' ? tok.correct : tok.answers.join(' / ');
    }
    let uidCounter = 0;

    // =================================================================
    // Общая часть для заданий с автопроверкой
    // =================================================================
    function setupAuto(ctx, api) {
        const mode = ctx.mode, saved = ctx.saved, foot = ctx.foot;
        const result = el('span', 'ge-result');
        const status = el('span', 'ge-savestate');

        function show(ev) {
            result.className = 'ge-result ' + (ev.correct === ev.total ? 'is-ok' : 'is-part');
            result.textContent = (ev.correct === ev.total ? '✓ ' : '') + ev.correct + ' из ' + ev.total;
        }

        if (saved && saved.answer) {
            api.setAnswer(saved.answer);
            const ev = api.evaluate(saved.answer);
            api.applyMarks(ev, mode === 'review');
            show(ev);
        }

        if (mode === 'review') {
            api.setDisabled(true);
            if (!saved) foot.appendChild(note('Ученик ещё не выполнял это задание.', 'ge-hint'));
            else {
                foot.appendChild(result);
                foot.appendChild(el('span', 'ge-meta', 'попыток: ' + (saved.attempts || 1)));
            }
            return;
        }

        const check = btn('Проверить', 'ge-btn-primary');
        foot.appendChild(check);
        foot.appendChild(result);
        foot.appendChild(status);

        let solShown = false;
        if (mode === 'preview') {
            const solBtn = btn('Показать ответы', 'ge-btn-ghost');
            solBtn.onclick = () => {
                solShown = !solShown;
                solBtn.textContent = solShown ? 'Скрыть ответы' : 'Показать ответы';
                const ev = api.evaluate(api.getAnswer());
                api.applyMarks(ev, solShown);
                if (solShown) show(ev);
            };
            foot.appendChild(solBtn);
        }

        check.onclick = async () => {
            const ans = api.getAnswer();
            const ev = api.evaluate(ans);
            api.applyMarks(ev, solShown);
            show(ev);
            if (mode !== 'student' || !ctx.opts.onSubmit) return;
            check.disabled = true;
            status.className = 'ge-savestate';
            status.textContent = 'Сохраняю…';
            try {
                await ctx.opts.onSubmit({ answer: ans, correct_count: ev.correct, total_count: ev.total, status: 'checked' });
                status.textContent = 'Сохранено';
            } catch (e) {
                status.className = 'ge-savestate is-err';
                status.textContent = 'Не сохранилось: ' + (e.message || e);
            } finally {
                check.disabled = false;
            }
        };
    }

    // =================================================================
    // Отрисовщики по типам
    // =================================================================
    const R = {};

    // ---------- Пропуски и выбор ----------
    R.gaps = function (ctx) {
        const parsed = GE.parseInline(ctx.content.text);
        const flow = el('div', 'ge-flow');
        const items = [];
        parsed.tokens.forEach(tok => {
            if (tok.t === 'text') { flow.appendChild(elHtml('span', null, GE.fmt(tok.v))); return; }
            const wrap = el('span', 'ge-slotwrap');
            let node;
            if (tok.t === 'gap') {
                node = document.createElement('input');
                node.type = 'text';
                node.className = 'ge-input';
                node.autocomplete = 'off';
                node.setAttribute('autocapitalize', 'off');
                node.setAttribute('autocorrect', 'off');
                node.spellcheck = false;
                node.style.width = gapWidth(tok.answers);
            } else {
                node = document.createElement('select');
                node.className = 'ge-select';
                node.appendChild(new Option('…', ''));
                GE.shuffle(tok.options, ctx.task.id + ':' + tok.i).forEach(o => node.appendChild(new Option(o, o)));
            }
            node.setAttribute('aria-label', 'Пропуск ' + (tok.i + 1));
            const reset = () => clearMark(wrap);
            node.addEventListener('input', reset);
            node.addEventListener('change', reset);
            wrap.appendChild(node);
            flow.appendChild(wrap);
            items.push({ tok: tok, node: node, wrap: wrap });
        });
        ctx.body.appendChild(flow);

        const api = {
            getAnswer: () => ({ v: items.map(it => it.node.value) }),
            setAnswer: a => {
                const v = (a && a.v) || [];
                items.forEach((it, i) => { it.node.value = v[i] == null ? '' : v[i]; });
            },
            evaluate: a => {
                const v = (a && a.v) || [];
                const marks = items.map((it, i) => isRight(it.tok, v[i]));
                return { marks: marks, correct: marks.filter(Boolean).length, total: items.length };
            },
            applyMarks: (ev, sol) => items.forEach((it, i) => setMark(it.wrap, ev.marks[i], sol ? solutionOf(it.tok) : null)),
            setDisabled: d => items.forEach(it => { it.node.disabled = d; })
        };
        if (items.length) setupAuto(ctx, api);
        return api;
    };

    // ---------- Перетащить слова (нажатием — удобно на телефоне) ----------
    R.drag_words = function (ctx) {
        const parsed = GE.parseInline(ctx.content.text);
        const flow = el('div', 'ge-flow');
        const slots = [];
        parsed.tokens.forEach(tok => {
            if (tok.t === 'text') { flow.appendChild(elHtml('span', null, GE.fmt(tok.v))); return; }
            const answers = tok.t === 'choice' ? [tok.correct] : tok.answers;
            const wrap = el('span', 'ge-slotwrap');
            const node = btn('', 'ge-dslot');
            node.setAttribute('aria-label', 'Пропуск ' + (slots.length + 1));
            wrap.appendChild(node);
            flow.appendChild(wrap);
            slots.push({ tok: { t: 'gap', answers: answers }, node: node, wrap: wrap, chip: null });
        });

        const words = slots.map(s => s.tok.answers[0] || '').filter(Boolean).concat(GE.parseList(ctx.content.extra));
        const bank = el('div', 'ge-bank');
        const chips = GE.shuffle(words, ctx.task.id + ':bank').map(w => ({ w: w, node: null, slot: null }));
        let selected = null, disabled = false;

        function select(s) {
            selected = s;
            slots.forEach(x => x.node.classList.toggle('is-selected', x === s));
        }
        function place(ch, s) {
            if (s.chip) unplace(s);
            s.chip = ch; ch.slot = s;
            s.node.textContent = ch.w;
            s.node.classList.add('is-filled');
            ch.node.classList.add('is-used');
            ch.node.disabled = true;
            clearMark(s.wrap);
            select(null);
        }
        function unplace(s) {
            const ch = s.chip;
            if (!ch) return;
            ch.slot = null;
            ch.node.classList.remove('is-used');
            ch.node.disabled = disabled;
            s.chip = null;
            s.node.textContent = '';
            s.node.classList.remove('is-filled');
            clearMark(s.wrap);
        }
        chips.forEach(ch => {
            const b = btn(ch.w, 'ge-chip');
            ch.node = b;
            b.onclick = () => {
                if (disabled || ch.slot) return;
                const target = selected || slots.find(s => !s.chip);
                if (target) place(ch, target);
            };
            bank.appendChild(b);
        });
        slots.forEach(s => {
            s.node.onclick = () => {
                if (disabled) return;
                if (s.chip) unplace(s);
                else select(selected === s ? null : s);
            };
        });

        ctx.body.appendChild(flow);
        ctx.body.appendChild(note('Нажмите на слово — оно встанет в первый свободный пропуск (или в выбранный). Нажмите на заполненный пропуск, чтобы вернуть слово.'));
        ctx.body.appendChild(bank);

        const api = {
            getAnswer: () => ({ v: slots.map(s => s.chip ? s.chip.w : '') }),
            setAnswer: a => {
                slots.forEach(unplace);
                const v = (a && a.v) || [];
                v.forEach((w, i) => {
                    if (!w || !slots[i]) return;
                    const ch = chips.find(c => !c.slot && c.w === w);
                    if (ch) place(ch, slots[i]);
                });
            },
            evaluate: a => {
                const v = (a && a.v) || [];
                const marks = slots.map((s, i) => isRight(s.tok, v[i]));
                return { marks: marks, correct: marks.filter(Boolean).length, total: slots.length };
            },
            applyMarks: (ev, sol) => slots.forEach((s, i) => setMark(s.wrap, ev.marks[i], sol ? s.tok.answers.join(' / ') : null)),
            setDisabled: d => {
                disabled = d;
                chips.forEach(c => { c.node.disabled = d || !!c.slot; });
                slots.forEach(s => { s.node.disabled = d; });
            }
        };
        if (slots.length) setupAuto(ctx, api);
        return api;
    };

    // ---------- Сопоставление ----------
    R.match = function (ctx) {
        const pairs = GE.parseMatch(ctx.content.text);
        const rights = [];
        pairs.map(p => p.right).concat(GE.parseList(ctx.content.extra)).forEach(r => { if (rights.indexOf(r) === -1) rights.push(r); });
        const options = GE.shuffle(rights, ctx.task.id + ':match');
        const list = el('div', 'ge-match');
        const rows = pairs.map((p, i) => {
            const row = el('div', 'ge-mrow');
            row.appendChild(elHtml('div', 'ge-mleft', '<span class="ge-n">' + (i + 1) + '</span><span>' + GE.fmt(p.left) + '</span>'));
            const wrap = el('span', 'ge-slotwrap ge-mright');
            const sel = document.createElement('select');
            sel.className = 'ge-select ge-select-wide';
            sel.setAttribute('aria-label', 'Пара к «' + p.left + '»');
            sel.appendChild(new Option('— выберите —', ''));
            options.forEach(o => sel.appendChild(new Option(o, o)));
            sel.addEventListener('change', () => clearMark(wrap));
            wrap.appendChild(sel);
            row.appendChild(wrap);
            list.appendChild(row);
            return { p: p, sel: sel, wrap: wrap };
        });
        ctx.body.appendChild(list);

        const api = {
            getAnswer: () => ({ v: rows.map(r => r.sel.value) }),
            setAnswer: a => { const v = (a && a.v) || []; rows.forEach((r, i) => { r.sel.value = v[i] || ''; }); },
            evaluate: a => {
                const v = (a && a.v) || [];
                const marks = rows.map((r, i) => !!v[i] && GE.norm(v[i]) === GE.norm(r.p.right));
                return { marks: marks, correct: marks.filter(Boolean).length, total: rows.length };
            },
            applyMarks: (ev, sol) => rows.forEach((r, i) => setMark(r.wrap, ev.marks[i], sol ? r.p.right : null)),
            setDisabled: d => rows.forEach(r => { r.sel.disabled = d; })
        };
        if (rows.length) setupAuto(ctx, api);
        return api;
    };

    // ---------- Расставить по порядку ----------
    R.order = function (ctx) {
        const parsed = GE.parseOrder(ctx.content);
        return parsed.mode === 'lines' ? orderLines(ctx, parsed.items) : orderWords(ctx, parsed.sentences);
    };

    function orderLines(ctx, items) {
        const idx = items.map((_, i) => i);
        let current = GE.shuffleNotSame(idx, ctx.task.id + ':order', (a, b) => items[a] === items[b]);
        let disabled = false;
        const ol = el('ol', 'ge-olist');
        const solBox = el('div', 'ge-solblock');
        solBox.hidden = true;

        function draw() {
            ol.innerHTML = '';
            current.forEach(i => {
                const li = el('li', 'ge-oitem');
                li.dataset.idx = i;
                li.innerHTML = '<span class="ge-handle" aria-hidden="true">⠿</span><span class="ge-otext">' + GE.fmt(items[i]) + '</span>' +
                    '<span class="ge-oarrows"><button type="button" class="ge-ar" data-d="-1" aria-label="Выше">↑</button>' +
                    '<button type="button" class="ge-ar" data-d="1" aria-label="Ниже">↓</button></span>';
                ol.appendChild(li);
            });
            if (disabled) ol.querySelectorAll('.ge-ar').forEach(b => { b.disabled = true; });
        }
        function clearAll() {
            ol.querySelectorAll('.ge-oitem').forEach(li => li.classList.remove('ge-ok', 'ge-bad'));
            solBox.hidden = true;
        }
        ol.addEventListener('click', e => {
            const b = e.target.closest('.ge-ar');
            if (!b || disabled) return;
            const pos = Array.prototype.indexOf.call(ol.children, b.closest('.ge-oitem'));
            const np = pos + Number(b.dataset.d);
            if (np < 0 || np >= current.length) return;
            const t = current[pos]; current[pos] = current[np]; current[np] = t;
            draw();
            clearAll();
        });
        draw();
        if (root.Sortable) {
            root.Sortable.create(ol, {
                handle: '.ge-handle', animation: 150,
                onStart: () => { if (disabled) return false; },
                onEnd: () => { current = Array.prototype.map.call(ol.children, li => Number(li.dataset.idx)); clearAll(); }
            });
        }
        ctx.body.appendChild(note('Перетащите строки за ⠿ или двигайте стрелками.'));
        ctx.body.appendChild(ol);
        ctx.body.appendChild(solBox);

        const api = {
            getAnswer: () => ({ v: current.map(i => items[i]) }),
            setAnswer: a => {
                const v = (a && a.v) || [];
                const used = new Set();
                const next = [];
                v.forEach(text => {
                    const i = items.findIndex((t, k) => !used.has(k) && t === text);
                    if (i !== -1) { used.add(i); next.push(i); }
                });
                idx.forEach(i => { if (!used.has(i)) next.push(i); });
                current = next;
                draw();
            },
            evaluate: a => {
                const v = (a && a.v) || [];
                const marks = items.map((t, i) => v[i] != null && GE.norm(v[i]) === GE.norm(t));
                return { marks: marks, correct: marks.filter(Boolean).length, total: items.length };
            },
            applyMarks: (ev, sol) => {
                Array.prototype.forEach.call(ol.children, (li, pos) => {
                    li.classList.toggle('ge-ok', ev.marks[pos] === true);
                    li.classList.toggle('ge-bad', ev.marks[pos] === false);
                });
                if (sol && ev.correct < ev.total) {
                    solBox.innerHTML = '<div class="ge-soltitle">Правильный порядок:</div><ol>' + items.map(t => '<li>' + GE.fmt(t) + '</li>').join('') + '</ol>';
                    solBox.hidden = false;
                } else solBox.hidden = true;
            },
            setDisabled: d => {
                disabled = d;
                ol.classList.toggle('is-disabled', d);
                ol.querySelectorAll('.ge-ar').forEach(b => { b.disabled = d; });
            }
        };
        if (items.length) setupAuto(ctx, api);
        return api;
    }

    function orderWords(ctx, sentences) {
        let disabled = false;
        const blocks = sentences.map((words, si) => {
            const box = el('div', 'ge-wsent ge-slotwrap');
            if (sentences.length > 1) box.appendChild(el('span', 'ge-n', String(si + 1)));
            const inner = el('div', 'ge-winner');
            const line = el('div', 'ge-wline');
            const bank = el('div', 'ge-bank');
            const chips = GE.shuffleNotSame(words.map((w, i) => ({ w: w, i: i })), ctx.task.id + ':w' + si, (a, b) => a.w === b.w)
                .map(c => ({ w: c.w, node: null, inLine: false }));
            const blk = { words: words, line: line, bank: bank, chips: chips, built: [], box: box };
            chips.forEach(ch => {
                const b = btn(ch.w, 'ge-chip');
                ch.node = b;
                b.onclick = () => {
                    if (disabled) return;
                    if (ch.inLine) {
                        blk.built.splice(blk.built.indexOf(ch), 1);
                        ch.inLine = false;
                        bank.appendChild(b);
                    } else {
                        blk.built.push(ch);
                        ch.inLine = true;
                        line.appendChild(b);
                    }
                    clearMark(box);
                };
                bank.appendChild(b);
            });
            inner.appendChild(line);
            inner.appendChild(bank);
            box.appendChild(inner);
            return blk;
        });
        ctx.body.appendChild(note('Нажимайте на слова по порядку, чтобы собрать предложение. Нажмите на слово в предложении, чтобы вернуть его.'));
        blocks.forEach(b => ctx.body.appendChild(b.box));

        function reset(blk) {
            blk.built.forEach(ch => { ch.inLine = false; });
            blk.built = [];
            blk.chips.forEach(ch => blk.bank.appendChild(ch.node));
        }
        const api = {
            getAnswer: () => ({ v: blocks.map(b => b.built.map(ch => ch.w)) }),
            setAnswer: a => {
                const v = (a && a.v) || [];
                blocks.forEach((b, si) => {
                    reset(b);
                    (v[si] || []).forEach(w => {
                        const ch = b.chips.find(c => !c.inLine && c.w === w);
                        if (ch) { ch.inLine = true; b.built.push(ch); b.line.appendChild(ch.node); }
                    });
                });
            },
            evaluate: a => {
                const v = (a && a.v) || [];
                const marks = blocks.map((b, si) => {
                    const got = v[si] || [];
                    return got.length === b.words.length && GE.norm(got.join(' ')) === GE.norm(b.words.join(' '));
                });
                return { marks: marks, correct: marks.filter(Boolean).length, total: blocks.length };
            },
            applyMarks: (ev, sol) => blocks.forEach((b, si) => setMark(b.box, ev.marks[si], sol ? b.words.join(' ') : null)),
            setDisabled: d => {
                disabled = d;
                blocks.forEach(b => b.chips.forEach(ch => { ch.node.disabled = d; }));
            }
        };
        if (blocks.length) setupAuto(ctx, api);
        return api;
    }

    // ---------- Вопросы с вариантами ----------
    R.mcq = function (ctx) {
        const qs = GE.parseMcq(ctx.content.text);
        const uid = 'q' + (++uidCounter);
        const boxes = qs.map((q, qi) => {
            const box = el('div', 'ge-q');
            if (q.question) box.appendChild(elHtml('div', 'ge-qtext', '<span class="ge-n">' + (qi + 1) + '</span><span>' + GE.fmt(q.question) + '</span>'));
            if (q.multi) box.appendChild(el('div', 'ge-hint', 'Несколько верных ответов'));
            const inputs = q.options.map((o, oi) => {
                const lab = el('label', 'ge-opt');
                const inp = document.createElement('input');
                inp.type = q.multi ? 'checkbox' : 'radio';
                inp.name = uid + '-' + qi;
                inp.value = String(oi);
                inp.addEventListener('change', () => clear(box));
                lab.appendChild(inp);
                lab.appendChild(elHtml('span', null, GE.fmt(o.text)));
                box.appendChild(lab);
                return { inp: inp, lab: lab, o: o };
            });
            ctx.body.appendChild(box);
            return { q: q, box: box, inputs: inputs };
        });
        function clear(box) {
            box.classList.remove('ge-ok', 'ge-bad');
            box.querySelectorAll('.ge-opt').forEach(l => l.classList.remove('is-ok', 'is-bad', 'is-should'));
        }
        const api = {
            getAnswer: () => ({ v: boxes.map(b => b.inputs.filter(x => x.inp.checked).map(x => Number(x.inp.value))) }),
            setAnswer: a => {
                const v = (a && a.v) || [];
                boxes.forEach((b, qi) => {
                    const sel = v[qi] || [];
                    b.inputs.forEach((x, oi) => { x.inp.checked = sel.indexOf(oi) !== -1; });
                });
            },
            evaluate: a => {
                const v = (a && a.v) || [];
                const marks = boxes.map((b, qi) => {
                    const sel = (v[qi] || []).slice().sort().join(',');
                    const right = b.q.options.map((o, oi) => o.correct ? oi : -1).filter(i => i >= 0).sort().join(',');
                    return sel !== '' && sel === right;
                });
                return { marks: marks, correct: marks.filter(Boolean).length, total: boxes.length };
            },
            applyMarks: (ev, sol) => boxes.forEach((b, qi) => {
                clear(b.box);
                b.box.classList.add(ev.marks[qi] ? 'ge-ok' : 'ge-bad');
                b.inputs.forEach(x => {
                    if (x.inp.checked) x.lab.classList.add(x.o.correct ? 'is-ok' : 'is-bad');
                    else if (sol && x.o.correct) x.lab.classList.add('is-should');
                });
            }),
            setDisabled: d => boxes.forEach(b => b.inputs.forEach(x => { x.inp.disabled = d; }))
        };
        if (boxes.length) setupAuto(ctx, api);
        return api;
    };

    // ---------- Статус и комментарий для заданий «на проверку» ----------
    function reviewStatus(saved) {
        if (!saved) return null;
        const s = el('div', 'ge-status ' + (saved.status === 'reviewed' ? 'is-reviewed' : 'is-pending'));
        s.textContent = saved.status === 'reviewed' ? '✓ Проверено' : 'Отправлено · ждёт проверки';
        return s;
    }

    // ---------- Письменный ответ ----------
    R.open = function (ctx) {
        const c = ctx.content, saved = ctx.saved, mode = ctx.mode;
        if (c.prompt) ctx.body.appendChild(elHtml('div', 'ge-prompt', GE.fmt(c.prompt)));
        const ta = el('textarea', 'ge-textarea');
        ta.rows = 7;
        ta.placeholder = 'Ваш ответ…';
        const counter = el('div', 'ge-counter');
        const minW = Number(c.min_words) || 0;
        const draftKey = 'ge-draft-' + ctx.task.id;
        function count() {
            const n = GE.wordCount(ta.value);
            counter.textContent = n + ' ' + plural(n, 'слово', 'слова', 'слов') + (minW ? ' · минимум ' + minW : '');
            counter.classList.toggle('is-low', !!minW && n < minW);
        }
        if (saved && saved.answer) ta.value = saved.answer.text || '';
        else if (mode === 'student') { try { ta.value = localStorage.getItem(draftKey) || ''; } catch (e) { /* хранилище недоступно */ } }
        ta.addEventListener('input', () => {
            count();
            if (mode === 'student') { try { localStorage.setItem(draftKey, ta.value); } catch (e) { /* ничего */ } }
        });
        ctx.body.appendChild(ta);
        ctx.body.appendChild(counter);
        count();

        const st = reviewStatus(saved);
        if (mode === 'review') {
            ta.readOnly = true;
            if (!saved) ctx.foot.appendChild(note('Ученик ещё не отвечал.'));
            else ctx.foot.appendChild(st);
            return {};
        }
        if (saved && saved.status === 'reviewed') {
            ta.readOnly = true;
            ctx.foot.appendChild(st);
            return {};
        }
        const send = btn(saved ? 'Отправить исправленный ответ' : 'Отправить на проверку', 'ge-btn-primary');
        const msg = el('span', 'ge-savestate');
        ctx.foot.appendChild(send);
        if (st) ctx.foot.appendChild(st);
        ctx.foot.appendChild(msg);
        send.onclick = async () => {
            const text = ta.value.trim();
            msg.className = 'ge-savestate';
            if (!text) { msg.className = 'ge-savestate is-err'; msg.textContent = 'Ответ пустой.'; return; }
            if (minW && GE.wordCount(text) < minW) { msg.className = 'ge-savestate is-err'; msg.textContent = 'Нужно не меньше ' + minW + ' слов.'; return; }
            if (mode !== 'student') { msg.textContent = 'В режиме просмотра ответ не сохраняется.'; return; }
            send.disabled = true;
            msg.textContent = 'Отправляю…';
            try {
                await ctx.opts.onSubmit({ answer: { text: text }, status: 'pending_review' });
                try { localStorage.removeItem(draftKey); } catch (e) { /* ничего */ }
                msg.textContent = 'Отправлено';
            } catch (e) {
                msg.className = 'ge-savestate is-err';
                msg.textContent = 'Не отправилось: ' + (e.message || e);
            } finally {
                send.disabled = false;
            }
        };
        return {};
    };

    // ---------- Запись голоса ----------
    function pickMime() {
        if (!root.MediaRecorder) return null;
        if (typeof root.MediaRecorder.isTypeSupported !== 'function') return '';
        const list = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus'];
        for (let i = 0; i < list.length; i++) if (root.MediaRecorder.isTypeSupported(list[i])) return list[i];
        return '';
    }
    function extFor(mime) {
        if (/mp4|aac|m4a/.test(mime)) return 'm4a';
        if (/ogg/.test(mime)) return 'ogg';
        return 'webm';
    }
    function fmtTime(s) {
        s = Math.max(0, Math.round(s));
        return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
    }
    GE.fmtTime = fmtTime;

    R.speaking = function (ctx) {
        const c = ctx.content, saved = ctx.saved, mode = ctx.mode;
        const maxSec = Math.max(10, Number(c.max_seconds) || 120);
        if (c.prompt) ctx.body.appendChild(elHtml('div', 'ge-prompt', GE.fmt(c.prompt)));
        const area = el('div', 'ge-rec');
        ctx.body.appendChild(area);

        function savedPlayer() {
            if (!saved || !saved.answer || !saved.answer.audio_path) return null;
            const a = el('audio', 'ge-audio');
            a.controls = true;
            a.preload = 'metadata';
            a.setAttribute('data-ge-src', saved.answer.audio_path);
            const wrap = el('div');
            wrap.appendChild(a);
            GE.hydrateMedia(wrap);
            return wrap;
        }

        if (mode === 'review') {
            const p = savedPlayer();
            if (p) { area.appendChild(p); ctx.foot.appendChild(reviewStatus(saved)); }
            else ctx.foot.appendChild(note('Ученик ещё не записал ответ.'));
            return {};
        }
        if (saved && saved.status === 'reviewed') {
            const p = savedPlayer();
            if (p) area.appendChild(p);
            ctx.foot.appendChild(reviewStatus(saved));
            return {};
        }

        let stream = null, rec = null, chunks = [], timer = null, started = 0, recSeconds = 0, blob = null, blobUrl = null, mime = '';
        const msg = el('span', 'ge-savestate');

        function stopStream() {
            if (stream) stream.getTracks().forEach(t => t.stop());
            stream = null;
        }
        function clearTimer() { if (timer) clearInterval(timer); timer = null; }

        function viewIdle() {
            area.innerHTML = '';
            const p = savedPlayer();
            if (p) {
                area.appendChild(el('div', 'ge-hint', 'Ваша отправленная запись:'));
                area.appendChild(p);
            }
            const start = btn(p ? '● Записать заново' : '● Записать ответ', 'ge-btn-rec');
            start.onclick = startRec;
            area.appendChild(start);
            area.appendChild(el('span', 'ge-meta', 'до ' + fmtTime(maxSec)));
        }
        async function startRec() {
            msg.textContent = '';
            mime = pickMime();
            if (mime === null) { msg.className = 'ge-savestate is-err'; msg.textContent = 'Этот браузер не умеет записывать звук. Попробуйте Chrome или Safari.'; return; }
            try {
                stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            } catch (e) {
                msg.className = 'ge-savestate is-err';
                msg.textContent = 'Нет доступа к микрофону — разрешите его в настройках браузера.';
                return;
            }
            chunks = [];
            try { rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream); }
            catch (e) { rec = new MediaRecorder(stream); }
            rec.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
            rec.onstop = () => {
                recSeconds = Math.round((Date.now() - started) / 1000);
                clearTimer();
                stopStream();
                const type = (rec.mimeType || mime || 'audio/webm').split(';')[0];
                blob = new Blob(chunks, { type: type });
                if (blobUrl) URL.revokeObjectURL(blobUrl);
                blobUrl = URL.createObjectURL(blob);
                viewRecorded();
            };
            rec.start();
            started = Date.now();
            viewRecording();
        }
        function viewRecording() {
            area.innerHTML = '';
            const dot = el('span', 'ge-recdot');
            const t = el('span', 'ge-rectime', '0:00 / ' + fmtTime(maxSec));
            const stop = btn('■ Остановить', 'ge-btn-primary');
            stop.onclick = () => { if (rec && rec.state !== 'inactive') rec.stop(); };
            area.appendChild(dot); area.appendChild(t); area.appendChild(stop);
            timer = setInterval(() => {
                const sec = (Date.now() - started) / 1000;
                t.textContent = fmtTime(sec) + ' / ' + fmtTime(maxSec);
                if (sec >= maxSec && rec && rec.state !== 'inactive') rec.stop();
            }, 250);
        }
        function viewRecorded() {
            area.innerHTML = '';
            const a = el('audio', 'ge-audio');
            a.controls = true;
            a.src = blobUrl;
            const send = btn('Отправить на проверку', 'ge-btn-primary');
            const again = btn('Записать заново', 'ge-btn-ghost');
            again.onclick = startRec;
            send.onclick = async () => {
                if (mode !== 'student') { msg.className = 'ge-savestate'; msg.textContent = 'В режиме просмотра запись не сохраняется.'; return; }
                send.disabled = true; again.disabled = true;
                msg.className = 'ge-savestate';
                msg.textContent = 'Загружаю запись…';
                try {
                    const uid = ctx.opts.studentId;
                    const path = 'recordings/' + uid + '/' + ctx.task.id + '-' + Date.now() + '.' + extFor(blob.type);
                    await GE.uploadFile(path, blob, blob.type || 'audio/webm');
                    await ctx.opts.onSubmit({ answer: { audio_path: path, seconds: recSeconds }, status: 'pending_review' });
                    msg.textContent = 'Отправлено';
                } catch (e) {
                    msg.className = 'ge-savestate is-err';
                    msg.textContent = 'Не отправилось: ' + (e.message || e);
                    send.disabled = false; again.disabled = false;
                }
            };
            area.appendChild(a);
            const row = el('div', 'ge-row');
            row.appendChild(send); row.appendChild(again);
            area.appendChild(row);
        }

        viewIdle();
        const st = reviewStatus(saved);
        if (st) ctx.foot.appendChild(st);
        ctx.foot.appendChild(msg);
        return {
            destroy: () => {
                clearTimer();
                try { if (rec && rec.state !== 'inactive') rec.stop(); } catch (e) { /* ничего */ }
                stopStream();
            }
        };
    };

    // ---------- Теория / текст ----------
    R.info = function () { return {}; };

    function plural(n, one, few, many) {
        const m10 = n % 10, m100 = n % 100;
        if (m10 === 1 && m100 !== 11) return one;
        if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
        return many;
    }
    GE.plural = plural;

    // =================================================================
    // Главная функция: отрисовать задание в контейнер
    //   opts.mode     — 'student' (ученик, сохраняет), 'preview' (просмотр без сохранения),
    //                   'review' (преподаватель смотрит ответ ученика)
    //   opts.answer   — сохранённая строка ge_answers или null
    //   opts.onSubmit — async (payload) => …   (для ученика)
    //   opts.studentId — id ученика (для пути записи голоса)
    // =================================================================
    GE.renderTask = function (container, task, opts) {
        opts = opts || {};
        if (container.__geApi && container.__geApi.destroy) {
            try { container.__geApi.destroy(); } catch (e) { /* ничего */ }
        }
        container.innerHTML = '';
        const type = R[task.type] ? task.type : 'info';
        const card = el('div', 'ge-card ge-type-' + type);
        card.dataset.taskId = task.id || '';

        const head = el('div', 'ge-head');
        if (task.number) head.appendChild(el('span', 'ge-num', task.number));
        if (task.instruction) head.appendChild(elHtml('div', 'ge-instr', GE.fmt(task.instruction)));
        if (head.childNodes.length) card.appendChild(head);

        try {
            const media = GE.renderMedia(task);
            if (media) card.appendChild(media);
        } catch (e) { /* без медиа задание всё равно работает */ }

        const body = el('div', 'ge-body');
        const foot = el('div', 'ge-foot');
        card.appendChild(body);
        card.appendChild(foot);
        container.appendChild(card);

        const ctx = {
            task: task, mode: opts.mode || 'preview', saved: opts.answer || null, opts: opts,
            card: card, body: body, foot: foot, content: task.content || {}
        };
        let api = {};
        try {
            api = R[type](ctx) || {};
        } catch (e) {
            body.innerHTML = '';
            const w = el('div', 'ge-warn');
            w.textContent = 'Задание не отрисовалось: ' + (e.message || e);
            body.appendChild(w);
        }

        // Комментарий преподавателя — ученику (в режиме проверки его показывает форма проверки)
        const s = ctx.saved;
        if (ctx.mode !== 'review' && s && (s.feedback || s.score != null)) {
            const fb = el('div', 'ge-feedback');
            fb.innerHTML = '<div class="ge-fbtitle">Комментарий преподавателя' + (s.score != null ? ' · балл: ' + GE.esc(s.score) : '') + '</div>' +
                (s.feedback ? '<div class="ge-fbtext">' + GE.fmt(s.feedback) + '</div>' : '');
            card.appendChild(fb);
        }
        if (!foot.childNodes.length) foot.remove();
        container.__geApi = api;
        return api;
    };

    // =================================================================
    // Маленький UI: тосты и модальные окна (вместо alert/prompt)
    // =================================================================
    GE.ui = {
        toast: function (text, kind) {
            let box = document.getElementById('ge-toasts');
            if (!box) { box = el('div'); box.id = 'ge-toasts'; document.body.appendChild(box); }
            const t = el('div', 'ge-toast ' + (kind === 'error' ? 'is-err' : ''), text);
            box.appendChild(t);
            while (box.children.length > 2) box.firstChild.remove();
            setTimeout(() => { t.classList.add('is-out'); setTimeout(() => t.remove(), 300); }, kind === 'error' ? 6000 : 2500);
        },
        modal: function (title, bodyNode, buttons) {
            return new Promise(resolve => {
                const back = el('div', 'ge-modal-back');
                const box = el('div', 'ge-modal');
                box.setAttribute('role', 'dialog');
                box.appendChild(el('div', 'ge-modal-title', title));
                if (bodyNode) box.appendChild(bodyNode);
                const row = el('div', 'ge-modal-btns');
                function close(v) { back.remove(); document.removeEventListener('keydown', onKey); resolve(v); }
                function onKey(e) { if (e.key === 'Escape') close(null); }
                buttons.forEach(b => {
                    const x = btn(b.text, b.cls || '');
                    x.onclick = () => close(typeof b.value === 'function' ? b.value() : b.value);
                    row.appendChild(x);
                });
                box.appendChild(row);
                back.appendChild(box);
                back.addEventListener('click', e => { if (e.target === back) close(null); });
                document.addEventListener('keydown', onKey);
                document.body.appendChild(back);
                const f = box.querySelector('input,textarea,select');
                if (f) setTimeout(() => f.focus(), 30);
            });
        },
        confirm: function (text, okText, danger) {
            const p = el('p', 'ge-modal-text', text);
            return GE.ui.modal('Подтвердите', p, [
                { text: 'Отмена', cls: 'ge-btn-ghost', value: false },
                { text: okText || 'Да', cls: danger ? 'ge-btn-danger' : 'ge-btn-primary', value: true }
            ]).then(v => !!v);
        },
        form: function (title, fields, okText) {
            const wrap = el('div', 'ge-form');
            const inputs = {};
            fields.forEach(f => {
                const lab = el('label', 'ge-field');
                lab.appendChild(el('span', 'ge-field-label', f.label));
                const inp = f.type === 'textarea' ? el('textarea', 'ge-input-block') : el('input', 'ge-input-block');
                if (f.type !== 'textarea') inp.type = 'text';
                else inp.rows = 3;
                inp.value = f.value || '';
                if (f.placeholder) inp.placeholder = f.placeholder;
                inputs[f.name] = inp;
                lab.appendChild(inp);
                wrap.appendChild(lab);
            });
            const collect = () => {
                const out = {};
                Object.keys(inputs).forEach(k => { out[k] = inputs[k].value.trim(); });
                return out;
            };
            wrap.addEventListener('keydown', e => {
                if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
                    e.preventDefault();
                    const ok = wrap.parentNode && wrap.parentNode.querySelector('.ge-modal-btns .ge-btn-primary');
                    if (ok) ok.click();
                }
            });
            return GE.ui.modal(title, wrap, [
                { text: 'Отмена', cls: 'ge-btn-ghost', value: null },
                { text: okText || 'Сохранить', cls: 'ge-btn-primary', value: collect }
            ]);
        }
    };

    GE.safeIcons = function () {
        try { if (root.lucide && typeof root.lucide.createIcons === 'function') root.lucide.createIcons(); }
        catch (e) { /* иконки не критичны */ }
    };

    // =================================================================
    // Стили заданий (один раз на страницу)
    // =================================================================
    const CSS = `
.ge-card{background:#fff;border:1px solid #e5e7eb;border-radius:20px;padding:20px;color:#1f2937;font-size:16px;line-height:1.55}
.ge-card+.ge-card{margin-top:16px}
.ge-head{display:flex;gap:12px;align-items:flex-start;margin-bottom:14px}
.ge-num{flex:none;min-width:2.6em;padding:3px 10px;border-radius:999px;background:#eef2ff;color:#4338ca;font-weight:700;font-size:14px;text-align:center}
.ge-instr{font-weight:600;color:#111827;white-space:pre-wrap;padding-top:2px}
.ge-media{display:flex;flex-direction:column;gap:12px;margin-bottom:14px}
.ge-audio{width:100%;max-width:520px}
.ge-img{max-width:100%;max-height:420px;border-radius:14px;border:1px solid #e5e7eb;object-fit:contain;align-self:flex-start}
.ge-video{position:relative;width:100%;max-width:640px;aspect-ratio:16/9;border-radius:14px;overflow:hidden;background:#000}
.ge-video iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
.ge-video-file{width:100%;max-width:640px;border-radius:14px}
.ge-passage{white-space:pre-wrap;background:#f8fafc;border:1px solid #eef2f7;border-radius:14px;padding:14px 16px;line-height:1.7}
.ge-body{display:flex;flex-direction:column;gap:12px}
.ge-flow{white-space:pre-wrap;line-height:2.3;word-wrap:break-word}
.ge-slotwrap{display:inline-flex;align-items:center;gap:4px;vertical-align:baseline;border-radius:10px}
.ge-input,.ge-select{font:inherit;font-size:16px;line-height:1.3;padding:3px 8px;border:1.5px solid #c7d2fe;border-radius:10px;background:#f8faff;color:#111827;min-width:3.5em;max-width:100%}
.ge-input:focus,.ge-select:focus{outline:none;border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.18);background:#fff}
.ge-select{padding-right:4px;cursor:pointer}
.ge-select-wide{width:100%;min-width:0}
.ge-input:disabled,.ge-select:disabled{opacity:1;color:#111827;cursor:default}
.ge-ok .ge-input,.ge-ok .ge-select,.ge-ok.ge-dslot,.ge-ok .ge-dslot{border-color:#22c55e!important;background:#f0fdf4!important}
.ge-bad .ge-input,.ge-bad .ge-select,.ge-bad .ge-dslot{border-color:#ef4444!important;background:#fef2f2!important}
.ge-sol{font-size:13px;line-height:1.2;color:#15803d;background:#f0fdf4;border:1px dashed #86efac;border-radius:8px;padding:2px 6px;white-space:nowrap}
.ge-dslot{display:inline-block;min-width:5.5em;min-height:1.9em;padding:2px 10px;border:1.5px dashed #a5b4fc;border-radius:10px;background:#f8faff;font:inherit;font-size:16px;color:#111827;cursor:pointer;vertical-align:baseline;line-height:1.5}
.ge-dslot.is-filled{border-style:solid;background:#eef2ff;font-weight:600}
.ge-dslot.is-selected{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.25)}
.ge-bank{display:flex;flex-wrap:wrap;gap:8px;padding:12px;border-radius:14px;background:#f8fafc;border:1px solid #eef2f7;min-height:52px}
.ge-chip{font:inherit;font-size:15px;padding:6px 12px;border-radius:10px;border:1px solid #c7d2fe;background:#fff;color:#1e1b4b;cursor:pointer;box-shadow:0 1px 0 rgba(15,23,42,.06);transition:transform .08s}
.ge-chip:active{transform:scale(.96)}
.ge-chip.is-used{opacity:.3;cursor:default}
.ge-chip:disabled{cursor:default}
.ge-match{display:flex;flex-direction:column;gap:10px}
.ge-mrow{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;align-items:center}
.ge-mleft{display:flex;gap:10px;align-items:baseline}
.ge-mright{display:flex;flex-direction:column;align-items:stretch;gap:4px}
.ge-n{flex:none;display:inline-flex;align-items:center;justify-content:center;min-width:1.7em;height:1.7em;border-radius:999px;background:#f1f5f9;color:#475569;font-size:13px;font-weight:700;margin-right:6px}
.ge-olist{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
.ge-oitem{display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid #e5e7eb;border-radius:12px;background:#fff}
.ge-oitem.ge-ok{border-color:#22c55e;background:#f0fdf4}
.ge-oitem.ge-bad{border-color:#ef4444;background:#fef2f2}
.ge-handle{cursor:grab;color:#94a3b8;font-size:18px;user-select:none;touch-action:none}
.ge-otext{flex:1;white-space:pre-wrap}
.ge-oarrows{display:flex;gap:4px}
.ge-ar{width:34px;height:34px;border-radius:10px;border:1px solid #e5e7eb;background:#f8fafc;cursor:pointer;font-size:16px}
.ge-ar:disabled{opacity:.4;cursor:default}
.ge-olist.is-disabled .ge-handle{cursor:default}
.ge-solblock{border:1px dashed #86efac;background:#f0fdf4;border-radius:12px;padding:10px 14px;color:#166534}
.ge-soltitle{font-weight:700;margin-bottom:4px}
.ge-solblock ol{margin:0;padding-left:20px}
.ge-wsent{display:flex;align-items:flex-start;gap:8px;padding:10px;border:1px solid #e5e7eb;border-radius:14px;flex-wrap:wrap}
.ge-wsent.ge-ok{border-color:#22c55e;background:#f0fdf4}
.ge-wsent.ge-bad{border-color:#ef4444;background:#fef2f2}
.ge-wsent .ge-sol{flex-basis:100%;white-space:normal}
.ge-winner{flex:1;min-width:0;display:flex;flex-direction:column;gap:8px}
.ge-wline{display:flex;flex-wrap:wrap;gap:8px;min-height:44px;padding:6px;border-bottom:2px solid #c7d2fe}
.ge-wline .ge-chip{background:#eef2ff;font-weight:600}
.ge-wsent .ge-bank{background:transparent;border:0;padding:0;min-height:0}
.ge-q{padding:12px 14px;border:1px solid #eef2f7;border-radius:14px;display:flex;flex-direction:column;gap:6px}
.ge-q.ge-ok{border-color:#86efac}
.ge-q.ge-bad{border-color:#fca5a5}
.ge-qtext{display:flex;gap:6px;align-items:baseline;font-weight:600;white-space:pre-wrap;margin-bottom:2px}
.ge-opt{display:flex;gap:10px;align-items:flex-start;padding:8px 10px;border-radius:10px;cursor:pointer;border:1px solid transparent}
.ge-opt:hover{background:#f8fafc}
.ge-opt input{margin-top:4px;width:18px;height:18px;accent-color:#4f46e5;flex:none}
.ge-opt.is-ok{background:#f0fdf4;border-color:#86efac}
.ge-opt.is-bad{background:#fef2f2;border-color:#fca5a5}
.ge-opt.is-should{border-style:dashed;border-color:#22c55e}
.ge-prompt{white-space:pre-wrap;color:#334155}
.ge-textarea{font:inherit;font-size:16px;width:100%;box-sizing:border-box;padding:12px 14px;border:1.5px solid #e2e8f0;border-radius:14px;resize:vertical;min-height:140px;background:#fff}
.ge-textarea:focus{outline:none;border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.15)}
.ge-textarea[readonly]{background:#f8fafc}
.ge-counter{font-size:13px;color:#64748b}
.ge-counter.is-low{color:#b45309}
.ge-rec{display:flex;flex-wrap:wrap;align-items:center;gap:10px}
.ge-rec>div{width:100%}
.ge-recdot{width:12px;height:12px;border-radius:50%;background:#ef4444;animation:ge-pulse 1s infinite}
.ge-rectime{font-variant-numeric:tabular-nums;font-weight:600}
@keyframes ge-pulse{50%{opacity:.25}}
.ge-row{display:flex;flex-wrap:wrap;gap:8px;width:100%}
.ge-foot{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-top:16px;padding-top:14px;border-top:1px solid #f1f5f9}
.ge-btn{font:inherit;font-size:14px;font-weight:600;border-radius:12px;padding:9px 16px;border:1px solid transparent;cursor:pointer;transition:background .15s,opacity .15s;line-height:1.2}
.ge-btn:disabled{opacity:.55;cursor:default}
.ge-btn-primary{background:#4f46e5;color:#fff}
.ge-btn-primary:hover:not(:disabled){background:#4338ca}
.ge-btn-ghost{background:#fff;color:#334155;border-color:#e2e8f0}
.ge-btn-ghost:hover:not(:disabled){background:#f8fafc}
.ge-btn-danger{background:#dc2626;color:#fff}
.ge-btn-rec{background:#fee2e2;color:#b91c1c}
.ge-btn-rec:hover{background:#fecaca}
.ge-result{font-weight:700;font-size:14px;padding:4px 10px;border-radius:999px}
.ge-result:empty{display:none}
.ge-result.is-ok{background:#dcfce7;color:#166534}
.ge-result.is-part{background:#fef3c7;color:#92400e}
.ge-savestate{font-size:13px;color:#64748b}
.ge-savestate.is-err{color:#dc2626}
.ge-meta{font-size:13px;color:#94a3b8}
.ge-status{font-size:13px;font-weight:600;padding:4px 10px;border-radius:999px}
.ge-status.is-pending{background:#fef3c7;color:#92400e}
.ge-status.is-reviewed{background:#dcfce7;color:#166534}
.ge-feedback{margin-top:14px;padding:12px 14px;border-radius:14px;background:#eef2ff;border:1px solid #c7d2fe}
.ge-fbtitle{font-size:13px;font-weight:700;color:#4338ca;margin-bottom:4px}
.ge-fbtext{white-space:pre-wrap}
.ge-hint{font-size:13px;color:#64748b}
.ge-warn{font-size:14px;color:#9a3412;background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;padding:8px 12px}
#ge-toasts{position:fixed;left:50%;bottom:20px;transform:translateX(-50%);z-index:100000;display:flex;flex-direction:column;gap:8px;align-items:center;pointer-events:none;width:calc(100% - 32px);max-width:420px}
@media (max-width:767px){body.app-has-mnav #ge-toasts{bottom:calc(88px + env(safe-area-inset-bottom))}}
.ge-toast{background:#0f172a;color:#fff;padding:10px 16px;border-radius:12px;font-size:14px;box-shadow:0 10px 30px rgba(0,0,0,.2);transition:opacity .3s;text-align:center}
.ge-toast.is-err{background:#b91c1c}
.ge-toast.is-out{opacity:0}
.ge-modal-back{position:fixed;inset:0;background:rgba(15,23,42,.45);z-index:99990;display:flex;align-items:center;justify-content:center;padding:16px}
.ge-modal{background:#fff;border-radius:20px;padding:22px;width:100%;max-width:440px;box-shadow:0 20px 60px rgba(0,0,0,.25);font-size:15px}
.ge-modal-title{font-weight:700;font-size:18px;margin-bottom:12px;color:#0f172a}
.ge-modal-text{margin:0 0 4px;color:#334155;line-height:1.5;white-space:pre-line}
.ge-modal-btns{display:flex;justify-content:flex-end;gap:8px;margin-top:18px}
.ge-form{display:flex;flex-direction:column;gap:12px}
.ge-field{display:flex;flex-direction:column;gap:4px}
.ge-field-label{font-size:13px;font-weight:600;color:#475569}
.ge-input-block{font:inherit;font-size:16px;padding:9px 12px;border:1.5px solid #e2e8f0;border-radius:12px;width:100%;box-sizing:border-box}
.ge-input-block:focus{outline:none;border-color:#6366f1}
@media (max-width:640px){
  .ge-card{padding:16px;border-radius:16px}
  .ge-mrow{grid-template-columns:1fr;gap:6px}
  .ge-flow{line-height:2.5}
}`;
    function injectCss() {
        if (document.getElementById('ge-core-style')) return;
        const s = document.createElement('style');
        s.id = 'ge-core-style';
        s.textContent = CSS;
        (document.head || document.documentElement).appendChild(s);
    }
    if (typeof document !== 'undefined') injectCss();

})(typeof window !== 'undefined' ? window : globalThis);
