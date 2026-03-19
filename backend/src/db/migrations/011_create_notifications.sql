-- ============================================================
-- 011: Notifications
-- ============================================================

CREATE TABLE IF NOT EXISTS notifications (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title         VARCHAR(255) NOT NULL,
  message       TEXT NOT NULL,
  type          VARCHAR(50) DEFAULT 'general',    -- fee, thesis, exam, general, clearance, report, admin
  severity      VARCHAR(20) DEFAULT 'info',       -- info, warning, success
  is_read       BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
