import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, BookOpen, ChevronRight, GraduationCap,
  Calculator, Brain, MessageSquare, Users, Code2, Terminal,
  Cpu, Globe, Palette, Zap, Trophy, Layers, Target,
  Clock, TrendingUp, Play, Dumbbell, Mic, Sparkles,
  ArrowRight, Star, Flame, BarChart3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { subjects, getSubjectsBySection, type Subject } from "@/data/learningTopics";
import { StudentAssignments } from "@/components/learn/StudentAssignments";
import { useAuth } from "@/contexts/AuthContext";

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

// ============ PLACEMENT PREP TOPICS (from Modules) ============
interface PrepTopic {
  name: string;
  slug: string;
  icon: React.ElementType;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  description: string;
}

const APTITUDE_TOPICS: PrepTopic[] = [
  { name: "Problems on Trains", slug: "problems-on-trains", icon: TrendingUp, category: "Arithmetic", difficulty: "medium", description: "Speed, distance and time problems involving trains." },
  { name: "Time and Distance", slug: "time-and-distance", icon: Clock, category: "Arithmetic", difficulty: "easy", description: "Concepts of speed, distance and time." },
  { name: "Height and Distance", slug: "height-and-distance", icon: TrendingUp, category: "Arithmetic", difficulty: "hard", description: "Trigonometric ratios for heights and distances." },
  { name: "Time and Work", slug: "time-and-work", icon: Clock, category: "Arithmetic", difficulty: "medium", description: "Work done by individuals or groups." },
  { name: "Simple Interest", slug: "simple-interest", icon: Calculator, category: "Arithmetic", difficulty: "easy", description: "SI formula with principal, rate and time." },
  { name: "Compound Interest", slug: "compound-interest", icon: Calculator, category: "Arithmetic", difficulty: "medium", description: "Interest on principal plus accumulated interest." },
  { name: "Profit and Loss", slug: "profit-and-loss", icon: TrendingUp, category: "Arithmetic", difficulty: "easy", description: "CP, SP, profit/loss percentage and discounts." },
  { name: "Partnership", slug: "partnership", icon: Layers, category: "Arithmetic", difficulty: "medium", description: "Ratio of investments to divide profits." },
  { name: "Percentage", slug: "percentage", icon: Target, category: "Arithmetic", difficulty: "easy", description: "Fractions, decimals and percentage conversions." },
  { name: "Problems on Ages", slug: "problems-on-ages", icon: Clock, category: "Arithmetic", difficulty: "easy", description: "Linear equations involving ages." },
  { name: "Calendar", slug: "calendar", icon: Clock, category: "Arithmetic", difficulty: "medium", description: "Finding day of the week using odd days." },
  { name: "Average", slug: "average", icon: Calculator, category: "Arithmetic", difficulty: "easy", description: "Mean, weighted averages, average speed." },
  { name: "Ratio and Proportion", slug: "ratio-and-proportion", icon: Target, category: "Arithmetic", difficulty: "easy", description: "Direct and inverse proportion." },
  { name: "Permutation and Combination", slug: "permutation-and-combination", icon: Target, category: "Advanced", difficulty: "hard", description: "Arrangements and selections." },
  { name: "Probability", slug: "probability", icon: Target, category: "Advanced", difficulty: "hard", description: "Classical and conditional probability." },
  { name: "Numbers", slug: "numbers", icon: Calculator, category: "Number System", difficulty: "easy", description: "Types, divisibility rules, remainders." },
  { name: "H.C.F and L.C.M", slug: "problems-on-hcf-and-lcm", icon: Calculator, category: "Number System", difficulty: "medium", description: "Prime factorization and division methods." },
  { name: "Simplification", slug: "simplification", icon: Calculator, category: "Number System", difficulty: "easy", description: "BODMAS and arithmetic expressions." },
  { name: "Area", slug: "area", icon: Layers, category: "Geometry", difficulty: "medium", description: "Area of triangles, circles, rectangles." },
  { name: "Volume & Surface Area", slug: "volume-and-surface-area", icon: Layers, category: "Geometry", difficulty: "hard", description: "Volume of cubes, cylinders, spheres." },
  { name: "Boats and Streams", slug: "boats-and-streams", icon: TrendingUp, category: "Arithmetic", difficulty: "medium", description: "Upstream, downstream speed concepts." },
  { name: "Pipes and Cistern", slug: "pipes-and-cistern", icon: Clock, category: "Arithmetic", difficulty: "medium", description: "Filling/emptying tanks with pipes." },
  { name: "Logarithm", slug: "logarithm", icon: Calculator, category: "Advanced", difficulty: "hard", description: "Properties and solving log equations." },
];

