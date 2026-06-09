# 01 · Architecture

## Visión global

```
                     ┌────────────────────────────────────────┐
                     │            Cloudflare Pages             │
                     │      (Astro 6 · sitio estático)         │
                     │                                         │
   Visitante  ─────▶ │  /            → estático (prerender)    │
                     │  /en/         → estático (prerender)    │
                     │  /og/*.png    → estático (Satori)       │
                     │  /404         → estático                │
                     └──────────┬─────────────────────────────┘
                                │ supabase-js (solo en build)
                                ▼
                     ┌────────────────────────────────────────┐
                     │               Supabase                  │
                     │  · Postgres (data, RLS public read)     │
                     │  · Storage (images/logos)               │
                     └────────────────────────────────────────┘
```

La edición de contenido (escrituras, auth, media, publicar) vive en un **repositorio separado** (`sebasgrios-backoffice`, Next.js). Ver [13-backoffice](./13-backoffice.md).

## Decisiones de runtime `[DECIDIDO]`

- **Astro 6** con `output: 'static'`: el sitio entero se genera en build. No hay SSR ni worker.
- **Sin adapter**: al quitar el backoffice no queda ninguna ruta dinámica, así que se eliminó `@astrojs/cloudflare`. Cloudflare Pages sirve `dist/` como estático.
- **Build-time data**: las páginas (`/`, `/en/`) y las OG (`/og/*.png`) se generan en build leyendo Supabase. Cuando los datos cambian, el backoffice dispara el **deploy hook** de Cloudflare y el sitio se reconstruye.
- **Imágenes**: `astro:assets` + `sharp` optimizan en build (webp) las imágenes remotas de Supabase Storage.

Histórico: hasta v3.0.0 el output era `'server'` (SSR híbrido) con `@astrojs/cloudflare` para servir `/admin` + `/api`. Al mover el backoffice a un repo aparte, el portfolio pasó a estático puro.

## Capas

### Presentación (`/src/components`, `/src/sections`, `/src/layouts`)

- Componentes **`.astro`** sin JS por defecto. Zero-JS es la norma.
- JS solo cuando hay interactividad real (theme toggle, parallax, nav burger, reveal-on-scroll), aislado en `<script>` o en `effects.client.ts`.
- Sin React, sin Vue. Astro nativo + Tailwind v4.

### Dominio (`/src/lib/domain`)

- Tipos de dominio puros (sin acoplar Supabase): `Profile`, `Company`, `Role`, `Education`, `Project`, `Technology`, `StackGroup`, `Locale`.
- Helpers puros: `computeYearsOfExperience`, `formatDateRange`, `pickLocale`, `groupRolesByCompany`. Testeable sin red, sin DOM.

### Datos (`/src/lib/data`)

- Cliente Supabase tipado (`getServerClient()`), **solo lectura** (anon key, RLS public read).
- Repositorios por agregado (`fetchProfile`, `fetchCompaniesWithRoles`, …) que devuelven **tipos de dominio** (mapper en medio), no rows de la BD.
- El cliente es un **singleton** en memoria; como todo es estático, las queries solo corren en build (cero round-trip en runtime). No hay capa `astro:cache`.

### OG (`/src/pages/og`)

- Generación de OG images con `satori` (JSX→SVG) + `@resvg/resvg-wasm` (SVG→PNG), **prerender en build** (Node). El `.wasm` se lee del disco con `node:fs` (`createRequire(...).resolve`).

### Configuración (`/src/config`)

- `site.ts` (URL, dominio, links), `i18n.ts`, `copy.ts` (chrome es/en), `supabase.ts` (URL + anon key públicas), `tweaks.ts`.
- Los **tokens de diseño** viven como CSS variables y `@theme` en `/src/styles/globals.css`.

## Flujo de datos

```
build ─▶ profileRepo.get()        ─┐
        companyRepo.listWithRoles()│
        educationRepo.list()       │   compone HomeViewModel
        stackRepo.listGroups()     ├──▶ que cada sección
        projectRepo.list()         │   consume.
        technologyRepo.dict()      ─┘
```

- Una única función `loadHomeData(locale)` en `/src/lib/data/loaders.ts` orquesta las llamadas en paralelo y devuelve un `HomeViewModel`. Cada sección recibe **solo su slice**.

## Contratos clave

- **HomeViewModel**: shape estable en `/src/lib/domain/types.ts`. Cualquier cambio requiere actualizar las secciones y la documentación.
- **Repos**: cada método es async y devuelve `Promise<DomainType>` o `Promise<DomainType[]>`. Errores se propagan; no se silencian.
- **Cliente Supabase**: solo se instancia en build (server). Nunca llega al bundle de cliente.

## Lo que **no** es esta arquitectura

- No es un SPA. Es contenido estático con islas mínimas.
- No tiene SSR ni worker: todo se genera en build.
- No tiene capa GraphQL: supabase-js directo desde repos.
- No tiene ORM: queries supabase-js + mapeo manual a tipos de dominio.
