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
import { cn } from '@/shared/lib/utils';
import { getRedirectPath } from '@/shared/lib/getRedirectPath';
import { useAuthStore } from '@/features/auth/authStore';
import { profileOnboardFormSchema } from '@project/backend/features/member/memberSchemas';
import { storage } from '@project/backend/features/permissions';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import { LuLoader } from 'react-icons/lu';
import { toast } from 'sonner';
import { z } from 'zod';

export function ProfileOnboardForm() {
  const navigate = useNavigate();
  const dictionary = useAuthStore((state) => state.dictionary);
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);
  const search = useSearch({ from: '/auth/profile-onboard' }) as {
    redirect?: string;
  };

  const form = useForm({
    resolver: zodResolver(profileOnboardFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      avatars: [],
      isNotificationsEnabled: true,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: z.output<typeof profileOnboardFormSchema>) => {
      const response = await apiClient
        .put('api/member/me', { json: data })
        .json();
      await fetchCurrentUser();
      return response;
    },
    onSuccess: () => {
      toast.success(dictionary?.auth.profileOnboard.success);
      const validRedirect = getRedirectPath(search.redirect);
      navigate({ to: validRedirect });
    },
    onError: (error: Error) => {
      toast.error(error.message || dictionary?.shared.errors.unknown);
    },
  });

  const onSubmit = async (value: z.output<typeof profileOnboardFormSchema>) => {
    mutation.mutateAsync(value);
  };

  if (!dictionary) {
    return null;
  }

  return (
    <div className={cn('grid gap-6')}>
      <form
        onSubmit={(e) => {
          e.stopPropagation();
          form.handleSubmit(onSubmit)(e);
        }}
      >
        <FieldGroup>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="firstName" className="required">
                {dictionary.auth.profileOnboard.firstName}
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
                      autoFocus
                      data-testid="auth-profile-firstname-input"
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </>
                )}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="lastName" className="required">
                {dictionary.auth.profileOnboard.lastName}
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
                      data-testid="auth-profile-lastname-input"
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </>
                )}
              />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="avatars">
              {dictionary.auth.profileOnboard.avatars}
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

          <Field>
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <FieldLabel htmlFor="isNotificationsEnabled">
                  {dictionary.auth.profileOnboard.isNotificationsEnabled}
                </FieldLabel>
                <p className="text-muted-foreground text-sm">
                  {dictionary.auth.profileOnboard.isNotificationsEnabledHint}
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

          <Button
            className="mt-2"
            disabled={mutation.isPending || mutation.isSuccess}
            type="submit"
            data-testid="auth-profile-submit-button"
          >
            {(mutation.isPending || mutation.isSuccess) && (
              <LuLoader className="mr-2 h-4 w-4 animate-spin" />
            )}
            {dictionary.auth.profileOnboard.button}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
