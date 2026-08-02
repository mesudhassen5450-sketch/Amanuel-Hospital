-- ============================================================
-- PHASE 7.3: Pharmacy Portal
-- Run in: https://supabase.com/dashboard/project/effhdgpklekbwmvmqlfe/sql
-- ============================================================

-- 1. Add stock_quantity to medicines (safe, skips if already exists)
ALTER TABLE public.medicines
  ADD COLUMN IF NOT EXISTS stock_quantity integer NOT NULL DEFAULT 0;

-- Seed initial stock (50 units each)
UPDATE public.medicines SET stock_quantity = 50 WHERE stock_quantity = 0;

-- 2. Dispense log table
CREATE TABLE IF NOT EXISTS public.dispense_log (
  id                   bigserial PRIMARY KEY,
  prescription_id      bigint NOT NULL REFERENCES public.prescriptions(id) ON DELETE CASCADE,
  prescription_item_id bigint NOT NULL REFERENCES public.prescription_items(id) ON DELETE CASCADE,
  medicine_id          bigint REFERENCES public.medicines(id) ON DELETE SET NULL,
  medicine_name        text   NOT NULL,
  quantity_dispensed   integer NOT NULL DEFAULT 0,
  pharmacist_username  text   NOT NULL,
  dispensed_at         timestamptz NOT NULL DEFAULT now()
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_dispense_log_prescription_id ON public.dispense_log(prescription_id);
CREATE INDEX IF NOT EXISTS idx_dispense_log_medicine_id     ON public.dispense_log(medicine_id);

-- 4. RLS
ALTER TABLE public.dispense_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon select dispense_log" ON public.dispense_log FOR SELECT TO anon USING (true);
CREATE POLICY "anon insert dispense_log" ON public.dispense_log FOR INSERT TO anon WITH CHECK (true);

-- 5. Grants
GRANT SELECT, INSERT ON public.dispense_log TO anon;
GRANT UPDATE ON public.medicines TO anon;
GRANT USAGE, SELECT ON SEQUENCE public.dispense_log_id_seq TO anon;

-- ============================================================
-- Done. Check medicines table now has stock_quantity column.
-- ============================================================
