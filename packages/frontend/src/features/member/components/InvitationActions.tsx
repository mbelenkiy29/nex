import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLinkItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { apiClient } from '@/shared/lib/apiClient';
import { useAuthStore } from '@/features/auth/authStore';
import type { InvitationWithRelationships } from '@project/backend/features/invitation/invitationSchemas';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { LuEye, LuHistory, LuMail, LuTrash2 } from 'react-icons/lu';
import { RxDotsHorizontal } from 'react-icons/rx';
import { toast } from 'sonner';
import { Link } from '@tanstack/react-router';

export function InvitationActions({
  invitation,
}: {
  invitation: InvitationWithRelationships;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const hasPermission = useAuthStore((state) => state.hasPermission);

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  const hasPermissionToResend = hasPermission({
    invitation: ['resend'],
  });

  const hasPermissionToCancel = hasPermission({
    invitation: ['cancel'],
  });

  const hasPermissionToRead = hasPermission({
    invitation: ['read'],
  });

  const hasPermissionToAuditLogs = hasPermission({
    auditLog: ['read'],
  });

  const resendMutation = useMutation({
    mutationFn: () => {
      return apiClient.post(`api/member/invitation/${invitation.id}/resend`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['invitation'],
      });
      toast.success(dictionary.invitation.resend.success);
    },
    onError: (error: any) => {
      toast.error(error.message || dictionary.shared.errors.unknown);
    },
  });

  const cancelMutation = useMutation({
    mutationFn: () => {
      return apiClient.delete(`api/member/invitation/${invitation.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['invitation'],
      });
      toast.success(dictionary.invitation.cancel.success);
    },
    onError: (error: any) => {
      toast.error(error.message || dictionary.shared.errors.unknown);
    },
  });

  const isPending = invitation.status === 'pending';
  const canResend = isPending && hasPermissionToResend;
  const canCancel = isPending && hasPermissionToCancel;

  if (
    !hasPermissionToRead &&
    !canResend &&
    !canCancel &&
    !hasPermissionToAuditLogs
  ) {
    return null;
  }

  return (
    <div className="flex justify-end gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              className="aria-expanded:bg-muted flex h-8 w-8 p-0"
            />
          }
        >
          <RxDotsHorizontal className="h-4 w-4" />
          <span className="sr-only">{dictionary.shared.openMenu}</span>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-[160px]">
          {hasPermissionToRead && (
            <DropdownMenuLinkItem
              render={
                <Link
                  to="/member/invitation/$id"
                  params={{ id: invitation.id }}
                  preload="intent"
                />
              }
            >
              <LuEye className="text-foreground/50 mr-2 h-4 w-4" />
              {dictionary.shared.view}
            </DropdownMenuLinkItem>
          )}

          {canResend && (
            <DropdownMenuItem
              onClick={() => resendMutation.mutateAsync()}
              disabled={resendMutation.isPending}
            >
              <LuMail className="text-foreground/50 mr-2 h-4 w-4" />
              <span>{dictionary.invitation.actions.resend}</span>
            </DropdownMenuItem>
          )}

          {hasPermissionToAuditLogs && (
            <DropdownMenuLinkItem
              render={
                <Link
                  to={`/audit-log`}
                  search={{
                    filter: {
                      entityId: invitation.id,
                    },
                  }}
                  preload="intent"
                />
              }
            >
              <LuHistory className="text-foreground/50 mr-2 h-4 w-4" />
              {dictionary.auditLog.list.menu}
            </DropdownMenuLinkItem>
          )}

          {canCancel && (
            <DropdownMenuItem
              onClick={() => setCancelDialogOpen(true)}
              disabled={cancelMutation.isPending}
            >
              <LuTrash2 className="text-foreground/50 mr-2 h-4 w-4" />
              <span>{dictionary.invitation.actions.cancel}</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {cancelDialogOpen && (
        <ConfirmDialog
          title={dictionary.invitation.cancel.confirmTitle}
          confirmText={dictionary.shared.delete}
          variant="destructive"
          cancelText={dictionary.shared.cancel}
          onConfirm={() => {
            cancelMutation.mutateAsync();
            setCancelDialogOpen(false);
          }}
          onCancel={() => setCancelDialogOpen(false)}
        />
      )}
    </div>
  );
}
