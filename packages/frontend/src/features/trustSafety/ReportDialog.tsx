import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LuFlag } from 'react-icons/lu';
import { toast } from 'sonner';
import { useState } from 'react';
import { useAuthStore } from '@/features/auth/authStore';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Textarea } from '@/shared/components/ui/textarea';
import { apiClient } from '@/shared/lib/apiClient';

export function ReportDialog({
  open,
  onOpenChange,
  target,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  target: {
    targetType: 'course' | 'teacher' | 'courseRating';
    courseId?: string | null;
    teacherUserId?: string | null;
    ratingId?: string | null;
  };
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const queryClient = useQueryClient();
  const reasons = dictionary.trustSafety.report.reasons;
  const reasonEntries = Object.entries(reasons);
  const [reason, setReason] = useState(reasonEntries[0]?.[0] || 'other');
  const [details, setDetails] = useState('');
  const reportMutation = useMutation({
    mutationFn: () =>
      apiClient
        .post('api/trust-safety/reports', {
          json: {
            ...target,
            reason,
            details,
          },
        })
        .json(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['trustSafety'] });
      setDetails('');
      onOpenChange(false);
      toast.success(dictionary.trustSafety.success.reportCreated);
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-extrabold">
            <LuFlag className="text-primary size-5" />
            {dictionary.trustSafety.report.title}
          </DialogTitle>
          <DialogDescription>
            {dictionary.trustSafety.report.description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid grid-cols-2 gap-2">
            {reasonEntries.map(([value, label]) => (
              <Button
                key={value}
                type="button"
                variant={reason === value ? 'default' : 'outline'}
                className="h-auto min-h-10 justify-start rounded-lg text-left text-xs"
                onClick={() => setReason(value)}
              >
                {label}
              </Button>
            ))}
          </div>
          <Textarea
            value={details}
            onChange={(event) => setDetails(event.target.value)}
            placeholder={dictionary.trustSafety.report.detailsPlaceholder}
            rows={5}
          />
          <Button
            className="h-10 justify-self-end rounded-lg"
            disabled={reportMutation.isPending}
            onClick={() => reportMutation.mutate()}
          >
            {dictionary.trustSafety.report.submit}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
