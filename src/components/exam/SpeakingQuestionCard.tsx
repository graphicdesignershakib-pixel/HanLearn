import React, { useState, useRef, useEffect } from "react";
import { Mic, Square, Play, RotateCcw, AlertCircle, Sparkles, Volume2 } from "lucide-react";
import { ExamQuestion, ExamMode } from "../../types/exam";

interface SpeakingQuestionCardProps {
  question: ExamQuestion;
  userAnswer: string;
  onUpdateAnswer: (answer: string, extra?: { audioBlobUrl?: string; audioDurationSeconds?: number }) => void;
  mode: ExamMode;
  isBn?: boolean;
}

export const SpeakingQuestionCard: React.FC<SpeakingQuestionCardProps> = ({
  question,
  userAnswer,
  onUpdateAnswer,
  mode,
  isBn = false,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const handleStartRecording = async () => {
    setMicError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Microphone API not supported in this browser");
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        onUpdateAnswer("Recorded Audio Submission", {
          audioBlobUrl: url,
          audioDurationSeconds: recordingSeconds,
        });
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.warn("Microphone access unavailable, enabling simulated practice fallback", err);
      setMicError(
        isBn
          ? "মাইক্রোফোন সংযোগ পাওয়া যায়নি। ব্রাউজার অনুমতি দিন অথবা নিচের সিমুলেশন বোতাম চাপুন।"
          : "Microphone permission required or sandbox restricted. You may test with simulated recording."
      );
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRecording(false);
  };

  const handleSimulatedSubmission = () => {
    onUpdateAnswer("Simulated Speaking Submission (Microphone fallback)", {
      audioDurationSeconds: 45,
    });
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      {/* Question Header Card */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-neutral-400 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Mic size={14} className="text-red-600" />
            {isBn ? "স্পিকিং (মৌখিক) প্রশ্ন" : "Oral Speaking Task"}
          </span>
          <span>{question.points} {isBn ? "পয়েন্ট" : "Pts"}</span>
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-neutral-900 leading-snug">
          {question.promptZh}
        </h2>

        {mode === "practice" && (
          <p className="text-xs text-neutral-600 border-t border-neutral-100 pt-2 leading-relaxed">
            {isBn && question.promptBn ? question.promptBn : question.promptEn}
          </p>
        )}
      </div>

      {/* Recording Studio Panel */}
      <div className="bg-neutral-900 text-white rounded-2xl p-6 flex flex-col items-center justify-center space-y-4 shadow-sm text-center">
        {/* Visual Pulse or Mic Icon */}
        <div className="relative">
          {isRecording && (
            <div className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-30" />
          )}
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
              isRecording ? "bg-red-600 text-white scale-105" : "bg-neutral-800 text-neutral-300"
            }`}
          >
            <Mic size={32} className={isRecording ? "animate-bounce" : ""} />
          </div>
        </div>

        {/* Status Text & Timer */}
        <div className="space-y-1">
          <span className="text-sm font-bold tracking-wider uppercase text-neutral-300">
            {isRecording
              ? isBn ? "রেকর্ডিং চলছে..." : "Recording in Progress..."
              : audioUrl || userAnswer
              ? isBn ? "রেকর্ডিং সফল হয়েছে" : "Audio Recorded"
              : isBn ? "উত্তর রেকর্ড করতে প্রস্তুত" : "Ready to Record"}
          </span>
          <div className="text-2xl font-mono font-bold text-red-500">
            {formatTimer(recordingSeconds)}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {!isRecording ? (
            <button
              type="button"
              onClick={handleStartRecording}
              className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-sm transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Mic size={16} />
              <span>
                {audioUrl || userAnswer
                  ? isBn ? "পুনরায় রেকর্ড করুন" : "Re-record Response"
                  : isBn ? "রেকর্ড শুরু করুন" : "Start Recording"}
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStopRecording}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm shadow-sm transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Square size={16} className="fill-current" />
              <span>{isBn ? "রেকর্ডিং থামান" : "Stop Recording"}</span>
            </button>
          )}
        </div>

        {/* Playback Audio Element */}
        {audioUrl && (
          <div className="pt-3 w-full max-w-sm">
            <audio controls src={audioUrl} className="w-full h-10 rounded-lg" />
          </div>
        )}

        {/* Mic Error & Fallback */}
        {micError && (
          <div className="p-3 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-neutral-300 space-y-2 max-w-md">
            <p>{micError}</p>
            <button
              type="button"
              onClick={handleSimulatedSubmission}
              className="px-3 py-1.5 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              {isBn ? "মৌখিক উত্তর চিহ্নিত করুন (সিমুলেশন)" : "Mark Speaking Completed (Simulation)"}
            </button>
          </div>
        )}
      </div>

      {/* Mandatory Official Disclaimer */}
      <div className="flex items-start gap-2 p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-500 text-xs leading-relaxed">
        <AlertCircle size={15} className="shrink-0 mt-0.5 text-neutral-400" />
        <p>
          {isBn
            ? "মৌখিক পরীক্ষার স্কোরિંગ শুধুমাত্র অনুশীলন মূল্যায়নের জন্য নির্ধারিত। এটি কোনো অফিশিয়াল HSK সার্টিফিকেট বা সনদ নয়।"
            : "Practice estimation only — speaking scoring algorithms are intended for self-study diagnosis and do not represent official Chinese Test Service certification."}
        </p>
      </div>
    </div>
  );
};
