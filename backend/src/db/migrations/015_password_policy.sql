-- ============================================================
-- 015: Password policy (force change on first login)
-- ============================================================

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS last_password_change TIMESTAMP;

-- Existing accounts created before this migration should not be forced to change
-- (only newly created ones via admin/student enrollment will start with TRUE).
UPDATE users SET must_change_password = FALSE WHERE last_password_change IS NULL;