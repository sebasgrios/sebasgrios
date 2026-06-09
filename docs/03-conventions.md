# 03 · Conventions

Reglas estrictas. Aplican a humanos y a agentes.

## Idioma

- **Código (identificadores, comentarios prohibidos, strings de logs)**: inglés.
- **Contenido visible al usuario**: español por defecto, inglés en `/en/`.
- **Documentación interna (`/docs`, `AGENTS.md`, `README.md`)**: español.
- **Commits, branches, PRs**: inglés.

## Naming

| Elemento | Convención | Ejemplo |
|---|---|---|
| Componente Astro | `PascalCase.astro` | `HeroBadge.astro` |
| Página Astro | `kebab-case.astro` | `index.astro`, `not-found.astro` |
| Carpeta | `kebab-case` | `src/lib/data-loaders/` |
| Variable, función, prop | `camelCase` | `loadHomeData`, `isOpenToWork` |
| Tipo, interface, clase | `PascalCase` | `HomeViewModel` |
| Constante "verdadera" (literal, no objeto) | `SCREAMING_SNAKE_CASE` | `DEFAULT_LOCALE` |
| Tabla SQL | `snake_case` | `stack_groups` |
| Columna SQL | `snake_case` | `is_open_to_work` |
| Campo en TS (mapeado desde SQL) | `camelCase` | `isOpenToWork` |
| Archivo SQL migración | `NNNN_kebab-description.sql` | `0001_initial-schema.sql` |

> **Nota**: Astro convención es PascalCase para componentes y kebab-case para páginas. SQL es snake_case por convención Postgres. El mapper en `/src/lib/data` convierte snake_case ↔ camelCase.

## Estilo de código

- **TypeScript strict** (`strict: true`, `noUncheckedIndexedAccess: true`).
- **Sin comentarios** en código de aplicación, salvo: invariante no obvia, workaround documentado, o referencia a un bug externo. Nunca explicar el "qué".
- **Sin `any`**. Si es inevitable, `unknown` + narrowing.
- **Sin `console.log`** en código de producción. Usar el logger del worker.
- **Sin abreviaturas** salvo aceptadas (`url`, `id`, `db`, `api`).
- Funciones puras siempre que sea posible. Side-effects aislados en `/src/lib/data`.
- Early returns sobre `else` anidados.
- Imports ordenados (Biome lo enfuerza): node builtins → externos → internos `@/` → relativos.

## Path alias

- `@/*` apunta a `src/*` (configurado en `tsconfig.json` y `astro.config.mjs`).
- Nunca imports relativos profundos (`../../../`). Usar `@/`.

## Commits

Formato: **`<emoji> <subject imperativo en inglés>`**, subject ≤ 72 chars, sin `Co-Authored-By` trailer, **sin prefijo de tipo textual** (`feat:`, `fix:`, `docs:`...). El emoji **es** la categoría.

Tabla de emojis — fuente autoritativa: [Conventional Commits Emoji (parmentf gist)](https://gist.githubusercontent.com/parmentf/359667bf23e08a1bd8241fbf47ecdef0/raw/b47d3790f5a334c66d1bac05e31320a3953f750e/ConventionalCommitsEmoji.md). Esta es la tabla **exacta** que aplicamos en este repo:

| Type | Emoji | Code | Description |
|---|---|---|---|
| `feat` | ✨ | `:sparkles:` | New features |
| `fix` | 🐛 | `:bug:` | Bug fixes |
| `docs` | 📚 | `:books:` | Documentation updates |
| `style` | 💎 | `:gem:` | Code style changes |
| `refactor` | 🔨 | `:hammer:` | Code refactoring |
| `perf` | 🚀 | `:rocket:` | Performance improvements |
| `test` | 🚨 | `:rotating_light:` | Test additions or updates |
| `build` | 📦 | `:package:` | Build system changes |
| `ci` | 👷 | `:construction_worker:` | CI/CD configuration changes |
| `chore` | 🔧 | `:wrench:` | Maintenance tasks |

> `revert` no aparece en el gist. Si necesitamos revertir, usaremos `git revert` (que ya genera "Revert ...") sin emoji adicional, o `🔧 revert <commit>` como `chore`.

Ejemplos válidos:
```
✨ add floating badges and status pill to hero
🐛 fix es fallback when en translation is missing
📚 describe stack groups RLS policies
🔨 extract row-to-domain mapper in repos
🚀 lazy-load below-the-fold project images
📦 add @astrojs/sitemap integration
👷 add github actions workflow for build
🔧 bump astro from 5.18 to 5.19
🚨 add tests for pickLocale fallback
💎 reformat all files with biome
```

Ejemplos **inválidos** (no usar):
```
✨ feat(hero): add floating badges        ← sin prefijo textual
✨ feat: add floating badges               ← sin prefijo textual
✨ Added floating badges.                  ← imperativo, sin punto
```

Subject **imperativo** ("add", no "added"/"adds"), sin punto final, sin emojis adicionales dentro del subject (solo el inicial). Si necesitas contexto, ponlo de forma natural en el propio subject ("add badges to hero") en lugar de scope entre paréntesis.

## Branching

- `main` — producción (`sebasgrios.es`).
- `develop` — integración y rama de trabajo.

Flujo (ver [15-workflows](./15-workflows.md)):

```
work commits ─▶ develop ─PR─▶ main
```

`develop` puede recibir commits directos; los cambios grandes van por rama de feature → PR a `develop`. A `main` solo se llega por PR. La rama `v3` de la reescritura se mergeó y eliminó tras el release de v3.0.0 (existe el tag `v3.0.0`).

Histórico: 2026-06-08 — v3.0.0 desplegada a producción y eliminada la rama `v3`. El flujo pasa de `v3 → develop → main` a `develop → main`.

## Pull Requests

- Título: igual formato que commit (`✨ <subject>`, sin prefijo textual).
- Cuerpo: secciones `## Summary` y `## Test plan`.
- Adjuntar capturas si hay cambio visual.
- Lighthouse local en el body si toca rendimiento.
- Si toca contrato (schema, viewModel, repos), incluir checklist de docs actualizadas.

## Code review / autoreview previo a commit

Antes de cualquier commit:
1. `npm run check` (astro check + biome check).
2. `npm test` si hay lógica testeada.
3. `npm run build` no falla.
4. Verificación visual en `npm run dev` si toca UI.
5. Documentación actualizada si toca contrato.

## Migraciones SQL

- Archivos numerados secuencialmente en `/supabase/migrations/NNNN_descripcion.sql`.
- Nunca editar una migración ya merged; añadir una nueva.
- Cada migración debe ser idempotente cuando sea posible (`IF NOT EXISTS`).
- Cada migración que añada una tabla debe incluir su `RLS` y políticas en el mismo archivo.

## Seguridad

- **Secretos** nunca en repo. `.env.local` ignorado por git (ya está en `.gitignore`).
- Variables públicas: prefijo `PUBLIC_` (Astro las expone al cliente).
- Secretos (p. ej. service-role key) solo en variables de entorno del servicio que los use, jamás en cliente, jamás en logs.
- Validar **toda** input externa (formularios, query params) con Zod.

## Accesibilidad obligatoria

- Todo `<img>` con `alt` significativo (o `alt=""` si decorativa + `aria-hidden`).
- Todo `<button>` y `<a>` con label accesible.
- Todo control interactivo navegable por teclado (`Tab`, `Enter`, `Esc`).
- Contraste AA mínimo en light y dark.
- Respeto a `prefers-reduced-motion` y `prefers-color-scheme`.
