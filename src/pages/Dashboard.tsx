import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { BookOpen, FileText, Users, BarChart3, Clock, CheckCircle } from "lucide-react";

const StatCard = ({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent?: boolean }) => (
  <div className="bg-card rounded-xl border border-border p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${accent ? "gradient-gold" : "bg-muted"}`}>
        {icon}
      </div>
    </div>
    <p className="text-2xl font-bold font-display text-foreground">{value}</p>
    <p className="text-sm text-muted-foreground mt-1">{label}</p>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();

  const studentStats = [
    { icon: <BookOpen size={18} className="text-secondary-foreground" />, label: "Registered Courses", value: "6", accent: true },
    { icon: <FileText size={18} className="text-muted-foreground" />, label: "Thesis Progress", value: "Ch. 3" },
    { icon: <BarChart3 size={18} className="text-muted-foreground" />, label: "GPA", value: "3.72" },
    { icon: <Clock size={18} className="text-muted-foreground" />, label: "Pending Reviews", value: "2" },
  ];

  const supervisorStats = [
    { icon: <Users size={18} className="text-secondary-foreground" />, label: "Assigned Students", value: "8", accent: true },
    { icon: <FileText size={18} className="text-muted-foreground" />, label: "Pending Reviews", value: "5" },
    { icon: <CheckCircle size={18} className="text-muted-foreground" />, label: "Approved This Month", value: "12" },
    { icon: <Clock size={18} className="text-muted-foreground" />, label: "Avg Review Time", value: "3d" },
  ];

  const adminStats = [
    { icon: <Users size={18} className="text-secondary-foreground" />, label: "Total Students", value: "247", accent: true },
    { icon: <BookOpen size={18} className="text-muted-foreground" />, label: "Active Courses", value: "34" },
    { icon: <BarChart3 size={18} className="text-muted-foreground" />, label: "Fees Cleared", value: "82%" },
    { icon: <CheckCircle size={18} className="text-muted-foreground" />, label: "Graduands", value: "56" },
  ];

  const stats = user?.role === "Student" ? studentStats : user?.role === "Supervisor" ? supervisorStats : adminStats;

  const recentActivity = [
    { text: "Thesis Chapter 2 submitted for review", time: "2 hours ago" },
    { text: "Course registration approved by advisor", time: "1 day ago" },
    { text: "New announcement from Graduate School", time: "2 days ago" },
    { text: "Fees payment confirmed", time: "3 days ago" },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-foreground">
          Welcome, {user?.name?.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground mt-1">
          {user?.role === "Student" && `${user.program} • ${user.department}`}
          {user?.role === "Supervisor" && `Department of ${user.department}`}
          {user?.role === "Admin" && "School of Postgraduate Studies"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="font-display text-lg font-bold text-foreground mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-secondary mt-2 shrink-0" />
                <div>
                  <p className="text-sm text-foreground">{a.text}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="font-display text-lg font-bold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {(user?.role === "Student"
              ? ["Register Courses", "Upload Chapter", "View Results", "Contact Supervisor"]
              : user?.role === "Supervisor"
              ? ["Review Pending", "Add Remarks", "View Students", "Download Reports"]
              : ["Enroll Students", "Update Fees", "Generate List", "Send Notice"]
            ).map((action) => (
              <button
                key={action}
                className="px-4 py-3 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors text-left"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
