const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function exportSchema() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log('\n' + '='.repeat(60));
    console.log('EXPORTING DATABASE SCHEMA');
    console.log('='.repeat(60) + '\n');
    
    const client = await pool.connect();
    
    try {
      // Get all tables in public schema
      const tablesResult = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        ORDER BY table_name
      `);
      
      console.log(`Found ${tablesResult.rows.length} tables\n`);
      
      let schemaSQL = `-- ============================================================
-- UPASS Database Schema Export
-- Generated: ${new Date().toISOString()}
-- ============================================================

-- Drop existing tables (careful!)
-- Uncomment the following lines if you want to recreate tables
-- DROP TABLE IF EXISTS clearance_steps CASCADE;
-- DROP TABLE IF EXISTS fee_records CASCADE;
-- DROP TABLE IF EXISTS grades CASCADE;
-- DROP TABLE IF EXISTS graduands CASCADE;
-- DROP TABLE IF EXISTS student_supervisors CASCADE;
-- DROP TABLE IF EXISTS supervisors CASCADE;
-- DROP TABLE IF EXISTS students CASCADE;
-- DROP TABLE IF EXISTS courses CASCADE;
-- DROP TABLE IF EXISTS programs CASCADE;
-- DROP TABLE IF EXISTS departments CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

BEGIN;

`;
      
      for (const row of tablesResult.rows) {
        const tableName = row.table_name;
        console.log(`Processing: ${tableName}`);
        
        // Get CREATE TABLE statement
        const createResult = await client.query(`
          SELECT 
            'CREATE TABLE ' || table_name || ' (' || 
            string_agg(
              column_name || ' ' || 
              data_type || 
              CASE 
                WHEN character_maximum_length IS NOT NULL 
                THEN '(' || character_maximum_length || ')'
                ELSE ''
              END ||
              CASE 
                WHEN is_nullable = 'NO' THEN ' NOT NULL'
                ELSE ''
              END ||
              CASE 
                WHEN column_default IS NOT NULL THEN ' DEFAULT ' || column_default
                ELSE ''
              END,
              ', '
            ) || 
            ');' as create_statement
          FROM information_schema.columns
          WHERE table_name = $1 AND table_schema = 'public'
          GROUP BY table_name
        `, [tableName]);
        
        if (createResult.rows.length > 0) {
          schemaSQL += `\n-- Table: ${tableName}\n`;
          schemaSQL += createResult.rows[0].create_statement + '\n';
        }
        
        // Get constraints
        const constraintsResult = await client.query(`
          SELECT conname, pg_get_constraintdef(oid) as condef
          FROM pg_constraint
          WHERE conrelid = $1::regclass
        `, [tableName]);
        
        for (const constraint of constraintsResult.rows) {
          schemaSQL += `ALTER TABLE ${tableName} ADD CONSTRAINT ${constraint.conname} ${constraint.condef};\n`;
        }
      }
      
      schemaSQL += `\nCOMMIT;\n`;
      
      // Write to file
      const outputPath = path.join(__dirname, 'schema_export.sql');
      fs.writeFileSync(outputPath, schemaSQL);
      
      console.log(`\n✅ Schema exported to: ${outputPath}\n`);
      console.log('='.repeat(60));
      
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('\n❌ Export failed:', err.message);
    console.error(err.stack);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

exportSchema();
