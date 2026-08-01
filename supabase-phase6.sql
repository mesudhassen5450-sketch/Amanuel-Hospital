-- ============================================================
-- PHASE 6: Laboratory Management Module
-- Run in: https://supabase.com/dashboard/project/effhdgpklekbwmvmqlfe/sql
-- ============================================================

-- 1. lab_requests table
CREATE TABLE IF NOT EXISTS public.lab_requests (
  id              bigserial PRIMARY KEY,
  patient_id      bigint NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  appointment_id  bigint REFERENCES public.appointments(id) ON DELETE SET NULL,
  doctor_username text    NOT NULL DEFAULT 'doctor',
  test_name       text    NOT NULL,
  clinical_notes  text,
  status          text    NOT NULL DEFAULT 'Requested',
  -- status values: Requested | Sample Collected | Processing | Completed | Cancelled
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- 2. lab_results table
CREATE TABLE IF NOT EXISTS public.lab_results (
  id               bigserial PRIMARY KEY,
  lab_request_id   bigint NOT NULL REFERENCES public.lab_requests(id) ON DELETE CASCADE,
  patient_id       bigint NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  technician_id    text   NOT NULL DEFAULT 'laboratory',
  result_value     text   NOT NULL,
  reference_range  text   NOT NULL,
  unit             text   NOT NULL,
  notes            text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_lab_requests_patient_id     ON public.lab_requests(patient_id);
CREATE INDEX IF NOT EXISTS idx_lab_requests_status         ON public.lab_requests(status);
CREATE INDEX IF NOT EXISTS idx_lab_requests_appointment_id ON public.lab_requests(appointment_id);
CREATE INDEX IF NOT EXISTS idx_lab_results_lab_request_id  ON public.lab_results(lab_request_id);
CREATE INDEX IF NOT EXISTS idx_lab_results_patient_id      ON public.lab_results(patient_id);

-- 4. RLS
ALTER TABLE public.lab_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_results  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon select lab_requests"  ON public.lab_requests FOR SELECT TO anon USING (true);
CREATE POLICY "anon insert lab_requests"  ON public.lab_requests FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon update lab_requests"  ON public.lab_requests FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "anon select lab_results"   ON public.lab_results  FOR SELECT TO anon USING (true);
CREATE POLICY "anon insert lab_results"   ON public.lab_results  FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon update lab_results"   ON public.lab_results  FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- 5. Grants
GRANT SELECT, INSERT, UPDATE ON public.lab_requests TO anon;
GRANT SELECT, INSERT, UPDATE ON public.lab_results  TO anon;
GRANT USAGE, SELECT ON SEQUENCE public.lab_requests_id_seq TO anon;
GRANT USAGE, SELECT ON SEQUENCE public.lab_results_id_seq  TO anon;

-- ============================================================
-- Done. Test names: CBC, Blood Sugar, Urinalysis, Lipid Profile,
--   Liver Function, Kidney Function, Malaria Test, Thyroid Panel
-- ============================================================
