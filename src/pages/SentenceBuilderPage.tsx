import React, { useState, useEffect } from "react";
import { audioService } from "../services/audioService";
import { bengaliService } from "../services/bengaliService";
import { mistakeService } from "../services/mistakeService";
import { dailyMissionService } from "../services/dailyMissionService";
import {
  Sparkles,
  Volume2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  Layers,
  HelpCircle,
} from "lucide-react";
import confetti from "canvas-confetti";

interface SentenceExerciseItem {
  id: string;
  hskLevel: "1" | "2" | "3" | "4";
  targetMeaning: string;
  bengaliMeaning: string;
  fullChinese: string;
  fullPinyin: string;
  tokens: string[];
  correctOrder: string[];
}

const SENTENCE_EXERCISES: SentenceExerciseItem[] = [
  {
    id: "se-1",
    hskLevel: "1",
    targetMeaning: "I am a student at this school.",
    bengaliMeaning: "আমি এই স্কুলের একজন শিক্ষার্থী।",
    fullChinese: "我是这个学校的学生。",
    fullPinyin: "Wǒ shì zhège xuéxiào de xuésheng.",
    tokens: ["学生", "是", "我", "这个学校的"],
    correctOrder: ["我", "是", "这个学校的", "学生"],
  },
  {
    id: "se-2",
    hskLevel: "1",
    targetMeaning: "Do you like drinking Chinese tea?",
    bengaliMeaning: "আপনি কি চীনা চা পান করতে পছন্দ করেন?",
    fullChinese: "你喜欢喝中国茶吗？",
    fullPinyin: "Nǐ xǐhuan hē Zhōngguó chá ma?",
    tokens: ["中国茶", "喜欢", "吗？", "你", "喝"],
    correctOrder: ["你", "喜欢", "喝", "中国茶", "吗？"],
  },
  {
    id: "se-3",
    hskLevel: "2",
    targetMeaning: "Today is much colder than yesterday.",
    bengaliMeaning: "আজ গতকালের চেয়ে অনেক বেশি ঠান্ডা।",
    fullChinese: "今天比昨天冷得多。",
    fullPinyin: "Jīntiān bǐ zuótiān lěng de duō.",
    tokens: ["比", "冷得多", "今天", "昨天"],
    correctOrder: ["今天", "比", "昨天", "冷得多"],
  },
  {
    id: "se-4",
    hskLevel: "2",
    targetMeaning: "I will go to the library right after breakfast.",
    bengaliMeaning: "আমি সকালের নাস্তা করেই লাইব্রেরিতে যাব।",
    fullChinese: "我吃了早饭就去图书馆。",
    fullPinyin: "Wǒ chī le zǎofàn jiù qù túshūguǎn.",
    tokens: ["吃了早饭", "图书馆", "去", "就", "我"],
    correctOrder: ["我", "吃了早饭", "就", "去", "图书馆"],
  },
  {
    id: "se-5",
    hskLevel: "3",
    targetMeaning: "Please close the door gently.",
    bengaliMeaning: "দয়া করে দরজাটি আস্তে করে বন্ধ করুন।",
    fullChinese: "请把门轻轻关上。",
    fullPinyin: "Qǐng bǎ mén qīngqīng guān shàng.",
    tokens: ["轻轻关上", "门", "请", "把"],
    correctOrder: ["请", "把", "门", "轻轻关上"],
  },
  {
    id: "se-6",
    hskLevel: "3",
    targetMeaning: "My mobile phone was forgotten at home by me.",
    bengaliMeaning: "আমার মোবাইল ফোনটি আমি বাড়িতে ফেলে এসেছি।",
    fullChinese: "我把手机忘在家里了。",
    fullPinyin: "Wǒ bǎ shǒujī wàng zài jiā lǐ le.",
    tokens: ["手机", "我", "忘在家里了", "把"],
    correctOrder: ["我", "把", "手机", "忘在家里了"],
  },
  {
    id: "se-7",
    hskLevel: "4",
    targetMeaning: "The more Chinese characters I study, the more interesting they become.",
    bengaliMeaning: "হানজি যত বেশি পড়বেন, তত বেশি আকর্ষণীয় লাগবে।",
    fullChinese: "汉字越学越有意思。",
    fullPinyin: "Hànzì yuè xué yuè yǒu yìsi.",
    tokens: ["越有意思", "越学", "汉字"],
    correctOrder: ["汉字", "越学", "越有意思"],
  },
];

