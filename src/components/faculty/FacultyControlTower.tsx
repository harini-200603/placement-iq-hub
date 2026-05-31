import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FacultyData, BAND_COLORS } from "@/lib/facultyAnalytics";
import { motion } from "framer-motion";
import {
  ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell,
  PieChart, Pie, Legend,
} from "recharts";
import {
  Radar, Trophy, AlertTriangle, Building2, TrendingUp, Crown, Flame,
} from "lucide-react";

interface Props {
  data: FacultyData;
  companies?: { name: string; minReadiness: number }[];
}

const DEFAULT_COMPANIES = [
  { name: "TCS", minReadiness: 45 },
  { name: "Infosys", minReadiness: 50 },
  { name: "Wipro", minReadiness: 48 },
  { name: "Cognizant", minReadiness: 55 },
  { name: "Accenture", minReadiness: 60 },
  { name: "Capgemini", minReadiness: 58 },
  { name: "Amazon", minReadiness: 80 },
  { name: "Microsoft", minReadiness: 85 },
];

export const FacultyControlTower = ({ data, companies = DEFAULT_COMPANIES }: Props) => {
  const { students, depts, subjectCompletion, bandCounts, totals, topPerformers, atRisk } = data;

  const bandData = (Object.keys(bandCounts) as (keyof typeof bandCounts)[]).map((k) => ({
    name: k, value: bandCounts[k], fill: BAND_COLORS[k],
  }));

  const eligibility = companies.map((c) => ({
    name: c.name,
    eligible: students.filter((s) => s.readiness >= c.minReadiness).length,
  }));

  const forecastPct = totals.students
    ? Math.round(((bandCounts.Ready + bandCounts.Almost * 0.6) / totals.students) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* College readiness gauge + forecast */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="glass-card border-primary/20 lg:col-span-1">
          <CardHeader className="pb-1">
            <CardTitle className="text-sm flex items-center gap-2">
              <Radar className="w-4 h-4 text-primary" /> College Readiness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-44">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart innerRadius="72%" outerRadius="100%" data={[{ value: totals.avgReadiness, fill: "hsl(var(--primary))" }]} startAngle={90} endAngle={-270}>
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar dataKey="value" cornerRadius={20} background={{ fill: "hsl(var(--muted))" }} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-foreground">{totals.avgReadiness}%</span>
                <span className="text-xs text-muted-foreground">avg readiness</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card lg:col-span-2 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-6 flex flex-col justify-center h-full">
            <div className="flex items-center gap-2 mb-2 text-primary">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase tracking-wide">Placement Forecast</span>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">
              ~{forecastPct}% projected placement
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Based on current readiness trajectory of {totals.students} students.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {bandData.map((b) => (
                <div key={b.name} className="rounded-xl bg-card/60 p-3 border border-border/50">
                  <div className="w-2.5 h-2.5 rounded-full mb-1" style={{ background: b.fill }} />
                  <p className="text-xl font-bold text-foreground">{b.value}</p>
                  <p className="text-[11px] text-muted-foreground">{b.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department comparison + band distribution */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" /> Department-wise Readiness
            </CardTitle>
          </CardHeader>
          <CardContent>
            {depts.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No department data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={Math.max(180, depts.length * 46)}>
                <BarChart data={depts} layout="vertical" margin={{ left: 8, right: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="department" width={90} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                    formatter={(v: number, _n, p: any) => [`${v}% · ${p.payload.students} students`, "Readiness"]}
                  />
                  <Bar dataKey="avgReadiness" radius={[0, 6, 6, 0]}>
                    {depts.map((d, i) => (
                      <Cell key={i} fill={d.avgReadiness >= 60 ? "hsl(160 60% 45%)" : d.avgReadiness >= 40 ? "hsl(220 70% 50%)" : "hsl(0 75% 55%)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Readiness Bands</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={bandData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {bandData.map((b, i) => <Cell key={i} fill={b.fill} />)}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Company eligibility mapping */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="w-4 h-4 text-secondary" /> Company Eligibility Mapping
          </CardTitle>
          <p className="text-xs text-muted-foreground">Students currently meeting each recruiter's readiness threshold</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={eligibility} margin={{ left: 0, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="eligible" radius={[6, 6, 0, 0]} fill="hsl(var(--secondary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Subject revision heatmap */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Flame className="w-4 h-4 text-accent" /> Topic Coverage Heatmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {subjectCompletion.map((s) => {
              const hue = s.rate >= 66 ? 160 : s.rate >= 33 ? 38 : 0;
              return (
                <div key={s.name} className="rounded-lg p-3 border border-border/40" style={{ background: `hsl(${hue} 70% 50% / ${0.12 + (s.rate / 100) * 0.35})` }}>
                  <p className="text-xs font-medium text-foreground truncate">{s.name}</p>
                  <p className="text-lg font-bold text-foreground">{s.rate}%</p>
                  <p className="text-[10px] text-muted-foreground">{s.active} active</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Top performers + at risk */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-emerald-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-500" /> Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {topPerformers.length === 0 && <p className="text-sm text-muted-foreground py-4 text-center">No data yet.</p>}
            {topPerformers.map((s, i) => (
              <motion.div key={s.user_id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-2 rounded-lg bg-muted/40">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-amber-400 text-amber-950" : "bg-primary/15 text-primary"}`}>{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{s.full_name}</p>
                  <p className="text-[11px] text-muted-foreground">{s.department || "—"} · {s.topicsCompleted} topics</p>
                </div>
                <Badge className="bg-emerald-500/15 text-emerald-600 border-0">{s.readiness}%</Badge>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-destructive/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-destructive" /> At-Risk Students
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {atRisk.length === 0 && <p className="text-sm text-muted-foreground py-4 text-center">No at-risk students 🎉</p>}
            {atRisk.map((s) => (
              <div key={s.user_id} className="flex items-center gap-3 p-2 rounded-lg bg-destructive/5">
                <div className="w-8 h-8 rounded-full bg-destructive/15 flex items-center justify-center text-destructive font-semibold text-xs">{s.full_name.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{s.full_name}</p>
                  <Progress value={s.readiness} className="h-1.5 mt-1" />
                </div>
                <span className="text-xs font-mono text-destructive">{s.readiness}%</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
