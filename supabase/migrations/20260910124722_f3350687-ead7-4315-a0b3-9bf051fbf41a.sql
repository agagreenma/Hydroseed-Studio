-- ============ ROLES ============
CREATE TYPE public.app_role AS ENUM ('writer', 'editor', 'administrator');

CREATE TABLE public.studio_user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.studio_user_roles TO authenticated;
GRANT ALL ON public.studio_user_roles TO service_role;
ALTER TABLE public.studio_user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.studio_user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(_user_id, 'administrator')
$$;

CREATE OR REPLACE FUNCTION public.is_editor_or_admin(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(_user_id, 'editor') OR public.has_role(_user_id, 'administrator')
$$;

CREATE POLICY "Members read own roles" ON public.studio_user_roles
  FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "Admins manage roles" ON public.studio_user_roles
  FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- first member becomes administrator, everyone else a writer
CREATE OR REPLACE FUNCTION public.assign_default_role()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.studio_user_roles WHERE user_id = NEW.id) THEN
    INSERT INTO public.studio_user_roles (user_id, role)
    VALUES (NEW.id, CASE WHEN EXISTS (SELECT 1 FROM public.studio_user_roles) THEN 'writer'::public.app_role ELSE 'administrator'::public.app_role END)
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER studio_members_default_role
AFTER INSERT ON public.studio_members
FOR EACH ROW EXECUTE FUNCTION public.assign_default_role();

-- ============ AUDIT FOUNDATION ============
CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  summary text,
  changes jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members read audit history" ON public.audit_logs
  FOR SELECT TO authenticated USING (true);
CREATE INDEX audit_logs_entity_idx ON public.audit_logs (entity_type, entity_id, created_at DESC);
CREATE INDEX audit_logs_created_idx ON public.audit_logs (created_at DESC);

CREATE OR REPLACE FUNCTION public.record_audit()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _entity uuid;
  _summary text;
  _changes jsonb;
BEGIN
  IF TG_OP = 'DELETE' THEN
    _entity := (to_jsonb(OLD) ->> 'id')::uuid;
    _changes := jsonb_build_object('old', to_jsonb(OLD));
    _summary := COALESCE(to_jsonb(OLD) ->> 'title', to_jsonb(OLD) ->> 'name', to_jsonb(OLD) ->> 'filename', to_jsonb(OLD) ->> 'code');
  ELSE
    _entity := (to_jsonb(NEW) ->> 'id')::uuid;
    _changes := CASE WHEN TG_OP = 'UPDATE'
      THEN jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW))
      ELSE jsonb_build_object('new', to_jsonb(NEW)) END;
    _summary := COALESCE(to_jsonb(NEW) ->> 'title', to_jsonb(NEW) ->> 'name', to_jsonb(NEW) ->> 'filename', to_jsonb(NEW) ->> 'code');
  END IF;

  INSERT INTO public.audit_logs (actor_id, action, entity_type, entity_id, summary, changes)
  VALUES (auth.uid(), lower(TG_OP), TG_TABLE_NAME, _entity, _summary, _changes);

  RETURN COALESCE(NEW, OLD);
END; $$;

-- ============ LOCALES ============
CREATE TABLE public.locales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  native_name text NOT NULL,
  rtl boolean NOT NULL DEFAULT false,
  enabled boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.locales TO authenticated;
GRANT ALL ON public.locales TO service_role;
ALTER TABLE public.locales ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members read locales" ON public.locales FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage locales" ON public.locales FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
GRANT INSERT, UPDATE, DELETE ON public.locales TO authenticated;

INSERT INTO public.locales (code, name, native_name, rtl, sort_order) VALUES
  ('en', 'English', 'English', false, 1),
  ('fr', 'French', 'Français', false, 2),
  ('es', 'Spanish', 'Español', false, 3),
  ('ar', 'Arabic', 'العربية', true, 4);

