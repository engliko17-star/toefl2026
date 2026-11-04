// =====================================================================
// faq.js — «Частые вопросы» на дашборде (index.html)
//
// КАК РЕДАКТИРОВАТЬ: меняйте только список FAQ ниже.
//   group — заголовок группы (вопросы с одинаковым group идут вместе);
//   q     — вопрос;
//   a     — ответ. Можно HTML: <b>жирный</b>, <br> — новая строка,
//           <a href="...">ссылка</a>, списки <ul><li>…</li></ul>.
// Чтобы добавить вопрос — скопируйте блок { … }, (с запятой после него).
// Чтобы убрать — удалите блок целиком.
// =====================================================================
const FAQ = [
    // ---------- The exam ----------
    {
        group: 'The TOEFL iBT exam',
        q: 'What does the TOEFL iBT look like now?',
        a: 'Since January 21, 2026 the exam has a new format with four sections:'
         + '<ul>'
         + '<li><b>Reading</b>: Complete the Words, Read in Daily Life, Read an Academic Passage</li>'
         + '<li><b>Listening</b>: Listen and Choose a Response, Listen to a Conversation, Listen to an Announcement, Listen to an Academic Talk</li>'
         + '<li><b>Writing</b>: Build a Sentence, Write an Email, Write for an Academic Discussion</li>'
         + '<li><b>Speaking</b>: Listen and Repeat, Take an Interview</li>'
         + '</ul>'
         + 'Testing time is about an hour and a half (Reading ~30 min, Listening ~29, Writing ~23, Speaking ~8). '
         + 'With directions and check-in, plan for about 2 hours. The test is adaptive: tasks adjust to your answers, '
         + 'so the number of questions and the timing can vary a little.'
    },
    {
        group: 'The TOEFL iBT exam',
        q: 'How is the test scored?',
        a: 'Each section gets a score <b>from 1 to 6</b> in half-point steps. Your total is the average of the four sections, '
         + 'rounded to the nearest 0.5. The scale matches CEFR levels: for example, <b>5 means C1</b>.<br>'
         + 'During a two-year transition, the score report also shows a comparable total on the old 0–120 scale.'
    },
    {
        group: 'The TOEFL iBT exam',
        q: 'What score do I need?',
        a: 'Your university or organisation sets it, so check the requirements on their website (many list both scales). '
         + 'If they only give a 0–120 score, message me and we\'ll work it out together.<br>'
         + 'You can save your target for each section in the Mock test scores table on this page.'
    },
    {
        group: 'The TOEFL iBT exam',
        q: 'When do I get my scores, and how long are they valid?',
        a: 'You see unofficial Reading and Listening scores right after the test. Official scores appear in your ETS account '
         + 'about <b>3 days</b> later, and the PDF report a day after that.<br>'
         + 'Scores are valid for <b>2 years</b> from the test date. ETS also shows <b>MyBest</b> scores: your best result in each section '
         + 'across all tests in those 2 years. Ask your university whether they accept them.'
    },
    {
        group: 'The TOEFL iBT exam',
        q: 'Can I retake the test?',
        a: 'Yes. There\'s no limit on attempts, but there is a minimum gap: under ETS rules you can test once in any 3-day period. '
         + 'Check the current rules on the ETS website before you register.'
    },
    {
        group: 'The TOEFL iBT exam',
        q: 'How do I register, and how much does it cost?',
        a: 'Register in your account on <a href="https://www.ets.org/toefl" target="_blank" rel="noopener">ets.org/toefl</a>. '
         + 'The fee depends on the country where you take the test; the site shows the exact price when you choose a date. '
         + 'Book early, as convenient dates fill up.'
    },

    // ---------- Home Edition ----------
    {
        group: 'TOEFL Home Edition',
        q: 'How is the Home Edition different from a test center?',
        a: 'It\'s the same exam with the same tasks and scores. You take it at home, and an online proctor watches through your camera. '
         + 'Most universities accept it just like the test center version; if you\'re not sure, ask yours.'
    },
    {
        group: 'TOEFL Home Edition',
        q: 'What do I need for the Home Edition?',
        a: '<ul>'
         + '<li>A desktop or laptop, <b>not a tablet or phone</b>, with Windows 11 or later or macOS 10.13 or later; one monitor and one keyboard.</li>'
         + '<li>A camera (built-in or separate): you\'ll show the proctor a 360° view of the room, your desk and the area under it.</li>'
         + '<li>A microphone that is <b>not</b> part of a headset, and speakers: <b>headphones and headsets aren\'t allowed</b>.</li>'
         + '<li>You\'re alone in the room with the door closed, nothing extra on the desk, and your phone out of reach.</li>'
         + '<li>A standard chair (not a bed or sofa), no food or drinks, your face and ears visible.</li>'
         + '</ul>'
         + 'See the full list on the <a href="https://www.ets.org/toefl/test-takers/ibt/register/at-home-requirements.html" target="_blank" rel="noopener">ETS requirements page</a>. '
         + 'Check everything a few days before the test: if your setup doesn\'t meet the rules, you can\'t take the test and the fee isn\'t refunded.'
    },
    {
        group: 'TOEFL Home Edition',
        q: 'Can I take notes at home?',
        a: 'Yes, but <b>not on paper</b>. You can use either one small whiteboard with an erasable marker, '
         + 'or one sheet of paper inside a clear sheet protector, written on with an erasable marker. '
         + 'At the end of the test you show the proctor that everything is erased.'
    },

    // ---------- Preparation ----------
    {
        group: 'Preparing for the test',
        q: 'How long should I prepare?',
        a: 'It depends on your starting level and the score you need, so we plan it together. '
         + 'What matters most is consistency: 40–60 minutes every day does more than 4–5 hours once a week.'
    },
    {
        group: 'Preparing for the test',
        q: 'Where do I start on this platform?',
        a: '<ul>'
         + '<li><b>Articles.</b> On the Reading, Listening, Writing and Speaking pages, open All articles to learn each task type and its strategies.</li>'
         + '<li><b>Practice</b> by task type on the same pages.</li>'
         + '<li><b>Mini-mocks</b>: short practice tests for each section.</li>'
         + '<li><b>Mock Tests</b>: full practice exams.</li>'
         + '</ul>'
         + 'And a little Vocabulary and Irregular Verbs every day.'
    },
    {
        group: 'Preparing for the test',
        q: 'When should I take a full mock test?',
        a: 'Take the first one once you know every task type, so you have a starting point. After that, every 1–2 weeks, '
         + 'and always 1–2 weeks before the exam. Do it in one sitting, in a quiet room, so the result is close to the real thing.'
    },

    // ---------- The platform ----------
    {
        group: 'Using the platform',
        q: 'Who checks my essays and speaking, and when do I get a score?',
        a: 'Reading, Listening and Build a Sentence are checked automatically, right away. I check essays (Email, Academic Discussion) '
         + 'and speaking recordings myself; the score and comments appear in the task results, usually within 1–2 days.'
    },
    {
        group: 'Using the platform',
        q: 'How many times can I rewrite an essay?',
        a: 'In practice you get up to <b>3 attempts</b> per essay. You can send a new attempt once the previous one has been checked, '
         + 'so you can use the comments.'
    },
    {
        group: 'Using the platform',
        q: 'Why is a section or test locked?',
        a: 'Your teacher opens access to sections. If something is locked that you expected to use, message me.'
    }
];

