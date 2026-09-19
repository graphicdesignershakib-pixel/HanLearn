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
  CheckCircle2,
  GitFork,
  ShieldCheck,
  FolderPlus,
} from "lucide-react";
import { navigate } from "../../services/routerService";
import { bengaliService } from "../../services/bengaliService";
import { mistakeService } from "../../services/mistakeService";
import { dailyMissionService } from "../../services/dailyMissionService";
import { useAuth } from "../../context/AuthContext";

interface SidebarProps {
  currentPath: string;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

interface NavSection {
  title: string;
  bengaliTitle: string;
  items: {
    label: string;
    bengaliLabel: string;
    path: string;
    icon: React.ElementType;
    badge?: string;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { isAdmin } = useAuth();
  const [isBn, setIsBn] = useState(bengaliService.getLanguage() === "bn");
  const [unresolvedMistakes, setUnresolvedMistakes] = useState(0);

  useEffect(() => {
    const unsubB = bengaliService.subscribe(() => {
      setIsBn(bengaliService.getLanguage() === "bn");
    });
    const updateMistakes = () => {
      setUnresolvedMistakes(mistakeService.getMistakeStats().unresolved);
    };
    updateMistakes();
    const unsubM = mistakeService.subscribe(updateMistakes);

    return () => {
      unsubB();
      unsubM();
    };
  }, []);

  const navSections: NavSection[] = [
    {
      title: "LEARN",
      bengaliTitle: "শিক্ষা",
      items: [
        {
          label: "HSK Learning Path",
          bengaliLabel: "এইচএসকে শিক্ষা পথরেখা",
          path: "/learning-path",
          icon: Compass,
          badge: "3.0",
        },
        {
          label: "Vocabulary Master",
          bengaliLabel: "শব্দকোষ (Vocabulary)",
          path: "/vocabulary",
          icon: BookMarked,
        },
        {
          label: "HSK Levels",
          bengaliLabel: "এইচএসকে লেভেলসমূহ",
          path: "/hsk",
          icon: Layers,
        },
        {
          label: "Grammar Lab",
          bengaliLabel: "ব্যাকরণ ল্যাব (Grammar)",
          path: "/grammar",
          icon: BookOpen,
          badge: "NEW",
        },
        {
          label: "Pinyin & Phonetics",
          bengaliLabel: "পিনয়িন ও উচ্চারণ",
          path: "/pinyin-lab",
          icon: Volume2,
        },
        {
          label: "Radicals & Hanzi",
          bengaliLabel: "র‌্যাডিক্যাল ও বর্ণ বিশ্লেষণ",
          path: "/radicals",
          icon: Split,
        },
        {
          label: "Etymology Tree",
          bengaliLabel: "অক্ষর ভাঙন ও শব্দমূল বৃক্ষ",
          path: "/etymology",
          icon: GitFork,
          badge: "NEW",
        },
        {
          label: "Graded Stories",
          bengaliLabel: "চাইনিজ ছোট গল্প",
          path: "/stories",
          icon: BookOpen,
        },
        {
          label: "Learning Resources",
          bengaliLabel: "রিসোর্স লাইব্রেরি",
          path: "/resources",
          icon: BookOpen,
          badge: "Live",
        },
      ],
    },
    {
      title: "PRACTICE",
      bengaliTitle: "অনুশীলন",
      items: [
        {
          label: "Practice Hub",
          bengaliLabel: "অনুশীলন কেন্দ্র",
          path: "/practice",
          icon: Sparkles,
        },
        {
          label: "Sentence Builder",
          bengaliLabel: "বাক্য গঠন ল্যাব",
          path: "/sentence-builder",
          icon: Sparkles,
          badge: "NEW",
        },
        {
          label: "Dictation Lab",
          bengaliLabel: "শ্রুতলিপি ল্যাব",
          path: "/dictation",
          icon: Headphones,
        },
        {
          label: "Listening Lab",
          bengaliLabel: "শ্রবণ ল্যাব",
          path: "/listening-lab",
          icon: Headphones,
        },
        {
          label: "Graded Reading",
          bengaliLabel: "পঠন ল্যাব",
          path: "/reading-lab",
          icon: BookOpen,
        },
        {
          label: "Writing Lab",
          bengaliLabel: "হানজি লেখা (Writing)",
          path: "/writing",
          icon: Edit3,
        },
        {
          label: "Tone Practice",
          bengaliLabel: "টোন অনুশীলন",
          path: "/practice/tones",
          icon: Volume2,
        },
        {
          label: "SRS Flashcards",
          bengaliLabel: "SRS ফ্ল্যাশকার্ড",
          path: "/flashcards",
          icon: Layers,
          badge: "SM-2",
        },
      ],
    },
    {
      title: "EXAMS & TESTS",
      bengaliTitle: "মক টেস্ট ও পরীক্ষা",
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
      ],
    },
    {
      title: "SMART & AI LEARNING",
      bengaliTitle: "স্মার্ট ও এআই শিক্ষা",
      items: [
        {
          label: "AI Tutor (HanBot)",
          bengaliLabel: "এআই টিউটর (হানবট)",
          path: "/chat",
          icon: Bot,
          badge: "AI",
        },
        {
          label: "AI Conversation",
          bengaliLabel: "বাস্তবধর্মী কথপোকথন",
          path: "/ai-conversation",
          icon: MessageSquare,
          badge: "Live",
        },
        {
          label: "AI Speaking Lab",
          bengaliLabel: "এআই স্পিকিং ল্যাব",
          path: "/speaking",
          icon: Mic,
        },
        {
          label: "Mistake Book",
          bengaliLabel: "ভুল সংশোধন বই",
          path: "/mistake-book",
          icon: AlertCircle,
          badge: unresolvedMistakes > 0 ? `${unresolvedMistakes}` : undefined,
        },
        {
          label: "Weak Area Drills",
          bengaliLabel: "দুর্বল ক্ষেত্র নিরাময়",
          path: "/weak-areas",
          icon: TrendingDown,
        },
      ],
    },
    {
      title: "DISCOVER",
      bengaliTitle: "আবিষ্কার",
      items: [
        {
          label: "Everyday Chinese",
          bengaliLabel: "বাস্তব জীবনের চীনা",
          path: "/real-life",
          icon: Compass,
        },
        {
          label: "Chinese Culture",
          bengaliLabel: "চীনা সংস্কৃতি ও ঐতিহ্য",
          path: "/culture",
          icon: BookOpen,
        },
      ],
    },
    {
      title: "PERSONAL",
      bengaliTitle: "ব্যক্তিগত",
      items: [
        {
          label: "Dashboard",
          bengaliLabel: "ড্যাশবোর্ড",
          path: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          label: "Daily Missions",
          bengaliLabel: "দৈনিক মিশন",
          path: "/daily-missions",
          icon: Flame,
          badge: "Streak",
        },
        {
          label: "Study Planner",
          bengaliLabel: "পড়াশোনার পরিকল্পনা",
          path: "/study-plan",
          icon: Calendar,
        },
        {
          label: "Saved Words",
          bengaliLabel: "সংরক্ষিত শব্দ",
          path: "/saved",
          icon: Star,
        },
        {
          label: "My Progress",
          bengaliLabel: "অগ্রগতি চার্ট",
          path: "/progress",
          icon: BarChart3,
        },
        {
          label: "Settings",
          bengaliLabel: "সেটিংস",
          path: "/settings",
          icon: Settings,
        },
        ...(isAdmin
          ? [
              {
                label: "Admin Resources",
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

  const handleNavClick = (path: string) => {
    navigate(path);
    if (onCloseMobile) onCloseMobile();
  };

  const isActive = (path: string) => {
    if (path === "/dashboard") return currentPath === "/" || currentPath === "/dashboard";
    return currentPath === path || currentPath.startsWith(path + "/");
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-neutral-950/30 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 border-r border-neutral-200/80 bg-white flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:z-auto ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* HanLearn Logo */}
        <div className="h-16 flex items-center px-6 border-b border-neutral-100 shrink-0">
          <div
            onClick={() => handleNavClick("/dashboard")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold font-hanzi text-base shadow-xs group-hover:bg-red-700 transition-colors">
              汉
            </div>
            <div>
              <span className="font-extrabold text-neutral-900 tracking-tight text-base block leading-none">
                HanLearn
              </span>
              <span className="text-[10px] font-bold text-red-600 tracking-wider block mt-0.5">
                HSK 3.0 PLATFORM
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="px-3 pb-1 text-[10px] font-extrabold text-neutral-600 uppercase tracking-wider">
                {isBn ? section.bengaliTitle : section.title}
              </div>

              {section.items.map((item) => {
                const active = isActive(item.path);
                const Icon = item.icon;

                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => handleNavClick(item.path)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      active
                        ? "bg-red-50 text-red-700 font-bold shadow-2xs"
                        : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon
                        size={16}
                        className={active ? "text-red-600" : "text-neutral-600"}
                      />
                      <span className="truncate">
                        {isBn ? item.bengaliLabel : item.label}
                      </span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
                          active
                            ? "bg-red-200 text-red-900"
                            : item.badge === "NEW"
                            ? "bg-emerald-100 text-emerald-800"
                            : item.badge === "Official"
                            ? "bg-amber-100 text-amber-900"
                            : "bg-neutral-100 text-neutral-600"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer info badge */}
        <div className="p-3 border-t border-neutral-100 shrink-0 text-center">
          <div className="text-[10px] text-neutral-600">
            Official HSK 3.0 Standard · 2026-2027
          </div>
        </div>
      </aside>
    </>
  );
};
