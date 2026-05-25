import { InvitationWithRelationships } from '@project/backend/features/invitation/invitationSchemas';
import { dictionary as Dictionary } from '@project/backend/translation/en/en';
import type { Locale } from '@project/backend/translation/locales';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';

export function invitationExporterMapper(
  invitations: InvitationWithRelationships[],
  context: { dictionary: typeof Dictionary; locale: Locale },
): Record<string, string | null | undefined>[] {
  return invitations.map((invitation) => {
    return {
      id: invitation.id,
      email: invitation.email,
      role: dictionaryEnumerator(
        context.dictionary.member.enumerators.roles,
        invitation.role,
      ),
      status: dictionaryEnumerator(
        context.dictionary.invitation.enumerators.status,
        invitation.status,
      ),
      invitedBy: invitation.inviter?.email,
      expiresAt: String(invitation.expiresAt),
      createdAt: String(invitation.createdAt),
    };
  });
}
