-- Create public storage bucket for property images
INSERT INTO storage.buckets (id, name, public)
VALUES ('as_per_unit', 'as_per_unit', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access on all files in the bucket
CREATE POLICY "Public read access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'as_per_unit');

-- Allow authenticated and service role to upload
CREATE POLICY "Service role upload access"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'as_per_unit');

-- Allow authenticated and service role to update
CREATE POLICY "Service role update access"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'as_per_unit');

-- Allow authenticated and service role to delete
CREATE POLICY "Service role delete access"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'as_per_unit');
