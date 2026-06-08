# 14 · Testing

## Filosofía

- **Tests donde haya lógica no trivial**. No testear getters/JSX.
- **Tests rápidos**. Toda la suite unitaria < 5s. e2e por separado.
- **Cero mocks de Supabase** salvo en helpers puros. Para flows reales, usar entorno local de Supabase.

## Pirámide

```
              ▲
        e2e   │  Playwright (guards backoffice + smoke público)
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
| `lib/admin/forms.ts` | parseo de `FormData` (localized, bool, listas indexadas). |
| `lib/admin/schemas.ts` | validación Zod de cada entidad (profile, technology, stack, education, company, role, project): locales requeridos, fechas, URLs vacías→null, enums, uuids, coerción de orden. |

Suite actual: **57 tests** en 7 ficheros (`*.test.ts` colocados junto al código).

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
3. `admin.spec.ts`: guards del backoffice sin sesión (`/admin`→302 login, `POST /api/*`→401, `/admin/login` renderiza, `/api/auth/signin`→302).

(Pendiente: e2e del flujo admin autenticado y `responsive.spec.ts`.)

### Futuros (flujo admin autenticado)

4. `admin-login.spec.ts`: redirect a login si no hay sesión.
5. `admin-edit.spec.ts`: login → editar profile → guardar → ver cambio en `/`.

## RLS tests

Script `scripts/test-rls.ts` (M4+) ejecuta queries como anon y como admin, verifica que las políticas funcionan:

```ts
const anon = createClient(URL, ANON_KEY);
await expect(anon.from('profile').update({ full_name: 'X' })).rejects.toThrow();
```

## CI

`.github/workflows/ci.yml` (GitHub Actions) corre en PRs a `develop`/`main` y en push a `develop`: `pnpm check` + `pnpm test` + `pnpm build`. El `build` solo necesita la anon key pública (hardcodeada) → sin secretos. Falta marcarlo como *required status check* en GitHub (ver [17-improvements](./17-improvements.md), pasos manuales). `e2e` aún no está en CI (necesita servidor + más tiempo).

## Lo que NO se testea

- Renderizado de componentes Astro (snapshot tests dan poco valor frente al coste de mantenerlos).
- Animaciones / parallax (visual; se valida a ojo).
- Cloudflare Workers runtime específico (lo cubre el deploy preview).
