import DashboardLayout from "@/components/DashboardLayout";
import { Calendar, Clock, MapPin, Download, Filter } from "lucide-react";
import { useState } from "react";

const mockExams = [
  { code: "CS 601", name: "Advanced Database Systems", date: "2026-03-15", time: "09:00 AM", duration: "3 hrs", venue: "LT 1, Main Campus", type: "Written" },
  { code: "CS 603", name: "Research Methodology", date: "2026-03-18", time: "01:00 PM", duration: "2 hrs", venue: "LT 3, Main Campus", type: "Written" },
  { code: "CS 607", name: "Network Security", date: "2026-03-21", time: "09:00 AM", duration: "3 hrs", venue: "Computer Lab A", type: "Practical" },
  { code: "CS 611", name: "Data Mining & Analytics", date: "2026-03-24", time: "09:00 AM", duration: "3 hrs", venue: "LT 2, Main Campus", type: "Written" },
];

const ExamTimetable = () => {
  const [filter, setFilter] = useState<"all" | "Written" | "Practical">("all");

  const filtered = filter === "all" ? mockExams : mockExams.filter((e) => e.type === filter);

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">Exam Timetable</h1>
          <p className="text-muted-foreground mt-1">Semester 1, 2025/2026 End-of-Semester Examinations</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg gradient-gold text-secondary-foreground text-sm font-medium hover:opacity-90 transition-opacity self-start">
          <Download size={16} />
          Download PDF
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6">
        <Filter size={16} className="text-muted-foreground" />
        {(["all", "Written", "Practical"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === f
                ? "gradient-gold text-secondary-foreground"
                : "bg-card border border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {f === "all" ? "All" : f}
          </button>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Course</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Time</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Duration</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Venue</th>
              <th className="text-center px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr key={e.code} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm font-mono font-medium text-foreground">{e.code}</p>
                  <p className="text-xs text-muted-foreground">{e.name}</p>
                </td>
                <td className="px-6 py-4 text-sm text-foreground">{formatDate(e.date)}</td>
                <td className="px-6 py-4 text-sm text-foreground">{e.time}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{e.duration}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{e.venue}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    e.type === "Practical" ? "bg-info/10 text-info" : "bg-muted text-muted-foreground"
                  }`}>
                    {e.type}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filtered.map((e) => (
          <div key={e.code} className="bg-card rounded-xl border border-border p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-mono font-medium text-foreground">{e.code}</p>
                <p className="text-sm text-foreground mt-0.5">{e.name}</p>
              </div>
              <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${
                e.type === "Practical" ? "bg-info/10 text-info" : "bg-muted text-muted-foreground"
              }`}>
                {e.type}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar size={12} />
                {formatDate(e.date)}
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock size={12} />
                {e.time} · {e.duration}
              </div>
              <div className="col-span-2 flex items-center gap-1.5 text-muted-foreground">
                <MapPin size={12} />
                {e.venue}
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default ExamTimetable;
