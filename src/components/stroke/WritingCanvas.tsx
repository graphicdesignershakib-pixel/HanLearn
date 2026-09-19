import React, { useRef, useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  RotateCcw,
  Trash2,
  HelpCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  Undo2,
} from "lucide-react";

interface WritingCanvasProps {
  character: string;
  size?: number;
  onComplete?: () => void;
  className?: string;
}

interface Point {
  x: number;
  y: number;
}

export const WritingCanvas: React.FC<WritingCanvasProps> = ({
  character,
  size = 300,
  onComplete,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<"trace" | "free">("trace");
  const [showGuide, setShowGuide] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState<Point[][]>([]);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
  const [completed, setCompleted] = useState(false);

  // Redraw canvas whenever strokes or mode changes
  const redraw = (allStrokes: Point[][], current: Point[] = []) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calligraphy ink stroke styling
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#101214"; // Ink 950

    const drawLine = (pts: Point[]) => {
      if (pts.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
      }
      ctx.stroke();
    };

    allStrokes.forEach(drawLine);
    if (current.length > 0) {
      drawLine(current);
    }
  };

  // Touch & Mouse coordinates handler
  const getCoordinates = (e: React.MouseEvent | React.TouchEvent): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();

    let clientX = 0;
    let clientY = 0;

    if ("touches" in e) {
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const pt = getCoordinates(e);
    if (!pt) return;
    setIsDrawing(true);
    setCurrentStroke([pt]);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const pt = getCoordinates(e);
    if (!pt) return;

    const next = [...currentStroke, pt];
    setCurrentStroke(next);
    redraw(strokes, next);
  };

  const handleEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    setIsDrawing(false);

    if (currentStroke.length > 1) {
      const nextStrokes = [...strokes, currentStroke];
      setStrokes(nextStrokes);
      redraw(nextStrokes, []);
    }
    setCurrentStroke([]);
  };

  const handleUndo = () => {
    if (strokes.length === 0) return;
    const nextStrokes = strokes.slice(0, -1);
    setStrokes(nextStrokes);
    redraw(nextStrokes, []);
  };

  const handleClear = () => {
    setStrokes([]);
    setCurrentStroke([]);
    setCompleted(false);
    redraw([]);
  };

  const handleMarkComplete = () => {
    setCompleted(true);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#D63A2F", "#E24A3C", "#2A2D31", "#FCE8E5"],
      });
    } catch (_) {}
    if (onComplete) onComplete();
  };

  return (
    <div className={`flex flex-col items-center p-6 rounded-2xl border border-neutral-200 bg-white ${className}`}>
      {/* Mode Switcher */}
      <div className="flex items-center gap-1 p-1 mb-4 rounded-lg bg-neutral-100 border border-neutral-200/60 text-xs">
        <button
          type="button"
          onClick={() => {
            setMode("trace");
            setShowGuide(true);
          }}
          className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
            mode === "trace"
              ? "bg-white text-neutral-900 shadow-xs"
              : "text-neutral-500 hover:text-neutral-800"
          }`}
        >
          Trace Guide
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("free");
            setShowGuide(false);
          }}
          className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
            mode === "free"
              ? "bg-white text-neutral-900 shadow-xs"
              : "text-neutral-500 hover:text-neutral-800"
          }`}
        >
          Free Write
        </button>
      </div>

      {/* Writing Stage */}
      <div
        className="relative rounded-2xl border-2 border-neutral-300 shadow-inner overflow-hidden select-none tian-zi-ge bg-[var(--color-paper)]"
        style={{
          width: size,
          height: size,
          touchAction: "none", // Essential to prevent accidental scrolling on touch screens
        }}
      >
        {/* Guide Character in Background for Trace Mode */}
        {mode === "trace" && showGuide && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none text-neutral-300 font-hanzi font-bold"
            style={{ fontSize: size * 0.76 }}
          >
            {character[0]}
          </div>
        )}

        {/* Interactive Canvas */}
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
          className="absolute inset-0 z-10 cursor-crosshair"
        />

        {/* Completion Banner */}
        {completed && (
          <div className="absolute inset-0 z-20 bg-emerald-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4 text-center">
            <CheckCircle2 size={42} className="text-emerald-400 mb-2" />
            <h4 className="text-lg font-bold">Great Character!</h4>
            <p className="text-xs text-emerald-200 mt-1">Character practice recorded</p>
            <button
              type="button"
              onClick={handleClear}
              className="mt-4 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-white text-emerald-900 hover:bg-emerald-50"
            >
              Practice Again
            </button>
          </div>
        )}
      </div>

      {/* Stroke count hint & guide controls */}
      <div className="flex items-center justify-between w-full mt-3 px-2 text-xs text-neutral-600 font-mono">
        <span>{strokes.length} strokes drawn</span>
        {mode === "trace" && (
          <button
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            className="inline-flex items-center gap-1 text-neutral-500 hover:text-neutral-900 font-sans"
          >
            {showGuide ? <EyeOff size={13} /> : <Eye size={13} />}
            <span>{showGuide ? "Hide Outline" : "Show Outline"}</span>
          </button>
        )}
      </div>

      {/* Action Controls */}
      <div className="flex items-center justify-between w-full mt-4 gap-2">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleUndo}
            disabled={strokes.length === 0}
            title="Undo last stroke"
            className="p-2 rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Undo2 size={16} />
          </button>
          <button
            type="button"
            onClick={handleClear}
            disabled={strokes.length === 0}
            title="Clear all strokes"
            className="p-2 rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <button
          type="button"
          onClick={handleMarkComplete}
          disabled={strokes.length === 0}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
        >
          <Sparkles size={14} />
          <span>Done & Record</span>
        </button>
      </div>
    </div>
  );
};
