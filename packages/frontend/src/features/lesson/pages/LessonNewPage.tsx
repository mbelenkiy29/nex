import {
  createLazyRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { useAuthStore } from '@/features/auth/authStore';
import { LessonForm } from '@/features/lesson/components/LessonForm';
import { PageHeader } from '@/shared/components/PageHeader';
import { LessonWithRelationships } from '@project/backend/features/lesson/lessonSchemas';

export const lessonNewLazyRoute = createLazyRoute('/lesson/new')({
  component: LessonNewPage,
});

export function LessonNewPage() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as Record<string, any>;
  const referrer = searchParams.referrer as string | undefined;

  const lessonListPath = referrer?.startsWith('/lesson?')
    ? referrer
    : '/lesson';

  return (
    <div className="flex flex-1 flex-col p-6">
      <PageHeader
        items={[
          [dictionary.lesson.list.menu, lessonListPath],
          [dictionary.lesson.new.menu],
        ]}
      />
      <div className="my-10">
        <LessonForm
          onSuccess={(lesson: LessonWithRelationships) =>
            navigate({
              to: `/lesson/${lesson.id}`,
              search: referrer ? { referrer } : undefined,
            })
          }
          onCancel={() =>
            referrer?.startsWith('/lesson?')
              ? navigate({ to: referrer as any })
              : navigate({ to: '/lesson' })
          }
        />
      </div>
    </div>
  );
}
