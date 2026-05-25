import { DailyGoalWithRelationships } from '@project/backend/features/dailyGoal/dailyGoalSchemas';
import { DailyGoalForm } from '@/features/dailyGoal/components/DailyGoalForm';
import { useAuthStore } from '@/features/auth/authStore';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/ui/sheet';

export function DailyGoalFormSheet({
  dailyGoal,
  onCancel,
  onSuccess,
}: {
  dailyGoal?: Partial<DailyGoalWithRelationships>;
  onCancel: () => void;
  onSuccess: (dailyGoal: DailyGoalWithRelationships) => void;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);

  return (
    <Sheet
      open={true}
      onOpenChange={(open) => (!open ? onCancel() : null)}
      modal={true}
    >
      <SheetContent className="w-full overflow-y-scroll sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>
            {dailyGoal?.id
              ? dictionary.dailyGoal.edit.title
              : dictionary.dailyGoal.new.title}
          </SheetTitle>
        </SheetHeader>

        <div className="px-4 pb-4">
          <DailyGoalForm
            dailyGoal={dailyGoal}
            onCancel={onCancel}
            onSuccess={onSuccess}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
