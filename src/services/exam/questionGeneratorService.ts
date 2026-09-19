import { HskLevel, VocabularyWord } from "../../types/hsk";
import { ExamQuestion, ExamQuestionType, ExamSkill, QuestionOption } from "../../types/exam";
import { vocabularyService } from "../vocabularyService";

/**
 * Procedural & Curated Question Generator strictly anchored to the HSK 3.0 vocabulary repository.
 * Generates valid questions with distractors strictly derived from vocabulary within the same level band.
 */
export class QuestionGeneratorService {
  /**
   * Generates a listening multiple choice question based on level words
   */
  public generateListeningQuestion(
    level: HskLevel,
    index: number,
    sectionPart: number = 1
  ): ExamQuestion {
    const levelWords = vocabularyService.getWordsByLevel(level);
    if (!levelWords || levelWords.length === 0) {
      throw new Error(`No vocabulary available for HSK level ${level}`);
    }

    const targetIndex = (index * 7 + 3) % levelWords.length;
    const targetWord = levelWords[targetIndex];
    const definition = targetWord.definitions[0]?.text || "meaning";

    // Select 3 distractors from same level
    const distractors: VocabularyWord[] = [];
    for (let i = 1; distractors.length < 3; i++) {
      const dIndex = (targetIndex + i * 11) % levelWords.length;
      if (dIndex !== targetIndex) {
        distractors.push(levelWords[dIndex]);
      }
    }

    const rawOptions = [
      {
        textZh: targetWord.hanzi,
        textPinyin: targetWord.pinyinDisplay,
        textEn: definition,
        isCorrect: true,
      },
      ...distractors.map((d) => ({
        textZh: d.hanzi,
        textPinyin: d.pinyinDisplay,
        textEn: d.definitions[0]?.text || "",
        isCorrect: false,
      })),
    ];

    // Deterministic shuffle
    const shuffled = [...rawOptions].sort(
      (a, b) => a.textZh.localeCompare(b.textZh)
    );
    const keys = ["A", "B", "C", "D"];
    let correctKey = "A";

    const options: QuestionOption[] = shuffled.map((item, idx) => {
      const key = keys[idx];
      if (item.isCorrect) correctKey = key;
      return {
        key,
        textZh: item.textZh,
        textPinyin: item.textPinyin,
        textEn: item.textEn,
      };
    });

    const audioScript = `请听录音：${targetWord.hanzi}。拼音是 ${targetWord.pinyinDisplay}。`;

    return {
      id: `gen_l_${level}_${index}_${targetWord.id}`,
      level,
      section: "listening",
      sectionPart,
      questionNumber: index,
      type: "listening_mcq",
      skill: "listening",
      difficulty: level === "1" ? 1 : level === "2" ? 2 : level === "3" ? 3 : 4,
      promptZh: "听录音，选出你所听到的正确生词：",
      promptPinyin: "Tīng lùyīn, xuǎn chū nǐ suǒ tīng dào de zhèngquè shēngcí:",
      promptEn: "Listen to the recording and select the word spoken:",
      promptBn: "অডিও শুনে সঠিক শব্দটি বেছে নিন:",
      audioScript,
      audioDurationSeconds: 4,
      options,
      correctAnswer: correctKey,
      explanationZh: `录音播放的是“${targetWord.hanzi}”(${targetWord.pinyinDisplay})，意思是“${definition}”，故选 ${correctKey}。`,
      explanationEn: `The recording speaks "${targetWord.hanzi}" (${targetWord.pinyinDisplay}), meaning "${definition}". Correct answer is ${correctKey}.`,
      explanationBn: `অডিওতে “${targetWord.hanzi}” (${targetWord.pinyinDisplay}) উচ্চারণ করা হয়েছে, যার অর্থ “${definition}”। সুতরাং সঠিক উত্তর ${correctKey}।`,
      vocabularyIds: [targetWord.id, ...distractors.map((d) => d.id)],
      points: 5,
      source: "official sample inspired",
      status: "published",
    };
  }

