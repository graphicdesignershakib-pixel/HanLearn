import React from "react";
import { PinyinSyllable } from "../../types/hsk";
import { audioService } from "../../services/audioService";
import { TONE_CONTOURS } from "../../lib/tones";

interface PinyinDisplayProps {
  syllables: PinyinSyllable[];
  wordId?: string;
  size?: "sm" | "md" | "lg" | "xl";
  interactive?: boolean;
  className?: string;
}

export const PinyinDisplay: React.FC<PinyinDisplayProps> = ({
  syllables,
  wordId,
  size = "md",
  interactive = true,
  className = "",
}) => {
  const sizeClasses = {
    sm: "text-xs gap-1",
    md: "text-sm gap-1.5",
    lg: "text-base gap-2 font-medium",
    xl: "text-xl md:text-2xl gap-2.5 font-medium tracking-wide",
  }[size];

  const handleSyllableClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    if (!interactive) return;

    if (wordId) {
      audioService.playSyllable(wordId, index);
    } else if (syllables[index]) {
      audioService.playText(syllables[index].display);
    }
  };

  return (
    <div className={`inline-flex flex-wrap items-center ${sizeClasses} ${className}`}>
      {syllables.map((syllable, idx) => {
        const toneInfo = TONE_CONTOURS[syllable.tone] || TONE_CONTOURS[0];

        return (
          <button
            key={idx}
            type="button"
            onClick={(e) => handleSyllableClick(e, idx)}
            title={`Tone ${syllable.tone}: ${toneInfo.label} — click to listen`}
            className={`group inline-flex items-center px-1.5 py-0.5 rounded transition-colors ${
              interactive
                ? "hover:bg-neutral-100 hover:text-red-700 cursor-pointer"
                : "cursor-default"
            }`}
          >
            <span className="font-mono text-neutral-800 group-hover:text-red-700">
              {syllable.display}
            </span>
            {syllable.tone > 0 && (
              <span
                className={`ml-1 text-[10px] px-1 py-0.2 rounded font-sans font-bold ${
                  syllable.tone === 1
                    ? "bg-blue-100 text-blue-800"
                    : syllable.tone === 2
                    ? "bg-emerald-100 text-emerald-800"
                    : syllable.tone === 3
                    ? "bg-amber-100 text-amber-800"
                    : "bg-rose-100 text-rose-800"
                }`}
              >
                T{syllable.tone}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
