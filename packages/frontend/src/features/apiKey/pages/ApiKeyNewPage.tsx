import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createLazyRoute,
  useNavigate,
  useBlocker,
} from '@tanstack/react-router';
import { apiClient } from '@/shared/lib/apiClient';
import { dictionaryFormat } from '@project/backend/translation/dictionaryFormat';
import { useAuthStore } from '@/features/auth/authStore';
import { dateTimeOptionalSchema } from '@project/backend/shared/schemas/dateTimeSchema';
import { PageHeader } from '@/shared/components/PageHeader';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/shared/components/ui/field';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { LuLoader, LuLock, LuLockOpen } from 'react-icons/lu';
import { useState, useMemo, useRef } from 'react';
import { CopyToClipboardButton } from '@/shared/components/CopyToClipboardButton';
import { SelectMultipleInput } from '@/shared/components/form/SelectMultipleInput';
import { DateTimePickerInput } from '@/shared/components/form/DateTimePickerInput';
import { accessControlStatement } from '@project/backend/features/permissions';
import {
  apiKeyMinExpiresInDays,
  apiKeyMaxExpiresInDays,
} from '@project/backend/features/auth/authConstants';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { UnsavedChangesModal } from '@/shared/components/UnsavedChangesModal';
import dayjs from 'dayjs';

function generatePermissionOptions(
  hasPermission: (permissions: any) => boolean,
) {
  const options: Array<{ value: string; label: string }> = [];

  for (const [resource, actions] of Object.entries(accessControlStatement)) {
    for (const action of actions) {
      if (hasPermission({ [resource]: [action] })) {
        const resourceLabel =
          resource.charAt(0).toUpperCase() + resource.slice(1);
        const actionLabel = action.charAt(0).toUpperCase() + action.slice(1);

        options.push({
          value: `${resource}:${action}`,
          label: `${resourceLabel} - ${actionLabel}`,
        });
      }
    }
  }

  return options.sort((a, b) => a.label.localeCompare(b.label));
}

export const apiKeyNewLazyRoute = createLazyRoute('/api-key/new')({
  component: ApiKeyNewPage,
});

const createFormSchema = (restrictPermissions: boolean, dictionary: any) =>
  z.object({
    name: z.string().min(1).max(255),
    expiresAt: dateTimeOptionalSchema
      .refine(
        (date) => {
          if (!date) return true;
          const diffSeconds = dayjs(date).diff(dayjs(), 'second');
          const minSeconds = apiKeyMinExpiresInDays * 24 * 60 * 60;
          return diffSeconds >= minSeconds;
        },
        {
          message: dictionaryFormat(
            dictionary.apiKey.fields.expiresAtMin,
            apiKeyMinExpiresInDays,
          ),
        },
      )
      .refine(
        (date) => {
          if (!date) return true;
          const diffSeconds = dayjs(date).diff(dayjs(), 'second');
          const maxSeconds = apiKeyMaxExpiresInDays * 24 * 60 * 60;
          return diffSeconds <= maxSeconds;
        },
        {
          message: dictionaryFormat(
            dictionary.apiKey.fields.expiresAtMax,
            apiKeyMaxExpiresInDays,
          ),
        },
      ),
    permissions: restrictPermissions
      ? z.array(z.string()).min(1, dictionary.apiKey.fields.permissionsRequired)
      : z.array(z.string()).optional(),
  });

