# 02 · Tech stack

Versiones objetivo (las pinearemos en `package.json`). Cualquier upgrade mayor requiere actualizar este documento.

## Runtime

| Paquete | Versión objetivo | Por qué |
|---|---|---|
| `astro` | `^5.x` (latest stable) | View transitions nativas, content layer, server islands, mejor adapter Cloudflare. |
| `@astrojs/cloudflare` | `^12.x` | Adapter oficial para Cloudflare Pages/Workers. |
| `typescript` | `^5.x` strict | Type safety, sin `any` sin justificar. |
| `node` (local dev) | `>=22.0` (LTS activo, `.nvmrc=22`) | Requisito de Astro 5 + Cloudflare Workers compat. |

## Estilo

| Paquete | Versión | Notas |
|---|---|---|
| `tailwindcss` | `^4.x` | Con `@tailwindcss/vite`. Sin `tailwind.config.js`; tokens en CSS `@theme`. |
| `@tailwindcss/vite` | `^4.x` | Plugin Vite oficial. |
| Variables CSS | nativas | Glass, accent hue, easings se exponen como `--var`. |

## Datos

| Paquete | Versión | Notas |
|---|---|---|
| `@supabase/supabase-js` | `^2.x` | Cliente oficial. Server-only. |
| `@supabase/ssr` | `^0.5.x` | Cliente SSR cookie-based del backoffice (auth admin, mutaciones, Storage). |
| Supabase CLI | `>=1.200` | Migraciones, tipos. Instalada vía Homebrew, no en `devDependencies`. |

## Tooling

| Paquete | Versión | Notas |
|---|---|---|
| `@biomejs/biome` | `^1.9.x` | Lint + format en una sola herramienta. Reemplaza ESLint + Prettier. |
| `vitest` | `^2.x` | Unit tests. |
| `@playwright/test` | `^1.4x` | E2E. Instalado pero suite mínima hasta backoffice. |
| `@astrojs/check` | `^0.9.x` | `astro check` en CI. |

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
| `satori` | `^0.26.x` | Render JSX-like → SVG. Compatible con Workers. |
| `@resvg/resvg-wasm` | `^2.6.x` | SVG → PNG vía WASM. Compatible con Cloudflare Workers. |

Endpoint en `src/pages/og/[locale].png.ts` con `prerender = true` → genera `/og/es.png` y `/og/en.png` en build (sin coste runtime; `/og/*` queda excluido del worker en `_routes.json`). La fuente Inter está **self-hosteada** en `src/assets/og/inter-latin-500.ttf` y se lee del disco con `node:fs` en build (sin red, sin CDN).

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
| Astro 4 → 5 | View transitions + server islands + adapter Cloudflare estable. |
| Tailwind 3 → 4 | Configuración por CSS, mejor DX, `@theme` y `@utility`. |
| Datos `.ts` estáticos → Supabase | Backoffice, i18n con jsonb, edición sin tocar código. |
| Sin lint → Biome | Garantizar consistencia entre sesiones (agentes, humano). |
| Adapter Vercel/none → Cloudflare | El sitio ya vive en Cloudflare y los proyectos personales también. |

Histórico de versiones del stack se registra en cada commit que actualice este documento.
