# Documentación · Portfolio v3

Índice maestro de la documentación del proyecto. Pensado como **fuente de verdad** para humanos y como **base RAG** para agentes (Claude, Copilot, etc.).

Cada documento es autocontenido y enlaza al resto. Las decisiones cerradas con el ingeniero se identifican con la etiqueta `[DECIDIDO]`. Los puntos abiertos con `[PENDIENTE]`.

## Mapa de contenidos

| # | Documento | Resumen |
|---|---|---|
| 00 | [Overview](./00-overview.md) | Objetivo del proyecto, alcance, hitos, definición de "listo". |
| 01 | [Architecture](./01-architecture.md) | Arquitectura de runtime, capas, flujo de datos, contratos. |
| 02 | [Tech stack](./02-tech-stack.md) | Versiones exactas, justificación, configuración por paquete. |
| 03 | [Conventions](./03-conventions.md) | Naming, code style, commits, branching, PR. |
| 04 | [Design system](./04-design-system.md) | Tokens, tipografía, paleta, liquid glass, animaciones, breakpoints. |
| 05 | [Content model](./05-content-model.md) | Secciones, copy fijo vs editable, hero stats, tweaks fijos. |
| 06 | [Data schema](./06-data-schema.md) | Tablas Supabase, columnas, índices, RLS, migraciones, seed. |
| 07 | [Internationalization](./07-i18n.md) | Locales, routing `/en/`, patrón jsonb, fallback. |
| 08 | [Routing & pages](./08-routing-pages.md) | Árbol de páginas, anchors estables, sitemap, robots, SEO. |
| 09 | [Components](./09-components.md) | Catálogo de componentes Astro/UI, props, uso. |
| 10 | [Performance](./10-performance.md) | Estático, cache, imágenes, CWV target. |
| 11 | [Accessibility](./11-accessibility.md) | Reglas a11y, `prefers-reduced-motion`, contraste, foco. |
| 12 | [Deployment](./12-deployment.md) | Cloudflare Pages (estático), config, deploy hook. |
| 13 | [Backoffice](./13-backoffice.md) | Repo separado (Next.js); puntero. |
| 14 | [Testing](./14-testing.md) | Vitest + Playwright, qué se testea y qué no. |
| 15 | [Workflows](./15-workflows.md) | Dev/QA/deploy runbooks, flujo de commits y PRs. |
| 16 | [Glossary](./16-glossary.md) | Términos del dominio (rol, sector, stack, etc.). |
| 17 | [Improvements](./17-improvements.md) | Backlog priorizado de mejoras de código e infraestructura. |

## Cómo se usa este índice

- **Humanos**: empieza por `00-overview.md` y baja por orden si quieres contexto completo. Para tareas concretas usa la tabla.
- **Agentes (RAG)**: cada `.md` tiene un bloque frontmatter implícito con `H1` y un párrafo de resumen. Indexa todos los documentos. Cuando una pregunta cite un concepto del [Glossary](./16-glossary.md), recupera además los documentos enlazados.

## Reglas para mantener esta documentación

1. **Un cambio que afecte a otra capa debe actualizar la documentación en el mismo commit.** Sin excepciones.
2. Los documentos no contienen código de la app; solo decisiones, contratos y diagramas. El código vive en `/src` y `/supabase`.
3. Cuando una decisión cambie, actualiza el `[DECIDIDO]` correspondiente y deja una nota `Histórico:` al final del documento con la fecha y la razón.
4. Idioma: documentación en español; identificadores, código, SQL, commits y nombres de archivo en inglés.
5. Si añades un documento nuevo, regístralo en esta tabla y enlázalo desde al menos un documento existente.
