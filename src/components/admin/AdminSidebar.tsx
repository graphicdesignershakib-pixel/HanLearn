import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Layers,
  FolderPlus,
  BookOpen,
  Users,
  BarChart3,
  FileCheck,
  AlertCircle,
  Settings,
  ShieldCheck,
  Eye,
  LogOut,
  ChevronDown,
  ChevronRight,
  Database,
  Sparkles,
  Search,
  BookMarked,
  FileSpreadsheet,
} from "lucide-react";
import { navigate } from "../../services/routerService";
import { bengaliService } from "../../services/bengaliService";
import { useAuth } from "../../context/AuthContext";
import { adminStateService } from "../../services/adminStateService";
import { themeService } from "../../services/themeService";

interface AdminSidebarProps {
  currentPath: string;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentPath,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { user, profile, signOut } = useAuth();
  const [isBn, setIsBn] = useState(bengaliService.getLanguage() === "bn");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const unsubB = bengaliService.subscribe(() => {
      setIsBn(bengaliService.getLanguage() === "bn");
    });
    return unsubB;
  }, []);

  const handleNavClick = (path: string) => {
    navigate(path);
    if (onCloseMobile) onCloseMobile();
  };

  const handleSwitchToStudent = () => {
    adminStateService.setPreviewAsStudent(true);
    handleNavClick("/dashboard");
  };

  const isItemActive = (path: string) => {
    if (path === "/admin") {
      return currentPath === "/admin" || currentPath === "/admin/dashboard";
    }
    return currentPath === path || currentPath.startsWith(path + "/");
  };

  const adminMenuGroups = [
    {
      id: "overview",
      name: "Dashboard & Analytics",
      nameBn: "ড্যাশবোর্ড ও বিশ্লেষণ",
      icon: LayoutDashboard,
      items: [
        {
          label: "Admin Command Center",
          bengaliLabel: "অ্যাডমিন কমান্ড সেন্টার",
          path: "/admin",
          icon: LayoutDashboard,
        },
        {
          label: "Learning Analytics & Stats",
          bengaliLabel: "শিক্ষার্থী অগ্রগতি বিশ্লেষণ",
          path: "/progress",
          icon: BarChart3,
        },
      ],
    },
    {
      id: "content",
      name: "Content & Resources",
      nameBn: "রিসোর্স ও কনটেন্ট ম্যানেজমেন্ট",
      icon: FolderPlus,
      items: [
        {
          label: "Add / Manage Resources",
          bengaliLabel: "রিসোর্স ইনপুট ও ডাটাবেস",
          path: "/admin/resources",
          icon: FolderPlus,
          badge: "Main",
        },
        {
          label: "Vocabulary Master DB",
          bengaliLabel: "শব্দকোষ ডাটাবেস ভিউ",
          path: "/vocabulary",
          icon: BookMarked,
        },
        {
          label: "Exam Paper & Quiz Builder",
          bengaliLabel: "প্রশ্নপত্র ও কুইজ মেকার",
          path: "/admin/exam-builder",
          icon: FileCheck,
          badge: "NEW",
        },
        {
          label: "Mock Exam Papers",
          bengaliLabel: "মক টেস্ট ও প্রশ্নপত্র",
          path: "/exam",
          icon: FileCheck,
        },
        {
          label: "Printable Worksheets",
          bengaliLabel: "প্রিন্টেবল শিট ও চিট-শীট",
          path: "/worksheets",
          icon: FileSpreadsheet,
        },
        {
          label: "Global Leaderboard",
          bengaliLabel: "আন্তর্জাতিক লিডারবোর্ড",
          path: "/leaderboard",
          icon: Layers,
        },
        {
          label: "Grammar Curriculum",
          bengaliLabel: "ব্যাকরণ পাঠ্যক্রম",
          path: "/grammar",
          icon: BookOpen,
        },
      ],
    },
    {
      id: "quality",
      name: "Quality & Review",
      nameBn: "গুণমান ও মূল্যায়ন",
      icon: AlertCircle,
      items: [
        {
          label: "Common Mistakes Review",
          bengaliLabel: "সাধারণ ভুল পর্যালোচনা",
          path: "/mistake-book",
          icon: AlertCircle,
        },
        {
          label: "Data Quality Checker",
          bengaliLabel: "শব্দ ডেটা মান যাচাই",
          path: "/dev/data-quality",
          icon: Database,
        },
        {
          label: "Curriculum Syllabus",
          bengaliLabel: "পাঠ পরিকল্পনা ও সিলেবাস",
          path: "/study-plan",
          icon: FileSpreadsheet,
        },
      ],
    },
    {
      id: "system",
      name: "System Settings",
      nameBn: "সিস্টেম ও কনফিগারেশন",
      icon: Settings,
      items: [
        {
          label: "Platform Preferences",
          bengaliLabel: "প্ল্যাটফর্ম সেটিংস",
          path: "/settings",
          icon: Settings,
        },
      ],
    },
  ];

  return (
    <>
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-72 bg-white dark:bg-neutral-900 border-r border-neutral-200/80 dark:border-neutral-800 flex flex-col transition-transform duration-300 ease-in-out shadow-xs md:shadow-none ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Header with Admin Badge */}
        <div className="p-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <div
              onClick={() => handleNavClick("/admin")}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-lg shadow-md group-hover:scale-105 transition-transform">
                汉
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight text-neutral-900 dark:text-white">
                    HanLearn
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-600 text-white uppercase tracking-wider">
                    ADMIN
                  </span>
                </div>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium truncate max-w-[150px]">
                  {isBn ? "প্রশাসনিক নিয়ন্ত্রণ কেন্দ্র" : "Administrative Console"}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Switch to Student View Banner */}
          <button
            type="button"
            onClick={handleSwitchToStudent}
            className="w-full mt-3 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300/80 dark:border-amber-800/60 text-amber-900 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-xs font-bold transition-all flex items-center justify-between cursor-pointer shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <Eye size={15} className="text-amber-600 dark:text-amber-400" />
              <span>{isBn ? "শিক্ষার্থী ভিউ প্রিভিউ" : "Switch to Student View"}</span>
            </div>
            <ChevronRight size={14} className="text-amber-500" />
          </button>
        </div>

        {/* Search */}
        <div className="px-3.5 pt-3 pb-1">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isBn ? "অ্যাডমিন মেনু খুঁজুন..." : "Filter admin tools..."}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-neutral-100 dark:bg-neutral-800 border-none text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
            />
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-4 scrollbar-thin">
          {adminMenuGroups.map((group) => {
            const GroupIcon = group.icon;
            const filteredItems = search.trim()
              ? group.items.filter(
                  (i) =>
                    i.label.toLowerCase().includes(search.toLowerCase()) ||
                    i.bengaliLabel.toLowerCase().includes(search.toLowerCase())
                )
              : group.items;

            if (filteredItems.length === 0) return null;

            return (
              <div key={group.id} className="space-y-1">
                <div className="px-2 py-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                  <GroupIcon size={12} />
                  <span>{isBn ? group.nameBn : group.name}</span>
                </div>

                <div className="space-y-0.5">
                  {filteredItems.map((item) => {
                    const active = isItemActive(item.path);
                    const ItemIcon = item.icon;

                    return (
                      <button
                        key={item.path}
                        type="button"
                        onClick={() => handleNavClick(item.path)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                          active
                            ? "bg-[var(--color-primary)] text-white font-bold shadow-xs"
                            : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <ItemIcon
                            size={14}
                            className={`shrink-0 ${
                              active ? "text-white" : "text-neutral-400"
                            }`}
                          />
                          <span className="truncate">
                            {isBn ? item.bengaliLabel : item.label}
                          </span>
                        </div>

                        {item.badge && (
                          <span
                            className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded shrink-0 ml-1.5 ${
                              active
                                ? "bg-white/20 text-white"
                                : "bg-red-100 dark:bg-red-950/70 text-red-600 dark:text-red-400"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-950/80">
          <div className="flex items-center justify-between px-2 py-1">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {profile?.displayName ? profile.displayName.charAt(0).toUpperCase() : "A"}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                  {profile?.displayName || "Admin"}
                </p>
                <p className="text-[10px] text-red-500 font-semibold truncate">
                  Super Administrator
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => signOut()}
              className="text-[11px] font-semibold text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
            >
              {isBn ? "লগআউট" : "Exit"}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
