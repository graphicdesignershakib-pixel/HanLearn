import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Volume2,
  Type,
  Maximize2,
  Minimize2,
  Sparkles,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Settings2,
  Palette,
  AlignLeft,
  BookOpen,
} from "lucide-react";
import { chineseTextParser, ParsedToken } from "../../services/chineseTextParser";
import { CharacterTooltip } from "./CharacterTooltip";
import { audioService } from "../../services/audioService";
import { HskLevel } from "../../types/hsk";

export interface ReadingPassageData {
  id: string;
  hskLevel: HskLevel;
  title: string;
  chineseTitle: string;
  pinyinTitle: string;
  paragraphs: {
    chinese: string;
    pinyin: string;
    english: string;
    bengali?: string;
  }[];
  questions?: {
    id: string;
    prompt: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

interface FocusReadingOverlayProps {
  passage: ReadingPassageData;
  passages: ReadingPassageData[];
  onSelectPassage: (idx: number) => void;
  currentIndex: number;
  onClose: () => void;
  isBn?: boolean;
}

export const FocusReadingOverlay: React.FC<FocusReadingOverlayProps> = ({
  passage,
  passages,
  onSelectPassage,
  currentIndex,
  onClose,
  isBn = false,
}) => {
  // Configurable reading preferences
  const [fontSize, setFontSize] = useState<"sm" | "md" | "lg" | "xl" | "2xl">("lg");
  const [lineHeight, setLineHeight] = useState<"normal" | "relaxed" | "loose">("relaxed");
  const [theme, setTheme] = useState<"sepia" | "light" | "dark">("sepia");
  const [showPinyin, setShowPinyin] = useState(true);
  const [pinyinStyle, setPinyinStyle] = useState<"ruby" | "block">("ruby");
  const [showTranslation, setShowTranslation] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [columnWidth, setColumnWidth] = useState<"narrow" | "medium" | "wide">("medium");

  // Interactive tooltip state
  const [activeToken, setActiveToken] = useState<ParsedToken | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number } | undefined>(undefined);

  // Audio playing state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeParagraphIdx, setActiveParagraphIdx] = useState<number | null>(null);

  // Scroll progress
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Parse paragraphs into tokens
  const [parsedParagraphs, setParsedParagraphs] = useState<ParsedToken[][]>([]);

  useEffect(() => {
    const parsed = passage.paragraphs.map((para) => chineseTextParser.parseText(para.chinese));
    setParsedParagraphs(parsed);
    setActiveToken(null);
  }, [passage]);

  // Handle ESC key to exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (activeToken) {
          setActiveToken(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeToken, onClose]);

