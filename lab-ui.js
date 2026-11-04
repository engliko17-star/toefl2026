// ==========================================================
// lab-ui.js — общий вид разбора для страниц обкатки
// (content-lab.html и mock-lab.html): вопрос, слово Complete the Words,
// подсказка «как читать цифры». Подключается после lab-data.js.
// ==========================================================

// 1 задание, 2 задания, 5 заданий
function plural(n, forms) {
    const a = Math.abs(Math.round(n)) % 100, b = a % 10;
    const w = (a > 10 && a < 20) ? forms[2] : b === 1 ? forms[0] : (b >= 2 && b <= 4) ? forms[1] : forms[2];
    return n + ' ' + w;
}
const W_TASK = ['задание', 'задания', 'заданий'];
const W_PASS = ['прохождение', 'прохождения', 'прохождений'];

// «Отделяет ли вопрос сильных от слабых»: доля верных у лучшей половины
// прохождений минус доля у худшей половины
function discInfo(d) {
    if (d === null || d === undefined) return { text: 'мало данных', cls: 'text-gray-400', tip: 'Нужно хотя бы 4 прохождения с ответами' };
    const v = Math.round(d * 100);
    if (v < 0) return { text: `наоборот (${v})`, cls: 'text-rose-600', tip: 'Сильные ученицы ошибаются чаще слабых — чаще всего это ошибка в ключе или двусмысленная формулировка' };
    if (v < 10) return { text: `почти не отделяет (+${v})`, cls: 'text-amber-600', tip: 'Сильные и слабые отвечают одинаково — вопрос мало что говорит об уровне' };
    return { text: `хорошо (+${v})`, cls: 'text-emerald-600', tip: 'Сильные отвечают верно заметно чаще слабых — вопрос работает' };
}

function shareCls(share) {
    if (share === null || share === undefined) return 'text-gray-300';
    if (share === 0) return 'text-rose-600';
    if (share < 0.4) return 'text-rose-600';
    if (share > 0.85) return 'text-amber-600';
    return 'text-slate-800';
}

// Ярлык сложности задания по среднему результату
function difficultyChip(share, n) {
    if (share === null || share === undefined || !n) return '';
    if (n < MIN_ATTEMPTS) return '<span class="lab-chip bg-gray-100 text-gray-500" title="Меньше 5 прохождений — выводы ненадёжны">мало данных</span>';
    if (share < 0.4) return '<span class="lab-chip bg-rose-50 text-rose-600" title="В среднем верно меньше 40% — задание очень трудное или в нём ошибка">трудное</span>';
    if (share > 0.85) return '<span class="lab-chip bg-amber-50 text-amber-700" title="В среднем верно больше 85% — задание почти ничего не проверяет">лёгкое</span>';
    return '';
}

const toeflBadge = '<span class="lab-chip bg-violet-600 text-white" title="Официальное задание TOEFL">TOEFL</span>';

function flagChips(flags) {
    if (!flags || !flags.length) return '';
    return `<div class="flex flex-wrap gap-1.5 mt-3">${flags.map(f => `
        <span class="lab-chip ${f[1] === 'rose' ? 'bg-rose-50 text-rose-700' : f[1] === 'amber' ? 'bg-amber-50 text-amber-800' : 'bg-gray-100 text-gray-600'}">${esc(f[0])}</span>`).join('')}</div>`;
}

