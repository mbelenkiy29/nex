export type PricingPackageType =
  | 'monthly_subscription'
  | 'annual_subscription'
  | 'course_purchase'
  | 'course_bundle'
  | 'ai_credit_pack'
  | 'selected_lifetime_course_access';

export type PricingPackage = {
  id: string;
  packageType: PricingPackageType;
  name: string;
  description: string | null;
  priceCents: number;
  currency: string;
  billingInterval: 'one_time' | 'month' | 'year' | 'day' | 'week';
  stripePriceId: string | null;
  courseId: string | null;
  bundleId: string | null;
  aiCreditPackId: string | null;
  tokenAmount: number | null;
  savingsPercent: number | null;
  recommended: boolean;
  comparisonGroup: string | null;
  benefits: string[];
  pricingExperimentId: string | null;
  pricingVariantId: string | null;
  variantName: string | null;
};

export type PricingPackagesResponse = {
  experiment: {
    id: string;
    key: string;
    name: string;
    surface: string;
  } | null;
  variant: {
    id: string;
    key: string;
    name: string;
    isControl: boolean;
  } | null;
  packages: PricingPackage[];
};
