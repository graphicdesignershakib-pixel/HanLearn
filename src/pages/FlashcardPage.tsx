import React, { useState, useEffect } from "react";
import {
  RotateCcw,
  Volume2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  Clock,
  Layers,
  Star,
  Globe,
} from "lucide-react";
import { HskLevel, VocabularyWord } from "../types/hsk";
import { ALL_HSK_LEVELS, vocabularyService } from "../services/vocabularyService";
import { progressService } from "../services/progressService";
import { audioService } from "../services/audioService";
import { gamificationService } from "../services/gamificationService";
import { bengaliService } from "../services/bengaliService";
import { HSKBadge } from "../components/common/HSKBadge";

export const FlashcardPage: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<HskLevel | "all">("1");
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [autoPlayAudio, setAutoPlayAudio] = useState(true);
  const [isBn, setIsBn] = useState(bengaliService.getLanguage() === "bn");
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  useEffect(() => {
    const unsub = bengaliService.subscribe(() => {
      setIsBn(bengaliService.getLanguage() === "bn");
    });
    return unsub;
  }, []);

  useEffect(() => {
    let list: VocabularyWord[] = [];
    if (selectedLevel === "all") {
      list = vocabularyService.getAllWords().slice(0, 30);
    } else {
      list = vocabularyService.getWordsByLevel(selectedLevel).slice(0, 30);
    }
    setWords(list);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionCompleted(false);
  }, [selectedLevel]);

  const currentWord = words[currentIndex];

  useEffect(() => {
    if (currentWord && autoPlayAudio && !isFlipped) {
      audioService.speakWord(currentWord.id);
    }
  }, [currentIndex, currentWord, autoPlayAudio]);

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleRate = (rating: "again" | "hard" | "good" | "easy") => {
    if (!currentWord) return;

    // Record review in progressService SRS scheduler
    progressService.recordReview(currentWord.id, rating);

    // Gamification progress
    gamificationService.addXp(10, "Flashcard reviewed");
    gamificationService.progressQuest("quest_flashcards", 1);
    setReviewedCount((prev) => {
      const next = prev + 1;
      if (next >= 25) {
        gamificationService.unlockBadge("srs_champion");
      }
      return next;
    });

    if (currentIndex + 1 < words.length) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    } else {
      setSessionCompleted(true);
      gamificationService.addXp(50, "Completed flashcard deck session");
    }
  };

  const restartDeck = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionCompleted(false);
  };

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentWord) {
      audioService.speakWord(currentWord.id);
    }
  };

  const bengaliMeaning = currentWord
    ? bengaliService.getBengaliWordMeaning(currentWord.hanzi)
    : null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-red-100 text-red-700">
              <Layers size={18} />
            </span>
            <h1 className="text-xl font-bold text-neutral-900 font-serif">
              {isBn ? "স্পেসড রিপিটেশন (SRS) ফ্ল্যাশকার্ড" : "Spaced Repetition Flashcards"}
            </h1>
          </div>
          <p className="text-xs text-neutral-500">
            {isBn
              ? "বৈজ্ঞানিক SM-2 অ্যালগরিদম অনুযায়ী কার্ডগুলো স্মৃতিতে দীর্ঘদিন স্থায়ী হয়।"
              : "Review vocabulary with the SuperMemo SM-2 spacing algorithm to maximize retention."}
          </p>
        </div>

        {/* Level Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {ALL_HSK_LEVELS.slice(0, 6).map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3 py-1 text-xs rounded-lg font-semibold transition-colors cursor-pointer ${
                selectedLevel === lvl
                  ? "bg-red-600 text-white shadow-xs"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              HSK {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Session Progress & Controls */}
      <div className="flex items-center justify-between text-xs text-neutral-500 px-1">
        <div className="flex items-center gap-3">
          <span>
            {isBn ? "কার্ড:" : "Card:"}{" "}
            <strong className="text-neutral-900">
              {Math.min(currentIndex + 1, words.length)}
            </strong>{" "}
            / {words.length}
          </span>
          <span>
            {isBn ? "আজ পর্যালোচিত:" : "Reviewed today:"}{" "}
            <strong className="text-emerald-600">{reviewedCount}</strong>
          </span>
        </div>

        <button
          type="button"
          onClick={() => setAutoPlayAudio(!autoPlayAudio)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors cursor-pointer ${
            autoPlayAudio
              ? "bg-red-50 text-red-700 border-red-200"
              : "bg-neutral-50 text-neutral-500 border-neutral-200"
          }`}
        >
          <Volume2 size={12} />
          <span>{autoPlayAudio ? (isBn ? "অটো-অডিও চালু" : "Auto-audio: On") : (isBn ? "অটো-অডিও বন্ধ" : "Auto-audio: Off")}</span>
        </button>
      </div>

      {/* Main Flashcard Card */}
      {!sessionCompleted && currentWord && (
        <div className="space-y-6">
          <div
            onClick={handleFlip}
            className={`min-h-[380px] sm:min-h-[420px] bg-white rounded-3xl border border-neutral-200 shadow-md p-8 sm:p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 hover:border-red-300 relative group select-none ${
              isFlipped ? "bg-gradient-to-b from-white to-neutral-50/80" : ""
            }`}
          >
            {/* Top Bar on Card */}
            <div className="absolute top-5 left-5 right-5 flex items-center justify-between text-xs text-neutral-400">
              <HSKBadge level={currentWord.hskLevel} size="sm" />
              <button
                type="button"
                onClick={handleSpeak}
                className="p-2 rounded-full bg-neutral-100 hover:bg-red-50 hover:text-red-600 text-neutral-600 transition-colors"
                title="Pronounce Character"
              >
                <Volume2 size={16} />
              </button>
            </div>

            {/* Card Content (Front vs Back) */}
            {!isFlipped ? (
              // FRONT OF CARD
              <div className="space-y-4 my-auto">
                <div className="relative inline-block p-4 border border-dashed border-red-200 rounded-2xl bg-red-50/20">
                  <span className="text-6xl sm:text-8xl font-hanzi font-bold text-neutral-900 tracking-wider">
                    {currentWord.hanzi}
                  </span>
                </div>
                <p className="text-xs text-neutral-400">
                  {isBn ? "কার্ড উল্টাতে ট্যাপ করুন (বা স্পেস চাপুন)" : "Tap anywhere or press Space to reveal answer"}
                </p>
              </div>
            ) : (
              // BACK OF CARD
              <div className="space-y-4 my-auto animate-in fade-in zoom-in-95 duration-200">
                <span className="text-4xl sm:text-5xl font-hanzi font-bold text-neutral-900 block">
                  {currentWord.hanzi}
                </span>

                <div className="text-xl sm:text-2xl font-mono text-red-600 font-semibold tracking-wide">
                  {currentWord.pinyinDisplay}
                </div>

                {/* Parts of speech */}
                {currentWord.definitions[0]?.partOfSpeech && (
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {currentWord.definitions[0].partOfSpeech.map((pos, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 uppercase"
                      >
                        {pos}
                      </span>
                    ))}
                  </div>
                )}

                {/* English & Bengali Definitions */}
                <div className="space-y-1.5 max-w-md pt-2">
                  <p className="text-base text-neutral-800 font-medium leading-relaxed">
                    {currentWord.definitions.map((d) => d.text).join("; ")}
                  </p>
                  {bengaliMeaning && (
                    <div className="inline-block px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bangla font-semibold">
                      বাংলা: {bengaliMeaning}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Bottom Flip Hint */}
            <div className="absolute bottom-4 text-[11px] text-neutral-400 flex items-center gap-1">
              <RotateCcw size={12} />
              <span>{isFlipped ? (isBn ? "সামনে যেতে ট্যাপ করুন" : "Tap to show front") : (isBn ? "উত্তর দেখতে ট্যাপ করুন" : "Tap to reveal answer")}</span>
            </div>
          </div>

          {/* Anki SM-2 Rating Buttons (Enabled when flipped) */}
          <div className="space-y-2">
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => handleRate("again")}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 transition-all cursor-pointer shadow-xs"
              >
                <span className="font-bold text-xs sm:text-sm">
                  {isBn ? "আবার" : "Again"}
                </span>
                <span className="text-[10px] text-rose-600">&lt; 1 min</span>
              </button>

              <button
                type="button"
                onClick={() => handleRate("hard")}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 transition-all cursor-pointer shadow-xs"
              >
                <span className="font-bold text-xs sm:text-sm">
                  {isBn ? "কঠিন" : "Hard"}
                </span>
                <span className="text-[10px] text-amber-600">12 hrs</span>
              </button>

              <button
                type="button"
                onClick={() => handleRate("good")}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 transition-all cursor-pointer shadow-xs"
              >
                <span className="font-bold text-xs sm:text-sm">
                  {isBn ? "ভালো" : "Good"}
                </span>
                <span className="text-[10px] text-emerald-600">1 day</span>
              </button>

              <button
                type="button"
                onClick={() => handleRate("easy")}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 transition-all cursor-pointer shadow-xs"
              >
                <span className="font-bold text-xs sm:text-sm">
                  {isBn ? "সহজ" : "Easy"}
                </span>
                <span className="text-[10px] text-blue-600">4 days</span>
              </button>
            </div>
            <p className="text-[11px] text-center text-neutral-400">
              {isBn ? "আপনার আত্মবিশ্বাস অনুযায়ী রেটিং দিন, অ্যালগরিদম স্বয়ংক্রিয়ভাবে পরবর্তী দিন নির্ধারণ করবে।" : "Rate honestly. Spaced Repetition optimizes long-term memory consolidation."}
            </p>
          </div>
        </div>
      )}

      {/* Session Completed State */}
      {sessionCompleted && (
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-md p-8 sm:p-12 text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 size={36} />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-neutral-900 font-serif">
              {isBn ? "অভিনন্দন! ডেক সম্পূর্ণ হয়েছে" : "Session Complete!"}
            </h2>
            <p className="text-sm text-neutral-500">
              {isBn
                ? `আপনি সফলভাবে ${words.length}টি শব্দ পর্যালোচনা করেছেন এবং +50 XP অর্জন করেছেন!`
                : `You reviewed all ${words.length} words in this set and earned +50 XP!`}
            </p>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <button
              type="button"
              onClick={restartDeck}
              className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              {isBn ? "আবার রিভিউ করুন" : "Review Again"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
