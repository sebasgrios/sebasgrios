# 14 · Testing

## Filosofía

- **Tests donde haya lógica no trivial**. No testear getters/JSX.
- **Tests rápidos**. Toda la suite unitaria < 5s. e2e por separado.
- **Cero mocks de Supabase** salvo en helpers puros. Para flows reales, usar entorno local de Supabase.

## Pirámide

```
              ▲
        e2e   │  Playwright (futuro backoffice + smoke público)
              │
       integ  │  Repos contra Supabase local (M4+)
              │
        unit  │  Vitest — helpers, mappers, i18n, computed stats
              ▼
```

## Vitest

Configuración en `vitest.config.ts`. Carpetas `**/*.test.ts` colocadas junto al código.

### Qué se testea (M1–M7)

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

1. `public.spec.ts`: visita `/` y `/en/`, verifica que se renderizan secciones esperadas y links sociales presentes.
2. `theme.spec.ts`: click theme toggle alterna `data-theme` y persiste tras reload.

(Pendiente: `responsive.spec.ts` con viewports 360/768/1280 → screenshots estables.)

### Futuros (cuando exista backoffice)

4. `admin-login.spec.ts`: redirect a login si no hay sesión.
5. `admin-edit.spec.ts`: login → editar profile → guardar → ver cambio en `/`.

## RLS tests

Script `scripts/test-rls.ts` (M4+) ejecuta queries como anon y como admin, verifica que las políticas funcionan:

```ts
const anon = createClient(URL, ANON_KEY);
await expect(anon.from('profile').update({ full_name: 'X' })).rejects.toThrow();
```

## CI

Sin GitHub Actions todavía. Cuando se añadan (M8+):

- Job `lint`: `npm run check`.
- Job `unit`: `npm test`.
- Job `build`: `npm run build`.
- Job `e2e` (opcional, lento): `npm run e2e`.

Todos bloquean merge a `develop` y `main`.

## Lo que NO se testea

- Renderizado de componentes Astro (snapshot tests dan poco valor frente al coste de mantenerlos).
- Animaciones / parallax (visual; se valida a ojo).
- Cloudflare Workers runtime específico (lo cubre el deploy preview).
