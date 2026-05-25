import { FilterPreview } from '@/shared/components/dataTable/DataTableFilterPreview';
import { dataTableFilterRenders } from '@/shared/components/dataTable/dataTableFilterRenders';
import { EnumFieldError } from '@/shared/components/form/EnumFieldError';
import { SelectInput } from '@/shared/components/form/SelectInput';
import { SelectMultipleInput } from '@/shared/components/form/SelectMultipleInput';
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
import { memberEnumerators } from '@project/backend/features/member/memberEnumerators';
import { rolesIds } from '@project/backend/features/permissions';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { LuLoader, LuSearch } from 'react-icons/lu';
import { RxReset } from 'react-icons/rx';

const emptyValues = {
  fullName: '',
  email: '',
  roles: [],
  status: undefined as string | undefined,
};

export function MemberListFilter({ isLoading }: { isLoading: boolean }) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const locale = useAuthStore((state) => state.locale);
  const config = useAuthStore((state) => state.config);
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as Record<string, any>;
  const [expanded, setExpanded] = useState(false);

  const previewRenders: Record<string, any> = {
    fullName: {
      label: dictionary.member.fields.fullName,
    },
    email: {
      label: dictionary.member.fields.email,
    },
    roles: {
      label: dictionary.member.fields.roles,
      render: dataTableFilterRenders(locale, dictionary).enumeratorMultiple(
        dictionary.member.enumerators.roles,
      ),
    },
  };

  if (config?.organizationDefaultRole) {
    previewRenders.status = {
      label: dictionary.member.fields.status,
      render: (value: string) =>
        dictionaryEnumerator(dictionary.member.enumerators.status, value),
    };
  }

  const memberFilter = searchParams.memberFilter;

  const form = useForm({
    mode: 'onSubmit',
    defaultValues: emptyValues,
  });

  useEffect(() => {
    form.reset({
      ...emptyValues,
      ...memberFilter,
    });
  }, [searchParams]);

  const onRemove = (key: string) => {
    const updatedFilter = { ...memberFilter, [key]: undefined };
    navigate({
      search: {
        ...searchParams,
        memberFilter: updatedFilter,
      } as any,
    });
  };

  const onSubmit = (value: any) => {
    navigate({
      search: {
        ...searchParams,
        memberFilter: value,
      } as any,
    });
    setExpanded(false);
  };

  const doReset = () => {
    navigate({
      search: {
        ...searchParams,
        memberFilter: undefined,
      } as any,
    });
    setExpanded(false);
  };

  return (
    <div className="rounded-md border">
      <FilterPreview
        onClick={() => {
          setExpanded(!expanded);
        }}
        renders={previewRenders}
        values={memberFilter}
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
              <FieldLabel htmlFor="email">
                {dictionary.member.fields.email}
              </FieldLabel>
              <Controller
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <>
                    <Input id="email" {...field} disabled={isLoading} />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </>
                )}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="fullName">
                {dictionary.member.fields.fullName}
              </FieldLabel>
              <Controller
                control={form.control}
                name="fullName"
                render={({ field, fieldState }) => (
                  <>
                    <Input id="fullName" {...field} disabled={isLoading} />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </>
                )}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="roles">
                {dictionary.member.fields.roles}
              </FieldLabel>
              <Controller
                control={form.control}
                name="roles"
                render={({ field, fieldState }) => (
                  <>
                    <SelectMultipleInput
                      options={Object.keys(rolesIds).map((value) => ({
                        value,
                        label: dictionaryEnumerator(
                          dictionary.member.enumerators.roles,
                          value,
                        ),
                      }))}
                      disabled={isLoading}
                      value={field.value}
                      onChange={field.onChange}
                    />
                    <EnumFieldError
                      error={fieldState.error}
                      labelMap={dictionary.member.enumerators.roles}
                    />
                  </>
                )}
              />
            </Field>

            {config?.organizationDefaultRole && (
              <Field>
                <FieldLabel htmlFor="status">
                  {dictionary.member.fields.status}
                </FieldLabel>
                <Controller
                  control={form.control}
                  name="status"
                  render={({ field, fieldState }) => (
                    <>
                      <SelectInput
                        options={Object.keys(memberEnumerators.status).map(
                          (value) => ({
                            value,
                            label: dictionaryEnumerator(
                              dictionary.member.enumerators.status,
                              value,
                            ),
                          }),
                        )}
                        disabled={isLoading}
                        value={field.value}
                        onChange={field.onChange}
                      />
                      <EnumFieldError
                        error={fieldState.error}
                        labelMap={dictionary.member.enumerators.status}
                      />
                    </>
                  )}
                />
              </Field>
            )}
          </FieldGroup>
          <div className="mt-4 flex justify-end gap-2">
            <Button disabled={isLoading} type="submit" size={'sm'}>
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
              variant={'secondary'}
              onClick={doReset}
              size={'sm'}
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
