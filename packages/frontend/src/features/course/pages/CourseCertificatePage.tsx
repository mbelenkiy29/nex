import { useQuery } from '@tanstack/react-query';
import { createLazyRoute, Link, useParams } from '@tanstack/react-router';
import { LuAward, LuPrinter, LuShieldCheck } from 'react-icons/lu';
import { CourseCertificate } from '@/features/course/courseTypes';
import { useAuthStore } from '@/features/auth/authStore';
import { PageHeader } from '@/shared/components/PageHeader';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { apiClient } from '@/shared/lib/apiClient';
import { formatDate } from '@project/backend/shared/lib/formatDate';

export const courseCertificateLazyRoute = createLazyRoute(
  '/course/$id/certificate',
)({ component: CourseCertificatePage });

export function CourseCertificatePage() {
  const dictionary = useAuthStore((state) => state.dictionary);
  const locale = useAuthStore((state) => state.locale);
  const { id } = useParams({ from: '/course/$id/certificate' });
  const certificateQuery = useQuery({
    queryKey: ['course', 'certificate', id],
    queryFn: async ({ signal }) =>
      apiClient.get(`api/course/${id}/certificate`, { signal }).json<{
        certificate: CourseCertificate;
      }>(),
  });
  const certificate = certificateQuery.data?.certificate;

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-7">
      <PageHeader
        items={[
          [dictionary.course.list.title, '/course'],
          [dictionary.course.certificate.title],
        ]}
      />

      {certificate && (
        <>
          <div className="flex justify-end gap-2 print:hidden">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => window.print()}
            >
              <LuPrinter className="size-4" />
              {dictionary.course.certificate.print}
            </Button>
          </div>

          <Card className="mx-auto w-full max-w-5xl overflow-hidden rounded-3xl border-white/70 bg-white shadow-[0_24px_72px_rgb(15_23_42/0.16)] dark:border-white/10 print:shadow-none">
            <CardContent className="relative grid min-h-[640px] place-items-center p-10 text-center">
              <div className="border-primary/20 absolute inset-6 rounded-3xl border-2" />
              <div className="relative z-10 max-w-3xl">
                <div className="bg-primary/10 text-primary mx-auto grid size-20 place-items-center rounded-3xl">
                  <LuAward className="size-10" />
                </div>
                <Badge className="mt-6 rounded-xl">
                  <LuShieldCheck className="size-3.5" />
                  {dictionary.course.certificate.verified}
                </Badge>
                <h1 className="mt-6 text-4xl font-extrabold tracking-normal">
                  {dictionary.course.certificate.title}
                </h1>
                <p className="text-muted-foreground mt-4 text-lg">
                  {dictionary.course.certificate.awardedTo}
                </p>
                <p className="mt-3 text-3xl font-extrabold">
                  {certificate.user?.name ||
                    dictionary.course.certificate.learner}
                </p>
                <p className="text-muted-foreground mt-5">
                  {dictionary.course.certificate.completedCourse}
                </p>
                <p className="mt-3 text-2xl font-extrabold">
                  {certificate.course?.title}
                </p>
                <div className="mt-8 grid gap-3 text-sm md:grid-cols-3">
                  <CertificateMeta
                    label={dictionary.course.certificate.issuedAt}
                    value={formatDate(certificate.issuedAt, dictionary)}
                  />
                  <CertificateMeta
                    label={dictionary.course.certificate.number}
                    value={certificate.certificateNumber}
                  />
                  <CertificateMeta
                    label={dictionary.course.certificate.verificationCode}
                    value={certificate.verificationCode}
                  />
                </div>
                <p className="text-muted-foreground mt-6 text-xs">
                  {dictionary.course.certificate.verifyHint.replace(
                    '{0}',
                    certificate.verificationCode,
                  )}
                </p>
                {certificate.course?.slug && (
                  <Button
                    nativeButton={false}
                    variant="outline"
                    className="mt-6 rounded-xl print:hidden"
                    render={
                      <Link
                        to="/course/$slug"
                        params={{ slug: certificate.course.slug }}
                      />
                    }
                  >
                    {dictionary.course.actions.viewCourse}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function CertificateMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-slate-50 p-4">
      <div className="text-muted-foreground text-xs font-semibold">{label}</div>
      <div className="mt-1 font-extrabold break-words">{value}</div>
    </div>
  );
}
