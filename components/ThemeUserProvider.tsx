"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { BASE_REVIEW_COUNT } from "@/lib/data";

export type Theme = "light" | "dark";

export type User = {
  name: string;
  email: string;
  handle: string;
  initials: string;
};

export type MyReview = {
  film: string;
  body: string;
  score: number;
  initials: string;
  byline: string;
};

type AuthMode = "login" | "signup";

type AppState = {
  theme: Theme;
  toggleTheme: () => void;
  user: User | null;
  logout: () => void;
  authOpen: boolean;
  authMode: AuthMode;
  openLogin: () => void;
  openSignup: () => void;
  showLogin: () => void;
  showSignup: () => void;
  closeAuth: () => void;
  submitAuth: (name: string, email: string) => void;
  composerOpen: boolean;
  openComposer: () => void;
  closeComposer: () => void;
  draftScore: number;
  setDraftScore: (n: number) => void;
  submitReview: (film: string, body: string) => void;
  myReviews: MyReview[];
  reviewCountLabel: string;
};

const AppContext = createContext<AppState | null>(null);

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  const out = parts.map((p) => p.charAt(0).toUpperCase()).join("");
  return out || "HT";
}

function handleFrom(name: string, email: string): string {
  const base = name.trim() ? name.trim().split(/\s+/)[0] : String(email || "you").split("@")[0];
  return "@" + base.toLowerCase().replace(/[^a-z0-9_]/g, "");
}

export function ThemeUserProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [user, setUser] = useState<User | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [composerOpen, setComposerOpen] = useState(false);
  const [draftScore, setDraftScore] = useState(4);
  const [myReviews, setMyReviews] = useState<MyReview[]>([]);
  const [pendingCompose, setPendingCompose] = useState(false);

  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem("hottake-theme") as Theme | null;
      if (storedTheme === "light" || storedTheme === "dark") setTheme(storedTheme);
      const storedUser = JSON.parse(localStorage.getItem("hottake-user") || "null");
      if (storedUser) setUser(storedUser);
    } catch {
      // ignore unavailable storage
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-hottake-theme", theme);
    document.body.setAttribute("data-hottake-theme", theme);
    try {
      localStorage.setItem("hottake-theme", theme);
    } catch {
      // ignore unavailable storage
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  const persistUser = useCallback((u: User | null) => {
    try {
      if (u) localStorage.setItem("hottake-user", JSON.stringify(u));
      else localStorage.removeItem("hottake-user");
    } catch {
      // ignore unavailable storage
    }
    setUser(u);
  }, []);

  const logout = useCallback(() => persistUser(null), [persistUser]);

  const openLogin = useCallback(() => {
    setAuthMode("login");
    setAuthOpen(true);
  }, []);
  const openSignup = useCallback(() => {
    setAuthMode("signup");
    setAuthOpen(true);
  }, []);
  const showLogin = useCallback(() => setAuthMode("login"), []);
  const showSignup = useCallback(() => setAuthMode("signup"), []);
  const closeAuth = useCallback(() => {
    setPendingCompose(false);
    setAuthOpen(false);
  }, []);

  const submitAuth = useCallback(
    (name: string, email: string) => {
      const u: User = {
        name: name || email.split("@")[0],
        email,
        handle: handleFrom(name, email),
        initials: initials(name || email.split("@")[0]),
      };
      persistUser(u);
      setAuthOpen(false);
      setComposerOpen(pendingCompose);
      setPendingCompose(false);
    },
    [persistUser, pendingCompose]
  );

  const openComposer = useCallback(() => {
    if (user) setComposerOpen(true);
    else {
      setPendingCompose(true);
      setAuthMode("signup");
      setAuthOpen(true);
    }
  }, [user]);
  const closeComposer = useCallback(() => setComposerOpen(false), []);

  const submitReview = useCallback(
    (film: string, body: string) => {
      const rev: MyReview = {
        film,
        body,
        score: draftScore,
        initials: user?.initials || "HT",
        byline: (user?.handle || "@you") + " · just now",
      };
      setMyReviews((rs) => [rev, ...rs]);
      setComposerOpen(false);
      setDraftScore(4);
    },
    [draftScore, user]
  );

  const reviewCountLabel = useMemo(
    () => (BASE_REVIEW_COUNT + myReviews.length).toLocaleString("en-US"),
    [myReviews.length]
  );

  const value: AppState = {
    theme,
    toggleTheme,
    user,
    logout,
    authOpen,
    authMode,
    openLogin,
    openSignup,
    showLogin,
    showSignup,
    closeAuth,
    submitAuth,
    composerOpen,
    openComposer,
    closeComposer,
    draftScore,
    setDraftScore,
    submitReview,
    myReviews,
    reviewCountLabel,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within ThemeUserProvider");
  return ctx;
}
