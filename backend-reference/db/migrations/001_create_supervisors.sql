-- Run this SQL against your PostgreSQL database to create the supervisors table

CREATE TABLE IF NOT EXISTS supervisors (
  id            SERIAL PRIMARY KEY,
  staff_id      VARCHAR(50) UNIQUE NOT NULL,
  first_name    VARCHAR(100) NOT NULL,
  last_name     VARCHAR(100) NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  department    VARCHAR(150) NOT NULL,
  phone         VARCHAR(20),
  avatar_url    TEXT,
  title         VARCHAR(50) DEFAULT 'Dr.',
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX idx_supervisors_email ON supervisors(email);
CREATE INDEX idx_supervisors_staff_id ON supervisors(staff_id);
CREATE INDEX idx_supervisors_department ON supervisors(department);
