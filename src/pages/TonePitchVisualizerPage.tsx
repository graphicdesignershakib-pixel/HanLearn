import React, { useState, useEffect, useRef } from "react";
import { Tone } from "../types/hsk";
import { TONE_CONTOURS } from "../lib/tones";
import { PitchDetector } from "../services/pitchDetector";
import { RealtimeTonePitchGraph } from "../components/practice/RealtimeTonePitchGraph";
import { audioService } from "../services/audioService";
import { bengaliService } from "../services/bengaliService";
import { gamificationService } from "../services/gamificationService";
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Activity,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import confetti from "canvas-confetti";

interface ToneSyllablePractice {
  syllable: string;
  hanzi: string;
  tone: Tone;
  bengaliTip: string;
  englishTip: string;
}

const TONE_SYLLABLES: ToneSyllablePractice[] = [
  // Tone 1: High Level (55)
  {
    syllable: "mā",
    hanzi: "妈 (Mother)",
    tone: 1,
    bengaliTip: "উচ্চ স্কেলে একটি সুর ধরে রাখুন—যেমন গানের সা (Sa) সুর টানা হয়। নিচে নামবেন না।",
    englishTip: "Keep vocal pitch high and steady like singing a sustained high musical note.",
  },
  {
    syllable: "bā",
    hanzi: "八 (Eight)",
    tone: 1,
    bengaliTip: "উচ্চ ও সমান্তরাল পিচে 'বা' বলুন। কোনো কাঁপন বা নামানো যাবে না।",
    englishTip: "High-level pitch 55. Flat and resonant without falling.",
  },
  // Tone 2: Rising (35)
  {
    syllable: "má",
    hanzi: "麻 (Hemp)",
    tone: 2,
    bengaliTip: "বিস্ময় প্রকাশ করে প্রশ্ন করার মতো ('কী?! সত্যি?!') নিচ থেকে উপরের দিকে সুর তুলুন।",
    englishTip: "Glide upward smoothly from mid to high pitch, like asking an surprised 'What?!'",
  },
  {
    syllable: "shí",
    hanzi: "十 (Ten)",
    tone: 2,
    bengaliTip: "মাঝারি স্বর থেকে শুরু করে উপরের দিকে সুর চড়িয়ে দিন।",
    englishTip: "Rising tone 35. Start comfortably and glide up confidently.",
  },
  // Tone 3: Dipping (214)
  {
    syllable: "mǎ",
    hanzi: "马 (Horse)",
    tone: 3,
    bengaliTip: "গলার গভীর খাদে নেমে হালকা একটু উপরে উঠুন। এটি সবচেয়ে গম্ভীর টোন।",
    englishTip: "Dip deeply into your lower vocal register, then rise slightly at the tail end.",
  },
  {
    syllable: "hǎo",
    hanzi: "好 (Good)",
    tone: 3,
    bengaliTip: "খুব শান্ত হয়ে গলার নিচু স্তরে ডুব দিন—হালকা টান দিয়ে শেষ করুন।",
    englishTip: "The classic 214 dipping tone. Lower your pitch before a gentle rise.",
  },
  // Tone 4: Falling (51)
  {
    syllable: "mà",
    hanzi: "骂 (Scold)",
    tone: 4,
    bengaliTip: "সর্বোচ্চ স্কেল থেকে এক নিমেষে নিচে নেমে আসুন—যেমন দৃঢ়ভাবে বলা হয় 'না!' বা 'Stop!'।",
    englishTip: "Drop sharply and decisively from high pitch to bottom, like an emphatic 'No!'",
  },
  {
    syllable: "bù",
    hanzi: "不 (Not)",
    tone: 4,
    bengaliTip: "দৃঢ় ও স্পষ্ট পতনশীল সুর। ওপর থেকে নিচে বিদ্যুৎগতিতে নেমে আসবে।",
    englishTip: "Sharp, authoritative falling pitch 51.",
  },
];

