import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Send, Eye, CheckCircle, Clock, Trash2, Loader2 } from "lucide-react";
import ExportDropdown from "@/components/ExportDropdown";
import { exportData } from "@/lib/exportUtils";
import { apiFetch } from "@/lib/api";

interface ResultBatch {
  id: string;
  semester: string;
  academic_year: string;
  department_name: string;
  program_name: string;
  status: "Draft" | "Published";
  published_at?: string;
  student_count?: number;
}

const PublishResults = () => {
  const [batches, setBatches] = useState<ResultBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiFetch<ResultBatch[]>("/results/batches");
      setBatches(data || []);
    } catch {
      // backend offline
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const publish = async (id: string) => {
    try {
      await apiFetch(`/results/batches/${id}/publish`, { method: "PUT" });
      toast({ title: "Results published", description: "Students can now view their results on the portal" });
      load();
    } catch (err: any) {
      toast({ title: "Failed", description: err.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    const batch = batches.find((b) => b.id === id);
    try {
      await apiFetch(`/results/batches/${id}`, { method: "DELETE" });
      setDeleteConfirm(null);
      toast({ title: "Results deleted", description: `${batch?.program_name} ${batch?.semester} results removed` });
      load();
    } catch (err: any) {
      toast({ title: "Failed", description: err.message, variant: "destructive" });
    }
  };

  const handleDownload = async (batch: ResultBatch, format: "csv" | "pdf") => {
    try {
      const grades = await apiFetch<any[]>(`/results/batches/${batch.id}/grades`);
      
      exportData({
        title: `${batch.program_name || 'Results'} - ${batch.semester}`,
        subtitle: `${batch.academic_year} | ${batch.department_name || 'N/A'}`,
        headers: ["Index Number", "Student Name", "Course Name", "Credit Hours", "Marks", "Grade"],
        rows: grades.map(g => [
          g.index_number,
          g.full_name,
          g.course_name,
          g.credits?.toString() || "-",
          g.marks?.toString() || "-",
          g.grade
        ]),
        fileName: `Results_${batch.semester?.replace(/\s+/g, "_")}_${batch.academic_year?.replace(/\s+/g, "_")}`,
        format,
      });
      toast({ title: "Downloaded", description: `Results downloaded as ${format.toUpperCase()}` });
    } catch (err: any) {
      toast({ title: "Failed", description: err.message || "Download failed", variant: "destructive" });
    }
  };

  const drafts = batches.filter((b) => b.status === "Draft");
  const published = batches.filter((b) => b.status === "Published");

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-foreground">Publish Results</h1>
        <p className="text-muted-foreground mt-1">Review and publish result batches to student portals</p>
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-card rounded-2xl border border-border p-6 max-w-sm w-full shadow-xl text-center" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-destructive" />
            </div>
            <h3 className="font-display text-lg font-bold text-foreground mb-2">Delete Results</h3>
            <p className="text-sm text-muted-foreground mb-5">Are you sure you want to delete these results? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 px-4 py-2.5 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:opacity-90 transition-opacity">Delete</button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
          <Loader2 size={18} className="animate-spin mr-2" /> Loading...
        </div>
      ) : (
        <>
          {drafts.length > 0 && (
            <div className="mb-8">
              <h2 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Clock size={18} className="text-muted-foreground" /> Pending Publication ({drafts.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {drafts.map((b) => (
                  <div key={b.id} className="bg-card rounded-xl border border-border p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{b.program_name}</h3>
                        <p className="text-sm text-muted-foreground">{b.department_name}</p>
                      </div>
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground">Draft</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span>{b.semester} — {b.academic_year}</span>
                      <span>{b.student_count ?? 0} students</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => publish(b.id)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg gradient-gold text-secondary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                        <Send size={14} /> Publish
                      </button>
                      <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors">
                        <Eye size={14} /> Preview
                      </button>
                      <button onClick={() => setDeleteConfirm(b.id)} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <h2 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle size={18} className="text-success" /> Published ({published.length})
          </h2>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              {published.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">No published results yet.</div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">Programme</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">Department</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">Semester</th>
                      <th className="text-center px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">Published</th>
                      <th className="text-right px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {published.map((b) => (
                      <tr key={b.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-foreground">{b.program_name || "—"}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{b.department_name || "—"}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{b.semester} — {b.academic_year}</td>
                        <td className="px-6 py-4 text-sm text-center text-muted-foreground">{b.published_at?.slice(0, 10) ?? "—"}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <ExportDropdown onExport={(format) => handleDownload(b, format)} label="Download" compact />
                            <button onClick={() => setDeleteConfirm(b.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default PublishResults;
