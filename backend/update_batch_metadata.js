// Update existing result batches with department and program info
const db = require('./src/db');

async function updateBatches() {
  try {
    console.log('🔄 Updating result batches with department and program...\n');
    
    // Get all batches without department/program
    const batches = await db.query(
      `SELECT id, semester, academic_year FROM result_batches WHERE department_id IS NULL OR program_id IS NULL`
    );
    
    if (batches.rows.length === 0) {
      console.log('✅ All batches already have department and program info.');
      process.exit(0);
    }
    
    console.log(`Found ${batches.rows.length} batch(es) to update:\n`);
    
    for (const batch of batches.rows) {
      console.log(`Batch ${batch.id}: ${batch.semester} - ${batch.academic_year}`);
      
      // Find students with grades in this batch
      const studentData = await db.query(
        `SELECT DISTINCT s.department_id, s.program_id, COUNT(*) as student_count
         FROM grades g
         JOIN students s ON g.student_id = s.id
         WHERE g.semester = $1 AND g.academic_year = $2
         GROUP BY s.department_id, s.program_id
         ORDER BY student_count DESC
         LIMIT 1`,
        [batch.semester, batch.academic_year]
      );
      
      if (studentData.rows.length > 0) {
        const { department_id, program_id, student_count } = studentData.rows[0];
        
        await db.query(
          `UPDATE result_batches 
           SET department_id = $1, program_id = $2, student_count = $3 
           WHERE id = $4`,
          [department_id, program_id, student_count, batch.id]
        );
        
        // Get names for display
        const deptRes = await db.query(`SELECT name FROM departments WHERE id = $1`, [department_id]);
        const progRes = await db.query(`SELECT name FROM programs WHERE id = $1`, [program_id]);
        
        console.log(`  ✅ Updated: ${progRes.rows[0]?.name || 'N/A'} | ${deptRes.rows[0]?.name || 'N/A'} | ${student_count} students\n`);
      } else {
        console.log(`  ⚠️  No students found for this batch\n`);
      }
    }
    
    console.log('✅ All batches updated successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

updateBatches();
