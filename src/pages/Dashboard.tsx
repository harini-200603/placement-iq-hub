import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Brain,
  BookOpen,
  Code,
  ClipboardList,
  Users,
  ArrowRight,
  Trophy,
  Target,
  TrendingUp,
  Clock,
  CheckCircle2,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";

const overallStats = [
  { icon: Target, label: "Overall Progress", value: "32%", color: "text-primary" },
  { icon: Trophy, label: "Tests Completed", value: "5", color: "text-accent" },
  { icon: TrendingUp, label: "Avg. Score", value: "72%", color: "text-secondary" },
  { icon: Clock, label: "Hours Practiced", value: "18h", color: "text-primary-light" },
];

const completedTests = [
  { name: "Quantitative Aptitude - Set 1", score: 78, total: 100, date: "Feb 10, 2026" },
  { name: "Verbal Reasoning Basics", score: 85, total: 100, date: "Feb 8, 2026" },
  { name: "Logical Reasoning Mock", score: 62, total: 100, date: "Feb 5, 2026" },
  { name: "Data Interpretation - Level 1", score: 70, total: 100, date: "Feb 3, 2026" },
  { name: "English Grammar Test", score: 90, total: 100, date: "Jan 30, 2026" },
];

const recommendedModules = [
  {
    icon: Brain,
    title: "Aptitude Preparation",
    description: "Strengthen your quantitative and logical reasoning skills.",
    progress: 45,
    link: "/modules",
  },
  {
    icon: Code,
    title: "Technical Preparation",
    description: "Practice DSA and programming concepts for coding rounds.",
    progress: 20,
    link: "/modules",
  },
  {
    icon: Users,
    title: "Interview Preparation",
    description: "Prepare for HR and technical interview questions.",
    progress: 10,
    link: "/modules",
  },
];

const Dashboard = () => {
  const { user, loading } = useAuth();

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

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mb-10"
          >
            {overallStats.map((stat) => (
              <Card key={stat.label} className="border-border shadow-soft hover-lift">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Completed Tests */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Card className="border-border shadow-soft">
                <CardHeader className="pb-4">
                  <CardTitle className="font-display text-xl flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                    Completed Tests
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {completedTests.map((test, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border"
                    >
                      <div className="flex-1 min-w-0 mr-4">
                        <p className="font-semibold text-foreground truncate">{test.name}</p>
                        <p className="text-sm text-muted-foreground">{test.date}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="w-24">
                          <Progress value={test.score} className="h-2" />
                        </div>
                        <span className="text-sm font-bold text-foreground w-14 text-right">
                          {test.score}/{test.total}
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

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
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <mod.icon className="w-5 h-5 text-primary" />
                          </div>
                          <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {mod.title}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{mod.description}</p>
                        <div className="flex items-center gap-2">
                          <Progress value={mod.progress} className="h-2 flex-1" />
                          <span className="text-xs font-semibold text-muted-foreground">{mod.progress}%</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Action */}
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
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
