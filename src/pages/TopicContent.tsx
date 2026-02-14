import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AIChatBox } from "@/components/AIChatBox";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Play, Loader2, RefreshCw } from "lucide-react";

const TOPIC_LABELS: Record<string, string> = {
  "problems-on-trains": "Problems on Trains",
  "time-and-distance": "Time and Distance",
  "height-and-distance": "Height and Distance",
  "time-and-work": "Time and Work",
  "simple-interest": "Simple Interest",
  "compound-interest": "Compound Interest",
  "profit-and-loss": "Profit and Loss",
  partnership: "Partnership",
  percentage: "Percentage",
  "problems-on-ages": "Problems on Ages",
  calendar: "Calendar",
  clock: "Clock",
  average: "Average",
  area: "Area",
  "volume-and-surface-area": "Volume and Surface Area",
  "permutation-and-combination": "Permutation and Combination",
  numbers: "Numbers",
  "problems-on-numbers": "Problems on Numbers",
  "problems-on-hcf-and-lcm": "Problems on H.C.F and L.C.M",
  "decimal-fraction": "Decimal Fraction",
  simplification: "Simplification",
  "square-root-and-cube-root": "Square Root and Cube Root",
  "surds-and-indices": "Surds and Indices",
  "ratio-and-proportion": "Ratio and Proportion",
  "chain-rule": "Chain Rule",
  "pipes-and-cistern": "Pipes and Cistern",
  "boats-and-streams": "Boats and Streams",
  "alligation-or-mixture": "Alligation or Mixture",
  logarithm: "Logarithm",
  "races-and-games": "Races and Games",
  "stocks-and-shares": "Stocks and Shares",
  probability: "Probability",
  "true-discount": "True Discount",
  "bankers-discount": "Banker's Discount",
  "odd-man-out-and-series": "Odd Man Out and Series",
  "spotting-errors": "Spotting Errors",
  "sentence-correction": "Sentence Correction",
  synonyms: "Synonyms",
  antonyms: "Antonyms",
  "ordering-of-sentences": "Ordering of Sentences",
  "idioms-and-phrases": "Idioms and Phrases",
  "one-word-substitutes": "One Word Substitutes",
  "reading-comprehension": "Reading Comprehension",
  "data-structures": "Data Structures",
  algorithms: "Algorithms",
  "oop-concepts": "OOP Concepts",
  dbms: "DBMS",
  "operating-systems": "Operating Systems",
  networking: "Networking",
  "sql-queries": "SQL Queries",
  "c-cpp-basics": "C/C++ Basics",
  "java-programming": "Java Programming",
  "python-programming": "Python Programming",
  "hr-questions": "HR Questions",
  "behavioral-questions": "Behavioral Questions",
  "group-discussion": "Group Discussion",
  "technical-interview": "Technical Interview",
};

const CONTENT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/topic-chat`;

const TopicContent = () => {
  const { module, topic } = useParams<{ module: string; topic: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  const topicLabel = TOPIC_LABELS[topic || ""] || topic || "Topic";

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user || !topic || !module) return;
    generateContent();
  }, [user, topic, module]);

  const generateContent = async () => {
    setLoading(true);
    setContent("");

    try {
      const resp = await fetch(CONTENT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          topic: topicLabel,
          module: module,
          action: "generate-content",
          messages: [{ role: "user", content: `Explain the topic "${topicLabel}" comprehensively for placement preparation.` }],
        }),
      });

      if (!resp.ok || !resp.body) throw new Error("Failed to load content");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let idx: number;
        while ((idx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const parsed = JSON.parse(json);
            const c = parsed.choices?.[0]?.delta?.content;
            if (c) {
              accumulated += c;
              setContent(accumulated);
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      setContent("# ❌ Failed to load content\n\nPlease try refreshing the page.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-12 container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate(`/preparation/${module}`)}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{topicLabel}</h1>
                <p className="text-sm text-muted-foreground">Study the concepts below, then take the test</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={generateContent} disabled={loading}>
                <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} />
                Regenerate
              </Button>
              <Button size="sm" onClick={() => navigate(`/mock-test/${module}?topic=${topic}`)}>
                <Play className="w-4 h-4 mr-1" />
                Take Test
              </Button>
            </div>
          </div>
        </motion.div>

        <Card>
          <CardContent className="p-6 sm:p-8">
            {loading && !content ? (
              <div className="text-center py-12 space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
                <p className="text-muted-foreground">AI is generating study material for you...</p>
              </div>
            ) : (
              <div className="prose prose-sm sm:prose-base max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground/90 prose-li:text-foreground/90 prose-strong:text-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />

      <AIChatBox topic={topicLabel} module={module || "aptitude"} />
    </div>
  );
};

export default TopicContent;
