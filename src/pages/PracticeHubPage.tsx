import React, { useState, useEffect } from "react";
import { navigate } from "../services/routerService";
import {
  Volume2,
  Edit3,
  BookOpen,
  Mic,
  Sparkles,
  ArrowRight,
  Bot,
  Layers,
  FileCheck,
  Split,
  Globe,
} from "lucide-react";
import { bengaliService } from "../services/bengaliService";

export const PracticeHubPage: React.FC = () => {
  const [isBn, setIsBn] = useState(bengaliService.getLanguage() === "bn");

  useEffect(() => {
    const unsub = bengaliService.subscribe(() => {
      setIsBn(bengaliService.getLanguage() === "bn");
    });
    return unsub;
  }, []);

  const practiceModules = [
    {
      title: isBn ? "এআই স্পিকিং ল্যাব" : "AI Speaking Lab",
      badge: "AI Powered",
      path: "/speaking",
      icon: Mic,
      color: "bg-rose-50 text-rose-700 border-rose-200",
      description: isBn
        ? "মাইক্রোফোন দিয়ে কথা বলুন এবং এআই থেকে উচ্চারণ, টোন এবং ফ্লুয়েন্সির বিস্তারিত স্কোর ও বিশ্লেষণ পান।"
        : "Speak into your microphone and get AI-powered real-time acoustic feedback on tone pitch, pronunciation accuracy, and fluency.",
      actionLabel: isBn ? "স্পিকিং ল্যাব খুলুন" : "Launch Speaking Lab",
    },
    {
      title: isBn ? "SRS ফ্ল্যাশকার্ড ডেক" : "SRS Flashcard Deck",
      badge: "SM-2 Algorithm",
      path: "/flashcards",
      icon: Layers,
      color: "bg-indigo-50 text-indigo-700 border-indigo-200",
      description: isBn
        ? "স্পেসড রিপিটিশন মেমোরি অ্যালগরিদম দিয়ে শব্দ মুখস্থ করুন। অডিও ও ফ্লিপ অ্যানিমেশন সম্বলিত।"
        : "SuperMemo-2 spaced repetition flashcards with bidirectional flip, native audio playback, and personalized memory intervals.",
      actionLabel: isBn ? "ফ্ল্যাশকার্ড শুরু করুন" : "Start Flashcards",
    },
    {
      title: isBn ? "চাইনিজ ছোট গল্প ও সংলাপ" : "Graded Stories & Dialogues",
      badge: "Interactive",
      path: "/stories",
      icon: BookOpen,
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      description: isBn
        ? "প্রতিটি শব্দে ক্লিক করে পিনয়িন ও বাংলা অর্থ দেখুন। সাথে পুরো গল্পের অডিও ও বোধগম্যতা কুইজ।"
        : "HSK-aligned graded readers with interactive word hover, synchronized native audio narration, and comprehension checks.",
      actionLabel: isBn ? "গল্প পড়তে শুরু করুন" : "Read Graded Stories",
    },
    {
      title: isBn ? "র‌্যাডিক্যাল ও বর্ণ বিশ্লেষণ" : "Radicals & Character Anatomy",
      badge: "Visual Breakdown",
      path: "/radicals",
      icon: Split,
      color: "bg-amber-50 text-amber-700 border-amber-200",
      description: isBn
        ? "কঠিন হানজিকে মৌলিক অংশ ও মূল উপাদানে ভেঙে সহজভাবে চরিত্র গঠন ও স্মৃতি কৌশল শিখুন।"
        : "Deconstruct complex Chinese characters into radical building blocks with mnemonics, stroke counts, and derivative families.",
      actionLabel: isBn ? "র‌্যাডিক্যাল শিখুন" : "Explore Radicals",
    },
    {
      title: isBn ? "অফিসিয়াল HSK মক টেস্ট" : "Timed HSK Mock Exam",
      badge: "Full Simulation",
      path: "/exam",
      icon: FileCheck,
      color: "bg-purple-50 text-purple-700 border-purple-200",
      description: isBn
        ? "লিসেনিং, রিডিং ও রাইটিং সেকশনসহ নির্ধারিত সময়ে আসল HSK পরীক্ষার অভিজ্ঞতা ও স্কোরকার্ড।"
        : "Simulated exam conditions with countdown timer, listening audio playback, reading comprehension, and detailed scorecard review.",
      actionLabel: isBn ? "মক টেস্ট শুরু করুন" : "Start Mock Exam",
    },
    {
      title: isBn ? "এআই চাইনিজ টিউটর (হানবট)" : "AI Chinese Tutor (HanBot)",
      badge: "Gemini AI",
      path: "/chat",
      icon: Bot,
      color: "bg-red-50 text-red-700 border-red-200",
      description: isBn
        ? "যেকোনো প্রশ্নের উত্তর, গ্রামার ডাক্তার বিশ্লেষণ, অনুবাদ এবং তাৎক্ষণিক কুইজ নিয়ে ব্যক্তিগত এআই শিক্ষক।"
        : "Conversational roleplay, instant grammar doctor corrections, example sentences, and tailored HSK practice quizzes.",
      actionLabel: isBn ? "হানবটকে প্রশ্ন করুন" : "Chat with HanBot",
    },
    {
      title: isBn ? "টোন ট্রেনিং ল্যাব" : "Tone Training Lab",
      badge: "Pitch Contours",
      path: "/practice/tones",
      icon: Volume2,
      color: "bg-blue-50 text-blue-700 border-blue-200",
      description: isBn
        ? "১ম থেকে ৪র্থ টোন এবং নিউট্রাল টোন আলাদা করার শ্রবণ পরীক্ষা ও ভিজ্যুয়াল পিচ চার্ট।"
        : "Master Mandarin's 5 tones through pitch contour visualization, tone discrimination challenges, and listening drills.",
      actionLabel: isBn ? "টোন অনুশীলন" : "Start Tone Drills",
    },
    {
      title: isBn ? "হানজি রাইটিং ল্যাব" : "Hanzi Writing Lab",
      badge: "Stroke Order",
      path: "/writing",
      icon: Edit3,
      color: "bg-stone-50 text-stone-700 border-stone-200",
      description: isBn
        ? "তিয়ান-জি-গে গ্রিডে সঠিক স্ট্রোক ক্রমে হানজি লেখার অনুশীলন এবং অ্যানিমেশন প্রদর্শন।"
        : "Tactile stroke order training on Tian-Zi-Ge grids with trace outlines, stroke-by-stroke animations, and freehand writing.",
      actionLabel: isBn ? "লেখা শুরু করুন" : "Practice Writing",
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
          {isBn ? "ইন্টারেক্টিভ অনুশীলন কেন্দ্র (Practice Hub)" : "Interactive Practice Hub"}
        </h1>
        <p className="text-sm text-neutral-600 max-w-2xl leading-relaxed">
          {isBn
            ? "শব্দভাণ্ডার মুখস্থের পাশাপাশি স্পিকিং, রিডিং, রাইটিং, ফ্ল্যাশকার্ড ও মক টেস্ট দিয়ে চীনা ভাষায় দক্ষতা অর্জন করুন।"
            : "Master all core Mandarin language skills: phonetics & speaking, character stroke calligraphy, graded reading, spaced repetition, and simulated HSK exams."}
        </p>
      </div>

      {/* Practice Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {practiceModules.map((mod) => {
          const Icon = mod.icon;

          return (
            <div
              key={mod.path}
              className="p-6 rounded-2xl border border-neutral-200 bg-white hover:border-neutral-300 transition-all flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl border ${mod.color}`}>
                    <Icon size={22} />
                  </div>
                  {mod.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200">
                      {mod.badge}
                    </span>
                  )}
                </div>

                <h2 className="text-lg font-bold text-neutral-900 group-hover:text-red-600 transition-colors">
                  {mod.title}
                </h2>
                <p className="text-xs text-neutral-600 leading-relaxed">{mod.description}</p>
              </div>

              <button
                type="button"
                onClick={() => navigate(mod.path)}
                className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
              >
                <span>{mod.actionLabel}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
