import { createCrudRoute } from '@/lib/admin/crud';
import { readLocalized, readString, readStringList } from '@/lib/admin/forms';
import { stackGroupInputSchema } from '@/lib/admin/schemas';
import { createStackGroup, deleteStackGroup, updateStackGroup } from '@/lib/data/mutations';

export const prerender = false;

export const POST = createCrudRoute({
  entity: 'stack group',
  redirect: '/admin/stack',
  schema: stackGroupInputSchema,
  parse: (form) => ({
    label: readLocalized(form, 'label'),
    iconKey: readString(form, 'iconKey'),
    sortOrder: readString(form, 'sortOrder'),
    technologyIds: readStringList(form, 'technologyIds'),
  }),
  create: createStackGroup,
  update: updateStackGroup,
  remove: deleteStackGroup,
});
