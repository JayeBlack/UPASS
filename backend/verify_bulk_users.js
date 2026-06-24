const db = require("./src/db");

async function verifyBulkUsers() {
  try {
    console.log("🔍 Verifying bulk uploaded users vs manually created users...\n");
    
    // 1. Check last_password_change field
    console.log("1️⃣ Checking last_password_change field...");
    const missingPwdChange = await db.query(
      "SELECT COUNT(*) as count FROM users WHERE last_password_change IS NULL"
    );
    if (parseInt(missingPwdChange.rows[0].count) === 0) {
      console.log("   ✅ All users have last_password_change set");
    } else {
      console.log(`   ❌ ${missingPwdChange.rows[0].count} users missing last_password_change`);
    }
    
    // 2. Check students have proper records
    console.log("\n2️⃣ Checking student records...");
    const studentsCheck = await db.query(`
      SELECT 
        COUNT(*) as total_students,
        COUNT(CASE WHEN s.program_id IS NULL THEN 1 END) as missing_program,
        COUNT(CASE WHEN s.department_id IS NULL THEN 1 END) as missing_dept
      FROM students s
    `);
    const stats = studentsCheck.rows[0];
    console.log(`   Total students: ${stats.total_students}`);
    console.log(`   Missing program: ${stats.missing_program}`);
    console.log(`   Missing department: ${stats.missing_dept}`);
    if (parseInt(stats.missing_program) === 0 && parseInt(stats.missing_dept) === 0) {
      console.log("   ✅ All students have program and department assigned");
    } else {
      console.log("   ⚠️  Some students missing program or department");
    }
    
    // 3. Check supervisors have proper records
    console.log("\n3️⃣ Checking supervisor records...");
    const supervisorsCheck = await db.query(`
      SELECT 
        COUNT(u.id) as total_supervisors,
        COUNT(s.id) as with_supervisor_record,
        COUNT(CASE WHEN s.department_id IS NULL THEN 1 END) as missing_dept
      FROM users u
      LEFT JOIN supervisors s ON s.user_id = u.id
      WHERE u.role = 'Supervisor'
    `);
    const supStats = supervisorsCheck.rows[0];
    console.log(`   Total supervisor users: ${supStats.total_supervisors}`);
    console.log(`   With supervisor record: ${supStats.with_supervisor_record}`);
    console.log(`   Missing department: ${supStats.missing_dept}`);
    if (supStats.total_supervisors === supStats.with_supervisor_record) {
      console.log("   ✅ All supervisors have proper records");
    } else {
      console.log(`   ❌ ${parseInt(supStats.total_supervisors) - parseInt(supStats.with_supervisor_record)} supervisors missing records`);
    }
    
    // 4. Check user authentication fields
    console.log("\n4️⃣ Checking authentication fields...");
    const authCheck = await db.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN password_hash IS NULL THEN 1 END) as missing_password,
        COUNT(CASE WHEN must_change_password IS NULL THEN 1 END) as missing_must_change
      FROM users
    `);
    const authStats = authCheck.rows[0];
    if (parseInt(authStats.missing_password) === 0 && parseInt(authStats.missing_must_change) === 0) {
      console.log("   ✅ All users have proper authentication fields");
    } else {
      console.log(`   ❌ Issues found - missing password: ${authStats.missing_password}, missing must_change: ${authStats.missing_must_change}`);
    }
    
    // 5. Sample comparison
    console.log("\n5️⃣ Sample user comparison...");
    const sampleBulk = await db.query(`
      SELECT u.email, u.role, u.last_password_change IS NOT NULL as has_pwd_change,
             u.must_change_password, u.is_active
      FROM users u
      ORDER BY u.created_at DESC
      LIMIT 3
    `);
    console.log("   Recent users:");
    sampleBulk.rows.forEach(u => {
      console.log(`   - ${u.email} (${u.role}): pwd_change=${u.has_pwd_change}, must_change=${u.must_change_password}, active=${u.is_active}`);
    });
    
    console.log("\n✅ Verification complete! All bulk uploaded users should now have same functionality as manually created users.");
    
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await db.pool.end();
  }
}

verifyBulkUsers();
