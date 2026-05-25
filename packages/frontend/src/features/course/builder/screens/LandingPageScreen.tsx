import { storage } from '@project/backend/features/permissions';
import { createLazyRoute } from '@tanstack/react-router';
import { LuImage } from 'react-icons/lu';
import { useAuthStore } from '@/features/auth/authStore';
import { FilesUploadDropzone } from '@/features/file/components/FilesUploadDropzone';
import { Textarea } from '@/shared/components/ui/textarea';
import { useBuilder } from '../BuilderContext';
import { BuilderCard } from '../components/primitives';

export const builderLandingLazyRoute = createLazyRoute(
  '/creator/courses/$courseId/edit/landing-page',
)({ component: LandingPageScreen });

// "Plan" phase — the cover media and audience students see before enrolling.
function LandingPageScreen() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const builder = dictionary.course.builder;
  const { form, editable, update } = useBuilder();

  return (
    <BuilderCard
      icon={<LuImage className="size-5" />}
      title={builder.landingPage}
      description={builder.landingPageBody}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <span className="text-sm font-semibold">
            {dictionary.course.fields.thumbnail}
          </span>
          <FilesUploadDropzone
            storage={storage.courseThumbnails}
            max={1}
            formats={['png', 'jpg', 'jpeg', 'webp']}
            readonly={!editable}
            value={form.thumbnail}
            onChange={(value) => update({ thumbnail: value || [] })}
          />
        </div>
        <div className="grid gap-2">
          <span className="text-sm font-semibold">
            {dictionary.course.fields.introVideoFiles}
          </span>
          <FilesUploadDropzone
            storage={storage.courseVideos}
            max={1}
            formats={['mp4', 'webm', 'mov']}
            readonly={!editable}
            value={form.introVideoFiles}
            onChange={(value) => update({ introVideoFiles: value || [] })}
          />
        </div>
        <div className="grid gap-2">
          <span className="text-sm font-semibold">
            {builder.setup.promoVideo}
          </span>
          <FilesUploadDropzone
            storage={storage.courseVideos}
            max={1}
            formats={['mp4', 'webm', 'mov']}
            readonly={!editable}
            value={form.promoVideoFiles}
            onChange={(value) => update({ promoVideoFiles: value || [] })}
          />
        </div>
        <label className="grid gap-2 md:col-span-2">
          <span className="text-sm font-semibold">
            {builder.setup.audience}
          </span>
          <Textarea
            value={form.audience.join('\n')}
            disabled={!editable}
            onChange={(event) =>
              update({ audience: event.target.value.split('\n') })
            }
            className="min-h-20 rounded-xl bg-white/80 dark:bg-white/10"
          />
          <span className="text-muted-foreground text-xs">
            {builder.setup.audienceHint}
          </span>
        </label>
      </div>
    </BuilderCard>
  );
}
