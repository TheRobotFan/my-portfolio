-- Function to get total views across all content
CREATE OR REPLACE FUNCTION get_total_views()
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_views bigint;
BEGIN
  SELECT 
    COALESCE(SUM(views), 0) + 
    COALESCE((SELECT SUM(views) FROM exercises), 0) + 
    COALESCE((SELECT SUM(attempts) FROM quizzes), 0)
  INTO total_views
  FROM materials;
  
  RETURN total_views;
END;
$$;
