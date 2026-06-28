export function getSeatPrice(seatId: string, fareClass: string | null): number {
  if (fareClass === "business" || fareClass === "standard") return 0
  if (seatId.includes("A") || seatId.includes("F")) return 900 // Window
  if (seatId.includes("12") || seatId.includes("14")) return 1500 // Exit row
  return 600 // Standard
}
