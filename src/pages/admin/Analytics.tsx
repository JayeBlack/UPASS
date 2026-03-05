import DashboardLayout from "@/components/DashboardLayout";
import { Users, BookOpen, DollarSign, GraduationCap, TrendingUp, CheckCircle, Clock, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const enrollmentByDept = [
  { name: "Computer Sci", students: 98 },
  { name: "Mining Eng", students: 62 },
  { name: "Electrical Eng", students: 45 },
  { name: "Mechanical Eng", students: 42 },
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
  { name: "Proposal", value: 28 },
  { name: "Ch 1-2", value: 45 },
  { name: "Ch 3-4", value: 65 },
  { name: "Submitted", value: 38 },
  { name: "Defended", value: 22 },
];

const graduationRate = [
  { name: "Eligible", value: 198, color: "hsl(142 71% 45%)" },
  { name: "Ineligible", value: 49, color: "hsl(0 72% 51%)" },
];

const COLORS = ["hsl(142 71% 45%)", "hsl(0 72% 51%)"];

const StatCard = ({ icon, label, value, sub, accent }: { icon: React.ReactNode; label: string; value: string; sub?: string; accent?: boolean }) => (
  <div className="bg-card rounded-xl border border-border p-5">
    <div className="flex items-center gap-3 mb-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${accent ? "gradient-gold" : "bg-muted"}`}>
        {icon}
      </div>
    </div>
    <p className="text-2xl font-bold font-display text-foreground">{value}</p>
    <p className="text-sm text-muted-foreground mt-1">{label}</p>
    {sub && <p className="text-xs text-success mt-1">{sub}</p>}
  </div>
);

const Analytics = () => (
  <DashboardLayout>
    <div className="mb-8">
      <h1 className="text-3xl font-bold font-display text-foreground">School Analytics</h1>
      <p className="text-muted-foreground mt-1">Overview of postgraduate school performance</p>
    </div>

    {/* Key Metrics */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      <StatCard icon={<Users size={18} className="text-secondary-foreground" />} label="Total Students" value="247" sub="↑ 12% from last year" accent />
      <StatCard icon={<GraduationCap size={18} className="text-muted-foreground" />} label="Graduands" value="198" sub="80.2% eligible" />
      <StatCard icon={<DollarSign size={18} className="text-muted-foreground" />} label="Fees Collected" value="GH₵ 1.25M" sub="82% collection rate" />
      <StatCard icon={<BookOpen size={18} className="text-muted-foreground" />} label="Active Programs" value="12" />
    </div>

    {/* Charts Row 1 */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Enrollment by Department */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="font-display text-lg font-bold text-foreground mb-4">Enrollment by Department</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={enrollmentByDept}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(80 12% 88%)" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(120 8% 45%)" />
            <YAxis tick={{ fontSize: 12 }} stroke="hsl(120 8% 45%)" />
            <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(80 12% 88%)", fontSize: "12px" }} />
            <Bar dataKey="students" fill="hsl(145 60% 22%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Graduation Eligibility */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="font-display text-lg font-bold text-foreground mb-4">Graduation Eligibility</h2>
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={graduationRate} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {graduationRate.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>

    {/* Charts Row 2 */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Fees Collection Trend */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="font-display text-lg font-bold text-foreground mb-4">Fees Collection Trend (GH₵)</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={feesCollection}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(80 12% 88%)" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(120 8% 45%)" />
            <YAxis tick={{ fontSize: 12 }} stroke="hsl(120 8% 45%)" />
            <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(80 12% 88%)", fontSize: "12px" }} />
            <Line type="monotone" dataKey="collected" stroke="hsl(145 60% 22%)" strokeWidth={2} dot={{ fill: "hsl(145 60% 22%)" }} />
            <Line type="monotone" dataKey="target" stroke="hsl(48 95% 50%)" strokeWidth={2} strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Thesis Progress Distribution */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="font-display text-lg font-bold text-foreground mb-4">Thesis Progress Distribution</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={thesisProgress}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(80 12% 88%)" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(120 8% 45%)" />
            <YAxis tick={{ fontSize: 12 }} stroke="hsl(120 8% 45%)" />
            <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(80 12% 88%)", fontSize: "12px" }} />
            <Bar dataKey="value" fill="hsl(48 95% 50%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Quick Stats Row */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div className="bg-card rounded-xl border border-border p-5 flex items-center gap-3">
        <CheckCircle size={20} className="text-success" />
        <div>
          <p className="text-lg font-bold font-display text-foreground">204</p>
          <p className="text-xs text-muted-foreground">Fees Cleared</p>
        </div>
      </div>
      <div className="bg-card rounded-xl border border-border p-5 flex items-center gap-3">
        <Clock size={20} className="text-warning" />
        <div>
          <p className="text-lg font-bold font-display text-foreground">43</p>
          <p className="text-xs text-muted-foreground">Fees Outstanding</p>
        </div>
      </div>
      <div className="bg-card rounded-xl border border-border p-5 flex items-center gap-3">
        <TrendingUp size={20} className="text-info" />
        <div>
          <p className="text-lg font-bold font-display text-foreground">68.5</p>
          <p className="text-xs text-muted-foreground">Avg. CWA</p>
        </div>
      </div>
      <div className="bg-card rounded-xl border border-border p-5 flex items-center gap-3">
        <BarChart3 size={20} className="text-secondary" />
        <div>
          <p className="text-lg font-bold font-display text-foreground">34</p>
          <p className="text-xs text-muted-foreground">Active Courses</p>
        </div>
      </div>
    </div>
  </DashboardLayout>
);

export default Analytics;
