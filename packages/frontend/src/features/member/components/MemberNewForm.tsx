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
  memberCreateInputSchema,
} from '@project/backend/features/member/memberSchemas';
import { rolesIds } from '@project/backend/features/permissions';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useBlocker } from '@tanstack/react-router';
import { useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { LuLoader } from 'react-icons/lu';
import { toast } from 'sonner';
import { z } from 'zod';

export function MemberNewForm({
  member,
  onSuccess,
  onCancel,
}: {
  onCancel: () => void;
  onSuccess: () => void;
  member?: Partial<MemberWithRelationships>;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);

  const queryClient = useQueryClient();
  const isBypassBlockerRef = useRef(false);

  const mutation = useMutation({
    mutationFn: async (data: z.input<typeof memberCreateInputSchema>) => {
      await apiClient
        .post('api/member/invite', {
          json: {
            email: data.email,
            role: data.role,
          },
        })
        .json();
    },
    onSuccess: () => {
      isBypassBlockerRef.current = true;

      queryClient.invalidateQueries({
        queryKey: ['invitation'],
      });

      onSuccess();

      toast.success(dictionary.member.new.success);
    },
    onError: (error: Error) => {
      toast.error(error.message || dictionary.shared.errors.unknown);
    },
  });

  const form = useForm({
    resolver: zodResolver(memberCreateInputSchema),
    defaultValues: {
      email: member?.user?.email || '',
      role: (member?.role || 'member') as keyof typeof rolesIds,
    },
  });

  const isDirty = form.formState.isDirty;

  const blocker = useBlocker({
    shouldBlockFn: () => !isBypassBlockerRef.current && isDirty,
    withResolver: true,
  });

  const onSubmit = async (data: z.output<typeof memberCreateInputSchema>) => {
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
              <FieldLabel htmlFor="email" className="required">
                {dictionary.member.fields.email}
              </FieldLabel>
              <Controller
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      id="email"
                      {...field}
                      value={field.value ?? ''}
                      disabled={mutation.isPending || mutation.isSuccess}
                      autoFocus
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
