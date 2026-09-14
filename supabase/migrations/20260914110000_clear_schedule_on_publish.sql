UPDATE public.content_items
SET scheduled_at = NULL
WHERE status = 'published'
  AND scheduled_at IS NOT NULL;

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
        WHEN _target_status = 'published' THEN NULL
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