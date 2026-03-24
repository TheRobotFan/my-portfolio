-- Create featured_contributors table for admin-managed top contributors
CREATE TABLE IF NOT EXISTS featured_contributors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  contributions INT NOT NULL DEFAULT 0,
  stars INT NOT NULL DEFAULT 0,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE featured_contributors ENABLE ROW LEVEL SECURITY;

-- Everyone can view featured contributors
CREATE POLICY "Anyone can view featured contributors"
  ON featured_contributors FOR SELECT
  USING (true);

-- Only admins can manage featured contributors
CREATE POLICY "Admins can manage featured contributors"
  ON featured_contributors FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_featured_contributors_order ON featured_contributors(display_order);

-- Function to get featured contributors
CREATE OR REPLACE FUNCTION get_featured_contributors()
RETURNS TABLE (
  id UUID,
  user_id UUID,
  full_name TEXT,
  avatar_url TEXT,
  contributions INT,
  stars INT,
  display_order INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    fc.id,
    fc.user_id,
    u.full_name,
    u.avatar_url,
    fc.contributions,
    fc.stars,
    fc.display_order
  FROM featured_contributors fc
  JOIN users u ON u.id = fc.user_id
  ORDER BY fc.display_order ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
