import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createLazyRoute, Link } from '@tanstack/react-router';
import type { FileUploaded } from '@project/backend/features/file/fileSchemas';
import {
  LuArrowLeft,
  LuBadgeCheck,
  LuFileCheck2,
  LuIdCard,
  LuSearch,
  LuShieldCheck,
} from 'react-icons/lu';
import { useState } from 'react';
import { toast } from 'sonner';
import { FilesList } from '@/features/file/components/FilesList';
import { useAuthStore } from '@/features/auth/authStore';
import { PageHeader } from '@/shared/components/PageHeader';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { apiClient } from '@/shared/lib/apiClient';
import { objectToQuery } from '@/shared/lib/objectToQuery';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';

export const platformCreatorApplicationsLazyRoute = createLazyRoute(
  '/admin/creator-applications',
)({
  component: PlatformCreatorApplicationsPage,
});

type CreatorCertificationData = {
  title: string;
  issuer: string;
  issuedYear?: string | null;
  credentialUrl?: string | null;
  documents?: FileUploaded[];
};

type PayoutOnboardingStatus =
  | 'notStarted'
  | 'inProgress'
  | 'submitted'
  | 'actionRequired'
  | 'complete';

type CreatorVerificationEligibility = {
  applicationApproved: boolean;
  identityVerified: boolean;
  payoutComplete: boolean;
  eligible: boolean;
  nexVerified: boolean;
};

type CreatorApplication = {
  id: string;
  legalName?: string | null;
  displayName: string;
  professionalTitle?: string | null;
  bio: string;
  credentials: string;
  expertise: string;
  teachingExperience?: string | null;
  audience?: string | null;
  courseTopics: string[];
  sampleLessonPlan?: string | null;
  links: string[];
  payoutContact?: string | null;
  identityDocumentFiles?: FileUploaded[] | null;
  identityStatus:
    | 'notStarted'
    | 'needsDocuments'
    | 'readyForReview'
    | 'verified'
    | 'rejected';
  identityScanStatus: 'notStarted' | 'passed' | 'needsReview' | 'failed';
  identityScanChecks: string[];
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string | null;
  createdAt: string;
  certifications?: CreatorCertificationData[] | null;
  payoutOnboardingStatus: PayoutOnboardingStatus;
  nexVerified: boolean;
  eligibility: CreatorVerificationEligibility;
};

