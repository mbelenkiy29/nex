import { AutocompleteAsyncInput } from '@/shared/components/form/AutocompleteAsyncInput';
import { AutocompleteMemoryInput } from '@/shared/components/form/AutocompleteMemoryInput';
import { Dictionary, Locale } from '@project/backend/translation/locales';

export function AutocompleteInput<T extends { id: string }>(props: {
  queryId: string[];
  onChange: (value: Partial<T> | undefined | null) => void;
  value?: Partial<T> | null;
  selectPlaceholder?: string;
  searchPlaceholder?: string;
  notFoundPlaceholder?: string;
  isClearable?: boolean;
  queryFn: (
    query?: string,
    exclude?: Array<string>,
    signal?: AbortSignal,
  ) => Promise<any>;
  labelFn: (
    value: Partial<T> | null | undefined,
    dictionary: Dictionary,
    locale: Locale,
  ) => string;
  exclude?: Array<Partial<T>> | null;
  mode: 'memory' | 'async';
  disabled?: boolean;
}) {
  if (props.mode === 'memory') {
    return <AutocompleteMemoryInput {...props} />;
  } else {
    return <AutocompleteAsyncInput {...props} />;
  }
}
