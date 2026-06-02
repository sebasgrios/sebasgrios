export function readString(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === 'string' ? value : '';
}

export function readLocalized(form: FormData, key: string): { es: string; en: string } {
  return { es: readString(form, `${key}.es`), en: readString(form, `${key}.en`) };
}

export function readBool(form: FormData, key: string): boolean {
  const value = form.get(key);
  return value === 'on' || value === 'true' || value === '1';
}

export function readLocalizedList(
  form: FormData,
  key: string,
  max = 4
): { es: string; en: string }[] {
  const out: { es: string; en: string }[] = [];
  for (let index = 0; index < max; index += 1) {
    const es = readString(form, `${key}.${index}.es`);
    const en = readString(form, `${key}.${index}.en`);
    if (es.trim() || en.trim()) out.push({ es, en });
  }
  return out;
}

export function readStringList(form: FormData, key: string): string[] {
  return form.getAll(key).filter((value): value is string => typeof value === 'string');
}
