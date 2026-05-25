import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { toast } from 'sonner';
import { useAuthStore } from '@/features/auth/authStore';
import {
  builderFormToPayload,
  courseBuilderPayloadToForm,
  courseBuilderValidationSummary,
  courseToBuilderForm,
  emptyBuilderForm,
  type BuilderSetForm,
  type CourseBuilderForm,
} from '@/features/course/courseBuilderUtils';
import type {
  Course,
  CourseBuilderCheckpoint,
  CourseStatus,
} from '@/features/course/courseTypes';
import { apiClient } from '@/shared/lib/apiClient';
import {
  builderRecoveryClear,
  builderRecoveryRead,
  builderRecoveryWrite,
  type BuilderRecoverySnapshot,
} from './builderLocalState';
import { useAutosave, type SaveStatus } from './useAutosave';

type BuilderContextValue = {
  courseId: string;
  isLoading: boolean;
  isError: boolean;
  course: Course | null;
  form: CourseBuilderForm;
  status: CourseStatus;
  reviewNotes: string | null;
  editable: boolean;
  isVerifiedCreator: boolean;
  update: (patch: Partial<CourseBuilderForm>) => void;
  mutate: BuilderSetForm;
  saveStatus: SaveStatus;
  lastSavedAt: number | null;
  saveNow: () => Promise<boolean>;
  retrySave: () => void;
  checkpoints: CourseBuilderCheckpoint[];
  checkpointsLoading: boolean;
  createCheckpoint: (label: string) => void;
  restoreCheckpoint: (checkpointId: string) => void;
  deleteCheckpoint: (checkpointId: string) => void;
  checkpointPending: boolean;
  validationSummary: ReturnType<typeof courseBuilderValidationSummary>;
  recoverySnapshot: BuilderRecoverySnapshot | null;
  restoreRecovery: () => void;
  discardRecovery: () => void;
  dismissRecovery: () => void;
  submit: () => void;
  withdraw: () => void;
  submitPending: boolean;
  withdrawPending: boolean;
};

const BuilderContext = createContext<BuilderContextValue | null>(null);

/**
 * Owns the whole course-builder editing session: loads the course, holds the
 * form, drives autosave, and runs submit/withdraw. Lives inside the builder
 * shell route so its lifecycle matches one course-edit session.
 */
