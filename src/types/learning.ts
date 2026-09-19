import { HskLevel } from "./hsk";

export type LearningSkill =
  | "vocabulary"
  | "pinyin"
  | "tone"
  | "grammar"
  | "listening"
  | "reading"
  | "writing"
  | "speaking"
  | "mock_exam";

export interface MistakeRecord {
  id: string;
  sourceModule: "exam" | "minitest" | "sentence" | "dictation" | "listening" | "flashcard" | "grammar";
  skill: LearningSkill;
  hskLevel: HskLevel;
  hanzi?: string;
  pinyin?: string;
  questionPrompt: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  timestamp: string;
  errorCount: number;
  isResolved: boolean;
  notes?: string;
}

export interface DailyMissionTask {
  id: string;
  title: string;
  bengaliTitle?: string;
  description: string;
  skill: LearningSkill;
  targetCount: number;
  currentCount: number;
  xpReward: number;
  completed: boolean;
  linkPath: string;
}

export type DailyTask = DailyMissionTask;

export interface DailyMissionState {
  date: string;
  tasks: DailyMissionTask[];
  totalXpEarned: number;
  streakDays: number;
  allCompleted: boolean;
}

export interface StudyPlanConfig {
  targetLevel: HskLevel;
  targetDate: string; // ISO date
  startDate: string;
  totalDays: number;
  dailyGoalWords: number;
  dailyGoalMinutes: number;
  status: "active" | "completed" | "paused";
  completedDays: number;
  milestones: {
    title: string;
    dayNumber: number;
    completed: boolean;
    description: string;
  }[];
}

export type StudyPlan = StudyPlanConfig;

export interface UserNote {
  id: string;
  title: string;
  content: string;
  tags: string[];
  hskLevel?: HskLevel;
  relatedWordId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WeakAreaMetric {
  skill: LearningSkill;
  score: number; // 0 - 100
  totalAttempts: number;
  recommendedPracticePath: string;
  diagnosticAdvice: string;
}