const VERBAL_TOPICS: PrepTopic[] = [
  { name: "Spotting Errors", slug: "spotting-errors", icon: BookOpen, category: "Grammar", difficulty: "medium", description: "Identify grammatical errors in sentences." },
  { name: "Sentence Correction", slug: "sentence-correction-prep", icon: BookOpen, category: "Grammar", difficulty: "medium", description: "Fix sentence errors correctly." },
  { name: "Synonyms", slug: "synonyms", icon: BookOpen, category: "Vocabulary", difficulty: "easy", description: "Words with similar meanings." },
  { name: "Antonyms", slug: "antonyms", icon: BookOpen, category: "Vocabulary", difficulty: "easy", description: "Words with opposite meanings." },
  { name: "Idioms and Phrases", slug: "idioms-and-phrases", icon: BookOpen, category: "Vocabulary", difficulty: "medium", description: "Common English idioms." },
  { name: "Reading Comprehension", slug: "reading-comprehension", icon: BookOpen, category: "Comprehension", difficulty: "hard", description: "Read passages and answer questions." },
  { name: "One Word Substitutes", slug: "one-word-substitutes", icon: BookOpen, category: "Vocabulary", difficulty: "medium", description: "Single words replacing phrases." },
  { name: "Ordering of Sentences", slug: "ordering-of-sentences", icon: BookOpen, category: "Comprehension", difficulty: "medium", description: "Rearrange jumbled sentences." },
];

const TECHNICAL_TOPICS: PrepTopic[] = [
  { name: "Data Structures", slug: "data-structures", icon: Layers, category: "CS Fundamentals", difficulty: "hard", description: "Arrays, linked lists, trees, graphs." },
  { name: "Algorithms", slug: "algorithms", icon: Target, category: "CS Fundamentals", difficulty: "hard", description: "Sorting, searching, DP, greedy." },
  { name: "OOP Concepts", slug: "oop-concepts", icon: Layers, category: "Programming", difficulty: "medium", description: "Encapsulation, inheritance, polymorphism." },
  { name: "DBMS", slug: "dbms", icon: Layers, category: "CS Fundamentals", difficulty: "medium", description: "Normalization, SQL, transactions." },
  { name: "Operating Systems", slug: "operating-systems", icon: Layers, category: "CS Fundamentals", difficulty: "hard", description: "Processes, memory, scheduling." },
  { name: "Networking", slug: "networking", icon: Layers, category: "CS Fundamentals", difficulty: "medium", description: "OSI model, TCP/IP, protocols." },
  { name: "SQL Queries", slug: "sql-queries", icon: Calculator, category: "Programming", difficulty: "medium", description: "Joins, subqueries, aggregates." },
];

const INTERVIEW_TOPICS: PrepTopic[] = [
  { name: "HR Questions", slug: "hr-questions", icon: GraduationCap, category: "HR", difficulty: "easy", description: "Tell me about yourself, strengths, weaknesses." },
  { name: "Behavioral Questions", slug: "behavioral-questions", icon: GraduationCap, category: "HR", difficulty: "medium", description: "STAR method situational questions." },
  { name: "Group Discussion", slug: "group-discussion", icon: GraduationCap, category: "Communication", difficulty: "medium", description: "GD tips, topics and evaluation." },
  { name: "Technical Interview", slug: "technical-interview", icon: GraduationCap, category: "Technical", difficulty: "hard", description: "How to approach technical rounds." },
];

const PREP_MODULES = [
  { key: "aptitude", label: "Aptitude", icon: Brain, color: "from-blue-500 to-indigo-600", topics: APTITUDE_TOPICS },
  { key: "verbal", label: "Verbal", icon: MessageSquare, color: "from-emerald-500 to-teal-600", topics: VERBAL_TOPICS },
  { key: "technical", label: "Technical", icon: Code2, color: "from-violet-500 to-purple-600", topics: TECHNICAL_TOPICS },
  { key: "interview", label: "Interview", icon: Users, color: "from-rose-500 to-pink-600", topics: INTERVIEW_TOPICS },
];

