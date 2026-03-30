import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Plus, Loader2, Trash2, ClipboardList, Calendar,
} from "lucide-react";
import { subjects } from "@/data/learningTopics";

interface Assignment {
  id: string;
  title: string;
  description: string | null;
  subject_id: string;
  topic_id: string | null;
  company_focus: string | null;
  due_date: string | null;
  assign_to: string;
  created_at: string;
}

interface FacultyAssignmentsProps {
  facultyId: string;
}

export const FacultyAssignments = ({ facultyId }: FacultyAssignmentsProps) => {
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [topicId, setTopicId] = useState("");
  const [companyFocus, setCompanyFocus] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignTo, setAssignTo] = useState("all");

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    const { data } = await supabase
      .from("question_assignments")
      .select("*")
      .eq("faculty_id", facultyId)
      .order("created_at", { ascending: false });
    if (data) setAssignments(data as Assignment[]);
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!title || !subjectId) {
      toast({ title: "Title and subject are required", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("question_assignments").insert({
      faculty_id: facultyId,
      title,
      description: description || null,
      subject_id: subjectId,
      topic_id: topicId || null,
      company_focus: companyFocus || null,
      due_date: dueDate || null,
      assign_to: assignTo,
    });

    if (error) {
      toast({ title: "Failed to create assignment", variant: "destructive" });
    } else {
      toast({ title: "✅ Assignment created!" });
      setTitle("");
      setDescription("");
      setSubjectId("");
      setTopicId("");
      setCompanyFocus("");
      setDueDate("");
      setCreating(false);
      loadAssignments();
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("question_assignments").delete().eq("id", id);
    setAssignments(prev => prev.filter(a => a.id !== id));
    toast({ title: "Assignment deleted" });
  };

  const selectedSubject = subjects.find(s => s.id === subjectId);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create New */}
      {!creating ? (
        <Button onClick={() => setCreating(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Create Assignment
        </Button>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">New Assignment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Practice Aptitude for TCS" />
              </div>
              <div className="space-y-2">
                <Label>Subject *</Label>
                <Select value={subjectId} onValueChange={v => { setSubjectId(v); setTopicId(""); }}>
                  <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                  <SelectContent>
                    {subjects.map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedSubject && (
                <div className="space-y-2">
                  <Label>Topic (optional)</Label>
                  <Select value={topicId} onValueChange={setTopicId}>
                    <SelectTrigger><SelectValue placeholder="All topics" /></SelectTrigger>
                    <SelectContent>
                      {selectedSubject.topics.map(t => (
                        <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label>Company Focus (optional)</Label>
                <Select value={companyFocus} onValueChange={setCompanyFocus}>
                  <SelectTrigger><SelectValue placeholder="General" /></SelectTrigger>
                  <SelectContent>
                    {["General", "TCS", "Infosys", "Wipro", "Cognizant", "Accenture"].map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Due Date (optional)</Label>
                <Input type="datetime-local" value={dueDate} onChange={e => setDueDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Assign To</Label>
                <Select value={assignTo} onValueChange={setAssignTo}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Students</SelectItem>
                    <SelectItem value="specific">Specific Students</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Instructions for students..." />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleCreate} disabled={submitting} className="gap-2">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Create
              </Button>
              <Button variant="outline" onClick={() => setCreating(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Assignments */}
      {assignments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ClipboardList className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No assignments created yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {assignments.map(a => {
            const sub = subjects.find(s => s.id === a.subject_id);
            const topic = sub?.topics.find(t => t.id === a.topic_id);
            return (
              <Card key={a.id} className="hover:border-primary/20 transition-colors">
                <CardContent className="p-4 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground">{a.title}</h3>
                    {a.description && (
                      <p className="text-sm text-muted-foreground mt-1">{a.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline">{sub?.title || a.subject_id}</Badge>
                      {topic && <Badge variant="secondary">{topic.title}</Badge>}
                      {a.company_focus && <Badge>{a.company_focus}</Badge>}
                      <Badge variant={a.assign_to === "all" ? "default" : "outline"}>
                        {a.assign_to === "all" ? "All Students" : "Specific"}
                      </Badge>
                    </div>
                    {a.due_date && (
                      <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Due: {new Date(a.due_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(a.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
