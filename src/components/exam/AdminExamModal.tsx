import React, { useState } from "react";
import {
  X,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  Filter,
  ShieldCheck,
  Eye,
} from "lucide-react";
import { ExamQuestion, ExamSkill, QuestionStatus } from "../../types/exam";
import { questionBankService } from "../../services/exam/questionBankService";
import { HskLevel } from "../../types/hsk";
import { HSKBadge } from "../common/HSKBadge";

interface AdminExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  isBn?: boolean;
}

export const AdminExamModal: React.FC<AdminExamModalProps> = ({
  isOpen,
  onClose,
  isBn = false,
}) => {
  const [levelFilter, setLevelFilter] = useState<HskLevel | "all">("1");
  const [skillFilter, setSkillFilter] = useState<ExamSkill | "all">("all");
  const [viewTab, setViewTab] = useState<"questions" | "ai_queue">("questions");
  const [editingQuestion, setEditingQuestion] = useState<ExamQuestion | null>(null);

  if (!isOpen) return null;

  const allPapers = questionBankService.getAllPapers();
  let questionsPool: ExamQuestion[] = [];
  allPapers.forEach((p) => questionsPool.push(...p.questions));

  // Deduplicate
  const uniqueMap = new Map<string, ExamQuestion>();
  questionsPool.forEach((q) => uniqueMap.set(q.id, q));
  const uniqueQuestions = Array.from(uniqueMap.values());

  const aiQueue = questionBankService.getAiReviewQueue();

  const filteredQuestions = uniqueQuestions.filter((q) => {
    if (levelFilter !== "all" && q.level !== levelFilter) return false;
    if (skillFilter !== "all" && q.skill !== skillFilter) return false;
    return true;
  });

  const handlePublish = (qId: string) => {
    questionBankService.updateQuestion(qId, { status: "published" });
  };

  const handleDelete = (qId: string) => {
    if (confirm(isBn ? "আপনি কি এই প্রশ্নটি মুছে ফেলতে চান?" : "Delete this exam question?")) {
      questionBankService.deleteQuestion(qId);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion) return;
    questionBankService.updateQuestion(editingQuestion.id, editingQuestion);
    setEditingQuestion(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-neutral-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900">
                {isBn ? "HSK ৩.০ পরীক্ষা ব্যবস্থাপনা ও প্রশ্নভান্ডার" : "HSK 3.0 Exam Bank & Item Management"}
              </h2>
              <p className="text-xs text-neutral-500">
                {isBn
                  ? "প্রশ্ন সম্পাদনা, এআই নির্মিত প্রশ্ন যাচাই ও অনুমোদন এবং প্রকাশনা নিয়ন্ত্রণ"
                  : "Item bank oversight, AI question review queue, and official syllabus alignment"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Top Control Tabs */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-neutral-100 bg-neutral-50/70">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setViewTab("questions")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                viewTab === "questions"
                  ? "bg-neutral-900 text-white shadow-xs"
                  : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
              }`}
            >
              {isBn ? "প্রশ্নভান্ডার (Item Bank)" : "Item Bank"} ({uniqueQuestions.length})
            </button>

            <button
              type="button"
              onClick={() => setViewTab("ai_queue")}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                viewTab === "ai_queue"
                  ? "bg-neutral-900 text-white shadow-xs"
                  : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
              }`}
            >
              <Sparkles size={13} className="text-amber-500" />
              <span>{isBn ? "এআই পর্যালোচনা কিউ" : "AI Review Queue"}</span>
              <span className="bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full text-[10px]">
                {aiQueue.length}
              </span>
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value as any)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-neutral-200 bg-white"
            >
              <option value="all">{isBn ? "সব লেভেল" : "All Levels"}</option>
              <option value="1">HSK 1</option>
              <option value="2">HSK 2</option>
              <option value="3">HSK 3</option>
              <option value="4">HSK 4</option>
              <option value="5">HSK 5</option>
              <option value="6">HSK 6</option>
              <option value="7-9">HSK 7-9</option>
            </select>

            <select
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value as any)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-neutral-200 bg-white"
            >
              <option value="all">{isBn ? "সব দক্ষতা" : "All Skills"}</option>
              <option value="listening">Listening</option>
              <option value="reading">Reading</option>
              <option value="writing">Writing</option>
              <option value="translation">Translation</option>
              <option value="speaking">Speaking</option>
            </select>
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {viewTab === "ai_queue" && aiQueue.length === 0 && (
            <div className="text-center py-12 space-y-2">
              <CheckCircle2 size={36} className="text-emerald-500 mx-auto" />
              <p className="text-sm font-semibold text-neutral-700">
                {isBn ? "পর্যালোচনার জন্য কোনো এআই প্রশ্ন অবশিষ্ট নেই" : "AI Review Queue is all cleared!"}
              </p>
              <p className="text-xs text-neutral-400">
                {isBn
                  ? "সমস্ত প্রশ্ন শিক্ষকমণ্ডলী দ্বারা যাচাইকৃত ও অনুমোদিত হয়েছে।"
                  : "All generated exam questions have been verified and published."}
              </p>
            </div>
          )}

          {(viewTab === "questions" ? filteredQuestions : aiQueue).map((q) => (
            <div
              key={q.id}
              className="p-4 rounded-2xl border border-neutral-200 bg-white hover:border-neutral-300 space-y-2.5 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HSKBadge level={q.level} size="sm" />
                  <span className="text-xs font-bold uppercase text-neutral-500">
                    {q.skill} • Part {q.sectionPart}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.2 rounded-full uppercase ${
                      q.status === "published"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {q.status}
                  </span>
                  <span className="text-[11px] text-neutral-400 font-medium">
                    Source: {q.source}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {q.status !== "published" && (
                    <button
                      type="button"
                      onClick={() => handlePublish(q.id)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors cursor-pointer"
                    >
                      {isBn ? "অনুমোদন ও প্রকাশ" : "Approve & Publish"}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setEditingQuestion(q)}
                    className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                    title="Edit item"
                  >
                    <Edit2 size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(q.id)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete item"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div className="text-sm font-bold text-neutral-900">{q.promptZh}</div>

              {q.options && q.options.length > 0 && (
                <div className="flex flex-wrap gap-2 text-xs">
                  {q.options.map((opt) => (
                    <span
                      key={opt.key}
                      className={`px-2 py-1 rounded-md border ${
                        opt.key === q.correctAnswer
                          ? "bg-emerald-50 border-emerald-300 font-bold text-emerald-900"
                          : "bg-neutral-50 border-neutral-200 text-neutral-600"
                      }`}
                    >
                      {opt.key}: {opt.textZh}
                    </span>
                  ))}
                </div>
              )}

              <div className="text-xs text-neutral-500 leading-relaxed">
                <span className="font-semibold text-neutral-700">Explanation:</span>{" "}
                {q.explanationEn || q.explanationZh}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Question Editing Drawer/Modal */}
      {editingQuestion && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-neutral-950/50 p-4">
          <form
            onSubmit={handleSaveEdit}
            className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-neutral-200"
          >
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-base font-bold text-neutral-900">
                {isBn ? "প্রশ্ন সম্পাদনা" : "Edit Question Item"}
              </h3>
              <button
                type="button"
                onClick={() => setEditingQuestion(null)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">
                  Chinese Prompt:
                </label>
                <input
                  type="text"
                  value={editingQuestion.promptZh}
                  onChange={(e) =>
                    setEditingQuestion({ ...editingQuestion, promptZh: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">
                  English Meaning / Prompt:
                </label>
                <input
                  type="text"
                  value={editingQuestion.promptEn || ""}
                  onChange={(e) =>
                    setEditingQuestion({ ...editingQuestion, promptEn: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">
                  Correct Answer (Key / Sentence):
                </label>
                <input
                  type="text"
                  value={editingQuestion.correctAnswer}
                  onChange={(e) =>
                    setEditingQuestion({ ...editingQuestion, correctAnswer: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 font-mono font-bold text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">
                  Explanation:
                </label>
                <textarea
                  rows={3}
                  value={editingQuestion.explanationEn || editingQuestion.explanationZh}
                  onChange={(e) =>
                    setEditingQuestion({ ...editingQuestion, explanationEn: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-xs"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingQuestion(null)}
                className="flex-1 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
