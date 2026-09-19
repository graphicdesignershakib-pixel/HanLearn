import React, { useState, useEffect } from "react";
import { HskLevel } from "../types/hsk";
import { vocabularyService } from "../services/vocabularyService";
import { audioService } from "../services/audioService";
import { mistakeService } from "../services/mistakeService";
import { dailyMissionService } from "../services/dailyMissionService";
import { bengaliService } from "../services/bengaliService";
import {
  Timer,
  Zap,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Award,
} from "lucide-react";
import confetti from "canvas-confetti";

interface MiniQuestion {
  id: string;
  type: "meaning" | "pinyin" | "cloze";
  prompt: string;
  hanzi?: string;
  pinyin?: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export const MiniTestsPage: React.FC = () => {
  const [testState, setTestState] = useState<"setup" | "running" | "finished">("setup");
  const [selectedLevel, setSelectedLevel] = useState<HskLevel>("1");
  const [questionCount, setQuestionCount] = useState<5 | 10 | 20>(5);
  const [questions, setQuestions] = useState<MiniQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isBn, setIsBn] = useState(bengaliService.getLanguage() === "bn");

  useEffect(() => {
    const unsub = bengaliService.subscribe(() => setIsBn(bengaliService.getLanguage() === "bn"));
    return unsub;
  }, []);

