import { motion } from "framer-motion";
import { Target, Trophy, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DashboardStatsProps {
  totalTests: number;
  avgScore: number;
  overallProgress: number;
  totalMinutes: number;
}

const formatTime = (minutes: number) => {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};

export const DashboardStats = ({ totalTests, avgScore, overallProgress, totalMinutes }: DashboardStatsProps) => {
  const stats = [
    { icon: Target, label: "Overall Progress", value: `${overallProgress}%`, color: "text-primary" },
    { icon: Trophy, label: "Tests Completed", value: `${totalTests}`, color: "text-accent" },
    { icon: TrendingUp, label: "Avg. Score", value: `${avgScore}%`, color: "text-secondary" },
    { icon: Clock, label: "Time Practiced", value: formatTime(totalMinutes), color: "text-primary-light" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mb-10"
    >
      {stats.map((stat) => (
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
  );
};
