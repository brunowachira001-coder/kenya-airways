# Flight Mesh + 40% Discount + Date-Rolling — Design

**Date:** 2026-06-30
**Branch:** `fix/extras-column`
**Status:** Draft for user review

---

## Context

The Kenya Airways booking site (`/home/bruno/kk`) currently has:

- 68 airports defined (`src/lib/airports.ts`) representing KQ's full route network
- ~30 hand-crafted routes in `src/lib/flights.ts` (NBO↔LHR KQ101, NBO↔MBA KQ601, etc.)
- A search engine (`searchFlights()`) that filters by date and day-of-week
- 28 curated deals in `src/lib/deals.ts` with **hardcoded dates** like `"17 Jun 26 to 18 Jun 26"` and **hardcoded prices** at 50% off KQ original (per commit `6fa0290`)
- Many network airports have **no flights defined** (e.g. Entebbe→Johannesburg, Mombasa→Zanzibar)

User goals:

1. **Flights for every route in the network** — searches to any IATA pair return flights
2. **Stateless date-rolling** — deal cards and search defaults use today's date + offsets, never drift
3. **Replace 50% discount with 40%** — every price across the site becomes 60% of KQ original (i.e. 20% higher than today)
4. **Deal cards "read the same" date as today** — no stale hardcoded ranges
5. **Browse and confirm on `kqairways.sbs`** — user deploys, then I verify via Playwright

---

## Decisions

| Topic | Decision |
|---|---|
| Scope of "all routes" | **Full mesh** — every airport pair in the 68-airport network (~4,556 routes) |
| Implementation approach | **Hybrid** — keep the existing ~30 hand-crafted routes (KQ101–KQ886), generate the rest |
| Discount | **Replace 50% with 40% everywhere** — multiply current values by 1.2 |
| Date rolling | **Stateless runtime** — `today + offsets` computed at render |
| "Sweet deals" naming | **No rebrand** — keep "Deals" section names as-is |
| Deal population | **Append mesh deals** — keep 28 curated, add ~24 cheapest mesh routes |
| Test runner | **Add Vitest** — covers mesh + dates + pricing; updates existing `deals.test.ts` |
| Verification | **Playwright on prod** — user deploys to `kqairways.sbs`, I browse with Playwright |

---

## Architecture

### Section 1 — Data model + mesh generation

**New file:** `src/lib/mesh.ts`

**Exports:**
```ts
export function generateMeshFlights(): Flight[]
export function generateMeshDeals(): Deal[]
```

**`generateMeshFlights()` algorithm per (origin, destination) pair:**

1. Skip if origin === destination
2. Look up `(originRegion, destinationRegion)` from `AIRPORT_REGIONS` map (Africa / Europe / Asia / America / Middle East)
3. **Category** by region pair:
   - same-region, same-country → `domestic`
   - same-region, cross-country → `regional`
   - cross-region → `long-haul`
4. **Aircraft** by category:
   - domestic/regional → Embraer E190
   - medium → Boeing 737-800
   - long-haul → Boeing 787-8
5. **Duration** by category + seeded jitter (±30min):
   - domestic ~1h25m
   - regional ~4-8h
   - long-haul ~10-15h
6. **Departure time** seeded from origin hash → 06:00–23:00 in 30-min steps
7. **Economy price** = base × seeded jitter (±15%) × 0.6 (= 40% off). Base: domestic 6500, regional 22000, long-haul 55000 KES
8. **Business price** = economy × 4.2
9. **Stops**: 0 for domestic/regional, 0 or 1 (seeded) for long-haul
10. **operatingDays**: undefined (daily) for domestic; seeded subset [0..6] for international
11. **flightNumber**: `KQ${counter}` starting at 1000 (above hand-crafted range KQ100–KQ886)
12. Round prices to nearest KES 100

**Output ordering:** deterministic nested loop over `AIRPORTS`. Yields exactly **4,556 flights** (68 × 67).

**Integration in `src/lib/flights.ts`:**

