import React, { useState } from "react";
import { X, Calendar, Award, Clock, ArrowRight, Filter, Trash2 } from "lucide-react";
import { ExamAttempt, ExamSkill } from "../../types/exam";
import { examSessionService } from "../../services/exam/examSessionService";
import { HSKBadge } from "../common/HSKBadge";
import { HskLevel } from "../../types/hsk";

interface ExamHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAttempt: (attempt: ExamAttempt) => void;
  isBn?: boolean;
}

export const ExamHistoryModal: React.FC<ExamHistoryModalProps> = ({
  isOpen,
  onClose,
  onSelectAttempt,
  isBn = false,
}) => {
  const [levelFilter, setLevelFilter] = useState<HskLevel | "all">("all");

  if (!isOpen) return null;

  const allHistory = examSessionService.getAllHistory();
  const summary = examSessionService.getHistorySummary(
    levelFilter === "all" ? undefined : levelFilter
  );

  const filtered = levelFilter === "all"
    ? allHistory
    : allHistory.filter((a) => a.level === levelFilter);

  const levels: (HskLevel | "all")[] = ["all", "1", "2", "3", "4", "5", "6", "7-9"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-neutral-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-100">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">
              {isBn ? "মক পরীক্ষার ইতিহাস ও রেকর্ড" : "Mock Exam Records & History"}
            </h2>
            <p className="text-xs text-neutral-500">
              {isBn
                ? "আপনার সমস্ত মক টেস্ট প্রচেষ্টা ও অগ্রগতির বিস্তারিত তালিকা"
                : "Complete history of official simulation attempts and score progression"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Level Filter Tabs */}
        <div className="flex items-center gap-1.5 px-6 pt-4 overflow-x-auto pb-2 border-b border-neutral-100">
          {levels.map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setLevelFilter(lvl)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                levelFilter === lvl
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {lvl === "all" ? (isBn ? "সব লেভেল" : "All Levels") : `HSK ${lvl}`}
            </button>
          ))}
        </div>

        {/* Summary Stats Strip */}
        <div className="grid grid-cols-4 gap-3 p-6 bg-neutral-50 border-b border-neutral-100 text-center">
          <div>
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
              {isBn ? "মোট পরীক্ষা" : "Attempts"}
            </span>
            <span className="text-xl font-black text-neutral-900 font-mono">
              {summary.totalAttempts}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
              {isBn ? "সর্বোচ্চ স্কোর" : "Best Score"}
            </span>
            <span className="text-xl font-black text-emerald-600 font-mono">
              {summary.bestScore}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
              {isBn ? "গড় স্কোর" : "Avg Score"}
            </span>
            <span className="text-xl font-black text-neutral-800 font-mono">
              {summary.averageScore}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
              {isBn ? "পাসের হার" : "Pass Rate"}
            </span>
            <span className="text-xl font-black text-neutral-900 font-mono">
              {summary.passRate}%
            </span>
          </div>
        </div>

        {/* Attempts List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <Award size={36} className="text-neutral-300 mx-auto" />
              <p className="text-sm font-semibold text-neutral-600">
                {isBn ? "কোনো পরীক্ষা রেকর্ড পাওয়া যায়নি" : "No exam attempts recorded yet"}
              </p>
              <p className="text-xs text-neutral-400">
                {isBn
                  ? "একটি পূর্ণাঙ্গ মক টেস্ট সম্পন্ন করলে তা এখানে তালিকাভুক্ত হবে।"
                  : "Complete an official mock exam to record your performance history."}
              </p>
            </div>
          ) : (
            filtered.map((att) => (
              <div
                key={att.id}
                onClick={() => {
                  onSelectAttempt(att);
                  onClose();
                }}
                className="p-4 rounded-2xl border border-neutral-200 hover:border-red-300 hover:bg-red-50/20 transition-all flex items-center justify-between gap-4 cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <HSKBadge level={att.level} size="md" />

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-neutral-900 group-hover:text-red-600 transition-colors">
                        {att.paperCode}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.2 rounded-full uppercase ${
                          att.passed
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-neutral-100 text-neutral-600"
                        }`}
                      >
                        {att.passed ? "Passed" : "Not Passed"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(att.startedAt).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span className="capitalize">{att.mode} Mode</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-lg font-black font-mono text-neutral-900">
                      {att.totalScore}
                      <span className="text-xs font-normal text-neutral-400">
                        /{att.maxScore || 200}
                      </span>
                    </div>
                    <span className="text-[11px] text-neutral-500 font-medium block">
                      {att.percentage}%
                    </span>
                  </div>

                  <ArrowRight
                    size={16}
                    className="text-neutral-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
