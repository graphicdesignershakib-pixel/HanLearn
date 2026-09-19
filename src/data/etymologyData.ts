export interface HanziNode {
  char: string;
  pinyin: string;
  meaningEn: string;
  meaningBn: string;
  type: "pictograph" | "ideograph" | "phono-semantic" | "compound-ideograph";
  typeLabelEn: string;
  typeLabelBn: string;
  oracleBoneUrl?: string; // Oracle bone / seal script representation
  oracleBoneDescEn: string;
  oracleBoneDescBn: string;
  etymologyStoryEn: string;
  etymologyStoryBn: string;
  bengaliMnemonic: string; // Special Bengali mnemonic memory hook
  components: {
    char: string;
    pinyin: string;
    role: "semantic" | "phonetic" | "root";
    meaningEn: string;
    meaningBn: string;
    notesEn: string;
    notesBn: string;
  }[];
  derivatives: {
    char: string;
    pinyin: string;
    meaningEn: string;
    meaningBn: string;
    roleInWord: string;
  }[];
}

export const ETYMOLOGY_DATABASE: Record<string, HanziNode> = {
  好: {
    char: "好",
    pinyin: "hǎo",
    meaningEn: "Good, well, pleasant",
    meaningBn: "ভালো, উত্তম, চমৎকার",
    type: "compound-ideograph",
    typeLabelEn: "Compound Ideograph (会意字)",
    typeLabelBn: "যৌথ অর্থবোধক বর্ণ (会意字)",
    oracleBoneDescEn: "Originally depicted a mother (女) tenderly holding her newborn child (子).",
    oracleBoneDescBn: "প্রাচীন ওরাকল লিপিতে মা (女) তাঁর কোলে সদ্যজাত শিশুকে (子) জড়িয়ে রাখার দৃশ্য থেকে তৈরি।",
    etymologyStoryEn: "In ancient China, the loving bond between a mother and her infant represented the most harmonious, sacred, and 'good' thing in the human world.",
    etymologyStoryBn: "প্রাচীন চীনে মা এবং তাঁর সন্তানের অকৃত্রিম ভালোবাসার চেয়ে মহৎ ও 'ভালো' আর কিছু হতে পারত না। তাই এই দুটি বর্ণ মিলে '好' (ভালো) হয়েছে।",
    bengaliMnemonic: "মা (女) এবং সন্তান (子) যখন একসাথে থাকে, তখন সবকিছুই 'ভালো' (好) থাকে।",
    components: [
      {
        char: "女",
        pinyin: "nǚ",
        role: "semantic",
        meaningEn: "Woman / Mother",
        meaningBn: "নারী / মা",
        notesEn: "Semantic carrier: symbolizes care, tenderness, and matriarchal protection.",
        notesBn: "অর্থ নির্দেশক: মমতা ও মাতৃস্নেহ প্রতীক।",
      },
      {
        char: "子",
        pinyin: "zǐ",
        role: "semantic",
        meaningEn: "Child / Son / Seed",
        meaningBn: "সন্তান / শিশু",
        notesEn: "Semantic carrier: symbolizes innocence, family lineage, and growth.",
        notesBn: "অর্থ নির্দেশক: নতুন বংশধর ও ভবিষ্যত।",
      },
    ],
    derivatives: [
      { char: "好看", pinyin: "hǎokàn", meaningEn: "Good-looking, attractive", meaningBn: "দেখতে সুন্দর", roleInWord: "好 (good) + 看 (look)" },
      { char: "好吃", pinyin: "hǎochī", meaningEn: "Delicious, tasty", meaningBn: "সুস্বাদু", roleInWord: "好 (good) + 吃 (eat)" },
      { char: "友好", pinyin: "yǒuhǎo", meaningEn: "Friendly, amicable", meaningBn: "বন্ধুভাবাপন্ন", roleInWord: "友 (friend) + 好 (good)" },
    ],
  },
  明: {
    char: "明",
    pinyin: "míng",
    meaningEn: "Bright, clear, obvious, tomorrow",
    meaningBn: "উজ্জ্বল, পরিষ্কার, আগামী",
    type: "compound-ideograph",
    typeLabelEn: "Compound Ideograph (会意字)",
    typeLabelBn: "যৌথ অর্থবোধক বর্ণ (会意字)",
    oracleBoneDescEn: "Showed the blazing sun (日) paired with the pale luminous moon (月).",
    oracleBoneDescBn: "দীপ্তিময় সূর্য (日) এবং স্নিগ্ধ চাঁদ (月) পাশাপাশি অবস্থান করছে।",
    etymologyStoryEn: "The sun rules the daytime light, and the moon illuminates the night darkness. Bringing both celestial bodies together symbolizes ultimate brilliance and radiant clarity.",
    etymologyStoryBn: "দিনের আকাশে সূর্য এবং রাতের আকাশে চাঁদ—এই দুই মহাজাগতিক আলোর একত্রীকরণ মানেই পরম 'উজ্জ্বলতা' ও স্পষ্টতা।",
    bengaliMnemonic: "দিনের সূর্য (日) আর রাতের চাঁদ (月) একসাথে জ্বললে চারপাশ 'উজ্জ্বল' (明) হয়ে ওঠে।",
    components: [
      {
        char: "日",
        pinyin: "rì",
        role: "semantic",
        meaningEn: "Sun / Day",
        meaningBn: "সূর্য / দিন",
        notesEn: "Primary light source of the daytime.",
        notesBn: "দিনের প্রধান আলোর উৎস।",
      },
      {
        char: "月",
        pinyin: "yuè",
        role: "semantic",
        meaningEn: "Moon / Month",
        meaningBn: "চাঁদ / মাস",
        notesEn: "Primary celestial reflector of the nighttime.",
        notesBn: "রাতের স্নিগ্ধ আলো দানকারী।",
      },
    ],
    derivatives: [
      { char: "明天", pinyin: "míngtiān", meaningEn: "Tomorrow", meaningBn: "আগামীকাল", roleInWord: "明 (bright) + 天 (day/sky)" },
      { char: "明白", pinyin: "míngbai", meaningEn: "To understand clearly", meaningBn: "স্পষ্ট বুঝতে পারা", roleInWord: "明 (clear) + 白 (pure white)" },
      { char: "聪明", pinyin: "cōngming", meaningEn: "Smart, clever", meaningBn: "চালাক / বুদ্ধিমান", roleInWord: "聪 (keen ear) + 明 (sharp vision)" },
    ],
  },
  休: {
    char: "休",
    pinyin: "xiū",
    meaningEn: "Rest, stop, pause",
    meaningBn: "বিশ্রাম নেওয়া, থামা",
    type: "compound-ideograph",
    typeLabelEn: "Compound Ideograph (会意字)",
    typeLabelBn: "যৌথ অর্থবোধক বর্ণ (会意字)",
    oracleBoneDescEn: "A tired human (亻/人) leaning against the trunk of a shaded tree (木).",
    oracleBoneDescBn: "একজন ক্লান্ত মানুষ (亻) ছায়াময় গাছের (木) গুঁড়িতে হেলান দিয়ে দাঁড়িয়ে আছে।",
    etymologyStoryEn: "After hours of grueling toil in ancient agricultural fields, a farmer would seek comfort and rejuvenation under the sprawling branches of a leafy tree.",
    etymologyStoryBn: "প্রাচীনকালে রোদ আর মাঠে কঠোর পরিশ্রমের পর ক্লান্ত মানুষ গাছের ছায়ায় হেলান দিয়ে 'বিশ্রাম' (休) নিত।",
    bengaliMnemonic: "একজন মানুষ (亻) গাছের (木) নিচে দাঁড়িয়ে 'বিশ্রাম' (休) নিচ্ছে।",
    components: [
      {
        char: "亻",
        pinyin: "rén",
        role: "semantic",
        meaningEn: "Human / Person (Radical form of 人)",
        meaningBn: "মানুষ (人 এর রূপ)",
        notesEn: "Depicts a standing person in side profile.",
        notesBn: "একপাশে কাত হয়ে দাঁড়ানো মানুষের রূপ।",
      },
      {
        char: "木",
        pinyin: "mù",
        role: "semantic",
        meaningEn: "Tree / Wood",
        meaningBn: "গাছ / কাঠ",
        notesEn: "Depicts roots below and branches above.",
        notesBn: "মাটির নিচে শিকড় এবং উপরে শাখা-প্রশাখা।",
      },
    ],
    derivatives: [
      { char: "休息", pinyin: "xiūxi", meaningEn: "To rest, take a break", meaningBn: "বিশ্রাম নেওয়া", roleInWord: "休 (rest) + 息 (breath)" },
      { char: "休假", pinyin: "xiūjià", meaningEn: "Take a vacation / leave", meaningBn: "ছুটি কাটানো", roleInWord: "休 (rest) + 假 (holiday)" },
    ],
  },
  森: {
    char: "森",
    pinyin: "sēn",
    meaningEn: "Dense forest, vast woodland",
    meaningBn: "গভীর জঙ্গল, অরণ্য",
    type: "compound-ideograph",
    typeLabelEn: "Compound Ideograph (会意字)",
    typeLabelBn: "যৌথ অর্থবোধক বর্ণ (会意字)",
    oracleBoneDescEn: "Three trees (木 + 木 + 木) bundled in a triangle to depict overwhelming abundance of foliage.",
    oracleBoneDescBn: "তিনটি গাছ (木 + 木 + 木) মিলে একটি ঘন বনের রূপ তৈরি করেছে।",
    etymologyStoryEn: "One tree is '木' (wood), two trees side-by-side make '林' (woods/grove), and three stacked trees form '森' (deep dense jungle).",
    etymologyStoryBn: "একটি গাছ হলে '木', দুটি গাছ হলে '林' (ছোট বন), আর তিনটি গাছ স্তূপাকার হলে তৈরি হয় '森' (গভীর অরণ্য)।",
    bengaliMnemonic: "এক গাছে কাঠ (木), দুই গাছে বন (林), আর তিন গাছে নিবিড় জঙ্গল (森)।",
    components: [
      {
        char: "木",
        pinyin: "mù",
        role: "root",
        meaningEn: "Tree 1 (Top crown)",
        meaningBn: "শীর্ষের গাছ",
        notesEn: "Represents the tall forest canopy.",
        notesBn: "বনের উঁচু চূড়া।",
      },
      {
        char: "木",
        pinyin: "mù",
        role: "root",
        meaningEn: "Tree 2 (Bottom-left)",
        meaningBn: "বামের গাছ",
        notesEn: "Represents understory trees.",
        notesBn: "বনের পার্শ্ববর্তী বৃক্ষ।",
      },
      {
        char: "木",
        pinyin: "mù",
        role: "root",
        meaningEn: "Tree 3 (Bottom-right)",
        meaningBn: "ডানের গাছ",
        notesEn: "Represents endless surrounding woodland.",
        notesBn: "অবিচ্ছিন্ন বনাঞ্চল।",
      },
    ],
    derivatives: [
      { char: "森林", pinyin: "sēnlín", meaningEn: "Forest, dense woods", meaningBn: "জঙ্গল / অরণ্য", roleInWord: "森 (dense) + 林 (woods)" },
      { char: "森严", pinyin: "sēnyán", meaningEn: "Strict, heavily guarded", meaningBn: "কড়া পাহারা", roleInWord: "森 (dense) + 严 (tight)" },
    ],
  },
  家: {
    char: "家",
    pinyin: "jiā",
    meaningEn: "Home, family, house",
    meaningBn: "বাড়ি, ঘর, পরিবার",
    type: "compound-ideograph",
    typeLabelEn: "Compound Ideograph (会意字)",
    typeLabelBn: "যৌথ অর্থবোধক বর্ণ (会意字)",
    oracleBoneDescEn: "A roof shelter (宀) with a domesticated pig (豕) residing underneath.",
    oracleBoneDescBn: "একটি ছাদ বা ঘরের (宀) নিচে একটি গৃহপালিত শূকর (豕)।",
    etymologyStoryEn: "In prehistoric pastoral China, keeping domestic livestock under one's rooftop protected against predators and symbolized true prosperity, stability, and settled domestic family life.",
    etymologyStoryBn: "প্রাচীন যুগে বন্য প্রাণীদের আক্রমণ থেকে বাঁচতে গৃহপালিত পশুকে ঘরের ছাদের (宀) নিচে রাখা হতো। যার ঘরে খাদ্য ও পশু সুরক্ষিত, সেটাই সত্যিকারের 'বাড়ি' বা 'পরিবার' (家)।",
    bengaliMnemonic: "ছাদের নিচে (宀) যখন খাদ্যের সুরক্ষা (豕) থাকে, তখনই সেটা স্থায়ী 'ঘর' (家)।",
    components: [
      {
        char: "宀",
        pinyin: "mián",
        role: "semantic",
        meaningEn: "Roof / Shelter",
        meaningBn: "ছাদ / কুটির",
        notesEn: "Represents a dwelling shelter overhead.",
        notesBn: "মাথার ওপর আশ্রয় বা ছাদ।",
      },
      {
        char: "豕",
        pinyin: "shǐ",
        role: "semantic",
        meaningEn: "Pig / Boar / Livestock",
        meaningBn: "শূকর / গৃহপালিত পশু",
        notesEn: "Ancient emblem of wealth and food security.",
        notesBn: "প্রাচীনকালের খাদ্য ও সম্পদের প্রতীক।",
      },
    ],
    derivatives: [
      { char: "家人", pinyin: "jiārén", meaningEn: "Family members", meaningBn: "পরিবারের সদস্য", roleInWord: "家 (family) + 人 (person)" },
      { char: "国家", pinyin: "guójiā", meaningEn: "Country, nation", meaningBn: "দেশ / রাষ্ট্র", roleInWord: "国 (nation) + 家 (home)" },
      { char: "回家", pinyin: "huíjiā", meaningEn: "Go home", meaningBn: "বাড়ি ফেরা", roleInWord: "回 (return) + 家 (home)" },
    ],
  },
  想: {
    char: "想",
    pinyin: "xiǎng",
    meaningEn: "To think, miss, yearn, desire",
    meaningBn: "ভাবা, চিন্তা করা, মিস করা",
    type: "phono-semantic",
    typeLabelEn: "Phono-Semantic Compound (形声字)",
    typeLabelBn: "ধ্বনি ও অর্থ সংমিশ্রণ বর্ণ (形声字)",
    oracleBoneDescEn: "Visual appearances (相) deeply imprinted upon the inner heart (心).",
    oracleBoneDescBn: "চোখে দেখা কোনো রূপ বা প্রতিচ্ছবি (相) যখন মনের গভীরে (心) গেঁথে থাকে।",
    etymologyStoryEn: "When your heart (心) constantly replays the visual image and memories of a person or scene (相), you are experiencing 'thought' and 'yearning' (想).",
    etymologyStoryBn: "যখন চোখের দেখা কোনো ছবি (相) হৃদয় বা মন (心) দিয়ে স্মরণ করা হয়, তখনই সৃষ্টি হয় গভীর 'চিন্তা' বা 'অনুভূতি' (想)।",
    bengaliMnemonic: "চোখে দেখা রূপ (相) মনের গভীরে (心) গেঁথে যাওয়া মানেই তাকে 'মনে করা' (想)।",
    components: [
      {
        char: "相",
        pinyin: "xiāng",
        role: "phonetic",
        meaningEn: "Mutual / Appearance / Look",
        meaningBn: "দৃশ্য / পারস্পরিক",
        notesEn: "Supplies the phonetic sound (xiāng -> xiǎng) and visual image concept.",
        notesBn: "উচ্চারণ সাদৃশ্য এবং বাহ্যিক রূপের ধারণা প্রদান করে।",
      },
      {
        char: "心",
        pinyin: "xīn",
        role: "semantic",
        meaningEn: "Heart / Mind",
        meaningBn: "হৃদয় / মন",
        notesEn: "Seat of consciousness, emotion, and intellect in Chinese philosophy.",
        notesBn: "অনুভূতি ও মননের কেন্দ্রবিন্দু।",
      },
    ],
    derivatives: [
      { char: "想法", pinyin: "xiǎngfǎ", meaningEn: "Idea, opinion", meaningBn: "ধারণা / মতামত", roleInWord: "想 (think) + 法 (way/method)" },
      { char: "想念", pinyin: "xiǎngniàn", meaningEn: "To miss someone dearly", meaningBn: "কাউকে খুব মিস করা", roleInWord: "想 (think) + 念 (yearn)" },
    ],
  },
  看: {
    char: "看",
    pinyin: "kàn",
    meaningEn: "To look, watch, read",
    meaningBn: "দেখা, তাকানো, পড়া",
    type: "compound-ideograph",
    typeLabelEn: "Compound Ideograph (会意字)",
    typeLabelBn: "যৌথ অর্থবোধক বর্ণ (会意字)",
    oracleBoneDescEn: "A flat open hand (手/𠂒) held directly above a wide open eye (目) to block glare.",
    oracleBoneDescBn: "চোখের (目) ওপর এক হাত (手) কপালে ঠেকিয়ে দূরের দৃশ্য দেখার ভঙ্গি।",
    etymologyStoryEn: "Depicts an ancient scout or traveler shading their eyes with their hand against the scorching sun to gaze far into the distant horizon.",
    etymologyStoryBn: "সূর্যের প্রখর রোদে চোখের ওপর হাত কপালে রেখে দূরের দিকে তাকানোর ভঙ্গি থেকেই '看' (দেখা) অক্ষরের উৎপত্তি।",
    bengaliMnemonic: "চোখের (目) ওপর হাত (手) রেখে দৃষ্টি মেলে 'দেখা' (看)।",
    components: [
      {
        char: "𠂒 / 手",
        pinyin: "shǒu",
        role: "semantic",
        meaningEn: "Hand (Stylized canopy)",
        meaningBn: "হাত",
        notesEn: "The hand held horizontal over the brow to shield sun rays.",
        notesBn: "রোদের তীব্রতা ঠেকাতে কপালে রাখা হাত।",
      },
      {
        char: "目",
        pinyin: "mù",
        role: "semantic",
        meaningEn: "Eye / Pupil",
        meaningBn: "চোখ",
        notesEn: "The open eye scanning the landscape.",
        notesBn: "দৃষ্টিপাতকারী চোখ।",
      },
    ],
    derivatives: [
      { char: "看见", pinyin: "kànjiàn", meaningEn: "To see, catch sight of", meaningBn: "চোখে পড়া / দেখতে পাওয়া", roleInWord: "看 (look) + 见 (perceive)" },
      { char: "看法", pinyin: "kànfǎ", meaningEn: "Viewpoint, perspective", meaningBn: "দৃষ্টিভঙ্গি", roleInWord: "看 (look) + 法 (method)" },
    ],
  },
  学: {
    char: "学",
    pinyin: "xué",
    meaningEn: "To learn, study, school",
    meaningBn: "শেখা, পড়াশোনা করা",
    type: "compound-ideograph",
    typeLabelEn: "Compound Ideograph (会意字)",
    typeLabelBn: "যৌথ অর্থবোধক বর্ণ (会意字)",
    oracleBoneDescEn: "Two hands manipulating counting divining rods (爻) under a roof, above an eager child (子).",
    oracleBoneDescBn: "ঘরের চালার নিচে একজন শিক্ষক কাঠি বা হিসাবের সংকেত (爻) দিয়ে শিশুকে (子) পাঠদান করছেন।",
    etymologyStoryEn: "Hands guiding a young mind through numbers and wisdom inside a structured room encapsulates the essence of education and academic study.",
    etymologyStoryBn: "ঘরের মধ্যে শিক্ষকের হাতের তত্ত্বাবধানে শিশুর নতুন জ্ঞান ও শৃঙ্খলা আয়ত্ত করাই হলো 'শেখা' (学)।",
    bengaliMnemonic: "ঘরের চালার নিচে শিক্ষকের সংকেত দেখে শিশুর (子) 'শেখা' (学)।",
    components: [
      {
        char: "⺌ / 𦥯",
        pinyin: "xué",
        role: "semantic",
        meaningEn: "Knowledge symbols & hands",
        meaningBn: "জ্ঞানের কাঠি ও দিকনির্দেশক হাত",
        notesEn: "Ancient counting tallies being manipulated.",
        notesBn: "জ্ঞান আহরণের হিসাব বা পাঠ।",
      },
      {
        char: "冖",
        pinyin: "mì",
        role: "semantic",
        meaningEn: "Roof / Classroom space",
        meaningBn: "শ্রেণিকক্ষের ছাদ",
        notesEn: "A dedicated academy or home room.",
        notesBn: "পাঠশালার পরিবেশ।",
      },
      {
        char: "子",
        pinyin: "zǐ",
        role: "semantic",
        meaningEn: "Child / Pupil / Disciple",
        meaningBn: "শিশু / শিক্ষার্থী",
        notesEn: "The young learner receiving guidance.",
        notesBn: "শিক্ষা গ্রহণকারী নতুন প্রজন্ম।",
      },
    ],
    derivatives: [
      { char: "学生", pinyin: "xuésheng", meaningEn: "Student, pupil", meaningBn: "শিক্ষার্থী / ছাত্র", roleInWord: "学 (study) + 生 (born/grow)" },
      { char: "学校", pinyin: "xuéxiào", meaningEn: "School, academy", meaningBn: "বিদ্যালয়", roleInWord: "学 (study) + 校 (campus)" },
      { char: "学习", pinyin: "xuéxí", meaningEn: "To study and practice", meaningBn: "অনুশীলন ও পড়া", roleInWord: "学 (learn) + 习 (repeat/habit)" },
    ],
  },
};
