import DashboardLayout from "@/components/DashboardLayout";
import { DollarSign, CheckCircle, AlertCircle, Clock } from "lucide-react";

const fees = [
  { semester: "Semester 1, 2025/2026", amount: "GHS 5,200.00", paid: "GHS 5,200.00", balance: "GHS 0.00", status: "Paid" },
  { semester: "Semester 2, 2024/2025", amount: "GHS 5,200.00", paid: "GHS 5,200.00", balance: "GHS 0.00", status: "Paid" },
  { semester: "Semester 1, 2024/2025", amount: "GHS 4,800.00", paid: "GHS 4,800.00", balance: "GHS 0.00", status: "Paid" },
  { semester: "Semester 2, 2023/2024", amount: "GHS 4,800.00", paid: "GHS 3,200.00", balance: "GHS 1,600.00", status: "Partial" },
];

const statusConfig: Record<string, { icon: React.ReactNode; className: string }> = {
  Paid: { icon: <CheckCircle size={14} />, className: "bg-success/10 text-success" },
  Partial: { icon: <AlertCircle size={14} />, className: "bg-warning/10 text-warning" },
  Pending: { icon: <Clock size={14} />, className: "bg-muted text-muted-foreground" },
};

const FinancialStatus = () => {
  const totalOwed = 1600;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-foreground">Financial Status</h1>
        <p className="text-muted-foreground mt-1">View your fees and payment history</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="w-10 h-10 rounded-lg gradient-gold flex items-center justify-center mb-3">
            <DollarSign size={18} className="text-secondary-foreground" />
          </div>
          <p className="text-2xl font-bold font-display text-foreground">GHS 20,000</p>
          <p className="text-sm text-muted-foreground mt-1">Total Fees</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center mb-3">
            <CheckCircle size={18} className="text-success" />
          </div>
          <p className="text-2xl font-bold font-display text-foreground">GHS 18,400</p>
          <p className="text-sm text-muted-foreground mt-1">Total Paid</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center mb-3">
            <AlertCircle size={18} className="text-destructive" />
          </div>
          <p className="text-2xl font-bold font-display text-foreground">GHS {totalOwed.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground mt-1">Outstanding Balance</p>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Semester</th>
              <th className="text-right px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Amount</th>
              <th className="text-right px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Paid</th>
              <th className="text-right px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Balance</th>
              <th className="text-center px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {fees.map((f) => {
              const cfg = statusConfig[f.status] || statusConfig.Pending;
              return (
                <tr key={f.semester} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{f.semester}</td>
                  <td className="px-6 py-4 text-sm text-right text-muted-foreground">{f.amount}</td>
                  <td className="px-6 py-4 text-sm text-right text-muted-foreground">{f.paid}</td>
                  <td className="px-6 py-4 text-sm text-right font-medium text-foreground">{f.balance}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.className}`}>
                      {cfg.icon}
                      {f.status}
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

export default FinancialStatus;
