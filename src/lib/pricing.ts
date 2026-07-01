/**
 * Pricing helpers for the booking flow.
 *
 * BOOKING_DISCOUNT documents the headline offer ("40% off, pay 60%"). Existing
 * display prices in the codebase are stored pre-multiplied (i.e., they already
 * have the discount baked in). New code generating from a "KQ original" base
 * price should use `applyDiscount(base)` rather than hand-multiplying, so the
 * single source of truth lives here.
 */

export const BOOKING_DISCOUNT = 0.6 // pay 60% (= 40% off)

/**
 * Apply the booking discount to a KQ-original base price.
 * Result is rounded to the nearest KES 100, matching the rest of the codebase.
 */
export function applyDiscount(originalKQBase: number): number {
  return Math.round((originalKQBase * BOOKING_DISCOUNT) / 100) * 100
}

/**
 * Get the price for a specific seat based on its ID and fare class.
 * Seat prices are pre-discounted (40% off KQ original).
 */
export function getSeatPrice(seatId: string, fareClass: string | null): number {
  if (fareClass === "business" || fareClass === "standard") return 0
  if (seatId.includes("A") || seatId.includes("F")) return 900 // Window
  if (seatId.includes("12") || seatId.includes("14")) return 1500 // Exit row
  return 600 // Standard
}
