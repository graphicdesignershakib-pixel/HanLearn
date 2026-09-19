import { ChineseCharacter, ExampleSentence, HskLevel, VocabularyWord, WordCategoryInfo, WORD_CATEGORIES, getCategoryInfo } from "../types/hsk";
import { removePinyinTones } from "../lib/pinyinUtils";

import hsk1Data from "../data/hsk/hsk1.json";
import hsk2Data from "../data/hsk/hsk2.json";
import hsk3Data from "../data/hsk/hsk3.json";
import hsk4Data from "../data/hsk/hsk4.json";
import hsk5Data from "../data/hsk/hsk5.json";
import hsk6Data from "../data/hsk/hsk6.json";
import hsk79Data from "../data/hsk/hsk7-9.json";
import charactersData from "../data/characters.json";
import sentencesData from "../data/sentences.json";

// Combined canonical vocabulary map
const LEVEL_DATA_MAP: Record<HskLevel, VocabularyWord[]> = {
  "1": hsk1Data as VocabularyWord[],
  "2": hsk2Data as VocabularyWord[],
  "3": hsk3Data as VocabularyWord[],
  "4": hsk4Data as VocabularyWord[],
  "5": hsk5Data as VocabularyWord[],
  "6": hsk6Data as VocabularyWord[],
  "7-9": hsk79Data as VocabularyWord[],
};

// Official HSK 3.0 PDF vocabulary counts
export const HSK_OFFICIAL_TARGET_COUNTS: Record<HskLevel, number> = {
  "1": 300,
  "2": 200,
  "3": 500,
  "4": 1000,
  "5": 1600,
  "6": 1800,
  "7-9": 5600,
};

// Characters cache
const charactersMap = new Map<string, ChineseCharacter>();
(charactersData as ChineseCharacter[]).forEach((char) => {
  charactersMap.set(char.id, char);
  charactersMap.set(char.hanzi, char);
});

// Sentences cache
const sentencesMap = new Map<string, ExampleSentence>();
(sentencesData as ExampleSentence[]).forEach((s) => {
  sentencesMap.set(s.id, s);
});

export const ALL_HSK_LEVELS: HskLevel[] = ["1", "2", "3", "4", "5", "6", "7-9"];

export interface FilterOptions {
  hskLevel?: HskLevel | "all";
  query?: string;
  category?: string;
  partOfSpeech?: string;
  hasAlternateReadings?: boolean;
  isIdiomOrPhrase?: boolean;
  learnedStatus?: "all" | "unseen" | "learning" | "familiar" | "mastered";
  onlyFavorites?: boolean;
  onlyDueForReview?: boolean;
}

export type SortOption = "sourceOrder" | "pinyin" | "hanzi" | "level";

export class VocabularyService {
  private wordsCache: VocabularyWord[] = [];
  private wordByIdMap = new Map<string, VocabularyWord>();

  constructor() {
    this.reloadWords();
  }

  private reloadWords() {
    this.wordsCache = [
      ...LEVEL_DATA_MAP["1"],
      ...LEVEL_DATA_MAP["2"],
      ...LEVEL_DATA_MAP["3"],
      ...LEVEL_DATA_MAP["4"],
      ...LEVEL_DATA_MAP["5"],
      ...LEVEL_DATA_MAP["6"],
      ...LEVEL_DATA_MAP["7-9"],
    ];

    this.wordByIdMap.clear();
    this.wordsCache.forEach((word) => {
      this.wordByIdMap.set(word.id, word);
    });
  }

  public getAllWords(): VocabularyWord[] {
    return this.wordsCache;
  }

  public getWordsByLevel(level: HskLevel): VocabularyWord[] {
    return LEVEL_DATA_MAP[level] || [];
  }

  public getWordById(id: string): VocabularyWord | undefined {
    return this.wordByIdMap.get(id);
  }

  public getAdjacentWords(currentId: string): { prev?: VocabularyWord; next?: VocabularyWord } {
    const index = this.wordsCache.findIndex((w) => w.id === currentId);
    if (index === -1) return {};
    return {
      prev: index > 0 ? this.wordsCache[index - 1] : undefined,
      next: index < this.wordsCache.length - 1 ? this.wordsCache[index + 1] : undefined,
    };
  }

  public getCharacter(idOrHanzi: string): ChineseCharacter | undefined {
    return charactersMap.get(idOrHanzi);
  }

  public getCharactersForWord(word: VocabularyWord): ChineseCharacter[] {
    if (!word) return [];
    const chars: ChineseCharacter[] = [];
    for (const ch of word.hanzi) {
      const existing = this.getCharacter(ch);
      if (existing) {
        chars.push(existing);
      } else {
        chars.push({
          id: `char-${ch}`,
          hanzi: ch,
          pinyin: word.syllables.map((s) => s.display),
          strokeCount: 6,
          radical: "—",
          meaning: word.definitions[0]?.text || "",
        });
      }
    }
    return chars;
  }

  public getSentence(id: string): ExampleSentence | undefined {
    return sentencesMap.get(id);
  }

  public getSentenceById(id: string): ExampleSentence | undefined {
    return this.getSentence(id);
  }

  public getSentencesForWord(wordId: string): ExampleSentence[] {
    const word = this.getWordById(wordId);
    if (!word || !word.exampleSentenceIds) return [];
    return word.exampleSentenceIds
      .map((sid) => this.getSentence(sid))
      .filter((s): s is ExampleSentence => !!s);
  }

