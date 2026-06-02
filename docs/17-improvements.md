# 17 · Mejoras propuestas

Backlog priorizado de mejoras a nivel de **código** e **infraestructura**, surgido de la auditoría del proyecto. No son bugs (el código está verde: `check` 0 errores, 57 tests, `build` OK); son oportunidades de robustez, rendimiento, seguridad y escalabilidad.

**Prioridad**: `P1` alto valor / hacer pronto · `P2` medio · `P3` nice-to-have.
**Esfuerzo**: `S` < 1h · `M` 1-4h · `L` > medio día.

## Quick wins (P1, esfuerzo bajo)

| # | Mejora | Esf. |
|---|---|---|
| I1 | CI en GitHub Actions (check + test + build en cada PR) | S |
| P1 | Imágenes responsive (Supabase transforms / `astro:assets`) | M |
| O1 | Resolver el binding `SESSION` KV del adapter (warning en cada build) | S |
| C1 | Cache-Control SWR para el HTML prerenderizado | S |

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

1. **I1** (CI) + **O1** (binding SESSION) — base operativa, esfuerzo bajo.
2. **P1** (imágenes) — mayor impacto en CWV.
3. **Q3** (observabilidad) + **S3** (audit log) — antes de operar en vivo desde el backoffice.
4. **E1** (RPC pivots) + **E2** (factory CRUD) — deuda de duplicación.
5. **S1** (CSP hashes) + **S2** (rate limit) + **O2** (backups) — endurecimiento.
6. Resto (P3) según disponibilidad.
