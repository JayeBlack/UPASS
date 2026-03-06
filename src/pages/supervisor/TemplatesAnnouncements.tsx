import { useState, useRef } from "react";
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
import {
  Upload, FileText, FileType, Archive, Download, Trash2, Filter,
  Send, Paperclip, Calendar, Bell, Clock, Users, User, Eye, X,
  Plus, Search, SortAsc,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface Resource {
  id: string;
  name: string;
  type: string;
  size: string;
  category: string;
  description: string;
  uploadDate: string;
  file?: File;
}

interface Announcement {
  id: string;
  text: string;
  visibility: string;
  attachmentName?: string;
  scheduledAt?: string;
  createdAt: string;
  acknowledged: number;
  total: number;
}

/* ------------------------------------------------------------------ */
/*  Seed data                                                          */
/* ------------------------------------------------------------------ */
const seedResources: Resource[] = [
  { id: "r1", name: "Thesis_Report_Template.docx", type: "DOCX", size: "245 KB", category: "Report Template", description: "Standard thesis report template for MSc students", uploadDate: "2026-02-15" },
  { id: "r2", name: "Research_Guidelines_2026.pdf", type: "PDF", size: "1.2 MB", category: "Guidelines", description: "Updated research methodology guidelines", uploadDate: "2026-02-20" },
  { id: "r3", name: "Grading_Rubric.pdf", type: "PDF", size: "180 KB", category: "Rubric", description: "Thesis evaluation rubric for supervisors and examiners", uploadDate: "2026-01-10" },
  { id: "r4", name: "Presentation_Template.pptx", type: "PPTX", size: "3.8 MB", category: "Report Template", description: "Thesis defence presentation template", uploadDate: "2026-03-01" },
];

const seedAnnouncements: Announcement[] = [
  { id: "a1", text: "All thesis chapters must be submitted by March 31, 2026. Late submissions will not be reviewed this semester.", visibility: "All Students", createdAt: "2026-03-05T14:30:00", acknowledged: 5, total: 8 },
  { id: "a2", text: "Grading rubric has been updated — please review the new criteria before your next submission.", visibility: "All Students", attachmentName: "Grading_Rubric.pdf", createdAt: "2026-03-03T09:15:00", acknowledged: 7, total: 8 },
  { id: "a3", text: "Kwame, please revise Chapter 2 literature review before our next meeting on Wednesday.", visibility: "Kwame Mensah", createdAt: "2026-03-01T11:00:00", acknowledged: 1, total: 1 },
];

const categories = ["Report Template", "Guidelines", "Rubric", "Reference Material", "Other"];
const assignedStudents = ["Kwame Mensah", "Esi Appiah", "Yaw Boateng", "Efua Dankwah", "Kofi Adu", "Akua Sarpong", "Nana Yeboah", "Ama Tetteh"];

const fileIcon = (type: string) => {
  switch (type) {
    case "PDF": return <FileText size={18} className="text-destructive" />;
    case "PPTX": return <FileType size={18} className="text-orange-500" />;
    case "ZIP": return <Archive size={18} className="text-muted-foreground" />;
    default: return <FileText size={18} className="text-primary" />;
  }
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
const TemplatesAnnouncements = () => {
  const { toast } = useToast();

  /* Resources state */
  const [resources, setResources] = useState<Resource[]>(seedResources);
  const [resFilter, setResFilter] = useState("all");
  const [resSearch, setResSearch] = useState("");
  const [resSort, setResSort] = useState<"date" | "name">("date");

  /* Upload form */
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadDesc, setUploadDesc] = useState("");
  const [uploadCat, setUploadCat] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  /* Announcements state */
  const [announcements, setAnnouncements] = useState<Announcement[]>(seedAnnouncements);
  const [annText, setAnnText] = useState("");
  const [annVisibility, setAnnVisibility] = useState("all");
  const [annAttachment, setAnnAttachment] = useState<File | null>(null);
  const [annSchedule, setAnnSchedule] = useState("");
  const annFileRef = useRef<HTMLInputElement>(null);

  /* ---- Resource helpers ---- */
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setUploadFile(f);
  };

  const handleUpload = () => {
    if (!uploadFile) { toast({ title: "No file selected", variant: "destructive" }); return; }
    if (!uploadCat) { toast({ title: "Select a category", variant: "destructive" }); return; }
    const ext = uploadFile.name.split(".").pop()?.toUpperCase() || "FILE";
    const newRes: Resource = {
      id: `r${Date.now()}`,
      name: uploadFile.name,
      type: ext,
      size: `${(uploadFile.size / 1024).toFixed(0)} KB`,
      category: uploadCat,
      description: uploadDesc || "No description",
      uploadDate: new Date().toISOString().split("T")[0],
      file: uploadFile,
    };
    setResources((prev) => [newRes, ...prev]);
    setUploadFile(null);
    setUploadDesc("");
    setUploadCat("");
    toast({ title: "File uploaded", description: uploadFile.name });
  };

  const deleteResource = (id: string) => {
    setResources((prev) => prev.filter((r) => r.id !== id));
    toast({ title: "File removed" });
  };

  const filteredResources = resources
    .filter((r) => resFilter === "all" || r.category === resFilter)
    .filter((r) => r.name.toLowerCase().includes(resSearch.toLowerCase()) || r.description.toLowerCase().includes(resSearch.toLowerCase()))
    .sort((a, b) => resSort === "date" ? b.uploadDate.localeCompare(a.uploadDate) : a.name.localeCompare(b.name));

  /* ---- Announcement helpers ---- */
  const handlePostAnnouncement = () => {
    if (!annText.trim()) { toast({ title: "Enter announcement text", variant: "destructive" }); return; }
    const vis = annVisibility === "all" ? "All Students" : annVisibility;
    const total = annVisibility === "all" ? assignedStudents.length : 1;
    const newAnn: Announcement = {
      id: `a${Date.now()}`,
      text: annText.trim(),
      visibility: vis,
      attachmentName: annAttachment?.name,
      scheduledAt: annSchedule || undefined,
      createdAt: annSchedule || new Date().toISOString(),
      acknowledged: 0,
      total,
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    setAnnText("");
    setAnnVisibility("all");
    setAnnAttachment(null);
    setAnnSchedule("");
    toast({
      title: annSchedule ? "Announcement scheduled" : "Announcement posted",
      description: annSchedule ? `Scheduled for ${new Date(annSchedule).toLocaleString()}` : "Sent to students",
    });
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    toast({ title: "Announcement deleted" });
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

        {/* ======================== RESOURCES TAB ======================== */}
        <TabsContent value="resources" className="space-y-6">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upload Template / Guideline</CardTitle>
              <CardDescription>Share thesis-related documents with your students</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Drop zone */}
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
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
                    <p className="text-sm font-medium text-foreground">Drag & drop a file here or click to browse</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, PPTX, ZIP — Max 20 MB</p>
                  </>
                )}
                <input ref={fileRef} type="file" accept=".pdf,.docx,.pptx,.zip" className="hidden" onChange={(e) => { if (e.target.files?.[0]) setUploadFile(e.target.files[0]); }} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category / Tag</Label>
                  <Select value={uploadCat} onValueChange={setUploadCat}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Description (optional)</Label>
                  <Input placeholder="Brief description of this file" value={uploadDesc} onChange={(e) => setUploadDesc(e.target.value)} />
                </div>
              </div>

              <Button onClick={handleUpload} className="w-full sm:w-auto">
                <Plus size={16} /> Upload File
              </Button>
            </CardContent>
          </Card>

          {/* Resource Library */}
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
              {filteredResources.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No files match your filters.</p>
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
                              {fileIcon(r.type)}
                              <div>
                                <p className="font-medium text-sm text-foreground">{r.name}</p>
                                <p className="text-xs text-muted-foreground sm:hidden">{r.category} · {r.uploadDate}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell"><Badge variant="secondary">{r.category}</Badge></TableCell>
                          <TableCell className="hidden md:table-cell text-sm text-muted-foreground max-w-[200px] truncate">{r.description}</TableCell>
                          <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{r.uploadDate}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" title="Download" onClick={() => toast({ title: "Downloading…", description: r.name })}>
                                <Download size={16} />
                              </Button>
                              <Button variant="ghost" size="icon" title="Delete" onClick={() => deleteResource(r.id)} className="text-destructive hover:text-destructive">
                                <Trash2 size={16} />
                              </Button>
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

        {/* ==================== ANNOUNCEMENTS TAB ====================== */}
        <TabsContent value="announcements" className="space-y-6">
          {/* Compose */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Post Announcement</CardTitle>
              <CardDescription>Send notices to your assigned students</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Type your announcement here…"
                rows={4}
                value={annText}
                onChange={(e) => setAnnText(e.target.value)}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Visibility */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-1"><Users size={14} /> Visibility</Label>
                  <Select value={annVisibility} onValueChange={setAnnVisibility}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Assigned Students</SelectItem>
                      {assignedStudents.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {/* Attachment */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-1"><Paperclip size={14} /> Attachment</Label>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="w-full" onClick={() => annFileRef.current?.click()}>
                      {annAttachment ? annAttachment.name : "Attach file"}
                    </Button>
                    {annAttachment && <button onClick={() => setAnnAttachment(null)} className="text-muted-foreground hover:text-destructive"><X size={16} /></button>}
                  </div>
                  <input ref={annFileRef} type="file" className="hidden" onChange={(e) => { if (e.target.files?.[0]) setAnnAttachment(e.target.files[0]); }} />
                </div>

                {/* Schedule */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-1"><Calendar size={14} /> Schedule (optional)</Label>
                  <Input type="datetime-local" value={annSchedule} onChange={(e) => setAnnSchedule(e.target.value)} />
                </div>
              </div>

              <Button onClick={handlePostAnnouncement} className="w-full sm:w-auto">
                <Send size={16} /> {annSchedule ? "Schedule" : "Post Now"}
              </Button>
            </CardContent>
          </Card>

          {/* Feed */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Announcement Feed</CardTitle>
            </CardHeader>
            <CardContent>
              {announcements.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No announcements yet.</p>
              ) : (
                <div className="space-y-4">
                  {announcements.map((a) => {
                    const date = new Date(a.createdAt);
                    const isScheduled = a.scheduledAt && new Date(a.scheduledAt) > new Date();
                    return (
                      <div key={a.id} className="border border-border rounded-xl p-4 sm:p-5 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant={a.visibility === "All Students" ? "default" : "secondary"} className="gap-1">
                              {a.visibility === "All Students" ? <Users size={12} /> : <User size={12} />}
                              {a.visibility}
                            </Badge>
                            {isScheduled && <Badge variant="outline" className="gap-1 text-orange-600 border-orange-300"><Clock size={12} /> Scheduled</Badge>}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock size={12} /> {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </div>

                        <p className="text-sm text-foreground leading-relaxed">{a.text}</p>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-3 flex-wrap">
                            {a.attachmentName && (
                              <button className="flex items-center gap-1 text-xs text-primary hover:underline" onClick={() => toast({ title: "Downloading…", description: a.attachmentName })}>
                                <Paperclip size={12} /> {a.attachmentName}
                              </button>
                            )}
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Eye size={12} /> {a.acknowledged}/{a.total} acknowledged
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive h-7 text-xs" onClick={() => deleteAnnouncement(a.id)}>
                              <Trash2 size={14} /> Delete
                            </Button>
                          </div>
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
