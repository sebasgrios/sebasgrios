# 00 · Overview

> **Estado: v3.0.0 en producción.** Público + backoffice implementados, verificados y desplegados en `sebasgrios.es` (release `develop → main`, PR #10; tag `v3.0.0`). Solo queda el endurecimiento opcional del ingeniero. Ver [`CHANGELOG.md`](../CHANGELOG.md) y [17-improvements](./17-improvements.md).

## Objetivo

Reconstruir el portfolio personal del ingeniero (Sebastián González Ríos) en una **v3** completa que:

- Implemente el nuevo diseño "Liquid Glass" (ver [04-design-system](./04-design-system.md)).
- Migre el contenido de ficheros `.ts` estáticos a **Supabase** (ver [06-data-schema](./06-data-schema.md)).
- El **backoffice** de edición vive en un repo separado en Next.js (ver [13-backoffice](./13-backoffice.md)).
- Soporte **i18n es/en** desde el inicio (ver [07-i18n](./07-i18n.md)).
- Mantenga métricas Core Web Vitals en verde (LCP < 2.0s en 4G, CLS = 0, INP < 200ms).

## Alcance v3 (in-scope)

- Astro 6, sitio estático (`output: 'static'`) servido por Cloudflare Pages.
- Tailwind v4, TypeScript strict, Biome.
- Schema Supabase + migraciones + tipos generados.
- Seed de datos desde el contenido actual de `src/data/*.ts` + el nuevo contenido del diseño (companies/roles/sectores).
- Self-host de fuentes (Satoshi, General Sans, JetBrains Mono).
- OG image dinámica con Satori.
- Cloudflare Web Analytics.
- Tests unitarios con Vitest. Playwright para smoke público.
- Documentación completa en `/docs` + `AGENTS.md`.

## Backoffice (repo separado)

El backoffice de edición se reescribió en **Next.js** y vive en un repo aparte (`sebasgrios-backoffice`, `backoffice.sebasgrios.es`); habla con el mismo Supabase y dispara el deploy hook del portfolio para reconstruirlo. Ver [13-backoffice](./13-backoffice.md).

## Out-of-scope v3 (se hace después)

- Blog / artículos.
- Formulario de contacto (se mantiene `mailto:` + enlaces sociales).
- Newsletter / RSS.
- Cambio de dominio (sigue siendo `sebasgrios.es`).

## Hitos de entrega

| Hito | Contenido | Validación |
|---|---|---|
| **M1 · Docs** (este commit) | `/docs` completo + `AGENTS.md` reescrito. | Ingeniero revisa y aprueba. |
| **M2 · Esqueleto** | Astro 5 + Tailwind v4 + Biome + Cloudflare adapter configurados. `package.json` nuevo. Hello world responsive. | `npm run build` pasa. |
| **M3 · Design system** | Tokens, glass primitive, fuentes self-host, dark/light, accent azul fijo, reduced-motion. | Storybook-like page en `/dev/design`. |
| **M4 · Supabase** | Proyecto creado, migraciones, seed, types generados, helper client SSR. | `select` desde server island devuelve datos. |
| **M5 · Secciones públicas** | Nav, Hero, Experience, Education, Stack, Projects, Contact, Footer, responsive completo. | Captura desktop+móvil aprobada por el ingeniero. |
| **M6 · i18n** | Ruta `/en/` funcional, fallback es→en, sitemap multilenguaje. | Ambas rutas renderizan con contenido correcto. |
| **M7 · SEO/Perf** | Satori OG, sitemap, robots, schema.org `Person`, Cloudflare Web Analytics, Lighthouse > 95 en todas. | Reporte Lighthouse adjunto al PR. |
| **M8 · QA + release** | Tests Vitest + e2e, PR `develop → main`, deploy a producción. | Merge y sitio live en `sebasgrios.es`. |

## Definición de "listo" por feature

Una feature está lista cuando cumple todo lo siguiente:

1. Tipos en TypeScript correctos (sin `any` sin justificar).
2. Test unitario si hay lógica no trivial (date helpers, computed stats, i18n helpers).
3. Verificado a ojo en `npm run dev` desktop + móvil (responsive en DevTools).
4. Cumple `prefers-reduced-motion` si tiene animación.
5. AA de contraste verificado en light y dark.
6. Lighthouse local no degrada vs baseline (la primera baseline es M5).
7. Documentación actualizada si la feature toca un contrato.
8. Commit con Conventional Commits + emoji, en inglés, sin trailer (ver [03-conventions](./03-conventions.md)).
