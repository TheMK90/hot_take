"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { useApp } from "@/components/ThemeUserProvider";

export function LoginView() {
  const { user, submitAuth, continueAsGuest } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"login" | "signup">(searchParams.get("mode") === "signup" ? "signup" : "login");

  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);

  const isSignup = mode === "signup";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--ink)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "48px 24px",
      }}
    >
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
        <Logo size={44} />
        <span
          style={{
            fontFamily: "var(--font-bodoni), serif",
            fontWeight: 900,
            fontSize: 22,
            color: "var(--ink)",
          }}
        >
          Hot Take
        </span>
      </Link>

      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "var(--card)",
          border: "1px solid var(--line)",
          borderRadius: 6,
          boxShadow: "var(--shadow)",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "26px 28px 28px" }}>
          <div style={{ display: "flex", gap: 18, marginBottom: 22, borderBottom: "1px solid var(--line)" }}>
            <button
              type="button"
              onClick={() => setMode("login")}
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
              onClick={() => setMode("signup")}
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
          <h1 style={{ margin: "0 0 6px", fontFamily: "var(--font-bodoni), serif", fontSize: 26, fontWeight: 800 }}>
            {isSignup ? "Join Hot Take" : "Welcome back"}
          </h1>
          <p style={{ margin: "0 0 20px", fontSize: 14, lineHeight: 1.5, color: "var(--dim)" }}>
            {isSignup
              ? "Free account. Rate films, post takes, keep a watch history."
              : "Log in to keep your takes, or post as a guest without an account."}
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
          <Link
            href="/"
            className="hover-brand"
            style={{
              display: "block",
              marginTop: 16,
              textAlign: "center",
              color: "var(--dim)",
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              textTransform: "uppercase",
              letterSpacing: ".16em",
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            Not now
          </Link>
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
