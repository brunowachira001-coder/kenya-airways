import { generateDateRange } from './date-utils'

export type Deal = {
  id: number
  origin: string          // IATA code: "NBO", "MBA"
  destination: string     // IATA code: "LHR", "JNB"
  originCity: string
  destinationCity: string
  country: string
  region: "Africa" | "Europe" | "Asia" | "America" | "Middle East"
  dateRange: string       // Dynamic: "01 Jul 26 to 08 Jul 26" (always current)
  price: string           // "KES 99,925"
  priceNumber: number     // 99925 (for sorting/filtering)
  image: string           // "/hero_slide_X.png" or "/dest_xxx.png"
  cabinClass: "Economy" | "Business"
  startDaysFromNow: number // Days from today to start date
  durationDays: number     // Duration of the trip
  tripType: "one-way" | "round-trip"
}

// Base deal data without dynamic dates
// All deals are one-way — users can book a return flight separately if needed
const BASE_DEALS: Omit<Deal, 'dateRange'>[] = [
  // Africa deals (8+) - Short haul trips (1-7 days duration)
  // Prices reflect base economy fares from database (rounded for marketing)
  { id: 1, origin: "NBO", destination: "MBA", originCity: "Nairobi", destinationCity: "Mombasa", country: "Kenya", region: "Africa", price: "KES 2,500", priceNumber: 2500, image: "/mombasa.jpg", cabinClass: "Economy", startDaysFromNow: 3, durationDays: 1, tripType: "one-way" },
  { id: 2, origin: "NBO", destination: "ZNZ", originCity: "Nairobi", destinationCity: "Zanzibar", country: "Tanzania", region: "Africa", price: "KES 8,500", priceNumber: 8500, image: "/zanzibar.jpg", cabinClass: "Economy", startDaysFromNow: 5, durationDays: 4, tripType: "one-way" },
  { id: 3, origin: "NBO", destination: "DAR", originCity: "Nairobi", destinationCity: "Dar es Salaam", country: "Tanzania", region: "Africa", price: "KES 7,800", priceNumber: 7800, image: "/dar-es-salaam.jpg", cabinClass: "Economy", startDaysFromNow: 2, durationDays: 1, tripType: "one-way" },
  { id: 4, origin: "NBO", destination: "JNB", originCity: "Nairobi", destinationCity: "Johannesburg", country: "South Africa", region: "Africa", price: "KES 35,000", priceNumber: 35000, image: "/johannesburg.jpg", cabinClass: "Economy", startDaysFromNow: 7, durationDays: 7, tripType: "one-way" },
  { id: 5, origin: "NBO", destination: "CPT", originCity: "Nairobi", destinationCity: "Cape Town", country: "South Africa", region: "Africa", price: "KES 38,500", priceNumber: 38500, image: "/nairobi.jpg", cabinClass: "Economy", startDaysFromNow: 10, durationDays: 7, tripType: "one-way" },
  { id: 6, origin: "NBO", destination: "MRU", originCity: "Nairobi", destinationCity: "Mauritius", country: "Mauritius", region: "Africa", price: "KES 32,000", priceNumber: 32000, image: "/mauritius.jpg", cabinClass: "Economy", startDaysFromNow: 8, durationDays: 7, tripType: "one-way" },
  { id: 7, origin: "NBO", destination: "ADD", originCity: "Nairobi", destinationCity: "Addis Ababa", country: "Ethiopia", region: "Africa", price: "KES 12,500", priceNumber: 12500, image: "/addis-ababa.jpg", cabinClass: "Economy", startDaysFromNow: 4, durationDays: 2, tripType: "one-way" },
  { id: 8, origin: "NBO", destination: "LOS", originCity: "Nairobi", destinationCity: "Lagos", country: "Nigeria", region: "Africa", price: "KES 42,000", priceNumber: 42000, image: "/lagos.jpg", cabinClass: "Economy", startDaysFromNow: 12, durationDays: 7, tripType: "one-way" },

  // Europe deals (5+) - Long haul (7-13 days)
  // Prices reflect competitive economy fares for long-haul routes
  { id: 9, origin: "NBO", destination: "LHR", originCity: "Nairobi", destinationCity: "London", country: "United Kingdom", region: "Europe", price: "KES 48,000", priceNumber: 48000, image: "/london.jpg", cabinClass: "Economy", startDaysFromNow: 14, durationDays: 7, tripType: "one-way" },
  { id: 10, origin: "NBO", destination: "CDG", originCity: "Nairobi", destinationCity: "Paris", country: "France", region: "Europe", price: "KES 52,000", priceNumber: 52000, image: "/nairobi.jpg", cabinClass: "Economy", startDaysFromNow: 15, durationDays: 7, tripType: "one-way" },
  { id: 11, origin: "NBO", destination: "AMS", originCity: "Nairobi", destinationCity: "Amsterdam", country: "Netherlands", region: "Europe", price: "KES 54,000", priceNumber: 54000, image: "/nairobi.jpg", cabinClass: "Economy", startDaysFromNow: 18, durationDays: 7, tripType: "one-way" },
  { id: 12, origin: "NBO", destination: "FRA", originCity: "Nairobi", destinationCity: "Frankfurt", country: "Germany", region: "Europe", price: "KES 50,000", priceNumber: 50000, image: "/nairobi.jpg", cabinClass: "Economy", startDaysFromNow: 20, durationDays: 8, tripType: "one-way" },
  { id: 13, origin: "NBO", destination: "FCO", originCity: "Nairobi", destinationCity: "Rome", country: "Italy", region: "Europe", price: "KES 56,000", priceNumber: 56000, image: "/nairobi.jpg", cabinClass: "Economy", startDaysFromNow: 22, durationDays: 8, tripType: "one-way" },

  // Asia deals (4+) - Medium to long haul (5-8 days)
  { id: 14, origin: "NBO", destination: "DXB", originCity: "Nairobi", destinationCity: "Dubai", country: "UAE", region: "Asia", price: "KES 28,000", priceNumber: 28000, image: "/nairobi.jpg", cabinClass: "Economy", startDaysFromNow: 6, durationDays: 7, tripType: "one-way" },
  { id: 15, origin: "NBO", destination: "BOM", originCity: "Nairobi", destinationCity: "Mumbai", country: "India", region: "Asia", price: "KES 32,500", priceNumber: 32500, image: "/nairobi.jpg", cabinClass: "Economy", startDaysFromNow: 8, durationDays: 7, tripType: "one-way" },
  { id: 16, origin: "NBO", destination: "DEL", originCity: "Nairobi", destinationCity: "Delhi", country: "India", region: "Asia", price: "KES 34,000", priceNumber: 34000, image: "/nairobi.jpg", cabinClass: "Economy", startDaysFromNow: 9, durationDays: 7, tripType: "one-way" },
  { id: 17, origin: "NBO", destination: "BKK", originCity: "Nairobi", destinationCity: "Bangkok", country: "Thailand", region: "Asia", price: "KES 42,500", priceNumber: 42500, image: "/nairobi.jpg", cabinClass: "Economy", startDaysFromNow: 11, durationDays: 8, tripType: "one-way" },

  // Middle East deals (3+) - Short to medium haul (4-7 days)
  { id: 18, origin: "NBO", destination: "AUH", originCity: "Nairobi", destinationCity: "Abu Dhabi", country: "UAE", region: "Middle East", price: "KES 26,500", priceNumber: 26500, image: "/nairobi.jpg", cabinClass: "Economy", startDaysFromNow: 5, durationDays: 7, tripType: "one-way" },
  { id: 19, origin: "NBO", destination: "DOH", originCity: "Nairobi", destinationCity: "Doha", country: "Qatar", region: "Middle East", price: "KES 29,000", priceNumber: 29000, image: "/nairobi.jpg", cabinClass: "Economy", startDaysFromNow: 7, durationDays: 7, tripType: "one-way" },
  { id: 20, origin: "NBO", destination: "JED", originCity: "Nairobi", destinationCity: "Jeddah", country: "Saudi Arabia", region: "Middle East", price: "KES 30,500", priceNumber: 30500, image: "/nairobi.jpg", cabinClass: "Economy", startDaysFromNow: 10, durationDays: 7, tripType: "one-way" },

  // America deals (2+) - Very long haul (10-13 days)
  { id: 21, origin: "NBO", destination: "JFK", originCity: "Nairobi", destinationCity: "New York", country: "USA", region: "America", price: "KES 65,000", priceNumber: 65000, image: "/nairobi.jpg", cabinClass: "Economy", startDaysFromNow: 21, durationDays: 13, tripType: "one-way" },
  { id: 22, origin: "NBO", destination: "YYZ", originCity: "Nairobi", destinationCity: "Toronto", country: "Canada", region: "America", price: "KES 68,000", priceNumber: 68000, image: "/nairobi.jpg", cabinClass: "Economy", startDaysFromNow: 23, durationDays: 13, tripType: "one-way" },

  // Additional Africa deals for variety
  { id: 23, origin: "NBO", destination: "KIS", originCity: "Nairobi", destinationCity: "Kisumu", country: "Kenya", region: "Africa", price: "KES 4,200", priceNumber: 4200, image: "/nairobi.jpg", cabinClass: "Economy", startDaysFromNow: 3, durationDays: 7, tripType: "one-way" },
  { id: 24, origin: "NBO", destination: "EBB", originCity: "Nairobi", destinationCity: "Entebbe", country: "Uganda", region: "Africa", price: "KES 9,500", priceNumber: 9500, image: "/entebbe.jpg", cabinClass: "Economy", startDaysFromNow: 4, durationDays: 1, tripType: "one-way" },

  // Business class deals (approximately 2.5x economy base prices)
  { id: 26, origin: "NBO", destination: "LHR", originCity: "Nairobi", destinationCity: "London", country: "United Kingdom", region: "Europe", price: "KES 120,000", priceNumber: 120000, image: "/london.jpg", cabinClass: "Business", startDaysFromNow: 14, durationDays: 7, tripType: "one-way" },
  { id: 27, origin: "NBO", destination: "JFK", originCity: "Nairobi", destinationCity: "New York", country: "USA", region: "America", price: "KES 162,500", priceNumber: 162500, image: "/nairobi.jpg", cabinClass: "Business", startDaysFromNow: 21, durationDays: 13, tripType: "one-way" },
  { id: 28, origin: "NBO", destination: "DXB", originCity: "Nairobi", destinationCity: "Dubai", country: "UAE", region: "Asia", price: "KES 70,000", priceNumber: 70000, image: "/nairobi.jpg", cabinClass: "Business", startDaysFromNow: 6, durationDays: 7, tripType: "one-way" },
]

