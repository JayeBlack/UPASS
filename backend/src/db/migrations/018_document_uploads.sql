-- ============================================================
-- 018: Document Uploads Enhancement
-- ============================================================

-- Create document_uploads table to track documents uploaded by dean/admin
CREATE TABLE IF NOT EXISTS document_uploads (
  id            SERIAL PRIMARY KEY,
  title         VARCHAR(200) NOT NULL,
  file_name     VARCHAR(255) NOT NULL,
  file_url      VARCHAR(500) NOT NULL,
  uploaded_by   INTEGER REFERENCES users(id),
  recipient_count INTEGER DEFAULT 0,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- Add columns to document_requests for uploaded files
ALTER TABLE document_requests 
ADD COLUMN IF NOT EXISTS file_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS upload_id INTEGER REFERENCES document_uploads(id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_document_uploads_uploaded_by ON document_uploads(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_document_requests_upload_id ON document_requests(upload_id);
