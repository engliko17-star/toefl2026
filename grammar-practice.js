/* =====================================================================
   grammar-practice.js — движок практики для грамматических статей (v2).
   Теория стоит в самой статье, практика собирается здесь из данных.

   Принципы:
   • задания перемешаны, правило над ними не подписано;
   • подсказка только там, где без неё нельзя (серый глагол в поле);
   • пояснения появляются после проверки;
   • у каждого упражнения большой запас заданий, а на экране — короткий
     раунд (8–10). Кнопка «Новые задания» берёт следующие: сначала те,
     где ошиблись, потом новые, потом уже решённые;
   • прогресс («Освоено 23 из 60») хранится в браузере ученика.

   Подключение:
     <div id="gp-practice"></div>
     <script src="grammar-practice.js"></script>
     <script> GP.mount('gp-practice', { exercises: [ ... ] }); </script>

   Разметка внутри текста задания:
     {{ответ}}            — поле для ввода; варианты через «/»: {{to apply/applying}}
     {{ответ::глагол}}    — то же, глагол серым в поле: {{meeting::meet}}
     [[the]]              — выпадающий список с вариантами упражнения (options)
     [[to call|calling*]] — свой список; верный отмечен *
     <<wrong|fix>>        — (тип find) ошибочный кусок и исправление
   ===================================================================== */
