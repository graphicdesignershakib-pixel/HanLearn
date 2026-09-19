export type GrammarCategory =
  | "Sentence Pattern"
  | "Aspect Marker"
  | "Complement"
  | "Particle"
  | "Comparison"
  | "Preposition"
  | "Conjunction"
  | "Passive & Disposal";

export interface GrammarExample {
  chinese: string;
  pinyin: string;
  english: string;
  bengali?: string;
  breakdown?: string;
}

export interface GrammarMistake {
  incorrect: string;
  correct: string;
  reason: string;
}

export interface GrammarQuestion {
  id: string;
  prompt: string;
  type: "choice" | "reorder" | "blank";
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
}

export interface GrammarPoint {
  id: string;
  hskLevel: "1" | "2" | "3" | "4" | "5" | "6" | "7-9";
  title: string;
  chineseTitle: string;
  pattern: string;
  category: GrammarCategory;
  summary: string;
  explanation: string;
  bengaliExplanation?: string;
  examples: GrammarExample[];
  commonMistakes?: GrammarMistake[];
  practiceQuestions: GrammarQuestion[];
  relatedWordIds?: string[];
}
