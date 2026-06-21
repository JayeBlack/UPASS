const fs = require('fs');
const path = require('path');
const db = require('./src/db');

async function runSupervisorResourcesMigration() {
  try {
    console.log('🔧 Running Supervisor Resources Migration...\n');
    
    const migrationPath = path.join(__dirname, 'src', 'db', 'migrations', '022_fix_supervisor_resources.sql');
    
    if (!fs.existsSync(migrationPath)) {
      console.error('❌ Migration file not found:', migrationPath);
      process.exit(1);
    }
    
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📄 Executing migration SQL...');
    await db.query(migrationSQL);
    
    console.log('✅ Migration completed successfully!');
    
    // Verify the fix
    console.log('\n🔍 Verifying migration...');
    
    const verifications = [
      { 
        query: "SELECT column_name FROM information_schema.columns WHERE table_name = 'resources' AND column_name = 'recipient_student_ids'",
        check: 'resources.recipient_student_ids column'
      },
      {
        query: "SELECT column_name FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'recipient_student_ids'", 
        check: 'announcements.recipient_student_ids column'
      },
      {
        query: "SELECT table_name FROM information_schema.tables WHERE table_name = 'student_resource_reads'",
        check: 'student_resource_reads table'
      }
    ];
    
    for (const verification of verifications) {
      try {
        const result = await db.query(verification.query);
        if (result.rows.length > 0) {
          console.log(`✅ ${verification.check} exists`);
        } else {
          console.log(`❌ ${verification.check} missing`);
        }
      } catch (err) {
        console.log(`❌ ${verification.check} check failed:`, err.message);
      }
    }
    
    console.log('\n🎉 Supervisor resources upload should now work!');
    console.log('📋 What was fixed:');
    console.log('   • Added recipient_student_ids column to resources table');
    console.log('   • Added recipient_student_ids column to announcements table');
    console.log('   • Created student_resource_reads table for tracking');
    console.log('   • Added performance indexes');
    
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    console.error(err.stack);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

console.log('=== SUPERVISOR RESOURCES MIGRATION ===');
console.log('This will fix the "recipient_id column missing" error');
console.log('when supervisors try to upload resources to students.\n');

runSupervisorResourcesMigration();