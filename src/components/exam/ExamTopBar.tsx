import React, { useState } from "react";
import {
  Timer,
  Flag,
  CheckCircle2,
  X,
  AlertTriangle,
  Send,
  HelpCircle,
} from "lucide-react";
import { ExamAttempt, ExamMode, ExamSkill, HskMockExamPaper } from "../../types/exam";
import { HSKBadge } from "../common/HSKBadge";

interface ExamTopBarProps {
  paper: HskMockExamPaper;
  attempt: ExamAttempt;
  currentSection: ExamSkill;
  currentQuestionIndex: number;
  totalQuestions: number;
  timeRemainingSeconds: number;
  isFlagged: boolean;
  onToggleFlag: () => void;
  onSubmitExam: () => void;
  onExitExam: () => void;
  isBn?: boolean;
}

export const ExamTopBar: React.FC<ExamTopBarProps> = ({
  paper,
  attempt,
  currentSection,
  currentQuestionIndex,
  totalQuestions,
  timeRemainingSeconds,
  isFlagged,
  onToggleFlag,
  onSubmitExam,
  onExitExam,
  isBn = false,
}) => {
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Format MM:SS or HH:MM:SS
  const formatTime = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const isLowTime = timeRemainingSeconds <= 300; // Under 5 mins
  const progressPercent = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);

  const answeredCount = (Object.values(attempt.answers) as (typeof attempt.answers)[string][]).filter(
    (a) => a && a.userResponse && a.userResponse.trim().length > 0
  ).length;

  const sectionLabels: Record<ExamSkill, { en: string; zh: string; bn: string }> = {
    listening: { en: "Listening", zh: "听力", bn: "লিসেনিং" },
    reading: { en: "Reading", zh: "阅读", bn: "রিডিং" },
    writing: { en: "Writing", zh: "书写", bn: "রাইটিং" },
    translation: { en: "Translation", zh: "翻译", bn: "অনুবাদ" },
    speaking: { en: "Speaking", zh: "口语", bn: "স্পিকিং" },
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-neutral-200/90 px-4 md:px-6 py-3 shadow-2xs">
        <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto">
          {/* Left: Level, Paper, Section */}
          <div className="flex items-center gap-3">
            <HSKBadge level={paper.hskLevel} size="md" />
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-900 tracking-tight">
                  {paper.paperCode}
                </span>
                <span className="text-[11px] font-semibold px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-600">
                  {attempt.mode === "exam" ? (isBn ? "পরীক্ষা মোড" : "Exam Mode") : (isBn ? "প্র্যাকটিস মোড" : "Practice Mode")}
                </span>
              </div>
              <span className="text-[11px] text-neutral-500 font-medium block">
                {isBn ? sectionLabels[currentSection].bn : sectionLabels[currentSection].en} (Part{" "}
                {paper.questions[currentQuestionIndex]?.sectionPart || 1})
              </span>
            </div>
          </div>

          {/* Center: Question Progress & Timer */}
          <div className="flex items-center gap-4">
            <div className="text-center">
              <span className="text-xs text-neutral-500 font-medium block">
                {isBn ? "প্রশ্ন" : "Question"} {currentQuestionIndex + 1} / {totalQuestions}
              </span>
              <div className="w-24 md:w-36 h-1.5 bg-neutral-100 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-red-600 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Timer Display */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-mono font-bold transition-colors ${
                isLowTime
                  ? "bg-red-50 text-red-700 border-red-200 animate-pulse"
                  : "bg-neutral-50 text-neutral-800 border-neutral-200"
              }`}
              title="Time remaining"
            >
              <Timer size={15} className={isLowTime ? "text-red-600" : "text-neutral-500"} />
              <span>{formatTime(timeRemainingSeconds)}</span>
            </div>
          </div>

          {/* Right Actions: Flag, Submit, Exit */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleFlag}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                isFlagged
                  ? "bg-amber-100 text-amber-900 border-amber-300"
                  : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
              }`}
              title="Flag for review"
            >
              <Flag size={14} className={isFlagged ? "fill-amber-500 text-amber-600" : ""} />
              <span className="hidden md:inline">{isFlagged ? "Flagged" : "Flag"}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowSubmitConfirm(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Send size={13} />
              <span className="hidden sm:inline">{isBn ? "জমা দিন" : "Submit"}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowExitConfirm(true)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
              title="Exit exam"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Submit Confirmation Dialog */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-neutral-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle size={24} />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-bold text-neutral-900">
                {isBn ? "আপনি কি পরীক্ষা জমা দিতে চান?" : "Submit Mock Exam?"}
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {isBn
                  ? `আপনি ${totalQuestions} টির মধ্যে ${answeredCount} টি প্রশ্নের উত্তর দিয়েছেন। জমা দেওয়ার পর উত্তর পরিবর্তন করা যাবে না।`
                  : `You have answered ${answeredCount} of ${totalQuestions} questions. Once submitted, your answers will be scored and locked.`}
              </p>
            </div>

            <div className="bg-neutral-50 rounded-xl p-3 text-xs space-y-1 text-neutral-700">
              <div className="flex justify-between">
                <span>{isBn ? "মোট প্রশ্ন:" : "Total Questions:"}</span>
                <span className="font-semibold">{totalQuestions}</span>
              </div>
              <div className="flex justify-between">
                <span>{isBn ? "উত্তরকৃত প্রশ্ন:" : "Answered:"}</span>
                <span className="font-semibold text-emerald-600">{answeredCount}</span>
              </div>
              <div className="flex justify-between">
                <span>{isBn ? "অনাবৃত প্রশ্ন:" : "Unanswered:"}</span>
                <span className="font-semibold text-amber-600">
                  {totalQuestions - answeredCount}
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-neutral-200 text-neutral-700 font-semibold text-xs hover:bg-neutral-50 transition-colors"
              >
                {isBn ? "ফিরে যান" : "Return to Exam"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSubmitConfirm(false);
                  onSubmitExam();
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-xs hover:bg-red-700 transition-colors shadow-xs"
              >
                {isBn ? "হ্যাঁ, জমা দিন" : "Confirm Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Confirmation Dialog */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-neutral-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <AlertTriangle size={24} />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-bold text-neutral-900">
                {isBn ? "পরীক্ষা থেকে বের হবেন?" : "Leave Active Exam?"}
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {isBn
                  ? "আপনার দেওয়া উত্তরগুলো স্বয়ংক্রিয়ভাবে সংরক্ষিত হয়েছে। তবে পরীক্ষা বাতিল করলে ফলাফল তৈরি হবে না।"
                  : "Your current progress is auto-saved locally. You can resume later or discard this session."}
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-neutral-200 text-neutral-700 font-semibold text-xs hover:bg-neutral-50 transition-colors"
              >
                {isBn ? "পরীক্ষায় থাকুন" : "Keep Testing"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowExitConfirm(false);
                  onExitExam();
                }}
                className="flex-1 py-2.5 rounded-xl bg-neutral-900 text-white font-semibold text-xs hover:bg-neutral-800 transition-colors"
              >
                {isBn ? "প্রস্থান করুন" : "Exit Exam"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
