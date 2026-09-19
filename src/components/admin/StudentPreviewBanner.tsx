import React, { useState, useEffect } from "react";
import { Eye, ShieldAlert, ArrowLeft, ShieldCheck } from "lucide-react";
import { adminStateService } from "../../services/adminStateService";
import { bengaliService } from "../../services/bengaliService";
import { navigate } from "../../services/routerService";

export const StudentPreviewBanner: React.FC = () => {
  const [isBn, setIsBn] = useState(bengaliService.getLanguage() === "bn");

  useEffect(() => {
    const unsub = bengaliService.subscribe(() => {
      setIsBn(bengaliService.getLanguage() === "bn");
    });
    return unsub;
  }, []);

  const handleReturnToAdmin = () => {
    adminStateService.setPreviewAsStudent(false);
    navigate("/admin");
  };

  return (
    <div className="w-full bg-amber-500 text-neutral-950 px-4 py-2 text-xs font-bold shadow-md flex items-center justify-between sticky top-0 z-50 animate-fadeIn">
      <div className="flex items-center gap-2 max-w-xl truncate">
        <Eye size={16} className="shrink-0 animate-pulse" />
        <span className="truncate">
          {isBn
            ? "মোড: শিক্ষার্থী ভিউ প্রিভিউ (Student Preview Mode) — শিক্ষার্থীরা অ্যাপটি যেভাবে দেখে আপনি তা দেখছেন"
            : "Mode: Student Preview Mode — Viewing the interface as enrolled students experience it"}
        </span>
      </div>

      <button
        type="button"
        onClick={handleReturnToAdmin}
        className="px-3 py-1 bg-neutral-950 text-white hover:bg-neutral-800 rounded-lg text-xs font-extrabold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-xs"
      >
        <ShieldCheck size={14} className="text-red-500" />
        <span>{isBn ? "অ্যাডমিন কনসোলে ফিরুন" : "Return to Admin"}</span>
      </button>
    </div>
  );
};
