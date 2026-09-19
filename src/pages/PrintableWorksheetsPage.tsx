import React, { useState, useEffect } from "react";
import {
  Printer,
  Download,
  FileText,
  Grid,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Sliders,
  Eye,
  RefreshCw,
  HelpCircle,
  Copy,
} from "lucide-react";
import { bengaliService } from "../services/bengaliService";
import { HskLevel } from "../types/hsk";

type SheetType = "tian_zi_ge" | "grammar_cheat" | "pinyin_poster" | "vocab_cards" | "blank_grid";

interface CharacterPractice {
  char: string;
  pinyin: string;
  meaningEn: string;
  meaningBn: string;
  radical: string;
  strokes: number;
}

const HSK1_PRACTICE_CHARS: CharacterPractice[] = [
  { char: "你", pinyin: "nǐ", meaningEn: "you", meaningBn: "তুমি / আপনি", radical: "亻", strokes: 7 },
  { char: "好", pinyin: "hǎo", meaningEn: "good, well", meaningBn: "ভালো", radical: "女", strokes: 6 },
  { char: "我", pinyin: "wǒ", meaningEn: "I, me", meaningBn: "আমি / আমাকে", radical: "戈", strokes: 7 },
  { char: "是", pinyin: "shì", meaningEn: "to be, yes", meaningBn: "হয় / হ্যাঁ", radical: "日", strokes: 9 },
  { char: "人", pinyin: "rén", meaningEn: "person", meaningBn: "মানুষ / ব্যক্তি", radical: "人", strokes: 2 },
  { char: "学", pinyin: "xué", meaningEn: "to study, learn", meaningBn: "পড়া / শেখা", radical: "子", strokes: 8 },
  { char: "生", pinyin: "shēng", meaningEn: "born, life", meaningBn: "জন্ম / জীবন", radical: "生", strokes: 5 },
  { char: "老", pinyin: "lǎo", meaningEn: "old, experienced", meaningBn: "বয়স্ক / অভিজ্ঞ", radical: "老", strokes: 6 },
  { char: "师", pinyin: "shī", meaningEn: "teacher, master", meaningBn: "শিক্ষক", radical: "巾", strokes: 6 },
  { char: "谢", pinyin: "xiè", meaningEn: "to thank", meaningBn: "ধন্যবাদ", radical: "讠", strokes: 12 },
  { char: "中", pinyin: "zhōng", meaningEn: "middle, China", meaningBn: "মাঝ / চীন", radical: "丨", strokes: 4 },
  { char: "国", pinyin: "guó", meaningEn: "country, state", meaningBn: "দেশ / রাষ্ট্র", radical: "囗", strokes: 8 },
];

