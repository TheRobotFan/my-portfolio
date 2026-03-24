-- Insert Subjects
INSERT INTO subjects (name, description, color) VALUES
('Matematica', 'Materia di matematica e algebra', '#FF6B6B'),
('Fisica', 'Materia di fisica e meccanica', '#4ECDC4'),
('Biologia', 'Materia di biologia e scienze naturali', '#45B7D1'),
('Storia', 'Materia di storia e civiltà', '#FFA07A'),
('Italiano', 'Materia di lingua italiana', '#98D8C8');

-- Insert Sample Users
INSERT INTO users (email, full_name, role, bio, xp_points, level, is_active) VALUES
('admin@classeportal.it', 'Admin User', 'admin', 'Administrator della piattaforma', 5000, 10, true),
('teacher@classeportal.it', 'Prof. Marco Rossi', 'teacher', 'Insegnante di Matematica', 3000, 8, true),
('staff@classeportal.it', 'Staff User', 'staff', 'Staff della piattaforma', 2000, 6, true),
('student1@classeportal.it', 'Luca Bianchi', 'student', 'Studente di Matematica', 500, 3, true),
('student2@classeportal.it', 'Emma Rossi', 'student', 'Studentessa di Fisica', 750, 4, true);

-- Insert Sample Exercises
INSERT INTO exercises (title, description, subject_id, difficulty, question, answer, hint, created_by) VALUES
('Equazione Lineare', 'Risolvere una semplice equazione lineare', (SELECT id FROM subjects WHERE name = 'Matematica'), 'easy', 'Risolvi: 2x + 3 = 11', 'x = 4', 'Sottrai 3 da entrambi i lati', (SELECT id FROM users WHERE email = 'teacher@classeportal.it')),
('Moto Uniformemente Accelerato', 'Calcolo della velocità finale', (SELECT id FROM subjects WHERE name = 'Fisica'), 'medium', 'Un oggetto accelera a 5 m/s² per 3 secondi. Qual è la velocità finale?', 'v = 15 m/s', 'Usa v = at', (SELECT id FROM users WHERE email = 'teacher@classeportal.it'));

-- Insert Sample Quizzes
INSERT INTO quizzes (title, description, subject_id, difficulty, time_limit, passing_score, total_questions, created_by) VALUES
('Quiz Matematica Base', 'Quiz base di matematica per testare le conoscenze fondamentali', (SELECT id FROM subjects WHERE name = 'Matematica'), 'easy', 900, 70, 5, (SELECT id FROM users WHERE email = 'teacher@classeportal.it')),
('Quiz Fisica Intermedio', 'Quiz intermedio di fisica', (SELECT id FROM subjects WHERE name = 'Fisica'), 'medium', 1200, 75, 8, (SELECT id FROM users WHERE email = 'teacher@classeportal.it'));

-- Insert Sample Forum Discussions
INSERT INTO forum_discussions (title, content, subject_id, category, user_id) VALUES
('Dubbio su Equazioni di Secondo Grado', 'Ho difficoltà con il discriminante. Potete aiutarmi?', (SELECT id FROM subjects WHERE name = 'Matematica'), 'Domande', (SELECT id FROM users WHERE email = 'student1@classeportal.it')),
('Consigli per lo Studio', 'Quali sono i migliori metodi per studiare efficacemente?', (SELECT id FROM subjects WHERE name = 'Italiano'), 'Consigli', (SELECT id FROM users WHERE email = 'student2@classeportal.it'));

-- Insert Sample Materials
INSERT INTO materials (title, description, subject_id, file_type, file_size, uploaded_by) VALUES
('Appunti Trigonometria', 'Appunti completi sulla trigonometria', (SELECT id FROM subjects WHERE name = 'Matematica'), 'pdf', 2500000, (SELECT id FROM users WHERE email = 'teacher@classeportal.it')),
('Riassunto Cellule', 'Riassunto sulla biologia cellulare', (SELECT id FROM subjects WHERE name = 'Biologia'), 'pdf', 1800000, (SELECT id FROM users WHERE email = 'teacher@classeportal.it'));

-- Insert Badges
INSERT INTO badges (name, description, icon_url, requirement_type, requirement_value) VALUES
('Primo Passo', 'Completa il primo quiz', 'https://api.placeholder.com/badge-1.png', 'quiz_count', 1),
('Quiz Master', 'Completa 10 quiz con punteggio perfetto', 'https://api.placeholder.com/badge-2.png', 'perfect_quizzes', 10),
('Contributore', 'Condividi 5 esercizi', 'https://api.placeholder.com/badge-3.png', 'exercises_shared', 5),
('Esperto di Discussioni', 'Partecipa a 20 discussioni', 'https://api.placeholder.com/badge-4.png', 'discussion_count', 20);
