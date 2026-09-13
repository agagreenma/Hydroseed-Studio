CREATE OR REPLACE FUNCTION public.can_transition_content_status(
  _old public.content_status,
  _new public.content_status,
  _content_id uuid
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE
    WHEN _old = _new THEN false
    WHEN public.is_admin(auth.uid()) THEN true
    WHEN _old = 'draft' AND _new = 'in_review'
      THEN EXISTS (
        SELECT 1 FROM public.content_items
        WHERE id = _content_id AND created_by = auth.uid()
      ) AND (
        public.has_role(auth.uid(), 'writer') OR
        public.has_role(auth.uid(), 'editor')
      )
    WHEN _old = 'in_review' AND _new = 'seo_review'
      THEN public.has_role(auth.uid(), 'editor')
    WHEN _old = 'seo_review' AND _new = 'approved'
      THEN public.has_role(auth.uid(), 'seo_reviewer')
    WHEN _old = 'approved' AND _new = 'scheduled'
      THEN public.has_role(auth.uid(), 'publisher')
    WHEN _old = 'scheduled' AND _new = 'published'
      THEN public.has_role(auth.uid(), 'publisher')
    WHEN _old = 'published' AND _new = 'updated'
      THEN public.has_role(auth.uid(), 'publisher')
    WHEN _old = 'updated' AND _new = 'archived'
      THEN public.has_role(auth.uid(), 'publisher')
    ELSE false
  END
$$;