import { MemberAutocompleteInput } from '@/features/member/components/MemberAutocompleteInput';
import { FilterPreview } from '@/shared/components/dataTable/DataTableFilterPreview';
import { DataTableQueryParams } from '@/shared/components/dataTable/DataTableQueryParams';
import { dataTableFilterRenders } from '@/shared/components/dataTable/dataTableFilterRenders';
import { DateTimePickerRangeInput } from '@/shared/components/form/DateTimePickerRangeInput';
import { EnumFieldError } from '@/shared/components/form/EnumFieldError';
import { SelectMultipleInput } from '@/shared/components/form/SelectMultipleInput';
import { TagsInput } from '@/shared/components/form/TagsInput';
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
import { auditLogOperations } from '@project/backend/features/auditLog/auditLogOperations';
import { memberLabel } from '@project/backend/features/member/memberLabel';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { LuLoader, LuSearch } from 'react-icons/lu';
import { RxReset } from 'react-icons/rx';

const emptyValues = {
  apiKey: null,
  member: null,
  entityId: '',
  apiHttpResponseCode: '',
  apiEndpoint: '',
  operations: [],
  entityNames: [],
  timestampRange: [],
};

export function AuditLogListFilter({ isLoading }: { isLoading: boolean }) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const locale = useAuthStore((state) => state.locale);
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as Record<string, any>;
  const [expanded, setExpanded] = useState(false);

  const previewRenders = {
    entityNames: {
      label: dictionary.auditLog.fields.entityNames,
      render: dataTableFilterRenders(locale, dictionary).stringArray(),
    },
    entityId: {
      label: dictionary.auditLog.fields.entityId,
    },
    operations: {
      label: dictionary.auditLog.fields.operations,
      render: dataTableFilterRenders(locale, dictionary).enumeratorMultiple(
        dictionary.auditLog.enumerators.operation,
      ),
    },
    timestampRange: {
      label: dictionary.auditLog.fields.timestamp,
      render: dataTableFilterRenders(locale, dictionary).dateTimeRange(),
    },
    member: {
      label: dictionary.auditLog.fields.member,
      render: dataTableFilterRenders(locale, dictionary).relationToOne(
        memberLabel,
      ),
    },
    apiKey: {
      label: dictionary.auditLog.fields.apiKey,
    },
    apiHttpResponseCode: {
      label: dictionary.auditLog.fields.apiHttpResponseCode,
    },
    apiEndpoint: {
      label: dictionary.auditLog.fields.apiEndpoint,
    },
  };

  const filter = searchParams.filter;

  const form = useForm({
    mode: 'onSubmit',
    defaultValues: emptyValues,
  });

  useEffect(() => {
    form.reset({
      ...emptyValues,
      ...filter,
    });
  }, [searchParams]);

  const onRemove = (key: string) => {
    DataTableQueryParams.onFilterChange(
      { ...filter, [key]: undefined },
      navigate,
      searchParams,
    );
  };

  const onSubmit = (value: any) => {
    DataTableQueryParams.onFilterChange(value, navigate, searchParams);
    setExpanded(false);
  };

  const doReset = () => {
    DataTableQueryParams.onFilterChange({}, navigate, searchParams);
    setExpanded(false);
  };

  return (
    <div className="rounded-md border">
      <FilterPreview
        onClick={() => {
          setExpanded(!expanded);
        }}
        renders={previewRenders}
        values={filter}
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
              <FieldLabel htmlFor="timestampRange">
                {dictionary.auditLog.fields.timestamp}
              </FieldLabel>
              <Controller
                control={form.control}
                name="timestampRange"
                render={({ field, fieldState }) => (
                  <>
                    <DateTimePickerRangeInput
                      locale={locale}
                      disabled={isLoading}
                      isClearable={true}
                      value={field.value}
                      onChange={field.onChange}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </>
                )}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="member">
                {dictionary.auditLog.fields.member}
              </FieldLabel>
              <Controller
                control={form.control}
                name="member"
                render={({ field, fieldState }) => (
                  <>
                    <MemberAutocompleteInput
                      value={field.value}
                      onChange={field.onChange}
                      mode="memory"
                      isClearable={true}
                      disabled={isLoading}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </>
                )}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="entityNames">
                {dictionary.auditLog.fields.entityNames}
              </FieldLabel>
              <Controller
                control={form.control}
                name="entityNames"
                render={({ field, fieldState }) => (
                  <>
                    <TagsInput
                      separator=","
                      disabled={isLoading}
                      value={field.value}
                      onChange={field.onChange}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </>
                )}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="entityId">
                {dictionary.auditLog.fields.entityId}
              </FieldLabel>
              <Controller
                control={form.control}
                name="entityId"
                render={({ field, fieldState }) => (
                  <>
                    <Input id="entityId" {...field} disabled={isLoading} />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </>
                )}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="operations">
                {dictionary.auditLog.fields.operations}
              </FieldLabel>
              <Controller
                control={form.control}
                name="operations"
                render={({ field, fieldState }) => (
                  <>
                    <SelectMultipleInput
                      options={Object.values(auditLogOperations).map(
                        (value) => ({
                          value,
                          label: dictionaryEnumerator(
                            dictionary.auditLog.enumerators.operation,
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
                      labelMap={dictionary.auditLog.enumerators.operation}
                    />
                  </>
                )}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="apiHttpResponseCode">
                {dictionary.auditLog.fields.apiHttpResponseCode}
              </FieldLabel>
              <Controller
                control={form.control}
                name="apiHttpResponseCode"
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      id="apiHttpResponseCode"
                      {...field}
                      value={field.value ?? ''}
                      disabled={isLoading}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </>
                )}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="apiEndpoint">
                {dictionary.auditLog.fields.apiEndpoint}
              </FieldLabel>
              <Controller
                control={form.control}
                name="apiEndpoint"
                render={({ field, fieldState }) => (
                  <>
                    <Input id="apiEndpoint" {...field} disabled={isLoading} />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
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
