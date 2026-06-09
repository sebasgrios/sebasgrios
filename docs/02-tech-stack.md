# 02 · Tech stack

Versiones objetivo (las pinearemos en `package.json`). Cualquier upgrade mayor requiere actualizar este documento.

## Runtime

| Paquete | Versión objetivo | Por qué |
|---|---|---|
| `astro` | `^6.x` (latest stable) | View transitions nativas, content layer, CSP estable. |
| `typescript` | `^6.x` strict | Type safety, sin `any` sin justificar. |
| `node` (local dev) | `>=22.0` (LTS activo, `.nvmrc=22`) | Requisito de Astro 6. |

## Estilo

| Paquete | Versión | Notas |
|---|---|---|
| `tailwindcss` | `^4.x` | Con `@tailwindcss/vite`. Sin `tailwind.config.js`; tokens en CSS `@theme`. |
| `@tailwindcss/vite` | `^4.x` | Plugin Vite oficial. |
| Variables CSS | nativas | Glass, accent hue, easings se exponen como `--var`. |

## Datos

| Paquete | Versión | Notas |
|---|---|---|
| `@supabase/supabase-js` | `^2.x` | Cliente oficial. Solo lectura, en build. |
| Supabase CLI | `>=1.200` | Migraciones, tipos. Instalada vía Homebrew, no en `devDependencies`. |

## Tooling

| Paquete | Versión | Notas |
|---|---|---|
| `@biomejs/biome` | `^2.x` | Lint + format en una sola herramienta. Reemplaza ESLint + Prettier. |
| `vitest` | `^4.x` | Unit tests. |
| `@playwright/test` | `^1.4x` | E2E. Smoke público (`public`, `theme`) + a11y (`a11y` con axe). |
| `@axe-core/playwright` | `^4.x` | Auditoría a11y automatizada (WCAG A/AA) en `e2e/a11y.spec.ts`. |
| `@lhci/cli` | `^0.15.x` | Lighthouse CI (perf/a11y/SEO/best-practices) en PRs. |
| `@astrojs/check` | `^0.9.x` | `astro check` en CI. |
| `sharp` | `^0.34.x` | devDependency; optimización de imágenes de `astro:assets` en build (webp). |

## Fuentes (self-host)

| Familia | Pesos | Origen | Carpeta |
|---|---|---|---|
| Satoshi | 400, 500, 700, 900 | Fontshare (subset Latin, licencia ITF gratuita) | `/public/fonts/satoshi/` |
| General Sans | 400, 500, 600, 700 | Fontshare (subset Latin) | `/public/fonts/general-sans/` |
| JetBrains Mono | variable | `@fontsource-variable/jetbrains-mono` (npm, OFL) | importada en `fonts.css` |

Satoshi y General Sans se cargan con `@font-face` desde `/src/styles/fonts.css`, con `font-display: swap` y `preload` (en `BaseLayout.astro`) solo para **Satoshi 900** (H1, candidata a LCP) y **General Sans 400** (cuerpo). JetBrains Mono se importa como fuente variable vía el paquete fontsource, no desde `public/`.

## OG image dinámica

| Paquete | Versión | Notas |
|---|---|---|
| `satori` | `^0.26.x` | Render JSX-like → SVG, en build. |
| `@resvg/resvg-wasm` | `^2.6.x` | SVG → PNG vía WASM; el `.wasm` se lee con `node:fs` en build. |

Endpoint en `src/pages/og/[locale].png.ts` con `prerender = true` + `getStaticPaths` → genera `/og/es.png` y `/og/en.png` en build como ficheros estáticos (sin coste runtime). El `.wasm` de resvg y la fuente Inter (`src/assets/og/inter-latin-500.ttf`, self-hosteada) se leen del disco con `node:fs` en build (sin red, sin CDN).

## Analytics

- **Cloudflare Web Analytics**: snippet inyectado solo en producción, sin cookies. Sin paquete npm.

## Lo que NO usamos

- React/Vue/Solid en runtime. Cero islands de frameworks pesados.
- ESLint, Prettier (sustituidos por Biome).
- Prisma/Drizzle (queries supabase-js directas con repos).
- Tailwind plugins de terceros si se puede evitar.
- Headless UI / Radix / shadcn — implementamos los componentes nosotros sobre el design system.

## Justificación de cambios vs. v1

| Cambio | Por qué |
|---|---|
| Astro 4 → 5 | View transitions + server islands + content layer. |
| Tailwind 3 → 4 | Configuración por CSS, mejor DX, `@theme` y `@utility`. |
| Datos `.ts` estáticos → Supabase | Backoffice, i18n con jsonb, edición sin tocar código. |
| Sin lint → Biome | Garantizar consistencia entre sesiones (agentes, humano). |
| Hosting → Cloudflare Pages (estático) | El sitio ya vive en Cloudflare; se sirve como estático, sin adapter SSR. |

Histórico de versiones del stack se registra en cada commit que actualice este documento.
