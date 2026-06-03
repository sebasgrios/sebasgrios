import { createCrudRoute } from '@/lib/admin/crud';
import { readString } from '@/lib/admin/forms';
import { technologyInputSchema } from '@/lib/admin/schemas';
import { createTechnology, deleteTechnology, updateTechnology } from '@/lib/data/mutations';

export const prerender = false;

export const POST = createCrudRoute({
  entity: 'technology',
  redirect: '/admin/technologies',
  schema: technologyInputSchema,
  parse: (form) => ({
    key: readString(form, 'key'),
    label: readString(form, 'label'),
    iconKey: readString(form, 'iconKey'),
    sortOrder: readString(form, 'sortOrder'),
  }),
  create: createTechnology,
  update: updateTechnology,
  remove: deleteTechnology,
});
