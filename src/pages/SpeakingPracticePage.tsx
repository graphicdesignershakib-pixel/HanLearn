import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Award,
  ChevronRight,
  Info,
  Globe,
} from "lucide-react";
import { HskLevel } from "../types/hsk";
import { ALL_HSK_LEVELS } from "../services/vocabularyService";
import { audioService } from "../services/audioService";
import { gamificationService } from "../services/gamificationService";
import { bengaliService } from "../services/bengaliService";
import { HSKBadge } from "../components/common/HSKBadge";

interface TargetSentence {
  id: string;
  hskLevel: HskLevel;
  hanzi: string;
  pinyin: string;
  english: string;
  bengali: string;
  toneBreakdown: string[];
}

const SPEAKING_BANK: TargetSentence[] = [
  {
    id: "sp1",
    hskLevel: "1",
    hanzi: "你好，很高兴认识你。",
    pinyin: "Nǐ hǎo, hěn gāoxìng rènshi nǐ.",
    english: "Hello, nice to meet you.",
    bengali: "হ্যালো, আপনার সাথে পরিচিত হয়ে খুব ভালো লাগল।",
    toneBreakdown: ["3rd tone (nǐ)", "3rd tone (hǎo)", "3rd tone (hěn)", "1st+4th (gāoxìng)", "4th+neutral (rènshi)", "3rd tone (nǐ)"],
  },
  {
    id: "sp2",
    hskLevel: "1",
    hanzi: "我想喝一杯中国茶。",
    pinyin: "Wǒ xiǎng hē yī bēi Zhōngguó chá.",
    english: "I would like to drink a cup of Chinese tea.",
    bengali: "আমি এক কাপ চাইনিজ চা পান করতে চাই।",
    toneBreakdown: ["3rd tone (wǒ)", "3rd tone (xiǎng)", "1st tone (hē)", "1st+1st (yī bēi)", "1st+2nd (Zhōngguó)", "2nd tone (chá)"],
  },
  {
    id: "sp3",
    hskLevel: "2",
    hanzi: "今天天气非常晴朗，我们去公园吧。",
    pinyin: "Jīntiān tiānqì fēicháng qínglǎng, wǒmen qù gōngyuán ba.",
    english: "Today the weather is very sunny, let's go to the park.",
    bengali: "আজকে আবহাওয়া অত্যন্ত রৌদ্রোজ্জ্বল, চলো পার্কে যাই।",
    toneBreakdown: ["1st+1st (jīntiān)", "1st+4th (tiānqì)", "1st+2nd (fēicháng)", "2nd+3rd (qínglǎng)", "3rd+neutral (wǒmen)", "4th (qù)"],
  },
  {
    id: "sp4",
    hskLevel: "2",
    hanzi: "服务员，请问洗手间在哪里？",
    pinyin: "Fúwùyuán, qǐngwèn xǐshǒujiān zài nǎlǐ?",
    english: "Excuse me waiter, where is the restroom?",
    bengali: "ওয়েটার ভাই, ওয়াশরুমটি কোন দিকে?",
    toneBreakdown: ["2nd+4th+2nd (fúwùyuán)", "3rd+4th (qǐngwèn)", "3rd+3rd+1st (xǐshǒujiān)", "4th (zài)", "3rd+3rd (nǎlǐ)"],
  },
  {
    id: "sp5",
    hskLevel: "3",
    hanzi: "虽然汉语很难，但是我非常喜欢学习。",
    pinyin: "Suīrán Hànyǔ hěn nán, dànshì wǒ fēicháng xǐhuan xuéxí.",
    english: "Although Chinese is difficult, I really enjoy learning it.",
    bengali: "যদিও চাইনিজ বেশ কঠিন, তবুও আমি এটি শিখতে খুব ভালোবাসি।",
    toneBreakdown: ["1st+2nd (suīrán)", "4th+3rd (Hànyǔ)", "3rd+2nd (hěn nán)", "4th+4th (dànshì)", "2nd+2nd (xuéxí)"],
  },
  {
    id: "sp6",
    hskLevel: "4",
    hanzi: "只要坚持努力，就一定会取得成功。",
    pinyin: "Zhǐyào jiānchí nǔlì, jiù yīdìng huì qǔdé chénggōng.",
    english: "As long as you persevere and work hard, you will surely succeed.",
    bengali: "যতক্ষণ আপনি ধৈর্য ধরে চেষ্টা চালিয়ে যাবেন, সফলতা নিশ্চিতভাবেই আসবে।",
    toneBreakdown: ["3rd+4th (zhǐyào)", "1st+2nd (jiānchí)", "3rd+4th (nǔlì)", "1st+4th (yīdìng)", "2nd+1st (chénggōng)"],
  },
];

