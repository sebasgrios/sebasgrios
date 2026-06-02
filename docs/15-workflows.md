# 15 · Workflows (runbooks)

## Flujo diario de desarrollo

```
1. Lee la tarea / petición del ingeniero.
2. Repasa los docs relevantes en /docs.
3. Analiza el código actual.
4. Diseña el cambio (mentalmente o con TODO list si es complejo).
5. Implementa.
6. npm run check && npm test && npm run build.
7. Verifica a ojo en npm run dev (UI).
8. Pide al ingeniero verificación con un paso a paso.
9. Si OK → commit (sin trailer, `<emoji> <subject>` en inglés, sin prefijo textual).
10. Si no OK → analiza feedback, vuelve a 5.
```

## Flujo git

```
v3 (rama de trabajo de la reescritura)
  │
  │  commits frecuentes
  │
  └──PR──▶ develop
              │
              └──PR──▶ main  (producción)
```

- **Nunca** push directo a `main` ni a `develop` sin PR.
- **Nunca** force push a ramas compartidas.
- Commits a `v3` directos están permitidos.

## Crear un commit

```bash
git add <files-specifically>
git status                  # verifica
git commit -m "✨ short imperative subject"
```

Sin `-A`/`-a`. Sin trailer `Co-Authored-By`. En inglés. **Solo emoji + subject**, sin `feat:`/`fix:`/`docs:` ni scopes entre paréntesis. La tabla emoji→categoría vive en [03-conventions](./03-conventions.md).

## Crear una PR

```bash
gh pr create --base develop --head v3 \
  --title "✨ short title" \
  --body "$(cat <<'EOF'
## Summary
- Bullet 1
- Bullet 2

## Test plan
- [ ] manual test 1
- [ ] manual test 2
EOF
)"
```

## Verificación pedida al ingeniero

Cada vez que se termine una feature y antes del commit, redactar al ingeniero un mensaje con:

1. **Qué se ha hecho** (1-2 líneas).
2. **Cómo verificarlo** (paso a paso, comandos exactos y qué mirar).
3. **Qué fijarse en romper**.

Ejemplo:
> He implementado el Hero con foto, badges y stats. Para verificar:
> 1. `npm run dev`
> 2. Abre http://localhost:4321 — debes ver el hero con la foto a la derecha.
> 3. Pasa el ratón sobre la foto, debe haber parallax suave.
> 4. Cambia a viewport móvil (DevTools), el layout debe stackearse: badge → foto → texto.
> 5. Cambia el theme con el botón del nav, no debe haber flash.
> 6. Verifica que los stats muestran los números correctos (+3 años, etc.).
> Si todo OK, dime "ok" y commiteo.

## Aplicar migración Supabase

```bash
# crear archivo
touch supabase/migrations/0013_descripcion.sql
# escribir SQL idempotente
supabase db push                # aplica al proyecto linked
npm run db:types                # regenera tipos
git add supabase/migrations/0013_descripcion.sql src/lib/data/database.types.ts
git commit -m "🔨 add column X to roles"
```

## Reset local de DB

```bash
supabase db reset    # drop + migraciones + seed
```

## Fuentes Satoshi y General Sans (self-host, hecho)

Las fuentes (de Fontshare, licencia ITF gratuita) ya están **self-hosteadas** en el repo. Archivos presentes, referenciados por `src/styles/fonts.css`:

| Archivo | Familia | Peso |
|---|---|---|
| `public/fonts/satoshi/Satoshi-Regular.woff2` | Satoshi | 400 |
| `public/fonts/satoshi/Satoshi-Medium.woff2` | Satoshi | 500 |
| `public/fonts/satoshi/Satoshi-Bold.woff2` | Satoshi | 700 |
| `public/fonts/satoshi/Satoshi-Black.woff2` | Satoshi | 900 |
| `public/fonts/general-sans/GeneralSans-Regular.woff2` | General Sans | 400 |
| `public/fonts/general-sans/GeneralSans-Medium.woff2` | General Sans | 500 |
| `public/fonts/general-sans/GeneralSans-Semibold.woff2` | General Sans | 600 |
| `public/fonts/general-sans/GeneralSans-Bold.woff2` | General Sans | 700 |

