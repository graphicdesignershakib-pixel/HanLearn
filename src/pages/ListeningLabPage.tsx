import React, { useState, useEffect } from "react";
import { audioService } from "../services/audioService";
import { bengaliService } from "../services/bengaliService";
import { mistakeService } from "../services/mistakeService";
import {
  Volume2,
  Headphones,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { HskLevel } from "../types/hsk";

interface ListeningExercise {
  id: string;
  hskLevel: HskLevel;
  type: "dialogue" | "statement" | "numbers";
  audioText: string;
  question: string;
  bengaliQuestion?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  pinyinTranscript: string;
}

const LISTENING_EXERCISES: ListeningExercise[] = [
  {
    id: "lis-1",
    hskLevel: "1",
    type: "dialogue",
    audioText: "女：李老师在学校吗？男：不在，他回家了。",
    question: "李老师现在在哪儿？(Where is Teacher Li right now?)",
    bengaliQuestion: "শিক্ষক লি এখন কোথায় আছেন?",
    options: ["在学校 (At school)", "在家里 (At home)", "在商店 (At store)", "在医院 (At hospital)"],
    correctIndex: 1,
    explanation: "The man clearly answered: '不在，他回家了' (Not here, he went home).",
    pinyinTranscript: "Nǚ: Lǐ lǎoshī zài xuéxiào ma? Nán: Bù zài, tā huí jiā le.",
  },
  {
    id: "lis-2",
    hskLevel: "2",
    type: "statement",
    audioText: "外面正在下大雨，别忘了带雨伞。",
    question: "说话人提醒对方带什么？(What does the speaker remind the listener to bring?)",
    bengaliQuestion: "বক্তা শ্রোতাকে কী সাথে নিতে মনে করিয়ে দিচ্ছেন?",
    options: ["衣服 (Clothes)", "雨伞 (Umbrella)", "手机 (Phone)", "电脑 (Computer)"],
    correctIndex: 1,
    explanation: "The speaker said: '别忘了带雨伞' (Don't forget to take an umbrella).",
    pinyinTranscript: "Wàimiàn zhèngzài xià dàyǔ, bié wàng le dài yǔsǎn.",
  },
  {
    id: "lis-3",
    hskLevel: "2",
    type: "numbers",
    audioText: "这件衣服打折后是一百六十八块钱。",
    question: "这件衣服多少钱？(How much is this piece of clothing?)",
    bengaliQuestion: "পোশাকটির দাম কত টাকা?",
    options: ["168 元", "186 元", "268 元", "158 元"],
    correctIndex: 0,
    explanation: "一百六十八 (yì bǎi liù shí bā) = 168.",
    pinyinTranscript: "Zhè jiàn yīfu dǎzhé hòu shì yì bǎi liùshíbā kuài qián.",
  },
  {
    id: "lis-4",
    hskLevel: "3",
    type: "dialogue",
    audioText: "男：周末我们一起去爬山好吗？女：这周末我有考试，下次吧。",
    question: "女的周末为什么不去爬山？(Why won't the woman go hiking this weekend?)",
    bengaliQuestion: "মহিলাটি কেন এই উইকএন্ডে পাহাড়ে চড়তে যাবেন না?",
    options: ["天气不好 (Bad weather)", "她生病了 (She is ill)", "她要参加考试 (She has an exam)", "她不喜欢爬山 (Doesn't like hiking)"],
    correctIndex: 2,
    explanation: "The woman stated: '这周末我有考试' (I have an exam this weekend).",
    pinyinTranscript: "Nán: Zhōumò wǒmen yìqǐ qù páshān hǎo ma? Nǚ: Zhè zhōumò wǒ yǒu kǎoshì, xià cì ba.",
  },
];

export const ListeningLabPage: React.FC = () => {
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isBn, setIsBn] = useState(bengaliService.getLanguage() === "bn");

  const filtered = levelFilter === "all"
    ? LISTENING_EXERCISES
    : LISTENING_EXERCISES.filter((ex) => ex.hskLevel === levelFilter);

  const current = filtered[currentIndex % filtered.length] || LISTENING_EXERCISES[0];

  useEffect(() => {
    const unsub = bengaliService.subscribe(() => setIsBn(bengaliService.getLanguage() === "bn"));
    return unsub;
  }, []);

  useEffect(() => {
    setSelectedOption(null);
    setHasAnswered(false);
    setShowTranscript(false);
    // Play automatically
    audioService.speakText(current.audioText);
  }, [currentIndex, current]);

  const handlePlayAudio = () => {
    audioService.speakText(current.audioText);
  };

  const handleSelect = (idx: number) => {
    if (hasAnswered) return;
    setSelectedOption(idx);
    setHasAnswered(true);

    if (idx !== current.correctIndex) {
      mistakeService.addMistake({
        sourceModule: "listening",
        skill: "listening",
        hskLevel: current.hskLevel,
        questionPrompt: `[Listening] ${current.question}`,
        userAnswer: current.options[idx],
        correctAnswer: current.options[current.correctIndex],
        explanation: `${current.audioText} — ${current.explanation}`,
      });
    }
  };

  const handleNext = () => {
    setCurrentIndex((i) => i + 1);
  };

  const isCorrect = selectedOption === current.correctIndex;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Banner */}
      <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 md:p-8 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
              <Headphones size={14} />
              <span>OFFICIAL HSK 3.0 LISTENING LAB</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight">
              {isBn ? "শ্রবণ দক্ষতা ল্যাব (Listening Lab)" : "Acoustic Comprehension Lab"}
            </h1>
            <p className="text-xs md:text-sm text-neutral-600">
              {isBn
                ? "বাস্তব কথোপকথন, সংখ্যা ও নির্দেশনা শুনে সঠিক উত্তর নির্বাচন করুন।"
                : "Train your ears to parse natural dialogs, numerical data, and situational announcements."}
            </p>
          </div>

          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl shrink-0">
            {["all", "1", "2", "3"].map((lvl) => (
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

      {/* Main Player & Question Studio */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-xs">
        <div className="flex items-center justify-between text-xs text-neutral-600 border-b border-neutral-100 pb-3">
          <span className="font-bold">
            Question {currentIndex + 1} of {filtered.length} (HSK {current.hskLevel})
          </span>
          <button
            type="button"
            onClick={() => setShowTranscript(!showTranscript)}
            className="flex items-center gap-1 text-purple-600 font-bold hover:underline cursor-pointer"
          >
            {showTranscript ? <EyeOff size={14} /> : <Eye size={14} />}
            <span>{showTranscript ? "Hide Transcript" : "Show Transcript"}</span>
          </button>
        </div>

        {/* Audio Player Card */}
        <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100 text-center space-y-3">
          <button
            type="button"
            onClick={handlePlayAudio}
            className="w-16 h-16 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-md mx-auto flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
          >
            <Volume2 size={26} />
          </button>
          <div className="text-xs text-neutral-500 font-medium">
            Click to play question audio
          </div>

          {showTranscript && (
            <div className="p-3 rounded-xl bg-white border border-neutral-200 text-left space-y-1 mt-2">
              <div className="text-[10px] text-neutral-400 font-bold uppercase">Transcript:</div>
              <div className="font-hanzi text-sm font-bold text-neutral-900">{current.audioText}</div>
              <div className="font-mono text-xs text-purple-700">{current.pinyinTranscript}</div>
            </div>
          )}
        </div>

        {/* Question Prompt */}
        <div className="space-y-1">
          <div className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
            Comprehension Question:
          </div>
          <div className="text-base font-bold text-neutral-900">
            {current.question}
          </div>
          {isBn && current.bengaliQuestion && (
            <div className="text-xs text-neutral-600 italic">
              {current.bengaliQuestion}
            </div>
          )}
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {current.options.map((opt, idx) => {
            const isChosen = selectedOption === idx;
            let btnClass = "border-neutral-200 bg-neutral-50/70 hover:bg-neutral-100 text-neutral-800";

            if (hasAnswered) {
              if (idx === current.correctIndex) {
                btnClass = "border-emerald-500 bg-emerald-50 text-emerald-950 font-bold";
              } else if (isChosen) {
                btnClass = "border-rose-500 bg-rose-50 text-rose-950 font-bold";
              }
            }

            return (
              <button
                key={opt}
                type="button"
                disabled={hasAnswered}
                onClick={() => handleSelect(idx)}
                className={`p-3.5 rounded-2xl border text-xs text-left transition-all cursor-pointer flex items-center justify-between ${btnClass}`}
              >
                <span>{opt}</span>
                {hasAnswered && idx === current.correctIndex && (
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                )}
                {hasAnswered && isChosen && idx !== current.correctIndex && (
                  <XCircle size={16} className="text-rose-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback & Explanation */}
        {hasAnswered && (
          <div
            className={`p-4 rounded-2xl text-xs space-y-1 ${
              isCorrect
                ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                : "bg-rose-50 text-rose-900 border border-rose-200"
            }`}
          >
            <div className="font-bold flex items-center gap-1.5">
              {isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
              <span>{isCorrect ? "Correct answer!" : "Incorrect option selected."}</span>
            </div>
            <div className="text-[11px] text-neutral-600">
              {current.explanation}
            </div>
          </div>
        )}

        {/* Next Question Control */}
        {hasAnswered && (
          <div className="flex justify-end pt-3 border-t border-neutral-100">
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Next Audio Drill</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
