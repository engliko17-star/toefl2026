// =====================================================================
// Новые задания тренажёра Reading (reading-trainer.html).
// Написаны по образцу заданий с пометкой is_real_toefl: тот же формат,
// длина текстов, формулировки вопросов и стиль объяснений.
// Формат строк — как в academic_tasks / daily_life_tasks: title, passage,
// questions (text, type, options, correct, explanation, highlight…), у Daily — layout_type.
// Разметка: [s1]…[sN] — Select a Sentence, [sq1]…[sq4] — Insert Text.
// Тренажёр разбирает каждый текст на отдельные вопросы.
// =====================================================================
window.READING_TRAINER_NEW = {
 "academic": [
  {
   "title": "Mass Spawning in Coral Reefs",
   "passage": "On a few nights each year, many reef-building corals release their eggs and sperm into the sea at almost the same moment. This event, known as mass spawning, can turn the water above a reef cloudy with millions of tiny bundles drifting toward the surface. Because corals cannot move to find partners, releasing gametes together greatly increases the chance that eggs from one colony will meet sperm from another.\n\nScientists have identified several cues that coordinate the timing. [sq1] Rising water temperature in spring tells corals that the season is approaching. [sq2] The phase of the moon then narrows the window to a few days, and the darkness that follows sunset determines the exact hour. [sq3] Together, these signals allow colonies separated by many kilometers to act in near unison. [sq4]\n\nThis precise timing, however, may be under threat. In some reefs, warming oceans appear to be shifting the dates on which different species spawn, so that colonies that once released gametes together now do so on separate nights. Researchers worry that this loss of synchrony could reduce fertilization rates and slow the recovery of damaged reefs.",
   "questions": [
    {
     "text": "According to paragraph 1, why do corals release their eggs and sperm at the same time?",
     "type": "Factual",
     "correct": 0,
     "options": [
      "Because corals cannot travel to find partners",
      "Because the bundles need cloudy water to survive",
      "Because predators are less active during spawning",
      "Because the water is calmest on those nights"
     ],
     "explanation": "«Because corals cannot move to find partners, releasing gametes together greatly increases the chance…» — кораллы не могут двигаться, поэтому выпускают клетки одновременно. Про спокойную воду и хищников в тексте нет, а мутная вода — следствие нереста, а не причина."
    },
    {
     "text": "The word \"narrows\" in the passage is closest in meaning to",
     "type": "Vocabulary",
     "correct": 0,
     "options": [
      "limits",
      "delays",
      "explains",
      "extends"
     ],
     "explanation": "Фаза луны «narrows the window to a few days» — сужает, ограничивает окно до нескольких дней. Extends — наоборот, «расширяет»."
    },
    {
     "text": "The phrase \"these signals\" in the passage refers to",
     "type": "Reference",
     "correct": 1,
     "options": [
      "the movements of the water above a reef",
      "changes in temperature, moonlight, and darkness",
      "messages sent between distant colonies",
      "the dates on which species spawn"
     ],
     "explanation": "До этого перечислены три сигнала: температура воды, фаза луны и темнота после заката. «Together, these signals…» — все они вместе.",
     "highlight": "these signals",
     "highlight_occurrence": 1
    },
    {
     "text": "Look at the four letters (A, B, C, D) in the passage that indicate where the following sentence could be added to the passage. Where would the sentence best fit?",
     "type": "Insert Text",
     "correct": 2,
     "options": [
      "Position A",
      "Position B",
      "Position C",
      "Position D"
     ],
     "explanation": "«This light» должно опираться на что-то про свет. Перед позицией C говорится о фазе луны и темноте после заката — свет луны. Перед A и B речи о свете нет, а D стоит после общего вывода, далеко от луны.",
     "insertSentence": "Corals are thought to sense this light through proteins in their tissues, even though they have no eyes."
    },
    {
     "text": "Which of the following best summarizes the main point of the passage?",
     "type": "Main Idea",
     "correct": 2,
     "options": [
      "Mass spawning makes reef water cloudy and harms other marine life.",
      "Scientists have learned how to make corals spawn in laboratories.",
      "Corals spawn together using environmental cues, but warming waters may disrupt this timing.",
      "Corals use moonlight to locate partners on distant reefs."
     ],
     "explanation": "Текст о том, как кораллы синхронно нерестятся по сигналам среды (абзацы 1–2), и о том, что потепление может эту синхронность нарушить (абзац 3). Остальные варианты — деталь, искажение или то, чего в тексте нет."
    }
   ],
   "id": "n1"
  },
  {
   "title": "The Secret of Roman Concrete",
   "passage": "Many structures built by the ancient Romans, from harbor walls to the dome of the Pantheon, are still standing nearly two thousand years later. Modern concrete, by contrast, often begins to crack within decades, especially in seawater. This difference has long puzzled engineers, who assumed that the Romans simply used better raw materials.\n\n[s1] Recent analysis suggests the answer is more surprising. [s2] Roman builders mixed lime with volcanic ash, and they appear to have added the lime while it was still hot and highly reactive. [s3] This process left small white lumps of lime scattered throughout the concrete. [s4] Earlier researchers had dismissed these lumps as evidence of careless mixing. [s5] However, when cracks form and water seeps in, the lumps dissolve and then harden again as new mineral crystals, sealing the crack before it can spread.\n\nEngineers are now testing modern mixtures that copy this self-healing behavior. If successful, such materials could make roads and bridges last far longer, reducing the energy and expense required to repair them. The Romans, it seems, understood something about durability that modern builders are only beginning to rediscover.",
   "questions": [
    {
     "text": "Identify the sentence in paragraph 2 that describes a mistaken view held by earlier researchers.",
     "type": "Select a Sentence",
     "correct": 4,
     "options": [],
     "explanation": "«Earlier researchers had dismissed these lumps as evidence of careless mixing» — раньше комочки считали признаком небрежного замеса, а оказалось, что они «лечат» трещины."
    },
    {
     "text": "Which of the following best expresses the essential information in the highlighted sentence?",
     "type": "Simplification",
     "correct": 3,
     "options": [
      "Repairing roads and bridges requires too much energy to be successful.",
      "Engineers hope to reduce the energy used to produce self-healing materials.",
      "Roads and bridges built with Roman concrete are cheaper to construct.",
      "Successful self-healing materials could extend the life of roads and bridges and lower repair costs."
     ],
     "explanation": "В предложении две мысли: такие материалы продлят жизнь дорог и мостов и сократят затраты на ремонт. D передаёт обе. C — про стоимость строительства, а не ремонта; B путает энергию на ремонт с энергией на производство.",
     "highlight": "If successful, such materials could make roads and bridges last far longer, reducing the energy and expense required to repair them.",
     "highlight_occurrence": 1
    },
    {
     "text": "The word \"dismissed\" in the passage is closest in meaning to",
     "type": "Vocabulary",
     "correct": 1,
     "options": [
      "explained",
      "rejected",
      "removed",
      "measured"
     ],
     "explanation": "Dismissed as … — «отмахнулись, сочли неважным»: комочки не приняли всерьёз. Removed — «убрали физически», это другое значение."
    },
    {
     "text": "What can be inferred about modern concrete from the passage?",
     "type": "Inference",
     "correct": 1,
     "options": [
      "It is made with volcanic ash.",
      "It usually lacks a way to repair its own cracks.",
      "It lasts longer than Roman concrete in fresh water.",
      "It was invented by copying Roman techniques."
     ],
     "explanation": "Современный бетон трескается за десятилетия, а инженеры только сейчас пробуют скопировать «self-healing behavior». Значит, у обычного современного бетона такого свойства нет."
    },
    {
     "text": "Why does the author mention \"the dome of the Pantheon\"?",
     "type": "Rhetorical Purpose",
     "correct": 2,
     "options": [
      "To explain how hot lime was added to concrete",
      "To compare Roman buildings with modern bridges",
      "To give an example of a Roman structure that has lasted a very long time",
      "To show that Romans preferred domes to walls"
     ],
     "explanation": "Купол Пантеона — пример римской постройки, которая стоит почти две тысячи лет («are still standing nearly two thousand years later»).",
     "highlight": "the dome of the Pantheon",
     "highlight_occurrence": 1
    }
   ],
   "id": "n2"
  },
  {
   "title": "Urban Heat Islands",
   "passage": "On a summer afternoon, the center of a large city can be several degrees warmer than the countryside around it. This effect, called the urban heat island, results largely from the materials cities are built from. Asphalt and concrete absorb sunlight during the day and release the stored heat slowly at night, so cities often cool down far less after sunset than rural areas do.\n\nOther features of urban life add to the problem. Cars, air conditioners, and factories all give off waste heat. [sq1] Tall buildings block wind that might otherwise carry warm air away. [sq2] In addition, cities have fewer trees and less exposed soil, which normally cool the air as water evaporates from them. [sq3]\n\nHeat islands are more than a matter of comfort. [sq4] During heat waves, higher nighttime temperatures prevent people's bodies from recovering, which increases the risk of illness, especially among the elderly. Cities are therefore experimenting with solutions such as reflective \"cool roofs,\" which bounce sunlight back into the sky, and new parks that provide both shade and evaporative cooling.",
   "questions": [
    {
     "text": "What is the relationship between paragraph 1 and paragraph 2?",
     "type": "Organization",
     "correct": 0,
     "options": [
      "Paragraph 1 describes a main cause of the heat island effect, and paragraph 2 adds further contributing factors.",
      "Paragraph 1 presents a theory, and paragraph 2 argues that the theory is wrong.",
      "Paragraph 1 describes a problem, and paragraph 2 offers solutions to it.",
      "Paragraph 1 compares cities and rural areas, and paragraph 2 describes the effects on health."
     ],
     "explanation": "Абзац 1: главная причина — асфальт и бетон («results largely from the materials»). Абзац 2 начинается с «Other features of urban life add to the problem» — добавляет другие причины. Решения и здоровье — это абзац 3."
    },
    {
     "text": "Look at the four letters (A, B, C, D) in the passage that indicate where the following sentence could be added to the passage. Where would the sentence best fit?",
     "type": "Insert Text",
     "correct": 0,
     "options": [
      "Position A",
      "Position B",
      "Position C",
      "Position D"
     ],
     "explanation": "Предложение продолжает мысль о кондиционерах, которые выделяют тепло. Они названы прямо перед позицией A: «Cars, air conditioners, and factories all give off waste heat». В остальных позициях речь о ветре, деревьях и здоровье — «therefore» не на что опереться.",
     "insertSentence": "Ironically, the air conditioners used to escape the heat therefore make the outdoor air even warmer."
    },
    {
     "text": "According to paragraph 1, why do cities stay warm at night?",
     "type": "Factual",
     "correct": 1,
     "options": [
      "Because cars are driven more at night",
      "Because building materials release heat absorbed during the day",
      "Because rural winds blow warm air into cities",
      "Because there is more sunlight in cities"
     ],
     "explanation": "«Asphalt and concrete absorb sunlight during the day and release the stored heat slowly at night» — материалы отдают накопленное за день тепло."
    },
    {
     "text": "All of the following are mentioned as causes of urban heat islands EXCEPT",
     "type": "Negative Factual",
     "correct": 3,
     "options": [
      "heat produced by vehicles and machines",
      "buildings that block the wind",
      "a lack of trees and soil",
      "pollution that traps sunlight in the air"
     ],
     "explanation": "Машины и техника («give off waste heat»), здания, которые закрывают ветер, и нехватка деревьев и почвы в тексте есть. О загрязнении воздуха, которое удерживает солнечный свет, не сказано."
    },
    {
     "text": "The word \"exposed\" in the passage is closest in meaning to",
     "type": "Vocabulary",
     "correct": 2,
     "options": [
      "fertile",
      "damaged",
      "uncovered",
      "dangerous"
     ],
     "explanation": "Exposed soil — открытая, ничем не покрытая почва (не под асфальтом), с которой испаряется вода."
    }
   ],
   "id": "n3"
  },
  {
   "title": "Placebo and Nocebo Effects",
   "passage": "In medical research, new drugs are usually tested against placebos, pills that contain no active ingredient. Surprisingly, patients who receive placebos often report real improvements, particularly in symptoms such as pain and fatigue. Researchers believe this happens because expecting to feel better can trigger the brain to release its own pain-relieving chemicals.\n\nExpectation, however, can work in the opposite direction. In what is known as the nocebo effect, people who are warned about possible side effects sometimes experience them even when they have taken a harmless pill. In one study, participants told that a drug might cause headaches reported headaches far more often than those who were not told, although both groups received the same inactive tablet.\n\nThese findings create a dilemma for doctors. They are obliged to inform patients about the risks of treatment, yet the information itself may produce unpleasant symptoms. Some researchers suggest that the solution lies not in hiding risks but in describing them carefully, for example by emphasizing how many patients experience no side effects at all.",
   "questions": [
    {
     "text": "The word \"them\" in the passage refers to",
     "type": "Reference",
     "correct": 2,
     "options": [
      "researchers",
      "people",
      "side effects",
      "harmless pills"
     ],
     "explanation": "«People who are warned about possible side effects sometimes experience them» — испытывают сами побочные эффекты, о которых их предупредили.",
     "highlight": "them",
     "highlight_occurrence": 1
    },
    {
     "text": "Which of the following best expresses the essential information in the highlighted sentence?",
     "type": "Simplification",
     "correct": 0,
     "options": [
      "Doctors must tell patients about risks, but doing so may cause the symptoms they describe.",
      "Doctors should avoid informing patients about risks because of the unpleasant symptoms.",
      "Patients who ask about the risks of treatment usually experience unpleasant symptoms.",
      "Information about risks is required by law, so doctors provide it even though it is not useful."
     ],
     "explanation": "Две части, связанные «yet»: врачи обязаны рассказывать о рисках, но сам рассказ может вызвать симптомы. B советует не рассказывать — в тексте наоборот; C и D меняют смысл.",
     "highlight": "They are obliged to inform patients about the risks of treatment, yet the information itself may produce unpleasant symptoms.",
     "highlight_occurrence": 1
    },
    {
     "text": "What can be inferred about the participants in the headache study?",
     "type": "Inference",
     "correct": 2,
     "options": [
      "They were given different tablets depending on the warning.",
      "Those who were warned had more sensitive brains.",
      "Their headaches were caused by expectation rather than by the tablet.",
      "Most of them had a history of headaches."
     ],
     "explanation": "Обе группы получили одну и ту же пустую таблетку, а голова чаще болела у предупреждённых. Значит, дело в ожидании, а не в таблетке. A прямо противоречит тексту («the same inactive tablet»)."
    },
    {
     "text": "Why does the author mention \"emphasizing how many patients experience no side effects at all\"?",
     "type": "Rhetorical Purpose",
     "correct": 3,
     "options": [
      "To argue that side effects are rare",
      "To criticize doctors who hide risks",
      "To show that placebos have no side effects",
      "To give an example of how risks might be described carefully"
     ],
     "explanation": "Фраза идёт после «describing them carefully, for example…» — это пример того, как аккуратно рассказывать о рисках.",
     "highlight": "emphasizing how many patients experience no side effects at all",
     "highlight_occurrence": 1
    },
    {
     "text": "Which of the following best summarizes the passage?",
     "type": "Main Idea",
     "correct": 3,
     "options": [
      "Placebos are more effective than many new drugs.",
      "Doctors should stop warning patients about side effects.",
      "The nocebo effect occurs only in patients who suffer from headaches.",
      "Patients' expectations can both improve and worsen how they feel, which complicates how doctors communicate risks."
     ],
     "explanation": "Абзац 1 — ожидания улучшают самочувствие (плацебо), абзац 2 — ухудшают (ноцебо), абзац 3 — дилемма врачей. D объединяет все три части."
    }
   ],
   "id": "n4"
  },
  {
   "title": "The Printing Press in Europe",
   "passage": "Before the middle of the fifteenth century, books in Europe were copied by hand, usually by scribes working in monasteries. A single copy of a long text could take months to produce, so books were rare and expensive. Around 1450, Johannes Gutenberg developed a printing press that used movable metal type, individual letters that could be arranged into pages, inked, and pressed onto paper again and again.\n\n[s1] The results were dramatic. [s2] Within fifty years, printers were working in more than two hundred European cities. [s3] Millions of books had been produced, far more than scribes had copied in the previous thousand years. [s4] Because printed books were cheaper, they reached merchants and craftsmen, not just scholars and priests. [s5] This wider readership encouraged more people to learn to read.\n\nThe press also changed how knowledge developed. Scholars in different countries could now study identical copies of the same text, compare results, and correct errors in later editions. Some historians argue that this ability to share and check information was an important precondition for the scientific revolution of the following centuries.",
   "questions": [
    {
     "text": "Identify the sentence in paragraph 2 that explains how printing changed who could own books.",
     "type": "Select a Sentence",
     "correct": 4,
     "options": [],
     "explanation": "«Because printed books were cheaper, they reached merchants and craftsmen, not just scholars and priests» — книги появились у купцов и ремесленников. Предложение 5 — о следствии: больше людей стали учиться читать."
    },
    {
     "text": "What is the relationship between paragraph 2 and paragraph 3?",
     "type": "Organization",
     "correct": 1,
     "options": [
      "Paragraph 2 gives historical background, and paragraph 3 describes how Gutenberg invented the press.",
      "Paragraph 2 describes the spread and social effects of printing, and paragraph 3 describes its effect on scholarship.",
      "Paragraph 2 presents a claim, and paragraph 3 challenges it.",
      "Paragraph 2 describes problems with printing, and paragraph 3 proposes solutions."
     ],
     "explanation": "Абзац 2 — как печать распространилась и кто стал читать. Абзац 3 начинается с «The press also changed how knowledge developed» — ещё одно последствие, для науки. Это продолжение, а не возражение."
    },
    {
     "text": "According to paragraph 1, what made Gutenberg's press efficient?",
     "type": "Factual",
     "correct": 2,
     "options": [
      "It required no ink.",
      "It allowed monks to copy texts more quickly.",
      "Its letters could be rearranged and reused for many pages.",
      "It printed on cheaper paper than scribes used."
     ],
     "explanation": "Movable type — «individual letters that could be arranged into pages, inked, and pressed onto paper again and again»: буквы можно переставлять и использовать снова."
    },
    {
     "text": "The word \"precondition\" in the passage is closest in meaning to",
     "type": "Vocabulary",
     "correct": 3,
     "options": [
      "obstacle",
      "example",
      "consequence",
      "requirement"
     ],
     "explanation": "Precondition — предварительное условие, то, что нужно, чтобы что-то случилось. Consequence — наоборот, следствие."
    },
    {
     "text": "According to the passage, all of the following were results of the printing press EXCEPT",
     "type": "Negative Factual",
     "correct": 0,
     "options": [
      "Monasteries stopped producing books entirely.",
      "Books became less expensive.",
      "More people learned to read.",
      "Scholars could compare identical texts."
     ],
     "explanation": "Дешёвые книги, больше читающих и одинаковые копии для учёных в тексте есть. Что монастыри совсем перестали делать книги, не сказано."
    }
   ],
   "id": "n5"
  },
  {
   "title": "Finding Planets by Their Shadows",
   "passage": "Planets orbiting distant stars are far too faint to be seen directly in most cases, yet astronomers have now confirmed the existence of more than five thousand of them. The most productive technique for finding these exoplanets is the transit method. When a planet passes in front of its star as seen from Earth, it blocks a tiny fraction of the star's light, and a sensitive telescope can detect the resulting dip in brightness.\n\nThe size of the dip reveals the planet's size relative to its star. [sq1] A planet as large as Jupiter might dim a Sun-like star by about one percent, while an Earth-sized planet would dim it by less than one-hundredth of that amount. [sq2] The time between dips, meanwhile, shows how long the planet takes to complete one orbit. [sq3] From this period, astronomers can calculate how far the planet is from its star. [sq4]\n\nThe method has an important limitation. A transit can be observed only if the planet's orbit is lined up almost exactly with our line of sight. Most planetary systems are tilted at other angles, so their planets never pass in front of their stars from our point of view. For every planet discovered by this method, many others remain hidden.",
   "questions": [
    {
     "text": "Look at the four letters (A, B, C, D) in the passage that indicate where the following sentence could be added to the passage. Where would the sentence best fit?",
     "type": "Insert Text",
     "correct": 1,
     "options": [
      "Position A",
      "Position B",
      "Position C",
      "Position D"
     ],
     "explanation": "«Such a small change» — крошечное затемнение от планеты размером с Землю («less than one-hundredth of that amount»). Это сказано прямо перед позицией B. Перед A и после C речь не о малом изменении.",
     "insertSentence": "Detecting such a small change requires instruments placed above Earth's atmosphere, which would otherwise blur the starlight."
    },
    {
     "text": "The phrase \"this period\" in the passage refers to",
     "type": "Reference",
     "correct": 3,
     "options": [
      "the duration of a single dip in brightness",
      "the age of the star",
      "the era when exoplanets were first discovered",
      "the time the planet takes to orbit its star"
     ],
     "explanation": "Предыдущее предложение: время между затемнениями показывает, «how long the planet takes to complete one orbit». Это и есть период.",
     "highlight": "this period",
     "highlight_occurrence": 1
    },
    {
     "text": "The word \"productive\" in the passage is closest in meaning to",
     "type": "Vocabulary",
     "correct": 0,
     "options": [
      "successful",
      "expensive",
      "recent",
      "accurate"
     ],
     "explanation": "The most productive technique — метод, который даёт больше всего результатов, самый успешный."
    },
    {
     "text": "What can be inferred from paragraph 3 about the number of exoplanets?",
     "type": "Inference",
     "correct": 3,
     "options": [
      "The transit method has found every planet near Earth.",
      "Astronomers will soon find all hidden planets.",
      "Most exoplanets orbit stars that are tilted toward Earth.",
      "There are probably far more exoplanets than have been detected by transits."
     ],
     "explanation": "«For every planet discovered by this method, many others remain hidden» — значит, планет гораздо больше, чем найдено транзитным методом."
    },
    {
     "text": "According to paragraph 2, what does the time between dips tell astronomers?",
     "type": "Factual",
     "correct": 3,
     "options": [
      "The brightness of the star",
      "The planet's temperature",
      "The planet's size",
      "How long the planet's orbit takes"
     ],
     "explanation": "«The time between dips … shows how long the planet takes to complete one orbit». Размер планеты показывает глубина затемнения, а не время."
    }
   ],
   "id": "n6"
  },
  {
   "title": "Nudges and Everyday Decisions",
   "passage": "Traditional economic theory assumes that people make choices by carefully weighing costs and benefits. In practice, however, decisions are strongly influenced by how options are presented. Behavioral economists use the term \"nudge\" for a small change in presentation that steers people toward a particular choice without forbidding any alternatives or changing financial incentives.\n\nOne of the best-known nudges involves retirement savings. When employees must actively sign up for a savings plan, many never get around to doing so. When companies instead enroll workers automatically and allow them to leave the plan if they wish, participation often rises dramatically. The options are identical in both cases; only the default has changed. Similar defaults have since been used to increase the number of registered organ donors in several countries.\n\nSupporters see nudges as a low-cost way to help people act in their own long-term interest. Critics, however, worry that governments and companies might use the same techniques to serve their own goals rather than the public's. They argue that because nudges work best when people do not notice them, they can be difficult to hold accountable.",
   "questions": [
    {
     "text": "Which of the following best expresses the essential information in the highlighted sentence?",
     "type": "Simplification",
     "correct": 1,
     "options": [
      "Critics say the people who design nudges cannot be identified.",
      "Critics say nudges are hard to control because they are most effective when unnoticed.",
      "Critics argue that people should be taught to notice nudges.",
      "Critics believe nudges do not work when people are aware of them, so they are useless."
     ],
     "explanation": "Причина — подталкивания лучше работают незаметно; следствие — их трудно контролировать. B сохраняет обе части. D добавляет «useless», которого нет.",
     "highlight": "They argue that because nudges work best when people do not notice them, they can be difficult to hold accountable.",
     "highlight_occurrence": 1
    },
    {
     "text": "In paragraph 2, what is the relationship between the second and third sentences?",
     "type": "Organization",
     "correct": 2,
     "options": [
      "The second sentence gives a cause, and the third gives its effect.",
      "The second sentence states a general rule, and the third gives an exception to it.",
      "The second sentence describes a situation, and the third describes how changing that situation produces a different result.",
      "The second sentence makes a claim, and the third gives evidence that contradicts it."
     ],
     "explanation": "Второе предложение: если записываться самим, многие так и не записываются. Третье: при автоматической записи участие резко растёт. Ситуацию меняют — результат меняется."
    },
    {
     "text": "Why does the author discuss retirement savings in paragraph 2?",
     "type": "Rhetorical Purpose",
     "correct": 0,
     "options": [
      "To give an example of how a nudge works in practice",
      "To argue that employees should save more money",
      "To show that financial incentives are more effective than nudges",
      "To criticize companies that enroll workers automatically"
     ],
     "explanation": "«One of the best-known nudges involves retirement savings» — пенсионные накопления приведены как пример подталкивания из абзаца 1."
    },
    {
     "text": "What can be inferred about employees who are enrolled automatically?",
     "type": "Inference",
     "correct": 0,
     "options": [
      "Many remain in the plan even though they could leave.",
      "They receive higher salaries than other employees.",
      "They are not allowed to change their savings plan.",
      "Most of them choose to leave the plan."
     ],
     "explanation": "Выйти из плана можно («allow them to leave the plan if they wish»), но участие всё равно сильно растёт — значит, многие остаются. C противоречит тексту."
    },
    {
     "text": "The word \"steers\" in the passage is closest in meaning to",
     "type": "Vocabulary",
     "correct": 1,
     "options": [
      "forces",
      "guides",
      "warns",
      "rewards"
     ],
     "explanation": "Steers toward — направляет. «Forces» не подходит: подталкивание действует «without forbidding any alternatives»."
    }
   ],
   "id": "n7"
  },
  {
   "title": "How Limestone Caves Form",
   "passage": "Many of the world's largest caves are carved out of limestone, a rock made mostly of calcium carbonate. [sq1] As rainwater falls through the air and seeps through soil, it absorbs carbon dioxide and becomes a weak acid. [sq2] Over thousands of years, this acidic water dissolves the limestone along cracks, gradually widening them into passages and chambers. [sq3] Some cave systems formed in this way extend for hundreds of kilometers. [sq4]\n\n[s1] Once a cave is filled with air, a different process begins. [s2] Water dripping from the ceiling releases some of its carbon dioxide into the cave air. [s3] As a result, the water can no longer hold as much dissolved calcium carbonate, and a thin layer of mineral is left behind. [s4] Drop by drop, these deposits build up into icicle-shaped stalactites hanging from the ceiling. [s5] Where the drops land on the floor, matching stalagmites grow upward.\n\nBecause these formations grow extremely slowly, often less than a centimeter in a century, they are easily damaged and nearly impossible to replace. Scientists also value them as records of the past: by analyzing the chemistry of their layers, researchers can reconstruct changes in rainfall and temperature over hundreds of thousands of years.",
   "questions": [
    {
     "text": "Look at the four letters (A, B, C, D) in the passage that indicate where the following sentence could be added to the passage. Where would the sentence best fit?",
     "type": "Insert Text",
     "correct": 1,
     "options": [
      "Position A",
      "Position B",
      "Position C",
      "Position D"
     ],
     "explanation": "«This gas» — углекислый газ, а почва упомянута в предложении прямо перед позицией B: «seeps through soil, it absorbs carbon dioxide». В позиции A газ ещё не назван, а в C и D речь уже о растворении известняка.",
     "insertSentence": "The soil is especially important, because decaying plants there release large amounts of this gas."
    },
    {
     "text": "Identify the sentence in paragraph 2 that explains why minerals are left behind when water drips into a cave.",
     "type": "Select a Sentence",
     "correct": 3,
     "options": [],
     "explanation": "«As a result, the water can no longer hold as much dissolved calcium carbonate, and a thin layer of mineral is left behind» — вода теряет CO₂ и больше не удерживает растворённый минерал."
    },
    {
     "text": "According to paragraph 1, how does rainwater become acidic?",
     "type": "Factual",
     "correct": 0,
     "options": [
      "By absorbing carbon dioxide from the air and soil",
      "By dissolving calcium carbonate",
      "By mixing with seawater underground",
      "By flowing through cracks in the cave ceiling"
     ],
     "explanation": "«As rainwater falls through the air and seeps through soil, it absorbs carbon dioxide and becomes a weak acid». Известняк вода растворяет уже потом."
    },
    {
     "text": "According to paragraph 3, all of the following are true of stalactites and stalagmites EXCEPT",
     "type": "Negative Factual",
     "correct": 1,
     "options": [
      "They contain information about past climates.",
      "They can be regrown quickly after damage.",
      "They grow very slowly.",
      "They are easily damaged."
     ],
     "explanation": "Сказано, что они растут медленно, легко ломаются и хранят данные о климате. А заменить их «nearly impossible» — быстро вырастить заново нельзя."
    },
    {
     "text": "Which of the following best summarizes the passage?",
     "type": "Main Idea",
     "correct": 0,
     "options": [
      "Acidic water creates limestone caves, and dripping water later builds formations that are fragile and scientifically valuable.",
      "Limestone caves are the largest caves in the world.",
      "Stalactites grow faster than stalagmites because they hang from the ceiling.",
      "Scientists use caves mainly to study modern rainfall."
     ],
     "explanation": "Абзац 1 — как кислая вода создаёт пещеру, абзац 2 — как растут сталактиты, абзац 3 — они хрупкие и ценны для науки. A охватывает всё."
    }
   ],
   "id": "n8"
  },
  {
   "title": "The Magnetic Sense of Birds",
   "passage": "Every autumn, billions of birds migrate thousands of kilometers, often at night and across open ocean. To navigate, they rely on several sources of information, including the position of the Sun, patterns of stars, and familiar landmarks. Yet experiments show that many birds can still choose the correct direction when the sky is completely covered by clouds.\n\nThe explanation appears to be a magnetic sense. In laboratory studies, European robins placed in cages surrounded by artificial magnetic fields changed the direction in which they tried to fly when researchers rotated the field. This suggests that the birds detect Earth's magnetic field and use it as a kind of internal compass.\n\nHow they do so remains debated. One hypothesis holds that special proteins in the birds' eyes react to magnetic fields, possibly allowing the birds to \"see\" magnetic direction as a pattern overlaid on their normal vision. Another proposes that tiny particles of iron in the beak act like compass needles. Although neither idea has been fully confirmed, evidence for the eye-based mechanism has grown stronger in recent years.",
   "questions": [
    {
     "text": "The word \"it\" in the passage refers to",
     "type": "Reference",
     "correct": 0,
     "options": [
      "Earth's magnetic field",
      "the direction of flight",
      "the artificial field",
      "the cage"
     ],
     "explanation": "«The birds detect Earth's magnetic field and use it as a kind of internal compass» — компасом служит магнитное поле Земли. Искусственное поле было только в опыте.",
     "highlight": "it",
     "highlight_occurrence": 1
    },
    {
     "text": "Which of the following best expresses the essential information in the highlighted sentence?",
     "type": "Simplification",
     "correct": 2,
     "options": [
      "The beak-based idea has become weaker in recent years.",
      "Neither idea is supported by any evidence.",
      "The eye-based idea now has more support than before, though neither idea is proven.",
      "Recent evidence has confirmed that birds see magnetic fields."
     ],
     "explanation": "Две части: ни одна гипотеза не доказана, но у «глазной» становится больше подтверждений. D говорит «confirmed» — это противоречит первой части, B — второй.",
     "highlight": "Although neither idea has been fully confirmed, evidence for the eye-based mechanism has grown stronger in recent years.",
     "highlight_occurrence": 1
    },
    {
     "text": "The word \"overlaid\" in the passage is closest in meaning to",
     "type": "Vocabulary",
     "correct": 2,
     "options": [
      "replaced by",
      "separated from",
      "placed on top of",
      "hidden behind"
     ],
     "explanation": "Overlaid on their normal vision — «наложенный поверх» обычного зрения: птицы видят мир и ещё узор магнитного направления сверху."
    },
    {
     "text": "Why does the author mention that birds can choose the correct direction \"when the sky is completely covered by clouds\"?",
     "type": "Rhetorical Purpose",
     "correct": 1,
     "options": [
      "To describe a weakness in the magnetic sense",
      "To show that birds must use a source of information other than the Sun and stars",
      "To explain why birds prefer to migrate at night",
      "To argue that clouds make migration dangerous"
     ],
     "explanation": "Под облаками не видно ни Солнца, ни звёзд, а птицы всё равно летят верно — значит, есть другой источник информации. Следующий абзац его называет: магнитное чувство.",
     "highlight": "when the sky is completely covered by clouds",
     "highlight_occurrence": 1
    },
    {
     "text": "What can be inferred about the robins in the laboratory study?",
     "type": "Inference",
     "correct": 1,
     "options": [
      "They could not fly inside the cages.",
      "Their sense of direction was affected by the magnetic field around them.",
      "They used the stars to navigate.",
      "Their beaks contained no iron."
     ],
     "explanation": "Когда поле поворачивали, птицы меняли направление, в котором пытались лететь. Значит, магнитное поле влияло на их ориентацию."
    }
   ],
   "id": "n9"
  },
  {
   "title": "Impressionism and the Paint Tube",
   "passage": "In the 1870s, a group of French painters including Claude Monet and Camille Pissarro began exhibiting works that shocked many critics. Instead of carefully finished scenes from history or mythology, they painted ordinary landscapes and city streets using quick, visible brushstrokes. One critic mockingly called them \"Impressionists,\" suggesting that their paintings were mere sketches rather than completed works.\n\n[s1] The movement owed a surprising amount to a technical invention. [s2] Earlier painters had to grind their own pigments and mix them with oil in the studio, storing the paint in animal bladders that easily burst. [s3] In 1841, an American painter patented a collapsible metal tube that kept paint fresh and was easy to carry. [s4] This allowed artists to work outdoors for hours, observing how light changed across a scene. [s5] As Pierre-Auguste Renoir later remarked, without paint in tubes there would have been no Impressionism.\n\nWorking outside also changed the artists' choice of colors. Observing that shadows on snow or water often appear blue or purple rather than black, the Impressionists filled their canvases with bright, unmixed colors. What critics had once rejected as unfinished eventually came to be admired as a new way of capturing the experience of seeing.",
   "questions": [
    {
     "text": "What is the relationship between paragraph 1 and paragraph 2?",
     "type": "Organization",
     "correct": 3,
     "options": [
      "Paragraph 1 presents critics' views, and paragraph 2 shows that the critics were correct.",
      "Paragraph 1 describes a technique, and paragraph 2 describes its disadvantages.",
      "Paragraph 1 compares two painters, and paragraph 2 describes their later careers.",
      "Paragraph 1 introduces an art movement, and paragraph 2 explains a practical development that made it possible."
     ],
     "explanation": "Абзац 1 представляет импрессионистов. Абзац 2: «The movement owed a surprising amount to a technical invention» — изобретение тюбика, которое сделало это направление возможным."
    },
    {
     "text": "Identify the sentence in paragraph 2 that describes a problem with the way paint was stored before the invention.",
     "type": "Select a Sentence",
     "correct": 2,
     "options": [],
     "explanation": "Раньше краску хранили «in animal bladders that easily burst» — в пузырях, которые легко лопались. Это и есть проблема хранения."
    },
    {
     "text": "According to paragraph 3, what did the Impressionists notice about shadows?",
     "type": "Factual",
     "correct": 1,
     "options": [
      "They are always black.",
      "They often look blue or purple.",
      "They disappear on snow.",
      "They are hard to paint outdoors."
     ],
     "explanation": "«Shadows on snow or water often appear blue or purple rather than black»."
    },
    {
     "text": "The word \"mockingly\" in the passage is closest in meaning to",
     "type": "Vocabulary",
     "correct": 3,
     "options": [
      "cautiously",
      "admiringly",
      "mistakenly",
      "scornfully"
     ],
     "explanation": "Mockingly — насмешливо: критик назвал их «импрессионистами», намекая, что это лишь наброски. Scornfully — презрительно, с насмешкой."
    },
    {
     "text": "What can be inferred about Renoir's opinion of the paint tube?",
     "type": "Inference",
     "correct": 2,
     "options": [
      "He preferred to grind his own pigments.",
      "He invented an improved version of it.",
      "He believed it was essential to the development of Impressionism.",
      "He thought it made paint too expensive."
     ],
     "explanation": "«Without paint in tubes there would have been no Impressionism» — Ренуар считал тюбик необходимым условием для возникновения направления."
    }
   ],
   "id": "n10"
  },
  {
   "title": "Reading the Climate in Ice",
   "passage": "The ice sheets of Antarctica and Greenland are built from snow that has fallen and accumulated over hundreds of thousands of years. As new snow piles up, the layers beneath are compressed into solid ice. By drilling deep into these sheets and removing long cylinders of ice called cores, scientists can examine a record of the past layer by layer.\n\nOne of the most valuable parts of this record is the air itself. [sq1] When snow turns into ice, small bubbles of the surrounding atmosphere become sealed inside. [sq2] Measuring the gases in these bubbles allows researchers to determine how much carbon dioxide the atmosphere contained at the time the ice formed. [sq3] Such measurements show that carbon dioxide levels and temperatures have risen and fallen together through repeated ice ages. [sq4]\n\nIce cores also preserve dust, volcanic ash, and even pollen. A layer of ash can be matched to a known eruption, providing a precise date for that part of the core. Because the oldest Antarctic cores reach back about 800,000 years, scientists are now searching for sites where even older ice might survive, hoping to extend the climate record further into the past.",
   "questions": [
    {
     "text": "Look at the four letters (A, B, C, D) in the passage that indicate where the following sentence could be added to the passage. Where would the sentence best fit?",
     "type": "Insert Text",
     "correct": 1,
     "options": [
      "Position A",
      "Position B",
      "Position C",
      "Position D"
     ],
     "explanation": "«These tiny pockets» — пузырьки воздуха, а «sealed off… ever since» продолжает мысль о том, как они запечатываются во льду. Это предложение стоит прямо перед позицией B. В A пузырьков ещё нет, в C и D речь уже об измерениях и выводах.",
     "insertSentence": "Sealed off from the outside world, these tiny pockets have remained unchanged ever since."
    },
    {
     "text": "Which of the following best expresses the essential information in the highlighted sentence?",
     "type": "Simplification",
     "correct": 3,
     "options": [
      "Antarctic ice older than 800,000 years has recently been discovered.",
      "The climate record ends 800,000 years ago because no older ice exists.",
      "Scientists hope to find sites in Antarctica where ice melts slowly.",
      "Scientists are looking for ice older than 800,000 years so they can study earlier climates."
     ],
     "explanation": "Самые старые керны — около 800 000 лет, поэтому учёные ищут лёд постарше, чтобы продлить климатическую летопись. A и B говорят то, чего в тексте нет: лёд ещё не найден, но и не известно, что его нет.",
     "highlight": "Because the oldest Antarctic cores reach back about 800,000 years, scientists are now searching for sites where even older ice might survive, hoping to extend the climate record further into the past.",
     "highlight_occurrence": 1
    },
    {
     "text": "The phrase \"this record\" in the passage refers to",
     "type": "Reference",
     "correct": 1,
     "options": [
      "a list of known volcanic eruptions",
      "the history preserved in layers of ice",
      "the depth reached by drilling",
      "the amount of snow that falls each year"
     ],
     "explanation": "В конце абзаца 1: керны дают «a record of the past layer by layer» — летопись прошлого в слоях льда.",
     "highlight": "this record",
     "highlight_occurrence": 1
    },
    {
     "text": "According to the passage, ice cores contain all of the following EXCEPT",
     "type": "Negative Factual",
     "correct": 2,
     "options": [
      "volcanic ash",
      "pollen",
      "fossils of animals",
      "air bubbles"
     ],
     "explanation": "Пузырьки воздуха, пепел и пыльца в тексте названы. Об окаменелостях животных ничего не сказано."
    },
    {
     "text": "Which of the following best summarizes the passage?",
     "type": "Main Idea",
     "correct": 1,
     "options": [
      "Greenland's ice is older than Antarctica's.",
      "Ice cores preserve air, ash, and other materials that let scientists reconstruct past climates.",
      "Carbon dioxide levels have never changed during ice ages.",
      "Drilling ice cores is dangerous and expensive."
     ],
     "explanation": "Весь текст о том, что керны хранят воздух, пепел и пыльцу и по ним восстанавливают климат прошлого. C противоречит тексту, A и D в нём нет."
    }
   ],
   "id": "n11"
  },
  {
   "title": "Polynesian Wayfinding",
   "passage": "Long before European ships crossed the Pacific, Polynesian sailors had settled islands spread across an area larger than Asia, from Hawaii to New Zealand. They made these voyages in double-hulled canoes without compasses, maps, or any of the instruments later considered essential for ocean travel. For a long time, some Western scholars refused to believe that such journeys could have been planned, suggesting instead that the islands were reached by canoes accidentally blown off course.\n\n[s1] Polynesian navigators in fact relied on a detailed knowledge of the natural world. [s2] They memorized the points on the horizon where particular stars rose and set. [s3] They read the direction of ocean swells, which could be felt in the movement of the canoe even on cloudy nights. [s4] They also watched for seabirds that fish at sea but return to land each evening, since following them could lead a canoe to an island beyond the horizon.\n\nIn 1976, a replica canoe named Hokule'a sailed from Hawaii to Tahiti, a distance of about 4,000 kilometers, guided only by these traditional methods. The voyage demonstrated that deliberate long-distance navigation was possible and helped spark a revival of traditional wayfinding throughout the Pacific.",
   "questions": [
    {
     "text": "Identify the sentence in paragraph 2 that describes a method based on the behavior of animals.",
     "type": "Select a Sentence",
     "correct": 4,
     "options": [],
     "explanation": "Навигаторы следили за морскими птицами, которые к вечеру возвращаются на сушу: «following them could lead a canoe to an island»."
    },
    {
     "text": "The word \"them\" in the passage refers to",
     "type": "Reference",
     "correct": 2,
     "options": [
      "ocean swells",
      "navigators",
      "seabirds",
      "islands"
     ],
     "explanation": "«They also watched for seabirds… since following them could lead a canoe to an island» — следовать за птицами.",
     "highlight": "them",
     "highlight_occurrence": 1
    },
    {
     "text": "Why does the author mention the voyage of Hokule'a in paragraph 3?",
     "type": "Rhetorical Purpose",
     "correct": 2,
     "options": [
      "To describe how Hawaii was first settled",
      "To argue that traditional methods are better than modern instruments",
      "To provide evidence that Polynesian voyages could have been intentional",
      "To show that modern canoes are faster than ancient ones"
     ],
     "explanation": "Плавание показало, «that deliberate long-distance navigation was possible», — это ответ скептикам из абзаца 1, считавшим, что острова открыли случайно."
    },
    {
     "text": "According to paragraph 1, what did some Western scholars believe?",
     "type": "Factual",
     "correct": 2,
     "options": [
      "Polynesian canoes were too small to cross the ocean.",
      "New Zealand was settled before Hawaii.",
      "The islands were settled by accident.",
      "Polynesians used maps borrowed from Europeans."
     ],
     "explanation": "Они считали, что острова нашли каноэ, «accidentally blown off course», то есть случайно."
    },
    {
     "text": "The word \"deliberate\" in the passage is closest in meaning to",
     "type": "Vocabulary",
     "correct": 0,
     "options": [
      "intentional",
      "dangerous",
      "frequent",
      "slow"
     ],
     "explanation": "Deliberate — намеренный, спланированный. Это противопоставление «accidentally» из абзаца 1."
    }
   ],
   "id": "n12"
  },
  {
   "title": "Toward Solid-State Batteries",
   "passage": "Lithium-ion batteries power everything from smartphones to electric cars. Inside each battery, lithium ions travel between two electrodes through a liquid called an electrolyte. Although this design works well, the liquid electrolyte is flammable, and if a battery is damaged or overheated, it can catch fire. Current batteries are also heavy for the amount of energy they hold, which limits how far an electric car can travel before it must be recharged.\n\nEngineers are therefore developing solid-state batteries, which replace the liquid with a solid material such as a ceramic. [sq1] Because solids do not burn as easily, these batteries could be considerably safer. [sq2] They might also store more energy in the same space, allowing electric cars to travel farther on a single charge. [sq3] Some manufacturers predict that the first cars using them will appear within a few years. [sq4]\n\nSignificant obstacles remain, however. Solid electrolytes can develop tiny cracks as the battery charges and discharges, and over time these cracks reduce performance. Producing the materials in large quantities is also expensive. Until such problems are solved, solid-state batteries are likely to appear first in high-priced products before reaching the mass market.",
   "questions": [
    {
     "text": "Look at the four letters (A, B, C, D) in the passage that indicate where the following sentence could be added to the passage. Where would the sentence best fit?",
     "type": "Insert Text",
     "correct": 3,
     "options": [
      "Position A",
      "Position B",
      "Position C",
      "Position D"
     ],
     "explanation": "«Others» противопоставлены производителям, а «such predictions» — их прогнозу о скором появлении машин. Этот прогноз стоит прямо перед позицией D.",
     "insertSentence": "Others, however, caution that such predictions have been made, and missed, many times before."
    },
    {
     "text": "What is the relationship between paragraph 2 and paragraph 3?",
     "type": "Organization",
     "correct": 0,
     "options": [
      "Paragraph 2 describes the potential benefits of a technology, and paragraph 3 describes the difficulties that still limit it.",
      "Paragraph 2 describes a problem, and paragraph 3 explains its causes.",
      "Paragraph 2 makes a prediction, and paragraph 3 shows that it has already come true.",
      "Paragraph 2 compares two technologies, and paragraph 3 recommends one of them."
     ],
     "explanation": "Абзац 2 — чем хороши твердотельные батареи (безопаснее, ёмче). Абзац 3 — «Significant obstacles remain»: трещины и дорогое производство."
    },
    {
     "text": "Which of the following best expresses the essential information in the highlighted sentence?",
     "type": "Simplification",
     "correct": 0,
     "options": [
      "Solid-state batteries will probably be used in expensive products before becoming widely available.",
      "Solid-state batteries will never be cheap enough for most people.",
      "High-priced products are the cause of problems with solid-state batteries.",
      "The mass market already uses solid-state batteries, but expensive products do not."
     ],
     "explanation": "Пока проблемы не решены, батареи сначала появятся в дорогих продуктах, а потом станут массовыми. B — слишком категорично («never»), C и D искажают смысл.",
     "highlight": "Until such problems are solved, solid-state batteries are likely to appear first in high-priced products before reaching the mass market.",
     "highlight_occurrence": 1
    },
    {
     "text": "What can be inferred about how solid-state batteries could change electric cars?",
     "type": "Inference",
     "correct": 3,
     "options": [
      "Cars would no longer need electrodes.",
      "Cars would become cheaper immediately.",
      "Cars would need to be recharged more often.",
      "Cars could go farther without stopping to recharge."
     ],
     "explanation": "Сейчас батареи ограничивают пробег, а твердотельные могут хранить больше энергии «in the same space, allowing electric cars to travel farther». Значит, заряжать машину придётся реже."
    },
    {
     "text": "According to paragraph 3, what happens to solid electrolytes over time?",
     "type": "Factual",
     "correct": 3,
     "options": [
      "They catch fire.",
      "They become cheaper to make.",
      "They become liquid.",
      "They develop small cracks."
     ],
     "explanation": "«Solid electrolytes can develop tiny cracks as the battery charges and discharges»."
    }
   ],
   "id": "n13"
  },
  {
   "title": "Sleep and Memory",
   "passage": "For a long time, sleep was thought of as a period when the brain simply rested. Research over the past few decades has overturned this view. During sleep, the brain is highly active, and one of its most important tasks appears to be strengthening memories formed during the day.\n\n[s1] Evidence comes from experiments in which people learn a task and are then tested later. [s2] Participants who sleep between learning and testing usually perform better than those who stay awake for the same length of time. [s3] Brain recordings help explain why. [s4] During deep sleep, the hippocampus, a region involved in forming new memories, replays patterns of activity from the day. [s5] These replays seem to help transfer information to the outer layer of the brain, where it can be stored for the long term.\n\nNot all memories benefit equally. Studies suggest that sleep especially strengthens information that people expect to need in the future. Students who were told before sleeping that they would be tested remembered more than those who were not told. Such findings suggest that an all-night study session before an exam may be counterproductive, since it removes the very process that helps learning last.",
   "questions": [
    {
     "text": "Identify the sentence in paragraph 2 that describes what happens in a particular part of the brain during sleep.",
     "type": "Select a Sentence",
     "correct": 4,
     "options": [],
     "explanation": "«During deep sleep, the hippocampus… replays patterns of activity from the day» — названа конкретная часть мозга, гиппокамп, и то, что в ней происходит."
    },
    {
     "text": "The phrase \"These replays\" in the passage refers to",
     "type": "Reference",
     "correct": 3,
     "options": [
      "memories stored in the outer layer of the brain",
      "recordings made by researchers",
      "experiments in which people are tested",
      "repeated patterns of brain activity during sleep"
     ],
     "explanation": "Предыдущее предложение: гиппокамп во сне «replays patterns of activity» — повторно проигрывает дневную активность.",
     "highlight": "These replays",
     "highlight_occurrence": 1
    },
    {
     "text": "The word \"overturned\" in the passage is closest in meaning to",
     "type": "Vocabulary",
     "correct": 1,
     "options": [
      "supported",
      "reversed",
      "explained",
      "ignored"
     ],
     "explanation": "Overturned this view — опровергли, перевернули прежнее мнение, что мозг во сне отдыхает."
    },
    {
     "text": "According to the passage, all of the following are true about sleep EXCEPT",
     "type": "Negative Factual",
     "correct": 3,
     "options": [
      "Expecting a test can affect what is remembered after sleep.",
      "The brain is active during sleep.",
      "Sleep helps strengthen memories.",
      "Sleep benefits all memories equally."
     ],
     "explanation": "«Not all memories benefit equally» — сон помогает не всем воспоминаниям одинаково. Остальное в тексте есть."
    },
    {
     "text": "Why does the author mention \"an all-night study session\"?",
     "type": "Rhetorical Purpose",
     "correct": 3,
     "options": [
      "To describe how the experiments were conducted",
      "To show that students sleep less than other people",
      "To argue that exams should be held in the morning",
      "To point out a practical consequence of the research"
     ],
     "explanation": "Из исследований следует практический вывод: если не спать перед экзаменом, мозг лишается процесса, который закрепляет выученное.",
     "highlight": "an all-night study session",
     "highlight_occurrence": 1
    }
   ],
   "id": "n14"
  },
  {
   "title": "Legumes and Crop Rotation",
   "passage": "Plants need nitrogen to grow, yet although nitrogen makes up most of the air, plants cannot use it in that form. Most crops depend instead on nitrogen compounds in the soil, which are quickly used up when the same crop is planted year after year. Today, farmers often replace these compounds with synthetic fertilizers, but this solution is costly and can pollute rivers when excess fertilizer washes off fields.\n\nLegumes, such as beans, peas, and clover, offer a natural alternative. Their roots contain small swellings called nodules, which house bacteria able to convert nitrogen from the air into a form plants can use. [sq1] When legumes die and decay, much of this nitrogen is released into the soil. [sq2] A field planted with wheat one year and clover the next can therefore recover much of its fertility without large amounts of added fertilizer. [sq3]\n\nFarmers in many parts of the world practiced crop rotation for centuries without understanding why it worked. [sq4] Only in the late nineteenth century did scientists discover the role of root bacteria. Today, researchers are studying whether similar partnerships could be created in crops such as wheat and corn, which would greatly reduce the need for synthetic fertilizers.",
   "questions": [
    {
     "text": "Look at the four letters (A, B, C, D) in the passage that indicate where the following sentence could be added to the passage. Where would the sentence best fit?",
     "type": "Insert Text",
     "correct": 0,
     "options": [
      "Position A",
      "Position B",
      "Position C",
      "Position D"
     ],
     "explanation": "«In exchange» — растение что-то даёт бактериям в ответ на то, что они дают ему (азот). Бактерии в клубеньках названы прямо перед позицией A. В остальных позициях речь уже о почве и истории севооборота.",
     "insertSentence": "In exchange, the plant supplies the bacteria with sugars produced through photosynthesis."
    },
    {
     "text": "What is the relationship between paragraph 1 and paragraph 2?",
     "type": "Organization",
     "correct": 1,
     "options": [
      "Paragraph 1 presents two theories, and paragraph 2 compares them.",
      "Paragraph 1 describes a problem, and paragraph 2 describes a natural way of addressing it.",
      "Paragraph 1 describes a solution, and paragraph 2 explains why it failed.",
      "Paragraph 1 gives historical background, and paragraph 2 describes modern research."
     ],
     "explanation": "Абзац 1 — проблема: азот в почве заканчивается, удобрения дорогие и загрязняют реки. Абзац 2 — «Legumes… offer a natural alternative»."
    },
    {
     "text": "According to paragraph 1, what is one disadvantage of synthetic fertilizers?",
     "type": "Factual",
     "correct": 0,
     "options": [
      "They can pollute water.",
      "They damage legume roots.",
      "They take years to work.",
      "They contain too little nitrogen."
     ],
     "explanation": "«This solution is costly and can pollute rivers when excess fertilizer washes off fields»."
    },
    {
     "text": "What can be inferred about wheat and corn from paragraph 3?",
     "type": "Inference",
     "correct": 0,
     "options": [
      "They cannot currently obtain nitrogen from the air with the help of bacteria.",
      "They grow best without nitrogen.",
      "They were first grown in the nineteenth century.",
      "They are types of legumes."
     ],
     "explanation": "Учёные изучают, можно ли создать «similar partnerships» в пшенице и кукурузе. Значит, сейчас у них такого союза с бактериями нет."
    },
    {
     "text": "The word \"house\" in the passage is closest in meaning to",
     "type": "Vocabulary",
     "correct": 2,
     "options": [
      "destroy",
      "produce",
      "contain",
      "feed"
     ],
     "explanation": "Здесь house — глагол: клубеньки «вмещают, дают приют» бактериям."
    }
   ],
   "id": "n15"
  },
  {
   "title": "The Mirror Test",
   "passage": "How can scientists tell whether an animal is aware of itself? In 1970, the psychologist Gordon Gallup proposed a simple test. An animal is given a mark, such as a spot of dye, on a part of its body that it can see only in a mirror. If the animal looks in the mirror and then touches or examines the mark on its own body, it is assumed to recognize the reflection as itself.\n\n[s1] Chimpanzees were among the first animals to pass the test. [s2] Since then, orangutans, dolphins, elephants, and some birds such as magpies have also shown signs of self-recognition. [s3] Most other species, including dogs and monkeys, typically treat their reflection as another animal or ignore it. [s4] Human children usually pass the test between eighteen months and two years of age.\n\nSome researchers, however, question what the test really measures. Animals that rely mainly on smell or hearing, like dogs, may simply not care about visual marks. In a modified version of the test using scent instead of a mirror, dogs spent more time investigating their own altered odor than an unaltered one. Critics therefore argue that failing the mirror test does not necessarily mean an animal lacks self-awareness.",
   "questions": [
    {
     "text": "Which of the following best expresses the essential information in the highlighted sentence?",
     "type": "Simplification",
     "correct": 1,
     "options": [
      "Critics believe that most animals are self-aware.",
      "Animals that fail the mirror test may still be self-aware.",
      "Animals that fail the mirror test are not self-aware.",
      "The mirror test should no longer be used by researchers."
     ],
     "explanation": "«Does not necessarily mean… lacks self-awareness» — провал теста не обязательно значит, что самосознания нет. C говорит обратное, A и D — слишком сильные выводы, которых в предложении нет.",
     "highlight": "Critics therefore argue that failing the mirror test does not necessarily mean an animal lacks self-awareness.",
     "highlight_occurrence": 1
    },
    {
     "text": "Identify the sentence in paragraph 2 that describes how most animals react to their reflection.",
     "type": "Select a Sentence",
     "correct": 3,
     "options": [],
     "explanation": "«Most other species… typically treat their reflection as another animal or ignore it» — большинство видов принимают отражение за другое животное или не обращают на него внимания."
    },
    {
     "text": "Why does the author mention the test \"using scent instead of a mirror\"?",
     "type": "Rhetorical Purpose",
     "correct": 0,
     "options": [
      "To present evidence that dogs may recognize themselves in another way",
      "To show that dogs cannot see well",
      "To explain how the original mirror test was designed",
      "To argue that smell is more important than sight in all animals"
     ],
     "explanation": "Собаки дольше изучали свой изменённый запах — значит, узнают себя, просто не по зрению. Это аргумент критиков зеркального теста.",
     "highlight": "using scent instead of a mirror",
     "highlight_occurrence": 1
    },
    {
     "text": "What can be inferred from paragraph 2 about a one-year-old child?",
     "type": "Inference",
     "correct": 1,
     "options": [
      "The child would pass the test before a chimpanzee would.",
      "The child would probably not pass the mirror test.",
      "The child would recognize its reflection.",
      "The child would react to a mirror as a dog does."
     ],
     "explanation": "Дети проходят тест «between eighteen months and two years». Годовалому ребёнку ещё нет полутора лет, так что он, скорее всего, тест не пройдёт."
    },
    {
     "text": "How does paragraph 3 relate to paragraphs 1 and 2?",
     "type": "Organization",
     "correct": 2,
     "options": [
      "It explains the history of the test.",
      "It summarizes the results described earlier.",
      "It raises doubts about the test described in the earlier paragraphs.",
      "It provides more examples of animals that passed the test."
     ],
     "explanation": "«Some researchers, however, question what the test really measures» — абзац 3 ставит под сомнение тест из абзацев 1–2."
    }
   ],
   "id": "n16"
  },
  {
   "title": "Tree Rings as Calendars",
   "passage": "In regions with distinct seasons, trees add a new layer of wood each year. Growth is fast in spring, producing light-colored wood, and slows in late summer, producing darker wood. The contrast between these layers creates the rings visible when a tree is cut. Counting the rings reveals the tree's age, a technique known as dendrochronology.\n\nThe rings record more than age. [sq1] In a year with plenty of rain, a tree grows a wide ring; in a dry year, the ring is narrow. [sq2] Because all trees in a region experience the same weather, they share the same sequence of wide and narrow rings. [sq3] By matching the patterns of living trees with those of older timber, researchers have built continuous records stretching back more than ten thousand years in some regions. [sq4]\n\nThese records have many uses. Archaeologists can determine the year in which wood used in an ancient building was cut, often with remarkable precision. Climate scientists use ring widths to estimate past rainfall, and ecologists study scars in the rings to learn how often forest fires occurred before modern record keeping began.",
   "questions": [
    {
     "text": "The word \"those\" in the passage refers to",
     "type": "Reference",
     "correct": 0,
     "options": [
      "patterns",
      "researchers",
      "records",
      "trees"
     ],
     "explanation": "«Matching the patterns of living trees with those of older timber» — сравнивают узоры колец живых деревьев с узорами старой древесины.",
     "highlight": "those",
     "highlight_occurrence": 1
    },
    {
     "text": "Look at the four letters (A, B, C, D) in the passage that indicate where the following sentence could be added to the passage. Where would the sentence best fit?",
     "type": "Insert Text",
     "correct": 2,
     "options": [
      "Position A",
      "Position B",
      "Position C",
      "Position D"
     ],
     "explanation": "«This shared pattern» — общая для региона последовательность широких и узких колец («share the same sequence»). Она описана прямо перед позицией C.",
     "insertSentence": "This shared pattern works much like a fingerprint that identifies a particular span of years."
    },
    {
     "text": "The word \"distinct\" in the passage is closest in meaning to",
     "type": "Vocabulary",
     "correct": 3,
     "options": [
      "extreme",
      "unusual",
      "short",
      "clearly different"
     ],
     "explanation": "Distinct seasons — чётко различимые времена года: весна и конец лета заметно отличаются, поэтому и слои древесины разные."
    },
    {
     "text": "According to paragraph 2, what does a narrow ring indicate?",
     "type": "Factual",
     "correct": 1,
     "options": [
      "A cold spring",
      "A year with little rain",
      "A very old tree",
      "A forest fire"
     ],
     "explanation": "«In a dry year, the ring is narrow» — узкое кольцо означает засушливый год."
    },
    {
     "text": "According to paragraph 3, tree rings are used for all of the following EXCEPT",
     "type": "Negative Factual",
     "correct": 0,
     "options": [
      "predicting future droughts",
      "dating wood in old buildings",
      "estimating past rainfall",
      "studying the history of forest fires"
     ],
     "explanation": "Датировка древесины, прошлые осадки и история пожаров в абзаце 3 есть. О прогнозе будущих засух не сказано."
    }
   ],
   "id": "n17"
  },
  {
   "title": "Homer and the Oral Poets",
   "passage": "The Iliad and the Odyssey, two of the oldest works of European literature, were long assumed to have been composed by a single poet, Homer, in much the same way a modern author writes a book. In the 1930s, however, the American scholar Milman Parry proposed a different explanation. He argued that the poems grew out of an oral tradition in which poets composed as they performed, without writing anything down.\n\nTo test this idea, Parry traveled to Yugoslavia, where singers still performed long epic songs from memory. He found that they did not memorize fixed texts. Instead, each singer had learned a large collection of ready-made phrases and standard scenes, such as the arming of a hero or the arrival of a guest. Using these building blocks, a skilled singer could perform a song of thousands of lines, and no two performances were exactly the same.\n\nParry noticed that Homer's poems contain exactly such repeated phrases, like \"swift-footed Achilles\" and \"rosy-fingered dawn,\" which fit neatly into the rhythm of the verse. These, he concluded, were tools that helped oral poets keep their performances flowing. Although scholars still debate when and how the poems were finally written down, Parry's work permanently changed how they are understood.",
   "questions": [
    {
     "text": "What is the relationship between paragraph 2 and paragraph 3?",
     "type": "Organization",
     "correct": 3,
     "options": [
      "Paragraph 2 presents a theory, and paragraph 3 rejects it.",
      "Paragraph 2 describes Homer's life, and paragraph 3 describes his poems.",
      "Paragraph 2 gives an example, and paragraph 3 gives a contrasting example.",
      "Paragraph 2 describes a living tradition, and paragraph 3 shows how its features appear in Homer's poems."
     ],
     "explanation": "Абзац 2 — живая традиция певцов в Югославии с готовыми фразами. Абзац 3: «Homer's poems contain exactly such repeated phrases» — те же черты у Гомера."
    },
    {
     "text": "Which of the following best expresses the essential information in the highlighted sentence?",
     "type": "Simplification",
     "correct": 2,
     "options": [
      "Scholars disagree with Parry about how the poems should be understood.",
      "The poems were changed permanently when they were written down.",
      "Parry's work transformed how the poems are understood, even though questions remain about how they were written down.",
      "Parry proved when and how the poems were written down."
     ],
     "explanation": "Две части: споры о записи поэм продолжаются, но работа Парри навсегда изменила их понимание. A и D противоречат предложению, B путает, что именно «changed».",
     "highlight": "Although scholars still debate when and how the poems were finally written down, Parry's work permanently changed how they are understood.",
     "highlight_occurrence": 1
    },
    {
     "text": "Why does the author mention \"swift-footed Achilles\"?",
     "type": "Rhetorical Purpose",
     "correct": 1,
     "options": [
      "To prove that Homer wrote the poems himself",
      "To give an example of the repeated phrases found in Homer's poems",
      "To show that Homer used unusually beautiful descriptions",
      "To identify the main character of the Iliad"
     ],
     "explanation": "Фраза идёт после «such repeated phrases, like…» — это пример готовых повторяющихся формул.",
     "highlight": "swift-footed Achilles",
     "highlight_occurrence": 1
    },
    {
     "text": "What can be inferred about the singers Parry studied in Yugoslavia?",
     "type": "Inference",
     "correct": 2,
     "options": [
      "They had studied Homer's poems.",
      "They read their songs from written texts.",
      "They changed their songs slightly each time they performed them.",
      "They performed only short songs."
     ],
     "explanation": "Они не заучивали готовый текст, а собирали песню из блоков, и «no two performances were exactly the same» — каждый раз песня немного менялась."
    },
    {
     "text": "According to paragraph 1, how had people traditionally viewed the composition of Homer's poems?",
     "type": "Factual",
     "correct": 2,
     "options": [
      "As translations of older poems",
      "As improvised performances",
      "As the work of a single author writing in the way a modern writer does",
      "As songs collected from many different singers"
     ],
     "explanation": "«Composed by a single poet, Homer, in much the same way a modern author writes a book». Импровизация — это как раз новая идея Парри."
    }
   ],
   "id": "n18"
  },
  {
   "title": "Mining the Asteroids",
   "passage": "Asteroids are rocky or metallic bodies left over from the formation of the solar system. Some contain large quantities of valuable materials, including water ice and metals such as nickel, iron, and platinum. For this reason, several companies and space agencies have begun to consider whether asteroids could one day be mined.\n\n[s1] Supporters point to several potential benefits. [s2] Water extracted from asteroids could be split into hydrogen and oxygen to make rocket fuel in space, so spacecraft would not have to carry all their fuel from Earth. [s3] Metals could be used to build structures in orbit. [s4] Some even argue that rare metals brought back to Earth could reduce the need for destructive mining on our own planet.\n\nThe challenges, however, are enormous. Reaching an asteroid requires years of travel and precise navigation, and no one has yet developed equipment that can dig and process material in near-zero gravity. Bringing large amounts of metal back to Earth would also be extremely expensive. For now, the most realistic goal is likely to be using asteroid water to support missions in space rather than returning materials to Earth.",
   "questions": [
    {
     "text": "Identify the sentence in paragraph 2 that describes a possible environmental benefit for Earth.",
     "type": "Select a Sentence",
     "correct": 4,
     "options": [],
     "explanation": "Металлы с астероидов могли бы «reduce the need for destructive mining on our own planet» — меньше разрушительной добычи на Земле."
    },
    {
     "text": "How is paragraph 3 organized?",
     "type": "Organization",
     "correct": 0,
     "options": [
      "It states a general point, gives examples supporting it, and ends with a conclusion.",
      "It describes a sequence of events in the order they happened.",
      "It compares two competing explanations and chooses one.",
      "It presents a problem and then shows that the problem has been solved."
     ],
     "explanation": "Общая мысль («The challenges… are enormous»), примеры трудностей (полёт, оборудование, стоимость) и вывод («For now, the most realistic goal…»). Проблема не решена, так что D не подходит."
    },
    {
     "text": "The word \"enormous\" in the passage is closest in meaning to",
     "type": "Vocabulary",
     "correct": 0,
     "options": [
      "very large",
      "unknown",
      "technical",
      "temporary"
     ],
     "explanation": "Enormous — огромный."
    },
    {
     "text": "According to paragraph 2, how could water from asteroids be useful?",
     "type": "Factual",
     "correct": 3,
     "options": [
      "It could cool mining equipment.",
      "It could help grow food in orbit.",
      "It could be used as drinking water on Earth.",
      "It could be made into rocket fuel."
     ],
     "explanation": "«Water… could be split into hydrogen and oxygen to make rocket fuel in space»."
    },
    {
     "text": "Which of the following best summarizes the passage?",
     "type": "Main Idea",
     "correct": 2,
     "options": [
      "Asteroids are made mainly of water ice.",
      "Space agencies have stopped researching asteroids.",
      "Asteroid mining offers possible benefits but faces major difficulties, so its first uses are likely to be in space.",
      "Asteroid mining will soon replace mining on Earth."
     ],
     "explanation": "Абзац 2 — выгоды, абзац 3 — огромные трудности и вывод: реалистичнее использовать воду в космосе. D, A и B противоречат тексту."
    }
   ],
   "id": "n19"
  },
  {
   "title": "Growing Up Bilingual",
   "passage": "For much of the twentieth century, many educators believed that learning two languages in childhood would confuse children and slow their development. [sq1] Early studies seemed to support this view, showing that bilingual children scored lower on vocabulary tests. [sq2] Later researchers pointed out, however, that these studies often compared children from very different social backgrounds and tested them in only one language. [sq3]\n\nMore recent work has painted a different picture. Because bilingual people must constantly keep one language from interfering with the other, some researchers propose that they develop stronger control over their attention. Switching between languages many times a day, in this view, works as a kind of mental exercise. Several experiments found that bilingual children were faster at tasks requiring them to ignore distracting information and switch between rules. [sq4]\n\nThis so-called bilingual advantage has itself become controversial. Large studies in recent years have often failed to reproduce it, and some scientists suspect that earlier positive results were published more readily than negative ones. What researchers do agree on is that bilingualism does not harm children's development; the earlier fears appear to have been unfounded.",
   "questions": [
    {
     "text": "The word \"it\" in the passage refers to",
     "type": "Reference",
     "correct": 1,
     "options": [
      "a negative result",
      "the bilingual advantage",
      "a large study",
      "attention"
     ],
     "explanation": "«This so-called bilingual advantage… Large studies… have often failed to reproduce it» — не смогли повторить само «преимущество двуязычия».",
     "highlight": "it",
     "highlight_occurrence": 1
    },
    {
     "text": "Which of the following best expresses the essential information in the highlighted sentence?",
     "type": "Simplification",
     "correct": 3,
     "options": [
      "Bilingual people often have trouble keeping their two languages separate.",
      "Researchers have proven that bilingual people pay more attention than others.",
      "Bilingual people learn to control their attention before learning a second language.",
      "Some researchers think that managing two languages may strengthen bilinguals' control of attention."
     ],
     "explanation": "Причина — постоянно удерживать один язык от вмешательства другого; следствие (по мнению некоторых учёных) — лучший контроль внимания. B добавляет «proven», а в предложении только «propose».",
     "highlight": "Because bilingual people must constantly keep one language from interfering with the other, some researchers propose that they develop stronger control over their attention.",
     "highlight_occurrence": 1
    },
    {
     "text": "Look at the four letters (A, B, C, D) in the passage that indicate where the following sentence could be added to the passage. Where would the sentence best fit?",
     "type": "Insert Text",
     "correct": 2,
     "options": [
      "Position A",
      "Position B",
      "Position C",
      "Position D"
     ],
     "explanation": "«The gap» — отставание по словарному запасу из ранних исследований. Сразу перед позицией C сказано, что детей тестировали только на одном языке; если считать оба языка, разрыв исчезает.",
     "insertSentence": "When bilingual children's knowledge of both languages was counted together, the gap often disappeared."
    },
    {
     "text": "Why does the author mention that earlier positive results \"were published more readily than negative ones\"?",
     "type": "Rhetorical Purpose",
     "correct": 2,
     "options": [
      "To show that negative results are usually wrong",
      "To explain why bilingualism harms development",
      "To suggest a reason why the bilingual advantage may have been overstated",
      "To criticize scientists who study bilingual children"
     ],
     "explanation": "Если удачные результаты публиковали охотнее, преимущество могло казаться больше, чем есть. Это объясняет, почему крупные исследования его не повторили.",
     "highlight": "were published more readily than negative ones",
     "highlight_occurrence": 1
    },
    {
     "text": "What can be inferred about the early studies described in paragraph 1?",
     "type": "Inference",
     "correct": 3,
     "options": [
      "They were conducted only with adults.",
      "They proved that bilingualism slows development.",
      "They tested children in both languages.",
      "They underestimated bilingual children's language abilities."
     ],
     "explanation": "Детей проверяли только на одном языке и сравнивали группы из разной среды. Значит, языковые способности двуязычных детей были занижены. C прямо противоречит тексту."
    }
   ],
   "id": "n20"
  },
  {
   "title": "Mangrove Forests",
   "passage": "Mangroves are trees that grow along tropical coastlines, in the zone where land meets the sea. Few plants can survive there, because the soil is salty, waterlogged, and low in oxygen. Mangroves cope with these conditions through remarkable adaptations. Some species filter salt out at their roots, while others push it out through their leaves. Many send up special roots that stick out of the mud like pencils, allowing the trees to take in oxygen from the air.\n\n[s1] These forests provide important services to people living nearby. [s2] Their dense, tangled roots slow down waves and reduce the damage caused by storms. [s3] The calm, sheltered water among the roots serves as a nursery for young fish, many of which later support coastal fisheries. [s4] Mangrove soils also store large amounts of carbon, in some cases several times more per hectare than tropical rainforests.\n\nDespite these benefits, mangroves have been cleared rapidly in recent decades, often to make room for shrimp farms and coastal development. In response, many countries have launched replanting programs. Early efforts frequently failed because seedlings were planted in places where the tides and soil were unsuitable, but projects that first restore natural water flow have achieved much greater success.",
   "questions": [
    {
     "text": "Identify the sentence in paragraph 2 that describes how mangroves benefit the fishing industry.",
     "type": "Select a Sentence",
     "correct": 3,
     "options": [],
     "explanation": "Спокойная вода среди корней — «a nursery for young fish, many of which later support coastal fisheries»: мальки вырастают и попадают в улов."
    },
    {
     "text": "In paragraph 3, what is the relationship between the second and third sentences?",
     "type": "Organization",
     "correct": 1,
     "options": [
      "The second sentence describes a past event, and the third predicts a future one.",
      "The second sentence describes a response to a problem, and the third evaluates how well that response has worked.",
      "The second sentence states a cause, and the third describes its effect on fisheries.",
      "The second sentence makes a general claim, and the third gives an example that completely contradicts it."
     ],
     "explanation": "Второе предложение: страны начали высаживать мангры (ответ на вырубку). Третье: сначала не получалось, а проекты с восстановлением течения воды успешнее — оценка этих усилий."
    },
    {
     "text": "The word \"it\" in the passage refers to",
     "type": "Reference",
     "correct": 2,
     "options": [
      "oxygen",
      "the soil",
      "salt",
      "the root"
     ],
     "explanation": "«Some species filter salt out at their roots, while others push it out through their leaves» — выводят соль через листья.",
     "highlight": "it",
     "highlight_occurrence": 1
    },
    {
     "text": "The word \"tangled\" in the passage is closest in meaning to",
     "type": "Vocabulary",
     "correct": 1,
     "options": [
      "flexible",
      "twisted together",
      "very old",
      "underground"
     ],
     "explanation": "Tangled roots — спутанные, переплетённые корни."
    },
    {
     "text": "According to paragraph 1, mangroves survive difficult conditions in all of the following ways EXCEPT",
     "type": "Negative Factual",
     "correct": 1,
     "options": [
      "taking in oxygen through roots above the mud",
      "storing fresh water in their trunks",
      "removing salt at their roots",
      "releasing salt through their leaves"
     ],
     "explanation": "Фильтрация соли корнями, вывод соли через листья и корни-«карандаши» для кислорода в абзаце 1 есть. О запасах пресной воды в стволах не сказано."
    }
   ],
   "id": "n21"
  },
  {
   "title": "The Limits of Just-in-Time",
   "passage": "In the 1970s, the Japanese carmaker Toyota became famous for a production method known as just-in-time manufacturing. [sq1] Instead of keeping large stocks of parts in warehouses, its factories ordered parts so that they arrived only shortly before they were needed. [sq2] This approach reduced storage costs and made it easier to spot defects, since problems could no longer be hidden in piles of unused parts. [sq3] Within two decades, companies around the world had adopted similar systems. [sq4]\n\n[s1] The weaknesses of just-in-time systems became clear in 2020 and 2021. [s2] When the pandemic closed factories and disrupted shipping, many companies found themselves without essential components. [s3] A shortage of computer chips, for example, forced carmakers to halt production for weeks. [s4] Because so little was kept in reserve, a delay in one part of the world quickly spread to factories everywhere.\n\nSince then, many firms have reconsidered how lean their supply chains should be. Some are keeping larger reserves of critical parts or buying from suppliers in several countries rather than one. These measures increase costs, but managers increasingly see them as a form of insurance against future disruptions.",
   "questions": [
    {
     "text": "Identify the sentence in paragraph 2 that explains why problems spread so widely.",
     "type": "Select a Sentence",
     "correct": 4,
     "options": [],
     "explanation": "«Because so little was kept in reserve, a delay in one part of the world quickly spread to factories everywhere» — запасов почти не было, поэтому задержка в одном месте ударила по всем."
    },
    {
     "text": "Look at the four letters (A, B, C, D) in the passage that indicate where the following sentence could be added to the passage. Where would the sentence best fit?",
     "type": "Insert Text",
     "correct": 2,
     "options": [
      "Position A",
      "Position B",
      "Position C",
      "Position D"
     ],
     "explanation": "«The savings» — экономия на хранении («reduced storage costs»). Это предложение стоит прямо перед позицией C. В позиции B об экономии ещё не сказано.",
     "insertSentence": "The savings were especially large for manufacturers of complex products with thousands of components."
    },
    {
     "text": "Which of the following best expresses the essential information in the highlighted sentence?",
     "type": "Simplification",
     "correct": 0,
     "options": [
      "Although these steps are more expensive, managers view them as protection against future problems.",
      "Managers are buying insurance because supply chains have become more expensive.",
      "These measures have reduced costs and prevented disruptions.",
      "Managers believe future disruptions will increase costs."
     ],
     "explanation": "Меры дороже, но менеджеры видят в них «страховку» от будущих сбоев. B понимает insurance буквально, C противоречит «increase costs».",
     "highlight": "These measures increase costs, but managers increasingly see them as a form of insurance against future disruptions.",
     "highlight_occurrence": 1
    },
    {
     "text": "Why does the author mention \"A shortage of computer chips\"?",
     "type": "Rhetorical Purpose",
     "correct": 3,
     "options": [
      "To argue that carmakers should produce their own chips",
      "To explain why the pandemic began",
      "To show that chips are the most expensive part of a car",
      "To give an example of how missing components affected production"
     ],
     "explanation": "После «for example»: нехватка чипов — пример того, как без нужных деталей остановилось производство.",
     "highlight": "A shortage of computer chips",
     "highlight_occurrence": 1
    },
    {
     "text": "According to paragraph 1, why did just-in-time manufacturing make defects easier to find?",
     "type": "Factual",
     "correct": 0,
     "options": [
      "Because problems could not be hidden among stored parts",
      "Because parts came from fewer suppliers",
      "Because factories used computers to inspect parts",
      "Because workers were better trained"
     ],
     "explanation": "«Problems could no longer be hidden in piles of unused parts» — без больших складов брак сразу на виду."
    }
   ],
   "id": "n22"
  },
  {
   "title": "The Waggle Dance of Honeybees",
   "passage": "When a honeybee discovers a rich patch of flowers, she returns to the hive and performs a curious movement known as the waggle dance. The bee runs forward in a straight line while shaking her body from side to side, then circles back and repeats the run. In the 1940s, the Austrian scientist Karl von Frisch showed that this dance is a form of communication that tells other bees where to find food.\n\nThe dance encodes two pieces of information. [sq1] The angle of the straight run, measured against the vertical surface of the honeycomb, indicates the direction of the flowers relative to the Sun. [sq2] The length of the run indicates distance: the longer the bee waggles, the farther away the food is. [sq3] Watching bees follow the dancer and then fly toward the correct location convinced many scientists that von Frisch was right. [sq4]\n\nNot everyone was persuaded at first. Some researchers argued that bees found food mainly by following floral scents carried back on the dancer's body. Later experiments with robotic bees that performed artificial dances, and with radar tracking of individual insects, confirmed that the dance itself guides the search, although smell helps bees locate the exact flowers once they arrive.",
   "questions": [
    {
     "text": "Which of the following best summarizes the main point of the passage?",
     "type": "Main Idea",
     "correct": 3,
     "options": [
      "Honeybees rely mainly on smell to locate flowers far from the hive.",
      "Karl von Frisch designed robotic bees to study communication.",
      "The waggle dance shows how many flowers a bee has visited.",
      "Honeybees communicate the location of food through a dance, an idea later confirmed by experiments."
     ],
     "explanation": "Абзац 1 — танец передаёт, где еда; абзац 2 — как именно; абзац 3 — сомнения и подтверждение экспериментами. D объединяет всё. Роботов придумал не фон Фриш, а запах лишь помогает на месте."
    },
    {
     "text": "According to the passage, the waggle dance communicates all of the following EXCEPT",
     "type": "Negative Factual",
     "correct": 2,
     "options": [
      "the distance to the food",
      "the position of the food relative to the Sun",
      "the type of flowers that were found",
      "the direction of the food"
     ],
     "explanation": "Угол пробега — направление относительно Солнца, длина пробега — расстояние. О виде цветов танец ничего не сообщает."
    },
    {
     "text": "Look at the four letters (A, B, C, D) in the passage that indicate where the following sentence could be added to the passage. Where would the sentence best fit?",
     "type": "Insert Text",
     "correct": 2,
     "options": [
      "Position A",
      "Position B",
      "Position C",
      "Position D"
     ],
     "explanation": "«For example» и «a run lasting about one second… a kilometer away» — пример к мысли о длине пробега и расстоянии. Она стоит прямо перед позицией C.",
     "insertSentence": "A run lasting about one second, for example, may signal a source roughly a kilometer away."
    },
    {
     "text": "Why does the author mention \"robotic bees that performed artificial dances\"?",
     "type": "Rhetorical Purpose",
     "correct": 0,
     "options": [
      "To describe evidence that the dance itself guides other bees",
      "To show that real bees cannot dance accurately",
      "To explain how von Frisch first studied bees",
      "To argue that smell is more important than the dance"
     ],
     "explanation": "Роботы и радар упомянуты как эксперименты, которые «confirmed that the dance itself guides the search».",
     "highlight": "robotic bees that performed artificial dances",
     "highlight_occurrence": 1
    },
    {
     "text": "What is the relationship between paragraph 2 and paragraph 3?",
     "type": "Organization",
     "correct": 2,
     "options": [
      "Paragraph 2 describes an experiment, and paragraph 3 describes its history.",
      "Paragraph 2 describes the behavior of bees, and paragraph 3 describes the behavior of flowers.",
      "Paragraph 2 explains how the dance works, and paragraph 3 describes doubts about it and how they were resolved.",
      "Paragraph 2 presents a theory, and paragraph 3 proves that it was wrong."
     ],
     "explanation": "Абзац 2 — как устроен танец. Абзац 3: «Not everyone was persuaded at first…», а затем «Later experiments… confirmed» — сомнения и их разрешение. Теория в итоге подтвердилась, так что D неверно."
    }
   ],
   "id": "n23"
  },
  {
   "title": "The Terracotta Army",
   "passage": "In 1974, farmers digging a well in northern China struck fragments of a clay figure. Their discovery led archaeologists to one of the most remarkable finds of the twentieth century: an army of more than 7,000 life-sized terracotta soldiers buried near the tomb of Qin Shi Huang, the first emperor to unify China, who died in 210 BCE.\n\n[s1] The figures were made in workshops using a combination of molds and hand sculpting. [s2] Bodies, arms, and heads were produced separately and then joined together. [s3] Craftsmen added individual details such as hairstyles, mustaches, and facial expressions, so that no two soldiers look exactly alike. [s4] Originally, the figures were painted in bright colors, but most of the paint flaked off within minutes of being exposed to air. [s5] The soldiers also carried real bronze weapons, many of which remain sharp today.\n\nHistorians believe the army was intended to protect the emperor in the afterlife. Large parts of the burial complex, including the emperor's own tomb, have never been opened. Archaeologists have chosen to wait until they develop techniques that can preserve fragile materials, such as paint, that might otherwise be destroyed the moment they are uncovered.",
   "questions": [
    {
     "text": "Which of the following best summarizes the main point of the passage?",
     "type": "Main Idea",
     "correct": 0,
     "options": [
      "A huge army of individually crafted clay soldiers was buried to protect China's first emperor, and much of the site remains unexcavated.",
      "Farmers in China discovered a new method for making clay figures.",
      "The terracotta soldiers were painted in bright colors that are still visible today.",
      "The emperor's tomb was robbed soon after his death."
     ],
     "explanation": "Открытие армии, как делали фигуры, зачем и почему часть комплекса не раскопана — всё это в A. C противоречит тексту: краска осыпалась."
    },
    {
     "text": "According to paragraph 2, all of the following are true of the terracotta figures EXCEPT",
     "type": "Negative Factual",
     "correct": 3,
     "options": [
      "Their parts were made separately.",
      "They have individual facial features.",
      "They were originally painted.",
      "They were carved from a single block of stone."
     ],
     "explanation": "Части делали отдельно, детали лиц индивидуальные, фигуры были раскрашены. Это глина (terracotta), а не камень, и делали их по частям."
    },
    {
     "text": "Which of the following best expresses the essential information in the highlighted sentence?",
     "type": "Simplification",
     "correct": 1,
     "options": [
      "New techniques have recently allowed archaeologists to open the tomb.",
      "Archaeologists are delaying excavation until they can protect delicate materials that could be lost when exposed.",
      "Archaeologists have destroyed some fragile materials by uncovering them too early.",
      "Paint is the only material in the tomb that archaeologists want to study."
     ],
     "explanation": "Археологи ждут технологий, которые сохранят хрупкие материалы, иначе те разрушатся при вскрытии. A противоречит тексту: гробница не вскрыта.",
     "highlight": "Archaeologists have chosen to wait until they develop techniques that can preserve fragile materials, such as paint, that might otherwise be destroyed the moment they are uncovered.",
     "highlight_occurrence": 1
    },
    {
     "text": "Identify the sentence in paragraph 2 that explains why the figures look different from one another.",
     "type": "Select a Sentence",
     "correct": 3,
     "options": [],
     "explanation": "«Craftsmen added individual details… so that no two soldiers look exactly alike» — индивидуальные детали делают фигуры непохожими."
    },
    {
     "text": "The phrase \"Their discovery\" in the passage refers to the discovery made by",
     "type": "Reference",
     "correct": 3,
     "options": [
      "craftsmen",
      "historians",
      "archaeologists",
      "farmers"
     ],
     "explanation": "Предыдущее предложение: «farmers digging a well… struck fragments of a clay figure». Их находка привела археологов к армии.",
     "highlight": "Their discovery",
     "highlight_occurrence": 1
    }
   ],
   "id": "n24"
  },
  {
   "title": "Thawing Permafrost",
   "passage": "Across the Arctic, large areas of ground remain frozen all year round. This permanently frozen soil, called permafrost, covers nearly a quarter of the land in the Northern Hemisphere. Much of it formed during the last ice age and contains the remains of plants and animals that died tens of thousands of years ago but never fully decomposed because of the cold.\n\nAs Arctic temperatures rise, permafrost is beginning to thaw. When it does, microbes become active and start breaking down this ancient organic matter. [sq1] In the process, they release carbon dioxide and methane, two gases that trap heat in the atmosphere. [sq2] Scientists estimate that permafrost holds roughly twice as much carbon as the atmosphere currently does. [sq3] Releasing even a fraction of it could therefore significantly speed up global warming. [sq4]\n\nThawing ground also creates immediate problems for people who live in the region. Buildings, roads, and pipelines constructed on frozen soil can tilt or crack as the ground softens beneath them. In some Arctic towns, engineers now install cooling systems under foundations or build on piles driven deep into the ground to keep structures stable. Coastal communities face additional risks, as thawing shorelines are more easily worn away by waves.",
   "questions": [
    {
     "text": "Which of the following best summarizes the main point of the passage?",
     "type": "Main Idea",
     "correct": 1,
     "options": [
      "Microbes in the Arctic produce more methane than any other source.",
      "Thawing permafrost could release large amounts of greenhouse gases and is already damaging Arctic infrastructure.",
      "Permafrost formed during the last ice age and covers most of the Northern Hemisphere.",
      "Engineers have solved the problems caused by thawing ground."
     ],
     "explanation": "Два главных последствия таяния — выбросы газов (абзац 2) и разрушение построек (абзац 3). C искажает «nearly a quarter», D — слишком сильное утверждение."
    },
    {
     "text": "According to paragraph 3, all of the following are problems caused by thawing ground EXCEPT",
     "type": "Negative Factual",
     "correct": 0,
     "options": [
      "contamination of drinking water",
      "buildings tilting or cracking",
      "damage to roads and pipelines",
      "erosion of coastlines"
     ],
     "explanation": "Наклон зданий, повреждение дорог и труб, размывание берегов — в тексте есть. О загрязнении питьевой воды не сказано."
    },
    {
     "text": "Look at the four letters (A, B, C, D) in the passage that indicate where the following sentence could be added to the passage. Where would the sentence best fit?",
     "type": "Insert Text",
     "correct": 1,
     "options": [
      "Position A",
      "Position B",
      "Position C",
      "Position D"
     ],
     "explanation": "Предложение уточняет мысль про метан, а он только что назван перед позицией B: «they release carbon dioxide and methane».",
     "insertSentence": "Methane is especially concerning, since it traps far more heat than carbon dioxide over the short term."
    },
    {
     "text": "Why does the author mention that permafrost holds \"roughly twice as much carbon as the atmosphere currently does\"?",
     "type": "Rhetorical Purpose",
     "correct": 1,
     "options": [
      "To show that microbes cannot break down ancient matter",
      "To emphasize how much carbon could be released if permafrost thaws",
      "To explain how permafrost was formed",
      "To argue that the atmosphere contains too little carbon"
     ],
     "explanation": "Цифра подчёркивает масштаб: следующее предложение делает вывод, что выброс даже части этого углерода ускорит потепление.",
     "highlight": "roughly twice as much carbon as the atmosphere currently does",
     "highlight_occurrence": 1
    },
    {
     "text": "How is paragraph 3 related to paragraph 2?",
     "type": "Organization",
     "correct": 3,
     "options": [
      "Paragraph 3 provides evidence that contradicts paragraph 2.",
      "Paragraph 3 explains the cause of the process described in paragraph 2.",
      "Paragraph 3 repeats the main point of paragraph 2 in simpler language.",
      "Paragraph 3 turns from a global effect of thawing to local effects on people in the Arctic."
     ],
     "explanation": "Абзац 2 — глобальное последствие (потепление), абзац 3 — «immediate problems for people who live in the region»."
    }
   ],
   "id": "n25"
  },
  {
   "title": "The Gut Microbiome",
   "passage": "The human digestive system is home to trillions of bacteria, along with viruses and fungi, that together make up the gut microbiome. For a long time, these microbes were regarded mainly as harmless passengers or, in some cases, as sources of disease. Research over the past two decades has shown that many of them play essential roles in keeping their host healthy.\n\n[s1] Gut bacteria break down fibers in food that human enzymes cannot digest. [s2] In doing so, they produce compounds that nourish the cells lining the intestine. [s3] They also help train the immune system to distinguish between harmful invaders and harmless substances. [s4] Some studies even suggest that signals from gut microbes can influence mood and behavior by affecting chemicals in the brain. [s5] This last finding, however, is based mostly on experiments with mice and remains uncertain in humans.\n\nThe composition of the microbiome varies greatly from person to person and is shaped by diet, medication, and early life experiences. Antibiotics, while often necessary, can wipe out beneficial bacteria along with harmful ones, and the community may take months to recover. Because a diverse microbiome is generally associated with better health, researchers recommend diets rich in plant fibers, which provide food for a wide range of beneficial species.",
   "questions": [
    {
     "text": "Which of the following best summarizes the main point of the passage?",
     "type": "Main Idea",
     "correct": 2,
     "options": [
      "Scientists have proven that gut bacteria control human mood.",
      "Everyone has the same types of bacteria in the gut.",
      "Gut microbes perform important functions for health, and their makeup depends on factors such as diet and medicine.",
      "Gut bacteria are mostly harmful and should be removed with antibiotics."
     ],
     "explanation": "Абзац 2 — чем полезны микробы, абзац 3 — от чего зависит их состав. Влияние на настроение не доказано у людей, так что A слишком сильное."
    },
    {
     "text": "According to paragraph 2, gut bacteria do all of the following EXCEPT",
     "type": "Negative Factual",
     "correct": 1,
     "options": [
      "help train the immune system",
      "produce the enzymes humans use to digest protein",
      "digest fibers that humans cannot",
      "produce compounds that feed intestinal cells"
     ],
     "explanation": "Расщепление клетчатки, питание клеток кишечника и обучение иммунитета в тексте есть. О ферментах для белка не сказано."
    },
    {
     "text": "What can be inferred about a person who has recently taken antibiotics?",
     "type": "Inference",
     "correct": 0,
     "options": [
      "The variety of bacteria in their gut may be reduced for some time.",
      "Their microbiome will contain only harmful bacteria.",
      "They no longer need to eat plant fibers.",
      "Their mood will definitely change."
     ],
     "explanation": "Антибиотики уничтожают и полезные бактерии, а сообщество восстанавливается месяцами. Значит, какое-то время разнообразие бактерий снижено."
    },
    {
     "text": "Which of the following best expresses the essential information in the highlighted sentence?",
     "type": "Simplification",
     "correct": 2,
     "options": [
      "Researchers have found that diverse diets cause the microbiome to become less healthy.",
      "A diverse microbiome makes it unnecessary to eat plant fibers.",
      "Researchers suggest eating plant fibers because they support many beneficial bacteria, and diversity is linked to good health.",
      "Plant fibers are the only food that beneficial bacteria can eat."
     ],
     "explanation": "Логика: разнообразие микробиома связано со здоровьем → советуют клетчатку, которая кормит много полезных видов. D — «only», A и B переворачивают смысл.",
     "highlight": "Because a diverse microbiome is generally associated with better health, researchers recommend diets rich in plant fibers, which provide food for a wide range of beneficial species.",
     "highlight_occurrence": 1
    },
    {
     "text": "Identify the sentence in paragraph 2 that expresses doubt about one of the findings.",
     "type": "Select a Sentence",
     "correct": 5,
     "options": [],
     "explanation": "«This last finding, however, is based mostly on experiments with mice and remains uncertain in humans» — сомнение в выводе о влиянии на настроение."
    }
   ],
   "id": "n26"
  },
  {
   "title": "Continental Drift",
   "passage": "In 1912, the German scientist Alfred Wegener proposed that the continents had once been joined in a single landmass, which he called Pangaea, and had slowly drifted apart over millions of years. He pointed to several kinds of evidence. The coastlines of South America and Africa fit together like pieces of a puzzle. [sq1] Identical fossils of land animals and plants were found on continents now separated by oceans. [sq2] Rock formations in eastern North America matched those in Scotland and Norway. [sq3]\n\nDespite this evidence, most geologists rejected Wegener's idea for decades. The main objection was that he could not explain what force would be strong enough to push entire continents through the solid rock of the ocean floor. [sq4] Wegener suggested that the rotation of Earth might be responsible, but calculations showed this force was far too weak.\n\nThe situation changed in the 1950s and 1960s, when ships mapping the ocean floor discovered long underwater mountain ranges where new crust is formed. Scientists realized that the ocean floor itself was spreading and that continents ride on large moving plates rather than plowing through the seafloor. This theory of plate tectonics finally provided the mechanism Wegener had lacked, and his once-rejected idea became a foundation of modern geology.",
   "questions": [
    {
     "text": "Which of the following best summarizes the main point of the passage?",
     "type": "Main Idea",
     "correct": 3,
     "options": [
      "Wegener proved that Earth's rotation moves the continents.",
      "South America and Africa have identical coastlines.",
      "Geologists in the 1950s discovered the supercontinent Pangaea.",
      "Wegener's idea of drifting continents was rejected for lacking a mechanism until plate tectonics explained how continents move."
     ],
     "explanation": "Идея Вегенера (абзац 1), её отвергли без механизма (абзац 2), тектоника плит дала механизм (абзац 3). A противоречит тексту: вращение Земли оказалось слишком слабым."
    },
    {
     "text": "The phrase \"this force\" in the passage refers to",
     "type": "Reference",
     "correct": 0,
     "options": [
      "the rotation of Earth",
      "the spreading of the ocean floor",
      "the movement of plates",
      "the weight of the continents"
     ],
     "explanation": "Вегенер предположил, что причина — «the rotation of Earth», а расчёты показали, что эта сила слишком слаба.",
     "highlight": "this force",
     "highlight_occurrence": 1
    },
    {
     "text": "All of the following are mentioned as evidence that Wegener used EXCEPT",
     "type": "Negative Factual",
     "correct": 2,
     "options": [
      "identical fossils on separate continents",
      "similar rock formations on different continents",
      "measurements of the ocean floor",
      "the matching shapes of coastlines"
     ],
     "explanation": "Береговые линии, окаменелости и горные породы — доказательства Вегенера. Дно океана нанесли на карты только в 1950-х, после него."
    },
    {
     "text": "What can be inferred about Wegener from the passage?",
     "type": "Inference",
     "correct": 1,
     "options": [
      "He believed continents ride on moving plates.",
      "His theory was largely accepted only after he could no longer defend it himself.",
      "He was the first to map the ocean floor.",
      "He agreed with geologists who rejected his idea."
     ],
     "explanation": "Идею отвергали «for decades», а приняли в 1950–60-х, через десятилетия после 1912 года. Ни карт дна, ни теории плит у Вегенера не было."
    },
    {
     "text": "Look at the four letters (A, B, C, D) in the passage that indicate where the following sentence could be added to the passage. Where would the sentence best fit?",
     "type": "Insert Text",
     "correct": 3,
     "options": [
      "Position A",
      "Position B",
      "Position C",
      "Position D"
     ],
     "explanation": "Предложение развивает возражение критиков: непонятно, какая сила может толкать континенты сквозь твёрдое дно. Оно стоит прямо перед позицией D.",
     "insertSentence": "Critics found it impossible to imagine continents moving like ships through ice."
    }
   ],
   "id": "n27"
  },
  {
   "title": "The Roots of Jazz",
   "passage": "Jazz emerged in the early twentieth century in New Orleans, a port city where African, European, and Caribbean musical traditions met. Its roots lay in the blues, with their expressive bending of notes, and in ragtime, a piano style built on lively, syncopated rhythms. Brass bands, which played at parades and funerals throughout the city, contributed instruments such as the trumpet, trombone, and clarinet.\n\n[s1] What set jazz apart was its emphasis on improvisation. [s2] Rather than playing a fixed written part, musicians created new melodies on the spot while following the underlying chords of a song. [s3] In early New Orleans bands, several instruments often improvised at the same time, weaving their lines around one another. [s4] Later, musicians such as Louis Armstrong popularized the extended solo, in which one player improvised while the others accompanied. [s5] This shift placed the individual performer at the center of the music.\n\nDuring the 1920s, many musicians moved north to cities such as Chicago and New York, and recordings spread jazz across the country and abroad. It went on to develop into numerous styles, from the big band swing of the 1930s to the fast, complex bebop of the 1940s. Each new style was at first criticized by some listeners as noise before it, too, became accepted.",
   "questions": [
    {
     "text": "Which of the following best summarizes the main point of the passage?",
     "type": "Main Idea",
     "correct": 0,
     "options": [
      "Jazz grew out of several musical traditions in New Orleans, was defined by improvisation, and spread and changed over time.",
      "Louis Armstrong invented jazz in New Orleans.",
      "Jazz musicians always play fixed written parts.",
      "Bebop was the first style of jazz."
     ],
     "explanation": "Корни джаза (абзац 1), импровизация (абзац 2), распространение и новые стили (абзац 3). Армстронг лишь сделал популярным соло."
    },
    {
     "text": "Identify the sentence in paragraph 2 that describes how early jazz bands improvised.",
     "type": "Select a Sentence",
     "correct": 3,
     "options": [],
     "explanation": "«In early New Orleans bands, several instruments often improvised at the same time» — в ранних оркестрах импровизировали сразу несколько инструментов."
    },
    {
     "text": "The word \"It\" in the passage refers to",
     "type": "Reference",
     "correct": 1,
     "options": [
      "the country",
      "jazz",
      "New York",
      "recording"
     ],
     "explanation": "«Recordings spread jazz across the country and abroad. It went on to develop into numerous styles» — развивался джаз.",
     "highlight": "It",
     "highlight_occurrence": 1
    },
    {
     "text": "According to paragraph 1, all of the following influenced the development of jazz EXCEPT",
     "type": "Negative Factual",
     "correct": 3,
     "options": [
      "the blues",
      "ragtime",
      "brass bands",
      "classical opera"
     ],
     "explanation": "Блюз, регтайм и духовые оркестры названы. Оперы в тексте нет."
    },
    {
     "text": "Why does the author mention that new styles were \"criticized by some listeners as noise\"?",
     "type": "Rhetorical Purpose",
     "correct": 2,
     "options": [
      "To explain why musicians moved to Chicago",
      "To describe the sound of brass bands",
      "To show that each new form of jazz faced resistance before being accepted",
      "To argue that bebop was not real music"
     ],
     "explanation": "Конец предложения: «before it, too, became accepted». Каждый новый стиль сначала ругали, потом принимали.",
     "highlight": "criticized by some listeners as noise",
     "highlight_occurrence": 1
    }
   ],
   "id": "n28"
  },
  {
   "title": "Dunbar's Number",
   "passage": "How many meaningful relationships can one person maintain? In the 1990s, the British anthropologist Robin Dunbar proposed an answer based on the brains of primates. He observed that species with a larger neocortex, the outer layer of the brain involved in complex thinking, tend to live in larger social groups. Extending this pattern to humans, he predicted that people can maintain stable relationships with about 150 others.\n\nDunbar found support for this figure in a surprising range of places. Many traditional villages, he noted, have contained roughly 150 inhabitants, and some military units have historically been organized around groups of similar size. Within that number, he argued, relationships form layers: a person typically has about five very close companions, around fifteen good friends, and about fifty friends seen regularly.\n\nCritics have questioned whether a single number can describe human social life. The size of personal networks varies widely between individuals, and modern technology allows people to keep in touch with far more acquaintances than in the past. Some statistical analyses have produced estimates ranging from a few dozen to several hundred. Dunbar has responded that online contacts are rarely as close as face-to-face relationships, and that the limit applies to relationships that require regular effort to maintain.",
   "questions": [
    {
     "text": "Which of the following best summarizes the main point of the passage?",
     "type": "Main Idea",
     "correct": 1,
     "options": [
      "Primates with smaller brains live in larger groups.",
      "Dunbar argued that humans can maintain about 150 stable relationships, a claim that critics have challenged.",
      "Social media has allowed people to maintain thousands of close friendships.",
      "Military units are always organized into groups of exactly 150 people."
     ],
     "explanation": "Гипотеза Дунбара (абзацы 1–2) и её критика (абзац 3). A переворачивает закономерность: чем больше неокортекс, тем больше группа."
    },
    {
     "text": "How is paragraph 2 organized?",
     "type": "Organization",
     "correct": 0,
     "options": [
      "It presents examples supporting a claim and then describes the structure of relationships within that limit.",
      "It describes a problem and then proposes several solutions.",
      "It compares two theories and rejects both.",
      "It lists events in the order in which they happened."
     ],
     "explanation": "Сначала примеры в поддержку числа 150 (деревни, армия), затем «Within that number… relationships form layers» — слои отношений."
    },
    {
     "text": "Which of the following best expresses the essential information in the highlighted sentence?",
     "type": "Simplification",
     "correct": 3,
     "options": [
      "Dunbar admitted that his estimate does not apply to modern societies.",
      "Dunbar argued that people should spend less time online.",
      "Dunbar claimed that face-to-face relationships require no effort.",
      "Dunbar replied that online contacts are usually less close and that his limit concerns relationships needing ongoing effort."
     ],
     "explanation": "Ответ Дунбара из двух частей: онлайн-контакты редко такие же близкие, и предел касается отношений, которые требуют усилий. A противоречит смыслу ответа.",
     "highlight": "Dunbar has responded that online contacts are rarely as close as face-to-face relationships, and that the limit applies to relationships that require regular effort to maintain.",
     "highlight_occurrence": 1
    },
    {
     "text": "According to paragraph 2, how many very close companions does a person typically have?",
     "type": "Factual",
     "correct": 1,
     "options": [
      "About 150",
      "About five",
      "About fifteen",
      "About fifty"
     ],
     "explanation": "«A person typically has about five very close companions». 15 — хорошие друзья, 50 — те, с кем видятся регулярно."
    },
    {
     "text": "Why does the author mention \"traditional villages\" in paragraph 2?",
     "type": "Rhetorical Purpose",
     "correct": 3,
     "options": [
      "To show that people in villages have fewer friends",
      "To explain why the neocortex grew larger",
      "To criticize the way villages were organized",
      "To give an example of a group that supports Dunbar's estimate"
     ],
     "explanation": "«Dunbar found support for this figure…» — деревни примерно по 150 жителей служат примером в пользу его числа.",
     "highlight": "traditional villages",
     "highlight_occurrence": 1
    }
   ],
   "id": "n29"
  },
  {
   "title": "Power from the Tides",
   "passage": "Twice a day, the gravitational pull of the Moon and the Sun causes sea levels along coastlines to rise and fall. These tides carry enormous amounts of energy, and unlike wind or sunlight, they are entirely predictable. Engineers can calculate the timing and height of tides years in advance, which makes tidal energy an attractive source of electricity.\n\n[s1] The oldest approach uses a barrage, a dam built across the mouth of a bay or river. [s2] As the tide rises, water flows into the basin behind the dam. [s3] When the tide falls, the water is released through turbines that generate electricity. [s4] The La Rance station in France, opened in 1966, still operates this way. [s5] However, barrages are expensive to build and can disrupt the movement of fish and the flow of sediment.\n\nA newer approach places turbines directly in fast tidal currents, much like underwater wind turbines. [sq1] Because water is far denser than air, even slow currents can turn large blades with great force. [sq2] These systems avoid blocking entire bays, but they must withstand harsh conditions, including corrosion from salt water. [sq3] Only a handful of tidal projects operate worldwide today, yet several countries with strong coastal currents are investing in further development. [sq4]",
   "questions": [
    {
     "text": "Which of the following best summarizes the main point of the passage?",
     "type": "Main Idea",
     "correct": 2,
     "options": [
      "The La Rance station is the only tidal power plant still in operation.",
      "Underwater turbines have replaced all tidal barrages.",
      "Tidal energy is predictable and can be captured in different ways, each with advantages and drawbacks.",
      "Tidal power is the cheapest source of electricity in the world."
     ],
     "explanation": "Приливы предсказуемы (абзац 1), два способа добывать энергию — плотины и турбины в течениях — со своими плюсами и минусами. Остальное противоречит тексту."
    },
    {
     "text": "Look at the four letters (A, B, C, D) in the passage that indicate where the following sentence could be added to the passage. Where would the sentence best fit?",
     "type": "Insert Text",
     "correct": 2,
     "options": [
      "Position A",
      "Position B",
      "Position C",
      "Position D"
     ],
     "explanation": "«Also difficult» продолжает перечень трудностей подводных турбин: сразу перед позицией C сказано про суровые условия и коррозию.",
     "insertSentence": "Maintenance is also difficult, since repairs often require divers or specialized ships."
    },
    {
     "text": "What is the relationship between paragraph 2 and paragraph 3?",
     "type": "Organization",
     "correct": 1,
     "options": [
      "Paragraph 2 gives a definition, and paragraph 3 gives examples of it.",
      "Paragraph 2 describes an older method of capturing tidal energy, and paragraph 3 describes a newer one.",
      "Paragraph 2 describes a problem, and paragraph 3 explains its causes.",
      "Paragraph 2 presents an argument, and paragraph 3 refutes it."
     ],
     "explanation": "Абзац 2 — «The oldest approach» (плотина), абзац 3 — «A newer approach» (турбины в течениях)."
    },
    {
     "text": "Which of the following best expresses the essential information in the highlighted sentence?",
     "type": "Simplification",
     "correct": 0,
     "options": [
      "Because water is much heavier than air, even slow currents can drive large turbine blades powerfully.",
      "Water moves faster than air, so tidal turbines spin more quickly than wind turbines.",
      "Large blades are needed because tidal currents are always slow.",
      "Air is denser than water, so wind turbines are more powerful."
     ],
     "explanation": "Причина — вода гораздо плотнее воздуха; следствие — даже медленное течение мощно крутит лопасти. B путает плотность со скоростью, D переворачивает факт.",
     "highlight": "Because water is far denser than air, even slow currents can turn large blades with great force.",
     "highlight_occurrence": 1
    },
    {
     "text": "Identify the sentence in paragraph 2 that describes disadvantages of barrages.",
     "type": "Select a Sentence",
     "correct": 5,
     "options": [],
     "explanation": "«However, barrages are expensive to build and can disrupt the movement of fish and the flow of sediment» — дороговизна и вред рыбе и наносам."
    }
   ],
   "id": "n30"
  },
  {
   "title": "Saturn's Rings",
   "passage": "Saturn's rings are among the most striking sights in the solar system. Although they appear solid from a distance, they are made of countless separate pieces of ice and rock, ranging in size from tiny grains to boulders as large as houses. The rings stretch hundreds of thousands of kilometers across, yet in most places they are only about ten meters thick.\n\nHow the rings formed is still debated. [sq1] One idea holds that they are the remains of a moon that came too close to Saturn and was torn apart by the planet's gravity. [sq2] Another suggests that they are leftover material that never came together into a moon in the first place. [sq3] Data from the Cassini spacecraft, which orbited Saturn from 2004 to 2017, added a new twist. [sq4] Its measurements indicated that the rings are surprisingly clean, containing little of the dust that constantly falls into the outer solar system. If the rings were billions of years old, they should have become darker over time.\n\nThis led some scientists to conclude that the rings may be relatively young, perhaps only a few hundred million years old. Cassini also found that ring material is steadily falling into Saturn. If this continues, the rings could largely disappear within the next few hundred million years, meaning that humans happen to be observing them during a brief period in the planet's history.",
   "questions": [
    {
     "text": "The word \"they\" in the passage refers to",
     "type": "Reference",
     "correct": 2,
     "options": [
      "boulders",
      "houses",
      "Saturn's rings",
      "pieces of ice and rock"
     ],
     "explanation": "«Although they appear solid from a distance, they are made of countless separate pieces» — речь о кольцах Сатурна из предыдущего предложения.",
     "highlight": "they",
     "highlight_occurrence": 1
    },
    {
     "text": "According to the passage, all of the following are true of Saturn's rings EXCEPT",
     "type": "Negative Factual",
     "correct": 0,
     "options": [
      "They are covered with dark dust.",
      "They are made of separate pieces of ice and rock.",
      "They are very thin in most places.",
      "Material from them is falling into Saturn."
     ],
     "explanation": "Кольца удивительно чистые — «containing little of the dust». Остальное в тексте есть."
    },
    {
     "text": "What can be inferred about the age of the rings from paragraph 2?",
     "type": "Inference",
     "correct": 2,
     "options": [
      "They formed after the Cassini spacecraft arrived.",
      "Their age has been measured exactly.",
      "Their clean appearance suggests that they are not as old as Saturn itself.",
      "They must be billions of years old."
     ],
     "explanation": "Если бы кольцам были миллиарды лет, они бы потемнели от пыли. Раз они чистые, они, вероятно, моложе — что и делает вывод абзац 3."
    },
    {
     "text": "Which of the following best summarizes the main point of the passage?",
     "type": "Main Idea",
     "correct": 3,
     "options": [
      "Saturn's rings are solid structures made of rock.",
      "Cassini proved that the rings came from a destroyed moon.",
      "Saturn will lose its rings within the next few years.",
      "Saturn's rings may be young and temporary features, according to evidence from the Cassini mission."
     ],
     "explanation": "Главная мысль — данные «Кассини» говорят, что кольца могут быть молодыми и со временем исчезнуть. B и C искажают текст: происхождение не доказано, срок — сотни миллионов лет."
    },
    {
     "text": "Look at the four letters (A, B, C, D) in the passage that indicate where the following sentence could be added to the passage. Where would the sentence best fit?",
     "type": "Insert Text",
     "correct": 2,
     "options": [
      "Position A",
      "Position B",
      "Position C",
      "Position D"
     ],
     "explanation": "«Neither explanation» — обе гипотезы уже названы. Это так перед позицией C, а следующий за ней «Кассини» как раз и есть аппарат, изучивший кольца вблизи.",
     "insertSentence": "Neither explanation, however, could be tested until a spacecraft studied the rings up close."
    }
   ],
   "id": "n31"
  },
  {
   "title": "Turning Seawater into Drinking Water",
   "passage": "Although water covers most of Earth's surface, about 97 percent of it is salty and unsuitable for drinking or farming. As populations grow and droughts become more frequent, many dry regions are turning to desalination, the process of removing salt from seawater. More than 20,000 desalination plants now operate worldwide, especially in the Middle East, North Africa, and Australia.\n\nMost modern plants use a method called reverse osmosis. Seawater is pushed at high pressure through membranes with holes so small that water molecules can pass through but salt cannot. The result is fresh water that can be piped to homes and farms. Earlier plants relied mainly on boiling seawater and collecting the steam, a method that requires even more energy.\n\n[s1] Desalination nonetheless has significant drawbacks. [s2] Producing the high pressure needed for reverse osmosis consumes large amounts of electricity, which often comes from burning fossil fuels. [s3] The process also produces brine, a highly salty waste liquid that is usually returned to the sea. [s4] If not properly diluted, brine can sink to the seafloor and harm marine life. [s5] Engineers are working on solutions, such as powering plants with solar energy and finding industrial uses for the salts in brine.",
   "questions": [
    {
     "text": "According to paragraph 2, how does reverse osmosis remove salt from seawater?",
     "type": "Factual",
     "correct": 2,
     "options": [
      "By adding chemicals that absorb salt",
      "By freezing the water and removing the ice",
      "By forcing water through membranes that block salt",
      "By boiling the water and collecting the steam"
     ],
     "explanation": "«Seawater is pushed at high pressure through membranes with holes so small that water molecules can pass through but salt cannot». Кипячение — это более старый метод."
    },
    {
     "text": "Why does the author mention that earlier plants relied on \"boiling seawater and collecting the steam\"?",
     "type": "Rhetorical Purpose",
     "correct": 0,
     "options": [
      "To contrast reverse osmosis with an older and more energy-intensive method",
      "To explain why reverse osmosis produces brine",
      "To show that boiling is still the most common method",
      "To describe how fresh water is piped to homes"
     ],
     "explanation": "Старый метод упомянут для сравнения: он «requires even more energy», чем обратный осмос.",
     "highlight": "boiling seawater and collecting the steam",
     "highlight_occurrence": 1
    },
    {
     "text": "How does paragraph 3 relate to paragraph 2?",
     "type": "Organization",
     "correct": 2,
     "options": [
      "Paragraph 2 gives historical background, and paragraph 3 describes the present.",
      "Paragraph 2 makes a prediction, and paragraph 3 provides evidence for it.",
      "Paragraph 2 explains how a process works, and paragraph 3 discusses its disadvantages.",
      "Paragraph 2 presents problems, and paragraph 3 shows they have been fully solved."
     ],
     "explanation": "Абзац 2 — как работает обратный осмос. Абзац 3: «Desalination nonetheless has significant drawbacks». Решения только разрабатываются, так что D неверно."
    },
    {
     "text": "Which of the following best expresses the essential information in the highlighted sentence?",
     "type": "Simplification",
     "correct": 1,
     "options": [
      "Fossil fuels are needed to make membranes for reverse osmosis.",
      "Reverse osmosis requires a lot of electricity, much of which is generated from fossil fuels.",
      "Reverse osmosis produces fossil fuels as a waste product.",
      "Electricity is used to burn seawater in reverse osmosis."
     ],
     "explanation": "Высокое давление требует много электричества, а его часто получают из ископаемого топлива. Остальные варианты искажают связи.",
     "highlight": "Producing the high pressure needed for reverse osmosis consumes large amounts of electricity, which often comes from burning fossil fuels.",
     "highlight_occurrence": 1
    },
    {
     "text": "Identify the sentence in paragraph 3 that describes how brine can damage the environment.",
     "type": "Select a Sentence",
     "correct": 4,
     "options": [],
     "explanation": "«If not properly diluted, brine can sink to the seafloor and harm marine life» — именно здесь вред для морской жизни. Предложение 3 только говорит, что такое рассол."
    }
   ],
   "id": "n32"
  },
  {
   "title": "The Late Bronze Age Collapse",
   "passage": "Around 1200 BCE, the eastern Mediterranean was home to a network of powerful states. The Egyptians, the Hittites of Anatolia, the Mycenaean Greeks, and the trading cities of the Levant exchanged copper, tin, grain, and luxury goods across land and sea. Within a few decades, however, this world fell apart. Many cities were destroyed or abandoned, the Hittite empire vanished, and writing disappeared from Greece for several centuries.\n\nFor a long time, historians blamed the collapse on the so-called Sea Peoples, groups of raiders mentioned in Egyptian records as attacking coastal regions. Yet the origins of these groups remain obscure, and many scholars now doubt that invaders alone could have brought down so many states.\n\nRecent research points instead to a combination of pressures. Evidence from lake sediments and tree rings suggests that the region suffered a prolonged drought. Crop failures may have led to famine and unrest, while earthquakes struck several major cities. Because the states depended heavily on one another for trade, the failure of some may have triggered a chain reaction that weakened the others. In this view, the Sea Peoples were as much a symptom of the crisis as its cause.",
   "questions": [
    {
     "text": "All of the following are mentioned as possible factors in the collapse EXCEPT",
     "type": "Negative Factual",
     "correct": 1,
     "options": [
      "attacks by raiders",
      "a widespread disease",
      "a long drought",
      "earthquakes"
     ],
     "explanation": "Засуха, землетрясения и набеги «народов моря» в тексте названы. Эпидемии нет."
    },
    {
     "text": "What can be inferred about the Sea Peoples from paragraph 3?",
     "type": "Inference",
     "correct": 3,
     "options": [
      "They were the only cause of the collapse.",
      "They kept detailed written records.",
      "They came from Egypt.",
      "They may have been groups forced to move by the same crisis that affected the states."
     ],
     "explanation": "«The Sea Peoples were as much a symptom of the crisis as its cause» — они могли сами быть следствием кризиса, например переселением из-за голода."
    },
    {
     "text": "Which of the following best summarizes the main point of the passage?",
     "type": "Main Idea",
     "correct": 0,
     "options": [
      "The Bronze Age civilizations of the eastern Mediterranean collapsed, probably because of several connected pressures rather than invaders alone.",
      "The Sea Peoples destroyed the Hittite empire without help.",
      "Writing was invented in Greece after 1200 BCE.",
      "The eastern Mediterranean states rarely traded with one another."
     ],
     "explanation": "Текст о крахе цивилизаций и о том, что причины, видимо, комплексные. D противоречит тексту — торговля была интенсивной."
    },
    {
     "text": "The word \"obscure\" in the passage is closest in meaning to",
     "type": "Vocabulary",
     "correct": 2,
     "options": [
      "violent",
      "distant",
      "unclear",
      "ancient"
     ],
     "explanation": "Obscure origins — неясное, малоизвестное происхождение."
    },
    {
     "text": "The phrase \"these groups\" in the passage refers to",
     "type": "Reference",
     "correct": 3,
     "options": [
      "the Hittites",
      "the Mycenaean Greeks",
      "historians",
      "the Sea Peoples"
     ],
     "explanation": "Предыдущее предложение: «the so-called Sea Peoples, groups of raiders…». О происхождении именно этих групп ничего не известно.",
     "highlight": "these groups",
     "highlight_occurrence": 1
    }
   ],
   "id": "n33"
  },
  {
   "title": "The Intelligence of Octopuses",
   "passage": "Octopuses have long fascinated scientists because they show abilities usually associated with animals that have much larger, more centralized brains. In laboratory studies, octopuses have learned to open screw-top jars, find their way through mazes, and recognize individual human caretakers. Some have even been observed escaping from their tanks at night to raid neighboring tanks for food.\n\nWhat makes these abilities remarkable is how different the octopus nervous system is from ours. An octopus has around 500 million neurons, but about two-thirds of them are located not in its brain but in its eight arms. Each arm can taste, touch, and carry out some movements on its own. When an arm is separated from the body, it may continue to reach for and grasp objects for a short time.\n\nOctopus intelligence is also puzzling from an evolutionary point of view. Most intelligent animals, such as primates, crows, and dolphins, live long lives and learn from parents or group members. Octopuses, by contrast, usually live only one or two years, and most never meet their parents. They must therefore acquire their skills largely through their own trial and error. Their example suggests that complex intelligence can arise through very different evolutionary paths.",
   "questions": [
    {
     "text": "The word \"it\" in the passage refers to",
     "type": "Reference",
     "correct": 0,
     "options": [
      "an arm",
      "the body",
      "the brain",
      "an object"
     ],
     "explanation": "«When an arm is separated from the body, it may continue to reach for and grasp objects» — продолжает двигаться отделённая рука.",
     "highlight": "it",
     "highlight_occurrence": 1
    },
    {
     "text": "According to paragraph 1, octopuses have been observed doing all of the following EXCEPT",
     "type": "Negative Factual",
     "correct": 2,
     "options": [
      "solving mazes",
      "recognizing particular people",
      "using tools to build shelters",
      "opening jars"
     ],
     "explanation": "Банки, лабиринты и узнавание людей в абзаце 1 есть. О постройке укрытий из инструментов не сказано."
    },
    {
     "text": "What can be inferred about how octopuses learn?",
     "type": "Inference",
     "correct": 0,
     "options": [
      "They cannot rely on being taught by older octopuses.",
      "They learn mainly from humans.",
      "They learn faster than primates.",
      "They learn only after their arms are separated."
     ],
     "explanation": "Осьминоги обычно не встречают родителей и учатся «through their own trial and error» — значит, научить их старшие не могут."
    },
    {
     "text": "Which of the following best summarizes the main point of the passage?",
     "type": "Main Idea",
     "correct": 1,
     "options": [
      "An octopus cannot move its arms without its brain.",
      "Octopuses are highly intelligent despite a very unusual nervous system and short, solitary lives.",
      "Octopuses are more intelligent than primates and dolphins.",
      "Octopuses learn most of their skills from their parents."
     ],
     "explanation": "Три абзаца: умные способности, необычная нервная система, неожиданный путь эволюции. C — сравнения в тексте нет, A и D противоречат ему."
    },
    {
     "text": "The word \"raid\" in the passage is closest in meaning to",
     "type": "Vocabulary",
     "correct": 3,
     "options": [
      "clean",
      "decorate",
      "repair",
      "attack and take from"
     ],
     "explanation": "Raid neighboring tanks for food — совершать набег, нападать и забирать еду."
    }
   ],
   "id": "n34"
  },
  {
   "title": "Cognitive Dissonance",
   "passage": "In 1957, the psychologist Leon Festinger introduced the idea of cognitive dissonance, the uncomfortable feeling people experience when they hold two beliefs that conflict, or when their actions contradict their beliefs. According to Festinger, people are strongly motivated to reduce this discomfort, often by changing one of their beliefs rather than their behavior.\n\n[s1] In a famous experiment, Festinger and his colleague James Carlsmith asked students to perform an extremely boring task. [s2] Afterward, each student was paid either one dollar or twenty dollars to tell the next participant that the task had been enjoyable. [s3] Later, when asked how much they had actually enjoyed the task, the students who had received one dollar rated it far more positively than those who had received twenty. [s4] The researchers explained that the well-paid students had a clear reason for lying, while the poorly paid students did not. [s5] To reduce their dissonance, the latter convinced themselves that the task had not been so dull after all.\n\nThe theory helps explain a range of everyday behavior. [sq1] A person who has just bought an expensive car may focus on its good reviews and ignore negative ones. [sq2] Smokers who know the health risks may tell themselves that the danger is exaggerated. [sq3] In each case, people adjust their thinking so that it fits more comfortably with what they have already done. [sq4]",
   "questions": [
    {
     "text": "Identify the sentence in paragraph 2 that presents the surprising result of the experiment.",
     "type": "Select a Sentence",
     "correct": 3,
     "options": [],
     "explanation": "Неожиданный результат: студенты, получившие один доллар, оценили скучное задание гораздо лучше, чем получившие двадцать."
    },
    {
     "text": "Look at the four letters (A, B, C, D) in the passage that indicate where the following sentence could be added to the passage. Where would the sentence best fit?",
     "type": "Insert Text",
     "correct": 1,
     "options": [
      "Position A",
      "Position B",
      "Position C",
      "Position D"
     ],
     "explanation": "«Such a buyer» — покупатель дорогой машины из предложения перед позицией B.",
     "insertSentence": "Such a buyer would find it hard to admit that the money might have been better spent."
    },
    {
     "text": "According to Festinger, how do people often reduce cognitive dissonance?",
     "type": "Factual",
     "correct": 3,
     "options": [
      "By always changing their behavior",
      "By asking others for advice",
      "By refusing to make decisions",
      "By changing one of their beliefs"
     ],
     "explanation": "«Often by changing one of their beliefs rather than their behavior»."
    },
    {
     "text": "Why does the author mention smokers in paragraph 3?",
     "type": "Rhetorical Purpose",
     "correct": 1,
     "options": [
      "To show that dissonance theory does not apply to health",
      "To provide another everyday example of reducing dissonance",
      "To argue that smoking is less dangerous than believed",
      "To describe a second experiment by Festinger"
     ],
     "explanation": "Курильщики, которые говорят себе, что опасность преувеличена, — ещё один бытовой пример из ряда «a range of everyday behavior»."
    },
    {
     "text": "How is the passage organized?",
     "type": "Organization",
     "correct": 3,
     "options": [
      "Two theories are compared, and one is rejected.",
      "A problem is described, and several solutions are evaluated.",
      "Events in a scientist's life are listed in chronological order.",
      "A theory is defined, an experiment supporting it is described, and everyday examples are given."
     ],
     "explanation": "Абзац 1 — определение теории, абзац 2 — эксперимент, абзац 3 — примеры из жизни."
    }
   ],
   "id": "n35"
  },
  {
   "title": "Trade on the Silk Road",
   "passage": "The term \"Silk Road\" refers not to a single route but to a vast network of overland and sea paths that connected China with Central Asia, India, the Middle East, and the Mediterranean world. The network took shape around the second century BCE, when the Han dynasty of China began sending envoys westward, and it remained active for more than a thousand years.\n\n[s1] Although silk gave the network its name, merchants carried a wide variety of goods. [s2] Chinese traders exported silk, porcelain, and tea. [s3] In return, China imported horses, glassware, and precious metals. [s4] Few merchants traveled the entire distance; instead, goods passed through many hands, with each trader covering one section of the journey. [s5] By the time a bolt of silk reached Rome, its price had multiplied many times.\n\nThe Silk Road's most lasting impact may have been the exchange of ideas rather than goods. Buddhism spread from India into China along these routes, and technologies such as papermaking traveled westward from China. Diseases moved along the same paths, however. Many historians believe that the Black Death, which killed a large share of Europe's population in the fourteenth century, reached Europe partly through these trade networks.",
   "questions": [
    {
     "text": "Which of the following best expresses the essential information in the highlighted sentence?",
     "type": "Simplification",
     "correct": 2,
     "options": [
      "Goods were rarely traded because the journey was too long.",
      "Each trader owned a section of the road.",
      "Most merchants traveled only part of the route, passing goods along to other traders.",
      "Merchants traveled the entire route but with many partners."
     ],
     "explanation": "Мало кто проходил весь путь: товар передавался из рук в руки, каждый торговец покрывал свой участок. B понимает «section» как владение.",
     "highlight": "Few merchants traveled the entire distance; instead, goods passed through many hands, with each trader covering one section of the journey.",
     "highlight_occurrence": 1
    },
    {
     "text": "According to paragraph 2, what did China import?",
     "type": "Factual",
     "correct": 0,
     "options": [
      "Horses, glassware, and precious metals",
      "Silk, porcelain, and tea",
      "Paper and printing tools",
      "Spices from Rome"
     ],
     "explanation": "«In return, China imported horses, glassware, and precious metals». Шёлк, фарфор и чай Китай вывозил."
    },
    {
     "text": "Why does the author mention the Black Death in paragraph 3?",
     "type": "Rhetorical Purpose",
     "correct": 2,
     "options": [
      "To argue that trade with China ended in the fourteenth century",
      "To describe how Buddhism reached China",
      "To show that harmful things as well as useful ones spread along the routes",
      "To explain why the Silk Road was created"
     ],
     "explanation": "После «Diseases moved along the same paths, however» чума — пример того, что по путям распространялось и вредное."
    },
    {
     "text": "What is the relationship between paragraph 2 and paragraph 3?",
     "type": "Organization",
     "correct": 0,
     "options": [
      "Paragraph 2 describes the trade in goods, and paragraph 3 describes the exchange of ideas and diseases.",
      "Paragraph 2 describes a problem, and paragraph 3 describes its solution.",
      "Paragraph 2 gives a theory, and paragraph 3 rejects it.",
      "Paragraph 2 describes China, and paragraph 3 describes Rome."
     ],
     "explanation": "Абзац 2 — товары, абзац 3: «the exchange of ideas rather than goods», а также болезни."
    },
    {
     "text": "Identify the sentence in paragraph 2 that explains a consequence of goods passing through many traders.",
     "type": "Select a Sentence",
     "correct": 5,
     "options": [],
     "explanation": "«By the time a bolt of silk reached Rome, its price had multiplied many times» — следствие многократной перепродажи."
    }
   ],
   "id": "n36"
  },
  {
   "title": "The Year Without a Summer",
   "passage": "In April 1815, Mount Tambora on the Indonesian island of Sumbawa erupted in the largest volcanic explosion in recorded history. The eruption killed tens of thousands of people on nearby islands and blasted enormous quantities of ash and sulfur gas high into the atmosphere.\n\nThe effects were felt far beyond Indonesia. [sq1] In the upper atmosphere, the sulfur gas formed a thin layer of tiny droplets that reflected sunlight back into space. [sq2] As a result, average global temperatures fell by about half a degree Celsius over the following year. [sq3] That may sound small, but it was enough to disrupt growing seasons across the Northern Hemisphere. [sq4]\n\nThe year 1816 became known in Europe and North America as \"the year without a summer.\" Snow fell in New England in June, and frosts destroyed crops in July and August. In parts of Europe, cold, rainy weather led to harvest failures, rising food prices, and widespread hunger. Some historians link the crisis to a wave of emigration from Europe to the United States and to the westward movement of farmers within America. At the time, few people connected these hardships to an eruption on the other side of the world; that link was established by scientists only in the twentieth century.",
   "questions": [
    {
     "text": "Look at the four letters (A, B, C, D) in the passage that indicate where the following sentence could be added to the passage. Where would the sentence best fit?",
     "type": "Insert Text",
     "correct": 1,
     "options": [
      "Position A",
      "Position B",
      "Position C",
      "Position D"
     ],
     "explanation": "«The droplets» — капельки, о которых сказано в предложении перед позицией B. Дальше идёт следствие: температура упала на целый год.",
     "insertSentence": "Because the droplets stayed aloft for many months, the cooling effect lasted well beyond the eruption itself."
    },
    {
     "text": "Which of the following best expresses the essential information in the highlighted sentence?",
     "type": "Simplification",
     "correct": 3,
     "options": [
      "People in 1816 blamed the eruption for their hardships.",
      "Scientists in 1816 studied the eruption on the other side of the world.",
      "The hardships were caused by events in the twentieth century.",
      "People at the time did not realize that the eruption caused their problems; scientists discovered this connection much later."
     ],
     "explanation": "Тогда мало кто связывал беды с извержением, а связь установили только в XX веке. A противоречит первой части.",
     "highlight": "At the time, few people connected these hardships to an eruption on the other side of the world; that link was established by scientists only in the twentieth century.",
     "highlight_occurrence": 1
    },
    {
     "text": "The word \"That\" in the passage refers to",
     "type": "Reference",
     "correct": 1,
     "options": [
      "the growing season",
      "a drop in temperature of about half a degree",
      "the eruption of Mount Tambora",
      "the layer of droplets"
     ],
     "explanation": "Предыдущее предложение: температура упала примерно на полградуса. «That may sound small» — это кажется немного.",
     "highlight": "That",
     "highlight_occurrence": 1
    },
    {
     "text": "According to paragraph 3, all of the following happened in 1816 EXCEPT",
     "type": "Negative Factual",
     "correct": 3,
     "options": [
      "snow in New England in June",
      "crop damage from summer frosts",
      "rising food prices in Europe",
      "a second eruption of Mount Tambora"
     ],
     "explanation": "Снег в июне, заморозки летом и рост цен на еду в тексте есть. О втором извержении ничего не сказано."
    },
    {
     "text": "What can be inferred about the emigration mentioned in paragraph 3?",
     "type": "Inference",
     "correct": 1,
     "options": [
      "It was organized by scientists.",
      "Some people may have left Europe in search of better living conditions after the harvest failures.",
      "It was caused directly by the volcanic ash falling on Europe.",
      "It took place before the eruption of Mount Tambora."
     ],
     "explanation": "Историки связывают эмиграцию с кризисом — неурожаем, голодом, ростом цен. Значит, люди уезжали за лучшей жизнью."
    }
   ],
   "id": "n37"
  },
  {
   "title": "How Desert Plants Save Water",
   "passage": "Plants take in carbon dioxide for photosynthesis through tiny pores in their leaves called stomata. The problem is that whenever stomata open to let carbon dioxide in, water vapor escapes. In hot, dry deserts, a plant that keeps its stomata open during the day can lose dangerous amounts of water.\n\nMany desert plants, including cacti and pineapples, have solved this problem with a strategy called crassulacean acid metabolism, or CAM. [sq1] These plants open their stomata only at night, when the air is cooler and more humid, so far less water evaporates. [sq2] They take in carbon dioxide in the dark and store it in their cells as an acid. [sq3] During the day, with their stomata tightly closed, they release the stored carbon dioxide inside the leaf and use it for photosynthesis. [sq4]\n\nThis strategy comes at a cost. Because CAM plants can store only a limited amount of carbon dioxide each night, they usually grow much more slowly than plants in wetter climates. In harsh environments, however, the trade-off is worthwhile: survival matters more than speed. Some CAM plants are flexible, switching to ordinary photosynthesis when water is plentiful and returning to the CAM strategy during dry periods.",
   "questions": [
    {
     "text": "Which of the following best summarizes the main point of the passage?",
     "type": "Main Idea",
     "correct": 2,
     "options": [
      "Desert plants do not need carbon dioxide for photosynthesis.",
      "All plants open their stomata only at night.",
      "Some desert plants save water by taking in carbon dioxide at night, though this slows their growth.",
      "Cacti are the fastest-growing plants in deserts."
     ],
     "explanation": "Проблема потери воды (абзац 1), ночной газообмен CAM (абзац 2), цена — медленный рост (абзац 3)."
    },
    {
     "text": "The word \"flexible\" in the passage is closest in meaning to",
     "type": "Vocabulary",
     "correct": 0,
     "options": [
      "able to adapt",
      "easy to bend",
      "very large",
      "short-lived"
     ],
     "explanation": "Здесь flexible — способный приспосабливаться: растения переключаются между двумя способами фотосинтеза. «Easy to bend» — буквальное значение, не подходит по контексту."
    },
    {
     "text": "Look at the four letters (A, B, C, D) in the passage that indicate where the following sentence could be added to the passage. Where would the sentence best fit?",
     "type": "Insert Text",
     "correct": 3,
     "options": [
      "Position A",
      "Position B",
      "Position C",
      "Position D"
     ],
     "explanation": "«In this way» подводит итог всему процессу: ночью собирает CO₂, днём использует. Поэтому место — после описания дневного этапа, в позиции D.",
     "insertSentence": "In this way, the plant separates the moment it gathers carbon dioxide from the moment it uses it."
    },
    {
     "text": "According to paragraph 2, why do CAM plants open their stomata at night?",
     "type": "Factual",
     "correct": 1,
     "options": [
      "Because they need to release stored acid",
      "Because less water evaporates in cooler, more humid air",
      "Because photosynthesis requires darkness",
      "Because carbon dioxide is only available at night"
     ],
     "explanation": "«At night, when the air is cooler and more humid, so far less water evaporates». Фотосинтез у них идёт днём."
    },
    {
     "text": "Why does the author write that \"survival matters more than speed\"?",
     "type": "Rhetorical Purpose",
     "correct": 3,
     "options": [
      "To argue that CAM plants grow faster than other plants",
      "To describe how quickly cacti reproduce",
      "To criticize plants in wetter climates",
      "To explain why slow growth is an acceptable cost in harsh environments"
     ],
     "explanation": "Фраза объясняет, почему компромисс оправдан: в пустыне выжить важнее, чем быстро расти.",
     "highlight": "survival matters more than speed",
     "highlight_occurrence": 1
    }
   ],
   "id": "n38"
  },
  {
   "title": "The Origin of the Moon",
   "passage": "For centuries, the origin of the Moon puzzled astronomers. Some proposed that the Moon had formed alongside Earth from the same cloud of material. Others suggested that Earth's gravity had captured a passing object. Neither idea could explain all the evidence, particularly after astronauts brought back lunar rocks in the 1960s and 1970s.\n\n[s1] Analysis of these rocks revealed several important clues. [s2] The Moon's rocks have almost exactly the same mix of oxygen isotopes as rocks on Earth, suggesting a shared origin. [s3] Yet the Moon has a very small iron core compared with Earth's. [s4] It also contains very few volatile substances, such as water, which evaporate easily at high temperatures. [s5] These features indicated that the material forming the Moon had once been extremely hot.\n\nToday, most scientists accept the giant impact hypothesis. According to this view, about 4.5 billion years ago a body roughly the size of Mars collided with the young Earth. The impact threw an enormous amount of mostly rocky, outer-layer material into orbit, where it eventually came together to form the Moon. Because the iron-rich cores of the two bodies largely merged into Earth, the Moon ended up with little iron, and the heat of the collision drove off most volatile substances.",
   "questions": [
    {
     "text": "How is the passage organized?",
     "type": "Organization",
     "correct": 1,
     "options": [
      "A series of space missions is described in chronological order.",
      "Earlier explanations are described, evidence is presented, and a theory that accounts for the evidence is explained.",
      "A theory is presented and then shown to be incorrect.",
      "Two objects are compared in order to show that they are unrelated."
     ],
     "explanation": "Абзац 1 — старые гипотезы, абзац 2 — данные по лунным камням, абзац 3 — гипотеза гигантского столкновения, которая их объясняет."
    },
    {
     "text": "Which of the following best expresses the essential information in the highlighted sentence?",
     "type": "Simplification",
     "correct": 0,
     "options": [
      "The Moon has little iron because the cores mostly joined Earth, and it has few volatile substances because the impact's heat removed them.",
      "The Moon's iron core was destroyed by the heat of the collision.",
      "Earth lost most of its iron and water in the collision.",
      "Volatile substances caused the two cores to merge."
     ],
     "explanation": "Две причины и два следствия: ядра слились в Землю → мало железа; жар удара → мало летучих веществ. Остальные варианты путают, что с чем связано.",
     "highlight": "Because the iron-rich cores of the two bodies largely merged into Earth, the Moon ended up with little iron, and the heat of the collision drove off most volatile substances.",
     "highlight_occurrence": 1
    },
    {
     "text": "Identify the sentence in paragraph 2 that presents evidence that the Moon and Earth share an origin.",
     "type": "Select a Sentence",
     "correct": 2,
     "options": [],
     "explanation": "Почти одинаковый изотопный состав кислорода — «suggesting a shared origin»."
    },
    {
     "text": "The word \"It\" in the passage refers to",
     "type": "Reference",
     "correct": 2,
     "options": [
      "the impact",
      "water",
      "the Moon",
      "Earth's core"
     ],
     "explanation": "«Yet the Moon has a very small iron core… It also contains very few volatile substances» — речь о Луне.",
     "highlight": "It",
     "highlight_occurrence": 1
    },
    {
     "text": "According to the passage, all of the following are true of the Moon EXCEPT",
     "type": "Negative Factual",
     "correct": 0,
     "options": [
      "It was captured by Earth's gravity as it passed by.",
      "Its rocks have oxygen isotopes similar to those on Earth.",
      "It has a small iron core.",
      "It contains few volatile substances."
     ],
     "explanation": "Захват гравитацией — одна из старых гипотез, которая не объяснила данные. Остальное в абзаце 2 есть."
    }
   ],
   "id": "n39"
  },
  {
   "title": "The Discovery of Penicillin",
   "passage": "In 1928, the Scottish scientist Alexander Fleming returned from a vacation to his laboratory in London and noticed something unusual. A dish of bacteria he had left on a bench had become contaminated by mold. Around the mold, there was a clear zone where the bacteria had been killed. Fleming identified the mold as Penicillium and called the substance it produced penicillin.\n\nFleming published his findings, but he struggled to purify penicillin in useful amounts. [sq1] The substance was unstable and difficult to extract, and for about a decade little progress was made. [sq2] Then, in the late 1930s, a team at Oxford University led by Howard Florey and Ernst Chain took up the problem. [sq3] They developed methods to produce and purify the drug and, in 1941, treated their first human patient. [sq4]\n\nThe timing proved crucial. During the Second World War, infected wounds killed large numbers of soldiers, and governments urgently needed an effective treatment. With support from the United States, companies developed ways to grow the mold in huge tanks, and production increased enormously. By 1944, penicillin was widely available to Allied troops. Fleming, Florey, and Chain shared the Nobel Prize in 1945. In his acceptance speech, however, Fleming warned that bacteria could become resistant to penicillin if it were misused, a concern that has since proved justified.",
   "questions": [
    {
     "text": "What can be inferred about Fleming's original discovery?",
     "type": "Inference",
     "correct": 2,
     "options": [
      "It was immediately used to treat patients.",
      "It was made at Oxford University.",
      "It was partly the result of an accident.",
      "It was planned as part of a wartime project."
     ],
     "explanation": "Чашку с бактериями случайно загрязнила плесень, пока Флеминг был в отпуске, — открытие отчасти случайное."
    },
    {
     "text": "Which of the following best summarizes the main point of the passage?",
     "type": "Main Idea",
     "correct": 3,
     "options": [
      "Fleming produced large amounts of penicillin by himself in 1928.",
      "Penicillin was first developed to treat soldiers in the First World War.",
      "Bacteria have never become resistant to penicillin.",
      "Penicillin was discovered by chance and became a widely used drug only after others developed ways to produce it."
     ],
     "explanation": "Случайное открытие (абзац 1), трудности и работа оксфордской группы (абзац 2), массовое производство во время войны (абзац 3)."
    },
    {
     "text": "The word \"crucial\" in the passage is closest in meaning to",
     "type": "Vocabulary",
     "correct": 1,
     "options": [
      "difficult",
      "extremely important",
      "unexpected",
      "unfortunate"
     ],
     "explanation": "Crucial — решающий, крайне важный: война как раз потребовала нового лекарства."
    },
    {
     "text": "According to paragraph 3, all of the following contributed to the wide availability of penicillin EXCEPT",
     "type": "Negative Factual",
     "correct": 1,
     "options": [
      "growing the mold in large tanks",
      "a discovery of a new type of mold in 1944",
      "the urgent need to treat infected wounds",
      "support from the United States"
     ],
     "explanation": "Нужда в лечении ран, поддержка США и выращивание плесени в больших чанах — в тексте. О новой плесени в 1944 году не сказано."
    },
    {
     "text": "Look at the four letters (A, B, C, D) in the passage that indicate where the following sentence could be added to the passage. Where would the sentence best fit?",
     "type": "Insert Text",
     "correct": 1,
     "options": [
      "Position A",
      "Position B",
      "Position C",
      "Position D"
     ],
     "explanation": "Предложение продолжает мысль о застое («little progress was made»), а «Then» после позиции B показывает, как ситуацию переломили в Оксфорде.",
     "insertSentence": "Fleming himself eventually turned to other research, and many scientists assumed that penicillin had little practical value."
    }
   ],
   "id": "n40"
  },
  {
   "title": "Wolves Return to Yellowstone",
   "passage": "By the 1920s, gray wolves had been eliminated from Yellowstone National Park in the United States, largely through government programs that treated them as dangerous pests. Without wolves, the population of elk in the park grew rapidly. The elk fed heavily on young willow and aspen trees, especially along rivers, and many of these trees failed to grow to maturity.\n\nIn 1995 and 1996, scientists reintroduced 31 wolves from Canada into the park. The wolves hunted elk, reducing their numbers. Researchers also observed that elk began to avoid areas where they could easily be trapped, such as narrow valleys and riverbanks. In some of these places, willows and aspens began to recover. Taller trees along rivers provided habitat for songbirds and building material for beavers, whose dams in turn created ponds used by fish and amphibians.\n\nThis chain of effects, in which a predator influences plants and other animals through its prey, is known as a trophic cascade. Yellowstone is often presented as a classic example. Some ecologists, however, caution that the story is more complicated than it seems. Other factors, including drought, hunting by humans outside the park, and the return of bears and cougars, also reduced elk numbers, and the recovery of trees has been uneven across the park.",
   "questions": [
    {
     "text": "The word \"whose\" in the passage refers to",
     "type": "Reference",
     "correct": 3,
     "options": [
      "songbirds",
      "trees",
      "rivers",
      "beavers"
     ],
     "explanation": "«Building material for beavers, whose dams…» — плотины строят бобры.",
     "highlight": "whose",
     "highlight_occurrence": 1
    },
    {
     "text": "What can be inferred about elk behavior after wolves returned?",
     "type": "Inference",
     "correct": 3,
     "options": [
      "Elk stopped eating trees entirely.",
      "Elk moved to Canada.",
      "Elk began hunting smaller animals.",
      "Elk spent less time in places where wolves could easily catch them."
     ],
     "explanation": "Олени стали избегать мест, где их легко загнать в ловушку, — то есть тех, где их легче поймать волкам."
    },
    {
     "text": "Which of the following best summarizes the main point of the passage?",
     "type": "Main Idea",
     "correct": 0,
     "options": [
      "Returning wolves to Yellowstone affected elk, plants, and other animals, although other factors also played a role.",
      "Wolves have been eliminated from Yellowstone since the 1920s.",
      "Beavers were responsible for the decline of elk in Yellowstone.",
      "Scientists agree that wolves alone restored the park's trees."
     ],
     "explanation": "Цепочка последствий от волков (абзацы 1–2) и оговорка, что действовали и другие факторы (абзац 3). D противоречит абзацу 3."
    },
    {
     "text": "The word \"uneven\" in the passage is closest in meaning to",
     "type": "Vocabulary",
     "correct": 2,
     "options": [
      "very slow",
      "rough",
      "not the same everywhere",
      "unfair"
     ],
     "explanation": "Recovery… has been uneven across the park — восстановление в разных частях парка шло по-разному."
    },
    {
     "text": "According to paragraph 2, how did taller trees along rivers benefit other species?",
     "type": "Factual",
     "correct": 2,
     "options": [
      "They protected elk from hunters.",
      "They reduced the number of fish.",
      "They provided habitat for songbirds and material for beaver dams.",
      "They provided food for wolves."
     ],
     "explanation": "«Taller trees along rivers provided habitat for songbirds and building material for beavers»."
    }
   ],
   "id": "n41"
  },
  {
   "title": "Vanishing Languages",
   "passage": "Of the roughly 7,000 languages spoken in the world today, linguists estimate that about 40 percent are endangered. Many have only a few hundred speakers, and some have just a handful of elderly speakers left. When the last fluent speaker of a language dies, the language is considered extinct, even if recordings or written descriptions of it survive.\n\n[s1] Languages usually disappear gradually rather than suddenly. [s2] The process often begins when speakers of a smaller language come into close contact with a larger, more powerful community. [s3] Parents may decide that their children will have better opportunities in school and employment if they speak the dominant language. [s4] Over one or two generations, the smaller language comes to be used only at home and then not at all. [s5] In the past, some governments also actively punished children for speaking their native languages in school.\n\nLinguists argue that the loss of a language means more than the loss of words. Languages contain detailed knowledge about local plants, animals, and landscapes, as well as unique ways of expressing time, space, and relationships. In recent decades, many communities have launched revival programs, such as language nests in which young children are cared for entirely in an endangered language. The success of efforts to revive Hebrew and the Maori language of New Zealand shows that decline can be reversed when a community is strongly committed.",
   "questions": [
    {
     "text": "Identify the sentence in paragraph 2 that explains why parents may stop passing on a smaller language.",
     "type": "Select a Sentence",
     "correct": 3,
     "options": [],
     "explanation": "Родители считают, что у детей будет больше возможностей в школе и на работе, если они будут говорить на доминирующем языке."
    },
    {
     "text": "Why does the author mention Hebrew and the Maori language?",
     "type": "Rhetorical Purpose",
     "correct": 0,
     "options": [
      "To give examples showing that language decline can be reversed",
      "To list languages that have become extinct",
      "To explain why governments punished children",
      "To describe the languages with the most speakers"
     ],
     "explanation": "Иврит и маори приведены как успешное возрождение: «decline can be reversed»."
    },
    {
     "text": "What is the relationship between paragraph 2 and paragraph 3?",
     "type": "Organization",
     "correct": 2,
     "options": [
      "Paragraph 2 gives statistics, and paragraph 3 questions them.",
      "Paragraph 2 describes one language, and paragraph 3 describes another.",
      "Paragraph 2 explains how languages disappear, and paragraph 3 explains why this matters and how it can be addressed.",
      "Paragraph 2 presents a solution, and paragraph 3 presents the problem."
     ],
     "explanation": "Абзац 2 — как языки исчезают. Абзац 3 — почему это важно и программы возрождения."
    },
    {
     "text": "Which of the following best expresses the essential information in the highlighted sentence?",
     "type": "Simplification",
     "correct": 1,
     "options": [
      "Elderly speakers often refuse to be recorded.",
      "A language is extinct once its last fluent speaker dies, even if records of it remain.",
      "Recordings can keep a language alive after its speakers die.",
      "A language becomes extinct when no recordings of it exist."
     ],
     "explanation": "Язык мёртв со смертью последнего носителя, даже если остались записи. C и D противоречат «even if recordings… survive».",
     "highlight": "When the last fluent speaker of a language dies, the language is considered extinct, even if recordings or written descriptions of it survive.",
     "highlight_occurrence": 1
    },
    {
     "text": "The phrase \"the dominant language\" in the passage refers to the language of",
     "type": "Reference",
     "correct": 0,
     "options": [
      "a larger, more powerful community",
      "elderly speakers",
      "linguists",
      "language nests"
     ],
     "explanation": "Доминирующий язык — язык «a larger, more powerful community», с которым соприкасаются носители малого языка.",
     "highlight": "the dominant language",
     "highlight_occurrence": 1
    }
   ],
   "id": "n42"
  },
  {
   "title": "Microplastics",
   "passage": "Microplastics are pieces of plastic smaller than five millimeters, about the size of a sesame seed or smaller. Some are manufactured at this size, such as the tiny beads once common in face washes and toothpaste. Most, however, form when larger plastic objects, from bottles to fishing nets, are broken down by sunlight, waves, and friction.\n\n[s1] Microplastics have now been found almost everywhere scientists have looked. [s2] They occur in the deepest ocean trenches, in Arctic sea ice, and in snow on remote mountain peaks. [s3] They have been detected in drinking water, table salt, and seafood. [s4] Washing synthetic clothing releases thousands of plastic fibers in a single load of laundry, many of which pass through treatment plants into rivers and the sea. [s5] Even the air in cities contains microplastic particles carried by the wind.\n\nThe effects of microplastics on living things are still being studied. Laboratory experiments show that small marine animals can mistake them for food, which may reduce their growth and ability to reproduce. Whether the amounts humans take in are harmful remains unclear, partly because the particles vary so much in size, shape, and chemical makeup. Several countries have banned plastic microbeads in cosmetics, and engineers are developing filters for washing machines, but researchers emphasize that reducing plastic waste overall is the most effective solution.",
   "questions": [
    {
     "text": "According to paragraph 1, how do most microplastics form?",
     "type": "Factual",
     "correct": 3,
     "options": [
      "Factories manufacture them as beads.",
      "Fishing nets release them when new.",
      "Plants absorb plastic from the soil.",
      "Larger plastic objects break down into smaller pieces."
     ],
     "explanation": "«Most, however, form when larger plastic objects… are broken down by sunlight, waves, and friction». Бусины специально делают лишь некоторые."
    },
    {
     "text": "Why does the author mention \"the deepest ocean trenches\" and \"snow on remote mountain peaks\"?",
     "type": "Rhetorical Purpose",
     "correct": 1,
     "options": [
      "To show where scientists live and work",
      "To emphasize how widely microplastics have spread",
      "To explain where microplastics are produced",
      "To compare pollution in oceans and mountains"
     ],
     "explanation": "Самые удалённые места приведены как подтверждение мысли «found almost everywhere».",
     "highlight": "the deepest ocean trenches",
     "highlight_occurrence": 1
    },
    {
     "text": "How is paragraph 3 related to paragraph 2?",
     "type": "Organization",
     "correct": 3,
     "options": [
      "Paragraph 2 describes the effects of microplastics, and paragraph 3 describes their causes.",
      "Paragraph 2 makes a claim, and paragraph 3 proves it false.",
      "Paragraph 2 lists solutions, and paragraph 3 evaluates them.",
      "Paragraph 2 describes where microplastics are found, and paragraph 3 discusses their effects and responses to them."
     ],
     "explanation": "Абзац 2 — где находят микропластик, абзац 3 — что о его вреде известно и что делают."
    },
    {
     "text": "Which of the following best expresses the essential information in the highlighted sentence?",
     "type": "Simplification",
     "correct": 2,
     "options": [
      "Humans take in only one type of microplastic.",
      "Scientists have proven that small particles are the most harmful.",
      "It is not yet known whether microplastics harm humans, in part because the particles differ so much.",
      "Microplastics are harmless to humans because they vary in size."
     ],
     "explanation": "Пока неясно, вредны ли микропластики для людей, отчасти потому что частицы очень разные. B и D утверждают то, что не установлено.",
     "highlight": "Whether the amounts humans take in are harmful remains unclear, partly because the particles vary so much in size, shape, and chemical makeup.",
     "highlight_occurrence": 1
    },
    {
     "text": "Identify the sentence in paragraph 2 that describes an everyday household source of microplastics.",
     "type": "Select a Sentence",
     "correct": 4,
     "options": [],
     "explanation": "Стирка синтетической одежды выпускает тысячи пластиковых волокон за одну загрузку."
    }
   ],
   "id": "n43"
  },
  {
   "title": "Building Stonehenge",
   "passage": "Stonehenge, the ancient stone circle on Salisbury Plain in southern England, was built in several stages over more than a thousand years, beginning around 3000 BCE. Its most famous features are the huge sarsen stones, some weighing more than 25 tons, which stand in a ring topped by horizontal stones. Smaller \"bluestones,\" weighing two to five tons each, were arranged among them.\n\nThe origin of the stones has long fascinated researchers. Chemical analysis has shown that most of the sarsens came from an area about 25 kilometers north of the monument. The bluestones, remarkably, were brought from the Preseli Hills in Wales, roughly 225 kilometers away. [sq1] How they were moved remains uncertain. [sq2] Most researchers believe the stones were dragged on wooden sledges, perhaps over rollers or greased tracks, by large teams of people. [sq3] Experiments have shown that a few dozen people can move a multi-ton stone this way. [sq4]\n\nThe purpose of Stonehenge is also debated. The monument is aligned with the sunrise at the summer solstice and the sunset at the winter solstice, suggesting that it marked important points in the yearly calendar. Human remains buried at the site indicate that it also served as a cemetery. Nearby, archaeologists have uncovered a large settlement where people may have gathered for feasts, possibly during midwinter celebrations.",
   "questions": [
    {
     "text": "Look at the four letters (A, B, C, D) in the passage that indicate where the following sentence could be added to the passage. Where would the sentence best fit?",
     "type": "Insert Text",
     "correct": 1,
     "options": [
      "Position A",
      "Position B",
      "Position C",
      "Position D"
     ],
     "explanation": "Предложение говорит о другой версии того, как перемещали камни. Оно должно идти после «How they were moved remains uncertain» и перед общепринятым мнением — это позиция B.",
     "insertSentence": "An earlier theory that glaciers had carried the bluestones most of the way has found little support in recent studies."
    },
    {
     "text": "According to paragraph 3, all of the following are suggested purposes of Stonehenge EXCEPT",
     "type": "Negative Factual",
     "correct": 2,
     "options": [
      "serving as a burial site",
      "a place for gatherings and feasts",
      "a defensive fortress",
      "marking the solstices"
     ],
     "explanation": "Солнцестояния, кладбище и пиры в абзаце 3 есть. Об оборонительном сооружении не сказано."
    },
    {
     "text": "What can be inferred about the builders of Stonehenge?",
     "type": "Inference",
     "correct": 0,
     "options": [
      "They were able to organize large groups of people to work together.",
      "They used machines powered by animals.",
      "They built the monument in a single year.",
      "They lived in Wales."
     ],
     "explanation": "Камни тащили «by large teams of people», а строительство шло больше тысячи лет. Значит, умели организовывать большие группы."
    },
    {
     "text": "Which of the following best summarizes the main point of the passage?",
     "type": "Main Idea",
     "correct": 1,
     "options": [
      "Stonehenge was used only as a calendar.",
      "Stonehenge was built over a long period from stones brought great distances, and its purposes remain debated.",
      "Stonehenge was built by a single generation in 3000 BCE.",
      "All the stones at Stonehenge came from nearby fields."
     ],
     "explanation": "Строительство и камни (абзацы 1–2), спор о назначении (абзац 3). A противоречит тексту: было и кладбище."
    },
    {
     "text": "The word \"remarkably\" in the passage is closest in meaning to",
     "type": "Vocabulary",
     "correct": 3,
     "options": [
      "carefully",
      "slowly",
      "recently",
      "surprisingly"
     ],
     "explanation": "Remarkably — удивительно, поразительно: голубые камни привезли за 225 км."
    }
   ],
   "id": "n44"
  },
  {
   "title": "The Science of Hibernation",
   "passage": "When winter food supplies run short, some mammals survive by hibernating. During hibernation, an animal's body temperature drops dramatically, in some species to just a few degrees above freezing. Its heart rate and breathing slow down, and its metabolism, the rate at which it uses energy, can fall to less than five percent of normal.\n\nHibernation is not one long, continuous sleep. [sq1] Small hibernators such as ground squirrels periodically warm themselves back up to normal temperature for less than a day before cooling down again. [sq2] These arousals use a large share of the animal's stored energy, and scientists are still not sure why they occur. [sq3] One hypothesis is that the animals need to restore functions, such as immune defenses, that cannot operate at very low temperatures. [sq4]\n\nBears are a special case. Their body temperature drops only a few degrees, and they can wake relatively quickly if disturbed. For this reason, some scientists once argued that bears do not truly hibernate. Today, most researchers include them, because bears reduce their metabolism dramatically and can go months without eating, drinking, or eliminating waste. Remarkably, they lose little muscle or bone strength during this period, which has made them a subject of interest for medical researchers studying patients confined to bed for long periods.",
   "questions": [
    {
     "text": "Look at the four letters (A, B, C, D) in the passage that indicate where the following sentence could be added to the passage. Where would the sentence best fit?",
     "type": "Insert Text",
     "correct": 3,
     "options": [
      "Position A",
      "Position B",
      "Position C",
      "Position D"
     ],
     "explanation": "«Such breaks» — периодические пробуждения, а «these functions» — функции вроде иммунной защиты, названные прямо перед позицией D.",
     "insertSentence": "Without such breaks, these functions might fail, leaving the animal vulnerable to disease."
    },
    {
     "text": "According to paragraph 1, what happens to an animal's metabolism during hibernation?",
     "type": "Factual",
     "correct": 0,
     "options": [
      "It falls to a small fraction of its normal rate.",
      "It increases to produce heat.",
      "It stays the same.",
      "It stops completely."
     ],
     "explanation": "«Metabolism… can fall to less than five percent of normal» — снижается до малой доли, но не останавливается."
    },
    {
     "text": "Why does the author mention \"medical researchers studying patients confined to bed\"?",
     "type": "Rhetorical Purpose",
     "correct": 2,
     "options": [
      "To explain why bears wake when disturbed",
      "To argue that humans can hibernate",
      "To show that bears' ability to avoid muscle and bone loss may be useful to medicine",
      "To compare bears with ground squirrels"
     ],
     "explanation": "Медики интересуются тем, как медведи не теряют мышцы и кости за месяцы неподвижности.",
     "highlight": "medical researchers studying patients confined to bed",
     "highlight_occurrence": 1
    },
    {
     "text": "How does paragraph 3 relate to the rest of the passage?",
     "type": "Organization",
     "correct": 0,
     "options": [
      "It discusses an animal whose hibernation differs from the pattern described earlier.",
      "It describes the history of research on ground squirrels.",
      "It summarizes the main points of paragraphs 1 and 2.",
      "It presents evidence that hibernation does not exist."
     ],
     "explanation": "«Bears are a special case» — у медведей температура падает лишь на несколько градусов, это отличается от описанного ранее."
    },
    {
     "text": "Which of the following best expresses the essential information in the highlighted sentence?",
     "type": "Simplification",
     "correct": 3,
     "options": [
      "Researchers no longer study bear hibernation.",
      "Bears hibernate only when they cannot find water.",
      "Most researchers believe bears are not true hibernators.",
      "Most researchers now count bears as hibernators because their metabolism drops greatly and they can go months without eating or drinking."
     ],
     "explanation": "Сейчас медведей относят к впадающим в спячку из-за резкого снижения обмена веществ и месяцев без еды и воды. C противоречит «most researchers include them».",
     "highlight": "Today, most researchers include them, because bears reduce their metabolism dramatically and can go months without eating, drinking, or eliminating waste.",
     "highlight_occurrence": 1
    }
   ],
   "id": "n45"
  },
  {
   "title": "How Memories Can Be Changed",
   "passage": "Many people think of memory as a kind of video recording that stores events exactly as they happened. Research in psychology has shown, however, that memories are reconstructed each time they are recalled, and that they can change in the process.\n\n[s1] In a well-known series of studies in the 1970s, psychologist Elizabeth Loftus showed participants films of car accidents. [s2] Afterward, she asked them how fast the cars were going when they \"hit\" each other, but for some participants she replaced \"hit\" with \"smashed.\" [s3] Those who heard \"smashed\" gave higher speed estimates. [s4] A week later, they were also more likely to report seeing broken glass, even though there was none in the film. [s5] A single word in a question had altered what people believed they had seen.\n\nLater research found that it is even possible to create memories of events that never occurred. In some experiments, participants who were repeatedly asked about a made-up childhood event, such as being lost in a shopping mall, eventually described it in detail. These findings have important consequences for the legal system, where eyewitness testimony can decide a case. As a result, some police departments have changed how they question witnesses, avoiding leading questions that suggest particular answers.",
   "questions": [
    {
     "text": "Identify the sentence in paragraph 2 that describes a false detail that participants remembered.",
     "type": "Select a Sentence",
     "correct": 4,
     "options": [],
     "explanation": "Участники вспоминали разбитое стекло, «even though there was none in the film» — ложная деталь."
    },
    {
     "text": "The word \"they\" in the passage refers to",
     "type": "Reference",
     "correct": 1,
     "options": [
      "psychologists",
      "the cars",
      "participants",
      "films"
     ],
     "explanation": "«How fast the cars were going when they \"hit\" each other» — сталкивались машины.",
     "highlight": "they",
     "highlight_occurrence": 4
    },
    {
     "text": "According to the passage, all of the following are true about memory EXCEPT",
     "type": "Negative Factual",
     "correct": 3,
     "options": [
      "Memories are rebuilt when they are recalled.",
      "The wording of a question can change what people remember.",
      "People can come to remember events that never happened.",
      "Memories are stored exactly like video recordings."
     ],
     "explanation": "Именно это мнение текст опровергает: «Many people think of memory as a kind of video recording… however»."
    },
    {
     "text": "What can be inferred about leading questions?",
     "type": "Inference",
     "correct": 1,
     "options": [
      "They were invented by Loftus.",
      "They can affect what witnesses remember.",
      "They help witnesses remember more accurately.",
      "They are required in court."
     ],
     "explanation": "Полиция стала избегать наводящих вопросов как раз потому, что формулировка может изменить воспоминания свидетеля."
    },
    {
     "text": "Which of the following best summarizes the main point of the passage?",
     "type": "Main Idea",
     "correct": 2,
     "options": [
      "Elizabeth Loftus studied how cars are designed.",
      "Police departments no longer use eyewitnesses.",
      "Research shows that memories can be altered or even created, which has implications for eyewitness testimony.",
      "Memories of car accidents are always accurate."
     ],
     "explanation": "Память изменчива (абзацы 1–2), можно создать ложные воспоминания, это важно для показаний свидетелей (абзац 3)."
    }
   ],
   "id": "n46"
  },
  {
   "title": "Printing Buildings",
   "passage": "Three-dimensional printing, which builds objects layer by layer from a digital design, was first used to make small plastic parts. In recent years, engineers have scaled the technology up to construct entire houses. Large printers move along rails or robotic arms, squeezing out a thick concrete mixture that hardens quickly, building walls one layer at a time.\n\nSupporters point to several advantages. [sq1] A printer can produce the walls of a small house in a few days, much faster than traditional methods. [sq2] Because material is placed only where it is needed, less is wasted. [sq3] Printed walls can also take curved or unusual shapes that would be expensive to build by hand. [sq4] Some organizations hope that the technology can help provide affordable housing in regions facing shortages.\n\nSignificant hurdles remain, however. Printers generally build only the walls; roofs, windows, plumbing, and electrical systems must still be installed by workers. Building codes in many countries were written for conventional construction and do not yet cover printed structures, which can slow approval. Engineers also continue to test how printed concrete performs over decades, particularly in extreme heat, cold, or earthquakes.",
   "questions": [
    {
     "text": "The word \"hurdles\" in the passage is closest in meaning to",
     "type": "Vocabulary",
     "correct": 0,
     "options": [
      "obstacles",
      "benefits",
      "experiments",
      "regulations"
     ],
     "explanation": "Hurdles — препятствия, трудности. Дальше перечислены именно проблемы."
    },
    {
     "text": "According to paragraph 2, all of the following are advantages of 3D-printed houses EXCEPT",
     "type": "Negative Factual",
     "correct": 0,
     "options": [
      "automatic installation of plumbing",
      "faster construction",
      "less wasted material",
      "the ability to create curved walls"
     ],
     "explanation": "Скорость, меньше отходов и изогнутые стены — плюсы из абзаца 2. Трубы, наоборот, ставят рабочие (абзац 3)."
    },
    {
     "text": "What can be inferred about building codes from paragraph 3?",
     "type": "Inference",
     "correct": 2,
     "options": [
      "They were written specifically for 3D printing.",
      "They require houses to have curved walls.",
      "They may need to be updated before printed houses become common.",
      "They forbid the use of concrete."
     ],
     "explanation": "Нормы написаны для обычного строительства и не охватывают печатные дома, это тормозит одобрение. Значит, их, вероятно, придётся обновлять."
    },
    {
     "text": "Which of the following best summarizes the main point of the passage?",
     "type": "Main Idea",
     "correct": 3,
     "options": [
      "3D printers can now build complete houses without any human workers.",
      "3D printing was invented to solve housing shortages.",
      "Printed concrete has been proven to last for centuries.",
      "3D printing can build house walls quickly and cheaply, but several practical problems still limit its use."
     ],
     "explanation": "Плюсы (абзац 2) и препятствия (абзац 3). A противоречит тексту: крышу и коммуникации ставят люди."
    },
    {
     "text": "Look at the four letters (A, B, C, D) in the passage that indicate where the following sentence could be added to the passage. Where would the sentence best fit?",
     "type": "Insert Text",
     "correct": 0,
     "options": [
      "Position A",
      "Position B",
      "Position C",
      "Position D"
     ],
     "explanation": "«For example… in less than a day» — пример к мысли о скорости печати. Эта мысль идёт сразу после позиции A.",
     "insertSentence": "One project in Mexico, for example, printed the walls of a 46-square-meter home in less than a day."
    }
   ],
   "id": "n47"
  },
  {
   "title": "Visitors from the Outer Solar System",
   "passage": "Comets are often described as dirty snowballs: lumps of ice mixed with dust and rock, usually only a few kilometers across. They spend most of their time in the cold outer regions of the solar system. Some come from the Kuiper Belt beyond Neptune, while others are thought to originate in the Oort Cloud, a vast, distant shell of icy bodies that may extend a third of the way to the nearest star.\n\nWhen a comet's orbit brings it close to the Sun, it changes dramatically. Heat causes the ice to turn directly into gas, releasing dust as well. The gas and dust form a glowing cloud around the comet's center, called the coma, and are pushed away by sunlight and the solar wind into long tails. These tails always point away from the Sun, regardless of the direction in which the comet is moving.\n\nComets interest scientists because they have changed little since the solar system formed about 4.6 billion years ago. Studying them can reveal what the early solar system was made of. Some researchers have even proposed that comets striking the young Earth delivered part of its water. In 2014, the European spacecraft Rosetta became the first to orbit a comet and land a probe on its surface, collecting valuable data on its composition.",
   "questions": [
    {
     "text": "The word \"They\" in the passage refers to",
     "type": "Reference",
     "correct": 2,
     "options": [
      "rocks",
      "the outer regions",
      "comets",
      "lumps of ice"
     ],
     "explanation": "«Comets are often described… They spend most of their time in the cold outer regions» — о кометах.",
     "highlight": "They",
     "highlight_occurrence": 1
    },
    {
     "text": "The word \"vast\" in the passage is closest in meaning to",
     "type": "Vocabulary",
     "correct": 1,
     "options": [
      "ancient",
      "enormous",
      "frozen",
      "dark"
     ],
     "explanation": "«A vast, distant shell» — огромная оболочка: облако Оорта тянется на треть пути до ближайшей звезды."
    },
    {
     "text": "According to paragraph 2, what causes a comet's ice to turn into gas?",
     "type": "Factual",
     "correct": 1,
     "options": [
      "The comet's rotation",
      "Heat from the Sun",
      "Collisions with planets",
      "The solar wind"
     ],
     "explanation": "«Heat causes the ice to turn directly into gas». Солнечный ветер отталкивает газ в хвост, но не испаряет лёд."
    },
    {
     "text": "Why does the author mention that comets \"have changed little since the solar system formed\"?",
     "type": "Rhetorical Purpose",
     "correct": 3,
     "options": [
      "To show that comets are very small",
      "To describe how comet tails are formed",
      "To argue that comets are dangerous to Earth",
      "To explain why comets are useful for learning about the early solar system"
     ],
     "explanation": "Следующее предложение: изучение комет показывает, из чего состояла ранняя Солнечная система.",
     "highlight": "have changed little since the solar system formed",
     "highlight_occurrence": 1
    },
    {
     "text": "How is the passage organized?",
     "type": "Organization",
     "correct": 1,
     "options": [
      "It presents a problem caused by comets and proposes solutions.",
      "It describes what comets are, how they change near the Sun, and why scientists study them.",
      "It compares comets with asteroids and concludes that they are identical.",
      "It traces the history of comet observation from ancient times."
     ],
     "explanation": "Абзац 1 — что такое кометы, абзац 2 — что происходит у Солнца, абзац 3 — зачем их изучают."
    }
   ],
   "id": "n48"
  },
  {
   "title": "Gothic Cathedrals",
   "passage": "Beginning in the twelfth century in northern France, builders developed a new architectural style later called Gothic. Earlier Romanesque churches had thick walls and small windows, because the walls had to support the heavy stone roofs. Gothic cathedrals, by contrast, seemed to rise toward the sky, with soaring ceilings and walls filled with stained glass.\n\n[s1] Several structural innovations made this possible. [s2] The pointed arch directed the weight of the roof downward more efficiently than the rounded arch used earlier. [s3] Ribbed vaults, a framework of stone ribs supporting the ceiling, concentrated the weight onto a few points rather than spreading it along the entire wall. [s4] Most important were flying buttresses, arched supports built outside the walls that carried the outward push of the roof down to the ground. [s5] With the walls no longer bearing so much weight, builders could replace large sections of stone with glass.\n\nThe results transformed the experience of entering a church. Colored light streamed through windows that often told stories from the Bible to a largely illiterate population. Building a cathedral, however, was an enormous undertaking that could take more than a century, and some were never finished. Occasionally, ambitious designs exceeded what the structures could bear: part of the cathedral at Beauvais, which had the tallest choir ever built, collapsed in 1284.",
   "questions": [
    {
     "text": "Identify the sentence in paragraph 2 that describes the feature the author considers the most significant.",
     "type": "Select a Sentence",
     "correct": 4,
     "options": [],
     "explanation": "«Most important were flying buttresses» — автор прямо называет аркбутаны самым важным."
    },
    {
     "text": "Which of the following best expresses the essential information in the highlighted sentence?",
     "type": "Simplification",
     "correct": 0,
     "options": [
      "Because the walls carried less weight, builders could use more glass in place of stone.",
      "Builders used glass because stone had become too expensive.",
      "Glass walls were stronger than stone walls.",
      "The weight of the glass replaced the weight of the roof."
     ],
     "explanation": "Стены почти не держали вес → можно было заменить большие участки камня стеклом. C и D искажают логику.",
     "highlight": "With the walls no longer bearing so much weight, builders could replace large sections of stone with glass.",
     "highlight_occurrence": 1
    },
    {
     "text": "The word \"which\" in the passage refers to",
     "type": "Reference",
     "correct": 3,
     "options": [
      "the choir",
      "the structure",
      "the design",
      "the cathedral at Beauvais"
     ],
     "explanation": "«The cathedral at Beauvais, which had the tallest choir ever built» — самый высокий хор был у собора в Бове.",
     "highlight": "which",
     "highlight_occurrence": 1
    },
    {
     "text": "According to the passage, all of the following were features of Gothic cathedrals EXCEPT",
     "type": "Negative Factual",
     "correct": 1,
     "options": [
      "flying buttresses",
      "thick walls with small windows",
      "pointed arches",
      "ribbed vaults"
     ],
     "explanation": "Толстые стены с маленькими окнами — признак романских церквей, с которыми готику сравнивают."
    },
    {
     "text": "What can be inferred about the stained glass windows from paragraph 3?",
     "type": "Inference",
     "correct": 3,
     "options": [
      "They were installed only in unfinished cathedrals.",
      "They caused the collapse at Beauvais.",
      "They were cheaper than stone.",
      "They helped people who could not read learn religious stories."
     ],
     "explanation": "Витражи рассказывали библейские истории «to a largely illiterate population» — то есть людям, не умевшим читать."
    }
   ],
   "id": "n49"
  },
  {
   "title": "The Tragedy of the Commons",
   "passage": "In 1968, the ecologist Garrett Hardin published an influential essay titled \"The Tragedy of the Commons.\" He asked readers to imagine a pasture open to all herders. Each herder benefits from adding another animal to the pasture, while the cost of overgrazing is shared by everyone. As a result, each individual has a reason to keep adding animals, until the pasture is ruined for all.\n\n[s1] Hardin argued that the same logic applies to many shared resources. [s2] Fisheries, groundwater, and the atmosphere can all be overused when no one owns them and no one limits their use. [s3] He concluded that shared resources must be either divided into private property or controlled by government regulation. [s4] Otherwise, he believed, their destruction was almost inevitable.\n\nThe political scientist Elinor Ostrom challenged this conclusion. Studying communities around the world, from Swiss mountain villages to fishing groups in Turkey, she found that many had managed shared resources successfully for centuries without privatization or outside control. These communities developed their own rules, monitored one another, and applied penalties to those who broke the rules. For this work, Ostrom became the first woman to receive the Nobel Prize in economics, in 2009. Her research suggests that the \"tragedy\" is a real risk but not an unavoidable fate.",
   "questions": [
    {
     "text": "According to paragraph 1, why does each herder keep adding animals?",
     "type": "Factual",
     "correct": 2,
     "options": [
      "The pasture becomes larger over time.",
      "Herders want to destroy the pasture.",
      "Each herder gains from an extra animal while the cost is shared by all.",
      "The government pays herders for each animal."
     ],
     "explanation": "«Each herder benefits from adding another animal… while the cost of overgrazing is shared by everyone»."
    },
    {
     "text": "Why does the author mention \"Swiss mountain villages\" and \"fishing groups in Turkey\"?",
     "type": "Rhetorical Purpose",
     "correct": 0,
     "options": [
      "To give examples of communities that managed shared resources successfully",
      "To show where overgrazing was most severe",
      "To support Hardin's argument for privatization",
      "To describe places Hardin studied"
     ],
     "explanation": "Это примеры сообществ из исследований Остром, которые веками успешно управляли общими ресурсами.",
     "highlight": "Swiss mountain villages",
     "highlight_occurrence": 1
    },
    {
     "text": "What is the relationship between paragraph 2 and paragraph 3?",
     "type": "Organization",
     "correct": 2,
     "options": [
      "Paragraph 2 gives examples, and paragraph 3 summarizes Hardin's essay.",
      "Paragraph 2 criticizes Ostrom, and paragraph 3 defends her.",
      "Paragraph 2 presents Hardin's conclusion, and paragraph 3 presents research that challenges it.",
      "Paragraph 2 describes a problem, and paragraph 3 shows that it does not exist."
     ],
     "explanation": "Абзац 2 — вывод Хардина. Абзац 3: «Elinor Ostrom challenged this conclusion». Проблема при этом реальна («a real risk»), так что D неверно."
    },
    {
     "text": "Which of the following best expresses the essential information in the highlighted sentence?",
     "type": "Simplification",
     "correct": 1,
     "options": [
      "Ostrom's research was more dramatic than Hardin's.",
      "Ostrom's work shows that overuse of shared resources can happen but can also be prevented.",
      "Ostrom proved that shared resources are never overused.",
      "Ostrom believed the destruction of shared resources is unavoidable."
     ],
     "explanation": "«A real risk but not an unavoidable fate» — опасность реальна, но не неизбежна. C и D — две крайности.",
     "highlight": "Her research suggests that the \"tragedy\" is a real risk but not an unavoidable fate.",
     "highlight_occurrence": 1
    },
    {
     "text": "Identify the sentence in paragraph 2 that states the solution Hardin proposed.",
     "type": "Select a Sentence",
     "correct": 3,
     "options": [],
     "explanation": "«Shared resources must be either divided into private property or controlled by government regulation» — решение Хардина."
    }
   ],
   "id": "n50"
  },
  {
   "title": "The Ogallala Aquifer",
   "passage": "Beneath the Great Plains of the United States lies the Ogallala Aquifer, one of the largest underground stores of fresh water in the world. It stretches across parts of eight states, from South Dakota to Texas, and much of its water accumulated thousands of years ago, at the end of the last ice age.\n\nThe aquifer transformed the region. [sq1] For much of its history, the dry plains supported mainly grassland and cattle ranching. [sq2] In the mid-twentieth century, powerful pumps and center-pivot irrigation systems, long rotating pipes that spray water over circular fields, allowed farmers to draw water from deep underground. [sq3] The Great Plains became one of the most productive agricultural regions on Earth, growing corn, wheat, and cotton. [sq4]\n\nThis success has come at a price. In many areas, farmers are pumping water far faster than rain and snow can replenish it. In parts of Kansas and Texas, water levels have dropped by more than 30 meters, and some wells have already run dry. Because the aquifer refills so slowly, scientists warn that large portions of it could be effectively exhausted within decades. Some communities have responded by limiting pumping, adopting more efficient irrigation, and switching to crops that require less water.",
   "questions": [
    {
     "text": "Look at the four letters (A, B, C, D) in the passage that indicate where the following sentence could be added to the passage. Where would the sentence best fit?",
     "type": "Insert Text",
     "correct": 2,
     "options": [
      "Position A",
      "Position B",
      "Position C",
      "Position D"
     ],
     "explanation": "«The result» — следствие работы круговых дождевальных установок, которые описаны прямо перед позицией C («circular fields»).",
     "insertSentence": "From above, the result is a striking pattern of green circles visible from airplanes."
    },
    {
     "text": "Which of the following best summarizes the main point of the passage?",
     "type": "Main Idea",
     "correct": 0,
     "options": [
      "The Ogallala Aquifer made the Great Plains highly productive, but overuse now threatens its supply.",
      "The Ogallala Aquifer is refilled quickly by rain each year.",
      "Farmers on the Great Plains have stopped using irrigation.",
      "Cattle ranching is the main use of the aquifer today."
     ],
     "explanation": "Водоносный горизонт сделал регион плодородным (абзац 2), но его выкачивают слишком быстро (абзац 3). B противоречит тексту."
    },
    {
     "text": "The word \"replenish\" in the passage is closest in meaning to",
     "type": "Vocabulary",
     "correct": 2,
     "options": [
      "measure",
      "protect",
      "refill",
      "pollute"
     ],
     "explanation": "Replenish — пополнять: дожди и снег не успевают восполнить воду."
    },
    {
     "text": "According to paragraph 2, what allowed farmers to use the aquifer's water?",
     "type": "Factual",
     "correct": 3,
     "options": [
      "Rivers flowing from the mountains",
      "Rainwater collected in ponds",
      "Melting snow from the last ice age",
      "Powerful pumps and center-pivot irrigation"
     ],
     "explanation": "«Powerful pumps and center-pivot irrigation systems… allowed farmers to draw water from deep underground»."
    },
    {
     "text": "Why does the author mention that water levels in some areas \"have dropped by more than 30 meters\"?",
     "type": "Rhetorical Purpose",
     "correct": 1,
     "options": [
      "To argue that pumping has increased water supplies",
      "To illustrate how severely the aquifer has been depleted",
      "To show how deep the first wells were",
      "To explain how the aquifer formed"
     ],
     "explanation": "Цифра иллюстрирует мысль абзаца 3: воду выкачивают гораздо быстрее, чем она восполняется.",
     "highlight": "have dropped by more than 30 meters",
     "highlight_occurrence": 1
    }
   ],
   "id": "n51"
  },
  {
   "title": "Farming Ants",
   "passage": "Humans began farming about 12,000 years ago, but some ants have been cultivating crops for tens of millions of years. Leafcutter ants of Central and South America are the best-known example. Columns of workers cut pieces of leaves and carry them back to underground nests, sometimes over distances of more than 100 meters.\n\n[s1] Surprisingly, the ants do not eat the leaves. [s2] Instead, they chew them into a paste and use it to grow a fungus in special chambers. [s3] The fungus breaks down the tough plant material, which the ants cannot digest themselves. [s4] In return, it produces nutrient-rich structures that serve as the colony's main food. [s5] The relationship is so close that the fungus no longer exists in the wild, and the ants cannot survive without it.\n\nLike human farmers, the ants must deal with pests. [sq1] A harmful mold sometimes invades the fungus gardens and can destroy them. [sq2] To fight it, the ants carry bacteria on their bodies that produce antibiotic substances. [sq3] Workers also remove infected material and dump it in separate waste chambers. [sq4] Researchers studying these defenses hope they may offer clues for developing new medicines, since the ants have apparently controlled the mold for millions of years without it becoming fully resistant.",
   "questions": [
    {
     "text": "Look at the four letters (A, B, C, D) in the passage that indicate where the following sentence could be added to the passage. Where would the sentence best fit?",
     "type": "Insert Text",
     "correct": 3,
     "options": [
      "Position A",
      "Position B",
      "Position C",
      "Position D"
     ],
     "explanation": "«These workers» — рабочие, которые выносят заражённый материал в отдельные камеры; это предложение стоит прямо перед позицией D.",
     "insertSentence": "These workers rarely return to the gardens, which reduces the chance of spreading infection."
    },
    {
     "text": "What is the relationship between paragraph 2 and paragraph 3?",
     "type": "Organization",
     "correct": 3,
     "options": [
      "Paragraph 2 describes a problem, and paragraph 3 explains its cause.",
      "Paragraph 2 compares ants and humans, and paragraph 3 describes human farming.",
      "Paragraph 2 describes the ants' nests, and paragraph 3 describes their diet.",
      "Paragraph 2 explains how the ants grow food, and paragraph 3 describes how they protect it."
     ],
     "explanation": "Абзац 2 — как муравьи выращивают гриб, абзац 3 — как они защищают «сад» от вредителей."
    },
    {
     "text": "Which of the following best expresses the essential information in the highlighted sentence?",
     "type": "Simplification",
     "correct": 2,
     "options": [
      "The ants can survive by eating leaves if the fungus disappears.",
      "The fungus grows wild only near ant nests.",
      "The ants and the fungus depend on each other so completely that neither can survive alone.",
      "The fungus is common in the wild, but the ants prefer to grow it."
     ],
     "explanation": "Гриб больше не встречается в природе, а муравьи не выживают без него — полная взаимозависимость. A и D противоречат предложению.",
     "highlight": "The relationship is so close that the fungus no longer exists in the wild, and the ants cannot survive without it.",
     "highlight_occurrence": 1
    },
    {
     "text": "Identify the sentence in paragraph 2 that explains what the fungus does for the ants.",
     "type": "Select a Sentence",
     "correct": 4,
     "options": [],
     "explanation": "«It produces nutrient-rich structures that serve as the colony's main food» — гриб кормит колонию. Предложение 3 о том, что гриб делает с листьями."
    },
    {
     "text": "The word \"them\" in the passage refers to",
     "type": "Reference",
     "correct": 0,
     "options": [
      "pieces of leaves",
      "columns of workers",
      "underground nests",
      "distances"
     ],
     "explanation": "«Cut pieces of leaves and carry them back» — несут кусочки листьев.",
     "highlight": "them",
     "highlight_occurrence": 1
    }
   ],
   "id": "n52"
  },
  {
   "title": "The Birth of Photography",
   "passage": "For centuries, artists used a device called the camera obscura, a dark box or room with a small hole that projected an image of the outside world onto a surface. The image could be traced by hand, but it could not be made permanent. In the early nineteenth century, inventors began searching for a way to capture such images chemically.\n\nIn 1839, the French artist Louis Daguerre announced a process that produced remarkably detailed pictures on silver-coated copper plates. These daguerreotypes, as they were called, became enormously popular, especially for portraits. [sq1] However, each image was unique and could not be copied. [sq2] At almost the same time, the English scientist William Henry Fox Talbot developed a process that created a negative image on paper. [sq3] From this negative, any number of positive prints could be made. [sq4]\n\nTalbot's pictures were less sharp than Daguerre's, but his negative-positive principle proved more important in the long run. It became the basis of nearly all photography for the next 150 years, until digital cameras replaced film. Early photographs also required long exposure times, sometimes several minutes, which is why people in early portraits rarely smile: holding a natural expression that long was difficult, and subjects often used hidden supports to keep their heads still.",
   "questions": [
    {
     "text": "According to the passage, all of the following are true of daguerreotypes EXCEPT",
     "type": "Negative Factual",
     "correct": 2,
     "options": [
      "They were made on metal plates.",
      "They were popular for portraits.",
      "They could be printed many times.",
      "They were very detailed."
     ],
     "explanation": "Каждый дагеротип был уникален и «could not be copied». Множество отпечатков давал метод Тальбота."
    },
    {
     "text": "What can be inferred about early portrait sitters?",
     "type": "Inference",
     "correct": 0,
     "options": [
      "They had to stay still for a long time while the picture was taken.",
      "They preferred serious expressions for religious reasons.",
      "They were usually artists.",
      "They could see the image immediately."
     ],
     "explanation": "Выдержка длилась минутами, поэтому было трудно держать улыбку и использовали скрытые подпорки для головы."
    },
    {
     "text": "Which of the following best summarizes the main point of the passage?",
     "type": "Main Idea",
     "correct": 1,
     "options": [
      "Talbot's photographs were more popular than daguerreotypes.",
      "Two early photographic processes appeared at about the same time, and Talbot's negative method shaped photography for 150 years.",
      "Daguerre invented the camera obscura in 1839.",
      "Early photographs were always sharper than modern ones."
     ],
     "explanation": "Два метода — Дагера и Тальбота — и долгосрочное значение негатива. B, а не A: популярнее были дагеротипы."
    },
    {
     "text": "The word \"unique\" in the passage is closest in meaning to",
     "type": "Vocabulary",
     "correct": 3,
     "options": [
      "beautiful",
      "expensive",
      "ordinary",
      "one of a kind"
     ],
     "explanation": "Each image was unique — каждое изображение было единственным в своём роде, копий не было."
    },
    {
     "text": "Look at the four letters (A, B, C, D) in the passage that indicate where the following sentence could be added to the passage. Where would the sentence best fit?",
     "type": "Insert Text",
     "correct": 1,
     "options": [
      "Position A",
      "Position B",
      "Position C",
      "Position D"
     ],
     "explanation": "«This limitation» — невозможность копировать, о которой сказано прямо перед позицией B.",
     "insertSentence": "This limitation made them costly, since a customer who wanted several copies had to sit for several separate portraits."
    }
   ],
   "id": "n53"
  },
  {
   "title": "How Children Learn Language",
   "passage": "By the age of five, most children speak their native language fluently, using thousands of words and complex grammar, without ever being formally taught. How they accomplish this has been one of the central questions in linguistics.\n\nIn the 1950s, the linguist Noam Chomsky argued that children could not learn language simply by imitating adults. The speech children hear, he pointed out, is often incomplete and full of errors, yet children reliably work out the underlying rules. Chomsky proposed that humans are born with a universal grammar, an innate set of principles shared by all languages, which guides children as they learn.\n\nOther researchers emphasize the role of experience. Studies show that infants are remarkably skilled at detecting statistical patterns in speech. By eight months, babies can notice which sounds tend to occur together and use this information to identify word boundaries in a continuous stream of speech. Interaction also matters: children whose caregivers talk with them frequently, responding to their sounds and gestures, tend to develop larger vocabularies.\n\nMost linguists today agree that both biology and experience play a part. Children appear to have strong built-in learning abilities, but they need rich exposure to language to develop them. Children who are deprived of language during their early years often struggle to master grammar later in life.",
   "questions": [
    {
     "text": "According to paragraph 3, all of the following support the role of experience EXCEPT",
     "type": "Negative Factual",
     "correct": 3,
     "options": [
      "infants detecting patterns in speech",
      "babies identifying word boundaries",
      "larger vocabularies in children who are spoken to often",
      "grammar rules shared by all languages"
     ],
     "explanation": "Общие для всех языков принципы — это универсальная грамматика Хомского из абзаца 2, аргумент за врождённость, а не за опыт."
    },
    {
     "text": "What can be inferred about Chomsky's view of imitation?",
     "type": "Inference",
     "correct": 1,
     "options": [
      "He believed imitation was more important than biology.",
      "He believed imitation alone could not explain how children learn grammar.",
      "He believed children learn only by imitating adults.",
      "He believed adults never make errors in speech."
     ],
     "explanation": "Хомский утверждал, что дети не могли бы выучить язык «simply by imitating adults», потому что речь взрослых неполна и с ошибками."
    },
    {
     "text": "Which of the following best summarizes the main point of the passage?",
     "type": "Main Idea",
     "correct": 2,
     "options": [
      "Babies learn grammar before they learn words.",
      "Children learn language mainly through formal teaching.",
      "Children's rapid language learning is now thought to depend on both innate abilities and experience.",
      "Chomsky proved that experience plays no role in language learning."
     ],
     "explanation": "Две точки зрения — врождённость (абзац 2) и опыт (абзац 3) — и вывод: важны обе (абзац 4)."
    },
    {
     "text": "The word \"deprived\" in the passage is closest in meaning to",
     "type": "Vocabulary",
     "correct": 0,
     "options": [
      "kept from having",
      "taught about",
      "protected from",
      "tired of"
     ],
     "explanation": "Deprived of language — лишённые языка, не имевшие к нему доступа в раннем детстве."
    },
    {
     "text": "According to paragraph 3, what can babies do by eight months?",
     "type": "Factual",
     "correct": 0,
     "options": [
      "Notice which sounds tend to occur together",
      "Speak in complete sentences",
      "Learn the rules of grammar",
      "Read simple words"
     ],
     "explanation": "«By eight months, babies can notice which sounds tend to occur together»."
    }
   ],
   "id": "n54"
  },
  {
   "title": "The Birth of Opera",
   "passage": "Opera, a form of drama in which the story is sung rather than spoken, emerged in Italy around 1600. Its origins lie in Florence, where a group of scholars, poets, and musicians known as the Camerata met to discuss the arts. Admiring ancient Greek tragedy, they believed that the Greeks had sung their plays and that music had given those dramas their great emotional power.\n\n[s1] The Camerata objected to the complex vocal music of their own time. [s2] In that style, several voices sang different melodies at once, making the words difficult to understand. [s3] The members argued instead for a single voice supported by simple instrumental accompaniment. [s4] This new style, called recitative, followed the rhythms and rise and fall of ordinary speech. [s5] It allowed audiences to follow the story while still feeling the emotion of the music.\n\nThe earliest operas were performed at private celebrations for wealthy families. In 1637, however, the first public opera house opened in Venice, where anyone who could buy a ticket was admitted. Opera quickly became a popular entertainment, and composers began writing more elaborate songs, called arias, to display the skills of star singers. Ironically, these showpieces sometimes made the words as hard to understand as the music the Camerata had once criticized.",
   "questions": [
    {
     "text": "How is the passage organized?",
     "type": "Organization",
     "correct": 0,
     "options": [
      "It describes the origins of opera, the musical ideas behind it, and how it later developed.",
      "It compares Greek and Italian theater and concludes they are identical.",
      "It presents arguments for and against public opera houses.",
      "It describes the lives of several famous composers."
     ],
     "explanation": "Абзац 1 — истоки во Флоренции, абзац 2 — музыкальные идеи Камераты, абзац 3 — дальнейшее развитие оперы."
    },
    {
     "text": "The word \"they\" in the passage refers to",
     "type": "Reference",
     "correct": 1,
     "options": [
      "the arts",
      "the members of the Camerata",
      "the ancient Greeks",
      "the plays"
     ],
     "explanation": "«Admiring ancient Greek tragedy, they believed that the Greeks had sung their plays» — так считали члены Камераты.",
     "highlight": "they",
     "highlight_occurrence": 1
    },
    {
     "text": "Why does the author mention the first public opera house in Venice?",
     "type": "Rhetorical Purpose",
     "correct": 2,
     "options": [
      "To argue that Venice produced better operas than Florence",
      "To describe how recitative was invented",
      "To show how opera spread beyond private events to a wider audience",
      "To explain why the Camerata met in Florence"
     ],
     "explanation": "До этого оперы шли «at private celebrations», а публичный театр открыл их всем, кто купил билет."
    },
    {
     "text": "Identify the sentence in paragraph 2 that explains what the Camerata disliked about the music of their time.",
     "type": "Select a Sentence",
     "correct": 2,
     "options": [],
     "explanation": "Несколько голосов пели разные мелодии сразу, «making the words difficult to understand» — это и не нравилось Камерате."
    },
    {
     "text": "Which of the following best expresses the essential information in the highlighted sentence?",
     "type": "Simplification",
     "correct": 3,
     "options": [
      "Arias were written to make the words easier to understand.",
      "The Camerata criticized arias for being too simple.",
      "Star singers refused to perform music the Camerata had written.",
      "Arias sometimes made the words just as unclear as the older style the Camerata had objected to."
     ],
     "explanation": "Ирония: арии иногда делали слова такими же непонятными, как музыка, которую когда-то критиковала Камерата. B путает, что именно критиковали.",
     "highlight": "Ironically, these showpieces sometimes made the words as hard to understand as the music the Camerata had once criticized.",
     "highlight_occurrence": 1
    }
   ],
   "id": "n55"
  },
  {
   "title": "Medieval Guilds",
   "passage": "In the towns of medieval Europe, most skilled trades were organized into guilds, associations of craftsmen or merchants who practiced the same occupation. There were guilds of bakers, weavers, shoemakers, goldsmiths, and many others. By the thirteenth century, guilds controlled much of the economic life of cities such as Florence, Paris, and London.\n\n[s1] Guilds regulated nearly every aspect of their trade. [s2] They set standards for the quality of goods and inspected workshops to make sure members followed them. [s3] They also fixed prices and limited the number of people who could practice the craft in a town. [s4] A young person who wished to enter a trade typically began as an apprentice, living with a master for several years while learning the skills. [s5] After further years as a journeyman, a worker might produce a \"masterpiece\" to prove his ability and join the guild as a master.\n\nGuilds also served social purposes. They supported members who fell ill, paid for funerals, and cared for the widows of masters. Many sponsored religious festivals and built chapels. Over time, however, critics complained that guilds protected their members at the expense of consumers by keeping prices high and blocking competition. As trade expanded and factories developed in the eighteenth and nineteenth centuries, most guilds lost their power and were eventually abolished.",
   "questions": [
    {
     "text": "What is the relationship between paragraph 2 and paragraph 3?",
     "type": "Organization",
     "correct": 1,
     "options": [
      "Paragraph 2 describes apprentices, and paragraph 3 describes masters.",
      "Paragraph 2 describes the economic functions of guilds, and paragraph 3 describes their social role and decline.",
      "Paragraph 2 describes the decline of guilds, and paragraph 3 describes their origins.",
      "Paragraph 2 presents criticism of guilds, and paragraph 3 defends them."
     ],
     "explanation": "Абзац 2 — как гильдии регулировали ремесло. Абзац 3: «Guilds also served social purposes», затем критика и упадок."
    },
    {
     "text": "The word \"them\" in the passage refers to",
     "type": "Reference",
     "correct": 2,
     "options": [
      "goods",
      "workshops",
      "standards for quality",
      "members"
     ],
     "explanation": "«They set standards… and inspected workshops to make sure members followed them» — следовали стандартам.",
     "highlight": "them",
     "highlight_occurrence": 1
    },
    {
     "text": "Why does the author mention that guilds \"paid for funerals\" and \"cared for the widows of masters\"?",
     "type": "Rhetorical Purpose",
     "correct": 3,
     "options": [
      "To explain why guilds were abolished",
      "To show that guilds were mainly religious organizations",
      "To describe the training of apprentices",
      "To give examples of the social support guilds provided"
     ],
     "explanation": "Это примеры к «Guilds also served social purposes».",
     "highlight": "paid for funerals",
     "highlight_occurrence": 1
    },
    {
     "text": "Identify the sentence in paragraph 2 that describes how a worker became a full member of a guild.",
     "type": "Select a Sentence",
     "correct": 5,
     "options": [],
     "explanation": "После лет подмастерьем работник мог сделать «шедевр» и «join the guild as a master»."
    },
    {
     "text": "Which of the following best expresses the essential information in the highlighted sentence?",
     "type": "Simplification",
     "correct": 0,
     "options": [
      "Critics said guilds benefited members but hurt buyers by raising prices and limiting competition.",
      "Critics said guilds lowered prices too much.",
      "Consumers formed guilds to compete with craftsmen.",
      "Critics praised guilds for protecting consumers."
     ],
     "explanation": "Гильдии защищали своих членов за счёт покупателей: высокие цены, нет конкуренции. Остальные варианты переворачивают смысл.",
     "highlight": "Over time, however, critics complained that guilds protected their members at the expense of consumers by keeping prices high and blocking competition.",
     "highlight_occurrence": 1
    }
   ],
   "id": "n56"
  },
  {
   "title": "Water on Mars",
   "passage": "Today, Mars is a cold, dry desert. Its thin atmosphere and low temperatures mean that liquid water cannot remain on its surface for long; it would quickly freeze or evaporate. Yet the planet shows abundant signs that water once flowed there.\n\nSpacecraft orbiting Mars have photographed dried-up river valleys, branching channels, and fan-shaped deposits of sediment similar to river deltas on Earth. [sq1] Rovers on the surface have found rounded pebbles, which form when stones are tumbled in flowing water over long periods. [sq2] They have also detected minerals such as clays and certain salts that form only in the presence of water. [sq3] Together, this evidence suggests that, more than three billion years ago, Mars had lakes and perhaps even a shallow ocean. [sq4]\n\nWhat happened to that water remains an active area of research. Scientists believe that Mars lost much of its atmosphere after its magnetic field weakened, leaving the planet exposed to the solar wind, which gradually stripped gases away. As the atmosphere thinned, water evaporated and escaped into space or froze. Large amounts of ice still exist at the poles and beneath the surface. Because life on Earth depends on water, the planet's watery past makes it one of the most promising places to search for signs of ancient life.",
   "questions": [
    {
     "text": "According to paragraph 2, what do rounded pebbles on Mars indicate?",
     "type": "Factual",
     "correct": 1,
     "options": [
      "That ice covered the surface",
      "That stones were moved by flowing water over a long time",
      "That Mars once had active volcanoes",
      "That the surface was struck by meteorites"
     ],
     "explanation": "Окатанная галька образуется, когда камни долго перекатывает текущая вода."
    },
    {
     "text": "What can be inferred about Mars's magnetic field?",
     "type": "Inference",
     "correct": 2,
     "options": [
      "It caused water to form on Mars.",
      "It has no connection to the atmosphere.",
      "It once helped protect the planet's atmosphere.",
      "It is stronger today than in the past."
     ],
     "explanation": "Атмосфера стала теряться после того, как поле ослабло. Значит, раньше оно её защищало от солнечного ветра."
    },
    {
     "text": "Look at the four letters (A, B, C, D) in the passage that indicate where the following sentence could be added to the passage. Where would the sentence best fit?",
     "type": "Insert Text",
     "correct": 0,
     "options": [
      "Position A",
      "Position B",
      "Position C",
      "Position D"
     ],
     "explanation": "«These deltas» — веерообразные отложения, похожие на дельты, из первого предложения абзаца. Сразу после него — позиция A.",
     "insertSentence": "Some of these deltas are so well preserved that individual layers of sediment can be counted."
    },
    {
     "text": "Which of the following best summarizes the main point of the passage?",
     "type": "Main Idea",
     "correct": 3,
     "options": [
      "Mars has liquid water on its surface today.",
      "Mars has always been a cold, dry desert.",
      "Rovers have discovered living organisms on Mars.",
      "Evidence shows that Mars once had liquid water, which it later lost, making it important in the search for past life."
     ],
     "explanation": "Следы воды в прошлом (абзац 2), куда она делась и почему это важно для поиска жизни (абзац 3). A и B противоречат тексту, C в нём нет."
    },
    {
     "text": "All of the following are mentioned as evidence of past water on Mars EXCEPT",
     "type": "Negative Factual",
     "correct": 0,
     "options": [
      "fossils of water plants",
      "dried-up river valleys",
      "deposits resembling deltas",
      "minerals that form in water"
     ],
     "explanation": "Русла, дельты и минералы названы. Об окаменелостях растений ничего нет — жизнь только предстоит искать."
    }
   ],
   "id": "n57"
  },
  {
   "title": "Life Around Deep-Sea Vents",
   "passage": "In 1977, scientists exploring the floor of the Pacific Ocean near the Galápagos Islands made an unexpected discovery. At a depth of about 2,500 meters, where no sunlight reaches, they found hot springs, called hydrothermal vents, surrounded by thriving communities of animals, including giant tube worms, clams, and crabs.\n\nThe discovery puzzled biologists. [sq1] Almost all life on Earth's surface depends, directly or indirectly, on energy from the Sun captured by plants and algae through photosynthesis. [sq2] At the vents, however, there was no light for photosynthesis. [sq3] The answer turned out to be bacteria that obtain energy from chemicals, especially hydrogen sulfide, dissolved in the hot water rising from the vents. [sq4] This process, called chemosynthesis, forms the base of the vent food web.\n\nMany vent animals live in close partnership with these bacteria. The giant tube worm, which can grow over two meters long, has no mouth or digestive system as an adult. Instead, its body contains a special organ packed with billions of bacteria that produce food for the worm. In return, the worm supplies the bacteria with the chemicals they need, which it absorbs through its bright red plume. Some scientists suggest that life on Earth may have first appeared in environments like these vents, and similar conditions might exist on icy moons such as Europa.",
   "questions": [
    {
     "text": "According to paragraph 2, where do vent bacteria get their energy?",
     "type": "Factual",
     "correct": 2,
     "options": [
      "From eating tube worms",
      "From plants growing near the vents",
      "From chemicals dissolved in the vent water",
      "From sunlight filtering down through the water"
     ],
     "explanation": "Бактерии получают энергию «from chemicals, especially hydrogen sulfide, dissolved in the hot water»."
    },
    {
     "text": "What can be inferred about adult giant tube worms?",
     "type": "Inference",
     "correct": 3,
     "options": [
      "They catch crabs with their red plumes.",
      "They move from vent to vent to find food.",
      "They carry out photosynthesis.",
      "They would not survive without their bacteria."
     ],
     "explanation": "У взрослого червя нет рта и пищеварения, еду производят бактерии внутри него — без них он не выживет."
    },
    {
     "text": "Look at the four letters (A, B, C, D) in the passage that indicate where the following sentence could be added to the passage. Where would the sentence best fit?",
     "type": "Insert Text",
     "correct": 2,
     "options": [
      "Position A",
      "Position B",
      "Position C",
      "Position D"
     ],
     "explanation": "Вопрос вытекает из противоречия: жизнь зависит от солнца, а у источников света нет (перед позицией C). После позиции C идёт ответ: «The answer turned out to be…».",
     "insertSentence": "So how could such dense communities survive in complete darkness?"
    },
    {
     "text": "Which of the following best summarizes the main point of the passage?",
     "type": "Main Idea",
     "correct": 0,
     "options": [
      "Deep-sea vent communities survive without sunlight by relying on bacteria that get energy from chemicals.",
      "Hydrothermal vents are found only near the Galápagos Islands.",
      "Tube worms are the largest animals in the ocean.",
      "Photosynthesis is the basis of all life on Earth."
     ],
     "explanation": "Главное — жизнь у источников держится на хемосинтезе, а не на солнце. D противоречит тексту."
    },
    {
     "text": "The word \"thriving\" in the passage is closest in meaning to",
     "type": "Vocabulary",
     "correct": 1,
     "options": [
      "hidden",
      "growing successfully",
      "dying slowly",
      "newly arrived"
     ],
     "explanation": "Thriving communities — процветающие, благополучные сообщества."
    }
   ],
   "id": "n58"
  },
  {
   "title": "The Dust Bowl",
   "passage": "During the 1930s, the southern Great Plains of the United States suffered one of the worst environmental disasters in the nation's history. Severe drought combined with powerful winds lifted enormous clouds of dry soil into the air. These \"black blizzards\" could darken the sky at midday and carried dust as far as the Atlantic coast. The affected region, including parts of Kansas, Oklahoma, and Texas, became known as the Dust Bowl.\n\n[s1] Drought alone does not explain the disaster. [s2] In the preceding decades, high wheat prices and new tractors had encouraged farmers to plow millions of acres of native grassland. [s3] The deep roots of prairie grasses had held the soil in place for thousands of years. [s4] Once the grass was removed, nothing protected the soil when the rains failed. [s5] Farming methods that left fields bare for long periods made the problem worse.\n\nThe human cost was severe. Crops failed year after year, many families lost their farms, and dust caused serious lung illnesses. Hundreds of thousands of people left the plains, many heading west to California in search of work. The disaster also led to lasting changes. The federal government created the Soil Conservation Service in 1935, which taught farmers techniques such as planting rows of trees to block the wind and plowing along the natural curves of the land to reduce erosion.",
   "questions": [
    {
     "text": "How is paragraph 2 related to paragraph 1?",
     "type": "Organization",
     "correct": 2,
     "options": [
      "Paragraph 2 argues that the disaster in paragraph 1 never happened.",
      "Paragraph 2 describes a different disaster in another region.",
      "Paragraph 2 explains the human causes behind the disaster described in paragraph 1.",
      "Paragraph 2 describes the solutions to the problem in paragraph 1."
     ],
     "explanation": "Абзац 1 описывает катастрофу. Абзац 2: «Drought alone does not explain the disaster» — дальше причины, связанные с людьми (распашка прерий)."
    },
    {
     "text": "The word \"which\" in the passage refers to",
     "type": "Reference",
     "correct": 3,
     "options": [
      "the federal government",
      "the year 1935",
      "the farmers",
      "the Soil Conservation Service"
     ],
     "explanation": "«The Soil Conservation Service in 1935, which taught farmers techniques» — учила фермеров служба охраны почв.",
     "highlight": "which",
     "highlight_occurrence": 1
    },
    {
     "text": "Why does the author mention that dust was carried \"as far as the Atlantic coast\"?",
     "type": "Rhetorical Purpose",
     "correct": 0,
     "options": [
      "To emphasize how large and powerful the dust storms were",
      "To explain where farmers moved after the disaster",
      "To show that the Atlantic coast also suffered drought",
      "To describe the origin of the winds"
     ],
     "explanation": "Пыль долетала до другого конца страны — это подчёркивает масштаб бурь.",
     "highlight": "as far as the Atlantic coast",
     "highlight_occurrence": 1
    },
    {
     "text": "Identify the sentence in paragraph 2 that explains why the soil had remained in place before farming expanded.",
     "type": "Select a Sentence",
     "correct": 3,
     "options": [],
     "explanation": "«The deep roots of prairie grasses had held the soil in place for thousands of years» — до распашки почву держали корни трав."
    },
    {
     "text": "According to paragraph 3, all of the following were results of the Dust Bowl EXCEPT",
     "type": "Negative Factual",
     "correct": 1,
     "options": [
      "migration to California",
      "a sharp rise in wheat prices",
      "crop failures",
      "lung illnesses"
     ],
     "explanation": "Неурожаи, болезни лёгких и переезд в Калифорнию — последствия из абзаца 3. Высокие цены на пшеницу были раньше и стали одной из причин."
    }
   ],
   "id": "n59"
  },
  {
   "title": "How Lightning Forms",
   "passage": "Lightning is a giant electrical spark that occurs when electrical charges build up inside a storm cloud. Scientists still debate some details of the process, but the basic picture is well established. Inside a thundercloud, strong upward air currents carry water droplets high into the cold upper part of the cloud, where they freeze. Collisions between tiny ice crystals and larger, softer ice particles called graupel transfer electrical charge between them.\n\nAs a result, the cloud becomes separated into regions of opposite charge. [sq1] Lighter ice crystals, which become positively charged, are carried to the top of the cloud. [sq2] Heavier graupel particles, which become negatively charged, gather in the middle and lower parts. [sq3] When the difference in charge becomes large enough, the air between these regions, normally a poor conductor, breaks down, and a sudden discharge occurs. [sq4]\n\nA lightning bolt heats the surrounding air to about 30,000 degrees Celsius, roughly five times hotter than the surface of the Sun. This extreme heating causes the air to expand explosively, producing the sound of thunder. Because light travels much faster than sound, we see lightning before we hear thunder. Counting the seconds between the two and dividing by three gives the approximate distance to the strike in kilometers.",
   "questions": [
    {
     "text": "Which of the following best expresses the essential information in the highlighted sentence?",
     "type": "Simplification",
     "correct": 1,
     "options": [
      "Lightning occurs only when the charge difference is small.",
      "When the charge difference grows large enough, the air can no longer resist and a discharge happens.",
      "Air is an excellent conductor, so lightning occurs frequently.",
      "The charge difference causes air to freeze into ice crystals."
     ],
     "explanation": "Когда разница зарядов велика, воздух (обычно плохой проводник) «пробивается», и происходит разряд. C переворачивает свойство воздуха.",
     "highlight": "When the difference in charge becomes large enough, the air between these regions, normally a poor conductor, breaks down, and a sudden discharge occurs.",
     "highlight_occurrence": 1
    },
    {
     "text": "According to paragraph 3, what produces the sound of thunder?",
     "type": "Factual",
     "correct": 3,
     "options": [
      "Ice particles colliding inside the cloud",
      "Rain hitting the ground",
      "Clouds bumping into each other",
      "Air expanding rapidly after being heated by lightning"
     ],
     "explanation": "«This extreme heating causes the air to expand explosively, producing the sound of thunder»."
    },
    {
     "text": "If a person hears thunder six seconds after seeing lightning, what can be inferred?",
     "type": "Inference",
     "correct": 0,
     "options": [
      "The strike was about two kilometers away.",
      "The strike was about six kilometers away.",
      "The strike was directly overhead.",
      "The strike was about eighteen kilometers away."
     ],
     "explanation": "По правилу из текста секунды делят на три: 6 ÷ 3 = 2 км."
    },
    {
     "text": "Look at the four letters (A, B, C, D) in the passage that indicate where the following sentence could be added to the passage. Where would the sentence best fit?",
     "type": "Insert Text",
     "correct": 2,
     "options": [
      "Position A",
      "Position B",
      "Position C",
      "Position D"
     ],
     "explanation": "«This arrangement» — распределение зарядов: положительные наверху, отрицательные внизу. Оно описано перед позицией C, а после неё говорится, к чему ведёт растущая разница.",
     "insertSentence": "This arrangement creates a powerful electrical field inside the cloud."
    },
    {
     "text": "The word \"approximate\" in the passage is closest in meaning to",
     "type": "Vocabulary",
     "correct": 2,
     "options": [
      "safe",
      "maximum",
      "rough",
      "exact"
     ],
     "explanation": "Approximate distance — приблизительное расстояние. Exact — наоборот, «точное»."
    }
   ],
   "id": "n60"
  },
  {
   "title": "Small Loans, Big Hopes",
   "passage": "Traditional banks rarely lend money to very poor people. Such borrowers usually have no property to offer as security, and the small sums they need make loans unprofitable to process. In the 1970s, the Bangladeshi economist Muhammad Yunus began lending small amounts to poor women in villages so that they could start or expand tiny businesses, such as weaving baskets or raising chickens.\n\n[s1] Yunus's approach, which became known as microfinance, relied on an unusual system. [s2] Borrowers were organized into small groups, and each member was responsible for encouraging the others to repay. [s3] If one member failed to pay, the whole group might lose access to future loans. [s4] This social pressure replaced the property that banks normally required. [s5] Repayment rates turned out to be surprisingly high, often above 95 percent.\n\nThe Grameen Bank, which Yunus founded in 1983, inspired similar programs around the world, and in 2006 he and the bank shared the Nobel Peace Prize. Later research, however, produced more mixed results. Several large studies found that microloans helped some borrowers expand businesses but did not, on average, significantly raise household incomes or lift large numbers of people out of poverty. Critics also pointed to lenders that charged very high interest rates. Supporters respond that access to credit still gives poor families valuable flexibility, even if it is not a complete solution to poverty.",
   "questions": [
    {
     "text": "Which of the following best summarizes the main point of the passage?",
     "type": "Main Idea",
     "correct": 1,
     "options": [
      "Microloans are always offered at very low interest rates.",
      "Microfinance made small loans available to poor borrowers through group responsibility, though its effect on poverty has been debated.",
      "Microfinance has ended poverty in Bangladesh.",
      "Traditional banks invented microfinance in the 1970s."
     ],
     "explanation": "Идея и устройство микрофинансирования (абзацы 1–2) и неоднозначные результаты (абзац 3). C — слишком сильно, A противоречит критике."
    },
    {
     "text": "According to paragraph 3, all of the following are true EXCEPT",
     "type": "Negative Factual",
     "correct": 2,
     "options": [
      "Some studies found little average increase in household income.",
      "Some lenders charged very high interest.",
      "Microfinance programs exist only in Bangladesh.",
      "Yunus shared the Nobel Peace Prize."
     ],
     "explanation": "Грамин-банк «inspired similar programs around the world». Остальное в абзаце 3 есть."
    },
    {
     "text": "How does paragraph 3 relate to paragraphs 1 and 2?",
     "type": "Organization",
     "correct": 3,
     "options": [
      "It explains how group lending works in detail.",
      "It argues that traditional banks are more effective than microfinance.",
      "It repeats the information in paragraph 2 using different examples.",
      "It describes the spread of microfinance and then presents evidence that complicates its early success."
     ],
     "explanation": "Сначала распространение и Нобелевская премия, затем «Later research, however, produced more mixed results»."
    },
    {
     "text": "The phrase \"This social pressure\" in the passage refers to",
     "type": "Reference",
     "correct": 0,
     "options": [
      "the responsibility group members had for one another's repayment",
      "the high interest rates charged by banks",
      "the property that banks required",
      "competition between villages"
     ],
     "explanation": "Предыдущие предложения: каждый член группы отвечает за выплаты других, и при неуплате вся группа теряет доступ к займам.",
     "highlight": "This social pressure",
     "highlight_occurrence": 1
    },
    {
     "text": "Identify the sentence in paragraph 2 that describes the consequence of one borrower not repaying.",
     "type": "Select a Sentence",
     "correct": 3,
     "options": [],
     "explanation": "«If one member failed to pay, the whole group might lose access to future loans» — последствие неуплаты."
    }
   ],
   "id": "n61"
  },
  {
   "title": "The Smart Grid",
   "passage": "Electrical grids were originally designed to send power in one direction: from large power plants, through transmission lines, to homes and businesses. Utilities adjusted production to match demand, which rose during the day and fell at night. This system worked well for most of the twentieth century.\n\nThe growth of renewable energy has made the task more complicated. [sq1] Solar and wind power vary with the weather and time of day, so their output cannot be controlled as easily as that of a coal or gas plant. [sq2] At the same time, millions of homes now have rooftop solar panels that send electricity back into the grid. [sq3] Power now flows in two directions, and supply can change suddenly. [sq4]\n\nA smart grid uses sensors, digital meters, and communication networks to manage these challenges. Smart meters record electricity use in real time and can show customers when power is cheapest. Some appliances, such as water heaters or electric car chargers, can be programmed to run automatically when supply is plentiful, for instance on a windy night. Grid operators can also detect faults quickly and reroute power around them, shortening blackouts. Critics, however, have raised concerns about the privacy of detailed data on household electricity use.",
   "questions": [
    {
     "text": "Why does the author mention \"a windy night\"?",
     "type": "Rhetorical Purpose",
     "correct": 1,
     "options": [
      "To show that wind power works only at night",
      "To give an example of a time when electricity supply might be plentiful",
      "To explain why blackouts happen",
      "To describe the weather conditions that damage power lines"
     ],
     "explanation": "Пример момента, когда энергии много, — тогда приборы можно запускать автоматически.",
     "highlight": "a windy night",
     "highlight_occurrence": 1
    },
    {
     "text": "Which of the following best expresses the essential information in the highlighted sentence?",
     "type": "Simplification",
     "correct": 2,
     "options": [
      "Solar and wind power produce more electricity at night.",
      "Solar and wind plants are easier to control than coal plants.",
      "The output of solar and wind power depends on conditions, so it is harder to control than that of fossil-fuel plants.",
      "Coal and gas plants depend more on the weather than solar and wind."
     ],
     "explanation": "Солнце и ветер зависят от погоды и времени суток, поэтому управлять ими труднее, чем угольной или газовой станцией. B и D переворачивают сравнение.",
     "highlight": "Solar and wind power vary with the weather and time of day, so their output cannot be controlled as easily as that of a coal or gas plant.",
     "highlight_occurrence": 1
    },
    {
     "text": "The word \"reroute\" in the passage is closest in meaning to",
     "type": "Vocabulary",
     "correct": 3,
     "options": [
      "switch off",
      "store",
      "measure",
      "send by a different path"
     ],
     "explanation": "Reroute power around them — пустить электричество в обход повреждений."
    },
    {
     "text": "According to paragraph 3, what concern have critics raised about smart grids?",
     "type": "Factual",
     "correct": 0,
     "options": [
      "The privacy of household electricity data",
      "The high cost of solar panels",
      "The noise of wind turbines",
      "The danger of electric cars"
     ],
     "explanation": "«Concerns about the privacy of detailed data on household electricity use»."
    },
    {
     "text": "Look at the four letters (A, B, C, D) in the passage that indicate where the following sentence could be added to the passage. Where would the sentence best fit?",
     "type": "Insert Text",
     "correct": 2,
     "options": [
      "Position A",
      "Position B",
      "Position C",
      "Position D"
     ],
     "explanation": "«These customers» — дома с солнечными панелями, которые отдают электричество в сеть. Они описаны прямо перед позицией C.",
     "insertSentence": "Utilities that once only sold power to these customers must now also buy it from them."
    }
   ],
   "id": "n62"
  },
  {
   "title": "Desertification in the Sahel",
   "passage": "The Sahel is a belt of semi-arid land stretching across Africa just south of the Sahara Desert, from Senegal in the west to Sudan in the east. Rainfall there is limited and highly variable, and most people depend on farming and herding. In the 1970s and 1980s, severe droughts struck the region, causing crop failures and famine that killed hundreds of thousands of people.\n\nAt the time, many experts believed that the Sahara was steadily advancing southward, swallowing farmland. They blamed local practices, such as overgrazing by livestock and cutting trees for firewood, which they argued stripped the land of vegetation and exposed soil to erosion. International programs urged farmers to change their methods and planted large numbers of trees.\n\nLater research revealed a more complex picture. Satellite images from the 1990s onward showed that much of the Sahel had become greener as rainfall partly recovered. Scientists also found that the droughts had been driven largely by changes in ocean temperatures, partly linked to air pollution in the Northern Hemisphere. Moreover, some of the most successful restoration came from farmers themselves. In Niger, farmers began protecting tree shoots that sprouted naturally from old roots in their fields, helping to restore millions of hectares of land at very low cost.",
   "questions": [
    {
     "text": "What can be inferred about the early international programs in the Sahel?",
     "type": "Inference",
     "correct": 1,
     "options": [
      "They focused on reducing air pollution.",
      "They were based partly on an incomplete understanding of the causes of drought.",
      "They were designed by local farmers.",
      "They caused the rainfall to recover."
     ],
     "explanation": "Программы исходили из того, что виноваты местные методы, а позже выяснилось, что засухи вызывали в основном изменения температуры океана."
    },
    {
     "text": "Which of the following best summarizes the main point of the passage?",
     "type": "Main Idea",
     "correct": 2,
     "options": [
      "Planting trees ended droughts in the Sahel.",
      "Farmers in Niger caused the droughts of the 1970s.",
      "Early explanations blamed local farming for the Sahel's problems, but later research showed a more complex situation.",
      "The Sahara has steadily swallowed the entire Sahel."
     ],
     "explanation": "Ранние объяснения (абзац 2) и более сложная картина из поздних исследований (абзац 3). D противоречит снимкам, на которых Сахель позеленел."
    },
    {
     "text": "According to paragraph 3, all of the following are true EXCEPT",
     "type": "Negative Factual",
     "correct": 3,
     "options": [
      "Parts of the Sahel became greener after the 1990s.",
      "Ocean temperatures influenced the droughts.",
      "Farmers in Niger helped restore land.",
      "Overgrazing was proven to be the main cause of the droughts."
     ],
     "explanation": "Абзац 3 говорит, что засухи вызывались в основном океаном. Что главной причиной был выпас скота, не доказано — так думали раньше."
    },
    {
     "text": "What is the relationship between paragraph 2 and paragraph 3?",
     "type": "Organization",
     "correct": 0,
     "options": [
      "Paragraph 2 describes an earlier view, and paragraph 3 describes research that revised it.",
      "Paragraph 2 describes a solution, and paragraph 3 describes the problem it caused.",
      "Paragraph 2 describes the Sahel, and paragraph 3 describes the Sahara.",
      "Paragraph 2 presents data, and paragraph 3 draws the same conclusion from it."
     ],
     "explanation": "Абзац 2 — что считали тогда. Абзац 3: «Later research revealed a more complex picture»."
    },
    {
     "text": "The word \"They\" in the passage refers to",
     "type": "Reference",
     "correct": 1,
     "options": [
      "international programs",
      "many experts",
      "local farmers",
      "livestock"
     ],
     "explanation": "«Many experts believed… They blamed local practices» — винили эксперты.",
     "highlight": "They",
     "highlight_occurrence": 1
    }
   ],
   "id": "n63"
  },
  {
   "title": "The Art of Disappearing",
   "passage": "Cuttlefish, relatives of squid and octopuses, are among the most skilled masters of camouflage in the animal kingdom. Within a fraction of a second, a cuttlefish can change the color, pattern, and even the texture of its skin to match its surroundings, becoming nearly invisible against sand, rocks, or seaweed.\n\n[s1] This ability depends on specialized cells in the skin called chromatophores. [s2] Each chromatophore contains a small elastic sac of pigment, which may be yellow, red, or brown. [s3] Tiny muscles around the sac, controlled directly by the nervous system, stretch it open to display the color or let it shrink to hide it. [s4] Beneath these cells lie layers that reflect light, producing shimmering blues and greens. [s5] By controlling millions of chromatophores at once, a cuttlefish can create complex patterns almost instantly.\n\nRemarkably, cuttlefish appear to be colorblind. Their eyes contain only one type of light-sensitive cell, which in most animals would prevent them from distinguishing colors. How they match the colors of their surroundings so precisely remains a mystery. Some researchers suggest that cuttlefish rely on contrast and brightness rather than color itself. Others have proposed that light-sensitive proteins in the skin may help detect the surrounding light directly.\n\n[sq1] Cuttlefish also use their displays to communicate. [sq2] During courtship, males may produce dramatic striped patterns. [sq3] When threatened, a cuttlefish may suddenly flash dark spots that resemble large eyes, startling a predator. [sq4]",
   "questions": [
    {
     "text": "Identify the sentence in paragraph 2 that explains how the colors in chromatophores are shown or hidden.",
     "type": "Select a Sentence",
     "correct": 3,
     "options": [],
     "explanation": "Мышцы вокруг мешочка растягивают его, чтобы показать цвет, или дают сжаться, чтобы спрятать."
    },
    {
     "text": "Which of the following best expresses the essential information in the highlighted sentence?",
     "type": "Simplification",
     "correct": 3,
     "options": [
      "Cuttlefish have more types of light-sensitive cells than most animals.",
      "Most animals cannot distinguish colors.",
      "Cuttlefish see colors with the help of their skin.",
      "Cuttlefish have only one type of light-sensitive cell, which would normally make them unable to see colors."
     ],
     "explanation": "Один тип светочувствительных клеток обычно означает, что цвета различать нельзя. A и B переворачивают смысл, C — гипотеза из другого предложения.",
     "highlight": "Their eyes contain only one type of light-sensitive cell, which in most animals would prevent them from distinguishing colors.",
     "highlight_occurrence": 1
    },
    {
     "text": "Why does the author mention dark spots \"that resemble large eyes\"?",
     "type": "Rhetorical Purpose",
     "correct": 2,
     "options": [
      "To describe the structure of chromatophores",
      "To show how males attract females",
      "To give an example of how cuttlefish use displays to defend themselves",
      "To explain how cuttlefish see colors"
     ],
     "explanation": "Пятна, похожие на глаза, пугают хищника — пример защитной демонстрации.",
     "highlight": "that resemble large eyes",
     "highlight_occurrence": 1
    },
    {
     "text": "The word \"startling\" in the passage is closest in meaning to",
     "type": "Vocabulary",
     "correct": 0,
     "options": [
      "surprising",
      "attracting",
      "injuring",
      "following"
     ],
     "explanation": "Startling a predator — пугая, ошеломляя хищника внезапностью."
    },
    {
     "text": "Look at the four letters (A, B, C, D) in the passage that indicate where the following sentence could be added to the passage. Where would the sentence best fit?",
     "type": "Insert Text",
     "correct": 1,
     "options": [
      "Position A",
      "Position B",
      "Position C",
      "Position D"
     ],
     "explanation": "«These signals» — демонстрации для общения, о которых сказано перед позицией B: «Cuttlefish also use their displays to communicate». Дальше идут примеры.",
     "insertSentence": "These signals are not meant to hide the animal but to be noticed by others."
    }
   ],
   "id": "n64"
  },
  {
   "title": "The Rise of the Novel",
   "passage": "Long stories in prose existed in many cultures well before the modern era, from Japan's eleventh-century \"Tale of Genji\" to the romances of medieval Europe. Yet many literary historians date the rise of the novel as a popular form in England to the eighteenth century, with works such as Daniel Defoe's \"Robinson Crusoe\" (1719) and Samuel Richardson's \"Pamela\" (1740).\n\nThese novels differed from earlier romances in important ways. Romances typically told of knights, kings, and magical adventures in distant lands. The new novels, by contrast, focused on ordinary people in recognizable settings, and they described everyday details and characters' inner thoughts with unusual realism. Richardson's \"Pamela,\" for example, was written as a series of letters by a young servant, allowing readers to follow her feelings closely.\n\nSeveral social changes help explain the novel's rise. Literacy was spreading, particularly among the growing middle class, including many women who had time to read. Printing had become cheaper, and circulating libraries allowed readers to borrow books for a small fee. Not everyone welcomed the trend, however. Some critics warned that novels encouraged idleness and filled young readers, especially young women, with unrealistic expectations about life and love.",
   "questions": [
    {
     "text": "According to paragraph 2, how was \"Pamela\" written?",
     "type": "Factual",
     "correct": 1,
     "options": [
      "As a collection of poems",
      "As a series of letters by a young servant",
      "As a story about knights and kings",
      "As a travel diary"
     ],
     "explanation": "«Was written as a series of letters by a young servant»."
    },
    {
     "text": "What can be inferred about circulating libraries?",
     "type": "Inference",
     "correct": 2,
     "options": [
      "They sold books at very high prices.",
      "They existed before printing was invented.",
      "They made reading more affordable for many people.",
      "They were opposed to the spread of novels."
     ],
     "explanation": "В библиотеках брали книги «for a small fee», когда покупать было дорого. Значит, чтение стало доступнее."
    },
    {
     "text": "Which of the following best summarizes the main point of the passage?",
     "type": "Main Idea",
     "correct": 3,
     "options": [
      "The novel was invented in Japan in the eleventh century.",
      "Eighteenth-century critics universally praised novels.",
      "Medieval romances were more realistic than modern novels.",
      "The novel became popular in eighteenth-century England, offering realistic stories about ordinary people and helped by social changes."
     ],
     "explanation": "Подъём романа в Англии XVIII века (абзац 1), его отличия от рыцарских романов (абзац 2) и социальные причины (абзац 3). B противоречит критике."
    },
    {
     "text": "According to paragraph 3, all of the following contributed to the rise of the novel EXCEPT",
     "type": "Negative Factual",
     "correct": 0,
     "options": [
      "government support for authors",
      "spreading literacy",
      "cheaper printing",
      "circulating libraries"
     ],
     "explanation": "Грамотность, дешёвая печать и библиотеки названы. О поддержке авторов государством ничего нет."
    },
    {
     "text": "How is paragraph 2 organized?",
     "type": "Organization",
     "correct": 1,
     "options": [
      "It describes a cause and then several effects.",
      "It contrasts the novel with an earlier form and then gives an example.",
      "It lists events in chronological order.",
      "It presents a problem and offers a solution."
     ],
     "explanation": "Сначала сравнение с романами о рыцарях («by contrast»), затем пример — «Памела»."
    }
   ],
   "id": "n65"
  },
  {
   "title": "The Glassmakers of Murano",
   "passage": "For centuries, the small island of Murano, in the lagoon of Venice, has been famous for its glass. In 1291, the government of the Venetian Republic ordered glassmakers to move their furnaces from the crowded city to Murano. The official reason was to reduce the danger of fires, but the move also made it easier to control the craftsmen and their valuable knowledge.\n\n[s1] Murano's glassmakers developed techniques that made their work prized across Europe. [s2] In the fifteenth century, Angelo Barovier created cristallo, a glass so clear that it resembled rock crystal. [s3] Other artisans perfected methods for making colored and patterned glass, as well as the high-quality mirrors that later decorated palaces. [s4] These products earned Venice enormous profits, and the Republic guarded the secrets behind them closely. [s5] Glassmakers were forbidden to leave Venetian territory, and those who did risked severe punishment.\n\nGlassmakers enjoyed unusual privileges in return. They were among the most respected citizens of the Republic, and their daughters were permitted to marry into noble families. Despite the restrictions, some craftsmen did escape, carrying their secrets to France, England, and elsewhere, which helped spread advanced glassmaking across Europe. Today, Murano's workshops still produce glass by hand, although they face growing competition from cheaper, mass-produced imitations.",
   "questions": [
    {
     "text": "The word \"them\" in the passage refers to",
     "type": "Reference",
     "correct": 2,
     "options": [
      "the palaces",
      "the glassmakers",
      "the glass products",
      "the profits"
     ],
     "explanation": "«These products earned Venice enormous profits, and the Republic guarded the secrets behind them» — секреты изготовления самих изделий из стекла. У прибыли «секретов изготовления» нет.",
     "highlight": "them",
     "highlight_occurrence": 1
    },
    {
     "text": "Why does the author mention that glassmakers' daughters \"were permitted to marry into noble families\"?",
     "type": "Rhetorical Purpose",
     "correct": 3,
     "options": [
      "To explain why glassmakers escaped",
      "To show that glassmaking was done mainly by women",
      "To describe how cristallo was made",
      "To illustrate the special status glassmakers had"
     ],
     "explanation": "Пример привилегий: «Glassmakers enjoyed unusual privileges… They were among the most respected citizens».",
     "highlight": "were permitted to marry into noble families",
     "highlight_occurrence": 1
    },
    {
     "text": "Identify the sentence in paragraph 2 that describes a restriction placed on glassmakers.",
     "type": "Select a Sentence",
     "correct": 5,
     "options": [],
     "explanation": "Республика запрещала мастерам покидать её территорию под угрозой сурового наказания."
    },
    {
     "text": "Which of the following best expresses the essential information in the highlighted sentence?",
     "type": "Simplification",
     "correct": 0,
     "options": [
      "The stated purpose was fire safety, but the move also helped the government control glassmakers and their skills.",
      "The government moved glassmakers to Murano only because of the danger of fire.",
      "Glassmakers asked to move to Murano to protect their knowledge.",
      "Fires on Murano destroyed the glassmakers' furnaces."
     ],
     "explanation": "Официально — пожарная безопасность, но переезд заодно помогал контролировать мастеров и их знания. B игнорирует вторую часть.",
     "highlight": "The official reason was to reduce the danger of fires, but the move also made it easier to control the craftsmen and their valuable knowledge.",
     "highlight_occurrence": 1
    },
    {
     "text": "The word \"prized\" in the passage is closest in meaning to",
     "type": "Vocabulary",
     "correct": 1,
     "options": [
      "carefully hidden",
      "highly valued",
      "expensive to make",
      "won in contests"
     ],
     "explanation": "Prized across Europe — высоко ценимые по всей Европе."
    }
   ],
   "id": "n66"
  }
 ],
 "daily": [
  {
   "title": "Lab Safety Training Email",
   "layout_type": "email",
   "passage": "Subject: Lab safety training moved\n\nDear Chemistry 210 students,\n\nBecause of a scheduling conflict with the fire department, the lab safety training originally planned for Tuesday, September 9, has been moved to Thursday, September 11, from 4:00 to 5:30 P.M. in Room 112 of Hall Science Building.\n\nPlease remember that you must complete this training before your first lab session. Students who cannot attend on Thursday should contact the lab coordinator, Dr. Kim, by Wednesday to arrange an online make-up session.\n\nBest regards,\nChemistry Department Office",
   "questions": [
    {
     "text": "What is the main purpose of the email?",
     "type": "Main Idea",
     "correct": 2,
     "options": [
      "To cancel the first lab session",
      "To report a fire in the science building",
      "To announce a change to the date of a training session",
      "To introduce a new lab coordinator"
     ],
     "explanation": "Тема письма — «Lab safety training moved»: тренинг перенесли со вторника на четверг. Про пожар речи нет — пожарные лишь причина переноса."
    },
    {
     "text": "What should students do if they cannot attend the training on Thursday?",
     "type": "Factual",
     "correct": 0,
     "options": [
      "Contact Dr. Kim by Wednesday",
      "Call the fire department",
      "Complete a written test",
      "Attend the next lab session"
     ],
     "explanation": "«Students who cannot attend on Thursday should contact the lab coordinator, Dr. Kim, by Wednesday»."
    },
    {
     "text": "What can be inferred about the fire department?",
     "type": "Inference",
     "correct": 1,
     "options": [
      "It asked for an online session.",
      "It is involved in the training.",
      "It has closed the science building.",
      "It will grade the students."
     ],
     "explanation": "Тренинг перенесли из-за «a scheduling conflict with the fire department» — у пожарных не совпало расписание. Значит, они участвуют в тренинге по безопасности."
    }
   ],
   "id": "n1"
  },
  {
   "title": "Aquatic Center Closure Notice",
   "layout_type": "notice",
   "passage": "AQUATIC CENTER CLOSURE\n\nThe Lakeside Aquatic Center pool will be closed from March 3 to March 16 while the filtration system is replaced.\n\nDuring the closure:\n• The fitness room and locker rooms will remain open at regular hours.\n• Swimming classes will meet at the Riverside Community Pool. Free shuttle buses will leave the Aquatic Center every 30 minutes.\n• Members who prefer not to travel may pause their memberships for the two weeks at no charge. Visit the front desk to arrange this.\n\nWe look forward to welcoming you back to cleaner, clearer water!",
   "questions": [
    {
     "text": "What is the main purpose of the notice?",
     "type": "Main Idea",
     "correct": 3,
     "options": [
      "To advertise new swimming classes",
      "To announce a change in membership prices",
      "To introduce a shuttle service between two campuses",
      "To inform members about a temporary pool closure"
     ],
     "explanation": "Объявление о том, что бассейн закрыт на две недели, и о том, как пока устроены занятия."
    },
    {
     "text": "What is NOT mentioned as being available during the closure?",
     "type": "Negative Factual",
     "correct": 3,
     "options": [
      "Use of the fitness room",
      "Transportation to another pool",
      "Pausing a membership",
      "A discount on next year's membership"
     ],
     "explanation": "Фитнес-зал работает, есть бесплатный автобус до другого бассейна и можно заморозить абонемент. О скидке на следующий год ничего нет."
    },
    {
     "text": "Where will swimming classes take place during the closure?",
     "type": "Factual",
     "correct": 1,
     "options": [
      "At the Lakeside Aquatic Center",
      "At the Riverside Community Pool",
      "In the fitness room",
      "Nowhere, because they will be canceled"
     ],
     "explanation": "«Swimming classes will meet at the Riverside Community Pool»."
    }
   ],
   "id": "n2"
  },
  {
   "title": "History Project Group Chat",
   "layout_type": "chat",
   "passage": "Priya Shah (10:02 A.M.)\nHi everyone, the room we booked for our history project meeting this afternoon is being used for an exam. Can we meet somewhere else?\n\nTom Reyes (10:05 A.M.)\nThe study rooms on the third floor of the library are usually free on Fridays.\n\nPriya Shah (10:06 A.M.)\nGood idea. I'll reserve one for 3:00. Does that time still work for everyone?\n\nLena Park (10:10 A.M.)\nI have a lab until 3:15, so I might be a few minutes late. Start without me.\n\nTom Reyes (10:11 A.M.)\nNo problem. I'll bring the printed sources we found yesterday.\n\nPriya Shah (10:13 A.M.)\nPerfect. I just booked Room 3C.",
   "questions": [
    {
     "text": "Why can the group not use the room it originally booked?",
     "type": "Factual",
     "correct": 2,
     "options": [
      "Priya forgot to reserve it.",
      "It is too small.",
      "It will be used for an exam.",
      "It is closed on Fridays."
     ],
     "explanation": "«The room we booked… is being used for an exam»."
    },
    {
     "text": "At 10:10 A.M., what does Lena most likely mean when she writes, \"Start without me\"?",
     "type": "Inference",
     "correct": 2,
     "options": [
      "She would prefer to meet in the lab.",
      "She does not want to work on the project.",
      "She does not want the others to wait for her.",
      "She thinks the meeting should start earlier."
     ],
     "explanation": "У неё лабораторная до 3:15, а встреча в 3:00 — она опоздает и просит её не ждать."
    },
    {
     "text": "What can be inferred about Tom?",
     "type": "Inference",
     "correct": 3,
     "options": [
      "He works at the library.",
      "He cannot come to the meeting.",
      "He booked Room 3C.",
      "He has already done some research for the project."
     ],
     "explanation": "«I'll bring the printed sources we found yesterday» — источники уже найдены, значит, работа над проектом начата. Комнату забронировала Прия."
    }
   ],
   "id": "n3"
  },
  {
   "title": "Bike Tune-Up Day Ad",
   "layout_type": "advertisement",
   "passage": "SPRING BIKE TUNE-UP DAY!\n\nIs your bicycle ready for the warmer weather? Bring it to the Student Union Plaza on Saturday, April 12, from 10 A.M. to 3 P.M.\n\nVolunteer mechanics from the Campus Cycling Club will:\n• Check and adjust brakes\n• Pump up tires and repair flat tires\n• Oil chains and gears\n\nAll services are free for students with a valid ID. Replacement parts such as new tires or brake pads can be purchased on site at cost.\n\nNo appointment needed, but lines are usually longest around noon!",
   "questions": [
    {
     "text": "What is the purpose of the advertisement?",
     "type": "Main Idea",
     "correct": 0,
     "options": [
      "To promote a free bicycle maintenance event",
      "To sell new bicycles to students",
      "To recruit members for the cycling club",
      "To announce a bicycle race"
     ],
     "explanation": "Реклама дня бесплатного осмотра и мелкого ремонта велосипедов. Новые велосипеды не продают — только запчасти."
    },
    {
     "text": "Which service is NOT mentioned in the advertisement?",
     "type": "Negative Factual",
     "correct": 0,
     "options": [
      "Painting bicycles",
      "Oiling chains",
      "Fixing flat tires",
      "Adjusting brakes"
     ],
     "explanation": "В списке — тормоза, шины и смазка цепи. Покраски нет."
    },
    {
     "text": "What is suggested about students who arrive at noon?",
     "type": "Inference",
     "correct": 0,
     "options": [
      "They may have to wait longer.",
      "They will receive free parts.",
      "They will need an appointment.",
      "They will be served first."
     ],
     "explanation": "«Lines are usually longest around noon» — в полдень очередь длиннее всего, ждать придётся дольше."
    }
   ],
   "id": "n4"
  },
  {
   "title": "Food Bank Volunteer Post",
   "layout_type": "social_media",
   "passage": "Daniel Okafor\n\nJust finished my first shift at the Riverside Food Bank, and I'm already signing up for more! I thought I'd mostly be stacking cans, but I spent the morning helping families choose groceries and chatting with them while they waited.\n\nThe coordinator, Ms. Alvarez, told us the food bank serves almost twice as many people as it did two years ago, and they're always short of volunteers on weekday mornings. If you have a free morning, even once a month, it makes a real difference.\n\nSign up at riversidefoodbank.org. Trust me, it's the most rewarding three hours of my week!",
   "questions": [
    {
     "text": "What can be inferred about Daniel's expectations before his first shift?",
     "type": "Inference",
     "correct": 1,
     "options": [
      "He did not plan to volunteer again.",
      "He expected to do mostly physical tasks.",
      "He expected to work in an office.",
      "He expected to meet Ms. Alvarez."
     ],
     "explanation": "«I thought I'd mostly be stacking cans» — он думал, что будет в основном расставлять банки, то есть заниматься физической работой."
    },
    {
     "text": "According to the post, when does the food bank most need volunteers?",
     "type": "Factual",
     "correct": 3,
     "options": [
      "During holidays",
      "Once a month",
      "On weekend evenings",
      "On weekday mornings"
     ],
     "explanation": "«They're always short of volunteers on weekday mornings». «Once a month» — это сколько можно приходить, а не когда нужна помощь."
    },
    {
     "text": "The word \"rewarding\" in the post is closest in meaning to",
     "type": "Vocabulary",
     "correct": 0,
     "options": [
      "satisfying",
      "well-paid",
      "tiring",
      "unusual"
     ],
     "explanation": "Rewarding — приносящий удовлетворение. Волонтёрам не платят, поэтому «well-paid» не подходит."
    }
   ],
   "id": "n5"
  },
  {
   "title": "Orientation Day 1 Schedule",
   "layout_type": "schedule",
   "passage": "NEW STUDENT ORIENTATION — DAY 1\nMonday, August 25 | Main Campus\n\n8:30–9:00 A.M. | Check-in and welcome packets, Carter Hall lobby\n9:00–10:00 A.M. | Welcome address by the Dean of Students, Carter Hall Auditorium\n10:15–11:30 A.M. | Campus tours (meet your student guide at the fountain)\n11:30 A.M.–12:30 P.M. | Lunch, Riverside Dining Hall (free with welcome packet)\n1:00–2:30 P.M. | Academic advising by department\n3:00–4:00 P.M. | Student Clubs Fair, Green Lawn (moves to the gym if it rains)\n\nBring your student ID to all sessions.",
   "questions": [
    {
     "text": "What is the main purpose of this schedule?",
     "type": "Main Idea",
     "correct": 1,
     "options": [
      "To describe dining options on campus",
      "To list the activities planned for the first day of orientation",
      "To advertise the Student Clubs Fair",
      "To explain how to get a student ID"
     ],
     "explanation": "Это расписание первого дня ориентации: все мероприятия по времени. Ярмарка клубов и обед — только отдельные пункты."
    },
    {
     "text": "Where will the Student Clubs Fair be held if it rains?",
     "type": "Factual",
     "correct": 0,
     "options": [
      "In the gym",
      "In Riverside Dining Hall",
      "At the fountain",
      "In Carter Hall Auditorium"
     ],
     "explanation": "«Student Clubs Fair, Green Lawn (moves to the gym if it rains)»."
    },
    {
     "text": "All of the following are part of the Day 1 schedule EXCEPT",
     "type": "Negative Factual",
     "correct": 1,
     "options": [
      "a meeting with academic advisors",
      "a library workshop",
      "a campus tour",
      "a speech by the Dean of Students"
     ],
     "explanation": "Экскурсия, речь декана и консультации по кафедрам в расписании есть. Занятия в библиотеке нет."
    }
   ],
   "id": "n6"
  },
  {
   "title": "Office Hours Change Email",
   "layout_type": "email",
   "passage": "Subject: Office hours this week\n\nHi everyone,\n\nI'm attending a conference in Denver from Wednesday to Friday this week, so my regular Thursday office hours are canceled. Instead, I will hold extra office hours on Monday from 2:00 to 4:00 P.M. in my office, Room 318.\n\nIf you can't come on Monday, feel free to email me your questions about the research paper, and I'll reply by Tuesday evening. Remember that the paper outline is still due next Monday as planned.\n\nProfessor Hughes",
   "questions": [
    {
     "text": "Why did Professor Hughes write this email?",
     "type": "Main Idea",
     "correct": 2,
     "options": [
      "To extend the deadline for the paper outline",
      "To explain how to write a research paper",
      "To announce a change to her office hours",
      "To invite students to a conference"
     ],
     "explanation": "Консультация в четверг отменена, вместо неё будет дополнительная в понедельник. Срок плана работы не меняется («still due… as planned»)."
    },
    {
     "text": "What can be inferred about the paper outline?",
     "type": "Inference",
     "correct": 2,
     "options": [
      "It is due this Thursday.",
      "It should be emailed by Tuesday.",
      "Its deadline has not been affected by the conference.",
      "It must be submitted in Denver."
     ],
     "explanation": "«The paper outline is still due next Monday as planned» — из-за поездки срок не сдвинули."
    },
    {
     "text": "What can students do if they cannot attend office hours on Monday?",
     "type": "Factual",
     "correct": 1,
     "options": [
      "Visit Professor Hughes on Thursday",
      "Email their questions",
      "Attend the conference",
      "Ask another professor"
     ],
     "explanation": "«Feel free to email me your questions… and I'll reply by Tuesday evening». Консультация в четверг отменена."
    }
   ],
   "id": "n7"
  },
  {
   "title": "Parking Permit Renewal Notice",
   "layout_type": "notice",
   "passage": "ATTENTION: PARKING PERMIT RENEWAL\n\nAll student parking permits for the current year expire on August 31.\n\nTo renew your permit for the new academic year:\n1. Log in to the Student Portal and select \"Parking Services.\"\n2. Upload a copy of your vehicle registration.\n3. Pay the annual fee of $180. Students who renew before August 1 receive a 10% discount.\n\nNew permits will be mailed within ten business days. Vehicles without a valid permit after September 1 may be ticketed.\n\nQuestions? Visit the Parking Office in the Student Services Building.",
   "questions": [
    {
     "text": "What is the main purpose of the notice?",
     "type": "Main Idea",
     "correct": 3,
     "options": [
      "To announce the opening of new parking lots",
      "To warn students about higher fines",
      "To advertise discounted bus passes",
      "To explain how to renew a parking permit"
     ],
     "explanation": "Объявление объясняет по шагам, как продлить парковочное разрешение. Штрафы упомянуты только как последствие."
    },
    {
     "text": "What is NOT required to renew a permit?",
     "type": "Negative Factual",
     "correct": 2,
     "options": [
      "Uploading a vehicle registration",
      "Paying a fee",
      "Showing a driver's license at the Parking Office",
      "Logging in to the Student Portal"
     ],
     "explanation": "Три шага: портал, копия регистрации машины, оплата. Права в офисе показывать не нужно — туда идут только с вопросами."
    },
    {
     "text": "How can students pay less for a permit?",
     "type": "Factual",
     "correct": 2,
     "options": [
      "By sharing a permit with a friend",
      "By renewing after September 1",
      "By renewing before August 1",
      "By visiting the Parking Office"
     ],
     "explanation": "«Students who renew before August 1 receive a 10% discount»."
    }
   ],
   "id": "n8"
  },
  {
   "title": "Grocery Run Text Chain",
   "layout_type": "chat",
   "passage": "Maya (6:40 P.M.)\nI'm at the grocery store. Do we need anything for the apartment?\n\nChris (6:42 P.M.)\nWe're out of milk and coffee. Also, could you grab some rice? I'm making curry for everyone on Saturday.\n\nMaya (6:44 P.M.)\nSure. Brown or white?\n\nChris (6:45 P.M.)\nWhite, please. And the big bag — there'll be eight of us.\n\nMaya (6:47 P.M.)\nGot it. They don't have the coffee we usually buy. Is another brand OK?\n\nChris (6:48 P.M.)\nAnything is fine, as long as it's not decaf!",
   "questions": [
    {
     "text": "Why does Chris ask Maya to buy rice?",
     "type": "Factual",
     "correct": 3,
     "options": [
      "They ran out of rice yesterday.",
      "Maya prefers brown rice.",
      "Rice is on sale at the store.",
      "He is cooking a meal on Saturday."
     ],
     "explanation": "«Could you grab some rice? I'm making curry for everyone on Saturday»."
    },
    {
     "text": "What can be inferred about Chris's plans for Saturday?",
     "type": "Inference",
     "correct": 3,
     "options": [
      "He will eat at a restaurant.",
      "He will go grocery shopping.",
      "He will be away from the apartment.",
      "He will cook for a group of people."
     ],
     "explanation": "Он готовит карри «for everyone», и их будет восемь человек — значит, он будет готовить на компанию."
    },
    {
     "text": "Why does Chris write, \"there'll be eight of us\"?",
     "type": "Rhetorical Purpose",
     "correct": 2,
     "options": [
      "To complain about the number of guests",
      "To ask Maya to buy more coffee",
      "To explain why Maya should buy a large bag",
      "To invite Maya to a party"
     ],
     "explanation": "Фраза идёт сразу после «And the big bag» — он объясняет, почему нужна большая пачка риса."
    }
   ],
   "id": "n9"
  },
  {
   "title": "Language Exchange Café Ad",
   "layout_type": "advertisement",
   "passage": "PRACTICE A NEW LANGUAGE OVER COFFEE!\n\nJoin the International Student Office's Language Exchange Café every Wednesday from 5 to 7 P.M. at the Bean Corner Café.\n\nHow it works:\nEach table focuses on a different language — Spanish, Mandarin, French, Arabic, and more. Spend 30 minutes speaking your target language, then switch and help a partner practice yours.\n\nAll levels are welcome, from complete beginners to near-fluent speakers. The first drink is on us!\n\nQuestions? Email exchange@isoffice.edu",
   "questions": [
    {
     "text": "What is the purpose of the advertisement?",
     "type": "Main Idea",
     "correct": 0,
     "options": [
      "To invite people to a regular language practice event",
      "To advertise a new café menu",
      "To recruit language teachers",
      "To announce a language exam"
     ],
     "explanation": "Реклама языкового клуба, который проходит каждую среду. Меню кафе и экзаменов в тексте нет."
    },
    {
     "text": "What do participants receive for free?",
     "type": "Factual",
     "correct": 0,
     "options": [
      "Their first drink",
      "A private lesson",
      "A membership card",
      "A language textbook"
     ],
     "explanation": "«The first drink is on us!» — первый напиток бесплатно."
    },
    {
     "text": "What is suggested about the participants?",
     "type": "Inference",
     "correct": 0,
     "options": [
      "They are expected to help others practice their own language.",
      "They must already speak at least two languages well.",
      "They are all international students.",
      "They must email the office before attending."
     ],
     "explanation": "«Then switch and help a partner practice yours» — участники помогают другим с родным языком. Начинающие тоже приглашаются, так что B неверно."
    }
   ],
   "id": "n10"
  },
  {
   "title": "Library Hold Ready Email",
   "layout_type": "email",
   "passage": "Subject: Your requested item is ready\n\nDear Jordan Lee,\n\nThe book you placed on hold, \"Introduction to Marine Ecology\" (3rd edition), is now available for pickup at the circulation desk of Morris Library.\n\nThe item will be held for you until Friday, October 17. After that date, it will be released to the next person on the waiting list.\n\nPlease note that because this book is in high demand, the loan period is 7 days instead of the usual 21 days, and it cannot be renewed.\n\nMorris Library Circulation Services",
   "questions": [
    {
     "text": "According to the email, what is NOT true about the book?",
     "type": "Negative Factual",
     "correct": 3,
     "options": [
      "Other people are waiting for it.",
      "It is a third edition.",
      "It is available at the circulation desk.",
      "It can be renewed after 7 days."
     ],
     "explanation": "«It cannot be renewed» — продлить нельзя. Остальное в письме есть: книга на стойке выдачи, есть очередь, это 3-е издание."
    },
    {
     "text": "What will most likely happen if Jordan does not pick up the book by October 17?",
     "type": "Inference",
     "correct": 1,
     "options": [
      "The book will be mailed to Jordan.",
      "Another person will be able to borrow it.",
      "Jordan will have to pay a fine.",
      "The loan period will be extended."
     ],
     "explanation": "После 17 октября книгу «will be released to the next person on the waiting list» — её получит следующий в очереди. О штрафе ничего нет."
    },
    {
     "text": "Why is the loan period shorter than usual?",
     "type": "Factual",
     "correct": 1,
     "options": [
      "The library is closing for renovation.",
      "Many people want to borrow the book.",
      "Jordan has overdue books.",
      "It is a reference book."
     ],
     "explanation": "«Because this book is in high demand, the loan period is 7 days»."
    }
   ],
   "id": "n11"
  },
  {
   "title": "Short Film Festival Call",
   "layout_type": "notice",
   "passage": "CALL FOR ENTRIES: CAMPUS SHORT FILM FESTIVAL\n\nHave a story to tell? The Film Society invites all current students to submit short films for our 10th annual festival.\n\nRules:\n• Films must be no longer than 10 minutes.\n• Any genre is welcome: drama, comedy, documentary, or animation.\n• Each student may submit only one film.\n\nSubmission deadline: February 28. Upload your film at filmsociety.edu/festival.\n\nSelected films will be screened at the Arts Center on April 5, and audience members will vote for the Best Film award. The winner receives $500 and a meeting with a professional film editor.",
   "questions": [
    {
     "text": "What is the main purpose of the notice?",
     "type": "Main Idea",
     "correct": 1,
     "options": [
      "To sell tickets for a screening",
      "To encourage students to submit films to a festival",
      "To advertise a filmmaking class",
      "To announce the winner of a competition"
     ],
     "explanation": "«Call for entries» — приглашение подавать фильмы на фестиваль. Победителя ещё нет, билеты не продают."
    },
    {
     "text": "Which of the following is NOT a rule for the festival?",
     "type": "Negative Factual",
     "correct": 0,
     "options": [
      "Films must be made by a team.",
      "Films cannot be longer than 10 minutes.",
      "Films can be of any genre.",
      "Each student may submit only one film."
     ],
     "explanation": "Три правила: до 10 минут, любой жанр, один фильм от студента. Про обязательную работу в команде ничего нет."
    },
    {
     "text": "What can be inferred about the Best Film award?",
     "type": "Inference",
     "correct": 2,
     "options": [
      "It is awarded every month.",
      "Only documentaries can win it.",
      "The winner is chosen by the people who attend the screening.",
      "It is given by a professional film editor."
     ],
     "explanation": "«Audience members will vote for the Best Film award» — победителя выбирают зрители показа. С монтажёром победитель только встретится."
    }
   ],
   "id": "n12"
  },
  {
   "title": "Floor Meeting Email",
   "layout_type": "email",
   "passage": "Subject: Mandatory floor meeting on Sunday\n\nHi residents of the third floor,\n\nWe'll be holding a mandatory floor meeting this Sunday at 8:00 P.M. in the study lounge. We'll go over quiet hours, kitchen cleaning, and the new key card system that starts next month.\n\nI know Sunday evenings are busy, so I'll keep it brief — no more than 30 minutes. Pizza will be provided! If you absolutely cannot attend, please message me beforehand so I can share the notes with you.\n\nSee you there,\nLeah Martin\nResident Advisor",
   "questions": [
    {
     "text": "Why does Leah mention that \"Pizza will be provided\"?",
     "type": "Rhetorical Purpose",
     "correct": 3,
     "options": [
      "To announce a change in kitchen rules",
      "To explain why the meeting is on Sunday",
      "To ask residents to bring food",
      "To encourage residents to attend the meeting"
     ],
     "explanation": "Собрание обязательное, но в воскресенье вечером все заняты — пицца служит приятным стимулом прийти.",
     "highlight": "Pizza will be provided",
     "highlight_occurrence": 1
    },
    {
     "text": "The word \"brief\" in the email is closest in meaning to",
     "type": "Vocabulary",
     "correct": 1,
     "options": [
      "formal",
      "short",
      "serious",
      "private"
     ],
     "explanation": "«I'll keep it brief — no more than 30 minutes» — коротким."
    },
    {
     "text": "Which topic is NOT mentioned as part of the meeting?",
     "type": "Negative Factual",
     "correct": 1,
     "options": [
      "The new key card system",
      "Room assignments for next year",
      "Quiet hours",
      "Kitchen cleaning"
     ],
     "explanation": "Тихие часы, уборка кухни и ключ-карты в письме есть. О распределении комнат ничего нет."
    }
   ],
   "id": "n13"
  },
  {
   "title": "Bookstore Buyback Notice",
   "layout_type": "notice",
   "passage": "TEXTBOOK BUYBACK WEEK\n\nThe Campus Bookstore will buy back used textbooks from Monday, December 8, through Friday, December 12, from 9 A.M. to 5 P.M.\n\n• Bring books to the counter on the lower level.\n• Books must be in good condition, with no missing pages or water damage.\n• Prices depend on whether the book will be used again next semester. Books required for upcoming courses may earn up to 50% of the original price.\n\nPlease note: access codes for online materials cannot be resold.\n\nPayment will be made in cash or as store credit, which is worth 10% more.",
   "questions": [
    {
     "text": "Why does the notice mention that store credit \"is worth 10% more\"?",
     "type": "Rhetorical Purpose",
     "correct": 0,
     "options": [
      "To make store credit more attractive than cash",
      "To explain why prices change each semester",
      "To warn students about damaged books",
      "To describe the cost of new textbooks"
     ],
     "explanation": "Подчёркивает выгоду: кредит в магазине на 10% больше, чем наличные, — так студентов подталкивают его выбрать.",
     "highlight": "is worth 10% more",
     "highlight_occurrence": 1
    },
    {
     "text": "The word \"upcoming\" in the notice is closest in meaning to",
     "type": "Vocabulary",
     "correct": 2,
     "options": [
      "popular",
      "online",
      "future",
      "difficult"
     ],
     "explanation": "Upcoming courses — предстоящие, будущие курсы следующего семестра."
    },
    {
     "text": "According to the notice, what will the bookstore NOT buy?",
     "type": "Negative Factual",
     "correct": 2,
     "options": [
      "Books in good condition",
      "Books needed for next semester",
      "Online access codes",
      "Books with all their pages"
     ],
     "explanation": "«Access codes for online materials cannot be resold» — коды доступа не выкупают."
    }
   ],
   "id": "n14"
  },
  {
   "title": "Running Club Post",
   "layout_type": "social_media",
   "passage": "Campus Running Club\n\nHuge thanks to everyone who came out for Saturday's 5K charity run! Despite the chilly start, more than 120 runners and walkers crossed the finish line, and together we raised $3,400 for the city children's hospital.\n\nA special shout-out to our volunteers, who were up at 6 A.M. setting up tables and marking the route. We couldn't have done it without you.\n\nPhotos are now up on our page. Our regular group runs start again next Tuesday at 7 A.M. by the library steps — all paces welcome!",
   "questions": [
    {
     "text": "Why does the post mention that volunteers \"were up at 6 A.M.\"?",
     "type": "Rhetorical Purpose",
     "correct": 1,
     "options": [
      "To complain about the early start",
      "To show appreciation for the effort volunteers made",
      "To explain why the run started late",
      "To invite people to future group runs"
     ],
     "explanation": "Это часть благодарности волонтёрам: они встали в 6 утра, чтобы всё подготовить.",
     "highlight": "were up at 6 A.M.",
     "highlight_occurrence": 1
    },
    {
     "text": "The word \"chilly\" in the post is closest in meaning to",
     "type": "Vocabulary",
     "correct": 3,
     "options": [
      "late",
      "slow",
      "rainy",
      "cold"
     ],
     "explanation": "Chilly start — прохладное, холодное начало утра."
    },
    {
     "text": "What is NOT mentioned in the post?",
     "type": "Negative Factual",
     "correct": 3,
     "options": [
      "The time of the next group run",
      "The amount of money raised",
      "The number of participants",
      "The name of the race winner"
     ],
     "explanation": "Сумма, число участников и время следующей пробежки есть. Победителя забега не называют."
    }
   ],
   "id": "n15"
  },
  {
   "title": "Study Abroad Info Session Ad",
   "layout_type": "advertisement",
   "passage": "DREAMING OF STUDYING ABROAD?\n\nCome to our Study Abroad Information Session on Thursday, February 6, at 4 P.M. in Hayes Hall, Room 210.\n\nLearn about:\n• Semester and summer programs in over 30 countries\n• Scholarships available specifically for study abroad\n• How to transfer credits so you can still graduate on time\n\nHear from students who just returned from Spain, Japan, and Ghana, and get your questions answered by our advisors.\n\nApplications for fall programs are due March 15 — don't miss your chance!",
   "questions": [
    {
     "text": "The phrase \"on time\" in the advertisement is closest in meaning to",
     "type": "Vocabulary",
     "correct": 0,
     "options": [
      "as originally planned",
      "very early",
      "at night",
      "in another country"
     ],
     "explanation": "Graduate on time — окончить вуз в срок, без задержки."
    },
    {
     "text": "Why does the advertisement mention students \"who just returned from Spain, Japan, and Ghana\"?",
     "type": "Rhetorical Purpose",
     "correct": 2,
     "options": [
      "To announce a new scholarship",
      "To explain how credits are transferred",
      "To show that attendees can hear about real experiences abroad",
      "To list the only countries available"
     ],
     "explanation": "На встрече выступят студенты, которые недавно вернулись, — можно узнать о реальном опыте. Стран в программах больше 30.",
     "highlight": "who just returned from Spain, Japan, and Ghana",
     "highlight_occurrence": 1
    },
    {
     "text": "What is the main purpose of the advertisement?",
     "type": "Main Idea",
     "correct": 2,
     "options": [
      "To advertise language classes",
      "To recruit advisors for a new office",
      "To invite students to learn about studying in other countries",
      "To announce that applications are closed"
     ],
     "explanation": "Реклама информационной встречи о программах обучения за рубежом."
    }
   ],
   "id": "n16"
  },
  {
   "title": "Lost Laptop Text Chain",
   "layout_type": "chat",
   "passage": "Sam Rivera (1:15 P.M.)\nDid anyone find a silver laptop in the chemistry lecture hall? I think I left it under my seat this morning.\n\nAisha Khan (1:18 P.M.)\nOh no! I didn't see one, but the building's front desk keeps a lost-and-found box.\n\nSam Rivera (1:19 P.M.)\nGood call. Do you know when they close?\n\nAisha Khan (1:21 P.M.)\nI think around 5. You should also email Professor Grant — the next class uses that room at 2.\n\nSam Rivera (1:22 P.M.)\nOn it. My whole term paper is on there, and I didn't back it up.\n\nAisha Khan (1:24 P.M.)\nFingers crossed! Let me know what happens.",
   "questions": [
    {
     "text": "The phrase \"On it\" in the text chain is closest in meaning to",
     "type": "Vocabulary",
     "correct": 1,
     "options": [
      "I don't know",
      "I'm doing that now",
      "That's not possible",
      "I've finished"
     ],
     "explanation": "«On it» — разговорное «уже делаю, займусь этим»."
    },
    {
     "text": "Why does Aisha mention that \"the next class uses that room at 2\"?",
     "type": "Rhetorical Purpose",
     "correct": 3,
     "options": [
      "To explain why she was late",
      "To invite Sam to the next class",
      "To say that the lost-and-found is closed",
      "To suggest that Sam should act quickly before others use the room"
     ],
     "explanation": "Совет написать профессору сразу: в 2 часа в аудиторию придёт следующая группа, и ноутбук могут забрать или передвинуть.",
     "highlight": "the next class uses that room at 2",
     "highlight_occurrence": 1
    },
    {
     "text": "Which of the following is NOT suggested as a way for Sam to find the laptop?",
     "type": "Negative Factual",
     "correct": 0,
     "options": [
      "Calling campus security",
      "Checking the lost-and-found box",
      "Emailing Professor Grant",
      "Asking the front desk"
     ],
     "explanation": "Коробка находок на стойке и письмо профессору предложены. Охрану кампуса не упоминают."
    }
   ],
   "id": "n17"
  },
  {
   "title": "Museum Membership Webpage",
   "layout_type": "webpage",
   "passage": "https://www.harborartmuseum.org/membership\n\nBecome a Member\n\nStudent Membership — $25 per year\n• Free admission all year\n• 10% discount in the museum shop and café\n• Invitations to members-only evening events\n\nFamily Membership — $90 per year\n• Free admission for two adults and up to four children\n• All student benefits, plus free entry to special exhibitions\n\nMembership pays for itself in just three visits! A valid student ID is required for the student rate.",
   "questions": [
    {
     "text": "The phrase \"pays for itself\" on the webpage is closest in meaning to",
     "type": "Vocabulary",
     "correct": 2,
     "options": [
      "is cheaper for families",
      "must be paid in advance",
      "saves as much money as it costs",
      "is paid by the museum"
     ],
     "explanation": "Абонемент окупается за три посещения: сэкономленные билеты покрывают его цену."
    },
    {
     "text": "Why does the webpage mention \"members-only evening events\"?",
     "type": "Rhetorical Purpose",
     "correct": 0,
     "options": [
      "To describe one of the benefits of a student membership",
      "To announce the museum's closing time",
      "To explain the cost of family memberships",
      "To show that students cannot visit during the day"
     ],
     "explanation": "Это один из пунктов в списке преимуществ студенческого абонемента.",
     "highlight": "members-only evening events",
     "highlight_occurrence": 1
    },
    {
     "text": "What is the main purpose of the webpage?",
     "type": "Main Idea",
     "correct": 3,
     "options": [
      "To advertise a special exhibition",
      "To describe the history of the museum",
      "To sell tickets for a single visit",
      "To explain membership options and their benefits"
     ],
     "explanation": "Страница описывает два вида абонементов, их цены и преимущества."
    }
   ],
   "id": "n18"
  },
  {
   "title": "Campus Garden Volunteer Email",
   "layout_type": "email",
   "passage": "Subject: Help needed at the campus garden\n\nDear volunteers,\n\nThanks to your hard work this spring, the campus garden has produced more vegetables than ever. We've donated over 200 kilograms of produce to the student food pantry so far!\n\nWith summer break approaching, however, many of our regular volunteers will be leaving town. We need people to water and harvest on weekday mornings in June and July. Each shift takes about an hour, and you can sign up for as many or as few as you like using the online calendar.\n\nThank you for keeping the garden growing,\nMarcus Webb\nGarden Coordinator",
   "questions": [
    {
     "text": "Why does Marcus mention that many regular volunteers \"will be leaving town\"?",
     "type": "Rhetorical Purpose",
     "correct": 1,
     "options": [
      "To describe the food pantry's summer hours",
      "To explain why more help is needed during the summer",
      "To announce that the garden will close",
      "To thank volunteers for their donations"
     ],
     "explanation": "Постоянные волонтёры разъедутся на лето, поэтому нужны люди на июнь и июль.",
     "highlight": "will be leaving town",
     "highlight_occurrence": 1
    },
    {
     "text": "The word \"produce\" in the email is closest in meaning to",
     "type": "Vocabulary",
     "correct": 3,
     "options": [
      "money",
      "tools",
      "seeds",
      "fruits and vegetables"
     ],
     "explanation": "Здесь produce — существительное: свежие овощи и фрукты, урожай."
    },
    {
     "text": "How can volunteers sign up for shifts?",
     "type": "Factual",
     "correct": 2,
     "options": [
      "By visiting the food pantry",
      "By replying to the email",
      "By using the online calendar",
      "By calling Marcus"
     ],
     "explanation": "«You can sign up… using the online calendar»."
    }
   ],
   "id": "n19"
  },
  {
   "title": "Printing Policy Notice",
   "layout_type": "notice",
   "passage": "NEW PRINTING POLICY — LIBRARY COMPUTER LAB\n\nStarting September 1, each student will receive 300 free printed pages per semester. Your remaining balance will be displayed when you log in to any lab computer.\n\nAfter the free pages are used, printing will cost 10 cents per black-and-white page and 50 cents per color page, charged to your student account.\n\nTo reduce waste, all print jobs will be held for 24 hours and released only when you swipe your ID card at the printer. Unclaimed jobs will be deleted automatically.\n\nQuestions? Ask at the IT Help Desk on the first floor.",
   "questions": [
    {
     "text": "Why does the notice mention that print jobs are released only when students swipe their ID cards?",
     "type": "Rhetorical Purpose",
     "correct": 2,
     "options": [
      "To announce new printer locations",
      "To show that color printing is expensive",
      "To explain a step intended to reduce wasted paper",
      "To describe how students can get more free pages"
     ],
     "explanation": "«To reduce waste» — печать только после прикладывания карты, чтобы не пропадали невостребованные распечатки."
    },
    {
     "text": "The word \"Unclaimed\" in the notice is closest in meaning to",
     "type": "Vocabulary",
     "correct": 0,
     "options": [
      "not collected",
      "not paid for",
      "not printed",
      "not allowed"
     ],
     "explanation": "Unclaimed jobs — задания, которые никто не забрал (не подошёл к принтеру)."
    },
    {
     "text": "According to the notice, what is NOT true about the new policy?",
     "type": "Negative Factual",
     "correct": 1,
     "options": [
      "Print jobs are held for 24 hours.",
      "Unused free pages carry over to the next semester.",
      "Students receive 300 free pages each semester.",
      "Color pages cost more than black-and-white pages."
     ],
     "explanation": "300 страниц, цены и 24 часа в тексте есть. О переносе неиспользованных страниц на следующий семестр ничего не сказано."
    }
   ],
   "id": "n20"
  },
  {
   "title": "Café Review",
   "layout_type": "review",
   "passage": "The Corner Bean\n\nTucked between the bookstore and the post office, The Corner Bean is easy to miss, but it's worth seeking out. The coffee is excellent, roasted locally and brewed with care, and the homemade muffins sell out by mid-morning.\n\nSeating is limited to six small tables, so finding a spot during exam weeks can be a challenge. On the plus side, the staff never rush you, even if you linger over a single cup for hours. Wi-Fi is free, though it slows down when the café is full.\n\nPrices are slightly higher than at the chain café across the street, but the quality more than makes up for it.",
   "questions": [
    {
     "text": "Why does the reviewer mention that the muffins \"sell out by mid-morning\"?",
     "type": "Rhetorical Purpose",
     "correct": 3,
     "options": [
      "To complain that the café opens too late",
      "To explain why prices are high",
      "To show that the café bakes very few items",
      "To suggest that they are popular and that customers should come early"
     ],
     "explanation": "Маффины раскупают к середине утра — значит, они популярны и за ними стоит прийти пораньше.",
     "highlight": "sell out by mid-morning",
     "highlight_occurrence": 1
    },
    {
     "text": "The word \"linger\" in the review is closest in meaning to",
     "type": "Vocabulary",
     "correct": 1,
     "options": [
      "arrive early",
      "stay for a long time",
      "complain loudly",
      "pay quickly"
     ],
     "explanation": "Linger over a single cup for hours — засиживаться, долго оставаться."
    },
    {
     "text": "What can be inferred about the reviewer's overall opinion of The Corner Bean?",
     "type": "Inference",
     "correct": 3,
     "options": [
      "The reviewer prefers the chain café across the street.",
      "The reviewer thinks the Wi-Fi is the café's best feature.",
      "The reviewer would not return during exam weeks.",
      "The reviewer thinks it is worth visiting despite a few drawbacks."
     ],
     "explanation": "Минусы есть (мало мест, медленный Wi-Fi, цены), но «worth seeking out» и «the quality more than makes up for it» — в целом отзыв положительный."
    }
   ],
   "id": "n21"
  },
  {
   "title": "Course Syllabus Excerpt",
   "layout_type": "syllabus",
   "passage": "Introduction to Environmental Science (ENV 101)\n\nThis course introduces the major environmental challenges facing the world today, including climate change, water scarcity, and the loss of biodiversity. No prior science background is required.\n\nGrading:\nWeekly quizzes — 20%\nField trip report — 20%\nMidterm exam — 25%\nFinal project — 35%\n\nThe field trip to Clearwater Wetlands on October 12 is required. Students who cannot attend must arrange an alternative assignment with the instructor at least one week in advance. Late work will lose 5% for each day it is overdue.",
   "questions": [
    {
     "text": "Why does the syllabus mention that \"No prior science background is required\"?",
     "type": "Rhetorical Purpose",
     "correct": 0,
     "options": [
      "To reassure students without science experience that they can take the course",
      "To explain why the course has a field trip",
      "To warn students that the course is very difficult",
      "To describe the final project"
     ],
     "explanation": "Фраза снимает опасения: курс подходит и тем, у кого нет научной подготовки.",
     "highlight": "No prior science background is required",
     "highlight_occurrence": 1
    },
    {
     "text": "What is the main purpose of this document?",
     "type": "Main Idea",
     "correct": 0,
     "options": [
      "To describe the content and requirements of a course",
      "To advertise a trip to a wetland",
      "To announce the results of an exam",
      "To recruit science teachers"
     ],
     "explanation": "Это выдержка из программы курса: о чём он, из чего складывается оценка и какие правила."
    },
    {
     "text": "The word \"overdue\" in the syllabus is closest in meaning to",
     "type": "Vocabulary",
     "correct": 2,
     "options": [
      "difficult",
      "graded",
      "late",
      "incomplete"
     ],
     "explanation": "Overdue — просроченный, сданный после срока."
    }
   ],
   "id": "n22"
  },
  {
   "title": "Gym Closure Sign",
   "layout_type": "sign",
   "passage": "Recreation Center Pool Deck — Temporarily Closed\nThe pool deck will be closed Monday through Wednesday for tile repairs. Indoor lap swimming will continue as usual, but the hot tub and sauna will not be available. Swim team practices have been moved to 6 A.M. We apologize for the inconvenience. For updates, check the Recreation Center app.",
   "questions": [
    {
     "text": "What will NOT be available while the repairs take place?",
     "type": "Negative Factual",
     "correct": 2,
     "options": [
      "Swim team practice",
      "The Recreation Center app",
      "The hot tub",
      "Indoor lap swimming"
     ],
     "explanation": "«The hot tub and sauna will not be available». Плавание по дорожкам и тренировки команды продолжаются."
    },
    {
     "text": "What can be inferred about swim team practices?",
     "type": "Inference",
     "correct": 0,
     "options": [
      "They usually take place at a different time.",
      "They have been canceled for the week.",
      "They will be held outdoors.",
      "They take place in the sauna."
     ],
     "explanation": "«Have been moved to 6 A.M.» — тренировки перенесли, значит, обычно они в другое время."
    },
    {
     "text": "What is the main purpose of the sign?",
     "type": "Main Idea",
     "correct": 1,
     "options": [
      "To recruit members for the swim team",
      "To inform people about a temporary closure and related changes",
      "To advertise new swimming classes",
      "To announce the opening of a sauna"
     ],
     "explanation": "Объявление о временном закрытии и связанных изменениях."
    }
   ],
   "id": "n23"
  },
  {
   "title": "Bike Share Instructions",
   "layout_type": "instructions",
   "passage": "How to Rent a Campus Bike\n\nStep 1: Download the CampusRide app and create an account with your university email.\nStep 2: Scan the QR code on the bike's handlebars to unlock it.\nStep 3: Adjust the seat height using the quick-release lever.\nStep 4: When finished, return the bike to any CampusRide station and push it firmly into the dock until you hear a click.\n\nRides under 30 minutes are free. After that, a fee of $1 per additional 15 minutes will be charged. Bikes left outside a station will result in a $20 fee.",
   "questions": [
    {
     "text": "The word \"firmly\" in the instructions is closest in meaning to",
     "type": "Vocabulary",
     "correct": 3,
     "options": [
      "quickly",
      "gently",
      "carefully",
      "strongly"
     ],
     "explanation": "Push it firmly — с силой, крепко вдвинуть до щелчка."
    },
    {
     "text": "What should a rider do to unlock a bike?",
     "type": "Factual",
     "correct": 3,
     "options": [
      "Push the bike into the dock",
      "Enter a university email at the station",
      "Pay $1 at the station",
      "Scan the QR code on the handlebars"
     ],
     "explanation": "«Step 2: Scan the QR code on the bike's handlebars to unlock it»."
    },
    {
     "text": "Why do the instructions mention \"a $20 fee\"?",
     "type": "Rhetorical Purpose",
     "correct": 1,
     "options": [
      "To show the price of buying a bike",
      "To discourage riders from leaving bikes outside a station",
      "To explain the cost of a long ride",
      "To describe how to create an account"
     ],
     "explanation": "Штраф 20 долларов предупреждает: оставлять велосипед вне станции нельзя.",
     "highlight": "a $20 fee",
     "highlight_occurrence": 1
    }
   ],
   "id": "n24"
  },
  {
   "title": "Internship Fair Reminder Email",
   "layout_type": "email",
   "passage": "Subject: Reminder: Spring Internship Fair this Friday\n\nDear students,\n\nThis is a reminder that the Spring Internship Fair will take place this Friday from 10 A.M. to 3 P.M. in the Student Union Ballroom. More than 60 employers, including tech companies, hospitals, and nonprofit organizations, will be recruiting interns for the summer.\n\nTo make the most of the event, bring several printed copies of your résumé and dress in business attire. If you would like feedback on your résumé before Friday, our advisors are offering 15-minute walk-in reviews in the Career Center on Wednesday and Thursday afternoons.\n\nBest of luck,\nUniversity Career Center",
   "questions": [
    {
     "text": "What is the main purpose of the email?",
     "type": "Main Idea",
     "correct": 2,
     "options": [
      "To invite employers to the Career Center",
      "To explain how to write a résumé",
      "To remind students about an upcoming event for finding internships",
      "To announce the results of an internship competition"
     ],
     "explanation": "Письмо-напоминание о ярмарке стажировок в пятницу и советы, как к ней подготовиться."
    },
    {
     "text": "What does the Career Center offer before the fair?",
     "type": "Factual",
     "correct": 0,
     "options": [
      "Short résumé reviews without an appointment",
      "Free business clothing",
      "Interviews with employers",
      "Printed copies of résumés"
     ],
     "explanation": "«15-minute walk-in reviews» — короткие проверки резюме без записи (walk-in)."
    },
    {
     "text": "What can be inferred about the employers attending the fair?",
     "type": "Inference",
     "correct": 1,
     "options": [
      "They will review résumés on Wednesday.",
      "They come from a variety of fields.",
      "They are all technology companies.",
      "They will only accept online applications."
     ],
     "explanation": "Названы технологические компании, больницы и некоммерческие организации — сферы разные."
    }
   ],
   "id": "n25"
  },
  {
   "title": "Yoga Classes Advertisement",
   "layout_type": "advertisement",
   "passage": "STRESS LESS THIS SEMESTER!\n\nJoin free beginner yoga classes at the Wellness Center every Monday and Thursday from 6:00 to 7:00 P.M.\n\nNo experience? No problem. Our certified instructors will guide you through gentle stretches and simple breathing exercises designed to help you relax and sleep better.\n\nMats are provided, but space is limited to 20 participants per class, so arrive a few minutes early. Wear comfortable clothes and bring a water bottle.\n\nFeeling the pressure of midterms? Give yourself one hour a week to recharge.",
   "questions": [
    {
     "text": "What is the purpose of the advertisement?",
     "type": "Main Idea",
     "correct": 3,
     "options": [
      "To sell yoga mats",
      "To recruit yoga instructors",
      "To announce a midterm exam schedule",
      "To encourage students to attend free yoga classes"
     ],
     "explanation": "Реклама бесплатных занятий йогой для начинающих. Коврики выдают, а не продают."
    },
    {
     "text": "The word \"recharge\" in the advertisement is closest in meaning to",
     "type": "Vocabulary",
     "correct": 0,
     "options": [
      "regain energy",
      "pay again",
      "study more",
      "exercise harder"
     ],
     "explanation": "Recharge — перезарядиться, восстановить силы."
    },
    {
     "text": "Why does the advertisement mention that space is \"limited to 20 participants per class\"?",
     "type": "Rhetorical Purpose",
     "correct": 2,
     "options": [
      "To show that the classes are for experts",
      "To announce an additional class",
      "To advise people to arrive early",
      "To explain why mats are not provided"
     ],
     "explanation": "Сразу дальше: «so arrive a few minutes early» — мест мало, приходите заранее.",
     "highlight": "limited to 20 participants per class",
     "highlight_occurrence": 1
    }
   ],
   "id": "n26"
  },
  {
   "title": "Water Shut-Off Notice",
   "layout_type": "notice",
   "passage": "NOTICE TO ALL RESIDENTS OF BAKER HALL\n\nWater service will be shut off on Tuesday, November 4, from 9:00 A.M. to approximately 1:00 P.M. so that maintenance staff can replace a broken valve.\n\nDuring this time:\n• Sinks, showers, and toilets in Baker Hall will not work.\n• Residents may use the facilities in nearby Collins Hall, which will remain open to Baker Hall residents with a valid key card.\n• Please fill water bottles in advance.\n\nWe expect the work to be completed on schedule, but delays are possible. Updates will be posted in the lobby and sent by text message.",
   "questions": [
    {
     "text": "What is NOT mentioned in the notice?",
     "type": "Negative Factual",
     "correct": 3,
     "options": [
      "The reason for the shut-off",
      "Where residents can use facilities during the work",
      "How residents will receive updates",
      "A discount on next month's rent"
     ],
     "explanation": "Причина (замена клапана), Collins Hall и обновления по SMS упомянуты. Скидки нет."
    },
    {
     "text": "What are residents advised to do before the shut-off?",
     "type": "Factual",
     "correct": 1,
     "options": [
      "Contact maintenance staff",
      "Fill water bottles",
      "Move to Collins Hall",
      "Request a new key card"
     ],
     "explanation": "«Please fill water bottles in advance»."
    },
    {
     "text": "The word \"approximately\" in the notice is closest in meaning to",
     "type": "Vocabulary",
     "correct": 1,
     "options": [
      "after",
      "about",
      "exactly",
      "no later than"
     ],
     "explanation": "Approximately 1:00 P.M. — примерно до часа дня, поэтому дальше и сказано о возможных задержках."
    }
   ],
   "id": "n27"
  },
  {
   "title": "Surprise Party Text Chain",
   "layout_type": "chat",
   "passage": "Nora Ellis (7:02 P.M.)\nSo we're still doing the surprise for Kenji on Saturday, right?\n\nBen Ortiz (7:05 P.M.)\nYes! I booked the back room at Luigi's for 7. I told Kenji we're just getting dinner, the two of us.\n\nNora Ellis (7:06 P.M.)\nPerfect. I'll order the cake. Chocolate or lemon?\n\nBen Ortiz (7:08 P.M.)\nDefinitely chocolate. He's been talking about the chocolate cake from Rosa's Bakery for weeks.\n\nNora Ellis (7:10 P.M.)\nGot it. Everyone else should get there by 6:45 so we're ready when you walk in.\n\nBen Ortiz (7:11 P.M.)\nSounds good. And please don't post anything online before Saturday — he checks everything!",
   "questions": [
    {
     "text": "What can be inferred about Kenji?",
     "type": "Inference",
     "correct": 2,
     "options": [
      "He prefers lemon cake.",
      "He works at Luigi's.",
      "He does not know about the party.",
      "He planned the party himself."
     ],
     "explanation": "Бен сказал Кендзи, что они просто идут ужинать вдвоём, и просит ничего не публиковать — Кендзи о празднике не знает."
    },
    {
     "text": "Why does Ben write, \"He's been talking about the chocolate cake from Rosa's Bakery for weeks\"?",
     "type": "Rhetorical Purpose",
     "correct": 3,
     "options": [
      "To suggest a different restaurant",
      "To complain about Kenji",
      "To ask Nora to pick up Kenji",
      "To explain why he chose chocolate"
     ],
     "explanation": "Это объяснение к «Definitely chocolate»: Кендзи давно говорит именно об этом торте."
    },
    {
     "text": "What are Nora and Ben mainly discussing?",
     "type": "Main Idea",
     "correct": 0,
     "options": [
      "Plans for a surprise celebration",
      "Where to have dinner with Kenji next week",
      "How to bake a chocolate cake",
      "Which bakery has better prices"
     ],
     "explanation": "Переписка о подготовке сюрприза на субботу: зал, торт, время сбора."
    }
   ],
   "id": "n28"
  },
  {
   "title": "Library Holiday Hours",
   "layout_type": "schedule",
   "passage": "MAIN LIBRARY — WINTER BREAK HOURS\n\nDecember 20–23 | 9:00 A.M.–5:00 P.M.\nDecember 24–26 | Closed\nDecember 27–30 | 10:00 A.M.–4:00 P.M.\nDecember 31–January 1 | Closed\nJanuary 2–12 | 9:00 A.M.–6:00 P.M.\nJanuary 13 | Regular semester hours resume (7:00 A.M.–midnight)\n\nThe book return box outside the main entrance remains open at all times. Online databases and e-books are available 24 hours a day with your student login. Group study rooms cannot be reserved during the break.",
   "questions": [
    {
     "text": "When do regular semester hours begin again?",
     "type": "Factual",
     "correct": 2,
     "options": [
      "December 27",
      "January 1",
      "January 13",
      "January 2"
     ],
     "explanation": "«January 13 | Regular semester hours resume»."
    },
    {
     "text": "According to the schedule, what is NOT available during the break?",
     "type": "Negative Factual",
     "correct": 0,
     "options": [
      "Group study room reservations",
      "The book return box",
      "Online databases",
      "E-books"
     ],
     "explanation": "«Group study rooms cannot be reserved during the break». Ящик возврата и электронные ресурсы работают."
    },
    {
     "text": "The word \"resume\" in the schedule is closest in meaning to",
     "type": "Vocabulary",
     "correct": 2,
     "options": [
      "end",
      "are posted",
      "start again",
      "are reduced"
     ],
     "explanation": "Resume — возобновляться: обычные часы снова начинают действовать."
    }
   ],
   "id": "n29"
  },
  {
   "title": "Robotics Team Article",
   "layout_type": "article",
   "passage": "Student Robotics Team Takes First Place\n\nThe university's robotics team won first place at the National Collegiate Robotics Challenge last weekend, beating 48 teams from across the country. Their robot, nicknamed \"Scout,\" was designed to navigate a simulated disaster zone and locate trapped survivors.\n\nTeam captain Priya Desai said the victory came after months of setbacks. \"Our first prototype couldn't climb even a small step,\" she explained. \"We rebuilt the wheels three times.\" The team, made up of engineering and computer science students, met almost every evening this semester.\n\nThe team will receive $10,000, which members plan to use to attend an international competition in Germany next summer.",
   "questions": [
    {
     "text": "Why does the article quote Priya Desai saying, \"Our first prototype couldn't climb even a small step\"?",
     "type": "Rhetorical Purpose",
     "correct": 0,
     "options": [
      "To illustrate the difficulties the team overcame",
      "To criticize the design of the final robot",
      "To explain the rules of the competition",
      "To show that the team almost withdrew"
     ],
     "explanation": "Цитата иллюстрирует «months of setbacks» — неудачи, которые команда преодолела."
    },
    {
     "text": "What can be inferred about the team members?",
     "type": "Inference",
     "correct": 3,
     "options": [
      "They had built robots for many years.",
      "They all studied computer science.",
      "They have already competed in Germany.",
      "They were very committed to the project."
     ],
     "explanation": "Встречались почти каждый вечер весь семестр и трижды переделывали колёса — очень увлечены проектом."
    },
    {
     "text": "What is the article mainly about?",
     "type": "Main Idea",
     "correct": 1,
     "options": [
      "A competition held in Germany",
      "A university team's victory in a robotics competition",
      "A disaster that trapped survivors",
      "A new engineering course"
     ],
     "explanation": "Статья о победе университетской команды на национальном конкурсе робототехники."
    }
   ],
   "id": "n30"
  },
  {
   "title": "Campus Shuttle Webpage",
   "layout_type": "webpage",
   "passage": "https://www.northfield.edu/transportation/shuttle\n\nCampus Shuttle Service\n\nFree shuttles run every 15 minutes between the Main Campus, the Medical Campus, and the Riverside Apartments, Monday through Friday, 7:00 A.M. to 11:00 P.M. Weekend service runs every 30 minutes from 9:00 A.M. to 9:00 P.M.\n\nTrack shuttles in real time with the NorthfieldGo app. All shuttles are wheelchair accessible and have racks for two bicycles.\n\nPlease note: shuttles do not operate on university holidays.",
   "questions": [
    {
     "text": "The word \"accessible\" on the webpage is closest in meaning to",
     "type": "Vocabulary",
     "correct": 3,
     "options": [
      "expensive",
      "crowded",
      "comfortable",
      "able to be used"
     ],
     "explanation": "Wheelchair accessible — доступный для людей на инвалидных колясках, ими можно пользоваться."
    },
    {
     "text": "How often do shuttles run on weekends?",
     "type": "Factual",
     "correct": 3,
     "options": [
      "Every 15 minutes",
      "Every hour",
      "Only on holidays",
      "Every 30 minutes"
     ],
     "explanation": "«Weekend service runs every 30 minutes»."
    },
    {
     "text": "What is NOT mentioned about the shuttles?",
     "type": "Negative Factual",
     "correct": 1,
     "options": [
      "They do not run on holidays.",
      "They require a ticket.",
      "They carry bicycles.",
      "They can be tracked with an app."
     ],
     "explanation": "Шаттлы бесплатные («Free shuttles»), билет не нужен. Остальное на странице есть."
    }
   ],
   "id": "n31"
  },
  {
   "title": "Research Volunteers Email",
   "layout_type": "email",
   "passage": "Subject: Volunteers needed for a memory study\n\nDear students,\n\nMy research team in the Psychology Department is looking for volunteers for a study on how background music affects memory. Participants will complete a series of short word-recall tasks on a computer while listening to different types of music.\n\nThe study takes about 45 minutes, and all participants will receive a $15 gift card. You must be at least 18 years old and have normal or corrected hearing. Your responses will be kept confidential and used only for research purposes.\n\nTo sign up, choose a time slot on our online schedule. Spots tend to fill quickly toward the end of the semester.\n\nDr. Helen Park",
   "questions": [
    {
     "text": "Why did Dr. Park write this email?",
     "type": "Main Idea",
     "correct": 2,
     "options": [
      "To invite students to a concert",
      "To offer a job in the Psychology Department",
      "To find participants for a research study",
      "To share the results of a study"
     ],
     "explanation": "Ищут добровольцев для исследования памяти."
    },
    {
     "text": "Why does Dr. Park mention that \"Spots tend to fill quickly toward the end of the semester\"?",
     "type": "Rhetorical Purpose",
     "correct": 1,
     "options": [
      "To describe the type of music used",
      "To encourage students to sign up soon",
      "To explain why the study takes 45 minutes",
      "To warn that the study will be canceled"
     ],
     "explanation": "Предупреждение, что места быстро заканчиваются, подталкивает записаться пораньше.",
     "highlight": "Spots tend to fill quickly toward the end of the semester",
     "highlight_occurrence": 1
    },
    {
     "text": "What can be inferred about the study?",
     "type": "Inference",
     "correct": 0,
     "options": [
      "Participants will need to listen to sounds.",
      "Participants must be psychology majors.",
      "Participants will be paid in cash.",
      "Participants' names will be published."
     ],
     "explanation": "Задания выполняют под музыку, а требование — нормальный слух. Значит, участникам нужно слушать."
    }
   ],
   "id": "n32"
  },
  {
   "title": "Bookstore Receipt",
   "layout_type": "receipt",
   "passage": "Campus Bookstore\nThank you for shopping with us!\n\nDate: September 3\nTransaction No.: 58821\n\nBiology Lab Manual (used): $32.00\nGraphing Calculator: $89.99\nNotebook (3-pack): $7.50\nStudent discount (10%): –$12.95\nSubtotal: $116.54\nTax: $8.16\nTotal: $124.70\n\nPaid by: Credit card\nReturns accepted within 14 days with receipt. Calculators must be unopened.",
   "questions": [
    {
     "text": "Which item is NOT listed on the receipt?",
     "type": "Negative Factual",
     "correct": 2,
     "options": [
      "A calculator",
      "Notebooks",
      "A backpack",
      "A lab manual"
     ],
     "explanation": "Методичка, калькулятор и тетради в чеке есть. Рюкзака нет."
    },
    {
     "text": "The word \"unopened\" on the receipt is closest in meaning to",
     "type": "Vocabulary",
     "correct": 0,
     "options": [
      "still in its original package",
      "not paid for",
      "broken",
      "used"
     ],
     "explanation": "Unopened — нераспакованный, в оригинальной упаковке."
    },
    {
     "text": "How did the customer pay?",
     "type": "Factual",
     "correct": 0,
     "options": [
      "By credit card",
      "In cash",
      "With store credit",
      "By check"
     ],
     "explanation": "«Paid by: Credit card»."
    }
   ],
   "id": "n33"
  },
  {
   "title": "Hiking Trip Post",
   "layout_type": "social_media",
   "passage": "Lena Fischer\n\nFinally made it to the top of Eagle Peak this weekend! The trail guide said four hours, but with all our photo stops it took us closer to six.\n\nThe last kilometer was brutal — steep, rocky, and windy — and I seriously considered turning back. I'm so glad I didn't. The view over the lake at sunset was unreal.\n\nLesson learned: pack more water than you think you need. We ran out halfway down and had to ration what was left. Already planning the next trip!",
   "questions": [
    {
     "text": "What can be inferred about the hike?",
     "type": "Inference",
     "correct": 1,
     "options": [
      "It took less time than the guide said.",
      "It was harder than Lena expected near the end.",
      "Lena hiked alone.",
      "Lena did not reach the top."
     ],
     "explanation": "Последний километр «brutal», она думала повернуть назад — к концу стало тяжелее, чем ожидалось. Поход занял шесть часов, а не четыре."
    },
    {
     "text": "What is the main purpose of the post?",
     "type": "Main Idea",
     "correct": 3,
     "options": [
      "To advertise a hiking tour",
      "To warn people not to visit Eagle Peak",
      "To sell water bottles",
      "To share an experience of a challenging hike"
     ],
     "explanation": "Лена делится впечатлениями о трудном восхождении и выводом на будущее."
    },
    {
     "text": "Why does Lena mention that they \"ran out halfway down\"?",
     "type": "Rhetorical Purpose",
     "correct": 2,
     "options": [
      "To describe the view from the top",
      "To complain about the trail guide",
      "To explain why she advises bringing extra water",
      "To show that the trail was crowded"
     ],
     "explanation": "Вода кончилась на полпути вниз — отсюда урок: «pack more water than you think you need».",
     "highlight": "ran out halfway down",
     "highlight_occurrence": 1
    }
   ],
   "id": "n34"
  },
  {
   "title": "Blood Drive Poster",
   "layout_type": "poster",
   "passage": "GIVE BLOOD, SAVE LIVES!\n\nThe Student Health Association is hosting a blood drive in the Fitness Center gym on Wednesday, April 9, from 10 A.M. to 4 P.M.\n\n• One donation can help up to three patients.\n• The process takes about an hour, but the actual donation takes only 10 minutes.\n• Donors must be at least 17 years old, weigh at least 50 kilograms, and feel healthy on the day of donation.\n• Eat a full meal and drink plenty of water beforehand.\n\nWalk-ins welcome, but appointments are recommended. Every donor receives a free T-shirt and snacks!",
   "questions": [
    {
     "text": "How long does the actual blood donation take?",
     "type": "Factual",
     "correct": 1,
     "options": [
      "About four hours",
      "About 10 minutes",
      "About an hour",
      "About 30 minutes"
     ],
     "explanation": "«The process takes about an hour, but the actual donation takes only 10 minutes»."
    },
    {
     "text": "Which of the following is NOT a requirement for donors?",
     "type": "Negative Factual",
     "correct": 3,
     "options": [
      "Being at least 17 years old",
      "Weighing at least 50 kilograms",
      "Feeling healthy on the day",
      "Being a member of the Student Health Association"
     ],
     "explanation": "Возраст, вес и самочувствие — требования. Членство в ассоциации не нужно."
    },
    {
     "text": "The word \"beforehand\" in the poster is closest in meaning to",
     "type": "Vocabulary",
     "correct": 1,
     "options": [
      "carefully",
      "in advance",
      "afterward",
      "regularly"
     ],
     "explanation": "Beforehand — заранее, перед донацией."
    }
   ],
   "id": "n35"
  },
  {
   "title": "Student Theater Review",
   "layout_type": "review",
   "passage": "\"The Lighthouse Keeper\" — Westbrook Student Theater\n\nThe theater department's latest production tells the story of an elderly lighthouse keeper whose quiet life is disrupted when a shipwrecked stranger washes ashore. Senior Marcus Bell gives a moving performance as the keeper, conveying loneliness with barely a word.\n\nThe set design deserves special mention. Using only a rotating platform and clever lighting, the crew transforms the small stage from a stormy coastline into a cozy kitchen in seconds.\n\nThe second act drags somewhat, and a few scenes could have been shortened. Still, this is one of the strongest student productions in years. Performances run through Sunday; tickets are $8 for students.",
   "questions": [
    {
     "text": "Why does the reviewer mention \"a rotating platform and clever lighting\"?",
     "type": "Rhetorical Purpose",
     "correct": 3,
     "options": [
      "To criticize the cost of the production",
      "To describe the plot of the play",
      "To show that the stage is too small",
      "To explain how the crew changes scenes so effectively"
     ],
     "explanation": "Это пример того, почему декорации заслуживают «special mention»: сцена мгновенно превращается из берега в кухню.",
     "highlight": "a rotating platform and clever lighting",
     "highlight_occurrence": 1
    },
    {
     "text": "What can be inferred about the reviewer's opinion of the play?",
     "type": "Inference",
     "correct": 2,
     "options": [
      "The reviewer disliked Marcus Bell's acting.",
      "The reviewer thinks tickets are too expensive.",
      "The reviewer liked it overall despite some weaknesses.",
      "The reviewer thought it was too short."
     ],
     "explanation": "Второй акт затянут, но «one of the strongest student productions in years» — в целом отзыв положительный."
    },
    {
     "text": "What is NOT mentioned in the review?",
     "type": "Negative Factual",
     "correct": 0,
     "options": [
      "The name of the play's director",
      "The quality of the lead actor's performance",
      "The price of student tickets",
      "The length of the run"
     ],
     "explanation": "Игра актёра, цена билетов и срок показа («through Sunday») есть. Режиссёр не назван."
    }
   ],
   "id": "n36"
  },
  {
   "title": "Housing Application Email",
   "layout_type": "email",
   "passage": "Subject: Housing applications for next year are now open\n\nDear students,\n\nApplications for on-campus housing for the next academic year are now open through the Housing Portal. The deadline to apply is March 1.\n\nThis year, students may request a specific roommate, but both students must list each other on their applications. Rooms will be assigned based on the date each application is completed, so we strongly encourage you to apply early. A $200 deposit is required to secure your room and will be refunded if you cancel before May 1.\n\nQuestions? Visit the Housing Office in Grant Hall or reply to this email.\n\nOffice of Residential Life",
   "questions": [
    {
     "text": "What is the main purpose of the email?",
     "type": "Main Idea",
     "correct": 0,
     "options": [
      "To inform students that they can now apply for campus housing",
      "To announce room assignments",
      "To explain why the deposit has increased",
      "To introduce new residence halls"
     ],
     "explanation": "Письмо сообщает, что приём заявок на общежитие открыт, и объясняет правила."
    },
    {
     "text": "What must two students do to room together?",
     "type": "Factual",
     "correct": 2,
     "options": [
      "Visit the Housing Office together",
      "Apply after March 1",
      "List each other on their applications",
      "Pay a double deposit"
     ],
     "explanation": "«Both students must list each other on their applications»."
    },
    {
     "text": "What can be inferred about students who apply close to the deadline?",
     "type": "Inference",
     "correct": 3,
     "options": [
      "They will pay a higher deposit.",
      "They cannot request a roommate.",
      "They will not receive a refund.",
      "They may have fewer room choices."
     ],
     "explanation": "Комнаты распределяют по дате подачи заявки, поэтому тем, кто подаёт поздно, достанется меньше вариантов."
    }
   ],
   "id": "n37"
  },
  {
   "title": "Tutoring Center Ad",
   "layout_type": "advertisement",
   "passage": "STRUGGLING WITH CALCULUS? CONFUSED BY CHEMISTRY?\n\nThe Learning Center offers free one-on-one tutoring for all undergraduate students in math, science, writing, and foreign languages.\n\nOur tutors are experienced upper-level students who were recommended by faculty and have completed a training program.\n\nDrop in Monday through Thursday, 2–8 P.M., or book a 50-minute session online. Can't make it to campus? Virtual sessions are also available.\n\nDon't wait until the night before the exam — the earlier you come, the more we can help!",
   "questions": [
    {
     "text": "What is the purpose of the advertisement?",
     "type": "Main Idea",
     "correct": 1,
     "options": [
      "To sell textbooks",
      "To promote free tutoring services",
      "To recruit faculty members",
      "To announce new math courses"
     ],
     "explanation": "Реклама бесплатного репетиторства в Learning Center."
    },
    {
     "text": "The phrase \"Drop in\" in the advertisement is closest in meaning to",
     "type": "Vocabulary",
     "correct": 2,
     "options": [
      "fail an exam",
      "fall behind",
      "visit without an appointment",
      "leave a class"
     ],
     "explanation": "Drop in — заглянуть без записи. Противопоставлено «or book a… session online»."
    },
    {
     "text": "Why does the advertisement mention that tutors \"were recommended by faculty\"?",
     "type": "Rhetorical Purpose",
     "correct": 0,
     "options": [
      "To show that the tutors are qualified",
      "To explain why the service is free",
      "To describe how to book a session",
      "To list the subjects available"
     ],
     "explanation": "Рекомендация преподавателей и обучение показывают, что репетиторы квалифицированные.",
     "highlight": "were recommended by faculty",
     "highlight_occurrence": 1
    }
   ],
   "id": "n38"
  },
  {
   "title": "Elevator Maintenance Notice",
   "layout_type": "notice",
   "passage": "ELEVATOR MAINTENANCE — SCIENCE TOWER\n\nThe east elevator in the Science Tower will be out of service from Monday, October 20, through Friday, October 24, for scheduled maintenance.\n\n• The west elevator will remain in operation, but delays are expected during peak hours between classes.\n• Please use the stairs if you are able, especially for trips of three floors or fewer.\n• Anyone who needs assistance reaching upper floors may contact Building Services at ext. 4410 to arrange priority access.\n\nThank you for your patience while we improve the safety of our facilities.",
   "questions": [
    {
     "text": "What is NOT mentioned in the notice?",
     "type": "Negative Factual",
     "correct": 1,
     "options": [
      "Who to contact for assistance",
      "The cost of the maintenance",
      "Which elevator will be out of service",
      "When delays are likely"
     ],
     "explanation": "Какой лифт, когда задержки и куда звонить — есть. Стоимости ремонта нет."
    },
    {
     "text": "What are people encouraged to do for short trips?",
     "type": "Factual",
     "correct": 3,
     "options": [
      "Wait for the east elevator",
      "Call Building Services",
      "Avoid the Science Tower",
      "Use the stairs"
     ],
     "explanation": "«Please use the stairs… especially for trips of three floors or fewer»."
    },
    {
     "text": "The word \"peak\" in the notice is closest in meaning to",
     "type": "Vocabulary",
     "correct": 3,
     "options": [
      "earliest",
      "quietest",
      "shortest",
      "busiest"
     ],
     "explanation": "Peak hours — часы пик, самое загруженное время между занятиями."
    }
   ],
   "id": "n39"
  },
  {
   "title": "Airport Carpool Text Chain",
   "layout_type": "chat",
   "passage": "Diego Alvarez (4:30 P.M.)\nIs anyone else flying out on Friday for break? I'm trying to share a ride to the airport.\n\nMei Chen (4:34 P.M.)\nMe! My flight is at 2:15. What about yours?\n\nDiego Alvarez (4:35 P.M.)\n3:00, so that works. If we leave campus at 11:30, we'll have plenty of time.\n\nMei Chen (4:37 P.M.)\nGreat. A taxi is about $60, so it'd be $30 each.\n\nDiego Alvarez (4:39 P.M.)\nEven better — my roommate Tom said he can drive us if we pay for gas.\n\nMei Chen (4:40 P.M.)\nThat's so nice of him. Tell him I'll bring him some cookies from home when we're back!",
   "questions": [
    {
     "text": "What can be inferred about the ride with Tom?",
     "type": "Inference",
     "correct": 0,
     "options": [
      "It will probably cost less than a taxi.",
      "It will leave after 2:15.",
      "It is only for Diego.",
      "It will go to a different airport."
     ],
     "explanation": "Тому нужно только оплатить бензин — это дешевле, чем такси за 60 долларов. Поэтому Диего и пишет «Even better»."
    },
    {
     "text": "Why does Mei mention that she will bring Tom cookies?",
     "type": "Rhetorical Purpose",
     "correct": 1,
     "options": [
      "To explain why she is going home",
      "To show her thanks for his offer",
      "To pay for the gas",
      "To invite Tom on the trip"
     ],
     "explanation": "«That's so nice of him» — печенье в знак благодарности за то, что он их отвезёт."
    },
    {
     "text": "What are Diego and Mei mainly discussing?",
     "type": "Main Idea",
     "correct": 2,
     "options": [
      "Which airline to choose",
      "How to buy plane tickets",
      "How to get to the airport together",
      "Where to spend their break"
     ],
     "explanation": "Они договариваются вместе доехать до аэропорта."
    }
   ],
   "id": "n40"
  },
  {
   "title": "Film Series Schedule",
   "layout_type": "schedule",
   "passage": "WORLD CINEMA NIGHTS — SPRING SERIES\nAll screenings in Lindgren Auditorium at 7:30 P.M.\n\nJanuary 22 | \"The Long Road Home\" (Iran) — introduced by Professor Amir Navabi\nFebruary 5 | \"Winter Light\" (Sweden)\nFebruary 19 | \"City of Rivers\" (Brazil) — followed by a discussion with the director via video call\nMarch 4 | \"Paper Lanterns\" (Japan)\nMarch 18 | \"The Salt Merchant\" (Senegal)\n\nAdmission is free for students with ID and $5 for the public. All films are shown with English subtitles. Free popcorn while it lasts!",
   "questions": [
    {
     "text": "Which screening will include a discussion with the director?",
     "type": "Factual",
     "correct": 0,
     "options": [
      "\"City of Rivers\"",
      "\"The Long Road Home\"",
      "\"Winter Light\"",
      "\"Paper Lanterns\""
     ],
     "explanation": "«City of Rivers» — «followed by a discussion with the director via video call»."
    },
    {
     "text": "What is NOT true about the film series?",
     "type": "Negative Factual",
     "correct": 2,
     "options": [
      "Students with ID can attend for free.",
      "All screenings start at 7:30 P.M.",
      "Each film is introduced by a professor.",
      "All films have English subtitles."
     ],
     "explanation": "Профессор представляет только первый фильм. Остальное в расписании есть."
    },
    {
     "text": "The phrase \"while it lasts\" in the schedule is closest in meaning to",
     "type": "Vocabulary",
     "correct": 0,
     "options": [
      "until there is none left",
      "during the film",
      "for a long time",
      "only on weekends"
     ],
     "explanation": "Free popcorn while it lasts — бесплатный попкорн, пока не закончится."
    }
   ],
   "id": "n41"
  },
  {
   "title": "Composting Program Article",
   "layout_type": "article",
   "passage": "Dining Halls Launch Composting Program\n\nStarting this month, all three campus dining halls will separate food scraps from regular trash so they can be turned into compost. The compost will be used on campus gardens and lawns, reducing the university's need for chemical fertilizers.\n\n\"Last year, our dining halls threw away nearly 90 tons of food waste,\" said sustainability director Rachel Okoye. \"Most of that ended up in a landfill, where it released methane as it broke down.\"\n\nStudents are asked to scrape leftover food into the green bins near the dish return. Napkins can go in too, but plastic, glass, and metal cannot. Okoye hopes the program will expand to campus cafés next year.",
   "questions": [
    {
     "text": "Why does the article mention that dining halls \"threw away nearly 90 tons of food waste\"?",
     "type": "Rhetorical Purpose",
     "correct": 2,
     "options": [
      "To explain the cost of fertilizers",
      "To describe how compost is made",
      "To show how large the problem the program addresses is",
      "To criticize students for wasting food"
     ],
     "explanation": "Цифра показывает масштаб проблемы, которую решает новая программа.",
     "highlight": "threw away nearly 90 tons of food waste",
     "highlight_occurrence": 1
    },
    {
     "text": "What can be inferred about campus cafés?",
     "type": "Inference",
     "correct": 1,
     "options": [
      "They will close next year.",
      "They do not currently compost their food waste.",
      "They produce more waste than the dining halls.",
      "They already use green bins."
     ],
     "explanation": "Окойе надеется, что программа «will expand to campus cafés next year» — значит, пока в кафе компостирования нет."
    },
    {
     "text": "What is the article mainly about?",
     "type": "Main Idea",
     "correct": 3,
     "options": [
      "A shortage of food in campus dining halls",
      "A new campus garden",
      "The closing of a landfill",
      "A new program to compost food waste from dining halls"
     ],
     "explanation": "Статья о запуске программы компостирования в столовых."
    }
   ],
   "id": "n42"
  },
  {
   "title": "Equipment Rental Form",
   "layout_type": "form",
   "passage": "Outdoor Club Equipment Rental Form\n\nName: Jordan Price\nStudent ID: 20431178\nItems requested: 2-person tent, sleeping bag, camping stove\nPickup date: Friday, May 9\nReturn date: Monday, May 12\n\nAll equipment must be returned clean and dry. A late fee of $5 per item per day will be charged. Renters are responsible for the full replacement cost of lost or damaged items.\n\nRentals are available to club members only. Pick up equipment at the Outdoor Club office, Room 104, Student Activities Building.",
   "questions": [
    {
     "text": "The word \"responsible\" in the form is closest in meaning to",
     "type": "Vocabulary",
     "correct": 1,
     "options": [
      "in charge of planning",
      "required to pay",
      "trusted",
      "careful"
     ],
     "explanation": "Renters are responsible for the full replacement cost — арендатор обязан оплатить полную стоимость."
    },
    {
     "text": "Where can Jordan pick up the equipment?",
     "type": "Factual",
     "correct": 1,
     "options": [
      "At the front desk of his dorm",
      "In Room 104 of the Student Activities Building",
      "At the campus bookstore",
      "At the campsite"
     ],
     "explanation": "«Pick up equipment at the Outdoor Club office, Room 104, Student Activities Building»."
    },
    {
     "text": "Which item did Jordan NOT request?",
     "type": "Negative Factual",
     "correct": 3,
     "options": [
      "A tent",
      "A sleeping bag",
      "A camping stove",
      "A backpack"
     ],
     "explanation": "В заявке палатка, спальник и горелка. Рюкзака нет."
    }
   ],
   "id": "n43"
  },
  {
   "title": "Club Election Email",
   "layout_type": "email",
   "passage": "Subject: Photography Club elections — nominations open\n\nHi everyone,\n\nIt's hard to believe the semester is almost over! As many of you know, I'm graduating in May, so the club will need a new president, along with a treasurer and an events coordinator.\n\nIf you'd like to run for any of these positions, please send me a short paragraph explaining why you're interested by April 10. You can also nominate a friend, but please check with them first. Voting will take place at our final meeting on April 17.\n\nNo experience is necessary — just enthusiasm for photography and a willingness to help the club grow.\n\nThanks for an amazing year,\nOlivia",
   "questions": [
    {
     "text": "Why did Olivia write this email?",
     "type": "Main Idea",
     "correct": 0,
     "options": [
      "To ask members to put themselves forward for club leadership roles",
      "To announce the winner of a photography contest",
      "To schedule a photography trip",
      "To ask members to pay their dues"
     ],
     "explanation": "Оливия выпускается, клубу нужны новые руководители — она приглашает выдвигаться."
    },
    {
     "text": "Why does Olivia mention that she is \"graduating in May\"?",
     "type": "Rhetorical Purpose",
     "correct": 3,
     "options": [
      "To invite members to her graduation",
      "To show that she is very busy",
      "To explain why the meeting is canceled",
      "To explain why the club needs a new president"
     ],
     "explanation": "Она выпускается — поэтому клубу нужен новый президент.",
     "highlight": "graduating in May",
     "highlight_occurrence": 1
    },
    {
     "text": "What can be inferred about someone who wants to nominate a friend?",
     "type": "Inference",
     "correct": 2,
     "options": [
      "They can vote twice.",
      "They must be the club treasurer.",
      "They should make sure the friend agrees first.",
      "They must have experience in the club."
     ],
     "explanation": "«Please check with them first» — нужно убедиться, что друг согласен."
    }
   ],
   "id": "n44"
  },
  {
   "title": "Granola Bar Label",
   "layout_type": "label",
   "passage": "Honey Oat Granola Bars\n6 bars — net weight 210 g\n\nIngredients: whole grain oats, honey, almonds, sunflower oil, dried cranberries, sea salt\n\nPER BAR (35 g):\nCalories: 150\nFat: 6 g\nSugars: 9 g\nFiber: 3 g\nProtein: 4 g\n\nContains: tree nuts. Made in a facility that also processes peanuts and milk.\nStore in a cool, dry place.",
   "questions": [
    {
     "text": "Which ingredient is NOT listed on the label?",
     "type": "Negative Factual",
     "correct": 0,
     "options": [
      "Chocolate",
      "Cranberries",
      "Oats",
      "Honey"
     ],
     "explanation": "Шоколада в составе нет. Овёс, мёд и клюква перечислены."
    },
    {
     "text": "The word \"processes\" on the label is closest in meaning to",
     "type": "Vocabulary",
     "correct": 2,
     "options": [
      "grows",
      "tests",
      "handles and prepares",
      "sells"
     ],
     "explanation": "«A facility that also processes peanuts» — предприятие, где также обрабатывают арахис и молоко."
    },
    {
     "text": "How many grams of protein does one bar contain?",
     "type": "Factual",
     "correct": 2,
     "options": [
      "9 g",
      "3 g",
      "4 g",
      "6 g"
     ],
     "explanation": "В батончике (35 г): «Protein: 4 g». 6 г — жиры, 9 г — сахар, 3 г — клетчатка."
    }
   ],
   "id": "n45"
  },
  {
   "title": "Learning to Cook Post",
   "layout_type": "social_media",
   "passage": "Tom Okafor\n\nThree months ago I couldn't boil an egg. Living off-campus this year meant no more dining hall, so I signed up for the free cooking workshops at the community center.\n\nTonight I made dinner for my roommates — chicken stir-fry with rice and homemade dumplings. The dumplings looked a little strange, but nobody left a single one on their plate!\n\nHonestly, cooking has saved me a lot of money compared with ordering takeout every night. Highly recommend the workshops if you're in the same situation.",
   "questions": [
    {
     "text": "What can be inferred about Tom's situation last year?",
     "type": "Inference",
     "correct": 3,
     "options": [
      "He worked at a restaurant.",
      "He taught cooking workshops.",
      "He lived with the same roommates.",
      "He ate in a dining hall."
     ],
     "explanation": "«Living off-campus this year meant no more dining hall» — значит, раньше он питался в столовой."
    },
    {
     "text": "What is the main purpose of the post?",
     "type": "Main Idea",
     "correct": 1,
     "options": [
      "To share a dumpling recipe",
      "To share Tom's progress in learning to cook and recommend the workshops",
      "To advertise a restaurant",
      "To complain about the dining hall"
     ],
     "explanation": "Том рассказывает, как научился готовить, и советует мастер-классы."
    },
    {
     "text": "Why does Tom mention that \"nobody left a single one on their plate\"?",
     "type": "Rhetorical Purpose",
     "correct": 0,
     "options": [
      "To show that his roommates enjoyed the dumplings despite how they looked",
      "To complain that there was not enough food",
      "To explain why the dumplings looked strange",
      "To show that his roommates were not hungry"
     ],
     "explanation": "Пельмени выглядели странно, но их съели все — значит, понравились.",
     "highlight": "nobody left a single one on their plate",
     "highlight_occurrence": 1
    }
   ],
   "id": "n46"
  },
  {
   "title": "Quiet Floor Sign",
   "layout_type": "sign",
   "passage": "Silent Study Zone — Fourth Floor\nThis floor is reserved for silent individual study. Phone calls, group work, and conversations are not permitted. Please set devices to silent and use headphones at a low volume. Food is not allowed; covered drinks are permitted. Group study rooms are available on the second floor and can be reserved at the front desk.",
   "questions": [
    {
     "text": "Where can students go to work in groups?",
     "type": "Factual",
     "correct": 3,
     "options": [
      "To the fourth floor",
      "To the front desk",
      "Outside the library",
      "To the second floor"
     ],
     "explanation": "«Group study rooms are available on the second floor»."
    },
    {
     "text": "What is NOT allowed on the fourth floor?",
     "type": "Negative Factual",
     "correct": 1,
     "options": [
      "Individual study",
      "Eating snacks",
      "Covered drinks",
      "Headphones at a low volume"
     ],
     "explanation": "«Food is not allowed» — еду нельзя. Закрытые напитки и тихие наушники разрешены."
    },
    {
     "text": "The word \"reserved\" in the sign is closest in meaning to",
     "type": "Vocabulary",
     "correct": 3,
     "options": [
      "quiet",
      "polite",
      "closed",
      "set aside"
     ],
     "explanation": "This floor is reserved for silent study — этаж отведён, выделен для тихих занятий."
    }
   ],
   "id": "n47"
  },
  {
   "title": "Noodle Restaurant Review",
   "layout_type": "review",
   "passage": "Golden Bowl Noodle House\n\nThis new spot on Elm Street has quickly become a favorite among students, and it's easy to see why. Portions are generous, prices rarely go above $12, and the handmade noodles are excellent — especially in the spicy beef soup.\n\nService can be slow at lunchtime, when the line often stretches out the door. Arriving before noon or after 2 P.M. makes a big difference.\n\nThe dining room is small and can get noisy, so it's not the best choice for a quiet conversation. For a quick, filling, and affordable meal, however, it's hard to beat.",
   "questions": [
    {
     "text": "Why does the reviewer mention that the line \"often stretches out the door\"?",
     "type": "Rhetorical Purpose",
     "correct": 1,
     "options": [
      "To describe the restaurant's location",
      "To show how busy the restaurant is at lunchtime",
      "To complain that the restaurant is too small for staff",
      "To explain why prices are low"
     ],
     "explanation": "Очередь до улицы иллюстрирует, что в обед очень много людей и обслуживают медленно.",
     "highlight": "often stretches out the door",
     "highlight_occurrence": 1
    },
    {
     "text": "For whom would the reviewer most likely recommend Golden Bowl?",
     "type": "Inference",
     "correct": 0,
     "options": [
      "Students looking for a fast, inexpensive meal",
      "People planning a quiet business meeting",
      "Diners who dislike spicy food",
      "Groups wanting a formal dinner"
     ],
     "explanation": "«For a quick, filling, and affordable meal… it's hard to beat». Для тихого разговора, наоборот, не советует."
    },
    {
     "text": "What is NOT mentioned in the review?",
     "type": "Negative Factual",
     "correct": 2,
     "options": [
      "The best times to visit",
      "The noise level",
      "The restaurant's opening hours",
      "The restaurant's prices"
     ],
     "explanation": "Цены, лучшее время и шум упомянуты. Часы работы не указаны."
    }
   ],
   "id": "n48"
  },
  {
   "title": "Field Trip Bus Email",
   "layout_type": "email",
   "passage": "Subject: Change to Saturday's field trip\n\nDear Geology 120 students,\n\nBecause of road construction on Highway 9, our bus to Red Canyon on Saturday will take a longer route. We will now leave from the parking lot behind the Science Center at 7:00 A.M. instead of 7:30, and we expect to return around 6:00 P.M.\n\nPlease bring a packed lunch, at least two liters of water, sturdy shoes, and your field notebook. There are no shops near the canyon. The trip will go ahead in light rain, but if a storm is forecast, I will send an email by 9:00 P.M. on Friday.\n\nSee you Saturday,\nProfessor Lin",
   "questions": [
    {
     "text": "What is the main purpose of the email?",
     "type": "Main Idea",
     "correct": 2,
     "options": [
      "To ask students to buy lunch at the canyon",
      "To announce a new geology course",
      "To inform students about changes to a field trip",
      "To cancel a field trip because of rain"
     ],
     "explanation": "Письмо об изменениях в поездке: другой маршрут и более раннее время отправления."
    },
    {
     "text": "Why will the bus leave earlier than planned?",
     "type": "Factual",
     "correct": 0,
     "options": [
      "It must take a longer route because of road construction.",
      "A storm is expected in the afternoon.",
      "The canyon closes early on Saturdays.",
      "Students need time to buy lunch."
     ],
     "explanation": "«Because of road construction on Highway 9, our bus… will take a longer route»."
    },
    {
     "text": "What can be inferred about students who forget their lunch?",
     "type": "Inference",
     "correct": 1,
     "options": [
      "They should email Professor Lin on Friday.",
      "They will probably not be able to buy food near the canyon.",
      "They can buy lunch on the bus.",
      "Professor Lin will provide food."
     ],
     "explanation": "«There are no shops near the canyon» — купить еду на месте будет негде."
    }
   ],
   "id": "n49"
  },
  {
   "title": "Spring Concert Ad",
   "layout_type": "advertisement",
   "passage": "SPRING CONCERT ON THE LAWN!\n\nThe Student Activities Board presents an evening of live music on Saturday, April 26, on the Main Quad. Doors open at 5 P.M.\n\nFeaturing three student bands plus headliner The Night Owls!\n\nTickets: $10 for students, $20 for guests. Ticket sales benefit the campus food pantry.\n\nFood trucks will be on site, and blankets and lawn chairs are welcome. In case of rain, the concert will move to the Field House.\n\nTickets are going fast — last year's concert sold out in just two days!",
   "questions": [
    {
     "text": "What is the purpose of the advertisement?",
     "type": "Main Idea",
     "correct": 3,
     "options": [
      "To recruit musicians for student bands",
      "To announce the opening of the food pantry",
      "To advertise a new food truck",
      "To promote an outdoor concert and its ticket sales"
     ],
     "explanation": "Реклама весеннего концерта и продажи билетов."
    },
    {
     "text": "The word \"headliner\" in the advertisement is closest in meaning to",
     "type": "Vocabulary",
     "correct": 0,
     "options": [
      "the main performer",
      "the first speaker",
      "the event organizer",
      "a newspaper writer"
     ],
     "explanation": "Headliner — главный исполнитель вечера, хедлайнер."
    },
    {
     "text": "Why does the advertisement mention that last year's concert \"sold out in just two days\"?",
     "type": "Rhetorical Purpose",
     "correct": 2,
     "options": [
      "To show that the Field House is small",
      "To thank last year's performers",
      "To encourage people to buy tickets soon",
      "To explain why prices increased"
     ],
     "explanation": "Подкрепляет «Tickets are going fast» — стоит поторопиться с покупкой.",
     "highlight": "sold out in just two days",
     "highlight_occurrence": 1
    }
   ],
   "id": "n50"
  },
  {
   "title": "Fire Alarm Testing Notice",
   "layout_type": "notice",
   "passage": "FIRE ALARM TESTING — HUMANITIES BUILDING\n\nOn Thursday, March 13, between 10:00 A.M. and 2:00 P.M., the fire alarm system in the Humanities Building will be tested.\n\n• Alarms may sound several times for short periods. You do not need to leave the building during the test.\n• Classes will continue as scheduled, though instructors may pause briefly when alarms sound.\n• If an alarm sounds for longer than five minutes, or if you see smoke or fire, evacuate immediately as usual.\n\nWe apologize for the disruption and thank you for helping keep our campus safe.\n\nCampus Safety Office",
   "questions": [
    {
     "text": "What is NOT true about the testing?",
     "type": "Negative Factual",
     "correct": 3,
     "options": [
      "It will take place on Thursday.",
      "Classes will continue.",
      "Alarms may sound several times.",
      "Everyone must leave the building at 10:00 A.M."
     ],
     "explanation": "Во время проверки выходить не нужно — «You do not need to leave the building». Остальное в объявлении есть."
    },
    {
     "text": "When should people leave the building during the test period?",
     "type": "Factual",
     "correct": 1,
     "options": [
      "When classes end",
      "If an alarm lasts more than five minutes",
      "Every time an alarm sounds",
      "At 2:00 P.M."
     ],
     "explanation": "«If an alarm sounds for longer than five minutes, or if you see smoke or fire, evacuate immediately»."
    },
    {
     "text": "The word \"disruption\" in the notice is closest in meaning to",
     "type": "Vocabulary",
     "correct": 1,
     "options": [
      "noise complaint",
      "interruption",
      "danger",
      "expense"
     ],
     "explanation": "Disruption — помеха, нарушение обычного хода занятий."
    }
   ],
   "id": "n51"
  },
  {
   "title": "Exam Study Group Text Chain",
   "layout_type": "chat",
   "passage": "Hana Sato (9:12 P.M.)\nIs everyone still meeting tomorrow to study for the statistics final?\n\nLeo Grant (9:15 P.M.)\nYes, 2 P.M. at the library. I reserved Room 2B for three hours.\n\nHana Sato (9:16 P.M.)\nGreat. Should we focus on the practice exam or go over the homework problems?\n\nPriya Nair (9:20 P.M.)\nPractice exam, definitely. Professor Moore said the final will look a lot like it.\n\nLeo Grant (9:21 P.M.)\nAgreed. I'll print copies for everyone. Can someone bring a whiteboard marker? The ones in that room never work.\n\nHana Sato (9:22 P.M.)\nI've got a whole box. See you tomorrow!",
   "questions": [
    {
     "text": "What can be inferred about the whiteboard markers in Room 2B?",
     "type": "Inference",
     "correct": 2,
     "options": [
      "They belong to Professor Moore.",
      "They were stolen.",
      "They are usually dried out.",
      "They are not allowed in the library."
     ],
     "explanation": "«The ones in that room never work» — маркеры в комнате обычно высохли."
    },
    {
     "text": "Why does Priya mention what Professor Moore said?",
     "type": "Rhetorical Purpose",
     "correct": 3,
     "options": [
      "To explain why the meeting is at 2 P.M.",
      "To complain about the homework",
      "To ask Leo to print copies",
      "To support her suggestion to focus on the practice exam"
     ],
     "explanation": "Профессор сказал, что экзамен будет похож на пробный, — это довод за то, чтобы заниматься по нему."
    },
    {
     "text": "What are the students mainly discussing?",
     "type": "Main Idea",
     "correct": 0,
     "options": [
      "Plans for a study session",
      "Their grades on the final exam",
      "How to contact Professor Moore",
      "Which library rooms are best"
     ],
     "explanation": "Договариваются о совместной подготовке к экзамену: время, место, чем заниматься."
    }
   ],
   "id": "n52"
  },
  {
   "title": "Career Week Schedule",
   "layout_type": "schedule",
   "passage": "CAREER WEEK — WORKSHOP SCHEDULE\nAll workshops in the Career Center, Room 120. Registration required.\n\nMonday | 12:00–1:00 P.M. | Writing a Strong Résumé\nTuesday | 3:00–4:30 P.M. | Interview Skills (includes practice interviews)\nWednesday | 12:00–1:00 P.M. | Using LinkedIn Effectively\nThursday | 4:00–5:00 P.M. | Salary Negotiation Basics\nFriday | 10:00 A.M.–2:00 P.M. | Free professional headshots (bring business attire)\n\nStudents who attend three or more workshops will receive a Career Readiness certificate. Lunch will be served at the noon sessions.",
   "questions": [
    {
     "text": "What will students who attend three or more workshops receive?",
     "type": "Factual",
     "correct": 2,
     "options": [
      "A job interview",
      "A professional headshot",
      "A certificate",
      "A free lunch every day"
     ],
     "explanation": "«Students who attend three or more workshops will receive a Career Readiness certificate»."
    },
    {
     "text": "Which workshop is NOT on the schedule?",
     "type": "Negative Factual",
     "correct": 0,
     "options": [
      "Writing cover letters",
      "Salary negotiation",
      "Interview skills",
      "Using LinkedIn"
     ],
     "explanation": "Сопроводительных писем в расписании нет. Резюме, интервью, LinkedIn и переговоры о зарплате есть."
    },
    {
     "text": "The word \"attire\" in the schedule is closest in meaning to",
     "type": "Vocabulary",
     "correct": 2,
     "options": [
      "equipment",
      "manners",
      "clothing",
      "documents"
     ],
     "explanation": "Business attire — деловая одежда."
    }
   ],
   "id": "n53"
  },
  {
   "title": "New Bike Lanes Article",
   "layout_type": "article",
   "passage": "Campus Adds Protected Bike Lanes\n\nConstruction crews have finished new protected bike lanes along University Avenue, separating cyclists from car traffic with low concrete barriers. The project follows a student survey last fall in which 68 percent of respondents said they would bike to class more often if they felt safer.\n\n\"We had several accidents on that street last year,\" said transportation planner Gregory Hall. \"The barriers give riders real protection, not just a painted line.\"\n\nThe university also added 200 new bike racks near the library and dining halls. Officials plan to extend the lanes to the north campus next year if funding is approved.",
   "questions": [
    {
     "text": "Why does the article mention the student survey?",
     "type": "Rhetorical Purpose",
     "correct": 0,
     "options": [
      "To explain one reason the bike lanes were built",
      "To show that most students dislike cycling",
      "To describe how many accidents occurred",
      "To announce the cost of the project"
     ],
     "explanation": "Опрос показал, что студенты ездили бы чаще, если бы чувствовали себя в безопасности, — после него и построили дорожки."
    },
    {
     "text": "What can be inferred about the bike lanes on University Avenue before the project?",
     "type": "Inference",
     "correct": 3,
     "options": [
      "They were protected by concrete barriers.",
      "They did not exist on any campus street.",
      "They were used only by cars.",
      "They were probably marked only with painted lines."
     ],
     "explanation": "Холл противопоставляет барьеры «not just a painted line» — значит, раньше была только разметка краской."
    },
    {
     "text": "What is the article mainly about?",
     "type": "Main Idea",
     "correct": 1,
     "options": [
      "A new bike rental company",
      "New safety improvements for cyclists on campus",
      "A car accident on University Avenue",
      "A plan to close the north campus"
     ],
     "explanation": "Статья о новых защищённых велодорожках и парковках для велосипедов."
    }
   ],
   "id": "n54"
  },
  {
   "title": "Writing Center Webpage",
   "layout_type": "webpage",
   "passage": "https://www.lakeside.edu/writing-center\n\nThe Writing Center\n\nOur trained peer consultants can help with any type of writing, at any stage: brainstorming ideas, organizing a draft, or polishing a final version. We work with essays, lab reports, cover letters, and even creative writing.\n\nPlease note that we do not proofread or edit papers for you. Instead, we help you develop skills to improve your own writing.\n\nAppointments are 30 or 60 minutes and can be booked up to two weeks in advance. Bring your assignment instructions and any comments from your instructor.",
   "questions": [
    {
     "text": "The word \"polishing\" on the webpage is closest in meaning to",
     "type": "Vocabulary",
     "correct": 3,
     "options": [
      "cleaning",
      "printing",
      "grading",
      "improving"
     ],
     "explanation": "Polishing a final version — доводить до блеска, улучшать готовый текст."
    },
    {
     "text": "What should students bring to an appointment?",
     "type": "Factual",
     "correct": 3,
     "options": [
      "A printed final grade",
      "A list of consultants",
      "A proofread draft",
      "Assignment instructions and instructor comments"
     ],
     "explanation": "«Bring your assignment instructions and any comments from your instructor»."
    },
    {
     "text": "What does the Writing Center NOT do?",
     "type": "Negative Factual",
     "correct": 1,
     "options": [
      "Work with lab reports",
      "Proofread papers for students",
      "Help with creative writing",
      "Help students brainstorm ideas"
     ],
     "explanation": "«We do not proofread or edit papers for you» — вычитку за студентов не делают."
    }
   ],
   "id": "n55"
  },
  {
   "title": "Apartment Repair Email",
   "layout_type": "email",
   "passage": "Subject: Kitchen sink repair — Apartment 4C\n\nDear Ms. Romero,\n\nThank you for reporting the leak under your kitchen sink. A plumber will come on Wednesday between 1:00 and 4:00 P.M. to replace the damaged pipe.\n\nYou don't need to be home, as our maintenance staff will let the plumber in with a master key. However, please remove any items stored under the sink beforehand so the plumber can work easily. Until the repair is finished, we recommend placing a bowl under the leak and avoiding the dishwasher.\n\nIf Wednesday doesn't work for you, please let me know by Monday.\n\nBest regards,\nDaniel Shaw\nProperty Manager",
   "questions": [
    {
     "text": "Why did Daniel Shaw write this email?",
     "type": "Main Idea",
     "correct": 2,
     "options": [
      "To announce a new dishwasher",
      "To ask the tenant to move out",
      "To arrange a repair for a problem the tenant reported",
      "To remind the tenant to pay rent"
     ],
     "explanation": "Ответ на сообщение о протечке: когда придёт сантехник и что сделать до его прихода."
    },
    {
     "text": "Why does Daniel mention the \"master key\"?",
     "type": "Rhetorical Purpose",
     "correct": 1,
     "options": [
      "To show that the plumber has his own key",
      "To explain why Ms. Romero does not need to be home",
      "To ask Ms. Romero to return her key",
      "To describe a security problem"
     ],
     "explanation": "Сотрудники откроют квартиру мастер-ключом — поэтому быть дома не обязательно.",
     "highlight": "master key",
     "highlight_occurrence": 1
    },
    {
     "text": "What can be inferred about using the dishwasher before the repair?",
     "type": "Inference",
     "correct": 0,
     "options": [
      "It might make the leak worse.",
      "It is already broken.",
      "It will be replaced on Wednesday.",
      "It is not connected to the sink."
     ],
     "explanation": "Советуют не пользоваться посудомойкой до ремонта — вероятно, она может усилить протечку."
    }
   ],
   "id": "n56"
  },
  {
   "title": "Print Shop Receipt",
   "layout_type": "receipt",
   "passage": "QuickPrint Copy Center\n125 College Avenue\n\nOrder No.: 3307\nDate: November 18\n\nPoster printing (A1, color) x 2: $36.00\nSpiral binding x 3: $9.00\nBlack-and-white copies x 150: $7.50\nRush service (same day): $10.00\nSubtotal: $62.50\nTax: $4.38\nTotal: $66.88\n\nReady for pickup after 5:00 P.M. today.\nStudents receive 10% off orders over $100.",
   "questions": [
    {
     "text": "Which service is NOT listed on the receipt?",
     "type": "Negative Factual",
     "correct": 2,
     "options": [
      "Poster printing",
      "Spiral binding",
      "Lamination",
      "Rush service"
     ],
     "explanation": "Ламинирования в чеке нет. Печать постеров, переплёт и срочное выполнение есть."
    },
    {
     "text": "The word \"Rush\" on the receipt is closest in meaning to",
     "type": "Vocabulary",
     "correct": 0,
     "options": [
      "fast",
      "cheap",
      "large",
      "careful"
     ],
     "explanation": "Rush service (same day) — срочная услуга, выполнение в тот же день."
    },
    {
     "text": "When can the order be picked up?",
     "type": "Factual",
     "correct": 0,
     "options": [
      "After 5:00 P.M. today",
      "Tomorrow morning",
      "November 19",
      "Within one week"
     ],
     "explanation": "«Ready for pickup after 5:00 P.M. today»."
    }
   ],
   "id": "n57"
  },
  {
   "title": "First Week Abroad Post",
   "layout_type": "social_media",
   "passage": "Yuki Tanaka\n\nOne week into my exchange semester in Canada! Honestly, the first few days were overwhelming. I got lost on campus twice, and I couldn't understand half of what people said in the dining hall because everyone talks so fast.\n\nThings got so much better after the international student welcome dinner. I met people from 15 different countries, and some of us are going to try ice skating this weekend (I've never skated in my life!).\n\nTo anyone starting a semester abroad: say yes to every event in the first week. It really helps.",
   "questions": [
    {
     "text": "What can be inferred about Yuki's experience?",
     "type": "Inference",
     "correct": 1,
     "options": [
      "She plans to leave Canada early.",
      "Meeting other students made her feel more comfortable.",
      "She found her classes too easy.",
      "She has skated many times before."
     ],
     "explanation": "«Things got so much better after the… welcome dinner» — знакомства помогли освоиться."
    },
    {
     "text": "What is the main purpose of the post?",
     "type": "Main Idea",
     "correct": 3,
     "options": [
      "To complain about the dining hall food",
      "To advertise ice skating lessons",
      "To ask for directions on campus",
      "To describe her first week abroad and offer advice"
     ],
     "explanation": "Юки рассказывает о первой неделе и советует ходить на все мероприятия."
    },
    {
     "text": "Why does Yuki mention that she \"got lost on campus twice\"?",
     "type": "Rhetorical Purpose",
     "correct": 2,
     "options": [
      "To explain why she missed the dinner",
      "To show that the campus is small",
      "To illustrate how overwhelming her first days were",
      "To complain about the campus maps"
     ],
     "explanation": "Пример к «the first few days were overwhelming».",
     "highlight": "got lost on campus twice",
     "highlight_occurrence": 1
    }
   ],
   "id": "n58"
  },
  {
   "title": "Password Reset Instructions",
   "layout_type": "instructions",
   "passage": "How to Reset Your University Password\n\nStep 1: Go to password.northgate.edu and click \"Forgot Password.\"\nStep 2: Enter your student ID number and the personal email address you registered with.\nStep 3: Open the reset link sent to that email. The link expires after 30 minutes.\nStep 4: Create a new password with at least 12 characters, including a number and a symbol.\n\nYou cannot reuse any of your last five passwords. If you no longer have access to your personal email, visit the IT Help Desk in person with a photo ID.",
   "questions": [
    {
     "text": "How long does the reset link remain valid?",
     "type": "Factual",
     "correct": 1,
     "options": [
      "Until it is used",
      "30 minutes",
      "12 hours",
      "Five days"
     ],
     "explanation": "«The link expires after 30 minutes»."
    },
    {
     "text": "Which is NOT a requirement for a new password?",
     "type": "Negative Factual",
     "correct": 3,
     "options": [
      "At least 12 characters",
      "A number",
      "A symbol",
      "A capital letter"
     ],
     "explanation": "Заглавная буква не требуется. 12 символов, цифра и символ — требования."
    },
    {
     "text": "The word \"expires\" in the instructions is closest in meaning to",
     "type": "Vocabulary",
     "correct": 1,
     "options": [
      "becomes shorter",
      "stops working",
      "is sent",
      "is saved"
     ],
     "explanation": "The link expires — ссылка перестаёт действовать."
    }
   ],
   "id": "n59"
  },
  {
   "title": "Campus Clean-Up Poster",
   "layout_type": "poster",
   "passage": "JOIN THE GREEN CAMPUS CLEAN-UP!\n\nSaturday, April 5 | 9 A.M.–12 P.M. | Meet at the Clock Tower\n\nHelp us pick up litter along Mill Creek and around campus before spring visiting day, when hundreds of future students and their families will tour the university.\n\n• Gloves, bags, and grabbers provided\n• Wear closed-toe shoes and clothes that can get dirty\n• Free breakfast for all volunteers from 8:30 A.M.\n\nClubs that bring ten or more members will be entered into a drawing for a $300 activity fund. Last year, volunteers collected over 400 kilograms of trash!",
   "questions": [
    {
     "text": "Why does the poster mention \"spring visiting day\"?",
     "type": "Rhetorical Purpose",
     "correct": 3,
     "options": [
      "To invite families to volunteer",
      "To announce a change in the meeting place",
      "To describe where future students will stay",
      "To explain why the clean-up is being held at this time"
     ],
     "explanation": "Уборку проводят перед днём, когда кампус посетят будущие студенты и их семьи.",
     "highlight": "spring visiting day",
     "highlight_occurrence": 1
    },
    {
     "text": "What can be inferred about clubs that participate?",
     "type": "Inference",
     "correct": 2,
     "options": [
      "They will receive free breakfast only.",
      "They organized last year's clean-up.",
      "They have a reason to bring many members.",
      "They must provide their own gloves."
     ],
     "explanation": "Клубы с десятью и более участниками участвуют в розыгрыше 300 долларов — есть стимул привести побольше людей."
    },
    {
     "text": "What is NOT provided for volunteers?",
     "type": "Negative Factual",
     "correct": 0,
     "options": [
      "Closed-toe shoes",
      "Gloves",
      "Bags",
      "Breakfast"
     ],
     "explanation": "Обувь нужно надеть свою («Wear closed-toe shoes»). Перчатки, мешки и завтрак выдают."
    }
   ],
   "id": "n60"
  }
 ]
};
