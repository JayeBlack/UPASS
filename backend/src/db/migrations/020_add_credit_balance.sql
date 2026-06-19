-- ============================================================
-- 020: Add credit_balance to fee_records
-- ============================================================

ALTER TABLE fee_records
  ADD COLUMN IF NOT EXISTS credit_balance NUMERIC(10,2) DEFAULT 0;
