import { HskLevel } from "../../types/hsk";
import {
  ExamQuestion,
  HskMockExamPaper,
  MockExamType,
  QuestionStatus,
  QuestionSource,
  ExamSkill,
} from "../../types/exam";
import { OFFICIAL_HSK_CONFIGS } from "../../data/exam/examConfigs";
import { questionGenerator } from "./questionGeneratorService";

const STORAGE_KEY_CUSTOM_PAPERS = "hanlearn_exam_papers_v1";
const STORAGE_KEY_CUSTOM_QUESTIONS = "hanlearn_exam_questions_v1";

export class QuestionBankService {
  private papersCache: HskMockExamPaper[] = [];
  private questionsCache: Map<string, ExamQuestion> = new Map();

  constructor() {
    this.initializeDefaultPapers();
  }

  private initializeDefaultPapers() {
    // Generate standard baseline official papers for all levels HSK 1 - 7-9
    const levels: HskLevel[] = ["1", "2", "3", "4", "5", "6", "7-9"];
    const basePapers: HskMockExamPaper[] = [];

    levels.forEach((level) => {
      const config = OFFICIAL_HSK_CONFIGS[level];

      // Build Mock 01 (and Mock 02 for beginner levels)
      const mock01 = this.buildFullOfficialPaper(level, 1);
      basePapers.push(mock01);

      if (level === "1" || level === "2" || level === "3") {
        const mock02 = this.buildFullOfficialPaper(level, 2);
        basePapers.push(mock02);
      }
    });

    // Load any user-created or admin-customized papers from local storage
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_CUSTOM_PAPERS);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            parsed.forEach((p) => basePapers.push(p));
          }
        }
      } catch (e) {
        console.warn("Failed to load custom exam papers from storage", e);
      }
    }

    this.papersCache = basePapers;
    this.papersCache.forEach((paper) => {
      paper.questions.forEach((q) => this.questionsCache.set(q.id, q));
    });
  }

  /**
   * Constructs an authentic, official HSK 3.0 paper according to the exact question counts
   */
  public buildFullOfficialPaper(level: HskLevel, paperNumber: number = 1): HskMockExamPaper {
    const config = OFFICIAL_HSK_CONFIGS[level];
    const questions: ExamQuestion[] = [];
    let qNumber = 1;

    // Build questions for each section according to exact official specifications
    config.sections.forEach((sec, secIdx) => {
      const skill = sec.skill;
      const count = sec.questionCount;

      for (let i = 1; i <= count; i++) {
        let q: ExamQuestion;

        if (skill === "listening") {
          q = questionGenerator.generateListeningQuestion(
            level,
            qNumber,
            Math.min(sec.partsCount, Math.ceil((i / count) * sec.partsCount))
          );
        } else if (skill === "reading") {
          q = questionGenerator.generateReadingQuestion(
            level,
            qNumber,
            Math.min(sec.partsCount, Math.ceil((i / count) * sec.partsCount))
          );
        } else if (skill === "writing") {
          q = questionGenerator.generateWritingQuestion(
            level,
            qNumber,
            Math.min(sec.partsCount, Math.ceil((i / count) * sec.partsCount))
          );
        } else if (skill === "translation") {
          q = questionGenerator.generateTranslationQuestion(
            qNumber,
            Math.min(sec.partsCount, Math.ceil((i / count) * sec.partsCount))
          );
        } else {
          // speaking
          q = questionGenerator.generateSpeakingQuestion(
            qNumber,
            Math.min(sec.partsCount, Math.ceil((i / count) * sec.partsCount))
          );
        }

        q.questionNumber = qNumber;
        questions.push(q);
        qNumber++;
      }
    });

    const isAdv = level === "7-9";
    const paperCode = isAdv
      ? `HSK79-ADV-MOCK-${paperNumber.toString().padStart(2, "0")}`
      : `HSK${level}-MOCK-${paperNumber.toString().padStart(2, "0")}`;

    const titleZh = isAdv
      ? `HSK (七-九级) 全真模拟试卷 (卷${paperNumber === 1 ? "一" : "二"})`
      : `HSK ${level}级全真模拟考试 (卷${paperNumber === 1 ? "一" : "二"})`;

    const titleEn = isAdv
      ? `HSK 7-9 Advanced Full Mock Exam (Paper ${paperNumber === 1 ? "A" : "B"})`
      : `HSK Level ${level} Official Mock Exam (Paper ${paperNumber === 1 ? "A" : "B"})`;

    const titleBn = isAdv
      ? `HSK ৭-৯ উচ্চতর পূর্ণাঙ্গ মক টেস্ট (পেপার ${paperNumber === 1 ? "১" : "২"})`
      : `HSK লেভেল ${level} অফিসিয়াল মক টেস্ট (পেপার ${paperNumber === 1 ? "১" : "২"})`;

    return {
      id: `${paperCode.toLowerCase()}`,
      paperCode,
      hskLevel: level,
      titleZh,
      titleEn,
      titleBn,
      examType: "full_mock",
      durationMinutes: config.durationMinutes,
      maxScore: config.maxScore,
      passingScore: config.passingScore,
      questions,
      isAdvanced: isAdv,
      status: "published",
      createdAt: new Date().toISOString(),
      version: "3.0-Trial",
    };
  }

  /**
   * Generates a focused skill practice paper (Listening only, Reading only, Writing only, etc.)
   */
  public generatePracticePaper(
    level: HskLevel,
    examType: MockExamType,
    limit: number = 20
  ): HskMockExamPaper {
    const fullPaper = this.getPapersByLevel(level)[0] || this.buildFullOfficialPaper(level, 1);
    let filteredQuestions: ExamQuestion[] = [];

    if (examType === "listening_practice") {
      filteredQuestions = fullPaper.questions.filter((q) => q.skill === "listening");
    } else if (examType === "reading_practice") {
      filteredQuestions = fullPaper.questions.filter((q) => q.skill === "reading");
    } else if (examType === "writing_practice") {
      filteredQuestions = fullPaper.questions.filter((q) => q.skill === "writing");
    } else if (examType === "speaking_practice") {
      filteredQuestions = fullPaper.questions.filter((q) => q.skill === "speaking");
    } else if (examType === "translation_practice") {
      filteredQuestions = fullPaper.questions.filter((q) => q.skill === "translation");
    } else {
      filteredQuestions = fullPaper.questions.slice(0, limit);
    }

    if (filteredQuestions.length === 0) {
      filteredQuestions = fullPaper.questions.slice(0, limit);
    }

    const duration = Math.max(10, Math.round(filteredQuestions.length * 1.5));
    const titleSkill = examType.replace("_practice", "").toUpperCase();

    return {
      id: `practice_${level}_${examType}_${Date.now()}`,
      paperCode: `PRAC-${level}-${titleSkill}`,
      hskLevel: level,
      titleZh: `HSK ${level}级专项练习 (${titleSkill})`,
      titleEn: `HSK Level ${level} Drill: ${titleSkill}`,
      titleBn: `HSK লেভেল ${level} ড্রিল: ${titleSkill}`,
      examType,
      durationMinutes: duration,
      maxScore: filteredQuestions.reduce((acc, q) => acc + q.points, 0),
      passingScore: Math.round(filteredQuestions.reduce((acc, q) => acc + q.points, 0) * 0.6),
      questions: filteredQuestions.map((q, idx) => ({ ...q, questionNumber: idx + 1 })),
      status: "published",
      createdAt: new Date().toISOString(),
      version: "3.0-Practice",
    };
  }

  public getAllPapers(): HskMockExamPaper[] {
    return this.papersCache;
  }

  public getPapersByLevel(level: HskLevel): HskMockExamPaper[] {
    return this.papersCache.filter((p) => p.hskLevel === level);
  }

  public getPaperById(id: string): HskMockExamPaper | undefined {
    return this.papersCache.find((p) => p.id === id);
  }

  public getQuestionById(id: string): ExamQuestion | undefined {
    return this.questionsCache.get(id);
  }

  // Admin capabilities
  public addCustomQuestion(question: ExamQuestion): void {
    this.questionsCache.set(question.id, question);
    this.persistCustomData();
  }

  public updateQuestion(id: string, updates: Partial<ExamQuestion>): void {
    const existing = this.questionsCache.get(id);
    if (!existing) return;
    const updated = { ...existing, ...updates };
    this.questionsCache.set(id, updated);

    // Also update within papers
    this.papersCache.forEach((paper) => {
      const idx = paper.questions.findIndex((q) => q.id === id);
      if (idx !== -1) {
        paper.questions[idx] = updated;
      }
    });

    this.persistCustomData();
  }

  public deleteQuestion(id: string): void {
    this.questionsCache.delete(id);
    this.papersCache.forEach((paper) => {
      paper.questions = paper.questions.filter((q) => q.id !== id);
    });
    this.persistCustomData();
  }

  public getAiReviewQueue(): ExamQuestion[] {
    return Array.from(this.questionsCache.values()).filter(
      (q) => q.source === "AI generated" && q.status === "draft"
    );
  }

  private persistCustomData() {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(
        STORAGE_KEY_CUSTOM_PAPERS,
        JSON.stringify(this.papersCache.filter((p) => p.id.startsWith("custom_")))
      );
    } catch (e) {
      console.warn("Failed to persist custom exam data", e);
    }
  }
}

export const questionBankService = new QuestionBankService();
