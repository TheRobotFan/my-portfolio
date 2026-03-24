-- Drop existing functions that might have different return types
DROP FUNCTION IF EXISTS award_xp(uuid, integer, text);
DROP FUNCTION IF EXISTS check_and_award_badges(uuid);
DROP FUNCTION IF EXISTS calculate_level(integer);

-- Recreate the calculate_level function
CREATE OR REPLACE FUNCTION calculate_level(xp integer)
RETURNS integer
LANGUAGE plpgsql
AS $$
BEGIN
  -- Level 1: 0-99 XP
  -- Level 2: 100-299 XP
  -- Level 3: 300-599 XP
  -- Each level requires 100 more XP than the previous
  RETURN FLOOR((-100 + SQRT(10000 + 800 * xp)) / 200) + 1;
END;
$$;

-- Recreate the award_xp function
CREATE OR REPLACE FUNCTION award_xp(
  p_user_id uuid,
  p_xp_amount integer,
  p_reason text DEFAULT 'Activity completed'
)
RETURNS TABLE(new_xp integer, new_level integer, level_up boolean)
LANGUAGE plpgsql
AS $$
DECLARE
  v_old_xp integer;
  v_new_xp integer;
  v_old_level integer;
  v_new_level integer;
BEGIN
  -- Get current XP and level
  SELECT xp_points, level INTO v_old_xp, v_old_level
  FROM users
  WHERE id = p_user_id;

  -- Calculate new XP
  v_new_xp := v_old_xp + p_xp_amount;
  
  -- Calculate new level
  v_new_level := calculate_level(v_new_xp);

  -- Update user
  UPDATE users
  SET 
    xp_points = v_new_xp,
    level = v_new_level,
    updated_at = NOW()
  WHERE id = p_user_id;

  -- Return results
  RETURN QUERY SELECT v_new_xp, v_new_level, (v_new_level > v_old_level);
END;
$$;

-- Recreate the check_and_award_badges function
CREATE OR REPLACE FUNCTION check_and_award_badges(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  v_badge RECORD;
  v_user_value integer;
  v_already_earned boolean;
BEGIN
  -- Loop through all badges
  FOR v_badge IN SELECT * FROM badges LOOP
    -- Check if user already has this badge
    SELECT EXISTS(
      SELECT 1 FROM user_badges 
      WHERE user_id = p_user_id AND badge_id = v_badge.id
    ) INTO v_already_earned;

    -- Skip if already earned
    IF v_already_earned THEN
      CONTINUE;
    END IF;

    -- Get the relevant user value based on requirement type
    CASE v_badge.requirement_type
      WHEN 'xp_points' THEN
        SELECT xp_points INTO v_user_value FROM users WHERE id = p_user_id;
      WHEN 'level' THEN
        SELECT level INTO v_user_value FROM users WHERE id = p_user_id;
      WHEN 'consecutive_days' THEN
        SELECT consecutive_active_days INTO v_user_value FROM users WHERE id = p_user_id;
      WHEN 'total_days' THEN
        SELECT total_active_days INTO v_user_value FROM users WHERE id = p_user_id;
      ELSE
        CONTINUE;
    END CASE;

    -- Award badge if requirement is met
    IF v_user_value >= v_badge.requirement_value THEN
      INSERT INTO user_badges (user_id, badge_id, earned_at)
      VALUES (p_user_id, v_badge.id, NOW());
      
      -- Create notification
      INSERT INTO notifications (user_id, type, title, message, created_at)
      VALUES (
        p_user_id,
        'badge_earned',
        'Nuovo Badge Sbloccato!',
        'Hai guadagnato il badge: ' || v_badge.name,
        NOW()
      );
    END IF;
  END LOOP;
END;
$$;

-- Create trigger to automatically check badges after XP changes
DROP TRIGGER IF EXISTS check_badges_after_xp_update ON users;

CREATE TRIGGER check_badges_after_xp_update
  AFTER UPDATE OF xp_points ON users
  FOR EACH ROW
  WHEN (NEW.xp_points > OLD.xp_points)
  EXECUTE FUNCTION check_and_award_badges(NEW.id);
