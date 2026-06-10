# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/). El proyecto sigue SemVer.

## [4.1.0] — 2026-06-09

### Changed

- **Héroe · stats**: rediseño de los bloques de cifras. "Años de experiencia" pasa a la **parte superior** y "sectores"/"proyectos" a **dos columnas debajo**; bloques **rectangulares de ancho contenido** (no a todo lo ancho), con la cifra grande y la etiqueta debajo. La etiqueta de sectores deja de duplicar el número.

### Fixed

- **Contacto · footer**: faltaba separación entre la sección de Contacto y el divisor del footer (el footer quedó fuera de `<main>` tras el fix de landmarks de a11y, perdiendo el `gap` de sección). Se añade `margin-top` al footer con el ritmo de sección.

## [4.0.3] — 2026-06-09

### Changed

- **Perf**: CSS crítico **inlineado** en el `<head>` (`build.inlineStylesheets: 'always'`) → elimina la última petición render-blocking y adelanta el descubrimiento de las fuentes. La CSP estricta lo hashea automáticamente (verificado en preview: sin violaciones, sin `'unsafe-inline'`).

## [4.0.2] — 2026-06-09

### Changed

- **Perf (móvil)**: eliminado el `preconnect`/`dns-prefetch` a Supabase (Lighthouse lo marcaba como conexión sin usar: las imágenes se optimizan a `/_astro` en build, no hay peticiones a Supabase en runtime) y añadido `Cache-Control: immutable` para `/_astro/*` en `_headers`.

## [4.0.1] — 2026-06-09

### Fixed

- CSP `font-src`: permite `data:` (Vite inlinea un subset de JetBrains Mono como `data:font/woff2` y la CSP lo bloqueaba en producción).
- **LCP móvil**: la entrada del héroe (above-the-fold) pasa de la animación `reveal` (dependiente de JS / IntersectionObserver) a una **animación CSS al cargar** (`enter`), para que el elemento LCP no espere al JS. En móvil con throttling el LCP llegaba a ~5,9 s; el `reveal` on-scroll se mantiene para las secciones inferiores.

### Changed

- **Analytics**: eliminado el snippet manual de Cloudflare Web Analytics (`src/config/analytics.ts` + beacon en `BaseLayout`). Se pasa a **Cloudflare Pages Web Analytics** (auto-inyectado en el edge, RUM *same-origin*) → desaparece el error CORS en `/cdn-cgi/rum`.

## [4.0.0] — 2026-06-09

### Removed

- **Backoffice** (`/admin` + `/api`): el panel SSR se eliminó del repo del portfolio; se reescribe en Next.js en un repo separado (`sebasgrios-backoffice`, `backoffice.sebasgrios.es`).
- Dependencias que solo usaba el backoffice/SSR: `@astrojs/cloudflare`, `@supabase/ssr`, `@tailwindcss/forms`, `zod`, `wrangler`.
- Páginas `/401` y `/dev/design`, y el middleware (su única función, fijar el locale, no se consumía).

### Changed

- El portfolio pasa a **estático puro** (`output: 'static'`): sin adapter ni worker; Cloudflare Pages sirve `dist/`. `404` pasa a estático.
- OG: el `.wasm` de resvg se lee del disco con `node:fs` en build (antes lo resolvía el adapter Cloudflare).
- Documentación (`/docs`, `AGENTS.md`) y `robots.txt` alineados con el portfolio estático y el backoffice externo.
- Dependencias subidas a últimas estables: **Astro 6**, **TypeScript 6**, **Biome 2** (config migrada), **Vitest 4**, supabase-js, simple-icons.
- Imágenes: avatar del nav y logos de empresa servidos como **webp** optimizado vía `astro:assets` (el avatar pasó de ~201 KB a ~1 KB).

### Added

