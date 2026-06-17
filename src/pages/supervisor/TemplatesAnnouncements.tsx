import { useEffect, useRef, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/lib/api";
import {
  Upload, FileText, FileType, Archive, Download, Trash2, Filter,
  Send, Paperclip, Calendar, Bell, Clock, Users, User, X,
  Plus, Search, SortAsc, Loader2, Check,
} from "lucide-react";

interface Resource {
  id: string;
  title: string;
  category: string;
  description: string | null;
  file_url: string;
  file_size: number | null;
  created_at: string;
}

interface Announcement {
  id: string;
  text: string;
  visibility: string;
  scheduled_at: string | null;
  created_at: string;
}

interface AssignedStudent {
  id: string;
  name: string;
  index_number: string;
  program_name: string;
}

const categories = ["Report Template", "Guidelines", "Rubric", "Reference Material", "Other"];

const fileIcon = (name: string) => {
  const ext = name.split(".").pop()?.toUpperCase();
  if (ext === "PDF") return <FileText size={18} className="text-destructive" />;
  if (ext === "PPTX") return <FileType size={18} className="text-accent-foreground" />;
  if (ext === "ZIP") return <Archive size={18} className="text-muted-foreground" />;
  return <FileText size={18} className="text-primary" />;
};

const TemplatesAnnouncements = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  /* ── Resources ── */
  const [resources, setResources] = useState<Resource[]>([]);
  const [resLoading, setResLoading] = useState(true);
  const [resFilter, setResFilter] = useState("all");
  const [resSearch, setResSearch] = useState("");
  const [resSort, setResSort] = useState<"date" | "name">("date");
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDesc, setUploadDesc] = useState("");
  const [uploadCat, setUploadCat] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  /* ── Announcements ── */
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [annLoading, setAnnLoading] = useState(true);
  const [assignedStudents, setAssignedStudents] = useState<AssignedStudent[]>([]);
  const [annText, setAnnText] = useState("");
  const [annVisibility, setAnnVisibility] = useState("All Students");
  const [annSelectedStudents, setAnnSelectedStudents] = useState<string[]>([]);
  const [annSchedule, setAnnSchedule] = useState("");
  const [annPosting, setAnnPosting] = useState(false);

  /* ── Load data ── */
  const loadResources = async () => {
    setResLoading(true);
    try {
      const data = await apiFetch("/supervisors/resources");
      setResources(Array.isArray(data) ? data : []);
    } catch (err) {
      toast({ title: "Failed to load resources", description: (err as Error).message, variant: "destructive" });
    } finally {
      setResLoading(false);
    }
  };

  const loadAnnouncements = async () => {
    setAnnLoading(true);
    try {
      const data = await apiFetch("/supervisors/announcements");
      setAnnouncements(Array.isArray(data) ? data : []);
    } catch (err) {
      toast({ title: "Failed to load announcements", description: (err as Error).message, variant: "destructive" });
    } finally {
      setAnnLoading(false);
    }
  };

  const loadAssignedStudents = async () => {
    if (!user?.id) return;
    try {
      // Fetch current supervisor info first to get supervisor ID
      const supervisorRes = await apiFetch("/supervisors");
      const currentSupervisor = supervisorRes.find((s: any) => s.user_id === user.id);
      if (!currentSupervisor) return;

      const studentData = await apiFetch(`/supervisors/${currentSupervisor.id}/students`);
      setAssignedStudents(Array.isArray(studentData) ? studentData : []);
    } catch (err) {
      // Silently fail - students might not be loaded
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadResources();
      loadAnnouncements();
      loadAssignedStudents();
    }
  }, [user?.id]);

  /* ── Resource handlers ── */
  const handleUpload = async () => {
    if (!uploadFile) {
      toast({ title: "No file selected", variant: "destructive" });
      return;
    }
    if (!uploadTitle.trim()) {
      toast({ title: "Enter a title", variant: "destructive" });
      return;
    }
    if (!uploadCat) {
      toast({ title: "Select a category", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("title", uploadTitle);
      formData.append("category", uploadCat);
      formData.append("description", uploadDesc);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/supervisors/resources/upload`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      toast({ title: "File uploaded", description: uploadFile.name });
      setUploadFile(null);
      setUploadTitle("");
      setUploadDesc("");
      setUploadCat("");
      loadResources();
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const deleteResource = async (id: string) => {
    try {
      await apiFetch(`/supervisors/resources/${id}`, { method: "DELETE" });
      setResources((prev) => prev.filter((x) => x.id !== id));
      toast({ title: "File removed" });
    } catch (err: any) {
      toast({ title: "Delete failed", description: err.message, variant: "destructive" });
    }
  };

  const downloadResource = async (r: Resource) => {
    try {
      window.open(r.file_url, "_blank");
    } catch (err: any) {
      toast({ title: "Download failed", description: err.message, variant: "destructive" });
    }
  };

  const filteredResources = resources
    .filter((r) => resFilter === "all" || r.category === resFilter)
    .filter((r) => r.title.toLowerCase().includes(resSearch.toLowerCase()) || (r.description ?? "").toLowerCase().includes(resSearch.toLowerCase()))
    .sort((a, b) => resSort === "date" ? b.created_at.localeCompare(a.created_at) : a.title.localeCompare(b.title));

  /* ── Announcement handlers ── */
  const handlePostAnnouncement = async () => {
    if (!annText.trim()) {
      toast({ title: "Enter announcement text", variant: "destructive" });
      return;
    }
    if (annVisibility === "Individual" && annSelectedStudents.length === 0) {
      toast({ title: "Select at least one student", variant: "destructive" });
      return;
    }
    setAnnPosting(true);
    try {
      const payload: any = {
        text: annText.trim(),
        visibility: annVisibility,
        scheduled_at: annSchedule || null,
      };
      if (annVisibility === "Individual") {
        payload.student_ids = JSON.stringify(annSelectedStudents);
      } else {
        // For "All Students", send to all assigned students
        payload.student_ids = JSON.stringify(assignedStudents.map(s => s.id));
      }

      await apiFetch("/supervisors/announcements", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      toast({ title: annSchedule ? "Announcement scheduled" : "Announcement posted" });
      setAnnText("");
      setAnnVisibility("All Students");
      setAnnSchedule("");
      setAnnSelectedStudents([]);
      loadAnnouncements();
    } catch (err: any) {
      toast({ title: "Failed to post", description: err.message, variant: "destructive" });
    } finally {
      setAnnPosting(false);
    }
  };

  const deleteAnnouncement = async (id: string) => {
    try {
      await apiFetch(`/supervisors/announcements/${id}`, { method: "DELETE" });
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      toast({ title: "Announcement deleted" });
    } catch (err: any) {
      toast({ title: "Delete failed", description: err.message, variant: "destructive" });
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground">Templates & Announcements</h1>
        <p className="text-muted-foreground mt-1">Share resources and communicate with your assigned students</p>
      </div>

      <Tabs defaultValue="resources" className="space-y-6">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="resources" className="gap-2"><FileText size={16} /> Resources</TabsTrigger>
          <TabsTrigger value="announcements" className="gap-2"><Bell size={16} /> Announcements</TabsTrigger>
        </TabsList>

        {/* ── RESOURCES TAB ── */}
        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upload Template / Guideline</CardTitle>
              <CardDescription>Share thesis-related documents with your students</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) setUploadFile(f); }}
                onClick={() => fileRef.current?.click()}
              >
                <Upload className="mx-auto mb-3 text-muted-foreground" size={32} />
                {uploadFile ? (
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm font-medium text-foreground">{uploadFile.name}</span>
                    <button onClick={(e) => { e.stopPropagation(); setUploadFile(null); }} className="text-muted-foreground hover:text-destructive"><X size={16} /></button>
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-medium text-foreground">Drag & drop or click to browse</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, PPTX, ZIP — Max 20 MB</p>
                  </>
                )}
                <input ref={fileRef} type="file" accept=".pdf,.docx,.pptx,.zip" className="hidden" onChange={(e) => { if (e.target.files?.[0]) setUploadFile(e.target.files[0]); }} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input placeholder="e.g., Research Guidelines" value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={uploadCat} onValueChange={setUploadCat}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Description (optional)</Label>
                  <Input placeholder="Brief description" value={uploadDesc} onChange={(e) => setUploadDesc(e.target.value)} />
                </div>
              </div>

              <Button onClick={handleUpload} disabled={uploading} className="w-full sm:w-auto">
                {uploading ? <Loader2 size={16} className="animate-spin mr-1" /> : <Plus size={16} />}
                {uploading ? "Uploading..." : "Upload File"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <CardTitle className="text-lg">Resource Library</CardTitle>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search files…" className="pl-9 w-full sm:w-48" value={resSearch} onChange={(e) => setResSearch(e.target.value)} />
                  </div>
                  <Select value={resFilter} onValueChange={setResFilter}>
                    <SelectTrigger className="w-full sm:w-40"><Filter size={14} className="mr-1" /><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" onClick={() => setResSort((s) => s === "date" ? "name" : "date")} className="gap-1">
                    <SortAsc size={14} /> {resSort === "date" ? "By Date" : "By Name"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {resLoading ? (
                <div className="flex items-center justify-center py-10 text-muted-foreground text-sm"><Loader2 size={16} className="animate-spin mr-2" /> Loading...</div>
              ) : filteredResources.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No files uploaded yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>File Name</TableHead>
                        <TableHead className="hidden sm:table-cell">Category</TableHead>
                        <TableHead className="hidden md:table-cell">Description</TableHead>
                        <TableHead className="hidden sm:table-cell">Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredResources.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {fileIcon(r.title)}
                              <div>
                                <p className="font-medium text-sm text-foreground">{r.title}</p>
                                <p className="text-xs text-muted-foreground sm:hidden">{r.category} · {r.created_at?.slice(0, 10) || "—"}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell"><Badge variant="secondary">{r.category}</Badge></TableCell>
                          <TableCell className="hidden md:table-cell text-sm text-muted-foreground max-w-[200px] truncate">{r.description ?? "—"}</TableCell>
                          <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{r.created_at?.slice(0, 10) || "—"}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" title="Download" onClick={() => downloadResource(r)}><Download size={16} /></Button>
                              <Button variant="ghost" size="icon" title="Delete" onClick={() => deleteResource(r.id)} className="text-destructive hover:text-destructive"><Trash2 size={16} /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── ANNOUNCEMENTS TAB ── */}
        <TabsContent value="announcements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Post Announcement</CardTitle>
              <CardDescription>Send notices to your assigned students</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea placeholder="Type your announcement here…" rows={4} value={annText} onChange={(e) => setAnnText(e.target.value)} />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1"><Users size={14} /> Recipient</Label>
                  <Select value={annVisibility} onValueChange={(val) => { setAnnVisibility(val); setAnnSelectedStudents([]); }}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Students">All Assigned Students ({assignedStudents.length})</SelectItem>
                      <SelectItem value="Individual">Select Individual Students</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1"><Calendar size={14} /> Schedule (optional)</Label>
                  <Input type="datetime-local" value={annSchedule} onChange={(e) => setAnnSchedule(e.target.value)} />
                </div>
              </div>

              {annVisibility === "Individual" && (
                <div className="space-y-3 p-4 rounded-lg bg-muted/40 border border-border">
                  <Label className="text-sm font-medium">Select Students</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
                    {assignedStudents.map((student) => (
                      <button
                        key={student.id}
                        onClick={() =>
                          setAnnSelectedStudents((prev) =>
                            prev.includes(student.id)
                              ? prev.filter((id) => id !== student.id)
                              : [...prev, student.id]
                          )
                        }
                        className={`p-3 rounded-lg text-left transition-colors border ${
                          annSelectedStudents.includes(student.id)
                            ? "border-primary bg-primary/10"
                            : "border-border hover:bg-muted"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {annSelectedStudents.includes(student.id) && <Check size={16} className="text-primary" />}
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{student.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{student.index_number}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">{annSelectedStudents.length} student(s) selected</p>
                </div>
              )}

              <Button onClick={handlePostAnnouncement} disabled={annPosting} className="w-full sm:w-auto">
                {annPosting ? <Loader2 size={16} className="animate-spin mr-1" /> : <Send size={16} />}
                {annSchedule ? "Schedule" : "Post Now"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Announcement Feed</CardTitle></CardHeader>
            <CardContent>
              {annLoading ? (
                <div className="flex items-center justify-center py-10 text-muted-foreground text-sm"><Loader2 size={16} className="animate-spin mr-2" /> Loading...</div>
              ) : announcements.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No announcements posted yet.</p>
              ) : (
                <div className="space-y-4">
                  {announcements.map((a) => {
                    const date = new Date(a.created_at);
                    const isScheduled = a.scheduled_at && new Date(a.scheduled_at) > new Date();
                    return (
                      <div key={a.id} className="border border-border rounded-xl p-4 sm:p-5 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant={a.visibility === "All Students" ? "default" : "secondary"} className="gap-1">
                              {a.visibility === "All Students" ? <Users size={12} /> : <User size={12} />}
                              {a.visibility}
                            </Badge>
                            {isScheduled && <Badge variant="outline" className="gap-1"><Clock size={12} /> Scheduled</Badge>}
                          </div>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock size={12} /> {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed">{a.text}</p>
                        <div className="flex justify-end">
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive h-7 text-xs" onClick={() => deleteAnnouncement(a.id)}>
                            <Trash2 size={14} /> Delete
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default TemplatesAnnouncements;
