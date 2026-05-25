import { Link } from '@tanstack/react-router';
import { Button } from '@/shared/components/ui/button';
import { useAuthStore } from '@/features/auth/authStore';

export function ExamInstanceNewButton() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const hasPermission = useAuthStore((state) => state.hasPermission);

  const hasPermissionToCreate = hasPermission({
    examInstance: ['create'],
  });

  if (!hasPermissionToCreate) {
    return null;
  }

  return (
    <Button
      nativeButton={false}
      render={
        <Link
          to="/exam-instance/new"
          search={{
            referrer: window.location.pathname + window.location.search,
          }}
        />
      }
    >
      {dictionary.examInstance.new.menu}
    </Button>
  );
}
