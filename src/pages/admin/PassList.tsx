import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAdminDepartment } from "@/hooks/use-admin-department";
import ExportDropdown from "@/components/ExportDropdown";
import { exportData } from "@/lib/exportUtils";
import { apiFetch } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// v2
const PassList = () => {
  const { user } = useAuth();
  const [graduands, setGraduands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [progFilter, setProgFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [minCwa, setMinCwa] = useState("50");
  const currentYear = new Date().getFullYear();
  const defaultYear = `${currentYear}/${currentYear + 1}`;
  const yearOptions = Array.from({ length: 6 }, (_, i) => { const y = currentYear - 2 + i; return `${y}/${y + 1}`; });
  const [academicYear, setAcademicYear] = useState(defaultYear);
  const { toast } = useToast();
  const { isSuperAdmin, adminDepartment } = useAdminDepartment();

  const canGenerate = user?.isSuperAdmin || user?.role === "Admin" || user?.role === "Dean" || user?.role === "ViceDean";

  useEffect(() => {
    const fetchGraduands = async () => {
      setLoading(true);
      try {
        const data = await apiFetch<any[]>("/passlist");
        setGraduands(data || []);
      } catch {}
      finally { setLoading(false); }
    };
    fetchGraduands();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await apiFetch<{ message: string; data: any }>("/passlist/generate", {
        method: "POST",
        body: JSON.stringify({ academic_year: academicYear, min_cwa: Number(minCwa) }),
      });
      toast({ 
        title: "Pass list generated", 
        description: res.message || `${res.data?.total || 0} graduands processed`
      });
      // Refresh local state and sync year filter
      const data = await apiFetch<any[]>("/passlist");
      setGraduands(data || []);
    } catch (err: any) {
      toast({ title: "Failed", description: err.message, variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const departments = [...new Set(graduands.map((g) => g.department_name).filter(Boolean))];
  const programs = [...new Set(graduands.map((g) => g.program_name).filter(Boolean))];
  const years = [...new Set(graduands.map((g: any) => g.academic_year).filter(Boolean))].sort().reverse();

  const filtered = graduands.filter((g) => {
    const effectiveDept = isSuperAdmin ? deptFilter : (adminDepartment || "all");
    const matchesDept = effectiveDept === "all" || g.department_name === effectiveDept;
    const matchesProg = progFilter === "all" || g.program_name === progFilter;
    const matchesYear = yearFilter === "all" || g.academic_year === yearFilter;
    const matchesStatus = statusFilter === "all" || g.status === statusFilter;
    return matchesDept && matchesProg && matchesYear && matchesStatus;
  });

  // Pagination
  const itemsPerPage = 50;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedGraduands = filtered.slice(startIndex, endIndex);

  useEffect(() => { setCurrentPage(1); }, [deptFilter, progFilter, yearFilter, statusFilter]);

  const handleExport = (format: "csv" | "pdf") => {
    const headers = ["Name", "Index Number", "Programme", "Department", "CWA", "Eligibility"];
    const rows = filtered.map((g) => [
      `${g.first_name} ${g.last_name}`, 
      g.index_number, 
      g.program_name, 
      g.department_name, 
      Number(g.cwa).toFixed(2), 
      g.status
    ]);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">Pass List</h1>
          <p className="text-muted-foreground mt-1">
            {isSuperAdmin ? "Graduands eligible for convocation" : `${adminDepartment} — Graduands eligible for convocation`}
          </p>
        </div>
        <ExportDropdown onExport={handleExport} />
      </div>

      {/* Generate panel for Admin/Dean/ViceDean */}
      {canGenerate && (
        <div className="bg-card rounded-xl border border-border p-5 mb-6 flex flex-col sm:flex-row sm:items-end gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Academic Year</label>
            <select
              value={academicYear}
              onChange={(e) => { setAcademicYear(e.target.value); setYearFilter(e.target.value); setCurrentPage(1); }}
              className="px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring w-36"
            >
              {yearOptions.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Min CWA</label>
            <input
              type="number" min={0} max={100} value={minCwa}
              onChange={(e) => setMinCwa(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring w-24"
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg gradient-gold text-secondary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {generating && <Loader2 size={14} className="animate-spin" />}
            Generate Pass List
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} className="px-4 py-3 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="all">All Years</option>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={progFilter} onChange={(e) => setProgFilter(e.target.value)} className="px-4 py-3 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="all">All Programmes</option>
          {programs.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        {isSuperAdmin && (
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="px-4 py-3 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="all">All Departments</option>
            {departments.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        )}
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-3 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="all">All Statuses</option>
          <option value="Eligible">Eligible</option>
          <option value="Ineligible">Ineligible</option>
        </select>
      </div>

      <p className="text-sm text-muted-foreground mb-4">Showing {paginatedGraduands.length} of {filtered.length} graduands {filtered.length !== graduands.length ? `(filtered from ${graduands.length} total)` : ""}</p>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
            <Loader2 size={18} className="animate-spin" /> Loading pass list...
          </div>
        ) : paginatedGraduands.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-muted-foreground">No records found. Click "Generate Pass List" (Admin/Dean) or adjust filters.</p>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
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
                    <tr key={g.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-foreground">{g.first_name} {g.last_name}</td>
                      <td className="px-6 py-4 text-sm font-mono text-muted-foreground">{g.index_number}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{g.program_name}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{g.department_name}</td>
                      <td className="px-6 py-4 text-sm text-center font-semibold text-foreground">{Number(g.cwa).toFixed(2)}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${g.status === "Eligible" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>{g.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-border">
              {paginatedGraduands.map((g) => (
                <div key={g.id} className="px-4 py-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">{g.first_name} {g.last_name}</p>
                      <p className="text-xs font-mono text-muted-foreground mt-0.5">{g.index_number}</p>
                      <p className="text-xs text-muted-foreground mt-1 truncate">{g.program_name}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-foreground">{Number(g.cwa).toFixed(2)}</p>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${g.status === "Eligible" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>{g.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-3 px-2">
          <p className="text-sm text-muted-foreground">Page {currentPage} of {totalPages} ({filtered.length.toLocaleString()} graduands)</p>
          <div className="flex items-center gap-1 flex-wrap justify-center">
            <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="px-3 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50">First</button>
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50">Prev</button>
            <span className="px-3 py-2 text-sm text-muted-foreground">{currentPage} / {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50">Next</button>
            <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="px-3 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50">Last</button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default PassList;
