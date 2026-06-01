const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 4) {
    console.error('Usage: node create_superadmin.js <email> <password> <first_name> <last_name>');
    process.exit(1);
  }
  const [email, password, first_name, last_name] = args;

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const client = await pool.connect();
    try {
      const existing = await client.query('SELECT id FROM users WHERE email = $1', [email]);
      if (existing.rows.length > 0) {
        console.error('User with that email already exists.');
        process.exit(2);
      }
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      const res = await client.query(
        `INSERT INTO users (email, password_hash, role, first_name, last_name, is_super_admin)
         VALUES ($1, $2, 'Admin', $3, $4, TRUE) RETURNING id`,
        [email, hash, first_name, last_name]
      );
      console.log(`Created super-admin with id ${res.rows[0].id} and email ${email}`);
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Failed to create super-admin:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
