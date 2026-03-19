-- ============================================================
-- 007: Grades & Results
-- ============================================================

CREATE TABLE IF NOT EXISTS grades (
  id            SERIAL PRIMARY KEY,
  student_id    INTEGER REFERENCES students(id) ON DELETE CASCADE,
  course_id     INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  grade         VARCHAR(5) NOT NULL,
  marks         NUMERIC(5,2),
  semester      INTEGER NOT NULL,
  academic_year VARCHAR(20) NOT NULL,
  entered_by    INTEGER REFERENCES users(id),
  entered_at    TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, course_id, academic_year)
);

CREATE TABLE IF NOT EXISTS result_batches (
  id            SERIAL PRIMARY KEY,
  semester      VARCHAR(20) NOT NULL,
  academic_year VARCHAR(20) NOT NULL,
  department_id INTEGER REFERENCES departments(id),
  program_id    INTEGER REFERENCES programs(id),
  student_count INTEGER DEFAULT 0,
  status        VARCHAR(20) DEFAULT 'Draft',    -- Draft, Published
  published_at  TIMESTAMP,
  published_by  INTEGER REFERENCES users(id),
  created_at    TIMESTAMP DEFAULT NOW()
);
