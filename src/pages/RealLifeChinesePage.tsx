import React, { useState, useEffect } from "react";
import { REAL_LIFE_TOPICS, RealLifeTopic } from "../services/cultureData";
import { audioService } from "../services/audioService";
import { bengaliService } from "../services/bengaliService";
import {
  Compass,
  Volume2,
  Sparkles,
  Smartphone,
  Car,
  Utensils,
  ShoppingBag,
  Users,
  ChevronRight,
  Info,
} from "lucide-react";

export const RealLifeChinesePage: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<RealLifeTopic>(REAL_LIFE_TOPICS[0]);
  const [isBn, setIsBn] = useState(bengaliService.getLanguage() === "bn");

  useEffect(() => {
    const unsub = bengaliService.subscribe(() => setIsBn(bengaliService.getLanguage() === "bn"));
    return unsub;
  }, []);

  const handleSpeak = (text: string) => {
    audioService.speakText(text);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Banner */}
      <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 md:p-8 space-y-4 shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <Compass size={14} />
            <span>REAL-LIFE CHINESE & SURVIVAL SKILLS</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight">
            {isBn ? "বাস্তব জীবনের চীনা ভাষা ও টিকে থাকার কৌশল" : "Everyday Chinese & Digital Life"}
          </h1>
          <p className="text-xs md:text-sm text-neutral-600 max-w-2xl">
            {isBn
              ? "উইচ্যাট পে, ট্যাক্সি ডাকা, রেস্তোরাঁ ও অনলাইন ডেলিভারির মতো প্রাত্যহিক জীবনের প্রয়োজনীয় পরিস্থিতি।"
              : "Practical expressions, authentic dialogues, and cultural etiquette for living, traveling, and navigating modern China effortlessly."}
          </p>
        </div>

        {/* Topic Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-neutral-100">
          {REAL_LIFE_TOPICS.map((topic) => (
            <button
              key={topic.id}
              type="button"
              onClick={() => setSelectedTopic(topic)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                selectedTopic.id === topic.id
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              <span>{topic.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Topic Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dialogue & Phrases (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Authentic Dialogue Box */}
          <div className="bg-white border border-neutral-200 rounded-3xl p-6 md:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-neutral-900">
                  {selectedTopic.chineseTitle}
                </h2>
                <div className="text-xs text-neutral-500 font-medium mt-0.5">
                  Realistic Dialogue Scenario
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700">
                {selectedTopic.category}
              </span>
            </div>

            <div className="space-y-4">
              {selectedTopic.dialogue.map((line, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-1.5 group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                      {line.speaker}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSpeak(line.hanzi)}
                      className="p-1 rounded-md text-neutral-400 hover:text-emerald-700 cursor-pointer"
                      title="Listen"
                    >
                      <Volume2 size={15} />
                    </button>
                  </div>
                  <div className="font-hanzi text-lg font-bold text-neutral-900">
                    {line.hanzi}
                  </div>
                  <div className="font-mono text-xs text-emerald-700 font-medium">
                    {line.pinyin}
                  </div>
                  <div className="text-xs text-neutral-600">
                    "{line.english}"
                  </div>
                  {isBn && line.bengali && (
                    <div className="text-[11px] text-neutral-500 italic">
                      "{line.bengali}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Survival Quick Phrases */}
          <div className="bg-white border border-neutral-200 rounded-3xl p-6 md:p-8 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={16} className="text-emerald-600" />
              <span>High-Frequency Survival Phrases</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedTopic.survivalPhrases.map((phrase, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-1 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="font-hanzi font-bold text-base text-neutral-900">
                        {phrase.hanzi}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSpeak(phrase.hanzi)}
                        className="p-1 text-neutral-400 hover:text-emerald-700 cursor-pointer"
                      >
                        <Volume2 size={14} />
                      </button>
                    </div>
                    <div className="text-xs font-semibold text-neutral-800">
                      {phrase.english}
                    </div>
                  </div>
                  <div className="text-[10px] text-neutral-500 pt-1 border-t border-neutral-200/50">
                    <strong className="text-neutral-600">Usage: </strong> {phrase.context}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Insights & Cultural Tips (1 col) */}
        <div className="space-y-6">
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-3xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
              <Info size={18} className="text-emerald-700 shrink-0" />
              <span>Cultural & Situational Insider Tip</span>
            </div>
            <p className="text-xs text-emerald-950/90 leading-relaxed">
              {selectedTopic.culturalTip}
            </p>
          </div>

          <div className="bg-white border border-neutral-200 rounded-3xl p-6 space-y-3 shadow-xs">
            <div className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
              Topic Summary
            </div>
            <p className="text-xs text-neutral-700 leading-relaxed">
              {isBn ? selectedTopic.bengaliSummary : selectedTopic.summary}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
