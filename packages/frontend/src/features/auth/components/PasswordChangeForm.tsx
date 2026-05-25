import { Button } from '@/shared/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';
import { authClient } from '@/features/auth/authClient';
import { useAuthStore } from '@/features/auth/authStore';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { LuLoader } from 'react-icons/lu';
import { toast } from 'sonner';
import { z } from 'zod';

export function PasswordChangeForm() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const navigate = useNavigate();

  const schema = z
    .object({
      oldPassword: z.string().min(1).max(255),
      newPassword: z.string().min(8).max(255),
      newPasswordConfirmation: z.string().min(8).max(255),
    })
    .refine(
      (data) => {
        return data.newPassword === data.newPasswordConfirmation;
      },
      {
        message: dictionary.auth.passwordChange.mustMatch,
        path: ['newPasswordConfirmation'],
      },
    );

  const [initialValues] = React.useState({
    oldPassword: '',
    newPassword: '',
    newPasswordConfirmation: '',
  });

  const form = useForm({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    defaultValues: initialValues,
  });

  const mutation = useMutation({
    mutationFn: async (data: z.output<typeof schema>) => {
      const result = await authClient.changePassword({
        newPassword: data.newPassword,
        currentPassword: data.oldPassword,
        revokeOtherSessions: true,
      });

      if (result.error) {
        throw new Error(
          dictionaryEnumerator(dictionary.auth.errors, result.error.code) ||
            dictionary.shared.errors.unknown,
        );
      }

      return result.data;
    },
    onSuccess: () => {
      navigate({ to: '/' });
      toast.success(dictionary.auth.passwordChange.success);
    },
    onError: (error: any) => {
      console.error(error);
      toast.error(error.message || dictionary.shared.errors.unknown);
    },
  });

  const onSubmit = (data: z.output<typeof schema>) => {
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
              <FieldLabel htmlFor="oldPassword" className="required">
                {dictionary.auth.passwordChange.oldPassword}
              </FieldLabel>
              <Controller
                control={form.control}
                name="oldPassword"
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      id="oldPassword"
                      disabled={mutation.isPending || mutation.isSuccess}
                      type="password"
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
              <FieldLabel htmlFor="newPassword" className="required">
                {dictionary.auth.passwordChange.newPassword}
              </FieldLabel>
              <Controller
                control={form.control}
                name="newPassword"
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      id="newPassword"
                      disabled={mutation.isPending || mutation.isSuccess}
                      type="password"
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
              <FieldLabel
                htmlFor="newPasswordConfirmation"
                className="required"
              >
                {dictionary.auth.passwordChange.newPasswordConfirmation}
              </FieldLabel>
              <Controller
                control={form.control}
                name="newPasswordConfirmation"
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      id="newPasswordConfirmation"
                      disabled={mutation.isPending || mutation.isSuccess}
                      type="password"
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
        </FieldGroup>

        <div className="flex gap-2">
          <Button
            disabled={mutation.isPending || mutation.isSuccess}
            type="submit"
          >
            {(mutation.isPending || mutation.isSuccess) && (
              <LuLoader className="mr-2 h-4 w-4 animate-spin" />
            )}
            {dictionary.auth.passwordChange.button}
          </Button>

          <Button
            nativeButton={false}
            disabled={mutation.isPending || mutation.isSuccess}
            type="button"
            variant={'secondary'}
            render={<Link to="/" />}
          >
            {dictionary.auth.passwordChange.cancel}
          </Button>
        </div>
      </div>
    </form>
  );
}
