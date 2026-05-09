-- ============================================================
-- 014: Align backend schema with current frontend
--   - Extend user_role enum (ViceDean, Registrar, AssistantRegistrar,
--     AdminAssistant, AccountingAssistant)
--   - Add departmental scoping + super admin flag on users
--   - Add admission_cycle (January / June) on students
--   - Add payment provider (Paystack / Hubtel / Manual) on payments
--   - Audit logs for Admin SystemLog page
-- ============================================================

-- Extend role enum (idempotent)
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'ViceDean';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'Registrar';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'AssistantRegistrar';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'AdminAssistant';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'AccountingAssistant';

-- Departmental scoping for Admin role + Super Admin flag
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS department_id   INTEGER REFERENCES departments(id),
  ADD COLUMN IF NOT EXISTS is_super_admin  BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_users_department ON users(department_id);

-- Dual admission cycles (memory: January & June)
ALTER TABLE students
  ADD COLUMN IF NOT EXISTS admission_cycle VARCHAR(20) DEFAULT 'January';

-- Track payment provider for hybrid online + manual flow
ALTER TABLE payments
  ADD COLUMN IF NOT EXISTS provider VARCHAR(30) DEFAULT 'Manual';
    -- Paystack, Hubtel, Manual (bank receipt upload)

-- Audit logs (Admin → SystemLog page)
CREATE TABLE IF NOT EXISTS audit_logs (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER REFERENCES users(id) ON DELETE SET NULL,
  actor_name  VARCHAR(255),
  actor_role  user_role,
  action      VARCHAR(100) NOT NULL,
  entity      VARCHAR(100),
  entity_id   VARCHAR(100),
  details     JSONB,
  ip_address  VARCHAR(50),
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at DESC);