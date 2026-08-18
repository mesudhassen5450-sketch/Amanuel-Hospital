-- Enable RLS on public.calls table
ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;

-- Grant necessary table and sequence permissions
GRANT SELECT, INSERT ON public.calls TO anon;
GRANT SELECT, INSERT ON public.calls TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "calls_insert_policy" ON public.calls;
DROP POLICY IF EXISTS "calls_select_policy" ON public.calls;
DROP POLICY IF EXISTS "calls_update_policy" ON public.calls;

-- Policy: Allow authenticated users to insert call records
-- This allows patients to initiate calls after payment
CREATE POLICY "calls_insert_policy" ON public.calls
FOR INSERT
TO authenticated
WITH CHECK (
  -- Allow insertion if the user is the patient (matching patient_id if it's a UUID)
  -- OR allow insertion for any authenticated user (for guest/patient flow)
  true
);

-- Policy: Allow authenticated users to select call records
-- This allows doctors to see incoming calls and patients to see their call history
CREATE POLICY "calls_select_policy" ON public.calls
FOR SELECT
TO authenticated
USING (
  -- Allow doctors to see calls where they are the target
  doctor_username::text = (
    SELECT username 
    FROM staff_accounts 
    WHERE id::text = auth.uid()::text
  )
  OR
  -- Allow patients to see their own calls
  patient_id::text = auth.uid()::text
  OR
  -- Allow all authenticated users to see calls (for simpler implementation)
  true
);

-- Policy: Allow authenticated users to update call records
-- This allows doctors to accept/decline calls and update status
CREATE POLICY "calls_update_policy" ON public.calls
FOR UPDATE
TO authenticated
USING (
  -- Allow doctors to update calls where they are the target
  doctor_username::text = (
    SELECT username 
    FROM staff_accounts 
    WHERE id::text = auth.uid()::text
  )
  OR
  -- Allow patients to update their own calls
  patient_id::text = auth.uid()::text
);

-- Optional: Allow anon (unauthenticated) users to insert call records
-- Uncomment this if you want to allow guest patients to initiate calls without login
-- CREATE POLICY "calls_anon_insert_policy" ON public.calls
-- FOR INSERT
-- TO anon
-- WITH CHECK (true);

-- Optional: Allow anon users to select call records
-- Uncomment this if needed for guest access
-- CREATE POLICY "calls_anon_select_policy" ON public.calls
-- FOR SELECT
-- TO anon
-- USING (true);
