import React, { useState } from "react";
import { useAuth, UserRole } from "../../context/AuthContext";
import { bengaliService } from "../../services/bengaliService";
import { navigate } from "../../services/routerService";
import { auth } from "../../lib/firebase";
import {
  ShieldCheck,
  UserCheck,
  Mail,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  AlertCircle,
  LogIn,
  UserPlus,
  BookOpen,
} from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "register";
  defaultRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = "login",
  defaultRole = "student",
}) => {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const [isLogin, setIsLogin] = useState(defaultTab === "login");
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const isBn = bengaliService.getLanguage() === "bn";

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmail(email, password);
      } else {
        if (!displayName.trim()) {
          setErrorMsg(isBn ? "অনুগ্রহ করে আপনার নাম লিখুন" : "Please enter your name");
          setLoading(false);
          return;
        }
        await signUpWithEmail(email, password, displayName.trim(), selectedRole);
      }
      onClose();
      if (selectedRole === "admin" || !isLogin) {
        navigate(selectedRole === "admin" ? "/admin/resources" : "/dashboard");
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setErrorMsg(isBn ? "ভুল ইমেইল বা পাসওয়ার্ড।" : "Invalid email or password.");
      } else if (err.code === "auth/email-already-in-use") {
        setErrorMsg(isBn ? "এই ইমেইল দিয়ে ইতোমধ্যে অ্যাকাউন্ট রয়েছে।" : "Email already registered. Please log in.");
      } else if (err.code === "auth/weak-password") {
        setErrorMsg(isBn ? "পাসওয়ার্ড অত্যন্ত দুর্বল (কমপক্ষে ৬ অক্ষর)।" : "Password is too weak (min 6 characters).");
      } else {
        setErrorMsg(err.message || "Authentication failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg("");
    setLoading(true);
    try {
      await signInWithGoogle();
      if (auth.currentUser) {
        onClose();
        navigate("/dashboard");
      }
    } catch (err: any) {
      if (
        err?.code === "auth/popup-closed-by-user" ||
        err?.code === "auth/cancelled-popup-request"
      ) {
        // Closed voluntarily by user; do nothing
        return;
      }
      if (err?.code === "auth/popup-blocked") {
        setErrorMsg(
          isBn
            ? "ব্রাউজারে পপ-আপ ব্লক করা হয়েছে। অনুগ্রহ করে পপ-আপ অনুমতি দিন অথবা ইমেইল দিয়ে লগইন করুন।"
            : "Pop-up blocked by browser. Please allow pop-ups or use email sign-in."
        );
      } else {
        setErrorMsg(err?.message || (isBn ? "গুগল সাইন-ইন সম্পন্ন হয়নি।" : "Google sign-in could not be completed."));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden text-neutral-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center font-bold font-hanzi text-lg">
                汉
              </div>
              <div>
                <h3 className="text-lg font-extrabold leading-tight">
                  {selectedRole === "admin" ? (isBn ? "অ্যাডমিন প্রবেশদ্বার" : "Admin Portal") : "HanLearn Portal"}
                </h3>
                <p className="text-xs text-neutral-300">
                  {selectedRole === "admin"
                    ? (isBn ? "রিসোর্স ইনপুট ও ম্যানেজমেন্ট প্যানেল" : "Resource Input & Content Management")
                    : (isBn ? "চাইনিজ শেখার পার্সোনালাইজড ড্যাশবোর্ড" : "Your Chinese HSK 3.0 Learning Account")}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Role switcher tabs */}
          <div className="mt-5 grid grid-cols-2 p-1 bg-neutral-950/60 rounded-2xl border border-neutral-700/60 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setSelectedRole("student");
                setErrorMsg("");
              }}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all cursor-pointer ${
                selectedRole === "student"
                  ? "bg-white text-neutral-900 shadow-xs font-bold"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <UserCheck size={14} />
              <span>{isBn ? "শিক্ষার্থী (Student)" : "Student"}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedRole("admin");
                setErrorMsg("");
              }}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all cursor-pointer ${
                selectedRole === "admin"
                  ? "bg-red-600 text-white shadow-xs font-bold"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <ShieldCheck size={14} />
              <span>{isBn ? "অ্যাডমিন (Admin)" : "Admin"}</span>
            </button>
          </div>
        </div>

        {/* Body Form */}
        <div className="p-6 space-y-5">
          {/* Toggle between Log In and Register */}
          <div className="flex border-b border-neutral-200 text-sm font-semibold">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setErrorMsg("");
              }}
              className={`flex-1 pb-2.5 text-center transition-colors cursor-pointer border-b-2 ${
                isLogin
                  ? "border-red-600 text-red-600 font-bold"
                  : "border-transparent text-neutral-500 hover:text-neutral-800"
              }`}
            >
              {isBn ? "লগইন (Sign In)" : "Sign In"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setErrorMsg("");
              }}
              className={`flex-1 pb-2.5 text-center transition-colors cursor-pointer border-b-2 ${
                !isLogin
                  ? "border-red-600 text-red-600 font-bold"
                  : "border-transparent text-neutral-500 hover:text-neutral-800"
              }`}
            >
              {isBn ? "নতুন অ্যাকাউন্ট (Sign Up)" : "Create Account"}
            </button>
          </div>

          {/* Error display */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  {isBn ? "আপনার পুরো নাম" : "Full Name"}
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder={selectedRole === "admin" ? "Admin Name" : "e.g. Shakib Ahmed"}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                {isBn ? "ইমেইল অ্যাড্রেস" : "Email Address"}
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                {isBn ? "পাসওয়ার্ড" : "Password"}
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                selectedRole === "admin"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-neutral-900 hover:bg-black"
              } disabled:opacity-50`}
            >
              {loading ? (
                <span>{isBn ? "প্রসেস হচ্ছে..." : "Processing..."}</span>
              ) : (
                <>
                  {isLogin ? <LogIn size={15} /> : <UserPlus size={15} />}
                  <span>
                    {isLogin
                      ? isBn ? `${selectedRole === "admin" ? "অ্যাডমিন হিসেবে " : ""}লগইন করুন` : `Sign In as ${selectedRole === "admin" ? "Admin" : "Student"}`
                      : isBn ? `${selectedRole === "admin" ? "অ্যাডমিন " : ""}রেজিস্ট্রেশন সম্পন্ন করুন` : `Sign Up as ${selectedRole === "admin" ? "Admin" : "Student"}`}
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Google Sign-in Alternative */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-neutral-200"></div>
            <span className="flex-shrink mx-3 text-[11px] text-neutral-400 uppercase tracking-wider font-semibold">
              {isBn ? "অথবা" : "or continue with"}
            </span>
            <div className="flex-grow border-t border-neutral-200"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-2.5 rounded-xl border border-neutral-300 bg-neutral-50 hover:bg-neutral-100 text-neutral-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google Sign In</span>
          </button>
        </div>
      </div>
    </div>
  );
};
