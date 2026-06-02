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

Layout `BaseLayout.astro` recibe props `{ title, description, locale, canonical?, ogImage?, ogImageAlt?, personName?, personRole?, noindex? }` y compone:

- `<html lang>`
- `<title>` + `<meta name="description">` + `<meta name="author">`
- `<meta name="robots" content="noindex, nofollow">` **solo si `noindex`** (404, 401, `/dev/*`)
- `<meta name="theme-color">` claro/oscuro vía `media`
- `<link rel="preload">` de Satoshi-Black y GeneralSans-Regular
- `<link rel="canonical">`
- `<link rel="alternate" hreflang>` (es, en, x-default) — **omitido si `noindex`**
- `<meta property="og:*">` (site_name, title, description, type=website, url, locale, locale:alternate, image, image:type/width/height/alt)
- `<meta name="twitter:*">` (card=summary_large_image, title, description, image, image:alt)
- `<script type="application/ld+json">` con un `@graph` de schema.org `WebSite` + `Person` (el `Person` solo cuando la página pasa `personName`; todo el bloque se omite si `noindex`)
- `<link rel="preconnect">` + `<link rel="dns-prefetch">` al host de Supabase
- Anti-flash theme script (inline, antes de styles)
- Cloudflare Web Analytics snippet (solo prod)

## Sitemap

`@astrojs/sitemap` con `i18n` config. Output `/sitemap-index.xml` + `/sitemap-0.xml`.

## robots.txt

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /dev/
Sitemap: https://sebasgrios.es/sitemap-index.xml
```

El sitemap (`@astrojs/sitemap`) además filtra `/401`, `/404` y `/dev/` vía `filter` en `astro.config.mjs`, y esas páginas llevan `noindex` en el `<head>`. Defensa en tres capas: `robots.txt` + `filter` del sitemap + `meta robots`.

## OG image

Endpoint `/og/[locale].png.ts` genera con Satori y devuelve `image/png`:

- Background: gradiente azul oscuro.
- Texto: `profile.fullName` + `pickLocale(profile.role, locale)` + `sebasgrios.es`. Fuente Inter self-hosteada (`src/assets/og/inter-latin-500.ttf`), leída en build.
- Tamaño: 1200×630, render Satori → PNG (resvg-wasm).
- `prerender = true`: se generan en build como ficheros estáticos; `_headers` cachea `/og/*` (`max-age=86400, s-maxage=604800`).

## Códigos HTTP

| Path | Código | Notas |
|---|---|---|
| `/` `/en/` | 200 | indexables. |
| ruta inexistente | 404 | `404.astro` bilingüe (detecta locale por prefijo). `noindex`. |
| `/dev/design` | 404 en prod / 200 en dev | showcase interno. `noindex`. |
| `/admin/**` sin sesión | 302 → `/admin/login` | Server middleware. |
| `/admin/**` con sesión sin rol | 401 | `401.astro` con CTA `Volver al portfolio`. |

## Middleware

`/src/middleware.ts`:
- Para `/admin/**`, valida cookie Supabase. Si no, redirige a login.
- Para todas las páginas, fija `Astro.locals.locale` para que `getLocale` no tenga que parsear URL en cada helper.

## Headers de seguridad

Fuente de verdad: `public/_headers` (Cloudflare Pages). Estado actual:

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
X-Frame-Options: SAMEORIGIN
Content-Security-Policy: default-src 'self'; img-src 'self' data: https://*.supabase.co; font-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com; connect-src 'self' https://*.supabase.co https://cloudflareinsights.com; frame-ancestors 'self'; base-uri 'self'; form-action 'self'
```

`_headers` además fija cache largo para `/fonts/*` (immutable, 1 año) y `/og/*`. El `unsafe-inline` de `script-src` es necesario por el anti-flash y el snippet de analytics; valorar nonce a futuro.
