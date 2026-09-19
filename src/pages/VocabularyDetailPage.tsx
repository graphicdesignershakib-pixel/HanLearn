import React, { useState, useEffect } from "react";
import { vocabularyService } from "../services/vocabularyService";
import { progressService } from "../services/progressService";
import { reviewScheduler } from "../services/reviewScheduler";
import { navigate } from "../services/routerService";
import { HSKBadge } from "../components/common/HSKBadge";
import { AudioButton } from "../components/common/AudioButton";
import { FavoriteButton } from "../components/common/FavoriteButton";
import { PinyinDisplay } from "../components/vocabulary/PinyinDisplay";
import { DefinitionBlock } from "../components/vocabulary/DefinitionBlock";
import { CharacterCard } from "../components/vocabulary/CharacterCard";
import { ExampleSentenceCard } from "../components/vocabulary/ExampleSentenceCard";
import { StrokeOrderViewer } from "../components/stroke/StrokeOrderViewer";
import { ToneVisualizer } from "../components/practice/ToneVisualizer";
import { bengaliService } from "../services/bengaliService";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Volume2,
  Edit3,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  Bot,
  Compass,
  Check,
  Zap,
} from "lucide-react";
import { ReviewRating, WordProgress } from "../types/progress";

interface VocabularyDetailPageProps {
  id: string;
}

