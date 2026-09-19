import React, { useState, useEffect } from "react";
import { TopBar } from "./TopBar";
import { Sidebar } from "./Sidebar";
import { AdminTopBar } from "../admin/AdminTopBar";
import { AdminSidebar } from "../admin/AdminSidebar";
import { StudentPreviewBanner } from "../admin/StudentPreviewBanner";
import { MobileNav } from "./MobileNav";
import { FloatingAiTutor } from "../chat/FloatingAiTutor";
import { QuickDictionaryModal } from "./QuickDictionaryModal";
import { useAuth } from "../../context/AuthContext";
import { bengaliService } from "../../services/bengaliService";
import { adminStateService } from "../../services/adminStateService";
import { AuthModal } from "../auth/AuthModal";

interface AppShellProps {
  currentPath: string;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ currentPath, children }) => {
  const { user, isAdmin } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDictionaryOpen, setIsDictionaryOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isBn, setIsBn] = useState(bengaliService.getLanguage() === "bn");
  const [previewAsStudent, setPreviewAsStudent] = useState(adminStateService.isPreviewAsStudent());

  useEffect(() => {
    const unsubB = bengaliService.subscribe(() => {
      setIsBn(bengaliService.getLanguage() === "bn");
    });
    const unsubA = adminStateService.subscribe(() => {
      setPreviewAsStudent(adminStateService.isPreviewAsStudent());
    });
    return () => {
      unsubB();
      unsubA();
    };
  }, []);

  // Determine effective mode:
  // If user is Admin and NOT previewing as student -> ADMIN INTERFACE
  // Otherwise -> STUDENT INTERFACE
  const showAdminInterface = isAdmin && !previewAsStudent;

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
      {/* Sticky preview banner for Admin while in student view mode */}
      {isAdmin && previewAsStudent && <StudentPreviewBanner />}

      {/* Role-based TopBar: Admin sees AdminTopBar, Student sees Student TopBar */}
      {showAdminInterface ? (
        <AdminTopBar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      ) : (
        <TopBar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onOpenDictionary={() => setIsDictionaryOpen(true)}
        />
      )}

      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        {/* Role-based Sidebar: Admin sees AdminSidebar, Student sees Student Sidebar */}
        {showAdminInterface ? (
          <AdminSidebar
            currentPath={currentPath}
            isOpenMobile={isSidebarOpen}
            onCloseMobile={() => setIsSidebarOpen(false)}
          />
        ) : (
          <Sidebar
            currentPath={currentPath}
            isOpenMobile={isSidebarOpen}
            onCloseMobile={() => setIsSidebarOpen(false)}
          />
        )}

        <main className="flex-1 min-w-0 px-4 py-6 md:px-8 md:py-8 pb-24 md:pb-12">
          {children}
        </main>
      </div>

      {/* Floating AI Tutor & Mobile Nav only for student experience */}
      {!showAdminInterface && (
        <>
          <FloatingAiTutor />
          <MobileNav currentPath={currentPath} />
        </>
      )}

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
