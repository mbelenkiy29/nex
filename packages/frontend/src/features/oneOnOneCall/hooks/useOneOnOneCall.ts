import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/lib/apiClient';

// --- Types (mirror packages/backend/src/features/oneOnOneCall/ payloads) ---

export interface AvailabilityWindow {
  id?: string;
  dayOfWeek: number;
  startMinute: number;
  endMinute: number;
  timezone: string;
  isActive: boolean;
}

export interface OneOnOneSessionType {
  id: string;
  instructorUserId: string;
  courseId: string | null;
  title: string;
  description: string | null;
  durationMinutes: number;
  isFree: boolean;
  priceCents: number | null;
  currency: string;
  bufferMinutes: number;
  minNoticeHours: number;
  isActive: boolean;
}

export interface BookableSlot {
  startUtc: string;
  endUtc: string;
}

export type OneOnOneSessionStatus =
  | 'pendingPayment'
  | 'confirmed'
  | 'completed'
  | 'cancelledByStudent'
  | 'cancelledByInstructor'
  | 'noShow'
  | 'expired'
  | 'disputed'
  | 'refunded';

export interface SessionParty {
  id: string;
  name: string | null;
  email: string;
}

export type OneOnOneDisputeStatus =
  | 'open'
  | 'underReview'
  | 'resolvedRefund'
  | 'resolvedNoRefund';

export interface SessionDispute {
  id: string;
  status: OneOnOneDisputeStatus;
  reason: string;
  createdAt: string;
  resolvedAt: string | null;
  resolutionNotes: string | null;
}

export interface OneOnOneSessionRow {
  id: string;
  status: OneOnOneSessionStatus;
  scheduledStartAt: string;
  scheduledEndAt: string;
  jitsiUrl?: string | null;
  priceCents: number | null;
  currency: string;
  paidAt?: string | null;
  refundedAt?: string | null;
  refundCents?: number | null;
  isLateCancel: boolean;
  cancelledAt: string | null;
  cancellationReason: string | null;
  course: { id: string; title: string; slug: string };
  sessionType: { id: string; title: string; durationMinutes: number };
  instructorUser: SessionParty;
  studentUser: SessionParty;
  // Only populated by the session-detail endpoint (list responses omit it).
  dispute?: SessionDispute | null;
}

export interface SessionNote {
  id: string;
  body: string;
  isShared: boolean;
  authorUserId: string;
  createdAt: string;
  updatedAt: string;
  authorUser: SessionParty;
}

// --- Query keys -------------------------------------------------------------

const availabilityKey = ['oneOnOneCall', 'availability'] as const;
const sessionsKey = (role: string, scope: string) =>
  ['oneOnOneCall', 'sessions', role, scope] as const;
const sessionKey = (id: string) => ['oneOnOneCall', 'session', id] as const;
const courseSessionTypesKey = (courseId: string) =>
  ['oneOnOneCall', 'courseSessionTypes', courseId] as const;
const slotsKey = (courseId: string, sessionTypeId: string, from: string, to: string) =>
  ['oneOnOneCall', 'slots', courseId, sessionTypeId, from, to] as const;

// --- Instructor: own availability + session types --------------------------

export function useMyAvailability() {
  return useQuery({
    queryKey: availabilityKey,
    queryFn: () =>
      apiClient
        .get('api/one-on-one/availability')
        .json<{ windows: AvailabilityWindow[]; sessionTypes: OneOnOneSessionType[] }>(),
  });
}

export function usePutAvailability() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (windows: AvailabilityWindow[]) =>
      apiClient
        .put('api/one-on-one/availability', { json: { windows } })
        .json<{ windows: AvailabilityWindow[] }>(),
    onSuccess: () => qc.invalidateQueries({ queryKey: availabilityKey }),
  });
}

export interface SessionTypeInput {
  courseId?: string | null;
  title: string;
  description?: string | null;
  durationMinutes: number;
  isFree: boolean;
  priceCents?: number | null;
  currency?: string;
  bufferMinutes?: number;
  minNoticeHours?: number;
}

export function useCreateSessionType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: SessionTypeInput) =>
      apiClient
        .post('api/one-on-one/session-types', { json: input })
        .json<{ sessionType: OneOnOneSessionType }>(),
    onSuccess: () => qc.invalidateQueries({ queryKey: availabilityKey }),
  });
}

export function useUpdateSessionType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: { id: string } & Partial<SessionTypeInput> & { isActive?: boolean }) =>
      apiClient
        .patch(`api/one-on-one/session-types/${id}`, { json: input })
        .json<{ sessionType: OneOnOneSessionType }>(),
    onSuccess: () => qc.invalidateQueries({ queryKey: availabilityKey }),
  });
}

