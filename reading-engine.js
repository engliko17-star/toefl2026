// =============================================================
// ПАТЧ К reading-engine.js
// 1) Complete the Words считается по пропускам, а не «всё или ничего»
// 2) Итоговый балл зависит от того, в какую ветку ушёл ученик
// =============================================================


// -------------------------------------------------------------
// ШАГ 1. Добавить эту функцию один раз (например, рядом с
// calculateTOEFLScore, строка ~491).
// -------------------------------------------------------------

function scoreCompleteWords(task) {
    const correct = task.correctWords || [];
    const user = task.userWords || [];
    let hit = 0;
    correct.forEach((w, i) => {
        const u = (user[i] || '').trim().toLowerCase();
        if (u && u === String(w).trim().toLowerCase()) hit++;
    });
    return { correct: hit, total: correct.length };
}


// -------------------------------------------------------------
// ШАГ 2. Заменить блок подсчёта в loadModule2Tasks (строки ~464-474).
//
// БЫЛО:
//     if (task.type === 'complete_words') {
//         module1Total++;
//         let isTaskCorrect = task.userWords && task.correctWords &&
//             task.userWords.join(',').toLowerCase() === task.correctWords.join(',').toLowerCase();
//         if (isTaskCorrect) correctCount++;
//     } else if (...)
//
// СТАЛО:
// -------------------------------------------------------------

for (let task of currentTasks) {
    if (task.stage === '1') {
        if (task.type === 'complete_words') {
            const s = scoreCompleteWords(task);
            module1Total += s.total;      // каждый пропуск = отдельный балл
            correctCount += s.correct;
        } else if (task.correctAnswer !== null && task.correctAnswer !== undefined) {
            module1Total++;
            if (task.userAnswer && task.userAnswer === task.correctAnswer) correctCount++;
        }
    }
}


// -------------------------------------------------------------
// ШАГ 3. Тот же блок в функции сохранения результатов (строки ~637-647).
// -------------------------------------------------------------

currentTasks.forEach((task) => {
    if (task.type === 'complete_words') {
        const s = scoreCompleteWords(task);
        totalQuestions += s.total;
        correctAnswers += s.correct;
    } else if (task.correctAnswer !== null && task.correctAnswer !== undefined) {
        totalQuestions++;
        if (task.userAnswer === task.correctAnswer) correctAnswers++;
    }
});


// -------------------------------------------------------------
// ШАГ 4. Тот же блок в восстановлении результатов для Review
// (строки ~741-756).
// -------------------------------------------------------------

reconstructedTasks.forEach(task => {
    if (task.type === 'complete_words') {
        let ans = answers.find(a => a.task_id === task.taskId && a.task_type === 'complete_words');
        if (ans && ans.answer_json) task.userWords = ans.answer_json.userWords || [];

        const s = scoreCompleteWords(task);
        totalCount += s.total;
        correctCount += s.correct;
    } else {
        let ans = answers.find(a => a.task_id === task.taskId && a.answer_json && a.answer_json.question === task.question);
        if (ans) task.userAnswer = ans.answer_text;

        if (task.correctAnswer !== null && task.correctAnswer !== undefined) {
            totalCount++;
            if (task.userAnswer === task.correctAnswer) correctCount++;
        }
    }
});


// -------------------------------------------------------------
// ШАГ 5. Сохранение ответа по complete_words (строки ~672-676).
// Кладём в answer_json частичный результат, чтобы потом было видно
// «7 из 10», а не только голое true/false.
// -------------------------------------------------------------

if (task.type === 'complete_words') {
    const s = scoreCompleteWords(task);
    answerJson.userWords = task.userWords;
    answerJson.correctWords = task.correctWords;
    answerJson.correctCount = s.correct;
    answerJson.totalCount = s.total;
    isCorrect = s.correct === s.total && s.total > 0;
} else {
    answerText = task.userAnswer;
    isCorrect = task.userAnswer === task.correctAnswer;
}


// -------------------------------------------------------------
// ШАГ 6. Балл, зависящий от ветки. Заменить calculateTOEFLScore
// целиком (строки ~491-496).
//
// Сейчас 100% в Lower даёт те же 6.0, что и 100% в Upper. Для
// двухступенчатого адаптивного теста это неверно: полосы должны
// быть разные и частично перекрываться.
// -------------------------------------------------------------

function calculateTOEFLScore(correct, total, branch) {
    if (total === 0) return "1.0";
    const ratio = correct / total;

    // Lower: 1.0–4.0, Upper: 3.0–6.0. Перекрытие 3.0–4.0 — это
    // зона, где обе ветки дают сопоставимую оценку.
    const [min, max] = (branch === '2_hard') ? [3.0, 6.0] : [1.0, 4.0];

    const score = min + ratio * (max - min);
    return (Math.round(score * 2) / 2).toFixed(1);
}


// -------------------------------------------------------------
// ШАГ 7. Передать ветку в вызов (строка ~649).
//
// БЫЛО:  const finalScore = calculateTOEFLScore(correctAnswers, totalQuestions);
// СТАЛО:
// -------------------------------------------------------------

const branch = currentTasks.some(t => t.stage === '2_hard') ? '2_hard' : '2_easy';
const finalScore = calculateTOEFLScore(correctAnswers, totalQuestions, branch);


// -------------------------------------------------------------
// ШАГ 8. Константы вверху файла (строки ~41-42 и ~477).
//
// Роутер теперь 30 айтемов, второй модуль 20.
//   let module1TimeMinutes = 21;   // blueprint: 18–21 на роутер
//   let module2TimeMinutes = 11;   // blueprint: 9 (lower) / 11 (upper)
//
// ПОРОГ РОУТИНГА: менять ТОЛЬКО ПОСЛЕ шага 2. Сейчас 0.5 считается от
// знаменателя ~12, после фикса знаменатель станет 30, и смысл порога
// изменится полностью. Стартовое значение по спеке — 18/30 = 0.6:
//   const thresholdPercentage = 0.6;
// Дальше подстраивать так, чтобы примерно половина учеников уходила в Upper.
// -------------------------------------------------------------
