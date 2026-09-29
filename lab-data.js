// ==========================================================
// Общие данные лаборатории: загрузка и анализ.
// Используется двумя страницами — content-lab.html (материал)
// и mock-lab.html (пробники). Правка считается один раз.
// ==========================================================

const MIN_ATTEMPTS = 5;
const SECTIONS = {
    reading:   { title: 'Reading',   icon: 'book-text',  color: 'indigo' },
    listening: { title: 'Listening', icon: 'headphones', color: 'teal' },
    // В этих секциях правильность определяет преподаватель,
    // поэтому вместо доли верных ответов считаем проверку и охват.
    writing:   { title: 'Writing',   icon: 'pen-tool',   color: 'amber',  manual: true },
    speaking:  { title: 'Speaking',  icon: 'mic',        color: 'rose',   manual: true }
};
const SOURCE_LABEL = { practice: 'Практика', minimock: 'Мини-пробники', mock: 'Полные пробники' };

function db() {
    if (typeof _supabase !== 'undefined' && _supabase) return _supabase;
    return window.supabaseClient;
}
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g,
    c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const icons = () => { try { if (window.lucide) lucide.createIcons(); } catch (e) {} };
const normText = t => String(t || '').replace(/\s+/g, ' ').replace(/[“”«»"']/g, '"').trim().toLowerCase();
const pct = v => (v === null || v === undefined) ? '—' : Math.round(v * 100) + '%';


function parseJson(raw) {
    let q = raw;
    if (typeof q === 'string') { try { q = JSON.parse(q); } catch (e) { return null; } }
    return q;
}
function asArray(raw) { const v = parseJson(raw); return Array.isArray(v) ? v : []; }

// Вопрос приводим к общему виду: текст, варианты, номер верного
function normQuestion(q) {
    const correct = (q.correct !== undefined) ? q.correct
                  : (q.correct_index !== undefined) ? q.correct_index
                  : (q.correct_answer !== undefined) ? q.correct_answer : null;
    return {
        text: q.text || q.question || '',
        type: q.type || '',
        options: Array.isArray(q.options) ? q.options : [],
        correct: correct === null ? null : Number(correct)
    };
}

// Если запрос завис, ждать вечно нельзя: страница должна сказать,
// на чём именно она остановилась.
// Последовательное выполнение вместо Promise.all: чуть медленнее,
// но не забивает соединение десятком параллельных запросов.
async function series(makers) {
    const out = [];
    // Каждый запрос запускается только когда дошла очередь: если передать
    // готовые промисы, они стартуют все разом и очередь ничего не даёт.
    for (const make of makers) out.push(await make());
    return out;
}

function withTimeout(promise, ms, label) {
    return Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Таймаут: ' + label)), ms))
    ]);
}

async function fetchAll(table, columns, tune) {
    const PAGE = 1000;
    let rows = [], from = 0;
    while (true) {
        let q = db().from(table).select(columns).range(from, from + PAGE - 1);
        if (tune) q = tune(q);
        const { data, error } = await withTimeout(q, 25000, table);
        if (error) throw error;
        rows = rows.concat(data || []);
        if (!data || data.length < PAGE) return rows;
        from += PAGE;
        if (from > 50000) return rows;
    }
}

