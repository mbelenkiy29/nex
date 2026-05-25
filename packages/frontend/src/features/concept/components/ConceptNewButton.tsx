import { Link } from '@tanstack/react-router';
import { Button } from '@/shared/components/ui/button';
import { useAuthStore } from '@/features/auth/authStore';

export function ConceptNewButton() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const hasPermission = useAuthStore((state) => state.hasPermission);

  const hasPermissionToCreate = hasPermission({
    concept: ['create'],
  });

  if (!hasPermissionToCreate) {
    return null;
  }

  return (
    <Button
      nativeButton={false}
      render={
        <Link
          to="/concept/new"
          search={{
            referrer: window.location.pathname + window.location.search,
          }}
        />
      }
    >
      {dictionary.concept.new.menu}
    </Button>
  );
}