// Разбор одного вопроса с вариантами
function renderItem(it) {
    if (it.word) return renderWordItem(it);
    const reliable = it.answered >= MIN_ATTEMPTS;
    const opts = it.q.options.map((o, oi) => {
        const n = it.counts[oi] || 0;
        const share = it.answered ? n / it.answered : 0;
        const ok = oi === it.q.correct;
        return `
            <div class="grid grid-cols-[18px_minmax(60px,140px)_28px_1fr] items-center gap-2 text-xs">
                <span class="font-bold ${ok ? 'text-emerald-600' : 'text-gray-400'}" title="${ok ? 'Правильный ответ' : ''}">${String.fromCharCode(65 + oi)}</span>
                <div class="h-3.5 bg-gray-100 rounded-md overflow-hidden">
                    <div class="h-full ${ok ? 'bg-emerald-500' : 'bg-slate-300'}" style="width:${Math.round(share * 100)}%"></div>
                </div>
                <span class="text-right text-gray-500 tabular-nums">${n}</span>
                <span class="truncate ${ok ? 'text-slate-800 font-medium' : 'text-gray-600'}" title="${esc(o)}">${esc(o)}</span>
            </div>`;
    }).join('');
    const d = discInfo(it.discrimination);
    return `
    <div class="border border-gray-100 rounded-2xl p-4">
        <div class="flex items-start gap-3 mb-3">
            <span class="text-[11px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-lg shrink-0">${it.i + 1}</span>
            <div class="min-w-0 flex-1">
                <p class="text-sm text-slate-800 leading-relaxed">${esc(it.q.text || '(без текста)')}</p>
                ${it.cat && it.cat !== 'Без типа' ? `<span class="text-[11px] font-semibold text-gray-400">${esc(it.cat)}</span>` : ''}
            </div>
            <div class="text-right shrink-0">
                <p class="text-base font-bold tabular-nums ${shareCls(it.share)}">${pct(it.share)}</p>
                <p class="text-[11px] text-gray-400">${it.answered ? `верно ${it.correct} из ${it.answered}` : 'нет ответов'}</p>
            </div>
        </div>
        <div class="space-y-1.5">${opts || '<p class="text-xs text-rose-600">Нет вариантов ответа</p>'}</div>
        <p class="mt-3 text-[11px] ${reliable ? 'text-gray-500' : 'text-gray-400'}" title="${esc(d.tip)}">
            Отделяет сильных от слабых: <b class="${d.cls}">${d.text}</b>${!reliable && it.answered ? ' · пока мало ответов для выводов' : ''}
        </p>
        ${flagChips(it.flags)}
    </div>`;
}

// Разбор одного слова Complete the Words
function renderWordItem(it) {
    const wrong = Object.entries(it.wrong || {}).sort((a, b) => b[1] - a[1]).slice(0, 4);
    return `
    <div class="border border-gray-100 rounded-2xl p-4">
        <div class="flex items-start gap-3">
            <span class="text-[11px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-lg shrink-0">${it.i + 1}</span>
            <div class="min-w-0 flex-1">
                <p class="text-sm text-slate-800 font-mono tracking-wide">${esc(it.q.text)}</p>
                <p class="text-[11px] text-gray-400 mt-0.5">ответ: ${esc(it.q.full)}</p>
            </div>
            <div class="text-right shrink-0">
                <p class="text-base font-bold tabular-nums ${shareCls(it.share)}">${pct(it.share)}</p>
                <p class="text-[11px] text-gray-400">${it.answered ? `верно ${it.correct} из ${it.answered}` : 'нет ответов'}</p>
            </div>
        </div>
        ${wrong.length ? `<p class="mt-2 text-[11px] text-gray-500">Чаще всего вместо этого: ${wrong.map(([w, n]) => `<b class="font-mono">${esc(w)}</b> ×${n}`).join(', ')}</p>` : ''}
        ${flagChips(it.flags)}
    </div>`;
}

// «Как читать цифры» — раскрывается по клику
const LAB_HELP = `
<details class="lab-help bg-indigo-50/50 border border-indigo-100 rounded-2xl px-4 py-3 text-xs text-slate-600">
    <summary class="cursor-pointer font-bold text-indigo-700 select-none">Как читать цифры</summary>
    <ul class="mt-2 space-y-1.5 leading-relaxed list-disc pl-4">
        <li><b>Процент</b> — какая доля ответов верная. Рядом — на скольких ответах он посчитан: меньше 5 — пока не вывод, а намёк.</li>
        <li><b>Трудное</b> — в среднем верно меньше 40%. <b>Лёгкое</b> — больше 85%: такое задание мало что проверяет.</li>
        <li><b>Отделяет сильных от слабых</b> — сравниваем лучшую и худшую половину прохождений. «Хорошо» — сильные отвечают верно заметно чаще. «Наоборот» — сильные ошибаются чаще слабых: обычно это ошибка в ключе или двусмысленный вопрос.</li>
        <li><b>Полоски вариантов</b> — сколько раз выбирали каждый вариант; зелёный — правильный. Вариант, который никто не выбирает, не работает как ловушка.</li>
        <li>Ваши собственные прохождения не учитываются, пока не включите «Учитывать мои прохождения».</li>
    </ul>
</details>`;
