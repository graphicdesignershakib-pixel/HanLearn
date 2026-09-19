import React, { useState, useEffect } from "react";
import {
  Volume2,
  X,
  Gauge,
  Repeat,
  Sparkles,
  Play,
  RotateCcw,
  Check,
  Headphones,
} from "lucide-react";
import { audioService, AudioSettings } from "../../services/audioService";
import { bengaliService } from "../../services/bengaliService";

interface AudioSpeedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AudioSpeedModal: React.FC<AudioSpeedModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [settings, setSettings] = useState<AudioSettings>(audioService.getSettings());
  const [isBn, setIsBn] = useState(bengaliService.getLanguage() === "bn");
  const [isPlayingTest, setIsPlayingTest] = useState(false);

  useEffect(() => {
    const unsubB = bengaliService.subscribe(() => {
      setIsBn(bengaliService.getLanguage() === "bn");
    });
    const unsubS = audioService.onSettingsChange((s) => {
      setSettings(s);
    });
    return () => {
      unsubB();
      unsubS();
    };
  }, []);

  if (!isOpen) return null;

  const speedOptions = [
    {
      value: 0.5,
      label: "0.5x",
      title: "Super Slow",
      titleBn: "খুব ধীর (উচ্চারণ বিশ্লেষণ)",
      desc: "Ideal for breaking down difficult tones & finals",
    },
    {
      value: 0.75,
      label: "0.75x",
      title: "Careful Study",
      titleBn: "ধীর গতি (শিক্ষার্থীদের জন্য সেরা)",
      desc: "Clear tone separation without robotic distortion",
    },
    {
      value: 1.0,
      label: "1.0x",
      title: "Standard",
      titleBn: "স্বাভাবিক গতি (প্রমিত উচ্চারণ)",
      desc: "Natural standard Beijing Mandarin tempo",
    },
    {
      value: 1.25,
      label: "1.25x",
      title: "Native Fast",
      titleBn: "দ্রুত গতি (এইচএসকে লিসেনিং চ্যালেঞ্জ)",
      desc: "Prepares your ear for real-life conversational speed",
    },
  ];

  const repeatOptions = [
    {
      value: 1,
      label: "1x",
      title: "Single Play",
      titleBn: "একবার বাজবে",
    },
    {
      value: 2,
      label: "2x",
      title: "Double Play",
      titleBn: "পরপর ২ বার বাজবে",
    },
    {
      value: 3,
      label: "3x",
      title: "Triple Drill",
      titleBn: "পরপর ৩ বার ড্রিল",
    },
    {
      value: -1,
      label: "∞ Loop",
      title: "Continuous Repeat",
      titleBn: "অবিরাম লুপ (বারবার পুনরাবৃত্তি)",
    },
  ];

  const handleSelectSpeed = (val: number) => {
    audioService.setRate(val);
    setSettings({ ...settings, rate: val });
  };

  const handleSelectRepeat = (val: number) => {
    audioService.setRepeatCount(val);
    setSettings({ ...settings, repeatCount: val });
  };

  const handleTestSpeech = async () => {
    setIsPlayingTest(true);
    await audioService.playText("你好！欢迎使用智能汉语发音系统。");
    setIsPlayingTest(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-2xl overflow-hidden p-6 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center shadow-xs">
              <Headphones size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                {isBn ? "স্মার্ট অডিও ও উচ্চারণ সেটিংস" : "Smart Audio & Pronunciation"}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {isBn ? "উচ্চারণের গতি ও পুনরাবৃত্তি নিয়ন্ত্রণ করুন" : "Adjust speech tempo and loop repeats"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Section 1: Playback Speed */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Gauge size={14} className="text-[var(--color-primary)]" />
              {isBn ? "উচ্চারণের গতি (Speech Speed)" : "Speech Speed"}
            </span>
            <span className="text-xs font-extrabold text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2 py-0.5 rounded-md">
              {settings.rate}x
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {speedOptions.map((opt) => {
              const isSelected = settings.rate === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelectSpeed(opt.value)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-neutral-900 dark:text-white shadow-2xs"
                      : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 text-neutral-700 dark:text-neutral-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-black text-[var(--color-primary)]">
                      {opt.label}
                    </span>
                    {isSelected && <Check size={14} className="text-[var(--color-primary)]" />}
                  </div>
                  <div className="text-xs font-bold truncate">
                    {isBn ? opt.titleBn : opt.title}
                  </div>
                  <div className="text-[10px] text-neutral-400 dark:text-neutral-500 line-clamp-1 mt-0.5">
                    {opt.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Repeat & Loop Mode */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Repeat size={14} className="text-amber-500" />
              {isBn ? "পুনরাবৃত্তি মোড (Repeat Count)" : "Repeat / Loop Count"}
            </span>
            <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
              {settings.repeatCount === -1 ? "∞ Continuous" : `${settings.repeatCount}x`}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {repeatOptions.map((opt) => {
              const isSelected = settings.repeatCount === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelectRepeat(opt.value)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? "border-amber-500 bg-amber-500/10 text-amber-900 dark:text-amber-300 font-extrabold shadow-2xs"
                      : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 text-neutral-700 dark:text-neutral-300"
                  }`}
                >
                  <div className="text-xs font-black">{opt.label}</div>
                  <div className="text-[10px] text-neutral-400 truncate mt-0.5">
                    {isBn ? opt.titleBn : opt.title}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Test Speech Sample */}
        <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-neutral-800 dark:text-neutral-200 font-hanzi">
              你好！欢迎使用智能汉语发音系统。
            </div>
            <div className="text-[10px] text-neutral-400">
              Nǐ hǎo! Huānyíng shǐyòng zhìnéng hànyǔ fāyīn xìtǒng.
            </div>
          </div>

          <button
            type="button"
            onClick={handleTestSpeech}
            disabled={isPlayingTest}
            className="px-3 py-1.5 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
          >
            <Play size={13} className={isPlayingTest ? "animate-pulse" : ""} />
            <span>{isBn ? "টেস্ট শুনুন" : "Test Audio"}</span>
          </button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800">
          <button
            type="button"
            onClick={() => {
              handleSelectSpeed(1.0);
              handleSelectRepeat(1);
            }}
            className="text-xs text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>{isBn ? "ডিফল্ট রিসেট" : "Reset Default"}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer"
          >
            {isBn ? "ঠিক আছে" : "Save & Close"}
          </button>
        </div>
      </div>
    </div>
  );
};
