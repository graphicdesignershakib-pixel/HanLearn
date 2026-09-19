import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Layers,
  BookMarked,
  Sparkles,
  Edit3,
  Volume2,
  Star,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  Bot,
  Mic,
  BookOpen,
  FileCheck,
  Split,
  MessageSquare,
  AlertCircle,
  Calendar,
  Flame,
  Zap,
  TrendingDown,
  Compass,
  Headphones,
  GitFork,
  ShieldCheck,
  Palette,
  Search,
} from "lucide-react";
import { navigate } from "../../services/routerService";
import { bengaliService } from "../../services/bengaliService";
import { mistakeService } from "../../services/mistakeService";
import { useAuth } from "../../context/AuthContext";
import { themeService } from "../../services/themeService";
import { ThemeChooserModal } from "./ThemeChooserModal";

interface SidebarProps {
  currentPath: string;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

interface SubMenuItem {
  label: string;
  bengaliLabel: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
}

interface MenuGroup {
  id: string;
  name: string;
  nameBn: string;
  icon: React.ElementType;
  items: SubMenuItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { isAdmin, user, profile, signOut } = useAuth();
  const [isBn, setIsBn] = useState(bengaliService.getLanguage() === "bn");
  const [unresolvedMistakes, setUnresolvedMistakes] = useState(0);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [menuSearch, setMenuSearch] = useState("");
  const [currentTheme, setCurrentTheme] = useState(themeService.getTheme());

  useEffect(() => {
    const unsubB = bengaliService.subscribe(() => {
      setIsBn(bengaliService.getLanguage() === "bn");
    });
    const unsubT = themeService.subscribe(() => {
      setCurrentTheme(themeService.getTheme());
    });
    const updateMistakes = () => {
      setUnresolvedMistakes(mistakeService.getMistakeStats().unresolved);
    };
    updateMistakes();
    const unsubM = mistakeService.subscribe(updateMistakes);

    return () => {
      unsubB();
      unsubT();
      unsubM();
    };
  }, []);

