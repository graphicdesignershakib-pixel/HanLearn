import { MasteryStatus } from "../types/hsk";
import { ReviewScheduler, ReviewState } from "../types/progress";

export class SimpleSrsReviewScheduler implements ReviewScheduler {
  public recordResult(
    wordId: string,
    correct: boolean,
    currentProgress?: {
      status: MasteryStatus;
      reviewCount: number;
      confidence?: number;
    }
  ): ReviewState {
    return this.recordReview(wordId, correct ? "good" : "again", currentProgress);
  }

  public recordReview(
    wordId: string,
    rating: "again" | "hard" | "good" | "easy",
    currentProgress?: {
      status: MasteryStatus;
      reviewCount: number;
      confidence?: number;
    }
  ): ReviewState {
    const now = new Date();
    const reviewCount = (currentProgress?.reviewCount || 0) + 1;
    let confidence = currentProgress?.confidence ?? 50;
    let status: MasteryStatus = currentProgress?.status || "learning";

    let intervalHours: number;

    switch (rating) {
      case "again":
        confidence = Math.max(10, confidence - 20);
        status = "learning";
        intervalHours = 4;
        break;
      case "hard":
        confidence = Math.min(100, Math.max(20, confidence + 5));
        status = "learning";
        intervalHours = 12;
        break;
      case "good":
        confidence = Math.min(100, confidence + 15);
        if (confidence >= 80 && reviewCount >= 3) {
          status = "familiar";
          intervalHours = 24 * 4;
        } else {
          status = "learning";
          intervalHours = 24;
        }
        break;
      case "easy":
        confidence = Math.min(100, confidence + 25);
        if (reviewCount >= 2) {
          status = "mastered";
          intervalHours = 24 * 10;
        } else {
          status = "familiar";
          intervalHours = 24 * 4;
        }
        break;
    }

    const nextReview = new Date(now.getTime() + intervalHours * 60 * 60 * 1000);

    return {
      wordId,
      status,
      reviewCount,
      lastReviewedAt: now.toISOString(),
      nextReviewAt: nextReview.toISOString(),
      confidence,
    };
  }
}

export const reviewScheduler = new SimpleSrsReviewScheduler();
