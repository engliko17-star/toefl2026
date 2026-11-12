// Complete the Words — общий вид пропусков и работа клавиатуры.
// Подключается в complete-words-task.html (практика), tests.html (полный мок,
// reading-engine.js) и take-mock-test.html (мини-мок).
//
// Вид как в TOEFL: каждая пропущенная буква — отдельная черта сразу после
// начала слова, в одну строку с текстом, без плашек и без увеличения высоты строки.
// Вписанная буква занимает ровно свою ширину, поэтому заполненное слово читается
// как обычное слово, а пробелы между словами в абзаце чуть шире обычных.
// Разметка, которую ждут стили:
//   <span class="puzzle-word">pu<span class="letters-container">
//     <input class="letter-input"><input class="letter-input"></span>,</span>
(function () {
    var CSS = [
        /* Пробелы между словами абзаца: у шрифта Plus Jakarta Sans пробел узкий,
           и слова с пропусками сливались с соседними */
        '.cw-text{word-spacing:.12em}',
        /* Слово с пропуском не разрывается при переносе строки */
        '.puzzle-word{display:inline;white-space:nowrap;margin:0;cursor:text}',
        '.letters-container{display:inline;margin:0;padding:0;background:none;border:0;box-shadow:none}',
        /* Пустая клетка — черта под одну букву, высота строки текста не меняется.
           Черта чуть короче клетки — между чертами видны маленькие промежутки, как «_ _ _» в TOEFL */
        '.letter-input{--cw-line:#94a3b8;-webkit-appearance:none;appearance:none;display:inline-block;box-sizing:border-box;',
        'width:.6em;min-width:0;height:1.15em;margin:0;padding:0;vertical-align:baseline;',
        'font:inherit;font-weight:600;line-height:1.15em;letter-spacing:0;word-spacing:0;text-align:center;text-transform:lowercase;',
        'color:#0f172a;caret-color:#4f46e5;border:0;border-radius:2px;outline:none;box-shadow:none;',
        'background-color:transparent;background-image:linear-gradient(var(--cw-line),var(--cw-line));',
        'background-repeat:no-repeat;background-position:center bottom;background-size:80% 2px;',
        '}',
        /* Вписанная буква: ширина клетки = ширина буквы (ставит скрипт), черта сплошная под буквами */
        '.letter-input[data-cw-filled]{background-size:100% 2px;border-radius:0}',
        /* Слово, в котором сейчас курсор, и сама клетка */
        '.puzzle-word:focus-within .letter-input{--cw-line:#818cf8}',
        '.puzzle-word .letter-input:focus{--cw-line:#4f46e5;background-color:#e0e7ff}',
        /* После проверки */
        '.letter-input.correct{--cw-line:#10b981;color:#047857}',
        '.letter-input.wrong{--cw-line:#ef4444;color:#b91c1c}',
        /* Android и iPhone по умолчанию бледнят текст в отключённых полях */
        '.letter-input:disabled{opacity:1;-webkit-text-fill-color:currentColor;cursor:default}',
        /* Пальцем по пустой клетке попасть проще */
        '@media (pointer:coarse){.letter-input{width:.66em}}'
    ].join('');

    function injectStyle() {
        if (document.getElementById('cw-ui-style')) return;
        var s = document.createElement('style');
        s.id = 'cw-ui-style';
        s.textContent = CSS;
        (document.head || document.documentElement).appendChild(s);
    }
    injectStyle();

    var DIRECTIONS = 'Fill in the missing letters in the paragraph.';

    // ---- Ширина вписанной буквы ----
    // Клетка с буквой сужается до ширины самой буквы (m широкая, i узкая),
    // иначе буквы стоят врозь и слово не читается. Ширина — в em, поэтому
    // она верна при любом размере шрифта (телефон, планшет, компьютер).
    var PAD = 0.03; // небольшой запас, чтобы курсор не сдвигал букву
    var widths = {};
    var canvas = null;
    function letterEm(inp, ch) {
        var cs = window.getComputedStyle(inp);
        var font = cs.fontStyle + ' ' + cs.fontWeight + ' 100px ' + cs.fontFamily;
        var key = font + '|' + ch;
        if (widths[key] == null) {
            try {
                canvas = canvas || document.createElement('canvas').getContext('2d');
                canvas.font = font;
                widths[key] = canvas.measureText(ch).width / 100;
            } catch (e) { widths[key] = 0; }
        }
        return widths[key];
    }
    function fit(inp) {
        var v = String(inp.value || '').toLowerCase();
        var w = v ? letterEm(inp, v) : 0;
        if (v && w > 0) {
            inp.style.width = (w + PAD).toFixed(3) + 'em';
            inp.setAttribute('data-cw-filled', '');
        } else {
            inp.style.width = '';
            inp.removeAttribute('data-cw-filled');
        }
    }
    function refitAll() {
        widths = {};
        Array.prototype.forEach.call(document.querySelectorAll('.letter-input[data-cw-bound]'), fit);
    }
    // До загрузки шрифта ширина считается по запасному шрифту — пересчитать после загрузки
    if (document.fonts) {
        if (document.fonts.ready) document.fonts.ready.then(refitAll);
        if (document.fonts.addEventListener) document.fonts.addEventListener('loadingdone', refitAll);
    }
    // Страницы вписывают буквы и сами (показ правильных ответов, разбор попытки,
    // сброс) — перехватываем запись value, чтобы ширина клетки всегда совпадала с буквой
    var VALUE = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
    function watchValue(inp) {
        if (!VALUE || !VALUE.get || !VALUE.set) return;
        try {
            Object.defineProperty(inp, 'value', {
                configurable: true,
                get: function () { return VALUE.get.call(this); },
                set: function (v) { VALUE.set.call(this, v); fit(this); }
            });
        } catch (e) { /* старый браузер — ширина обновится при вводе */ }
    }

    // Подключает ввод ко всем .letter-input внутри root.
    // opts.onChange — вызывается после каждого изменения букв (сохранение ответа).
    function bind(root, opts) {
        opts = opts || {};
        root = root || document;
        var inputs = Array.prototype.slice.call(root.querySelectorAll('.letter-input'));
        var changed = function () { if (typeof opts.onChange === 'function') opts.onChange(); };
        var step = function (inp, dir) {
            for (var k = inputs.indexOf(inp) + dir; k >= 0 && k < inputs.length; k += dir) {
                if (!inputs[k].disabled) return inputs[k];
            }
            return null;
        };
        // Стереть букву в предыдущей клетке и перейти туда (Backspace на пустой клетке)
        var backOne = function (inp) {
            var p = step(inp, -1);
            if (!p) return;
            p.value = '';
            p.focus();
            changed();
        };

        // Абзац с пропусками — пробелы между словами чуть шире
        Array.prototype.forEach.call(root.querySelectorAll('.puzzle-word'), function (w) {
            if (w.parentElement) w.parentElement.classList.add('cw-text');
        });

        inputs.forEach(function (inp) {
            inp.setAttribute('maxlength', '1');
            inp.setAttribute('autocomplete', 'off');
            inp.setAttribute('autocorrect', 'off');
            inp.setAttribute('autocapitalize', 'none');
            inp.setAttribute('spellcheck', 'false');
            inp.setAttribute('enterkeyhint', 'next');
            if (!inp.getAttribute('aria-label')) inp.setAttribute('aria-label', 'missing letter');
            if (inp.getAttribute('data-cw-bound')) { fit(inp); return; }
            inp.setAttribute('data-cw-bound', '1');
            watchValue(inp);
            fit(inp);

            inp.addEventListener('input', function () {
                var v = this.value.replace(/[^a-zA-Z]/g, '').toLowerCase().slice(-1);
                if (this.value !== v) this.value = v;
                fit(this);
                if (v) { var n = step(this, 1); if (n) n.focus(); }
                changed();
            });
            inp.addEventListener('keydown', function (e) {
                if (e.key === 'Backspace' && this.value === '') { e.preventDefault(); backOne(this); }
                else if (e.key === 'ArrowLeft') { var p = step(this, -1); if (p) { e.preventDefault(); p.focus(); } }
                else if (e.key === 'ArrowRight') { var n = step(this, 1); if (n) { e.preventDefault(); n.focus(); } }
                else if (e.key === 'Enter') { e.preventDefault(); var m = step(this, 1); if (m) m.focus(); }
            });
            // Клавиатура Android часто не сообщает, что нажат Backspace (keydown без e.key),
            // поэтому на пустой клетке ловим само удаление
            inp.addEventListener('beforeinput', function (e) {
                if (e.inputType === 'deleteContentBackward' && this.value === '') { e.preventDefault(); backOne(this); }
            });
            // В заполненной клетке новая буква заменяет старую
            inp.addEventListener('focus', function () { this.select(); });
        });

        // Нажатие на само слово (на видимые буквы) ставит курсор в первую пустую клетку слова
        if (!root.__cwClick) {
            root.__cwClick = true;
            root.addEventListener('click', function (e) {
                if (!e.target || !e.target.closest || e.target.closest('.letter-input')) return;
                var w = e.target.closest('.puzzle-word');
                if (!w) return;
                var own = Array.prototype.filter.call(w.querySelectorAll('.letter-input'), function (i) { return !i.disabled; });
                if (!own.length) return;
                // Есть пустые клетки — в первую пустую; слово заполнено — в букву, ближайшую к месту нажатия
                var empty = own.filter(function (i) { return !i.value; })[0];
                if (!empty) {
                    var best = Infinity;
                    own.forEach(function (i) {
                        var r = i.getBoundingClientRect();
                        var d = Math.abs(r.left + r.width / 2 - e.clientX);
                        if (d < best) { best = d; empty = i; }
                    });
                }
                (empty || own[own.length - 1]).focus();
            });
        }
        return inputs;
    }

    window.CWUI = { bind: bind, DIRECTIONS: DIRECTIONS };
})();