// ==========================================
// READING
// ==========================================
async function loadReading(byKey) {
    // Раньше все запросы уходили разом. На больших таблицах это перегружало
    // соединение: часть запросов подвисала, а заодно срывалась проверка
    // профиля в auth.js и появлялся экран «Аккаунт на проверке».
    const [acad, daily, res, mini, big, attemptsMap] = await series([
        () => fetchAll('academic_tasks', 'id, title, questions, questions_count, is_mock_only'),
        () => fetchAll('daily_life_tasks', 'id, title, questions, questions_count, is_mock_only'),
        () => fetchAll('reading_results', 'task_id, task_type, user_answers, created_at', q => q.in('task_type', ['academic', 'daily'])),
        fetchAll('mock_test_results', 'test_id, user_answers, created_at'),
        fetchAll('big_mock_answers', 'attempt_id, answer_json, answer_text, is_correct, created_at', q => q.in('task_type', ['academic', 'daily', 'daily_life'])),
        fetchAll('big_mock_attempts', 'id, test_id')
    ]);

    const add = (rows, type) => (rows || []).forEach(t => {
        byKey['reading:' + type + ':' + t.id] = {
            key: 'reading:' + type + ':' + t.id,
            section: 'reading', type, id: t.id,
            title: t.title || ('Без названия #' + t.id),
            kind: type === 'academic' ? 'Academic' : 'Daily Life',
            declared: t.questions_count, isMockOnly: t.is_mock_only,
            questions: asArray(t.questions).map(normQuestion),
            perQuestion: true, attempts: []
        };
    });
    add(acad, 'academic'); add(daily, 'daily');

    // практика
    res.forEach(r => {
        const t = byKey['reading:' + r.task_type + ':' + r.task_id];
        if (!t) return;
        const answers = {};
        Object.entries(r.user_answers || {}).forEach(([k, v]) => {
            if (v !== null && v !== '') answers[k] = Number(v);
        });
        t.attempts.push({ source: 'practice', answers, created_at: r.created_at });
    });

    // мини-пробники: ключи academic_62_3
    mini.forEach(row => {
        const byTask = {};
        Object.entries(row.user_answers || {}).forEach(([k, v]) => {
            const m = /^(academic|daily)_(\d+)_(\d+)$/.exec(k);
            if (!m || v === null || v === '') return;
            (byTask['reading:' + m[1] + ':' + m[2]] ||= {})[m[3]] = Number(v);
        });
        Object.entries(byTask).forEach(([key, answers]) => {
            if (byKey[key]) byKey[key].attempts.push({ source: 'minimock', answers, created_at: row.created_at, testId: row.test_id });
        });
    });

    // полные пробники: вопрос и ответ текстом
    const attemptTest = {};
    (attemptsMap || []).forEach(a => attemptTest[a.id] = a.test_id);
    const lookup = buildLookup(byKey, 'reading');
    const grouped = {};
    big.forEach(row => {
        const hit = lookup[normText((row.answer_json || {}).question)];
        if (!hit) return;
        const g = (grouped[row.attempt_id + '|' + hit.key] ||= { key: hit.key, answers: {}, created_at: row.created_at, testId: attemptTest[row.attempt_id] });
        const opts = hit.task.questions[hit.index].options;
        let choice = opts.findIndex(o => normText(o) === normText(row.answer_text));
        if (choice === -1 && row.is_correct) choice = hit.task.questions[hit.index].correct;
        if (choice !== -1 && choice !== null) g.answers[hit.index] = choice;
    });
    Object.values(grouped).forEach(g => byKey[g.key].attempts.push({ source: 'mock', answers: g.answers, created_at: g.created_at, testId: g.testId }));
}

function buildLookup(byKey, section) {
    const map = {};
    Object.values(byKey).filter(t => t.section === section).forEach(task => {
        task.questions.forEach((q, i) => {
            const t = normText(q.text);
            if (t && !map[t]) map[t] = { key: task.key, task, index: i };
        });
    });
    return map;
}

