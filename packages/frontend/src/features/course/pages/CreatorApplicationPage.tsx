import type { FileUploaded } from '@project/backend/features/file/fileSchemas';
import { storage } from '@project/backend/features/permissions';
import { dictionaryEnumerator } from '@project/backend/translation/dictionaryEnumerator';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createLazyRoute } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  LuBadgeCheck,
  LuBriefcaseBusiness,
  LuCheck,
  LuFileCheck2,
  LuGraduationCap,
  LuIdCard,
  LuLink,
  LuScanLine,
  LuSend,
  LuShieldCheck,
} from 'react-icons/lu';
import { toast } from 'sonner';
import { FilesUploadDropzone } from '@/features/file/components/FilesUploadDropzone';
import { useAuthStore, type Dictionary } from '@/features/auth/authStore';
import {
  payoutOnboardingAction,
  type PayoutOnboardingStatus,
} from '@/features/creatorApplication/creatorVerification';
import { PageHeader } from '@/shared/components/PageHeader';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { apiClient } from '@/shared/lib/apiClient';

export const creatorApplicationLazyRoute = createLazyRoute(
  '/creator-application',
)({
  component: CreatorApplicationPage,
});

type CreatorCertificationData = {
  title: string;
  issuer: string;
  issuedYear?: string | null;
  credentialUrl?: string | null;
  documents?: FileUploaded[];
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
  certifications?: CreatorCertificationData[] | null;
  payoutOnboardingStatus: PayoutOnboardingStatus;
  identityDocumentFiles?: FileUploaded[] | null;
  identityVerificationConsent: boolean;
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
};

