import { Prisma } from '../../prisma/generated/client';
import { env } from '../../env';
import { addNotificationToQueue } from '../notification/notificationQueue';
import { NotificationPayload } from '../notification/notificationSchemas';
import { logger } from '../../shared/lib/logger';
import { prismaDangerouslyBypassRLS } from '../../prisma';
import { StudentStudyReminderJobData } from './studentReminderJobSchemas';

type ReminderCandidate = {
  type:
    | 'studyPlanDue'
    | 'flashcardsDue'
    | 'streakRisk'
    | 'examDateApproaching'
    | 'practiceReminder';
  courseId: string;
  courseTitle: string;
  userId: string;
  organizationId: string;
  deepLink: string;
  payload: NotificationPayload;
};

export async function studentStudyReminderWorker(
  data: StudentStudyReminderJobData,
) {
  if (data.kind !== 'smartSweep' || !env.STUDY_REMINDER_JOB_ENABLED) {
    return { success: true, skipped: true };
  }

  const candidates = await studentReminderCandidates();
  let processed = 0;
  let suppressed = 0;

  for (const candidate of candidates) {
    const deliveryKey = studentReminderDeliveryKey(candidate);

    try {
      const delivery =
        await prismaDangerouslyBypassRLS.studentReminderDelivery.create({
          data: {
            userId: candidate.userId,
            courseId: candidate.courseId,
            reminderType: candidate.type,
            deliveryKey,
          },
        });

      await prismaDangerouslyBypassRLS.notification.create({
        data: {
          userId: candidate.userId,
          organizationId: candidate.organizationId,
          type: candidate.type,
          roles: [],
          payload: candidate.payload as unknown as Prisma.InputJsonValue,
        },
      });

      await addNotificationToQueue({
        organizationId: candidate.organizationId,
        roles: [],
        targetUserIds: [candidate.userId],
        payload: candidate.payload,
        locale: 'en',
        channels: ['push'],
      });

      processed++;
      logger.info('student_reminder.sent', {
        reminderType: candidate.type,
        deliveryId: delivery.id,
        courseId: candidate.courseId,
        userId: candidate.userId,
      });
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2002'
      ) {
        suppressed++;
        continue;
      }

      logger.error('student_reminder.failed', {
        reminderType: candidate.type,
        courseId: candidate.courseId,
        userId: candidate.userId,
        error,
      });
    }
  }

  return {
    success: true,
    processed,
    suppressed,
  };
}