export function BuilderProvider({
  courseId,
  children,
}: {
  courseId: string;
  children: ReactNode;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const isVerifiedCreator = useAuthStore((state) => state.isVerifiedCreator);
  const builder = dictionary.course.builder;
  const queryClient = useQueryClient();

  const [form, setForm] = useState<CourseBuilderForm>(emptyBuilderForm());
  const [status, setStatus] = useState<CourseStatus>('draft');
  const [reviewNotes, setReviewNotes] = useState<string | null>(null);
  const [recoverySnapshot, setRecoverySnapshot] =
    useState<BuilderRecoverySnapshot | null>(null);
  // Bumped only by real user edits — autosave keys off this, never off `form`,
  // so the initial server-seeded form is not saved straight back.
  const [editTick, setEditTick] = useState(0);

  const courseQuery = useQuery({
    queryKey: ['courseBuilder', courseId],
    queryFn: async ({ signal }) =>
      apiClient
        .get(`api/course-builder/${courseId}`, { signal })
        .json<{ course: Course }>(),
  });

  const checkpointsQuery = useQuery({
    queryKey: ['courseBuilderCheckpoints', courseId],
    queryFn: async ({ signal }) =>
      apiClient
        .get(`api/course-builder/${courseId}/checkpoints`, { signal })
        .json<{ checkpoints: CourseBuilderCheckpoint[] }>(),
    enabled: Boolean(courseQuery.data?.course),
  });

  useEffect(() => {
    const course = courseQuery.data?.course;
    if (course) {
      setForm(courseToBuilderForm(course));
      setStatus(course.status);
      setReviewNotes(course.reviewNotes || null);
    }
  }, [courseQuery.data?.course]);

  useEffect(() => {
    const course = courseQuery.data?.course;
    if (course) {
      const localSnapshot = builderRecoveryRead(courseId);
      const serverUpdatedAt = course.updatedAt
        ? new Date(course.updatedAt).getTime()
        : 0;
      const serverCheckpoint = checkpointsQuery.data?.checkpoints?.find(
        (checkpoint) =>
          checkpoint.source === 'autosave' &&
          new Date(checkpoint.updatedAt).getTime() > serverUpdatedAt,
      );
      const candidates: BuilderRecoverySnapshot[] = [];
      if (
        editTick === 0 &&
        localSnapshot &&
        localSnapshot.capturedAt > serverUpdatedAt
      ) {
        candidates.push(localSnapshot);
      }
      if (editTick === 0 && serverCheckpoint) {
        candidates.push({
          courseId,
          capturedAt: new Date(serverCheckpoint.updatedAt).getTime(),
          serverUpdatedAt: course.updatedAt || null,
          form: courseBuilderPayloadToForm(serverCheckpoint.payload),
        });
      }

      if (course.status === 'draft' && isVerifiedCreator && candidates.length) {
        setRecoverySnapshot(
          candidates.sort((a, b) => b.capturedAt - a.capturedAt)[0] || null,
        );
      } else {
        setRecoverySnapshot(null);
        if (localSnapshot && localSnapshot.capturedAt <= serverUpdatedAt) {
          builderRecoveryClear(courseId);
        }
      }
    }
  }, [
    courseId,
    courseQuery.data?.course,
    checkpointsQuery.data?.checkpoints,
    editTick,
    isVerifiedCreator,
  ]);

  const editable = status === 'draft' && isVerifiedCreator;
  const serverUpdatedAt = courseQuery.data?.course?.updatedAt || null;

  const update = useCallback(
    (patch: Partial<CourseBuilderForm>) => {
      setForm((current) => {
        const next = { ...current, ...patch };
        if (editable) {
          builderRecoveryWrite(courseId, next, serverUpdatedAt);
        }
        return next;
      });
      setEditTick((tick) => tick + 1);
    },
    [courseId, editable, serverUpdatedAt],
  );
  const mutate = useCallback<BuilderSetForm>(
    (updater) => {
      setForm((current) => {
        const next = updater(current);
        if (editable) {
          builderRecoveryWrite(courseId, next, serverUpdatedAt);
        }
        return next;
      });
      setEditTick((tick) => tick + 1);
    },
    [courseId, editable, serverUpdatedAt],
  );

  const clearRecovery = useCallback(() => {
    builderRecoveryClear(courseId);
    setRecoverySnapshot(null);
  }, [courseId]);

  const { saveStatus, lastSavedAt, saveNow, retry } = useAutosave({
    courseId,
    form,
    editTick,
    enabled: editable,
    onSaved: clearRecovery,
    onCheckpointSaved: () => {
      void queryClient.invalidateQueries({
        queryKey: ['courseBuilderCheckpoints', courseId],
      });
    },
  });

  const restoreRecovery = useCallback(() => {
    if (!recoverySnapshot) {
      return;
    }

    setForm(recoverySnapshot.form);
    setEditTick((tick) => tick + 1);
    setRecoverySnapshot(null);
  }, [recoverySnapshot]);

  const submitMutation = useMutation({
    mutationFn: () =>
      apiClient
        .post(`api/course-builder/${courseId}/submit`)
        .json<{ course: Course }>(),
    onSuccess: async (data) => {
      setStatus(data.course.status);
      setReviewNotes(data.course.reviewNotes || null);
      await queryClient.invalidateQueries({ queryKey: ['courseBuilder'] });
      toast.success(builder.success.submitted);
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const withdrawMutation = useMutation({
    mutationFn: () =>
      apiClient
        .post(`api/course-builder/${courseId}/withdraw`)
        .json<{ course: Course }>(),
    onSuccess: async (data) => {
      setStatus(data.course.status);
      setReviewNotes(data.course.reviewNotes || null);
      await queryClient.invalidateQueries({ queryKey: ['courseBuilder'] });
      toast.success(builder.success.withdrawn);
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const createCheckpointMutation = useMutation({
    mutationFn: (label: string) =>
      apiClient
        .post(`api/course-builder/${courseId}/checkpoints`, {
          json: {
            source: 'manual',
            label,
            payload: builderFormToPayload(form),
          },
        })
        .json<{ checkpoint: CourseBuilderCheckpoint }>(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['courseBuilderCheckpoints', courseId],
      });
      toast.success(builder.checkpoints.created);
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const restoreCheckpointMutation = useMutation({
    mutationFn: (checkpointId: string) =>
      apiClient
        .post(
          `api/course-builder/${courseId}/checkpoints/${checkpointId}/restore`,
        )
        .json<{
          checkpoint: CourseBuilderCheckpoint;
          course?: Course;
          restoredToCourse: boolean;
        }>(),
    onSuccess: async (data) => {
      if (data.course) {
        setForm(courseToBuilderForm(data.course));
        setStatus(data.course.status);
        setReviewNotes(data.course.reviewNotes || null);
      } else {
        setForm(courseBuilderPayloadToForm(data.checkpoint.payload));
        setEditTick((tick) => tick + 1);
      }
      clearRecovery();
      await queryClient.invalidateQueries({ queryKey: ['courseBuilder'] });
      await queryClient.invalidateQueries({
        queryKey: ['courseBuilderCheckpoints', courseId],
      });
      toast.success(builder.checkpoints.restored);
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const deleteCheckpointMutation = useMutation({
    mutationFn: (checkpointId: string) =>
      apiClient
        .delete(
          `api/course-builder/${courseId}/checkpoints/${checkpointId}`,
        )
        .json<{ id: string }>(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['courseBuilderCheckpoints', courseId],
      });
      toast.success(builder.checkpoints.deleted);
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const validationSummary = useMemo(
    () => courseBuilderValidationSummary(form),
    [form],
  );

  const value = useMemo<BuilderContextValue>(
    () => ({
      courseId,
      isLoading: courseQuery.isLoading,
      isError: courseQuery.isError,
      course: courseQuery.data?.course || null,
      form,
      status,
      reviewNotes,
      editable,
      isVerifiedCreator,
      update,
      mutate,
      saveStatus,
      lastSavedAt,
      saveNow,
      retrySave: retry,
      checkpoints: checkpointsQuery.data?.checkpoints || [],
      checkpointsLoading: checkpointsQuery.isLoading,
      createCheckpoint: (label) => createCheckpointMutation.mutate(label),
      restoreCheckpoint: (checkpointId) =>
        restoreCheckpointMutation.mutate(checkpointId),
      deleteCheckpoint: (checkpointId) =>
        deleteCheckpointMutation.mutate(checkpointId),
      checkpointPending:
        createCheckpointMutation.isPending ||
        restoreCheckpointMutation.isPending ||
        deleteCheckpointMutation.isPending,
      validationSummary,
      recoverySnapshot,
      restoreRecovery,
      discardRecovery: clearRecovery,
      dismissRecovery: () => setRecoverySnapshot(null),
      submit: () => submitMutation.mutate(),
      withdraw: () => withdrawMutation.mutate(),
      submitPending: submitMutation.isPending,
      withdrawPending: withdrawMutation.isPending,
    }),
    [
      courseId,
      courseQuery.isLoading,
      courseQuery.isError,
      courseQuery.data?.course,
      form,
      status,
      reviewNotes,
      editable,
      isVerifiedCreator,
      update,
      mutate,
      saveStatus,
      lastSavedAt,
      saveNow,
      retry,
      checkpointsQuery.data?.checkpoints,
      checkpointsQuery.isLoading,
      createCheckpointMutation,
      restoreCheckpointMutation,
      deleteCheckpointMutation,
      validationSummary,
      recoverySnapshot,
      restoreRecovery,
      clearRecovery,
      submitMutation,
      withdrawMutation,
    ],
  );

  return (
    <BuilderContext.Provider value={value}>{children}</BuilderContext.Provider>
  );
}

export function useBuilder() {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error('useBuilder must be used within a BuilderProvider');
  }
  return context;
}
