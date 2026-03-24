-- Create forum_comments table
CREATE TABLE IF NOT EXISTS forum_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id UUID NOT NULL REFERENCES forum_discussions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create material_comments table
CREATE TABLE IF NOT EXISTS material_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_forum_comments_discussion ON forum_comments(discussion_id);
CREATE INDEX IF NOT EXISTS idx_material_comments_material ON material_comments(material_id);

-- Enable RLS
ALTER TABLE forum_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for forum_comments
CREATE POLICY "Anyone can view forum comments"
  ON forum_comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create forum comments"
  ON forum_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own forum comments"
  ON forum_comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own forum comments"
  ON forum_comments FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for material_comments
CREATE POLICY "Anyone can view material comments"
  ON material_comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create material comments"
  ON material_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own material comments"
  ON material_comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own material comments"
  ON material_comments FOR DELETE
  USING (auth.uid() = user_id);

-- Function to make a user admin
-- Usage: SELECT make_user_admin('user-email@example.com');
CREATE OR REPLACE FUNCTION make_user_admin(user_email TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE users
  SET role = 'admin'
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
