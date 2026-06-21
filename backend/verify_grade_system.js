// Grade Entry System Verification Script
// Run this in backend directory: node verify_grade_system.js

const db = require('./src/db');

async function verifySystem() {
  console.log('🔍 Verifying Grade Entry System...\n');

  try {
    // 1. Check database connection
    console.log('1️⃣  Checking database connection...');
    await db.query('SELECT NOW()');
    console.log('   ✅ Database connected\n');

    // 2. Check required tables exist
    console.log('2️⃣  Checking required tables...');
    const tables = ['students', 'courses', 'grades', 'result_batches', 'users'];
    for (const table of tables) {
      const result = await db.query(
        `SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = $1
        )`,
        [table]
      );
      if (result.rows[0].exists) {
        console.log(`   ✅ Table '${table}' exists`);
      } else {
        console.log(`   ❌ Table '${table}' missing!`);
      }
    }
    console.log('');

    // 3. Check sample students
    console.log('3️⃣  Checking for students...');
    const studentCount = await db.query('SELECT COUNT(*) FROM students');
    console.log(`   ℹ️  Found ${studentCount.rows[0].count} students`);
    
    const sampleStudents = await db.query(
      'SELECT index_number, user_id FROM students LIMIT 3'
    );
    if (sampleStudents.rows.length > 0) {
      console.log('   Sample students:');
      sampleStudents.rows.forEach(s => {
        console.log(`   - ${s.index_number} (user_id: ${s.user_id})`);
      });
    }
    console.log('');

    // 4. Check courses
    console.log('4️⃣  Checking for courses...');
    const courseCount = await db.query('SELECT COUNT(*) FROM courses');
    console.log(`   ℹ️  Found ${courseCount.rows[0].count} courses`);
    console.log('');

    // 5. Check grades
    console.log('5️⃣  Checking existing grades...');
    const gradeCount = await db.query('SELECT COUNT(*) FROM grades');
    console.log(`   ℹ️  Found ${gradeCount.rows[0].count} grades`);
    
    if (gradeCount.rows[0].count > 0) {
      const recentGrades = await db.query(`
        SELECT g.*, s.index_number, c.name as course_name
        FROM grades g
        JOIN students s ON g.student_id = s.id
        JOIN courses c ON g.course_id = c.id
        ORDER BY g.entered_at DESC
        LIMIT 5
      `);
      console.log('   Recent grades:');
      recentGrades.rows.forEach(g => {
        console.log(`   - ${g.index_number}: ${g.course_name} = ${g.grade} (${g.marks}%)`);
      });
    }
    console.log('');

    // 6. Check for exams officer
    console.log('6️⃣  Checking for Exams Officer accounts...');
    const examOfficers = await db.query(
      `SELECT email, role FROM users WHERE role = 'ExamsOfficer'`
    );
    if (examOfficers.rows.length > 0) {
      console.log(`   ✅ Found ${examOfficers.rows.length} Exams Officer(s):`);
      examOfficers.rows.forEach(u => {
        console.log(`   - ${u.email}`);
      });
    } else {
      console.log('   ⚠️  No Exams Officer accounts found!');
      console.log('   Create one using the admin panel or database insert.');
    }
    console.log('');

    // 7. Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 SYSTEM STATUS SUMMARY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Students: ${studentCount.rows[0].count}`);
    console.log(`Courses: ${courseCount.rows[0].count}`);
    console.log(`Grades: ${gradeCount.rows[0].count}`);
    console.log(`Exams Officers: ${examOfficers.rows.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // 8. Recommendations
    console.log('💡 RECOMMENDATIONS:');
    if (studentCount.rows[0].count === '0') {
      console.log('   ⚠️  Add students before testing grade upload');
    }
    if (examOfficers.rows.length === 0) {
      console.log('   ⚠️  Create an Exams Officer account');
    }
    console.log('   ℹ️  Use sample_grades.csv for testing');
    console.log('   ℹ️  Update index numbers in CSV to match your students');
    console.log('   ℹ️  Read GRADE_ENTRY_TESTING.md for full testing guide\n');

    console.log('✅ Verification complete!\n');

  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    console.error(error);
  } finally {
    process.exit(0);
  }
}

verifySystem();
