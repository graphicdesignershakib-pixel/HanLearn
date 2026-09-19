import { HskLevel } from "../../types/hsk";
import {
  ExamAttempt,
  ExamMode,
  ExamSkill,
  HskMockExamPaper,
  UserAnswerRecord,
  ExamHistorySummary,
  MockExamType,
} from "../../types/exam";
import { OFFICIAL_HSK_CONFIGS } from "../../data/exam/examConfigs";
import { gamificationService } from "../gamificationService";

const STORAGE_KEY_ACTIVE_ATTEMPT = "hanlearn_active_exam_attempt_v1";
const STORAGE_KEY_EXAM_HISTORY = "hanlearn_exam_history_v1";

export class ExamSessionService {
  private activeAttempt: ExamAttempt | null = null;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.restoreActiveAttempt();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  private restoreActiveAttempt() {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ACTIVE_ATTEMPT);
      if (stored) {
        const parsed: ExamAttempt = JSON.parse(stored);
        if (!parsed.isComplete) {
          this.activeAttempt = parsed;
        }
      }
    } catch (e) {
      console.warn("Failed to restore active exam attempt", e);
    }
  }

  private saveActiveAttempt() {
    if (typeof window === "undefined" || !this.activeAttempt) return;
    try {
      localStorage.setItem(
        STORAGE_KEY_ACTIVE_ATTEMPT,
        JSON.stringify(this.activeAttempt)
      );
    } catch (e) {
      console.warn("Failed to save active exam attempt", e);
    }
  }

  public getActiveAttempt(): ExamAttempt | null {
    return this.activeAttempt;
  }

  public startAttempt(paper: HskMockExamPaper, mode: ExamMode): ExamAttempt {
    const attemptId = `att_${paper.hskLevel}_${Date.now()}`;
    const initialAnswers: Record<string, UserAnswerRecord> = {};

    const attempt: ExamAttempt = {
      id: attemptId,
      userId: "local_learner",
      examId: paper.id,
      paperCode: paper.paperCode,
      level: paper.hskLevel,
      mode,
      examType: paper.examType,
      startedAt: new Date().toISOString(),
      durationSeconds: paper.durationMinutes * 60,
      timeRemainingSeconds: paper.durationMinutes * 60,
      answers: initialAnswers,
      flaggedQuestionIds: [],
      visitedQuestionIds: paper.questions.length > 0 ? [paper.questions[0].id] : [],
      currentQuestionIndex: 0,
      currentSection: paper.questions[0]?.section || "listening",
      maxScore: paper.maxScore,
      passingScore: paper.passingScore,
      isComplete: false,
    };

    this.activeAttempt = attempt;
    this.saveActiveAttempt();
    this.notify();
    return attempt;
  }

  public recordAnswer(
    questionId: string,
    userResponse: string,
    extra?: { audioBlobUrl?: string; audioDurationSeconds?: number; timeSpentSeconds?: number }
  ): void {
    if (!this.activeAttempt || this.activeAttempt.isComplete) return;

    const existing = this.activeAttempt.answers[questionId] || {
      questionId,
      userResponse: "",
    };

    this.activeAttempt.answers[questionId] = {
      ...existing,
      questionId,
      userResponse,
      audioBlobUrl: extra?.audioBlobUrl ?? existing.audioBlobUrl,
      audioDurationSeconds: extra?.audioDurationSeconds ?? existing.audioDurationSeconds,
      timeSpentSeconds: (existing.timeSpentSeconds || 0) + (extra?.timeSpentSeconds || 1),
    };

    if (!this.activeAttempt.visitedQuestionIds.includes(questionId)) {
      this.activeAttempt.visitedQuestionIds.push(questionId);
    }

    this.saveActiveAttempt();
    this.notify();
  }

  public toggleFlag(questionId: string): boolean {
    if (!this.activeAttempt) return false;

    const isFlagged = this.activeAttempt.flaggedQuestionIds.includes(questionId);
    if (isFlagged) {
      this.activeAttempt.flaggedQuestionIds = this.activeAttempt.flaggedQuestionIds.filter(
        (id) => id !== questionId
      );
    } else {
      this.activeAttempt.flaggedQuestionIds.push(questionId);
    }

    this.saveActiveAttempt();
    this.notify();
    return !isFlagged;
  }

  public setCurrentIndex(index: number, section: ExamSkill): void {
    if (!this.activeAttempt) return;
    this.activeAttempt.currentQuestionIndex = index;
    this.activeAttempt.currentSection = section;
    this.saveActiveAttempt();
    this.notify();
  }

  public updateTimeRemaining(seconds: number): void {
    if (!this.activeAttempt || this.activeAttempt.isComplete) return;
    this.activeAttempt.timeRemainingSeconds = Math.max(0, seconds);
    this.saveActiveAttempt();
  }

  /**
   * Finalizes exam attempt, executes official scoring algorithms,
   * detects skill gaps, records in history, and triggers gamification rewards.
   */
  public submitAttempt(paper: HskMockExamPaper): ExamAttempt {
    if (!this.activeAttempt) {
      throw new Error("No active exam attempt to submit");
    }

    const attempt = this.activeAttempt;
    attempt.completedAt = new Date().toISOString();
    attempt.isComplete = true;

    const config = OFFICIAL_HSK_CONFIGS[paper.hskLevel];
    const sectionScores: Record<ExamSkill, { earned: number; total: number; percentage: number }> = {
      listening: { earned: 0, total: 0, percentage: 0 },
      reading: { earned: 0, total: 0, percentage: 0 },
      writing: { earned: 0, total: 0, percentage: 0 },
      translation: { earned: 0, total: 0, percentage: 0 },
      speaking: { earned: 0, total: 0, percentage: 0 },
    };

    const skillBreakdown: Record<ExamSkill, { correct: number; total: number; percentage: number }> = {
      listening: { correct: 0, total: 0, percentage: 0 },
      reading: { correct: 0, total: 0, percentage: 0 },
      writing: { correct: 0, total: 0, percentage: 0 },
      translation: { correct: 0, total: 0, percentage: 0 },
      speaking: { correct: 0, total: 0, percentage: 0 },
    };

    const weakVocabularyIds: string[] = [];
    let totalPointsEarned = 0;
    let totalPointsPossible = 0;

    paper.questions.forEach((q) => {
      const userAnswer = attempt.answers[q.id]?.userResponse?.trim() || "";
      const isAnswered = userAnswer.length > 0;
      let isCorrect = false;

      if (q.type === "writing_sentence_order") {
        // Normalizes whitespace & Chinese punctuation
        const cleanUser = userAnswer.replace(/[\s，。！？]/g, "");
        const cleanCorrect = q.correctAnswer.replace(/[\s，。！？]/g, "");
        isCorrect = cleanUser === cleanCorrect;
      } else if (q.type === "writing_composition" || q.type === "translation_written" || q.type === "speaking_perspective") {
        // Subjective: award points proportionally for non-empty thoughtful response
        isCorrect = userAnswer.length >= (q.minWordCount || 10);
      } else {
        // MCQ / true_false
        isCorrect = userAnswer.toUpperCase() === q.correctAnswer.toUpperCase();
      }

      const pointsEarned = isCorrect ? q.points : 0;
      totalPointsEarned += pointsEarned;
      totalPointsPossible += q.points;

      // Update answer record
      if (attempt.answers[q.id]) {
        attempt.answers[q.id].isCorrect = isCorrect;
        attempt.answers[q.id].scoreEarned = pointsEarned;
      } else {
        attempt.answers[q.id] = {
          questionId: q.id,
          userResponse: "",
          isCorrect: false,
          scoreEarned: 0,
        };
      }

      // Track section scores
      sectionScores[q.skill].earned += pointsEarned;
      sectionScores[q.skill].total += q.points;
      skillBreakdown[q.skill].total += 1;
      if (isCorrect) {
        skillBreakdown[q.skill].correct += 1;
      } else if (q.vocabularyIds) {
        weakVocabularyIds.push(...q.vocabularyIds);
      }
    });

    // Compute percentages
    (Object.keys(sectionScores) as ExamSkill[]).forEach((skill) => {
      const s = sectionScores[skill];
      s.percentage = s.total > 0 ? Math.round((s.earned / s.total) * 100) : 0;

      const b = skillBreakdown[skill];
      b.percentage = b.total > 0 ? Math.round((b.correct / b.total) * 100) : 0;
    });

    // Scale to official maximum (200 for HSK 1-2, 300 for HSK 3-6, 500 for HSK 7-9)
    const scaledScore = totalPointsPossible > 0
      ? Math.round((totalPointsEarned / totalPointsPossible) * paper.maxScore)
      : 0;

    attempt.rawScore = totalPointsEarned;
    attempt.totalScore = scaledScore;
    attempt.percentage = Math.round((scaledScore / paper.maxScore) * 100);
    attempt.passed = scaledScore >= paper.passingScore;
    attempt.sectionScores = sectionScores;
    attempt.skillBreakdown = skillBreakdown;
    attempt.weakVocabularyIds = Array.from(new Set(weakVocabularyIds));

    // Determine weakest and strongest skill
    const activeSkills = (Object.keys(skillBreakdown) as ExamSkill[]).filter(
      (s) => skillBreakdown[s].total > 0
    );
    activeSkills.sort((a, b) => skillBreakdown[a].percentage - skillBreakdown[b].percentage);
    attempt.weakestSkill = activeSkills[0];
    attempt.strongestSkill = activeSkills[activeSkills.length - 1];

    // Estimated HSK 7-9 Band
    if (paper.isAdvanced) {
      if (scaledScore >= 420) attempt.estimatedHskBand = "HSK 9 (Native/Mastery)";
      else if (scaledScore >= 360) attempt.estimatedHskBand = "HSK 8 (Professional)";
      else if (scaledScore >= 300) attempt.estimatedHskBand = "HSK 7 (Academic/Fluent)";
      else attempt.estimatedHskBand = "Preliminary Advanced (Below HSK 7 threshold)";
    }

    // Award XP and badges
    if (attempt.passed) {
      gamificationService.unlockBadge("exam_conqueror");
      gamificationService.addXp(200, `Passed HSK ${paper.hskLevel} Mock Exam`);
    } else {
      gamificationService.addXp(60, `Completed HSK ${paper.hskLevel} Mock Attempt`);
    }

    // Save to history & clear active
    this.saveToHistory(attempt);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY_ACTIVE_ATTEMPT);
    }
    this.activeAttempt = null;
    this.notify();
    return attempt;
  }

  public exitActiveAttempt(): void {
    this.activeAttempt = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY_ACTIVE_ATTEMPT);
    }
    this.notify();
  }

  private saveToHistory(attempt: ExamAttempt) {
    if (typeof window === "undefined") return;
    try {
      const history = this.getAllHistory();
      history.unshift(attempt);
      // Keep last 100 attempts
      localStorage.setItem(
        STORAGE_KEY_EXAM_HISTORY,
        JSON.stringify(history.slice(0, 100))
      );
    } catch (e) {
      console.warn("Failed to record exam attempt in history", e);
    }
  }

  public getAllHistory(): ExamAttempt[] {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY_EXAM_HISTORY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Failed to load exam history", e);
    }
    return [];
  }

  public getHistorySummary(level?: HskLevel): ExamHistorySummary {
    const all = this.getAllHistory();
    const filtered = level ? all.filter((a) => a.level === level) : all;

    if (filtered.length === 0) {
      return {
        totalAttempts: 0,
        bestScore: 0,
        averageScore: 0,
        latestScore: 0,
        passRate: 0,
        attempts: [],
      };
    }

    const scores = filtered.map((a) => a.totalScore || 0);
    const passedCount = filtered.filter((a) => a.passed).length;

    return {
      totalAttempts: filtered.length,
      bestScore: Math.max(...scores),
      averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      latestScore: scores[0] || 0,
      passRate: Math.round((passedCount / filtered.length) * 100),
      attempts: filtered,
    };
  }
}

export const examSessionService = new ExamSessionService();
