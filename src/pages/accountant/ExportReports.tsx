import DashboardLayout from "@/components/DashboardLayout";
import { Download, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const reports = [
  { id: 1, name: "Fee Collection Summary", description: "Total fees collected by program and semester", period: "2023/2024" },
  { id: 2, name: "Outstanding Balances Report", description: "Students with unpaid fees and amounts owed", period: "2023/2024" },
  { id: 3, name: "Payment Compliance Report", description: "Compliance rates across all programs", period: "2023/2024" },
  { id: 4, name: "Revenue Trend Report", description: "Monthly revenue collection trends", period: "2023/2024" },
  { id: 5, name: "Defaulters List", description: "Complete list of students with outstanding fees", period: "2023/2024" },
];

const ExportReports = () => {
  const { toast } = useToast();

  const handleExport = (name: string) => {
    toast({
      title: "Report Exported",
      description: `${name} has been downloaded as PDF.`,
    });
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-display text-foreground">Export Financial Reports</h1>
        <p className="text-muted-foreground mt-1">Generate and download financial reports</p>
      </div>

      <div className="space-y-4">
        {reports.map((r) => (
          <div key={r.id} className="bg-card rounded-xl border border-border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-10 h-10 shrink-0 rounded-lg bg-muted flex items-center justify-center">
                <FileText size={20} className="text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">{r.name}</h3>
                <p className="text-sm text-muted-foreground">{r.description}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Academic Year: {r.period}</p>
              </div>
            </div>
            <button
              onClick={() => handleExport(r.name)}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg gradient-gold text-secondary-foreground text-sm font-medium hover:opacity-90 transition-opacity w-full sm:w-auto shrink-0"
            >
              <Download size={16} />
              Export PDF
            </button>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default ExportReports;