// ==========================================
// LISTENING
// ==========================================
async function loadListening(byKey) {
    const [tests, shortQs, res, mini, big, lAttempts] = await series([
        () => fetchAll('listening_tests', 'id, task_type, title, questions, is_mock_only'),
        () => fetchAll('listening_questions', 'id, set_number, options, correct_answer, transcript, is_mock_only'),
        () => fetchAll('listening_results', 'task_id, task_type, score_earned, score_total, user_answers, created_at'),
        () => fetchAll('listening_mini_mock_results', 'mock_test_id, detailed_answers, completed_at'),
        () => fetchAll('big_mock_listening_answers', 'attempt_id, user_answer, is_correct, created_at'),
        () => fetchAll('big_mock_listening_attempts', 'id, test_id')
    ]);
    const respRes = await fetchAll('response_results', 'set_number, user_answers, created_at');

    // задания с несколькими вопросами (диалоги, объявления, лекции)
    tests.forEach(t => {
        byKey['listening:std:' + t.id] = {
            key: 'listening:std:' + t.id, section: 'listening', type: 'std', id: t.id,
            title: t.title || ('Без названия #' + t.id),
            kind: ({ conversation: 'Диалог', announcement: 'Объявление', academic: 'Лекция' })[t.task_type] || (t.task_type || 'Задание'),
            isMockOnly: t.is_mock_only,
            questions: asArray(t.questions).map(normQuestion),
            perQuestion: true, attempts: []
        };
    });

    // короткие реплики: один вопрос = одна строка, группируем по набору
    const sets = {};
    shortQs.forEach(q => (sets[q.set_number] ||= []).push(q));
    Object.entries(sets).forEach(([set, rows]) => {
        rows.sort((a, b) => a.id - b.id);
        byKey['listening:resp:' + set] = {
            key: 'listening:resp:' + set, section: 'listening', type: 'resp', id: Number(set),
            title: 'Choose a Response · набор ' + set,
            kind: 'Короткие реплики',
            isMockOnly: rows.every(r => r.is_mock_only),
            questions: rows.map(r => normQuestion({
                text: r.transcript || ('Вопрос #' + r.id),
                options: asArray(r.options), correct_answer: r.correct_answer
            })),
            qIds: rows.map(r => r.id),
            perQuestion: true, attempts: []
        };
    });

    // практика коротких реплик: [{question_id, selected_index}]
    respRes.forEach(r => {
        const t = byKey['listening:resp:' + r.set_number];
        if (!t) return;
        const answers = {};
        (parseJson(r.user_answers) || []).forEach(a => {
            const idx = t.qIds.indexOf(a.question_id);
            if (idx !== -1 && a.selected_index !== null) answers[idx] = Number(a.selected_index);
        });
        t.attempts.push({ source: 'practice', answers, created_at: r.created_at });
    });

    // практика остальных заданий: с недавних пор сохраняются ответы
    // по вопросам; у старых прохождений их нет — тогда берём только балл
    res.forEach(r => {
        const t = byKey['listening:std:' + r.task_id];
        if (!t) return;
        const raw = parseJson(r.user_answers);
        let answers = null;
        if (raw && typeof raw === 'object' && Object.keys(raw).length) {
            answers = {};
            Object.entries(raw).forEach(([k, v]) => {
                if (v !== null && v !== '') answers[k] = Number(v);
            });
        }
        t.attempts.push({
            source: 'practice', answers, created_at: r.created_at,
            share: r.score_total ? r.score_earned / r.score_total : null
        });
    });

    // мини-пробники: std_<id>_<idx> и resp_<set>_<questionId>
    mini.forEach(row => {
        const byTask = {};
        Object.entries(parseJson(row.detailed_answers) || {}).forEach(([k, v]) => {
            if (v === null || v === '') return;
            let m = /^std_(\d+)_(\d+)$/.exec(k);
            if (m) { (byTask['listening:std:' + m[1]] ||= {})[m[2]] = Number(v); return; }
            m = /^resp_(\d+)_(\d+)$/.exec(k);
            if (m) {
                const t = byKey['listening:resp:' + m[1]];
                if (!t) return;
                const idx = t.qIds.indexOf(Number(m[2]));
                if (idx !== -1) (byTask[t.key] ||= {})[idx] = Number(v);
            }
        });
        Object.entries(byTask).forEach(([key, answers]) => {
            if (byKey[key]) byKey[key].attempts.push({ source: 'minimock', answers, created_at: row.completed_at, testId: row.mock_test_id });
        });
    });

    // полные пробники: в user_answer лежит текст вопроса и выбранный вариант
    const attemptTest = {};
    (lAttempts || []).forEach(a => attemptTest[a.id] = a.test_id);
    const lookup = buildLookup(byKey, 'listening');
    const grouped = {};
    big.forEach(row => {
        const d = parseJson(row.user_answer) || {};
        const hit = lookup[normText(d.question_text)];
        if (!hit || d.choice_index === null || d.choice_index === undefined) return;
        const g = (grouped[row.attempt_id + '|' + hit.key] ||= { key: hit.key, answers: {}, created_at: row.created_at, testId: attemptTest[row.attempt_id] });
        g.answers[hit.index] = Number(d.choice_index);
    });
    Object.values(grouped).forEach(g => byKey[g.key].attempts.push({ source: 'mock', answers: g.answers, created_at: g.created_at, testId: g.testId }));
}

