import React, { useState, useEffect } from "react";
import { mistakeService } from "../services/mistakeService";
import { progressService } from "../services/progressService";
import { audioService } from "../services/audioService";
import { bengaliService } from "../services/bengaliService";
import { navigate } from "../services/routerService";
import {
  AlertTriangle,
  Sparkles,
  Zap,
  Target,
  ArrowRight,
  CheckCircle2,
  TrendingDown,
  Layers,
  RotateCcw,
} from "lucide-react";

export const WeakAreaPracticePage: React.FC = () => {
  const [mistakes, setMistakes] = useState(() => mistakeService.getUnresolvedMistakes());
  const [stats, setStats] = useState(() => progressService.getStats());
  const [isBn, setIsBn] = useState(bengaliService.getLanguage() === "bn");

  useEffect(() => {
    const unsubM = mistakeService.subscribe(() => setMistakes(mistakeService.getUnresolvedMistakes()));
    const unsubP = progressService.subscribe(() => setStats(progressService.getStats()));
    const unsubB = bengaliService.subscribe(() => setIsBn(bengaliService.getLanguage() === "bn"));
    return () => {
      unsubM();
      unsubP();
      unsubB();
    };
  }, []);

  // Compute skill-based error concentrations
  const skillErrors = mistakes.reduce((acc, m) => {
    acc[m.skill] = (acc[m.skill] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const weaknesses = [
    {
      skill: "Tone & Phonetics",
      key: "tone",
      errors: skillErrors["tone"] || 0,
      description: "Pitch contour discrimination between 2nd (rising) and 3rd (dipping) tones.",
      actionLabel: "Train in Pinyin Lab",
      route: "/pinyin-lab",
      severity: (skillErrors["tone"] || 0) > 3 ? "high" : "medium",
    },
    {
      skill: "Grammar & Sentence Patterns",
      key: "grammar",
      errors: skillErrors["grammar"] || 0,
      description: "Disposal sentences (把), aspect markers (了, 着, 过), and comparison structures (比).",
      actionLabel: "Drill in Grammar Lab",
      route: "/grammar",
      severity: (skillErrors["grammar"] || 0) > 2 ? "high" : "medium",
    },
    {
      skill: "Acoustic Comprehension",
      key: "listening",
      errors: skillErrors["listening"] || 0,
      description: "Parsing spoken speed, conversational dialogue transitions, and numerical data.",
      actionLabel: "Open Listening Lab",
      route: "/listening-lab",
      severity: (skillErrors["listening"] || 0) > 2 ? "high" : "medium",
    },
    {
      skill: "Vocabulary & Character Recall",
      key: "vocabulary",
      errors: skillErrors["vocabulary"] || 0,
      description: "HSK core vocabulary meaning discrimination and stroke recall.",
      actionLabel: "Review in Flashcards",
      route: "/flashcards",
      severity: (skillErrors["vocabulary"] || 0) > 5 ? "high" : "medium",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Banner */}
      <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 md:p-8 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
              <TrendingDown size={14} />
              <span>AI WEAK AREA DIAGNOSTICS</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight">
              {isBn ? "দুর্বল ক্ষেত্র নিরাময় ও বিশেষ অনুশীলন" : "Targeted Weak Area Drills"}
            </h1>
            <p className="text-xs md:text-sm text-neutral-600 max-w-xl">
              {isBn
                ? "আপনার পূর্ববর্তী ভুল ও কুইজ ফলাফলের ভিত্তিতে দুর্বলতম অংশগুলো চিহ্নিত করে নিরাময়মূলক ড্রিল।"
                : "Real-time diagnostic analysis identifying specific sub-skills where you have recorded the most errors."}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100 text-center shrink-0 min-w-32">
            <div className="text-[10px] text-neutral-400 font-bold uppercase">Pending Weaknesses</div>
            <div className="text-2xl font-extrabold text-amber-600">{mistakes.length} Items</div>
          </div>
        </div>
      </div>

      {/* Weakness Matrix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {weaknesses.map((w) => (
          <div
            key={w.key}
            className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-xs hover:border-amber-300 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-neutral-900">{w.skill}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    w.errors > 0 ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {w.errors > 0 ? `${w.errors} Recorded Errors` : "Proficient (0 Errors)"}
                </span>
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed">
                {w.description}
              </p>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate(w.route)}
                className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>{w.actionLabel}</span>
                <ArrowRight size={13} />
              </button>

              {w.errors > 0 && (
                <button
                  type="button"
                  onClick={() => navigate("/mistake-book")}
                  className="text-xs font-semibold text-rose-600 hover:underline cursor-pointer"
                >
                  View Error Logs
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Direct Mistake Re-Drill Card */}
      {mistakes.length > 0 && (
        <div className="bg-amber-50/60 border border-amber-200/80 rounded-3xl p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <Sparkles size={18} className="text-amber-600" />
            <span>Smart Auto-Remediation Recommendation</span>
          </div>
          <p className="text-xs text-amber-950/80 leading-relaxed max-w-2xl">
            You currently have {mistakes.length} unresolved mistake records. Reviewing them in your Mistake Book or practicing their associated flashcards will yield the highest HSK exam score increase per minute of study.
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/mistake-book")}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Open Mistake Book Now</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
