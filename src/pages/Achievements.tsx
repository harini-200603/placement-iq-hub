import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Flame, Trophy, Target, Sparkles, Lock } from "lucide-react";
import {
  BADGES, getUnlockedBadges, getStreak, getStats, getLevel, getXP,
  getAchievementMilestones,
} from "@/lib/gamification";

const tierColor: Record<string, string> = {
  bronze: "from-orange-400 to-orange-600",
  silver: "from-slate-300 to-slate-500",
  gold: "from-yellow-400 to-amber-500",
  platinum: "from-cyan-400 to-violet-500",
};

const Achievements = () => {
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [streak, setStreak] = useState(getStreak());
  const [stats, setStats] = useState(getStats());
  const [lvl, setLvl] = useState(getLevel());

  useEffect(() => {
    setUnlocked(getUnlockedBadges());
    setStreak(getStreak());
    setStats(getStats());
    setLvl(getLevel(getXP()));
  }, []);

  const milestones = getAchievementMilestones();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16 container mx-auto px-4 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
            <Sparkles className="w-3 h-3" /> Your Progress
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Achievements & Streaks</h1>
          <p className="text-muted-foreground mt-1">Keep going — every topic, quiz and login earns you XP and badges.</p>
        </motion.div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-orange-500/10 to-amber-500/5 border-orange-500/20">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 mb-2"><Flame className="w-4 h-4" /><span className="text-xs font-semibold">Current Streak</span></div>
              <div className="text-3xl font-bold text-foreground">{streak.current} 🔥</div>
              <p className="text-xs text-muted-foreground mt-1">Longest: {streak.longest} days</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-500/10 to-yellow-500/5 border-amber-500/20">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-2"><Trophy className="w-4 h-4" /><span className="text-xs font-semibold">Level</span></div>
              <div className="text-3xl font-bold text-foreground">Lv {lvl.level}</div>
              <Progress value={(lvl.progress / lvl.nextAt) * 100} className="h-1.5 mt-2" />
              <p className="text-xs text-muted-foreground mt-1">{lvl.progress}/{lvl.nextAt} XP</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border-emerald-500/20">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-2"><Target className="w-4 h-4" /><span className="text-xs font-semibold">Badges</span></div>
              <div className="text-3xl font-bold text-foreground">{unlocked.length}<span className="text-base text-muted-foreground">/{BADGES.length}</span></div>
              <p className="text-xs text-muted-foreground mt-1">Unlocked</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-violet-500/10 to-purple-500/5 border-violet-500/20">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 mb-2"><Sparkles className="w-4 h-4" /><span className="text-xs font-semibold">Total XP</span></div>
              <div className="text-3xl font-bold text-foreground">{getXP()}</div>
              <p className="text-xs text-muted-foreground mt-1">Best quiz: {stats.bestQuizScore}%</p>
            </CardContent>
          </Card>
        </div>

        {/* Milestones */}
        <Card className="mb-8">
          <CardHeader><CardTitle>Milestones</CardTitle></CardHeader>
          <CardContent className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {milestones.map((m) => (
              <div key={m.label} className="p-4 rounded-xl border border-border bg-card">
                <div className="text-xs text-muted-foreground">{m.label}</div>
                <div className="text-2xl font-bold mt-1">{m.value}</div>
                <Progress value={(m.value / m.next) * 100} className="h-1.5 mt-2" />
                <div className="text-xs text-muted-foreground mt-1">Next at {m.next}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Badges grid */}
        <Card>
          <CardHeader>
            <CardTitle>Badge Collection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {BADGES.map((b) => {
                const isUnlocked = unlocked.includes(b.id);
                return (
                  <motion.div
                    key={b.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-4 rounded-xl border text-center relative overflow-hidden ${isUnlocked ? "border-primary/30 bg-card" : "border-border bg-muted/30 opacity-70"}`}
                  >
                    {isUnlocked && (
                      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${tierColor[b.tier]}`} />
                    )}
                    <div className={`text-4xl mb-2 ${isUnlocked ? "" : "grayscale"}`}>
                      {isUnlocked ? b.emoji : <Lock className="w-8 h-8 mx-auto text-muted-foreground" />}
                    </div>
                    <div className="font-semibold text-sm text-foreground">{b.name}</div>
                    <p className="text-xs text-muted-foreground mt-1">{b.description}</p>
                    <Badge variant="outline" className="mt-2 text-[10px] capitalize">{b.tier}</Badge>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Achievements;
