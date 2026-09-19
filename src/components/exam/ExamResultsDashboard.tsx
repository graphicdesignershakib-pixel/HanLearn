import React, { useState } from "react";
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Flag,
  PenTool,
  Volume2,
  BookmarkPlus,
} from "lucide-react";
import { ExamAttempt, ExamSkill, HskMockExamPaper, ExamQuestion } from "../../types/exam";
import { HSKBadge } from "../common/HSKBadge";
import { vocabularyService } from "../../services/vocabularyService";
import { progressService } from "../../services/progressService";
import { navigate } from "../../services/routerService";

interface ExamResultsDashboardProps {
  paper: HskMockExamPaper;
  attempt: ExamAttempt;
  onRetakeExam: () => void;
  onExitToLibrary: () => void;
  isBn?: boolean;
}

export const ExamResultsDashboard: React.FC<ExamResultsDashboardProps> = ({
  paper,
  attempt,
  onRetakeExam,
  onExitToLibrary,
  isBn = false,
}) => {
  const [filterMode, setFilterMode] = useState<"all" | "incorrect" | "flagged">("all");
  const [savedWordIds, setSavedWordIds] = useState<string[]>([]);

  const totalScore = attempt.totalScore || 0;
  const maxScore = paper.maxScore;
  const passingScore = paper.passingScore;
  const isPassed = attempt.passed;

  const formatDuration = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}m ${secs}s`;
  };

  const timeUsed = attempt.durationSeconds - attempt.timeRemainingSeconds;

  // Retrieve vocabulary objects for weak words
  const weakWords = (attempt.weakVocabularyIds || [])
    .map((id) => vocabularyService.getWordById(id))
    .filter(Boolean);

  const handleSaveWord = (wordId: string) => {
    progressService.toggleFavorite(wordId);
    setSavedWordIds((prev) =>
      prev.includes(wordId) ? prev.filter((id) => id !== wordId) : [...prev, wordId]
    );
  };

  // Filtered questions for review
  const reviewQuestions = paper.questions.filter((q) => {
    const ans = attempt.answers[q.id];
    if (filterMode === "incorrect") {
      return !ans || !ans.isCorrect;
    }
    if (filterMode === "flagged") {
      return attempt.flaggedQuestionIds.includes(q.id);
    }
    return true;
  });

  const sectionLabels: Record<ExamSkill, { en: string; zh: string; bn: string }> = {
    listening: { en: "Listening", zh: "听力", bn: "লিসেনিং" },
    reading: { en: "Reading", zh: "阅读", bn: "রিডিং" },
    writing: { en: "Writing", zh: "书写", bn: "রাইটিং" },
    translation: { en: "Translation", zh: "翻译", bn: "অনুবাদ" },
    speaking: { en: "Speaking", zh: "口语", bn: "স্পিকিং" },
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Official Test Score Banner */}
      <div
        className={`rounded-3xl p-6 md:p-8 border shadow-sm transition-all ${
          isPassed
            ? "bg-emerald-950 text-white border-emerald-800/80"
            : "bg-neutral-900 text-white border-neutral-800"
        }`}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <HSKBadge level={paper.hskLevel} size="md" />
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/90">
                {paper.paperCode}
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  isPassed
                    ? "bg-emerald-500 text-emerald-950"
                    : "bg-amber-500 text-amber-950"
                }`}
              >
                {isPassed
                  ? isBn ? "উত্তীর্ণ (PASSED)" : "QUALIFIED / PASSED"
                  : isBn ? "অনুত্তীর্ণ (NOT PASSED)" : "NOT PASSED"}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              {isBn ? paper.titleBn : paper.titleEn}
            </h1>

            <p className="text-xs text-neutral-300 max-w-xl leading-relaxed">
              {isBn
                ? `পাস নম্বর ছিল ${passingScore}/${maxScore}। আপনি পেয়েছেন ${totalScore}।`
                : `Official passing reference: ${passingScore}/${maxScore} points. Total earned: ${totalScore} (${attempt.percentage}%).`}
            </p>

            {/* Estimated Band for HSK 7-9 */}
            {attempt.estimatedHskBand && (
              <div className="inline-block mt-2 px-3 py-1 rounded-xl bg-red-600/30 border border-red-500/40 text-red-200 text-xs font-semibold">
                {isBn ? "আনুমানিক HSK ৩.০ ব্যান্ড:" : "Estimated HSK 3.0 Band:"}{" "}
                <strong className="text-white">{attempt.estimatedHskBand}</strong>
              </div>
            )}
          </div>

          {/* Big Score Display */}
          <div className="shrink-0 flex flex-col items-center bg-white/5 border border-white/10 rounded-2xl p-5 min-w-[160px]">
            <span className="text-xs uppercase font-bold text-neutral-400 tracking-wider">
              {isBn ? "মোট স্কোর" : "Total Score"}
            </span>
            <div className="text-4xl md:text-5xl font-mono font-black text-white my-1">
              {totalScore}
            </div>
            <span className="text-xs text-neutral-400 font-medium">
              {isBn ? "সর্বোচ্চ" : "out of"} {maxScore} pts
            </span>
          </div>
        </div>

        {/* Mandatory Official Disclaimer */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between flex-wrap gap-2 text-[11px] text-neutral-400">
          <div className="flex items-center gap-1.5">
            <AlertCircle size={13} className="text-amber-400 shrink-0" />
            <span>
              {isBn
                ? "অনুশীলন স্কোর / আনুমানিক ফলাফল — এটি অফিশিয়াল HSK সনদ নয়।"
                : "Practice Score / Estimated Result — Not an official Chinese Test Service certificate."}
            </span>
          </div>

          <div className="flex items-center gap-1 font-mono">
            <Clock size={13} />
            <span>{isBn ? "ব্যয়িত সময়:" : "Time used:"} {formatDuration(timeUsed)}</span>
          </div>
        </div>
      </div>

      {/* Skills Breakdown Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {(Object.keys(attempt.sectionScores || {}) as ExamSkill[]).map((skill) => {
          const scoreInfo = attempt.sectionScores?.[skill];
          if (!scoreInfo || scoreInfo.total === 0) return null;

          const isWeak = attempt.weakestSkill === skill;
          const isStrong = attempt.strongestSkill === skill;

          return (
            <div
              key={skill}
              className={`rounded-2xl border p-4 space-y-2 bg-white ${
                isWeak
                  ? "border-amber-300 ring-1 ring-amber-200"
                  : isStrong
                  ? "border-emerald-300 ring-1 ring-emerald-200"
                  : "border-neutral-200"
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold text-neutral-600">
                <span>{isBn ? sectionLabels[skill].bn : sectionLabels[skill].en}</span>
                {isStrong && (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                    Best
                  </span>
                )}
                {isWeak && (
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded">
                    Weak
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-1 font-mono">
                <span className="text-2xl font-black text-neutral-900">{scoreInfo.earned}</span>
                <span className="text-xs text-neutral-400">/ {scoreInfo.total}</span>
              </div>

              {/* Mini progress bar */}
              <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    scoreInfo.percentage >= 60 ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                  style={{ width: `${scoreInfo.percentage}%` }}
                />
              </div>

              <span className="text-[11px] text-neutral-500 font-medium block">
                {scoreInfo.percentage}% {isBn ? "সঠিক" : "accuracy"}
              </span>
            </div>
          );
        })}
      </div>

      {/* Vocabulary Remediation: "Words You Missed" */}
      {weakWords.length > 0 && (
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                <BookmarkPlus size={18} className="text-red-600" />
                <span>{isBn ? "যেসব শব্দ পুনরায় দেখা প্রয়োজন" : "Words You Missed in This Exam"}</span>
              </h2>
              <p className="text-xs text-neutral-500">
                {isBn
                  ? "ভুল হওয়া প্রশ্নগুলোর সাথে সম্পর্কিত শব্দাবলি স্বয়ংক্রিয়ভাবে শনাক্ত করা হয়েছে।"
                  : "Target vocabulary linked to incorrect exam items. Click to bookmark or review."}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => navigate("/flashcards")}
                className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
              >
                <RotateCcw size={13} />
                <span>{isBn ? "ফ্ল্যাশকার্ড ড্রিল" : "Flashcard Drill"}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {weakWords.slice(0, 12).map((word) => {
              const isSaved = savedWordIds.includes(word.id);
              return (
                <div
                  key={word.id}
                  className="p-3 rounded-2xl border border-neutral-200 bg-neutral-50 hover:bg-white hover:border-red-300 transition-all space-y-1.5 group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-lg font-bold text-neutral-900 leading-tight">
                        {word.hanzi}
                      </div>
                      <div className="text-xs font-mono text-red-600">{word.pinyinDisplay}</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSaveWord(word.id)}
                      className={`p-1 rounded-md transition-colors ${
                        isSaved
                          ? "text-red-600 bg-red-50"
                          : "text-neutral-400 hover:text-neutral-700"
                      }`}
                      title="Save to favorites"
                    >
                      <BookmarkPlus size={15} className={isSaved ? "fill-current" : ""} />
                    </button>
                  </div>

                  <p className="text-xs text-neutral-600 line-clamp-1">
                    {word.definitions[0]?.text || "meaning"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Question Review Section with Filters */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 space-y-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">
              {isBn ? "প্রশ্নভিত্তিক বিস্তারিত পর্যালোচনা" : "Question-by-Question Review"}
            </h2>
            <span className="text-xs text-neutral-500">
              {reviewQuestions.length} {isBn ? "টি প্রশ্ন দেখানো হচ্ছে" : "questions displayed"}
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setFilterMode("all")}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterMode === "all" ? "bg-white text-neutral-900 shadow-2xs" : "text-neutral-600"
              }`}
            >
              {isBn ? "সব প্রশ্ন" : "All Questions"}
            </button>
            <button
              type="button"
              onClick={() => setFilterMode("incorrect")}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterMode === "incorrect" ? "bg-white text-neutral-900 shadow-2xs" : "text-neutral-600"
              }`}
            >
              {isBn ? "ভুল উত্তর" : "Incorrect Only"}
            </button>
            <button
              type="button"
              onClick={() => setFilterMode("flagged")}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterMode === "flagged" ? "bg-white text-neutral-900 shadow-2xs" : "text-neutral-600"
              }`}
            >
              {isBn ? "ফ্ল্যাগড" : "Flagged"}
            </button>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {reviewQuestions.map((q) => {
            const ans = attempt.answers[q.id];
            const isCorrect = ans?.isCorrect;
            const isFlagged = attempt.flaggedQuestionIds.includes(q.id);

            return (
              <div
                key={q.id}
                className={`p-5 rounded-2xl border transition-all space-y-3 ${
                  isCorrect
                    ? "border-emerald-200 bg-emerald-50/20"
                    : "border-red-200 bg-red-50/20"
                }`}
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isCorrect
                          ? "bg-emerald-600 text-white"
                          : "bg-red-600 text-white"
                      }`}
                    >
                      {q.questionNumber}
                    </span>
                    <span className="text-xs font-bold uppercase text-neutral-500 tracking-wide">
                      {q.skill} • Part {q.sectionPart}
                    </span>
                    {isFlagged && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md font-semibold">
                        <Flag size={11} className="fill-current" />
                        Flagged
                      </span>
                    )}
                  </div>

                  <div className="text-xs font-mono font-bold text-neutral-700">
                    {ans?.scoreEarned || 0} / {q.points} pts
                  </div>
                </div>

                <div className="text-base font-bold text-neutral-900 leading-snug">
                  {q.promptZh}
                </div>

                {/* Answers Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-neutral-200">
                    <span className="font-semibold text-neutral-500 block mb-1">
                      {isBn ? "আপনার উত্তর:" : "Your Answer:"}
                    </span>
                    <span
                      className={`font-bold ${
                        isCorrect ? "text-emerald-700" : "text-red-600"
                      }`}
                    >
                      {ans?.userResponse || (isBn ? "কোনো উত্তর দেওয়া হয়নি" : "(Unanswered)")}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-neutral-200">
                    <span className="font-semibold text-neutral-500 block mb-1">
                      {isBn ? "সঠিক উত্তর:" : "Correct Answer:"}
                    </span>
                    <span className="font-bold text-emerald-700">{q.correctAnswer}</span>
                  </div>
                </div>

                {/* Explanation */}
                <div className="p-3 rounded-xl bg-white/80 border border-neutral-200 text-xs text-neutral-700 space-y-1">
                  <span className="font-bold text-neutral-900 block">
                    {isBn ? "ব্যাখ্যা ও ব্যাকরণ:" : "Official Explanation:"}
                  </span>
                  <p className="font-medium text-neutral-900">{q.explanationZh}</p>
                  <p className="text-neutral-500">
                    {isBn && q.explanationBn ? q.explanationBn : q.explanationEn}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Sticky-like Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-900 text-white">
        <div>
          <h3 className="text-sm font-bold">{paper.paperCode}</h3>
          <span className="text-xs text-neutral-400">
            {isBn ? "ফলাফল সংরক্ষিত হয়েছে" : "Attempt saved to your learning history"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onRetakeExam}
            className="px-4 py-2.5 rounded-xl border border-neutral-700 hover:bg-neutral-800 text-xs font-semibold text-white transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw size={14} />
            <span>{isBn ? "পুনরায় পরীক্ষা দিন" : "Retake Mock Exam"}</span>
          </button>

          <button
            type="button"
            onClick={onExitToLibrary}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>{isBn ? "মক টেস্ট তালিকায় ফিরুন" : "Back to Exam Library"}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
