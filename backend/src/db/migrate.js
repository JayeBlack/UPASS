/**
 * Database migration runner
 * Usage: node src/db/migrate.js
 *
 * Runs all SQL migration files in order from src/db/migrations/
 */
const fs = require("fs");
const path = require("path");
const db = require("./index");

async function migrate() {
  const migrationsDir = path.join(__dirname, "migrations");
  const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith(".sql")).sort();

  console.log(`Found ${files.length} migration(s)...\n`);

  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf-8");
    console.log(`▶ Running ${file}...`);
    try {
      await db.query(sql);
      console.log(`  ✓ ${file} applied successfully`);
    } catch (err) {
      console.error(`  ✗ ${file} failed:`, err.message);
      process.exit(1);
    }
  }

  console.log("\n✅ All migrations applied successfully!");
  process.exit(0);
}

migrate();
