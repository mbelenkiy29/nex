import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { useAuthStore } from '@/features/auth/authStore';
import type { AuditLogWithAuthor } from '@project/backend/features/auditLog/auditLogSchemas';
import { LuEye } from 'react-icons/lu';
import { RxDotsHorizontal } from 'react-icons/rx';

export function AuditLogActions({
  mode,
  auditLog,
  onView,
}: {
  mode: 'table' | 'view';
  auditLog: AuditLogWithAuthor;
  onView: (auditLog: AuditLogWithAuthor) => void;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);

  if (mode === 'view') {
    return null;
  }

  return (
    <div className="flex justify-end gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              className="aria-expanded:bg-muted flex h-8 w-8 p-0"
            />
          }
        >
          <RxDotsHorizontal className="h-4 w-4" />
          <span className="sr-only">{dictionary.shared.openMenu}</span>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => onView(auditLog)}>
            <LuEye className="text-foreground/50 mr-2 h-4 w-4" />{' '}
            {dictionary.shared.view}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
