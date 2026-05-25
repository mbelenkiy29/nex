import { MemberWithRelationships } from '@project/backend/features/member/memberSchemas';
import { User } from '@project/backend/prisma/prismaTypes';
import { acronym } from '@/shared/lib/acronym';

export function memberAcronym(
  user?: Partial<User> | null | undefined,
  member?: Partial<MemberWithRelationships> | null | undefined,
) {
  return acronym(member?.firstName, member?.lastName, user?.email);
}
