import { createCrudRoute } from '@/lib/admin/crud';
import { readLocalized, readString } from '@/lib/admin/forms';
import { companyInputSchema } from '@/lib/admin/schemas';
import { createCompany, deleteCompany, updateCompany } from '@/lib/data/mutations';

export const prerender = false;

export const POST = createCrudRoute({
  entity: 'company',
  redirect: '/admin/companies',
  schema: companyInputSchema,
  parse: (form) => ({
    name: readString(form, 'name'),
    logoUrl: readString(form, 'logoUrl'),
    metaLine: readLocalized(form, 'metaLine'),
    sortOrder: readString(form, 'sortOrder'),
  }),
  create: createCompany,
  update: updateCompany,
  remove: deleteCompany,
});
