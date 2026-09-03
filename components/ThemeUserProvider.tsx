"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { BASE_REVIEW_COUNT } from "@/lib/data";

export type Theme = "light" | "dark";

export type User = {
  name: string;
  email: string;
  handle: string;
  initials: string;
  isGuest?: boolean;
};

export type MyReview = {
  id: string;
  film: string;
  body: string;
  score: number;
  initials: string;
  byline: string;
  ratedAt: number;
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
  continueAsGuest: () => void;
  composerOpen: boolean;
  openComposer: (presetFilm?: string) => void;
  closeComposer: () => void;
  draftScore: number;
  setDraftScore: (n: number) => void;
  draftFilm: string;
  setDraftFilm: (film: string) => void;
  submitReview: (film: string, body: string) => void;
  myReviews: MyReview[];
  reviewCountLabel: string;
  // Catalogue filtering, shared by the header search box, the genre tiles and
  // both rails.
  query: string;
  setQuery: (q: string) => void;
  genre: string | null;
  setGenre: (g: string | null) => void;
  toggleGenre: (g: string) => void;
  clearFilters: () => void;
  filtering: boolean;
  // Thumbs up/down on individual reviews. One vote per review per browser.
  reviewVotes: Record<string, Vote>;
  voteReview: (reviewId: string, vote: Vote) => void;
};

export type Vote = "up" | "down" | null;

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
  const [draftFilm, setDraftFilm] = useState("");
  const [myReviews, setMyReviews] = useState<MyReview[]>([]);
  const [pendingCompose, setPendingCompose] = useState(false);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState<string | null>(null);
  const [pendingComposeFilm, setPendingComposeFilm] = useState("");
  const [reviewVotes, setReviewVotes] = useState<Record<string, Vote>>({});

  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem("hottake-theme") as Theme | null;
      if (storedTheme === "light" || storedTheme === "dark") setTheme(storedTheme);
      const storedUser = JSON.parse(localStorage.getItem("hottake-user") || "null");
      if (storedUser) setUser(storedUser);
      const storedReviews = JSON.parse(localStorage.getItem("hottake-reviews") || "[]");
      if (Array.isArray(storedReviews)) setMyReviews(storedReviews);
      const storedVotes = JSON.parse(localStorage.getItem("hottake-votes") || "{}");
      if (storedVotes && typeof storedVotes === "object") setReviewVotes(storedVotes);
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

  // Rating history has to survive a reload, or "your ratings" is a lie the
  // moment anyone refreshes.
  useEffect(() => {
    try {
      localStorage.setItem("hottake-reviews", JSON.stringify(myReviews));
    } catch {
      // ignore unavailable storage
    }
  }, [myReviews]);

  useEffect(() => {
    try {
      localStorage.setItem("hottake-votes", JSON.stringify(reviewVotes));
    } catch {
      // ignore unavailable storage
    }
  }, [reviewVotes]);

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
      if (pendingCompose) setDraftFilm(pendingComposeFilm);
      setComposerOpen(pendingCompose);
      setPendingCompose(false);
      setPendingComposeFilm("");
    },
    [persistUser, pendingCompose, pendingComposeFilm]
  );

  // Guests can post without an account. The handle carries a random suffix so two
  // guests in a thread are still tellable apart, and isGuest lets the UI say what
  // a guest does not get: nothing is tied to them once storage is cleared.
  const continueAsGuest = useCallback(() => {
    const suffix = Math.random().toString(36).slice(2, 6);
    const u: User = {
      name: "Guest",
      email: "",
      handle: `@guest-${suffix}`,
      initials: "G",
      isGuest: true,
    };
    persistUser(u);
    setAuthOpen(false);
    if (pendingCompose) setDraftFilm(pendingComposeFilm);
    setComposerOpen(pendingCompose);
    setPendingCompose(false);
    setPendingComposeFilm("");
  }, [persistUser, pendingCompose, pendingComposeFilm]);

  const openComposer = useCallback(
    (presetFilm?: string) => {
      if (user) {
        setDraftFilm(presetFilm ?? "");
        setComposerOpen(true);
      } else {
        setPendingCompose(true);
        setPendingComposeFilm(presetFilm ?? "");
        setAuthMode("signup");
        setAuthOpen(true);
      }
    },
    [user]
  );
  const closeComposer = useCallback(() => setComposerOpen(false), []);

  const submitReview = useCallback(
    (film: string, body: string) => {
      const rev: MyReview = {
        id: `my-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        film,
        body,
        score: draftScore,
        initials: user?.initials || "HT",
        byline: (user?.handle || "@you") + " · just now",
        ratedAt: Date.now(),
      };
      setMyReviews((rs) => [rev, ...rs]);
      setComposerOpen(false);
      setDraftScore(4);
      setDraftFilm("");
    },
    [draftScore, user]
  );

  // Clicking the same thumb again clears the vote, which is what people expect
  // from a toggle and gives them a way to undo a misclick.
  const voteReview = useCallback((reviewId: string, vote: Vote) => {
    setReviewVotes((cur) => {
      const next = { ...cur };
      if (cur[reviewId] === vote || vote === null) delete next[reviewId];
      else next[reviewId] = vote;
      return next;
    });
  }, []);

  const toggleGenre = useCallback(
    (g: string) => setGenre((cur) => (cur === g ? null : g)),
    []
  );

  const clearFilters = useCallback(() => {
    setQuery("");
    setGenre(null);
  }, []);

  const filtering = query.trim().length > 0 || genre !== null;

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
    continueAsGuest,
    composerOpen,
    openComposer,
    closeComposer,
    draftScore,
    setDraftScore,
    draftFilm,
    setDraftFilm,
    submitReview,
    myReviews,
    reviewCountLabel,
    query,
    setQuery,
    genre,
    setGenre,
    toggleGenre,
    clearFilters,
    filtering,
    reviewVotes,
    voteReview,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within ThemeUserProvider");
  return ctx;
}
