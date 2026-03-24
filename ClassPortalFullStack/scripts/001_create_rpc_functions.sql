-- Function to increment exercise views
CREATE OR REPLACE FUNCTION increment_exercise_views(exercise_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE exercises
  SET views_count = COALESCE(views_count, 0) + 1
  WHERE id = exercise_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment material downloads
CREATE OR REPLACE FUNCTION increment_material_downloads(material_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE materials
  SET downloads_count = COALESCE(downloads_count, 0) + 1
  WHERE id = material_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add XP to user and update level
CREATE OR REPLACE FUNCTION add_user_xp(user_id UUID, xp_amount INTEGER)
RETURNS void AS $$
DECLARE
  current_xp INTEGER;
  new_xp INTEGER;
  new_level INTEGER;
BEGIN
  -- Get current XP
  SELECT xp_points INTO current_xp FROM users WHERE id = user_id;
  
  -- Calculate new XP
  new_xp := COALESCE(current_xp, 0) + xp_amount;
  
  -- Calculate new level (every 100 XP = 1 level)
  new_level := FLOOR(new_xp / 100) + 1;
  
  -- Update user
  UPDATE users
  SET xp_points = new_xp,
      level = new_level
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check and award badges
CREATE OR REPLACE FUNCTION check_and_award_badges(user_id UUID)
RETURNS void AS $$
DECLARE
  user_xp INTEGER;
  badge_record RECORD;
BEGIN
  -- Get user XP
  SELECT xp_points INTO user_xp FROM users WHERE id = user_id;
  
  -- Check all badges
  FOR badge_record IN 
    SELECT * FROM badges 
    WHERE requirement_type = 'xp' 
    AND requirement_value <= user_xp
  LOOP
    -- Award badge if not already earned
    INSERT INTO user_badges (user_id, badge_id)
    VALUES (user_id, badge_record.id)
    ON CONFLICT DO NOTHING;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
