import React, { useState, useEffect } from "react";
import {
  PINYIN_INITIALS,
  PINYIN_FINALS,
  TONE_CONTOURS,
  TONE_PAIRS,
  PinyinInitial,
  PinyinFinal,
} from "../services/pinyinData";
import { audioService } from "../services/audioService";
import { bengaliService } from "../services/bengaliService";
import { mistakeService } from "../services/mistakeService";
import {
  Volume2,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Activity,
  ArrowRight,
  BookOpen,
} from "lucide-react";

export const PinyinLabPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"initials" | "finals" | "tones" | "eartraining">("initials");
  const [selectedInitialCategory, setSelectedInitialCategory] = useState<string>("All");
  const [selectedFinalCategory, setSelectedFinalCategory] = useState<string>("All");
  const [isBn, setIsBn] = useState(bengaliService.getLanguage() === "bn");

  // Ear training state
  const quizSyllables = [
    { text: "mā", tone: 1, base: "ma" },
    { text: "tā", tone: 1, base: "ta" },
    { text: "hǎo", tone: 3, base: "hao" },
    { text: "nǐ", tone: 3, base: "ni" },
    { text: "dà", tone: 4, base: "da" },
    { text: "bù", tone: 4, base: "bu" },
    { text: "rén", tone: 2, base: "ren" },
    { text: "lái", tone: 2, base: "lai" },
  ];
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<"correct" | "wrong" | null>(null);
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => {
    const unsub = bengaliService.subscribe(() => setIsBn(bengaliService.getLanguage() === "bn"));
    return unsub;
  }, []);

  const currentQuiz = quizSyllables[quizIndex % quizSyllables.length];

  const handlePlayAudio = (text: string) => {
    audioService.speakText(text);
  };

  const handleQuizChoice = (tone: number) => {
    if (tone === currentQuiz.tone) {
      setQuizFeedback("correct");
      setQuizScore((s) => s + 1);
      setTimeout(() => {
        setQuizFeedback(null);
        setQuizIndex((i) => i + 1);
      }, 1000);
    } else {
      setQuizFeedback("wrong");
      mistakeService.addMistake({
        sourceModule: "sentence",
        skill: "tone",
        hskLevel: "1",
        pinyin: currentQuiz.text,
        questionPrompt: `Discriminate tone for syllable: ${currentQuiz.text}`,
        userAnswer: `Tone ${tone}`,
        correctAnswer: `Tone ${currentQuiz.tone} (${currentQuiz.text})`,
        explanation: `Pay close attention to pitch contours: 1st is high flat, 2nd rises, 3rd dips, 4th drops sharply.`,
      });
    }
  };

  const filteredInitials = selectedInitialCategory === "All"
    ? PINYIN_INITIALS
    : PINYIN_INITIALS.filter((i) => i.category === selectedInitialCategory);

  const filteredFinals = selectedFinalCategory === "All"
    ? PINYIN_FINALS
    : PINYIN_FINALS.filter((f) => f.category === selectedFinalCategory);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 md:p-8 space-y-4 shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200">
            <Volume2 size={14} />
            <span>PINYIN & PHONETICS LAB</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight">
            {isBn ? "পিনয়িন ও উচ্চারণ গবেষণাগার" : "Master Pinyin & Tone Contours"}
          </h1>
          <p className="text-xs md:text-sm text-neutral-600 max-w-2xl leading-relaxed">
            {isBn
              ? "২৩টি ইনিশিয়াল (声母), ২৪টি ফাইনাল (韵母), ৫টি টোন পিচ কনট্যুর এবং কানের শোনার অনুশীলন।"
              : "Develop crystal-clear Chinese pronunciation with acoustic feedback, International Phonetic Alphabet (IPA) guides, and tone ear-training."}
          </p>
        </div>

        {/* Tab Navigator */}
        <div className="flex items-center gap-2 pt-2 border-t border-neutral-100 overflow-x-auto">
          {[
            { id: "initials", label: isBn ? "ইনিশিয়ালস (声母)" : "Initials (23)", desc: "Consonants" },
            { id: "finals", label: isBn ? "ফাইনালস (韵母)" : "Finals (24)", desc: "Vowels & Nasals" },
            { id: "tones", label: isBn ? "টোন ও সন্ধি নিয়ম" : "Tones & Sandhi", desc: "Pitch Contours" },
            { id: "eartraining", label: isBn ? "কানের অনুশীলন কুইজ" : "Tone Ear Training", desc: "Test Reflexes" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                activeTab === tab.id
                  ? "bg-neutral-900 text-white shadow-xs"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: INITIALS */}
      {activeTab === "initials" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="font-bold text-neutral-600 shrink-0">Articulation Category:</span>
            {["All", "Labial", "Alveolar", "Velar", "Palatal", "Retroflex", "Dental Sibilant", "Semi-vowel"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedInitialCategory(cat)}
                className={`px-3 py-1 rounded-lg font-semibold cursor-pointer shrink-0 transition-colors ${
                  selectedInitialCategory === cat
                    ? "bg-red-600 text-white"
                    : "bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredInitials.map((init) => (
              <div
                key={init.letter}
                className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-xs hover:border-red-300 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-neutral-900 font-mono">
                      {init.letter}
                    </span>
                    <span className="text-xs text-neutral-400 font-mono">
                      {init.ipa}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600">
                    {init.category}
                  </span>
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed">
                  {init.description}
                </p>

                <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="font-hanzi font-bold text-neutral-900 text-base">{init.exampleHanzi}</span>
                    <span className="font-mono text-red-600 font-bold">{init.examplePinyin}</span>
                    <span className="text-neutral-500 text-[11px]">({init.exampleEnglish})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handlePlayAudio(init.exampleHanzi)}
                    className="p-1.5 rounded-lg bg-neutral-50 hover:bg-red-50 text-neutral-700 hover:text-red-600 border border-neutral-200 transition-colors cursor-pointer"
                    title="Pronounce"
                  >
                    <Volume2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: FINALS */}
      {activeTab === "finals" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="font-bold text-neutral-600 shrink-0">Vowel Type:</span>
            {["All", "Simple", "Compound", "Front Nasal (-n)", "Back Nasal (-ng)"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedFinalCategory(cat)}
                className={`px-3 py-1 rounded-lg font-semibold cursor-pointer shrink-0 transition-colors ${
                  selectedFinalCategory === cat
                    ? "bg-red-600 text-white"
                    : "bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredFinals.map((fin) => (
              <div
                key={fin.letter}
                className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-xs hover:border-red-300 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-neutral-900 font-mono">
                      {fin.letter}
                    </span>
                    <span className="text-xs text-neutral-400 font-mono">
                      {fin.ipa}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600">
                    {fin.category}
                  </span>
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed">
                  {fin.description}
                </p>

                <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="font-hanzi font-bold text-neutral-900 text-base">{fin.exampleHanzi}</span>
                    <span className="font-mono text-red-600 font-bold">{fin.examplePinyin}</span>
                    <span className="text-neutral-500 text-[11px]">({fin.exampleEnglish})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handlePlayAudio(fin.exampleHanzi)}
                    className="p-1.5 rounded-lg bg-neutral-50 hover:bg-red-50 text-neutral-700 hover:text-red-600 border border-neutral-200 transition-colors cursor-pointer"
                    title="Pronounce"
                  >
                    <Volume2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TONE CONTOURS & SANDHI */}
      {activeTab === "tones" && (
        <div className="space-y-6">
          {/* Tone Contour Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {TONE_CONTOURS.map((t) => (
              <div
                key={t.tone}
                className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-400">Tone {t.tone}</span>
                    <span className="text-sm font-extrabold font-mono text-red-600">{t.pitchRange}</span>
                  </div>
                  <div className="text-sm font-bold text-neutral-900">{t.name}</div>
                  <div className="text-xs text-neutral-500 font-hanzi">{t.chineseName}</div>
                </div>

                {/* SVG Visual Contour Graphic */}
                <div className="h-16 w-full bg-neutral-50 rounded-xl p-2 border border-neutral-100 flex items-center justify-center">
                  <svg viewBox="0 0 100 50" className="w-full h-full stroke-red-600 fill-none stroke-[3] stroke-linecap-round">
                    {t.tone === 1 && <line x1="10" y1="10" x2="90" y2="10" />}
                    {t.tone === 2 && <line x1="10" y1="40" x2="90" y2="10" />}
                    {t.tone === 3 && <polyline points="10,25 50,45 90,15" />}
                    {t.tone === 4 && <line x1="10" y1="10" x2="90" y2="45" />}
                    {t.tone === 0 && <circle cx="50" cy="25" r="4" className="fill-neutral-400 stroke-none" />}
                  </svg>
                </div>

                <p className="text-[11px] text-neutral-600 leading-normal">
                  {t.description}
                </p>

                <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-neutral-900">{t.example}</span>
                  <button
                    type="button"
                    onClick={() => handlePlayAudio(t.example.split(" ")[0])}
                    className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-600 cursor-pointer"
                  >
                    <Volume2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Tone Sandhi & Rules */}
          <div className="bg-white border border-neutral-200 rounded-3xl p-6 space-y-4">
            <h2 className="text-base font-bold text-neutral-900 tracking-tight flex items-center gap-2">
              <Sparkles size={16} className="text-amber-500" />
              <span>Mandatory Tone Sandhi Rules (变调规律)</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                <div className="font-bold text-amber-900 text-sm">
                  1. Two 3rd Tones in Succession (3 + 3 → 2 + 3)
                </div>
                <p className="text-amber-950/80 leading-relaxed">
                  When two third tones meet, the first one is spoken as a second tone (rising).
                  Example: <strong>你好 (nǐ hǎo)</strong> is pronounced <strong>ní hǎo</strong>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-2">
                <div className="font-bold text-blue-900 text-sm">
                  2. Tone Sandhi for 不 (bù)
                </div>
                <p className="text-blue-950/80 leading-relaxed">
                  Normally 4th tone (bù). Before another 4th tone syllable, it changes to 2nd tone (bú).
                  Example: <strong>不是 (bú shì)</strong>, <strong>不要 (bú yào)</strong>.
                </p>
              </div>
            </div>

            {/* Tone Pairs Explorer */}
            <div className="pt-4 border-t border-neutral-100 space-y-3">
              <h3 className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
                Common 2-Syllable Tone Pair Drill
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {TONE_PAIRS.map((pair) => (
                  <div key={pair.id} className="p-3 rounded-xl border border-neutral-100 bg-neutral-50/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-neutral-200 text-neutral-700 font-mono">
                        {pair.title}
                      </span>
                      <button
                        type="button"
                        onClick={() => handlePlayAudio(pair.word)}
                        className="p-1 rounded-md hover:bg-neutral-200 text-neutral-700 cursor-pointer"
                      >
                        <Volume2 size={13} />
                      </button>
                    </div>
                    <div>
                      <div className="font-hanzi font-bold text-lg text-neutral-900">{pair.word}</div>
                      <div className="font-mono text-xs text-red-600 font-semibold">{pair.pinyin}</div>
                      <div className="text-[11px] text-neutral-500">"{pair.meaning}"</div>
                    </div>
                    <p className="text-[10px] text-neutral-600 italic">
                      {pair.tips}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: EAR TRAINING */}
      {activeTab === "eartraining" && (
        <div className="max-w-xl mx-auto bg-white border border-neutral-200 rounded-3xl p-6 md:p-8 space-y-6 text-center shadow-xs">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1 text-xs font-bold text-red-600 uppercase tracking-wider">
              <Activity size={14} />
              <span>Acoustic Reflex Test</span>
            </div>
            <h2 className="text-xl font-bold text-neutral-900">
              Listen & Identify the Correct Tone
            </h2>
            <p className="text-xs text-neutral-500">
              Score: <strong className="text-neutral-900">{quizScore}</strong> correct
            </p>
          </div>

          {/* Big Sound Play Button */}
          <div className="py-6">
            <button
              type="button"
              onClick={() => handlePlayAudio(currentQuiz.text)}
              className="w-24 h-24 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg mx-auto flex flex-col items-center justify-center gap-1 transition-transform active:scale-95 cursor-pointer"
            >
              <Volume2 size={32} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Play Audio</span>
            </button>
            <div className="mt-3 text-xs text-neutral-400">
              Base sound: <em>{currentQuiz.base}</em>
            </div>
          </div>

          {/* Tone Choices 1 to 4 */}
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleQuizChoice(t)}
                className="p-4 rounded-2xl border border-neutral-200 hover:border-red-400 bg-neutral-50 hover:bg-red-50 text-neutral-900 transition-all font-bold text-sm cursor-pointer flex flex-col items-center gap-1"
              >
                <span>Tone {t}</span>
                <span className="text-xs text-neutral-400 font-mono">
                  {t === 1 ? "— High" : t === 2 ? "ˊ Rising" : t === 3 ? "ˇ Dip" : "ˋ Drop"}
                </span>
              </button>
            ))}
          </div>

          {quizFeedback && (
            <div
              className={`p-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 ${
                quizFeedback === "correct"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-rose-50 text-rose-800 border border-rose-200"
              }`}
            >
              {quizFeedback === "correct" ? (
                <>
                  <CheckCircle2 size={16} />
                  <span>Correct! Spot on!</span>
                </>
              ) : (
                <>
                  <XCircle size={16} />
                  <span>Oops! Added to Mistake Book. Play audio again and try next.</span>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
