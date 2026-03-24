-- Create functions for dashboard analytics with real data

-- Function to get user registration trend (last 30 days)
CREATE OR REPLACE FUNCTION get_user_registration_trend()
RETURNS TABLE (
  date DATE,
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE(created_at) as date,
    COUNT(*)::BIGINT as count
  FROM users
  WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
  GROUP BY DATE(created_at)
  ORDER BY date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get content upload trend (last 30 days)
CREATE OR REPLACE FUNCTION get_content_upload_trend()
RETURNS TABLE (
  date DATE,
  materials BIGINT,
  exercises BIGINT,
  quizzes BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    dates.date,
    COALESCE(m.count, 0) as materials,
    COALESCE(e.count, 0) as exercises,
    COALESCE(q.count, 0) as quizzes
  FROM (
    SELECT generate_series(
      CURRENT_DATE - INTERVAL '30 days',
      CURRENT_DATE,
      '1 day'::interval
    )::DATE as date
  ) dates
  LEFT JOIN (
    SELECT DATE(created_at) as date, COUNT(*)::BIGINT as count
    FROM materials
    WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY DATE(created_at)
  ) m ON dates.date = m.date
  LEFT JOIN (
    SELECT DATE(created_at) as date, COUNT(*)::BIGINT as count
    FROM exercises
    WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY DATE(created_at)
  ) e ON dates.date = e.date
  LEFT JOIN (
    SELECT DATE(created_at) as date, COUNT(*)::BIGINT as count
    FROM quizzes
    WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY DATE(created_at)
  ) q ON dates.date = q.date
  ORDER BY dates.date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get activity trend (views, downloads, forum posts)
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
    SELECT DATE(created_at) as date, SUM(views)::BIGINT as count
    FROM materials
    WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY DATE(created_at)
  ) v ON dates.date = v.date
  LEFT JOIN (
    SELECT DATE(created_at) as date, SUM(downloads)::BIGINT as count
    FROM materials
    WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY DATE(created_at)
  ) d ON dates.date = d.date
  LEFT JOIN (
    SELECT DATE(created_at) as date, COUNT(*)::BIGINT as count
    FROM forum_posts
    WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY DATE(created_at)
  ) f ON dates.date = f.date
  ORDER BY dates.date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get most viewed content
CREATE OR REPLACE FUNCTION get_most_viewed_content()
RETURNS TABLE (
  id UUID,
  title TEXT,
  type TEXT,
  views INTEGER,
  downloads INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    m.title,
    m.type,
    m.views,
    m.downloads
  FROM materials m
  ORDER BY m.views DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get most active users (by XP gained in last 30 days)
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
    u.full_name,
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

-- Function to get subject distribution
CREATE OR REPLACE FUNCTION get_subject_distribution()
RETURNS TABLE (
  subject_name TEXT,
  materials_count BIGINT,
  exercises_count BIGINT,
  quizzes_count BIGINT,
  total_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.name as subject_name,
    COUNT(DISTINCT m.id) as materials_count,
    COUNT(DISTINCT e.id) as exercises_count,
    COUNT(DISTINCT q.id) as quizzes_count,
    COUNT(DISTINCT m.id) + COUNT(DISTINCT e.id) + COUNT(DISTINCT q.id) as total_count
  FROM subjects s
  LEFT JOIN materials m ON s.id = m.subject_id
  LEFT JOIN exercises e ON s.id = e.subject_id
  LEFT JOIN quizzes q ON s.id = q.subject_id
  GROUP BY s.id, s.name
  ORDER BY total_count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get recent activity feed
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
      m.title,
      u.full_name as user_name,
      m.created_at
    FROM materials m
    JOIN users u ON m.uploaded_by = u.id
    ORDER BY m.created_at DESC
    LIMIT limit_count / 4
  )
  UNION ALL
  (
    SELECT 
      'exercise'::TEXT as activity_type,
      e.title,
      u.full_name as user_name,
      e.created_at
    FROM exercises e
    JOIN users u ON e.created_by = u.id
    ORDER BY e.created_at DESC
    LIMIT limit_count / 4
  )
  UNION ALL
  (
    SELECT 
      'quiz'::TEXT as activity_type,
      q.title,
      u.full_name as user_name,
      q.created_at
    FROM quizzes q
    JOIN users u ON q.created_by = u.id
    ORDER BY q.created_at DESC
    LIMIT limit_count / 4
  )
  UNION ALL
  (
    SELECT 
      'forum'::TEXT as activity_type,
      f.title,
      u.full_name as user_name,
      f.created_at
    FROM forum_posts f
    JOIN users u ON f.author_id = u.id
    ORDER BY f.created_at DESC
    LIMIT limit_count / 4
  )
  ORDER BY created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
