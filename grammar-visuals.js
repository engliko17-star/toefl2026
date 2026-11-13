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
