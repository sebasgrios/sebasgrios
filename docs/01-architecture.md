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
                     │  /og/*.png    → prerender (Satori)      │
                     └──────────┬─────────────────────────────┘
                                │
                                │ supabase-js (server-side)
                                ▼
                     ┌────────────────────────────────────────┐
                     │              Supabase                   │
                     │  · Postgres (data)                      │
                     │  · Storage (images/logos)               │
                     │  · Auth (Google OAuth, admin)           │
                     │  · RLS habilitado en todas las tablas   │
                     └────────────────────────────────────────┘
```

## Decisiones de runtime `[DECIDIDO]`

- **Astro 5** con `output: 'server'` y `prerender: true` por defecto en páginas públicas.
- **Adapter Cloudflare** (`@astrojs/cloudflare`). Workers Runtime, no Node. Esto restringe librerías a las que funcionan en `workerd`.
- **Prerender**: las páginas públicas (`/`, `/en/`) se generan en build leyendo Supabase. Cuando los datos cambien, el botón **Publicar** (`/admin/publish`) dispara el deploy hook de Cloudflare y se reconstruye.
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
- El cliente Supabase es un **singleton** en memoria (`getServerClient()`); como las páginas públicas son prerender, las queries solo corren en build (cero round-trip en el hot path). No hay capa `astro:cache`.

### Server (`/src/pages/api`, `/src/pages/og`)

- Endpoints de mutación del backoffice: `POST /api/<entity>` (despacha create/update/delete por `_action`), `POST /api/media` (multipart), `POST /api/publish` (deploy hook), `POST /api/auth/*` (OAuth). Todos validan `is_admin` (middleware) + RLS.
- Generación de OG images con `satori` (JSX→SVG) + `@resvg/resvg-wasm` (SVG→PNG), compatible con Cloudflare Workers. Prerender en build.

### Configuración (`/src/config`)

- `site.ts`: URL canónica, dominio, nombre, links sociales por defecto.
- `i18n.ts`: locales, `Localized<T>`, helpers de locale. `copy.ts`: chrome copy es/en. `analytics.ts`, `supabase.ts`: config pública.
- `tweaks.ts`: valores fijos sin UI — `glassIntensity = 0.1`, `accentHue = 264`, `parallax = true`, `entryAnimations = true`.
- Los **tokens de diseño** no viven en un `theme.ts`: se declaran como CSS variables y `@theme` en `/src/styles/globals.css`.

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

## Flujo de datos del backoffice (ver [13-backoffice](./13-backoffice.md))

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

- **HomeViewModel**: shape estable, definido en `/src/lib/domain/types.ts`. Cualquier cambio en este shape requiere actualizar todas las secciones y la documentación.
- **Repos**: cada método es async, devuelve `Promise<DomainType>` o `Promise<DomainType[]>`. Errores se propagan; no se silencian.
- **Cliente Supabase**: solo se instancia en server. Nunca llega al bundle de cliente.

## Lo que **no** es esta arquitectura

- No es un SPA. Es contenido estático con islas mínimas.
- No es serverless-first puro: el prerender hace la mayoría del trabajo. SSR solo donde aporta.
- No tiene capa GraphQL: supabase-js directo desde repos.
- No tiene ORM: queries supabase-js + mapeo manual a tipos de dominio (más control, menos magia).
