import { createCrudRoute } from '@/lib/admin/crud';
import { readLocalized, readString, readStringList } from '@/lib/admin/forms';
import { projectInputSchema } from '@/lib/admin/schemas';
import { createProject, deleteProject, updateProject } from '@/lib/data/mutations';

export const prerender = false;

export const POST = createCrudRoute({
  entity: 'project',
  redirect: '/admin/projects',
  schema: projectInputSchema,
  parse: (form) => ({
    name: readString(form, 'name'),
    description: readLocalized(form, 'description'),
    imageUrl: readString(form, 'imageUrl'),
    liveUrl: readString(form, 'liveUrl'),
    codeUrl: readString(form, 'codeUrl'),
    sortOrder: readString(form, 'sortOrder'),
    technologyIds: readStringList(form, 'technologyIds'),
  }),
  create: createProject,
  update: updateProject,
  remove: deleteProject,
});
