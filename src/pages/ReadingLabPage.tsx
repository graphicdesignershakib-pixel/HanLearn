import React, { useState, useEffect } from "react";
import { audioService } from "../services/audioService";
import { bengaliService } from "../services/bengaliService";
import { mistakeService } from "../services/mistakeService";
import { gamificationService } from "../services/gamificationService";
import { chineseTextParser, ParsedToken } from "../services/chineseTextParser";
import { CharacterTooltip } from "../components/reading/CharacterTooltip";
import { FocusReadingOverlay, ReadingPassageData } from "../components/reading/FocusReadingOverlay";
import {
  BookOpen,
  Volume2,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Sparkles,
  HelpCircle,
  Type,
  Maximize2,
  RotateCcw,
  Languages,
} from "lucide-react";
import { HskLevel } from "../types/hsk";

export const READING_PASSAGES: ReadingPassageData[] = [
  {
    id: "rp-1",
    hskLevel: "1",
    title: "My Family & Daily Morning",
    chineseTitle: "我和我的家",
    pinyinTitle: "Wǒ hé wǒ de jiā",
    paragraphs: [
      {
        chinese: "我家有四口人：爸爸、妈妈、哥哥和我。我们住在北京。",
        pinyin: "Wǒ jiā yǒu sì kǒu rén: bàba, māmā, gēge hé wǒ. Wǒmen zhù zài Běijīng.",
        english: "There are four people in my family: dad, mom, older brother, and me. We live in Beijing.",
        bengali: "আমার পরিবারে চারজন সদস্য: বাবা, মা, বড় ভাই এবং আমি। আমরা বেইজিংয়ে থাকি।",
      },
      {
        chinese: "爸爸每天早上喝茶，妈妈喜欢吃苹果。我是学生，今天星期一，我要去学校学习汉语。",
        pinyin: "Bàba měitiān zǎoshang hē chá, māmā xǐhuan chī píngguǒ. Wǒ shì xuésheng, jīntiān xīngqīyī, wǒ yào qù xuéxiào xuéxí hànyǔ.",
        english: "Dad drinks tea every morning, and mom likes eating apples. I am a student. Today is Monday, and I am going to school to study Chinese.",
        bengali: "বাবা প্রতিদিন সকালে চা পান করেন, মা আপেল খেতে পছন্দ করেন। আমি একজন ছাত্র, আজকে সোমবার, আমি চাইনিজ শিখতে স্কুলে যাচ্ছি।",
      },
    ],
    questions: [
      {
        id: "rp-1-q1",
        prompt: "他们一家住在哪里？(Where does this family live?)",
        options: ["上海 (Shanghai)", "北京 (Beijing)", "广州 (Guangzhou)", "成都 (Chengdu)"],
        correctIndex: 1,
        explanation: "The passage states: '我们住在北京' (We live in Beijing).",
      },
      {
        id: "rp-1-q2",
        prompt: "妈妈喜欢吃什么？(What does Mom like to eat?)",
        options: ["米饭 (Rice)", "面条 (Noodles)", "苹果 (Apples)", "香蕉 (Bananas)"],
        correctIndex: 2,
        explanation: "The text says: '妈妈喜欢吃苹果' (Mom likes eating apples).",
      },
    ],
  },
  {
    id: "rp-2",
    hskLevel: "2",
    title: "A Weekend Trip to the Zoo",
    chineseTitle: "周末去动物园",
    pinyinTitle: "Zhōumò qù dòngwùyuán",
    paragraphs: [
      {
        chinese: "上个星期天，天气非常好，我和朋友一起去动物园看大熊猫。",
        pinyin: "Shàng gè xīngqītiān, tiānqì fēicháng hǎo, wǒ hé péngyǒu yìqǐ qù dòngwùyuán kàn dà xióngmāo.",
        english: "Last Sunday, the weather was exceptionally good, so my friend and I went to the zoo together to see giant pandas.",
        bengali: "গত রবিবার আবহাওয়া খুব সুন্দর ছিল, তাই আমি ও আমার বন্ধু একসাথে চিড়িয়াখানায় বিশাল পান্ডা দেখতে গিয়েছিলাম।",
      },
      {
        chinese: "动物园里的人很多。大熊猫胖胖的，黑白相间，正在吃新鲜的竹子。它们非常可爱，我们拍了很多照片。",
        pinyin: "Dòngwùyuán lǐ de rén hěn duō. Dà xióngmāo pàngpàng de, hēi bái xiāngjiàn, zhèngzài chī xīnxiān de zhúzi. Tāmen fēicháng kě'ài, wǒmen pāi le hěn duō zhàopiàn.",
        english: "There were a lot of people in the zoo. The giant pandas were chubby and black-and-white, eating fresh bamboo. They were so cute; we took many photos.",
        bengali: "চিড়িয়াখানায় প্রচুর মানুষ ছিল। পান্ডাগুলো গোলগাল ও সাদা-কালো, তারা তাজা বাঁশ খাচ্ছিল। তারা ভীষণ মিষ্টি, আমরা অনেক ছবি তুলেছি।",
      },
    ],
    questions: [
      {
        id: "rp-2-q1",
        prompt: "他们去看什么动物了？(What animal did they go to see?)",
        options: ["大象 (Elephant)", "大熊猫 (Giant panda)", "老虎 (Tiger)", "猴子 (Monkey)"],
        correctIndex: 1,
        explanation: "They went specifically to see giant pandas ('看大熊猫').",
      },
      {
        id: "rp-2-q2",
        prompt: "大熊猫在吃什么？(What were the pandas eating?)",
        options: ["水果 (Fruit)", "竹子 (Bamboo)", "米饭 (Rice)", "面包 (Bread)"],
        correctIndex: 1,
        explanation: "The text says they were eating fresh bamboo ('正在吃新鲜的竹子').",
      },
    ],
  },
  {
    id: "rp-3",
    hskLevel: "3",
    title: "Tea Culture and the Four Seasons",
    chineseTitle: "中国茶文化与四季",
    pinyinTitle: "Zhōngguó chá wénhuà yǔ sìjì",
    paragraphs: [
      {
        chinese: "中国是茶的故乡。几千年来，中国人不仅把茶当作日常饮品，而且形成了独特的茶文化。",
        pinyin: "Zhōngguó shì chá de gùxiāng. Jǐ qiān nián lái, Zhōngguórén bùjǐn bǎ chá dàngzuò rìcháng yǐnpǐn, érqiě xíngchéng le dútè de chá wénhuà.",
        english: "China is the homeland of tea. For thousands of years, Chinese people have not only regarded tea as a daily beverage, but also formed a unique tea culture.",
        bengali: "চীন হলো চায়ের আদিভূমি। হাজার হাজার বছর ধরে চীনারা চাকে শুধু পানীয় হিসেবে নয়, বরং অনন্য চা সংস্কৃতির রূপ দিয়েছে।",
      },
      {
        chinese: "春天人们喜欢喝花茶，夏天喝绿茶能解暑，秋天喝乌龙茶滋润身体，而冬天喝红茶则让人感到温暖。",
        pinyin: "Chūntiān rénmen xǐhuan hē huāchá, xiàtiān hē lǜchá néng jiěshǔ, qiūtiān hē wūlóngchá zīrùn shēntǐ, ér dōngtiān hē hóngchá zé ràng rén gǎndào wēnnuǎn.",
        english: "In spring people enjoy scented floral tea, in summer green tea relieves heat, in autumn oolong nourishes the body, and in winter black tea brings warmth.",
        bengali: "বসন্তে মানুষ সুবাসিত ফুলের চা পছন্দ করে, গ্রীষ্মে গ্রিন টি ক্লান্তি দূর করে, শরতে উলং চা শরীর সতেজ রাখে এবং শীতে ব্ল্যাক টি উষ্ণতা যোগায়।",
      },
    ],
    questions: [
      {
        id: "rp-3-q1",
        prompt: "冬天人们通常喜欢喝什么茶？(What tea do people usually enjoy in winter?)",
        options: ["花茶 (Floral tea)", "绿茶 (Green tea)", "红茶 (Black tea)", "白茶 (White tea)"],
        correctIndex: 2,
        explanation: "The text highlights: '冬天喝红茶则让人感到温暖' (In winter black tea makes people feel warm).",
      },
    ],
  },
  {
    id: "rp-4",
    hskLevel: "4",
    title: "High-Speed Rail & Travel In China",
    chineseTitle: "中国高铁与便捷生活",
    pinyinTitle: "Zhōngguó gāotiě yǔ biànjié shēnghuó",
    paragraphs: [
      {
        chinese: "在现代中国，高速铁路已经成为人们城际出行的首选交通工具。它不仅速度飞快、准时安全，而且车厢内部十分舒适整洁。",
        pinyin: "Zài xiàndài Zhōngguó, gāosù tiělù yǐjīng chéngwéi rénmen chéngjì chūxíng de shǒuxuǎn jiāotōng gōngjù. Tā bùjǐn sùdù fēikuài, zhǔnshí ānquán, érqiě chēxiāng nèibù shífēn shūshì zhěngjié.",
        english: "In modern China, high-speed rail has become people's top choice for intercity travel. It is not only lightning-fast, punctual, and safe, but the carriages are also clean and comfortable.",
        bengali: "আধুনিক চীনে হাইস্পিড ট্রেন দূরপাল্লার ভ্রমণে মানুষের প্রথম পছন্দ। এটি দ্রুতগতির, সময়ানুবর্তী ও নিরাপদ, এবং বগিগুলো অত্যন্ত আরামদায়ক।",
      },
      {
        chinese: "如今乘客只需要一部智能手机，便可在手机应用程序上完成选座、购票和改签，刷居民身份证即可快速进站，极大提升了出行效率。",
        pinyin: "Rújīn chéngkè zhǐ xūyào yí bù zhìnéng shǒujī, biàn kě zài shǒujī yìngyòng chéngxù shang wánchéng xuǎnzuò, gòupiào hé gǎiqiān, shuā jūmín shēnfènzhèng jíkě kuàisù jìnzhàn, jídà tíshēng le chūxíng xiàolǜ.",
        english: "Nowadays passengers only need a smartphone to select seats, buy, and change tickets via mobile apps, and swipe their ID cards to enter stations quickly, greatly boosting travel efficiency.",
        bengali: "বর্তমানে যাত্রীদের শুধু একটি স্মার্টফোন থাকলেই চলে, অ্যাপে সিট নির্বাচন ও টিকিট কাটা যায় এবং আইডি কার্ড স্ক্যান করে স্টেশনে দ্রুত প্রবেশ করা যায়।",
      },
    ],
    questions: [
      {
        id: "rp-4-q1",
        prompt: "乘客如今如何快速进站乘车？(How do passengers quickly enter the train station?)",
        options: [
          "出示纸质车票 (Show paper ticket)",
          "刷身份证 (Swipe national ID)",
          "携带护照原件 (Bring physical passport)",
          "现金支付买票 (Pay in cash)",
        ],
        correctIndex: 1,
        explanation: "The passage notes: '刷居民身份证即可快速进站' (Swipe resident ID cards to quickly enter stations).",
      },
    ],
  },
];

