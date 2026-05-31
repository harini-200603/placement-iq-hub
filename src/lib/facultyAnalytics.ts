import { supabase } from "@/integrations/supabase/client";
import { subjects } from "@/data/learningTopics";

export interface StudentRow {
  user_id: string;
  full_name: string;
  username: string;
  department: string | null;
  college: string | null;
  topicsCompleted: number;
  testsTaken: number;
  avgScore: number;
  readiness: number;
  band: "Ready" | "Almost" | "Needs Work" | "At Risk";
  weakSubjects: { name: string; avg: number }[];
  lastActive: string | null;
}

export interface DeptStat {
  department: string;
  students: number;
  avgReadiness: number;
  ready: number;
  atRisk: number;
}

export interface FacultyData {
  students: StudentRow[];
  depts: DeptStat[];
  subjectCompletion: { name: string; rate: number; active: number }[];
  bandCounts: { Ready: number; Almost: number; "Needs Work": number; "At Risk": number };
  totals: {
    students: number;
    activeLearners: number;
    avgReadiness: number;
    avgScore: number;
    testsTaken: number;
    learningHours: number;
    completionRate: number;
  };
  topPerformers: StudentRow[];
  atRisk: StudentRow[];
}

const bandOf = (r: number): StudentRow["band"] =>
  r >= 75 ? "Ready" : r >= 55 ? "Almost" : r >= 35 ? "Needs Work" : "At Risk";

export async function loadFacultyData(): Promise<FacultyData> {
  const [profilesRes, progressRes, attemptsRes] = await Promise.all([
    supabase.from("profiles").select("user_id, full_name, username, department, college").eq("role", "student"),
    supabase.from("student_progress").select("user_id, subject_id, topic_id, status, quiz_score, quiz_total, completed_at, updated_at, time_spent_seconds"),
    supabase.from("test_attempts").select("user_id, module, score, total_questions, completed_at"),
  ]);

  const profiles = profilesRes.data || [];
  const progress = (progressRes.data || []) as any[];
  const attempts = (attemptsRes.data || []) as any[];

  const totalTopics = subjects.reduce((s, sub) => s + sub.topics.length, 0);
  let totalSeconds = 0;

  const students: StudentRow[] = profiles.map((p) => {
    const sp = progress.filter((x) => x.user_id === p.user_id);
    const ta = attempts.filter((x) => x.user_id === p.user_id);
    const done = sp.filter((x) => x.status === "completed").length;
    const scored = ta.filter((x) => x.total_questions);
    const avgScore = scored.length
      ? Math.round(scored.reduce((s, x) => s + (x.score / x.total_questions) * 100, 0) / scored.length)
      : 0;
    const coverage = (Math.min(done, 30) / 30) * 100;
    const readiness = Math.round(avgScore * 0.6 + coverage * 0.4);

    const weakSubjects = subjects
      .map((sub) => {
        const subP = sp.filter((x) => x.subject_id === sub.id && x.quiz_score !== null);
        const avg = subP.length
          ? subP.reduce((s, x) => s + ((x.quiz_score || 0) / (x.quiz_total || 1)) * 100, 0) / subP.length
          : -1;
        return { name: sub.title, avg };
      })
      .filter((s) => s.avg >= 0 && s.avg < 60)
      .sort((a, b) => a.avg - b.avg);

    const secs = sp.reduce((s, x) => s + (x.time_spent_seconds || 0), 0);
    totalSeconds += secs;

    const dates = [...sp.map((x) => x.updated_at), ...ta.map((x) => x.completed_at)].filter(Boolean) as string[];
    const lastActive = dates.length ? dates.sort().reverse()[0] : null;

    return {
      user_id: p.user_id,
      full_name: p.full_name || "Student",
      username: p.username || "",
      department: p.department,
      college: p.college,
      topicsCompleted: done,
      testsTaken: ta.length,
      avgScore,
      readiness,
      band: bandOf(readiness),
      weakSubjects,
      lastActive,
    };
  });

  // Department aggregation
  const deptMap = new Map<string, StudentRow[]>();
  students.forEach((s) => {
    const d = s.department?.trim() || "Unassigned";
    deptMap.set(d, [...(deptMap.get(d) || []), s]);
  });
  const depts: DeptStat[] = Array.from(deptMap.entries())
    .map(([department, list]) => ({
      department,
      students: list.length,
      avgReadiness: Math.round(list.reduce((s, x) => s + x.readiness, 0) / list.length),
      ready: list.filter((x) => x.band === "Ready").length,
      atRisk: list.filter((x) => x.band === "At Risk").length,
    }))
    .sort((a, b) => b.avgReadiness - a.avgReadiness);

  const subjectCompletion = subjects.map((sub) => {
    const topicsDone = progress.filter((p) => p.subject_id === sub.id && p.status === "completed");
    const active = new Set(topicsDone.map((p) => p.user_id)).size;
    const rate = students.length ? Math.round((active / students.length) * 100) : 0;
    return { name: sub.title, rate, active };
  });

  const bandCounts = {
    Ready: students.filter((s) => s.band === "Ready").length,
    Almost: students.filter((s) => s.band === "Almost").length,
    "Needs Work": students.filter((s) => s.band === "Needs Work").length,
    "At Risk": students.filter((s) => s.band === "At Risk").length,
  };

  const activeLearners = students.filter((s) => {
    if (!s.lastActive) return false;
    const days = (Date.now() - new Date(s.lastActive).getTime()) / 86400000;
    return days <= 7;
  }).length;

  const completedTopics = progress.filter((p) => p.status === "completed").length;
  const totals = {
    students: students.length,
    activeLearners,
    avgReadiness: students.length ? Math.round(students.reduce((s, x) => s + x.readiness, 0) / students.length) : 0,
    avgScore: students.length ? Math.round(students.reduce((s, x) => s + x.avgScore, 0) / students.length) : 0,
    testsTaken: attempts.length,
    learningHours: Math.round(totalSeconds / 3600),
    completionRate: students.length && totalTopics ? Math.round((completedTopics / (students.length * totalTopics)) * 100) : 0,
  };

  const sortedByReadiness = [...students].sort((a, b) => b.readiness - a.readiness);
  const topPerformers = sortedByReadiness.slice(0, 5);
  const atRisk = sortedByReadiness.filter((s) => s.band === "At Risk").slice(0, 8);

  return { students, depts, subjectCompletion, bandCounts, totals, topPerformers, atRisk };
}

export const BAND_COLORS: Record<StudentRow["band"], string> = {
  Ready: "hsl(160 60% 45%)",
  Almost: "hsl(220 70% 50%)",
  "Needs Work": "hsl(38 95% 55%)",
  "At Risk": "hsl(0 75% 55%)",
};
