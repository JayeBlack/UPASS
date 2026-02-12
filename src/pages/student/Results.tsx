import DashboardLayout from "@/components/DashboardLayout";
import { BarChart3 } from "lucide-react";

const results = [
  { code: "CS 601", name: "Advanced Database Systems", grade: "A", points: 4.0 },
  { code: "CS 603", name: "Research Methodology", grade: "B+", points: 3.5 },
  { code: "CS 605", name: "Machine Learning", grade: "A-", points: 3.7 },
  { code: "CS 607", name: "Network Security", grade: "A", points: 4.0 },
  { code: "CS 611", name: "Data Mining & Analytics", grade: "B+", points: 3.5 },
];

const Results = () => {
  const gpa = (results.reduce((s, r) => s + r.points, 0) / results.length).toFixed(2);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-foreground">Academic Results</h1>
        <p className="text-muted-foreground mt-1">Semester 1, 2025/2026</p>
      </div>

      <div className="bg-card rounded-xl border border-border px-6 py-4 mb-6 inline-flex items-center gap-3">
        <BarChart3 size={20} className="text-secondary" />
        <span className="text-sm text-muted-foreground">Semester GPA:</span>
        <span className="text-2xl font-bold font-display text-foreground">{gpa}</span>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Code</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Course</th>
              <th className="text-center px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Grade</th>
              <th className="text-center px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Points</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.code} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 text-sm font-mono font-medium text-foreground">{r.code}</td>
                <td className="px-6 py-4 text-sm text-foreground">{r.name}</td>
                <td className="px-6 py-4 text-sm text-center font-semibold text-foreground">{r.grade}</td>
                <td className="px-6 py-4 text-sm text-center text-muted-foreground">{r.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default Results;
