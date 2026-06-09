# 12 · Deployment

## Plataforma

**Cloudflare Pages** sirviendo un sitio **estático** (`output: 'static'`, sin adapter ni worker). `sebasgrios.es` ya vive en Cloudflare.

## Comandos build

| Comando | Acción |
|---|---|
| `npm run dev` | Astro dev server con host `0.0.0.0`. |
| `npm run build` | `astro check && astro build`. Salida estática en `dist/`. |
| `npm run preview` | `astro preview` (sirve `dist/`). |
| `npm run check` | `astro check && biome check .`. |
| `npm run format` | `biome format --write .`. |
| `npm test` | `vitest run`. |
| `npm run e2e` | `playwright test`. |
| `npm run db:types` | `supabase gen types typescript --linked > src/lib/data/database.types.ts`. |
| `npm run db:reset` | `supabase db reset` (entorno local). |
| `npm run db:push` | `supabase db push` (entorno linked). |

Los `db:*` se conservan mientras `supabase/` viva en este repo; el backoffice pasará a ser el dueño del schema (ver [13-backoffice](./13-backoffice.md)).

## Variables de entorno

### Config pública: en código, no en env `[DECIDIDO]`

Los valores **públicos** (URL del sitio, URL + anon key de Supabase) viven hardcodeados en `src/config/*` (`site.ts`, `supabase.ts`), como **única fuente de verdad**.

**Por qué no se leen de `.env`/dashboard**: el sitio se genera en build (`loadHomeData()` → `getServerClient()` corre durante `astro build`) y Cloudflare Pages **no expone** las variables del dashboard al proceso de build. La anon key es pública por diseño (protegida por RLS), por lo que vivir en el repo es seguro.

> **Analytics**: Cloudflare Web Analytics se activa en el proyecto de Pages (dashboard) y se **auto-inyecta** en el edge con RUM *same-origin*. No hay snippet ni token en el repo (antes en `analytics.ts`, ya eliminado) → sin error CORS en `/cdn-cgi/rum`.

> No re-introducir lectura de `import.meta.env.PUBLIC_*` para estos valores sin resolver antes su disponibilidad en build.

### Secretos

El portfolio estático **no necesita secretos** en build. Los secretos de edición (deploy hook, Google OAuth) viven en el repo del backoffice (`sebasgrios-backoffice`), no aquí.

## Cloudflare Pages config

| Setting | Valor |
|---|---|
| Build command | `pnpm build` |
| Build output | `dist` |
| Root directory | `/` |
| Node version | `22` |

Sin functions ni `compatibility_flags`: es un sitio estático.

## Custom domains

- `sebasgrios.es` → Production.
- (Futuro) `dev.sebasgrios.es` → Preview branch `develop`.

## Redeploy / publicar

El portfolio se reconstruye:

- por **push** a la rama conectada (git integration de Cloudflare Pages), o
- cuando el **backoffice** dispara el **deploy hook** de Cloudflare tras editar contenido:

```
POST https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/<HOOK_ID>
```

La URL del hook es un secreto **del repo backoffice** (`CF_DEPLOY_HOOK_URL`), no del portfolio.

## Headers / Redirects

- `public/_headers` (formato Cloudflare Pages) con CSP/HSTS + cache (`/fonts/*` immutable, `/og/*`, SWR para HTML). Ver [08-routing-pages](./08-routing-pages.md).
- `public/_redirects` solo si hace falta (de momento no).

## Rollback

- Cloudflare Pages mantiene historial. Promote previous deploy desde el dashboard si algo se rompe en prod.
- No usar `git push --force` en `main`. Para revertir: `git revert` + push normal.

## Monitor

- Cloudflare Web Analytics dashboard.
- Supabase dashboard para queries lentas y row counts.

## Sanity checks pre-deploy

Checklist antes de mergear a `main`:

- [ ] `npm run check` pasa.
- [ ] `npm test` pasa.
- [ ] `npm run build` pasa local (genera `dist/` estático + `/og/*.png`).
- [ ] Preview deployment de Cloudflare visible y verificado.
- [ ] Lighthouse mobile ≥ 95.
