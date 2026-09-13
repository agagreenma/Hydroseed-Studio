ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'seo_reviewer';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'publisher';

ALTER TABLE public.content_items
  ADD COLUMN IF NOT EXISTS scheduled_at timestamptz,
  ADD COLUMN IF NOT EXISTS published_at timestamptz;

CREATE TABLE public.content_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_item_id uuid NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  version integer NOT NULL,
  status public.content_status NOT NULL,
  title text NOT NULL,
  slug text NOT NULL,
  locale text NOT NULL,
  excerpt text,
  body text,
  author_id uuid,
  category_id uuid,
  cluster_id uuid,
  cover_media_id uuid,
  seo jsonb NOT NULL DEFAULT '{}'::jsonb,
  scheduled_at timestamptz,
  published_at timestamptz,
  created_by uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  transition_from public.content_status,
  transition_to public.content_status,
  UNIQUE (content_item_id, version)
);

GRANT SELECT ON public.content_versions TO authenticated;
GRANT ALL ON public.content_versions TO service_role;
ALTER TABLE public.content_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members read content versions" ON public.content_versions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Public can read published articles" ON public.content_items
  FOR SELECT TO anon, authenticated
  USING (
    type IN ('article', 'blog_post')
    AND status = 'published'
    AND (scheduled_at IS NULL OR scheduled_at <= now())
  );

INSERT INTO public.content_versions (
  content_item_id, version, status, title, slug, locale, excerpt, body,
  author_id, category_id, cluster_id, cover_media_id, seo, scheduled_at,
  published_at, created_by, created_at
)
SELECT
  id, version, status, title, slug, locale, excerpt, body, author_id,
  category_id, cluster_id, cover_media_id, seo, scheduled_at, published_at,
  created_by, created_at
FROM public.content_items
ON CONFLICT (content_item_id, version) DO NOTHING;

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
    RAISE EXCEPTION 'Invalid or unauthorized content status transition: % -> %', OLD.status, NEW.status;
  END IF;

  IF NEW.status = 'scheduled' AND NEW.scheduled_at IS NULL THEN
    RAISE EXCEPTION 'Scheduled content requires scheduled_at';
  END IF;

  IF NEW.status = 'published' THEN
    NEW.published_at = COALESCE(NEW.published_at, now());
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.protect_content_workflow_updates()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF current_setting('app.restore_content_version', true) = 'on' THEN
    RETURN NEW;
  END IF;

  IF NEW.status = OLD.status AND OLD.status NOT IN ('draft', 'updated') THEN
    IF ROW(
      NEW.title, NEW.slug, NEW.locale, NEW.excerpt, NEW.body, NEW.author_id,
      NEW.category_id, NEW.cluster_id, NEW.cover_media_id, NEW.seo
    ) IS DISTINCT FROM ROW(
      OLD.title, OLD.slug, OLD.locale, OLD.excerpt, OLD.body, OLD.author_id,
      OLD.category_id, OLD.cluster_id, OLD.cover_media_id, OLD.seo
    ) THEN
      RAISE EXCEPTION 'Content fields may only be edited in Draft or Updated status';
    END IF;
  END IF;

  IF NEW.status <> OLD.status AND ROW(
    NEW.title, NEW.slug, NEW.locale, NEW.excerpt, NEW.body, NEW.author_id,
    NEW.category_id, NEW.cluster_id, NEW.cover_media_id, NEW.seo
  ) IS DISTINCT FROM ROW(
    OLD.title, OLD.slug, OLD.locale, OLD.excerpt, OLD.body, OLD.author_id,
    OLD.category_id, OLD.cluster_id, OLD.cover_media_id, OLD.seo
  ) THEN
    RAISE EXCEPTION 'Workflow transitions cannot modify content fields';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER content_items_protect_workflow_updates
BEFORE UPDATE ON public.content_items
FOR EACH ROW EXECUTE FUNCTION public.protect_content_workflow_updates();

CREATE OR REPLACE FUNCTION public.record_content_version()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.content_versions (
    content_item_id, version, status, title, slug, locale, excerpt, body,
    author_id, category_id, cluster_id, cover_media_id, seo, scheduled_at,
    published_at, created_by, transition_from, transition_to
  ) VALUES (
    NEW.id, NEW.version, NEW.status, NEW.title, NEW.slug, NEW.locale,
    NEW.excerpt, NEW.body, NEW.author_id, NEW.category_id, NEW.cluster_id,
    NEW.cover_media_id, NEW.seo, NEW.scheduled_at, NEW.published_at,
    COALESCE(auth.uid(), NEW.created_by),
    CASE WHEN TG_OP = 'UPDATE' AND OLD.status <> NEW.status THEN OLD.status END,
    CASE WHEN TG_OP = 'UPDATE' AND OLD.status <> NEW.status THEN NEW.status END
  )
  ON CONFLICT (content_item_id, version) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER content_items_record_version
AFTER INSERT OR UPDATE ON public.content_items
FOR EACH ROW EXECUTE FUNCTION public.record_content_version();

CREATE OR REPLACE FUNCTION public.transition_content_status(
  _content_id uuid,
  _expected_version integer,
  _target_status public.content_status,
  _scheduled_at timestamptz DEFAULT NULL
)
RETURNS public.content_items
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _item public.content_items;
BEGIN
  UPDATE public.content_items
  SET status = _target_status,
      scheduled_at = CASE
        WHEN _target_status = 'scheduled' THEN _scheduled_at
        WHEN _target_status = 'published' THEN scheduled_at
        ELSE NULL
      END
  WHERE id = _content_id AND version = _expected_version
  RETURNING * INTO _item;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'SAVE_CONFLICT: content item changed or does not exist';
  END IF;

  RETURN _item;
END;
$$;

CREATE OR REPLACE FUNCTION public.restore_content_version(
  _content_id uuid,
  _version_id uuid,
  _expected_version integer
)
RETURNS public.content_items
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _snapshot public.content_versions;
  _item public.content_items;
BEGIN
  IF NOT (
    public.is_editor_or_admin(auth.uid()) OR EXISTS (
      SELECT 1 FROM public.studio_user_roles
      WHERE user_id = auth.uid() AND role::text = 'publisher'
    )
  ) THEN
    RAISE EXCEPTION 'Only editors, publishers, or administrators may restore versions';
  END IF;

  SELECT * INTO _snapshot
  FROM public.content_versions
  WHERE id = _version_id AND content_item_id = _content_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Content version not found';
  END IF;

  PERFORM set_config('app.restore_content_version', 'on', true);

  UPDATE public.content_items
  SET title = _snapshot.title,
      slug = _snapshot.slug,
      locale = _snapshot.locale,
      excerpt = _snapshot.excerpt,
      body = _snapshot.body,
      author_id = _snapshot.author_id,
      category_id = _snapshot.category_id,
      cluster_id = _snapshot.cluster_id,
      cover_media_id = _snapshot.cover_media_id,
      seo = _snapshot.seo,
      status = 'draft',
      scheduled_at = NULL,
      published_at = NULL
  WHERE id = _content_id AND version = _expected_version
  RETURNING * INTO _item;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'SAVE_CONFLICT: content item changed or does not exist';
  END IF;

  RETURN _item;
END;
$$;

GRANT EXECUTE ON FUNCTION public.transition_content_status(uuid, integer, public.content_status, timestamptz) TO authenticated;
GRANT EXECUTE ON FUNCTION public.restore_content_version(uuid, uuid, integer) TO authenticated;
REVOKE ALL ON FUNCTION public.can_transition_content_status(public.content_status, public.content_status, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.can_transition_content_status(public.content_status, public.content_status, uuid) TO authenticated;