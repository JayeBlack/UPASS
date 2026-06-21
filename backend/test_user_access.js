const db = require("./src/db");

async function testUserAccess() {
  try {
    console.log("=== Testing User Access to Fee Records ===\n");

    // Get all users with their departments
    const users = await db.query(`
      SELECT u.id, u.email, u.role, d.name as department
      FROM users u
      LEFT JOIN departments d ON u.department_id = d.id
      WHERE u.role != 'Student'
      ORDER BY u.role, u.email
      LIMIT 20
    `);

    console.log("Non-Student Users:\n");
    
    const universityWideRoles = ['Admin', 'Accountant', 'AccountingAssistant', 'Registrar'];
    const universityWideDepts = ['School of Postgraduate Studies', 'Finance Office'];

    users.rows.forEach(user => {
      const hasUniversityAccess = 
        universityWideRoles.includes(user.role) || 
        universityWideDepts.includes(user.department);
      
      const accessType = hasUniversityAccess ? '✅ ALL DEPARTMENTS' : `🔒 ${user.department || 'No dept'} only`;
      
      console.log(`${user.email}`);
      console.log(`  Role: ${user.role}`);
      console.log(`  Department: ${user.department || 'None'}`);
      console.log(`  Access: ${accessType}\n`);
    });

    // Get fee record department breakdown
    const feeStats = await db.query(`
      SELECT d.name as department, COUNT(f.id) as fee_records
      FROM fee_records f
      JOIN students s ON f.student_id = s.id
      LEFT JOIN departments d ON s.department_id = d.id
      GROUP BY d.name
      ORDER BY fee_records DESC
    `);

    console.log("\n=== Fee Records by Department ===\n");
    feeStats.rows.forEach(row => {
      console.log(`${row.department || 'No Department'}: ${row.fee_records} records`);
    });

    console.log("\n=== Access Rules ===");
    console.log("✅ University-wide access (see ALL departments):");
    console.log("  - Roles: Admin, Accountant, AccountingAssistant, Registrar");
    console.log("  - Departments: School of Postgraduate Studies, Finance Office");
    console.log("\n🔒 Department-specific access:");
    console.log("  - Dean, ViceDean, AdminAssistant, ExamsOfficer");
    console.log("  - See only their assigned department's records");

    process.exit(0);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

testUserAccess();
