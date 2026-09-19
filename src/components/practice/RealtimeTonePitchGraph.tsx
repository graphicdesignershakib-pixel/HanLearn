import React, { useEffect, useRef } from "react";
import { Tone } from "../../types/hsk";
import { TONE_CONTOURS } from "../../lib/tones";

interface RealtimeTonePitchGraphProps {
  targetTone: Tone;
  pitchPoints: number[]; // User detected F0 values (Hz)
  isListening: boolean;
  userToneContour?: number; // Estimated tone based on pitch drift
  className?: string;
  height?: number;
}

export const RealtimeTonePitchGraph: React.FC<RealtimeTonePitchGraphProps> = ({
  targetTone,
  pitchPoints,
  isListening,
  className = "",
  height = 180,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const targetInfo = TONE_CONTOURS[targetTone] || TONE_CONTOURS[1];

  // Draw the canvas with 5-point Chao tone scale and user pitch curve
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle high-DPI displays
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.parentElement?.clientWidth || 360;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Clear background
    ctx.fillStyle = "#FAF8F5"; // Warm parchment neutral
    ctx.fillRect(0, 0, width, height);

    const paddingX = 40;
    const paddingY = 24;
    const drawWidth = width - paddingX * 2;
    const drawHeight = height - paddingY * 2;

    // Draw 5-level pitch grid lines (Chao 5-level pitch system: 5=high, 1=low)
    const pitchLevels = [
      { level: 5, name: "5 - High (高)", yRatio: 0 },
      { level: 4, name: "4 - Mid-High (半高)", yRatio: 0.25 },
      { level: 3, name: "3 - Mid (中)", yRatio: 0.5 },
      { level: 2, name: "2 - Mid-Low (半低)", yRatio: 0.75 },
      { level: 1, name: "1 - Low (低)", yRatio: 1.0 },
    ];

    ctx.lineWidth = 1;
    ctx.font = "10px Inter, system-ui, sans-serif";
    ctx.textBaseline = "middle";

    pitchLevels.forEach((p) => {
      const y = paddingY + drawHeight * p.yRatio;

      // Dashed grid line
      ctx.strokeStyle = p.level === 3 ? "#D1D5DB" : "#E5E7EB";
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(paddingX, y);
      ctx.lineTo(paddingX + drawWidth, y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Label on the left
      ctx.fillStyle = "#9CA3AF";
      ctx.fillText(`${p.level}`, paddingX - 18, y);
    });

    // Draw IDEAL TARGET TONE CURVE (Thick colored line)
    ctx.lineWidth = 4;
    ctx.strokeStyle = targetInfo.accentColor;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();

    const steps = 50;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps; // 0.0 to 1.0
      const x = paddingX + drawWidth * t;
      let yRatio = 0.5;

      switch (targetTone) {
        case 1:
          // 55: Flat high level
          yRatio = 0.08;
          break;
        case 2:
          // 35: Mid to high rising
          yRatio = 0.65 - 0.55 * t;
          break;
        case 3:
          // 214: Mid-low to low, then rising
          if (t < 0.55) {
            yRatio = 0.75 + (0.92 - 0.75) * (t / 0.55);
          } else {
            yRatio = 0.92 - (0.92 - 0.35) * ((t - 0.55) / 0.45);
          }
          break;
        case 4:
          // 51: High dropping to low
          yRatio = 0.08 + 0.82 * t;
          break;
        case 0:
        default:
          // Neutral: short mid dot
          yRatio = 0.5;
          break;
      }

      const y = paddingY + drawHeight * yRatio;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Target Tone Annotation tag on target line
    ctx.fillStyle = targetInfo.accentColor;
    ctx.font = "bold 11px system-ui, sans-serif";
    ctx.fillText(`Target: ${targetInfo.label}`, paddingX + 12, paddingY + 16);

    // Draw USER RECORDED PITCH POINTS (Overlay in real-time)
    if (pitchPoints && pitchPoints.length > 1) {
      // Filter valid pitch values
      const validPoints = pitchPoints.filter((p) => p > 0);
      if (validPoints.length > 1) {
        // Calculate median pitch to auto-scale to user's individual vocal range (Male vs Female vocal range normalization)
        const sorted = [...validPoints].sort((a, b) => a - b);
        const median = sorted[Math.floor(sorted.length / 2)] || 180;
        const minExpected = Math.max(60, median * 0.65);
        const maxExpected = median * 1.55;
        const range = maxExpected - minExpected || 100;

        ctx.lineWidth = 3.5;
        ctx.strokeStyle = "#8B5CF6"; // Purple tone for user voice
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();

        let started = false;
        pitchPoints.forEach((f, idx) => {
          if (f <= 0) {
            started = false;
            return;
          }
          const t = idx / Math.max(1, pitchPoints.length - 1);
          const x = paddingX + drawWidth * t;
          // Normalized pitch (1.0 = top, 0.0 = bottom)
          const normalized = Math.max(0, Math.min(1, (f - minExpected) / range));
          const y = paddingY + drawHeight * (1.0 - normalized);

          if (!started) {
            ctx.moveTo(x, y);
            started = true;
          } else {
            ctx.lineTo(x, y);
          }
        });
        ctx.stroke();

        // User vocal pitch indicator dot at the latest point
        const latestF = pitchPoints[pitchPoints.length - 1];
        if (latestF > 0) {
          const t = 1.0;
          const x = paddingX + drawWidth * t;
          const normalized = Math.max(0, Math.min(1, (latestF - minExpected) / range));
          const y = paddingY + drawHeight * (1.0 - normalized);

          ctx.fillStyle = "#8B5CF6";
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#4C1D95";
          ctx.font = "bold 10px monospace";
          ctx.fillText(`${Math.round(latestF)}Hz`, x - 36, y - 8);
        }
      }
    }

    // Legend at bottom
    ctx.font = "10px Inter, system-ui, sans-serif";
    ctx.fillStyle = "#6B7280";
    ctx.fillText("Time (শুরুর মুহূর্ত → শেষ মুহূর্ত)", paddingX, height - 6);

    ctx.fillStyle = targetInfo.accentColor;
    ctx.fillRect(width - 150, height - 14, 10, 8);
    ctx.fillStyle = "#374151";
    ctx.fillText("Target Tone", width - 135, height - 7);

    ctx.fillStyle = "#8B5CF6";
    ctx.fillRect(width - 70, height - 14, 10, 8);
    ctx.fillStyle = "#374151";
    ctx.fillText("Your Voice", width - 55, height - 7);

  }, [targetTone, pitchPoints, isListening, height, targetInfo]);

  return (
    <div className={`relative rounded-xl border border-neutral-200 overflow-hidden bg-[#FAF8F5] ${className}`}>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: `${height}px`, display: "block" }}
      />
    </div>
  );
};
