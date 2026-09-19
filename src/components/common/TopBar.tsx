import React, { useState, useEffect } from "react";
import {
  Search,
  Flame,
  BookOpen,
  Menu,
  X,
  CheckCircle2,
  Bot,
  Globe,
  Award,
  Sparkles,
  User,
  ShieldCheck,
  LogIn,
  LogOut,
  FolderPlus,
  Palette,
} from "lucide-react";
import { navigate } from "../../services/routerService";
import { progressService } from "../../services/progressService";
import { gamificationService } from "../../services/gamificationService";
import { bengaliService, LanguageMode } from "../../services/bengaliService";
import { themeService } from "../../services/themeService";
import { GamificationModal } from "../gamification/GamificationModal";
import { ThemeChooserModal } from "./ThemeChooserModal";
import { useAuth } from "../../context/AuthContext";
import { AuthModal } from "../auth/AuthModal";

interface TopBarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
  onOpenDictionary?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onToggleSidebar,
  isSidebarOpen,
  onOpenDictionary,
}) => {
  const [quickSearch, setQuickSearch] = useState("");
  const [isGamifyOpen, setIsGamifyOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [lang, setLang] = useState<LanguageMode>(bengaliService.getLanguage());
  const [gamifyState, setGamifyState] = useState(gamificationService.getState());
  const [currentTheme, setCurrentTheme] = useState(themeService.getTheme());
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalRole, setAuthModalRole] = useState<"student" | "admin">("student");
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">("login");
  const stats = progressService.getStats();
  const { user, profile, isAdmin, signOut } = useAuth();

  useEffect(() => {
    const unsubG = gamificationService.subscribe(() => {
      setGamifyState(gamificationService.getState());
    });
    const unsubB = bengaliService.subscribe(() => {
      setLang(bengaliService.getLanguage());
    });
    const unsubT = themeService.subscribe(() => {
      setCurrentTheme(themeService.getTheme());
    });
    return () => {
      unsubG();
      unsubB();
      unsubT();
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      navigate(`/vocabulary?q=${encodeURIComponent(quickSearch.trim())}`);
      setQuickSearch("");
    }
  };

  const toggleLanguage = () => {
    bengaliService.toggleLanguage();
  };

  const isBn = lang === "bn";

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-8 border-b border-neutral-200/80 bg-white/95 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="md:hidden p-2 text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 cursor-pointer"
              aria-label="Toggle menu"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center font-bold font-hanzi text-lg shadow-sm group-hover:scale-105 transition-transform">
              汉
            </div>
            <div>
              <span className="font-semibold text-neutral-900 tracking-tight text-base block leading-none">
                HanLearn
              </span>
              <span className="text-[11px] text-neutral-600 tracking-wide font-medium mt-0.5 block">
                {isBn ? "গ্রাফিক আর্টস ও এইচএসকে ৩.০" : "Graphic Arts & HSK 3.0"}
              </span>
            </div>
          </button>
        </div>

        {/* Global Quick Search */}
        <div className="hidden sm:block flex-1 max-w-md mx-6">
          <div
            onClick={onOpenDictionary}
            className="relative flex items-center w-full pl-9 pr-2.5 py-1.5 text-sm bg-neutral-100/80 hover:bg-neutral-100 text-neutral-500 hover:text-neutral-700 border border-neutral-200/60 rounded-xl transition-all cursor-pointer shadow-2xs group"
          >
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-hover:text-neutral-600 transition-colors pointer-events-none"
            />
            <span className="text-xs font-medium truncate flex-1">
              {isBn ? "কুইক ডিকশনারি: চীনা অক্ষর, পিনয়িন বা অর্থ..." : "Quick dictionary: Hanzi, Pinyin, or English..."}
            </span>
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white border border-neutral-200/80 text-[10px] font-mono font-bold text-neutral-500 shadow-2xs">
              <span className="text-[9px]">⌘</span>
              <span>K</span>
            </div>
          </div>
        </div>

        {/* Right Stats & Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme & Color Chooser Button */}
          <button
            type="button"
            onClick={() => setIsThemeOpen(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold transition-colors cursor-pointer"
            title="Choose Color Theme"
          >
            <Palette size={13} className="text-[var(--color-primary)]" />
            <span className="hidden sm:inline">{isBn ? "থিম" : "Theme"}</span>
            <div className="flex items-center -space-x-1">
              <span
                className="w-2.5 h-2.5 rounded-full border border-white"
                style={{ backgroundColor: currentTheme.primaryColor }}
              />
              <span
                className="w-2.5 h-2.5 rounded-full border border-white"
                style={{ backgroundColor: currentTheme.accentColor }}
              />
            </div>
          </button>

          {/* Bengali / English Language Toggle */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold transition-colors cursor-pointer"
            title="Toggle English / Bengali Language"
          >
            <Globe size={13} className="text-[var(--color-primary)]" />
            <span>{isBn ? "বাংলা (BN)" : "English (EN)"}</span>
          </button>

          {/* Gamification XP & Streak Badge */}
          <button
            type="button"
            onClick={() => setIsGamifyOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200/80 text-amber-900 text-xs font-semibold transition-colors cursor-pointer"
            title="View Quests, Badges & XP"
          >
            <Flame size={14} className="text-amber-500 fill-amber-500" />
            <span>{gamifyState.dailyStreak}d</span>
            <span className="text-amber-300">•</span>
            <span className="text-amber-700">{gamifyState.xp} XP</span>
          </button>

          {/* AI Tutor shortcut */}
          <button
            type="button"
            onClick={() => navigate("/chat")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors shadow-2xs cursor-pointer"
          >
            <Bot size={14} className="text-red-400" />
            <span className="hidden sm:inline">{isBn ? "এআই টিউটর" : "AI Tutor"}</span>
          </button>

          {/* User / Admin Authentication & Profile */}
          {user ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => navigate("/admin/resources")}
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors shadow-2xs cursor-pointer"
                  title="Admin Resource Portal"
                >
                  <FolderPlus size={13} />
                  <span className="hidden sm:inline">{isBn ? "রিসোর্স ইনপুট" : "Add Resource"}</span>
                </button>
              )}

              <div className="flex items-center gap-1.5 pl-1.5 border-l border-neutral-200">
                <div
                  className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs"
                  title={user.email || "User"}
                >
                  {profile?.displayName ? profile.displayName.charAt(0).toUpperCase() : "U"}
                </div>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut size={15} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setAuthModalRole("student");
                  setAuthModalTab("login");
                  setAuthModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors cursor-pointer"
              >
                <LogIn size={13} />
                <span>{isBn ? "লগইন" : "Login"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthModalRole("admin");
                  setAuthModalTab("login");
                  setAuthModalOpen(true);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200/80 transition-colors cursor-pointer"
                title="Admin Login & Resource Management"
              >
                <ShieldCheck size={13} />
                <span className="hidden sm:inline">{isBn ? "অ্যাডমিন" : "Admin"}</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Gamification Modal */}
      <GamificationModal
        isOpen={isGamifyOpen}
        onClose={() => setIsGamifyOpen(false)}
      />

      {/* Authentication Modal (Student & Admin) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultRole={authModalRole}
        defaultTab={authModalTab}
      />

      {/* Theme & Color Chooser Modal */}
      <ThemeChooserModal
        isOpen={isThemeOpen}
        onClose={() => setIsThemeOpen(false)}
      />
    </>
  );
};
