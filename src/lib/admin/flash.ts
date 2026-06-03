import type { AstroCookies } from 'astro';

const FLASH_COOKIE = 'admin_flash';

export type FlashStatus = 'ok' | 'invalid' | 'error';

export function setFlash(cookies: AstroCookies, value: FlashStatus): void {
  cookies.set(FLASH_COOKIE, value, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: import.meta.env.PROD,
    maxAge: 30,
  });
}

export function takeFlash(cookies: AstroCookies): FlashStatus | null {
  const value = cookies.get(FLASH_COOKIE)?.value ?? null;
  if (!value) return null;
  cookies.delete(FLASH_COOKIE, { path: '/' });
  return value === 'ok' || value === 'invalid' || value === 'error' ? value : null;
}
