INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Studio members upload media files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'media' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Public can read Studio media files"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'media');

CREATE POLICY "Studio members delete their media files"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'media' AND owner_id = auth.uid()::text);