  const handleStartTest = () => {
    const words = vocabularyService.getWordsByLevel(selectedLevel);
    const shuffled = [...words].sort(() => Math.random() - 0.5).slice(0, questionCount);

    const generated: MiniQuestion[] = shuffled.map((w, idx) => {
      const getMeaning = (item: typeof w) => item.definitions[0]?.text || "meaning";
      // Pick 3 random distractors
      const distractors = words
        .filter((x) => x.id !== w.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(getMeaning);

      const wordMeaning = getMeaning(w);
      const options = [...distractors, wordMeaning].sort(() => Math.random() - 0.5);

      return {
        id: `mq-${idx}-${w.id}`,
        type: "meaning",
        prompt: `What is the accurate English definition for:`,
        hanzi: w.hanzi,
        pinyin: w.pinyinDisplay,
        options,
        correctAnswer: wordMeaning,
        explanation: `${w.hanzi} (${w.pinyinDisplay}): ${wordMeaning}`,
      };
    });

    setQuestions(generated);
    setCurrentIndex(0);
    setUserAnswers({});
    setTestState("running");
  };

  const handleAnswer = (choice: string) => {
    const currentQ = questions[currentIndex];
    setUserAnswers((prev) => ({ ...prev, [currentIndex]: choice }));

    if (choice !== currentQ.correctAnswer) {
      mistakeService.addMistake({
        sourceModule: "exam",
        skill: "vocabulary",
        hskLevel: selectedLevel,
        hanzi: currentQ.hanzi,
        pinyin: currentQ.pinyin,
        questionPrompt: `Mini-test: What is the meaning of ${currentQ.hanzi}?`,
        userAnswer: choice,
        correctAnswer: currentQ.correctAnswer,
        explanation: currentQ.explanation,
      });
    }

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      setTestState("finished");
      dailyMissionService.recordTaskProgress("task-vocab", questionCount);
      try {
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  const currentQ = questions[currentIndex];

  // Score calculation
  const correctCount = questions.reduce((acc, q, idx) => {
    return userAnswers[idx] === q.correctAnswer ? acc + 1 : acc;
  }, 0);
  const scorePct = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Banner */}
      <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 md:p-8 space-y-4 shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
            <Zap size={14} />
            <span>RAPID MINI TEST SYSTEM</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight">
            {isBn ? "দ্রুত মিনি পরীক্ষা (Mini Tests)" : "Rapid Skill Sprints"}
          </h1>
          <p className="text-xs md:text-sm text-neutral-600 max-w-xl">
            {isBn
              ? "৫, ১০ বা ২০টি দ্রুত প্রশ্নের মাধ্যমে আপনার প্রস্তুতি যাচাই করুন। ভুলগুলো সরাসরি মিসটেক বুকে সংরক্ষিত হবে।"
              : "Bite-sized diagnostic quizzes to benchmark retention in 3 minutes or less. Instant grading and mistake logging."}
          </p>
        </div>
      </div>

      {/* SETUP VIEW */}
      {testState === "setup" && (
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-xs">
          <div className="space-y-3">
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
              1. Choose HSK Level:
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {(["1", "2", "3", "4", "5", "6"] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSelectedLevel(lvl)}
                  className={`p-3 rounded-2xl border text-center font-bold text-sm transition-all cursor-pointer ${
                    selectedLevel === lvl
                      ? "bg-red-600 text-white border-red-600 shadow-xs"
                      : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100"
                  }`}
                >
                  HSK {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
              2. Number of Questions:
            </label>
            <div className="grid grid-cols-3 gap-3">
              {([5, 10, 20] as const).map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => setQuestionCount(cnt)}
                  className={`p-3 rounded-2xl border text-center font-bold text-sm transition-all cursor-pointer ${
                    questionCount === cnt
                      ? "bg-neutral-900 text-white border-neutral-900 shadow-xs"
                      : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100"
                  }`}
                >
                  {cnt} Questions
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleStartTest}
              className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap size={18} />
              <span>Launch Mini Test</span>
            </button>
          </div>
        </div>
      )}

      {/* RUNNING SPRINT VIEW */}
      {testState === "running" && currentQ && (
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-xs">
          {/* Progress bar */}
          <div className="space-y-2 border-b border-neutral-100 pb-4">
            <div className="flex items-center justify-between text-xs text-neutral-600">
              <span className="font-bold">
                Question {currentIndex + 1} of {questions.length} (HSK {selectedLevel})
              </span>
              <span className="font-bold text-neutral-900">
                {Math.round(((currentIndex + 1) / questions.length) * 100)}%
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-neutral-100 overflow-hidden">
              <div
                className="h-full bg-red-600 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Hanzi Focus Card */}
          <div className="p-8 rounded-3xl bg-neutral-50/70 border border-neutral-100 text-center space-y-2">
            <div className="text-xs text-neutral-500 font-medium">
              {currentQ.prompt}
            </div>
            <div className="text-5xl md:text-6xl font-extrabold font-hanzi text-neutral-900 tracking-wider">
              {currentQ.hanzi}
            </div>
            <div className="font-mono text-sm text-red-600 font-bold">
              {currentQ.pinyin}
            </div>
          </div>

          {/* 4 Choices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => handleAnswer(opt)}
                className="p-4 rounded-2xl border border-neutral-200 bg-white hover:border-red-400 hover:bg-red-50 text-neutral-900 font-semibold text-xs md:text-sm text-left transition-all cursor-pointer shadow-xs"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* FINISHED RESULTS VIEW */}
      {testState === "finished" && (
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 md:p-8 space-y-6 text-center shadow-xs">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Award size={32} />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-neutral-900">
              Mini Test Completed!
            </h2>
            <p className="text-xs text-neutral-500">
              You scored <strong className="text-neutral-900">{correctCount}</strong> out of {questions.length} ({scorePct}%)
            </p>
          </div>

          {/* Review of answered questions */}
          <div className="space-y-2.5 text-left pt-4 border-t border-neutral-100">
            <div className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
              Question Breakdown:
            </div>
            {questions.map((q, idx) => {
              const userAns = userAnswers[idx];
              const isMatch = userAns === q.correctAnswer;
              return (
                <div
                  key={q.id}
                  className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
                    isMatch ? "bg-emerald-50/50 border-emerald-200 text-emerald-950" : "bg-rose-50/50 border-rose-200 text-rose-950"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isMatch ? (
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle size={16} className="text-rose-600 shrink-0" />
                    )}
                    <span className="font-hanzi font-bold text-sm text-neutral-900">{q.hanzi}</span>
                    <span className="text-neutral-500">({q.pinyin})</span>
                  </div>

                  <div className="text-[11px] font-semibold text-right">
                    {isMatch ? (
                      <span>{q.correctAnswer}</span>
                    ) : (
                      <span>
                        <span className="line-through text-rose-600 mr-2">{userAns}</span>
                        <span className="text-emerald-700">{q.correctAnswer}</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setTestState("setup")}
              className="px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              Start Another Sprint
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
