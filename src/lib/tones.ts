import { Tone } from "../types/hsk";

export interface ToneContourInfo {
  tone: Tone;
  label: string;
  chineseLabel: string;
  pitchNotation: string;
  contourPath: string; // SVG path command inside 100x100 viewBox
  colorClass: string;
  accentColor: string;
  description: string;
  vowelExample: string;
}

export const TONE_CONTOURS: Record<Tone, ToneContourInfo> = {
  1: {
    tone: 1,
    label: "1st Tone (High Level)",
    chineseLabel: "阴平 (一声)",
    pitchNotation: "55",
    contourPath: "M 10 24 L 90 24",
    colorClass: "text-blue-600 border-blue-500 bg-blue-50/50",
    accentColor: "#2563eb",
    description: "Keep your vocal pitch consistently high and steady, like a sustained musical note.",
    vowelExample: "ā (mā)",
  },
  2: {
    tone: 2,
    label: "2nd Tone (Rising)",
    chineseLabel: "阳平 (二声)",
    pitchNotation: "35",
    contourPath: "M 12 72 Q 45 55, 88 22",
    colorClass: "text-emerald-600 border-emerald-500 bg-emerald-50/50",
    accentColor: "#059669",
    description: "Glide upward from medium pitch to high pitch, like asking an inquisitive question 'What?!'",
    vowelExample: "á (má)",
  },
  3: {
    tone: 3,
    label: "3rd Tone (Dipping)",
    chineseLabel: "上声 (三声)",
    pitchNotation: "214",
    contourPath: "M 12 55 Q 40 85, 52 85 Q 68 85, 88 38",
    colorClass: "text-amber-600 border-amber-500 bg-amber-50/50",
    accentColor: "#d97706",
    description: "Start low-mid, dip down into your lower vocal register, then rise smoothly.",
    vowelExample: "ǎ (mǎ)",
  },
  4: {
    tone: 4,
    label: "4th Tone (Falling)",
    chineseLabel: "去声 (四声)",
    pitchNotation: "51",
    contourPath: "M 12 22 Q 45 45, 88 82",
    colorClass: "text-rose-600 border-rose-500 bg-rose-50/50",
    accentColor: "#e11d48",
    description: "Drop sharply and decisively from high pitch to low pitch, like a firm, emphatic command 'No!'",
    vowelExample: "à (mà)",
  },
  0: {
    tone: 0,
    label: "Neutral Tone",
    chineseLabel: "轻声 (轻声)",
    pitchNotation: "--",
    contourPath: "M 44 54 A 6 6 0 1 0 56 54 A 6 6 0 1 0 44 54",
    colorClass: "text-stone-600 border-stone-400 bg-stone-50",
    accentColor: "#78716c",
    description: "Short, light, and unstressed without a fixed pitch contour.",
    vowelExample: "a (ma)",
  },
  5: {
    tone: 5,
    label: "Neutral Tone",
    chineseLabel: "轻声",
    pitchNotation: "--",
    contourPath: "M 44 54 A 6 6 0 1 0 56 54 A 6 6 0 1 0 44 54",
    colorClass: "text-stone-600 border-stone-400 bg-stone-50",
    accentColor: "#78716c",
    description: "Short, light, and unstressed without a fixed pitch contour.",
    vowelExample: "a (ma)",
  },
};
