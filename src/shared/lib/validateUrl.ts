/**
 * Validates if a URL is a safe redirect target.
 * Only allows relative URLs that start with '/' but not '//'
 * to prevent open redirect attacks.
 */
export function isValidRedirectUrl(url: string): boolean {
  if (!url) return false;

  // Must be a relative URL (start with /)
  if (!url.startsWith('/')) return false;

  // Must not be a protocol-relative URL (//) which can redirect to external sites
  if (url.startsWith('//')) return false;

  // Additional check: ensure it's not trying to use JavaScript protocol
  if (url.startsWith('javascript:')) return false;

  return true;
}