async function studentReminderCandidates(): Promise<ReminderCandidate[]> {
  const today = new Date();
  const todayKey = dateKey(today);
  const lookaheadDays = Number(env.STUDY_REMINDER_LOOKAHEAD_DAYS) || 3;
  const lookahead = addDays(today, lookaheadDays);
  const mobilePushTokens = await prismaDangerouslyBypassRLS.pushToken.findMany({
    where: { type: 'mobile' },
    select: { userId: true },
    distinct: ['userId'],
    take: 500,
  });
  const mobileUserIds = mobilePushTokens.map((token) => token.userId);

  if (!mobileUserIds.length) {
    return [];
  }

  const memberOrganizations = await prismaDangerouslyBypassRLS.member.findMany({
    where: { userId: { in: mobileUserIds } },
    select: { userId: true, organizationId: true },
    distinct: ['userId'],
  });
  const organizationIdByUserId = new Map(
    memberOrganizations.map((member) => [member.userId, member.organizationId]),
  );
  const enrollments =
    await prismaDangerouslyBypassRLS.courseEnrollment.findMany({
      where: {
        status: 'active',
        userId: { in: mobileUserIds },
        course: { status: 'published' },
      },
      select: {
        courseId: true,
        userId: true,
        targetExamDate: true,
        examName: true,
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      take: 250,
    });
  const candidates: ReminderCandidate[] = [];

  for (const enrollment of enrollments) {
    const organizationId = organizationIdByUserId.get(enrollment.userId);
    if (!organizationId) {
      continue;
    }

    const preference =
      await prismaDangerouslyBypassRLS.studentReminderPreference.findFirst({
        where: {
          userId: enrollment.userId,
          OR: [{ courseId: enrollment.courseId }, { courseId: null }],
        },
        orderBy: { courseId: 'desc' },
      });

    if (
      preference &&
      (!preference.enabled ||
        !preference.smartRemindersEnabled ||
        !preference.channels.includes('mobilePush') ||
        isWithinQuietHours(preference, today))
    ) {
      continue;
    }

    const base = {
      courseId: enrollment.courseId,
      courseTitle: enrollment.course.title,
      userId: enrollment.userId,
      organizationId,
    };
    const studyPlan =
      await prismaDangerouslyBypassRLS.courseStudyPlanItem.findFirst({
        where: {
          courseId: enrollment.courseId,
          userId: enrollment.userId,
          status: { not: 'complete' },
          plannedForDate: { lte: todayKey },
        },
        orderBy: [{ plannedForDate: 'asc' }, { createdAt: 'asc' }],
      });

    if (studyPlan) {
      const deepLink = `/student/course/${enrollment.courseId}?focus=study-plan&itemId=${studyPlan.id}`;
      candidates.push({
        ...base,
        type: 'studyPlanDue',
        deepLink,
        payload: {
          type: 'studyPlanDue',
          courseId: enrollment.courseId,
          courseTitle: enrollment.course.title,
          itemTitle: studyPlan.title,
          deepLink,
        },
      });
    }

    const dueCards =
      await prismaDangerouslyBypassRLS.courseFlashcardReview.count({
        where: {
          courseId: enrollment.courseId,
          userId: enrollment.userId,
          dueAt: { lte: today },
        },
      });

    if (dueCards > 0) {
      const deepLink = `/student/course/${enrollment.courseId}?focus=flashcards`;
      candidates.push({
        ...base,
        type: 'flashcardsDue',
        deepLink,
        payload: {
          type: 'flashcardsDue',
          courseId: enrollment.courseId,
          courseTitle: enrollment.course.title,
          dueCount: dueCards,
          deepLink,
        },
      });
    }

    const streak =
      await prismaDangerouslyBypassRLS.courseStudyStreak.findUnique({
        where: {
          courseId_userId: {
            courseId: enrollment.courseId,
            userId: enrollment.userId,
          },
        },
      });

    if (
      streak?.currentStreak &&
      (!streak.lastActivityDate ||
        streak.lastActivityDate.getTime() < startOfToday().getTime())
    ) {
      const deepLink = `/student/course/${enrollment.courseId}`;
      candidates.push({
        ...base,
        type: 'streakRisk',
        deepLink,
        payload: {
          type: 'streakRisk',
          courseId: enrollment.courseId,
          courseTitle: enrollment.course.title,
          currentStreak: streak.currentStreak,
          deepLink,
        },
      });
    }

    if (enrollment.targetExamDate) {
      const examDate = new Date(`${enrollment.targetExamDate}T00:00:00.000Z`);
      const daysRemaining = Math.ceil(
        (examDate.getTime() - startOfToday().getTime()) / 86_400_000,
      );
      if (daysRemaining >= 0 && examDate.getTime() <= lookahead.getTime()) {
        const deepLink = `/student/course/${enrollment.courseId}?focus=study-plan`;
        candidates.push({
          ...base,
          type: 'examDateApproaching',
          deepLink,
          payload: {
            type: 'examDateApproaching',
            courseId: enrollment.courseId,
            courseTitle: enrollment.course.title,
            examName: enrollment.examName || undefined,
            daysRemaining,
            deepLink,
          },
        });
      }
    }

    if (!studyPlan && dueCards === 0) {
      const deepLink = `/student/course/${enrollment.courseId}/practice`;
      candidates.push({
        ...base,
        type: 'practiceReminder',
        deepLink,
        payload: {
          type: 'practiceReminder',
          courseId: enrollment.courseId,
          courseTitle: enrollment.course.title,
          deepLink,
        },
      });
    }
  }

  return candidates;
}

function studentReminderDeliveryKey(candidate: ReminderCandidate) {
  return [
    candidate.userId,
    candidate.courseId,
    candidate.type,
    dateKey(new Date()),
  ].join(':');
}

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function isWithinQuietHours(
  preference: {
    quietHoursStart: string | null;
    quietHoursEnd: string | null;
  },
  now: Date,
) {
  if (!preference.quietHoursStart || !preference.quietHoursEnd) {
    return false;
  }

  const current = minutesSinceMidnight(
    `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}`,
  );
  const start = minutesSinceMidnight(preference.quietHoursStart);
  const end = minutesSinceMidnight(preference.quietHoursEnd);

  return start <= end
    ? current >= start && current < end
    : current >= start || current < end;
}

function minutesSinceMidnight(value: string) {
  const [hours, minutes] = value.split(':').map((part) => Number(part));
  return (hours || 0) * 60 + (minutes || 0);
}
