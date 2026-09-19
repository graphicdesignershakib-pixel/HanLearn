import React, { useState, useEffect } from "react";
import { progressService } from "../services/progressService";
import { ALL_HSK_LEVELS, HSK_OFFICIAL_TARGET_COUNTS, vocabularyService } from "../services/vocabularyService";
import { navigate } from "../services/routerService";
import { bengaliService } from "../services/bengaliService";
import { dailyMissionService } from "../services/dailyMissionService";
import { mistakeService } from "../services/mistakeService";
import {
  Flame,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  BookOpen,
  Star,
  Edit3,
  Volume2,
  ArrowRight,
  TrendingUp,
  Tag,
  Bot,
  Mic,
  FileCheck,
  Split,
  AlertCircle,
  Compass,
  Zap,
  Target,
} from "lucide-react";
import { VocabularyCard } from "../components/vocabulary/VocabularyCard";
import { HSKBadge } from "../components/common/HSKBadge";
import { HskLevel, WORD_CATEGORIES } from "../types/hsk";

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState(() => progressService.getStats());
  const [isBn, setIsBn] = useState(bengaliService.getLanguage() === "bn");
  const [missionState, setMissionState] = useState(() => dailyMissionService.getTodayMission());
  const [unresolvedMistakes, setUnresolvedMistakes] = useState(() => mistakeService.getMistakeStats().unresolved);
  const allWords = vocabularyService.getAllWords();
  const progressMap = progressService.getProgressMap();
  const favorites = progressService.getFavoritesSet();

  useEffect(() => {
    const unsubP = progressService.subscribe(() => {
      setStats(progressService.getStats());
    });
    const unsubB = bengaliService.subscribe(() => {
      setIsBn(bengaliService.getLanguage() === "bn");
    });
    const unsubM = dailyMissionService.subscribe(() => {
      setMissionState(dailyMissionService.getTodayMission());
    });
    const unsubMis = mistakeService.subscribe(() => {
      setUnresolvedMistakes(mistakeService.getMistakeStats().unresolved);
    });
    return () => {
      unsubP();
      unsubB();
      unsubM();
      unsubMis();
    };
  }, []);

  // Words currently in learning or recently reviewed
  const wordsInLearning = allWords.filter((w) => {
    const p = progressMap.get(w.id);
    return p && (p.status === "learning" || p.status === "familiar");
  });

  // Words due for review
  const now = new Date().toISOString();
  const wordsDueForReview = allWords.filter((w) => {
    const p = progressMap.get(w.id);
    return p && p.nextReviewAt && p.nextReviewAt <= now;
  });

  // Next word to study (first unseen word)
  const nextWordToLearn = allWords.find((w) => {
    const p = progressMap.get(w.id);
    return !p || p.status === "unseen";
  }) || allWords[0];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top 4 Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Current Level */}
        <div className="p-5 rounded-2xl border border-neutral-200 bg-white space-y-2">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold">
            <span>CURRENT TARGET</span>
            <Layers size={16} className="text-neutral-400" />
          </div>
          <div className="text-2xl md:text-3xl font-bold text-neutral-900">
            HSK 1
          </div>
          <p className="text-xs text-neutral-500">Foundation vocabulary</p>
        </div>

        {/* Metric 2: Study Streak */}
        <div className="p-5 rounded-2xl border border-neutral-200 bg-white space-y-2">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold">
            <span>DAILY STREAK</span>
            <Flame size={16} className="text-amber-500 fill-amber-500" />
          </div>
          <div className="text-2xl md:text-3xl font-bold text-neutral-900 flex items-baseline gap-1">
            <span>{stats.streakDays}</span>
            <span className="text-xs font-normal text-neutral-500">days</span>
          </div>
          <p className="text-xs text-neutral-500">Keep it up today</p>
        </div>

        {/* Metric 3: Words Learned */}
        <div className="p-5 rounded-2xl border border-neutral-200 bg-white space-y-2">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold">
            <span>WORDS LEARNED</span>
            <CheckCircle2 size={16} className="text-emerald-500" />
          </div>
          <div className="text-2xl md:text-3xl font-bold text-neutral-900">
            {stats.totalWordsLearned}
          </div>
          <p className="text-xs text-neutral-500">
            {stats.totalWordsMastered} mastered
          </p>
        </div>

        {/* Metric 4: Review Due */}
        <div className="p-5 rounded-2xl border border-neutral-200 bg-white space-y-2">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold">
            <span>REVIEWS DUE</span>
            <Clock size={16} className="text-red-500" />
          </div>
          <div className="text-2xl md:text-3xl font-bold text-neutral-900">
            {wordsDueForReview.length}
          </div>
          <p className="text-xs text-neutral-500">
            {wordsDueForReview.length > 0 ? "Ready for spaced repetition" : "All caught up"}
          </p>
        </div>
      </div>

      {/* Daily Mission & Mistakes Quick Action Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Daily Mission Widget */}
        <div
          onClick={() => navigate("/daily-missions")}
          className="md:col-span-2 p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 hover:border-amber-300 transition-all cursor-pointer flex items-center justify-between gap-4 shadow-2xs group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <Flame size={24} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  Today's Ritual Missions
                </span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-amber-200 text-amber-900">
                  {missionState.streakDays} Day Streak
                </span>
              </div>
              <div className="text-sm font-bold text-neutral-900">
                {missionState.tasks.filter((t) => t.completed).length} of {missionState.tasks.length} Daily Objectives Completed
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 shrink-0 group-hover:translate-x-1 transition-transform">
            <span>Open Missions</span>
            <ArrowRight size={14} />
          </div>
        </div>

        {/* Mistakes or Weak Area Alert Card */}
        <div
          onClick={() => navigate(unresolvedMistakes > 0 ? "/mistake-book" : "/learning-path")}
          className="p-5 rounded-2xl bg-white border border-neutral-200 hover:border-red-300 transition-all cursor-pointer flex flex-col justify-between space-y-2 shadow-2xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider">
              {unresolvedMistakes > 0 ? "Diagnostic Alert" : "Curriculum Path"}
            </span>
            {unresolvedMistakes > 0 ? (
              <AlertCircle size={16} className="text-rose-500" />
            ) : (
              <Compass size={16} className="text-red-600" />
            )}
          </div>
          <div>
            <div className="text-base font-bold text-neutral-900">
              {unresolvedMistakes > 0
                ? `${unresolvedMistakes} Unresolved Errors`
                : "HSK 3.0 Roadmap"}
            </div>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              {unresolvedMistakes > 0
                ? "Review missed questions in Mistake Book"
                : "Explore complete Level 1 to 7-9 journey"}
            </p>
          </div>
        </div>
      </div>

      {/* Main Action Section: Continue Learning & Recommended Practice */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Continue Learning Banner */}
        <div className="lg:col-span-7 rounded-2xl border border-neutral-200 bg-white p-6 md:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider bg-red-50 text-red-700 border border-red-200">
                Continue Learning
              </span>
              <HSKBadge level={nextWordToLearn.hskLevel} size="sm" />
            </div>

            <div className="flex items-baseline gap-4 pt-1">
              <span className="text-5xl md:text-6xl font-hanzi font-bold text-neutral-900">
                {nextWordToLearn.hanzi}
              </span>
              <div>
                <span className="text-xl font-mono font-semibold text-neutral-800 block">
                  {nextWordToLearn.pinyinDisplay}
                </span>
                <span className="text-sm text-neutral-500 line-clamp-1">
                  {nextWordToLearn.definitions.map((d) => d.text).join("; ")}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-neutral-100">
            <button
              type="button"
              onClick={() => navigate(`/vocabulary/${nextWordToLearn.id}`)}
              className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors shadow-xs flex items-center gap-2"
            >
              <span>Study Next Word</span>
              <ArrowRight size={16} />
            </button>
            <button
              type="button"
              onClick={() => navigate(`/hsk/${nextWordToLearn.hskLevel}`)}
              className="px-4 py-2.5 rounded-xl bg-neutral-100 text-neutral-700 hover:bg-neutral-200 font-semibold text-sm transition-colors"
            >
              Browse HSK {nextWordToLearn.hskLevel} List
            </button>
          </div>
        </div>

        {/* Recommended Practice Quick Actions */}
        <div className="lg:col-span-5 rounded-2xl border border-neutral-200 bg-white p-6 md:p-8 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-base font-bold text-neutral-900 mb-1 flex items-center gap-2">
              <Sparkles size={18} className="text-red-600" />
              <span>Recommended Practice</span>
            </h3>
            <p className="text-xs text-neutral-500">
              Reinforce pronunciation, tone accuracy, writing, and sentence syntax.
            </p>
          </div>

          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => navigate("/chat")}
              className="w-full p-3 rounded-xl border border-red-200/90 bg-red-50/50 hover:bg-red-100 hover:border-red-300 flex items-center justify-between text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center">
                  <Bot size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-neutral-900 block">AI Chinese Tutor (HanBot)</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-100 text-red-700">AI</span>
                  </div>
                  <span className="text-[11px] text-neutral-500">Conversations, grammar clinic & quizzes</span>
                </div>
              </div>
              <ArrowRight size={14} className="text-red-600" />
            </button>

            <button
              type="button"
              onClick={() => navigate("/practice/tones")}
              className="w-full p-3 rounded-xl border border-neutral-200 bg-neutral-50/50 hover:bg-neutral-100 hover:border-neutral-300 flex items-center justify-between text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Volume2 size={16} />
                </div>
                <div>
                  <span className="text-sm font-semibold text-neutral-900 block">Tone Training</span>
                  <span className="text-[11px] text-neutral-500">Identify & select 1st to 4th tones</span>
                </div>
              </div>
              <ArrowRight size={14} className="text-neutral-400" />
            </button>

            <button
              type="button"
              onClick={() => navigate("/writing")}
              className="w-full p-3 rounded-xl border border-neutral-200 bg-neutral-50/50 hover:bg-neutral-100 hover:border-neutral-300 flex items-center justify-between text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center">
                  <Edit3 size={16} />
                </div>
                <div>
                  <span className="text-sm font-semibold text-neutral-900 block">Hanzi Writing Lab</span>
                  <span className="text-[11px] text-neutral-500">Practice stroke orders on grid</span>
                </div>
              </div>
              <ArrowRight size={14} className="text-neutral-400" />
            </button>

            <button
              type="button"
              onClick={() => navigate("/practice/sentences")}
              className="w-full p-3 rounded-xl border border-neutral-200 bg-neutral-50/50 hover:bg-neutral-100 hover:border-neutral-300 flex items-center justify-between text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <BookOpen size={16} />
                </div>
                <div>
                  <span className="text-sm font-semibold text-neutral-900 block">Sentence Building</span>
                  <span className="text-[11px] text-neutral-500">Reorder tokens into authentic sentences</span>
                </div>
              </div>
              <ArrowRight size={14} className="text-neutral-400" />
            </button>
          </div>
        </div>
      </div>

      {/* HSK Level Progress Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <TrendingUp size={20} className="text-neutral-600" />
            <span>HSK 3.0 Curriculum Overview</span>
          </h3>
          <button
            type="button"
            onClick={() => navigate("/hsk")}
            className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            <span>View All Levels</span>
            <ArrowRight size={12} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ALL_HSK_LEVELS.slice(0, 4).map((lvl) => {
            const words = vocabularyService.getWordsByLevel(lvl);
            const targetCount = HSK_OFFICIAL_TARGET_COUNTS[lvl];
            const prog = stats.levelProgress[lvl];

            return (
              <div
                key={lvl}
                onClick={() => navigate(`/hsk/${lvl}`)}
                className="p-5 rounded-2xl border border-neutral-200 bg-white hover:border-neutral-300 transition-all cursor-pointer space-y-3"
              >
                <div className="flex items-center justify-between">
                  <HSKBadge level={lvl} size="md" />
                  <span className="text-xs font-mono text-neutral-600">
                    {targetCount} words
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-neutral-600">
                    <span>Mastered in app</span>
                    <span className="font-semibold text-neutral-800">{prog?.learned || 0}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                    <div
                      className="h-full bg-red-600 rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, Math.max(5, ((prog?.learned || 0) / words.length) * 100))}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-100 text-xs font-semibold text-red-600 flex items-center justify-between">
                  <span>Start HSK {lvl}</span>
                  <ArrowRight size={12} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Word Categories Section (词类分类) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <Tag size={18} className="text-red-600" />
              <span>Browse by Word Category (词类分类)</span>
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Explore 11,000 official HSK 3.0 words organized by grammatical part of speech.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/vocabulary")}
            className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
          >
            <span>All Categories</span>
            <ArrowRight size={12} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {WORD_CATEGORIES.slice(0, 12).map((cat) => {
            const count = vocabularyService.getWordsByCategory(cat.code).length;
            return (
              <button
                key={cat.code}
                type="button"
                onClick={() => navigate(`/vocabulary?category=${encodeURIComponent(cat.code)}`)}
                className="p-4 rounded-xl border border-neutral-200/80 bg-white hover:border-red-300 hover:shadow-xs text-left transition-all group cursor-pointer flex flex-col justify-between space-y-2"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900 group-hover:text-red-600 transition-colors">
                      {cat.name}
                    </span>
                    <span className="text-sm font-hanzi font-semibold text-neutral-500">
                      {cat.chinese}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
                    {cat.description}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-[11px]">
                  <span className="font-mono text-neutral-600 font-medium">
                    {count.toLocaleString()} words
                  </span>
                  <span className="text-neutral-400 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all">
                    →
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Review Due or Active Learning Words */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-neutral-900">
            {wordsDueForReview.length > 0 ? "Due for Review Today" : "Featured Study Vocabulary"}
          </h3>
          <button
            type="button"
            onClick={() => navigate("/vocabulary")}
            className="text-xs font-semibold text-neutral-600 hover:text-neutral-900"
          >
            Browse all vocabulary →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(wordsDueForReview.length > 0 ? wordsDueForReview : allWords.slice(0, 6)).map((word) => (
            <VocabularyCard key={word.id} word={word} />
          ))}
        </div>
      </div>
    </div>
  );
};
