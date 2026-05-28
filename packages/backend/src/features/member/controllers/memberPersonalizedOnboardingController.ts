import { Prisma } from '../../../prisma/generated/client';
// bypass-RLS: current-user onboarding is stored before the app has entered
// course context. Every query is scoped to the authenticated user +
// organization pair from AppContext.
// eslint-disable-next-line no-restricted-syntax
import { prismaDangerouslyBypassRLS } from '../../../prisma';
import { AppContext } from '../../../shared/controller/appContext';
import { Error400 } from '../../../shared/errors/Error400';
import { Error403 } from '../../../shared/errors/Error403';
import { auditLogCreate } from '../../auditLog/auditLogCreate';
import { auditLogOperations } from '../../auditLog/auditLogOperations';
import { courseOnboardingSuggestionsController } from '../../course/courseControllers';
import {
  StudentOnboardingGeneratedPlan,
  StudentOnboardingProfileInput,
  studentOnboardingGeneratedPlanSchema,
  studentOnboardingProfileInputSchema,
} from '../memberSchemas';

function requireOnboardingContext(context: AppContext) {
  if (
    !context.currentUser ||
    !context.currentMember ||
    !context.currentOrganization
  ) {
    throw new Error403();
  }

  return {
    userId: context.currentUser.id,
    memberId: context.currentMember.id,
    organizationId: context.currentOrganization.id,
  };
}

function studentOnboardingTimelineWeeks(timeline: string) {
  if (timeline === 'two_weeks') return 2;
  if (timeline === 'one_month') return 4;
  if (timeline === 'two_months') return 8;
  if (timeline === 'three_months') return 12;
  if (timeline === 'six_months') return 24;
  return 6;
}

function studentOnboardingReadinessLift(currentLevel: string) {
  if (currentLevel === 'new') return 'foundation' as const;
  if (currentLevel === 'almost_ready') return 'refine' as const;
  return 'accelerate' as const;
}

function studentOnboardingExamTokens(examGoal: string) {
  return examGoal
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .map((token) => token.trim())
    .filter((token) => token.length >= 3)
    .slice(0, 12);
}

