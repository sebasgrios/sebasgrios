import type { SupabaseServerClient } from '@/lib/auth/supabaseServer';

export const MEDIA_BUCKETS = ['avatars', 'hero', 'companies', 'projects'] as const;
export type MediaBucket = (typeof MEDIA_BUCKETS)[number];

export function isMediaBucket(value: string): value is MediaBucket {
  return (MEDIA_BUCKETS as readonly string[]).includes(value);
}

export interface MediaFile {
  name: string;
  url: string;
}

export function sanitizeFileName(name: string): string {
  const cleaned = name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9._-]/g, '');
  return cleaned || `file-${Date.now()}`;
}

export async function listBucket(
  client: SupabaseServerClient,
  bucket: MediaBucket
): Promise<MediaFile[]> {
  const { data, error } = await client.storage
    .from(bucket)
    .list('', { limit: 100, sortBy: { column: 'name', order: 'asc' } });
  if (error || !data) return [];
  return data
    .filter((entry) => entry.id !== null)
    .map((entry) => ({
      name: entry.name,
      url: client.storage.from(bucket).getPublicUrl(entry.name).data.publicUrl,
    }));
}

export async function uploadToBucket(
  client: SupabaseServerClient,
  bucket: MediaBucket,
  path: string,
  file: File
): Promise<void> {
  const { error } = await client.storage
    .from(bucket)
    .upload(path, file, { upsert: true, contentType: file.type || undefined });
  if (error) throw new Error(`upload failed: ${error.message}`);
}

export async function removeFromBucket(
  client: SupabaseServerClient,
  bucket: MediaBucket,
  path: string
): Promise<void> {
  const { error } = await client.storage.from(bucket).remove([path]);
  if (error) throw new Error(`remove failed: ${error.message}`);
}
