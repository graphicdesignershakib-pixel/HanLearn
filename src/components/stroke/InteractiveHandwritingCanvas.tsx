import React, { useEffect, useRef, useState } from "react";
import HanziWriter from "hanzi-writer";
import confetti from "canvas-confetti";
import {
  RotateCcw,
  Sparkles,
  HelpCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  Play,
  Volume2,
  Award,
  AlertCircle,
  Undo2,
  PenTool,
} from "lucide-react";
import { audioService } from "../../services/audioService";
import { gamificationService } from "../../services/gamificationService";
import { progressService } from "../../services/progressService";
import { bengaliService } from "../../services/bengaliService";

interface InteractiveHandwritingCanvasProps {
  character: string;
  size?: number;
  onComplete?: () => void;
  className?: string;
  showDetails?: boolean;
}

export const InteractiveHandwritingCanvas: React.FC<InteractiveHandwritingCanvasProps> = ({
  character,
  size = 320,
  onComplete,
  className = "",
  showDetails = true,
}) => {
  const targetChar = character ? character.trim()[0] : "好";
  const containerRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<HanziWriter | null>(null);

  const [mode, setMode] = useState<"quiz" | "animated" | "free">("quiz");
  const [totalStrokes, setTotalStrokes] = useState<number>(0);
  const [currentStroke, setCurrentStroke] = useState<number>(0);
  const [mistakes, setMistakes] = useState<number>(0);
  const [accuracyScore, setAccuracyScore] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [showOutline, setShowOutline] = useState<boolean>(true);
  const [feedbackText, setFeedbackText] = useState<string>("Draw the first stroke in the correct order.");
  const [isBn, setIsBn] = useState<boolean>(bengaliService.getLanguage() === "bn");

  useEffect(() => {
    const unsub = bengaliService.subscribe(() => {
      setIsBn(bengaliService.getLanguage() === "bn");
    });
    return unsub;
  }, []);

  // Initialize HanziWriter on mount or when character changes
  useEffect(() => {
    if (!containerRef.current) return;

    // Clear existing DOM
    containerRef.current.innerHTML = "";
    setIsCompleted(false);
    setAccuracyScore(null);
    setMistakes(0);
    setCurrentStroke(0);

    const writer = HanziWriter.create(containerRef.current, targetChar, {
      width: size,
      height: size,
      padding: 24,
      strokeColor: "#171717",
      outlineColor: "#e5e5e5",
      highlightColor: "#e11d48", // rose-600
      drawingColor: "#dc2626", // red-600
      drawingWidth: 16,
      showOutline: true,
      showCharacter: false,
      strokeAnimationSpeed: 1.2,
      delayBetweenStrokes: 180,
    });

    writerRef.current = writer;

    // Determine stroke count from writer or fallback
    writer.getCharacterData().then((data) => {
      if (data && data.strokes) {
        setTotalStrokes(data.strokes.length);
      }
    }).catch(() => {
      // Fallback
    });

    if (mode === "quiz") {
      startQuiz(writer);
    } else if (mode === "animated") {
      writer.animateCharacter();
    }

    return () => {
      writerRef.current = null;
    };
  }, [targetChar, size]);

  const startQuiz = (writerInstance?: HanziWriter | null) => {
    const writer = writerInstance || writerRef.current;
    if (!writer) return;

    setIsCompleted(false);
    setAccuracyScore(null);
    setMistakes(0);
    setCurrentStroke(0);
    setFeedbackText(
      isBn ? "সঠিক ক্রমে প্রথম স্ট্রোকটি টানুন।" : "Draw the first stroke in the correct order."
    );

    writer.quiz({
      showOutline: showOutline,
      onCorrectStroke: (strokeData) => {
        const next = strokeData.strokeNum + 1;
        setCurrentStroke(next);
        setFeedbackText(
          isBn
            ? `চমৎকার! স্ট্রোক ${next} সঠিক হয়েছে।`
            : `Nice! Stroke ${next} drawn accurately.`
        );
      },
      onMistake: (strokeData) => {
        setMistakes((prev) => {
          const nextVal = prev + 1;
          setFeedbackText(
            isBn
              ? `ভুল দিক বা ভুল ক্রম! আবার চেষ্টা করুন (ভুল: ${nextVal})`
              : `Incorrect stroke or direction. Try again! (Mistakes: ${nextVal})`
          );
          return nextVal;
        });
      },
      onComplete: (summary) => {
        setIsCompleted(true);
        const total = summary.totalMistakes;
        const totalNumStrokes = totalStrokes || 6;
        // Calculate score: 100 - (mistakes * 10), min 60
        const calculatedScore = Math.max(60, Math.round(100 - (total * 8)));
        setAccuracyScore(calculatedScore);

        setFeedbackText(
          isBn
            ? `অভিনন্দন! আপনি সফলভাবে "${targetChar}" অক্ষরটি লিখেছেন!`
            : `Splendid! You have successfully mastered writing "${targetChar}"!`
        );

        try {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.65 },
            colors: ["#dc2626", "#ea580c", "#16a34a", "#2563eb"],
          });
        } catch (_) {}

        gamificationService.addXp(20);
        progressService.recordStudySession({
          timeSpentMs: 25000,
          charactersWritten: 1,
        });

        if (onComplete) {
          onComplete();
        }
      },
    });
  };

  const handleModeChange = (newMode: "quiz" | "animated" | "free") => {
    setMode(newMode);
    const writer = writerRef.current;
    if (!writer) return;

    if (newMode === "animated") {
      writer.cancelQuiz();
      writer.showCharacter();
      writer.animateCharacter();
      setFeedbackText(
        isBn ? "স্ট্রোক অ্যানিমেশন পর্যবেক্ষণ করুন।" : "Observing stroke order animation."
      );
    } else if (newMode === "quiz") {
      writer.hideCharacter();
      startQuiz(writer);
    } else {
      // Free practice
      writer.cancelQuiz();
      writer.showOutline();
      writer.hideCharacter();
      setFeedbackText(
        isBn ? "মুক্তভাবে ক্যানভাসে লেখার অনুশীলন।" : "Freehand practice mode enabled."
      );
    }
  };

  const handleReplayAnimation = () => {
    const writer = writerRef.current;
    if (!writer) return;
    writer.animateCharacter();
  };

  const handleGiveHint = () => {
    const writer = writerRef.current;
    if (!writer) return;
    writer.quiz({
      showOutline: true,
    });
    // HanziWriter highlight stroke
    if (typeof (writer as any).highlightStroke === "function") {
      (writer as any).highlightStroke(currentStroke);
    }
    setFeedbackText(
      isBn ? "পরবর্তী স্ট্রোকটি হাইলাইট করে দেখানো হয়েছে।" : "Highlighted the expected stroke."
    );
  };

  const handleToggleOutline = () => {
    const nextVal = !showOutline;
    setShowOutline(nextVal);
    const writer = writerRef.current;
    if (!writer) return;
    if (nextVal) {
      writer.showOutline();
    } else {
      writer.hideOutline();
    }
  };

  const handleResetQuiz = () => {
    startQuiz();
  };

  const playPronunciation = () => {
    audioService.speakText(targetChar);
  };

  return (
    <div className={`flex flex-col items-center bg-white rounded-3xl border border-neutral-200/90 p-5 md:p-7 shadow-xs ${className}`}>
      {/* Top Header Controls */}
      <div className="w-full flex items-center justify-between border-b border-neutral-100 pb-4 mb-4 gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
            <PenTool size={18} />
          </div>
          <div>
            <div className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
              <span>{isBn ? "ইন্টারেক্টিভ ক্যালিগ্রাফি ক্যানভাস" : "Interactive Calligraphy Canvas"}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-100 text-red-700">
                Live Grading
              </span>
            </div>
            <div className="text-xs text-neutral-500 font-medium">
              {targetChar} · {totalStrokes > 0 ? `${totalStrokes} Strokes` : "HSK Standard"}
            </div>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-100 text-xs">
          <button
            type="button"
            onClick={() => handleModeChange("quiz")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              mode === "quiz"
                ? "bg-white text-neutral-900 shadow-xs"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            {isBn ? "কুইজ ও গ্রেডিং" : "Writing Quiz"}
          </button>
          <button
            type="button"
            onClick={() => handleModeChange("animated")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
              mode === "animated"
                ? "bg-white text-neutral-900 shadow-xs"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            <Play size={12} />
            <span>{isBn ? "অ্যানিমেশন" : "Animation"}</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Box with Traditional Tian Zi Ge Grid */}
      <div className="relative flex flex-col items-center">
        {/* Tian-Zi-Ge Calligraphy Grid Container */}
        <div
          className="relative rounded-3xl border-2 border-neutral-300/80 shadow-inner overflow-hidden select-none bg-amber-50/20"
          style={{
            width: size,
            height: size,
            touchAction: "none",
          }}
        >
          {/* Tian Zi Ge Guide Lines (Crosshair & Diagonals) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none stroke-red-200/50"
            strokeDasharray="4,4"
            strokeWidth="1.2"
          >
            {/* Center Vertical */}
            <line x1="50%" y1="0" x2="50%" y2="100%" />
            {/* Center Horizontal */}
            <line x1="0" y1="50%" x2="100%" y2="50%" />
            {/* Diagonals */}
            <line x1="0" y1="0" x2="100%" y2="100%" strokeOpacity="0.4" />
            <line x1="100%" y1="0" x2="0" y2="100%" strokeOpacity="0.4" />
          </svg>

          {/* HanziWriter Root DOM Node */}
          <div
            ref={containerRef}
            className="relative z-10 w-full h-full flex items-center justify-center cursor-crosshair"
          />

          {/* Success Overlay on Completion */}
          {isCompleted && (
            <div className="absolute inset-0 z-20 bg-neutral-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-white p-5 text-center animate-fade-in">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-400 flex items-center justify-center mb-3">
                <Award size={32} />
              </div>
              <h4 className="text-xl font-extrabold tracking-tight">
                {isBn ? "অসাধারণ ক্যালিগ্রাফি!" : "Character Mastered!"}
              </h4>
              <p className="text-xs text-neutral-300 mt-1 max-w-xs">
                {isBn
                  ? `আপনি সঠিক ক্রমে এবং সঠিক দিকে সবগুলো স্ট্রোক সম্পূর্ণ করেছেন!`
                  : `All strokes followed the correct calligraphy sequence and direction!`}
              </p>

              {accuracyScore !== null && (
                <div className="mt-3 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-extrabold text-xs">
                  {isBn ? `গ্রেড স্কোর: ${accuracyScore}%` : `Accuracy Score: ${accuracyScore}%`} · +20 XP
                </div>
              )}

              <div className="flex items-center gap-2 mt-5">
                <button
                  type="button"
                  onClick={handleResetQuiz}
                  className="px-4 py-2 rounded-xl bg-white text-neutral-900 font-bold text-xs hover:bg-neutral-100 transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <RotateCcw size={13} />
                  <span>{isBn ? "আবার লিখুন" : "Practice Again"}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Live Feedback & Status */}
        <div className="w-full mt-3 flex items-center justify-between text-xs px-2">
          <div className="flex items-center gap-2 text-neutral-700 font-medium">
            <span
              className={`w-2 h-2 rounded-full ${
                isCompleted
                  ? "bg-emerald-500"
                  : mistakes > 0
                  ? "bg-amber-500 animate-pulse"
                  : "bg-red-500"
              }`}
            />
            <span className="text-xs text-neutral-600 max-w-[200px] sm:max-w-xs truncate">
              {feedbackText}
            </span>
          </div>

          <div className="font-mono text-xs font-bold text-neutral-500 shrink-0">
            {currentStroke} / {totalStrokes || "—"} strokes
          </div>
        </div>
      </div>

      {/* Interactive Tool Actions */}
      <div className="w-full mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          {mode === "quiz" && (
            <>
              <button
                type="button"
                onClick={handleGiveHint}
                className="px-3 py-1.5 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-50 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Show hint for current stroke"
              >
                <HelpCircle size={14} className="text-amber-500" />
                <span>{isBn ? "ইঙ্গিত (Hint)" : "Stroke Hint"}</span>
              </button>

              <button
                type="button"
                onClick={handleToggleOutline}
                className="px-3 py-1.5 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-50 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {showOutline ? <EyeOff size={14} /> : <Eye size={14} />}
                <span>{showOutline ? (isBn ? "আউটলাইন লুকান" : "Hide Guide") : (isBn ? "আউটলাইন দেখান" : "Show Guide")}</span>
              </button>
            </>
          )}

          {mode === "animated" && (
            <button
              type="button"
              onClick={handleReplayAnimation}
              className="px-3 py-1.5 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Play size={13} />
              <span>{isBn ? "পুনরায় অ্যানিমেশন দেখুন" : "Replay Strokes"}</span>
            </button>
          )}

          <button
            type="button"
            onClick={playPronunciation}
            className="p-2 rounded-xl border border-neutral-200 text-neutral-600 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            title="Listen to native pronunciation"
          >
            <Volume2 size={16} />
          </button>
        </div>

        <button
          type="button"
          onClick={handleResetQuiz}
          className="px-3.5 py-1.5 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-50 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw size={14} />
          <span>{isBn ? "রিসেট করুন" : "Reset Canvas"}</span>
        </button>
      </div>

      {/* Instructions Pill */}
      {showDetails && (
        <div className="w-full mt-4 p-3 rounded-2xl bg-neutral-50 border border-neutral-100 text-[11px] text-neutral-600 leading-relaxed flex items-start gap-2">
          <Sparkles size={14} className="text-red-500 shrink-0 mt-0.5" />
          <span>
            {isBn
              ? "মাউস অথবা টাচ স্ক্রিনে আঙুল দিয়ে অক্ষরের স্ট্রোকগুলো সঠিক দিক ও নিয়মে টানুন। লাইভ গ্রেডিং সিস্টেম ভুল ক্রম হলে লাল রঙে নির্দেশনা প্রদান করবে।"
              : "Use your mouse or finger to draw strokes sequentially. HanziWriter validates stroke direction and sequence in real time."}
          </span>
        </div>
      )}
    </div>
  );
};
