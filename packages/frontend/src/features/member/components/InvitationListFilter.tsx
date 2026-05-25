import { FilterPreview } from '@/shared/components/dataTable/DataTableFilterPreview';
import { dataTableFilterRenders } from '@/shared/components/dataTable/dataTableFilterRenders';
import { EnumFieldError } from '@/shared/components/form/EnumFieldError';
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
import { InvitationStatus } from '@project/backend/features/invitation/invitationSchemas';
import { rolesIds } from '@project/backend/features/permissions';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { LuLoader, LuSearch } from 'react-icons/lu';
import { RxReset } from 'react-icons/rx';

const emptyValues = {
  email: '',
  roles: [],
  statuses: [],
};

export function InvitationListFilter({ isLoading }: { isLoading: boolean }) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const locale = useAuthStore((state) => state.locale);
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as Record<string, any>;
  const [expanded, setExpanded] = useState(false);

  const previewRenders = {
    email: {
      label: dictionary.invitation.fields.email,
    },
    roles: {
      label: dictionary.invitation.fields.role,
      render: dataTableFilterRenders(locale, dictionary).enumeratorMultiple(
        dictionary.member.enumerators.roles,
      ),
    },
    statuses: {
      label: dictionary.invitation.fields.status,
      render: dataTableFilterRenders(locale, dictionary).enumeratorMultiple(
        dictionary.invitation.enumerators.status,
      ),
    },
  };

  const invitationFilter = searchParams.invitationFilter;

  const form = useForm({
    mode: 'onSubmit',
    defaultValues: emptyValues,
  });

  useEffect(() => {
    form.reset({
      ...emptyValues,
      ...invitationFilter,
    });
  }, [searchParams]);

  const onRemove = (key: string) => {
    const updatedFilter = { ...invitationFilter, [key]: undefined };
    navigate({
      search: {
        ...searchParams,
        invitationFilter: updatedFilter,
      } as any,
    });
  };

  const onSubmit = (value: any) => {
    navigate({
      search: {
        ...searchParams,
        invitationFilter: value,
      } as any,
    });
    setExpanded(false);
  };

  const doReset = () => {
    navigate({
      search: {
        ...searchParams,
        invitationFilter: undefined,
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
        values={invitationFilter}
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
                {dictionary.invitation.fields.email}
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
              <FieldLabel htmlFor="roles">
                {dictionary.invitation.fields.role}
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

            <Field>
              <FieldLabel htmlFor="statuses">
                {dictionary.invitation.fields.status}
              </FieldLabel>
              <Controller
                control={form.control}
                name="statuses"
                render={({ field, fieldState }) => (
                  <>
                    <SelectMultipleInput
                      options={Object.values(InvitationStatus).map((value) => ({
                        value,
                        label: dictionary.invitation.enumerators.status[value],
                      }))}
                      disabled={isLoading}
                      value={field.value}
                      onChange={field.onChange}
                    />
                    <EnumFieldError
                      error={fieldState.error}
                      labelMap={dictionary.invitation.enumerators.status}
                    />
                  </>
                )}
              />
            </Field>
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
