import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  ShieldCheck,
  Eye,
  PlusCircle,
  Globe,
  Palette,
  LogOut,
  Sparkles,
  Users,
  Layers,
  Headphones,
} from "lucide-react";
import { navigate } from "../../services/routerService";
import { useAuth } from "../../context/AuthContext";
import { bengaliService } from "../../services/bengaliService";
import { adminStateService } from "../../services/adminStateService";
import { themeService } from "../../services/themeService";
import { audioService } from "../../services/audioService";
import { ThemeChooserModal } from "../common/ThemeChooserModal";
import { AudioSpeedModal } from "../common/AudioSpeedModal";
import { resourceService } from "../../services/resourceService";

interface AdminTopBarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const AdminTopBar: React.FC<AdminTopBarProps> = ({
  onToggleSidebar,
  isSidebarOpen,
}) => {
  const { user, profile, signOut } = useAuth();
  const [isBn, setIsBn] = useState(bengaliService.getLanguage() === "bn");
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isAudioOpen, setIsAudioOpen] = useState(false);
  const [audioSettings, setAudioSettings] = useState(audioService.getSettings());
  const [resourceCount, setResourceCount] = useState(0);

  useEffect(() => {
    const unsubB = bengaliService.subscribe(() => {
      setIsBn(bengaliService.getLanguage() === "bn");
    });
    const unsubR = resourceService.subscribeResources((data) => {
      setResourceCount(data.length);
    });
    const unsubA = audioService.onSettingsChange((s) => {
      setAudioSettings(s);
    });
    return () => {
      unsubB();
      unsubR();
      unsubA();
    };
  }, []);

  const handleTogglePreview = () => {
    adminStateService.setPreviewAsStudent(true);
    navigate("/dashboard");
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-8 border-b border-neutral-200/90 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm shadow-xs">
        {/* Left: Mobile menu toggle & Admin Brand identity */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="md:hidden p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
              aria-label="Toggle menu"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}

          <div
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center font-bold font-hanzi text-lg shadow-sm group-hover:scale-105 transition-transform">
              汉
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-neutral-900 dark:text-white">
                  HanLearn
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-600 text-white uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                  <ShieldCheck size={10} />
                  ADMIN
                </span>
              </div>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 tracking-wide font-medium block">
                {isBn ? "গভঃ গ্রাফিক আর্টস একাডেমি অ্যাডমিন কনসোল" : "Govt. Graphic Arts Institute Admin Console"}
              </span>
            </div>
          </div>
        </div>

        {/* Center: System Status Badge (Desktop) */}
        <div className="hidden lg:flex items-center gap-4 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60 text-xs">
          <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold">{isBn ? "সিস্টেম সক্রিয়" : "System Live"}</span>
          </div>
          <span className="text-neutral-300 dark:text-neutral-700">|</span>
          <div className="flex items-center gap-1 text-neutral-600 dark:text-neutral-300">
            <Layers size={13} className="text-[var(--color-primary)]" />
            <span>{resourceCount} {isBn ? "রিসোর্স ডাটাবেসে" : "Resources"}</span>
          </div>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Switch to Student Preview Mode */}
          <button
            type="button"
            onClick={handleTogglePreview}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] text-xs font-bold transition-all cursor-pointer shadow-2xs"
            title="Preview as Student"
          >
            <Eye size={14} className="text-[var(--color-primary)]" />
            <span className="hidden sm:inline">
              {isBn ? "শিক্ষার্থী ভিউ দেখুন" : "Preview Student"}
            </span>
          </button>

          {/* Quick Add Resource */}
          <button
            type="button"
            onClick={() => navigate("/admin/resources")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] text-xs font-bold transition-colors shadow-2xs cursor-pointer"
          >
            <PlusCircle size={14} />
            <span className="hidden sm:inline">
              {isBn ? "রিসোর্স ইনপুট" : "Add Resource"}
            </span>
          </button>

          {/* Audio Speed Settings Button */}
          <button
            type="button"
            onClick={() => setIsAudioOpen(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-xs font-bold transition-colors cursor-pointer"
            title="Smart Audio Speed & Loop Repeats"
          >
            <Headphones size={14} />
            <span>{audioSettings.rate}x</span>
          </button>

          {/* Theme Chooser */}
          <button
            type="button"
            onClick={() => setIsThemeOpen(true)}
            className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 transition-colors cursor-pointer"
            title="Theme Chooser"
          >
            <Palette size={15} />
          </button>

          {/* Language Switcher */}
          <button
            type="button"
            onClick={() => bengaliService.toggleLanguage()}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 text-xs font-semibold transition-colors cursor-pointer"
            title="Toggle Language"
          >
            <Globe size={13} className="text-[var(--color-primary)]" />
            <span>{isBn ? "বাংলা" : "EN"}</span>
          </button>

          {/* Admin Avatar & Sign Out */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-neutral-200 dark:border-neutral-800">
            <div
              className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs shadow-xs"
              title={user?.email || "Admin"}
            >
              {profile?.displayName ? profile.displayName.charAt(0).toUpperCase() : "A"}
            </div>
            <button
              type="button"
              onClick={() => signOut()}
              className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* Theme Modal */}
      <ThemeChooserModal
        isOpen={isThemeOpen}
        onClose={() => setIsThemeOpen(false)}
      />

      {/* Smart Audio Speed & Repeat Modal */}
      <AudioSpeedModal
        isOpen={isAudioOpen}
        onClose={() => setIsAudioOpen(false)}
      />
    </>
  );
};
