import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles, BookOpen, Play, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

interface Props {
  module: string;
  title: string;
  onStart: () => void;
  cacheKey?: string;
}

export const PreTestRevision = ({ module, title, onStart, cacheKey }: Props) => {
  const [notes, setNotes] = useState<string>(() => {
    if (!cacheKey) return "";
    return localStorage.getItem(`revision-${cacheKey}`) || "";
  });
  const [loading, setLoading] = useState(false);
  const [showNotes, setShowNotes] = useState(!!notes);

  const generate = async () => {
    setShowNotes(true);
    if (notes) return;
    setLoading(true);
    try {
      const prompt = `Create a concise, exam-ready quick revision for "${title}" (${module}).
Format strictly in Markdown with:
## 🎯 Key Concepts (bullet list, 5-8 items)
## 📐 Important Formulas / Rules (concise list with formula boxes)
## ⚡ Shortcut Tips & Tricks (3-5 high-yield tips)
## ⚠️ Common Pitfalls (3 traps students fall into)
## 🧠 Quick Examples (2 short worked examples with answer)
Keep it under 400 words. Target Indian placement aspirants (TCS, Infosys, Wipro, Cognizant).`;

      const resp = await supabase.functions.invoke("topic-chat", {
        body: { messages: [{ role: "user", content: prompt }], module, topic: title, action: "revision" },
      });
      const reader = resp.data as ReadableStream;
      let full = "";
      if (reader && typeof reader.getReader === "function") {
        const r = reader.getReader();
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await r.read();
          if (done) break;
          const chunk = decoder.decode(value);
          for (const line of chunk.split("\n")) {
            if (line.startsWith("data: ") && line !== "data: [DONE]") {
              try {
                const j = JSON.parse(line.slice(6));
                full += j.choices?.[0]?.delta?.content || "";
                setNotes(full);
              } catch {}
            }
          }
        }
      } else {
        full = resp.data?.response || resp.data?.content || "";
        setNotes(full);
      }
      if (full && cacheKey) localStorage.setItem(`revision-${cacheKey}`, full);
    } catch (e) {
      console.error(e);
      setNotes("# Quick Revision\n\nCould not generate revision notes — but you can still start the test!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary"><Sparkles className="w-5 h-5" /></div>
            <div>
              <CardTitle className="text-xl">Ready for {title}?</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">Review key concepts before you begin — or jump straight in.</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!showNotes ? (
            <div className="grid md:grid-cols-2 gap-4">
              <button onClick={generate} className="text-left p-5 rounded-xl border-2 border-primary/30 bg-card hover:border-primary hover:shadow-md transition-all group">
                <div className="flex items-center gap-2 text-primary mb-2"><BookOpen className="w-5 h-5" /><span className="font-semibold">Quick Revision First</span></div>
                <p className="text-sm text-muted-foreground">AI-generated summary with key formulas, shortcuts and common traps.</p>
                <span className="inline-flex items-center gap-1 text-xs text-primary mt-3 font-medium group-hover:gap-2 transition-all">Recommended →</span>
              </button>
              <button onClick={onStart} className="text-left p-5 rounded-xl border-2 border-border bg-card hover:border-foreground/30 hover:shadow-md transition-all">
                <div className="flex items-center gap-2 text-foreground mb-2"><Play className="w-5 h-5" /><span className="font-semibold">Start Test Directly</span></div>
                <p className="text-sm text-muted-foreground">Skip revision and begin the test right away.</p>
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-foreground flex items-center gap-1"><BookOpen className="w-4 h-4" /> Quick Revision Notes</span>
                <Button variant="ghost" size="sm" onClick={() => setShowNotes(false)} className="h-7 gap-1 text-xs"><X className="w-3 h-3" /> Hide</Button>
              </div>
              <div className="rounded-lg border border-border bg-card p-4 max-h-[50vh] overflow-y-auto prose prose-sm max-w-none dark:prose-invert prose-headings:text-foreground prose-strong:text-foreground prose-p:text-foreground/90 prose-li:text-foreground/90">
                {loading && !notes ? (
                  <div className="flex items-center gap-2 text-muted-foreground py-6 justify-center"><Loader2 className="w-4 h-4 animate-spin" /> Generating revision notes...</div>
                ) : (
                  <ReactMarkdown>{notes}</ReactMarkdown>
                )}
              </div>
              <div className="flex justify-end mt-4">
                <Button onClick={onStart} disabled={loading && !notes} size="lg" className="gap-2">
                  <Play className="w-4 h-4" /> I'm Ready — Start Test
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
