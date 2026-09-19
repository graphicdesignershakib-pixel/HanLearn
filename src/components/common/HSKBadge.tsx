import React from "react";
import { HskLevel } from "../../types/hsk";

interface HSKBadgeProps {
  level: HskLevel;
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
}

export const HSKBadge: React.FC<HSKBadgeProps> = ({
  level,
  size = "md",
  className = "",
  onClick,
}) => {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs font-medium tracking-wide",
    md: "px-2.5 py-1 text-xs font-semibold tracking-wider",
    lg: "px-3 py-1.5 text-sm font-semibold tracking-wider",
  }[size];

  const content = (
    <span
      className={`inline-flex items-center justify-center rounded-md border border-neutral-200/80 bg-neutral-100 text-neutral-800 font-mono ${sizeClasses} ${
        onClick ? "cursor-pointer hover:border-neutral-400 hover:bg-neutral-200 transition-colors" : ""
      } ${className}`}
      onClick={onClick}
    >
      HSK {level}
    </span>
  );

  return content;
};
