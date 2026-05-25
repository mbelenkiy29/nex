import { AuditLogWithAuthor } from '@project/backend/features/auditLog/auditLogSchemas';
import { Dictionary } from '@project/backend/translation/locales';

export function auditLogExporterMapper(
  auditLogs: AuditLogWithAuthor[],
  _dictionary: Dictionary,
): Record<string, string | null | undefined>[] {
  return auditLogs.map((auditLog) => {
    return {
      timestamp: String(auditLog.timestamp),
      firstName: auditLog.authorFirstName,
      lastName: auditLog.authorLastName,
      email: auditLog.authorEmail,
      entityName: auditLog.entityName,
      entityId: auditLog.entityId,
      operation: auditLog.operation,
      apiEndpoint: auditLog.apiEndpoint,
      apiHttpResponseCode: auditLog.apiHttpResponseCode,
    };
  });
}
