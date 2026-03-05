import DashboardLayout from "@/components/DashboardLayout";
import { BarChart3, TrendingUp, TrendingDown, Minus, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

const semesters = [
  {
    label: "Semester 1, 2023/2024",
    short: "S1 23/24",
    courses: [
      { code: "CS 501", name: "Discrete Mathematics", credits: 3, grade: "B+", marks: 74 },
      { code: "CS 503", name: "Data Structures & Algorithms", credits: 3, grade: "A", marks: 83 },
      { code: "CS 505", name: "Statistics for Computing", credits: 3, grade: "A-", marks: 77 },
    ],
  },
  {
    label: "Semester 2, 2023/2024",
    short: "S2 23/24",
    courses: [
      { code: "CS 502", name: "Software Engineering", credits: 3, grade: "A", marks: 85 },
      { code: "CS 504", name: "Computer Networks", credits: 3, grade: "B+", marks: 73 },
      { code: "CS 506", name: "Operating Systems", credits: 3, grade: "A", marks: 84 },
    ],
  },
  {
    label: "Semester 1, 2024/2025",
    short: "S1 24/25",
    courses: [
      { code: "CS 601", name: "Advanced Database Systems", credits: 3, grade: "A", marks: 82 },
      { code: "CS 603", name: "Research Methodology", credits: 3, grade: "B+", marks: 74 },
      { code: "CS 605", name: "Machine Learning", credits: 3, grade: "A-", marks: 78 },
      { code: "CS 607", name: "Network Security", credits: 3, grade: "A", marks: 85 },
      { code: "CS 611", name: "Data Mining & Analytics", credits: 3, grade: "B+", marks: 73 },
    ],
  },
];

const calcCwa = (courses: { marks: number; credits: number }[]) => {
  const totalCredits = courses.reduce((s, c) => s + c.credits, 0);
  return courses.reduce((s, c) => s + c.marks * c.credits, 0) / totalCredits;
};

const semesterData = semesters.map((sem) => ({
  ...sem,
  cwa: calcCwa(sem.courses),
}));

const allCourses = semesters.flatMap((s) => s.courses);
const overallCwa = calcCwa(allCourses);

const Results = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">Academic Results</h1>
          <p className="text-muted-foreground mt-1">Performance overview across all semesters</p>
        </div>
        <button
          onClick={() => navigate("/documents")}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg gradient-gold text-secondary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
        >
          <FileText size={16} />
          Request Transcript
        </button>
      </div>

      {/* Overall CWA + Semester CWA Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-card rounded-xl border border-border px-5 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg gradient-gold flex items-center justify-center">
            <BarChart3 size={20} className="text-secondary-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Overall CWA</p>
            <p className="text-2xl font-bold font-display text-foreground">{overallCwa.toFixed(1)}</p>
          </div>
        </div>

        {semesterData.map((sem, i) => {
          const prev = i > 0 ? semesterData[i - 1].cwa : null;
          const diff = prev !== null ? sem.cwa - prev : null;
          const TrendIcon = diff === null ? Minus : diff >= 0 ? TrendingUp : TrendingDown;
          const trendColor = diff === null ? "text-muted-foreground" : diff >= 0 ? "text-success" : "text-destructive";

          return (
            <div key={sem.label} className="bg-card rounded-xl border border-border px-5 py-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-muted-foreground">{sem.short}</p>
                <div className={`flex items-center gap-1 ${trendColor}`}>
                  <TrendIcon size={14} />
                  {diff !== null && <span className="text-xs font-medium">{diff >= 0 ? "+" : ""}{diff.toFixed(1)}</span>}
                </div>
              </div>
              <p className="text-xl font-bold font-display text-foreground">{sem.cwa.toFixed(1)}</p>
            </div>
          );
        })}
      </div>

      {/* CWA Progress Analysis */}
      <div className="bg-card rounded-xl border border-border p-6 mb-6">
        <h2 className="font-display font-bold text-foreground mb-5">CWA Performance Analysis</h2>
        
        {/* Overall CWA Progress */}
        <div className="mb-6 p-4 rounded-lg bg-muted/50 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-foreground">Overall CWA</span>
            <span className="text-sm font-bold text-foreground">{overallCwa.toFixed(1)}%</span>
          </div>
          <Progress value={overallCwa} className="h-3" />
          <p className="text-xs text-muted-foreground mt-1.5">
            {overallCwa >= 80 ? "Excellent" : overallCwa >= 70 ? "Very Good" : overallCwa >= 60 ? "Good" : "Needs Improvement"} Performance
          </p>
        </div>

        {/* Semester-by-Semester Progress */}
        <div className="space-y-4">
          {semesterData.map((sem, i) => {
            const prev = i > 0 ? semesterData[i - 1].cwa : null;
            const diff = prev !== null ? sem.cwa - prev : null;
            return (
              <div key={sem.short}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-foreground">{sem.label}</span>
                  <div className="flex items-center gap-2">
                    {diff !== null && (
                      <span className={`text-xs font-medium ${diff >= 0 ? "text-success" : "text-destructive"}`}>
                        {diff >= 0 ? "+" : ""}{diff.toFixed(1)}
                      </span>
                    )}
                    <span className="text-sm font-bold text-foreground">{sem.cwa.toFixed(1)}%</span>
                  </div>
                </div>
                <Progress value={sem.cwa} className="h-2.5" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Semester-by-Semester Results */}
      <div className="space-y-6">
        {semesterData.map((sem) => (
          <div key={sem.label} className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="font-display font-bold text-foreground">{sem.label}</h2>
              <span className="text-sm text-muted-foreground">
                CWA: <span className="font-bold text-foreground">{sem.cwa.toFixed(1)}</span>
              </span>
            </div>

            {/* Desktop table */}
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

            {/* Mobile cards */}
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

export default Results;
