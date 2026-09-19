import React, { useState, useEffect } from "react";
import { CULTURE_ARTICLES, CultureArticle } from "../services/cultureData";
import { audioService } from "../services/audioService";
import { bengaliService } from "../services/bengaliService";
import {
  Sparkles,
  BookOpen,
  Volume2,
  Clock,
  ArrowRight,
  ChevronRight,
  Heart,
} from "lucide-react";

export const ChineseCulturePage: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<CultureArticle>(CULTURE_ARTICLES[0]);
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
            <Sparkles size={14} />
            <span>CHINESE CULTURE & HERITAGE ACADEMY</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight">
            {isBn ? "চীনা সংস্কৃতি ও ঐতিহ্য একাডেমি" : "Chinese Culture & Heritage"}
          </h1>
          <p className="text-xs md:text-sm text-neutral-600 max-w-2xl">
            {isBn
              ? "চা সংস্কৃতি, লোকউৎসব, প্রাচীন চেংইউ প্রবাদ ও দৈনন্দিন শিষ্টাচারের পেছনের গল্প জানুন।"
              : "Discover the deep history, cultural etiquette, tea ceremonies, and four-character Chengyu idioms shaping Chinese thought."}
          </p>
        </div>

        {/* Article Selector Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-neutral-100">
          {CULTURE_ARTICLES.map((art) => (
            <button
              key={art.id}
              type="button"
              onClick={() => setSelectedArticle(art)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-2 ${
                selectedArticle.id === art.id
                  ? "bg-rose-600 text-white shadow-xs"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              <span>{art.coverEmoji}</span>
              <span>{art.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Article Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Article Text (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-xs">
          <div className="border-b border-neutral-100 pb-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-neutral-100 text-neutral-700">
                {selectedArticle.category}
              </span>
              <span className="text-xs text-neutral-400 flex items-center gap-1 font-medium">
                <Clock size={12} />
                <span>{selectedArticle.readingTime}</span>
              </span>
            </div>

            <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
              {selectedArticle.title}
            </h2>
            <div className="text-sm font-semibold font-hanzi text-neutral-500">
              {selectedArticle.chineseTitle}
            </div>
          </div>

          <p className="text-xs text-neutral-600 italic bg-neutral-50 p-4 rounded-2xl border border-neutral-100 leading-relaxed">
            {isBn ? selectedArticle.bengaliSummary : selectedArticle.summary}
          </p>

          {/* Paragraphs */}
          <div className="space-y-4 text-xs md:text-sm text-neutral-700 leading-relaxed">
            {selectedArticle.contentParagraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
        </div>

        {/* Key Terms & Audio Vocabulary (1 col) */}
        <div className="space-y-6">
          <div className="bg-white border border-neutral-200 rounded-3xl p-6 space-y-4 shadow-xs">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-neutral-100 pb-3">
              <BookOpen size={15} className="text-rose-600" />
              <span>Key Cultural Terms</span>
            </h3>

            <div className="space-y-2.5">
              {selectedArticle.keyTerms.map((t, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-between"
                >
                  <div>
                    <div className="font-hanzi font-bold text-base text-neutral-900">{t.hanzi}</div>
                    <div className="font-mono text-xs text-rose-600 font-semibold">{t.pinyin}</div>
                    <div className="text-[11px] text-neutral-500">{t.english}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSpeak(t.hanzi)}
                    className="p-1.5 rounded-lg hover:bg-neutral-200 text-neutral-600 cursor-pointer"
                    title="Pronounce"
                  >
                    <Volume2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
