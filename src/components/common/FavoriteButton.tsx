import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { progressService } from "../../services/progressService";

interface FavoriteButtonProps {
  wordId: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  onToggle?: (isFav: boolean) => void;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  wordId,
  size = "md",
  className = "",
  onToggle,
}) => {
  const [isFav, setIsFav] = useState(() => progressService.isFavorite(wordId));

  useEffect(() => {
    const unsub = progressService.subscribe(() => {
      setIsFav(progressService.isFavorite(wordId));
    });
    return unsub;
  }, [wordId]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = progressService.toggleFavorite(wordId);
    setIsFav(next);
    if (onToggle) onToggle(next);
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  }[size];

  const buttonPaddings = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-2.5",
  }[size];

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isFav ? "Remove from saved words" : "Save word to favorites"}
      className={`rounded-full transition-colors ${buttonPaddings} ${
        isFav
          ? "text-amber-500 hover:text-amber-600 bg-amber-50/70"
          : "text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
      } ${className}`}
    >
      <Star
        size={iconSizes}
        fill={isFav ? "currentColor" : "none"}
        className="transition-transform active:scale-90"
      />
    </button>
  );
};
