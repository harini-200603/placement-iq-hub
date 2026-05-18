import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PreTestRevision } from "@/components/PreTestRevision";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronRight,
  RotateCcw,
  Home,
  Lightbulb,
  BookOpen,
} from "lucide-react";

interface Question {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  difficulty: string;
  explanation: string | null;
}

const MODULE_LABELS: Record<string, string> = {
  aptitude: "Aptitude Practice",
  verbal: "Verbal Practice",
  technical: "Technical Practice",
  interview: "Interview Practice",
  general: "General Knowledge Practice",
};

const Practice = () => {
  const { module } = useParams<{ module: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [answered, setAnswered] = useState(false);
  const [stats, setStats] = useState({ correct: 0, wrong: 0, total: 0 });
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  const fetchQuestions = useCallback(async () => {
    if (!module) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .eq("module", module)
      .limit(200);

    if (error) {
      toast({ title: "Error loading questions", variant: "destructive" });
      setLoading(false);
      return;
    }

    if (data && data.length >= 5) {
      const shuffled = [...data].sort(() => Math.random() - 0.5);
      setQuestions(shuffled);
      setLoading(false);
    } else {
      setGenerating(true);
      try {
        await supabase.functions.invoke("generate-questions", {
          body: { module, count: 40 },
        });
        const { data: newData } = await supabase
          .from("questions")
          .select("*")
          .eq("module", module)
          .limit(200);
        if (newData) {
          setQuestions([...newData].sort(() => Math.random() - 0.5));
        }
      } catch {
        toast({ title: "Failed to generate questions", variant: "destructive" });
      } finally {
        setGenerating(false);
        setLoading(false);
      }
    }
  }, [module, toast]);

  useEffect(() => {
    if (user && module) fetchQuestions();
  }, [user, module, fetchQuestions]);

  const currentQ = questions[currentIndex];

  const handleCheck = () => {
    if (!selectedAnswer) return;
    setAnswered(true);
    const isCorrect = selectedAnswer === currentQ.correct_option;
    setStats((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      wrong: prev.wrong + (isCorrect ? 0 : 1),
      total: prev.total + 1,
    }));
  };

  const handleNext = () => {
    setAnswered(false);
    setSelectedAnswer("");
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((p) => p + 1);
    } else {
      // Reshuffle and restart
      setQuestions((prev) => [...prev].sort(() => Math.random() - 0.5));
      setCurrentIndex(0);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">
            {generating ? "AI is generating practice questions..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-12 container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">No questions available</h2>
          <Button onClick={() => navigate(`/preparation/${module}`)}>Back to Preparation</Button>
        </main>
        <Footer />
      </div>
    );
  }

  if (!started) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-12 container mx-auto px-4 max-w-3xl">
          <PreTestRevision
            module={module || "general"}
            title={MODULE_LABELS[module || ""] || "Practice Session"}
            cacheKey={`practice-${module}`}
            onStart={() => setStarted(true)}
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-12 container mx-auto px-4 max-w-3xl">
        {/* Stats bar */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">
            <BookOpen className="w-5 h-5 inline mr-2" />
            {MODULE_LABELS[module || ""] || "Practice"}
          </h2>
          <div className="flex gap-4 text-sm font-medium">
            <span className="text-secondary">✓ {stats.correct}</span>
            <span className="text-destructive">✗ {stats.wrong}</span>
            <span className="text-muted-foreground">Total: {stats.total}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Unlimited practice · No timer · Instant feedback
        </p>

        <motion.div key={currentIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    currentQ.difficulty === "easy"
                      ? "bg-secondary/10 text-secondary"
                      : currentQ.difficulty === "hard"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-accent/10 text-accent-foreground"
                  }`}
                >
                  {currentQ.difficulty}
                </span>
              </div>
              <CardTitle className="text-lg leading-relaxed">{currentQ.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={selectedAnswer}
                onValueChange={(v) => !answered && setSelectedAnswer(v)}
                className="space-y-3"
              >
                {(["A", "B", "C", "D"] as const).map((opt) => {
                  const optKey = `option_${opt.toLowerCase()}` as keyof Question;
                  const isCorrect = currentQ.correct_option === opt;
                  const isSelected = selectedAnswer === opt;
                  let borderClass = "border-border hover:border-primary/50";
                  if (answered) {
                    if (isCorrect) borderClass = "border-secondary bg-secondary/5";
                    else if (isSelected) borderClass = "border-destructive bg-destructive/5";
                  } else if (isSelected) {
                    borderClass = "border-primary bg-primary/5";
                  }
                  return (
                    <Label
                      key={opt}
                      htmlFor={`popt-${opt}`}
                      className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${borderClass}`}
                    >
                      <RadioGroupItem value={opt} id={`popt-${opt}`} disabled={answered} />
                      <span className="text-foreground">
                        {opt}. {currentQ[optKey] as string}
                      </span>
                      {answered && isCorrect && <CheckCircle2 className="w-4 h-4 text-secondary ml-auto" />}
                      {answered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-destructive ml-auto" />}
                    </Label>
                  );
                })}
              </RadioGroup>

              {answered && currentQ.explanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 p-3 bg-accent/10 rounded-lg text-sm text-muted-foreground border border-accent/20"
                >
                  <Lightbulb className="w-4 h-4 inline mr-1 text-accent" />
                  {currentQ.explanation}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <div className="flex gap-3 justify-between">
          <Button variant="outline" onClick={() => navigate(`/preparation/${module}`)}>
            <Home className="w-4 h-4 mr-1" /> Back
          </Button>
          <div className="flex gap-3">
            {!answered ? (
              <Button onClick={handleCheck} disabled={!selectedAnswer}>
                Check Answer <CheckCircle2 className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next Question <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Practice;
