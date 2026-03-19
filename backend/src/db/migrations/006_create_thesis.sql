-- ============================================================
-- 006: Thesis Submissions
-- ============================================================

CREATE TABLE IF NOT EXISTS thesis_submissions (
  id            SERIAL PRIMARY KEY,
  student_id    INTEGER REFERENCES students(id) ON DELETE CASCADE,
  stage         VARCHAR(50) NOT NULL,  -- Proposal, Chapter 1..5, Defense
  file_url      TEXT,
  file_name     VARCHAR(255),
  status        VARCHAR(20) DEFAULT 'Pending',  -- Pending, Reviewed, Approved, Rejected
  submitted_at  TIMESTAMP DEFAULT NOW(),
  reviewed_at   TIMESTAMP,
  reviewed_by   INTEGER REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS thesis_remarks (
  id              SERIAL PRIMARY KEY,
  submission_id   INTEGER REFERENCES thesis_submissions(id) ON DELETE CASCADE,
  author_id       INTEGER REFERENCES users(id),
  remark_text     TEXT NOT NULL,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_thesis_student ON thesis_submissions(student_id);
CREATE INDEX idx_thesis_status ON thesis_submissions(status);
