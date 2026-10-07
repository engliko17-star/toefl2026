// =============================================================
// РАЗБОР ПАССАЖА READING — общий для всех страниц.
//
// Подключается в: reading-engine.js (полные пробники),
// read-academic-task.html, read-daily-task.html (практика),
// take-mock-test.html (мини-пробники).
//
// Одна копия вместо четырёх: расхождение между движками мы уже
// проходили, когда ключ правильного ответа читался в четырёх местах
// и две копии обновили, а две нет.
//
// Разметка в тексте пассажа:
//   [s1]…[sN] перед предложением — Select a Sentence
//   [sq1]… или [■]               — позиции вставки для Insert Text
//
// Подсветка для Sentence Simplification и Reference берётся НЕ из текста,
// а из поля вопроса highlight (плюс highlight_occurrence для повторов).
// Так пассажи не нужно переразмечать и типы не мешают друг другу.
// =============================================================

(function (global) {

    // ---------- разбор текста ----------
    function parsePassage(raw) {
        let html = String(raw || '')
            .replace(/\[s(\d+)\](.*?)(?=\[s\d+\]|\[sq\d+\]|\[■\]|$)/gs,
                     '<span class="clickable-sentence" data-id="$1">$2</span>')
            .replace(/\[sq(\d+)\]/g, '<span class="insert-square"></span>')
            .replace(/\[■\]/g, '<span class="insert-square"></span>');

        // Позиции вставки нумеруем буквами, как на экзамене: A, B, C, D
        let n = 0;
        html = html.replace(/<span class="insert-square"><\/span>/g, () => {
            const letter = String.fromCharCode(65 + n);
            const out = `<span class="insert-square" data-sq="${n}" data-letter="${letter}">${letter}</span>`;
            n++;
            return out;
        });

        return html.split('\n\n').map(p => `<p class="mb-4">${p}</p>`).join('');
    }

    // ---------- подсветка фрагмента ----------
    const norm = t => String(t || '')
        .replace(/[\u00A0\u2009\u202F]/g, ' ')
        .replace(/[“”«»„]/g, '"').replace(/[‘’]/g, "'")
        .replace(/\s+/g, ' ').trim();

    function clearHighlight(container) {
        (container || document).querySelectorAll('.q-highlight').forEach(el => {
            el.replaceWith(document.createTextNode(el.textContent));
        });
        if (container) container.normalize();
    }

    // Ищем фрагмент в исходном тексте узла регуляркой: пробелы и кавычки любые,
    // а у слова должны быть границы. Раньше искали подстроку в нормализованном
    // тексте, поэтому «them» находилось внутри «mathematics» и «themes», а второе
    // «them» в одном абзаце подсвечивалось на месте первого.
    const WORD_CHAR = /[A-Za-z0-9\u00C0-\u024F]/;
    function highlightRegex(target) {
        const esc = target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            .replace(/"/g, '["“”«»„]')
            .replace(/'/g, "['‘’]")
            .replace(/ /g, '[\\s\\u00A0\\u2009\\u202F]+');
        return new RegExp(esc, 'g');
    }

    function applyHighlight(container, question) {
        clearHighlight(container);
        const q = question || {};
        const target = norm(q.highlight);
        if (!target || !container) return false;

        const cls = q.type === 'Reference' ? 'reference-highlight' : 'simplify-highlight';
        const want = Number(q.highlight_occurrence) > 0 ? Number(q.highlight_occurrence) : 1;
        const needStart = WORD_CHAR.test(target[0]);
        const needEnd = WORD_CHAR.test(target[target.length - 1]);
        const re = highlightRegex(target);
        const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
        let node, seen = 0;

        while ((node = walker.nextNode())) {
            const raw = node.nodeValue;
            re.lastIndex = 0;
            let m;
            while ((m = re.exec(raw)) !== null) {
                if (m[0].length === 0) { re.lastIndex++; continue; }
                const before = raw[m.index - 1];
                const after = raw[m.index + m[0].length];
                // «them» внутри «mathematics» — не то слово
                if ((needStart && before && WORD_CHAR.test(before)) || (needEnd && after && WORD_CHAR.test(after))) continue;
                seen++;
                if (seen === want) {
                    const mid = node.splitText(m.index);
                    mid.splitText(m[0].length);
                    const mark = document.createElement('span');
                    mark.className = 'q-highlight ' + cls;
                    mark.textContent = mid.nodeValue;
                    mid.replaceWith(mark);
                    return true;
                }
            }
        }
        // Молчать нельзя: опечатка в контенте иначе превратится
        // в вопрос без выделения, и никто этого не заметит.
        console.warn('[passage-markup] фрагмент для подсветки не найден:', q.highlight);
        return false;
    }

    // ---------- вставка предложения (Insert Text) ----------
    // На экзамене выбранное предложение появляется прямо в тексте
    // и переезжает при смене позиции.
    function choosePosition(container, pos, sentence, opts) {
        const o = opts || {};
        container.querySelectorAll('.insert-preview').forEach(el => el.remove());

        const squares = [...container.querySelectorAll('.insert-square')];
        squares.forEach((el, i) => el.classList.toggle('selected', i === pos));

        document.querySelectorAll('.insert-option').forEach(b => {
            const on = Number(b.dataset.pos) === pos;
            b.className = 'insert-option w-full flex items-center gap-3 p-3 border rounded-xl transition text-left '
                + (on ? 'bg-indigo-50 border-indigo-400' : 'bg-white border-gray-200 hover:border-indigo-300');
        });

        const square = squares[pos];
        if (square && sentence) {
            const preview = document.createElement('span');
            preview.className = 'insert-preview';
            preview.textContent = ' ' + sentence + ' ';
            square.after(preview);
            if (!o.silent && preview.scrollIntoView) {
                preview.scrollIntoView({ block: 'center', behavior: 'smooth' });
            }
        }
    }

    // Кнопки позиций для правой панели
    function positionButtons(container, sentence, handlerName) {
        const letters = [...container.querySelectorAll('.insert-square')].map(el => el.dataset.letter);
        return `
            <div class="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-900 mb-3">
                "${sentence || ''}"
            </div>` + letters.map((L, i) => `
            <button type="button" onclick="${handlerName}(${i})" data-pos="${i}"
                    class="insert-option w-full flex items-center gap-3 p-3 border rounded-xl transition text-left bg-white border-gray-200 hover:border-indigo-300 mb-2">
                <span class="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">${L}</span>
                <span class="text-xs text-slate-600">Позиция ${L}</span>
            </button>`).join('');
    }

    // ---------- стили ----------
    function injectStyles() {
        if (document.getElementById('passage-markup-styles')) return;
        const css = `
            .q-highlight { border-radius: 4px; padding: 1px 2px; }
            .simplify-highlight { background-color: #fef08a; box-shadow: 0 0 0 1px #fde047; }
            .reference-highlight { background-color: #dbeafe; box-shadow: 0 0 0 1px #bfdbfe; font-weight: 600; }
            .insert-preview { background-color: #eef2ff; border-bottom: 2px solid #6366f1; padding: 1px 3px; border-radius: 4px; }
            .insert-square[data-letter] { font-weight: 700; font-size: .75em; border: 1px solid #cbd5e1; border-radius: 4px; padding: 0 4px; cursor: pointer; vertical-align: middle; }
            .insert-square.selected { background-color: #4f46e5; color: #fff; border-color: #4f46e5; }
        `;
        const style = document.createElement('style');
        style.id = 'passage-markup-styles';
        style.textContent = css;
        document.head.appendChild(style);
    }

    global.PassageMarkup = {
        parsePassage, applyHighlight, clearHighlight,
        choosePosition, positionButtons, injectStyles
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', injectStyles);
    else injectStyles();

})(window);