  /**
   * Generates a reading cloze / comprehension question
   */
  public generateReadingQuestion(
    level: HskLevel,
    index: number,
    sectionPart: number = 1
  ): ExamQuestion {
    const levelWords = vocabularyService.getWordsByLevel(level);
    const targetWord = levelWords[(index * 13 + 5) % levelWords.length];
    const definition = targetWord.definitions[0]?.text || "meaning";

    const distractors: VocabularyWord[] = [];
    for (let i = 1; distractors.length < 3; i++) {
      const dIndex = (index * 13 + 5 + i * 17) % levelWords.length;
      distractors.push(levelWords[dIndex]);
    }

    const rawOptions = [
      { textZh: targetWord.hanzi, textPinyin: targetWord.pinyinDisplay, textEn: definition, isCorrect: true },
      ...distractors.map((d) => ({
        textZh: d.hanzi,
        textPinyin: d.pinyinDisplay,
        textEn: d.definitions[0]?.text || "",
        isCorrect: false,
      })),
    ].sort((a, b) => a.textZh.localeCompare(b.textZh));

    const keys = ["A", "B", "C", "D"];
    let correctKey = "A";

    const options: QuestionOption[] = rawOptions.map((item, idx) => {
      const key = keys[idx];
      if (item.isCorrect) correctKey = key;
      return {
        key,
        textZh: item.textZh,
        textPinyin: item.textPinyin,
        textEn: item.textEn,
      };
    });

    const sentenceWithBlank = `我今天在学校看到了（   ），大家都很高兴。`;
    const sentencePinyin = `Wǒ jīntiān zài xuéxiào kàn dào le (   ), dàjiā dōu hěn gāoxìng.`;

    return {
      id: `gen_r_${level}_${index}_${targetWord.id}`,
      level,
      section: "reading",
      sectionPart,
      questionNumber: index,
      type: "reading_fill_blank",
      skill: "reading",
      difficulty: level === "1" ? 1 : level === "2" ? 2 : level === "3" ? 3 : 4,
      promptZh: `选择最恰当的词语填入括号：\n${sentenceWithBlank}`,
      promptPinyin: sentencePinyin,
      promptEn: `Choose the most appropriate word to fill in the blank:\n"${sentenceWithBlank}"`,
      promptBn: `শূন্যস্থানে সবচেয়ে উপযুক্ত শব্দটি বসান:\n"${sentenceWithBlank}"`,
      options,
      correctAnswer: correctKey,
      explanationZh: `根据句意，“${targetWord.hanzi}”放入句中逻辑自然通顺。正确选项为 ${correctKey}。`,
      explanationEn: `In this sentence, "${targetWord.hanzi}" (${targetWord.pinyinDisplay}) fits the contextual grammar and syntax best. Correct answer is ${correctKey}.`,
      explanationBn: `বাক্যের ভাবার্থ অনুযায়ী “${targetWord.hanzi}” শব্দটি সম্পূর্ণ অর্থবোধক করে তোলে। সঠিক উত্তর ${correctKey}।`,
      vocabularyIds: [targetWord.id, ...distractors.map((d) => d.id)],
      points: 5,
      source: "official sample inspired",
      status: "published",
    };
  }

