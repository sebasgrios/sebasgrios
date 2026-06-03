# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/). El proyecto sigue SemVer.

## [3.0.0] — Reescritura v3

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
- CI (GitHub Actions: check + test + build), Dependabot.
- Factory genérico de endpoints CRUD; observabilidad de errores en endpoints; `DeleteForm` reutilizable.
- Sync de pivots M:N **atómico** vía RPC (`set_entity_technologies`); **audit log** (`admin_audit_log`) de las acciones del backoffice.
- Documentación completa en `/docs` (17 documentos) + `AGENTS.md`.

### Pendiente de configuración manual

Setup externo del ingeniero para operar en vivo: Google OAuth + primer admin, secreto `CF_DEPLOY_HOOK_URL`, deploy `v3 → develop → main`, branch protection con el check `verify`. Detalle en [`docs/17-improvements.md`](docs/17-improvements.md) → *Pasos manuales*.
