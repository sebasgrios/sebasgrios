# 08 · Routing & pages

## Árbol de páginas

```
src/pages/
├── index.astro                  # home es (estático)
├── en/
│   └── index.astro              # home en (estático)
├── 404.astro                    # not found, bilingüe (estático)
└── og/
    └── [locale].png.ts          # OG image por locale (estático en build)
```

La edición de contenido (panel admin) vive en un repositorio separado; ver [13-backoffice](./13-backoffice.md).

## Output estático

```astro
---
// /src/pages/index.astro
export const prerender = true;
---
```

`output: 'static'`: todo el sitio se genera en build. No hay rutas SSR ni endpoints dinámicos.

## Anchors estables

Independientemente del locale: `#experience`, `#education`, `#stack`, `#projects`, `#contact`.

## `<head>` por página

Layout `BaseLayout.astro` recibe props `{ title, description, locale, canonical?, ogImage?, ogImageAlt?, personName?, personRole?, noindex? }` y compone:

- `<html lang>`
- `<title>` + `<meta name="description">` + `<meta name="author">`
- `<meta name="robots" content="noindex, nofollow">` **solo si `noindex`** (404)
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

`@astrojs/sitemap` con `i18n` config. Output `/sitemap-index.xml` + `/sitemap-0.xml`. Filtra `/404` vía `filter` en `astro.config.mjs`.

## robots.txt

```
User-agent: *
Allow: /
Sitemap: https://sebasgrios.es/sitemap-index.xml
```

`/404` lleva además `noindex` en el `<head>` y queda excluida del sitemap. Defensa en capas: `filter` del sitemap + `meta robots`.

## OG image

Endpoint `/og/[locale].png.ts` genera con Satori y devuelve `image/png`:

- Background: gradiente azul oscuro.
- Texto: `profile.fullName` + `pickLocale(profile.role, locale)` + `sebasgrios.es`. Fuente Inter self-hosteada (`src/assets/og/inter-latin-500.ttf`), leída en build.
- Tamaño: 1200×630, render Satori → PNG (resvg-wasm; el `.wasm` se lee del disco con `node:fs` en build).
- `prerender = true` + `getStaticPaths`: se generan `/og/es.png` y `/og/en.png` como ficheros estáticos; `_headers` cachea `/og/*`.

## Códigos HTTP

| Path | Código | Notas |
|---|---|---|
| `/` `/en/` | 200 | indexables. |
| ruta inexistente | 404 | `404.astro` bilingüe (detecta locale por prefijo). `noindex`. |

## Headers de seguridad

Fuente de verdad: `public/_headers` (Cloudflare Pages). Estado actual:

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
X-Frame-Options: SAMEORIGIN
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
Content-Security-Policy: default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; object-src 'none'; frame-src 'none'; img-src 'self' data: https://*.supabase.co; font-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com; connect-src 'self' https://cloudflareinsights.com; upgrade-insecure-requests
```

`_headers` además fija cache largo para `/fonts/*` (immutable, 1 año) y `/og/*`.

Queda `'unsafe-inline'` en `script-src` (anti-flash + JSON-LD inline) y `style-src`. Eliminarlo requiere mover los `style=` dinámicos de `TechIcon`/`Tag` (color de marca por tecnología) a CSS hasheable para activar la CSP con hashes de Astro 6 (`security.csp`) — **pendiente** (ver [17-improvements](./17-improvements.md), S1).
