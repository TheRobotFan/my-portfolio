-- ============================================================================
-- COMPLETE DATABASE FIX SCRIPT
-- This script fixes all database functions and ensures proper data structure
-- ============================================================================

-- Step 1: Drop all existing problematic functions
DROP FUNCTION IF EXISTS add_user_xp(uuid, integer) CASCADE;
DROP FUNCTION IF EXISTS check_and_award_badges(uuid) CASCADE;
DROP FUNCTION IF EXISTS get_user_rank(uuid) CASCADE;
DROP FUNCTION IF EXISTS get_featured_contributors() CASCADE;
DROP FUNCTION IF EXISTS get_recent_activity_feed(integer) CASCADE;
DROP FUNCTION IF EXISTS get_user_registration_trend() CASCADE;
DROP FUNCTION IF EXISTS get_content_upload_trend() CASCADE;
DROP FUNCTION IF EXISTS get_activity_trend() CASCADE;
DROP FUNCTION IF EXISTS get_most_viewed_content() CASCADE;
DROP FUNCTION IF EXISTS get_most_active_users() CASCADE;
DROP FUNCTION IF EXISTS get_subject_distribution() CASCADE;

-- Step 2: Create XP System Function
CREATE OR REPLACE FUNCTION add_user_xp(user_id uuid, xp_amount integer)
RETURNS TABLE(leveled_up boolean, new_level integer, new_xp integer) AS $$
DECLARE
  current_xp integer;
  current_level integer;
  new_xp_total integer;
  new_level_calc integer;
  did_level_up boolean := false;
BEGIN
  -- Get current XP and level
  SELECT xp_points, level INTO current_xp, current_level
  FROM users
  WHERE id = user_id;

  -- Calculate new XP
  new_xp_total := current_xp + xp_amount;
  
  -- Calculate new level (every 500 XP = 1 level)
  new_level_calc := FLOOR(new_xp_total / 500) + 1;
  
  -- Check if leveled up
  IF new_level_calc > current_level THEN
    did_level_up := true;
  END IF;

  -- Update user
  UPDATE users
  SET xp_points = new_xp_total,
      level = new_level_calc,
      updated_at = NOW()
  WHERE id = user_id;

  RETURN QUERY SELECT did_level_up, new_level_calc, new_xp_total;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Create Badge Checking Function
CREATE OR REPLACE FUNCTION check_and_award_badges(user_id uuid)
RETURNS void AS $$
DECLARE
  badge_record RECORD;
  user_progress integer;
  already_earned boolean;
BEGIN
  -- Loop through all badges
  FOR badge_record IN SELECT * FROM badges LOOP
    -- Check if user already has this badge
    SELECT EXISTS(
      SELECT 1 FROM user_badges 
      WHERE user_badges.user_id = check_and_award_badges.user_id 
      AND badge_id = badge_record.id
    ) INTO already_earned;

    IF NOT already_earned THEN
      -- Calculate progress based on requirement type
      CASE badge_record.requirement_type
        WHEN 'materials_uploaded' THEN
          SELECT COUNT(*) INTO user_progress
          FROM materials WHERE uploaded_by = check_and_award_badges.user_id;
        
        WHEN 'discussions_created' THEN
          SELECT COUNT(*) INTO user_progress
          FROM forum_discussions WHERE forum_discussions.user_id = check_and_award_badges.user_id;
        
        WHEN 'comments_posted' THEN
          SELECT COUNT(*) INTO user_progress
          FROM forum_comments WHERE forum_comments.user_id = check_and_award_badges.user_id;
        
        WHEN 'quizzes_completed' THEN
          SELECT COUNT(*) INTO user_progress
          FROM quiz_attempts WHERE quiz_attempts.user_id = check_and_award_badges.user_id;
        
        WHEN 'xp_earned' THEN
          SELECT xp_points INTO user_progress
          FROM users WHERE id = check_and_award_badges.user_id;
        
        WHEN 'level_reached' THEN
          SELECT level INTO user_progress
          FROM users WHERE id = check_and_award_badges.user_id;
        
        WHEN 'consecutive_days' THEN
          SELECT COALESCE(consecutive_active_days, 0) INTO user_progress
          FROM users WHERE id = check_and_award_badges.user_id;
        
        WHEN 'total_active_days' THEN
          SELECT COALESCE(total_active_days, 0) INTO user_progress
          FROM users WHERE id = check_and_award_badges.user_id;
        
        ELSE
          user_progress := 0;
      END CASE;

      -- Award badge if requirement met
      IF user_progress >= badge_record.requirement_value THEN
        INSERT INTO user_badges (user_id, badge_id, earned_at)
        VALUES (check_and_award_badges.user_id, badge_record.id, NOW());
        
        -- Create notification
        INSERT INTO notifications (user_id, type, title, message, created_at)
        VALUES (
          check_and_award_badges.user_id,
          'badge_earned',
          'Nuovo Badge Sbloccato!',
          'Hai guadagnato il badge: ' || badge_record.name,
          NOW()
        );
      END IF;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Create User Rank Function
