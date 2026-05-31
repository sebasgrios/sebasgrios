# 04 · Design system

Sistema de diseño "Liquid Glass" — derivado del diseño aprobado. Todos los tokens viven en CSS `@theme` (Tailwind v4) y se referencian con variables CSS. Las decisiones de tweaks están **fijas** (sin UI de usuario).

## Tweaks fijos `[DECIDIDO]`

| Tweak | Valor | Por qué |
|---|---|---|
| Glass intensity | `0.10` (10%) | Look discreto, mejor legibilidad. |
| Accent | `oklch(L C 264)` (azul) | Decisión del ingeniero. Hue 264. |
| Parallax con cursor | `true` (respetando `prefers-reduced-motion`) | Aporta vida al hero. |
| Animaciones de entrada | `true` (respetando `prefers-reduced-motion`) | Reveal-on-scroll discreto. |

Sin panel de tweaks en UI. Los valores se inyectan en build desde `/src/config/tweaks.ts`.

## Color tokens

Color en `oklch()` para gradientes perceptualmente uniformes y soporte sólido en navegadores modernos.

### Variables raíz

```css
:root {
  --accent-h: 264;             /* hue azul */
  --accent-c: 0.19;            /* chroma */
  --glass-intensity: 0.10;     /* 10% */

  --glass-blur: 4.6px;         /* 2 + intensity*26 */
  --glass-saturate: 1.19;      /* 1.1 + intensity*0.9 */
  --glass-alpha: 0.36;         /* 0.32 + intensity*0.42 */
  --glass-highlight: 0.31;     /* 0.25 + intensity*0.6 */
  --glass-spec: 0.21;          /* 0.15 + intensity*0.55 */

  --radius: 22px;
  --radius-sm: 14px;
  --maxw: 1120px;

  --ease: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}
```

### Light (default)

```css
:root, [data-theme="light"] {
  --bg:        oklch(0.985 0.004 285);
  --bg-2:      oklch(0.955 0.006 285);
  --text:      oklch(0.20  0.012 285);
  --text-soft: oklch(0.46  0.012 285);
  --text-faint:oklch(0.62  0.010 285);
  --border:    oklch(0.88  0.008 285 / 0.9);
  --hairline:  oklch(0.80  0.010 285 / 0.6);

  --accent:        oklch(0.58 var(--accent-c) var(--accent-h));
  --accent-bright: oklch(0.66 var(--accent-c) var(--accent-h));
  --accent-soft:   oklch(0.70 0.12 var(--accent-h) / 0.16);
  --on-accent:     oklch(0.99 0.01 285);

  --glass-bg:     oklch(1 0 0 / var(--glass-alpha));
  --glass-border: oklch(1 0 0 / 0.85);
  --glass-edge:   oklch(0.30 0.02 285 / 0.08);
  color-scheme: light;
}
```

### Dark

```css
[data-theme="dark"] {
  --bg:        oklch(0.155 0.012 285);
  --bg-2:      oklch(0.200 0.014 285);
  --text:      oklch(0.965 0.004 285);
  --text-soft: oklch(0.720 0.012 285);
  --text-faint:oklch(0.550 0.012 285);
  --border:    oklch(0.40  0.014 285 / 0.5);
  --hairline:  oklch(0.50  0.014 285 / 0.35);

  --accent:        oklch(0.78 0.16 var(--accent-h));
  --accent-bright: oklch(0.84 0.15 var(--accent-h));
  --accent-soft:   oklch(0.70 0.16 var(--accent-h) / 0.20);
  --on-accent:     oklch(0.16 0.02 285);

  --glass-bg:     oklch(1 0 0 / calc(var(--glass-alpha) * 0.14));
  --glass-border: oklch(1 0 0 / 0.14);
  --glass-edge:   oklch(1 0 0 / 0.06);
  color-scheme: dark;
}
```

## Tipografía

| Rol | Familia | Peso | Uso |
|---|---|---|---|
| Display / H1-H3 | Satoshi | 700, 900 | Hero, section titles, stat numbers. |
| Body | General Sans | 400, 500, 600 | Párrafos, navegación, UI. |
| Mono / eyebrow | JetBrains Mono | 400, 500 | Eyebrows ("01 / Trayectoria"), `role-when`, `tag`. |

- `font-feature-settings: "ss01"` en JetBrains Mono.
- `font-synthesis: none` global para evitar fakes.
- `text-rendering: optimizeLegibility`.
- Tamaños con `clamp()` para fluidez:
  - H1 hero: `clamp(2.6rem, 7vw, 5rem)`, peso 900, `letter-spacing -0.02em`.
  - H2 section: `clamp(1.9rem, 4.5vw, 3rem)`.
  - Lead: `1.1rem` con `max-width: 48ch`.
  - Eyebrow: `0.72rem`, `letter-spacing 0.22em`, uppercase.

## Layout

- Contenedor: `width: 100%; max-width: 1120px; padding-inline: clamp(20px, 4vw, 32px);`.
- Section padding vertical: `clamp(64px, 9vw, 130px)`.
- Scroll margin top: `clamp(0px, calc(112px - 9vw), 60px)` para compensar nav fijo.
- Gap entre tarjetas en grids: `16-20px`.

## Glass primitive

Componente `Glass.astro` con prop `interactive: boolean`. Estructura:

```css
.glass {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  border: 1px solid var(--glass-border);
  border-radius: var(--radius);
  box-shadow: var(--glass-shadow),
              inset 0 1px 0 0 var(--glass-border),
              inset 0 0 0 1px var(--glass-edge);
  overflow: hidden;
  isolation: isolate;
}
/* ::before = top sheen lineal */
/* ::after  = cursor specular (radial-gradient) — solo si interactive */
```

- `interactive=true`: hover translates -4px, accent border, specular activo. Solo en componentes con `client:visible` para JS del cursor.
- `interactive=false`: estático, sin JS.

## Sombras

```
--glass-shadow:
  0 18px 50px -18px oklch(0.3 0.04 285 / 0.28),
  0 2px 8px -2px oklch(0.3 0.04 285 / 0.12);
```

Dark mode usa sombras más profundas (`-22px`, `0/0`).

## Background atmosférico

- 3 `bg-blob` posicionados con `position: fixed; z-index: -2; filter: blur(90px);` con gradientes radiales alrededor del accent.
- `bg-noise`: SVG turbulence inline, `opacity: 0.4`, `mix-blend-mode: overlay`.
- Ambos `aria-hidden`.

## Botones

- `.btn` base: pill rounded (999px), padding `13px 22px`, font 600.
- `.btn-primary`: fondo `--accent`, color `--on-accent`, sombra accent.
- `.btn-ghost`: fondo glass, border `--glass-border`, hover acenta el borde.

## Tags y pills

- `.tag`: JetBrains Mono `0.74rem`, padding `5px 11px`, border `--hairline`, hover translates -2px y cambia border a accent.
- `.pill`: similar pero family General Sans.

## Iconos

- 24×24 viewBox, `stroke="currentColor"`, `stroke-width="1.9"`, `stroke-linecap="round"`, `stroke-linejoin="round"`.
- Cada icono en `/src/components/icons/<Name>.astro` como SVG inline. Zero JS.

## Movimiento

### Reveal on scroll

```css
.reveal { opacity: 0; transform: translateY(28px);
  transition: opacity 0.8s var(--ease-out), transform 0.8s var(--ease-out); }
.reveal.in { opacity: 1; transform: none; }
.reveal.d1 { transition-delay: 0.08s; }
.reveal.d2 { transition-delay: 0.16s; }
.reveal.d3 { transition-delay: 0.24s; }
```

Implementación: `IntersectionObserver` en un único `<script>` shared (no por componente). Threshold ≈ vp 90%. Si `prefers-reduced-motion: reduce`, `.reveal` se marca `.in` al cargar.

### Parallax hero photo

Listener `mousemove` con factor `±14px` aplicado al inner foto. Throttle con `requestAnimationFrame`. Deshabilitado si `prefers-reduced-motion: reduce`.

### Transitions globales

- Theme switch: `background 0.5s var(--ease), color 0.5s var(--ease)`.
- Hover glass interactivo: `transform 0.5s, box-shadow 0.5s, border-color 0.4s`.

## Breakpoints

| Breakpoint | Ancho | Cambios principales |
|---|---|---|
| desktop default | `> 940px` | Hero 2 columnas (texto + foto), proyectos 2 columnas. |
| tablet | `≤ 940px` | Hero stack vertical (badge → foto → texto), proyectos 1 col. |
| mobile | `≤ 720px` | Nav burger, foto hero más pequeña, padding `roles` 22px. |
| small mobile | `≤ 460px` | Padding contenedor 18px, `role-when` ocupa línea completa. |

## Theming

- Storage key: `sgr-theme` (compatible con el script anti-flash del diseño).
- Anti-flash: script inline en `<head>` antes de cualquier CSS, lee `localStorage` o `prefers-color-scheme`, fija `data-theme` en `<html>`.
- Toggle: botón en nav, emite custom event para actualizar storage.

## Accent fijo

`--accent-h: 264` (azul). No hay UI para cambiarlo. Si se decide cambiar en el futuro, basta editar `/src/config/tweaks.ts`.

## Componentes derivados (alta nivel)

| Componente | Glass | Animación | JS cliente |
|---|---|---|---|
| `Nav` | sí, no interactive | — | sí (burger toggle, theme toggle) |
| `HeroPhoto` | sí, interactive | parallax | sí (mousemove) |
| `RoleCard` | sí, interactive | reveal | no (IO global) |
| `StackCard` | sí, interactive | reveal | no |
| `ProjectCard` | sí, interactive | reveal | no |
| `ContactCard` | sí, no interactive | reveal | no |
| `StatCard` | sí, no interactive | reveal | no |
| `FloatBadge` | sí, no interactive | — | no |

## Lo que NO usar

- Sombras coloridas fuera del accent (mantener coherencia).
- Animaciones de >800ms (excepto theme).
- Border radius fuera del set (`22px`, `14px`, `999px`, `13px`/`10px` para iconos cuadrados).
- Otros pesos de fuente fuera de los listados.
- Otras familias tipográficas.
