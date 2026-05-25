/**
 * Get the domain suffix by removing the subdomain from the current window location.
 *
 * @example
 * // If window.location.hostname is "subdomain.example.com"
 * getDomainSuffix() // Returns "example.com"
 *
 * // If window.location.hostname is "example.com"
 * getDomainSuffix() // Returns "example.com"
 *
 * // If window.location.hostname is "localhost"
 * getDomainSuffix() // Returns "localhost"
 */
export function getDomainSuffix(): string {
  try {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');

    if (parts.length <= 1) {
      return hostname;
    }

    if (parts.length >= 3) {
      return parts.slice(1).join('.');
    }

    return hostname;
  } catch {
    return 'example.com';
  }
}