(function () {
    'use strict';

    // ---------- Стили (один раз на страницу) ----------
    const CSS = `
    .gp{--gp-ink:#4f46e5;--gp-ok:#059669;--gp-okbg:#ecfdf5;--gp-bad:#e11d48;--gp-badbg:#fff1f2;font-size:15px;color:#1e293b}
    .gp-bar{position:sticky;top:8px;z-index:10;background:rgba(255,255,255,.94);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);
        border:1px solid #e5e7eb;border-radius:16px;padding:10px 16px;margin-bottom:24px;box-shadow:0 1px 2px rgba(0,0,0,.04)}
    .gp-bar-top{display:flex;align-items:center;justify-content:space-between;gap:12px}
    .gp-bar-label{font-size:13px;font-weight:600;color:#475569}
    .gp-bar-score{font-size:13px;font-weight:700;color:var(--gp-ink);background:#eef2ff;padding:4px 12px;border-radius:999px;white-space:nowrap}
    .gp-meter{height:6px;background:#eef2ff;border-radius:999px;overflow:hidden;margin-top:8px}
    .gp-meter i{display:block;height:100%;width:0;background:linear-gradient(90deg,#818cf8,#4f46e5);border-radius:999px;transition:width .4s ease}
    .gp-ex{background:#fff;border:1px solid #f1f5f9;border-radius:18px;box-shadow:0 1px 2px rgba(0,0,0,.04);padding:22px;margin-bottom:24px;position:relative}
    @media (min-width:640px){.gp-ex{padding:28px 32px}}
    .gp-ex-head{display:flex;align-items:flex-start;gap:12px;margin-bottom:6px}
    .gp-ex-num{width:32px;height:32px;border-radius:10px;background:#eef2ff;color:var(--gp-ink);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;flex-shrink:0}
    .gp-ex-title{font-weight:700;color:#0f172a;font-size:16px;line-height:1.3;padding-top:5px;flex:1;min-width:0}
    .gp-ex-prog{font-size:12px;font-weight:700;color:#64748b;white-space:nowrap;padding-top:7px}
    .gp-ex-prog b{color:var(--gp-ok)}
    .gp-ex-instr{color:#64748b;font-size:14px;margin:4px 0 6px 44px;line-height:1.5}
    .gp-ex-meter{margin:0 0 16px 44px}
    @media (max-width:479px){.gp-ex-instr,.gp-ex-meter{margin-left:0}}
    .gp-round{font-size:12px;font-weight:600;color:#94a3b8;margin:0 0 4px 44px}
    @media (max-width:479px){.gp-round{margin-left:0}}
    .gp-items{list-style:none;margin:0;padding:0}
    .gp-item{padding:14px 0;border-top:1px solid #f1f5f9}
    .gp-item:first-child{border-top:0;padding-top:4px}
    .gp-line{line-height:2.35;display:flex;gap:10px}
    .gp-n{color:#94a3b8;font-weight:600;font-size:13px;min-width:20px;flex-shrink:0}
    .gp-body{flex:1;min-width:0}
    .gp-ctx{font-size:13px;color:#64748b;margin-bottom:2px;line-height:1.5}
    .gp-ctx b{color:#334155;font-weight:600}
    .gp-input{font:inherit;font-weight:600;color:#1e293b;border:0;border-bottom:2px solid #cbd5e1;background:#f8fafc;
        border-radius:6px 6px 0 0;padding:1px 6px;margin:0 2px;min-width:5ch;transition:border-color .15s,background .15s;line-height:1.5}
    .gp-input::placeholder{color:#a3adbb;font-weight:500;font-style:italic}
    .gp-input:focus{outline:none;border-bottom-color:var(--gp-ink);background:#eef2ff}
    .gp-select{font:inherit;font-weight:600;color:#1e293b;border:1.5px solid #cbd5e1;background:#f8fafc;border-radius:8px;
        padding:1px 22px 1px 8px;margin:0 2px;cursor:pointer;-webkit-appearance:none;appearance:none;line-height:1.5;
        background-image:linear-gradient(45deg,transparent 50%,#64748b 50%),linear-gradient(135deg,#64748b 50%,transparent 50%);
        background-position:calc(100% - 11px) 55%,calc(100% - 6px) 55%;background-size:5px 5px,5px 5px;background-repeat:no-repeat}
    .gp-select:focus{outline:none;border-color:var(--gp-ink);box-shadow:0 0 0 3px rgba(79,70,229,.15)}
    .gp-ok{border-color:var(--gp-ok)!important;background-color:var(--gp-okbg)!important;color:#047857!important}
    .gp-bad{border-color:var(--gp-bad)!important;background-color:var(--gp-badbg)!important;color:#be123c!important}
    .gp-fix{display:inline-block;font-size:12.5px;font-weight:700;color:var(--gp-ok);background:var(--gp-okbg);border-radius:6px;
        padding:0 6px;margin:0 2px;line-height:1.7;vertical-align:baseline}
    .gp-gapno{font-size:10px;font-weight:800;color:#94a3b8;vertical-align:super;margin-left:1px}
    .gp-why{display:none;font-size:13px;line-height:1.55;color:#475569;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:8px 12px;margin-top:6px}
    .gp-checked .gp-why{display:block}
    .gp-why.is-ok{background:var(--gp-okbg);border-color:#a7f3d0}
    .gp-why.is-bad{background:var(--gp-badbg);border-color:#fecdd3}
    .gp-passage{line-height:2.4;white-space:normal}
    .gp-passage p{margin:0 0 10px}
    .gp-passage-box{background:#fcfcfd;border:1px solid #eef0f4;border-radius:14px;padding:16px 18px}
    .gp-notes{display:none;margin:14px 0 0;padding:0;list-style:none}
    .gp-checked .gp-notes{display:block}
    .gp-notes li{font-size:13px;line-height:1.5;color:#475569;padding:5px 10px;border-radius:8px;margin-bottom:4px;background:#f8fafc}
    .gp-notes li.is-bad{background:var(--gp-badbg)}
    .gp-notes li b{color:#334155}
    .gp-w{white-space:nowrap}
.gp-tok.gp-p{padding:0 3px 0 0;margin-left:-2px}
.gp-tok{font:inherit;background:transparent;border:1.5px solid transparent;border-radius:6px;padding:0 2px;margin:0 -1px;cursor:pointer;color:inherit;line-height:1.6}
    .gp-tok:hover{background:#f1f5f9}
    .gp-tok.is-sel{border-color:var(--gp-ink);background:#eef2ff;color:#3730a3}
    .gp-tok.is-err{text-decoration:underline wavy var(--gp-bad);text-underline-offset:4px}
    .gp-tok:disabled{cursor:default}
    .gp-chip{font:inherit;font-size:14px;font-weight:600;border:1.5px solid #e2e8f0;background:#fff;border-radius:999px;padding:3px 12px;margin:3px 4px 3px 0;cursor:pointer;color:#334155;line-height:1.6}
    .gp-chip:hover{border-color:#c7d2fe;background:#f5f7ff}
    .gp-chip.is-sel{border-color:var(--gp-ink);background:#eef2ff;color:#3730a3}
    .gp-chip:disabled{cursor:default;opacity:.9}
    .gp-noerr{font-size:12.5px;margin-left:6px}
    .gp-order-line{min-height:44px;border:1.5px dashed #cbd5e1;border-radius:12px;padding:5px 8px;display:flex;flex-wrap:wrap;align-items:center;gap:2px;background:#fcfcfd;line-height:1.6}
    .gp-order-line .gp-fixed{color:#334155;font-weight:500;padding:0 4px}
    .gp-order-line.gp-ok,.gp-order-line.gp-bad{border-style:solid}
    .gp-bank{display:flex;flex-wrap:wrap;margin-top:8px}
    .gp-bank .gp-chip.is-used{display:none}
    .gp-tf{display:flex;flex-wrap:wrap;align-items:baseline;gap:4px;line-height:2.2}
    .gp-tf .gp-input{flex:1 1 220px;min-width:180px}
    .gp-q{font-weight:600;color:#0f172a;line-height:1.6;margin-bottom:6px}
    .gp-opts{display:flex;flex-direction:column;gap:6px}
    .gp-opt{text-align:left;font:inherit;font-size:14.5px;border:1.5px solid #e2e8f0;background:#fff;border-radius:12px;padding:8px 12px;cursor:pointer;color:#1e293b;line-height:1.5}
    .gp-opt:hover{border-color:#c7d2fe;background:#f5f7ff}
    .gp-opt.is-sel{border-color:var(--gp-ink);background:#eef2ff}
    .gp-opt:disabled{cursor:default}
    .gp-actions{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-top:20px;padding-top:16px;border-top:1px solid #f1f5f9}
    .gp-btn{font:inherit;font-size:13px;font-weight:700;letter-spacing:.02em;border:0;border-radius:10px;padding:9px 18px;cursor:pointer;background:var(--gp-ink);color:#fff}
    .gp-btn:hover{background:#4338ca}
    .gp-btn.is-ghost{background:#f1f5f9;color:#334155}
    .gp-btn.is-ghost:hover{background:#e2e8f0}
    .gp-btn[hidden]{display:none}
    .gp-result{font-size:14px;font-weight:700;color:#334155}
    .gp-hint-missing{font-size:12.5px;color:#b45309;font-weight:600}
    .gp-cheer{display:none;align-items:center;gap:8px;font-size:14px;font-weight:700;color:#047857;background:var(--gp-okbg);border:1px solid #a7f3d0;border-radius:12px;padding:8px 12px;margin-top:14px;position:relative;overflow:hidden}
    .gp-cheer.show{display:flex}
    .gp-cheer i{position:absolute;width:7px;height:7px;border-radius:2px;top:50%;left:20px;opacity:0}
    @media (prefers-reduced-motion:no-preference){
        .gp-cheer.show i{animation:gpBurst .9s ease-out forwards}
        .gp-why,.gp-notes{animation:gpIn .18s ease-out}
    }
    @keyframes gpBurst{0%{opacity:1;transform:translate(0,0) rotate(0)}100%{opacity:0;transform:translate(var(--dx),var(--dy)) rotate(200deg)}}
    @keyframes gpIn{from{opacity:0;transform:translateY(-3px)}to{opacity:1;transform:none}}
    .gp-reset-all{font:inherit;font-size:12px;color:#94a3b8;background:none;border:0;cursor:pointer;padding:0;margin-top:6px;text-decoration:underline;text-underline-offset:3px}
    .gp-reset-all:hover{color:#475569}
    `;

    function injectCss() {
        if (document.getElementById('gp-css')) return;
        const st = document.createElement('style');
        st.id = 'gp-css';
        st.textContent = CSS;
        document.head.appendChild(st);
    }

    // ---------- Утилиты ----------
    const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    // В тексте заданий разрешены только <b>, <i>, <br> — остальное экранируется
    const rich = s => esc(s).replace(/&lt;(\/?)(b|i|br)\s*\/?&gt;/g, '<$1$2>');
    const shuffle = arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
    const hash = s => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); };
    const TEST = () => !!window.GP_TEST; // только для автотестов: ответы в data-атрибутах

    // Приводим ответ к одному виду: регистр, апострофы, пробелы, сокращения
    const CONTR = [
        [/\bcan't\b/g, 'can not'], [/\bcannot\b/g, 'can not'], [/\bwon't\b/g, 'will not'], [/\bshan't\b/g, 'shall not'],
        [/n't\b/g, ' not'], [/\bi'm\b/g, 'i am'], [/'re\b/g, ' are'], [/'ve\b/g, ' have'], [/'ll\b/g, ' will'], [/'d\b/g, ' would'],
        [/\b(it|he|she|that|what|where|who|there|here|how|when|why)'s\b/g, '$1 is']
    ];
    function norm(s) {
        let t = String(s || '').toLowerCase().replace(/[’‘`´]/g, "'").replace(/[“”]/g, '"').replace(/[—–]/g, '—');
        CONTR.forEach(([re, to]) => { t = t.replace(re, to); });
        t = t.replace(/\s+([,.?!;:])/g, '$1').replace(/\s+/g, ' ').trim();
        t = t.replace(/^[\s"'.,!?;:]+|[\s"'.,!?;:]+$/g, '');
        return t;
    }
    // Для пунктуационных пропусков знаки не срезаем
    // Обратный штрих ` не заменяем: в статье о пунктуации это отдельная ошибка
    function normPunct(s) { return String(s || '').replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim().toLowerCase(); }
    const ZERO = ['—', '-', '–', '0', 'ø', '∅', 'no article', 'zero', 'x', 'нет', 'ничего'];
    const isZero = s => ZERO.indexOf(String(s).trim().toLowerCase()) !== -1;

    // ---------- Хранилище прогресса (в браузере ученика) ----------
    const PAGE = (location.pathname.split('/').pop() || 'page').replace(/\.html$/, '');
    function storeKey(exId) { return 'gp:' + PAGE + ':' + exId; }
    function loadStore(exId) { try { return JSON.parse(localStorage.getItem(storeKey(exId)) || '{}') || {}; } catch (e) { return {}; } }
    function saveStore(exId, data) { try { localStorage.setItem(storeKey(exId), JSON.stringify(data)); } catch (e) { /* без сохранения */ } }

    // ---------- Разбор разметки в тексте ----------
    function parseGaps(src, exOptions) {
        const out = [];
        const re = /\{\{([^}]*)\}\}|\[\[([^\]]*)\]\]/g;
        let last = 0, m;
        while ((m = re.exec(src))) {
            if (m.index > last) out.push({ t: 'text', s: src.slice(last, m.index) });
            if (m[1] !== undefined) {
                const [ans, hint] = m[1].split('::');
                out.push({ t: 'input', answers: ans.split('/').map(x => x.trim()), hint: (hint || '').trim() });
            } else {
                const body = m[2];
                if (body.indexOf('|') !== -1) {
                    const raw = body.split('|').map(x => x.trim());
                    const correct = raw.filter(x => x.endsWith('*')).map(x => x.slice(0, -1));
                    out.push({ t: 'select', options: raw.map(x => x.replace(/\*$/, '')), correct });
                } else {
                    out.push({ t: 'select', options: exOptions || [], correct: body.split('/').map(x => x.trim()) });
                }
            }
            last = re.lastIndex;
        }
        if (last < src.length) out.push({ t: 'text', s: src.slice(last) });
        return out;
    }

    let uid = 0;
    const nextId = p => (p || 'gp') + '-' + (++uid);

    // Ширина поля — по длине серой подсказки (не по длине ответа, чтобы не подсказывать)
    function sizeInput(inp) {
        const base = Math.max((inp.placeholder || '').length + 2, inp.dataset.punct ? 3 : 7);
        const cur = (inp.value || '').length + 2;
        inp.style.width = Math.min(Math.max(base, cur), 32) + 'ch';
    }

    function gapHtml(parts, gaps, opts) {
        opts = opts || {};
        return parts.map(p => {
            if (p.t === 'text') return rich(p.s).replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>');
            const id = nextId('g');
            const no = opts.number ? `<span class="gp-gapno" aria-hidden="true">${gaps.length + 1}</span>` : '';
            gaps.push(Object.assign({ id, punct: !!opts.punct }, p));
            const tAttr = TEST() ? ` data-ans="${esc(p.t === 'input' ? p.answers[0] : (p.options.find(o => o.toLowerCase() === p.correct[0].toLowerCase()) || p.correct[0]))}"` : '';
            if (p.t === 'input') {
                return `<input id="${id}"${tAttr} class="gp-input" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="next"
                        ${opts.punct ? 'data-punct="1"' : ''} ${p.hint ? `placeholder="${esc(p.hint)}"` : ''} aria-label="${esc(p.hint ? 'пропуск, глагол ' + p.hint : 'пропуск')}">${no}`;
            }
            const optsHtml = ['<option value="" selected>…</option>'].concat(p.options.map(o => `<option value="${esc(o)}">${esc(o)}</option>`)).join('');
            return `<select id="${id}"${tAttr} class="gp-select" aria-label="выберите вариант">${optsHtml}</select>${no}`;
        }).join('');
    }

    function gapCorrect(g) {
        const el = document.getElementById(g.id);
        const val = el.value;
        if (g.t === 'select') {
            if (!val) return null;
            return g.correct.some(c => c.toLowerCase() === val.toLowerCase() || (isZero(c) && isZero(val)));
        }
        if (g.punct) {
            // пунктуация: пустое поле = «знак не нужен»
            return g.answers.some(a => (isZero(a) ? (!val.trim() || isZero(val)) : normPunct(a) === normPunct(val)));
        }
        if (!val.trim()) return null;
        return g.answers.some(a => (isZero(a) && isZero(val)) || norm(a) === norm(val));
    }
    const gapAnswerText = g => (g.t === 'select' ? g.correct[0] : g.answers[0]);
    const shownAnswer = g => { const a = gapAnswerText(g); return isZero(a) ? (g.punct ? 'без знака' : 'ничего') : a; };

    function markGap(g, ok) {
        const el = document.getElementById(g.id);
        el.classList.remove('gp-ok', 'gp-bad');
        el.classList.add(ok ? 'gp-ok' : 'gp-bad');
        el.disabled = true;
        if (!ok) {
            const fix = document.createElement('span');
            fix.className = 'gp-fix';
            fix.dataset.gpFix = '1';
            fix.textContent = shownAnswer(g);
            el.insertAdjacentElement('afterend', fix);
        }
    }
    function resetGap(g) {
        const el = document.getElementById(g.id);
        el.classList.remove('gp-ok', 'gp-bad');
        el.disabled = false;
        el.value = '';
        if (el.tagName === 'INPUT') sizeInput(el);
    }
    function wireInputs(scope) {
        scope.querySelectorAll('input.gp-input').forEach(el => {
            sizeInput(el);
            el.addEventListener('input', () => sizeInput(el));
        });
    }

    // ---------- Типы заданий ----------
    // render(ex, list, items) → { check(): {ok,total,missing,results:[{key,ok}]}, reset() }

    // Предложения с пропусками (поле ввода и/или список)
    function renderGapItems(ex, list, items) {
        const rows = [];
        items.forEach((it, i) => {
            const gaps = [];
            const li = document.createElement('li');
            li.className = 'gp-item';
            const ctx = it.ctx ? `<div class="gp-ctx">${rich(it.ctx)}</div>` : '';
            li.innerHTML = `<div class="gp-line"><span class="gp-n">${i + 1}.</span><div class="gp-body">${ctx}<span>${gapHtml(parseGaps(it.t, ex.options), gaps, { punct: ex.punct })}</span>
                <div class="gp-why"></div></div></div>`;
            list.appendChild(li);
            rows.push({ li, gaps, it });
        });
        wireInputs(list);
        return {
            check() {
                let ok = 0, total = 0, missing = 0;
                const results = [];
                rows.forEach(r => {
                    let allOk = true;
                    r.gaps.forEach(g => {
                        const res = gapCorrect(g);
                        total++;
                        if (res === null) missing++;
                        if (res) ok++; else allOk = false;
                        markGap(g, !!res);
                    });
                    results.push({ key: r.it._key, ok: allOk });
                    const why = r.li.querySelector('.gp-why');
                    why.innerHTML = rich(r.it.why || '');
                    why.className = 'gp-why ' + (allOk ? 'is-ok' : 'is-bad');
                    why.style.display = r.it.why ? '' : 'none';
                });
                return { ok, total, missing, results };
            },
            reset() {
                rows.forEach(r => {
                    r.li.querySelectorAll('[data-gp-fix]').forEach(n => n.remove());
                    r.gaps.forEach(resetGap);
                    const why = r.li.querySelector('.gp-why'); why.style.display = ''; why.className = 'gp-why';
                });
            }
        };
    }

    // Связный текст (письмо, пост) с пропусками — по одному тексту за раунд
    function renderPassage(ex, list, items) {
        const it = items[0];
        const gaps = [];
        const box = document.createElement('div');
        box.className = 'gp-passage-box';
        const head = it.ctx ? `<div class="gp-ctx" style="margin-bottom:8px">${rich(it.ctx)}</div>` : '';
        box.innerHTML = head + `<div class="gp-passage"><p>${gapHtml(parseGaps(it.passage, ex.options), gaps, { number: true, punct: ex.punct })}</p></div>`;
        const notes = document.createElement('ol');
        notes.className = 'gp-notes';
        list.appendChild(box);
        list.appendChild(notes);
        wireInputs(box);
        return {
            check() {
                let ok = 0, missing = 0;
                const results = [];
                notes.innerHTML = '';
                gaps.forEach((g, i) => {
                    const res = gapCorrect(g);
                    if (res === null) missing++;
                    if (res) ok++;
                    markGap(g, !!res);
                    results.push({ key: it._key + '#' + i, ok: !!res });
                    const why = (it.notes || [])[i];
                    if (why) {
                        const li = document.createElement('li');
                        li.className = res ? '' : 'is-bad';
                        li.innerHTML = `<b>${i + 1} — ${esc(shownAnswer(g))}.</b> ${rich(why)}`;
                        notes.appendChild(li);
                    }
                });
                return { ok, total: gaps.length, missing, results };
            },
            reset() {
                box.querySelectorAll('[data-gp-fix]').forEach(n => n.remove());
                gaps.forEach(resetGap);
                notes.innerHTML = '';
            }
        };
    }

    // Найдите ошибку: нажать на неверное слово или «Ошибки нет»
    function tokenize(src) {
        const toks = [];
        const re = /<<([^|>]*)\|([^>]*)>>/g;
        let last = 0, m, gid = 0;
        // Слово и знак после него — разные кнопки; точки внутри (a.m., 16.00) остаются в слове
        const pushPlain = (txt, err, fix, g) => {
            (txt.match(/\S+/g) || []).forEach(chunk => {
                const m = chunk.match(/^(.*?)([.,?!;:]*)$/);
                if (m[1]) toks.push({ s: m[1], err, fix, gid: g });
                m[2].split('').forEach(p => toks.push({ s: p, err, fix, gid: g }));
            });
        };
        while ((m = re.exec(src))) {
            if (m.index > last) pushPlain(src.slice(last, m.index), false);
            gid++;
            pushPlain(m[1], true, m[2], gid);
            last = re.lastIndex;
        }
        if (last < src.length) pushPlain(src.slice(last), false);
        return toks;
    }
    function renderFind(ex, list, items) {
        const rows = [];
        items.forEach((it, i) => {
            const toks = tokenize(it.t);
            const hasErr = toks.some(t => t.err);
            const li = document.createElement('li');
            li.className = 'gp-item';
            // Слово и знаки после него держим вместе, чтобы точка не уезжала на новую строку
            const isP = s => /^[.,?!;:]$/.test(s);
            const tokHtml = toks.map((t, k) => {
                const btn = `<button type="button" class="gp-tok${isP(t.s) ? ' gp-p' : ''}" data-k="${k}"${TEST() && t.err ? ' data-err="1"' : ''}>${esc(t.s)}</button>`;
                const open = (k === 0 || !isP(t.s)) ? (k > 0 ? ' ' : '') + '<span class="gp-w">' : '';
                const close = (k === toks.length - 1 || !isP(toks[k + 1].s)) ? '</span>' : '';
                return open + btn + close;
            }).join('');
            li.innerHTML = `<div class="gp-line"><span class="gp-n">${i + 1}.</span><div class="gp-body">
                ${it.ctx ? `<div class="gp-ctx">${rich(it.ctx)}</div>` : ''}
                <span class="gp-sent">${tokHtml}</span>
                <button type="button" class="gp-chip gp-noerr" data-noerr="1">Ошибки нет</button>
                <div class="gp-why"></div></div></div>`;
            list.appendChild(li);
            const row = { li, toks, hasErr, it, sel: null };
            li.addEventListener('click', e => {
                const b = e.target.closest('button');
                if (!b || b.disabled) return;
                li.querySelectorAll('.is-sel').forEach(n => n.classList.remove('is-sel'));
                const pick = b.dataset.noerr ? 'none' : Number(b.dataset.k);
                if (row.sel === pick) { row.sel = null; return; }
                row.sel = pick;
                b.classList.add('is-sel');
            });
            rows.push(row);
        });
        return {
            check() {
                let ok = 0, missing = 0;
                const results = [];
                rows.forEach(r => {
                    let res;
                    if (r.sel === null) { res = false; missing++; }
                    else if (r.sel === 'none') res = !r.hasErr;
                    else res = r.hasErr && !!r.toks[r.sel] && r.toks[r.sel].err;
                    if (res) ok++;
                    results.push({ key: r.it._key, ok: !!res });
                    r.li.querySelectorAll('button').forEach(b => { b.disabled = true; });
                    const shown = new Set();
                    r.li.querySelectorAll('.gp-tok').forEach(b => {
                        const t = r.toks[Number(b.dataset.k)];
                        if (!t.err) return;
                        b.classList.add('is-err');
                        if (!shown.has(t.gid)) {
                            const lastK = r.toks.reduce((acc, x, k) => (x.gid === t.gid ? k : acc), -1);
                            const lastBtn = r.li.querySelector(`.gp-tok[data-k="${lastK}"]`);
                            if (lastBtn) { const fx = document.createElement('span'); fx.className = 'gp-fix'; fx.dataset.gpFix = '1'; fx.textContent = '→ ' + (t.fix || 'убрать'); (lastBtn.closest('.gp-w') || lastBtn).insertAdjacentElement('afterend', fx); }
                            shown.add(t.gid);
                        }
                    });
                    const sel = r.sel === 'none' ? r.li.querySelector('[data-noerr]') : (r.sel !== null ? r.li.querySelector(`.gp-tok[data-k="${r.sel}"]`) : null);
                    if (sel) sel.classList.add(res ? 'gp-ok' : 'gp-bad');
                    if (!r.hasErr) r.li.querySelector('[data-noerr]').classList.add('gp-ok');
                    const why = r.li.querySelector('.gp-why');
                    why.innerHTML = (r.sel === null ? '<span class="gp-hint-missing">Нет ответа. </span>' : '') + rich(r.it.why || '');
                    why.className = 'gp-why ' + (res ? 'is-ok' : 'is-bad');
                });
                return { ok, total: rows.length, missing, results };
            },
            reset() {
                rows.forEach(r => {
                    r.sel = null;
                    r.li.querySelectorAll('[data-gp-fix]').forEach(n => n.remove());
                    r.li.querySelectorAll('button').forEach(b => { b.disabled = false; b.classList.remove('is-sel', 'is-err', 'gp-ok', 'gp-bad'); });
                    r.li.querySelector('.gp-why').className = 'gp-why';
                });
            }
        };
    }

    // Соберите предложение (как Build a Sentence)
    function renderOrder(ex, list, items) {
        const rows = [];
        items.forEach((it, i) => {
            const li = document.createElement('li');
            li.className = 'gp-item';
            if (TEST()) { li.dataset.ans = it.answers[0]; li.dataset.pre = it.pre || ''; li.dataset.post = it.post || ''; }
            const bank = shuffle(it.words.map((w, k) => ({ w, k })));
            li.innerHTML = `<div class="gp-line"><span class="gp-n">${i + 1}.</span><div class="gp-body">
                ${it.ctx ? `<div class="gp-ctx">${rich(it.ctx)}</div>` : ''}
                <div class="gp-order-line" role="group" aria-label="ваше предложение">
                    ${it.pre ? `<span class="gp-fixed">${esc(it.pre)}</span>` : ''}<span class="gp-slots" style="display:contents"></span>${it.post ? `<span class="gp-fixed">${esc(it.post)}</span>` : ''}
                </div>
                <div class="gp-bank">${bank.map(b => `<button type="button" class="gp-chip" data-k="${b.k}">${esc(b.w)}</button>`).join('')}</div>
                <div class="gp-why"></div></div></div>`;
            list.appendChild(li);
            const row = { li, it, picked: [] };
            const slots = li.querySelector('.gp-slots');
            const draw = () => {
                slots.innerHTML = row.picked.map(k => `<button type="button" class="gp-chip is-sel" data-back="${k}">${esc(it.words[k])}</button>`).join('');
                li.querySelectorAll('.gp-bank .gp-chip').forEach(b => b.classList.toggle('is-used', row.picked.indexOf(Number(b.dataset.k)) !== -1));
            };
            li.addEventListener('click', e => {
                const b = e.target.closest('button');
                if (!b || b.disabled) return;
                if (b.dataset.back !== undefined) row.picked = row.picked.filter(k => k !== Number(b.dataset.back));
                else if (b.dataset.k !== undefined && row.picked.indexOf(Number(b.dataset.k)) === -1) row.picked.push(Number(b.dataset.k));
                draw();
            });
            row.draw = draw;
            rows.push(row);
        });
        return {
            check() {
                let ok = 0, missing = 0;
                const results = [];
                rows.forEach(r => {
                    const got = norm([r.it.pre || '', r.picked.map(k => r.it.words[k]).join(' '), r.it.post || ''].join(' '));
                    const res = r.picked.length > 0 && r.it.answers.some(a => norm(a) === got);
                    if (!r.picked.length) missing++;
                    if (res) ok++;
                    results.push({ key: r.it._key, ok: res });
                    r.li.querySelector('.gp-order-line').classList.add(res ? 'gp-ok' : 'gp-bad');
                    r.li.querySelectorAll('button').forEach(b => { b.disabled = true; });
                    const why = r.li.querySelector('.gp-why');
                    why.innerHTML = (res ? '' : `<b>Верно:</b> ${esc(r.it.answers[0])}<br>`) + rich(r.it.why || '');
                    why.className = 'gp-why ' + (res ? 'is-ok' : 'is-bad');
                });
                return { ok, total: rows.length, missing, results };
            },
            reset() {
                rows.forEach(r => {
                    r.picked = [];
                    r.li.querySelector('.gp-order-line').classList.remove('gp-ok', 'gp-bad');
                    r.li.querySelectorAll('button').forEach(b => { b.disabled = false; });
                    r.draw();
                    r.li.querySelector('.gp-why').className = 'gp-why';
                });
            }
        };
    }

    // Перефразируйте: дано начало, ученик пишет продолжение
    function renderTransform(ex, list, items) {
        const rows = [];
        items.forEach((it, i) => {
            const li = document.createElement('li');
            li.className = 'gp-item';
            const id = nextId('t');
            if (TEST()) li.dataset.ans = it.answers[0];
            li.innerHTML = `<div class="gp-line"><span class="gp-n">${i + 1}.</span><div class="gp-body">
                <div class="gp-q">${rich(it.q)}</div>
                <div class="gp-tf"><span>${esc(it.lead)}</span><input id="${id}" class="gp-input" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="next" aria-label="продолжение предложения"><span>${esc(it.end || '')}</span></div>
                <div class="gp-why"></div></div></div>`;
            list.appendChild(li);
            rows.push({ li, it, id });
        });
        return {
            check() {
                let ok = 0, missing = 0;
                const results = [];
                rows.forEach(r => {
                    const el = document.getElementById(r.id);
                    const val = el.value;
                    const res = !!val.trim() && r.it.answers.some(a => norm(a) === norm(val));
                    if (!val.trim()) missing++;
                    if (res) ok++;
                    results.push({ key: r.it._key, ok: res });
                    el.classList.add(res ? 'gp-ok' : 'gp-bad');
                    el.disabled = true;
                    const why = r.li.querySelector('.gp-why');
                    why.innerHTML = (res ? '' : `<b>Верно:</b> ${esc(r.it.lead)} ${esc(r.it.answers[0])}${esc(r.it.end || '')}<br>`) + rich(r.it.why || '');
                    why.className = 'gp-why ' + (res ? 'is-ok' : 'is-bad');
                });
                return { ok, total: rows.length, missing, results };
            },
            reset() {
                rows.forEach(r => {
                    const el = document.getElementById(r.id);
                    el.classList.remove('gp-ok', 'gp-bad'); el.disabled = false; el.value = '';
                    r.li.querySelector('.gp-why').className = 'gp-why';
                });
            }
        };
    }

    // Выбор одного варианта
    function renderMc(ex, list, items) {
        const rows = [];
        items.forEach((it, i) => {
            const li = document.createElement('li');
            li.className = 'gp-item';
            const order = it.keepOrder ? it.options.map((o, k) => k) : shuffle(it.options.map((o, k) => k));
            li.innerHTML = `<div class="gp-line"><span class="gp-n">${i + 1}.</span><div class="gp-body">
                ${it.q ? `<div class="gp-q">${rich(it.q)}</div>` : ''}
                <div class="gp-opts">${order.map(k => `<button type="button" class="gp-opt" data-k="${k}"${TEST() && k === it.correct ? ' data-correct="1"' : ''}>${rich(it.options[k])}</button>`).join('')}</div>
                <div class="gp-why"></div></div></div>`;
            list.appendChild(li);
            const row = { li, it, sel: null };
            li.addEventListener('click', e => {
                const b = e.target.closest('.gp-opt');
                if (!b || b.disabled) return;
                li.querySelectorAll('.gp-opt').forEach(n => n.classList.remove('is-sel'));
                b.classList.add('is-sel');
                row.sel = Number(b.dataset.k);
            });
            rows.push(row);
        });
        return {
            check() {
                let ok = 0, missing = 0;
                const results = [];
                rows.forEach(r => {
                    const res = r.sel === r.it.correct;
                    if (r.sel === null) missing++;
                    if (res) ok++;
                    results.push({ key: r.it._key, ok: res });
                    r.li.querySelectorAll('.gp-opt').forEach(b => {
                        b.disabled = true;
                        const k = Number(b.dataset.k);
                        if (k === r.it.correct) b.classList.add('gp-ok');
                        else if (k === r.sel) b.classList.add('gp-bad');
                    });
                    const why = r.li.querySelector('.gp-why');
                    why.innerHTML = rich(r.it.why || '');
                    why.className = 'gp-why ' + (res ? 'is-ok' : 'is-bad');
                });
                return { ok, total: rows.length, missing, results };
            },
            reset() {
                rows.forEach(r => {
                    r.sel = null;
                    r.li.querySelectorAll('.gp-opt').forEach(b => { b.disabled = false; b.classList.remove('is-sel', 'gp-ok', 'gp-bad'); });
                    r.li.querySelector('.gp-why').className = 'gp-why';
                });
            }
        };
    }

    const RENDER = { gaps: renderGapItems, passage: renderPassage, find: renderFind, order: renderOrder, transform: renderTransform, mc: renderMc };

    // ---------- Пулы и раунды ----------
    function itemText(ex, it) { return ex.type === 'passage' ? it.passage : (it.t || it.q || (it.words || []).join(' ') || (it.options || []).join('|')); }
    // Единицы прогресса: у текста — каждый пропуск, у остальных — задание целиком
    function unitKeys(ex, it) {
        if (ex.type !== 'passage') return [it._key];
        const n = (it.passage.match(/\{\{|\[\[/g) || []).length;
        return Array.from({ length: n }, (_, i) => it._key + '#' + i);
    }
    // Порядок выдачи: сначала ошибки, потом новые, потом решённые; недавние — в конец
    function pickRound(ex, store, recent) {
        const size = ex.type === 'passage' ? 1 : Math.min(ex.perRound || 10, ex.pool.length);
        const scored = shuffle(ex.pool).map(it => {
            const keys = unitKeys(ex, it);
            const st = keys.map(k => store[k]);
            let s = st.some(x => x === 'bad') ? 0 : (st.every(x => x === undefined) ? 1 : (st.some(x => x === undefined) ? 1 : 2));
            if (recent.has(it._key)) s += 2.5;
            return { it, s };
        });
        scored.sort((a, b) => a.s - b.s);
        return shuffle(scored.slice(0, size).map(x => x.it));
    }

    function burst(el) {
        el.querySelectorAll('i').forEach(n => n.remove());
        const colors = ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];
        for (let i = 0; i < 14; i++) {
            const d = document.createElement('i');
            const a = (Math.PI * 2 * i) / 14;
            d.style.background = colors[i % colors.length];
            d.style.setProperty('--dx', Math.round(Math.cos(a) * (60 + Math.random() * 60)) + 'px');
            d.style.setProperty('--dy', Math.round(Math.sin(a) * (30 + Math.random() * 30)) + 'px');
            el.appendChild(d);
        }
    }
    const CHEERS = ['Всё верно!', 'Отлично, без единой ошибки!', 'Чисто! Так держать.', 'Идеально!', 'Ни одной ошибки — супер.'];

    function mount(target, cfg) {
        injectCss();
        const root = typeof target === 'string' ? document.getElementById(target) : target;
        if (!root) return;
        root.classList.add('gp');

        // Ключи заданий
        cfg.exercises.forEach((ex, i) => {
            ex.id = ex.id || ('ex' + (i + 1));
            ex.pool = (ex.type === 'passage' ? (ex.texts || [{ passage: ex.passage, notes: ex.notes, ctx: ex.ctx }]) : ex.items)
                .map(it => Object.assign({}, it, { _key: hash(ex.type + '|' + itemText(ex, it)) }));
        });
        const unitsOf = ex => ex.pool.reduce((n, it) => n + unitKeys(ex, it).length, 0);
        const grand = cfg.exercises.reduce((n, ex) => n + unitsOf(ex), 0);

        const bar = document.createElement('div');
        bar.className = 'gp-bar';
        bar.innerHTML = `<div class="gp-bar-top"><span class="gp-bar-label">${esc(cfg.barLabel || 'Практика')}</span>
            <span class="gp-bar-score" aria-live="polite"></span></div>
            <div class="gp-meter" aria-hidden="true"><i></i></div>`;
        root.appendChild(bar);

        const states = [];
        const mastered = (ex, store) => ex.pool.reduce((n, it) => n + unitKeys(ex, it).filter(k => store[k] === 'ok').length, 0);
        function updateBar() {
            const m = states.reduce((n, s) => n + mastered(s.ex, s.store), 0);
            bar.querySelector('.gp-bar-score').textContent = `Освоено ${m} из ${grand}`;
            bar.querySelector('.gp-meter i').style.width = (grand ? Math.round((m / grand) * 100) : 0) + '%';
        }

        cfg.exercises.forEach((ex, i) => {
            const sec = document.createElement('section');
            sec.className = 'gp-ex';
            const units = unitsOf(ex);
            const isText = ex.type === 'passage';
            sec.innerHTML = `<div class="gp-ex-head"><span class="gp-ex-num">${i + 1}</span><h3 class="gp-ex-title">${esc(ex.title)}</h3>
                    <span class="gp-ex-prog"></span></div>
                ${ex.instr ? `<p class="gp-ex-instr">${rich(ex.instr)}</p>` : ''}
                <div class="gp-meter gp-ex-meter" aria-hidden="true"><i></i></div>
                <p class="gp-round"></p>
                <ol class="gp-items"></ol>
                <div class="gp-cheer" role="status"></div>
                <div class="gp-actions">
                    <button type="button" class="gp-btn" data-act="check">Проверить</button>
                    <button type="button" class="gp-btn is-ghost" data-act="retry" hidden>Пройти заново</button>
                    <button type="button" class="gp-btn" data-act="next" hidden>${isText ? 'Следующий текст →' : 'Новые задания →'}</button>
                    <span class="gp-result" aria-live="polite"></span>
                </div>`;
            root.appendChild(sec);
            const st = { ex, sec, store: loadStore(ex.id), recent: new Set(), ctl: null, round: 0 };
            states.push(st);
            const list = sec.querySelector('.gp-items');
            const btnCheck = sec.querySelector('[data-act="check"]');
            const btnRetry = sec.querySelector('[data-act="retry"]');
            const btnNext = sec.querySelector('[data-act="next"]');
            const out = sec.querySelector('.gp-result');
            const cheer = sec.querySelector('.gp-cheer');

            function updateProg() {
                const m = mastered(ex, st.store);
                sec.querySelector('.gp-ex-prog').innerHTML = `Освоено <b>${m}</b> из ${units}`;
                sec.querySelector('.gp-ex-meter i').style.width = (units ? Math.round((m / units) * 100) : 0) + '%';
                updateBar();
            }
            function setMode(checked) {
                btnCheck.hidden = checked;
                btnRetry.hidden = !checked;
                btnNext.hidden = !checked;
                sec.classList.toggle('gp-checked', checked);
            }
            function newRound() {
                const items = pickRound(ex, st.store, st.recent);
                st.recent = new Set(items.map(x => x._key));
                st.round++;
                list.innerHTML = '';
                st.ctl = RENDER[ex.type](ex, list, items);
                const poolN = ex.pool.length;
                sec.querySelector('.gp-round').textContent = isText
                    ? (poolN > 1 ? `Текст ${((st.round - 1) % poolN) + 1} · всего текстов: ${poolN}` : '')
                    : `Раунд ${st.round} · ${items.length} заданий из ${poolN}`;
                out.textContent = '';
                cheer.classList.remove('show');
                setMode(false);
            }
            btnCheck.addEventListener('click', () => {
                const r = st.ctl.check();
                r.results.forEach(x => { st.store[x.key] = x.ok ? 'ok' : 'bad'; });
                saveStore(ex.id, st.store);
                out.innerHTML = `${r.ok} из ${r.total}` + (r.missing ? ` <span class="gp-hint-missing">· без ответа: ${r.missing}</span>` : '');
                if (r.total && r.ok === r.total) {
                    cheer.textContent = CHEERS[Math.floor(Math.random() * CHEERS.length)];
                    cheer.classList.add('show');
                    burst(cheer);
                }
                setMode(true);
                updateProg();
            });
            btnRetry.addEventListener('click', () => { st.ctl.reset(); out.textContent = ''; cheer.classList.remove('show'); setMode(false); });
            btnNext.addEventListener('click', () => { newRound(); sec.scrollIntoView({ behavior: 'smooth', block: 'start' }); });

            // Enter в поле — к следующему пропуску (удобно на планшете и телефоне)
            sec.addEventListener('keydown', e => {
                if (e.key !== 'Enter' || !e.target.matches('input.gp-input')) return;
                e.preventDefault();
                const inputs = Array.from(sec.querySelectorAll('input.gp-input:not(:disabled), select.gp-select:not(:disabled)'));
                const k = inputs.indexOf(e.target);
                if (k > -1 && k < inputs.length - 1) inputs[k + 1].focus(); else btnCheck.focus();
            });

            newRound();
            updateProg();
        });

        const resetAll = document.createElement('button');
        resetAll.type = 'button';
        resetAll.className = 'gp-reset-all';
        resetAll.textContent = 'Сбросить прогресс по этой теме';
        resetAll.addEventListener('click', () => {
            states.forEach(s => {
                s.store = {};
                saveStore(s.ex.id, {});
                s.sec.querySelector('.gp-ex-prog').innerHTML = `Освоено <b>0</b> из ${unitsOf(s.ex)}`;
                s.sec.querySelector('.gp-ex-meter i').style.width = '0%';
            });
            updateBar();
        });
        root.appendChild(resetAll);
        updateBar();
    }

    window.GP = { mount, norm, parseGaps, tokenize };
})();
