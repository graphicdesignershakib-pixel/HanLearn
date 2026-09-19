import React, { useState, useMemo } from "react";
import { ALL_HSK_LEVELS, vocabularyService } from "../services/vocabularyService";
import { SentenceBuilder } from "../components/practice/SentenceBuilder";
import { SentenceExercise, SentenceExerciseMode } from "../types/practice";
import { HskLevel } from "../types/hsk";
import { ArrowLeft, BookOpen } from "lucide-react";
import { navigate } from "../services/routerService";

interface SentencePracticePageProps {
  initialSentenceId?: string;
}

export const SentencePracticePage: React.FC<SentencePracticePageProps> = ({
  initialSentenceId,
}) => {
  const [level, setLevel] = useState<HskLevel>("1");
  const [mode, setMode] = useState<SentenceExerciseMode>("ordering");
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [totalCompleted, setTotalCompleted] = useState(0);

  // Available sentences in selected level
  const words = useMemo(() => vocabularyService.getWordsByLevel(level), [level]);

  // Generate sentence exercise
  const currentExercise: SentenceExercise = useMemo(() => {
    // Find sentence
    let targetSentence = vocabularyService.getSentenceById(initialSentenceId || "");
    if (!targetSentence) {
      // Find a word with sentences
      for (const w of words) {
        const s = vocabularyService.getSentencesForWord(w.id);
        if (s.length > 0) {
          targetSentence = s[exerciseIndex % s.length];
          break;
        }
      }
    }

    // Fallback if none found
    if (!targetSentence) {
      targetSentence = {
        id: "s-fb",
        vocabularyId: "hsk1-1",
        chinese: "我是一名学生。",
        pinyin: "Wǒ shì yī míng xuésheng.",
        english: "I am a student.",
        tokens: ["我", "是", "一名", "学生", "。"],
        source: "manual",
      };
    }

    const targetWord = words.find((w) => targetSentence?.chinese.includes(w.hanzi)) || words[0];

    // For blank mode, pick one token to be blank
    const blankToken = targetSentence.tokens[Math.min(2, targetSentence.tokens.length - 1)];
    const distractorPool = ["很", "不", "有", "在", "大", "也", "好", "吃"];
    const blankOptions = [blankToken, ...distractorPool.filter((d) => d !== blankToken).slice(0, 3)].sort(
      () => Math.random() - 0.5
    );

    return {
      sentence: targetSentence,
      targetWord,
      mode,
      scrambledTokens: targetSentence.tokens,
      correctOrder: targetSentence.tokens,
      blankToken,
      blankOptions,
    };
  }, [words, exerciseIndex, mode, initialSentenceId]);

  const handleComplete = (correct: boolean) => {
    setTotalCompleted((t) => t + 1);
    if (correct) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    setExerciseIndex((i) => i + 1);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back to practice hub */}
      <button
        type="button"
        onClick={() => navigate("/practice")}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
      >
        <ArrowLeft size={14} />
        <span>Back to Practice Hub</span>
      </button>

      {/* Header & Score Bar */}
      <div className="p-6 rounded-2xl border border-neutral-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
            <BookOpen size={24} className="text-emerald-600" />
            <span>Sentence Construction Studio</span>
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Assemble words into grammatical Chinese sentences and test contextual syntax.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-800">
            Solved: <strong className="text-neutral-950">{score}</strong> / {totalCompleted}
          </div>
        </div>
      </div>

      {/* Controls Bar: Mode & Level Filter */}
      <div className="p-4 rounded-xl border border-neutral-200 bg-white flex flex-wrap items-center justify-between gap-3">
        {/* Mode Selector */}
        <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg text-xs">
          <button
            type="button"
            onClick={() => setMode("ordering")}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
              mode === "ordering"
                ? "bg-white text-neutral-950 shadow-xs"
                : "text-neutral-600 hover:text-neutral-950"
            }`}
          >
            Word Ordering
          </button>
          <button
            type="button"
            onClick={() => setMode("fill-in-blank")}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
              mode === "fill-in-blank"
                ? "bg-white text-neutral-950 shadow-xs"
                : "text-neutral-600 hover:text-neutral-950"
            }`}
          >
            Fill in the Blank
          </button>
        </div>

        {/* Level Selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-neutral-500 font-medium">HSK Level:</span>
          <select
            value={level}
            onChange={(e) => {
              setLevel(e.target.value as HskLevel);
              setExerciseIndex(0);
            }}
            className="py-1 px-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-semibold text-neutral-800 focus:outline-none"
          >
            {ALL_HSK_LEVELS.map((lvl) => (
              <option key={lvl} value={lvl}>
                HSK {lvl}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sentence Exercise */}
      <SentenceBuilder
        key={`${currentExercise.sentence.id}-${exerciseIndex}-${mode}`}
        exercise={currentExercise}
        onComplete={handleComplete}
        onNext={handleNext}
      />
    </div>
  );
};
