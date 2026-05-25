import { useAuthStore } from '@/features/auth/authStore';
import {
  newId,
  type BuilderFlashcard,
  type BuilderFlashcardSet,
  type BuilderSetForm,
} from '@/features/course/courseBuilderUtils';
import { Input } from '@/shared/components/ui/input';
import { AddButton, IconButton } from './primitives';

export function FlashcardSetCard({
  set,
  cards,
  editable,
  setForm,
}: {
  set: BuilderFlashcardSet;
  cards: BuilderFlashcard[];
  editable: boolean;
  setForm: BuilderSetForm;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const builder = dictionary.course.builder;

  const patchCard = (cardId: string, changes: Partial<BuilderFlashcard>) =>
    setForm((current) => ({
      ...current,
      flashcards: current.flashcards.map((card) =>
        card.id === cardId ? { ...card, ...changes } : card,
      ),
    }));

  return (
    <div className="rounded-xl border bg-white/80 p-3 dark:bg-white/10">
      <div className="flex items-center gap-2">
        <Input
          data-testid="course-builder-flashcard-set-title"
          value={set.title}
          disabled={!editable}
          placeholder={builder.flashcardSetLabel}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              flashcardSets: current.flashcardSets.map((item) =>
                item.id === set.id
                  ? { ...item, title: event.target.value }
                  : item,
              ),
            }))
          }
          className="h-9 rounded-lg bg-white/80 font-semibold dark:bg-white/10"
        />
        {editable && (
          <IconButton
            label={builder.actions.remove}
            onClick={() =>
              setForm((current) => ({
                ...current,
                flashcardSets: current.flashcardSets.filter(
                  (item) => item.id !== set.id,
                ),
                flashcards: current.flashcards.filter(
                  (card) => card.flashcardSetId !== set.id,
                ),
              }))
            }
          />
        )}
      </div>

      <div className="mt-3 grid gap-2 pl-2">
        {cards.length === 0 && (
          <p className="text-muted-foreground text-xs">{builder.noCards}</p>
        )}
        {cards.map((card) => (
          <div
            key={card.id}
            className="grid gap-2 rounded-lg border bg-white/90 p-2 md:grid-cols-[1fr_1fr_1fr_auto] dark:bg-white/10"
          >
            <Input
              value={card.front}
              disabled={!editable}
              placeholder={builder.flashcardFront}
              onChange={(event) =>
                patchCard(card.id, { front: event.target.value })
              }
              className="h-9 rounded-lg bg-white/80 dark:bg-white/10"
            />
            <Input
              value={card.back}
              disabled={!editable}
              placeholder={builder.flashcardBack}
              onChange={(event) =>
                patchCard(card.id, { back: event.target.value })
              }
              className="h-9 rounded-lg bg-white/80 dark:bg-white/10"
            />
            <Input
              value={card.hint}
              disabled={!editable}
              placeholder={builder.flashcardHint}
              onChange={(event) =>
                patchCard(card.id, { hint: event.target.value })
              }
              className="h-9 rounded-lg bg-white/80 dark:bg-white/10"
            />
            {editable && (
              <IconButton
                label={builder.actions.remove}
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    flashcards: current.flashcards.filter(
                      (item) => item.id !== card.id,
                    ),
                  }))
                }
              />
            )}
          </div>
        ))}
        {editable && (
          <AddButton
            label={builder.actions.addFlashcard}
            onClick={() =>
              setForm((current) => ({
                ...current,
                flashcards: [
                  ...current.flashcards,
                  {
                    id: newId(),
                    flashcardSetId: set.id,
                    front: '',
                    back: '',
                    hint: '',
                    orderIndex: current.flashcards.filter(
                      (card) => card.flashcardSetId === set.id,
                    ).length,
                  },
                ],
              }))
            }
          />
        )}
      </div>
    </div>
  );
}
