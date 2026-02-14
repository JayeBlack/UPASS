import DashboardLayout from "@/components/DashboardLayout";
import { Upload, FileText, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";

const stages = ["Proposal", "Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Defense"];

const ThesisUpload = () => {
  const [currentStage] = useState(2);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const submissions = [
    { stage: "Proposal", date: "Oct 12, 2025", status: "Approved" },
    { stage: "Chapter 1", date: "Dec 5, 2025", status: "Approved" },
    { stage: "Chapter 2", date: "Jan 28, 2026", status: "Pending" },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-foreground">Thesis Submission</h1>
        <p className="text-muted-foreground mt-1">Track and upload your thesis chapters</p>
      </div>

      {/* Progress */}
      <div className="bg-card rounded-xl border border-border p-4 sm:p-6 mb-6">
        <h2 className="font-display text-lg font-bold text-foreground mb-4">Progress</h2>
        <div className="flex items-center gap-0.5 sm:gap-1 overflow-x-auto">
          {stages.map((s, i) => (
            <div key={s} className="flex-1 min-w-[40px] flex flex-col items-center">
              <div className={`w-full h-2 rounded-full mb-2 ${
                i < currentStage ? "gradient-gold" : i === currentStage ? "bg-secondary/50" : "bg-muted"
              }`} />
              <span className={`text-[10px] sm:text-xs text-center ${i <= currentStage ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                {s}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Upload */}
        <div className="bg-card rounded-xl border border-border p-4 sm:p-6">
          <h2 className="font-display text-lg font-bold text-foreground mb-4">Upload Chapter</h2>
          <div
            className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-secondary transition-colors"
            onClick={() => setSelectedFile("Chapter_3_Draft.pdf")}
          >
            <Upload size={32} className="mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-foreground font-medium">
              {selectedFile || "Click to upload or drag and drop"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">PDF, DOC up to 50MB</p>
          </div>
          {selectedFile && (
            <button className="mt-4 w-full py-3 rounded-lg gradient-gold text-secondary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
              Submit for Review
            </button>
          )}
        </div>

        {/* History */}
        <div className="bg-card rounded-xl border border-border p-4 sm:p-6">
          <h2 className="font-display text-lg font-bold text-foreground mb-4">Submission History</h2>
          <div className="space-y-3">
            {submissions.map((sub) => (
              <div key={sub.stage} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{sub.stage}</p>
                    <p className="text-xs text-muted-foreground">{sub.date}</p>
                  </div>
                </div>
                <span className={`flex items-center gap-1 text-xs font-medium ${
                  sub.status === "Approved" ? "text-success" : "text-warning"
                }`}>
                  {sub.status === "Approved" ? <CheckCircle size={14} /> : <Clock size={14} />}
                  {sub.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ThesisUpload;
