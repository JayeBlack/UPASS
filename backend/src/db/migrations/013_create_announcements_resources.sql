-- ============================================================
-- 013: Supervisor Announcements & Resources
-- ============================================================

CREATE TABLE IF NOT EXISTS announcements (
  id              SERIAL PRIMARY KEY,
  author_id       INTEGER REFERENCES users(id) ON DELETE CASCADE,
  text            TEXT NOT NULL,
  visibility      VARCHAR(100) DEFAULT 'All Students',  -- 'All Students' or specific student name
  attachment_name VARCHAR(255),
  attachment_url  TEXT,
  scheduled_at    TIMESTAMP,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS announcement_reads (
  id              SERIAL PRIMARY KEY,
  announcement_id INTEGER REFERENCES announcements(id) ON DELETE CASCADE,
  user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
  read_at         TIMESTAMP DEFAULT NOW(),
  UNIQUE(announcement_id, user_id)
);

CREATE TABLE IF NOT EXISTS resources (
  id            SERIAL PRIMARY KEY,
  uploaded_by   INTEGER REFERENCES users(id) ON DELETE CASCADE,
  file_name     VARCHAR(255) NOT NULL,
  file_url      TEXT,
  file_type     VARCHAR(20),     -- PDF, DOCX, PPTX, ZIP
  file_size     VARCHAR(20),
  category      VARCHAR(100),    -- Report Template, Guidelines, Rubric, etc.
  description   TEXT,
  uploaded_at   TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- Pass List / Graduands
-- ============================================================

CREATE TABLE IF NOT EXISTS graduands (
  id            SERIAL PRIMARY KEY,
  student_id    INTEGER REFERENCES students(id) ON DELETE CASCADE,
  academic_year VARCHAR(20) NOT NULL,
  cwa           NUMERIC(5,2),
  status        VARCHAR(20) DEFAULT 'Eligible',  -- Eligible, Ineligible, Pass, Fail
  created_at    TIMESTAMP DEFAULT NOW()
);
