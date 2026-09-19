export type ExamSectionType = "listening" | "reading" | "writing";

export interface ExamQuestion {
  id: string;
  section: ExamSectionType;
  questionNumber: number;
  promptZh: string;
  promptPinyin?: string;
  promptEn?: string;
  promptBn?: string;
  audioText?: string;
  imageEmoji?: string;
  options: {
    key: string;
    textZh: string;
    textPinyin?: string;
    textEn?: string;
    textBn?: string;
  }[];
  correctKey: string;
  explanationZh: string;
  explanationEn: string;
  explanationBn: string;
  // For writing section unscramble:
  unscrambleTokens?: string[];
  correctSentence?: string;
}

export interface HskMockExam {
  id: string;
  hskLevel: "1" | "2" | "3" | "4";
  titleZh: string;
  titleEn: string;
  titleBn: string;
  durationMinutes: number;
  passingScore: number;
  maxScore: number;
  questions: ExamQuestion[];
}

export const HSK_MOCK_EXAMS: HskMockExam[] = [
  {
    id: "hsk1_mock_standard",
    hskLevel: "1",
    titleZh: "HSK 1级全真模拟考试 (卷一)",
    titleEn: "Official HSK Level 1 Mock Exam (Paper A)",
    titleBn: "অফিসিয়াল HSK লেভেল ১ পূর্ণাঙ্গ মক টেস্ট",
    durationMinutes: 20,
    passingScore: 120,
    maxScore: 200,
    questions: [
      // Listening Section
      {
        id: "hsk1_q1",
        section: "listening",
        questionNumber: 1,
        audioText: "听录音：桌子上有一本书和一个杯子。",
        promptZh: "听录音判断：说话人在描述什么？",
        promptPinyin: "Tīng lùyīn pànduàn: shuōhuà rén zài miáoshù shénme?",
        promptEn: "Listen and determine: What is on the table?",
        promptBn: "অডিও শুনে বলুন: টেবিলের উপর কী কী আছে?",
        imageEmoji: "📚 ☕ 🪑",
        options: [
          { key: "A", textZh: "一本书和一个杯子", textPinyin: "yī běn shū hé yī gè bēizi", textEn: "A book and a cup", textBn: "একটি বই ও একটি কাপ" },
          { key: "B", textZh: "两个苹果", textPinyin: "liǎng gè píngguǒ", textEn: "Two apples", textBn: "দুটি আপেল" },
          { key: "C", textZh: "三只小猫", textPinyin: "sān zhī xiǎomāo", textEn: "Three kittens", textBn: "তিনটি বিড়ালছানা" },
        ],
        correctKey: "A",
        explanationZh: "录音明确说：'桌子上有一本书和一个杯子'，因此选项A正确。",
        explanationEn: "The recording clearly stated: '桌子上有一本书和一个杯子' (There is a book and a cup on the table).",
        explanationBn: "অডিওতে স্পষ্টভাবে বলা হয়েছে: '桌子上有一本书和一个杯子' (টেবিলের উপর একটি বই ও একটি কাপ আছে)।",
      },
      {
        id: "hsk1_q2",
        section: "listening",
        questionNumber: 2,
        audioText: "听录音：喂，李老师在学校吗？不在，他在医院。",
        promptZh: "听录音：李老师现在在哪里？",
        promptPinyin: "Tīng lùyīn: Lǐ lǎoshī xiànzài zài nǎlǐ?",
        promptEn: "Listen: Where is Teacher Li right now?",
        promptBn: "শুনুন: শিক্ষক লি এখন কোথায় আছেন?",
        imageEmoji: "🏥 👨‍🏫",
        options: [
          { key: "A", textZh: "在学校", textPinyin: "zài xuéxiào", textEn: "At school", textBn: "বিদ্যালয়ে" },
          { key: "B", textZh: "在医院", textPinyin: "zài yīyuàn", textEn: "At the hospital", textBn: "হাসপাতালে" },
          { key: "C", textZh: "在商店", textPinyin: "zài shāngdiàn", textEn: "At the shop", textBn: "দোকানে" },
        ],
        correctKey: "B",
        explanationZh: "对话中回答：'不在，他在医院'，因此李老师在医院。",
        explanationEn: "The speaker answered: '不在，他在医院' (No, he is at the hospital).",
        explanationBn: "সংলাপে উত্তর দেওয়া হয়েছে: '不在，他在医院' (না, উনি হাসপাতালে আছেন)।",
      },

      // Reading Section
      {
        id: "hsk1_q3",
        section: "reading",
        questionNumber: 3,
        promptZh: "选词填空：我想去商店____几个苹果。",
        promptPinyin: "Xuǎncí tiánkòng: Wǒ xiǎng qù shāngdiàn ____ jǐ gè píngguǒ.",
        promptEn: "Fill in the blank: I want to go to the store to ____ some apples.",
        promptBn: "শূন্যস্থান পূরণ করুন: আমি দোকানে গিয়ে কিছু আপেল ____ চাই।",
        options: [
          { key: "A", textZh: "买 (mǎi)", textEn: "buy", textBn: "কিনতে" },
          { key: "B", textZh: "坐 (zuò)", textEn: "sit", textBn: "বসতে" },
          { key: "C", textZh: "听 (tīng)", textEn: "listen", textBn: "শুনতে" },
        ],
        correctKey: "A",
        explanationZh: "在商店通常是'买'(mǎi)东西，'去商店买苹果'搭配最符合逻辑。",
        explanationEn: "'买' (mǎi - to buy) fits going to a shop to purchase apples.",
        explanationBn: "দোকানে গিয়ে আপেল 'কেনা' (买 - mǎi) সবচেয়ে সঙ্গতিপূর্ণ।",
      },
      {
        id: "hsk1_q4",
        section: "reading",
        questionNumber: 4,
        promptZh: "选择正确的对应回答：“谢谢你！”—— “________”",
        promptPinyin: "“Xièxie nǐ!” —— “________”",
        promptEn: "Choose the standard polite response to 'Thank you!':",
        promptBn: "'ধন্যবাদ!' এর উত্তরে মার্জিত জবাব কোনটি?",
        options: [
          { key: "A", textZh: "再见！", textPinyin: "Zàijiàn!", textEn: "Goodbye!", textBn: "বিদায়!" },
          { key: "B", textZh: "不客气！", textPinyin: "Bú kèqi!", textEn: "You are welcome!", textBn: "স্বাগতম / কোনো ব্যাপার না!" },
          { key: "C", textZh: "没关系！", textPinyin: "Méi guānxi!", textEn: "It doesn't matter (apology response)", textBn: "সমস্যা নেই (ভুলের ক্ষমা প্রার্থনায়)" },
        ],
        correctKey: "B",
        explanationZh: "回答'谢谢你'的标准中文礼貌回应是'不客气'。",
        explanationEn: "The standard response to '谢谢' (Thank you) is '不客气' (You're welcome).",
        explanationBn: "'ধন্যবাদ' (谢谢)-র ভদ্রোচিত জবাব হলো '不客气' (স্বাগতম)।",
      },

      // Writing Section (Word arrangement)
      {
        id: "hsk1_q5",
        section: "writing",
        questionNumber: 5,
        promptZh: "连词成句：将下列词语按正确语序排列成完整句子。",
        promptPinyin: "Lián cí chéng jù: Jiāng xiàliè cíyǔ àn zhèngquè yǔxù páiliè.",
        promptEn: "Unscramble: Arrange these tokens into a grammatically correct sentence.",
        promptBn: "শব্দগুলো সাজিয়ে সঠিক ব্যাকরণসম্মত বাক্য তৈরি করুন:",
        unscrambleTokens: ["学生", "是", "我", "中国"],
        correctSentence: "我是中国学生",
        options: [
          { key: "A", textZh: "我是中国学生。", textPinyin: "Wǒ shì Zhōngguó xuésheng.", textEn: "I am a Chinese student.", textBn: "আমি একজন চীনা শিক্ষার্থী।" },
          { key: "B", textZh: "中国学生是我。", textPinyin: "Zhōngguó xuésheng shì wǒ.", textEn: "Chinese student is me.", textBn: "চীনা শিক্ষার্থী হলো আমি।" },
          { key: "C", textZh: "学生我是中国。", textPinyin: "Xuésheng wǒ shì Zhōngguó.", textEn: "Incorrect word order", textBn: "ভুল ক্রম" },
        ],
        correctKey: "A",
        explanationZh: "标准主语+动词+定语+宾语语序：我 (主语) + 是 (谓语动词) + 中国 (定语) + 学生 (宾语)。",
        explanationEn: "Standard Chinese SVO word order: Subject (我) + Verb (是) + Modifier (中国) + Object (学生).",
        explanationBn: "চাইনিজ ব্যাকরণের স্বাভাবিক ক্রম: কর্তা (我) + ক্রিয়া (是) + বিশেষক (中国) + কর্ম (学生)।",
      },
    ],
  },
  {
    id: "hsk2_mock_standard",
    hskLevel: "2",
    titleZh: "HSK 2级全真模拟考试 (卷一)",
    titleEn: "Official HSK Level 2 Mock Exam (Paper A)",
    titleBn: "অফিসিয়াল HSK লেভেল ২ পূর্ণাঙ্গ মক টেস্ট",
    durationMinutes: 25,
    passingScore: 120,
    maxScore: 200,
    questions: [
      {
        id: "hsk2_q1",
        section: "listening",
        questionNumber: 1,
        audioText: "听录音：外面正在下雨，你出门记得带一把伞。",
        promptZh: "听录音：说话人建议对方带什么？",
        promptPinyin: "Tīng lùyīn: shuōhuà rén jiànyì duìfāng dài shénme?",
        promptEn: "Listen: What did the speaker suggest taking?",
        promptBn: "অডিও শুনে বলুন: বক্তা কী সাথে নিয়ে যাওয়ার পরামর্শ দিলেন?",
        imageEmoji: "🌧️ ☂️",
        options: [
          { key: "A", textZh: "一把伞", textPinyin: "yī bǎ sǎn", textEn: "An umbrella", textBn: "একটি ছাতা" },
          { key: "B", textZh: "一本书", textPinyin: "yī běn shū", textEn: "A book", textBn: "একটি বই" },
          { key: "C", textZh: "一件大衣", textPinyin: "yī jiàn dàyī", textEn: "A coat", textBn: "একটি কোট" },
        ],
        correctKey: "A",
        explanationZh: "录音提到'外面正在下雨，出门记得带一把伞'，因此选A。",
        explanationEn: "The audio says '记得带一把伞' (remember to take an umbrella).",
        explanationBn: "অডিওতে স্পষ্টভাবে বলা হয়েছে: ছাতা (一把伞) নিয়ে যেতে।",
      },
      {
        id: "hsk2_q2",
        section: "reading",
        questionNumber: 2,
        promptZh: "选词填空：虽然这件衣服很贵，____质量非常好。",
        promptPinyin: "Suīrán zhè jiàn yīfu hěn guì, ____ zhìliàng fēicháng hǎo.",
        promptEn: "Choose the conjunction pair with 虽然 (Although...):",
        promptBn: "সঠিক সংযোজক শব্দ বেছে নিন (যদিও...তবুও):",
        options: [
          { key: "A", textZh: "但是 (dànshì)", textEn: "but / however", textBn: "কিন্তু / তবুও" },
          { key: "B", textZh: "因为 (yīnwèi)", textEn: "because", textBn: "কারণ" },
          { key: "C", textZh: "所以 (suǒyǐ)", textEn: "so / therefore", textBn: "তাই" },
        ],
        correctKey: "A",
        explanationZh: "固定搭配'虽然……但是……'表示让步转折关系。",
        explanationEn: "The conjunction pattern '虽然……但是……' (Although... but...) denotes contrast.",
        explanationBn: "চাইনিজ ব্যাকরণে '虽然……但是……' (যদিও... তবুও...) জোড়া হিসেবে ব্যবহৃত হয়।",
      },
    ],
  },
];
