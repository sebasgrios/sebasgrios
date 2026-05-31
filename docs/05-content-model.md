# 05 · Content model

Mapa de lo que se renderiza en la home, qué es estático, qué es editable, qué se computa.

## Secciones (orden)

1. `Nav` (siempre arriba, fija)
2. `Hero` (badge + foto + título + lead + CTA + stat strip + badges flotantes)
3. `Experience` (sección **01 / Trayectoria**)
4. `Education` (sección **02 / Base académica**)
5. `Stack` (sección **03 / Herramientas**)
6. `Projects` (sección **04 / Trabajo propio**)
7. `Contact` (sección **05 / Contacto**)
8. `Footer`

Numeración de sección y eyebrow text son **parte del diseño**, no editables desde el backoffice. La label de cada sección sí es editable.

## Profile (singleton)

Tabla `profile` con un único row. Campos:

| Campo | Tipo | Editable | Visible en | Notas |
|---|---|---|---|---|
| `id` | `uuid` PK | — | — | |
| `fullName` | `text` | sí | Hero H1, footer | "Sebastián González Ríos" |
| `shortName` | `text` | sí | Nav brand | "Sebas" |
| `role` | `jsonb {es,en}` | sí | Hero | "Ingeniero de Software · Frontend" |
| `lead` | `jsonb {es,en}` | sí | Hero | Párrafo largo. |
| `statusLabel` | `jsonb {es,en}` | sí | Hero badge | "Abierto a propuestas" |
| `isOpenToWork` | `bool` | sí | Hero badge dot | Controla el punto verde animado. |
| `heroBadges` | `jsonb [{es,en}]` | sí | Hero badges flotantes | 2 badges típicamente. |
| `experienceStartDate` | `date` | sí | Hero stat "+N años" | Source of truth para años. |
| `avatarUrl` | `text` | sí | Nav avatar | URL Supabase Storage. |
| `photoUrl` | `text` | sí | Hero foto | URL Supabase Storage. |
| `email` | `text` | sí | Contact, footer | |
| `linkedinUrl` | `text` | sí | Hero CTA, footer | |
| `githubUrl` | `text` | sí | Hero CTA, footer | |
| `contactTitle` | `jsonb {es,en}` | sí | Contact | "¿Construimos algo juntos?" |
| `contactLead` | `jsonb {es,en}` | sí | Contact | Lead bajo el título. |
| `metaTitle` | `jsonb {es,en}` | sí | `<title>` | |
| `metaDescription` | `jsonb {es,en}` | sí | `<meta description>` | |
| `updatedAt` | `timestamptz` | auto | — | |

## Companies

Tabla `companies`. Cada empresa puede tener varios roles.

| Campo | Tipo | Notas |
|---|---|---|
| `id` | `uuid` PK | |
| `name` | `text` | "NTT DATA", "SearchIT" |
| `logoUrl` | `text` | Supabase Storage |
| `metaLine` | `jsonb {es,en}` | "Remoto · Málaga · 3 años 5 meses" — visible bajo el nombre |
| `sortOrder` | `int` | desc (más reciente primero) |
| `createdAt` | `timestamptz` | |

## Roles (positions)

Tabla `roles`. FK a `companies`.

| Campo | Tipo | Notas |
|---|---|---|
| `id` | `uuid` PK | |
| `companyId` | `uuid` FK | |
| `title` | `jsonb {es,en}` | "Ingeniero de Software" |
| `sector` | `jsonb {es,en}` | "Banca privada · FinTech" |
| `mode` | `jsonb {es,en}` | Label visible: "En remoto", "Presencial", "Híbrido". |
| `modeKey` | `'remote'\|'onsite'\|'hybrid'` | Enum estable para mapear al icono (`home`/`building`/`laptop`). Ver [docs/09-components.md](./09-components.md). |
| `startDate` | `date` | nullable end implícito por presencia de `endDate` |
| `endDate` | `date?` | null = "actualidad" |
| `description` | `jsonb {es,en}` | Párrafo. |
| `bullets` | `jsonb [{es,en}]` | Lista ordenada. |
| `sortOrder` | `int` | dentro de su company |
| `createdAt` | `timestamptz` | |

