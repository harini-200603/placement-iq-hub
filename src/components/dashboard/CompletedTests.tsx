import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";

interface TestAttempt {
  id: string;
  module: string;
  score: number;
  total_questions: number;
  completed_at: string | null;
  created_at: string;
}

interface CompletedTestsProps {
  tests: TestAttempt[];
}

const moduleLabels: Record<string, string> = {
  aptitude: "Aptitude",
  verbal: "Verbal Ability",
  technical: "Technical",
  interview: "Interview",
};

export const CompletedTests = ({ tests }: CompletedTestsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="lg:col-span-2"
    >
      <Card className="border-border shadow-soft">
        <CardHeader className="pb-4">
          <CardTitle className="font-display text-xl flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-secondary" />
            Completed Tests
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {tests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="font-medium">No tests completed yet</p>
              <p className="text-sm mt-1">Start a mock test to see your progress here!</p>
            </div>
          ) : (
            tests.slice(0, 6).map((test) => {
              const pct = Math.round((test.score / test.total_questions) * 100);
              return (
                <div
                  key={test.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border"
                >
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="font-semibold text-foreground truncate">
                      {moduleLabels[test.module] || test.module} Mock Test
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {test.completed_at
                        ? format(new Date(test.completed_at), "MMM d, yyyy")
                        : format(new Date(test.created_at), "MMM d, yyyy")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="w-24">
                      <Progress value={pct} className="h-2" />
                    </div>
                    <span className="text-sm font-bold text-foreground w-16 text-right">
                      {test.score}/{test.total_questions}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
