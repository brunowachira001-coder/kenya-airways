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
  { id: 1, origin: "NBO", destination: "MBA", originCity: "Nairobi", destinationCity: "Mombasa", country: "Kenya", region: "Africa", dateRange: "17 Jun 26 to 18 Jun 26", price: "KES 16,595", priceNumber: 16595, image: "/dest_mombasa.png", cabinClass: "Economy" },
  { id: 2, origin: "NBO", destination: "ZNZ", originCity: "Nairobi", destinationCity: "Zanzibar", country: "Tanzania", region: "Africa", dateRange: "17 Jun 26 to 21 Jun 26", price: "KES 47,135", priceNumber: 47135, image: "/hero_slide_2.png", cabinClass: "Economy" },
  { id: 3, origin: "NBO", destination: "DAR", originCity: "Nairobi", destinationCity: "Dar es Salaam", country: "Tanzania", region: "Africa", dateRange: "17 Jun 26 to 18 Jun 26", price: "KES 37,745", priceNumber: 37745, image: "/dest_daressalaam.png", cabinClass: "Economy" },
  { id: 4, origin: "NBO", destination: "JNB", originCity: "Nairobi", destinationCity: "Johannesburg", country: "South Africa", region: "Africa", dateRange: "17 Jun 26 to 24 Jun 26", price: "KES 64,960", priceNumber: 64960, image: "/hero_slide_4.png", cabinClass: "Economy" },
  { id: 5, origin: "NBO", destination: "CPT", originCity: "Nairobi", destinationCity: "Cape Town", country: "South Africa", region: "Africa", dateRange: "20 Jun 26 to 27 Jun 26", price: "KES 78,500", priceNumber: 78500, image: "/hero_slide_1.png", cabinClass: "Economy" },
  { id: 6, origin: "NBO", destination: "MRU", originCity: "Nairobi", destinationCity: "Mauritius", country: "Mauritius", region: "Africa", dateRange: "18 Jun 26 to 25 Jun 26", price: "KES 89,900", priceNumber: 89900, image: "/hero_slide_3.png", cabinClass: "Economy" },
  { id: 7, origin: "NBO", destination: "ADD", originCity: "Nairobi", destinationCity: "Addis Ababa", country: "Ethiopia", region: "Africa", dateRange: "17 Jun 26 to 19 Jun 26", price: "KES 32,400", priceNumber: 32400, image: "/hero_slide_2.png", cabinClass: "Economy" },
  { id: 8, origin: "NBO", destination: "LOS", originCity: "Nairobi", destinationCity: "Lagos", country: "Nigeria", region: "Africa", dateRange: "22 Jun 26 to 29 Jun 26", price: "KES 72,800", priceNumber: 72800, image: "/hero_slide_4.png", cabinClass: "Economy" },

  // Europe deals (5+)
  { id: 9, origin: "NBO", destination: "LHR", originCity: "Nairobi", destinationCity: "London", country: "United Kingdom", region: "Europe", dateRange: "12 Jun 26 to 19 Jun 26", price: "KES 99,925", priceNumber: 99925, image: "/hero_slide_1.png", cabinClass: "Economy" },
  { id: 10, origin: "NBO", destination: "CDG", originCity: "Nairobi", destinationCity: "Paris", country: "France", region: "Europe", dateRange: "15 Jun 26 to 22 Jun 26", price: "KES 105,400", priceNumber: 105400, image: "/hero_slide_2.png", cabinClass: "Economy" },
  { id: 11, origin: "NBO", destination: "AMS", originCity: "Nairobi", destinationCity: "Amsterdam", country: "Netherlands", region: "Europe", dateRange: "18 Jun 26 to 25 Jun 26", price: "KES 112,600", priceNumber: 112600, image: "/hero_slide_3.png", cabinClass: "Economy" },
  { id: 12, origin: "NBO", destination: "FRA", originCity: "Nairobi", destinationCity: "Frankfurt", country: "Germany", region: "Europe", dateRange: "20 Jun 26 to 28 Jun 26", price: "KES 108,900", priceNumber: 108900, image: "/hero_slide_4.png", cabinClass: "Economy" },
  { id: 13, origin: "NBO", destination: "FCO", originCity: "Nairobi", destinationCity: "Rome", country: "Italy", region: "Europe", dateRange: "22 Jun 26 to 30 Jun 26", price: "KES 115,200", priceNumber: 115200, image: "/hero_slide_1.png", cabinClass: "Economy" },

  // Asia deals (4+)
  { id: 14, origin: "NBO", destination: "DXB", originCity: "Nairobi", destinationCity: "Dubai", country: "UAE", region: "Asia", dateRange: "18 Jun 26 to 25 Jun 26", price: "KES 60,080", priceNumber: 60080, image: "/hero_slide_3.png", cabinClass: "Economy" },
  { id: 15, origin: "NBO", destination: "BOM", originCity: "Nairobi", destinationCity: "Mumbai", country: "India", region: "Asia", dateRange: "17 Jun 26 to 24 Jun 26", price: "KES 75,400", priceNumber: 75400, image: "/dest_mumbai.png", cabinClass: "Economy" },
  { id: 16, origin: "NBO", destination: "DEL", originCity: "Nairobi", destinationCity: "Delhi", country: "India", region: "Asia", dateRange: "19 Jun 26 to 26 Jun 26", price: "KES 78,900", priceNumber: 78900, image: "/hero_slide_2.png", cabinClass: "Economy" },
  { id: 17, origin: "NBO", destination: "BKK", originCity: "Nairobi", destinationCity: "Bangkok", country: "Thailand", region: "Asia", dateRange: "21 Jun 26 to 29 Jun 26", price: "KES 95,600", priceNumber: 95600, image: "/hero_slide_1.png", cabinClass: "Economy" },

  // Middle East deals (3+)
  { id: 18, origin: "NBO", destination: "AUH", originCity: "Nairobi", destinationCity: "Abu Dhabi", country: "UAE", region: "Middle East", dateRange: "17 Jun 26 to 24 Jun 26", price: "KES 58,200", priceNumber: 58200, image: "/hero_slide_2.png", cabinClass: "Economy" },
  { id: 19, origin: "NBO", destination: "DOH", originCity: "Nairobi", destinationCity: "Doha", country: "Qatar", region: "Middle East", dateRange: "18 Jun 26 to 25 Jun 26", price: "KES 62,800", priceNumber: 62800, image: "/hero_slide_3.png", cabinClass: "Economy" },
  { id: 20, origin: "NBO", destination: "JED", originCity: "Nairobi", destinationCity: "Jeddah", country: "Saudi Arabia", region: "Middle East", dateRange: "20 Jun 26 to 27 Jun 26", price: "KES 68,500", priceNumber: 68500, image: "/hero_slide_4.png", cabinClass: "Economy" },

  // America deals (2+)
  { id: 21, origin: "NBO", destination: "JFK", originCity: "Nairobi", destinationCity: "New York", country: "USA", region: "America", dateRange: "15 Jun 26 to 28 Jun 26", price: "KES 145,800", priceNumber: 145800, image: "/hero_slide_1.png", cabinClass: "Economy" },
  { id: 22, origin: "NBO", destination: "YYZ", originCity: "Nairobi", destinationCity: "Toronto", country: "Canada", region: "America", dateRange: "17 Jun 26 to 30 Jun 26", price: "KES 152,400", priceNumber: 152400, image: "/hero_slide_2.png", cabinClass: "Economy" },

  // Additional Africa deals for variety
  { id: 23, origin: "NBO", destination: "KIS", originCity: "Nairobi", destinationCity: "Kisumu", country: "Kenya", region: "Africa", dateRange: "17 Jun 26 to 24 Jun 26", price: "KES 17,510", priceNumber: 17510, image: "/dest_kisumu.png", cabinClass: "Economy" },
  { id: 24, origin: "NBO", destination: "EBB", originCity: "Nairobi", destinationCity: "Entebbe", country: "Uganda", region: "Africa", dateRange: "15 Jun 26 to 16 Jun 26", price: "KES 49,945", priceNumber: 49945, image: "/dest_entebbe.png", cabinClass: "Economy" },
  { id: 25, origin: "NBO", destination: "NBO", originCity: "Nairobi", destinationCity: "Nairobi", country: "Kenya", region: "Africa", dateRange: "17 Jun 26 to 23 Jun 26", price: "KES 12,800", priceNumber: 12800, image: "/hero_slide_1.png", cabinClass: "Economy" },

  // Business class deals
  { id: 26, origin: "NBO", destination: "LHR", originCity: "Nairobi", destinationCity: "London", country: "United Kingdom", region: "Europe", dateRange: "12 Jun 26 to 19 Jun 26", price: "KES 485,000", priceNumber: 485000, image: "/hero_slide_3.png", cabinClass: "Business" },
  { id: 27, origin: "NBO", destination: "JFK", originCity: "Nairobi", destinationCity: "New York", country: "USA", region: "America", dateRange: "15 Jun 26 to 28 Jun 26", price: "KES 520,000", priceNumber: 520000, image: "/hero_slide_4.png", cabinClass: "Business" },
  { id: 28, origin: "NBO", destination: "DXB", originCity: "Nairobi", destinationCity: "Dubai", country: "UAE", region: "Asia", dateRange: "18 Jun 26 to 25 Jun 26", price: "KES 185,000", priceNumber: 185000, image: "/hero_slide_1.png", cabinClass: "Business" },
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