import { useState, useEffect, useCallback } from "react";
import { addMistake } from "@/lib/smartFeatures";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useFullscreen } from "@/hooks/useFullscreen";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { CertificateCard } from "@/components/CertificateCard";
import { PreTestRevision } from "@/components/PreTestRevision";
import { onMockCompleted } from "@/lib/gamification";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Loader2,
  Trophy,
  RotateCcw,
  Home,
  Lightbulb,
  Award,
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
  aptitude: "Aptitude Preparation",
  verbal: "Verbal Ability",
  technical: "Technical Preparation",
  interview: "Interview Preparation",
  general: "General Knowledge",
};

const MockTest = () => {
  const { module } = useParams<{ module: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState<Record<number, boolean>>({});
  const [certificateSaved, setCertificateSaved] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [readyToStart, setReadyToStart] = useState(false);
  const { isFullscreen, enterFullscreen, exitFullscreen, exitAttempts } = useFullscreen(examStarted && !submitted);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  // Warn user about exit attempts
  useEffect(() => {
    if (exitAttempts > 0 && !submitted) {
      toast({
        title: "⚠️ Warning: Focus Lost!",
        description: `You left the exam window (${exitAttempts} time${exitAttempts > 1 ? "s" : ""}). This may be flagged.`,
        variant: "destructive",
      });
    }
  }, [exitAttempts, submitted, toast]);

  // Auto-enter fullscreen ONLY after user clicks "Start"
  useEffect(() => {
    if (questions.length > 0 && !submitted && !examStarted && readyToStart) {
      setExamStarted(true);
      enterFullscreen();
    }
  }, [questions.length, submitted, examStarted, readyToStart, enterFullscreen]);

  // Exit fullscreen on submit
  useEffect(() => {
    if (submitted) {
      exitFullscreen();
      setExamStarted(false);
    }
  }, [submitted, exitFullscreen]);

  const fetchQuestions = useCallback(async () => {
    if (!module) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .eq("module", module)
      .limit(200);

    if (error) {
      console.error(error);
      toast({ title: "Error loading questions", variant: "destructive" });
      setLoading(false);
      return;
    }

    if (data && data.length >= 15) {
      // Pick 15 random questions
      const shuffled = [...data].sort(() => Math.random() - 0.5).slice(0, 15);
      setQuestions(shuffled);
      setLoading(false);
    } else {
      // Generate questions via AI
      setGenerating(true);
      try {
        const resp = await supabase.functions.invoke("generate-questions", {
          body: { module, count: 40 },
        });
        if (resp.error) throw resp.error;
        // Fetch again after generation
        const { data: newData } = await supabase
          .from("questions")
          .select("*")
          .eq("module", module)
          .limit(200);
        if (newData && newData.length > 0) {
          const shuffled = [...newData]
            .sort(() => Math.random() - 0.5)
            .slice(0, 15);
          setQuestions(shuffled);
        }
      } catch (e) {
        console.error(e);
        toast({
          title: "Failed to generate questions",
          description: "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setGenerating(false);
        setLoading(false);
      }
    }
  }, [module, toast]);

  useEffect(() => {
    if (user && module) fetchQuestions();
  }, [user, module, fetchQuestions]);

  // Timer
  useEffect(() => {
    if (submitted || loading || questions.length === 0 || !readyToStart) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [submitted, loading, questions.length, readyToStart]);

  const handleSubmit = async () => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correct_option) {
        correct++;
      } else if (answers[i]) {
        // Save wrong answers to mistake notebook
        addMistake({
          question: q.question,
          userAnswer: answers[i],
          correctAnswer: q.correct_option,
          explanation: q.explanation || "",
          module: module || "unknown",
          topic: q.question.substring(0, 30),
        });
      }
    });
    setScore(correct);
    setSubmitted(true);
    onMockCompleted(correct, questions.length);

    if (user && module) {
      // Save test attempt
      supabase
        .from("test_attempts")
        .insert({
          user_id: user.id,
          module,
          score: correct,
          total_questions: questions.length,
          answers: Object.entries(answers).map(([idx, ans]) => ({
            question_id: questions[parseInt(idx)]?.id,
            selected: ans,
            correct: questions[parseInt(idx)]?.correct_option,
          })),
          completed_at: new Date().toISOString(),
        })
        .then(({ error }) => {
          if (error) console.error("Save attempt error:", error);
        });

      // Generate certificate
      const userName =
        user.user_metadata?.full_name || user.email?.split("@")[0] || "Student";
      const { error: certError } = await supabase.from("certificates").insert({
        user_id: user.id,
        module,
        title: `${MODULE_LABELS[module] || module} Mock Test`,
        score: correct,
        total_questions: questions.length,
        user_name: userName,
        completed_at: new Date().toISOString(),
      });
      if (certError) {
        console.error("Certificate save error:", certError);
      } else {
        setCertificateSaved(true);
      }
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const currentQ = questions[currentIndex];
  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">
            {generating
              ? "AI is generating questions for you... This may take a moment."
              : "Loading questions..."}
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
          <h2 className="text-2xl font-bold text-foreground mb-4">
            No questions available
          </h2>
          <Button onClick={() => navigate("/modules")}>Back to Modules</Button>
        </main>
        <Footer />
      </div>
    );
  }

  // Results screen
  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-12 container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-8"
          >
            <Trophy className="w-16 h-16 text-accent mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Test Complete!
            </h2>
            <p className="text-xl text-muted-foreground">
              {MODULE_LABELS[module || ""] || "Mock Test"}
            </p>
          </motion.div>

          <Card className="mb-8">
            <CardContent className="p-8 text-center">
              <div className="text-6xl font-bold text-primary mb-2">
                {percentage}%
              </div>
              <p className="text-lg text-muted-foreground">
                {score} / {questions.length} correct
              </p>
              <div className="w-full bg-muted rounded-full h-3 mt-4">
                <div
                  className="bg-primary h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Certificate */}
          {certificateSaved && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-accent" />
                <h3 className="text-xl font-bold text-foreground">Your Certificate</h3>
              </div>
              <CertificateCard
                userName={user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Student"}
                module={module || ""}
                score={score}
                totalQuestions={questions.length}
                completedAt={new Date().toISOString()}
              />
            </motion.div>
          )}

          {/* Review answers */}
          <div className="space-y-4 mb-8">
            <h3 className="text-xl font-bold text-foreground">Review Answers</h3>
            {questions.map((q, i) => {
              const userAns = answers[i];
              const isCorrect = userAns === q.correct_option;
              return (
                <Card
                  key={q.id}
                  className={`border-l-4 ${isCorrect ? "border-l-secondary" : "border-l-destructive"}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-2 mb-2">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
                      )}
                      <p className="font-medium text-foreground text-sm">
                        Q{i + 1}. {q.question}
                      </p>
                    </div>
                    <div className="ml-7 text-sm space-y-1">
                      {["A", "B", "C", "D"].map((opt) => {
                        const optKey =
                          `option_${opt.toLowerCase()}` as keyof Question;
                        const isUserChoice = userAns === opt;
                        const isAnswer = q.correct_option === opt;
                        return (
                          <div
                            key={opt}
                            className={`px-2 py-1 rounded ${
                              isAnswer
                                ? "bg-secondary/10 text-secondary font-medium"
                                : isUserChoice
                                  ? "bg-destructive/10 text-destructive"
                                  : "text-muted-foreground"
                            }`}
                          >
                            {opt}. {q[optKey] as string}
                          </div>
                        );
                      })}
                      {q.explanation && (
                        <p className="text-muted-foreground mt-2 italic">
                          💡 {q.explanation}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              variant="outline"
              onClick={() => navigate("/modules")}
            >
              <Home className="w-4 h-4 mr-2" /> Back to Modules
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/certificates")}
            >
              <Award className="w-4 h-4 mr-2" /> All Certificates
            </Button>
            <Button
              onClick={() => {
                setSubmitted(false);
                setAnswers({});
                setCurrentIndex(0);
                setTimeLeft(15 * 60);
                setScore(0);
                setShowHint({});
                setCertificateSaved(false);
                fetchQuestions();
              }}
            >
              <RotateCcw className="w-4 h-4 mr-2" /> Retake Test
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Test-taking screen
  return (
    <div className="min-h-screen bg-background select-none" style={{ userSelect: "none" }}>
      {/* Fullscreen warning */}
      {examStarted && !isFullscreen && (
        <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center space-y-4 p-8">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
              <Clock className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Exam Mode Required</h2>
            <p className="text-muted-foreground max-w-md">
              This test requires full-screen mode. Please click below to re-enter the exam.
              {exitAttempts > 0 && (
                <span className="block mt-2 text-destructive font-medium">
                  ⚠️ {exitAttempts} exit attempt(s) recorded.
                </span>
              )}
            </p>
            <Button onClick={enterFullscreen} size="lg">
              Re-enter Full Screen
            </Button>
          </div>
        </div>
      )}
      <main className="pt-8 pb-12 container mx-auto px-4 max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">
            {MODULE_LABELS[module || ""] || "Mock Test"}
          </h2>
          <div className="flex items-center gap-2 text-primary font-mono text-lg font-bold">
            <Clock className="w-5 h-5" />
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-muted rounded-full h-2 mb-6">
          <div
            className="bg-primary h-2 rounded-full transition-all"
            style={{
              width: `${((Object.keys(answers).length) / questions.length) * 100}%`,
            }}
          />
        </div>

        {/* Question */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
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
              <CardTitle className="text-lg leading-relaxed">
                {currentQ.question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={answers[currentIndex] || ""}
                onValueChange={(v) =>
                  setAnswers((prev) => ({ ...prev, [currentIndex]: v }))
                }
                className="space-y-3"
              >
                {(["A", "B", "C", "D"] as const).map((opt) => {
                  const optKey =
                    `option_${opt.toLowerCase()}` as keyof Question;
                  return (
                    <Label
                      key={opt}
                      htmlFor={`opt-${opt}`}
                      className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                        answers[currentIndex] === opt
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <RadioGroupItem value={opt} id={`opt-${opt}`} />
                      <span className="text-foreground">
                        {opt}. {currentQ[optKey] as string}
                      </span>
                    </Label>
                  );
                })}
              </RadioGroup>

              {/* Hint */}
              {currentQ.explanation && (
                <div className="mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowHint((prev) => ({ ...prev, [currentIndex]: !prev[currentIndex] }))}
                    className="text-accent-foreground"
                  >
                    <Lightbulb className="w-4 h-4 mr-1 text-accent" />
                    {showHint[currentIndex] ? "Hide Hint" : "Show Hint"}
                  </Button>
                  {showHint[currentIndex] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-2 p-3 bg-accent/10 rounded-lg text-sm text-muted-foreground border border-accent/20"
                    >
                      💡 {currentQ.explanation}
                    </motion.div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((p) => p - 1)}
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
          </Button>

          {/* Question dots */}
          <div className="hidden md:flex gap-1 flex-wrap max-w-md justify-center">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-3 h-3 rounded-full transition-all ${
                  i === currentIndex
                    ? "bg-primary scale-125"
                    : answers[i]
                      ? "bg-primary/40"
                      : "bg-muted-foreground/20"
                }`}
              />
            ))}
          </div>

          {currentIndex === questions.length - 1 ? (
            <Button onClick={handleSubmit}>
              Submit Test <CheckCircle2 className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={() => setCurrentIndex((p) => p + 1)}>
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default MockTest;
