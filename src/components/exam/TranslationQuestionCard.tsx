import React from "react";
import { Languages, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { ExamQuestion, ExamMode } from "../../types/exam";

interface TranslationQuestionCardProps {
  question: ExamQuestion;
  userAnswer: string;
  onUpdateAnswer: (answer: string) => void;
  mode: ExamMode;
  isBn?: boolean;
}

export const TranslationQuestionCard: React.FC<TranslationQuestionCardProps> = ({
  question,
  userAnswer,
  onUpdateAnswer,
  mode,
  isBn = false,
}) => {
  const isPractice = mode === "practice";

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-neutral-400 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Languages size={14} className="text-red-600" />
            {isBn ? "অনুবাদ (ট্রান্সলেশন) প্রশ্ন" : "Advanced Translation Task (HSK 7-9)"}
          </span>
          <span>{question.points} {isBn ? "পয়েন্ট" : "Pts"}</span>
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-neutral-900 leading-snug">
          {question.promptZh}
        </h2>

        {isPractice && (
          <p className="text-xs text-neutral-600 border-t border-neutral-100 pt-2 leading-relaxed">
            {isBn && question.promptBn ? question.promptBn : question.promptEn}
          </p>
        )}
      </div>

      {/* Source Text Box */}
      <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-5 space-y-2">
        <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
          {isBn ? "মূল ইংরেজি অনুচ্ছেদ (Source Text):" : "Source Text (English):"}
        </span>
        <p className="text-base md:text-lg text-neutral-800 leading-relaxed font-serif">
          "{question.translationSourceText || question.promptEn}"
        </p>
      </div>

      {/* User Translation Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-500">
          <span>{isBn ? "আপনার চীনা অনুবাদ লিখুন:" : "Your Chinese Translation:"}</span>
          <span className="font-mono text-neutral-400">
            {userAnswer.length} {isBn ? "অক্ষর" : "Chars"}
          </span>
        </div>

        <textarea
          rows={6}
          value={userAnswer}
          onChange={(e) => onUpdateAnswer(e.target.value)}
          placeholder={
            isBn
              ? "এখানে প্রমিত আধুনিক চীনা ভাষায় অনুবাদ লিখুন..."
              : "Type your standard written Chinese translation here..."
          }
          className="w-full p-4 rounded-xl border border-neutral-200 focus:border-red-600 focus:ring-2 focus:ring-red-100 text-base leading-relaxed"
        />
      </div>

      {/* Practice Mode Model Translation & Criteria */}
      {isPractice && userAnswer && (
        <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3 animate-fade-in text-xs text-neutral-700">
          <div className="flex items-center gap-1.5 font-bold text-neutral-900 uppercase tracking-wider">
            <Sparkles size={14} className="text-amber-500" />
            <span>{isBn ? "আদর্শ অনুবাদ ও মূল্যায়ন মাপকাঠি:" : "Reference Translation & Evaluation Criteria:"}</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-neutral-200 text-sm font-semibold text-neutral-900 leading-relaxed">
            {question.referenceAnswer}
          </div>

          {question.evaluationCriteria && question.evaluationCriteria.length > 0 && (
            <div className="space-y-1">
              <span className="font-semibold text-neutral-900 block">
                {isBn ? "মূল্যায়ন নির্দেশিকা:" : "Scoring Rubric:"}
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-neutral-600">
                {question.evaluationCriteria.map((crit, idx) => (
                  <li key={idx}>{crit}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Disclaimer */}
      <div className="flex items-start gap-2 p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-500 text-xs leading-relaxed">
        <AlertCircle size={15} className="shrink-0 mt-0.5 text-neutral-400" />
        <p>
          {isBn
            ? "HSK ৭-৯ উচ্চতর অনুবাদের ফলাফল অনুমানের ভিত্তিতে তৈরি। এটি আনুষ্ঠানিক সি-টেস্ট ফলাফল নয়।"
            : "HSK 7-9 Translation evaluation is calibrated for diagnostic self-study. Official certification is conducted solely by Chinese Test Service examination centers."}
        </p>
      </div>
    </div>
  );
};
