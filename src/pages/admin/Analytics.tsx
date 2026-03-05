import DashboardLayout from "@/components/DashboardLayout";
import { Users, BookOpen, Banknote, GraduationCap, TrendingUp, TrendingDown, CheckCircle, Clock, BarChart3, FileText, AlertTriangle } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Legend,
} from "recharts";

const enrollmentByDept = [
  { name: "Computer Science", students: 98, male: 62, female: 36 },
  { name: "Mining Eng.", students: 62, male: 45, female: 17 },
  { name: "Electrical Eng.", students: 45, male: 34, female: 11 },
  { name: "Mechanical Eng.", students: 42, male: 30, female: 12 },
];

const enrollmentTrend = [
  { year: "2021/22", students: 180 },
  { year: "2022/23", students: 198 },
  { year: "2023/24", students: 220 },
  { year: "2024/25", students: 235 },
  { year: "2025/26", students: 247 },
];

const feesCollection = [
  { month: "Sep", collected: 185000, target: 220000 },
  { month: "Oct", collected: 210000, target: 220000 },
  { month: "Nov", collected: 195000, target: 220000 },
  { month: "Dec", collected: 225000, target: 220000 },
  { month: "Jan", collected: 240000, target: 220000 },
  { month: "Feb", collected: 198000, target: 220000 },
];

const thesisProgress = [
  { name: "Proposal", value: 28, fill: "hsl(199 89% 48%)" },
  { name: "Ch 1-2", value: 45, fill: "hsl(48 95% 50%)" },
  { name: "Ch 3-4", value: 65, fill: "hsl(145 60% 22%)" },
  { name: "Submitted", value: 38, fill: "hsl(38 92% 50%)" },
  { name: "Defended", value: 22, fill: "hsl(142 71% 45%)" },
];

const graduationEligibility = [
  { name: "Eligible", value: 198 },
  { name: "Ineligible", value: 49 },
];

const cwaDistribution = [
  { range: "< 50", count: 12 },
  { range: "50-59", count: 38 },
  { range: "60-69", count: 72 },
  { range: "70-79", count: 85 },
  { range: "80-89", count: 32 },
  { range: "90+", count: 8 },
];

const programBreakdown = [
  { name: "MSc. IT", value: 68 },
  { name: "MPhil CS", value: 30 },
  { name: "MSc. Mining", value: 42 },
  { name: "MSc. Electrical", value: 35 },
  { name: "MSc. Mechanical", value: 32 },
  { name: "Others", value: 40 },
];

const PIE_COLORS = ["hsl(145 60% 22%)", "hsl(0 72% 51%)"];
const PROGRAM_COLORS = ["hsl(145 60% 22%)", "hsl(48 95% 50%)", "hsl(199 89% 48%)", "hsl(38 92% 50%)", "hsl(142 71% 45%)", "hsl(120 8% 45%)"];

const recentAlerts = [
  { text: "43 students have outstanding fees", type: "warning" },
  { text: "12 thesis submissions overdue", type: "warning" },
  { text: "New semester registration opens in 5 days", type: "info" },
  { text: "198 students eligible for graduation", type: "success" },
  { text: "3 departments fully cleared financially", type: "success" },
];

const alertStyles: Record<string, string> = {
  warning: "bg-warning/10 text-warning",
  info: "bg-info/10 text-info",
  success: "bg-success/10 text-success",
};

const alertIcons: Record<string, React.ReactNode> = {
  warning: <AlertTriangle size={14} />,
  info: <Clock size={14} />,
  success: <CheckCircle size={14} />,
};

const StatCard = ({ icon, label, value, sub, trend, accent }: {
  icon: React.ReactNode; label: string; value: string; sub?: string; trend?: "up" | "down"; accent?: boolean;
}) => (
  <div className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${accent ? "gradient-gold" : "bg-muted"}`}>
        {icon}
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-medium ${trend === "up" ? "text-success" : "text-destructive"}`}>
          {trend === "up" ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        </div>
      )}
    </div>
    <p className="text-2xl font-bold font-display text-foreground">{value}</p>
    <p className="text-sm text-muted-foreground mt-1">{label}</p>
    {sub && <p className={`text-xs mt-1 ${trend === "down" ? "text-destructive" : "text-success"}`}>{sub}</p>}
  </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg text-xs">
      <p className="font-medium text-foreground mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="font-medium">
          {p.name}: {typeof p.value === "number" && p.value > 1000 ? `GH₵ ${(p.value / 1000).toFixed(0)}K` : p.value}
        </p>
      ))}
    </div>
  );
};

