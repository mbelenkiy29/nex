import { formatDateTime } from '@project/backend/shared/lib/formatDateTime';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import {
  LuArrowLeft,
  LuEye,
  LuHistory,
  LuRotateCcw,
  LuSave,
  LuSend,
  LuTrash2,
  LuUndo2,
} from 'react-icons/lu';
import { toast } from 'sonner';
import { useAuthStore } from '@/features/auth/authStore';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { AutosaveIndicator } from './AutosaveIndicator';
import { useBuilder } from './BuilderContext';

// Sticky builder header: course title, live status, autosave state, and the
// preview / submit / withdraw actions.
export function BuilderTopBar() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const builder = dictionary.course.builder;
  const navigate = useNavigate();
  const {
    courseId,
    form,
    status,
    saveStatus,
    saveNow,
    withdraw,
    withdrawPending,
    isVerifiedCreator,
  } = useBuilder();

  const handleSave = async () => {
    const saved = await saveNow();
    if (saved) {
      toast.success(builder.success.saved);
    } else {
      toast.error(dictionary.shared.errors.unknown);
    }
  };

  return (
    <header className="nex-glass-card sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 rounded-3xl p-4 lg:p-5">
      <div className="min-w-0">
        <Link
          to="/creator/courses"
          className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs font-semibold"
        >
          <LuArrowLeft className="size-3.5" />
          {builder.backToCourses}
        </Link>
        <div className="mt-1.5 flex items-center gap-2">
          <h1 className="truncate text-xl font-extrabold">
            {form.title.trim() || builder.untitledCourse}
          </h1>
          <Badge variant="outline" className="rounded-xl">
            {dictionaryEnumerator(dictionary.course.enumerators.status, status)}
          </Badge>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <AutosaveIndicator />
        {status === 'draft' && isVerifiedCreator && (
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-xl bg-white/70 dark:bg-white/8"
            disabled={saveStatus === 'saving'}
            onClick={handleSave}
          >
            <LuSave className="size-4" />
            {builder.actions.save}
          </Button>
        )}
        <BuilderVersionHistoryDialog />
        <Button
          data-testid="course-builder-preview-button"
          variant="outline"
          className="h-10 rounded-xl bg-white/70 dark:bg-white/8"
          disabled={saveStatus === 'saving'}
          onClick={() =>
            navigate({
              to: '/creator/courses/$courseId/preview',
              params: { courseId },
            })
          }
        >
          <LuEye className="size-4" />
          {builder.actions.preview}
        </Button>

        {status === 'draft' && isVerifiedCreator && (
          <Button
            data-testid="course-builder-submit-button"
            className="h-10 rounded-xl"
            onClick={() =>
              navigate({
                to: '/creator/courses/$courseId/edit/submit',
                params: { courseId },
              })
            }
          >
            <LuSend className="size-4" />
            {builder.actions.submitForReview}
          </Button>
        )}

        {(status === 'inReview' || status === 'published') &&
          isVerifiedCreator && (
            <Button
              data-testid="course-builder-withdraw-button"
              variant="outline"
              className="h-10 rounded-xl bg-white/70 dark:bg-white/8"
              disabled={withdrawPending}
              onClick={() => {
                const message =
                  status === 'published'
                    ? builder.unpublishConfirm
                    : builder.withdrawConfirm;
                if (window.confirm(message)) {
                  withdraw();
                }
              }}
            >
              <LuUndo2 className="size-4" />
              {status === 'published'
                ? builder.actions.unpublish
                : builder.actions.withdraw}
            </Button>
          )}
      </div>
    </header>
  );
}

function BuilderVersionHistoryDialog() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const builder = dictionary.course.builder;
  const checkpointText = builder.checkpoints;
  const [label, setLabel] = useState('');
  const {
    checkpoints,
    checkpointsLoading,
    createCheckpoint,
    restoreCheckpoint,
    deleteCheckpoint,
    checkpointPending,
    editable,
  } = useBuilder();

  const handleCreate = () => {
    const nextLabel = label.trim();
    if (!nextLabel) {
      return;
    }
    createCheckpoint(nextLabel);
    setLabel('');
  };

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-xl bg-white/70 dark:bg-white/8"
          />
        }
      >
        <LuHistory className="size-4" />
        {checkpointText.title}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{checkpointText.title}</DialogTitle>
          <DialogDescription>{checkpointText.body}</DialogDescription>
        </DialogHeader>

        {editable && (
          <div className="grid gap-2 rounded-2xl border bg-white/70 p-3 dark:bg-white/8">
            <Label htmlFor="course-builder-checkpoint-label">
              {checkpointText.label}
            </Label>
            <div className="flex gap-2">
              <Input
                id="course-builder-checkpoint-label"
                value={label}
                maxLength={120}
                placeholder={checkpointText.labelPlaceholder}
                onChange={(event) => setLabel(event.target.value)}
              />
              <Button
                type="button"
                className="shrink-0 rounded-xl"
                disabled={!label.trim() || checkpointPending}
                onClick={handleCreate}
              >
                <LuSave className="size-4" />
                {checkpointText.create}
              </Button>
            </div>
          </div>
        )}

        <div className="grid max-h-[420px] gap-2 overflow-y-auto pr-1">
          {checkpointsLoading ? (
            <p className="text-muted-foreground text-sm">
              {checkpointText.loading}
            </p>
          ) : checkpoints.length ? (
            checkpoints.map((checkpoint) => (
              <div
                key={checkpoint.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-white/70 p-3 dark:bg-white/8"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">
                      {checkpoint.label ||
                        checkpointText.sources[checkpoint.source]}
                    </p>
                    <Badge variant="outline" className="rounded-lg">
                      {checkpointText.sources[checkpoint.source]}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {formatDateTime(checkpoint.updatedAt, dictionary)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-8 rounded-lg bg-white/70 dark:bg-white/8"
                    disabled={!editable || checkpointPending}
                    onClick={() => restoreCheckpoint(checkpoint.id)}
                  >
                    <LuRotateCcw className="size-4" />
                    {checkpointText.restore}
                  </Button>
                  {checkpoint.source === 'manual' && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 rounded-lg"
                      aria-label={checkpointText.delete}
                      disabled={checkpointPending}
                      onClick={() => deleteCheckpoint(checkpoint.id)}
                    >
                      <LuTrash2 className="size-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-sm">
              {checkpointText.empty}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
