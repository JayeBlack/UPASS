import DashboardLayout from "@/components/DashboardLayout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useState, useEffect } from "react";
import { Filter, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface StudentResult {
  id: string;
  first_name: string;
  last_name: string;
  index_number: string;
  program_name: string;
  department_name: string;
  admission_year: string;
  cwa?: number;
}

const CWAResults = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<StudentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [deptFilter, setDeptFilter] = useState<string>("all");

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiFetch<any>("/students");
      // Handle both direct arrays and wrapped responses like { students: [...] }
      const arr = Array.isArray(data) ? data : (data?.students ?? []);
      setStudents(arr);
    } catch {
      // backend offline
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const departments = [...new Set(students.map((s) => s.department_name).filter(Boolean))];
  const years = [...new Set(students.map((s) => s.admission_year?.toString()).filter(Boolean))].sort();

  const isSuperAdmin = user?.isSuperAdmin || user?.role === "Admin";
  const effectiveDept = isSuperAdmin ? deptFilter : (user?.department || "all");

  const filteredStudents = students.filter((s) => {
    const matchYear = yearFilter === "all" || s.admission_year?.toString() === yearFilter;
    const matchDept = effectiveDept === "all" || s.department_name === effectiveDept;
    return matchYear && matchDept;
  });

  // Group by program for chart
  const programGroups = filteredStudents.reduce((acc, s) => {
    const prog = s.program_name || "Unknown";
    if (!acc[prog]) acc[prog] = [];
    acc[prog].push(s.cwa || 0);
    return acc;
  }, {} as Record<string, number[]>);

  const programCWA = Object.entries(programGroups)
    .map(([program, cwas]) => ({
      program: program.length > 20 ? program.substring(0, 20) + "..." : program,
      cwa: cwas.length > 0 ? cwas.reduce((a, b) => a + b, 0) / cwas.length : 0,
    }))
    .filter((p) => p.cwa > 0)
    .sort((a, b) => b.cwa - a.cwa);

  // Class distribution
  const studentsWithCWA = filteredStudents.filter((s) => s.cwa && s.cwa > 0);
  const classDistribution = [
    { name: "First Class (≥70)", value: studentsWithCWA.filter((s) => s.cwa! >= 70).length, color: "hsl(var(--secondary))" },
    { name: "Second Class Upper (60-69)", value: studentsWithCWA.filter((s) => s.cwa! >= 60 && s.cwa! < 70).length, color: "hsl(var(--primary))" },
    { name: "Second Class Lower (50-59)", value: studentsWithCWA.filter((s) => s.cwa! >= 50 && s.cwa! < 60).length, color: "hsl(var(--muted-foreground))" },
    { name: "Pass (45-49)", value: studentsWithCWA.filter((s) => s.cwa! >= 45 && s.cwa! < 50).length, color: "hsl(var(--destructive))" },
    { name: "Fail (<45)", value: studentsWithCWA.filter((s) => s.cwa! < 45).length, color: "hsl(var(--border))" },
  ];

  // Top students
  const topStudents = filteredStudents
    .filter((s) => s.cwa && s.cwa > 0)
    .sort((a, b) => (b.cwa || 0) - (a.cwa || 0))
    .slice(0, 10);

  const avgCWA = studentsWithCWA.length > 0 
    ? (studentsWithCWA.reduce((sum, s) => sum + (s.cwa || 0), 0) / studentsWithCWA.length).toFixed(1)
    : "—";

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-display text-foreground">CWA Results Overview</h1>
        <p className="text-muted-foreground mt-1">
          {isSuperAdmin ? "Performance analysis across all postgraduate programs" : `${user?.department || 'Department'} — Performance analysis`}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter size={16} />
          <span>Filter by:</span>
        </div>
        <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} className="px-4 py-2.5 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="all">All Years</option>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        {isSuperAdmin && (
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="px-4 py-2.5 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="all">All Departments</option>
            {departments.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
          <Loader2 size={18} className="animate-spin mr-2" /> Loading data...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            {[
              { label: "School Avg CWA", value: avgCWA },
              { label: "Total Students", value: String(filteredStudents.length) },
              { label: "First Class", value: studentsWithCWA.filter((s) => s.cwa! >= 70).length.toString() },
              { label: "With Results", value: String(studentsWithCWA.length) },
            ].map((s) => (
              <div key={s.label} className="bg-card rounded-xl border border-border p-5">
                <p className="text-2xl font-bold font-display text-foreground">{s.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="font-display text-lg font-bold text-foreground mb-4">Average CWA by Program</h2>
              {programCWA.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={programCWA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="program" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} angle={-15} textAnchor="end" height={80} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                    <Bar dataKey="cwa" fill="hsl(var(--secondary))" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-16">No CWA data available</p>
              )}
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="font-display text-lg font-bold text-foreground mb-4">Class Distribution</h2>
              {studentsWithCWA.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={classDistribution.filter(c => c.value > 0)} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ value }) => value > 0 ? `${value}` : ""}>
                        {classDistribution.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {classDistribution.map((c) => (
                      <div key={c.name} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: c.color }} />
                        {c.name.split(" ")[0]} ({c.value})
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-16">No grade data available</p>
              )}
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="font-display text-lg font-bold text-foreground mb-4">Top Performing Students</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-2 font-medium text-muted-foreground">#</th>
                    <th className="text-left px-4 py-2 font-medium text-muted-foreground">Student</th>
                    <th className="text-left px-4 py-2 font-medium text-muted-foreground">Index</th>
                    <th className="text-left px-4 py-2 font-medium text-muted-foreground">Program</th>
                    <th className="text-left px-4 py-2 font-medium text-muted-foreground">CWA</th>
                  </tr>
                </thead>
                <tbody>
                  {topStudents.length > 0 ? topStudents.map((s, i) => (
                    <tr key={s.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{s.first_name} {s.last_name}</td>
                      <td className="px-4 py-3 text-muted-foreground font-mono">{s.index_number}</td>
                      <td className="px-4 py-3 text-muted-foreground">{s.program_name}</td>
                      <td className="px-4 py-3 font-bold text-foreground">{s.cwa?.toFixed(1) || "—"}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No CWA results available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default CWAResults;
