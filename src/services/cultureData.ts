export interface RealLifeTopic {
  id: string;
  category: "Digital Life" | "Urban Transport" | "Dining & Foodie" | "Social Etiquette" | "Shopping & Delivery";
  title: string;
  chineseTitle: string;
  summary: string;
  bengaliSummary: string;
  dialogue: {
    speaker: string;
    hanzi: string;
    pinyin: string;
    english: string;
    bengali?: string;
  }[];
  survivalPhrases: {
    hanzi: string;
    pinyin: string;
    english: string;
    context: string;
  }[];
  culturalTip: string;
}

export interface CultureArticle {
  id: string;
  category: "Festivals" | "Tea & Cuisine" | "Etiquette & Philosophy" | "Chengyu Idioms";
  title: string;
  chineseTitle: string;
  badge: string;
  readingTime: string;
  coverEmoji: string;
  summary: string;
  bengaliSummary: string;
  contentParagraphs: string[];
  keyTerms: { hanzi: string; pinyin: string; english: string }[];
}

export const REAL_LIFE_TOPICS: RealLifeTopic[] = [
  {
    id: "rl-wechat",
    category: "Digital Life",
    title: "WeChat Essentials & Digital Life (微信与扫码)",
    chineseTitle: "微信聊天与扫码生活",
    summary: "Master essential WeChat expressions, QR code scanning, and exchanging contact info.",
    bengaliSummary: "উইচ্যাট ব্যবহার, কিউআর কোড স্ক্যান এবং বন্ধুদের সাথে যোগাযোগ বিনিময়ের প্রয়োজনীয় চীনা শব্দমালা।",
    dialogue: [
      { speaker: "Xiao Ming", hanzi: "你好！我能加一下你的微信吗？", pinyin: "Nǐ hǎo! Wǒ néng jiā yíxià nǐ de wēixìn ma?", english: "Hello! Can I add your WeChat?", bengali: "হ্যালো! আমি কি আপনার উইচ্যাট অ্যাড করতে পারি?" },
      { speaker: "Me", hanzi: "当然可以，我扫你还是你扫我？", pinyin: "Dāngrán kěyǐ, wǒ sǎo nǐ háishi nǐ sǎo wǒ?", english: "Of course! Should I scan you or do you want to scan me?", bengali: "অবশ্যই! আমি স্ক্যান করব নাকি আপনি আমাকে স্ক্যান করবেন?" },
      { speaker: "Xiao Ming", hanzi: "我扫你吧，我发你好友申请了。", pinyin: "Wǒ sǎo nǐ ba, wǒ fā nǐ hǎoyǒu shēnqǐng le.", english: "I'll scan you. I just sent the friend request.", bengali: "আমি স্ক্যান করছি, ফ্রেন্ড রিকোয়েস্ট পাঠিয়ে দিয়েছি।" },
    ],
    survivalPhrases: [
      { hanzi: "我扫你 (wǒ sǎo nǐ)", pinyin: "wǒ sǎo nǐ", english: "I will scan your QR code", context: "Used at counters or when adding friends" },
      { hanzi: "发个红包 (fā gè hóngbāo)", pinyin: "fā gè hóngbāo", english: "Send a digital red packet", context: "Holidays or casual gifting in group chats" },
      { hanzi: "朋友圈 (péngyǒuqān)", pinyin: "péngyǒuquān", english: "Moments (WeChat social feed)", context: "Viewing friends' posts" },
      { hanzi: "收到了 (shōudào le)", pinyin: "shōudào le", english: "Received / Got it!", context: "Confirming received file or message" },
    ],
    culturalTip: "In modern China, physical cash is rarely used. '我扫你' (I scan you) and '你扫我' (You scan me) are spoken dozens of times daily in grocery stores, cafes, and street markets.",
  },
  {
    id: "rl-didi",
    category: "Urban Transport",
    title: "Taking a Taxi & Ride-Hailing with DiDi (打车与滴滴)",
    chineseTitle: "出行打车与滴滴导航",
    summary: "Directing drivers, specifying landmarks, and locating pickup spots effortlessly.",
    bengaliSummary: "ট্যাক্সি ডাকা, ড্রাইভারের সাথে কথা বলা এবং নির্দিষ্ট জায়গায় নামার জন্য দরকারি চীনা ভাষা।",
    dialogue: [
      { speaker: "Driver", hanzi: "您好，尾号是4321的乘客吗？", pinyin: "Nín hǎo, wěihào shì sì-sān-èr-yī de chéngkè ma?", english: "Hello, passenger with phone ending in 4321?", bengali: "হ্যালো, আপনার ফোনের শেষ চার ডিজিট কি ৪৩২১?" },
      { speaker: "Passenger", hanzi: "对，是我。师傅，去三里屯大概要多久？", pinyin: "Duì, shì wǒ. Shīfu, qù Sānlǐtún dàgài yào duōjiǔ?", english: "Yes, that's me. Master, how long approximately to Sanlitun?", bengali: "হ্যাঁ, আমি। সানলিতুন যেতে আনুমানিক কতক্ষণ লাগবে?" },
      { speaker: "Driver", hanzi: "前面有点堵车，大概二十分钟吧。", pinyin: "Qiánmiàn yǒudiǎnr dǔchē, dàgài èrshí fēnzhōng ba.", english: "Traffic is a bit congested ahead, about 20 minutes.", bengali: "সামনে কিছুটা জ্যাম আছে, প্রায় ২০ মিনিট লাগবে।" },
    ],
    survivalPhrases: [
      { hanzi: "师傅，在路口停一下 (shīfu, zài lùkǒu tíng yíxià)", pinyin: "shīfu, zài lùkǒu tíng yíxià", english: "Driver, please pull over at the intersection", context: "When reaching destination" },
      { hanzi: "师傅 (shīfu)", pinyin: "shīfu", english: "Master / Driver (polite title)", context: "Always address drivers and service craftsmen as 师傅" },
      { hanzi: "靠边停车 (kàobiān tíngchē)", pinyin: "kàobiān tíngchē", english: "Pull over to the curb", context: "Safe drop-off request" },
    ],
    culturalTip: "Addressing cab drivers as '师傅' (shīfu) shows respectful etiquette. When getting in, drivers always ask for the last four digits of your phone number ('尾号').",
  },
];

