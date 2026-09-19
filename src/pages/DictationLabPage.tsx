import React, { useState, useEffect } from "react";
import { audioService } from "../services/audioService";
import { bengaliService } from "../services/bengaliService";
import { mistakeService } from "../services/mistakeService";
import {
  Volume2,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  Headphones,
  Sliders,
} from "lucide-react";

interface DictationItem {
  id: string;
  hskLevel: "1" | "2" | "3" | "4";
  targetHanzi: string;
  pinyin: string;
  english: string;
  hint: string;
}

const DICTATION_ITEMS: DictationItem[] = [
  { id: "d-1", hskLevel: "1", targetHanzi: "明天下午见", pinyin: "Míngtiān xiàwǔ jiàn", english: "See you tomorrow afternoon", hint: "Time + Meet" },
  { id: "d-2", hskLevel: "1", targetHanzi: "你想喝茶还是咖啡", pinyin: "Nǐ xiǎng hē chá háishi kāfēi", english: "Do you want to drink tea or coffee?", hint: "Alternative question with 还是" },
  { id: "d-3", hskLevel: "2", targetHanzi: "外面正在下大雨", pinyin: "Wàimiàn zhèngzài xià dàyǔ", english: "It is raining heavily outside right now", hint: "Continuous aspect 正在" },
  { id: "d-4", hskLevel: "2", targetHanzi: "他跑得比我快", pinyin: "Tā pǎo de bǐ wǒ kuài", english: "He runs faster than me", hint: "Degree complement + 比" },
  { id: "d-5", hskLevel: "3", targetHanzi: "请把空调打开", pinyin: "Qǐng bǎ kōngtiáo dǎkāi", english: "Please turn on the air conditioner", hint: "把 sentence + result complement" },
  { id: "d-6", hskLevel: "3", targetHanzi: "这是我第一次来中国", pinyin: "Zhè shì wǒ dì-yī cì lái Zhōngguó", english: "This is my first time coming to China", hint: "Ordinal number 第一次" },
];

