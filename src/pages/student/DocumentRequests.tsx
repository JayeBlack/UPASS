import DashboardLayout from "@/components/DashboardLayout";
import { FileText, Clock, CheckCircle, Plus } from "lucide-react";
import { useState } from "react";

type DocType = "Recommendation Letter" | "Attestation Letter" | "Transcript (Certified)" | "Letter of Good Standing" | "Other";
type RequestStatus = "Pending" | "Processing" | "Ready";

interface DocRequest {
  id: string;
  type: DocType;
  purpose: string;
  date: string;
  status: RequestStatus;
}

const mockRequests: DocRequest[] = [
  { id: "REQ-001", type: "Recommendation Letter", purpose: "PhD Application – University of Cape Town", date: "2026-01-28", status: "Ready" },
  { id: "REQ-002", type: "Attestation Letter", purpose: "Employer verification", date: "2026-02-05", status: "Processing" },
  { id: "REQ-003", type: "Transcript (Certified)", purpose: "Scholarship application", date: "2026-02-10", status: "Pending" },
];

const statusConfig: Record<RequestStatus, { icon: React.ReactNode; className: string }> = {
  Pending: { icon: <Clock size={14} />, className: "bg-muted text-muted-foreground" },
  Processing: { icon: <Clock size={14} />, className: "bg-warning/10 text-warning" },
  Ready: { icon: <CheckCircle size={14} />, className: "bg-success/10 text-success" },
};

const docTypes: DocType[] = ["Recommendation Letter", "Attestation Letter", "Transcript (Certified)", "Letter of Good Standing", "Other"];

const DocumentRequests = () => {
  const [showForm, setShowForm] = useState(false);
  const [requests, setRequests] = useState<DocRequest[]>(mockRequests);
  const [formData, setFormData] = useState({ type: docTypes[0] as DocType, purpose: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq: DocRequest = {
      id: `REQ-${String(requests.length + 1).padStart(3, "0")}`,
      type: formData.type,
      purpose: formData.purpose,
      date: new Date().toISOString().split("T")[0],
      status: "Pending",
    };
    setRequests([newReq, ...requests]);
    setFormData({ type: docTypes[0], purpose: "" });
    setShowForm(false);
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">Document Requests</h1>
          <p className="text-muted-foreground mt-1">Request recommendation letters, attestation, and other academic documents</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg gradient-gold text-secondary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          New Request
        </button>
      </div>

      {/* New Request Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 mb-6 space-y-4">
          <h2 className="font-display font-bold text-foreground">New Document Request</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Document Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as DocType })}
                className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {docTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Purpose / Reason</label>
              <input
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                placeholder="e.g. PhD Application, Employer request"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 rounded-lg gradient-gold text-secondary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
              Submit Request
            </button>
          </div>
        </form>
      )}

      {/* Requests List */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">ID</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Document</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Purpose</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
              <th className="text-center px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => {
              const cfg = statusConfig[r.status];
              return (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono font-medium text-foreground">{r.id}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{r.type}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{r.purpose}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{r.date}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.className}`}>
                      {cfg.icon}
                      {r.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default DocumentRequests;
