import { AIRPORTS, Airport } from "./airports"
import { applyDiscount } from "./pricing"
import type { Flight } from "./flights"
import type { Deal } from "./deals"

// ── Region map (single source of truth for "which airports are in which region") ──
// Derived from the country groupings in airports.ts. If you add an airport there,
// also add it here (TypeScript will warn via the AIRPORT_COVERAGE check below).
const REGION_BY_IATA: Record<string, "Africa" | "Europe" | "Asia" | "America" | "Middle East"> = {
  // Africa
  NBO: "Africa", MBA: "Africa", KIS: "Africa", EDL: "Africa", MYD: "Africa", KTL: "Africa", LAU: "Africa",
  DAR: "Africa", ZNZ: "Africa", JRO: "Africa", ARK: "Africa", DOD: "Africa", MWZ: "Africa",
  EBB: "Africa", KML: "Africa", KGL: "Africa", BJM: "Africa", JUB: "Africa",
  JNB: "Africa", CPT: "Africa", DUR: "Africa",
  ADD: "Africa", DIR: "Africa", CAI: "Africa", HRE: "Africa", LUN: "Africa", LLW: "Africa",
  MPM: "Africa", GBE: "Africa", SEZ: "Africa", MRU: "Africa", TNR: "Africa", HAH: "Africa",
  JIB: "Africa", MGQ: "Africa", FIH: "Africa", ABJ: "Africa", DKR: "Africa", ACC: "Africa",
  LOS: "Africa", ABV: "Africa", CMN: "Africa", TUN: "Africa",
  // Middle East
  DXB: "Middle East", AUH: "Middle East", JED: "Middle East", RUH: "Middle East", DOH: "Middle East",
  // Asia
  BOM: "Asia", DEL: "Asia", BLR: "Asia", CAN: "Asia", PVG: "Asia", BKK: "Asia",
  SIN: "Asia", HKG: "Asia", CGK: "Asia", DAC: "Asia",
  // Europe
  LHR: "Europe", LGW: "Europe", CDG: "Europe", AMS: "Europe", FRA: "Europe",
  ZRH: "Europe", FCO: "Europe", MAD: "Europe", IST: "Europe",
  // America
  JFK: "America", YYZ: "America",
}

// ── Deterministic hashing + seeded randomness ──────────────────────────────────
function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i)
    h |= 0
  }
  return h >>> 0
}

function seeded(seed: string, n: number = 0): number {
  return ((hash(seed) + n * 2654435761) >>> 0) / 4294967296
}

// ── Region → category + aircraft mapping ────────────────────────────────────────
type Category = "domestic" | "regional" | "long-haul"

function categoryFor(originRegion: string, sameCountry: boolean): Category {
  if (sameCountry) return "domestic"
  if (originRegion === "Africa") return "regional" // within Africa but cross-country
  return "long-haul" // cross-region
}

function aircraftFor(category: Category): string {
  if (category === "domestic") return "Embraer E190"
  if (category === "regional") return "Boeing 737-800"
  return "Boeing 787-8"
}

function baseDurationMinutes(category: Category): number {
  if (category === "domestic") return 85 // 1h 25m
  if (category === "regional") return 240 // 4h
  return 600 // 10h
}

function jitterMinutes(category: Category): number {
  if (category === "domestic") return 15
  if (category === "regional") return 60
  return 120
}

function baseEconomyPrice(category: Category): number {
  if (category === "domestic") return 3250
  if (category === "regional") return 11000
  return 27500
}

function jitterPct(category: Category): number {
  if (category === "domestic") return 0.10
  if (category === "regional") return 0.15
  return 0.20
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function fmtTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`
}

function fmtDuration(mins: number): string {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${h}h ${m.toString().padStart(2, "0")}m`
}

function pickOperatingDays(seed: string): number[] | undefined {
  const r = seeded(seed, 7)
  if (r < 0.4) return undefined // ~40% daily
  const nDays = 2 + Math.floor(seeded(seed, 8) * 4) // 2..5 days per week
  const days = new Set<number>()
  // Reservoir-style pick of nDays from 7
  for (let i = 0; i < nDays; i++) {
    days.add(Math.floor(seeded(seed, 9 + i) * 7))
  }
  return Array.from(days).sort()
}

