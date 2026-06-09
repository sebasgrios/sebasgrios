# 11 · Accessibility

Compromiso: **WCAG 2.2 AA**. Verificación manual + **axe-core automatizado** (`e2e/a11y.spec.ts`, claro y oscuro, `/` y `/en/`) y **Lighthouse CI** en cada PR.

## Reglas obligatorias

### Semántica

- Un único `<h1>` por página (el del Hero).
- Jerarquía heading sin saltos (`h1 → h2 → h3`).
- Landmarks: `<nav>` y `<footer>` como **hermanos** de `<main>` (navigation / main / contentinfo), nunca anidados dentro de `<main>` (slots `nav`/`footer` en `BaseLayout`). Cada `<section>` con `aria-labelledby` apuntando a su `<h2>`.
- `<a>` para navegación, `<button>` para acciones (no mezclar).

### Imágenes

- `alt` significativo para imágenes con contenido.
- `alt=""` + `aria-hidden="true"` para puramente decorativas.
- Avatares: `alt="Sebas"` (o nombre del owner).

### Contraste

- Light: `--text` sobre `--bg` = ratio mín 7:1; `--text-soft` mín 4.5:1.
- Dark: idem (verificar con la paleta oklch ya elegida).
- Accent sobre `--on-accent` mín 4.5:1.
- Tags y eyebrows (texto pequeño) deben mantener 4.5:1.

### Foco visible

- Outline custom global:
  ```css
  :focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 3px;
    border-radius: 6px;
  }
  ```
- Nunca `outline: none` sin reemplazo equivalente.

### Teclado

- Tab order natural: nav → hero CTAs → secciones en orden visual → footer.
- Burger nav cierra con `Escape` y devuelve foco al botón.
- Theme toggle accesible con `Enter`/`Space`, `aria-label="Cambiar tema"` (`Switch theme` en en).

### Anuncios

- Skip-link: primera línea del body, `class="sr-only focus:not-sr-only"`, salta a `#main`.
- `<main id="main" tabindex="-1">`.

## Movimiento

`prefers-reduced-motion: reduce` cancela:

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    transition-duration: 0.001ms !important;
  }
  .reveal { opacity: 1 !important; transform: none !important; }
}
```

JS:
- Parallax: el listener `mousemove` se registra **solo** si `!matchMedia('(prefers-reduced-motion: reduce)').matches`.
- Reveal-on-scroll: IO añade `.in` inmediatamente si reduced motion.

## Color scheme

- Respeta `prefers-color-scheme: dark` por defecto.
- Persistencia en `localStorage('sgr-theme')`: si el usuario eligió manualmente, mantiene su elección; si no, sigue al sistema.
- Cambios en system theme se reflejan en tiempo real (`matchMedia.addEventListener('change')`).

## Texto

- Tamaño base 16px (`html { font-size: 100% }`).
- `line-height: 1.6` body, `1.05` displays.
- `text-wrap: pretty` en `<p>` y `<h2>`.
- Máx 56-60ch para párrafos.

## ARIA

Usar mínimo necesario. Lo nativo prima sobre ARIA. Casos justificados:

- `aria-current="true"` en el nav link de la sección visible (scrollspy con `IntersectionObserver` en `effects.client.ts`; se aplica a los enlaces desktop y mobile).
- `aria-expanded` en burger.
- `aria-controls` en burger apuntando a `nav-mobile`.
- `aria-hidden="true"` en background blobs/noise y en iconos puramente decorativos dentro de botones que ya tienen label.

## Forms (backoffice, repo aparte)

> El portfolio público no tiene formularios; estas reglas aplican al backoffice (`sebasgrios-backoffice`).

- Cada `<input>` con `<label>` asociado (no placeholder-only).
- Errores con `aria-live="polite"` y `aria-invalid="true"` en el input.
- Submit con feedback (texto, no solo color).

## Checklist por componente

Cada componente que se cree pasa por:

- [ ] ¿Teclado lo navega?
- [ ] ¿Tiene label/alt accesible?
- [ ] ¿Contraste verificado en light y dark?
- [ ] ¿Funciona con reduced motion?
- [ ] ¿No rompe con zoom 200%?
- [ ] ¿Estructura semántica correcta?

## QA

- Lighthouse Accessibility ≥ 100.
- axe-core (Playwright) sin errores críticos.
- Test manual con teclado de cada release.
- Test con VoiceOver (mac) en hero + nav.
