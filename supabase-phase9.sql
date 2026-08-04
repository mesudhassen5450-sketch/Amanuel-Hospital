-- ============================================================
-- PHASE 9.1: Secure Staff Authentication
-- Run in: https://supabase.com/dashboard/project/effhdgpklekbwmvmqlfe/sql
-- ============================================================

-- 1. Staff accounts table (server-side only — never exposed to browser)
CREATE TABLE IF NOT EXISTS public.staff_accounts (
  id           bigserial PRIMARY KEY,
  username     text        NOT NULL UNIQUE,
  -- bcrypt hash of password (cost 10) — generated below
  password_hash text       NOT NULL,
  role         text        NOT NULL,
  display_name text,
  is_active    boolean     NOT NULL DEFAULT true,
  last_login   timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- 2. Indexes
CREATE INDEX IF NOT EXISTS idx_staff_accounts_username ON public.staff_accounts(username);

-- 3. Seed staff accounts
-- Passwords are bcrypt hashed (cost 10) of "4321"
-- Hash: $2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.
-- (This is the well-known bcrypt hash of "password" — replace with real hash of "4321" after running)
-- For now, we store a SHA-256 hex of "4321" as a simple upgrade from plaintext
-- The server function will compare using a constant-time check

-- Using pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO public.staff_accounts (username, password_hash, role, display_name) VALUES
  ('staff',      crypt('4321', gen_salt('bf', 10)), 'staff',      'General Staff'),
  ('reception',  crypt('4321', gen_salt('bf', 10)), 'reception',  'Reception'),
  ('doctor',     crypt('4321', gen_salt('bf', 10)), 'doctor',     'Doctor'),
  ('laboratory', crypt('4321', gen_salt('bf', 10)), 'laboratory', 'Laboratory'),
  ('pharmacy',   crypt('4321', gen_salt('bf', 10)), 'pharmacy',   'Pharmacy')
ON CONFLICT (username) DO UPDATE
  SET password_hash = EXCLUDED.password_hash,
      role          = EXCLUDED.role,
      updated_at    = now();

-- 4. RLS — staff_accounts must NEVER be readable by anon
ALTER TABLE public.staff_accounts ENABLE ROW LEVEL SECURITY;

-- No anon SELECT — only server-side (service role) can read
-- We use a PostgreSQL function to validate credentials so anon never sees hashes

-- 5. Secure validation function — callable by anon, returns role only (not hash)
CREATE OR REPLACE FUNCTION public.validate_staff_login(
  p_username text,
  p_password text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER  -- runs as owner (postgres), can read staff_accounts
AS $$
DECLARE
  v_account public.staff_accounts%ROWTYPE;
BEGIN
  SELECT * INTO v_account
  FROM public.staff_accounts
  WHERE username = lower(p_username)
    AND is_active = true;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Invalid credentials');
  END IF;

  IF v_account.password_hash = crypt(p_password, v_account.password_hash) THEN
    -- Update last_login
    UPDATE public.staff_accounts
    SET last_login = now(), updated_at = now()
    WHERE id = v_account.id;

    RETURN json_build_object(
      'success',   true,
      'username',  v_account.username,
      'role',      v_account.role,
      'display_name', v_account.display_name
    );
  ELSE
    RETURN json_build_object('success', false, 'error', 'Invalid credentials');
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.validate_staff_login(text, text) TO anon;

-- ============================================================
-- Done. Password hashes stored using bcrypt (pgcrypto).
-- The validate_staff_login function is the ONLY way anon can
-- check credentials — it never exposes the hash itself.
-- ============================================================
