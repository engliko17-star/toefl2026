// =====================================================================
// toefl-scoring.js — балл Reading 1–6, как можно ближе к тому, как считает ETS.
//
// Подключается в tests.html (полный мок, reading-engine.js) и в
// take-mock-test.html (мини-мок). Одна копия — чтобы мини-мок и полный мок
// считали одинаково.
//
// Что известно точно (TOEFL iBT Technical Manual, 2025; ets.org):
//  • Reading — двухступенчатый адаптивный тест: роутер (20 вопросов, уровень
//    B1/B2) → нижний или верхний модуль (по 15). Всего 35 оцениваемых вопросов.
//  • Каждый вопрос — 1 балл (в Complete the Words — каждое слово).
//  • Сырой балл переводится в шкалу по IRT (true-score equating): учитывается
//    и число верных ответов, и сложность доставшегося модуля. Поэтому одно и
//    то же число верных в верхней ветке даёт балл выше, чем в нижней.
//  • Полосы 1–6 с шагом 0.5; официальная таблица соответствия 1–6 ↔ 0–30.
//
// Чего ETS не публикует — и что здесь предположено:
//  • сложность каждого вопроса — берём по этапу и типу задания (DIFF ниже);
//  • порог роутера — берём там, где начинается полоса 4.0 (B2), чуть ниже;
//  • таблица «сырой балл → полоса» — строим так, чтобы на верхней ветке
//    процент верных давал ту же полосу, что старый балл 0–30 в официальной
//    таблице ETS (CONCORDANCE ниже).
//
// Наша форма: все вопросы зачётные (Reading — 50, роутер 35 + модуль 15).
// У ETS 15 из 50 — пробные, без балла, а мы материал не обкатываем, поэтому
// в балл идёт каждый ответ с одинаковым весом.
// Если появятся настоящие данные (ответы учениц + их официальные баллы),
// подстраивать нужно DIFF и ROUTE_SHIFT — остальное пересчитается само.
// =====================================================================
(function (global) {
    'use strict';

    // Сложность вопроса в логитах: 0 — граница B1/B2 (роутер), минус — легче, плюс — труднее
    const DIFF = {
        '1':      { complete_words: 0.0,  daily_life: -0.6, academic: 0.6 },
        '2_easy': { complete_words: -1.0, daily_life: -1.4, academic: -0.6 },
        '2_hard': { complete_words: 1.0,  daily_life: 0.6,  academic: 1.4 }
    };
    // Эталонная форма ETS (Technical Manual, Table 1): роутер 10 CW + 5 Daily + 5 Academic,
    // верхний модуль 10 CW + 5 Academic
    const rep = (n, v) => Array.from({ length: n }, () => v);
    const REF_UPPER = [].concat(
        rep(10, DIFF['1'].complete_words), rep(5, DIFF['1'].daily_life), rep(5, DIFF['1'].academic),
        rep(10, DIFF['2_hard'].complete_words), rep(5, DIFF['2_hard'].academic));
    // Официальная таблица ETS: с какого балла 0–30 начинается каждая полоса Reading
    const CONCORDANCE = [[1.5, 2], [2.0, 3], [2.5, 4], [3.0, 6], [3.5, 12], [4.0, 18], [4.5, 22], [5.0, 24], [5.5, 27], [6.0, 29]];
    // Порог роутера: на сколько логитов ниже начала полосы 4.0 (≈ 13 из 20 на стандартном роутере)
    const ROUTE_SHIFT = 0.25;

    const P = (t, b) => 1 / (1 + Math.exp(b - t));

    // Способность по числу верных: θ, при которой ожидаемое число верных равно фактическому.
    // 0 и «все верно» сдвигаем на четверть балла, иначе θ уходит в бесконечность.
    function theta(bs, raw) {
        const n = bs.length;
        if (!n) return null;
        const r = Math.min(Math.max(raw, 0.25), n - 0.25);
        let lo = -10, hi = 10;
        for (let i = 0; i < 80; i++) {
            const mid = (lo + hi) / 2;
            let e = 0;
            for (let k = 0; k < n; k++) e += P(mid, bs[k]);
            if (e < r) lo = mid; else hi = mid;
        }
        return (lo + hi) / 2;
    }

    // Начало каждой полосы на шкале θ
    const CUTS = CONCORDANCE.map(([band, old]) => [band, theta(REF_UPPER, old / 30 * REF_UPPER.length)]);
    const ROUTE_THETA = CUTS.find(c => c[0] === 4.0)[1] - ROUTE_SHIFT;

    function bandOf(t) {
        let b = 1.0;
        CUTS.forEach(([band, cut]) => { if (t >= cut - 1e-9) b = band; });
        return b;
    }
    function difficulty(stage, type) {
        const s = DIFF[String(stage)] || DIFF['1'];
        const v = s[String(type)];
        return v === undefined ? s.academic : v;
    }

    // items: [{ stage: '1' | '2_easy' | '2_hard', type: 'complete_words' | 'daily_life' | 'academic', correct: true/false }]
    function score(items) {
        const list = (items || []).filter(Boolean);
        if (!list.length) return null;
        const bs = list.map(x => difficulty(x.stage, x.type));
        const raw = list.filter(x => x.correct).length;
        const t = theta(bs, raw);
        const stages = new Set(list.map(x => String(x.stage)));
        return {
            band: bandOf(t),
            theta: Math.round(t * 100) / 100,
            raw: raw,
            total: list.length,
            path: stages.has('2_hard') ? 'upper' : stages.has('2_easy') ? 'lower' : null,
            model: 'irt-1pl-v1'
        };
    }
    // Роутер: в верхний модуль, если способность по первому модулю не ниже порога
    function routeUpper(items) {
        const r = score(items);
        return !!r && r.theta >= ROUTE_THETA;
    }

    global.ToeflScoring = {
        reading: { score: score, routeUpper: routeUpper, difficulty: difficulty, cuts: CUTS, routeTheta: ROUTE_THETA, theta: theta }
    };
})(typeof window !== 'undefined' ? window : globalThis);
