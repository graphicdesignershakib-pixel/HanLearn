import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export interface Badge {
  id: string;
  name: string;
  nameZh: string;
  nameBn: string;
  description: string;
  descriptionBn: string;
  icon: string;
  category: "streak" | "speaking" | "vocab" | "exam" | "writing";
  unlocked: boolean;
  unlockedAt?: number;
  progress: number; // 0 to 100
}

export interface DailyQuest {
  id: string;
  title: string;
  titleBn: string;
  target: number;
  current: number;
  rewardXp: number;
  completed: boolean;
  claimed: boolean;
}

export interface UserGamificationState {
  xp: number;
  level: number;
  levelTitle: string;
  levelTitleZh: string;
  levelTitleBn: string;
  nextLevelXp: number;
  badges: Badge[];
  quests: DailyQuest[];
  lastActiveDate: string;
  dailyStreak: number;
}

const ALL_BADGES: Badge[] = [
  {
    id: "first_word",
    name: "First Steps",
    nameZh: "迈出第一步",
    nameBn: "প্রথম পদক্ষেপ",
    description: "Study your very first Chinese vocabulary word",
    descriptionBn: "আপনার প্রথম চাইনিজ শব্দ পড়ুন",
    icon: "🌱",
    category: "vocab",
    unlocked: false,
    progress: 0,
  },
  {
    id: "voice_pioneer",
    name: "Voice Pioneer",
    nameZh: "发音先锋",
    nameBn: "কণ্ঠ অগ্রগামী",
    description: "Complete your first AI speaking pronunciation evaluation",
    descriptionBn: "আপনার প্রথম এআই স্পিকিং মূল্যায়ন সম্পন্ন করুন",
    icon: "🎙️",
    category: "speaking",
    unlocked: false,
    progress: 0,
  },
  {
    id: "tone_guru",
    name: "Tone Guru",
    nameZh: "声调大师",
    nameBn: "টোন গুরু",
    description: "Score 85%+ on the Mandarin Tone Lab exercise",
    descriptionBn: "টোন ল্যাবে ৮৫%+ সঠিক উত্তর দিন",
    icon: "🎵",
    category: "speaking",
    unlocked: false,
    progress: 0,
  },
  {
    id: "streak_3",
    name: "3-Day Fire",
    nameZh: "坚持三天",
    nameBn: "৩ দিনের স্ট্রিক",
    description: "Maintain a study streak of 3 consecutive days",
    descriptionBn: "টানা ৩ দিন প্র্যাকটিস স্ট্রিক বজায় রাখুন",
    icon: "🔥",
    category: "streak",
    unlocked: false,
    progress: 0,
  },
  {
    id: "srs_champion",
    name: "Memory Champion",
    nameZh: "记忆冠军",
    nameBn: "স্মৃতি বিজয়ী",
    description: "Review 25 flashcards with spaced repetition",
    descriptionBn: "স্পেসড রিপিটেশনে ২৫টি ফ্ল্যাশকার্ড পর্যালোচনা করুন",
    icon: "🎴",
    category: "vocab",
    unlocked: false,
    progress: 0,
  },
  {
    id: "ink_master",
    name: "Ink Calligrapher",
    nameZh: "笔墨生花",
    nameBn: "কালি ও তুলির কারিগর",
    description: "Write 10 Chinese characters with correct stroke order",
    descriptionBn: "সঠিক স্ট্রোক অর্ডারে ১০টি হানজি লিখুন",
    icon: "🖌️",
    category: "writing",
    unlocked: false,
    progress: 0,
  },
  {
    id: "exam_conqueror",
    name: "HSK Conqueror",
    nameZh: "考场制胜",
    nameBn: "HSK বিজয়ী",
    description: "Complete a full official HSK mock exam with passing mark",
    descriptionBn: "একটি পূর্ণাঙ্গ HSK মক টেস্টে পাস করুন",
    icon: "🏆",
    category: "exam",
    unlocked: false,
    progress: 0,
  },
  {
    id: "story_reader",
    name: "Story Explorer",
    nameZh: "故事漫步",
    nameBn: "গল্প অভিযাত্রী",
    description: "Read 2 graded Chinese stories and pass comprehension quizzes",
    descriptionBn: "২টি চাইনিজ গল্প পড়ে কুইজে পাস করুন",
    icon: "📖",
    category: "vocab",
    unlocked: false,
    progress: 0,
  },
  {
    id: "radical_detective",
    name: "Radical Detective",
    nameZh: "部首神探",
    nameBn: "র‌্যাডিক্যাল গোয়েন্দা",
    description: "Explore 15 Chinese radicals and decompose their characters",
    descriptionBn: "১৫টি চাইনিজ মূল বা র‌্যাডিক্যাল বিশ্লেষণ করুন",
    icon: "🔍",
    category: "vocab",
    unlocked: false,
    progress: 0,
  },
];