// ---------- Отрисовка (менять не нужно) ----------
(function () {
    function render() {
        var box = document.getElementById('faqList');
        if (!box) return;
        if (!document.getElementById('faqStyle')) {
            var st = document.createElement('style');
            st.id = 'faqStyle';
            st.textContent = '.faq-item summary::-webkit-details-marker{display:none}.faq-item summary{list-style:none}'
                + '.faq-item[open] .faq-chev{transform:rotate(180deg)}.faq-answer ul{list-style:disc;padding-left:1.1rem;margin:.4rem 0}'
                + '.faq-answer li{margin:.15rem 0}.faq-answer a{color:#4f46e5;font-weight:600;text-decoration:underline}';
            document.head.appendChild(st);
        }
        var groups = [];
        FAQ.forEach(function (f) {
            var g = groups.find(function (x) { return x.name === f.group; });
            if (!g) groups.push(g = { name: f.group, items: [] });
            g.items.push(f);
        });
        var chev = '<svg class="faq-chev w-4 h-4 shrink-0 text-gray-400 transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
        var groupHtml = function (g) {
            return '<div class="space-y-2">'
                + '<h3 class="text-sm font-bold text-slate-700 px-1">' + g.name + '</h3>'
                + g.items.map(function (f) {
                    return '<details class="faq-item bg-white rounded-2xl border border-gray-100 overflow-hidden">'
                        + '<summary class="flex items-center justify-between gap-3 px-4 py-3.5 cursor-pointer select-none hover:bg-gray-50/70 transition">'
                        + '<span class="text-sm font-semibold text-slate-800">' + f.q + '</span>' + chev + '</summary>'
                        + '<div class="faq-answer px-4 pb-4 -mt-1 text-[13px] text-slate-600 leading-relaxed">' + f.a + '</div>'
                        + '</details>';
                }).join('')
                + '</div>';
        };
        // На широком экране — две колонки: группы делятся примерно поровну по числу вопросов
        var total = FAQ.length, left = [], right = [], n = 0;
        groups.forEach(function (g) { if (n < total / 2) { left.push(g); n += g.items.length; } else right.push(g); });
        box.innerHTML = '<div class="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-5 items-start">'
            + '<div class="space-y-5">' + left.map(groupHtml).join('') + '</div>'
            + '<div class="space-y-5">' + right.map(groupHtml).join('') + '</div></div>';
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
    else render();
})();
