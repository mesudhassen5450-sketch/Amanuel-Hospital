-- Run this in the Supabase SQL Editor for your project:
-- https://supabase.com/dashboard/project/effhdgpklekbwmvmqlfe/sql

-- Enable Row Level Security (already enabled according to brief, but included for safety)
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Allow any anonymous user to INSERT a new appointment (booking form)
-- No SELECT/UPDATE/DELETE for anonymous users — patients cannot read other patients' data
CREATE POLICY "Allow public insert" ON public.appointments
  FOR INSERT
  TO anon
  WITH CHECK (true);
