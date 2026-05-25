# Authentication & Authorization Reference

Multi-tenant authentication using Better Auth with RBAC, supporting sessions, API keys, and MCP.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend                                  │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │ authStore   │──│ authClient   │──│ authGuardFrontend     │  │
│  │ (Zustand)   │  │ (Better Auth)│  │ (route protection)    │  │
│  └─────────────┘  └──────────────┘  └───────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Backend                                   │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────────┐  │
│  │ authMiddleware │──│ authBackend    │──│ authGuardBackend │  │
│  │ (session/key)  │  │ (Better Auth)  │  │ (RBAC check)     │  │
│  └────────────────┘  └────────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Backend Components

### authBackend.ts

Better Auth configuration with plugins:

- **Email/Password**: Sign up, sign in, email verification, password reset
- **Social Providers**: Google (configurable via env)
- **Organization Plugin**: Multi-tenancy with roles, invitations, member management
- **API Key Plugin**: Programmatic access with rate limiting and expiration
- **MCP Plugin**: Claude Code/Desktop integration via OAuth2

```typescript
import { authBackend } from './authBackend';

// Verify session
const session = await authBackend.api.getSession({ headers });

// Get active member in organization
const member = await authBackend.api.getActiveMember({ headers });

// Verify API key
const result = await authBackend.api.verifyApiKey({
  body: { key: apiKeyHeader },
  headers,
});

// Create organization
const org = await authBackend.api.createOrganization({
  body: { name, slug },
  headers,
});
```

### authMiddleware.ts

Three authentication modes:

1. **Session Auth** (`authMiddlewareForSession`): Cookie-based sessions for web UI
2. **API Key Auth** (`authMiddlewareForApiKey`): Header-based for programmatic access
3. **MCP Auth** (`authMiddlewareForMcp`): JWT-based for AI assistant integration

```typescript
// Session auth populates context with:
context.currentUser; // User record
context.currentMember; // Member in active organization
context.currentOrganization;
context.currentSubscription;
```

### authGuardBackend.ts

Multi-layer authorization check:

1. User must be authenticated
2. Must belong to an organization
3. Member must not be disabled
4. API key permissions (if applicable)
5. Role-based permission check
6. Server-side session validation

```typescript
import { authGuardBackend } from './authGuardBackend';

// In controller
await authGuardBackend({ category: ['create'] }, context);
```

## Frontend Components

### authStore.ts

Zustand store managing auth state:

```typescript
import { useAuthStore } from '@/features/auth/authStore';

const {
  currentUser,
  currentMember,
  currentOrganization,
  hasPermission,
  signOut,
  setActiveOrganization,
} = useAuthStore();

// Check permission
if (hasPermission({ category: ['update'] })) {
  // User can update categories
}
```

### authGuardFrontend.ts

Route protection for TanStack Router:

```typescript
import { authGuardFrontend } from './authGuardFrontend';

// In route beforeLoad
beforeLoad: ({ location }) => {
  const { currentUser, currentMember } = useAuthStore.getState();
  authGuardFrontend(
    { currentUser, currentMember },
    { category: ['read'] }, // Required permissions
    location.pathname,
  );
};
```

Redirects:

- No user → `/auth/sign-in`
- No member → `/auth/organization` or `/auth/no-permissions`
- Disabled → `/auth/no-permissions`
- No profile → `/auth/profile-onboard`
- No permission → `/auth/no-permissions`

## Permissions (RBAC)

### Defining Permissions

In `features/permissions.ts`:

```typescript
export const accessControlStatement = {
  category: ['create', 'read', 'update', 'delete', 'import', 'autocomplete'],
  // Add new entities here
} as const;

const admin = accessControl.newRole({
  category: ['create', 'read', 'update', 'delete', 'import', 'autocomplete'],
});

const member = accessControl.newRole({
  category: ['read', 'autocomplete'],
});
```

### Using Permissions

Backend:

```typescript
await authGuardBackend({ category: ['create'] }, context);
```

Frontend:

```typescript
const canCreate = useAuthStore
  .getState()
  .hasPermission({ category: ['create'] });
```

## Auth Flows

### Sign Up

1. User submits email/password (with ReCAPTCHA if enabled)
2. Verification email sent
3. User verifies email
4. Auto-create organization (single-tenant) or redirect to org selection (multi-tenant)
5. Profile onboarding (first/last name)

### Sign In

1. Validate credentials
2. Create session with `activeOrganizationId` (auto-selected if single membership)
3. Frontend fetches user data and active subscriptions

### Organization Switching

```typescript
// Frontend
await useAuthStore.getState().setActiveOrganization(orgId);

// Backend
POST /api/organization/:id/set-active
```

### API Key Authentication

```typescript
// Create API key (scoped to organization)
const key = await authBackend.api.createApiKey({
  body: {
    name: 'My API Key',
    expiresIn: 30 * 24 * 60 * 60, // 30 days
    metadata: { organizationId },
  },
});

// Use in requests
headers: { 'x-api-key': 'key_...' }
```

## Caching

Auth data cached in Redis (when available):

- Member lookups: `auth:member:{userId}:{organizationId}`
- Subscription lookups: `auth:subscription:{mode}:{id}`

Invalidation via `authCache.ts`:

```typescript
await invalidateMember(userId, organizationId);
await invalidateOrganizationAndMembers(organizationId);
```

## Environment Variables

```bash
AUTH_SECRET=                    # Required: Session encryption
AUTH_BYPASS_EMAIL_VERIFICATION= # Skip email verification (dev only)

# Social providers (optional)
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

# ReCAPTCHA (optional)
RECAPTCHA_SECRET_KEY=
RECAPTCHA_SITE_KEY=
```
