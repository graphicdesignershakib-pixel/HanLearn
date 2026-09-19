export interface PinyinInitial {
  letter: string;
  ipa: string;
  name: string;
  category: "Labial" | "Alveolar" | "Velar" | "Palatal" | "Retroflex" | "Dental Sibilant" | "Semi-vowel";
  description: string;
  exampleHanzi: string;
  examplePinyin: string;
  exampleEnglish: string;
}

export interface PinyinFinal {
  letter: string;
  ipa: string;
  category: "Simple" | "Compound" | "Front Nasal (-n)" | "Back Nasal (-ng)";
  description: string;
  exampleHanzi: string;
  examplePinyin: string;
  exampleEnglish: string;
}

export interface ToneContourInfo {
  tone: number;
  name: string;
  chineseName: string;
  pitchRange: string; // e.g., "55"
  contourType: "High Level" | "Rising" | "Low Dipping" | "High Falling" | "Neutral";
  description: string;
  symbol: string;
  example: string;
  pitchPoints: number[]; // e.g. [5, 5]
}

export interface TonePair {
  id: string;
  tone1: number;
  tone2: number;
  title: string;
  word: string;
  pinyin: string;
  meaning: string;
  tips: string;
}

export const PINYIN_INITIALS: PinyinInitial[] = [
  { letter: "b", ipa: "[p]", name: "Unaspirated labial", category: "Labial", description: "Voiceless bilabial stop, like 'p' in 'spot' (no puff of air).", exampleHanzi: "爸", examplePinyin: "bà", exampleEnglish: "father" },
  { letter: "p", ipa: "[pʰ]", name: "Aspirated labial", category: "Labial", description: "Strong burst of air, like 'p' in 'pot'.", exampleHanzi: "朋", examplePinyin: "péng", exampleEnglish: "friend" },
  { letter: "m", ipa: "[m]", name: "Bilabial nasal", category: "Labial", description: "Standard 'm' sound as in 'mother'.", exampleHanzi: "妈", examplePinyin: "mā", exampleEnglish: "mother" },
  { letter: "f", ipa: "[f]", name: "Labiodental fricative", category: "Labial", description: "Upper teeth against lower lip, like 'f' in 'food'.", exampleHanzi: "飞", examplePinyin: "fēi", exampleEnglish: "fly" },
  { letter: "d", ipa: "[t]", name: "Unaspirated alveolar", category: "Alveolar", description: "Like 't' in 'stop', crisp with no puff of air.", exampleHanzi: "大", examplePinyin: "dà", exampleEnglish: "big" },
  { letter: "t", ipa: "[tʰ]", name: "Aspirated alveolar", category: "Alveolar", description: "Strong air burst, like 't' in 'top'.", exampleHanzi: "天", examplePinyin: "tiān", exampleEnglish: "sky/day" },
  { letter: "n", ipa: "[n]", name: "Alveolar nasal", category: "Alveolar", description: "Tip of tongue on tooth ridge, like 'n' in 'no'.", exampleHanzi: "你", examplePinyin: "nǐ", exampleEnglish: "you" },
  { letter: "l", ipa: "[l]", name: "Alveolar lateral", category: "Alveolar", description: "Clear 'l' sound, like 'l' in 'look'.", exampleHanzi: "六", examplePinyin: "liù", exampleEnglish: "six" },
  { letter: "g", ipa: "[k]", name: "Unaspirated velar", category: "Velar", description: "Back of tongue against soft palate, like 'k' in 'skill'.", exampleHanzi: "个", examplePinyin: "gè", exampleEnglish: "individual/item" },
  { letter: "k", ipa: "[kʰ]", name: "Aspirated velar", category: "Velar", description: "Strong puff of air, like 'k' in 'kite'.", exampleHanzi: "看", examplePinyin: "kàn", exampleEnglish: "look/see" },
  { letter: "h", ipa: "[x]", name: "Velar fricative", category: "Velar", description: "Rough guttural 'h', similar to 'ch' in Scottish 'loch'.", exampleHanzi: "好", examplePinyin: "hǎo", exampleEnglish: "good" },
  { letter: "j", ipa: "[tɕ]", name: "Unaspirated palatal", category: "Palatal", description: "Tongue flat against hard palate, like 'j' in 'jeep' without voicing.", exampleHanzi: "家", examplePinyin: "jiā", exampleEnglish: "home" },
  { letter: "q", ipa: "[tɕʰ]", name: "Aspirated palatal", category: "Palatal", description: "Strong air puff, like 'ch' in 'cheese' with tongue flat.", exampleHanzi: "七", examplePinyin: "qī", exampleEnglish: "seven" },
  { letter: "x", ipa: "[ɕ]", name: "Palatal fricative", category: "Palatal", description: "Tongue flat, lips spread, like 'sh' in 'sheep'.", exampleHanzi: "小", examplePinyin: "xiǎo", exampleEnglish: "small" },
  { letter: "zh", ipa: "[ʈʂ]", name: "Unaspirated retroflex", category: "Retroflex", description: "Tongue tip curled back towards palate, like 'j' in 'judge'.", exampleHanzi: "中", examplePinyin: "zhōng", exampleEnglish: "middle" },
  { letter: "ch", ipa: "[ʈʂʰ]", name: "Aspirated retroflex", category: "Retroflex", description: "Tongue tip curled back with strong airflow, like 'ch' in 'church'.", exampleHanzi: "吃", examplePinyin: "chī", exampleEnglish: "eat" },
  { letter: "sh", ipa: "[ʂ]", name: "Retroflex fricative", category: "Retroflex", description: "Tongue curled back, like 'sh' in 'shirt'.", exampleHanzi: "书", examplePinyin: "shū", exampleEnglish: "book" },
  { letter: "r", ipa: "[ʐ]", name: "Voiced retroflex", category: "Retroflex", description: "Curled tongue with vocal cords vibrating, like 's' in 'pleasure'.", exampleHanzi: "日", examplePinyin: "rì", exampleEnglish: "sun/day" },
  { letter: "z", ipa: "[ts]", name: "Unaspirated dental", category: "Dental Sibilant", description: "Tongue behind upper teeth, like 'ds' in 'roads'.", exampleHanzi: "早", examplePinyin: "zǎo", exampleEnglish: "early" },
  { letter: "c", ipa: "[tsʰ]", name: "Aspirated dental", category: "Dental Sibilant", description: "Strong air burst, like 'ts' in 'cats'.", exampleHanzi: "菜", examplePinyin: "cài", exampleEnglish: "dish/vegetable" },
  { letter: "s", ipa: "[s]", name: "Dental fricative", category: "Dental Sibilant", description: "Hissing 's' sound, like 's' in 'sun'.", exampleHanzi: "四", examplePinyin: "sì", exampleEnglish: "four" },
  { letter: "y", ipa: "[j]", name: "Palatal semi-vowel", category: "Semi-vowel", description: "Acts as initial for syllables starting with 'i' / 'ü'.", exampleHanzi: "月", examplePinyin: "yuè", exampleEnglish: "moon" },
  { letter: "w", ipa: "[w]", name: "Labial semi-vowel", category: "Semi-vowel", description: "Acts as initial for syllables starting with 'u'.", exampleHanzi: "五", examplePinyin: "wǔ", exampleEnglish: "five" },
];

