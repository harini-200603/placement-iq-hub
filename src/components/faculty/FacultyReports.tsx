import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FacultyData } from "@/lib/facultyAnalytics";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";
import { FileText, Download, FileBarChart, Users } from "lucide-react";

export const FacultyReports = ({ data, collegeName }: { data: FacultyData; collegeName?: string }) => {
  const header = (doc: jsPDF, title: string) => {
    doc.setFillColor(99, 102, 241);
    doc.rect(0, 0, 210, 26, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text("PlacementIQ", 14, 12);
    doc.setFontSize(10);
    doc.text(title, 14, 20);
    doc.text(new Date().toLocaleDateString(), 196, 12, { align: "right" });
    if (collegeName) doc.text(collegeName, 196, 20, { align: "right" });
    doc.setTextColor(20, 20, 20);
  };

  const batchReport = () => {
    if (data.totals.students === 0) return toast.error("No data to export");
    const doc = new jsPDF();
    header(doc, "Batch Placement Readiness Report");
    let y = 36;
    doc.setFontSize(12); doc.text("Overview", 14, y); y += 4;
    autoTable(doc, {
      startY: y,
      head: [["Metric", "Value"]],
      body: [
        ["Total Students", String(data.totals.students)],
        ["Active Learners (7d)", String(data.totals.activeLearners)],
        ["Avg Readiness", `${data.totals.avgReadiness}%`],
        ["Avg Score", `${data.totals.avgScore}%`],
        ["Tests Taken", String(data.totals.testsTaken)],
        ["Learning Hours", `${data.totals.learningHours} h`],
        ["Completion Rate", `${data.totals.completionRate}%`],
        ["Ready / Almost / Needs Work / At Risk", `${data.bandCounts.Ready} / ${data.bandCounts.Almost} / ${data.bandCounts["Needs Work"]} / ${data.bandCounts["At Risk"]}`],
      ],
      theme: "striped", headStyles: { fillColor: [99, 102, 241] }, styles: { fontSize: 9 },
    });
    y = (doc as any).lastAutoTable.finalY + 8;
    doc.setFontSize(12); doc.text("Department Comparison", 14, y); y += 2;
    autoTable(doc, {
      startY: y + 2,
      head: [["Department", "Students", "Avg Readiness", "Ready", "At Risk"]],
      body: data.depts.map((d) => [d.department, String(d.students), `${d.avgReadiness}%`, String(d.ready), String(d.atRisk)]),
      theme: "grid", headStyles: { fillColor: [139, 92, 246] }, styles: { fontSize: 9 },
    });
    doc.save("batch-readiness-report.pdf");
    toast.success("Batch report downloaded");
  };

  const studentReport = () => {
    if (data.students.length === 0) return toast.error("No data to export");
    const doc = new jsPDF();
    header(doc, "Student Performance Report");
    autoTable(doc, {
      startY: 34,
      head: [["Student", "Dept", "Topics", "Tests", "Avg Score", "Readiness", "Band"]],
      body: [...data.students].sort((a, b) => b.readiness - a.readiness).map((s) => [
        s.full_name, s.department || "-", String(s.topicsCompleted), String(s.testsTaken), `${s.avgScore}%`, `${s.readiness}%`, s.band,
      ]),
      theme: "striped", headStyles: { fillColor: [99, 102, 241] }, styles: { fontSize: 8 },
      didParseCell: (d) => {
        if (d.section === "body" && d.column.index === 6) {
          const v = d.cell.raw as string;
          if (v === "At Risk") d.cell.styles.textColor = [220, 38, 38];
          if (v === "Ready") d.cell.styles.textColor = [16, 185, 129];
        }
      },
    });
    doc.save("student-performance-report.pdf");
    toast.success("Student report downloaded");
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2"><FileBarChart className="w-4 h-4 text-primary" /> PDF Reports</CardTitle>
        <p className="text-xs text-muted-foreground">Generate professional placement reports for college records</p>
      </CardHeader>
      <CardContent className="grid sm:grid-cols-2 gap-4">
        <button onClick={batchReport} className="group text-left p-4 rounded-xl border border-border/50 hover:border-primary/40 hover:bg-primary/5 transition-all">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-6 h-6 text-primary" />
            <Download className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
          </div>
          <p className="font-semibold text-foreground">Batch Readiness Report</p>
          <p className="text-xs text-muted-foreground">Overview + department comparison</p>
        </button>
        <button onClick={studentReport} className="group text-left p-4 rounded-xl border border-border/50 hover:border-secondary/40 hover:bg-secondary/5 transition-all">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-6 h-6 text-secondary" />
            <Download className="w-4 h-4 text-muted-foreground group-hover:text-secondary" />
          </div>
          <p className="font-semibold text-foreground">Student Performance Report</p>
          <p className="text-xs text-muted-foreground">Per-student scores, readiness & bands</p>
        </button>
      </CardContent>
    </Card>
  );
};
