import { HskLevel, MasteryStatus, UserWordProgress } from "../types/hsk";
import { StudyStats, UserPreferences } from "../types/progress";
import { reviewScheduler } from "./reviewScheduler";
import { ALL_HSK_LEVELS, vocabularyService } from "./vocabularyService";

const STORAGE_KEY_PROGRESS = "hanlearn_word_progress_v1";
const STORAGE_KEY_FAVORITES = "hanlearn_favorites_v1";
const STORAGE_KEY_STATS = "hanlearn_study_stats_v1";
const STORAGE_KEY_PREFS = "hanlearn_user_prefs_v1";

export class ProgressService {
  private progressMap = new Map<string, UserWordProgress>();
  private favoritesSet = new Set<string>();
  private listeners: Set<() => void> = new Set();
  private stats: StudyStats = {
    totalWordsLearned: 0,
    totalWordsFamiliar: 0,
    totalWordsMastered: 0,
    streakDays: 1,
    lastStudyDate: new Date().toISOString().slice(0, 10),
    reviewsDueCount: 0,
    totalTimeSpentMs: 120000,
    charactersWrittenCount: 8,
    levelProgress: {
      "1": { total: 0, learned: 0, mastered: 0 },
      "2": { total: 0, learned: 0, mastered: 0 },
      "3": { total: 0, learned: 0, mastered: 0 },
      "4": { total: 0, learned: 0, mastered: 0 },
      "5": { total: 0, learned: 0, mastered: 0 },
      "6": { total: 0, learned: 0, mastered: 0 },
      "7-9": { total: 0, learned: 0, mastered: 0 },
    },
  };

