import React, { useState, useEffect } from "react";
import { ALL_HSK_LEVELS, HSK_OFFICIAL_TARGET_COUNTS, vocabularyService } from "../services/vocabularyService";
import { progressService } from "../services/progressService";
import { navigate } from "../services/routerService";
import { bengaliService } from "../services/bengaliService";
import {
  Layers,
  CheckCircle2,
  Lock,
  ArrowRight,
  BookOpen,
  Sparkles,
  FileCheck,
  Award,
  ChevronRight,
  Compass,
} from "lucide-react";
import { HskLevel } from "../types/hsk";

interface LevelMilestone {
  level: HskLevel;
  title: string;
  subtitle: string;
  badge: string;
  color: string;
  accentBg: string;
  targetWords: number;
  grammarCount: number;
  listeningHours: number;
  description: string;
  bengaliDesc: string;
}

const LEVEL_MILESTONES: LevelMilestone[] = [
  {
    level: "1",
    title: "HSK Level 1",
    subtitle: "Absolute Beginner",
    badge: "Foundation",
    color: "text-emerald-600 border-emerald-300 bg-emerald-50",
    accentBg: "bg-emerald-600",
    targetWords: 300,
    grammarCount: 15,
    listeningHours: 10,
    description: "Understand and use simple Chinese phrases, meet basic daily communicative needs, and establish strong Pinyin tone reflexes.",
    bengaliDesc: "মৌলিক চীনা শব্দমালা ও বাক্যাংশ, দৈনন্দিন পরিচয় ও প্রাথমিক টোন আয়ত্ত করুন।",
  },
  {
    level: "2",
    title: "HSK Level 2",
    subtitle: "Elementary Communicator",
    badge: "Basic Fluency",
    color: "text-teal-600 border-teal-300 bg-teal-50",
    accentBg: "bg-teal-600",
    targetWords: 200,
    grammarCount: 25,
    listeningHours: 20,
    description: "Communicate in simple and routine tasks requiring a direct exchange of information on familiar everyday matters.",
    bengaliDesc: "দৈনন্দিন সাধারণ কাজ ও নিয়মিত বিষয়ে সাবলীলভাবে যোগাযোগ স্থাপন করুন।",
  },
  {
    level: "3",
    title: "HSK Level 3",
    subtitle: "Intermediate Speaker",
    badge: "Core Fluency",
    color: "text-blue-600 border-blue-300 bg-blue-50",
    accentBg: "bg-blue-600",
    targetWords: 500,
    grammarCount: 40,
    listeningHours: 35,
    description: "Communicate in Chinese at a basic level in their daily, academic and professional lives. Travel comfortably in China.",
    bengaliDesc: "দৈনন্দিন জীবন, পড়াশোনা ও ভ্রমণে অনায়াসে চীনা ভাষা ব্যবহার করুন।",
  },
  {
    level: "4",
    title: "HSK Level 4",
    subtitle: "Independent Conversationalist",
    badge: "Professional Gateway",
    color: "text-indigo-600 border-indigo-300 bg-indigo-50",
    accentBg: "bg-indigo-600",
    targetWords: 1000,
    grammarCount: 65,
    listeningHours: 60,
    description: "Discuss a relatively wide range of topics in Chinese and are capable of communicating with native Chinese speakers at a high standard.",
    bengaliDesc: "নেটিভ স্পিকারদের সাথে বিভিন্ন বিষয়ে জটিল আলোচনা ও কর্মক্ষেত্রে যোগাযোগ।",
  },
  {
    level: "5",
    title: "HSK Level 5",
    subtitle: "Advanced Fluency",
    badge: "Academic Level",
    color: "text-violet-600 border-violet-300 bg-violet-50",
    accentBg: "bg-violet-600",
    targetWords: 1600,
    grammarCount: 90,
    listeningHours: 100,
    description: "Read Chinese newspapers and magazines, enjoy Chinese films and plays, and write a full-length speech in Chinese.",
    bengaliDesc: "সংবাদপত্র, সাহিত্য ও চলচ্চিত্র বোঝা এবং সম্পূর্ণ চীনা ভাষায় বক্তৃতা প্রদান।",
  },
  {
    level: "6",
    title: "HSK Level 6",
    subtitle: "Mastery & Native Parity",
    badge: "Near-Native",
    color: "text-rose-600 border-rose-300 bg-rose-50",
    accentBg: "bg-rose-600",
    targetWords: 1800,
    grammarCount: 120,
    listeningHours: 150,
    description: "Easily comprehend written and spoken information in Chinese and express themselves smoothly in both written and oral forms.",
    bengaliDesc: "উচ্চাঙ্গের সাহিত্য, প্রাতিষ্ঠানিক গবেষণা এবং পেশাদার অনুবাদে দক্ষতা।",
  },
  {
    level: "7-9",
    title: "HSK Level 7-9",
    subtitle: "Scholarly & Professional",
    badge: "Highest Band",
    color: "text-amber-600 border-amber-300 bg-amber-50",
    accentBg: "bg-amber-600",
    targetWords: 5600,
    grammarCount: 180,
    listeningHours: 300,
    description: "Comprehensive mastery in academic discourse, literature, simultaneous interpretation, and high-level official diplomacy.",
    bengaliDesc: "গবেষণা, আনুষ্ঠানিক কূটনীতি এবং সাহিত্যের সর্বোচ্চ পর্যায়ে সম্পূর্ণ দক্ষতা।",
  },
];

