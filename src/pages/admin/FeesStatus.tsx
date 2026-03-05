import DashboardLayout from "@/components/DashboardLayout";
import { CheckCircle, XCircle, Search, Filter } from "lucide-react";
import { useState } from "react";

interface FeeRecord {
  name: string;
  index: string;
  department: string;
  totalFees: number;
  amountPaid: number;
  outstanding: number;
  cleared: boolean;
}

const feeRecords: FeeRecord[] = [
  { name: "Kwame Mensah", index: "UMaT/PG/0234/22", department: "Computer Science", totalFees: 5200, amountPaid: 5200, outstanding: 0, cleared: true },
  { name: "Ama Serwaa", index: "UMaT/PG/0198/22", department: "Computer Science", totalFees: 5200, amountPaid: 5200, outstanding: 0, cleared: true },
  { name: "Yaw Boateng", index: "UMaT/PG/0312/22", department: "Computer Science", totalFees: 5200, amountPaid: 3400, outstanding: 1800, cleared: false },
  { name: "Efua Dankwah", index: "UMaT/PG/0287/22", department: "Computer Science", totalFees: 5200, amountPaid: 5200, outstanding: 0, cleared: true },
  { name: "Kofi Adjei", index: "UMaT/PG/0345/22", department: "Computer Science", totalFees: 5200, amountPaid: 2600, outstanding: 2600, cleared: false },
  { name: "Abena Owusu", index: "UMaT/PG/0401/23", department: "Mining Engineering", totalFees: 6000, amountPaid: 6000, outstanding: 0, cleared: true },
  { name: "Yaw Frimpong", index: "UMaT/PG/0178/21", department: "Mining Engineering", totalFees: 6000, amountPaid: 4500, outstanding: 1500, cleared: false },
  { name: "Esi Appiah", index: "UMaT/PG/0145/21", department: "Electrical Engineering", totalFees: 5500, amountPaid: 5500, outstanding: 0, cleared: true },
  { name: "Akua Mensah", index: "UMaT/PG/0112/21", department: "Electrical Engineering", totalFees: 5500, amountPaid: 3000, outstanding: 2500, cleared: false },
  { name: "Nana Agyei", index: "UMaT/PG/0420/23", department: "Mechanical Engineering", totalFees: 5800, amountPaid: 5800, outstanding: 0, cleared: true },
];

const departments = [...new Set(feeRecords.map((f) => f.department))];

const FeesStatus = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "cleared" | "owing">("all");
  const [deptFilter, setDeptFilter] = useState<string>("all");

  const filtered = feeRecords.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) || f.index.includes(search);
    const matchesStatus = statusFilter === "all" || (statusFilter === "cleared" ? f.cleared : !f.cleared);
    const matchesDept = deptFilter === "all" || f.department === deptFilter;
    return matchesSearch && matchesStatus && matchesDept;
  });

  const totalCleared = feeRecords.filter((f) => f.cleared).length;
  const totalOwing = feeRecords.filter((f) => !f.cleared).length;
  const totalOutstanding = feeRecords.reduce((s, f) => s + f.outstanding, 0);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-foreground">Fees Status</h1>
        <p className="text-muted-foreground mt-1">Financial clearance for postgraduate students</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        <div className="bg-card rounded-xl border border-border px-5 py-4 flex items-center gap-3">
          <CheckCircle size={20} className="text-success" />
          <div>
            <p className="text-xl font-bold font-display text-foreground">{totalCleared}</p>
            <p className="text-xs text-muted-foreground">Cleared</p>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border px-5 py-4 flex items-center gap-3">
          <XCircle size={20} className="text-destructive" />
          <div>
            <p className="text-xl font-bold font-display text-foreground">{totalOwing}</p>
            <p className="text-xs text-muted-foreground">Outstanding</p>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border px-5 py-4 flex items-center gap-3">
          <Filter size={20} className="text-warning" />
          <div>
            <p className="text-xl font-bold font-display text-foreground">GH₵ {totalOutstanding.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Owed</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or index..."
            className="w-full pl-11 pr-4 py-3 rounded-lg border border-input bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "all" | "cleared" | "owing")}
          className="px-4 py-3 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">All Statuses</option>
          <option value="cleared">Cleared Only</option>
          <option value="owing">Owing Only</option>
        </select>
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="px-4 py-3 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">All Departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-4">Showing {filtered.length} of {feeRecords.length} students</p>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Student</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Index</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Department</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Fees</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Paid</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Outstanding</th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => (
                <tr key={f.index} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{f.name}</td>
                  <td className="px-6 py-4 text-sm font-mono text-muted-foreground">{f.index}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{f.department}</td>
                  <td className="px-6 py-4 text-sm text-right text-muted-foreground">GH₵ {f.totalFees.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-right text-muted-foreground">GH₵ {f.amountPaid.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-right font-semibold text-foreground">
                    {f.outstanding > 0 ? (
                      <span className="text-destructive">GH₵ {f.outstanding.toLocaleString()}</span>
                    ) : (
                      <span className="text-success">GH₵ 0</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      f.cleared ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                    }`}>
                      {f.cleared ? "Cleared" : "Owing"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      f.cleared
                        ? "border border-border text-muted-foreground"
                        : "gradient-gold text-secondary-foreground hover:opacity-90"
                    }`}>
                      {f.cleared ? "Revoke" : "Clear"}
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-sm text-muted-foreground">
                    No students match the selected filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FeesStatus;
