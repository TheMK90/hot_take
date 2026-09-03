import Anthropic from "@anthropic-ai/sdk";
import { getAnthropicClient, buildChatSystemPrompt, CHAT_MODEL } from "@/lib/ai";

const MAX_TURNS = 20;
const MAX_MESSAGE_LENGTH = 2000;

type ChatMessage = { role: "user" | "assistant"; content: string };

function parseMessages(body: unknown): ChatMessage[] | null {
  if (!body || typeof body !== "object" || !Array.isArray((body as { messages?: unknown }).messages)) {
    return null;
  }
  const raw = (body as { messages: unknown[] }).messages;
  if (raw.length === 0 || raw.length > MAX_TURNS) return null;

  const messages: ChatMessage[] = [];
  for (const entry of raw) {
    if (
      !entry ||
      typeof entry !== "object" ||
      ((entry as { role?: unknown }).role !== "user" && (entry as { role?: unknown }).role !== "assistant") ||
      typeof (entry as { content?: unknown }).content !== "string"
    ) {
      return null;
    }
    const content = (entry as { role: "user" | "assistant"; content: string }).content.slice(0, MAX_MESSAGE_LENGTH);
    messages.push({ role: (entry as { role: "user" | "assistant" }).role, content });
  }
  if (messages[messages.length - 1].role !== "user") return null;
  return messages;
}

export async function POST(req: Request) {
  const client = getAnthropicClient();
  if (!client) {
    return new Response("Chat is offline right now - no API key is configured.", { status: 503 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("Malformed request.", { status: 400 });
  }

  const messages = parseMessages(body);
  if (!messages) {
    return new Response("Malformed request.", { status: 400 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = client.messages.stream({
          model: CHAT_MODEL,
          max_tokens: 1024,
          system: buildChatSystemPrompt(),
          output_config: { effort: "low" },
          messages: messages as Anthropic.MessageParam[],
        });

        anthropicStream.on("text", (text) => {
          controller.enqueue(encoder.encode(text));
        });
        anthropicStream.on("error", (err) => {
          console.error("[chat] stream error:", err);
          controller.error(err);
        });
        await anthropicStream.finalMessage();
        controller.close();
      } catch (err) {
        console.error("[chat] request failed:", err);
        controller.error(err);
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