export const HskLearningPathPage: React.FC = () => {
  const [stats, setStats] = useState(() => progressService.getStats());
  const [isBn, setIsBn] = useState(bengaliService.getLanguage() === "bn");

  useEffect(() => {
    const unsubP = progressService.subscribe(() => setStats(progressService.getStats()));
    const unsubB = bengaliService.subscribe(() => setIsBn(bengaliService.getLanguage() === "bn"));
    return () => {
      unsubP();
      unsubB();
    };
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold tracking-wide">
              <Compass size={14} />
              <span>OFFICIAL HSK 3.0 ROADMAP (2026-2027)</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {isBn ? "এইচএসকে ৩.০ সম্পূর্ণ শিক্ষা পথরেখা" : "HSK 3.0 Progressive Learning Journey"}
            </h1>
            <p className="text-white/90 text-sm leading-relaxed">
              {isBn
                ? "লেভেল ১ থেকে ৭-৯ পর্যন্ত সুবিন্যস্ত ধাপ। শব্দভাণ্ডার, ব্যাকরণ, লিসেনিং, রিডিং ও লেখার সার্বিক দক্ষতা অর্জন করুন।"
                : "Master all competencies step-by-step from beginner to scholarly mastery. Track your official vocabulary counts, grammar milestones, and mock exam readiness."}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/exam")}
              className="px-5 py-2.5 rounded-xl bg-white text-neutral-900 font-bold text-xs hover:bg-neutral-100 transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <FileCheck size={16} className="text-red-600" />
              <span>{isBn ? "মক টেস্ট দিন" : "Take Mock Exam"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Roadmap Vertical Node Timeline */}
      <div className="relative pl-6 md:pl-8 border-l-2 border-dashed border-neutral-200 ml-4 space-y-8">
        {LEVEL_MILESTONES.map((mile, idx) => {
          const userProg = stats.levelProgress[mile.level] || { total: 0, learned: 0, mastered: 0 };
          const officialTarget = HSK_OFFICIAL_TARGET_COUNTS[mile.level] || mile.targetWords;
          const pct = Math.min(100, Math.round(((userProg.learned || 0) / officialTarget) * 100));
          const isCurrentTarget = mile.level === "1" || (idx > 0 && (stats.levelProgress[LEVEL_MILESTONES[idx - 1].level]?.learned || 0) > 20);

          return (
            <div key={mile.level} className="relative group">
              {/* Node Dot */}
              <div
                className={`absolute -left-[37px] md:-left-[45px] top-4 w-7 h-7 rounded-full border-4 border-white flex items-center justify-center font-bold text-xs shadow-xs ${
                  pct >= 80 ? "bg-emerald-500 text-white" : isCurrentTarget ? "bg-red-600 text-white ring-4 ring-red-100" : "bg-neutral-200 text-neutral-600"
                }`}
              >
                {pct >= 80 ? <CheckCircle2 size={14} /> : mile.level}
              </div>

              {/* Milestone Card */}
              <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 md:p-6 shadow-xs hover:shadow-md transition-all space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${mile.color}`}>
                        {mile.badge}
                      </span>
                      {isCurrentTarget && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800">
                          Active Target
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
                      <span>{mile.title}</span>
                      <span className="text-sm font-normal text-neutral-500">· {mile.subtitle}</span>
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => navigate(`/hsk/${mile.level}`)}
                      className="px-3.5 py-1.5 rounded-lg border border-neutral-200 hover:border-neutral-300 text-neutral-700 text-xs font-semibold hover:bg-neutral-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <BookOpen size={14} />
                      <span>{isBn ? "শব্দ তালিকা" : "Vocabulary List"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(`/exam?level=${mile.level}`)}
                      className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <span>{isBn ? "লেভেল মক" : "Level Mock"}</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed">
                  {isBn ? mile.bengaliDesc : mile.description}
                </p>

                {/* Progress bar and specifications */}
                <div className="space-y-2 pt-2 border-t border-neutral-100">
                  <div className="flex items-center justify-between text-xs text-neutral-600">
                    <span className="font-medium">
                      {isBn ? "শব্দ আয়ত্তকরণ:" : "Vocabulary Progress:"}{" "}
                      <strong className="text-neutral-900">{userProg.learned || 0}</strong> / {officialTarget} words
                    </span>
                    <span className="font-bold text-neutral-900">{pct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${mile.accentBg}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* 3 Core Skill Pills */}
                <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                  <div className="p-2 rounded-xl bg-neutral-50 border border-neutral-100">
                    <div className="text-[10px] text-neutral-600 uppercase font-semibold">Vocabulary</div>
                    <div className="text-xs font-bold text-neutral-900 mt-0.5">{officialTarget} Words</div>
                  </div>
                  <div className="p-2 rounded-xl bg-neutral-50 border border-neutral-100">
                    <div className="text-[10px] text-neutral-600 uppercase font-semibold">Grammar</div>
                    <div className="text-xs font-bold text-neutral-900 mt-0.5">{mile.grammarCount} Points</div>
                  </div>
                  <div className="p-2 rounded-xl bg-neutral-50 border border-neutral-100">
                    <div className="text-[10px] text-neutral-600 uppercase font-semibold">Listening</div>
                    <div className="text-xs font-bold text-neutral-900 mt-0.5">{mile.listeningHours}+ Hours</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
