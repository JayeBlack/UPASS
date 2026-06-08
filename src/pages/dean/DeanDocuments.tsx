import DashboardLayout from "@/components/DashboardLayout";
import { FileText, Upload, X, Search, Loader2, Send, Check } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiFetch, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  index_number: string;
  program_name: string;
  department_name: string;
  email: string;
}

interface UploadedDoc {
  id: string;
  title: string;
  file_name: string;
  file_url: string;
  recipient_count: number;
  created_at: string;
}

const DeanDocuments = () => {
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [uploads, setUploads] = useState<UploadedDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({ title: "", file: null as File | null });

  const load = async () => {
    setLoading(true);
    try {
      const [studentsData, uploadsData] = await Promise.all([
        apiFetch<Student[]>("/students"),
        apiFetch<UploadedDoc[]>("/documents/dean/uploads").catch(() => []),
      ]);
      setStudents(studentsData || []);
      setUploads(uploadsData || []);
    } catch {
      // backend offline
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const departments = [...new Set(students.map((s) => s.department_name).filter(Boolean))];
  
  const filtered = students.filter((s) => {
    const name = `${s.first_name} ${s.last_name}`.toLowerCase();
    const matchSearch = name.includes(search.toLowerCase()) || s.index_number.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === "all" || s.department_name === deptFilter;
    return matchSearch && matchDept;
  });

  const toggleStudent = (id: string) => {
    const newSet = new Set(selectedStudents);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedStudents(newSet);
  };

  const selectAll = () => {
    if (selectedStudents.size === filtered.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(filtered.map((s) => s.id)));
    }
  };

  const handleUpload = async () => {
    if (!uploadForm.title || !uploadForm.file || selectedStudents.size === 0) {
      toast({ title: "Missing fields", description: "Please fill all fields and select students", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", uploadForm.file);
      formData.append("title", uploadForm.title);
      formData.append("student_ids", JSON.stringify(Array.from(selectedStudents)));

      await apiFetch("/documents/dean/upload", {
        method: "POST",
        body: formData,
        headers: {}, // Let browser set Content-Type with boundary
      });

      toast({ 
        title: "Document sent successfully", 
        description: `Sent to ${selectedStudents.size} student(s)` 
      });
      setShowUploadModal(false);
      setUploadForm({ title: "", file: null });
      setSelectedStudents(new Set());
      if (fileRef.current) fileRef.current.value = "";
      load();
    } catch (err) {
      toast({ 
        title: "Upload failed", 
        description: err instanceof ApiError ? err.message : "Error uploading document", 
        variant: "destructive" 
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">Document Management</h1>
          <p className="text-muted-foreground mt-1">Upload and send documents to students</p>
        </div>
        <Button 
          onClick={() => setShowUploadModal(true)} 
          className="gradient-gold text-secondary-foreground hover:opacity-90"
        >
          <Upload size={16} className="mr-2" /> Upload Document
        </Button>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm p-4" onClick={() => setShowUploadModal(false)}>
          <div className="bg-card rounded-2xl border border-border p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-xl font-bold text-foreground">Upload Document to Students</h3>
              <button onClick={() => setShowUploadModal(false)} className="p-1 rounded hover:bg-muted">
                <X size={20} className="text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Document Details */}
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-foreground">Document Title *</label>
                  <input
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                    className="w-full mt-1.5 px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none"
                    placeholder="e.g. Clearance Requirements 2024"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Select File *</label>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
                    onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files?.[0] || null })}
                    className="w-full mt-1.5 px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Supported: PDF, Word, Excel, PowerPoint, Images, Text
                  </p>
                  {uploadForm.file && (
                    <p className="text-sm text-foreground mt-2 flex items-center gap-2">
                      <FileText size={14} /> {uploadForm.file.name} ({(uploadForm.file.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>
              </div>

              {/* Student Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-foreground">Select Recipients * ({selectedStudents.size} selected)</label>
                  <button
                    onClick={selectAll}
                    className="text-xs font-medium text-secondary hover:underline"
                  >
                    {selectedStudents.size === filtered.length ? "Deselect All" : "Select All"}
                  </button>
                </div>

                {/* Filters */}
                <div className="flex gap-3 mb-3">
                  <div className="relative flex-1">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search students..."
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none"
                    />
                  </div>
                  <select
                    value={deptFilter}
                    onChange={(e) => setDeptFilter(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none"
                  >
                    <option value="all">All Departments</option>
                    {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                {/* Student List */}
                <div className="border border-border rounded-lg max-h-64 overflow-y-auto">
                  {filtered.length === 0 ? (
                    <p className="text-center py-8 text-sm text-muted-foreground">No students found</p>
                  ) : (
                    <div className="divide-y divide-border">
                      {filtered.map((s) => (
                        <label
                          key={s.id}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedStudents.has(s.id)}
                            onChange={() => toggleStudent(s.id)}
                            className="w-4 h-4 rounded border-input text-secondary focus:ring-2 focus:ring-ring"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">{s.first_name} {s.last_name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs font-mono text-muted-foreground">{s.index_number}</span>
                              <span className="text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground truncate">{s.department_name}</span>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-3">
                <Button
                  variant="outline"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="flex-1 gradient-gold text-secondary-foreground hover:opacity-90"
                >
                  {uploading ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" /> Uploading...
                    </>
                  ) : (
                    <>
                      <Send size={16} className="mr-2" /> Send Document
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload History */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-display text-lg font-bold text-foreground">Upload History</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Documents you've sent to students</p>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
              <Loader2 size={18} className="animate-spin mr-2" /> Loading...
            </div>
          ) : uploads.length === 0 ? (
            <div className="py-12 text-center">
              <FileText size={36} className="mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No documents uploaded yet</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">Document</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">File Name</th>
                  <th className="text-center px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">Recipients</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">Date</th>
                  <th className="text-center px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {uploads.map((doc) => (
                  <tr key={doc.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{doc.title}</td>
                    <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{doc.file_name}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2.5 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium">
                        {doc.recipient_count} students
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{new Date(doc.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                        <Check size={12} /> Sent
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DeanDocuments;
