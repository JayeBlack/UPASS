import DashboardLayout from "@/components/DashboardLayout";
import { BookOpen, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";

const mockCourses = [
  { code: "CS 601", name: "Advanced Database Systems", credits: 3, registered: false },
  { code: "CS 603", name: "Research Methodology", credits: 3, registered: true },
  { code: "CS 605", name: "Machine Learning", credits: 3, registered: false },
  { code: "CS 607", name: "Network Security", credits: 3, registered: true },
  { code: "CS 609", name: "Software Engineering II", credits: 3, registered: false },
  { code: "CS 611", name: "Data Mining & Analytics", credits: 3, registered: true },
];

const CourseRegistration = () => {
  const [courses, setCourses] = useState(mockCourses);

  const toggle = (code: string) => {
    setCourses((prev) =>
      prev.map((c) => (c.code === code ? { ...c, registered: !c.registered } : c))
    );
  };

  const totalCredits = courses.filter((c) => c.registered).reduce((s, c) => s + c.credits, 0);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-foreground">Course Registration</h1>
        <p className="text-muted-foreground mt-1">Semester 1, 2025/2026 Academic Year</p>
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6">
        <div className="bg-card rounded-xl border border-border px-5 py-3 flex items-center gap-3">
          <BookOpen size={18} className="text-muted-foreground" />
          <span className="text-sm"><strong className="text-foreground">{totalCredits}</strong> <span className="text-muted-foreground">credit hours</span></span>
        </div>
        <div className="bg-card rounded-xl border border-border px-5 py-3 flex items-center gap-3">
          <CheckCircle size={18} className="text-muted-foreground" />
          <span className="text-sm"><strong className="text-foreground">{courses.filter(c => c.registered).length}</strong> <span className="text-muted-foreground">courses selected</span></span>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Code</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Course Name</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Credits</th>
              <th className="text-right px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c.code} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 text-sm font-mono font-medium text-foreground">{c.code}</td>
                <td className="px-6 py-4 text-sm text-foreground">{c.name}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{c.credits}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => toggle(c.code)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      c.registered
                        ? "gradient-gold text-secondary-foreground"
                        : "border border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {c.registered ? "Registered" : "Register"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {courses.map((c) => (
          <div key={c.code} className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-mono font-medium text-foreground">{c.code}</p>
                <p className="text-sm text-foreground mt-1">{c.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{c.credits} credits</p>
              </div>
              <button
                onClick={() => toggle(c.code)}
                className={`shrink-0 px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  c.registered
                    ? "gradient-gold text-secondary-foreground"
                    : "border border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                {c.registered ? "Registered" : "Register"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default CourseRegistration;