export const PINYIN_FINALS: PinyinFinal[] = [
  { letter: "a", ipa: "[a]", category: "Simple", description: "Open mouth wide, unrounded, like 'a' in 'father'.", exampleHanzi: "八", examplePinyin: "bā", exampleEnglish: "eight" },
  { letter: "o", ipa: "[o]", category: "Simple", description: "Rounded lips, mid-back vowel, like 'aw' in 'law'.", exampleHanzi: "我", examplePinyin: "wǒ", exampleEnglish: "I/me" },
  { letter: "e", ipa: "[ɤ]", category: "Simple", description: "Unrounded back vowel, smile while making an 'uh' sound.", exampleHanzi: "喝", examplePinyin: "hē", exampleEnglish: "drink" },
  { letter: "i", ipa: "[i]", category: "Simple", description: "Lips spread wide, like 'ee' in 'see'.", exampleHanzi: "一", examplePinyin: "yī", exampleEnglish: "one" },
  { letter: "u", ipa: "[u]", category: "Simple", description: "Tight rounded lips, like 'oo' in 'moon'.", exampleHanzi: "不", examplePinyin: "bù", exampleEnglish: "not" },
  { letter: "ü", ipa: "[y]", category: "Simple", description: "Shape lips for 'oo', but say 'ee' inside mouth.", exampleHanzi: "绿", examplePinyin: "lǜ", exampleEnglish: "green" },
  { letter: "ai", ipa: "[aɪ]", category: "Compound", description: "Starts at 'a' and glides smoothly into 'i'.", exampleHanzi: "爱", examplePinyin: "ài", exampleEnglish: "love" },
  { letter: "ei", ipa: "[eɪ]", category: "Compound", description: "Like 'ay' in 'say'.", exampleHanzi: "北", examplePinyin: "běi", exampleEnglish: "north" },
  { letter: "ao", ipa: "[aʊ]", category: "Compound", description: "Like 'ow' in 'cow'.", exampleHanzi: "高", examplePinyin: "gāo", exampleEnglish: "tall" },
  { letter: "ou", ipa: "[oʊ]", category: "Compound", description: "Like 'oh' in 'boat'.", exampleHanzi: "手", examplePinyin: "shǒu", exampleEnglish: "hand" },
  { letter: "an", ipa: "[an]", category: "Front Nasal (-n)", description: "Open 'a' followed by front nasal 'n'.", exampleHanzi: "安", examplePinyin: "ān", exampleEnglish: "peace" },
  { letter: "en", ipa: "[ən]", category: "Front Nasal (-n)", description: "Like 'en' in 'open'.", exampleHanzi: "门", examplePinyin: "mén", exampleEnglish: "door" },
  { letter: "ang", ipa: "[aŋ]", category: "Back Nasal (-ng)", description: "Deep resonance in soft palate, like 'ong' in 'song'.", exampleHanzi: "忙", examplePinyin: "máng", exampleEnglish: "busy" },
  { letter: "eng", ipa: "[əŋ]", category: "Back Nasal (-ng)", description: "Like 'ung' in 'sung'.", exampleHanzi: "冷", examplePinyin: "lěng", exampleEnglish: "cold" },
  { letter: "ing", ipa: "[iŋ]", category: "Back Nasal (-ng)", description: "Like 'ing' in 'sing'.", exampleHanzi: "明", examplePinyin: "míng", exampleEnglish: "bright" },
  { letter: "ong", ipa: "[ʊŋ]", category: "Back Nasal (-ng)", description: "Rounded lips with back nasal resonance.", exampleHanzi: "红", examplePinyin: "hóng", exampleEnglish: "red" },
];

