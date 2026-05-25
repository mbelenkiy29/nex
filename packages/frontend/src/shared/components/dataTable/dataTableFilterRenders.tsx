import dayjs from 'dayjs';
import { Locale } from '@project/backend/translation/locales';
import { formatDate } from '@project/backend/shared/lib/formatDate';
import { formatDateTime } from '@project/backend/shared/lib/formatDateTime';
import { formatDecimal } from '@project/backend/shared/lib/formatDecimal';
import { Dictionary } from '@project/backend/translation/locales';

export const dataTableFilterRenders = (
  locale: Locale,
  dictionary: Dictionary,
) => {
  return {
    enumerator:
      (labels: { [key: string]: string }) =>
      (value: string | null | undefined) => (value ? labels[value] : null),
    enumeratorMultiple:
      (labels: { [key: string]: string }) =>
      (values: string[] | null | undefined) =>
        values
          ? values
              .map(
                dataTableFilterRenders(locale, dictionary).enumerator(labels),
              )
              .join(', ')
          : null,
    stringArray: () => (value: string[] | null | undefined) =>
      (value || []).join(', '),
    json: () => (value: any) => (value ? JSON.stringify(value, null, 2) : null),
    decimal: (fractionDigits?: number) => (value: any) =>
      formatDecimal(value, locale, fractionDigits),
    boolean:
      (trueLabel?: string, falseLabel?: string) =>
      (value: boolean | string | undefined | null) =>
        value == null
          ? null
          : value === 'true' || value === true
            ? trueLabel || dictionary.shared.yes
            : falseLabel || dictionary.shared.no,
    booleanTrueOnly:
      (trueLabel?: string) => (value: boolean | string | undefined | null) =>
        value == null
          ? null
          : value === 'true' || value === true
            ? trueLabel || dictionary.shared.yes
            : null,
    relationToOne:
      (
        labelFn: (value: any, dictionary: Dictionary, locale: Locale) => string,
      ) =>
      (value: { [key: string]: string }) =>
        labelFn(value, dictionary, locale) || null,
    relationToMany:
      (
        labelFn: (value: any, dictionary: Dictionary, locale: Locale) => string,
      ) =>
      (arrayValue: Array<{ [key: string]: string }>) =>
        (arrayValue || [])
          .map((value) => labelFn(value, dictionary, locale) || null)
          .filter(Boolean)
          .join(', '),
    filesOrImages:
      () => (arrayValue: Array<{ downloadUrl: string }> | null | undefined) =>
        (arrayValue || []).map((value) => value.downloadUrl).join(' '),
    date: () => (value: dayjs.ConfigType) => formatDate(value, dictionary),
    dateRange:
      () =>
      (value: [dayjs.ConfigType?, dayjs.ConfigType?] | null | undefined) => {
        if (!value || !value.length) {
          return '';
        }

        const start = value[0];
        const end = value.length === 2 ? value[1] : null;

        if (!start && !end) {
          return '';
        }

        if (start && !end) {
          return `> ${formatDate(start, dictionary)}`;
        }

        if (!start && end) {
          return `< ${formatDate(end, dictionary)}`;
        }

        return `${formatDate(start, dictionary)} - ${formatDate(
          end,
          dictionary,
        )}`;
      },
    datetime: () => (value: dayjs.ConfigType) =>
      formatDateTime(value, dictionary),
    dateTimeRange:
      () =>
      (value: [dayjs.ConfigType?, dayjs.ConfigType?] | null | undefined) => {
        if (!value || !value.length) {
          return '';
        }

        const start = value[0];
        const end = value.length === 2 ? value[1] : null;

        if (!start && !end) {
          return '';
        }

        if (start && !end) {
          return `> ${formatDateTime(start, dictionary)}`;
        }

        if (!start && end) {
          return `< ${formatDateTime(end, dictionary)}`;
        }

        return `${formatDateTime(start, dictionary)} - ${formatDateTime(
          end,
          dictionary,
        )}`;
      },
    decimalRange: (fractionDigits?: number) => (value: [any, any]) => {
      if (!value || !value.length) {
        return '';
      }

      const start = value[0];
      const end = value.length === 2 ? value[1] : null;

      if (start == null && end == null) {
        return '';
      }

      if (start != null && end == null) {
        return `> ${formatDecimal(start, locale, fractionDigits)}`;
      }

      if (start == null && end != null) {
        return `< ${formatDecimal(end, locale, fractionDigits)}`;
      }

      return `${formatDecimal(start, locale, fractionDigits)} - ${formatDecimal(
        end,
        locale,
        fractionDigits,
      )}`;
    },
    range: () => (value: [any, any]) => {
      if (!value || !value.length) {
        return '';
      }

      const start = value[0];
      const end = value.length === 2 && value[1];

      if ((start == null || start === '') && (end == null || end === '')) {
        return '';
      }

      if (start != null && (end == null || end === '')) {
        return `> ${start}`;
      }

      if ((start == null || start === '') && end != null) {
        return `< ${end}`;
      }

      return `${start} - ${end}`;
    },
  };
};
