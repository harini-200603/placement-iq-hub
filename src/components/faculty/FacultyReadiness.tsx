import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Loader2, Target, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface StudentReadiness {
  user_id: string;
  name: string;
  topicsCompleted: number;
  avgScore: number;
  readiness: number; // 0-100
  band: "Ready" | "Almost" | "Needs Work" | "At Risk";
}

export const FacultyReadiness = () => {
  const [rows, setRows] = useState<StudentReadiness[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [{ data: profiles }, { data: progress }] = await Promise.all([
        supabase.from("profiles").select("user_id, full_name").eq("role", "student"),
        supabase.from("student_progress").select("user_id, quiz_score, quiz_total, status"),
      ]);

      const byUser = new Map<string, { sum: number; count: number; done: number }>();
      (progress || []).forEach((p) => {
        const cur = byUser.get(p.user_id) || { sum: 0, count: 0, done: 0 };
        if (p.quiz_score != null && p.quiz_total) {
          cur.sum += (p.quiz_score / p.quiz_total) * 100;
          cur.count += 1;
        }
        if (p.status === "completed") cur.done += 1;
        byUser.set(p.user_id, cur);
      });

      const computed: StudentReadiness[] = (profiles || []).map((p) => {
        const s = byUser.get(p.user_id) || { sum: 0, count: 0, done: 0 };
        const avg = s.count > 0 ? s.sum / s.count : 0;
        // Readiness = 60% avg score weight + 40% topic coverage weight (capped at 30 topics)
        const coverage = Math.min(s.done, 30) / 30 * 100;
        const readiness = Math.round(avg * 0.6 + coverage * 0.4);
        const band: StudentReadiness["band"] =
          readiness >= 75 ? "Ready" : readiness >= 55 ? "Almost" : readiness >= 35 ? "Needs Work" : "At Risk";
        return { user_id: p.user_id, name: p.full_name || "Student", topicsCompleted: s.done, avgScore: Math.round(avg), readiness, band };
      }).sort((a, b) => b.readiness - a.readiness);

      setRows(computed);
      setLoading(false);
    };
    load();
  }, []);

  const counts = {
    Ready: rows.filter(r => r.band === "Ready").length,
    Almost: rows.filter(r => r.band === "Almost").length,
    "Needs Work": rows.filter(r => r.band === "Needs Work").length,
    "At Risk": rows.filter(r => r.band === "At Risk").length,
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="w-4 h-4 text-primary" /> Company Readiness Prediction
          </CardTitle>
          <p className="text-xs text-muted-foreground">AI-blended score from quiz performance and topic coverage</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
              <div className="flex items-center gap-1 text-xs text-emerald-700 font-medium"><CheckCircle2 className="w-3 h-3" /> Placement-Ready</div>
              <div className="text-2xl font-bold">{counts.Ready}</div>
            </div>
            <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-3">
              <div className="flex items-center gap-1 text-xs text-blue-700 font-medium"><TrendingUp className="w-3 h-3" /> Almost There</div>
              <div className="text-2xl font-bold">{counts.Almost}</div>
            </div>
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
              <div className="flex items-center gap-1 text-xs text-amber-700 font-medium">Needs Work</div>
              <div className="text-2xl font-bold">{counts["Needs Work"]}</div>
            </div>
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
              <div className="flex items-center gap-1 text-xs text-destructive font-medium"><AlertTriangle className="w-3 h-3" /> At Risk</div>
              <div className="text-2xl font-bold">{counts["At Risk"]}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">Student Readiness Ranking</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {rows.length === 0 && <p className="text-sm text-muted-foreground py-6 text-center">No student data yet.</p>}
          {rows.slice(0, 25).map((r) => (
            <div key={r.user_id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-medium text-sm truncate">{r.name}</span>
                  <Badge variant={r.band === "Ready" ? "default" : r.band === "At Risk" ? "destructive" : "secondary"} className="text-[10px]">
                    {r.band}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={r.readiness} className="h-1.5 flex-1" />
                  <span className="text-xs font-mono w-10 text-right">{r.readiness}%</span>
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  {r.topicsCompleted} topics · {r.avgScore}% avg quiz
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
