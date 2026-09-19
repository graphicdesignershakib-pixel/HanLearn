import React, { useState, useEffect, useMemo } from "react";
import {
  Trophy,
  Medal,
  Globe2,
  Sparkles,
  Flame,
  Search,
  ChevronUp,
  Award,
  Crown,
  Shield,
  Star,
  Users,
  TrendingUp,
  Filter,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { gamificationService } from "../services/gamificationService";
import { bengaliService } from "../services/bengaliService";
import { navigate } from "../services/routerService";

interface GlobalLearner {
  id: string;
  rank: number;
  name: string;
  country: string;
  countryCode: string;
  flag: string;
  xp: number;
  level: string;
  streak: number;
  league: "Jade" | "Diamond" | "Platinum" | "Gold" | "Silver";
  avatarBg: string;
  isCurrentUser?: boolean;
}

const GLOBAL_BASE_LEARNERS: Omit<GlobalLearner, "rank">[] = [
  {
    id: "gl-01",
    name: "Chen Wei-Ming",
    country: "Singapore",
    countryCode: "SG",
    flag: "🇸🇬",
    xp: 9420,
    level: "HSK 6",
    streak: 42,
    league: "Jade",
    avatarBg: "bg-emerald-600",
  },
  {
    id: "gl-02",
    name: "Elena Rostova",
    country: "Germany",
    countryCode: "DE",
    flag: "🇩🇪",
    xp: 8850,
    level: "HSK 5",
    streak: 38,
    league: "Jade",
    avatarBg: "bg-indigo-600",
  },
  {
    id: "gl-03",
    name: "Kenji Takahashi",
    country: "Japan",
    countryCode: "JP",
    flag: "🇯🇵",
    xp: 8210,
    level: "HSK 6",
    streak: 35,
    league: "Jade",
    avatarBg: "bg-rose-600",
  },
  {
    id: "gl-04",
    name: "Lucas Dupont",
    country: "France",
    countryCode: "FR",
    flag: "🇫🇷",
    xp: 7640,
    level: "HSK 4",
    streak: 29,
    league: "Diamond",
    avatarBg: "bg-blue-600",
  },
  {
    id: "gl-05",
    name: "Amina Al-Sayed",
    country: "United Arab Emirates",
    countryCode: "AE",
    flag: "🇦🇪",
    xp: 7120,
    level: "HSK 4",
    streak: 24,
    league: "Diamond",
    avatarBg: "bg-teal-600",
  },
  {
    id: "gl-06",
    name: "Liam O'Connor",
    country: "Canada",
    countryCode: "CA",
    flag: "🇨🇦",
    xp: 6890,
    level: "HSK 4",
    streak: 21,
    league: "Diamond",
    avatarBg: "bg-red-600",
  },
  {
    id: "gl-07",
    name: "Min-Jun Park",
    country: "South Korea",
    countryCode: "KR",
    flag: "🇰🇷",
    xp: 6350,
    level: "HSK 5",
    streak: 19,
    league: "Platinum",
    avatarBg: "bg-violet-600",
  },
  {
    id: "gl-08",
    name: "Sophia Martinez",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    xp: 5980,
    level: "HSK 3",
    streak: 17,
    league: "Platinum",
    avatarBg: "bg-amber-600",
  },
  {
    id: "gl-09",
    name: "Nurul Huda",
    country: "Malaysia",
    countryCode: "MY",
    flag: "🇲🇾",
    xp: 5420,
    level: "HSK 3",
    streak: 16,
    league: "Platinum",
    avatarBg: "bg-cyan-600",
  },
  {
    id: "gl-10",
    name: "Alexander Becker",
    country: "Austria",
    countryCode: "AT",
    flag: "🇦🇹",
    xp: 4930,
    level: "HSK 3",
    streak: 14,
    league: "Gold",
    avatarBg: "bg-orange-600",
  },
  {
    id: "gl-11",
    name: "David Zhang",
    country: "Australia",
    countryCode: "AU",
    flag: "🇦🇺",
    xp: 4520,
    level: "HSK 3",
    streak: 12,
    league: "Gold",
    avatarBg: "bg-yellow-600",
  },
  {
    id: "gl-12",
    name: "Isabella Rossi",
    country: "Italy",
    countryCode: "IT",
    flag: "🇮🇹",
    xp: 4100,
    level: "HSK 2",
    streak: 11,
    league: "Gold",
    avatarBg: "bg-pink-600",
  },
];

export const LeaderboardPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [gamState, setGamState] = useState(gamificationService.getState());
  const [isBn, setIsBn] = useState(bengaliService.getLanguage() === "bn");
  const [timeFilter, setTimeFilter] = useState<"all" | "month" | "week">("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const unsubB = bengaliService.subscribe(() => {
      setIsBn(bengaliService.getLanguage() === "bn");
    });
    const unsubG = gamificationService.subscribe(() => {
      setGamState(gamificationService.getState());
    });
    return () => {
      unsubB();
      unsubG();
    };
  }, []);

  // Compute all global learners including current user
  const learners = useMemo(() => {
    const currentName = profile?.displayName || user?.email?.split("@")[0] || "You";
    const userXp = Math.max(gamState.xp, 150); // Ensure minimal XP representation

    // Assign league based on XP
    let userLeague: "Jade" | "Diamond" | "Platinum" | "Gold" | "Silver" = "Silver";
    if (userXp >= 7500) userLeague = "Jade";
    else if (userXp >= 6000) userLeague = "Diamond";
    else if (userXp >= 4500) userLeague = "Platinum";
    else if (userXp >= 2000) userLeague = "Gold";

    const currentUserEntry: Omit<GlobalLearner, "rank"> = {
      id: "current-user",
      name: currentName,
      country: "Bangladesh",
      countryCode: "BD",
      flag: "🇧🇩",
      xp: userXp,
      level: `HSK ${gamState.level}`,
      streak: gamState.dailyStreak || 1,
      league: userLeague,
      avatarBg: "bg-[var(--color-primary)]",
      isCurrentUser: true,
    };

    // Combine and sort
    const all = [...GLOBAL_BASE_LEARNERS, currentUserEntry].sort((a, b) => b.xp - a.xp);

    return all.map((item, idx) => ({
      ...item,
      rank: idx + 1,
    }));
  }, [profile, user, gamState]);

  // Current user's stats
  const currentUser = learners.find((l) => l.isCurrentUser);

  // Filtered list
  const filteredLearners = useMemo(() => {
    return learners.filter((learner) => {
      const matchesSearch =
        learner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        learner.country.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLevel =
        levelFilter === "all" ||
        (levelFilter === "hsk12" && (learner.level.includes("1") || learner.level.includes("2"))) ||
        (levelFilter === "hsk34" && (learner.level.includes("3") || learner.level.includes("4"))) ||
        (levelFilter === "hsk56" && (learner.level.includes("5") || learner.level.includes("6")));

      return matchesSearch && matchesLevel;
    });
  }, [learners, searchQuery, levelFilter]);

  const topThree = learners.slice(0, 3);

  const getLeagueBadge = (league: GlobalLearner["league"]) => {
    switch (league) {
      case "Jade":
        return {
          label: "Jade League (翡翠)",
          bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
        };
      case "Diamond":
        return {
          label: "Diamond (钻石)",
          bg: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30",
        };
      case "Platinum":
        return {
          label: "Platinum (白金)",
          bg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
        };
      case "Gold":
        return {
          label: "Gold (黄金)",
          bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
        };
      default:
        return {
          label: "Silver (白银)",
          bg: "bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/30",
        };
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
      {/* Hero Banner: International World Leaderboard */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-sky-950 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-extrabold flex items-center gap-1.5 border border-amber-400/30">
              <Globe2 size={13} />
              <span>{isBn ? "আন্তর্জাতিক লিডারবোর্ড" : "Worldwide Global Leaderboard"}</span>
            </span>
            <span className="text-xs text-neutral-400">HSK 3.0 Season 2026</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            {isBn ? "বিশ্বব্যাপী শিক্ষার্থীদের র‍্যাঙ্কিং" : "Global Learners Leaderboard"}
          </h1>

          <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">
            {isBn
              ? "বিশ্বের বিভিন্ন দেশের শিক্ষার্থীদের সাথে আপনার চাইনিজ পড়াশোনার অগ্রগতি ও এক্সপি পয়েন্টের আন্তর্জাতিক র‍্যাঙ্কিং।"
              : "Compete with Mandarin learners across the globe. Earn XP through vocabulary drills, mock exams, and streak consistency."}
          </p>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 bottom-0 opacity-10 font-hanzi text-9xl select-none pointer-events-none -mr-6 -mb-8 text-white">
          全球
        </div>
      </div>

      {/* User's Own Sticky Rank Banner */}
      {currentUser && (
        <div className="p-4 md:p-5 rounded-2xl bg-white dark:bg-neutral-900 border-2 border-[var(--color-primary)] shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)] text-white flex items-center justify-center font-black text-lg shadow-md shrink-0">
              #{currentUser.rank}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-neutral-900 dark:text-white">
                  {currentUser.name}
                </span>
                <span className="text-base" title={currentUser.country}>
                  {currentUser.flag}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[var(--color-primary)]/15 text-[var(--color-primary)]">
                  {isBn ? "আপনি (You)" : "You"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                <span>{currentUser.country}</span>
                <span>•</span>
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                  {currentUser.level}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-500 font-bold">
                  <Flame size={13} />
                  {currentUser.streak}d {isBn ? "স্ট্রিক" : "streak"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100 dark:border-neutral-800">
            <div className="text-right">
              <div className="text-lg font-black text-[var(--color-primary)]">
                {currentUser.xp.toLocaleString()} XP
              </div>
              <div className="text-[11px] text-neutral-400">
                {currentUser.rank <= 3
                  ? isBn
                    ? "🏆 বিশ্বসেরা শীর্ষ ৩"
                    : "🏆 Top 3 Worldwide"
                  : isBn
                  ? `শীর্ষ ${Math.round((currentUser.rank / (learners.length + 50)) * 100)}% গ্লোবাল`
                  : `Top ${Math.round((currentUser.rank / (learners.length + 50)) * 100)}% Global`}
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate("/practice")}
              className="px-4 py-2 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              {isBn ? "+ XP অর্জন করুন" : "Earn More XP"}
            </button>
          </div>
        </div>
      )}

      {/* Global Podium (Top 3 Learners) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {/* Rank 2 - Silver */}
        {topThree[1] && (
          <div className="order-2 md:order-1 p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex flex-col items-center text-center relative overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center font-black text-sm mb-3">
              🥈 2
            </div>
            <div
              className={`w-14 h-14 rounded-2xl ${topThree[1].avatarBg} text-white font-bold text-xl flex items-center justify-center shadow-md mb-2 relative`}
            >
              {topThree[1].name.charAt(0)}
              <span className="absolute -bottom-1 -right-1 text-lg">
                {topThree[1].flag}
              </span>
            </div>
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white truncate max-w-[180px]">
              {topThree[1].name}
            </h3>
            <p className="text-xs text-neutral-400 mb-2">{topThree[1].country}</p>
            <span className="px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 font-extrabold text-xs text-neutral-800 dark:text-neutral-200">
              {topThree[1].xp.toLocaleString()} XP
            </span>
          </div>
        )}

        {/* Rank 1 - Champion Gold Crown */}
        {topThree[0] && (
          <div className="order-1 md:order-2 p-6 rounded-2xl bg-gradient-to-b from-amber-500/10 via-white to-white dark:from-amber-500/10 dark:via-neutral-900 dark:to-neutral-900 border-2 border-amber-400 shadow-lg flex flex-col items-center text-center relative overflow-hidden -mt-2">
            <div className="absolute top-2 right-2 text-amber-500">
              <Sparkles size={18} />
            </div>
            <div className="w-9 h-9 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center font-black text-sm mb-3 shadow-md">
              <Crown size={18} />
            </div>
            <div
              className={`w-16 h-16 rounded-2xl ${topThree[0].avatarBg} text-white font-black text-2xl flex items-center justify-center shadow-lg mb-2 relative ring-4 ring-amber-400/40`}
            >
              {topThree[0].name.charAt(0)}
              <span className="absolute -bottom-1 -right-1 text-xl">
                {topThree[0].flag}
              </span>
            </div>
            <h3 className="font-black text-base text-neutral-900 dark:text-white truncate max-w-[200px]">
              {topThree[0].name}
            </h3>
            <p className="text-xs text-neutral-400 mb-3">{topThree[0].country}</p>
            <span className="px-3.5 py-1.5 rounded-full bg-amber-500 text-neutral-950 font-black text-xs shadow-md">
              👑 {topThree[0].xp.toLocaleString()} XP
            </span>
          </div>
        )}

        {/* Rank 3 - Bronze */}
        {topThree[2] && (
          <div className="order-3 md:order-3 p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex flex-col items-center text-center relative overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-amber-900/20 text-amber-700 dark:text-amber-400 flex items-center justify-center font-black text-sm mb-3">
              🥉 3
            </div>
            <div
              className={`w-14 h-14 rounded-2xl ${topThree[2].avatarBg} text-white font-bold text-xl flex items-center justify-center shadow-md mb-2 relative`}
            >
              {topThree[2].name.charAt(0)}
              <span className="absolute -bottom-1 -right-1 text-lg">
                {topThree[2].flag}
              </span>
            </div>
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white truncate max-w-[180px]">
              {topThree[2].name}
            </h3>
            <p className="text-xs text-neutral-400 mb-2">{topThree[2].country}</p>
            <span className="px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 font-extrabold text-xs text-neutral-800 dark:text-neutral-200">
              {topThree[2].xp.toLocaleString()} XP
            </span>
          </div>
        )}
      </div>

      {/* Controls & Search */}
      <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Time Filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => setTimeFilter("all")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              timeFilter === "all"
                ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-2xs"
                : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            {isBn ? "সর্বকালের সেরা" : "All-Time"}
          </button>
          <button
            type="button"
            onClick={() => setTimeFilter("month")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              timeFilter === "month"
                ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-2xs"
                : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            {isBn ? "চলতি মাস" : "This Month"}
          </button>
          <button
            type="button"
            onClick={() => setTimeFilter("week")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              timeFilter === "week"
                ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-2xs"
                : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            {isBn ? "চলতি সপ্তাহ" : "This Week"}
          </button>
        </div>

        {/* Level Filters & Search */}
        <div className="flex items-center gap-2">
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none text-neutral-800 dark:text-neutral-200 focus:ring-1 focus:ring-[var(--color-primary)] cursor-pointer"
          >
            <option value="all">{isBn ? "সকল লেভেল" : "All HSK Levels"}</option>
            <option value="hsk12">HSK 1 - 2 (Beginner)</option>
            <option value="hsk34">HSK 3 - 4 (Intermediate)</option>
            <option value="hsk56">HSK 5 - 6 (Advanced)</option>
          </select>

          <div className="relative flex-1 md:w-48">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isBn ? "নাম বা দেশ খুঁজুন..." : "Search learner..."}
              className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>
        </div>
      </div>

      {/* Main Worldwide Leaderboard Table */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
          {filteredLearners.map((learner) => {
            const league = getLeagueBadge(learner.league);
            const isMe = learner.isCurrentUser;

            return (
              <div
                key={learner.id}
                className={`p-4 flex items-center justify-between gap-3 transition-colors ${
                  isMe
                    ? "bg-[var(--color-primary)]/5 border-l-4 border-l-[var(--color-primary)] font-medium"
                    : "hover:bg-neutral-50 dark:hover:bg-neutral-800/40"
                }`}
              >
                {/* Left: Rank & Profile */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-7 text-center font-black text-sm shrink-0 ${
                      learner.rank === 1
                        ? "text-amber-500"
                        : learner.rank === 2
                        ? "text-slate-400"
                        : learner.rank === 3
                        ? "text-amber-700"
                        : "text-neutral-400"
                    }`}
                  >
                    #{learner.rank}
                  </div>

                  <div
                    className={`w-10 h-10 rounded-xl ${learner.avatarBg} text-white font-bold text-sm flex items-center justify-center shrink-0 relative`}
                  >
                    {learner.name.charAt(0)}
                    <span className="absolute -bottom-1 -right-1 text-xs">
                      {learner.flag}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="font-bold text-xs text-neutral-900 dark:text-white truncate">
                        {learner.name}
                      </span>
                      {isMe && (
                        <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-[var(--color-primary)] text-white shrink-0">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-neutral-400 truncate">
                      <span>{learner.country}</span>
                      <span>•</span>
                      <span className="text-neutral-600 dark:text-neutral-300 font-medium">
                        {learner.level}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: League Badge, Streak & XP */}
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`hidden sm:inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full border ${league.bg}`}
                  >
                    {league.label}
                  </span>

                  <span className="hidden md:flex items-center gap-1 text-[11px] text-amber-500 font-bold">
                    <Flame size={13} />
                    {learner.streak}d
                  </span>

                  <div className="text-right min-w-[70px]">
                    <div className="text-xs font-black text-neutral-900 dark:text-white">
                      {learner.xp.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-neutral-400">XP</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
