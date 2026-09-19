import React, { useState, useEffect } from "react";
import {
  Award,
  Timer,
  BookOpen,
  Volume2,
  PenTool,
  Languages,
  Mic,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Play,
  ChevronRight,
  ChevronLeft,
  Calendar,
  ShieldCheck,
  Zap,
  ArrowRight,
  Info,
  Sparkles,
} from "lucide-react";
import { HskLevel } from "../types/hsk";
import {
  ExamAttempt,
  ExamMode,
  ExamSkill,
  HskMockExamPaper,
  MockExamType,
} from "../types/exam";
import { OFFICIAL_HSK_CONFIGS } from "../data/exam/examConfigs";
import { questionBankService } from "../services/exam/questionBankService";
import { examSessionService } from "../services/exam/examSessionService";
import { bengaliService } from "../services/bengaliService";
import { HSKBadge } from "../components/common/HSKBadge";
import { ExamTopBar } from "../components/exam/ExamTopBar";
import { QuestionNavigator } from "../components/exam/QuestionNavigator";
import { ListeningQuestionCard } from "../components/exam/ListeningQuestionCard";
import { ReadingQuestionCard } from "../components/exam/ReadingQuestionCard";
import { WritingQuestionCard } from "../components/exam/WritingQuestionCard";
import { SpeakingQuestionCard } from "../components/exam/SpeakingQuestionCard";
import { TranslationQuestionCard } from "../components/exam/TranslationQuestionCard";
import { ExamResultsDashboard } from "../components/exam/ExamResultsDashboard";
import { ExamHistoryModal } from "../components/exam/ExamHistoryModal";
import { AdminExamModal } from "../components/exam/AdminExamModal";

