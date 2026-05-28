import Stripe from 'stripe';
import { STRIPE_API_VERSION } from './stripeApiVersion';
import {
  redisConnection,
  isRedisAvailable,
} from '../../shared/lib/redisConnection';
import { env } from '../../env';
import type { PricingPackageType } from '../pricing/pricingSchemas';

export interface SubscriptionPlan {
  stripePriceId: string;
  name: string;
  description: string | null;
  currency: string;
  unitAmount: number;
  interval: 'day' | 'week' | 'month' | 'year';
  intervalCount: number;
  marketingFeatures: Array<{ name: string }>;
  unitLabel: string | null;
  active: boolean;
  packageType: PricingPackageType;
  savingsPercent: number | null;
  recommended: boolean;
  comparisonGroup: string | null;
}

const REDIS_KEY = 'stripe:subscription:plans';
const CACHE_TTL = 300;

// Fetches all plans (active and inactive) from Stripe with Redis caching
// Plan is active only if both product AND price are active
// Frontend filters archived plans unless user has active subscription for that price
export async function fetchStripePlans(): Promise<SubscriptionPlan[]> {
  if (!env.STRIPE_SECRET_KEY) {
    return [];
  }

  if (await isRedisAvailable()) {
    try {
      const cached = await redisConnection.get(REDIS_KEY);
      if (cached) {
        return JSON.parse(cached) as SubscriptionPlan[];
      }
    } catch (error) {
      console.error('Redis cache read error:', error);
    }
  }

  const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: STRIPE_API_VERSION,
  });

  try {
    const prices = await stripe.prices.list({
      type: 'recurring',
      expand: ['data.product'],
      limit: 100,
    });

    const rawPlans = prices.data
      .filter((price) => price.product && typeof price.product === 'object')
      .map((price) => {
        const product = price.product as Stripe.Product;
        return {
          stripePriceId: price.id,
          name: product.name,
          description: product.description || null,
          currency: price.currency,
          unitAmount: price.unit_amount || 0,
          interval: price.recurring!.interval,
          intervalCount: price.recurring!.interval_count,
          marketingFeatures:
            product.marketing_features
              ?.filter((f) => f.name)
              .map((f) => ({ name: f.name! })) || [],
          unitLabel: product.unit_label || null,
          active: product.active && price.active,
        };
      });
    const monthlyByName = new Map(
      rawPlans
        .filter((plan) => plan.interval === 'month' && plan.intervalCount === 1)
        .map((plan) => [plan.name, plan]),
    );
    const plans: SubscriptionPlan[] = rawPlans.map((plan) => {
      const packageType: PricingPackageType =
        plan.interval === 'year'
          ? 'annual_subscription'
          : 'monthly_subscription';
      const monthly = monthlyByName.get(plan.name);
      const annualBaseline =
        monthly && plan.interval === 'year' ? monthly.unitAmount * 12 : null;
      const savingsPercent =
        annualBaseline && annualBaseline > plan.unitAmount
          ? Math.round(
              ((annualBaseline - plan.unitAmount) / annualBaseline) * 100,
            )
          : null;

      return {
        ...plan,
        packageType,
        savingsPercent,
        recommended: packageType === 'annual_subscription',
        comparisonGroup: 'subscription',
      };
    });

    if (await isRedisAvailable()) {
      try {
        await redisConnection.setex(
          REDIS_KEY,
          CACHE_TTL,
          JSON.stringify(plans),
        );
      } catch (error) {
        console.error('Redis cache write error:', error);
      }
    }

    return plans;
  } catch (error) {
    console.error('Error fetching Stripe plans:', error);
    return [];
  }
}

export async function invalidateStripePlansCache(): Promise<void> {
  if (await isRedisAvailable()) {
    try {
      await redisConnection.del(REDIS_KEY);
    } catch (error) {
      console.error('Redis cache invalidation error:', error);
    }
  }
}
