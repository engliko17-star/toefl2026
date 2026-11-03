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
    // ---------- Экзамен ----------
    {
        group: 'Экзамен TOEFL iBT',
        q: 'Как устроен TOEFL iBT сейчас?',
        a: 'С 21 января 2026 года экзамен идёт в новом формате. Четыре части:'
         + '<ul>'
         + '<li><b>Reading</b> — Complete the Words, Read in Daily Life, Read an Academic Passage;</li>'
         + '<li><b>Listening</b> — Listen and Choose a Response, Listen to a Conversation, Listen to an Announcement, Listen to an Academic Talk;</li>'
         + '<li><b>Writing</b> — Build a Sentence, Write an Email, Write for an Academic Discussion;</li>'
         + '<li><b>Speaking</b> — Listen and Repeat, Take an Interview.</li>'
         + '</ul>'
         + 'Чистое время — около полутора часов (Reading ~30 мин, Listening ~29, Writing ~23, Speaking ~8). '
         + 'С инструкциями и проверкой перед стартом закладывайте около 2 часов. '
         + 'Тест адаптивный: задания подстраиваются под ваши ответы, поэтому число вопросов и время могут немного отличаться.'
    },
    {
        group: 'Экзамен TOEFL iBT',
        q: 'Как теперь считаются баллы?',
        a: 'Каждая часть оценивается по шкале <b>от 1 до 6</b> с шагом 0,5. Общий балл — среднее четырёх частей, '
         + 'округлённое до 0,5. Шкала привязана к уровням CEFR: например, <b>5 — это уровень C1</b>.<br>'
         + 'В переходный период (два года) в отчёте есть и сопоставимый общий балл по старой шкале 0–120.'
    },
    {
        group: 'Экзамен TOEFL iBT',
        q: 'Какой балл мне нужен?',
        a: 'Его задаёт вуз или организация, куда вы подаёте документы, — смотрите требования на их сайте '
         + '(часто там указаны обе шкалы). Если требование дано только по старой шкале 0–120 — напишите мне, разберёмся вместе.<br>'
         + 'Свои цели по каждой части можно записать на дашборде в блоке «Ваши результаты».'
    },
    {
        group: 'Экзамен TOEFL iBT',
        q: 'Когда придут результаты и сколько они действуют?',
        a: 'Неофициальные баллы за Reading и Listening видны сразу после экзамена. Официальные появляются в аккаунте ETS '
         + 'примерно <b>через 3 дня</b>, PDF-отчёт — на следующий день после них.<br>'
         + 'Баллы действительны <b>2 года</b> с даты экзамена. ETS также показывает <b>MyBest</b> — лучшие баллы по каждой части '
         + 'за все попытки за эти 2 года; принимает ли их ваш вуз, уточните у вуза.'
    },
    {
        group: 'Экзамен TOEFL iBT',
        q: 'Можно ли пересдать?',
        a: 'Да, число попыток не ограничено, но между попытками есть минимальный перерыв — по правилам ETS сдавать можно '
         + 'не чаще одного раза в 3 дня. Перед регистрацией проверьте актуальные правила на сайте ETS.'
    },
    {
        group: 'Экзамен TOEFL iBT',
        q: 'Как зарегистрироваться и сколько стоит экзамен?',
        a: 'Регистрация — в личном аккаунте на сайте <a href="https://www.ets.org/toefl" target="_blank" rel="noopener">ets.org/toefl</a>. '
         + 'Цена зависит от страны, в которой вы сдаёте: точную сумму сайт покажет при выборе даты. '
         + 'Регистрируйтесь заранее — удобные даты разбирают.'
    },

    // ---------- Home Edition ----------
    {
        group: 'TOEFL Home Edition',
        q: 'Чем Home Edition отличается от экзамена в центре?',
        a: 'Это тот же экзамен — те же задания и те же баллы. Только вы сдаёте его дома, а за вами через камеру следит онлайн-проктор. '
         + 'Большинство вузов принимают его так же, как экзамен в центре; если сомневаетесь — уточните у своего вуза.'
    },
    {
        group: 'TOEFL Home Edition',
        q: 'Что нужно подготовить для Home Edition?',
        a: '<ul>'
         + '<li>Компьютер или ноутбук — <b>не планшет и не телефон</b>; Windows 11 и новее или macOS 10.13 и новее; один монитор и одна клавиатура.</li>'
         + '<li>Камера (встроенная или отдельная) — нужно будет показать комнату на 360°, стол и место под ним.</li>'
         + '<li>Микрофон, который <b>не</b> часть гарнитуры, и колонки: <b>наушники и гарнитуры запрещены</b>.</li>'
         + '<li>Вы одни в комнате, дверь закрыта, на столе ничего лишнего, телефон убран так, чтобы до него не дотянуться.</li>'
         + '<li>Обычный стул (не кровать и не диван), без еды и напитков, лицо и уши открыты.</li>'
         + '</ul>'
         + 'Полный список — на <a href="https://www.ets.org/toefl/test-takers/ibt/register/at-home-requirements.html" target="_blank" rel="noopener">странице требований ETS</a>. '
         + 'Проверьте всё за несколько дней до экзамена: если условия не выполнены, к экзамену не допустят и деньги не вернут.'
    },
    {
        group: 'TOEFL Home Edition',
        q: 'Можно ли делать заметки дома?',
        a: 'Да, но <b>не на бумаге</b>. Можно одно из двух: небольшую маркерную доску со стираемым маркером '
         + 'или один лист в прозрачном файле, на котором пишут стираемым маркером. '
         + 'В конце экзамена нужно показать проктору, что всё стёрто.'
    },

    // ---------- Подготовка ----------
    {
        group: 'Подготовка',
        q: 'Сколько времени нужно на подготовку?',
        a: 'Зависит от стартового уровня и нужного балла — план мы составляем индивидуально. '
         + 'Главное — регулярность: 40–60 минут каждый день дают больше, чем 4–5 часов раз в неделю.'
    },
    {
        group: 'Подготовка',
        q: 'С чего начать на платформе?',
        a: '<ul>'
         + '<li><b>Статьи.</b> На страницах Reading, Listening, Writing и Speaking — кнопка «All articles»: там формат каждого задания и стратегии.</li>'
         + '<li><b>Практика</b> по типам заданий — на тех же страницах.</li>'
         + '<li><b>Мини-моки</b> — короткие пробные тесты по каждой части.</li>'
         + '<li><b>Mock Tests</b> — полные пробные экзамены.</li>'
         + '</ul>'
         + 'И каждый день немного Vocabulary и Irregular Verbs.'
    },
    {
        group: 'Подготовка',
        q: 'Когда проходить полный мок-тест?',
        a: 'Первый — когда вы познакомились с форматом всех заданий: так появится точка отсчёта. Дальше — раз в 1–2 недели '
         + 'и обязательно за 1–2 недели до экзамена. Проходите целиком, за один раз и в тишине — так результат ближе к настоящему.'
    },

    // ---------- Платформа ----------
    {
        group: 'Платформа',
        q: 'Кто проверяет эссе и Speaking? Когда будет оценка?',
        a: 'Reading, Listening и Build a Sentence проверяются автоматически, сразу. Эссе (Email, Academic Discussion) '
         + 'и записи Speaking проверяю я — оценка и комментарии появятся в результатах задания, обычно в течение 1–2 дней.'
    },
    {
        group: 'Платформа',
        q: 'Сколько раз можно переписать эссе?',
        a: 'В практике — до <b>3 попыток</b> на каждое эссе. Новую попытку можно отправить после того, как прошлую проверили, '
         + '— чтобы учесть комментарии.'
    },
    {
        group: 'Платформа',
        q: 'Почему на разделе или тесте замок?',
        a: 'Доступ к разделам открывает преподаватель. Если замок там, где вы ожидали доступ, — напишите мне.'
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
        box.innerHTML = groups.map(function (g) {
            return '<div class="space-y-2">'
                + '<h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1 pt-2">' + g.name + '</h4>'
                + g.items.map(function (f) {
                    return '<details class="faq-item bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">'
                        + '<summary class="flex items-center justify-between gap-3 px-4 py-3.5 cursor-pointer select-none hover:bg-gray-50/70 transition">'
                        + '<span class="text-sm font-semibold text-slate-800">' + f.q + '</span>' + chev + '</summary>'
                        + '<div class="faq-answer px-4 pb-4 -mt-1 text-[13px] text-slate-600 leading-relaxed">' + f.a + '</div>'
                        + '</details>';
                }).join('')
                + '</div>';
        }).join('');
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
    else render();
})();
