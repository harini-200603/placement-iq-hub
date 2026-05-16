import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  Code2,
  Play,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronRight,
  RotateCcw,
  Home,
  Lightbulb,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { onCodingSolved } from "@/lib/gamification";

interface CodingProblem {
  title: string;
  description: string;
  examples: { input: string; output: string }[];
  constraints: string[];
  difficulty: "easy" | "medium" | "hard";
  testCases: { input: string; expectedOutput: string }[];
  starterCode: Record<string, string>;
  hints: string[];
}

const LANGUAGES = ["python", "java", "c", "cpp", "javascript"] as const;
type Language = typeof LANGUAGES[number];

const LANGUAGE_LABELS: Record<Language, string> = {
  python: "Python",
  java: "Java",
  c: "C",
  cpp: "C++",
  javascript: "JavaScript",
};

const CodingPractice = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [problem, setProblem] = useState<CodingProblem | null>(null);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [language, setLanguage] = useState<Language>("python");
  const [code, setCode] = useState("");
  const [results, setResults] = useState<{ passed: boolean; input: string; expected: string; got: string }[] | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [problemIndex, setProblemIndex] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  const fetchProblem = async () => {
    setLoading(true);
    setResults(null);
    setShowHints(false);
    try {
      const { data, error } = await supabase.functions.invoke("coding-problem", {
        body: { difficulty: ["easy", "medium", "hard"][problemIndex % 3], index: problemIndex },
      });
      if (error) throw error;
      const p = data.problem as CodingProblem;
      setProblem(p);
      setCode(p.starterCode[language] || "");
    } catch (e) {
      console.error(e);
      toast({ title: "Failed to load coding problem", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchProblem();
  }, [user, problemIndex]);

  useEffect(() => {
    if (problem) {
      setCode(problem.starterCode[language] || "");
    }
  }, [language]);

  const handleRun = async () => {
    if (!code.trim() || !problem) return;
    setEvaluating(true);
    try {
      const { data, error } = await supabase.functions.invoke("evaluate-code", {
        body: { code, language, problem: problem.title, testCases: problem.testCases },
      });
      if (error) throw error;
      setResults(data.results);
      const allPassed = data.results.every((r: any) => r.passed);
      if (allPassed) onCodingSolved(language);
      toast({
        title: allPassed ? "All test cases passed! 🎉" : "Some test cases failed",
        variant: allPassed ? "default" : "destructive",
      });
    } catch (e) {
      console.error(e);
      toast({ title: "Evaluation failed", variant: "destructive" });
    } finally {
      setEvaluating(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-12 container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Failed to load problem</h2>
          <Button onClick={() => navigate("/preparation/technical")}>Back</Button>
        </main>
        <Footer />
      </div>
    );
  }

  const diffColor: Record<string, string> = {
    easy: "bg-secondary/10 text-secondary",
    medium: "bg-accent/10 text-accent-foreground",
    hard: "bg-destructive/10 text-destructive",
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-12 container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Code2 className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Coding Practice</h1>
          </div>
          <Button variant="outline" onClick={() => navigate("/preparation/technical")}>
            <Home className="w-4 h-4 mr-1" /> Back
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Problem description */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{problem.title}</CardTitle>
                <Badge className={diffColor[problem.difficulty]}>{problem.difficulty}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-foreground whitespace-pre-wrap">{problem.description}</p>

              <div>
                <h4 className="font-semibold text-sm text-foreground mb-2">Examples:</h4>
                {problem.examples.map((ex, i) => (
                  <div key={i} className="bg-muted rounded-lg p-3 mb-2 text-sm font-mono">
                    <div><span className="text-muted-foreground">Input:</span> {ex.input}</div>
                    <div><span className="text-muted-foreground">Output:</span> {ex.output}</div>
                  </div>
                ))}
              </div>

              {problem.constraints.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm text-foreground mb-1">Constraints:</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {problem.constraints.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                </div>
              )}

              <Button variant="ghost" size="sm" onClick={() => setShowHints(!showHints)}>
                <Lightbulb className="w-4 h-4 mr-1 text-accent" />
                {showHints ? "Hide Hints" : "Show Hints"}
              </Button>
              {showHints && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-accent/10 rounded-lg text-sm text-muted-foreground border border-accent/20">
                  {problem.hints.map((h, i) => <p key={i}>💡 {h}</p>)}
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Code editor */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Select value={language} onValueChange={(v) => setLanguage(v as Language)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((l) => (
                    <SelectItem key={l} value={l}>{LANGUAGE_LABELS[l]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleRun} disabled={evaluating || !code.trim()}>
                {evaluating ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Play className="w-4 h-4 mr-1" />}
                Run & Evaluate
              </Button>
            </div>

            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="font-mono text-sm min-h-[400px] bg-card"
              placeholder="Write your code here..."
              spellCheck={false}
            />

            {/* Test results */}
            {results && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Test Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {results.map((r, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg border text-sm ${
                        r.passed ? "border-secondary/30 bg-secondary/5" : "border-destructive/30 bg-destructive/5"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {r.passed ? <CheckCircle2 className="w-4 h-4 text-secondary" /> : <XCircle className="w-4 h-4 text-destructive" />}
                        <span className="font-medium">Test Case {i + 1}: {r.passed ? "Passed" : "Failed"}</span>
                      </div>
                      <div className="font-mono text-xs text-muted-foreground">
                        <div>Input: {r.input}</div>
                        <div>Expected: {r.expected}</div>
                        {!r.passed && <div className="text-destructive">Got: {r.got}</div>}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setProblemIndex((p) => p + 1);
                setCode("");
                setResults(null);
              }}
            >
              <ChevronRight className="w-4 h-4 mr-1" /> Next Problem
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CodingPractice;
