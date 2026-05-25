import { Link } from '@tanstack/react-router';
import { Button } from '@/shared/components/ui/button';
import { useAuthStore } from '@/features/auth/authStore';

export function ChapterNewButton() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const hasPermission = useAuthStore((state) => state.hasPermission);

  const hasPermissionToCreate = hasPermission({
    chapter: ['create'],
  });

  if (!hasPermissionToCreate) {
    return null;
  }

  return (
    <Button
      nativeButton={false}
      render={
        <Link
          to="/chapter/new"
          search={{
            referrer: window.location.pathname + window.location.search,
          }}
        />
      }
    >
      {dictionary.chapter.new.menu}
    </Button>
  );
}
