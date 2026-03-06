import DashboardLayout from "@/components/DashboardLayout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { Filter } from "lucide-react";

const monthlyRevenue = [
  { month: "Sep", collected: 320000, target: 400000, department: "Computer Science", year: "2023" },
  { month: "Oct", collected: 180000, target: 400000, department: "Mining Engineering", year: "2023" },
  { month: "Nov", collected: 95000, target: 400000, department: "Environmental Science", year: "2023" },
  { month: "Dec", collected: 60000, target: 400000, department: "Geological Engineering", year: "2023" },
  { month: "Jan", collected: 240000, target: 400000, department: "Computer Science", year: "2024" },
  { month: "Feb", collected: 150000, target: 400000, department: "Mining Engineering", year: "2024" },
  { month: "Sep", collected: 280000, target: 400000, department: "Computer Science", year: "2024" },
  { month: "Oct", collected: 210000, target: 400000, department: "Environmental Science", year: "2024" },
];

const complianceByProgram = [
  { program: "MSc. IT", rate: 88, department: "Computer Science", year: "2024" },
  { program: "MSc. Mining", rate: 76, department: "Mining Engineering", year: "2024" },
  { program: "MSc. Env. Sci", rate: 82, department: "Environmental Science", year: "2024" },
  { program: "MSc. Geo. Eng", rate: 79, department: "Geological Engineering", year: "2023" },
  { program: "MSc. CS", rate: 91, department: "Computer Science", year: "2023" },
];

const departments = [...new Set([...monthlyRevenue.map((r) => r.department), ...complianceByProgram.map((c) => c.department)])].sort();
const years = [...new Set([...monthlyRevenue.map((r) => r.year), ...complianceByProgram.map((c) => c.year)])].sort();

const FeeAnalytics = () => {
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [deptFilter, setDeptFilter] = useState<string>("all");

  const filteredRevenue = monthlyRevenue.filter((r) => {
    const matchYear = yearFilter === "all" || r.year === yearFilter;
    const matchDept = deptFilter === "all" || r.department === deptFilter;
    return matchYear && matchDept;
  });

  const filteredCompliance = complianceByProgram.filter((c) => {
    const matchYear = yearFilter === "all" || c.year === yearFilter;
    const matchDept = deptFilter === "all" || c.department === deptFilter;
    return matchYear && matchDept;
  });

  const totalCollected = filteredRevenue.reduce((s, r) => s + r.collected, 0);
  const totalTarget = filteredRevenue.reduce((s, r) => s + r.target, 0);
  const outstanding = totalTarget - totalCollected;
  const avgCompliance = filteredCompliance.length ? Math.round(filteredCompliance.reduce((s, c) => s + c.rate, 0) / filteredCompliance.length) : 0;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-display text-foreground">Fee Payment Analytics</h1>
        <p className="text-muted-foreground mt-1">Financial overview and compliance tracking</p>
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
          { label: "Total Collected", value: `₵${totalCollected.toLocaleString()}` },
          { label: "Outstanding", value: `₵${outstanding.toLocaleString()}` },
          { label: "Compliance Rate", value: `${avgCompliance}%` },
          { label: "Defaulters", value: "44" },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-xl border border-border p-5">
            <p className="text-2xl font-bold font-display text-foreground">{s.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="font-display text-lg font-bold text-foreground mb-4">Monthly Collections</h2>
          {filteredRevenue.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={filteredRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `₵${v / 1000}k`} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} formatter={(v: number) => [`₵${v.toLocaleString()}`, ""]} />
                <Bar dataKey="collected" fill="hsl(var(--secondary))" radius={[6, 6, 0, 0]} name="Collected" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-16">No data for selected filters</p>
          )}
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="font-display text-lg font-bold text-foreground mb-4">Compliance by Program</h2>
          {filteredCompliance.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={filteredCompliance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis dataKey="program" type="category" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} width={90} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} formatter={(v: number) => [`${v}%`, "Rate"]} />
                <Bar dataKey="rate" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-16">No data for selected filters</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FeeAnalytics;
