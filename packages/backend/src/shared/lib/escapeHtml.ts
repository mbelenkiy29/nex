/**
 * HTML-escape user-supplied text before interpolating it into a string that
 * will be sent to the browser as HTML (e.g. a server-rendered `text/html`
 * response that has no React/template engine to do the escaping for you).
 *
 * Covers the canonical OWASP entities: `& < > " '`. That's enough for HTML
 * text-node + double-quoted attribute contexts, which is all we render
 * server-side today (the unsubscribe confirmation page). It is NOT safe for
 * script-tag, style-tag, URL, or unquoted-attribute contexts — for those,
 * use a context-aware library like DOMPurify.
 *
 * Extracted from `userAccountControllers.ts` in 2026-05-23's security pass
 * (audit finding #17) so other server-rendered HTML responses can reuse the
 * same impl instead of growing per-feature copies.
 */
export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      default:
        return '&#39;';
    }
  });
}
