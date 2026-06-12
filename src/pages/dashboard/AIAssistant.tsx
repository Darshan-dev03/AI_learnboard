import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Trash2, Archive, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAIChat } from "@/lib/hooks/useDashboard";
import { askAIAssistant } from "@/lib/gemini";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const SUGGESTIONS = [
  "Explain Binary Search",
  "Difference between let, const and var",
  "How does useEffect work?",
  "Explain async/await",
  "What is Big O notation?",
  "How does Flexbox work?",
];

const AIAssistant = ({ user }: { user: any }) => {
  const { messages, loading, saveMessage, clearChat, fetchArchived } = useAIChat(user.id);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [archivedMessages, setArchivedMessages] = useState<any[]>([]);
  const [showArchive, setShowArchive] = useState(false);
  const [loadingArchive, setLoadingArchive] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const handleClearChat = async () => {
    if (window.confirm("Archive current chat and start fresh?")) {
      await clearChat();
      toast({ title: "Chat Archived", description: "Your previous messages have been saved and archived." });
    }
  };

  const handleViewArchive = async () => {
    setLoadingArchive(true);
    const archived = await fetchArchived();
    setArchivedMessages(archived);
    setLoadingArchive(false);
    setShowArchive(true);
  };

  const send = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || sending) return;
    
    setSending(true);
    setInput("");
    
    // Save user message first
    await saveMessage("user", msg);
    
    try {
      const history = messages.slice(-8).map(m => ({
        role: m.role === "ai" ? "assistant" : "user",
        content: m.message,
      }));
      const reply = await askAIAssistant(msg, history);
      await saveMessage("ai", reply);
    } catch (error) {
      console.error("AI Assistant Error:", error);
      await saveMessage("ai", "Sorry, I couldn't connect right now. Please try again.");
      toast({ title: "AI Error", description: "Check your OpenAI API key or try restarting the server.", variant: "destructive" });
    } finally {
      setSending(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const formatMessage = (text: string) => {
    const parts = text.split(/(```[\s\S]*?```)/g);
    return parts.map((part, i) => {
      if (part.startsWith("```")) {
        const code = part.replace(/^```\w*\n?/, "").replace(/\n?```$/, "");
        return (
          <div key={i} className="mt-2 rounded-lg overflow-hidden border border-white/10">
            <div className="bg-[#1e1e2e] px-3 py-1.5 flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            </div>
            <pre className="bg-[#1e1e2e] p-3 text-xs text-green-300 font-mono overflow-x-auto whitespace-pre">{code}</pre>
          </div>
        );
      }
      return <span key={i} className="whitespace-pre-wrap">{part}</span>;
    });
  };

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 100px)" }}>
      {/* Header */}
      <div className="shrink-0 mb-3 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">AI Learning Assistant</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Powered by GPT-4o-mini · Ask anything about programming</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showArchive} onOpenChange={setShowArchive}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleViewArchive}
                className="text-muted-foreground"
              >
                <Archive className="w-4 h-4 mr-2" />
                View Archive
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Archive className="w-5 h-5" />
                  Archived Conversations
                </DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[60vh] pr-4">
                {loadingArchive ? (
                  <div className="flex justify-center py-10">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : archivedMessages.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <Archive className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No archived messages yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {archivedMessages.map((m, i) => (
                      <div key={m.id || i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                        {m.role === "ai" && (
                          <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center shrink-0 mt-0.5">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <div className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                          m.role === "user"
                            ? "gradient-primary text-white rounded-tr-sm"
                            : "bg-muted/60 text-foreground rounded-tl-sm"
                        }`}>
                          <div className="text-xs opacity-70 mb-1">
                            {new Date(m.created_at).toLocaleString()}
                          </div>
                          {m.role === "ai" ? formatMessage(m.message) : m.message}
                        </div>
                        {m.role === "user" && (
                          <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center shrink-0 mt-0.5">
                            <User className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </DialogContent>
          </Dialog>
          {messages.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClearChat}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Chat
            </Button>
          )}
        </div>
      </div>

      {/* Suggestions */}
      <div className="shrink-0 flex flex-wrap gap-2 mb-3">
        {SUGGESTIONS.map(s => (
          <button key={s} onClick={() => send(s)} disabled={sending}
            className="text-xs px-3 py-1.5 rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-colors disabled:opacity-40">
            {s}
          </button>
        ))}
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto rounded-2xl border border-border bg-card p-4 space-y-4 min-h-0">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-10">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="font-semibold">Hi, I'm your AI tutor!</p>
              <p className="text-sm text-muted-foreground mt-1">Ask me anything about programming or your courses.</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Powered by GPT-4o-mini</span>
            </div>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={m.id || i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role === "ai" && (
                <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                m.role === "user"
                  ? "gradient-primary text-white rounded-tr-sm"
                  : "bg-muted/60 text-foreground rounded-tl-sm"
              }`}>
                {m.role === "ai" ? formatMessage(m.message) : m.message}
              </div>
              {m.role === "user" && (
                <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))
        )}

        {sending && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-muted/60 px-4 py-3.5 rounded-2xl rounded-tl-sm flex gap-1.5 items-center">
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input — always visible at bottom */}
      <div className="shrink-0 flex gap-2 mt-3 pb-2">
        <Input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Ask a programming question..."
          className="h-11 bg-card border-border text-foreground placeholder:text-muted-foreground"
          disabled={sending}
          autoComplete="off"
        />
        <Button onClick={() => send()} disabled={!input.trim() || sending}
          className="gradient-primary text-white border-0 h-11 px-4 shrink-0">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default AIAssistant;
