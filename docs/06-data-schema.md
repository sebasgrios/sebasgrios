# 06 · Data schema (Supabase)

> El **schema es propiedad del backoffice**: el repo separado **`sebasgrios-backoffice`** posee `supabase/` (migraciones + seed) y aplica las migraciones al Supabase vivo. Este documento queda como puntero. Ver [13-backoffice](./13-backoffice.md).

## Qué consume este repo

El portfolio es **estático** y solo **lee** Supabase en build (anon key + RLS public read). No define ni migra el schema; no contiene `supabase/`.

Lo que el portfolio necesita saber del schema:

- **Tipos de la BD**: `src/lib/data/database.types.ts` (generado en el backoffice con `supabase gen types`; aquí se commitea como artefacto y se **sincroniza desde el backoffice** cuando cambia una migración).
- **Tipos de dominio**: `src/lib/domain/types.ts` (shape estable que consumen las secciones, desacoplado de las rows de la BD).
- **Mapeo row → dominio**: `src/lib/data/mappers.ts`.
- **Lectura por agregado**: `src/lib/data/repos.ts` + `loaders.ts`.

## Acoplamiento

- El portfolio lee las tablas con **RLS public read** (anon key) y mapea a tipos de dominio. Si el backoffice añade/renombra columnas o introduce `is_visible` (ocultar filas), hay que **sincronizar `database.types.ts`** y ajustar `repos.ts`/`mappers.ts` en consecuencia.
- Histórico (hasta v3.0.0): este repo contenía el schema completo (tablas, RLS, triggers, storage, RPC `set_entity_technologies`, `admin_audit_log`, seed). Todo eso se movió al backoffice al pasar el portfolio a estático puro. La referencia canónica del schema vive ahora en `sebasgrios-backoffice`.
