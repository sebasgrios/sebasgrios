# 12 · Deployment

## Plataforma

**Cloudflare Pages** con adapter `@astrojs/cloudflare`. El sitio actual `sebasgrios.es` ya está en Cloudflare.

## Comandos build

| Comando | Acción |
|---|---|
| `npm run dev` | Astro dev server con host `0.0.0.0`. |
| `npm run build` | `astro check && astro build`. Salida `dist/`. |
| `npm run preview` | `wrangler pages dev dist`. |
| `npm run check` | `astro check && biome check .`. |
| `npm run format` | `biome format --write .`. |
| `npm test` | `vitest run`. |
| `npm run e2e` | `playwright test`. |
| `npm run db:types` | `supabase gen types typescript --linked > src/lib/data/database.types.ts`. |
| `npm run db:reset` | `supabase db reset` (entorno local). |
| `npm run db:push` | `supabase db push` (entorno linked). |

## Variables de entorno

### Config pública: **en código, no en env** `[DECIDIDO]`

Los valores **públicos** (URL del sitio, URL + anon key de Supabase, token de Cloudflare Web Analytics) viven hardcodeados en `src/config/*` (`site.ts`, `supabase.ts`, `analytics.ts`), que son la **única fuente de verdad**.

**Por qué no se leen de `.env`/dashboard**: las páginas públicas son `prerender`, así que `loadHomeData()` → `getServerClient()` se ejecuta durante `astro build`. Cloudflare Pages **no expone** las variables del dashboard al proceso de build/prerender, así que `import.meta.env.PUBLIC_SUPABASE_*` resolvía a `undefined` y el deploy **fallaba** en el prerender (`Supabase env vars are missing… at getServerClient`). Son valores públicos por diseño (la anon key está protegida por RLS; el beacon token es un snippet público de cliente), por lo que vivir en el repo es seguro y evita el fallo.

> No re-introducir lectura de `import.meta.env.PUBLIC_*` para estos valores sin resolver antes la disponibilidad en build de Cloudflare Pages.

### Secretos: solo dashboard (futuro backoffice SSR)

Estos **sí** son secretos y solo se usarán cuando exista `/admin` (SSR, no prerender), nunca llegan al cliente:

| Variable | Dónde | Uso |
|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Cloudflare Pages (Secret) + `.env.local` | Reservado. El backoffice **no** lo usa (mutaciones vía JWT del admin + RLS). |
| `SESSION_SECRET` | Cloudflare Pages (Secret) + `.env.local` | Reservado para cookies admin propias (32+ bytes aleatorios). |
| `CF_DEPLOY_HOOK_URL` | Cloudflare Pages (Secret) | URL del deploy hook del proyecto; la dispara `POST /api/publish` desde `/admin/publish`. Leída vía `Astro.locals.runtime.env`. |

Declarados (opcionales) en `src/env.d.ts`. En el dashboard pueden coexistir las `PUBLIC_*` antiguas sin efecto (el código no las lee); pueden borrarse.

### Google OAuth (backoffice)

El provider Google **no** se configura por variables de Cloudflare ni en el repo: vive en el **dashboard de Supabase** (Authentication → Providers → Google) del proyecto linked, y las *Redirect URLs* incluyen `https://sebasgrios.es/api/auth/callback`. Para `supabase start` local, `supabase/config.toml` lee `SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID` y `SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET` del entorno. Pasos completos en [13-backoffice](./13-backoffice.md).

## Cloudflare Pages config

| Setting | Valor |
|---|---|
| Build command | `pnpm build` |
| Build output | `dist` |
| Root directory | `/` |
| Node version | `22` |
| Compatibility date | reciente (revisar al ramp-up) |
| Compatibility flags | `nodejs_compat` |

## Custom domains

- `sebasgrios.es` → Production.
- (Futuro) `dev.sebasgrios.es` → Preview branch `develop`.

## Webhooks

Cuando exista backoffice, después de cualquier `update/insert/delete` en tablas de contenido, una **Supabase Database Function** disparará el deploy hook de Cloudflare:

```
POST https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/<HOOK_ID>
```

ID del hook guardado como secret en Supabase (no en repo).

## Despliegues

| Branch | Entorno |
|---|---|
| `main` | Production (`sebasgrios.es`). |
| `develop` | Preview branch `develop.sebasgrios.es` (si se configura). |
| `v3` | Preview ad-hoc por cada push. |

Cloudflare crea preview automáticamente por cada PR.

## Headers / Redirects

- `public/_headers` (formato Cloudflare Pages) con CSP/HSTS (ver [08-routing-pages](./08-routing-pages.md)).
- `public/_redirects` solo si hace falta (de momento no).

## Rollback

- Cloudflare Pages mantiene historial. Promote previous deploy desde dashboard si algo se rompe en prod.
- No usar `git push --force` en `main`. Para revertir: `git revert` + push normal.

## Monitor

- Cloudflare Web Analytics dashboard.
- Supabase dashboard para queries lentas y row counts.
- Sentry: NO por ahora (presupuesto cero).

## Sanity checks pre-deploy

Checklist antes de mergear a `main`:

- [ ] `npm run check` pasa.
- [ ] `npm test` pasa.
- [ ] `npm run build` pasa local.
- [ ] Preview deployment de Cloudflare visible y verificado.
- [ ] Lighthouse mobile ≥ 95.
- [ ] Migraciones Supabase aplicadas en el proyecto linked.
- [ ] Variables de entorno verificadas en Cloudflare Pages.
