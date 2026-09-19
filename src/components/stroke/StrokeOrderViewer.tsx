import React, { useEffect, useRef, useState } from "react";
import HanziWriter from "hanzi-writer";
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Grid,
  Sparkles,
  AlertCircle,
} from "lucide-react";

interface StrokeOrderViewerProps {
  character: string;
  size?: number;
  className?: string;
}

export const StrokeOrderViewer: React.FC<StrokeOrderViewerProps> = ({
  character,
  size = 240,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<"slow" | "normal" | "fast">("normal");
  const [currentStroke, setCurrentStroke] = useState(0);
  const [totalStrokes, setTotalStrokes] = useState<number | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Speed multiplier
  const speedMultipliers = {
    slow: 0.6,
    normal: 1.0,
    fast: 1.8,
  };

  useEffect(() => {
    if (!containerRef.current || !character) return;

    // Clean up previous instance
    containerRef.current.innerHTML = "";
    setIsLoading(true);
    setLoadError(false);
    setCurrentStroke(0);

    try {
      const writer = HanziWriter.create(containerRef.current, character[0], {
        width: size,
        height: size,
        padding: 20,
        showOutline: true,
        strokeAnimationSpeed: speedMultipliers[speed],
        delayBetweenStrokes: 180,
        strokeColor: "#D63A2F", // Vermilion
        outlineColor: "#D9DDE2",
        radicalColor: "#2563EB",
        onLoadCharDataSuccess: (data) => {
          setIsLoading(false);
          setTotalStrokes(data.strokes.length);
        },
        onLoadCharDataError: () => {
          setIsLoading(false);
          setLoadError(true);
        },
      });

      writerRef.current = writer;
    } catch (err) {
      console.warn("Could not initialize HanziWriter:", err);
      setIsLoading(false);
      setLoadError(true);
    }

    return () => {
      if (writerRef.current) {
        try {
          writerRef.current.cancelQuiz();
        } catch (_) {}
      }
    };
  }, [character, size]);

  // Update animation speed when speed changes
  useEffect(() => {
    if (writerRef.current) {
      // Re-create or adjust speed
    }
  }, [speed]);

  const handlePlay = () => {
    if (!writerRef.current) return;
    setIsPlaying(true);
    writerRef.current.animateCharacter({
      onComplete: () => {
        setIsPlaying(false);
        if (totalStrokes) setCurrentStroke(totalStrokes);
      },
    });
  };

  const handlePause = () => {
    if (!writerRef.current) return;
    writerRef.current.pauseAnimation();
    setIsPlaying(false);
  };

  const handleReplay = () => {
    if (!writerRef.current) return;
    setCurrentStroke(0);
    handlePlay();
  };

  const handleStepForward = () => {
    if (!writerRef.current || !totalStrokes) return;
    const nextStroke = Math.min(totalStrokes - 1, currentStroke);
    writerRef.current.animateStroke(nextStroke, {
      onComplete: () => {
        setCurrentStroke(Math.min(totalStrokes, nextStroke + 1));
      },
    });
  };

  const handleStepBackward = () => {
    if (!writerRef.current || currentStroke <= 0) return;
    const prev = Math.max(0, currentStroke - 1);
    setCurrentStroke(prev);
    writerRef.current.hideCharacter();
    for (let i = 0; i < prev; i++) {
      writerRef.current.animateStroke(i);
    }
  };

  return (
    <div className={`flex flex-col items-center p-6 rounded-2xl border border-neutral-200 bg-white ${className}`}>
      {/* Grid Canvas Stage */}
      <div className="relative mb-5 flex flex-col items-center">
        <div
          className={`relative rounded-xl border-2 border-neutral-200/90 shadow-inner flex items-center justify-center overflow-hidden transition-all ${
            showGrid ? "tian-zi-ge bg-[var(--color-paper)]" : "bg-white"
          }`}
          style={{ width: size, height: size }}
        >
          {/* Target for HanziWriter SVG */}
          <div ref={containerRef} className="z-10" />

          {/* Loading or Error Overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-20">
              <span className="text-xs text-neutral-500 font-mono">Loading strokes...</span>
            </div>
          )}

          {loadError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-white/95 z-20 space-y-2">
              <span className="text-6xl font-hanzi font-bold text-neutral-900">{character[0]}</span>
              <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                <AlertCircle size={14} className="text-amber-500" />
                <span>Stroke vector data unavailable offline for this character</span>
              </div>
            </div>
          )}
        </div>

        {/* Character & Stroke Count Header */}
        <div className="flex items-center justify-between w-full mt-3 px-1 text-xs text-neutral-600 font-mono">
          <span className="font-semibold text-neutral-900 font-sans">
            {totalStrokes ? `${totalStrokes} Strokes` : "Stroke Order"}
          </span>
          <button
            type="button"
            onClick={() => setShowGrid(!showGrid)}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border transition-colors ${
              showGrid ? "bg-neutral-100 text-neutral-800 border-neutral-300" : "text-neutral-400 border-transparent"
            }`}
          >
            <Grid size={12} />
            <span>Grid</span>
          </button>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="w-full space-y-3">
        {/* Main Transport Buttons */}
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={handleStepBackward}
            title="Previous stroke"
            className="p-2 rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50 active:bg-neutral-100"
          >
            <SkipBack size={16} />
          </button>

          {isPlaying ? (
            <button
              type="button"
              onClick={handlePause}
              className="px-4 py-2 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 flex items-center gap-1.5 text-sm font-semibold shadow-xs"
            >
              <Pause size={16} />
              <span>Pause</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePlay}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 flex items-center gap-1.5 text-sm font-semibold shadow-xs"
            >
              <Play size={16} />
              <span>Animate</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleReplay}
            title="Replay from start"
            className="p-2 rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50 active:bg-neutral-100"
          >
            <RotateCcw size={16} />
          </button>

          <button
            type="button"
            onClick={handleStepForward}
            title="Next stroke"
            className="p-2 rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50 active:bg-neutral-100"
          >
            <SkipForward size={16} />
          </button>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center justify-center gap-1 text-xs">
          <span className="text-neutral-600 mr-1.5 font-medium">Speed:</span>
          {(["slow", "normal", "fast"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSpeed(s)}
              className={`px-2.5 py-1 rounded capitalize transition-colors ${
                speed === s
                  ? "bg-neutral-800 text-white font-semibold"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
