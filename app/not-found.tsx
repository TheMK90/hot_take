"use client";

import { useRouter } from "next/navigation";
import { ChatWidget } from "@/components/ChatWidget";

// notFound() raised from a route segment renders inside Next's error tree,
// which replaces the root layout's children — anything this page needs has
// to be declared here rather than inherited from app/layout.tsx.
export default function NotFound() {
  const router = useRouter();

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "#000",
      }}
    >
      <img
        src="/assets/404-confused.gif"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.55)" }} />

      <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 24px" }}>
        <h1
          style={{
            margin: "0 0 10px",
            fontFamily: "var(--font-bodoni), serif",
            fontWeight: 900,
            fontSize: "clamp(40px, 9vw, 88px)",
            letterSpacing: ".02em",
            color: "#fffaf5",
            textShadow: "0 4px 30px rgba(0,0,0,.7)",
          }}
        >
          ERROR 404
        </h1>
        <p
          style={{
            margin: "0 0 32px",
            fontFamily: "var(--font-barlow-condensed), sans-serif",
            textTransform: "uppercase",
            letterSpacing: ".24em",
            fontSize: 14,
            color: "#f6e9dc",
            textShadow: "0 2px 12px rgba(0,0,0,.7)",
          }}
        >
          This page doesn&apos;t exist
        </p>
        <button
          type="button"
          onClick={() => router.back()}
          className="hover-brighter"
          style={{
            padding: "13px 28px",
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
          Go back
        </button>
      </div>

      <ChatWidget />
    </div>
  );
}
