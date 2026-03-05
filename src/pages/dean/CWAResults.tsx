import DashboardLayout from "@/components/DashboardLayout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const programCWA = [
  { program: "MSc. IT", cwa: 71.2 },
  { program: "MSc. Mining", cwa: 68.4 },
  { program: "MSc. Env. Sci", cwa: 73.1 },
  { program: "MSc. Geo. Eng", cwa: 66.8 },
  { program: "MSc. CS", cwa: 74.5 },
];

const classDistribution = [
  { name: "First Class (≥70)", value: 38, color: "hsl(var(--secondary))" },
  { name: "Second Class Upper (60-69)", value: 92, color: "hsl(var(--primary))" },
  { name: "Second Class Lower (50-59)", value: 84, color: "hsl(var(--muted-foreground))" },
  { name: "Pass (45-49)", value: 28, color: "hsl(var(--destructive))" },
  { name: "Fail (<45)", value: 5, color: "hsl(var(--border))" },
];

const topStudents = [
  { name: "Abena Kusi", index: "UMaT/PG/0102/22", program: "MSc. Computer Science", cwa: 89.3 },
  { name: "Daniel Owusu", index: "UMaT/PG/0145/22", program: "MSc. IT", cwa: 86.7 },
  { name: "Esi Appiah", index: "UMaT/PG/0198/22", program: "MSc. Mining Engineering", cwa: 84.2 },
  { name: "Kwesi Mensah", index: "UMaT/PG/0211/22", program: "MSc. Env. Science", cwa: 82.9 },
  { name: "Ama Serwaa", index: "UMaT/PG/0089/22", program: "MSc. Geo. Engineering", cwa: 81.5 },
];

const CWAResults = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-display text-foreground">CWA Results Overview</h1>
        <p className="text-muted-foreground mt-1">Performance analysis across all postgraduate programs</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "School Avg CWA", value: "68.5" },
          { label: "Total Students", value: "247" },
          { label: "First Class", value: "38" },
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
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={programCWA}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="program" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Bar dataKey="cwa" fill="hsl(var(--secondary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
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
            {topStudents.map((s, i) => (
              <tr key={s.index} className="border-b border-border last:border-0">
                <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                <td className="px-4 py-3 font-medium text-foreground">{s.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{s.index}</td>
                <td className="px-4 py-3 text-muted-foreground">{s.program}</td>
                <td className="px-4 py-3 font-bold text-foreground">{s.cwa}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default CWAResults;