Se obtuvieron del subset Latin de la API de Fontshare (`api.fontshare.com/v2/css?f[]=<familia>@<pesos>`), que sirve los `.woff2` estáticos por peso (no la variable, para no cargar de más). Para reemplazarlas/actualizarlas, vuelve a descargar esos `.woff2` a las mismas rutas — sin renombrar nada más.

`BaseLayout.astro` hace `preload` solo de **Satoshi-Black** (H1, candidata a LCP) y **GeneralSans-Regular** (cuerpo). JetBrains Mono llega vía `@fontsource-variable/jetbrains-mono` (dependencia npm, importada en `fonts.css`), no desde `public/fonts/`.

## Subir imágenes iniciales (M4)

Claude lo orquesta usando la **Supabase CLI local del ingeniero**:

1. `supabase storage create-bucket avatars hero companies projects --public` (o equivalente del CLI vigente).
2. Subir los assets:
   ```bash
   supabase storage cp src/images/avatar.webp        ss:///avatars/avatar.webp
   supabase storage cp src/images/sebasgrios.webp    ss:///hero/photo.webp
   supabase storage cp /tmp/design-extract/sebasgrios/project/portfolio/logos/search-it.jpeg ss:///companies/search-it.jpeg
   supabase storage cp /tmp/design-extract/sebasgrios/project/portfolio/logos/ntt-data.jpeg  ss:///companies/ntt-data.jpeg
   supabase storage cp src/images/bastiangr.webp     ss:///projects/bastiangr.webp
   # ... resto de proyectos
   ```
3. Anotar las URLs públicas (`https://<ref>.supabase.co/storage/v1/object/public/<bucket>/<path>`).
4. Reemplazar URLs en `/supabase/seed.sql`.
5. `supabase db reset` para resembrar.

## Añadir un nuevo rol/experiencia (sin backoffice aún)

1. Editar `/supabase/seed.sql` añadiendo `insert into roles` + pivots.
2. `supabase db reset`.
3. `npm run build` y commit.

(Con backoffice, esto será un form en `/admin/roles/new`.)

## Cambiar el accent del portfolio

1. Editar `/src/config/tweaks.ts` → `accentHue`.
2. Verificar en `npm run dev` que light y dark se ven bien.
3. Pasar Lighthouse (contraste).
4. Commit `💎 change accent hue to X`.

## Actualizar documentación

Cualquier cambio en contrato (schema, viewModel, repos) **debe** actualizar `/docs` en el mismo commit. Si te das cuenta a posteriori, hacer commit separado `📚 update <doc> to reflect <cambio>` y referenciarlo.

## Resolución de problemas comunes

| Síntoma | Causa probable | Solución |
|---|---|---|
| Flash de tema al cargar | Anti-flash script roto o cargado tarde | Verifica que el `<script>` inline está **antes** del `<link rel="stylesheet">`. |
| Hydration mismatch | JS modifica DOM antes de Astro | Mover JS dentro de `<script>` deferred. |
| Imagen lenta en LCP | Sin `fetchpriority="high"` o sin `loading="eager"` | Marcar la imagen del hero como eager + fetchpriority. |
| `astro check` falla por tipos | DB types desactualizados | `npm run db:types`. |
| RLS bloquea lectura desde el portfolio | Falta política `public read` | Añadir migración. |

## Cuándo pedir al ingeniero antes de actuar

- Borrar archivos o branches.
- Tocar `main` o `develop` directamente.
- Cualquier `git push --force`, `git reset --hard`, `git checkout .`.
- Subir o cambiar secretos.
- Cambiar versiones mayores de dependencias.
- Cambiar el dominio o las URLs canónicas.
- Cambiar el design system fuera de lo documentado en [04](./04-design-system.md).

Todo lo demás (editar componentes, añadir secciones, escribir tests, refactor interno) → hacer y luego pedir verificación.