export const PrintableWorksheetsPage: React.FC = () => {
  const [isBn, setIsBn] = useState(bengaliService.getLanguage() === "bn");
  const [sheetType, setSheetType] = useState<SheetType>("tian_zi_ge");
  const [selectedLevel, setSelectedLevel] = useState<HskLevel>("1");
  const [gridBoxesCount, setGridBoxesCount] = useState<number>(8);
  const [showPinyin, setShowPinyin] = useState<boolean>(true);
  const [showMeaning, setShowMeaning] = useState<boolean>(true);

  useEffect(() => {
    const unsub = bengaliService.subscribe(() => {
      setIsBn(bengaliService.getLanguage() === "bn");
    });
    return unsub;
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
      {/* Screen-Only Header & Config Controls */}
      <div className="print:hidden space-y-6">
        {/* Banner */}
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-sky-950 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center gap-1.5 border border-emerald-400/30">
                  <Printer size={13} />
                  <span>A4 Ready • Printable</span>
                </span>
                <span className="text-xs text-neutral-400">HSK 3.0 Standard</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                {isBn ? "প্রিন্টেবল শিট ও চিট-শীট ডাউনলোডার" : "Printable Worksheets & Cheat Sheets"}
              </h1>
              <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">
                {isBn
                  ? "অফলাইনে কলম দিয়ে চীনা বর্ণমালা (হানজি) ও ব্যাকরণ অনুশীলনের জন্য A4 পেপার সাইজে ফরম্যাট করা ওয়ার্কশিট।"
                  : "Generate and print beautiful A4 handwriting practice sheets, Tian-Zi-Ge grids, and grammar cheat sheets."}
              </p>
            </div>

            <button
              type="button"
              onClick={handlePrint}
              className="px-5 py-3 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-sky-600/30 transition-all cursor-pointer shrink-0"
            >
              <Printer size={18} />
              <span>{isBn ? "শিট প্রিন্ট / PDF সেভ করুন" : "Print Sheet (Save PDF)"}</span>
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-3">
          <button
            type="button"
            onClick={() => setSheetType("tian_zi_ge")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              sheetType === "tian_zi_ge"
                ? "bg-[var(--color-primary)] text-white shadow-xs"
                : "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50"
            }`}
          >
            <Grid size={15} />
            <span>{isBn ? "তিয়ান-জি-গে হস্তলিপি শিট" : "Tian-Zi-Ge Handwriting Sheet"}</span>
          </button>

          <button
            type="button"
            onClick={() => setSheetType("grammar_cheat")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              sheetType === "grammar_cheat"
                ? "bg-[var(--color-primary)] text-white shadow-xs"
                : "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50"
            }`}
          >
            <BookOpen size={15} />
            <span>{isBn ? "ব্যাকরণ চিট-শীট (Grammar Summary)" : "Grammar Cheat Sheet"}</span>
          </button>

          <button
            type="button"
            onClick={() => setSheetType("pinyin_poster")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              sheetType === "pinyin_poster"
                ? "bg-[var(--color-primary)] text-white shadow-xs"
                : "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50"
            }`}
          >
            <FileText size={15} />
            <span>{isBn ? "পিনয়িন ও টোন রুল পোস্টার" : "Pinyin & Tone Rules Poster"}</span>
          </button>

          <button
            type="button"
            onClick={() => setSheetType("blank_grid")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              sheetType === "blank_grid"
                ? "bg-[var(--color-primary)] text-white shadow-xs"
                : "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50"
            }`}
          >
            <Grid size={15} />
            <span>{isBn ? "ফাঁকা অনুশীলন খাতা (Blank Grid Notebook)" : "Blank Grid Notebook"}</span>
          </button>
        </div>

        {/* Customization Controls (Print: hidden) */}
        {sheetType === "tian_zi_ge" && (
          <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 font-semibold text-neutral-700 dark:text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPinyin}
                  onChange={(e) => setShowPinyin(e.target.checked)}
                  className="rounded text-[var(--color-primary)]"
                />
                <span>{isBn ? "পিনয়িন দেখান" : "Show Pinyin"}</span>
              </label>

              <label className="flex items-center gap-2 font-semibold text-neutral-700 dark:text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showMeaning}
                  onChange={(e) => setShowMeaning(e.target.checked)}
                  className="rounded text-[var(--color-primary)]"
                />
                <span>{isBn ? "বাংলা ও ইংরেজি অর্থ" : "Show Meaning"}</span>
              </label>
            </div>

            <div className="flex items-center gap-2 text-neutral-500">
              <HelpCircle size={14} />
              <span>{isBn ? "প্রিন্ট করার সময় ব্রাউজারে 'Save as PDF' নির্বাচন করুন" : "Tip: Choose 'Save as PDF' in browser print dialog"}</span>
            </div>
          </div>
        )}
      </div>

      {/* Printable Sheet Canvas Container (Strictly styled for A4 paper and print) */}
      <div className="bg-white text-neutral-900 p-8 md:p-12 rounded-2xl border border-neutral-200 shadow-sm print:shadow-none print:border-none print:p-0 print:m-0 mx-auto max-w-[800px]">
        {/* Printable Header */}
        <div className="border-b-2 border-neutral-800 pb-4 mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-hanzi text-xl font-bold">汉学</span>
              <span className="text-sm font-black tracking-tight uppercase">HanLearn HSK 3.0</span>
            </div>
            <p className="text-xs text-neutral-600 font-medium">
              {sheetType === "tian_zi_ge" && "Official Tian-Zi-Ge (田字格) Character Handwriting Worksheet"}
              {sheetType === "grammar_cheat" && "HSK 3.0 Essential Grammar Structures Cheat Sheet"}
              {sheetType === "pinyin_poster" && "Standard Mandarin Pinyin & Tone Sandhi Rules Summary"}
              {sheetType === "blank_grid" && "Standard Tian-Zi-Ge Calligraphy & Handwriting Notebook"}
            </p>
          </div>

          <div className="text-right text-[11px] text-neutral-500 space-y-0.5">
            <div>Name: ______________________</div>
            <div>Date: ____________ Score: ______</div>
          </div>
        </div>

        {/* 1. Tian-Zi-Ge Worksheet */}
        {sheetType === "tian_zi_ge" && (
          <div className="space-y-6">
            <div className="space-y-4">
              {HSK1_PRACTICE_CHARS.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 pb-3 border-b border-neutral-100 last:border-none"
                >
                  {/* Master Character Card */}
                  <div className="w-24 shrink-0 text-left">
                    {showPinyin && (
                      <div className="text-xs font-bold text-neutral-500 font-mono">
                        {item.pinyin}
                      </div>
                    )}
                    <div className="text-3xl font-hanzi font-black text-neutral-900 leading-tight">
                      {item.char}
                    </div>
                    {showMeaning && (
                      <div className="text-[10px] text-neutral-500 leading-tight truncate">
                        {item.meaningBn}
                      </div>
                    )}
                  </div>

                  {/* Tian-Zi-Ge Boxes Grid */}
                  <div className="flex items-center gap-2 flex-1 overflow-x-auto py-1">
                    {/* First box: light trace */}
                    <div className="w-10 h-10 border-2 border-neutral-800 relative flex items-center justify-center shrink-0">
                      <div className="absolute inset-0 border-t border-dashed border-neutral-300 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <div className="absolute inset-0 border-l border-dashed border-neutral-300 left-1/2 -translate-x-1/2 pointer-events-none" />
                      <span className="font-hanzi text-2xl text-neutral-300 font-normal">
                        {item.char}
                      </span>
                    </div>

                    {/* Subsequent empty practice boxes */}
                    {Array.from({ length: 7 }).map((_, boxIdx) => (
                      <div
                        key={boxIdx}
                        className="w-10 h-10 border-2 border-neutral-800 relative flex items-center justify-center shrink-0"
                      >
                        <div className="absolute inset-0 border-t border-dashed border-neutral-300 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <div className="absolute inset-0 border-l border-dashed border-neutral-300 left-1/2 -translate-x-1/2 pointer-events-none" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Grammar Cheat Sheet */}
        {sheetType === "grammar_cheat" && (
          <div className="space-y-6 text-xs text-neutral-800">
            {/* 15 Essential Measure Words */}
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-2">
                1. Essential Measure Words (量词 Liàngcí)
              </h3>
              <div className="grid grid-cols-3 gap-2 text-[11px]">
                <div className="p-2 border border-neutral-200 rounded">
                  <span className="font-bold font-hanzi text-sm">个 (gè):</span> General / People (一个人)
                </div>
                <div className="p-2 border border-neutral-200 rounded">
                  <span className="font-bold font-hanzi text-sm">本 (běn):</span> Bound items / Books (两本书)
                </div>
                <div className="p-2 border border-neutral-200 rounded">
                  <span className="font-bold font-hanzi text-sm">只 (zhī):</span> Animals / Small birds (一只猫)
                </div>
                <div className="p-2 border border-neutral-200 rounded">
                  <span className="font-bold font-hanzi text-sm">张 (zhāng):</span> Flat objects / Paper (一张纸)
                </div>
                <div className="p-2 border border-neutral-200 rounded">
                  <span className="font-bold font-hanzi text-sm">条 (tiáo):</span> Long, flexible (一条鱼/裤子)
                </div>
                <div className="p-2 border border-neutral-200 rounded">
                  <span className="font-bold font-hanzi text-sm">杯 (bēi):</span> Cup / Glass of liquid (一杯茶)
                </div>
              </div>
            </div>

            {/* Crucial Sentence Structures */}
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-2">
                2. Core Sentence Structures
              </h3>
              <div className="space-y-2">
                <div className="p-2.5 border border-neutral-200 rounded">
                  <div className="font-bold text-neutral-900">
                    The 把 (Bǎ) Sentence: Subject + 把 + Object + Verb + Other Element
                  </div>
                  <div className="text-neutral-600">
                    Example: 我把作业做完了。(I finished my homework.)
                  </div>
                </div>

                <div className="p-2.5 border border-neutral-200 rounded">
                  <div className="font-bold text-neutral-900">
                    The 比 (Bǐ) Comparison: A + 比 + B + Adjective
                  </div>
                  <div className="text-neutral-600">
                    Example: 今天比昨天冷。(Today is colder than yesterday.)
                  </div>
                </div>

                <div className="p-2.5 border border-neutral-200 rounded">
                  <div className="font-bold text-neutral-900">
                    The Three De Particles: 的 / 得 / 地
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-1 text-[10px]">
                    <div><b>的 (de):</b> Noun modifier (我的书)</div>
                    <div><b>得 (de):</b> Verb complement (跑得快)</div>
                    <div><b>地 (de):</b> Adverbial modifier (慢慢地走)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Question Particles & Negation */}
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-2">
                3. Negation & Question Forms
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2 border border-neutral-200 rounded">
                  <div className="font-bold">不 (bù) vs. 没 (méi)</div>
                  <p className="text-[10px] text-neutral-600">
                    • <b>不:</b> Habits, future, willingness, 有 is NEVER used with 不。<br />
                    • <b>没:</b> Past actions, completed actions, absence (没有).
                  </p>
                </div>
                <div className="p-2 border border-neutral-200 rounded">
                  <div className="font-bold">Question Particles</div>
                  <p className="text-[10px] text-neutral-600">
                    • <b>吗 (ma):</b> Yes/No questions (你好吗？)<br />
                    • <b>呢 (ne):</b> "How about..." (你呢？)<br />
                    • <b>吧 (ba):</b> Suggestion / Confirmation (走吧！)
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Pinyin & Tone Poster */}
        {sheetType === "pinyin_poster" && (
          <div className="space-y-6 text-xs text-neutral-800">
            {/* The 4 Tones */}
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-2">
                The 4 Mandarin Tones (四声)
              </h3>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-3 border-2 border-neutral-800 rounded">
                  <div className="text-xl font-bold font-mono">ā</div>
                  <div className="font-bold">1st Tone (阴平)</div>
                  <div className="text-[10px] text-neutral-500">High Flat (5-5) • mā 妈</div>
                </div>
                <div className="p-3 border-2 border-neutral-800 rounded">
                  <div className="text-xl font-bold font-mono">á</div>
                  <div className="font-bold">2nd Tone (阳平)</div>
                  <div className="text-[10px] text-neutral-500">Rising (3-5) • má 麻</div>
                </div>
                <div className="p-3 border-2 border-neutral-800 rounded">
                  <div className="text-xl font-bold font-mono">ǎ</div>
                  <div className="font-bold">3rd Tone (上声)</div>
                  <div className="text-[10px] text-neutral-500">Dip & Rise (2-1-4) • mǎ 马</div>
                </div>
                <div className="p-3 border-2 border-neutral-800 rounded">
                  <div className="text-xl font-bold font-mono">à</div>
                  <div className="font-bold">4th Tone (去声)</div>
                  <div className="text-[10px] text-neutral-500">Sharp Fall (5-1) • mà 骂</div>
                </div>
              </div>
            </div>

            {/* Tone Sandhi Rules */}
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-2">
                Mandatory Tone Sandhi Rules (变调)
              </h3>
              <div className="space-y-2">
                <div className="p-2 border border-neutral-200 rounded">
                  <b>Two 3rd Tones (3 + 3 → 2 + 3):</b> When two 3rd tones occur consecutively, the first changes to 2nd tone.
                  <span className="block font-mono text-[11px] text-neutral-600">e.g. 你好 (nǐ hǎo → ní hǎo)</span>
                </div>
                <div className="p-2 border border-neutral-200 rounded">
                  <b>Rules for "一" (yī):</b>
                  <span className="block text-[11px] text-neutral-600">
                    • Before 4th tone → changes to 2nd tone (yí): 一样 (yí yàng)<br />
                    • Before 1st, 2nd, 3rd tone → changes to 4th tone (yì): 一起 (yì qǐ)
                  </span>
                </div>
                <div className="p-2 border border-neutral-200 rounded">
                  <b>Rules for "不" (bù):</b>
                  <span className="block text-[11px] text-neutral-600">
                    • Before 4th tone → changes to 2nd tone (bú): 不是 (bú shì), 不要 (bú yào)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. Blank Tian-Zi-Ge Grid Notebook */}
        {sheetType === "blank_grid" && (
          <div className="space-y-3">
            {Array.from({ length: 12 }).map((_, rowIdx) => (
              <div key={rowIdx} className="flex items-center justify-between gap-2">
                {Array.from({ length: 9 }).map((_, colIdx) => (
                  <div
                    key={colIdx}
                    className="w-11 h-11 border-2 border-neutral-800 relative flex items-center justify-center shrink-0"
                  >
                    <div className="absolute inset-0 border-t border-dashed border-neutral-300 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <div className="absolute inset-0 border-l border-dashed border-neutral-300 left-1/2 -translate-x-1/2 pointer-events-none" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Printable Footer */}
        <div className="mt-8 pt-4 border-t border-neutral-200 text-center text-[10px] text-neutral-400">
          HanLearn International Chinese Education Platform • Official Practice Sheet • www.hanlearn.org
        </div>
      </div>
    </div>
  );
};
