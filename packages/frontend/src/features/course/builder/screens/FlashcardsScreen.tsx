import { createLazyRoute } from '@tanstack/react-router';
import { LuLayers } from 'react-icons/lu';
import { useAuthStore } from '@/features/auth/authStore';
import { newId } from '@/features/course/courseBuilderUtils';
import { useBuilder } from '../BuilderContext';
import { FlashcardSetCard } from '../components/FlashcardSetCard';
import { AddButton, BuilderCard } from '../components/primitives';

export const builderFlashcardsLazyRoute = createLazyRoute(
  '/creator/courses/$courseId/edit/flashcards',
)({ component: FlashcardsScreen });

// "Content" phase — flashcard sets students can study.
function FlashcardsScreen() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const builder = dictionary.course.builder;
  const { form, editable, mutate } = useBuilder();

  return (
    <BuilderCard
      icon={<LuLayers className="size-5" />}
      title={builder.flashcards}
      description={builder.flashcardsBody}
    >
      {form.flashcardSets.length === 0 && (
        <p className="text-muted-foreground text-sm">
          {builder.noFlashcardSets}
        </p>
      )}
      {form.flashcardSets.map((set) => (
        <FlashcardSetCard
          key={set.id}
          set={set}
          cards={form.flashcards.filter(
            (card) => card.flashcardSetId === set.id,
          )}
          editable={editable}
          setForm={mutate}
        />
      ))}
      {editable && (
        <AddButton
          testId="course-builder-add-flashcard-set"
          label={builder.actions.addFlashcardSet}
          onClick={() =>
            mutate((current) => ({
              ...current,
              flashcardSets: [
                ...current.flashcardSets,
                {
                  id: newId(),
                  moduleId: null,
                  lessonId: null,
                  title: '',
                  description: '',
                  orderIndex: current.flashcardSets.length,
                },
              ],
            }))
          }
        />
      )}
    </BuilderCard>
  );
}
