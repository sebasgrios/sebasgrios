# AGENTS.md

Briefing autocontenido para cualquier sesión/agente (Claude, Copilot, etc.) que llegue a este repositorio en frío. Léelo entero antes de actuar.

## Qué es este proyecto

Portfolio personal de **Sebastián González Ríos** (`sebasgrios.es`).

Es la **v3**, una reescritura completa que:
- Migra de Astro 4 a **Astro 6**; hoy es un **sitio 100% estático** servido por Cloudflare Pages (sin SSR ni adapter).
- Reemplaza el contenido en `.ts` estáticos por **Supabase** (Postgres + Storage), leído en build.
- Implementa un nuevo diseño "Liquid Glass" con i18n es/en.

El **backoffice** (edición de contenido) se reescribió en **Next.js** y vive en un **repo separado** (`sebasgrios-backoffice`, `backoffice.sebasgrios.es`); ya no está en este repo. Ver [`docs/13-backoffice.md`](./docs/13-backoffice.md).

Estado actual: **portfolio público estático en producción** en `sebasgrios.es` (Astro 6 + Supabase + Cloudflare Pages). La rama de desarrollo `v3` de la reescritura se mergeó y ya no existe (tag `v3.0.0`). Backlog en [`docs/17-improvements.md`](./docs/17-improvements.md).

Hitos cerrados:
- **M1–M7** docs, scaffold, design system, Supabase, secciones públicas, i18n, SEO/OG/Analytics.
- **Mejoras de cierre**: CI, imágenes webp (`astro:assets`), headers de cache SWR.
- **Paso a estático**: eliminado el backoffice SSR del repo (movido a `sebasgrios-backoffice`); `output: 'static'`, sin adapter ni worker.
- Changelog en [`CHANGELOG.md`](./CHANGELOG.md). Backlog/mejoras futuras en [`docs/17-improvements.md`](./docs/17-improvements.md).

## Documentación de referencia

**SIEMPRE empieza por** [`docs/index.md`](./docs/index.md). Es el índice maestro de 17 documentos que cubren overview, arquitectura, schema, design system, conventions, i18n, deployment, backoffice, improvements, etc.

Documentos críticos:
- [`docs/00-overview.md`](./docs/00-overview.md) — alcance, hitos, definition of done.
- [`docs/01-architecture.md`](./docs/01-architecture.md) — runtime, capas, contratos.
- [`docs/03-conventions.md`](./docs/03-conventions.md) — naming, code style, commits.
- [`docs/04-design-system.md`](./docs/04-design-system.md) — tokens, glass, motion.
- [`docs/06-data-schema.md`](./docs/06-data-schema.md) — tablas, RLS, migraciones.
- [`docs/15-workflows.md`](./docs/15-workflows.md) — flujo diario, runbooks.

## Decisiones cerradas (no las reabras sin pedir)

| Tema | Decisión |
|---|---|
| Framework | Astro 6, **sitio estático** (`output: 'static'`, sin adapter). Cloudflare Pages sirve `dist/`. |
| Estilo | Tailwind v4 (via `@tailwindcss/vite`), TypeScript strict. |
| Tooling | **Biome** (lint+format), Vitest, Playwright, Supabase CLI. NO ESLint/Prettier. |
| BD | Supabase. Proyecto creado: **`sebasgrios`** (ref `nzbodijggjxhshqqpnue`, Frankfurt eu-central-1, free tier). Claude opera vía el **Supabase CLI ya instalado localmente**. Storage para imágenes/logos. |
| i18n | `jsonb {es, en}` en columnas traducibles. Routing `/` (es) + `/en/` con `prefixDefaultLocale:false`. |
| Schema | Híbrido: `text[]` para highlights, tabla `technologies` reutilizable con pivots M:N. |
| Hero | Stats computadas (años, sectores, proyectos). Badges flotantes + status pill editables desde `profile`. |
| Anchors | Siempre en inglés: `#experience #education #stack #projects #contact`. |
| Backoffice | Repo separado **`sebasgrios-backoffice`** (Next.js, `backoffice.sebasgrios.es`). Habla con el mismo Supabase + RLS. |
| OG | Dinámica con Satori. |
| Analytics | Cloudflare Web Analytics (sin cookies). |
| Fuentes | Self-host Satoshi + General Sans + JetBrains Mono. NO CDN. |
| Tweaks UI | **Eliminada**. Valores fijos en `/src/config/tweaks.ts`: glass `0.10`, accent hue `264` (azul), parallax `true`, animations `true`. Todos respetan `prefers-reduced-motion`. |
| Git flow | `develop` (integración) → PR → `main` (producción). La rama `v3` se mergeó y eliminó tras el release. |
| Commits | Formato `<emoji> <subject imperativo en inglés>`. **Sin prefijo textual** (`feat:`, `fix:`, `docs:`...). Sin trailer `Co-Authored-By`. La tabla emoji→categoría vive en [docs/03-conventions.md](./docs/03-conventions.md). |
| Naming | PascalCase componentes Astro, camelCase variables/funciones/campos TS, snake_case SQL, kebab-case carpetas/páginas. |
| Comentarios | **Prohibidos** salvo invariante no obvia / workaround. Nada de explicar el "qué". |

## Estructura objetivo del repo

