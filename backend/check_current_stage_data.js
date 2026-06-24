const db = require("./src/db");

async function checkCurrentStageData() {
  try {
    console.log("🔍 Checking Current Stage data for supervisor assigned students...\n");
    
    // 1. Get all supervisor assignments
    console.log("1️⃣ Checking supervisor assignments:");
    const assignments = await db.query(`
      SELECT ss.id, ss.supervisor_id, ss.student_id,
             CONCAT(u.first_name, ' ', u.last_name) AS student_name,
             s.index_number,
             CONCAT(su.first_name, ' ', su.last_name) AS supervisor_name
      FROM student_supervisors ss
      JOIN students s ON ss.student_id = s.id
      JOIN users u ON s.user_id = u.id
      JOIN supervisors sup ON ss.supervisor_id = sup.id
      JOIN users su ON sup.user_id = su.id
      ORDER BY ss.supervisor_id, ss.student_id
    `);
    
    console.log(`   Total assignments: ${assignments.rows.length}\n`);
    
    if (assignments.rows.length > 0) {
      console.log("   Sample assignments:");
      assignments.rows.slice(0, 5).forEach(a => {
        console.log(`   - ${a.supervisor_name} → ${a.student_name} (ID: ${a.student_id})`);
      });
      console.log("");
    }
    
    // 2. Get all thesis submissions
    console.log("2️⃣ Checking thesis submissions:");
    const submissions = await db.query(`
      SELECT ts.id, ts.student_id, ts.stage, ts.status, ts.submitted_at,
             CONCAT(u.first_name, ' ', u.last_name) AS student_name,
             s.index_number
      FROM thesis_submissions ts
      JOIN students s ON ts.student_id = s.id
      JOIN users u ON s.user_id = u.id
      ORDER BY ts.submitted_at DESC
    `);
    
    console.log(`   Total submissions: ${submissions.rows.length}\n`);
    
    if (submissions.rows.length > 0) {
      console.log("   Recent submissions:");
      submissions.rows.slice(0, 10).forEach(sub => {
        console.log(`   - ${sub.student_name} (ID: ${sub.student_id}): ${sub.stage} — ${sub.status}`);
      });
      console.log("");
    }
    
    // 3. Match assigned students with their submissions
    console.log("3️⃣ Matching assigned students with submissions:");
    const assignedStudentIds = [...new Set(assignments.rows.map(a => a.student_id))];
    console.log(`   Unique assigned students: ${assignedStudentIds.length}\n`);
    
    for (const studentId of assignedStudentIds.slice(0, 5)) {
      const student = assignments.rows.find(a => a.student_id === studentId);
      const studentSubs = submissions.rows.filter(s => s.student_id === studentId);
      
      console.log(`   Student: ${student.student_name} (ID: ${studentId})`);
      if (studentSubs.length === 0) {
        console.log(`      ❌ No submissions found`);
      } else {
        console.log(`      ✅ ${studentSubs.length} submission(s):`);
        studentSubs.forEach(sub => {
          console.log(`         - ${sub.stage} (${sub.status}) - ${new Date(sub.submitted_at).toLocaleDateString()}`);
        });
      }
      console.log("");
    }
    
    // 4. Check for student_id data type consistency
    console.log("4️⃣ Checking data type consistency:");
    const typeCheck = await db.query(`
      SELECT 
        pg_typeof(student_id) as thesis_student_id_type
      FROM thesis_submissions
      LIMIT 1
    `);
    
    const assignmentTypeCheck = await db.query(`
      SELECT 
        pg_typeof(student_id) as assignment_student_id_type
      FROM student_supervisors
      LIMIT 1
    `);
    
    console.log(`   thesis_submissions.student_id type: ${typeCheck.rows[0]?.thesis_student_id_type || 'N/A'}`);
    console.log(`   student_supervisors.student_id type: ${assignmentTypeCheck.rows[0]?.assignment_student_id_type || 'N/A'}`);
    
    // 5. Test the query that frontend uses
    console.log("\n5️⃣ Testing frontend query simulation:");
    console.log("   Simulating: GET /api/thesis/pending");
    const frontendQuery = await db.query(`
      SELECT ts.*, u.first_name, u.last_name, s.index_number
      FROM thesis_submissions ts
      JOIN students s ON ts.student_id = s.id
      JOIN users u ON s.user_id = u.id
      ORDER BY ts.submitted_at DESC
    `);
    console.log(`   Query returned: ${frontendQuery.rows.length} rows`);
    
    if (frontendQuery.rows.length > 0) {
      console.log("\n   Sample data structure:");
      const sample = frontendQuery.rows[0];
      console.log(`   {`);
      console.log(`     id: ${sample.id},`);
      console.log(`     student_id: ${sample.student_id} (type: ${typeof sample.student_id}),`);
      console.log(`     first_name: "${sample.first_name}",`);
      console.log(`     last_name: "${sample.last_name}",`);
      console.log(`     stage: "${sample.stage}",`);
      console.log(`     status: "${sample.status}"`);
      console.log(`   }`);
    }

    // 6. Statistics
    console.log("\n📊 Statistics:");
    const studentsWithSubs = submissions.rows.reduce((acc, sub) => {
      acc.add(sub.student_id);
      return acc;
    }, new Set());
    
    console.log(`   - Students with submissions: ${studentsWithSubs.size}`);
    console.log(`   - Students assigned to supervisors: ${assignedStudentIds.length}`);
    console.log(`   - Overlap: ${assignedStudentIds.filter(id => studentsWithSubs.has(id)).length}`);
    
    const statusBreakdown = submissions.rows.reduce((acc, sub) => {
      acc[sub.status] = (acc[sub.status] || 0) + 1;
      return acc;
    }, {});
    
    console.log("\n   Submission status breakdown:");
    Object.entries(statusBreakdown).forEach(([status, count]) => {
      console.log(`      ${status}: ${count}`);
    });

  } catch (err) {
    console.error("❌ Error:", err.message);
    console.error(err);
  } finally {
    await db.pool.end();
  }
}

checkCurrentStageData();
