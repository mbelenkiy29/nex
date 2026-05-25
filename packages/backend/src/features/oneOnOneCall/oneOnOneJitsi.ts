import { randomUUID } from 'node:crypto';

export interface JitsiRoom {
  roomName: string;
  url: string;
}

// Public Jitsi Meet instance — no API key, no account.
const JITSI_BASE_URL = 'https://meet.jit.si';

/**
 * Generates an unguessable Jitsi Meet room for a 1:1 session. The room name
 * carries a v4 UUID (122 bits of entropy), so the join URL itself is the
 * access control — it is only ever returned to the session's two participants
 * (and platform admins). Generated at confirmation time so abandoned bookings
 * never leave a dangling room.
 */
export function generateJitsiRoom(): JitsiRoom {
  const roomName = `nex-1on1-${randomUUID()}`;
  return {
    roomName,
    url: `${JITSI_BASE_URL}/${roomName}`,
  };
}
