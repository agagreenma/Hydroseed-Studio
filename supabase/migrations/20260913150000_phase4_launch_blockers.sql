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
    WHEN NOT (
      (_old = 'draft' AND _new = 'in_review') OR
      (_old = 'in_review' AND _new = 'seo_review') OR
      (_old = 'seo_review' AND _new = 'approved') OR
      (_old = 'approved' AND _new = 'scheduled') OR
      (_old = 'scheduled' AND _new = 'published') OR
      (_old = 'published' AND _new = 'updated') OR
      (_old = 'updated' AND _new = 'archived')
    ) THEN false
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
      THEN EXISTS (
        SELECT 1 FROM public.studio_user_roles
        WHERE user_id = auth.uid() AND role::text = 'seo_reviewer'
      )
    WHEN _old = 'approved' AND _new = 'scheduled'
      THEN EXISTS (
        SELECT 1 FROM public.studio_user_roles
        WHERE user_id = auth.uid() AND role::text = 'publisher'
      )
    WHEN _old = 'scheduled' AND _new = 'published'
      THEN EXISTS (
        SELECT 1 FROM public.studio_user_roles
        WHERE user_id = auth.uid() AND role::text = 'publisher'
      )
    WHEN _old = 'published' AND _new = 'updated'
      THEN EXISTS (
        SELECT 1 FROM public.studio_user_roles
        WHERE user_id = auth.uid() AND role::text = 'publisher'
      )
    WHEN _old = 'updated' AND _new = 'archived'
      THEN EXISTS (
        SELECT 1 FROM public.studio_user_roles
        WHERE user_id = auth.uid() AND role::text = 'publisher'
      )
    ELSE false
  END
$$;

CREATE OR REPLACE FUNCTION public.validate_content_status_transition()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF current_setting('app.restore_content_version', true) = 'on' THEN
    RETURN NEW;
  END IF;

  IF NEW.status = OLD.status THEN
    RAISE EXCEPTION 'Content status must change to a different state';
  END IF;

  IF NOT public.can_transition_content_status(OLD.status, NEW.status, OLD.id) THEN
    RAISE EXCEPTION 'Invalid or unauthorized content status transition: % -> %',
      OLD.status, NEW.status;
  END IF;

  IF NEW.status = 'scheduled' AND NEW.scheduled_at IS NULL THEN
    RAISE EXCEPTION 'Scheduled content requires scheduled_at';
  END IF;

  IF NEW.status = 'published' THEN
    NEW.published_at = COALESCE(NEW.published_at, now());
    NEW.seo = jsonb_set(
      COALESCE(NEW.seo, '{}'::jsonb),
      '{canonical_url}',
      to_jsonb(COALESCE(
        NULLIF(NEW.seo->>'canonical_url', ''),
        'https://studio.hydroseed.app/journal/articles/' || NEW.slug
      )),
      true
    );
  END IF;

  RETURN NEW;
END;
$$;

SELECT set_config('app.restore_content_version', 'on', true);

UPDATE public.content_items
SET seo = jsonb_set(
  COALESCE(seo, '{}'::jsonb),
  '{canonical_url}',
  to_jsonb('https://studio.hydroseed.app/journal/articles/' || slug),
  true
)
WHERE type IN ('article', 'blog_post')
  AND status = 'published'
  AND NULLIF(seo->>'canonical_url', '') IS NULL;

SELECT set_config('app.restore_content_version', 'off', true);
