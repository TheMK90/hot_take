import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { lobbyMovies, tvShows } from "@/lib/data";

// Chat widget backend. Mirrors lib/fanart.ts: the API key must never reach
// the browser, so the client only ever talks to app/api/chat/route.ts, which
// is the sole caller of everything here.

const MODEL = "claude-opus-5";

let warnedAboutMissingKey = false;

/** Returns null (never throws) when ANTHROPIC_API_KEY is unset, so the
 * route handler can degrade to a "chat is offline" response instead of a
 * crash -- same contract as lib/fanart.ts's apiKey(). */
export function getAnthropicClient(): Anthropic | null {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    if (!warnedAboutMissingKey) {
      warnedAboutMissingKey = true;
      console.warn(
        "[ai] ANTHROPIC_API_KEY is not set - the chat widget will report itself offline. " +
          "Copy .env.example to .env.local and add your key."
      );
    }
    return null;
  }
  return new Anthropic({ apiKey });
}

export const CHAT_MODEL = MODEL;

function catalogueSummary(): string {
  const movies = lobbyMovies.map((m) => `${m.title} (${m.year}, ${m.genre})`).join("; ");
  const shows = tvShows.map((s) => `${s.title} (${s.firstAired}, ${s.genre})`).join("; ");
  return `Movies in the catalogue: ${movies}.\nShows in the catalogue: ${shows}.`;
}

export function buildChatSystemPrompt(): string {
  return [
    `You are the Hot Take Assistant, embedded in a film review site called Hot Take ("rate it. review it. roast it.").`,
    "Help visitors find something to watch and talk about film and TV, in a blunt, witty, opinionated voice - like a friend with strong takes, never mean-spirited or snobbish.",
    "Prefer recommending titles from the site's own catalogue when they genuinely fit, since those are the ones visitors can rate and review here. It's fine to mention other films when the catalogue doesn't have a good fit.",
    catalogueSummary(),
    "Keep replies conversational and fairly short - a few sentences, not an essay - unless the visitor asks for more depth.",
  ].join("\n\n");
}
