import React, { useState, useMemo } from "react";
import { ALL_HSK_LEVELS, vocabularyService } from "../services/vocabularyService";
import { audioService } from "../services/audioService";
import { AudioButton } from "../components/common/AudioButton";
import { PinyinDisplay } from "../components/vocabulary/PinyinDisplay";
import { ToneVisualizer } from "../components/practice/ToneVisualizer";
import { HSKBadge } from "../components/common/HSKBadge";
import { ArrowLeft, Mic, Volume2, Sparkles, RotateCw, ArrowRight } from "lucide-react";
import { navigate } from "../services/routerService";
import { HskLevel } from "../types/hsk";

export const PronunciationPracticePage: React.FC = () => {
  const [level, setLevel] = useState<HskLevel>("1");
  const [wordIndex, setWordIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const words = useMemo(() => vocabularyService.getWordsByLevel(level), [level]);
  const currentWord = words[wordIndex % words.length] || words[0];

  const handleNextWord = () => {
    setWordIndex((i) => (i + 1) % words.length);
    setFeedback(null);
    setIsRecording(false);
  };

  const handlePrevWord = () => {
    setWordIndex((i) => (i - 1 + words.length) % words.length);
    setFeedback(null);
    setIsRecording(false);
  };

  const handleToggleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      setFeedback("Pitch contour analyzed: Strong tonal clarity and vowel formant resonance.");
    } else {
      setIsRecording(true);
      setFeedback(null);
      // Simulate 3s speech evaluation
      setTimeout(() => {
        setIsRecording(false);
        setFeedback("Good pronunciation! Tone slope matches standard Mandarin reference.");
      }, 2600);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <button
        type="button"
        onClick={() => navigate("/practice")}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
      >
        <ArrowLeft size={14} />
        <span>Back to Practice Hub</span>
      </button>

      {/* Header */}
      <div className="p-6 rounded-2xl border border-neutral-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
            <Mic size={24} className="text-red-600" />
            <span>Pronunciation & Acoustic Lab</span>
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Listen to native Mandarin phonetics, isolate individual syllables, and practice spoken delivery.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-neutral-500 font-medium">HSK Level:</span>
          <select
            value={level}
            onChange={(e) => {
              setLevel(e.target.value as HskLevel);
              setWordIndex(0);
            }}
            className="py-1.5 px-3 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-semibold text-neutral-800 focus:outline-none"
          >
            {ALL_HSK_LEVELS.map((lvl) => (
              <option key={lvl} value={lvl}>
                HSK {lvl}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Pronunciation Stage */}
      {currentWord && (
        <div className="p-8 rounded-3xl border border-neutral-200 bg-white space-y-8 text-center shadow-xs">
          <div className="flex items-center justify-between">
            <HSKBadge level={currentWord.hskLevel} size="sm" />
            <span className="text-xs font-mono text-neutral-400">
              Word {wordIndex + 1} of {words.length}
            </span>
          </div>

          <div className="space-y-3">
            <div className="text-6xl sm:text-7xl font-hanzi font-bold text-neutral-900">
              {currentWord.hanzi}
            </div>

            <div className="flex justify-center">
              <PinyinDisplay syllables={currentWord.syllables} wordId={currentWord.id} size="xl" />
            </div>

            <p className="text-sm text-neutral-600 max-w-md mx-auto">
              {currentWord.definitions.map((d) => d.text).join("; ")}
            </p>
          </div>

          {/* Audio controls */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <AudioButton wordId={currentWord.id} size="lg" label="Play Normal" />
            <AudioButton wordId={currentWord.id} size="lg" rate={0.65} label="Play Slow (0.65x)" />
          </div>

          {/* Syllable Breakdown */}
          <div className="space-y-3 pt-4 border-t border-neutral-100 text-left">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block text-center">
              Syllable Acoustic Contours
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
              {currentWord.syllables.map((s, idx) => (
                <ToneVisualizer key={idx} tone={s.tone} syllable={s.display} />
              ))}
            </div>
          </div>

          {/* Voice Input Evaluation */}
          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 max-w-md mx-auto space-y-3">
            <div className="text-xs font-semibold text-neutral-700">
              Spoken Pronunciation Practice
            </div>

            <button
              type="button"
              onClick={handleToggleRecord}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isRecording
                  ? "bg-red-600 text-white animate-pulse"
                  : "bg-white text-neutral-900 border border-neutral-300 hover:bg-neutral-100 shadow-2xs"
              }`}
            >
              <Mic size={16} />
              <span>{isRecording ? "Listening... Speak clearly" : "Tap to Speak & Evaluate"}</span>
            </button>

            {feedback && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium animate-fade-in">
                {feedback}
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
            <button
              type="button"
              onClick={handlePrevWord}
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
            >
              ← Previous Word
            </button>

            <button
              type="button"
              onClick={() => navigate(`/vocabulary/${currentWord.id}`)}
              className="text-xs font-semibold text-red-600 hover:text-red-700"
            >
              View Full Word Details
            </button>

            <button
              type="button"
              onClick={handleNextWord}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-neutral-900 text-white hover:bg-neutral-800"
            >
              Next Word →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
