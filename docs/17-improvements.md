# 17 · Mejoras propuestas

Backlog priorizado de mejoras a nivel de **código** e **infraestructura**, surgido de la auditoría del proyecto. No son bugs (el código está verde: `check` 0 errores, 57 tests, `build` OK); son oportunidades de robustez, rendimiento, seguridad y escalabilidad.

**Prioridad**: `P1` alto valor / hacer pronto · `P2` medio · `P3` nice-to-have.
**Esfuerzo**: `S` < 1h · `M` 1-4h · `L` > medio día.

## Estado (cierre de v3)

**Implementado y verificado** (build/check/test verdes):
- ✅ **I1** CI (GitHub Actions: check + test + build).
- ✅ **O5** Dependabot (npm + actions, weekly).
- ✅ **C1** Cache-Control SWR para `/` y `/en/`.
- ✅ **P1** Imágenes optimizadas con `astro:assets` + `sharp` (hero webp 1x/2x; proyectos webp responsive).
- ✅ **Q1 (parcial)** e2e de los guards admin (`e2e/admin.spec.ts`).
- ✅ Hardening de subida de medios (solo imágenes, 5 MB); componente `DeleteForm`.

**Diferido por estabilidad** (toca código crítico/refactor amplio — hacer con calma, no en el cierre): **E1** RPC pivots, **E2** factory CRUD, **Q2** bump `@supabase/ssr`, **S1** CSP con hashes.

