import { vocabularyService } from "./vocabularyService";
import { bengaliService, CHINESE_TO_BENGALI_DICT } from "./bengaliService";
import { VocabularyWord, ChineseCharacter } from "../types/hsk";

export interface ParsedCharacterDetail {
  char: string;
  pinyin: string;
  meaning: string;
  bengali: string;
  radical?: string;
  strokeCount?: number;
}

export interface ParsedToken {
  id: string;
  text: string;
  isChinese: boolean;
  isPunctuation: boolean;
  pinyin?: string;
  english?: string;
  bengali?: string;
  hskLevel?: string;
  radical?: string;
  strokeCount?: number;
  wordId?: string;
  characterBreakdown?: ParsedCharacterDetail[];
}

class ChineseTextParser {
  private wordMap = new Map<string, VocabularyWord>();
  private initialized = false;

  private init() {
    if (this.initialized) return;
    try {
      const allWords = vocabularyService.getAllWords();
      allWords.forEach((word) => {
        if (!this.wordMap.has(word.hanzi)) {
          this.wordMap.set(word.hanzi, word);
        }
      });
      this.initialized = true;
    } catch (e) {
      console.warn("Error initializing ChineseTextParser dictionary:", e);
    }
  }

  /**
   * Check if a character is within CJK Unified Ideographs range
   */
  public isChineseChar(char: string): boolean {
    return /[\u4e00-\u9fa5]/.test(char);
  }

  /**
   * Look up token info for a Chinese word or single character
   */
  public lookupWordOrChar(hanzi: string): Partial<ParsedToken> {
    this.init();

    const vocabWord = this.wordMap.get(hanzi);
    const charData = vocabularyService.getCharacter(hanzi);
    const bnMeaning = bengaliService.getBengaliWordMeaning(hanzi) || CHINESE_TO_BENGALI_DICT[hanzi];

    let pinyin = vocabWord?.pinyinDisplay || "";
    let english = vocabWord?.definitions?.[0]?.text || "";
    let hskLevel = vocabWord?.hskLevel || "";
    let radical = charData?.radical || "";
    let strokeCount = charData?.strokeCount;
    let wordId = vocabWord?.id;

    if (!pinyin && charData?.pinyin?.[0]) {
      pinyin = charData.pinyin[0];
    }
    if (!english && charData?.meaning) {
      english = charData.meaning;
    }

    // Breakdown for multi-character words
    let characterBreakdown: ParsedCharacterDetail[] | undefined;
    if (hanzi.length > 1) {
      characterBreakdown = [];
      for (const ch of hanzi) {
        if (this.isChineseChar(ch)) {
          const subChar = vocabularyService.getCharacter(ch);
          const subWord = this.wordMap.get(ch);
          const subBn = bengaliService.getBengaliWordMeaning(ch) || CHINESE_TO_BENGALI_DICT[ch] || "";
          const subPy = subWord?.pinyinDisplay || subChar?.pinyin?.[0] || "";
          const subEn = subWord?.definitions?.[0]?.text || subChar?.meaning || "";

          characterBreakdown.push({
            char: ch,
            pinyin: subPy,
            meaning: subEn,
            bengali: subBn,
            radical: subChar?.radical,
            strokeCount: subChar?.strokeCount,
          });
        }
      }
    }

    return {
      text: hanzi,
      isChinese: true,
      isPunctuation: false,
      pinyin: pinyin || undefined,
      english: english || undefined,
      bengali: bnMeaning || undefined,
      hskLevel: hskLevel || undefined,
      radical: radical || undefined,
      strokeCount,
      wordId,
      characterBreakdown,
    };
  }

  /**
   * Parse a paragraph or sentence into tokens (segmented words, characters, punctuation)
   */
  public parseText(text: string): ParsedToken[] {
    this.init();
    const tokens: ParsedToken[] = [];
    let i = 0;
    const len = text.length;

    while (i < len) {
      const char = text[i];

      // Check if whitespace
      if (/\s/.test(char)) {
        tokens.push({
          id: `ws-${i}-${Math.random()}`,
          text: char,
          isChinese: false,
          isPunctuation: false,
        });
        i++;
        continue;
      }

      // Check if punctuation or symbol
      if (!this.isChineseChar(char) && /[，。？！、；：“”‘’（）《》【】—…·\-.,!?;:()\[\]'"]/.test(char)) {
        tokens.push({
          id: `punc-${i}-${char}`,
          text: char,
          isChinese: false,
          isPunctuation: true,
        });
        i++;
        continue;
      }

      // If not Chinese character (e.g. latin letter or digits)
      if (!this.isChineseChar(char)) {
        let nonZh = "";
        const start = i;
        while (i < len && !this.isChineseChar(text[i]) && !/[，。？！、；：“”‘’（）《》【】—…·\-.,!?;:()\[\]'"]/.test(text[i]) && !/\s/.test(text[i])) {
          nonZh += text[i];
          i++;
        }
        tokens.push({
          id: `other-${start}-${nonZh}`,
          text: nonZh,
          isChinese: false,
          isPunctuation: false,
        });
        continue;
      }

      // Chinese character sequence: try maximum matching up to 4 characters
      let matchedWord = "";
      for (let matchLen = Math.min(4, len - i); matchLen >= 2; matchLen--) {
        const candidate = text.slice(i, i + matchLen);
        if (this.wordMap.has(candidate) || CHINESE_TO_BENGALI_DICT[candidate]) {
          matchedWord = candidate;
          break;
        }
      }

      if (matchedWord) {
        const info = this.lookupWordOrChar(matchedWord);
        tokens.push({
          id: `tok-${i}-${matchedWord}`,
          ...info,
          text: matchedWord,
          isChinese: true,
          isPunctuation: false,
        });
        i += matchedWord.length;
      } else {
        // Single Chinese character fallback
        const singleChar = char;
        const info = this.lookupWordOrChar(singleChar);
        tokens.push({
          id: `tok-${i}-${singleChar}`,
          ...info,
          text: singleChar,
          isChinese: true,
          isPunctuation: false,
        });
        i++;
      }
    }

    return tokens;
  }
}

export const chineseTextParser = new ChineseTextParser();
