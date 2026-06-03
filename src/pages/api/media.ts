import { setFlash } from '@/lib/admin/flash';
import { readString } from '@/lib/admin/forms';
import { createSupabaseServerClient } from '@/lib/auth/supabaseServer';
import {
  isMediaBucket,
  removeFromBucket,
  sanitizeFileName,
  uploadToBucket,
} from '@/lib/data/storage';
import type { APIRoute } from 'astro';

export const prerender = false;

const REDIRECT = '/admin/media';

export const POST: APIRoute = async (context) => {
  if (!context.locals.isAdmin) return new Response('Forbidden', { status: 403 });

  const form = await context.request.formData();
  const action = readString(form, '_action');
  const bucket = readString(form, 'bucket');
  if (!isMediaBucket(bucket)) {
    setFlash(context.cookies, 'invalid');
    return context.redirect(REDIRECT);
  }
  const client = createSupabaseServerClient(context);

  try {
    if (action === 'delete') {
      const path = readString(form, 'path');
      if (!path) {
        setFlash(context.cookies, 'invalid');
        return context.redirect(REDIRECT);
      }
      await removeFromBucket(client, bucket, path);
    } else {
      const file = form.get('file');
      const maxBytes = 5 * 1024 * 1024;
      if (
        !(file instanceof File) ||
        file.size === 0 ||
        file.size > maxBytes ||
        !file.type.startsWith('image/')
      ) {
        setFlash(context.cookies, 'invalid');
        return context.redirect(REDIRECT);
      }
      const custom = readString(form, 'filename');
      await uploadToBucket(client, bucket, sanitizeFileName(custom || file.name), file);
    }
  } catch (error) {
    console.error('[admin] media operation failed:', error);
    setFlash(context.cookies, 'error');
    return context.redirect(REDIRECT);
  }

  setFlash(context.cookies, 'ok');
  return context.redirect(REDIRECT);
};