export const DictationLabPage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [hasChecked, setHasChecked] = useState(false);
  const [showPinyin, setShowPinyin] = useState(false);
  const [isBn, setIsBn] = useState(bengaliService.getLanguage() === "bn");

  const currentItem = DICTATION_ITEMS[currentIndex % DICTATION_ITEMS.length];

  useEffect(() => {
    const unsub = bengaliService.subscribe(() => setIsBn(bengaliService.getLanguage() === "bn"));
    return unsub;
  }, []);

  useEffect(() => {
    setUserInput("");
    setHasChecked(false);
    setShowPinyin(false);
    // Play automatically
    audioService.speakText(currentItem.targetHanzi, playbackSpeed);
  }, [currentIndex, currentItem]);

  const handlePlay = (speed = playbackSpeed) => {
    audioService.speakText(currentItem.targetHanzi, speed);
  };

  const handleCheck = () => {
    setHasChecked(true);
    const cleanUser = userInput.trim().replace(/[，。？！\s]/g, "");
    const cleanTarget = currentItem.targetHanzi.replace(/[，。？！\s]/g, "");

    if (cleanUser !== cleanTarget) {
      mistakeService.addMistake({
        sourceModule: "dictation",
        skill: "listening",
        hskLevel: currentItem.hskLevel,
        hanzi: currentItem.targetHanzi,
        pinyin: currentItem.pinyin,
        questionPrompt: `Dictation: "${currentItem.english}"`,
        userAnswer: userInput,
        correctAnswer: currentItem.targetHanzi,
        explanation: `Listen for correct tones and characters: ${currentItem.targetHanzi} (${currentItem.pinyin})`,
      });
    }
  };

  const handleNext = () => {
    setCurrentIndex((i) => i + 1);
  };

  // Compute character diff
  const cleanTargetChars = currentItem.targetHanzi.split("");
  const userChars = userInput.trim().split("");
  const isExactMatch = userInput.trim().replace(/[，。？！\s]/g, "") === currentItem.targetHanzi.replace(/[，。？！\s]/g, "");

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Banner */}
      <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 md:p-8 space-y-3 shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200">
          <Headphones size={14} />
          <span>AUDIO DICTATION LAB</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight">
          {isBn ? "শ্রুতলিপি ল্যাব (Dictation Lab)" : "Listen & Type Dictation Lab"}
        </h1>
        <p className="text-xs md:text-sm text-neutral-600">
          {isBn
            ? "চীনা অডিও শুনুন এবং শুনে শুনে সঠিক হানজি ক্যারেক্টার টাইপ করুন। নির্ভুল চরিত্র তুলনা ও তাৎক্ষণিক ফিডব্যাক।"
            : "Listen to natural Chinese speech at customizable speeds and transcribe what you hear. Analyze character-by-character accuracy."}
        </p>
      </div>

      {/* Main Dictation Studio */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-xs">
        {/* Controls Header */}
        <div className="flex items-center justify-between text-xs text-neutral-600 border-b border-neutral-100 pb-3">
          <span className="font-bold">
            Sentence {currentIndex + 1} of {DICTATION_ITEMS.length} (HSK {currentItem.hskLevel})
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-neutral-400">Speed:</span>
            {[0.75, 1.0, 1.25].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setPlaybackSpeed(s);
                  handlePlay(s);
                }}
                className={`px-2 py-0.5 rounded-md text-xs font-bold cursor-pointer transition-colors ${
                  playbackSpeed === s ? "bg-teal-600 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Audio Centerpiece */}
        <div className="text-center py-6 space-y-4">
          <button
            type="button"
            onClick={() => handlePlay()}
            className="w-20 h-20 rounded-full bg-teal-600 hover:bg-teal-700 text-white shadow-lg mx-auto flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
          >
            <Volume2 size={30} />
          </button>
          <div className="text-xs text-neutral-500">
            Click to replay audio sentence at {playbackSpeed}x speed
          </div>
        </div>

        {/* Transcription Input Box */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
            Type Chinese Characters (Hanzi):
          </label>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !hasChecked && userInput.trim() && handleCheck()}
            placeholder="Type what you hear (e.g. 明天下午见)..."
            className="w-full p-4 rounded-2xl border-2 border-neutral-200 focus:border-teal-500 focus:outline-hidden text-lg md:text-xl font-hanzi text-neutral-900 bg-neutral-50/50"
          />
        </div>

        {/* Character Diff Comparison View */}
        {hasChecked && (
          <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-4">
            <div className="flex items-center gap-2">
              {isExactMatch ? (
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-sm">
                  <CheckCircle2 size={18} />
                  <span>100% Accurate Transcription!</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-rose-700 font-bold text-sm">
                  <XCircle size={18} />
                  <span>Transcription Discrepancy Found. Review Diff:</span>
                </div>
              )}
            </div>

            {/* Side by side diff */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-white border border-neutral-200 space-y-1">
                <div className="text-[10px] text-neutral-400 font-bold uppercase">Your Input:</div>
                <div className="font-hanzi text-lg font-bold text-neutral-800 break-words">
                  {userInput || "<Empty>"}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-neutral-200 space-y-1">
                <div className="text-[10px] text-teal-600 font-bold uppercase">Target Chinese:</div>
                <div className="font-hanzi text-lg font-bold text-teal-800 break-words">
                  {currentItem.targetHanzi}
                </div>
              </div>
            </div>

            <div className="space-y-1 text-xs pt-1">
              <div className="font-mono text-neutral-500">
                <strong className="text-neutral-700">Pinyin: </strong> {currentItem.pinyin}
              </div>
              <div className="text-neutral-600">
                <strong className="text-neutral-700">Meaning: </strong> {currentItem.english}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
          <button
            type="button"
            onClick={() => handlePlay(0.75)}
            className="text-xs font-semibold text-neutral-500 hover:text-neutral-800 cursor-pointer"
          >
            Play Slow (0.75x)
          </button>

          <div className="flex items-center gap-3">
            {hasChecked ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Next Dictation</span>
                <ArrowRight size={14} />
              </button>
            ) : (
              <button
                type="button"
                disabled={!userInput.trim()}
                onClick={handleCheck}
                className="px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                Check Dictation
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
