-- ============================================
-- ISTRUZIONI PER CREARE UN UTENTE ADMIN
-- ============================================

-- METODO 1: Trasformare un utente esistente in admin
-- Sostituisci 'tua-email@example.com' con l'email del tuo account
SELECT make_user_admin('tua-email@example.com');

-- METODO 2: Aggiornare direttamente il ruolo
-- Sostituisci 'tua-email@example.com' con l'email del tuo account
UPDATE users 
SET role = 'admin' 
WHERE email = 'tua-email@example.com';

-- METODO 3: Verificare se un utente è admin
-- Sostituisci 'user-id-qui' con l'ID del tuo utente
SELECT is_admin('user-id-qui');

-- Per vedere tutti gli admin attuali:
SELECT id, email, full_name, role 
FROM users 
WHERE role = 'admin';

-- ============================================
-- NOTA: Dopo aver eseguito uno di questi comandi,
-- l'utente avrà accesso completo alla dashboard admin
-- e potrà caricare appunti, creare esercizi, ecc.
-- ============================================