const INITIAL_QUESTS: DailyQuest[] = [
  {
    id: "quest_flashcards",
    title: "Review 10 SRS Flashcards",
    titleBn: "১০টি ফ্ল্যাশকার্ড পর্যালোচনা করুন",
    target: 10,
    current: 0,
    rewardXp: 50,
    completed: false,
    claimed: false,
  },
  {
    id: "quest_speaking",
    title: "Practice speaking 2 sentences",
    titleBn: "২টি বাক্য মুখে উচ্চারণ প্র্যাকটিস করুন",
    target: 2,
    current: 0,
    rewardXp: 60,
    completed: false,
    claimed: false,
  },
  {
    id: "quest_story",
    title: "Read 1 graded Chinese story",
    titleBn: "১টি চাইনিজ ছোট গল্প পড়ুন",
    target: 1,
    current: 0,
    rewardXp: 80,
    completed: false,
    claimed: false,
  },
  {
    id: "quest_writing",
    title: "Practice Hanzi stroke order on Tian-Zi-Ge",
    titleBn: "তিয়ান-জি-গে গ্রিডে হানজি লিখুন",
    target: 3,
    current: 0,
    rewardXp: 40,
    completed: false,
    claimed: false,
  },
];

class GamificationService {
  private state: UserGamificationState;
  private listeners: (() => void)[] = [];
  private currentUserId: string | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("hanlearn_gamification_v1");
      } catch {
        // ignore
      }
    }
    this.state = this.getDefaultState();
  }

  private getStorageKey(): string {
    return this.currentUserId
      ? `hanlearn_gamification_uid_${this.currentUserId}`
      : "hanlearn_gamification_guest";
  }

  private getDefaultState(): UserGamificationState {
    return {
      xp: 0,
      level: 1,
      levelTitle: "Beginner Explorer",
      levelTitleZh: "初学探索者",
      levelTitleBn: "নবীন শিক্ষার্থী",
      nextLevelXp: 100,
      badges: ALL_BADGES.map((b) => ({ ...b, unlocked: false, progress: 0 })),
      quests: INITIAL_QUESTS.map((q) => ({
        ...q,
        current: 0,
        completed: false,
        claimed: false,
      })),
      lastActiveDate: new Date().toISOString().slice(0, 10),
      dailyStreak: 0,
    };
  }

  /**
   * Switches user context to guarantee separate gamification stats per account
   */
  public async setUser(userId: string | null): Promise<void> {
    this.currentUserId = userId;

    if (!userId) {
      this.state = this.getDefaultState();
      this.notify();
      return;
    }

    // 1. Try to load from user-specific localStorage first for instantaneous UI update
    const storageKey = `hanlearn_gamification_uid_${userId}`;
    let loadedFromLocal = false;

    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed.xp === "number") {
            this.state = this.validateAndNormalizeState(parsed);
            loadedFromLocal = true;
          }
        }
      } catch {
        // ignore parse error
      }
    }

    if (!loadedFromLocal) {
      this.state = this.getDefaultState();
    }
    this.notify();

    // 2. Sync asynchronously with cloud Firestore for persistent multi-device stats
    try {
      const statsDocRef = doc(db, "users", userId, "gamification", "stats");
      const snap = await getDoc(statsDocRef);

      if (snap.exists()) {
        const cloudData = snap.data() as UserGamificationState;
        if (cloudData && typeof cloudData.xp === "number") {
          // If cloud data is ahead or equal, adopt it
          if (!loadedFromLocal || cloudData.xp >= this.state.xp) {
            this.state = this.validateAndNormalizeState(cloudData);
            if (typeof window !== "undefined") {
              try {
                localStorage.setItem(storageKey, JSON.stringify(this.state));
              } catch {
                // quota
              }
            }
            this.notify();
          }
        }
      } else {
        // First time cloud initialization for this user
        await setDoc(statsDocRef, this.state, { merge: true });
      }
    } catch (err) {
      console.warn("Gamification cloud sync note:", err);
    }
  }

  private validateAndNormalizeState(raw: any): UserGamificationState {
    const fallback = this.getDefaultState();
    const badgesMap = new Map<string, Record<string, any>>(
      (Array.isArray(raw.badges) ? raw.badges : []).map((b: any) => [b.id, b])
    );
    const questsMap = new Map<string, Record<string, any>>(
      (Array.isArray(raw.quests) ? raw.quests : []).map((q: any) => [q.id, q])
    );

    const mergedBadges = ALL_BADGES.map((template) => {
      const existing = badgesMap.get(template.id);
      return existing
        ? ({ ...template, ...existing } as Badge)
        : { ...template, unlocked: false, progress: 0 };
    });

    const mergedQuests = INITIAL_QUESTS.map((template) => {
      const existing = questsMap.get(template.id);
      return existing
        ? ({ ...template, ...existing } as DailyQuest)
        : { ...template, current: 0, completed: false, claimed: false };
    });

    return {
      xp: typeof raw.xp === "number" ? raw.xp : fallback.xp,
      level: typeof raw.level === "number" ? raw.level : fallback.level,
      levelTitle: raw.levelTitle || fallback.levelTitle,
      levelTitleZh: raw.levelTitleZh || fallback.levelTitleZh,
      levelTitleBn: raw.levelTitleBn || fallback.levelTitleBn,
      nextLevelXp: typeof raw.nextLevelXp === "number" ? raw.nextLevelXp : fallback.nextLevelXp,
      badges: mergedBadges,
      quests: mergedQuests,
      lastActiveDate: raw.lastActiveDate || fallback.lastActiveDate,
      dailyStreak: typeof raw.dailyStreak === "number" ? raw.dailyStreak : fallback.dailyStreak,
    };
  }

  private saveState() {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(this.getStorageKey(), JSON.stringify(this.state));
      } catch {
        // storage quota
      }
    }

    // Persist to user's personal Firestore document if logged in
    if (this.currentUserId) {
      const userId = this.currentUserId;
      setDoc(doc(db, "users", userId, "gamification", "stats"), this.state, {
        merge: true,
      }).catch((err) => {
        console.warn("Gamification cloud save note:", err);
      });
    }

    this.notify();
  }

  public getState(): UserGamificationState {
    return { ...this.state };
  }

  public addXp(amount: number, reason?: string): { leveledUp: boolean; newLevel: number } {
    let newXp = this.state.xp + amount;
    let newLevel = 1;
    let leveledUp = false;

    // Check streak on first activity of the day
    const today = new Date().toISOString().slice(0, 10);
    if (this.state.lastActiveDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      if (this.state.lastActiveDate === yesterday) {
        this.state.dailyStreak += 1;
      } else {
        this.state.dailyStreak = 1;
      }
      this.state.lastActiveDate = today;
    }

    // Dynamic Level Progression Calculation
    if (newXp >= 2500) {
      newLevel = 6;
      this.state.levelTitle = "Chinese Scholar (中国通)";
      this.state.levelTitleZh = "中国通";
      this.state.levelTitleBn = "চাইনিজ পণ্ডিত";
      this.state.nextLevelXp = 5000;
    } else if (newXp >= 1200) {
      newLevel = 5;
      this.state.levelTitle = "Mandarin Master";
      this.state.levelTitleZh = "词汇大师";
      this.state.levelTitleBn = "ম্যান্ডারিন মাস্টার";
      this.state.nextLevelXp = 2500;
    } else if (newXp >= 600) {
      newLevel = 4;
      this.state.levelTitle = "Mandarin Adept";
      this.state.levelTitleZh = "汉语达人";
      this.state.levelTitleBn = "ম্যান্ডারিন দক্ষ";
      this.state.nextLevelXp = 1200;
    } else if (newXp >= 300) {
      newLevel = 3;
      this.state.levelTitle = "Tone Scholar";
      this.state.levelTitleZh = "声调学者";
      this.state.levelTitleBn = "টোন গবেষক";
      this.state.nextLevelXp = 600;
    } else if (newXp >= 100) {
      newLevel = 2;
      this.state.levelTitle = "Hanzi Apprentice";
      this.state.levelTitleZh = "汉字学徒";
      this.state.levelTitleBn = "হানজি শিক্ষানবিশ";
      this.state.nextLevelXp = 300;
    } else {
      newLevel = 1;
      this.state.levelTitle = "Beginner Explorer";
      this.state.levelTitleZh = "初学探索者";
      this.state.levelTitleBn = "নবীন শিক্ষার্থী";
      this.state.nextLevelXp = 100;
    }

    if (newLevel > this.state.level) {
      leveledUp = true;
    }

    this.state.xp = newXp;
    this.state.level = newLevel;
    this.saveState();

    return { leveledUp, newLevel };
  }

  public progressQuest(questId: string, increment = 1) {
    const quest = this.state.quests.find((q) => q.id === questId);
    if (!quest) return;

    quest.current = Math.min(quest.target, quest.current + increment);
    if (quest.current >= quest.target) {
      quest.completed = true;
    }
    this.saveState();
  }

  public claimQuestReward(questId: string): number {
    const quest = this.state.quests.find((q) => q.id === questId);
    if (!quest || !quest.completed || quest.claimed) return 0;

    quest.claimed = true;
    this.addXp(quest.rewardXp);
    this.saveState();
    return quest.rewardXp;
  }

  public unlockBadge(badgeId: string) {
    const badge = this.state.badges.find((b) => b.id === badgeId);
    if (badge && !badge.unlocked) {
      badge.unlocked = true;
      badge.unlockedAt = Date.now();
      badge.progress = 100;
      this.addXp(100);
      this.saveState();
    }
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

export const gamificationService = new GamificationService();
