import DashboardLayout from "@/components/DashboardLayout";
import { CheckCircle, XCircle, Clock, Filter, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface ClearanceStep {
  id: string;
  student_id: string;
  index_number: string;
  first_name: string;
  last_name: string;
  program_name: string;
  department_name: string;
  department: string;
  description: string;
  status: string;
  step_order: number;
  created_at: string;
}

const ClearanceApprovals = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [steps, setSteps] = useState<ClearanceStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [approvedCount, setApprovedCount] = useState(0);

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiFetch<ClearanceStep[]>("/clearance/pending");
      setSteps(data || []);

      // also get total approved count
      const all = await apiFetch<any[]>("/clearance/pending?include_cleared=true").catch(() => []);
      setApprovedCount((all as any[]).filter((s: any) => s.status === "cleared").length);
    } catch {
      // backend offline
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (id: string) => {
    try {
      await apiFetch(`/clearance/${id}/approve`, {
        method: "PUT",
        body: JSON.stringify({ cleared_by: user?.name }),
      });
      toast({ title: "Clearance Approved", description: "Student clearance step has been approved." });
      load();
    } catch (err: any) {
      toast({ title: "Failed", description: err.message, variant: "destructive" });
    }
  };

  const handleReject = async (id: string) => {
    try {
      await apiFetch(`/clearance/${id}/reject`, {
        method: "PUT",
        body: JSON.stringify({ note: "Rejected by " + user?.name }),
      });
      toast({ title: "Clearance Rejected", description: "Student clearance step has been rejected." });
      load();
    } catch (err: any) {
      toast({ title: "Failed", description: err.message, variant: "destructive" });
    }
  };

  const departments = [...new Set(steps.map((s) => s.department_name).filter(Boolean))];
  const filtered = steps.filter((s) => deptFilter === "all" || s.department_name === deptFilter);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-display text-foreground">Clearance Approvals</h1>
        <p className="text-muted-foreground mt-1">Review and approve student clearance requests</p>
      </div>

      {/* Department Filter */}
      <div className="flex items-center gap-3 mb-6">
        <Filter size={16} className="text-muted-foreground" />
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">All Departments</option>
          {departments.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-3">
            <Clock size={20} className="text-muted-foreground" />
            <div>
              <p className="text-2xl font-bold font-display text-foreground">{filtered.length}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-3">
            <CheckCircle size={20} className="text-success" />
            <div>
              <p className="text-2xl font-bold font-display text-foreground">{approvedCount}</p>
              <p className="text-sm text-muted-foreground">Approved</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-3">
            <XCircle size={20} className="text-destructive" />
            <div>
              <p className="text-2xl font-bold font-display text-foreground">—</p>
              <p className="text-sm text-muted-foreground">Rejected</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
              <Loader2 size={18} className="animate-spin mr-2" /> Loading...
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Student</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Index</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Program</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Department</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Stage</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Submitted</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground">{c.first_name} {c.last_name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.index_number}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.program_name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.department_name}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        c.department === "Dean of Postgraduate" ? "bg-secondary/20 text-secondary-foreground" : "bg-muted text-muted-foreground"
                      }`}>
                        {c.department}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(c.id)}
                          className="px-3 py-1.5 rounded-lg bg-success text-success-foreground text-xs font-medium hover:opacity-90 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(c.id)}
                          className="px-3 py-1.5 rounded-lg border border-destructive text-destructive text-xs font-medium hover:bg-destructive/10 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && !loading && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No pending clearance requests</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClearanceApprovals;
