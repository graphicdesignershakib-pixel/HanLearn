import React from "react";
import { ExampleSentence, VocabularyWord } from "../../types/hsk";
import { AudioButton } from "../common/AudioButton";
import { navigate } from "../../services/routerService";
import { Sparkles, ArrowRight } from "lucide-react";

interface ExampleSentenceCardProps {
  sentence: ExampleSentence;
  targetWord?: VocabularyWord;
  className?: string;
}

export const ExampleSentenceCard: React.FC<ExampleSentenceCardProps> = ({
  sentence,
  targetWord,
  className = "",
}) => {
  // Highlight target word in the Chinese sentence if provided
  const renderChinese = () => {
    if (!targetWord || !sentence.chinese.includes(targetWord.hanzi)) {
      return <span>{sentence.chinese}</span>;
    }

    const parts = sentence.chinese.split(targetWord.hanzi);
    return (
      <span>
        {parts.map((part, i) => (
          <React.Fragment key={i}>
            {part}
            {i < parts.length - 1 && (
              <span className="text-red-600 font-semibold bg-red-50/80 px-1 py-0.5 rounded">
                {targetWord.hanzi}
              </span>
            )}
          </React.Fragment>
        ))}
      </span>
    );
  };

  return (
    <div className={`p-4 rounded-xl border border-neutral-200 bg-white space-y-3 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5 flex-1">
          <div className="text-lg font-hanzi font-medium text-neutral-900 leading-snug">
            {renderChinese()}
          </div>
          <div className="text-sm font-mono text-neutral-500">
            {sentence.pinyin}
          </div>
          <div className="text-sm text-neutral-700 font-normal">
            {sentence.english}
          </div>
        </div>

        <AudioButton sentenceId={sentence.id} text={sentence.chinese} size="sm" />
      </div>

      <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
        <span className="text-neutral-600">
          Source: {sentence.source === "manual" ? "Curated" : "Generated"}
        </span>

        <button
          type="button"
          onClick={() => navigate(`/practice/sentences?id=${sentence.id}`)}
          className="text-red-600 font-semibold hover:text-red-700 flex items-center gap-1"
        >
          <span>Practice Sentence</span>
          <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
};
