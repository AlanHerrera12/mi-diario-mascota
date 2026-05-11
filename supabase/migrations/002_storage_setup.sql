-- ============================================================
-- Migración 002: Storage bucket para audios del diario
-- ============================================================

-- Crear bucket privado para audios encriptados
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'diary-audios',
  'diary-audios',
  false,                    -- privado: nunca acceso público directo
  52428800,                 -- 50MB máximo por archivo
  ARRAY['audio/m4a', 'audio/mp4', 'audio/mpeg', 'audio/webm', 'audio/x-m4a']
)
ON CONFLICT (id) DO NOTHING;

-- RLS para Storage: un padre solo puede subir/leer audios de sus propios niños
-- El path es: {child_id}/{entry_id}.m4a

-- Política de subida: solo el cliente autenticado dueño del niño
CREATE POLICY "Padres suben audios de sus niños"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'diary-audios'
    AND (storage.foldername(name))[1] IN (
      SELECT id::text FROM children WHERE parent_id = auth.uid()
    )
  );

-- Política de lectura: solo el padre dueño
CREATE POLICY "Padres leen audios de sus niños"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'diary-audios'
    AND (storage.foldername(name))[1] IN (
      SELECT id::text FROM children WHERE parent_id = auth.uid()
    )
  );

-- Política de borrado: padre dueño + service_role (para limpieza automática a los 7 días)
CREATE POLICY "Padres borran audios de sus niños"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'diary-audios'
    AND (storage.foldername(name))[1] IN (
      SELECT id::text FROM children WHERE parent_id = auth.uid()
    )
  );