export const CULTURE_ARTICLES: CultureArticle[] = [
  {
    id: "cul-tea",
    category: "Tea & Cuisine",
    title: "The Art of Chinese Tea: Cha Dao & Etiquette",
    chineseTitle: "中国茶道与饮茶礼仪",
    badge: "Heritage",
    readingTime: "4 min read",
    coverEmoji: "🍵",
    summary: "Explore the six classical types of Chinese tea, gongfu brewing, and the silent two-finger tapping thank-you gesture.",
    bengaliSummary: "চীনা চা সংস্কৃতির ৬টি ধারা, গোংফু চা পরিবেশন এবং টেবিল ট্যাপ করে নিঃশব্দে ধন্যবাদ জানানোর ঐতিহ্য।",
    contentParagraphs: [
      "Tea (茶, chá) is deeply woven into Chinese civilization for over 4,000 years, celebrated in the saying '柴米油盐酱醋茶' (Firewood, rice, oil, salt, sauce, vinegar, and tea - the seven daily necessities).",
      "Traditional teas are classified into six major categories based on fermentation: Green Tea (绿茶, e.g. Longjing), Black Tea (红茶), Oolong Tea (乌龙茶, e.g. Tieguanyin), White Tea (白茶), Yellow Tea (黄茶), and Dark/Pu'er Tea (黑茶).",
      "When someone pours tea for you during a meal, gently tap the table with your index and middle finger knuckles bent. This silent gesture ('叩手礼' kòushǒulǐ) expresses gratitude without interrupting conversation.",
    ],
    keyTerms: [
      { hanzi: "品茶", pinyin: "pǐnchá", english: "savor tea" },
      { hanzi: "茶艺", pinyin: "cháyì", english: "tea art" },
      { hanzi: "功夫茶", pinyin: "gōngfuchá", english: "Gongfu tea ceremony" },
    ],
  },
  {
    id: "cul-spring-festival",
    category: "Festivals",
    title: "Spring Festival & Lunar New Year (春节与过年)",
    chineseTitle: "春节传统与文化习俗",
    badge: "Celebration",
    readingTime: "5 min read",
    coverEmoji: "🧧",
    summary: "Discover the significance of the Reunion Dinner (年夜饭), red envelopes (红包), dragon dances, and couplets (春联).",
    bengaliSummary: "চীনা নববর্ষের পারিবারিক পুনর্মিলন নৈশভোজ, লাল খাম ও বসন্ত উৎসবের আনন্দময় রীতিনীতি।",
    contentParagraphs: [
      "Spring Festival (春节, Chūnjié) is the paramount holiday in China, marking the arrival of spring and familial renewal according to the lunar calendar.",
      "Families travel across nations during 'Chunyun' (春运, the world's largest annual human migration) to gather on New Year's Eve for the Reunion Dinner (年夜饭), eating dumplings (饺子) in the north or sticky rice cake (年糕) in the south for prosperity.",
      "Red envelopes (红包, hóngbāo) containing crisp new banknotes are gifted to children and elders to ward off bad luck and bestow blessings of health and fortune.",
    ],
    keyTerms: [
      { hanzi: "过年", pinyin: "guònián", english: "celebrate New Year" },
      { hanzi: "年夜饭", pinyin: "niányèfàn", english: "New Year's Eve reunion dinner" },
      { hanzi: "恭喜发财", pinyin: "gōngxǐ fācái", english: "May you be prosperous!" },
    ],
  },
];
