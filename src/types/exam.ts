import { HskLevel, VocabularyWord } from "./hsk";

export type ExamSkill = "listening" | "reading" | "writing" | "translation" | "speaking";

export type ExamQuestionType =
  | "listening_mcq"
  | "listening_true_false"
  | "listening_dialogue"
  | "reading_mcq"
  | "reading_fill_blank"
  | "reading_sentence_matching"
  | "reading_passage_comprehension"
  | "writing_sentence_order"
  | "writing_character_fill"
  | "writing_composition"
  | "translation_written"
  | "translation_oral"
  | "speaking_read_aloud"
  | "speaking_qa"
  | "speaking_perspective";

export type MockExamType =
  | "full_mock"
  | "listening_practice"
  | "reading_practice"
  | "writing_practice"
  | "speaking_practice"
  | "translation_practice"
  | "section_practice"
  | "timed_practice"
  | "weak_area_practice";

export type ExamMode = "exam" | "practice";

export type QuestionStatus = "draft" | "reviewed" | "published" | "archived";

export type QuestionSource =
  | "official sample inspired"
  | "teacher authored"
  | "AI generated"
  | "admin authored";

export interface QuestionOption {
  key: string;
  textZh: string;
  textPinyin?: string;
  textEn?: string;
  textBn?: string;
  imageEmoji?: string;
}

export interface ExamQuestion {
  id: string;
  examId?: string;
  level: HskLevel;
  section: ExamSkill;
  sectionPart: number; // e.g. Section 1, Section 2
  questionNumber: number;
  type: ExamQuestionType;
  skill: ExamSkill;
  difficulty: 1 | 2 | 3 | 4 | 5;
  promptZh: string;
  promptPinyin?: string;
  promptEn?: string;
  promptBn?: string;
  audioScript?: string;
  audioDurationSeconds?: number;
  passageZh?: string;
  passagePinyin?: string;
  passageEn?: string;
  passageBn?: string;
  imageEmoji?: string;
  options?: QuestionOption[];
  correctAnswer: string; // Option key ("A") or expected sentence / character / text
  explanationZh: string;
  explanationEn: string;
  explanationBn: string;
  // Writing specific
  unscrambleTokens?: string[];
  targetCharacter?: string;
  minWordCount?: number;
  maxWordCount?: number;
  // Speaking / Translation specific
  speakingPrompt?: string;
  translationSourceText?: string;
  translationTargetLanguage?: string;
  referenceAnswer?: string;
  evaluationCriteria?: string[];
  // Metadata & relations
  vocabularyIds?: string[];
  grammarTags?: string[];
  timeLimitSeconds?: number;
  points: number;
  source: QuestionSource;
  status: QuestionStatus;
}

export interface ExamSectionConfig {
  skill: ExamSkill;
  titleZh: string;
  titleEn: string;
  titleBn: string;
  partsCount: number;
  questionCount: number;
  allocatedMinutes: number;
  maxScore: number;
  instructionsZh: string;
  instructionsEn: string;
  instructionsBn: string;
}

export interface OfficialHskLevelConfig {
  level: HskLevel;
  titleZh: string;
  titleEn: string;
  titleBn: string;
  totalQuestions: number;
  durationMinutes: number;
  maxScore: number;
  passingScore: number;
  sections: ExamSectionConfig[];
  descriptionEn: string;
  descriptionBn: string;
  hasWriting: boolean;
  hasSpeaking: boolean;
  hasTranslation: boolean;
  vocabularyTargetCount: number;
}

export interface HskMockExamPaper {
  id: string;
  paperCode: string; // e.g. "HSK1-MOCK-01"
  hskLevel: HskLevel;
  titleZh: string;
  titleEn: string;
  titleBn: string;
  examType: MockExamType;
  durationMinutes: number;
  maxScore: number;
  passingScore: number;
  questions: ExamQuestion[];
  isAdvanced?: boolean; // HSK 7-9
  status: QuestionStatus;
  createdAt: string;
  version: string;
}

export interface UserAnswerRecord {
  questionId: string;
  userResponse: string; // Selected key, written text, or recorded audio URL
  isCorrect?: boolean;
  scoreEarned?: number;
  audioBlobUrl?: string;
  audioDurationSeconds?: number;
  timeSpentSeconds?: number;
  flagged?: boolean;
  visited?: boolean;
}

export interface ExamAttempt {
  id: string;
  userId: string;
  examId: string;
  paperCode: string;
  level: HskLevel;
  mode: ExamMode;
  examType: MockExamType;
  startedAt: string;
  completedAt?: string;
  durationSeconds: number;
  timeRemainingSeconds: number;
  answers: Record<string, UserAnswerRecord>;
  flaggedQuestionIds: string[];
  visitedQuestionIds: string[];
  currentQuestionIndex: number;
  currentSection: ExamSkill;
  // Computed scores upon completion
  totalScore?: number;
  rawScore?: number;
  maxScore?: number;
  passingScore?: number;
  percentage?: number;
  passed?: boolean;
  sectionScores?: Record<ExamSkill, { earned: number; total: number; percentage: number }>;
  skillBreakdown?: Record<ExamSkill, { correct: number; total: number; percentage: number }>;
  weakVocabularyIds?: string[];
  weakestSkill?: ExamSkill;
  strongestSkill?: ExamSkill;
  estimatedHskBand?: string;
  isComplete: boolean;
}

export interface ExamHistorySummary {
  totalAttempts: number;
  bestScore: number;
  averageScore: number;
  latestScore: number;
  passRate: number;
  attempts: ExamAttempt[];
}
