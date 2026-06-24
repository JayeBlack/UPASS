const db = require("./src/db");

async function verifyStudentPrograms() {
  try {
    console.log("🔍 Verifying student program assignments...\n");
    
    // Check students without programs
    const missingPrograms = await db.query(
      `SELECT s.id, s.index_number, 
              CONCAT(u.first_name, ' ', u.last_name) AS name,
              s.program_id,
              p.name AS program_name
       FROM students s
       JOIN users u ON s.user_id = u.id
       LEFT JOIN programs p ON s.program_id = p.id
       ORDER BY s.id`
    );

    console.log(`Total students: ${missingPrograms.rows.length}`);
    
    const withoutProgram = missingPrograms.rows.filter(s => !s.program_id);
    const withProgram = missingPrograms.rows.filter(s => s.program_id);
    
    console.log(`✅ Students with programs: ${withProgram.length}`);
    console.log(`❌ Students without programs: ${withoutProgram.length}\n`);

    if (withoutProgram.length > 0) {
      console.log("Students missing program assignment:");
      withoutProgram.forEach(s => {
        console.log(`  - ${s.name} (${s.index_number}) [ID: ${s.id}]`);
      });
    }

    if (withProgram.length > 0) {
      console.log("\nStudents with programs (sample):");
      withProgram.slice(0, 5).forEach(s => {
        console.log(`  ✓ ${s.name} (${s.index_number}) → ${s.program_name}`);
      });
    }

    console.log("\n📋 Available programs:");
    const programs = await db.query("SELECT id, name FROM programs ORDER BY name");
    programs.rows.forEach(p => {
      console.log(`  ${p.id}. ${p.name}`);
    });

  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await db.pool.end();
  }
}

verifyStudentPrograms();