### Tags por rol

Tabla pivot `role_technologies` `(role_id, technology_id, sort_order)`.

## Education

Tabla `education`.

| Campo | Tipo | Notas |
|---|---|---|
| `id` | `uuid` PK | |
| `title` | `jsonb {es,en}` | "Desarrollo de Aplicaciones Web (DAW)" |
| `school` | `text` | No traducible. "IES Campanillas" |
| `startDate` | `date` | |
| `endDate` | `date?` | |
| `description` | `jsonb {es,en}` | |
| `bullets` | `jsonb [{es,en}]` | |
| `sortOrder` | `int` | desc |

### Tags por educación

Tabla pivot `education_technologies` `(education_id, technology_id, sort_order)`.

## Stack groups

Tabla `stack_groups`.

| Campo | Tipo | Notas |
|---|---|---|
| `id` | `uuid` PK | |
| `label` | `jsonb {es,en}` | "Frontend", "Mobile", "DevOps & Tooling" |
| `iconKey` | `text` | Referencia a `/src/components/icons/<Key>.astro`. Ej: `code`, `mobile`, `git`, `spark`, `chart`, `layers`. |
| `sortOrder` | `int` | |

### Items de stack group

Tabla pivot `stack_group_technologies` `(stack_group_id, technology_id, sort_order)`.

## Technologies

Tabla `technologies` (taxonomía reutilizable).

| Campo | Tipo | Notas |
|---|---|---|
| `id` | `uuid` PK | |
| `key` | `text` UNIQUE | slug estable: `typescript`, `react`, `astro`, `tailwindcss`... |
| `label` | `text` | "TypeScript". Generalmente no se traduce (nombres propios). |
| `iconKey` | `text?` | opcional, para mostrar logo en lugar de texto |
| `sortOrder` | `int` | |

## Projects

Tabla `projects`.

| Campo | Tipo | Notas |
|---|---|---|
| `id` | `uuid` PK | |
| `name` | `text` | "BastianGR" |
| `description` | `jsonb {es,en}` | |
| `imageUrl` | `text` | Supabase Storage |
| `liveUrl` | `text?` | |
| `codeUrl` | `text?` | null si privado o no aplica |
| `sortOrder` | `int` | |

### Tags por proyecto

Tabla pivot `project_technologies` `(project_id, technology_id, sort_order)`.

## Computed (no se almacena)

| Computado | Fórmula |
|---|---|
| Hero stat "+N años" | `floor((now - profile.experienceStartDate) / 1 year)` |
| Hero stat "N sectores" | `count(distinct roles.sector.es)` |
| Hero stat "N proyectos" | `count(projects)` |
| Company `metaLine` duración | Calculable, pero por ahora se edita manual (más libertad para textos como "3 años 5 meses"). |
| Role `when` ("ene 2025 — nov 2025") | Format desde `startDate`/`endDate` en el helper `formatDateRange(locale, start, end)`. |
| Footer "© year" | `new Date().getFullYear()` |

## Copy fijo en código

Strings que no van a BD por simplicidad y porque son parte del **chrome**:

- Eyebrows de sección: `Trayectoria`, `Base académica`, `Herramientas`, `Trabajo propio`, `Contacto` (es) y traducciones a en.
- Numeración: `01`, `02`, `03`, `04`, `05`.
- Status pill dot color (verde).
- Botones del hero: "Hablemos", "Let's talk".
- Footer: "Hecho con ♥ y mucho café", "Made with ♥ and lots of coffee".

Vive en `/src/config/copy.ts` como objeto tipado por locale. Si en el futuro hace falta editarlo desde el backoffice, se mueve a tabla `ui_copy`.

## Datos seed (M4)

Se migra desde:
- `src/data/site.ts`, `src/data/projects.ts`, `src/data/experiences.ts`, `src/data/technologies.ts` (v2).
- `data.jsx` del diseño (v3 — fuente nueva con companies/roles/sectores).
- `perfil_laboral.json` adjunto en el design archive (para datos finos).

El script de seed vive en `/supabase/seed.sql` y se aplica con `supabase db reset`.
