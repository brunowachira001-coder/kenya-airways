export type Deal = {
  id: number
  origin: string          // IATA code: "NBO", "MBA"
  destination: string     // IATA code: "LHR", "JNB"
  originCity: string
  destinationCity: string
  country: string
  region: "Africa" | "Europe" | "Asia" | "America" | "Middle East"
  dateRange: string       // "17 Jun 26 to 18 Jun 26"
  price: string           // "KES 99,925"
  priceNumber: number     // 99925 (for sorting/filtering)
  image: string           // "/hero_slide_X.png" or "/dest_xxx.png"
  cabinClass: "Economy" | "Business"
}

export const DEALS: Deal[] = [
  // Africa deals (8+)
  { id: 1, origin: "NBO", destination: "MBA", originCity: "Nairobi", destinationCity: "Mombasa", country: "Kenya", region: "Africa", dateRange: "17 Jun 26 to 18 Jun 26", price: "KES 8,300", priceNumber: 8300, image: "/dest_mombasa.png", cabinClass: "Economy" },
  { id: 2, origin: "NBO", destination: "ZNZ", originCity: "Nairobi", destinationCity: "Zanzibar", country: "Tanzania", region: "Africa", dateRange: "17 Jun 26 to 21 Jun 26", price: "KES 23,600", priceNumber: 23600, image: "/hero_slide_2.png", cabinClass: "Economy" },
  { id: 3, origin: "NBO", destination: "DAR", originCity: "Nairobi", destinationCity: "Dar es Salaam", country: "Tanzania", region: "Africa", dateRange: "17 Jun 26 to 18 Jun 26", price: "KES 18,800", priceNumber: 18800, image: "/dest_daressalaam.png", cabinClass: "Economy" },
  { id: 4, origin: "NBO", destination: "JNB", originCity: "Nairobi", destinationCity: "Johannesburg", country: "South Africa", region: "Africa", dateRange: "17 Jun 26 to 24 Jun 26", price: "KES 32,500", priceNumber: 32500, image: "/hero_slide_4.png", cabinClass: "Economy" },
  { id: 5, origin: "NBO", destination: "CPT", originCity: "Nairobi", destinationCity: "Cape Town", country: "South Africa", region: "Africa", dateRange: "20 Jun 26 to 27 Jun 26", price: "KES 39,300", priceNumber: 39300, image: "/hero_slide_1.png", cabinClass: "Economy" },
  { id: 6, origin: "NBO", destination: "MRU", originCity: "Nairobi", destinationCity: "Mauritius", country: "Mauritius", region: "Africa", dateRange: "18 Jun 26 to 25 Jun 26", price: "KES 44,900", priceNumber: 44900, image: "/hero_slide_3.png", cabinClass: "Economy" },
  { id: 7, origin: "NBO", destination: "ADD", originCity: "Nairobi", destinationCity: "Addis Ababa", country: "Ethiopia", region: "Africa", dateRange: "17 Jun 26 to 19 Jun 26", price: "KES 16,200", priceNumber: 16200, image: "/hero_slide_2.png", cabinClass: "Economy" },
  { id: 8, origin: "NBO", destination: "LOS", originCity: "Nairobi", destinationCity: "Lagos", country: "Nigeria", region: "Africa", dateRange: "22 Jun 26 to 29 Jun 26", price: "KES 36,400", priceNumber: 36400, image: "/hero_slide_4.png", cabinClass: "Economy" },

  // Europe deals (5+)
  { id: 9, origin: "NBO", destination: "LHR", originCity: "Nairobi", destinationCity: "London", country: "United Kingdom", region: "Europe", dateRange: "12 Jun 26 to 19 Jun 26", price: "KES 50,000", priceNumber: 50000, image: "/hero_slide_1.png", cabinClass: "Economy" },
  { id: 10, origin: "NBO", destination: "CDG", originCity: "Nairobi", destinationCity: "Paris", country: "France", region: "Europe", dateRange: "15 Jun 26 to 22 Jun 26", price: "KES 52,700", priceNumber: 52700, image: "/hero_slide_2.png", cabinClass: "Economy" },
  { id: 11, origin: "NBO", destination: "AMS", originCity: "Nairobi", destinationCity: "Amsterdam", country: "Netherlands", region: "Europe", dateRange: "18 Jun 26 to 25 Jun 26", price: "KES 56,300", priceNumber: 56300, image: "/hero_slide_3.png", cabinClass: "Economy" },
  { id: 12, origin: "NBO", destination: "FRA", originCity: "Nairobi", destinationCity: "Frankfurt", country: "Germany", region: "Europe", dateRange: "20 Jun 26 to 28 Jun 26", price: "KES 54,400", priceNumber: 54400, image: "/hero_slide_4.png", cabinClass: "Economy" },
  { id: 13, origin: "NBO", destination: "FCO", originCity: "Nairobi", destinationCity: "Rome", country: "Italy", region: "Europe", dateRange: "22 Jun 26 to 30 Jun 26", price: "KES 57,600", priceNumber: 57600, image: "/hero_slide_1.png", cabinClass: "Economy" },

  // Asia deals (4+)
  { id: 14, origin: "NBO", destination: "DXB", originCity: "Nairobi", destinationCity: "Dubai", country: "UAE", region: "Asia", dateRange: "18 Jun 26 to 25 Jun 26", price: "KES 30,000", priceNumber: 30000, image: "/hero_slide_3.png", cabinClass: "Economy" },
  { id: 15, origin: "NBO", destination: "BOM", originCity: "Nairobi", destinationCity: "Mumbai", country: "India", region: "Asia", dateRange: "17 Jun 26 to 24 Jun 26", price: "KES 37,700", priceNumber: 37700, image: "/dest_mumbai.png", cabinClass: "Economy" },
  { id: 16, origin: "NBO", destination: "DEL", originCity: "Nairobi", destinationCity: "Delhi", country: "India", region: "Asia", dateRange: "19 Jun 26 to 26 Jun 26", price: "KES 39,400", priceNumber: 39400, image: "/hero_slide_2.png", cabinClass: "Economy" },
  { id: 17, origin: "NBO", destination: "BKK", originCity: "Nairobi", destinationCity: "Bangkok", country: "Thailand", region: "Asia", dateRange: "21 Jun 26 to 29 Jun 26", price: "KES 47,800", priceNumber: 47800, image: "/hero_slide_1.png", cabinClass: "Economy" },

  // Middle East deals (3+)
  { id: 18, origin: "NBO", destination: "AUH", originCity: "Nairobi", destinationCity: "Abu Dhabi", country: "UAE", region: "Middle East", dateRange: "17 Jun 26 to 24 Jun 26", price: "KES 29,100", priceNumber: 29100, image: "/hero_slide_2.png", cabinClass: "Economy" },
  { id: 19, origin: "NBO", destination: "DOH", originCity: "Nairobi", destinationCity: "Doha", country: "Qatar", region: "Middle East", dateRange: "18 Jun 26 to 25 Jun 26", price: "KES 31,400", priceNumber: 31400, image: "/hero_slide_3.png", cabinClass: "Economy" },
  { id: 20, origin: "NBO", destination: "JED", originCity: "Nairobi", destinationCity: "Jeddah", country: "Saudi Arabia", region: "Middle East", dateRange: "20 Jun 26 to 27 Jun 26", price: "KES 34,300", priceNumber: 34300, image: "/hero_slide_4.png", cabinClass: "Economy" },

  // America deals (2+)
  { id: 21, origin: "NBO", destination: "JFK", originCity: "Nairobi", destinationCity: "New York", country: "USA", region: "America", dateRange: "15 Jun 26 to 28 Jun 26", price: "KES 72,900", priceNumber: 72900, image: "/hero_slide_1.png", cabinClass: "Economy" },
  { id: 22, origin: "NBO", destination: "YYZ", originCity: "Nairobi", destinationCity: "Toronto", country: "Canada", region: "America", dateRange: "17 Jun 26 to 30 Jun 26", price: "KES 76,200", priceNumber: 76200, image: "/hero_slide_2.png", cabinClass: "Economy" },

  // Additional Africa deals for variety
  { id: 23, origin: "NBO", destination: "KIS", originCity: "Nairobi", destinationCity: "Kisumu", country: "Kenya", region: "Africa", dateRange: "17 Jun 26 to 24 Jun 26", price: "KES 8,800", priceNumber: 8800, image: "/dest_kisumu.png", cabinClass: "Economy" },
  { id: 24, origin: "NBO", destination: "EBB", originCity: "Nairobi", destinationCity: "Entebbe", country: "Uganda", region: "Africa", dateRange: "15 Jun 26 to 16 Jun 26", price: "KES 25,000", priceNumber: 25000, image: "/dest_entebbe.png", cabinClass: "Economy" },
  { id: 25, origin: "NBO", destination: "NBO", originCity: "Nairobi", destinationCity: "Nairobi", country: "Kenya", region: "Africa", dateRange: "17 Jun 26 to 23 Jun 26", price: "KES 6,400", priceNumber: 6400, image: "/hero_slide_1.png", cabinClass: "Economy" },

  // Business class deals
  { id: 26, origin: "NBO", destination: "LHR", originCity: "Nairobi", destinationCity: "London", country: "United Kingdom", region: "Europe", dateRange: "12 Jun 26 to 19 Jun 26", price: "KES 242,500", priceNumber: 242500, image: "/hero_slide_3.png", cabinClass: "Business" },
  { id: 27, origin: "NBO", destination: "JFK", originCity: "Nairobi", destinationCity: "New York", country: "USA", region: "America", dateRange: "15 Jun 26 to 28 Jun 26", price: "KES 260,000", priceNumber: 260000, image: "/hero_slide_4.png", cabinClass: "Business" },
  { id: 28, origin: "NBO", destination: "DXB", originCity: "Nairobi", destinationCity: "Dubai", country: "UAE", region: "Asia", dateRange: "18 Jun 26 to 25 Jun 26", price: "KES 92,500", priceNumber: 92500, image: "/hero_slide_1.png", cabinClass: "Business" },
]

/**
 * Get deals filtered by region
 * @param region - Optional region filter ("Africa" | "Europe" | "Asia" | "America" | "Middle East")
 * @returns Filtered deals array
 */
export function getDealsByRegion(region?: string): Deal[] {
  if (!region || region === "All") {
    return DEALS
  }
  return DEALS.filter(deal => deal.region === region)
}

/**
 * Get deals by origin city
 * @param originCity - The origin city name (e.g., "Nairobi", "Mombasa", "Kisumu")
 * @returns Filtered deals array
 */
export function getDealsByOrigin(originCity: string): Deal[] {
  return DEALS.filter(deal => deal.originCity === originCity)
}

/**
 * Format price for display
 * @param price - Price number
 * @returns Formatted price string
 */
export function formatPrice(price: number): string {
  return `KES ${price.toLocaleString()}`
}