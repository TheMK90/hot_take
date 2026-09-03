import Link from "next/link";
import { Poster } from "@/components/Poster";
import { HeatScale } from "@/components/HeatScale";

// The "you might also like" grid, shared by the film and show profile pages.
// Both only need a slug, a title and a score, so this takes that shape rather
// than a Movie or a Show, and the caller supplies the route to link into.
export type SimilarItem = { slug: string; title: string; score: number };

export function SimilarTitles({
  items,
  posters,
  basePath,
  heading = "You might also like",
}: {
  items: SimilarItem[];
  posters: Record<string, string | null>;
  basePath: string;
  heading?: string;
}) {
  if (items.length === 0) return null;

  return (
    <section style={{ position: "relative", zIndex: 2, maxWidth: 1320, margin: "0 auto", padding: "48px 28px 70px" }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginBottom: 22 }}>
        <h2 style={{ margin: 0, fontFamily: "var(--font-bodoni), serif", fontSize: 26, fontWeight: 800 }}>{heading}</h2>
        <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 24 }}>
        {items.map((it) => (
          <Link
            key={it.slug}
            href={`${basePath}/${it.slug}`}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", color: "inherit" }}
          >
            <div
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 6,
                background: "linear-gradient(160deg,var(--frameA),var(--frameB))",
                boxShadow: "var(--shadow)",
              }}
            >
              <div style={{ padding: 7, background: "var(--matte)", borderRadius: 3 }}>
                <div style={{ position: "relative", width: "100%", aspectRatio: "2 / 3" }}>
                  <Poster src={posters[it.slug] ?? null} label={it.title} sizes="(max-width: 700px) 45vw, 200px" />
                </div>
              </div>
            </div>
            <div style={{ marginTop: 12, textAlign: "center" }}>
              <h3 style={{ margin: "0 0 6px", fontFamily: "var(--font-bodoni), serif", fontSize: 17, fontWeight: 700 }}>{it.title}</h3>
              <HeatScale score={it.score} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
