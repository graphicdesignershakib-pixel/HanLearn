import { HskLevel, MasteryStatus, UserWordProgress } from "./hsk";

export type WordProgress = UserWordProgress;
export type ReviewRating = "again" | "hard" | "good" | "easy";

export interface StudyStats {
  totalWordsLearned: number;
  totalWordsFamiliar: number;
  totalWordsMastered: number;
  streakDays: number;
  lastStudyDate: string;
  reviewsDueCount: number;
  totalTimeSpentMs: number;
  charactersWrittenCount: number;
  levelProgress: Record<HskLevel, {
    total: number;
    learned: number;
    mastered: number;
  }>;
}

export interface ReviewState {
  wordId: string;
  status: MasteryStatus;
  reviewCount: number;
  lastReviewedAt: string;
  nextReviewAt: string;
  confidence: number;
}

export interface ReviewScheduler {
  recordResult(wordId: string, correct: boolean): ReviewState;
}

export interface UserPreferences {
  audioRate: number; // 0.75, 1.0, 1.25
  autoPlayAudio: boolean;
  showPinyinByDefault: boolean;
  showEnglishByDefault: boolean;
  writingGridType: "tian-zi-ge" | "mi-zi-ge" | "plain";
  dailyGoalWords: number;
}
