-- ============================================================
-- 005: Courses & Registration
-- ============================================================

CREATE TABLE IF NOT EXISTS courses (
  id            SERIAL PRIMARY KEY,
  code          VARCHAR(20) UNIQUE NOT NULL,
  name          VARCHAR(200) NOT NULL,
  credits       INTEGER NOT NULL DEFAULT 3,
  program_id    INTEGER REFERENCES programs(id),
  semester      INTEGER NOT NULL DEFAULT 1,       -- 1 or 2
  academic_year VARCHAR(20) NOT NULL,             -- e.g. 2025/2026
  course_type   VARCHAR(20) DEFAULT 'elective',   -- core, elective
  is_active     BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS course_registrations (
  id            SERIAL PRIMARY KEY,
  student_id    INTEGER REFERENCES students(id) ON DELETE CASCADE,
  course_id     INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  semester      INTEGER NOT NULL,
  academic_year VARCHAR(20) NOT NULL,
  status        VARCHAR(20) DEFAULT 'Registered', -- Registered, Dropped, Approved
  registered_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, course_id, academic_year)
);
