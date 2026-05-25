import { Button } from '@/shared/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/shared/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Spinner } from '@/shared/components/ui/spinner';
import { getRedirectPath } from '@/shared/lib/getRedirectPath';
import { cn } from '@/shared/lib/utils';
import { useAuthStore } from '@/features/auth/authStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { MemberWithRelationships } from '@project/backend/features/member/memberSchemas';
import { organizationSelectSchema } from '@project/backend/features/organization/organizationSchemas';
import { Locale } from '@project/backend/translation/locales';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useRouter } from '@tanstack/react-router';
import { sortBy } from 'lodash-es';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { apiClient } from '@/shared/lib/apiClient';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { LuLoader } from 'react-icons/lu';

export function OrganizationSelect({
  members,
  invitations,
  redirect,
  onNoOptionsAvailable,
}: {
  locale: Locale;
  members?: Array<MemberWithRelationships>;
  invitations?: Array<any>;
  redirect?: string;
  onNoOptionsAvailable?: () => void;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const router = useRouter();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setActiveOrganization = useAuthStore(
    (state) => state.setActiveOrganization,
  );

  const [isAutoSelecting, setIsAutoSelecting] = useState(false);
  const [isAcceptingInvitation, setIsAcceptingInvitation] = useState(false);
  const [isRejectingInvitation, setIsRejectingInvitation] = useState(false);
  const [isSelectingOrganization, setIsSelectingOrganization] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);

  const activeMembers = members?.filter((member) => !member.disabled) || [];

  const form = useForm({
    resolver: zodResolver(organizationSelectSchema),
    defaultValues: {
      organizationId:
        activeMembers[0]?.organizationId ||
        (invitations?.[0] ? `invitation:${invitations[0].id}` : ''),
    },
  });

  // Auto-select organization if user has only one non-disabled membership (but not invitations)
  useEffect(() => {
    const autoSelectOrganization = async () => {
      if (activeMembers.length === 1 && !isAutoSelecting) {
        setIsAutoSelecting(true);
        try {
          await setActiveOrganization(activeMembers[0].organizationId);
          queryClient.invalidateQueries();
          const validRedirect = getRedirectPath(redirect);
          navigate({ to: validRedirect });
        } catch (error) {
          console.error('Failed to auto-select organization:', error);
          setIsAutoSelecting(false);
        }
      }
    };

    autoSelectOrganization();
  }, [
    activeMembers,
    setActiveOrganization,
    queryClient,
    router,
    navigate,
    redirect,
    isAutoSelecting,
  ]);

  const handleRejectClick = () => {
    setShowRejectConfirm(true);
  };

  const handleConfirmReject = async () => {
    const selectedValue = form.getValues('organizationId');
    const selectedInvitation = invitations?.find(
      (inv) => `invitation:${inv.id}` === selectedValue,
    );

    if (!selectedInvitation) return;

    try {
      setIsRejectingInvitation(true);
      await apiClient
        .post(`api/member/invitation/${selectedInvitation.id}/reject`)
        .json<boolean>();

      await queryClient.invalidateQueries({ queryKey: ['invitations', 'my'] });

      toast.success(dictionary.auth.organization.invitationRejected);

      const remainingInvitations = invitations?.filter(
        (inv) => inv.id !== selectedInvitation.id,
      );
      const hasNoOptions =
        !activeMembers.length && !remainingInvitations?.length;

      if (hasNoOptions) {
        // No more organizations or invitations, switch to 'new' mode
        setShowRejectConfirm(false);
        onNoOptionsAvailable?.();
      } else {
        const defaultValue =
          activeMembers[0]?.organizationId ||
          (remainingInvitations?.[0]
            ? `invitation:${remainingInvitations[0].id}`
            : '');

        form.reset({ organizationId: defaultValue });
        setShowRejectConfirm(false);
      }
    } catch (error) {
      console.error('Failed to reject invitation:', error);
      toast.error(dictionary.auth.organization.invitationRejectError);
    } finally {
      setIsRejectingInvitation(false);
    }
  };

  const onSubmit = async (value: z.output<typeof organizationSelectSchema>) => {
    if (value.organizationId) {
      const selectedInvitation = invitations?.find(
        (inv) => `invitation:${inv.id}` === value.organizationId,
      );

      if (selectedInvitation) {
        try {
          setIsAcceptingInvitation(true);
          await apiClient
            .post(`api/member/invitation/${selectedInvitation.id}/accept`)
            .json();

          await queryClient.invalidateQueries();

          await setActiveOrganization(selectedInvitation.organizationId);

          toast.success(dictionary.auth.organization.invitationAccepted);

          const validRedirect = getRedirectPath(redirect);
          navigate({ to: validRedirect });
        } catch (error) {
          console.error('Failed to accept invitation:', error);
          toast.error(dictionary.auth.organization.invitationAcceptError);
          setIsAcceptingInvitation(false);
        }
      } else {
        try {
          setIsSelectingOrganization(true);
          await setActiveOrganization(value.organizationId);

          queryClient.invalidateQueries();

          const validRedirect = getRedirectPath(redirect);

          navigate({ to: validRedirect });
        } catch (error) {
          console.error('Failed to select organization:', error);
          toast.error(dictionary.shared.errors.unknown);
          setIsSelectingOrganization(false);
        }
      }
    }
  };

  const sortedMembers = sortBy(activeMembers, [
    'organization.name',
  ]) as Array<MemberWithRelationships>;

  const sortedInvitations = sortBy(invitations || [], ['organization.name']);

  const selectedValue = form.watch('organizationId');
  const isInvitationSelected = selectedValue?.startsWith('invitation:');

  if (isAutoSelecting || isAcceptingInvitation || isRejectingInvitation) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <Spinner className="mx-auto mb-4" />
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            {isAcceptingInvitation
              ? dictionary.auth.organization.acceptingInvitation
              : isRejectingInvitation
                ? dictionary.auth.organization.rejectingInvitation
                : dictionary.auth.organization.select.autoSelecting}
          </div>
        </div>
      </div>
    );
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
          <Field>
            <FieldLabel htmlFor="organizationId">
              {dictionary.auth.organization.select.organization}
            </FieldLabel>
            <Controller
              control={form.control}
              name="organizationId"
              render={({ field, fieldState }) => (
                <>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="organizationId" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sortedMembers.map((member) => (
                        <SelectItem
                          key={member.organizationId}
                          value={member.organizationId}
                        >
                          {member.organization?.name}
                        </SelectItem>
                      ))}
                      {sortedInvitations.length > 0 &&
                        sortedMembers.length > 0 && (
                          <div className="px-2 py-1.5 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                            {dictionary.auth.organization.invitations ||
                              'Invitations'}
                          </div>
                        )}
                      {sortedInvitations.map((invitation) => {
                        return (
                          <SelectItem
                            key={invitation.id}
                            value={`invitation:${invitation.id}`}
                          >
                            {invitation.organization?.name ||
                              invitation.organizationId}{' '}
                            <span className="text-xs text-neutral-500">
                              ({dictionary.auth.organization.pendingInvitation})
                            </span>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </>
              )}
            />
          </Field>
          <div className="mt-2 flex gap-2">
            <Button
              type="submit"
              className="flex-1"
              disabled={form.formState.isSubmitting || isSelectingOrganization}
            >
              {(form.formState.isSubmitting || isSelectingOrganization) && (
                <LuLoader className="mr-2 h-4 w-4 animate-spin" />
              )}
              {dictionary.auth.organization.select.continue}
            </Button>
            {isInvitationSelected && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleRejectClick}
                disabled={isRejectingInvitation}
              >
                {dictionary.auth.organization.rejectInvitation}
              </Button>
            )}
          </div>
        </FieldGroup>
      </form>

      {showRejectConfirm && (
        <ConfirmDialog
          onConfirm={handleConfirmReject}
          onCancel={() => setShowRejectConfirm(false)}
          title={dictionary.auth.organization.rejectInvitationTitle}
          description={dictionary.auth.organization.rejectInvitationDescription}
          confirmText={dictionary.auth.organization.rejectInvitation}
          cancelText={dictionary.shared.cancel}
          variant="destructive"
          loading={isRejectingInvitation}
        />
      )}
    </div>
  );
}
