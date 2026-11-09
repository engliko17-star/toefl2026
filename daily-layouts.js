// =====================================================================
// daily-layouts.js — как выглядят тексты Read in Daily Life.
//
// Один файл на три места: практика (read-daily-task.html), мини-моки
// (take-mock-test.html) и полные моки (reading-engine.js в tests.html).
// Раньше в каждом месте была своя копия отрисовки, и они расходились.
//
// Формат берётся из daily_life_tasks.layout_type:
//   email, chat, social_media, notice, sign, poster, advertisement, article,
//   receipt, label, form, webpage, schedule, instructions, syllabus, review,
//   menu, plain
//
// Текст в базе не переписываем: строки разбираются по виду и рисуются как
// настоящий документ. Что распознаётся в строке:
//   Ключ: значение        → строка «поле — значение» (чек, форма, этикетка)
//   Товар: $10.00 / ….. $4 → строка с ценой (итог — строка Total)
//   10:00 A.M. | Событие   → строка расписания
//   Monday – Friday, 9–5  → часы работы
//   Step 1: …             → шаг инструкции
//   • … / - …             → список
//   ☐ вариант / ____      → флажки и пустые поля формы
//   https://… / www.…     → адрес сайта
//   Имя (3:00 P.M.)       → реплика переписки
// Весь текст остаётся текстом: подсветка слов из вопросов работает как раньше.
// Название задания показываем только у своих (не официальных) текстов —
// у официальных в названии служебный номер и дата.
// =====================================================================
(function (global) {
    'use strict';

    // ---------------------------------------------------------------
    // Стили: свои классы dl-*, без Tailwind — одинаково на всех страницах
    // ---------------------------------------------------------------
    const CSS = `
.dl{container-type:inline-size;--ink:#1d2433;--muted:#5f6b7d;--faint:#8a94a6;--line:#e3e7ee;--soft:#f5f6f8;--acc:#33507a;--acc-soft:#eef2f8;
  font-size:15px;line-height:1.6;color:var(--ink);text-align:left;width:100%;overflow-wrap:break-word;word-break:normal}
.dl *{box-sizing:border-box}
.dl p{margin:0}
.dl .dl-doc>*+*{margin-top:.85em}
.dl .dl-gap{height:.15em}
.dl h3,.dl h4,.dl h5{margin:0;font-weight:700;color:var(--ink);line-height:1.3}
.dl .dl-sub{font-size:.9em;font-weight:700;color:var(--ink)}
.dl .dl-callout{font-weight:700}
.dl .dl-link{color:#1f5fbf;text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:2px;overflow-wrap:anywhere}
.dl .dl-lead{font-weight:600}
.dl ul.dl-list,.dl ol.dl-olist{margin-left:0;margin-right:0;margin-bottom:0;padding:0;list-style:none}
.dl ul.dl-list li{position:relative;padding-left:1.15em}
.dl ul.dl-list li+li,.dl ol.dl-olist li+li{margin-top:.3em}
.dl ul.dl-list li::before{content:"";position:absolute;left:.2em;top:.62em;width:.38em;height:.38em;border-radius:50%;background:var(--acc)}
.dl ol.dl-olist li{display:flex;gap:.55em}
.dl ol.dl-olist .dl-n{font-weight:700;color:var(--acc);min-width:1.2em}
.dl .dl-lettered{display:flex;gap:.55em}
.dl .dl-lettered b{min-width:1.1em}
.dl dl.dl-kv{margin-left:0;margin-right:0;margin-bottom:0;display:grid;grid-template-columns:minmax(0,max-content) minmax(0,1fr);column-gap:1em;row-gap:.3em}
.dl dl.dl-kv dt{color:var(--muted);font-weight:600}
.dl dl.dl-kv dd{margin:0}
.dl .dl-prices,.dl .dl-hours,.dl .dl-times{display:flex;flex-direction:column;gap:.3em}
.dl .dl-row{display:flex;align-items:baseline;gap:.6em}
.dl .dl-row .dl-l{flex:0 1 auto;min-width:0}
.dl .dl-row .dl-dots{flex:1 1 1.5em;border-bottom:1px dotted #b6bdc9;transform:translateY(-.3em);min-width:1em}
.dl .dl-row .dl-r{flex:0 0 auto;font-variant-numeric:tabular-nums;font-weight:600;white-space:nowrap}
.dl .dl-row.dl-total{font-weight:700;border-top:2px solid var(--ink);padding-top:.35em;margin-top:.2em}
.dl .dl-hours .dl-row .dl-l{font-weight:600}
.dl .dl-times{border-left:2px solid var(--line);padding-left:1em;margin-left:.2em}
.dl .dl-time{display:grid;grid-template-columns:var(--tw,7em) minmax(0,1fr);column-gap:1em}
.dl .dl-time .dl-t{font-weight:700;color:var(--acc);font-variant-numeric:tabular-nums;white-space:nowrap}
.dl .dl-checkgroup{display:flex;flex-direction:column;gap:.45em}
.dl .dl-checks{display:flex;flex-wrap:wrap;gap:.35em 1.1em;align-items:baseline}
.dl .dl-checks .dl-ck-label{font-weight:600;color:var(--muted);width:100%}
.dl .dl-checks.dl-inline .dl-ck-label{width:auto}
.dl .dl-ck{display:inline-flex;align-items:baseline;gap:.4em}
.dl .dl-box{display:inline-block;width:.85em;height:.85em;border:1.5px solid #6b7486;border-radius:2px;transform:translateY(.1em);flex:none}
.dl .dl-fields{display:flex;flex-wrap:wrap;gap:.5em 1.4em}
.dl .dl-field{display:flex;align-items:baseline;gap:.5em;flex:1 1 13em;min-width:0}
.dl .dl-field .dl-fl{color:var(--muted);font-weight:600;white-space:nowrap}
.dl .dl-field .dl-fl.dl-wrap{white-space:normal}
.dl .dl-blank{flex:1 1 4em;border-bottom:1.5px solid #9aa3b2;min-height:1.1em;min-width:3em}
.dl .dl-hashtags{color:#1f5fbf;font-weight:600}
.dl .dl-stars{color:#e0a100;letter-spacing:.12em;font-size:1.15em}
.dl .dl-doc>.dl-h,.dl .dl-h{font-size:1.02em;margin-top:1.1em}
.dl .dl-doc>.dl-h:first-child{margin-top:0}
.dl .dl-doc>.dl-h+*,.dl .dl-sec>.dl-sub+*{margin-top:.3em}
.dl .dl-sec>*+*{margin-top:.35em}

/* ---- общие рамки ---- */
.dl .dl-paper{background:#fff;border:1px solid var(--line);border-radius:12px;box-shadow:0 1px 2px rgba(16,24,40,.05);padding:1.5em 1.6em;max-width:620px;margin:0 auto}
.dl .dl-headline{font-size:1.35em;font-weight:800;letter-spacing:-.01em;line-height:1.25}

/* ---- email ---- */
.dl-email .dl-mail{max-width:620px;margin:0 auto;background:#fff;border:1px solid var(--line);border-radius:12px;overflow:hidden;box-shadow:0 1px 2px rgba(16,24,40,.05)}
.dl-email .dl-mailbar{display:flex;align-items:center;gap:.5em;padding:.55em 1.2em;background:var(--soft);border-bottom:1px solid var(--line);color:var(--faint)}
.dl-email .dl-mailbar svg{width:1.1em;height:1.1em}
.dl-email .dl-mailhead{padding:.9em 1.2em;border-bottom:1px solid var(--line);display:grid;grid-template-columns:max-content minmax(0,1fr);column-gap:.9em;row-gap:.2em;font-size:.93em}
.dl-email .dl-mailhead dt{color:var(--faint);font-weight:600}
.dl-email .dl-mailhead dd{margin:0;color:var(--ink);overflow-wrap:anywhere}
.dl-email .dl-mailhead dd.dl-subj{font-weight:700}
.dl-email .dl-doc{padding:1.2em}

/* ---- chat ---- */
.dl-chat .dl-phone{max-width:420px;margin:0 auto;background:#eef1f5;border:1px solid #d7dce4;border-radius:26px;overflow:hidden;box-shadow:0 1px 3px rgba(16,24,40,.08)}
.dl-chat .dl-phonebar{background:#fff;border-bottom:1px solid #e3e7ee;padding:.7em 1em;display:flex;align-items:center;gap:.6em;color:var(--muted)}
.dl-chat .dl-phonebar svg{width:1.1em;height:1.1em;flex:none}
.dl-chat .dl-faces{display:flex}
.dl-chat .dl-faces .dl-av{width:1.75em;height:1.75em;font-size:.72em;border:2px solid #fff;margin-left:-.45em}
.dl-chat .dl-faces .dl-av:first-child{margin-left:0}
.dl-chat .dl-who{font-size:.82em;color:var(--muted);font-weight:600;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dl-chat .dl-msgs{padding:1em .9em 1.2em;display:flex;flex-direction:column;gap:.7em}
.dl-chat .dl-msg{display:flex;gap:.55em;align-items:flex-start}
.dl-chat .dl-msg.dl-cont{margin-top:-.3em}
.dl-chat .dl-msg.dl-cont .dl-av{visibility:hidden}
.dl-av{flex:none;width:2.1em;height:2.1em;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:.78em;color:#fff;letter-spacing:.02em}
.dl-chat .dl-bwrap{min-width:0;max-width:86%}
.dl-chat .dl-meta{font-size:.78em;color:var(--muted);margin:0 0 .15em .2em}
.dl-chat .dl-meta b{color:var(--ink);font-weight:700;margin-right:.15em}
.dl-chat .dl-bubble{background:#fff;border-radius:4px 16px 16px 16px;padding:.55em .85em;box-shadow:0 1px 1px rgba(16,24,40,.06)}
.dl-chat .dl-sys{text-align:center;font-size:.8em;color:var(--muted)}

/* ---- пост в соцсети: телефон, как в примерах ETS ---- */
.dl-social .dl-device{max-width:400px;margin:0 auto;background:#1e2430;border-radius:34px;padding:10px;box-shadow:0 2px 6px rgba(16,24,40,.15)}
.dl-social .dl-screen{background:#fff;border-radius:26px;overflow:hidden}
.dl-social .dl-notch{height:22px;display:flex;justify-content:center;align-items:center;background:#fff}
.dl-social .dl-notch span{width:72px;height:6px;border-radius:6px;background:#d5d9e0}
.dl-social .dl-post{padding:.4em 1.1em 0}
.dl-social .dl-author{display:flex;align-items:center;gap:.6em;margin-bottom:.8em}
.dl-social .dl-author .dl-av{width:2.4em;height:2.4em;font-size:.8em}
.dl-social .dl-author b{font-weight:700;line-height:1.25}
.dl-social .dl-author .dl-anon{width:2.4em;height:2.4em;border-radius:50%;background:#e6e9ef}
.dl-social .dl-actions{display:flex;justify-content:space-around;border-top:1px solid var(--line);margin-top:1em;padding:.6em 0 .8em;color:var(--muted);font-size:.85em}
.dl-social .dl-actions span{display:inline-flex;align-items:center;gap:.35em}
.dl-social .dl-actions svg{width:1.1em;height:1.1em}

/* ---- объявление: рамка как на доске объявлений ---- */
.dl-notice .dl-board{max-width:600px;margin:0 auto;background:#fff;border:2px solid #2a3240;padding:5px}
.dl-notice .dl-board-in{border:1px solid #c9ced8;padding:1.4em 1.5em}
.dl-notice .dl-headline{text-align:center;text-transform:none;margin-bottom:.9em}

/* ---- табличка ---- */
.dl-sign .dl-plate{max-width:560px;margin:0 auto;border:3px solid #263142;border-radius:16px;overflow:hidden;background:#fff}
.dl-sign .dl-plate-top{background:#263142;color:#fff;padding:.9em 1.2em;text-align:center}
.dl-sign .dl-plate-top .dl-headline{color:#fff;font-size:1.3em}
.dl-sign .dl-doc{padding:1.2em 1.4em}
.dl-sign .dl-hours{background:var(--soft);border-radius:10px;padding:.7em .9em}

/* ---- афиша ---- */
.dl-poster .dl-sheet{max-width:560px;margin:0 auto;background:#fff;border:1px solid var(--line);border-radius:14px;overflow:hidden;box-shadow:0 2px 6px rgba(16,24,40,.07)}
.dl-poster .dl-hero{background:var(--acc);color:#fff;padding:1.4em 1.5em 1.3em}
.dl-poster .dl-hero .dl-headline{color:#fff;font-size:1.55em}
.dl-poster .dl-hero .dl-kicker{opacity:.85;margin-top:.35em}
.dl-poster .dl-doc{padding:1.2em 1.5em 1.4em}
.dl-poster dl.dl-kv{background:var(--acc-soft);border-radius:10px;padding:.7em .9em}
.dl-poster dl.dl-kv dt{color:var(--acc)}
.dl .dl-cta{font-weight:700;color:var(--acc)}

/* ---- реклама ---- */
.dl-ad .dl-card{max-width:560px;margin:0 auto;background:#fff;border:1px solid var(--line);border-top:5px solid var(--acc);border-radius:12px;padding:1.3em 1.5em 1.4em;position:relative;box-shadow:0 1px 3px rgba(16,24,40,.06)}
.dl-ad .dl-adtag{position:absolute;top:.9em;right:1em;font-size:.68em;font-weight:700;letter-spacing:.06em;color:var(--muted);border:1px solid var(--line);border-radius:6px;padding:.1em .45em;background:#fff}
.dl-ad .dl-headline{color:var(--acc);padding-right:2.5em;margin-bottom:.5em}

/* ---- статья ---- */
.dl-article .dl-paper{font-family:Georgia,"Times New Roman",serif;border-radius:4px;padding:1.6em 1.8em}
.dl-article .dl-masthead{font-family:inherit;font-size:.78em;font-weight:700;letter-spacing:.08em;color:var(--muted);border-bottom:1px solid var(--ink);padding-bottom:.4em;margin-bottom:.8em}
.dl-article .dl-headline{font-size:1.55em;font-weight:700;line-height:1.2;letter-spacing:0}
.dl-article .dl-byline{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:.8em;color:var(--muted);font-weight:600}
.dl-article .dl-rule{border:0;border-top:3px double var(--ink);margin:.9em 0}
.dl-article .dl-doc{font-size:1.02em;line-height:1.7}

/* ---- чек ---- */
.dl-receipt .dl-slip{max-width:360px;margin:0 auto;background:#fffefa;border:1px solid #e6e1d4;border-bottom:0;padding:1.4em 1.3em 1.6em;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;font-size:.88em;line-height:1.55;position:relative;box-shadow:0 1px 3px rgba(16,24,40,.06)}
.dl-receipt .dl-slip::after{content:"";position:absolute;left:-1px;right:-1px;bottom:-9px;height:10px;background:linear-gradient(-45deg,transparent 6px,#fffefa 0) 0 0/12px 10px repeat-x,linear-gradient(45deg,transparent 6px,#fffefa 0) 0 0/12px 10px repeat-x}
.dl-receipt .dl-shop{text-align:center;font-weight:700;padding-bottom:.8em;border-bottom:1px dashed #a9a28f;margin-bottom:.8em}
.dl-receipt .dl .dl-doc>*+*,.dl-receipt .dl-doc>*+*{margin-top:.7em}
.dl-receipt dl.dl-kv dt{color:inherit;font-weight:400}
.dl-receipt .dl-sub{border-bottom:1px dashed #a9a28f;padding-bottom:.3em}
.dl-receipt .dl-row .dl-r{font-weight:400}
.dl-receipt .dl-row.dl-total .dl-r{font-weight:700}
.dl-receipt .dl-doc>p:last-child{text-align:center;color:var(--muted);border-top:1px dashed #a9a28f;padding-top:.8em}

/* ---- этикетка ---- */
.dl-label .dl-tag{max-width:420px;margin:0 auto;background:#fbf8f1;border:2px solid #2b2b2b;border-radius:14px;padding:1.2em 1.3em 1.3em}
.dl-label .dl-product{font-size:1.35em;font-weight:800;line-height:1.2}
.dl-label .dl-sec{border:2px solid #111;background:#fff;padding:.5em .7em .6em;border-radius:2px}
.dl-label .dl-sec .dl-sub{font-size:1em;font-weight:800;border-bottom:6px solid #111;padding-bottom:.2em;margin-bottom:.3em}
.dl-label .dl-sec dl.dl-kv{row-gap:0;column-gap:0}
.dl-label .dl-sec dl.dl-kv dt{padding-right:1em}
.dl-label .dl-sec dl.dl-kv dt,.dl-label .dl-sec dl.dl-kv dd{border-bottom:1px solid #111;padding:.15em 0}
.dl-label .dl-sec dl.dl-kv dt{color:#111}
.dl-label .dl-sec dl.dl-kv dd{text-align:right;font-weight:700}

/* ---- форма ---- */
.dl-form .dl-sheet{max-width:620px;margin:0 auto;background:#fff;border:1px solid #cfd5df;border-radius:6px;overflow:hidden;box-shadow:0 1px 2px rgba(16,24,40,.05)}
.dl-form .dl-formhead{background:#eef2f7;border-bottom:1px solid #cfd5df;padding:.85em 1.3em}
.dl-form .dl-formhead .dl-headline{font-size:1.12em}
.dl-form .dl-formhead .dl-kicker{font-size:.85em;color:var(--muted);font-weight:600}
.dl-form .dl-doc{padding:1.1em 1.3em 1.3em}
.dl-form dl.dl-kv{grid-template-columns:minmax(0,max-content) minmax(0,1fr);row-gap:.55em}
.dl-form dl.dl-kv dd{border-bottom:1.5px solid #9aa3b2;color:#1d4ed8;font-weight:500;min-height:1.5em;padding-left:.2em}

/* ---- сайт ---- */
.dl-web .dl-browser{max-width:640px;margin:0 auto;background:#fff;border:1px solid #d3d8e0;border-radius:10px;overflow:hidden;box-shadow:0 1px 3px rgba(16,24,40,.07)}
.dl-web .dl-chrome{background:#eef0f3;border-bottom:1px solid #d3d8e0;padding:.5em .8em;display:flex;align-items:center;gap:.7em}
.dl-web .dl-dots{display:flex;gap:.35em;flex:none}
.dl-web .dl-dots i{width:.62em;height:.62em;border-radius:50%;background:#c4c9d2;display:block}
.dl-web .dl-url{flex:1;min-width:0;background:#fff;border:1px solid #d3d8e0;border-radius:999px;padding:.15em .8em;font-size:.82em;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dl-web .dl-page{padding:1.3em 1.5em 1.5em}
.dl-web .dl-headline{font-size:1.4em;margin-bottom:.4em}

/* ---- расписание ---- */
.dl-schedule .dl-paper .dl-headline{margin-bottom:.2em}

/* ---- инструкция ---- */
.dl-steps{margin-left:0;margin-right:0;margin-bottom:0;padding:0;list-style:none}
.dl-steps li{display:grid;grid-template-columns:auto minmax(0,1fr);column-gap:.8em;position:relative;padding-bottom:.75em}
.dl-steps li:last-child{padding-bottom:0}
.dl-steps li::after{content:"";position:absolute;left:1.05em;top:2.1em;bottom:.15em;border-left:2px solid var(--line)}
.dl-steps li:last-child::after{display:none}
.dl-steps .dl-stepno{min-width:2.1em;height:2.1em;padding:0 .45em;border-radius:999px;background:var(--acc);color:#fff;font-weight:700;font-size:.78em;display:inline-flex;align-items:center;justify-content:center;white-space:nowrap;margin-top:.05em}
.dl-steps .dl-stepno.dl-word{border-radius:8px}

/* ---- описание курса ---- */
.dl-syllabus .dl-coursehead{border-bottom:2px solid var(--ink);padding-bottom:.8em;margin-bottom:1em}
.dl-syllabus .dl-kicker{font-size:.85em;color:var(--muted);font-weight:600}
.dl-syllabus .dl-code{display:inline-block;background:var(--acc);color:#fff;font-weight:700;font-size:.8em;border-radius:6px;padding:.1em .55em;margin:.35em 0 .3em;letter-spacing:.02em}
.dl-syllabus dl.dl-kv{grid-template-columns:minmax(0,1fr);row-gap:.1em}
.dl-syllabus dl.dl-kv dt{font-size:.85em;margin-top:.8em}
.dl-syllabus dl.dl-kv dt:first-child{margin-top:0}

/* ---- отзыв ---- */
.dl-review .dl-kicker{font-size:.82em;color:var(--muted);font-weight:700}
.dl-review .dl-byline{font-size:.85em;color:var(--muted)}
.dl-review .dl-revhead{border-bottom:1px solid var(--line);padding-bottom:.8em;margin-bottom:1em}

/* ---- меню ---- */
.dl-menu .dl-card{max-width:440px;margin:0 auto;background:#fffdf7;border:1px solid #e7dfcc;border-radius:12px;padding:1.4em 1.5em;box-shadow:0 1px 3px rgba(16,24,40,.06)}
.dl-menu .dl-headline{text-align:center;font-family:Georgia,"Times New Roman",serif;font-weight:700}
.dl-menu .dl-when{text-align:center;color:var(--muted);font-size:.9em;margin-top:.2em}
.dl-menu .dl-prices{border-top:1px solid #e7dfcc;border-bottom:1px solid #e7dfcc;padding:.8em 0}

/* узкая колонка с текстом (телефон или половина экрана) */
@container (max-width:520px){
  .dl .dl-paper,.dl-notice .dl-board-in,.dl-web .dl-page,.dl-poster .dl-doc,.dl-sign .dl-doc{padding-left:1.05em;padding-right:1.05em}
  .dl dl.dl-kv{grid-template-columns:minmax(0,1fr);row-gap:0}
  .dl dl.dl-kv dd{margin-bottom:.35em}
  .dl-form dl.dl-kv dd{margin-bottom:.5em}
  .dl-label .dl-sec dl.dl-kv{grid-template-columns:minmax(0,1fr) auto}
  .dl-label .dl-sec dl.dl-kv dd{margin-bottom:0}
  .dl .dl-time{grid-template-columns:minmax(0,1fr);row-gap:0}
  .dl .dl-time+.dl-time{margin-top:.35em}
  .dl.dl-receipt dl.dl-kv{grid-template-columns:minmax(0,max-content) minmax(0,1fr);column-gap:.8em}
  .dl.dl-receipt dl.dl-kv dd{margin-bottom:0}
}
@media (max-width:640px){
  .dl{font-size:14.5px}
}
`;
    function injectCss() {
        if (typeof document === 'undefined' || document.getElementById('daily-layouts-css')) return;
        const st = document.createElement('style');
        st.id = 'daily-layouts-css';
        st.textContent = CSS;
        (document.head || document.documentElement).appendChild(st);
    }

    // ---------------------------------------------------------------
    // Текст
    // ---------------------------------------------------------------
    const esc = s => String(s === null || s === undefined ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const URL_RE = /\b((?:https?:\/\/|www\.)[^\s<>()]+[^\s<>().,;:!?'"])/gi;
    const MAIL_RE = /\b([\w.+-]+@[\w-]+(?:\.[\w-]+)+)\b/g;
    // Строка в HTML: экранируем, адреса сайтов и почты — как ссылки (без перехода)
    function inline(s) {
        return esc(s)
            .replace(URL_RE, '<span class="dl-link">$1</span>')
            .replace(MAIL_RE, (m, a, off, all) => (/class="dl-link">[^<]*$/.test(all.slice(0, off)) ? m : `<span class="dl-link">${a}</span>`));
    }

    // Текст из базы → строки. <p>, <br> и случайные HTML-теги убираем,
    // строки, разорванные при копировании из PDF, склеиваем обратно.
    function normalize(raw) {
        let s = String(raw || '').replace(/\r\n?/g, '\n').replace(/[\u200b\u200c\u200d\ufeff]/g, '').replace(/[\[\]]/g, '');
        if (/<\/?p\b|<br\s*\/?>/i.test(s)) {
            // в таких текстах абзац — это <p>, а перевод строки — просто перенос
            s = s.replace(/\n/g, ' ').replace(/<br\s*\/?>/gi, '\n').replace(/<\/?p\b[^>]*>/gi, '\n\n');
        }
        s = s.replace(/<\/?[a-z][^>]*>/gi, '')
            .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'");
        const lines = s.split('\n').map(l => l.replace(/[ \t\u00a0]+/g, ' ').trim());
        const out = [];
        for (const l of lines) {
            const prev = out.length ? out[out.length - 1] : '';
            // перенос посреди предложения: следующая строка с маленькой буквы
            if (l && prev && /^[a-z]/.test(l) && !/[.!?:;)]$/.test(prev) && prev.length > 25 && !isSpeakerHead(prev)) {
                out[out.length - 1] = prev + ' ' + l;
                continue;
            }
            if (!l && (!out.length || out[out.length - 1] === '')) continue; // пустые строки подряд
            out.push(l);
        }
        while (out.length && out[out.length - 1] === '') out.pop();
        return out;
    }
    const blocksOf = lines => {
        const res = [[]];
        lines.forEach(l => { if (l === '') { if (res[res.length - 1].length) res.push([]); } else res[res.length - 1].push(l); });
        return res.filter(b => b.length);
    };

    // ---------------------------------------------------------------
    // Что за строка
    // ---------------------------------------------------------------
    const T = '\\d{1,2}(?::\\d{2})?\\s*(?:[AaPp]\\.?\\s?[Mm]\\.?)?';
    const RANGE_RE = new RegExp('^(' + T + '(?:\\s*(?:[–—-]|to)\\s*' + T + ')?)\\s*(?:\\||:(?!\\d)|[–—-](?=\\s))?\\s*(.*)$');
    const isRealTime = t => /\d:\d{2}|\d\s*[AaPp]\.?\s?[Mm]\b|\d\s*[AaPp]\.[Mm]\./.test(t);
    const DAY = '(?:mon|tue|wed|thu|fri|sat|sun)[a-z]*\\.?';
    const HOURS_RE = new RegExp('^((?:open\\s+)?' + DAY + '(?:\\s*(?:–|—|-|to|through|and|&|,)\\s*' + DAY + ')*)\\s*[:,]?\\s+((?:\\d|closed|noon|midnight).*)$', 'i');
    const PRICE_RE = /^(.*?\S)(?:\s*(?:\.{2,}|…+)\s*|\s*:\s*|\s+)([-+−]?\s?(?:[$€£₦¥₹]\s?\d[\d,]*(?:\.\d{1,2})?|\d[\d,]*(?:\.\d{1,2})?\s?(?:[€£$]|USD|EUR|GBP)))\s*$/;
    const KV_RE = /^([A-Z0-9][^:]{0,44}?)\s*:\s*(.*)$/;
    const BOX_RE = /[☐□☑☒✓✔■◻]/;
    const TIME_G = new RegExp(T, 'g');
    // справа от дней — только время («9:00 A.M. – 8:00 P.M.», «Closed»), а не предложение
    const isHoursVal = v => v.length <= 48 && v.replace(TIME_G, '').replace(/\b(to|and|closed|noon|midnight|from|until)\b/gi, '').replace(/[\s–—\-,.:;|&]/g, '').length <= 3;
    function isSpeakerHead(l) { return /^[^()\n:]{1,40}\(\s*\d{1,2}[:.]\d{2}[^)]*\)\s*:?\s*$/.test(l); }

    function kvKeyOk(k) {
        if (!k || k.length > 44) return false;
        if (/[,;!?]/.test(k)) return false;
        if (k.split(/\s+/).length > 6) return false;
        if (/\.\s+[A-Z]/.test(k)) return false;   // «Sentence one. Two» — это не ключ
        return true;
    }
    function lineKind(l, ctx) {
        let m;
        if (/^[★☆✩✪⭐]{3,}\s*$/.test(l)) return { k: 'stars', t: l };
        if (/^(https?:\/\/|www\.)\S+$/i.test(l)) return { k: 'url', t: l };
        if (/^(#[\w-]+\s*)+$/.test(l)) return { k: 'tags', t: l };
        if ((m = l.match(/^(Step\s*\d+)\s*[:.)\-–]\s*(.+)$/i))) return { k: 'step', n: m[1], t: m[2] };
        if ((m = l.match(/^[•●▪◦‣·*]\s*(.+)$/)) || (m = l.match(/^[-–]\s+(.+)$/))) return { k: 'bullet', t: m[1] };
        if ((m = l.match(/^([A-H])[.)]\s+(.+)$/))) return { k: 'letter', n: m[1], t: m[2] };
        if ((m = l.match(/^(\d{1,2})[.)]\s+(.+)$/))) return { k: 'num', n: m[1], t: m[2] };
        if (BOX_RE.test(l)) return checkKind(l);
        if (/_{3,}/.test(l)) return blankKind(l);
        // часы работы, в том числе «Сб: … | Вс: …» в одной строке
        const parts = l.split(/\s+\|\s+/);
        if (parts.every(p => { const h = p.match(HOURS_RE); return h && isHoursVal(h[2]); })) return { k: 'hours', rows: parts.map(p => { const h = p.match(HOURS_RE); return [h[1], h[2]]; }) };
        if (ctx && ctx.phases && (m = l.match(/^((?:Phase|Week|Day|Session|Part|Stage)\s+\d+(?:\s*\([^)]*\))?)\s*[:.–—-]\s*(.+)$/i))) return { k: 'time', t: m[1], text: m[2] };
        if (/^\d/.test(l) && (m = l.match(RANGE_RE)) && m[2] && isRealTime(m[1])) return { k: 'time', t: m[1].trim(), text: m[2] };
        if ((m = l.match(PRICE_RE)) && m[1].length <= 70) return { k: 'price', l: m[1].replace(/\s*[:.…]+$/, ''), r: m[2].replace(/\s+/g, ' ') };
        if ((m = l.match(KV_RE)) && kvKeyOk(m[1]) && !/^\d{1,2}$/.test(m[1])) return { k: 'kv', key: m[1], val: m[2] };
        return { k: 'text', t: l };
    }
    function checkKind(l) {
        const first = l.search(BOX_RE);
        const label = l.slice(0, first).trim().replace(/:$/, '');
        const opts = l.slice(first).split(BOX_RE).map(s => s.trim()).filter(Boolean);
        return { k: 'check', label: label, opts: opts };
    }
    function blankKind(l) {
        const fields = [];
        const re = /([^_]*?)\s*_{3,}/g;
        let m, last = 0;
        while ((m = re.exec(l))) { fields.push((m[1] || '').trim().replace(/:$/, '')); last = re.lastIndex; }
        const tail = l.slice(last).trim();
        return { k: 'blanks', fields: fields, tail: tail };
    }

    // Строка-заголовок: короткая, без точки в конце
    function headingish(t) {
        if (!t || t.length > 80) return false;
        if (/[.,;]$/.test(t)) return false;
        if (/^(hi|hello|hey|dear|thanks|thank you|best|regards|kind regards|sincerely|cheers|warmly|yours)\b/i.test(t)) return false;
        return t.split(/\s+/).length <= 13;
    }
    const isCaps = t => { const L = t.replace(/[^A-Za-z]/g, ''); return L.length >= 4 && L === L.toUpperCase(); };

    // ---------------------------------------------------------------
    // Тело документа: блоки → HTML
    // ---------------------------------------------------------------
    // Как показать «Ключ: значение»: строкой таблицы, абзацем с выделенным началом
    // (если значение — предложение) или подзаголовком раздела (если значения нет)
    function kvMode(x, o, next) {
        if (o.kvAsText) return 'lead';
        if (!x.val) return o.form && !(next && next.k === 'text') ? 'kv' : 'subhead';
        if (o.kvLong) return 'kv';
        if (x.val.length > 90 || (/[.!?]$/.test(x.val) && x.val.split(/\s+/).length >= 8)) return 'lead';
        return 'kv';
    }
    const kindOf = (items, i, o) => (items[i].k === 'kv' ? kvMode(items[i], o, items[i + 1]) : items[i].k);

    function renderBody(lines, o) {
        o = o || {};
        return blocksOf(lines).map((block, bi) => renderItems(block.map(l => lineKind(l, o)), o, bi === 0, block.length)).join('');
    }
    function renderItems(items, o, firstBlock, blockLen) {
        const parts = [];
        let i = 0;
        while (i < items.length) {
            const kind = kindOf(items, i, o);
            if (kind === 'subhead') {
                // подзаголовок («Items Purchased:», «PER SERVING:») и всё, что под ним в этом блоке, — одна секция
                let j = i + 1;
                while (j < items.length && items[j].k !== 'text' && kindOf(items, j, o) !== 'subhead') j++;
                const inner = items.slice(i + 1, j);
                const head = `<h5 class="dl-sub">${inline(items[i].key)}:</h5>`;
                parts.push(inner.length ? `<section class="dl-sec">${head}${renderItems(inner, o, false, inner.length)}</section>` : head);
                i = j;
                continue;
            }
            let j = i + 1;
            while (j < items.length && kindOf(items, j, o) === kind) j++;
            parts.push(group(items.slice(i, j), o, kind, firstBlock && i === 0, blockLen));
            i = j;
        }
        return parts.join('');
    }

    function group(items, o, kind, isFirst, blockLen) {
        if (!items.length) return '';
        kind = kind || items[0].k;
        switch (kind) {
            case 'bullet': return `<ul class="dl-list">${items.map(x => `<li>${inline(x.t)}</li>`).join('')}</ul>`;
            case 'num': return `<ol class="dl-olist">${items.map(x => `<li><span class="dl-n">${esc(x.n)}.</span><span>${inline(x.t)}</span></li>`).join('')}</ol>`;
            case 'letter': return items.map(x => `<p class="dl-lettered"><b>${esc(x.n)}.</b><span>${inline(x.t)}</span></p>`).join('');
            case 'step': return `<ol class="dl-steps">${items.map(x => `<li><span class="dl-stepno dl-word">${esc(x.n)}</span><span>${inline(x.t)}</span></li>`).join('')}</ol>`;
            case 'kv': return `<dl class="dl-kv">${items.map(x => `<dt>${inline(x.key)}:</dt><dd>${inline(x.val)}</dd>`).join('')}</dl>`;
            case 'lead': return items.map(x => `<p><span class="dl-lead">${inline(x.key)}:</span> ${inline(x.val)}</p>`).join('');
            case 'price': return `<div class="dl-prices">${items.map(x => `<div class="dl-row${/^(grand\s+)?total|amount due|balance due/i.test(x.l) ? ' dl-total' : ''}"><span class="dl-l">${inline(x.l)}</span><span class="dl-dots"></span><span class="dl-r">${esc(x.r)}</span></div>`).join('')}</div>`;
            case 'hours': return `<div class="dl-hours">${items.map(x => x.rows.map(r => `<div class="dl-row"><span class="dl-l">${inline(r[0])}</span><span class="dl-dots"></span><span class="dl-r">${inline(r[1])}</span></div>`).join('')).join('')}</div>`;
            case 'time': return `<div class="dl-times" style="--tw:${Math.min(11.5, Math.max(4.5, Math.max.apply(null, items.map(x => x.t.length)) * 0.6)).toFixed(1)}em">${items.map(x => `<div class="dl-time"><span class="dl-t">${esc(x.t)}</span><span>${inline(x.text)}</span></div>`).join('')}</div>`;
            case 'check': return `<div class="dl-checkgroup">` + items.map(x => `<div class="dl-checks${x.label && x.opts.join('').length < 60 ? ' dl-inline' : ''}">${x.label ? `<span class="dl-ck-label">${inline(x.label)}:</span>` : ''}${x.opts.map(op => `<span class="dl-ck"><span class="dl-box"></span><span>${inline(op)}</span></span>`).join('')}</div>`).join('') + '</div>';
            case 'blanks': return items.map(x => `<div class="dl-fields">${x.fields.map(f => `<div class="dl-field">${f ? `<span class="dl-fl${f.length > 30 ? ' dl-wrap' : ''}">${inline(f)}${/[?:]$/.test(f) ? '' : ':'}</span>` : ''}<span class="dl-blank"></span></div>`).join('')}${x.tail ? `<span>${inline(x.tail)}</span>` : ''}</div>`).join('');
            case 'url': return items.map(x => `<p><span class="dl-link">${esc(x.t)}</span></p>`).join('');
            case 'tags': return items.map(x => `<p class="dl-hashtags">${esc(x.t)}</p>`).join('');
            case 'stars': return items.map(x => `<p class="dl-stars" aria-label="rating">${esc(x.t)}</p>`).join('');
            default: return textGroup(items.map(x => x.t), o, isFirst, blockLen);
        }
    }

    // Обычные строки: заголовок блока, выделенная фраза, абзац
    function textGroup(ts, o, isFirst, blockLen) {
        const out = [];
        let buf = [];
        const flush = () => { if (buf.length) { out.push(`<p>${buf.map(inline).join('<br>')}</p>`); buf = []; } };
        ts.forEach((t, idx) => {
            const head = o.headings !== false && headingish(t) && !/[!]$/.test(t) &&
                (isCaps(t) || /[:?]$/.test(t) || (idx === 0 && (ts.length > 1 || blockLen > 1)));
            if (head) { flush(); out.push(`<h4 class="dl-h">${inline(t)}</h4>`); return; }
            if (o.cta && isCta(t)) { flush(); out.push(`<p class="dl-cta">${inline(t)}</p>`); return; }
            if (o.headings !== false && /!$/.test(t) && t.length <= 45 && !/[.?!]\s/.test(t)) { flush(); out.push(`<p class="dl-callout">${inline(t)}</p>`); return; }
            if (o.lines === 'p') { flush(); out.push(`<p>${inline(t)}</p>`); return; }
            buf.push(t);
        });
        flush();
        return out.join('');
    }
    const isCta = t => /^(book|call|visit|register|apply|order|sign up|rsvp|reserve|enroll|contact|email|learn more|buy|shop|download|subscribe|get (your|started|tickets))\b/i.test(t) || /(https?:\/\/|www\.)\S+/i.test(t) && t.length < 90;

    // Первая строка как заголовок документа
    function takeHeadline(lines, title) {
        const first = lines[0] || '';
        const k = lineKind(first, {});
        const alone = lines[1] === undefined || lines[1] === '';
        if (first && ((k.k === 'text' && (headingish(first) || (/!$/.test(first) && first.length <= 90))) || (k.k === 'kv' && alone && first.length <= 90 && !/[.]$/.test(first)))) {
            const rest = lines.slice(1);
            while (rest.length && rest[0] === '') rest.shift();
            return { head: first, rest: rest };
        }
        return { head: title || '', rest: lines };
    }

    // Подзаголовок сразу под заголовком (вторая короткая строка того же блока)
    function takeKicker(rest) {
        const s = rest[0] || '';
        if (s && rest[1] !== undefined && lineKind(s, {}).k === 'text' && s.length <= 110 && !/^(join|please|we|our|this|the\s)/i.test(s) && (rest[1] === '' )) {
            return { kicker: s, rest: rest.slice(2) };
        }
        return { kicker: '', rest: rest };
    }

    // Цвет афиши/рекламы — по тексту, чтобы у одного задания он всегда был один
    const ACCENTS = [['#1f5f8b', '#e8f1f8'], ['#7a3e8f', '#f3ecf6'], ['#1d7a5c', '#e7f4ee'], ['#b4532a', '#fbeee7'], ['#3d4fa6', '#ebeefa'], ['#a12d4f', '#f8e9ee']];
    function accentFor(text) {
        let h = 0;
        for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
        const a = ACCENTS[h % ACCENTS.length];
        return `--acc:${a[0]};--acc-soft:${a[1]}`;
    }
    const AV = ['#3b6ea8', '#a0527a', '#2f8a6a', '#b06a2c', '#6a55b0', '#3e8a99', '#9a4b3d'];
    function initials(name) {
        const w = String(name).replace(/\(.*?\)/g, '').replace(/[^A-Za-zÀ-ÿ' -]/g, ' ').trim().split(/\s+/).filter(Boolean);
        return ((w[0] || '?')[0] + (w.length > 1 ? w[w.length - 1][0] : '')).toUpperCase();
    }
    const ICON = {
        mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
        like: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10v11H4V10zM7 10l4-7a2 2 0 0 1 3 2l-1 5h6a2 2 0 0 1 2 2.3l-1.4 7A2 2 0 0 1 17.6 21H7"/></svg>',
        comment: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1.2-4.6A8 8 0 1 1 21 12z"/></svg>',
        share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v13"/></svg>'
    };

    // ---------------------------------------------------------------
    // Форматы
    // ---------------------------------------------------------------
    const L = {};

    L.email = (lines, title) => {
        const meta = {};
        const order = [];
        let i = 0;
        for (; i < lines.length; i++) {
            const m = lines[i].match(/^(To|From|Date|Sent|Subject|Cc|Re)\s*:\s*(.*)$/i);
            if (m) { const k = m[1].toLowerCase(); if (!(k in meta)) order.push(k); meta[k] = m[2]; continue; }
            if (lines[i] === '' && order.length) continue;
            break;
        }
        if (!meta.subject && title) { meta.subject = title; order.push('subject'); }
        const label = { to: 'To', from: 'From', date: 'Date', sent: 'Sent', subject: 'Subject', cc: 'Cc', re: 'Re' };
        const head = order.length ? `<dl class="dl-mailhead">${order.map(k => `<dt>${label[k]}:</dt><dd${k === 'subject' ? ' class="dl-subj"' : ''}>${inline(meta[k])}</dd>`).join('')}</dl>` : '';
        return `<div class="dl-mail">${head || `<div class="dl-mailbar">${ICON.mail}</div>`}<div class="dl-doc">${renderBody(lines.slice(i), { headings: false, kvAsText: true })}</div></div>`;
    };

    L.chat = lines => {
        const heads = lines.filter(isSpeakerHead).length;
        const modeB = heads >= 2;               // «Имя (время)» отдельной строкой, текст ниже
        const msgs = [];
        let cur = null;
        lines.forEach(l => {
            if (!l) { cur = null; return; }
            let m;
            if (modeB && isSpeakerHead(l)) {
                m = l.match(/^(.*?)\s*\(([^)]*)\)\s*:?\s*$/);
                cur = { name: m[1].trim(), time: m[2].trim(), text: [] }; msgs.push(cur); return;
            }
            if (!modeB && (m = l.match(/^([^:()]{1,40}?)\s*(?:\(([^)]*)\))?\s*:\s+(.+)$/)) && m[1].split(/\s+/).length <= 4) {
                cur = { name: m[1].trim(), time: (m[2] || '').trim(), text: [m[3]] }; msgs.push(cur); cur = modeB ? cur : null; return;
            }
            if (cur) { cur.text.push(l); return; }
            msgs.push({ sys: l });
        });
        const people = [];
        msgs.forEach(x => { if (x.name && !people.includes(x.name)) people.push(x.name); });
        const color = n => AV[people.indexOf(n) % AV.length];
        let prev = null;
        const body = msgs.map(x => {
            if (x.sys) { prev = null; return `<p class="dl-sys">${inline(x.sys)}</p>`; }
            const cont = prev === x.name;
            prev = x.name;
            return `<div class="dl-msg${cont ? ' dl-cont' : ''}"><span class="dl-av" style="background:${color(x.name)}">${esc(initials(x.name))}</span><div class="dl-bwrap"><div class="dl-meta"><b>${inline(x.name)}</b> ${x.time ? `<span>${esc(x.time)}</span>` : ''}</div><div class="dl-bubble">${x.text.map(inline).join('<br>')}</div></div></div>`;
        }).join('');
        return `<div class="dl-phone"><div class="dl-phonebar">${ICON.comment}<span class="dl-who">${esc(people.map(n => n.split(/\s+/)[0]).join(', '))}</span></div><div class="dl-msgs">${body}</div></div>`;
    };

    L.social_media = (lines, title) => {
        let author = '', rest = lines;
        const f = lines[0] || '';
        if (f && f.length <= 60 && !/[.!?:;]$/.test(f) && !/^(hi|hello|hey|join|come|don'?t|we|our|this|the)\b/i.test(f) && (lines[1] === '' || /^post by/i.test(f)) && lineKind(f, {}).k === 'text') {
            author = f; rest = lines.slice(1); while (rest.length && rest[0] === '') rest.shift();
        } else if (title) author = title;
        const who = author ? `<span class="dl-av" style="background:${AV[(author.length * 7) % AV.length]}">${esc(initials(author.replace(/^post by\s+/i, '')))}</span><b>${inline(author)}</b>` : '<span class="dl-anon"></span>';
        return `<div class="dl-device"><div class="dl-screen"><div class="dl-notch"><span></span></div><div class="dl-post"><div class="dl-author">${who}</div><div class="dl-doc">${renderBody(rest, { cta: false })}</div><div class="dl-actions"><span>${ICON.like}Like</span><span>${ICON.comment}Comment</span><span>${ICON.share}Share</span></div></div></div></div>`;
    };

    L.notice = (lines, title) => {
        const h = takeHeadline(lines, title);
        return `<div class="dl-board"><div class="dl-board-in">${h.head ? `<h3 class="dl-headline">${inline(h.head)}</h3>` : ''}<div class="dl-doc">${renderBody(h.rest, {})}</div></div></div>`;
    };

    L.sign = (lines, title) => {
        const h = takeHeadline(lines, title);
        return `<div class="dl-plate">${h.head ? `<div class="dl-plate-top"><h3 class="dl-headline">${inline(h.head)}</h3></div>` : ''}<div class="dl-doc">${renderBody(h.rest, {})}</div></div>`;
    };

    L.poster = (lines, title) => {
        const h = takeHeadline(lines, title);
        const k = takeKicker(h.rest);
        const all = lines.join(' ');
        return `<div class="dl-sheet" style="${accentFor(all)}"><div class="dl-hero">${h.head ? `<h3 class="dl-headline">${inline(h.head)}</h3>` : ''}${k.kicker ? `<p class="dl-kicker">${inline(k.kicker)}</p>` : ''}</div><div class="dl-doc">${renderBody(k.rest, { cta: true })}</div></div>`;
    };

    L.advertisement = (lines, title) => {
        const h = takeHeadline(lines, title);
        return `<div class="dl-card" style="${accentFor(lines.join(' '))}"><span class="dl-adtag">AD</span>${h.head ? `<h3 class="dl-headline">${inline(h.head)}</h3>` : ''}<div class="dl-doc">${renderBody(h.rest, { cta: true })}</div></div>`;
    };

    L.article = (lines, title) => {
        let rest = lines.slice();
        let mast = '', head = '', byline = '', dateline = '';
        const b0 = blocksOf(rest);
        // «Springvale College Daily» отдельной строкой, ниже заголовок — это название издания
        if (b0.length > 1 && b0[0].length === 1 && headingish(b0[0][0]) && b0[1] && headingish(b0[1][0]) && b0[0][0].length <= 40) {
            mast = b0[0][0]; rest = rest.slice(rest.indexOf(b0[1][0]));
        }
        const h = takeHeadline(rest, title);
        head = h.head; rest = h.rest;
        if (rest[0] && /^(by|posted by|written by)\s/i.test(rest[0])) { byline = rest.shift(); while (rest[0] === '') rest.shift(); }
        if (rest[0] && /^[A-Z0-9][A-Z0-9\s.,'’-]*\([^)]+\)\s*$/.test(rest[0])) { dateline = rest.shift(); while (rest[0] === '') rest.shift(); }
        return `<article class="dl-paper">${mast ? `<div class="dl-masthead">${inline(mast)}</div>` : ''}${head ? `<h3 class="dl-headline">${inline(head)}</h3>` : ''}${byline || dateline ? `<p class="dl-byline">${inline([byline, dateline].filter(Boolean).join(' · '))}</p>` : ''}${head ? '<hr class="dl-rule">' : ''}<div class="dl-doc">${renderBody(rest, { lines: 'p' })}</div></article>`;
    };

    L.receipt = lines => {
        const b = blocksOf(lines);
        let shop = [], rest = lines;
        if (b.length > 1 && b[0].every(l => lineKind(l, {}).k === 'text')) { shop = b[0]; rest = lines.slice(b[0].length + 1); }
        else if (lines[0] && lineKind(lines[0], {}).k === 'text') { shop = [lines[0]]; rest = lines.slice(1); }
        return `<div class="dl-slip">${shop.length ? `<div class="dl-shop">${shop.map(inline).join('<br>')}</div>` : ''}<div class="dl-doc">${renderBody(rest, { headings: false })}</div></div>`;
    };

    L.label = lines => {
        const b = blocksOf(lines);
        let name = '', subs = [], rest = lines;
        if (lines[0] && lineKind(lines[0], {}).k === 'text') {
            name = lines[0];
            let i = 1;
            while (i < lines.length && lines[i] !== '' && lineKind(lines[i], {}).k === 'text' && lines[i].length < 40) { subs.push(lines[i]); i++; }
            rest = lines.slice(i);
            while (rest[0] === '') rest.shift();
        }
        void b;
        return `<div class="dl-tag">${name ? `<h3 class="dl-product">${inline(name)}</h3>` : ''}${subs.length ? `<p>${subs.map(inline).join('<br>')}</p>` : ''}<div class="dl-doc" style="margin-top:.8em">${renderBody(rest, { headings: false })}</div></div>`;
    };

    L.form = (lines, title) => {
        let head = '', kicker = '', rest = lines;
        const f = lines[0] || '';
        if (f && lineKind(f, {}).k === 'text' && headingish(f)) {
            head = f; rest = lines.slice(1);
            if (rest[0] && rest[0] !== '' && lineKind(rest[0], {}).k === 'text' && headingish(rest[0])) { kicker = rest.shift(); }
            while (rest[0] === '') rest.shift();
        } else if (title) head = title;
        return `<div class="dl-sheet">${head ? `<div class="dl-formhead"><h3 class="dl-headline">${inline(head)}</h3>${kicker ? `<p class="dl-kicker">${inline(kicker)}</p>` : ''}</div>` : ''}<div class="dl-doc">${renderBody(rest, { form: true, kvLong: false })}</div></div>`;
    };

    L.webpage = (lines, title) => {
        let url = '';
        const rest = lines.slice();
        const ui = rest.findIndex((l, i) => i < 3 && /^(https?:\/\/|www\.)\S+$/i.test(l));
        if (ui >= 0) { url = rest[ui]; rest.splice(ui, 1); while (rest[0] === '') rest.shift(); }
        const h = takeHeadline(rest, title);
        return `<div class="dl-browser"><div class="dl-chrome"><span class="dl-dots"><i></i><i></i><i></i></span><span class="dl-url">${esc(url || '')}</span></div><div class="dl-page">${h.head ? `<h3 class="dl-headline">${inline(h.head)}</h3>` : ''}<div class="dl-doc">${renderBody(h.rest, {})}</div></div></div>`;
    };

    L.schedule = (lines, title) => {
        const h = takeHeadline(lines, title);
        return `<div class="dl-paper">${h.head ? `<h3 class="dl-headline">${inline(h.head)}</h3>` : ''}<div class="dl-doc" style="margin-top:.7em">${renderBody(h.rest, { phases: true })}</div></div>`;
    };

    L.instructions = (lines, title) => {
        const h = takeHeadline(lines, title);
        // Строки без «Step N:» — тоже шаги, если это просто предложения подряд
        const blocks = blocksOf(h.rest);
        const hasSteps = h.rest.some(l => lineKind(l, {}).k === 'step');
        let body;
        if (!hasSteps && blocks.length && blocks.some(b => b.length >= 3 && b.every(l => lineKind(l, {}).k === 'text'))) {
            body = blocks.map(b => (b.length >= 3 && b.every(l => lineKind(l, {}).k === 'text'))
                ? `<ol class="dl-steps">${b.map((l, i) => `<li><span class="dl-stepno">${i + 1}</span><span>${inline(l)}</span></li>`).join('')}</ol>`
                : renderBody(b, {})).join('');
        } else body = renderBody(h.rest, {});
        return `<div class="dl-paper">${h.head ? `<h3 class="dl-headline">${inline(h.head)}</h3>` : ''}<div class="dl-doc" style="margin-top:.9em">${body}</div></div>`;
    };

    const CODE_RE = /^([A-Z]{2,5}\s?\d{3}[A-Z]?|[A-Z][a-z]+\s\d{3})\b\s*:?\s*(.*)$/;
    L.syllabus = (lines, title) => {
        const b = blocksOf(lines);
        const headBlock = b.length ? b[0] : [];
        let kick = [], code = '', name = [];
        headBlock.forEach(l => {
            const m = !code && l.match(CODE_RE);
            if (m) { code = m[1]; if (m[2]) name.push(m[2]); }
            else if (!code) kick.push(l); else name.push(l);
        });
        let rest = lines.slice(headBlock.length);
        while (rest[0] === '') rest.shift();
        if (!code && kick.length && headingish(kick[kick.length - 1])) { name = [kick.pop()]; }
        else if (!code && !headBlock.length && title) name = [title];
        if (!code && !name.length) { rest = lines; kick = []; }
        const head = `<div class="dl-coursehead">${kick.length ? `<p class="dl-kicker">${kick.map(inline).join('<br>')}</p>` : ''}${code ? `<span class="dl-code">${esc(code)}</span>` : ''}${name.length ? `<h3 class="dl-headline">${name.map(inline).join('<br>')}</h3>` : ''}</div>`;
        return `<div class="dl-paper">${code || name.length || kick.length ? head : ''}<div class="dl-doc">${renderBody(rest, { kvLong: true })}</div></div>`;
    };

    L.review = (lines, title) => {
        const rest = lines.slice();
        const metaL = [];
        while (rest.length) {
            const l = rest[0];
            if (l === '') { rest.shift(); continue; }
            const k = lineKind(l, {}).k;
            if (k === 'stars' || /^(by|posted by|reviewed by|written by)\s/i.test(l) || (k === 'text' && headingish(l) && metaL.filter(x => x.t === 'h').length < 2)) {
                metaL.push({ t: k === 'stars' ? 's' : /^(by|posted|reviewed|written)\s/i.test(l) ? 'b' : 'h', l: l }); rest.shift();
            } else break;
        }
        const hs = metaL.filter(x => x.t === 'h');
        if (!hs.length && title) hs.push({ t: 'h', l: title });
        const kicker = hs.length > 1 ? hs[0].l : '';
        const head = hs.length ? hs[hs.length - 1].l : '';
        const stars = metaL.filter(x => x.t === 's').map(x => `<p class="dl-stars">${esc(x.l)}</p>`).join('');
        const by = metaL.filter(x => x.t === 'b').map(x => `<p class="dl-byline">${inline(x.l)}</p>`).join('');
        return `<div class="dl-paper"><div class="dl-revhead">${kicker ? `<p class="dl-kicker">${inline(kicker)}</p>` : ''}${head ? `<h3 class="dl-headline">${inline(head)}</h3>` : ''}${stars}${by}</div><div class="dl-doc">${renderBody(rest, { lines: 'p' })}</div></div>`;
    };

    L.menu = (lines, title) => {
        let h = takeHeadline(lines, title);
        let when = '';
        if (h.rest[0] && /^\d/.test(h.rest[0]) && isRealTime(h.rest[0]) && h.rest[0].length < 40) { when = h.rest.shift(); }
        return `<div class="dl-card"><h3 class="dl-headline">${inline(h.head)}</h3>${when ? `<p class="dl-when">${esc(when)}</p>` : ''}<div class="dl-doc" style="margin-top:.9em">${renderBody(h.rest, { headings: false })}</div></div>`;
    };

    L.plain = (lines, title) => {
        const h = takeHeadline(lines, '');
        void title;
        return `<div class="dl-paper">${h.head ? `<h3 class="dl-headline" style="margin-bottom:.6em">${inline(h.head)}</h3>` : ''}<div class="dl-doc">${renderBody(h.rest, {})}</div></div>`;
    };

    const ALIAS = { social: 'social_media', socialmedia: 'social_media', 'social media': 'social_media', post: 'social_media', text: 'chat', messages: 'chat',
        ad: 'advertisement', advert: 'advertisement', flyer: 'poster', news: 'article', web: 'webpage', website: 'webpage', course: 'syllabus', timetable: 'schedule', agenda: 'schedule' };
    const CLASS = { social_media: 'social', advertisement: 'ad', webpage: 'web' };

    // Название задания: у своих текстов — это заголовок; у официальных («094 23.07.2026 — …») — служебное
    function usableTitle(t) {
        t = String(t || '').trim();
        if (!t || /^\d{3}\b/.test(t)) return '';
        return t;
    }

    function render(passage, layoutType, taskTitle) {
        injectCss();
        let lay = String(layoutType || '').toLowerCase().trim();
        lay = ALIAS[lay] || lay;
        if (!L[lay]) lay = 'plain';
        const lines = normalize(passage);
        let title = usableTitle(taskTitle);
        // заголовок из названия — только там, где его ставили раньше, и если текст сам не начинается с него
        if (!['notice', 'advertisement', 'article', 'menu', 'email', 'social_media', 'sign', 'poster'].includes(lay)) title = '';
        if (title && lines[0] && lines[0].toLowerCase().replace(/[^a-z0-9]/g, '') === title.toLowerCase().replace(/[^a-z0-9]/g, '')) title = '';
        let html;
        try { html = L[lay](lines, title); }
        catch (e) {   // на всякий случай: текст важнее рамки
            console.warn('daily-layouts:', lay, e);
            html = `<div class="dl-paper"><div class="dl-doc">${lines.map(l => (l ? `<p>${inline(l)}</p>` : '')).join('')}</div></div>`;
        }
        return `<div class="dl dl-${CLASS[lay] || lay}">${html}</div>`;
    }

    global.DailyLayouts = { render: render, layouts: Object.keys(L), normalize: normalize };
})(typeof window !== 'undefined' ? window : globalThis);
