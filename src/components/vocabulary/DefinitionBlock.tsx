import React from "react";
import { AlternateReading, Definition, getCategoryInfo } from "../../types/hsk";
import { PinyinDisplay } from "./PinyinDisplay";
import { Info, RotateCw } from "lucide-react";
import { navigate } from "../../services/routerService";

interface DefinitionBlockProps {
  definitions: Definition[];
  alternateReadings?: AlternateReading[];
  sourceFile?: string;
  sourcePage?: number;
  sourceLabel?: string;
}

export const DefinitionBlock: React.FC<DefinitionBlockProps> = ({
  definitions,
  alternateReadings,
  sourceFile,
  sourcePage,
  sourceLabel,
}) => {
  return (
    <div className="space-y-4">
      {/* Primary Definitions */}
      <div className="space-y-2.5">
        {definitions.map((def, idx) => (
          <div key={idx} className="flex flex-col sm:flex-row sm:items-baseline gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              {def.partOfSpeech.map((pos, pIdx) => {
                const cat = getCategoryInfo(pos);
                return (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => navigate(`/vocabulary?category=${encodeURIComponent(cat.code)}`)}
                    className={`px-2 py-0.5 text-xs font-medium rounded border cursor-pointer hover:opacity-85 transition-opacity flex items-center gap-1 ${cat.badgeClass}`}
                    title={`Word Category: ${cat.name} (${cat.chinese}) - Click to browse all ${cat.name}s`}
                  >
                    <span>{cat.name}</span>
                    <span className="opacity-75 font-hanzi">· {cat.chinese}</span>
                  </button>
                );
              })}
            </div>
            <span className="text-base text-neutral-900 leading-relaxed font-normal">
              {def.text}
            </span>
          </div>
        ))}
      </div>

      {/* Alternate Readings & Pronunciations */}
      {alternateReadings && alternateReadings.length > 0 && (
        <div className="p-3.5 rounded-xl border border-amber-200/80 bg-amber-50/40 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-900">
            <RotateCw size={14} className="text-amber-600" />
            <span>Alternate Reading & Pronunciation</span>
          </div>

          {alternateReadings.map((alt, aIdx) => (
            <div key={aIdx} className="space-y-1 pl-5 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-neutral-500 text-xs">Also pronounced:</span>
                <PinyinDisplay syllables={alt.syllables} size="sm" />
              </div>
              {alt.note && (
                <p className="text-xs text-neutral-600 italic">{alt.note}</p>
              )}
              {alt.definitions && (
                <p className="text-xs text-neutral-700">
                  <strong className="font-medium text-neutral-900">Alternate sense: </strong>
                  {alt.definitions.join("; ")}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Provenance Metadata */}
      {sourceFile && (
        <div className="flex items-center gap-1.5 text-[11px] text-neutral-600 pt-1">
          <Info size={12} className="text-neutral-500" />
          <span>
            Source: <span className="font-mono text-neutral-700">{sourceFile}</span>
            {sourcePage ? ` (p. ${sourcePage})` : ""} · {sourceLabel || "HSK 3.0"}
          </span>
        </div>
      )}
    </div>
  );
};
