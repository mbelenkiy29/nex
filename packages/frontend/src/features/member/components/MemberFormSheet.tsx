import { useAuthStore } from '@/features/auth/authStore';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/ui/sheet';
import { MemberEditForm } from '@/features/member/components/MemberEditForm';
import { MemberNewForm } from '@/features/member/components/MemberNewForm';
import { MemberWithRelationships } from '@project/backend/features/member/memberSchemas';

export function MemberFormSheet({
  member,
  onCancel,
  onSuccess,
}: {
  member?: Partial<MemberWithRelationships>;
  onCancel: () => void;
  onSuccess: (member?: MemberWithRelationships) => void;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);

  return (
    <Sheet
      open={true}
      onOpenChange={(open) => (!open ? onCancel() : null)}
      modal={true}
    >
      <SheetContent className="w-full overflow-y-scroll sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            {member?.id
              ? dictionary.member.edit.title
              : dictionary.member.new.title}
          </SheetTitle>
        </SheetHeader>

        <div className="px-4 pb-4">
          {member?.id ? (
            <MemberEditForm
              member={member}
              onCancel={onCancel}
              onSuccess={onSuccess}
            />
          ) : (
            <MemberNewForm
              member={member}
              onCancel={onCancel}
              onSuccess={onSuccess}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
