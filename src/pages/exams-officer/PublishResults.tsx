import DashboardLayout from "@/components/DashboardLayout";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Send, Eye, CheckCircle, Clock } from "lucide-react";

interface ResultBatch {
  id: string;
  semester: string;
  year: string;
  department: string;
  program: string;
  studentCount: number;
  status: "Draft" | "Published";
  publishedAt?: string;
}

const mockBatches: ResultBatch[] = [
  { id: "b1", semester: "Semester 1", year: "2024/2025", department: "Computer Science", program: "MSc. IT", studentCount: 28, status: "Published", publishedAt: "2025-02-15" },
  { id: "b2", semester: "Semester 1", year: "2024/2025", department: "Mining Engineering", program: "MSc. Mining Eng", studentCount: 15, status: "Published", publishedAt: "2025-02-16" },
  { id: "b3", semester: "Semester 2", year: "2024/2025", department: "Computer Science", program: "MPhil CS", studentCount: 12, status: "Draft" },
  { id: "b4", semester: "Semester 2", year: "2024/2025", department: "Electrical Engineering", program: "MSc. Electrical Eng", studentCount: 9, status: "Draft" },
  { id: "b5", semester: "Semester 2", year: "2024/2025", department: "Mechanical Engineering", program: "MSc. Mechanical Eng", studentCount: 11, status: "Draft" },
];

const PublishResults = () => {
  const [batches, setBatches] = useState(mockBatches);
  const { toast } = useToast();

  const publish = (id: string) => {
    setBatches((prev) =>
      prev.map((b) => b.id === id ? { ...b, status: "Published" as const, publishedAt: new Date().toISOString().split("T")[0] } : b)
    );
    toast({ title: "Results published", description: "Students can now view their results on the portal" });
  };

  const drafts = batches.filter((b) => b.status === "Draft");
  const published = batches.filter((b) => b.status === "Published");

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-foreground">Publish Results</h1>
        <p className="text-muted-foreground mt-1">Review and publish result batches to student portals</p>
      </div>

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
                    <h3 className="font-semibold text-foreground">{b.program}</h3>
                    <p className="text-sm text-muted-foreground">{b.department}</p>
                  </div>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground">Draft</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span>{b.semester} • {b.year}</span>
                  <span>{b.studentCount} students</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => publish(b.id)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg gradient-gold text-secondary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                    <Send size={14} /> Publish
                  </button>
                  <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors">
                    <Eye size={14} /> Preview
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
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">Programme</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">Department</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">Semester</th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">Students</th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">Published</th>
              </tr>
            </thead>
            <tbody>
              {published.map((b) => (
                <tr key={b.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{b.program}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{b.department}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{b.semester} • {b.year}</td>
                  <td className="px-6 py-4 text-sm text-center text-foreground">{b.studentCount}</td>
                  <td className="px-6 py-4 text-sm text-center text-muted-foreground">{b.publishedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PublishResults;
