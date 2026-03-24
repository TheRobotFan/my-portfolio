-- Update the check_and_award_badges function to handle different badge types
CREATE OR REPLACE FUNCTION check_and_award_badges(user_id UUID)
RETURNS void AS $$
DECLARE
  user_xp INTEGER;
  quiz_count INTEGER;
  materials_count INTEGER;
  discussions_count INTEGER;
  comments_count INTEGER;
  badge_record RECORD;
BEGIN
  -- Get user stats
  SELECT xp_points INTO user_xp FROM users WHERE id = user_id;
  
  SELECT COUNT(*) INTO quiz_count FROM quiz_attempts WHERE user_id = user_id;
  SELECT COUNT(*) INTO materials_count FROM materials WHERE uploaded_by = user_id;
  SELECT COUNT(*) INTO discussions_count FROM forum_discussions WHERE user_id = user_id;
  SELECT COUNT(*) INTO comments_count FROM forum_comments WHERE user_id = user_id;
  
  -- Check all badges
  FOR badge_record IN SELECT * FROM badges LOOP
    -- Check if badge should be awarded
    IF (badge_record.requirement_type = 'xp' AND user_xp >= badge_record.requirement_value) OR
       (badge_record.requirement_type = 'quiz_completed' AND quiz_count >= badge_record.requirement_value) OR
       (badge_record.requirement_type = 'materials_uploaded' AND materials_count >= badge_record.requirement_value) OR
       (badge_record.requirement_type = 'discussions_created' AND discussions_count >= badge_record.requirement_value) OR
       (badge_record.requirement_type = 'forum_replies' AND comments_count >= badge_record.requirement_value) THEN
      
      -- Award badge if not already earned
      INSERT INTO user_badges (user_id, badge_id)
      VALUES (user_id, badge_record.id)
      ON CONFLICT DO NOTHING;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user rank
CREATE OR REPLACE FUNCTION get_user_rank(user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  user_rank INTEGER;
BEGIN
  SELECT COUNT(*) + 1 INTO user_rank
  FROM users
  WHERE xp_points > (SELECT xp_points FROM users WHERE id = user_id);
  
  RETURN user_rank;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile when auth user is created
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role, xp_points, level)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    0,
    1
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
