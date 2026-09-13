ALTER TYPE public.content_status ADD VALUE IF NOT EXISTS 'seo_review';
ALTER TYPE public.content_status ADD VALUE IF NOT EXISTS 'updated';

CREATE OR REPLACE FUNCTION public.validate_content_status_transition()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.status = OLD.status THEN
    RAISE EXCEPTION 'Content status must change to a different state';
  END IF;

  IF NOT (
    (OLD.status = 'draft' AND NEW.status = 'in_review') OR
    (OLD.status = 'in_review' AND NEW.status::text = 'seo_review') OR
    (OLD.status::text = 'seo_review' AND NEW.status = 'approved') OR
    (OLD.status = 'approved' AND NEW.status = 'scheduled') OR
    (OLD.status = 'scheduled' AND NEW.status = 'published') OR
    (OLD.status = 'published' AND NEW.status::text = 'updated') OR
    (OLD.status::text = 'updated' AND NEW.status = 'archived')
  ) THEN
    RAISE EXCEPTION 'Invalid content status transition: % -> %', OLD.status, NEW.status;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER content_items_validate_status_transition
BEFORE UPDATE OF status ON public.content_items
FOR EACH ROW
EXECUTE FUNCTION public.validate_content_status_transition();