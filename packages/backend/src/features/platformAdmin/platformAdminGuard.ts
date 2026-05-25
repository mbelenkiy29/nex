import { env } from '../../env';
import { AppContext } from '../../shared/controller/appContext';
import { Error403 } from '../../shared/errors/Error403';

export function platformAdminIsUserAllowed(email?: string | null) {
  if (!email) {
    return false;
  }

  return env.PLATFORM_ADMIN_EMAILS.includes(email.toLowerCase());
}

export function authGuardPlatformAdminBackend(context: AppContext) {
  if (!context.currentUser) {
    throw new Error403();
  }

  if (!platformAdminIsUserAllowed(context.currentUser.email)) {
    throw new Error403();
  }

  return {
    currentUser: context.currentUser,
  };
}