-- ============ AUTHORS ============
CREATE TABLE public.authors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid REFERENCES public.studio_members(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  role_title text,
  bio text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.authors TO authenticated;
GRANT ALL ON public.authors TO service_role;
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members read authors" ON public.authors FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage authors" ON public.authors FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE INDEX authors_member_idx ON public.authors (member_id);

-- ============ TAXONOMY ============
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.content_clusters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  pillar_path text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories, public.tags, public.topics, public.content_clusters TO authenticated;
GRANT ALL ON public.categories, public.tags, public.topics, public.content_clusters TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_clusters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members read categories" ON public.categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Members read tags" ON public.tags FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage tags" ON public.tags FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Members read topics" ON public.topics FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage topics" ON public.topics FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Members read clusters" ON public.content_clusters FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage clusters" ON public.content_clusters FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- ============ MEDIA ============
CREATE TABLE public.media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  url text NOT NULL,
  alt_text text,
  mime_type text,
  size_bytes bigint,
  width integer,
  height integer,
  created_by uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media_assets TO authenticated;
GRANT ALL ON public.media_assets TO service_role;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members read media" ON public.media_assets FOR SELECT TO authenticated USING (true);
CREATE POLICY "Members create media" ON public.media_assets FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid());
CREATE POLICY "Owners or editors update media" ON public.media_assets FOR UPDATE TO authenticated
  USING (created_by = auth.uid() OR public.is_editor_or_admin(auth.uid()))
  WITH CHECK (created_by = auth.uid() OR public.is_editor_or_admin(auth.uid()));
CREATE POLICY "Owners or editors delete media" ON public.media_assets FOR DELETE TO authenticated
  USING (created_by = auth.uid() OR public.is_editor_or_admin(auth.uid()));
CREATE INDEX media_assets_created_idx ON public.media_assets (created_at DESC);

-- ============ CONTENT ITEMS ============
CREATE TYPE public.content_type AS ENUM ('article','blog_post','landing_page','case_study','resource','documentation','academy_lesson');
CREATE TYPE public.content_status AS ENUM ('draft','in_review','approved','scheduled','published','archived');

CREATE TABLE public.content_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type public.content_type NOT NULL DEFAULT 'article',
  status public.content_status NOT NULL DEFAULT 'draft',
  title text NOT NULL,
  slug text NOT NULL,
  locale text NOT NULL DEFAULT 'en' REFERENCES public.locales(code),
  excerpt text,
  body text,
  author_id uuid REFERENCES public.authors(id) ON DELETE SET NULL,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  cluster_id uuid REFERENCES public.content_clusters(id) ON DELETE SET NULL,
  cover_media_id uuid REFERENCES public.media_assets(id) ON DELETE SET NULL,
  seo jsonb NOT NULL DEFAULT '{}'::jsonb,
  version integer NOT NULL DEFAULT 1,
  created_by uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (slug, locale)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_items TO authenticated;
GRANT ALL ON public.content_items TO service_role;
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members read content" ON public.content_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Members create own content" ON public.content_items FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid());
CREATE POLICY "Owners or editors update content" ON public.content_items FOR UPDATE TO authenticated
  USING (created_by = auth.uid() OR public.is_editor_or_admin(auth.uid()))
  WITH CHECK (created_by = auth.uid() OR public.is_editor_or_admin(auth.uid()));
CREATE POLICY "Owners or editors delete content" ON public.content_items FOR DELETE TO authenticated
  USING ((created_by = auth.uid() AND status = 'draft') OR public.is_editor_or_admin(auth.uid()));

CREATE INDEX content_items_status_idx ON public.content_items (status);
CREATE INDEX content_items_type_idx ON public.content_items (type);
CREATE INDEX content_items_locale_idx ON public.content_items (locale);
CREATE INDEX content_items_author_idx ON public.content_items (author_id);
CREATE INDEX content_items_updated_idx ON public.content_items (updated_at DESC);

CREATE OR REPLACE FUNCTION public.can_edit_content(_content_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.content_items c
    WHERE c.id = _content_id
      AND (c.created_by = auth.uid() OR public.is_editor_or_admin(auth.uid()))
  )
