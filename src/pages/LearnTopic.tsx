import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { addToRevision } from "@/lib/smartFeatures";
import { onTopicCompleted } from "@/lib/gamification";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  ArrowLeft, ChevronLeft, ChevronRight, BookOpen,
  Loader2, CheckCircle2, Copy, Check, Bookmark,
} from "lucide-react";
import { getSubject, getTopic, getContentPrompt } from "@/data/learningTopics";
import { TopicQuiz } from "@/components/learn/TopicQuiz";

const STORAGE_KEY = (id: string) => `learn-progress-${id}`;
const CONTENT_KEY = (subjectId: string, topicId: string) => `learn-content-${subjectId}-${topicId}`;

const LearnTopic = () => {
  const { subjectId, topicId } = useParams<{ subjectId: string; topicId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const subject = getSubject(subjectId || "");
  const topic = getTopic(subjectId || "", topicId || "");
  const topicIndex = subject?.topics.findIndex((t) => t.id === topicId) ?? -1;

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load completion state
  useEffect(() => {
    if (!subject || !topic) return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY(subject.id));
      if (stored) {
        const arr: string[] = JSON.parse(stored);
        setIsCompleted(arr.includes(topic.id));
      }
    } catch {}
  }, [subject, topic]);

  // Load or generate content
  const loadContent = useCallback(async () => {
    if (!subject || !topic) return;
    setLoading(true);

    // Check cache first (ignore stale error fallbacks)
    const cached = localStorage.getItem(CONTENT_KEY(subject.id, topic.id));
    if (cached && !cached.includes("Content could not be loaded") && !cached.includes("being generated")) {
      setContent(cached);
      setLoading(false);
      return;
    }

    try {
      const prompt = getContentPrompt(subject, topic);
      const resp = await supabase.functions.invoke("topic-chat", {
        body: {
          messages: [{ role: "user", content: prompt }],
          module: subject.id,
          topic: topic.title,
          action: "generate-content",
        },
      });

      if (resp.error) throw resp.error;

      // Handle streaming response
      const reader = resp.data as ReadableStream;
      if (reader && typeof reader.getReader === "function") {
        const r = reader.getReader();
        const decoder = new TextDecoder();
        let full = "";

        while (true) {
          const { done, value } = await r.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ") && line !== "data: [DONE]") {
              try {
                const json = JSON.parse(line.slice(6));
                const delta = json.choices?.[0]?.delta?.content || "";
                full += delta;
                setContent(full);
              } catch {}
            }
          }
        }

        if (full) {
          localStorage.setItem(CONTENT_KEY(subject.id, topic.id), full);
        }
      } else {
        // Non-streaming fallback
        const text = resp.data?.response || resp.data?.content || "Content could not be loaded.";
        setContent(text);
        localStorage.setItem(CONTENT_KEY(subject.id, topic.id), text);
      }
    } catch (e) {
      console.error(e);
      toast({ title: "Failed to load content", variant: "destructive" });
      setContent(`# ${topic.title}\n\nContent is being generated. Please try again in a moment.`);
    } finally {
      setLoading(false);
    }
  }, [subject, topic, toast]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const toggleCompleted = async () => {
    if (!subject || !topic) return;
    const key = STORAGE_KEY(subject.id);
    let arr: string[] = [];
    try {
      const stored = localStorage.getItem(key);
      if (stored) arr = JSON.parse(stored);
    } catch {}

    const newCompleted = !isCompleted;
    if (isCompleted) {
      arr = arr.filter((id) => id !== topic.id);
    } else {
      arr.push(topic.id);
    }
    localStorage.setItem(key, JSON.stringify(arr));
    setIsCompleted(newCompleted);
    if (newCompleted) {
      onTopicCompleted();
      toast({ title: "✅ Topic marked as completed!" });
    }

    // Save to DB if logged in
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await supabase.from("student_progress").upsert({
          user_id: session.user.id,
          subject_id: subject.id,
          topic_id: topic.id,
          status: newCompleted ? "completed" : "in_progress",
          completed_at: newCompleted ? new Date().toISOString() : null,
        }, { onConflict: "user_id,subject_id,topic_id" });
      }
    } catch (e) {
      console.error("Failed to save progress:", e);
    }
  };

  const goToTopic = (index: number) => {
    if (!subject) return;
    const t = subject.topics[index];
    if (t) navigate(`/learn/${subject.id}/${t.id}`);
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!subject || !topic) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Topic not found</h2>
          <Button onClick={() => navigate("/learn")}>Back to Learn</Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Top Navigation */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate(`/learn/${subject.id}`)} className="gap-1">
              <ArrowLeft className="w-4 h-4" /> {subject.title}
            </Button>
            <Badge variant="outline" className="gap-1">
              <BookOpen className="w-3 h-3" /> Topic {topicIndex + 1} of {subject.topics.length}
            </Badge>
          </div>

          {/* Title & Completion */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">{topic.title}</h1>
              <Button
                variant={isCompleted ? "default" : "outline"}
                size="sm"
                onClick={toggleCompleted}
                className="gap-2 shrink-0"
              >
                {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Checkbox className="h-4 w-4" />}
                {isCompleted ? "Completed" : "Mark Complete"}
              </Button>
            </div>
            <p className="text-muted-foreground mt-1">{topic.description}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                addToRevision({
                  subjectId: subject.id,
                  topicId: topic.id,
                  title: `${topic.title} (${subject.title})`,
                  reason: "manual",
                  priority: "medium",
                });
                toast({ title: "📌 Added to revision queue!" });
              }}
              className="gap-1 mt-2 text-xs"
            >
              <Bookmark className="w-3 h-3" /> Add to Revision
            </Button>
          </motion.div>

          {/* Content */}
          {loading && !content ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Generating study notes for {topic.title}...</p>
              <p className="text-xs text-muted-foreground mt-1">This may take a moment</p>
            </div>
          ) : (
            <Card className="mb-8">
              <CardContent className="p-6 md:p-8 prose prose-sm max-w-none dark:prose-invert
                prose-headings:text-foreground
                prose-p:text-foreground/90
                prose-strong:text-foreground
                prose-li:text-foreground/90
                prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:text-foreground
                prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-lg
              ">
                <ReactMarkdown
                  components={{
                    pre: ({ children, ...props }) => (
                      <div className="relative group">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 h-7 text-xs gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {
                            const code = (props as any)?.node?.children?.[0]?.children?.[0]?.value || "";
                            handleCopy(code);
                          }}
                        >
                          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        </Button>
                        <pre {...props}>{children}</pre>
                      </div>
                    ),
                  }}
                >
                  {content}
                </ReactMarkdown>
              </CardContent>
            </Card>
          )}

          {/* Practice Quiz */}
          <TopicQuiz subjectId={subjectId || ""} topicId={topicId || ""} topicTitle={topic.title} />

          {/* Bottom Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Button
              variant="outline"
              disabled={topicIndex <= 0}
              onClick={() => goToTopic(topicIndex - 1)}
              className="gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={toggleCompleted}
              className="gap-2"
            >
              {isCompleted ? <CheckCircle2 className="w-4 h-4 text-secondary" /> : null}
              {isCompleted ? "Completed ✓" : "Mark as Completed"}
            </Button>

            {topicIndex < subject.topics.length - 1 ? (
              <Button onClick={() => goToTopic(topicIndex + 1)} className="gap-1">
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={() => navigate(`/learn/${subject.id}`)} className="gap-1">
                Back to {subject.title}
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LearnTopic;
