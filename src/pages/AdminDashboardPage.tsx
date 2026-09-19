import React, { useState, useEffect } from "react";
import {
  Users,
  FolderPlus,
  FileCheck,
  TrendingUp,
  ShieldCheck,
  Eye,
  PlusCircle,
  BookOpen,
  CheckCircle2,
  Activity,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Search,
  ExternalLink,
  Layers,
  Database,
  BarChart2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { bengaliService } from "../services/bengaliService";
import { resourceService, CustomResource } from "../services/resourceService";
import { adminStateService } from "../services/adminStateService";
import { navigate } from "../services/routerService";

export const AdminDashboardPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [resources, setResources] = useState<CustomResource[]>([]);
  const [isBn, setIsBn] = useState(bengaliService.getLanguage() === "bn");

  useEffect(() => {
    const unsubB = bengaliService.subscribe(() => {
      setIsBn(bengaliService.getLanguage() === "bn");
    });
    const unsubR = resourceService.subscribeResources((data) => {
      setResources(data);
    });
    return () => {
      unsubB();
      unsubR();
    };
  }, []);

  const handlePreviewStudent = () => {
    adminStateService.setPreviewAsStudent(true);
    navigate("/dashboard");
  };

  // Sample enrolled students records to demonstrate the LMS admin capability
  const studentRecords = [
    {
      id: "std-01",
      name: "Tanzim Ahmed",
      email: "tanzim.graphic@gmail.com",
      dept: "Graphic Arts - Print Dept",
      level: "HSK 2",
      xp: 420,
      streak: 5,
      lastActive: "Today 10:30 AM",
      status: "Active",
    },
    {
      id: "std-02",
      name: "Sabrina Yasmin",
      email: "sabrina.arts@gmail.com",
      dept: "Graphic Arts - Design Dept",
      level: "HSK 1",
      xp: 280,
      streak: 3,
      lastActive: "Yesterday",
      status: "Active",
    },
    {
      id: "std-03",
      name: "Rafiqul Islam",
      email: "rafiq.multimedia@gmail.com",
      dept: "Graphic Arts - Multimedia",
      level: "HSK 3",
      xp: 890,
      streak: 12,
      lastActive: "2 hours ago",
      status: "Excelling",
    },
    {
      id: "std-04",
      name: "Farhana Akter",
      email: "farhana.print@gmail.com",
      dept: "Graphic Arts - Offset Printing",
      level: "HSK 1",
      xp: 150,
      streak: 1,
      lastActive: "3 days ago",
      status: "Learning",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
      {/* Admin Welcome Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-sky-950 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-red-600 text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs">
                <ShieldCheck size={12} />
                ADMIN COMMAND CONSOLE
              </span>
              <span className="text-xs text-neutral-400 font-medium">
                Govt. Graphic Arts Institute
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              {isBn
                ? `স্বাগতম, অ্যাডমিন ${profile?.displayName || "ইন্সট্রাক্টর"}!`
                : `Welcome, Administrator ${profile?.displayName || ""}!`}
            </h1>
            <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">
              {isBn
                ? "এখানে আপনি চাইনিজ একাডেমি কোর্স মেটেরিয়াল, শিক্ষার্থীদের পরীক্ষার রিপোর্ট এবং শব্দভাণ্ডার ডেটাবেস পরিচালনা করতে পারবেন।"
                : "Manage HSK curriculum materials, review enrolled student metrics, and customize learning resources."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Launch Student View Mode */}
            <button
              type="button"
              onClick={handlePreviewStudent}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Eye size={16} />
              <span>{isBn ? "শিক্ষার্থী ভিউ প্রিভিউ করুন" : "Preview Student View"}</span>
            </button>

            {/* Quick Add Resource */}
            <button
              type="button"
              onClick={() => navigate("/admin/resources")}
              className="px-4 py-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-sky-600/30 transition-all cursor-pointer"
            >
              <PlusCircle size={16} />
              <span>{isBn ? "নতুন রিসোর্স ইনপুট" : "Add New Resource"}</span>
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 bottom-0 opacity-10 font-hanzi text-9xl select-none pointer-events-none -mr-8 -mb-10 text-white">
          管理
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Students */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              {isBn ? "মোট শিক্ষার্থী" : "Enrolled Students"}
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl md:text-3xl font-black text-neutral-900 dark:text-white tracking-tight">
              48
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
              <ArrowUpRight size={12} />
              +12% {isBn ? "এই মাসে" : "this month"}
            </span>
          </div>
          <p className="text-[11px] text-neutral-400">
            {isBn ? "গ্রাফিক আর্টস বিভিন্ন বিভাগের শিক্ষার্থী" : "Graphic Arts Institute registered students"}
          </p>
        </div>

        {/* Card 2: Resources In DB */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              {isBn ? "সংরক্ষিত রিসোর্স" : "Custom Materials"}
            </span>
            <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center">
              <FolderPlus size={16} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl md:text-3xl font-black text-neutral-900 dark:text-white tracking-tight">
              {resources.length}
            </span>
            <button
              onClick={() => navigate("/admin/resources")}
              className="text-[11px] font-bold text-[var(--color-primary)] hover:underline flex items-center gap-0.5"
            >
              <span>{isBn ? "ম্যানেজ করুন" : "Manage"}</span>
              <ArrowUpRight size={11} />
            </button>
          </div>
          <p className="text-[11px] text-neutral-400">
            {isBn ? "ফায়ারবেস ক্লাউড ডেটাবেসে সক্রিয়" : "Active in Cloud Firestore database"}
          </p>
        </div>

        {/* Card 3: Mock Exams Completed */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              {isBn ? "মক পরীক্ষা সম্পন্ন" : "Mock Tests Taken"}
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <FileCheck size={16} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl md:text-3xl font-black text-neutral-900 dark:text-white tracking-tight">
              128
            </span>
            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full">
              HSK 1-3
            </span>
          </div>
          <p className="text-[11px] text-neutral-400">
            {isBn ? "অফিসিয়াল সিলেবাস অনুযায়ী মক টেস্ট" : "Official standard timed tests"}
          </p>
        </div>

        {/* Card 4: Average Pass Rate */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              {isBn ? "সাফল্যের হার" : "Average Pass Rate"}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl md:text-3xl font-black text-neutral-900 dark:text-white tracking-tight">
              86.4%
            </span>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
              High
            </span>
          </div>
          <p className="text-[11px] text-neutral-400">
            {isBn ? "এইচএসকে ৬০% পাস মার্কের উপরে" : "Above standard 60% passing mark"}
          </p>
        </div>
      </div>

      {/* Two Column Layout: Students Activity & Quick Action Launchpad */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Enrolled Students Directory */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <Users size={18} className="text-[var(--color-primary)]" />
                <span>{isBn ? "শিক্ষার্থীদের সাম্প্রতিক অগ্রগতি" : "Student Learning Activity"}</span>
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {isBn
                  ? "ইনস্টিটিউটের শিক্ষার্থীদের সক্রিয় স্ট্যাটাস ও অর্জিত লেভেল"
                  : "Overview of enrolled institute students and current levels"}
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 font-bold uppercase text-[10px] tracking-wider">
                  <th className="pb-3 pr-4">{isBn ? "শিক্ষার্থী" : "Student"}</th>
                  <th className="pb-3 px-3">{isBn ? "বিভাগ" : "Department"}</th>
                  <th className="pb-3 px-3">{isBn ? "লেভেল" : "Level"}</th>
                  <th className="pb-3 px-3">{isBn ? "XP ও স্ট্রিক" : "XP / Streak"}</th>
                  <th className="pb-3 pl-3 text-right">{isBn ? "স্ট্যাটাস" : "Status"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {studentRecords.map((std) => (
                  <tr key={std.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                    <td className="py-3.5 pr-4">
                      <div className="font-bold text-neutral-900 dark:text-white">
                        {std.name}
                      </div>
                      <div className="text-[11px] text-neutral-400">{std.email}</div>
                    </td>
                    <td className="py-3.5 px-3 text-neutral-600 dark:text-neutral-300">
                      {std.dept}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 font-bold text-neutral-700 dark:text-neutral-300 text-[11px]">
                        {std.level}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-neutral-700 dark:text-neutral-300">
                      <span className="font-bold text-[var(--color-primary)]">{std.xp} XP</span>
                      <span className="text-neutral-400 ml-1.5">• {std.streak}d</span>
                    </td>
                    <td className="py-3.5 pl-3 text-right">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          std.status === "Excelling"
                            ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400"
                            : "bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400"
                        }`}
                      >
                        {std.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Quick Launchpad & Cloud Health */}
        <div className="space-y-4">
          {/* Quick Action Cards */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Sparkles size={16} className="text-amber-500" />
              <span>{isBn ? "কুইক অ্যাডমিন অ্যাকশন" : "Quick Admin Actions"}</span>
            </h3>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => navigate("/admin/exam-builder")}
                className="w-full p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-emerald-500 hover:bg-emerald-500/5 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-neutral-800 dark:text-neutral-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                    {isBn ? "প্রশ্নপত্র ও কুইজ মেকার" : "Exam Paper Builder"}
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    {isBn ? "নতুন মক টেস্ট তৈরি ও প্রশ্ন পাবলিশ" : "Author HSK mock exam papers"}
                  </div>
                </div>
                <ArrowUpRight size={15} className="text-neutral-400 group-hover:text-emerald-500" />
              </button>

              <button
                type="button"
                onClick={() => navigate("/admin/resources")}
                className="w-full p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-neutral-800 dark:text-neutral-200 group-hover:text-[var(--color-primary)]">
                    {isBn ? "নতুন রিসোর্স ইনপুট করুন" : "Add Course Resource"}
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    {isBn ? "শব্দ, বাক্য, গল্প বা অডিও মেটেরিয়াল" : "Add vocabulary, dialogues, audio"}
                  </div>
                </div>
                <ArrowUpRight size={15} className="text-neutral-400 group-hover:text-[var(--color-primary)]" />
              </button>

              <button
                type="button"
                onClick={() => navigate("/vocabulary")}
                className="w-full p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-neutral-800 dark:text-neutral-200 group-hover:text-[var(--color-primary)]">
                    {isBn ? "শব্দভাণ্ডার ডেটাবেস রিভিউ" : "Vocabulary Database"}
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    {isBn ? "HSK 1-9 লেভেলের সম্পূর্ণ শব্দ তালিকা" : "Inspect full HSK vocabulary database"}
                  </div>
                </div>
                <ArrowUpRight size={15} className="text-neutral-400 group-hover:text-[var(--color-primary)]" />
              </button>

              <button
                type="button"
                onClick={() => navigate("/mistake-book")}
                className="w-full p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-neutral-800 dark:text-neutral-200 group-hover:text-[var(--color-primary)]">
                    {isBn ? "সাধারণ ভুল বিশ্লেষণ" : "Common Mistakes Review"}
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    {isBn ? "যেখানে শিক্ষার্থীরা বেশি ভুল করছে" : "Review high-frequency mistakes"}
                  </div>
                </div>
                <ArrowUpRight size={15} className="text-neutral-400 group-hover:text-[var(--color-primary)]" />
              </button>
            </div>
          </div>

          {/* Infrastructure Health */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Database size={16} className="text-sky-500" />
              <span>{isBn ? "ক্লাউড ও সিস্টেম স্থিতি" : "Platform Health"}</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                <span className="text-neutral-600 dark:text-neutral-400">Firebase Firestore</span>
                <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {isBn ? "সংযুক্ত" : "Connected"}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                <span className="text-neutral-600 dark:text-neutral-400">Speech Audio & TTS</span>
                <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {isBn ? "সক্রিয়" : "Operational"}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                <span className="text-neutral-600 dark:text-neutral-400">AI HanBot Tutor</span>
                <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {isBn ? "প্রস্তুত" : "Ready"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
