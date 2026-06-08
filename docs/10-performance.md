# 10 · Performance

## Objetivos (targets Lighthouse mobile slow 4G)

| Métrica | Target |
|---|---|
| LCP | < 2.0 s |
| CLS | 0 |
| INP | < 200 ms |
| TBT | < 100 ms |
| Lighthouse Performance | ≥ 95 |
| JS transferido | < 30 KB gzipped (incluye fonts CSS, sin contar Cloudflare Analytics) |

## Estrategias

### Rendering

- **Prerender** para `/` y `/en/`. Cero round-trip a Supabase en hot path.
- **SSR** solo para `/admin/**` (no impacta a visitantes).
- **Stale-while-revalidate** vía `Cache-Control: public, max-age=600, s-maxage=3600, stale-while-revalidate=86400` para páginas prerendered.
- **Edge caching** de Cloudflare por defecto activo.

### Invalidación

- El backoffice (`/admin/publish`) dispara un **Cloudflare Deploy Hook** para reconstruir tras editar contenido.
- Para el sembrado inicial (sin backoffice), cualquier cambio en el seed requiere `npm run build` + push (rebuild).

### Imágenes

- Servidas desde Supabase Storage con transformaciones (Image Transformations de Supabase) o vía `?width=...&format=webp`.
- **Implementado**: hero y proyectos usan `<Image>` de `astro:assets` (servicio `sharp` en build, `imageService: 'compile'`) → **webp** optimizado en `/_astro/` (hero `densities=[1,2]`; proyectos `widths=[400,800]` + `sizes`). Logos/avatar quedan como `<img>` (tamaño ínfimo). `sharp` es `devDependency` (solo build; runtime passthrough).
- `loading="lazy"` por defecto excepto hero (`loading="eager" fetchpriority="high"`).
- `srcset` con widths `[400, 800, 1200, 1600]` (proyectos), `[300, 600]` (avatar/logo), `[480, 720, 1080]` (hero).
- `aspect-ratio` siempre declarado en CSS para evitar CLS.

### Fuentes

- Self-host (ver [02-tech-stack](./02-tech-stack.md)).
- `font-display: swap` para todas.
- Preload solo la fuente del H1 (Satoshi Black, candidata a LCP) y el cuerpo (General Sans Regular):
  ```html
  <link rel="preload" href="/fonts/satoshi/Satoshi-Black.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/general-sans/GeneralSans-Regular.woff2" as="font" type="font/woff2" crossorigin>
  ```
- Subset Latin only (`.woff2` con `unicode-range U+0000-024F, U+1E00-1EFF, U+20A0-20CF`).

### JS

- Cero frameworks de UI runtime.
- 3 scripts deferred (ver [09-components](./09-components.md)).
- Sin polyfills (Cloudflare workers / modern browsers only).

### CSS

- Tailwind v4 con `@tailwindcss/vite` produce CSS optimizado.
- CSS crítico inline en `<head>` solo si Lighthouse lo pide en M7.
- `content-visibility: auto` en secciones: **evaluado y descartado**. Rompía la precisión de la navegación por anclas del nav (`#experience`…) porque los placeholders `contain-intrinsic-size` desajustaban el scroll al saltar entre secciones colapsadas. El beneficio en una página de 5 secciones cortas y estáticas no compensa; no se usa.

### Caché (Cloudflare)

`public/_headers`: `/fonts/*` immutable 1 año, `/og/*` cacheado, y `/` + `/en/` con `s-maxage=3600, stale-while-revalidate=86400` (edge cache + revalidación; el deploy hook refresca).

### HTML

- Sin comentarios HTML innecesarios.
- Minificación automática por adapter.

## Monitorización

- **Cloudflare Web Analytics**: RUM gratuito, sin cookies.
- En cada PR que toque renderizado, adjuntar Lighthouse Mobile en el body con diff vs baseline.

## Anti-patterns prohibidos

- `client:load` en cualquier sitio (forzaría hydration eager).
- Imágenes sin `width`/`height` o `aspect-ratio` (CLS).
- Backgrounds con `position: fixed` y `background-attachment: fixed` (jank en mobile).
- Animaciones que mueven layout (`width`, `height`, `top`...). Solo `transform` y `opacity`.
- Fonts CDN externos.
- Tracking scripts pesados (GA4, etc.).

## Presupuestos por sección (M3+)

| Sección | HTML bruto | Img | JS extra |
|---|---|---|---|
| Hero | ~3 KB | foto principal (≤ 80 KB webp) | parallax script (~1 KB) |
| Experience | ~8 KB | logos (≤ 5 KB c/u) | 0 |
| Education | ~5 KB | 0 | 0 |
| Stack | ~3 KB | 0 | 0 |
| Projects | ~5 KB | 4 capturas (~40 KB c/u) | 0 |
| Contact | ~2 KB | 0 | 0 |
