-- ============================================================
-- 003: Students
-- ============================================================

CREATE TABLE IF NOT EXISTS students (
  id              SERIAL PRIMARY KEY,
  user_id         INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  index_number    VARCHAR(50) UNIQUE NOT NULL,  -- e.g. UMaT/PG/0234/22
  program_id      INTEGER REFERENCES programs(id),
  department_id   INTEGER REFERENCES departments(id),
  admission_year  INTEGER NOT NULL,
  study_mode      VARCHAR(20) DEFAULT 'Full-time', -- Full-time, Part-time
  status          VARCHAR(20) DEFAULT 'Active',     -- Active, Inactive, Graduated, Deferred
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_students_index ON students(index_number);
CREATE INDEX idx_students_user ON students(user_id);
CREATE INDEX idx_students_program ON students(program_id);
