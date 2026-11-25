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
  }
 ]
};
