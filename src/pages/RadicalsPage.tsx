import React, { useState, useEffect } from "react";
import {
  Compass,
  Search,
  Volume2,
  Sparkles,
  Info,
  Layers,
  ChevronRight,
  Split,
  Globe,
  GitFork,
} from "lucide-react";
import { RADICALS_LIST, RadicalInfo } from "../data/radicalsData";
import { audioService } from "../services/audioService";
import { gamificationService } from "../services/gamificationService";
import { bengaliService } from "../services/bengaliService";
import { navigate } from "../services/routerService";

export const RadicalsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeRadical, setActiveRadical] = useState<RadicalInfo>(RADICALS_LIST[0]);
  const [isBn, setIsBn] = useState(bengaliService.getLanguage() === "bn");

  useEffect(() => {
    const unsub = bengaliService.subscribe(() => {
      setIsBn(bengaliService.getLanguage() === "bn");
    });
    return unsub;
  }, []);

  const categories = ["All", "Nature", "Human & Body", "Actions"];

  const filteredRadicals = RADICALS_LIST.filter((r) => {
    const matchesCategory =
      selectedCategory === "All" || r.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      r.radical.includes(q) ||
      r.pinyin.toLowerCase().includes(q) ||
      r.meaningEn.toLowerCase().includes(q) ||
      r.meaningBn.includes(q);
    return matchesCategory && matchesSearch;
  });

  const handleSelectRadical = (rad: RadicalInfo) => {
    setActiveRadical(rad);
    gamificationService.progressQuest("quest_radical", 1);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-red-100 text-red-700">
              <Split size={18} />
            </span>
            <h1 className="text-xl font-bold text-neutral-900 font-serif">
              {isBn ? "চাইনিজ মূল ও বর্ণ বিশ্লেষণ (Radicals & Decomposition)" : "Radical & Character Decomposition"}
            </h1>
          </div>
          <p className="text-xs text-neutral-500">
            {isBn
              ? "হানজি মূলত ছোট ছোট মূল উপাদান বা র‌্যাডিক্যালের সমন্বয়ে গঠিত। এদের পেছনের গল্প জেনে দ্রুত শব্দ মনে রাখুন।"
              : "Chinese characters are modular. Master radical building blocks and mnemonic etymologies."}
          </p>
        </div>

        {/* Search & Etymology Link */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => navigate("/etymology")}
            className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-2xs"
          >
            <GitFork size={14} />
            <span>{isBn ? "শব্দমূল বৃক্ষ" : "Etymology Tree"}</span>
          </button>

          <div className="relative w-full sm:w-56">
            <Search size={14} className="absolute left-3 top-2.5 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isBn ? "র‌্যাডিক্যাল বা অর্থ খুঁজুন..." : "Search radical, water, hand..."}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:border-red-500"
            />
          </div>
        </div>
      </div>

      {/* Main 2-Column Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Radical Grid Selection */}
        <div className="lg:col-span-4 space-y-4">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-xs rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-neutral-900 text-white"
                    : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Radicals List */}
          <div className="grid grid-cols-2 gap-2.5">
            {filteredRadicals.map((rad) => {
              const isSelected = activeRadical?.id === rad.id;
              return (
                <button
                  key={rad.id}
                  type="button"
                  onClick={() => handleSelectRadical(rad)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-red-50/80 border-red-400 shadow-xs ring-1 ring-red-300"
                      : "bg-white border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-hanzi font-bold text-neutral-900">
                      {rad.radical}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600">
                      {rad.strokeCount} str
                    </span>
                  </div>
                  <div className="mt-2 space-y-0.5">
                    <div className="text-xs font-semibold text-neutral-800 truncate">
                      {rad.meaningEn}
                    </div>
                    <div className="text-[11px] text-neutral-500 font-mono">
                      {rad.pinyin}
                    </div>
                    {isBn && (
                      <div className="text-[10px] text-emerald-700 font-bangla truncate">
                        {rad.meaningBn}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Radical View & Character Decompositions */}
        {activeRadical && (
          <div className="lg:col-span-8 bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 space-y-6 shadow-xs">
            {/* Radical Profile Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-neutral-100">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center text-4xl font-hanzi font-bold shadow-xs">
                  {activeRadical.radical}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-neutral-900 font-serif">
                      {activeRadical.meaningEn}
                    </h2>
                    <span className="text-xs font-mono text-red-600 font-medium">
                      ({activeRadical.nameZh} • {activeRadical.pinyin})
                    </span>
                  </div>
                  <p className="text-xs text-emerald-700 font-bangla font-semibold">
                    বাংলা অর্থ: {activeRadical.meaningBn}
                  </p>
                  {activeRadical.variants && (
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Variants: {activeRadical.variants.join(", ")}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => audioService.speakText(activeRadical.radical)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Volume2 size={14} className="text-red-600" />
                <span>Audio</span>
              </button>
            </div>

            {/* Mnemonic Etymology / Historical Origin */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1.5 text-xs">
              <span className="font-bold text-amber-900 flex items-center gap-1.5">
                <Sparkles size={13} className="text-amber-600" />
                {isBn ? "ঐতিহাসিক উৎপত্তি ও মনস্তাত্ত্বিক গল্প:" : "Mnemonic Origin Story:"}
              </span>
              <p className="text-amber-950 leading-relaxed">
                {activeRadical.historicalOrigin}
              </p>
              {isBn && (
                <p className="text-amber-900/80 font-bangla text-[11px] leading-relaxed pt-1">
                  {activeRadical.historicalOriginBn}
                </p>
              )}
            </div>

            {/* Character Decomposition Cards */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <Layers size={15} className="text-red-600" />
                <span>
                  {isBn
                    ? "এই মূল বা র‌্যাডিক্যাল দিয়ে গঠিত প্রধান শব্দগুলো:"
                    : "Characters Derived from this Radical:"}
                </span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeRadical.characters.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2.5 hover:border-neutral-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-3xl font-hanzi font-bold text-neutral-900">
                          {item.character}
                        </span>
                        <div>
                          <div className="text-xs font-mono text-red-600 font-semibold">
                            {item.pinyin}
                          </div>
                          <div className="text-xs font-medium text-neutral-800">
                            {item.meaning}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => audioService.speakText(item.character)}
                        className="p-1.5 rounded-lg bg-white border border-neutral-200 hover:text-red-600 text-neutral-500 transition-colors cursor-pointer"
                        title="Listen"
                      >
                        <Volume2 size={13} />
                      </button>
                    </div>

                    {isBn && (
                      <div className="text-[11px] text-emerald-700 font-bangla">
                        {item.meaningBn}
                      </div>
                    )}

                    {/* Component breakdown formula */}
                    <div className="flex items-center gap-1.5 text-[11px] font-mono bg-white p-1.5 rounded-lg border border-neutral-200/70 text-neutral-600">
                      <span className="text-neutral-400">Formula:</span>
                      <span>{item.components.join(" + ")}</span>
                    </div>

                    {/* Mnemonic explanation */}
                    <p className="text-[11px] text-neutral-500 leading-snug">
                      {item.explanation}
                    </p>
                    {isBn && (
                      <p className="text-[10px] text-neutral-400 font-bangla leading-snug">
                        {item.explanationBn}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
