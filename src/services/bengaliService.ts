export type Language = "en" | "bn";
export type LanguageMode = Language;

const STORAGE_KEY_LANG = "hanlearn_selected_language";

export interface TranslationMap {
  [key: string]: {
    en: string;
    bn: string;
  };
}

export const translations: TranslationMap = {
  // Navigation
  "nav.dashboard": { en: "Dashboard", bn: "ড্যাশবোর্ড" },
  "nav.aiTutor": { en: "AI Tutor", bn: "এআই শিক্ষক" },
  "nav.hsk": { en: "HSK Levels", bn: "HSK লেভেল" },
  "nav.vocabulary": { en: "Vocabulary", bn: "শব্দভাণ্ডার" },
  "nav.flashcards": { en: "SRS Flashcards", bn: "ফ্ল্যাশকার্ড (SRS)" },
  "nav.speaking": { en: "Speaking Lab", bn: "স্পিকিং ল্যাব" },
  "nav.mockExam": { en: "Mock Exams", bn: "মক টেস্ট" },
  "nav.stories": { en: "Graded Stories", bn: "গল্প ও ডায়ালগ" },
  "nav.radicals": { en: "Radicals (部首)", bn: "র‌্যাডিক্যাল ও পার্টস" },
  "nav.practice": { en: "Practice Hub", bn: "অনুশীলন কেন্দ্র" },
  "nav.writing": { en: "Hanzi Writing", bn: "হানজি লেখা" },
  "nav.tones": { en: "Tone Trainer", bn: "টোন ট্রেইনার" },
  "nav.saved": { en: "Saved Words", bn: "সংরক্ষিত শব্দ" },
  "nav.progress": { en: "Progress", bn: "অগ্রগতি" },
  "nav.settings": { en: "Settings", bn: "সেটিংস" },

  // General Actions
  "action.startPractice": { en: "Practice Now", bn: "অনুশীলন শুরু করুন" },
  "action.listen": { en: "Listen", bn: "শুনুন" },
  "action.speak": { en: "Speak Now", bn: "উচ্চারণ করুন" },
  "action.submit": { en: "Submit", bn: "জমা দিন" },
  "action.flip": { en: "Flip Card", bn: "কার্ড উল্টান" },
  "action.again": { en: "Again", bn: "আবার" },
  "action.hard": { en: "Hard", bn: "কঠিন" },
  "action.good": { en: "Good", bn: "ভালো" },
  "action.easy": { en: "Easy", bn: "সহজ" },
  "action.showPinyin": { en: "Show Pinyin", bn: "পিনয়িন দেখুন" },
  "action.showEnglish": { en: "Show English", bn: "ইংরেজি দেখুন" },
  "action.showBengali": { en: "Show Bengali (বাংলা)", bn: "বাংলা অনুবাদ দেখুন" },
  "action.claimXp": { en: "Claim XP", bn: "XP সংগ্রহ করুন" },

  // Speaking Lab
  "speaking.title": { en: "AI Speaking Assessment", bn: "এআই স্পিকিং ও উচ্চারণ মূল্যায়ন" },
  "speaking.subtitle": { en: "Speak Mandarin into your microphone and get instant tone & accuracy feedback.", bn: "মাইক্রোফোনে মান্দারিন উচ্চারণ করুন এবং তাৎক্ষণিক টোন ও নির্ভুলতার স্কোর পান।" },
  "speaking.record": { en: "Press to Speak", bn: "বলতে চাপুন" },
  "speaking.recording": { en: "Listening... Speak now", bn: "শুনছি... এখন চাইনিজে বলুন" },
  "speaking.accuracy": { en: "Accuracy Score", bn: "উচ্চারণ নির্ভুলতা" },
  "speaking.toneMatch": { en: "Tone Precision", bn: "টোন নির্ভুলতা" },

  // Mock Exam
  "exam.title": { en: "Official HSK Mock Exam Simulator", bn: "অফিসিয়াল HSK মক টেস্ট সিমুলেটর" },
  "exam.start": { en: "Start Exam", bn: "পরীক্ষা শুরু করুন" },
  "exam.listening": { en: "Listening Section", bn: "লিসেনিং সেকশন (听力)" },
  "exam.reading": { en: "Reading Section", bn: "রিডিং সেকশন (阅读)" },
  "exam.writing": { en: "Writing Section", bn: "রাইটিং সেকশন (书写)" },
  "exam.timeRemaining": { en: "Time Remaining", bn: "অবশিষ্ট সময়" },
  "exam.passScore": { en: "Pass Mark: 180 / 300", bn: "পাস নম্বর: ১৮০ / ৩০০" },

  // Flashcards
  "flashcard.title": { en: "Spaced Repetition Flashcards", bn: "স্পেসড রিপিটেশন ফ্ল্যাশকার্ড" },
  "flashcard.due": { en: "Due for Review", bn: "রিভিউ বাকি" },
  "flashcard.learning": { en: "Learning", bn: "শিখছি" },
  "flashcard.mastered": { en: "Mastered", bn: "সম্পূর্ণ আয়ত্তে" },

  // Graded Stories
  "stories.title": { en: "Graded Chinese Reading Stories", bn: "লেভেল ভিত্তিক চাইনিজ ছোট গল্প" },
  "stories.subtitle": { en: "Read real-world Chinese stories. Click any word to see Pinyin, English and Bengali.", bn: "বাস্তব চাইনিজ গল্প পড়ুন। যেকোনো শব্দে ক্লিক করে পিনয়িন, ইংরেজি ও বাংলা অর্থ দেখুন।" },

  // Radicals
  "radicals.title": { en: "Radical & Character Decomposition", bn: "র‌্যাডিক্যাল (部首) ও ক্যারেক্টার বিশ্লেষণ" },
  "radicals.subtitle": { en: "Master the building blocks of Chinese characters to memorize vocabulary faster.", bn: "চাইনিজ ক্যারেক্টার গঠনের মূল অংশ (র‌্যাডিক্যাল) আয়ত্ত করে দ্রুত শব্দ মুখস্থ করুন।" },
};

