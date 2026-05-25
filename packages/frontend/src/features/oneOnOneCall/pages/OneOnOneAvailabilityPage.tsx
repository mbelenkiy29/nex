import { createLazyRoute } from '@tanstack/react-router';
import { InstructorAvailabilityEditor } from '../InstructorAvailabilityEditor';
import { SessionTypeEditor } from '../SessionTypeEditor';

/**
 * Instructor-facing page for setting recurring 1:1 availability and defining
 * bookable session types. Routed under `/creator/availability` and gated by
 * the same `ensureCreatorAccess` check as the course builder.
 */
export function OneOnOneAvailabilityPage() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-5 p-5">
      <InstructorAvailabilityEditor />
      <SessionTypeEditor />
    </div>
  );
}

export const oneOnOneAvailabilityLazyRoute = createLazyRoute(
  '/creator/availability',
)({
  component: OneOnOneAvailabilityPage,
});
