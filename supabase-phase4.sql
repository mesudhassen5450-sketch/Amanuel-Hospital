-- ============================================================
-- PHASE 4: Patient Registration & MRN
-- Run in: https://supabase.com/dashboard/project/effhdgpklekbwmvmqlfe/sql
-- ============================================================

-- 1. MRN sequence (auto-increment for unique MRN generation)
CREATE SEQUENCE IF NOT EXISTS mrn_seq START 1;

-- 2. Patients table
CREATE TABLE IF NOT EXISTS public.patients (
  id               bigserial PRIMARY KEY,
  mrn              text        NOT NULL UNIQUE,  -- e.g. MRN-2026-000001
  full_name        text        NOT NULL,
  phone            text        NOT NULL,
  date_of_birth    date,
  gender           text,
  address          text,
  emergency_contact_name  text,
  emergency_contact_phone text,
  blood_group      text,
  allergies        text,
  chronic_conditions text,
  notes            text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

-- 3. Add patient_id foreign key to appointments (nullable — existing rows stay)
ALTER TABLE public.appointments
  ADD COLUMN IF NOT EXISTS patient_id bigint REFERENCES public.patients(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS visit_status text NOT NULL DEFAULT 'booked';
-- visit_status values: booked | checked_in | waiting | completed | cancelled

-- 4. Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_patients_mrn   ON public.patients(mrn);
CREATE INDEX IF NOT EXISTS idx_patients_phone ON public.patients(phone);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON public.appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appointment_date);

-- 5. Grants
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.patients TO anon;
GRANT USAGE, SELECT ON SEQUENCE mrn_seq TO anon;
GRANT USAGE, SELECT ON SEQUENCE public.patients_id_seq TO anon;
GRANT SELECT, UPDATE ON public.appointments TO anon;

-- 6. RLS on patients
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon insert patients"  ON public.patients FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon select patients"  ON public.patients FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon update patients"  ON public.patients FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon delete patients"  ON public.patients FOR DELETE TO anon USING (true);

-- 7. Helper function: generate next MRN atomically
CREATE OR REPLACE FUNCTION public.generate_mrn()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  seq_val bigint;
  year_val text;
BEGIN
  seq_val  := nextval('mrn_seq');
  year_val := to_char(now(), 'YYYY');
  RETURN 'MRN-' || year_val || '-' || lpad(seq_val::text, 6, '0');
END;
$$;

GRANT EXECUTE ON FUNCTION public.generate_mrn() TO anon;

-- ============================================================
-- Done. MRN example: MRN-2026-000001
-- ============================================================
