"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { useApp } from "@/components/ThemeUserProvider";
import { GlobalSearch } from "@/components/GlobalSearch";

export function Header() {
  const { theme, toggleTheme, user, logout, openComposer } = useApp();
  const dark = theme === "dark";

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        backdropFilter: "blur(14px)",
        background: "var(--hdr)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "14px 28px",
          display: "flex",
          alignItems: "center",
          gap: 20,
          flexWrap: "wrap",
          rowGap: 12,
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, color: "inherit" }}>
          <Logo />
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
            <span
              style={{
                fontFamily: "var(--font-bodoni), serif",
                fontWeight: 900,
                fontSize: 23,
                letterSpacing: ".02em",
                whiteSpace: "nowrap",
              }}
            >
              Hot Take
            </span>
            <span
              style={{
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                textTransform: "uppercase",
                letterSpacing: ".24em",
                fontSize: 10,
                color: "var(--dim)",
                marginTop: 3,
                whiteSpace: "nowrap",
              }}
            >
              Reviews by film fans
            </span>
          </div>
        </Link>

        <nav
          style={{
            display: "flex",
            gap: 22,
            marginLeft: 6,
            whiteSpace: "nowrap",
            flex: "0 0 auto",
            fontFamily: "var(--font-barlow-condensed), sans-serif",
            textTransform: "uppercase",
            letterSpacing: ".14em",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          <a href="/#reviews" className="hover-brand" style={{ color: "var(--ink)" }}>
            Reviews
          </a>
          <a href="/#showing" className="hover-brand" style={{ color: "var(--ink)" }}>
            Now showing
          </a>
          <a href="/#top10" className="hover-brand" style={{ color: "var(--ink)" }}>
            Top 10
          </a>
          <a href="/#genres" className="hover-brand" style={{ color: "var(--ink)" }}>
            Genres
          </a>
        </nav>

        <div style={{ flex: "1 1 20px", minWidth: 0 }} />

        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", justifyContent: "flex-end", rowGap: 10 }}>
          <GlobalSearch />

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Switch theme"
            className="hover-brand-border"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              padding: "8px 14px 8px 10px",
              border: "1px solid var(--line)",
              borderRadius: 999,
              background: "var(--card)",
              color: "var(--ink)",
              cursor: "pointer",
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              textTransform: "uppercase",
              letterSpacing: ".16em",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            <span
              style={{
                display: "grid",
                placeItems: "center",
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "var(--brand)",
                color: "var(--onbrand)",
              }}
            >
              {dark ? "★" : "●"}
            </span>
            {dark ? "Oscars" : "Popcorn"}
          </button>

          {!user && (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Link
                href="/login"
                className="hover-brand hover-brand-border"
                style={{
                  padding: "9px 14px",
                  border: "1px solid var(--line)",
                  borderRadius: 999,
                  background: "transparent",
                  color: "var(--ink)",
                  cursor: "pointer",
                  fontFamily: "var(--font-barlow-condensed), sans-serif",
                  textTransform: "uppercase",
                  letterSpacing: ".16em",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Log in
              </Link>
              <Link
                href="/login?mode=signup"
                className="hover-brighter"
                style={{
                  padding: "9px 16px",
                  border: "1px solid var(--brand)",
                  borderRadius: 999,
                  background: "var(--brand)",
                  color: "var(--onbrand)",
                  cursor: "pointer",
                  fontFamily: "var(--font-barlow-condensed), sans-serif",
                  textTransform: "uppercase",
                  letterSpacing: ".16em",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Sign up
              </Link>
            </div>
          )}

          {user && (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                type="button"
                onClick={() => openComposer()}
                className="hover-brighter"
                style={{
                  padding: "9px 16px",
                  border: "1px solid var(--brand)",
                  borderRadius: 999,
                  background: "var(--brand)",
                  color: "var(--onbrand)",
                  cursor: "pointer",
                  fontFamily: "var(--font-barlow-condensed), sans-serif",
                  textTransform: "uppercase",
                  letterSpacing: ".16em",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Write a review
              </button>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  padding: "6px 14px 6px 6px",
                  border: "1px solid var(--line)",
                  borderRadius: 999,
                  background: "var(--card)",
                }}
              >
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    background: "var(--brand)",
                    color: "var(--onbrand)",
                    fontFamily: "var(--font-barlow-condensed), sans-serif",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {user.initials}
                </span>
                <span style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", letterSpacing: ".1em", fontSize: 13, fontWeight: 600 }}>
                  {user.handle}
                </span>
                <button
                  type="button"
                  onClick={logout}
                  aria-label="Log out"
                  className="hover-brand"
                  style={{
                    border: 0,
                    background: "transparent",
                    color: "var(--dim)",
                    cursor: "pointer",
                    fontFamily: "var(--font-barlow-condensed), sans-serif",
                    textTransform: "uppercase",
                    letterSpacing: ".14em",
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
