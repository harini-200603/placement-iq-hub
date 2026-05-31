import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { FacultyData, StudentRow, BAND_COLORS } from "@/lib/facultyAnalytics";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, Loader2, Search, Sparkles, Target, TrendingUp,
  AlertCircle, CheckCircle2, Building2, CalendarClock, Compass,
} from "lucide-react";

export const FacultyStudentAnalyzer = ({ data }: { data: FacultyData }) => {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<StudentRow | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const filtered = data.students
    .filter((s) => s.full_name.toLowerCase().includes(q.toLowerCase()) || (s.department || "").toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => a.readiness - b.readiness);

  const analyze = async (s: StudentRow) => {
    setSelected(s);
    setAnalysis(null);
    setLoading(true);
    try {
      const { data: res, error } = await supabase.functions.invoke("faculty-ai-insights", {
        body: {
          mode: "student_analysis",
          data: {
            name: s.full_name,
            department: s.department,
            topicsCompleted: s.topicsCompleted,
            testsTaken: s.testsTaken,
            avgScore: s.avgScore,
            readiness: s.readiness,
            weakSubjects: s.weakSubjects.map((w) => ({ subject: w.name, score: Math.round(w.avg) })),
          },
        },
      });
      if (error) throw error;
      if (res?.error) throw new Error(res.error);
      setAnalysis(res);
    } catch (e: any) {
      toast.error(e.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      {/* Student list */}
      <Card className="lg:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><Brain className="w-4 h-4 text-primary" /> AI Student Analyzer</CardTitle>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search students or departments..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent className="space-y-2 max-h-[560px] overflow-auto">
          {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">No students found.</p>}
          {filtered.map((s) => (
            <button key={s.user_id} onClick={() => analyze(s)}
              className={`w-full text-left p-3 rounded-lg border transition-all ${selected?.user_id === s.user_id ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/30"}`}>
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{s.full_name}</p>
                  <p className="text-[11px] text-muted-foreground">{s.department || "—"}</p>
                </div>
                <Badge style={{ background: `${BAND_COLORS[s.band]}22`, color: BAND_COLORS[s.band] }} className="border-0 shrink-0">{s.readiness}%</Badge>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Analysis panel */}
      <Card className="lg:col-span-3 min-h-[300px]">
        <CardContent className="p-5">
          {!selected && (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 text-muted-foreground">
              <Brain className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-sm">Select a student to generate a deep AI analysis</p>
            </div>
          )}
          {selected && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-primary/15 flex items-center justify-center font-bold text-primary">{selected.full_name.charAt(0)}</div>
                <div>
                  <p className="font-semibold text-foreground">{selected.full_name}</p>
                  <p className="text-xs text-muted-foreground">{selected.department || "—"} · {selected.topicsCompleted} topics · {selected.testsTaken} tests</p>
                </div>
              </div>

              {loading && (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                  <p className="text-sm">AI is analyzing performance...</p>
                </div>
              )}

              <AnimatePresence>
                {analysis && !loading && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-primary">{analysis.placement_probability}%</p>
                        <p className="text-[10px] text-muted-foreground">placement prob.</p>
                      </div>
                      <div className="flex-1">
                        <Badge className="bg-primary/15 text-primary border-0 mb-1">{analysis.band}</Badge>
                        <p className="text-sm text-foreground">{analysis.verdict}</p>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="rounded-lg bg-emerald-500/5 p-3 border border-emerald-500/15">
                        <p className="text-xs font-semibold text-emerald-600 mb-1.5 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Strengths</p>
                        <ul className="space-y-1">{analysis.strengths?.map((s: string, i: number) => <li key={i} className="text-xs text-foreground">• {s}</li>)}</ul>
                      </div>
                      <div className="rounded-lg bg-destructive/5 p-3 border border-destructive/15">
                        <p className="text-xs font-semibold text-destructive mb-1.5 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> Learning Gaps</p>
                        <ul className="space-y-1">{analysis.learning_gaps?.map((s: string, i: number) => <li key={i} className="text-xs text-foreground">• {s}</li>)}</ul>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> Ready For</p>
                      <div className="flex flex-wrap gap-2">{analysis.ready_companies?.length ? analysis.ready_companies.map((c: string, i: number) => <Badge key={i} className="bg-secondary/15 text-secondary border-0">{c}</Badge>) : <span className="text-xs text-muted-foreground">Not yet ready for target companies</span>}</div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1"><CalendarClock className="w-3.5 h-3.5" /> Personalized Improvement Plan</p>
                      <div className="space-y-2">{analysis.improvement_plan?.map((p: any, i: number) => (
                        <div key={i} className="flex gap-3 p-2 rounded-lg bg-muted/40">
                          <Badge variant="outline" className="shrink-0 h-fit">{p.week}</Badge>
                          <div><p className="text-sm font-medium text-foreground">{p.focus}</p><p className="text-xs text-muted-foreground">{p.goal}</p></div>
                        </div>
                      ))}</div>
                    </div>

                    <div className="rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 p-3 flex items-start gap-2">
                      <Compass className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <p className="text-sm text-foreground"><span className="font-semibold">Career advice: </span>{analysis.career_advice}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
