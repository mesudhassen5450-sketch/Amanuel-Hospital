-- ============================================================
-- PHASE 5 SMS: Add SMS reminder columns to appointments
-- Run in: https://supabase.com/dashboard/project/effhdgpklekbwmvmqlfe/sql
-- Safe to run multiple times (uses IF NOT EXISTS / DO blocks)
-- ============================================================

ALTER TABLE public.appointments
  ADD COLUMN IF NOT EXISTS reminder_sms_sent      boolean     DEFAULT false,
  ADD COLUMN IF NOT EXISTS reminder_sms_sent_at   timestamptz DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS reminder_sms_status    text        DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS reminder_sms_error     text        DEFAULT NULL;

-- Index for querying unsent reminders efficiently
CREATE INDEX IF NOT EXISTS idx_appointments_sms_status
  ON public.appointments(reminder_sms_status);

-- Grant UPDATE on new columns (anon already has UPDATE from Phase 4)
-- No new grant needed — existing UPDATE grant covers new columns.

-- ============================================================
-- reminder_sms_status allowed values:
--   pending       → not yet sent
--   sent          → SMS delivered successfully
--   failed        → SMS attempt failed
--   not_required  → cancelled appointment, skip
-- ============================================================
