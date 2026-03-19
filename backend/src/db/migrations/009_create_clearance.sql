-- ============================================================
-- 009: Graduation Clearance
-- ============================================================

CREATE TABLE IF NOT EXISTS clearance_steps (
  id            SERIAL PRIMARY KEY,
  student_id    INTEGER REFERENCES students(id) ON DELETE CASCADE,
  department    VARCHAR(100) NOT NULL,   -- School Fees, Library, Department, Thesis, ICT, Dean
  description   TEXT,
  status        VARCHAR(20) DEFAULT 'not_started',  -- cleared, pending, not_started
  cleared_by    VARCHAR(150),
  cleared_at    TIMESTAMP,
  note          TEXT,
  step_order    INTEGER DEFAULT 0,
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_clearance_student ON clearance_steps(student_id);
