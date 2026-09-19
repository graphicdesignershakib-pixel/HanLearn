import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { auth, db, googleProvider } from "../lib/firebase";

export type UserRole = "student" | "admin";

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  createdAt?: string;
  photoURL?: string | null;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string, role?: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Automatically recognize designated admin emails
const ADMIN_EMAILS = ["graphicdesigner.shakib@gmail.com", "admin@hanlearn.com"];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch or create profile
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(userDocRef);

          const isDefaultAdmin = currentUser.email && ADMIN_EMAILS.includes(currentUser.email.toLowerCase());

          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            // If email is in ADMIN_EMAILS list, ensure they have admin role
            if (isDefaultAdmin && data.role !== "admin") {
              await setDoc(userDocRef, { ...data, role: "admin" }, { merge: true });
              setProfile({ ...data, role: "admin" });
            } else {
              setProfile(data);
            }
          } else {
            const newProfile: UserProfile = {
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName || (currentUser.email ? currentUser.email.split("@")[0] : "Student"),
              role: isDefaultAdmin ? "admin" : "student",
              createdAt: new Date().toISOString(),
              photoURL: currentUser.photoURL,
            };
            await setDoc(userDocRef, newProfile);
            setProfile(newProfile);
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
          // Fallback profile if offline/permission glitch
          setProfile({
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName || "User",
            role: currentUser.email && ADMIN_EMAILS.includes(currentUser.email.toLowerCase()) ? "admin" : "student",
          });
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      // Normal user cancellation or popup closed before completion
      if (
        err?.code === "auth/popup-closed-by-user" ||
        err?.code === "auth/cancelled-popup-request"
      ) {
        return;
      }
      console.warn("Google sign in notice:", err?.message || err);
      throw err;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: any) {
      console.error("Email sign in failed:", err);
      throw err;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string, requestedRole: UserRole = "student") => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      if (res.user) {
        await updateProfile(res.user, { displayName: name });
        const isDefaultAdmin = ADMIN_EMAILS.includes(email.toLowerCase()) || requestedRole === "admin";
        const newProfile: UserProfile = {
          uid: res.user.uid,
          email: res.user.email,
          displayName: name,
          role: isDefaultAdmin ? "admin" : "student",
          createdAt: new Date().toISOString(),
        };
        await setDoc(doc(db, "users", res.user.uid), newProfile);
        setProfile(newProfile);
      }
    } catch (err: any) {
      console.error("Email sign up failed:", err);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await fbSignOut(auth);
      setProfile(null);
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const isAdmin = profile?.role === "admin" || (user?.email ? ADMIN_EMAILS.includes(user.email.toLowerCase()) : false);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAdmin,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
