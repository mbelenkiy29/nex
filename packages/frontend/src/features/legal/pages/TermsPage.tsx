import { useAuthStore } from '@/features/auth/authStore';
import { LegalShell } from '../components/LegalShell';

export function TermsPage() {
  const dictionary = useAuthStore((s) => s.dictionary);
  const terms = dictionary.legal.terms;
  return (
    <LegalShell
      title={terms.title}
      lastUpdated={terms.lastUpdated}
      version={terms.version}
      body={terms.body}
    />
  );
}