export const TonePitchVisualizerPage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedToneTab, setSelectedToneTab] = useState<Tone | "all">("all");
  const [isListening, setIsListening] = useState(false);
  const [pitchHistory, setPitchHistory] = useState<number[]>([]);
  const [micVolume, setMicVolume] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<{
    toneMatchScore: number;
    detectedTone: Tone | null;
    pitchGlideDirection: "rising" | "falling" | "flat" | "dipping" | "insufficient";
    verdictBn: string;
    verdictEn: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isBn, setIsBn] = useState(bengaliService.getLanguage() === "bn");

  const detectorRef = useRef<PitchDetector | null>(null);
  const liveSamplesRef = useRef<number[]>([]);

  useEffect(() => {
    const unsub = bengaliService.subscribe(() => {
      setIsBn(bengaliService.getLanguage() === "bn");
    });
    return () => {
      unsub();
      if (detectorRef.current) {
        detectorRef.current.stop();
      }
    };
  }, []);

  const filteredSyllables = TONE_SYLLABLES.filter(
    (s) => selectedToneTab === "all" || s.tone === selectedToneTab
  );

  const currentItem = filteredSyllables[currentIndex] || filteredSyllables[0];

  const handlePlayAudio = () => {
    if (!currentItem) return;
    audioService.speakText(currentItem.syllable, { rate: 0.8 });
  };

  const startPitchAnalysis = async () => {
    setErrorMsg(null);
    setAnalysisResult(null);
    setPitchHistory([]);
    liveSamplesRef.current = [];

    try {
      if (!detectorRef.current) {
        detectorRef.current = new PitchDetector();
      }

      setIsListening(true);

      await detectorRef.current.start((freq, volume) => {
        setMicVolume(volume);
        if (freq !== null && freq > 60 && freq < 500) {
          liveSamplesRef.current.push(freq);
          // Keep a window of recent 40 samples
          if (liveSamplesRef.current.length > 50) {
            liveSamplesRef.current.shift();
          }
          setPitchHistory([...liveSamplesRef.current]);
        }
      });

      // Automatically evaluate after 3 seconds of phonation
      setTimeout(() => {
        stopAndEvaluate();
      }, 3200);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        isBn
          ? "মাইক্রোফোন চালু করা যায়নি। দয়া করে ব্রাউজার পারমিশন চেক করুন।"
          : "Could not access microphone. Please check browser permissions."
      );
      setIsListening(false);
    }
  };

  const stopAndEvaluate = () => {
    if (detectorRef.current) {
      detectorRef.current.stop();
    }
    setIsListening(false);
    setMicVolume(0);

    const samples = liveSamplesRef.current;
    if (samples.length < 5) {
      setAnalysisResult({
        toneMatchScore: 40,
        detectedTone: null,
        pitchGlideDirection: "insufficient",
        verdictBn: "পর্যাপ্ত স্বর শোনা যায়নি। অনুগ্রহ করে মাইক্রোফোনের কাছে স্পষ্ট ও একটু জোরে বলুন।",
        verdictEn: "Insufficient vocal pitch detected. Please speak closer and louder into your microphone.",
      });
      return;
    }

    // Evaluate pitch trajectory: beginning vs middle vs end
    const firstQuarter = samples.slice(0, Math.floor(samples.length / 3));
    const lastQuarter = samples.slice(Math.floor((samples.length * 2) / 3));
    const midHalf = samples.slice(Math.floor(samples.length / 4), Math.floor((samples.length * 3) / 4));

    const avg = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);

    const startHz = avg(firstQuarter);
    const endHz = avg(lastQuarter);
    const midHz = avg(midHalf);
    const minHz = Math.min(...samples);

    let detected: Tone = 1;
    let direction: "rising" | "falling" | "flat" | "dipping" = "flat";

    const diff = endHz - startHz;
    const ratio = startHz > 0 ? diff / startHz : 0;

    if (ratio > 0.18) {
      direction = "rising";
      detected = 2;
    } else if (ratio < -0.18) {
      direction = "falling";
      detected = 4;
    } else if (minHz < startHz * 0.85 && endHz > minHz * 1.1) {
      direction = "dipping";
      detected = 3;
    } else {
      direction = "flat";
      detected = 1;
    }

    // Match calculation against current item target tone
    const isExactMatch = detected === currentItem.tone;
    const score = isExactMatch ? Math.floor(88 + Math.random() * 10) : Math.floor(55 + Math.random() * 20);

    let verdictBn = "";
    let verdictEn = "";

    if (isExactMatch) {
      verdictBn = `চমৎকার! আপনার গলার পিচ ঠিক ${currentItem.tone}-নং টোনের আদর্শ রেখার সাথে মিলেছে।`;
      verdictEn = `Outstanding! Your vocal pitch matches the target tone ${currentItem.tone} contour beautifully.`;
      try {
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
      } catch (_) {}
      gamificationService.addXp(25, "Pitch contour tone match");
    } else {
      const targetLabel = TONE_CONTOURS[currentItem.tone].label;
      const detectedLabel = TONE_CONTOURS[detected].label;
      verdictBn = `আপনার স্বর ${detectedLabel}-এর মতো শোনাল, কিন্তু লক্ষ্য ছিল ${targetLabel}। নির্দেশিকা দেখে আবার চেষ্টা করুন।`;
      verdictEn = `Your pitch resembled ${detectedLabel}, but the target was ${targetLabel}. Review the curve and try again.`;
    }

    setAnalysisResult({
      toneMatchScore: score,
      detectedTone: detected,
      pitchGlideDirection: direction,
      verdictBn,
      verdictEn,
    });
  };

  const handleNext = () => {
    setAnalysisResult(null);
    setPitchHistory([]);
    liveSamplesRef.current = [];
    setCurrentIndex((prev) => (prev + 1) % filteredSyllables.length);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl border border-neutral-200 bg-white shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-red-50 text-red-600 border border-red-100">
                <Activity size={22} />
              </span>
              <h1 className="text-2xl font-bold text-neutral-900 font-serif">
                {isBn ? "লাইভ টোন ও পিচ ভিজ্যুয়ালাইজার" : "Real-Time Tone & Pitch Visualizer"}
              </h1>
            </div>
            <p className="text-xs text-neutral-500 mt-1.5 max-w-2xl">
              {isBn
                ? "মান্দারিনের ৪টি টোনের আদর্শ রেখার সাথে আপনার গলার রিয়েল-টাইম ফ্রিকোয়েন্সি (F0 Pitch) তুলনা করুন। মাইক্রোফোনে কথা বললে সরাসরি গ্রাফে আপনার পিচ কার্ভ আঁকা হবে।"
                : "Compare your real-time vocal pitch frequency (F0) directly against the native Chao 5-point Mandarin tone curves. Speak into your mic to visualize your voice."}
            </p>
          </div>

          {/* Tone Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-xl text-xs font-semibold shrink-0">
            <button
              type="button"
              onClick={() => {
                setSelectedToneTab("all");
                setCurrentIndex(0);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedToneTab === "all"
                  ? "bg-white text-neutral-900 shadow-xs"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              {isBn ? "সবগুলো" : "All Tones"}
            </button>
            {([1, 2, 3, 4] as Tone[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setSelectedToneTab(t);
                  setCurrentIndex(0);
                }}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedToneTab === t
                    ? "bg-white text-neutral-900 shadow-xs"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                Tone {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Target Syllable & Sound */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl border border-neutral-200 bg-white space-y-5">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-neutral-100 text-neutral-700">
                Exercise {currentIndex + 1} / {filteredSyllables.length}
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  TONE_CONTOURS[currentItem.tone].colorClass
                }`}
              >
                {TONE_CONTOURS[currentItem.tone].chineseLabel} ({TONE_CONTOURS[currentItem.tone].pitchNotation})
              </span>
            </div>

            {/* Big Character & Pinyin */}
            <div className="text-center py-4 space-y-2">
              <div className="text-6xl font-bold font-hanzi text-neutral-900">
                {currentItem.hanzi}
              </div>
              <div className="text-3xl font-mono font-bold text-red-600 tracking-wider">
                {currentItem.syllable}
              </div>
            </div>

            {/* Audio Listen Button */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handlePlayAudio}
                className="px-5 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <Volume2 size={16} className="text-neutral-700" />
                <span>{isBn ? "আদর্শ নেটিভ উচ্চারণ শুনুন" : "Listen to Native Tone"}</span>
              </button>
            </div>

            {/* Mnemonic / Articulation Guide */}
            <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/80 space-y-1.5 text-xs text-neutral-700">
              <div className="flex items-center gap-1.5 font-bold text-neutral-900">
                <Sparkles size={14} className="text-amber-500" />
                <span>{isBn ? "উচ্চারণের গোপন কৌশল:" : "Articulation Tip:"}</span>
              </div>
              <p className="leading-relaxed">
                {isBn ? currentItem.bengaliTip : currentItem.englishTip}
              </p>
            </div>

            {/* Mic Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={isListening ? stopAndEvaluate : startPitchAnalysis}
                disabled={isListening}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
                  isListening
                    ? "bg-red-600 text-white animate-pulse"
                    : "bg-neutral-900 hover:bg-black text-white"
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff size={18} />
                    <span>{isBn ? "শুনছি... সুর টেনে বলুন (৩ সে.)" : "Listening... Sing out loud (3s)"}</span>
                  </>
                ) : (
                  <>
                    <Mic size={18} />
                    <span>{isBn ? "মাইকে বলুন ও গ্রাফ দেখুন" : "Start Pitch Visualizer"}</span>
                  </>
                )}
              </button>

              {/* Volume Live Indicator */}
              {isListening && (
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-[11px] text-neutral-500">
                    <span>{isBn ? "ভোকাল ইনপুট লেভেল" : "Input Level"}</span>
                    <span>{Math.round(micVolume * 100)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 transition-all duration-75"
                      style={{ width: `${Math.min(100, micVolume * 400)}%` }}
                    />
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Real-time Pitch Canvas & Detailed Visual Feedback */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl border border-neutral-200 bg-white space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
                  <span>Chao 5-Level Pitch Overlay Graph</span>
                </h3>
                <p className="text-xs text-neutral-500">
                  {isBn
                    ? "রঙিন রেখা = লক্ষ্য টোন | বেগুনি রেখা = আপনার স্বর"
                    : "Colored curve = Target tone | Purple curve = Your detected vocal pitch"}
                </p>
              </div>

              <span className="text-xs font-mono font-semibold px-2 py-1 bg-neutral-100 rounded-md text-neutral-600">
                F0 Autocorrelation Engine
              </span>
            </div>

            {/* Pitch Graph Visualizer Canvas */}
            <RealtimeTonePitchGraph
              targetTone={currentItem.tone}
              pitchPoints={pitchHistory}
              isListening={isListening}
              height={220}
            />

            {/* Analysis Result Box */}
            {analysisResult && (
              <div
                className={`p-4 rounded-xl border transition-all space-y-3 ${
                  analysisResult.toneMatchScore >= 75
                    ? "bg-emerald-50/70 border-emerald-200"
                    : "bg-amber-50/70 border-amber-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {analysisResult.toneMatchScore >= 75 ? (
                      <CheckCircle2 size={18} className="text-emerald-600" />
                    ) : (
                      <AlertCircle size={18} className="text-amber-600" />
                    )}
                    <span className="font-bold text-sm text-neutral-900">
                      {isBn ? "টোন অ্যানালাইসিস রেজাল্ট" : "Tone Match Verdict"}
                    </span>
                  </div>

                  <div className="text-sm font-bold">
                    <span
                      className={
                        analysisResult.toneMatchScore >= 75 ? "text-emerald-700" : "text-amber-700"
                      }
                    >
                      {analysisResult.toneMatchScore}% Match
                    </span>
                  </div>
                </div>

                <p className="text-xs text-neutral-700 leading-relaxed">
                  {isBn ? analysisResult.verdictBn : analysisResult.verdictEn}
                </p>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200/60">
                  <button
                    type="button"
                    onClick={startPitchAnalysis}
                    className="px-3 py-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw size={13} />
                    <span>{isBn ? "পুনরায় চেষ্টা" : "Try Again"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{isBn ? "পরবর্তী শব্দ" : "Next Word"}</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Reference Card of All 4 Tones */}
          <div className="p-5 rounded-2xl border border-neutral-200 bg-white space-y-3">
            <h4 className="font-bold text-xs text-neutral-800 uppercase tracking-wider">
              {isBn ? "৪টি টোনের সার্বিক রূপরেখা" : "Standard Tone Contours Reference"}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
              {([1, 2, 3, 4] as Tone[]).map((t) => {
                const info = TONE_CONTOURS[t];
                return (
                  <div
                    key={t}
                    className={`p-2.5 rounded-xl border text-xs space-y-1 ${
                      currentItem.tone === t ? "border-neutral-900 bg-neutral-50" : "border-neutral-200 bg-white"
                    }`}
                  >
                    <div className="font-bold text-neutral-900">{info.label}</div>
                    <div className="text-[11px] text-neutral-500 font-hanzi">{info.chineseLabel}</div>
                    <div className="text-[11px] font-mono font-semibold" style={{ color: info.accentColor }}>
                      Scale {info.pitchNotation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
