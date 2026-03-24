-- Improved XP and Badge System

-- Create function to add XP and level up users
CREATE OR REPLACE FUNCTION add_user_xp(user_id UUID, xp_amount INTEGER)
RETURNS TABLE(new_xp INTEGER, new_level INTEGER, leveled_up BOOLEAN) AS $$
DECLARE
  current_xp INTEGER;
  current_level INTEGER;
  new_xp_total INTEGER;
  new_level_calc INTEGER;
  did_level_up BOOLEAN := FALSE;
BEGIN
  -- Get current XP and level
  SELECT xp_points, level INTO current_xp, current_level
  FROM users WHERE id = user_id;
  
  -- Calculate new XP
  new_xp_total := current_xp + xp_amount;
  
  -- Calculate new level (every 500 XP = 1 level)
  new_level_calc := FLOOR(new_xp_total / 500) + 1;
  
  -- Check if leveled up
  IF new_level_calc > current_level THEN
    did_level_up := TRUE;
  END IF;
  
  -- Update user
  UPDATE users 
  SET xp_points = new_xp_total, level = new_level_calc
  WHERE id = user_id;
  
  RETURN QUERY SELECT new_xp_total, new_level_calc, did_level_up;
END;
$$ LANGUAGE plpgsql;

-- Create function to check and award badges
CREATE OR REPLACE FUNCTION check_and_award_badges(user_id UUID)
RETURNS void AS $$
DECLARE
  badge_record RECORD;
  user_stat INTEGER;
BEGIN
  -- Loop through all badges
  FOR badge_record IN SELECT * FROM badges LOOP
    -- Check if user already has this badge
    IF NOT EXISTS (
      SELECT 1 FROM user_badges 
      WHERE user_badges.user_id = check_and_award_badges.user_id 
      AND badge_id = badge_record.id
    ) THEN
      -- Check badge requirements
      CASE badge_record.requirement_type
        WHEN 'materials_uploaded' THEN
          SELECT COUNT(*) INTO user_stat FROM materials WHERE uploaded_by = check_and_award_badges.user_id;
        WHEN 'discussions_created' THEN
          SELECT COUNT(*) INTO user_stat FROM forum_discussions WHERE forum_discussions.user_id = check_and_award_badges.user_id;
        WHEN 'comments_posted' THEN
          SELECT COUNT(*) INTO user_stat FROM forum_comments WHERE forum_comments.user_id = check_and_award_badges.user_id;
        WHEN 'quizzes_completed' THEN
          SELECT COUNT(*) INTO user_stat FROM quiz_attempts WHERE quiz_attempts.user_id = check_and_award_badges.user_id;
        WHEN 'xp_earned' THEN
          SELECT xp_points INTO user_stat FROM users WHERE id = check_and_award_badges.user_id;
        WHEN 'level_reached' THEN
          SELECT level INTO user_stat FROM users WHERE id = check_and_award_badges.user_id;
        ELSE
          user_stat := 0;
      END CASE;
      
      -- Award badge if requirement met
      IF user_stat >= badge_record.requirement_value THEN
        INSERT INTO user_badges (user_id, badge_id)
        VALUES (check_and_award_badges.user_id, badge_record.id);
        
        -- Create notification
        INSERT INTO notifications (user_id, type, title, message)
        VALUES (
          check_and_award_badges.user_id,
          'badge_earned',
          'Nuovo Badge Sbloccato!',
          'Hai sbloccato il badge: ' || badge_record.name
        );
      END IF;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically award XP for actions
CREATE OR REPLACE FUNCTION award_xp_for_material()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM add_user_xp(NEW.uploaded_by, 50);
  PERFORM check_and_award_badges(NEW.uploaded_by);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION award_xp_for_discussion()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM add_user_xp(NEW.user_id, 30);
  PERFORM check_and_award_badges(NEW.user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION award_xp_for_comment()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM add_user_xp(NEW.user_id, 10);
  PERFORM check_and_award_badges(NEW.user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION award_xp_for_quiz()
RETURNS TRIGGER AS $$
BEGIN
  -- Award XP based on score (max 100 XP)
  PERFORM add_user_xp(NEW.user_id, GREATEST(NEW.score, 20));
  PERFORM check_and_award_badges(NEW.user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS award_xp_material ON materials;
DROP TRIGGER IF EXISTS award_xp_discussion ON forum_discussions;
DROP TRIGGER IF EXISTS award_xp_comment ON forum_comments;
DROP TRIGGER IF EXISTS award_xp_quiz ON quiz_attempts;

-- Create triggers
CREATE TRIGGER award_xp_material
AFTER INSERT ON materials
FOR EACH ROW
EXECUTE FUNCTION award_xp_for_material();

CREATE TRIGGER award_xp_discussion
AFTER INSERT ON forum_discussions
FOR EACH ROW
EXECUTE FUNCTION award_xp_for_discussion();

CREATE TRIGGER award_xp_comment
AFTER INSERT ON forum_comments
FOR EACH ROW
EXECUTE FUNCTION award_xp_for_comment();

CREATE TRIGGER award_xp_quiz
AFTER INSERT ON quiz_attempts
FOR EACH ROW
EXECUTE FUNCTION award_xp_for_quiz();
