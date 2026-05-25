import { randomUUID } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import {
  courseBuilderCheckpointCreateController,
  courseBuilderCheckpointDeleteController,
  courseBuilderCheckpointListController,
  courseBuilderCheckpointRestoreController,
  courseBuilderCreateController,
  courseBuilderSubmitForReviewController,
} from '../courseBuilderControllers';
import { platformAdminCourseReviewController } from '../courseControllers';
import {
  createTestPlatformAdmin,
  createTestVerifiedCreator,
} from '../../../test/testFactories';
import { testPrismaClient } from '../../../test/testPrismaClient';

function publishableBuilderInput(title = 'Publishable Builder Course') {
  const moduleId = randomUUID();
  const quizId = randomUUID();

  return {
    title,
    subtitle: 'Course subtitle',
    description: 'A complete course description for publishing.',
    thumbnail: [
      {
        key: 'course/thumbnails/test.png',
        name: 'test.png',
        size: 100,
        type: 'image/png',
      },
    ],
    modules: [{ id: moduleId, title: 'Module 1', orderIndex: 0 }],
    lessons: [0, 1, 2].map((index) => ({
      id: randomUUID(),
      moduleId,
      title: `Lesson ${index + 1}`,
      content: `Lesson ${index + 1} content.`,
      orderIndex: index,
    })),
    quizzes: [
      {
        id: quizId,
        moduleId,
        title: 'Readiness quiz',
        orderIndex: 0,
      },
    ],
    outcomes: [
      {
        id: randomUUID(),
        text: 'Prepare for the exam with a complete study workflow.',
        orderIndex: 0,
      },
    ],
  };
}

describe('course builder persistence and publishing', () => {
  it('saves, deduplicates autosaves, restores a checkpoint, and deletes manual checkpoints', async () => {
    const creator = await createTestVerifiedCreator();
    const created = await courseBuilderCreateController(
      publishableBuilderInput('Original Draft'),
      creator.context,
    );
    const courseId = created.course.id;

    const manualPayload = publishableBuilderInput('Manual Snapshot');
    const manual = await courseBuilderCheckpointCreateController(
      { id: courseId },
      { source: 'manual', label: 'Before edits', payload: manualPayload },
      creator.context,
    );
    await courseBuilderCheckpointCreateController(
      { id: courseId },
      {
        source: 'autosave',
        label: 'Autosave 1',
        payload: publishableBuilderInput('Autosave 1'),
      },
      creator.context,
    );
    await courseBuilderCheckpointCreateController(
      { id: courseId },
      {
        source: 'autosave',
        label: 'Autosave 2',
        payload: publishableBuilderInput('Autosave 2'),
      },
      creator.context,
    );

    const beforeRestore = await courseBuilderCheckpointListController(
      { id: courseId },
      creator.context,
    );
    expect(
      beforeRestore.checkpoints.filter((item) => item.source === 'autosave'),
    ).toHaveLength(1);

    const restored = await courseBuilderCheckpointRestoreController(
      { id: courseId, checkpointId: manual.checkpoint.id },
      creator.context,
    );
    expect(restored.restoredToCourse).toBe(true);
    expect(restored.course?.title).toBe('Manual Snapshot');
    expect(restored.course?.lessons).toHaveLength(3);

    const afterRestore = await courseBuilderCheckpointListController(
      { id: courseId },
      creator.context,
    );
    expect(
      afterRestore.checkpoints.some((item) => item.source === 'restore'),
    ).toBe(true);

    const deleted = await courseBuilderCheckpointDeleteController(
      { id: courseId, checkpointId: manual.checkpoint.id },
      creator.context,
    );
    expect(deleted.id).toBe(manual.checkpoint.id);
  });

  it('submits a complete draft, records a submit snapshot, and publishes after admin approval', async () => {
    const creator = await createTestVerifiedCreator();
    const admin = await createTestPlatformAdmin(
      'course-builder-admin@test.dev',
    );
    const { course } = await courseBuilderCreateController(
      publishableBuilderInput('Review Ready Course'),
      creator.context,
    );

    const submitted = await courseBuilderSubmitForReviewController(
      { id: course.id },
      creator.context,
    );
    const approved = await platformAdminCourseReviewController(
      { id: course.id },
      { decision: 'approve' },
      admin.context,
    );
    const snapshots = await testPrismaClient().courseBuilderCheckpoint.findMany(
      {
        where: { courseId: course.id, source: 'submitSnapshot' },
      },
    );

    expect(submitted.course.status).toBe('inReview');
    expect(snapshots).toHaveLength(1);
    expect(approved.course.status).toBe('published');
    expect(approved.course.publishedAt).toBeTruthy();
  });
});
