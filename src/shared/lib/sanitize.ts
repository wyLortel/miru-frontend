import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks.
 * Removes malicious scripts while preserving safe formatting.
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p',
      'br',
      'strong',
      'em',
      'u',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'ul',
      'ol',
      'li',
      'blockquote',
      'code',
      'pre',
      'a',
      'img',
      'span',
      'div',
      'table',
      'tr',
      'td',
      'th',
      'thead',
      'tbody',
    ],
    ALLOWED_ATTR: ['href', 'title', 'alt', 'src', 'class', 'style'],
    ALLOW_DATA_ATTR: false,
  });
}
