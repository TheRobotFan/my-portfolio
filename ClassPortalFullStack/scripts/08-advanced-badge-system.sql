-- Add new fields to track user activity for time-based badges
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_activity_date DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS consecutive_active_days INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_active_days INTEGER DEFAULT 0;

-- Create function to update user activity tracking
CREATE OR REPLACE FUNCTION update_user_activity()
RETURNS TRIGGER AS $$
DECLARE
  last_activity DATE;
  consecutive_days INTEGER;
  total_days INTEGER;
BEGIN
  -- Get current activity data
  SELECT last_activity_date, consecutive_active_days, total_active_days
  INTO last_activity, consecutive_days, total_days
  FROM users WHERE id = NEW.user_id OR id = NEW.uploaded_by;
  
  -- If activity is today, do nothing
  IF last_activity = CURRENT_DATE THEN
    RETURN NEW;
  END IF;
  
  -- If activity was yesterday, increment consecutive days
  IF last_activity = CURRENT_DATE - INTERVAL '1 day' THEN
    consecutive_days := consecutive_days + 1;
  -- If activity was more than 1 day ago, reset consecutive days
  ELSIF last_activity < CURRENT_DATE - INTERVAL '1 day' OR last_activity IS NULL THEN
    consecutive_days := 1;
  END IF;
  
  -- Increment total active days
  total_days := COALESCE(total_days, 0) + 1;
  
  -- Update user activity
  UPDATE users 
  SET 
    last_activity_date = CURRENT_DATE,
    consecutive_active_days = consecutive_days,
    total_active_days = total_days
  WHERE id = NEW.user_id OR id = NEW.uploaded_by;
  
  -- Check for activity-based badges
  PERFORM check_and_award_badges(COALESCE(NEW.user_id, NEW.uploaded_by));
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for activity tracking
DROP TRIGGER IF EXISTS track_activity_materials ON materials;
CREATE TRIGGER track_activity_materials
AFTER INSERT ON materials
FOR EACH ROW
EXECUTE FUNCTION update_user_activity();

DROP TRIGGER IF EXISTS track_activity_discussions ON forum_discussions;
CREATE TRIGGER track_activity_discussions
AFTER INSERT ON forum_discussions
FOR EACH ROW
EXECUTE FUNCTION update_user_activity();

DROP TRIGGER IF EXISTS track_activity_comments ON forum_comments;
CREATE TRIGGER track_activity_comments
AFTER INSERT ON forum_comments
FOR EACH ROW
EXECUTE FUNCTION update_user_activity();

DROP TRIGGER IF EXISTS track_activity_quiz ON quiz_attempts;
CREATE TRIGGER track_activity_quiz
AFTER INSERT ON quiz_attempts
FOR EACH ROW
EXECUTE FUNCTION update_user_activity();

-- Update check_and_award_badges to include activity-based badges
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
        WHEN 'consecutive_days' THEN
          SELECT consecutive_active_days INTO user_stat FROM users WHERE id = check_and_award_badges.user_id;
        WHEN 'total_active_days' THEN
          SELECT total_active_days INTO user_stat FROM users WHERE id = check_and_award_badges.user_id;
        WHEN 'profile_completed' THEN
          SELECT CASE WHEN profile_completed THEN 1 ELSE 0 END INTO user_stat FROM users WHERE id = check_and_award_badges.user_id;
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

-- Add new time-based and activity-based badges
INSERT INTO badges (name, description, requirement_type, requirement_value, icon_url)
VALUES
  ('Utente Attivo', 'Accedi per 7 giorni consecutivi', 'consecutive_days', 7, '🔥'),
  ('Dedizione', 'Accedi per 30 giorni consecutivi', 'consecutive_days', 30, '💪'),
  ('Veterano', 'Accedi per 100 giorni totali', 'total_active_days', 100, '🎖️'),
  ('Leggenda', 'Accedi per 365 giorni totali', 'total_active_days', 365, '👑'),
  ('Collaboratore Attivo', 'Crea 5 discussioni e carica 5 appunti', 'materials_uploaded', 5, '🤝'),
  ('Perfezionista', 'Completa 5 quiz con punteggio 100%', 'quizzes_completed', 5, '💯'),
  ('Socievole', 'Scrivi 100 commenti', 'comments_posted', 100, '🎭'),
  ('Influencer', 'Crea 25 discussioni', 'discussions_created', 25, '📢')
ON CONFLICT DO NOTHING;
