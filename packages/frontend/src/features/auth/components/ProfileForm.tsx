import { ImagesUploadDropzone } from '@/features/file/components/ImagesUploadDropzone';
import { Button } from '@/shared/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';
import { Switch } from '@/shared/components/ui/switch';
import { apiClient } from '@/shared/lib/apiClient';
import { useAuthStore } from '@/features/auth/authStore';
import { zodResolver } from '@hookform/resolvers/zod';
import type { FileUploaded } from '@project/backend/features/file/fileSchemas';
import { fileUploadedSchema } from '@project/backend/features/file/fileSchemas';
import { storage } from '@project/backend/features/permissions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useBlocker, useNavigate } from '@tanstack/react-router';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { LuLoader } from 'react-icons/lu';
import { toast } from 'sonner';
import { z } from 'zod';
import { UnsavedChangesModal } from '@/shared/components/UnsavedChangesModal';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { dictionaryFormat } from '@/shared/lib/dictionaryFormat';
import { useShallow } from 'zustand/react/shallow';

export function ProfileForm() {
  const {
    dictionary,
    currentMember,
    fetchCurrentUser,
    currentOrganization,
    currentUser,
  } = useAuthStore(
    useShallow((state) => ({
      dictionary: state.dictionary,
      currentMember: state.currentMember,
      fetchCurrentUser: state.fetchCurrentUser,
      currentOrganization: state.currentOrganization,
      currentUser: state.currentUser,
    })),
  );
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isBypassBlockerRef = React.useRef(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = React.useState(false);
  const [isLeavingOrganization, setIsLeavingOrganization] =
    React.useState(false);

  const schema = z.object({
    firstName: z.string().min(1).max(255),
    lastName: z.string().min(1).max(255),
    avatars: z.array(fileUploadedSchema),
    isNotificationsEnabled: z.boolean(),
  });

  const [initialValues] = React.useState({
    firstName: currentMember?.firstName || '',
    lastName: currentMember?.lastName || '',
    avatars: (currentMember?.avatars as FileUploaded[]) || [],
    isNotificationsEnabled: currentMember?.isNotificationsEnabled ?? true,
  });

  const form = useForm({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    defaultValues: initialValues,
  });

  const isDirty = form.formState.isDirty;

  const blocker = useBlocker({
    shouldBlockFn: () => !isBypassBlockerRef.current && isDirty,
    withResolver: true,
  });

  const mutation = useMutation({
    mutationFn: async (data: z.output<typeof schema>) => {
      return await apiClient.put('api/member/me', { json: data }).json();
    },
    onSuccess: async () => {
      await fetchCurrentUser();
      isBypassBlockerRef.current = true;
      navigate({ to: '/' });
      toast.success(dictionary.auth.profile.success);
    },
    onError: (error: any) => {
      toast.error(error.message || dictionary.shared.errors.unknown);
    },
  });

  const onSubmit = (data: z.output<typeof schema>) => {
    mutation.mutateAsync(data);
  };

  const handleLeaveOrganization = async () => {
    if (!currentOrganization || !currentUser) return;

    try {
      setIsLeavingOrganization(true);

      await apiClient
        .post(`api/organization/${currentOrganization.id}/leave`)
        .json<boolean>();

      await fetchCurrentUser();

      await queryClient.invalidateQueries();

      toast.success(dictionary.organization.switcher.leaveSuccess);

      setShowLeaveConfirm(false);
      setIsLeavingOrganization(false);

      isBypassBlockerRef.current = true;
      navigate({ to: '/' });
    } catch (error: any) {
      toast.error(error.message || dictionary.organization.switcher.leaveError);
      setShowLeaveConfirm(false);
      setIsLeavingOrganization(false);
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
          <div className="grid max-w-lg gap-1">
            <Field>
              <FieldLabel htmlFor="firstName" className="required">
                {dictionary.auth.profile.firstName}
              </FieldLabel>
              <Controller
                control={form.control}
                name="firstName"
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      id="firstName"
                      disabled={mutation.isPending || mutation.isSuccess}
                      autoFocus
                      {...field}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </>
                )}
              />
            </Field>
          </div>
          <div className="grid max-w-lg gap-1">
            <Field>
              <FieldLabel htmlFor="lastName" className="required">
                {dictionary.auth.profile.lastName}
              </FieldLabel>
              <Controller
                control={form.control}
                name="lastName"
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      id="lastName"
                      disabled={mutation.isPending || mutation.isSuccess}
                      {...field}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </>
                )}
              />
            </Field>
          </div>

          <div className="grid max-w-lg gap-1">
            <Field>
              <FieldLabel htmlFor="avatars">
                {dictionary.auth.profile.avatars}
              </FieldLabel>
              <Controller
                control={form.control}
                name="avatars"
                render={({ field, fieldState }) => (
                  <>
                    <ImagesUploadDropzone
                      value={field.value}
                      onChange={field.onChange}
                      storage={storage.memberAvatars}
                      max={1}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </>
                )}
              />
            </Field>
          </div>

          <div className="max-w-lg">
            <Field>
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <FieldLabel htmlFor="isNotificationsEnabled">
                    {dictionary.auth.profile.isNotificationsEnabled}
                  </FieldLabel>
                  <p className="text-muted-foreground text-sm">
                    {dictionary.auth.profile.isNotificationsEnabledHint}
                  </p>
                </div>
                <Controller
                  control={form.control}
                  name="isNotificationsEnabled"
                  render={({ field }) => (
                    <Switch
                      id="isNotificationsEnabled"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={mutation.isPending || mutation.isSuccess}
                    />
                  )}
                />
              </div>
            </Field>
          </div>
        </FieldGroup>

        <div className="flex gap-2">
          <Button
            disabled={mutation.isPending || mutation.isSuccess}
            type="submit"
          >
            {(mutation.isPending || mutation.isSuccess) && (
              <LuLoader className="mr-2 h-4 w-4 animate-spin" />
            )}
            {dictionary.auth.profile.button}
          </Button>

          <Button
            disabled={mutation.isPending || mutation.isSuccess}
            type="button"
            variant={'secondary'}
            onClick={() => {
              isBypassBlockerRef.current = true;
              navigate({ to: '/' });
            }}
          >
            {dictionary.auth.profile.cancel}
          </Button>

          <Button
            disabled={mutation.isPending || mutation.isSuccess}
            type="button"
            variant={'destructive'}
            onClick={() => setShowLeaveConfirm(true)}
          >
            {dictionary.organization.switcher.leave}
          </Button>
        </div>
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

      {showLeaveConfirm && (
        <ConfirmDialog
          title={dictionary.organization.switcher.leaveConfirmTitle}
          description={dictionaryFormat(
            dictionary.organization.switcher.leaveConfirmDescription,
            currentOrganization?.name,
          )}
          confirmText={dictionary.organization.switcher.leave}
          cancelText={dictionary.shared.cancel}
          variant="destructive"
          loading={isLeavingOrganization}
          onConfirm={handleLeaveOrganization}
          onCancel={() => setShowLeaveConfirm(false)}
        />
      )}
    </form>
  );
}