$$;

CREATE TABLE public.content_item_tags (
  content_item_id uuid NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (content_item_id, tag_id)
);
CREATE TABLE public.content_item_topics (
  content_item_id uuid NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  topic_id uuid NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (content_item_id, topic_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_item_tags, public.content_item_topics TO authenticated;
GRANT ALL ON public.content_item_tags, public.content_item_topics TO service_role;
ALTER TABLE public.content_item_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_item_topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members read content tags" ON public.content_item_tags FOR SELECT TO authenticated USING (true);
CREATE POLICY "Editors of item manage content tags" ON public.content_item_tags FOR ALL TO authenticated
  USING (public.can_edit_content(content_item_id)) WITH CHECK (public.can_edit_content(content_item_id));
CREATE POLICY "Members read content topics" ON public.content_item_topics FOR SELECT TO authenticated USING (true);
CREATE POLICY "Editors of item manage content topics" ON public.content_item_topics FOR ALL TO authenticated
  USING (public.can_edit_content(content_item_id)) WITH CHECK (public.can_edit_content(content_item_id));
CREATE INDEX content_item_tags_tag_idx ON public.content_item_tags (tag_id);
CREATE INDEX content_item_topics_topic_idx ON public.content_item_topics (topic_id);

-- ============ updated_at + version + audit triggers ============
CREATE OR REPLACE FUNCTION public.bump_content_version()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.updated_at = now();
  IF NEW.version = OLD.version THEN
    NEW.version = OLD.version + 1;
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER content_items_versioning BEFORE UPDATE ON public.content_items
  FOR EACH ROW EXECUTE FUNCTION public.bump_content_version();

CREATE TRIGGER locales_set_updated_at BEFORE UPDATE ON public.locales FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER authors_set_updated_at BEFORE UPDATE ON public.authors FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER categories_set_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER tags_set_updated_at BEFORE UPDATE ON public.tags FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER topics_set_updated_at BEFORE UPDATE ON public.topics FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER clusters_set_updated_at BEFORE UPDATE ON public.content_clusters FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER media_set_updated_at BEFORE UPDATE ON public.media_assets FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER content_items_audit AFTER INSERT OR UPDATE OR DELETE ON public.content_items FOR EACH ROW EXECUTE FUNCTION public.record_audit();
CREATE TRIGGER categories_audit AFTER INSERT OR UPDATE OR DELETE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.record_audit();
CREATE TRIGGER tags_audit AFTER INSERT OR UPDATE OR DELETE ON public.tags FOR EACH ROW EXECUTE FUNCTION public.record_audit();
CREATE TRIGGER topics_audit AFTER INSERT OR UPDATE OR DELETE ON public.topics FOR EACH ROW EXECUTE FUNCTION public.record_audit();
CREATE TRIGGER clusters_audit AFTER INSERT OR UPDATE OR DELETE ON public.content_clusters FOR EACH ROW EXECUTE FUNCTION public.record_audit();
CREATE TRIGGER authors_audit AFTER INSERT OR UPDATE OR DELETE ON public.authors FOR EACH ROW EXECUTE FUNCTION public.record_audit();
CREATE TRIGGER media_audit AFTER INSERT OR UPDATE OR DELETE ON public.media_assets FOR EACH ROW EXECUTE FUNCTION public.record_audit();
CREATE TRIGGER locales_audit AFTER INSERT OR UPDATE OR DELETE ON public.locales FOR EACH ROW EXECUTE FUNCTION public.record_audit();
CREATE TRIGGER content_item_tags_audit AFTER INSERT OR DELETE ON public.content_item_tags FOR EACH ROW EXECUTE FUNCTION public.record_audit();
CREATE TRIGGER content_item_topics_audit AFTER INSERT OR DELETE ON public.content_item_topics FOR EACH ROW EXECUTE FUNCTION public.record_audit();