```ts
import { generateMeshFlights } from "./mesh"

const ALL_FLIGHTS: Flight[] = [
  ...CORE_FLIGHTS,
  ...generateMeshFlights(),
].map((f, i) => ({ ...f, id: `FL-${f.origin}-${f.destination}-${i.toString().padStart(3, '0')}` }))
```

`searchFlights()` and `getFlightsForRoute()` unchanged.

---

### Section 2 — Date-rolling + 40% discount

**New file:** `src/lib/dates.ts`

```ts
export function formatDealDateRange(
  outboundOffset: number,
  returnOffset: number,
  today: Date = new Date()
): string
// returns e.g. "3 Jul to 7 Jul"
// clamps negative offsets to 0
```

**Deal shape change** (`src/lib/deals.ts`):

```diff
- dateRange: string         // "17 Jun 26 to 18 Jun 26"
- price: string             // "KES 8,300"
+ daysFromToday: { outbound: number; return: number }
+ // price derived from priceNumber at render
```

Defaults: 28 curated deals get offsets spread 1–14 days.

**Pricing centralization** (`src/lib/pricing.ts`):

```ts
export const BOOKING_DISCOUNT = 0.6 // pay 60% (= 40% off)
export function applyDiscount(originalKQBase: number): number {
  return Math.round((originalKQBase * BOOKING_DISCOUNT) / 100) * 100
}
```

Existing `getSeatPrice()` unchanged.

**Files to multiply by 1.2** (mirrors commit `6fa0290`):

| File | Fields |
|---|---|
| `src/lib/flights.ts` | every `economyPrice`, `businessPrice` in `CORE_FLIGHTS` (90 values) |
| `src/lib/deals.ts` | every `priceNumber` (28 values) |
| `src/lib/pricing.ts` | `getSeatPrice()` returns: 500→600, 750→900, 1250→1500 |
| `src/store/booking-store.ts` | `EXTRA_PRICING`: 2250→2700, 1400→1680, 1250→1500, 1305→1566 |
| `src/components/booking/trip-summary.tsx` | extras fallback: 2500→3000, 1250→1500 |
| `src/app/booking/seat-selection/page.tsx` | extra-legroom: 1250→1500 |
| `src/app/booking/payment/page.tsx` | fallback: 22500→27000, 20000→24000 |
| `src/app/explore/page.tsx` | destination prices re-priced to 40% off |

---

### Section 3 — Surface updates

**Components that change:**

| File | Change |
|---|---|
| `src/lib/deals.ts` | New `Deal` shape (see above); `formatPrice()` derives `price` from `priceNumber` |
| `src/components/home/deals-section.tsx` | Render `formatDealDateRange(...)` instead of `deal.dateRange`; update `LegacyDeal` mapping |
| `src/app/deals/page.tsx` | Same render change |
| `src/components/home/booking-widget.tsx` | No code change — auto-suggest already uses `AIRPORTS`; defaults already today-relative |

**Auto-suggest:** `booking-widget.tsx` already imports `AIRPORTS` for its dropdown. No change. Mesh coverage means every IATA returns flights on search.

**Data flow:**

```
AIRPORTS (68) ──┐
                ├─→ generateMeshFlights() ──┐
CORE_FLIGHTS ───┘                           ├─→ ALL_FLIGHTS ─→ searchFlights() ─→ /api/flights/search ─→ /search page
                                            │
AIRPORTS ────────→ generateMeshDeals() ──┐
CURATED_DEALS ───────────────────────────┴─→ DEALS ─→ deals-section.tsx + /deals page
```

**Mesh deals generation** (`generateMeshDeals()` in `mesh.ts`):
- Iterate `AIRPORTS × AIRPORTS`, exclude same-origin-dest
- Compute economy price via mesh algorithm
- Keep only routes where post-discount `economyPrice < KES 20,000`
- Take cheapest ~24, deterministic order
- Round-robin image: `/hero_slide_1.png` … `/hero_slide_4.png`
- `daysFromToday`: seeded spread of 1–14 days
- `region`, `country` from `AIRPORT_REGIONS` lookup

