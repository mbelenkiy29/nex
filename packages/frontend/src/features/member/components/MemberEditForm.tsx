import { ImagesUploadDropzone } from '@/features/file/components';
import { EnumFieldError } from '@/shared/components/form/EnumFieldError';
import { SelectInput } from '@/shared/components/form/SelectInput';
import { Button } from '@/shared/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';
import { UnsavedChangesModal } from '@/shared/components/UnsavedChangesModal';
import { apiClient } from '@/shared/lib/apiClient';
import { useAuthStore } from '@/features/auth/authStore';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  MemberWithRelationships,
  memberUpdateInputSchema,
} from '@project/backend/features/member/memberSchemas';
import { rolesIds, storage } from '@project/backend/features/permissions';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useBlocker } from '@tanstack/react-router';
import { useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { LuLoader } from 'react-icons/lu';
import { toast } from 'sonner';
import { z } from 'zod';

export function MemberEditForm({
  member,
  onSuccess,
  onCancel,
}: {
  onCancel: () => void;
  onSuccess: (member: MemberWithRelationships) => void;
  member: Partial<MemberWithRelationships>;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);

  const queryClient = useQueryClient();
  const isBypassBlockerRef = useRef(false);

  const mutation = useMutation({
    mutationFn: (data: z.input<typeof memberUpdateInputSchema>) => {
      return apiClient
        .put(`api/member/${member?.id!}`, {
          json: data,
        })
        .json<MemberWithRelationships>();
    },
    onSuccess: (member: MemberWithRelationships) => {
      isBypassBlockerRef.current = true;

      queryClient.invalidateQueries({
        queryKey: ['member'],
      });

      onSuccess(member);

      toast.success(dictionary.member.edit.success);
    },
    onError: (error: Error) => {
      toast.error(error.message || dictionary.shared.errors.unknown);
    },
  });

  const form = useForm({
    resolver: zodResolver(memberUpdateInputSchema),
    defaultValues: {
      firstName: member?.firstName || '',
      lastName: member?.lastName || '',
      avatars: (member?.avatars as any) || [],
      role: (member?.role || 'member') as keyof typeof rolesIds,
    },
  });

  const isDirty = form.formState.isDirty;

  const blocker = useBlocker({
    shouldBlockFn: () => !isBypassBlockerRef.current && isDirty,
    withResolver: true,
  });

  const onSubmit = async (data: z.output<typeof memberUpdateInputSchema>) => {
    mutation.mutateAsync(data);
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
              <FieldLabel htmlFor="role" className="required">
                {dictionary.member.fields.role}
              </FieldLabel>
              <Controller
                control={form.control}
                name="role"
                render={({ field, fieldState }) => (
                  <>
                    <SelectInput
                      options={Object.keys(rolesIds).map((value) => ({
                        value,
                        label: dictionaryEnumerator(
                          dictionary.member.enumerators.roles,
                          value,
                        ),
                      }))}
                      disabled={mutation.isPending || mutation.isSuccess}
                      onChange={field.onChange}
                      value={field.value}
                    />
                    <EnumFieldError
                      error={fieldState.error}
                      labelMap={dictionary.member.enumerators.roles}
                    />
                  </>
                )}
              />
            </Field>
          </div>

          <div className="grid max-w-lg gap-1">
            <Field>
              <FieldLabel htmlFor="firstName" className="required">
                {dictionary.member.fields.firstName}
              </FieldLabel>
              <Controller
                control={form.control}
                name="firstName"
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      id="firstName"
                      {...field}
                      value={field.value ?? ''}
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

          <div className="grid max-w-lg gap-1">
            <Field>
              <FieldLabel htmlFor="lastName" className="required">
                {dictionary.member.fields.lastName}
              </FieldLabel>
              <Controller
                control={form.control}
                name="lastName"
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      id="lastName"
                      {...field}
                      value={field.value ?? ''}
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

          <div className="grid max-w-lg gap-1">
            <Field>
              <FieldLabel htmlFor="avatars">
                {dictionary.member.fields.avatars}
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
    </form>
  );
}