export const TONE_CONTOURS: ToneContourInfo[] = [
  {
    tone: 1,
    name: "First Tone (High Flat)",
    chineseName: "第一声（阴平）",
    pitchRange: "55",
    contourType: "High Level",
    description: "High, flat, steady pitch held constant without falling or rising. Like singing a continuous high note: 'ahhh'.",
    symbol: "—",
    example: "mā (妈 - mother)",
    pitchPoints: [5, 5, 5],
  },
  {
    tone: 2,
    name: "Second Tone (Rising)",
    chineseName: "第二声（阳平）",
    pitchRange: "35",
    contourType: "Rising",
    description: "Starts in middle range and rises sharply to high pitch, exactly like asking 'What?!' in surprise.",
    symbol: "ˊ",
    example: "má (麻 - hemp)",
    pitchPoints: [3, 4, 5],
  },
  {
    tone: 3,
    name: "Third Tone (Low Dipping)",
    chineseName: "第三声（上声）",
    pitchRange: "214",
    contourType: "Low Dipping",
    description: "Starts low, dips down into your lowest vocal chest register, and rises slightly at the end (or stays low before other syllables).",
    symbol: "ˇ",
    example: "mǎ (马 - horse)",
    pitchPoints: [2, 1, 4],
  },
  {
    tone: 4,
    name: "Fourth Tone (Falling)",
    chineseName: "第四声（去声）",
    pitchRange: "51",
    contourType: "High Falling",
    description: "Starts from peak high pitch and plunges sharply and decisively downwards, like an emphatic 'No!'.",
    symbol: "ˋ",
    example: "mà (骂 - scold)",
    pitchPoints: [5, 3, 1],
  },
  {
    tone: 0,
    name: "Neutral Tone (Light)",
    chineseName: "轻声",
    pitchRange: "--",
    contourType: "Neutral",
    description: "Short, light, and unstressed. Its exact pitch depends comfortably on the tone of the preceding syllable.",
    symbol: "•",
    example: "ma (吗 - question particle)",
    pitchPoints: [3, 2],
  },
];

export const TONE_PAIRS: TonePair[] = [
  { id: "tp-1-1", tone1: 1, tone2: 1, title: "1st + 1st Tone", word: "今天", pinyin: "jīntiān", meaning: "today", tips: "Keep both syllables at the same continuous high pitch level." },
  { id: "tp-1-2", tone1: 1, tone2: 2, title: "1st + 2nd Tone", word: "中国", pinyin: "Zhōngguó", meaning: "China", tips: "High flat note followed by an upward rising inquiry pitch." },
  { id: "tp-1-3", tone1: 1, tone2: 3, title: "1st + 3rd Tone", word: "北京", pinyin: "Běijīng (originally Běi is 3rd, 3+1)", meaning: "Beijing", tips: "Drop directly from high flat down into low vocal register." },
  { id: "tp-1-4", tone1: 1, tone2: 4, title: "1st + 4th Tone", word: "高兴", pinyin: "gāoxìng", meaning: "happy", tips: "Hold high note, then plunge down decisively." },
  { id: "tp-2-1", tone1: 2, tone2: 1, title: "2nd + 1st Tone", word: "学习", pinyin: "xuéxí (2+2), 明天: míngtiān", meaning: "tomorrow", tips: "Rise from mid to high, then sustain steady high level." },
  { id: "tp-2-4", tone1: 2, tone2: 4, title: "2nd + 4th Tone", word: "学生", pinyin: "xuéshēng (2+1), 决定: juédìng", meaning: "decide", tips: "Rise up, then instantly plunge back down." },
  { id: "tp-3-3", tone1: 3, tone2: 3, title: "3rd + 3rd Tone (Sandhi)", word: "你好", pinyin: "nǐ hǎo (pronounced ní hǎo)", meaning: "hello", tips: "MANDATORY SANDHI RULE: The first 3rd tone automatically becomes a 2nd tone!" },
  { id: "tp-4-4", tone1: 4, tone2: 4, title: "4th + 4th Tone", word: "再见", pinyin: "zàijiàn", meaning: "goodbye", tips: "Two crisp, energetic downward drops." },
];