/**
 * Generate deals with dynamic dates
 * This function is called to create the DEALS array with current dates
 */
function generateDealsWithDynamicDates(): Deal[] {
  return BASE_DEALS.map(deal => ({
    ...deal,
    dateRange: generateDateRange(deal.startDaysFromNow, deal.durationDays)
  }))
}

/**
 * Get deals with dynamically generated dates (always fresh)
 * Use this instead of the static DEALS constant for up-to-date date ranges
 */
export function getDeals(): Deal[] {
  return generateDealsWithDynamicDates()
}

// Static snapshot for backwards compatibility (dates frozen at import time)
export const DEALS: Deal[] = generateDealsWithDynamicDates()

/**
 * Refresh deals with current dates
 * Call this function to regenerate deals with updated dates
 */
export function refreshDeals(): Deal[] {
  return generateDealsWithDynamicDates()
}

/**
 * Get deals filtered by region (with fresh dates)
 * @param region - Optional region filter ("Africa" | "Europe" | "Asia" | "America" | "Middle East")
 * @returns Filtered deals array
 */
export function getDealsByRegion(region?: string): Deal[] {
  const deals = getDeals()
  if (!region || region === "All") {
    return deals
  }
  return deals.filter(deal => deal.region === region)
}

/**
 * Get deals by origin city (with fresh dates)
 * @param originCity - The origin city name (e.g., "Nairobi", "Mombasa", "Kisumu")
 * @returns Filtered deals array
 */
export function getDealsByOrigin(originCity: string): Deal[] {
  return getDeals().filter(deal => deal.originCity === originCity)
}

/**
 * Format price for display
 * @param price - Price number
 * @returns Formatted price string
 */
export function formatPrice(price: number): string {
  return `KES ${price.toLocaleString()}`
}
