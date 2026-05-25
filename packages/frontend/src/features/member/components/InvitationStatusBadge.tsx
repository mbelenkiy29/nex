import { useAuthStore } from '@/features/auth/authStore';
import type { InvitationWithRelationships } from '@project/backend/features/invitation/invitationSchemas';
import { formatDateTime } from '@project/backend/shared/lib/formatDateTime';

export function InvitationStatusBadge({
  invitation,
}: {
  invitation: InvitationWithRelationships;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const status = invitation?.status;

  if (status === 'pending') {
    return (
      <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-yellow-600/20 ring-inset dark:bg-yellow-500/10 dark:text-yellow-500 dark:ring-yellow-500/20">
        {dictionary.invitation.enumerators.status.pending}
      </span>
    );
  }

  if (status === 'accepted') {
    return (
      <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20">
        {dictionary.invitation.enumerators.status.accepted}
      </span>
    );
  }

  if (status === 'rejected') {
    return (
      <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-600/20 ring-inset dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20">
        {dictionary.invitation.enumerators.status.rejected}
      </span>
    );
  }

  if (status === 'expired' || status === 'cancelled') {
    return (
      <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-500/10 ring-inset dark:bg-gray-400/10 dark:text-gray-400 dark:ring-gray-400/20">
        {dictionary.invitation.enumerators.status[status]}
      </span>
    );
  }

  return null;
}

export function InvitationExpiresAt({
  invitation,
}: {
  invitation: InvitationWithRelationships;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const expiresAt = new Date(invitation.expiresAt);
  const now = new Date();
  const isExpired = expiresAt < now;

  if (invitation.status !== 'pending') {
    return <span>-</span>;
  }

  return (
    <span className={isExpired ? 'text-red-500' : ''}>
      {formatDateTime(invitation.expiresAt, dictionary)}
    </span>
  );
}
