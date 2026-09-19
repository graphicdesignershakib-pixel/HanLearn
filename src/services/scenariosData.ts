export interface ConversationScenario {
  id: string;
  title: string;
  bengaliTitle: string;
  chineseTitle: string;
  hskLevel: "1-2" | "3-4" | "5-6";
  category: "Dining" | "Travel" | "Shopping" | "Services" | "Social" | "Career";
  role: string;
  aiRole: string;
  description: string;
  bengaliDescription: string;
  systemPrompt: string;
  initialMessage: {
    chinese: string;
    pinyin: string;
    english: string;
    bengali: string;
  };
  suggestedPrompts: {
    chinese: string;
    pinyin: string;
    english: string;
    bengali: string;
  }[];
  keyVocabulary: {
    hanzi: string;
    pinyin: string;
    english: string;
    bengali: string;
  }[];
}

export const CONVERSATION_SCENARIOS: ConversationScenario[] = [
  {
    id: "sc-restaurant",
    title: "Ordering at a Local Restaurant",
    bengaliTitle: "চীনা রেস্তোরাঁয় খাবার অর্ডার",
    chineseTitle: "餐馆点餐",
    hskLevel: "1-2",
    category: "Dining",
    role: "Customer (顾客)",
    aiRole: "Friendly Waiter (服务员)",
    description: "Order authentic dishes, specify mild spice levels, request drinks, and settle the bill via mobile pay.",
    bengaliDescription: "রেস্তোরাঁয় খাবার অর্ডার করুন, ঝাল কম দেওয়ার অনুরোধ জানান এবং বিল পরিশোধ করুন।",
    systemPrompt: "You are a warm, helpful Chinese restaurant waiter in Chengdu or Beijing. Speak in clear, natural Chinese suitable for HSK 1-2 learners. Welcome the customer, offer the menu, answer questions about dishes (宫保鸡丁, 米饭, 饺子), ask if they want it spicy (辣不辣), and give the bill (买单). Always include pinyin and an English translation hint.",
    initialMessage: {
      chinese: "您好！欢迎光临！请问您几位？想吃点儿什么？",
      pinyin: "Nín hǎo! Huānyíng guānglín! Qǐngwèn nín jǐ wèi? Xiǎng chī diǎnr shénme?",
      english: "Hello! Welcome! How many in your party? What would you like to eat?",
      bengali: "হ্যালো! স্বাগতম! আপনারা কতজন? কী খেতে পছন্দ করবেন?",
    },
    suggestedPrompts: [
      {
        chinese: "请问有什么推荐的菜吗？",
        pinyin: "Qǐngwèn yǒu shénme tuījiàn de cài ma?",
        english: "What dishes do you recommend?",
        bengali: "আপনাদের স্পেশাল কোনো খাবারের সুপারিশ আছে কি?",
      },
      {
        chinese: "我不吃辣，请少放辣椒。",
        pinyin: "Wǒ bù chī là, qǐng shǎo fàng làjiāo.",
        english: "I don't eat spicy, please add less chili.",
        bengali: "আমি ঝাল খাই না, দয়া করে মরিচ কম দেবেন।",
      },
      {
        chinese: "服务员，请结账/买单。",
        pinyin: "Fúwùyuán, qǐng jiézhàng / mǎidān.",
        english: "Waiter, the check please.",
        bengali: "ওয়েটার ভাই, বিলটা একটু দেবেন প্লিজ।",
      },
      {
        chinese: "可以给我一杯温水吗？",
        pinyin: "Kěyǐ gěi wǒ yì bēi wēn shuǐ ma?",
        english: "Could you give me a cup of warm water?",
        bengali: "আমাকে এক গ্লাস কুসুম গরম পানি দেওয়া যাবে?",
      },
    ],
    keyVocabulary: [
      { hanzi: "点菜", pinyin: "diǎncài", english: "order dishes", bengali: "খাবার অর্ডার করা" },
      { hanzi: "服务员", pinyin: "fúwùyuán", english: "waiter", bengali: "ওয়েটার / সেবক" },
      { hanzi: "微辣", pinyin: "wēilà", english: "mildly spicy", bengali: "হালকা ঝাল" },
      { hanzi: "买单", pinyin: "mǎidān", english: "pay the bill", bengali: "বিল পরিশোধ করা" },
    ],
  },
  {
    id: "sc-taxi",
    title: "Taking a Taxi & Giving Directions",
    bengaliTitle: "ট্যাক্সি নেওয়া ও গন্তব্যের দিকনির্দেশনা",
    chineseTitle: "打车与问路",
    hskLevel: "1-2",
    category: "Travel",
    role: "Passenger (乘客)",
    aiRole: "Talkative Taxi Driver (师傅)",
    description: "Tell the driver your destination, ask how long it takes, and give turn-by-turn directions.",
    bengaliDescription: "ট্যাক্সি ড্রাইভারকে আপনার গন্তব্য বলুন, কত সময় লাগবে জানুন এবং ট্রাফিকের কথা বলুন।",
    systemPrompt: "You are a friendly Beijing or Shanghai taxi driver (师傅). Speak natural conversational Chinese for HSK 1-2 learners. Ask where they are going, comment politely on traffic, and confirm arrival.",
    initialMessage: {
      chinese: "你好！请问去哪里？上车请系好安全带。",
      pinyin: "Nǐ hǎo! Qǐngwèn qù nǎlǐ? Shàng chē qǐng jì hǎo ānquándài.",
      english: "Hello! Where are you headed? Please fasten your seatbelt.",
      bengali: "হ্যালো! কোথায় যাবেন? গাড়িতে উঠে সিটবেল্টটা বেঁধে নিন।",
    },
    suggestedPrompts: [
      {
        chinese: "师傅，去北京大学东门，谢谢。",
        pinyin: "Shīfu, qù Běijīng Dàxué dōngmén, xièxie.",
        english: "Driver, to Peking University East Gate, thanks.",
        bengali: "উস্তাদ, পিকিং ইউনিভার্সিটির পূর্ব গেটে যাব, ধন্যবাদ।",
      },
      {
        chinese: "大概需要多长时间能到？",
        pinyin: "Dàgài xūyào duō cháng shíjiān néng dào?",
        english: "Roughly how long will it take to arrive?",
        bengali: "পৌঁছাতে আনুমানিক কতক্ষণ সময় লাগবে?",
      },
      {
        chinese: "前面路口请向右拐。",
        pinyin: "Qiánmiàn lùkǒu qǐng xiàng yòu guǎi.",
        english: "Please turn right at the intersection ahead.",
        bengali: "সামনের মোড় থেকে ডানে ঘুরবেন প্লিজ।",
      },
    ],
    keyVocabulary: [
      { hanzi: "师傅", pinyin: "shīfu", english: "master / driver", bengali: "ড্রাইভার সম্বোধন" },
      { hanzi: "堵车", pinyin: "dǔchē", english: "traffic jam", bengali: "যানজট" },
      { hanzi: "路口", pinyin: "lùkǒu", english: "intersection", bengali: "রাস্তার মোড়" },
      { hanzi: "右拐", pinyin: "yòuguǎi", english: "turn right", bengali: "ডানে মোড় নেওয়া" },
    ],
  },
  {
    id: "sc-shopping",
    title: "Market Shopping & Polite Bargaining",
    bengaliTitle: "মার্কেটে কেনাকাটা ও দামাদামি",
    chineseTitle: "商场购物与还价",
    hskLevel: "1-2",
    category: "Shopping",
    role: "Shopper (买家)",
    aiRole: "Enthusiastic Shopkeeper (店主)",
    description: "Ask about sizes, colors, negotiate friendly discounts, and pay with WeChat Pay.",
    bengaliDescription: "দোকানে পোশাক বা স্মারক কিনুন, সাইজ ও রঙ জিজ্ঞাসা করুন এবং দাম কমানোর চেষ্টা করুন।",
    systemPrompt: "You are an enthusiastic market vendor in a craft market in Shanghai. Greet the customer warmly, describe items (tea, silk scarves, souvenirs), negotiate gently, and offer mobile payment (微信/支付宝).",
    initialMessage: {
      chinese: "帅哥/美女，来看一看！我们的丝绸围巾和茶叶都是刚进的新货！",
      pinyin: "Shuàigē / Měinǚ, lái kàn yí kàn! Wǒmen de sīchóu wéijīn hé cháyè dōu shì gāng jìn de xīn huò!",
      english: "Come take a look! Our silk scarves and tea leaves just arrived fresh!",
      bengali: "একটু দেখে যান! আমাদের রেশমি স্কার্ফ আর চা পাতা একদম সদ্য আমদানি করা!",
    },
    suggestedPrompts: [
      {
        chinese: "这个多少钱一件？",
        pinyin: "Zhège duōshao qián yí jiàn?",
        english: "How much is this one?",
        bengali: "এটার দাম কত করে?",
      },
      {
        chinese: "有点儿贵，能不能便宜一点儿？",
        pinyin: "Yǒudiǎnr guì, néng bu néng piányi yìdiǎnr?",
        english: "A bit expensive, could you make it a bit cheaper?",
        bengali: "একটু বেশি মনে হচ্ছে, কিছুটা ছাড় দেওয়া যাবে কি?",
      },
      {
        chinese: "可以用微信支付吗？",
        pinyin: "Kěyǐ yòng Wēixìn zhīfù ma?",
        english: "Can I pay with WeChat Pay?",
        bengali: "উইচ্যাট পে দিয়ে বিল দেওয়া যাবে কি?",
      },
    ],
    keyVocabulary: [
      { hanzi: "便宜", pinyin: "piányi", english: "cheap/inexpensive", bengali: "সুলভ / সস্তা" },
      { hanzi: "试穿", pinyin: "shìchuān", english: "try on", bengali: "ট্রায়াল দেওয়া" },
      { hanzi: "打折", pinyin: "dǎzhé", english: "give a discount", bengali: "ডিসকাউন্ট দেওয়া" },
      { hanzi: "微信支付", pinyin: "wēixìn zhīfù", english: "WeChat Pay", bengali: "উইচ্যাট পেমেন্ট" },
    ],
  },
  {
    id: "sc-airport",
    title: "Flight Check-In & Baggage Drop",
    bengaliTitle: "বিমানবন্দরে চেক-ইন ও লাগেজ ড্রপ",
    chineseTitle: "机场值机与行李",
    hskLevel: "3-4",
    category: "Travel",
    role: "Passenger (乘客)",
    aiRole: "Airline Counter Agent (地勤人员)",
    description: "Check in for an international flight, check luggage, and request a window seat.",
    bengaliDescription: "বিমানবন্দরে ফ্লাইটের চেক-ইন করুন, লাগেজ বুকিং দিন এবং উইন্ডো সিটের অনুরোধ করুন।",
    systemPrompt: "You are an airline counter agent at Beijing Capital International Airport (PEK). You are checking in a passenger. Ask for their passport, ticket, luggage to check (托运行李), and seat preference (靠窗/靠走道). Speak clearly with HSK 3-4 vocabulary.",
    initialMessage: {
      chinese: "您好！请出示您的护照和机票。请问您有几件托运行李？",
      pinyin: "Nín hǎo! Qǐng chūshì nín de hùzhào hé jīpiào. Qǐngwèn nín yǒu jǐ jiàn tuōyùn xíngli?",
      english: "Hello! Please present your passport and ticket. How many pieces of checked luggage do you have?",
      bengali: "নমস্কার! আপনার পাসপোর্ট ও টিকিটটি দিন। আপনার সাথে কতগুলো চেক-ইন লাগেজ রয়েছে?",
    },
    suggestedPrompts: [
      {
        chinese: "我有一件行李需要托运。",
        pinyin: "Wǒ yǒu yí jiàn xíngli xūyào tuōyùn.",
        english: "I have one bag to check.",
        bengali: "আমার একটি ব্যাগ কার্গোতে বুকিং দিতে হবে।",
      },
      {
        chinese: "可以给我一个靠窗的座位吗？",
        pinyin: "Kěyǐ gěi wǒ yí gè kàochuāng de zuòwèi ma?",
        english: "Could I please have a window seat?",
        bengali: "আমাকে কি জানালার পাশের কোনো সিট দেওয়া সম্ভব?",
      },
      {
        chinese: "请问登机口在几号？",
        pinyin: "Qǐngwèn dēngjīkǒu zài jǐ hào?",
        english: "Which boarding gate is it?",
        bengali: "বোর্ডিং গেটটি কত নম্বরে অবস্থিত?",
      },
    ],
    keyVocabulary: [
      { hanzi: "护照", pinyin: "hùzhào", english: "passport", bengali: "পাসপোর্ট" },
      { hanzi: "托运", pinyin: "tuōyùn", english: "check in luggage", bengali: "লাগেজ বুকিং" },
      { hanzi: "靠窗", pinyin: "kàochuāng", english: "window seat", bengali: "জানালার পাশের সিট" },
      { hanzi: "登机牌", pinyin: "dēngjīpái", english: "boarding pass", bengali: "বোর্ডিং পাস" },
    ],
  },
  {
    id: "sc-hotel",
    title: "Hotel Check-In & Room Inquiries",
    bengaliTitle: "হোটেল চেক-ইন ও সুযোগ-সুবিধা",
    chineseTitle: "酒店入住与前台",
    hskLevel: "3-4",
    category: "Services",
    role: "Guest (住客)",
    aiRole: "Receptionist (前台客服)",
    description: "Check into your reserved room, ask for the Wi-Fi password, and confirm breakfast hours.",
    bengaliDescription: "বুকিং করা হোটেলে চেক-ইন করুন, ওয়াইফাই পাসওয়ার্ড নিন এবং সকালের নাস্তার সময় জানুন।",
    systemPrompt: "You are a professional hotel receptionist in Guangzhou. Welcome the guest, confirm their reservation, provide room keys, explain breakfast hours, and offer assistance with local touring.",
    initialMessage: {
      chinese: "您好，欢迎入住如家酒店！请问您有预订吗？",
      pinyin: "Nín hǎo, huānyíng rùzhù Rújiā Jiǔdiàn! Qǐngwèn nín yǒu yùdìng ma?",
      english: "Hello, welcome to Home Inn! Do you have a reservation?",
      bengali: "নমস্কার, হোটেলে স্বাগতম! আপনার কি কোনো রুম বুকিং করা আছে?",
    },
    suggestedPrompts: [
      {
        chinese: "我在网上预订了一间大床房。",
        pinyin: "Wǒ zài wǎngshang yùdìng le yì jiān dàchuángfáng.",
        english: "I booked a king-bed room online.",
        bengali: "আমি অনলাইনে একটি বড় বিছানার রুম বুক করেছিলাম।",
      },
      {
        chinese: "请问房间有无线网络吗？密码是多少？",
        pinyin: "Qǐngwèn fángjiān yǒu wúxiàn wǎngluò ma? Mìmǎ shì duōshao?",
        english: "Is there Wi-Fi in the room? What is the password?",
        bengali: "রুমে কি ওয়াইফাই আছে? পাসওয়ার্ডটা কি জানতে পারি?",
      },
      {
        chinese: "请问明天的早餐几点开始？",
        pinyin: "Qǐngwèn míngtiān de zǎocān jǐ diǎn kāishǐ?",
        english: "What time does breakfast start tomorrow?",
        bengali: "কাল সকালের নাস্তা কয়টা থেকে শুরু হবে?",
      },
    ],
    keyVocabulary: [
      { hanzi: "预订", pinyin: "yùdìng", english: "reservation / book", bengali: "অগ্রিম বুকিং" },
      { hanzi: "房卡", pinyin: "fángkǎ", english: "room card key", bengali: "রুমের কার্ড" },
      { hanzi: "无线网络", pinyin: "wúxiàn wǎngluò", english: "Wi-Fi", bengali: "ওয়াইফাই" },
      { hanzi: "退房", pinyin: "tuìfáng", english: "check out", bengali: "চেক আউট করা" },
    ],
  },
  {
    id: "sc-interview",
    title: "Professional Job Interview in China",
    bengaliTitle: "চীনা কোম্পানিতে চাকরির ইন্টারভিউ",
    chineseTitle: "职场求职面试",
    hskLevel: "5-6",
    category: "Career",
    role: "Candidate (求职者)",
    aiRole: "HR Director (人力资源总监)",
    description: "Discuss career background, project management, and cross-cultural adaptability.",
    bengaliDescription: "পেশাদার চাকরির ইন্টারভিউতে নিজের অভিজ্ঞতা ও দক্ষতা তুলে ধরুন।",
    systemPrompt: "You are the HR Director of an international tech firm in Shenzhen. Conduct a professional, respectful HSK 5-6 level interview. Ask about qualifications, problem solving, work ethics, and salary expectations.",
    initialMessage: {
      chinese: "您好，请坐。我看过您的简历，请先用中文做一个简短的自我介绍吧。",
      pinyin: "Nín hǎo, qǐng zuò. Wǒ kànguo nín de jiǎnlì, qǐng xiān yòng zhōngwén zuò yí gè jiǎnduǎn de zìwǒ jièshào ba.",
      english: "Hello, please have a seat. I've reviewed your resume. Please start with a brief self-introduction in Chinese.",
      bengali: "নমস্কার, বসুন। আমি আপনার সিভি দেখেছি। সংক্ষেপে চাইনিজে নিজের একটি আত্মপরিচয় দিন।",
    },
    suggestedPrompts: [
      {
        chinese: "我从事国际贸易与软件开发已有三年经验。",
        pinyin: "Wǒ cóngshì guójì màoyì yǔ ruǎnjiàn kāifā yǐ yǒu sān nián jīngyàn.",
        english: "I have three years of experience in international trade and software development.",
        bengali: "আন্তর্জাতিক বাণিজ্য ও সফটওয়্যার ডেভেলপমেন্টে আমার ৩ বছরের অভিজ্ঞতা রয়েছে।",
      },
      {
        chinese: "我具备跨文化团队沟通与项目协调能力。",
        pinyin: "Wǒ jùbèi kuà wénhuà tuánduì gōutōng yǔ xiàngmù xiétiáo nénglì.",
        english: "I possess cross-cultural team communication and project coordination abilities.",
        bengali: "আমার বিভিন্ন সংস্কৃতির দলের সাথে যোগাযোগ ও সমন্বয় করার দক্ষতা রয়েছে।",
      },
    ],
    keyVocabulary: [
      { hanzi: "简历", pinyin: "jiǎnlì", english: "resume / CV", bengali: "জীবনবৃত্তান্ত / সিভি" },
      { hanzi: "团队合作", pinyin: "tuánduì hézuò", english: "teamwork", bengali: "দলগত কাজ" },
      { hanzi: "优势", pinyin: "yōushì", english: "strength / advantage", bengali: "প্রধান শক্তি" },
      { hanzi: "职业规划", pinyin: "zhíyè guīhuà", english: "career plan", bengali: "ক্যারিয়ার পরিকল্পনা" },
    ],
  },
];
