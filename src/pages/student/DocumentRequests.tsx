import DashboardLayout from "@/components/DashboardLayout";
import { FileText, Clock, CheckCircle, Plus, GraduationCap, Printer, Download } from "lucide-react";
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

/* ── Transcript Data ── */
const semesters = [
  {
    label: "Semester 1, 2024/2025",
    courses: [
      { code: "CS 601", name: "Advanced Database Systems", credits: 3, grade: "A", marks: 82 },
      { code: "CS 603", name: "Research Methodology", credits: 3, grade: "B+", marks: 74 },
      { code: "CS 605", name: "Machine Learning", credits: 3, grade: "A-", marks: 78 },
    ],
    cwa: 78.0,
  },
  {
    label: "Semester 2, 2023/2024",
    courses: [
      { code: "CS 502", name: "Software Engineering", credits: 3, grade: "A", marks: 85 },
      { code: "CS 504", name: "Computer Networks", credits: 3, grade: "B+", marks: 73 },
      { code: "CS 506", name: "Operating Systems", credits: 3, grade: "A", marks: 84 },
    ],
    cwa: 80.7,
  },
  {
    label: "Semester 1, 2023/2024",
    courses: [
      { code: "CS 501", name: "Discrete Mathematics", credits: 3, grade: "B+", marks: 74 },
      { code: "CS 503", name: "Data Structures & Algorithms", credits: 3, grade: "A", marks: 83 },
      { code: "CS 505", name: "Statistics for Computing", credits: 3, grade: "A-", marks: 77 },
    ],
    cwa: 78.0,
  },
];
const overallCwa = (semesters.reduce((s, sem) => s + sem.cwa, 0) / semesters.length).toFixed(1);

const DocumentRequests = () => {
  const [activeTab, setActiveTab] = useState<"requests" | "transcript">("requests");
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-foreground">Documents</h1>
        <p className="text-muted-foreground mt-1">Request documents and view your academic transcript</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-muted rounded-lg p-1 w-fit">
        <button
          onClick={() => setActiveTab("requests")}
          className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "requests" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Document Requests
        </button>
        <button
          onClick={() => setActiveTab("transcript")}
          className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "transcript" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Transcript
        </button>
      </div>

      {activeTab === "requests" && (
        <>
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg gradient-gold text-secondary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
            >
              <Plus size={16} />
              New Request
            </button>
          </div>

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

          {/* Desktop table */}
          <div className="bg-card rounded-xl border border-border overflow-hidden hidden md:block">
            <div className="overflow-x-auto">
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
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {requests.map((r) => {
              const cfg = statusConfig[r.status];
              return (
                <div key={r.id} className="bg-card rounded-xl border border-border p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">{r.type}</p>
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.className}`}>
                      {cfg.icon}
                      {r.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{r.purpose}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-mono">{r.id}</span>
                    <span>{r.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {activeTab === "transcript" && (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="bg-card rounded-xl border border-border px-6 py-4 inline-flex items-center gap-3">
              <GraduationCap size={20} className="text-secondary" />
              <span className="text-sm text-muted-foreground">CWA:</span>
              <span className="text-2xl font-bold font-display text-foreground">{overallCwa}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                <Printer size={16} />
                Print
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg gradient-gold text-secondary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                <Download size={16} />
                Download PDF
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {semesters.map((sem) => (
              <div key={sem.label} className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                  <h2 className="font-display font-bold text-foreground">{sem.label}</h2>
                  <span className="text-sm text-muted-foreground">CWA: <span className="font-bold text-foreground">{sem.cwa.toFixed(1)}</span></span>
                </div>
                <table className="w-full hidden sm:table">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Code</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Course</th>
                      <th className="text-center px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Credits</th>
                      <th className="text-center px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Grade</th>
                      <th className="text-center px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Marks (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sem.courses.map((c) => (
                      <tr key={c.code} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-3 text-sm font-mono font-medium text-foreground">{c.code}</td>
                        <td className="px-6 py-3 text-sm text-foreground">{c.name}</td>
                        <td className="px-6 py-3 text-sm text-center text-muted-foreground">{c.credits}</td>
                        <td className="px-6 py-3 text-sm text-center font-semibold text-foreground">{c.grade}</td>
                        <td className="px-6 py-3 text-sm text-center text-muted-foreground">{c.marks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="sm:hidden divide-y divide-border">
                  {sem.courses.map((c) => (
                    <div key={c.code} className="px-4 py-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">{c.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{c.code} · {c.credits} credits</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-foreground">{c.grade}</p>
                        <p className="text-xs text-muted-foreground">{c.marks}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default DocumentRequests;
