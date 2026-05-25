import { useQuery } from '@tanstack/react-query';
import { Link, createLazyRoute, useParams } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import {
  LuArrowLeft,
  LuCheck,
  LuCircleHelp,
  LuFileText,
  LuListChecks,
} from 'react-icons/lu';
import { useAuthStore } from '@/features/auth/authStore';
import { CourseLearningPlayer } from '@/features/course/components/player/CourseLearningPlayer';
import type {
  Course,
  CourseAssignment,
  CourseQuestion,
  CourseQuiz,
} from '@/features/course/courseTypes';
import { PageHeader } from '@/shared/components/PageHeader';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent } from '@/shared/components/ui/card';
import { apiClient } from '@/shared/lib/apiClient';

export const courseBuilderPreviewLazyRoute = createLazyRoute(
  '/creator/courses/$courseId/preview',
)({
  component: CourseBuilderPreviewPage,
});

export function CourseBuilderPreviewPage() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const { courseId } = useParams({
    from: '/creator/courses/$courseId/preview',
  });
  const builder = dictionary.course.builder;

  const courseQuery = useQuery({
    queryKey: ['courseBuilder', courseId],
    queryFn: async ({ signal }) =>
      apiClient
        .get(`api/course-builder/${courseId}`, { signal })
        .json<{ course: Course }>(),
  });

  const course = courseQuery.data?.course;
  const [selectedLessonId, setSelectedLessonId] = useState('');
  const lessons = useMemo(() => course?.lessons || [], [course]);
  const selectedLesson =
    lessons.find((lesson) => lesson.id === selectedLessonId) || lessons[0];
  const completedLessonIds = useMemo(() => new Set<string>(), []);

  useEffect(() => {
    if (!selectedLessonId && lessons[0]) {
      setSelectedLessonId(lessons[0].id);
    }
  }, [lessons, selectedLessonId]);

  const selectedAssignments = useMemo(() => {
    if (!course || !selectedLesson) {
      return [];
    }

    return course.assignments.filter(
      (assignment) =>
        assignment.lessonId === selectedLesson.id ||
        assignment.moduleId === selectedLesson.moduleId,
    );
  }, [course, selectedLesson]);

  const selectedQuizzes = useMemo(() => {
    if (!course || !selectedLesson) {
      return [];
    }

    return (course.quizzes || []).filter(
      (quiz) =>
        quiz.lessonId === selectedLesson.id ||
        (Boolean(quiz.moduleId) &&
          quiz.moduleId === selectedLesson.moduleId),
    );
  }, [course, selectedLesson]);

  return (
    <div className="nex-dashboard-shell flex flex-col gap-6 px-4 py-6 lg:px-7">
      <PageHeader
        items={[[builder.menu, '/creator/courses'], [builder.actions.preview]]}
      />

      <Card className="border-nexexam-primary/30 bg-nexexam-primary/10 rounded-2xl">
        <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
          <p className="text-sm font-semibold">{builder.previewBanner}</p>
          <Link
            to="/creator/courses/$courseId/edit"
            params={{ courseId }}
            className="flex items-center gap-1 text-sm font-semibold"
          >
            <LuArrowLeft className="size-4" />
            {builder.backToBuilder}
          </Link>
        </CardContent>
      </Card>

      {course && selectedLesson ? (
        <CourseLearningPlayer
          course={course}
          selectedLesson={selectedLesson}
          completedLessonIds={completedLessonIds}
          completionPercent={0}
          onSelectLesson={setSelectedLessonId}
          hasSelectedQuiz={selectedQuizzes.length > 0}
          mode="preview"
          activityContent={
            <>
              <PreviewAssignmentPanel assignments={selectedAssignments} />
              <PreviewQuizPanel quizzes={selectedQuizzes} />
            </>
          }
        />
      ) : course ? (
        <Card className="nex-glass-card rounded-3xl border-white/70 dark:border-white/10">
          <CardContent className="p-6 text-sm font-semibold">
            {builder.noItems}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

function PreviewQuizPanel({ quizzes }: { quizzes: CourseQuiz[] }) {
  const dictionary = useAuthStore((state) => state.dictionary);

  if (!quizzes.length) {
    return null;
  }

  return (
    <Card className="nex-glass-card rounded-3xl border-white/70 dark:border-white/10">
      <CardContent className="space-y-5 p-6">
        <h2 className="flex items-center gap-2 text-xl font-extrabold">
          <LuListChecks className="text-primary size-5" />
          {dictionary.course.learn.quizzes}
        </h2>
        {quizzes.map((quiz) => {
          const questions = quiz.questions
            .map((link) => link.question)
            .filter((question): question is CourseQuestion =>
              Boolean(question),
            );

          return (
            <div
              key={quiz.id}
              className="rounded-2xl border bg-white/70 p-4 dark:bg-white/8"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="flex items-center gap-2 font-extrabold">
                  <LuListChecks className="text-primary size-4" />
                  {quiz.title || dictionary.course.quiz.heading}
                </h3>
                {quiz.passingScore != null && (
                  <Badge variant="outline" className="rounded-lg">
                    {dictionary.course.quiz.passingScore}: {quiz.passingScore}%
                  </Badge>
                )}
              </div>
              <div className="mt-3 grid gap-3">
                {questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="rounded-xl border bg-white/80 p-3 dark:bg-white/10"
                  >
                    <p className="flex items-center gap-2 text-sm font-semibold">
                      <LuCircleHelp className="size-4" />
                      {index + 1}. {question.questionText}
                    </p>
                    <ul className="mt-2 grid gap-1">
                      {question.answers.map((option) => (
                        <li
                          key={option.id}
                          className="flex items-center gap-2 text-sm"
                        >
                          <span
                            className={
                              option.isCorrect
                                ? 'bg-nexexam-success text-white grid size-4 place-items-center rounded'
                                : 'grid size-4 place-items-center rounded border'
                            }
                          >
                            {option.isCorrect && (
                              <LuCheck className="size-3" />
                            )}
                          </span>
                          <span>{option.answerText}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function PreviewAssignmentPanel({
  assignments,
}: {
  assignments: CourseAssignment[];
}) {
  const dictionary = useAuthStore((state) => state.dictionary);

  if (!assignments.length) {
    return null;
  }

  return (
    <Card className="nex-glass-card rounded-3xl border-white/70 dark:border-white/10">
      <CardContent className="space-y-4 p-6">
        <h2 className="flex items-center gap-2 text-xl font-extrabold">
          <LuFileText className="text-primary size-5" />
          {dictionary.course.learn.assignments}
        </h2>
        {assignments.map((assignment) => (
          <div
            key={assignment.id}
            className="rounded-2xl border bg-white/70 p-4 dark:bg-white/8"
          >
            <h3 className="flex items-center gap-2 font-extrabold">
              <LuFileText className="text-primary size-4" />
              {assignment.title}
            </h3>
            <p className="text-muted-foreground mt-1 text-sm whitespace-pre-wrap">
              {assignment.prompt}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