export function PlatformCreatorApplicationsPage() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [notes, setNotes] = useState<Record<string, string>>({});

  const applicationsQuery = useQuery({
    queryKey: ['platformAdmin', 'creatorApplications', search, status],
    queryFn: async ({ signal }) =>
      apiClient
        .get(
          `api/platform-admin/creator-applications?${objectToQuery({
            filter: {
              search: search || undefined,
              status: status === 'all' ? undefined : status,
            },
          })}`,
          { signal },
        )
        .json<{ count: number; applications: CreatorApplication[] }>(),
  });

  const reviewMutation = useMutation({
    mutationFn: ({
      application,
      nextStatus,
      identityStatus,
    }: {
      application: CreatorApplication;
      nextStatus: 'approved' | 'rejected';
      identityStatus?: CreatorApplication['identityStatus'];
    }) =>
      apiClient
        .patch(
          `api/platform-admin/creator-applications/${application.id}/status`,
          {
            json: {
              status: nextStatus,
              identityStatus,
              adminNotes: notes[application.id] || application.adminNotes || '',
            },
          },
        )
        .json(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['platformAdmin'] });
      toast.success(dictionary.creatorApplication.success.reviewed);
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const identityMutation = useMutation({
    mutationFn: ({
      application,
      identityStatus,
    }: {
      application: CreatorApplication;
      identityStatus: CreatorApplication['identityStatus'];
    }) =>
      apiClient
        .patch(
          `api/platform-admin/creator-applications/${application.id}/status`,
          {
            json: {
              status: application.status,
              identityStatus,
              adminNotes: notes[application.id] || application.adminNotes || '',
            },
          },
        )
        .json(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['platformAdmin'] });
      toast.success(dictionary.creatorApplication.success.identityReviewed);
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const payoutMutation = useMutation({
    mutationFn: ({
      application,
      payoutOnboardingStatus,
    }: {
      application: CreatorApplication;
      payoutOnboardingStatus: PayoutOnboardingStatus;
    }) =>
      apiClient
        .patch(
          `api/platform-admin/creator-applications/${application.id}/status`,
          {
            json: {
              status: application.status,
              payoutOnboardingStatus,
              adminNotes: notes[application.id] || application.adminNotes || '',
            },
          },
        )
        .json(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['platformAdmin'] });
      toast.success(
        dictionary.creatorApplication.success.payoutOnboardingUpdated,
      );
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const nexVerifiedMutation = useMutation({
    mutationFn: (application: CreatorApplication) =>
      apiClient
        .patch(
          `api/platform-admin/creator-applications/${application.id}/status`,
          {
            json: {
              status: application.status,
              nexVerified: true,
              adminNotes: notes[application.id] || application.adminNotes || '',
            },
          },
        )
        .json(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['platformAdmin'] });
      toast.success(dictionary.creatorApplication.success.reviewed);
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const applications = applicationsQuery.data?.applications || [];

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-7">
      <PageHeader
        items={[
          [dictionary.platformAdmin.title, '/admin'],
          [dictionary.creatorApplication.adminTitle],
        ]}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-normal">
            {dictionary.creatorApplication.adminTitle}
          </h1>
          <p className="text-muted-foreground mt-1">
            {dictionary.creatorApplication.adminDescription}
          </p>
        </div>
        <Button
          nativeButton={false}
          variant="outline"
          className="rounded-xl bg-white/70"
          render={<Link to="/admin" />}
        >
          <LuArrowLeft className="size-4" />
          {dictionary.platformAdmin.menu}
        </Button>
      </div>

      <Card className="nex-glass-card rounded-3xl border-white/70 dark:border-white/10">
        <CardContent className="grid gap-3 p-5 md:grid-cols-[minmax(0,1fr)_220px]">
          <label className="relative">
            <span className="sr-only">{dictionary.shared.search}</span>
            <LuSearch className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={dictionary.shared.searchPlaceholder}
              className="h-10 rounded-xl bg-white/80 pl-10 dark:bg-white/8"
            />
          </label>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="border-input h-10 rounded-xl border bg-white px-3 text-sm dark:bg-white/8"
          >
            <option value="all">{dictionary.shared.all}</option>
            {Object.entries(
              dictionary.creatorApplication.enumerators.status,
            ).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {applications.map((application) => (
          <Card
            data-testid="admin-creator-application-card"
            key={application.id}
            className="nex-glass-card rounded-3xl border-white/70 dark:border-white/10"
          >
            <CardContent className="grid gap-5 p-6 lg:grid-cols-[minmax(0,1fr)_360px]">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-nexexam-accent text-nexexam-primary hover:bg-nexexam-accent rounded-xl">
                    <LuBadgeCheck className="size-3.5" />
                    {dictionaryEnumerator(
                      dictionary.creatorApplication.enumerators.status,
                      application.status,
                    )}
                  </Badge>
                  <h2 className="text-xl font-extrabold">
                    {application.displayName}
                  </h2>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="outline" className="rounded-xl">
                    <LuIdCard className="size-3.5" />
                    {dictionaryEnumerator(
                      dictionary.creatorApplication.enumerators.identityStatus,
                      application.identityStatus,
                    )}
                  </Badge>
                  <Badge variant="outline" className="rounded-xl">
                    {dictionaryEnumerator(
                      dictionary.creatorApplication.enumerators
                        .identityScanStatus,
                      application.identityScanStatus,
                    )}
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-3 text-sm whitespace-pre-wrap">
                  {application.bio}
                </p>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <InfoBlock
                    label={dictionary.creatorApplication.fields.legalName}
                    value={application.legalName || ''}
                  />
                  <InfoBlock
                    label={
                      dictionary.creatorApplication.fields.professionalTitle
                    }
                    value={application.professionalTitle || ''}
                  />
                  <InfoBlock
                    label={dictionary.creatorApplication.fields.credentials}
                    value={application.credentials}
                  />
                  <InfoBlock
                    label={dictionary.creatorApplication.fields.expertise}
                    value={application.expertise}
                  />
                  <InfoBlock
                    label={dictionary.creatorApplication.fields.payoutContact}
                    value={application.payoutContact || ''}
                  />
                  <InfoBlock
                    label={
                      dictionary.creatorApplication.fields.teachingExperience
                    }
                    value={application.teachingExperience || ''}
                  />
                  <InfoBlock
                    label={dictionary.creatorApplication.fields.audience}
                    value={application.audience || ''}
                  />
                  <InfoBlock
                    label={dictionary.creatorApplication.fields.courseTopics}
                    value={application.courseTopics.join('\n')}
                  />
                  <InfoBlock
                    label={dictionary.creatorApplication.fields.links}
                    value={application.links.join('\n')}
                  />
                  <div className="md:col-span-2">
                    <InfoBlock
                      label={
                        dictionary.creatorApplication.fields.sampleLessonPlan
                      }
                      value={application.sampleLessonPlan || ''}
                    />
                  </div>
                </div>
                {(application.certifications?.length || 0) > 0 && (
                  <div className="mt-4 rounded-2xl border bg-white/70 p-4 dark:bg-white/8">
                    <div className="flex items-center gap-2 text-sm font-extrabold">
                      <LuFileCheck2 className="text-primary size-4" />
                      {dictionary.creatorApplication.sections.certifications}
                    </div>
                    <div className="mt-3 grid gap-3">
                      {application.certifications?.map(
                        (certification, index) => (
                          <div
                            key={index}
                            className="rounded-2xl border bg-white/72 p-3 dark:bg-white/6"
                          >
                            <div className="text-sm font-extrabold">
                              {certification.title}
                            </div>
                            <div className="text-muted-foreground text-xs">
                              {certification.issuer}
                              {certification.issuedYear
                                ? ` · ${certification.issuedYear}`
                                : ''}
                            </div>
                            {certification.credentialUrl && (
                              <a
                                href={certification.credentialUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-primary mt-1 inline-block text-xs underline"
                              >
                                {certification.credentialUrl}
                              </a>
                            )}
                            {(certification.documents?.length || 0) > 0 && (
                              <div className="mt-2">
                                <FilesList files={certification.documents} />
                              </div>
                            )}
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
                <div className="mt-4 rounded-2xl border bg-white/70 p-4 dark:bg-white/8">
                  <div className="flex items-center gap-2 text-sm font-extrabold">
                    <LuShieldCheck className="text-primary size-4" />
                    {dictionary.creatorApplication.identity.adminReviewTitle}
                  </div>
                  <div className="mt-3 grid gap-2 text-sm">
                    {(application.identityScanChecks || []).map((check) => (
                      <div
                        key={check}
                        className="text-muted-foreground flex items-center gap-2"
                      >
                        <span className="bg-primary/10 text-primary size-2 rounded-full" />
                        {dictionaryEnumerator(
                          dictionary.creatorApplication.enumerators
                            .identityScanChecks,
                          check,
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <FilesList files={application.identityDocumentFiles} />
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border bg-white/72 p-4 dark:bg-white/8">
                <label className="grid gap-2">
                  <span className="text-sm font-semibold">
                    {dictionary.creatorApplication.fields.adminNotes}
                  </span>
                  <Textarea
                    data-testid="admin-creator-application-notes-input"
                    value={
                      notes[application.id] ?? application.adminNotes ?? ''
                    }
                    onChange={(event) =>
                      setNotes((current) => ({
                        ...current,
                        [application.id]: event.target.value,
                      }))
                    }
                    className="min-h-32 rounded-xl bg-white/80 dark:bg-white/8"
                  />
                </label>
                <label className="mt-4 grid gap-2">
                  <span className="text-sm font-semibold">
                    {
                      dictionary.creatorApplication.fields
                        .payoutOnboardingStatus
                    }
                  </span>
                  <select
                    value={application.payoutOnboardingStatus}
                    disabled={payoutMutation.isPending}
                    onChange={(event) =>
                      payoutMutation.mutate({
                        application,
                        payoutOnboardingStatus: event.target
                          .value as PayoutOnboardingStatus,
                      })
                    }
                    className="border-input h-10 rounded-xl border bg-white px-3 text-sm dark:bg-white/8"
                  >
                    {Object.entries(
                      dictionary.creatorApplication.enumerators
                        .payoutOnboardingStatus,
                    ).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="mt-4 grid gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      data-testid="admin-creator-identity-verify-button"
                      variant="outline"
                      className="h-10 rounded-xl bg-white/70"
                      disabled={identityMutation.isPending}
                      onClick={() =>
                        identityMutation.mutate({
                          application,
                          identityStatus: 'verified',
                        })
                      }
                    >
                      <LuShieldCheck className="size-4" />
                      {dictionary.creatorApplication.actions.verifyIdentity}
                    </Button>
                    <Button
                      variant="outline"
                      className="h-10 rounded-xl bg-white/70"
                      disabled={identityMutation.isPending}
                      onClick={() =>
                        identityMutation.mutate({
                          application,
                          identityStatus: 'needsDocuments',
                        })
                      }
                    >
                      {dictionary.creatorApplication.actions.requestDocuments}
                    </Button>
                  </div>
                  <Button
                    data-testid="admin-creator-application-approve-button"
                    className="h-10 rounded-xl"
                    disabled={
                      reviewMutation.isPending ||
                      application.identityStatus !== 'verified'
                    }
                    onClick={() =>
                      reviewMutation.mutate({
                        application,
                        nextStatus: 'approved',
                        identityStatus: 'verified',
                      })
                    }
                  >
                    {dictionary.creatorApplication.actions.approve}
                  </Button>
                  <Button
                    data-testid="admin-creator-application-reject-button"
                    variant="outline"
                    className="h-10 rounded-xl bg-white/70"
                    disabled={reviewMutation.isPending}
                    onClick={() =>
                      reviewMutation.mutate({
                        application,
                        nextStatus: 'rejected',
                        identityStatus: 'rejected',
                      })
                    }
                  >
                    {dictionary.creatorApplication.actions.reject}
                  </Button>
                  <Button
                    data-testid="admin-creator-grant-nex-verified-button"
                    variant="outline"
                    className="h-10 rounded-xl bg-white/70"
                    disabled={
                      nexVerifiedMutation.isPending ||
                      application.nexVerified ||
                      !application.eligibility.eligible
                    }
                    onClick={() => nexVerifiedMutation.mutate(application)}
                  >
                    <LuBadgeCheck className="size-4" />
                    {application.nexVerified
                      ? dictionary.creatorApplication.verification
                          .nexVerifiedBadge
                      : dictionary.creatorApplication.actions.grantNexVerified}
                  </Button>
                  {application.identityStatus !== 'verified' && (
                    <p className="text-muted-foreground text-xs leading-5">
                      {
                        dictionary.creatorApplication.identity
                          .approvalRequiresIdentity
                      }
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-white/70 p-3 dark:bg-white/8">
      <div className="text-muted-foreground text-xs font-semibold">{label}</div>
      <div className="mt-1 text-sm whitespace-pre-wrap">{value || '-'}</div>
    </div>
  );
}
