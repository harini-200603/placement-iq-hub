import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Code2,
  Play,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  Terminal,
  Lightbulb,
  Copy,
  Check,
  Trophy,
} from "lucide-react";

interface Lesson {
  title: string;
  content: string;
  codeExample?: string;
  language?: string;
  tryItYourself?: string;
  quiz?: {
    question: string;
    options: string[];
    answer: number;
  };
}

const TUTORIAL_CONFIG: Record<string, { title: string; prompt: string }> = {
  "html-css": { title: "HTML & CSS", prompt: "HTML and CSS web development" },
  javascript: { title: "JavaScript", prompt: "JavaScript programming" },
  python: { title: "Python", prompt: "Python programming" },
  java: { title: "Java Programming", prompt: "Java programming" },
  sql: { title: "SQL & Databases", prompt: "SQL and database management" },
  dsa: { title: "Data Structures & Algorithms", prompt: "data structures and algorithms" },
  cpp: { title: "C / C++", prompt: "C and C++ programming" },
  react: { title: "React & Frontend", prompt: "React.js frontend development" },
  aptitude: { title: "Aptitude & Reasoning", prompt: "quantitative aptitude and logical reasoning for placement exams" },
};

const LearnTopic = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const config = TUTORIAL_CONFIG[topicId || ""];

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [loading, setLoading] = useState(true);
  const [codeOutput, setCodeOutput] = useState("");
  const [userCode, setUserCode] = useState("");
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());
  const [copied, setCopied] = useState(false);

  const generateLessons = useCallback(async () => {
    if (!config) return;
    setLoading(true);
    try {
      const resp = await supabase.functions.invoke("topic-chat", {
        body: {
          message: `Generate exactly 6 interactive lessons for learning ${config.prompt}. Each lesson should be progressively harder. Return a JSON array where each object has:
- "title": lesson title (string)
- "content": detailed tutorial content in markdown with explanations, formulas, and real-world examples (string, at least 300 words)
- "codeExample": a complete, runnable code example demonstrating the concept (string, use proper formatting)
- "language": programming language for syntax highlighting (string)
- "tryItYourself": a coding exercise prompt for the student to try (string)
- "quiz": an object with "question" (string), "options" (array of 4 strings), and "answer" (index 0-3 of correct option)

Return ONLY the JSON array, no other text.`,
          module: topicId,
          topic: config.title,
        },
      });

      if (resp.error) throw resp.error;

      let content = resp.data?.response || resp.data?.content || "";
      // Extract JSON from response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setLessons(parsed);
        if (parsed[0]?.tryItYourself) {
          setUserCode(`// Try it yourself!\n// ${parsed[0].tryItYourself}\n\n`);
        }
      } else {
        throw new Error("Invalid response format");
      }
    } catch (e) {
      console.error(e);
      toast({ title: "Failed to load lessons", variant: "destructive" });
      // Fallback lesson
      setLessons([{
        title: `Introduction to ${config.title}`,
        content: `# Welcome to ${config.title}\n\nThis tutorial will guide you through the fundamentals step by step. Each lesson includes explanations, code examples, and hands-on exercises.\n\n## Getting Started\n\nLet's begin with the basics and build your understanding from the ground up.`,
        codeExample: "// Welcome! Start coding here",
        language: topicId === "python" ? "python" : "javascript",
        tryItYourself: "Write a hello world program",
      }]);
    } finally {
      setLoading(false);
    }
  }, [config, topicId, toast]);

  useEffect(() => {
    generateLessons();
  }, [generateLessons]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunCode = () => {
    setCodeOutput("✅ Code executed successfully! Check the output above.\n\n(In a real environment, this would run your code. Practice writing it out to build muscle memory!)");
  };

  const handleQuizSubmit = (idx: number) => {
    setQuizAnswer(idx);
    setQuizSubmitted(true);
  };

  const goToLesson = (idx: number) => {
    setCompletedLessons((prev) => new Set([...prev, currentLesson]));
    setCurrentLesson(idx);
    setQuizAnswer(null);
    setQuizSubmitted(false);
    setCodeOutput("");
    if (lessons[idx]?.tryItYourself) {
      setUserCode(`// Try it yourself!\n// ${lessons[idx].tryItYourself}\n\n`);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!config) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Tutorial not found</h2>
          <Button onClick={() => navigate("/learn")}>Back to Tutorials</Button>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Generating interactive lessons for {config.title}...</p>
          <p className="text-xs text-muted-foreground">This may take a moment</p>
        </div>
      </div>
    );
  }

  const lesson = lessons[currentLesson];
  const progress = ((completedLessons.size + (currentLesson === lessons.length - 1 ? 1 : 0)) / lessons.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="sm" onClick={() => navigate("/learn")} className="gap-1">
              <ArrowLeft className="w-4 h-4" /> All Tutorials
            </Button>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {Math.round(progress)}% complete
              </span>
              <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-[280px,1fr] gap-6">
            {/* Sidebar - Lesson Navigation */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <Card className="overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h3 className="font-bold text-foreground">{config.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{lessons.length} lessons</p>
                </div>
                <div className="p-2 max-h-[60vh] overflow-y-auto">
                  {lessons.map((l, i) => (
                    <button
                      key={i}
                      onClick={() => goToLesson(i)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-colors ${
                        i === currentLesson
                          ? "bg-primary/10 text-primary font-medium"
                          : completedLessons.has(i)
                            ? "text-secondary hover:bg-muted"
                            : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        completedLessons.has(i)
                          ? "bg-secondary text-secondary-foreground"
                          : i === currentLesson
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                      }`}>
                        {completedLessons.has(i) ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                      </span>
                      <span className="truncate">{l.title}</span>
                    </button>
                  ))}
                </div>
              </Card>
            </div>

            {/* Main Content */}
            <div className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentLesson}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Lesson Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <Badge variant="outline" className="gap-1">
                      <BookOpen className="w-3 h-3" /> Lesson {currentLesson + 1}
                    </Badge>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                    {lesson?.title}
                  </h1>

                  {/* Tutorial Content */}
                  <Card className="mb-6">
                    <CardContent className="p-6 md:p-8 prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown>{lesson?.content || ""}</ReactMarkdown>
                    </CardContent>
                  </Card>

                  {/* Code Example */}
                  {lesson?.codeExample && (
                    <Card className="mb-6 overflow-hidden border-primary/20">
                      <div className="flex items-center justify-between px-4 py-2 bg-muted border-b border-border">
                        <div className="flex items-center gap-2">
                          <Code2 className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-foreground">Example</span>
                          <Badge variant="secondary" className="text-xs">{lesson.language || "code"}</Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyCode(lesson.codeExample!)}
                          className="h-7 text-xs gap-1"
                        >
                          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          {copied ? "Copied" : "Copy"}
                        </Button>
                      </div>
                      <pre className="p-4 overflow-x-auto bg-card text-sm font-mono text-foreground leading-relaxed">
                        <code>{lesson.codeExample}</code>
                      </pre>
                    </Card>
                  )}

                  {/* Try It Yourself Editor */}
                  {lesson?.tryItYourself && (
                    <Card className="mb-6 overflow-hidden border-secondary/20">
                      <div className="flex items-center gap-2 px-4 py-2 bg-secondary/5 border-b border-border">
                        <Terminal className="w-4 h-4 text-secondary" />
                        <span className="text-sm font-bold text-foreground">Try It Yourself!</span>
                      </div>
                      <div className="p-4">
                        <div className="flex items-start gap-2 mb-3 p-3 rounded-lg bg-accent/10 border border-accent/20">
                          <Lightbulb className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                          <p className="text-sm text-muted-foreground">{lesson.tryItYourself}</p>
                        </div>
                        <textarea
                          value={userCode}
                          onChange={(e) => setUserCode(e.target.value)}
                          className="w-full h-40 p-4 font-mono text-sm bg-muted/50 border border-border rounded-lg text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                          spellCheck={false}
                        />
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" onClick={handleRunCode} className="gap-1">
                            <Play className="w-4 h-4" /> Run Code
                          </Button>
                        </div>
                        {codeOutput && (
                          <motion.pre
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-3 p-3 bg-muted rounded-lg text-sm font-mono text-foreground border border-border"
                          >
                            {codeOutput}
                          </motion.pre>
                        )}
                      </div>
                    </Card>
                  )}

                  {/* Quiz */}
                  {lesson?.quiz && (
                    <Card className="mb-6 overflow-hidden border-accent/20">
                      <div className="flex items-center gap-2 px-4 py-2 bg-accent/5 border-b border-border">
                        <CheckCircle2 className="w-4 h-4 text-accent" />
                        <span className="text-sm font-bold text-foreground">Quick Quiz</span>
                      </div>
                      <CardContent className="p-4">
                        <p className="font-medium text-foreground mb-4">{lesson.quiz.question}</p>
                        <div className="space-y-2">
                          {lesson.quiz.options.map((opt, i) => {
                            const isCorrect = i === lesson.quiz!.answer;
                            const isSelected = quizAnswer === i;
                            return (
                              <button
                                key={i}
                                onClick={() => !quizSubmitted && handleQuizSubmit(i)}
                                disabled={quizSubmitted}
                                className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all ${
                                  quizSubmitted
                                    ? isCorrect
                                      ? "border-secondary bg-secondary/10 text-secondary font-medium"
                                      : isSelected
                                        ? "border-destructive bg-destructive/10 text-destructive"
                                        : "border-border text-muted-foreground"
                                    : "border-border hover:border-primary/50 hover:bg-primary/5 text-foreground cursor-pointer"
                                }`}
                              >
                                <span className="font-mono mr-2">{String.fromCharCode(65 + i)}.</span>
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                        {quizSubmitted && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`mt-3 text-sm font-medium ${
                              quizAnswer === lesson.quiz.answer ? "text-secondary" : "text-destructive"
                            }`}
                          >
                            {quizAnswer === lesson.quiz.answer
                              ? "🎉 Correct! Great job!"
                              : `❌ Incorrect. The answer is ${String.fromCharCode(65 + lesson.quiz.answer)}.`}
                          </motion.p>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Navigation */}
                  <div className="flex items-center justify-between pt-4">
                    <Button
                      variant="outline"
                      disabled={currentLesson === 0}
                      onClick={() => goToLesson(currentLesson - 1)}
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                    </Button>
                    {currentLesson < lessons.length - 1 ? (
                      <Button onClick={() => goToLesson(currentLesson + 1)}>
                        Next Lesson <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    ) : (
                      <Button onClick={() => navigate("/learn")} className="gap-2">
                        <Trophy className="w-4 h-4" /> Complete Course
                      </Button>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LearnTopic;