// ==========================================
// WRITING и SPEAKING — проверяет преподаватель
// ==========================================
// Считаем не правильность, а работу с материалом: сколько сдано,
// сколько проверено, что ждёт очереди и какие задания не давали ни разу.
async function loadManual(byKey) {
    let wTasks = [], sTasks = [];
    try { wTasks = await fetchAll('writing_tasks', 'id, title, type, category, is_mock_only'); } catch (e) { console.warn('writing_tasks:', e.message); }
    try { sTasks = await fetchAll('speaking_tests', 'id, title, type'); } catch (e) { console.warn('speaking_tests:', e.message); }

    wTasks.forEach(t => {
        byKey['writing:task:' + t.id] = {
            key: 'writing:task:' + t.id, section: 'writing', type: 'task', id: t.id,
            title: t.title || ('Без названия #' + t.id),
            kind: ({ email: 'Write an Email', academic: 'Academic Discussion', sentence: 'Build a Sentence' })[t.type] || (t.type || 'Задание'),
            isMockOnly: t.is_mock_only, manual: true,
            questions: [], attempts: [], responses: []
        };
    });
    sTasks.forEach(t => {
        byKey['speaking:test:' + t.id] = {
            key: 'speaking:test:' + t.id, section: 'speaking', type: 'test', id: t.id,
            title: t.title || ('Без названия #' + t.id),
            kind: t.type === 'interview' ? 'Interview' : 'Listen & Repeat',
            manual: true, questions: [], attempts: [], responses: []
        };
    });

    // Build a Sentence проверяется автоматически, и его результат
    // хранится строкой вида «4/6». Раньше она превращалась в NaN,
    // а задание висело в «ожидают проверки», хотя проверять нечего.
    const parseScore = raw => {
        if (raw === null || raw === undefined || raw === '') return { value: null, auto: false };
        if (typeof raw === 'string' && raw.includes('/')) {
            const [a, b] = raw.split('/').map(Number);
            if (isFinite(a) && isFinite(b) && b > 0) return { value: (a / b) * 6, auto: true, share: a / b };
            return { value: null, auto: false };
        }
        const n = Number(raw);
        return isFinite(n) ? { value: n, auto: false } : { value: null, auto: false };
    };

    const put = (key, source, raw, created_at) => {
        const t = byKey[key];
        if (!t) return;
        const p = parseScore(raw);
        if (p.auto) t.autoGraded = true;
        t.responses.push({ source, graded: p.value !== null, score: p.value, share: p.share, auto: p.auto, created_at });
        t.attempts.push({ source, answers: null, created_at });
    };

    // практика Writing
    try {
        (await fetchAll('student_responses', 'task_id, task_type, score, teacher_correction, created_at'))
            .forEach(r => put('writing:task:' + r.task_id, 'practice',
                r.score ?? (r.teacher_correction ? null : undefined), r.created_at));
    } catch (e) { console.warn('student_responses:', e.message); }

    // мини-пробники Writing
    try {
        (await fetchAll('mini_mock_writing_responses', 'task_id, score, teacher_correction, created_at'))
            .forEach(r => put('writing:task:' + r.task_id, 'minimock', r.score, r.created_at));
    } catch (e) { console.warn('mini_mock_writing_responses:', e.message); }

    // полные пробники Writing
    try {
        (await fetchAll('big_mock_writing_answers', 'task_id, score, feedback, created_at'))
            .forEach(r => put('writing:task:' + r.task_id, 'mock', r.score, r.created_at));
    } catch (e) { console.warn('big_mock_writing_answers:', e.message); }

    // Speaking: практика по попыткам, мини-пробники и полные — по ответам
    try {
        (await fetchAll('speaking_attempts', 'test_id, score, created_at'))
            .forEach(r => put('speaking:test:' + r.test_id, 'practice', r.score, r.created_at));
    } catch (e) { console.warn('speaking_attempts:', e.message); }
    try {
        (await fetchAll('mini_mock_speaking_responses', 'task_id, score, created_at'))
            .forEach(r => put('speaking:test:' + r.task_id, 'minimock', r.score, r.created_at));
    } catch (e) { console.warn('mini_mock_speaking_responses:', e.message); }
}

// ==========================================
// Анализ
// ==========================================
// Тот же разбор, но только по выбранным попыткам — нужен, чтобы
// посмотреть, как задание отработало в конкретном пробнике.
function analyseSubset(task, filter) {
    const copy = Object.assign({}, task, { attempts: task.attempts.filter(filter) });
    analyse(copy);
    return copy;
}

