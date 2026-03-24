-- Add RLS policies for quiz creation (admin only)
DROP POLICY IF EXISTS "Anyone can view quizzes" ON quizzes;
DROP POLICY IF EXISTS "Admins can create quizzes" ON quizzes;
DROP POLICY IF EXISTS "Admins can update quizzes" ON quizzes;

CREATE POLICY "Anyone can view quizzes"
  ON quizzes FOR SELECT
  USING (true);

-- Fixed INSERT policy to use WITH CHECK instead of USING
CREATE POLICY "Admins can create quizzes"
  ON quizzes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update quizzes"
  ON quizzes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Add RLS policies for quiz questions (admin only)
DROP POLICY IF EXISTS "Anyone can view quiz questions" ON quiz_questions;
DROP POLICY IF EXISTS "Admins can manage quiz questions" ON quiz_questions;

CREATE POLICY "Anyone can view quiz questions"
  ON quiz_questions FOR SELECT
  USING (true);

-- Fixed ALL policy to use both USING and WITH CHECK
CREATE POLICY "Admins can manage quiz questions"
  ON quiz_questions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Function to increment quiz question count
CREATE OR REPLACE FUNCTION increment_quiz_questions(quiz_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE quizzes
  SET total_questions = total_questions + 1
  WHERE id = quiz_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add storage bucket for materials if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('materials', 'materials', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for materials
DROP POLICY IF EXISTS "Anyone can view materials" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload materials" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete materials" ON storage.objects;

CREATE POLICY "Anyone can view materials"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'materials');

CREATE POLICY "Admins can upload materials"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'materials' AND
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete materials"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'materials' AND
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );
