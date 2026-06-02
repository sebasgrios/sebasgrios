# 09 · Components

Catálogo. Todos son `.astro` salvo nota en contrario.

> **Estado de implementación.** Las **secciones** (`Hero`, `Experience`, `Education`, `Stack`, `Projects`, `Contact`, `Footer`) son **un único fichero `.astro` cada una**, con su markup inline. No existen como ficheros separados los sub-componentes que antes se anticipaban aquí (`HeroBadge`, `HeroPhoto`, `StatCard`, `CompanyBlock`, `ProjectCard`, `StackCard`, `EducationCard`, `NavMobile`…): su HTML vive inline dentro de la sección. Los componentes reutilizables que **sí** existen como fichero son: `Glass`, `Button`, `IconButton`, `Tag`, `TechIcon`, `SectionHead`, `RoleCard`, `Nav`, `LocaleSwitch`, `ThemeToggle`, `BgField`, `BgNoise` y los iconos en `icons/`.

## Layouts

### `BaseLayout.astro`

Props:
```ts
{
  title: string;
  description: string;
  locale: Locale;
  canonical?: string;
  ogImage?: string;
  ogImageAlt?: string;
  personName?: string;   // habilita el nodo Person del JSON-LD
  personRole?: string;
  noindex?: boolean;     // robots noindex + omite hreflang/JSON-LD
}
```

Responsabilidades:
- Renderiza `<html><head><body>` y todo el SEO del `<head>` (ver [08-routing-pages](./08-routing-pages.md)).
- Inyecta anti-flash theme script (inline) y carga `globals.css` (que a su vez importa `fonts.css`).
- Pinta `<BgField/>`, `<BgNoise/>`, el skip-link y `<main id="main">` con el `<slot/>`.
- Carga `effects.client.ts` (reveal/parallax/specular) e inyecta el snippet de Cloudflare Web Analytics en prod.

> El `Nav` y el `Footer` **no** los pinta el layout: cada **página** (`index.astro`, `en/index.astro`) los incluye explícitamente alrededor de las secciones.

## Background

### `BgField.astro` / `BgNoise.astro`

Fijos, `aria-hidden`, zero JS.

## Glass primitive

### `Glass.astro`

Props:
```ts
{
  as?: keyof HTMLElementTagNameMap;   // default 'div'
  interactive?: boolean;              // default false
  class?: string;
}
```

- `interactive=true` añade clase `interactive` y, en el cliente, un `<script>` por componente que registra `mousemove` y actualiza `--mx/--my`. Para mantener zero-JS por defecto, este script solo se carga si `interactive=true`.
- Slot `<slot/>` para children.

### `GlassInteractive` (variant)

Si el script global de specular se vuelve costoso al haber muchas instancias, lo migramos a un `IntersectionObserver` único que delega a un único handler.

## Sección: Nav

### `Nav.astro`

- Glass pill fijo arriba.
- Brand (avatar + short name).
- Links (Experience, Education, Stack, Projects, Contact) — traducidos.
- Theme toggle (icon button con sun/moon).
- Burger en mobile (≤720px).
- JS: theme toggle, burger toggle. Encapsulado en `<script>` al final.

### `NavMobile.astro`

Render condicional bajo `Nav` cuando `open=true`. Recibe los mismos links.

### `LocaleSwitch.astro`

Mini link `ES / EN`. Mantiene anchor.

## Sección: Hero

### `Hero.astro`

Compone:
- `<HeroBadge/>` (status pill "Abierto a propuestas")
- `<HeroPhoto/>` (foto + 2 `<FloatBadge/>`)
- `<HeroMain/>` (H1, role, lead, CTA buttons, `<StatStrip/>`)

### `HeroBadge.astro`

Glass pill pequeño. Dot animado (`pulse` keyframes) si `isOpenToWork`.

### `HeroPhoto.astro`

Glass con foto. JS opcional de parallax (`mousemove` → `transform: translate3d`). Respeta `prefers-reduced-motion`.

Props: `{ src: string; alt: string; floatBadges: FloatBadgeData[] }`.

### `FloatBadge.astro`

Pequeño tag posicionado absoluto sobre la foto. Glass-less (color-mix con bg para no apilar blur).

### `StatStrip.astro`

3 `<StatCard/>` con números computados.

### `StatCard.astro`

Glass card. Number con gradient text (accent → accent rotated hue).

## Sección: Experience

### `Experience.astro`

Recibe `companies: CompanyWithRoles[]`. Itera y monta `<CompanyBlock/>` por cada.

### `CompanyBlock.astro`

- Cabecera: `<CompanyLogo/>` + name + meta line.
- Lista de `<RoleCard/>`. Si una empresa tiene 1 sólo rol, layout sin línea vertical; si tiene >1, layout timeline con línea + nodo.

### `RoleCard.astro`

Glass card. Top: title + when. Sub: sector (icono `layers`) + mode (icono según `modeKey`, ver tabla más abajo). Descripción. Bullets `<ul>`. Tags `<Tag/>[]`.

**Mapeo `modeKey` → icono**:

| `modeKey` | Etiqueta (es) | Etiqueta (en) | Icono |
|---|---|---|---|
| `remote` | Remoto | Remote | `home` |
| `onsite` | Presencial | On-site | `building` |
| `hybrid` | Híbrido | Hybrid | `laptop` |

El campo `mode` localizado de `roles` se usa como **label visible**; el campo `modeKey` (enum) se usa para elegir el icono.

### `CompanyLogo.astro`

Glass mini cuadrada con `<img>` del logo.

## Sección: Education

### `Education.astro`

Igual layout que un single-company de Experience pero con `EducationCard` (la diferencia: `school` con icono `pin`, no hay sector/mode).

### `EducationCard.astro`

Glass card. Mismo aspecto que RoleCard pero sin `mode`.

## Sección: Stack

### `Stack.astro`

Grid `repeat(auto-fit, minmax(230px, 1fr))`. Itera `<StackCard/>`.

### `StackCard.astro`

Glass card. Head: icon en círculo + label. Body: tags.

## Sección: Projects

### `Projects.astro`

Grid 2 columnas (1 en mobile). Itera `<ProjectCard/>`.

### `ProjectCard.astro`

Glass card. Media `<a>` con `<img>` + overlay (gradient). Body: name, description, tags, links (Live / Code).

## Sección: Contact

### `Contact.astro`

Glass card centered, ancho `820px max`. Eyebrow "05 / Contacto". H2 con gradient en la palabra accent. Lead. CTAs (mailto + linkedin + github).

## Footer

### `Footer.astro`

Border-top hairline. Copy + iconos sociales.

## Atomicos

### `Button.astro`

Variantes: `primary | ghost`. Recibe `href` y children.

### `IconButton.astro`

Circular icon button, 40×40. Hover rotación -12deg + escala.

### `Tag.astro`

JetBrains Mono pequeño (`tag-pill`), border hairline. Recibe `slug` para tomar el color de marca de la tecnología.

### `TechIcon.astro`

Logo SVG inline de una tecnología (registro en `/src/lib/icons/techIconRegistry.ts`, basado en `simple-icons`). Tooltip con el label (CSS, `::after`), accesible con `role="img"` + `aria-label` y `tabindex="0"`. Si no hay icono para el `slug`, cae a un `Tag` con el texto.

### `SectionHead.astro`

`{ num: string; eyebrow: string; title: string; sub?: string; id?: string }`. Pinta eyebrow numerado + h2 + sub.

## Iconos

Componentes individuales en `/src/components/icons/`. Reutilizables:

| Key | Componente | Uso |
|---|---|---|
| `sun` | `Sun.astro` | theme toggle (dark active) |
| `moon` | `Moon.astro` | theme toggle (light active) |
| `arrow` | `Arrow.astro` | botones primary |
| `arrowUp` | `ArrowUp.astro` | nav burger close |
| `github` | `GitHub.astro` | CTAs, footer |
| `linkedin` | `LinkedIn.astro` | CTAs, footer |
| `mail` | `Mail.astro` | contacto |
| `code` | `Code.astro` | stack frontend, burger open |
| `mobile` | `Mobile.astro` | stack mobile |
| `git` | `Git.astro` | stack devops |
| `spark` | `Spark.astro` | stack IA |
| `chart` | `Chart.astro` | stack analítica |
| `layers` | `Layers.astro` | role sector / stack CMS |
| `pin` | `Pin.astro` | education school |
| `play` | `Play.astro` | project live |
| `home` | `Home.astro` | role mode `remote` |
| `building` | `Building.astro` | role mode `onsite` |
| `laptop` | `Laptop.astro` | role mode `hybrid` |

Cada uno acepta props `class`, `width`, `height` (default 24).

## JS cliente (mínimo)

Piezas JS reales en el sitio público:

1. **Anti-flash theme** — inline en `<head>` de `BaseLayout.astro`, < 1 KB.
2. **Theme toggle** — `<script>` inline en `ThemeToggle.astro` (lee/escribe `localStorage('sgr-theme')`, escucha `matchMedia change`).
3. **Burger nav** — `<script>` inline en `Nav.astro` (toggle `aria-expanded`/`data-open`, cierre con `Escape`).
4. **Reveal-on-scroll + parallax hero + specular** — `/src/scripts/effects.client.ts`, cargado por `BaseLayout`. Único `IntersectionObserver` global; respeta `prefers-reduced-motion` y `hover/pointer`.

No existe `nav.client.ts`: el JS de nav y theme vive inline en sus componentes. Todos los scripts se re-enganchan en `astro:after-swap`.

Total JS objetivo: **< 5 KB** gzipped.
