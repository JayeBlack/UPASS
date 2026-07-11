import DashboardLayout from "@/components/DashboardLayout";
import { Clock, Filter, Users, Shield, BookOpen, Banknote, FileText, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAdminDepartment } from "@/hooks/use-admin-department";
import { Navigate } from "react-router-dom";
import { apiFetch, logActivity } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface LogEntry {
  id: string;
  created_at: string;
  actor_name: string;
  actor_role: string;
  action: string;
  entity: string;
  details: string;
}

const categoryIcons: Record<string, React.ReactNode> = {
  Students: <Users size={14} />,
  Fees: <Banknote size={14} />,
  Results: <BookOpen size={14} />,
  Clearance: <Shield size={14} />,
};

const SystemLog = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [catFilter, setCatFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const { user } = useAdminDepartment();
  const { toast } = useToast();

  // Allow the administrative roles that are expected to view audit activity.
  const canAccess = user?.role === "Admin" || user?.role === "Dean" || user?.role === "ViceDean" || user?.role === "Registrar" || user?.role === "AdminAssistant" || user?.role === "Accountant" || user?.role === "AccountingAssistant" || user?.role === "ExamsOfficer";

  useEffect(() => {
    if (!user) return; // still loading auth
    if (!canAccess) return;

    let active = true;
    setLoading(true);
    setError(null);

    apiFetch<LogEntry[]>("/audit-logs")
      .then((data) => {
        if (!active) return;
        const nextLogs = Array.isArray(data) ? data : [];
        setLogs(nextLogs);
        if (nextLogs.length === 0) {
          void logActivity("Viewed system log", "System Log", "system_log", { path: "/admin/log" });
        }
      })
      .catch((err) => {
        if (!active) return;
        const message = err instanceof Error ? err.message : "Please try again later.";
        setLogs([]);
        setError(message);
        toast({ title: "Failed to load audit logs", description: message, variant: "destructive" });
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user, canAccess, toast]);

  if (user && !canAccess) return <Navigate to="/dashboard" replace />;

  const categories = [...new Set(logs.map((l) => l.entity).filter(Boolean))];
  const roles = [...new Set(logs.map((l) => l.actor_role).filter(Boolean))];

  const filtered = logs.filter((l) => {
    const matchesCat = catFilter === "all" || l.entity === catFilter;
    const matchesRole = roleFilter === "all" || l.actor_role === roleFilter;
    return matchesCat && matchesRole;
  });

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-foreground">System Log</h1>
        <p className="text-muted-foreground mt-1">Track all activities across the system</p>
      </div>

      <div className="flex flex-col gap-3 mb-6 lg:flex-row lg:items-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter size={16} />
          <span>Filter:</span>
        </div>
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring lg:w-auto">
          <option value="all">All Categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring lg:w-auto">
          <option value="all">All Roles</option>
          {roles.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
          <Loader2 size={18} className="animate-spin mr-2" /> Loading audit logs...
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-4">Showing {filtered.length} of {logs.length} entries</p>
          <div className="space-y-3">
            {error ? (
              <div className="bg-card rounded-xl border border-border p-12 text-center">
                <FileText size={36} className="mx-auto text-muted-foreground mb-3" />
                <p className="text-sm font-medium text-foreground">The system log could not be loaded right now.</p>
                <p className="text-sm text-muted-foreground mt-2">{error}</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-card rounded-xl border border-border p-12 text-center">
                <FileText size={36} className="mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">No audit log entries found</p>
              </div>
            ) : filtered.map((log) => (
              <div key={log.id} className="bg-card rounded-xl border border-border p-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                  {categoryIcons[log.entity] || <FileText size={14} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-medium text-foreground">{log.action}</span>
                    {log.entity && <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{log.entity}</span>}
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{log.actor_role}</span>
                  </div>
                  {log.details && <p className="text-sm text-muted-foreground">{log.details}</p>}
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock size={12} /> {new Date(log.created_at).toLocaleString()}</span>
                    <span>by {log.actor_name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default SystemLog;
