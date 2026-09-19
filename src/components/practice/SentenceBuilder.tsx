import React, { useState, useEffect } from "react";
import { SentenceExercise, SentenceExerciseMode } from "../../types/practice";
import { AudioButton } from "../common/AudioButton";
import { Check, X, RotateCcw, ArrowRight, Sparkles, HelpCircle } from "lucide-react";
import confetti from "canvas-confetti";

interface SentenceBuilderProps {
  exercise: SentenceExercise;
  onComplete: (correct: boolean) => void;
  onNext: () => void;
  className?: string;
}

export const SentenceBuilder: React.FC<SentenceBuilderProps> = ({
  exercise,
  onComplete,
  onNext,
  className = "",
}) => {
  // Available pool of words and arranged words
  const [availableTokens, setAvailableTokens] = useState<string[]>([]);
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [selectedBlank, setSelectedBlank] = useState<string | null>(null);

  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    resetState();
  }, [exercise]);

  const resetState = () => {
    // Shuffle scrambled tokens
    const shuffled = [...exercise.scrambledTokens].sort(() => Math.random() - 0.5);
    setAvailableTokens(shuffled);
    setSelectedTokens([]);
    setSelectedBlank(null);
    setSubmitted(false);
    setIsCorrect(false);
    setShowHint(false);
  };

  const handleAddToken = (token: string, index: number) => {
    if (submitted) return;
    setSelectedTokens([...selectedTokens, token]);
    const nextAvailable = [...availableTokens];
    nextAvailable.splice(index, 1);
    setAvailableTokens(nextAvailable);
  };

  const handleRemoveToken = (token: string, index: number) => {
    if (submitted) return;
    const nextSelected = [...selectedTokens];
    nextSelected.splice(index, 1);
    setSelectedTokens(nextSelected);
    setAvailableTokens([...availableTokens, token]);
  };

  const handleSubmit = () => {
    if (submitted) return;

    let correct = false;

    if (exercise.mode === "ordering") {
      const userSentence = selectedTokens.join("");
      const correctSentence = exercise.correctOrder.join("");
      correct = userSentence === correctSentence;
    } else if (exercise.mode === "fill-in-blank") {
      correct = selectedBlank === exercise.blankToken;
    }

    setIsCorrect(correct);
    setSubmitted(true);

    if (correct) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#2E7D5B", "#D63A2F", "#3566B8"],
        });
      } catch (_) {}
    }

    onComplete(correct);
  };

  return (
    <div className={`p-6 md:p-8 rounded-2xl border border-neutral-200 bg-white max-w-2xl mx-auto space-y-6 ${className}`}>
      {/* Exercise Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            {exercise.mode === "ordering" ? "Sentence Word Ordering" : "Fill in the Blank"}
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-neutral-600">Target Vocabulary:</span>
            <span className="text-sm font-bold font-hanzi text-red-600 bg-red-50 px-2 py-0.5 rounded">
              {exercise.targetWord.hanzi} ({exercise.targetWord.pinyinDisplay})
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowHint(!showHint)}
          className="text-xs text-neutral-500 hover:text-neutral-800 flex items-center gap-1"
        >
          <HelpCircle size={14} />
          <span>{showHint ? "Hide English" : "Hint"}</span>
        </button>
      </div>

      {/* English Meaning / Prompt */}
      <div className="space-y-1">
        <span className="text-xs font-semibold text-neutral-600 uppercase">Meaning to construct:</span>
        <div className="text-lg font-medium text-neutral-900 leading-snug">
          "{exercise.sentence.english}"
        </div>
        {showHint && (
          <div className="text-xs text-neutral-500 italic mt-1">
            Target Chinese contains {exercise.sentence.tokens.length} segments.
          </div>
        )}
      </div>

      {/* Exercise Mode 1: Token Ordering */}
      {exercise.mode === "ordering" && (
        <div className="space-y-5">
          {/* Construction Drop Area */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-neutral-600 uppercase">Your Construction:</span>
            <div
              className={`min-h-16 p-3.5 rounded-xl border-2 border-dashed flex flex-wrap items-center gap-2 transition-colors ${
                selectedTokens.length === 0
                  ? "border-neutral-200 bg-neutral-50/50 justify-center text-xs text-neutral-400"
                  : submitted
                  ? isCorrect
                    ? "border-emerald-400 bg-emerald-50/40"
                    : "border-red-400 bg-red-50/40"
                  : "border-neutral-300 bg-white"
              }`}
            >
              {selectedTokens.length === 0 ? (
                <span>Tap the words below in order to build the sentence</span>
              ) : (
                selectedTokens.map((token, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleRemoveToken(token, idx)}
                    disabled={submitted}
                    className="px-3.5 py-2 rounded-lg bg-neutral-900 text-white font-hanzi text-lg font-medium hover:bg-neutral-800 active:scale-95 transition-all shadow-xs"
                    title="Click to remove from sentence"
                  >
                    {token}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Available Word Blocks Pool */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-neutral-600 uppercase">Available Words:</span>
            <div className="flex flex-wrap gap-2.5 p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 min-h-14 items-center">
              {availableTokens.length === 0 ? (
                <span className="text-xs text-neutral-600 italic">All words selected</span>
              ) : (
                availableTokens.map((token, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddToken(token, idx)}
                    disabled={submitted}
                    className="px-3.5 py-2 rounded-lg bg-white border border-neutral-300 text-neutral-900 font-hanzi text-lg font-medium hover:border-red-500 hover:text-red-700 hover:shadow-xs active:scale-95 transition-all"
                  >
                    {token}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Exercise Mode 2: Fill in the Blank */}
      {exercise.mode === "fill-in-blank" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-center text-2xl font-hanzi text-neutral-900">
            {exercise.sentence.tokens.map((token, i) => {
              if (token === exercise.blankToken) {
                return (
                  <span
                    key={i}
                    className="mx-1 px-3 py-1 rounded border-b-2 border-red-500 bg-white font-bold text-red-600 inline-block min-w-16"
                  >
                    {selectedBlank || "___"}
                  </span>
                );
              }
              return <span key={i}>{token}</span>;
            })}
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {exercise.blankOptions?.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => !submitted && setSelectedBlank(opt)}
                disabled={submitted}
                className={`p-3 rounded-xl border text-center font-hanzi text-lg font-medium transition-all ${
                  selectedBlank === opt
                    ? "border-red-600 bg-red-50 text-red-900 ring-2 ring-red-500/20"
                    : "border-neutral-200 bg-white hover:border-neutral-300 text-neutral-800"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Answer Evaluation Banner */}
      {submitted && (
        <div
          className={`p-4 rounded-xl border space-y-2 ${
            isCorrect
              ? "bg-emerald-50/90 border-emerald-300 text-emerald-950"
              : "bg-red-50/90 border-red-300 text-red-950"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-sm">
              {isCorrect ? (
                <>
                  <Check size={18} className="text-emerald-600" />
                  <span>Excellent! Your sentence is grammatically correct.</span>
                </>
              ) : (
                <>
                  <X size={18} className="text-red-600" />
                  <span>Not quite correct. Here is the canonical order:</span>
                </>
              )}
            </div>

            <AudioButton text={exercise.sentence.chinese} size="sm" />
          </div>

          <div className="text-xl font-hanzi font-bold text-neutral-900 pt-1">
            {exercise.sentence.chinese}
          </div>
          <div className="text-sm font-mono text-neutral-600">
            {exercise.sentence.pinyin}
          </div>
          <div className="text-xs text-neutral-700">
            {exercise.sentence.english}
          </div>
        </div>
      )}

      {/* Footer Controls */}
      <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
        <button
          type="button"
          onClick={resetState}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900"
        >
          <RotateCcw size={14} />
          <span>Reset Order</span>
        </button>

        {!submitted ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              exercise.mode === "ordering"
                ? selectedTokens.length === 0
                : selectedBlank === null
            }
            className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
          >
            <span>Submit Sentence</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-semibold rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors shadow-xs"
          >
            <span>Next Exercise</span>
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
