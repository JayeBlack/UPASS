-- ============================================================
-- 019: Supervisor Resources and Announcements
-- ============================================================

-- Supervisor resources table
CREATE TABLE IF NOT EXISTS supervisor_resources (
  id            SERIAL PRIMARY KEY,
  supervisor_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title         VARCHAR(255) NOT NULL,
  file_url      VARCHAR(500) NOT NULL,
  category      VARCHAR(100) NOT NULL,
  description   TEXT,
  file_size     BIGINT,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- Resource recipients tracking
CREATE TABLE IF NOT EXISTS supervisor_resource_recipients (
  id            SERIAL PRIMARY KEY,
  resource_id   INTEGER REFERENCES supervisor_resources(id) ON DELETE CASCADE,
  student_id    INTEGER REFERENCES students(id) ON DELETE CASCADE,
  created_at    TIMESTAMP DEFAULT NOW(),
  UNIQUE(resource_id, student_id)
);

-- Supervisor announcements table
CREATE TABLE IF NOT EXISTS supervisor_announcements (
  id            SERIAL PRIMARY KEY,
  supervisor_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  text          TEXT NOT NULL,
  visibility    VARCHAR(50) DEFAULT 'All Students',
  scheduled_at  TIMESTAMP,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- Announcement recipients tracking
CREATE TABLE IF NOT EXISTS supervisor_announcement_recipients (
  id               SERIAL PRIMARY KEY,
  announcement_id  INTEGER REFERENCES supervisor_announcements(id) ON DELETE CASCADE,
  student_id       INTEGER REFERENCES students(id) ON DELETE CASCADE,
  is_read          BOOLEAN DEFAULT FALSE,
  created_at       TIMESTAMP DEFAULT NOW(),
  UNIQUE(announcement_id, student_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_supervisor_resources_supervisor ON supervisor_resources(supervisor_id);
CREATE INDEX IF NOT EXISTS idx_supervisor_announcements_supervisor ON supervisor_announcements(supervisor_id);
CREATE INDEX IF NOT EXISTS idx_resource_recipients_student ON supervisor_resource_recipients(student_id);
CREATE INDEX IF NOT EXISTS idx_announcement_recipients_student ON supervisor_announcement_recipients(student_id);
