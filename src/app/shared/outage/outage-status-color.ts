export type OutageStatusTone =
  | 'detected'
  | 'confirmed'
  | 'dispatched'
  | 'restoring'
  | 'restored'
  | 'cancelled'
  | 'unknown';

/** Badge tone + CSS custom property consumed by `_status-badge.scss` / `:root` vars. */
export function outageStatusTone(status: unknown): OutageStatusTone {
  const n = typeof status === 'number' ? status : Number(status);
  if (!Number.isFinite(n)) {
    return 'unknown';
  }
  switch (n) {
    case 0:
      return 'detected';
    case 1:
      return 'confirmed';
    case 2:
      return 'dispatched';
    case 3:
      return 'restoring';
    case 4:
      return 'restored';
    case 5:
      return 'cancelled';
    default:
      return 'unknown';
  }
}
