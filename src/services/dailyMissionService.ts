import { DailyMissionState, DailyMissionTask, StudyPlanConfig } from "../types/learning";
import { HskLevel } from "../types/hsk";
import { gamificationService } from "./gamificationService";

const STORAGE_KEY_MISSION = "hanlearn_daily_mission_v1";
const STORAGE_KEY_PLAN = "hanlearn_study_plan_v1";

const DEFAULT_TASKS_TEMPLATE: Omit<DailyMissionTask, "currentCount" | "completed">[] = [
  {
    id: "task-vocab",
    title: "Learn 5 New HSK Words",
    bengaliTitle: "৫টি নতুন HSK শব্দ শিখুন",
    description: "Expand your vocabulary base with meaning, pinyin, and stroke orders.",
    skill: "vocabulary",
    targetCount: 5,
    xpReward: 30,
    linkPath: "/vocabulary",
  },
  {
    id: "task-srs",
    title: "Complete 10 Flashcard Reviews",
    bengaliTitle: "১০টি ফ্ল্যাশকার্ড অনুশীলন সম্পন্ন করুন",
    description: "Strengthen active memory retention with SM-2 spaced repetition.",
    skill: "vocabulary",
    targetCount: 10,
    xpReward: 25,
    linkPath: "/flashcards",
  },
  {
    id: "task-hanzi",
    title: "Write 3 Hanzi Characters",
    bengaliTitle: "৩টি হানজি ক্যারেক্টার লিখুন",
    description: "Follow accurate stroke order and radical structure in Writing Lab.",
    skill: "writing",
    targetCount: 3,
    xpReward: 25,
    linkPath: "/writing",
  },
  {
    id: "task-tone",
    title: "Master 5 Tone Discrimination Drills",
    bengaliTitle: "৫টি টোন অনুশীলন সম্পন্ন করুন",
    description: "Sharpen pitch contour recognition across 1st-4th tones.",
    skill: "tone",
    targetCount: 5,
    xpReward: 20,
    linkPath: "/practice/tones",
  },
  {
    id: "task-quiz",
    title: "Score 80%+ on a Mini Test",
    bengaliTitle: "একটি মিনি টেস্টে ৮০%+ স্কোর করুন",
    description: "Test comprehensive skills in vocabulary, listening, or grammar.",
    skill: "mock_exam",
    targetCount: 1,
    xpReward: 40,
    linkPath: "/minitests",
  },
];

class DailyMissionService {
  private missionState: DailyMissionState;
  private studyPlan: StudyPlanConfig;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.missionState = this.loadMission();
    this.studyPlan = this.loadPlan();
  }

  private getTodayString(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private loadMission(): DailyMissionState {
    const today = this.getTodayString();
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_MISSION);
        if (saved) {
          const parsed: DailyMissionState = JSON.parse(saved);
          if (parsed.date === today) {
            return parsed;
          }
        }
      } catch (e) {
        console.warn("Error loading daily mission", e);
      }
    }

    return {
      date: today,
      tasks: DEFAULT_TASKS_TEMPLATE.map((t) => ({
        ...t,
        currentCount: 0,
        completed: false,
      })),
      totalXpEarned: 0,
      streakDays: 3,
      allCompleted: false,
    };
  }

  private loadPlan(): StudyPlanConfig {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_PLAN);
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (e) {
        console.warn("Error loading study plan", e);
      }
    }

    const today = new Date();
    const targetDate = new Date();
    targetDate.setDate(today.getDate() + 60);

    return {
      targetLevel: "3",
      targetDate: targetDate.toISOString().slice(0, 10),
      startDate: today.toISOString().slice(0, 10),
      totalDays: 60,
      dailyGoalWords: 15,
      dailyGoalMinutes: 30,
      status: "active",
      completedDays: 12,
      milestones: [
        {
          title: "Foundation Phase: 150 Core Words",
          dayNumber: 15,
          completed: true,
          description: "Master high-frequency verbs, pronouns, and measure words.",
        },
        {
          title: "Grammar & Sentence Core: 把 & 被 Structures",
          dayNumber: 30,
          completed: false,
          description: "Synthesize sentences with complex aspect markers and complements.",
        },
        {
          title: "Listening & Reading Acceleration",
          dayNumber: 45,
          completed: false,
          description: "Complete 10 graded readers and 5 simulated listening sections.",
        },
        {
          title: "Official HSK 3.0 Full Mock Exam Simulation",
          dayNumber: 60,
          completed: false,
          description: "Achieve 240+ / 300 on standard timed exam.",
        },
      ],
    };
  }

  private save() {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY_MISSION, JSON.stringify(this.missionState));
      localStorage.setItem(STORAGE_KEY_PLAN, JSON.stringify(this.studyPlan));
    } catch (e) {
      console.warn("Error saving daily mission state", e);
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  public getMissionState(): DailyMissionState {
    const today = this.getTodayString();
    if (this.missionState.date !== today) {
      this.missionState = this.loadMission();
    }
    return this.missionState;
  }

  public getTodayMission(): DailyMissionState {
    return this.getMissionState();
  }

  public claimMissionBonus(): void {
    if (this.missionState.allCompleted) {
      gamificationService.addXp(50);
      this.notify();
    }
  }

  public getStudyPlan(): StudyPlanConfig {
    return this.studyPlan;
  }

  public setStudyPlan(plan: StudyPlanConfig): void {
    this.studyPlan = plan;
    this.save();
  }

  public recordTaskProgress(taskId: string, increment: number = 1): void {
    const task = this.missionState.tasks.find((t) => t.id === taskId);
    if (!task || task.completed) return;

    task.currentCount = Math.min(task.targetCount, task.currentCount + increment);

    if (task.currentCount >= task.targetCount && !task.completed) {
      task.completed = true;
      this.missionState.totalXpEarned += task.xpReward;
      gamificationService.addXp(task.xpReward);
    }

    const allDone = this.missionState.tasks.every((t) => t.completed);
    if (allDone && !this.missionState.allCompleted) {
      this.missionState.allCompleted = true;
      this.missionState.streakDays += 1;
      this.missionState.totalXpEarned += 50; // Bonus completion XP
      gamificationService.addXp(50);
    }

    this.save();
  }

  public updateStudyPlan(updates: Partial<StudyPlanConfig>): void {
    this.studyPlan = { ...this.studyPlan, ...updates };
    this.save();
  }

  public toggleMilestone(index: number): void {
    if (this.studyPlan.milestones[index]) {
      this.studyPlan.milestones[index].completed = !this.studyPlan.milestones[index].completed;
      this.save();
    }
  }
}

export const dailyMissionService = new DailyMissionService();
