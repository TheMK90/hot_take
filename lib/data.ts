export type Movie = {
  slug: string;
  title: string;
  genre: string;
  year: number;
  runtimeMin: number;
  score: number; // out of 5, in half steps
};

export const lobbyMovies: Movie[] = [
  { slug: "long-interval", title: "The Long Interval", genre: "Drama", year: 2026, runtimeMin: 118, score: 4 },
  { slug: "nightshift-radio", title: "Nightshift Radio", genre: "Thriller", year: 2026, runtimeMin: 104, score: 3 },
  { slug: "salt-flats", title: "Salt Flats", genre: "Western", year: 2026, runtimeMin: 131, score: 5 },
  { slug: "paper-lanterns", title: "Paper Lanterns", genre: "Romance", year: 2026, runtimeMin: 96, score: 3 },
  { slug: "understudy", title: "Understudy", genre: "Comedy", year: 2026, runtimeMin: 101, score: 4 },
  { slug: "grand-cascade", title: "Grand Cascade", genre: "Epic", year: 2026, runtimeMin: 152, score: 4 },
  { slug: "copper-wire", title: "Copper Wire", genre: "Crime", year: 2026, runtimeMin: 124, score: 3 },
  { slug: "second-house", title: "Second House", genre: "Horror", year: 2026, runtimeMin: 89, score: 4 },
  { slug: "marigold-hour", title: "Marigold Hour", genre: "Documentary", year: 2026, runtimeMin: 78, score: 5 },
  { slug: "twelve-winters", title: "Twelve Winters", genre: "Drama", year: 2026, runtimeMin: 143, score: 3 },
];

export type CommunityReview = {
  id: string;
  film: string;
  tag: "Top rated" | "Mixed";
  score: string;
  body: string;
  initials: string;
  byline: string;
};

export const communityReviews: CommunityReview[] = [
  {
    id: "rev-1",
    film: "The Long Interval",
    tag: "Top rated",
    score: "4.5 / 5",
    body: "Two hours of people not saying the thing, and it earns every silence. The last reel is the best editing of the year.",
    initials: "DW",
    byline: "@danaw · 2 days ago · 128 helpful",
  },
  {
    id: "rev-2",
    film: "Nightshift Radio",
    tag: "Mixed",
    score: "3 / 5",
    body: "A great voice performance stuck inside a thriller that keeps explaining itself. Worth it for the first forty minutes.",
    initials: "RM",
    byline: "@ravi_m · 3 days ago · 64 helpful",
  },
  {
    id: "rev-3",
    film: "Salt Flats",
    tag: "Top rated",
    score: "5 / 5",
    body: "Shot like a Western, paced like a heist. See it on the biggest screen you can find and sit near the front.",
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
  { title: "Salt Flats", format: "70mm", runtimeMin: 131, times: ["13:15", "16:40", "20:05"] },
  { title: "Nightshift Radio", format: "Dolby", runtimeMin: 104, times: ["14:00", "18:30", "21:45"] },
  { title: "Understudy", format: "Standard", runtimeMin: 101, times: ["12:30", "15:10", "19:20"] },
  { title: "Second House", format: "Late show", runtimeMin: 89, times: ["22:10", "23:55"] },
];

export type Top10Entry = { rank: number; title: string; score: number };

export const top10: Top10Entry[] = [
  { rank: 1, title: "Salt Flats", score: 96 },
  { rank: 2, title: "Marigold Hour", score: 94 },
  { rank: 3, title: "The Long Interval", score: 91 },
  { rank: 4, title: "Grand Cascade", score: 89 },
  { rank: 5, title: "Twelve Winters", score: 87 },
  { rank: 6, title: "Copper Wire", score: 84 },
  { rank: 7, title: "Understudy", score: 82 },
  { rank: 8, title: "Paper Lanterns", score: 79 },
  { rank: 9, title: "Second House", score: 76 },
  { rank: 10, title: "Nightshift Radio", score: 72 },
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
