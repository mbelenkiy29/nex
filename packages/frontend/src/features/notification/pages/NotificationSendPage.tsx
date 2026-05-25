import { createLazyRoute, useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/features/auth/authStore';
import { PageHeader } from '@/shared/components/PageHeader';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LuLoader } from 'react-icons/lu';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useBlocker } from '@tanstack/react-router';
import { Button } from '@/shared/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { apiClient } from '@/shared/lib/apiClient';
import { toast } from 'sonner';
import { useRef } from 'react';
import { UnsavedChangesModal } from '@/shared/components/UnsavedChangesModal';
import { rolesIds } from '@project/backend/features/permissions';
import {
  notificationSendSchema,
  NotificationSend,
} from '@project/backend/features/notification/notificationSchemas';

export const notificationSendLazyRoute = createLazyRoute('/notification/send')({
  component: NotificationSendPage,
});

export function NotificationSendPage() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isBypassBlockerRef = useRef(false);

  const mutation = useMutation({
    mutationFn: (data: NotificationSend) => {
      return apiClient
        .post('api/notification/send', {
          json: data,
        })
        .json<{ success: boolean; message: string }>();
    },
    onSuccess: () => {
      isBypassBlockerRef.current = true;

      queryClient.invalidateQueries({
        queryKey: ['notification'],
      });

      queryClient.invalidateQueries({
        queryKey: ['notification-unread-count'],
      });

      toast.success(dictionary.notification.send.success);
      navigate({ to: '/notification' });
    },
    onError: (error: Error) => {
      toast.error(error.message || dictionary.shared.errors.unknown);
    },
  });

  const form = useForm<NotificationSend>({
    resolver: zodResolver(notificationSendSchema),
    mode: 'onSubmit',
    defaultValues: {
      title: '',
      message: '',
      roles: [],
    },
  });

  const isDirty = form.formState.isDirty;

  const blocker = useBlocker({
    shouldBlockFn: () => !isBypassBlockerRef.current && isDirty,
    withResolver: true,
  });

  const onSubmit = async (data: NotificationSend) => {
    mutation.mutateAsync(data);
  };

  const handleCancel = () => {
    isBypassBlockerRef.current = true;
    navigate({ to: '/notification' });
  };

  const availableRoles = [
    { id: rolesIds.admin, label: dictionary.member.enumerators.roles.admin },
    { id: rolesIds.member, label: dictionary.member.enumerators.roles.member },
  ];

  return (
    <div className="flex flex-1 flex-col p-6">
      <PageHeader
        items={[
          [dictionary.notification.menu, '/notification'],
          [dictionary.notification.send.menu],
        ]}
      />
      <div className="my-10">
        <form
          onSubmit={(e) => {
            e.stopPropagation();
            form.handleSubmit(onSubmit)(e);
          }}
        >
          <div className="grid w-full gap-8">
            <Field>
              <div className="grid max-w-lg gap-1">
                <FieldLabel htmlFor="title" className="required">
                  {dictionary.notification.send.fields.title}
                </FieldLabel>
                <Controller
                  control={form.control}
                  name="title"
                  render={({ field, fieldState }) => (
                    <>
                      <Input
                        id="title"
                        {...field}
                        value={field.value ?? ''}
                        disabled={mutation.isPending || mutation.isSuccess}
                        placeholder={
                          dictionary.notification.send.placeholders.title
                        }
                        autoFocus
                      />
                      {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                      )}
                    </>
                  )}
                />
              </div>
            </Field>

            <Field>
              <div className="grid max-w-lg gap-1">
                <FieldLabel htmlFor="message" className="required">
                  {dictionary.notification.send.fields.message}
                </FieldLabel>
                <Controller
                  control={form.control}
                  name="message"
                  render={({ field, fieldState }) => (
                    <>
                      <Textarea
                        id="message"
                        {...field}
                        value={field.value ?? ''}
                        disabled={mutation.isPending || mutation.isSuccess}
                        placeholder={
                          dictionary.notification.send.placeholders.message
                        }
                        rows={6}
                      />
                      {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                      )}
                    </>
                  )}
                />
              </div>
            </Field>

            <Field>
              <div className="grid max-w-lg gap-1">
                <FieldLabel className="required">
                  {dictionary.notification.send.fields.roles}
                </FieldLabel>
                <Controller
                  control={form.control}
                  name="roles"
                  render={({ field, fieldState }) => (
                    <>
                      <div className="space-y-2">
                        {availableRoles.map((role) => (
                          <div
                            key={role.id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`role-${role.id}`}
                              checked={field.value.includes(role.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...field.value, role.id]);
                                } else {
                                  field.onChange(
                                    field.value.filter((r) => r !== role.id),
                                  );
                                }
                              }}
                              disabled={
                                mutation.isPending || mutation.isSuccess
                              }
                            />
                            <label
                              htmlFor={`role-${role.id}`}
                              className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {role.label}
                            </label>
                          </div>
                        ))}
                      </div>
                      {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                      )}
                    </>
                  )}
                />
              </div>
            </Field>

            <div className="flex gap-2">
              <Button
                disabled={mutation.isPending || mutation.isSuccess}
                type="submit"
              >
                {(mutation.isPending || mutation.isSuccess) && (
                  <LuLoader className="mr-2 h-4 w-4 animate-spin" />
                )}
                {dictionary.shared.save}
              </Button>

              <Button
                disabled={mutation.isPending || mutation.isSuccess}
                type="button"
                variant={'secondary'}
                onClick={handleCancel}
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
      </div>
    </div>
  );
}
