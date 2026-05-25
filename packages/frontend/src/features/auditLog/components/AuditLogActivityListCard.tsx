import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  auditLogOperations,
  auditLogReadableOperation,
} from '@project/backend/features/auditLog/auditLogOperations';
import { memberFullName } from '@project/backend/features/member/memberFullName';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useAuthStore } from '@/features/auth/authStore';
import { acronym } from '@/shared/lib/acronym';
import { downloadUrl } from '@/shared/lib/downloadUrl';
import { apiClient } from '@/shared/lib/apiClient';
import { objectToQuery } from '@/shared/lib/objectToQuery';

dayjs.extend(relativeTime);

export function AuditLogActivityListCard() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const locale = useAuthStore((state) => state.locale);
  const hasPermission = useAuthStore((state) => state.hasPermission);

  const _hasPermission = hasPermission({
    member: ['read'],
  });

  const query = useQuery({
    queryKey: ['auditLog', 'activityList'],
    queryFn: async ({ signal }) => {
      return await apiClient
        .get(
          `api/audit-log?${objectToQuery({
            filter: {
              operations: [
                auditLogOperations.signIn,
                auditLogOperations.signUp,
                auditLogOperations.passwordResetRequest,
                auditLogOperations.passwordResetConfirm,
                auditLogOperations.passwordChange,
                auditLogOperations.verifyEmailConfirm,
                auditLogOperations.create,
                auditLogOperations.update,
                auditLogOperations.delete,
              ],
              entityNames: [
                'Member',
                'Subscription',
                'Exam',
                'Chapter',
                'Lesson',
                'PracticeQuestion',
                'Concept',
                'ExamType',
                'ExamInstance',
                'DailyGoal',
                'StudyNote',
                'DocumentUpload',
              ],
            },
            take: 5,
            orderBy: {
              timestamp: 'desc',
            },
          })}`,
          { signal },
        )
        .json<{ auditLogs: any[] }>();
    },
    enabled: _hasPermission,
  });

  if (!_hasPermission) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{dictionary.auditLog.dashboardCard.activityList}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {query.isLoading && <Skeleton className="h-[350px] w-full" />}
          {query.data?.auditLogs
            .filter((auditLog) => auditLog.authorEmail)
            .map((auditLog) => (
              <div key={auditLog.id} className="flex justify-between">
                <div className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={downloadUrl(auditLog.authorAvatars)}
                      alt={
                        memberFullName({
                          firstName: auditLog.authorFirstName,
                          lastName: auditLog.authorLastName,
                        }) || auditLog.authorEmail
                      }
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {acronym(
                        auditLog.authorFirstName,
                        auditLog.authorLastName,
                        auditLog.authorEmail,
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p
                      title={auditLog.authorEmail}
                      className="text-sm leading-none font-medium"
                    >
                      {auditLogReadableOperation(auditLog, dictionary, locale)}.
                    </p>
                    <p
                      title={dayjs(auditLog.timestamp).format(
                        dictionary.shared.datetimeFormat,
                      )}
                      className="text-muted-foreground text-sm"
                    >
                      {dayjs(auditLog.timestamp).fromNow()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
