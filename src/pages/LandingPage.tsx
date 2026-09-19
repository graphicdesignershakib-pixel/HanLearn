import React, { useState } from "react";
import { navigate } from "../services/routerService";
import { BookOpen, Layers, Sparkles, Volume2, Edit3, ArrowRight, ShieldCheck, Lock } from "lucide-react";
import { AudioButton } from "../components/common/AudioButton";
import { StrokeOrderViewer } from "../components/stroke/StrokeOrderViewer";
import { HSKBadge } from "../components/common/HSKBadge";
import { useAuth } from "../context/AuthContext";
import { AuthModal } from "../components/auth/AuthModal";

export const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const requireAuthNavigate = (targetPath: string) => {
    if (user) {
      navigate(targetPath);
    } else {
      setAuthModalOpen(true);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-16 py-6 md:py-12">
      {/* Educational Hero */}
      <section className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200/80 text-red-700 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          <span>HSK 3.0 Standard Vocabulary System</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-neutral-900 leading-[1.15]">
          Learn Chinese <br className="hidden sm:inline" />
          <span className="text-red-600 font-serif">One Word</span> at a Time.
        </h1>

        <p className="text-lg md:text-xl text-neutral-600 leading-relaxed font-normal">
          Study HSK vocabulary through meaning, Pinyin, pronunciation, tones, sentences, and Hanzi writing.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          {user ? (
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-all shadow-sm hover:shadow flex items-center gap-2 cursor-pointer"
            >
              <span>Continue Learning (Dashboard)</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setAuthModalOpen(true)}
              className="px-6 py-3 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-all shadow-sm hover:shadow flex items-center gap-2 cursor-pointer"
            >
              <Lock size={15} />
              <span>Sign In / Register to Start</span>
              <ArrowRight size={16} />
            </button>
          )}

          <button
            type="button"
            onClick={() => requireAuthNavigate("/hsk")}
            className="px-6 py-3 rounded-xl bg-white border border-neutral-300 text-neutral-800 font-semibold text-sm hover:bg-neutral-50 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Layers size={16} className="text-neutral-500" />
            <span>Explore HSK Levels</span>
          </button>
        </div>
      </section>

      {/* Interactive Visual Sample Card */}
      <section className="rounded-3xl border border-neutral-200 bg-white p-6 md:p-10 shadow-xs">
        <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-6 flex items-center justify-between">
          <span>Interactive Study Unit Preview</span>
          <span className="text-red-600 font-mono">Live Demo</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Word Details & Meaning */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <HSKBadge level="1" size="sm" />
                <span className="text-xs text-neutral-400 font-mono">Word #7</span>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-7xl font-bold font-hanzi text-neutral-900">好</span>
                <div>
                  <span className="text-2xl font-mono font-bold text-neutral-800 block">hǎo</span>
                  <span className="text-xs text-neutral-500">3rd tone · Dipping</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[var(--color-paper)] border border-neutral-200/80 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-xs font-mono bg-neutral-200/70 text-neutral-700 font-medium">
                  adj./v./adv.
                </span>
                <span className="text-base font-medium text-neutral-900">
                  good; fine; well; proper; (completion suffix)
                </span>
              </div>
              <p className="text-xs text-neutral-600">
                Also pronounced <span className="font-mono font-medium text-neutral-800">hào</span> (4th tone) when meaning "to be fond of; curious".
              </p>
            </div>

            {/* Practice Controls */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <AudioButton text="好" size="md" label="Play Audio" showSlowToggle />
              <button
                type="button"
                onClick={() => requireAuthNavigate("/practice/tones")}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Volume2 size={14} />
                <span>Practice Tone</span>
              </button>
              <button
                type="button"
                onClick={() => requireAuthNavigate("/writing/%E5%A5%BD")}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 size={14} />
                <span>Write Character</span>
              </button>
            </div>
          </div>

          {/* Right: Stroke Order Preview */}
          <div className="lg:col-span-6 flex justify-center">
            <StrokeOrderViewer character="好" size={240} />
          </div>
        </div>
      </section>

      {/* Core Learning Methodology Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl border border-neutral-200 bg-white space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold font-hanzi text-lg">
            字
          </div>
          <h2 className="text-base font-bold text-neutral-900">Hanzi & Stroke Order</h2>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Every character includes true stroke order animations and a tactile handwriting canvas with trace and free-write modes.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-neutral-200 bg-white space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Volume2 size={20} />
          </div>
          <h2 className="text-base font-bold text-neutral-900">Pronunciation & Tones</h2>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Explore 5-tone Chao pitch contours, per-syllable audio, interactive tone discrimination exercises, and speed adjustments.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-neutral-200 bg-white space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Sparkles size={20} />
          </div>
          <h2 className="text-base font-bold text-neutral-900">Sentence Construction</h2>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Learn words in context through interactive sentence ordering and fill-in-the-blank grammar building exercises.
          </p>
        </div>
      </section>

      {/* Auth Modal for Landing Page Visitors */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab="login"
        defaultRole="student"
      />
    </div>
  );
};
