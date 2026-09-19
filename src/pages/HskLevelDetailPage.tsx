import React, { useState, useMemo } from "react";
import { ALL_HSK_LEVELS, HSK_OFFICIAL_TARGET_COUNTS, vocabularyService } from "../services/vocabularyService";
import { progressService } from "../services/progressService";
import { navigate } from "../services/routerService";
import { HSKBadge } from "../components/common/HSKBadge";
import { VocabularyCard } from "../components/vocabulary/VocabularyCard";
import { Search, ArrowLeft, BookOpen, Filter, ArrowUpDown } from "lucide-react";
import { HskLevel } from "../types/hsk";

interface HskLevelDetailPageProps {
  level: string;
}

export const HskLevelDetailPage: React.FC<HskLevelDetailPageProps> = ({ level }) => {
  const hskLevel = (ALL_HSK_LEVELS.includes(level as HskLevel) ? level : "1") as HskLevel;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPos, setSelectedPos] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"id" | "hanzi" | "pinyin">("id");
  const [page, setPage] = useState(1);
  const pageSize = 24;

  const allLevelWords = useMemo(() => {
    return vocabularyService.getWordsByLevel(hskLevel);
  }, [hskLevel]);

  // Extract all parts of speech in this level
  const posList = useMemo(() => {
    const set = new Set<string>();
    allLevelWords.forEach((w) => {
      w.definitions.forEach((d) => {
        d.partOfSpeech.forEach((p) => set.add(p));
      });
    });
    return Array.from(set).sort();
  }, [allLevelWords]);

  // Filtered & Sorted words
  const filteredWords = useMemo(() => {
    let result = allLevelWords;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (w) =>
          w.hanzi.includes(q) ||
          w.pinyinClean.toLowerCase().includes(q) ||
          w.definitions.some((d) => d.text.toLowerCase().includes(q))
      );
    }

    if (selectedPos !== "all") {
      result = result.filter((w) =>
        w.definitions.some((d) => d.partOfSpeech.includes(selectedPos))
      );
    }

    if (sortOrder === "hanzi") {
      result = [...result].sort((a, b) => a.hanzi.localeCompare(b.hanzi));
    } else if (sortOrder === "pinyin") {
      result = [...result].sort((a, b) => a.pinyinClean.localeCompare(b.pinyinClean));
    }

    return result;
  }, [allLevelWords, searchQuery, selectedPos, sortOrder]);

  const totalPages = Math.ceil(filteredWords.length / pageSize);
  const paginatedWords = filteredWords.slice((page - 1) * pageSize, page * pageSize);

  const stats = progressService.getStats();
  const levelStats = stats.levelProgress[hskLevel];
  const targetCount = HSK_OFFICIAL_TARGET_COUNTS[hskLevel];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Navigation Breadcrumb */}
      <button
        type="button"
        onClick={() => navigate("/hsk")}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
      >
        <ArrowLeft size={14} />
        <span>Back to HSK Levels</span>
      </button>

      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-2xl border border-neutral-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <HSKBadge level={hskLevel} size="lg" />
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">
              HSK Level {hskLevel} Vocabulary
            </h1>
          </div>
          <p className="text-sm text-neutral-600">
            {hskLevel === "7-9"
              ? `Combined advanced dataset with ${targetCount} target entries from official HSK 3.0 curriculum.`
              : `Standard HSK ${hskLevel} vocabulary set containing ${targetCount} target entries.`}
          </p>
          <div className="text-xs text-neutral-600 font-mono pt-1">
            Status: {levelStats?.learned || 0} words learned · {levelStats?.mastered || 0} mastered
          </div>
        </div>

        {allLevelWords.length > 0 && (
          <button
            type="button"
            onClick={() => navigate(`/vocabulary/${allLevelWords[0].id}`)}
            className="px-5 py-3 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            <BookOpen size={16} />
            <span>Study First Word</span>
          </button>
        )}
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-xl border border-neutral-200 bg-white flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder={`Search within HSK ${hskLevel}...`}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:bg-white focus:border-neutral-400"
          />
        </div>

        {/* Part of Speech Filter */}
        <div className="flex items-center gap-1.5 text-xs">
          <Filter size={14} className="text-neutral-400" />
          <select
            value={selectedPos}
            onChange={(e) => {
              setSelectedPos(e.target.value);
              setPage(1);
            }}
            className="py-1.5 px-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-medium text-neutral-700 focus:outline-none"
          >
            <option value="all">All Parts of Speech</option>
            {posList.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Order */}
        <div className="flex items-center gap-1.5 text-xs">
          <ArrowUpDown size={14} className="text-neutral-400" />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="py-1.5 px-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-medium text-neutral-700 focus:outline-none"
          >
            <option value="id">Official Index Order</option>
            <option value="hanzi">Chinese Character</option>
            <option value="pinyin">Pinyin A-Z</option>
          </select>
        </div>

        <div className="text-xs text-neutral-600 font-mono">
          {filteredWords.length} words found
        </div>
      </div>

      {/* Vocabulary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedWords.map((word) => (
          <VocabularyCard key={word.id} word={word} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-xs text-neutral-600 font-mono px-2">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
