import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAIChat } from "@/lib/hooks/useDashboard";

const SUGGESTIONS = [
  "Explain Binary Search",
  "What is recursion?",
  "Difference between let and const",
  "How does React useEffect work?",
  "What is Big O notation?",
];

const getAIResponse = (message: string): string => {
  const msg = message.toLowerCase();
  if (msg.includes("binary search"))
    return "Binary search finds a target in a sorted array by halving the search space each step. Time complexity: O(log n).";
  if (msg.includes("recursion"))
    return "Recursion is when a function calls itself. It needs a base case to stop and a recursive case to continue. Example: factorial(n) = n * factorial(n-1).";
  if (msg.includes("let") && msg.includes("const"))
    return "`let` allows reassignment and is block-scoped. `const` is block-scoped but cannot be reassigned. Both are preferred over `var`.";
  if (msg.includes("useeffect"))
    return "useEffect runs side effects after render. Pass `[]` to run once on mount, or `[value]` to run when value changes. Return a cleanup function to avoid memory leaks.";
  if (msg.includes("big o"))
    return "Big O describes algorithm efficiency: O(1) constant, O(log n) logarithmic, O(n) linear, O(n^2) quadratic. Lower is better.";
  if (msg.includes("array"))
    return "Arrays store elements in order. Access is O(1), search is O(n), insert/delete is O(n). JavaScript arrays are dynamic.";
  if (msg.includes("react"))
    return "React is a UI library using components, JSX, props, state, and hooks. The virtual DOM makes updates efficient.";
  return `Great question about "${message}"! Break it into smaller concepts, practice with examples, and check your course modules on this topic.`;
};

const AIAssistant = ({ user }: { user: any }) => {
  const { messages, loading, saveMessage } = useAIChat(user.id);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const send = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || sending) return;
    setInput("");
    setSending(true);
    await saveMessage("user", msg);
    await new Promise(r => setTimeout(r, 600));
    const reply = getAIResponse(msg);
    await saveMessage("ai", reply);
    setSending(false);
  };

  return (
    <div className="space-y-4 flex flex-col h-full">
      <div>
        <h1 className="text-2xl font-bold">AI Learning Assistant</h1>
        <p className="text-muted-foreground mt-1">Ask anything about your courses or topics</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map(s => (
          <button key={s} onClick={() => send(s)}
            className="text-xs px-3 py-1.5 rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-colors">
            {s}
          </button>
        ))}
      </div>

      <Card className="border-border/50 flex-1 flex flex-col">
        <CardHeader className="pb-3 shrink-0">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" /> Chat
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col flex-1 p-4 pt-0 min-h-0">
          <div className="flex-1 overflow-y-auto space-y-4 min-h-[300px] max-h-[420px] pr-1">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-10">
                <Bot className="w-12 h-12 text-primary/40" />
                <p className="text-sm text-muted-foreground">Ask me anything about your courses!</p>
              </div>
            ) : (
              messages.map((m, i) => (
                <div key={m.id || i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  {m.role === "ai" && (
                    <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-primary-foreground" />
                    </div>
                  )}
                  <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    m.role === "user"
                      ? "gradient-primary text-primary-foreground rounded-tr-sm"
                      : "bg-muted/60 text-foreground rounded-tl-sm"
                  }`}>
                    {m.message}
                  </div>
                  {m.role === "user" && (
                    <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))
            )}
            {sending && (
              <div className="flex gap-3 justify-start">
                <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
                <div className="bg-muted/60 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="flex gap-2 mt-4 shrink-0">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Ask a question..."
              className="bg-muted/50"
              disabled={sending}
            />
            <Button onClick={() => send()} disabled={!input.trim() || sending}
              className="gradient-primary text-primary-foreground border-0 shrink-0">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistant;
