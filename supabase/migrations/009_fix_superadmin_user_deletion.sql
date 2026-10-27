-- Correct the CMS role check used by the deletion RPC.
-- Run in Supabase SQL Editor or through the project's migration process.
-- This migration changes no user's role and deletes no account by itself.
BEGIN;

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('admin', 'editor', 'superadmin'));

-- Recreate the unversioned RPC so the signature and permissions are explicit.
DROP FUNCTION IF EXISTS public.delete_user_completely(uuid);
CREATE FUNCTION public.delete_user_completely(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  caller_id uuid := auth.uid();
  target_user_id uuid := user_id;
  caller_role text;
BEGIN
  IF caller_id IS NULL THEN
    RAISE EXCEPTION 'Sessão não autenticada.' USING ERRCODE = '42501';
  END IF;

  SELECT p.role INTO caller_role FROM public.profiles AS p WHERE p.id = caller_id;
  IF caller_role IS DISTINCT FROM 'superadmin' THEN
    RAISE EXCEPTION 'Apenas Super Admins podem remover usuários.' USING ERRCODE = '42501';
  END IF;

  -- Serialize deletions of privileged accounts, and check the actual profile
  -- after acquiring the locks. JWT role = authenticated is not the CMS role.
  PERFORM p.id FROM public.profiles AS p
    WHERE p.role = 'superadmin' ORDER BY p.id FOR UPDATE;
  SELECT p.role INTO caller_role FROM public.profiles AS p WHERE p.id = caller_id;
  IF caller_role IS DISTINCT FROM 'superadmin' THEN
    RAISE EXCEPTION 'Apenas Super Admins podem remover usuários.' USING ERRCODE = '42501';
  END IF;

  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'Informe o usuário que deseja remover.' USING ERRCODE = '22023';
  END IF;
  IF target_user_id = caller_id THEN
    RAISE EXCEPTION 'Você não pode remover a própria conta.' USING ERRCODE = '42501';
  END IF;

  PERFORM u.id FROM auth.users AS u WHERE u.id = target_user_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Usuário não encontrado.' USING ERRCODE = 'P0002';
  END IF;

  -- Keep uploaded assets. The original schema has a non-cascading FK here.
  UPDATE public.media SET uploaded_by = NULL WHERE uploaded_by = target_user_id;

  -- auth.users cascades to profiles; posts retain their content via SET NULL.
  DELETE FROM auth.users AS u WHERE u.id = target_user_id;

  INSERT INTO public.system_logs (user_id, action, entity_type, entity_id, details)
  VALUES (caller_id, 'Removeu usuário permanentemente', 'user', target_user_id::text,
          jsonb_build_object('authorized_role', caller_role));
END;
$$;

REVOKE ALL ON FUNCTION public.delete_user_completely(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.delete_user_completely(uuid) TO authenticated;

COMMIT;
