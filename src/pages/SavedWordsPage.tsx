import React, { useState, useMemo, useEffect } from "react";
import { progressService } from "../services/progressService";
import { vocabularyService } from "../services/vocabularyService";
import { VocabularyCard } from "../components/vocabulary/VocabularyCard";
import { EmptyState } from "../components/common/EmptyState";
import { navigate } from "../services/routerService";
import { Star, Search, ArrowRight } from "lucide-react";

export const SavedWordsPage: React.FC = () => {
  const [favoritesSet, setFavoritesSet] = useState(() => progressService.getFavoritesSet());
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const unsub = progressService.subscribe(() => {
      setFavoritesSet(progressService.getFavoritesSet());
    });
    return unsub;
  }, []);

  const savedWords = useMemo(() => {
    const all = vocabularyService.getAllWords();
    return all.filter((w) => favoritesSet.has(w.id));
  }, [favoritesSet]);

  const filteredWords = useMemo(() => {
    if (!searchQuery.trim()) return savedWords;
    const q = searchQuery.toLowerCase().trim();
    return savedWords.filter(
      (w) =>
        w.hanzi.includes(q) ||
        w.pinyinDisplay.toLowerCase().includes(q) ||
        w.definitions.some((d) => d.text.toLowerCase().includes(q))
    );
  }, [savedWords, searchQuery]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 flex items-center gap-2">
          <Star size={26} className="text-amber-500 fill-amber-500" />
          <span>Saved Vocabulary</span>
        </h1>
        <p className="text-sm text-neutral-600">
          Your personal deck of bookmarked words for priority repetition and review.
        </p>
      </div>

      {savedWords.length === 0 ? (
        <EmptyState
          title="No Words Saved Yet"
          description="Click the star icon on any vocabulary card or word detail page to add it to your personal favorites collection."
          actionLabel="Browse Vocabulary"
          onAction={() => navigate("/vocabulary")}
          icon={<Star size={24} className="text-amber-500" />}
        />
      ) : (
        <>
          {/* Search bar */}
          <div className="relative max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your saved words..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-400"
            />
          </div>

          <div className="text-xs text-neutral-500 font-mono">
            {filteredWords.length} saved {filteredWords.length === 1 ? "word" : "words"}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWords.map((word) => (
              <VocabularyCard key={word.id} word={word} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
