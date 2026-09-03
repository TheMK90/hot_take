import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AuthModal } from "@/components/AuthModal";
import { ComposerModal } from "@/components/ComposerModal";
import { MovieHero } from "@/components/MovieHero";
import { MovieShowtimes } from "@/components/MovieShowtimes";
import { TitleReviews } from "@/components/TitleReviews";
import { SimilarTitles } from "@/components/SimilarTitles";
import { similarMovies, showtimes } from "@/lib/data";
import { getMovies, getMovie, getReviewsForSlug } from "@/lib/catalogue";
import { getPoster, getBackdrop, getPosterMap, type ArtLookup } from "@/lib/fanart";

// A title added after the last deploy still gets a page, rendered on demand.
export const dynamicParams = true;

// Built from the database, so a title added there gets a page without a code change.
export async function generateStaticParams() {
  return (await getMovies()).map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const movie = await getMovie(params.slug);
  if (!movie) return { title: "Movie not found — Hot Take" };
  return {
    title: `${movie.title} (${movie.year}) — Hot Take`,
    description: movie.summary,
  };
}

export default async function MovieProfilePage({ params }: { params: { slug: string } }) {
  const movie = await getMovie(params.slug);
  if (!movie) notFound();

  const allMovies = await getMovies();
  const related = similarMovies(movie, 4, allMovies);
  const relatedLookups: Record<string, ArtLookup> = Object.fromEntries(
    related.map((m) => [m.slug, { kind: "movie" as const, id: m.tmdbId }])
  );

  const [posterUrl, backdropUrl, relatedPosters] = await Promise.all([
    getPoster("movie", movie.tmdbId),
    getBackdrop("movie", movie.tmdbId),
    getPosterMap(relatedLookups),
  ]);

  const reviewsForMovie = await getReviewsForSlug(movie.slug);
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
      <AuthModal />
      <ComposerModal />
    </div>
  );
}
