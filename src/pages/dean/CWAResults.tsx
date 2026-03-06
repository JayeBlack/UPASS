import DashboardLayout from "@/components/DashboardLayout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useState } from "react";
import { Filter } from "lucide-react";

const programCWA = [
  { program: "MSc. IT", cwa: 71.2, department: "Computer Science", year: "2022" },
  { program: "MSc. Mining", cwa: 68.4, department: "Mining Engineering", year: "2022" },
  { program: "MSc. Env. Sci", cwa: 73.1, department: "Environmental Science", year: "2023" },
  { program: "MSc. Geo. Eng", cwa: 66.8, department: "Geological Engineering", year: "2021" },
  { program: "MSc. CS", cwa: 74.5, department: "Computer Science", year: "2023" },
];

const classDistribution = [
  { name: "First Class (≥70)", value: 38, color: "hsl(var(--secondary))" },
  { name: "Second Class Upper (60-69)", value: 92, color: "hsl(var(--primary))" },
  { name: "Second Class Lower (50-59)", value: 84, color: "hsl(var(--muted-foreground))" },
  { name: "Pass (45-49)", value: 28, color: "hsl(var(--destructive))" },
  { name: "Fail (<45)", value: 5, color: "hsl(var(--border))" },
];

const topStudents = [
  { name: "Abena Kusi", index: "UMaT/PG/0102/22", program: "MSc. Computer Science", department: "Computer Science", year: "2022", cwa: 89.3 },
  { name: "Daniel Owusu", index: "UMaT/PG/0145/22", program: "MSc. IT", department: "Computer Science", year: "2022", cwa: 86.7 },
  { name: "Esi Appiah", index: "UMaT/PG/0198/22", program: "MSc. Mining Engineering", department: "Mining Engineering", year: "2022", cwa: 84.2 },
  { name: "Kwesi Mensah", index: "UMaT/PG/0211/23", program: "MSc. Env. Science", department: "Environmental Science", year: "2023", cwa: 82.9 },
  { name: "Ama Serwaa", index: "UMaT/PG/0089/21", program: "MSc. Geo. Engineering", department: "Geological Engineering", year: "2021", cwa: 81.5 },
];

const departments = [...new Set(programCWA.map((p) => p.department))];
const years = [...new Set([...programCWA.map((p) => p.year), ...topStudents.map((s) => s.year)])].sort();

const CWAResults = () => {
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [deptFilter, setDeptFilter] = useState<string>("all");

  const filteredPrograms = programCWA.filter((p) => {
    const matchYear = yearFilter === "all" || p.year === yearFilter;
    const matchDept = deptFilter === "all" || p.department === deptFilter;
    return matchYear && matchDept;
  });

  const filteredStudents = topStudents.filter((s) => {
    const matchYear = yearFilter === "all" || s.year === yearFilter;
    const matchDept = deptFilter === "all" || s.department === deptFilter;
    return matchYear && matchDept;
  });

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-display text-foreground">CWA Results Overview</h1>
        <p className="text-muted-foreground mt-1">Performance analysis across all postgraduate programs</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter size={16} />
          <span>Filter by:</span>
        </div>
        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">All Years</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">All Departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "School Avg CWA", value: filteredPrograms.length ? (filteredPrograms.reduce((s, p) => s + p.cwa, 0) / filteredPrograms.length).toFixed(1) : "—" },
          { label: "Total Students", value: filteredStudents.length.toString() },
          { label: "First Class", value: filteredStudents.filter((s) => s.cwa >= 70).length.toString() },
          { label: "Pass Rate", value: "97.9%" },
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
          {filteredPrograms.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={filteredPrograms}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="program" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Bar dataKey="cwa" fill="hsl(var(--secondary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-16">No data for selected filters</p>
          )}
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="font-display text-lg font-bold text-foreground mb-4">Class Distribution</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={classDistribution} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${value}`}>
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
                {c.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="font-display text-lg font-bold text-foreground mb-4">Top Performing Students</h2>
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
            {filteredStudents.length > 0 ? filteredStudents.map((s, i) => (
              <tr key={s.index} className="border-b border-border last:border-0">
                <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                <td className="px-4 py-3 font-medium text-foreground">{s.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{s.index}</td>
                <td className="px-4 py-3 text-muted-foreground">{s.program}</td>
                <td className="px-4 py-3 font-bold text-foreground">{s.cwa}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No students match the selected filters</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default CWAResults;
