import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { FacultyData } from "@/lib/facultyAnalytics";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Sparkles, Activity, Lightbulb, Loader2, HeartPulse, ListChecks,
  AlertTriangle, Building2, RefreshCw,
} from "lucide-react";

interface Props {
  data: FacultyData;
}

const PRIORITY_STYLE: Record<string, string> = {
  high: "bg-destructive/15 text-destructive border-destructive/30",
  medium: "bg-amber-500/15 text-amber-600 border-amber-500/30",
  low: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
};

export const FacultyAIInsights = ({ data }: Props) => {
  const [health, setHealth] = useState<any>(null);
  const [recs, setRecs] = useState<any>(null);
  const [loading, setLoading] = useState<string | null>(null);

  // Build a compact, anonymized payload for the AI
  const buildPayload = () => ({
    totals: data.totals,
    bandCounts: data.bandCounts,
    departments: data.depts,
    subjectCoverage: data.subjectCompletion,
    topPerformers: data.topPerformers.map((s) => ({ name: s.full_name, readiness: s.readiness, dept: s.department })),
    atRisk: data.atRisk.map((s) => ({ name: s.full_name, readiness: s.readiness, weak: s.weakSubjects.map((w) => w.name) })),
    weakSubjects: data.subjectCompletion.filter((s) => s.rate < 40).map((s) => s.name),
  });

  const run = async (mode: "batch_health" | "recommendations") => {
    if (data.totals.students === 0) {
      toast.error("No student data available to analyze yet.");
      return;
    }
    setLoading(mode);
    try {
      const { data: res, error } = await supabase.functions.invoke("faculty-ai-insights", {
        body: { mode, data: buildPayload() },
      });
      if (error) throw error;
      if (res?.error) throw new Error(res.error);
      if (mode === "batch_health") setHealth(res);
      else setRecs(res);
      toast.success("AI analysis ready");
    } catch (e: any) {
      toast.error(e.message || "Analysis failed");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Batch Health Report */}
      <Card className="glass-card border-primary/20 overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-transparent p-5 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center">
              <HeartPulse className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground flex items-center gap-2">AI Batch Health Report <Sparkles className="w-4 h-4 text-amber-500" /></h3>
              <p className="text-xs text-muted-foreground">Real-time AI diagnosis of your batch's placement health</p>
            </div>
          </div>
          <Button onClick={() => run("batch_health")} disabled={loading === "batch_health"} className="gap-2">
            {loading === "batch_health" ? <Loader2 className="w-4 h-4 animate-spin" /> : health ? <RefreshCw className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
            {health ? "Regenerate" : "Generate Report"}
          </Button>
        </div>
        {health && (
          <CardContent className="pt-5 space-y-4">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 flex-wrap">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-20 h-20 -rotate-90"><circle cx="40" cy="40" r="34" fill="none" stroke="hsl(var(--muted))" strokeWidth="7" /><circle cx="40" cy="40" r="34" fill="none" stroke="hsl(var(--primary))" strokeWidth="7" strokelinecap="round" strokeDasharray={`${(health.health_score / 100) * 213} 213`} /></svg>
                <span className="absolute text-lg font-bold">{health.health_score}</span>
              </div>
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-primary/15 text-primary border-0 text-base px-3">Grade {health.grade}</Badge>
                </div>
                <p className="font-semibold text-foreground">{health.headline}</p>
                <p className="text-sm text-muted-foreground">{health.summary}</p>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-lg bg-emerald-500/5 p-3 border border-emerald-500/15">
                <p className="text-xs font-semibold text-emerald-600 mb-2 uppercase">Strengths</p>
                <ul className="space-y-1">{health.strengths?.map((s: string, i: number) => <li key={i} className="text-sm text-foreground flex gap-2"><span className="text-emerald-500">+</span>{s}</li>)}</ul>
              </div>
              <div className="rounded-lg bg-destructive/5 p-3 border border-destructive/15">
                <p className="text-xs font-semibold text-destructive mb-2 uppercase">Risks</p>
                <ul className="space-y-1">{health.risks?.map((s: string, i: number) => <li key={i} className="text-sm text-foreground flex gap-2"><span className="text-destructive">!</span>{s}</li>)}</ul>
              </div>
            </div>

            {health.weak_topics?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase">Topics To Revise</p>
                <div className="flex flex-wrap gap-2">{health.weak_topics.map((t: string, i: number) => <Badge key={i} variant="outline" className="border-amber-500/30 text-amber-600">{t}</Badge>)}</div>
              </div>
            )}

            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase">AI Recommendations</p>
              {health.recommendations?.map((r: any, i: number) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/40">
                  <Badge variant="outline" className={`${PRIORITY_STYLE[r.priority]} shrink-0 capitalize`}>{r.priority}</Badge>
                  <div><p className="text-sm font-medium text-foreground">{r.action}</p><p className="text-xs text-muted-foreground">{r.impact}</p></div>
                </div>
              ))}
            </div>

            <div className="rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 p-3 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <p className="text-sm text-foreground"><span className="font-semibold">Forecast: </span>{health.forecast}</p>
            </div>
          </CardContent>
        )}
        {!health && loading !== "batch_health" && (
          <CardContent className="py-8 text-center text-sm text-muted-foreground">Generate an AI health report to see strengths, risks, weak topics, and a placement forecast.</CardContent>
        )}
      </Card>

      {/* AI Recommendation Engine */}
      <Card className="glass-card border-secondary/20 overflow-hidden">
        <div className="bg-gradient-to-r from-secondary/10 to-transparent p-5 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-secondary/15 flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">AI Recommendation Engine</h3>
              <p className="text-xs text-muted-foreground">Who needs help, what to revise, which companies students are ready for</p>
            </div>
          </div>
          <Button variant="secondary" onClick={() => run("recommendations")} disabled={loading === "recommendations"} className="gap-2">
            {loading === "recommendations" ? <Loader2 className="w-4 h-4 animate-spin" /> : <ListChecks className="w-4 h-4" />}
            {recs ? "Regenerate" : "Get Recommendations"}
          </Button>
        </div>
        {recs && (
          <CardContent className="pt-5 grid lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-destructive uppercase flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> Students Needing Help</p>
              {recs.students_needing_help?.map((s: any, i: number) => (
                <div key={i} className="p-3 rounded-lg bg-destructive/5 border border-destructive/15">
                  <p className="text-sm font-medium text-foreground">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.reason}</p>
                  <p className="text-xs text-primary mt-1">→ {s.action}</p>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-amber-600 uppercase mb-2">Topics To Revise</p>
                <div className="flex flex-wrap gap-2">{recs.topics_to_revise?.map((t: string, i: number) => <Badge key={i} variant="outline" className="border-amber-500/30 text-amber-600">{t}</Badge>)}</div>
              </div>
              <div>
                <p className="text-xs font-semibold text-primary uppercase mb-2 flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> Company Readiness</p>
                <div className="space-y-1.5">{recs.company_readiness?.map((c: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-sm p-2 rounded bg-muted/40">
                    <span className="font-medium">{c.company}</span>
                    <Badge className="bg-emerald-500/15 text-emerald-600 border-0">{c.ready_count} ready</Badge>
                  </div>
                ))}</div>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Next Best Actions</p>
                <ul className="space-y-1">{recs.next_best_actions?.map((a: string, i: number) => <li key={i} className="text-sm text-foreground flex gap-2"><span className="text-primary">{i + 1}.</span>{a}</li>)}</ul>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};
