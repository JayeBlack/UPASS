import { useAuth } from "@/contexts/AuthContext";
import { useDataStore } from "@/contexts/DataStoreContext";
import { useAdminDepartment } from "@/hooks/use-admin-department";
import DashboardLayout from "@/components/DashboardLayout";
import SEO from "@/components/SEO";
import {
  BookOpen, FileText, Users, BarChart3, Clock, CheckCircle,
  ArrowUpRight, TrendingUp, TrendingDown, Activity, Banknote,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { supabase } from "@/integrations/supabase/client";

const StatCard = ({
  icon, label, value, sub, trend, accent, onClick, valueColor,
}: {
  icon: React.ReactNode; label: string; value: string;
  sub?: string; trend?: "up" | "down" | "neutral"; accent?: boolean; onClick?: () => void;
  valueColor?: "green" | "red" | "default";
}) => (
  <button
    onClick={onClick}
    className={`group relative bg-card rounded-2xl border border-border p-5 text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${onClick ? "cursor-pointer" : "cursor-default"}`}
  >
    {accent && (
      <div className="absolute inset-0 rounded-2xl gradient-gold opacity-[0.04]" />
    )}
    <div className="flex items-start justify-between mb-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
        valueColor === "green" ? "bg-green-100" : valueColor === "red" ? "bg-red-100" : accent ? "gradient-gold shadow-md shadow-secondary/20" : "bg-muted"
      }`}>
        {icon}
      </div>
      {trend && (
        <span className={`flex items-center gap-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
          trend === "up" ? "bg-success/10 text-success" : trend === "down" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"
        }`}>
          {trend === "up" ? <TrendingUp size={11} /> : trend === "down" ? <TrendingDown size={11} /> : <Activity size={11} />}
          {sub}
        </span>
      )}
    </div>
    <p className={`text-2xl font-bold font-display tracking-tight ${
      valueColor === "green" ? "text-green-600" : valueColor === "red" ? "text-red-500" : "text-foreground"
    }`}>{value}</p>
    <p className="text-xs text-muted-foreground mt-1 font-medium">{label}</p>
    {onClick && (
      <ArrowUpRight size={14} className="absolute top-5 right-5 text-muted-foreground/0 group-hover:text-muted-foreground/60 transition-all duration-300" />
    )}
  </button>
);

interface StatItem {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
  trend?: "up" | "down" | "neutral";
  sub?: string;
  onClick?: () => void;
  valueColor?: "green" | "red" | "default";
}

interface FeeSummary {
  total_fees: number;
  total_paid: number;
  total_students: number;
  cleared_count: number;
  owing_count: number;
  compliance_rate: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { students, graduands } = useDataStore();
  const { isSuperAdmin, adminDepartment } = useAdminDepartment();

  // Live data states
  const [feeSummary, setFeeSummary] = useState<FeeSummary | null>(null);
  const [analyticsOverview, setAnalyticsOverview] = useState<{ total_students: number; active_students: number } | null>(null);
  const [studentFeeData, setStudentFeeData] = useState<any[]>([]);
  const [activeCoursesCount, setActiveCoursesCount] = useState("—");
  const [resultsBatches, setResultsBatches] = useState<any[]>([]);
  const [supervisorData, setSupervisorData] = useState({ assignedStudents: "—", pendingReviews: "—", awaitingApproval: "—" });
  const [recentActivity, setRecentActivity] = useState<{ text: string; time: string }[]>([]);

  const formatActivityTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    const h = Math.floor(diff / 3600000);
    const d = Math.floor(diff / 86400000);
    if (m < 1) return "Just now";
    if (m < 60) return `${m}m ago`;
    if (h < 24) return `${h}h ago`;
    return `${d}d ago`;
  };

  const formatActivityText = (log: any) => {
    const detail = log.details ? (typeof log.details === "string" ? JSON.parse(log.details) : log.details) : {};
    const entity = detail.student ? `for ${detail.student}` : log.entity_id ? `#${log.entity_id}` : "";
    const stage = detail.stage ? ` (${detail.stage})` : "";
    return `${log.action}${stage ? stage : ""} ${entity}`.trim();
  };

  // Fetch recent activity for current user
  useEffect(() => {
    if (!user?.id) return;
    const fetchActivity = async () => {
      try {
        const logs = await apiFetch<any[]>("/audit-logs/mine");
        setRecentActivity(
          (logs || []).map((l) => ({ text: formatActivityText(l), time: formatActivityTime(l.created_at) }))
        );
      } catch { /* silently fail */ }
    };
    fetchActivity();
    const interval = setInterval(fetchActivity, 15000);
    return () => clearInterval(interval);
  }, [user?.id]);

  // Generic periodic fetch helper
  const fetchWithInterval = (fetcher: () => Promise<void>, ms: number) => {
    fetcher();
    const id = setInterval(fetcher, ms);
    return () => clearInterval(id);
  };

  // ─── Accountant / Admin / Dean / AccountingAssistant / Registrar / AdminAssistant Fee Summary ───
  useEffect(() => {
    const fetchRoles = ["Accountant", "Admin", "Dean", "ViceDean", "ExamsOfficer", "AccountingAssistant", "Registrar", "AdminAssistant"];
    if (!user?.role || !fetchRoles.includes(user.role)) return;
    
    return fetchWithInterval(async () => {
      try {
        const params = adminDepartment ? `?department=${encodeURIComponent(adminDepartment)}` : "";
        console.log(`[Dashboard] Fetching fee summary for ${user.role}...`);
        const data = await apiFetch<FeeSummary>(`/fees/summary${params}`);
        console.log(`[Dashboard] Fee summary for ${user.role}:`, data);
        setFeeSummary(data);
        if (!data || data.total_students === 0) {
          console.warn(`[Dashboard] No fee data returned for ${user.role}`);
        }
      } catch (err: any) {
        console.error(`[Dashboard] Failed to fetch fee summary for ${user.role}:`, err);
        console.error(`[Dashboard] Error details:`, err.message);
      }
    }, 10000);
  }, [user?.role, adminDepartment]);

  // ─── Analytics Overview (real student/graduand counts from DB) ───
  useEffect(() => {
    if (user?.role !== "Admin" && user?.role !== "Dean" && user?.role !== "ViceDean" && user?.role !== "Registrar" && user?.role !== "AdminAssistant") return;
    return fetchWithInterval(async () => {
      try {
        // Dean/ViceDean are super admin (per useAdminDepartment), so no dept filter needed
        const data = await apiFetch<{ total_students: number; active_students: number }>("/analytics/overview");
        setAnalyticsOverview(data);
      } catch { /* ignore */ }
    }, 15000);
  }, [user?.role]);

  // ─── Student course registration and thesis progress ───
  const [registeredCoursesCount, setRegisteredCoursesCount] = useState("—");
  const [thesisProgress, setThesisProgress] = useState("—");
  
  useEffect(() => {
    if (user?.role !== "Student" || !user?.id) return;
    return fetchWithInterval(async () => {
      try {
        // Get student ID for course count
        const studentRes = await apiFetch<{ id: number }>(`/students/by-user/${user.id}`);
        if (studentRes?.id) {
          const courses = await apiFetch<any[]>(`/courses/student/${studentRes.id}`);
          setRegisteredCoursesCount(String(courses?.length || 0));
        }
        // Thesis progress — from Supabase (same source as ThesisUpload page)
        const { data: submissions } = await supabase
          .from("thesis_submissions")
          .select("stage, status, submitted_at")
          .eq("student_id", user.id)
          .order("submitted_at", { ascending: false });
        if (!submissions || submissions.length === 0) {
          setThesisProgress("Not Started");
        } else {
          // Show the most recent submission's stage + status
          const latest = submissions[0];
          const stages = ["Proposal", "Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Defense"];
          const approvedStages = submissions
            .filter((s: any) => s.status === "Approved")
            .map((s: any) => stages.indexOf(s.stage))
            .filter((i: number) => i !== -1);
          if (approvedStages.length === stages.length) {
            setThesisProgress("Completed ✓");
          } else if (approvedStages.length > 0) {
            const nextIdx = Math.max(...approvedStages) + 1;
            const nextStage = stages[nextIdx] || "Defense";
            setThesisProgress(`${nextStage} — In Progress`);
          } else {
            // Has submissions but none approved yet
            setThesisProgress(`${latest.stage} — ${latest.status}`);
          }
        }
      } catch { /* ignore */ }
    }, 15000);
  }, [user?.role, user?.id]);

  // ─── Student fee data ───
  useEffect(() => {
    if (user?.role !== "Student" || !user?.id) return;
    return fetchWithInterval(async () => {
      try {
        const data = await apiFetch<any[]>(`/fees/student/${user.id}`);
        setStudentFeeData(data || []);
      } catch (err) {
        console.error("Failed to fetch student fees:", err);
      }
    }, 10000);
  }, [user?.role, user?.id]);

  // ─── Supervisor average review time ───
  const [avgReviewTime, setAvgReviewTime] = useState("—");
  
  useEffect(() => {
    if (user?.role !== "Supervisor") return;
    return fetchWithInterval(async () => {
      try {
        const stats = await apiFetch<{ avg_review_time_days: number }>("/supervisors/current/review-stats");
        if (stats?.avg_review_time_days != null) {
          setAvgReviewTime(`${Math.round(stats.avg_review_time_days)} days`);
        }
      } catch { /* ignore */ }
    }, 30000);
  }, [user?.role]);

  // ─── Active courses count ───
  useEffect(() => {
    if (user?.role !== "Admin" && user?.role !== "Dean" && user?.role !== "ViceDean") return;
    return fetchWithInterval(async () => {
      try {
        const courses = await apiFetch<any[]>("/courses");
        setActiveCoursesCount(String(courses?.filter((c: any) => c.is_active !== false).length || 0));
      } catch { /* ignore */ }
    }, 30000);
  }, [user?.role]);

  // ─── Results batches (ExamsOfficer) ───
  useEffect(() => {
    if (user?.role !== "ExamsOfficer") return;
    return fetchWithInterval(async () => {
      try {
        const batches = await apiFetch<any[]>("/results/batches");
        setResultsBatches(batches || []);
      } catch { /* ignore */ }
    }, 15000);
  }, [user?.role]);

  // ─── Pass rate calculation (ExamsOfficer) ───
  const [passRate, setPassRate] = useState<string>("—");
  useEffect(() => {
    if (user?.role !== "ExamsOfficer") return;
    return fetchWithInterval(async () => {
      try {
        const overview = await apiFetch<{ graduands_eligible: number; graduands_ineligible: number }>("/analytics/overview");
        const total = overview.graduands_eligible + overview.graduands_ineligible;
        if (total > 0) {
          const rate = Math.round((overview.graduands_eligible / total) * 100);
          setPassRate(`${rate}%`);
        } else {
          setPassRate("0%");
        }
      } catch { setPassRate("—"); }
    }, 15000);
  }, [user?.role]);

  // ─── Supervisor stats ───
  useEffect(() => {
    if (user?.role !== "Supervisor") return;
    const fetchSupervisorStats = async () => {
      try {
        const [backendStats, supervisorStudents] = await Promise.all([
          apiFetch<any>("/supervisors/current/stats"),
          apiFetch<any>("/supervisors/current/submissions"),
        ]);
        const assignedStudentsList: { index_number: string }[] = supervisorStudents.students || [];
        const assignedIndexSet = new Set(
          assignedStudentsList
            .map((s) => s.index_number?.trim().toLowerCase())
            .filter(Boolean)
        );

        const { data: submissions, error } = await supabase
          .from("thesis_submissions")
          .select("student_index, status");

        const filtered = (!error && submissions)
          ? submissions.filter((sub: any) =>
              assignedIndexSet.has(sub.student_index?.trim().toLowerCase())
            )
          : [];

        const pendingCount = filtered.filter((sub: any) => sub.status === "Pending").length;
        const awaitingApproval = filtered.filter((sub: any) =>
          sub.status !== "Approved" && sub.status !== "Rejected"
        ).length;

        setSupervisorData({
          assignedStudents: String(backendStats.assignedStudents || 0),
          pendingReviews: String(pendingCount),
          awaitingApproval: String(awaitingApproval),
        });
      } catch { /* silently fail */ }
    };
    fetchSupervisorStats();
    const channel = supabase
      .channel("dashboard_supervisor_submissions")
      .on("postgres_changes",
        { event: "*", schema: "public", table: "thesis_submissions" },
        () => fetchSupervisorStats()
      )
      .subscribe();
    const interval = setInterval(fetchSupervisorStats, 30000);
    return () => { supabase.removeChannel(channel); clearInterval(interval); };
  }, [user?.role]);

  // Filter data by department for departmental admins
  const deptStudents = adminDepartment
    ? students.filter((s) => s.department === adminDepartment)
    : students;
  const deptGraduands = adminDepartment
    ? graduands.filter((g) => g.department === adminDepartment)
    : graduands;

  // Use real DB counts from analytics overview (queries ALL students) when available,
  // fall back to feeSummary (counts students WITH fee records), then local DataStore.
  const totalStudents = analyticsOverview?.total_students ?? feeSummary?.total_students ?? deptStudents.length;
  const activeStudents = analyticsOverview?.active_students ?? deptStudents.filter((s) => s.status === "Active").length;
  const totalGraduands = deptGraduands.filter((g) => g.status === "Eligible").length;
  const feesClearedPct = feeSummary?.compliance_rate ?? 0;

  // Student computed data - always calculate
  const totalStudentFees = studentFeeData.reduce((sum: number, f: any) => sum + (f.total_amount || 0), 0);
  const totalStudentPaid = studentFeeData.reduce((sum: number, f: any) => sum + (f.amount_paid || 0), 0);
  const totalStudentOwed = studentFeeData.reduce((sum: number, f: any) => sum + (f.outstanding || 0), 0);

  // Exams Officer computed
  const publishedBatches = resultsBatches.filter((b: any) => b.status === "Published").length;
  const pendingBatches = resultsBatches.filter((b: any) => b.status === "Draft").length;

  const formatGHS = (amount: number) => {
    const num = parseFloat(String(amount));
    return `GHS ${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const studentStats = [
    { icon: <BookOpen size={18} className="text-secondary-foreground" />, label: "Registered Courses", value: registeredCoursesCount, accent: true, onClick: () => navigate("/courses/register") },
    { 
      icon: <FileText size={18} className={thesisProgress.includes("Completed") ? "text-green-600" : thesisProgress.includes("Pending") ? "text-yellow-600" : thesisProgress.includes("Approved") || thesisProgress.includes("Progress") ? "text-blue-600" : thesisProgress.includes("Rejected") ? "text-red-500" : "text-muted-foreground"} />, 
      label: "Thesis Progress", 
      value: thesisProgress,
      valueColor: thesisProgress.includes("Completed") ? "green" as const : thesisProgress.includes("Rejected") ? "red" as const : "default" as const,
      onClick: () => navigate("/thesis/upload") 
    },
    { icon: <BarChart3 size={18} className="text-green-600" />, label: "Total Fees Paid", value: formatGHS(totalStudentPaid), valueColor: "green" as const, onClick: () => navigate("/finances") },
    { icon: <Clock size={18} className="text-red-500" />, label: "Outstanding Balance", value: formatGHS(totalStudentOwed), valueColor: totalStudentOwed > 0 ? "red" as const : "green" as const, onClick: () => navigate("/finances") },
  ];

  const supervisorStats = [
    { icon: <Users size={18} className="text-secondary-foreground" />, label: "Assigned Students", value: supervisorData.assignedStudents, accent: true, onClick: () => navigate("/students") },
    { icon: <FileText size={18} className="text-muted-foreground" />, label: "Pending Reviews", value: supervisorData.pendingReviews, onClick: () => navigate("/submissions") },
    { icon: <CheckCircle size={18} className="text-muted-foreground" />, label: "Awaiting Approval", value: supervisorData.awaitingApproval },
    { icon: <Clock size={18} className="text-muted-foreground" />, label: "Avg Review Time", value: avgReviewTime },
  ];

  const adminStats = [
    { icon: <Users size={18} className="text-secondary-foreground" />, label: "Total Students", value: String(totalStudents), accent: true, sub: `${activeStudents} active`, onClick: () => navigate("/admin/students") },
    { icon: <BookOpen size={18} className="text-muted-foreground" />, label: "Active Courses", value: activeCoursesCount },
    { 
      icon: <BarChart3 size={18} className="text-muted-foreground" />, 
      label: "Fees Cleared", 
      value: feeSummary && feeSummary.compliance_rate != null ? `${Math.round(Number(feeSummary.compliance_rate))}%` : "0%", 
      onClick: () => navigate("/admin/fees") 
    },
    { icon: <CheckCircle size={18} className="text-muted-foreground" />, label: "Graduands", value: String(totalGraduands), onClick: () => navigate("/admin/passlist") },
  ];

  const deanStats = [
    { icon: <Users size={18} className="text-secondary-foreground" />, label: "Total Students", value: String(totalStudents), accent: true, sub: `${activeStudents} active`, onClick: () => navigate("/admin/students") },
    { 
      icon: <BarChart3 size={18} className="text-muted-foreground" />, 
      label: "Total Fees Collected", 
      value: feeSummary && feeSummary.total_paid != null ? formatGHS(Number(feeSummary.total_paid)) : "GHS 0.00", 
      onClick: () => navigate("/admin/fees") 
    },
    { 
      icon: <Banknote size={18} className="text-muted-foreground" />, 
      label: "Compliance Rate", 
      value: feeSummary && feeSummary.compliance_rate != null ? `${Math.round(Number(feeSummary.compliance_rate))}%` : "0%" 
    },
    { icon: <Clock size={18} className="text-muted-foreground" />, label: "Graduands", value: String(totalGraduands), onClick: () => navigate("/admin/passlist") },
  ];

  const accountantStats = [
    { icon: <Banknote size={18} className="text-secondary-foreground" />, label: "Total Fees Collected", value: feeSummary ? formatGHS(feeSummary.total_paid) : "GHS 0.00", accent: true, onClick: () => navigate("/accountant/analytics") },
    { 
      icon: <BarChart3 size={18} className="text-muted-foreground" />, 
      label: "Compliance Rate", 
      value: feeSummary && feeSummary.compliance_rate != null ? `${Math.round(Number(feeSummary.compliance_rate))}%` : "0%" 
    },
    { icon: <Users size={18} className="text-muted-foreground" />, label: "Outstanding Students", value: feeSummary ? String(feeSummary.owing_count) : "0", onClick: () => navigate("/admin/fees") },
    { icon: <Clock size={18} className="text-muted-foreground" />, label: "Total Fees", value: feeSummary ? formatGHS(feeSummary.total_fees) : "GHS 0.00" },
  ];

  const examsOfficerStats = [
    { icon: <BarChart3 size={18} className="text-secondary-foreground" />, label: "Results Published", value: String(publishedBatches), accent: true },
    { icon: <FileText size={18} className="text-muted-foreground" />, label: "Pending Batches", value: String(pendingBatches) },
    { icon: <Users size={18} className="text-muted-foreground" />, label: "Total Students", value: String(totalStudents) },
    { icon: <CheckCircle size={18} className="text-muted-foreground" />, label: "Pass Rate", value: passRate, onClick: () => navigate("/exams/passlist") },
  ];

  const registrarStats = [
    { icon: <Users size={18} className="text-secondary-foreground" />, label: "Total Students", value: String(totalStudents), accent: true, sub: `${activeStudents} active`, onClick: () => navigate("/admin/students") },
    { 
      icon: <BarChart3 size={18} className="text-muted-foreground" />, 
      label: "Fees Cleared", 
      value: feeSummary && feeSummary.compliance_rate != null ? `${Math.round(Number(feeSummary.compliance_rate))}%` : "0%", 
      onClick: () => navigate("/admin/fees") 
    },
    { 
      icon: <Banknote size={18} className="text-muted-foreground" />, 
      label: "Total Collected", 
      value: feeSummary && feeSummary.total_paid != null ? formatGHS(Number(feeSummary.total_paid)) : "GHS 0.00" 
    },
    { icon: <CheckCircle size={18} className="text-muted-foreground" />, label: "Graduands", value: String(totalGraduands), onClick: () => navigate("/admin/passlist") },
  ];

  const adminAssistantStats = [
    { icon: <Users size={18} className="text-secondary-foreground" />, label: "Total Students", value: String(totalStudents), accent: true, sub: `${activeStudents} active`, onClick: () => navigate("/admin/students") },
    { 
      icon: <BarChart3 size={18} className="text-muted-foreground" />, 
      label: "Fees Cleared", 
      value: feeSummary && feeSummary.compliance_rate != null ? `${Math.round(Number(feeSummary.compliance_rate))}%` : "0%", 
      onClick: () => navigate("/admin/fees") 
    },
    { 
      icon: <Banknote size={18} className="text-muted-foreground" />, 
      label: "Total Collected", 
      value: feeSummary && feeSummary.total_paid != null ? formatGHS(Number(feeSummary.total_paid)) : "GHS 0.00" 
    },
    { icon: <CheckCircle size={18} className="text-muted-foreground" />, label: "Graduands", value: String(totalGraduands), onClick: () => navigate("/admin/passlist") },
  ];

  const roleStatsMap: Record<string, StatItem[]> = {
    Student: studentStats,
    Supervisor: supervisorStats,
    Admin: adminStats,
    Dean: deanStats,
    ViceDean: deanStats,
    Accountant: accountantStats,
    AccountingAssistant: accountantStats,
    ExamsOfficer: examsOfficerStats,
    Registrar: registrarStats,
    AdminAssistant: adminAssistantStats,
  };
  const displayStats = roleStatsMap[user?.role || "Student"] ?? studentStats;

  const quickActionRoutes: Record<string, string> = {
    "Register Courses": "/courses/register",
    "Upload Chapter": "/thesis/upload",
    "View Results": "/results",
    "Request Documents": "/documents",
    "Review Pending": "/submissions",
    "Add Remarks": "/submissions",
    "View Students": "/students",
    "Enroll Students": "/admin/students",
    "Update Fees": "/admin/fees",
    "Generate List": "/admin/passlist",
    "View Analytics": "/admin/analytics",
    "System Log": "/admin/log",
    "Approve Clearance": "/dean/clearance",
    "CWA Results": "/dean/results",
    "Manage Students": "/admin/students",
    "Fee Analytics": "/accountant/analytics",
    "Student Fees": "/admin/fees",
    "Export Reports": "/accountant/reports",
    "Fee Notices": "/accountant/announcements",
    "Enter Grades": "/exams/grades",
    "Pass List": "/exams/passlist",
    "Publish Results": "/exams/publish",
    "View Fees": "/admin/fees",
  };

  const quickActionIcons: Record<string, React.ReactNode> = {
    "Register Courses": <BookOpen size={15} />,
    "Upload Chapter": <FileText size={15} />,
    "View Results": <BarChart3 size={15} />,
    "Request Documents": <FileText size={15} />,
    "Review Pending": <Clock size={15} />,
    "Add Remarks": <FileText size={15} />,
    "View Students": <Users size={15} />,
    "Enroll Students": <Users size={15} />,
    "Update Fees": <Banknote size={15} />,
    "Generate List": <CheckCircle size={15} />,
    "View Analytics": <BarChart3 size={15} />,
    "System Log": <FileText size={15} />,
    "Approve Clearance": <CheckCircle size={15} />,
    "CWA Results": <BarChart3 size={15} />,
    "Manage Students": <Users size={15} />,
    "Fee Analytics": <BarChart3 size={15} />,
    "Student Fees": <Banknote size={15} />,
    "Export Reports": <FileText size={15} />,
    "Fee Notices": <FileText size={15} />,
    "Enter Grades": <BookOpen size={15} />,
    "Pass List": <CheckCircle size={15} />,
    "Publish Results": <BarChart3 size={15} />,
    "View Fees": <Banknote size={15} />,
  };


  const quickActions = user?.role === "Student"
    ? ["Register Courses", "Upload Chapter", "View Results", "Request Documents"]
    : user?.role === "Supervisor"
    ? ["Review Pending", "Add Remarks", "View Students"]
    : user?.role === "Dean" || user?.role === "ViceDean"
    ? ["View Analytics", "Manage Students", "Approve Clearance", "Student Fees"]
    : user?.role === "Registrar"
    ? ["Manage Students", "View Fees", "Generate List", "View Analytics"]
    : user?.role === "AdminAssistant"
    ? ["Manage Students", "View Fees", "Generate List"]
    : user?.role === "Accountant" || user?.role === "AccountingAssistant"
    ? ["Fee Analytics", "Student Fees", "Export Reports", "Fee Notices"]
    : user?.role === "ExamsOfficer"
    ? ["Enter Grades", "Pass List", "Publish Results", "View Analytics"]
    : isSuperAdmin
    ? ["Enroll Students", "Update Fees", "Generate List", "System Log"]
    : ["Enroll Students", "Update Fees", "Generate List"];

  return (
    <DashboardLayout>
      <SEO
        title="Dashboard — UMaT Postgraduate Portal"
        description="Your personalised UMaT postgraduate dashboard: courses, thesis progress, fees and clearance at a glance."
      />
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
          Welcome back, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          {user?.role === "Student" && `${user.program} · ${user.department}`}
          {user?.role === "Supervisor" && (user.department ? `Department of ${user.department}` : "Supervisor — School of Postgraduate Studies")}
          {user?.role === "Dean" && "Dean — School of Postgraduate Studies"}
          {user?.role === "ViceDean" && "Vice Dean — School of Postgraduate Studies"}
          {user?.role === "Registrar" && "Registrar's Office — School of Postgraduate Studies"}
          {user?.role === "AdminAssistant" && (user.department ? `Admin Assistant — ${user.department}` : "Admin Assistant — School of Postgraduate Studies")}
          {user?.role === "Accountant" && "Finance Office — School of Postgraduate Studies"}
          {user?.role === "AccountingAssistant" && "Finance Office Assistant — School of Postgraduate Studies"}
          {user?.role === "ExamsOfficer" && "Examinations Office — School of Postgraduate Studies"}
          {user?.role === "Admin" && (user.department ? `Department Admin — ${user.department}` : "Super Admin — School of Postgraduate Studies")}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {displayStats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Two-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-bold text-foreground">Recent Activity</h2>
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
              {recentActivity.length} updates
            </span>
          </div>
          <div className="overflow-y-auto max-h-72 space-y-1 pr-1 scrollbar-thin">
            {activityLoading ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground text-sm gap-2">
                <Activity size={14} className="animate-pulse" /> Loading activity...
              </div>
            ) : recentActivity.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">No recent activity</div>
            ) : (
              recentActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center mt-0.5 shrink-0">
                    {activityTypeIcon[a.type || 'general'] ?? <Activity size={14} className="text-muted-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground leading-relaxed">{a.text}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">{formatActivityTime(a.time)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-2xl border border-border p-6 flex flex-col">
          <h2 className="font-display text-lg font-bold text-foreground mb-5">Quick Actions</h2>
          <div className="overflow-y-auto max-h-72 space-y-2 pr-1 scrollbar-thin">
            {quickActions.map((action) => (
              <button
                key={action}
                onClick={() => navigate(quickActionRoutes[action])}
                className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted hover:border-muted-foreground/20 transition-all duration-200"
              >
                <span className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {quickActionIcons[action] || <ArrowUpRight size={15} />}
                </span>
                <span className="flex-1 text-left">{action}</span>
                <ArrowUpRight size={14} className="text-muted-foreground/0 group-hover:text-muted-foreground transition-all" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;