```
.
├── docs/                  # 17 documentos (índice en docs/index.md)
├── public/
│   ├── fonts/             # Satoshi, General Sans, JetBrains Mono (self-host)
│   ├── _headers           # CSP/HSTS Cloudflare Pages
│   └── _redirects         # (si hace falta)
├── src/
│   ├── components/
│   │   ├── icons/         # SVGs inline como .astro
│   │   └── ...
│   ├── sections/          # Hero, Experience, Education, Stack, Projects, Contact
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── en/index.astro
│   │   ├── 404.astro
│   │   └── og/[locale].png.ts
│   ├── lib/
│   │   ├── domain/        # tipos puros, helpers (dates, i18n, stats)
│   │   ├── data/          # supabase client + repos + mappers + database.types.ts
│   │   └── i18n/          # getLocale, etc.
│   ├── config/
│   │   ├── site.ts        # URL, locales, links default
│   │   ├── theme.ts       # tokens
│   │   ├── tweaks.ts      # valores fijos del design
│   │   ├── copy.ts        # chrome copy es/en
│   │   └── i18n.ts        # locales
│   ├── scripts/           # effects.client.ts
│   └── styles/            # fonts.css, globals.css
├── e2e/                   # Playwright
├── astro.config.mjs
├── biome.json
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

## Comandos esenciales

```bash
npm install
npm run dev            # dev server
npm run check          # astro check + biome check
npm test               # vitest
npm run build          # astro check + astro build
npm run preview        # astro preview (sirve dist/)
npm run e2e            # playwright
```

> El **schema** (migraciones, seed, tipos) es propiedad del backoffice (`sebasgrios-backoffice`); este repo no tiene `supabase/` ni scripts `db:*`. Solo **lee** Supabase en build. Ver [`docs/06-data-schema.md`](./docs/06-data-schema.md).

## Reglas inquebrantables

1. **Antes de cualquier trabajo**, lee [`docs/15-workflows.md`](./docs/15-workflows.md) (flujo) y [`docs/03-conventions.md`](./docs/03-conventions.md) (estilo).
2. **Cuando termines una feature**, redacta al ingeniero un paso a paso de verificación; espera su "ok" antes de commitear.
3. **Commits sin trailer**. En inglés. Formato `<emoji> <subject>`, sin `feat:`/`fix:`/`docs:`. Ejemplo correcto: `✨ add floating badges to hero`.
4. **Trabaja sobre `develop`** (rama de integración): commits directos permitidos; cambios grandes por rama de feature → PR a `develop`. A `main` solo por PR. Nunca push directo ni force a `main`.
5. **Cuando cambies un contrato** (schema, viewModel, repos) actualiza `/docs` en el mismo commit.
6. **No `any`, no `console.log`, no comentarios** salvo invariante no obvia.
7. **Respeta `prefers-reduced-motion`** y `prefers-color-scheme` en cualquier animación o color.
8. **Validaciones Zod** en cualquier input externo (forms, query params, webhooks).
9. **Secrets** solo en `.env.local` (ignorado) o en Cloudflare Pages env vars. Nunca en repo, nunca en logs.
10. **Imágenes** remotas desde Supabase Storage, optimizadas en build (`astro:assets` + `sharp`).

## Cómo razonar antes de cambiar código

Sigue siempre este orden (cita el documento al pensar):

```
Petición del ingeniero
  ↓
¿Está en alcance? (docs/00-overview.md) → si no, pregunta.
  ↓
¿Hay convención que aplique? (docs/03)
  ↓
¿Cómo encaja en la arquitectura? (docs/01)
  ↓
¿Afecta al schema o a la i18n? (docs/06, docs/07)
  ↓
¿Cumple performance y a11y? (docs/10, docs/11)
  ↓
Implementa
  ↓
Verifica (build + test + ojo)
  ↓
Pide validación al ingeniero (paso a paso)
  ↓
Commit
```

## Qué pedir y qué no

**Pide siempre** antes de:
- Eliminar branches, archivos no triviales, registros de DB.
- Force push, reset --hard.
- Cambiar secretos o variables de entorno.
- Subir versiones mayores de Astro/Tailwind/Supabase.
- Cambiar el design system fuera de [`docs/04`](./docs/04-design-system.md).

**Procede sin preguntar** para:
- Crear/editar componentes nuevos que sigan el design system.
- Refactor interno que no cambia la API.
- Añadir tests.
- Corregir typos o pequeños bugs.

## Contexto del ingeniero

- **Email**: contact@sebasgrios.es
- **Idioma de comunicación preferido**: español.
- **Hablamos** en es; el **código** está en en.
- **Stack actual del que viene**: Astro 4 + Tailwind 3 + datos `.ts` estáticos.
- **Sectores en los que trabaja**: banca/FinTech, cleantech, PropTech.
- **Roles**: Frontend / Fullstack / Ingeniero de Software.
- Le importa: rendimiento real (CWV verdes), legibilidad, simplicidad, no over-engineer.

## Punto de entrada para una nueva sesión

Si llegas en frío:

1. `cat AGENTS.md` (este archivo).
2. `cat docs/index.md`.
3. `git status && git log --oneline -20` para ver el progreso.
4. Mira `docs/00-overview.md` para el alcance y la definición de «listo» (hitos M1–M8 ya cerrados).
5. Si el ingeniero acaba de pedirte algo, sigue el "Cómo razonar" de arriba.

Todo lo demás está en `/docs`. Esa carpeta es la fuente de verdad de las decisiones de este proyecto.
