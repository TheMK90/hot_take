"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { lobbyMovies } from "@/lib/data";
import { RateDots } from "@/components/RateDots";
import { Poster } from "@/components/Poster";

const MAX_TILT = 34;

export function LobbyRail({ posters }: { posters: Record<string, string | null> }) {
  const railRef = useRef<HTMLDivElement | null>(null);
  const stepRef = useRef<(dir: number) => void>(() => {});

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    let raf: number | null = null;
    let inertia: number | null = null;

    const paint = () => {
      const cards = rail.querySelectorAll<HTMLElement>("[data-card]");
      const mid = rail.scrollLeft + rail.clientWidth / 2;
      cards.forEach((c) => {
        const cc = c.offsetLeft + c.offsetWidth / 2;
        const d = (cc - mid) / (c.offsetWidth + 34);
        const k = Math.max(-2.4, Math.min(2.4, d));
        const a = Math.abs(k);
        const scale = 1.08 - Math.min(0.3, a * 0.16);
        const rot = -k * MAX_TILT * (1 / (1 + a * 0.5));
        const z = -Math.min(260, a * 130);
        const y = Math.min(26, a * 14);
        c.style.transform = `translateY(${y}px) translateZ(${z}px) rotateY(${rot.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
        c.style.opacity = String(Math.max(0.42, 1 - a * 0.28));
        c.style.zIndex = String(100 - Math.round(a * 10));
      });
    };

    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        paint();
      });
    };

    const snap = () => {
      const cards = rail.querySelectorAll<HTMLElement>("[data-card]");
      const mid = rail.scrollLeft + rail.clientWidth / 2;
      let best: number | null = null;
      let bd = Infinity;
      cards.forEach((c) => {
        const cc = c.offsetLeft + c.offsetWidth / 2;
        if (Math.abs(cc - mid) < bd) {
          bd = Math.abs(cc - mid);
          best = cc;
        }
      });
      if (best != null) rail.scrollTo({ left: best - rail.clientWidth / 2, behavior: "smooth" });
    };

    const centerOn = (card: HTMLElement) => {
      const cc = card.offsetLeft + card.offsetWidth / 2;
      rail.scrollTo({ left: cc - rail.clientWidth / 2, behavior: "smooth" });
    };

    const centerIndex = (i: number) => {
      const cards = rail.querySelectorAll<HTMLElement>("[data-card]");
      if (cards[i]) centerOn(cards[i]);
    };

    stepRef.current = (dir: number) => {
      const cards = rail.querySelectorAll<HTMLElement>("[data-card]");
      const mid = rail.scrollLeft + rail.clientWidth / 2;
      let idx = 0;
      let bd = Infinity;
      cards.forEach((c, i) => {
        const cc = c.offsetLeft + c.offsetWidth / 2;
        if (Math.abs(cc - mid) < bd) {
          bd = Math.abs(cc - mid);
          idx = i;
        }
      });
      centerIndex(Math.max(0, Math.min(cards.length - 1, idx + dir)));
    };

    const onWheel = (e: WheelEvent) => {
      const dx = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
        const atStart = rail.scrollLeft <= 0 && dx < 0;
        const atEnd = rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 1 && dx > 0;
        if (atStart || atEnd) return;
        e.preventDefault();
      }
      rail.scrollLeft += dx;
    };

    let down = false;
    let startX = 0;
    let startScroll = 0;
    let lastX = 0;
    let lastT = 0;
    let vel = 0;
    let moved = false;

    const stopInertia = () => {
      if (inertia) {
        cancelAnimationFrame(inertia);
        inertia = null;
      }
    };

    const glide = () => {
      vel *= 0.94;
      rail.scrollLeft -= vel;
      if (Math.abs(vel) > 0.4 && rail.scrollLeft > 0 && rail.scrollLeft < rail.scrollWidth - rail.clientWidth) {
        inertia = requestAnimationFrame(glide);
      } else {
        inertia = null;
        rail.style.scrollSnapType = "x proximity";
        snap();
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest?.("[data-poster-frame]")) return;
      stopInertia();
      down = true;
      moved = false;
      startX = lastX = e.clientX;
      startScroll = rail.scrollLeft;
      lastT = performance.now();
      vel = 0;
      rail.style.scrollSnapType = "none";
      rail.style.cursor = "grabbing";
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!down) return;
      const now = performance.now();
      const dt = Math.max(1, now - lastT);
      vel = ((e.clientX - lastX) / dt) * 16;
      lastX = e.clientX;
      lastT = now;
      if (Math.abs(e.clientX - startX) > 3) moved = true;
      rail.scrollLeft = startScroll - (e.clientX - startX);
    };

    const onRelease = () => {
      if (!down) return;
      down = false;
      rail.style.cursor = "grab";
      if (moved && Math.abs(vel) > 1) glide();
      else {
        rail.style.scrollSnapType = "x proximity";
        snap();
      }
    };

    const onClickCapture = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      const card = (e.target as HTMLElement).closest?.<HTMLElement>("[data-card]");
      if (card) centerOn(card);
    };

    rail.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    rail.addEventListener("wheel", onWheel, { passive: false });
    rail.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onRelease);
    window.addEventListener("pointercancel", onRelease);
    rail.addEventListener("click", onClickCapture, true);

    const initId = requestAnimationFrame(() => {
      paint();
      centerIndex(0);
      requestAnimationFrame(paint);
    });

    return () => {
      rail.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      rail.removeEventListener("wheel", onWheel);
      rail.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onRelease);
      window.removeEventListener("pointercancel", onRelease);
      rail.removeEventListener("click", onClickCapture, true);
      if (raf) cancelAnimationFrame(raf);
      if (inertia) cancelAnimationFrame(inertia);
      cancelAnimationFrame(initId);
    };
  }, []);

  return (
    <section style={{ position: "relative", zIndex: 2, padding: "26px 0 10px" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 28px 18px", display: "flex", alignItems: "flex-end", gap: 16 }}>
        <h2 style={{ margin: 0, fontFamily: "var(--font-barlow-condensed), sans-serif", textTransform: "uppercase", letterSpacing: ".2em", fontSize: 14, fontWeight: 700, color: "var(--ink)" }}>
          In the lobby
        </h2>
        <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            onClick={() => stepRef.current(-1)}
            aria-label="Previous"
            className="hover-fill-brand"
            style={{ width: 38, height: 38, display: "grid", placeItems: "center", border: "1px solid var(--line)", borderRadius: "50%", background: "var(--card)", color: "var(--ink)", cursor: "pointer" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => stepRef.current(1)}
            aria-label="Next"
            className="hover-fill-brand"
            style={{ width: 38, height: 38, display: "grid", placeItems: "center", border: "1px solid var(--line)", borderRadius: "50%", background: "var(--card)", color: "var(--ink)", cursor: "pointer" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div
        data-rail="1"
        ref={railRef}
        style={{
          display: "flex",
          gap: 34,
          alignItems: "flex-start",
          overflowX: "auto",
          overscrollBehaviorX: "contain",
          padding: "34px calc(50vw - 165px) 66px",
          scrollSnapType: "x proximity",
          perspective: 1600,
          cursor: "grab",
          userSelect: "none",
        }}
      >
        {lobbyMovies.map((m, i) => (
          <article key={m.slug} data-card="1" style={{ flex: "none", width: 330, scrollSnapAlign: "center", transformStyle: "preserve-3d", willChange: "transform" }}>
            <Link href={`/movies/${m.slug}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", color: "inherit" }}>
              <div style={{ width: 1, height: 34, background: "var(--line)" }} />
              <div style={{ width: 11, height: 11, borderRadius: "50%", background: "var(--frameB)", marginBottom: -6 }} />
              <div
                data-poster-frame="1"
                style={{ width: "100%", padding: 14, borderRadius: 6, background: "linear-gradient(160deg,var(--frameA),var(--frameB))", boxShadow: "var(--shadow)" }}
              >
                <div style={{ padding: 10, background: "var(--matte)", borderRadius: 3 }}>
                  <div style={{ position: "relative", width: "100%", aspectRatio: "2 / 3" }}>
                    <Poster src={posters[m.slug] ?? null} label={m.title} sizes="330px" priority={i < 3} />
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 18, textAlign: "center", width: "100%" }}>
                <h3 style={{ margin: 0, fontFamily: "var(--font-bodoni), serif", fontSize: 22, fontWeight: 700 }}>{m.title}</h3>
                <p style={{ margin: "6px 0 10px", fontFamily: "var(--font-barlow-condensed), sans-serif", textTransform: "uppercase", letterSpacing: ".16em", fontSize: 11, color: "var(--dim)" }}>
                  {m.genre} · {m.year} · {m.runtimeMin} min
                </p>
                <RateDots score={m.score} />
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
