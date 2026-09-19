import React, { useState } from "react";
import { BookOpen, CheckCircle2, XCircle, Sparkles, Eye, EyeOff } from "lucide-react";
import { ExamQuestion, ExamMode } from "../../types/exam";

interface ReadingQuestionCardProps {
  question: ExamQuestion;
  userAnswer: string;
  onSelectAnswer: (answer: string) => void;
  mode: ExamMode;
  isBn?: boolean;
}

export const ReadingQuestionCard: React.FC<ReadingQuestionCardProps> = ({
  question,
  userAnswer,
  onSelectAnswer,
  mode,
  isBn = false,
}) => {
  const [showPinyin, setShowPinyin] = useState(false);
  const isPractice = mode === "practice";
  const hasAnswered = userAnswer.length > 0;
  const isCorrect = isPractice && hasAnswered && userAnswer === question.correctAnswer;

  return (
    <div className="space-y-6">
      {/* Passage / Context Container */}
      {question.passageZh && (
        <div className="bg-neutral-50 rounded-2xl border border-neutral-200/80 p-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-neutral-500 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <BookOpen size={14} className="text-red-600" />
              {isBn ? "পঠন অনুচ্ছেদ" : "Reading Passage"}
            </span>

            {isPractice && (
              <button
                type="button"
                onClick={() => setShowPinyin(!showPinyin)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-600 hover:text-neutral-900 bg-white px-2 py-1 rounded-md border border-neutral-200"
              >
                {showPinyin ? <EyeOff size={12} /> : <Eye size={12} />}
                <span>{showPinyin ? "Hide Pinyin" : "Show Pinyin"}</span>
              </button>
            )}
          </div>

          <div className="text-base md:text-lg text-neutral-900 leading-relaxed font-sans whitespace-pre-line">
            {question.passageZh}
          </div>

          {isPractice && showPinyin && question.passagePinyin && (
            <div className="text-xs font-mono text-red-600 border-t border-neutral-200/60 pt-2 leading-relaxed">
              {question.passagePinyin}
            </div>
          )}
        </div>
      )}

      {/* Main Question / Sentence Blank */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-neutral-400 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <BookOpen size={14} className="text-red-600" />
            {isBn ? "রিডিং প্রশ্ন" : "Reading Task"}
          </span>
          <span>{question.points} {isBn ? "পয়েন্ট" : "Pts"}</span>
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-neutral-900 leading-snug whitespace-pre-line">
          {question.promptZh}
        </h2>

        {isPractice && (
          <div className="space-y-1 text-sm text-neutral-600 border-t border-neutral-100 pt-2">
            {question.promptPinyin && (
              <p className="font-mono text-red-600 text-xs">{question.promptPinyin}</p>
            )}
            <p className="text-xs text-neutral-600">
              {isBn && question.promptBn ? question.promptBn : question.promptEn}
            </p>
          </div>
        )}
      </div>

      {/* Options List */}
      <div className="space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">
          {isBn ? "বিকল্পসমূহ নির্বাচন করুন:" : "Choose the best answer:"}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {question.options?.map((option) => {
            const isSelected = userAnswer === option.key;
            let optStyle = "bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50";

            if (isPractice && hasAnswered) {
              if (option.key === question.correctAnswer) {
                optStyle = "bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-xs";
              } else if (isSelected) {
                optStyle = "bg-red-50 border-red-500 text-red-950";
              }
            } else if (isSelected) {
              optStyle = "bg-red-50 border-red-600 text-neutral-900 ring-2 ring-red-600 shadow-xs";
            }

            return (
              <button
                key={option.key}
                type="button"
                onClick={() => onSelectAnswer(option.key)}
                className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 cursor-pointer ${optStyle}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                    isSelected ? "bg-red-600 text-white" : "bg-neutral-100 text-neutral-700"
                  }`}
                >
                  {option.key}
                </div>

                <div className="space-y-1 flex-1">
                  <div className="text-base font-semibold text-neutral-900 leading-snug">
                    {option.textZh}
                  </div>
                  {isPractice && option.textPinyin && (
                    <div className="text-xs font-mono text-red-600">{option.textPinyin}</div>
                  )}
                  {isPractice && (option.textEn || option.textBn) && (
                    <div className="text-xs text-neutral-500">
                      {isBn && option.textBn ? option.textBn : option.textEn}
                    </div>
                  )}
                </div>

                {isPractice && hasAnswered && option.key === question.correctAnswer && (
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                )}
                {isPractice && hasAnswered && isSelected && option.key !== question.correctAnswer && (
                  <XCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Practice Explanation */}
      {isPractice && hasAnswered && (
        <div
          className={`p-4 rounded-2xl border transition-all animate-fade-in ${
            isCorrect
              ? "bg-emerald-50/70 border-emerald-200 text-emerald-950"
              : "bg-amber-50/70 border-amber-200 text-amber-950"
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider mb-2">
            <Sparkles size={14} className={isCorrect ? "text-emerald-600" : "text-amber-600"} />
            <span>
              {isCorrect
                ? isBn ? "সঠিক উত্তর!" : "Correct Answer!"
                : isBn ? "সঠিক উত্তর নয়" : "Explanation"}
            </span>
          </div>

          <div className="space-y-1 text-xs leading-relaxed text-neutral-700">
            <p className="font-semibold text-neutral-900">{question.explanationZh}</p>
            <p>{isBn && question.explanationBn ? question.explanationBn : question.explanationEn}</p>
          </div>
        </div>
      )}
    </div>
  );
};
