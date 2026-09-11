CREATE TABLE public.studio_members (
  id UUID NOT NULL PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  last_seen_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.studio_members TO authenticated;
GRANT ALL ON public.studio_members TO service_role;

ALTER TABLE public.studio_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Studio members can view their own profile"
  ON public.studio_members FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Studio members can create their own profile"
  ON public.studio_members FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Studio members can update their own profile"
  ON public.studio_members FOR UPDATE TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER studio_members_set_updated_at
BEFORE UPDATE ON public.studio_members
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();