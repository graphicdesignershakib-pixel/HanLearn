import { MistakeRecord, LearningSkill } from "../types/learning";
import { HskLevel } from "../types/hsk";

const STORAGE_KEY = "hanlearn_mistakes_v1";

class MistakeService {
  private mistakes: MistakeRecord[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.load();
  }

  private load() {
    if (typeof window === "undefined") return;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        this.mistakes = JSON.parse(data);
      } else {
        // Seed with a couple of instructional real mistakes so user sees value immediately
        this.mistakes = [
          {
            id: "m-init-1",
            sourceModule: "exam",
            skill: "grammar",
            hskLevel: "3",
            hanzi: "把",
            questionPrompt: "Select the sentence with correct 把 disposal structure",
            userAnswer: "我把那本书很喜欢",
            correctAnswer: "请把门关上",
            explanation: "Verbs of psychological state or emotion (喜欢, 觉得) cannot be used in 把 constructions.",
            timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
            errorCount: 1,
            isResolved: false,
          },
          {
            id: "m-init-2",
            sourceModule: "sentence",
            skill: "listening",
            hskLevel: "1",
            hanzi: "苹果",
            pinyin: "píngguǒ",
            questionPrompt: "Listen and identify the requested fruit",
            userAnswer: "香蕉 (xiāngjiāo)",
            correctAnswer: "苹果 (píngguǒ)",
            explanation: "Remember 2nd tone rising (píng) + 3rd tone dipping (guǒ).",
            timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
            errorCount: 2,
            isResolved: false,
          },
        ];
        this.save();
      }
    } catch (e) {
      console.warn("Failed to load mistakes", e);
    }
  }

  private save() {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.mistakes));
    } catch (e) {
      console.warn("Failed to save mistakes", e);
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

  public getAllMistakes(): MistakeRecord[] {
    return [...this.mistakes];
  }

  public getUnresolvedMistakes(): MistakeRecord[] {
    return this.mistakes.filter((m) => !m.isResolved);
  }

  public addMistake(entry: Omit<MistakeRecord, "id" | "timestamp" | "errorCount" | "isResolved">): MistakeRecord {
    // If exact question exists and unresolved, increment error count
    const existing = this.mistakes.find(
      (m) => m.questionPrompt === entry.questionPrompt && !m.isResolved
    );

    if (existing) {
      existing.errorCount += 1;
      existing.userAnswer = entry.userAnswer;
      existing.timestamp = new Date().toISOString();
      this.save();
      return existing;
    }

    const newRecord: MistakeRecord = {
      ...entry,
      id: `mistake-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      errorCount: 1,
      isResolved: false,
    };

    this.mistakes.unshift(newRecord);
    this.save();
    return newRecord;
  }

  public resolveMistake(id: string): void {
    const item = this.mistakes.find((m) => m.id === id);
    if (item) {
      item.isResolved = true;
      this.save();
    }
  }

  public unresolveMistake(id: string): void {
    const item = this.mistakes.find((m) => m.id === id);
    if (item) {
      item.isResolved = false;
      this.save();
    }
  }

  public deleteMistake(id: string): void {
    this.mistakes = this.mistakes.filter((m) => m.id !== id);
    this.save();
  }

  public getMistakeStats(): {
    total: number;
    unresolved: number;
    bySkill: Record<LearningSkill, number>;
    byLevel: Record<HskLevel, number>;
  } {
    const bySkill: Record<LearningSkill, number> = {
      vocabulary: 0,
      pinyin: 0,
      tone: 0,
      grammar: 0,
      listening: 0,
      reading: 0,
      writing: 0,
      speaking: 0,
      mock_exam: 0,
    };

    const byLevel: Record<HskLevel, number> = {
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7-9": 0,
    };

    let unresolved = 0;

    this.mistakes.forEach((m) => {
      if (!m.isResolved) {
        unresolved++;
        if (bySkill[m.skill] !== undefined) bySkill[m.skill]++;
        if (byLevel[m.hskLevel] !== undefined) byLevel[m.hskLevel]++;
      }
    });

    return {
      total: this.mistakes.length,
      unresolved,
      bySkill,
      byLevel,
    };
  }
}

export const mistakeService = new MistakeService();
