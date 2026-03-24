-- =========================================================================
-- ATTENZIONE: SCRIPT DI PULIZIA TOTALE (DANGER ZONE)
-- =========================================================================
-- Questo script elimina TUTTI gli utenti e tutti i contenuti da loro generati:
-- progetti, esercizi, appunti, discussioni, commenti, quiz, notifiche e badge ottenuti.
-- 
-- NON elimina le materie (subjects) o le definizioni dei badge (badges).
-- =========================================================================

-- 1. Svuota tutte le tabelle pubbliche collegate agli utenti
-- Il comando TRUNCATE con CASCADE svuota automaticamente anche tutte le tabelle 
-- che hanno chiavi esterne (foreign keys) collegate a 'users'.
TRUNCATE TABLE public.users CASCADE;

-- 2. Opzionale ma RACCOMANDATO se vuoi far registrare di nuovo gli stessi utenti:
-- In Supabase gli account veri e propri vivono nello schema 'auth'.
-- Per eliminare anche gli account di accesso, decommenta ed esegui la riga seguente:

-- TRUNCATE TABLE auth.users CASCADE;
