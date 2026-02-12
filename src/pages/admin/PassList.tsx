import DashboardLayout from "@/components/DashboardLayout";
import { ListChecks, Download } from "lucide-react";

const graduands = [
  { name: "Akua Mensah", index: "UMaT/PG/0112/21", program: "MSc. IT", gpa: 3.85, status: "Eligible" },
  { name: "Kofi Darko", index: "UMaT/PG/0089/21", program: "MPhil CS", gpa: 3.92, status: "Eligible" },
  { name: "Esi Appiah", index: "UMaT/PG/0145/21", program: "MSc. Mining Eng", gpa: 3.67, status: "Eligible" },
  { name: "Yaw Frimpong", index: "UMaT/PG/0178/21", program: "MSc. IT", gpa: 2.89, status: "Ineligible" },
  { name: "Abena Kyei", index: "UMaT/PG/0201/21", program: "MPhil CS", gpa: 3.74, status: "Eligible" },
];

const PassList = () => (
  <DashboardLayout>
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold font-display text-foreground">Pass List</h1>
        <p className="text-muted-foreground mt-1">Graduands eligible for convocation</p>
      </div>
      <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg gradient-gold text-secondary-foreground font-medium text-sm hover:opacity-90 transition-opacity">
        <Download size={14} />
        Export PDF
      </button>
    </div>

    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name</th>
            <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Index</th>
            <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Program</th>
            <th className="text-center px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">GPA</th>
            <th className="text-center px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Eligibility</th>
          </tr>
        </thead>
        <tbody>
          {graduands.map((g) => (
            <tr key={g.index} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-foreground">{g.name}</td>
              <td className="px-6 py-4 text-sm font-mono text-muted-foreground">{g.index}</td>
              <td className="px-6 py-4 text-sm text-muted-foreground">{g.program}</td>
              <td className="px-6 py-4 text-sm text-center font-semibold text-foreground">{g.gpa}</td>
              <td className="px-6 py-4 text-center">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  g.status === "Eligible" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                }`}>
                  {g.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </DashboardLayout>
);

export default PassList;
