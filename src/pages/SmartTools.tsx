import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Brain, Flame, Smile, Frown, Zap, Target,
  Trash2, Check, ChevronRight, Calendar, RefreshCw,
  AlertTriangle, Sparkles, Clock, RotateCcw, Eye,
} from "lucide-react";
import {
  getMistakes, markMistakeReviewed, deleteMistake, clearAllMistakes,
  getRevisionQueue, completeRevisionItem, removeRevisionItem, addToRevision,
  getMood, setMood as saveMood, getDailyPlan, generateDailyPlan, saveDailyPlan, completePlanTask,
  getStreak, updateStreak,
  type Mood, type MistakeEntry, type RevisionItem, type DailyPlan,
} from "@/lib/smartFeatures";
import { subjects } from "@/data/learningTopics";

const MOOD_OPTIONS: { value: Mood; icon: React.ReactNode; label: string; color: string }[] = [
  { value: "focused", icon: <Target className="w-5 h-5" />, label: "Focused", color: "from-blue-500 to-indigo-600" },
  { value: "motivated", icon: <Zap className="w-5 h-5" />, label: "Motivated", color: "from-emerald-500 to-teal-600" },
  { value: "normal", icon: <Smile className="w-5 h-5" />, label: "Normal", color: "from-amber-400 to-orange-500" },
  { value: "tired", icon: <Clock className="w-5 h-5" />, label: "Tired", color: "from-gray-400 to-slate-500" },
  { value: "stressed", icon: <Frown className="w-5 h-5" />, label: "Stressed", color: "from-rose-400 to-red-500" },
];

