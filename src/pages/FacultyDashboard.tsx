import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { FacultyAssignments } from "@/components/faculty/FacultyAssignments";
import { FacultyAnalytics } from "@/components/faculty/FacultyAnalytics";
import { FacultyReadiness } from "@/components/faculty/FacultyReadiness";
import { FacultyControlTower } from "@/components/faculty/FacultyControlTower";
import { FacultyAIInsights } from "@/components/faculty/FacultyAIInsights";
import { FacultyStudentAnalyzer } from "@/components/faculty/FacultyStudentAnalyzer";
import { FacultyAnnouncements } from "@/components/faculty/FacultyAnnouncements";
import { FacultyReports } from "@/components/faculty/FacultyReports";
import { loadFacultyData, FacultyData } from "@/lib/facultyAnalytics";
import { motion } from "framer-motion";
import {
  Loader2, Users, ClipboardList, BarChart3, TrendingUp, Sparkles,
  Target, Flame, Radar, Brain, Megaphone, FileBarChart, Clock,
  Activity, GraduationCap, RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const FacultyDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isFaculty, setIsFaculty] = useState(false);
  const [checking, setChecking] = useState(true);
  const [facultyName, setFacultyName] = useState("");
  const [college, setCollege] = useState("");
  const [data, setData] = useState<FacultyData | null>(null);
  const [dataLoading, setDataLoading] = useState(false);

  const refresh = async () => {
    setDataLoading(true);
    try {
      setData(await loadFacultyData());
    } catch {
      toast({ title: "Failed to load analytics", variant: "destructive" });
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/auth"); return; }
    const checkRole = async () => {
      const { data: prof } = await supabase.from("profiles").select("role, full_name, college").eq("user_id", user.id).single();
      if (prof?.role === "faculty") {
        setIsFaculty(true);
        setFacultyName(prof.full_name || "Professor");
        setCollege(prof.college || "");
        await refresh();
      } else {
        toast({ title: "Access denied", description: "Faculty account required", variant: "destructive" });
        navigate("/dashboard");
      }
      setChecking(false);
    };
    checkRole();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  if (authLoading || checking) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></main>
      </div>
    );
  }
  if (!isFaculty) return null;

  const t = data?.totals;
  const quickStats = [
    { icon: Users, label: "Total Students", value: t?.students ?? 0, color: "from-blue-500 to-indigo-600" },
    { icon: Activity, label: "Active Learners", value: t?.activeLearners ?? 0, color: "from-emerald-500 to-teal-600" },
    { icon: Target, label: "Placement Readiness", value: `${t?.avgReadiness ?? 0}%`, color: "from-violet-500 to-purple-600" },
    { icon: BarChart3, label: "Avg Test Score", value: `${t?.avgScore ?? 0}%`, color: "from-amber-500 to-orange-600" },
    { icon: ClipboardList, label: "Tests Taken", value: t?.testsTaken ?? 0, color: "from-pink-500 to-rose-600" },
    { icon: Clock, label: "Learning Hours", value: `${t?.learningHours ?? 0}h`, color: "from-cyan-500 to-blue-600" },
  ];

  const getGreeting = () => {
    const h = new Date().getHours();
    return h < 12 ? "Good Morning" : h < 17 ? "Good Afternoon" : "Good Evening";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Welcome Banner */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="mb-6 relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-secondary p-8 text-primary-foreground">
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
            <div className="absolute bottom-0 left-20 w-40 h-40 bg-white/5 rounded-full translate-y-1/2" />
            <div className="relative z-10 flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="w-5 h-5" />
                  <span className="text-sm font-medium opacity-90">AI Placement Command Center{college ? ` · ${college}` : ""}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{getGreeting()}, {facultyName}! 👋</h1>
                <p className="text-primary-foreground/80 max-w-xl">Enterprise placement intelligence — analytics, AI insights, drives & reports in one control tower.</p>
              </div>
              <Button variant="secondary" onClick={refresh} disabled={dataLoading} className="gap-2 shrink-0">
                {dataLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />} Refresh
              </Button>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            {quickStats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
                <Card className="border-border hover:shadow-md transition-shadow overflow-hidden">
                  <CardContent className="p-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-md mb-2`}>
                      <s.icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="tower" className="space-y-6">
            <div className="overflow-x-auto -mx-4 px-4">
              <TabsList className="inline-flex h-12 w-auto">
                <TabsTrigger value="tower" className="gap-2"><Radar className="w-4 h-4" /> Control Tower</TabsTrigger>
                <TabsTrigger value="ai" className="gap-2"><Sparkles className="w-4 h-4" /> AI Insights</TabsTrigger>
                <TabsTrigger value="analyzer" className="gap-2"><Brain className="w-4 h-4" /> Student Analyzer</TabsTrigger>
                <TabsTrigger value="analytics" className="gap-2"><BarChart3 className="w-4 h-4" /> Analytics</TabsTrigger>
                <TabsTrigger value="readiness" className="gap-2"><Target className="w-4 h-4" /> Readiness</TabsTrigger>
                <TabsTrigger value="assignments" className="gap-2"><ClipboardList className="w-4 h-4" /> Tests</TabsTrigger>
                <TabsTrigger value="drives" className="gap-2"><Megaphone className="w-4 h-4" /> Drives</TabsTrigger>
                <TabsTrigger value="reports" className="gap-2"><FileBarChart className="w-4 h-4" /> Reports</TabsTrigger>
              </TabsList>
            </div>

            {dataLoading && !data ? (
              <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : (
              <>
                <TabsContent value="tower">{data && <FacultyControlTower data={data} />}</TabsContent>
                <TabsContent value="ai">{data && <FacultyAIInsights data={data} />}</TabsContent>
                <TabsContent value="analyzer">{data && <FacultyStudentAnalyzer data={data} />}</TabsContent>
                <TabsContent value="analytics"><FacultyAnalytics /></TabsContent>
                <TabsContent value="readiness"><FacultyReadiness /></TabsContent>
                <TabsContent value="assignments"><FacultyAssignments facultyId={user!.id} /></TabsContent>
                <TabsContent value="drives"><FacultyAnnouncements facultyId={user!.id} /></TabsContent>
                <TabsContent value="reports">{data && <FacultyReports data={data} collegeName={college} />}</TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FacultyDashboard;