  /**
   * Generates a writing sentence unscramble question
   */
  public generateWritingQuestion(
    level: HskLevel,
    index: number,
    sectionPart: number = 1
  ): ExamQuestion {
    const levelWords = vocabularyService.getWordsByLevel(level);
    const targetWord = levelWords[(index * 5 + 2) % levelWords.length];

    // Authentic sentence patterns by level
    const patterns = [
      {
        tokens: ["我", "想", "学习", "中文"],
        correct: "我想学习中文。",
        pinyin: "Wǒ xiǎng xuéxí Zhōngwén.",
        en: "I want to learn Chinese.",
        bn: "আমি চীনা ভাষা শিখতে চাই।",
      },
      {
        tokens: ["桌子上", "有", "三本", "书"],
        correct: "桌子上有三本书。",
        pinyin: "Zhuōzi shàng yǒu sān běn shū.",
        en: "There are three books on the table.",
        bn: "টেবিলের উপর তিনটি বই আছে।",
      },
      {
        tokens: ["昨天", "我们", "去", "商店", "买苹果"],
        correct: "昨天我们去商店买苹果。",
        pinyin: "Zuótiān wǒmen qù shāngdiàn mǎi píngguǒ.",
        en: "Yesterday we went to the shop to buy apples.",
        bn: "গতকাল আমরা দোকান থেকে আপেল কিনতে গিয়েছিলাম।",
      },
      {
        tokens: ["他", "今天", "没有", "来", "学校"],
        correct: "他今天没有来学校。",
        pinyin: "Tā jīntiān méiyǒu lái xuéxiào.",
        en: "He did not come to school today.",
        bn: "সে আজ স্কুলে আসেনি।",
      },
      {
        tokens: ["这只", "小猫", "非常", "可爱"],
        correct: "这只小猫非常可爱。",
        pinyin: "Zhè zhī xiǎomāo fēicháng kě'ài.",
        en: "This kitten is very cute.",
        bn: "এই বিড়ালছানাটি খুব মিষ্টি।",
      },
    ];

    const selectedPattern = patterns[index % patterns.length];
    // Shuffled tokens for candidate
    const shuffledTokens = [...selectedPattern.tokens].sort(() => 0.5 - Math.random());

    return {
      id: `gen_w_${level}_${index}`,
      level,
      section: "writing",
      sectionPart,
      questionNumber: index,
      type: "writing_sentence_order",
      skill: "writing",
      difficulty: 2,
      promptZh: "连词成句：将给出的词语按正确的现代汉语语序排列成句。",
      promptPinyin: "Lián cí chéng jù: Jiāng gěi chū de cíyǔ àn zhèngquè de yǔxù páiliè chéng jù.",
      promptEn: "Sentence unscramble: Rearrange the shuffled words into a grammatically authentic sentence.",
      promptBn: "বাক্য পুনর্গঠন: এলোমেলো শব্দগুলোকে সঠিক ব্যাকরণসম্মত ক্রমে সাজান।",
      unscrambleTokens: shuffledTokens,
      correctAnswer: selectedPattern.correct,
      explanationZh: `正确语序：${selectedPattern.correct}。注意主语+状语+谓语+宾语的基础结构。`,
      explanationEn: `Correct sentence order: "${selectedPattern.correct}" (${selectedPattern.pinyin}) - "${selectedPattern.en}". Follows Subject + Adverbial + Verb + Object structure.`,
      explanationBn: `সঠিক বাক্য গঠন: “${selectedPattern.correct}” (${selectedPattern.bn})। চীনা ভাষার মূল গঠন: কর্তা + সময়/স্থান + ক্রিয়া + কর্ম।`,
      vocabularyIds: [targetWord.id],
      points: 10,
      source: "official sample inspired",
      status: "published",
    };
  }

  /**
   * Generates a Translation task for HSK 7-9
   */
  public generateTranslationQuestion(
    index: number,
    sectionPart: number = 1
  ): ExamQuestion {
    const tasks = [
      {
        source: "Green energy transformation requires substantial investment in solar power and wind infrastructure, as well as policy stability over the next decade.",
        refZh: "绿色能源转型需要在太阳能和风能基础设施方面投入大量资金，并在未来十年保持政策的稳定性。",
        criteria: ["准确传达‘绿色能源转型’ (green energy transformation)", "准确翻译‘基础设施’ (infrastructure)", "语体庄重规范，符合现代书面汉语语法"],
      },
      {
        source: "Cultural exchange programs between universities enhance mutual understanding and create long-lasting academic partnerships worldwide.",
        refZh: "大学之间的文化交流项目增进了彼此的了解，并在全球范围内建立了持久的学术合作伙伴关系。",
        criteria: ["词汇对译准确：文化交流 (cultural exchange)、学术合作 (academic partnerships)", "逻辑流畅自然，表意清晰"],
      },
      {
        source: "The rapid development of artificial intelligence presents unprecedented economic opportunities alongside ethical challenges.",
        refZh: "人工智能的迅猛发展在带来前所未有的经济机遇的同时，也带来了伦理层面的挑战。",
        criteria: ["术语规范：人工智能 (AI)、伦理挑战 (ethical challenges)", "成语或并列连词‘在……的同时’使用贴切"],
      },
      {
        source: "Sustainable urban development requires a balanced approach to housing affordability, public transportation, and environmental protection.",
        refZh: "城市可持续发展需要在住房可负担性、公共交通以及环境保护之间采取平衡的举措。",
        criteria: ["译文结构平衡，专业词汇选用精准，行文连贯规范"],
      },
    ];

    const task = tasks[index % tasks.length];

    return {
      id: `gen_tr_7-9_${index}`,
      level: "7-9",
      section: "translation",
      sectionPart,
      questionNumber: index,
      type: "translation_written",
      skill: "translation",
      difficulty: 5,
      promptZh: "请将以下英文专业段落翻译成地道规范的现代汉语书面语：",
      promptEn: "Translate the following English academic/professional passage into formal written Chinese:",
      promptBn: "নিচের ইংরেজি অনুচ্ছেদটি প্রমিত চীনা লিখিত ভাষায় অনুবাদ করুন:",
      translationSourceText: task.source,
      referenceAnswer: task.refZh,
      evaluationCriteria: task.criteria,
      correctAnswer: task.refZh,
      explanationZh: `参考译文：${task.refZh}。\n评分重点：${task.criteria.join("；")}`,
      explanationEn: `Reference translation: "${task.refZh}".\nEvaluation points: ${task.criteria.join("; ")}`,
      explanationBn: `আদর্শ অনুবাদ: “${task.refZh}”\nমূল্যায়ন মাপকাঠি: ${task.criteria.join("; ")}`,
      points: 25,
      source: "official sample inspired",
      status: "published",
    };
  }