  /**
   * Get list of all supported word categories
   */
  public getAllCategories(): WordCategoryInfo[] {
    return WORD_CATEGORIES;
  }

  /**
   * Get category distribution (counts of words in each category) optionally filtered by level
   */
  public getCategoryDistribution(level?: HskLevel): { category: WordCategoryInfo; count: number }[] {
    const words = level ? this.getWordsByLevel(level) : this.wordsCache;
    const countMap = new Map<string, number>();

    words.forEach((w) => {
      const posSet = new Set<string>();
      w.definitions.forEach((d) => {
        d.partOfSpeech.forEach((p) => posSet.add(p.toLowerCase().trim()));
      });
      posSet.forEach((pos) => {
        countMap.set(pos, (countMap.get(pos) || 0) + 1);
      });
    });

    return WORD_CATEGORIES.map((cat) => {
      const count = countMap.get(cat.code.toLowerCase()) || 0;
      return { category: cat, count };
    }).filter((item) => item.count > 0);
  }

  /**
   * Get words matching a specific category code
   */
  public getWordsByCategory(categoryCode: string, level?: HskLevel): VocabularyWord[] {
    const words = level ? this.getWordsByLevel(level) : this.wordsCache;
    const target = categoryCode.toLowerCase().trim();
    return words.filter((w) =>
      w.definitions.some((d) =>
        d.partOfSpeech.some((p) => {
          const cleanP = p.toLowerCase().trim();
          return cleanP === target || cleanP.replace(".", "") === target.replace(".", "");
        })
      )
    );
  }

  /**
   * High-quality search matching Hanzi, Pinyin (accented & tone-free), and English meanings
   */
  public searchAndFilter(
    filters: FilterOptions,
    sortBy: SortOption = "sourceOrder",
    favoritesSet?: Set<string>,
    progressMap?: Map<string, { status: string; nextReviewAt?: string }>
  ): VocabularyWord[] {
    let results = this.wordsCache;

    // Filter by HSK Level
    if (filters.hskLevel && filters.hskLevel !== "all") {
      results = results.filter((w) => w.hskLevel === filters.hskLevel);
    }

    // Filter by Text Query
    if (filters.query && filters.query.trim()) {
      const q = filters.query.trim().toLowerCase();
      const cleanQ = removePinyinTones(q);

      results = results.filter((w) => {
        // 1. Hanzi direct or partial match
        if (w.hanzi.includes(filters.query!.trim())) return true;

        // 2. Accented Pinyin match
        if (w.pinyinDisplay.toLowerCase().includes(q)) return true;

        // 3. Accent-free Pinyin match (e.g. "hao" matches "hǎo")
        const cleanPinyin = removePinyinTones(w.pinyinDisplay);
        if (cleanPinyin.includes(cleanQ)) return true;

        // 4. Alternate readings match
        if (w.alternateReadings) {
          for (const alt of w.alternateReadings) {
            if (alt.pinyinDisplay.toLowerCase().includes(q)) return true;
            if (removePinyinTones(alt.pinyinDisplay).includes(cleanQ)) return true;
          }
        }

        // 5. English definitions match
        const hasDefMatch = w.definitions.some((d) => d.text.toLowerCase().includes(q));
        if (hasDefMatch) return true;

        return false;
      });
    }

    // Filter by Part of Speech or Category
    const categoryToFilter = filters.category || filters.partOfSpeech;
    if (categoryToFilter && categoryToFilter !== "all") {
      const pos = categoryToFilter.toLowerCase().trim();
      results = results.filter((w) =>
        w.definitions.some((d) =>
          d.partOfSpeech.some((p) => {
            const clean = p.toLowerCase().trim();
            return clean === pos || clean.replace(".", "") === pos.replace(".", "") || clean.includes(pos);
          })
        )
      );
    }

    // Filter by Alternate Readings
    if (filters.hasAlternateReadings) {
      results = results.filter((w) => !!w.alternateReadings && w.alternateReadings.length > 0);
    }

    // Filter by Idiom or Phrase
    if (filters.isIdiomOrPhrase) {
      results = results.filter((w) => w.isIdiom || w.isPhrase);
    }

    // Filter by Favorites
    if (filters.onlyFavorites && favoritesSet) {
      results = results.filter((w) => favoritesSet.has(w.id));
    }

    // Filter by Mastery Status
    if (filters.learnedStatus && filters.learnedStatus !== "all" && progressMap) {
      results = results.filter((w) => {
        const prog = progressMap.get(w.id);
        const status = prog?.status || "unseen";
        return status === filters.learnedStatus;
      });
    }

    // Filter by Review Due
    if (filters.onlyDueForReview && progressMap) {
      const now = new Date().toISOString();
      results = results.filter((w) => {
        const prog = progressMap.get(w.id);
        return prog && prog.nextReviewAt && prog.nextReviewAt <= now;
      });
    }

    // Sorting
    results = [...results].sort((a, b) => {
      switch (sortBy) {
        case "pinyin":
          return a.pinyinDisplay.localeCompare(b.pinyinDisplay);
        case "hanzi":
          return a.hanzi.localeCompare(b.hanzi, "zh-Hans-CN");
        case "level":
          return a.hskLevel.localeCompare(b.hskLevel);
        case "sourceOrder":
        default:
          if (a.hskLevel !== b.hskLevel) {
            return a.hskLevel.localeCompare(b.hskLevel);
          }
          return a.sourceOrder - b.sourceOrder;
      }
    });

    return results;
  }
}

export const vocabularyService = new VocabularyService();
