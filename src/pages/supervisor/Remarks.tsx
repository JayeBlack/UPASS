import DashboardLayout from "@/components/DashboardLayout";
import { MessageSquare, Send } from "lucide-react";
import { useState } from "react";

const remarks = [
  { student: "Kwame Mensah", chapter: "Chapter 2", remark: "Good literature review. Expand on methodology section.", date: "Jan 30, 2026" },
  { student: "Ama Serwaa", chapter: "Chapter 1", remark: "Introduction needs more context on problem statement.", date: "Jan 25, 2026" },
  { student: "Efua Dankwah", chapter: "Chapter 3", remark: "Excellent analysis. Minor formatting corrections needed.", date: "Jan 20, 2026" },
];

const Remarks = () => {
  const [newRemark, setNewRemark] = useState("");

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-foreground">Remarks & Feedback</h1>
        <p className="text-muted-foreground mt-1">Provide feedback on student submissions</p>
      </div>

      {/* Add remark */}
      <div className="bg-card rounded-xl border border-border p-6 mb-6">
        <h2 className="font-display text-lg font-bold text-foreground mb-4">New Remark</h2>
        <textarea
          value={newRemark}
          onChange={(e) => setNewRemark(e.target.value)}
          placeholder="Type your remark or feedback here..."
          className="w-full p-4 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none h-24"
        />
        <button className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg gradient-gold text-secondary-foreground font-medium text-sm hover:opacity-90 transition-opacity">
          <Send size={14} />
          Send Remark
        </button>
      </div>

      {/* History */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="font-display text-lg font-bold text-foreground mb-4">Previous Remarks</h2>
        <div className="space-y-4">
          {remarks.map((r, i) => (
            <div key={i} className="p-4 rounded-lg bg-muted/50 border-l-4 border-secondary">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare size={14} className="text-secondary" />
                <span className="text-sm font-medium text-foreground">{r.student} — {r.chapter}</span>
                <span className="text-xs text-muted-foreground ml-auto">{r.date}</span>
              </div>
              <p className="text-sm text-muted-foreground">{r.remark}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Remarks;
