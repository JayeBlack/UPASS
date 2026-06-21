// List all students - Run: node list_students.js
const db = require('./src/db');

async function listStudents() {
  try {
    console.log('📋 Fetching all students from database...\n');
    
    const result = await db.query(`
      SELECT s.id, s.index_number, s.user_id
      FROM students s
      ORDER BY s.index_number
    `);
    
    if (result.rows.length === 0) {
      console.log('❌ No students found in database!');
      console.log('   You need to create students before uploading grades.\n');
      process.exit(0);
    }
    
    console.log(`✅ Found ${result.rows.length} student(s):\n`);
    console.log('─'.repeat(80));
    console.log('ID'.padEnd(10), 'Index Number'.padEnd(25), 'User ID');
    console.log('─'.repeat(80));
    
    result.rows.forEach(s => {
      console.log(
        s.id.toString().padEnd(10),
        s.index_number.padEnd(25),
        s.user_id
      );
    });
    
    console.log('─'.repeat(80));
    console.log();
    console.log('💡 Use these index numbers in your CSV file!');
    console.log();
    console.log('📝 Example CSV format:');
    console.log('Index Number,Student Name,Course Name,Credit Hours,Marks');
    if (result.rows.length > 0) {
      console.log(`${result.rows[0].index_number},Student Name,Advanced Mathematics,3,85`);
    }
    console.log();
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    process.exit(0);
  }
}

listStudents();
