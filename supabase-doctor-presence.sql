-- Database Migration for Doctor Online Presence System
-- This script adds the is_online column to staff_accounts table and sets default values

-- Add is_online column if it doesn't exist
ALTER TABLE staff_accounts 
ADD COLUMN IF NOT EXISTS is_online BOOLEAN DEFAULT false;

-- Default all existing records to false
UPDATE staff_accounts 
SET is_online = false 
WHERE is_online IS NULL;

-- Ensure is_online column has a default of false for new records
ALTER TABLE staff_accounts 
ALTER COLUMN is_online SET DEFAULT false;

-- Add index on is_online for better query performance
CREATE INDEX IF NOT EXISTS idx_staff_accounts_is_online ON staff_accounts(is_online);

-- Add index on role for filtering doctors
CREATE INDEX IF NOT EXISTS idx_staff_accounts_role ON staff_accounts(role);

-- Verify the migration was successful
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'staff_accounts' 
AND column_name = 'is_online';

-- ============================================
-- Telehealth Video Consultation Workflow Migration
-- ============================================

-- Step 1: Drop existing call_status constraint if it exists
ALTER TABLE appointments 
DROP CONSTRAINT IF EXISTS appointments_call_status_check;

-- Step 2: Add call_status column to appointments table for 2-step workflow
ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS call_status VARCHAR(50) DEFAULT 'REQUESTING_DOCTOR';

-- Add doctor_username column to appointments for filtering
ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS doctor_username VARCHAR(255);

-- Add patient_name column for doctor notifications
ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS patient_name VARCHAR(255);

-- Step 3: Re-add constraint with all required status values for 2-step workflow
ALTER TABLE appointments 
ADD CONSTRAINT appointments_call_status_check 
CHECK (call_status IN (
  'REQUESTING_DOCTOR', 
  'DOCTOR_READY', 
  'DOCTOR_DECLINED', 
  'RINGING', 
  'IN_PROGRESS', 
  'CALL_REJECTED',
  'COMPLETED',
  'CANCELLED',
  'idle', 
  'pending', 
  'scheduled', 
  'calling', 
  'in_call', 
  'ended', 
  'missed', 
  'declined'
));

-- Set default values for existing records
UPDATE appointments 
SET call_status = 'REQUESTING_DOCTOR' 
WHERE call_status IS NULL;

-- Add index on call_status for performance
CREATE INDEX IF NOT EXISTS idx_appointments_call_status ON appointments(call_status);

-- Add index on doctor_username for filtering
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_username ON appointments(doctor_username);

-- Verify the telehealth migration
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'appointments' 
AND column_name IN ('call_status', 'doctor_username', 'patient_name');