function analyse(task) {
    if (task.manual) return analyseManual(task);
    const qs = task.questions, n = qs.length;
    task.bySource = { practice: 0, minimock: 0, mock: 0 };
    task.attempts.forEach(a => task.bySource[a.source]++);

    // попытки с ответами по вопросам
    const detailed = task.attempts.filter(a => a.answers);
    const scored = detailed.map(a => {
        let correct = 0, answered = 0;
        qs.forEach((q, i) => {
            const g = a.answers[String(i)] ?? a.answers[i];
            if (g === undefined || g === null) return;
            answered++;
            if (Number(g) === q.correct) correct++;
        });
        return { a, correct, answered, share: n ? correct / n : 0 };
    }).filter(x => x.answered > 0);

    task.used = scored.length;
    // средний результат: по разобранным попыткам, иначе по готовым баллам
    const plain = task.attempts.filter(a => !a.answers && typeof a.share === 'number');
    const all = scored.map(x => x.share).concat(plain.map(p => p.share));
    task.avgShare = all.length ? all.reduce((s, v) => s + v, 0) / all.length : null;
    task.totalAttempts = task.attempts.length;

    const sorted = [...scored].sort((a, b) => b.share - a.share);
    const half = Math.floor(sorted.length / 2);
    const top = sorted.slice(0, half), bottom = sorted.slice(-half);
    const get = (x, i) => x.a.answers[String(i)] ?? x.a.answers[i];

    task.items = qs.map((q, i) => {
        const counts = {};
        let answered = 0, correct = 0;
        scored.forEach(x => {
            const g = get(x, i);
            if (g === undefined || g === null) return;
            answered++; counts[g] = (counts[g] || 0) + 1;
            if (Number(g) === q.correct) correct++;
        });
        const share = answered ? correct / answered : null;
        const shareIn = grp => {
            let c = 0, tot = 0;
            grp.forEach(x => { const g = get(x, i); if (g === undefined || g === null) return; tot++; if (Number(g) === q.correct) c++; });
            return tot ? c / tot : null;
        };
        const pT = shareIn(top), pB = shareIn(bottom);
        const discrimination = (pT === null || pB === null || half < 2) ? null : pT - pB;
        const dead = q.options.map((_, oi) => oi).filter(oi => oi !== q.correct && !counts[oi]);

        const flags = [];
        if (!q.options.length) flags.push(['нет вариантов ответа', 'rose']);
        else if (q.correct === null) flags.push(['не отмечен правильный ответ', 'rose']);
        else if (q.correct < 0 || q.correct >= q.options.length) flags.push(['правильный ответ вне списка вариантов', 'rose']);
        if (answered >= 3 && share === 0) flags.push(['никто не ответил верно — вероятно, ошибка в ключе', 'rose']);
        if (answered >= MIN_ATTEMPTS) {
            if (share === 1) flags.push(['все отвечают верно — вопрос ничего не проверяет', 'amber']);
            if (discrimination !== null && discrimination < 0) flags.push(['сильные ошибаются чаще слабых', 'rose']);
            if (dead.length && q.options.length > 2) flags.push([`вариант(ы) никто не выбирает: ${dead.map(d => String.fromCharCode(65 + d)).join(', ')}`, 'amber']);
        }
        return { i, q, counts, answered, share, discrimination, dead, flags };
    });

    task.health = [];
    if (!n) task.health.push(['В задании нет вопросов', 'rose']);
    if (n && task.declared && Number(task.declared) !== n)
        task.health.push([`Заявлено вопросов: ${task.declared}, фактически: ${n}`, 'amber']);
    const texts = qs.map(q => normText(q.text)).filter(Boolean);
    if (new Set(texts).size !== texts.length) task.health.push(['Есть повторяющиеся вопросы', 'amber']);
    if (n && !task.totalAttempts) task.health.push(['Ни разу не проходили', 'gray']);
    if (n && task.totalAttempts && !task.used) task.health.push(['Есть прохождения, но без ответов по вопросам (старые записи)', 'gray']);

    task.problemCount = task.health.filter(h => h[1] === 'rose').length
        + task.items.reduce((s, it) => s + it.flags.filter(f => f[1] === 'rose').length, 0);
    task.warnCount = task.health.filter(h => h[1] === 'amber').length
        + task.items.reduce((s, it) => s + it.flags.filter(f => f[1] === 'amber').length, 0);
}

function analyseManual(task) {
    task.bySource = { practice: 0, minimock: 0, mock: 0 };
    task.attempts.forEach(a => task.bySource[a.source]++);
    task.totalAttempts = task.attempts.length;

    const graded = task.responses.filter(r => r.graded);
    task.gradedCount = graded.length;
    task.pendingCount = task.responses.length - graded.length;
    task.avgScore = graded.length
        ? graded.reduce((s, r) => s + Number(r.score), 0) / graded.length : null;
    task.avgShare = task.avgScore === null ? null : task.avgScore / 6;   // шкала 1–6
    // У автоматических заданий «непроверенных» не бывает
    if (task.autoGraded) task.pendingCount = 0;
    task.used = 0;
    task.items = [];

    task.health = [];
    if (!task.totalAttempts) task.health.push(['Ни разу не давали ученикам', 'gray']);
    // Непроверенные работы — не поломка материала, но повод вернуться
    if (!task.autoGraded && task.pendingCount >= 3) task.health.push([`Ждут проверки: ${task.pendingCount}`, 'amber']);
    task.problemCount = 0;
    task.warnCount = task.health.filter(h => h[1] === 'amber').length;
}


