
-- Storage bucket for thesis files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'thesis-files',
  'thesis-files',
  true,
  52428800, -- 50MB
  ARRAY['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;

-- Permissive storage policies (prototype — auth comes with Node backend migration)
CREATE POLICY "Public thesis upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'thesis-files');

CREATE POLICY "Public thesis read"
ON storage.objects FOR SELECT
USING (bucket_id = 'thesis-files');

CREATE POLICY "Public thesis delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'thesis-files');

-- Thesis submissions table
CREATE TABLE public.thesis_submissions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id    TEXT NOT NULL,
  student_name  TEXT NOT NULL,
  student_index TEXT,
  department    TEXT,
  stage         TEXT NOT NULL,
  file_path     TEXT NOT NULL,
  file_name     TEXT NOT NULL,
  file_size     BIGINT,
  status        TEXT NOT NULL DEFAULT 'Pending',
  feedback      TEXT,
  reviewed_by   TEXT,
  reviewed_at   TIMESTAMPTZ,
  submitted_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.thesis_submissions TO anon, authenticated;
GRANT ALL ON public.thesis_submissions TO service_role;

ALTER TABLE public.thesis_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read submissions"
ON public.thesis_submissions FOR SELECT USING (true);

CREATE POLICY "Anyone can insert submissions"
ON public.thesis_submissions FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update submissions"
ON public.thesis_submissions FOR UPDATE USING (true);

CREATE INDEX idx_thesis_student ON public.thesis_submissions(student_id);
CREATE INDEX idx_thesis_status ON public.thesis_submissions(status);
