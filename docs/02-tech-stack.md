# 02 · Tech stack

Versiones objetivo (las pinearemos en `package.json`). Cualquier upgrade mayor requiere actualizar este documento.

## Runtime

| Paquete | Versión objetivo | Por qué |
|---|---|---|
| `astro` | `^5.x` (latest stable) | View transitions nativas, content layer, server islands, mejor adapter Cloudflare. |
| `@astrojs/cloudflare` | `^11.x` | Adapter oficial para Cloudflare Pages/Workers. |
| `typescript` | `^5.x` strict | Type safety, sin `any` sin justificar. |
| `node` (local dev) | `>=20.10` | Requisito de Astro 5. |

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
| `@supabase/ssr` | `^0.5.x` | Helpers de SSR cookie-based para el backoffice futuro. |
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
| Satoshi | 400, 500, 700, 900 | Fontshare (descarga manual, licencia comercial gratuita) | `/public/fonts/satoshi/` |
| General Sans | 400, 500, 600, 700 | Fontshare | `/public/fonts/general-sans/` |
| JetBrains Mono | 400, 500 | Google Fonts (OFL) | `/public/fonts/jetbrains-mono/` |

Cargadas con `@font-face` desde `/src/styles/fonts.css`, con `font-display: swap` y `preload` solo para Satoshi 700 y General Sans 400 (las que aparecen above-the-fold).

## OG image dinámica

| Paquete | Versión | Notas |
|---|---|---|
| `satori` | `^0.10.x` | Render JSX → SVG. Compatible con Workers. |
| `@resvg/resvg-wasm` o `satori-wasm` | última | SVG → PNG sin dependencias nativas. Variante wasm compatible con Cloudflare. |

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
| Datos `.ts` estáticos → Supabase | Backoffice futuro, i18n con jsonb, edición sin redeploys manuales. |
| Sin lint → Biome | Garantizar consistencia entre sesiones (agentes, humano). |
| Adapter Vercel/none → Cloudflare | El sitio ya vive en Cloudflare y los proyectos personales también. |

Histórico de versiones del stack se registra en cada commit que actualice este documento.
