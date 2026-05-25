import type {
  CourseBuilderForm,
  CourseBuilderSection,
} from '@/features/course/courseBuilderUtils';

const lastSectionKey = (courseId: string) =>
  `nexexam-course-builder-last-section:${courseId}`;
const recoveryKey = (courseId: string) =>
  `nexexam-course-builder-recovery:${courseId}`;

export type BuilderRecoverySnapshot = {
  courseId: string;
  capturedAt: number;
  serverUpdatedAt: string | null;
  form: CourseBuilderForm;
};

const builderSections: CourseBuilderSection[] = [
  'goals',
  'landing-page',
  'curriculum',
  'practice-exams',
  'flashcards',
  'ai-assistant',
  'submit',
];

function canUseLocalStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

export function builderSectionFromPath(pathname: string) {
  const section = builderSections.find((item) => pathname.endsWith(`/${item}`));
  return section || null;
}

export function builderLastSectionRead(courseId: string) {
  if (!canUseLocalStorage()) {
    return null;
  }

  const value = window.localStorage.getItem(lastSectionKey(courseId));
  return builderSections.includes(value as CourseBuilderSection)
    ? (value as CourseBuilderSection)
    : null;
}

export function builderLastSectionWrite(
  courseId: string,
  section: CourseBuilderSection,
) {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(lastSectionKey(courseId), section);
}

export function builderRecoveryRead(courseId: string) {
  if (!canUseLocalStorage()) {
    return null;
  }

  const raw = window.localStorage.getItem(recoveryKey(courseId));
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as BuilderRecoverySnapshot;
    return parsed.courseId === courseId && parsed.form ? parsed : null;
  } catch {
    return null;
  }
}

export function builderRecoveryWrite(
  courseId: string,
  form: CourseBuilderForm,
  serverUpdatedAt: string | null,
) {
  if (!canUseLocalStorage()) {
    return;
  }

  const snapshot: BuilderRecoverySnapshot = {
    courseId,
    capturedAt: Date.now(),
    serverUpdatedAt,
    form,
  };

  window.localStorage.setItem(recoveryKey(courseId), JSON.stringify(snapshot));
}

export function builderRecoveryClear(courseId: string) {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.removeItem(recoveryKey(courseId));
}
