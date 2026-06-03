import type { SupabaseServerClient } from '@/lib/auth/supabaseServer';

/** Best-effort audit trail. Never throws: a logging failure must not break the action. */
export async function logAudit(
  client: SupabaseServerClient,
  entity: string,
  action: string,
  entityId: string | null
): Promise<void> {
  try {
    await client.from('admin_audit_log').insert({ entity, action, entity_id: entityId });
  } catch {
    // intentionally swallowed
  }
}
