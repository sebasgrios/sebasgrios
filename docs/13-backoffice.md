# 13 · Backoffice

Spec del backoffice privado. El schema y las RLS (M4) ya lo soportan, y la **Fase 1 (cimientos de auth) está implementada**.

## Estado de implementación

| Fase | Contenido | Estado |
|---|---|---|
| **F1 · Auth** | Cliente SSR (`@supabase/ssr`), middleware que protege `/admin/**`, login Google, callback/signout, dashboard shell. | ✅ implementado |
| **F2 · CRUD** | Forms + endpoints por entidad (profile, companies/roles, education, stack, technologies, projects). | ⏳ pendiente |
| **F3 · Media** | Uploader a Storage. | ⏳ pendiente |
| **F4 · Publish** | Botón → Cloudflare deploy hook. | ⏳ pendiente |

Archivos F1: `src/lib/auth/{supabaseServer,session}.ts`, `src/middleware.ts`, `src/pages/admin/{login,index}.astro`, `src/pages/api/auth/{signin,callback,signout}.ts`.

**Decisión de auth**: las mutaciones usarán el **JWT del usuario autenticado** (cookie SSR, anon key) y la RLS `is_admin()` las autoriza. **No se usa el service-role key** en el worker (más seguro). Por eso no hay secreto de Supabase en el hot path de admin.

### Setup externo requerido (manual del ingeniero) `[PENDIENTE]`

Antes de poder iniciar sesión:
1. **Google Cloud Console**: crear credenciales OAuth 2.0 (Web). Authorized redirect URI → `https://<ref>.supabase.co/auth/v1/callback`.
2. **Supabase dashboard** (proyecto linked): Authentication → Providers → Google → habilitar + pegar Client ID/Secret.
3. **Supabase dashboard** → Authentication → URL Configuration → añadir a *Redirect URLs*: `https://sebasgrios.es/api/auth/callback` y `http://localhost:4321/api/auth/callback`.
4. **Bootstrap del primer admin** (ver más abajo).
5. (Local) exportar `SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID` y `SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET` si se usa `supabase start`.

## Goal

Permitir al ingeniero editar el contenido del portfolio sin tocar código:
- Profile, companies, roles, education, stack groups, technologies, projects.
- Subir imágenes (avatar, hero, logos, capturas de proyectos).
- Publicar (= trigger redeploy) con un botón.

## Acceso

- Ruta: `/admin/**` (mismo deploy que el portfolio público).
- Auth: **Supabase Auth con Google OAuth** (provider habilitado en dashboard).
- Cookie de sesión gestionada por `@supabase/ssr`.

### Autorización

- Tabla `user_roles` con `role ∈ {'admin','editor'}`.
- Solo `admin` puede editar.
- Si un usuario logueado no tiene rol → `/401`.
- Si visita `/admin/**` sin sesión → redirect `/admin/login`.

### Página `/401`

- Mismo `BaseLayout` que el portfolio.
- Glass card centrada.
- Eyebrow: "401 / Acceso denegado".
- H2: "Esta zona es privada".
- Lead: explica que solo el ingeniero (y editores autorizados) pueden acceder.
- CTA: "Volver al portfolio" → `/`.
- Bilingüe (es/en).

## Rutas

```
/admin/login
/admin                      → dashboard (resumen + accesos rápidos)
/admin/profile              → form singleton
/admin/companies            → list + new
/admin/companies/[id]       → edit
/admin/companies/[id]/roles → list de roles, new
/admin/roles/[id]           → edit role
/admin/education            → list + new
/admin/education/[id]       → edit
/admin/projects             → list + new
/admin/projects/[id]        → edit
/admin/stack                → list de stack groups
/admin/stack/[id]           → edit group + items
/admin/technologies         → CRUD taxonomía
/admin/media                → uploader Storage
/admin/publish              → botón "Publicar" (trigger deploy hook)
```

## Stack de admin

- Mismo Astro 5 SSR, sin React.
- Forms HTML nativos + `enhance` con un mini script (`<form method="post">` → endpoint Astro `/api/...`).
- Validación con **Zod** en server.
- Estado: server-only. Sin react-query, sin client-side cache.
- UI: misma design system, ajustada a tablas y forms (más densidad).

## Endpoints API

- `POST /api/profile` — update singleton.
- `POST /api/companies` — create.
- `PUT /api/companies/[id]` — update.
- `DELETE /api/companies/[id]` — delete (cascade roles).
- ... (mismo patrón por entidad)
- `POST /api/media` — upload a Storage (multipart).
- `POST /api/publish` — trigger CF deploy hook.

## Responsive

Backoffice **totalmente responsive**. Tabla con scroll horizontal en mobile; en md+ una pestaña vertical lateral; en sm un drawer/burger. Mismo design system.

## Auditoría

Cada acción de admin se logea en una tabla `admin_audit_log` (futura):

```sql
create table admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  action text not null,
  entity text not null,
  entity_id uuid,
  payload jsonb,
  created_at timestamptz not null default now()
);
```

## Bootstrap del primer admin

1. Habilitar Google OAuth en el dashboard de Supabase (acción manual del ingeniero).
2. El ingeniero inicia sesión la primera vez en `/admin/login` (creará su row en `auth.users`).
3. Insertar el rol admin. Vía CLI local (preferido):
   ```bash
   supabase db query "insert into user_roles (user_id, role) values ('<auth_user_id>', 'admin');"
   ```
   Alternativa manual: SQL editor del dashboard.
4. A partir de aquí, accede a `/admin`.

## QA

- Playwright e2e: login → editar profile → publicar → verificar diff en portfolio.
- Tests de RLS: query como anon no debe poder hacer `update/insert/delete` a ninguna tabla de contenido.

## Riesgos / decisiones abiertas `[PENDIENTE]`

- ¿Multi-editor real (varias personas con roles distintos)?  → no por ahora.
- ¿Versionado de contenido (drafts/published)? → no en v1 del backoffice; valorar después.
- ¿Preview de cambios antes de publicar? → idea: ruta `/preview?token=...` que renderiza con los datos actuales (no publicados) leyendo a Supabase directo.
- ¿Internacionalización de la UI del admin? → no, solo en español.
