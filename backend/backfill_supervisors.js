require('dotenv').config();
const db = require('./src/db');

async function main() {
  const result = await db.query(`
    INSERT INTO supervisors (user_id, staff_id, department_id, is_active)
    SELECT u.id, UPPER(SPLIT_PART(u.email, '@', 1)), u.department_id, TRUE
    FROM users u
    WHERE u.role = 'Supervisor'
      AND u.id NOT IN (SELECT user_id FROM supervisors)
    RETURNING id, user_id
  `);
  console.log(`Backfilled ${result.rows.length} supervisor records:`, result.rows);
  process.exit(0);
}

main().catch(e => { console.error(e.message); process.exit(1); });
