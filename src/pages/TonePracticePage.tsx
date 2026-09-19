import React, { useState, useMemo } from "react";
import { ALL_HSK_LEVELS, vocabularyService } from "../services/vocabularyService";
import { ToneExercise } from "../components/practice/ToneExercise";
import { TonePracticeMode, ToneQuestion } from "../types/practice";
import { HskLevel, Tone } from "../types/hsk";
import { ArrowLeft, RotateCcw, Award, Flame, Volume2 } from "lucide-react";
import { navigate } from "../services/routerService";

export const TonePracticePage: React.FC = () => {
  const [level, setLevel] = useState<HskLevel>("1");
  const [mode, setMode] = useState<TonePracticeMode>("select");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);

  // Generate question pool based on words in selected level
  const words = useMemo(() => {
    return vocabularyService.getWordsByLevel(level);
  }, [level]);

  // Current question
  const currentQuestion: ToneQuestion = useMemo(() => {
    if (words.length === 0) {
      return {
        wordId: "fallback",
        hanzi: "好",
        targetSyllable: "hǎo",
        pinyinDisplay: "hǎo",
        targetTone: 3,
        audioText: "好",
      };
    }

    const word = words[questionIndex % words.length];
    const syllable = word.syllables[0] || { clean: "hao", display: "hǎo", tone: 3 };

    return {
      wordId: word.id,
      hanzi: word.hanzi,
      targetSyllable: syllable.clean,
      pinyinDisplay: syllable.display,
      targetTone: (syllable.tone === 0 ? 0 : syllable.tone) as Tone,
      audioText: word.hanzi,
    };
  }, [words, questionIndex]);

  const handleAnswer = (correct: boolean) => {
    setTotalAnswered((t) => t + 1);
    if (correct) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    setQuestionIndex((q) => q + 1);
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
            <Volume2 size={24} className="text-blue-600" />
            <span>Mandarin Tone Laboratory</span>
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Train your ear and muscle memory for Mandarin's 5 tonal pitch contours.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-800">
            Score: <strong className="text-neutral-950">{score}</strong> / {totalAnswered}
          </div>
          {totalAnswered > 0 && (
            <div className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 font-semibold">
              {Math.round((score / totalAnswered) * 100)}% Accuracy
            </div>
          )}
        </div>
      </div>

      {/* Controls Bar: Mode & Level Filter */}
      <div className="p-4 rounded-xl border border-neutral-200 bg-white flex flex-wrap items-center justify-between gap-3">
        {/* Mode Selector */}
        <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg text-xs">
          {(
            [
              { key: "identify", label: "Identify" },
              { key: "select", label: "Select Tone" },
              { key: "listen", label: "Listen Only" },
              { key: "speak", label: "Speak/Mic" },
            ] as const
          ).map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => setMode(m.key)}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                mode === m.key
                  ? "bg-white text-neutral-950 shadow-xs"
                  : "text-neutral-600 hover:text-neutral-950"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Level Selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-neutral-500 font-medium">HSK Level:</span>
          <select
            value={level}
            onChange={(e) => {
              setLevel(e.target.value as HskLevel);
              setQuestionIndex(0);
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

      {/* Active Tone Exercise */}
      <ToneExercise
        key={`${currentQuestion.wordId}-${questionIndex}-${mode}`}
        question={currentQuestion}
        mode={mode}
        onAnswer={handleAnswer}
        onNext={handleNext}
      />
    </div>
  );
};
