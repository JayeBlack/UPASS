-- ============================================================
-- 004: Supervisors
-- ============================================================

CREATE TABLE IF NOT EXISTS supervisors (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  staff_id      VARCHAR(50) UNIQUE NOT NULL,
  department_id INTEGER REFERENCES departments(id),
  title         VARCHAR(50) DEFAULT 'Dr.',
  specialization TEXT,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);

-- Student-Supervisor assignments
CREATE TABLE IF NOT EXISTS student_supervisors (
  id            SERIAL PRIMARY KEY,
  student_id    INTEGER REFERENCES students(id) ON DELETE CASCADE,
  supervisor_id INTEGER REFERENCES supervisors(id) ON DELETE CASCADE,
  assigned_at   TIMESTAMP DEFAULT NOW(),
  is_primary    BOOLEAN DEFAULT TRUE,
  UNIQUE(student_id, supervisor_id)
);
