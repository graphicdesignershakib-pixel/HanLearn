import React, { useState, useEffect } from "react";
import { dailyMissionService } from "../services/dailyMissionService";
import { DailyMissionState, DailyTask } from "../types/learning";
import { navigate } from "../services/routerService";
import { bengaliService } from "../services/bengaliService";
import {
  Flame,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Trophy,
  Award,
  Zap,
  Target,
} from "lucide-react";
import confetti from "canvas-confetti";

export const DailyMissionPage: React.FC = () => {
  const [missionState, setMissionState] = useState<DailyMissionState>(() =>
    dailyMissionService.getTodayMission()
  );
  const [isBn, setIsBn] = useState(bengaliService.getLanguage() === "bn");

  useEffect(() => {
    const unsubM = dailyMissionService.subscribe(() =>
      setMissionState(dailyMissionService.getTodayMission())
    );
    const unsubB = bengaliService.subscribe(() =>
      setIsBn(bengaliService.getLanguage() === "bn")
    );
    return () => {
      unsubM();
      unsubB();
    };
  }, []);

  const totalTasks = missionState.tasks.length;
  const completedTasks = missionState.tasks.filter((t) => t.completed).length;
  const progressPct = Math.round((completedTasks / totalTasks) * 100);

  const handleClaim = () => {
    dailyMissionService.claimMissionBonus();
    try {
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const getTaskRoute = (taskId: string) => {
    switch (taskId) {
      case "task-vocab":
        return "/vocabulary";
      case "task-srs":
        return "/flashcards";
      case "task-grammar":
        return "/grammar";
      case "task-listening":
        return "/listening-lab";
      case "task-hanzi":
        return "/writing";
      default:
        return "/practice";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white rounded-3xl p-6 md:p-8 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold">
              <Flame size={14} className="text-yellow-200" />
              <span>DAILY MASTERY RITUAL</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {isBn ? "দৈনিক মিশন ও লক্ষ্যমাত্রা" : "Daily Missions & Target XP"}
            </h1>
            <p className="text-white/90 text-xs md:text-sm max-w-xl">
              {isBn
                ? "প্রতিদিন ৫টি লক্ষ্য পূরণ করে আপনার স্ট্রিক বজায় রাখুন এবং বাড়তি বোনাস XP অর্জন করুন।"
                : "Complete all 5 daily learning rituals to maintain your active streak, elevate Chinese retention, and earn bonus mastery XP."}
            </p>
          </div>

          {/* Streak Counter */}
          <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-2xl p-4 text-center shrink-0 min-w-32">
            <div className="flex items-center justify-center gap-1.5 text-yellow-300 font-extrabold text-2xl">
              <Flame size={24} />
              <span>{missionState.streakDays}</span>
            </div>
            <div className="text-[11px] font-semibold text-white/80 mt-0.5">
              Day Learning Streak
            </div>
          </div>
        </div>

        {/* Daily Progress Bar */}
        <div className="pt-2 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-white/90">
            <span>
              Today's Ritual Progress: {completedTasks} of {totalTasks} Completed
            </span>
            <span className="font-extrabold">{progressPct}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-black/20 overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Task Cards List */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 md:p-8 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <h2 className="text-base font-bold text-neutral-900 tracking-tight flex items-center gap-2">
            <Target size={18} className="text-orange-500" />
            <span>Today's 5 Core Objectives</span>
          </h2>
          {progressPct === 100 && (
            <button
              type="button"
              onClick={handleClaim}
              className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer animate-bounce"
            >
              <Trophy size={14} />
              <span>Claim +50 Bonus XP!</span>
            </button>
          )}
        </div>

        <div className="space-y-3">
          {missionState.tasks.map((task) => {
            const pct = Math.min(100, Math.round((task.currentCount / task.targetCount) * 100));
            return (
              <div
                key={task.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  task.completed
                    ? "bg-emerald-50/40 border-emerald-200"
                    : "bg-white border-neutral-200 hover:border-orange-300"
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-neutral-900">{task.title}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900">
                      +{task.xpReward} XP
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    {task.description}
                  </p>

                  <div className="flex items-center gap-2 text-xs font-semibold text-neutral-600 pt-1">
                    <div className="w-24 h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${task.completed ? "bg-emerald-500" : "bg-orange-500"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span>
                      {task.currentCount} / {task.targetCount}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {task.completed ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs">
                      <CheckCircle2 size={16} />
                      <span>Completed</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => navigate(getTaskRoute(task.id))}
                      className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>Start Now</span>
                      <ArrowRight size={13} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
