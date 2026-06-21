import DashboardLayout from "@/components/DashboardLayout";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAdminDepartment } from "@/hooks/use-admin-department";
import { useDataStore } from "@/contexts/DataStoreContext";
import ExportDropdown from "@/components/ExportDropdown";
import { exportData } from "@/lib/exportUtils";

const PassList = () => {
  const { graduands } = useDataStore();
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [progFilter, setProgFilter] = useState<string>("all");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const { isSuperAdmin, adminDepartment } = useAdminDepartment();

  const departments = [...new Set(graduands.map((g) => g.department))];
  const programs = [...new Set(graduands.map((g) => g.program))];
  const years = [...new Set(graduands.map((g) => g.year))].sort().reverse();

  const filtered = graduands.filter((g) => {
    const effectiveDept = isSuperAdmin ? deptFilter : (adminDepartment || "all");
    const matchesDept = effectiveDept === "all" || g.department === effectiveDept;
    const matchesProg = progFilter === "all" || g.program === progFilter;
    const matchesYear = yearFilter === "all" || g.year === yearFilter;
    const matchesStatus = statusFilter === "all" || g.status === statusFilter;
    return matchesDept && matchesProg && matchesYear && matchesStatus;
  });

  // Pagination
  const itemsPerPage = 50;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedGraduands = filtered.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useState(() => {
    setCurrentPage(1);
  }, [deptFilter, progFilter, yearFilter, statusFilter]);

  const handleExport = (format: "csv" | "pdf") => {
    const headers = ["Name", "Index Number", "Programme", "Department", "CWA", "Eligibility"];
    const rows = filtered.map((g) => [g.name, g.index, g.program, g.department, g.cwa.toFixed(1), g.status]);
    const suffix = `${yearFilter !== "all" ? `_${yearFilter}` : ""}${deptFilter !== "all" ? `_${deptFilter.replace(/\s+/g, "_")}` : ""}`;
    exportData({
      title: "Pass List",
      subtitle: `Academic Year: ${yearFilter !== "all" ? yearFilter : "All Years"}`,
      headers,
      rows,
      fileName: `UMaT_Pass_List${suffix}`,
      format,
    });
    toast({ title: `${format.toUpperCase()} exported`, description: "Pass list has been downloaded" });
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">Pass List</h1>
          <p className="text-muted-foreground mt-1">
            {isSuperAdmin ? "Graduands eligible for convocation" : `${adminDepartment} — Graduands eligible for convocation`}
          </p>
        </div>
        <ExportDropdown onExport={handleExport} />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} className="px-4 py-3 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="all">All Years</option>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        {isSuperAdmin && (
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="px-4 py-3 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="all">All Departments</option>
            {departments.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        )}
        <select value={progFilter} onChange={(e) => setProgFilter(e.target.value)} className="px-4 py-3 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="all">All Programmes</option>
          {programs.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-3 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="all">All Status</option>
          <option value="Eligible">Eligible</option>
          <option value="Ineligible">Ineligible</option>
        </select>
      </div>

      <p className="text-sm text-muted-foreground mb-4">Showing {paginatedGraduands.length} of {filtered.length} graduands {filtered.length !== graduands.length ? `(filtered from ${graduands.length} total)` : ""}</p>

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
                <th className="text-center px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Eligibility</th>
              </tr>
            </thead>
            <tbody>
              {paginatedGraduands.map((g) => (
                <tr key={g.index} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{g.name}</td>
                  <td className="px-6 py-4 text-sm font-mono text-muted-foreground">{g.index}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{g.program}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{g.department}</td>
                  <td className="px-6 py-4 text-sm text-center font-semibold text-foreground">{g.cwa.toFixed(1)}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${g.status === "Eligible" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>{g.status}</span>
                  </td>
                </tr>
              ))}
              {paginatedGraduands.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-muted-foreground">No graduands match the selected filters</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 px-2">
          <div className="text-sm text-muted-foreground">
            Showing page {currentPage} of {totalPages} ({filtered.length.toLocaleString()} graduands)
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex items-center gap-1">
              {(() => {
                const pages: (number | string)[] = [];
                const showPages = 5;
                
                if (totalPages <= showPages + 2) {
                  for (let i = 1; i <= totalPages; i++) pages.push(i);
                } else {
                  if (currentPage <= 3) {
                    for (let i = 1; i <= showPages; i++) pages.push(i);
                    pages.push('...');
                    pages.push(totalPages);
                  } else if (currentPage >= totalPages - 2) {
                    pages.push(1);
                    pages.push('...');
                    for (let i = totalPages - showPages + 1; i <= totalPages; i++) pages.push(i);
                  } else {
                    pages.push(1);
                    pages.push('...');
                    for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                    pages.push('...');
                    pages.push(totalPages);
                  }
                }
                
                return pages.map((page, idx) => 
                  typeof page === 'number' ? (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`min-w-[40px] h-[40px] rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? 'gradient-gold text-secondary-foreground'
                          : 'border border-border text-foreground hover:bg-muted'
                      }`}
                    >
                      {page}
                    </button>
                  ) : (
                    <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground">...</span>
                  )
                );
              })()}
            </div>
            
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Last
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default PassList;
