const { Pool } = require('pg');
require('dotenv').config();

async function clearAllData() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log('\n' + '='.repeat(60));
    console.log('⚠️  WARNING: CLEARING ALL DATABASE DATA');
    console.log('='.repeat(60) + '\n');
    
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      console.log('🗑️  Deleting data from all tables...\n');
      
      // Delete in order to respect foreign key constraints
      const tables = [
        'announcement_reads',
        'supervisor_announcement_recipients',
        'supervisor_resource_recipients',
        'student_resource_reads',
        'thesis_remarks',
        'thesis_submissions',
        'clearance_steps',
        'grades',
        'result_batches',
        'graduands',
        'course_registrations',
        'courses',
        'exam_timetable',
        'payments',
        'fee_records',
        'student_supervisors',
        'students',
        'supervisor_announcements',
        'supervisor_resources',
        'resources',
        'announcements',
        'document_uploads',
        'document_requests',
        'notifications',
        'audit_logs',
        'supervisors',
        'programs',
        'users',
        // departments - we'll keep these since migration will recreate them
      ];
      
      for (const table of tables) {
        const result = await client.query(`DELETE FROM ${table}`);
        console.log(`   ✓ Cleared ${table} (${result.rowCount} rows deleted)`);
      }
      
      // Clear departments last
      const deptResult = await client.query('DELETE FROM departments');
      console.log(`   ✓ Cleared departments (${deptResult.rowCount} rows deleted)`);
      
      // Reset sequences to start from 1
      console.log('\n🔄 Resetting ID sequences...\n');
      
      const sequences = await client.query(`
        SELECT sequence_name 
        FROM information_schema.sequences 
        WHERE sequence_schema = 'public'
      `);
      
      for (const seq of sequences.rows) {
        await client.query(`ALTER SEQUENCE ${seq.sequence_name} RESTART WITH 1`);
        console.log(`   ✓ Reset ${seq.sequence_name}`);
      }
      
      await client.query('COMMIT');
      
      console.log('\n' + '='.repeat(60));
      console.log('✅ DATABASE CLEARED SUCCESSFULLY!');
      console.log('='.repeat(60) + '\n');
      
      console.log('Next steps:');
      console.log('1. Run migrations: node run_migrations.js');
      console.log('2. Create super admin: node create_superadmin.js <email> <password> <first> <last>');
      console.log('   OR use: create-admin.bat\n');
      
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('\n❌ Error:', err.message);
    console.error(err.stack);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Confirmation prompt
console.log('\n' + '='.repeat(60));
console.log('⚠️  DATABASE CLEAR SCRIPT');
console.log('='.repeat(60));
console.log('\nThis will DELETE ALL DATA from your database!');
console.log('Tables will remain, but all records will be removed.\n');
console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');

setTimeout(clearAllData, 5000);
