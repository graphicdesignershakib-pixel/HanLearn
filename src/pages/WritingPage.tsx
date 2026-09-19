import React, { useState, useMemo } from "react";
import { ALL_HSK_LEVELS, vocabularyService } from "../services/vocabularyService";
import { CharacterCard } from "../components/vocabulary/CharacterCard";
import { InteractiveHandwritingCanvas } from "../components/stroke/InteractiveHandwritingCanvas";
import { navigate } from "../services/routerService";
import { Search, Edit3, Grid, ArrowRight, Sparkles, PenTool } from "lucide-react";
import { HskLevel } from "../types/hsk";

export const WritingPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<HskLevel>("1");
  const [activePracticeChar, setActivePracticeChar] = useState<string>("好");

  // Get all characters from selected level
  const characters = useMemo(() => {
    const words = vocabularyService.getWordsByLevel(selectedLevel);
    const charMap = new Map<string, any>();

    words.forEach((w) => {
      const chars = vocabularyService.getCharactersForWord(w);
      chars.forEach((c) => {
        if (!charMap.has(c.hanzi)) {
          charMap.set(c.hanzi, c);
        }
      });
    });

    let list = Array.from(charMap.values());

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.hanzi.includes(q) ||
          c.pinyin?.some((p: string) => p.toLowerCase().includes(q)) ||
          c.meaning?.toLowerCase().includes(q) ||
          c.radical?.includes(q)
      );
    }

    return list;
  }, [selectedLevel, searchQuery]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 flex items-center gap-2.5">
          <Edit3 size={28} className="text-red-600" />
          <span>Hanzi Writing & Stroke Order Lab</span>
        </h1>
        <p className="text-sm text-neutral-600 max-w-2xl leading-relaxed">
          Explore stroke order animations, component radicals, and practice handwriting directly on traditional Tian-Zi-Ge calligraphy grids.
        </p>
      </div>

      {/* Quick Launch & Live Interactive Handwriting Studio */}
      <div className="p-6 md:p-8 rounded-3xl border border-neutral-200 bg-white shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-700 uppercase tracking-wider">
                Live Studio
              </span>
              <h2 className="text-lg md:text-xl font-bold text-neutral-900">
                Interactive Handwriting & Stroke Quiz
              </h2>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Select any character below to test stroke direction and sequencing with real-time feedback.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-neutral-500 font-medium">Quick Pick:</span>
            {["好", "你", "我", "人", "大", "中", "学"].map((char) => (
              <button
                key={char}
                type="button"
                onClick={() => setActivePracticeChar(char)}
                className={`w-9 h-9 rounded-xl font-hanzi text-base font-bold transition-all cursor-pointer ${
                  activePracticeChar === char
                    ? "bg-red-600 text-white shadow-xs scale-105"
                    : "bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
                }`}
              >
                {char}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-6 flex flex-col items-center">
          <InteractiveHandwritingCanvas
            key={activePracticeChar}
            character={activePracticeChar}
            size={300}
            showDetails={true}
          />
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-xl border border-neutral-200 bg-white flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Hanzi character, Pinyin, or radical..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:bg-white focus:border-neutral-400"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-neutral-500 font-medium">HSK Level:</span>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value as HskLevel)}
            className="py-1.5 px-3 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-semibold text-neutral-800 focus:outline-none"
          >
            {ALL_HSK_LEVELS.map((lvl) => (
              <option key={lvl} value={lvl}>
                HSK {lvl}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-neutral-600 font-mono">
          {characters.length} characters in HSK {selectedLevel}
        </div>
      </div>

      {/* Characters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {characters.map((char) => (
          <CharacterCard key={char.hanzi} character={char} />
        ))}
      </div>
    </div>
  );
};