  /**
   * Generates a Speaking task for HSK 7-9
   */
  public generateSpeakingQuestion(
    index: number,
    sectionPart: number = 1
  ): ExamQuestion {
    const speakingTasks = [
      {
        promptZh: "【观点阐发】科技进步如何深刻改变了现代人的社交与阅读习惯？请简述你的观点并提供具体例证。（准备时间：1分钟，作答时间：2分30秒）",
        promptEn: "Express your perspective: How has technological advancement fundamentally changed modern reading and communication habits? Elaborate with examples. (Prep: 1 min, Speech: 2.5 min)",
        promptBn: "মৌখিক মতামত প্রকাশ: প্রযুক্তিগত অগ্রগতি কীভাবে মানুষের যোগাযোগ ও বই পড়ার অভ্যাসকে প্রভাবিত করেছে? উদাহরণসহ ব্যাখ্যা করুন। (প্রস্তুতি: ১ মিনিট, বক্তব্য: ২.৫ মিনিট)",
        criteria: ["观点明确、论证充分", "词汇丰富、句式多变", "语音语调自然、停顿连贯"],
      },
      {
        promptZh: "【案例辩论】在经济发展与环境保护之间，发展中国家应如何权衡取舍？请就这一论题陈述你的见解。（准备时间：1分钟，作答时间：2分30秒）",
        promptEn: "Argue a case: How should developing economies balance economic acceleration and ecological preservation? Present your thesis. (Prep: 1 min, Speech: 2.5 min)",
        promptBn: "যুক্তি উপস্থাপন: অর্থনৈতিক উন্নয়ন ও পরিবেশ সংরক্ষণের মধ্যে ভারসাম্য কীভাবে বজায় রাখা উচিত? বক্তব্য উপস্থাপন করুন।",
        criteria: ["逻辑严密、论点鲜明", "使用高级商务与学术用语", "表达流畅清晰"],
      },
    ];

    const task = speakingTasks[index % speakingTasks.length];

    return {
      id: `gen_sp_7-9_${index}`,
      level: "7-9",
      section: "speaking",
      sectionPart,
      questionNumber: index,
      type: "speaking_perspective",
      skill: "speaking",
      difficulty: 5,
      promptZh: task.promptZh,
      promptEn: task.promptEn,
      promptBn: task.promptBn,
      speakingPrompt: task.promptZh,
      evaluationCriteria: task.criteria,
      correctAnswer: "（考查口语流利度、词汇多样性、逻辑连贯性与语音标准度）",
      explanationZh: `口语考查重点：${task.criteria.join("；")}。建议条理清晰，分点论述（例如：首先……其次……最后……）。`,
      explanationEn: `Key speaking evaluation dimensions: ${task.criteria.join("; ")}. Recommend structured discourse markers like '首先...其次...最后...'.`,
      explanationBn: `মৌখিক মূল্যায়ন মাপকাঠি: ${task.criteria.join("; ")}। সুস্পষ্ট কাঠামো এবং প্রমিত চীনা উচ্চারণ বাঞ্ছনীয়।`,
      points: 20,
      source: "official sample inspired",
      status: "published",
    };
  }
}

export const questionGenerator = new QuestionGeneratorService();