- **Accesibilidad**: landmarks correctos (`nav`/`main`/`footer` hermanos), skip-link visible al foco, contraste WCAG AA; test **axe-core** (`e2e/a11y.spec.ts`, claro y oscuro) en CI.
- **SEO**: JSON-LD `Person` enriquecido con `worksFor`, `alumniOf` y `knowsAbout`.
- **CI**: jobs `e2e` (Playwright + axe) y `lighthouse` (Lighthouse CI con budgets).

### Security

- **CSP sin `'unsafe-inline'`**: la política la genera Astro 6 (`security.csp`) por `<meta>` con hashes SHA-256 de scripts/estilos; los colores de iconos pasaron de `style=` inline a `globals.css` (`[data-ti]`). `_headers` añade COOP/CORP, `object-src 'none'`, `frame-src 'none'`, `frame-ancestors`, `upgrade-insecure-requests` y `connect-src` más estricto.

## [3.0.0] — 2026-06-08 — Reescritura v3

Reescritura completa del portfolio: diseño **Liquid Glass**, **Astro 5** + Cloudflare (SSR híbrido), contenido en **Supabase**, **i18n es/en** y **backoffice** privado end-to-end.

### Público

- Diseño "Liquid Glass" (glass primitive, dark/light, accent fijo `oklch` hue 264), respetando `prefers-reduced-motion`/`prefers-color-scheme`.
- Astro 5 + `@astrojs/cloudflare` (SSR híbrido: público prerender, `/admin` SSR), Tailwind v4 (`@theme`/`@utility`), TypeScript strict, Biome.
- Contenido en **Supabase** (Postgres + Storage) con RLS; tipos generados; columnas traducibles `jsonb {es,en}`.
- **i18n**: `/` (es) + `/en/`, anchors estables, fallback es→en.
- **SEO**: canonical + hreflang (es/en/x-default), OG dinámica (Satori + resvg-wasm, fuente self-host), `@graph` schema.org (WebSite + Person), `noindex` en 404/401/dev, `theme-color`, sitemap i18n, `robots.txt`.
- **Rendimiento**: fuentes self-host (Satoshi/General Sans/JetBrains Mono) con preload; imágenes hero/proyectos optimizadas a **webp** (`astro:assets` + sharp); scrollspy de nav; cache `_headers` (immutable fonts, SWR para HTML).
- Cloudflare Web Analytics (sin cookies); CSP/HSTS y cabeceras de seguridad.

### Backoffice (`/admin`)

- **Auth**: Google OAuth vía Supabase (`@supabase/ssr`, PKCE), middleware que protege `/admin/**` y `/api/**`; autorización por `is_admin()` (RLS).
- **CRUD** de todas las entidades: perfil, tecnologías, stack groups, formación, empresas/roles (anidado), proyectos — con validación **Zod**, acordeones, pivots M:N de tecnologías y **toast** liquid-glass (verde/rojo, flash cookie).
- **Media**: gestor de Supabase Storage (listar/subir/borrar por bucket; solo imágenes, ≤ 5 MB).
- **Publicar**: `POST /api/publish` dispara el deploy hook de Cloudflare.

### Calidad e infraestructura

- Tests Vitest (helpers, mappers, i18n, schemas, factory CRUD) + e2e Playwright (público, theme, guards admin).
- CI (GitHub Actions: check + test + build).
- Factory genérico de endpoints CRUD; observabilidad de errores en endpoints; `DeleteForm` reutilizable.
- Sync de pivots M:N **atómico** vía RPC (`set_entity_technologies`); **audit log** (`admin_audit_log`) de las acciones del backoffice.
- Documentación completa en `/docs` (17 documentos) + `AGENTS.md`.

### Release y configuración manual

v3.0.0 **desplegada a producción** (`sebasgrios.es`) vía release `develop → main` (PR #10); tag `v3.0.0`; rama `v3` eliminada. Google OAuth y el primer admin (`user_roles`) están configurados. Endurecimiento opcional restante del ingeniero: secreto `CF_DEPLOY_HOOK_URL` (botón Publicar), branch protection con el check `verify`, rate limiting y backups. Detalle en [`docs/17-improvements.md`](docs/17-improvements.md) → *Pasos manuales*.
