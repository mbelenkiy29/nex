import { createLazyRoute } from '@tanstack/react-router';
import { MySessionsList } from '../MySessionsList';

/**
 * Student-facing list of upcoming/past 1:1 sessions. Routed at `/sessions`.
 * Toggle the "As instructor" tab to see the sessions you teach.
 */
export function MySessionsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl p-5">
      <MySessionsList />
    </div>
  );
}

export const mySessionsLazyRoute = createLazyRoute('/sessions')({
  component: MySessionsPage,
});
