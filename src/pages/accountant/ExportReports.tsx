import DashboardLayout from "@/components/DashboardLayout";
import { Download, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import umatLogo from "@/assets/umat-logo.png";

const reports = [
  { id: 1, name: "Fee Collection Summary", description: "Total fees collected by program and semester", period: "2023/2024" },
  { id: 2, name: "Outstanding Balances Report", description: "Students with unpaid fees and amounts owed", period: "2023/2024" },
  { id: 3, name: "Payment Compliance Report", description: "Compliance rates across all programs", period: "2023/2024" },
  { id: 4, name: "Revenue Trend Report", description: "Monthly revenue collection trends", period: "2023/2024" },
  { id: 5, name: "Defaulters List", description: "Complete list of students with outstanding fees", period: "2023/2024" },
];

const reportData: Record<number, { head: string[][]; body: string[][] }> = {
  1: {
    head: [["#", "Program", "Semester", "Students", "Amount Collected (GHS)"]],
    body: [
      ["1", "MSc. IT", "First", "45", "675,000.00"],
      ["2", "MSc. IT", "Second", "42", "630,000.00"],
      ["3", "MPhil CS", "First", "30", "525,000.00"],
      ["4", "MPhil CS", "Second", "28", "490,000.00"],
      ["5", "MSc. Mining Eng", "First", "38", "608,000.00"],
      ["6", "MSc. Mining Eng", "Second", "35", "560,000.00"],
    ],
  },
  2: {
    head: [["#", "Student Name", "Index Number", "Program", "Outstanding (GHS)"]],
    body: [
      ["1", "Yaw Frimpong", "UMaT/PG/0178/21", "MSc. IT", "7,500.00"],
      ["2", "Kwesi Mensah", "UMaT/PG/0210/22", "MPhil CS", "12,000.00"],
      ["3", "Ama Serwaa", "UMaT/PG/0315/22", "MSc. Mining Eng", "5,200.00"],
      ["4", "Kofi Adjei", "UMaT/PG/0198/21", "MSc. IT", "9,800.00"],
      ["5", "Efua Donkor", "UMaT/PG/0267/22", "MPhil CS", "3,500.00"],
    ],
  },
  3: {
    head: [["#", "Program", "Total Students", "Paid", "Partial", "Unpaid", "Compliance (%)"]],
    body: [
      ["1", "MSc. IT", "45", "38", "4", "3", "84.4"],
      ["2", "MPhil CS", "30", "27", "2", "1", "90.0"],
      ["3", "MSc. Mining Eng", "38", "33", "3", "2", "86.8"],
      ["4", "MSc. Mechanical Eng", "25", "20", "3", "2", "80.0"],
      ["5", "MSc. Electrical Eng", "28", "24", "2", "2", "85.7"],
    ],
  },
  4: {
    head: [["#", "Month", "Collections (GHS)", "Cumulative (GHS)"]],
    body: [
      ["1", "September 2023", "450,000.00", "450,000.00"],
      ["2", "October 2023", "380,000.00", "830,000.00"],
      ["3", "November 2023", "290,000.00", "1,120,000.00"],
      ["4", "December 2023", "150,000.00", "1,270,000.00"],
      ["5", "January 2024", "520,000.00", "1,790,000.00"],
      ["6", "February 2024", "310,000.00", "2,100,000.00"],
    ],
  },
  5: {
    head: [["#", "Student Name", "Index Number", "Program", "Amount Owed (GHS)", "Last Payment"]],
    body: [
      ["1", "Yaw Frimpong", "UMaT/PG/0178/21", "MSc. IT", "7,500.00", "15/09/2023"],
      ["2", "Kwesi Mensah", "UMaT/PG/0210/22", "MPhil CS", "12,000.00", "20/10/2023"],
      ["3", "Ama Serwaa", "UMaT/PG/0315/22", "MSc. Mining Eng", "5,200.00", "05/11/2023"],
      ["4", "Kofi Adjei", "UMaT/PG/0198/21", "MSc. IT", "9,800.00", "N/A"],
      ["5", "Efua Donkor", "UMaT/PG/0267/22", "MPhil CS", "3,500.00", "12/01/2024"],
    ],
  },
};

const ExportReports = () => {
  const { toast } = useToast();

  const handleExport = async (report: typeof reports[0]) => {
    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: autoTable } = await import("jspdf-autotable");

      const doc = new jsPDF();
      const data = reportData[report.id];

      // Logo
      try {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = umatLogo;
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
        doc.addImage(img, "PNG", 80, 8, 25, 25);
      } catch {
        // continue without logo
      }

      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("University of Mines and Technology", 105, 40, { align: "center" });
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text("School of Postgraduate Studies", 105, 47, { align: "center" });
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text(report.name, 105, 56, { align: "center" });
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(`Academic Year: ${report.period}`, 105, 63, { align: "center" });

      autoTable(doc, {
        startY: 70,
        head: data.head,
        body: data.body,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [34, 87, 50], textColor: 255 },
      });

      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");
        doc.text(`Generated on ${new Date().toLocaleDateString("en-GB")} | Page ${i} of ${pageCount}`, 105, 290, { align: "center" });
      }

      doc.save(`UMaT_${report.name.replace(/\s+/g, "_")}_${report.period.replace("/", "-")}.pdf`);
      toast({ title: "Report Exported", description: `${report.name} has been downloaded as PDF.` });
    } catch {
      toast({ title: "Export Failed", description: "Could not generate the PDF. Please try again.", variant: "destructive" });
    }
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
              onClick={() => handleExport(r)}
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
