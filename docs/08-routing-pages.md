# 08 · Routing & pages

## Árbol de páginas

```
src/pages/
├── index.astro                  # home es (prerender)
├── en/
│   └── index.astro              # home en (prerender)
├── 404.astro                    # not found, bilingual
├── 401.astro                    # acceso denegado backoffice (visual mismo glass)
├── admin/                       # (futuro, ver 13-backoffice)
│   ├── index.astro              # dashboard
│   ├── login.astro
│   ├── profile/
│   ├── companies/
│   ├── roles/
│   ├── education/
│   ├── projects/
│   ├── stack/
│   └── technologies/
├── og/
│   ├── [locale].png.ts          # OG image dinámica por locale
└── api/
    ├── auth/                    # (futuro)
    └── webhooks/
        └── revalidate.ts        # endpoint disparable desde Supabase function
```

## Prerender vs SSR

```astro
---
// /src/pages/index.astro
export const prerender = true;
---
```

Por defecto en este proyecto `output: 'server'`, así que cada página debe declarar `prerender = true` explícitamente. Solo `/admin/**` y `/api/**` quedan SSR.

## Anchors estables

Independientemente del locale: `#experience`, `#education`, `#stack`, `#projects`, `#contact`.

## `<head>` por página

Layout `BaseLayout.astro` recibe props `{ title, description, locale, canonical, ogImage }` y compone:

- `<html lang>`
- `<title>`
- `<meta name="description">`
- `<link rel="canonical">`
- `<link rel="alternate" hreflang>` (es, en, x-default)
- `<meta property="og:*">` (title, description, type=website, image, locale)
- `<meta name="twitter:card" content="summary_large_image">`
- `<script type="application/ld+json">` con schema.org `Person`
- Preload de fuentes críticas
- Cloudflare Web Analytics snippet (solo prod)
- Anti-flash theme script (inline, antes de styles)

## Sitemap

`@astrojs/sitemap` con `i18n` config. Output `/sitemap-index.xml` + `/sitemap-0.xml`.

## robots.txt

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Sitemap: https://sebasgrios.es/sitemap-index.xml
```

## OG image

Endpoint `/og/[locale].png.ts` genera con Satori y devuelve `image/png`:

- Background: gradiente con accent hue.
- Texto: `profile.fullName` + `pickLocale(profile.role, locale)`.
- Logo / avatar si cabe.
- Tamaño: 1200×630.
- Cacheable durante 1 día en CDN.

## Códigos HTTP

| Path | Código | Notas |
|---|---|---|
| `/` `/en/` | 200 | |
| ruta inexistente | 404 | `404.astro` bilingüe (detecta locale por prefijo). |
| `/admin/**` sin sesión | 302 → `/admin/login` | Server middleware. |
| `/admin/**` con sesión sin rol | 401 | `401.astro` con CTA `Volver al portfolio`. |

## Middleware

`/src/middleware.ts`:
- Para `/admin/**`, valida cookie Supabase. Si no, redirige a login.
- Para todas las páginas, fija `Astro.locals.locale` para que `getLocale` no tenga que parsear URL en cada helper.

## Headers de seguridad

En `_headers` (Cloudflare Pages) o en middleware:

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: default-src 'self'; img-src 'self' data: https://*.supabase.co; font-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' static.cloudflareinsights.com; connect-src 'self' https://*.supabase.co;
```

(El `unsafe-inline` de script es necesario por el anti-flash; valorar nonce en M7.)
