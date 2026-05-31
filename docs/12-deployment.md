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

### Local (`.env.local`, gitignored)

```
PUBLIC_SITE_URL=http://localhost:4321
PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # solo si se hace seed/admin desde local
```

### Cloudflare Pages (Settings → Environment variables)

**Production**:
- `PUBLIC_SITE_URL=https://sebasgrios.es`
- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (Secret)
- `SESSION_SECRET` (Secret, 32+ random bytes, para futuras cookies de admin)

**Preview**:
- Mismas vars apuntando a un branch DB de Supabase o al mismo (decisión M2).

## Cloudflare Pages config

| Setting | Valor |
|---|---|
| Build command | `npm run build` |
| Build output | `dist` |
| Root directory | `/` |
| Node version | `20` |
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
