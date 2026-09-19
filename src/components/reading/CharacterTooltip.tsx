import React from "react";
import { Volume2, Star, X, BookOpen, Layers, Sparkles } from "lucide-react";
import { ParsedToken } from "../../services/chineseTextParser";
import { audioService } from "../../services/audioService";
import { progressService } from "../../services/progressService";

interface CharacterTooltipProps {
  token: ParsedToken;
  position?: { top: number; left: number };
  onClose: () => void;
  isBn?: boolean;
}

export const CharacterTooltip: React.FC<CharacterTooltipProps> = ({
  token,
  position,
  onClose,
  isBn = false,
}) => {
  const isFavorite = token.wordId ? progressService.isFavorite(token.wordId) : false;

  const handleSpeak = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    audioService.speakText(text);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (token.wordId) {
      progressService.toggleFavorite(token.wordId);
    }
  };

  // Compute tooltip position style if coordinates provided, with viewport bounding
  const style: React.CSSProperties = position
    ? {
        position: "fixed",
        top: Math.min(Math.max(16, position.top), window.innerHeight - 280),
        left: Math.min(Math.max(16, position.left - 140), window.innerWidth - 320),
        zIndex: 100,
      }
    : {};

  return (
    <div
      style={style}
      className="w-72 sm:w-80 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-neutral-200/90 text-neutral-900 p-4 space-y-3 pointer-events-auto animate-in fade-in zoom-in-95 duration-150"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header Row */}
      <div className="flex items-start justify-between gap-2 border-b border-neutral-100 pb-3">
        <div className="flex items-baseline gap-2.5">
          <span className="font-hanzi text-3xl font-bold tracking-tight text-neutral-900">
            {token.text}
          </span>
          {token.pinyin && (
            <span className="text-sm font-mono font-semibold text-rose-600">
              {token.pinyin}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => handleSpeak(e, token.text)}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
            title="Listen to pronunciation"
          >
            <Volume2 size={16} />
          </button>
          {token.wordId && (
            <button
              type="button"
              onClick={handleToggleFavorite}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isFavorite
                  ? "text-amber-500 hover:bg-amber-50"
                  : "text-neutral-400 hover:text-amber-500 hover:bg-neutral-100"
              }`}
              title={isFavorite ? "Remove favorite" : "Add to favorites"}
            >
              <Star size={16} className={isFavorite ? "fill-current text-amber-500" : ""} />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
            title="Close"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Meanings */}
      <div className="space-y-1.5 text-xs">
        {token.english && (
          <div className="flex items-start gap-1.5 text-neutral-700">
            <span className="font-semibold text-neutral-400 shrink-0">EN:</span>
            <span className="font-medium">{token.english}</span>
          </div>
        )}
        {token.bengali && (
          <div className="flex items-start gap-1.5 text-emerald-800 bg-emerald-50/70 px-2 py-1 rounded-lg border border-emerald-100">
            <span className="font-semibold text-emerald-600 shrink-0 font-bangla">বাংলা:</span>
            <span className="font-medium font-bangla">{token.bengali}</span>
          </div>
        )}
      </div>

      {/* Badges & Meta */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
        {token.hskLevel && (
          <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-bold border border-rose-200">
            HSK {token.hskLevel}
          </span>
        )}
        {token.strokeCount && (
          <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 font-medium flex items-center gap-1">
            <Layers size={11} />
            <span>{token.strokeCount} {isBn ? "স্ট্রোক" : "strokes"}</span>
          </span>
        )}
        {token.radical && token.radical !== "—" && (
          <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 font-medium">
            Radical: {token.radical}
          </span>
        )}
      </div>

      {/* Multi-character breakdown if applicable */}
      {token.characterBreakdown && token.characterBreakdown.length > 1 && (
        <div className="pt-2 border-t border-neutral-100 space-y-1.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1">
            <Sparkles size={11} className="text-amber-500" />
            <span>{isBn ? "অক্ষরভিত্তিক বিশ্লেষণ" : "Character Breakdown"}</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            {token.characterBreakdown.map((ch, idx) => (
              <div
                key={idx}
                className="p-1.5 rounded-lg bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/60 flex items-center justify-between gap-1 cursor-pointer transition-colors"
                onClick={(e) => handleSpeak(e, ch.char)}
                title={`Click to listen to ${ch.char}`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="font-hanzi font-bold text-neutral-900 text-sm">
                    {ch.char}
                  </span>
                  <div className="min-w-0">
                    <div className="font-mono text-rose-600 text-[10px] truncate">{ch.pinyin}</div>
                    <div className="text-neutral-500 text-[9px] truncate">
                      {isBn && ch.bengali ? ch.bengali : ch.meaning}
                    </div>
                  </div>
                </div>
                <Volume2 size={12} className="text-neutral-400 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
