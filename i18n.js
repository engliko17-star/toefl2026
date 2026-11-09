// =====================================================================
// i18n.js — два языка интерфейса: английский и русский.
//
// Что НЕ переводится: всё, что относится к самому экзамену TOEFL —
// экраны заданий, кнопки Next / Back / Review, названия типов заданий
// (Complete the Words, Academic Discussion…), инструкции внутри задания.
// Переводится всё вокруг: меню, дашборд, страницы разделов, результаты.
//
// Как пользоваться на странице:
//   1) подключить в <head> раньше скриптов страницы:
//        <script src="i18n.js"></script>
//   2) статичный текст — атрибутом:
//        <h2 data-i18n="dash.today">Today</h2>
//        <p data-i18n-html="dash.note">…с <b>разметкой</b>…</p>
//        <input data-i18n-attr="placeholder:dash.search">
//   3) текст из скрипта — через t():
//        I18N.t('dash.today')   I18N.t('dash.left', { n: 3 })
//   4) словарь страницы — в её же скрипте, до первого t():
//        I18N.add({ 'dash.today': ['Today', 'Сегодня'] });   // [en, ru]
//   5) длинный текст на двух языках можно написать прямо в разметке:
//        <div data-lang="en">…</div><div data-lang="ru">…</div>
//      — показывается блок только текущего языка.
//
// Язык: выбор в меню (запоминается в браузере), иначе — язык браузера
// (русский, белорусский, украинский, казахский → русский, остальные → английский).
// =====================================================================
(function () {
    'use strict';
    var KEY = 'appLang';
    var LANGS = ['en', 'ru'];

    function detect() {
        try {
            var saved = localStorage.getItem(KEY);
            if (LANGS.indexOf(saved) >= 0) return saved;
        } catch (e) { /* без localStorage — по браузеру */ }
        var list = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'en']);
        for (var i = 0; i < list.length; i++) {
            var l = String(list[i] || '').toLowerCase();
            if (/^(ru|be|uk|kk)\b/.test(l)) return 'ru';
            if (/^en\b/.test(l)) return 'en';
        }
        return 'en';
    }

    var lang = detect();
    var dict = {};
    document.documentElement.lang = lang;

    // Блоки data-lang — только текущего языка (стиль ставится сразу, до отрисовки)
    var st = document.createElement('style');
    st.id = 'i18n-style';
    st.textContent = 'html[lang="ru"] [data-lang="en"],html[lang="en"] [data-lang="ru"]{display:none !important}';
    (document.head || document.documentElement).appendChild(st);

    function add(entries) {
        Object.keys(entries || {}).forEach(function (k) {
            var v = entries[k];
            dict[k] = Array.isArray(v) ? { en: v[0], ru: v[1] } : v;
        });
    }

    function fill(s, vars) {
        if (!vars) return s;
        return String(s).replace(/\{(\w+)\}/g, function (m, k) { return vars[k] !== undefined && vars[k] !== null ? vars[k] : m; });
    }

    // t('key', vars) — перевод; если ключа нет, возвращается сам ключ (видно, что забыли)
    function t(key, vars) {
        var e = dict[key];
        if (!e) return key;
        var s = e[lang];
        if (s === undefined || s === null) s = e.en;
        return fill(s, vars);
    }
    function has(key) { return !!dict[key]; }

    // Русские окончания: plural(5, ['задание','задания','заданий']); английские — [one, other]
    function plural(n, forms) {
        var a = Math.abs(Math.round(n));
        if (forms.length === 2) return a === 1 ? forms[0] : forms[1];
        var m100 = a % 100, m10 = a % 10;
        if (m100 > 10 && m100 < 20) return forms[2];
        if (m10 === 1) return forms[0];
        if (m10 >= 2 && m10 <= 4) return forms[1];
        return forms[2];
    }

    // Число + слово: I18N.count(3, 'tasks') — формы в словаре: { en: ['task','tasks'], ru: ['задание','задания','заданий'] }
    function count(n, key) {
        var e = dict[key];
        var forms = e ? (e[lang] || e.en) : null;
        if (!Array.isArray(forms)) return n + ' ' + t(key);
        return n + ' ' + plural(n, forms);
    }

    function apply(root) {
        root = root || document;
        var i, list;
        list = root.querySelectorAll('[data-i18n]');
        for (i = 0; i < list.length; i++) {
            var k = list[i].getAttribute('data-i18n');
            if (has(k)) list[i].textContent = t(k);
        }
        list = root.querySelectorAll('[data-i18n-html]');
        for (i = 0; i < list.length; i++) {
            var kh = list[i].getAttribute('data-i18n-html');
            if (has(kh)) list[i].innerHTML = t(kh);
        }
        list = root.querySelectorAll('[data-i18n-attr]');
        for (i = 0; i < list.length; i++) {
            list[i].getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
                var p = pair.split(':');
                if (p.length === 2 && has(p[1].trim())) list[i].setAttribute(p[0].trim(), t(p[1].trim()));
            });
        }
    }

    function setLang(l) {
        if (LANGS.indexOf(l) < 0 || l === lang) return;
        try { localStorage.setItem(KEY, l); } catch (e) { /* без localStorage — только до перезагрузки */ }
        // Страницы рисуют много текста из скриптов — проще и надёжнее перерисовать всё
        location.reload();
    }

    // Дата по-русски или по-английски
    function date(d, opts) {
        var x = d instanceof Date ? d : new Date(d);
        if (isNaN(x)) return '';
        return x.toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US', opts || { day: 'numeric', month: 'short' });
    }

    // Общие слова для всех страниц
    add({
        'common.loading': ['Loading…', 'Загрузка…'],
        'common.error': ['Something went wrong. Please refresh the page.', 'Что-то пошло не так. Обновите страницу.'],
        'common.open': ['Open', 'Открыть'],
        'common.close': ['Close', 'Закрыть'],
        'common.save': ['Save', 'Сохранить'],
        'common.cancel': ['Cancel', 'Отмена'],
        'common.back': ['Back', 'Назад'],
        'common.all': ['All', 'Все'],
        'common.tasks': { en: ['task', 'tasks'], ru: ['задание', 'задания', 'заданий'] },
        'common.sets': { en: ['set', 'sets'], ru: ['набор', 'набора', 'наборов'] },
        'common.articles': { en: ['article', 'articles'], ru: ['статья', 'статьи', 'статей'] },
        'common.minutes': { en: ['min', 'min'], ru: ['мин', 'мин', 'мин'] },
        'lang.switch': ['Language', 'Язык']
    });

    function ready(fn) {
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, { once: true });
        else fn();
    }
    ready(function () { apply(document); });

    window.I18N = { get lang() { return lang; }, LANGS: LANGS, t: t, has: has, add: add, apply: apply, setLang: setLang, plural: plural, count: count, date: date };
})();
