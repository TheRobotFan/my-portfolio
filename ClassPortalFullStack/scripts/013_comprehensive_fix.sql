-- COMPREHENSIVE FIX SCRIPT
-- This script fixes all function type mismatches and table reference errors

-- ============================================
-- STEP 1: Drop all problematic functions
-- ============================================

DROP FUNCTION IF EXISTS get_featured_contributors();
DROP FUNCTION IF EXISTS get_recent_activity_feed(INTEGER);
DROP FUNCTION IF EXISTS get_activity_trend();
DROP FUNCTION IF EXISTS get_most_active_users();
DROP FUNCTION IF EXISTS add_user_xp(UUID, INTEGER);
DROP FUNCTION IF EXISTS check_and_award_badges(UUID);

-- ============================================
-- STEP 2: Recreate functions with correct types
-- ============================================

-- Fix get_featured_contributors - cast VARCHAR to TEXT
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
    u.full_name::TEXT,  -- Cast to TEXT
    u.avatar_url,
    fc.contributions,
    fc.stars,
    fc.display_order
  FROM featured_contributors fc
  JOIN users u ON u.id = fc.user_id
  ORDER BY fc.display_order ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix get_activity_trend - use forum_discussions instead of forum_posts
CREATE OR REPLACE FUNCTION get_activity_trend()
RETURNS TABLE (
  date DATE,
  views BIGINT,
  downloads BIGINT,
  forum_posts BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    dates.date,
    COALESCE(v.count, 0) as views,
    COALESCE(d.count, 0) as downloads,
    COALESCE(f.count, 0) as forum_posts
  FROM (
    SELECT generate_series(
      CURRENT_DATE - INTERVAL '30 days',
      CURRENT_DATE,
      '1 day'::interval
    )::DATE as date
  ) dates
  LEFT JOIN (
    SELECT DATE(created_at) as date, SUM(views_count)::BIGINT as count
    FROM materials
    WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY DATE(created_at)
  ) v ON dates.date = v.date
  LEFT JOIN (
    SELECT DATE(created_at) as date, SUM(downloads_count)::BIGINT as count
    FROM materials
    WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY DATE(created_at)
  ) d ON dates.date = d.date
  LEFT JOIN (
    -- Use forum_discussions instead of forum_posts
    SELECT DATE(created_at) as date, COUNT(*)::BIGINT as count
    FROM forum_discussions
    WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY DATE(created_at)
  ) f ON dates.date = f.date
  ORDER BY dates.date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix get_recent_activity_feed - use forum_discussions instead of forum_posts
CREATE OR REPLACE FUNCTION get_recent_activity_feed(limit_count INTEGER DEFAULT 20)
RETURNS TABLE (
  activity_type TEXT,
  title TEXT,
  user_name TEXT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  (
    SELECT 
      'material'::TEXT as activity_type,
      m.title::TEXT,
      u.full_name::TEXT as user_name,
      m.created_at::TIMESTAMPTZ
    FROM materials m
    JOIN users u ON m.uploaded_by = u.id
    ORDER BY m.created_at DESC
    LIMIT limit_count / 4
  )
  UNION ALL
  (
    SELECT 
      'exercise'::TEXT as activity_type,
      e.title::TEXT,
      u.full_name::TEXT as user_name,
      e.created_at::TIMESTAMPTZ
    FROM exercises e
    JOIN users u ON e.created_by = u.id
    ORDER BY e.created_at DESC
    LIMIT limit_count / 4
  )
  UNION ALL
  (
    SELECT 
      'quiz'::TEXT as activity_type,
      q.title::TEXT,
      u.full_name::TEXT as user_name,
      q.created_at::TIMESTAMPTZ
    FROM quizzes q
    JOIN users u ON q.created_by = u.id
    ORDER BY q.created_at DESC
    LIMIT limit_count / 4
  )
  UNION ALL
  (
    -- Use forum_discussions instead of forum_posts
    SELECT 
      'forum'::TEXT as activity_type,
      f.title::TEXT,
      u.full_name::TEXT as user_name,
      f.created_at::TIMESTAMPTZ
    FROM forum_discussions f
    JOIN users u ON f.user_id = u.id
    ORDER BY f.created_at DESC
    LIMIT limit_count / 4
  )
  ORDER BY created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix get_most_active_users - cast VARCHAR to TEXT
CREATE OR REPLACE FUNCTION get_most_active_users()
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  xp_points INTEGER,
  level INTEGER,
  badge_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.full_name::TEXT,  -- Cast to TEXT
    u.xp_points,
    u.level,
    COUNT(ub.badge_id) as badge_count
  FROM users u
  LEFT JOIN user_badges ub ON u.id = ub.user_id
  GROUP BY u.id, u.full_name, u.xp_points, u.level
  ORDER BY u.xp_points DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate XP system functions with proper return types
CREATE OR REPLACE FUNCTION add_user_xp(p_user_id UUID, xp_amount INTEGER)
RETURNS TABLE(new_xp INTEGER, new_level INTEGER) AS $$
DECLARE
  current_xp INTEGER;
  calculated_xp INTEGER;
  calculated_level INTEGER;
BEGIN
  -- Get current XP
  SELECT xp_points INTO current_xp FROM users WHERE id = p_user_id;
  
  -- Calculate new XP and level
  calculated_xp := COALESCE(current_xp, 0) + xp_amount;
  calculated_level := FLOOR(calculated_xp / 100) + 1;
  
  -- Update user
  UPDATE users
  SET xp_points = calculated_xp,
      level = calculated_level,
      updated_at = NOW()
  WHERE id = p_user_id;
  
  -- Return new values
  RETURN QUERY SELECT calculated_xp, calculated_level;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate badge checking function
CREATE OR REPLACE FUNCTION check_and_award_badges(p_user_id UUID)
RETURNS TABLE(badge_id UUID, badge_name TEXT) AS $$
DECLARE
  user_xp INTEGER;
  badge_record RECORD;
BEGIN
  -- Get user XP
  SELECT xp_points INTO user_xp FROM users WHERE id = p_user_id;
  
  -- Check and award badges
  FOR badge_record IN 
    SELECT b.id, b.name::TEXT
    FROM badges b
    WHERE b.requirement_type = 'xp' 
    AND b.requirement_value <= user_xp
    AND NOT EXISTS (
      SELECT 1 FROM user_badges ub 
      WHERE ub.user_id = p_user_id 
      AND ub.badge_id = b.id
    )
  LOOP
    -- Award badge
    INSERT INTO user_badges (user_id, badge_id)
    VALUES (p_user_id, badge_record.id);
    
    -- Return awarded badge info
    RETURN QUERY SELECT badge_record.id, badge_record.name;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- STEP 3: Setup admin user (first registered user)
-- ============================================

-- Update the first user to be admin
DO $$
DECLARE
  first_user_id UUID;
BEGIN
  -- Get the first user (oldest created_at)
  SELECT id INTO first_user_id
  FROM users
  ORDER BY created_at ASC
  LIMIT 1;
  
  -- Make them admin if a user exists
  IF first_user_id IS NOT NULL THEN
    UPDATE users
    SET role = 'admin'
    WHERE id = first_user_id;
    
    RAISE NOTICE 'Admin role assigned to user: %', first_user_id;
  ELSE
    RAISE NOTICE 'No users found in database';
  END IF;
END $$;
