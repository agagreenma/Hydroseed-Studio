CREATE TABLE public.redirects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_path text NOT NULL,
  destination text NOT NULL,
  status_code smallint NOT NULL DEFAULT 301 CHECK (status_code IN (301, 302)),
  active boolean NOT NULL DEFAULT true,
  created_by uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT redirects_source_path_check CHECK (
    source_path LIKE '/%'
    AND source_path NOT LIKE '//%'
    AND source_path <> destination
    AND source_path !~ '^/(auth|content|team|settings|seo|redirects|media|admin)(/|$)'
  ),
  CONSTRAINT redirects_destination_check CHECK (
    (destination LIKE '/%'
      AND destination !~ '^/(auth|content|team|settings|seo|redirects|media|admin)(/|$)')
    OR destination ~* '^https?://'
  )
);

CREATE UNIQUE INDEX redirects_active_source_idx
  ON public.redirects (source_path)
  WHERE active;

GRANT SELECT ON public.redirects TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.redirects TO authenticated;
GRANT ALL ON public.redirects TO service_role;
ALTER TABLE public.redirects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active redirects" ON public.redirects
  FOR SELECT TO anon, authenticated USING (active);
CREATE POLICY "Members can read redirects" ON public.redirects
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Editors manage redirects" ON public.redirects
  FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid() AND public.is_editor_or_admin(auth.uid()));
CREATE POLICY "Editors update redirects" ON public.redirects
  FOR UPDATE TO authenticated
  USING (public.is_editor_or_admin(auth.uid()))
  WITH CHECK (public.is_editor_or_admin(auth.uid()));
CREATE POLICY "Editors delete redirects" ON public.redirects
  FOR DELETE TO authenticated
  USING (public.is_editor_or_admin(auth.uid()));

CREATE TRIGGER redirects_set_updated_at
BEFORE UPDATE ON public.redirects
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER redirects_audit
AFTER INSERT OR UPDATE OR DELETE ON public.redirects
FOR EACH ROW EXECUTE FUNCTION public.record_audit();