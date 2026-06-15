import type { APIRoute } from 'astro';
import { renderIcon } from '@/lib/icon';

export const GET: APIRoute = async () => {
  const png = await renderIcon(32, { transparent: true });
  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