// ── Generate one mesh flight ────────────────────────────────────────────────────
function buildFlight(
  origin: Airport,
  destination: Airport,
  flightNum: number,
): Flight | null {
  if (origin.iata === destination.iata) return null

  const oRegion = REGION_BY_IATA[origin.iata]
  const dRegion = REGION_BY_IATA[destination.iata]
  if (!oRegion || !dRegion) return null

  const sameCountry = origin.country === destination.country
  const category: Category = categoryFor(oRegion, sameCountry)
  const seed = `${origin.iata}-${destination.iata}`

  // Departure time: 06:00–23:00 in 30-min steps, deterministic from origin hash
  const depBaseSlots = 34 // 06:00..22:30 inclusive
  const depSlot = Math.floor(seeded(origin.iata, 1) * depBaseSlots)
  const depMinutes = 6 * 60 + depSlot * 30

  // Duration with jitter
  const durBase = baseDurationMinutes(category)
  const durJitter = jitterMinutes(category)
  const durMinutes =
    durBase + Math.round((seeded(seed, 2) - 0.5) * 2 * durJitter)
  const arrMinutes = (depMinutes + durMinutes) % (24 * 60)

  // Economy price with jitter, then apply 40% off
  const ecoBase = baseEconomyPrice(category)
  const ecoJitter = ecoBase * jitterPct(category)
  const ecoRaw = ecoBase + (seeded(seed, 3) - 0.5) * 2 * ecoJitter
  const ecoPrice = applyDiscount(Math.round(ecoRaw / 100) * 100)
  const bizPrice = Math.round(ecoPrice * 4.2)

  // Stops: 0 for domestic/regional, 0 or 1 (seeded) for long-haul
  const stops = category === "long-haul" && seeded(seed, 4) > 0.7 ? 1 : 0

  // Operating days
  const operatingDays =
    category === "domestic" ? undefined : pickOperatingDays(seed)

  return {
    id: "", // assigned by flights.ts after concat
    origin: origin.iata,
    destination: destination.iata,
    airline: "Kenya Airways",
    flightNumber: `KQ${flightNum}`,
    departureTime: fmtTime(depMinutes),
    arrivalTime: fmtTime(arrMinutes),
    duration: fmtDuration(durMinutes),
    aircraft: aircraftFor(category),
    economyPrice: ecoPrice,
    businessPrice: bizPrice,
    stops,
    operatingDays,
  }
}

// ── Public API: all mesh routes ────────────────────────────────────────────────
export function generateMeshFlights(): Flight[] {
  const out: Flight[] = []
  let counter = 1000 // KQ1000+ — above the hand-crafted KQ100–KQ886 range
  for (const origin of AIRPORTS) {
    for (const destination of AIRPORTS) {
      const f = buildFlight(origin, destination, counter++)
      if (f) out.push(f)
    }
  }
  return out
}

// ── Public API: ~24 cheapest mesh deals ────────────────────────────────────────
export function generateMeshDeals(): Deal[] {
  const all = generateMeshFlights()
  // Cheapest under 20,000 KES post-discount
  const cheap = all
    .filter((f) => f.economyPrice < 20000)
    .sort((a, b) => a.economyPrice - b.economyPrice)
    .slice(0, 24)

  const heroImages = [
    "/hero_slide_1.png",
    "/hero_slide_2.png",
    "/hero_slide_3.png",
    "/hero_slide_4.png",
  ]

  return cheap.map((f, i) => {
    const origin = AIRPORTS.find((a) => a.iata === f.origin)!
    const destination = AIRPORTS.find((a) => a.iata === f.destination)!
    const outOffset = 1 + Math.floor(seeded(f.flightNumber, 11) * 13) // 1..14
    const durationDays = 3 + Math.floor(seeded(f.flightNumber, 12) * 4) // 3..6 days
    return {
      id: 10000 + i,
      origin: f.origin,
      destination: f.destination,
      originCity: origin.city,
      destinationCity: destination.city,
      country: destination.country,
      region: REGION_BY_IATA[f.destination],
      dateRange: `${outOffset} days from now`,
      price: `KES ${f.economyPrice.toLocaleString()}`,
      priceNumber: f.economyPrice,
      image: heroImages[i % heroImages.length],
      cabinClass: "Economy" as const,
      startDaysFromNow: outOffset,
      durationDays: durationDays,
      tripType: "round-trip" as const,
    }
  })
}