export const MockExamPage: React.FC = () => {
  const [isBn, setIsBn] = useState(bengaliService.getLanguage() === "bn");
  const [viewState, setViewState] = useState<"library" | "active_exam" | "results">("library");

  // Selection state
  const [selectedLevel, setSelectedLevel] = useState<HskLevel>("1");
  const [selectedExamType, setSelectedExamType] = useState<MockExamType>("full_mock");
  const [selectedPaper, setSelectedPaper] = useState<HskMockExamPaper>(() => {
    return questionBankService.getPapersByLevel("1")[0];
  });
  const [activeAttempt, setActiveAttempt] = useState<ExamAttempt | null>(null);

  // Modals
  const [showStartModal, setShowStartModal] = useState(false);
  const [selectedMode, setSelectedMode] = useState<ExamMode>("exam");
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);

  // Time remaining
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  // Subscribe to language & session changes
  useEffect(() => {
    const unsubBn = bengaliService.subscribe(() => {
      setIsBn(bengaliService.getLanguage() === "bn");
    });

    const unsubSession = examSessionService.subscribe(() => {
      const active = examSessionService.getActiveAttempt();
      setActiveAttempt(active);
    });

    // Check for any ongoing active attempt to recover
    const existing = examSessionService.getActiveAttempt();
    if (existing && !existing.isComplete) {
      const paper = questionBankService.getPaperById(existing.examId);
      if (paper) {
        setSelectedPaper(paper);
        setActiveAttempt(existing);
        setTimeRemaining(existing.timeRemainingSeconds);
        setViewState("active_exam");
      }
    }

    return () => {
      unsubBn();
      unsubSession();
    };
  }, []);

  // Timer tick for active exam
  useEffect(() => {
    if (viewState !== "active_exam" || !activeAttempt || activeAttempt.isComplete) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        const updated = prev - 1;
        examSessionService.updateTimeRemaining(updated);
        return updated;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [viewState, activeAttempt]);

  // Update paper selection when level changes
  const handleSelectLevel = (level: HskLevel) => {
    setSelectedLevel(level);
    const papers = questionBankService.getPapersByLevel(level);
    if (papers.length > 0) {
      setSelectedPaper(papers[0]);
    }
  };

  const handleLaunchPaper = (paper: HskMockExamPaper) => {
    setSelectedPaper(paper);
    setShowStartModal(true);
  };

  const handleConfirmStart = () => {
    setShowStartModal(false);
    let paperToStart = selectedPaper;

    if (selectedExamType !== "full_mock") {
      paperToStart = questionBankService.generatePracticePaper(selectedLevel, selectedExamType);
      setSelectedPaper(paperToStart);
    }

    const attempt = examSessionService.startAttempt(paperToStart, selectedMode);
    setActiveAttempt(attempt);
    setTimeRemaining(attempt.timeRemainingSeconds);
    setViewState("active_exam");
  };

  const handleAnswerChange = (
    answer: string,
    extra?: { audioBlobUrl?: string; audioDurationSeconds?: number }
  ) => {
    if (!activeAttempt || !selectedPaper) return;
    const currentQ = selectedPaper.questions[activeAttempt.currentQuestionIndex];
    if (!currentQ) return;

    examSessionService.recordAnswer(currentQ.id, answer, extra);
  };

  const handleToggleFlag = () => {
    if (!activeAttempt || !selectedPaper) return;
    const currentQ = selectedPaper.questions[activeAttempt.currentQuestionIndex];
    if (!currentQ) return;

    examSessionService.toggleFlag(currentQ.id);
  };

  const handleJumpIndex = (index: number) => {
    if (!activeAttempt || !selectedPaper) return;
    const q = selectedPaper.questions[index];
    if (q) {
      examSessionService.setCurrentIndex(index, q.section);
    }
  };

  const handleNextQuestion = () => {
    if (!activeAttempt || !selectedPaper) return;
    if (activeAttempt.currentQuestionIndex < selectedPaper.questions.length - 1) {
      handleJumpIndex(activeAttempt.currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (!activeAttempt || !selectedPaper) return;
    if (activeAttempt.currentQuestionIndex > 0) {
      handleJumpIndex(activeAttempt.currentQuestionIndex - 1);
    }
  };

  const handleSubmitExam = () => {
    if (!activeAttempt || !selectedPaper) return;
    const finalAttempt = examSessionService.submitAttempt(selectedPaper);
    setActiveAttempt(finalAttempt);
    setViewState("results");
  };

  const handleExitExam = () => {
    examSessionService.exitActiveAttempt();
    setViewState("library");
  };

  const handleReviewAttempt = (attempt: ExamAttempt) => {
    const paper = questionBankService.getPaperById(attempt.examId) || selectedPaper;
    setSelectedPaper(paper);
    setActiveAttempt(attempt);
    setViewState("results");
  };

  const currentQ = selectedPaper && activeAttempt
    ? selectedPaper.questions[activeAttempt.currentQuestionIndex]
    : undefined;

  const currentAnswer = currentQ && activeAttempt?.answers[currentQ.id]?.userResponse || "";
  const isCurrentFlagged = currentQ && activeAttempt?.flaggedQuestionIds.includes(currentQ.id) || false;

  const config = OFFICIAL_HSK_CONFIGS[selectedLevel];
  const historySummary = examSessionService.getHistorySummary(selectedLevel);
  const papersForLevel = questionBankService.getPapersByLevel(selectedLevel);

  const practiceFilterTabs: { type: MockExamType; labelEn: string; labelBn: string; icon: any }[] = [
    { type: "full_mock", labelEn: "Full Mock Exam", labelBn: "পূর্ণাঙ্গ মক টেস্ট", icon: Award },
    { type: "listening_practice", labelEn: "Listening", labelBn: "লিসেনিং ড্রিল", icon: Volume2 },
    { type: "reading_practice", labelEn: "Reading", labelBn: "রিডিং ড্রিল", icon: BookOpen },
    { type: "writing_practice", labelEn: "Writing", labelBn: "রাইটিং ড্রিল", icon: PenTool },
    { type: "speaking_practice", labelEn: "Speaking", labelBn: "স্পিকিং ড্রিল", icon: Mic },
    { type: "translation_practice", labelEn: "Translation", labelBn: "অনুবাদ ড্রিল", icon: Languages },
  ];

  return (
    <div className="min-h-screen bg-neutral-50/60 flex flex-col font-sans">
      {/* 1. ACTIVE EXAM VIEW */}
      {viewState === "active_exam" && activeAttempt && selectedPaper && currentQ && (
        <div className="flex-1 flex flex-col">
          <ExamTopBar
            paper={selectedPaper}
            attempt={activeAttempt}
            currentSection={activeAttempt.currentSection}
            currentQuestionIndex={activeAttempt.currentQuestionIndex}
            totalQuestions={selectedPaper.questions.length}
            timeRemainingSeconds={timeRemaining}
            isFlagged={isCurrentFlagged}
            onToggleFlag={handleToggleFlag}
            onSubmitExam={handleSubmitExam}
            onExitExam={handleExitExam}
            isBn={isBn}
          />

          <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Question Center Area */}
              <div className="lg:col-span-8 space-y-6">
                {currentQ.skill === "listening" && (
                  <ListeningQuestionCard
                    question={currentQ}
                    userAnswer={currentAnswer}
                    onSelectAnswer={handleAnswerChange}
                    mode={activeAttempt.mode}
                    isBn={isBn}
                  />
                )}

                {currentQ.skill === "reading" && (
                  <ReadingQuestionCard
                    question={currentQ}
                    userAnswer={currentAnswer}
                    onSelectAnswer={handleAnswerChange}
                    mode={activeAttempt.mode}
                    isBn={isBn}
                  />
                )}

                {currentQ.skill === "writing" && (
                  <WritingQuestionCard
                    question={currentQ}
                    userAnswer={currentAnswer}
                    onUpdateAnswer={handleAnswerChange}
                    mode={activeAttempt.mode}
                    isBn={isBn}
                  />
                )}

                {currentQ.skill === "speaking" && (
                  <SpeakingQuestionCard
                    question={currentQ}
                    userAnswer={currentAnswer}
                    onUpdateAnswer={handleAnswerChange}
                    mode={activeAttempt.mode}
                    isBn={isBn}
                  />
                )}

                {currentQ.skill === "translation" && (
                  <TranslationQuestionCard
                    question={currentQ}
                    userAnswer={currentAnswer}
                    onUpdateAnswer={handleAnswerChange}
                    mode={activeAttempt.mode}
                    isBn={isBn}
                  />
                )}

                {/* Bottom Navigation Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                  <button
                    type="button"
                    onClick={handlePrevQuestion}
                    disabled={activeAttempt.currentQuestionIndex === 0}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-semibold text-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                    <span>{isBn ? "পূর্ববর্তী প্রশ্ন" : "Previous"}</span>
                  </button>

                  <span className="text-xs text-neutral-500 font-mono">
                    {activeAttempt.currentQuestionIndex + 1} / {selectedPaper.questions.length}
                  </span>

                  {activeAttempt.currentQuestionIndex < selectedPaper.questions.length - 1 ? (
                    <button
                      type="button"
                      onClick={handleNextQuestion}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                    >
                      <span>{isBn ? "পরবর্তী প্রশ্ন" : "Next Question"}</span>
                      <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmitExam}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                    >
                      <span>{isBn ? "পরীক্ষা জমা দিন" : "Submit Examination"}</span>
                      <CheckCircle2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Sidebar Navigator */}
              <div className="lg:col-span-4 sticky top-20">
                <QuestionNavigator
                  questions={selectedPaper.questions}
                  currentIndex={activeAttempt.currentQuestionIndex}
                  answers={activeAttempt.answers}
                  flaggedIds={activeAttempt.flaggedQuestionIds}
                  visitedIds={activeAttempt.visitedQuestionIds}
                  onSelectIndex={handleJumpIndex}
                  isBn={isBn}
                />
              </div>
            </div>
          </main>
        </div>
      )}

      {/* 2. RESULTS DASHBOARD VIEW */}
      {viewState === "results" && activeAttempt && selectedPaper && (
        <div className="flex-1 p-4 md:p-8">
          <ExamResultsDashboard
            paper={selectedPaper}
            attempt={activeAttempt}
            onRetakeExam={() => {
              const attempt = examSessionService.startAttempt(selectedPaper, activeAttempt.mode);
              setActiveAttempt(attempt);
              setTimeRemaining(attempt.timeRemainingSeconds);
              setViewState("active_exam");
            }}
            onExitToLibrary={() => setViewState("library")}
            isBn={isBn}
          />
        </div>
      )}

      {/* 3. EXAM LIBRARY & SELECTION VIEW */}
      {viewState === "library" && (
        <div className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 space-y-8">
          {/* Header Banner */}
          <div className="bg-white rounded-3xl border border-neutral-200 p-6 md:p-8 shadow-2xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
                  <Sparkles size={13} />
                  <span>
                    {isBn
                      ? "অফিসিয়াল HSK ৩.০ কাঠামো (সি-টেস্ট ২০২৬ সিলেবাস মানসম্মত)"
                      : "Official HSK 3.0 Standardized Mock Suite (Global Trial Syllabus)"}
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tight">
                  {isBn ? "HSK ৩.০ পূর্ণাঙ্গ মক টেস্ট পোর্টাল" : "HSK 3.0 Full Mock Examination Suite"}
                </h1>

                <p className="text-xs md:text-sm text-neutral-600 max-w-2xl leading-relaxed">
                  {isBn
                    ? "চীনা আন্তর্জাতিক পরীক্ষা কেন্দ্র কর্তৃক প্রকাশিত HSK ৩.০ এর মানদণ্ড অনুযায়ী প্রস্তুতকৃত লেভেল ১ থেকে লেভেল ৭-৯ পর্যন্ত পূর্ণাঙ্গ কম্পিউটারাইজড সিমুলেশন পরীক্ষা।"
                    : "Official computer-based test simulation strictly configured to Chinese Test Service guidelines for Levels 1 through 9. Practice in realistic timed conditions or interactive drill mode."}
                </p>
              </div>

              {/* Top Quick Actions */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowHistoryModal(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-semibold text-neutral-800 transition-colors cursor-pointer shadow-2xs"
                >
                  <Calendar size={14} className="text-neutral-500" />
                  <span>{isBn ? "পরীক্ষার রেকর্ড" : "Exam History"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowAdminModal(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                >
                  <ShieldCheck size={14} className="text-neutral-400" />
                  <span>{isBn ? "প্রশ্নভান্ডার ব্যবস্থাপনা" : "Question Bank"}</span>
                </button>
              </div>
            </div>

            {/* Practice Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-neutral-100">
              {practiceFilterTabs.map((tab) => {
                const Icon = tab.icon;
                const isSelected = selectedExamType === tab.type;
                return (
                  <button
                    key={tab.type}
                    type="button"
                    onClick={() => setSelectedExamType(tab.type)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-red-600 text-white shadow-xs"
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                    }`}
                  >
                    <Icon size={14} />
                    <span>{isBn ? tab.labelBn : tab.labelEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* HSK Level Selection Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500">
                {isBn ? "এইচএসকে লেভেল নির্বাচন করুন:" : "Select HSK 3.0 Level:"}
              </h2>
              <span className="text-xs text-neutral-400">
                {isBn ? "লেভেল ১ থেকে ৭-৯ উচ্চতর" : "Levels 1 to 7-9 Advanced"}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {(["1", "2", "3", "4", "5", "6", "7-9"] as HskLevel[]).map((lvl) => {
                const isSelected = selectedLevel === lvl;
                const lvlConfig = OFFICIAL_HSK_CONFIGS[lvl];

                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => handleSelectLevel(lvl)}
                    className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden cursor-pointer ${
                      isSelected
                        ? "bg-white border-red-600 ring-2 ring-red-600 shadow-sm"
                        : "bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <HSKBadge level={lvl} size="md" />
                      {lvl === "7-9" && (
                        <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-red-100 text-red-800">
                          Adv
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-bold text-neutral-900">
                      HSK Level {lvl}
                    </div>

                    <div className="text-[11px] text-neutral-500 mt-1">
                      {lvlConfig.totalQuestions} {isBn ? "প্রশ্ন" : "Qs"} • {lvlConfig.durationMinutes}m
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Level Specification Details & Mock Papers */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Official Specification Breakdown */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-neutral-200 p-6 space-y-5 shadow-2xs">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <div className="flex items-center gap-2">
                  <HSKBadge level={selectedLevel} size="lg" />
                  <div>
                    <h3 className="text-base font-bold text-neutral-900">
                      {isBn ? config.titleBn : config.titleEn}
                    </h3>
                    <span className="text-xs text-neutral-500 font-mono">
                      Official Syllabus (CTS)
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-neutral-400 block">{isBn ? "পাস নম্বর" : "Pass Threshold"}</span>
                  <span className="text-sm font-bold text-emerald-600 font-mono">
                    {config.passingScore} / {config.maxScore}
                  </span>
                </div>
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed">
                {isBn ? config.descriptionBn : config.descriptionEn}
              </p>

              {/* Sections Table */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">
                  {isBn ? "পরীক্ষার অংশসমূহ ও সময় বরাদ্দ:" : "Sections & Time Allocation:"}
                </span>

                <div className="space-y-2">
                  {config.sections.map((sec, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold text-neutral-900 block">
                          {isBn ? sec.titleBn : sec.titleEn}
                        </span>
                        <span className="text-[11px] text-neutral-500">
                          {sec.partsCount} {isBn ? "টি অংশ" : "parts"} • {sec.allocatedMinutes} {isBn ? "মিনিট" : "mins"}
                        </span>
                      </div>

                      <div className="text-right font-mono font-bold text-neutral-800">
                        {sec.questionCount} Qs
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Level Past Stats */}
              <div className="p-4 rounded-2xl bg-neutral-900 text-white space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">{isBn ? "এই লেভেলে নেওয়া পরীক্ষা:" : "Completed Attempts:"}</span>
                  <span className="font-bold font-mono">{historySummary.totalAttempts}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">{isBn ? "সর্বোচ্চ স্কোর:" : "Personal Best:"}</span>
                  <span className="font-bold font-mono text-emerald-400">
                    {historySummary.bestScore} / {config.maxScore}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Available Mock Papers */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-neutral-900">
                  {isBn
                    ? `HSK লেভেল ${selectedLevel} মক পেপারসমূহ`
                    : `Available HSK Level ${selectedLevel} Papers`}
                </h3>
                <span className="text-xs text-neutral-500">
                  {papersForLevel.length} {isBn ? "টি পূর্ণাঙ্গ পেপার" : "papers ready"}
                </span>
              </div>

              <div className="space-y-3">
                {papersForLevel.map((paper) => (
                  <div
                    key={paper.id}
                    className="p-5 rounded-3xl border border-neutral-200 bg-white hover:border-red-300 hover:shadow-sm transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700">
                            {paper.paperCode}
                          </span>
                          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                            {paper.version}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-neutral-900">
                          {isBn ? paper.titleBn : paper.titleEn}
                        </h4>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleLaunchPaper(paper)}
                        className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-xs transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <Play size={13} className="fill-current" />
                        <span>{isBn ? "শুরু করুন" : "Start Exam"}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-100 text-xs text-neutral-600">
                      <div>
                        <span className="text-[11px] text-neutral-400 block">{isBn ? "মোট প্রশ্ন" : "Questions"}</span>
                        <strong className="text-neutral-900">{paper.questions.length}</strong>
                      </div>
                      <div>
                        <span className="text-[11px] text-neutral-400 block">{isBn ? "সময়" : "Duration"}</span>
                        <strong className="text-neutral-900">{paper.durationMinutes} mins</strong>
                      </div>
                      <div>
                        <span className="text-[11px] text-neutral-400 block">{isBn ? "সর্বোচ্চ স্কোর" : "Max Score"}</span>
                        <strong className="text-neutral-900">{paper.maxScore} pts</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mode Selection Modal Before Starting Exam */}
      {showStartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-xl border border-neutral-200">
            <div className="flex items-center gap-3">
              <HSKBadge level={selectedLevel} size="md" />
              <div>
                <h3 className="text-lg font-bold text-neutral-900">
                  {selectedPaper.paperCode}
                </h3>
                <span className="text-xs text-neutral-500">
                  {selectedPaper.durationMinutes} mins • {selectedPaper.questions.length} questions
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">
                {isBn ? "পরীক্ষার মোড নির্বাচন করুন:" : "Choose Testing Mode:"}
              </span>

              {/* Exam Mode Option */}
              <div
                onClick={() => setSelectedMode("exam")}
                className={`p-4 rounded-2xl border text-left cursor-pointer transition-all space-y-1 ${
                  selectedMode === "exam"
                    ? "bg-red-50/50 border-red-600 ring-2 ring-red-600"
                    : "bg-white border-neutral-200 hover:bg-neutral-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-neutral-900">
                    {isBn ? "অফিসিয়াল পরীক্ষা মোড (Exam Mode)" : "Official Exam Mode"}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-red-100 text-red-800 uppercase">
                    Realistic
                  </span>
                </div>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  {isBn
                    ? "টাইমার চালু থাকবে, জমা না দেওয়া পর্যন্ত কোনো উত্তর দেখা যাবে না, পিনয়িন লুকানো থাকবে এবং অডিও পুনরায় বাজানোর সীমাবদ্ধতা থাকবে।"
                    : "Strict simulation. No feedback until submission, running countdown, locked audio replays, hidden pinyin."}
                </p>
              </div>

              {/* Practice Mode Option */}
              <div
                onClick={() => setSelectedMode("practice")}
                className={`p-4 rounded-2xl border text-left cursor-pointer transition-all space-y-1 ${
                  selectedMode === "practice"
                    ? "bg-red-50/50 border-red-600 ring-2 ring-red-600"
                    : "bg-white border-neutral-200 hover:bg-neutral-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-neutral-900">
                    {isBn ? "অনুশীলন মোড (Practice Mode)" : "Interactive Practice Mode"}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 uppercase">
                    Learning
                  </span>
                </div>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  {isBn
                    ? "তাত্ক্ষণিক উত্তর যাচাই, পূর্ণাঙ্গ ব্যাখ্যা, আনলিমিটেড অডিও প্লে ও সহায়িকা সক্রিয় থাকবে।"
                    : "Instant answer feedback, explanations, transcript reveal, unlimited audio replays, and vocabulary help."}
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowStartModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-neutral-200 text-neutral-700 font-semibold text-xs hover:bg-neutral-50"
              >
                {isBn ? "বাতিল" : "Cancel"}
              </button>

              <button
                type="button"
                onClick={handleConfirmStart}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-xs transition-colors"
              >
                {isBn ? "পরীক্ষা শুরু করুন" : "Launch Exam"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      <ExamHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        onSelectAttempt={handleReviewAttempt}
        isBn={isBn}
      />

      {/* Admin Question Bank Modal */}
      <AdminExamModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        isBn={isBn}
      />
    </div>
  );
};
