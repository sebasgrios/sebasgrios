import { createCrudRoute } from '@/lib/admin/crud';
import { readLocalized, readLocalizedList, readString, readStringList } from '@/lib/admin/forms';
import { roleInputSchema } from '@/lib/admin/schemas';
import { createRole, deleteRole, updateRole } from '@/lib/data/mutations';

export const prerender = false;

export const POST = createCrudRoute({
  entity: 'role',
  redirect: '/admin/companies',
  schema: roleInputSchema,
  parse: (form) => ({
    companyId: readString(form, 'companyId'),
    title: readLocalized(form, 'title'),
    sector: readLocalized(form, 'sector'),
    mode: readLocalized(form, 'mode'),
    modeKey: readString(form, 'modeKey'),
    startDate: readString(form, 'startDate'),
    endDate: readString(form, 'endDate'),
    description: readLocalized(form, 'description'),
    bullets: readLocalizedList(form, 'bullets', 12),
    sortOrder: readString(form, 'sortOrder'),
    technologyIds: readStringList(form, 'technologyIds'),
  }),
  create: createRole,
  update: updateRole,
  remove: deleteRole,
});
