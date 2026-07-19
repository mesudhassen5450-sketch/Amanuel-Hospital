import { useEffect, useState, useRef } from "react";
import { ArrowUp, MessageCircle, X, Phone, Send, Loader2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { contactInfo } from "@/lib/site-data";
import { chatWithAi } from "@/lib/chat-server";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// ---------------------------------------------------------------------------
// Renders an AI message string that may contain:
//   - Markdown links: [label](url)        → <Link> (internal) or <a> (external)
//   - Bold text:      **text**             → <strong>
//   - Bullet lines:   lines starting "• " → tight list items
//   - Newlines                             → line breaks between paragraphs
// ---------------------------------------------------------------------------
function MessageContent({ text }: { text: string }) {
  // Split on newlines first so we can handle bullets as block elements
  const lines = text.split("\n");

  return (
    <span className="space-y-1 block">
      {lines.map((line, li) => {
        const trimmed = line.trim();
        if (trimmed === "") return null;

        const isBullet =
          trimmed.startsWith("• ") ||
          trimmed.startsWith("- ") ||
          trimmed.startsWith("* ") ||
          /^\d+\.\s/.test(trimmed);

        const content = renderInline(trimmed);

        return isBullet ? (
          <span key={li} className="flex gap-1.5">
            <span className="shrink-0 mt-0.5 text-primary">›</span>
            <span>{content}</span>
          </span>
        ) : (
          <span key={li} className="block">
            {content}
          </span>
        );
      })}
    </span>
  );
}

// Parses inline markdown: **bold** and [label](url)
function renderInline(text: string): React.ReactNode[] {
  // Combined regex: captures either **bold** or [label](url)
  const tokenRegex = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(text)) !== null) {
    // Push plain text before this match
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    if (match[1] !== undefined) {
      // **bold**
      nodes.push(<strong key={match.index}>{match[1]}</strong>);
    } else if (match[2] !== undefined && match[3] !== undefined) {
      const label = match[2];
      const href = match[3];
      const isInternal = href.startsWith("/");

      if (isInternal) {
        nodes.push(
          <Link
            key={match.index}
            to={href as "/"}
            className="font-semibold text-primary underline underline-offset-2 hover:opacity-80"
          >
            {label}
          </Link>
        );
      } else {
        nodes.push(
          <a
            key={match.index}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary underline underline-offset-2 hover:opacity-80"
          >
            {label}
          </a>
        );
      }
    }

    lastIndex = match.index + match[0].length;
  }

  // Push any remaining plain text
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

// ---------------------------------------------------------------------------

interface FloatingActionsProps {
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
}

export function FloatingActions({ chatOpen, setChatOpen }: FloatingActionsProps) {
  const [showTop, setShowTop] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! 👋 I'm the Dr. Amanuel Hospital AI Assistant. Ask me about our services, doctors, working hours, appointments, or careers — I'm here to help!",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (chatOpen) {
      scrollToBottom();
    }
  }, [messages, chatOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessageContent = text.trim();
    setInput("");

    const updatedMessages = [
      ...messages,
      { role: "user" as const, content: userMessageContent },
    ];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      // Gemini requires the conversation to start with a "user" turn.
      // The initial greeting message is role "assistant", so we drop any
      // leading assistant messages before sending to the API.
      const firstUserIndex = updatedMessages.findIndex((m) => m.role === "user");
      const trimmed = firstUserIndex >= 0 ? updatedMessages.slice(firstUserIndex) : updatedMessages;

      const apiMessages = trimmed.map((msg) => ({
        role: msg.role === "user" ? ("user" as const) : ("assistant" as const),
        content: msg.content,
      }));

      const response = await chatWithAi({ data: { messages: apiMessages } });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.content },
      ]);
    } catch (error) {
      console.error("Failed to get AI response:", error);
      const errMsg =
        error instanceof Error ? error.message : "Unknown error";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I'm having trouble connecting right now. Please try again, or contact us directly at " +
            contactInfo.phone +
            ` (Error: ${errMsg})`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessage(input);
  };

  // Quick-reply suggestion chips shown before user sends first message
  const suggestions = [
    "What are your working hours?",
    "How do I book an appointment?",
    "What services do you offer?",
    "Are there job vacancies?",
  ];
  const hasUserSpoken = messages.some((m) => m.role === "user");

  return (
    <>
      {/* ── AI Chat Widget ─────────────────────────────────────────────── */}
      {chatOpen && (
        <div className="fixed bottom-24 right-4 z-50 w-96 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl animate-scale-in flex flex-col h-[520px]">
          {/* Header */}
          <div className="flex items-center justify-between bg-primary px-4 py-3.5 text-primary-foreground shrink-0">
            <div className="flex items-center gap-2">
              <div className="relative">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-foreground/20 text-xs font-semibold">
                  AH
                </span>
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-success border-2 border-primary animate-pulse" />
              </div>
              <div>
                <p className="font-display text-sm font-semibold">Hospital Assistant</p>
                <p className="text-[10px] opacity-90">AI · Online · Powered by Gemini</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              onClick={() => setChatOpen(false)}
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={cn(
                  "flex flex-col max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                  msg.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-secondary text-secondary-foreground rounded-tl-none"
                )}
              >
                {msg.role === "assistant" ? (
                  <MessageContent text={msg.content} />
                ) : (
                  <span>{msg.content}</span>
                )}
              </div>
            ))}

            {/* Quick-reply chips — only before user has typed anything */}
            {!hasUserSpoken && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground hover:bg-secondary transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/40 rounded-2xl rounded-tl-none max-w-[85%] px-3.5 py-2.5">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Dr. Amanuel AI is thinking…</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Emergency hotline banner */}
          <div className="px-4 py-2 border-t border-border/60 bg-secondary/20 flex items-center justify-between gap-2 text-[11px] text-muted-foreground shrink-0">
            <span className="flex items-center gap-1.5 font-medium">
              <Phone className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              Emergency: {contactInfo.emergency} (24/7)
            </span>
            <Button
              variant="link"
              className="p-0 h-auto text-[11px] font-semibold text-primary hover:text-primary"
              onClick={() => window.open(`tel:${contactInfo.emergency}`)}
            >
              Call now
            </Button>
          </div>

          {/* Input form */}
          <form
            id="chat-form"
            className="flex gap-2 border-t border-border p-3 shrink-0"
            onSubmit={handleSend}
          >
            <label htmlFor="chat-input" className="sr-only">
              Type a message
            </label>
            <Input
              id="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about doctors, services, hours…"
              className="rounded-xl flex-1 bg-background"
              disabled={loading}
              autoComplete="off"
            />
            <Button
              type="submit"
              size="icon"
              className="rounded-xl shrink-0"
              disabled={loading || !input.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}

      {/* ── Chat Trigger Button ─────────────────────────────────────────── */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        aria-label={chatOpen ? "Close AI assistant" : "Open AI assistant"}
        className="fixed bottom-6 right-4 z-50 grid h-14 w-14 place-items-center rounded-full bg-success text-success-foreground shadow-lg transition-transform hover:scale-110 animate-pulse-soft"
      >
        {chatOpen ? (
          <X className="h-6 w-6" aria-hidden="true" />
        ) : (
          <MessageCircle className="h-6 w-6" aria-hidden="true" />
        )}
      </button>

      {/* ── Back to Top ─────────────────────────────────────────────────── */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className={cn(
          "fixed bottom-6 right-20 z-50 grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:scale-110",
          showTop
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        )}
      >
        <ArrowUp className="h-5 w-5" aria-hidden="true" />
      </button>
    </>
  );
}
