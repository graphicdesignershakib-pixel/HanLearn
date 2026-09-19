import React, { useState, useEffect } from "react";
import {
  FileCheck,
  PlusCircle,
  Trash2,
  Save,
  Eye,
  CheckCircle2,
  AlertCircle,
  Download,
  Upload,
  Layers,
  Sparkles,
  ArrowLeft,
  ChevronDown,
  Clock,
  Award,
  HelpCircle,
} from "lucide-react";
import { questionBankService } from "../services/exam/questionBankService";
import { HskLevel } from "../types/hsk";
import { ExamQuestion, HskMockExamPaper, ExamSkill, ExamQuestionType } from "../types/exam";
import { bengaliService } from "../services/bengaliService";
import { navigate } from "../services/routerService";

export const AdminExamBuilderPage: React.FC = () => {
  const [isBn, setIsBn] = useState(bengaliService.getLanguage() === "bn");

  // Paper Meta
  const [paperTitleEn, setPaperTitleEn] = useState("HSK 2 Mid-Term Special Mock Exam");
  const [paperTitleZh, setPaperTitleZh] = useState("HSK 2级期中全真模拟试卷");
  const [paperTitleBn, setPaperTitleBn] = useState("HSK ২ মিড-টার্ম স্পেশাল মক টেস্ট");
  const [selectedLevel, setSelectedLevel] = useState<HskLevel>("2");
  const [durationMinutes, setDurationMinutes] = useState(55);
  const [passingScore, setPassingScore] = useState(120);

  // Questions List
  const [questions, setQuestions] = useState<ExamQuestion[]>([
    {
      id: "q-sample-1",
      questionNumber: 1,
      level: "2",
      section: "reading",
      sectionPart: 1,
      skill: "reading",
      type: "reading_mcq",
      difficulty: 2,
      points: 5,
      promptZh: "我想去北京旅游。(Wǒ xiǎng qù Běijīng lǚyóu.)",
      promptBn: "আমি বেইজিংয়ে ভ্রমণে যেতে চাই। এর সঠিক অর্থ কোনটি?",
      options: [
        { key: "A", textZh: "I want to travel to Beijing." },
        { key: "B", textZh: "I am working in Beijing." },
        { key: "C", textZh: "Beijing is very cold today." },
        { key: "D", textZh: "I bought a flight to Shanghai." },
      ],
      correctAnswer: "A",
      explanationZh: "‘旅游’ 的意思是旅行。",
      explanationEn: "‘旅游 (lǚyóu)’ means to travel or tour.",
      explanationBn: "‘旅游 (lǚyóu)’ শব্দের অর্থ হলো ভ্রমণ করা বা পর্যটন।",
      status: "published",
      source: "admin authored",
    },
    {
      id: "q-sample-2",
      questionNumber: 2,
      level: "2",
      section: "reading",
      sectionPart: 2,
      skill: "reading",
      type: "reading_mcq",
      difficulty: 2,
      points: 5,
      promptZh: "A: 你喜欢喝什么？ B: 我最喜欢喝中国茶。(Wǒ zuì xǐhuan hē zhōngguó chá.)",
      promptBn: "প্রশ্ন: B কী পান করতে সবচেয়ে ভালোবাসে?",
      options: [
        { key: "A", textZh: "咖啡 (Coffee)" },
        { key: "B", textZh: "中国茶 (Chinese tea)" },
        { key: "C", textZh: "牛奶 (Milk)" },
        { key: "D", textZh: "苹果汁 (Apple juice)" },
      ],
      correctAnswer: "B",
      explanationZh: "根据原话，B最喜欢喝中国茶。",
      explanationEn: "Speaker B directly states: '我最喜欢喝中国茶'.",
      explanationBn: "বক্তা B সরাসরি বলেছেন: 'আমি চাইনিজ চা পান করতে সবচেয়ে ভালোবাসি'。",
      status: "published",
      source: "admin authored",
    },
  ]);

  // Current Question Form being edited or added
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formSkill, setFormSkill] = useState<ExamSkill>("reading");
  const [formPoints, setFormPoints] = useState<number>(5);
  const [formPromptZh, setFormPromptZh] = useState("");
  const [formPromptBn, setFormPromptBn] = useState("");
  const [formOptA, setFormOptA] = useState("");
  const [formOptB, setFormOptB] = useState("");
  const [formOptC, setFormOptC] = useState("");
  const [formOptD, setFormOptD] = useState("");
  const [formCorrectAnswer, setFormCorrectAnswer] = useState<string>("A");
  const [formExplanationBn, setFormExplanationBn] = useState("");

  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const unsub = bengaliService.subscribe(() => {
      setIsBn(bengaliService.getLanguage() === "bn");
    });
    return unsub;
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const totalPoints = questions.reduce((acc, q) => acc + q.points, 0);

  const handleAddOrSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPromptZh.trim()) {
      showToast(isBn ? "অনুগ্রহ করে চীনা প্রম্পট বা প্রশ্ন লিখুন" : "Please enter question prompt");
      return;
    }

    const questionType: ExamQuestionType = formSkill === "listening" ? "listening_mcq" : "reading_mcq";

    const newQuestion: ExamQuestion = {
      id: editingIndex !== null ? questions[editingIndex].id : `custom_q_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      questionNumber: editingIndex !== null ? questions[editingIndex].questionNumber : questions.length + 1,
      level: selectedLevel,
      section: formSkill,
      sectionPart: 1,
      skill: formSkill,
      type: questionType,
      difficulty: 2,
      points: formPoints,
      promptZh: formPromptZh,
      promptBn: formPromptBn,
      options: [
        { key: "A", textZh: formOptA || "Option A" },
        { key: "B", textZh: formOptB || "Option B" },
        { key: "C", textZh: formOptC || "Option C" },
        { key: "D", textZh: formOptD || "Option D" },
      ],
      correctAnswer: formCorrectAnswer,
      explanationZh: formExplanationBn,
      explanationEn: formExplanationBn,
      explanationBn: formExplanationBn,
      status: "published",
      source: "admin authored",
    };

    if (editingIndex !== null) {
      const updated = [...questions];
      updated[editingIndex] = newQuestion;
      setQuestions(updated);
      setEditingIndex(null);
      showToast(isBn ? "প্রশ্নটি সফলভাবে আপডেট করা হয়েছে!" : "Question updated successfully!");
    } else {
      setQuestions([...questions, newQuestion]);
      showToast(isBn ? "নতুন প্রশ্ন যোগ করা হয়েছে!" : "Question added successfully!");
    }

    // Reset Form
    setFormPromptZh("");
    setFormPromptBn("");
    setFormOptA("");
    setFormOptB("");
    setFormOptC("");
    setFormOptD("");
    setFormExplanationBn("");
  };

  const handleEditQuestion = (index: number) => {
    const q = questions[index];
    setEditingIndex(index);
    setFormSkill(q.skill);
    setFormPoints(q.points);
    setFormPromptZh(q.promptZh || "");
    setFormPromptBn(q.promptBn || "");
    setFormOptA(q.options?.[0]?.textZh || "");
    setFormOptB(q.options?.[1]?.textZh || "");
    setFormOptC(q.options?.[2]?.textZh || "");
    setFormOptD(q.options?.[3]?.textZh || "");
    setFormCorrectAnswer(q.correctAnswer);
    setFormExplanationBn(q.explanationBn || "");
  };

  const handleDeleteQuestion = (index: number) => {
    const updated = questions.filter((_, i) => i !== index).map((q, idx) => ({
      ...q,
      questionNumber: idx + 1,
    }));
    setQuestions(updated);
    showToast(isBn ? "প্রশ্ন মুছে ফেলা হয়েছে" : "Question deleted");
  };

  const handlePublishPaper = () => {
    if (questions.length === 0) {
      showToast(isBn ? "অন্তত একটি প্রশ্ন যোগ করুন" : "Add at least one question");
      return;
    }

    const paperId = `custom_paper_${Date.now()}`;
    const newPaper: HskMockExamPaper = {
      id: paperId,
      paperCode: `MOCK-${selectedLevel}-CUSTOM-${Date.now().toString().slice(-4)}`,
      hskLevel: selectedLevel,
      titleZh: paperTitleZh,
      titleEn: paperTitleEn,
      titleBn: paperTitleBn,
      examType: "full_mock",
      durationMinutes: durationMinutes,
      maxScore: totalPoints,
      passingScore: Math.min(passingScore, totalPoints),
      questions: questions,
      status: "published",
      createdAt: new Date().toISOString(),
      version: "3.0-Custom",
    };

    // Save into questionBankService
    try {
      const existing = questionBankService.getAllPapers();
      existing.push(newPaper);
      questions.forEach((q) => questionBankService.addCustomQuestion(q));

      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("hanlearn_exam_papers_v1");
        const list = stored ? JSON.parse(stored) : [];
        list.push(newPaper);
        localStorage.setItem("hanlearn_exam_papers_v1", JSON.stringify(list));
      }

      showToast(isBn ? "🎉 প্রশ্নপত্র সফলভাবে পাবলিশ করা হয়েছে! এটি মক টেস্ট সেকশনে যুক্ত হয়েছে।" : "🎉 Exam paper published! Students can now take this mock test.");
      setTimeout(() => navigate("/exam"), 1500);
    } catch (e) {
      console.error(e);
      showToast(isBn ? "সংরক্ষণ করতে সমস্যা হয়েছে" : "Failed to publish paper");
    }
  };

  const handleExportJson = () => {
    const data = {
      paperTitleEn,
      paperTitleZh,
      paperTitleBn,
      selectedLevel,
      durationMinutes,
      passingScore,
      questions,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hanlearn_paper_${selectedLevel}_${Date.now()}.json`;
    a.click();
    showToast(isBn ? "JSON ডাউনলোড সম্পন্ন হয়েছে" : "Exported paper as JSON");
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fadeIn">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-neutral-900 text-white font-bold text-xs shadow-xl flex items-center gap-2 border border-neutral-700 animate-slideDown">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-sky-950 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/admin")}
              className="text-neutral-400 hover:text-white flex items-center gap-1 text-xs font-semibold cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>{isBn ? "অ্যাডমিন প্যানেল" : "Admin Console"}</span>
            </button>
            <span className="text-neutral-600">/</span>
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
              EXAM CREATOR
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white">
            {isBn ? "প্রশ্নপত্র ও কুইজ মেকার" : "Exam Paper & Quiz Builder"}
          </h1>
          <p className="text-xs text-neutral-300">
            {isBn
              ? "শিক্ষার্থীদের জন্য নতুন মক টেস্ট ও কুইজ তৈরি করুন, প্রশ্ন কাস্টমাইজ করুন এবং সরাসরি পাবলিশ করুন।"
              : "Create custom HSK mock test papers, author questions with audio prompts, and publish for learners."}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleExportJson}
            className="px-3 py-2 rounded-xl border border-neutral-700 hover:border-neutral-500 bg-neutral-800 text-neutral-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download size={14} />
            <span>JSON</span>
          </button>

          <button
            type="button"
            onClick={handlePublishPaper}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
          >
            <Save size={15} />
            <span>{isBn ? "টেস্ট পাবলিশ করুন" : "Publish Paper"}</span>
          </button>
        </div>
      </div>

      {/* Paper Metadata Config Grid */}
      <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <FileCheck size={16} className="text-[var(--color-primary)]" />
          <span>{isBn ? "পরীক্ষার বিবরণ ও কনফিগারেশন" : "Exam Configuration & Meta"}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
              {isBn ? "এইচএসকে লেভেল (HSK Level)" : "HSK Level"}
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as HskLevel)}
              className="w-full p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none font-bold text-neutral-800 dark:text-neutral-200 focus:ring-1 focus:ring-[var(--color-primary)] cursor-pointer"
            >
              <option value="1">HSK Level 1</option>
              <option value="2">HSK Level 2</option>
              <option value="3">HSK Level 3</option>
              <option value="4">HSK Level 4</option>
              <option value="5">HSK Level 5</option>
              <option value="6">HSK Level 6</option>
              <option value="7-9">HSK Level 7-9 (Advanced)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
              {isBn ? "সময় (মিনিট)" : "Duration (Minutes)"}
            </label>
            <input
              type="number"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              min={5}
              max={180}
              className="w-full p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none font-bold text-neutral-800 dark:text-neutral-200 focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
              {isBn ? "পাসিং মার্ক (Passing Score)" : "Passing Score"}
            </label>
            <input
              type="number"
              value={passingScore}
              onChange={(e) => setPassingScore(Number(e.target.value))}
              min={10}
              max={300}
              className="w-full p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none font-bold text-neutral-800 dark:text-neutral-200 focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
              {isBn ? "মোট প্রশ্ন ও নম্বর" : "Summary"}
            </label>
            <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 font-extrabold text-[var(--color-primary)] flex items-center justify-between">
              <span>{questions.length} Questions</span>
              <span>{totalPoints} Total Marks</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
              {isBn ? "ইংরেজি শিরোনাম (Title EN)" : "Title EN"}
            </label>
            <input
              type="text"
              value={paperTitleEn}
              onChange={(e) => setPaperTitleEn(e.target.value)}
              className="w-full p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none text-neutral-800 dark:text-neutral-200"
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
              {isBn ? "চীনা শিরোনাম (Title ZH)" : "Title ZH"}
            </label>
            <input
              type="text"
              value={paperTitleZh}
              onChange={(e) => setPaperTitleZh(e.target.value)}
              className="w-full p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none font-hanzi text-neutral-800 dark:text-neutral-200"
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
              {isBn ? "বাংলা শিরোনাম (Title BN)" : "Title BN"}
            </label>
            <input
              type="text"
              value={paperTitleBn}
              onChange={(e) => setPaperTitleBn(e.target.value)}
              className="w-full p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none text-neutral-800 dark:text-neutral-200"
            />
          </div>
        </div>
      </div>

      {/* Two Column Layout: Question Creator Form & Live Questions List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 cols: Question Builder Form */}
        <div className="lg:col-span-6 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <PlusCircle size={16} className="text-[var(--color-primary)]" />
              <span>
                {editingIndex !== null
                  ? isBn
                    ? `প্রশ্ন #${editingIndex + 1} সম্পাদনা করুন`
                    : `Edit Question #${editingIndex + 1}`
                  : isBn
                  ? "নতুন প্রশ্ন তৈরি করুন"
                  : "Add New Question"}
              </span>
            </h3>

            {editingIndex !== null && (
              <button
                type="button"
                onClick={() => {
                  setEditingIndex(null);
                  setFormPromptZh("");
                  setFormPromptBn("");
                  setFormOptA("");
                  setFormOptB("");
                  setFormOptC("");
                  setFormOptD("");
                  setFormExplanationBn("");
                }}
                className="text-xs text-neutral-400 hover:text-red-500 font-semibold cursor-pointer"
              >
                {isBn ? "বাতিল" : "Cancel"}
              </button>
            )}
          </div>

          <form onSubmit={handleAddOrSaveQuestion} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  {isBn ? "স্কিল সেকশন" : "Section Skill"}
                </label>
                <select
                  value={formSkill}
                  onChange={(e) => setFormSkill(e.target.value as ExamSkill)}
                  className="w-full p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none font-bold text-neutral-800 dark:text-neutral-200"
                >
                  <option value="reading">Reading (阅读)</option>
                  <option value="listening">Listening (听力)</option>
                  <option value="writing">Writing (书写)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  {isBn ? "নম্বর (Points)" : "Points"}
                </label>
                <input
                  type="number"
                  value={formPoints}
                  onChange={(e) => setFormPoints(Number(e.target.value))}
                  min={1}
                  max={20}
                  className="w-full p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none font-bold text-neutral-800 dark:text-neutral-200"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {isBn ? "চীনা প্রশ্ন বা বাক্য (Chinese Prompt)" : "Chinese Prompt / Text"} *
              </label>
              <textarea
                value={formPromptZh}
                onChange={(e) => setFormPromptZh(e.target.value)}
                placeholder="例如: 我想去北京旅游。(Wǒ xiǎng qù Běijīng lǚyóu.)"
                rows={2}
                className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none font-hanzi text-sm text-neutral-800 dark:text-neutral-200 focus:ring-1 focus:ring-[var(--color-primary)]"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {isBn ? "বাংলা প্রশ্ন বা নির্দেশিকা (Bengali Subtitle / Prompt)" : "Bengali Translation / Instruction"}
              </label>
              <input
                type="text"
                value={formPromptBn}
                onChange={(e) => setFormPromptBn(e.target.value)}
                placeholder="যেমন: বাক্যটির সঠিক অর্থ চিহ্নিত করুন"
                className="w-full p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none text-neutral-800 dark:text-neutral-200"
              />
            </div>

            {/* Options */}
            <div className="space-y-2 pt-1">
              <label className="block font-bold text-neutral-700 dark:text-neutral-300">
                {isBn ? "অপশনসমূহ (Options A, B, C, D)" : "Answer Options"}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-bold text-neutral-500 mr-1">A:</span>
                  <input
                    type="text"
                    value={formOptA}
                    onChange={(e) => setFormOptA(e.target.value)}
                    placeholder="Option A"
                    className="w-full mt-0.5 p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none text-neutral-800 dark:text-neutral-200"
                  />
                </div>
                <div>
                  <span className="font-bold text-neutral-500 mr-1">B:</span>
                  <input
                    type="text"
                    value={formOptB}
                    onChange={(e) => setFormOptB(e.target.value)}
                    placeholder="Option B"
                    className="w-full mt-0.5 p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none text-neutral-800 dark:text-neutral-200"
                  />
                </div>
                <div>
                  <span className="font-bold text-neutral-500 mr-1">C:</span>
                  <input
                    type="text"
                    value={formOptC}
                    onChange={(e) => setFormOptC(e.target.value)}
                    placeholder="Option C"
                    className="w-full mt-0.5 p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none text-neutral-800 dark:text-neutral-200"
                  />
                </div>
                <div>
                  <span className="font-bold text-neutral-500 mr-1">D:</span>
                  <input
                    type="text"
                    value={formOptD}
                    onChange={(e) => setFormOptD(e.target.value)}
                    placeholder="Option D"
                    className="w-full mt-0.5 p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none text-neutral-800 dark:text-neutral-200"
                  />
                </div>
              </div>
            </div>

            {/* Correct Answer */}
            <div className="pt-1">
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {isBn ? "সঠিক উত্তর নির্বাচন করুন" : "Correct Option"}
              </label>
              <div className="flex items-center gap-2">
                {["A", "B", "C", "D"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setFormCorrectAnswer(opt)}
                    className={`flex-1 py-2 rounded-xl font-black text-xs transition-all cursor-pointer ${
                      formCorrectAnswer === opt
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200"
                    }`}
                  >
                    Option {opt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {isBn ? "ব্যাখ্যা বা হিন্ট (Explanation / Hint)" : "Explanation / Hint (Bengali)"}
              </label>
              <input
                type="text"
                value={formExplanationBn}
                onChange={(e) => setFormExplanationBn(e.target.value)}
                placeholder="যেমন: ‘旅游’ শব্দের অর্থ ভ্রমণ করা..."
                className="w-full p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none text-neutral-800 dark:text-neutral-200"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-extrabold text-xs transition-all cursor-pointer shadow-xs"
            >
              {editingIndex !== null
                ? isBn
                  ? "আপডেট করুন"
                  : "Save Changes"
                : isBn
                ? "+ প্রশ্নটি তালিকায় যোগ করুন"
                : "+ Add Question to Paper"}
            </button>
          </form>
        </div>

        {/* Right 6 cols: Live Paper Questions Preview */}
        <div className="lg:col-span-6 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <Eye size={16} className="text-sky-500" />
                <span>{isBn ? "প্রশ্নপত্রের প্রিভিউ" : "Exam Questions Preview"}</span>
              </h3>
              <p className="text-[11px] text-neutral-400">
                {questions.length} {isBn ? "টি প্রশ্ন অন্তর্ভুক্ত" : "questions in this mock"}
              </p>
            </div>

            <span className="text-xs font-bold text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2 py-0.5 rounded-md">
              {totalPoints} Marks
            </span>
          </div>

          <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1 scrollbar-thin">
            {questions.map((q, idx) => (
              <div
                key={q.id}
                className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 text-xs space-y-2 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-[var(--color-primary)]">
                    Q{idx + 1}. [{q.skill.toUpperCase()}] • {q.points} pts
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleEditQuestion(idx)}
                      className="px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-bold hover:bg-[var(--color-primary)] hover:text-white transition-colors cursor-pointer"
                    >
                      {isBn ? "এডিট" : "Edit"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteQuestion(idx)}
                      className="p-1 rounded text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/60 transition-colors cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div className="font-hanzi text-sm font-bold text-neutral-900 dark:text-white">
                  {q.promptZh}
                </div>
                {q.promptBn && (
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    {q.promptBn}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  {q.options?.map((opt) => (
                    <div
                      key={opt.key}
                      className={`p-1.5 rounded-lg text-[11px] border flex items-center justify-between ${
                        opt.key === q.correctAnswer
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold"
                          : "border-neutral-200 dark:border-neutral-700/60 text-neutral-600 dark:text-neutral-400"
                      }`}
                    >
                      <span>
                        <b>{opt.key}:</b> {opt.textZh || (opt as any).text}
                      </span>
                      {opt.key === q.correctAnswer && (
                        <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                      )}
                    </div>
                  ))}
                </div>

                {q.explanationBn && (
                  <div className="text-[10px] text-neutral-400 italic pt-0.5">
                    💡 {q.explanationBn}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
