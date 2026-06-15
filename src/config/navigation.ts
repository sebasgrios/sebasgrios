/**
 * Primary navigation. `id` is the in-page anchor (always English, per the
 * closed decisions); `key` resolves to a label in the i18n dictionaries.
 */
export const navigation = [
  { id: 'hero', key: 'nav.home' },
  { id: 'now', key: 'nav.now' },
  { id: 'path', key: 'nav.path' },
  { id: 'work', key: 'nav.work' },
] as const;
