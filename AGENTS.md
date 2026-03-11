# Repository Guidelines

## Project Structure & Module Organization
This repository is a personal portfolio built with Astro, TypeScript, and Tailwind CSS. Application code lives in `src/`: page entrypoints in `src/pages`, shared wrappers in `src/layouts`, reusable UI in `src/components`, and homepage sections in `src/sections`. Static images imported by Astro are stored in `src/images`, while public files such as `favicon.svg`, `robots.txt`, and `sitemap.xml` live in `public`.

## Build, Test, and Development Commands
Install dependencies with `npm install`. Use `npm run dev` to start the Astro dev server on the network host, or `npm start` for the default local dev server. Run `npm run build` before opening a PR; it performs `astro check` and then creates the production build. Use `npm run preview` to inspect the built site locally.

## Coding Style & Naming Conventions
Follow the existing Astro style: component files use PascalCase (`Theme-Toggle.astro`, `Time-Line.astro`), page files stay lowercase (`index.astro`), and imports prefer the `@/` alias configured in `tsconfig.json`. Existing files mix tabs and two-space indentation, so match the surrounding file instead of reformatting unrelated code. Keep Tailwind utility classes close to the component they style, and prefer small, composable sections over large monolithic templates.

## Testing Guidelines
There is no dedicated automated test suite in the repository today. Treat `npm run build` as the required validation step because it covers Astro type-checking and production compilation. For UI changes, manually verify the affected section in `npm run dev` and confirm dark-mode behavior where relevant.

## Commit & Pull Request Guidelines
Recent commits use short, imperative subjects, often prefixed with an emoji or scope marker such as `✨ Add new job` or `DOCS: Delete package-lock.json`. Keep commit messages concise and focused on a single change. Pull requests should include a clear summary, note any content or visual changes, link the related issue when one exists, and attach screenshots for layout or styling updates.

## Content & Asset Updates
Optimize new images before adding them to `src/images`, prefer `.webp` when practical, and keep filenames short and descriptive. When updating portfolio entries or experience content, place related markup and assets in the same feature area so future edits remain localized.
