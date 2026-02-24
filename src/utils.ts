// FindMyCow — Utility helpers

/** Generate a simple unique ID (sufficient for client-side use). */
export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Return the current time as an ISO 8601 string. */
export function nowISO(): string {
  return new Date().toISOString();
}

/** Format an ISO 8601 date string into a readable locale date. */
export function formatDate(isoString: string): string {
  if (!isoString) return '';
  try {
    return new Date(isoString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return isoString;
  }
}
