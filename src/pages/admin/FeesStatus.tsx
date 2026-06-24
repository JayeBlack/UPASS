import DashboardLayout from "@/components/DashboardLayout";
import { CheckCircle, XCircle, Search, Filter, Upload, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminDepartment } from "@/hooks/use-admin-department";
import { apiFetch } from "@/lib/api";

interface FeeRecord {
  id: string;
  index_number: string;
  first_name: string;
  last_name: string;
  program_name: string;
  department_name: string;
  academic_year: string;
  semester: string;
  total_amount: number;
  amount_paid: number;
  outstanding: number;
  credit_balance: number;
  status: string;
  is_cleared: boolean;
}

const FeesStatus = () => {
  const { user } = useAuth();
  const { isSuperAdmin, adminDepartment } = useAdminDepartment();
  const isAccountant = user?.role === "Accountant";
  const isAccountingAssistant = user?.role === "AccountingAssistant";
  const isRegistrar = user?.role === "Registrar";
  const isAdminAssistant = user?.role === "AdminAssistant";
  const isViewOnlyUser = isRegistrar || isAdminAssistant || user?.role === "Dean" || user?.role === "ViceDean" || user?.role === "ExamsOfficer" || user?.role === "Admin";
  const canModifyFees = isAccountant || isAccountingAssistant;
  
  // Determine if user sees all departments (university-wide access)
  const isUniversityWide = isSuperAdmin || 
    adminDepartment === "School of Postgraduate Studies" || 
    adminDepartment === "Finance Office" ||
    user?.role === "Admin" ||
    user?.role === "Accountant" ||
    user?.role === "AccountingAssistant" ||
    user?.role === "Registrar";
  
  const [records, setRecords] = useState<FeeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ cleared: 0, owing: 0, totalOutstanding: 0 });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "cleared" | "owing">("all");
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [progFilter, setProgFilter] = useState<string>("all");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const itemsPerPage = 50;
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 when filters change
  }, [statusFilter, search]);

  useEffect(() => {
    loadFees();
  }, [currentPage, statusFilter, search]);

  const loadFees = async () => {
    setLoading(true);
    try {
      console.log(`[FeesStatus] ${user?.role} (${user?.email}) fetching fees from /api/fees...`);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString()
      });
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (search) params.append('search', search);
      
      console.log(`[FeesStatus] Request params:`, params.toString());
      
      const response = await apiFetch<{ data: FeeRecord[], pagination: { page: number, limit: number, total: number, totalPages: number } }>(`/fees?${params}`);
      
      console.log(`[FeesStatus] Full response:`, response);
      console.log(`[FeesStatus] Response.data:`, response.data);
      console.log(`[FeesStatus] Response.pagination:`, response.pagination);
      console.log(`[FeesStatus] ${user?.role} received ${response.data?.length || 0} records`);
      
      setRecords(response.data || []);
      setTotalPages(response.pagination?.totalPages || 1);
      setTotalRecords(response.pagination?.total || 0);
      
      console.log(`[FeesStatus] State updated - records count: ${response.data?.length || 0}, totalRecords: ${response.pagination?.total || 0}`);
      
      // Fetch summary data for stats cards
      const summaryParams = new URLSearchParams();
      
      // Determine who sees all departments vs department-specific
      const isUniversityWide = isSuperAdmin || 
        adminDepartment === "School of Postgraduate Studies" || 
        adminDepartment === "Finance Office" ||
        user?.role === "Admin" ||
        user?.role === "Accountant" ||
        user?.role === "AccountingAssistant" ||
        user?.role === "Registrar";
      
      const dept = isUniversityWide ? deptFilter : (adminDepartment || "all");
      if (dept !== "all") summaryParams.append('department', dept);
      
      const summaryData = await apiFetch<{ cleared_count: number, owing_count: number, total_outstanding: number }>(`/fees/summary?${summaryParams}`);
      console.log(`[FeesStatus] Summary data:`, summaryData);
      
      setSummary({
        cleared: summaryData.cleared_count || 0,
        owing: summaryData.owing_count || 0,
        totalOutstanding: summaryData.total_outstanding || 0
      });
    } catch (err: any) {
      console.error(`[FeesStatus] ${user?.role} error:`, err);
      console.error(`[FeesStatus] Error details:`, {
        message: err.message,
        status: err.status,
        stack: err.stack
      });
      toast({ 
        title: "Failed to load fees", 
        description: err.message || "Check console for details", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
      console.log(`[FeesStatus] Loading complete`);
    }
  };

  const handleToggleClearance = async (feeId: string) => {
    if (!canModifyFees) {
      toast({ title: "Access Denied", description: "You don't have permission to modify fees", variant: "destructive" });
      return;
    }
    try {
      await apiFetch(`/fees/${feeId}/clearance`, { method: "PUT" });
      toast({ title: "Clearance toggled" });
      loadFees();
    } catch (err: any) {
      toast({ title: "Failed", description: err.message, variant: "destructive" });
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      // Step 1: Parse the file
      const parsed = await apiFetch<{ rows: any[] }>("/fees/parse-bulk", {
        method: "POST",
        body: formData,
        headers: {}, // Let browser set Content-Type with boundary
      });

      if (parsed.rows.length === 0) {
        toast({ title: "No records", description: "Could not parse any records", variant: "destructive" });
        setUploading(false);
        e.target.value = "";
        return;
      }

      // Validate that all rows have academic_year and semester
      const missingData = parsed.rows.filter((r: any) => !r.academic_year || !r.semester);
      if (missingData.length > 0) {
        toast({ 
          title: "Missing data", 
          description: `${missingData.length} rows are missing Academic Year or Semester. Please ensure all rows have these values.`, 
          variant: "destructive" 
        });
        setUploading(false);
        e.target.value = "";
        return;
      }

      // Step 2: Directly import without preview (academic_year and semester are already in the file)
      const result = await apiFetch<{ created: any[]; errors?: string[] }>("/fees/upload-bulk", {
        method: "POST",
        body: JSON.stringify({ fees: parsed.rows }),
      });

      if (result.errors && result.errors.length > 0) {
        toast({
          title: "Import completed with errors",
          description: `${result.created.length} records imported, ${result.errors.length} errors.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Import complete",
          description: `${result.created.length} fee records imported successfully`,
        });
      }

      setShowImport(false);
      loadFees();
    } catch (err: any) {
      console.error("Import error:", err);
      toast({ title: "Import failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // Frontend filters only apply to department/program on already loaded records
  const filtered = records.filter((f) => {
    // Determine effective department filter
    // 1. SuperAdmin can filter by any department using deptFilter
    // 2. School of Postgraduate Studies, Finance Office, Admin roles see all departments
    // 3. Other departmental staff see only their department
    const isUniversityWide = isSuperAdmin || 
      adminDepartment === "School of Postgraduate Studies" || 
      adminDepartment === "Finance Office" ||
      user?.role === "Admin" ||
      user?.role === "Accountant" ||
      user?.role === "AccountingAssistant" ||
      user?.role === "Registrar";
    
    const effectiveDept = isUniversityWide ? deptFilter : (adminDepartment || "all");
    const matchesDept = effectiveDept === "all" || f.department_name === effectiveDept;
    const matchesProg = progFilter === "all" || f.program_name === progFilter;
    
    return matchesDept && matchesProg;
  });
  
  console.log(`[FeesStatus] Records: ${records.length}, Filtered: ${filtered.length}, Role: ${user?.role}, Dept: ${adminDepartment}`);

  const allDepts = [...new Set(records.map((f) => f.department_name).filter(Boolean))];
  const allProgs = [...new Set(records.map((f) => f.program_name).filter(Boolean))];

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">Students Fees</h1>
          <p className="text-muted-foreground mt-1">
            {isViewOnlyUser 
              ? "View-only access to financial records" 
              : isUniversityWide
              ? "Financial clearance for postgraduate students" 
              : `${adminDepartment} — Financial clearance`}
          </p>
        </div>
        {canModifyFees && (
          <button
            onClick={() => setShowImport(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            <Upload size={14} /> Import Manual Payments
          </button>
        )}
      </div>

      {/* Import Modal */}
      {showImport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm p-4" onClick={() => setShowImport(false)}>
          <div className="bg-card rounded-2xl border border-border p-6 max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-lg font-bold text-foreground mb-2">Import Manual Payments</h3>
            <p className="text-sm text-muted-foreground mb-4">Upload a CSV or Excel file containing the list of students who made bank payments. The file must include Academic Year and Semester for each student.</p>
            <p className="text-xs text-muted-foreground mb-4">Required columns: Index Number, Student Name, Total Amount, Amount Paid, Academic Year, Semester</p>

            <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleImportFile} disabled={uploading} />
            <div
              onClick={() => !uploading && fileRef.current?.click()}
              className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-secondary/50 transition-colors"
            >
              <Upload size={28} className="mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-foreground font-medium">{uploading ? "Processing..." : "Click to upload CSV or Excel file"}</p>
              <p className="text-xs text-muted-foreground mt-1">Accepted: .csv, .xlsx, .xls</p>
            </div>
            {uploading && (
              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
                <Loader2 size={16} className="animate-spin" /> Parsing and importing records...
              </div>
            )}
            <button onClick={() => setShowImport(false)} className="w-full mt-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        <div className="bg-card rounded-xl border border-border px-5 py-4 flex items-center gap-3">
          <CheckCircle size={20} className="text-success" />
          <div>
            <p className="text-xl font-bold font-display text-foreground">{summary.cleared}</p>
            <p className="text-xs text-muted-foreground">Cleared</p>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border px-5 py-4 flex items-center gap-3">
          <XCircle size={20} className="text-destructive" />
          <div>
            <p className="text-xl font-bold font-display text-foreground">{summary.owing}</p>
            <p className="text-xs text-muted-foreground">Outstanding</p>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border px-5 py-4 flex items-center gap-3">
          <Filter size={20} className="text-warning" />
          <div>
            <p className="text-xl font-bold font-display text-foreground">GHS {summary.totalOutstanding.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Owed</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or index..." className="w-full pl-11 pr-4 py-3 rounded-lg border border-input bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="px-4 py-3 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="all">All Statuses</option>
          <option value="cleared">Cleared Only</option>
          <option value="owing">Owing Only</option>
        </select>
        <button onClick={() => setShowFilterPanel(!showFilterPanel)} className="px-4 py-3 rounded-lg border border-input bg-card text-foreground text-sm hover:bg-muted transition-colors flex items-center gap-2">
          <Filter size={14} /> Filters {(deptFilter !== "all" || progFilter !== "all") && <span className="w-2 h-2 rounded-full bg-primary" />}
        </button>
      </div>

      {showFilterPanel && (
        <div className="bg-card rounded-xl border border-border p-5 mb-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Filter by {isUniversityWide ? "Department & " : ""}Programme</h3>
          <div className={`grid grid-cols-1 ${isUniversityWide ? "sm:grid-cols-2" : ""} gap-4`}>
            {isUniversityWide && (
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Departments</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                    <input type="checkbox" checked={deptFilter === "all"} onChange={() => setDeptFilter("all")} className="rounded border-input" />
                    All Departments
                  </label>
                  {allDepts.map((d) => (
                    <label key={d} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                      <input type="checkbox" checked={deptFilter === d} onChange={() => setDeptFilter(deptFilter === d ? "all" : d)} className="rounded border-input" />
                      {d}
                    </label>
                  ))}
                </div>
              </div>
            )}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">Programmes</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                  <input type="checkbox" checked={progFilter === "all"} onChange={() => setProgFilter("all")} className="rounded border-input" />
                  All Programmes
                </label>
                {allProgs.map((p) => (
                  <label key={p} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                    <input type="checkbox" checked={progFilter === p} onChange={() => setProgFilter(progFilter === p ? "all" : p)} className="rounded border-input" />
                    {p}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <p className="text-sm text-muted-foreground mb-4">
        Showing {filtered.length} of {totalRecords.toLocaleString()} total students
        {isViewOnlyUser && <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-muted">View Only</span>}
        {!isSuperAdmin && adminDepartment && <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-info/10 text-info">Dept: {adminDepartment}</span>}
      </p>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
              <Loader2 size={18} className="animate-spin mr-2" /> Loading financial records...
            </div>
          ) : (
            <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Student</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Index</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Programme</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Department</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Fees</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Paid</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Outstanding</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Credit Balance</th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => (
                <tr key={f.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{f.first_name} {f.last_name}</td>
                  <td className="px-6 py-4 text-sm font-mono text-muted-foreground">{f.index_number}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{f.program_name}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{f.department_name}</td>
                  <td className="px-6 py-4 text-sm text-right text-muted-foreground">GHS {Number(f.total_amount).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-right text-muted-foreground">GHS {Number(f.amount_paid).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-right font-semibold text-foreground">
                    {(Number(f.total_amount) - Number(f.amount_paid)) > 0 ? (
                      <span className="text-destructive">GHS {(Number(f.total_amount) - Number(f.amount_paid)).toLocaleString()}</span>
                    ) : (
                      <span className="text-success">GHS 0</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-right font-semibold">
                    {Number(f.credit_balance) > 0 ? (
                      <span className="text-blue-500">GHS {Number(f.credit_balance).toLocaleString()}</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${f.is_cleared ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                      {f.is_cleared ? "Cleared" : "Owing"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {canModifyFees ? (
                      <button onClick={() => handleToggleClearance(f.id)} className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${f.is_cleared ? "border border-border text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30" : "gradient-gold text-secondary-foreground hover:opacity-90"}`}>
                        {f.is_cleared ? "Revoke" : "Clear"}
                      </button>
                    ) : (
                      <span className="text-xs text-muted-foreground px-2">Read only</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && !loading && (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-sm text-muted-foreground">
                    {records.length === 0 ? "No fee records available" : "No students match the selected filters"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 px-2">
          <div className="text-sm text-muted-foreground">
            Showing page {currentPage} of {totalPages} ({totalRecords.toLocaleString()} total records)
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
            
            {/* Page Numbers */}
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

export default FeesStatus;