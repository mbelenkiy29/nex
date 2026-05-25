import { describe, expect, it } from 'vitest';
import {
  courseAssignmentSubmissionController,
  courseLearnController,
  courseLessonCompleteController,
  courseMyLearningController,
} from '../courseControllers';
import {
  createTestCourseSeed,
  createTestEnrolledStudent,
} from '../../../test/testFactories';
import { testPrismaClient } from '../../../test/testPrismaClient';

describe('course student learning progress', () => {
  it('tracks lesson progress, completes the enrollment, creates a certificate, and keeps learning access', async () => {
    const { course, lessons, assignment } = await createTestCourseSeed({
      lessonCount: 2,
      certificateEnabled: true,
    });
    const student = await createTestEnrolledStudent(course.id);

    const first = await courseLessonCompleteController(
      { id: course.id, lessonId: lessons[0].id },
      student.context,
    );
    const second = await courseLessonCompleteController(
      { id: course.id, lessonId: lessons[1].id },
      student.context,
    );
    const submission = await courseAssignmentSubmissionController(
      { id: course.id, assignmentId: assignment.id },
      { text: 'I completed the course and reviewed the lessons.', files: [] },
      student.context,
    );
    const learn = await courseLearnController(
      { id: course.id },
      student.context,
    );
    const myLearning = await courseMyLearningController(student.context);
    const enrollment = await testPrismaClient().courseEnrollment.findUnique({
      where: {
        courseId_userId: { courseId: course.id, userId: student.user.id },
      },
    });

    expect(first.certificate).toBeNull();
    expect(second.enrollment?.status).toBe('completed');
    expect(second.certificate?.verificationCode).toBeTruthy();
    expect(submission.submission.status).toBe('submitted');
    expect(learn.certificate?.id).toBe(second.certificate?.id);
    expect(enrollment?.completedAt).toBeTruthy();
    expect(myLearning.enrolledCourses.map((item) => item.course.id)).toContain(
      course.id,
    );
    expect(myLearning.stats.completedLessons).toBe(2);
  });

  it('completes a course without creating a certificate when certificates are disabled', async () => {
    const { course, lessons } = await createTestCourseSeed({
      lessonCount: 1,
      certificateEnabled: false,
    });
    const student = await createTestEnrolledStudent(course.id);

    const completed = await courseLessonCompleteController(
      { id: course.id, lessonId: lessons[0].id },
      student.context,
    );
    const certificateCount = await testPrismaClient().courseCertificate.count({
      where: { courseId: course.id, userId: student.user.id },
    });

    expect(completed.enrollment?.status).toBe('completed');
    expect(completed.certificate).toBeNull();
    expect(certificateCount).toBe(0);
  });
});