export function useDeleteSessionType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiClient
        .delete(`api/one-on-one/session-types/${id}`)
        .json<{ sessionType: OneOnOneSessionType }>(),
    onSuccess: () => qc.invalidateQueries({ queryKey: availabilityKey }),
  });
}

// --- Student-side: bookable types + open slots + booking --------------------

export function useCourseSessionTypes(courseId: string) {
  return useQuery({
    queryKey: courseSessionTypesKey(courseId),
    queryFn: () =>
      apiClient
        .get(`api/one-on-one/courses/${courseId}/session-types`)
        .json<{ sessionTypes: OneOnOneSessionType[] }>(),
    enabled: Boolean(courseId),
  });
}

export function useCourseSlots(
  courseId: string,
  sessionTypeId: string | null,
  fromIso: string,
  toIso: string,
) {
  return useQuery({
    queryKey: slotsKey(courseId, sessionTypeId ?? '', fromIso, toIso),
    queryFn: () =>
      apiClient
        .get(`api/one-on-one/courses/${courseId}/slots`, {
          searchParams: {
            sessionTypeId: sessionTypeId ?? '',
            from: fromIso,
            to: toIso,
          },
        })
        .json<{ slots: BookableSlot[] }>(),
    enabled: Boolean(courseId && sessionTypeId && fromIso && toIso),
  });
}

export function useCreateBooking(courseId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { sessionTypeId: string; startUtc: string }) =>
      apiClient
        .post(`api/one-on-one/courses/${courseId}/bookings`, { json: input })
        // Paid bookings come back with a `checkoutUrl` the caller should
        // redirect to; free bookings return only `session`.
        .json<{ session: OneOnOneSessionRow; checkoutUrl?: string }>(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['oneOnOneCall', 'sessions'] });
      qc.invalidateQueries({ queryKey: ['oneOnOneCall', 'slots'] });
    },
  });
}

// --- My sessions: list / detail / cancel / notes ---------------------------

export function useMySessions(
  role: 'student' | 'instructor' = 'student',
  scope: 'upcoming' | 'past' | 'all' = 'upcoming',
) {
  return useQuery({
    queryKey: sessionsKey(role, scope),
    queryFn: () =>
      apiClient
        .get('api/one-on-one/sessions', {
          searchParams: { role, scope },
        })
        .json<{ sessions: OneOnOneSessionRow[] }>(),
  });
}

export function useSession(sessionId: string | null) {
  return useQuery({
    queryKey: sessionKey(sessionId ?? ''),
    queryFn: () =>
      apiClient
        .get(`api/one-on-one/sessions/${sessionId}`)
        .json<{ session: OneOnOneSessionRow; notes: SessionNote[] }>(),
    enabled: Boolean(sessionId),
  });
}

export function useCancelSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      apiClient
        .post(`api/one-on-one/sessions/${id}/cancel`, {
          json: { reason },
        })
        .json<{
          session: OneOnOneSessionRow;
          outcome: { isLateCancel: boolean; refundCents: number };
        }>(),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['oneOnOneCall', 'sessions'] });
      qc.invalidateQueries({ queryKey: sessionKey(vars.id) });
    },
  });
}

export function useCreateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ sessionId, body, isShared }: { sessionId: string; body: string; isShared: boolean }) =>
      apiClient
        .post(`api/one-on-one/sessions/${sessionId}/notes`, {
          json: { body, isShared },
        })
        .json<{ note: SessionNote }>(),
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: sessionKey(vars.sessionId) }),
  });
}

export function useUpdateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      sessionId,
      noteId,
      body,
      isShared,
    }: {
      sessionId: string;
      noteId: string;
      body?: string;
      isShared?: boolean;
    }) =>
      apiClient
        .patch(`api/one-on-one/sessions/${sessionId}/notes/${noteId}`, {
          json: { body, isShared },
        })
        .json<{ note: SessionNote }>(),
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: sessionKey(vars.sessionId) }),
  });
}

export function useDeleteNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ sessionId, noteId }: { sessionId: string; noteId: string }) =>
      apiClient
        .delete(`api/one-on-one/sessions/${sessionId}/notes/${noteId}`)
        .json<{ ok: boolean }>(),
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: sessionKey(vars.sessionId) }),
  });
}

// Student opens a dispute on a paid completed/no-show session.
export function useOpenDispute() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ sessionId, reason }: { sessionId: string; reason: string }) =>
      apiClient
        .post(`api/one-on-one/sessions/${sessionId}/dispute`, {
          json: { reason },
        })
        .json<{ dispute: SessionDispute; session: OneOnOneSessionRow }>(),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: sessionKey(vars.sessionId) });
      qc.invalidateQueries({ queryKey: ['oneOnOneCall', 'sessions'] });
    },
  });
}
