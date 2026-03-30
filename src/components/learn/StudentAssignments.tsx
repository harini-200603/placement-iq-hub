import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClipboardList, Calendar, ChevronRight, Building2 } from "lucide-react";
import { subjects } from "@/data/learningTopics";

interface Assignment {
  id: string;
  title: string;
  description: string | null;
  subject_id: string;
  topic_id: string | null;
  company_focus: string | null;
  due_date: string | null;
  created_at: string;
}

export const StudentAssignments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const load = async () => {
      const { data } = await supabase
        .from("question_assignments")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);
      if (data) setAssignments(data as Assignment[]);
      setLoading(false);
    };
    load();
  }, [user]);

  if (!user || loading || assignments.length === 0) return null;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-primary" />
          Faculty Assignments
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {assignments.map(a => {
          const sub = subjects.find(s => s.id === a.subject_id);
          const topic = sub?.topics.find(t => t.id === a.topic_id);
          const href = a.topic_id
            ? `/learn/${a.subject_id}/${a.topic_id}`
            : `/learn/${a.subject_id}`;
          return (
            <div
              key={a.id}
              className="flex items-center justify-between p-3 rounded-lg bg-card border border-border hover:border-primary/30 cursor-pointer transition-all"
              onClick={() => navigate(href)}
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm truncate">{a.title}</p>
                <div className="flex gap-2 mt-1 flex-wrap">
                  {sub && <Badge variant="outline" className="text-xs">{sub.title}</Badge>}
                  {topic && <Badge variant="secondary" className="text-xs">{topic.title}</Badge>}
                  {a.company_focus && (
                    <Badge className="text-xs gap-1">
                      <Building2 className="w-3 h-3" />{a.company_focus}
                    </Badge>
                  )}
                </div>
                {a.due_date && (
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Due: {new Date(a.due_date).toLocaleDateString()}
                  </p>
                )}
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
