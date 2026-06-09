# 13 · Backoffice

> El backoffice se **reescribió en Next.js** y vive en un **repositorio separado**: **`sebasgrios-backoffice`** (dominio `backoffice.sebasgrios.es`). Ya no hay backoffice dentro del repo del portfolio; este documento queda como puntero.

## Qué era (histórico)

Hasta v3.0.0 el backoffice era un panel **SSR en Astro** bajo `/admin` (Google OAuth + RLS, CRUD de todas las entidades, media en Storage, botón Publicar). Se eliminó del portfolio al pasar este repo a **estático puro** (ver [01-architecture](./01-architecture.md) y [12-deployment](./12-deployment.md)).

## Dónde está ahora

- Repo: `sebasgrios-backoffice` (Next.js, deploy en Cloudflare). UI **shadcn/ui** minimalista; un apartado por entidad con **tabla** y acciones crear/editar/eliminar/**ocultar**.
- Habla con el **mismo Supabase** que el portfolio: misma schema, `user_roles`/`is_admin()`, RPC `set_entity_technologies`, `admin_audit_log`. Auth Google OAuth (JWT del usuario + RLS; **sin** service-role key).
- Es el **dueño del schema**: posee `supabase/` (migraciones + seed) y aplica las migraciones al Supabase vivo.
- **Publicar**: dispara el deploy hook de Cloudflare del portfolio (`CF_DEPLOY_HOOK_URL`, secreto del repo backoffice) para reconstruir el sitio estático.

## Acoplamiento con el portfolio

- El portfolio **lee** Supabase en build (anon key + RLS public read) y se reconstruye cuando el backoffice dispara el deploy hook.
- Campo **`is_visible`** (ocultar): lo introduce el backoffice (migración); el portfolio debe **filtrar** las filas ocultas en sus lecturas (`repos.ts`/`loaders.ts`).
