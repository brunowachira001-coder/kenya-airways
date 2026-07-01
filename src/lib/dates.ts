import { addDays, format } from "date-fns"

/**
 * Format a deal's outbound + return day offsets as a short human-readable range.
 * e.g. `formatDealDateRange(3, 7)` → `"3 Jul to 7 Jul"` (when called on 2026-06-30)
 *
 * Negative offsets are clamped to 0 (today) so we never display past dates.
 * Pure function — deterministic given the same `today`.
 */
export function formatDealDateRange(
  outboundOffset: number,
  returnOffset: number,
  today: Date = new Date()
): string {
  const out = Math.max(0, Math.floor(outboundOffset))
  const ret = Math.max(out, Math.floor(returnOffset)) // never return before outbound
  return `${format(addDays(today, out), "d MMM")} to ${format(addDays(today, ret), "d MMM")}`
}
