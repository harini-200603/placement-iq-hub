import { Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Brain, Code, Users, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { CompletedTests } from "@/components/dashboard/CompletedTests";
import { InteractiveChallenge } from "@/components/dashboard/InteractiveChallenge";
import { DashboardAIChat } from "@/components/dashboard/DashboardAIChat";

interface TestAttempt {
  id: string;
  module: string;
  score: number;
  total_questions: number;
  completed_at: string | null;
  created_at: string;
}

const recommendedModules = [
  {
    icon: Brain,
    title: "Aptitude Preparation",
    description: "Strengthen your quantitative and logical reasoning skills.",
    link: "/preparation/aptitude",
  },
  {
    icon: Code,
    title: "Technical Preparation",
    description: "Practice DSA and programming concepts for coding rounds.",
    link: "/preparation/technical",
  },
  {
    icon: Users,
    title: "Interview Preparation",
    description: "Prepare for HR and technical interview questions.",
    link: "/preparation/interview",
  },
];

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [tests, setTests] = useState<TestAttempt[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const { data } = await supabase
        .from("test_attempts")
        .select("id, module, score, total_questions, completed_at, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setTests((data as TestAttempt[]) || []);
      setStatsLoading(false);
    };
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const displayName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Student";

  // Compute real stats
  const totalTests = tests.length;
  const avgScore =
    totalTests > 0
      ? Math.round(tests.reduce((s, t) => s + (t.score / t.total_questions) * 100, 0) / totalTests)
      : 0;
  // Estimate practice time: ~1 min per question answered
  const totalMinutes = tests.reduce((s, t) => s + t.total_questions, 0);
  // Overall progress: unique modules attempted out of 4
  const uniqueModules = new Set(tests.map((t) => t.module)).size;
  const overallProgress = Math.round((uniqueModules / 4) * 100);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Welcome */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
              Welcome back, <span className="text-primary">{displayName}</span>!
            </h1>
            <p className="text-muted-foreground text-lg">
              Track your progress and continue your placement preparation journey.
            </p>
          </motion.div>

          {/* Stats */}
          {statsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mb-10">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="border-border">
                  <CardContent className="p-5">
                    <div className="h-12 bg-muted animate-pulse rounded-xl" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <DashboardStats
              totalTests={totalTests}
              avgScore={avgScore}
              overallProgress={overallProgress}
              totalMinutes={totalMinutes}
            />
          )}

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            {/* Completed Tests */}
            <CompletedTests tests={tests} />

            {/* Recommended Modules */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="border-border shadow-soft">
                <CardHeader className="pb-4">
                  <CardTitle className="font-display text-xl flex items-center gap-2">
                    <Star className="w-5 h-5 text-accent" />
                    Recommended
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recommendedModules.map((mod) => (
                    <Link key={mod.title} to={mod.link}>
                      <div className="p-4 rounded-xl bg-muted/50 border border-border hover:border-primary/30 transition-colors cursor-pointer group mb-4 last:mb-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <mod.icon className="w-5 h-5 text-primary" />
                          </div>
                          <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {mod.title}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">{mod.description}</p>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
              <div className="mt-6">
                <Link to="/modules">
                  <Button variant="default" size="lg" className="w-full group">
                    Explore All Modules
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Interactive + AI Chat row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <InteractiveChallenge />
            <DashboardAIChat />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
