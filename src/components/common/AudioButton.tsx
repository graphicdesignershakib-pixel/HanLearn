import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { audioService } from "../../services/audioService";

interface AudioButtonProps {
  wordId?: string;
  sentenceId?: string;
  text?: string;
  syllableIndex?: number;
  size?: "sm" | "md" | "lg";
  rate?: number;
  label?: string;
  showSlowToggle?: boolean;
  className?: string;
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  wordId,
  sentenceId,
  text,
  syllableIndex,
  size = "md",
  rate = 1.0,
  label,
  showSlowToggle = false,
  className = "",
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSlow, setIsSlow] = useState(false);
  const isAvailable = audioService.isAvailable();

  useEffect(() => {
    const unsub = audioService.onStateChange((playing) => {
      setIsPlaying(playing);
    });
    return unsub;
  }, []);

  const handlePlay = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAvailable || isPlaying) {
      if (isPlaying) {
        audioService.stop();
      }
      return;
    }

    try {
      audioService.setRate(isSlow ? 0.65 : rate);

      if (wordId && syllableIndex !== undefined) {
        await audioService.playSyllable(wordId, syllableIndex);
      } else if (wordId) {
        await audioService.playWord(wordId);
      } else if (sentenceId) {
        await audioService.playSentence(sentenceId);
      } else if (text) {
        await audioService.playText(text);
      }
    } finally {
      // Revert rate
      audioService.setRate(1.0);
    }
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22,
  }[size];

  const buttonPaddings = {
    sm: "p-1.5 text-xs",
    md: "p-2 text-sm",
    lg: "p-2.5 text-base",
  }[size];

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <button
        type="button"
        onClick={handlePlay}
        disabled={!isAvailable}
        title={!isAvailable ? "Audio not available in this browser" : isPlaying ? "Stop audio" : "Play pronunciation"}
        aria-label={label || "Play pronunciation audio"}
        className={`inline-flex items-center justify-center rounded-full transition-all border ${buttonPaddings} ${
          !isAvailable
            ? "border-neutral-200 text-neutral-300 cursor-not-allowed bg-neutral-50"
            : isPlaying
            ? "border-red-500/40 bg-red-50 text-red-600 ring-2 ring-red-500/20"
            : "border-neutral-200 text-neutral-700 bg-white hover:bg-neutral-50 hover:text-neutral-950 active:bg-neutral-100"
        }`}
      >
        {!isAvailable ? (
          <VolumeX size={iconSizes} />
        ) : isPlaying ? (
          <Volume2 size={iconSizes} className="animate-pulse text-red-600" />
        ) : (
          <Volume2 size={iconSizes} />
        )}
        {label && <span className="ml-1.5 font-medium">{label}</span>}
      </button>

      {showSlowToggle && isAvailable && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsSlow(!isSlow);
          }}
          className={`px-2 py-1 text-xs rounded border transition-colors ${
            isSlow
              ? "bg-neutral-800 text-white border-neutral-800 font-semibold"
              : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
          }`}
          title="Toggle slow pronunciation (0.65x)"
        >
          Slow
        </button>
      )}
    </div>
  );
};
