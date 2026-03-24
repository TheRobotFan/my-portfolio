-- Add additional profile fields to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS first_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS last_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS city VARCHAR(100),
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS birth_date DATE,
ADD COLUMN IF NOT EXISTS profile_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create index for profile completion checks
CREATE INDEX IF NOT EXISTS idx_users_profile_completed ON users(profile_completed);

-- Update existing users to split full_name into first_name and last_name
UPDATE users
SET 
  first_name = SPLIT_PART(full_name, ' ', 1),
  last_name = CASE 
    WHEN ARRAY_LENGTH(STRING_TO_ARRAY(full_name, ' '), 1) > 1 
    THEN SUBSTRING(full_name FROM LENGTH(SPLIT_PART(full_name, ' ', 1)) + 2)
    ELSE ''
  END
WHERE first_name IS NULL;

-- Create function to update last activity
CREATE OR REPLACE FUNCTION update_user_last_activity()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users SET last_activity = NOW() WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update last activity
DROP TRIGGER IF EXISTS update_last_activity_materials ON materials;
CREATE TRIGGER update_last_activity_materials
AFTER INSERT ON materials
FOR EACH ROW
EXECUTE FUNCTION update_user_last_activity();

DROP TRIGGER IF EXISTS update_last_activity_discussions ON forum_discussions;
CREATE TRIGGER update_last_activity_discussions
AFTER INSERT ON forum_discussions
FOR EACH ROW
EXECUTE FUNCTION update_user_last_activity();

DROP TRIGGER IF EXISTS update_last_activity_comments ON forum_comments;
CREATE TRIGGER update_last_activity_comments
AFTER INSERT ON forum_comments
FOR EACH ROW
EXECUTE FUNCTION update_user_last_activity();
