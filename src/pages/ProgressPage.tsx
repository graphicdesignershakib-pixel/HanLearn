import React, { useState, useEffect } from "react";
import { progressService } from "../services/progressService";
import { ALL_HSK_LEVELS, HSK_OFFICIAL_TARGET_COUNTS, vocabularyService } from "../services/vocabularyService";
import { HSKBadge } from "../components/common/HSKBadge";
import { VocabularyCard } from "../components/vocabulary/VocabularyCard";
import { navigate } from "../services/routerService";
import {
  BarChart3,
  Flame,
  CheckCircle2,
  Clock,
  Award,
  Layers,
  Sparkles,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { HskLevel } from "../types/hsk";

export const ProgressPage: React.FC = () => {
  const [stats, setStats] = useState(() => progressService.getStats());
  const allWords = vocabularyService.getAllWords();
  const progressMap = progressService.getProgressMap();

  useEffect(() => {
    const unsub = progressService.subscribe(() => {
      setStats(progressService.getStats());
    });
    return unsub;
  }, []);

  const now = new Date().toISOString();
  const wordsDue = allWords.filter((w) => {
    const p = progressMap.get(w.id);
    return p && p.nextReviewAt && p.nextReviewAt <= now;
  });

  const wordsLearning = allWords.filter((w) => {
    const p = progressMap.get(w.id);
    return p && p.status === "learning";
  });

  const wordsFamiliar = allWords.filter((w) => {
    const p = progressMap.get(w.id);
    return p && p.status === "familiar";
  });

  const wordsMastered = allWords.filter((w) => {
    const p = progressMap.get(w.id);
    return p && p.status === "mastered";
  });

  const minutesSpent = Math.round(stats.totalTimeSpentMs / 60000);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 flex items-center gap-2">
          <BarChart3 size={28} className="text-red-600" />
          <span>My Progress & Spaced Repetition</span>
        </h1>
        <p className="text-sm text-neutral-600">
          Track vocabulary retention, daily study streaks, and upcoming review intervals.
        </p>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-neutral-200 bg-white space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-semibold">
            <span>STREAK</span>
            <Flame size={16} className="text-amber-500 fill-amber-500" />
          </div>
          <div className="text-3xl font-bold text-neutral-900">{stats.streakDays} days</div>
          <p className="text-xs text-neutral-500">Consecutive study days</p>
        </div>

        <div className="p-5 rounded-2xl border border-neutral-200 bg-white space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-semibold">
            <span>WORDS MASTERED</span>
            <Award size={16} className="text-amber-600" />
          </div>
          <div className="text-3xl font-bold text-neutral-900">{stats.totalWordsMastered}</div>
          <p className="text-xs text-neutral-500">{stats.totalWordsLearned} total words encountered</p>
        </div>

        <div className="p-5 rounded-2xl border border-neutral-200 bg-white space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-semibold">
            <span>REVIEWS DUE</span>
            <Clock size={16} className="text-red-500" />
          </div>
          <div className="text-3xl font-bold text-neutral-900">{wordsDue.length}</div>
          <p className="text-xs text-neutral-500">Spaced repetition queue</p>
        </div>

        <div className="p-5 rounded-2xl border border-neutral-200 bg-white space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-semibold">
            <span>TIME SPENT</span>
            <Sparkles size={16} className="text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-neutral-900">{minutesSpent} min</div>
          <p className="text-xs text-neutral-500">{stats.charactersWrittenCount} characters written</p>
        </div>
      </div>

      {/* Retention Status Distribution */}
      <div className="p-6 rounded-2xl border border-neutral-200 bg-white space-y-4">
        <h3 className="text-base font-bold text-neutral-900">
          Vocabulary Retention Distribution
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 space-y-1">
            <span className="text-xs font-semibold text-neutral-500">New (Unseen)</span>
            <div className="text-2xl font-bold text-neutral-900">
              {allWords.length - (stats.totalWordsLearned || 0)}
            </div>
            <span className="text-[11px] text-neutral-500">Ready to learn</span>
          </div>

          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-1">
            <span className="text-xs font-semibold text-blue-700">Learning</span>
            <div className="text-2xl font-bold text-blue-900">{wordsLearning.length}</div>
            <span className="text-[11px] text-blue-600">Active review</span>
          </div>

          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-1">
            <span className="text-xs font-semibold text-emerald-700">Familiar</span>
            <div className="text-2xl font-bold text-emerald-900">{wordsFamiliar.length}</div>
            <span className="text-[11px] text-emerald-600">High confidence</span>
          </div>

          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-1">
            <span className="text-xs font-semibold text-amber-700">Mastered</span>
            <div className="text-2xl font-bold text-amber-900">{wordsMastered.length}</div>
            <span className="text-[11px] text-amber-600">Long-term interval</span>
          </div>
        </div>
      </div>

      {/* Level-by-Level Breakdown */}
      <div className="p-6 rounded-2xl border border-neutral-200 bg-white space-y-6">
        <h3 className="text-base font-bold text-neutral-900">
          HSK Level Progress Breakdown
        </h3>

        <div className="space-y-4">
          {ALL_HSK_LEVELS.map((lvl) => {
            const words = vocabularyService.getWordsByLevel(lvl);
            const targetCount = HSK_OFFICIAL_TARGET_COUNTS[lvl];
            const prog = stats.levelProgress[lvl];
            const learned = prog?.learned || 0;
            const mastered = prog?.mastered || 0;
            const pct = Math.min(100, Math.round((learned / words.length) * 100));

            return (
              <div key={lvl} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <HSKBadge level={lvl} size="sm" />
                    <span className="font-semibold text-neutral-900">HSK {lvl}</span>
                    <span className="text-neutral-500 font-mono">({targetCount} entries)</span>
                  </div>
                  <div className="font-mono text-neutral-600">
                    <strong className="text-neutral-900">{learned}</strong> learned ·{" "}
                    <strong className="text-neutral-900">{mastered}</strong> mastered ({pct}%)
                  </div>
                </div>

                <div className="w-full h-2.5 rounded-full bg-neutral-100 overflow-hidden">
                  <div
                    className="h-full bg-red-600 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(2, pct)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Spaced Repetition Due Queue */}
      {wordsDue.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-neutral-900">
              Words Due for Review Today ({wordsDue.length})
            </h3>
            <button
              type="button"
              onClick={() => navigate(`/vocabulary/${wordsDue[0].id}`)}
              className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <span>Start Review Session</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {wordsDue.slice(0, 6).map((word) => (
              <VocabularyCard key={word.id} word={word} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
