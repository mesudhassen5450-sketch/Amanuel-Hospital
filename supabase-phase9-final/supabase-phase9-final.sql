-- ============================================================
-- DR. AMANUEL HOSPITAL MANAGEMENT SYSTEM
-- SUPABASE PHASE 9 FINAL: Secure Staff Auth & Account Management
--
-- Features included in this script:
-- 1. pgcrypto extension for secure bcrypt password hashing
-- 2. staff_accounts table definition with RLS & indexes
-- 3. Default staff accounts with bcrypt password hashes ('4321')
-- 4. SECURITY DEFINER RPC functions:
--    - validate_staff_login (with is_active check)
--    - get_all_staff_accounts
--    - get_staff_account_by_id
--    - create_staff_account (bcrypt hashing)
--    - update_staff_account
--    - reset_staff_password (bcrypt re-hashing)
--    - toggle_staff_account_status (protects last admin)
-- 5. Full anon execute permissions for RPC functions
-- ============================================================

-- 1. Enable pgcrypto extension for bcrypt password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Create staff_accounts table if not exists
CREATE TABLE IF NOT EXISTS public.staff_accounts (
  id           bigserial PRIMARY KEY,
  username     text        NOT NULL UNIQUE,
  password_hash text       NOT NULL,
  role         text        NOT NULL,
  display_name text,
  is_active    boolean     NOT NULL DEFAULT true,
  last_login   timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- 3. Create index for fast username lookup
CREATE INDEX IF NOT EXISTS idx_staff_accounts_username ON public.staff_accounts(username);

-- 4. Insert / Seed default staff accounts (Default password for all: 4321)
INSERT INTO public.staff_accounts (username, password_hash, role, display_name, is_active) VALUES
  ('admin',      crypt('4321', gen_salt('bf', 10)), 'admin',      'System Administrator',  true),
  ('reception',  crypt('4321', gen_salt('bf', 10)), 'reception',  'Reception Officer',     true),
  ('cashier',    crypt('4321', gen_salt('bf', 10)), 'cashier',    'Hospital Cashier',      true),
  ('doctor',     crypt('4321', gen_salt('bf', 10)), 'doctor',     'General Practitioner',  true),
  ('laboratory', crypt('4321', gen_salt('bf', 10)), 'laboratory', 'Lab Technician',       true),
  ('pharmacy',   crypt('4321', gen_salt('bf', 10)), 'pharmacy',   'Chief Pharmacist',      true),
  ('staff',      crypt('4321', gen_salt('bf', 10)), 'staff',      'General Staff',         true)
ON CONFLICT (username) DO UPDATE
  SET password_hash = EXCLUDED.password_hash,
      role          = EXCLUDED.role,
      display_name  = EXCLUDED.display_name,
      is_active     = EXCLUDED.is_active,
      updated_at    = now();

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.staff_accounts ENABLE ROW LEVEL SECURITY;

-- Anonymous SELECT/INSERT/UPDATE policies (protected by application server-side checkRole)
DROP POLICY IF EXISTS anon_select_staff_accounts ON public.staff_accounts;
CREATE POLICY anon_select_staff_accounts ON public.staff_accounts FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS anon_insert_staff_accounts ON public.staff_accounts;
CREATE POLICY anon_insert_staff_accounts ON public.staff_accounts FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS anon_update_staff_accounts ON public.staff_accounts;
CREATE POLICY anon_update_staff_accounts ON public.staff_accounts FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- 6. RPC: validate_staff_login
-- Authenticates staff and ensures account is_active = true
CREATE OR REPLACE FUNCTION public.validate_staff_login(
  p_username text,
  p_password text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_account public.staff_accounts%ROWTYPE;
BEGIN
  SELECT * INTO v_account
  FROM public.staff_accounts
  WHERE username = lower(trim(p_username));

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Invalid username or password.');
  END IF;

  IF v_account.is_active = false THEN
    RETURN json_build_object('success', false, 'error', 'Account is deactivated. Please contact an administrator.');
  END IF;

  IF v_account.password_hash = crypt(p_password, v_account.password_hash) THEN
    UPDATE public.staff_accounts
    SET last_login = now(), updated_at = now()
    WHERE id = v_account.id;

    RETURN json_build_object(
      'success',      true,
      'username',     v_account.username,
      'role',         v_account.role,
      'display_name', v_account.display_name
    );
  ELSE
    RETURN json_build_object('success', false, 'error', 'Invalid username or password.');
  END IF;
END;
$$;

-- 7. RPC: get_all_staff_accounts
CREATE OR REPLACE FUNCTION public.get_all_staff_accounts()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_accounts json;
BEGIN
  SELECT json_agg(json_build_object(
    'id', id,
    'username', username,
    'role', role,
    'display_name', display_name,
    'is_active', is_active,
    'last_login', last_login,
    'created_at', created_at,
    'updated_at', updated_at
  )) INTO v_accounts
  FROM public.staff_accounts
  ORDER BY created_at DESC;

  RETURN json_build_object('success', true, 'data', COALESCE(v_accounts, '[]'::json));
END;
$$;

-- 8. RPC: get_staff_account_by_id
CREATE OR REPLACE FUNCTION public.get_staff_account_by_id(p_id bigint)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_account public.staff_accounts%ROWTYPE;
BEGIN
  SELECT * INTO v_account
  FROM public.staff_accounts
  WHERE id = p_id;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Staff account not found');
  END IF;

  RETURN json_build_object(
    'success', true,
    'data', json_build_object(
      'id', v_account.id,
      'username', v_account.username,
      'role', v_account.role,
      'display_name', v_account.display_name,
      'is_active', v_account.is_active,
      'last_login', v_account.last_login,
      'created_at', v_account.created_at,
      'updated_at', v_account.updated_at
    )
  );
END;
$$;

-- 9. RPC: create_staff_account
CREATE OR REPLACE FUNCTION public.create_staff_account(
  p_username text,
  p_password text,
  p_role text,
  p_display_name text,
  p_is_active boolean
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_account public.staff_accounts%ROWTYPE;
BEGIN
  IF EXISTS (SELECT 1 FROM public.staff_accounts WHERE username = lower(trim(p_username))) THEN
    RETURN json_build_object('success', false, 'error', 'Username already exists');
  END IF;

  IF p_role NOT IN ('admin', 'reception', 'cashier', 'doctor', 'laboratory', 'pharmacy', 'staff') THEN
    RETURN json_build_object('success', false, 'error', 'Invalid role specified');
  END IF;

  INSERT INTO public.staff_accounts (username, password_hash, role, display_name, is_active)
  VALUES (lower(trim(p_username)), crypt(p_password, gen_salt('bf', 10)), p_role, p_display_name, p_is_active)
  RETURNING * INTO v_account;

  RETURN json_build_object(
    'success', true,
    'data', json_build_object(
      'id', v_account.id,
      'username', v_account.username,
      'role', v_account.role,
      'display_name', v_account.display_name,
      'is_active', v_account.is_active,
      'created_at', v_account.created_at
    )
  );
END;
$$;

-- 10. RPC: update_staff_account
CREATE OR REPLACE FUNCTION public.update_staff_account(
  p_id bigint,
  p_username text,
  p_role text,
  p_display_name text,
  p_is_active boolean
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_account public.staff_accounts%ROWTYPE;
BEGIN
  SELECT * INTO v_account FROM public.staff_accounts WHERE id = p_id;
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Staff account not found');
  END IF;

  IF lower(trim(p_username)) != v_account.username AND 
     EXISTS (SELECT 1 FROM public.staff_accounts WHERE username = lower(trim(p_username)) AND id != p_id) THEN
    RETURN json_build_object('success', false, 'error', 'Username already exists');
  END IF;

  IF p_role NOT IN ('admin', 'reception', 'cashier', 'doctor', 'laboratory', 'pharmacy', 'staff') THEN
    RETURN json_build_object('success', false, 'error', 'Invalid role specified');
  END IF;

  UPDATE public.staff_accounts
  SET username = lower(trim(p_username)),
      role = p_role,
      display_name = p_display_name,
      is_active = p_is_active,
      updated_at = now()
  WHERE id = p_id
  RETURNING * INTO v_account;

  RETURN json_build_object(
    'success', true,
    'data', json_build_object(
      'id', v_account.id,
      'username', v_account.username,
      'role', v_account.role,
      'display_name', v_account.display_name,
      'is_active', v_account.is_active,
      'updated_at', v_account.updated_at
    )
  );
END;
$$;

-- 11. RPC: reset_staff_password
CREATE OR REPLACE FUNCTION public.reset_staff_password(
  p_id bigint,
  p_new_password text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_account public.staff_accounts%ROWTYPE;
BEGIN
  SELECT * INTO v_account FROM public.staff_accounts WHERE id = p_id;
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Staff account not found');
  END IF;

  UPDATE public.staff_accounts
  SET password_hash = crypt(p_new_password, gen_salt('bf', 10)),
      updated_at = now()
  WHERE id = p_id;

  RETURN json_build_object('success', true, 'message', 'Password reset successfully');
END;
$$;

-- 12. RPC: toggle_staff_account_status
CREATE OR REPLACE FUNCTION public.toggle_staff_account_status(p_id bigint)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_account public.staff_accounts%ROWTYPE;
  v_admin_count int;
BEGIN
  SELECT * INTO v_account FROM public.staff_accounts WHERE id = p_id;
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Staff account not found');
  END IF;

  IF v_account.role = 'admin' AND v_account.is_active = true THEN
    SELECT COUNT(*) INTO v_admin_count
    FROM public.staff_accounts
    WHERE role = 'admin' AND is_active = true;

    IF v_admin_count <= 1 THEN
      RETURN json_build_object('success', false, 'error', 'Cannot deactivate the last active admin account');
    END IF;
  END IF;

  UPDATE public.staff_accounts
  SET is_active = NOT is_active,
      updated_at = now()
  WHERE id = p_id
  RETURNING * INTO v_account;

  RETURN json_build_object(
    'success', true,
    'data', json_build_object(
      'id', v_account.id,
      'is_active', v_account.is_active,
      'updated_at', v_account.updated_at
    )
  );
END;
$$;

-- 13. Grant execute permissions to anon role
GRANT EXECUTE ON FUNCTION public.validate_staff_login(text, text) TO anon;
GRANT EXECUTE ON FUNCTION public.get_all_staff_accounts() TO anon;
GRANT EXECUTE ON FUNCTION public.get_staff_account_by_id(bigint) TO anon;
GRANT EXECUTE ON FUNCTION public.create_staff_account(text, text, text, text, boolean) TO anon;
GRANT EXECUTE ON FUNCTION public.update_staff_account(bigint, text, text, text, boolean) TO anon;
GRANT EXECUTE ON FUNCTION public.reset_staff_password(bigint, text) TO anon;
GRANT EXECUTE ON FUNCTION public.toggle_staff_account_status(bigint) TO anon;

-- ============================================================
-- DONE. Supabase Phase 9 Final SQL Migration Package.
-- ============================================================
