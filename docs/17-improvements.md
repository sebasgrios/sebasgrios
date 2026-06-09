# 17 · Mejoras propuestas

Backlog priorizado del **portfolio público** (sitio estático). No son bugs (el código está verde: `check` 0 errores, 29 tests, `build` OK); son oportunidades de robustez, rendimiento, seguridad y SEO.

**Prioridad**: `P1` alto valor · `P2` medio · `P3` nice-to-have.
**Esfuerzo**: `S` < 1h · `M` 1-4h · `L` > medio día.

> El backoffice y sus mejoras (auth, endpoints, audit log, rate limiting, factory CRUD, observabilidad de mutaciones, deprecación de `@supabase/ssr`) se movieron al repo **`sebasgrios-backoffice`**. Lo de aquí es solo el sitio público.

## Estado

**Implementado y verificado:**
- ✅ CI (GitHub Actions: check + test + build) en PRs a `develop`/`main`.
- ✅ Cache-Control SWR para `/` y `/en/`.
- ✅ Imágenes optimizadas con `astro:assets` + `sharp` (hero webp 1x/2x; proyectos webp responsive).
- ✅ **Paso a estático**: eliminado el backoffice SSR; `output: 'static'`, sin adapter ni worker. Desaparecen el binding `SESSION` KV, los round-trips de auth del middleware y la exclusión `_routes.json`.
- ✅ **Optimización integral**: deps a latest (Astro 6, TS 6, Biome 2, Vitest 4); avatar/logos a webp (`astro:assets`); a11y (landmarks, skip-link al foco, contraste AA) con **axe en CI**; JSON-LD `Person` enriquecido; **CSP sin `'unsafe-inline'`** (hashes de Astro 6) + COOP/CORP; **Lighthouse CI**.

---

## 1 · Seguridad

### S1 · CSP sin `'unsafe-inline'` ✅ (hecho)
`security.csp` de Astro 6 genera la CSP por `<meta>` con hashes SHA-256 de scripts/estilos inline; los colores de marca de los iconos se movieron de `style=` a `globals.css` (`[data-ti]`). `_headers` conserva `frame-ancestors`, `upgrade-insecure-requests` y COOP/CORP. **Nota**: Astro **no** hashea el contenido de `<style set:html>` dinámico (lo hashea como vacío) — por eso los colores van en CSS estático, no en un `<style>` generado. Verificado en `astro preview` (consola sin violaciones).

### Cabeceras extra ✅ (hecho)
`Cross-Origin-Opener-Policy: same-origin` y `Cross-Origin-Resource-Policy: same-origin` añadidas a `_headers` (junto a HSTS/XFO/Referrer/Permissions).

---

## 2 · Rendimiento y SEO

### Lighthouse CI `[P2·M]`
[10-performance](./10-performance.md) fija CWV (LCP < 2s, CLS 0, Perf ≥ 95). Añadir Lighthouse CI a los PRs que tocan render para detectar regresiones, usando la URL de preview de Cloudflare.

### Afinado SEO `[P3·S]`
Revisar el JSON-LD (ya presente), `lastmod` en el sitemap y el `Cache-Control` por tipo de recurso. Asegurar `hreflang` y canónicas correctas en ambos locales.

---

## 3 · Datos / operaciones (Supabase compartido)

> El **backoffice** es el dueño del schema (`supabase/`). Estos puntos afectan al dato compartido y conviene coordinarlos entre repos.

### Filtro `is_visible` en lecturas `[P1·S]`
Cuando el backoffice añada la columna `is_visible` (ocultar), el portfolio debe **filtrar** las filas ocultas en `repos.ts`/`loaders.ts` (`.eq('is_visible', true)`) y regenerar `database.types.ts`.

### Backups de la BD `[P2·S]`
El free tier de Supabase tiene backups limitados. Programar un `pg_dump` lógico periódico a un bucket. Puede vivir en el repo backoffice como dueño del schema.

### Branch DB para Preview `[P3·M]`
Los deploys Preview apuntan al **mismo** Supabase de producción. Con Supabase Branching, aislar la BD de preview evita tocar datos reales en QA.

---

## 4 · Dependencias

### Automatizar actualización de dependencias `[P3·S]`
Se actualizan manualmente. Si se quiere automatizar los PRs (Astro, Tailwind, Supabase), valorar **Renovate** con la CI como red de seguridad.

---

## Orden sugerido

1. **Filtro `is_visible`** cuando el backoffice lo introduzca (coordinado entre repos).
2. **S1** CSP sin `'unsafe-inline'` — ahora factible al ser todo estático.
3. **Lighthouse CI** + cabeceras extra.
4. **Backups** + **Branch DB** de preview.
5. Resto (P3) según disponibilidad.
