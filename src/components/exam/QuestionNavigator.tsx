import React from "react";
import { Flag, CheckCircle2, Circle, Eye } from "lucide-react";
import { ExamQuestion, ExamSkill, UserAnswerRecord } from "../../types/exam";

interface QuestionNavigatorProps {
  questions: ExamQuestion[];
  currentIndex: number;
  answers: Record<string, UserAnswerRecord>;
  flaggedIds: string[];
  visitedIds: string[];
  onSelectIndex: (index: number) => void;
  isBn?: boolean;
}

export const QuestionNavigator: React.FC<QuestionNavigatorProps> = ({
  questions,
  currentIndex,
  answers,
  flaggedIds,
  visitedIds,
  onSelectIndex,
  isBn = false,
}) => {
  const answeredCount = questions.filter(
    (q) => answers[q.id]?.userResponse && answers[q.id].userResponse.trim().length > 0
  ).length;

  const total = questions.length;
  const flaggedCount = flaggedIds.length;

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/90 p-4 space-y-4 shadow-2xs">
      {/* Header & Stats */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
        <div>
          <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
            {isBn ? "প্রশ্ন তালিকা" : "Question Navigator"}
          </h3>
          <span className="text-[11px] text-neutral-500">
            {answeredCount}/{total} {isBn ? "সম্পন্ন" : "Answered"}
          </span>
        </div>
        <div className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
          {Math.round((answeredCount / total) * 100)}%
        </div>
      </div>

      {/* Visual Legend */}
      <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-600">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-emerald-500" />
          <span>{isBn ? "উত্তরকৃত" : "Answered"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-neutral-200" />
          <span>{isBn ? "অনুত্তরকৃত" : "Unanswered"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-amber-100 border border-amber-400" />
          <span>{isBn ? "ফ্ল্যাগড" : "Flagged"} ({flaggedCount})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded ring-2 ring-red-600 bg-white" />
          <span>{isBn ? "বর্তমান" : "Current"}</span>
        </div>
      </div>

      {/* Grid Palette */}
      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-5 lg:grid-cols-6 gap-2 max-h-72 overflow-y-auto pr-1 py-1">
        {questions.map((q, idx) => {
          const isCurrent = idx === currentIndex;
          const isAnswered =
            answers[q.id]?.userResponse && answers[q.id].userResponse.trim().length > 0;
          const isFlagged = flaggedIds.includes(q.id);
          const isVisited = visitedIds.includes(q.id);

          let baseBg = "bg-neutral-100 text-neutral-700 hover:bg-neutral-200";
          if (isAnswered) {
            baseBg = "bg-emerald-600 text-white font-bold hover:bg-emerald-700";
          } else if (isFlagged) {
            baseBg = "bg-amber-100 text-amber-900 border border-amber-400 hover:bg-amber-200";
          } else if (isVisited) {
            baseBg = "bg-neutral-100 text-neutral-900 border border-neutral-300";
          }

          return (
            <button
              key={q.id}
              type="button"
              onClick={() => onSelectIndex(idx)}
              className={`relative h-9 rounded-lg text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${baseBg} ${
                isCurrent ? "ring-2 ring-red-600 ring-offset-1 scale-105 z-10 shadow-xs" : ""
              }`}
              title={`Question ${q.questionNumber} (${q.skill})`}
            >
              <span>{q.questionNumber}</span>
              {isFlagged && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-1 ring-white" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
