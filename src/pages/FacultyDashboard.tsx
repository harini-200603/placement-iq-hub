import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FacultyAssignments } from "@/components/faculty/FacultyAssignments";
import { FacultyAnalytics } from "@/components/faculty/FacultyAnalytics";
import { motion } from "framer-motion";
import {
  Loader2, ShieldCheck, Users, ClipboardList, BarChart3,
  TrendingUp, BookOpen, Award, Sparkles, GraduationCap,
  Target, Flame, Calendar, Bell,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const FacultyDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isFaculty, setIsFaculty] = useState(false);
  const [checking, setChecking] = useState(true);
  const [stats, setStats] = useState({ students: 0, assignments: 0, avgScore: 0, completionRate: 0 });
  const [facultyName, setFacultyName] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/auth"); return; }

    const checkRole = async () => {
      const { data } = await supabase.from("profiles").select("role, full_name").eq("user_id", user.id).single();
      if (data?.role === "faculty") {
        setIsFaculty(true);
        setFacultyName(data.full_name || "Professor");
        // Fetch quick stats
        const [studentsRes, assignmentsRes, progressRes] = await Promise.all([
          supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "student"),
          supabase.from("question_assignments").select("id", { count: "exact", head: true }).eq("faculty_id", user.id),
          supabase.from("student_progress").select("quiz_score, quiz_total, status"),
        ]);
        const progressData = progressRes.data || [];
        const withScores = progressData.filter(p => p.quiz_score != null && p.quiz_total);
        const avgScore = withScores.length > 0 ? Math.round(withScores.reduce((s, p) => s + ((p.quiz_score! / p.quiz_total!) * 100), 0) / withScores.length) : 0;
        const completed = progressData.filter(p => p.status === "completed").length;
        const completionRate = progressData.length > 0 ? Math.round((completed / progressData.length) * 100) : 0;

        setStats({
          students: studentsRes.count || 0,
          assignments: assignmentsRes.count || 0,
          avgScore,
          completionRate,
        });
      } else {
        toast({ title: "Access denied", description: "Faculty account required", variant: "destructive" });
        navigate("/dashboard");
      }
      setChecking(false);
    };
    checkRole();
  }, [user, authLoading, navigate, toast]);

  if (authLoading || checking) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  if (!isFaculty) return null;

  const quickStats = [
    { icon: Users, label: "Total Students", value: stats.students.toString(), color: "from-blue-500 to-indigo-600", bgColor: "bg-blue-50" },
    { icon: ClipboardList, label: "Assignments", value: stats.assignments.toString(), color: "from-emerald-500 to-teal-600", bgColor: "bg-emerald-50" },
    { icon: Target, label: "Avg Score", value: `${stats.avgScore}%`, color: "from-amber-500 to-orange-600", bgColor: "bg-amber-50" },
    { icon: TrendingUp, label: "Completion", value: `${stats.completionRate}%`, color: "from-violet-500 to-purple-600", bgColor: "bg-violet-50" },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Welcome Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/90 to-primary p-8 text-primary-foreground"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-20 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-medium opacity-90">Faculty Portal</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{getGreeting()}, {facultyName}! 👋</h1>
              <p className="text-primary-foreground/80 max-w-lg">
                Manage your students, create assignments, and track learning progress — all from one place.
              </p>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {quickStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <Card className="border-border hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Flame className="w-5 h-5 text-primary" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: ClipboardList, label: "New Assignment", desc: "Create a task", tab: "assignments" },
                { icon: BarChart3, label: "View Analytics", desc: "Student progress", tab: "analytics" },
                { icon: Users, label: "Student List", desc: "Track all students", tab: "analytics" },
                { icon: Award, label: "Leaderboard", desc: "Top performers", tab: "analytics" },
              ].map((action) => (
                <Card
                  key={action.label}
                  className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group"
                  onClick={() => {
                    const tabEl = document.querySelector(`[data-value="${action.tab}"]`) as HTMLButtonElement;
                    if (tabEl) tabEl.click();
                  }}
                >
                  <CardContent className="p-4 text-center">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2 group-hover:bg-primary/20 transition-colors">
                      <action.icon className="w-5 h-5 text-primary" />
                    </div>
                    <p className="font-semibold text-sm text-foreground">{action.label}</p>
                    <p className="text-xs text-muted-foreground">{action.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Main Tabs */}
          <Tabs defaultValue="analytics" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2 h-12">
              <TabsTrigger value="analytics" data-value="analytics" className="gap-2 font-semibold">
                <BarChart3 className="w-4 h-4" />
                Student Analytics
              </TabsTrigger>
              <TabsTrigger value="assignments" data-value="assignments" className="gap-2 font-semibold">
                <ClipboardList className="w-4 h-4" />
                Assignments
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analytics">
              <FacultyAnalytics />
            </TabsContent>

            <TabsContent value="assignments">
              <FacultyAssignments facultyId={user!.id} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FacultyDashboard;
