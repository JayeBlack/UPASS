// Programme-specific course catalog (UMaT SPS)
// Populated progressively from official UMaT postgraduate programme documents.
// Add new departments/programmes here as their course lists become available.

export type CourseCategory = "core" | "elective" | "mandatory";

export interface ProgrammeCourse {
  code: string;
  name: string;
  credits: number;
  category: CourseCategory; // core = required taught, mandatory = seminar/research, elective = optional
}

export interface ProgrammeCourseCatalog {
  /** Unique key, e.g. "geomatic-msc" */
  key: string;
  /** Display name shown in selectors */
  label: string;
  department: string;
  /** Degree levels these courses apply to */
  levels: string[];
  courses: ProgrammeCourse[];
  /** Optional notes shown to the student (graduation requirements, prerequisites, etc.) */
  notes?: string[];
}

// Default credit weighting where the source document does not specify
const C = 3;

// ─── Geomatic Engineering ────────────────────────────────────────────────
// Source: UMaT SPS — Faculty of Geoscience and Environmental Studies,
// Geomatic Engineering Department postgraduate programmes.

const GEOMATIC_MSC_MPHIL: ProgrammeCourseCatalog = {
  key: "geomatic-msc-mphil",
  label: "Geomatic Engineering (MSc / MPhil)",
  department: "Geomatic Engineering",
  levels: ["MSc", "MPhil"],
  notes: [
    "Applicants without a Geomatic Engineering background must take and pass Introduction to Geomatics Engineering as a prerequisite.",
  ],
  courses: [
    // Mandatory seminar
    { code: "GM 550", name: "MSc/MPhil Seminar", credits: C, category: "mandatory" },
    // Core (compulsory taught)
    { code: "GM 473", name: "Computer Applications in Geomatic Engineering", credits: C, category: "core" },
    { code: "GM 555", name: "Statistical Models", credits: C, category: "core" },
    { code: "GM 571", name: "Geographic Information Systems", credits: C, category: "core" },
    { code: "GM 572", name: "Digital Photogrammetry", credits: C, category: "core" },
    { code: "GM 573", name: "Remote Sensing", credits: C, category: "core" },
    { code: "GM 578", name: "Global Navigation Satellite Systems", credits: C, category: "core" },
    { code: "GM 592", name: "Engineering Surveying", credits: C, category: "core" },
    // Electives
    { code: "GM 554", name: "Mine Economic and Financial Evaluation", credits: C, category: "elective" },
    { code: "GM 575", name: "Fleet Management", credits: C, category: "elective" },
    { code: "GM 576", name: "Environmental and Spatial Statistics", credits: C, category: "elective" },
    { code: "GM 577", name: "Land Administration and Information Systems", credits: C, category: "elective" },
    { code: "GM 579", name: "Shoreline Change Modelling and Prediction", credits: C, category: "elective" },
    { code: "GM 581", name: "Artificial Intelligence Application in Geomatic Engineering", credits: C, category: "elective" },
    { code: "GM 582", name: "GIS Modelling and Decision Support Systems", credits: C, category: "elective" },
    { code: "GM 583", name: "Geographic Data for Resource Management", credits: C, category: "elective" },
    { code: "GM 586", name: "Geographic Information Management", credits: C, category: "elective" },
    { code: "GM 587", name: "Advanced Least Squares Adjustment", credits: C, category: "elective" },
    { code: "GM 588", name: "Mine and Subsurface Surveying", credits: C, category: "elective" },
    { code: "GM 589", name: "Coastal Planning", credits: C, category: "elective" },
    { code: "GM 594", name: "Applications of GIS and Remote Sensing", credits: C, category: "elective" },
    { code: "GM 598", name: "Drone Technology and Application", credits: C, category: "elective" },
  ],
};

const GEOMATIC_PHD: ProgrammeCourseCatalog = {
  key: "geomatic-phd",
  label: "Geomatic Engineering (PhD)",
  department: "Geomatic Engineering",
  levels: ["PhD"],
  notes: [
    "GM 656 University Teaching Experience is compulsory only for UMaT staff pursuing PhD.",
  ],
  courses: [
    { code: "GM 551", name: "Research Methods", credits: C, category: "mandatory" },
    { code: "GM 650", name: "PhD Seminar I", credits: C, category: "mandatory" },
    { code: "GM 660", name: "PhD Seminar II", credits: C, category: "mandatory" },
    { code: "GM 655", name: "Individual Studies", credits: C, category: "mandatory" },
    { code: "GM 656", name: "University Teaching Experience", credits: C, category: "mandatory" },
  ],
};

export const PROGRAMME_COURSE_CATALOGS: ProgrammeCourseCatalog[] = [
  GEOMATIC_MSC_MPHIL,
  GEOMATIC_PHD,
  // EEE catalogs appended below
];

export const getCatalogByKey = (key: string) =>
  PROGRAMME_COURSE_CATALOGS.find((c) => c.key === key);

export const getCatalogsByDepartment = (department: string) =>
  PROGRAMME_COURSE_CATALOGS.filter((c) => c.department === department);
