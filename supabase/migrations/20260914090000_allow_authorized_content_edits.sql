CREATE OR REPLACE FUNCTION public.protect_content_workflow_updates()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF current_setting('app.restore_content_version', true) = 'on' THEN
    RETURN NEW;
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