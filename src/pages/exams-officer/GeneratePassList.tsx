import DashboardLayout from "@/components/DashboardLayout";
import { Download } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import umatLogo from "@/assets/umat-logo.png";

interface Graduand {
  name: string;
  index: string;
  program: string;
  department: string;
  cwa: number;
  year: string;
  status: string;
}

const graduands: Graduand[] = [
  { name: "Akua Mensah", index: "UMaT/PG/0112/21", program: "MSc. IT", department: "Computer Science", cwa: 72.5, year: "2025", status: "Pass" },
  { name: "Kofi Darko", index: "UMaT/PG/0089/21", program: "MPhil CS", department: "Computer Science", cwa: 78.4, year: "2025", status: "Pass" },
  { name: "Esi Appiah", index: "UMaT/PG/0145/21", program: "MSc. Mining Eng", department: "Mining Engineering", cwa: 68.3, year: "2025", status: "Pass" },
  { name: "Yaw Frimpong", index: "UMaT/PG/0178/21", program: "MSc. IT", department: "Computer Science", cwa: 48.9, year: "2025", status: "Fail" },
  { name: "Abena Kyei", index: "UMaT/PG/0201/21", program: "MPhil CS", department: "Computer Science", cwa: 74.1, year: "2025", status: "Pass" },
  { name: "Nana Agyei", index: "UMaT/PG/0420/23", program: "MSc. Mechanical Eng", department: "Mechanical Engineering", cwa: 71.2, year: "2024", status: "Pass" },
  { name: "Ama Boateng", index: "UMaT/PG/0333/22", program: "MSc. Electrical Eng", department: "Electrical Engineering", cwa: 65.8, year: "2024", status: "Pass" },
];

const departments = [...new Set(graduands.map((g) => g.department))];
const programs = [...new Set(graduands.map((g) => g.program))];
const years = [...new Set(graduands.map((g) => g.year))].sort().reverse();

const GeneratePassList = () => {
  const [deptFilter, setDeptFilter] = useState("all");
  const [progFilter, setProgFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const { toast } = useToast();

  const filtered = graduands.filter((g) => {
    return (deptFilter === "all" || g.department === deptFilter) &&
      (progFilter === "all" || g.program === progFilter) &&
      (yearFilter === "all" || g.year === yearFilter);
  });

  const handleExportPDF = async () => {
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");
    const doc = new jsPDF();

    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = umatLogo;
      await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject; });
      doc.addImage(img, "PNG", 80, 8, 25, 25);
    } catch { /* continue */ }

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("University of Mines and Technology", 105, 40, { align: "center" });
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("School of Postgraduate Studies — Examinations Office", 105, 47, { align: "center" });
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Pass List", 105, 56, { align: "center" });

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const filterParts = [
      yearFilter !== "all" ? `Year: ${yearFilter}` : "All Years",
      deptFilter !== "all" ? `Dept: ${deptFilter}` : "All Depts",
      progFilter !== "all" ? `Programme: ${progFilter}` : "All Programmes",
    ];
    doc.text(filterParts.join(" | "), 105, 63, { align: "center" });

    autoTable(doc, {
      startY: 70,
      head: [["#", "Name", "Index Number", "Programme", "Department", "CWA", "Status"]],
      body: filtered.map((g, i) => [i + 1, g.name, g.index, g.program, g.department, g.cwa.toFixed(1), g.status]),
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

    doc.save(`UMaT_Pass_List_ExamsOffice.pdf`);
    toast({ title: "PDF exported", description: "Pass list downloaded" });
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">Generate Pass List</h1>
          <p className="text-muted-foreground mt-1">Filter by department, programme, and academic year</p>
        </div>
        <button onClick={handleExportPDF} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg gradient-gold text-secondary-foreground font-medium text-sm hover:opacity-90 transition-opacity">
          <Download size={14} /> Export PDF
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} className="px-4 py-3 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="all">All Years</option>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="px-4 py-3 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="all">All Departments</option>
          {departments.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={progFilter} onChange={(e) => setProgFilter(e.target.value)} className="px-4 py-3 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="all">All Programmes</option>
          {programs.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      <p className="text-sm text-muted-foreground mb-4">Showing {filtered.length} of {graduands.length} students</p>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Index</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Programme</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Department</th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">CWA</th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((g) => (
                <tr key={g.index} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{g.name}</td>
                  <td className="px-6 py-4 text-sm font-mono text-muted-foreground">{g.index}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{g.program}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{g.department}</td>
                  <td className="px-6 py-4 text-sm text-center font-semibold text-foreground">{g.cwa.toFixed(1)}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${g.status === "Pass" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                      {g.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-muted-foreground">No results match the selected filters</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GeneratePassList;
