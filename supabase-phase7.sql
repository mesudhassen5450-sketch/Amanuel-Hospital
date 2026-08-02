-- ============================================================
-- PHASE 7 PATH 1: Prescription System
-- Run in: https://supabase.com/dashboard/project/effhdgpklekbwmvmqlfe/sql
-- ============================================================

-- 1. Medicines table (minimum required for prescription selection)
CREATE TABLE IF NOT EXISTS public.medicines (
  id           bigserial PRIMARY KEY,
  name         text        NOT NULL UNIQUE,
  generic_name text,
  category     text,
  unit         text        NOT NULL DEFAULT 'tablet',
  is_active    boolean     NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- Seed common medicines
INSERT INTO public.medicines (name, generic_name, category, unit) VALUES
  ('Amoxicillin 500mg',     'Amoxicillin',         'Antibiotic',       'capsule'),
  ('Amoxicillin 250mg/5ml', 'Amoxicillin',         'Antibiotic',       'ml'),
  ('Metronidazole 400mg',   'Metronidazole',        'Antibiotic',       'tablet'),
  ('Ciprofloxacin 500mg',   'Ciprofloxacin',        'Antibiotic',       'tablet'),
  ('Doxycycline 100mg',     'Doxycycline',          'Antibiotic',       'capsule'),
  ('Paracetamol 500mg',     'Paracetamol',          'Analgesic',        'tablet'),
  ('Ibuprofen 400mg',       'Ibuprofen',            'Analgesic/NSAID',  'tablet'),
  ('Diclofenac 50mg',       'Diclofenac',           'NSAID',            'tablet'),
  ('Omeprazole 20mg',       'Omeprazole',           'GI',               'capsule'),
  ('Metformin 500mg',       'Metformin',            'Antidiabetic',     'tablet'),
  ('Enalapril 5mg',         'Enalapril',            'Antihypertensive', 'tablet'),
  ('Amlodipine 5mg',        'Amlodipine',           'Antihypertensive', 'tablet'),
  ('Atenolol 50mg',         'Atenolol',             'Beta-blocker',     'tablet'),
  ('Salbutamol Inhaler',    'Salbutamol',           'Bronchodilator',   'inhaler'),
  ('Prednisolone 5mg',      'Prednisolone',         'Corticosteroid',   'tablet'),
  ('Artemether/Lumefantrine','Artemether/Lumefantrine','Antimalarial',  'tablet'),
  ('ORS Sachet',            'Oral Rehydration Salts','Electrolyte',     'sachet'),
  ('Iron + Folic Acid',     'Ferrous Sulphate',     'Supplement',       'tablet'),
  ('Vitamin C 500mg',       'Ascorbic Acid',        'Supplement',       'tablet'),
  ('Antacid Suspension',    'Aluminium Hydroxide',  'Antacid',          'ml')
ON CONFLICT (name) DO NOTHING;

-- 2. Prescriptions table
CREATE TABLE IF NOT EXISTS public.prescriptions (
  id                  bigserial PRIMARY KEY,
  patient_id          bigint      NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  appointment_id      bigint      REFERENCES public.appointments(id) ON DELETE SET NULL,
  consultation_id     bigint      REFERENCES public.consultations(id) ON DELETE SET NULL,
  doctor_username     text        NOT NULL,
  prescription_status text        NOT NULL DEFAULT 'Pending',
  -- Allowed: Pending | Ready | Partially Dispensed | Completed | Cancelled
  notes               text,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- 3. Prescription items table
CREATE TABLE IF NOT EXISTS public.prescription_items (
  id                     bigserial PRIMARY KEY,
  prescription_id        bigint NOT NULL REFERENCES public.prescriptions(id) ON DELETE CASCADE,
  medicine_id            bigint REFERENCES public.medicines(id) ON DELETE SET NULL,
  medicine_name_snapshot text   NOT NULL,  -- snapshot at time of prescribing
  dosage                 text   NOT NULL,
  frequency              text   NOT NULL,
  duration               text   NOT NULL,
  quantity               integer NOT NULL DEFAULT 1,
  route                  text   NOT NULL DEFAULT 'Oral',
  instructions           text,
  dispensing_status      text   NOT NULL DEFAULT 'Pending',
  dispensed_quantity     integer NOT NULL DEFAULT 0,
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now()
);

-- 4. Indexes
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient_id     ON public.prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_appointment_id ON public.prescriptions(appointment_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_consultation_id ON public.prescriptions(consultation_id);
CREATE INDEX IF NOT EXISTS idx_prescription_items_presc_id  ON public.prescription_items(prescription_id);
CREATE INDEX IF NOT EXISTS idx_medicines_is_active          ON public.medicines(is_active);

-- 5. RLS
ALTER TABLE public.medicines          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescription_items ENABLE ROW LEVEL SECURITY;

-- Medicines: public read (doctors need to browse), staff write
CREATE POLICY "anon select medicines"  ON public.medicines FOR SELECT TO anon USING (true);
CREATE POLICY "anon insert medicines"  ON public.medicines FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon update medicines"  ON public.medicines FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Prescriptions
CREATE POLICY "anon select prescriptions"  ON public.prescriptions FOR SELECT TO anon USING (true);
CREATE POLICY "anon insert prescriptions"  ON public.prescriptions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon update prescriptions"  ON public.prescriptions FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Prescription items
CREATE POLICY "anon select prescription_items" ON public.prescription_items FOR SELECT TO anon USING (true);
CREATE POLICY "anon insert prescription_items" ON public.prescription_items FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon update prescription_items" ON public.prescription_items FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- 6. Grants
GRANT SELECT, INSERT, UPDATE ON public.medicines          TO anon;
GRANT SELECT, INSERT, UPDATE ON public.prescriptions      TO anon;
GRANT SELECT, INSERT, UPDATE ON public.prescription_items TO anon;
GRANT USAGE, SELECT ON SEQUENCE public.medicines_id_seq           TO anon;
GRANT USAGE, SELECT ON SEQUENCE public.prescriptions_id_seq       TO anon;
GRANT USAGE, SELECT ON SEQUENCE public.prescription_items_id_seq  TO anon;

-- ============================================================
-- Done. 20 common medicines seeded.
-- ============================================================
