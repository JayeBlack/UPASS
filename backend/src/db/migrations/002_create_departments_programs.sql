-- ============================================================
-- 002: Departments & Programs
-- ============================================================

CREATE TABLE IF NOT EXISTS departments (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(150) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS programs (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(200) NOT NULL,
  code          VARCHAR(50) UNIQUE NOT NULL,
  department_id INTEGER REFERENCES departments(id) ON DELETE CASCADE,
  degree_type   VARCHAR(50) NOT NULL DEFAULT 'MSc', -- MSc, MPhil, PhD, PgD, D.Eng.
  duration_months INTEGER DEFAULT 24,
  is_active     BOOLEAN DEFAULT TRUE
);
