import { z } from 'zod';
import { orderBySchema } from '../../shared/schemas/orderBySchema';
import { notificationEnumerators } from './notificationEnumerators';

export const NOTIFICATION_QUEUE = 'notification';

// Base notification schema
const baseNotificationPayloadSchema = z.object({
  type: z.enum(notificationEnumerators.type),
  deepLink: z.string().optional(),
});

// Member added notification payload
export const memberAddedPayloadSchema = baseNotificationPayloadSchema
  .extend({
    type: z.literal('memberAdded'),
    memberName: z.string(),
    memberEmail: z.string(),
    organizationName: z.string(),
    invitedBy: z.string().optional(),
  })
  .strict();

// Member removed notification payload
export const memberRemovedPayloadSchema = baseNotificationPayloadSchema
  .extend({
    type: z.literal('memberRemoved'),
    memberName: z.string(),
    memberEmail: z.string(),
    organizationName: z.string(),
    removedBy: z.string().optional(),
  })
  .strict();

// Subscription created notification payload
export const subscriptionCreatedPayloadSchema = baseNotificationPayloadSchema
  .extend({
    type: z.literal('subscriptionCreated'),
    userName: z.string(),
    userEmail: z.string(),
    organizationName: z.string(),
    planName: z.string(),
  })
  .strict();

// Custom notification payload
export const customPayloadSchema = baseNotificationPayloadSchema
  .extend({
    type: z.literal('custom'),
    title: z.string().min(1).max(200),
    message: z.string().min(1).max(1000),
  })
  .strict();

export const studyPlanDuePayloadSchema = baseNotificationPayloadSchema
  .extend({
    type: z.literal('studyPlanDue'),
    courseId: z.uuid(),
    courseTitle: z.string().min(1).max(200),
    itemTitle: z.string().min(1).max(200),
  })
  .strict();

export const flashcardsDuePayloadSchema = baseNotificationPayloadSchema
  .extend({
    type: z.literal('flashcardsDue'),
    courseId: z.uuid(),
    courseTitle: z.string().min(1).max(200),
    dueCount: z.number().int().min(1),
  })
  .strict();

export const streakRiskPayloadSchema = baseNotificationPayloadSchema
  .extend({
    type: z.literal('streakRisk'),
    courseId: z.uuid(),
    courseTitle: z.string().min(1).max(200),
    currentStreak: z.number().int().min(0),
  })
  .strict();

export const examDateApproachingPayloadSchema = baseNotificationPayloadSchema
  .extend({
    type: z.literal('examDateApproaching'),
    courseId: z.uuid(),
    courseTitle: z.string().min(1).max(200),
    examName: z.string().min(1).max(200).optional(),
    daysRemaining: z.number().int().min(0),
  })
  .strict();

export const practiceReminderPayloadSchema = baseNotificationPayloadSchema
  .extend({
    type: z.literal('practiceReminder'),
    courseId: z.uuid(),
    courseTitle: z.string().min(1).max(200),
    weakArea: z.string().max(200).optional(),
  })
  .strict();

// Discriminated union of all notification payloads
export const notificationPayloadSchema = z.discriminatedUnion('type', [
  memberAddedPayloadSchema,
  memberRemovedPayloadSchema,
  subscriptionCreatedPayloadSchema,
  studyPlanDuePayloadSchema,
  flashcardsDuePayloadSchema,
  streakRiskPayloadSchema,
  examDateApproachingPayloadSchema,
  practiceReminderPayloadSchema,
  customPayloadSchema,
]);

export type NotificationPayload = z.infer<typeof notificationPayloadSchema>;
export type MemberAddedPayload = z.infer<typeof memberAddedPayloadSchema>;
export type MemberRemovedPayload = z.infer<typeof memberRemovedPayloadSchema>;
export type SubscriptionCreatedPayload = z.infer<
  typeof subscriptionCreatedPayloadSchema
>;
export type CustomPayload = z.infer<typeof customPayloadSchema>;
export type StudyPlanDuePayload = z.infer<typeof studyPlanDuePayloadSchema>;
export type FlashcardsDuePayload = z.infer<typeof flashcardsDuePayloadSchema>;
export type StreakRiskPayload = z.infer<typeof streakRiskPayloadSchema>;
export type ExamDateApproachingPayload = z.infer<
  typeof examDateApproachingPayloadSchema
>;
export type PracticeReminderPayload = z.infer<
  typeof practiceReminderPayloadSchema
>;

export interface NotificationJobData {
  organizationId: string;
  roles: string[];
  targetUserIds?: string[];
  payload: NotificationPayload;
  senderUserId?: string;
  locale: string;
  channels?: Array<'email' | 'push'>;
}

// API schemas for listing notifications
export const notificationFilterInputSchema = z
  .object({
    type: z.enum(notificationEnumerators.type).optional(),
    read: z.string().optional(), // 'true', 'false', or undefined for all
  })
  .strict();

export const notificationFilterSchema = z
  .object({
    type: z.enum(notificationEnumerators.type).optional(),
    read: z.boolean().optional(),
  })
  .strict();

export const notificationFindManyInputSchema = z.object({
  filter: notificationFilterInputSchema.optional(),
  orderBy: orderBySchema.optional(),
  offset: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
});

export type NotificationFilterInput = z.infer<
  typeof notificationFilterInputSchema
>;
export type NotificationFilter = z.infer<typeof notificationFilterSchema>;
export type NotificationFindManyInput = z.infer<
  typeof notificationFindManyInputSchema
>;

// Mark as read schema
export const notificationMarkAsReadSchema = z.object({
  ids: z.array(z.string().uuid()).optional(), // If not provided, mark all as read
});

export type NotificationMarkAsRead = z.infer<
  typeof notificationMarkAsReadSchema
>;

// Mark as unread schema
export const notificationMarkAsUnreadSchema = z.object({
  ids: z.array(z.string().uuid()).optional(), // If not provided, mark all as unread
});

export type NotificationMarkAsUnread = z.infer<
  typeof notificationMarkAsUnreadSchema
>;

// Send custom notification schema
export const notificationSendSchema = z.object({
  title: z.string().min(1).max(200),
  message: z.string().min(1).max(1000),
  roles: z.array(z.string()).min(1),
});

export type NotificationSend = z.infer<typeof notificationSendSchema>;