  const menuGroups: MenuGroup[] = [
    {
      id: "curriculum",
      name: "Curriculum & Levels",
      nameBn: "কোর্স ও পাঠ্যক্রম",
      icon: Compass,
      items: [
        {
          label: "HSK Learning Path",
          bengaliLabel: "এইচএসকে শিক্ষা পথরেখা",
          path: "/learning-path",
          icon: Compass,
          badge: "3.0",
        },
        {
          label: "HSK Levels (1-9)",
          bengaliLabel: "এইচএসকে লেভেলসমূহ",
          path: "/hsk",
          icon: Layers,
        },
        {
          label: "Study Planner & Goals",
          bengaliLabel: "পড়াশোনার পরিকল্পনা",
          path: "/study-plan",
          icon: Calendar,
        },
      ],
    },
    {
      id: "vocabulary",
      name: "Vocabulary & Characters",
      nameBn: "শব্দভাণ্ডার ও অক্ষর",
      icon: BookMarked,
      items: [
        {
          label: "Vocabulary Master",
          bengaliLabel: "শব্দকোষ (Vocabulary)",
          path: "/vocabulary",
          icon: BookMarked,
        },
        {
          label: "Radicals & Hanzi",
          bengaliLabel: "র‌্যাডিক্যাল ও বর্ণ বিশ্লেষণ",
          path: "/radicals",
          icon: Split,
        },
        {
          label: "Character Writing (Tian-Zi-Ge)",
          bengaliLabel: "হানজি লিখন ল্যাব",
          path: "/writing",
          icon: Edit3,
        },
        {
          label: "SRS Flashcard Decks",
          bengaliLabel: "SRS ফ্ল্যাশকার্ড",
          path: "/flashcards",
          icon: Layers,
          badge: "SM-2",
        },
        {
          label: "Saved Favorite Words",
          bengaliLabel: "সংরক্ষিত শব্দ",
          path: "/saved",
          icon: Star,
        },
        {
          label: "Hanzi Etymology Tree",
          bengaliLabel: "অক্ষর ভাঙন ও বৃক্ষ",
          path: "/etymology",
          icon: GitFork,
          badge: "NEW",
        },
      ],
    },
    {
      id: "practice_labs",
      name: "Interactive Practice Labs",
      nameBn: "স্কিল প্র্যাকটিস ল্যাব",
      icon: Sparkles,
      items: [
        {
          label: "Practice Hub",
          bengaliLabel: "অনুশীলন কেন্দ্র",
          path: "/practice",
          icon: Sparkles,
        },
        {
          label: "AI Pronunciation Coach",
          bengaliLabel: "উচ্চারণ ল্যাব",
          path: "/practice/pronunciation",
          icon: Mic,
        },
        {
          label: "Mandarin Tone Lab",
          bengaliLabel: "টোন অনুশীলন",
          path: "/practice/tones",
          icon: Volume2,
        },
        {
          label: "Tone Pitch Visualizer",
          bengaliLabel: "পিচ ভিজ্যুয়ালাইজার",
          path: "/tone-visualizer",
          icon: Volume2,
          badge: "AI",
        },
        {
          label: "AI Speaking & Fluency",
          bengaliLabel: "এআই স্পিকিং ল্যাব",
          path: "/speaking",
          icon: Mic,
        },
        {
          label: "Sentence Builder",
          bengaliLabel: "বাক্য গঠন ল্যাব",
          path: "/sentence-builder",
          icon: Sparkles,
          badge: "NEW",
        },
        {
          label: "Pinyin & Phonetics",
          bengaliLabel: "পিনয়িন ও উচ্চারণ",
          path: "/pinyin-lab",
          icon: Volume2,
        },
        {
          label: "Audio Dictation Lab",
          bengaliLabel: "শ্রুতলিপি ল্যাব",
          path: "/dictation",
          icon: Headphones,
        },
        {
          label: "Grammar Lab",
          bengaliLabel: "ব্যাকরণ ল্যাব (Grammar)",
          path: "/grammar",
          icon: BookOpen,
          badge: "NEW",
        },
      ],
    },
    {
      id: "exams",
      name: "Exams & Assessment",
      nameBn: "মক টেস্ট ও পরীক্ষা",
      icon: FileCheck,
      items: [
        {
          label: "HSK 3.0 Mock Exam",
          bengaliLabel: "HSK ৩.০ মক টেস্ট",
          path: "/exam",
          icon: FileCheck,
          badge: "Official",
        },
        {
          label: "Rapid Mini Tests",
          bengaliLabel: "দ্রুত মিনি পরীক্ষা",
          path: "/mini-tests",
          icon: Zap,
        },
        {
          label: "Smart Mistake Book",
          bengaliLabel: "ভুল সংশোধন বই",
          path: "/mistake-book",
          icon: AlertCircle,
          badge: unresolvedMistakes > 0 ? `${unresolvedMistakes}` : undefined,
        },
        {
          label: "AI Weak Area Drills",
          bengaliLabel: "দুর্বল ক্ষেত্র নিরাময়",
          path: "/weak-areas",
          icon: TrendingDown,
        },
      ],
    },
    {
      id: "immersion",
      name: "Immersion & Culture",
      nameBn: "বাস্তবধর্মী চীনা ও সংস্কৃতি",
      icon: BookOpen,
      items: [
        {
          label: "Graded Chinese Stories",
          bengaliLabel: "চাইনিজ ছোট গল্প",
          path: "/stories",
          icon: BookOpen,
        },
        {
          label: "Real-Life Dialogues",
          bengaliLabel: "বাস্তব জীবনের চীনা",
          path: "/real-life",
          icon: Compass,
        },
        {
          label: "Chinese Culture & Chengyu",
          bengaliLabel: "চীনা সংস্কৃতি ও ঐতিহ্য",
          path: "/culture",
          icon: BookOpen,
        },
        {
          label: "AI Smart Tutor (HanBot)",
          bengaliLabel: "এআই টিউটর (হানবট)",
          path: "/chat",
          icon: Bot,
          badge: "AI",
        },
        {
          label: "Daily Quests & Streak",
          bengaliLabel: "দৈনিক মিশন ও স্ট্রিক",
          path: "/daily-missions",
          icon: Flame,
          badge: "Streak",
        },
        {
          label: "Learning Resources",
          bengaliLabel: "রিসোর্স লাইব্রেরি",
          path: "/resources",
          icon: BookOpen,
        },
      ],
    },
    {
      id: "personal",
      name: "Account & Settings",
      nameBn: "অ্যাকাউন্ট ও সেটিংস",
      icon: Settings,
      items: [
        {
          label: "Learning Analytics & Stats",
          bengaliLabel: "অগ্রগতি চার্ট ও পরিসংখ্যান",
          path: "/progress",
          icon: BarChart3,
        },
        {
          label: "App Preferences",
          bengaliLabel: "সেটিংস ও প্রেফারেন্স",
          path: "/settings",
          icon: Settings,
        },
        ...(isAdmin
          ? [
              {
                label: "Admin Resource Management",
                bengaliLabel: "অ্যাডমিন রিসোর্স প্যানেল",
                path: "/admin/resources",
                icon: ShieldCheck,
                badge: "Admin",
              },
            ]
          : []),
      ],
    },
  ];

