import { dictionaryFormat } from '../../translation/dictionaryFormat';
import { Dictionary } from '../../translation/locales';
import { NotificationPayload } from './notificationSchemas';

/**
 * Get formatted notification content from dictionary based on type and locale
 * Returns email subject, email body, and push notification body
 */
export function notificationFormatContent(
  payload: NotificationPayload,
  dictionary: Dictionary,
): { subject: string; body: string; pushBody: string } {
  const { notification } = dictionary;

  switch (payload.type) {
    case 'memberAdded':
      return {
        subject: dictionaryFormat(
          notification.memberAdded.subject,
          payload.organizationName,
        ),
        body: dictionaryFormat(
          notification.memberAdded.body,
          payload.memberName,
          payload.memberEmail,
          payload.organizationName,
          payload.invitedBy || 'Admin',
        ),
        pushBody: dictionaryFormat(
          notification.memberAdded.pushBody,
          payload.memberName,
          payload.organizationName,
        ),
      };

    case 'memberRemoved':
      return {
        subject: dictionaryFormat(
          notification.memberRemoved.subject,
          payload.organizationName,
        ),
        body: dictionaryFormat(
          notification.memberRemoved.body,
          payload.memberName,
          payload.memberEmail,
          payload.organizationName,
          payload.removedBy || 'Admin',
        ),
        pushBody: dictionaryFormat(
          notification.memberRemoved.pushBody,
          payload.memberName,
          payload.organizationName,
        ),
      };

    case 'subscriptionCreated':
      return {
        subject: dictionaryFormat(
          notification.subscriptionCreated.subject,
          payload.organizationName,
        ),
        body: dictionaryFormat(
          notification.subscriptionCreated.body,
          payload.userName,
          payload.userEmail,
          payload.planName,
          payload.organizationName,
        ),
        pushBody: dictionaryFormat(
          notification.subscriptionCreated.pushBody,
          payload.userName,
          payload.planName,
        ),
      };

    case 'studyPlanDue':
      return {
        subject: dictionaryFormat(
          notification.studyPlanDue.subject,
          payload.courseTitle,
        ),
        body: dictionaryFormat(
          notification.studyPlanDue.body,
          payload.itemTitle,
          payload.courseTitle,
        ),
        pushBody: dictionaryFormat(
          notification.studyPlanDue.pushBody,
          payload.itemTitle,
          payload.courseTitle,
        ),
      };

    case 'flashcardsDue':
      return {
        subject: dictionaryFormat(
          notification.flashcardsDue.subject,
          payload.courseTitle,
        ),
        body: dictionaryFormat(
          notification.flashcardsDue.body,
          payload.dueCount,
          payload.courseTitle,
        ),
        pushBody: dictionaryFormat(
          notification.flashcardsDue.pushBody,
          payload.dueCount,
          payload.courseTitle,
        ),
      };

    case 'streakRisk':
      return {
        subject: dictionaryFormat(
          notification.streakRisk.subject,
          payload.courseTitle,
        ),
        body: dictionaryFormat(
          notification.streakRisk.body,
          payload.courseTitle,
          payload.currentStreak,
        ),
        pushBody: dictionaryFormat(
          notification.streakRisk.pushBody,
          payload.courseTitle,
        ),
      };

    case 'examDateApproaching':
      return {
        subject: dictionaryFormat(
          notification.examDateApproaching.subject,
          payload.examName || payload.courseTitle,
        ),
        body: dictionaryFormat(
          notification.examDateApproaching.body,
          payload.examName || payload.courseTitle,
          payload.daysRemaining,
        ),
        pushBody: dictionaryFormat(
          notification.examDateApproaching.pushBody,
          payload.examName || payload.courseTitle,
          payload.daysRemaining,
        ),
      };

    case 'practiceReminder':
      return {
        subject: dictionaryFormat(
          notification.practiceReminder.subject,
          payload.courseTitle,
        ),
        body: payload.weakArea
          ? dictionaryFormat(
              notification.practiceReminder.bodyWithWeakArea,
              payload.courseTitle,
              payload.weakArea,
            )
          : dictionaryFormat(
              notification.practiceReminder.body,
              payload.courseTitle,
            ),
        pushBody: payload.weakArea
          ? dictionaryFormat(
              notification.practiceReminder.pushBodyWithWeakArea,
              payload.weakArea,
            )
          : dictionaryFormat(
              notification.practiceReminder.pushBody,
              payload.courseTitle,
            ),
      };

    case 'custom':
      return {
        subject: dictionaryFormat(notification.custom.subject, payload.title),
        body: dictionaryFormat(notification.custom.body, payload.message),
        pushBody: dictionaryFormat(
          notification.custom.pushBody,
          payload.message,
        ),
      };

    default:
      return {
        subject: notification.default.subject,
        body: notification.default.body,
        pushBody: notification.default.pushBody,
      };
  }
}
