import React from "react";
import { ChineseCharacter } from "../../types/hsk";
import { navigate } from "../../services/routerService";
import { Edit3, Play } from "lucide-react";
import { AudioButton } from "../common/AudioButton";

interface CharacterCardProps {
  character: ChineseCharacter;
  className?: string;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ character, className = "" }) => {
  return (
    <div className={`p-4 rounded-xl border border-neutral-200 bg-white flex items-center justify-between gap-4 ${className}`}>
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-lg bg-neutral-50 border border-neutral-200/80 flex items-center justify-center text-3xl font-hanzi text-neutral-900 font-bold shadow-xs">
          {character.hanzi}
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-semibold text-neutral-800">
              {character.pinyin?.join(", ") || ""}
            </span>
            {character.strokeCount && (
              <span className="text-xs text-neutral-500 font-medium">
                · {character.strokeCount} strokes
              </span>
            )}
          </div>

          {character.radical && (
            <div className="text-xs text-neutral-600">
              Radical: <span className="font-medium text-neutral-800">{character.radical}</span>
            </div>
          )}

          {character.meaning && (
            <div className="text-xs text-neutral-600 line-clamp-1">
              {character.meaning}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <AudioButton text={character.hanzi} size="sm" />
        <button
          type="button"
          onClick={() => navigate(`/writing/${encodeURIComponent(character.hanzi)}`)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors shadow-xs"
        >
          <Edit3 size={13} />
          <span>Write</span>
        </button>
      </div>
    </div>
  );
};
