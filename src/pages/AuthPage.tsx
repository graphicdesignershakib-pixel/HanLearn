import React, { useState } from "react";
import { useAuth, UserRole } from "../context/AuthContext";
import { bengaliService } from "../services/bengaliService";
import { navigate } from "../services/routerService";
import {
  ShieldCheck,
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
  LogIn,
  UserPlus,
  BookOpen,
  Languages,
  Palette,
} from "lucide-react";
import { themeService } from "../services/themeService";
import { ThemeChooserModal } from "../components/common/ThemeChooserModal";

export const AuthPage: React.FC = () => {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<"bn" | "en">(bengaliService.getLanguage());
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(themeService.getTheme());

  React.useEffect(() => {
    const unsub = themeService.subscribe(() => {
      setCurrentTheme(themeService.getTheme());
    });
    return unsub;
  }, []);

  const toggleLanguage = () => {
    const nextLang = lang === "bn" ? "en" : "bn";
    bengaliService.setLanguage(nextLang);
    setLang(nextLang);
  };

  const isBn = lang === "bn";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmail(email, password);
      } else {
        if (!displayName.trim()) {
          setErrorMsg(isBn ? "অনুগ্রহ করে আপনার পুরো নাম লিখুন" : "Please enter your full name");
          setLoading(false);
          return;
        }
        await signUpWithEmail(email, password, displayName.trim(), selectedRole);
      }
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Authentication error:", err);
      if (
        err.code === "auth/wrong-password" ||
        err.code === "auth/invalid-credential" ||
        err.code === "auth/user-not-found"
      ) {
        setErrorMsg(
          isBn
            ? "ভুল ইমেইল বা পাসওয়ার্ড। আবার চেষ্টা করুন।"
            : "Invalid email or password. Please check your credentials."
        );
      } else if (err.code === "auth/email-already-in-use") {
        setErrorMsg(
          isBn
            ? "এই ইমেইল দিয়ে ইতোমধ্যে অ্যাকাউন্ট রয়েছে। সরাসরি লগইন করুন।"
            : "Email already in use. Please sign in directly."
        );
      } else if (err.code === "auth/weak-password") {
        setErrorMsg(
          isBn
            ? "পাসওয়ার্ড অত্যন্ত দুর্বল (কমপক্ষে ৬ অক্ষর প্রয়োজন)।"
            : "Password is too weak. Please use at least 6 characters."
        );
      } else if (err.code === "auth/invalid-email") {
        setErrorMsg(isBn ? "সঠিক ইমেইল ঠিকানা প্রদান করুন।" : "Please provide a valid email address.");
      } else {
        setErrorMsg(err.message || (isBn ? "লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।" : "Authentication failed."));
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
      navigate("/dashboard");
    } catch (err: any) {
      if (
        err?.code === "auth/popup-closed-by-user" ||
        err?.code === "auth/cancelled-popup-request"
      ) {
        // User closed popup deliberately
        return;
      }
      if (err?.code === "auth/popup-blocked") {
        setErrorMsg(
          isBn
            ? "ব্রাউজার পপ-আপ ব্লক করেছে। অনুগ্রহ করে পপ-আপ অনুমোদন করুন।"
            : "Popup was blocked by browser. Please allow popups."
        );
      } else {
        setErrorMsg(
          isBn
            ? "গুগল সাইন-ইন সম্পন্ন হয়নি। ইমেইল ও পাসওয়ার্ড দিয়ে চেষ্টা করুন।"
            : "Google sign-in incomplete. Please try using email and password."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Subtle decorative Hanzi watermarks in dark canvas */}
      <div className="absolute -top-16 -left-16 text-[220px] font-black text-white/[0.02] pointer-events-none select-none">
        汉
      </div>
      <div className="absolute -bottom-24 -right-20 text-[260px] font-black text-red-600/[0.03] pointer-events-none select-none">
        学
      </div>

      {/* Header Bar */}
      <header className="relative z-10 w-full max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] text-white font-black text-xl flex items-center justify-center shadow-lg shadow-sky-950/40">
            汉
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white">HanLearn</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[var(--color-accent)] text-white">
                HSK 3.0
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              {isBn ? "গ্রাফিক আর্টস একাডেমি ও চীনা ভাষা শিক্ষা" : "Govt. Graphic Arts Institute Chinese Academy"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Chooser */}
          <button
            type="button"
            onClick={() => setIsThemeModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-xs font-semibold text-neutral-300 hover:text-white transition-all cursor-pointer"
            title="Choose Theme"
          >
            <Palette size={14} className="text-[var(--color-primary)]" />
            <span className="hidden sm:inline">{isBn ? "থিম" : "Theme"}</span>
            <div className="flex items-center -space-x-1">
              <span
                className="w-2.5 h-2.5 rounded-full border border-neutral-900"
                style={{ backgroundColor: currentTheme.primaryColor }}
              />
              <span
                className="w-2.5 h-2.5 rounded-full border border-neutral-900"
                style={{ backgroundColor: currentTheme.accentColor }}
              />
            </div>
          </button>

          {/* Language Switcher */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-xs font-semibold text-neutral-300 hover:text-white transition-all cursor-pointer"
            title="Change Language"
          >
            <Languages size={14} className="text-[var(--color-primary)]" />
            <span>{lang === "bn" ? "বাংলা (BN)" : "English (EN)"}</span>
          </button>
        </div>
      </header>

      {/* Center Auth Card */}
      <main className="relative z-10 w-full max-w-md mx-auto px-4 py-4 flex-1 flex flex-col justify-center">
        <div className="bg-neutral-900/90 backdrop-blur-md border border-neutral-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80">
          {/* Heading */}
          <div className="text-center space-y-1 mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {isLogin
                ? isBn
                  ? "অ্যাকাউন্টে প্রবেশ করুন"
                  : "Sign in to HanLearn"
                : isBn
                ? "নতুন অ্যাকাউন্ট তৈরি করুন"
                : "Create your Account"}
            </h1>
            <p className="text-xs text-neutral-400">
              {isBn
                ? "আপনার ব্যক্তিগত অগ্রগতি ও স্টাডি মেটেরিয়াল নিরাপদে সুরক্ষিত"
                : "Your individual progress, streak & tests securely synced"}
            </p>
          </div>

          {/* Mode Tabs (Login vs Register) */}
          <div className="grid grid-cols-2 p-1 bg-neutral-950/80 border border-neutral-800 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setErrorMsg("");
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                isLogin
                  ? "bg-[var(--color-primary)] text-white shadow-md"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <LogIn size={14} />
              <span>{isBn ? "লগইন করুন" : "Sign In"}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setErrorMsg("");
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                !isLogin
                  ? "bg-[var(--color-primary)] text-white shadow-md"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <UserPlus size={14} />
              <span>{isBn ? "নতুন রেজিস্ট্রেশন" : "Register"}</span>
            </button>
          </div>

          {/* Google 1-Click Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-2.5 px-4 bg-white hover:bg-neutral-100 text-neutral-900 font-semibold text-xs rounded-xl flex items-center justify-center gap-2.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
            <span>
              {isLogin
                ? isBn
                  ? "গুগল দিয়ে সরাসরি প্রবেশ করুন"
                  : "Continue with Google"
                : isBn
                ? "গুগল দিয়ে দ্রুত অ্যাকাউন্ট খুলুন"
                : "Sign up with Google"}
            </span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-neutral-800" />
            <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-medium">
              {isBn ? "অথবা ইমেইল দিয়ে" : "or with email"}
            </span>
            <div className="flex-1 h-px bg-neutral-800" />
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/70 border border-red-800/80 text-red-200 text-xs flex items-start gap-2 animate-fadeIn">
              <AlertCircle size={15} className="text-red-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  {isBn ? "আপনার পুরো নাম" : "Full Name"}
                </label>
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none"
                  />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder={isBn ? "উদা: সাকিব আল হাসান" : "e.g. John Doe"}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                {isBn ? "ইমেইল ঠিকানা" : "Email Address"}
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                {isBn ? "পাসওয়ার্ড" : "Password"}
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isBn ? "কমপক্ষে ৬ অক্ষর" : "Minimum 6 characters"}
                  minLength={6}
                  className="w-full pl-9 pr-10 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Role Selection (Student vs Admin) */}
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1.5">
                {isBn ? "অ্যাকাউন্টের ধরন / পদবি" : "Account Role"}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRole("student")}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                    selectedRole === "student"
                      ? "bg-red-950/40 border-red-600 text-white"
                      : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700"
                  }`}
                >
                  <BookOpen
                    size={16}
                    className={selectedRole === "student" ? "text-red-400" : "text-neutral-500"}
                  />
                  <div>
                    <p className="text-xs font-bold leading-tight">
                      {isBn ? "শিক্ষার্থী" : "Student"}
                    </p>
                    <p className="text-[10px] text-neutral-500">
                      {isBn ? "HSK কোর্স ও প্র্যাকটিস" : "HSK courses & labs"}
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole("admin")}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                    selectedRole === "admin"
                      ? "bg-red-950/40 border-red-600 text-white"
                      : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700"
                  }`}
                >
                  <ShieldCheck
                    size={16}
                    className={selectedRole === "admin" ? "text-red-400" : "text-neutral-500"}
                  />
                  <div>
                    <p className="text-xs font-bold leading-tight">
                      {isBn ? "অ্যাডমিন" : "Admin"}
                    </p>
                    <p className="text-[10px] text-neutral-500">
                      {isBn ? "ম্যানেজমেন্ট পোর্টাল" : "Resource control"}
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-sky-950/40 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {isLogin
                      ? isBn
                        ? "লগইন করুন"
                        : "Sign In to Account"
                      : isBn
                      ? "রেজিস্ট্রেশন সম্পন্ন করুন"
                      : "Complete Registration"}
                  </span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Toggle Hint */}
          <div className="mt-5 text-center text-xs text-neutral-400">
            {isLogin ? (
              <p>
                {isBn ? "কোনো অ্যাকাউন্ট নেই?" : "Don't have an account yet?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(false);
                    setErrorMsg("");
                  }}
                  className="text-[var(--color-primary)] hover:underline font-bold ml-1 cursor-pointer"
                >
                  {isBn ? "নতুন রেজিস্ট্রেশন করুন" : "Sign Up"}
                </button>
              </p>
            ) : (
              <p>
                {isBn ? "ইতোমধ্যে অ্যাকাউন্ট আছে?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(true);
                    setErrorMsg("");
                  }}
                  className="text-[var(--color-primary)] hover:underline font-bold ml-1 cursor-pointer"
                >
                  {isBn ? "সরাসরি লগইন করুন" : "Sign In"}
                </button>
              </p>
            )}
          </div>
        </div>
      </main>

      {/* Security Features Footer */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto px-6 py-4 border-t border-neutral-900 text-center">
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-neutral-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-[var(--color-primary)]" />
            <span>{isBn ? "এনক্রিপ্টেড সিকিউরিটি" : "Encrypted Security"}</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Sparkles size={13} className="text-amber-500" />
            <span>{isBn ? "প্রত্যেক ইউজারের ব্যক্তিগত প্রগ্রেস" : "Individual User Progress & Cloud Sync"}</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <BookOpen size={13} className="text-neutral-400" />
            <span>HSK 3.0 Standard Standardized Chinese</span>
          </span>
        </div>
      </footer>

      {/* Theme Chooser Modal */}
      <ThemeChooserModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
      />
    </div>
  );
};
