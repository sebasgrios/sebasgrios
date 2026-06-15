# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Personal portfolio of **Sebastián González Ríos** (`sebasgrios.es`) — v5. A 100% static
Astro site (no SSR, no adapter) deployed on Cloudflare Pages, bilingual (es/en), monochrome
"Apple/Linear/Vercel" design. Built from the high-fidelity prototype in
`~/Downloads/sebasgrios-handoff` (`HANDOFF.md` + `base.md` + `mejoras.md` are the source of truth
for content, UX and closed design decisions).

## Commands

```bash
pnpm dev            # dev server
pnpm build          # astro check + astro build (static → dist/)
pnpm preview        # serve dist/ on :4321
pnpm check          # astro check (.astro/.ts types) + biome check (lint/format)
pnpm format         # biome check --write (autofix)
pnpm test           # vitest (unit) — pnpm exec vitest run src/lib/dates.test.ts for one file
pnpm e2e            # playwright (builds + previews, then runs e2e/)
pnpm exec playwright test e2e/a11y.spec.ts --project=chromium   # one e2e file/project
```

## Architecture

**Strict separation config ≠ content ≠ UI strings** (required by `mejoras.md`):

- `src/config/*.ts` — global configuration, never content: `site` (incl. `careerStart`, the source
  for computed years of experience), `social`, `settings` (feature flags, hero metrics, hero stack),
  `navigation`, `seo` (per-locale), `tech` (brand colours for tag glow).
- `src/content/` — editable records via Content Collections (`src/content.config.ts`, Zod schemas).
  `experience/` + `education/` are two collections sharing one schema and merged into a single
  timeline (`src/lib/content.ts → getTimeline`, sorted newest→oldest, `kind` from collection).
  `projects/` (sorted by `order`). `settings/now.yml` holds the "Now" section content. Bilingual
  fields use `{ es, en }` (the `localized` Zod helper).
- `src/i18n/{es,en}.json` — UI/chrome strings only. `src/i18n/index.ts` exposes `useTranslations`,
  `pickLocalized` (for `{es,en}` content fields), and locale helpers.

**Routing / i18n**: `i18n` config uses `prefixDefaultLocale: true`, so both locales live under a
prefix. `src/pages/[locale]/index.astro` generates `/es/` and `/en/` via `getStaticPaths`.
`src/pages/index.astro` is the `/` landing — a client-side language-detect redirect (noindex, with a
`<noscript>` fallback). hreflang/canonical/alternate live in `<head>` (`BaseHead.astro`) and are the
authoritative SEO signal; the sitemap (config `filter`) lists only `/es/` and `/en/`.

**Styling**: Tailwind v4 via `@tailwindcss/vite`. All visual CSS lives in global modules under
`src/styles/` (imported by `global.css`), NOT scoped in components — this keeps styling consistent
and lets the same classes style markup and any client-rendered content. Design tokens are themeable
CSS custom properties in `tokens.css` (`:root` + `:root[data-theme="dark"]`), exposed to Tailwind
utilities via `@theme inline`. Closed defaults (`HANDOFF.md`): accent = Neutral grey, glass = Medio,
font = Geist. Self-hosted Geist via Fontsource (`wght.css` only — no italics; no CDN).

**Interactivity is vanilla, not a framework.** There is intentionally NO React/Motion (removed —
they only added a ~189KB runtime for trivial chrome and cost the Lighthouse budget). Theme toggle,
header (scroll-hide, mobile menu, active-nav IntersectionObserver) and the reveal-on-scroll system
(`src/scripts/reveal.ts`) are small `<script>`s. Total JS shipped ≈ 2.2KB. **Keep it that way** —
add a framework island only with a clear, justified need.

**Timeline** (`Timeline.astro`) is the showcase: progressive enhancement. Base = a normal horizontal
scroll container (works with no JS / reduced-motion, all cards reachable). JS adds `.is-pinned` when
motion is allowed → the section grows tall, the pin sticks, and vertical scroll drives horizontal
travel. Invariant: no ancestor of `.timeline__pin` may set `overflow: hidden/auto/scroll`;
`body { overflow-x: clip }` keeps that safe (see `base.css`).

**OG images**: `src/pages/og/[locale].png.ts` generates `/og/{es,en}.png` at build with Satori
(Geist OTF in `src/assets/og/`, read via `process.cwd()`) → PNG via sharp.

**Animations**: base state is VISIBLE; the hidden start state is only armed (`html.anim-on`) once a
probe confirms the transition clock advances, so export/PDF/no-JS show full content. All motion
respects `prefers-reduced-motion`.

## Conventions & gotchas

- **Biome owns `.ts/.tsx/.css/.json`; `astro check` owns `.astro`.** `.astro` and the Tailwind entry
  `global.css` are excluded from Biome (it only parses `.astro` frontmatter → false unused-import /
  hook-rule positives; it can't parse Tailwind at-rules). Don't "fix" those by re-including them.
- **pnpm 11 build scripts**: `sharp` + `esbuild` are allowlisted in `pnpm-workspace.yaml`
  (`allowBuilds`). `sharp` is also a direct devDependency (pnpm wouldn't otherwise expose it to
  Astro's image service).
- CSS specificity: keep base selectors before higher-specificity overrides (Biome
  `noDescendingSpecificity`). Accent grey fails AA as small text — use `--fg-soft`/`--fg-faint` for
  small text, accent only for borders/large/decorative.
- A11y is gated by `e2e/a11y.spec.ts` (axe, no serious/critical, es+en, desktop+mobile, reduced
  motion). Lighthouse is 100/100/100/100 desktop + mobile — protect that budget.

## Workflow

- v5 is developed directly on the `v5` branch (no feature branches, per the owner).
- Commits: `<emoji> <imperative subject in English>`, no textual prefix, no trailers. PR bodies in
  Spanish (Spain), assigned to the author. Content/comments/docs in English.
