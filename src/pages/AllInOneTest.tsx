import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PreTestRevision } from "@/components/PreTestRevision";
import { onMockCompleted } from "@/lib/gamification";
import {
  Loader2, Clock, Trophy, CheckCircle2, XCircle, Building2,
  Brain, Code2, MessageSquare, Sparkles, RotateCcw, Home,
} from "lucide-react";

interface MCQ {
  question: string; option_a: string; option_b: string; option_c: string; option_d: string;
  correct_option: "A"|"B"|"C"|"D"; difficulty: "easy"|"medium"|"hard"; explanation: string;
  section: "aptitude"|"reasoning"|"verbal";
}
interface CodingQ {
  title: string; description: string; example_input: string; example_output: string;
  approach: string; solution_code: string; language: string;
}

const COMPANY_CATEGORIES: Record<string, { id: string; name: string; color: string; desc: string }[]> = {
  "Tier-1 IT Services": [
    { id: "TCS", name: "TCS", color: "from-blue-600 to-indigo-700", desc: "NQT pattern · Apt + Reasoning + Verbal + Code" },
    { id: "Infosys", name: "Infosys", color: "from-emerald-600 to-teal-700", desc: "InfyTQ style · Mixed sections + Pseudocode" },
    { id: "Wipro", name: "Wipro", color: "from-violet-600 to-purple-700", desc: "Elite NLTH · Apt + Reasoning + Coding" },
    { id: "HCL", name: "HCL Tech", color: "from-sky-600 to-blue-700", desc: "TechBee/HCL HIRE · Apt + Tech MCQs + Code" },
    { id: "Tech Mahindra", name: "Tech Mahindra", color: "from-red-600 to-rose-700", desc: "Aptitude + Reasoning + Essay + Coding" },
    { id: "LTIMindtree", name: "LTIMindtree", color: "from-indigo-600 to-blue-700", desc: "Apt + Logical + Verbal + Coding" },
    { id: "Mphasis", name: "Mphasis", color: "from-fuchsia-600 to-purple-700", desc: "AMCAT-style · Apt + Tech + Code" },
    { id: "Hexaware", name: "Hexaware", color: "from-teal-600 to-emerald-700", desc: "Aptitude + Reasoning + Coding" },
  ],
  "Consulting & Global Services": [
    { id: "Cognizant", name: "Cognizant", color: "from-cyan-600 to-blue-700", desc: "GenC pattern · Logical + Verbal heavy" },
    { id: "Accenture", name: "Accenture", color: "from-rose-600 to-pink-700", desc: "Cognitive + Technical + Coding" },
    { id: "Capgemini", name: "Capgemini", color: "from-orange-600 to-amber-700", desc: "Game-based + Pseudo-code + Coding" },
    { id: "Deloitte", name: "Deloitte", color: "from-green-700 to-emerald-800", desc: "Aptitude + Case + Verbal" },
    { id: "PwC", name: "PwC India", color: "from-orange-700 to-red-700", desc: "Numerical + Logical + Verbal" },
    { id: "KPMG", name: "KPMG India", color: "from-blue-700 to-indigo-800", desc: "Aptitude + Domain + Reasoning" },
    { id: "EY", name: "EY (Ernst & Young)", color: "from-yellow-600 to-amber-700", desc: "Aptitude + Reasoning + Tech" },
  ],
  "Product / Tech (FAANG-India)": [
    { id: "Amazon", name: "Amazon", color: "from-amber-600 to-orange-700", desc: "DSA-heavy · 2 Coding + MCQs + Aptitude" },
    { id: "Microsoft", name: "Microsoft", color: "from-blue-600 to-cyan-700", desc: "DSA + OS/DBMS MCQs + Coding" },
    { id: "Google", name: "Google", color: "from-red-500 to-yellow-500", desc: "Advanced DSA + Reasoning + Coding" },
    { id: "Adobe", name: "Adobe", color: "from-red-600 to-rose-700", desc: "Aptitude + CS Fundamentals + Coding" },
    { id: "Oracle", name: "Oracle", color: "from-red-700 to-orange-800", desc: "Apt + DBMS + Coding" },
    { id: "SAP Labs", name: "SAP Labs", color: "from-blue-600 to-indigo-700", desc: "Aptitude + Tech MCQs + Coding" },
    { id: "Salesforce", name: "Salesforce", color: "from-sky-500 to-blue-600", desc: "DSA + Apex MCQs + Coding" },
    { id: "Cisco", name: "Cisco", color: "from-cyan-700 to-blue-800", desc: "Networking + Apt + Coding" },
  ],
  "Indian Product / Unicorns": [
    { id: "Flipkart", name: "Flipkart", color: "from-yellow-500 to-blue-600", desc: "DSA + Aptitude + Coding" },
    { id: "Paytm", name: "Paytm", color: "from-blue-500 to-cyan-600", desc: "Aptitude + Tech MCQs + Coding" },
    { id: "Zomato", name: "Zomato", color: "from-red-500 to-rose-600", desc: "DSA + Product + Coding" },
    { id: "Swiggy", name: "Swiggy", color: "from-orange-500 to-red-600", desc: "DSA + Apt + Coding" },
    { id: "Ola", name: "Ola", color: "from-lime-600 to-green-700", desc: "Aptitude + DSA + Coding" },
    { id: "PhonePe", name: "PhonePe", color: "from-purple-600 to-indigo-700", desc: "DSA + System Design Basics + Coding" },
    { id: "Razorpay", name: "Razorpay", color: "from-blue-600 to-violet-700", desc: "DSA + Apt + Coding" },
    { id: "Freshworks", name: "Freshworks", color: "from-green-600 to-teal-700", desc: "Aptitude + Tech + Coding" },
    { id: "Zoho", name: "Zoho", color: "from-red-600 to-rose-700", desc: "Aptitude + Coding (multi-round)" },
  ],
  "Banking & Finance": [
    { id: "Goldman Sachs", name: "Goldman Sachs", color: "from-yellow-600 to-amber-700", desc: "Quant + DSA + Coding" },
    { id: "JP Morgan", name: "JP Morgan", color: "from-blue-800 to-indigo-900", desc: "Aptitude + Tech + Coding" },
    { id: "Morgan Stanley", name: "Morgan Stanley", color: "from-sky-700 to-blue-800", desc: "Quant + DSA + Coding" },
    { id: "HDFC Bank", name: "HDFC Bank", color: "from-blue-700 to-red-700", desc: "Aptitude + Banking + Reasoning" },
    { id: "ICICI Bank", name: "ICICI Bank", color: "from-orange-700 to-red-800", desc: "Aptitude + Reasoning + Verbal" },
    { id: "Axis Bank", name: "Axis Bank", color: "from-rose-700 to-pink-800", desc: "Aptitude + Reasoning + Verbal" },
  ],
  "Core / Engineering / PSU": [
    { id: "L&T", name: "L&T", color: "from-blue-700 to-indigo-800", desc: "Aptitude + Technical (core) + Reasoning" },
    { id: "Reliance", name: "Reliance Industries", color: "from-blue-800 to-cyan-900", desc: "Aptitude + Domain + Reasoning" },
    { id: "Tata Steel", name: "Tata Steel", color: "from-slate-700 to-gray-800", desc: "Aptitude + Core Tech + Reasoning" },
    { id: "ISRO", name: "ISRO", color: "from-orange-700 to-red-800", desc: "Technical + Aptitude" },
    { id: "DRDO", name: "DRDO", color: "from-emerald-700 to-green-800", desc: "Technical + GK + Aptitude" },
    { id: "BHEL", name: "BHEL", color: "from-yellow-700 to-orange-800", desc: "Technical + Aptitude + Reasoning" },
    { id: "ONGC", name: "ONGC", color: "from-red-700 to-rose-800", desc: "Technical + Aptitude + Reasoning" },
  ],
};
const COMPANIES = Object.values(COMPANY_CATEGORIES).flat();

