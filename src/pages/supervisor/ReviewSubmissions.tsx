import DashboardLayout from "@/components/DashboardLayout";
import { FileText, CheckCircle, Clock, Eye, Send, MessageSquare, ArrowLeft, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Submission {
  id: string;
  student: string;
  chapter: string;
  date: string;
  status: "Pending" | "Reviewed";
  fileUrl?: string;
}

interface Remark {
  id: string;
  submissionId: string;
  text: string;
  date: string;
  author: string;
}

const submissions: Submission[] = [
  { id: "sub1", student: "Kwame Mensah", chapter: "Chapter 3", date: "Feb 10, 2026", status: "Pending", fileUrl: "/placeholder.svg" },
  { id: "sub2", student: "Ama Serwaa", chapter: "Chapter 2", date: "Feb 8, 2026", status: "Pending", fileUrl: "/placeholder.svg" },
  { id: "sub3", student: "Efua Dankwah", chapter: "Chapter 4", date: "Feb 5, 2026", status: "Reviewed", fileUrl: "/placeholder.svg" },
  { id: "sub4", student: "Kofi Adjei", chapter: "Chapter 1", date: "Feb 3, 2026", status: "Reviewed", fileUrl: "/placeholder.svg" },
];

const initialRemarks: Remark[] = [
  { id: "r1", submissionId: "sub3", text: "Excellent analysis. Minor formatting corrections needed.", date: "Feb 6, 2026", author: "Dr. Abena Osei" },
  { id: "r2", submissionId: "sub4", text: "Introduction needs more context on problem statement.", date: "Feb 4, 2026", author: "Dr. Abena Osei" },
  { id: "r1b", submissionId: "sub1", text: "Please revisit your methodology section references.", date: "Feb 11, 2026", author: "Dr. Abena Osei" },
];

const ReviewSubmissions = () => {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [remarks, setRemarks] = useState<Remark[]>(initialRemarks);
  const [newRemark, setNewRemark] = useState("");

  const handleSendRemark = () => {
    if (!newRemark.trim() || !selectedSubmission) return;
    const remark: Remark = {
      id: `r${Date.now()}`,
      submissionId: selectedSubmission.id,
      text: newRemark.trim(),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      author: "Dr. Abena Osei",
    };
    setRemarks((prev) => [remark, ...prev]);
    setNewRemark("");
  };

  const submissionRemarks = selectedSubmission
    ? remarks.filter((r) => r.submissionId === selectedSubmission.id)
    : [];

  // ── Detail view (reviewing a submission) ──
  if (selectedSubmission) {
    return (
      <DashboardLayout>
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setSelectedSubmission(null); setNewRemark(""); }}
            className="mb-3 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={16} className="mr-1" /> Back to submissions
          </Button>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-3xl font-bold font-display text-foreground">
                {selectedSubmission.student}
              </h1>
              <p className="text-muted-foreground mt-1">
                {selectedSubmission.chapter} · Submitted {selectedSubmission.date}
              </p>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                selectedSubmission.status === "Pending"
                  ? "bg-warning/10 text-warning"
                  : "bg-success/10 text-success"
              }`}
            >
              {selectedSubmission.status === "Pending" ? <Clock size={12} /> : <CheckCircle size={12} />}
              {selectedSubmission.status}
            </span>
          </div>
        </div>

        {/* Document viewer */}
        <div className="bg-card rounded-xl border border-border overflow-hidden mb-6">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-muted/30">
            <FileText size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              {selectedSubmission.student.replace(" ", "_")}_{selectedSubmission.chapter.replace(" ", "_")}.pdf
            </span>
          </div>
          <div className="h-72 md:h-96 flex items-center justify-center bg-muted/10 text-muted-foreground text-sm">
            <div className="text-center space-y-2">
              <FileText size={48} className="mx-auto text-muted-foreground/40" />
              <p>Document preview will appear here</p>
              <p className="text-xs text-muted-foreground/60">PDF viewer integration coming soon</p>
            </div>
          </div>
        </div>

        {/* Remark input */}
        <div className="bg-card rounded-xl border border-border p-5 mb-6">
          <h2 className="font-display text-lg font-bold text-foreground mb-3">Add Remark</h2>
          <Textarea
            value={newRemark}
            onChange={(e) => setNewRemark(e.target.value)}
            placeholder="Type your feedback for this submission..."
            className="resize-none h-24 mb-3"
          />
          <div className="flex items-center gap-3">
            <Button
              onClick={handleSendRemark}
              disabled={!newRemark.trim()}
              className="gradient-gold text-secondary-foreground hover:opacity-90"
            >
              <Send size={14} className="mr-1.5" />
              Send Remark
            </Button>
            {/* Future: grade / approve buttons */}
          </div>
        </div>

        {/* Previous remarks */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-display text-lg font-bold text-foreground mb-4">
            Previous Remarks
            {submissionRemarks.length > 0 && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({submissionRemarks.length})
              </span>
            )}
          </h2>
          {submissionRemarks.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No remarks yet for this submission.</p>
          ) : (
            <ScrollArea className="max-h-72">
              <div className="space-y-3">
                {submissionRemarks.map((r) => (
                  <div key={r.id} className="p-4 rounded-lg bg-muted/50 border-l-4 border-secondary">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare size={14} className="text-secondary" />
                      <span className="text-sm font-medium text-foreground">{r.author}</span>
                      <span className="text-xs text-muted-foreground ml-auto">{r.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{r.text}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </DashboardLayout>
    );
  }

  // ── List view ──
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-foreground">Review Submissions</h1>
        <p className="text-muted-foreground mt-1">Pending and reviewed thesis submissions</p>
      </div>

      <div className="space-y-4">
        {submissions.map((sub) => (
          <div key={sub.id} className="bg-card rounded-xl border border-border p-5 flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${sub.status === "Pending" ? "bg-warning/10" : "bg-success/10"}`}>
                {sub.status === "Pending" ? <Clock size={18} className="text-warning" /> : <CheckCircle size={18} className="text-success" />}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{sub.student} — {sub.chapter}</p>
                <p className="text-xs text-muted-foreground">{sub.date}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedSubmission(sub)}
            >
              <Eye size={14} className="mr-1.5" />
              {sub.status === "Pending" ? "Review" : "View"}
            </Button>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default ReviewSubmissions;
