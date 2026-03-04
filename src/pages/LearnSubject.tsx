import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import {
  ArrowLeft, BookOpen, CheckCircle2, ChevronRight,
  Calculator, Brain, MessageSquare, Users, Code2, Terminal,
  Cpu, Globe, Palette, Zap,
} from "lucide-react";
import { getSubject, type Subject } from "@/data/learningTopics";

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

const STORAGE_KEY = (id: string) => `learn-progress-${id}`;

const LearnSubject = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const subject = getSubject(subjectId || "");

  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    if (!subject) return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY(subject.id));
      if (stored) setCompleted(JSON.parse(stored));
    } catch {}
  }, [subject]);

  const toggleComplete = (topicId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!subject) return;
    setCompleted((prev) => {
      const next = prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId];
      localStorage.setItem(STORAGE_KEY(subject.id), JSON.stringify(next));
      return next;
    });
  };

  if (!subject) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Subject not found</h2>
          <Button onClick={() => navigate("/learn")}>Back to Learn</Button>
        </main>
      </div>
    );
  }

  const progress = subject.topics.length > 0
    ? Math.round((completed.length / subject.topics.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <Button variant="ghost" size="sm" onClick={() => navigate("/learn")} className="gap-1 mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Learn
          </Button>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-4 rounded-2xl bg-gradient-to-br ${subject.color} text-white shadow-lg`}>
                {ICON_MAP[subject.icon]}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">{subject.title}</h1>
                <p className="text-muted-foreground">{subject.description}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Your Progress</span>
                <span className="text-sm font-bold text-primary">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2.5" />
              <p className="text-xs text-muted-foreground mt-2">
                {completed.length} of {subject.topics.length} topics completed
              </p>
            </Card>
          </motion.div>

          {/* Topics List */}
          <div className="space-y-3">
            {subject.topics.map((topic, i) => {
              const isDone = completed.includes(topic.id);
              return (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Card
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/30 ${
                      isDone ? "border-secondary/30 bg-secondary/5" : ""
                    }`}
                    onClick={() => navigate(`/learn/${subject.id}/${topic.id}`)}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      {/* Checkbox */}
                      <div onClick={(e) => toggleComplete(topic.id, e)}>
                        <Checkbox
                          checked={isDone}
                          className="h-5 w-5"
                        />
                      </div>

                      {/* Number */}
                      <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        isDone
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                      </span>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-medium ${isDone ? "text-secondary line-through" : "text-foreground"}`}>
                          {topic.title}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate">{topic.description}</p>
                      </div>

                      {/* Status / Action */}
                      <div className="flex items-center gap-2">
                        {isDone && <Badge variant="secondary" className="text-xs">Completed</Badge>}
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LearnSubject;
