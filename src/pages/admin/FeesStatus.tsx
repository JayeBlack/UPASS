import DashboardLayout from "@/components/DashboardLayout";
import { DollarSign, CheckCircle, XCircle } from "lucide-react";

const feeRecords = [
  { name: "Kwame Mensah", index: "UMaT/PG/0234/22", amount: "GH₵ 5,200", cleared: true },
  { name: "Ama Serwaa", index: "UMaT/PG/0198/22", amount: "GH₵ 5,200", cleared: true },
  { name: "Yaw Boateng", index: "UMaT/PG/0312/22", amount: "GH₵ 5,200", cleared: false },
  { name: "Efua Dankwah", index: "UMaT/PG/0287/22", amount: "GH₵ 5,200", cleared: true },
  { name: "Kofi Adjei", index: "UMaT/PG/0345/22", amount: "GH₵ 5,200", cleared: false },
  { name: "Abena Owusu", index: "UMaT/PG/0401/23", amount: "GH₵ 6,000", cleared: true },
];

const FeesStatus = () => {
  const cleared = feeRecords.filter((f) => f.cleared).length;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-foreground">Fees Status</h1>
        <p className="text-muted-foreground mt-1">Financial clearance for postgraduate students</p>
      </div>

      <div className="flex gap-5 mb-6">
        <div className="bg-card rounded-xl border border-border px-5 py-4 flex items-center gap-3">
          <CheckCircle size={20} className="text-success" />
          <div>
            <p className="text-xl font-bold font-display text-foreground">{cleared}</p>
            <p className="text-xs text-muted-foreground">Cleared</p>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border px-5 py-4 flex items-center gap-3">
          <XCircle size={20} className="text-destructive" />
          <div>
            <p className="text-xl font-bold font-display text-foreground">{feeRecords.length - cleared}</p>
            <p className="text-xs text-muted-foreground">Outstanding</p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Student</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Index</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Amount</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="text-right px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {feeRecords.map((f) => (
              <tr key={f.index} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-foreground">{f.name}</td>
                <td className="px-6 py-4 text-sm font-mono text-muted-foreground">{f.index}</td>
                <td className="px-6 py-4 text-sm text-foreground">{f.amount}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    f.cleared ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                  }`}>
                    {f.cleared ? "Cleared" : "Outstanding"}
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
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default FeesStatus;
