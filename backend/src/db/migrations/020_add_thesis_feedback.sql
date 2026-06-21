-- 020: Add feedback column to thesis_submissions
ALTER TABLE thesis_submissions ADD COLUMN IF NOT EXISTS feedback TEXT;
