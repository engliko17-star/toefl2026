/* =====================================================================
   grammar-visuals.js — картинки к теории (SVG рисуется в браузере).
   Короткая картинка рядом с правилом помогает тем, кому трудно держать
   внимание на сплошном тексте (в том числе ученикам с СДВГ).

   Подключение: <figure class="gv" data-gv="articles-spotlight"></figure>
   и <script src="grammar-visuals.js"></script> в конце страницы.
   На узком экране (телефон, планшет вертикально в узкой колонке)
   панели встают друг под другом, на широком — в ряд.
   ===================================================================== */
(function () {
    'use strict';

    const C = {
        ink: '#4f46e5', inkBg: '#eef2ff', ok: '#059669', okBg: '#ecfdf5', bad: '#e11d48', badBg: '#fff1f2',
        amber: '#d97706', amberBg: '#fef3c7', sky: '#0284c7', skyBg: '#e0f2fe', slate: '#334155', mute: '#94a3b8',
        line: '#e2e8f0', paper: '#ffffff', soft: '#f8fafc', violet: '#7c3aed', violetBg: '#f3e8ff'
    };
    const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const tw = (s, fs) => String(s).length * fs * (/[А-Яа-яЁё]/.test(s) ? 0.6 : 0.56);

    // ---------- Примитивы ----------
    const T = (x, y, s, o) => {
        o = o || {};
        return `<text x="${x}" y="${y}" font-size="${o.fs || 13}" font-weight="${o.fw || 500}" fill="${o.c || C.slate}" text-anchor="${o.a || 'start'}"${o.cls ? ` class="${o.cls}"` : ''}${o.it ? ' font-style="italic"' : ''}>${esc(s)}</text>`;
    };
    const R = (x, y, w, h, fill, stroke, r, extra) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r === undefined ? 8 : r}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="1.5"` : ''}${extra || ''}/>`;
    // Плашка со словом; возвращает {svg, w}
    function chip(x, y, label, o) {
        o = o || {};
        const fs = o.fs || 13, padX = o.padX || 9, h = o.h || 26;
        const w = Math.max(o.minW || 0, tw(label, fs) + padX * 2);
        const svg = R(x, y, w, h, o.bg || C.soft, o.stroke || C.line, o.r === undefined ? 7 : o.r, o.cls ? ` class="${o.cls}"` : '') +
            T(x + w / 2, y + h / 2 + fs * 0.36, label, { fs, fw: o.fw || 600, c: o.c || C.slate, a: 'middle', cls: o.tcls });
        return { svg, w };
    }
    // Ряд плашек слева направо
    function row(x, y, items, gap) {
        let cx = x, svg = '';
        const pos = [];
        items.forEach(it => {
            const c = chip(cx, y, it.label, it);
            pos.push({ x: cx, w: c.w });
            svg += c.svg;
            cx += c.w + (gap === undefined ? 6 : gap);
        });
        return { svg, w: cx - x, pos };
    }
    const arrow = (x1, y1, x2, y2, col, cls) => {
        const a = Math.atan2(y2 - y1, x2 - x1), l = 8;
        const p1 = [x2 - l * Math.cos(a - 0.45), y2 - l * Math.sin(a - 0.45)], p2 = [x2 - l * Math.cos(a + 0.45), y2 - l * Math.sin(a + 0.45)];
        return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col || C.mute}" stroke-width="2" stroke-linecap="round"${cls ? ` class="${cls}"` : ''}/>` +
            `<path d="M${p1[0].toFixed(1)},${p1[1].toFixed(1)} L${x2},${y2} L${p2[0].toFixed(1)},${p2[1].toFixed(1)}" fill="none" stroke="${col || C.mute}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
    };
    const curve = (x1, y1, x2, y2, bend, col, cls) => {
        const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 + bend;
        const a = Math.atan2(y2 - my, x2 - mx), l = 8;
        const p1 = [x2 - l * Math.cos(a - 0.45), y2 - l * Math.sin(a - 0.45)], p2 = [x2 - l * Math.cos(a + 0.45), y2 - l * Math.sin(a + 0.45)];
        return `<path d="M${x1},${y1} Q${mx},${my} ${x2},${y2}" fill="none" stroke="${col}" stroke-width="2" stroke-linecap="round"${cls ? ` class="${cls}"` : ''}/>` +
            `<path d="M${p1[0].toFixed(1)},${p1[1].toFixed(1)} L${x2},${y2} L${p2[0].toFixed(1)},${p2[1].toFixed(1)}" fill="none" stroke="${col}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
    };
    const tick = (x, y, col) => `<path d="M${x - 6},${y} l4,4 l8,-9" fill="none" stroke="${col || C.ok}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`;
    const cross = (x, y, col) => `<path d="M${x - 5},${y - 5} l10,10 M${x + 5},${y - 5} l-10,10" stroke="${col || C.bad}" stroke-width="2.6" stroke-linecap="round"/>`;
    const badge = (x, y, ok) => `<circle cx="${x}" cy="${y}" r="11" fill="${ok ? C.okBg : C.badBg}" stroke="${ok ? C.ok : C.bad}" stroke-width="1.5"/>` + (ok ? tick(x - 1, y - 1) : cross(x, y));
    const wrapText = (s, maxW, fs) => {
        const words = String(s).split(' '), lines = [];
        let cur = '';
        words.forEach(w => { const t = cur ? cur + ' ' + w : w; if (tw(t, fs) > maxW && cur) { lines.push(cur); cur = w; } else cur = t; });
        if (cur) lines.push(cur);
        return lines;
    };
    const para = (x, y, s, maxW, o) => {
        o = o || {};
        const fs = o.fs || 12.5, lh = o.lh || fs * 1.45;
        const lines = wrapText(s, maxW, fs);
        return { svg: lines.map((l, i) => T(x, y + i * lh, l, Object.assign({}, o, { fs }))).join(''), h: lines.length * lh };
    };

    // Панели: на широком экране в ряд, на узком — столбиком
    function panels(list, W, narrow, opt) {
        opt = opt || {};
        const gap = 14;
        const cols = narrow ? 1 : Math.min(list.length, opt.cols || list.length);
        const pw = (W - gap * (cols - 1)) / cols;
        const drawn = list.map(fn => fn(pw));
        let svg = '', y = 0;
        for (let i = 0; i < drawn.length; i += cols) {
            const rowItems = drawn.slice(i, i + cols);
            const rowH = Math.max.apply(null, rowItems.map(p => p.h));
            rowItems.forEach((p, c) => {
                const x = c * (pw + gap);
                svg += `<g transform="translate(${x.toFixed(1)},${y})">${R(0, 0, pw, rowH, C.paper, C.line, 14)}${p.svg}</g>`;
            });
            y += rowH + gap;
        }
        return { svg, h: y - gap };
    }
    const title = (x, y, s, col) => T(x, y, s, { fs: 13.5, fw: 800, c: col || C.slate });

    // ---------- Иконки ----------
    const book = (x, y, col, o) => {
        o = o || {};
        return `<g transform="translate(${x},${y})"${o.cls ? ` class="${o.cls}"` : ''} opacity="${o.op === undefined ? 1 : o.op}">` +
            `<rect x="0" y="0" width="22" height="30" rx="3" fill="${col}"/><rect x="4" y="0" width="2.5" height="30" fill="rgba(255,255,255,.55)"/>` +
            `<rect x="9" y="7" width="9" height="2.5" rx="1" fill="rgba(255,255,255,.7)"/></g>`;
    };
    const apple = (x, y, n) => `<g transform="translate(${x},${y})"><circle cx="13" cy="15" r="12" fill="#f87171"/><path d="M13,4 q2,-5 6,-5" stroke="#65a30d" stroke-width="2.5" fill="none" stroke-linecap="round"/>` +
        (n ? `<text x="13" y="20" font-size="12" font-weight="800" fill="#fff" text-anchor="middle">${n}</text>` : '') + `</g>`;
    const glass = (x, y) => `<g transform="translate(${x},${y})"><path d="M2,0 L30,0 L26,38 L6,38 Z" fill="#e0f2fe" stroke="#7dd3fc" stroke-width="1.5"/><path d="M4.5,12 L27.5,12 L25.5,36 L6.5,36 Z" fill="#38bdf8" opacity=".75"/></g>`;
    const person = (x, y, col, op) => `<g transform="translate(${x},${y})" opacity="${op === undefined ? 1 : op}"><circle cx="9" cy="6" r="6" fill="${col}"/><path d="M0,26 q9,-16 18,0 Z" fill="${col}"/></g>`;
    const pin = (x, y, col) => `<g transform="translate(${x},${y})"><path d="M0,0 c-9,0 -12,10 -7,16 l7,10 l7,-10 c5,-6 2,-16 -7,-16 Z" fill="${col}"/><circle cx="0" cy="8" r="3.5" fill="#fff"/></g>`;

    // =================================================================
    // Картинки по темам
    // =================================================================
    const V = {};

    // ---- Артикли: a — любая из, the — та самая ----
    V['articles-spotlight'] = (W, narrow) => panels([
        pw => {
            let s = title(16, 26, 'a book — любая из многих') + T(16, 44, 'читатель не знает, какая именно', { fs: 12, c: C.mute });
            const n = 5, step = Math.min(44, (pw - 32) / n), x0 = 16 + (pw - 32 - step * (n - 1) - 22) / 2;
            for (let i = 0; i < n; i++) s += book(x0 + i * step, 66, '#a5b4fc');
            const k = 2, cx = x0 + k * step + 11;
            s += `<circle cx="${cx}" cy="81" r="24" fill="none" stroke="${C.ink}" stroke-width="2" stroke-dasharray="5 5" class="gv-spin"/>`;
            s += T(cx, 128, '? какая-то одна', { fs: 12, fw: 700, c: C.ink, a: 'middle' });
            return { svg: s, h: 146 };
        },
        pw => {
            let s = title(16, 26, 'the book — та самая') + T(16, 44, 'читатель точно знает, о какой речь', { fs: 12, c: C.mute });
            const n = 5, step = Math.min(44, (pw - 32) / n), x0 = 16 + (pw - 32 - step * (n - 1) - 22) / 2;
            const k = 2, cx = x0 + k * step + 11;
            s += `<path d="M${cx - 6},52 L${cx - 30},102 L${cx + 30},102 L${cx + 6},52 Z" fill="#fde68a" opacity=".55" class="gv-glow"/>`;
            for (let i = 0; i < n; i++) s += book(x0 + i * step, 66, i === k ? C.ink : '#cbd5e1', { op: i === k ? 1 : 0.6 });
            s += T(cx, 128, 'вот эта — уже упоминали', { fs: 12, fw: 700, c: C.amber, a: 'middle' });
            return { svg: s, h: 146 };
        }
    ], W, narrow);

    // ---- Артикли: схема выбора ----
    V['articles-flow'] = (W, narrow) => {
        const qBox = (x, y, w, txt) => {
            const p = para(x + 12, y + 20, txt, w - 24, { fs: 12.5, fw: 600 });
            return { svg: R(x, y, w, p.h + 16, C.inkBg, '#c7d2fe', 10) + p.svg, h: p.h + 16 };
        };
        const out = (x, y, label, col, bg, w) => chip(x, y, label, { bg, stroke: col, c: col, fs: 13, fw: 800, h: 28, minW: w || 0 });
        let s = '', y = 6;
        const colW = narrow ? W - 20 : W * 0.56;
        // Шаг 1
        let q = qBox(10, y, colW, '1. Перед словом уже есть my, this, some, every или число?');
        s += q.svg;
        let oc = out(narrow ? 10 : colW + 30, narrow ? y + q.h + 8 : y + q.h / 2 - 14, 'Да → артикль не нужен', C.slate, C.soft);
        s += oc.svg + (narrow ? '' : arrow(colW + 12, y + q.h / 2, colW + 28, y + q.h / 2));
        y += q.h + (narrow ? 44 : 14);
        s += T(24, y + 2, 'Нет ↓', { fs: 12, fw: 700, c: C.mute }); y += 12;
        // Шаг 2
        q = qBox(10, y, colW, '2. Слово исчисляемое и предмет один?');
        s += q.svg; y += q.h + 14;
        // Две ветки
        const bw = narrow ? W - 20 : (W - 34) / 2;
        const b1x = 10, b2x = narrow ? 10 : 24 + bw;
        let yB = y;
        s += T(b1x + 4, yB + 2, 'Да ↓', { fs: 12, fw: 700, c: C.mute });
        let q3 = qBox(b1x, yB + 12, bw, '3. Читатель знает, какой именно?');
        s += q3.svg;
        let yo = yB + 12 + q3.h + 8;
        s += out(b1x, yo, 'Да → THE', C.amber, C.amberBg).svg;
        s += out(b1x + 112, yo, 'Нет → A / AN', C.ink, C.inkBg).svg;
        let leftEnd = yo + 34;
        let yB2 = narrow ? leftEnd + 10 : yB;
        s += T(b2x + 4, yB2 + 2, 'Нет (много или неисчисляемое) ↓', { fs: 12, fw: 700, c: C.mute });
        let q4 = qBox(b2x, yB2 + 12, bw, '3. Речь о чём-то конкретном?');
        s += q4.svg;
        let yo2 = yB2 + 12 + q4.h + 8;
        s += out(b2x, yo2, 'Да → THE', C.amber, C.amberBg).svg;
        s += out(b2x + 112, yo2, 'Нет → без артикля', C.ok, C.okBg).svg;
        return { svg: s, h: Math.max(leftEnd, yo2 + 34) + 4 };
    };

    // ---- A или AN — по звуку ----
    V['a-an-sound'] = (W, narrow) => {
        const mk = (head, col, bg, words) => pw => {
            let s = title(16, 26, head, col), y = 42;
            words.forEach(([w, snd]) => {
                const c1 = chip(16, y, w, { bg: C.soft, fs: 13.5, fw: 700 });
                const c2 = chip(16 + c1.w + 8, y, snd, { bg, stroke: col, c: col, fs: 12.5, fw: 800, r: 13 });
                s += c1.svg + c2.svg;
                y += 34;
            });
            return { svg: s, h: y + 6 };
        };
        return panels([
            mk('an — перед гласным звуком', C.ok, C.okBg, [['an hour', 'звук [aʊ]'], ['an MBA', 'звук [e]'], ['an honest answer', 'звук [ɒ]']]),
            mk('a — перед согласным звуком', C.ink, C.inkBg, [['a university', 'звук [j]'], ['a one-week break', 'звук [w]'], ['a European city', 'звук [j]']])
        ], W, narrow);
    };

    // ---- Косвенный вопрос: глагол уходит после подлежащего ----
    function twoRows(W, narrow, r1, r2, o) {
        o = o || {};
        const fs = narrow ? 12 : 13.5;
        const h = narrow ? 26 : 30;
        let s = T(10, 18, o.l1 || 'Прямой вопрос', { fs: 12, fw: 700, c: C.mute });
        const a = row(10, 26, r1.map(x => Object.assign({ fs, h }, x)), 5);
        s += a.svg;
        s += T(10, 26 + h + 44, 'Косвенный вопрос', { fs: 12, fw: 700, c: C.mute });
        const b = row(10, 26 + h + 52, r2.map(x => Object.assign({ fs, h }, x)), 5);
        s += b.svg;
        if (o.link) {
            const [i1, i2, col] = o.link;
            const x1 = 10 + a.pos[i1].x - 10 + a.pos[i1].w / 2, x2 = 10 + b.pos[i2].x - 10 + b.pos[i2].w / 2;
            s += curve(x1, 26 + h + 2, x2, 26 + h + 50, 6, col || C.amber, 'gv-dash');
        }
        if (o.extra) s += o.extra(a, b, h);
        let hh = 26 + h + 52 + h + 10;
        if (o.l2) { const p = para(10, hh + 8, o.l2, W - 20, { fs: 12.5, fw: 600, c: C.slate }); s += p.svg; hh += p.h + 8; }
        return { svg: s, h: hh };
    }
    V['iq-swap'] = (W, narrow) => twoRows(W, narrow,
        [{ label: 'Where' }, { label: 'is', bg: C.amberBg, stroke: C.amber, c: C.amber }, { label: 'the library', bg: C.skyBg, stroke: C.sky, c: C.sky }, { label: '?' }],
        [{ label: 'Do you know' }, { label: 'where' }, { label: 'the library', bg: C.skyBg, stroke: C.sky, c: C.sky }, { label: 'is', bg: C.amberBg, stroke: C.amber, c: C.amber, cls: 'gv-pop' }, { label: '?' }],
        { link: [1, 3], l2: 'Сначала кто / что (the library), потом глагол (is).' });

    V['iq-did'] = (W, narrow) => twoRows(W, narrow,
        [{ label: 'When' }, { label: 'did', bg: C.badBg, stroke: C.bad, c: C.bad }, { label: 'the lecture', bg: C.skyBg, stroke: C.sky, c: C.sky }, { label: 'start' }, { label: '?' }],
        [{ label: 'Do you know' }, { label: 'when' }, { label: 'the lecture', bg: C.skyBg, stroke: C.sky, c: C.sky }, { label: 'started', bg: C.okBg, stroke: C.ok, c: C.ok, cls: 'gv-pop' }, { label: '?' }],
        { l2: 'Did исчезает, а прошедшее время переходит в глагол: start → started.',
          extra: (a, b, h) => {
              const x = a.pos[1].x + a.pos[1].w / 2;
              return `<line x1="${a.pos[1].x + 4}" y1="${26 + h / 2}" x2="${a.pos[1].x + a.pos[1].w - 4}" y2="${26 + h / 2}" stroke="${C.bad}" stroke-width="2.5"/>` +
                  curve(x, 26 + h + 2, b.pos[3].x + b.pos[3].w - 12, 26 + h + 50, 6, C.ok, 'gv-dash');
          } });

    V['iq-yesno'] = (W, narrow) => twoRows(W, narrow,
        [{ label: 'Is', bg: C.amberBg, stroke: C.amber, c: C.amber }, { label: 'the lab', bg: C.skyBg, stroke: C.sky, c: C.sky }, { label: 'open' }, { label: '?' }],
        [{ label: 'Do you know' }, { label: 'if', bg: C.violetBg, stroke: C.violet, c: C.violet, cls: 'gv-pop' }, { label: 'the lab', bg: C.skyBg, stroke: C.sky, c: C.sky }, { label: 'is', bg: C.amberBg, stroke: C.amber, c: C.amber }, { label: 'open' }, { label: '?' }],
        { link: [0, 3], l2: 'Вопрос «да / нет»: появляется if («ли»), дальше обычный порядок.' });

    V['iq-punct'] = (W, narrow) => panels([
        pw => {
            let s = title(16, 26, 'Начало — вопрос → ?');
            const r = row(16, 44, [{ label: 'Do you know', bg: C.inkBg, stroke: '#c7d2fe', c: C.ink }, { label: 'where it is' }], 5);
            s += r.svg + T(16 + r.w + 2, 64, '?', { fs: 26, fw: 800, c: C.ink, cls: 'gv-pulse' });
            return { svg: s, h: 88 };
        },
        pw => {
            let s = title(16, 26, 'Начало — утверждение → .');
            const r = row(16, 44, [{ label: 'I wonder', bg: C.okBg, stroke: '#a7f3d0', c: C.ok }, { label: 'where it is' }], 5);
            s += r.svg + T(16 + r.w + 2, 64, '.', { fs: 30, fw: 800, c: C.ok, cls: 'gv-pulse' });
            return { svg: s, h: 88 };
        }
    ], W, narrow);

    // ---- Герундий и инфинитив: что стоит перед глаголом ----
    V['gi-signpost'] = (W, narrow) => {
        const sign = (head, trig, res, col, bg) => pw => {
            let s = title(16, 26, head);
            const p = para(16, 48, trig, pw - 32, { fs: 12.5, c: C.slate });
            s += p.svg;
            const y = 48 + p.h + 4;
            s += arrow(16, y + 13, 44, y + 13, col);
            s += chip(50, y, res, { bg, stroke: col, c: col, fs: 14, fw: 800, h: 28 }).svg;
            return { svg: s, h: y + 40 };
        };
        return panels([
            sign('Предлог', 'for, about, of, in, without, after… и to в look forward to', '-ing', C.ok, C.okBg),
            sign('Модальный, do / did, make, let', 'can, should, might, will, did, make us, let me', 'без to', C.sky, C.skyBg),
            sign('Обычный глагол', 'у каждого своя схема: avoid → -ing, decide → to, allow → кого + to', 'смотрим схему', C.violet, C.violetBg),
            sign('Смысл «чтобы»', 'I\'m writing… чтобы спросить', 'to', C.amber, C.amberBg)
        ], W, narrow, { cols: 2 });
    };

    // ---- Где форма меняет смысл: линия времени ----
    V['gi-timeline'] = (W, narrow) => {
        const tl = (head, lines) => pw => {
            let s = title(16, 26, head), y = 40;
            lines.forEach(L => {
                s += T(16, y + 12, L.ex, { fs: 13, fw: 700, c: L.col });
                const ly = y + 40, x0 = 20, x1 = pw - 20, mid = (x0 + x1) / 2;
                s += `<line x1="${x0}" y1="${ly}" x2="${x1}" y2="${ly}" stroke="${C.line}" stroke-width="3" stroke-linecap="round"/>`;
                s += `<line x1="${mid}" y1="${ly - 10}" x2="${mid}" y2="${ly + 10}" stroke="${C.slate}" stroke-width="2"/>` + T(mid, ly + 24, 'сейчас', { fs: 11, fw: 700, c: C.slate, a: 'middle' });
                const dx = L.dir < 0 ? mid - (mid - x0) * 0.7 : mid + (x1 - mid) * 0.7;
                s += `<circle cx="${dx}" cy="${ly}" r="7" fill="${L.col}" class="gv-pulse"/>`;
                s += curve(mid, ly - 4, dx + (L.dir < 0 ? 8 : -8), ly - 6, -22, L.col, 'gv-dash');
                s += T(dx, ly + 24, L.note, { fs: 11, fw: 600, c: L.col, a: 'middle' });
                y += 78;
            });
            return { svg: s, h: y + 4 };
        };
        return panels([
            tl('remember / forget', [
                { ex: 'I remember locking the door.', note: 'уже сделал', col: C.ok, dir: -1 },
                { ex: 'Remember to lock the door.', note: 'ещё нужно сделать', col: C.ink, dir: 1 }
            ]),
            tl('stop', [
                { ex: 'He stopped drinking coffee.', note: 'больше не пьёт', col: C.bad, dir: -1 },
                { ex: 'He stopped to drink coffee.', note: 'чтобы выпить', col: C.amber, dir: 1 }
            ])
        ], W, narrow);
    };

    // ---- Исчисляемые и неисчисляемые ----
    V['cu-count'] = (W, narrow) => panels([
        pw => {
            let s = title(16, 26, 'Можно посчитать', C.ok) + T(16, 44, 'an apple → three apples', { fs: 12.5, fw: 600, c: C.slate });
            for (let i = 0; i < 3; i++) s += apple(16 + i * 34, 56, i + 1);
            const r = row(16, 100, [{ label: 'many', fs: 12 }, { label: 'few', fs: 12 }, { label: 'a few', fs: 12 }, { label: 'fewer', fs: 12 }, { label: 'a / an', fs: 12 }], 5);
            return { svg: s + r.svg, h: 140 };
        },
        pw => {
            let s = title(16, 26, 'Нельзя посчитать', C.sky) + T(16, 44, 'water, advice, information — без a и без -s', { fs: 12.5, fw: 600, c: C.slate });
            s += glass(16, 56) + T(56, 80, '= a glass of water', { fs: 12, fw: 700, c: C.sky });
            const r = row(16, 100, [{ label: 'much', fs: 12 }, { label: 'little', fs: 12 }, { label: 'a little', fs: 12 }, { label: 'less', fs: 12 }], 5);
            return { svg: s + r.svg, h: 140 };
        }
    ], W, narrow);

    // ---- Предлоги времени: от большого к точке ----
    V['prep-time'] = (W, narrow) => {
        const tw0 = narrow ? 128 : 190, x0 = 10, top = 10, H = narrow ? 270 : 210;
        const bands = [
            { p: 'IN', ex: 'годы, месяцы, сезоны, часть дня', e2: 'in 2026 · in May · in the morning', col: C.ink, bg: C.inkBg },
            { p: 'ON', ex: 'дни и даты', e2: 'on Monday · on May 5 · on my birthday', col: C.amber, bg: C.amberBg },
            { p: 'AT', ex: 'точное время и «точки»', e2: 'at 3 p.m. · at night · at the weekend', col: C.ok, bg: C.okBg }
        ];
        let s = '';
        const bh = H / 3;
        bands.forEach((b, i) => {
            const yA = top + i * bh, yB = yA + bh;
            const wA = tw0 * (1 - i / 3), wB = tw0 * (1 - (i + 1) / 3);
            const cx = x0 + tw0 / 2;
            s += `<path d="M${cx - wA / 2},${yA} L${cx + wA / 2},${yA} L${cx + wB / 2},${yB} L${cx - wB / 2},${yB} Z" fill="${b.bg}" stroke="${b.col}" stroke-width="1.5"/>`;
            s += T(cx, yA + bh * (i === 2 ? 0.42 : 0.5) + 6, b.p, { fs: narrow ? 14 : 18, fw: 800, c: b.col, a: 'middle' });
            // Подпись и примеры переносятся по ширине и центрируются в своей полосе
            const tx = x0 + tw0 + 14, maxW = W - tx - 8;
            const o1 = { fs: 12.5, fw: 700, c: C.slate }, o2 = { fs: 12, c: b.col, fw: 600 };
            const h1 = para(tx, 0, b.ex, maxW, o1).h, h2 = para(tx, 0, b.e2, maxW, o2).h;
            const y1 = yA + (bh - (h1 + 4 + h2)) / 2 + 12;
            s += para(tx, y1, b.ex, maxW, o1).svg + para(tx, y1 + h1 + 4, b.e2, maxW, o2).svg;
        });
        return { svg: s, h: top + H + 10 };
    };

    // ---- Предлоги места: внутри, на поверхности, в точке ----
    V['prep-place'] = (W, narrow) => {
        const pnl = (head, col, icon, txt) => pw => {
            let sv = title(16, 26, head, col) + icon;
            const p = para(16, 108, txt, pw - 32, { fs: 12, fw: 600 });
            return { svg: sv + p.svg, h: 108 + p.h + 6 };
        };
        return panels([
            pnl('IN — внутри', C.ink, R(16, 40, 70, 48, C.inkBg, C.ink, 6) + `<circle cx="51" cy="64" r="7" fill="${C.ink}" class="gv-pulse"/>`,
                'in the room · in Boston · in a car · in the library'),
            pnl('ON — на поверхности', C.amber, `<line x1="16" y1="80" x2="86" y2="80" stroke="${C.amber}" stroke-width="4" stroke-linecap="round"/><circle cx="51" cy="71" r="7" fill="${C.amber}" class="gv-pulse"/>`,
                'on the wall · on the bus · on campus · on the second floor'),
            pnl('AT — в точке', C.ok, `<line x1="16" y1="80" x2="86" y2="80" stroke="${C.line}" stroke-width="3" stroke-dasharray="4 5"/>` + pin(51, 46, C.ok),
                'at the bus stop · at home · at work · at the front desk')
        ], W, narrow);
    };

    // ---- for / until / by / before ----
    V['prep-deadline'] = (W, narrow) => {
        const lw = narrow ? 120 : 190, x0 = lw + 14, x1 = W - 16, fri = x0 + (x1 - x0) * 0.72;
        let s = `<line x1="${fri}" y1="18" x2="${fri}" y2="214" stroke="${C.slate}" stroke-width="2" stroke-dasharray="4 4"/>` + T(fri, 14, 'Friday', { fs: 12, fw: 800, c: C.slate, a: 'middle' });
        const rowY = [40, 90, 140, 190];
        const lab = [['for three days', 'сколько длится'], ['until Friday', 'длится до пятницы'], ['by Friday', 'не позже пятницы'], ['before Friday', 'раньше пятницы']];
        lab.forEach((l, i) => {
            s += T(10, rowY[i] + 4, l[0], { fs: 13, fw: 800, c: C.ink }) + T(10, rowY[i] + 20, l[1], { fs: 11.5, c: C.mute });
            s += `<line x1="${x0}" y1="${rowY[i] + 8}" x2="${x1}" y2="${rowY[i] + 8}" stroke="${C.line}" stroke-width="3" stroke-linecap="round"/>`;
        });
        s += R(x0 + 20, rowY[0], (x1 - x0) * 0.35, 16, C.inkBg, C.ink, 8) + T(x0 + 20 + (x1 - x0) * 0.175, rowY[0] + 12, '3 дня', { fs: 11, fw: 700, c: C.ink, a: 'middle' });
        s += R(x0 + 4, rowY[1], fri - x0 - 4, 16, C.amberBg, C.amber, 8, ' class="gv-grow"');
        s += `<rect x="${x0 + 4}" y="${rowY[2] + 2}" width="${fri - x0 - 4}" height="12" rx="6" fill="${C.okBg}" stroke="${C.ok}" stroke-dasharray="4 3"/>` + `<circle cx="${x0 + (fri - x0) * 0.6}" cy="${rowY[2] + 8}" r="7" fill="${C.ok}" class="gv-pulse"/>` + T(fri + 6, rowY[2] + 12, 'дедлайн', { fs: 11, fw: 700, c: C.ok });
        s += `<circle cx="${fri - 30}" cy="${rowY[3] + 8}" r="7" fill="${C.violet}"/>` + arrow(fri - 22, rowY[3] + 8, fri - 4, rowY[3] + 8, C.violet);
        return { svg: s, h: 222 };
    };

    // ---- Зависимые предлоги: слово и его «пара» ----
    V['dp-puzzle'] = (W, narrow) => {
        const pairs = [['interested', 'in', 1], ['good', 'at', 1], ['depend', 'on', 1], ['responsible', 'for', 1], ['depend', 'from', 0], ['interested', 'about', 0]];
        const cols = narrow ? 1 : 2, cw = (W - 20) / cols;
        let s = '';
        pairs.forEach((p, i) => {
            const c = i % cols, r = Math.floor(i / cols);
            const x = 10 + c * cw, y = 8 + r * 44;
            const ok = p[2] === 1;
            const a = chip(x, y, p[0], { bg: C.inkBg, stroke: '#c7d2fe', c: C.ink, fs: 13.5, fw: 700, h: 30, r: 8 });
            const gap = ok ? 0 : 14;
            const b = chip(x + a.w + gap, y, p[1], { bg: ok ? C.okBg : C.badBg, stroke: ok ? C.ok : C.bad, c: ok ? C.ok : C.bad, fs: 13.5, fw: 800, h: 30, r: 8, cls: ok ? 'gv-pop' : '' });
            s += a.svg + b.svg;
            if (ok) s += `<circle cx="${x + a.w}" cy="${y + 15}" r="5" fill="${C.okBg}" stroke="${C.ok}" stroke-width="1.5"/>`;
            s += badge(x + a.w + gap + b.w + 18, y + 15, ok);
        });
        return { svg: s, h: 8 + Math.ceil(pairs.length / cols) * 44 };
    };

    // ---- Управление глагола: кто и что после глагола ----
    V['vg-pattern'] = (W, narrow) => {
        const P = { bg: C.amberBg, stroke: C.amber, c: C.amber }, TH = { bg: C.skyBg, stroke: C.sky, c: C.sky }, V0 = { bg: C.inkBg, stroke: '#c7d2fe', c: C.ink };
        const fs = narrow ? 12 : 13;
        const lines = [
            ['A. Человек только через to', [Object.assign({ label: 'explain' }, V0), Object.assign({ label: 'the rule' }, TH), { label: 'to' }, Object.assign({ label: 'me' }, P)], 1],
            ['B. Человек сразу, тема через предлог', [Object.assign({ label: 'inform' }, V0), Object.assign({ label: 'you' }, P), { label: 'about' }, Object.assign({ label: 'the change' }, TH)], 1],
            ['C. Можно два дополнения подряд', [Object.assign({ label: 'give' }, V0), Object.assign({ label: 'me' }, P), Object.assign({ label: 'the report' }, TH)], 1],
            ['Так нельзя', [Object.assign({ label: 'explain' }, V0), Object.assign({ label: 'me' }, P), Object.assign({ label: 'the rule' }, TH)], 0]
        ];
        let s = '', y = 6;
        lines.forEach(L => {
            s += T(10, y + 12, L[0], { fs: 12, fw: 700, c: L[2] ? C.mute : C.bad });
            const r = row(10, y + 20, L[1].map(x => Object.assign({ fs, h: 28 }, x)), 5);
            s += r.svg + badge(10 + r.w + 14, y + 34, !!L[2]);
            y += 62;
        });
        s += T(10, y + 8, '■ человек   ', { fs: 12, fw: 700, c: C.amber }) + T(100, y + 8, '■ что именно', { fs: 12, fw: 700, c: C.sky });
        return { svg: s, h: y + 18 };
    };

    // ---- Suggest / allow: какие дороги открыты ----
    V['vp-roads'] = (W, narrow) => panels([
        pw => {
            let s = title(16, 26, 'suggest / recommend', C.ink), y = 40;
            [['+ -ing', 'suggest meeting earlier', 1], ['+ that + кто + глагол', 'suggest that we meet earlier', 1], ['+ кого + to', 'suggest you to meet', 0]].forEach(r => {
                s += badge(28, y + 14, !!r[2]) + T(48, y + 10, r[0], { fs: 12.5, fw: 800, c: r[2] ? C.ok : C.bad }) + T(48, y + 26, r[1], { fs: 12, c: C.slate, it: true });
                y += 40;
            });
            return { svg: s, h: y + 6 };
        },
        pw => {
            let s = title(16, 26, 'allow / advise / permit', C.ink), y = 40;
            [['+ кого + to', 'allow students to use phones', 1], ['+ -ing (без «кого»)', 'allow parking near the lab', 1], ['+ to без «кого»', 'allow to use phones', 0]].forEach(r => {
                s += badge(28, y + 14, !!r[2]) + T(48, y + 10, r[0], { fs: 12.5, fw: 800, c: r[2] ? C.ok : C.bad }) + T(48, y + 26, r[1], { fs: 12, c: C.slate, it: true });
                y += 40;
            });
            return { svg: s, h: y + 6 };
        }
    ], W, narrow);

    // ---- Comma splice: чем сцепить два предложения ----
    V['pu-splice'] = (W, narrow) => {
        const fs = narrow ? 12 : 13;
        const opts = [[',', 'запятая одна не держит', 0], ['.', 'два предложения', 1], [';', 'близкие по смыслу', 1], [', so', 'запятая + союз', 1]];
        let s = '', y = 6;
        opts.forEach(o => {
            const a = chip(10, y, 'I missed the lecture', { fs, h: 28, bg: C.skyBg, stroke: C.sky, c: C.sky });
            const j = chip(10 + a.w + 4, y, o[0], { fs: fs + 2, h: 28, fw: 800, bg: o[2] ? C.okBg : C.badBg, stroke: o[2] ? C.ok : C.bad, c: o[2] ? C.ok : C.bad, minW: 26, cls: o[2] ? '' : 'gv-shake' });
            const b = chip(10 + a.w + 4 + j.w + 4, y, 'I was sick', { fs, h: 28, bg: C.skyBg, stroke: C.sky, c: C.sky });
            s += a.svg + j.svg + b.svg;
            const endX = 10 + a.w + 4 + j.w + 4 + b.w;
            if (narrow) { s += badge(endX + 16, y + 14, !!o[2]); s += T(10, y + 44, o[1], { fs: 11.5, fw: 600, c: o[2] ? C.ok : C.bad }); y += 58; }
            else { s += badge(endX + 18, y + 14, !!o[2]) + T(endX + 36, y + 19, o[1], { fs: 12, fw: 600, c: o[2] ? C.ok : C.bad }); y += 40; }
        });
        return { svg: s, h: y + 4 };
    };

    // ---- Запятые с who / which: один брат или несколько ----
    V['pu-which'] = (W, narrow) => panels([
        pw => {
            let s = title(16, 26, 'С запятыми — брат один');
            s += para(16, 46, 'My brother, who lives in Boston, is a doctor.', pw - 32, { fs: 12.5, fw: 600, it: true }).svg;
            s += person(16, 72, C.ink) + T(46, 92, 'who lives in Boston — просто доп. факт', { fs: 11.5, c: C.mute });
            return { svg: s, h: 112 };
        },
        pw => {
            let s = title(16, 26, 'Без запятых — братьев несколько');
            s += para(16, 46, 'My brother who lives in Boston is a doctor.', pw - 32, { fs: 12.5, fw: 600, it: true }).svg;
            s += person(16, 72, '#cbd5e1') + person(40, 72, C.ink) + person(64, 72, '#cbd5e1') + T(94, 92, 'тот, что в Бостоне', { fs: 11.5, c: C.mute });
            return { svg: s, h: 112 };
        }
    ], W, narrow);

    // =================================================================
    // ---- Present Perfect / Past Simple: две линии времени ----
    V['pp-timeline'] = (W, narrow) => {
        const line = (pw, ly, noPast) => {
            const x0 = 18, x1 = pw - 18, now = x1 - 34;
            return {
                x0, x1, now,
                svg: `<line x1="${x0}" y1="${ly}" x2="${x1}" y2="${ly}" stroke="${C.line}" stroke-width="3" stroke-linecap="round"/>` +
                    `<line x1="${now}" y1="${ly - 12}" x2="${now}" y2="${ly + 12}" stroke="${C.slate}" stroke-width="2.2"/>` +
                    T(now, ly + 27, 'сейчас', { fs: 11, fw: 700, c: C.slate, a: 'middle' }) +
                    (noPast ? '' : T(x0, ly + 27, 'прошлое', { fs: 11, fw: 600, c: C.mute }))
            };
        };
        return panels([
            pw => {
                let s = title(16, 26, 'Past Simple — закрытое прошлое', C.amber);
                const ex = para(16, 48, 'I lost my keys yesterday.', pw - 32, { fs: 13, fw: 700, c: C.slate });
                s += ex.svg;
                const ly = 48 + ex.h + 44, L = line(pw, ly);
                s += L.svg;
                const bx = L.x0 + (L.now - L.x0) * 0.22, bw = Math.min(110, (L.now - L.x0) * 0.42);
                s += R(bx, ly - 15, bw, 30, C.amberBg, C.amber, 8) + T(bx + bw / 2, ly + 4.5, 'yesterday', { fs: 12, fw: 800, c: C.amber, a: 'middle' });
                s += `<line x1="${bx + bw + 10}" y1="${ly - 18}" x2="${bx + bw + 10}" y2="${ly + 18}" stroke="${C.amber}" stroke-width="2" stroke-dasharray="4 4"/>`;
                const n = para(16, ly + 52, 'Есть «когда». Действие закончено, к «сейчас» не тянется.', pw - 32, { fs: 12, c: C.mute, fw: 600 });
                return { svg: s + n.svg, h: ly + 52 + n.h + 6 };
            },
            pw => {
                let s = title(16, 26, 'Present Perfect — прошлое + сейчас', C.ink);
                const ex = para(16, 48, 'I have lost my keys.', pw - 32, { fs: 13, fw: 700, c: C.slate });
                s += ex.svg;
                const ly = 48 + ex.h + 44, L = line(pw, ly, true);
                s += L.svg;
                const dx = L.x0 + (L.now - L.x0) * 0.3;
                s += `<circle cx="${dx}" cy="${ly}" r="8" fill="${C.ink}" class="gv-pulse"/>` + T(Math.max(dx, L.x0 + 46), ly + 27, 'когда? неважно', { fs: 11, fw: 700, c: C.mute, a: 'middle' });
                s += curve(dx + 6, ly - 6, L.now - 4, ly - 8, -30, C.ink, 'gv-dash');
                const n = para(16, ly + 52, 'Важен результат сейчас: ключей нет до сих пор.', pw - 32, { fs: 12, c: C.mute, fw: 600 });
                return { svg: s + n.svg, h: ly + 52 + n.h + 6 };
            }
        ], W, narrow);
    };

    // ---- Период ещё идёт или уже закончился ----
    V['pp-period'] = (W, narrow) => {
        const rows = [
            { per: 'this week', ex: 'I have had three exams this week.', col: C.ink, bg: C.inkBg, from: 0.55, to: 1.0, note: 'неделя ещё идёт → Present Perfect' },
            { per: 'last week', ex: 'I had three exams last week.', col: C.amber, bg: C.amberBg, from: 0.18, to: 0.48, note: 'неделя закончилась → Past Simple' }
        ];
        const x0 = 14, x1 = W - 14, now = x0 + (x1 - x0) * 0.8;
        let s = '', y = 8;
        rows.forEach(r => {
            const p = para(x0, y + 14, r.ex, x1 - x0, { fs: 13, fw: 700, c: C.slate });
            s += p.svg; y += p.h + 10;
            const ly = y + 18;
            s += `<line x1="${x0}" y1="${ly}" x2="${x1}" y2="${ly}" stroke="${C.line}" stroke-width="3" stroke-linecap="round"/>`;
            const bx = x0 + (now - x0) * r.from, bxe = r.to >= 1 ? now + 22 : x0 + (now - x0) * r.to;
            s += R(bx, ly - 14, bxe - bx, 28, r.bg, r.col, 8, r.to >= 1 ? ' class="gv-glow"' : '');
            s += T(bx + 10, ly + 4.5, r.per, { fs: 12, fw: 800, c: r.col });
            s += `<line x1="${now}" y1="${ly - 18}" x2="${now}" y2="${ly + 18}" stroke="${C.slate}" stroke-width="2.2"/>`;
            s += T(now, ly + 32, 'сейчас', { fs: 11, fw: 700, c: C.slate, a: 'middle' });
            const n = para(x0, ly + 34 + (narrow ? 16 : 0), r.note, narrow ? x1 - x0 : now - x0 - 40, { fs: 12, fw: 700, c: r.col });
            s += n.svg;
            y = ly + 34 + (narrow ? 16 : 0) + n.h + 14;
        });
        return { svg: s, h: y - 4 };
    };

    // ---- since и for ведут к «сейчас» ----
    V['pp-since'] = (W, narrow) => {
        const x0 = 16, x1 = W - 16, now = x1 - 40;
        let s = '', y = 8;
        const p = para(x0, y + 14, 'The Wi-Fi hasn’t worked since Monday.', x1 - x0, { fs: 13, fw: 700, c: C.slate });
        s += p.svg; y += p.h;
        const p2 = para(x0, y + 14, 'The Wi-Fi hasn’t worked for three days.', x1 - x0, { fs: 13, fw: 700, c: C.slate });
        s += p2.svg; y += p2.h + 26;
        const ly = y + 52, start = x0 + (now - x0) * 0.25;
        s += `<line x1="${x0}" y1="${ly}" x2="${x1}" y2="${ly}" stroke="${C.line}" stroke-width="3" stroke-linecap="round"/>`;
        s += `<rect x="${start}" y="${ly - 5}" width="${now - start}" height="10" rx="5" fill="${C.ink}" opacity=".22" class="gv-grow"/>`;
        s += `<circle cx="${start}" cy="${ly}" r="7" fill="${C.sky}"/>` + T(start, ly - 16, 'since Monday', { fs: 12, fw: 800, c: C.sky, a: 'middle' }) + T(start, ly + 26, 'точка начала', { fs: 11, fw: 600, c: C.mute, a: 'middle' });
        const bm = (start + now) / 2;
        s += `<path d="M${start},${ly - 34} q0,-8 8,-8 L${now - 8},${ly - 42} q8,0 8,8" fill="none" stroke="${C.violet}" stroke-width="2"/>`;
        s += T(bm, ly - 50, 'for three days', { fs: 12, fw: 800, c: C.violet, a: 'middle' });
        s += `<line x1="${now}" y1="${ly - 14}" x2="${now}" y2="${ly + 14}" stroke="${C.slate}" stroke-width="2.2"/>` + T(now, ly + 30, 'сейчас', { fs: 11, fw: 700, c: C.slate, a: 'middle' });
        y = ly + 48;
        const bad = chip(x0, y, 'isn’t working since Monday', { bg: C.badBg, stroke: '#fecdd3', c: C.bad, fs: 12.5 });
        s += bad.svg + badge(x0 + bad.w + 16, y + 13, false);
        const n = para(x0, y + 46, 'Длится до сих пор → have / has + третья форма, а не Present Simple.', x1 - x0, { fs: 12, fw: 600, c: C.mute });
        return { svg: s + n.svg, h: y + 46 + n.h + 4 };
    };

    // ---- Где стоят already, just, never, yet, still ----
    V['pp-yet'] = (W, narrow) => {
        const hi = (label, col, bg) => ({ label, bg, stroke: col, c: col, fw: 800, fs: 12.5 });
        const pl = label => ({ label, fs: 12.5 });
        const block = (head, lines) => pw => {
            let s = title(16, 26, head), y = 42;
            lines.forEach(L => {
                const r = row(16, y, L, 5);
                s += r.svg; y += 36;
            });
            return { svg: s, h: y + 4 };
        };
        return panels([
            block('Между have и третьей формой', [
                [pl('I'), pl('have'), hi('already', C.ink, C.inkBg), pl('sent'), pl('it.')],
                [pl('She'), pl('has'), hi('just', C.ink, C.inkBg), pl('left.')],
                [pl('I'), pl('have'), hi('never', C.ink, C.inkBg), pl('been'), pl('there.')],
                [pl('Have'), pl('you'), hi('ever', C.ink, C.inkBg), pl('tried'), pl('it?')]
            ]),
            block('yet — в конце, still — перед haven’t', [
                [pl('I'), pl('haven’t'), pl('finished'), pl('it'), hi('yet.', C.ok, C.okBg)],
                [pl('Have'), pl('you'), pl('applied'), hi('yet?', C.ok, C.okBg)],
                [pl('I'), hi('still', C.amber, C.amberBg), pl('haven’t'), pl('received'), pl('it.')],
                [pl('He'), hi('still', C.amber, C.amberBg), pl('hasn’t'), pl('called.')]
            ])
        ], W, narrow);
    };

    // ---- Как выбрать: два вопроса ----
    V['pp-choose'] = (W, narrow) => {
        const box = (x, y, w, txt) => {
            const p = para(x + 12, y + 20, txt, w - 24, { fs: 12.5, fw: 600 });
            return { svg: R(x, y, w, p.h + 16, C.inkBg, '#c7d2fe', 10) + p.svg, h: p.h + 16 };
        };
        const out = (x, y, label, col, bg) => chip(x, y, label, { bg, stroke: col, c: col, fs: 13, fw: 800, h: 28 });
        const colW = narrow ? W - 20 : W * 0.58;
        let s = '', y = 6;
        let q = box(10, y, colW, '1. Есть конкретное время в прошлом: yesterday, last week, ago, in 2020, when I was…?');
        s += q.svg;
        if (narrow) { s += out(10, y + q.h + 8, 'Да → Past Simple', C.amber, C.amberBg).svg; y += q.h + 58; }
        else { s += arrow(colW + 14, y + q.h / 2, colW + 30, y + q.h / 2) + out(colW + 34, y + q.h / 2 - 14, 'Да → Past Simple', C.amber, C.amberBg).svg; y += q.h + 14; }
        s += T(24, y + 2, 'Нет ↓', { fs: 12, fw: 700, c: C.mute }); y += 12;
        q = box(10, y, colW, '2. Важно, что есть сейчас, или период ещё идёт: today, this week, so far, since, for?');
        s += q.svg;
        if (narrow) { s += out(10, y + q.h + 8, 'Да → Present Perfect', C.ink, C.inkBg).svg; y += q.h + 44; }
        else { s += arrow(colW + 14, y + q.h / 2, colW + 30, y + q.h / 2) + out(colW + 34, y + q.h / 2 - 14, 'Да → Present Perfect', C.ink, C.inkBg).svg; y += q.h + 10; }
        const n = para(10, y + 12, 'Рассказываете историю по шагам (сначала, потом) — Past Simple.', W - 20, { fs: 12, fw: 600, c: C.mute });
        return { svg: s + n.svg, h: y + 12 + n.h };
    };

    // ---- Относительные придаточные ----
    // Плашки с переносом по ширине; у плашки может быть подпись снизу (sub)
    function flow(x, y, items, maxW, o) {
        o = o || {};
        const gap = o.gap || 6, hasSub = items.some(it => it.sub), lineH = 26 + (hasSub ? 22 : 0) + (o.lineGap || 10);
        let cx = x, cy = y, svg = '';
        const pos = [];
        items.forEach(it => {
            // Ширина места = max(плашка, подпись), чтобы подписи соседей не налезали друг на друга
            const w = chip(0, 0, it.label, it).w, slot = Math.max(w, it.sub ? tw(it.sub, 10.5) + 6 : 0);
            if (cx > x && cx + slot > x + maxW) { cx = x; cy += lineH; }
            const chx = cx + (slot - w) / 2;
            svg += chip(chx, cy, it.label, it).svg;
            if (it.sub) svg += T(cx + slot / 2, cy + 26 + 15, it.sub, { fs: 10.5, fw: 700, c: it.subC || it.c || C.mute, a: 'middle' });
            pos.push({ x: chx, y: cy, w });
            cx += slot + gap;
        });
        return { svg, h: cy - y + 26 + (hasSub ? 22 : 0), pos };
    }
    const RC = {
        noun: label => ({ label, bg: C.inkBg, stroke: '#c7d2fe', c: C.ink, fw: 800 }),
        cl: label => ({ label, bg: C.violetBg, stroke: '#ddd6fe', c: C.violet, fw: 700 }),
        verb: label => ({ label, bg: C.amberBg, stroke: '#fcd34d', c: C.amber, fw: 800 }),
        plain: label => ({ label }),
        bad: label => ({ label, bg: C.badBg, stroke: '#fecdd3', c: C.bad, fw: 700 })
    };

    V['rc-attach'] = (W, narrow) => panels([
        pw => {
            let s = title(16, 26, 'Придаточное — сразу за своим словом', C.ok);
            const f = flow(16, 58, [RC.noun('The park'), RC.cl('that has the best trails'), RC.plain('is my favorite.')], pw - 32);
            s += f.svg;
            const a = f.pos[0], b = f.pos[1];
            if (a.y === b.y) s += curve(b.x + 14, b.y - 2, a.x + a.w / 2, a.y - 2, -18, C.violet, 'gv-dash');
            else s += curve(b.x + 14, b.y - 2, a.x + a.w / 2, a.y + 28, -10, C.violet, 'gv-dash');
            const y = 58 + f.h + 26;
            const n = para(16, y, 'that has the best trails описывает park и стоит прямо за ним.', pw - 50, { fs: 12, fw: 600, c: C.mute });
            return { svg: s + n.svg + badge(pw - 24, 22, true), h: y + n.h + 4 };
        },
        pw => {
            let s = title(16, 26, 'Оторвали от слова — смысл ломается', C.bad);
            const f = flow(16, 58, [RC.noun('The park'), RC.plain('has'), RC.plain('the best trails'), RC.bad('that is my favorite.')], pw - 32);
            s += f.svg;
            const y = 58 + f.h + 26;
            const n = para(16, y, 'Теперь that цепляется к trails: «тропы, которые мой любимый».', pw - 50, { fs: 12, fw: 600, c: C.mute });
            return { svg: s + n.svg + badge(pw - 24, 22, false), h: y + n.h + 4 };
        }
    ], W, narrow);

    V['rc-subject'] = (W, narrow) => {
        const ex = [
            [Object.assign(RC.noun('The book'), { sub: 'о чём речь' }), Object.assign(RC.cl('that I borrowed from the library'), { sub: 'какая именно' }), Object.assign(RC.verb('is'), { sub: 'главный глагол' }), RC.plain('very interesting.')],
            [Object.assign(RC.noun('The workshop'), { sub: 'о чём речь' }), Object.assign(RC.cl('that was supposed to take place'), { sub: 'какой именно' }), Object.assign(RC.verb('was canceled.'), { sub: 'главный глагол' })]
        ];
        let s = '', y = 6;
        ex.forEach((items, i) => {
            const f = flow(10, y, items, W - 20, { lineGap: 8 });
            s += f.svg;
            y += f.h + 18;
            if (i === 0) { s += `<line x1="10" y1="${y - 8}" x2="${W - 10}" y2="${y - 8}" stroke="${C.line}" stroke-dasharray="4 4"/>`; y += 10; }
        });
        const n = para(10, y + 6, 'Всё до главного глагола — одно длинное подлежащее. Глагол придаточного (borrowed) не главный.', W - 20, { fs: 12, fw: 600, c: C.mute });
        return { svg: s + n.svg, h: y + 6 + n.h };
    };

    V['rc-drop'] = (W, narrow) => panels([
        pw => {
            let s = title(16, 26, 'That можно убрать', C.ok);
            const f = flow(16, 46, [RC.noun('the book'), { label: 'that', bg: C.soft, stroke: C.mute, c: C.mute, fw: 600, sub: 'можно убрать', subC: C.mute }, Object.assign({ label: 'I', bg: C.okBg, stroke: '#a7f3d0', c: C.ok, fw: 800 }, { sub: 'новое подлежащее', subC: C.ok }), RC.plain('need')], pw - 32);
            s += f.svg;
            const p = f.pos[1];
            s += `<line x1="${p.x + 4}" y1="${p.y + 13}" x2="${p.x + p.w - 4}" y2="${p.y + 13}" stroke="${C.mute}" stroke-width="2"/>`;
            const n = para(16, 46 + f.h + 22, 'После that стоит новое подлежащее (I, you, my professor).', pw - 32, { fs: 12, fw: 600, c: C.mute });
            return { svg: s + n.svg, h: 46 + f.h + 22 + n.h };
        },
        pw => {
            let s = title(16, 26, 'That убрать нельзя', C.bad);
            const f = flow(16, 46, [RC.noun('a gym'), Object.assign({ label: 'that', bg: C.inkBg, stroke: C.ink, c: C.ink, fw: 800 }, { sub: 'нужно', subC: C.ink }), Object.assign(RC.verb('offers'), { sub: 'сразу глагол' }), RC.plain('yoga classes')], pw - 32);
            s += f.svg;
            const n = para(16, 46 + f.h + 22, 'После that сразу глагол: that здесь подлежащее, без него нельзя.', pw - 32, { fs: 12, fw: 600, c: C.mute });
            return { svg: s + n.svg, h: 46 + f.h + 22 + n.h };
        }
    ], W, narrow);

    V['rc-where'] = (W, narrow) => panels([
        pw => {
            let s = title(16, 26, 'where = «в котором»', C.sky);
            const f = flow(16, 46, [RC.noun('the drawer'), { label: 'where', bg: C.skyBg, stroke: '#7dd3fc', c: C.sky, fw: 800 }, RC.plain('I'), RC.verb('keep'), Object.assign({ label: 'the textbooks', bg: C.okBg, stroke: '#a7f3d0', c: C.ok, fw: 700 }, { sub: 'что? — есть', subC: C.ok })], pw - 32);
            s += f.svg;
            const n = para(16, 46 + f.h + 22, 'У keep уже есть дополнение. Ящик — это место: where.', pw - 32, { fs: 12, fw: 600, c: C.mute });
            return { svg: s + n.svg, h: 46 + f.h + 22 + n.h };
        },
        pw => {
            let s = title(16, 26, 'that / which = «который»', C.ink);
            const f = flow(16, 46, [Object.assign(RC.noun('the cabinet'), { sub: 'это и есть «что?»', subC: C.ink }), { label: 'that', bg: C.inkBg, stroke: C.ink, c: C.ink, fw: 800 }, RC.plain('we rarely'), Object.assign(RC.verb('use'), { sub: 'что? — нет', subC: C.bad })], pw - 32);
            s += f.svg;
            const a = f.pos[0], b = f.pos[3];
            if (a.y === b.y) s += curve(b.x + b.w / 2, b.y - 2, a.x + a.w / 2, a.y - 2, -16, C.ink, 'gv-dash');
            const n = para(16, 46 + f.h + 22, 'Use требует дополнения, и это сам cabinet. Поэтому that, а не where.', pw - 32, { fs: 12, fw: 600, c: C.mute });
            return { svg: s + n.svg, h: 46 + f.h + 22 + n.h };
        }
    ], W, narrow);

    // ---- Второй тип условных: картинки для статьи в новом дизайне ----
    // Цвета «маркеров» совпадают с выделением в тексте статьи: условие — синий, результат — жёлтый
    const MK = { ifBg: '#dcebff', ifInk: '#1c4fb5', resBg: '#ffe9a6', resInk: '#7a5200', resLine: '#e2ae3f' };

    // На самом деле ↔ представляем
    V['c2-dream'] = (W, narrow) => {
        const real = pw => {
            let s = title(16, 26, 'На самом деле', C.slate);
            const g = 170;
            for (let i = 0; i < 16; i++) {
                const x = 24 + (i * 41) % (pw - 48), y = 46 + (i * 29) % 72;
                s += `<line x1="${x}" y1="${y}" x2="${x - 4}" y2="${y + 9}" stroke="#93c5fd" stroke-width="2" stroke-linecap="round"/>`;
            }
            const px = pw * 0.36, bx = pw * 0.7;
            s += `<line x1="16" y1="${g}" x2="${pw - 16}" y2="${g}" stroke="${C.line}" stroke-width="2"/>`;
            s += `<line x1="${bx}" y1="84" x2="${bx}" y2="${g}" stroke="${C.slate}" stroke-width="3" stroke-linecap="round"/>`;
            s += R(bx - 24, 62, 48, 24, C.soft, C.slate, 6) + T(bx, 78.5, 'BUS', { fs: 11.5, fw: 800, c: C.slate, a: 'middle' });
            s += `<g fill="none" stroke="${C.slate}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="${px}" cy="98" r="11" fill="#fff"/>
                <path d="M${px} 109 L${px} 142 M${px - 16} 126 L${px} 116 L${px + 16} 126 M${px} 142 L${px - 11} 168 M${px} 142 L${px + 11} 168"/></g>`;
            const n = para(16, 198, 'I don’t have a car.', pw - 32, { fs: 14, fw: 700, c: C.slate });
            return { svg: s + n.svg, h: 198 + n.h };
        };
        const dream = pw => {
            let s = title(16, 26, 'Представляем', MK.ifInk);
            s += `<rect x="16" y="42" width="${pw - 32}" height="116" rx="44" fill="#f3f8ff" stroke="${MK.ifInk}" stroke-width="2" stroke-dasharray="6 5"/>`;
            s += `<circle cx="40" cy="168" r="6" fill="#f3f8ff" stroke="${MK.ifInk}" stroke-width="1.8" stroke-dasharray="3 3"/><circle cx="28" cy="182" r="3.5" fill="#f3f8ff" stroke="${MK.ifInk}" stroke-width="1.6"/>`;
            const cx = pw / 2 + 10;
            s += `<line x1="${cx - 92}" y1="136" x2="${cx + 82}" y2="136" stroke="#bfd5f5" stroke-width="2" stroke-linecap="round"/>`;
            s += [102, 111, 120].map(y => `<line x1="${cx - 92}" y1="${y}" x2="${cx - 72}" y2="${y}" stroke="${MK.ifInk}" stroke-width="2" stroke-linecap="round" opacity=".55"/>`).join('');
            s += `<g stroke="#b07d10" stroke-width="2" stroke-linejoin="round">
                <path d="M${cx - 36} 98 L${cx - 24} 76 L${cx + 22} 76 L${cx + 38} 98 Z" fill="#fff3c4"/>
                <rect x="${cx - 60}" y="96" width="120" height="28" rx="9" fill="#ffd75e"/>
                <line x1="${cx - 1}" y1="77" x2="${cx - 1}" y2="97"/></g>`;
            s += `<circle cx="${cx - 13}" cy="88" r="6.5" fill="#fff" stroke="${C.slate}" stroke-width="2"/>`;
            s += [cx - 34, cx + 34].map(x => `<circle cx="${x}" cy="126" r="10" fill="#334155"/><circle cx="${x}" cy="126" r="4" fill="#cbd5e1"/>`).join('');
            const f = flow(16, 186, [
                { label: 'If I had a car,', bg: MK.ifBg, stroke: MK.ifBg, c: MK.ifInk, fw: 700, fs: 13.5 },
                { label: 'I would drive to campus.', bg: MK.resBg, stroke: MK.resBg, c: MK.resInk, fw: 700, fs: 13.5 }
            ], pw - 32, { gap: 4 });
            return { svg: s + f.svg, h: 186 + f.h + 4 };
        };
        return panels([real, dream], W, narrow);
    };

    // Шкала уверенности: первый тип — реальный шанс, второй — маленький или нулевой
    V['c2-scale'] = (W, narrow) => {
        const x0 = 20, x1 = W - 20, y = 44, mid = (x0 + x1) / 2;
        let s = T(x0, 24, 'скорее всего будет', { fs: 12, fw: 600, c: C.mute }) + T(x1, 24, 'вряд ли или невозможно', { fs: 12, fw: 600, c: C.mute, a: 'end' });
        s += `<rect x="${x0}" y="${y - 5}" width="${mid - x0 - 2}" height="10" rx="5" fill="${C.okBg}" stroke="#a7f3d0"/>`;
        s += `<rect x="${mid + 2}" y="${y - 5}" width="${x1 - mid - 2}" height="10" rx="5" fill="${MK.ifBg}" stroke="#bcd4f6"/>`;
        const pts = [
            { x: x0 + (x1 - x0) * 0.24, col: C.ok, name: 'Первый тип', ex: 'If I get the job, I will move.' },
            { x: x0 + (x1 - x0) * 0.78, col: MK.ifInk, name: 'Второй тип', ex: 'If I got the job, I would move.' }
        ];
        pts.forEach((p, i) => {
            s += `<circle cx="${p.x}" cy="${y}" r="9" fill="#fff" stroke="${p.col}" stroke-width="3"/>`;
            if (narrow) {
                const ty = 84 + i * 50;
                s += `<circle cx="${x0 + 5}" cy="${ty - 4}" r="5" fill="${p.col}"/>` + T(x0 + 16, ty, p.name, { fs: 13, fw: 800, c: p.col });
                s += T(x0 + 16, ty + 20, p.ex, { fs: 12.5, c: C.slate, it: true });
            } else {
                s += `<line x1="${p.x}" y1="${y + 10}" x2="${p.x}" y2="${y + 26}" stroke="${p.col}" stroke-width="1.5"/>`;
                s += T(p.x, y + 44, p.name, { fs: 13, fw: 800, c: p.col, a: 'middle' }) + T(p.x, y + 64, p.ex, { fs: 12.5, c: C.slate, it: true, a: 'middle' });
            }
        });
        return { svg: s, h: narrow ? 84 + 50 + 28 : y + 74 };
    };

    // ---- Остальные статьи серии Conditionals (тот же «маркер»: условие синее, результат жёлтый) ----
    MK.askBg = '#ece8ff'; MK.askInk = '#5b3fc4';
    const mIf = label => ({ label, bg: MK.ifBg, stroke: MK.ifBg, c: MK.ifInk, fw: 700, fs: 13.5 });
    const mRes = label => ({ label, bg: MK.resBg, stroke: MK.resBg, c: MK.resInk, fw: 700, fs: 13.5 });
    const mAsk = label => ({ label, bg: MK.askBg, stroke: MK.askBg, c: MK.askInk, fw: 700, fs: 13.5 });
    const mReal = label => ({ label, bg: C.soft, stroke: C.line, c: C.slate, fw: 600, fs: 13.5 });
    const cloudIcon = (x, y, rain) => `<g transform="translate(${x},${y})"><circle cx="12" cy="16" r="8" fill="#e2e8f0"/><circle cx="23" cy="10" r="10" fill="#e2e8f0"/><circle cx="33" cy="16" r="8" fill="#e2e8f0"/><rect x="4" y="15" width="37" height="10" rx="5" fill="#e2e8f0"/>` +
        (rain ? [11, 22, 33].map(rx => `<line x1="${rx}" y1="30" x2="${rx - 3}" y2="38" stroke="#60a5fa" stroke-width="2" stroke-linecap="round"/>`).join('') : '') + '</g>';
    const sunIcon = (x, y) => `<g transform="translate(${x},${y})" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"><circle cx="22" cy="18" r="8" fill="#fde68a"/>` +
        [0, 45, 90, 135, 180, 225, 270, 315].map(a => { const r = a * Math.PI / 180; return `<line x1="${(22 + Math.cos(r) * 12).toFixed(1)}" y1="${(18 + Math.sin(r) * 12).toFixed(1)}" x2="${(22 + Math.cos(r) * 16).toFixed(1)}" y2="${(18 + Math.sin(r) * 16).toFixed(1)}"/>`; }).join('') + '</g>';
    const stick = (px, armUp) => `<g fill="none" stroke="${C.slate}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="${px}" cy="98" r="11" fill="#fff"/>
            <path d="M${px} 109 L${px} 142 M${px - 16} 126 L${px} 116 L${armUp ? `${px + 16} 110` : `${px + 16} 126`} M${px} 142 L${px - 11} 168 M${px} 142 L${px + 11} 168"/></g>`;

    // Первый тип: обе дороги в будущее реальны
    V['c1-fork'] = (W, narrow) => {
        const br = [
            { icon: (x, y) => cloudIcon(x, y, true), items: [mIf('If it rains,'), mRes('we will stay home.')] },
            { icon: (x, y) => sunIcon(x, y), items: [mIf('If it doesn’t rain,'), mRes('we will go to the beach.')] }
        ];
        let s = '';
        if (!narrow) {
            const sx = 26, sy = 92, ys = [46, 138];
            s += T(sx, sy - 18, 'сейчас', { fs: 12, fw: 700, c: C.mute, a: 'middle' }) + `<circle cx="${sx}" cy="${sy}" r="7" fill="${C.slate}"/>`;
            br.forEach((b, i) => {
                const y = ys[i];
                s += `<path d="M${sx + 7} ${sy} C ${sx + 50} ${sy}, ${sx + 40} ${y}, 106 ${y}" fill="none" stroke="${C.slate}" stroke-width="2.4"/>`;
                s += b.icon(112, y - 20) + row(168, y - 13, b.items, 6).svg;
            });
            const n = para(10, 196, 'Обе дороги реальны, и какая сбудется — пока неизвестно. Это первый тип: if + Present, will + глагол.', W - 20, { fs: 12, fw: 600, c: C.mute });
            return { svg: s + n.svg, h: 196 + n.h };
        }
        let y = 30;
        s += `<circle cx="20" cy="16" r="6" fill="${C.slate}"/>` + T(34, 20, 'сейчас', { fs: 12, fw: 700, c: C.mute });
        const ends = [];
        br.forEach(b => {
            const f = flow(84, y + 4, b.items, W - 94, { gap: 6 });
            const cy = y + 20;
            ends.push(cy);
            s += `<path d="M20 ${cy} L30 ${cy}" stroke="${C.slate}" stroke-width="2.4"/>` + b.icon(32, cy - 20) + f.svg;
            y += Math.max(52, f.h + 18);
        });
        s = `<line x1="20" y1="16" x2="20" y2="${ends[ends.length - 1]}" stroke="${C.slate}" stroke-width="2.4"/>` + s;
        const n = para(10, y + 14, 'Обе дороги реальны, и какая сбудется — пока неизвестно. Это первый тип.', W - 20, { fs: 12, fw: 600, c: C.mute });
        return { svg: s + n.svg, h: y + 14 + n.h };
    };

    // Третий тип: от точки в прошлом отходит воображаемая ветка
    V['c3-branch'] = (W, narrow) => {
        if (narrow) {
            let s = T(10, 18, 'На самом деле (тогда)', { fs: 12, fw: 700, c: C.mute });
            const a = flow(10, 28, [mReal('I didn’t know about the meeting,'), mReal('so I didn’t come.')], W - 20);
            let y = 28 + a.h + 22;
            s += a.svg + T(10, y, '↓ представим другое прошлое', { fs: 12, fw: 700, c: MK.ifInk });
            const b = flow(22, y + 18, [mIf('If I had known,'), mRes('I would have come.')], W - 44);
            s += `<rect x="10" y="${y + 8}" width="${W - 20}" height="${b.h + 20}" rx="14" fill="#f3f8ff" stroke="${MK.ifInk}" stroke-width="1.8" stroke-dasharray="6 5"/>` + b.svg;
            return { svg: s, h: y + 8 + b.h + 24 };
        }
        const ly = 150, px = 110, nx = W - 40;
        let s = `<line x1="24" y1="${ly}" x2="${nx}" y2="${ly}" stroke="${C.slate}" stroke-width="2.4"/>`;
        s += `<circle cx="${px}" cy="${ly}" r="7" fill="${C.slate}"/><circle cx="${nx}" cy="${ly}" r="7" fill="#fff" stroke="${C.slate}" stroke-width="2.4"/>`;
        s += row(60, ly + 14, [mReal('I didn’t know about the meeting,'), mReal('so I didn’t come.')], 6).svg;
        s += T(px, ly + 64, 'тогда', { fs: 12, fw: 700, c: C.mute, a: 'middle' }) + T(nx, ly + 64, 'сейчас', { fs: 12, fw: 700, c: C.mute, a: 'middle' });
        s += `<path d="M${px} ${ly - 7} C ${px} 80, ${px + 30} 60, ${px + 70} 60 L ${nx - 12} 60" fill="none" stroke="${MK.ifInk}" stroke-width="2.2" stroke-dasharray="7 5"/>`;
        s += `<path d="M${nx - 14} 54 L${nx - 4} 60 L${nx - 14} 66" fill="none" stroke="${MK.ifInk}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`;
        s += row(px + 70, 22, [mIf('If I had known,'), mRes('I would have come.')], 6).svg;
        s += T(px + 74, 86, 'представим другое прошлое', { fs: 12, fw: 700, c: MK.ifInk });
        return { svg: s, h: ly + 74 };
    };

    // Смешанный тип: условие и результат по разные стороны от «сейчас»
    V['cm-bridge'] = (W, narrow) => {
        const rows = [
            { left: mIf('If I had studied medicine,'), right: mRes('I would be a doctor now.'), dir: 1, note: 'условие тогда → результат сейчас' },
            { left: mRes('I would have finished on time.'), right: mIf('If I were more organized,'), dir: -1, note: 'условие сейчас → результат тогда' }
        ];
        let s = '';
        if (narrow) {
            let y = 6;
            rows.forEach(r => {
                const first = r.dir === 1 ? ['тогда', r.left] : ['сейчас', r.right], second = r.dir === 1 ? ['сейчас', r.right] : ['тогда', r.left];
                s += T(10, y + 14, first[0], { fs: 12, fw: 700, c: C.mute });
                const a = chip(70, y, first[1].label, first[1]);
                s += a.svg + T(76, y + 46, '↓', { fs: 14, fw: 800, c: C.mute });
                s += T(10, y + 70, second[0], { fs: 12, fw: 700, c: C.mute });
                s += chip(70, y + 56, second[1].label, second[1]).svg;
                s += T(10, y + 104, r.note, { fs: 12, fw: 600, c: C.mute, it: true });
                y += 128;
            });
            return { svg: s, h: y - 10 };
        }
        const mid = W / 2;
        s += T(mid / 2, 18, 'тогда', { fs: 12.5, fw: 800, c: C.mute, a: 'middle' }) + T(mid + mid / 2, 18, 'сейчас', { fs: 12.5, fw: 800, c: C.mute, a: 'middle' });
        s += `<line x1="${mid}" y1="8" x2="${mid}" y2="172" stroke="${C.line}" stroke-width="2" stroke-dasharray="4 4"/>`;
        rows.forEach((r, i) => {
            const y = 38 + i * 72;
            const lw = chip(0, 0, r.left.label, r.left).w;
            s += chip(mid - 26 - lw, y, r.left.label, r.left).svg + chip(mid + 26, y, r.right.label, r.right).svg;
            s += r.dir === 1 ? arrow(mid - 20, y + 13, mid + 20, y + 13, C.slate) : arrow(mid + 20, y + 13, mid - 20, y + 13, C.slate);
            s += T(mid, y + 48, r.note, { fs: 12, fw: 600, c: C.mute, it: true, a: 'middle' });
        });
        return { svg: s, h: 180 };
    };

    // In case — заранее, if — когда уже случилось
    V['cu-umbrella'] = (W, narrow) => {
        const mk = (head, scene, items, note) => pw => {
            let s = title(16, 26, head, MK.ifInk) + scene(pw);
            s += `<line x1="16" y1="170" x2="${pw - 16}" y2="170" stroke="${C.line}" stroke-width="2"/>`;
            const f = flow(16, 186, items, pw - 32, { gap: 4 });
            const n = para(16, 186 + f.h + 18, note, pw - 32, { fs: 12, fw: 600, c: C.mute });
            return { svg: s + f.svg + n.svg, h: 186 + f.h + 18 + n.h };
        };
        const caseScene = pw => {
            const px = pw * 0.42;
            // сложенный зонт в опущенной руке, как трость
            return sunIcon(pw - 76, 40) + stick(px, false) +
                `<path d="M${px + 18} 120 L${px + 31} 168" stroke="${MK.ifInk}" stroke-width="3.2" stroke-linecap="round"/>` +
                `<path d="M${px + 18} 120 q -1 -9 7 -9" fill="none" stroke="${MK.ifInk}" stroke-width="2.4" stroke-linecap="round"/>` +
                `<path d="M${px + 20} 130 L${px + 31} 166 L${px + 27} 130 Z" fill="${MK.ifBg}" stroke="${MK.ifInk}" stroke-width="1.6" stroke-linejoin="round"/>`;
        };
        const ifScene = pw => {
            const px = pw * 0.34;
            let s = cloudIcon(pw - 84, 34, true) + cloudIcon(pw - 136, 56, true);
            s += `<path d="M${px - 23} 66 Q ${px + 16} 26 ${px + 55} 66 Z" fill="${MK.ifBg}" stroke="${MK.ifInk}" stroke-width="2" stroke-linejoin="round"/>`;
            s += `<line x1="${px + 16}" y1="48" x2="${px + 16}" y2="114" stroke="${MK.ifInk}" stroke-width="2.4" stroke-linecap="round"/>`;
            return s + stick(px, true);
        };
        return panels([
            mk('in case — заранее', caseScene, [mRes('Take an umbrella'), mIf('in case it rains.')], 'Берёте зонт сейчас, на всякий случай. Дождя может и не быть.'),
            mk('if — когда случится', ifScene, [mIf('If it rains,'), mRes('open the umbrella.')], 'Действуете, только когда дождь уже пошёл.')
        ], W, narrow);
    };

    // Два разных if: «если» и «ли»
    V['iw-two'] = (W, narrow) => {
        const mk = (head, col, items, note) => pw => {
            let s = title(16, 26, head, col);
            const f = flow(16, 44, items, pw - 32, { gap: 4 });
            const n = para(16, 44 + f.h + 22, note, pw - 32, { fs: 12, fw: 600, c: C.mute });
            return { svg: s + f.svg + n.svg, h: 44 + f.h + 22 + n.h };
        };
        return panels([
            mk('if = «если»', MK.ifInk, [mIf('If it rains,'), mRes('we will stay home.')], 'Условие. Will после if нет. Whether сюда не подставить.'),
            mk('if = «ли»', MK.askInk, [mReal('Do you know'), mAsk('if it will rain?')], 'Вопрос внутри фразы. Will можно. Whether подходит: Do you know whether it will rain?')
        ], W, narrow);
    };

    // ---- Серия «Подлежащее и сказуемое»: подлежащее синее, глагол жёлтый ----
    const mSubj = mIf, mVerb = mRes;
    const mThat = label => ({ label, bg: MK.askBg, stroke: MK.askBg, c: MK.askInk, fw: 700, fs: 13.5 });
    const people = (x, n) => Array.from({ length: n }, (_, k) => `<g transform="translate(${x + k * 30},-20) scale(.6)">${stick(0, false)}</g>`).join('');

    // Одно → -s, много → без -s
    V['sv-one-many'] = (W, narrow) => {
        const mk = (head, n, rows, note) => pw => {
            let s = title(16, 26, head, C.slate) + people(34, n);
            let y = 98;
            rows.forEach(r => { const f = flow(16, y, r, pw - 32, { gap: 4 }); s += f.svg; y += f.h + 8; });
            const t = para(16, y + 12, note, pw - 32, { fs: 12, fw: 600, c: C.mute });
            return { svg: s + t.svg, h: y + 12 + t.h };
        };
        return panels([
            mk('Одно → глагол с -s', 1, [[mSubj('She'), mVerb('works')], [mSubj('The library'), mVerb('closes')], [mSubj('It'), mVerb('is')]], 'he, she, it, this, my friend, the group'),
            mk('Много → без -s', 3, [[mSubj('They'), mVerb('work')], [mSubj('The students'), mVerb('live')], [mSubj('We'), mVerb('are')]], 'they, we, you, I, my friends, people')
        ], W, narrow);
    };

    // Длинное подлежащее: глагол смотрит на главное слово, of… — только уточнение
    V['sv-head'] = (W, narrow) => {
        const extra = label => ({ label, bg: '#fff', stroke: C.line, c: C.mute, fw: 600, sub: 'пропустите', subC: C.mute });
        const ex = [
            [Object.assign(mSubj('The material'), { sub: 'главное слово', subC: MK.ifInk }), extra('of the knives'), Object.assign(mVerb('is'), { sub: 'по material', subC: MK.resInk }), mReal('very strong.')],
            [Object.assign(mSubj('The impact'), { sub: 'главное слово', subC: MK.ifInk }), extra('of online ads'), Object.assign(mVerb('is'), { sub: 'по impact', subC: MK.resInk }), mReal('huge.')]
        ];
        let s = '', y = 30;
        ex.forEach(items => {
            const f = flow(10, y, items, W - 20, { lineGap: 8 });
            s += f.svg;
            const a = f.pos[0], b = f.pos[2];
            if (a.y === b.y) s += curve(b.x + b.w / 2, b.y - 2, a.x + a.w / 2, a.y - 2, -20, MK.resLine, 'gv-dash');
            y += f.h + 40;
        });
        const n = para(10, y - 8, 'Глагол смотрит на главное слово, а не на ближайшее. Закройте всё от of до глагола — останется The material is.', W - 20, { fs: 12, fw: 600, c: C.mute });
        return { svg: s + n.svg, h: y - 8 + n.h };
    };

    // Who / which / that берут число у своего слова
    V['sv-that'] = (W, narrow) => {
        const mk = (head, items, note) => pw => {
            let s = title(16, 26, head, C.slate);
            const f = flow(16, 58, items, pw - 32, { gap: 4 });
            s += f.svg;
            const a = f.pos[0], t = f.pos[1];
            if (a.y === t.y) s += curve(t.x + t.w / 2, t.y - 2, a.x + a.w / 2, a.y - 2, -16, MK.askInk, 'gv-dash');
            const n = para(16, 58 + f.h + 24, note, pw - 32, { fs: 12, fw: 600, c: C.mute });
            return { svg: s + n.svg, h: 58 + f.h + 24 + n.h };
        };
        return panels([
            mk('Одна вещь → глагол с -s', [mSubj('a shirt'), mThat('that'), mVerb('needs'), mReal('washing')], 'that = a shirt. Рубашка одна, поэтому needs.'),
            mk('Много вещей → без -s', [mSubj('the pens'), mThat('that'), mVerb('have'), mReal('a soft grip')], 'that = the pens. Ручек много, поэтому have.')
        ], W, narrow);
    };

    // -ing и what… в роли подлежащего — одно действие или одна мысль
    V['sv-whole'] = (W, narrow) => {
        const inner = label => ({ label, bg: '#fff', stroke: '#bcd4f6', c: MK.ifInk, fw: 700, fs: 13.5 });
        const line = (y, parts, verb, tail, label) => {
            const x = 10, r = row(x + 10, y + 10, parts.map(inner), 5), bw = r.w - 5 + 20;
            let s = R(x, y, bw, 46, '#f3f8ff', MK.ifInk, 12, ' stroke-dasharray="5 4"');
            s += T(x + 4, y - 8, label, { fs: 11.5, fw: 700, c: MK.ifInk }) + r.svg;
            const v = chip(x + bw + 10, y + 10, verb, mVerb(verb));
            s += v.svg + chip(x + bw + 10 + v.w + 6, y + 10, tail, mReal(tail)).svg;
            return s;
        };
        let s = line(24, ['Working', 'long hours'], 'makes', 'us tired.', 'одно действие = it');
        s += line(104, ['What', 'I like most'], 'is', 'the coffee.', 'одна мысль = it');
        const n = para(10, 182, 'Внутри может стоять множественное число (hours), но подлежащее — всё действие целиком, и оно одно.', W - 20, { fs: 12, fw: 600, c: C.mute });
        return { svg: s + n.svg, h: 182 + n.h };
    };

    const STYLE = `<style>
        .gv{margin:16px 0 6px}
        .gv svg{display:block;width:100%;height:auto;font-family:inherit}
        .gv figcaption{font-size:12.5px;color:#64748b;margin-top:6px}
        @media (prefers-reduced-motion:no-preference){
            .gv .gv-pulse{animation:gvPulse 2.4s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
            .gv .gv-dash{stroke-dasharray:6 6;animation:gvDash 1.4s linear infinite}
            .gv .gv-spin{animation:gvSpin 9s linear infinite;transform-box:fill-box;transform-origin:center}
            .gv .gv-glow{animation:gvGlow 2.6s ease-in-out infinite}
            .gv .gv-pop{animation:gvPop 2.8s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
            .gv .gv-shake{animation:gvShake 2.8s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
            .gv .gv-grow{animation:gvGrow 3s ease-out infinite;transform-box:fill-box;transform-origin:left center}
        }
        @keyframes gvPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.18)}}
        @keyframes gvDash{to{stroke-dashoffset:-24}}
        @keyframes gvSpin{to{transform:rotate(360deg)}}
        @keyframes gvGlow{0%,100%{opacity:.35}50%{opacity:.75}}
        @keyframes gvPop{0%,70%,100%{transform:scale(1)}80%{transform:scale(1.12)}}
        @keyframes gvShake{0%,70%,100%{transform:translateX(0)}75%{transform:translateX(-3px)}85%{transform:translateX(3px)}}
        @keyframes gvGrow{0%{transform:scaleX(.05)}60%,100%{transform:scaleX(1)}}
    </style>`;

    function draw(el) {
        const name = el.dataset.gv;
        const fn = V[name];
        if (!fn) return;
        const w = el.clientWidth || el.parentNode.clientWidth || 600;
        const narrow = w < 560;
        const W = narrow ? 360 : 680;
        if (el.dataset.gvMode === (narrow ? 'n' : 'w') && el.querySelector('svg')) return;
        let res;
        try { res = fn(W, narrow); } catch (e) { console.warn('grammar-visuals:', name, e); return; }
        const cap = el.dataset.caption ? `<figcaption>${esc(el.dataset.caption)}</figcaption>` : '';
        el.innerHTML = `<svg viewBox="0 0 ${W} ${Math.ceil(res.h)}" role="img" aria-label="${esc(el.dataset.alt || 'Схема к правилу')}">${res.svg}</svg>` + cap;
        el.dataset.gvMode = narrow ? 'n' : 'w';
    }
    function drawAll() { document.querySelectorAll('[data-gv]').forEach(draw); }

    if (!document.getElementById('gv-css')) {
        const d = document.createElement('div');
        d.innerHTML = STYLE;
        const st = d.firstElementChild; st.id = 'gv-css';
        document.head.appendChild(st);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', drawAll); else drawAll();
    let tmr;
    window.addEventListener('resize', () => { clearTimeout(tmr); tmr = setTimeout(drawAll, 150); });
    window.GV = { drawAll, list: () => Object.keys(V) };
})();