const TEST_DURATION = 45 * 60; // 45 minutes

const AllInOneTest = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [company, setCompany] = useState<string | null>(null);
  const [stage, setStage] = useState<"select"|"revise"|"loading"|"test"|"results">("select");
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [coding, setCoding] = useState<CodingQ[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION);
  const [activeSection, setActiveSection] = useState("aptitude");

  useEffect(() => { if (!authLoading && !user) navigate("/auth"); }, [user, authLoading, navigate]);

  // Timer
  useEffect(() => {
    if (stage !== "test") return;
    const i = setInterval(() => setTimeLeft((p) => {
      if (p <= 1) { clearInterval(i); handleSubmit(); return 0; }
      return p - 1;
    }), 1000);
    return () => clearInterval(i);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  const loadTest = async (selectedCompany: string) => {
    setStage("loading");
    try {
      const { data, error } = await supabase.functions.invoke("company-placement-test", {
        body: { company: selectedCompany, aptitudeCount: 10, reasoningCount: 10, verbalCount: 5, codingCount: 2 },
      });
      if (error) throw error;
      if (!data?.mcqs?.length) throw new Error("No questions generated");
      setMcqs(data.mcqs);
      setCoding(data.coding || []);
      setTimeLeft(TEST_DURATION);
      setAnswers({});
      setStage("test");
    } catch (e) {
      console.error(e);
      toast({ title: "Failed to generate test", description: "Please try again.", variant: "destructive" });
      setStage("select");
    }
  };

  const handleSubmit = () => {
    let correct = 0;
    mcqs.forEach((q, i) => { if (answers[i] === q.correct_option) correct++; });
    onMockCompleted(correct, mcqs.length, "all-in-one");
    setStage("results");
  };

  const fmt = (s: number) => `${Math.floor(s/60).toString().padStart(2,"0")}:${(s%60).toString().padStart(2,"0")}`;

  const sectionQuestions = (sec: string) => mcqs.map((q, i) => ({ ...q, originalIndex: i })).filter((q) => q.section === sec);
  const score = mcqs.reduce((s, q, i) => s + (answers[i] === q.correct_option ? 1 : 0), 0);
  const pct = mcqs.length ? Math.round((score / mcqs.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16 container mx-auto px-4 max-w-5xl">
        {/* Hero header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
            <Sparkles className="w-3 h-3" /> All-in-One Placement Simulator
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Full Company-Style Mock Test</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Realistic placement simulation with Aptitude, Reasoning, Verbal and Coding sections — modeled on the actual exam patterns of top recruiters.
          </p>
        </motion.div>

        {/* STAGE: SELECT */}
        {stage === "select" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {COMPANIES.map((c, idx) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}>
                <Card className="cursor-pointer h-full hover:shadow-lg transition-shadow border-border hover:border-primary/40" onClick={() => { setCompany(c.id); setStage("revise"); }}>
                  <div className={`h-1.5 bg-gradient-to-r ${c.color}`} />
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} text-white flex items-center justify-center mb-2`}>
                      <Building2 className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-lg">{c.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{c.desc}</p>
                    <Button variant="ghost" size="sm" className="mt-3 -ml-2">Start Simulation →</Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* STAGE: REVISION */}
        {stage === "revise" && company && (
          <div className="max-w-3xl mx-auto space-y-4">
            <Button variant="ghost" size="sm" onClick={() => setStage("select")}>← Choose different company</Button>
            <PreTestRevision
              module="placement-simulator"
              title={`${company} Placement Simulator`}
              cacheKey={`all-in-one-${company}`}
              onStart={() => loadTest(company)}
            />
          </div>
        )}

        {/* STAGE: LOADING */}
        {stage === "loading" && (
          <Card className="max-w-md mx-auto">
            <CardContent className="p-10 text-center">
              <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-1">Generating your {company} test...</h3>
              <p className="text-sm text-muted-foreground">AI is preparing 25 MCQs + 2 coding problems based on the latest pattern.</p>
            </CardContent>
          </Card>
        )}

        {/* STAGE: TEST */}
        {stage === "test" && (
          <div>
            <div className="flex items-center justify-between mb-4 sticky top-20 bg-background/95 backdrop-blur z-10 py-2 border-b">
              <div>
                <h2 className="font-bold text-lg">{company} — Full Simulator</h2>
                <p className="text-xs text-muted-foreground">{mcqs.length} MCQs + {coding.length} Coding · Answered {Object.keys(answers).length}/{mcqs.length}</p>
              </div>
              <div className="flex items-center gap-2 text-primary font-mono font-bold">
                <Clock className="w-4 h-4" /> {fmt(timeLeft)}
              </div>
            </div>

            <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-4">
              <TabsList className="grid w-full grid-cols-4 h-11">
                <TabsTrigger value="aptitude" className="gap-1.5"><Brain className="w-4 h-4" /> Aptitude</TabsTrigger>
                <TabsTrigger value="reasoning" className="gap-1.5"><Sparkles className="w-4 h-4" /> Reasoning</TabsTrigger>
                <TabsTrigger value="verbal" className="gap-1.5"><MessageSquare className="w-4 h-4" /> Verbal</TabsTrigger>
                <TabsTrigger value="coding" className="gap-1.5"><Code2 className="w-4 h-4" /> Coding</TabsTrigger>
              </TabsList>

              {["aptitude", "reasoning", "verbal"].map((sec) => (
                <TabsContent key={sec} value={sec} className="space-y-4">
                  {sectionQuestions(sec).map((q, idx) => (
                    <Card key={q.originalIndex}>
                      <CardHeader>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground">Q{idx + 1}</span>
                          <Badge variant="outline" className="text-[10px]">{q.difficulty}</Badge>
                        </div>
                        <CardTitle className="text-base leading-relaxed">{q.question}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <RadioGroup
                          value={answers[q.originalIndex] || ""}
                          onValueChange={(v) => setAnswers((p) => ({ ...p, [q.originalIndex]: v }))}
                        >
                          {(["A","B","C","D"] as const).map((opt) => (
                            <div key={opt} className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 cursor-pointer">
                              <RadioGroupItem value={opt} id={`q${q.originalIndex}-${opt}`} />
                              <Label htmlFor={`q${q.originalIndex}-${opt}`} className="cursor-pointer flex-1 text-sm">
                                <span className="font-medium mr-2">{opt}.</span>{(q as any)[`option_${opt.toLowerCase()}`]}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              ))}

              <TabsContent value="coding" className="space-y-4">
                {coding.map((c, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <CardTitle className="text-lg">Problem {i + 1}: {c.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <p className="text-foreground/90 whitespace-pre-wrap">{c.description}</p>
                      <div className="grid sm:grid-cols-2 gap-2">
                        <div className="p-3 rounded bg-muted">
                          <div className="text-xs font-semibold mb-1">Example Input</div>
                          <pre className="text-xs">{c.example_input}</pre>
                        </div>
                        <div className="p-3 rounded bg-muted">
                          <div className="text-xs font-semibold mb-1">Example Output</div>
                          <pre className="text-xs">{c.example_output}</pre>
                        </div>
                      </div>
                      <details className="rounded border border-border p-3">
                        <summary className="font-semibold cursor-pointer text-primary">💡 Show Approach & Solution</summary>
                        <div className="mt-2 space-y-2">
                          <p className="text-xs text-foreground/80 whitespace-pre-wrap">{c.approach}</p>
                          <pre className="p-3 rounded bg-muted text-xs overflow-x-auto"><code>{c.solution_code}</code></pre>
                        </div>
                      </details>
                    </CardContent>
                  </Card>
                ))}
                <p className="text-xs text-muted-foreground text-center">Try solving on paper — solutions are revealed for self-evaluation. Want full IDE? Use <a className="text-primary underline" href="/programming">Programming Hub</a>.</p>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end mt-6 sticky bottom-4 z-10">
              <Button size="lg" onClick={handleSubmit} className="shadow-lg">
                Submit Test
              </Button>
            </div>
          </div>
        )}

        {/* STAGE: RESULTS */}
        {stage === "results" && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-3xl mx-auto">
            <Card className="mb-6 text-center">
              <CardContent className="p-8">
                <Trophy className="w-14 h-14 text-accent mx-auto mb-3" />
                <h2 className="text-2xl font-bold">{company} Simulator Complete!</h2>
                <div className="text-6xl font-bold text-primary my-4">{pct}%</div>
                <p className="text-muted-foreground">{score} / {mcqs.length} MCQs correct</p>
                <Progress value={pct} className="h-3 mt-4" />
                <p className="text-xs text-muted-foreground mt-3">XP & badges have been awarded 🎉</p>
              </CardContent>
            </Card>

            <h3 className="font-bold text-lg mb-3">Review Answers</h3>
            <div className="space-y-3 mb-6">
              {mcqs.map((q, i) => {
                const u = answers[i];
                const ok = u === q.correct_option;
                return (
                  <Card key={i} className={`border-l-4 ${ok ? "border-l-secondary" : "border-l-destructive"}`}>
                    <CardContent className="p-4 text-sm">
                      <div className="flex items-start gap-2 mb-2">
                        {ok ? <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 shrink-0" /> : <XCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />}
                        <p className="font-medium">[{q.section.toUpperCase()}] Q{i+1}. {q.question}</p>
                      </div>
                      <div className="ml-6 space-y-1">
                        {(["A","B","C","D"] as const).map((opt) => {
                          const isAns = q.correct_option === opt;
                          const isChosen = u === opt;
                          return (
                            <div key={opt} className={`px-2 py-1 rounded text-xs ${isAns ? "bg-secondary/10 text-secondary font-medium" : isChosen ? "bg-destructive/10 text-destructive" : "text-muted-foreground"}`}>
                              {opt}. {(q as any)[`option_${opt.toLowerCase()}`]}
                            </div>
                          );
                        })}
                        {q.explanation && <p className="text-xs text-muted-foreground italic mt-2">💡 {q.explanation}</p>}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="flex gap-3 justify-center flex-wrap">
              <Button variant="outline" onClick={() => { setStage("select"); setCompany(null); }}><Home className="w-4 h-4 mr-1" /> Pick Another Company</Button>
              <Button onClick={() => company && loadTest(company)}><RotateCcw className="w-4 h-4 mr-1" /> Retake</Button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default AllInOneTest;
