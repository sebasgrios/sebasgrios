# 01 · Architecture

## Visión global

```
                     ┌────────────────────────────────────────┐
                     │           Cloudflare Pages              │
                     │  (Astro 5 con @astrojs/cloudflare)      │
                     │                                         │
   Visitante  ─────▶ │  /            → prerender (estático)    │
                     │  /en/         → prerender (estático)    │
   Editor admin ───▶ │  /admin/**    → SSR (server)            │
                     │  /api/**      → server endpoints        │
                     │  /og/*.png    → SSR (Satori)            │
                     └──────────┬─────────────────────────────┘
                                │
                                │ supabase-js (server-side)
                                ▼
                     ┌────────────────────────────────────────┐
                     │              Supabase                   │
                     │  · Postgres (data)                      │
                     │  · Storage (images/logos)               │
                     │  · Auth (Google OAuth, futuro)          │
                     │  · RLS habilitado en todas las tablas   │
                     └────────────────────────────────────────┘
```

## Decisiones de runtime `[DECIDIDO]`

- **Astro 5** con `output: 'server'` y `prerender: true` por defecto en páginas públicas.
- **Adapter Cloudflare** (`@astrojs/cloudflare`). Workers Runtime, no Node. Esto restringe librerías a las que funcionan en `workerd`.
- **Prerender**: las páginas públicas (`/`, `/en/`) se generan en build leyendo Supabase. Cuando los datos cambien (vía webhook desde el backoffice futuro), se dispara un redeploy.
- **SSR puntual**: `/admin/**` y endpoints de mutación.
- **Imágenes**: servidas desde Supabase Storage con transformación CDN (`?width=…&format=webp`). El componente `<Image>` de Astro envuelve la URL remota.

## Capas

### Presentación (`/src/components`, `/src/sections`, `/src/layouts`)

- Componentes **`.astro`** sin JS por defecto. Zero-JS es la norma.
- JS solo cuando hay interactividad real (theme toggle, parallax, nav burger, reveal-on-scroll). Se aísla en componentes con `client:visible`/`client:idle` o en `<script>` embebidos.
- Sin React, sin Vue, sin frameworks de UI. Astro nativo + Tailwind v4.

### Dominio (`/src/lib/domain`)

- Tipos de dominio puros (sin acoplar Supabase): `Profile`, `Company`, `Role`, `Education`, `Project`, `Technology`, `StackGroup`, `Locale`.
- Helpers puros: `computeYearsOfExperience`, `formatDateRange`, `pickLocale`, `groupRolesByCompany`.
- Testeable sin red, sin DOM.

### Datos (`/src/lib/data`)

- Cliente Supabase tipado (`createServerClient(env)`).
- Repositorios por agregado: `profileRepo.get()`, `companyRepo.listWithRoles()`, etc.
- Cada repo devuelve **tipos de dominio**, no rows de la BD (mapper en medio).
- Cache: las funciones repo usan `astro:cache` por defecto en build; en SSR cachean en memoria del worker durante 60s.

### Server (`/src/pages/api`, `/src/pages/og`)

- Endpoints de mutación (backoffice, futuro).
- Generación de OG images con Satori + `@vercel/og` (compatible con Cloudflare Workers).
- Webhook receiver para invalidación de cache.

### Configuración (`/src/config`)

- `site.ts`: URL canónica, locales, links sociales por defecto (en caso de no haber profile aún).
- `theme.ts`: tokens de diseño exportados a Tailwind config y a CSS variables.
- `tweaks.ts`: valores fijos sin UI — `glassIntensity = 0.1`, `accentHue = 264`, `parallax = true`, `entryAnimations = true`.

## Flujo de datos público

```
build ─▶ profileRepo.get()        ─┐
        companyRepo.listWithRoles()│
        educationRepo.list()       │   compone ViewModel
        stackRepo.listGroups()     ├──▶ que cada sección
        projectRepo.list()         │   consume.
        technologyRepo.dict()      ─┘
```

- Una única función `loadHomeData(locale)` en `/src/lib/data/loaders.ts` orquesta todas las llamadas en paralelo y devuelve un `HomeViewModel`.
- Cada sección Astro recibe **solo su slice** del view model como prop.

## Flujo de datos del backoffice (futuro, ver [13-backoffice](./13-backoffice.md))

```
Admin (browser) ──▶ /admin/* (SSR Astro)
                       │
                       ├──▶ Supabase Auth (cookie)
                       │
                       ├──▶ /api/* (POST/PUT/DELETE)
                       │       └─▶ supabase admin client (server)
                       │              └─▶ trigger redeploy (CF deploy hook)
                       │
                       └──▶ render formularios + lista
```

## Contratos clave

- **HomeViewModel**: shape estable, definido en `/src/lib/domain/viewModels.ts`. Cualquier cambio en este shape requiere actualizar todas las secciones y la documentación.
- **Repos**: cada método es async, devuelve `Promise<DomainType>` o `Promise<DomainType[]>`. Errores se propagan; no se silencian.
- **Cliente Supabase**: solo se instancia en server. Nunca llega al bundle de cliente.

## Lo que **no** es esta arquitectura

- No es un SPA. Es contenido estático con islas mínimas.
- No es serverless-first puro: el prerender hace la mayoría del trabajo. SSR solo donde aporta.
- No tiene capa GraphQL: supabase-js directo desde repos.
- No tiene ORM: queries supabase-js + mapeo manual a tipos de dominio (más control, menos magia).
