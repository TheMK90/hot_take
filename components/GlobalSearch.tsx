"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/ThemeUserProvider";

// The header search box.
//
// It does two jobs at once. Typing filters the rails on the homepage through the
// shared `query` state, instantly and without a network call. In parallel it asks
// /api/search for anything TMDb knows about, so people can find and review a film
// that is not in our catalogue at all.
//
// Catalogue results and external ones are kept visually separate on purpose: a
// catalogue title has a page to visit, an external one only has a review to write.

type CatalogueHit = { kind: "movie" | "tv"; slug: string; title: string; year: number };
type ExternalHit = {
  kind: "movie" | "tv";
  tmdbId: number;
  title: string;
  year: number | null;
  posterUrl: string | null;
};
type SearchResponse = { catalogue: CatalogueHit[]; external: ExternalHit[]; tmdbEnabled: boolean };

const EMPTY: SearchResponse = { catalogue: [], external: [], tmdbEnabled: false };

export function GlobalSearch() {
  const { query, setQuery, openComposer } = useApp();
  const [results, setResults] = useState<SearchResponse>(EMPTY);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);

  // Debounced, and every in-flight request is abortable so a fast typist does
  // not race an older response into the list.
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults(EMPTY);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: controller.signal })
        .then((r) => (r.ok ? r.json() : EMPTY))
        .then((data: SearchResponse) => {
          setResults(data);
          setLoading(false);
        })
        .catch(() => {
          // An aborted request is the normal case here, not a failure worth showing.
          if (!controller.signal.aborted) setLoading(false);
        });
    }, 280);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  // Close on outside click and on Escape, the two things people expect.
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const hasResults = results.catalogue.length > 0 || results.external.length > 0;
  const showPanel = open && query.trim().length >= 2;

  return (
    <div ref={boxRef} style={{ position: "relative", flex: "0 1 auto", minWidth: 0 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "9px 13px",
          border: "1px solid var(--line)",
          borderRadius: 999,
          background: "var(--card)",
          minWidth: 0,
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: "var(--dim)", flex: "none" }}>
          <circle cx="11" cy="11" r="7" />
          <path d="M16.5 16.5 21 21" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search any film or show"
          aria-label="Search any film or show"
          aria-expanded={showPanel}
          role="combobox"
          aria-controls="global-search-results"
          style={{
            border: 0,
            outline: 0,
            background: "transparent",
            color: "var(--ink)",
            fontFamily: "var(--font-barlow), sans-serif",
            fontSize: 13,
            width: 170,
            minWidth: 0,
            flex: "0 1 170px",
          }}
        />
      </div>

      {showPanel && (
        <div
          id="global-search-results"
          role="listbox"
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: 340,
            maxHeight: 460,
            overflowY: "auto",
            zIndex: 80,
            background: "var(--card)",
            border: "1px solid var(--line)",
            borderRadius: 10,
            boxShadow: "var(--shadow)",
            padding: 8,
          }}
        >
          {results.catalogue.length > 0 && (
            <>
              <SectionLabel>In Hot Take</SectionLabel>
              {results.catalogue.map((hit) => (
                <Link
                  key={`${hit.kind}-${hit.slug}`}
                  href={`${hit.kind === "movie" ? "/movies" : "/shows"}/${hit.slug}`}
                  onClick={() => setOpen(false)}
                  className="hover-brand"
                  style={rowStyle}
                >
                  <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {hit.title}
                  </span>
                  <span style={metaStyle}>
                    {hit.kind === "tv" ? "Series" : "Film"} · {hit.year}
                  </span>
                </Link>
              ))}
            </>
          )}

          {results.external.length > 0 && (
            <>
              <SectionLabel>Everything else</SectionLabel>
              {results.external.map((hit) => (
                <div key={`${hit.kind}-${hit.tmdbId}`} style={{ ...rowStyle, cursor: "default" }}>
                  <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {hit.title}
                    <span style={{ ...metaStyle, marginLeft: 8 }}>
                      {hit.kind === "tv" ? "Series" : "Film"}
                      {hit.year ? ` · ${hit.year}` : ""}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      openComposer(hit.title);
                    }}
                    className="hover-brighter"
                    style={{
                      flex: "none",
                      padding: "5px 11px",
                      borderRadius: 999,
                      border: "1px solid var(--brand)",
                      background: "var(--brand)",
                      color: "var(--onbrand)",
                      cursor: "pointer",
                      font: "inherit",
                      fontSize: 11,
                    }}
                  >
                    Review
                  </button>
                </div>
              ))}
            </>
          )}

          {!hasResults && (
            <p style={{ margin: 0, padding: "14px 10px", fontSize: 13, color: "var(--dim)" }}>
              {loading
                ? "Searching…"
                : results.tmdbEnabled
                  ? `Nothing found for "${query.trim()}".`
                  : `No catalogue match. Global search is off — add TMDB_API_KEY to .env.local.`}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        margin: "6px 10px 4px",
        fontFamily: "var(--font-barlow-condensed), sans-serif",
        textTransform: "uppercase",
        letterSpacing: ".18em",
        fontSize: 10,
        fontWeight: 700,
        color: "var(--dim)",
      }}
    >
      {children}
    </p>
  );
}

const rowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "9px 10px",
  borderRadius: 6,
  color: "var(--ink)",
  fontSize: 14,
  textDecoration: "none",
};

const metaStyle: React.CSSProperties = {
  flex: "none",
  fontFamily: "var(--font-barlow-condensed), sans-serif",
  textTransform: "uppercase",
  letterSpacing: ".14em",
  fontSize: 10,
  color: "var(--dim)",
};
