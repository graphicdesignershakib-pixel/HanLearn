import React, { useState, useEffect } from "react";
import { PenTool, RotateCcw, Undo2, CheckCircle2, Sparkles, BookOpen } from "lucide-react";
import { ExamQuestion, ExamMode } from "../../types/exam";
import { WritingCanvas } from "../stroke/WritingCanvas";

interface WritingQuestionCardProps {
  question: ExamQuestion;
  userAnswer: string;
  onUpdateAnswer: (answer: string) => void;
  mode: ExamMode;
  isBn?: boolean;
}

export const WritingQuestionCard: React.FC<WritingQuestionCardProps> = ({
  question,
  userAnswer,
  onUpdateAnswer,
  mode,
  isBn = false,
}) => {
  const isPractice = mode === "practice";

  // For sentence unscramble
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [availableTokens, setAvailableTokens] = useState<string[]>([]);
  const [showCanvas, setShowCanvas] = useState(false);

  useEffect(() => {
    if (question.type === "writing_sentence_order" && question.unscrambleTokens) {
      if (userAnswer) {
        // If an answer is already recorded, parse tokens
        const tokens = userAnswer.split(" ").filter(Boolean);
        setSelectedTokens(tokens);
        // Available tokens are the rest
        const remaining = [...question.unscrambleTokens];
        tokens.forEach((t) => {
          const idx = remaining.indexOf(t);
          if (idx !== -1) remaining.splice(idx, 1);
        });
        setAvailableTokens(remaining);
      } else {
        setSelectedTokens([]);
        setAvailableTokens([...question.unscrambleTokens]);
      }
    }
  }, [question, userAnswer]);

  const handlePickToken = (token: string, tokenIndex: number) => {
    const nextAvailable = [...availableTokens];
    nextAvailable.splice(tokenIndex, 1);
    const nextSelected = [...selectedTokens, token];

    setAvailableTokens(nextAvailable);
    setSelectedTokens(nextSelected);

    // Save as space-separated tokens or concatenated sentence
    onUpdateAnswer(nextSelected.join(""));
  };

  const handleRemoveToken = (token: string, tokenIndex: number) => {
    const nextSelected = [...selectedTokens];
    nextSelected.splice(tokenIndex, 1);
    const nextAvailable = [...availableTokens, token];

    setSelectedTokens(nextSelected);
    setAvailableTokens(nextAvailable);

    onUpdateAnswer(nextSelected.join(""));
  };

  const handleResetTokens = () => {
    if (!question.unscrambleTokens) return;
    setSelectedTokens([]);
    setAvailableTokens([...question.unscrambleTokens]);
    onUpdateAnswer("");
  };

  const handleUndoToken = () => {
    if (selectedTokens.length === 0) return;
    const last = selectedTokens[selectedTokens.length - 1];
    handleRemoveToken(last, selectedTokens.length - 1);
  };

  const isOrderCorrect =
    isPractice &&
    userAnswer.replace(/[\s，。！？]/g, "") ===
      question.correctAnswer.replace(/[\s，。！？]/g, "");

  return (
    <div className="space-y-6">
      {/* Question Header Card */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-neutral-400 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <PenTool size={14} className="text-red-600" />
            {isBn ? "রাইটিং (লিখন) প্রশ্ন" : "Writing Task"}
          </span>
          <span>{question.points} {isBn ? "পয়েন্ট" : "Pts"}</span>
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-neutral-900 leading-snug">
          {question.promptZh}
        </h2>

        {isPractice && (
          <div className="space-y-1 text-sm text-neutral-600 border-t border-neutral-100 pt-2">
            {question.promptPinyin && (
              <p className="font-mono text-red-600 text-xs">{question.promptPinyin}</p>
            )}
            <p className="text-xs text-neutral-600">
              {isBn && question.promptBn ? question.promptBn : question.promptEn}
            </p>
          </div>
        )}
      </div>

      {/* Type 1: Sentence Unscrambler */}
      {question.type === "writing_sentence_order" && (
        <div className="space-y-5">
          {/* Candidate Constructed Sentence Display */}
          <div className="bg-neutral-50 rounded-2xl border-2 border-dashed border-neutral-300 p-5 min-h-[90px] flex flex-wrap items-center gap-2">
            {selectedTokens.length === 0 ? (
              <span className="text-sm text-neutral-400 font-medium italic">
                {isBn
                  ? "নিচের শব্দগুলোতে ক্লিক করে বাক্য গঠন করুন..."
                  : "Click word chips below to construct the Chinese sentence..."}
              </span>
            ) : (
              selectedTokens.map((token, idx) => (
                <button
                  key={`${token}-${idx}`}
                  type="button"
                  onClick={() => handleRemoveToken(token, idx)}
                  className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-base shadow-xs transition-transform active:scale-95 cursor-pointer"
                  title="Click to remove"
                >
                  {token}
                </button>
              ))
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              {isBn ? "উপলব্ধ শব্দসমূহ:" : "Available Word Tokens:"}
            </span>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleUndoToken}
                disabled={selectedTokens.length === 0}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-semibold text-neutral-700 disabled:opacity-40 cursor-pointer"
              >
                <Undo2 size={13} />
                <span>{isBn ? "পূর্বাবস্থা" : "Undo"}</span>
              </button>

              <button
                type="button"
                onClick={handleResetTokens}
                disabled={selectedTokens.length === 0}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-semibold text-neutral-700 disabled:opacity-40 cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>{isBn ? "পুনরায় সেট করুন" : "Reset"}</span>
              </button>
            </div>
          </div>

          {/* Tokens Palette */}
          <div className="flex flex-wrap gap-2.5">
            {availableTokens.map((token, idx) => (
              <button
                key={`${token}-${idx}`}
                type="button"
                onClick={() => handlePickToken(token, idx)}
                className="px-4 py-2.5 rounded-xl border border-neutral-300 bg-white hover:border-red-500 hover:bg-red-50/50 text-neutral-900 font-bold text-base shadow-2xs transition-all active:scale-95 cursor-pointer"
              >
                {token}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Type 2: Character Writing with Canvas TianZiGe */}
      {question.type === "writing_character_fill" && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => onUpdateAnswer(e.target.value)}
              placeholder={isBn ? "হানজি লিখুন..." : "Type Chinese character..."}
              className="flex-1 px-4 py-3 rounded-xl border border-neutral-200 focus:border-red-600 focus:ring-2 focus:ring-red-100 text-lg font-bold"
            />

            <button
              type="button"
              onClick={() => setShowCanvas(!showCanvas)}
              className="px-4 py-3 rounded-xl bg-neutral-900 text-white font-semibold text-xs hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              {showCanvas ? (isBn ? "ক্যানভাস লুকান" : "Hide TianZiGe") : (isBn ? "হাতে লিখুন" : "Draw Strokes")}
            </button>
          </div>

          {showCanvas && (
            <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 flex flex-col items-center">
              <WritingCanvas
                character={question.targetCharacter || "中"}
                size={260}
                onComplete={() => onUpdateAnswer(question.targetCharacter || "中")}
              />
            </div>
          )}
        </div>
      )}

      {/* Type 3: Long Essay / Composition */}
      {question.type === "writing_composition" && (
        <div className="space-y-3">
          <textarea
            rows={8}
            value={userAnswer}
            onChange={(e) => onUpdateAnswer(e.target.value)}
            placeholder={
              isBn
                ? "এখানে আপনার চীনা প্রবন্ধ লিখুন..."
                : "Type your written composition in Chinese characters here..."
            }
            className="w-full p-4 rounded-xl border border-neutral-200 focus:border-red-600 focus:ring-2 focus:ring-red-100 text-base leading-relaxed"
          />

          <div className="flex items-center justify-between text-xs text-neutral-500 font-mono">
            <span>
              {isBn ? "অক্ষর সংখ্যা:" : "Characters:"}{" "}
              <strong className="text-neutral-900">{userAnswer.length}</strong>
              {question.minWordCount && ` (Min: ${question.minWordCount})`}
            </span>

            <button
              type="button"
              onClick={() => onUpdateAnswer("")}
              className="text-neutral-400 hover:text-red-600 cursor-pointer"
            >
              {isBn ? "মুছুন" : "Clear text"}
            </button>
          </div>
        </div>
      )}

      {/* Practice Mode Reference Answer */}
      {isPractice && userAnswer && (
        <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-700 space-y-2 animate-fade-in">
          <div className="flex items-center gap-1.5 font-bold text-neutral-900 uppercase tracking-wider">
            <Sparkles size={14} className="text-amber-500" />
            <span>{isBn ? "রেফারেন্স উত্তর ও ব্যাকরণ:" : "Reference Answer & Grammar:"}</span>
          </div>
          <p className="text-sm font-bold text-neutral-900">{question.correctAnswer}</p>
          <p className="leading-relaxed">{question.explanationZh}</p>
          <p className="text-neutral-500">
            {isBn && question.explanationBn ? question.explanationBn : question.explanationEn}
          </p>
        </div>
      )}
    </div>
  );
};
