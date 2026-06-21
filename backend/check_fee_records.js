const db = require("./src/db");

async function checkFeeRecords() {
  try {
    console.log("=== Checking Fee Records ===\n");

    // Check total fee records
    const feeCount = await db.query("SELECT COUNT(*) as count FROM fee_records");
    console.log(`Total fee records: ${feeCount.rows[0].count}`);

    // Check students without fee records
    const studentsWithoutFees = await db.query(`
      SELECT COUNT(*) as count
      FROM students s
      LEFT JOIN fee_records f ON s.id = f.student_id
      WHERE f.id IS NULL
    `);
    console.log(`Students without fee records: ${studentsWithoutFees.rows[0].count}`);

    // Check total students
    const studentCount = await db.query("SELECT COUNT(*) as count FROM students");
    console.log(`Total students: ${studentCount.rows[0].count}`);

    // Show sample fee records
    const sampleFees = await db.query(`
      SELECT f.*, s.index_number, u.first_name, u.last_name
      FROM fee_records f
      JOIN students s ON f.student_id = s.id
      JOIN users u ON s.user_id = u.id
      LIMIT 5
    `);

    if (sampleFees.rows.length > 0) {
      console.log("\n=== Sample Fee Records ===");
      sampleFees.rows.forEach(f => {
        console.log(`- ${f.first_name} ${f.last_name} (${f.index_number}): GHS ${f.total_amount} (Paid: ${f.amount_paid}, Status: ${f.status})`);
      });
    } else {
      console.log("\n⚠️  NO FEE RECORDS FOUND IN DATABASE");
      console.log("\nTo create fee records, you can:");
      console.log("1. Use the 'Import Manual Payments' feature in the Accountant UI");
      console.log("2. Run: node backend/create_sample_fees.js");
    }

    process.exit(0);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

checkFeeRecords();
