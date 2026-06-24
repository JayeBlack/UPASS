-- ============================================================
-- 022: Fix Supervisor Resources Schema
-- ============================================================
-- This migration fixes missing columns and tables for supervisor resources functionality

-- Add missing columns to resources table
ALTER TABLE resources 
ADD COLUMN IF NOT EXISTS recipient_student_ids JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS name VARCHAR(255);

-- Add missing recipient_student_ids column to announcements table  
ALTER TABLE announcements
ADD COLUMN IF NOT EXISTS recipient_student_ids JSONB DEFAULT '[]';

-- Create student_resource_reads table for tracking read status
CREATE TABLE IF NOT EXISTS student_resource_reads (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
  item_type VARCHAR(50) NOT NULL,
  item_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, item_type, item_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_student_resource_reads_student ON student_resource_reads(student_id);
CREATE INDEX IF NOT EXISTS idx_student_resource_reads_item ON student_resource_reads(item_type, item_id);
CREATE INDEX IF NOT EXISTS idx_resources_recipient_ids ON resources USING GIN(recipient_student_ids);
CREATE INDEX IF NOT EXISTS idx_announcements_recipient_ids ON announcements USING GIN(recipient_student_ids);