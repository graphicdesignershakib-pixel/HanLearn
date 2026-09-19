import React from "react";
import { CheckCircle2, XCircle, Volume2, Sparkles, BookOpen } from "lucide-react";
import { ExamQuestion, ExamMode } from "../../types/exam";
import { AudioQuestionPlayer } from "./AudioQuestionPlayer";

interface ListeningQuestionCardProps {
  question: ExamQuestion;
  userAnswer: string;
  onSelectAnswer: (answer: string) => void;
  mode: ExamMode;
  isBn?: boolean;
}

export const ListeningQuestionCard: React.FC<ListeningQuestionCardProps> = ({
  question,
  userAnswer,
  onSelectAnswer,
  mode,
  isBn = false,
}) => {
  const isPractice = mode === "practice";
  const hasAnswered = userAnswer.length > 0;
  const isCorrect = isPractice && hasAnswered && userAnswer === question.correctAnswer;
  const isIncorrect = isPractice && hasAnswered && userAnswer !== question.correctAnswer;

  return (
    <div className="space-y-6">
      {/* Audio Engine */}
      {question.audioScript && (
        <AudioQuestionPlayer
          audioScript={question.audioScript}
          durationSeconds={question.audioDurationSeconds || 5}
          mode={mode}
          maxReplays={mode === "exam" ? (parseInt(question.level) >= 4 ? 1 : 2) : 99}
          isBn={isBn}
        />
      )}

      {/* Prompt Question */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 p-5 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 uppercase tracking-wider">
          <Volume2 size={15} className="text-red-600" />
          <span>{isBn ? "লিসেনিং প্রশ্ন" : "Listening Task"}</span>
          <span className="text-neutral-300">•</span>
          <span>{question.points} {isBn ? "পয়েন্ট" : "Pts"}</span>
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-neutral-900 leading-snug">
          {question.promptZh}
        </h2>

        {/* In Practice Mode: show Pinyin & Translation */}
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

      {/* Multiple Choice Options */}
      <div className="space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">
          {isBn ? "বিকল্পসমূহ নির্বাচন করুন:" : "Select an Option:"}
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
                    isSelected
                      ? "bg-red-600 text-white"
                      : "bg-neutral-100 text-neutral-700"
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

      {/* Practice Mode Feedback & Explanation */}
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
                : isBn ? "সঠিক উত্তর নয়" : "Incorrect"}
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