  // Helper to determine if current path is in a group
  const isPathInGroup = (group: MenuGroup) => {
    return group.items.some((item) => {
      if (item.path === "/dashboard") return currentPath === "/" || currentPath === "/dashboard";
      return currentPath === item.path || currentPath.startsWith(item.path + "/");
    });
  };

  // State to track which group is expanded
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    menuGroups.forEach((g) => {
      if (isPathInGroup(g)) {
        initial[g.id] = true;
      }
    });
    return initial;
  });

  // Keep active group expanded if currentPath changes
  useEffect(() => {
    menuGroups.forEach((g) => {
      if (isPathInGroup(g)) {
        setExpandedGroups((prev) => ({ ...prev, [g.id]: true }));
      }
    });
  }, [currentPath]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    if (onCloseMobile) onCloseMobile();
  };

  const isItemActive = (path: string) => {
    if (path === "/dashboard") return currentPath === "/" || currentPath === "/dashboard";
    return currentPath === path || currentPath.startsWith(path + "/");
  };

  // Filter items if searching
  const filteredGroups = menuSearch.trim()
    ? menuGroups
        .map((g) => ({
          ...g,
          items: g.items.filter(
            (i) =>
              i.label.toLowerCase().includes(menuSearch.toLowerCase()) ||
              i.bengaliLabel.toLowerCase().includes(menuSearch.toLowerCase())
          ),
        }))
        .filter((g) => g.items.length > 0)
    : menuGroups;

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Main Sidebar Shell */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-72 bg-white dark:bg-neutral-900 border-r border-neutral-200/80 dark:border-neutral-800 flex flex-col transition-transform duration-300 ease-in-out shadow-xs md:shadow-none ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand Header with Govt. Graphic Arts Institute cerulean blue + Chinese red */}
        <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
          <div
            onClick={() => handleNavClick("/dashboard")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-lg shadow-md group-hover:scale-105 transition-transform">
              汉
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-neutral-900 dark:text-white">
                  HanLearn
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[var(--color-accent)] text-white uppercase tracking-wider">
                  HSK 3.0
                </span>
              </div>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium truncate max-w-[155px]">
                {isBn ? "গ্রাফিক আর্টস একাডেমি" : "Graphic Arts Institute"}
              </p>
            </div>
          </div>

          {/* Quick Theme Trigger */}
          <button
            type="button"
            onClick={() => setIsThemeModalOpen(true)}
            className="p-1.5 text-neutral-500 hover:text-[var(--color-primary)] dark:text-neutral-400 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            title="Theme & Color Chooser"
          >
            <Palette size={16} />
          </button>
        </div>

        {/* Search / Filter in Menu */}
        <div className="px-3.5 pt-3 pb-2">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
            />
            <input
              type="text"
              value={menuSearch}
              onChange={(e) => setMenuSearch(e.target.value)}
              placeholder={isBn ? "মেনু ও ফিচার খুঁজুন..." : "Filter features..."}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-neutral-100 dark:bg-neutral-800 border-none text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
            />
          </div>
        </div>

        {/* Single Direct Dashboard Button */}
        <div className="px-3 py-1">
          <button
            type="button"
            onClick={() => handleNavClick("/dashboard")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isItemActive("/dashboard")
                ? "bg-[var(--color-primary)] text-white shadow-sm"
                : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard size={16} />
              <span>{isBn ? "ড্যাশবোর্ড ওভারভিউ" : "Dashboard Overview"}</span>
            </div>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                isItemActive("/dashboard")
                  ? "bg-white/20 text-white"
                  : "bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300"
              }`}
            >
              Home
            </span>
          </button>
        </div>

        {/* Minimal Eye-Catchy Menu Groups (Accordion) */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5 scrollbar-thin">
          {filteredGroups.map((group) => {
            const isExpanded = menuSearch.trim() ? true : !!expandedGroups[group.id];
            const GroupIcon = group.icon;
            const hasActiveItem = isPathInGroup(group);

            return (
              <div
                key={group.id}
                className="rounded-xl border border-neutral-100 dark:border-neutral-800/80 overflow-hidden bg-neutral-50/50 dark:bg-neutral-900/40"
              >
                {/* Clean Menu Name Accordion Header */}
                <button
                  type="button"
                  onClick={() => toggleGroup(group.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-left transition-all cursor-pointer ${
                    hasActiveItem && !isExpanded
                      ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold"
                      : "text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/80"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                        hasActiveItem
                          ? "bg-[var(--color-primary)] text-white"
                          : "bg-neutral-200/70 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                      }`}
                    >
                      <GroupIcon size={14} />
                    </div>
                    <span className="text-xs font-bold truncate">
                      {isBn ? group.nameBn : group.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-neutral-200/80 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
                      {group.items.length}
                    </span>
                    {isExpanded ? (
                      <ChevronDown size={14} className="text-neutral-400" />
                    ) : (
                      <ChevronRight size={14} className="text-neutral-400" />
                    )}
                  </div>
                </button>

                {/* Sub-Items inside the clean Menu Name */}
                {isExpanded && (
                  <div className="p-1 pl-3 space-y-0.5 bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800/60">
                    {group.items.map((item) => {
                      const active = isItemActive(item.path);
                      const ItemIcon = item.icon;

                      return (
                        <button
                          key={item.path}
                          type="button"
                          onClick={() => handleNavClick(item.path)}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer group ${
                            active
                              ? "bg-[var(--color-primary)] text-white font-bold shadow-xs"
                              : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <ItemIcon
                              size={13}
                              className={`shrink-0 ${
                                active
                                  ? "text-white"
                                  : "text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200"
                              }`}
                            />
                            <span className="truncate">
                              {isBn ? item.bengaliLabel : item.label}
                            </span>
                          </div>

                          {item.badge && (
                            <span
                              className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded shrink-0 ml-2 ${
                                active
                                  ? "bg-white/20 text-white"
                                  : item.badge === "Official" || item.badge === "Admin"
                                  ? "bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400"
                                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500"
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer with Theme Chooser & User profile */}
        <div className="p-3 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-950/80 space-y-2">
          {/* Theme Chooser Bar */}
          <button
            type="button"
            onClick={() => setIsThemeModalOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-[var(--color-primary)] text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-all cursor-pointer shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <Palette size={14} className="text-[var(--color-primary)]" />
              <span>{isBn ? "কালার থিম পরিবর্তন" : "Change Theme"}</span>
            </div>
            <div className="flex items-center -space-x-1.5">
              <span
                className="w-3.5 h-3.5 rounded-full border border-white dark:border-neutral-900 shadow-xs"
                style={{ backgroundColor: currentTheme.primaryColor }}
              />
              <span
                className="w-3.5 h-3.5 rounded-full border border-white dark:border-neutral-900 shadow-xs"
                style={{ backgroundColor: currentTheme.accentColor }}
              />
            </div>
          </button>

          {/* User profile row */}
          {user && (
            <div className="flex items-center justify-between px-2 py-1">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-full bg-neutral-900 dark:bg-neutral-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {profile?.displayName ? profile.displayName.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                    {profile?.displayName || "Student"}
                  </p>
                  <p className="text-[10px] text-neutral-400 truncate">
                    {profile?.role === "admin" ? "Administrator" : "HSK Student"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => signOut()}
                className="text-[11px] font-semibold text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
              >
                {isBn ? "লগআউট" : "Exit"}
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Theme Chooser Modal */}
      <ThemeChooserModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
      />
    </>
  );
};
