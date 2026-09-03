"use client";

import { useEffect, useRef, useState } from "react";

type ChatMessage = { role: "user" | "assistant"; content: string };

const GREETING: ChatMessage = {
  role: "assistant",
  content: "Looking for something to watch, or want to talk about a film? Ask away.",
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, open]);

  async function send() {
    const text = input.trim();
    if (!text || sending) return;

    const history = [...messages, { role: "user" as const, content: text }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok || !res.body) {
        const detail = await res.text().catch(() => "");
        throw new Error(detail || `Request failed (${res.status})`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let reply = "";

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        setMessages([...history, { role: "assistant", content: reply }]);
      }
    } catch (err) {
      setMessages([
        ...history,
        { role: "assistant", content: "Couldn't reach the chat right now - give it another try in a bit." },
      ]);
      console.warn("[chat] failed:", err);
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{ position: "fixed", right: 24, bottom: 24, zIndex: 80 }}>
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            bottom: 68,
            width: 340,
            maxWidth: "calc(100vw - 48px)",
            height: 460,
            display: "flex",
            flexDirection: "column",
            background: "var(--card)",
            border: "1px solid var(--line)",
            borderRadius: 6,
            boxShadow: "var(--shadow)",
            overflow: "hidden",
          }}
        >
          <div style={{ height: 10, background: "repeating-linear-gradient(90deg,#a5121c 0 6px,#f6e9dc 6px 12px)", flex: "0 0 auto" }} />
          <div
            style={{
              flex: "0 0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 16px 12px",
              borderBottom: "1px solid var(--line)",
            }}
          >
            <span style={{ fontFamily: "var(--font-bodoni), serif", fontSize: 18, fontWeight: 800 }}>Ask Hot Take</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="hover-brand"
              style={{ border: 0, background: "transparent", color: "var(--dim)", cursor: "pointer", fontSize: 18, lineHeight: 1 }}
            >
              ×
            </button>
          </div>

          <div ref={listRef} style={{ flex: "1 1 auto", overflowY: "auto", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                  padding: "9px 12px",
                  borderRadius: 12,
                  fontSize: 14,
                  lineHeight: 1.45,
                  fontFamily: "var(--font-barlow), sans-serif",
                  background: m.role === "user" ? "var(--brand)" : "var(--card2)",
                  color: m.role === "user" ? "var(--onbrand)" : "var(--ink)",
                  border: m.role === "user" ? "none" : "1px solid var(--line)",
                  whiteSpace: "pre-wrap",
                }}
              >
                {m.content || (sending && i === messages.length - 1 ? "…" : "")}
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            style={{ flex: "0 0 auto", display: "flex", gap: 8, padding: 12, borderTop: "1px solid var(--line)" }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for a recommendation..."
              disabled={sending}
              style={{
                flex: "1 1 auto",
                minWidth: 0,
                padding: "10px 12px",
                border: "1px solid var(--line)",
                borderRadius: 999,
                background: "var(--card2)",
                color: "var(--ink)",
                fontFamily: "var(--font-barlow), sans-serif",
                fontSize: 14,
                outline: 0,
              }}
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="hover-brighter"
              style={{
                flex: "0 0 auto",
                padding: "0 18px",
                border: "1px solid var(--brand)",
                borderRadius: 999,
                background: "var(--brand)",
                color: "var(--onbrand)",
                cursor: sending || !input.trim() ? "default" : "pointer",
                opacity: sending || !input.trim() ? 0.6 : 1,
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                textTransform: "uppercase",
                letterSpacing: ".14em",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              Send
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="hover-brighter"
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          border: "1px solid var(--brand)",
          background: "var(--brand)",
          color: "var(--onbrand)",
          cursor: "pointer",
          boxShadow: "var(--shadow)",
          display: "grid",
          placeItems: "center",
          fontSize: 22,
        }}
      >
        {open ? "×" : "🎬"}
      </button>
    </div>
  );
}
