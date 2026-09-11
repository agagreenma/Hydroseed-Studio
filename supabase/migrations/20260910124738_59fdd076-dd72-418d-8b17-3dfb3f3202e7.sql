REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_admin(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_editor_or_admin(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.can_edit_content(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_editor_or_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_edit_content(uuid) TO authenticated;

REVOKE ALL ON FUNCTION public.record_audit() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.assign_default_role() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.bump_content_version() FROM PUBLIC, anon, authenticated;