import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LuFileCheck } from 'react-icons/lu';
import { toast } from 'sonner';
import { useAuthStore } from '@/features/auth/authStore';
import {
  TrustSafetyPolicyStatus,
  TrustSafetyPolicyType,
} from '@/features/trustSafety/trustSafetyTypes';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { apiClient } from '@/shared/lib/apiClient';

export function useTrustSafetyPolicies(enabled = true) {
  return useQuery({
    queryKey: ['trustSafety', 'policies'],
    enabled,
    queryFn: async ({ signal }) =>
      apiClient
        .get('api/trust-safety/policies', { signal })
        .json<{ policies: TrustSafetyPolicyStatus[] }>(),
  });
}

export function missingTrustSafetyPolicies(
  policies: TrustSafetyPolicyStatus[] | undefined,
  requiredTypes: TrustSafetyPolicyType[],
) {
  return requiredTypes.filter((type) =>
    policies?.some((policy) => policy.type === type && !policy.accepted),
  );
}

export function PolicyAcceptanceDialog({
  open,
  onOpenChange,
  requiredTypes,
  onAccepted,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requiredTypes: TrustSafetyPolicyType[];
  onAccepted?: () => void;
}) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const queryClient = useQueryClient();
  const policiesQuery = useTrustSafetyPolicies(open);
  const policies = policiesQuery.data?.policies || [];
  const missing = missingTrustSafetyPolicies(policies, requiredTypes);
  const visiblePolicies = policies.filter((policy) =>
    requiredTypes.includes(policy.type),
  );
  const acceptMutation = useMutation({
    mutationFn: (policyType: TrustSafetyPolicyType) =>
      apiClient
        .post('api/trust-safety/policies/accept', {
          json: { policyType },
        })
        .json(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['trustSafety'] });
      toast.success(dictionary.trustSafety.success.policyAccepted);
      const next = await queryClient.fetchQuery({
        queryKey: ['trustSafety', 'policies'],
        queryFn: async ({ signal }) =>
          apiClient
            .get('api/trust-safety/policies', { signal })
            .json<{ policies: TrustSafetyPolicyStatus[] }>(),
      });
      if (!missingTrustSafetyPolicies(next.policies, requiredTypes).length) {
        onOpenChange(false);
        onAccepted?.();
      }
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[86vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-extrabold">
            <LuFileCheck className="text-primary size-5" />
            {dictionary.trustSafety.policies.title}
          </DialogTitle>
          <DialogDescription>
            {dictionary.trustSafety.policies.description}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3">
          {policiesQuery.isLoading && (
            <div className="text-muted-foreground rounded-xl border bg-white/70 p-4 text-sm dark:bg-white/8">
              {dictionary.shared.loading}
            </div>
          )}
          {visiblePolicies.map((policy) => {
            const text = dictionary.trustSafety.policies[policy.type];
            return (
              <section
                key={policy.id}
                className="rounded-xl border bg-white/80 p-4 dark:bg-white/8"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="font-extrabold">{text.title}</h3>
                    <p className="text-muted-foreground text-xs">
                      {dictionary.trustSafety.policies.version.replace(
                        '{0}',
                        policy.version,
                      )}
                    </p>
                  </div>
                  {policy.accepted && (
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                      {dictionary.trustSafety.policies.accepted}
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground mt-3 whitespace-pre-wrap text-sm">
                  {text.body}
                </p>
                {!policy.accepted && (
                  <Button
                    className="mt-4 h-9 rounded-lg"
                    disabled={acceptMutation.isPending}
                    onClick={() => acceptMutation.mutate(policy.type)}
                  >
                    {dictionary.trustSafety.policies.accept}
                  </Button>
                )}
              </section>
            );
          })}
        </div>

        {!policiesQuery.isLoading && !missing.length && (
          <Button
            className="h-10 justify-self-end rounded-lg"
            onClick={() => {
              onOpenChange(false);
              onAccepted?.();
            }}
          >
            {dictionary.shared.done}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
