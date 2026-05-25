import { memberLabel } from '@project/backend/features/member/memberLabel';
import { MemberWithRelationships } from '@project/backend/features/member/memberSchemas';
import { dictionary as Dictionary } from '@project/backend/translation/en/en';
import type { Locale } from '@project/backend/translation/locales';

export function memberExporterMapper(
  members: MemberWithRelationships[],
  _context: { dictionary: typeof Dictionary; locale: Locale },
): Record<string, string | null | undefined>[] {
  return members.map((member) => {
    return {
      id: member.id,
      email: member.user?.email,
      fullName: member.fullName,
      firstName: member.firstName,
      lastName: member.lastName,
      role: member.role,
      createdByMember: memberLabel(member.createdByMember),
      createdAt: String(member.createdAt),
      updatedByMember: memberLabel(member.updatedByMember),
      updatedAt: String(member.updatedAt),
    };
  });
}