  // Track scroll progress
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll <= 0) {
      setScrollProgress(100);
    } else {
      setScrollProgress(Math.min(100, Math.round((scrollTop / maxScroll) * 100)));
    }
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

  const handlePlayFullPassage = () => {
    const fullText = passage.paragraphs.map((p) => p.chinese).join(" ");
    setIsPlayingAudio(true);
    audioService.speakText(fullText);
    setTimeout(() => setIsPlayingAudio(false), 5000);
  };

  const handlePlayParagraph = (idx: number, text: string) => {
    setActiveParagraphIdx(idx);
    audioService.speakText(text);
    setTimeout(() => setActiveParagraphIdx(null), 3000);
  };

  // Theme styles
  const themeStyles = {
    sepia: {
      bg: "bg-[#fbf7ee]",
      text: "text-[#2e2b26]",
      subtext: "text-[#6b645b]",
      pinyin: "text-[#a24830]",
      border: "border-[#e8decb]",
      cardBg: "bg-[#f4eedf]",
      accent: "text-amber-800",
      btnActive: "bg-[#ece3cf] text-[#2e2b26]",
      progress: "bg-amber-600",
    },
    light: {
      bg: "bg-white",
      text: "text-neutral-900",
      subtext: "text-neutral-500",
      pinyin: "text-emerald-700",
      border: "border-neutral-200",
      cardBg: "bg-neutral-50",
      accent: "text-emerald-700",
      btnActive: "bg-neutral-200 text-neutral-900",
      progress: "bg-emerald-600",
    },
    dark: {
      bg: "bg-[#141619]",
      text: "text-[#e8eaed]",
      subtext: "text-[#9aa0a6]",
      pinyin: "text-[#8ab4f8]",
      border: "border-[#2d3135]",
      cardBg: "bg-[#1f2227]",
      accent: "text-emerald-400",
      btnActive: "bg-[#2d3135] text-white",
      progress: "bg-emerald-500",
    },
  }[theme];

  const fontSizeClass = {
    sm: "text-base sm:text-lg leading-relaxed",
    md: "text-lg sm:text-xl leading-relaxed",
    lg: "text-xl sm:text-2xl leading-loose",
    xl: "text-2xl sm:text-3xl leading-loose",
    "2xl": "text-3xl sm:text-4xl leading-loose",
  }[fontSize];

  const widthClass = {
    narrow: "max-w-xl",
    medium: "max-w-3xl",
    wide: "max-w-4xl",
  }[columnWidth];

  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      onClick={() => setActiveToken(null)}
      className={`fixed inset-0 z-50 overflow-y-auto transition-colors duration-200 ${themeStyles.bg} ${themeStyles.text} select-text font-sans`}
    >
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-neutral-200/30 z-50">
        <div
          className={`h-full transition-all duration-150 ${themeStyles.progress}`}
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Header Toolbar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-opacity-90 border-b border-inherit px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left: Passage Meta & Switcher */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-neutral-500/10 border border-neutral-500/20 shrink-0">
            <BookOpen size={13} />
            <span>HSK {passage.hskLevel}</span>
          </div>

          <div className="hidden md:flex items-center gap-1 text-xs">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => onSelectPassage(currentIndex - 1)}
              className="p-1 rounded hover:bg-neutral-500/10 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
              title="Previous Passage"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="font-semibold px-1">
              {currentIndex + 1} / {passages.length}
            </span>
            <button
              type="button"
              disabled={currentIndex === passages.length - 1}
              onClick={() => onSelectPassage(currentIndex + 1)}
              className="p-1 rounded hover:bg-neutral-500/10 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
              title="Next Passage"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <h2 className="text-sm sm:text-base font-bold truncate">
            {passage.title}
          </h2>
        </div>

        {/* Right: Controls & Exit */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Audio narration */}
          <button
            type="button"
            onClick={handlePlayFullPassage}
            className="px-2.5 py-1.5 rounded-xl border border-inherit hover:bg-neutral-500/10 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            title="Read whole text aloud"
          >
            <Volume2 size={15} />
            <span className="hidden sm:inline">{isBn ? "পুরো পাঠ শুনুন" : "Read Aloud"}</span>
          </button>

          {/* Font Size Selector */}
          <div className="flex items-center border border-inherit rounded-xl p-0.5 text-xs font-semibold">
            {(["sm", "md", "lg", "xl"] as const).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setFontSize(size)}
                className={`px-2 py-1 rounded-lg uppercase text-[11px] transition-colors cursor-pointer ${
                  fontSize === size ? themeStyles.btnActive : "hover:bg-neutral-500/10"
                }`}
                title={`Font Size ${size.toUpperCase()}`}
              >
                {size}
              </button>
            ))}
          </div>

          {/* Theme Selector */}
          <div className="flex items-center border border-inherit rounded-xl p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setTheme("sepia")}
              className={`px-2 py-1 rounded-lg font-semibold text-[11px] transition-colors cursor-pointer ${
                theme === "sepia" ? "bg-[#ece3cf] text-[#2e2b26] font-bold" : "hover:bg-neutral-500/10"
              }`}
              title="Warm Paper"
            >
              Sepia
            </button>
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`px-2 py-1 rounded-lg font-semibold text-[11px] transition-colors cursor-pointer ${
                theme === "light" ? "bg-neutral-200 text-neutral-900 font-bold" : "hover:bg-neutral-500/10"
              }`}
              title="Clean Light"
            >
              Light
            </button>
            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`px-2 py-1 rounded-lg font-semibold text-[11px] transition-colors cursor-pointer ${
                theme === "dark" ? "bg-[#2d3135] text-white font-bold" : "hover:bg-neutral-500/10"
              }`}
              title="Midnight Dark"
            >
              Dark
            </button>
          </div>

          {/* Pinyin Toggle */}
          <button
            type="button"
            onClick={() => setShowPinyin(!showPinyin)}
            className={`px-2.5 py-1.5 rounded-xl border border-inherit transition-colors text-xs font-semibold cursor-pointer flex items-center gap-1 ${
              showPinyin ? themeStyles.btnActive : "opacity-60 hover:opacity-100"
            }`}
            title="Toggle Pinyin"
          >
            {showPinyin ? <Eye size={14} /> : <EyeOff size={14} />}
            <span className="hidden md:inline">Pinyin</span>
          </button>

          {/* Translation Toggle */}
          <button
            type="button"
            onClick={() => setShowTranslation(!showTranslation)}
            className={`px-2.5 py-1.5 rounded-xl border border-inherit transition-colors text-xs font-semibold cursor-pointer ${
              showTranslation ? themeStyles.btnActive : "opacity-60 hover:opacity-100"
            }`}
            title="Toggle English Translation"
          >
            <span className="hidden md:inline">Trans</span>
            <span className="md:hidden">EN</span>
          </button>

          {/* Exit Focus Mode */}
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs ml-1"
            title="Exit Focus Mode (Esc)"
          >
            <Minimize2 size={14} />
            <span className="hidden sm:inline">{isBn ? "প্রস্থান" : "Exit"}</span>
            <kbd className="text-[10px] opacity-60 font-mono hidden md:inline">Esc</kbd>
          </button>
        </div>
      </header>

      {/* Main Focus Reading Container */}
      <main className={`mx-auto ${widthClass} px-6 sm:px-12 py-10 md:py-16 space-y-10`}>
        {/* Title Block */}
        <div className="space-y-3 border-b border-inherit pb-8 text-center sm:text-left">
          <div className={`text-xs font-bold uppercase tracking-widest ${themeStyles.accent}`}>
            HSK Level {passage.hskLevel} · Distraction-Free Reader
          </div>
          <h1 className="font-hanzi text-3xl sm:text-5xl font-extrabold tracking-tight">
            {passage.chineseTitle}
          </h1>
          {showPinyin && (
            <div className={`font-mono text-sm sm:text-base ${themeStyles.pinyin}`}>
              {passage.pinyinTitle}
            </div>
          )}
          {showTranslation && (
            <p className={`text-sm sm:text-base italic ${themeStyles.subtext}`}>
              {passage.title}
            </p>
          )}

          <div className="pt-2 text-[11px] text-neutral-400 flex items-center gap-2 justify-center sm:justify-start">
            <Sparkles size={12} className="text-amber-500" />
            <span>
              {isBn
                ? "যেকোনো চাইনিজ ক্যারেক্টার বা শব্দে ক্লিক করে পিনয়িন, অর্থ ও অডিও উচ্চারণ দেখুন।"
                : "Click or tap any Chinese character/word to view inline lookup, tone, meaning, and pronunciation."}
            </span>
          </div>
        </div>

        {/* Paragraphs with Interactive Parsed Tokens */}
        <div className="space-y-10">
          {passage.paragraphs.map((para, pIdx) => {
            const tokens = parsedParagraphs[pIdx] || [];

            return (
              <article
                key={pIdx}
                className={`p-6 sm:p-8 rounded-3xl transition-all border border-transparent hover:border-inherit ${themeStyles.cardBg} space-y-4`}
              >
                {/* Chinese text rendered with parsed interactive word tokens */}
                <div className={`font-hanzi ${fontSizeClass} flex flex-wrap items-baseline gap-x-1 gap-y-2`}>
                  {tokens.map((tok) => {
                    if (!tok.isChinese) {
                      return (
                        <span key={tok.id} className="opacity-75 select-none">
                          {tok.text}
                        </span>
                      );
                    }

                    const isSelected = activeToken?.text === tok.text;

                    return (
                      <span
                        key={tok.id}
                        onClick={(e) => handleTokenClick(e, tok)}
                        className={`inline-flex flex-col items-center group cursor-pointer transition-all rounded-lg px-1 py-0.5 ${
                          isSelected
                            ? "bg-amber-300/40 dark:bg-amber-500/30 text-amber-900 dark:text-amber-200 ring-2 ring-amber-400"
                            : "hover:bg-neutral-500/10 hover:text-rose-600"
                        }`}
                        title={tok.pinyin ? `${tok.pinyin} - ${tok.english || ""}` : tok.text}
                      >
                        {/* Pinyin Ruby style */}
                        {showPinyin && tok.pinyin && (
                          <span
                            className={`font-mono text-[11px] sm:text-xs leading-none tracking-normal select-none pb-0.5 ${themeStyles.pinyin}`}
                          >
                            {tok.pinyin}
                          </span>
                        )}

                        <span className="border-b border-dotted border-neutral-400/40 group-hover:border-rose-400">
                          {tok.text}
                        </span>
                      </span>
                    );
                  })}
                </div>

                {/* Optional Pinyin Subtitle below paragraph if not ruby */}
                {showPinyin && pinyinStyle === "block" && (
                  <div className={`font-mono text-xs sm:text-sm tracking-wide ${themeStyles.pinyin}`}>
                    {para.pinyin}
                  </div>
                )}

                {/* Optional English Translation */}
                {showTranslation && (
                  <div className={`text-xs sm:text-sm italic pt-2 border-t border-inherit/40 ${themeStyles.subtext}`}>
                    "{para.english}"
                  </div>
                )}

                {/* Paragraph Audio Speaker */}
                <div className="flex items-center justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => handlePlayParagraph(pIdx, para.chinese)}
                    className="flex items-center gap-1 text-xs opacity-60 hover:opacity-100 transition-opacity cursor-pointer p-1 rounded-md hover:bg-neutral-500/10"
                    title="Play paragraph audio"
                  >
                    <Volume2 size={15} />
                    <span className="text-[11px]">
                      {activeParagraphIdx === pIdx ? (isBn ? "বাজছে..." : "Playing...") : (isBn ? "শুনুন" : "Listen")}
                    </span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Optional Comprehension Quiz in Focus Mode */}
        {passage.questions && passage.questions.length > 0 && (
          <div className="pt-8 border-t border-inherit space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Sparkles size={18} className={themeStyles.accent} />
                <span>{isBn ? "অনুশীলনী ও বোধগম্যতা পরীক্ষা" : "Comprehension Questions"}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowQuiz(!showQuiz)}
                className="text-xs font-semibold px-3 py-1 rounded-xl border border-inherit hover:bg-neutral-500/10 transition-colors cursor-pointer"
              >
                {showQuiz ? (isBn ? "লুকান" : "Hide Questions") : (isBn ? "প্রশ্নগুলো দেখুন" : "Show Questions")}
              </button>
            </div>

            {showQuiz && (
              <div className="space-y-4 pt-2">
                {passage.questions.map((q, idx) => (
                  <div
                    key={q.id || idx}
                    className={`p-5 rounded-2xl border border-inherit ${themeStyles.cardBg} space-y-3`}
                  >
                    <div className="font-bold text-sm">
                      {idx + 1}. {q.prompt}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className="p-2.5 rounded-xl border border-inherit bg-white/40 dark:bg-black/20 font-medium"
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                    <div className={`text-xs ${themeStyles.subtext} pt-1`}>
                      <strong>Explanation:</strong> {q.explanation}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer Navigation within Focus Mode */}
        <div className="pt-8 border-t border-inherit flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => onSelectPassage(currentIndex - 1)}
              className="px-4 py-2 rounded-xl border border-inherit hover:bg-neutral-500/10 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed font-semibold flex items-center gap-1.5"
            >
              <ChevronLeft size={15} />
              <span>{isBn ? "পূর্ববর্তী অনুচ্ছেদ" : "Previous Passage"}</span>
            </button>
            <button
              type="button"
              disabled={currentIndex === passages.length - 1}
              onClick={() => onSelectPassage(currentIndex + 1)}
              className="px-4 py-2 rounded-xl border border-inherit hover:bg-neutral-500/10 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed font-semibold flex items-center gap-1.5"
            >
              <span>{isBn ? "পরবর্তী অনুচ্ছেদ" : "Next Passage"}</span>
              <ChevronRight size={15} />
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-neutral-900 text-white hover:bg-black dark:bg-neutral-100 dark:text-neutral-900 font-bold transition-colors cursor-pointer"
          >
            {isBn ? "ফোকাস মোড শেষ করুন" : "Exit Focus Mode"}
          </button>
        </div>
      </main>

      {/* Floating Active Character Tooltip Popover */}
      {activeToken && (
        <CharacterTooltip
          token={activeToken}
          position={tooltipPos}
          onClose={() => setActiveToken(null)}
          isBn={isBn}
        />
      )}
    </div>
  );
};
