import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Sparkles, Loader2, BookOpen, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Mistake {
  id: string;
  topic: string;
  category: string;
  question: string;
  yourAnswer: string;
  correctAnswer: string;
  notes?: string;
  createdAt: string;
}

const KEY = "mistake-notebook";
const CATEGORIES = ["Aptitude", "Reasoning", "Verbal", "Coding", "DBMS", "OS", "CN", "HR", "Other"];

const MistakeNotebook = () => {
  const [items, setItems] = useState<Mistake[]>([]);
  const [revision, setRevision] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ topic: "", category: "Aptitude", question: "", yourAnswer: "", correctAnswer: "", notes: "" });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem(KEY) || "[]")); } catch {}
  }, []);

  const save = (next: Mistake[]) => {
    setItems(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };

  const addItem = () => {
    if (!form.question.trim() || !form.correctAnswer.trim()) {
      toast.error("Question and correct answer are required");
      return;
    }
    const m: Mistake = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...form };
    save([m, ...items]);
    setForm({ topic: "", category: "Aptitude", question: "", yourAnswer: "", correctAnswer: "", notes: "" });
    setOpen(false);
    toast.success("Added to your Mistake Notebook");
  };

  const remove = (id: string) => save(items.filter((i) => i.id !== id));

  const generateRevision = async () => {
    if (items.length === 0) { toast.error("Add some mistakes first"); return; }
    setLoading(true);
    setRevision("");
    try {
      const summary = items.slice(0, 15).map((m, i) =>
        `${i + 1}. [${m.category}] ${m.question}\n   Wrong: ${m.yourAnswer || "(skipped)"}\n   Correct: ${m.correctAnswer}`
      ).join("\n\n");
      const { data, error } = await supabase.functions.invoke("topic-chat", {
        body: {
          messages: [{
            role: "user",
            content: `I made these mistakes while preparing for placements. Generate a smart revision set: identify weak concepts, give a 5-point concept refresher, 5 NEW practice questions with answers, and 3 memory tricks. Be concise and use markdown.\n\n${summary}`,
          }],
          topic: "Mistake Revision",
          module: "mistake-notebook",
          action: "chat",
        },
      });
      if (error) throw error;
      setRevision(data?.content || data?.response || "");
    } catch (e) {
      toast.error("Couldn't generate revision");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-12 px-4 container mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-sm font-medium mb-2">
                <AlertCircle className="w-4 h-4" /> Mistake Notebook
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold">Learn from every mistake</h1>
              <p className="text-muted-foreground mt-1">Track wrong answers, weak concepts, and let AI build a personalized revision plan.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={generateRevision} disabled={loading || items.length === 0}>
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                AI Revision Set
              </Button>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button><Plus className="w-4 h-4 mr-2" /> Add Mistake</Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader><DialogTitle>Log a mistake</DialogTitle></DialogHeader>
                  <div className="space-y-3">
                    <Input placeholder="Topic (e.g. Time & Work)" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} />
                    <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                      value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                      {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                    <Textarea placeholder="Question *" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
                    <Input placeholder="Your wrong answer" value={form.yourAnswer} onChange={(e) => setForm({ ...form, yourAnswer: e.target.value })} />
                    <Input placeholder="Correct answer *" value={form.correctAnswer} onChange={(e) => setForm({ ...form, correctAnswer: e.target.value })} />
                    <Textarea placeholder="Notes (optional)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                    <Button className="w-full" onClick={addItem}>Save</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {revision && (
            <Card className="mb-6 border-primary/30 bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="w-4 h-4 text-primary" /> AI Revision Set
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown>{revision}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          )}

          {items.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-16 text-center text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p className="font-medium">Your notebook is empty</p>
                <p className="text-sm mt-1">Add a mistake to start tracking weak concepts.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {items.map((m) => (
                <Card key={m.id} className="hover:shadow-medium transition-shadow">
                  <CardHeader className="pb-2 flex flex-row items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary">{m.category}</Badge>
                        {m.topic && <span className="text-xs text-muted-foreground">{m.topic}</span>}
                      </div>
                      <CardTitle className="text-sm font-medium">{m.question}</CardTitle>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => remove(m.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </CardHeader>
                  <CardContent className="text-sm space-y-1.5 pt-0">
                    {m.yourAnswer && <p><span className="text-destructive font-medium">Wrong:</span> {m.yourAnswer}</p>}
                    <p><span className="text-emerald-600 font-medium">Correct:</span> {m.correctAnswer}</p>
                    {m.notes && <p className="text-muted-foreground text-xs italic">{m.notes}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default MistakeNotebook;
