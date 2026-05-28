import Stripe from 'stripe';
import { env } from '../../env';
import { AppContext } from '../../shared/controller/appContext';

export type CheckoutTrustPurchaseType =
  | 'subscription'
  | 'course'
  | 'courseBundle'
  | 'aiCreditPack'
  | 'oneOnOneSession';

type CheckoutTrustSessionOptions = Pick<
  Stripe.Checkout.SessionCreateParams,
  | 'adaptive_pricing'
  | 'automatic_tax'
  | 'billing_address_collection'
  | 'consent_collection'
  | 'custom_text'
  | 'locale'
>;

const purchaseSubmitTextKey: Record<
  CheckoutTrustPurchaseType,
  | 'subscriptionSubmit'
  | 'courseSubmit'
  | 'courseBundleSubmit'
  | 'aiCreditPackSubmit'
  | 'oneOnOneSessionSubmit'
> = {
  subscription: 'subscriptionSubmit',
  course: 'courseSubmit',
  courseBundle: 'courseBundleSubmit',
  aiCreditPack: 'aiCreditPackSubmit',
  oneOnOneSession: 'oneOnOneSessionSubmit',
};

export function checkoutTrustSessionOptions(
  context: AppContext,
  purchaseType: CheckoutTrustPurchaseType,
): CheckoutTrustSessionOptions {
  const t = context.dictionary.checkoutTrust.stripeCustomText;
  const options: CheckoutTrustSessionOptions = {
    billing_address_collection: 'auto',
    locale: 'auto',
    custom_text: {
      submit: {
        message: t[purchaseSubmitTextKey[purchaseType]],
      },
      after_submit: {
        message: t.afterSubmit,
      },
    },
  };

  if (env.STRIPE_CHECKOUT_AUTOMATIC_TAX_ENABLED) {
    options.automatic_tax = { enabled: true };
  }

  if (env.STRIPE_CHECKOUT_ADAPTIVE_PRICING_ENABLED) {
    options.adaptive_pricing = { enabled: true };
  }

  if (env.STRIPE_CHECKOUT_TERMS_ACCEPTANCE_REQUIRED) {
    options.consent_collection = { terms_of_service: 'required' };
  }

  return options;
}

export function checkoutTrustAnalyticsMetadata(
  purchaseType: CheckoutTrustPurchaseType,
) {
  return {
    stripeHostedCheckout: true,
    dynamicPaymentMethods: true,
    walletsAvailableWhenEligible: true,
    checkoutLocale: 'auto',
    billingAddressCollection: 'auto',
    automaticTaxEnabled: env.STRIPE_CHECKOUT_AUTOMATIC_TAX_ENABLED,
    adaptivePricingEnabled: env.STRIPE_CHECKOUT_ADAPTIVE_PRICING_ENABLED,
    termsAcceptanceRequired: env.STRIPE_CHECKOUT_TERMS_ACCEPTANCE_REQUIRED,
    noSurpriseFeesShown: true,
    localPaymentMethodsShown: true,
    renewalTermsShown: purchaseType === 'subscription',
    refundPolicyShown:
      purchaseType === 'course' ||
      purchaseType === 'courseBundle' ||
      purchaseType === 'oneOnOneSession',
  };
}