export function ApiKeyNewPage() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const hasPermission = useAuthStore((state) => state.hasPermission);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [restrictPermissions, setRestrictPermissions] = useState(false);
  const isBypassBlockerRef = useRef(false);

  const permissionOptions = useMemo(
    () => generatePermissionOptions(hasPermission),
    [hasPermission],
  );

  const formSchema = useMemo(
    () => createFormSchema(restrictPermissions, dictionary),
    [restrictPermissions, dictionary],
  );

  const form = useForm({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      name: '',
      expiresAt: undefined as Date | undefined,
      permissions: [] as string[],
    },
  });

  const isDirty = form.formState.isDirty;

  const blocker = useBlocker({
    shouldBlockFn: () => !isBypassBlockerRef.current && isDirty,
    withResolver: true,
  });

  const mutation = useMutation({
    mutationFn: async (data: {
      name: string;
      expiresAt?: Date;
      permissions?: string[];
    }) => {
      let expiresInSeconds: number | undefined = undefined;
      if (data.expiresAt) {
        expiresInSeconds = dayjs(data.expiresAt).diff(dayjs(), 'second');
      }

      let permissions: Record<string, string[]> | undefined = undefined;
      if (
        restrictPermissions &&
        data.permissions &&
        data.permissions.length > 0
      ) {
        permissions = {};
        for (const permission of data.permissions) {
          const [resource, action] = permission.split(':');
          if (!permissions[resource]) {
            permissions[resource] = [];
          }
          permissions[resource].push(action);
        }
      }

      const result = await apiClient
        .post('api/api-key', {
          json: {
            name: data.name,
            expiresInSeconds,
            permissions,
          },
        })
        .json<{ key: string; id: string; name: string; expiresAt?: string }>();

      return result;
    },
    onSuccess: (data: any) => {
      isBypassBlockerRef.current = true;
      queryClient.invalidateQueries({ queryKey: ['apiKey'] });
      setCreatedKey(data.key); // Show the API key once (can't be retrieved again)
      toast.success(dictionary.apiKey.new.success);
    },
    onError: (error: any) => {
      toast.error(error.message || dictionary.apiKey.new.error);
    },
  });

  const onSubmit = (data: {
    name: string;
    expiresAt?: Date;
    permissions?: string[];
  }) => {
    mutation.mutate(data);
  };

  if (createdKey) {
    return (
      <div className="flex flex-1 flex-col p-6">
        <PageHeader
          items={[
            [dictionary.apiKey.list.menu, '/api-key'],
            [dictionary.shared.new],
          ]}
        />

        <div className="my-6 max-w-2xl space-y-6">
          <div className="rounded-lg bg-blue-100 p-6 dark:bg-blue-950">
            <h2 className="mb-4 text-lg font-semibold text-blue-900 dark:text-blue-100">
              {dictionary.apiKey.new.warning.title}
            </h2>
            <p className="mb-4 text-sm text-blue-800 dark:text-blue-200">
              {dictionary.apiKey.new.warning.message}
            </p>

            <div className="flex items-center gap-2">
              <code className="min-w-0 flex-1 overflow-x-auto rounded bg-white px-4 py-3 font-mono text-sm dark:bg-gray-900">
                {createdKey}
              </code>
              <CopyToClipboardButton text={createdKey} />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => {
                isBypassBlockerRef.current = true;
                navigate({ to: '/api-key' });
              }}
            >
              {dictionary.shared.done}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col p-6">
      <PageHeader
        items={[
          [dictionary.apiKey.list.menu, '/api-key'],
          [dictionary.shared.new],
        ]}
      />

      <div className="my-6 max-w-2xl">
        <form
          onSubmit={(e) => {
            e.stopPropagation();
            form.handleSubmit(onSubmit)(e);
          }}
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name" className="required">
                {dictionary.apiKey.fields.name}
              </FieldLabel>
              <Controller
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      id="name"
                      {...field}
                      placeholder={dictionary.apiKey.fields.namePlaceholder}
                      disabled={mutation.isPending}
                      autoFocus
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </>
                )}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="expiresAt">
                {dictionary.apiKey.fields.expiresAt}
              </FieldLabel>
              <Controller
                control={form.control}
                name="expiresAt"
                render={({ field, fieldState }) => (
                  <>
                    <DateTimePickerInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={
                        dictionary.apiKey.fields.expiresAtPlaceholder
                      }
                      disabled={mutation.isPending}
                      min={dayjs()
                        .add(apiKeyMinExpiresInDays, 'day')
                        .format('YYYY-MM-DDTHH:mm')}
                      max={dayjs()
                        .add(apiKeyMaxExpiresInDays, 'day')
                        .format('YYYY-MM-DDTHH:mm')}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </>
                )}
              />
            </Field>

            <div className="space-y-4">
              <div>
                <Button
                  type="button"
                  variant={restrictPermissions ? 'default' : 'outline'}
                  onClick={() => {
                    setRestrictPermissions(!restrictPermissions);
                    if (restrictPermissions) {
                      form.setValue('permissions', []);
                    }
                  }}
                  disabled={mutation.isPending}
                >
                  {restrictPermissions ? (
                    <>
                      <LuLock className="mr-2 size-4" />
                      {dictionary.apiKey.new.allowAllPermissions}
                    </>
                  ) : (
                    <>
                      <LuLockOpen className="mr-2 size-4" />
                      {dictionary.apiKey.new.restrictPermissions}
                    </>
                  )}
                </Button>
              </div>

              {restrictPermissions && (
                <>
                  <Alert>
                    <AlertDescription>
                      {dictionary.apiKey.new.permissionsDisclaimer}
                    </AlertDescription>
                  </Alert>

                  <Field>
                    <FieldLabel htmlFor="permissions" className="required">
                      {dictionary.apiKey.fields.permissions}
                    </FieldLabel>
                    <Controller
                      control={form.control}
                      name="permissions"
                      render={({ field, fieldState }) => (
                        <>
                          <SelectMultipleInput
                            value={field.value || []}
                            onChange={field.onChange}
                            placeholder={
                              dictionary.apiKey.fields.permissionsPlaceholder
                            }
                            options={permissionOptions}
                            disabled={mutation.isPending}
                          />
                          {fieldState.error && (
                            <FieldError>{fieldState.error.message}</FieldError>
                          )}
                        </>
                      )}
                    />
                  </Field>
                </>
              )}
            </div>
          </FieldGroup>

          <div className="mt-6 flex gap-2">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && (
                <LuLoader className="mr-2 size-4 animate-spin" />
              )}
              {dictionary.shared.save}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                isBypassBlockerRef.current = true;
                navigate({ to: '/api-key' });
              }}
              disabled={mutation.isPending}
            >
              {dictionary.shared.cancel}
            </Button>
          </div>
        </form>
      </div>

      {blocker.status === 'blocked' && (
        <UnsavedChangesModal
          title={dictionary.shared.unsavedChanges.title}
          message={dictionary.shared.unsavedChanges.message}
          discardText={dictionary.shared.unsavedChanges.proceed}
          cancelText={dictionary.shared.unsavedChanges.dismiss}
          saveChangesText={dictionary.shared.unsavedChanges.saveChanges}
          onDiscard={blocker.proceed}
          onCancel={blocker.reset}
          onSaveChanges={async () => {
            await form.handleSubmit(onSubmit)();
            blocker.proceed();
          }}
          loading={mutation.isPending}
        />
      )}
    </div>
  );
}
