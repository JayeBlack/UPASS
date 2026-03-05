import DashboardLayout from "@/components/DashboardLayout";
import { BarChart3 } from "lucide-react";

const results = [
  { code: "CS 601", name: "Advanced Database Systems", credits: 3, grade: "A", marks: 82 },
  { code: "CS 603", name: "Research Methodology", credits: 3, grade: "B+", marks: 74 },
  { code: "CS 605", name: "Machine Learning", credits: 3, grade: "A-", marks: 78 },
  { code: "CS 607", name: "Network Security", credits: 3, grade: "A", marks: 85 },
  { code: "CS 611", name: "Data Mining & Analytics", credits: 3, grade: "B+", marks: 73 },
];

const Results = () => {
  const totalCredits = results.reduce((s, r) => s + r.credits, 0);
  const cwa = (results.reduce((s, r) => s + r.marks * r.credits, 0) / totalCredits).toFixed(1);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-foreground">Academic Results</h1>
        <p className="text-muted-foreground mt-1">Semester 1, 2025/2026</p>
      </div>

      <div className="bg-card rounded-xl border border-border px-6 py-4 mb-6 inline-flex items-center gap-3">
        <BarChart3 size={20} className="text-secondary" />
        <span className="text-sm text-muted-foreground">Semester CWA:</span>
        <span className="text-2xl font-bold font-display text-foreground">{cwa}</span>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Code</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Course</th>
              <th className="text-center px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Credits</th>
              <th className="text-center px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Grade</th>
              <th className="text-center px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Marks (%)</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.code} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 text-sm font-mono font-medium text-foreground">{r.code}</td>
                <td className="px-6 py-4 text-sm text-foreground">{r.name}</td>
                <td className="px-6 py-4 text-sm text-center text-muted-foreground">{r.credits}</td>
                <td className="px-6 py-4 text-sm text-center font-semibold text-foreground">{r.grade}</td>
                <td className="px-6 py-4 text-sm text-center text-muted-foreground">{r.marks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default Results;