export const SentenceBuilderPage: React.FC = () => {
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [availableTokens, setAvailableTokens] = useState<string[]>([]);
  const [resultStatus, setResultStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [showPinyinHint, setShowPinyinHint] = useState(false);
  const [isBn, setIsBn] = useState(bengaliService.getLanguage() === "bn");

  const filteredExercises = levelFilter === "all"
    ? SENTENCE_EXERCISES
    : SENTENCE_EXERCISES.filter((ex) => ex.hskLevel === levelFilter);

  const currentExercise = filteredExercises[currentIndex % filteredExercises.length] || SENTENCE_EXERCISES[0];

  useEffect(() => {
    const unsub = bengaliService.subscribe(() => setIsBn(bengaliService.getLanguage() === "bn"));
    return unsub;
  }, []);

  // Shuffle tokens when exercise changes
  useEffect(() => {
    if (currentExercise) {
      const shuffled = [...currentExercise.tokens].sort(() => Math.random() - 0.5);
      setAvailableTokens(shuffled);
      setSelectedTokens([]);
      setResultStatus("idle");
      setShowPinyinHint(false);
    }
  }, [currentIndex, levelFilter, currentExercise]);

  const handleSelectToken = (token: string, index: number) => {
    if (resultStatus === "correct") return;
    setSelectedTokens((prev) => [...prev, token]);
    setAvailableTokens((prev) => prev.filter((_, i) => i !== index));
    setResultStatus("idle");
  };

  const handleDeselectToken = (token: string, index: number) => {
    if (resultStatus === "correct") return;
    setSelectedTokens((prev) => prev.filter((_, i) => i !== index));
    setAvailableTokens((prev) => [...prev, token]);
    setResultStatus("idle");
  };

  const handleReset = () => {
    const shuffled = [...currentExercise.tokens].sort(() => Math.random() - 0.5);
    setAvailableTokens(shuffled);
    setSelectedTokens([]);
    setResultStatus("idle");
  };

  const handleCheck = () => {
    const isMatch = selectedTokens.length === currentExercise.correctOrder.length &&
      selectedTokens.every((val, idx) => val === currentExercise.correctOrder[idx]);

    if (isMatch) {
      setResultStatus("correct");
      audioService.speakText(currentExercise.fullChinese);
      try {
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
      } catch (e) {}
      dailyMissionService.recordTaskProgress("task-vocab", 1);
    } else {
      setResultStatus("wrong");
      mistakeService.addMistake({
        sourceModule: "sentence",
        skill: "grammar",
        hskLevel: currentExercise.hskLevel,
        questionPrompt: `Construct sentence: "${currentExercise.targetMeaning}"`,
        userAnswer: selectedTokens.join(" "),
        correctAnswer: currentExercise.correctOrder.join(" "),
        explanation: `Word order pattern: ${currentExercise.fullChinese} (${currentExercise.fullPinyin})`,
      });
    }
  };

  const handleNext = () => {
    setCurrentIndex((i) => i + 1);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 md:p-8 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
              <Sparkles size={14} />
              <span>INTERACTIVE SENTENCE BUILDER</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight">
              {isBn ? "বাক্য গঠন ল্যাব" : "Assemble Chinese Sentences"}
            </h1>
            <p className="text-xs md:text-sm text-neutral-600 max-w-xl">
              {isBn
                ? "শব্দটুকরোগুলো সঠিক ব্যাকরণিক ক্রমে সাজিয়ে পূর্ণাঙ্গ চীনা বাক্য গঠন করুন।"
                : "Assemble scrambled word tokens into accurate Chinese sentence structures. Master aspect markers, disposal sentences, and time-place-action order."}
            </p>
          </div>

          {/* Level Filter */}
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl shrink-0">
            {["all", "1", "2", "3", "4"].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => {
                  setLevelFilter(lvl);
                  setCurrentIndex(0);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  levelFilter === lvl
                    ? "bg-white text-neutral-900 shadow-xs"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                {lvl === "all" ? "All" : `HSK ${lvl}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Assembly Studio */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 md:p-8 space-y-8 shadow-xs">
        {/* Progress & Target Meaning */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-neutral-600">
            <span className="font-bold">
              Exercise {currentIndex + 1} of {filteredExercises.length} (HSK {currentExercise.hskLevel})
            </span>
            <button
              type="button"
              onClick={() => setShowPinyinHint(!showPinyinHint)}
              className="text-indigo-600 font-bold hover:underline cursor-pointer"
            >
              {showPinyinHint ? "Hide Pinyin Hint" : "Show Pinyin Hint"}
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-100 text-center space-y-1">
            <div className="text-xs text-neutral-600 font-semibold uppercase tracking-wider">
              Target English Meaning
            </div>
            <div className="text-base md:text-lg font-bold text-neutral-900">
              "{currentExercise.targetMeaning}"
            </div>
            {isBn && (
              <div className="text-xs text-neutral-600 italic">
                "{currentExercise.bengaliMeaning}"
              </div>
            )}
            {showPinyinHint && (
              <div className="text-xs font-mono text-red-600 pt-1">
                {currentExercise.fullPinyin}
              </div>
            )}
          </div>
        </div>

        {/* Selected Tokens Droppable Area */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
            Your Sentence Structure:
          </div>
          <div className="min-h-24 p-4 rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50/50 flex flex-wrap items-center gap-2.5">
            {selectedTokens.length === 0 ? (
              <span className="text-xs text-neutral-400 italic mx-auto">
                Click available word tiles below to place them in order here...
              </span>
            ) : (
              selectedTokens.map((token, idx) => (
                <button
                  key={`${token}-${idx}`}
                  type="button"
                  onClick={() => handleDeselectToken(token, idx)}
                  className="px-4 py-2.5 rounded-xl bg-white border border-neutral-200 text-neutral-900 font-hanzi font-bold text-base shadow-xs hover:border-red-300 hover:text-red-600 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>{token}</span>
                  <span className="text-[10px] text-neutral-400 font-normal">×</span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Available Scrambled Tiles */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
            Available Word Tokens:
          </div>
          <div className="flex flex-wrap gap-2.5">
            {availableTokens.map((token, idx) => (
              <button
                key={`${token}-${idx}`}
                type="button"
                onClick={() => handleSelectToken(token, idx)}
                className="px-4 py-2.5 rounded-xl bg-indigo-50/70 border border-indigo-200 hover:bg-indigo-100 text-indigo-950 font-hanzi font-bold text-base shadow-xs transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                {token}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback Banner */}
        {resultStatus !== "idle" && (
          <div
            className={`p-4 rounded-2xl text-xs font-medium space-y-1.5 ${
              resultStatus === "correct"
                ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                : "bg-rose-50 text-rose-900 border border-rose-200"
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              {resultStatus === "correct" ? (
                <>
                  <CheckCircle2 size={18} className="text-emerald-600" />
                  <span>Brilliant! Grammatically Perfect!</span>
                </>
              ) : (
                <>
                  <XCircle size={18} className="text-rose-600" />
                  <span>Not quite right yet. Token order is incorrect.</span>
                </>
              )}
            </div>

            <div className="text-neutral-700 text-xs">
              <span className="font-bold">Correct order: </span>
              <span className="font-hanzi font-bold text-neutral-900">{currentExercise.fullChinese}</span>
              <span className="font-mono text-neutral-500 ml-2">({currentExercise.fullPinyin})</span>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>Reset Tiles</span>
          </button>

          <div className="flex items-center gap-3">
            {resultStatus === "correct" ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Next Sentence</span>
                <ArrowRight size={14} />
              </button>
            ) : (
              <button
                type="button"
                disabled={selectedTokens.length === 0}
                onClick={handleCheck}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                Check Grammar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
