import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Users, BookOpen, Trophy, TrendingUp,
  Search, ChevronRight, Loader2,
} from "lucide-react";
import { subjects } from "@/data/learningTopics";
import { motion } from "framer-motion";

interface StudentProfile {
  user_id: string;
  full_name: string;
  username: string;
}

interface ProgressRecord {
  user_id: string;
  subject_id: string;
  topic_id: string;
  status: string;
  quiz_score: number | null;
  quiz_total: number | null;
  completed_at: string | null;
}

interface TestAttempt {
  user_id: string;
  module: string;
  score: number;
  total_questions: number;
  completed_at: string | null;
}

export const FacultyAnalytics = () => {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [progress, setProgress] = useState<ProgressRecord[]>([]);
  const [testAttempts, setTestAttempts] = useState<TestAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [studentsRes, progressRes, attemptsRes] = await Promise.all([
      supabase.from("profiles").select("user_id, full_name, username").eq("role", "student"),
      supabase.from("student_progress").select("*"),
      supabase.from("test_attempts").select("user_id, module, score, total_questions, completed_at"),
    ]);

    if (studentsRes.data) setStudents(studentsRes.data);
    if (progressRes.data) setProgress(progressRes.data as ProgressRecord[]);
    if (attemptsRes.data) setTestAttempts(attemptsRes.data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const totalTopics = subjects.reduce((s, sub) => s + sub.topics.length, 0);
  const completedTopics = progress.filter(p => p.status === "completed").length;
  const avgScore = testAttempts.length > 0
    ? Math.round(testAttempts.reduce((s, a) => s + (a.score / a.total_questions) * 100, 0) / testAttempts.length)
    : 0;

  const filteredStudents = students.filter(s =>
    s.full_name.toLowerCase().includes(search.toLowerCase()) ||
    s.username.toLowerCase().includes(search.toLowerCase())
  );

  const getStudentStats = (userId: string) => {
    const sp = progress.filter(p => p.user_id === userId);
    const ta = testAttempts.filter(a => a.user_id === userId);
    const completed = sp.filter(p => p.status === "completed").length;
    const avgQuiz = ta.length > 0
      ? Math.round(ta.reduce((s, a) => s + (a.score / a.total_questions) * 100, 0) / ta.length)
      : 0;
    const weakSubjects = subjects
      .map(sub => {
        const subProgress = sp.filter(p => p.subject_id === sub.id && p.quiz_score !== null);
        const avg = subProgress.length > 0
          ? subProgress.reduce((s, p) => s + ((p.quiz_score || 0) / (p.quiz_total || 1)) * 100, 0) / subProgress.length
          : -1;
        return { name: sub.title, avg };
      })
      .filter(s => s.avg >= 0 && s.avg < 60)
      .sort((a, b) => a.avg - b.avg);

    return { completed, totalAttempts: ta.length, avgQuiz, weakSubjects };
  };

  // Individual student view
  if (selectedStudent) {
    const student = students.find(s => s.user_id === selectedStudent);
    const stats = getStudentStats(selectedStudent);
    const studentProgress = progress.filter(p => p.user_id === selectedStudent);
    const studentAttempts = testAttempts.filter(a => a.user_id === selectedStudent);

    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedStudent(null)}
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          ← Back to all students
        </button>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
            {student?.full_name?.charAt(0) || "?"}
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{student?.full_name}</h2>
            <p className="text-sm text-muted-foreground">@{student?.username}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Topics Completed", value: stats.completed, icon: <BookOpen className="w-4 h-4" /> },
            { label: "Tests Taken", value: stats.totalAttempts, icon: <Trophy className="w-4 h-4" /> },
            { label: "Avg Score", value: `${stats.avgQuiz}%`, icon: <TrendingUp className="w-4 h-4" /> },
            { label: "Weak Areas", value: stats.weakSubjects.length, icon: <Search className="w-4 h-4" /> },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4 text-center">
                <div className="text-primary mb-1">{stat.icon}</div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Subject-wise breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Subject-wise Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {subjects.map(sub => {
              const subP = studentProgress.filter(p => p.subject_id === sub.id);
              const done = subP.filter(p => p.status === "completed").length;
              const pct = Math.round((done / sub.topics.length) * 100);
              return (
                <div key={sub.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-foreground font-medium">{sub.title}</span>
                    <span className="text-muted-foreground">{done}/{sub.topics.length}</span>
                  </div>
                  <Progress value={pct} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Weak areas */}
        {stats.weakSubjects.length > 0 && (
          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="text-base text-destructive">Weak Areas (Avg &lt; 60%)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {stats.weakSubjects.map(w => (
                  <Badge key={w.name} variant="destructive" className="gap-1">
                    {w.name}: {Math.round(w.avg)}%
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent test attempts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Test Attempts</CardTitle>
          </CardHeader>
          <CardContent>
            {studentAttempts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No test attempts yet.</p>
            ) : (
              <div className="space-y-2">
                {studentAttempts.slice(-10).reverse().map((a, i) => (
                  <div key={i} className="flex justify-between items-center p-2 rounded-lg bg-muted/50 text-sm">
                    <span className="text-foreground capitalize">{a.module}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground">
                        {a.score}/{a.total_questions}
                      </span>
                      <Badge variant={a.score / a.total_questions >= 0.7 ? "secondary" : "outline"}>
                        {Math.round((a.score / a.total_questions) * 100)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Students", value: students.length, icon: <Users className="w-5 h-5" /> },
          { label: "Topics Completed", value: completedTopics, icon: <BookOpen className="w-5 h-5" /> },
          { label: "Tests Taken", value: testAttempts.length, icon: <Trophy className="w-5 h-5" /> },
          { label: "Avg Score", value: `${avgScore}%`, icon: <TrendingUp className="w-5 h-5" /> },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 text-center">
              <div className="text-primary mb-2">{stat.icon}</div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Module-wise completion */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Module Completion Rates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {subjects.map(sub => {
            const topicsDone = progress.filter(p => p.subject_id === sub.id && p.status === "completed");
            const uniqueStudents = new Set(topicsDone.map(p => p.user_id)).size;
            const completionRate = students.length > 0
              ? Math.round((uniqueStudents / students.length) * 100)
              : 0;
            return (
              <div key={sub.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground font-medium">{sub.title}</span>
                  <span className="text-muted-foreground">{uniqueStudents}/{students.length} students active</span>
                </div>
                <Progress value={completionRate} className="h-2" />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Student List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-base">Students ({students.length})</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredStudents.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No students found.</p>
          ) : (
            <div className="space-y-2">
              {filteredStudents.map((student) => {
                const stats = getStudentStats(student.user_id);
                return (
                  <motion.div
                    key={student.user_id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/30 cursor-pointer transition-all"
                    onClick={() => setSelectedStudent(student.user_id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                        {student.full_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">{student.full_name}</p>
                        <p className="text-xs text-muted-foreground">@{student.username}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden md:block">
                        <p className="text-xs text-muted-foreground">{stats.completed} topics · {stats.avgQuiz}% avg</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
