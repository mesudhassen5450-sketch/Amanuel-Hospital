-- ============================================================================
-- CONSULTATION CHAT MESSAGES SCHEMA
-- Real-time text messaging during video consultations
-- ============================================================================

-- Create consultation_messages table
CREATE TABLE IF NOT EXISTS public.consultation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id TEXT NOT NULL,
  room_id TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('doctor', 'patient')),
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'system')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_consultation_messages_appointment ON public.consultation_messages(appointment_id);
CREATE INDEX IF NOT EXISTS idx_consultation_messages_room ON public.consultation_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_consultation_messages_created ON public.consultation_messages(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.consultation_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for consultation_messages
-- Allow authenticated users to read messages for their appointments
CREATE POLICY "Users can read consultation messages for their appointments"
  ON public.consultation_messages
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert messages
CREATE POLICY "Users can send consultation messages"
  ON public.consultation_messages
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Allow users to update their own messages (for read receipts)
CREATE POLICY "Users can update their own messages"
  ON public.consultation_messages
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_consultation_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_consultation_messages_updated_at
  BEFORE UPDATE ON public.consultation_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_consultation_messages_updated_at();

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON public.consultation_messages TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.consultation_messages TO anon;

-- ============================================================================
-- SAMPLE DATA (for testing)
-- ============================================================================
-- Uncomment to insert test data
/*
INSERT INTO public.consultation_messages (
  appointment_id, 
  room_id, 
  sender_id, 
  sender_name, 
  sender_role, 
  message
) VALUES 
  ('apt_123', 'room_apt_123', 'patient_123', 'John Doe', 'patient', 'Hello doctor, I have a headache'),
  ('apt_123', 'room_apt_123', 'dr_smith', 'Dr. Smith', 'doctor', 'Hello John, how long have you had this headache?');
*/

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Verify table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'consultation_messages' 
ORDER BY ordinal_position;

-- Check policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'consultation_messages';
