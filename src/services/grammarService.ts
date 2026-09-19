import { GrammarPoint, GrammarCategory } from "../types/grammar";
import { HskLevel } from "../types/hsk";

export const GRAMMAR_POINTS: GrammarPoint[] = [
  // --- HSK 1 ---
  {
    id: "g-hsk1-shi",
    hskLevel: "1",
    title: "The Verb 是 (shì) to Express 'To Be'",
    chineseTitle: "动词“是”字句",
    pattern: "Subject + 是 + Noun / Noun Phrase",
    category: "Sentence Pattern",
    summary: "Used to connect two noun phrases showing equality or classification.",
    explanation: "In Chinese, 是 is used primarily to link a subject with a noun or noun phrase (e.g. identity, profession, nationality). Unlike English, it is NOT used directly with adjectives (do not say 我是高, use 我很高 instead).",
    bengaliExplanation: "চীনা ভাষায় 是 (shì) কেবল কোনো ব্যক্তি বা বস্তুর পরিচয়, জাতীয়তা বা শ্রেণি নির্দেশ করতে বিশেষ্যের সাথে ব্যবহৃত হয়। বিশেষণের সাথে এটি বসে না।",
    examples: [
      { chinese: "我是学生。", pinyin: "Wǒ shì xuésheng.", english: "I am a student.", bengali: "আমি একজন শিক্ষার্থী।" },
      { chinese: "他是中国人。", pinyin: "Tā shì Zhōngguó rén.", english: "He is Chinese.", bengali: "তিনি একজন চীনা নাগরিক।" },
      { chinese: "这不是我的书。", pinyin: "Zhè bù shì wǒ de shū.", english: "This is not my book.", bengali: "এটি আমার বই নয়।" },
    ],
    commonMistakes: [
      { incorrect: "我是很高。", correct: "我很高。", reason: "Never use 是 directly before adjectives without '的'." },
    ],
    practiceQuestions: [
      {
        id: "q-g1-1",
        prompt: "Which sentence correctly uses 是?",
        type: "choice",
        options: ["她是很高大", "她是李老师", "苹果是甜", "今天是很热"],
        correctAnswer: "她是李老师",
        explanation: "是 is used to equate subject with a noun (李老师), not adjectives.",
      },
      {
        id: "q-g1-2",
        prompt: "Reorder to form a correct sentence: [书 / 这 / 老师 / 是 / 的]",
        type: "reorder",
        correctAnswer: ["这", "是", "老师", "的", "书"],
        explanation: "Correct order: 这 (Subject) + 是 + 老师的书 (Noun phrase).",
      },
    ],
  },
  {
    id: "g-hsk1-ma",
    hskLevel: "1",
    title: "Yes/No Questions with 吗 (ma)",
    chineseTitle: "疑问助词“吗”",
    pattern: "Statement + 吗？",
    category: "Particle",
    summary: "Turn any declarative statement into a yes-or-no question simply by appending 吗.",
    explanation: "Unlike English, which inverts verbs or adds auxiliary verbs ('Do you...?'), Chinese simply attaches the question particle 吗 to the end of any statement. Word order does not change.",
    bengaliExplanation: "চীনা ভাষায় যেকোনো সাধারণ বাক্যের শেষে 吗 (ma) যোগ করে হ্যাঁ/না প্রশ্ন তৈরি করা যায়। বাক্যের ক্রম পরিবর্তন করতে হয় না।",
    examples: [
      { chinese: "你是中国人吗？", pinyin: "Nǐ shì Zhōngguó rén ma?", english: "Are you Chinese?", bengali: "আপনি কি চীনা নাগরিক?" },
      { chinese: "你喜欢喝茶吗？", pinyin: "Nǐ xǐhuan hē chá ma?", english: "Do you like drinking tea?", bengali: "আপনি কি চা খেতে পছন্দ করেন?" },
      { chinese: "他去学校吗？", pinyin: "Tā qù xuéxiào ma?", english: "Is he going to school?", bengali: "সে কি স্কুলে যাচ্ছে?" },
    ],
    commonMistakes: [
      { incorrect: "你是谁吗？", correct: "你是谁？", reason: "Do not use 吗 when a question word (谁, 什么, 哪儿) is already present." },
    ],
    practiceQuestions: [
      {
        id: "q-g1-3",
        prompt: "Turn '他喝咖啡' (He drinks coffee) into a question:",
        type: "choice",
        options: ["他喝咖啡吗？", "吗他喝咖啡？", "他喝吗咖啡？", "他是喝咖啡吗？"],
        correctAnswer: "他喝咖啡吗？",
        explanation: "Append 吗 at the very end of the statement.",
      },
    ],
  },
  {
    id: "g-hsk1-de",
    hskLevel: "1",
    title: "Possessive & Attributive Particle 的 (de)",
    chineseTitle: "结构助词“的”",
    pattern: "Possessor / Modifier + 的 + Head Noun",
    category: "Particle",
    summary: "Marks possession ('s) or attaches modifiers, descriptions, and relative clauses to a noun.",
    explanation: "的 functions similarly to apostrophe-s ('s) or 'of' in English. It links possessors to objects (我的书) and adjectives to nouns (漂亮的衣服). For close family relationships, 的 is often dropped (我爸爸).",
    bengaliExplanation: "的 (de) মালিকানা ('এর') অথবা বিশেষণীয় রূপ প্রকাশ করে। যেমন: 我的 (আমার), 红色的 (লাল রঙের)।",
    examples: [
      { chinese: "这是我的汉语老师。", pinyin: "Zhè shì wǒ de hànyǔ lǎoshī.", english: "This is my Chinese teacher.", bengali: "ইনি আমার চীনা ভাষার শিক্ষক।" },
      { chinese: "北京的秋天很美。", pinyin: "Běijīng de qiūtiān hěn měi.", english: "Beijing's autumn is beautiful.", bengali: "বেইজিংয়ের শরৎকাল খুব সুন্দর।" },
    ],
    practiceQuestions: [
      {
        id: "q-g1-4",
        prompt: "Choose the correct translation: 'My friend's computer'",
        type: "choice",
        options: ["朋友的我电脑", "我朋友的电脑", "电脑我朋友的", "我的是朋友电脑"],
        correctAnswer: "我朋友的电脑",
        explanation: "我朋友 (my friend) + 的 + 电脑 (computer).",
      },
    ],
  },
  // --- HSK 2 ---
  {
    id: "g-hsk2-le",
    hskLevel: "2",
    title: "Change of State & Completion with 了 (le)",
    chineseTitle: "动态助词与语气助词“了”",
    pattern: "Verb + 了 (Action completed) / Sentence + 了 (New situation)",
    category: "Aspect Marker",
    summary: "Indicates completed action (aspect marker) or a change in status/situation (modal particle).",
    explanation: "Chinese does not conjugate past tense verbs. Instead, 了 marks completion of an action or announces a brand new state of affairs (e.g. 下雨了 = it has started raining).",
    bengaliExplanation: "চীনা ভাষায় ক্রিয়ার অতীত কাল রূপান্তর নেই। কাজ সম্পন্ন হওয়া বোঝাতে ক্রিয়ার পরে অথবা নতুন পরিস্থিতি বোঝাতে বাক্যের শেষে 了 বসে।",
    examples: [
      { chinese: "我买了一本书。", pinyin: "Wǒ mǎi le yì běn shū.", english: "I bought a book.", bengali: "আমি একটি বই কিনেছি।" },
      { chinese: "春天来了，天气热了。", pinyin: "Chūntiān lái le, tiānqì rè le.", english: "Spring has arrived; the weather has turned warm.", bengali: "বসন্ত এসেছে, আবহাওয়া গরম হয়েছে।" },
    ],
    commonMistakes: [
      { incorrect: "我昨天没去了学校。", correct: "我昨天没去学校。", reason: "Never use 了 in negative sentences with 没 (méi)." },
    ],
    practiceQuestions: [
      {
        id: "q-g2-1",
        prompt: "Fill in the blank: 我昨天吃了早饭就去学校___。",
        type: "choice",
        options: ["了", "着", "过", "的"],
        correctAnswer: "了",
        explanation: "Completes the sequence of action in the sentence.",
      },
    ],
  },
  {
    id: "g-hsk2-bi",
    hskLevel: "2",
    title: "Comparative Sentences with 比 (bǐ)",
    chineseTitle: "“比”字比较句",
    pattern: "A + 比 + B + Adjective (+ Complement / Degree)",
    category: "Comparison",
    summary: "Compares two things indicating A is more [adjective] than B.",
    explanation: "Do not use 很 (hěn) inside 比 comparisons. To express 'much more', use 多了 (duō le) or 得多 (de duō) at the end. To express 'a little bit more', use 一点儿 (yìdiǎnr).",
    bengaliExplanation: "দুটো বস্তুর মধ্যে তুলনা করার জন্য A + 比 + B + বিশেষণ ব্যবহৃত হয়। এতে 很 ব্যবহার করা যাবে না।",
    examples: [
      { chinese: "今天比昨天冷。", pinyin: "Jīntiān bǐ zuótiān lěng.", english: "Today is colder than yesterday.", bengali: "আজ গতকালের চেয়ে বেশি ঠান্ডা।" },
      { chinese: "哥哥比弟弟高得多。", pinyin: "Gēge bǐ dìdi gāo de duō.", english: "The older brother is much taller than the younger brother.", bengali: "বড় ভাই ছোট ভাইয়ের চেয়ে অনেক লম্বা।" },
    ],
    commonMistakes: [
      { incorrect: "今天比昨天很冷。", correct: "今天比昨天冷。", reason: "Do not place 很 in a 比 comparative structure." },
    ],
    practiceQuestions: [
      {
        id: "q-g2-2",
        prompt: "Reorder to form: 'She runs faster than me': [我 / 比 / 她 / 跑 / 得 / 快]",
        type: "reorder",
        correctAnswer: ["她", "比", "我", "跑", "得", "快"],
        explanation: "Subject (她) + 比 + Object (我) + Verb + 得 + Degree (快).",
      },
    ],
  },
  // --- HSK 3 ---
  {
    id: "g-hsk3-ba",
    hskLevel: "3",
    title: "The Disposal 把 (bǎ) Sentence Structure",
    chineseTitle: "“把”字处置句",
    pattern: "Subject + 把 + Object + Verb + Result / Direction / Other Element",
    category: "Passive & Disposal",
    summary: "Brings the object forward to emphasize what happened to it or its change of state/position.",
    explanation: "The 把 structure requires that the object is specific and known to both speaker and listener. The verb must have an effect on the object and cannot stand alone—it must be accompanied by a complement, 了, or duplication.",
    bengaliExplanation: "把 (bǎ) কাঠামোয় কর্মকে ক্রিয়ার আগে নিয়ে আসা হয় যাতে কর্মের উপর কী ক্রিয়া বা পরিবর্তন ঘটেছে তা স্পষ্ট হয়।",
    examples: [
      { chinese: "请把门关上。", pinyin: "Qǐng bǎ mén guān shàng.", english: "Please close the door.", bengali: "দয়া করে দরজাটি বন্ধ করুন।" },
      { chinese: "他把作业做完了。", pinyin: "Tā bǎ zuòyè zuò wán le.", english: "He finished his homework.", bengali: "সে তার হোমওয়ার্ক শেষ করেছে।" },
      { chinese: "我把手机忘在家里了。", pinyin: "Wǒ bǎ shǒujī wàng zài jiā lǐ le.", english: "I left my phone at home.", bengali: "আমি আমার ফোন বাড়িতে ফেলে এসেছি।" },
    ],
    commonMistakes: [
      { incorrect: "我把他喜欢。", correct: "我喜欢他。", reason: "Verbs of emotion or perception (喜欢, 觉得, 知道) cannot be used in a 把 sentence." },
    ],
    practiceQuestions: [
      {
        id: "q-g3-1",
        prompt: "Which sentence correctly applies the 把 construction?",
        type: "choice",
        options: [
          "请把那杯水喝完。",
          "我把这本书喜欢。",
          "他把电脑有。",
          "你把他知道吗？",
        ],
        correctAnswer: "请把那杯水喝完。",
        explanation: "喝完 is a causative/disposal action with a result complement.",
      },
    ],
  },
  {
    id: "g-hsk3-bei",
    hskLevel: "3",
    title: "Passive Sentences with 被 (bèi)",
    chineseTitle: "“被”字被动句",
    pattern: "Subject (Receiver) + 被 (+ Agent) + Verb + Other Element",
    category: "Passive & Disposal",
    summary: "Used to express the passive voice, often implying an unfortunate or significant result.",
    explanation: "The subject is the receiver of the action. The doer (agent) can be mentioned or omitted. Like 把 sentences, the verb usually cannot stand alone.",
    bengaliExplanation: "被 (bèi) দ্বারা কর্মবাচ্য (Passive Voice) গঠিত হয়। সাধারণত অনিচ্ছাকৃত বা অপ্রীতিকর ঘটনা প্রকাশে ব্যবহৃত হয়।",
    examples: [
      { chinese: "我的自行车被小偷偷了。", pinyin: "Wǒ de zìxíngchē bèi xiǎotōu tōu le.", english: "My bicycle was stolen by a thief.", bengali: "আমার সাইকেলটি চোর চুরি করে নিয়ে গেছে।" },
      { chinese: "西瓜被大家吃光了。", pinyin: "Xīguā bèi dàjiā chī guāng le.", english: "The watermelon was all eaten up by everyone.", bengali: "তরমুজটি সবাই মিলে খেয়ে শেষ করেছে।" },
    ],
    practiceQuestions: [
      {
        id: "q-g3-2",
        prompt: "Fill in the blank: 那个苹果___他吃了。",
        type: "choice",
        options: ["被", "把", "比", "在"],
        correctAnswer: "被",
        explanation: "The apple is the receiver of the action (eaten by him).",
      },
    ],
  },
  {
    id: "g-hsk3-shide",
    hskLevel: "3",
    title: "The 是……的 (shì...de) Focus Construction",
    chineseTitle: "“是……的”强调句",
    pattern: "Subject + 是 + [Time / Place / Manner] + Verb + 的",
    category: "Sentence Pattern",
    summary: "Emphasizes the specific details (time, location, manner, or agent) of a past completed action.",
    explanation: "When both speaker and listener already know the event occurred, 是……的 shifts the focus to HOW, WHEN, WHERE, or WITH WHOM it happened. In positive sentences, 是 can be omitted, but 的 must remain.",
    bengaliExplanation: "অতীতে সম্পন্ন হওয়া কোনো কাজের সময়, স্থান বা মাধ্যমকে বিশেষভাবে গুরুত্ব দেওয়ার জন্য 是...的 ব্যবহৃত হয়।",
    examples: [
      { chinese: "我是坐飞机来的。", pinyin: "Wǒ shì zuò fēijī lái de.", english: "I came by plane. (Emphasizes manner/transport)", bengali: "আমি বিমানে করে এসেছি।" },
      { chinese: "他们是在图书馆认识的。", pinyin: "Tāmen shì zài túshūguǎn rènshi de.", english: "It was in the library that they met.", bengali: "তারা লাইব্রেরিতে পরিচিত হয়েছিল।" },
    ],
    practiceQuestions: [
      {
        id: "q-g3-3",
        prompt: "If you want to emphasize WHEN you arrived in Beijing, say:",
        type: "choice",
        options: [
          "我是昨天到北京的。",
          "我昨天到了北京。",
          "我到北京是昨天。",
          "昨天我到北京了。",
        ],
        correctAnswer: "我是昨天到北京的。",
        explanation: "是……的 precisely emphasizes the past time modifier 昨天.",
      },
    ],
  },
  // --- HSK 4 ---
  {
    id: "g-hsk4-chule",
    hskLevel: "4",
    title: "Besides & In Addition: 除了……以外 (chúle...yǐwài)",
    chineseTitle: "“除了……以外”句型",
    pattern: "除了 + A + 以外，还 / 都 + Verb Phrase",
    category: "Conjunction",
    summary: "Expresses either inclusion ('besides A, also...') or exclusion ('except for A, all...').",
    explanation: "When paired with 还 (hái) or 也 (yě), it means IN ADDITION. When paired with 都 (dōu), it means EXCEPT FOR (exclusive).",
    bengaliExplanation: "除了 এর সাথে 还/也 থাকলে অর্থ 'এছাড়া আরও', আর 都 থাকলে অর্থ 'ব্যতীত সবাই/সবকিছু'।",
    examples: [
      { chinese: "除了汉语以外，他还会说法语。", pinyin: "Chúle hànyǔ yǐwài, tā hái huì shuō fǎyǔ.", english: "Besides Chinese, he also speaks French.", bengali: "চীনা ভাষা ছাড়াও তিনি ফরাসি বলতে পারেন।" },
      { chinese: "除了小王，大家都参加了会议。", pinyin: "Chúle Xiǎo Wáng, dàjiā dōu cānjiā le huìyì.", english: "Except for Xiao Wang, everyone attended the meeting.", bengali: "শাও ওয়াং ছাড়া বাকি সবাই সভায় যোগ দিয়েছিল।" },
    ],
    practiceQuestions: [
      {
        id: "q-g4-1",
        prompt: "Choose the correct connector for exclusion (except): 除了星期天以外，图书馆每天___开门。",
        type: "choice",
        options: ["都", "还", "也", "又"],
        correctAnswer: "都",
        explanation: "都 marks complete inclusive/exclusive totality (every day except Sunday).",
      },
    ],
  },
  {
    id: "g-hsk4-yue-yue",
    hskLevel: "4",
    title: "Progressive & Proportional Change: 越来越... / 越...越...",
    chineseTitle: "“越来越……”与“越……越……”",
    pattern: "越来越 + Adj/Verb (More and more) / 越 + A + 越 + B (The more A, the more B)",
    category: "Sentence Pattern",
    summary: "Expresses intensifying conditions over time or proportional cause and effect.",
    explanation: "越来越 indicates that degree increases as time passes (天气越来越好). 越 A 越 B shows that condition B changes proportionally with condition A (越学越有意思).",
    bengaliExplanation: "越来越 অর্থ 'দিন দিন আরও বেশি', আর 越 A 越 B অর্থ 'যত A তত B'।",
    examples: [
      { chinese: "他的汉语水平越来越高。", pinyin: "Tā de hànyǔ shuǐpíng yuè lái yuè gāo.", english: "His Chinese level is getting higher and higher.", bengali: "তার চীনা ভাষার দক্ষতা দিন দিন উন্নত হচ্ছে।" },
      { chinese: "汉字越学越有趣。", pinyin: "Hànzì yuè xué yuè yǒuqù.", english: "The more Chinese characters you study, the more interesting they become.", bengali: "হানজি যত শিখবেন তত আকর্ষণীয় মনে হবে।" },
    ],
    practiceQuestions: [
      {
        id: "q-g4-2",
        prompt: "Complete: 雨下得越___，路上人越少。",
        type: "choice",
        options: ["大", "多", "很", "高"],
        correctAnswer: "大",
        explanation: "Rain intensity is described with 大 (heavy).",
      },
    ],
  },
  // --- HSK 5 ---
  {
    id: "g-hsk5-jinjin",
    hskLevel: "5",
    title: "Emphatic Restriction: 不仅……而且…… (bùjǐn...érqiě...)",
    chineseTitle: "递进关联词“不仅……而且……”",
    pattern: "不仅 + A，而且 / 还 + B",
    category: "Conjunction",
    summary: "Expresses progressive advancement: 'Not only A, but also B'.",
    explanation: "If both clauses share the same subject, 不仅 is placed after the subject. If they have different subjects, 不仅 must precede the first subject.",
    bengaliExplanation: "'শুধু A-ই নয়, সাথে B-ও' বোঝাতে 不仅……而且…… ব্যবহৃত হয়।",
    examples: [
      { chinese: "这项技术不仅节约了成本，而且提高了效率。", pinyin: "Zhè xiàng jìshù bùjǐn jiéyuē le chéngběn, érqiě tígāo le xiàolǜ.", english: "This technology not only saved costs, but also improved efficiency.", bengali: "এই প্রযুক্তি কেবল খরচই কমায়নি, বরং কার্যক্ষমতাও বাড়িয়েছে।" },
    ],
    practiceQuestions: [
      {
        id: "q-g5-1",
        prompt: "Where should 不仅 be placed when subjects are different?",
        type: "choice",
        options: ["Before the first subject", "After the first subject", "At the very end of the clause", "Before the second verb"],
        correctAnswer: "Before the first subject",
        explanation: "With distinct subjects (不仅老师喜欢，而且学生也喜欢), 不仅 precedes the first subject.",
      },
    ],
  },
  // --- HSK 6 ---
  {
    id: "g-hsk6-shiyi",
    hskLevel: "6",
    title: "Formal Causative: 使得 (shǐde) in Written Chinese",
    chineseTitle: "书面语致使动词“使得”",
    pattern: "Condition / Action + 使得 + Subject + Result",
    category: "Sentence Pattern",
    summary: "Formal written Chinese for 'causes', 'makes', or 'leads to'.",
    explanation: "使得 is a hallmark of formal and academic discourse in HSK 6 and official reports, introducing the direct consequence of a preceding circumstance.",
    bengaliExplanation: "使得 (shǐde) আনুষ্ঠানিক চীনা ভাষায় 'যার ফলে' বা 'যা ঘটিয়েছে' প্রকাশ করতে ব্যবহৃত হয়।",
    examples: [
      { chinese: "全球气候变暖使得极端天气事件日益频繁。", pinyin: "Quánqiú qìhòu biàn nuǎn shǐde jíduān tiānqì shìjiàn rìyì pínfán.", english: "Global warming causes extreme weather events to become increasingly frequent.", bengali: "বৈশ্বিক উষ্ণায়ন চরম আবহাওয়াজনিত ঘটনাকে ক্রমাগত বাড়িয়ে তুলছে।" },
    ],
    practiceQuestions: [
      {
        id: "q-g6-1",
        prompt: "使得 is primarily used in which register?",
        type: "choice",
        options: ["Formal written / academic", "Informal street slang", "Nursery rhymes", "Only in ancient poems"],
        correctAnswer: "Formal written / academic",
        explanation: "使得 is a classic formal written connective verb characteristic of HSK 5-6 texts.",
      },
    ],
  },
];

class GrammarService {
  public getAllGrammarPoints(): GrammarPoint[] {
    return GRAMMAR_POINTS;
  }

  public getPointsByLevel(level: HskLevel): GrammarPoint[] {
    return GRAMMAR_POINTS.filter((p) => p.hskLevel === level);
  }

  public getPointById(id: string): GrammarPoint | undefined {
    return GRAMMAR_POINTS.find((p) => p.id === id);
  }

  public filterPoints(level?: HskLevel | "all", category?: GrammarCategory | "all", query?: string): GrammarPoint[] {
    let result = GRAMMAR_POINTS;

    if (level && level !== "all") {
      result = result.filter((p) => p.hskLevel === level);
    }

    if (category && category !== "all") {
      result = result.filter((p) => p.category === category);
    }

    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.chineseTitle.includes(q) ||
          p.pattern.toLowerCase().includes(q) ||
          p.explanation.toLowerCase().includes(q) ||
          p.examples.some((e) => e.chinese.includes(q) || e.pinyin.toLowerCase().includes(q) || e.english.toLowerCase().includes(q))
      );
    }

    return result;
  }
}

export const grammarService = new GrammarService();
