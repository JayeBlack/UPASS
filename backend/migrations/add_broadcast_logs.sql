-- broadcast_logs: tracks fee notices sent by accountants
CREATE TABLE IF NOT EXISTS broadcast_logs (
  id SERIAL PRIMARY KEY,
  sent_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'general',
  recipient_count INTEGER DEFAULT 0,
  download_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
