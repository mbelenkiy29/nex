import { Context } from 'hono';
import { AppContext } from '../../shared/controller/appContext';
import {
  aiTrustGetPreferences,
  aiTrustUpdatePreferences,
} from './aiTrustService';

export async function aiTrustGetPreferencesController(
  context: AppContext,
  c: Context,
) {
  return c.json({ preferences: await aiTrustGetPreferences(context) });
}

export async function aiTrustUpdatePreferencesController(
  body: unknown,
  context: AppContext,
  c: Context,
) {
  return c.json({
    preferences: await aiTrustUpdatePreferences(body, context),
  });
}
