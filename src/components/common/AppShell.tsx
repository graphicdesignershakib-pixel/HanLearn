import React, { useState, useEffect } from "react";
import { TopBar } from "./TopBar";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { FloatingAiTutor } from "../chat/FloatingAiTutor";
import { QuickDictionaryModal } from "./QuickDictionaryModal";
import { useAuth } from "../../context/AuthContext";
import { bengaliService } from "../../services/bengaliService";
import { AuthModal } from "../auth/AuthModal";
import { ShieldCheck, LogIn, Lock } from "lucide-react";

interface AppShellProps {
  currentPath: string;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ currentPath, children }) => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDictionaryOpen, setIsDictionaryOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isBn, setIsBn] = useState(bengaliService.getLanguage() === "bn");

  useEffect(() => {
    const unsub = bengaliService.subscribe(() => {
      setIsBn(bengaliService.getLanguage() === "bn");
    });
    return unsub;
  }, []);

  // Global Cmd+K / Ctrl+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsDictionaryOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-paper)] text-neutral-950 flex flex-col">
      {/* Security alert ribbon if visitor is unauthenticated */}
      {!user && (
        <div className="bg-neutral-950 text-neutral-200 border-b border-neutral-800 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <ShieldCheck size={14} className="text-red-400 shrink-0" />
            <span className="font-bold text-white">
              {isBn ? "সিকিউরিটি সিস্টেম সক্রিয়:" : "Security System Active:"}
            </span>
            <span className="text-neutral-300">
              {isBn
                ? "শব্দকোষ, পরীক্ষা, অনুশীলন ও এআই ফিচার ব্যবহার করতে লগইন বা রেজিস্ট্রেশন আবশ্যক।"
                : "Sign In or Register required to access courses, full vocabulary and AI features."}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(true)}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogIn size={13} />
            <span>{isBn ? "লগইন / রেজিস্ট্রেশন" : "Sign In / Register"}</span>
          </button>
        </div>
      )}

      <TopBar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onOpenDictionary={() => setIsDictionaryOpen(true)}
      />

      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        <Sidebar
          currentPath={currentPath}
          isOpenMobile={isSidebarOpen}
          onCloseMobile={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 min-w-0 px-4 py-6 md:px-8 md:py-8 pb-24 md:pb-12">
          {children}
        </main>
      </div>

      <FloatingAiTutor />
      <MobileNav currentPath={currentPath} />

      {/* Global Quick-Dictionary Cmd+K Modal */}
      <QuickDictionaryModal
        isOpen={isDictionaryOpen}
        onClose={() => setIsDictionaryOpen(false)}
      />

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};
