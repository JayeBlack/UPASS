import DashboardLayout from "@/components/DashboardLayout";
import { CheckCircle, Clock, XCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/lib/api";

interface ClearanceStep {
  id: string;
  department: string;
  description: string;
  status: "cleared" | "pending" | "not_started";
  cleared_by?: string;
  cleared_at?: string;
  note?: string;
  step_order: number;
}

const statusConfig = {
  cleared: { icon: <CheckCircle size={18} />, label: "Cleared", className: "text-success bg-success/10" },
  pending: { icon: <Clock size={18} />, label: "Pending", className: "text-warning bg-warning/10" },
  not_started: { icon: <XCircle size={18} />, label: "Not Started", className: "text-muted-foreground bg-muted" },
};

const Clearance = () => {
  const { user } = useAuth();
  const [steps, setSteps] = useState<ClearanceStep[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const me = await apiFetch<any>("/students/me");
        if (!me?.id) { setLoading(false); return; }

        let data = await apiFetch<ClearanceStep[]>(`/clearance/student/${me.id}`);

        if (!data || data.length === 0) {
          await apiFetch(`/clearance/init/${me.id}`, { method: "POST" });
          data = await apiFetch<ClearanceStep[]>(`/clearance/student/${me.id}`);
        }

        setSteps(data || []);
      } catch {
        // backend offline
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.id]);

  const completedCount = steps.filter((s) => s.status === "cleared").length;
  const progress = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-foreground">Graduation Clearance</h1>
        <p className="text-muted-foreground mt-1">Complete all steps to receive your clearance certificate</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-muted-foreground text-sm">
          <Loader2 size={18} className="animate-spin mr-2" /> Loading clearance status...
        </div>
      ) : steps.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-16 text-center">
          <CheckCircle size={40} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No clearance steps found</h3>
          <p className="text-sm text-muted-foreground">Your clearance steps will appear here once initialised by the admin.</p>
        </div>
      ) : (
        <>
          {/* Progress bar */}
          <div className="bg-card rounded-xl border border-border p-5 mb-8">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-foreground">{completedCount} of {steps.length} steps completed</p>
              <p className="text-sm font-bold text-foreground">{progress}%</p>
            </div>
            <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full gradient-gold transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-3">
            {steps.map((step, i) => {
              const cfg = statusConfig[step.status] ?? statusConfig.not_started;
              return (
                <div key={step.id} className="bg-card rounded-xl border border-border p-4 sm:p-5">
                  <div className="flex items-start gap-4">
                    <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      step.status === "cleared" ? "gradient-gold text-secondary-foreground" : "bg-muted text-muted-foreground"
                    }`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{step.department}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full self-start ${cfg.className}`}>
                          {cfg.icon}
                          {cfg.label}
                        </span>
                      </div>
                      {step.cleared_by && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Cleared by <strong className="text-foreground">{step.cleared_by}</strong>
                          {step.cleared_at && ` on ${new Date(step.cleared_at).toLocaleDateString()}`}
                        </p>
                      )}
                      {step.note && (
                        <p className="text-xs text-warning mt-2 flex items-center gap-1">
                          <Clock size={12} /> {step.note}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default Clearance;
