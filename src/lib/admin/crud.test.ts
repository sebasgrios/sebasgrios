import { createCrudRoute } from '@/lib/admin/crud';
import type { APIContext } from 'astro';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

const schema = z.object({ name: z.string().min(1) });

function makeContext(fields: Record<string, string>, isAdmin = true) {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) form.append(key, value);
  const cookies = {
    set: vi.fn(),
    delete: vi.fn(),
    get: () => undefined,
    getAll: () => [],
    has: () => false,
  };
  const redirect = vi.fn(
    (url: string) => new Response(null, { status: 302, headers: { Location: url } })
  );
  const context = {
    locals: { isAdmin },
    request: new Request('http://localhost/api/things', { method: 'POST', body: form }),
    cookies,
    redirect,
  } as unknown as APIContext;
  return { context, cookies, redirect };
}

function makeRoute() {
  const create = vi.fn(async () => {});
  const update = vi.fn(async () => {});
  const remove = vi.fn(async () => {});
  const route = createCrudRoute({
    entity: 'thing',
    redirect: '/admin/things',
    schema,
    parse: (form) => ({ name: form.get('name') }),
    create,
    update,
    remove,
  });
  return { route, create, update, remove };
}

describe('createCrudRoute', () => {
  it('returns 403 for non-admins', async () => {
    const { route } = makeRoute();
    const { context } = makeContext({ _action: 'create', name: 'x' }, false);
    const res = await route(context);
    expect(res.status).toBe(403);
  });

  it('creates with valid data and flashes ok', async () => {
    const { route, create } = makeRoute();
    const { context, cookies } = makeContext({ _action: 'create', name: 'x' });
    await route(context);
    expect(create).toHaveBeenCalledWith(expect.anything(), { name: 'x' });
    expect(cookies.set).toHaveBeenCalledWith('admin_flash', 'ok', expect.anything());
  });

  it('updates with id', async () => {
    const { route, update } = makeRoute();
    const { context } = makeContext({ _action: 'update', id: 'abc', name: 'y' });
    await route(context);
    expect(update).toHaveBeenCalledWith(expect.anything(), 'abc', { name: 'y' });
  });

  it('rejects update without id (invalid, no mutation)', async () => {
    const { route, update } = makeRoute();
    const { context, cookies } = makeContext({ _action: 'update', name: 'y' });
    await route(context);
    expect(update).not.toHaveBeenCalled();
    expect(cookies.set).toHaveBeenCalledWith('admin_flash', 'invalid', expect.anything());
  });

  it('deletes with id', async () => {
    const { route, remove } = makeRoute();
    const { context } = makeContext({ _action: 'delete', id: 'abc' });
    await route(context);
    expect(remove).toHaveBeenCalledWith(expect.anything(), 'abc');
  });

  it('flags invalid payload without mutating', async () => {
    const { route, create } = makeRoute();
    const { context, cookies } = makeContext({ _action: 'create', name: '' });
    await route(context);
    expect(create).not.toHaveBeenCalled();
    expect(cookies.set).toHaveBeenCalledWith('admin_flash', 'invalid', expect.anything());
  });
});
