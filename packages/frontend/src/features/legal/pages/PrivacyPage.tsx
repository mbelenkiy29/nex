import { useAuthStore } from '@/features/auth/authStore';
import { LegalShell } from '../components/LegalShell';

export function PrivacyPage() {
  const dictionary = useAuthStore((s) => s.dictionary);
  const privacy = dictionary.legal.privacy;
  return (
    <LegalShell
      title={privacy.title}
      lastUpdated={privacy.lastUpdated}
      version={privacy.version}
      body={privacy.body}
    />
  );
}
