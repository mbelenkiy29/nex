export const ONE_ON_ONE_MIN_PRICE_CENTS = 50;
export const ONE_ON_ONE_MAX_PRICE_CENTS = 1_000_000;

export function parseOneOnOnePriceAmount(value: string): number | null {
  const normalized = value.trim();
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
    return null;
  }

  const [whole, fraction = ''] = normalized.split('.');
  return Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
}

export function formatOneOnOnePrice(
  priceCents: number | null | undefined,
  currency: string | null | undefined,
  locale: string,
): string {
  const normalizedCurrency = normalizeOneOnOneCurrency(currency);
  const amount = (priceCents ?? 0) / 100;

  try {
    return new Intl.NumberFormat(locale || undefined, {
      style: 'currency',
      currency: normalizedCurrency,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${normalizedCurrency}`;
  }
}

export function normalizeOneOnOneCurrency(
  currency: string | null | undefined,
): string {
  return (currency?.trim().toUpperCase() || 'USD').slice(0, 3);
}

export function isOneOnOneCurrencyValid(currency: string): boolean {
  return /^[A-Z]{3}$/.test(currency);
}
