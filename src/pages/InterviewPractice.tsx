import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  Mic,
  MicOff,
  Loader2,
  Home,
  ChevronRight,
  MessageSquare,
  Volume2,
  BookOpen,
  RotateCcw,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from "react-markdown";

interface HRQuestion {
  question: string;
  tips: string[];
  sampleAnswer: string;
}

const InterviewPractice = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("hr-interview");
  const [hrQuestions, setHrQuestions] = useState<HRQuestion[]>([]);
  const [currentHRIndex, setCurrentHRIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiFeedback, setAiFeedback] = useState("");
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Reading assessment state
  const [readingPassage, setReadingPassage] = useState("");
  const [readingLoading, setReadingLoading] = useState(false);
  const [readingTranscript, setReadingTranscript] = useState("");
  const [readingRecording, setReadingRecording] = useState(false);
  const [readingFeedback, setReadingFeedback] = useState("");
  const readingRecognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  // Load HR questions
  const loadHRQuestions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("interview-hr", {
        body: { action: "get-questions" },
      });
      if (error) throw error;
      setHrQuestions(data.questions || []);
    } catch (e) {
      console.error(e);
      toast({ title: "Failed to load HR questions", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const loadReadingPassage = async () => {
    setReadingLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("interview-hr", {
        body: { action: "get-reading-passage" },
      });
      if (error) throw error;
      setReadingPassage(data.passage || "");
    } catch (e) {
      console.error(e);
      toast({ title: "Failed to load passage", variant: "destructive" });
    } finally {
      setReadingLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadHRQuestions();
      loadReadingPassage();
    }
  }, [user]);

  // Speech recognition for HR
  const startRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({ title: "Speech recognition not supported. Please use Chrome.", variant: "destructive" });
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    let finalTranscript = "";
    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + " ";
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      setTranscript(finalTranscript + interim);
    };
    recognition.onerror = (e: any) => {
      console.error("Speech error:", e);
      setIsRecording(false);
    };
    recognition.onend = () => setIsRecording(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
    setTranscript("");
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  };

  const getAIFeedback = async () => {
    if (!transcript.trim()) return;
    setFeedbackLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("interview-hr", {
        body: {
          action: "evaluate-answer",
          question: hrQuestions[currentHRIndex]?.question,
          answer: transcript,
        },
      });
      if (error) throw error;
      setAiFeedback(data.feedback || "");
    } catch (e) {
      console.error(e);
      toast({ title: "Failed to get feedback", variant: "destructive" });
    } finally {
      setFeedbackLoading(false);
    }
  };

  // Reading assessment recording
  const startReadingRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({ title: "Speech recognition not supported. Please use Chrome.", variant: "destructive" });
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    let finalTranscript = "";
    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + " ";
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      setReadingTranscript(finalTranscript + interim);
    };
    recognition.onerror = () => setReadingRecording(false);
    recognition.onend = () => setReadingRecording(false);
    readingRecognitionRef.current = recognition;
    recognition.start();
    setReadingRecording(true);
    setReadingTranscript("");
  };

  const stopReadingRecording = () => {
    readingRecognitionRef.current?.stop();
    setReadingRecording(false);
  };

  const getReadingFeedback = async () => {
    if (!readingTranscript.trim()) return;
    setFeedbackLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("interview-hr", {
        body: {
          action: "evaluate-reading",
          passage: readingPassage,
          spoken: readingTranscript,
        },
      });
      if (error) throw error;
      setReadingFeedback(data.feedback || "");
    } catch (e) {
      console.error(e);
      toast({ title: "Failed to get feedback", variant: "destructive" });
    } finally {
      setFeedbackLoading(false);
    }
  };

  const currentHR = hrQuestions[currentHRIndex];

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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Interview Preparation</h1>
          <Button variant="outline" onClick={() => navigate("/preparation/interview")}>
            <Home className="w-4 h-4 mr-1" /> Back
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="hr-interview">
              <Mic className="w-4 h-4 mr-1" /> HR Interview
            </TabsTrigger>
            <TabsTrigger value="reading">
              <BookOpen className="w-4 h-4 mr-1" /> Reading Ability
            </TabsTrigger>
          </TabsList>

          {/* HR Interview Tab */}
          <TabsContent value="hr-interview">
            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                <p className="text-muted-foreground mt-2">Loading HR questions...</p>
              </div>
            ) : currentHR ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Question {currentHRIndex + 1} of {hrQuestions.length}
                      </span>
                    </div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-primary" />
                      {currentHR.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 p-3 bg-muted rounded-lg text-sm">
                      <h4 className="font-semibold text-foreground mb-1">Tips:</h4>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        {currentHR.tips.map((t, i) => <li key={i}>{t}</li>)}
                      </ul>
                    </div>

                    {/* Record button */}
                    <div className="text-center space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Click the mic to record your answer. Speak naturally as you would in an interview.
                      </p>
                      <Button
                        size="lg"
                        variant={isRecording ? "destructive" : "default"}
                        onClick={isRecording ? stopRecording : startRecording}
                        className="rounded-full w-16 h-16"
                      >
                        {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                      </Button>
                      {isRecording && (
                        <motion.p
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="text-destructive text-sm font-medium"
                        >
                          🔴 Recording...
                        </motion.p>
                      )}
                    </div>

                    {transcript && (
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-foreground mb-1">Your Answer:</h4>
                        <div className="p-3 bg-card border rounded-lg text-sm text-foreground">
                          {transcript}
                        </div>
                        <Button onClick={getAIFeedback} disabled={feedbackLoading} className="mt-3">
                          {feedbackLoading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Volume2 className="w-4 h-4 mr-1" />}
                          Get AI Feedback
                        </Button>
                      </div>
                    )}

                    {aiFeedback && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg text-sm"
                      >
                        <h4 className="font-semibold text-foreground mb-2">AI Feedback:</h4>
                        <div className="prose prose-sm max-w-none text-foreground">
                          <ReactMarkdown>{aiFeedback}</ReactMarkdown>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    disabled={currentHRIndex === 0}
                    onClick={() => {
                      setCurrentHRIndex((p) => p - 1);
                      setTranscript("");
                      setAiFeedback("");
                    }}
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => {
                      setCurrentHRIndex((p) => Math.min(p + 1, hrQuestions.length - 1));
                      setTranscript("");
                      setAiFeedback("");
                    }}
                    disabled={currentHRIndex === hrQuestions.length - 1}
                  >
                    Next Question <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">No questions loaded.</div>
            )}
          </TabsContent>

          {/* Reading Ability Tab */}
          <TabsContent value="reading">
            {readingLoading ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
              </div>
            ) : (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary" />
                      Read the passage aloud
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-muted rounded-lg text-foreground leading-relaxed mb-4 text-sm">
                      {readingPassage || "Loading passage..."}
                    </div>

                    <div className="text-center space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Click the mic and read the passage aloud. AI will evaluate your pronunciation and fluency.
                      </p>
                      <Button
                        size="lg"
                        variant={readingRecording ? "destructive" : "default"}
                        onClick={readingRecording ? stopReadingRecording : startReadingRecording}
                        className="rounded-full w-16 h-16"
                      >
                        {readingRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                      </Button>
                      {readingRecording && (
                        <motion.p
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="text-destructive text-sm font-medium"
                        >
                          🔴 Recording...
                        </motion.p>
                      )}
                    </div>

                    {readingTranscript && (
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-foreground mb-1">What we heard:</h4>
                        <div className="p-3 bg-card border rounded-lg text-sm text-foreground">
                          {readingTranscript}
                        </div>
                        <Button onClick={getReadingFeedback} disabled={feedbackLoading} className="mt-3">
                          {feedbackLoading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : null}
                          Evaluate Reading
                        </Button>
                      </div>
                    )}

                    {readingFeedback && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg text-sm"
                      >
                        <h4 className="font-semibold text-foreground mb-2">Reading Assessment:</h4>
                        <div className="prose prose-sm max-w-none text-foreground">
                          <ReactMarkdown>{readingFeedback}</ReactMarkdown>
                        </div>
                      </motion.div>
                    )}

                    <div className="mt-4 flex justify-center">
                      <Button variant="outline" onClick={() => { loadReadingPassage(); setReadingTranscript(""); setReadingFeedback(""); }}>
                        <RotateCcw className="w-4 h-4 mr-1" /> New Passage
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default InterviewPractice;
