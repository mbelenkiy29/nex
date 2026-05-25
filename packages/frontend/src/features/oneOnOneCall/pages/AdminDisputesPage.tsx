import { createLazyRoute } from '@tanstack/react-router';
import { AdminDisputeConsole } from '../AdminDisputeConsole';

/**
 * Platform-admin route for reviewing and resolving 1:1 disputes. The
 * authoritative gate is the backend (`authGuardPlatformAdminBackend`); the
 * frontend route mirrors the existing platformAdminRouter gate for
 * navigability.
 */
export function AdminDisputesPage() {
  return (
    <div className="mx-auto w-full max-w-6xl p-5">
      <AdminDisputeConsole />
    </div>
  );
}

export const adminDisputesLazyRoute = createLazyRoute(
  '/platform-admin/one-on-one-disputes',
)({
  component: AdminDisputesPage,
});
