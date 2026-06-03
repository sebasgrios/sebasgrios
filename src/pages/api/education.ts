import { createCrudRoute } from '@/lib/admin/crud';
import { readLocalized, readLocalizedList, readString, readStringList } from '@/lib/admin/forms';
import { educationInputSchema } from '@/lib/admin/schemas';
import { createEducation, deleteEducation, updateEducation } from '@/lib/data/mutations';

export const prerender = false;

export const POST = createCrudRoute({
  entity: 'education',
  redirect: '/admin/education',
  schema: educationInputSchema,
  parse: (form) => ({
    title: readLocalized(form, 'title'),
    school: readString(form, 'school'),
    startDate: readString(form, 'startDate'),
    endDate: readString(form, 'endDate'),
    description: readLocalized(form, 'description'),
    bullets: readLocalizedList(form, 'bullets', 12),
    sortOrder: readString(form, 'sortOrder'),
    technologyIds: readStringList(form, 'technologyIds'),
  }),
  create: createEducation,
  update: updateEducation,
  remove: deleteEducation,
});
