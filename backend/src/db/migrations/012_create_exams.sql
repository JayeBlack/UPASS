-- ============================================================
-- 012: Exam Timetable
-- ============================================================

CREATE TABLE IF NOT EXISTS exam_timetable (
  id            SERIAL PRIMARY KEY,
  course_id     INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  exam_date     DATE NOT NULL,
  start_time    TIME NOT NULL,
  duration      VARCHAR(20) NOT NULL,   -- e.g. "3 hrs"
  venue         VARCHAR(200),
  exam_type     VARCHAR(20) DEFAULT 'Written',  -- Written, Practical
  semester      INTEGER NOT NULL,
  academic_year VARCHAR(20) NOT NULL,
  created_at    TIMESTAMP DEFAULT NOW()
);
