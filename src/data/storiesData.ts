export interface StoryToken {
  hanzi: string;
  pinyin: string;
  en: string;
  bn: string;
}

export interface StoryParagraph {
  textZh: string;
  textPinyin: string;
  textEn: string;
  textBn: string;
  tokens: StoryToken[];
}

export interface StoryQuizQuestion {
  questionZh: string;
  questionEn: string;
  questionBn: string;
  options: { textZh: string; textEn: string; textBn: string }[];
  correctIndex: number;
  explanationEn: string;
  explanationBn: string;
}

export interface GradedStory {
  id: string;
  hskLevel: "1" | "2" | "3" | "4";
  titleZh: string;
  titlePinyin: string;
  titleEn: string;
  titleBn: string;
  summaryEn: string;
  summaryBn: string;
  estimatedMinutes: number;
  wordCount: number;
  audioDurationSec: number;
  paragraphs: StoryParagraph[];
  quiz: StoryQuizQuestion[];
}

export const GRADED_STORIES: GradedStory[] = [
  {
    id: "story_hsk1_cat",
    hskLevel: "1",
    titleZh: "小猫的新家",
    titlePinyin: "Xiǎomāo de Xīn Jiā",
    titleEn: "The Little Cat's New Home",
    titleBn: "ছোট বিড়ালছানার নতুন বাড়ি",
    summaryEn: "A friendly story about a white kitten finding a cozy family home in Beijing.",
    summaryBn: "বেইজিংয়ের একটি স্নেহময় পরিবারে সাদা বিড়ালছানার আশ্রয় পাওয়ার মিষ্টি গল্প।",
    estimatedMinutes: 2,
    wordCount: 85,
    audioDurationSec: 45,
    paragraphs: [
      {
        textZh: "你好！我叫小白，我是一只小猫。",
        textPinyin: "Nǐ hǎo! Wǒ jiào Xiǎobái, wǒ shì yī zhī xiǎomāo.",
        textEn: "Hello! My name is Xiaobai, and I am a little cat.",
        textBn: "হ্যালো! আমার নাম শিয়াওবাই, আমি একটি ছোট বিড়াল।",
        tokens: [
          { hanzi: "你好", pinyin: "nǐ hǎo", en: "Hello", bn: "হ্যালো" },
          { hanzi: "我", pinyin: "wǒ", en: "I / me", bn: "আমি" },
          { hanzi: "叫", pinyin: "jiào", en: "to be called", bn: "নাম হওয়া" },
          { hanzi: "小白", pinyin: "Xiǎobái", en: "Xiaobai (Little White)", bn: "শিয়াওবাই" },
          { hanzi: "是", pinyin: "shì", en: "is / am", bn: "হয়" },
          { hanzi: "一只", pinyin: "yī zhī", en: "one (measure word for animals)", bn: "একটি" },
          { hanzi: "小猫", pinyin: "xiǎomāo", en: "kitten / little cat", bn: "বিড়ালছানা" },
        ],
      },
      {
        textZh: "我家在北京。家里有三个人：爸爸、妈妈和一个小女孩。",
        textPinyin: "Wǒ jiā zài Běijīng. Jiā lǐ yǒu sān gè rén: bàba, māma hé yī gè xiǎo nǚhái.",
        textEn: "My home is in Beijing. There are three people in my family: dad, mom, and a little girl.",
        textBn: "আমার বাড়ি বেইজিংয়ে। বাড়িতে তিনজন মানুষ আছে: বাবা, মা এবং একটি ছোট্ট মেয়ে।",
        tokens: [
          { hanzi: "我家", pinyin: "wǒ jiā", en: "my home", bn: "আমার বাড়ি" },
          { hanzi: "在", pinyin: "zài", en: "in / at", bn: "এ / তে" },
          { hanzi: "北京", pinyin: "Běijīng", en: "Beijing", bn: "বেইজিং" },
          { hanzi: "有", pinyin: "yǒu", en: "has / there is", bn: "আছে" },
          { hanzi: "三个人", pinyin: "sān gè rén", en: "three people", bn: "তিনজন মানুষ" },
          { hanzi: "爸爸", pinyin: "bàba", en: "father", bn: "বাবা" },
          { hanzi: "妈妈", pinyin: "māma", en: "mother", bn: "মা" },
          { hanzi: "和", pinyin: "hé", en: "and", bn: "এবং" },
          { hanzi: "小女孩", pinyin: "xiǎo nǚhái", en: "little girl", bn: "ছোট মেয়ে" },
        ],
      },
      {
        textZh: "小女孩很喜欢我。她每天给我喝水，给我吃好吃的鱼。我很开心！",
        textPinyin: "Xiǎo nǚhái hěn xǐhuan wǒ. Tā měitiān gěi wǒ hē shuǐ, gěi wǒ chī hǎochī de yú. Wǒ hěn kāixīn!",
        textEn: "The little girl likes me very much. Every day she gives me water to drink and delicious fish to eat. I am very happy!",
        textBn: "ছোট মেয়েটি আমাকে খুব ভালোবাসে। সে প্রতিদিন আমাকে পানি পান করতে দেয় এবং সুস্বাদু মাছ খেতে দেয়। আমি খুব খুশি!",
        tokens: [
          { hanzi: "很喜欢", pinyin: "hěn xǐhuan", en: "likes very much", bn: "খুব পছন্দ করে" },
          { hanzi: "每天", pinyin: "měitiān", en: "every day", bn: "প্রতিদিন" },
          { hanzi: "喝水", pinyin: "hē shuǐ", en: "drink water", bn: "পানি পান করা" },
          { hanzi: "吃", pinyin: "chī", en: "to eat", bn: "খাওয়া" },
          { hanzi: "好吃", pinyin: "hǎochī", en: "delicious", bn: "সুস্বাদু" },
          { hanzi: "鱼", pinyin: "yú", en: "fish", bn: "মাছ" },
          { hanzi: "开心", pinyin: "kāixīn", en: "happy / joyful", bn: "আনন্দিত / খুশি" },
        ],
      },
    ],
    quiz: [
      {
        questionZh: "小白是一只什么动物？",
        questionEn: "What animal is Xiaobai?",
        questionBn: "শিয়াওবাই কোন প্রাণী?",
        options: [
          { textZh: "小狗", textEn: "A little dog", textBn: "একটি কুকুর" },
          { textZh: "小猫", textEn: "A little cat", textBn: "একটি বিড়াল" },
          { textZh: "小鸟", textEn: "A little bird", textBn: "একটি পাখি" },
        ],
        correctIndex: 1,
        explanationEn: "Xiaobai states in the first sentence: '我是一只小猫' (I am a little cat).",
        explanationBn: "প্রথম লাইনেই বলা হয়েছে: '我是一只小猫' (আমি একটি ছোট বিড়াল)।",
      },
      {
        questionZh: "小白的家在哪里？",
        questionEn: "Where is Xiaobai's home?",
        questionBn: "শিয়াওবাইয়ের বাড়ি কোথায়?",
        options: [
          { textZh: "在上海", textEn: "In Shanghai", textBn: "সাংহাইয়ে" },
          { textZh: "在北京", textEn: "In Beijing", textBn: "বেইজিংয়ে" },
          { textZh: "在学校", textEn: "At school", textBn: "স্কুলে" },
        ],
        correctIndex: 1,
        explanationEn: "The text says: '我家在北京' (My home is in Beijing).",
        explanationBn: "গল্পে স্পষ্ট উল্লেখ আছে: '我家在北京' (আমার বাড়ি বেইজিংয়ে)।",
      },
    ],
  },
  {
    id: "story_hsk2_tea",
    hskLevel: "2",
    titleZh: "在老舍茶馆喝茶",
    titlePinyin: "Zài Lǎoshě Cháguǎn Hē Chá",
    titleEn: "Drinking Tea at Laoshe Teahouse",
    titleBn: "লাওশে চা হাউসে চা পান",
    summaryEn: "Experiencing traditional Chinese jasmine tea and teahouse culture with friends.",
    summaryBn: "বন্ধুদের সাথে ঐতিহ্যবাহী চাইনিজ জুঁই ফুলের চা পানের মনোরম অভিজ্ঞতা।",
    estimatedMinutes: 3,
    wordCount: 130,
    audioDurationSec: 65,
    paragraphs: [
      {
        textZh: "星期六下午，天气非常晴朗。我和两个中国朋友去茶馆喝茶。",
        textPinyin: "Xīngqīliù xiàwǔ, tiānqì fēicháng qínglǎng. Wǒ hé liǎng gè Zhōngguó péngyou qù cháguǎn hē chá.",
        textEn: "On Saturday afternoon, the weather was exceptionally clear and sunny. I went to a teahouse with two Chinese friends to drink tea.",
        textBn: "শনিবার বিকেলে আবহাওয়া অত্যন্ত পরিষ্কার ও রৌদ্রোজ্জ্বল ছিল। আমি আমার দুজন চীনা বন্ধুর সাথে চা হাউসে চা পান করতে গেলাম।",
        tokens: [
          { hanzi: "星期六", pinyin: "xīngqīliù", en: "Saturday", bn: "শনিবার" },
          { hanzi: "下午", pinyin: "xiàwǔ", en: "afternoon", bn: "বিকাল" },
          { hanzi: "天气", pinyin: "tiānqì", en: "weather", bn: "আবহাওয়া" },
          { hanzi: "非常", pinyin: "fēicháng", en: "extremely / very", bn: "অত্যন্ত" },
          { hanzi: "晴朗", pinyin: "qínglǎng", en: "sunny / clear", bn: "রৌদ্রোজ্জ্বল" },
          { hanzi: "茶馆", pinyin: "cháguǎn", en: "teahouse", bn: "চা ঘর" },
        ],
      },
      {
        textZh: "服务员走过来，热情地问：“请问几位想喝什么茶？”我们点了最有名的茉莉花茶。",
        textPinyin: "Fúwùyuán zǒu guòlái, rèqíng de wèn: “Qǐngwèn jǐ wèi xiǎng hē shénme chá?” Wǒmen diǎn le zuì yǒumíng de mòlìhuā chá.",
        textEn: "The waiter walked over and asked warmly: 'May I ask what kind of tea would you like?' We ordered the most famous jasmine tea.",
        textBn: "ওয়েটার এগিয়ে এসে আন্তরিকভাবে জিজ্ঞেস করলেন: 'আপনারা কোন চা পান করতে চান?' আমরা সেখানকার সবচেয়ে বিখ্যাত জুঁই ফুলের চা অর্ডার করলাম।",
        tokens: [
          { hanzi: "服务员", pinyin: "fúwùyuán", en: "waiter / server", bn: "ওয়েটার / পরিবেশক" },
          { hanzi: "热情", pinyin: "rèqíng", en: "warm / enthusiastic", bn: "আন্তরিক" },
          { hanzi: "点", pinyin: "diǎn", en: "to order (food/drink)", bn: "অর্ডার করা" },
          { hanzi: "有名", pinyin: "yǒumíng", en: "famous / renowned", bn: "বিখ্যাত" },
          { hanzi: "茉莉花茶", pinyin: "mòlìhuā chá", en: "jasmine tea", bn: "জুঁই ফুলের চা" },
        ],
      },
      {
        textZh: "茶很香，味道好极了！在这里，不仅可以品茶，还能一边听中国传统音乐，一边聊天。",
        textPinyin: "Chá hěn xiāng, wèidào hǎo jí le! Zài zhèlǐ, bùjǐn kěyǐ pǐn chá, hái néng yībiān tīng Zhōngguó chuántǒng yīnyuè, yībiān liáotiān.",
        textEn: "The tea was fragrant and tasted amazing! Here, not only can you savor tea, but you can also listen to traditional Chinese music while chatting.",
        textBn: "চাটি দারুণ সুবাসিত এবং অসাধারণ স্বাদের ছিল! এখানে শুধু চা পানই নয়, বরং ঐতিহ্যবাহী চীনা সঙ্গীত শুনতে শুনতে আড্ডা দেওয়া যায়।",
        tokens: [
          { hanzi: "香", pinyin: "xiāng", en: "fragrant / sweet-smelling", bn: "সুবাসিত" },
          { hanzi: "味道", pinyin: "wèidào", en: "taste / flavor", bn: "স্বাদ" },
          { hanzi: "好极了", pinyin: "hǎo jí le", en: "fantastic / super good", bn: "অসাধারণ" },
          { hanzi: "不仅...还", pinyin: "bùjǐn...hái", en: "not only...but also", bn: "শুধু না...আরও" },
          { hanzi: "传统音乐", pinyin: "chuántǒng yīnyuè", en: "traditional music", bn: "ঐতিহ্যবাহী সঙ্গীত" },
          { hanzi: "聊天", pinyin: "liáotiān", en: "to chat", bn: "আড্ডা দেওয়া" },
        ],
      },
    ],
    quiz: [
      {
        questionZh: "他们点了什么茶？",
        questionEn: "What tea did they order?",
        questionBn: "তারা কোন চা অর্ডার করেছিল?",
        options: [
          { textZh: "绿茶", textEn: "Green tea", textBn: "গ্রিন টি" },
          { textZh: "茉莉花茶", textEn: "Jasmine tea", textBn: "জুঁই ফুলের চা" },
          { textZh: "红茶", textEn: "Black tea", textBn: "ব্ল্যাক টি" },
        ],
        correctIndex: 1,
        explanationEn: "They ordered '最有名的茉莉花茶' (the most famous jasmine tea).",
        explanationBn: "গল্পে তারা '茉莉花茶' (জুঁই ফুলের চা) পছন্দ করেছিল।",
      },
    ],
  },
  {
    id: "story_hsk3_idiom",
    hskLevel: "3",
    titleZh: "中国成语：塞翁失马",
    titlePinyin: "Zhōngguó Chéngyǔ: Sài Wēng Shī Mǎ",
    titleEn: "Chinese Idiom: The Old Man Lost His Horse",
    titleBn: "চীনা প্রবাদ: বৃদ্ধের ঘোড়া হারানোর গল্প",
    summaryEn: "A profound philosophical fable teaching that misfortune can bring unexpected fortune.",
    summaryBn: "বিপদ যে কখনো কখনো সুদিনের বার্তা নিয়ে আসে, তা শেখানোর এক অমর চীনা দার্শনিক রূপকথা।",
    estimatedMinutes: 4,
    wordCount: 190,
    audioDurationSec: 90,
    paragraphs: [
      {
        textZh: "古时候，在边境住着一位老人。有一天，老人家里的一匹好马突然跑到了别的国家。",
        textPinyin: "Gǔ shíhòu, zài biānjìng zhùzhe yī wèi lǎorén. Yǒu yī tiān, lǎorén jiā lǐ de yī pǐ hǎo mǎ tūrán pǎo dào le bié de guójiā.",
        textEn: "In ancient times, an old man lived on the border. One day, a fine horse of his suddenly ran away to another country.",
        textBn: "প্রাচীনকালে সীমান্ত এলাকায় এক বৃদ্ধ লোক বাস করতেন। একদিন তার একটি সুন্দর ঘোড়া হঠাৎ করে অন্য দেশে পালিয়ে যায়।",
        tokens: [
          { hanzi: "古时候", pinyin: "gǔ shíhòu", en: "ancient times", bn: "প্রাচীনকাল" },
          { hanzi: "边境", pinyin: "biānjìng", en: "border", bn: "সীমান্ত" },
          { hanzi: "一匹马", pinyin: "yī pǐ mǎ", en: "a horse", bn: "একটি ঘোড়া" },
          { hanzi: "突然", pinyin: "tūrán", en: "suddenly", bn: "হঠাৎ" },
        ],
      },
      {
        textZh: "邻居们都来安慰他。可是老人平静地笑着说：“这怎么知道不会带来好运呢？”",
        textPinyin: "Línjūmen dōu lái ānwèi tā. Kěshì lǎorén píngjìng de xiàozhe shuō: “Zhè zěnme zhīdào bù huì dàilái hǎoyùn ne?”",
        textEn: "The neighbors came to comfort him. But the old man smiled calmly and said: 'How do you know this won't bring good fortune?'",
        textBn: "প্রতিবেশীরা তাকে সান্ত্বনা দিতে এল। কিন্তু বৃদ্ধ শান্তভাবে হেসে বললেন: 'কে জানে, হয়তো এটি ভালো ভাগ্য বয়ে আনবে!'",
        tokens: [
          { hanzi: "邻居", pinyin: "línjū", en: "neighbor", bn: "প্রতিবেশী" },
          { hanzi: "安慰", pinyin: "ānwèi", en: "to comfort / console", bn: "সান্ত্বনা দেওয়া" },
          { hanzi: "平静", pinyin: "píngjìng", en: "calm / peaceful", bn: "শান্ত" },
          { hanzi: "好运", pinyin: "hǎoyùn", en: "good luck / fortune", bn: "সৌভাগ্য" },
        ],
      },
      {
        textZh: "过了几个月，那匹马不仅跑回来了，还带回来一匹更高大健壮的胡马！大家这才明白：塞翁失马，焉知非福。",
        textPinyin: "Guò le jǐ gè yuè, nà pǐ mǎ bùjǐn pǎo huílái le, hái dài huílái yī pǐ gèng gāodà jiànzhuàng de hú mǎ! Dàjiā zhè cái míngbai: Sài wēng shī mǎ, yān zhī fēi fú.",
        textEn: "A few months later, not only did that horse return, but it also brought back an even taller and stronger northern steed! Only then did everyone understand: A loss may turn out to be a blessing in disguise.",
        textBn: "কয়েক মাস পর, ঘোড়াটি শুধু ফিরে এলই না, সাথে আরেকটি আরও বলশালী ও চমৎকার ঘোড়া নিয়ে এল! তখন সবাই বুঝতে পারল: যা আপাতদৃষ্টিতে ক্ষতি, তা ভবিষ্যতে আশীর্বাদও হতে পারে।",
        tokens: [
          { hanzi: "几个月", pinyin: "jǐ gè yuè", en: "a few months", bn: "কয়েক মাস" },
          { hanzi: "健壮", pinyin: "jiànzhuàng", en: "healthy and robust", bn: "সুঠাম / বলবান" },
          { hanzi: "明白", pinyin: "míngbai", en: "to understand / realize", bn: "বুঝতে পারা" },
          { hanzi: "塞翁失马，焉知非福", pinyin: "sài wēng shī mǎ, yān zhī fēi fú", en: "Blessing in disguise", bn: "বিপদে লুকিয়ে থাকা সৌভাগ্য" },
        ],
      },
    ],
    quiz: [
      {
        questionZh: "这个成语告诉我们什么道理？",
        questionEn: "What philosophical moral does this idiom teach?",
        questionBn: "এই প্রবাদটি আমাদের কী শিক্ষা দেয়?",
        options: [
          { textZh: "买马一定要买好马", textEn: "Always buy good horses", textBn: "সবসময় ভালো ঘোড়া কেনা উচিত" },
          { textZh: "坏事在某些时候也可能变成好事", textEn: "A misfortune may turn into a good thing", textBn: "খারাপ সময়ও ভবিষ্যতে ভালো ফল বয়ে আনতে পারে" },
          { textZh: "不要相信邻居的话", textEn: "Don't believe neighbors", textBn: "প্রতিবেশীদের বিশ্বাস করা উচিত নয়" },
        ],
        correctIndex: 1,
        explanationEn: "The proverb '塞翁失马，焉知非福' means unexpected troubles can turn into hidden blessings.",
        explanationBn: "এই প্রবাদটি বোঝায় যে আপাতদৃষ্টির বিপদ কখনো কখনো নতুন আশীর্বাদের পথ খুলে দেয়।",
      },
    ],
  },
];
