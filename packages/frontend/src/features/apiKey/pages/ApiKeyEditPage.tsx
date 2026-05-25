import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createLazyRoute, useNavigate } from '@tanstack/react-router';
import { apiClient } from '@/shared/lib/apiClient';
import { useAuthStore } from '@/features/auth/authStore';
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
import { LuLoader } from 'react-icons/lu';
import { Switch } from '@/shared/components/ui/switch';
import { useBlocker } from '@tanstack/react-router';
import { UnsavedChangesModal } from '@/shared/components/UnsavedChangesModal';
import { apiKeyEditRoute } from '@/features/apiKey/apiKeyRouter';
import * as React from 'react';

type ApiKey = {
  id: string;
  name: string | null;
  enabled: boolean;
};

const formSchema = z.object({
  name: z.string().min(1).max(255),
  enabled: z.boolean(),
});

export const apiKeyEditLazyRoute = createLazyRoute('/api-key/$id/edit')({
  component: ApiKeyEditPage,
});

export function ApiKeyEditPage() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = apiKeyEditRoute.useParams();
  const isBypassBlockerRef = React.useRef(false);

  const query = useQuery({
    queryKey: ['apiKey', id],
    queryFn: async ({ signal }) => {
      return await apiClient
        .get(`api/api-key/${id}`, { signal })
        .json<ApiKey>();
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
  });

  const form = useForm({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      name: '',
      enabled: true,
    },
    values: query.data
      ? {
          name: query.data.name || '',
          enabled: query.data.enabled,
        }
      : undefined,
  });

  const isDirty = form.formState.isDirty;

  const blocker = useBlocker({
    shouldBlockFn: () => !isBypassBlockerRef.current && isDirty,
    withResolver: true,
  });

  const mutation = useMutation({
    mutationFn: async (data: { name: string; enabled: boolean }) => {
      return await apiClient
        .put(`api/api-key/${id}`, {
          json: data,
        })
        .json<ApiKey>();
    },
    onSuccess: () => {
      isBypassBlockerRef.current = true;
      queryClient.invalidateQueries({ queryKey: ['apiKey'] });
      toast.success(dictionary.apiKey.edit.success);
      navigate({ to: '/api-key' });
    },
    onError: (error: any) => {
      toast.error(error.message || dictionary.apiKey.edit.error);
    },
  });

  const onSubmit = (data: { name: string; enabled: boolean }) => {
    mutation.mutate(data);
  };

  if (query.isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <LuLoader className="text-muted-foreground size-8 animate-spin" />
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className="flex flex-1 flex-col p-6">
        <PageHeader
          items={[
            [dictionary.apiKey.list.menu, '/api-key'],
            [dictionary.shared.edit],
          ]}
        />
        <div className="my-6 max-w-2xl">
          <p className="text-destructive">
            {query.error?.message || dictionary.apiKey.errors.fetch}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col p-6">
      <PageHeader
        items={[
          [dictionary.apiKey.list.menu, '/api-key'],
          [query.data?.name || dictionary.apiKey.fields.namePlaceholder],
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
              <FieldLabel htmlFor="enabled">
                {dictionary.apiKey.fields.enabled}
              </FieldLabel>
              <Controller
                control={form.control}
                name="enabled"
                render={({ field, fieldState }) => (
                  <div>
                    <Switch
                      id="enabled"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={mutation.isPending}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </div>
                )}
              />
            </Field>
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
