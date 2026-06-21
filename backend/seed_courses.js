const db = require("./src/db");

async function seedCoursesAndRegister() {
  try {
    // 1. Find Kwaku's student record
    const studentQuery = await db.query(`
      SELECT s.id, s.index_number, u.email, u.first_name, u.last_name,
             d.name as department, p.name as program, s.admission_cycle
      FROM students s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN departments d ON s.department_id = d.id
      LEFT JOIN programs p ON s.program_id = p.id
      WHERE u.email = 'kwakumanu@gmail.com'
    `);

    if (studentQuery.rows.length === 0) {
      console.error("❌ Student not found!");
      process.exit(1);
    }

    const student = studentQuery.rows[0];
    console.log(`✅ Found: ${student.first_name} ${student.last_name}`);
    console.log(`   Student ID: ${student.id}`);
    console.log(`   Department: ${student.department}`);
    console.log(`   Program: ${student.program}`);
    console.log(`   Cohort: ${student.admission_cycle}\n`);

    // 2. Mining Engineering courses (matches MINING_MSC_MPHIL_JULY catalog)
    const courses = [
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
      { code: "GL/MN 552", name: "Mineral Resource Evaluation (Geology)", credits: 3, type: "elective" },
    ];

    console.log("2️⃣  Seeding courses and registrations...");
    let created = 0, registered = 0, skipped = 0;

    for (const course of courses) {
      // Find or create course
      let courseId;
      const existing = await db.query("SELECT id FROM courses WHERE code = $1", [course.code]);

      if (existing.rows.length > 0) {
        courseId = existing.rows[0].id;
      } else {
        const nc = await db.query(
          `INSERT INTO courses (name, code, credits, semester, academic_year, course_type, is_active)
           VALUES ($1, $2, $3, 1, '2025/2026', $4, TRUE) RETURNING id`,
          [course.name, course.code, course.credits, course.type]
        );
        courseId = nc.rows[0].id;
        created++;
      }

      // Register student
      const reg = await db.query(
        `INSERT INTO course_registrations (student_id, course_id, semester, academic_year, status)
         VALUES ($1, $2, 1, '2025/2026', 'Registered')
         ON CONFLICT (student_id, course_id, academic_year) DO NOTHING
         RETURNING id`,
        [student.id, courseId]
      );

      if (reg.rows.length > 0) {
        registered++;
        console.log(`   ✅ ${course.code} - ${course.name}`);
      } else {
        skipped++;
        console.log(`   ⏭️  Already registered: ${course.code}`);
      }
    }

    // 3. Verify
    const verification = await db.query(
      `SELECT c.code, c.name, c.credits
       FROM course_registrations cr
       JOIN courses c ON cr.course_id = c.id
       WHERE cr.student_id = $1 AND cr.status = 'Registered'
       ORDER BY c.code`,
      [student.id]
    );

    console.log(`\n📋 Final registered courses for ${student.first_name}:`);
    verification.rows.forEach((r, i) => console.log(`   ${i + 1}. ${r.code} - ${r.name}`));
    console.log(`\n✅ Done! Dashboard will now show: ${verification.rows.length} registered courses`);
    console.log(`   (Courses created: ${created}, Newly registered: ${registered}, Skipped: ${skipped})`);

  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seedCoursesAndRegister();