export const VocabularyDetailPage: React.FC<VocabularyDetailPageProps> = ({ id }) => {
  const word = vocabularyService.getWordById(id);
  const [progress, setProgress] = useState<WordProgress | null>(() =>
    word ? progressService.getProgress(word.id) : null
  );
  const [isBn, setIsBn] = useState(bengaliService.getLanguage() === "bn");

  useEffect(() => {
    const unsubB = bengaliService.subscribe(() => {
      setIsBn(bengaliService.getLanguage() === "bn");
    });
    return unsubB;
  }, []);

  useEffect(() => {
    if (word) {
      setProgress(progressService.getProgress(word.id));
      // Mark as viewed/learned if previously unseen
      const current = progressService.getProgress(word.id);
      if (!current || current.status === "unseen") {
        progressService.updateWordStatus(word.id, "learning");
        setProgress(progressService.getProgress(word.id));
      }
    }
  }, [word?.id]);

  if (!word) {
    return (
      <div className="p-12 text-center max-w-md mx-auto space-y-4">
        <h2 className="text-xl font-bold text-neutral-900">Vocabulary Item Not Found</h2>
        <p className="text-sm text-neutral-500">The requested word could not be found in the HSK dataset.</p>
        <button
          type="button"
          onClick={() => navigate("/vocabulary")}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-neutral-900 text-white"
        >
          Return to Vocabulary List
        </button>
      </div>
    );
  }

  // Next & previous words in the same level
  const levelWords = vocabularyService.getWordsByLevel(word.hskLevel);
  const currentIndex = levelWords.findIndex((w) => w.id === word.id);
  const prevWord = currentIndex > 0 ? levelWords[currentIndex - 1] : null;
  const nextWord = currentIndex < levelWords.length - 1 ? levelWords[currentIndex + 1] : null;

  // Characters in this word
  const characters = vocabularyService.getCharactersForWord(word);

  // Example sentences for this word
  const sentences = vocabularyService.getSentencesForWord(word.id);

  // Handle SRS rating buttons
  const handleRating = (rating: ReviewRating) => {
    reviewScheduler.recordReview(word.id, rating);
    setProgress(progressService.getProgress(word.id));
  };

  const status = progress?.status || "learning";

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(`/hsk/${word.hskLevel}`)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to HSK {word.hskLevel}</span>
        </button>

        <div className="flex items-center gap-2 text-xs">
          {prevWord && (
            <button
              type="button"
              onClick={() => navigate(`/vocabulary/${prevWord.id}`)}
              className="p-1.5 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
              title={`Previous: ${prevWord.hanzi}`}
            >
              <ArrowLeft size={14} />
            </button>
          )}
          <span className="font-mono text-neutral-500">
            {currentIndex + 1} / {levelWords.length}
          </span>
          {nextWord && (
            <button
              type="button"
              onClick={() => navigate(`/vocabulary/${nextWord.id}`)}
              className="p-1.5 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
              title={`Next: ${nextWord.hanzi}`}
            >
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Primary Word Card Header */}
      <div className="rounded-3xl border border-neutral-200 bg-white p-6 md:p-10 shadow-xs space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <HSKBadge level={word.hskLevel} size="md" />
            <span className="text-xs font-mono text-neutral-600">
              ID: {word.id}
            </span>
            <select
              value={status}
              onChange={(e) => {
                progressService.updateWordStatus(word.id, e.target.value as any);
                setProgress(progressService.getProgress(word.id));
              }}
              className="text-xs font-medium py-1 px-2.5 rounded-md border border-neutral-200 bg-neutral-50 text-neutral-700 focus:outline-none"
            >
              <option value="unseen">Status: New</option>
              <option value="learning">Status: Learning</option>
              <option value="familiar">Status: Familiar</option>
              <option value="mastered">Status: Mastered</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                navigate(
                  `/chat?q=${encodeURIComponent(
                    `Explain how to use the word ${word.hanzi} (${word.pinyinDisplay}), common collocations, and give 3 realistic example sentences.`
                  )}`
                )
              }
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 bg-neutral-50 hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-neutral-700 text-xs font-semibold transition-colors cursor-pointer"
              title="Ask HanBot AI Tutor about this word"
            >
              <Bot size={14} className="text-red-600" />
              <span className="hidden sm:inline">Ask AI Tutor</span>
            </button>
            <AudioButton wordId={word.id} size="md" showSlowToggle />
            <FavoriteButton wordId={word.id} size="md" />
          </div>
        </div>

        {/* Big Word Typography */}
        <div className="space-y-3">
          <div className="text-6xl md:text-7xl font-bold font-hanzi text-neutral-900 tracking-tight">
            {word.hanzi}
          </div>
          <div className="flex items-center gap-3">
            <PinyinDisplay syllables={word.syllables} wordId={word.id} size="xl" />
          </div>
        </div>

        {/* Definitions & Provenance */}
        <div className="pt-4 border-t border-neutral-100">
          <DefinitionBlock
            definitions={word.definitions}
            alternateReadings={word.alternateReadings}
            sourceFile={word.sourceFile}
            sourcePage={word.sourcePage}
            sourceLabel={word.sourceLabel}
          />
        </div>

        {/* Spaced Repetition Study Feedback Controls */}
        <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs space-y-0.5 text-center sm:text-left">
            <span className="font-semibold text-neutral-900 block">Rate Word Recall:</span>
            <span className="text-neutral-500">
              Times reviewed: {progress?.timesReviewed || 0} · Confidence: {progress?.confidenceScore || 0}%
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleRating("again")}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-red-200 text-red-700 hover:bg-red-50"
            >
              Again (Hard)
            </button>
            <button
              type="button"
              onClick={() => handleRating("hard")}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-amber-200 text-amber-700 hover:bg-amber-50"
            >
              Hard
            </button>
            <button
              type="button"
              onClick={() => handleRating("good")}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              Good
            </button>
            <button
              type="button"
              onClick={() => handleRating("easy")}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Easy (Mastered)
            </button>
          </div>
        </div>
      </div>

      {/* 12-Step Complete Mastery Learning Flow */}
      <div className="rounded-3xl border border-neutral-200 bg-white p-6 md:p-8 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="space-y-0.5">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-red-600">
              <Zap size={13} />
              <span>HSK 3.0 Standardized Learning Flow</span>
            </div>
            <h3 className="text-base font-bold text-neutral-900">
              {isBn ? "১২-ধাপ বিশিষ্ট শব্দ দক্ষতা পর্যবেক্ষণ" : "12-Step Word Mastery Pipeline"}
            </h3>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700">
            {progress?.status === "mastered" ? "12/12 Completed" : "In Progress"}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 pt-2">
          {[
            { step: 1, label: "Hanzi Recognition", sub: "Shape & Visual Form", done: true },
            { step: 2, label: "Native Audio", sub: "Accurate Phonetics", done: true },
            { step: 3, label: "Tone Contour", sub: "Pitch Frequency", done: true },
            { step: 4, label: "Stroke Order", sub: "Tian Zi Ge Grid", done: true },
            { step: 5, label: "Radical Logic", sub: "Semantic Component", done: characters.length > 0 },
            { step: 6, label: "Definitions", sub: "HSK 3.0 POS & Register", done: true },
            { step: 7, label: "Bengali Sense", sub: "Contextual Translation", done: !!bengaliService.getBengaliWordMeaning(word.hanzi) },
            { step: 8, label: "Sentence Context", sub: "Collocations & Syntax", done: sentences.length > 0 },
            { step: 9, label: "Dictation Check", sub: "Audio Transcription", done: (progress?.timesReviewed || 0) > 0 },
            { step: 10, label: "AI Consultation", sub: "Ask HanBot Nuances", done: false },
            { step: 11, label: "SRS Interval", sub: "SM-2 Algorithmic Queue", done: (progress?.timesReviewed || 0) > 0 },
            { step: 12, label: "Mock Exam Ready", sub: "Certified for HSK", done: progress?.status === "mastered" },
          ].map((item) => (
            <div
              key={item.step}
              className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                item.done
                  ? "bg-emerald-50/60 border-emerald-200/80 text-emerald-950"
                  : "bg-neutral-50/60 border-neutral-200/70 text-neutral-700"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                  item.done
                    ? "bg-emerald-600 text-white"
                    : "bg-neutral-200 text-neutral-600"
                }`}
              >
                {item.done ? <Check size={11} /> : item.step}
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="text-xs font-bold truncate leading-tight">
                  {item.label}
                </div>
                <div className="text-[10px] text-neutral-600 truncate">
                  {item.sub}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Stroke Order Animation & Tone Contours */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Stroke Order Animation Stage */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <Edit3 size={18} className="text-red-600" />
              <span>Stroke Order & Writing</span>
            </h3>
            <button
              type="button"
              onClick={() => navigate(`/writing/${encodeURIComponent(word.hanzi[0])}`)}
              className="text-xs font-semibold text-red-600 hover:text-red-700"
            >
              Open Interactive Handwriting Lab →
            </button>
          </div>

          <StrokeOrderViewer character={word.hanzi[0]} size={260} />
        </div>

        {/* Tone Contour Visualizer */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <Volume2 size={18} className="text-blue-600" />
              <span>Tone Analysis & Pitch</span>
            </h3>
            <button
              type="button"
              onClick={() => navigate(`/practice/tones`)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Tone Practice Exercises →
            </button>
          </div>

          <div className="space-y-3">
            {word.syllables.map((s, idx) => (
              <ToneVisualizer
                key={idx}
                tone={s.tone}
                syllable={s.display}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Character Breakdown Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-neutral-900">
            Character Component Breakdown ({characters.length})
          </h3>
          <button
            type="button"
            onClick={() => navigate("/etymology")}
            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Explore Etymology Tree →</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {characters.map((char) => (
            <CharacterCard key={char.hanzi} character={char} />
          ))}
        </div>
      </div>

      {/* Example Sentences */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-neutral-900">
            Example Sentences & Context
          </h3>
          <button
            type="button"
            onClick={() => navigate("/practice/sentences")}
            className="text-xs font-semibold text-red-600 hover:text-red-700"
          >
            Practice Sentence Building →
          </button>
        </div>

        {sentences.length === 0 ? (
          <div className="p-6 text-center rounded-xl border border-dashed border-neutral-200 bg-white text-xs text-neutral-500">
            No example sentences loaded for this word yet.
          </div>
        ) : (
          <div className="space-y-3">
            {sentences.map((sentence) => (
              <ExampleSentenceCard
                key={sentence.id}
                sentence={sentence}
                targetWord={word}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