export const ReadingLabPage: React.FC = () => {
  const [selectedPassageIndex, setSelectedPassageIndex] = useState(0);
  const [showPinyin, setShowPinyin] = useState(true);
  const [showEnglish, setShowEnglish] = useState(false);
  const [showBengali, setShowBengali] = useState(false);
  const [fontSize, setFontSize] = useState<"normal" | "large" | "xlarge">("normal");
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [isBn, setIsBn] = useState(bengaliService.getLanguage() === "bn");

  // Focus Mode state
  const [isFocusMode, setIsFocusMode] = useState(false);

  // Active token for inline character popup
  const [activeToken, setActiveToken] = useState<ParsedToken | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number } | undefined>(undefined);

  const currentPassage = READING_PASSAGES[selectedPassageIndex % READING_PASSAGES.length];

  useEffect(() => {
    const unsub = bengaliService.subscribe(() => setIsBn(bengaliService.getLanguage() === "bn"));
    return unsub;
  }, []);

  // Keyboard shortcut listener: 'F' toggles Focus Mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.isComposing
      ) {
        return;
      }

      if (e.key === "f" || e.key === "F") {
        setIsFocusMode((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSpeakText = (text: string) => {
    audioService.speakText(text);
  };

  const handleTokenClick = (e: React.MouseEvent, token: ParsedToken) => {
    e.stopPropagation();
    if (!token.isChinese) return;

    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      top: rect.bottom + 8,
      left: rect.left + rect.width / 2,
    });
    setActiveToken(token);
    audioService.speakText(token.text);
  };

  const handleAnswerQuestion = (qId: string, choiceIdx: number, correctIdx: number) => {
    setQuizAnswers((prev) => ({ ...prev, [qId]: choiceIdx }));
    if (choiceIdx !== correctIdx) {
      const q = currentPassage.questions?.find((x) => x.id === qId);
      mistakeService.addMistake({
        sourceModule: "exam",
        skill: "reading",
        hskLevel: currentPassage.hskLevel,
        questionPrompt: `[Reading: ${currentPassage.title}] ${q?.prompt}`,
        userAnswer: q?.options[choiceIdx] || "",
        correctAnswer: q?.options[correctIdx] || "",
        explanation: q?.explanation || "",
      });
    } else {
      gamificationService.addXp(15, "Correct reading comprehension answer");
    }
  };

  const fontSizeClasses = {
    normal: "text-base md:text-lg leading-loose",
    large: "text-xl md:text-2xl leading-loose",
    xlarge: "text-2xl md:text-3xl leading-loose",
  }[fontSize];

  return (
    <div
      onClick={() => setActiveToken(null)}
      className="max-w-4xl mx-auto space-y-6 pb-12"
    >
      {/* Banner & Control Header */}
      <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 md:p-8 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              <BookOpen size={14} />
              <span>GRADED READING LAB</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight">
              {isBn ? "পঠন ও অনুধাবন ল্যাব" : "Graded Reading Comprehension"}
            </h1>
            <p className="text-xs md:text-sm text-neutral-600">
              {isBn
                ? "লেভেল অনুযায়ী সাজানো অনুচ্ছেদ, পিনয়িন নিয়ন্ত্রণ, ক্যারেক্টার বিশ্লেষণ ও পূর্ণপর্দা ফোকাস মোড।"
                : "HSK level-tailored reading texts with inline character parsing, pinyin toggle, audio narration, and full-screen Focus Mode."}
            </p>
          </div>

          {/* Focus Mode Trigger CTA */}
          <button
            type="button"
            onClick={() => setIsFocusMode(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-neutral-900 hover:bg-black text-white text-xs font-bold shadow-sm transition-all hover:scale-[1.02] cursor-pointer shrink-0"
            title="Open distraction-free full-screen reader (Hotkey: F)"
          >
            <Maximize2 size={15} className="text-emerald-400" />
            <span>{isBn ? "ফোকাস মোড" : "Focus Mode"}</span>
            <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 text-[10px] font-mono border border-neutral-700">
              F
            </kbd>
          </button>
        </div>

        {/* Passage Switcher Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 border-t border-neutral-100">
          {READING_PASSAGES.map((p, idx) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setSelectedPassageIndex(idx);
                setQuizAnswers({});
                setActiveToken(null);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                selectedPassageIndex === idx
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              <span className="px-1.5 py-0.5 rounded bg-black/10 text-[10px]">
                HSK {p.hskLevel}
              </span>
              <span>{p.chineseTitle}</span>
              <span className="hidden sm:inline font-normal opacity-80">· {p.title}</span>
            </button>
          ))}
        </div>

        {/* Display Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Pinyin toggle */}
            <button
              type="button"
              onClick={() => setShowPinyin(!showPinyin)}
              className={`px-2.5 py-1.5 rounded-xl border font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                showPinyin
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100"
              }`}
            >
              {showPinyin ? <EyeOff size={13} /> : <Eye size={13} />}
              <span>{showPinyin ? (isBn ? "পিনয়িন বন্ধ" : "Pinyin: ON") : (isBn ? "পিনয়িন চালু" : "Pinyin: OFF")}</span>
            </button>

            {/* Font Size Step */}
            <div className="flex items-center rounded-xl border border-neutral-200 bg-neutral-50 p-0.5">
              {(["normal", "large", "xlarge"] as const).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setFontSize(size)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
                    fontSize === size
                      ? "bg-white text-neutral-900 shadow-2xs font-bold"
                      : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  {size === "normal" ? "A" : size === "large" ? "A+" : "A++"}
                </button>
              ))}
            </div>

            {/* English translation toggle */}
            <button
              type="button"
              onClick={() => setShowEnglish(!showEnglish)}
              className={`px-2.5 py-1.5 rounded-xl border font-semibold transition-colors cursor-pointer ${
                showEnglish
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100"
              }`}
            >
              English: {showEnglish ? "ON" : "OFF"}
            </button>

            {/* Bengali translation toggle */}
            <button
              type="button"
              onClick={() => setShowBengali(!showBengali)}
              className={`px-2.5 py-1.5 rounded-xl border font-semibold transition-colors cursor-pointer font-bangla ${
                showBengali
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100"
              }`}
            >
              বাংলা: {showBengali ? "চালু" : "বন্ধ"}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSpeakText(currentPassage.paragraphs.map((p) => p.chinese).join(" "))}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 font-bold hover:bg-emerald-100 transition-colors cursor-pointer border border-emerald-200"
            >
              <Volume2 size={14} />
              <span>{isBn ? "পুরো পাঠ শুনুন" : "Read Entire Passage"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reading Article Body */}
      <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 md:p-10 space-y-8 shadow-xs">
        {/* Title Header */}
        <div className="border-b border-neutral-100 pb-5 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              HSK Level {currentPassage.hskLevel} Graded Reader
            </div>
            <button
              type="button"
              onClick={() => setIsFocusMode(true)}
              className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 flex items-center gap-1 cursor-pointer"
            >
              <Maximize2 size={13} />
              <span>{isBn ? "ফোকাস মোডে পড়ুন" : "Read in Focus Mode"}</span>
            </button>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold font-hanzi text-neutral-900">
            {currentPassage.chineseTitle}
          </h2>

          {showPinyin && (
            <div className="text-xs font-mono text-neutral-500">
              {currentPassage.pinyinTitle}
            </div>
          )}

          <div className="text-xs text-neutral-400 flex items-center gap-1.5 pt-1">
            <Sparkles size={12} className="text-amber-500" />
            <span>
              {isBn
                ? "যেকোনো শব্দ বা ক্যারেক্টারে ক্লিক করে বিশদ অর্থ ও উচ্চারণ দেখুন।"
                : "Interactive text: Click any word or character for pronunciation & bilingual definition."}
            </span>
          </div>
        </div>

        {/* Paragraphs with Automatic Character Parsing */}
        <div className="space-y-8">
          {currentPassage.paragraphs.map((para, pIdx) => {
            const tokens = chineseTextParser.parseText(para.chinese);

            return (
              <div
                key={pIdx}
                className="p-5 md:p-6 rounded-2xl bg-neutral-50/70 border border-neutral-100 hover:border-neutral-200 transition-colors space-y-3 group"
              >
                {/* Chinese parsed interactive text */}
                <div className={`font-hanzi ${fontSizeClasses} text-neutral-900 flex flex-wrap items-baseline gap-x-1 gap-y-1`}>
                  {tokens.map((tok) => {
                    if (!tok.isChinese) {
                      return (
                        <span key={tok.id} className="opacity-70 select-none">
                          {tok.text}
                        </span>
                      );
                    }

                    const isSelected = activeToken?.text === tok.text;

                    return (
                      <span
                        key={tok.id}
                        onClick={(e) => handleTokenClick(e, tok)}
                        className={`inline-flex flex-col items-center group cursor-pointer transition-all rounded-md px-1 py-0.5 ${
                          isSelected
                            ? "bg-emerald-100 text-emerald-900 ring-2 ring-emerald-500 font-bold"
                            : "hover:bg-emerald-50 hover:text-emerald-800"
                        }`}
                        title={tok.pinyin ? `${tok.pinyin} - ${tok.english || ""}` : tok.text}
                      >
                        {showPinyin && tok.pinyin && (
                          <span className="font-mono text-[11px] leading-none text-rose-600 select-none pb-0.5">
                            {tok.pinyin}
                          </span>
                        )}
                        <span className="border-b border-dashed border-neutral-300 group-hover:border-emerald-500">
                          {tok.text}
                        </span>
                      </span>
                    );
                  })}
                </div>

                {/* Subtitle Pinyin (if enabled) */}
                {showPinyin && (
                  <div className="font-mono text-xs text-neutral-400 leading-normal pt-1">
                    {para.pinyin}
                  </div>
                )}

                {/* English translation */}
                {showEnglish && (
                  <div className="text-xs text-neutral-600 italic pt-1 border-t border-neutral-200/60">
                    "{para.english}"
                  </div>
                )}

                {/* Bengali translation */}
                {showBengali && para.bengali && (
                  <div className="text-xs text-emerald-700 font-bangla pt-0.5">
                    "{para.bengali}"
                  </div>
                )}

                {/* Listen to paragraph action */}
                <div className="flex items-center justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => handleSpeakText(para.chinese)}
                    className="flex items-center gap-1 text-xs text-neutral-400 hover:text-emerald-700 transition-colors cursor-pointer p-1 rounded-md hover:bg-neutral-200/60"
                    title="Listen to this paragraph"
                  >
                    <Volume2 size={14} />
                    <span className="text-[11px] font-medium">{isBn ? "শুনুন" : "Listen"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comprehension Quiz Section */}
        {currentPassage.questions && currentPassage.questions.length > 0 && (
          <div className="pt-8 border-t border-neutral-100 space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={16} className="text-emerald-600" />
              <span>{isBn ? "পঠন বোধগম্যতা কুইজ" : "Reading Comprehension Questions"}</span>
            </h3>

            <div className="space-y-4">
              {currentPassage.questions.map((q) => {
                const answeredIdx = quizAnswers[q.id];
                const isAnswered = answeredIdx !== undefined;

                return (
                  <div
                    key={q.id}
                    className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-3"
                  >
                    <div className="text-xs sm:text-sm font-bold text-neutral-900 font-hanzi">
                      {q.prompt}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, oIdx) => {
                        const isChosen = answeredIdx === oIdx;
                        let btnClass = "border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-800";

                        if (isAnswered) {
                          if (oIdx === q.correctIndex) {
                            btnClass = "border-emerald-500 bg-emerald-50 text-emerald-950 font-bold";
                          } else if (isChosen) {
                            btnClass = "border-rose-500 bg-rose-50 text-rose-950 font-bold";
                          }
                        }

                        return (
                          <button
                            key={opt}
                            type="button"
                            disabled={isAnswered}
                            onClick={() => handleAnswerQuestion(q.id, oIdx, q.correctIndex)}
                            className={`p-3 rounded-xl border text-xs text-left transition-colors cursor-pointer flex items-center justify-between ${btnClass}`}
                          >
                            <span>{opt}</span>
                            {isAnswered && oIdx === q.correctIndex && (
                              <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                            )}
                            {isAnswered && isChosen && oIdx !== q.correctIndex && (
                              <XCircle size={15} className="text-rose-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && (
                      <div className="text-[11px] text-neutral-600 pt-1 border-t border-neutral-200/60">
                        <strong className="text-neutral-700">Explanation: </strong>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Inline Tooltip Popover in standard view */}
      {activeToken && (
        <CharacterTooltip
          token={activeToken}
          position={tooltipPos}
          onClose={() => setActiveToken(null)}
          isBn={isBn}
        />
      )}

      {/* Full-Screen Focus Mode Overlay */}
      {isFocusMode && (
        <FocusReadingOverlay
          passage={currentPassage}
          passages={READING_PASSAGES}
          onSelectPassage={(idx) => {
            setSelectedPassageIndex(idx);
            setQuizAnswers({});
          }}
          currentIndex={selectedPassageIndex}
          onClose={() => setIsFocusMode(false)}
          isBn={isBn}
        />
      )}
    </div>
  );
};
