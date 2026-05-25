import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/shared/components/ui/field';
import {
  ButtonGroup,
  ButtonGroupText,
} from '@/shared/components/ui/button-group';
import {
  InputGroup,
  InputGroupInput,
} from '@/shared/components/ui/input-group';
import { useAuthStore } from '@/features/auth/authStore';
import { organizationFormSchema } from '@project/backend/features/organization/organizationSchemas';
import type { Organization } from '@project/backend/prisma/prismaTypes';
import { storage } from '@project/backend/features/permissions';
import { ImagesUploadDropzone } from '@/features/file/components/ImagesUploadDropzone';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';
import { LuLoader } from 'react-icons/lu';
import { toast } from 'sonner';
import { z } from 'zod';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { useState, useRef } from 'react';
import { dictionaryFormat } from '@project/backend/translation/dictionaryFormat';
import { useBlocker } from '@tanstack/react-router';
import { UnsavedChangesModal } from '@/shared/components/UnsavedChangesModal';
import { apiClient } from '@/shared/lib/apiClient';
import { router } from '@/features/router';
import { getDomainSuffix } from '@/shared/lib/getDomainSuffix';

export function OrganizationForm({
  organization,
  onSuccess,
  onCancel,
}: {
  onCancel: () => void;
  onSuccess: (organization: Organization) => void;
  organization?: Partial<Organization>;
}) {
  const {
    dictionary,
    hasPermission,
    setActiveOrganization,
    fetchCurrentUser,
    currentOrganization,
    config,
  } = useAuthStore(
    useShallow((state) => ({
      dictionary: state.dictionary,
      hasPermission: state.hasPermission,
      setActiveOrganization: state.setActiveOrganization,
      fetchCurrentUser: state.fetchCurrentUser,
      currentOrganization: state.currentOrganization,
      config: state.config,
    })),
  );

  const queryClient = useQueryClient();
  const isBypassBlockerRef = useRef(false);
  const lastGeneratedSlugRef = useRef<string>('');

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const isUpdate = !!organization?.id;
  const schema = organizationFormSchema(
    config?.organizationMode || 'multi-domain',
    config?.organizationMultiDomainMode || 'subdomain',
    dictionary,
  );

  const isSingleMode = config?.organizationMode === 'single';

  const hasPermissionToDelete =
    !isSingleMode &&
    hasPermission({
      organization: ['delete'],
    });

  const mutation = useMutation({
    mutationFn: async (data: z.input<typeof schema>) => {
      if (isUpdate) {
        return await apiClient
          .put(`api/organization/${organization!.id}`, {
            json: data,
          })
          .json<Organization>();
      } else {
        return await apiClient
          .post('api/organization', {
            json: data,
          })
          .json<Organization>();
      }
    },
    onSuccess: async (savedOrganization: Organization) => {
      isBypassBlockerRef.current = true;

      queryClient.invalidateQueries({
        queryKey: ['organization'],
      });

      await setActiveOrganization(savedOrganization.id);
      queryClient.invalidateQueries();

      onSuccess(savedOrganization);

      toast.success(
        isUpdate
          ? dictionary.organization.form.edit.success
          : dictionary.organization.form.new.success,
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || dictionary.shared.errors.unknown);
    },
  });

  const isMultiDomain = config?.organizationMode === 'multi-domain';
  const isSubdomainMode =
    isMultiDomain && config?.organizationMultiDomainMode === 'subdomain';

  const domainSuffix = isSubdomainMode ? getDomainSuffix() : '';

  const parseLogoField = (field: any): any[] => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    try {
      const parsed = JSON.parse(field);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: organization?.name || '',
      slug: organization?.slug || '',
      logosLight: parseLogoField((organization as any)?.logosLight),
      logosDark: parseLogoField((organization as any)?.logosDark),
      backgroundImageLight: parseLogoField(
        (organization as any)?.backgroundImageLight,
      ),
      backgroundImageDark: parseLogoField(
        (organization as any)?.backgroundImageDark,
      ),
    },
  });

  const isDirty = form.formState.isDirty;

  const blocker = useBlocker({
    shouldBlockFn: () => !isBypassBlockerRef.current && isDirty,
    withResolver: true,
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!organization?.id) throw new Error('No organization ID');
      return await apiClient
        .delete(`api/organization/${organization.id}`)
        .json<boolean>();
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ['organization'],
      });

      if (currentOrganization?.id === organization?.id) {
        await fetchCurrentUser();
        queryClient.invalidateQueries();
        router.invalidate();
      }

      toast.success(dictionary.organization.delete.success);
      onCancel();
    },
    onError: (error: Error) => {
      toast.error(error.message || dictionary.shared.errors.unknown);
    },
  });

  const onSubmit = async (data: z.output<typeof schema>) => {
    mutation.mutateAsync(data);
  };

  const handleDelete = () => {
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate();
    setShowConfirmDelete(false);
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
  };

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Auto-update slug when name changes unless user customized it
  const handleNameChange = (newName: string) => {
    if (!isSubdomainMode) return;

    const currentSlug = form.getValues('slug');
    const generatedSlug = generateSlug(newName);

    if (!currentSlug || currentSlug === lastGeneratedSlugRef.current) {
      form.setValue('slug', generatedSlug, { shouldDirty: true });
      lastGeneratedSlugRef.current = generatedSlug;
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.stopPropagation();
        form.handleSubmit(onSubmit)(e);
      }}
    >
      <div className="grid w-full gap-8">
        <FieldGroup>
          <div className="grid max-w-2xl gap-4">
            <Field>
              <FieldLabel htmlFor="name" className="required">
                {dictionary.organization.form.name}
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

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="logosLight">
                  {dictionary.organization.form.logoLight}
                </FieldLabel>
                <Controller
                  control={form.control}
                  name="logosLight"
                  render={({ field, fieldState }) => (
                    <>
                      <ImagesUploadDropzone
                        value={field.value}
                        onChange={field.onChange}
                        storage={storage.organizationLogos}
                        max={1}
                        disabled={mutation.isPending || mutation.isSuccess}
                      />
                      {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                      )}
                    </>
                  )}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="logosDark">
                  {dictionary.organization.form.logoDark}
                </FieldLabel>
                <Controller
                  control={form.control}
                  name="logosDark"
                  render={({ field, fieldState }) => (
                    <>
                      <ImagesUploadDropzone
                        value={field.value}
                        onChange={field.onChange}
                        storage={storage.organizationLogos}
                        max={1}
                        disabled={mutation.isPending || mutation.isSuccess}
                      />
                      {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                      )}
                    </>
                  )}
                />
              </Field>
            </div>

            {isMultiDomain && (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="backgroundImageLight">
                    {dictionary.organization.form.backgroundImageLight}
                  </FieldLabel>
                  <Controller
                    control={form.control}
                    name="backgroundImageLight"
                    render={({ field, fieldState }) => (
                      <>
                        <ImagesUploadDropzone
                          value={field.value}
                          onChange={field.onChange}
                          storage={storage.organizationLogos}
                          max={1}
                          disabled={mutation.isPending || mutation.isSuccess}
                        />
                        {fieldState.error && (
                          <FieldError>{fieldState.error.message}</FieldError>
                        )}
                      </>
                    )}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="backgroundImageDark">
                    {dictionary.organization.form.backgroundImageDark}
                  </FieldLabel>
                  <Controller
                    control={form.control}
                    name="backgroundImageDark"
                    render={({ field, fieldState }) => (
                      <>
                        <ImagesUploadDropzone
                          value={field.value}
                          onChange={field.onChange}
                          storage={storage.organizationLogos}
                          max={1}
                          disabled={mutation.isPending || mutation.isSuccess}
                        />
                        {fieldState.error && (
                          <FieldError>{fieldState.error.message}</FieldError>
                        )}
                      </>
                    )}
                  />
                </Field>
              </div>
            )}
          </div>
        </FieldGroup>

        <div className="flex gap-2">
          <Button
            disabled={mutation.isPending || mutation.isSuccess}
            type="submit"
          >
            {(mutation.isPending || mutation.isSuccess) && (
              <LuLoader className="mr-2 size-4 animate-spin" />
            )}
            {dictionary.shared.save}
          </Button>

          <Button
            disabled={mutation.isPending || mutation.isSuccess}
            type="button"
            variant={'secondary'}
            onClick={() => {
              isBypassBlockerRef.current = true;
              onCancel();
            }}
          >
            {dictionary.shared.cancel}
          </Button>

          {isUpdate && hasPermissionToDelete && (
            <Button
              disabled={
                mutation.isPending ||
                mutation.isSuccess ||
                deleteMutation.isPending
              }
              type="button"
              variant="destructive"
              onClick={handleDelete}
            >
              {deleteMutation.isPending && (
                <LuLoader className="mr-2 size-4 animate-spin" />
              )}
              {dictionary.shared.delete}
            </Button>
          )}
        </div>
      </div>

      {showConfirmDelete && (
        <ConfirmDialog
          title={dictionary.organization.delete.confirmTitle}
          description={dictionaryFormat(
            dictionary.organization.delete.confirmDescription,
            organization?.name,
          )}
          confirmText={dictionary.shared.delete}
          cancelText={dictionary.shared.cancel}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          variant="destructive"
          loading={deleteMutation.isPending}
        />
      )}

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
    </form>
  );
}
