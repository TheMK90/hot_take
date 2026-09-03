// Catalogue data. Still local/mock, but the titles are now real films and shows
// so that fanart.tv can serve artwork for them -- it is keyed by TMDb id
// (movies) and TVDB id (shows) and has no title search, so every entry carries
// the id its poster is fetched with. See lib/fanart.ts.

export type Movie = {
  slug: string;
  title: string;
  genre: string;
  year: number;
  runtimeMin: number;
  score: number; // out of 5, in whole steps (RateDots fills i < score)
  tmdbId: number;
};

export const lobbyMovies: Movie[] = [
  { slug: "shawshank-redemption", title: "The Shawshank Redemption", genre: "Drama", year: 1994, runtimeMin: 142, score: 5, tmdbId: 278 },
  { slug: "the-godfather", title: "The Godfather", genre: "Classics", year: 1972, runtimeMin: 175, score: 5, tmdbId: 238 },
  { slug: "the-dark-knight", title: "The Dark Knight", genre: "Thriller", year: 2008, runtimeMin: 152, score: 5, tmdbId: 155 },
  { slug: "pulp-fiction", title: "Pulp Fiction", genre: "Crime", year: 1994, runtimeMin: 154, score: 4, tmdbId: 680 },
  { slug: "parasite", title: "Parasite", genre: "Thriller", year: 2019, runtimeMin: 132, score: 5, tmdbId: 496243 },
  { slug: "spirited-away", title: "Spirited Away", genre: "Animation", year: 2001, runtimeMin: 125, score: 5, tmdbId: 129 },
  { slug: "interstellar", title: "Interstellar", genre: "Epic", year: 2014, runtimeMin: 169, score: 4, tmdbId: 157336 },
  { slug: "get-out", title: "Get Out", genre: "Horror", year: 2017, runtimeMin: 104, score: 4, tmdbId: 419430 },
  { slug: "blade-runner-2049", title: "Blade Runner 2049", genre: "Drama", year: 2017, runtimeMin: 164, score: 4, tmdbId: 335984 },
  { slug: "oppenheimer", title: "Oppenheimer", genre: "Drama", year: 2023, runtimeMin: 180, score: 4, tmdbId: 872585 },
];

export type Show = {
  slug: string;
  title: string;
  genre: string;
  firstAired: number;
  seasons: number;
  score: number;
  tvdbId: number;
};

export const tvShows: Show[] = [
  { slug: "breaking-bad", title: "Breaking Bad", genre: "Crime", firstAired: 2008, seasons: 5, score: 5, tvdbId: 81189 },
  { slug: "the-sopranos", title: "The Sopranos", genre: "Drama", firstAired: 1999, seasons: 6, score: 5, tvdbId: 75299 },
  { slug: "the-wire", title: "The Wire", genre: "Crime", firstAired: 2002, seasons: 5, score: 5, tvdbId: 79126 },
  { slug: "chernobyl", title: "Chernobyl", genre: "Drama", firstAired: 2019, seasons: 1, score: 5, tvdbId: 360893 },
  { slug: "severance", title: "Severance", genre: "Thriller", firstAired: 2022, seasons: 2, score: 4, tvdbId: 371980 },
  { slug: "stranger-things", title: "Stranger Things", genre: "Horror", firstAired: 2016, seasons: 4, score: 4, tvdbId: 305288 },
  { slug: "game-of-thrones", title: "Game of Thrones", genre: "Epic", firstAired: 2011, seasons: 8, score: 4, tvdbId: 121361 },
  { slug: "the-office", title: "The Office (US)", genre: "Comedy", firstAired: 2005, seasons: 9, score: 4, tvdbId: 73244 },
];

export type CommunityReview = {
  id: string;
  film: string;
  slug: string; // matches a lobbyMovies slug, so the card can pull its artwork
  tag: "Top rated" | "Mixed";
  score: string;
  body: string;
  initials: string;
  byline: string;
};

export const communityReviews: CommunityReview[] = [
  {
    id: "rev-1",
    film: "Parasite",
    slug: "parasite",
    tag: "Top rated",
    score: "4.5 / 5",
    body: "Half the film is a con, half is the bill coming due, and the hinge between them is the best staged sequence in years. The house is the whole argument.",
    initials: "DW",
    byline: "@danaw · 2 days ago · 128 helpful",
  },
  {
    id: "rev-2",
    film: "Interstellar",
    slug: "interstellar",
    tag: "Mixed",
    score: "3 / 5",
    body: "The docking scene and the water planet are genuinely extraordinary. Every time someone stops to explain the plot out loud, it deflates a little.",
    initials: "RM",
    byline: "@ravi_m · 3 days ago · 64 helpful",
  },
  {
    id: "rev-3",
    film: "Blade Runner 2049",
    slug: "blade-runner-2049",
    tag: "Top rated",
    score: "5 / 5",
    body: "Slow in the way weather is slow. See it on the biggest screen you can find and let the sound design do the rest.",
    initials: "EC",
    byline: "@elliscarr · 5 days ago · 302 helpful",
  },
];

export type Showtime = {
  title: string;
  format: string;
  runtimeMin: number;
  times: string[];
};

export const showtimes: Showtime[] = [
  { title: "Oppenheimer", format: "70mm IMAX", runtimeMin: 180, times: ["13:15", "16:40", "20:05"] },
  { title: "Blade Runner 2049", format: "Dolby", runtimeMin: 164, times: ["14:00", "18:30", "21:45"] },
  { title: "Spirited Away", format: "Standard", runtimeMin: 125, times: ["12:30", "15:10", "19:20"] },
  { title: "Get Out", format: "Late show", runtimeMin: 104, times: ["22:10", "23:55"] },
];

export type Top10Entry = { rank: number; title: string; score: number };

export const top10: Top10Entry[] = [
  { rank: 1, title: "The Shawshank Redemption", score: 96 },
  { rank: 2, title: "The Godfather", score: 95 },
  { rank: 3, title: "Parasite", score: 94 },
  { rank: 4, title: "The Dark Knight", score: 92 },
  { rank: 5, title: "Spirited Away", score: 91 },
  { rank: 6, title: "Pulp Fiction", score: 89 },
  { rank: 7, title: "Blade Runner 2049", score: 86 },
  { rank: 8, title: "Oppenheimer", score: 85 },
  { rank: 9, title: "Interstellar", score: 83 },
  { rank: 10, title: "Get Out", score: 81 },
];

export type Genre = { name: string; count: number };

export const genres: Genre[] = [
  { name: "Drama", count: 38 },
  { name: "Thriller", count: 24 },
  { name: "Comedy", count: 19 },
  { name: "Horror", count: 15 },
  { name: "Documentary", count: 27 },
  { name: "Classics", count: 11 },
];

export const BASE_REVIEW_COUNT = 12480;