  private preferences: UserPreferences = {
    audioRate: 1.0,
    autoPlayAudio: true,
    showPinyinByDefault: true,
    showEnglishByDefault: true,
    writingGridType: "tian-zi-ge",
    dailyGoalWords: 10,
  };

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window === "undefined") return;

    try {
      const savedProg = localStorage.getItem(STORAGE_KEY_PROGRESS);
      if (savedProg) {
        const arr: UserWordProgress[] = JSON.parse(savedProg);
        arr.forEach((item) => this.progressMap.set(item.vocabularyId, item));
      }

      const savedFavs = localStorage.getItem(STORAGE_KEY_FAVORITES);
      if (savedFavs) {
        const arr: string[] = JSON.parse(savedFavs);
        arr.forEach((id) => this.favoritesSet.add(id));
      }

      const savedPrefs = localStorage.getItem(STORAGE_KEY_PREFS);
      if (savedPrefs) {
        this.preferences = { ...this.preferences, ...JSON.parse(savedPrefs) };
      }

      const savedStats = localStorage.getItem(STORAGE_KEY_STATS);
      if (savedStats) {
        this.stats = { ...this.stats, ...JSON.parse(savedStats) };
      }

      this.recalculateStats();
    } catch (e) {
      console.warn("Could not load stored user progress", e);
    }
  }

  private saveToStorage() {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(
        STORAGE_KEY_PROGRESS,
        JSON.stringify(Array.from(this.progressMap.values()))
      );
      localStorage.setItem(
        STORAGE_KEY_FAVORITES,
        JSON.stringify(Array.from(this.favoritesSet))
      );
      localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(this.stats));
      localStorage.setItem(STORAGE_KEY_PREFS, JSON.stringify(this.preferences));
    } catch (e) {
      console.warn("Could not save progress", e);
    }

    this.notifyListeners();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach((l) => l());
  }

  public getProgress(wordId: string): UserWordProgress | undefined {
    return this.progressMap.get(wordId);
  }

  public getProgressMap(): Map<string, UserWordProgress> {
    return this.progressMap;
  }

  public isFavorite(wordId: string): boolean {
    return this.favoritesSet.has(wordId);
  }

  public getFavoritesSet(): Set<string> {
    return this.favoritesSet;
  }

  public toggleFavorite(wordId: string): boolean {
    let nowFav: boolean;
    if (this.favoritesSet.has(wordId)) {
      this.favoritesSet.delete(wordId);
      nowFav = false;
    } else {
      this.favoritesSet.add(wordId);
      nowFav = true;
    }

    const current = this.progressMap.get(wordId);
    if (current) {
      current.favorite = nowFav;
    } else {
      this.progressMap.set(wordId, {
        vocabularyId: wordId,
        status: "unseen",
        favorite: nowFav,
        reviewCount: 0,
      });
    }

    this.saveToStorage();
    return nowFav;
  }

  public setWordStatus(wordId: string, status: MasteryStatus): void {
    const current = this.progressMap.get(wordId) || {
      vocabularyId: wordId,
      status: "unseen",
      favorite: this.favoritesSet.has(wordId),
      reviewCount: 0,
    };

    current.status = status;
    current.lastReviewedAt = new Date().toISOString();
    if (!current.confidence) {
      current.confidence = status === "mastered" ? 95 : status === "familiar" ? 70 : 40;
    }

    this.progressMap.set(wordId, current);
    this.recalculateStats();
    this.saveToStorage();
  }

  public updateWordStatus(wordId: string, status: MasteryStatus): void {
    this.setWordStatus(wordId, status);
  }

  public recordStudySession(session: { timeSpentMs?: number; charactersWritten?: number }): void {
    if (session.timeSpentMs) {
      this.stats.totalTimeSpentMs = (this.stats.totalTimeSpentMs || 0) + session.timeSpentMs;
    }
    if (session.charactersWritten) {
      this.stats.charactersWrittenCount = (this.stats.charactersWrittenCount || 0) + session.charactersWritten;
    }
    this.updateStreak();
    this.saveToStorage();
  }

  public recordPracticeResult(wordId: string, correct: boolean): void {
    const current = this.progressMap.get(wordId);
    const result = reviewScheduler.recordResult(wordId, correct, current);

    const updated: UserWordProgress = {
      vocabularyId: wordId,
      status: result.status,
      favorite: this.favoritesSet.has(wordId),
      reviewCount: result.reviewCount,
      lastReviewedAt: result.lastReviewedAt,
      nextReviewAt: result.nextReviewAt,
      confidence: result.confidence,
    };

    this.progressMap.set(wordId, updated);
    this.updateStreak();
    this.recalculateStats();
    this.saveToStorage();
  }

  public recordReview(wordId: string, rating: "again" | "hard" | "good" | "easy"): void {
    const isSuccess = rating !== "again";
    this.recordPracticeResult(wordId, isSuccess);

    const current = this.progressMap.get(wordId);
    if (current) {
      if (rating === "again") {
        current.status = "learning";
        current.confidence = Math.max(10, (current.confidence || 40) - 25);
      } else if (rating === "hard") {
        current.status = "learning";
        current.confidence = Math.min(65, (current.confidence || 40) + 5);
      } else if (rating === "good") {
        current.status = "familiar";
        current.confidence = Math.min(85, (current.confidence || 50) + 15);
      } else if (rating === "easy") {
        current.status = "mastered";
        current.confidence = Math.min(99, (current.confidence || 60) + 25);
      }
      this.progressMap.set(wordId, current);
      this.recalculateStats();
      this.saveToStorage();
    }
  }

  private updateStreak() {
    const today = new Date().toISOString().slice(0, 10);
    if (this.stats.lastStudyDate !== today) {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      if (this.stats.lastStudyDate === yesterday) {
        this.stats.streakDays += 1;
      } else if (!this.stats.lastStudyDate) {
        this.stats.streakDays = 1;
      } else {
        this.stats.streakDays = 1;
      }
      this.stats.lastStudyDate = today;
    }
  }

  public recalculateStats(): void {
    let learned = 0;
    let familiar = 0;
    let mastered = 0;
    let due = 0;
    const now = new Date().toISOString();

    const levelCounts: Record<HskLevel, { total: number; learned: number; mastered: number }> = {
      "1": { total: 0, learned: 0, mastered: 0 },
      "2": { total: 0, learned: 0, mastered: 0 },
      "3": { total: 0, learned: 0, mastered: 0 },
      "4": { total: 0, learned: 0, mastered: 0 },
      "5": { total: 0, learned: 0, mastered: 0 },
      "6": { total: 0, learned: 0, mastered: 0 },
      "7-9": { total: 0, learned: 0, mastered: 0 },
    };

    // Tally words by level
    ALL_HSK_LEVELS.forEach((level) => {
      const words = vocabularyService.getWordsByLevel(level);
      levelCounts[level].total = words.length;

      words.forEach((w) => {
        const p = this.progressMap.get(w.id);
        if (p) {
          if (p.status === "learning") {
            levelCounts[level].learned += 1;
            learned += 1;
          } else if (p.status === "familiar") {
            levelCounts[level].learned += 1;
            familiar += 1;
          } else if (p.status === "mastered") {
            levelCounts[level].mastered += 1;
            mastered += 1;
          }

          if (p.nextReviewAt && p.nextReviewAt <= now) {
            due += 1;
          }
        }
      });
    });

    this.stats.totalWordsLearned = learned + familiar;
    this.stats.totalWordsFamiliar = familiar;
    this.stats.totalWordsMastered = mastered;
    this.stats.reviewsDueCount = due;
    this.stats.levelProgress = levelCounts;
  }

  public getStats(): StudyStats {
    return this.stats;
  }

  public getPreferences(): UserPreferences {
    return this.preferences;
  }

  public updatePreferences(partial: Partial<UserPreferences>): void {
    this.preferences = { ...this.preferences, ...partial };
    this.saveToStorage();
  }

  public resetAllProgress(): void {
    this.progressMap.clear();
    this.favoritesSet.clear();
    this.stats.totalWordsLearned = 0;
    this.stats.totalWordsFamiliar = 0;
    this.stats.totalWordsMastered = 0;
    this.stats.reviewsDueCount = 0;
    this.stats.streakDays = 1;
    this.recalculateStats();
    this.saveToStorage();
  }
}

export const progressService = new ProgressService();