**Requiere acción manual del ingeniero** (dashboard/secretos/BD): ver «[Pasos manuales](#pasos-manuales-del-ingeniero)» al final.

---

## 1 · Rendimiento

### P1 · Imágenes responsive y optimizadas `[P1·M]`
Hoy las secciones públicas usan `<img src={supabaseUrl}>` crudo: sin `srcset`, sin `width` servida, sin `webp`/`avif`. Es la mayor brecha de rendimiento (LCP del hero, ancho de banda). El spec ([10-performance](./10-performance.md)) ya lo pide pero no está implementado.

**Propuesta**: helper que use las **Image Transformations de Supabase** (`/storage/v1/render/image/public/...?width=&quality=&format=webp`) y emita `srcset`. Aplicar primero a la foto del hero (LCP) y capturas de proyectos.
```ts
// src/lib/images.ts
export function supaImage(url: string, w: number, q = 70) {
  return url.replace('/object/public/', '/render/image/public/') + `?width=${w}&quality=${q}`;
}
// srcset con [400, 800, 1200, 1600]
```
Alternativa: `<Image>` de `astro:assets` (ya hay `image.remotePatterns` configurado), aunque en SSR Cloudflare el servicio de imágenes es `compile` y solo optimiza en build (las públicas son prerender → sirve).

### C1 · Cache-Control SWR para HTML prerenderizado `[P2·S]`
`public/_headers` cachea `/fonts/*` y `/og/*` pero no el HTML. Añadir (valor del spec 10):
```
/
  Cache-Control: public, max-age=0, must-revalidate, s-maxage=3600, stale-while-revalidate=86400
/en/
  Cache-Control: public, max-age=0, must-revalidate, s-maxage=3600, stale-while-revalidate=86400
```
Edge cache 1h + revalidación; el deploy hook (Publicar) refresca.

### Middleware admin: 2 round-trips `[P3·M]`
Cada request a `/admin/**` y `/api/**` hace `auth.getUser()` **y** `rpc('is_admin')` secuenciales. Para tráfico admin (bajo) es aceptable. Optimización: leer el claim de rol del JWT (custom access token hook de Supabase) y evitar el RPC.

---

## 2 · Seguridad

### S1 · CSP sin `'unsafe-inline'` en `script-src` `[P2·M]`
`_headers` permite `'unsafe-inline'` por el script anti-flash y el snippet de analytics. Como las páginas públicas son prerender, se pueden usar **hashes SHA-256** de los inline scripts en la CSP (en vez de `'unsafe-inline'`), endureciendo contra XSS. Generar los hashes en build.

### S2 · Rate limiting en `/api/*` `[P2·S]`
Los endpoints de auth y mutación no tienen rate limiting de aplicación (Supabase Auth sí tiene el suyo). Añadir una **regla de Rate Limiting de Cloudflare** (WAF) sobre `/api/*` y `/admin/login`. Infra, sin código.

### S3 · Tabla de auditoría `admin_audit_log` `[P2·M]`
[13-backoffice](./13-backoffice.md) ya la diseña pero no existe la migración. Crearla y registrar cada mutación (user_id, action, entity, entity_id, payload) para trazabilidad. Insert desde los endpoints o un trigger.

### Cabeceras extra `[P3·S]`
Añadir `Cross-Origin-Opener-Policy: same-origin` y `Cross-Origin-Resource-Policy: same-origin` a `_headers`. La CSP/HSTS/XFO actuales ya son buenas.

---

## 3 · Escalabilidad y estructura

### E1 · Sincronización atómica de pivots vía RPC `[P2·M]`
El guardado de tecnologías hace `delete` + `insert` en dos queries **no transaccionales** (4 funciones casi idénticas en `mutations.ts`). Una función Postgres resolvería atomicidad y elimina la duplicación:
```sql
create function set_entity_technologies(p_table text, p_fk text, p_id uuid, p_ids uuid[])
returns void language plpgsql security invoker as $$ ... delete + insert ... $$;
```
Llamada única `client.rpc('set_entity_technologies', {...})`. Respeta RLS con `security invoker`.

### E2 · Factory genérico de endpoints CRUD `[P2·M]`
Los 7 endpoints `/api/<entity>.ts` comparten ~95% del boilerplate (check admin → dispatch `_action` → parse → flash → redirect). Un `createCrudHandler({ schema, parse, create, update, remove, redirect })` quitaría ~300 líneas y centraliza el patrón. Riesgo: toca todas las rutas de mutación → hacer con tests.

### E3 · Lecturas admin genéricas `[P3·S]`
Los `fetch*Admin` repiten el agrupado de pivots (groupBy fk). Extraer un helper `groupPivots(rows, fk)` reutilizable.

---

## 4 · Calidad de código y testing

### Q1 · e2e del backoffice `[P2·M]`
No hay cobertura e2e del flujo admin (está tras auth). Añadir Playwright con sesión admin sembrada (helper que cree un JWT de servicio en entorno de test, o un bypass solo-test). Cubrir: login → editar perfil → toast → publicar.

### Q2 · Deprecación de `@supabase/ssr` `[P3·S]`
`createServerClient` dispara 1 *hint* de deprecación (de ahí el `as unknown as SupabaseServerClient` en `supabaseServer.ts`). Subir `@supabase/ssr` a `^0.6+` y revisar la firma de cookies para eliminar el cast.

### Q3 · Observabilidad de errores `[P2·M]`
Los endpoints hacen `catch {}` → flash `error` **silencioso**: en producción no hay traza. Integrar un logger compatible con Workers (Sentry, Logflare, o `Astro` + Cloudflare Logpush) para capturar el error real. Sin esto, depurar un fallo de guardado en vivo es a ciegas.

### Q4 · Lighthouse CI `[P2·M]`
[10-performance](./10-performance.md) fija CWV (LCP < 2s, CLS 0, Perf ≥ 95). Añadir Lighthouse CI a los PRs que tocan render para detectar regresiones.

---

## 5 · Infraestructura y operaciones

### I1 · CI (GitHub Actions) `[P1·S]`
No hay CI. El flujo `v3 → develop → main` debería bloquear merges con checks. Workflow mínimo:
```yaml
# .github/workflows/ci.yml
name: ci
on: { pull_request: { branches: [develop, main] } }
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm check
      - run: pnpm test
      - run: pnpm build
```
(El `build` prerender solo necesita la anon key pública, ya hardcodeada → CI sin secretos.)

### O1 · Binding `SESSION` KV del adapter `[P1·S]`
Cada `astro build` avisa: *"Enabling sessions with Cloudflare KV with the SESSION KV binding… add the binding"*. Astro 5 activa el feature de sessions y espera un KV namespace `SESSION`. **No usamos** `Astro.session` (auth vía cookies de Supabase). Opciones: (a) desactivar el feature, o (b) crear el KV namespace y declararlo en `wrangler.jsonc`. Resolver para evitar un fallo runtime si algo lo invocara.

### O2 · Backups de la BD `[P2·S]`
El free tier de Supabase tiene backups limitados. Programar un `pg_dump` lógico periódico (cron en CI/GitHub Actions) a un bucket. Crítico al pasar a edición en vivo desde el backoffice.

### O3 · Branch DB para Preview `[P3·M]`
Los deploys Preview de Cloudflare apuntan al **mismo** Supabase de producción. Con Supabase Branching, aislar la BD de preview evita tocar datos reales en QA.

### O4 · Monitorización y alertas `[P3·S]`
Cloudflare Web Analytics es solo RUM. Añadir uptime check (cron ping) y alertas de error (Sentry) para enterarse de caídas/errores sin mirar el dashboard.

### O5 · Renovate/Dependabot `[P3·S]`
Automatizar PRs de actualización de dependencias (Astro, Tailwind, Supabase) con la CI de I1 como red de seguridad.

---

## Orden sugerido

1. **I1** (CI ✅) + **O1** (binding SESSION) — base operativa, esfuerzo bajo.
2. **P1** (imágenes ✅) — mayor impacto en CWV.
3. **Q3** (observabilidad) + **S3** (audit log) — antes de operar en vivo desde el backoffice.
4. **E1** (RPC pivots) + **E2** (factory CRUD) — deuda de duplicación.
5. **S1** (CSP hashes) + **S2** (rate limit) + **O2** (backups) — endurecimiento.
6. Resto (P3) según disponibilidad.

---

## Pasos manuales del ingeniero

Lo que **no puedo hacer yo** (dashboards, secretos, BD). Cada paso con su comprobación.

### A · Cierre de v3 en producción (imprescindible)

1. **Confirmar el proyecto Supabase.** ⚠️ La app usa `nzbodijggjxhshqqpnue` (Frankfurt) pero `supabase` CLI está linkada a otro (`ulxpassoworqptnwktxi`, "website"). Verifica cuál es el real y re-linka: `supabase link --project-ref nzbodijggjxhshqqpnue`.
   - **Check**: `supabase projects list` marca como LINKED el proyecto correcto; `src/config/supabase.ts` apunta a la misma `ref`.
2. **Google OAuth** (ya hecho): provider en Supabase + redirect URLs (`https://sebasgrios.es/api/auth/callback`).
   - **Check**: en `/admin/login`, "Entrar con Google" completa el login y vuelve a `/admin`.
3. **Primer admin** (ya hecho): fila en `user_roles` con `role='admin'`.
   - **Check**: tras loguear, `/admin` carga el panel (no redirige a `/401`).
4. **Secreto `CF_DEPLOY_HOOK_URL`** en Cloudflare Pages (Settings → Environment variables → Production, cifrado). Crear el Deploy hook en Settings → Builds & deployments (rama de prod).
   - **Check**: en `/admin/publish`, "Publicar ahora" → toast verde y un nuevo deployment en Cloudflare.
5. **Desplegar v3**: PR `v3 → develop`, luego `develop → main`. La CI (paso B) debe pasar.
   - **Check**: `sebasgrios.es` sirve la build de v3; Lighthouse mobile ≥ 95.

### B · CI (ya creada, falta activarla)

6. El workflow `.github/workflows/ci.yml` corre en PRs a `develop`/`main`. En GitHub → Settings → Branches: marca el job **CI / verify** como *required status check* para `develop` y `main`.
   - **Check**: abrir un PR muestra el check "CI" y bloquea el merge si falla.

### C · Endurecimiento (recomendado antes de editar en vivo)

7. **Rate limiting (S2)**: Cloudflare → Security → WAF → Rate limiting rules sobre `/api/*` y `/admin/login` (p. ej. 30 req/min por IP).
   - **Check**: ráfaga de peticiones a `/api/auth/signin` devuelve `429`.
8. **Backups (O2)**: programar `pg_dump` (cron) con la connection string como secret de GitHub Actions a un bucket.
   - **Check**: existe un dump reciente en el destino.
9. **Audit log (S3)**: crear la migración `admin_audit_log` (ver schema en [13-backoffice](./13-backoffice.md)) y aplicarla (`supabase db push`). *(El wiring de inserts queda como follow-up.)*
   - **Check**: `supabase migration list` muestra la migración aplicada.
10. **SESSION KV (O1, opcional)**: silenciar el warning del build creando un KV namespace y declarando el binding `SESSION` en `wrangler.jsonc`, o ignorarlo (no usamos `Astro.session`).

### D · Observabilidad y futuro (P2/P3)

11. **Sentry (Q3/O4)**: crear proyecto, añadir DSN como secret, integrar en los `catch` de `/api/*`.
12. **Branch DB (O3)**, **Lighthouse CI (Q4)**, **Renovate** si se prefiere a Dependabot.

> Las mejoras de **código** diferidas (E1 RPC pivots, E2 factory CRUD, Q2 bump `@supabase/ssr`, S1 CSP hashes) las puedo implementar yo en una iteración aparte; se dejaron fuera del cierre por ser refactors de riesgo sobre código ya estable.
