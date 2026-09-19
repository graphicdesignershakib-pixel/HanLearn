import React from "react";
import { ALL_HSK_LEVELS, HSK_OFFICIAL_TARGET_COUNTS, vocabularyService } from "../services/vocabularyService";
import { progressService } from "../services/progressService";
import { navigate } from "../services/routerService";
import { HSKBadge } from "../components/common/HSKBadge";
import { BookOpen, Layers, ArrowRight, CheckCircle2, FileText } from "lucide-react";
import { HskLevel } from "../types/hsk";

export const HskLevelsPage: React.FC = () => {
  const stats = progressService.getStats();

  const levelDescriptions: Record<HskLevel, string> = {
    "1": "Can understand and use simple Chinese phrases, meeting basic communication needs.",
    "2": "Can communicate simply and directly on daily topics with basic vocabulary.",
    "3": "Can complete daily communicative tasks in life, study, and work in China.",
    "4": "Can discuss a wide range of topics in Chinese and communicate fluently with native speakers.",
    "5": "Can read Chinese newspapers and magazines, enjoy films, and deliver speeches.",
    "6": "Can easily comprehend written and spoken Chinese, expressing ideas fluently in speech and writing.",
    "7-9": "Combined advanced level: can comprehend complex materials, conduct specialized research, and discuss nuanced abstract topics.",
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
          HSK 3.0 Curriculum Levels
        </h1>
        <p className="text-sm text-neutral-600 max-w-2xl leading-relaxed">
          Standardized Chinese proficiency tiers based on the official HSK 3.0 guidelines across seven source datasets totaling 11,000 canonical vocabulary entries.
        </p>
      </div>

      {/* Grid of HSK 1 to HSK 7-9 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ALL_HSK_LEVELS.map((level) => {
          const words = vocabularyService.getWordsByLevel(level);
          const targetCount = HSK_OFFICIAL_TARGET_COUNTS[level];
          const prog = stats.levelProgress[level];
          const isAdvancedCombined = level === "7-9";

          return (
            <div
              key={level}
              className="rounded-2xl border border-neutral-200 bg-white p-6 hover:border-neutral-300 transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HSKBadge level={level} size="lg" />
                    {isAdvancedCombined && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                        Combined Dataset
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-mono font-semibold text-neutral-700">
                    {targetCount} entries
                  </span>
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed">
                  {levelDescriptions[level]}
                </p>

                {/* Progress bar */}
                <div className="space-y-1 pt-2">
                  <div className="flex justify-between text-xs text-neutral-500 font-mono">
                    <span>Mastery Progress</span>
                    <span>
                      {prog?.learned || 0} / {words.length} loaded
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                    <div
                      className="h-full bg-red-600 rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, Math.max(3, ((prog?.learned || 0) / words.length) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => navigate(`/hsk/${level}`)}
                  className="flex-1 py-2 px-3 rounded-xl bg-red-600 text-white hover:bg-red-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <BookOpen size={14} />
                  <span>Start Learning HSK {level}</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate(`/vocabulary?hsk=${level}`)}
                  className="py-2 px-3 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-50 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <FileText size={14} />
                  <span>Vocab</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