CREATE OR REPLACE FUNCTION get_user_rank(user_id uuid)
RETURNS integer AS $$
DECLARE
  user_rank integer;
BEGIN
  SELECT COUNT(*) + 1 INTO user_rank
  FROM users
  WHERE xp_points > (SELECT xp_points FROM users WHERE id = user_id);
  
  RETURN user_rank;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 5: Create Featured Contributors Function (FIXED)
CREATE OR REPLACE FUNCTION get_featured_contributors()
RETURNS TABLE(
  id uuid,
  full_name text,
  avatar_url text,
  contributions integer,
  stars integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    fc.user_id as id,
    u.full_name::text,
    u.avatar_url::text,
    fc.contributions,
    fc.stars
  FROM featured_contributors fc
  JOIN users u ON u.id = fc.user_id
  ORDER BY fc.display_order ASC, fc.stars DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 6: Create Recent Activity Feed Function (FIXED - uses forum_discussions not forum_posts)
CREATE OR REPLACE FUNCTION get_recent_activity_feed(limit_count integer DEFAULT 20)
RETURNS TABLE(
  id uuid,
  title text,
  activity_type text,
  user_name text,
  created_at timestamp without time zone,
  views integer,
  likes integer,
  comments integer
) AS $$
BEGIN
  RETURN QUERY
  WITH all_activities AS (
    -- Materials
    SELECT 
      m.id,
      m.title::text,
      'material'::text as activity_type,
      u.full_name::text as user_name,
      m.created_at,
      m.views_count as views,
      0 as likes,
      (SELECT COUNT(*)::integer FROM material_comments WHERE material_id = m.id) as comments
    FROM materials m
    JOIN users u ON u.id = m.uploaded_by
    
    UNION ALL
    
    -- Exercises
    SELECT 
      e.id,
      e.title::text,
      'exercise'::text,
      u.full_name::text,
      e.created_at,
      e.views_count as views,
      e.likes_count as likes,
      (SELECT COUNT(*)::integer FROM exercise_comments WHERE exercise_id = e.id) as comments
    FROM exercises e
    JOIN users u ON u.id = e.created_by
    
    UNION ALL
    
    -- Forum Discussions (NOT forum_posts)
    SELECT 
      fd.id,
      fd.title::text,
      'discussion'::text,
      u.full_name::text,
      fd.created_at,
      fd.views_count as views,
      fd.likes_count as likes,
      fd.replies_count as comments
    FROM forum_discussions fd
    JOIN users u ON u.id = fd.user_id
    
    UNION ALL
    
    -- Quizzes
    SELECT 
      q.id,
      q.title::text,
      'quiz'::text,
      u.full_name::text,
      q.created_at,
      0 as views,
      0 as likes,
      0 as comments
    FROM quizzes q
    JOIN users u ON u.id = q.created_by
  )
  SELECT * FROM all_activities
  ORDER BY created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 7: Create User Registration Trend Function
CREATE OR REPLACE FUNCTION get_user_registration_trend()
RETURNS TABLE(date date, count bigint) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE(created_at) as date,
    COUNT(*) as count
  FROM users
  WHERE created_at >= NOW() - INTERVAL '30 days'
  GROUP BY DATE(created_at)
  ORDER BY date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 8: Create Content Upload Trend Function (FIXED)
CREATE OR REPLACE FUNCTION get_content_upload_trend()
RETURNS TABLE(date date, materials bigint, exercises bigint, quizzes bigint) AS $$
BEGIN
  RETURN QUERY
  WITH dates AS (
    SELECT generate_series(
      NOW() - INTERVAL '30 days',
      NOW(),
      '1 day'::interval
    )::date as date
  )
  SELECT 
    d.date,
    COALESCE(m.count, 0) as materials,
    COALESCE(e.count, 0) as exercises,
    COALESCE(q.count, 0) as quizzes
  FROM dates d
  LEFT JOIN (
    SELECT DATE(created_at) as date, COUNT(*) as count
    FROM materials
    WHERE created_at >= NOW() - INTERVAL '30 days'
    GROUP BY DATE(created_at)
  ) m ON m.date = d.date
  LEFT JOIN (
    SELECT DATE(created_at) as date, COUNT(*) as count
    FROM exercises
    WHERE created_at >= NOW() - INTERVAL '30 days'
    GROUP BY DATE(created_at)
  ) e ON e.date = d.date
  LEFT JOIN (
    SELECT DATE(created_at) as date, COUNT(*) as count
    FROM quizzes
    WHERE created_at >= NOW() - INTERVAL '30 days'
    GROUP BY DATE(created_at)
  ) q ON q.date = d.date
  ORDER BY d.date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 9: Create Activity Trend Function (FIXED)
CREATE OR REPLACE FUNCTION get_activity_trend()
RETURNS TABLE(date date, count bigint) AS $$
BEGIN
  RETURN QUERY
  WITH all_activity AS (
    SELECT created_at FROM materials WHERE created_at >= NOW() - INTERVAL '30 days'
    UNION ALL
    SELECT created_at FROM exercises WHERE created_at >= NOW() - INTERVAL '30 days'
    UNION ALL
    SELECT created_at FROM forum_discussions WHERE created_at >= NOW() - INTERVAL '30 days'
    UNION ALL
    SELECT created_at FROM forum_comments WHERE created_at >= NOW() - INTERVAL '30 days'
  )
  SELECT 
    DATE(created_at) as date,
    COUNT(*) as count
  FROM all_activity
  GROUP BY DATE(created_at)
  ORDER BY date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 10: Create Most Viewed Content Function
CREATE OR REPLACE FUNCTION get_most_viewed_content()
RETURNS TABLE(
  id uuid,
  title text,
  type text,
  views integer,
  author text
) AS $$
BEGIN
  RETURN QUERY
  WITH all_content AS (
    SELECT 
      m.id,
      m.title::text,
      'material'::text as type,
      m.views_count as views,
      u.full_name::text as author
    FROM materials m
    JOIN users u ON u.id = m.uploaded_by
    
    UNION ALL
    
    SELECT 
      e.id,
      e.title::text,
      'exercise'::text,
      e.views_count as views,
      u.full_name::text
    FROM exercises e
    JOIN users u ON u.id = e.created_by
    
    UNION ALL
    
    SELECT 
      fd.id,
      fd.title::text,
      'discussion'::text,
      fd.views_count as views,
      u.full_name::text
    FROM forum_discussions fd
    JOIN users u ON u.id = fd.user_id
  )
  SELECT * FROM all_content
  WHERE views > 0
  ORDER BY views DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 11: Create Most Active Users Function (FIXED)
CREATE OR REPLACE FUNCTION get_most_active_users()
RETURNS TABLE(
  id uuid,
  full_name text,
  contributions integer,
  xp_points integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.full_name::text,
    (
      (SELECT COUNT(*)::integer FROM materials WHERE uploaded_by = u.id) +
      (SELECT COUNT(*)::integer FROM exercises WHERE created_by = u.id) +
      (SELECT COUNT(*)::integer FROM forum_discussions WHERE user_id = u.id) +
      (SELECT COUNT(*)::integer FROM forum_comments WHERE user_id = u.id)
    ) as contributions,
    u.xp_points
  FROM users u
  ORDER BY contributions DESC, u.xp_points DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 12: Create Subject Distribution Function
CREATE OR REPLACE FUNCTION get_subject_distribution()
RETURNS TABLE(
  subject_name text,
  count bigint,
  color text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.name::text as subject_name,
    (
      (SELECT COUNT(*) FROM materials WHERE subject_id = s.id) +
      (SELECT COUNT(*) FROM exercises WHERE subject_id = s.id) +
      (SELECT COUNT(*) FROM quizzes WHERE subject_id = s.id)
    ) as count,
    s.color::text
  FROM subjects s
  WHERE (
    (SELECT COUNT(*) FROM materials WHERE subject_id = s.id) +
    (SELECT COUNT(*) FROM exercises WHERE subject_id = s.id) +
    (SELECT COUNT(*) FROM quizzes WHERE subject_id = s.id)
  ) > 0
  ORDER BY count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 13: Ensure default badges exist
INSERT INTO badges (id, name, description, icon_url, requirement_type, requirement_value)
VALUES
  (gen_random_uuid(), 'Primo Passo', 'Completa il tuo profilo', '🎯', 'profile_completed', 1),
  (gen_random_uuid(), 'Contributore', 'Carica il tuo primo appunto', '📝', 'materials_uploaded', 1),
  (gen_random_uuid(), 'Esperto', 'Carica 10 appunti', '📚', 'materials_uploaded', 10),
  (gen_random_uuid(), 'Discussore', 'Crea la tua prima discussione', '💬', 'discussions_created', 1),
  (gen_random_uuid(), 'Commentatore', 'Scrivi 10 commenti', '✍️', 'comments_posted', 10),
  (gen_random_uuid(), 'Quiz Master', 'Completa 5 quiz', '🎓', 'quizzes_completed', 5),
  (gen_random_uuid(), 'Esperto XP', 'Raggiungi 1000 XP', '⭐', 'xp_earned', 1000),
  (gen_random_uuid(), 'Livello 5', 'Raggiungi il livello 5', '🏆', 'level_reached', 5),
  (gen_random_uuid(), 'Utente Attivo', 'Accedi per 7 giorni consecutivi', '🔥', 'consecutive_days', 7),
  (gen_random_uuid(), 'Veterano', 'Accedi per 30 giorni totali', '👑', 'total_active_days', 30)
ON CONFLICT DO NOTHING;

-- Step 14: Ensure new users have correct defaults
-- Update any existing users with NULL xp_points or level
UPDATE users
SET xp_points = 0
WHERE xp_points IS NULL;

UPDATE users
SET level = 1
WHERE level IS NULL OR level < 1;

-- Step 15: Create trigger to set defaults for new users
CREATE OR REPLACE FUNCTION set_new_user_defaults()
RETURNS TRIGGER AS $$
BEGIN
  NEW.xp_points := COALESCE(NEW.xp_points, 0);
  NEW.level := COALESCE(NEW.level, 1);
  NEW.profile_completed := COALESCE(NEW.profile_completed, false);
  NEW.is_active := COALESCE(NEW.is_active, true);
  NEW.consecutive_active_days := COALESCE(NEW.consecutive_active_days, 0);
  NEW.total_active_days := COALESCE(NEW.total_active_days, 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_new_user_defaults ON users;
CREATE TRIGGER trigger_set_new_user_defaults
  BEFORE INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION set_new_user_defaults();

-- Done!
