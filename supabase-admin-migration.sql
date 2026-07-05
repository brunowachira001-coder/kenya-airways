-- Admin dashboard: page_visits table for tracking visitor funnel
CREATE TABLE IF NOT EXISTS page_visits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  page TEXT NOT NULL,
  step INTEGER,
  email TEXT,
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_page_visits_session ON page_visits(session_id);
CREATE INDEX IF NOT EXISTS idx_page_visits_created ON page_visits(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_visits_step ON page_visits(step);

-- RLS: allow public insert (tracking pixel), service role reads everything
ALTER TABLE page_visits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert" ON page_visits FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role read" ON page_visits FOR SELECT USING (true);