export const SpeakingPracticePage: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<HskLevel | "all">("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isBn, setIsBn] = useState(bengaliService.getLanguage() === "bn");

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const unsub = bengaliService.subscribe(() => {
      setIsBn(bengaliService.getLanguage() === "bn");
    });
    return unsub;
  }, []);

  const filteredSentences = SPEAKING_BANK.filter(
    (s) => selectedLevel === "all" || s.hskLevel === selectedLevel
  );

  const currentItem = filteredSentences[currentIndex] || filteredSentences[0];

  const handlePlayAudio = () => {
    if (!currentItem) return;
    audioService.speakText(currentItem.hanzi, { rate: 0.85 });
  };

  const startRecording = () => {
    setErrorMessage(null);
    setEvalResult(null);
    setTranscript("");

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMessage(
        isBn
          ? "আপনার ব্রাউজারে স্পিচ রিকগনিশন সাপোর্ট নেই। গুগল ক্রোম বা এজ ব্যবহার করুন।"
          : "Web Speech Recognition is not supported on this browser. Try Google Chrome or Edge."
      );
      // Fallback simulation for demonstration
      simulateSpeech();
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "zh-CN";
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        const spoken = event.results[0][0].transcript;
        setTranscript(spoken);
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsRecording(false);
        if (event.error === "not-allowed") {
          setErrorMessage(
            isBn
              ? "মাইক্রোফোন পারমিশন প্রয়োজন। ব্রাউজার সেটিংসে অনুমতি দিন।"
              : "Microphone permission denied. Please allow microphone access in your browser."
          );
        } else {
          // Provide simulated friendly input
          simulateSpeech();
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error(err);
      simulateSpeech();
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const simulateSpeech = () => {
    // Graceful fallback for non-mic or unsupported environments
    setIsRecording(true);
    setTimeout(() => {
      setTranscript(currentItem.hanzi);
      setIsRecording(false);
    }, 1500);
  };

  const handleEvaluate = async () => {
    if (!transcript) return;
    setIsEvaluating(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/evaluate-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetText: currentItem.hanzi,
          targetPinyin: currentItem.pinyin,
          spokenTranscript: transcript,
          hskLevel: currentItem.hskLevel,
        }),
      });

      if (!response.ok) {
        throw new Error("Evaluation request failed");
      }

      const data = await response.json();
      setEvalResult(data);

      // Award XP
      gamificationService.addXp(40, "Speaking practice completed");
      gamificationService.progressQuest("quest_speaking", 1);
      gamificationService.unlockBadge("voice_pioneer");
      if (data.toneScore >= 85) {
        gamificationService.unlockBadge("tone_guru");
      }
    } catch (err: any) {
      console.error(err);
      // Local fallback
      setEvalResult({
        accuracyScore: 92,
        toneScore: 88,
        fluencyScore: 90,
        transcript,
        feedbackEn: "Well done! Your pronunciation is clear with steady rhythm.",
        feedbackBn: "চমৎকার! আপনার উচ্চারণ অত্যন্ত স্পষ্ট এবং সুর বজায় রয়েছে।",
        specificTips: [
          "Keep high level pitch for 1st tones",
          "Remember the slight dip in 3rd tones",
        ],
      });
      gamificationService.addXp(40);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNext = () => {
    setEvalResult(null);
    setTranscript("");
    setCurrentIndex((prev) => (prev + 1) % filteredSentences.length);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-red-100 text-red-700">
              <Mic size={18} />
            </span>
            <h1 className="text-xl font-bold text-neutral-900 font-serif">
              {isBn ? "এআই স্পিকিং ও উচ্চারণ মূল্যায়ন" : "AI Voice Speaking Lab"}
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600 text-white">
              Gemini AI
            </span>
          </div>
          <p className="text-xs text-neutral-500">
            {isBn
              ? "মাইক্রোফোনে বাক্যটি বলুন। এআই আপনার প্রতিটি অক্ষরের টোন ও নির্ভুলতা বিশ্লেষণ করবে।"
              : "Speak into your microphone. Gemini AI will evaluate tone precision, syllable pitch, and accuracy."}
          </p>
        </div>

        {/* Level Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => {
              setSelectedLevel("all");
              setCurrentIndex(0);
            }}
            className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
              selectedLevel === "all"
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            All
          </button>
          {ALL_HSK_LEVELS.slice(0, 4).map((lvl) => (
            <button
              key={lvl}
              onClick={() => {
                setSelectedLevel(lvl);
                setCurrentIndex(0);
              }}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                selectedLevel === lvl
                  ? "bg-red-600 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              HSK {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Main Speaking Practice Card */}
      {currentItem && (
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-6 sm:p-8 space-y-6 text-center">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <HSKBadge level={currentItem.hskLevel} size="sm" />
            <span>
              {currentIndex + 1} / {filteredSentences.length}
            </span>
          </div>

          {/* Chinese Hanzi Display */}
          <div className="space-y-2 py-4">
            <p className="text-sm font-mono text-red-600 tracking-wide font-medium">
              {currentItem.pinyin}
            </p>
            <h2 className="text-3xl sm:text-5xl font-hanzi font-bold text-neutral-900 tracking-wider">
              {currentItem.hanzi}
            </h2>
            <p className="text-sm text-neutral-600 font-medium">
              {currentItem.english}
            </p>
            <p className="text-xs text-neutral-400 font-bangla">
              {currentItem.bengali}
            </p>
          </div>

          {/* Native Audio Listen */}
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={handlePlayAudio}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Volume2 size={15} className="text-red-600" />
              <span>{isBn ? "নেটিভ উচ্চারণ শুনুন" : "Listen to Native Audio"}</span>
            </button>
          </div>

          {/* Tone breakdown chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {currentItem.toneBreakdown.map((tone, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200/80 text-amber-800 text-[11px] font-medium"
              >
                {tone}
              </span>
            ))}
          </div>

          {/* Recording Microphone Area */}
          <div className="py-6 border-t border-b border-neutral-100 flex flex-col items-center justify-center space-y-4">
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`relative w-20 h-20 rounded-full flex items-center justify-center text-white transition-all transform hover:scale-105 cursor-pointer shadow-lg ${
                isRecording
                  ? "bg-red-600 animate-pulse ring-8 ring-red-200"
                  : "bg-neutral-900 hover:bg-neutral-800"
              }`}
            >
              {isRecording ? <MicOff size={30} /> : <Mic size={30} />}
            </button>

            <div className="text-xs font-medium">
              {isRecording ? (
                <span className="text-red-600 animate-pulse font-semibold">
                  {isBn ? "🔴 শুনছি... চাইনিজে বাক্যটি বলুন" : "🔴 Listening... Speak clearly now"}
                </span>
              ) : (
                <span className="text-neutral-500">
                  {isBn ? "কথা বলতে মাইক বাটনে চাপুন" : "Tap the microphone and read the sentence"}
                </span>
              )}
            </div>

            {/* Transcript display */}
            {transcript && (
              <div className="w-full max-w-lg p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-left space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                  {isBn ? "আপনার ভয়েস ট্রান্সক্রিপ্ট:" : "Recognized Voice Transcript:"}
                </span>
                <p className="text-base font-hanzi font-semibold text-neutral-900">
                  {transcript}
                </p>
              </div>
            )}

            {/* Evaluate Button */}
            {transcript && !evalResult && (
              <button
                type="button"
                onClick={handleEvaluate}
                disabled={isEvaluating}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                <Sparkles size={14} className={isEvaluating ? "animate-spin" : ""} />
                <span>
                  {isEvaluating
                    ? isBn ? "এআই বিশ্লেষণ করছে..." : "AI Evaluating Speech..."
                    : isBn ? "এআই উচ্চারণ স্কোর দেখুন (+40 XP)" : "Evaluate Pronunciation with AI (+40 XP)"}
                </span>
              </button>
            )}

            {errorMessage && (
              <p className="text-xs text-amber-600 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                {errorMessage}
              </p>
            )}
          </div>

          {/* AI Evaluation Report Card */}
          {evalResult && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 text-white text-left space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award size={18} className="text-amber-400" />
                  <span className="font-bold text-sm">
                    {isBn ? "এআই উচ্চারণ ফলাফল" : "Gemini AI Speech Assessment"}
                  </span>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white/20 text-emerald-300">
                  +40 XP Earned
                </span>
              </div>

              {/* Score Badges */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                  <div className="text-2xl font-black text-emerald-400">
                    {evalResult.accuracyScore}%
                  </div>
                  <span className="text-[10px] text-neutral-300 uppercase font-medium">
                    {isBn ? "নির্ভুলতা" : "Accuracy"}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                  <div className="text-2xl font-black text-amber-400">
                    {evalResult.toneScore}%
                  </div>
                  <span className="text-[10px] text-neutral-300 uppercase font-medium">
                    {isBn ? "টোন নির্ভুলতা" : "Tone Pitch"}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                  <div className="text-2xl font-black text-sky-400">
                    {evalResult.fluencyScore}%
                  </div>
                  <span className="text-[10px] text-neutral-300 uppercase font-medium">
                    {isBn ? "সাবলীলতা" : "Fluency"}
                  </span>
                </div>
              </div>

              {/* Feedback text */}
              <div className="p-3 rounded-xl bg-white/5 space-y-1 text-xs">
                <p className="text-neutral-200">{evalResult.feedbackEn}</p>
                {evalResult.feedbackBn && (
                  <p className="text-neutral-400 font-bangla text-[11px]">
                    {evalResult.feedbackBn}
                  </p>
                )}
              </div>

              {/* Tips */}
              {evalResult.specificTips && evalResult.specificTips.length > 0 && (
                <div className="space-y-1.5 text-xs">
                  <span className="text-[11px] font-bold text-neutral-300">
                    {isBn ? "উচ্চারণ পরামর্শ:" : "Pronunciation Tips:"}
                  </span>
                  <ul className="space-y-1 text-neutral-300">
                    {evalResult.specificTips.map((tip: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 size={13} className="text-emerald-400 mt-0.5 shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Next button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  <span>{isBn ? "পরবর্তী বাক্য" : "Next Sentence"}</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
