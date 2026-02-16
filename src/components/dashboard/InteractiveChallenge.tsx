import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, RefreshCw, CheckCircle, XCircle, Lightbulb, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const quickChallenges = [
  {
    question: "If a train travels 360 km in 4 hours, what is its speed in m/s?",
    options: ["25 m/s", "30 m/s", "20 m/s", "15 m/s"],
    correct: 0,
    hint: "First find km/h, then multiply by 5/18",
    category: "Aptitude",
  },
  {
    question: "What is the output of: print(type([]) == list)",
    options: ["True", "False", "Error", "None"],
    correct: 0,
    hint: "type([]) returns <class 'list'>, which equals list",
    category: "Technical",
  },
  {
    question: "Choose the correct sentence:",
    options: [
      "He don't know nothing",
      "He doesn't know anything",
      "He don't know anything",
      "He doesn't know nothing",
    ],
    correct: 1,
    hint: "Avoid double negatives; use 'doesn't' with singular subjects",
    category: "Verbal",
  },
  {
    question: "What does SQL JOIN do?",
    options: [
      "Deletes matching rows",
      "Combines rows from two tables",
      "Creates a new table",
      "Sorts the table",
    ],
    correct: 1,
    hint: "JOIN connects records based on a common column",
    category: "Technical",
  },
  {
    question: "A number increased by 20% gives 240. Find the number.",
    options: ["180", "200", "220", "192"],
    correct: 1,
    hint: "x × 1.2 = 240, so x = 240/1.2",
    category: "Aptitude",
  },
  {
    question: "Which keyword is used for inheritance in Java?",
    options: ["implements", "extends", "inherits", "super"],
    correct: 1,
    hint: "A class 'extends' another class to inherit",
    category: "Technical",
  },
  {
    question: "Find the odd one out: Apple, Mango, Potato, Banana",
    options: ["Apple", "Mango", "Potato", "Banana"],
    correct: 2,
    hint: "Three are fruits, one is a vegetable",
    category: "Aptitude",
  },
  {
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    correct: 1,
    hint: "It halves the search space each step",
    category: "Technical",
  },
];

export const InteractiveChallenge = () => {
  const [currentIdx, setCurrentIdx] = useState(() => Math.floor(Math.random() * quickChallenges.length));
  const [selected, setSelected] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [timerActive, setTimerActive] = useState(true);

  const challenge = quickChallenges[currentIdx];

  useEffect(() => {
    if (!timerActive || selected !== null) return;
    if (timeLeft <= 0) {
      setSelected(-1); // timeout
      setStreak(0);
      setTimerActive(false);
      return;
    }
    const t = setTimeout(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, timerActive, selected]);

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setTimerActive(false);
    if (idx === challenge.correct) {
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
  };

  const next = () => {
    let nextIdx: number;
    do {
      nextIdx = Math.floor(Math.random() * quickChallenges.length);
    } while (nextIdx === currentIdx && quickChallenges.length > 1);
    setCurrentIdx(nextIdx);
    setSelected(null);
    setShowHint(false);
    setTimeLeft(15);
    setTimerActive(true);
  };

  const isCorrect = selected === challenge.correct;
  const isTimeout = selected === -1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="border-border shadow-soft overflow-hidden">
        <CardHeader className="pb-3 bg-gradient-to-r from-accent/10 to-primary/10">
          <CardTitle className="font-display text-xl flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" />
              Quick Challenge
            </span>
            {streak > 0 && (
              <span className="text-sm font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full">
                🔥 {streak} streak
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          {/* Timer + Category */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">
              {challenge.category}
            </span>
            <span className={`flex items-center gap-1 text-sm font-bold ${timeLeft <= 5 && selected === null ? "text-destructive animate-pulse" : "text-muted-foreground"}`}>
              <Timer className="w-4 h-4" />
              {selected !== null ? "—" : `${timeLeft}s`}
            </span>
          </div>

          {/* Question */}
          <p className="font-semibold text-foreground text-sm leading-relaxed">
            {challenge.question}
          </p>

          {/* Options */}
          <div className="grid grid-cols-1 gap-2">
            <AnimatePresence mode="wait">
              {challenge.options.map((opt, i) => {
                let cls = "border-border bg-muted/30 hover:bg-muted/60 cursor-pointer";
                if (selected !== null) {
                  if (i === challenge.correct) cls = "border-secondary bg-secondary/10 text-secondary";
                  else if (i === selected && !isCorrect) cls = "border-destructive bg-destructive/10 text-destructive";
                  else cls = "border-border bg-muted/20 opacity-50";
                }
                return (
                  <motion.button
                    key={i}
                    layout
                    onClick={() => handleSelect(i)}
                    disabled={selected !== null}
                    className={`w-full text-left p-3 rounded-lg border text-sm font-medium transition-colors ${cls}`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0">
                        {String.fromCharCode(65 + i)}
                      </span>
                      {opt}
                      {selected !== null && i === challenge.correct && (
                        <CheckCircle className="w-4 h-4 text-secondary ml-auto shrink-0" />
                      )}
                      {selected === i && !isCorrect && !isTimeout && (
                        <XCircle className="w-4 h-4 text-destructive ml-auto shrink-0" />
                      )}
                    </span>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Feedback */}
          {selected !== null && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className={`rounded-lg p-3 text-sm ${
                isCorrect
                  ? "bg-secondary/10 text-secondary border border-secondary/20"
                  : "bg-destructive/10 text-destructive border border-destructive/20"
              }`}
            >
              {isTimeout
                ? "⏰ Time's up! The correct answer is highlighted above."
                : isCorrect
                ? "🎉 Correct! Great job!"
                : "❌ Not quite. Check the correct answer above."}
            </motion.div>
          )}

          {/* Hint + Next */}
          <div className="flex items-center gap-2">
            {selected === null && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHint(true)}
                className="text-xs"
                disabled={showHint}
              >
                <Lightbulb className="w-3 h-3 mr-1" />
                {showHint ? challenge.hint : "Show Hint"}
              </Button>
            )}
            {selected !== null && (
              <Button variant="default" size="sm" onClick={next} className="ml-auto">
                <RefreshCw className="w-3 h-3 mr-1" />
                Next Challenge
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
