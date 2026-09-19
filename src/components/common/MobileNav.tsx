import React from "react";
import { LayoutDashboard, Layers, BookMarked, Sparkles, Bot } from "lucide-react";
import { navigate } from "../../services/routerService";

interface MobileNavProps {
  currentPath: string;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentPath }) => {
  const items = [
    { label: "Home", path: "/dashboard", icon: LayoutDashboard },
    { label: "Vocab", path: "/vocabulary", icon: BookMarked },
    { label: "AI Tutor", path: "/chat", icon: Bot },
    { label: "Practice", path: "/practice", icon: Sparkles },
    { label: "HSK", path: "/hsk", icon: Layers },
  ];

  const isActive = (path: string) => {
    if (path === "/dashboard") return currentPath === "/" || currentPath === "/dashboard";
    return currentPath.startsWith(path);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200/80 px-2 py-1.5 flex items-center justify-around safe-area-pb">
      {items.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);

        return (
          <button
            key={item.path}
            type="button"
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-2 rounded-lg text-[11px] font-medium transition-colors ${
              active
                ? "text-red-600 font-semibold"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <Icon size={20} className={active ? "text-red-600" : "text-neutral-400"} />
            <span className="mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