**Edge cases handled:**
1. **SSR hydration** — `new Date()` called only in `'use client'` components (all affected components are). ✅
2. **Same origin/destination** — `searchFlights()` filters out. API returns 400. ✅
3. **Invalid IATA** — API regex check returns 400. ✅
4. **Flight number collisions** — mesh starts at `KQ1000`, hand-crafted uses `KQ100–KQ886`. No overlap. ✅
5. **Empty `daysFromToday`** — `formatDealDateRange` defaults to today+0/0. ✅
6. **Future dates** — `react-day-picker` `fromDate`/`toDate` ranges already constrain.

---

### Section 4 — Verification & testing

**Add Vitest** as dev dependency.

**New scripts in `package.json`:**
```json
"test": "vitest run",
"test:watch": "vitest"
```

**New `vitest.config.ts`** (zero-config-friendly defaults).

**Tests:**

| File | Coverage |
|---|---|
| `src/lib/__tests__/mesh.test.ts` (new) | `generateMeshFlights()` returns exactly 4,556 flights; all have valid 3-letter uppercase IATA codes; flight numbers in KQ1xxx range; aircraft matches category (E190 for domestic, 787-8 for long-haul); business ≈ 4.2× economy. `generateMeshDeals()` returns ≤30 deals, all `economyPrice < 20000`, all with valid image paths. |
| `src/lib/__tests__/deals.test.ts` (updated) | Length becomes `28 + generateMeshDeals().length`; update image regex to accept `/hero_slide_[1-4].png`; drop hardcoded `dateRange` test; add `daysFromToday` validation (non-negative integers). |
| `src/lib/__tests__/dates.test.ts` (new) | `formatDealDateRange(3, 7)` matches `/\d{1,2} \w{3} to \d{1,2} \w{3}/`; negative offsets clamp to today. |
| `src/lib/__tests__/pricing.test.ts` (new) | `BOOKING_DISCOUNT === 0.6`; `applyDiscount(10000) === 6000`; rounds to nearest 100. |

**Verification commands** (run before declaring done):

```bash
npm run lint
npm run build
npm test
rm -rf .next && npm run dev   # then exercise flows in browser
```

**Manual smoke flows:**
1. `/` — homepage deals show today's date, prices show 40%-off values
2. Click a deal → `/search` → flights appear (mesh route exists)
3. `/deals` — 28 + ~24 mesh deals render; region filter still works
4. Booking widget: type `MRU` → select → results page loads with mesh flights
5. Round-trip NBO↔MBA for `today + 1` → returns flights with prices 20% higher than prior 50%-off values
6. `/booking/fare-select`, `/booking/passengers`, `/booking/extras` → pricing total uses 40% off (will jump ~20% vs current values)

**Deployment verification on kqairways.sbs:**
- User deploys via Vercel CLI
- I browse `https://kqairways.sbs` with Playwright via MCP
- Verify: deal dates are today-relative; prices are 40% off; clicking a deal returns flights; round-trip search returns flights; /deals shows 50+ deals
- Screenshot key flows for the spec review

---

## Risks

| Risk | Mitigation |
|---|---|
| Mesh adds ~4,556 objects in module memory | Acceptable — ~500KB in memory, ~50KB after JSON. Modern browsers handle easily. |
| SSR/CSR hydration mismatch on `new Date()` | All date formatters are client-side (`'use client'`). Server renders placeholder; client hydrates with real dates. |
| `kqairways.sbs` may not be reachable from my environment | User confirms deployment first; if unreachable, fall back to Vercel preview URL. |
| Mesh routes might not match "real" KQ flights | Acknowledged. Mesh is for search coverage; real bookings still go through Supabase/payment. |
| Existing deals.test.ts is orphaned (no runner) | Solved by adding Vitest in this work. |
| 1.2× price multiplier could be off by one if floor/round differs | All multiplications use `Math.round(x / 100) * 100` consistently. |

---

## Out of scope

- Renaming anything (per user: "Don't rebrand any name")
- User authentication
- Payment callback TODO (`src/app/api/payment/callback/route.ts:12`)
- Real booking integration with KQ systems
- Multi-language support
- Seat selection map (page exists; logic untouched)

---

## Open questions

None — all clarifying questions answered in brainstorming phase.
