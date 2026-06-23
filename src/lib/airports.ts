export interface Airport {
  city: string;
  country: string;
  name: string;
  iata: string;
  nearby?: boolean;
}

// Kenya Airways route network - 50+ airports
export const AIRPORTS: Airport[] = [
  // ── Kenya (7) ──────────────────────────────────────
  { city: "Nairobi", country: "Kenya", name: "Jomo Kenyatta International Airport", iata: "NBO", nearby: true },
  { city: "Mombasa", country: "Kenya", name: "Moi International Airport", iata: "MBA", nearby: true },
  { city: "Kisumu", country: "Kenya", name: "Kisumu International Airport", iata: "KIS", nearby: true },
  { city: "Eldoret", country: "Kenya", name: "Eldoret International Airport", iata: "EDL", nearby: true },
  { city: "Malindi", country: "Kenya", name: "Malindi Airport", iata: "MYD", nearby: true },
  { city: "Kitale", country: "Kenya", name: "Kitale Airport", iata: "KTL", nearby: true },
  { city: "Lamu", country: "Kenya", name: "Lamu Airport", iata: "LAU", nearby: true },

  // ── Tanzania (5) ───────────────────────────────────
  { city: "Dar es Salaam", country: "Tanzania", name: "Julius Nyerere International Airport", iata: "DAR" },
  { city: "Zanzibar", country: "Tanzania", name: "Abeid Amani Karume Airport", iata: "ZNZ" },
  { city: "Kilimanjaro", country: "Tanzania", name: "Kilimanjaro International Airport", iata: "JRO" },
  { city: "Arusha", country: "Tanzania", name: "Arusha Airport", iata: "ARK" },
  { city: "Dodoma", country: "Tanzania", name: "Dodoma Airport", iata: "DOD" },

  // ── Uganda (2) ─────────────────────────────────────
  { city: "Entebbe", country: "Uganda", name: "Entebbe International Airport", iata: "EBB" },
  { city: "Kampala", country: "Uganda", name: "Kampala Airport", iata: "KML" },

  // ── Rwanda (1) ─────────────────────────────────────
  { city: "Kigali", country: "Rwanda", name: "Kigali International Airport", iata: "KGL" },

  // ── Burundi (1) ────────────────────────────────────
  { city: "Bujumbura", country: "Burundi", name: "Bujumbura International Airport", iata: "BJM" },

  // ── South Africa (3) ───────────────────────────────
  { city: "Johannesburg", country: "South Africa", name: "O.R. Tambo International Airport", iata: "JNB" },
  { city: "Cape Town", country: "South Africa", name: "Cape Town International Airport", iata: "CPT" },
  { city: "Durban", country: "South Africa", name: "King Shaka International Airport", iata: "DUR" },

  // ── Ethiopia (2) ───────────────────────────────────
  { city: "Addis Ababa", country: "Ethiopia", name: "Addis Ababa Bole International Airport", iata: "ADD" },
  { city: "Dire Dawa", country: "Ethiopia", name: "Dire Dawa International Airport", iata: "DIR" },

  // ── Egypt (1) ──────────────────────────────────────
  { city: "Cairo", country: "Egypt", name: "Cairo International Airport", iata: "CAI" },

  // ── Zimbabwe (1) ───────────────────────────────────
  { city: "Harare", country: "Zimbabwe", name: "Robert Gabriel Mugabe International Airport", iata: "HRE" },

  // ── Zambia (1) ─────────────────────────────────────
  { city: "Lusaka", country: "Zambia", name: "Kenneth Kaunda International Airport", iata: "LUN" },

  // ── Malawi (1) ─────────────────────────────────────
  { city: "Lilongwe", country: "Malawi", name: "Kamuzu International Airport", iata: "LLW" },

  // ── Mozambique (1) ─────────────────────────────────
  { city: "Maputo", country: "Mozambique", name: "Maputo International Airport", iata: "MPM" },

  // ── Botswana (1) ───────────────────────────────────
  { city: "Gaborone", country: "Botswana", name: "Sir Seretse Khama International Airport", iata: "GBE" },

  // ── Seychelles (1) ─────────────────────────────────
  { city: "Mahé", country: "Seychelles", name: "Seychelles International Airport", iata: "SEZ" },

  // ── Mauritius (1) ──────────────────────────────────
  { city: "Port Louis", country: "Mauritius", name: "Sir Seewoosagur Ramgoolam Airport", iata: "MRU" },

  // ── Madagascar (1) ─────────────────────────────────
  { city: "Antananarivo", country: "Madagascar", name: "Ivato International Airport", iata: "TNR" },

  // ── Comoros (1) ────────────────────────────────────
  { city: "Moroni", country: "Comoros", name: "Prince Said Ibrahim International Airport", iata: "HAH" },

  // ── Djibouti (1) ───────────────────────────────────
  { city: "Djibouti City", country: "Djibouti", name: "Djibouti–Ambouli International Airport", iata: "JIB" },

  // ── Somalia (1) ────────────────────────────────────
  { city: "Mogadishu", country: "Somalia", name: "Aden Adde International Airport", iata: "MGQ" },

  // ── DRC (1) ────────────────────────────────────────
  { city: "Kinshasa", country: "DRC", name: "Kinshasa N'djili International Airport", iata: "FIH" },

  // ── Ivory Coast (1) ────────────────────────────────
  { city: "Abidjan", country: "Ivory Coast", name: " Félix Houphouët-Boigny International Airport", iata: "ABJ" },

  // ── Senegal (1) ────────────────────────────────────
  { city: "Dakar", country: "Senegal", name: "Léopold Sédar Senghor International Airport", iata: "DKR" },

  // ── Ghana (1) ──────────────────────────────────────
  { city: "Accra", country: "Ghana", name: "Kotoka International Airport", iata: "ACC" },

  // ── Nigeria (1) ────────────────────────────────────
  { city: "Lagos", country: "Nigeria", name: "Murtala Muhammed International Airport", iata: "LOS" },

  // ── Morocco (1) ────────────────────────────────────
  { city: "Casablanca", country: "Morocco", name: "Mohammed V International Airport", iata: "CMN" },

  // ── Tunisia (1) ────────────────────────────────────
  { city: "Tunis", country: "Tunisia", name: "Tunis–Carthage International Airport", iata: "TUN" },

  // ── UAE (2) ────────────────────────────────────────
  { city: "Dubai", country: "United Arab Emirates", name: "Dubai International Airport", iata: "DXB" },
  { city: "Abu Dhabi", country: "United Arab Emirates", name: "Abu Dhabi International Airport", iata: "AUH" },

  // ── Saudi Arabia (2) ───────────────────────────────
  { city: "Jeddah", country: "Saudi Arabia", name: "King Abdulaziz International Airport", iata: "JED" },
  { city: "Riyadh", country: "Saudi Arabia", name: "King Khalid International Airport", iata: "RUH" },

  // ── Qatar (1) ──────────────────────────────────────
  { city: "Doha", country: "Qatar", name: "Hamad International Airport", iata: "DOH" },

  // ── India (2) ──────────────────────────────────────
  { city: "Mumbai", country: "India", name: "Chhatrapati Shivaji Maharaj International Airport", iata: "BOM" },
  { city: "New Delhi", country: "India", name: "Indira Gandhi International Airport", iata: "DEL" },

  // ── China (2) ──────────────────────────────────────
  { city: "Guangzhou", country: "China", name: "Guangzhou Baiyun International Airport", iata: "CAN" },
  { city: "Shanghai", country: "China", name: "Shanghai Pudong International Airport", iata: "PVG" },

  // ── Thailand (1) ───────────────────────────────────
  { city: "Bangkok", country: "Thailand", name: "Suvarnabhumi Airport", iata: "BKK" },

  // ── Singapore (1) ──────────────────────────────────
  { city: "Singapore", country: "Singapore", name: "Singapore Changi Airport", iata: "SIN" },

  // ── Hong Kong (1) ──────────────────────────────────
  { city: "Hong Kong", country: "Hong Kong SAR", name: "Hong Kong International Airport", iata: "HKG" },

  // ── Bangladesh (1) ─────────────────────────────────
  { city: "Dhaka", country: "Bangladesh", name: "Hazrat Shahjalal International Airport", iata: "DAC" },

  // ── UK (2) ─────────────────────────────────────────
  { city: "London", country: "United Kingdom", name: "London Heathrow Airport", iata: "LHR" },
  { city: "London", country: "United Kingdom", name: "London Gatwick Airport", iata: "LGW" },

  // ── France (1) ─────────────────────────────────────
  { city: "Paris", country: "France", name: "Charles de Gaulle Airport", iata: "CDG" },

  // ── Netherlands (1) ────────────────────────────────
  { city: "Amsterdam", country: "Netherlands", name: "Amsterdam Airport Schiphol", iata: "AMS" },

  // ── Germany (1) ────────────────────────────────────
  { city: "Frankfurt", country: "Germany", name: "Frankfurt Airport", iata: "FRA" },

  // ── Switzerland (1) ────────────────────────────────
  { city: "Zurich", country: "Switzerland", name: "Zurich Airport", iata: "ZRH" },

  // ── Italy (1) ──────────────────────────────────────
  { city: "Rome", country: "Italy", name: "Leonardo da Vinci–Fiumicino Airport", iata: "FCO" },

  // ── Spain (1) ──────────────────────────────────────
  { city: "Madrid", country: "Spain", name: "Adolfo Suárez Madrid–Barajas Airport", iata: "MAD" },

  // ── Turkey (1) ─────────────────────────────────────
  { city: "Istanbul", country: "Turkey", name: "Istanbul Airport", iata: "IST" },

  // ── USA (1) ────────────────────────────────────────
  { city: "New York", country: "United States", name: "John F. Kennedy International Airport", iata: "JFK" },

  // ── Canada (1) ─────────────────────────────────────
  { city: "Toronto", country: "Canada", name: "Toronto Pearson International Airport", iata: "YYZ" },
];

// Helper to look up an airport by IATA code
export function getAirport(iata: string): Airport | undefined {
  return AIRPORTS.find(a => a.iata.toUpperCase() === iata.toUpperCase());
}

// Get city name for display
export function getCityName(iata: string): string {
  return getAirport(iata)?.city ?? iata;
}