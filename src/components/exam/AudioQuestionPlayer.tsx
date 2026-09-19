import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Volume2, Eye, EyeOff } from "lucide-react";
import { audioService } from "../../services/audioService";
import { ExamMode } from "../../types/exam";

interface AudioQuestionPlayerProps {
  audioScript: string;
  durationSeconds?: number;
  mode: ExamMode;
  maxReplays?: number; // e.g. 2 for HSK 1-3, 1 for HSK 4-6
  isBn?: boolean;
}

export const AudioQuestionPlayer: React.FC<AudioQuestionPlayerProps> = ({
  audioScript,
  durationSeconds = 6,
  mode,
  maxReplays = mode === "exam" ? 2 : 99,
  isBn = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackCount, setPlaybackCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState<number>(1.0);
  const [showTranscript, setShowTranscript] = useState(false);

  // Reset when audioScript changes
  useEffect(() => {
    setIsPlaying(false);
    setPlaybackCount(0);
    setProgress(0);
    setShowTranscript(false);
    audioService.stop();
  }, [audioScript]);

  const canPlay = mode === "practice" || playbackCount < maxReplays;

  const handleTogglePlay = () => {
    if (isPlaying) {
      audioService.stop();
      setIsPlaying(false);
      return;
    }

    if (!canPlay) return;

    setIsPlaying(true);
    setProgress(0);

    // Increment play count
    setPlaybackCount((prev) => prev + 1);

    // Speak using audioService
    audioService
      .speakText(audioScript, { rate: speed })
      .then(() => {
        setIsPlaying(false);
        setProgress(100);
      })
      .catch(() => {
        setIsPlaying(false);
      });

    // Animate progress smoothly
    const estimatedMs = (durationSeconds * 1000) / speed;
    const intervalTime = 100;
    const step = (intervalTime / estimatedMs) * 100;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + step;
      });
    }, intervalTime);
  };

  const handleReplay = () => {
    if (!canPlay) return;
    audioService.stop();
    setIsPlaying(false);
    setTimeout(() => {
      handleTogglePlay();
    }, 150);
  };

  const replaysRemaining = Math.max(0, maxReplays - playbackCount);

  return (
    <div className="bg-neutral-900 text-white rounded-2xl p-4 md:p-5 shadow-sm space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Playback Control Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleTogglePlay}
            disabled={!canPlay && !isPlaying}
            className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold shadow-sm transition-all cursor-pointer ${
              !canPlay && !isPlaying
                ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                : isPlaying
                ? "bg-amber-500 text-neutral-950 hover:bg-amber-400"
                : "bg-red-600 text-white hover:bg-red-500 active:scale-95"
            }`}
            title={isPlaying ? "Pause Audio" : "Play Audio"}
          >
            {isPlaying ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current ml-0.5" />}
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                <Volume2 size={14} className={isPlaying ? "text-red-400 animate-pulse" : "text-neutral-400"} />
                {isBn ? "অডিও প্রশ্ন" : "Official Audio Track"}
              </span>

              {mode === "exam" && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  replaysRemaining > 0 ? "bg-neutral-800 text-neutral-300" : "bg-red-950 text-red-400 border border-red-800"
                }`}>
                  {isBn ? `বাকি প্লে: ${replaysRemaining}` : `Plays left: ${replaysRemaining}`}
                </span>
              )}
            </div>

            <span className="text-[11px] text-neutral-400">
              {isPlaying
                ? isBn ? "বাজছে..." : "Playing broadcast..."
                : playbackCount > 0
                ? isBn ? "সম্পন্ন হয়েছে" : "Completed"
                : isBn ? "শুনতে প্লে বাটনে চাপুন" : "Click play to listen"}
            </span>
          </div>
        </div>

        {/* Speed & Practice Controls */}
        <div className="flex items-center gap-2">
          {/* Speed Selector */}
          <div className="flex items-center bg-neutral-800 rounded-lg p-0.5 text-[11px] font-mono font-medium">
            {[0.8, 1.0, 1.2].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSpeed(s)}
                className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                  speed === s ? "bg-neutral-700 text-white font-bold" : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Transcript toggle in Practice Mode */}
          {mode === "practice" && (
            <button
              type="button"
              onClick={() => setShowTranscript(!showTranscript)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px] font-medium transition-colors cursor-pointer"
            >
              {showTranscript ? <EyeOff size={13} /> : <Eye size={13} />}
              <span className="hidden sm:inline">{isBn ? "স্ক্রিপ্ট" : "Script"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar & Wave Animation */}
      <div className="space-y-1.5 pt-1">
        <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-150 ${
              isPlaying ? "bg-red-500" : "bg-neutral-600"
            }`}
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>

        <div className="flex justify-between text-[10px] font-mono text-neutral-500">
          <span>00:00</span>
          <span>00:{durationSeconds.toString().padStart(2, "0")}</span>
        </div>
      </div>

      {/* Practice Mode Transcript Reveal */}
      {showTranscript && (
        <div className="mt-2 p-3 rounded-xl bg-neutral-800/90 border border-neutral-700 text-xs text-neutral-200 leading-relaxed font-sans animate-fade-in">
          <div className="text-[10px] font-bold uppercase text-red-400 mb-1 tracking-wider">
            {isBn ? "অডিও লিখিত রূপ (লিসেনিং স্ক্রিপ্ট)" : "Audio Transcript:"}
          </div>
          <p className="text-base text-white font-medium mb-1">{audioScript}</p>
        </div>
      )}
    </div>
  );
};
