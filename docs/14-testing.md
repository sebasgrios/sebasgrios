# 14 · Testing

## Filosofía

- **Tests donde haya lógica no trivial**. No testear getters/JSX.
- **Tests rápidos**. Toda la suite unitaria < 5s. e2e por separado.
- **Cero mocks de Supabase** salvo en helpers puros. Para flows reales, usar entorno local de Supabase.

## Pirámide

```
              ▲
        e2e   │  Playwright (smoke público)
              │
       integ  │  Repos contra Supabase local (M4+)
              │
        unit  │  Vitest — helpers, mappers, i18n, computed stats
              ▼
```

## Vitest

Configuración en `vitest.config.ts`. Carpetas `**/*.test.ts` colocadas junto al código.

### Qué se testea

| Módulo | Test |
|---|---|
| `lib/domain/dates.ts` | `formatMonthYear`, `formatDateRange`, `yearsBetween` con varios locales y casos endDate=null. |
| `lib/domain/i18n.ts` | `pickLocale`/`pickLocaleArray` con fallback, claves vacías. |
| `lib/domain/stats.ts` | `computeYearsOfExperience` (frontera de año), `countUniqueSectors`, `countProjects`. |
| `lib/data/mappers.ts` | row snake_case → camelCase para cada entidad. |
| `lib/i18n/getLocale.ts` | `getLocaleFromPath` (prefijo `/en/`, fallback). |

Suite actual: **29 tests** en 5 ficheros (`*.test.ts` colocados junto al código).

### Patrón de test

```ts
import { describe, it, expect } from 'vitest';
import { pickLocale } from './i18n';

describe('pickLocale', () => {
  it('returns requested locale', () => {
    expect(pickLocale({ es: 'hola', en: 'hi' }, 'en')).toBe('hi');
  });
  it('falls back to es when en missing', () => {
    expect(pickLocale({ es: 'hola', en: '' }, 'en')).toBe('hola');
  });
  it('returns empty string for undefined input', () => {
    expect(pickLocale(undefined, 'en')).toBe('');
  });
});
```

## Playwright (M2+ instalado, suite mínima)

Smoke tests en `/e2e/`:

1. `public.spec.ts`: visita `/` y `/en/`, secciones, locale switch, hreflang, JSON-LD.
2. `theme.spec.ts`: click theme toggle alterna `data-theme` y persiste tras reload.
3. `a11y.spec.ts`: **axe-core** sobre `/` y `/en/` en claro y oscuro; 0 violaciones serias/críticas (WCAG A/AA).

(Pendiente: `responsive.spec.ts`.)

## RLS tests

Script `scripts/test-rls.ts` (M4+) ejecuta queries como anon y como admin, verifica que las políticas funcionan:

```ts
const anon = createClient(URL, ANON_KEY);
await expect(anon.from('profile').update({ full_name: 'X' })).rejects.toThrow();
```

## CI

`.github/workflows/ci.yml` (GitHub Actions) corre en PRs a `develop`/`main` y en push a `develop`, en tres jobs:
- **`verify`**: `pnpm check` + `pnpm test` + `pnpm build` (sin secretos; la anon key es pública).
- **`e2e`**: Playwright (chromium) — smoke público + `a11y` (axe).
- **`lighthouse`**: build + `lhci autorun` con budgets (`lighthouserc.json`): a11y y SEO como *error* (≥0.9), perf y best-practices como *warn*. Umbrales conservadores; subir a ≥0.95 tras confirmar el primer run verde.

## Lo que NO se testea

- Renderizado de componentes Astro (snapshot tests dan poco valor frente al coste de mantenerlos).
- Animaciones / parallax (visual; se valida a ojo).
- La CSP efectiva por cabeceras `_headers` (no se aplica en `astro preview`; se valida en el deploy preview de Cloudflare).
