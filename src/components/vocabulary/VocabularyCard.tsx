import React from "react";
import { VocabularyWord, getCategoryInfo } from "../../types/hsk";
import { HSKBadge } from "../common/HSKBadge";
import { AudioButton } from "../common/AudioButton";
import { FavoriteButton } from "../common/FavoriteButton";
import { PinyinDisplay } from "./PinyinDisplay";
import { progressService } from "../../services/progressService";
import { navigate } from "../../services/routerService";
import { Check, Sparkles } from "lucide-react";

interface VocabularyCardProps {
  word: VocabularyWord;
  className?: string;
}

export const VocabularyCard: React.FC<VocabularyCardProps> = ({ word, className = "" }) => {
  const progress = progressService.getProgress(word.id);
  const status = progress?.status || "unseen";

  const statusColors = {
    unseen: "bg-neutral-100 text-neutral-500 border-neutral-200",
    learning: "bg-blue-50 text-blue-700 border-blue-200",
    familiar: "bg-emerald-50 text-emerald-700 border-emerald-200",
    mastered: "bg-amber-50 text-amber-800 border-amber-200",
  }[status];

  const statusLabels = {
    unseen: "New",
    learning: "Learning",
    familiar: "Familiar",
    mastered: "Mastered",
  }[status];

  // Distinct categories/parts of speech
  const uniquePosList: string[] = Array.from(
    new Set(word.definitions.flatMap((d) => d.partOfSpeech).filter((p): p is string => Boolean(p)))
  );

  return (
    <div
      onClick={() => navigate(`/vocabulary/${word.id}`)}
      className={`group relative rounded-xl border border-neutral-200/80 bg-white p-5 hover:border-neutral-300 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between ${className}`}
    >
      <div>
        {/* Card Header: Badges & Actions */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <HSKBadge level={word.hskLevel} size="sm" />
            <span
              className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md border ${statusColors}`}
            >
              {statusLabels}
            </span>
            {uniquePosList.map((pos) => {
              const cat = getCategoryInfo(pos);
              return (
                <span
                  key={pos}
                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${cat.badgeClass}`}
                  title={`${cat.name} (${cat.chinese}) - ${cat.description}`}
                >
                  {cat.name}
                </span>
              );
            })}
            {word.alternateReadings && word.alternateReadings.length > 0 && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200" title="Has alternate readings">
                Alt
              </span>
            )}
          </div>

          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <AudioButton wordId={word.id} size="sm" />
            <FavoriteButton wordId={word.id} size="sm" />
          </div>
        </div>

        {/* Large Hanzi & Pinyin */}
        <div className="mb-3">
          <div className="text-3xl font-bold font-hanzi text-neutral-900 tracking-tight group-hover:text-red-600 transition-colors">
            {word.hanzi}
          </div>
          <div className="mt-1">
            <PinyinDisplay syllables={word.syllables} wordId={word.id} size="sm" />
          </div>
        </div>

        {/* Definition & Part of Speech */}
        <div className="text-sm text-neutral-700 leading-snug line-clamp-2 mb-2">
          {word.definitions.map((d) => d.text).join("; ")}
        </div>
      </div>

      {/* Footer: Category & Study Link */}
      <div className="pt-3 mt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-600">
        <span className="text-neutral-500 font-mono text-[11px]">
          {uniquePosList.map((p) => {
            const cat = getCategoryInfo(p);
            return `${cat.name} · ${cat.chinese}`;
          }).join(", ") || "Word"}
        </span>

        <span className="text-red-600 font-semibold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
          Study Word →
        </span>
      </div>
    </div>
  );
};
