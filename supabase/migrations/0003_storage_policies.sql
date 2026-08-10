-- Storage Policies for 'box-photos' bucket
-- Authenticated users can read/write objects under {user_id}/{box_id}/{filename}

CREATE POLICY "Users can read own box photos"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'box-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can upload own box photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'box-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can update own box photos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'box-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete own box photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'box-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
