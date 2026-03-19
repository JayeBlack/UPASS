-- ============================================================
-- 010: Document Requests
-- ============================================================

CREATE TABLE IF NOT EXISTS document_requests (
  id            SERIAL PRIMARY KEY,
  student_id    INTEGER REFERENCES students(id) ON DELETE CASCADE,
  doc_type      VARCHAR(100) NOT NULL,   -- Recommendation Letter, Attestation Letter, Transcript, etc.
  purpose       TEXT,
  status        VARCHAR(20) DEFAULT 'Pending',   -- Pending, Processing, Ready
  requested_at  TIMESTAMP DEFAULT NOW(),
  completed_at  TIMESTAMP,
  processed_by  INTEGER REFERENCES users(id)
);
