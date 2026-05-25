import { Locale } from '../../translation/locales';

export function courseLabel(course?: any, _dictionary?: any, _locale?: Locale) {
  return course?.title || course?.slug || course?.id || '';
}
