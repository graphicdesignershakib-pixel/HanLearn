import React, { useState, useEffect } from "react";
import { resourceService, CustomResource, ResourceCategory } from "../services/resourceService";
import { bengaliService } from "../services/bengaliService";
import { audioService } from "../services/audioService";
import { useAuth } from "../context/AuthContext";
import {
  BookOpen,
  Layers,
  Volume2,
  Search,
  Sparkles,
  ShieldCheck,
  Globe,
  Bookmark,
  Share2,
} from "lucide-react";
import { navigate } from "../services/routerService";

export const CommunityResourcesPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [resources, setResources] = useState<CustomResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const isBn = bengaliService.getLanguage() === "bn";

  useEffect(() => {
    const unsub = resourceService.subscribeResources((items) => {
      setResources(items);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = resources.filter((item) => {
    const matchCat = selectedCategory === "all" || item.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchQ =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.contentChinese.includes(q) ||
      (item.pinyin && item.pinyin.toLowerCase().includes(q)) ||
      (item.english && item.english.toLowerCase().includes(q)) ||
      (item.bengali && item.bengali.includes(q));
    return matchCat && matchQ;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200">
              <BookOpen size={14} />
              <span>CUSTOM LEARNING LIBRARY</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              {isBn ? "শিক্ষা সম্পদ ও পাঠ্যক্রম লাইব্রেরি" : "Learning Resources & Materials"}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600">
              {isBn
                ? "অ্যাডমিন কর্তৃক প্রণীত ও নিয়মিত আপডেট করা নতুন শব্দ, ব্যাকরণ এবং রিডিং কনটেন্ট।"
                : "Curated materials, vocabulary additions, and authentic Chinese reading texts uploaded by educators."}
            </p>
          </div>

          {isAdmin && (
            <button
              type="button"
              onClick={() => navigate("/admin/resources")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer shrink-0"
            >
              <ShieldCheck size={16} />
              <span>{isBn ? "অ্যাডমিন ইনপুট প্যানেল" : "Admin Input Panel"}</span>
            </button>
          )}
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-neutral-100">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto text-xs pb-1 sm:pb-0">
            {(["all", "vocabulary", "grammar", "reading", "culture"] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl capitalize font-semibold transition-all cursor-pointer shrink-0 ${
                  selectedCategory === cat
                    ? "bg-red-600 text-white shadow-xs"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isBn ? "অনুসন্ধান করুন..." : "Search resources..."}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>
        </div>
      </div>

      {/* Resource Cards */}
      {loading ? (
        <div className="py-16 text-center text-xs text-neutral-400">
          {isBn ? "রিসোর্স লোড হচ্ছে..." : "Loading resources..."}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200/80 space-y-3">
          <BookOpen size={36} className="mx-auto text-neutral-300" />
          <h3 className="text-base font-bold text-neutral-700">
            {isBn ? "এখনও কোনো রিসোর্স যুক্ত করা হয়নি" : "No resources published yet"}
          </h3>
          <p className="text-xs text-neutral-500 max-w-md mx-auto">
            {isBn
              ? "অ্যাডমিন প্যানেলে লগইন করে সহজেই যেকোনো নতুন চীনা পাঠ্যসামগ্রী বা শব্দ ইনপুট দেওয়া যাবে।"
              : "Admins can log in to upload new study materials, sentence patterns, and vocabulary lists."}
          </p>
          {isAdmin && (
            <button
              type="button"
              onClick={() => navigate("/admin/resources")}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors cursor-pointer"
            >
              <ShieldCheck size={15} />
              <span>{isBn ? "রিসোর্স ইনপুট করুন" : "Add Resource Now"}</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-6 border border-neutral-200/80 hover:border-neutral-300 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold uppercase tracking-wider">
                      {item.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 text-[10px] font-bold">
                      HSK {item.hskLevel}
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-400">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
                  </span>
                </div>

                <h3 className="text-base font-bold text-neutral-900 leading-snug">
                  {item.title}
                </h3>

                {/* Hanzi Box */}
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-hanzi text-2xl font-bold text-neutral-900">
                      {item.contentChinese}
                    </div>
                    <button
                      type="button"
                      onClick={() => audioService.speakText(item.contentChinese)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Listen"
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>
                  {item.pinyin && (
                    <div className="font-mono text-xs font-medium text-red-600">{item.pinyin}</div>
                  )}
                </div>

                {/* Meanings */}
                <div className="space-y-1.5 text-xs text-neutral-700">
                  {item.english && (
                    <div>
                      <strong className="text-neutral-500 font-medium">EN: </strong>
                      <span>{item.english}</span>
                    </div>
                  )}
                  {item.bengali && (
                    <div className="text-emerald-800 bg-emerald-50/60 p-2 rounded-xl border border-emerald-100/80 font-bangla">
                      <strong className="text-emerald-600 font-semibold">বাংলা: </strong>
                      <span>{item.bengali}</span>
                    </div>
                  )}
                  {item.notes && (
                    <p className="text-[11px] text-neutral-500 italic pt-1">
                      💡 {item.notes}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
