import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AuthModal } from "@/components/AuthModal";
import { ComposerModal } from "@/components/ComposerModal";
import { ChatWidget } from "@/components/ChatWidget";

// Without this file Next serves its own bare error page, which renders outside
// the root layout — no header, no footer, no chat widget, and none of the
// theming. A missing film should still look like the site.
//
// The chat widget is repeated here rather than inherited: notFound() raised from
// a route segment renders inside Next's error tree, which replaces the root html
// and drops the layout's own children. Everything this page needs has to be in
// this file.
export const metadata = {
  title: "Not found — Hot Take",
};

export default function NotFound() {
  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "var(--bg)", color: "var(--ink)", overflowX: "hidden" }}>
      <Header />

      <section
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 720,
          margin: "0 auto",
          padding: "120px 28px 140px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            margin: "0 0 14px",
            fontFamily: "var(--font-barlow-condensed), sans-serif",
            textTransform: "uppercase",
            letterSpacing: ".26em",
            fontSize: 12,
            fontWeight: 600,
            color: "var(--brand)",
          }}
        >
          404 · No such screening
        </p>
        <h1
          style={{
            margin: "0 0 16px",
            fontFamily: "var(--font-bodoni), serif",
            fontWeight: 900,
            fontSize: "clamp(34px,5vw,58px)",
            lineHeight: 1.05,
          }}
        >
          We couldn&apos;t find that one
        </h1>
        <p style={{ margin: "0 0 30px", fontSize: 16, lineHeight: 1.6, color: "var(--dim)" }}>
          It may not be in the catalogue yet. Search for it up in the header — if TMDb knows
          it, we&apos;ll add it and give it a page.
        </p>
        <Link
          href="/"
          className="hover-brighter"
          style={{
            display: "inline-block",
            padding: "13px 26px",
            borderRadius: 999,
            border: "1px solid var(--brand)",
            background: "var(--brand)",
            color: "var(--onbrand)",
            fontFamily: "var(--font-barlow-condensed), sans-serif",
            textTransform: "uppercase",
            letterSpacing: ".18em",
            fontSize: 13,
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Back to the lobby
        </Link>
      </section>

      <Footer />
      <AuthModal />
      <ComposerModal />
      <ChatWidget />
    </div>
  );
}
