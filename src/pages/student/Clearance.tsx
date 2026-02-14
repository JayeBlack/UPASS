import DashboardLayout from "@/components/DashboardLayout";
import { CheckCircle, Clock, XCircle, ChevronRight } from "lucide-react";

interface ClearanceStep {
  id: string;
  department: string;
  description: string;
  status: "cleared" | "pending" | "not_started";
  clearedBy?: string;
  clearedDate?: string;
  note?: string;
}

const mockSteps: ClearanceStep[] = [
  { id: "1", department: "School Fees", description: "All outstanding fees must be settled", status: "cleared", clearedBy: "Finance Office", clearedDate: "2026-01-10" },
  { id: "2", department: "Library", description: "Return all borrowed books and clear fines", status: "cleared", clearedBy: "Mrs. Akua Boateng", clearedDate: "2026-01-12" },
  { id: "3", department: "Department", description: "Academic clearance from your department", status: "pending", note: "Awaiting HOD signature" },
  { id: "4", department: "Thesis Submission", description: "Final bound thesis submitted to the school", status: "pending" },
  { id: "5", department: "ICT Directorate", description: "Return all university-issued devices", status: "not_started" },
  { id: "6", department: "Dean of Postgraduate", description: "Final approval from the Dean", status: "not_started" },
];

const statusConfig = {
  cleared: { icon: <CheckCircle size={18} />, label: "Cleared", className: "text-success bg-success/10" },
  pending: { icon: <Clock size={18} />, label: "Pending", className: "text-warning bg-warning/10" },
  not_started: { icon: <XCircle size={18} />, label: "Not Started", className: "text-muted-foreground bg-muted" },
};

const Clearance = () => {
  const completedCount = mockSteps.filter((s) => s.status === "cleared").length;
  const progress = Math.round((completedCount / mockSteps.length) * 100);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-foreground">Graduation Clearance</h1>
        <p className="text-muted-foreground mt-1">Complete all steps to receive your clearance certificate</p>
      </div>

      {/* Progress bar */}
      <div className="bg-card rounded-xl border border-border p-5 mb-8">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-foreground">{completedCount} of {mockSteps.length} steps completed</p>
          <p className="text-sm font-bold text-foreground">{progress}%</p>
        </div>
        <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full gradient-gold transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {mockSteps.map((step, i) => {
          const cfg = statusConfig[step.status];
          return (
            <div key={step.id} className="bg-card rounded-xl border border-border p-4 sm:p-5">
              <div className="flex items-start gap-4">
                {/* Step number */}
                <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                  step.status === "cleared"
                    ? "gradient-gold text-secondary-foreground"
                    : "bg-muted text-muted-foreground"
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

                  {step.clearedBy && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Cleared by <strong className="text-foreground">{step.clearedBy}</strong> on {step.clearedDate}
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
    </DashboardLayout>
  );
};

export default Clearance;
