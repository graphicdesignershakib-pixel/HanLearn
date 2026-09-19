import React, { useState, useEffect } from "react";
import { dailyMissionService } from "../services/dailyMissionService";
import { StudyPlan } from "../types/learning";
import { HskLevel } from "../types/hsk";
import { HSK_OFFICIAL_TARGET_COUNTS } from "../services/vocabularyService";
import { progressService } from "../services/progressService";
import { bengaliService } from "../services/bengaliService";
import {
  Calendar,
  Clock,
  Target,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Award,
} from "lucide-react";

export const StudyPlanPage: React.FC = () => {
  const [studyPlan, setStudyPlan] = useState<StudyPlan>(() => dailyMissionService.getStudyPlan());
  const [targetLevel, setTargetLevel] = useState<HskLevel>(studyPlan.targetLevel);
  const [dailyMinutes, setDailyMinutes] = useState<number>(studyPlan.dailyTargetMinutes);
  const [examDate, setExamDate] = useState<string>(studyPlan.examDate);
  const [isSaved, setIsSaved] = useState(false);
  const [isBn, setIsBn] = useState(bengaliService.getLanguage() === "bn");

  const stats = progressService.getStats();
  const currentLearned = stats.levelProgress[targetLevel]?.learned || 0;
  const officialTarget = HSK_OFFICIAL_TARGET_COUNTS[targetLevel] || 300;
  const wordsRemaining = Math.max(0, officialTarget - currentLearned);

  useEffect(() => {
    const unsubB = bengaliService.subscribe(() => setIsBn(bengaliService.getLanguage() === "bn"));
    return unsubB;
  }, []);

  // Compute days left
  const diffTime = Math.max(0, new Date(examDate).getTime() - new Date().getTime());
  const daysLeft = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const dailyWordsPace = Math.ceil(wordsRemaining / daysLeft);

  const handleSave = () => {
    dailyMissionService.updateStudyPlan({
      targetLevel,
      dailyGoalMinutes: dailyMinutes,
      targetDate: examDate,
    });
    setStudyPlan(dailyMissionService.getStudyPlan());
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 md:p-8 space-y-4 shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
            <Target size={14} />
            <span>PERSONALIZED HSK 3.0 STUDY PLANNER</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight">
            {isBn ? "ব্যক্তিগত এইচএসকে পড়াশোনার পরিকল্পনা" : "Customized Study Schedule"}
          </h1>
          <p className="text-xs md:text-sm text-neutral-600 max-w-xl">
            {isBn
              ? "আপনার কাঙ্ক্ষিত এইচএসকে লেভেল, দৈনিক সময় ও পরীক্ষার তারিখ নির্বাচন করুন। গতিপথ স্বয়ংক্রিয়ভাবে নির্ধারিত হবে।"
              : "Calibrate your daily pace, target exam date, and weekly milestones to ensure 100% mastery before test day."}
          </p>
        </div>
      </div>

      {/* Configuration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Settings Form (2 cols) */}
        <div className="md:col-span-2 bg-white border border-neutral-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-xs">
          <h2 className="text-base font-bold text-neutral-900 tracking-tight border-b border-neutral-100 pb-3">
            Plan Preferences & Milestones
          </h2>

          {/* Level Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
              Target HSK 3.0 Level:
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {(["1", "2", "3", "4", "5", "6"] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setTargetLevel(lvl)}
                  className={`p-3 rounded-2xl border text-center font-bold text-sm transition-all cursor-pointer ${
                    targetLevel === lvl
                      ? "bg-red-600 text-white border-red-600 shadow-xs"
                      : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100"
                  }`}
                >
                  HSK {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Target Exam Date */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar size={14} className="text-blue-600" />
              <span>Target Exam Date:</span>
            </label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full p-3 rounded-2xl border border-neutral-200 text-xs font-bold text-neutral-900 bg-neutral-50/50"
            />
          </div>

          {/* Daily Commitment Minutes */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
              <Clock size={14} className="text-amber-500" />
              <span>Daily Study Time Commitment:</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[15, 30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDailyMinutes(mins)}
                  className={`p-3 rounded-2xl border text-center font-bold text-xs transition-all cursor-pointer ${
                    dailyMinutes === mins
                      ? "bg-neutral-900 text-white border-neutral-900 shadow-xs"
                      : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100"
                  }`}
                >
                  {mins} Minutes
                </button>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
            >
              Update Study Plan
            </button>
            {isSaved && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 size={16} />
                <span>Plan saved successfully!</span>
              </span>
            )}
          </div>
        </div>

        {/* Live Forecast Card (1 col) */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900 uppercase tracking-wider border-b border-neutral-100 pb-3">
              <TrendingUp size={16} className="text-blue-600" />
              <span>Diagnostic Forecast</span>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-1">
                <div className="text-[10px] text-neutral-400 font-bold uppercase">Days Remaining</div>
                <div className="text-2xl font-extrabold text-blue-600">{daysLeft} Days</div>
                <div className="text-[11px] text-neutral-500">until target date ({examDate})</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-1">
                <div className="text-[10px] text-neutral-400 font-bold uppercase">Required Daily Pace</div>
                <div className="text-2xl font-extrabold text-red-600">{dailyWordsPace} Words/day</div>
                <div className="text-[11px] text-neutral-500">
                  {wordsRemaining} words remaining to master HSK {targetLevel}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-1">
                <div className="text-[10px] text-neutral-400 font-bold uppercase">Study Intensity</div>
                <div className="text-sm font-bold text-neutral-900">
                  {dailyMinutes >= 45 ? "High Velocity Track" : "Steady Sustainable Rhythm"}
                </div>
                <div className="text-[11px] text-neutral-500">
                  {dailyMinutes} mins daily across vocab, grammar & listening
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-100 text-[11px] text-blue-900 leading-relaxed">
            <strong>Advisory:</strong> Completing your 5 Daily Missions ensures you automatically hit this target velocity.
          </div>
        </div>
      </div>
    </div>
  );
};
