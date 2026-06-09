import DashboardLayout from "@/components/DashboardLayout";
import { BookOpen, CheckCircle, Lock, Building2, CalendarDays, GraduationCap } from "lucide-react";
import { useMemo, useState } from "react";
import { PROGRAMME_COURSE_CATALOGS, type ProgrammeCourse } from "@/data/programmeCourses";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user } = useAuth();
  
  // Get student's enrolled data from auth context
  const studentDepartment = user?.department;
  const studentProgram = user?.program;
  const studentCohort = user?.admissionCycle || "January";

  // If student data is not loaded, show loading or error state
  if (!studentDepartment || !studentProgram) {
    return (
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display text-foreground">Course Registration</h1>
          <p className="text-muted-foreground mt-1">Semester 1, 2025/2026 Academic Year</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-8 text-center">
          <p className="text-muted-foreground mb-4">Loading your programme information...</p>
          {user && (
            <div className="text-left bg-muted p-4 rounded-lg mb-4">
              <p className="text-xs font-mono mb-2">Debug Info:</p>
              <p className="text-xs">Email: {user.email}</p>
              <p className="text-xs">Role: {user.role}</p>
              <p className="text-xs">Department: {studentDepartment || "(not set)"}</p>
              <p className="text-xs">Programme: {studentProgram || "(not set)"}</p>
              <p className="text-xs">Cohort: {studentCohort}</p>
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            {!studentDepartment && !studentProgram 
              ? "Your programme information is missing. Please contact your administrator to set up your profile."
              : "If this persists, try logging out and logging in again."}
          </p>
        </div>
      </DashboardLayout>
    );
  }

  // Helper function for fuzzy matching programme names
  const matchesProgramme = (catalogLabel: string, studentProg: string) => {
    const normalizeName = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const normalizedCatalog = normalizeName(catalogLabel);
    const normalizedStudent = normalizeName(studentProg);
    
    // Exact match
    if (normalizedCatalog === normalizedStudent) return true;
    
    // Check if catalog contains student program (e.g., "Mining Engineering (MSc / MPhil) — July" contains "MSc. Mining Engineering")
    if (normalizedCatalog.includes(normalizedStudent)) return true;
    
    // Check if student program contains catalog (e.g., "MSc. Mining Engineering" contains "Mining Engineering")
    if (normalizedStudent.includes(normalizedCatalog)) return true;
    
    // Extract key words and check overlap
    const catalogWords = catalogLabel.toLowerCase().split(/[\s/()—.]+/).filter(w => w.length > 2 && !['msc', 'mphil', 'phd', 'july', 'january', 'and', 'the'].includes(w));
    const studentWords = studentProg.toLowerCase().split(/[\s/()—.]+/).filter(w => w.length > 2 && !['msc', 'mphil', 'phd', 'july', 'january', 'and', 'the'].includes(w));
    
    // If at least 70% of student words appear in catalog words, it's a match
    const matchingWords = studentWords.filter(sw => catalogWords.some(cw => cw.includes(sw) || sw.includes(cw)));
    return matchingWords.length >= Math.ceil(studentWords.length * 0.7);
  };

  // Find the catalog entry that matches the student's enrollment
  const catalog = useMemo(() => {
    // Try exact match first (department + program + cohort)
    let match = PROGRAMME_COURSE_CATALOGS.find(
      (c) => 
        c.department === studentDepartment && 
        c.label === studentProgram &&
        (c.admissionCycle ?? "January") === studentCohort
    );
    if (match) return match;

    // Try fuzzy match with department + cohort
    match = PROGRAMME_COURSE_CATALOGS.find(
      (c) => 
        c.department === studentDepartment && 
        matchesProgramme(c.label, studentProgram) &&
        (c.admissionCycle ?? "January") === studentCohort
    );
    if (match) return match;

    // Try fuzzy match without cohort (for programs without cohort-specific catalogs)
    match = PROGRAMME_COURSE_CATALOGS.find(
      (c) => 
        c.department === studentDepartment && 
        matchesProgramme(c.label, studentProgram)
    );
    if (match) return match;

    // Last resort: match by department only (show first catalog for that department)
    return PROGRAMME_COURSE_CATALOGS.find(c => c.department === studentDepartment);
  }, [studentDepartment, studentProgram, studentCohort]);

  // If no catalog found, show error message
  if (!catalog) {
    return (
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display text-foreground">Course Registration</h1>
          <p className="text-muted-foreground mt-1">Semester 1, 2025/2026 Academic Year</p>
        </div>
        <div className="bg-card rounded-xl border border-destructive p-8 text-center">
          <p className="text-destructive font-medium mb-2">Course catalog not found</p>
          <p className="text-sm text-muted-foreground mb-4">
            Your programme: <strong>{studentProgram}</strong><br />
            Department: <strong>{studentDepartment}</strong><br />
            Cohort: <strong>{studentCohort}</strong>
          </p>
          <p className="text-xs text-muted-foreground">Please contact your department administrator to set up the course catalog for your programme.</p>
        </div>
      </DashboardLayout>
    );
  }

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

      {/* Student's Enrolled Programme Info - Read Only */}
      <div className="mb-6 bg-card rounded-xl border border-border p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-3">
          <GraduationCap size={16} className="text-muted-foreground" />
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Your Enrolled Programme</h3>
        </div>
        
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="bg-muted/30 rounded-lg p-3">
            <label className="text-xs text-muted-foreground mb-1 block">Department</label>
            <p className="text-sm font-medium text-foreground">{studentDepartment}</p>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-3">
            <label className="text-xs text-muted-foreground mb-1 block">Programme</label>
            <p className="text-sm font-medium text-foreground">{studentProgram}</p>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-3">
            <label className="text-xs text-muted-foreground mb-1 block">Admission Cohort</label>
            <p className="text-sm font-medium text-foreground">{studentCohort === "January" ? "January - June" : "July - December"}</p>
          </div>
        </div>

        {/* Programme details */}
        <div className="mt-4 rounded-lg border border-border bg-muted/30 p-3">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-primary/10 text-primary">
              <Building2 size={11} /> {catalog.department}
            </span>
            {catalog.admissionCycle && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold gradient-gold text-secondary-foreground">
                <CalendarDays size={11} /> {catalog.admissionCycle} intake
              </span>
            )}
            {catalog.levels?.map((lvl) => (
              <span key={lvl} className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium border border-border text-muted-foreground">
                {lvl}
              </span>
            ))}
          </div>
          <p className="text-sm font-semibold text-foreground">{catalog.label}</p>
          {catalog.notes && catalog.notes.length > 0 && (
            <ul className="mt-2 text-xs text-muted-foreground list-disc list-inside space-y-1">
              {catalog.notes.map((n, i) => <li key={i}>{n}</li>)}
            </ul>
          )}
        </div>
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
