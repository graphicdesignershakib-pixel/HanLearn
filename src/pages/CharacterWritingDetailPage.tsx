import React, { useState } from "react";
import { vocabularyService } from "../services/vocabularyService";
import { progressService } from "../services/progressService";
import { StrokeOrderViewer } from "../components/stroke/StrokeOrderViewer";
import { InteractiveHandwritingCanvas } from "../components/stroke/InteractiveHandwritingCanvas";
import { AudioButton } from "../components/common/AudioButton";
import { navigate } from "../services/routerService";
import { ArrowLeft, Edit3, Sparkles, BookOpen, Layers } from "lucide-react";
import { ChineseCharacter } from "../types/hsk";

interface CharacterWritingDetailPageProps {
  character: string;
}

export const CharacterWritingDetailPage: React.FC<CharacterWritingDetailPageProps> = ({
  character: rawChar,
}) => {
  const targetChar = rawChar ? decodeURIComponent(rawChar)[0] : "好";
  const [practicedCount, setPracticedCount] = useState(0);

  // Lookup metadata for character
  const charData: ChineseCharacter = vocabularyService.getCharacter(targetChar) || {
    id: `char-${targetChar}`,
    hanzi: targetChar,
    pinyin: ["hǎo"],
    strokeCount: 6,
    radical: "女",
    meaning: "good; well",
  };

  // Find vocabulary words containing this character
  const relatedWords = vocabularyService
    .getAllWords()
    .filter((w) => w.hanzi.includes(targetChar))
    .slice(0, 6);

  const handleWriteComplete = () => {
    setPracticedCount((c) => c + 1);
    progressService.recordStudySession({
      timeSpentMs: 30000,
      charactersWritten: 1,
    });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate("/writing")}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
      >
        <ArrowLeft size={14} />
        <span>Back to Character Directory</span>
      </button>

      {/* Character Banner */}
      <div className="p-6 md:p-8 rounded-3xl border border-neutral-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-center text-5xl font-hanzi font-bold text-neutral-900 shadow-inner">
            {targetChar}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xl font-bold text-neutral-900">
                {charData.pinyin?.join(", ") || ""}
              </span>
              <AudioButton text={targetChar} size="sm" />
            </div>

            <div className="flex items-center gap-3 text-xs text-neutral-600">
              {charData.strokeCount && (
                <span>
                  Strokes: <strong className="text-neutral-900">{charData.strokeCount}</strong>
                </span>
              )}
              {charData.radical && (
                <span>
                  Radical: <strong className="text-neutral-900">{charData.radical}</strong>
                </span>
              )}
            </div>

            {charData.meaning && (
              <p className="text-xs text-neutral-700 font-medium pt-0.5">
                {charData.meaning}
              </p>
            )}
          </div>
        </div>

        {practicedCount > 0 && (
          <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <Sparkles size={16} className="text-emerald-500" />
            <span>Completed {practicedCount} practice rounds</span>
          </div>
        )}
      </div>

      {/* Main Studio Grid: Animation (Left) & Canvas (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Reference Stroke Order */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
              1. Stroke Order Animation
            </h3>
            <span className="text-xs text-neutral-500">Observe stroke trajectory</span>
          </div>

          <StrokeOrderViewer character={targetChar} size={280} />
        </div>

        {/* Right Column: Writing Canvas */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
              2. Interactive Calligraphy Canvas
            </h3>
            <span className="text-xs text-neutral-500">Live Stroke Order Grading</span>
          </div>

          <InteractiveHandwritingCanvas
            character={targetChar}
            size={320}
            onComplete={handleWriteComplete}
          />
        </div>
      </div>

      {/* Related Vocabulary Section */}
      {relatedWords.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-neutral-200">
          <h3 className="text-base font-bold text-neutral-900">
            Words Containing "{targetChar}"
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {relatedWords.map((word) => (
              <button
                key={word.id}
                type="button"
                onClick={() => navigate(`/vocabulary/${word.id}`)}
                className="p-3 rounded-xl border border-neutral-200 bg-white hover:border-red-500 text-center transition-colors group"
              >
                <div className="text-2xl font-hanzi font-bold text-neutral-900 group-hover:text-red-600 mb-1">
                  {word.hanzi}
                </div>
                <div className="text-xs font-mono text-neutral-500">{word.pinyinDisplay}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
