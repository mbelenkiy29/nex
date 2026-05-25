import { FilterPreview } from '@/shared/components/dataTable/DataTableFilterPreview';
import { Button } from '@/shared/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';
import { cn } from '@/shared/lib/utils';
import { useAuthStore } from '@/features/auth/authStore';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { LuLoader, LuSearch } from 'react-icons/lu';
import { RxReset } from 'react-icons/rx';

const emptyValues = {
  name: '',
};

export function ApiKeyListFilter({ isLoading }: { isLoading: boolean }) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as Record<string, any>;
  const [expanded, setExpanded] = useState(false);

  const previewRenders: Record<string, any> = {
    name: {
      label: dictionary.apiKey.fields.name,
    },
  };

  const apiKeyFilter = searchParams.apiKeyFilter;

  const form = useForm({
    mode: 'onSubmit',
    defaultValues: emptyValues,
  });

  useEffect(() => {
    form.reset({
      ...emptyValues,
      ...apiKeyFilter,
    });
  }, [searchParams]);

  const onRemove = (key: string) => {
    navigate({
      search: {
        ...searchParams,
        apiKeyFilter: { ...apiKeyFilter, [key]: undefined },
      } as any,
    });
  };

  const onSubmit = (value: any) => {
    navigate({
      search: {
        ...searchParams,
        apiKeyFilter: value,
      } as any,
    });
    setExpanded(false);
  };

  const doReset = () => {
    navigate({
      search: {
        ...searchParams,
        apiKeyFilter: undefined,
      } as any,
    });
    setExpanded(false);
  };

  return (
    <div className="rounded-md border">
      <FilterPreview
        onClick={() => setExpanded(!expanded)}
        renders={previewRenders}
        values={apiKeyFilter}
        expanded={expanded}
        onRemove={onRemove}
      />
      <div className={cn(expanded ? 'block' : 'hidden', 'p-4')}>
        <form
          onSubmit={(e) => {
            e.stopPropagation();
            form.handleSubmit(onSubmit)(e);
          }}
        >
          <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="name">
                {dictionary.apiKey.fields.name}
              </FieldLabel>
              <Controller
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <>
                    <Input id="name" {...field} disabled={isLoading} />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </>
                )}
              />
            </Field>
          </FieldGroup>
          <div className="mt-4 flex justify-end gap-2">
            <Button disabled={isLoading} type="submit" size="sm">
              {isLoading ? (
                <LuLoader className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LuSearch className="mr-2 h-4 w-4" />
              )}
              {dictionary.shared.search}
            </Button>
            <Button
              disabled={isLoading}
              type="button"
              variant="secondary"
              onClick={doReset}
              size="sm"
            >
              <RxReset className="mr-2 h-4 w-4" />
              {dictionary.shared.reset}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
