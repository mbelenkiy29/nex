import { Button } from '@/shared/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';
import {
  ButtonGroup,
  ButtonGroupText,
} from '@/shared/components/ui/button-group';
import {
  InputGroup,
  InputGroupInput,
} from '@/shared/components/ui/input-group';
import { apiClient } from '@/shared/lib/apiClient';
import type { Organization } from '@project/backend/prisma/prismaTypes';
import { cn } from '@/shared/lib/utils';
import { getRedirectPath } from '@/shared/lib/getRedirectPath';
import { useAuthStore } from '@/features/auth/authStore';
import { getDomainSuffix } from '@/shared/lib/getDomainSuffix';
import { organizationFormSchema } from '@project/backend/features/organization/organizationSchemas';
import { Locale } from '@project/backend/translation/locales';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import { LuLoader } from 'react-icons/lu';
import { toast } from 'sonner';
import { z } from 'zod';
import { useShallow } from 'zustand/react/shallow';
import { useRef } from 'react';

export function OrganizationNewForm(_props: {
  locale: Locale;
  redirect?: string;
}) {
  const { dictionary, config, fetchCurrentUser } = useAuthStore(
    useShallow((state) => ({
      dictionary: state.dictionary,
      config: state.config,
      fetchCurrentUser: state.fetchCurrentUser,
    })),
  );
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { redirect } = _props;
  const lastGeneratedSlugRef = useRef<string>('');

  const schema = organizationFormSchema(
    config?.organizationMode || 'multi-domain',
    config?.organizationMultiDomainMode || 'subdomain',
    dictionary,
  );

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      slug: '',
      logosLight: [],
      logosDark: [],
      backgroundImageLight: [],
      backgroundImageDark: [],
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: z.output<typeof schema>) => {
      const organization = await apiClient
        .post('api/organization', {
          json: data,
        })
        .json<Organization>();

      await apiClient
        .post(`api/organization/${organization.id}/set-active`)
        .json();

      await fetchCurrentUser();

      return organization;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();

      toast.success(dictionary.auth.organization.create.success);
      const validRedirect = getRedirectPath(redirect);
      navigate({
        to: '/auth/profile-onboard',
        search: validRedirect !== '/' ? { redirect: validRedirect } : undefined,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || dictionary.shared.errors.unknown);
    },
  });

  const onSubmit = async (value: z.output<typeof schema>) => {
    mutation.mutateAsync(value);
  };

  const isMultiDomain = config?.organizationMode === 'multi-domain';
  const isSubdomainMode =
    isMultiDomain && config?.organizationMultiDomainMode === 'subdomain';

  const domainSuffix = isSubdomainMode ? getDomainSuffix() : '';

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Auto-update slug when name changes (only if slug matches the last generated one or is empty)
  const handleNameChange = (newName: string) => {
    if (!isSubdomainMode) return;

    const currentSlug = form.getValues('slug');
    const generatedSlug = generateSlug(newName);

    // Update slug if:
    // 1. Slug is empty, OR
    // 2. Current slug matches the last generated slug (meaning user didn't customize it)
    if (!currentSlug || currentSlug === lastGeneratedSlugRef.current) {
      form.setValue('slug', generatedSlug, { shouldDirty: true });
      lastGeneratedSlugRef.current = generatedSlug;
    }
  };

  return (
    <div className={cn('grid gap-6')}>
      <form
        onSubmit={(e) => {
          e.stopPropagation();
          form.handleSubmit(onSubmit)(e);
        }}
      >
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name" className="required">
              {dictionary.auth.organization.create.name}
            </FieldLabel>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <>
                  <Input
                    id="name"
                    {...field}
                    value={field.value ?? ''}
                    disabled={mutation.isPending || mutation.isSuccess}
                    autoFocus
                    data-testid="auth-organization-name-input"
                    onChange={(e) => {
                      field.onChange(e);
                      handleNameChange(e.target.value);
                    }}
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </>
              )}
            />
          </Field>

          {isMultiDomain && (
            <Field>
              <FieldLabel htmlFor="slug" className="required">
                {isSubdomainMode
                  ? dictionary.organization.form.subdomain
                  : dictionary.organization.form.domain}
              </FieldLabel>
              <Controller
                control={form.control}
                name="slug"
                render={({ field, fieldState }) => (
                  <>
                    <ButtonGroup>
                      <ButtonGroupText render={<label htmlFor="slug" />}>
                        https://
                      </ButtonGroupText>
                      <InputGroup>
                        <InputGroupInput
                          id="slug"
                          {...field}
                          value={field.value ?? ''}
                          disabled={mutation.isPending || mutation.isSuccess}
                          placeholder={
                            isSubdomainMode
                              ? dictionary.organization.form
                                  .slugPlaceholderSubdomain
                              : dictionary.organization.form
                                  .slugPlaceholderDomain
                          }
                          data-testid="auth-organization-slug-input"
                        />
                      </InputGroup>
                      {isSubdomainMode && (
                        <ButtonGroupText className="whitespace-nowrap">
                          .{domainSuffix}
                        </ButtonGroupText>
                      )}
                    </ButtonGroup>
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </>
                )}
              />
            </Field>
          )}
          <Button
            className="mt-2"
            disabled={mutation.isPending || mutation.isSuccess}
            type="submit"
            data-testid="auth-organization-submit-button"
          >
            {(mutation.isPending || mutation.isSuccess) && (
              <LuLoader className="mr-2 h-4 w-4 animate-spin" />
            )}
            {dictionary.auth.organization.create.button}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
