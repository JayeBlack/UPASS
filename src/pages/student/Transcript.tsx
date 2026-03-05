import DashboardLayout from "@/components/DashboardLayout";
import { Printer, Download, GraduationCap } from "lucide-react";

const semesters = [
  {
    label: "Semester 1, 2024/2025",
    courses: [
      { code: "CS 601", name: "Advanced Database Systems", credits: 3, grade: "A", marks: 82 },
      { code: "CS 603", name: "Research Methodology", credits: 3, grade: "B+", marks: 74 },
      { code: "CS 605", name: "Machine Learning", credits: 3, grade: "A-", marks: 78 },
    ],
    cwa: 78.0,
  },
  {
    label: "Semester 2, 2023/2024",
    courses: [
      { code: "CS 502", name: "Software Engineering", credits: 3, grade: "A", marks: 85 },
      { code: "CS 504", name: "Computer Networks", credits: 3, grade: "B+", marks: 73 },
      { code: "CS 506", name: "Operating Systems", credits: 3, grade: "A", marks: 84 },
    ],
    cwa: 80.7,
  },
  {
    label: "Semester 1, 2023/2024",
    courses: [
      { code: "CS 501", name: "Discrete Mathematics", credits: 3, grade: "B+", marks: 74 },
      { code: "CS 503", name: "Data Structures & Algorithms", credits: 3, grade: "A", marks: 83 },
      { code: "CS 505", name: "Statistics for Computing", credits: 3, grade: "A-", marks: 77 },
    ],
    cwa: 78.0,
  },
];

const overallCwa = (semesters.reduce((s, sem) => s + sem.cwa, 0) / semesters.length).toFixed(1);

const Transcript = () => {
  const handlePrint = () => window.print();

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">Academic Transcript</h1>
          <p className="text-muted-foreground mt-1">Kwame Mensah · UMaT/PG/0234/22 · MSc. Information Technology</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            <Printer size={16} />
            Print
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg gradient-gold text-secondary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            <Download size={16} />
            Download PDF
          </button>
        </div>
      </div>

      {/* CWA Summary */}
      <div className="bg-card rounded-xl border border-border px-6 py-4 mb-6 inline-flex items-center gap-3">
        <GraduationCap size={20} className="text-secondary" />
        <span className="text-sm text-muted-foreground">Cumulative Weighted Average (CWA):</span>
        <span className="text-2xl font-bold font-display text-foreground">{overallCwa}</span>
      </div>

      {/* Semester Blocks */}
      <div className="space-y-6">
        {semesters.map((sem) => (
          <div key={sem.label} className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="font-display font-bold text-foreground">{sem.label}</h2>
              <span className="text-sm text-muted-foreground">CWA: <span className="font-bold text-foreground">{sem.cwa.toFixed(1)}</span></span>
            </div>
            <table className="w-full hidden sm:table">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Code</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Course</th>
                  <th className="text-center px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Credits</th>
                  <th className="text-center px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Grade</th>
                  <th className="text-center px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Marks (%)</th>
                </tr>
              </thead>
              <tbody>
                {sem.courses.map((c) => (
                  <tr key={c.code} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-3 text-sm font-mono font-medium text-foreground">{c.code}</td>
                    <td className="px-6 py-3 text-sm text-foreground">{c.name}</td>
                    <td className="px-6 py-3 text-sm text-center text-muted-foreground">{c.credits}</td>
                    <td className="px-6 py-3 text-sm text-center font-semibold text-foreground">{c.grade}</td>
                    <td className="px-6 py-3 text-sm text-center text-muted-foreground">{c.marks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="sm:hidden divide-y divide-border">
              {sem.courses.map((c) => (
                <div key={c.code} className="px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{c.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{c.code} · {c.credits} credits</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">{c.grade}</p>
                    <p className="text-xs text-muted-foreground">{c.marks}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Transcript;
