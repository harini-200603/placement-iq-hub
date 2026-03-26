import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  Loader2, CheckCircle2, XCircle, ChevronRight,
  Lightbulb, Building2, RotateCcw, Brain, Trophy,
  BookOpen, ArrowRight,
} from "lucide-react";

interface QuizQuestion {
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  difficulty: string;
  explanation: string;
  company_relevance?: string;
}

interface TopicQuizProps {
  subjectId: string;
  topicId: string;
  topicTitle: string;
}

const COMPANIES = [
  { id: "general", label: "All Companies" },
  { id: "TCS", label: "TCS" },
  { id: "Infosys", label: "Infosys" },
  { id: "Wipro", label: "Wipro" },
  { id: "Cognizant", label: "Cognizant" },
  { id: "Accenture", label: "Accenture" },
];

const CACHE_KEY = (subjectId: string, topicId: string, company: string) =>
  `topic-quiz-${subjectId}-${topicId}-${company}`;

export const TopicQuiz = ({ subjectId, topicId, topicTitle }: TopicQuizProps) => {
  const { toast } = useToast();
  const [company, setCompany] = useState("general");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answered, setAnswered] = useState(false);
  const [stats, setStats] = useState({ correct: 0, wrong: 0, total: 0 });
  const [showResults, setShowResults] = useState(false);

  const generateQuestions = useCallback(async () => {
    setLoading(true);
    setStarted(true);
    setCurrentIndex(0);
    setSelectedAnswer("");
    setAnswered(false);
    setStats({ correct: 0, wrong: 0, total: 0 });
    setShowResults(false);

    // Check cache
    const cacheKey = CACHE_KEY(subjectId, topicId, company);
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setQuestions(parsed.sort(() => Math.random() - 0.5));
        setLoading(false);
        return;
      } catch {}
    }

    try {
      const { data, error } = await supabase.functions.invoke("generate-topic-questions", {
        body: { subject: subjectId, topic: topicTitle, company, count: 10 },
      });

      if (error) throw error;
      if (data?.questions) {
        setQuestions(data.questions);
        localStorage.setItem(cacheKey, JSON.stringify(data.questions));
      } else {
        throw new Error("No questions returned");
      }
    } catch (e: any) {
      console.error(e);
      toast({
        title: "Failed to generate questions",
        description: e?.message || "Please try again",
        variant: "destructive",
      });
      setStarted(false);
    } finally {
      setLoading(false);
    }
  }, [subjectId, topicId, topicTitle, company, toast]);

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
      setShowResults(true);
    }
  };

  const handleRetry = () => {
    // Clear cache to get fresh questions
    localStorage.removeItem(CACHE_KEY(subjectId, topicId, company));
    generateQuestions();
  };

  if (!started) {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="w-5 h-5 text-primary" />
            Practice Questions — {topicTitle}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            AI-generated placement questions based on company patterns
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Select Company Focus:</p>
            <div className="flex flex-wrap gap-2">
              {COMPANIES.map((c) => (
                <Button
                  key={c.id}
                  variant={company === c.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCompany(c.id)}
                  className="gap-1"
                >
                  <Building2 className="w-3 h-3" />
                  {c.label}
                </Button>
              ))}
            </div>
          </div>
          <Button onClick={generateQuestions} className="gap-2">
            <Brain className="w-4 h-4" /> Generate 10 Practice Questions
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground font-medium">
            AI is generating {company !== "general" ? `${company}-style` : "placement"} questions...
          </p>
          <p className="text-xs text-muted-foreground mt-1">This may take a moment</p>
        </CardContent>
      </Card>
    );
  }

  if (showResults) {
    const percentage = Math.round((stats.correct / stats.total) * 100);
    return (
      <Card className="border-primary/20">
        <CardContent className="py-8 text-center space-y-4">
          <Trophy className={`w-16 h-16 mx-auto ${percentage >= 70 ? "text-yellow-500" : "text-muted-foreground"}`} />
          <h3 className="text-2xl font-bold text-foreground">Quiz Complete!</h3>
          <div className="flex justify-center gap-6 text-lg">
            <span className="text-secondary font-semibold">✓ {stats.correct} Correct</span>
            <span className="text-destructive font-semibold">✗ {stats.wrong} Wrong</span>
          </div>
          <p className="text-3xl font-bold text-primary">{percentage}%</p>
          <p className="text-muted-foreground">
            {percentage >= 80 ? "Excellent! You've mastered this topic! 🎉" :
             percentage >= 60 ? "Good effort! Review the explanations to improve. 💪" :
             "Keep practicing! Review the content and try again. 📚"}
          </p>
          <div className="flex gap-3 justify-center pt-2">
            <Button variant="outline" onClick={handleRetry} className="gap-2">
              <RotateCcw className="w-4 h-4" /> New Questions
            </Button>
            <Button onClick={() => { setStarted(false); setQuestions([]); }}>
              Change Company
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentQ) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" /> Practice Quiz
          </CardTitle>
          <div className="flex gap-3 text-sm font-medium">
            <span className="text-secondary">✓ {stats.correct}</span>
            <span className="text-destructive">✗ {stats.wrong}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          <motion.div key={currentIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <div className="flex gap-2">
                <Badge variant={
                  currentQ.difficulty === "easy" ? "secondary" :
                  currentQ.difficulty === "hard" ? "destructive" : "outline"
                }>
                  {currentQ.difficulty}
                </Badge>
                {currentQ.company_relevance && (
                  <Badge variant="outline" className="gap-1 text-xs">
                    <Building2 className="w-3 h-3" />
                    {currentQ.company_relevance}
                  </Badge>
                )}
              </div>
            </div>

            <p className="text-foreground font-medium mb-4 whitespace-pre-wrap">{currentQ.question}</p>

            <RadioGroup
              value={selectedAnswer}
              onValueChange={(v) => !answered && setSelectedAnswer(v)}
              className="space-y-2"
            >
              {(["A", "B", "C", "D"] as const).map((opt) => {
                const optKey = `option_${opt.toLowerCase()}` as keyof QuizQuestion;
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
                    htmlFor={`tq-${currentIndex}-${opt}`}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all text-sm ${borderClass}`}
                  >
                    <RadioGroupItem value={opt} id={`tq-${currentIndex}-${opt}`} disabled={answered} />
                    <span className="text-foreground">
                      {opt}. {currentQ[optKey] as string}
                    </span>
                    {answered && isCorrect && <CheckCircle2 className="w-4 h-4 text-secondary ml-auto shrink-0" />}
                    {answered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-destructive ml-auto shrink-0" />}
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
                <strong>Explanation:</strong> {currentQ.explanation}
              </motion.div>
            )}

            <div className="flex justify-end mt-4 gap-3">
              {!answered ? (
                <Button onClick={handleCheck} disabled={!selectedAnswer} size="sm">
                  Check Answer <CheckCircle2 className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button onClick={handleNext} size="sm">
                  {currentIndex < questions.length - 1 ? "Next" : "See Results"}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};
