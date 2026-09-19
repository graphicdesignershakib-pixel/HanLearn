import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Search,
  X,
  Volume2,
  BookOpen,
  ArrowRight,
  Sparkles,
  Command,
  CornerDownLeft,
  ExternalLink,
  Edit3,
  Bookmark,
  Check,
  GitFork,
} from "lucide-react";
import { vocabularyService } from "../../services/vocabularyService";
import { audioService } from "../../services/audioService";
import { bengaliService } from "../../services/bengaliService";
import { progressService } from "../../services/progressService";
import { navigate } from "../../services/routerService";
import { VocabularyWord } from "../../types/hsk";
import { removePinyinTones } from "../../lib/pinyinUtils";

interface QuickDictionaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickDictionaryModal: React.FC<QuickDictionaryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedWord, setSelectedWord] = useState<VocabularyWord | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const isBn = bengaliService.getLanguage() === "bn";

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setSavedIds(progressService.getFavoritesSet());
    }
  }, [isOpen]);

  // Global ESC key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Search results
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      // Suggest high-frequency starter words
      return vocabularyService.getWordsByLevel("1").slice(0, 10);
    }

    const cleanQ = removePinyinTones(q);
    const allWords = vocabularyService.getAllWords();

    const matches: { word: VocabularyWord; score: number }[] = [];

    for (const w of allWords) {
      let score = 0;
      const hanzi = w.hanzi;
      const pinyin = w.pinyinDisplay.toLowerCase();
      const cleanPinyin = removePinyinTones(pinyin);
      const enText = w.definitions.map((d) => d.text.toLowerCase()).join(" ");
      const bnMeaning = bengaliService.getBengaliWordMeaning(hanzi)?.toLowerCase() || "";

      // Exact Hanzi match
      if (hanzi === q) score += 100;
      else if (hanzi.startsWith(q)) score += 80;
      else if (hanzi.includes(q)) score += 60;

      // Exact Pinyin match
      if (pinyin === q || cleanPinyin === cleanQ) score += 90;
      else if (pinyin.startsWith(q) || cleanPinyin.startsWith(cleanQ)) score += 70;
      else if (cleanPinyin.includes(cleanQ)) score += 50;

      // English match
      if (enText.includes(q)) score += 40;

      // Bengali match
      if (bnMeaning.includes(q)) score += 45;

      if (score > 0) {
        matches.push({ word: w, score });
      }
    }

    // Sort by relevance score descending
    matches.sort((a, b) => b.score - a.score);
    return matches.slice(0, 20).map((m) => m.word);
  }, [searchQuery]);

  // Update selected word when results or index change
  useEffect(() => {
    if (searchResults.length > 0) {
      const idx = Math.min(selectedIndex, searchResults.length - 1);
      setSelectedWord(searchResults[idx]);
    } else {
      setSelectedWord(null);
    }
  }, [searchResults, selectedIndex]);

  // Keyboard navigation inside modal (ArrowUp, ArrowDown, Enter)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, searchResults.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + searchResults.length) % Math.max(1, searchResults.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedWord) {
        handleOpenWord(selectedWord);
      }
    }
  };

  const handleOpenWord = (w: VocabularyWord) => {
    onClose();
    navigate(`/vocabulary/${w.id}`);
  };

  const handleToggleSave = (e: React.MouseEvent, w: VocabularyWord) => {
    e.stopPropagation();
    progressService.toggleFavorite(w.id);
    setSavedIds(progressService.getFavoritesSet());
  };

  const handlePlayAudio = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    audioService.speakText(text);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-3 sm:px-4 bg-neutral-950/60 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[85vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center gap-3 bg-white">
          <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <Search size={20} />
          </div>

          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder={
                isBn
                  ? "দ্রুত খুঁজুন: চীনা অক্ষর (好), পিনয়িন (hao/hǎo), অথবা অর্থ..."
                  : "Quick dictionary: Hanzi (好), Pinyin (hao or hǎo), or English..."
              }
              className="w-full text-base sm:text-lg font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none bg-transparent"
            />
          </div>

          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                inputRef.current?.focus();
              }}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-neutral-100 border border-neutral-200 text-[11px] font-mono font-bold text-neutral-500">
            <span>ESC</span>
          </div>
        </div>

        {/* Search Content Grid (List on Left, Live Preview on Right) */}
        <div className="flex-1 flex flex-col sm:flex-row min-h-0 overflow-hidden">
          {/* Results List */}
          <div
            ref={resultsContainerRef}
            className="w-full sm:w-1/2 overflow-y-auto divide-y divide-neutral-100 p-2 border-r border-neutral-100 max-h-[380px] sm:max-h-[480px]"
          >
            {searchResults.length === 0 ? (
              <div className="p-8 text-center text-neutral-400 space-y-2">
                <BookOpen size={32} className="mx-auto text-neutral-300 stroke-[1.5]" />
                <p className="text-sm font-semibold text-neutral-700">
                  {isBn ? "কোন শব্দ পাওয়া যায়নি" : "No vocabulary matched"}
                </p>
                <p className="text-xs text-neutral-400">
                  {isBn
                    ? "বানান পরীক্ষা করুন অথবা পিনয়িন টোন ছাড়া লিখে দেখুন।"
                    : "Try searching without tone accents or search in English."}
                </p>
              </div>
            ) : (
              searchResults.map((word, idx) => {
                const isSelected = idx === selectedIndex;
                const isSaved = savedIds.has(word.id);
                const bnMeaning = bengaliService.getBengaliWordMeaning(word.hanzi);

                return (
                  <div
                    key={word.id}
                    onClick={() => handleOpenWord(word)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`p-3 rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? "bg-red-50/70 border border-red-200/80 shadow-xs"
                        : "hover:bg-neutral-50 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-white border border-neutral-200 flex items-center justify-center font-hanzi text-2xl font-bold text-neutral-900 shrink-0 shadow-2xs">
                        {word.hanzi}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-neutral-900">
                            {word.pinyinDisplay}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-neutral-100 text-neutral-600">
                            HSK {word.hskLevel}
                          </span>
                        </div>

                        <div className="text-xs text-neutral-500 truncate mt-0.5">
                          {bnMeaning ? (
                            <span className="text-red-700 font-medium">বাংলা: {bnMeaning} · </span>
                          ) : null}
                          <span>{word.definitions[0]?.text || "—"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => handlePlayAudio(e, word.hanzi)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Listen"
                      >
                        <Volume2 size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleToggleSave(e, word)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isSaved
                            ? "text-amber-500 hover:text-amber-600"
                            : "text-neutral-300 hover:text-neutral-500"
                        }`}
                        title={isSaved ? "Saved" : "Save Word"}
                      >
                        <Bookmark size={15} className={isSaved ? "fill-amber-500" : ""} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Preview Panel (Desktop) */}
          <div className="hidden sm:flex flex-col sm:w-1/2 p-6 bg-neutral-50/50 justify-between overflow-y-auto max-h-[480px]">
            {selectedWord ? (
              <div className="space-y-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-5xl font-hanzi font-bold text-neutral-900 tracking-wide">
                      {selectedWord.hanzi}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-mono text-lg font-bold text-red-600">
                        {selectedWord.pinyinDisplay}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handlePlayAudio(e, selectedWord.hanzi)}
                        className="p-1 rounded-md text-neutral-500 hover:text-red-600 transition-colors"
                      >
                        <Volume2 size={16} />
                      </button>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                    HSK {selectedWord.hskLevel}
                  </span>
                </div>

                {/* Bengali Nuance Box */}
                {bengaliService.getBengaliWordMeaning(selectedWord.hanzi) && (
                  <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/70 text-xs text-amber-900">
                    <span className="font-bold text-amber-950 block mb-0.5">
                      {isBn ? "বাংলা ভাবার্থ ও প্রয়োগ:" : "Bengali Contextual Sense:"}
                    </span>
                    <span className="text-amber-800 font-medium text-sm">
                      {bengaliService.getBengaliWordMeaning(selectedWord.hanzi)}
                    </span>
                  </div>
                )}

                {/* Official Definitions */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                    {isBn ? "সংজ্ঞা ও অর্থ" : "Definitions & POS"}
                  </span>
                  <div className="space-y-1.5">
                    {selectedWord.definitions.map((def, i) => (
                      <div key={i} className="text-xs text-neutral-800 flex items-start gap-2">
                        <span className="font-mono text-[10px] font-bold text-neutral-600 px-1.5 py-0.5 rounded bg-neutral-200 shrink-0">
                          {def.partOfSpeech?.join(", ") || "word"}
                        </span>
                        <span className="leading-relaxed">{def.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Syllable Breakdown */}
                {selectedWord.syllables && selectedWord.syllables.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                      Syllables & Tones
                    </span>
                    <div className="flex gap-2 flex-wrap">
                      {selectedWord.syllables.map((syl, i) => (
                        <div
                          key={i}
                          className="px-2.5 py-1 rounded-xl bg-white border border-neutral-200 text-xs font-mono flex items-center gap-1.5"
                        >
                          <span className="font-bold text-neutral-900">{syl.hanzi || syl.display}</span>
                          <span className="text-neutral-500">[{syl.display}]</span>
                          <span className="text-[10px] px-1 rounded bg-neutral-100 text-neutral-600 font-bold">
                            T{syl.tone}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Shortcuts */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenWord(selectedWord)}
                    className="flex-1 py-2 px-3.5 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>{isBn ? "সম্পূর্ণ বিস্তারিত পেজ দেখুন" : "View Full Mastery Page"}</span>
                    <ArrowRight size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate("/etymology");
                    }}
                    className="py-2 px-3 rounded-xl border border-neutral-200 bg-white text-neutral-700 font-bold text-xs hover:bg-neutral-100 transition-colors flex items-center gap-1 cursor-pointer"
                    title="Explore Etymology & Roots"
                  >
                    <GitFork size={13} />
                    <span>{isBn ? "মূল বৃক্ষ" : "Roots"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate(`/writing/${encodeURIComponent(selectedWord.hanzi[0])}`);
                    }}
                    className="py-2 px-3 rounded-xl border border-neutral-200 bg-white text-neutral-700 font-bold text-xs hover:bg-neutral-100 transition-colors flex items-center gap-1 cursor-pointer"
                    title="Practice Writing this character"
                  >
                    <Edit3 size={13} />
                    <span>{isBn ? "লিখুন" : "Write"}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-neutral-400">
                Select a word to view live definition preview
              </div>
            )}
          </div>
        </div>

        {/* Footer Hotkeys Navigation Guide */}
        <div className="p-3 sm:px-6 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500 font-medium">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-neutral-200 text-neutral-700 font-mono font-bold text-[10px]">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-neutral-200 text-neutral-700 font-mono font-bold text-[10px]">
                ↓
              </kbd>
              <span>to navigate</span>
            </span>

            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-neutral-200 text-neutral-700 font-mono font-bold text-[10px]">
                ↵
              </kbd>
              <span>to open</span>
            </span>

            <span className="hidden sm:flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-neutral-200 text-neutral-700 font-mono font-bold text-[10px]">
                ESC
              </kbd>
              <span>to dismiss</span>
            </span>
          </div>

          <div className="text-neutral-400">
            {searchResults.length} {searchResults.length === 1 ? "word" : "words"} found
          </div>
        </div>
      </div>
    </div>
  );
};
