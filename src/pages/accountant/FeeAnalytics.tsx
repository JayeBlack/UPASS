import DashboardLayout from "@/components/DashboardLayout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const monthlyRevenue = [
  { month: "Sep", collected: 320000, target: 400000 },
  { month: "Oct", collected: 180000, target: 400000 },
  { month: "Nov", collected: 95000, target: 400000 },
  { month: "Dec", collected: 60000, target: 400000 },
  { month: "Jan", collected: 240000, target: 400000 },
  { month: "Feb", collected: 150000, target: 400000 },
];

const complianceByProgram = [
  { program: "MSc. IT", rate: 88 },
  { program: "MSc. Mining", rate: 76 },
  { program: "MSc. Env. Sci", rate: 82 },
  { program: "MSc. Geo. Eng", rate: 79 },
  { program: "MSc. CS", rate: 91 },
];

const FeeAnalytics = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-display text-foreground">Fee Payment Analytics</h1>
        <p className="text-muted-foreground mt-1">Financial overview and compliance tracking</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Collected", value: "₵1,045,000" },
          { label: "Outstanding", value: "₵355,000" },
          { label: "Compliance Rate", value: "82%" },
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
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `₵${v / 1000}k`} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} formatter={(v: number) => [`₵${v.toLocaleString()}`, ""]} />
              <Bar dataKey="collected" fill="hsl(var(--secondary))" radius={[6, 6, 0, 0]} name="Collected" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="font-display text-lg font-bold text-foreground mb-4">Compliance by Program</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={complianceByProgram} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis dataKey="program" type="category" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} width={90} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} formatter={(v: number) => [`${v}%`, "Rate"]} />
              <Bar dataKey="rate" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FeeAnalytics;
