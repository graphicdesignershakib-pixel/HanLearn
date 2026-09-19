import React, { useState, useEffect } from "react";
import { mistakeService } from "../services/mistakeService";
import { MistakeRecord, LearningSkill } from "../types/learning";
import { HskLevel } from "../types/hsk";
import { progressService } from "../services/progressService";
import { bengaliService } from "../services/bengaliService";
import { audioService } from "../services/audioService";
import {
  AlertCircle,
  CheckCircle2,
  Trash2,
  Filter,
  Sparkles,
  BookOpen,
  Volume2,
  Layers,
  ArrowRight,
  RotateCcw,
} from "lucide-react";

export const MistakeBookPage: React.FC = () => {
  const [mistakes, setMistakes] = useState<MistakeRecord[]>(() => mistakeService.getAllMistakes());
  const [skillFilter, setSkillFilter] = useState<LearningSkill | "all">("all");
  const [levelFilter, setLevelFilter] = useState<HskLevel | "all">("all");
  const [onlyUnresolved, setOnlyUnresolved] = useState(true);
  const [isBn, setIsBn] = useState(bengaliService.getLanguage() === "bn");

  useEffect(() => {
    const unsubM = mistakeService.subscribe(() => setMistakes(mistakeService.getAllMistakes()));
    const unsubB = bengaliService.subscribe(() => setIsBn(bengaliService.getLanguage() === "bn"));
    return () => {
      unsubM();
      unsubB();
    };
  }, []);

  const stats = mistakeService.getMistakeStats();

  const filteredMistakes = mistakes.filter((m) => {
    if (onlyUnresolved && m.isResolved) return false;
    if (skillFilter !== "all" && m.skill !== skillFilter) return false;
    if (levelFilter !== "all" && m.hskLevel !== levelFilter) return false;
    return true;
  });

  const handleResolve = (id: string, currentResolved: boolean) => {
    if (currentResolved) {
      mistakeService.unresolveMistake(id);
    } else {
      mistakeService.resolveMistake(id);
    }
  };

  const handleDelete = (id: string) => {
    mistakeService.deleteMistake(id);
  };

  const handleSpeak = (text: string) => {
    audioService.speakText(text);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 md:p-8 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
              <AlertCircle size={14} />
              <span>CENTRAL MISTAKE NOTEBOOK (错题本)</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight">
              {isBn ? "ভুল সংশোধন বই (Mistake Book)" : "Smart Mistake & Error Book"}
            </h1>
            <p className="text-xs md:text-sm text-neutral-600 max-w-xl">
              {isBn
                ? "মক টেস্ট, মিনি কুইজ ও অনুশীলন থেকে সংগৃহীত ভুলসমূহ। এক ক্লিকে সমাধান করুন বা ফ্ল্যাশকার্ডে যোগ দিন।"
                : "Consolidate and review all errors from mock exams, sentence builders, dictation, and grammar quizzes to eliminate repetitive mistakes."}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100 text-center min-w-24">
              <div className="text-[10px] text-neutral-400 font-bold uppercase">Unresolved</div>
              <div className="text-xl font-extrabold text-rose-600">{stats.unresolved}</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100 text-center min-w-24">
              <div className="text-[10px] text-neutral-400 font-bold uppercase">Total Tracked</div>
              <div className="text-xl font-extrabold text-neutral-900">{stats.total}</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-100 text-xs">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setOnlyUnresolved(!onlyUnresolved)}
              className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-colors ${
                onlyUnresolved ? "bg-rose-600 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {onlyUnresolved ? "Showing Unresolved Only" : "Showing All"}
            </button>

            <select
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl border border-neutral-200 bg-white font-semibold text-neutral-700 cursor-pointer"
            >
              <option value="all">All Skills</option>
              <option value="grammar">Grammar</option>
              <option value="listening">Listening</option>
              <option value="vocabulary">Vocabulary</option>
              <option value="tone">Tone</option>
              <option value="reading">Reading</option>
              <option value="writing">Writing</option>
            </select>

            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl border border-neutral-200 bg-white font-semibold text-neutral-700 cursor-pointer"
            >
              <option value="all">All HSK Levels</option>
              <option value="1">HSK 1</option>
              <option value="2">HSK 2</option>
              <option value="3">HSK 3</option>
              <option value="4">HSK 4</option>
              <option value="5">HSK 5</option>
              <option value="6">HSK 6</option>
            </select>
          </div>

          <div className="text-[11px] text-neutral-500">
            {filteredMistakes.length} mistakes listed
          </div>
        </div>
      </div>

      {/* Mistake List */}
      <div className="space-y-4">
        {filteredMistakes.map((m) => (
          <div
            key={m.id}
            className={`bg-white border rounded-2xl p-5 shadow-xs transition-all space-y-3 ${
              m.isResolved ? "border-neutral-200 opacity-60" : "border-rose-200/90"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-neutral-100 text-neutral-700 uppercase">
                  {m.sourceModule}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700">
                  {m.skill} · HSK {m.hskLevel}
                </span>
                {m.errorCount > 1 && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800">
                    Missed {m.errorCount}x
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleResolve(m.id, m.isResolved)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                    m.isResolved
                      ? "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                      : "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                  }`}
                >
                  <CheckCircle2 size={14} />
                  <span>{m.isResolved ? "Mark Unresolved" : "Mark as Mastered"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(m.id)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                  title="Delete mistake"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            {/* Prompt */}
            <div className="text-xs font-semibold text-neutral-900">
              {m.questionPrompt}
            </div>

            {/* User vs Correct */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-100 space-y-1">
                <div className="text-[10px] font-bold text-rose-500 uppercase">Your Answer:</div>
                <div className="font-semibold text-rose-900 break-words">{m.userAnswer}</div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-1">
                <div className="text-[10px] font-bold text-emerald-600 uppercase">Correct Answer:</div>
                <div className="font-semibold text-emerald-950 break-words flex items-center justify-between">
                  <span>{m.correctAnswer}</span>
                  {m.hanzi && (
                    <button
                      type="button"
                      onClick={() => handleSpeak(m.hanzi!)}
                      className="p-1 text-emerald-700 hover:text-emerald-900 cursor-pointer"
                    >
                      <Volume2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Explanation */}
            <div className="p-3 rounded-xl bg-neutral-50 text-[11px] text-neutral-600 leading-relaxed">
              <strong className="text-neutral-800">Diagnostic Rule: </strong>
              {m.explanation}
            </div>
          </div>
        ))}

        {filteredMistakes.length === 0 && (
          <div className="py-16 text-center text-neutral-500 space-y-2 bg-white rounded-3xl border border-neutral-200">
            <CheckCircle2 size={36} className="mx-auto text-emerald-500" />
            <h3 className="text-sm font-bold text-neutral-800">No Mistakes Found!</h3>
            <p className="text-xs text-neutral-400">
              You have cleared all recorded mistakes or no errors match your active filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
