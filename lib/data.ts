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
  director: string;
  releaseDate: string; // human-readable, for the profile page
  summary: string;
};

export const lobbyMovies: Movie[] = [
  {
    slug: "shawshank-redemption",
    title: "The Shawshank Redemption",
    genre: "Drama",
    year: 1994,
    runtimeMin: 142,
    score: 5,
    tmdbId: 278,
    director: "Frank Darabont",
    releaseDate: "September 23, 1994",
    summary:
      "A banker convicted of a murder he didn't commit spends two decades in Shawshank State Penitentiary, forming an unlikely friendship with a fellow inmate and chipping away, patiently, at a way out.",
  },
  {
    slug: "the-godfather",
    title: "The Godfather",
    genre: "Classics",
    year: 1972,
    runtimeMin: 175,
    score: 5,
    tmdbId: 238,
    director: "Francis Ford Coppola",
    releaseDate: "March 24, 1972",
    summary:
      "The aging patriarch of an organized crime dynasty transfers control of his empire to his reluctant youngest son, who is drawn deeper into the family business than he ever intended to go.",
  },
  {
    slug: "the-dark-knight",
    title: "The Dark Knight",
    genre: "Thriller",
    year: 2008,
    runtimeMin: 152,
    score: 5,
    tmdbId: 155,
    director: "Christopher Nolan",
    releaseDate: "July 18, 2008",
    summary:
      "Batman raises the stakes in his war on crime with the help of Lieutenant Gordon and DA Harvey Dent, but a rising criminal mastermind known as the Joker throws Gotham into chaos and forces impossible choices.",
  },
  {
    slug: "pulp-fiction",
    title: "Pulp Fiction",
    genre: "Crime",
    year: 1994,
    runtimeMin: 154,
    score: 4,
    tmdbId: 680,
    director: "Quentin Tarantino",
    releaseDate: "October 14, 1994",
    summary:
      "The lives of two hitmen, a boxer, a gangster's wife, and a pair of diner bandits intertwine in four tales of violence and redemption, told wildly out of order.",
  },
  {
    slug: "parasite",
    title: "Parasite",
    genre: "Thriller",
    year: 2019,
    runtimeMin: 132,
    score: 5,
    tmdbId: 496243,
    director: "Bong Joon-ho",
    releaseDate: "May 30, 2019",
    summary:
      "A struggling family cons its way into working for a wealthy household one job at a time, until the arrangement uncovers something buried in the house that changes everything.",
  },
  {
    slug: "spirited-away",
    title: "Spirited Away",
    genre: "Animation",
    year: 2001,
    runtimeMin: 125,
    score: 5,
    tmdbId: 129,
    director: "Hayao Miyazaki",
    releaseDate: "July 20, 2001",
    summary:
      "Moving to a new neighborhood, a sullen ten-year-old girl wanders into a world ruled by gods and spirits, where humans are changed into beasts, and must find a way to free her parents and go home.",
  },
  {
    slug: "interstellar",
    title: "Interstellar",
    genre: "Epic",
    year: 2014,
    runtimeMin: 169,
    score: 4,
    tmdbId: 157336,
    director: "Christopher Nolan",
    releaseDate: "November 7, 2014",
    summary:
      "With Earth's soil failing crop by crop, a former pilot leads a crew through a wormhole near Saturn in search of a new home for humanity, racing time that moves differently for everyone he leaves behind.",
  },
  {
    slug: "get-out",
    title: "Get Out",
    genre: "Horror",
    year: 2017,
    runtimeMin: 104,
    score: 4,
    tmdbId: 419430,
    director: "Jordan Peele",
    releaseDate: "February 24, 2017",
    summary:
      "A young man visits his white girlfriend's family estate for the first time, where the polite hospitality masks something far more sinister waiting just beneath the surface.",
  },
  {
    slug: "blade-runner-2049",
    title: "Blade Runner 2049",
    genre: "Drama",
    year: 2017,
    runtimeMin: 164,
    score: 4,
    tmdbId: 335984,
    director: "Denis Villeneuve",
    releaseDate: "October 6, 2017",
    summary:
      "A young blade runner unearths a long-buried secret that has the potential to plunge what's left of society into chaos, leading him to a former blade runner missing for thirty years.",
  },
  {
    slug: "oppenheimer",
    title: "Oppenheimer",
    genre: "Drama",
    year: 2023,
    runtimeMin: 180,
    score: 4,
    tmdbId: 872585,
    director: "Christopher Nolan",
    releaseDate: "July 21, 2023",
    summary:
      "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II, and the reckoning with what he helped bring into the world that followed him for the rest of his life.",
  },
];

export function getMovieBySlug(slug: string): Movie | undefined {
  return lobbyMovies.find((m) => m.slug === slug);
}

/**
 * Titles for the profile page's "similar" rail: same genre first, then backfilled
 * with the rest of the catalogue (highest rated first) so a one-of-a-kind genre
 * still gets a full set of suggestions rather than an empty rail.
 */
export function similarMovies(movie: Movie, limit = 4): Movie[] {
  const others = lobbyMovies.filter((m) => m.slug !== movie.slug);
  const sameGenre = others.filter((m) => m.genre === movie.genre);
  const rest = others.filter((m) => m.genre !== movie.genre).sort((a, b) => b.score - a.score);
  return [...sameGenre, ...rest].slice(0, limit);
}

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
