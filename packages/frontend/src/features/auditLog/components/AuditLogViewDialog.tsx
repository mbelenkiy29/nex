import { AuditLogApiHttpResponseCodeBadge } from '@/features/auditLog/components/AuditLogApiHttpResponseCodeBadge';
import { AuditLogChanges } from '@/features/auditLog/components/AuditLogChanges';
import { CopyToClipboardButton } from '@/shared/components/CopyToClipboardButton';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/ui/sheet';
import { formatDateTime } from '@project/backend/shared/lib/formatDateTime';
import { useAuthStore } from '@/features/auth/authStore';
import { apiKeyLabel } from '@project/backend/features/apiKey/apiKeyLabel';
import { AuditLogWithAuthor } from '@project/backend/features/auditLog/auditLogSchemas';
import { memberFullName } from '@project/backend/features/member/memberFullName';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';

export function AuditLogViewDialog({
  auditLog,
  onClose,
}: {
  auditLog: AuditLogWithAuthor;
  onClose: () => void;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);

  return (
    <Sheet open={true} onOpenChange={onClose}>
      <SheetContent className="w-full overflow-y-scroll p-4 sm:min-w-[640px]">
        <SheetHeader>
          <SheetTitle>{dictionary.auditLog.changesDialog.title}</SheetTitle>
        </SheetHeader>
        <div className="divide-y border-t">
          {Boolean(auditLog.timestamp) && (
            <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
              <div className="font-semibold">
                {dictionary.auditLog.fields.timestamp}
              </div>
              <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
                <span>{formatDateTime(auditLog.timestamp, dictionary)}</span>
                <CopyToClipboardButton
                  text={formatDateTime(auditLog.timestamp, dictionary)}
                />
              </div>
            </div>
          )}

          {Boolean(auditLog.authorEmail) && (
            <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
              <div className="font-semibold">
                {dictionary.auditLog.fields.member}
              </div>
              <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
                <span>
                  {auditLog.authorEmail}
                  {Boolean(auditLog.authorFirstName) && (
                    <span className="ml-2">
                      (
                      {memberFullName({
                        firstName: auditLog.authorFirstName,
                        lastName: auditLog.authorLastName,
                      })}
                      )
                    </span>
                  )}
                </span>
                <CopyToClipboardButton text={auditLog.authorEmail} />
              </div>
            </div>
          )}

          {Boolean(auditLog.entityName) && (
            <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
              <div className="font-semibold">
                {dictionary.auditLog.fields.entityName}
              </div>
              <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
                <span>{auditLog.entityName}</span>
                <CopyToClipboardButton text={auditLog.entityName} />
              </div>
            </div>
          )}

          {Boolean(auditLog.operation) && (
            <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
              <div className="font-semibold">
                {dictionary.auditLog.fields.operation}
              </div>
              <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
                <span>
                  {dictionaryEnumerator(
                    dictionary.auditLog.enumerators.operation,
                    auditLog.operation,
                  )}
                </span>
                <CopyToClipboardButton
                  text={dictionaryEnumerator(
                    dictionary.auditLog.enumerators.operation,
                    auditLog.operation,
                  )}
                />
              </div>
            </div>
          )}

          {Boolean(auditLog.entityId) && (
            <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
              <div className="font-semibold">
                {dictionary.auditLog.fields.entityId}
              </div>
              <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
                <span>{auditLog.entityId}</span>
                <CopyToClipboardButton text={auditLog.entityId} />
              </div>
            </div>
          )}

          {Boolean(auditLog.apiKey?.name) && (
            <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
              <div className="font-semibold">
                {dictionary.auditLog.fields.apiKey}
              </div>
              <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
                <span>{apiKeyLabel(auditLog.apiKey)}</span>
                <CopyToClipboardButton text={apiKeyLabel(auditLog.apiKey)} />
              </div>
            </div>
          )}

          {Boolean(auditLog.apiEndpoint) && (
            <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
              <div className="font-semibold">
                {dictionary.auditLog.fields.apiEndpoint}
              </div>
              <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
                <span>{auditLog.apiEndpoint}</span>
                <CopyToClipboardButton text={auditLog.apiEndpoint} />
              </div>
            </div>
          )}

          {Boolean(auditLog.apiHttpResponseCode) && (
            <div className="grid grid-cols-3 gap-4 py-4 text-sm lg:grid-cols-4">
              <div className="font-semibold">
                {dictionary.auditLog.fields.apiHttpResponseCode}
              </div>
              <div className="col-span-2 flex items-baseline gap-4 lg:col-span-3">
                <AuditLogApiHttpResponseCodeBadge auditLog={auditLog} />
                <CopyToClipboardButton text={auditLog.apiHttpResponseCode} />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4 py-4">
            <div className="font-semibold">
              {dictionary.auditLog.changesDialog.changes}
            </div>
            <AuditLogChanges auditLog={auditLog} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
