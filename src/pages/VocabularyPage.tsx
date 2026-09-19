import React, { useState, useMemo } from "react";
import { ALL_HSK_LEVELS, vocabularyService } from "../services/vocabularyService";
import { progressService } from "../services/progressService";
import { VocabularyCard } from "../components/vocabulary/VocabularyCard";
import { HSKBadge } from "../components/common/HSKBadge";
import { Search, Filter, RotateCcw, LayoutGrid, List, SlidersHorizontal, Star, Tag } from "lucide-react";
import { HskLevel, Tone, WORD_CATEGORIES, getCategoryInfo } from "../types/hsk";

interface VocabularyPageProps {
  initialQuery?: string;
  initialLevel?: string;
  initialCategory?: string;
}

export const VocabularyPage: React.FC<VocabularyPageProps> = ({
  initialQuery = "",
  initialLevel,
  initialCategory,
}) => {
  // Extract initial category from prop or URL hash/search query
  const getInitialCat = () => {
    if (initialCategory) return initialCategory;
    try {
      const hashParams = new URLSearchParams(window.location.hash.split("?")[1] || "");
      const searchParams = new URLSearchParams(window.location.search);
      return hashParams.get("category") || searchParams.get("category") || "all";
    } catch {
      return "all";
    }
  };

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedLevel, setSelectedLevel] = useState<string>(initialLevel || "all");
  const [selectedPos, setSelectedPos] = useState<string>(getInitialCat());
  const [selectedTone, setSelectedTone] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 24;

  const allWords = vocabularyService.getAllWords();
  const progressMap = progressService.getProgressMap();
  const favorites = progressService.getFavoritesSet();

  // Words available at the selected HSK level (for category stats)
  const levelWords = useMemo(() => {
    if (selectedLevel === "all") return allWords;
    return allWords.filter((w) => w.hskLevel === selectedLevel);
  }, [allWords, selectedLevel]);

  // Category counts based on selected level
  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = {};
    levelWords.forEach((w) => {
      const seen = new Set<string>();
      w.definitions.forEach((d) => {
        d.partOfSpeech.forEach((p) => {
          const clean = p.toLowerCase().trim();
          seen.add(clean);
        });
      });
      seen.forEach((p) => {
        map[p] = (map[p] || 0) + 1;
      });
    });
    return map;
  }, [levelWords]);

  // Distinct categories from the dataset that have words in this level
  const activeCategories = useMemo(() => {
    return WORD_CATEGORIES.filter((cat) => (categoryCounts[cat.code.toLowerCase()] || 0) > 0);
  }, [categoryCounts]);

  // Filtering engine
  const filteredWords = useMemo(() => {
    return allWords.filter((w) => {
      // Level filter
      if (selectedLevel !== "all" && w.hskLevel !== selectedLevel) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesHanzi = w.hanzi.includes(q);
        const cleanPinyin = w.syllables.map((s) => s.base).join("");
        const matchesPinyin =
          cleanPinyin.toLowerCase().includes(q) ||
          w.pinyinDisplay.toLowerCase().includes(q);
        const matchesEnglish = w.definitions.some((d) =>
          d.text.toLowerCase().includes(q)
        );
        if (!matchesHanzi && !matchesPinyin && !matchesEnglish) {
          return false;
        }
      }

      // Part of speech / Category
      if (selectedPos !== "all") {
        const target = selectedPos.toLowerCase().trim();
        const matchesCat = w.definitions.some((d) =>
          d.partOfSpeech.some((p) => {
            const clean = p.toLowerCase().trim();
            return (
              clean === target ||
              clean.replace(".", "") === target.replace(".", "") ||
              clean.includes(target)
            );
          })
        );
        if (!matchesCat) {
          return false;
        }
      }

      // Tone filter
      if (selectedTone !== "all") {
        const toneNum = parseInt(selectedTone, 10);
        if (!w.syllables.some((s) => s.tone === (toneNum as Tone))) {
          return false;
        }
      }

      // Progress status
      if (selectedStatus !== "all") {
        const p = progressMap.get(w.id);
        const status = p?.status || "unseen";
        if (status !== selectedStatus) {
          return false;
        }
      }

      // Favorites
      if (onlyFavorites && !favorites.has(w.id)) {
        return false;
      }

      return true;
    });
  }, [
    allWords,
    searchQuery,
    selectedLevel,
    selectedPos,
    selectedTone,
    selectedStatus,
    onlyFavorites,
    progressMap,
    favorites,
  ]);

  const totalPages = Math.ceil(filteredWords.length / pageSize);
  const paginatedWords = filteredWords.slice((page - 1) * pageSize, page * pageSize);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedLevel("all");
    setSelectedPos("all");
    setSelectedTone("all");
    setSelectedStatus("all");
    setOnlyFavorites(false);
    setPage(1);
  };

  const selectedCatInfo = selectedPos !== "all" ? getCategoryInfo(selectedPos) : null;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title & Level Quick Select */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
              Vocabulary Archive
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200">
              {allWords.length.toLocaleString()} Words
            </span>
          </div>
          <p className="text-sm text-neutral-600">
            Official HSK 3.0 vocabulary classified by grammatical word category, tones, and definitions.
          </p>
        </div>

        {/* Level Quick Select */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => {
              setSelectedLevel("all");
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              selectedLevel === "all"
                ? "bg-neutral-900 text-white"
                : "bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
            }`}
          >
            All Levels
          </button>
          {ALL_HSK_LEVELS.map((lvl) => (
            <button
              key={lvl}
              onClick={() => {
                setSelectedLevel(lvl);
                setPage(1);
              }}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                selectedLevel === lvl
                  ? "bg-neutral-900 text-white"
                  : "bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
              }`}
            >
              HSK {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter Pills Ribbon */}
      <div className="p-3.5 bg-white border border-neutral-200 rounded-2xl shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between px-1 text-xs text-neutral-500 font-semibold">
          <span className="flex items-center gap-1.5 text-neutral-800">
            <Tag size={14} className="text-red-600" />
            BROWSE BY WORD CATEGORY (词类分类)
          </span>
          <span className="text-[11px] font-normal text-neutral-500">
            {selectedPos === "all" ? "Showing all categories" : `Filtered: ${selectedCatInfo?.name} (${selectedCatInfo?.chinese})`}
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => {
              setSelectedPos("all");
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedPos === "all"
                ? "bg-neutral-900 text-white shadow-xs"
                : "bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border border-neutral-200/80"
            }`}
          >
            <span>All Categories</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${selectedPos === "all" ? "bg-neutral-800 text-neutral-300" : "bg-neutral-200/70 text-neutral-600"}`}>
              {levelWords.length}
            </span>
          </button>

          {activeCategories.map((cat) => {
            const count = categoryCounts[cat.code.toLowerCase()] || 0;
            const isSelected = selectedPos === cat.code;
            return (
              <button
                key={cat.code}
                onClick={() => {
                  setSelectedPos(isSelected ? "all" : cat.code);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-red-600 text-white shadow-xs"
                    : "bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border border-neutral-200/80"
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-[11px] opacity-75 font-hanzi">· {cat.chinese}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isSelected ? "bg-red-700 text-red-100" : "bg-neutral-200/70 text-neutral-600"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Filter Controls Panel */}
      <div className="p-5 rounded-2xl border border-neutral-200 bg-white space-y-4 shadow-2xs">
        {/* Main Search Input */}
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search by Hanzi (e.g. 好, 学习), Pinyin (hǎo or hao), or English meaning (good, study)..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-neutral-50/80 border border-neutral-200 rounded-xl focus:bg-white focus:border-neutral-400 focus:outline-none transition-colors"
          />
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 text-xs">
          {/* HSK Level */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
              HSK Level
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => {
                setSelectedLevel(e.target.value);
                setPage(1);
              }}
              className="w-full py-2 px-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-medium text-neutral-800 focus:outline-none"
            >
              <option value="all">All Levels (1 to 7–9)</option>
              {ALL_HSK_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  HSK {lvl} ({vocabularyService.getWordsByLevel(lvl as HskLevel).length} words)
                </option>
              ))}
            </select>
          </div>

          {/* Word Category / Part of Speech */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
              Word Category (词类)
            </label>
            <select
              value={selectedPos}
              onChange={(e) => {
                setSelectedPos(e.target.value);
                setPage(1);
              }}
              className="w-full py-2 px-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-medium text-neutral-800 focus:outline-none"
            >
              <option value="all">All Categories ({levelWords.length})</option>
              {activeCategories.map((cat) => (
                <option key={cat.code} value={cat.code}>
                  {cat.name} · {cat.chinese} ({categoryCounts[cat.code.toLowerCase()] || 0})
                </option>
              ))}
            </select>
          </div>

          {/* Tone */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
              Tone Class
            </label>
            <select
              value={selectedTone}
              onChange={(e) => {
                setSelectedTone(e.target.value);
                setPage(1);
              }}
              className="w-full py-2 px-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-medium text-neutral-800 focus:outline-none"
            >
              <option value="all">All Tones</option>
              <option value="1">1st Tone (High Level)</option>
              <option value="2">2nd Tone (Rising)</option>
              <option value="3">3rd Tone (Dipping)</option>
              <option value="4">4th Tone (Falling)</option>
              <option value="0">Neutral Tone</option>
            </select>
          </div>

          {/* Progress Status */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
              Study Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPage(1);
              }}
              className="w-full py-2 px-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-medium text-neutral-800 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="unseen">New (Unseen)</option>
              <option value="learning">Learning</option>
              <option value="familiar">Familiar</option>
              <option value="mastered">Mastered</option>
            </select>
          </div>

          {/* Toggle Saved Only */}
          <div className="flex flex-col justify-end">
            <button
              type="button"
              onClick={() => {
                setOnlyFavorites(!onlyFavorites);
                setPage(1);
              }}
              className={`w-full py-2 px-3 rounded-lg border flex items-center justify-center gap-1.5 font-semibold text-xs transition-colors cursor-pointer ${
                onlyFavorites
                  ? "bg-amber-500 text-white border-amber-600"
                  : "bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              <Star size={13} fill={onlyFavorites ? "currentColor" : "none"} />
              <span>{onlyFavorites ? "Saved Words Only" : "Saved Only"}</span>
            </button>
          </div>
        </div>

        {/* Results Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs text-neutral-500">
          <div className="font-mono">
            Showing <strong className="text-neutral-900">{filteredWords.length.toLocaleString()}</strong> of{" "}
            <strong className="text-neutral-900">{allWords.length.toLocaleString()}</strong> total entries
            {selectedLevel !== "all" && <span className="ml-1 font-sans text-neutral-700">· HSK {selectedLevel}</span>}
            {selectedPos !== "all" && (
              <span className="ml-1 font-sans text-red-600 font-semibold">
                · Category: {selectedCatInfo?.name} ({selectedCatInfo?.chinese})
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleResetFilters}
            className="flex items-center gap-1 text-neutral-500 hover:text-neutral-900 cursor-pointer"
          >
            <RotateCcw size={12} />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Vocabulary Grid */}
      {paginatedWords.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-neutral-200 bg-white space-y-2">
          <p className="text-base font-semibold text-neutral-800">No words match your current filters.</p>
          <p className="text-xs text-neutral-500">Try adjusting your query or resetting filters.</p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-3 px-4 py-2 text-xs font-semibold rounded-lg bg-neutral-900 text-white hover:bg-neutral-800"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedWords.map((word) => (
            <VocabularyCard key={word.id} word={word} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-xs font-semibold rounded-lg border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-xs text-neutral-600 font-mono px-3">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 text-xs font-semibold rounded-lg border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
