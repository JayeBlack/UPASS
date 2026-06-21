const db = require("./src/db");

async function systemHealthCheck() {
  console.log("=== UPASS System Health Check ===\n");
  
  const checks = [];
  
  // 1. Database Connection
  try {
    await db.query("SELECT NOW()");
    checks.push({ check: "Database Connection", status: "✅ PASS", details: "Connected successfully" });
  } catch (err) {
    checks.push({ check: "Database Connection", status: "❌ FAIL", details: err.message });
  }
  
  // 2. Users Count
  try {
    const result = await db.query("SELECT COUNT(*) as count FROM users");
    const count = parseInt(result.rows[0].count);
    checks.push({ check: "Users Table", status: "✅ PASS", details: `${count} users` });
  } catch (err) {
    checks.push({ check: "Users Table", status: "❌ FAIL", details: err.message });
  }
  
  // 3. Students Count
  try {
    const result = await db.query("SELECT COUNT(*) as count FROM students");
    const count = parseInt(result.rows[0].count);
    checks.push({ check: "Students Table", status: "✅ PASS", details: `${count} students` });
  } catch (err) {
    checks.push({ check: "Students Table", status: "❌ FAIL", details: err.message });
  }
  
  // 4. Fee Records Count
  try {
    const result = await db.query("SELECT COUNT(*) as count FROM fee_records");
    const count = parseInt(result.rows[0].count);
    checks.push({ check: "Fee Records Table", status: "✅ PASS", details: `${count} records` });
  } catch (err) {
    checks.push({ check: "Fee Records Table", status: "❌ FAIL", details: err.message });
  }
  
  // 5. Departments Count
  try {
    const result = await db.query("SELECT COUNT(*) as count FROM departments WHERE is_active = true");
    const count = parseInt(result.rows[0].count);
    if (count === 10) {
      checks.push({ check: "Departments", status: "✅ PASS", details: `${count} active departments` });
    } else {
      checks.push({ check: "Departments", status: "⚠️  WARN", details: `${count}/10 departments (expected 10)` });
    }
  } catch (err) {
    checks.push({ check: "Departments", status: "❌ FAIL", details: err.message });
  }
  
  // 6. Check for orphaned students (students without users)
  try {
    const result = await db.query(`
      SELECT COUNT(*) as count 
      FROM students s 
      LEFT JOIN users u ON s.user_id = u.id 
      WHERE u.id IS NULL
    `);
    const count = parseInt(result.rows[0].count);
    if (count === 0) {
      checks.push({ check: "Data Integrity (Students)", status: "✅ PASS", details: "No orphaned records" });
    } else {
      checks.push({ check: "Data Integrity (Students)", status: "⚠️  WARN", details: `${count} orphaned student records` });
    }
  } catch (err) {
    checks.push({ check: "Data Integrity (Students)", status: "❌ FAIL", details: err.message });
  }
  
  // 7. Check for orphaned fee records
  try {
    const result = await db.query(`
      SELECT COUNT(*) as count 
      FROM fee_records f 
      LEFT JOIN students s ON f.student_id = s.id 
      WHERE s.id IS NULL
    `);
    const count = parseInt(result.rows[0].count);
    if (count === 0) {
      checks.push({ check: "Data Integrity (Fees)", status: "✅ PASS", details: "No orphaned records" });
    } else {
      checks.push({ check: "Data Integrity (Fees)", status: "⚠️  WARN", details: `${count} orphaned fee records` });
    }
  } catch (err) {
    checks.push({ check: "Data Integrity (Fees)", status: "❌ FAIL", details: err.message });
  }
  
  // 8. Check database indexes
  try {
    const result = await db.query(`
      SELECT COUNT(*) as count 
      FROM pg_indexes 
      WHERE schemaname = 'public'
    `);
    const count = parseInt(result.rows[0].count);
    checks.push({ check: "Database Indexes", status: "✅ PASS", details: `${count} indexes found` });
  } catch (err) {
    checks.push({ check: "Database Indexes", status: "⚠️  WARN", details: "Could not verify indexes" });
  }
  
  // 9. Check for missing environment variables
  const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET', 'PORT'];
  const missingVars = requiredEnvVars.filter(v => !process.env[v]);
  if (missingVars.length === 0) {
    checks.push({ check: "Environment Variables", status: "✅ PASS", details: "All required vars present" });
  } else {
    checks.push({ check: "Environment Variables", status: "❌ FAIL", details: `Missing: ${missingVars.join(', ')}` });
  }
  
  // 10. Performance Check - Query Speed
  try {
    const start = Date.now();
    await db.query(`
      SELECT f.*, s.index_number, u.first_name, u.last_name 
      FROM fee_records f
      JOIN students s ON f.student_id = s.id
      JOIN users u ON s.user_id = u.id
      LIMIT 50
    `);
    const duration = Date.now() - start;
    if (duration < 200) {
      checks.push({ check: "Query Performance", status: "✅ PASS", details: `${duration}ms for 50 records` });
    } else {
      checks.push({ check: "Query Performance", status: "⚠️  WARN", details: `${duration}ms (slow, expected <200ms)` });
    }
  } catch (err) {
    checks.push({ check: "Query Performance", status: "❌ FAIL", details: err.message });
  }
  
  // Print Results
  console.log("Health Check Results:\n");
  const maxCheckLength = Math.max(...checks.map(c => c.check.length));
  
  checks.forEach(({ check, status, details }) => {
    const padding = ' '.repeat(maxCheckLength - check.length + 2);
    console.log(`${check}${padding}${status}  ${details}`);
  });
  
  // Summary
  const passed = checks.filter(c => c.status === "✅ PASS").length;
  const warned = checks.filter(c => c.status === "⚠️  WARN").length;
  const failed = checks.filter(c => c.status === "❌ FAIL").length;
  
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Summary: ${passed} passed, ${warned} warnings, ${failed} failed`);
  console.log(`${'='.repeat(60)}\n`);
  
  if (failed > 0) {
    console.log("⚠️  System has CRITICAL issues - investigate failures immediately!");
    process.exit(1);
  } else if (warned > 0) {
    console.log("⚠️  System has warnings - review and address when possible.");
    process.exit(0);
  } else {
    console.log("✅ System health: EXCELLENT - All checks passed!");
    process.exit(0);
  }
}

systemHealthCheck().catch(err => {
  console.error("Health check failed:", err);
  process.exit(1);
});
