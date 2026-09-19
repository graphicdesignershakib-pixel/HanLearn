import { PinyinSyllable, Tone } from "../types/hsk";

// Mapping of vowels with tone marks to base vowel and tone number
const TONE_CHAR_MAP: Record<string, { base: string; tone: Tone }> = {
  // a
  ā: { base: "a", tone: 1 },
  á: { base: "a", tone: 2 },
  ǎ: { base: "a", tone: 3 },
  à: { base: "a", tone: 4 },
  // e
  ē: { base: "e", tone: 1 },
  é: { base: "e", tone: 2 },
  ě: { base: "e", tone: 3 },
  è: { base: "e", tone: 4 },
  // i
  ī: { base: "i", tone: 1 },
  í: { base: "i", tone: 2 },
  ǐ: { base: "i", tone: 3 },
  ì: { base: "i", tone: 4 },
  // o
  ō: { base: "o", tone: 1 },
  ó: { base: "o", tone: 2 },
  ǒ: { base: "o", tone: 3 },
  ò: { base: "o", tone: 4 },
  // u
  ū: { base: "u", tone: 1 },
  ú: { base: "u", tone: 2 },
  ǔ: { base: "u", tone: 3 },
  ù: { base: "u", tone: 4 },
  // ü / v
  ǖ: { base: "ü", tone: 1 },
  ǘ: { base: "ü", tone: 2 },
  ǚ: { base: "ü", tone: 3 },
  ǜ: { base: "ü", tone: 4 },
};

/**
 * Strips tone accents from Pinyin string for search normalization
 * e.g., "hǎo chī" -> "hao chi"
 */
export function removePinyinTones(pinyin: string): string {
  let result = "";
  for (const char of pinyin) {
    if (TONE_CHAR_MAP[char]) {
      result += TONE_CHAR_MAP[char].base;
    } else {
      result += char;
    }
  }
  return result
    .toLowerCase()
    .replace(/[·'’]/g, "")
    .trim();
}

/**
 * Extracts syllables and tones from a Pinyin display string like "hǎo", "xué·shēng", or "nǐ hǎo"
 */
export function parsePinyinSyllables(pinyinDisplay: string): PinyinSyllable[] {
  // Normalize delimiters (split by space or middle dot or hyphen)
  const tokens = pinyinDisplay
    .replace(/[·-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 0);

  return tokens.map((token) => {
    let tone: Tone = 0;
    let base = "";

    for (const char of token) {
      if (TONE_CHAR_MAP[char]) {
        base += TONE_CHAR_MAP[char].base;
        if (tone === 0) {
          tone = TONE_CHAR_MAP[char].tone;
        }
      } else {
        base += char;
      }
    }

    return {
      base: base.toLowerCase(),
      tone,
      display: token,
    };
  });
}

/**
 * Formats a tone name or description
 */
export function getToneDescription(tone: Tone): { name: string; mark: string; description: string } {
  switch (tone) {
    case 1:
      return { name: "First Tone", mark: "— (flat)", description: "High and level (55)" };
    case 2:
      return { name: "Second Tone", mark: "ˊ (rising)", description: "Rising from mid to high (35)" };
    case 3:
      return { name: "Third Tone", mark: "ˇ (dipping)", description: "Low dipping then rising (214)" };
    case 4:
      return { name: "Fourth Tone", mark: "ˋ (falling)", description: "Sharp fall from high to low (51)" };
    case 0:
    case 5:
    default:
      return { name: "Neutral Tone", mark: "· (light)", description: "Short and unstressed" };
  }
}
