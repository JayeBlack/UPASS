const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Maps stale short name -> correct full name already in departments table
const REMAP = {
  'Computer Science': 'Computer Science and Engineering',
  'Electrical Engineering': 'Electrical and Electronic Engineering',
};

async function removeStale() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    for (const [staleName, correctName] of Object.entries(REMAP)) {
      // Get stale dept id
      const staleRes = await client.query('SELECT id FROM departments WHERE name = $1', [staleName]);
      if (staleRes.rows.length === 0) {
        console.log(`ℹ️  Not found: "${staleName}" — skipping`);
        continue;
      }
      const staleId = staleRes.rows[0].id;

      // Get correct dept id
      const correctRes = await client.query('SELECT id FROM departments WHERE name = $1', [correctName]);
      if (correctRes.rows.length === 0) {
        console.log(`⚠️  Correct dept not found: "${correctName}" — skipping`);
        continue;
      }
      const correctId = correctRes.rows[0].id;

      // Reassign all foreign key references
      const tables = [
        { table: 'supervisors', col: 'department_id' },
        { table: 'students', col: 'department_id' },
        { table: 'programs', col: 'department_id' },
        { table: 'users', col: 'department_id' },
      ];
      for (const { table, col } of tables) {
        const upd = await client.query(
          `UPDATE ${table} SET ${col} = $1 WHERE ${col} = $2`,
          [correctId, staleId]
        );
        if (upd.rowCount > 0) console.log(`   ↳ Reassigned ${upd.rowCount} row(s) in ${table}`);
      }

      // Now safe to delete
      await client.query('DELETE FROM departments WHERE id = $1', [staleId]);
      console.log(`✅ Removed: "${staleName}" → reassigned to "${correctName}"`);
    }

    await client.query('COMMIT');

    const remaining = await client.query('SELECT name FROM departments ORDER BY name');
    console.log(`\n📋 Remaining departments (${remaining.rows.length}):`);
    remaining.rows.forEach(d => console.log(`   • ${d.name}`));
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

removeStale().catch(err => { console.error('❌', err.message); process.exit(1); });
