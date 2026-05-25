import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  courseStudyAiCreateStudyPlanItemController,
  courseStudyAiDeleteStudyPlanItemController,
  courseStudyAiGenerateStudyPlanController,
  courseStudyAiGetExamDateController,
  courseStudyAiListStudyPlanController,
  courseStudyAiPutExamDateController,
  courseStudyAiSubmitQuizController,
  courseStudyAiUpdateStudyPlanItemController,
  courseStudyAiWeaknessesController,
} from '../courseStudyAiControllers';
import {
  createTestCourseSeed,
  createTestEnrolledStudent,
} from '../../../test/testFactories';
import { testPrismaClient } from '../../../test/testPrismaClient';

const mockRunCourseStudyAiGeneration = vi.hoisted(() => vi.fn());

vi.mock('../courseStudyAiService', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('../courseStudyAiService')>();
  return {
    ...actual,
    runCourseStudyAiGeneration: mockRunCourseStudyAiGeneration,
  };
});

function jsonContext() {
  return {
    json: vi.fn((payload) => payload),
  } as any;
}

function aiQuestion(examDomain: string) {
  return {
    questionText: `Question for ${examDomain}?`,
    explanation: 'Because this is the tested concept.',
    examDomain,
    difficulty: 'medium' as const,
    options: [
      { text: 'Correct', isCorrect: true },
      { text: 'Wrong A', isCorrect: false },
      { text: 'Wrong B', isCorrect: false },
      { text: 'Wrong C', isCorrect: false },
    ],
  };
}

describe('course study AI controllers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRunCourseStudyAiGeneration.mockResolvedValue({
      json: {
        items: [
          {
            title: 'Review weak domain',
            description: 'Focus on the weakest scored domain first.',
          },
          {
            title: 'Practice final review',
            description: 'Complete mixed practice before the exam date.',
          },
        ],
      },
      usage: { inputTokens: 0, outputTokens: 0 },
    });
  });

  it('stores exam date and keeps manual study-plan items scoped to the enrolled student', async () => {
    const { course } = await createTestCourseSeed({ lessonCount: 2 });
    const student = await createTestEnrolledStudent(course.id);

    const examDate = (await courseStudyAiPutExamDateController(
      course.id,
      { targetExamDate: '2026-08-15', examName: 'Series Exam' },
      student.context,
      jsonContext(),
    )) as any;
    const readBack = (await courseStudyAiGetExamDateController(
      course.id,
      student.context,
      jsonContext(),
    )) as any;
    const created = (await courseStudyAiCreateStudyPlanItemController(
      course.id,
      {
        title: 'Read module notes',
        description: 'Review notes before practicing.',
        plannedForDate: '2026-08-01',
      },
      student.context,
      jsonContext(),
    )) as any;
    const updated = (await courseStudyAiUpdateStudyPlanItemController(
      course.id,
      created.item.id,
      { status: 'completed' },
      student.context,
      jsonContext(),
    )) as any;
    const listed = (await courseStudyAiListStudyPlanController(
      course.id,
      student.context,
      jsonContext(),
    )) as any;

    expect(examDate.targetExamDate).toBe('2026-08-15');
    expect(readBack.examName).toBe('Series Exam');
    expect(updated.item.status).toBe('completed');
    expect(updated.item.completedAt).toBeTruthy();
    expect(listed.items.map((item: any) => item.title)).toEqual([
      'Read module notes',
    ]);

    const deleted = (await courseStudyAiDeleteStudyPlanItemController(
      course.id,
      created.item.id,
      student.context,
      jsonContext(),
    )) as any;
    expect(deleted.ok).toBe(true);
  });

  it('persists AI quiz attempts and returns weakness domains from stored scores', async () => {
    const { course, module } = await createTestCourseSeed();
    const student = await createTestEnrolledStudent(course.id);
    const questions = [aiQuestion('Regulations'), aiQuestion('Ethics')];

    const submitted = (await courseStudyAiSubmitQuizController(
      course.id,
      {
        kind: 'quiz',
        moduleId: module.id,
        questions,
        answers: [
          { questionIndex: 0, selectedOptionIndex: 1 },
          { questionIndex: 1, selectedOptionIndex: 0 },
        ],
      },
      student.context,
      jsonContext(),
    )) as any;
    const weaknesses = (await courseStudyAiWeaknessesController(
      course.id,
      student.context,
      jsonContext(),
    )) as any;

    expect(submitted.scorePercent).toBe(50);
    expect(submitted.passed).toBe(false);
    expect(weaknesses.hasData).toBe(true);
    expect(weaknesses.domains.map((domain: any) => domain.domain)).toEqual([
      'Regulations',
      'Ethics',
    ]);
  });

  it('generates an AI study plan, replaces stale AI items, and keeps manual items', async () => {
    const { course } = await createTestCourseSeed({ lessonCount: 2 });
    const student = await createTestEnrolledStudent(course.id);
    await testPrismaClient().courseStudyPlanItem.create({
      data: {
        courseId: course.id,
        userId: student.user.id,
        memberId: student.member.id,
        title: 'Manual review task',
        plannedForDate: '2026-08-01',
        status: 'todo',
        source: 'manual',
      },
    });
    await testPrismaClient().courseStudyPlanItem.create({
      data: {
        courseId: course.id,
        userId: student.user.id,
        memberId: student.member.id,
        title: 'Stale AI task',
        plannedForDate: '2026-08-02',
        status: 'todo',
        source: 'ai',
      },
    });

    const generated = (await courseStudyAiGenerateStudyPlanController(
      course.id,
      student.context,
      jsonContext(),
    )) as any;
    const titles = generated.items.map((item: any) => item.title);
    const sources = await testPrismaClient().courseStudyPlanItem.findMany({
      where: { courseId: course.id, userId: student.user.id },
      select: { title: true, source: true },
      orderBy: { title: 'asc' },
    });

    expect(mockRunCourseStudyAiGeneration).toHaveBeenCalledTimes(1);
    expect(titles).toContain('Manual review task');
    expect(titles).toContain('Review weak domain');
    expect(titles).not.toContain('Stale AI task');
    expect(sources.filter((item) => item.source === 'manual')).toHaveLength(1);
    expect(sources.filter((item) => item.source === 'ai')).toHaveLength(2);
  });
});