export function CreatorApplicationPage() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    legalName: '',
    displayName: '',
    professionalTitle: '',
    bio: '',
    credentials: '',
    expertise: '',
    teachingExperience: '',
    audience: '',
    courseTopics: '',
    sampleLessonPlan: '',
    links: '',
    payoutContact: '',
    certifications: [] as CreatorCertificationData[],
    identityDocumentFiles: [] as FileUploaded[],
    identityVerificationConsent: false,
  });

  const applicationQuery = useQuery({
    queryKey: ['creatorApplication', 'me'],
    queryFn: async ({ signal }) =>
      apiClient
        .get('api/creator-application/me', { signal })
        .json<{ application: CreatorApplication | null }>(),
  });

  useEffect(() => {
    const application = applicationQuery.data?.application;
    if (application) {
      setForm({
        legalName: application.legalName || '',
        displayName: application.displayName,
        professionalTitle: application.professionalTitle || '',
        bio: application.bio,
        credentials: application.credentials,
        expertise: application.expertise,
        teachingExperience: application.teachingExperience || '',
        audience: application.audience || '',
        courseTopics: application.courseTopics.join('\n'),
        sampleLessonPlan: application.sampleLessonPlan || '',
        links: application.links.join('\n'),
        payoutContact: application.payoutContact || '',
        certifications: application.certifications || [],
        identityDocumentFiles: application.identityDocumentFiles || [],
        identityVerificationConsent: application.identityVerificationConsent,
      });
    }
  }, [applicationQuery.data?.application]);

  const application = applicationQuery.data?.application;
  const status = application?.status;
  const identityStatus = application?.identityStatus || 'notStarted';
  const identityScanStatus = application?.identityScanStatus || 'notStarted';
  const payoutOnboardingStatus: PayoutOnboardingStatus =
    application?.payoutOnboardingStatus || 'notStarted';
  const payoutAction = payoutOnboardingAction(
    payoutOnboardingStatus,
    Boolean(application),
  );

  const profileComplete = useMemo(
    () =>
      Boolean(
        form.legalName &&
          form.displayName &&
          form.bio &&
          form.credentials &&
          form.expertise &&
          form.teachingExperience &&
          form.audience &&
          form.sampleLessonPlan,
      ),
    [form],
  );

  const identityReady =
    form.identityDocumentFiles.length > 0 && form.identityVerificationConsent;

  const mutation = useMutation({
    mutationFn: () =>
      apiClient
        .post('api/creator-application', {
          json: {
            ...form,
            courseTopics: linesToArray(form.courseTopics),
            links: linesToArray(form.links),
            certifications: form.certifications
              .filter((item) => item.title.trim() && item.issuer.trim())
              .map((item) => ({
                title: item.title.trim(),
                issuer: item.issuer.trim(),
                issuedYear: item.issuedYear?.trim() || null,
                credentialUrl: item.credentialUrl?.trim() || null,
                documents: item.documents || [],
              })),
          },
        })
        .json(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['creatorApplication'] });
      toast.success(dictionary.creatorApplication.success.submitted);
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const scanMutation = useMutation({
    mutationFn: () =>
      apiClient.post('api/creator-application/identity-scan').json(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['creatorApplication'] });
      toast.success(dictionary.creatorApplication.success.identityScanStarted);
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  const payoutMutation = useMutation({
    mutationFn: (action: 'begin' | 'submit') =>
      apiClient
        .post('api/creator-application/payout-onboarding', { json: { action } })
        .json(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['creatorApplication'] });
      toast.success(
        dictionary.creatorApplication.success.payoutOnboardingUpdated,
      );
    },
    onError: (error: Error) =>
      toast.error(error.message || dictionary.shared.errors.unknown),
  });

  return (
    <div className="nex-dashboard-shell flex flex-col gap-6 px-4 py-6 lg:px-7">
      <PageHeader items={[[dictionary.creatorApplication.title]]} />

      <section className="nex-glass-card nex-gradient-hero overflow-hidden rounded-3xl p-6 lg:p-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <Badge className="bg-nexexam-accent text-nexexam-primary hover:bg-nexexam-accent rounded-xl">
              <LuGraduationCap className="size-3.5" />
              {dictionary.creatorApplication.menu}
            </Badge>
            <h1 className="text-nexexam-ink mt-4 max-w-3xl text-4xl leading-tight font-extrabold tracking-normal dark:text-white">
              {dictionary.creatorApplication.title}
            </h1>
            <p className="text-muted-foreground mt-3 max-w-2xl text-base leading-7">
              {dictionary.creatorApplication.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {status && (
                <StatusBadge
                  label={dictionary.creatorApplication.fields.status}
                  value={dictionaryEnumerator(
                    dictionary.creatorApplication.enumerators.status,
                    status,
                  )}
                />
              )}
              <StatusBadge
                label={dictionary.creatorApplication.fields.identityStatus}
                value={dictionaryEnumerator(
                  dictionary.creatorApplication.enumerators.identityStatus,
                  identityStatus,
                )}
              />
              <StatusBadge
                label={dictionary.creatorApplication.fields.identityScanStatus}
                value={dictionaryEnumerator(
                  dictionary.creatorApplication.enumerators.identityScanStatus,
                  identityScanStatus,
                )}
              />
            </div>
          </div>

          <Card className="nex-glass-card rounded-2xl border-white/70 bg-white/74 p-0 dark:border-white/10 dark:bg-white/8">
            <CardContent className="p-5">
              <h2 className="flex items-center gap-2 font-extrabold">
                <LuShieldCheck className="text-primary size-5" />
                {dictionary.creatorApplication.identity.title}
              </h2>
              <p className="text-muted-foreground mt-2 text-sm leading-6">
                {dictionary.creatorApplication.identity.description}
              </p>
              <div className="mt-5 grid gap-3">
                <ChecklistItem
                  complete={profileComplete}
                  label={dictionary.creatorApplication.identity.profileReady}
                />
                <ChecklistItem
                  complete={form.identityDocumentFiles.length > 0}
                  label={
                    dictionary.creatorApplication.identity.documentsUploaded
                  }
                />
                <ChecklistItem
                  complete={form.identityVerificationConsent}
                  label={dictionary.creatorApplication.identity.consentRecorded}
                />
                <ChecklistItem
                  complete={identityStatus === 'verified'}
                  label={dictionary.creatorApplication.identity.adminVerified}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {application?.adminNotes && (
        <Card className="border-nexexam-warning/30 bg-nexexam-warning/10 rounded-2xl">
          <CardContent className="p-4">
            <h2 className="text-sm font-extrabold">
              {dictionary.creatorApplication.fields.adminNotes}
            </h2>
            <p className="text-muted-foreground mt-2 text-sm whitespace-pre-wrap">
              {application.adminNotes}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="grid gap-5">
          <SectionCard
            icon={<LuBadgeCheck className="size-5" />}
            title={dictionary.creatorApplication.sections.profile}
            description={dictionary.creatorApplication.sections.profileBody}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label={dictionary.creatorApplication.fields.legalName}
                testId="creator-application-legal-name"
                value={form.legalName}
                onChange={(value) => setForm({ ...form, legalName: value })}
              />
              <Field
                label={dictionary.creatorApplication.fields.displayName}
                testId="creator-application-display-name"
                value={form.displayName}
                onChange={(value) =>
                  setForm({ ...form, displayName: value })
                }
              />
              <Field
                label={dictionary.creatorApplication.fields.professionalTitle}
                value={form.professionalTitle}
                onChange={(value) =>
                  setForm({ ...form, professionalTitle: value })
                }
              />
              <Field
                label={dictionary.creatorApplication.fields.expertise}
                testId="creator-application-expertise"
                value={form.expertise}
                onChange={(value) => setForm({ ...form, expertise: value })}
              />
              <TextField
                label={dictionary.creatorApplication.fields.bio}
                testId="creator-application-bio"
                value={form.bio}
                onChange={(value) => setForm({ ...form, bio: value })}
              />
              <TextField
                label={dictionary.creatorApplication.fields.audience}
                value={form.audience}
                onChange={(value) => setForm({ ...form, audience: value })}
              />
            </div>
          </SectionCard>

          <SectionCard
            icon={<LuBriefcaseBusiness className="size-5" />}
            title={dictionary.creatorApplication.sections.expertise}
            description={dictionary.creatorApplication.sections.expertiseBody}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label={dictionary.creatorApplication.fields.credentials}
                testId="creator-application-credentials"
                value={form.credentials}
                onChange={(value) =>
                  setForm({ ...form, credentials: value })
                }
              />
              <TextField
                label={dictionary.creatorApplication.fields.teachingExperience}
                value={form.teachingExperience}
                onChange={(value) =>
                  setForm({ ...form, teachingExperience: value })
                }
              />
              <TextField
                label={dictionary.creatorApplication.fields.courseTopics}
                value={form.courseTopics}
                onChange={(value) =>
                  setForm({ ...form, courseTopics: value })
                }
                hint={dictionary.creatorApplication.hints.onePerLine}
              />
              <TextField
                label={dictionary.creatorApplication.fields.links}
                value={form.links}
                onChange={(value) => setForm({ ...form, links: value })}
                icon={<LuLink className="size-4" />}
                hint={dictionary.creatorApplication.hints.onePerLine}
              />
              <div className="md:col-span-2">
                <TextField
                  label={dictionary.creatorApplication.fields.sampleLessonPlan}
                  value={form.sampleLessonPlan}
                  onChange={(value) =>
                    setForm({ ...form, sampleLessonPlan: value })
                  }
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard
            icon={<LuFileCheck2 className="size-5" />}
            title={dictionary.creatorApplication.sections.certifications}
            description={
              dictionary.creatorApplication.sections.certificationsBody
            }
          >
            <CertificationsEditor
              value={form.certifications}
              onChange={(certifications) =>
                setForm({ ...form, certifications })
              }
              dictionary={dictionary}
            />
          </SectionCard>

          <SectionCard
            icon={<LuIdCard className="size-5" />}
            title={dictionary.creatorApplication.sections.identity}
            description={dictionary.creatorApplication.sections.identityBody}
          >
            <div className="grid gap-5">
              <FilesUploadDropzone
                storage={storage.creatorIdentityDocuments}
                max={3}
                formats={['pdf', 'png', 'jpg', 'jpeg']}
                value={form.identityDocumentFiles}
                onChange={(value) =>
                  setForm({
                    ...form,
                    identityDocumentFiles: value || [],
                  })
                }
                testId="creator-application-identity-upload"
              />

              <label className="flex items-start gap-3 rounded-2xl border bg-white/70 p-4 text-sm dark:bg-white/8">
                <Checkbox
                  checked={form.identityVerificationConsent}
                  onCheckedChange={(checked) =>
                    setForm({
                      ...form,
                      identityVerificationConsent: Boolean(checked),
                    })
                  }
                  className="mt-0.5"
                />
                <span className="text-muted-foreground leading-6">
                  {dictionary.creatorApplication.identity.consent}
                </span>
              </label>
            </div>
          </SectionCard>
        </div>

        <aside className="grid content-start gap-5">
          <Card className="nex-glass-card rounded-3xl border-white/70 dark:border-white/10">
            <CardContent className="p-5">
              <h2 className="flex items-center gap-2 font-extrabold">
                <LuFileCheck2 className="text-primary size-5" />
                {dictionary.creatorApplication.sections.review}
              </h2>
              <p className="text-muted-foreground mt-2 text-sm leading-6">
                {dictionary.creatorApplication.sections.reviewBody}
              </p>
              <div className="mt-5 grid gap-3">
                {identityScanStatus !== 'notStarted' && (
                  <div className="rounded-2xl border bg-white/70 p-3 dark:bg-white/8">
                    <div className="text-xs font-bold">
                      {
                        dictionary.creatorApplication.fields
                          .identityScanStatus
                      }
                    </div>
                    <div className="text-muted-foreground mt-1 text-sm">
                      {dictionaryEnumerator(
                        dictionary.creatorApplication.enumerators
                          .identityScanStatus,
                        identityScanStatus,
                      )}
                    </div>
                    <div className="mt-3 grid gap-2">
                      {(application?.identityScanChecks || []).map((check) => (
                        <ChecklistItem
                          key={check}
                          complete={!check.includes('missing')}
                          label={dictionaryEnumerator(
                            dictionary.creatorApplication.enumerators
                              .identityScanChecks,
                            check,
                          )}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  data-testid="creator-application-submit-button"
                  className="h-11 rounded-xl"
                  disabled={mutation.isPending || !profileComplete}
                  onClick={() => mutation.mutate()}
                >
                  <LuSend className="size-4" />
                  {dictionary.creatorApplication.actions.submit}
                </Button>
                <Button
                  data-testid="creator-application-identity-scan-button"
                  variant="outline"
                  className="h-11 rounded-xl bg-white/70 dark:bg-white/8"
                  disabled={
                    scanMutation.isPending ||
                    mutation.isPending ||
                    !application ||
                    !identityReady
                  }
                  onClick={() => scanMutation.mutate()}
                >
                  <LuScanLine className="size-4" />
                  {dictionary.creatorApplication.actions.runIdentityScan}
                </Button>
              </div>
            </CardContent>
          </Card>

          <SectionCard
            icon={<LuShieldCheck className="size-5" />}
            title={dictionary.creatorApplication.sections.payout}
            description={dictionary.creatorApplication.sections.payoutBody}
          >
            <div className="grid gap-4">
              <TextField
                label={dictionary.creatorApplication.fields.payoutContact}
                value={form.payoutContact}
                onChange={(value) =>
                  setForm({ ...form, payoutContact: value })
                }
              />
              <div className="flex items-center justify-between gap-2 rounded-2xl border bg-white/70 px-3 py-2 dark:bg-white/8">
                <span className="text-muted-foreground text-xs font-semibold">
                  {dictionary.creatorApplication.fields.payoutOnboardingStatus}
                </span>
                <Badge variant="outline" className="rounded-xl">
                  {dictionaryEnumerator(
                    dictionary.creatorApplication.enumerators
                      .payoutOnboardingStatus,
                    payoutOnboardingStatus,
                  )}
                </Badge>
              </div>
              {payoutAction && (
                <Button
                  data-testid="creator-application-payout-onboarding-button"
                  variant="outline"
                  className="h-11 rounded-xl bg-white/70 dark:bg-white/8"
                  disabled={payoutMutation.isPending}
                  onClick={() => payoutMutation.mutate(payoutAction)}
                >
                  {payoutAction === 'begin'
                    ? dictionary.creatorApplication.actions
                        .beginPayoutOnboarding
                    : dictionary.creatorApplication.actions.submitPayoutDetails}
                </Button>
              )}
            </div>
          </SectionCard>
        </aside>
      </div>
    </div>
  );
}

function linesToArray(value: string) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

function StatusBadge({ label, value }: { label: string; value: string }) {
  return (
    <Badge variant="outline" className="rounded-xl bg-white/70 dark:bg-white/8">
      <span className="text-muted-foreground">{label}</span>
      <span>{value}</span>
    </Badge>
  );
}

function ChecklistItem({
  complete,
  label,
}: {
  complete: boolean;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span
        className={
          complete
            ? 'bg-nexexam-success text-white grid size-5 place-items-center rounded-full'
            : 'bg-nexexam-soft text-nexexam-muted grid size-5 place-items-center rounded-full'
        }
      >
        {complete && <LuCheck className="size-3.5" />}
      </span>
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}

function SectionCard({
  icon,
  title,
  description,
  children,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Card className="nex-glass-card rounded-3xl border-white/70 dark:border-white/10">
      <CardContent className="p-5 lg:p-6">
        <div className="flex items-start gap-3">
          <span className="bg-primary/10 text-primary grid size-11 place-items-center rounded-xl">
            {icon}
          </span>
          <div>
            <h2 className="text-lg font-extrabold tracking-normal">{title}</h2>
            <p className="text-muted-foreground mt-1 text-sm leading-6">
              {description}
            </p>
          </div>
        </div>
        <div className="mt-5">{children}</div>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  value,
  onChange,
  testId,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  testId?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold">{label}</span>
      <Input
        data-testid={testId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-xl bg-white/80 dark:bg-white/8"
      />
    </label>
  );
}

function TextField({
  label,
  value,
  onChange,
  icon,
  hint,
  testId,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon?: ReactNode;
  hint?: string;
  testId?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="flex items-center gap-2 text-sm font-semibold">
        {icon}
        {label}
      </span>
      <Textarea
        data-testid={testId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-32 rounded-xl bg-white/80 dark:bg-white/8"
      />
      {hint && <span className="text-muted-foreground text-xs">{hint}</span>}
    </label>
  );
}

function CertificationsEditor({
  value,
  onChange,
  dictionary,
}: {
  value: CreatorCertificationData[];
  onChange: (value: CreatorCertificationData[]) => void;
  dictionary: Dictionary;
}) {
  const fields = dictionary.creatorApplication.fields;
  const actions = dictionary.creatorApplication.actions;

  const update = (index: number, patch: Partial<CreatorCertificationData>) =>
    onChange(
      value.map((row, current) =>
        current === index ? { ...row, ...patch } : row,
      ),
    );

  return (
    <div className="grid gap-4">
      {value.length === 0 && (
        <p className="text-muted-foreground text-sm">
          {dictionary.creatorApplication.hints.certificationsEmpty}
        </p>
      )}

      {value.map((row, index) => (
        <div
          key={index}
          className="grid gap-3 rounded-2xl border bg-white/70 p-4 dark:bg-white/8"
        >
          <div className="grid gap-3 md:grid-cols-2">
            <Field
              label={fields.certificationTitle}
              value={row.title}
              onChange={(next) => update(index, { title: next })}
            />
            <Field
              label={fields.certificationIssuer}
              value={row.issuer}
              onChange={(next) => update(index, { issuer: next })}
            />
            <Field
              label={fields.certificationYear}
              value={row.issuedYear || ''}
              onChange={(next) => update(index, { issuedYear: next })}
            />
            <Field
              label={fields.certificationUrl}
              value={row.credentialUrl || ''}
              onChange={(next) => update(index, { credentialUrl: next })}
            />
          </div>
          <div className="grid gap-2">
            <span className="text-sm font-semibold">
              {fields.certificationDocuments}
            </span>
            <FilesUploadDropzone
              storage={storage.creatorIdentityDocuments}
              max={2}
              formats={['pdf', 'png', 'jpg', 'jpeg']}
              value={row.documents || []}
              onChange={(files) =>
                update(index, { documents: files || [] })
              }
            />
          </div>
          <Button
            variant="outline"
            className="h-9 justify-self-start rounded-xl bg-white/70 dark:bg-white/8"
            onClick={() =>
              onChange(value.filter((_, current) => current !== index))
            }
          >
            {actions.removeCertification}
          </Button>
        </div>
      ))}

      <Button
        data-testid="creator-application-add-certification"
        variant="outline"
        className="h-10 justify-self-start rounded-xl bg-white/70 dark:bg-white/8"
        onClick={() =>
          onChange([
            ...value,
            {
              title: '',
              issuer: '',
              issuedYear: '',
              credentialUrl: '',
              documents: [],
            },
          ])
        }
      >
        {actions.addCertification}
      </Button>
    </div>
  );
}
