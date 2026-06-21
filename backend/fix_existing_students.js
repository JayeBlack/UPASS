const db = require("./src/db");

// Same catalog as studentController.js
const PROGRAMME_COURSES = {
  "Mining Engineering": {
    July: [
      { code: "MN 261", name: "Introduction to Mining Engineering", credits: 3, type: "core" },
      { code: "MN 551", name: "Research Methods", credits: 3, type: "mandatory" },
      { code: "MN 553", name: "Operations Research", credits: 3, type: "core" },
      { code: "MN 554", name: "Mine Economic and Financial Evaluation", credits: 3, type: "core" },
      { code: "MN 555", name: "Statistical Models", credits: 3, type: "core" },
      { code: "MN 556", name: "Labwork/Fieldwork and Report", credits: 3, type: "mandatory" },
      { code: "MN 557", name: "Environmental Management", credits: 3, type: "core" },
      { code: "MN 559", name: "Applied Rock Mechanics", credits: 3, type: "core" },
      { code: "MN 563", name: "Data Mining and Advanced Analysis", credits: 3, type: "core" },
      { code: "MN 655", name: "Individual Studies", credits: 3, type: "mandatory" },
      { code: "MN 656", name: "University Teaching Experience", credits: 3, type: "mandatory" },
    ],
    January: [
      { code: "MN 261", name: "Introduction to Mining Engineering", credits: 3, type: "core" },
      { code: "MN 551", name: "Research Methods", credits: 3, type: "mandatory" },
      { code: "MN 553", name: "Operations Research", credits: 3, type: "core" },
      { code: "MN 554", name: "Mine Economic and Financial Evaluation", credits: 3, type: "core" },
      { code: "MN 555", name: "Statistical Models", credits: 3, type: "core" },
      { code: "MN 556", name: "Labwork/Fieldwork and Report", credits: 3, type: "mandatory" },
      { code: "MN 557", name: "Environmental Management", credits: 3, type: "core" },
      { code: "MN 559", name: "Applied Rock Mechanics", credits: 3, type: "core" },
      { code: "MN 563", name: "Data Mining and Advanced Analysis", credits: 3, type: "core" },
      { code: "MN 655", name: "Individual Studies", credits: 3, type: "mandatory" },
      { code: "MN 656", name: "University Teaching Experience", credits: 3, type: "mandatory" },
    ],
  },
  "Geomatic Engineering": {
    January: [
      { code: "GM 550", name: "MSc/MPhil Seminar", credits: 3, type: "mandatory" },
      { code: "GM 473", name: "Computer Applications in Geomatic Engineering", credits: 3, type: "core" },
      { code: "GM 555", name: "Statistical Models", credits: 3, type: "core" },
      { code: "GM 571", name: "Geographic Information Systems", credits: 3, type: "core" },
      { code: "GM 572", name: "Digital Photogrammetry", credits: 3, type: "core" },
      { code: "GM 573", name: "Remote Sensing", credits: 3, type: "core" },
      { code: "GM 578", name: "Global Navigation Satellite Systems", credits: 3, type: "core" },
      { code: "GM 592", name: "Engineering Surveying", credits: 3, type: "core" },
    ],
    July: [
      { code: "GM 550", name: "MSc/MPhil Seminar", credits: 3, type: "mandatory" },
      { code: "GM 473", name: "Computer Applications in Geomatic Engineering", credits: 3, type: "core" },
      { code: "GM 555", name: "Statistical Models", credits: 3, type: "core" },
      { code: "GM 571", name: "Geographic Information Systems", credits: 3, type: "core" },
      { code: "GM 572", name: "Digital Photogrammetry", credits: 3, type: "core" },
      { code: "GM 573", name: "Remote Sensing", credits: 3, type: "core" },
      { code: "GM 578", name: "Global Navigation Satellite Systems", credits: 3, type: "core" },
      { code: "GM 592", name: "Engineering Surveying", credits: 3, type: "core" },
    ],
  },
  "Electrical and Electronic Engineering": {
    January: [
      { code: "EL 500", name: "Thesis", credits: 3, type: "mandatory" },
      { code: "EL 551", name: "Research Methods", credits: 3, type: "mandatory" },
      { code: "EL 556", name: "Field/Laboratory Work", credits: 3, type: "mandatory" },
      { code: "EL 560", name: "Engineering Economics", credits: 3, type: "core" },
      { code: "EL 571", name: "Modelling and Simulation", credits: 3, type: "core" },
      { code: "EL 572", name: "Advanced Signal Processing", credits: 3, type: "core" },
      { code: "EL 574", name: "Microprocessor Systems", credits: 3, type: "core" },
      { code: "EL 575", name: "Power System Planning, Protection and Operations", credits: 3, type: "core" },
      { code: "EL 579", name: "Computer Control Systems", credits: 3, type: "core" },
      { code: "EL 586", name: "Mobile Communication Systems", credits: 3, type: "core" },
    ],
    July: [
      { code: "EL 500", name: "Thesis", credits: 3, type: "mandatory" },
      { code: "EL 551", name: "Research Methods", credits: 3, type: "mandatory" },
      { code: "EL 556", name: "Field/Laboratory Work", credits: 3, type: "mandatory" },
      { code: "EL 401", name: "MATLAB/Simulink for Engineers", credits: 3, type: "core" },
      { code: "EL 403", name: "Introduction to Computer Applications", credits: 3, type: "core" },
      { code: "EL 405", name: "Numerical Methods", credits: 3, type: "core" },
      { code: "EL 407", name: "Probability and Statistics for Engineers", credits: 3, type: "core" },
      { code: "EL 560", name: "Engineering Economics", credits: 3, type: "core" },
      { code: "EL 571", name: "Modelling and Simulation", credits: 3, type: "core" },
      { code: "EL 572", name: "Advanced Signal Processing", credits: 3, type: "core" },
      { code: "EL 574", name: "Microprocessor Systems", credits: 3, type: "core" },
      { code: "EL 575", name: "Power System Planning, Protection and Operations", credits: 3, type: "core" },
      { code: "EL 579", name: "Computer Control Systems", credits: 3, type: "core" },
    ],
  },
  "Mechanical Engineering": {
    January: [
      { code: "MC 551", name: "Research Methods", credits: 3, type: "mandatory" },
      { code: "MC 556", name: "Field/Laboratory Work", credits: 3, type: "mandatory" },
    ],
    July: [
      { code: "MC 551", name: "Research Methods", credits: 3, type: "mandatory" },
      { code: "MC 556", name: "Field/Laboratory Work", credits: 3, type: "mandatory" },
    ],
  },
  "Mathematical Sciences": {
    July: [
      { code: "MA 500", name: "Thesis", credits: 3, type: "mandatory" },
      { code: "MA 551", name: "Research Methods", credits: 3, type: "mandatory" },
      { code: "MA 553", name: "Operations Research", credits: 3, type: "core" },
      { code: "MA 573", name: "Time Series and Forecasting", credits: 3, type: "core" },
      { code: "MA 275", name: "Numerical Methods", credits: 3, type: "core" },
      { code: "MA 579", name: "Computer Programming", credits: 3, type: "core" },
    ],
    January: [
      { code: "MA 500", name: "Thesis", credits: 3, type: "mandatory" },
      { code: "MA 551", name: "Research Methods", credits: 3, type: "mandatory" },
      { code: "MA 556", name: "Labwork/Fieldwork and Report", credits: 3, type: "mandatory" },
      { code: "MA 275", name: "Numerical Methods", credits: 3, type: "core" },
      { code: "MA 553", name: "Operations Research", credits: 3, type: "core" },
      { code: "MA 571", name: "Numerical Methods for Linear and Nonlinear Equations", credits: 3, type: "core" },
      { code: "MA 573", name: "Time Series and Forecasting", credits: 3, type: "core" },
      { code: "MA 577", name: "Advanced Probability and Statistics", credits: 3, type: "core" },
      { code: "MA 579", name: "Computer Programming", credits: 3, type: "core" },
    ],
  },
  "Minerals Engineering": {
    January: [
      { code: "MR 554", name: "Economic and Financial Evaluation", credits: 3, type: "core" },
      { code: "MR 556", name: "Labwork/Fieldwork and Report", credits: 3, type: "mandatory" },
      { code: "MR 576", name: "Mineral Process Design and Control", credits: 3, type: "core" },
      { code: "MR 579", name: "Aqueous Processes in Mineral Engineering", credits: 3, type: "core" },
    ],
    July: [
      { code: "MR 554", name: "Economic and Financial Evaluation", credits: 3, type: "core" },
      { code: "MR 556", name: "Labwork/Fieldwork and Report", credits: 3, type: "mandatory" },
      { code: "MR 576", name: "Mineral Process Design and Control", credits: 3, type: "core" },
      { code: "MR 579", name: "Aqueous Processes in Mineral Engineering", credits: 3, type: "core" },
    ],
  },
  "Geological Engineering": {
    January: [
      { code: "GL 551", name: "Research Methods", credits: 3, type: "mandatory" },
      { code: "GL 556", name: "Labwork/Fieldwork and Report", credits: 3, type: "mandatory" },
      { code: "GL 553", name: "Operations Research", credits: 3, type: "core" },
      { code: "GL 554", name: "Mine Economic and Financial Evaluation", credits: 3, type: "core" },
      { code: "GL 555", name: "Statistical Models", credits: 3, type: "core" },
      { code: "GL 557", name: "Environmental Management", credits: 3, type: "core" },
      { code: "GL 561", name: "Computer Applications in Geological Engineering", credits: 3, type: "core" },
      { code: "GL 574", name: "Remote Sensing and GIS", credits: 3, type: "core" },
      { code: "GL 579", name: "Applied Artificial Intelligence in Geological Engineering", credits: 3, type: "core" },
    ],
    July: [
      { code: "GL 551", name: "Research Methods", credits: 3, type: "mandatory" },
      { code: "GL 553", name: "Operations Research", credits: 3, type: "core" },
      { code: "GL 554", name: "Mine Economic and Financial Evaluation", credits: 3, type: "core" },
      { code: "GL 555", name: "Statistical Models", credits: 3, type: "core" },
      { code: "GL 561", name: "Computer Applications in Geological Engineering", credits: 3, type: "core" },
      { code: "GL 574", name: "Remote Sensing and GIS", credits: 3, type: "core" },
      { code: "GL 579", name: "Applied Artificial Intelligence in Geological Engineering", credits: 3, type: "core" },
    ],
  },
  "Petroleum Engineering": {
    January: [
      { code: "PE 500", name: "Thesis", credits: 3, type: "mandatory" },
      { code: "PE 550", name: "Graduate Seminar", credits: 3, type: "mandatory" },
      { code: "PE 556", name: "Labwork/Fieldwork and Report", credits: 3, type: "mandatory" },
    ],
    July: [
      { code: "PE 500", name: "Thesis", credits: 3, type: "mandatory" },
      { code: "PE 550", name: "Graduate Seminar", credits: 3, type: "mandatory" },
      { code: "PE 556", name: "Labwork/Fieldwork and Report", credits: 3, type: "mandatory" },
    ],
  },
  "Computer Science and Engineering": {
    January: [
      { code: "CE 500", name: "MSc Thesis", credits: 21, type: "mandatory" },
      { code: "CE 550", name: "MSc Seminar", credits: 3, type: "mandatory" },
      { code: "CE 551", name: "Research Methods", credits: 3, type: "mandatory" },
      { code: "CE 556", name: "Field/Laboratory Work", credits: 3, type: "mandatory" },
      { code: "CE 571", name: "Very Large Scale Integration (VLSI)", credits: 3, type: "core" },
      { code: "CE 573", name: "Optimisation Methods and Applications", credits: 3, type: "core" },
      { code: "CE 575", name: "Realtime Systems", credits: 3, type: "core" },
      { code: "CE 577", name: "Parallel Computing", credits: 3, type: "core" },
      { code: "CE 579", name: "Data Mining", credits: 3, type: "core" },
      { code: "CE 589", name: "Information Theory and Coding", credits: 3, type: "core" },
    ],
    July: [
      { code: "CE 500", name: "MSc Thesis", credits: 21, type: "mandatory" },
      { code: "CE 550", name: "MSc Seminar", credits: 3, type: "mandatory" },
      { code: "CE 551", name: "Research Methods", credits: 3, type: "mandatory" },
      { code: "CE 556", name: "Field/Laboratory Work", credits: 3, type: "mandatory" },
      { code: "CE 571", name: "Very Large Scale Integration (VLSI)", credits: 3, type: "core" },
      { code: "CE 573", name: "Optimisation Methods and Applications", credits: 3, type: "core" },
      { code: "CE 575", name: "Realtime Systems", credits: 3, type: "core" },
      { code: "CE 577", name: "Parallel Computing", credits: 3, type: "core" },
      { code: "CE 579", name: "Data Mining", credits: 3, type: "core" },
      { code: "CE 589", name: "Information Theory and Coding", credits: 3, type: "core" },
    ],
  },
  "Environmental and Safety Engineering": {
    July: [
      { code: "HS 501", name: "Introduction to Occupational Health & Safety Management (prerequisite)", credits: 3, type: "core" },
      { code: "HS 573", name: "Occupational Health & Safety Management Systems", credits: 3, type: "core" },
      { code: "HS 571", name: "Occupational Health & Safety Law and Policy", credits: 3, type: "core" },
      { code: "HS 551", name: "Research Methods", credits: 3, type: "mandatory" },
      { code: "HS 579", name: "Artificial Intelligence in OHS", credits: 3, type: "core" },
      { code: "HS 577", name: "Statistical Data Analysis", credits: 3, type: "core" },
      { code: "HS 575", name: "Project Management", credits: 3, type: "core" },
      { code: "HS 561", name: "Critical Thinking and Decision Making", credits: 3, type: "core" },
      { code: "HS 559", name: "Field/Lab Work", credits: 3, type: "mandatory" },
      { code: "HS 550", name: "MSc/MPhil Seminar", credits: 3, type: "mandatory" },
    ],
    January: [
      { code: "HS 551", name: "Research Methods", credits: 3, type: "mandatory" },
      { code: "HS 559", name: "Field/Lab Work", credits: 3, type: "mandatory" },
      { code: "HS 550", name: "MSc/MPhil Seminar", credits: 3, type: "mandatory" },
    ],
  },
  "Management Studies": {
    July: [
      { code: "MBS 551", name: "Research Methods", credits: 3, type: "mandatory" },
      { code: "MBS 571", name: "Management and Organisational Behaviour", credits: 3, type: "core" },
      { code: "MBS 573", name: "Managerial Economics", credits: 3, type: "core" },
      { code: "MBS 575", name: "Accounting for Business Decisions", credits: 3, type: "core" },
      { code: "MBS 577", name: "Quantitative Methods", credits: 3, type: "core" },
      { code: "MBS 579", name: "Project and Operations Management", credits: 3, type: "core" },
      { code: "MBS 581", name: "Business Intelligence and Data Analytics", credits: 3, type: "core" },
      { code: "MBS 583", name: "Management Information Systems", credits: 3, type: "core" },
      { code: "MBS 589", name: "Strategic Management", credits: 3, type: "core" },
    ],
    January: [
      { code: "MBS 551", name: "Research Methods", credits: 3, type: "mandatory" },
      { code: "MBS 571", name: "Management and Organisational Behaviour", credits: 3, type: "core" },
      { code: "MBS 573", name: "Managerial Economics", credits: 3, type: "core" },
      { code: "MBS 575", name: "Accounting for Business Decisions", credits: 3, type: "core" },
      { code: "MBS 577", name: "Quantitative Methods", credits: 3, type: "core" },
      { code: "MBS 579", name: "Project and Operations Management", credits: 3, type: "core" },
      { code: "MBS 581", name: "Business Intelligence and Data Analytics", credits: 3, type: "core" },
      { code: "MBS 583", name: "Management Information Systems", credits: 3, type: "core" },
      { code: "MBS 589", name: "Strategic Management", credits: 3, type: "core" },
    ],
  },
};

