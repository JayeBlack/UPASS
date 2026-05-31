import DashboardLayout from "@/components/DashboardLayout";
import { BookOpen, CheckCircle, Lock } from "lucide-react";
import { useState } from "react";
import { PROGRAMME_COURSE_CATALOGS, type ProgrammeCourse } from "@/data/programmeCourses";

interface Course {
  code: string;
  name: string;
  credits: number;
  type: "core" | "elective";
  registered: boolean;
}

const toCourse = (c: ProgrammeCourse): Course => ({
  code: c.code,
  name: c.name,
  credits: c.credits,
  // Treat both 'core' and 'mandatory' (seminars/research) as required for the student
  type: c.category === "elective" ? "elective" : "core",
  registered: c.category !== "elective",
});

const CourseRegistration = () => {
  const [programmeKey, setProgrammeKey] = useState<string>(PROGRAMME_COURSE_CATALOGS[0].key);
  const catalog =
    PROGRAMME_COURSE_CATALOGS.find((c) => c.key === programmeKey) ?? PROGRAMME_COURSE_CATALOGS[0];
  const [coursesByProgramme, setCoursesByProgramme] = useState<Record<string, Course[]>>(() =>
    Object.fromEntries(
      PROGRAMME_COURSE_CATALOGS.map((c) => [c.key, c.courses.map(toCourse)])
    )
  );
  const courses = coursesByProgramme[catalog.key];

  const toggle = (code: string) => {
    setCoursesByProgramme((prev) => ({
      ...prev,
      [catalog.key]: prev[catalog.key].map((c) => {
        if (c.code !== code || c.type === "core") return c;
        return { ...c, registered: !c.registered };
      }),
    }));
  };

  const coreCourses = courses.filter((c) => c.type === "core");
  const electiveCourses = courses.filter((c) => c.type === "elective");
  const totalCredits = courses.filter((c) => c.registered).reduce((s, c) => s + c.credits, 0);
  const registeredCount = courses.filter((c) => c.registered).length;

  const renderDesktopTable = (items: Course[], showLock: boolean) => (
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
          {items.map((c) => (
            <tr key={c.code} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
              <td className="px-6 py-4 text-sm font-mono font-medium text-foreground">{c.code}</td>
              <td className="px-6 py-4 text-sm text-foreground">{c.name}</td>
              <td className="px-6 py-4 text-sm text-muted-foreground">{c.credits}</td>
              <td className="px-6 py-4 text-right">
                {showLock ? (
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium gradient-gold text-secondary-foreground">
                    <Lock size={12} /> Required
                  </span>
                ) : (
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
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderMobileCards = (items: Course[], showLock: boolean) => (
    <div className="md:hidden space-y-3">
      {items.map((c) => (
        <div key={c.code} className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-mono font-medium text-foreground">{c.code}</p>
              <p className="text-sm text-foreground mt-1">{c.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{c.credits} credits</p>
            </div>
            {showLock ? (
              <span className="shrink-0 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium gradient-gold text-secondary-foreground">
                <Lock size={12} /> Required
              </span>
            ) : (
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
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-foreground">Course Registration</h1>
        <p className="text-muted-foreground mt-1">Semester 1, 2025/2026 Academic Year</p>
      </div>

      <div className="mb-6 bg-card rounded-xl border border-border p-4">
        <label htmlFor="programme-select" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Programme
        </label>
        <select
          id="programme-select"
          value={programmeKey}
          onChange={(e) => setProgrammeKey(e.target.value)}
          className="w-full sm:w-auto bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {PROGRAMME_COURSE_CATALOGS.map((c) => (
            <option key={c.key} value={c.key}>{c.label}</option>
          ))}
        </select>
        {catalog.notes && catalog.notes.length > 0 && (
          <ul className="mt-3 text-xs text-muted-foreground list-disc list-inside space-y-1">
            {catalog.notes.map((n, i) => <li key={i}>{n}</li>)}
          </ul>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6">
        <div className="bg-card rounded-xl border border-border px-5 py-3 flex items-center gap-3">
          <BookOpen size={18} className="text-muted-foreground" />
          <span className="text-sm"><strong className="text-foreground">{totalCredits}</strong> <span className="text-muted-foreground">credit hours</span></span>
        </div>
        <div className="bg-card rounded-xl border border-border px-5 py-3 flex items-center gap-3">
          <CheckCircle size={18} className="text-muted-foreground" />
          <span className="text-sm"><strong className="text-foreground">{registeredCount}</strong> <span className="text-muted-foreground">courses selected</span></span>
        </div>
      </div>

      {/* Core Courses */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Lock size={16} className="text-muted-foreground" />
          <h2 className="font-display text-lg font-bold text-foreground">Core Courses</h2>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Required</span>
        </div>
        <p className="text-sm text-muted-foreground mb-4">These courses are mandatory for your program and cannot be removed.</p>
        {renderDesktopTable(coreCourses, true)}
        {renderMobileCards(coreCourses, true)}
      </div>

      {/* Elective Courses */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen size={16} className="text-muted-foreground" />
          <h2 className="font-display text-lg font-bold text-foreground">Elective Courses</h2>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Choose freely</span>
        </div>
        <p className="text-sm text-muted-foreground mb-4">Select any additional courses you'd like to take this semester.</p>
        {renderDesktopTable(electiveCourses, false)}
        {renderMobileCards(electiveCourses, false)}
      </div>
    </DashboardLayout>
  );
};

export default CourseRegistration;
