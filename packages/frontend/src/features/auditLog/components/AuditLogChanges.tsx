import { useState } from 'react';
import ReactDiffViewer from 'react-diff-viewer-continued';
import { AuditLogWithAuthor } from '@project/backend/features/auditLog/auditLogSchemas';
import { auditLogFindChanges } from '@/features/auditLog/auditLogFindChanges';
import { useAuthStore } from '@/features/auth/authStore';
import { Button } from '@/shared/components/ui/button';

export function AuditLogChanges({
  auditLog,
}: {
  auditLog: AuditLogWithAuthor;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const { oldData, newData } = auditLogFindChanges(auditLog);
  const [showFullObject, setShowFullObject] = useState(false);

  if (!Object.keys(newData).length && !Object.keys(oldData).length) {
    return (
      <p className="text-muted-foreground">
        {dictionary.auditLog.changesDialog.noChanges}
      </p>
    );
  }

  const fullOldData = (auditLog?.oldData as Record<string, object>) || {};
  const fullNewData = (auditLog?.newData as Record<string, object>) || {};

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFullObject(!showFullObject)}
        >
          {showFullObject
            ? dictionary.auditLog.changesDialog.showChangesOnly
            : dictionary.auditLog.changesDialog.showFullObject}
        </Button>
      </div>

      {showFullObject ? (
        <div className="overflow-x-auto">
          <ReactDiffViewer
            oldValue={JSON.stringify(fullOldData, null, 2)}
            newValue={JSON.stringify(fullNewData, null, 2)}
            splitView={false}
          />
        </div>
      ) : (
        <div>
          {Object.keys(newData).map((key) => {
            return (
              <div key={key} className="mb-4">
                <div className="text-muted-foreground mb-2 text-lg font-medium">
                  {key}
                </div>
                <div className="overflow-x-auto">
                  <ReactDiffViewer
                    oldValue={JSON.stringify(oldData[key], null, 2)}
                    newValue={JSON.stringify(newData[key], null, 2)}
                    splitView={false}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
