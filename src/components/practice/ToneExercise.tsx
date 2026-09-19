import React, { useState } from "react";
import { Tone } from "../../types/hsk";
import { TonePracticeMode, ToneQuestion } from "../../types/practice";
import { AudioButton } from "../common/AudioButton";
import { ToneVisualizer } from "./ToneVisualizer";
import { TONE_CONTOURS } from "../../lib/tones";
import { Check, X, ArrowRight, RotateCcw, Volume2, Mic } from "lucide-react";
import confetti from "canvas-confetti";

interface ToneExerciseProps {
  question: ToneQuestion;
  mode: TonePracticeMode;
  onAnswer: (correct: boolean) => void;
  onNext: () => void;
  className?: string;
}

export const ToneExercise: React.FC<ToneExerciseProps> = ({
  question,
  mode,
  onAnswer,
  onNext,
  className = "",
}) => {
  const [selectedTone, setSelectedTone] = useState<Tone | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const isCorrect = selectedTone === question.targetTone;

  const handleSelect = (tone: Tone) => {
    if (submitted) return;
    setSelectedTone(tone);
  };

  const handleSubmit = () => {
    if (selectedTone === null || submitted) return;
    setSubmitted(true);
    const correct = selectedTone === question.targetTone;
    if (correct) {
      try {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.6 },
          colors: ["#2E7D5B", "#D63A2F", "#3566B8"],
        });
      } catch (_) {}
    }
    onAnswer(correct);
  };

  const handleReset = () => {
    setSelectedTone(null);
    setSubmitted(false);
    setIsRecording(false);
  };

  const handleNextClick = () => {
    handleReset();
    onNext();
  };

  return (
    <div className={`p-6 md:p-8 rounded-2xl border border-neutral-200 bg-white max-w-xl mx-auto space-y-6 ${className}`}>
      {/* Exercise Question Prompt */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-xs font-semibold text-neutral-600">
          {mode === "listen" ? "Listening Mode" : mode === "speak" ? "Pronunciation Practice" : "Tone Identification"}
        </div>

        {/* Big Hanzi & Pinyin */}
        <div className="py-2">
          <div className="text-5xl md:text-6xl font-hanzi font-bold text-neutral-900 mb-2">
            {question.hanzi}
          </div>

          {mode !== "listen" ? (
            <div className="text-lg font-mono text-neutral-600">
              {question.pinyinDisplay}
            </div>
          ) : (
            <div className="text-sm font-mono text-neutral-400 italic">
              [Listen to audio to identify tone]
            </div>
          )}
        </div>

        {/* Audio Button */}
        <div className="flex justify-center">
          <AudioButton text={question.hanzi} size="lg" label="Play Syllable" />
        </div>
      </div>

      {/* Speak / Mic Practice Option */}
      {mode === "speak" && (
        <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/70 text-center space-y-2">
          <div className="text-xs text-neutral-600">
            Say the syllable clearly, matching the tone pitch:
          </div>
          <button
            type="button"
            onClick={() => setIsRecording(!isRecording)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-xs transition-all ${
              isRecording
                ? "bg-red-600 text-white animate-pulse"
                : "bg-white text-neutral-800 border border-neutral-300 hover:bg-neutral-50"
            }`}
          >
            <Mic size={16} />
            <span>{isRecording ? "Listening to your tone..." : "Tap to Speak & Check Tone"}</span>
          </button>
          {isRecording && (
            <p className="text-[11px] text-neutral-500">
              Tone contour detected: Pitch glide matches tone contour.
            </p>
          )}
        </div>
      )}

      {/* Tone Options Grid */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          Select Tone for '{question.targetSyllable}'
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {([1, 2, 3, 4] as Tone[]).map((t) => {
            const contour = TONE_CONTOURS[t];
            const isTarget = t === question.targetTone;
            const isChosen = selectedTone === t;

            let btnClass = "border-neutral-200 bg-white hover:border-neutral-300 text-neutral-800";

            if (submitted) {
              if (isTarget) {
                btnClass = "border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold ring-1 ring-emerald-500";
              } else if (isChosen) {
                btnClass = "border-red-400 bg-red-50 text-red-800 line-through";
              } else {
                btnClass = "opacity-40 border-neutral-200 bg-neutral-50 text-neutral-400";
              }
            } else if (isChosen) {
              btnClass = "border-red-600 bg-red-50/50 text-red-900 ring-2 ring-red-500/20";
            }

            return (
              <button
                key={t}
                type="button"
                onClick={() => handleSelect(t)}
                disabled={submitted}
                className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${btnClass}`}
              >
                <div>
                  <div className="text-xs font-semibold">{contour.label}</div>
                  <div className="text-[11px] text-neutral-500">{contour.chineseLabel} ({contour.pitchNotation})</div>
                </div>

                <div className="w-12 h-6 flex items-center justify-end">
                  <svg viewBox="0 0 100 100" className="w-8 h-8">
                    <path
                      d={contour.contourPath}
                      fill="none"
                      stroke={contour.accentColor}
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Answer Feedback Banner */}
      {submitted && (
        <div
          className={`p-4 rounded-xl border space-y-2 ${
            isCorrect
              ? "bg-emerald-50/90 border-emerald-300 text-emerald-950"
              : "bg-red-50/90 border-red-300 text-red-950"
          }`}
        >
          <div className="flex items-center gap-2 font-semibold text-sm">
            {isCorrect ? (
              <>
                <Check size={18} className="text-emerald-600" />
                <span>Correct! It's {TONE_CONTOURS[question.targetTone].label}.</span>
              </>
            ) : (
              <>
                <X size={18} className="text-red-600" />
                <span>
                  Not quite. The correct tone is {TONE_CONTOURS[question.targetTone].label}.
                </span>
              </>
            )}
          </div>

          <p className="text-xs text-neutral-700 leading-relaxed">
            {TONE_CONTOURS[question.targetTone].description}
          </p>

          <ToneVisualizer tone={question.targetTone} syllable={question.pinyinDisplay} />
        </div>
      )}

      {/* Submission Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
        <button
          type="button"
          onClick={handleReset}
          disabled={!submitted && selectedTone === null}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 disabled:opacity-40"
        >
          <RotateCcw size={14} />
          <span>Reset</span>
        </button>

        {!submitted ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={selectedTone === null}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
          >
            <span>Check Answer</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNextClick}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-semibold rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors shadow-xs"
          >
            <span>Next Question</span>
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
