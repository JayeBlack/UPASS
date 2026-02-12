import DashboardLayout from "@/components/DashboardLayout";
import { FileText, CheckCircle, Clock, Eye } from "lucide-react";

const submissions = [
  { student: "Kwame Mensah", chapter: "Chapter 3", date: "Feb 10, 2026", status: "Pending" },
  { student: "Ama Serwaa", chapter: "Chapter 2", date: "Feb 8, 2026", status: "Pending" },
  { student: "Efua Dankwah", chapter: "Chapter 4", date: "Feb 5, 2026", status: "Reviewed" },
  { student: "Kofi Adjei", chapter: "Chapter 1", date: "Feb 3, 2026", status: "Reviewed" },
];

const ReviewSubmissions = () => (
  <DashboardLayout>
    <div className="mb-8">
      <h1 className="text-3xl font-bold font-display text-foreground">Review Submissions</h1>
      <p className="text-muted-foreground mt-1">Pending and reviewed thesis submissions</p>
    </div>

    <div className="space-y-4">
      {submissions.map((sub, i) => (
        <div key={i} className="bg-card rounded-xl border border-border p-5 flex items-center justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${sub.status === "Pending" ? "bg-warning/10" : "bg-success/10"}`}>
              {sub.status === "Pending" ? <Clock size={18} className="text-warning" /> : <CheckCircle size={18} className="text-success" />}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{sub.student} — {sub.chapter}</p>
              <p className="text-xs text-muted-foreground">{sub.date}</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors">
            <Eye size={14} />
            {sub.status === "Pending" ? "Review" : "View"}
          </button>
        </div>
      ))}
    </div>
  </DashboardLayout>
);

export default ReviewSubmissions;
