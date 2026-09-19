import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { resourceService, CustomResource, ResourceCategory } from "../services/resourceService";
import { bengaliService } from "../services/bengaliService";
import { audioService } from "../services/audioService";
import {
  ShieldAlert,
  ShieldCheck,
  PlusCircle,
  BookOpen,
  Trash2,
  Edit2,
  Volume2,
  Sparkles,
  Layers,
  Save,
  CheckCircle,
  FileText,
  BookmarkPlus,
  Search,
  Filter,
} from "lucide-react";

export const AdminResourcePage: React.FC = () => {
  const { user, profile, isAdmin, loading: authLoading } = useAuth();
  const [resources, setResources] = useState<CustomResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Filter state
  const [activeCategory, setActiveCategory] = useState<ResourceCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // New Resource Form
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ResourceCategory>("vocabulary");
  const [hskLevel, setHskLevel] = useState("1");
  const [contentChinese, setContentChinese] = useState("");
  const [pinyin, setPinyin] = useState("");
  const [english, setEnglish] = useState("");
  const [bengali, setBengali] = useState("");
  const [notes, setNotes] = useState("");

  // Edit Mode state
  const [editingId, setEditingId] = useState<string | null>(null);

  const isBn = bengaliService.getLanguage() === "bn";

  useEffect(() => {
    const unsub = resourceService.subscribeResources((data) => {
      setResources(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const resetForm = () => {
    setTitle("");
    setCategory("vocabulary");
    setHskLevel("1");
    setContentChinese("");
    setPinyin("");
    setEnglish("");
    setBengali("");
    setNotes("");
    setEditingId(null);
  };

  const handleSaveResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      if (editingId) {
        await resourceService.updateResource(editingId, {
          title,
          category,
          hskLevel,
          contentChinese,
          pinyin,
          english,
          bengali,
          notes,
        });
        setStatusMessage({
          text: isBn ? "রিসোর্স সফলভাবে আপডেট করা হয়েছে!" : "Resource updated successfully!",
          type: "success",
        });
      } else {
        await resourceService.addResource({
          title,
          category,
          hskLevel,
          contentChinese,
          pinyin,
          english,
          bengali,
          notes,
          authorUid: user.uid,
          authorEmail: user.email || "admin",
        });
        setStatusMessage({
          text: isBn ? "নতুন রিসোর্স সফলভাবে ডাটাবেজে যুক্ত হয়েছে!" : "New resource published successfully!",
          type: "success",
        });
      }
      resetForm();
    } catch (err: any) {
      console.error("Save resource error:", err);
      setStatusMessage({
        text: err.message || (isBn ? "সংরক্ষণ করতে সমস্যা হয়েছে।" : "Failed to save resource."),
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (res: CustomResource) => {
    if (!res.id) return;
    setEditingId(res.id);
    setTitle(res.title);
    setCategory(res.category);
    setHskLevel(res.hskLevel);
    setContentChinese(res.contentChinese);
    setPinyin(res.pinyin || "");
    setEnglish(res.english || "");
    setBengali(res.bengali || "");
    setNotes(res.notes || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (window.confirm(isBn ? "আপনি কি নিশ্চিতভাবে এই রিসোর্সটি মুছে ফেলতে চান?" : "Are you sure you want to delete this resource?")) {
      try {
        await resourceService.deleteResource(id);
        setStatusMessage({
          text: isBn ? "রিসোর্স মুছে ফেলা হয়েছে。" : "Resource deleted.",
          type: "success",
        });
      } catch (err: any) {
        setStatusMessage({
          text: err.message || "Failed to delete",
          type: "error",
        });
      }
    }
  };

  if (authLoading) {
    return (
      <div className="p-12 text-center text-neutral-500">
        {isBn ? "অ্যাডমিন অনুমতি যাচাই করা হচ্ছে..." : "Verifying admin credentials..."}
      </div>
    );
  }

  // If user is not admin
  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto p-8 my-10 bg-red-50 border border-red-200 rounded-3xl text-center space-y-4">
        <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
          <ShieldAlert size={32} />
        </div>
        <h2 className="text-xl font-extrabold text-red-900">
          {isBn ? "অ্যাডমিন অ্যাক্সেস সংরক্ষিত" : "Admin Portal Restricted"}
        </h2>
        <p className="text-sm text-red-700">
          {isBn
            ? "এই পৃষ্ঠাটি শুধুমাত্র অ্যাডমিনদের জন্য। নতুন পাঠ্যক্রম, শব্দভাণ্ডার বা পড়ার রিসোর্স ইনপুট দেওয়ার জন্য অ্যাডমিন হিসেবে লগইন করুন।"
            : "This portal is reserved for authorized administrators to input Chinese learning resources, stories, and grammar materials."}
        </p>
        <p className="text-xs text-neutral-500 font-mono">
          Current logged in: {user?.email || "Guest"}
        </p>
      </div>
    );
  }

  const filteredResources = resources.filter((r) => {
    const matchesCat = activeCategory === "all" || r.category === activeCategory;
    const matchesQuery =
      searchQuery === "" ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.contentChinese.includes(searchQuery) ||
      (r.english && r.english.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.bengali && r.bengali.includes(searchQuery));
    return matchesCat && matchesQuery;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 text-white rounded-3xl p-6 sm:p-8 border border-neutral-800 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30">
              <ShieldCheck size={14} />
              <span>ADMINISTRATOR RESOURCE PORTAL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {isBn ? "রিসোর্স ইনপুট ও ব্যবস্থাপনা প্যানেল" : "Resource Input & Database Hub"}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300">
              {isBn
                ? "নতুন চীনা শব্দ, বাক্য, ব্যাকরণ নিয়ম ও রিডিং ম্যাটেরিয়াল ক্লাউড ডাটাবেজে ইনপুট দিন।"
                : "Publish new vocabulary, grammar points, reading texts, and cultural insights directly to all learners."}
            </p>
          </div>

          <div className="text-right sm:border-l sm:border-neutral-700 sm:pl-6 text-xs text-neutral-400">
            <div>Logged in as:</div>
            <div className="font-bold text-white text-sm">{profile?.displayName || user?.email}</div>
            <span className="inline-block mt-1 px-2 py-0.5 rounded bg-red-600/80 text-white text-[10px] font-bold">
              SUPER ADMIN
            </span>
          </div>
        </div>
      </div>

      {/* Notification status */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between gap-2 border ${
            statusMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === "success" ? <CheckCircle size={16} /> : <ShieldAlert size={16} />}
            <span>{statusMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusMessage(null)}
            className="text-xs underline opacity-75 hover:opacity-100 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Input Form Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
          <div className="flex items-center gap-2">
            <PlusCircle size={20} className="text-red-600" />
            <h2 className="text-lg font-bold text-neutral-900">
              {editingId
                ? (isBn ? "রিসোর্স সম্পাদনা করুন" : "Edit Resource")
                : (isBn ? "নতুন রিসোর্স ইনপুট করুন" : "Create New Resource")}
            </h2>
          </div>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs font-semibold text-neutral-500 hover:text-neutral-800 cursor-pointer"
            >
              {isBn ? "বাতিল করুন" : "Cancel Edit"}
            </button>
          )}
        </div>

        <form onSubmit={handleSaveResource} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Title */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                {isBn ? "শিরোনাম (Title)" : "Resource Title"} *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Essential Dining Vocabulary / Ordering Food"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                {isBn ? "ক্যাটাগরি" : "Category"} *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ResourceCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
              >
                <option value="vocabulary">Vocabulary (শব্দকোষ)</option>
                <option value="grammar">Grammar Point (ব্যাকরণ)</option>
                <option value="reading">Reading Passage (পঠন)</option>
                <option value="culture">Chinese Culture (সংস্কৃতি)</option>
                <option value="other">General Resource (অন্যান্য)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {/* HSK Level */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                HSK Level
              </label>
              <select
                value={hskLevel}
                onChange={(e) => setHskLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white font-semibold"
              >
                <option value="1">HSK 1</option>
                <option value="2">HSK 2</option>
                <option value="3">HSK 3</option>
                <option value="4">HSK 4</option>
                <option value="5">HSK 5</option>
                <option value="6">HSK 6</option>
                <option value="3.0">HSK 3.0 (General)</option>
              </select>
            </div>

            {/* Chinese Characters (Hanzi) */}
            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                {isBn ? "চীনা অক্ষর (Hanzi)" : "Chinese Characters (Hanzi)"} *
              </label>
              <input
                type="text"
                required
                value={contentChinese}
                onChange={(e) => setContentChinese(e.target.value)}
                placeholder="e.g. 欢迎光临！你想吃什么？"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm font-hanzi text-base focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Pinyin */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              {isBn ? "পিনয়িন (Pinyin)" : "Pinyin with Tone Marks"}
            </label>
            <input
              type="text"
              value={pinyin}
              onChange={(e) => setPinyin(e.target.value)}
              placeholder="e.g. Huānyíng guānglín! Nǐ xiǎng chī shénme?"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* English & Bengali Meanings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                English Translation / Explanation
              </label>
              <textarea
                rows={2}
                value={english}
                onChange={(e) => setEnglish(e.target.value)}
                placeholder="e.g. Welcome! What would you like to eat?"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1 font-bangla">
                বাংলা অনুবাদ ও ব্যাখ্যা (Bengali Meaning)
              </label>
              <textarea
                rows={2}
                value={bengali}
                onChange={(e) => setBengali(e.target.value)}
                placeholder="যেমন: স্বাগতম! আপনি কী খেতে চান?"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-bangla"
              />
            </div>
          </div>

          {/* Notes & Usage Tips */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              {isBn ? "অতিরিক্ত নোট / টিপস (Notes / Grammar Rules)" : "Pedagogical Notes / Grammar Rules"}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Often said by restaurant staff when guests enter. '你想' shows polite intent."
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              {isBn ? "রিসেট" : "Reset"}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm disabled:opacity-50"
            >
              <Save size={15} />
              <span>
                {isSubmitting
                  ? (isBn ? "সংরক্ষণ হচ্ছে..." : "Saving...")
                  : editingId
                  ? (isBn ? "আপডেট সম্পন্ন করুন" : "Update Resource")
                  : (isBn ? "রিসোর্স প্রকাশ করুন" : "Publish to Database")}
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* Published Resources List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <Layers size={18} className="text-red-600" />
              <span>{isBn ? "প্রকাশিত রিসোর্স তালিকা" : "Published Learning Resources"}</span>
              <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 text-xs font-semibold">
                {resources.length}
              </span>
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              {isBn
                ? "ডাটাবেজে সংরক্ষিত উপাদানসমূহ। সকল শিক্ষার্থী এগুলো দেখতে পারবে।"
                : "Live educational resources synchronized across all students."}
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isBn ? "অনুসন্ধান..." : "Filter resources..."}
                className="pl-8 pr-3 py-1.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:ring-1 focus:ring-red-500 w-36 sm:w-48"
              />
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {(["all", "vocabulary", "grammar", "reading", "culture", "other"] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl capitalize font-semibold transition-all cursor-pointer shrink-0 ${
                activeCategory === cat
                  ? "bg-red-600 text-white shadow-xs"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Resources Grid/List */}
        {loading ? (
          <div className="py-12 text-center text-xs text-neutral-400">
            {isBn ? "রিসোর্স লোড হচ্ছে..." : "Loading resources from Firestore..."}
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="py-12 text-center space-y-2 border border-dashed border-neutral-200 rounded-2xl">
            <BookmarkPlus size={32} className="mx-auto text-neutral-300" />
            <div className="text-sm font-bold text-neutral-700">
              {isBn ? "কোনো রিসোর্স পাওয়া যায়নি" : "No resources found"}
            </div>
            <p className="text-xs text-neutral-500">
              {isBn
                ? "উপরের ফর্মটি পূরণ করে প্রথম রিসোর্সটি ডাটাবেজে যুক্ত করুন।"
                : "Fill out the form above to add educational items for students."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredResources.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl border border-neutral-200/90 hover:border-neutral-300 bg-neutral-50/50 hover:bg-white transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-700 text-[10px] font-bold uppercase">
                        {item.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-neutral-200 text-neutral-700 text-[10px] font-bold">
                        HSK {item.hskLevel}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-neutral-900">{item.title}</h3>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEditClick(item)}
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg text-red-400 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Hanzi & Pinyin */}
                <div className="bg-white p-3 rounded-xl border border-neutral-200/70 space-y-1">
                  <div className="flex items-baseline justify-between">
                    <span className="font-hanzi text-xl font-bold text-neutral-900 tracking-wide">
                      {item.contentChinese}
                    </span>
                    <button
                      type="button"
                      onClick={() => audioService.speakText(item.contentChinese)}
                      className="text-neutral-400 hover:text-red-600 cursor-pointer p-1"
                    >
                      <Volume2 size={15} />
                    </button>
                  </div>
                  {item.pinyin && (
                    <div className="font-mono text-xs text-red-600">{item.pinyin}</div>
                  )}
                </div>

                {/* Meanings */}
                <div className="text-xs space-y-1 text-neutral-700">
                  {item.english && (
                    <div>
                      <span className="font-semibold text-neutral-400">EN: </span>
                      {item.english}
                    </div>
                  )}
                  {item.bengali && (
                    <div className="text-emerald-800 font-bangla">
                      <span className="font-semibold text-emerald-600">বাংলা: </span>
                      {item.bengali}
                    </div>
                  )}
                  {item.notes && (
                    <div className="text-[11px] text-neutral-500 italic pt-1 border-t border-neutral-100">
                      💡 {item.notes}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