function studentOnboardingCourseText(course: any) {
  return [
    course.title,
    course.subtitle,
    course.description,
    course.category,
    course.categoryRef?.name,
    course.examType,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function studentOnboardingRankCourses(
  courses: any[],
  input: StudentOnboardingProfileInput | null,
) {
  if (!input) {
    return courses.slice(0, 6);
  }

  const phrase = input.examGoal.toLowerCase().trim();
  const tokens = studentOnboardingExamTokens(input.examGoal);

  return courses
    .map((course, index) => {
      const searchable = studentOnboardingCourseText(course);
      let score = courses.length - index / 100;

      if (phrase && searchable.includes(phrase)) {
        score += 12;
      }

      for (const token of tokens) {
        if (searchable.includes(token)) {
          score += 3;
        }
      }

      if (input.currentLevel === 'new' && course.accessType === 'free') {
        score += 2;
      }

      if (input.currentLevel === 'almost_ready' && course.certificateEnabled) {
        score += 2;
      }

      if (course.nexVerified) {
        score += 1;
      }

      return { course, score };
    })
    .sort((a, b) => b.score - a.score)
    .map((item) => item.course)
    .slice(0, 6);
}

async function studentOnboardingRecommendations(
  input: StudentOnboardingProfileInput | null,
  context: AppContext,
) {
  const suggestions = await courseOnboardingSuggestionsController(context);
  const courses = studentOnboardingRankCourses(suggestions.courses, input);

  return {
    courses,
    recommendedCourseIds: courses.map((course: any) => course.id),
  };
}

function studentOnboardingBuildPlan(
  input: StudentOnboardingProfileInput,
  recommendedCourses: any[],
): StudentOnboardingGeneratedPlan {
  const totalWeeks = studentOnboardingTimelineWeeks(input.timeline);
  const totalDays = totalWeeks * 7;
  const weeklySessions = Math.min(
    14,
    Math.max(1, Math.round(input.studyMinutesPerWeek / 90)),
  );
  const sessionMinutes = Math.min(
    240,
    Math.max(15, Math.round(input.studyMinutesPerWeek / weeklySessions)),
  );
  const firstCourse = recommendedCourses[0];
  const firstAction = !firstCourse
    ? 'takeDiagnostic'
    : firstCourse.accessType === 'free'
      ? 'enrollFreeCourse'
      : firstCourse.accessType === 'paid' ||
          firstCourse.accessType === 'subscription'
        ? 'previewLesson'
        : 'viewPaidCourse';
  const hasCertificatePath = recommendedCourses.some(
    (course) => course.certificateEnabled,
  );

  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    timeline: input.timeline,
    currentLevel: input.currentLevel,
    weeklyStudyMinutes: input.studyMinutesPerWeek,
    weeklySessions,
    sessionMinutes,
    totalWeeks,
    readinessLift: studentOnboardingReadinessLift(input.currentLevel),
    firstAction,
    milestones: [
      { key: 'baseline', dueInDays: 0 },
      { key: 'firstWin', dueInDays: Math.min(7, Math.max(1, totalDays)) },
      {
        key: 'practiceRhythm',
        dueInDays: Math.min(14, Math.max(2, Math.floor(totalDays / 3))),
      },
      {
        key: 'examReadiness',
        dueInDays: Math.max(3, Math.floor(totalDays * 0.75)),
      },
      { key: 'finalReview', dueInDays: Math.max(5, totalDays - 3) },
    ],
    unlocks: [
      'fullCurriculum',
      'adaptivePlan',
      'aiTutor',
      'practiceExams',
      ...(hasCertificatePath ? (['certificatePath'] as const) : []),
    ],
  };
}

function studentOnboardingProfilePayload(profile: any) {
  const parsedPlan = studentOnboardingGeneratedPlanSchema.safeParse(
    profile.generatedPlan,
  );

  return {
    id: profile.id,
    createdAt: profile.createdAt.toISOString(),
    updatedAt: profile.updatedAt.toISOString(),
    examGoal: profile.examGoal,
    timeline: profile.timeline,
    currentLevel: profile.currentLevel,
    studyMinutesPerWeek: profile.studyMinutesPerWeek,
    targetScore: profile.targetScore,
    generatedPlan: parsedPlan.success ? parsedPlan.data : null,
    recommendedCourseIds: profile.recommendedCourseIds,
    completedAt: profile.completedAt?.toISOString() ?? null,
  };
}

export async function memberPersonalizedOnboardingController(
  context: AppContext,
) {
  const ids = requireOnboardingContext(context);
  const profile =
    await prismaDangerouslyBypassRLS.studentOnboardingProfile.findUnique({
      where: {
        userId_organizationId: {
          userId: ids.userId,
          organizationId: ids.organizationId,
        },
      },
    });

  const recommendations = await studentOnboardingRecommendations(
    profile
      ? studentOnboardingProfileInputSchema.parse({
          examGoal: profile.examGoal,
          timeline: profile.timeline,
          currentLevel: profile.currentLevel,
          studyMinutesPerWeek: profile.studyMinutesPerWeek,
          targetScore: profile.targetScore,
        })
      : null,
    context,
  );

  return {
    profile: profile ? studentOnboardingProfilePayload(profile) : null,
    recommendedCourses: recommendations.courses,
  };
}

async function memberPersonalizedOnboardingUpsert(
  input: StudentOnboardingProfileInput,
  context: AppContext,
  options: {
    generatedPlan: StudentOnboardingGeneratedPlan | null;
    recommendedCourseIds: string[];
  },
) {
  const ids = requireOnboardingContext(context);

  return await prismaDangerouslyBypassRLS.$transaction(async (tx) => {
    const oldProfile = await tx.studentOnboardingProfile.findUnique({
      where: {
        userId_organizationId: {
          userId: ids.userId,
          organizationId: ids.organizationId,
        },
      },
    });
    const data = {
      organizationId: ids.organizationId,
      userId: ids.userId,
      memberId: ids.memberId,
      examGoal: input.examGoal,
      timeline: input.timeline,
      currentLevel: input.currentLevel,
      studyMinutesPerWeek: input.studyMinutesPerWeek,
      targetScore: input.targetScore,
      generatedPlan: options.generatedPlan
        ? (options.generatedPlan as Prisma.InputJsonValue)
        : Prisma.JsonNull,
      recommendedCourseIds: options.recommendedCourseIds,
      updatedByUserId: ids.userId,
      updatedByMemberId: ids.memberId,
    };
    const profile = oldProfile
      ? await tx.studentOnboardingProfile.update({
          where: { id: oldProfile.id },
          data,
        })
      : await tx.studentOnboardingProfile.create({
          data: {
            ...data,
            createdByUserId: ids.userId,
            createdByMemberId: ids.memberId,
          },
        });

    await auditLogCreate({
      entityId: profile.id,
      entityName: 'StudentOnboardingProfile',
      operation: oldProfile
        ? auditLogOperations.update
        : auditLogOperations.create,
      context,
      tx,
      oldData: oldProfile,
      newData: profile,
    });

    return profile;
  });
}

export async function memberPersonalizedOnboardingUpdateController(
  body: unknown,
  context: AppContext,
) {
  const input = studentOnboardingProfileInputSchema.parse(body);
  const recommendations = await studentOnboardingRecommendations(
    input,
    context,
  );
  const profile = await memberPersonalizedOnboardingUpsert(input, context, {
    generatedPlan: null,
    recommendedCourseIds: recommendations.recommendedCourseIds,
  });

  return {
    profile: studentOnboardingProfilePayload(profile),
    recommendedCourses: recommendations.courses,
  };
}

export async function memberPersonalizedOnboardingGenerateController(
  body: unknown,
  context: AppContext,
) {
  const input = studentOnboardingProfileInputSchema.parse(body);
  const recommendations = await studentOnboardingRecommendations(
    input,
    context,
  );

  if (!recommendations.courses.length) {
    throw new Error400(
      context.dictionary.studentOnboarding.errors.noRecommendations,
    );
  }

  const generatedPlan = studentOnboardingBuildPlan(
    input,
    recommendations.courses,
  );
  const profile = await memberPersonalizedOnboardingUpsert(input, context, {
    generatedPlan,
    recommendedCourseIds: recommendations.recommendedCourseIds,
  });

  return {
    profile: studentOnboardingProfilePayload(profile),
    recommendedCourses: recommendations.courses,
  };
}
