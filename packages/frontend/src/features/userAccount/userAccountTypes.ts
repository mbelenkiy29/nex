// Mirrors the shape returned by `GET /api/user-account/me`. Kept in sync
// by hand with the backend controller — there's no shared types package.

export type EmailChannel =
  | 'auth'
  | 'transactional'
  | 'marketing'
  | 'digest'
  | 'productUpdates';

export interface UserAccountMe {
  id: string;
  deletionRequestedAt: string | null;
  deletionScheduledFor: string | null;
  deletionConfirmedAt: string | null;
  emailUnsubscribedChannels: EmailChannel[];
  cookieConsent: {
    essential: true;
    analytics: boolean;
    marketing: boolean;
    acceptedAt: string;
  } | null;
  termsAcceptedVersion: string | null;
  privacyAcceptedVersion: string | null;
}

export interface DataExportRow {
  id: string;
  createdAt: string;
  completedAt: string | null;
  failedAt: string | null;
  status: 'queued' | 'completed' | 'failed';
}