let testData = { mini: [], full: [] };
async function collectTests() {
    // [подпись секции, таблица попыток, поле балла, таблица тестов, поле названия]
    const MINI = [
        ['Reading',   'mock_test_results',          'band_score',             'mock_tests',           'title'],
        ['Listening', 'listening_mini_mock_results', 'final_calculated_score', 'listening_mock_tests', 'title'],
        ['Writing',   'mini_mock_writing_attempts',  'total_score',            'mini_mock_writing_tests',  'title'],
        ['Speaking',  'mini_mock_speaking_attempts', 'overall_score',          'mini_mock_speaking_tests', 'title']
    ];
    const FULL = [
        ['Reading',   'big_mock_attempts',           'total_score', 'full_tests', 'title'],
        ['Listening', 'big_mock_listening_attempts', 'total_score', 'full_tests', 'title'],
        ['Writing',   'big_mock_writing_attempts',   'total_score', 'full_tests', 'title'],
        ['Speaking',  'big_mock_speaking_attempts',  'total_score', 'full_tests', 'title']
    ];

    // Тоже по очереди: четыре секции разом давали восемь параллельных запросов
    const build = async defs => series(defs.map(([name, attTable, scoreField, testTable, titleField]) => async () => {
        try {
            const idField = attTable === 'listening_mini_mock_results' ? 'mock_test_id' : 'test_id';
            const rows = await fetchAll(attTable, `user_id, ${idField}, ${scoreField}`);
            let titles = {};
            try {
                (await fetchAll(testTable, `id, ${titleField}`)).forEach(t => titles[t.id] = t[titleField]);
            } catch (e) { /* названий нет — покажем номер */ }

            const byTest = {};
            rows.forEach(r => {
                const id = r[idField];
                const g = (byTest[id] ||= { id, attempts: 0, students: new Set(), scores: [] });
                g.attempts++;
                if (r.user_id) g.students.add(r.user_id);
                const v = Number(r[scoreField]);
                if (isFinite(v)) g.scores.push(v);
            });
            const tests = Object.values(byTest).map(g => ({
                id: g.id,
                title: titles[g.id] || ('Тест #' + g.id),
                attempts: g.attempts,
                students: g.students.size,
                avg: g.scores.length ? g.scores.reduce((a, b) => a + b, 0) / g.scores.length : null
            })).sort((a, b) => b.attempts - a.attempts);

            const all = rows.map(r => Number(r[scoreField])).filter(isFinite);
            return {
                name, tests,
                attempts: rows.length,
                students: new Set(rows.map(r => r.user_id).filter(Boolean)).size,
                avg: all.length ? all.reduce((a, b) => a + b, 0) / all.length : null
            };
        } catch (e) {
            console.warn(attTable + ':', e.message);
            return { name, tests: [], attempts: 0, students: 0, avg: null, missing: true };
        }
    }));

    testData.mini = await build(MINI);
    testData.full = await build(FULL);
}


// Загружает всё разом и возвращает готовые данные обеим страницам
async function loadLabData(onStep) {
    const byKey = {};
    const say = t => { if (onStep) onStep(t); console.log('[лаборатория]', t); };

    const step = async (label, fn) => {
        say(label + '…');
        const t0 = Date.now();
        try {
            await fn();
            say(label + ' — готово за ' + Math.round((Date.now() - t0) / 100) / 10 + ' с');
        } catch (e) {
            // Один сбойный источник не должен прятать остальные данные
            console.error('[лаборатория] ' + label + ':', e);
            say(label + ' — пропущено: ' + (e.message || e));
        }
    };

    await step('Reading', () => loadReading(byKey));
    await step('Listening', () => loadListening(byKey));
    await step('Writing и Speaking', () => loadManual(byKey));

    const list = Object.values(byKey);
    list.forEach(analyse);
    tasks = list;

    await step('Пробники', () => collectTests());
    say('Готово');
    return { tasks: list, testData };
}
