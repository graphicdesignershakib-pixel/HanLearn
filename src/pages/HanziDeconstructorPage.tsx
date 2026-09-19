import React, { useState, useEffect } from "react";
import {
  GitFork,
  Search,
  Sparkles,
  Layers,
  ArrowRight,
  BookOpen,
  Volume2,
  TreeDeciduous,
  Compass,
  CornerDownRight,
  Info,
  PenTool,
  Bookmark,
  Share2,
} from "lucide-react";
import { ETYMOLOGY_DATABASE, HanziNode } from "../data/etymologyData";
import { audioService } from "../services/audioService";
import { bengaliService } from "../services/bengaliService";
import { navigate } from "../services/routerService";

export const HanziDeconstructorPage: React.FC = () => {
  const [selectedChar, setSelectedChar] = useState<string>("好");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isBn, setIsBn] = useState<boolean>(bengaliService.getLanguage() === "bn");

  useEffect(() => {
    const unsub = bengaliService.subscribe(() => {
      setIsBn(bengaliService.getLanguage() === "bn");
    });
    return unsub;
  }, []);

  const characterKeys = Object.keys(ETYMOLOGY_DATABASE);
  const activeData: HanziNode = ETYMOLOGY_DATABASE[selectedChar] || ETYMOLOGY_DATABASE["好"];

  const filteredKeys = characterKeys.filter((k) => {
    const node = ETYMOLOGY_DATABASE[k];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      node.char.includes(q) ||
      node.pinyin.toLowerCase().includes(q) ||
      node.meaningEn.toLowerCase().includes(q) ||
      node.meaningBn.includes(q)
    );
  });

  const handlePlayAudio = (text: string) => {
    audioService.speakText(text);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-red-100 text-red-700">
              <TreeDeciduous size={22} />
            </span>
            <span className="text-xs font-extrabold uppercase tracking-wider text-red-600">
              {isBn ? "চীনা অক্ষরের প্রাচীন উৎস ও ইতিবৃত্ত" : "Hanzi Origins & Character Evolution"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 font-serif">
            {isBn ? "অক্ষর ভাঙন ও শব্দমূল বৃক্ষ (Deconstructor & Tree)" : "Hanzi Deconstructor & Etymology Tree"}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-2xl leading-relaxed">
            {isBn
              ? "চীনা অক্ষর মুখস্থ করার প্রয়োজন নেই! প্রতিটি অক্ষরের পেছনের ৩,০০০ বছরের প্রাচীন গল্প, চিত্ররূপ (Pictograph) এবং বাংলা স্মৃতিসহায়ক কৌশল (Mnemonic) আবিষ্কার করুন।"
              : "Never blindly memorize Hanzi again. Deconstruct complex characters into their ancient pictographic roots, phonetic markers, and semantic stories."}
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate(`/writing/${encodeURIComponent(selectedChar)}`)}
          className="px-5 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-colors shadow-xs flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <PenTool size={15} />
          <span>{isBn ? `"${selectedChar}" লেখার ক্যানভাস খুলুন` : `Practice Writing "${selectedChar}"`}</span>
        </button>
      </div>

      {/* Quick Selector Bar */}
      <div className="p-4 rounded-2xl bg-white border border-neutral-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
            {isBn ? "প্রস্তাবিত অক্ষর:" : "Explore Roots:"}
          </span>
          {characterKeys.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSelectedChar(c)}
              className={`w-10 h-10 rounded-xl font-hanzi text-lg font-bold transition-all cursor-pointer ${
                selectedChar === c
                  ? "bg-red-600 text-white shadow-xs scale-105"
                  : "bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="relative min-w-[200px] flex-1 sm:flex-initial">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isBn ? "ফিল্টার করুন..." : "Filter characters..."}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:bg-white"
          />
        </div>
      </div>

      {/* Main Interactive Etymology Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Visual Deconstructor Stage & Bengali Mnemonic */}
        <div className="lg:col-span-7 space-y-6">
          {/* Hero Character Card & Etymology Genesis */}
          <div className="bg-white rounded-3xl border border-neutral-200 p-6 md:p-8 space-y-6 shadow-xs">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-5">
                <div className="w-24 h-24 rounded-2xl bg-amber-50/60 border-2 border-amber-200/80 flex items-center justify-center font-hanzi text-6xl font-bold text-neutral-900 shadow-inner">
                  {activeData.char}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-2xl font-bold text-red-600">
                      {activeData.pinyin}
                    </span>
                    <button
                      type="button"
                      onClick={() => handlePlayAudio(activeData.char)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Volume2 size={18} />
                    </button>
                  </div>
                  <div className="text-base font-bold text-neutral-900">
                    {isBn ? activeData.meaningBn : activeData.meaningEn}
                  </div>
                  <div className="inline-block px-2.5 py-0.5 rounded-md bg-neutral-100 text-neutral-600 text-[11px] font-bold">
                    {isBn ? activeData.typeLabelBn : activeData.typeLabelEn}
                  </div>
                </div>
              </div>
            </div>

            {/* Oracle Bone & Historical Genesis Box */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
                <Sparkles size={14} className="text-amber-600" />
                <span>{isBn ? "প্রাচীন ওরাকল ও সীল লিপির দৃশ্যপট" : "Ancient Pictographic Origin"}</span>
              </div>
              <p className="text-xs text-amber-950 font-medium leading-relaxed">
                {isBn ? activeData.oracleBoneDescBn : activeData.oracleBoneDescEn}
              </p>
            </div>

            {/* The Etymology Story */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen size={16} className="text-red-600" />
                <span>{isBn ? "ঐতিহাসিক বিবর্তন ও ভাবার্থ" : "Evolutionary Story"}</span>
              </h3>
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                {isBn ? activeData.etymologyStoryBn : activeData.etymologyStoryEn}
              </p>
            </div>

            {/* Bengali Super-Mnemonic Box */}
            <div className="p-4 rounded-2xl bg-red-50/60 border border-red-200/80 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-red-900 uppercase tracking-wider">
                <Bookmark size={14} className="text-red-600" />
                <span>{isBn ? "বাংলা স্মৃতিসহায়ক কৌশল (Bengali Mnemonic)" : "Bengali Mnemonic Hook"}</span>
              </div>
              <p className="text-sm font-bold text-red-950 leading-relaxed">
                "{activeData.bengaliMnemonic}"
              </p>
            </div>
          </div>

          {/* Interactive Deconstruction Tree View */}
          <div className="bg-white rounded-3xl border border-neutral-200 p-6 md:p-8 space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                <GitFork size={18} className="text-red-600" />
                <span>{isBn ? "অঙ্গসংস্থান ও উপাদান বিশ্লেষণ (Radical Breakdown)" : "Component Decomposition"}</span>
              </h3>
              <span className="text-xs text-neutral-500 font-medium font-mono">
                {activeData.components.length} Sub-elements
              </span>
            </div>

            {/* Visual Formula: Root = Comp 1 + Comp 2 */}
            <div className="flex items-center justify-center gap-3 py-4 flex-wrap bg-neutral-50 rounded-2xl border border-neutral-100">
              <div className="w-14 h-14 rounded-2xl bg-white border border-neutral-300 flex items-center justify-center font-hanzi text-3xl font-bold text-red-600 shadow-2xs">
                {activeData.char}
              </div>
              <span className="text-xl font-bold text-neutral-400">=</span>

              {activeData.components.map((comp, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <span className="text-xl font-bold text-neutral-400">+</span>}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-xl bg-white border border-neutral-200 flex items-center justify-center font-hanzi text-2xl font-bold text-neutral-800 shadow-2xs">
                      {comp.char}
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500 mt-1">
                      {comp.pinyin}
                    </span>
                  </div>
                </React.Fragment>
              ))}
            </div>

            {/* Detailed Component Breakdown Cards */}
            <div className="space-y-3">
              {activeData.components.map((comp, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl border border-neutral-200/90 bg-white flex items-start gap-4 hover:border-neutral-300 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-center font-hanzi text-2xl font-bold text-neutral-900 shrink-0">
                    {comp.char}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-neutral-700">
                        {comp.pinyin}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600">
                        {comp.role.toUpperCase()}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-neutral-900">
                      {isBn ? comp.meaningBn : comp.meaningEn}
                    </div>

                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {isBn ? comp.notesBn : comp.notesEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Etymology Tree Branches & Family Words */}
        <div className="lg:col-span-5 space-y-6">
          {/* Derivative Words Family Tree */}
          <div className="bg-white rounded-3xl border border-neutral-200 p-6 space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                <Layers size={18} className="text-red-600" />
                <span>{isBn ? `"${activeData.char}" যুক্ত যৌগিক শব্দসমূহ` : `Derivatives & Word Family`}</span>
              </h3>
            </div>

            <p className="text-xs text-neutral-500 leading-relaxed">
              {isBn
                ? `এই মূল উপাদানটি চীনা ভাষার অসংখ্য নতুন শব্দ তৈরিতে শাখা-প্রশাখার মতো ভূমিকা পালন করে:`
                : `This root character expands into multiple compound vocabulary words:`}
            </p>

            <div className="space-y-3">
              {activeData.derivatives.map((word, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl border border-neutral-200 bg-neutral-50/50 hover:bg-neutral-50 flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center font-hanzi text-lg font-bold text-neutral-900 shadow-2xs">
                      {word.char}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-neutral-800">
                          {word.pinyin}
                        </span>
                        <button
                          type="button"
                          onClick={() => handlePlayAudio(word.char)}
                          className="p-0.5 rounded text-neutral-400 hover:text-red-600"
                        >
                          <Volume2 size={13} />
                        </button>
                      </div>
                      <div className="text-xs font-bold text-neutral-900">
                        {isBn ? word.meaningBn : word.meaningEn}
                      </div>
                      <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                        {word.roleInWord}
                      </div>
                    </div>
                  </div>

                  <CornerDownRight size={16} className="text-neutral-300 shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Practice Prompt */}
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-3xl p-6 text-white space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-white/10 text-red-400">
                <PenTool size={18} />
              </span>
              <h4 className="text-base font-bold">
                {isBn ? "হাতে লেখার অনুশীলন করুন" : "Solidify in Muscle Memory"}
              </h4>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              {isBn
                ? `এখন যেহেতু আপনি "${activeData.char}" অক্ষরের অভ্যন্তরীণ গঠন ও অর্থ বুঝতে পেরেছেন, তাই ক্যালিগ্রাফি ক্যানভাসে গিয়ে স্ট্রোকের সঠিক ধারাবাহিকতা অনুশীলন করুন।`
                : `Now that you understand the soul of "${activeData.char}", practice drawing its strokes on our Interactive Calligraphy Canvas.`}
            </p>

            <button
              type="button"
              onClick={() => navigate(`/writing/${encodeURIComponent(activeData.char)}`)}
              className="w-full py-2.5 px-4 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <span>{isBn ? "ক্যালিগ্রাফি ক্যানভাসে যান" : "Open Handwriting Canvas"}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
