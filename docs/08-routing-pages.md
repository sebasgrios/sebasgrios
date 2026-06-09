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
- (Cloudflare Web Analytics lo auto-inyecta Cloudflare Pages en el edge; ya no va en el `<head>` del repo)

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
Content-Security-Policy: frame-ancestors 'self'; upgrade-insecure-requests
```

`_headers` además fija cache largo para `/fonts/*` (immutable, 1 año) y `/og/*`.

**CSP**: el grueso de la política lo genera **Astro 6** (`security.csp` en `astro.config.mjs`) como `<meta http-equiv>` por página, con **hashes SHA-256** de los scripts/estilos inline (anti-flash, JSON-LD, estilos scoped) → **sin `'unsafe-inline'`**. Directivas: `default-src 'self'`, `script-src 'self' <hashes> https://static.cloudflareinsights.com`, `style-src 'self' <hashes>`, `img-src`/`font-src`/`connect-src`, `object-src 'none'`, `frame-src 'none'`. En `_headers` quedan solo `frame-ancestors` y `upgrade-insecure-requests` (que el `<meta>` no puede aplicar).

> Los colores de marca de los iconos (`TechIcon`/`Tag`) viven en `globals.css` vía `[data-ti="…"]`, no en `style=` inline, para ser compatibles con la CSP hasheada.