// Common Chinese-to-Bengali vocabulary dictionary for rich bilingual study
export const CHINESE_TO_BENGALI_DICT: Record<string, string> = {
  // HSK 1 basics
  "你": "তুমি / আপনি",
  "好": "ভালো",
  "你好": "হ্যালো / নমস্কার",
  "我": "আমি",
  "他": "সে (পুরুষ)",
  "她": "সে (মহিলা)",
  "我们": "আমরা",
  "你们": "তোমরা / আপনারা",
  "他们": "তারা",
  "是": "হয় / হওয়া",
  "不": "না / নয়",
  "很": "খুব / অত্যন্ত",
  "谢谢": "ধন্যবাদ",
  "不客气": "স্বাগতম / কোনো ব্যাপার না",
  "再见": "বিদায় / আবার দেখা হবে",
  "老师": "শিক্ষক / শিক্ষিকা",
  "学生": "শিক্ষার্থী / ছাত্র-ছাত্রী",
  "人": "মানুষ / ব্যক্তি",
  "中国人": "চীনা নাগরিক",
  "水": "পানি / জল",
  "茶": "চা",
  "喝": "পান করা",
  "吃": "খাওয়া",
  "米饭": "ভাত",
  "苹果": "আপেল",
  "大": "বড়",
  "小": "ছোট",
  "多": "অনেক / বেশি",
  "少": "কম / অল্প",
  "一": "এক",
  "二": "দুই",
  "三": "তিন",
  "四": "চার",
  "五": "পাঁচ",
  "六": "ছয়",
  "七": "সাত",
  "八": "আট",
  "九": "নয়",
  "十": "দশ",
  "百": "শত / একশো",
  "钱": "টাকা / অর্থ",
  "书": "বই",
  "学校": "বিদ্যালয় / স্কুল",
  "家": "বাড়ি / পরিবার",
  "北京": "বেইজিং (চীনের রাজধানী)",
  "爱": "ভালোবাসা",
  "喜欢": "পছন্দ করা",
  "看": "দেখা / পড়া",
  "听": "শোনা",
  "说": "বলা / কথা বলা",
  "写": "লেখা",
  "买": "কেনা / ক্রয় করা",
  "去": "যাওয়া",
  "来": "আসা",
  "想": "চাওয়া / ভাবা",
  "有": "আছে / থাকা",
  "没有": "নেই / না থাকা",
  "什么": "কী / কি",
  "谁": "কে / কাকে",
  "哪儿": "কোথায়",
  "几": "কয়টি / কত",
  "怎么": "কীভাবে / কেমন করে",
  "猫": "বিড়াল",
  "狗": "কুকুর",
  "今天": "আজকে",
  "明天": "আগামীকাল",
  "昨天": "গতকাল",
  "现在": "এখন / বর্তমানে",
  "点": "টা (সময়) / বিন্দু",
  "年": "বছর",
  "月": "মাস / চাঁদ",
  "日": "দিন / সূর্য",
  "星期": "সপ্তাহ",
  "名字": "নাম",
  "汉语": "চাইনিজ ভাষা",
  "字": "অক্ষর / বর্ণ",
  "做": "করা",
  "坐": "বসা",
  "岁": "বছর (বয়স)",
  "高兴": "খুশি / আনন্দিত",
  "漂亮": "সুন্দর / রূপবতী",
  "冷": "ঠাণ্ডা",
  "热": "গরম",
  "桌子": "টেবিল",
  "椅子": "চেয়ার",
  "前面": "সামনে",
  "后面": "পেছনে",
  "里面": "ভেতরে",
  "工作": "কাজ / চাকরি",
  "医生": "ডাক্তার / চিকিৎসক",
  "医院": "হাসপাতাল",
  "商店": "দোকান",
  "飞机": "উড়োজাহাজ",
  "出租车": "ট্যাক্সি ক্যাব",
  "天气": "আবহাওয়া",
  "下雨": "বৃষ্টি হওয়া",
};

class BengaliService {
  private currentLanguage: Language = "en";
  private listeners: (() => void)[] = [];

  constructor() {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY_LANG) as Language;
      if (saved === "bn" || saved === "en") {
        this.currentLanguage = saved;
      }
    }
  }

  public getLanguage(): Language {
    return this.currentLanguage;
  }

  public setLanguage(lang: Language) {
    this.currentLanguage = lang;
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_LANG, lang);
    }
    this.notify();
  }

  public toggleLanguage(): Language {
    const next = this.currentLanguage === "en" ? "bn" : "en";
    this.setLanguage(next);
    return next;
  }

  public t(key: string, defaultText?: string): string {
    const entry = translations[key];
    if (!entry) return defaultText || key;
    return entry[this.currentLanguage] || defaultText || entry.en || key;
  }

  public getBengaliWordMeaning(hanzi: string): string | null {
    return CHINESE_TO_BENGALI_DICT[hanzi] || null;
  }

  public subscribe(callback: () => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb());
  }
}

export const bengaliService = new BengaliService();
