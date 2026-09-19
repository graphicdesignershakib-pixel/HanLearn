export type ThemeId = "graphic-china" | "china-red" | "jade-scholar" | "midnight-arts";

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  nameBn: string;
  description: string;
  descriptionBn: string;
  primaryColor: string; // Hex
  primaryHover: string;
  accentColor: string;
  paperBg: string;
  cardBg: string;
  textPrimary: string;
  textSecondary: string;
  badgeBg: string;
  isDark: boolean;
}

export const THEMES: ThemeConfig[] = [
  {
    id: "graphic-china",
    name: "Graphic Arts × China Fusion",
    nameBn: "গ্রাফিক আর্টস × চায়না ফিউশন (মূল থিম)",
    description: "Iconic Govt. Graphic Arts Institute cerulean blue merged with Chinese imperial crimson.",
    descriptionBn: "সরকারি গ্রাফিক আর্টস ইনস্টিটিউটের নীল ও ঐতিহ্যবাহী চায়না লালের দৃষ্টিনন্দন মিশ্রণ।",
    primaryColor: "#0284c7", // Cerulean blue from the logo gear
    primaryHover: "#0369a1",
    accentColor: "#dc2626", // Chinese imperial red
    paperBg: "#F8FAFC",
    cardBg: "#FFFFFF",
    textPrimary: "#0F172A",
    textSecondary: "#475569",
    badgeBg: "#E0F2FE",
    isDark: false,
  },
  {
    id: "china-red",
    name: "Imperial China Vermilion",
    nameBn: "ঐতিহ্যবাহী চায়না ইম্পেরিয়াল রেড",
    description: "Classic Chinese crimson and amber gold lacquer style.",
    descriptionBn: "চায়নার ঐতিহ্যবাহী গাঢ় লাল ও গোল্ডেন অ্যাম্বার রঙের ক্লাসিক থিম।",
    primaryColor: "#dc2626",
    primaryHover: "#b91c1c",
    accentColor: "#d97706",
    paperBg: "#FFFDF9",
    cardBg: "#FFFFFF",
    textPrimary: "#18181B",
    textSecondary: "#52525B",
    badgeBg: "#FEE2E2",
    isDark: false,
  },
  {
    id: "jade-scholar",
    name: "Jade Scholar",
    nameBn: "জেড স্কলার (সবুজ ও আকাশি)",
    description: "Chinese imperial emerald jade balanced with clean cyan.",
    descriptionBn: "চাইনিজ মার্বেল জেড গ্রিন এবং স্নিগ্ধ আকাশি ব্লু এর শান্ত পরিবেশ।",
    primaryColor: "#059669",
    primaryHover: "#047857",
    accentColor: "#0284c7",
    paperBg: "#F0FDF4",
    cardBg: "#FFFFFF",
    textPrimary: "#064E3B",
    textSecondary: "#374151",
    badgeBg: "#DCFCE7",
    isDark: false,
  },
  {
    id: "midnight-arts",
    name: "Graphic Midnight Dark",
    nameBn: "মিডনাইট গ্রাফিক আর্টস (ডার্ক মোড)",
    description: "Deep navy night canvas with luminous cyan and neon magenta accents.",
    descriptionBn: "ডার্ক ব্যাকগ্রাউন্ডের সাথে উজ্জ্বল সায়ান ব্লু ও নিয়ন ক্র্যাব অ্যাকসেন্ট।",
    primaryColor: "#38bdf8",
    primaryHover: "#0ea5e9",
    accentColor: "#f43f5e",
    paperBg: "#0B1120",
    cardBg: "#131C31",
    textPrimary: "#F8FAFC",
    textSecondary: "#94A3B8",
    badgeBg: "#1E293B",
    isDark: true,
  },
];

const THEME_STORAGE_KEY = "hanlearn_theme_preference_v2";

class ThemeService {
  private currentTheme: ThemeId = "graphic-china";
  private listeners: (() => void)[] = [];

  constructor() {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeId;
        if (saved && THEMES.some((t) => t.id === saved)) {
          this.currentTheme = saved;
        }
      } catch {
        // fallback
      }
      this.applyThemeToDOM(this.currentTheme);
    }
  }

  public getTheme(): ThemeConfig {
    return THEMES.find((t) => t.id === this.currentTheme) || THEMES[0];
  }

  public setTheme(themeId: ThemeId) {
    if (THEMES.some((t) => t.id === themeId)) {
      this.currentTheme = themeId;
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(THEME_STORAGE_KEY, themeId);
        } catch {}
        this.applyThemeToDOM(themeId);
      }
      this.notify();
    }
  }

  private applyThemeToDOM(themeId: ThemeId) {
    if (typeof document === "undefined") return;
    const theme = THEMES.find((t) => t.id === themeId) || THEMES[0];
    const root = document.documentElement;

    root.style.setProperty("--color-primary", theme.primaryColor);
    root.style.setProperty("--color-primary-hover", theme.primaryHover);
    root.style.setProperty("--color-accent", theme.accentColor);
    root.style.setProperty("--color-paper", theme.paperBg);
    root.style.setProperty("--color-card", theme.cardBg);
    root.style.setProperty("--color-text-main", theme.textPrimary);
    root.style.setProperty("--color-text-sub", theme.textSecondary);

    if (theme.isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }
}

export const themeService = new ThemeService();