const SmartTools = () => {
  const navigate = useNavigate();
  const [mistakes, setMistakes] = useState<MistakeEntry[]>([]);
  const [revision, setRevision] = useState<RevisionItem[]>([]);
  const [mood, setMoodState] = useState<Mood | null>(null);
  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [streak, setStreak] = useState(0);
  const [activeTab, setActiveTab] = useState("planner");

  useEffect(() => {
    setMistakes(getMistakes());
    setRevision(getRevisionQueue());
    setMoodState(getMood());
    setPlan(getDailyPlan());
    setStreak(updateStreak());
  }, []);

  const handleMoodSelect = (m: Mood) => {
    saveMood(m);
    setMoodState(m);
    const newPlan = generateDailyPlan(m);
    saveDailyPlan(newPlan);
    setPlan(newPlan);
  };

  const handleRegeneratePlan = () => {
    if (!mood) return;
    const newPlan = generateDailyPlan(mood);
    saveDailyPlan(newPlan);
    setPlan(newPlan);
  };

  const handleCompleteTask = (taskId: string) => {
    completePlanTask(taskId);
    setPlan(getDailyPlan());
  };

  const handleReviewMistake = (id: string) => {
    markMistakeReviewed(id);
    setMistakes(getMistakes());
  };

  const handleDeleteMistake = (id: string) => {
    deleteMistake(id);
    setMistakes(getMistakes());
  };

  const handleClearMistakes = () => {
    clearAllMistakes();
    setMistakes([]);
  };

  const handleCompleteRevision = (id: string) => {
    completeRevisionItem(id);
    setRevision(getRevisionQueue());
  };

  const handleRemoveRevision = (id: string) => {
    removeRevisionItem(id);
    setRevision(getRevisionQueue());
  };

  // Auto-build revision from incomplete + weak topics
  const handleAutoRevision = () => {
    subjects.forEach((subject) => {
      try {
        const stored = localStorage.getItem(`learn-progress-${subject.id}`);
        const completed: string[] = stored ? JSON.parse(stored) : [];
        // Add first 2 incomplete topics per subject to revision
        const incomplete = subject.topics.filter((t) => !completed.includes(t.id));
        incomplete.slice(0, 1).forEach((t) => {
          addToRevision({
            subjectId: subject.id,
            topicId: t.id,
            title: `${t.title} (${subject.title})`,
            reason: "skipped",
            priority: "medium",
          });
        });
      } catch {}
    });
    // Add from mistakes
    const unreviewedMistakes = getMistakes().filter((m) => !m.reviewed);
    unreviewedMistakes.slice(0, 3).forEach((m) => {
      addToRevision({
        subjectId: m.module,
        topicId: m.topic,
        title: `${m.topic} (${m.module}) — wrong answer`,
        reason: "wrong_answer",
        priority: "high",
      });
    });
    setRevision(getRevisionQueue());
  };

  const pendingRevision = revision.filter((r) => !r.completed);
  const completedRevision = revision.filter((r) => r.completed);
  const unreviewedMistakes = mistakes.filter((m) => !m.reviewed);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-primary-foreground/20 text-primary-foreground shadow-lg">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Smart Tools</h1>
                <p className="text-muted-foreground">Your intelligent study companion</p>
              </div>
            </div>

            {/* Streak & Quick Stats */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              <Card className="p-3 text-center">
                <Flame className="w-5 h-5 text-accent mx-auto mb-1" />
                <p className="text-2xl font-bold text-foreground">{streak}</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </Card>
              <Card className="p-3 text-center">
                <AlertTriangle className="w-5 h-5 text-destructive mx-auto mb-1" />
                <p className="text-2xl font-bold text-foreground">{unreviewedMistakes.length}</p>
                <p className="text-xs text-muted-foreground">Mistakes to Review</p>
              </Card>
              <Card className="p-3 text-center">
                <RotateCcw className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="text-2xl font-bold text-foreground">{pendingRevision.length}</p>
                <p className="text-xs text-muted-foreground">In Revision Queue</p>
              </Card>
            </div>
          </motion.div>

          {/* Mood Check-in */}
          {!mood && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <Card className="mb-8 border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Smile className="w-5 h-5 text-primary" />
                    How are you feeling today?
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Your mood helps us create a personalized study plan
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-2">
                    {MOOD_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleMoodSelect(opt.value)}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-muted/50 transition-all"
                      >
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${opt.color} text-white`}>
                          {opt.icon}
                        </div>
                        <span className="text-xs font-medium text-foreground">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Mood badge if already set */}
          {mood && (
            <div className="flex items-center gap-2 mb-6">
              <Badge variant="secondary" className="gap-1 px-3 py-1">
                {MOOD_OPTIONS.find((o) => o.value === mood)?.icon}
                {MOOD_OPTIONS.find((o) => o.value === mood)?.label} Mode
              </Badge>
              <Button variant="ghost" size="sm" onClick={() => { setMoodState(null); }}>
                Change
              </Button>
            </div>
          )}

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="planner" className="gap-1.5 text-xs sm:text-sm">
                <Calendar className="w-4 h-4" /> Daily Plan
              </TabsTrigger>
              <TabsTrigger value="mistakes" className="gap-1.5 text-xs sm:text-sm">
                <AlertTriangle className="w-4 h-4" /> Mistakes
                {unreviewedMistakes.length > 0 && (
                  <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                    {unreviewedMistakes.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="revision" className="gap-1.5 text-xs sm:text-sm">
                <RotateCcw className="w-4 h-4" /> Revision
              </TabsTrigger>
            </TabsList>

            {/* =========== DAILY PLANNER =========== */}
            <TabsContent value="planner">
              {plan ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">Today's Study Plan</h3>
                      <p className="text-xs text-muted-foreground">
                        {plan.completedCount} of {plan.tasks.length} tasks done
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleRegeneratePlan} className="gap-1">
                      <RefreshCw className="w-3 h-3" /> Refresh
                    </Button>
                  </div>
                  <Progress
                    value={plan.tasks.length > 0 ? (plan.completedCount / plan.tasks.length) * 100 : 0}
                    className="h-2"
                  />
                  <div className="space-y-2">
                    <AnimatePresence>
                      {plan.tasks.map((task, i) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <Card className={`transition-all ${task.completed ? "opacity-60" : ""}`}>
                            <CardContent className="p-3 flex items-center gap-3">
                              <button
                                onClick={() => handleCompleteTask(task.id)}
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                                  task.completed
                                    ? "bg-secondary border-secondary text-secondary-foreground"
                                    : "border-muted-foreground hover:border-primary"
                                }`}
                              >
                                {task.completed && <Check className="w-3 h-3" />}
                              </button>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                                  {task.title}
                                </p>
                                <p className="text-xs text-muted-foreground">{task.duration} min</p>
                              </div>
                              {task.subjectId && task.topicId && !task.completed && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => navigate(`/learn/${task.subjectId}/${task.topicId}`)}
                                  className="shrink-0"
                                >
                                  <ChevronRight className="w-4 h-4" />
                                </Button>
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  {plan.completedCount === plan.tasks.length && plan.tasks.length > 0 && (
                    <Card className="bg-secondary/10 border-secondary/30 text-center p-6">
                      <Sparkles className="w-8 h-8 text-secondary mx-auto mb-2" />
                      <p className="font-semibold text-foreground">All tasks completed! 🎉</p>
                      <p className="text-sm text-muted-foreground">Great job! Keep up the streak.</p>
                    </Card>
                  )}
                </motion.div>
              ) : (
                <Card className="text-center p-8">
                  <Brain className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-foreground font-medium mb-1">No plan generated yet</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select your mood above to generate a personalized study plan
                  </p>
                </Card>
              )}
            </TabsContent>

            {/* =========== MISTAKE NOTEBOOK =========== */}
            <TabsContent value="mistakes">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">Mistake Notebook</h3>
                    <p className="text-xs text-muted-foreground">
                      {mistakes.length} total • {unreviewedMistakes.length} unreviewed
                    </p>
                  </div>
                  {mistakes.length > 0 && (
                    <Button variant="outline" size="sm" onClick={handleClearMistakes} className="gap-1 text-destructive">
                      <Trash2 className="w-3 h-3" /> Clear All
                    </Button>
                  )}
                </div>

                {mistakes.length === 0 ? (
                  <Card className="text-center p-8">
                    <Check className="w-10 h-10 text-secondary mx-auto mb-3" />
                    <p className="text-foreground font-medium mb-1">No mistakes recorded</p>
                    <p className="text-sm text-muted-foreground">
                      Wrong answers from mock tests will appear here automatically
                    </p>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {mistakes.slice(0, 20).map((mistake) => (
                      <Card key={mistake.id} className={`${mistake.reviewed ? "opacity-60" : ""}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <Badge variant="outline" className="text-[10px] shrink-0">
                              {mistake.module} / {mistake.topic}
                            </Badge>
                            <div className="flex gap-1">
                              {!mistake.reviewed && (
                                <Button variant="ghost" size="sm" onClick={() => handleReviewMistake(mistake.id)} className="h-7 text-xs gap-1">
                                  <Eye className="w-3 h-3" /> Reviewed
                                </Button>
                              )}
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteMistake(mistake.id)} className="h-7 text-xs text-destructive">
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm font-medium text-foreground mb-2">{mistake.question}</p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="p-2 rounded-lg bg-destructive/10 border border-destructive/20">
                              <span className="text-destructive font-medium">Your Answer:</span>
                              <p className="text-foreground mt-0.5">{mistake.userAnswer}</p>
                            </div>
                            <div className="p-2 rounded-lg bg-secondary/10 border border-secondary/20">
                              <span className="text-secondary font-medium">Correct:</span>
                              <p className="text-foreground mt-0.5">{mistake.correctAnswer}</p>
                            </div>
                          </div>
                          {mistake.explanation && (
                            <p className="text-xs text-muted-foreground mt-2 bg-muted p-2 rounded-lg">
                              💡 {mistake.explanation}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </motion.div>
            </TabsContent>

            {/* =========== REVISION QUEUE =========== */}
            <TabsContent value="revision">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">Revision Queue</h3>
                    <p className="text-xs text-muted-foreground">
                      {pendingRevision.length} pending • {completedRevision.length} done
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleAutoRevision} className="gap-1">
                    <Sparkles className="w-3 h-3" /> Auto-Build
                  </Button>
                </div>

                {pendingRevision.length === 0 ? (
                  <Card className="text-center p-8">
                    <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-foreground font-medium mb-1">Revision queue is empty</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Click "Auto-Build" to populate from your weak areas
                    </p>
                  </Card>
                ) : (
                  <div className="space-y-2">
                    {pendingRevision.map((item) => (
                      <Card key={item.id}>
                        <CardContent className="p-3 flex items-center gap-3">
                          <div className={`w-2 h-8 rounded-full ${
                            item.priority === "high" ? "bg-destructive" :
                            item.priority === "medium" ? "bg-accent" : "bg-muted-foreground"
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Badge variant="outline" className="text-[10px]">
                                {item.reason.replace("_", " ")}
                              </Badge>
                              <Badge variant={item.priority === "high" ? "destructive" : "secondary"} className="text-[10px]">
                                {item.priority}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/learn/${item.subjectId}/${item.topicId}`)}
                              className="h-8"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCompleteRevision(item.id)}
                              className="h-8 text-secondary"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveRevision(item.id)}
                              className="h-8 text-destructive"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {completedRevision.length > 0 && (
                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2 font-medium">Completed ({completedRevision.length})</p>
                    {completedRevision.slice(0, 5).map((item) => (
                      <div key={item.id} className="flex items-center gap-2 py-1.5 text-sm text-muted-foreground">
                        <Check className="w-3.5 h-3.5 text-secondary" />
                        <span className="line-through truncate">{item.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SmartTools;