async function backfillStudent(studentId, department, admissionCycle, admissionYear) {
  const cycle = admissionCycle || "January";
  const academicYear = `${admissionYear}/${parseInt(admissionYear) + 1}`;
  const deptCourses = PROGRAMME_COURSES[department];
  if (!deptCourses) {
    console.log(`   ⚠️  No catalog found for department: ${department}`);
    return 0;
  }
  const courses = deptCourses[cycle] || deptCourses["January"] || [];
  let registered = 0;
  for (const course of courses) {
    let courseId;
    const existing = await db.query("SELECT id FROM courses WHERE code = $1", [course.code]);
    if (existing.rows.length > 0) {
      courseId = existing.rows[0].id;
    } else {
      const nc = await db.query(
        `INSERT INTO courses (name, code, credits, semester, academic_year, course_type, is_active)
         VALUES ($1, $2, $3, 1, $4, $5, TRUE) RETURNING id`,
        [course.name, course.code, course.credits, academicYear, course.type]
      );
      courseId = nc.rows[0].id;
    }
    const reg = await db.query(
      `INSERT INTO course_registrations (student_id, course_id, semester, academic_year, status)
       VALUES ($1, $2, 1, $3, 'Registered')
       ON CONFLICT (student_id, course_id, academic_year) DO NOTHING RETURNING id`,
      [studentId, courseId, academicYear]
    );
    if (reg.rows.length > 0) registered++;
  }
  return registered;
}

async function main() {
  console.log("🔧 Backfilling course registrations for existing students with 0 courses...\n");
  try {
    const students = await db.query(`
      SELECT s.id, u.first_name, u.last_name, d.name as dept, s.admission_cycle, s.admission_year,
             (SELECT COUNT(*) FROM course_registrations WHERE student_id = s.id AND status = 'Registered') as reg_count
      FROM students s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN departments d ON s.department_id = d.id
    `);

    let fixed = 0;
    for (const s of students.rows) {
      if (parseInt(s.reg_count) === 0) {
        console.log(`Fixing: ${s.first_name} ${s.last_name} | ${s.dept} | ${s.admission_cycle}`);
        const count = await backfillStudent(s.id, s.dept, s.admission_cycle, s.admission_year);
        console.log(`   ✅ Registered ${count} courses\n`);
        fixed++;
      } else {
        console.log(`✅ ${s.first_name} ${s.last_name} already has ${s.reg_count} courses — skipping`);
      }
    }

    console.log(`\n✅ Done! Fixed ${fixed} student(s).`);
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    process.exit(0);
  }
}

main();
