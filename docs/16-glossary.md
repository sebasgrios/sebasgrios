# 16 · Glossary

Términos del dominio del portfolio.

| Término | Definición |
|---|---|
| **Profile** | Singleton con los datos del propio ingeniero (nombre, role, lead, contactos, hero stats config). Tabla `profile`. |
| **Company** | Empresa donde el ingeniero ha trabajado. Puede tener uno o varios `roles`. Tabla `companies`. |
| **Role** (position) | Puesto concreto dentro de una company, con título, sector, modo, fechas, descripción y bullets. Tabla `roles`. |
| **Sector** | Etiqueta de industria dentro de un rol ("Banca privada · FinTech"). Es localized jsonb dentro de `roles.sector`. |
| **Mode** | Modalidad de trabajo del rol ("En remoto", "Híbrido"). Localized. |
| **Bullets** | Lista ordenada de puntos clave dentro de un rol o entry de educación. Array localizado. |
| **Education** | Formación reglada. Tabla `education`. |
| **Stack group** | Categoría de tecnologías ("Frontend", "Mobile", "DevOps & Tooling"). Tabla `stack_groups`. |
| **Technology** | Tecnología individual con `key` slug ("typescript"). Reutilizada en role tags, education tags, stack groups, project tags. Tabla `technologies`. |
| **Project** | Proyecto propio publicable con captura, descripción, live y código. Tabla `projects`. |
| **Hero badges** | Pequeños tags flotantes sobre la foto del hero ("React · TypeScript", "Microfrontends"). Editables en `profile.heroBadges`. |
| **Status pill** | Badge superior del hero ("Abierto a propuestas"). Controlado por `profile.statusLabel` + `profile.isOpenToWork`. |
| **Stat strip** | Tira de 3 tarjetas con números computados bajo el lead del hero. |
| **Glass / Liquid glass** | Sistema visual con backdrop blur + specular highlight con cursor. Implementado en `Glass.astro`. |
| **Accent** | Color principal del sistema, fijado a azul (`hue 264`). |
| **Tweak** | Parámetro de diseño antes UI-toggleable, ahora **fijo** en código (`tweaks.ts`). |
| **Reveal** | Animación de entrada por scroll. Clase `.reveal`, `.reveal.in` cuando entra en viewport. |
| **Specular** | Highlight radial que sigue al cursor dentro de un Glass `interactive`. |
| **Eyebrow** | Texto pequeño y monospace sobre el título de sección (`01 / Trayectoria`). |
| **Anchor** | Hash en URL para saltar a sección. Estables en inglés: `#experience`, etc. |
| **Localized field** | Campo `jsonb` con shape `{es, en}`. Resuelto en runtime con `pickLocale`. |
| **HomeViewModel** | Estructura de datos compuesta que la home recibe para renderizar todas las secciones. Definida en `/src/lib/domain/types.ts`. |
| **Repo (repository)** | Funciones en `/src/lib/data/repos.ts` que encapsulan queries a Supabase y devuelven tipos de dominio (vía `mappers.ts`). |
| **Mapper** | Función pura que convierte row de DB (snake_case) a tipo de dominio (camelCase). |
| **Prerender** | Página generada en build time, servida como HTML estático. |
| **SSR** | Server-side render por request. Solo `/admin/**` y endpoints `/api`. |
| **Deploy hook** | URL de Cloudflare Pages que, llamada por POST, dispara un nuevo deploy. Se llama desde el backoffice tras una mutación. |
| **RLS** | Row Level Security de Postgres. Habilitado en todas las tablas; políticas permiten lectura pública y escritura solo a admins. |
| **Singleton (tabla)** | Tabla con exactamente una row, enforced por `generated stored` column + `unique`. Aplica a `profile`. |
