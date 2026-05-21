import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Loader2, Bot, User, Sparkles, Code2, Briefcase, MessageCircleQuestion } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";

type Mode = "doubt" | "coding" | "interview" | "explain";
interface Message { role: "user" | "assistant"; content: string; }

const MODES: Record<Mode, { label: string; icon: any; system: string; placeholder: string; prompts: string[] }> = {
  doubt: {
    label: "Doubt Solver",
    icon: MessageCircleQuestion,
    system: "You are an expert placement tutor. Solve student doubts clearly with step-by-step explanations, examples, and INR/Indian-company context where helpful.",
    placeholder: "Ask any aptitude, reasoning, or concept doubt...",
    prompts: ["Explain time & work shortcuts", "Trick for percentages", "Difference between stack & queue", "What is normalization in DBMS?"],
  },
  coding: {
    label: "Coding Help",
    icon: Code2,
    system: "You are an expert coding mentor. Help students debug, optimize, and understand DSA. Always show clean code with comments, complexity analysis, and sample I/O.",
    placeholder: "Paste code, ask DSA question, or request approach...",
    prompts: ["Reverse a linked list in Java", "Find duplicate in array O(n)", "Explain dynamic programming", "Solve two-sum problem"],
  },
  interview: {
    label: "Interview Guide",
    icon: Briefcase,
    system: "You are an HR + technical interview coach for Indian placement (TCS, Infosys, Wipro, Amazon, etc.). Give STAR-format answers, behavioural tips, and company-specific guidance.",
    placeholder: "Ask HR/technical interview questions...",
    prompts: ["Tell me about yourself answer", "Why TCS?", "How to handle 'weakness' question?", "Salary negotiation tips for freshers"],
  },
  explain: {
    label: "Explain with Examples",
    icon: Sparkles,
    system: "You are an AI tutor who explains any concept with 3 clear examples, an analogy, and a quick check question. Use markdown.",
    placeholder: "Type any topic you want explained...",
    prompts: ["Polymorphism", "Recursion", "TCP vs UDP", "Bayes theorem"],
  },
};

const Mentor = () => {
  const [mode, setMode] = useState<Mode>("doubt");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMessages([]); }, [mode]);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const send = async (text?: string) => {
    const content = (text || input).trim();
    if (!content || loading) return;
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("topic-chat", {
        body: {
          messages: [{ role: "system", content: MODES[mode].system }, ...next],
          topic: MODES[mode].label,
          module: "mentor",
          action: "chat",
        },
      });
      if (error) throw error;
      const reply = data?.content || data?.response || "Sorry, no response.";
      setMessages((p) => [...p, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages((p) => [...p, { role: "assistant", content: "Couldn't reach AI. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const Icon = MODES[mode].icon;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-12 px-4 container mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
              <Sparkles className="w-4 h-4" /> AI Mentor
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Your 24/7 Placement Coach</h1>
            <p className="text-muted-foreground">Doubts, coding, interview prep — instant AI guidance with examples.</p>
          </div>

          <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)} className="mb-4">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full h-auto">
              {(Object.keys(MODES) as Mode[]).map((m) => {
                const M = MODES[m].icon;
                return (
                  <TabsTrigger key={m} value={m} className="flex items-center gap-2 py-2.5">
                    <M className="w-4 h-4" /> <span className="text-xs md:text-sm">{MODES[m].label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>

          <Card className="border-border shadow-soft overflow-hidden">
            <ScrollArea className="h-[55vh] p-4 bg-muted/20" ref={scrollRef}>
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <Icon className="w-12 h-12 mx-auto mb-3 text-primary/40" />
                  <p className="font-medium mb-1">Start chatting with {MODES[mode].label}</p>
                  <p className="text-xs text-muted-foreground mb-4">{MODES[mode].placeholder}</p>
                  <div className="flex flex-wrap gap-2 justify-center max-w-xl mx-auto">
                    {MODES[mode].prompts.map((p) => (
                      <button key={p} onClick={() => send(p)}
                        className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition">
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((m, i) => (
                    <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                      {m.role === "assistant" && (
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                          <Bot className="w-4 h-4 text-primary" />
                        </div>
                      )}
                      <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                        m.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border border-border"
                      }`}>
                        {m.role === "assistant" ? (
                          <div className="prose prose-sm max-w-none dark:prose-invert [&_p]:mb-1 [&_pre]:bg-muted [&_pre]:p-2 [&_pre]:rounded">
                            <ReactMarkdown>{m.content}</ReactMarkdown>
                          </div>
                        ) : m.content}
                      </div>
                      {m.role === "user" && (
                        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0 mt-1">
                          <User className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                  {loading && (
                    <div className="flex gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                      <div className="bg-card border border-border rounded-xl px-3 py-2">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
            <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2 p-3 border-t border-border bg-card">
              <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder={MODES[mode].placeholder} disabled={loading} />
              <Button type="submit" size="icon" disabled={loading || !input.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Mentor;
