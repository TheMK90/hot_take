"use client";

import { useApp } from "@/components/ThemeUserProvider";

export function AuthModal() {
  const { authOpen, authMode, showLogin, showSignup, closeAuth, submitAuth, continueAsGuest } = useApp();
  if (!authOpen) return null;

  const isSignup = authMode === "signup";

  return (
    <div
      onClick={closeAuth}
      style={{ position: "fixed", inset: 0, zIndex: 90, background: "rgba(20,4,4,.62)", backdropFilter: "blur(6px)", display: "grid", placeItems: "center", padding: 24 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 420, background: "var(--card)", border: "1px solid var(--line)", borderRadius: 6, boxShadow: "var(--shadow)", overflow: "hidden" }}
      >
        <div style={{ height: 10, background: "repeating-linear-gradient(90deg,#a5121c 0 6px,#f6e9dc 6px 12px)" }} />
        <div style={{ padding: "26px 28px 28px" }}>
          <div style={{ display: "flex", gap: 18, marginBottom: 22, borderBottom: "1px solid var(--line)" }}>
            <button
              type="button"
              onClick={showLogin}
              style={{
                padding: "0 0 12px",
                border: 0,
                background: "transparent",
                cursor: "pointer",
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                textTransform: "uppercase",
                letterSpacing: ".18em",
                fontSize: 13,
                fontWeight: 700,
                color: isSignup ? "var(--dim)" : "var(--brand)",
                borderBottom: `2px solid ${isSignup ? "transparent" : "var(--brand)"}`,
                marginBottom: -1,
              }}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={showSignup}
              style={{
                padding: "0 0 12px",
                border: 0,
                background: "transparent",
                cursor: "pointer",
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                textTransform: "uppercase",
                letterSpacing: ".18em",
                fontSize: 13,
                fontWeight: 700,
                color: isSignup ? "var(--brand)" : "var(--dim)",
                borderBottom: `2px solid ${isSignup ? "var(--brand)" : "transparent"}`,
                marginBottom: -1,
              }}
            >
              Sign up
            </button>
          </div>
          <h2 style={{ margin: "0 0 6px", fontFamily: "var(--font-bodoni), serif", fontSize: 26, fontWeight: 800 }}>
            {isSignup ? "Join Hot Take" : "Welcome back"}
          </h2>
          <p style={{ margin: "0 0 20px", fontSize: 14, lineHeight: 1.5, color: "var(--dim)" }}>
            {isSignup ? "Free account. Rate films, post takes, keep a watch history." : "Log in to keep your takes, or post as a guest without an account."}
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              submitAuth(String(fd.get("name") || ""), String(fd.get("email") || ""));
            }}
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >
            {isSignup && (
              <label style={labelStyle}>
                Display name
                <input name="name" type="text" placeholder="Sam Okafor" style={inputStyle} />
              </label>
            )}
            <label style={labelStyle}>
              Email
              <input name="email" type="email" required placeholder="you@example.com" style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Password
              <input name="password" type="password" required placeholder="••••••••" style={inputStyle} />
            </label>
            <button
              type="submit"
              className="hover-brighter"
              style={{
                marginTop: 6,
                padding: 13,
                border: "1px solid var(--brand)",
                borderRadius: 999,
                background: "var(--brand)",
                color: "var(--onbrand)",
                cursor: "pointer",
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                textTransform: "uppercase",
                letterSpacing: ".18em",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {isSignup ? "Create account" : "Log in"}
            </button>
          </form>
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0 16px" }}>
            <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
            <span
              style={{
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                textTransform: "uppercase",
                letterSpacing: ".18em",
                fontSize: 10,
                fontWeight: 700,
                color: "var(--dim)",
              }}
            >
              or
            </span>
            <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
          </div>

          <button
            type="button"
            onClick={continueAsGuest}
            className="hover-brand-border"
            style={{
              width: "100%",
              padding: 13,
              border: "1px solid var(--line)",
              borderRadius: 999,
              background: "var(--card2)",
              color: "var(--ink)",
              cursor: "pointer",
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              textTransform: "uppercase",
              letterSpacing: ".18em",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            Post as guest
          </button>
          <p style={{ margin: "10px 0 0", fontSize: 12, lineHeight: 1.5, color: "var(--dim)", textAlign: "center" }}>
            No account, no email. Your takes stay on this device and are not tied to you.
          </p>

          <button
            type="button"
            onClick={closeAuth}
            className="hover-brand"
            style={{
              marginTop: 16,
              width: "100%",
              border: 0,
              background: "transparent",
              color: "var(--dim)",
              cursor: "pointer",
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              textTransform: "uppercase",
              letterSpacing: ".16em",
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  fontFamily: "var(--font-barlow-condensed), sans-serif",
  textTransform: "uppercase",
  letterSpacing: ".16em",
  fontSize: 11,
  fontWeight: 700,
  color: "var(--dim)",
};

const inputStyle: React.CSSProperties = {
  padding: "11px 13px",
  border: "1px solid var(--line)",
  borderRadius: 4,
  background: "var(--card2)",
  color: "var(--ink)",
  fontFamily: "var(--font-barlow), sans-serif",
  fontSize: 15,
  outline: 0,
};
