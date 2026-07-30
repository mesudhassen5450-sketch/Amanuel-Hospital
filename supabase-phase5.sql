-- ============================================================
-- PHASE 5: Doctor Clinical Consultation / EHR
-- Run in: https://supabase.com/dashboard/project/effhdgpklekbwmvmqlfe/sql
-- ============================================================

-- 1. Consultations table
CREATE TABLE IF NOT EXISTS public.consultations (
  id                        bigserial PRIMARY KEY,
  patient_id                bigint NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  appointment_id            bigint REFERENCES public.appointments(id) ON DELETE SET NULL,
  doctor_username           text NOT NULL DEFAULT 'doctor',
  chief_complaint           text NOT NULL,
  history_of_present_illness text,
  blood_pressure            text,
  temperature               text,
  pulse_rate                text,
  weight                    text,
  height                    text,
  physical_examination      text,
  diagnosis                 text NOT NULL,
  treatment_plan            text,
  additional_notes          text,
  created_at                timestamptz NOT NULL DEFAULT now(),
  updated_at                timestamptz NOT NULL DEFAULT now()
);

-- 2. Indexes
CREATE INDEX IF NOT EXISTS idx_consultations_patient_id    ON public.consultations(patient_id);
CREATE INDEX IF NOT EXISTS idx_consultations_appointment_id ON public.consultations(appointment_id);
CREATE INDEX IF NOT EXISTS idx_consultations_created_at    ON public.consultations(created_at);

-- 3. RLS
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon insert consultations"
  ON public.consultations FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anon select consultations"
  ON public.consultations FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anon update consultations"
  ON public.consultations FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- 4. Grants
GRANT SELECT, INSERT, UPDATE ON public.consultations TO anon;
GRANT USAGE, SELECT ON SEQUENCE public.consultations_id_seq TO anon;

-- ============================================================
-- Done.
-- ============================================================
