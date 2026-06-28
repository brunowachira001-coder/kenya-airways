export interface Flight {
  id: string;
  origin: string;      // IATA code
  destination: string; // IATA code
  airline: string;
  flightNumber: string; // e.g. "KQ101"
  departureTime: string; // "HH:MM" 24h
  arrivalTime: string;   // "HH:MM" 24h
  duration: string;      // "5h 30m"
  aircraft: string;      // "Boeing 787-8", "Boeing 737-800", "Embraer E190"
  economyPrice: number;  // KES
  businessPrice: number; // KES
  stops: number;         // 0 = direct, 1 = one-stop
  operatingDays?: number[]; // 0=Sun,1=Mon,...6=Sat — undefined = daily
}

// Helper to generate a deterministic pseudo-random number from a seed string
function seededRandom(seed: string, index: number): number {
  let hash = 0;
  const str = seed + index;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return ((hash >>> 0) % 1000) / 1000;
}

function randomPrice(base: number, variance: number, seed: string, index: number): number {
  const r = seededRandom(seed, index);
  return Math.round((base + (r - 0.5) * variance) / 100) * 100;
}

// ── Core flight pool (key routes) ─────────────────────────────────────────
const CORE_FLIGHTS: Omit<Flight, 'id'>[] = [
  // NBO ↔ MBA — domestic, multiple daily, ~1h 25m
  { origin: 'NBO', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ601', departureTime: '06:30', arrivalTime: '07:55', duration: '1h 25m', aircraft: 'Boeing 737-800', economyPrice: 5900, businessPrice: 14400, stops: 0 },
  { origin: 'NBO', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ603', departureTime: '09:00', arrivalTime: '10:25', duration: '1h 25m', aircraft: 'Boeing 737-800', economyPrice: 6700, businessPrice: 16200, stops: 0 },
  { origin: 'NBO', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ605', departureTime: '12:00', arrivalTime: '13:25', duration: '1h 25m', aircraft: 'Boeing 737-800', economyPrice: 5700, businessPrice: 13800, stops: 0 },
  { origin: 'NBO', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ607', departureTime: '14:30', arrivalTime: '15:55', duration: '1h 25m', aircraft: 'Embraer E190', economyPrice: 5200, businessPrice: 12600, stops: 0 },
  { origin: 'NBO', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ609', departureTime: '17:00', arrivalTime: '18:25', duration: '1h 25m', aircraft: 'Boeing 737-800', economyPrice: 6300, businessPrice: 15000, stops: 0 },
  { origin: 'NBO', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ611', departureTime: '20:00', arrivalTime: '21:25', duration: '1h 25m', aircraft: 'Embraer E190', economyPrice: 4800, businessPrice: 12000, stops: 0 },

  // MBA → NBO — return domestic
  { origin: 'MBA', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ600', departureTime: '06:00', arrivalTime: '07:25', duration: '1h 25m', aircraft: 'Boeing 737-800', economyPrice: 5900, businessPrice: 14400, stops: 0 },
  { origin: 'MBA', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ602', departureTime: '08:30', arrivalTime: '09:55', duration: '1h 25m', aircraft: 'Boeing 737-800', economyPrice: 6700, businessPrice: 16200, stops: 0 },
  { origin: 'MBA', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ604', departureTime: '11:00', arrivalTime: '12:25', duration: '1h 25m', aircraft: 'Boeing 737-800', economyPrice: 5700, businessPrice: 13800, stops: 0 },
  { origin: 'MBA', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ608', departureTime: '16:30', arrivalTime: '17:55', duration: '1h 25m', aircraft: 'Embraer E190', economyPrice: 5200, businessPrice: 12600, stops: 0 },
  { origin: 'MBA', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ610', departureTime: '19:30', arrivalTime: '20:55', duration: '1h 25m', aircraft: 'Boeing 737-800', economyPrice: 6300, businessPrice: 15000, stops: 0 },

  // NBO ↔ LHR — long-haul, ~8h 30m direct
  { origin: 'NBO', destination: 'LHR', airline: 'Kenya Airways', flightNumber: 'KQ101', departureTime: '23:30', arrivalTime: '06:00+1', duration: '8h 30m', aircraft: 'Boeing 787-8', economyPrice: 53400, businessPrice: 228000, stops: 0 },
  { origin: 'LHR', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ100', departureTime: '11:30', arrivalTime: '20:30', duration: '8h 00m', aircraft: 'Boeing 787-8', economyPrice: 52200, businessPrice: 222000, stops: 0 },
  { origin: 'NBO', destination: 'LGW', airline: 'Kenya Airways', flightNumber: 'KQ103', departureTime: '21:00', arrivalTime: '03:30+1', duration: '8h 30m', aircraft: 'Boeing 787-8', economyPrice: 49200, businessPrice: 213000, stops: 0 },
  { origin: 'LGW', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ102', departureTime: '10:00', arrivalTime: '19:00', duration: '8h 00m', aircraft: 'Boeing 787-8', economyPrice: 48000, businessPrice: 207000, stops: 0 },

  // NBO ↔ DXB — ~5h direct
  { origin: 'NBO', destination: 'DXB', airline: 'Kenya Airways', flightNumber: 'KQ301', departureTime: '22:00', arrivalTime: '04:30+1', duration: '5h 30m', aircraft: 'Boeing 787-8', economyPrice: 34800, businessPrice: 126000, stops: 0 },
  { origin: 'DXB', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ300', departureTime: '02:00', arrivalTime: '06:30', duration: '5h 30m', aircraft: 'Boeing 787-8', economyPrice: 33600, businessPrice: 123000, stops: 0 },
  { origin: 'NBO', destination: 'DXB', airline: 'Kenya Airways', flightNumber: 'KQ303', departureTime: '10:00', arrivalTime: '14:30', duration: '5h 30m', aircraft: 'Boeing 737-800', economyPrice: 31200, businessPrice: 114000, stops: 0 },

  // NBO ↔ JNB — ~4h direct
  { origin: 'NBO', destination: 'JNB', airline: 'Kenya Airways', flightNumber: 'KQ401', departureTime: '08:00', arrivalTime: '12:00', duration: '4h 00m', aircraft: 'Boeing 787-8', economyPrice: 25200, businessPrice: 105000, stops: 0 },
  { origin: 'NBO', destination: 'JNB', airline: 'Kenya Airways', flightNumber: 'KQ403', departureTime: '20:00', arrivalTime: '00:00+1', duration: '4h 00m', aircraft: 'Boeing 737-800', economyPrice: 22800, businessPrice: 96000, stops: 0 },
  { origin: 'JNB', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ400', departureTime: '06:00', arrivalTime: '10:00', duration: '4h 00m', aircraft: 'Boeing 787-8', economyPrice: 25200, businessPrice: 105000, stops: 0 },
  { origin: 'JNB', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ402', departureTime: '17:00', arrivalTime: '21:00', duration: '4h 00m', aircraft: 'Boeing 737-800', economyPrice: 22800, businessPrice: 96000, stops: 0 },

  // NBO ↔ JFK — ~15h direct
  { origin: 'NBO', destination: 'JFK', airline: 'Kenya Airways', flightNumber: 'KQ102', departureTime: '23:59', arrivalTime: '06:59+1', duration: '15h 00m', aircraft: 'Boeing 787-8', economyPrice: 99000, businessPrice: 408000, stops: 0 },
  { origin: 'JFK', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ101', departureTime: '18:00', arrivalTime: '15:00+1', duration: '14h 00m', aircraft: 'Boeing 787-8', economyPrice: 97200, businessPrice: 402000, stops: 0 },

  // NBO ↔ CDG / AMS — ~8h
  { origin: 'NBO', destination: 'CDG', airline: 'Kenya Airways', flightNumber: 'KQ113', departureTime: '22:00', arrivalTime: '05:30+1', duration: '8h 30m', aircraft: 'Boeing 787-8', economyPrice: 46800, businessPrice: 198000, stops: 0, operatingDays: [1, 3, 5, 6] },
  { origin: 'CDG', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ112', departureTime: '10:00', arrivalTime: '19:30', duration: '8h 30m', aircraft: 'Boeing 787-8', economyPrice: 45600, businessPrice: 192000, stops: 0, operatingDays: [1, 3, 5, 6] },
  { origin: 'NBO', destination: 'AMS', airline: 'Kenya Airways', flightNumber: 'KQ115', departureTime: '21:00', arrivalTime: '04:30+1', duration: '8h 30m', aircraft: 'Boeing 787-8', economyPrice: 45000, businessPrice: 189000, stops: 0, operatingDays: [0, 2, 4] },
  { origin: 'AMS', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ114', departureTime: '11:00', arrivalTime: '20:30', duration: '8h 30m', aircraft: 'Boeing 787-8', economyPrice: 43800, businessPrice: 183000, stops: 0, operatingDays: [0, 2, 4] },

  // NBO ↔ DOH — codeshare via Qatar Airways / KQ
  { origin: 'NBO', destination: 'DOH', airline: 'Kenya Airways', flightNumber: 'KQ305', departureTime: '22:30', arrivalTime: '03:00+1', duration: '5h 30m', aircraft: 'Boeing 737-800', economyPrice: 33000, businessPrice: 120000, stops: 0 },

  // NBO ↔ BOM / DEL — ~5h 30m
  { origin: 'NBO', destination: 'BOM', airline: 'Kenya Airways', flightNumber: 'KQ201', departureTime: '20:30', arrivalTime: '04:00+1', duration: '5h 30m', aircraft: 'Boeing 787-8', economyPrice: 43200, businessPrice: 168000, stops: 0 },
  { origin: 'NBO', destination: 'DEL', airline: 'Kenya Airways', flightNumber: 'KQ203', departureTime: '21:30', arrivalTime: '05:30+1', duration: '6h 00m', aircraft: 'Boeing 787-8', economyPrice: 45000, businessPrice: 174000, stops: 0 },
  { origin: 'BOM', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ200', departureTime: '05:30', arrivalTime: '10:00', duration: '5h 30m', aircraft: 'Boeing 787-8', economyPrice: 43200, businessPrice: 168000, stops: 0 },
  { origin: 'DEL', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ202', departureTime: '06:30', arrivalTime: '11:30', duration: '6h 00m', aircraft: 'Boeing 787-8', economyPrice: 45000, businessPrice: 174000, stops: 0 },

  // NBO ↔ EBB / KGL / DAR / ZNZ — regional, ~1h-2h
  { origin: 'NBO', destination: 'EBB', airline: 'Kenya Airways', flightNumber: 'KQ510', departureTime: '08:00', arrivalTime: '09:30', duration: '1h 30m', aircraft: 'Embraer E190', economyPrice: 13200, businessPrice: 33000, stops: 0 },
  { origin: 'NBO', destination: 'EBB', airline: 'Kenya Airways', flightNumber: 'KQ512', departureTime: '14:00', arrivalTime: '15:30', duration: '1h 30m', aircraft: 'Embraer E190', economyPrice: 11700, businessPrice: 28800, stops: 0 },
  { origin: 'EBB', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ511', departureTime: '10:00', arrivalTime: '11:30', duration: '1h 30m', aircraft: 'Embraer E190', economyPrice: 13200, businessPrice: 33000, stops: 0 },
  { origin: 'NBO', destination: 'KGL', airline: 'Kenya Airways', flightNumber: 'KQ520', departureTime: '09:00', arrivalTime: '10:30', duration: '1h 30m', aircraft: 'Embraer E190', economyPrice: 12600, businessPrice: 31200, stops: 0 },
  { origin: 'NBO', destination: 'KGL', airline: 'Kenya Airways', flightNumber: 'KQ522', departureTime: '16:00', arrivalTime: '17:30', duration: '1h 30m', aircraft: 'Boeing 737-800', economyPrice: 13800, businessPrice: 34800, stops: 0 },
  { origin: 'KGL', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ521', departureTime: '11:00', arrivalTime: '12:30', duration: '1h 30m', aircraft: 'Embraer E190', economyPrice: 12600, businessPrice: 31200, stops: 0 },
  { origin: 'NBO', destination: 'DAR', airline: 'Kenya Airways', flightNumber: 'KQ530', departureTime: '07:00', arrivalTime: '08:20', duration: '1h 20m', aircraft: 'Boeing 737-800', economyPrice: 10800, businessPrice: 27000, stops: 0 },
  { origin: 'NBO', destination: 'DAR', airline: 'Kenya Airways', flightNumber: 'KQ534', departureTime: '13:00', arrivalTime: '14:20', duration: '1h 20m', aircraft: 'Boeing 737-800', economyPrice: 9600, businessPrice: 24000, stops: 0 },
  { origin: 'NBO', destination: 'DAR', airline: 'Kenya Airways', flightNumber: 'KQ536', departureTime: '18:00', arrivalTime: '19:20', duration: '1h 20m', aircraft: 'Embraer E190', economyPrice: 9000, businessPrice: 22800, stops: 0 },
  { origin: 'DAR', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ531', departureTime: '09:00', arrivalTime: '10:20', duration: '1h 20m', aircraft: 'Boeing 737-800', economyPrice: 10800, businessPrice: 27000, stops: 0 },
  { origin: 'NBO', destination: 'ZNZ', airline: 'Kenya Airways', flightNumber: 'KQ540', departureTime: '09:30', arrivalTime: '10:45', duration: '1h 15m', aircraft: 'Embraer E190', economyPrice: 10200, businessPrice: 25200, stops: 0 },
  { origin: 'NBO', destination: 'ZNZ', airline: 'Kenya Airways', flightNumber: 'KQ544', departureTime: '15:30', arrivalTime: '16:45', duration: '1h 15m', aircraft: 'Boeing 737-800', economyPrice: 9300, businessPrice: 22800, stops: 0 },
  { origin: 'ZNZ', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ541', departureTime: '11:15', arrivalTime: '12:30', duration: '1h 15m', aircraft: 'Embraer E190', economyPrice: 10200, businessPrice: 25200, stops: 0 },

  // NBO ↔ ADD / CAI — regional long-haul, ~4-5h
  { origin: 'NBO', destination: 'ADD', airline: 'Kenya Airways', flightNumber: 'KQ450', departureTime: '08:30', arrivalTime: '12:30', duration: '2h 00m', aircraft: 'Boeing 737-800', economyPrice: 16800, businessPrice: 45000, stops: 0 },
  { origin: 'NBO', destination: 'ADD', airline: 'Kenya Airways', flightNumber: 'KQ452', departureTime: '20:30', arrivalTime: '00:30+1', duration: '2h 00m', aircraft: 'Boeing 737-800', economyPrice: 15000, businessPrice: 40800, stops: 0 },
  { origin: 'ADD', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ451', departureTime: '13:00', arrivalTime: '17:00', duration: '2h 00m', aircraft: 'Boeing 737-800', economyPrice: 16800, businessPrice: 45000, stops: 0 },
  { origin: 'NBO', destination: 'CAI', airline: 'Kenya Airways', flightNumber: 'KQ460', departureTime: '21:00', arrivalTime: '02:30+1', duration: '4h 30m', aircraft: 'Boeing 787-8', economyPrice: 33000, businessPrice: 132000, stops: 0, operatingDays: [1, 3, 5] },
  { origin: 'CAI', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ461', departureTime: '03:30', arrivalTime: '09:00', duration: '4h 30m', aircraft: 'Boeing 787-8', economyPrice: 33000, businessPrice: 132000, stops: 0, operatingDays: [1, 3, 5] },

  // NBO ↔ JRO — Kilimanjaro
  { origin: 'NBO', destination: 'JRO', airline: 'Kenya Airways', flightNumber: 'KQ560', departureTime: '08:30', arrivalTime: '09:45', duration: '1h 15m', aircraft: 'Embraer E190', economyPrice: 9600, businessPrice: 24000, stops: 0 },
  { origin: 'JRO', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ561', departureTime: '10:15', arrivalTime: '11:30', duration: '1h 15m', aircraft: 'Embraer E190', economyPrice: 9600, businessPrice: 24000, stops: 0 },

  // NBO ↔ SEZ — Seychelles
  { origin: 'NBO', destination: 'SEZ', airline: 'Kenya Airways', flightNumber: 'KQ570', departureTime: '10:00', arrivalTime: '12:00', duration: '2h 00m', aircraft: 'Boeing 737-800', economyPrice: 21000, businessPrice: 57000, stops: 0, operatingDays: [0, 2, 4, 6] },
  { origin: 'SEZ', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ571', departureTime: '13:00', arrivalTime: '15:00', duration: '2h 00m', aircraft: 'Boeing 737-800', economyPrice: 21000, businessPrice: 57000, stops: 0, operatingDays: [0, 2, 4, 6] },

  // NBO ↔ MRU — Mauritius
  { origin: 'NBO', destination: 'MRU', airline: 'Kenya Airways', flightNumber: 'KQ580', departureTime: '09:00', arrivalTime: '13:00', duration: '4h 00m', aircraft: 'Boeing 787-8', economyPrice: 40800, businessPrice: 156000, stops: 0, operatingDays: [1, 4, 6] },
  { origin: 'MRU', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ581', departureTime: '14:00', arrivalTime: '18:00', duration: '4h 00m', aircraft: 'Boeing 787-8', economyPrice: 40800, businessPrice: 156000, stops: 0, operatingDays: [1, 4, 6] },

  // NBO ↔ CPT — Cape Town via JNB often, occasional direct
  { origin: 'NBO', destination: 'CPT', airline: 'Kenya Airways', flightNumber: 'KQ405', departureTime: '08:30', arrivalTime: '14:30', duration: '5h 00m', aircraft: 'Boeing 737-800', economyPrice: 28800, businessPrice: 117000, stops: 1 },

  // NBO ↔ CAN / BKK / SIN — long-haul via codeshare
  { origin: 'NBO', destination: 'CAN', airline: 'Kenya Airways', flightNumber: 'KQ880', departureTime: '08:00', arrivalTime: '22:00', duration: '11h 00m', aircraft: 'Boeing 787-8', economyPrice: 57000, businessPrice: 228000, stops: 0 },
  { origin: 'NBO', destination: 'SIN', airline: 'Kenya Airways', flightNumber: 'KQ882', departureTime: '21:00', arrivalTime: '11:00+1', duration: '11h 00m', aircraft: 'Boeing 787-8', economyPrice: 66000, businessPrice: 252000, stops: 0 },
  { origin: 'NBO', destination: 'BKK', airline: 'Kenya Airways', flightNumber: 'KQ886', departureTime: '22:00', arrivalTime: '10:00+1', duration: '10h 00m', aircraft: 'Boeing 787-8', economyPrice: 58800, businessPrice: 234000, stops: 0 },
  { origin: 'NBO', destination: 'HKG', airline: 'Kenya Airways', flightNumber: 'KQ884', departureTime: '23:00', arrivalTime: '15:00+1', duration: '11h 00m', aircraft: 'Boeing 787-8', economyPrice: 63000, businessPrice: 246000, stops: 0 },

  // NBO ↔ NBO domestic routes (KIS, EDL)
  { origin: 'NBO', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ620', departureTime: '07:00', arrivalTime: '08:15', duration: '1h 15m', aircraft: 'Embraer E190', economyPrice: 4500, businessPrice: 10800, stops: 0 },
  { origin: 'NBO', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ622', departureTime: '13:00', arrivalTime: '14:15', duration: '1h 15m', aircraft: 'Embraer E190', economyPrice: 4200, businessPrice: 10200, stops: 0 },
  { origin: 'KIS', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ621', departureTime: '09:00', arrivalTime: '10:15', duration: '1h 15m', aircraft: 'Embraer E190', economyPrice: 4500, businessPrice: 10800, stops: 0 },
  { origin: 'NBO', destination: 'EDL', airline: 'Kenya Airways', flightNumber: 'KQ630', departureTime: '08:30', arrivalTime: '10:00', duration: '1h 30m', aircraft: 'Boeing 737-800', economyPrice: 5400, businessPrice: 13200, stops: 0 },
  { origin: 'EDL', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ631', departureTime: '10:30', arrivalTime: '12:00', duration: '1h 30m', aircraft: 'Boeing 737-800', economyPrice: 5400, businessPrice: 13200, stops: 0 },

  // NBO ↔ ACC — West Africa
  { origin: 'NBO', destination: 'ACC', airline: 'Kenya Airways', flightNumber: 'KQ490', departureTime: '21:00', arrivalTime: '01:00+1', duration: '6h 00m', aircraft: 'Boeing 787-8', economyPrice: 43200, businessPrice: 171000, stops: 0 },

  // NBO ↔ LOS — Nigeria
  { origin: 'NBO', destination: 'LOS', airline: 'Kenya Airways', flightNumber: 'KQ492', departureTime: '22:00', arrivalTime: '04:00+1', duration: '6h 00m', aircraft: 'Boeing 737-800', economyPrice: 45000, businessPrice: 177000, stops: 0 },

  // NBO ↔ FRA — Germany
  { origin: 'NBO', destination: 'FRA', airline: 'Kenya Airways', flightNumber: 'KQ117', departureTime: '21:30', arrivalTime: '05:30+1', duration: '8h 00m', aircraft: 'Boeing 787-8', economyPrice: 48000, businessPrice: 204000, stops: 0, operatingDays: [1, 3, 5] },

  // NBO ↔ ZRH — Switzerland
  { origin: 'NBO', destination: 'ZRH', airline: 'Kenya Airways', flightNumber: 'KQ119', departureTime: '20:30', arrivalTime: '04:30+1', duration: '8h 00m', aircraft: 'Boeing 787-8', economyPrice: 49200, businessPrice: 207000, stops: 0, operatingDays: [0, 2, 4, 6] },

  // NBO ↔ FCO — Rome
  { origin: 'NBO', destination: 'FCO', airline: 'Kenya Airways', flightNumber: 'KQ121', departureTime: '22:00', arrivalTime: '06:00+1', duration: '8h 00m', aircraft: 'Boeing 787-8', economyPrice: 47400, businessPrice: 201000, stops: 0, operatingDays: [1, 3, 5, 6] },

  // NBO ↔ MAD — Madrid
  { origin: 'NBO', destination: 'MAD', airline: 'Kenya Airways', flightNumber: 'KQ123', departureTime: '21:00', arrivalTime: '05:00+1', duration: '8h 00m', aircraft: 'Boeing 787-8', economyPrice: 46200, businessPrice: 195000, stops: 0, operatingDays: [0, 2, 4] },

  // NBO ↔ IST — Istanbul
  { origin: 'NBO', destination: 'IST', airline: 'Kenya Airways', flightNumber: 'KQ125', departureTime: '22:30', arrivalTime: '05:30+1', duration: '7h 00m', aircraft: 'Boeing 787-8', economyPrice: 40800, businessPrice: 165000, stops: 0 },

  // NBO ↔ YYZ — Toronto (seasonal)
  { origin: 'NBO', destination: 'YYZ', airline: 'Kenya Airways', flightNumber: 'KQ104', departureTime: '22:00', arrivalTime: '06:00+1', duration: '14h 00m', aircraft: 'Boeing 787-8', economyPrice: 93000, businessPrice: 372000, stops: 0, operatingDays: [1, 4, 6] },

  // NBO ↔ CMN — Casablanca
  { origin: 'NBO', destination: 'CMN', airline: 'Kenya Airways', flightNumber: 'KQ130', departureTime: '20:00', arrivalTime: '03:30+1', duration: '7h 30m', aircraft: 'Boeing 787-8', economyPrice: 39000, businessPrice: 156000, stops: 0, operatingDays: [0, 3, 5] },

  // NBO ↔ JED / RUH
  { origin: 'NBO', destination: 'JED', airline: 'Kenya Airways', flightNumber: 'KQ310', departureTime: '22:30', arrivalTime: '03:30+1', duration: '5h 00m', aircraft: 'Boeing 787-8', economyPrice: 33000, businessPrice: 129000, stops: 0 },
  { origin: 'NBO', destination: 'RUH', airline: 'Kenya Airways', flightNumber: 'KQ312', departureTime: '22:00', arrivalTime: '05:00+1', duration: '5h 00m', aircraft: 'Boeing 737-800', economyPrice: 31800, businessPrice: 123000, stops: 0 },

  // NBO ↔ AUH — Abu Dhabi
  { origin: 'NBO', destination: 'AUH', airline: 'Kenya Airways', flightNumber: 'KQ307', departureTime: '21:00', arrivalTime: '03:00+1', duration: '5h 00m', aircraft: 'Boeing 787-8', economyPrice: 32400, businessPrice: 124800, stops: 0 },

  // NBO ↔ HRE — Harare
  { origin: 'NBO', destination: 'HRE', airline: 'Kenya Airways', flightNumber: 'KQ470', departureTime: '08:00', arrivalTime: '10:00', duration: '2h 00m', aircraft: 'Boeing 737-800', economyPrice: 17400, businessPrice: 46800, stops: 0 },
  { origin: 'HRE', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ471', departureTime: '11:00', arrivalTime: '13:00', duration: '2h 00m', aircraft: 'Boeing 737-800', economyPrice: 17400, businessPrice: 46800, stops: 0 },

  // NBO ↔ LUN — Lusaka
  { origin: 'NBO', destination: 'LUN', airline: 'Kenya Airways', flightNumber: 'KQ480', departureTime: '08:30', arrivalTime: '11:30', duration: '3h 00m', aircraft: 'Boeing 737-800', economyPrice: 21000, businessPrice: 57000, stops: 0 },
  { origin: 'LUN', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ481', departureTime: '12:30', arrivalTime: '15:30', duration: '3h 00m', aircraft: 'Boeing 737-800', economyPrice: 21000, businessPrice: 57000, stops: 0 },

  // NBO ↔ FIH — Kinshasa
  { origin: 'NBO', destination: 'FIH', airline: 'Kenya Airways', flightNumber: 'KQ440', departureTime: '08:00', arrivalTime: '11:30', duration: '3h 30m', aircraft: 'Boeing 737-800', economyPrice: 25200, businessPrice: 69000, stops: 0 },
  { origin: 'FIH', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ441', departureTime: '12:30', arrivalTime: '16:00', duration: '3h 30m', aircraft: 'Boeing 737-800', economyPrice: 25200, businessPrice: 69000, stops: 0 },

  // NBO ↔ LLW — Lilongwe
  { origin: 'NBO', destination: 'LLW', airline: 'Kenya Airways', flightNumber: 'KQ486', departureTime: '09:00', arrivalTime: '12:00', duration: '3h 00m', aircraft: 'Boeing 737-800', economyPrice: 19800, businessPrice: 54000, stops: 0 },

  // NBO ↔ MPM — Maputo
  { origin: 'NBO', destination: 'MPM', airline: 'Kenya Airways', flightNumber: 'KQ488', departureTime: '08:00', arrivalTime: '13:00', duration: '4h 00m', aircraft: 'Boeing 737-800', economyPrice: 27000, businessPrice: 75000, stops: 1 },

  // NBO ↔ GBE — Gaborone
  { origin: 'NBO', destination: 'GBE', airline: 'Kenya Airways', flightNumber: 'KQ406', departureTime: '08:00', arrivalTime: '14:00', duration: '5h 00m', aircraft: 'Boeing 737-800', economyPrice: 30000, businessPrice: 108000, stops: 1 },
];

// Assign unique IDs
const ALL_FLIGHTS: Flight[] = CORE_FLIGHTS.map((f, i) => ({
  ...f,
  id: `FL-${f.origin}-${f.destination}-${i.toString().padStart(3, '0')}`,
}));

/**
 * Search for flights between two airports on a given date.
 * Returns flights that operate on that day-of-week (if operatingDays is set).
 * Adds small date-based price variation to make results feel dynamic.
 */
export function searchFlights(
  origin: string,
  destination: string,
  date: string // "YYYY-MM-DD"
): Flight[] {
  const dayOfWeek = date ? new Date(date).getDay() : undefined;

  return ALL_FLIGHTS.filter(f => {
    if (f.origin.toUpperCase() !== origin.toUpperCase()) return false;
    if (f.destination.toUpperCase() !== destination.toUpperCase()) return false;
    if (dayOfWeek !== undefined && f.operatingDays !== undefined) {
      if (!f.operatingDays.includes(dayOfWeek)) return false;
    }
    return true;
  }).map((f, i) => {
    // Small price variation based on travel date
    const dateSeed = `${date}-${origin}-${destination}`;
    const base = f.economyPrice;
    const variance = Math.round(base * 0.15); // ±7.5%
    const variedEco = randomPrice(base, variance, dateSeed, i);
    const variedBiz = Math.round(variedEco * (f.businessPrice / f.economyPrice));

    return {
      ...f,
      economyPrice: variedEco,
      businessPrice: variedBiz,
    };
  });
}

/**
 * Get all flights for a given route (both directions) without date filtering.
 * Useful for populating a calendar with price hints.
 */
export function getFlightsForRoute(origin: string, destination: string): Flight[] {
  return ALL_FLIGHTS.filter(f =>
    (f.origin.toUpperCase() === origin.toUpperCase() &&
     f.destination.toUpperCase() === destination.toUpperCase()) ||
    (f.origin.toUpperCase() === destination.toUpperCase() &&
     f.destination.toUpperCase() === origin.toUpperCase())
  );
}