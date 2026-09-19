import React, { useState, useEffect } from "react";
import {
  X,
  Flame,
  Award,
  Sparkles,
  CheckCircle2,
  Lock,
  ChevronRight,
  TrendingUp,
  Gift,
} from "lucide-react";
import {
  gamificationService,
  UserGamificationState,
} from "../../services/gamificationService";
import { bengaliService } from "../../services/bengaliService";

interface GamificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GamificationModal: React.FC<GamificationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [state, setState] = useState<UserGamificationState>(
    gamificationService.getState()
  );
  const [activeTab, setActiveTab] = useState<"quests" | "badges">("quests");
  const [isBn, setIsBn] = useState(bengaliService.getLanguage() === "bn");

  useEffect(() => {
    const unsubG = gamificationService.subscribe(() => {
      setState(gamificationService.getState());
    });
    const unsubB = bengaliService.subscribe(() => {
      setIsBn(bengaliService.getLanguage() === "bn");
    });
    return () => {
      unsubG();
      unsubB();
    };
  }, []);

  if (!isOpen) return null;

  const handleClaim = (questId: string) => {
    gamificationService.claimQuestReward(questId);
  };

  const progressPercent = Math.min(
    100,
    Math.round((state.xp / state.nextLevelXp) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-neutral-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Profile Banner */}
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-amber-500 p-6 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-3xl shadow-inner">
              🎓
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20">
                  Level {state.level}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full">
                  <Flame size={12} fill="currentColor" />
                  {state.dailyStreak} {isBn ? "দিনের স্ট্রিক" : "Day Streak"}
                </span>
              </div>
              <h2 className="text-xl font-bold font-serif">
                {isBn ? state.levelTitleBn : state.levelTitle}
              </h2>
              <p className="text-xs text-red-100 font-mono">
                {state.levelTitleZh}
              </p>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="mt-4 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-white/90">
              <span>{isBn ? "লেভেল অগ্রগতি:" : "Level Progress:"}</span>
              <span>
                {state.xp} / {state.nextLevelXp} XP ({progressPercent}%)
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-black/20 overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-amber-300 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-neutral-100 px-6 pt-3 bg-neutral-50/50">
          <button
            type="button"
            onClick={() => setActiveTab("quests")}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "quests"
                ? "border-red-600 text-red-600"
                : "border-transparent text-neutral-500 hover:text-neutral-900"
            }`}
          >
            {isBn ? "দৈনিক কোয়েস্ট" : "Daily Quests"}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("badges")}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "badges"
                ? "border-red-600 text-red-600"
                : "border-transparent text-neutral-500 hover:text-neutral-900"
            }`}
          >
            {isBn ? "অর্জন ও ব্যাজ" : "Achievement Badges"}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === "quests" ? (
            <div className="space-y-3">
              {state.quests.map((quest) => (
                <div
                  key={quest.id}
                  className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-between gap-3"
                >
                  <div className="space-y-1 flex-1">
                    <p className="text-xs font-bold text-neutral-900">
                      {isBn ? quest.titleBn : quest.title}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-1.5 rounded-full bg-neutral-200 overflow-hidden">
                        <div
                          className="h-full bg-red-600 rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              (quest.current / quest.target) * 100
                            )}%`,
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {quest.current}/{quest.target}
                      </span>
                    </div>
                  </div>

                  <div>
                    {quest.claimed ? (
                      <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 size={13} />
                        Claimed
                      </span>
                    ) : quest.completed ? (
                      <button
                        type="button"
                        onClick={() => handleClaim(quest.id)}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                      >
                        Claim +{quest.rewardXp} XP
                      </button>
                    ) : (
                      <span className="text-[11px] font-semibold text-neutral-400">
                        +{quest.rewardXp} XP
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {state.badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    badge.unlocked
                      ? "bg-amber-50/50 border-amber-200 shadow-xs"
                      : "bg-neutral-50/60 border-neutral-200 opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{badge.icon}</span>
                    {badge.unlocked ? (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">
                        Unlocked
                      </span>
                    ) : (
                      <Lock size={12} className="text-neutral-400" />
                    )}
                  </div>
                  <div className="mt-2 space-y-0.5">
                    <p className="text-xs font-bold text-neutral-900">
                      {isBn ? badge.nameBn : badge.name}
                    </p>
                    <p className="text-[10px] text-neutral-400 font-mono">
                      {badge.nameZh}
                    </p>
                    <p className="text-[10px] text-neutral-500 line-clamp-2">
                      {isBn ? badge.descriptionBn : badge.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
