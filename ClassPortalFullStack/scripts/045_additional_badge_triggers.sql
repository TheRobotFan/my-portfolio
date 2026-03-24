-- ADDITIONAL BADGE TRIGGERS
-- Adds AFTER INSERT triggers on exercise_comments, forum_comments,
-- forum_discussions, and materials to automatically check badge
-- eligibility when new content is created.
-- These serve as a database-level safety net alongside the app-side checks.

-- =============================================
-- Trigger function for generic activity badge check
-- =============================================
CREATE OR REPLACE FUNCTION trigger_check_badge_on_activity()
RETURNS TRIGGER AS $$
BEGIN
    -- Check badges for the user who performed the activity
    PERFORM assign_badges_to_user(NEW.user_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger function for materials (uses uploaded_by instead of user_id)
CREATE OR REPLACE FUNCTION trigger_check_badge_on_material()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM assign_badges_to_user(NEW.uploaded_by);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- Create triggers
-- =============================================

-- exercise_comments
DROP TRIGGER IF EXISTS trigger_exercise_comment_badge_check ON exercise_comments;
CREATE TRIGGER trigger_exercise_comment_badge_check
    AFTER INSERT ON exercise_comments
    FOR EACH ROW
    EXECUTE FUNCTION trigger_check_badge_on_activity();

-- forum_comments
DROP TRIGGER IF EXISTS trigger_forum_comment_badge_check ON forum_comments;
CREATE TRIGGER trigger_forum_comment_badge_check
    AFTER INSERT ON forum_comments
    FOR EACH ROW
    EXECUTE FUNCTION trigger_check_badge_on_activity();

-- forum_discussions
DROP TRIGGER IF EXISTS trigger_forum_discussion_badge_check ON forum_discussions;
CREATE TRIGGER trigger_forum_discussion_badge_check
    AFTER INSERT ON forum_discussions
    FOR EACH ROW
    EXECUTE FUNCTION trigger_check_badge_on_activity();

-- materials (uses uploaded_by column)
DROP TRIGGER IF EXISTS trigger_material_badge_check ON materials;
CREATE TRIGGER trigger_material_badge_check
    AFTER INSERT ON materials
    FOR EACH ROW
    EXECUTE FUNCTION trigger_check_badge_on_material();

-- =============================================
-- Verify triggers were created
-- =============================================
SELECT tgname, tgrelid::regclass AS table_name
FROM pg_trigger
WHERE tgname LIKE 'trigger_%badge%'
ORDER BY table_name;
