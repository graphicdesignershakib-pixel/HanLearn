import React, { useState } from "react";
import { useAuth, UserRole } from "../../context/AuthContext";
import { bengaliService } from "../../services/bengaliService";
import { auth } from "../../lib/firebase";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Mail,
  User,
  LogIn,
  UserPlus,
  AlertCircle,
  Sparkles,
  ArrowRight,
  BookOpen,
} from "lucide-react";

interface AuthProtectedGateProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const AuthProtectedGate: React.FC<AuthProtectedGateProps> = ({
  children,
  requireAdmin = false,
}) => {
  const { user, profile, loading, isAdmin, signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const isBn = bengaliService.getLanguage() === "bn";

  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>(requireAdmin ? "admin" : "student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // 1. If checking auth state, show secure verification loading spinner
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-12 h-12 border-3 border-red-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-neutral-700">
          {isBn ? "নিরাপত্তা ক্রেডেনশিয়াল যাচাই করা হচ্ছে..." : "Verifying security credentials..."}
        </p>
      </div>
    );
  }

  // 2. If user is logged in, but the page requires Admin role and user is not admin:
  if (user && requireAdmin && !isAdmin) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white border border-red-200 rounded-3xl shadow-sm text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
          <ShieldAlert size={28} />
        </div>
        <h2 className="text-xl font-bold text-neutral-900 mb-2">
          {isBn ? "অননুমোদিত অ্যাক্সেস (Access Denied)" : "Unauthorized Access"}
        </h2>
        <p className="text-sm text-neutral-600 mb-6">
          {isBn
            ? "এই পেজটি শুধুমাত্র ভেরিফায়েড অ্যাডমিনিস্ট্রেটরদের জন্য সংরক্ষিত। আপনার বর্তমান অ্যাকাউন্টটি সাধারণ শিক্ষার্থী হিসেবে সক্রিয়।"
            : "This area is restricted to verified administrators. Your current account is registered as a student."}
        </p>
        <div className="p-3 bg-neutral-50 rounded-xl text-xs font-mono text-neutral-500 mb-6">
          {user.email} (Role: {profile?.role || "student"})
        </div>
        <button
          type="button"
          onClick={() => window.location.assign("/dashboard")}
          className="px-6 py-2.5 rounded-xl bg-neutral-900 text-white font-semibold text-xs hover:bg-black transition-colors"
        >
          {isBn ? "শিক্ষার্থী ড্যাশবোর্ডে ফিরে যান" : "Return to Student Dashboard"}
        </button>
      </div>
    );
  }

  // 3. If user is successfully authenticated, render children!
  if (user) {
    return <>{children}</>;
  }

  // 4. User is NOT logged in: STRICT SECURITY LOCK
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setActionLoading(true);

    try {
      if (isLogin) {
        await signInWithEmail(email, password);
      } else {
        if (!displayName.trim()) {
          setErrorMsg(isBn ? "অনুগ্রহ করে আপনার নাম লিখুন" : "Please enter your full name");
          setActionLoading(false);
          return;
        }
        await signUpWithEmail(email, password, displayName.trim(), selectedRole);
      }
    } catch (err: any) {
      console.error("Auth security error:", err);
      if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setErrorMsg(isBn ? "ভুল ইমেইল বা পাসওয়ার্ড প্রদান করা হয়েছে।" : "Invalid email or password.");
      } else if (err.code === "auth/email-already-in-use") {
        setErrorMsg(isBn ? "এই ইমেইল দিয়ে ইতোমধ্যে অ্যাকাউন্ট রয়েছে। অনুগ্রহ করে লগইন করুন।" : "Email already in use. Please log in.");
      } else if (err.code === "auth/weak-password") {
        setErrorMsg(isBn ? "পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।" : "Password must be at least 6 characters.");
      } else {
        setErrorMsg(err.message || (isBn ? "প্রবেশ ব্যর্থ হয়েছে।" : "Authentication failed."));
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg("");
    setActionLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      if (
        err?.code === "auth/popup-closed-by-user" ||
        err?.code === "auth/cancelled-popup-request"
      ) {
        return;
      }
      setErrorMsg(
        err?.message || (isBn ? "গুগল লগইন সম্পন্ন হয়নি। ইমেইল ও পাসওয়ার্ড ব্যবহার করুন।" : "Google sign in failed. Please use email & password.")
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-6 sm:my-10">
      {/* Security Gate Card */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-xl overflow-hidden text-neutral-900">
        {/* Security Banner Header */}
        <div className="bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white p-6 sm:p-8 text-center relative">
          <div className="w-12 h-12 rounded-2xl bg-red-600/90 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
            <Lock size={22} className="text-white" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-300 text-[11px] font-semibold mb-2">
            <ShieldCheck size={13} />
            <span>{isBn ? "নিরাপদ লগইন সুরক্ষিত এলাকা" : "Security Authenticated Area"}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            {requireAdmin
              ? isBn
                ? "অ্যাডমিন প্যানেলে লগইন করুন"
                : "Admin Portal Sign In"
              : isBn
              ? "লগইন বা রেজিস্ট্রেশন আবশ্যক"
              : "Sign In Required to Access"}
          </h2>

          <p className="text-xs text-neutral-300 mt-2 max-w-xs mx-auto leading-relaxed">
            {isBn
              ? "এই কনটেন্ট, শব্দকোষ ও স্টাডি উপাদান সুরক্ষিত। ব্যবহার করতে অনুগ্রহ করে আপনার অ্যাকাউন্টে সাইন ইন করুন।"
              : "All study materials, vocabulary labs & AI features are protected. Please sign in or register to continue."}
          </p>

          {/* Student / Admin Selector */}
          <div className="mt-5 grid grid-cols-2 p-1 bg-neutral-950/80 rounded-2xl border border-neutral-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setSelectedRole("student");
                setErrorMsg("");
              }}
              className={`py-2 rounded-xl transition-all cursor-pointer ${
                selectedRole === "student"
                  ? "bg-white text-neutral-900 shadow font-bold"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {isBn ? "শিক্ষার্থী (Student)" : "Student"}
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedRole("admin");
                setErrorMsg("");
              }}
              className={`py-2 rounded-xl transition-all cursor-pointer ${
                selectedRole === "admin"
                  ? "bg-red-600 text-white shadow font-bold"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {isBn ? "অ্যাডমিন (Admin)" : "Admin"}
            </button>
          </div>
        </div>

        {/* Tab & Form Section */}
        <div className="p-6 sm:p-8 space-y-5">
          {/* Toggle Tab */}
          <div className="flex border-b border-neutral-200 text-sm font-semibold">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setErrorMsg("");
              }}
              className={`flex-1 pb-3 text-center transition-colors cursor-pointer border-b-2 ${
                isLogin
                  ? "border-red-600 text-red-600 font-bold"
                  : "border-transparent text-neutral-400 hover:text-neutral-700"
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
              className={`flex-1 pb-3 text-center transition-colors cursor-pointer border-b-2 ${
                !isLogin
                  ? "border-red-600 text-red-600 font-bold"
                  : "border-transparent text-neutral-400 hover:text-neutral-700"
              }`}
            >
              {isBn ? "নতুন অ্যাকাউন্ট (Sign Up)" : "Create Account"}
            </button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
              <AlertCircle size={16} className="shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                  {isBn ? "আপনার পুরো নাম" : "Full Name"}
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder={selectedRole === "admin" ? "Admin Full Name" : "e.g. Shakib Ahmed"}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                {isBn ? "ইমেইল অ্যাড্রেস" : "Email Address"}
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                {isBn ? "পাসওয়ার্ড" : "Password"}
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={actionLoading}
              className={`w-full py-3 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                selectedRole === "admin"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-neutral-900 hover:bg-black"
              } disabled:opacity-50`}
            >
              {actionLoading ? (
                <span>{isBn ? "ভেরিফাই হচ্ছে..." : "Verifying..."}</span>
              ) : (
                <>
                  {isLogin ? <LogIn size={15} /> : <UserPlus size={15} />}
                  <span>
                    {isLogin
                      ? isBn ? `${selectedRole === "admin" ? "অ্যাডমিন হিসেবে " : ""}লগইন করুন` : `Sign In as ${selectedRole === "admin" ? "Admin" : "Student"}`
                      : isBn ? `${selectedRole === "admin" ? "অ্যাডমিন " : ""}রেজিস্ট্রেশন করুন` : `Register as ${selectedRole === "admin" ? "Admin" : "Student"}`}
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Alternative Google Sign In */}
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
            disabled={actionLoading}
            className="w-full py-2.5 rounded-xl border border-neutral-300 bg-neutral-50 hover:bg-neutral-100 text-neutral-800 text-xs font-bold flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
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
