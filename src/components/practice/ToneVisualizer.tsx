import React from "react";
import { Tone } from "../../types/hsk";
import { TONE_CONTOURS, ToneContourInfo } from "../../lib/tones";
import { AudioButton } from "../common/AudioButton";

interface ToneVisualizerProps {
  tone: Tone;
  syllable?: string;
  className?: string;
}

export const ToneVisualizer: React.FC<ToneVisualizerProps> = ({
  tone,
  syllable,
  className = "",
}) => {
  const info: ToneContourInfo = TONE_CONTOURS[tone] || TONE_CONTOURS[0];

  return (
    <div className={`p-4 rounded-xl border border-neutral-200 bg-white space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-900 text-sm">{info.label}</span>
            <span className="text-xs text-neutral-500 font-hanzi">{info.chineseLabel}</span>
          </div>
          <span className="text-xs text-neutral-500">Pitch scale: {info.pitchNotation}</span>
        </div>

        {syllable && <AudioButton text={syllable} size="sm" />}
      </div>

      {/* SVG 5-Point Tone Grid Visualizer */}
      <div className="relative w-full h-28 bg-[var(--color-paper)] rounded-lg border border-neutral-100 flex items-center justify-center p-2">
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          {/* Pitch scale lines 5, 4, 3, 2, 1 */}
          {[20, 36, 52, 68, 84].map((y, i) => (
            <g key={y}>
              <line
                x1="10"
                y1={y}
                x2="90"
                y2={y}
                stroke="#E4E7EB"
                strokeWidth="0.8"
                strokeDasharray="2,2"
              />
              <text
                x="4"
                y={y + 3}
                fontSize="6"
                fill="#8E959F"
                fontFamily="sans-serif"
                textAnchor="middle"
              >
                {5 - i}
              </text>
            </g>
          ))}

          {/* Target Tone Pitch Curve */}
          <path
            d={info.contourPath}
            fill={tone === 0 || tone === 5 ? info.accentColor : "none"}
            stroke={info.accentColor}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <p className="text-xs text-neutral-600 leading-relaxed">{info.description}</p>

      <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-600">
        <span>Example:</span>
        <span className="font-mono font-medium text-neutral-800">{info.vowelExample}</span>
      </div>
    </div>
  );
};
