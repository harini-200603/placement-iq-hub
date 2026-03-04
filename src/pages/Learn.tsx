import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, BookOpen, ChevronRight, GraduationCap,
  Calculator, Brain, MessageSquare, Users, Code2, Terminal,
  Cpu, Globe, Palette, Zap, Trophy, Layers,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { subjects, getSubjectsBySection, type Subject } from "@/data/learningTopics";

const ICON_MAP: Record<string, React.ReactNode> = {
  Calculator: <Calculator className="w-6 h-6" />,
  Brain: <Brain className="w-6 h-6" />,
  MessageSquare: <MessageSquare className="w-6 h-6" />,
  Users: <Users className="w-6 h-6" />,
  Code2: <Code2 className="w-6 h-6" />,
  Terminal: <Terminal className="w-6 h-6" />,
  Cpu: <Cpu className="w-6 h-6" />,
  Globe: <Globe className="w-6 h-6" />,
  Palette: <Palette className="w-6 h-6" />,
  Zap: <Zap className="w-6 h-6" />,
};

const getProgress = (subjectId: string, topicCount: number): number => {
  try {
    const stored = localStorage.getItem(`learn-progress-${subjectId}`);
    if (!stored) return 0;
    const completed: string[] = JSON.parse(stored);
    return Math.round((completed.length / topicCount) * 100);
  } catch { return 0; }
};

const SubjectCard = ({ subject }: { subject: Subject }) => {
  const navigate = useNavigate();
  const progress = getProgress(subject.id, subject.topics.length);

  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card
        className="group cursor-pointer overflow-hidden border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg h-full"
        onClick={() => navigate(`/learn/${subject.id}`)}
      >
        <div className={`h-1.5 bg-gradient-to-r ${subject.color}`} />
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${subject.color} text-white shadow-md`}>
              {ICON_MAP[subject.icon]}
            </div>
            <Badge variant="secondary" className="text-xs">
              {subject.topics.length} topics
            </Badge>
          </div>
          <CardTitle className="text-lg mt-3 group-hover:text-primary transition-colors">
            {subject.title}
          </CardTitle>
          <p className="text-sm text-muted-foreground leading-relaxed">{subject.description}</p>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-1.5 mb-4">
            {subject.topics.slice(0, 3).map((t) => (
              <span key={t.id} className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground">
                {t.title}
              </span>
            ))}
            {subject.topics.length > 3 && (
              <span className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground">
                +{subject.topics.length - 3} more
              </span>
            )}
          </div>
          {progress > 0 && (
            <div className="mb-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>
          )}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <span className="text-xs text-muted-foreground">
              {progress > 0 ? `${progress}% done` : "Not started"}
            </span>
            <div className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              {progress > 0 ? "Continue" : "Start"} <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const Learn = () => {
  const [search, setSearch] = useState("");
  const [, setTick] = useState(0);

  // Re-render on mount to pick up localStorage progress
  useEffect(() => setTick((t) => t + 1), []);

  const placementSubjects = getSubjectsBySection("placement");
  const programmingSubjects = getSubjectsBySection("programming");

  const filterSubjects = (list: Subject[]) =>
    list.filter(
      (s) =>
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase()) ||
        s.topics.some((t) => t.title.toLowerCase().includes(search.toLowerCase()))
    );

  const filteredPlacement = filterSubjects(placementSubjects);
  const filteredProgramming = filterSubjects(programmingSubjects);

  const totalTopics = subjects.reduce((s, sub) => s + sub.topics.length, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="container mx-auto px-4 mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <GraduationCap className="w-4 h-4" />
              Structured Learning Notes
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Learn <span className="gradient-text">Step by Step</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Comprehensive placement preparation notes & programming tutorials.
              Read, practice, and track your progress — all in one place.
            </p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search topics, subjects, languages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 h-12 text-base rounded-xl border-border bg-card shadow-sm"
              />
            </div>
          </motion.div>
        </section>

        {/* Stats */}
        <section className="container mx-auto px-4 mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { icon: <Layers className="w-5 h-5" />, value: `${subjects.length}`, label: "Subjects" },
              { icon: <BookOpen className="w-5 h-5" />, value: `${totalTopics}`, label: "Topics" },
              { icon: <Code2 className="w-5 h-5" />, value: "6", label: "Languages" },
              { icon: <Trophy className="w-5 h-5" />, value: "Free", label: "Forever" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                className="flex flex-col items-center gap-1 p-4 rounded-xl bg-card border border-border"
              >
                <div className="text-primary">{stat.icon}</div>
                <span className="text-xl font-bold text-foreground">{stat.value}</span>
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECTION 1: Placement Preparation */}
        <section className="container mx-auto px-4 mb-14">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <GraduationCap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Placement Preparation</h2>
                <p className="text-sm text-muted-foreground">Aptitude, reasoning, verbal & HR interview</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnimatePresence>
                {filteredPlacement.map((s) => (
                  <SubjectCard key={s.id} subject={s} />
                ))}
              </AnimatePresence>
            </div>
            {filteredPlacement.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No matching placement topics found.</p>
            )}
          </div>
        </section>

        {/* SECTION 2: Programming Languages */}
        <section className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-secondary/10">
                <Code2 className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Programming Languages</h2>
                <p className="text-sm text-muted-foreground">Java, Python, C, HTML, CSS & JavaScript</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredProgramming.map((s) => (
                  <SubjectCard key={s.id} subject={s} />
                ))}
              </AnimatePresence>
            </div>
            {filteredProgramming.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No matching programming topics found.</p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Learn;
