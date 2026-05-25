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
import { useShallow } from 'zustand/react/shallow';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { LuLoader } from 'react-icons/lu';
import { toast } from 'sonner';
import { z } from 'zod';

export function EmailChangeForm() {
  const { dictionary, currentUser } = useAuthStore(
    useShallow((state) => ({
      dictionary: state.dictionary,
      currentUser: state.currentUser,
    })),
  );
  const navigate = useNavigate();

  const schema = z.object({
    newEmail: z.string().email().min(1).max(255),
  });

  const [initialValues] = React.useState({
    newEmail: '',
  });

  const form = useForm({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    defaultValues: initialValues,
  });

  const mutation = useMutation({
    mutationFn: async (data: z.output<typeof schema>) => {
      const result = await authClient.changeEmail({
        newEmail: data.newEmail,
        callbackURL: '/',
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
      toast.success(dictionary.auth.emailChange.success);
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
              <FieldLabel htmlFor="currentEmail">
                {dictionary.auth.profile.email}
              </FieldLabel>
              <Input
                id="currentEmail"
                type="email"
                disabled
                value={currentUser?.email || ''}
              />
            </Field>
          </div>
          <div className="grid max-w-lg gap-1">
            <Field>
              <FieldLabel htmlFor="newEmail" className="required">
                {dictionary.auth.emailChange.newEmail}
              </FieldLabel>
              <Controller
                control={form.control}
                name="newEmail"
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      id="newEmail"
                      disabled={mutation.isPending || mutation.isSuccess}
                      type="email"
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
        </FieldGroup>

        <div className="flex gap-2">
          <Button
            disabled={mutation.isPending || mutation.isSuccess}
            type="submit"
          >
            {(mutation.isPending || mutation.isSuccess) && (
              <LuLoader className="mr-2 h-4 w-4 animate-spin" />
            )}
            {dictionary.auth.emailChange.button}
          </Button>

          <Button
            nativeButton={false}
            disabled={mutation.isPending || mutation.isSuccess}
            type="button"
            variant={'secondary'}
            render={<Link to="/" />}
          >
            {dictionary.auth.emailChange.cancel}
          </Button>
        </div>
      </div>
    </form>
  );
}