const difficultyColor: Record<string, string> = {
  easy: "bg-secondary/10 text-secondary border-secondary/20",
  medium: "bg-accent/10 text-accent-foreground border-accent/20",
  hard: "bg-destructive/10 text-destructive border-destructive/20",
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
  const [activeTab, setActiveTab] = useState("learning-notes");
  const [activePrepModule, setActivePrepModule] = useState("aptitude");
  const [, setTick] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

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

  const currentPrepModule = PREP_MODULES.find(m => m.key === activePrepModule)!;
  const filteredPrepTopics = currentPrepModule.topics.filter(
    t => t.name.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase())
  );

  const groupedPrepTopics = filteredPrepTopics.reduce<Record<string, PrepTopic[]>>((acc, t) => {
    if (!acc[t.category]) acc[t.category] = [];
    acc[t.category].push(t);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="container mx-auto px-4 mb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Your Complete Learning Hub
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Learn, Practice & <span className="gradient-text">Ace Placements</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Comprehensive placement prep, programming tutorials, AI-powered questions & topic-wise mock tests — all in one place.
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

        {/* Quick Stats */}
        <section className="container mx-auto px-4 mb-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { icon: <Flame className="w-5 h-5" />, value: `${subjects.length + 4}`, label: "Modules" },
              { icon: <BookOpen className="w-5 h-5" />, value: `${totalTopics + APTITUDE_TOPICS.length + VERBAL_TOPICS.length + TECHNICAL_TOPICS.length + INTERVIEW_TOPICS.length}`, label: "Topics" },
              { icon: <Star className="w-5 h-5" />, value: "AI", label: "Powered" },
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

        {/* Faculty Assignments */}
        <section className="container mx-auto px-4 mb-10 max-w-6xl">
          <StudentAssignments />
        </section>

        {/* Main Tabs */}
        <section className="container mx-auto px-4 max-w-6xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 h-12">
              <TabsTrigger value="placement-prep" className="text-sm font-semibold gap-1.5">
                <GraduationCap className="w-4 h-4" /> Placement Prep
              </TabsTrigger>
              <TabsTrigger value="learning-notes" className="text-sm font-semibold gap-1.5">
                <BookOpen className="w-4 h-4" /> Learning Notes
              </TabsTrigger>
              <TabsTrigger value="programming" className="text-sm font-semibold gap-1.5">
                <Code2 className="w-4 h-4" /> Programming
              </TabsTrigger>
            </TabsList>

            {/* =========== TAB 1: PLACEMENT PREPARATION =========== */}
            <TabsContent value="placement-prep">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {/* Module Selector Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {PREP_MODULES.map((mod) => (
                    <motion.div
                      key={mod.key}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActivePrepModule(mod.key)}
                      className={`cursor-pointer rounded-xl p-4 border-2 transition-all duration-200 ${
                        activePrepModule === mod.key
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-border bg-card hover:border-primary/30"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${mod.color} text-white flex items-center justify-center mb-3`}>
                        <mod.icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-semibold text-foreground text-sm">{mod.label}</h3>
                      <p className="text-xs text-muted-foreground">{mod.topics.length} topics</p>
                    </motion.div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <Button onClick={() => navigate(`/mock-test/${activePrepModule}`)} className="gap-2">
                    <Play className="w-4 h-4" /> Mock Test (15 Qs)
                  </Button>
                  <Button variant="outline" onClick={() => navigate(`/practice/${activePrepModule}`)} className="gap-2">
                    <Dumbbell className="w-4 h-4" /> Practice Mode
                  </Button>
                  {activePrepModule === "technical" && (
                    <Button variant="outline" onClick={() => navigate("/coding-practice")} className="gap-2">
                      <Code2 className="w-4 h-4" /> Coding Practice
                    </Button>
                  )}
                  {activePrepModule === "interview" && (
                    <Button variant="outline" onClick={() => navigate("/interview-practice")} className="gap-2">
                      <Mic className="w-4 h-4" /> Interview Sim
                    </Button>
                  )}
                </div>

                {/* Topics Grid */}
                {Object.entries(groupedPrepTopics).map(([category, items], catIdx) => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: catIdx * 0.05 }}
                    className="mb-8"
                  >
                    <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-primary rounded-full" />
                      {category}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {items.map((topic) => (
                        <Card
                          key={topic.slug}
                          className="group hover:border-primary/50 transition-all cursor-pointer"
                          onClick={() => navigate(`/topic/${activePrepModule}/${topic.slug}`)}
                        >
                          <CardContent className="p-4 flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                              <topic.icon className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-foreground text-sm truncate">{topic.name}</h4>
                                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${difficultyColor[topic.difficulty]}`}>
                                  {topic.difficulty}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2">{topic.description}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </motion.div>
                ))}
                {filteredPrepTopics.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No matching topics found.</p>
                )}
              </motion.div>
            </TabsContent>

            {/* =========== TAB 2: LEARNING NOTES =========== */}
            <TabsContent value="learning-notes">
              <div className="space-y-10">
                <div>
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
              </div>
            </TabsContent>

            {/* =========== TAB 3: PROGRAMMING =========== */}
            <TabsContent value="programming">
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
            </TabsContent>
          </Tabs>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Learn;
