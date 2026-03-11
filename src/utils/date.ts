import type { ExperienceDate } from '@/types/content';

export function formatExperienceDate(date: ExperienceDate, locale = 'es-ES') {
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    year: 'numeric'
  }).format(new Date(date.year, date.month - 1));
}

export function toMonthDateTime(date: ExperienceDate) {
  return `${date.year}-${String(date.month).padStart(2, '0')}`;
}

export function getYearsOfExperience(startDate: ExperienceDate, currentDate = new Date()) {
  let years = currentDate.getFullYear() - startDate.year;
  const monthDiff = currentDate.getMonth() - (startDate.month - 1);

  if (monthDiff < 0) {
    years -= 1;
  }

  return years;
}
