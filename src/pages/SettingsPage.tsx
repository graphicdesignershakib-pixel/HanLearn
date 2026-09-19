import React, { useState } from "react";
import { progressService } from "../services/progressService";
import { audioService } from "../services/audioService";
import { Settings, Volume2, Grid, RotateCcw, Download, Trash2, CheckCircle2 } from "lucide-react";

export const SettingsPage: React.FC = () => {
  const [speechRate, setSpeechRate] = useState(1.0);
  const [gridStyle, setGridStyle] = useState<"tian" | "mi" | "none">("tian");
  const [autoPlayAudio, setAutoPlayAudio] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleExportData = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      stats: progressService.getStats(),
      progress: Array.from(progressService.getProgressMap().entries()),
      favorites: Array.from(progressService.getFavoritesSet()),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hanlearn-study-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetProgress = () => {
    if (window.confirm("Are you sure you want to reset all local study progress and streaks? This cannot be undone.")) {
      progressService.resetAllProgress();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 flex items-center gap-2">
          <Settings size={28} className="text-neutral-700" />
          <span>App Settings & Study Preferences</span>
        </h1>
        <p className="text-sm text-neutral-600">
          Customize pronunciation playback rates, handwriting grids, and data storage.
        </p>
      </div>

      {/* Audio Preferences */}
      <div className="p-6 rounded-2xl border border-neutral-200 bg-white space-y-6">
        <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-100">
          <Volume2 size={20} className="text-blue-600" />
          <h2 className="text-base font-bold text-neutral-900">Audio & Speech Synthesis</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-neutral-900 block">
                Default Pronunciation Speed
              </span>
              <span className="text-xs text-neutral-500">
                Speed used when playing vocabulary or syllable audio.
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-lg text-xs font-semibold">
              {[0.65, 0.85, 1.0, 1.2].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setSpeechRate(r);
                    audioService.setRate(r);
                  }}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    speechRate === r ? "bg-white text-neutral-900 shadow-xs" : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  {r}x
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-neutral-50">
            <div>
              <span className="text-sm font-semibold text-neutral-900 block">
                Speech Engine Status
              </span>
              <span className="text-xs text-neutral-500">
                Mandarin Chinese WebSpeech acoustic synthesizer.
              </span>
            </div>

            <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-mono font-semibold">
              Active & Available
            </span>
          </div>
        </div>
      </div>

      {/* Handwriting Canvas Preferences */}
      <div className="p-6 rounded-2xl border border-neutral-200 bg-white space-y-6">
        <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-100">
          <Grid size={20} className="text-red-600" />
          <h2 className="text-base font-bold text-neutral-900">Hanzi Calligraphy Canvas</h2>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-semibold text-neutral-900 block">
              Default Guide Grid Pattern
            </span>
            <span className="text-xs text-neutral-500">
              Tian-Zi-Ge (cross) is the pedagogical standard for Chinese character proportion.
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => setGridStyle("tian")}
              className={`px-3 py-1 rounded-md transition-colors ${
                gridStyle === "tian" ? "bg-white text-neutral-900 shadow-xs" : "text-neutral-600"
              }`}
            >
              Tian-Zi-Ge (田)
            </button>
            <button
              type="button"
              onClick={() => setGridStyle("mi")}
              className={`px-3 py-1 rounded-md transition-colors ${
                gridStyle === "mi" ? "bg-white text-neutral-900 shadow-xs" : "text-neutral-600"
              }`}
            >
              Mi-Zi-Ge (米)
            </button>
            <button
              type="button"
              onClick={() => setGridStyle("none")}
              className={`px-3 py-1 rounded-md transition-colors ${
                gridStyle === "none" ? "bg-white text-neutral-900 shadow-xs" : "text-neutral-600"
              }`}
            >
              Plain Blank
            </button>
          </div>
        </div>
      </div>

      {/* Data Storage & Export */}
      <div className="p-6 rounded-2xl border border-neutral-200 bg-white space-y-6">
        <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-100">
          <RotateCcw size={20} className="text-neutral-700" />
          <h2 className="text-base font-bold text-neutral-900">Study Progress Data Management</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-neutral-900 block">
                Export Study Archive (JSON)
              </span>
              <span className="text-xs text-neutral-500">
                Download all learned words, review history, and saved items as a portable backup.
              </span>
            </div>

            <button
              type="button"
              onClick={handleExportData}
              className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
            >
              <Download size={14} />
              <span>Export JSON</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
            <div>
              <span className="text-sm font-semibold text-red-600 block">
                Reset All Learning Progress
              </span>
              <span className="text-xs text-neutral-500">
                Clear all spaced repetition schedules, learned word counts, and daily streaks.
              </span>
            </div>

            <button
              type="button"
              onClick={handleResetProgress}
              className="px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Trash2 size={14} />
              <span>Reset Data</span>
            </button>
          </div>

          {resetSuccess && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
              <CheckCircle2 size={16} />
              <span>Progress successfully reset to clean state.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