const Analytics = () => {
  const totalStudents = 247;
  const totalFees = 1253000;
  const collectionRate = 82;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-foreground">School Analytics</h1>
        <p className="text-muted-foreground mt-1">Comprehensive overview of postgraduate school performance — 2025/2026 Academic Year</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          icon={<Users size={18} className="text-secondary-foreground" />}
          label="Total Students" value={totalStudents.toString()}
          sub="↑ 12% from last year" trend="up" accent
        />
        <StatCard
          icon={<GraduationCap size={18} className="text-muted-foreground" />}
          label="Graduands (Eligible)" value="198"
          sub="80.2% eligibility rate" trend="up"
        />
        <StatCard
          icon={<Banknote size={18} className="text-muted-foreground" />}
          label="Fees Collected" value={`GH₵ ${(totalFees / 1000000).toFixed(2)}M`}
          sub={`${collectionRate}% collection rate`} trend="up"
        />
        <StatCard
          icon={<BookOpen size={18} className="text-muted-foreground" />}
          label="Active Programs" value="12"
          sub="2 new programs added"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
          <CheckCircle size={18} className="text-success shrink-0" />
          <div>
            <p className="text-lg font-bold font-display text-foreground">204</p>
            <p className="text-xs text-muted-foreground">Fees Cleared</p>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
          <AlertTriangle size={18} className="text-warning shrink-0" />
          <div>
            <p className="text-lg font-bold font-display text-foreground">43</p>
            <p className="text-xs text-muted-foreground">Fees Owing</p>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
          <BarChart3 size={18} className="text-info shrink-0" />
          <div>
            <p className="text-lg font-bold font-display text-foreground">68.5</p>
            <p className="text-xs text-muted-foreground">Avg. CWA</p>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
          <FileText size={18} className="text-secondary shrink-0" />
          <div>
            <p className="text-lg font-bold font-display text-foreground">22</p>
            <p className="text-xs text-muted-foreground">Thesis Defended</p>
          </div>
        </div>
      </div>

      {/* Row 1: Enrollment Trend + Enrollment by Dept */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="font-display text-lg font-bold text-foreground mb-1">Enrollment Trend</h2>
          <p className="text-xs text-muted-foreground mb-4">5-year postgraduate enrollment growth</p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={enrollmentTrend}>
              <defs>
                <linearGradient id="enrollGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(145 60% 22%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(145 60% 22%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(80 12% 88%)" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} stroke="hsl(120 8% 45%)" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(120 8% 45%)" />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="students" stroke="hsl(145 60% 22%)" strokeWidth={2} fill="url(#enrollGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="font-display text-lg font-bold text-foreground mb-1">Enrollment by Department</h2>
          <p className="text-xs text-muted-foreground mb-4">Gender breakdown per department</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={enrollmentByDept}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(80 12% 88%)" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="hsl(120 8% 45%)" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(120 8% 45%)" />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="male" name="Male" fill="hsl(145 60% 22%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="female" name="Female" fill="hsl(48 95% 50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Fees Collection + Graduation Eligibility */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="font-display text-lg font-bold text-foreground mb-1">Fees Collection Trend</h2>
          <p className="text-xs text-muted-foreground mb-4">Monthly collected vs target (GH₵)</p>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={feesCollection}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(80 12% 88%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(120 8% 45%)" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(120 8% 45%)" tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="collected" name="Collected" stroke="hsl(145 60% 22%)" strokeWidth={2.5} dot={{ fill: "hsl(145 60% 22%)", r: 4 }} />
              <Line type="monotone" dataKey="target" name="Target" stroke="hsl(48 95% 50%)" strokeWidth={2} strokeDasharray="6 4" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="font-display text-lg font-bold text-foreground mb-1">Graduation Eligibility</h2>
          <p className="text-xs text-muted-foreground mb-4">Students eligible vs ineligible for convocation</p>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={220}>
              <PieChart>
                <Pie data={graduationEligibility} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={5} dataKey="value">
                  {graduationEligibility.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ background: PIE_COLORS[0] }} />
                <div>
                  <p className="text-sm font-semibold text-foreground">198 Eligible</p>
                  <p className="text-xs text-muted-foreground">80.2%</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ background: PIE_COLORS[1] }} />
                <div>
                  <p className="text-sm font-semibold text-foreground">49 Ineligible</p>
                  <p className="text-xs text-muted-foreground">19.8%</p>
                </div>
              </div>
              <div className="mt-2 px-3 py-2 rounded-lg bg-muted text-xs text-muted-foreground">
                Total graduands: <strong className="text-foreground">247</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: CWA Distribution + Program Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="font-display text-lg font-bold text-foreground mb-1">CWA Distribution</h2>
          <p className="text-xs text-muted-foreground mb-4">Number of students per CWA range</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={cwaDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(80 12% 88%)" />
              <XAxis dataKey="range" tick={{ fontSize: 11 }} stroke="hsl(120 8% 45%)" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(120 8% 45%)" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Students" fill="hsl(199 89% 48%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="font-display text-lg font-bold text-foreground mb-1">Program Distribution</h2>
          <p className="text-xs text-muted-foreground mb-4">Students enrolled per program</p>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={220}>
              <PieChart>
                <Pie data={programBreakdown} cx="50%" cy="50%" outerRadius={85} dataKey="value" label={false}>
                  {programBreakdown.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PROGRAM_COLORS[index % PROGRAM_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {programBreakdown.map((p, i) => (
                <div key={p.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: PROGRAM_COLORS[i % PROGRAM_COLORS.length] }} />
                  <span className="text-xs text-muted-foreground">{p.name}</span>
                  <span className="text-xs font-semibold text-foreground ml-auto">{p.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Thesis Progress + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="font-display text-lg font-bold text-foreground mb-1">Thesis Progress</h2>
          <p className="text-xs text-muted-foreground mb-4">Students at each stage of thesis completion</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={thesisProgress} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(80 12% 88%)" />
              <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(120 8% 45%)" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(120 8% 45%)" width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Students" radius={[0, 4, 4, 0]}>
                {thesisProgress.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="font-display text-lg font-bold text-foreground mb-1">Alerts & Notices</h2>
          <p className="text-xs text-muted-foreground mb-4">Items requiring admin attention</p>
          <div className="space-y-3">
            {recentAlerts.map((alert, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <div className={`shrink-0 w-7 h-7 rounded-md flex items-center justify-center ${alertStyles[alert.type]}`}>
                  {alertIcons[alert.type]}
                </div>
                <p className="text-sm text-foreground pt-0.5">{alert.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
