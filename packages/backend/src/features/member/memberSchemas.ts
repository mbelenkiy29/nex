import { Member, Organization, User } from '../../prisma/generated/client';
import { toLower } from 'lodash-es';
import { z } from 'zod';
import { dateTimeOptionalSchema } from '../../shared/schemas/dateTimeSchema';
import { importerInputSchema } from '../../shared/schemas/importerSchemas';
import { numberSchema } from '../../shared/schemas/numberSchema';
import { orderBySchema } from '../../shared/schemas/orderBySchema';
import { fileUploadedSchema } from '../file/fileSchemas';
import { rolesIds } from '../permissions';
import { memberEnumerators } from './memberEnumerators';

const memberStatusIds = Object.keys(
  memberEnumerators.status,
) as unknown as readonly [string, ...string[]];

export interface MemberWithRelationships extends Member {
  organization?: Partial<Organization>;
  user?: Partial<User>;
  createdByMember?: Partial<MemberWithRelationships> | null;
  updatedByMember?: Partial<MemberWithRelationships> | null;
  role: keyof typeof rolesIds;
}

export const memberFilterInputSchema = z
  .object({
    email: z.string(),
    fullName: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    roles: z.array(z.enum(rolesIds)),
    createdAtRange: z.array(dateTimeOptionalSchema).max(2),
    status: z.enum(memberStatusIds),
  })
  .partial();

export const memberCreateInputSchema = z.object({
  email: z.email().trim().min(1).max(255).transform(toLower),
  role: z.enum(rolesIds),
  importHash: z.string().optional(),
});

export const memberUpdateInputSchema = z.object({
  firstName: z.string().trim().max(255).optional(),
  lastName: z.string().trim().max(255).optional(),
  avatars: z.array(fileUploadedSchema).optional(),
  role: z.enum(rolesIds),
});

export const memberUpdateMeInputSchema = z.object({
  firstName: z.string().trim().min(1).max(255).optional(),
  lastName: z.string().min(1).trim().max(255).optional(),
  avatars: z.array(fileUploadedSchema).optional(),
  isNotificationsEnabled: z.boolean().optional(),
});

export const profileOnboardFormSchema = z.object({
  firstName: z.string().min(1).max(255),
  lastName: z.string().min(1).max(255),
  avatars: z.array(fileUploadedSchema),
  isNotificationsEnabled: z.boolean().optional(),
});

export const studentOnboardingTimelineValues = [
  'two_weeks',
  'one_month',
  'two_months',
  'three_months',
  'six_months',
  'not_sure',
] as const;

export const studentOnboardingCurrentLevelValues = [
  'new',
  'some_background',
  'practicing',
  'almost_ready',
] as const;

export const studentOnboardingMilestoneValues = [
  'baseline',
  'firstWin',
  'practiceRhythm',
  'examReadiness',
  'finalReview',
] as const;

export const studentOnboardingUnlockValues = [
  'fullCurriculum',
  'adaptivePlan',
  'aiTutor',
  'practiceExams',
  'certificatePath',
] as const;

export const studentOnboardingFirstActionValues = [
  'takeDiagnostic',
  'previewLesson',
  'enrollFreeCourse',
  'viewPaidCourse',
] as const;

export const studentOnboardingProfileInputSchema = z.object({
  examGoal: z.string().trim().min(1).max(200),
  timeline: z.enum(studentOnboardingTimelineValues),
  currentLevel: z.enum(studentOnboardingCurrentLevelValues),
  studyMinutesPerWeek: numberSchema.pipe(z.number().int().min(30).max(3000)),
  targetScore: z.string().trim().min(1).max(80),
});

export const studentOnboardingGeneratedPlanSchema = z.object({
  version: z.literal(1),
  generatedAt: z.string(),
  timeline: z.enum(studentOnboardingTimelineValues),
  currentLevel: z.enum(studentOnboardingCurrentLevelValues),
  weeklyStudyMinutes: z.number().int().min(30).max(3000),
  weeklySessions: z.number().int().min(1).max(14),
  sessionMinutes: z.number().int().min(15).max(240),
  totalWeeks: z.number().int().min(1).max(52),
  readinessLift: z.enum(['foundation', 'accelerate', 'refine']),
  firstAction: z.enum(studentOnboardingFirstActionValues),
  milestones: z.array(
    z.object({
      key: z.enum(studentOnboardingMilestoneValues),
      dueInDays: z.number().int().min(0).max(365),
    }),
  ),
  unlocks: z.array(z.enum(studentOnboardingUnlockValues)),
});

export const studentOnboardingProfileOutputSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string(),
  updatedAt: z.string(),
  examGoal: z.string(),
  timeline: z.enum(studentOnboardingTimelineValues),
  currentLevel: z.enum(studentOnboardingCurrentLevelValues),
  studyMinutesPerWeek: z.number(),
  targetScore: z.string(),
  generatedPlan: studentOnboardingGeneratedPlanSchema.nullable(),
  recommendedCourseIds: z.array(z.string()),
  completedAt: z.string().nullable(),
});

export type StudentOnboardingProfileInput = z.output<
  typeof studentOnboardingProfileInputSchema
>;

export type StudentOnboardingGeneratedPlan = z.output<
  typeof studentOnboardingGeneratedPlanSchema
>;

export type StudentOnboardingProfileOutput = z.output<
  typeof studentOnboardingProfileOutputSchema
>;

export const memberImportFileSchema = z
  .object({
    email: z.string(),
    role: z.string(),
  })
  .partial();

export const memberImportInputSchema = memberCreateInputSchema.extend(
  importerInputSchema.shape,
);

export const memberAutocompleteInputSchema = z.object({
  search: z.string().trim().optional(),
  exclude: z.array(z.string().uuid()).optional(),
  take: z.coerce.number().optional(),
  orderBy: orderBySchema.default({ fullName: 'asc' }),
});

export const memberAutocompleteOutputSchema = z.object({
  id: z.string(),
  fullName: z.string().nullable(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  email: z.string(),
  avatars: z.any().nullable(),
});

export const memberFindSchema = z.object({
  id: z.string(),
});

export const memberFindManyInputSchema = z.object({
  filter: memberFilterInputSchema.optional(),
  orderBy: orderBySchema.optional(),
  skip: z.coerce.number().optional(),
  take: z.coerce.number().optional(),
});
