import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { MarqueeBackdrop } from "@/components/MarqueeBackdrop";
import { LobbyRail } from "@/components/LobbyRail";
import { TvRail } from "@/components/TvRail";
import { ReviewsSection } from "@/components/ReviewsSection";
import { NowShowing } from "@/components/NowShowing";
import { Top10 } from "@/components/Top10";
import { MyRatings } from "@/components/MyRatings";
import { Genres } from "@/components/Genres";
import { Footer } from "@/components/Footer";
import { ComposerModal } from "@/components/ComposerModal";
import { lobbyMovies, tvShows, communityReviews } from "@/lib/data";
import { getPosterMap, getBackdropMap, type ArtLookup } from "@/lib/fanart";

// This page is a server component so the fanart.tv key stays on the server:
// artwork is resolved here and only finished image URLs are handed to the
// client components below.
export default async function Home() {
  const movieLookups: Record<string, ArtLookup> = Object.fromEntries(
    lobbyMovies.map((m) => [m.slug, { kind: "movie" as const, id: m.tmdbId }])
  );
  const showLookups: Record<string, ArtLookup> = Object.fromEntries(
    tvShows.map((s) => [s.slug, { kind: "tv" as const, id: s.tvdbId }])
  );
  // Review cards are landscape, so they take wide art rather than the poster.
  const reviewLookups: Record<string, ArtLookup> = Object.fromEntries(
    communityReviews.flatMap((rev) => {
      const movie = lobbyMovies.find((m) => m.slug === rev.slug);
      return movie ? [[rev.slug, { kind: "movie" as const, id: movie.tmdbId }] as const] : [];
    })
  );

  const [moviePosters, showPosters, reviewStills] = await Promise.all([
    getPosterMap(movieLookups),
    getPosterMap(showLookups),
    getBackdropMap(reviewLookups),
  ]);

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "var(--bg)", color: "var(--ink)", overflowX: "hidden" }}>
      <MarqueeBackdrop />
      <Header />
      <Hero />
      <LobbyRail posters={moviePosters} />
      <ReviewsSection stills={reviewStills} />
      <NowShowing />
      <TvRail posters={showPosters} />
      <MyRatings />
      <Top10 />
      <Genres />
      <Footer />
      <ComposerModal />
    </div>
  );
}
