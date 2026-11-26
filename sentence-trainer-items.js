// =====================================================================
// Задания тренажёра Sentence Preparation (sentence-practice.html).
// Уровни построены по реальным заданиям Build a Sentence (is_real_toefl):
// тот же формат — реплика собеседника, предложение с пропусками, кусочки
// по 1–3 слова со строчной буквы, иногда один лишний кусочек.
// structure: {type:"slot"} — пропуск, {type:"text",value} — уже вписанный текст.
// =====================================================================
window.SENTENCE_TRAINER = [
 {
  "id": "word-order",
  "icon": "arrow-right",
  "title": "Word Order in Statements",
  "ru": "Порядок слов в утверждении",
  "sum": "Кто → что делает → что/кого → где → когда",
  "rule": [
   "В английском порядок слов жёсткий: **подлежащее → глагол → дополнение**. Подлежащее почти всегда стоит перед глаголом.",
   "Место и время идут в конце предложения, обычно сначала **где**, потом **когда**.",
   "Слова, которые держатся вместе (an urgent meeting, next to, the printer), в задании часто даны одним кусочком: собирайте предложение из смысловых блоков."
  ],
  "examples": [
   "I | had | an urgent meeting | with my advisor.",
   "The next shuttle | leaves | from the main gate | in ten minutes."
  ],
  "items": [
   {
    "id": "word-order-1",
    "prompt_context": "Why didn't you come to the study group yesterday?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "with"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "I",
     "had",
     "an urgent",
     "meeting",
     "my advisor"
    ],
    "bank": [
     "I",
     "had",
     "an urgent",
     "meeting",
     "my advisor"
    ],
    "sample_answer": "I had an urgent meeting with my advisor.",
    "explanation": "Подлежащее I → глагол had → что именно (an urgent meeting) → с кем (with my advisor)."
   },
   {
    "id": "word-order-2",
    "prompt_context": "Where did you leave the lab report?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "the"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "I",
     "put",
     "it",
     "on",
     "shelf",
     "next to",
     "the printer"
    ],
    "bank": [
     "I",
     "put",
     "it",
     "on",
     "shelf",
     "next to",
     "the printer"
    ],
    "sample_answer": "I put it on the shelf next to the printer.",
    "explanation": "Put it on the shelf — «положил его на полку»; уточнение места (next to the printer) идёт в самом конце."
   },
   {
    "id": "word-order-3",
    "prompt_context": "How was your weekend?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "in"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "we",
     "went",
     "hiking",
     "the mountains",
     "with",
     "some friends"
    ],
    "bank": [
     "we",
     "went",
     "hiking",
     "the mountains",
     "with",
     "some friends"
    ],
    "sample_answer": "We went hiking in the mountains with some friends.",
    "explanation": "Сначала глагол и действие (went hiking), потом где (in the mountains), потом с кем (with some friends)."
   },
   {
    "id": "word-order-4",
    "prompt_context": "Is the campus bookstore still open?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "on"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "it",
     "closes",
     "at",
     "six",
     "weekdays"
    ],
    "bank": [
     "it",
     "closes",
     "at",
     "six",
     "weekdays"
    ],
    "sample_answer": "It closes at six on weekdays.",
    "explanation": "It closes — подлежащее и глагол, затем время: at six on weekdays."
   },
   {
    "id": "word-order-5",
    "prompt_context": "Do you have a job this semester?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "at"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "I",
     "work",
     "the campus café",
     "three days",
     "a week"
    ],
    "bank": [
     "I",
     "work",
     "the campus café",
     "three days",
     "a week"
    ],
    "sample_answer": "I work at the campus café three days a week.",
    "explanation": "Где работаю (at the campus café) идёт перед тем, как часто (three days a week)."
   },
   {
    "id": "word-order-6",
    "prompt_context": "Why are you carrying so many books?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "for"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "I",
     "need",
     "them",
     "my history",
     "presentation"
    ],
    "bank": [
     "I",
     "need",
     "them",
     "my history",
     "presentation"
    ],
    "sample_answer": "I need them for my history presentation.",
    "explanation": "Need them — «нужны мне»; for my history presentation — для чего. Прилагательное-существительное history стоит перед presentation."
   },
   {
    "id": "word-order-7",
    "prompt_context": "Where is the new student lounge?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "of"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "it",
     "is",
     "on",
     "the second floor",
     "the library"
    ],
    "bank": [
     "it",
     "is",
     "on",
     "the second floor",
     "the library"
    ],
    "sample_answer": "It is on the second floor of the library.",
    "explanation": "On the second floor of the library — «на втором этаже библиотеки»: сначала этаж, потом чего."
   },
   {
    "id": "word-order-8",
    "prompt_context": "Did you enjoy the concert?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "of"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "the band",
     "played",
     "all",
     "their",
     "popular",
     "songs"
    ],
    "bank": [
     "the band",
     "played",
     "all",
     "their",
     "popular",
     "songs"
    ],
    "sample_answer": "The band played all of their popular songs.",
    "explanation": "All of their popular songs: all of + their + прилагательное + существительное."
   },
   {
    "id": "word-order-9",
    "prompt_context": "When does the shuttle leave?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "from"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "the next one",
     "leaves",
     "the main gate",
     "in",
     "ten minutes"
    ],
    "bank": [
     "the next one",
     "leaves",
     "the main gate",
     "in",
     "ten minutes"
    ],
    "sample_answer": "The next one leaves from the main gate in ten minutes.",
    "explanation": "Сначала откуда (from the main gate), потом когда (in ten minutes)."
   },
   {
    "id": "word-order-10",
    "prompt_context": "What did the professor say about the exam?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "a"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "she",
     "gave",
     "us",
     "list",
     "of",
     "key topics"
    ],
    "bank": [
     "she",
     "gave",
     "us",
     "list",
     "of",
     "key topics"
    ],
    "sample_answer": "She gave us a list of key topics.",
    "explanation": "Gave us a list — «дала нам список»: кому (us) стоит сразу после глагола, потом что (a list of key topics)."
   },
   {
    "id": "word-order-11",
    "prompt_context": "Why are you in such a hurry?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "these"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "I",
     "have to",
     "return",
     "books",
     "before noon"
    ],
    "bank": [
     "I",
     "have to",
     "return",
     "books",
     "before noon"
    ],
    "sample_answer": "I have to return these books before noon.",
    "explanation": "Have to return — «нужно вернуть»; что (these books), потом когда (before noon)."
   },
   {
    "id": "word-order-12",
    "prompt_context": "How did you hear about the internship?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "a"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "my roommate",
     "sent",
     "me",
     "link",
     "to",
     "the website"
    ],
    "bank": [
     "my roommate",
     "sent",
     "me",
     "link",
     "to",
     "the website"
    ],
    "sample_answer": "My roommate sent me a link to the website.",
    "explanation": "Sent me a link — кому (me) перед чем (a link); to the website уточняет ссылку."
   }
  ]
 },
 {
  "id": "yes-no",
  "icon": "help-circle",
  "title": "Yes/No Questions",
  "ru": "Общие вопросы",
  "sum": "Do / Does / Did, be, have, can, will — в начале",
  "rule": [
   "В общем вопросе **вспомогательный глагол стоит перед подлежащим**: Do you…? Is it…? Have you…? Can I…?",
   "После do / does / did основной глагол — **в начальной форме**: Does she like…? (не likes), Did you submit…? (не submitted).",
   "Does — для he / she / it, do — для I / you / we / they. Лишний кусочек в задании часто проверяет именно это."
  ],
  "examples": [
   "Do | you | need | a ride | to the event?",
   "Did | you | submit | it | before the deadline?"
  ],
  "items": [
   {
    "id": "yes-no-1",
    "prompt_context": "I'm going to the career fair tomorrow.",
    "structure": [
     {
      "type": "text",
      "value": "Do"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "you",
     "need",
     "a ride",
     "to",
     "the event"
    ],
    "bank": [
     "you",
     "need",
     "a ride",
     "to",
     "the event"
    ],
    "sample_answer": "Do you need a ride to the event?",
    "explanation": "Общий вопрос в Present Simple: Do + you + глагол в начальной форме (need)."
   },
   {
    "id": "yes-no-2",
    "prompt_context": "My sister just moved to Chicago.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "her"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "does",
     "she",
     "like",
     "new",
     "apartment"
    ],
    "bank": [
     "does",
     "she",
     "like",
     "new",
     "apartment",
     "do"
    ],
    "sample_answer": "Does she like her new apartment?",
    "explanation": "She — третье лицо, поэтому Does, а глагол like без -s. Do здесь лишний."
   },
   {
    "id": "yes-no-3",
    "prompt_context": "I finally finished my research paper.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "before"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "did",
     "you",
     "submit",
     "it",
     "the deadline"
    ],
    "bank": [
     "did",
     "you",
     "submit",
     "it",
     "the deadline",
     "does"
    ],
    "sample_answer": "Did you submit it before the deadline?",
    "explanation": "Вопрос о прошлом: Did + подлежащее + submit в начальной форме. Does не подходит — речь о прошлом."
   },
   {
    "id": "yes-no-4",
    "prompt_context": "The library is extending its hours.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "during"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "will",
     "it",
     "stay",
     "open",
     "the weekend"
    ],
    "bank": [
     "will",
     "it",
     "stay",
     "open",
     "the weekend"
    ],
    "sample_answer": "Will it stay open during the weekend?",
    "explanation": "Will + подлежащее + глагол: Will it stay open…?"
   },
   {
    "id": "yes-no-5",
    "prompt_context": "I'm thinking about joining the chess club.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "difficult"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "is",
     "it",
     "to",
     "become",
     "a member"
    ],
    "bank": [
     "is",
     "it",
     "to",
     "become",
     "a member"
    ],
    "sample_answer": "Is it difficult to become a member?",
    "explanation": "Is it difficult to…? — «Трудно ли…?»: is перед it, после прилагательного — to + глагол."
   },
   {
    "id": "yes-no-6",
    "prompt_context": "Professor Lee posted the grades.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "your"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "have",
     "you",
     "checked",
     "score",
     "yet"
    ],
    "bank": [
     "have",
     "you",
     "checked",
     "score",
     "yet"
    ],
    "sample_answer": "Have you checked your score yet?",
    "explanation": "Present Perfect в вопросе: Have + you + checked; yet в конце вопроса — «уже»."
   },
   {
    "id": "yes-no-7",
    "prompt_context": "I left my calculator at home.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "for"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "can",
     "I",
     "borrow",
     "yours",
     "the quiz"
    ],
    "bank": [
     "can",
     "I",
     "borrow",
     "yours",
     "the quiz"
    ],
    "sample_answer": "Can I borrow yours for the quiz?",
    "explanation": "Can + I + глагол: Can I borrow…? Yours — «твой» (вместо your calculator)."
   },
   {
    "id": "yes-no-8",
    "prompt_context": "The new café on campus opened last week.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "to"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "do",
     "they",
     "offer",
     "discounts",
     "students"
    ],
    "bank": [
     "do",
     "they",
     "offer",
     "discounts",
     "students",
     "does"
    ],
    "sample_answer": "Do they offer discounts to students?",
    "explanation": "They — множественное число, поэтому Do; глагол offer без -s. Does лишний."
   },
   {
    "id": "yes-no-9",
    "prompt_context": "Our group meeting got moved to Friday.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "in"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "is",
     "it",
     "still",
     "the same",
     "room"
    ],
    "bank": [
     "is",
     "it",
     "still",
     "the same",
     "room"
    ],
    "sample_answer": "Is it still in the same room?",
    "explanation": "Is it still…? — still стоит после подлежащего, перед местом."
   },
   {
    "id": "yes-no-10",
    "prompt_context": "I watched the documentary you recommended.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "as"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "did",
     "you",
     "find",
     "it",
     "interesting",
     "as I did"
    ],
    "bank": [
     "did",
     "you",
     "find",
     "it",
     "interesting",
     "as I did"
    ],
    "sample_answer": "Did you find it as interesting as I did?",
    "explanation": "Did you find it…? — «Тебе показалось…?»; сравнение as interesting as I did."
   },
   {
    "id": "yes-no-11",
    "prompt_context": "My laptop keeps freezing.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "restarting"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "have",
     "you",
     "tried",
     "it",
     "recently"
    ],
    "bank": [
     "have",
     "you",
     "tried",
     "it",
     "recently"
    ],
    "sample_answer": "Have you tried restarting it recently?",
    "explanation": "Have you tried + -ing — «пробовал ли ты…»; recently в конце."
   },
   {
    "id": "yes-no-12",
    "prompt_context": "We're having a study session tonight.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "my"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "should",
     "I",
     "bring",
     "notes",
     "from",
     "last week"
    ],
    "bank": [
     "should",
     "I",
     "bring",
     "notes",
     "from",
     "last week"
    ],
    "sample_answer": "Should I bring my notes from last week?",
    "explanation": "Should + I + глагол: Should I bring…?"
   }
  ]
 },
 {
  "id": "wh-questions",
  "icon": "message-circle-question",
  "title": "Wh- Questions",
  "ru": "Вопросы с what / where / how",
  "sum": "Вопросительное слово → вспомогательный глагол → подлежащее",
  "rule": [
   "Порядок: **вопросительное слово → вспомогательный глагол → подлежащее → основной глагол**. Where are you taking classes?",
   "Вопросительное слово может быть из нескольких слов: How long, What time, How much, Which building, What kind of.",
   "Предлог часто уходит **в конец** вопроса: What are you focusing on? Who does it belong to?",
   "Если who / what — само подлежащее, вспомогательного глагола нет: Who gave the best speech?"
  ],
  "examples": [
   "How long | will | they | be | staying | here?",
   "What topic | are | you | focusing | on?"
  ],
  "items": [
   {
    "id": "wh-questions-1",
    "prompt_context": "I've just signed up for a pottery class.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "the"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "when",
     "does",
     "first",
     "lesson",
     "start"
    ],
    "bank": [
     "when",
     "does",
     "first",
     "lesson",
     "start"
    ],
    "sample_answer": "When does the first lesson start?",
    "explanation": "When + does + the first lesson + start. После does — start без -s."
   },
   {
    "id": "wh-questions-2",
    "prompt_context": "I'm writing a paper for my sociology class.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "are"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "what",
     "topic",
     "you",
     "focusing",
     "on"
    ],
    "bank": [
     "what",
     "topic",
     "you",
     "focusing",
     "on"
    ],
    "sample_answer": "What topic are you focusing on?",
    "explanation": "What topic — вопросительное слово из двух; предлог on уходит в конец: focusing on."
   },
   {
    "id": "wh-questions-3",
    "prompt_context": "Our guests from Japan arrived yesterday.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "be"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "how long",
     "will",
     "they",
     "staying",
     "here"
    ],
    "bank": [
     "how long",
     "will",
     "they",
     "staying",
     "here"
    ],
    "sample_answer": "How long will they be staying here?",
    "explanation": "How long + will + they + be staying: вспомогательный will перед подлежащим."
   },
   {
    "id": "wh-questions-4",
    "prompt_context": "The concert was moved to a different venue.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "being"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "where",
     "is",
     "it",
     "held",
     "now"
    ],
    "bank": [
     "where",
     "is",
     "it",
     "held",
     "now"
    ],
    "sample_answer": "Where is it being held now?",
    "explanation": "Where + is + it + being held: пассив в Present Continuous — «где его проводят»."
   },
   {
    "id": "wh-questions-5",
    "prompt_context": "I'm going to the dentist this afternoon.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "need"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "what time",
     "do",
     "you",
     "to",
     "be",
     "there"
    ],
    "bank": [
     "what time",
     "do",
     "you",
     "to",
     "be",
     "there"
    ],
    "sample_answer": "What time do you need to be there?",
    "explanation": "What time + do + you + need to be there."
   },
   {
    "id": "wh-questions-6",
    "prompt_context": "Somebody left a bag in the classroom.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "think"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "who",
     "do",
     "you",
     "it",
     "belongs to"
    ],
    "bank": [
     "who",
     "do",
     "you",
     "it",
     "belongs to",
     "does"
    ],
    "sample_answer": "Who do you think it belongs to?",
    "explanation": "Who do you think… — «Как думаешь, чей…»; после do you think идёт обычный порядок: it belongs to. Does лишний: после do you think вопрос уже не инвертируется."
   },
   {
    "id": "wh-questions-7",
    "prompt_context": "I bought a new bike last week.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "you"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "how much",
     "did",
     "pay",
     "for",
     "it"
    ],
    "bank": [
     "how much",
     "did",
     "pay",
     "for",
     "it",
     "paid"
    ],
    "sample_answer": "How much did you pay for it?",
    "explanation": "После did глагол в начальной форме — pay, а не paid."
   },
   {
    "id": "wh-questions-8",
    "prompt_context": "Maria is moving to another dorm.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "to"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "why",
     "did",
     "she",
     "decide",
     "leave"
    ],
    "bank": [
     "why",
     "did",
     "she",
     "decide",
     "leave"
    ],
    "sample_answer": "Why did she decide to leave?",
    "explanation": "Why + did + she + decide: прошедшее время показывает did, глагол decide — в начальной форме."
   },
   {
    "id": "wh-questions-9",
    "prompt_context": "The workshop starts at noon.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "it"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "which",
     "building",
     "will",
     "take place",
     "in"
    ],
    "bank": [
     "which",
     "building",
     "will",
     "take place",
     "in",
     "where"
    ],
    "sample_answer": "Which building will it take place in?",
    "explanation": "Which building — вопросительное слово; предлог in в конце: take place in."
   },
   {
    "id": "wh-questions-10",
    "prompt_context": "I've been learning Spanish for a while.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "been"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "how long",
     "have",
     "you",
     "studying",
     "it"
    ],
    "bank": [
     "how long",
     "have",
     "you",
     "studying",
     "it"
    ],
    "sample_answer": "How long have you been studying it?",
    "explanation": "How long + have + you + been studying — вопрос в Present Perfect Continuous."
   },
   {
    "id": "wh-questions-11",
    "prompt_context": "The professor canceled tomorrow's lecture.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "canceled"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "why",
     "was",
     "it",
     "so suddenly"
    ],
    "bank": [
     "why",
     "was",
     "it",
     "so suddenly"
    ],
    "sample_answer": "Why was it canceled so suddenly?",
    "explanation": "Why + was + it + canceled — вопрос в пассиве прошедшего времени."
   },
   {
    "id": "wh-questions-12",
    "prompt_context": "I can't decide what to cook for the party.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "do"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "what kind",
     "of",
     "food",
     "your guests",
     "like"
    ],
    "bank": [
     "what kind",
     "of",
     "food",
     "your guests",
     "like"
    ],
    "sample_answer": "What kind of food do your guests like?",
    "explanation": "What kind of food — одно вопросительное выражение; дальше do + your guests + like."
   }
  ]
 },
 {
  "id": "negatives",
  "icon": "circle-slash",
  "title": "Negatives & Adverbs",
  "ru": "Отрицания и наречия",
  "sum": "not после вспомогательного; usually, never, still, yet — на своих местах",
  "rule": [
   "**Not** стоит после вспомогательного глагола: I have not met him, I did not have time, it is not as good.",
   "Наречия частоты (**usually, never, rarely, always**) стоят перед основным глаголом, но после be: I usually go, it is never late.",
   "**Yet** — в конце отрицания или вопроса; **still** — перед отрицанием: it still hasn't arrived; **anymore** — в конце."
  ],
  "examples": [
   "I | have | not | met | him | yet.",
   "I | usually | go | there | twice a week."
  ],
  "items": [
   {
    "id": "negatives-1",
    "prompt_context": "Did you finish the reading for today?",
    "structure": [
     {
      "type": "text",
      "value": "No,"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "didn't"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "I",
     "have",
     "time",
     "for it",
     "last night"
    ],
    "bank": [
     "I",
     "have",
     "time",
     "for it",
     "last night"
    ],
    "sample_answer": "No, I didn't have time for it last night.",
    "explanation": "После didn't глагол в начальной форме: didn't have."
   },
   {
    "id": "negatives-2",
    "prompt_context": "Do you go to the gym often?",
    "structure": [
     {
      "type": "text",
      "value": "I"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "there"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "usually",
     "go",
     "twice",
     "a week"
    ],
    "bank": [
     "usually",
     "go",
     "twice",
     "a week"
    ],
    "sample_answer": "I usually go there twice a week.",
    "explanation": "Usually стоит перед основным глаголом go; как часто (twice a week) — в конце."
   },
   {
    "id": "negatives-3",
    "prompt_context": "Is the 8 a.m. bus usually on time?",
    "structure": [
     {
      "type": "text",
      "value": "The bus"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "on"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "is",
     "never",
     "late",
     "weekday",
     "mornings"
    ],
    "bank": [
     "is",
     "never",
     "late",
     "weekday",
     "mornings"
    ],
    "sample_answer": "The bus is never late on weekday mornings.",
    "explanation": "С глаголом be наречие идёт после него: is never late."
   },
   {
    "id": "negatives-4",
    "prompt_context": "Have you ever visited the art museum downtown?",
    "structure": [
     {
      "type": "text",
      "value": "No,"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "there"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "I",
     "have",
     "never",
     "been",
     "before"
    ],
    "bank": [
     "I",
     "have",
     "never",
     "been",
     "before"
    ],
    "sample_answer": "No, I have never been there before.",
    "explanation": "Never — между have и been: I have never been there."
   },
   {
    "id": "negatives-5",
    "prompt_context": "Did you like the new dining hall?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "was"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "the food",
     "not",
     "as good",
     "as",
     "I expected"
    ],
    "bank": [
     "the food",
     "not",
     "as good",
     "as",
     "I expected"
    ],
    "sample_answer": "The food was not as good as I expected.",
    "explanation": "Not стоит после was; сравнение not as good as — «не так хорошо, как»."
   },
   {
    "id": "negatives-6",
    "prompt_context": "Are you still working at the bookstore?",
    "structure": [
     {
      "type": "text",
      "value": "No,"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "don't"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "I",
     "work",
     "there",
     "anymore"
    ],
    "bank": [
     "I",
     "work",
     "there",
     "anymore",
     "doesn't"
    ],
    "sample_answer": "No, I don't work there anymore.",
    "explanation": "I — первое лицо, поэтому don't (а не doesn't); anymore — в самом конце."
   },
   {
    "id": "negatives-7",
    "prompt_context": "Has the professor returned our essays?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "them"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "she",
     "hasn't",
     "graded",
     "all of",
     "yet"
    ],
    "bank": [
     "she",
     "hasn't",
     "graded",
     "all of",
     "yet"
    ],
    "sample_answer": "She hasn't graded all of them yet.",
    "explanation": "Hasn't graded… yet — «ещё не проверила»; yet в конце отрицания."
   },
   {
    "id": "negatives-8",
    "prompt_context": "Do you ever study in the café?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "there"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "I",
     "rarely",
     "study",
     "because",
     "it is",
     "too noisy"
    ],
    "bank": [
     "I",
     "rarely",
     "study",
     "because",
     "it is",
     "too noisy"
    ],
    "sample_answer": "I rarely study there because it is too noisy.",
    "explanation": "Rarely — перед глаголом study; причина (because…) — второй частью."
   },
   {
    "id": "negatives-9",
    "prompt_context": "Can you help me move on Saturday?",
    "structure": [
     {
      "type": "text",
      "value": "Sorry,"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "will"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "I",
     "not",
     "be",
     "in town",
     "this weekend"
    ],
    "bank": [
     "I",
     "not",
     "be",
     "in town",
     "this weekend",
     "am"
    ],
    "sample_answer": "Sorry, I will not be in town this weekend.",
    "explanation": "Will not be — not после will. Am лишний: will и am вместе не используются."
   },
   {
    "id": "negatives-10",
    "prompt_context": "Did the package arrive?",
    "structure": [
     {
      "type": "text",
      "value": "No,"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "hasn't"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "it",
     "still",
     "been",
     "delivered"
    ],
    "bank": [
     "it",
     "still",
     "been",
     "delivered"
    ],
    "sample_answer": "No, it still hasn't been delivered.",
    "explanation": "Still стоит перед отрицанием hasn't: it still hasn't been delivered — «до сих пор не доставили»."
   },
   {
    "id": "negatives-11",
    "prompt_context": "Why weren't you at the meeting?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "that"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "nobody",
     "told",
     "me",
     "it",
     "had been",
     "rescheduled"
    ],
    "bank": [
     "nobody",
     "told",
     "me",
     "it",
     "had been",
     "rescheduled"
    ],
    "sample_answer": "Nobody told me that it had been rescheduled.",
    "explanation": "Nobody — отрицательное подлежащее, второе not не нужно: Nobody told me…"
   },
   {
    "id": "negatives-12",
    "prompt_context": "Do you know the new teaching assistant?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "him"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "I",
     "have",
     "not",
     "met",
     "yet"
    ],
    "bank": [
     "I",
     "have",
     "not",
     "met",
     "yet",
     "never"
    ],
    "sample_answer": "I have not met him yet.",
    "explanation": "Not после have; yet в конце. Never лишний: с not и yet он не сочетается."
   }
  ]
 },
 {
  "id": "present-perfect",
  "icon": "history",
  "title": "Present Perfect",
  "ru": "Present Perfect",
  "sum": "have / has + V3; already, yet, just, since, for",
  "rule": [
   "**Have / has + третья форма глагола**: I have lived, she has left, they have registered.",
   "**Already** и **just** стоят между have и глаголом: he has just left. **Yet** — в конце отрицаний и вопросов.",
   "**Since** + момент (since I was ten), **for** + отрезок времени (for six hours)."
  ],
  "examples": [
   "I | have | lived | here | since I was ten.",
   "No, | he | has | just | left | for lunch."
  ],
  "items": [
   {
    "id": "present-perfect-1",
    "prompt_context": "I can't find my phone anywhere.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "the"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "have",
     "you",
     "checked",
     "pocket",
     "of",
     "your jacket"
    ],
    "bank": [
     "have",
     "you",
     "checked",
     "pocket",
     "of",
     "your jacket",
     "did"
    ],
    "sample_answer": "Have you checked the pocket of your jacket?",
    "explanation": "Вопрос в Present Perfect: Have + you + checked. Did лишний — с checked он не сочетается."
   },
   {
    "id": "present-perfect-2",
    "prompt_context": "Are you ready for the presentation?",
    "structure": [
     {
      "type": "text",
      "value": "Yes,"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "practiced"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "I",
     "have",
     "already",
     "it",
     "twice"
    ],
    "bank": [
     "I",
     "have",
     "already",
     "it",
     "twice"
    ],
    "sample_answer": "Yes, I have already practiced it twice.",
    "explanation": "Already стоит между have и глаголом: I have already practiced."
   },
   {
    "id": "present-perfect-3",
    "prompt_context": "How long have you lived in this city?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "here"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "I",
     "have",
     "lived",
     "since",
     "I was ten"
    ],
    "bank": [
     "I",
     "have",
     "lived",
     "since",
     "I was ten",
     "for"
    ],
    "sample_answer": "I have lived here since I was ten.",
    "explanation": "Since + момент в прошлом (I was ten). For здесь лишний: for нужен с отрезком времени."
   },
   {
    "id": "present-perfect-4",
    "prompt_context": "Is Tom still in the office?",
    "structure": [
     {
      "type": "text",
      "value": "No,"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "left"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "he",
     "has",
     "just",
     "for lunch"
    ],
    "bank": [
     "he",
     "has",
     "just",
     "for lunch"
    ],
    "sample_answer": "No, he has just left for lunch.",
    "explanation": "Just — «только что» — между has и left."
   },
   {
    "id": "present-perfect-5",
    "prompt_context": "Have you read the article I sent you?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "a"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "I",
     "haven't",
     "had",
     "chance",
     "to",
     "look at it"
    ],
    "bank": [
     "I",
     "haven't",
     "had",
     "chance",
     "to",
     "look at it"
    ],
    "sample_answer": "I haven't had a chance to look at it.",
    "explanation": "Haven't had a chance to… — «ещё не было возможности…»."
   },
   {
    "id": "present-perfect-6",
    "prompt_context": "Our team has a new manager.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "has"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "how long",
     "she",
     "worked",
     "for",
     "the company"
    ],
    "bank": [
     "how long",
     "she",
     "worked",
     "for",
     "the company"
    ],
    "sample_answer": "How long has she worked for the company?",
    "explanation": "How long + has + she + worked — вопрос о длительности в Present Perfect."
   },
   {
    "id": "present-perfect-7",
    "prompt_context": "Did you sign up for the trip?",
    "structure": [
     {
      "type": "text",
      "value": "Yes,"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "have"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "I",
     "already",
     "paid",
     "the deposit"
    ],
    "bank": [
     "I",
     "already",
     "paid",
     "the deposit"
    ],
    "sample_answer": "Yes, I have already paid the deposit.",
    "explanation": "Have already paid — already между have и третьей формой."
   },
   {
    "id": "present-perfect-8",
    "prompt_context": "You look tired.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "for"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "I",
     "have",
     "been",
     "studying",
     "six hours",
     "straight"
    ],
    "bank": [
     "I",
     "have",
     "been",
     "studying",
     "six hours",
     "straight"
    ],
    "sample_answer": "I have been studying for six hours straight.",
    "explanation": "Have been studying — действие длится до сих пор; for + отрезок (six hours)."
   },
   {
    "id": "present-perfect-9",
    "prompt_context": "Is the new course popular?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "have"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "more than",
     "fifty students",
     "registered",
     "for it",
     "so far"
    ],
    "bank": [
     "more than",
     "fifty students",
     "registered",
     "for it",
     "so far"
    ],
    "sample_answer": "More than fifty students have registered for it so far.",
    "explanation": "So far — «пока что, на данный момент», типичный спутник Present Perfect."
   },
   {
    "id": "present-perfect-10",
    "prompt_context": "Do you know the city well?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "several"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "I",
     "have",
     "visited",
     "it",
     "times",
     "before"
    ],
    "bank": [
     "I",
     "have",
     "visited",
     "it",
     "times",
     "before",
     "visit"
    ],
    "sample_answer": "I have visited it several times before.",
    "explanation": "After have — третья форма visited, а не visit."
   },
   {
    "id": "present-perfect-11",
    "prompt_context": "Have the results been announced?",
    "structure": [
     {
      "type": "text",
      "value": "Not yet,"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "have"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "but",
     "they",
     "promised",
     "to post them",
     "soon"
    ],
    "bank": [
     "but",
     "they",
     "promised",
     "to post them",
     "soon"
    ],
    "sample_answer": "Not yet, but they have promised to post them soon.",
    "explanation": "They have promised to… — «они обещали…»; to post them soon — что именно."
   },
   {
    "id": "present-perfect-12",
    "prompt_context": "Why is the lab closed?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "been"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "the equipment",
     "has",
     "moved",
     "to another",
     "building"
    ],
    "bank": [
     "the equipment",
     "has",
     "moved",
     "to another",
     "building"
    ],
    "sample_answer": "The equipment has been moved to another building.",
    "explanation": "Has been moved — пассив в Present Perfect: «оборудование перенесли»."
   }
  ]
 },
 {
  "id": "verb-patterns",
  "icon": "git-branch",
  "title": "Verb + to / -ing",
  "ru": "Глагол + to / -ing",
  "sum": "need to, hope to, decide to — enjoy, suggest, stop + -ing",
  "rule": [
   "После **need, want, hope, plan, decide, ask, remind** — **to + глагол**: I need to pick up, she asked me to come.",
   "После **enjoy, finish, suggest, stop, mind** и после предлогов — **глагол с -ing**: I enjoy sharing, no intention of missing.",
   "Конструкция **find it easier to…**: I find it easier to concentrate."
  ],
  "examples": [
   "I | need | to | pick up | my sister.",
   "She | suggested | taking | an extra writing course."
  ],
  "items": [
   {
    "id": "verb-patterns-1",
    "prompt_context": "Why are you leaving so early?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "my"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "I",
     "need",
     "to",
     "pick up",
     "sister",
     "from school"
    ],
    "bank": [
     "I",
     "need",
     "to",
     "pick up",
     "sister",
     "from school"
    ],
    "sample_answer": "I need to pick up my sister from school.",
    "explanation": "Need + to + глагол: need to pick up."
   },
   {
    "id": "verb-patterns-2",
    "prompt_context": "What are your plans after graduation?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "a"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "I",
     "hope",
     "to find",
     "job",
     "in",
     "marketing"
    ],
    "bank": [
     "I",
     "hope",
     "to find",
     "job",
     "in",
     "marketing",
     "finding"
    ],
    "sample_answer": "I hope to find a job in marketing.",
    "explanation": "После hope — to + глагол: hope to find. Finding здесь лишний."
   },
   {
    "id": "verb-patterns-3",
    "prompt_context": "Do you like working in groups?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "with"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "I",
     "enjoy",
     "sharing",
     "ideas",
     "my classmates"
    ],
    "bank": [
     "I",
     "enjoy",
     "sharing",
     "ideas",
     "my classmates",
     "to share"
    ],
    "sample_answer": "I enjoy sharing ideas with my classmates.",
    "explanation": "После enjoy — форма на -ing: enjoy sharing. To share лишний."
   },
   {
    "id": "verb-patterns-4",
    "prompt_context": "Are you going to the party tonight?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "to"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "I",
     "have",
     "decided",
     "stay home",
     "and study"
    ],
    "bank": [
     "I",
     "have",
     "decided",
     "stay home",
     "and study"
    ],
    "sample_answer": "I have decided to stay home and study.",
    "explanation": "Decide + to + глагол: decided to stay home."
   },
   {
    "id": "verb-patterns-5",
    "prompt_context": "Why did you stop going to the gym?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "because"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "I",
     "stopped",
     "going",
     "I hurt",
     "my knee"
    ],
    "bank": [
     "I",
     "stopped",
     "going",
     "I hurt",
     "my knee"
    ],
    "sample_answer": "I stopped going because I hurt my knee.",
    "explanation": "Stop + -ing — «перестать делать»: stopped going."
   },
   {
    "id": "verb-patterns-6",
    "prompt_context": "How was the job interview?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "to"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "they",
     "asked",
     "me",
     "come back",
     "next week"
    ],
    "bank": [
     "they",
     "asked",
     "me",
     "come back",
     "next week"
    ],
    "sample_answer": "They asked me to come back next week.",
    "explanation": "Ask somebody to do something: asked me to come back."
   },
   {
    "id": "verb-patterns-7",
    "prompt_context": "Have you finished your project?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "the"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "I",
     "have",
     "finished",
     "writing",
     "report",
     "already"
    ],
    "bank": [
     "I",
     "have",
     "finished",
     "writing",
     "report",
     "already"
    ],
    "sample_answer": "I have finished writing the report already.",
    "explanation": "Finish + -ing: finished writing."
   },
   {
    "id": "verb-patterns-8",
    "prompt_context": "Would you like to come to the museum?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "to"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "I",
     "would",
     "love",
     "go",
     "with you"
    ],
    "bank": [
     "I",
     "would",
     "love",
     "go",
     "with you"
    ],
    "sample_answer": "I would love to go with you.",
    "explanation": "Would love to + глагол: I would love to go."
   },
   {
    "id": "verb-patterns-9",
    "prompt_context": "Why do you study in the morning?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "to"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "I",
     "find",
     "it",
     "easier",
     "concentrate",
     "early",
     "in the day"
    ],
    "bank": [
     "I",
     "find",
     "it",
     "easier",
     "concentrate",
     "early",
     "in the day"
    ],
    "sample_answer": "I find it easier to concentrate early in the day.",
    "explanation": "Find it easier to… — «мне легче…»: it стоит сразу после find."
   },
   {
    "id": "verb-patterns-10",
    "prompt_context": "What did the advisor suggest?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "an"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "she",
     "suggested",
     "taking",
     "extra",
     "writing course"
    ],
    "bank": [
     "she",
     "suggested",
     "taking",
     "extra",
     "writing course"
    ],
    "sample_answer": "She suggested taking an extra writing course.",
    "explanation": "После suggest — -ing: suggested taking."
   },
   {
    "id": "verb-patterns-11",
    "prompt_context": "Are you going to the conference?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "of"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "I",
     "have",
     "no",
     "intention",
     "missing",
     "it"
    ],
    "bank": [
     "I",
     "have",
     "no",
     "intention",
     "missing",
     "it",
     "to miss"
    ],
    "sample_answer": "I have no intention of missing it.",
    "explanation": "После предлога of — форма на -ing: of missing. To miss лишний."
   },
   {
    "id": "verb-patterns-12",
    "prompt_context": "Can you send me the slides?",
    "structure": [
     {
      "type": "text",
      "value": "Sure,"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "to"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "remind",
     "me",
     "email",
     "them",
     "tonight"
    ],
    "bank": [
     "remind",
     "me",
     "email",
     "them",
     "tonight"
    ],
    "sample_answer": "Sure, remind me to email them tonight.",
    "explanation": "Remind somebody to do something: remind me to email them."
   }
  ]
 },
 {
  "id": "relative-clauses",
  "icon": "link-2",
  "title": "Relative Clauses",
  "ru": "Придаточные who / that / where",
  "sum": "the one that…, the professor who…, the drawer where…",
  "rule": [
   "**Who** — о людях, **that / which** — о предметах, **where** — о месте, **whose** — «чей», **when** — о времени.",
   "Придаточное стоит **сразу после слова, которое описывает**: the drawer where we keep the mail.",
   "Внутри придаточного обычный порядок слов: подлежащее → глагол (that my friend recommended)."
  ],
  "examples": [
   "I | bought | the one | that | has a longer battery life.",
   "They | are | in the drawer | where | we keep the mail."
  ],
  "items": [
   {
    "id": "relative-clauses-1",
    "prompt_context": "Which laptop did you buy?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "that"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "I",
     "bought",
     "the one",
     "has",
     "a longer",
     "battery life"
    ],
    "bank": [
     "I",
     "bought",
     "the one",
     "has",
     "a longer",
     "battery life"
    ],
    "sample_answer": "I bought the one that has a longer battery life.",
    "explanation": "The one that has… — «тот, у которого…»: придаточное сразу после the one."
   },
   {
    "id": "relative-clauses-2",
    "prompt_context": "Who is that woman by the door?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "who"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "she",
     "is",
     "the professor",
     "teaches",
     "my writing class"
    ],
    "bank": [
     "she",
     "is",
     "the professor",
     "teaches",
     "my writing class",
     "which"
    ],
    "sample_answer": "She is the professor who teaches my writing class.",
    "explanation": "Who — о человеке (the professor). Which лишний: which — о предметах."
   },
   {
    "id": "relative-clauses-3",
    "prompt_context": "Where did you put the keys?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "where"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "they",
     "are",
     "in",
     "the drawer",
     "we keep",
     "the mail"
    ],
    "bank": [
     "they",
     "are",
     "in",
     "the drawer",
     "we keep",
     "the mail",
     "when"
    ],
    "sample_answer": "They are in the drawer where we keep the mail.",
    "explanation": "Where — о месте (the drawer). When лишний: when — о времени."
   },
   {
    "id": "relative-clauses-4",
    "prompt_context": "What are you reading?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "that"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "it",
     "is",
     "a novel",
     "my friend",
     "recommended",
     "to me"
    ],
    "bank": [
     "it",
     "is",
     "a novel",
     "my friend",
     "recommended",
     "to me"
    ],
    "sample_answer": "It is a novel that my friend recommended to me.",
    "explanation": "Внутри придаточного обычный порядок: that + my friend + recommended."
   },
   {
    "id": "relative-clauses-5",
    "prompt_context": "Have you been to the new café?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "where"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "is",
     "that",
     "the place",
     "they",
     "serve",
     "breakfast all day"
    ],
    "bank": [
     "is",
     "that",
     "the place",
     "they",
     "serve",
     "breakfast all day"
    ],
    "sample_answer": "Is that the place where they serve breakfast all day?",
    "explanation": "Where — о месте: the place where they serve…"
   },
   {
    "id": "relative-clauses-6",
    "prompt_context": "Which professor do you like most?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "who"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "I",
     "like",
     "the one",
     "gives",
     "clear feedback",
     "on essays"
    ],
    "bank": [
     "I",
     "like",
     "the one",
     "gives",
     "clear feedback",
     "on essays"
    ],
    "sample_answer": "I like the one who gives clear feedback on essays.",
    "explanation": "The one who gives… — «тот, кто даёт…»."
   },
   {
    "id": "relative-clauses-7",
    "prompt_context": "Where are you living this year?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "that"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "I",
     "live",
     "in",
     "an apartment",
     "is close",
     "to campus"
    ],
    "bank": [
     "I",
     "live",
     "in",
     "an apartment",
     "is close",
     "to campus"
    ],
    "sample_answer": "I live in an apartment that is close to campus.",
    "explanation": "That is close to campus описывает an apartment."
   },
   {
    "id": "relative-clauses-8",
    "prompt_context": "Did you find a summer job?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "whose"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "I",
     "got",
     "a job",
     "at",
     "a store",
     "owner",
     "is my neighbor"
    ],
    "bank": [
     "I",
     "got",
     "a job",
     "at",
     "a store",
     "owner",
     "is my neighbor"
    ],
    "sample_answer": "I got a job at a store whose owner is my neighbor.",
    "explanation": "Whose — «чей»: a store whose owner… — «магазин, владелец которого…»."
   },
   {
    "id": "relative-clauses-9",
    "prompt_context": "What was the best part of the trip?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "when"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "the day",
     "we",
     "hiked",
     "to",
     "the waterfall",
     "was amazing"
    ],
    "bank": [
     "the day",
     "we",
     "hiked",
     "to",
     "the waterfall",
     "was amazing"
    ],
    "sample_answer": "The day when we hiked to the waterfall was amazing.",
    "explanation": "When — о времени (the day); главный глагол was стоит после всего придаточного."
   },
   {
    "id": "relative-clauses-10",
    "prompt_context": "Who should I ask about the scholarship?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "who"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "talk to",
     "the advisor",
     "handles",
     "financial aid",
     "questions"
    ],
    "bank": [
     "talk to",
     "the advisor",
     "handles",
     "financial aid",
     "questions"
    ],
    "sample_answer": "Talk to the advisor who handles financial aid questions.",
    "explanation": "Who handles… описывает the advisor."
   },
   {
    "id": "relative-clauses-11",
    "prompt_context": "Which room is the meeting in?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "that"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "it's",
     "in",
     "the room",
     "we used",
     "last week"
    ],
    "bank": [
     "it's",
     "in",
     "the room",
     "we used",
     "last week"
    ],
    "sample_answer": "It's in the room that we used last week.",
    "explanation": "That we used last week — «которую мы использовали на прошлой неделе»."
   },
   {
    "id": "relative-clauses-12",
    "prompt_context": "Why did you choose this university?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "that"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "it",
     "offers",
     "the program",
     "I",
     "was most",
     "interested in"
    ],
    "bank": [
     "it",
     "offers",
     "the program",
     "I",
     "was most",
     "interested in"
    ],
    "sample_answer": "It offers the program that I was most interested in.",
    "explanation": "Предлог in остаётся в конце придаточного: that I was most interested in."
   }
  ]
 },
 {
  "id": "indirect-if",
  "icon": "circle-help",
  "title": "Do you know if…?",
  "ru": "Косвенные вопросы: if / whether",
  "sum": "Do you know if it is…? — без перестановки после if",
  "rule": [
   "Вежливый вопрос часто начинается с **Do you know / Can you tell me / Can you check** + **if / whether**.",
   "После if / whether — **обычный порядок слов**, как в утверждении: Do you know if **it will be** recorded? (не «will it be»).",
   "Вспомогательные do / does / did после if не нужны: Do you know if **it includes**…? (не «does it include»)."
  ],
  "examples": [
   "Do | you | know | if | it will be | recorded?",
   "Can | you | check | whether | they have | the new edition?"
  ],
  "items": [
   {
    "id": "indirect-if-1",
    "prompt_context": "The biology seminar was rescheduled.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "if"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "do",
     "you",
     "know",
     "it",
     "will be",
     "recorded"
    ],
    "bank": [
     "do",
     "you",
     "know",
     "it",
     "will be",
     "recorded",
     "does"
    ],
    "sample_answer": "Do you know if it will be recorded?",
    "explanation": "После if — порядок утверждения: it will be recorded. Does здесь лишний."
   },
   {
    "id": "indirect-if-2",
    "prompt_context": "I'm going to the bookstore.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "whether"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "can",
     "you",
     "check",
     "they",
     "have",
     "the new edition"
    ],
    "bank": [
     "can",
     "you",
     "check",
     "they",
     "have",
     "the new edition"
    ],
    "sample_answer": "Can you check whether they have the new edition?",
    "explanation": "Whether + they + have: после whether подлежащее стоит перед глаголом."
   },
   {
    "id": "indirect-if-3",
    "prompt_context": "There's a guest speaker on Monday.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "if"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "do you",
     "know",
     "we",
     "need",
     "to register"
    ],
    "bank": [
     "do you",
     "know",
     "we",
     "need",
     "to register"
    ],
    "sample_answer": "Do you know if we need to register?",
    "explanation": "If we need to register — без do после if."
   },
   {
    "id": "indirect-if-4",
    "prompt_context": "The gym is going to be renovated next month.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "it"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "do",
     "you",
     "know",
     "if",
     "will",
     "close",
     "during",
     "the renovation"
    ],
    "bank": [
     "do",
     "you",
     "know",
     "if",
     "will",
     "close",
     "during",
     "the renovation"
    ],
    "sample_answer": "Do you know if it will close during the renovation?",
    "explanation": "If it will close — will после подлежащего, а не перед ним."
   },
   {
    "id": "indirect-if-5",
    "prompt_context": "I applied for the research assistant job.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "if"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "can",
     "you",
     "tell",
     "me",
     "they",
     "have replied"
    ],
    "bank": [
     "can",
     "you",
     "tell",
     "me",
     "they",
     "have replied",
     "did"
    ],
    "sample_answer": "Can you tell me if they have replied?",
    "explanation": "Tell me if they have replied. Did лишний: после if не ставим вспомогательный в начало."
   },
   {
    "id": "indirect-if-6",
    "prompt_context": "Our study room is booked for tomorrow.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "whether"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "do",
     "you",
     "know",
     "the projector",
     "works",
     "there"
    ],
    "bank": [
     "do",
     "you",
     "know",
     "the projector",
     "works",
     "there"
    ],
    "sample_answer": "Do you know whether the projector works there?",
    "explanation": "Whether the projector works — глагол works с -s, без does."
   },
   {
    "id": "indirect-if-7",
    "prompt_context": "The school is planning a trip to the museum.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "there"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "do",
     "you",
     "know",
     "if",
     "are",
     "any seats left"
    ],
    "bank": [
     "do",
     "you",
     "know",
     "if",
     "are",
     "any seats left"
    ],
    "sample_answer": "Do you know if there are any seats left?",
    "explanation": "If there are — порядок утверждения (there are), а не «are there»."
   },
   {
    "id": "indirect-if-8",
    "prompt_context": "My flight to Boston is tomorrow morning.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "if"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "can",
     "you",
     "find out",
     "it",
     "is",
     "on time"
    ],
    "bank": [
     "can",
     "you",
     "find out",
     "it",
     "is",
     "on time"
    ],
    "sample_answer": "Can you find out if it is on time?",
    "explanation": "Find out if it is on time — is после it."
   },
   {
    "id": "indirect-if-9",
    "prompt_context": "The cafeteria has a new menu.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "if"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "do you know",
     "it",
     "includes",
     "vegetarian",
     "options"
    ],
    "bank": [
     "do you know",
     "it",
     "includes",
     "vegetarian",
     "options",
     "does"
    ],
    "sample_answer": "Do you know if it includes vegetarian options?",
    "explanation": "If it includes — без does; глагол с -s, потому что it."
   },
   {
    "id": "indirect-if-10",
    "prompt_context": "I heard the exam might be moved.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "if"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "could",
     "you",
     "ask",
     "the professor",
     "the date",
     "has changed"
    ],
    "bank": [
     "could",
     "you",
     "ask",
     "the professor",
     "the date",
     "has changed"
    ],
    "sample_answer": "Could you ask the professor if the date has changed?",
    "explanation": "Ask somebody if… — the date has changed, порядок утверждения."
   },
   {
    "id": "indirect-if-11",
    "prompt_context": "They're opening a new parking lot.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "students"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "do",
     "you",
     "know",
     "if",
     "can",
     "park there",
     "for free"
    ],
    "bank": [
     "do",
     "you",
     "know",
     "if",
     "can",
     "park there",
     "for free"
    ],
    "sample_answer": "Do you know if students can park there for free?",
    "explanation": "If students can park — can после подлежащего."
   },
   {
    "id": "indirect-if-12",
    "prompt_context": "The writing center offers tutoring.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "whether"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "can",
     "you",
     "tell me",
     "I",
     "need",
     "an appointment"
    ],
    "bank": [
     "can",
     "you",
     "tell me",
     "I",
     "need",
     "an appointment"
    ],
    "sample_answer": "Can you tell me whether I need an appointment?",
    "explanation": "Whether I need — без do после whether."
   }
  ]
 },
 {
  "id": "indirect-wh",
  "icon": "search",
  "title": "Can you tell me where…?",
  "ru": "Косвенные вопросы: where / when / what",
  "sum": "Do you know where her office is? — глагол в конце",
  "rule": [
   "После **Do you know / Can you tell me / Can you explain** + **where, when, what, how, why, who** — снова **порядок утверждения**.",
   "Сначала подлежащее, потом глагол: Do you know where **her office is**? (не «where is her office»).",
   "Do / does / did после вопросительного слова не ставим: Can you tell me when **classes start**? Если who — подлежащее, сразу глагол: who **gave** the best speech."
  ],
  "examples": [
   "Do | you | know | where | her office | is?",
   "Can | you | tell | me | when | classes | start?"
  ],
  "items": [
   {
    "id": "indirect-wh-1",
    "prompt_context": "The welcome party is this Friday.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "where"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "do",
     "you",
     "know",
     "it",
     "will",
     "take place"
    ],
    "bank": [
     "do",
     "you",
     "know",
     "it",
     "will",
     "take place"
    ],
    "sample_answer": "Do you know where it will take place?",
    "explanation": "Where it will take place — will после подлежащего it."
   },
   {
    "id": "indirect-wh-2",
    "prompt_context": "The new semester schedule is out.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "when"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "can",
     "you",
     "tell",
     "me",
     "classes",
     "start"
    ],
    "bank": [
     "can",
     "you",
     "tell",
     "me",
     "classes",
     "start",
     "do"
    ],
    "sample_answer": "Can you tell me when classes start?",
    "explanation": "When classes start — без do. Do здесь лишний."
   },
   {
    "id": "indirect-wh-3",
    "prompt_context": "I lost my student ID card.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "where"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "do",
     "you",
     "know",
     "I",
     "can",
     "get",
     "a new one"
    ],
    "bank": [
     "do",
     "you",
     "know",
     "I",
     "can",
     "get",
     "a new one"
    ],
    "sample_answer": "Do you know where I can get a new one?",
    "explanation": "Where I can get… — can после подлежащего I."
   },
   {
    "id": "indirect-wh-4",
    "prompt_context": "Dr. Kim is giving a lecture tonight.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "what"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "do",
     "you",
     "know",
     "she",
     "is",
     "going to discuss"
    ],
    "bank": [
     "do",
     "you",
     "know",
     "she",
     "is",
     "going to discuss"
    ],
    "sample_answer": "Do you know what she is going to discuss?",
    "explanation": "What she is going to discuss — is после she."
   },
   {
    "id": "indirect-wh-5",
    "prompt_context": "The library is buying new books.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "how"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "can",
     "you",
     "tell",
     "me",
     "I",
     "should",
     "request one"
    ],
    "bank": [
     "can",
     "you",
     "tell",
     "me",
     "I",
     "should",
     "request one"
    ],
    "sample_answer": "Can you tell me how I should request one?",
    "explanation": "How I should request one — should после подлежащего I."
   },
   {
    "id": "indirect-wh-6",
    "prompt_context": "Our team won the debate.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "who"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "do",
     "you",
     "know",
     "gave",
     "the best",
     "speech"
    ],
    "bank": [
     "do",
     "you",
     "know",
     "gave",
     "the best",
     "speech",
     "did"
    ],
    "sample_answer": "Do you know who gave the best speech?",
    "explanation": "Who — само подлежащее, поэтому сразу глагол: who gave. Did лишний."
   },
   {
    "id": "indirect-wh-7",
    "prompt_context": "There's a problem with the heating.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "when"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "do",
     "you",
     "know",
     "it",
     "will",
     "be fixed"
    ],
    "bank": [
     "do",
     "you",
     "know",
     "it",
     "will",
     "be fixed"
    ],
    "sample_answer": "Do you know when it will be fixed?",
    "explanation": "When it will be fixed — пассив, will после it."
   },
   {
    "id": "indirect-wh-8",
    "prompt_context": "Sara is studying abroad next year.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "which"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "do",
     "you",
     "know",
     "country",
     "she",
     "is going to"
    ],
    "bank": [
     "do",
     "you",
     "know",
     "country",
     "she",
     "is going to"
    ],
    "sample_answer": "Do you know which country she is going to?",
    "explanation": "Which country she is going to — предлог to в конце."
   },
   {
    "id": "indirect-wh-9",
    "prompt_context": "The final project is due soon.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "how"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "can",
     "you",
     "remind",
     "me",
     "long",
     "the report",
     "should be"
    ],
    "bank": [
     "can",
     "you",
     "remind",
     "me",
     "long",
     "the report",
     "should be"
    ],
    "sample_answer": "Can you remind me how long the report should be?",
    "explanation": "How long the report should be — should be в самом конце."
   },
   {
    "id": "indirect-wh-10",
    "prompt_context": "I need to talk to the department head.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "where"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "do",
     "you",
     "know",
     "her",
     "office",
     "is"
    ],
    "bank": [
     "do",
     "you",
     "know",
     "her",
     "office",
     "is",
     "does"
    ],
    "sample_answer": "Do you know where her office is?",
    "explanation": "Классическая ловушка: where her office is — глагол is в конце. Does лишний."
   },
   {
    "id": "indirect-wh-11",
    "prompt_context": "The concert tickets sold out.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "how many"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "do",
     "you",
     "know",
     "people",
     "bought",
     "tickets"
    ],
    "bank": [
     "do",
     "you",
     "know",
     "people",
     "bought",
     "tickets"
    ],
    "sample_answer": "Do you know how many people bought tickets?",
    "explanation": "How many people — подлежащее, поэтому без did: how many people bought."
   },
   {
    "id": "indirect-wh-12",
    "prompt_context": "The professor changed the grading policy.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "why"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "can",
     "you",
     "explain",
     "she",
     "decided",
     "to change it"
    ],
    "bank": [
     "can",
     "you",
     "explain",
     "she",
     "decided",
     "to change it"
    ],
    "sample_answer": "Can you explain why she decided to change it?",
    "explanation": "Why she decided — без did; глагол в прошедшем времени decided."
   }
  ]
 },
 {
  "id": "reported",
  "icon": "messages-square",
  "title": "He wanted to know…",
  "ru": "Вопросы в пересказе",
  "sum": "She asked me if…, he wanted to know why…, I'm not sure who…",
  "rule": [
   "Когда пересказываем чужой вопрос — **She asked me if… / He wanted to know why… / I'm not sure who…** — порядок слов как в утверждении.",
   "Время обычно сдвигается в прошлое: «Why did you choose…?» → She wanted to know why **I had chosen**…",
   "Do / does / did в пересказе не нужны."
  ],
  "examples": [
   "She | wanted | to know | why | I had chosen | the company.",
   "He | asked | me | if | I could | lend him my notes."
  ],
  "items": [
   {
    "id": "reported-1",
    "prompt_context": "What did the interviewer ask you?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "why"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "she",
     "wanted",
     "to know",
     "I",
     "had chosen",
     "the company"
    ],
    "bank": [
     "she",
     "wanted",
     "to know",
     "I",
     "had chosen",
     "the company",
     "did"
    ],
    "sample_answer": "She wanted to know why I had chosen the company.",
    "explanation": "Why I had chosen — порядок утверждения и сдвиг времени. Did лишний."
   },
   {
    "id": "reported-2",
    "prompt_context": "What did your roommate want?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "if"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "he",
     "asked",
     "me",
     "I",
     "could",
     "lend him",
     "my notes"
    ],
    "bank": [
     "he",
     "asked",
     "me",
     "I",
     "could",
     "lend him",
     "my notes"
    ],
    "sample_answer": "He asked me if I could lend him my notes.",
    "explanation": "Asked me if I could… — could после подлежащего I."
   },
   {
    "id": "reported-3",
    "prompt_context": "Who wrote the group report?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "who"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "I'm",
     "not sure",
     "worked on",
     "the final",
     "version"
    ],
    "bank": [
     "I'm",
     "not sure",
     "worked on",
     "the final",
     "version"
    ],
    "sample_answer": "I'm not sure who worked on the final version.",
    "explanation": "Who — подлежащее придаточного, сразу глагол worked on."
   },
   {
    "id": "reported-4",
    "prompt_context": "Why did the manager call you?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "when"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "she",
     "needed",
     "to know",
     "I",
     "could",
     "start working"
    ],
    "bank": [
     "she",
     "needed",
     "to know",
     "I",
     "could",
     "start working"
    ],
    "sample_answer": "She needed to know when I could start working.",
    "explanation": "When I could start working — could после I."
   },
   {
    "id": "reported-5",
    "prompt_context": "What did the professor ask after class?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "how"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "he",
     "asked",
     "I",
     "was able",
     "to finish",
     "so quickly"
    ],
    "bank": [
     "he",
     "asked",
     "I",
     "was able",
     "to finish",
     "so quickly",
     "did"
    ],
    "sample_answer": "He asked how I was able to finish so quickly.",
    "explanation": "How I was able… — was после I. Did лишний."
   },
   {
    "id": "reported-6",
    "prompt_context": "What do the organizers want?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "what"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "they",
     "want",
     "to find out",
     "students",
     "think",
     "of the event"
    ],
    "bank": [
     "they",
     "want",
     "to find out",
     "students",
     "think",
     "of the event"
    ],
    "sample_answer": "They want to find out what students think of the event.",
    "explanation": "What students think — без do: подлежащее students, потом think."
   },
   {
    "id": "reported-7",
    "prompt_context": "Did the advisor answer your question?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "whether"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "she",
     "didn't",
     "know",
     "the course",
     "was",
     "still open"
    ],
    "bank": [
     "she",
     "didn't",
     "know",
     "the course",
     "was",
     "still open"
    ],
    "sample_answer": "She didn't know whether the course was still open.",
    "explanation": "Whether the course was still open — was после подлежащего."
   },
   {
    "id": "reported-8",
    "prompt_context": "Why did you email the IT office?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "how"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "I",
     "wanted",
     "to ask",
     "to",
     "reset",
     "my password"
    ],
    "bank": [
     "I",
     "wanted",
     "to ask",
     "to",
     "reset",
     "my password"
    ],
    "sample_answer": "I wanted to ask how to reset my password.",
    "explanation": "How to reset — «как сбросить»: вопросительное слово + to + глагол."
   },
   {
    "id": "reported-9",
    "prompt_context": "What did Mark want to know?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "where"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "he",
     "wondered",
     "we",
     "had",
     "parked",
     "the car"
    ],
    "bank": [
     "he",
     "wondered",
     "we",
     "had",
     "parked",
     "the car",
     "did"
    ],
    "sample_answer": "He wondered where we had parked the car.",
    "explanation": "Where we had parked — had после we. Did лишний."
   },
   {
    "id": "reported-10",
    "prompt_context": "Did you ask about the internship?",
    "structure": [
     {
      "type": "text",
      "value": "Yes,"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "if"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "I",
     "asked",
     "it",
     "would",
     "be paid"
    ],
    "bank": [
     "I",
     "asked",
     "it",
     "would",
     "be paid"
    ],
    "sample_answer": "Yes, I asked if it would be paid.",
    "explanation": "Asked if it would be paid — would после it."
   },
   {
    "id": "reported-11",
    "prompt_context": "What is your friend curious about?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "about"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "she",
     "is",
     "curious",
     "what",
     "I",
     "studied",
     "last semester"
    ],
    "bank": [
     "she",
     "is",
     "curious",
     "what",
     "I",
     "studied",
     "last semester"
    ],
    "sample_answer": "She is curious about what I studied last semester.",
    "explanation": "What I studied — без did: подлежащее I, затем studied."
   },
   {
    "id": "reported-12",
    "prompt_context": "Why did the librarian call you?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "that"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "she",
     "wanted",
     "to tell",
     "me",
     "my book",
     "had arrived"
    ],
    "bank": [
     "she",
     "wanted",
     "to tell",
     "me",
     "my book",
     "had arrived"
    ],
    "sample_answer": "She wanted to tell me that my book had arrived.",
    "explanation": "Tell me that… — пересказ сообщения: my book had arrived."
   }
  ]
 },
 {
  "id": "passive",
  "icon": "repeat-2",
  "title": "Passive Voice",
  "ru": "Пассив",
  "sum": "be + V3: is being held, has been updated, will be posted",
  "rule": [
   "Пассив — **be (в нужной форме) + третья форма глагола**: it will be held, it is being repaired, it has been moved.",
   "Кто сделал — через **by**: It was designed **by** a famous architect.",
   "В кусочках часто бывает лишняя -ing-форма (holding, designing): в пассиве после be нужна третья форма."
  ],
  "examples": [
   "It | will | be | held | in the main stadium.",
   "It | is | being | repaired | after the storm."
  ],
  "items": [
   {
    "id": "passive-1",
    "prompt_context": "Where is the graduation ceremony?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "in"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "it",
     "will",
     "be",
     "held",
     "the main stadium"
    ],
    "bank": [
     "it",
     "will",
     "be",
     "held",
     "the main stadium",
     "holding"
    ],
    "sample_answer": "It will be held in the main stadium.",
    "explanation": "Will be held — пассив будущего времени. Holding лишний: после be в пассиве — третья форма."
   },
   {
    "id": "passive-2",
    "prompt_context": "Why is the road closed?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "after"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "it",
     "is",
     "being",
     "repaired",
     "the storm"
    ],
    "bank": [
     "it",
     "is",
     "being",
     "repaired",
     "the storm"
    ],
    "sample_answer": "It is being repaired after the storm.",
    "explanation": "Is being repaired — «сейчас ремонтируют»."
   },
   {
    "id": "passive-3",
    "prompt_context": "Has the schedule been updated?",
    "structure": [
     {
      "type": "text",
      "value": "Yes,"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "was"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "it",
     "updated",
     "by",
     "the office",
     "this morning"
    ],
    "bank": [
     "it",
     "updated",
     "by",
     "the office",
     "this morning"
    ],
    "sample_answer": "Yes, it was updated by the office this morning.",
    "explanation": "Was updated by the office — кто сделал, через by."
   },
   {
    "id": "passive-4",
    "prompt_context": "Who designed the new library?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "by"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "it",
     "was",
     "designed",
     "a famous",
     "local architect"
    ],
    "bank": [
     "it",
     "was",
     "designed",
     "a famous",
     "local architect",
     "designing"
    ],
    "sample_answer": "It was designed by a famous local architect.",
    "explanation": "Was designed by… — пассив прошедшего времени. Designing лишний."
   },
   {
    "id": "passive-5",
    "prompt_context": "Is the bridge open again?",
    "structure": [
     {
      "type": "text",
      "value": "No,"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "has"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "it",
     "not",
     "been",
     "reopened",
     "yet"
    ],
    "bank": [
     "it",
     "not",
     "been",
     "reopened",
     "yet"
    ],
    "sample_answer": "No, it has not been reopened yet.",
    "explanation": "Has not been reopened — not после has, затем been + третья форма."
   },
   {
    "id": "passive-6",
    "prompt_context": "Why can't I log in to the portal?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "been"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "your account",
     "may",
     "have",
     "locked",
     "by mistake"
    ],
    "bank": [
     "your account",
     "may",
     "have",
     "locked",
     "by mistake"
    ],
    "sample_answer": "Your account may have been locked by mistake.",
    "explanation": "May have been locked — «возможно, заблокировали»."
   },
   {
    "id": "passive-7",
    "prompt_context": "Are the essays graded yet?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "are"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "they",
     "being",
     "checked",
     "by",
     "the teaching assistant"
    ],
    "bank": [
     "they",
     "being",
     "checked",
     "by",
     "the teaching assistant",
     "checking"
    ],
    "sample_answer": "They are being checked by the teaching assistant.",
    "explanation": "Are being checked — сейчас проверяются. Checking лишний."
   },
   {
    "id": "passive-8",
    "prompt_context": "What happened to the old cafeteria?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "into"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "it",
     "was",
     "turned",
     "a study",
     "space"
    ],
    "bank": [
     "it",
     "was",
     "turned",
     "a study",
     "space"
    ],
    "sample_answer": "It was turned into a study space.",
    "explanation": "Was turned into — «превратили в»."
   },
   {
    "id": "passive-9",
    "prompt_context": "When will we get the results?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "will"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "they",
     "be",
     "posted",
     "online",
     "next Monday"
    ],
    "bank": [
     "they",
     "be",
     "posted",
     "online",
     "next Monday"
    ],
    "sample_answer": "They will be posted online next Monday.",
    "explanation": "Will be posted — пассив будущего; где и когда — в конце."
   },
   {
    "id": "passive-10",
    "prompt_context": "Where are the lost items kept?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "at"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "they",
     "are",
     "stored",
     "the front desk",
     "of the gym"
    ],
    "bank": [
     "they",
     "are",
     "stored",
     "the front desk",
     "of the gym"
    ],
    "sample_answer": "They are stored at the front desk of the gym.",
    "explanation": "Are stored at… — «хранятся на…»."
   },
   {
    "id": "passive-11",
    "prompt_context": "Is the conference still happening?",
    "structure": [
     {
      "type": "text",
      "value": "Yes,"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "has"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "but",
     "it",
     "been",
     "moved",
     "to April"
    ],
    "bank": [
     "but",
     "it",
     "been",
     "moved",
     "to April"
    ],
    "sample_answer": "Yes, but it has been moved to April.",
    "explanation": "Has been moved — пассив в Present Perfect."
   },
   {
    "id": "passive-12",
    "prompt_context": "Who is organizing the fundraiser?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "being"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "it",
     "is",
     "organized",
     "by",
     "the student council"
    ],
    "bank": [
     "it",
     "is",
     "organized",
     "by",
     "the student council"
    ],
    "sample_answer": "It is being organized by the student council.",
    "explanation": "Is being organized by… — кто делает, через by."
   }
  ]
 },
 {
  "id": "comparisons-modals",
  "icon": "scale",
  "title": "Comparisons & Modals",
  "ru": "Сравнения и модальные глаголы",
  "sum": "quieter than, the best, as… as; should, might, must, could",
  "rule": [
   "Сравнение: **-er than / more … than** (quieter than, more crowded than), превосходная степень: **the best, the newest, the most comfortable**. Нельзя «more quieter».",
   "**As … as** — «такой же, как», **not as … as** — «не такой, как».",
   "После **should, might, must, could, would** — глагол в начальной форме без to: you should take, it might rain."
  ],
  "examples": [
   "It | is | much quieter | than | my old one.",
   "You | should | take | the one | with Professor Diaz."
  ],
  "items": [
   {
    "id": "comparisons-modals-1",
    "prompt_context": "How is your new apartment?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "than"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "it",
     "is",
     "much",
     "quieter",
     "my old",
     "one"
    ],
    "bank": [
     "it",
     "is",
     "much",
     "quieter",
     "my old",
     "one",
     "more"
    ],
    "sample_answer": "It is much quieter than my old one.",
    "explanation": "Quieter than — сравнительная степень коротких прилагательных с -er; more с ней не ставится."
   },
   {
    "id": "comparisons-modals-2",
    "prompt_context": "Which class do you recommend?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "the"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "you",
     "should",
     "take",
     "one",
     "with",
     "Professor Diaz"
    ],
    "bank": [
     "you",
     "should",
     "take",
     "one",
     "with",
     "Professor Diaz"
    ],
    "sample_answer": "You should take the one with Professor Diaz.",
    "explanation": "Should take — после should глагол без to."
   },
   {
    "id": "comparisons-modals-3",
    "prompt_context": "Do you think it will rain later?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "to"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "you",
     "might",
     "want",
     "bring",
     "an umbrella"
    ],
    "bank": [
     "you",
     "might",
     "want",
     "bring",
     "an umbrella"
    ],
    "sample_answer": "You might want to bring an umbrella.",
    "explanation": "Might want to… — «возможно, стоит…»: might + глагол без to, затем want to bring."
   },
   {
    "id": "comparisons-modals-4",
    "prompt_context": "Which campus café is the best?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "has"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "the one",
     "near",
     "the gym",
     "the best",
     "coffee"
    ],
    "bank": [
     "the one",
     "near",
     "the gym",
     "the best",
     "coffee"
    ],
    "sample_answer": "The one near the gym has the best coffee.",
    "explanation": "The best — превосходная степень; the one near the gym — подлежащее."
   },
   {
    "id": "comparisons-modals-5",
    "prompt_context": "Can I submit the essay late?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "must"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "you",
     "ask",
     "the professor",
     "for",
     "permission first"
    ],
    "bank": [
     "you",
     "ask",
     "the professor",
     "for",
     "permission first"
    ],
    "sample_answer": "You must ask the professor for permission first.",
    "explanation": "Must ask — после must глагол без to."
   },
   {
    "id": "comparisons-modals-6",
    "prompt_context": "How was the second exam?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "not"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "it",
     "was",
     "as difficult",
     "as",
     "the first one"
    ],
    "bank": [
     "it",
     "was",
     "as difficult",
     "as",
     "the first one"
    ],
    "sample_answer": "It was not as difficult as the first one.",
    "explanation": "Not as difficult as — «не такой трудный, как»."
   },
   {
    "id": "comparisons-modals-7",
    "prompt_context": "Should I take the bus or walk?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "faster"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "walking",
     "would",
     "be",
     "at",
     "this time",
     "of day"
    ],
    "bank": [
     "walking",
     "would",
     "be",
     "at",
     "this time",
     "of day"
    ],
    "sample_answer": "Walking would be faster at this time of day.",
    "explanation": "Would be faster — «было бы быстрее»."
   },
   {
    "id": "comparisons-modals-8",
    "prompt_context": "Is the library busy today?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "more"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "it",
     "is",
     "crowded",
     "than",
     "usual",
     "this week"
    ],
    "bank": [
     "it",
     "is",
     "crowded",
     "than",
     "usual",
     "this week"
    ],
    "sample_answer": "It is more crowded than usual this week.",
    "explanation": "More crowded than usual — длинное прилагательное, поэтому more."
   },
   {
    "id": "comparisons-modals-9",
    "prompt_context": "What should I do before the interview?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "should"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "you",
     "learn",
     "as much",
     "as",
     "you can",
     "about the company"
    ],
    "bank": [
     "you",
     "learn",
     "as much",
     "as",
     "you can",
     "about the company"
    ],
    "sample_answer": "You should learn as much as you can about the company.",
    "explanation": "As much as you can — «как можно больше»."
   },
   {
    "id": "comparisons-modals-10",
    "prompt_context": "Do you want to meet on Thursday?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "work"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "Friday",
     "would",
     "better",
     "for",
     "me"
    ],
    "bank": [
     "Friday",
     "would",
     "better",
     "for",
     "me"
    ],
    "sample_answer": "Friday would work better for me.",
    "explanation": "Would work better — «подошло бы лучше»."
   },
   {
    "id": "comparisons-modals-11",
    "prompt_context": "Which dorm is the newest?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "and"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "Baker Hall",
     "is",
     "the newest",
     "the most",
     "comfortable",
     "one"
    ],
    "bank": [
     "Baker Hall",
     "is",
     "the newest",
     "the most",
     "comfortable",
     "one",
     "newer"
    ],
    "sample_answer": "Baker Hall is the newest and the most comfortable one.",
    "explanation": "The newest и the most comfortable — две превосходные степени. Newer лишний."
   },
   {
    "id": "comparisons-modals-12",
    "prompt_context": "Are you joining us for dinner?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "could"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "I",
     "come",
     "if",
     "I finish",
     "my work early"
    ],
    "bank": [
     "I",
     "come",
     "if",
     "I finish",
     "my work early"
    ],
    "sample_answer": "I could come if I finish my work early.",
    "explanation": "Could come — «смогу прийти»; условие if I finish… — во второй части."
   }
  ]
 },
 {
  "id": "exam-mix",
  "icon": "trophy",
  "title": "Exam Mix",
  "ru": "Микс как на экзамене",
  "sum": "Всё вместе, иногда с лишним кусочком — как в реальном Build a Sentence",
  "rule": [
   "Здесь задания всех типов вперемешку — как на экзамене. Примерно в каждом третьем есть **один лишний кусочек**: его нужно оставить.",
   "Алгоритм: 1) прочитайте реплику собеседника; 2) найдите подлежащее и глагол; 3) посмотрите на вписанные слова — они подсказывают порядок; 4) проверьте, нет ли лишнего do / did / when / -ing.",
   "Если в начале стоит **Do you know / Can you tell me** — дальше порядок утверждения."
  ],
  "examples": [
   "Do | you | know | if | it is | free for students?",
   "I | found | an apartment | where | pets are allowed."
  ],
  "items": [
   {
    "id": "exam-mix-1",
    "prompt_context": "The campus art exhibition opens next week.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "it"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "do",
     "you",
     "know",
     "if",
     "is",
     "free",
     "for students"
    ],
    "bank": [
     "do",
     "you",
     "know",
     "if",
     "is",
     "free",
     "for students",
     "does"
    ],
    "sample_answer": "Do you know if it is free for students?",
    "explanation": "Косвенный вопрос: if it is free — порядок утверждения, does не нужен."
   },
   {
    "id": "exam-mix-2",
    "prompt_context": "I finished my presentation slides.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "the"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "did",
     "you",
     "add",
     "charts",
     "we",
     "discussed"
    ],
    "bank": [
     "did",
     "you",
     "add",
     "charts",
     "we",
     "discussed"
    ],
    "sample_answer": "Did you add the charts we discussed?",
    "explanation": "Did + you + add: глагол в начальной форме; the charts we discussed — «графики, которые мы обсуждали»."
   },
   {
    "id": "exam-mix-3",
    "prompt_context": "Why didn't you come to the picnic?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "a"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "I",
     "had",
     "to",
     "finish",
     "lab report",
     "for chemistry"
    ],
    "bank": [
     "I",
     "had",
     "to",
     "finish",
     "lab report",
     "for chemistry",
     "have"
    ],
    "sample_answer": "I had to finish a lab report for chemistry.",
    "explanation": "Had to finish — о прошлом; have лишний."
   },
   {
    "id": "exam-mix-4",
    "prompt_context": "The new fitness center is huge.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "that"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "is",
     "that",
     "the one",
     "has",
     "an indoor",
     "pool"
    ],
    "bank": [
     "is",
     "that",
     "the one",
     "has",
     "an indoor",
     "pool",
     "where"
    ],
    "sample_answer": "Is that the one that has an indoor pool?",
    "explanation": "The one that has… — that о предмете. Where лишний: после него было бы нужно подлежащее (where there is…)."
   },
   {
    "id": "exam-mix-5",
    "prompt_context": "I want to improve my pronunciation.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "recording"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "have",
     "you",
     "tried",
     "yourself",
     "while",
     "speaking"
    ],
    "bank": [
     "have",
     "you",
     "tried",
     "yourself",
     "while",
     "speaking"
    ],
    "sample_answer": "Have you tried recording yourself while speaking?",
    "explanation": "Have you tried + -ing — «пробовал ли ты…»."
   },
   {
    "id": "exam-mix-6",
    "prompt_context": "The bus route changed this week.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "why"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "do",
     "you",
     "know",
     "the schedule",
     "was",
     "changed"
    ],
    "bank": [
     "do",
     "you",
     "know",
     "the schedule",
     "was",
     "changed",
     "did"
    ],
    "sample_answer": "Do you know why the schedule was changed?",
    "explanation": "Why the schedule was changed — порядок утверждения, без did."
   },
   {
    "id": "exam-mix-7",
    "prompt_context": "Where are you going this summer?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "to"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "I",
     "am",
     "planning",
     "visit",
     "my cousins",
     "in Canada"
    ],
    "bank": [
     "I",
     "am",
     "planning",
     "visit",
     "my cousins",
     "in Canada"
    ],
    "sample_answer": "I am planning to visit my cousins in Canada.",
    "explanation": "Plan + to + глагол: planning to visit."
   },
   {
    "id": "exam-mix-8",
    "prompt_context": "Is the café open on Sundays?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "what"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "I'm",
     "not",
     "sure",
     "time",
     "it",
     "opens"
    ],
    "bank": [
     "I'm",
     "not",
     "sure",
     "time",
     "it",
     "opens"
    ],
    "sample_answer": "I'm not sure what time it opens.",
    "explanation": "What time it opens — порядок утверждения, без does."
   },
   {
    "id": "exam-mix-9",
    "prompt_context": "Professor Adams loved your essay.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "how"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "she",
     "wanted",
     "to know",
     "long",
     "it",
     "took me",
     "to write"
    ],
    "bank": [
     "she",
     "wanted",
     "to know",
     "long",
     "it",
     "took me",
     "to write",
     "did"
    ],
    "sample_answer": "She wanted to know how long it took me to write.",
    "explanation": "How long it took me — пересказанный вопрос, did не нужен."
   },
   {
    "id": "exam-mix-10",
    "prompt_context": "Did you get the email about the trip?",
    "structure": [
     {
      "type": "text",
      "value": "No,"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "haven't"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "I",
     "checked",
     "my inbox",
     "today"
    ],
    "bank": [
     "I",
     "checked",
     "my inbox",
     "today"
    ],
    "sample_answer": "No, I haven't checked my inbox today.",
    "explanation": "Haven't checked — Present Perfect с today."
   },
   {
    "id": "exam-mix-11",
    "prompt_context": "Our club needs a new treasurer.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "what"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "can",
     "you",
     "tell",
     "me",
     "the job",
     "involves"
    ],
    "bank": [
     "can",
     "you",
     "tell",
     "me",
     "the job",
     "involves",
     "does"
    ],
    "sample_answer": "Can you tell me what the job involves?",
    "explanation": "What the job involves — глагол с -s, без does."
   },
   {
    "id": "exam-mix-12",
    "prompt_context": "Why are you so happy?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "has"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "my application",
     "been",
     "accepted",
     "by",
     "the university"
    ],
    "bank": [
     "my application",
     "been",
     "accepted",
     "by",
     "the university"
    ],
    "sample_answer": "My application has been accepted by the university.",
    "explanation": "Has been accepted — пассив в Present Perfect."
   },
   {
    "id": "exam-mix-13",
    "prompt_context": "How was the restaurant?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "better"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "the food",
     "was",
     "than",
     "I",
     "had",
     "expected"
    ],
    "bank": [
     "the food",
     "was",
     "than",
     "I",
     "had",
     "expected"
    ],
    "sample_answer": "The food was better than I had expected.",
    "explanation": "Better than I had expected — «лучше, чем я ожидал»."
   },
   {
    "id": "exam-mix-14",
    "prompt_context": "I lost the notes from yesterday's lecture.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "mine"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "you",
     "can",
     "borrow",
     "if",
     "you want"
    ],
    "bank": [
     "you",
     "can",
     "borrow",
     "if",
     "you want"
    ],
    "sample_answer": "You can borrow mine if you want.",
    "explanation": "Can borrow — глагол без to; mine — «мои»."
   },
   {
    "id": "exam-mix-15",
    "prompt_context": "Who is giving the keynote speech?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "given"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "it",
     "will",
     "be",
     "by",
     "a famous",
     "scientist"
    ],
    "bank": [
     "it",
     "will",
     "be",
     "by",
     "a famous",
     "scientist",
     "giving"
    ],
    "sample_answer": "It will be given by a famous scientist.",
    "explanation": "Will be given by — пассив будущего времени. Giving лишний."
   },
   {
    "id": "exam-mix-16",
    "prompt_context": "I heard you're moving off campus.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "where"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "I",
     "found",
     "an apartment",
     "pets",
     "are",
     "allowed"
    ],
    "bank": [
     "I",
     "found",
     "an apartment",
     "pets",
     "are",
     "allowed",
     "which"
    ],
    "sample_answer": "I found an apartment where pets are allowed.",
    "explanation": "Where pets are allowed — о месте. Which лишний: which pets are allowed не описывает квартиру."
   },
   {
    "id": "exam-mix-17",
    "prompt_context": "The study group meets tonight.",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "where"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "do",
     "you",
     "know",
     "they",
     "are",
     "meeting"
    ],
    "bank": [
     "do",
     "you",
     "know",
     "they",
     "are",
     "meeting",
     "does"
    ],
    "sample_answer": "Do you know where they are meeting?",
    "explanation": "Where they are meeting — are после they. Does лишний."
   },
   {
    "id": "exam-mix-18",
    "prompt_context": "What did the career advisor say?",
    "structure": [
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "to"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "she",
     "told",
     "me",
     "update",
     "my résumé",
     "before applying"
    ],
    "bank": [
     "she",
     "told",
     "me",
     "update",
     "my résumé",
     "before applying"
    ],
    "sample_answer": "She told me to update my résumé before applying.",
    "explanation": "Tell somebody to do something: told me to update."
   },
   {
    "id": "exam-mix-19",
    "prompt_context": "Have you seen the new schedule?",
    "structure": [
     {
      "type": "text",
      "value": "Yes,"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "don't"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "and",
     "I",
     "like",
     "the early",
     "morning classes"
    ],
    "bank": [
     "and",
     "I",
     "like",
     "the early",
     "morning classes"
    ],
    "sample_answer": "Yes, and I don't like the early morning classes.",
    "explanation": "Don't like — после don't глагол в начальной форме."
   },
   {
    "id": "exam-mix-20",
    "prompt_context": "Are you taking the bus home?",
    "structure": [
     {
      "type": "text",
      "value": "No,"
     },
     {
      "type": "slot"
     },
     {
      "type": "text",
      "value": "is"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     },
     {
      "type": "slot"
     }
    ],
    "answer": [
     "my brother",
     "picking",
     "me",
     "up",
     "after class"
    ],
    "bank": [
     "my brother",
     "picking",
     "me",
     "up",
     "after class"
    ],
    "sample_answer": "No, my brother is picking me up after class.",
    "explanation": "Pick me up — местоимение между pick и up: is picking me up."
   }
  ]
 }
];
