import { defineMiddleware } from 'astro:middleware';
import { getLocaleFromPath } from '@/lib/i18n/getLocale';

export const onRequest = defineMiddleware((context, next) => {
  context.locals.locale = getLocaleFromPath(new URL(context.request.url).pathname);
  return next();
});
