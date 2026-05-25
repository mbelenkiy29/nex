import { pick } from 'lodash-es';
import { AuditLogWithAuthor } from '@project/backend/features/auditLog/auditLogSchemas';
import { objectDifferenceKeys } from '@/shared/lib/objectDifferenceKeys';

export function auditLogFindChanges(auditLog: AuditLogWithAuthor) {
  const oldData = (auditLog?.oldData as Record<string, object>) || {};
  const newData = (auditLog?.newData as Record<string, object>) || {};

  delete newData.updatedAt;
  delete newData.updatedByMember;
  delete newData.updatedByMemberId;
  delete newData.updatedByUserId;

  delete oldData.updatedAt;
  delete oldData.updatedByMember;
  delete oldData.updatedByMemberId;
  delete oldData.updatedByUserId;

  if (Object.keys(oldData).length === 0) {
    return {
      newData: newData,
      oldData: {},
    };
  }

  if (Object.keys(newData).length === 0) {
    return {
      newData: {},
      oldData: oldData,
    };
  }

  const fieldsDifferent = objectDifferenceKeys(newData, oldData);

  return {
    newData: pick(newData, fieldsDifferent),
    oldData: pick(oldData, fieldsDifferent),
  };
}
