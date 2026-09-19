import { Tone, VocabularyWord, ExampleSentence } from "./hsk";

export type TonePracticeMode =
  | "identify"
  | "select"
  | "match"
  | "listen"
  | "speak";

export interface ToneQuestion {
  id: string;
  wordId: string;
  hanzi: string;
  pinyinDisplay: string;
  targetSyllable: string;
  targetTone: Tone;
  options: {
    tone: Tone;
    label: string;
    pinyinWithTone: string;
  }[];
  explanation?: string;
}

export type SentenceExerciseMode = "ordering" | "fill-in-blank";

export interface SentenceExercise {
  id: string;
  sentenceId: string;
  targetWord: VocabularyWord;
  sentence: ExampleSentence;
  mode: SentenceExerciseMode;
  scrambledTokens: string[];
  correctOrder: string[];
  blankToken?: string;
  blankOptions?: string[];
}

export interface PracticeSessionResult {
  totalQuestions: number;
  correctAnswers: number;
  wordsPracticed: string[];
  accuracy: number;
  durationSeconds: number;
  completedAt: string;
}
