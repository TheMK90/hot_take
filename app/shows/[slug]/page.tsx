import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ComposerModal } from "@/components/ComposerModal";
import { ShowHero } from "@/components/ShowHero";
import { TitleReviews } from "@/components/TitleReviews";
import { ShowWhereToWatch } from "@/components/ShowWhereToWatch";
import { SimilarTitles } from "@/components/SimilarTitles";
import { tvShows, getShowBySlug, similarShows, showReviews } from "@/lib/data";
import { getPoster, getBackdrop, getPosterMap, type ArtLookup } from "@/lib/fanart";

export function generateStaticParams() {
  return tvShows.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const show = getShowBySlug(params.slug);
  if (!show) return { title: "Show not found — Hot Take" };
  return {
    title: `${show.title} (${show.firstAired}) — Hot Take`,
    description: show.summary,
  };
}

export default async function ShowProfilePage({ params }: { params: { slug: string } }) {
  const show = getShowBySlug(params.slug);
  if (!show) notFound();

  const related = similarShows(show, 4);
  const relatedLookups: Record<string, ArtLookup> = Object.fromEntries(
    related.map((s) => [s.slug, { kind: "tv" as const, id: s.tvdbId }])
  );

  const [posterUrl, backdropUrl, relatedPosters] = await Promise.all([
    getPoster("tv", show.tvdbId),
    getBackdrop("tv", show.tvdbId),
    getPosterMap(relatedLookups),
  ]);

  const reviewsForShow = showReviews.filter((r) => r.slug === show.slug);

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "var(--bg)", color: "var(--ink)", overflowX: "hidden" }}>
      <Header />
      <ShowHero show={show} posterUrl={posterUrl} backdropUrl={backdropUrl} />

      <section style={{ position: "relative", zIndex: 2, maxWidth: 1320, margin: "0 auto", padding: "40px 28px 0" }}>
        <h2 style={{ margin: "0 0 14px", fontFamily: "var(--font-bodoni), serif", fontSize: 26, fontWeight: 800 }}>Summary</h2>
        <p style={{ margin: 0, maxWidth: 760, fontSize: 16, lineHeight: 1.65, color: "var(--dim)", textWrap: "pretty" }}>{show.summary}</p>
      </section>

      <ShowWhereToWatch show={show} />
      <TitleReviews title={show.title} reviews={reviewsForShow} />
      <SimilarTitles items={related} posters={relatedPosters} basePath="/shows" heading="More to watch" />

      <Footer />
      <ComposerModal />
    </div>
  );
}
