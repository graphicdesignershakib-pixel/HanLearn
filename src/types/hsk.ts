export type HskLevel = "1" | "2" | "3" | "4" | "5" | "6" | "7-9";

export type Tone = 0 | 1 | 2 | 3 | 4 | 5;

export interface PinyinSyllable {
  base: string;
  tone: Tone;
  display: string;
}

export interface Definition {
  text: string;
  partOfSpeech: string[];
  source: "pdf";
}

export interface AlternateReading {
  pinyinDisplay: string;
  syllables: PinyinSyllable[];
  note?: string;
  definitions?: string[];
}

export interface VocabularyWord {
  id: string;
  hskLevel: HskLevel;
  hanzi: string;
  pinyinDisplay: string;
  syllables: PinyinSyllable[];
  definitions: Definition[];
  sourceOrder: number;
  sourceFile: string;
  sourcePage?: number;
  sourceLabel: string;
  isPhrase: boolean;
  isIdiom: boolean;
  characterIds: string[];
  exampleSentenceIds?: string[];
  alternateReadings?: AlternateReading[];
}

export interface ChineseCharacter {
  id: string;
  hanzi: string;
  strokeCount?: number;
  radical?: string;
  pinyin?: string[];
  strokeDataProvider?: string;
  meaning?: string;
}

export interface ExampleSentence {
  id: string;
  vocabularyId: string;
  chinese: string;
  pinyin: string;
  english: string;
  tokens: string[];
  source: "generated" | "manual";
  difficulty?: "beginner" | "intermediate" | "advanced";
}

export type MasteryStatus = "unseen" | "learning" | "familiar" | "mastered";

export interface UserWordProgress {
  vocabularyId: string;
  status: MasteryStatus;
  favorite: boolean;
  reviewCount: number;
  lastReviewedAt?: string;
  nextReviewAt?: string;
  confidence?: number; // 0 - 100
  lapseCount?: number;
}

export interface StrokeData {
  character: string;
  strokes: string[];
  medians: number[][][];
  radStrokes?: number[];
}

export interface WordCategoryInfo {
  code: string;
  name: string;
  chinese: string;
  description: string;
  badgeClass: string;
}

export const WORD_CATEGORIES: WordCategoryInfo[] = [
  { code: "v.", name: "Verb", chinese: "动词", description: "Actions, states, occurrences", badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { code: "n.", name: "Noun", chinese: "名词", description: "Persons, places, objects, ideas", badgeClass: "bg-blue-50 text-blue-700 border-blue-200" },
  { code: "adj.", name: "Adjective", chinese: "形容词", description: "Qualities, properties, states", badgeClass: "bg-amber-50 text-amber-700 border-amber-200" },
  { code: "adv.", name: "Adverb", chinese: "副词", description: "Modifiers of verbs, adjectives, sentences", badgeClass: "bg-purple-50 text-purple-700 border-purple-200" },
  { code: "idiom", name: "Idiom", chinese: "成语", description: "Four-character traditional idioms", badgeClass: "bg-rose-50 text-rose-700 border-rose-200" },
  { code: "mw.", name: "Measure Word", chinese: "量词", description: "Classifiers for counting and specifying", badgeClass: "bg-teal-50 text-teal-700 border-teal-200" },
  { code: "conj.", name: "Conjunction", chinese: "连词", description: "Connectors between clauses and words", badgeClass: "bg-cyan-50 text-cyan-700 border-cyan-200" },
  { code: "pron.", name: "Pronoun", chinese: "代词", description: "Substitutes for nouns or noun phrases", badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { code: "prep.", name: "Preposition", chinese: "介词", description: "Relation markers indicating place, time, direction", badgeClass: "bg-orange-50 text-orange-700 border-orange-200" },
  { code: "num.", name: "Numeral", chinese: "数词", description: "Numbers, order, amounts", badgeClass: "bg-lime-50 text-lime-800 border-lime-200" },
  { code: "part.", name: "Particle", chinese: "助词", description: "Grammatical markers for aspect, mood, tone", badgeClass: "bg-pink-50 text-pink-700 border-pink-200" },
  { code: "phr.", name: "Phrase", chinese: "短语", description: "Set expressions and multi-word collocations", badgeClass: "bg-violet-50 text-violet-700 border-violet-200" },
  { code: "interj.", name: "Interjection", chinese: "叹词", description: "Exclamations, greetings, emotional remarks", badgeClass: "bg-yellow-50 text-yellow-800 border-yellow-200" },
  { code: "onom.", name: "Onomatopoeia", chinese: "拟声词", description: "Sound imitative words", badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  { code: "suf.", name: "Suffix", chinese: "后缀", description: "Word-final derivational elements", badgeClass: "bg-neutral-100 text-neutral-700 border-neutral-200" },
  { code: "pref.", name: "Prefix", chinese: "前缀", description: "Word-initial derivational elements", badgeClass: "bg-neutral-100 text-neutral-700 border-neutral-200" },
];

export function getCategoryInfo(code: string): WordCategoryInfo {
  const cleanCode = code.toLowerCase().trim();
  const found = WORD_CATEGORIES.find(
    (c) => c.code.toLowerCase() === cleanCode || c.code.replace(".", "") === cleanCode.replace(".", "")
  );
  return (
    found || {
      code,
      name: code,
      chinese: "词",
      description: "Word category",
      badgeClass: "bg-neutral-100 text-neutral-600 border-neutral-200",
    }
  );
}
