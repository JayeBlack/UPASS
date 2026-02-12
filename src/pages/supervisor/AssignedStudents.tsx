import DashboardLayout from "@/components/DashboardLayout";
import { Users, FileText, Clock } from "lucide-react";

const students = [
  { name: "Kwame Mensah", index: "UMaT/PG/0234/22", program: "MSc. IT", stage: "Chapter 3", status: "On Track" },
  { name: "Ama Serwaa", index: "UMaT/PG/0198/22", program: "MSc. IT", stage: "Chapter 2", status: "On Track" },
  { name: "Yaw Boateng", index: "UMaT/PG/0312/22", program: "MPhil CS", stage: "Proposal", status: "Behind" },
  { name: "Efua Dankwah", index: "UMaT/PG/0287/22", program: "MSc. IT", stage: "Chapter 4", status: "On Track" },
  { name: "Kofi Adjei", index: "UMaT/PG/0345/22", program: "MPhil CS", stage: "Chapter 1", status: "Behind" },
];

const AssignedStudents = () => (
  <DashboardLayout>
    <div className="mb-8">
      <h1 className="text-3xl font-bold font-display text-foreground">Assigned Students</h1>
      <p className="text-muted-foreground mt-1">Students under your supervision</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
      <div className="bg-card rounded-xl border border-border p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg gradient-gold flex items-center justify-center">
          <Users size={18} className="text-secondary-foreground" />
        </div>
        <div>
          <p className="text-2xl font-bold font-display text-foreground">{students.length}</p>
          <p className="text-xs text-muted-foreground">Total Students</p>
        </div>
      </div>
      <div className="bg-card rounded-xl border border-border p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
          <FileText size={18} className="text-muted-foreground" />
        </div>
        <div>
          <p className="text-2xl font-bold font-display text-foreground">3</p>
          <p className="text-xs text-muted-foreground">Pending Reviews</p>
        </div>
      </div>
      <div className="bg-card rounded-xl border border-border p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
          <Clock size={18} className="text-muted-foreground" />
        </div>
        <div>
          <p className="text-2xl font-bold font-display text-foreground">2</p>
          <p className="text-xs text-muted-foreground">Behind Schedule</p>
        </div>
      </div>
    </div>

    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Student</th>
            <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Index</th>
            <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Program</th>
            <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Current Stage</th>
            <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.index} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-foreground">{s.name}</td>
              <td className="px-6 py-4 text-sm font-mono text-muted-foreground">{s.index}</td>
              <td className="px-6 py-4 text-sm text-muted-foreground">{s.program}</td>
              <td className="px-6 py-4 text-sm text-foreground">{s.stage}</td>
              <td className="px-6 py-4">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  s.status === "On Track" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                }`}>
                  {s.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </DashboardLayout>
);

export default AssignedStudents;
