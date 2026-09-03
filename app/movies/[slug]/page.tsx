import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ComposerModal } from "@/components/ComposerModal";
import { MovieHero } from "@/components/MovieHero";
import { MovieShowtimes } from "@/components/MovieShowtimes";
import { TitleReviews } from "@/components/TitleReviews";
import { SimilarTitles } from "@/components/SimilarTitles";
import { lobbyMovies, getMovieBySlug, similarMovies, communityReviews, showtimes } from "@/lib/data";
import { getPoster, getBackdrop, getPosterMap, type ArtLookup } from "@/lib/fanart";

export function generateStaticParams() {
  return lobbyMovies.map((m) => ({ slug: m.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const movie = getMovieBySlug(params.slug);
  if (!movie) return { title: "Movie not found — Hot Take" };
  return {
    title: `${movie.title} (${movie.year}) — Hot Take`,
    description: movie.summary,
  };
}

export default async function MovieProfilePage({ params }: { params: { slug: string } }) {
  const movie = getMovieBySlug(params.slug);
  if (!movie) notFound();

  const related = similarMovies(movie, 4);
  const relatedLookups: Record<string, ArtLookup> = Object.fromEntries(
    related.map((m) => [m.slug, { kind: "movie" as const, id: m.tmdbId }])
  );

  const [posterUrl, backdropUrl, relatedPosters] = await Promise.all([
    getPoster("movie", movie.tmdbId),
    getBackdrop("movie", movie.tmdbId),
    getPosterMap(relatedLookups),
  ]);

  const reviewsForMovie = communityReviews.filter((r) => r.slug === movie.slug);
  const showtime = showtimes.find((s) => s.title === movie.title);

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "var(--bg)", color: "var(--ink)", overflowX: "hidden" }}>
      <Header />
      <MovieHero movie={movie} posterUrl={posterUrl} backdropUrl={backdropUrl} />

      <section style={{ position: "relative", zIndex: 2, maxWidth: 1320, margin: "0 auto", padding: "40px 28px 0" }}>
        <h2 style={{ margin: "0 0 14px", fontFamily: "var(--font-bodoni), serif", fontSize: 26, fontWeight: 800 }}>Summary</h2>
        <p style={{ margin: 0, maxWidth: 760, fontSize: 16, lineHeight: 1.65, color: "var(--dim)", textWrap: "pretty" }}>{movie.summary}</p>
      </section>

      <MovieShowtimes movie={movie} showtime={showtime} />
      <TitleReviews title={movie.title} reviews={reviewsForMovie} />
      <SimilarTitles items={related} posters={relatedPosters} basePath="/movies" />

      <Footer />
      <ComposerModal />
    </div>
  );
}
