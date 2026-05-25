import { useAuthStore } from '@/features/auth/authStore';
import { PageHeader } from '@/shared/components/PageHeader';
import { DeletionScheduledBanner } from '../components/DeletionScheduledBanner';
import { DataExportCard } from '../components/DataExportCard';
import { AccountDeleteCard } from '../components/AccountDeleteCard';
import { EmailPreferencesCard } from '../components/EmailPreferencesCard';
import { MobileLearningSettingsCard } from '../components/MobileLearningSettingsCard';

/**
 * Surfaces the three GDPR-grade compliance affordances for a signed-in
 * user: download your data, delete your account, manage non-essential
 * email channels. One primary CTA per card per DESIGN.md §2.
 */
export function PrivacyAndAccountPage() {
  const dictionary = useAuthStore((s) => s.dictionary);
  return (
    <div className="flex flex-1 flex-col p-6">
      <PageHeader items={[[dictionary.account.privacyTabLabel]]} />
      <div className="mx-auto mt-8 w-full max-w-3xl">
        <DeletionScheduledBanner />
        <div className="flex flex-col gap-6">
          <MobileLearningSettingsCard />
          <DataExportCard />
          <EmailPreferencesCard />
          <AccountDeleteCard />
        </div>
      </div>
    </div>
  );
}
