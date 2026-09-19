import React, { useState, useEffect } from "react";
import { grammarService, GRAMMAR_POINTS } from "../services/grammarService";
import { GrammarPoint, GrammarCategory, GrammarQuestion } from "../types/grammar";
import { HskLevel } from "../types/hsk";
import { audioService } from "../services/audioService";
import { bengaliService } from "../services/bengaliService";
import { mistakeService } from "../services/mistakeService";
import {
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Volume2,
  Sparkles,
  ArrowRight,
  HelpCircle,
  AlertTriangle,
  Layers,
  X,
} from "lucide-react";

export const GrammarLabPage: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<HskLevel | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<GrammarCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activePoint, setActivePoint] = useState<GrammarPoint | null>(null);
  const [isBn, setIsBn] = useState(bengaliService.getLanguage() === "bn");

  // Quiz state inside active point
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const unsub = bengaliService.subscribe(() => setIsBn(bengaliService.getLanguage() === "bn"));
    return unsub;
  }, []);

  const filteredPoints = grammarService.filterPoints(selectedLevel, selectedCategory, searchQuery);

  const categories: GrammarCategory[] = [
    "Sentence Pattern",
    "Aspect Marker",
    "Passive & Disposal",
    "Particle",
    "Comparison",
    "Conjunction",
    "Preposition",
  ];

  const handleSpeak = (text: string) => {
    audioService.speakText(text);
  };

  const handleQuizAnswer = (qId: string, answer: string, question: GrammarQuestion, point: GrammarPoint) => {
    setQuizAnswers((prev) => ({ ...prev, [qId]: answer }));
    setQuizSubmitted((prev) => ({ ...prev, [qId]: true }));

    const isCorrect = Array.isArray(question.correctAnswer)
      ? question.correctAnswer.join(" ") === answer
      : question.correctAnswer === answer;

    if (!isCorrect) {
      mistakeService.addMistake({
        sourceModule: "grammar",
        skill: "grammar",
        hskLevel: point.hskLevel,
        questionPrompt: `[Grammar: ${point.title}] ${question.prompt}`,
        userAnswer: answer,
        correctAnswer: Array.isArray(question.correctAnswer) ? question.correctAnswer.join(" ") : question.correctAnswer,
        explanation: question.explanation,
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Top Header */}
      <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 md:p-8 space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
              <BookOpen size={14} />
              <span>HSK 3.0 GRAMMAR LAB</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight">
              {isBn ? "ব্যাকরণ গবেষণাগার (Grammar Lab)" : "Comprehensive Grammar Lab"}
            </h1>
            <p className="text-xs md:text-sm text-neutral-600 max-w-2xl">
              {isBn
                ? "HSK লেভেল ১ থেকে ৬ এর ব্যাকরণিক নিয়ম, গঠনপ্রণালী, সাধারণ ভুল এবং ইন্টারেক্টিভ কুইজ।"
                : "Master structural patterns, aspect markers, disposal sentences, and comparative constructions with audio examples and error diagnostics."}
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isBn ? "নিয়ম বা শব্দ খুঁজুন..." : "Search rule, pattern, or keyword..."}
              className="w-full pl-9.5 pr-4 py-2 rounded-xl border border-neutral-200 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:border-transparent bg-neutral-50/50"
            />
          </div>
        </div>

        {/* Level & Category Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-100">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-xs font-bold text-neutral-600 mr-1 shrink-0">LEVEL:</span>
            {(["all", "1", "2", "3", "4", "5", "6"] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setSelectedLevel(lvl)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                  selectedLevel === lvl
                    ? "bg-red-600 text-white shadow-xs"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {lvl === "all" ? "All Levels" : `HSK ${lvl}`}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-auto ml-auto flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-bold text-neutral-600 shrink-0">CATEGORY:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-medium text-neutral-700 bg-white cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grammar Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPoints.map((point) => (
          <div
            key={point.id}
            onClick={() => {
              setActivePoint(point);
              setQuizAnswers({});
              setQuizSubmitted({});
            }}
            className="bg-white border border-neutral-200/90 hover:border-red-300 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-neutral-100 text-neutral-700 border border-neutral-200">
                  HSK {point.hskLevel}
                </span>
                <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                  {point.category}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-neutral-900 group-hover:text-red-600 transition-colors line-clamp-1">
                  {point.title}
                </h3>
                <div className="text-xs font-semibold font-hanzi text-neutral-500 mt-0.5">
                  {point.chineseTitle}
                </div>
              </div>

              {/* Formula Badge */}
              <div className="p-2 rounded-xl bg-neutral-50 border border-neutral-100 font-mono text-[11px] text-neutral-800 break-words">
                {point.pattern}
              </div>

              <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                {point.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-red-600 group-hover:translate-x-0.5 transition-transform">
              <span>{isBn ? "বিস্তারিত ও অনুশীলন দেখুন" : "View Rules & Quiz"}</span>
              <ArrowRight size={14} />
            </div>
          </div>
        ))}

        {filteredPoints.length === 0 && (
          <div className="col-span-full py-16 text-center text-neutral-500 space-y-2 bg-white rounded-2xl border border-neutral-200">
            <HelpCircle size={32} className="mx-auto text-neutral-400" />
            <p className="text-sm font-semibold">No grammar points match your criteria.</p>
            <p className="text-xs text-neutral-400">Try adjusting your level or category filter.</p>
          </div>
        )}
      </div>

      {/* Grammar Point Modal Drawer */}
      {activePoint && (
        <div className="fixed inset-0 z-50 bg-neutral-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200 p-6 md:p-8 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-neutral-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-red-100 text-red-800">
                    HSK {activePoint.hskLevel}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-neutral-100 text-neutral-700">
                    {activePoint.category}
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-neutral-900">
                  {activePoint.title}
                </h2>
                <div className="text-sm font-semibold text-neutral-500 font-hanzi">
                  {activePoint.chineseTitle}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActivePoint(null)}
                className="p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Structure Pattern Box */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1">
              <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                Grammar Structure Pattern
              </div>
              <div className="font-mono text-xs md:text-sm font-bold text-neutral-900">
                {activePoint.pattern}
              </div>
            </div>

            {/* Explanations */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
                Detailed Explanation
              </h3>
              <p className="text-xs md:text-sm text-neutral-700 leading-relaxed">
                {activePoint.explanation}
              </p>
              {activePoint.bengaliExplanation && (
                <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 text-xs text-blue-900 leading-relaxed">
                  <span className="font-bold">বাংলা ব্যাখ্যা: </span>
                  {activePoint.bengaliExplanation}
                </div>
              )}
            </div>

            {/* Examples with Audio */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
                Canonical Examples
              </h3>
              <div className="space-y-2.5">
                {activePoint.examples.map((ex, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-neutral-100 bg-neutral-50/70 flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="font-hanzi text-base font-bold text-neutral-900">
                        {ex.chinese}
                      </div>
                      <div className="font-mono text-xs text-red-600 font-medium">
                        {ex.pinyin}
                      </div>
                      <div className="text-xs text-neutral-600">
                        {ex.english}
                      </div>
                      {ex.bengali && (
                        <div className="text-[11px] text-neutral-500 italic">
                          {ex.bengali}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSpeak(ex.chinese)}
                      className="p-2 rounded-xl bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-700 transition-colors shrink-0 cursor-pointer"
                      title="Listen"
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Common Mistakes / Pitfalls */}
            {activePoint.commonMistakes && activePoint.commonMistakes.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-neutral-600 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle size={14} className="text-amber-500" />
                  <span>Common Pitfalls & Diagnostic Fixes</span>
                </h3>
                <div className="space-y-2">
                  {activePoint.commonMistakes.map((m, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-rose-50/40 border border-rose-200/60 space-y-1.5 text-xs">
                      <div className="flex items-center gap-2">
                        <XCircle size={14} className="text-rose-500 shrink-0" />
                        <span className="line-through text-rose-700 font-hanzi font-semibold">{m.incorrect}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                        <span className="text-emerald-800 font-hanzi font-bold">{m.correct}</span>
                      </div>
                      <div className="text-neutral-600 text-[11px] pl-5">
                        <strong className="text-neutral-700">Reason: </strong> {m.reason}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive Practice Questions */}
            {activePoint.practiceQuestions.length > 0 && (
              <div className="space-y-3 pt-3 border-t border-neutral-100">
                <h3 className="text-xs font-bold text-neutral-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={14} className="text-red-500" />
                  <span>Grammar Check Quiz</span>
                </h3>

                <div className="space-y-3">
                  {activePoint.practiceQuestions.map((q) => {
                    const isSubmitted = !!quizSubmitted[q.id];
                    const selected = quizAnswers[q.id];
                    const isCorrect = Array.isArray(q.correctAnswer)
                      ? q.correctAnswer.join(" ") === selected
                      : q.correctAnswer === selected;

                    return (
                      <div key={q.id} className="p-4 rounded-2xl border border-neutral-200 bg-white space-y-3">
                        <div className="text-xs font-semibold text-neutral-900">
                          {q.prompt}
                        </div>

                        {q.options && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {q.options.map((opt) => {
                              const isChoiceSelected = selected === opt;
                              let btnClass = "border-neutral-200 bg-neutral-50 text-neutral-800 hover:bg-neutral-100";
                              if (isSubmitted) {
                                if (opt === q.correctAnswer) {
                                  btnClass = "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold";
                                } else if (isChoiceSelected) {
                                  btnClass = "border-rose-500 bg-rose-50 text-rose-900";
                                }
                              } else if (isChoiceSelected) {
                                btnClass = "border-red-500 bg-red-50 text-red-900 font-semibold";
                              }

                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  disabled={isSubmitted}
                                  onClick={() => handleQuizAnswer(q.id, opt, q, activePoint)}
                                  className={`p-2.5 rounded-xl border text-xs text-left transition-colors cursor-pointer ${btnClass}`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {q.type === "reorder" && Array.isArray(q.correctAnswer) && (
                          <div className="space-y-2">
                            <button
                              type="button"
                              onClick={() => handleQuizAnswer(q.id, q.correctAnswer.join(" "), q, activePoint)}
                              className="px-3.5 py-1.5 rounded-xl bg-neutral-900 text-white font-semibold text-xs hover:bg-neutral-800 transition-colors cursor-pointer"
                            >
                              Check Answer
                            </button>
                          </div>
                        )}

                        {isSubmitted && (
                          <div
                            className={`p-3 rounded-xl text-xs ${
                              isCorrect ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-rose-50 text-rose-800 border border-rose-200"
                            }`}
                          >
                            <div className="font-bold flex items-center gap-1.5">
                              {isCorrect ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                              <span>{isCorrect ? "Correct! Well done." : "Incorrect. Added to Mistake Book for review."}</span>
                            </div>
                            <div className="text-[11px] mt-1 text-neutral-600">
                              {q.explanation}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
