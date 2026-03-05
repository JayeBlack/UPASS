import DashboardLayout from "@/components/DashboardLayout";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const pendingClearances = [
  { id: 1, name: "Kwame Mensah", index: "UMaT/PG/0234/22", program: "MSc. Information Technology", stage: "Library", submitted: "2024-01-10" },
  { id: 2, name: "Esi Appiah", index: "UMaT/PG/0198/22", program: "MSc. Mining Engineering", stage: "Department", submitted: "2024-01-08" },
  { id: 3, name: "Yaw Boateng", index: "UMaT/PG/0301/22", program: "MSc. Environmental Science", stage: "Finance", submitted: "2024-01-12" },
  { id: 4, name: "Akua Sarpong", index: "UMaT/PG/0156/22", program: "MSc. Geological Engineering", stage: "Dean's Office", submitted: "2024-01-15" },
  { id: 5, name: "Kofi Adjei", index: "UMaT/PG/0277/22", program: "MSc. Computer Science", stage: "Dean's Office", submitted: "2024-01-14" },
];

const ClearanceApprovals = () => {
  const { toast } = useToast();
  const [clearances, setClearances] = useState(pendingClearances);

  const handleAction = (id: number, action: "approve" | "reject") => {
    setClearances((prev) => prev.filter((c) => c.id !== id));
    toast({
      title: action === "approve" ? "Clearance Approved" : "Clearance Rejected",
      description: `Student clearance has been ${action === "approve" ? "approved" : "rejected"}.`,
    });
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-display text-foreground">Clearance Approvals</h1>
        <p className="text-muted-foreground mt-1">Review and approve student clearance requests</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-3">
            <Clock size={20} className="text-muted-foreground" />
            <div>
              <p className="text-2xl font-bold font-display text-foreground">{clearances.length}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-3">
            <CheckCircle size={20} className="text-green-600" />
            <div>
              <p className="text-2xl font-bold font-display text-foreground">42</p>
              <p className="text-sm text-muted-foreground">Approved This Term</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-3">
            <XCircle size={20} className="text-destructive" />
            <div>
              <p className="text-2xl font-bold font-display text-foreground">3</p>
              <p className="text-sm text-muted-foreground">Rejected</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Student</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Index</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Program</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Stage</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Submitted</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clearances.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-foreground">{c.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.index}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.program}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      c.stage === "Dean's Office" ? "bg-secondary/20 text-secondary-foreground" : "bg-muted text-muted-foreground"
                    }`}>
                      {c.stage}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{c.submitted}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAction(c.id, "approve")}
                        className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(c.id, "reject")}
                        className="px-3 py-1.5 rounded-lg border border-destructive text-destructive text-xs font-medium hover:bg-destructive/10 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {clearances.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No pending clearance requests</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClearanceApprovals;
