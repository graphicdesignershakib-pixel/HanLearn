import React, { useState, useEffect } from "react";
import { themeService, THEMES, ThemeId } from "../../services/themeService";
import { bengaliService } from "../../services/bengaliService";
import { Palette, Check, Sparkles, X, Sun, Moon } from "lucide-react";

interface ThemeChooserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeChooserModal: React.FC<ThemeChooserModalProps> = ({ isOpen, onClose }) => {
  const [currentTheme, setCurrentTheme] = useState(themeService.getTheme());
  const [isBn, setIsBn] = useState(bengaliService.getLanguage() === "bn");

  useEffect(() => {
    const unsubT = themeService.subscribe(() => {
      setCurrentTheme(themeService.getTheme());
    });
    const unsubB = bengaliService.subscribe(() => {
      setIsBn(bengaliService.getLanguage() === "bn");
    });
    return () => {
      unsubT();
      unsubB();
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-neutral-50 dark:bg-neutral-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center shadow-sm">
              <Palette size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                {isBn ? "থিম ও কালার পছন্দ করুন" : "Theme & Color Chooser"}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {isBn
                  ? "গ্রাফিক আর্টস ইনস্টিটিউট ও চাইনিজ কালার প্যালেট"
                  : "Graphic Arts Institute & Chinese Color Palette"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Theme Cards List */}
        <div className="p-6 space-y-3 max-h-[70vh] overflow-y-auto">
          {THEMES.map((theme) => {
            const isSelected = currentTheme.id === theme.id;
            return (
              <div
                key={theme.id}
                onClick={() => themeService.setTheme(theme.id)}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  isSelected
                    ? "border-[var(--color-primary)] bg-[var(--color-paper)] shadow-md"
                    : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900"
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Swatch Pill */}
                  <div className="flex items-center -space-x-2 shrink-0">
                    <span
                      className="w-7 h-7 rounded-full border-2 border-white dark:border-neutral-900 shadow-sm"
                      style={{ backgroundColor: theme.primaryColor }}
                    />
                    <span
                      className="w-7 h-7 rounded-full border-2 border-white dark:border-neutral-900 shadow-sm"
                      style={{ backgroundColor: theme.accentColor }}
                    />
                    <span
                      className="w-7 h-7 rounded-full border-2 border-white dark:border-neutral-900 shadow-sm"
                      style={{ backgroundColor: theme.paperBg }}
                    />
                  </div>

                  {/* Title & Desc */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-neutral-900 dark:text-white truncate">
                        {isBn ? theme.nameBn : theme.name}
                      </span>
                      {theme.isDark ? (
                        <Moon size={13} className="text-indigo-400 shrink-0" />
                      ) : (
                        <Sun size={13} className="text-amber-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                      {isBn ? theme.descriptionBn : theme.description}
                    </p>
                  </div>
                </div>

                {/* Selection Indicator */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border ${
                    isSelected
                      ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white"
                      : "border-neutral-300 dark:border-neutral-700 text-transparent"
                  }`}
                >
                  <Check size={14} strokeWidth={3} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-1.5">
            <Sparkles size={14} className="text-sky-500" />
            <span>{isBn ? "পছন্দটি স্বয়ংক্রিয়ভাবে সংরক্ষিত হবে" : "Preference is automatically saved"}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[var(--color-primary)] text-white font-semibold hover:opacity-90 transition-opacity cursor-pointer text-xs"
          >
            {isBn ? "ঠিক আছে" : "Done"}
          </button>
        </div>
      </div>
    </div>
  );
};
