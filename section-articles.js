// =====================================================================
// section-articles.js — число статей на кнопках «All articles»
// (reading.html, listening.html, writing.html, speaking.html).
//
// У кнопки есть data-articles-count="reading-articles.html" — скрипт
// открывает эту страницу-библиотеку, считает на ней ссылки на статьи
// (article-….html и general-….html) и пишет число в кнопку. Добавили
// статью в библиотеку — число на разделе поменяется само.
// Не получилось посчитать — число просто не показывается.
// =====================================================================
(function () {
    'use strict';

    function countArticles(html) {
        var seen = {};
        var re = /(?:article|general)-[a-z0-9-]+\.html/gi;
        var m;
        while ((m = re.exec(html))) seen[m[0].toLowerCase()] = true;
        return Object.keys(seen).length;
    }

    function run() {
        var els = Array.prototype.slice.call(document.querySelectorAll('[data-articles-count]'));
        if (!els.length || !window.fetch) return;
        var hubs = {};
        els.forEach(function (el) {
            var hub = el.getAttribute('data-articles-count');
            (hubs[hub] = hubs[hub] || []).push(el);
        });
        Object.keys(hubs).forEach(function (hub) {
            fetch(hub, { credentials: 'same-origin' })
                .then(function (r) { return r.ok ? r.text() : ''; })
                .then(function (html) {
                    var n = countArticles(html);
                    if (!n) return;
                    hubs[hub].forEach(function (el) {
                        el.textContent = String(n);
                        el.classList.remove('hidden');
                    });
                })
                .catch(function () { /* без числа */ });
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
    else run();
})();
