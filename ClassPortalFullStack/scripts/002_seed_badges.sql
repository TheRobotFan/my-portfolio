-- Insert default badges for the gamification system
INSERT INTO badges (name, description, icon_url, requirement_type, requirement_value) VALUES
  ('Primo Passo', 'Completa il tuo primo quiz', '🎯', 'quiz_completed', 1),
  ('Studente Diligente', 'Raggiungi 100 XP', '📚', 'xp', 100),
  ('Esperto', 'Raggiungi 500 XP', '⭐', 'xp', 500),
  ('Maestro', 'Raggiungi 1000 XP', '🏆', 'xp', 1000),
  ('Leggenda', 'Raggiungi 2000 XP', '👑', 'xp', 2000),
  ('Contributore', 'Carica 5 materiali', '📝', 'materials_uploaded', 5),
  ('Mentore', 'Rispondi a 10 discussioni', '💬', 'forum_replies', 10),
  ('Socievole', 'Crea 5 discussioni', '🗣️', 'discussions_created', 5),
  ('Velocista', 'Completa 10 quiz', '⚡', 'quiz_completed', 10),
  ('Maratoneta', 'Completa 50 quiz', '🏃', 'quiz_completed', 50)
ON CONFLICT DO NOTHING;
