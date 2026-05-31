import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Megaphone, Plus, Pin, Trash2, Briefcase, Calendar, IndianRupee, Building2 } from "lucide-react";

const CATEGORY_STYLE: Record<string, string> = {
  general: "bg-primary/15 text-primary",
  urgent: "bg-destructive/15 text-destructive",
  drive: "bg-secondary/15 text-secondary",
  result: "bg-emerald-500/15 text-emerald-600",
};

const DRIVE_STATUS: Record<string, string> = {
  upcoming: "bg-blue-500/15 text-blue-600",
  open: "bg-emerald-500/15 text-emerald-600",
  closed: "bg-muted text-muted-foreground",
};

export const FacultyAnnouncements = ({ facultyId }: { facultyId: string }) => {
  const [anns, setAnns] = useState<any[]>([]);
  const [drives, setDrives] = useState<any[]>([]);
  const [annOpen, setAnnOpen] = useState(false);
  const [driveOpen, setDriveOpen] = useState(false);
  const [aForm, setAForm] = useState({ title: "", body: "", category: "general", pinned: false });
  const [dForm, setDForm] = useState({ company: "", role_title: "", package_lpa: "", drive_date: "", eligibility_cgpa: "", status: "upcoming", description: "" });

  const load = async () => {
    const [a, d] = await Promise.all([
      supabase.from("faculty_announcements").select("*").order("pinned", { ascending: false }).order("created_at", { ascending: false }),
      supabase.from("placement_drives").select("*").order("drive_date", { ascending: true }),
    ]);
    setAnns(a.data || []);
    setDrives(d.data || []);
  };
  useEffect(() => { load(); }, []);

  const addAnn = async () => {
    if (!aForm.title.trim()) return toast.error("Title required");
    const { error } = await supabase.from("faculty_announcements").insert({ ...aForm, faculty_id: facultyId });
    if (error) return toast.error(error.message);
    toast.success("Announcement posted");
    setAForm({ title: "", body: "", category: "general", pinned: false });
    setAnnOpen(false);
    load();
  };

  const addDrive = async () => {
    if (!dForm.company.trim()) return toast.error("Company required");
    const { error } = await supabase.from("placement_drives").insert({
      faculty_id: facultyId,
      company: dForm.company,
      role_title: dForm.role_title || null,
      package_lpa: dForm.package_lpa ? Number(dForm.package_lpa) : null,
      drive_date: dForm.drive_date || null,
      eligibility_cgpa: dForm.eligibility_cgpa ? Number(dForm.eligibility_cgpa) : null,
      status: dForm.status,
      description: dForm.description || null,
    });
    if (error) return toast.error(error.message);
    toast.success("Placement drive created");
    setDForm({ company: "", role_title: "", package_lpa: "", drive_date: "", eligibility_cgpa: "", status: "upcoming", description: "" });
    setDriveOpen(false);
    load();
  };

  const del = async (table: "faculty_announcements" | "placement_drives", id: string) => {
    await supabase.from(table).delete().eq("id", id);
    load();
  };

  const togglePin = async (a: any) => {
    await supabase.from("faculty_announcements").update({ pinned: !a.pinned }).eq("id", a.id);
    load();
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Announcements */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base flex items-center gap-2"><Megaphone className="w-4 h-4 text-primary" /> Announcements</CardTitle>
          <Dialog open={annOpen} onOpenChange={setAnnOpen}>
            <DialogTrigger asChild><Button size="sm" className="gap-1"><Plus className="w-4 h-4" /> New</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New Announcement</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Title" value={aForm.title} onChange={(e) => setAForm({ ...aForm, title: e.target.value })} />
                <Textarea placeholder="Message (optional)" value={aForm.body} onChange={(e) => setAForm({ ...aForm, body: e.target.value })} />
                <div className="flex gap-3">
                  <Select value={aForm.category} onValueChange={(v) => setAForm({ ...aForm, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="drive">Drive</SelectItem>
                      <SelectItem value="result">Result</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant={aForm.pinned ? "default" : "outline"} onClick={() => setAForm({ ...aForm, pinned: !aForm.pinned })} className="gap-1"><Pin className="w-4 h-4" /> Pin</Button>
                </div>
              </div>
              <DialogFooter><Button onClick={addAnn}>Post</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-3 max-h-[480px] overflow-auto">
          {anns.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">No announcements yet.</p>}
          <AnimatePresence>
            {anns.map((a) => (
              <motion.div key={a.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className={`p-3 rounded-lg border ${a.pinned ? "border-primary/30 bg-primary/5" : "border-border/50 bg-muted/30"}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {a.pinned && <Pin className="w-3.5 h-3.5 text-primary" />}
                    <span className="font-medium text-sm text-foreground">{a.title}</span>
                    <Badge className={`${CATEGORY_STYLE[a.category]} border-0 text-[10px] capitalize`}>{a.category}</Badge>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => togglePin(a)} className="text-muted-foreground hover:text-primary"><Pin className="w-3.5 h-3.5" /></button>
                    <button onClick={() => del("faculty_announcements", a.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                {a.body && <p className="text-xs text-muted-foreground mt-1">{a.body}</p>}
                <p className="text-[10px] text-muted-foreground mt-1">{new Date(a.created_at).toLocaleDateString()}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Placement Drives */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base flex items-center gap-2"><Briefcase className="w-4 h-4 text-secondary" /> Placement Drives</CardTitle>
          <Dialog open={driveOpen} onOpenChange={setDriveOpen}>
            <DialogTrigger asChild><Button size="sm" variant="secondary" className="gap-1"><Plus className="w-4 h-4" /> New</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New Placement Drive</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Company *" value={dForm.company} onChange={(e) => setDForm({ ...dForm, company: e.target.value })} />
                <Input placeholder="Role title" value={dForm.role_title} onChange={(e) => setDForm({ ...dForm, role_title: e.target.value })} />
                <div className="grid grid-cols-2 gap-3">
                  <Input type="number" placeholder="Package (LPA)" value={dForm.package_lpa} onChange={(e) => setDForm({ ...dForm, package_lpa: e.target.value })} />
                  <Input type="number" step="0.1" placeholder="Min CGPA" value={dForm.eligibility_cgpa} onChange={(e) => setDForm({ ...dForm, eligibility_cgpa: e.target.value })} />
                </div>
                <Input type="date" value={dForm.drive_date} onChange={(e) => setDForm({ ...dForm, drive_date: e.target.value })} />
                <Select value={dForm.status} onValueChange={(v) => setDForm({ ...dForm, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea placeholder="Description (optional)" value={dForm.description} onChange={(e) => setDForm({ ...dForm, description: e.target.value })} />
              </div>
              <DialogFooter><Button onClick={addDrive}>Create</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-3 max-h-[480px] overflow-auto">
          {drives.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">No drives scheduled.</p>}
          {drives.map((d) => (
            <motion.div key={d.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-lg border border-border/50 bg-muted/30">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-secondary/15 flex items-center justify-center"><Building2 className="w-4 h-4 text-secondary" /></div>
                  <div>
                    <p className="font-medium text-sm text-foreground">{d.company}</p>
                    {d.role_title && <p className="text-xs text-muted-foreground">{d.role_title}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Badge className={`${DRIVE_STATUS[d.status]} border-0 text-[10px] capitalize`}>{d.status}</Badge>
                  <button onClick={() => del("placement_drives", d.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                {d.package_lpa && <span className="flex items-center gap-0.5"><IndianRupee className="w-3 h-3" />{d.package_lpa} LPA</span>}
                {d.eligibility_cgpa && <span>CGPA ≥ {d.eligibility_cgpa}</span>}
                {d.drive_date && <span className="flex items-center gap-0.5"><Calendar className="w-3 h-3" />{new Date(d.drive_date).toLocaleDateString()}</span>}
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
