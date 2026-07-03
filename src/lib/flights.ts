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
  { origin: 'NBO', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ601', departureTime: '06:30', arrivalTime: '07:55', duration: '1h 25m', aircraft: 'Boeing 737-800', economyPrice: 2950, businessPrice: 7200, stops: 0 },
  { origin: 'NBO', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ603', departureTime: '09:00', arrivalTime: '10:25', duration: '1h 25m', aircraft: 'Boeing 737-800', economyPrice: 3350, businessPrice: 8100, stops: 0 },
  { origin: 'NBO', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ605', departureTime: '12:00', arrivalTime: '13:25', duration: '1h 25m', aircraft: 'Boeing 737-800', economyPrice: 2900, businessPrice: 6900, stops: 0 },
  { origin: 'NBO', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ607', departureTime: '14:30', arrivalTime: '15:55', duration: '1h 25m', aircraft: 'Embraer E190', economyPrice: 2600, businessPrice: 6300, stops: 0 },
  { origin: 'NBO', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ609', departureTime: '17:00', arrivalTime: '18:25', duration: '1h 25m', aircraft: 'Boeing 737-800', economyPrice: 3200, businessPrice: 7500, stops: 0 },
  { origin: 'NBO', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ611', departureTime: '20:00', arrivalTime: '21:25', duration: '1h 25m', aircraft: 'Embraer E190', economyPrice: 2400, businessPrice: 6000, stops: 0 },

  // MBA → NBO — return domestic
  { origin: 'MBA', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ600', departureTime: '06:00', arrivalTime: '07:25', duration: '1h 25m', aircraft: 'Boeing 737-800', economyPrice: 2950, businessPrice: 7200, stops: 0 },
  { origin: 'MBA', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ602', departureTime: '08:30', arrivalTime: '09:55', duration: '1h 25m', aircraft: 'Boeing 737-800', economyPrice: 3350, businessPrice: 8100, stops: 0 },
  { origin: 'MBA', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ604', departureTime: '11:00', arrivalTime: '12:25', duration: '1h 25m', aircraft: 'Boeing 737-800', economyPrice: 2900, businessPrice: 6900, stops: 0 },
  { origin: 'MBA', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ608', departureTime: '16:30', arrivalTime: '17:55', duration: '1h 25m', aircraft: 'Embraer E190', economyPrice: 2600, businessPrice: 6300, stops: 0 },
  { origin: 'MBA', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ610', departureTime: '19:30', arrivalTime: '20:55', duration: '1h 25m', aircraft: 'Boeing 737-800', economyPrice: 3200, businessPrice: 7500, stops: 0 },

  // NBO ↔ LHR — long-haul, ~8h 30m direct
  { origin: 'NBO', destination: 'LHR', airline: 'Kenya Airways', flightNumber: 'KQ101', departureTime: '23:30', arrivalTime: '06:00+1', duration: '8h 30m', aircraft: 'Boeing 787-8', economyPrice: 26700, businessPrice: 114000, stops: 0 },
  { origin: 'LHR', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ100', departureTime: '11:30', arrivalTime: '20:30', duration: '8h 00m', aircraft: 'Boeing 787-8', economyPrice: 26100, businessPrice: 111000, stops: 0 },
  { origin: 'NBO', destination: 'LGW', airline: 'Kenya Airways', flightNumber: 'KQ103', departureTime: '21:00', arrivalTime: '03:30+1', duration: '8h 30m', aircraft: 'Boeing 787-8', economyPrice: 24600, businessPrice: 106500, stops: 0 },
  { origin: 'LGW', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ102', departureTime: '10:00', arrivalTime: '19:00', duration: '8h 00m', aircraft: 'Boeing 787-8', economyPrice: 24000, businessPrice: 103500, stops: 0 },

  // NBO ↔ DXB — ~5h direct
  { origin: 'NBO', destination: 'DXB', airline: 'Kenya Airways', flightNumber: 'KQ301', departureTime: '22:00', arrivalTime: '04:30+1', duration: '5h 30m', aircraft: 'Boeing 787-8', economyPrice: 17400, businessPrice: 63000, stops: 0 },
  { origin: 'DXB', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ300', departureTime: '02:00', arrivalTime: '06:30', duration: '5h 30m', aircraft: 'Boeing 787-8', economyPrice: 16800, businessPrice: 61500, stops: 0 },
  { origin: 'NBO', destination: 'DXB', airline: 'Kenya Airways', flightNumber: 'KQ303', departureTime: '10:00', arrivalTime: '14:30', duration: '5h 30m', aircraft: 'Boeing 737-800', economyPrice: 15600, businessPrice: 57000, stops: 0 },

  // NBO ↔ JNB — ~4h direct
  { origin: 'NBO', destination: 'JNB', airline: 'Kenya Airways', flightNumber: 'KQ401', departureTime: '08:00', arrivalTime: '12:00', duration: '4h 00m', aircraft: 'Boeing 787-8', economyPrice: 12600, businessPrice: 52500, stops: 0 },
  { origin: 'NBO', destination: 'JNB', airline: 'Kenya Airways', flightNumber: 'KQ403', departureTime: '20:00', arrivalTime: '00:00+1', duration: '4h 00m', aircraft: 'Boeing 737-800', economyPrice: 11400, businessPrice: 48000, stops: 0 },
  { origin: 'JNB', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ400', departureTime: '06:00', arrivalTime: '10:00', duration: '4h 00m', aircraft: 'Boeing 787-8', economyPrice: 12600, businessPrice: 52500, stops: 0 },
  { origin: 'JNB', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ402', departureTime: '17:00', arrivalTime: '21:00', duration: '4h 00m', aircraft: 'Boeing 737-800', economyPrice: 11400, businessPrice: 48000, stops: 0 },

  // NBO ↔ JFK — ~15h direct
  { origin: 'NBO', destination: 'JFK', airline: 'Kenya Airways', flightNumber: 'KQ102', departureTime: '23:59', arrivalTime: '06:59+1', duration: '15h 00m', aircraft: 'Boeing 787-8', economyPrice: 49500, businessPrice: 204000, stops: 0 },
  { origin: 'JFK', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ101', departureTime: '18:00', arrivalTime: '15:00+1', duration: '14h 00m', aircraft: 'Boeing 787-8', economyPrice: 48600, businessPrice: 201000, stops: 0 },

  // NBO ↔ CDG / AMS — ~8h
  { origin: 'NBO', destination: 'CDG', airline: 'Kenya Airways', flightNumber: 'KQ113', departureTime: '22:00', arrivalTime: '05:30+1', duration: '8h 30m', aircraft: 'Boeing 787-8', economyPrice: 23400, businessPrice: 99000, stops: 0 },
  { origin: 'CDG', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ112', departureTime: '10:00', arrivalTime: '19:30', duration: '8h 30m', aircraft: 'Boeing 787-8', economyPrice: 22800, businessPrice: 96000, stops: 0 },
  { origin: 'NBO', destination: 'AMS', airline: 'Kenya Airways', flightNumber: 'KQ115', departureTime: '21:00', arrivalTime: '04:30+1', duration: '8h 30m', aircraft: 'Boeing 787-8', economyPrice: 22500, businessPrice: 94500, stops: 0 },
  { origin: 'AMS', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ114', departureTime: '11:00', arrivalTime: '20:30', duration: '8h 30m', aircraft: 'Boeing 787-8', economyPrice: 21900, businessPrice: 91500, stops: 0 },

  // NBO ↔ DOH — codeshare via Qatar Airways / KQ
  { origin: 'NBO', destination: 'DOH', airline: 'Kenya Airways', flightNumber: 'KQ305', departureTime: '22:30', arrivalTime: '03:00+1', duration: '5h 30m', aircraft: 'Boeing 737-800', economyPrice: 16500, businessPrice: 60000, stops: 0 },

  // NBO ↔ BOM / DEL — ~5h 30m
  { origin: 'NBO', destination: 'BOM', airline: 'Kenya Airways', flightNumber: 'KQ201', departureTime: '20:30', arrivalTime: '04:00+1', duration: '5h 30m', aircraft: 'Boeing 787-8', economyPrice: 21600, businessPrice: 84000, stops: 0 },
  { origin: 'NBO', destination: 'DEL', airline: 'Kenya Airways', flightNumber: 'KQ203', departureTime: '21:30', arrivalTime: '05:30+1', duration: '6h 00m', aircraft: 'Boeing 787-8', economyPrice: 22500, businessPrice: 87000, stops: 0 },
  { origin: 'BOM', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ200', departureTime: '05:30', arrivalTime: '10:00', duration: '5h 30m', aircraft: 'Boeing 787-8', economyPrice: 21600, businessPrice: 84000, stops: 0 },
  { origin: 'DEL', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ202', departureTime: '06:30', arrivalTime: '11:30', duration: '6h 00m', aircraft: 'Boeing 787-8', economyPrice: 22500, businessPrice: 87000, stops: 0 },

  // NBO ↔ EBB / KGL / DAR / ZNZ — regional, ~1h-2h
  { origin: 'NBO', destination: 'EBB', airline: 'Kenya Airways', flightNumber: 'KQ510', departureTime: '08:00', arrivalTime: '09:30', duration: '1h 30m', aircraft: 'Embraer E190', economyPrice: 6600, businessPrice: 16500, stops: 0 },
  { origin: 'NBO', destination: 'EBB', airline: 'Kenya Airways', flightNumber: 'KQ512', departureTime: '14:00', arrivalTime: '15:30', duration: '1h 30m', aircraft: 'Embraer E190', economyPrice: 5900, businessPrice: 14400, stops: 0 },
  { origin: 'EBB', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ511', departureTime: '10:00', arrivalTime: '11:30', duration: '1h 30m', aircraft: 'Embraer E190', economyPrice: 6600, businessPrice: 16500, stops: 0 },
  { origin: 'NBO', destination: 'KGL', airline: 'Kenya Airways', flightNumber: 'KQ520', departureTime: '09:00', arrivalTime: '10:30', duration: '1h 30m', aircraft: 'Embraer E190', economyPrice: 6300, businessPrice: 15600, stops: 0 },
  { origin: 'NBO', destination: 'KGL', airline: 'Kenya Airways', flightNumber: 'KQ522', departureTime: '16:00', arrivalTime: '17:30', duration: '1h 30m', aircraft: 'Boeing 737-800', economyPrice: 6900, businessPrice: 17400, stops: 0 },
  { origin: 'KGL', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ521', departureTime: '11:00', arrivalTime: '12:30', duration: '1h 30m', aircraft: 'Embraer E190', economyPrice: 6300, businessPrice: 15600, stops: 0 },
  { origin: 'NBO', destination: 'DAR', airline: 'Kenya Airways', flightNumber: 'KQ530', departureTime: '07:00', arrivalTime: '08:20', duration: '1h 20m', aircraft: 'Boeing 737-800', economyPrice: 5400, businessPrice: 13500, stops: 0 },
  { origin: 'NBO', destination: 'DAR', airline: 'Kenya Airways', flightNumber: 'KQ534', departureTime: '13:00', arrivalTime: '14:20', duration: '1h 20m', aircraft: 'Boeing 737-800', economyPrice: 4800, businessPrice: 12000, stops: 0 },
  { origin: 'NBO', destination: 'DAR', airline: 'Kenya Airways', flightNumber: 'KQ536', departureTime: '18:00', arrivalTime: '19:20', duration: '1h 20m', aircraft: 'Embraer E190', economyPrice: 4500, businessPrice: 11400, stops: 0 },
  { origin: 'DAR', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ531', departureTime: '09:00', arrivalTime: '10:20', duration: '1h 20m', aircraft: 'Boeing 737-800', economyPrice: 5400, businessPrice: 13500, stops: 0 },
  { origin: 'NBO', destination: 'ZNZ', airline: 'Kenya Airways', flightNumber: 'KQ540', departureTime: '09:30', arrivalTime: '10:45', duration: '1h 15m', aircraft: 'Embraer E190', economyPrice: 5100, businessPrice: 12600, stops: 0 },
  { origin: 'NBO', destination: 'ZNZ', airline: 'Kenya Airways', flightNumber: 'KQ544', departureTime: '15:30', arrivalTime: '16:45', duration: '1h 15m', aircraft: 'Boeing 737-800', economyPrice: 4700, businessPrice: 11400, stops: 0 },
  { origin: 'ZNZ', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ541', departureTime: '11:15', arrivalTime: '12:30', duration: '1h 15m', aircraft: 'Embraer E190', economyPrice: 5100, businessPrice: 12600, stops: 0 },

  // NBO ↔ ADD / CAI — regional long-haul, ~4-5h
  { origin: 'NBO', destination: 'ADD', airline: 'Kenya Airways', flightNumber: 'KQ450', departureTime: '08:30', arrivalTime: '12:30', duration: '2h 00m', aircraft: 'Boeing 737-800', economyPrice: 8400, businessPrice: 22500, stops: 0 },
  { origin: 'NBO', destination: 'ADD', airline: 'Kenya Airways', flightNumber: 'KQ452', departureTime: '20:30', arrivalTime: '00:30+1', duration: '2h 00m', aircraft: 'Boeing 737-800', economyPrice: 7500, businessPrice: 20400, stops: 0 },
  { origin: 'ADD', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ451', departureTime: '13:00', arrivalTime: '17:00', duration: '2h 00m', aircraft: 'Boeing 737-800', economyPrice: 8400, businessPrice: 22500, stops: 0 },
  { origin: 'NBO', destination: 'CAI', airline: 'Kenya Airways', flightNumber: 'KQ460', departureTime: '21:00', arrivalTime: '02:30+1', duration: '4h 30m', aircraft: 'Boeing 787-8', economyPrice: 16500, businessPrice: 66000, stops: 0 },
  { origin: 'CAI', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ461', departureTime: '03:30', arrivalTime: '09:00', duration: '4h 30m', aircraft: 'Boeing 787-8', economyPrice: 16500, businessPrice: 66000, stops: 0 },

  // NBO ↔ JRO — Kilimanjaro
  { origin: 'NBO', destination: 'JRO', airline: 'Kenya Airways', flightNumber: 'KQ560', departureTime: '08:30', arrivalTime: '09:45', duration: '1h 15m', aircraft: 'Embraer E190', economyPrice: 4800, businessPrice: 12000, stops: 0 },
  { origin: 'JRO', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ561', departureTime: '10:15', arrivalTime: '11:30', duration: '1h 15m', aircraft: 'Embraer E190', economyPrice: 4800, businessPrice: 12000, stops: 0 },

  // NBO ↔ SEZ — Seychelles
  { origin: 'NBO', destination: 'SEZ', airline: 'Kenya Airways', flightNumber: 'KQ570', departureTime: '10:00', arrivalTime: '12:00', duration: '2h 00m', aircraft: 'Boeing 737-800', economyPrice: 10500, businessPrice: 28500, stops: 0 },
  { origin: 'SEZ', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ571', departureTime: '13:00', arrivalTime: '15:00', duration: '2h 00m', aircraft: 'Boeing 737-800', economyPrice: 10500, businessPrice: 28500, stops: 0 },

  // NBO ↔ MRU — Mauritius
  { origin: 'NBO', destination: 'MRU', airline: 'Kenya Airways', flightNumber: 'KQ580', departureTime: '09:00', arrivalTime: '13:00', duration: '4h 00m', aircraft: 'Boeing 787-8', economyPrice: 20400, businessPrice: 78000, stops: 0 },
  { origin: 'MRU', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ581', departureTime: '14:00', arrivalTime: '18:00', duration: '4h 00m', aircraft: 'Boeing 787-8', economyPrice: 20400, businessPrice: 78000, stops: 0 },

  // NBO ↔ CPT — Cape Town via JNB often, occasional direct
  { origin: 'NBO', destination: 'CPT', airline: 'Kenya Airways', flightNumber: 'KQ405', departureTime: '08:30', arrivalTime: '14:30', duration: '5h 00m', aircraft: 'Boeing 737-800', economyPrice: 14400, businessPrice: 58500, stops: 1 },

  // NBO ↔ CAN / BKK / SIN — long-haul via codeshare
  { origin: 'NBO', destination: 'CAN', airline: 'Kenya Airways', flightNumber: 'KQ880', departureTime: '08:00', arrivalTime: '22:00', duration: '11h 00m', aircraft: 'Boeing 787-8', economyPrice: 28500, businessPrice: 114000, stops: 0 },
  { origin: 'NBO', destination: 'SIN', airline: 'Kenya Airways', flightNumber: 'KQ882', departureTime: '21:00', arrivalTime: '11:00+1', duration: '11h 00m', aircraft: 'Boeing 787-8', economyPrice: 33000, businessPrice: 126000, stops: 0 },
  { origin: 'NBO', destination: 'BKK', airline: 'Kenya Airways', flightNumber: 'KQ886', departureTime: '22:00', arrivalTime: '10:00+1', duration: '10h 00m', aircraft: 'Boeing 787-8', economyPrice: 29400, businessPrice: 117000, stops: 0 },
  { origin: 'NBO', destination: 'HKG', airline: 'Kenya Airways', flightNumber: 'KQ884', departureTime: '23:00', arrivalTime: '15:00+1', duration: '11h 00m', aircraft: 'Boeing 787-8', economyPrice: 31500, businessPrice: 123000, stops: 0 },

  // NBO ↔ NBO domestic routes (KIS, EDL)
  { origin: 'NBO', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ620', departureTime: '07:00', arrivalTime: '08:15', duration: '1h 15m', aircraft: 'Embraer E190', economyPrice: 2300, businessPrice: 5400, stops: 0 },
  { origin: 'NBO', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ622', departureTime: '13:00', arrivalTime: '14:15', duration: '1h 15m', aircraft: 'Embraer E190', economyPrice: 2100, businessPrice: 5100, stops: 0 },
  { origin: 'KIS', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ621', departureTime: '09:00', arrivalTime: '10:15', duration: '1h 15m', aircraft: 'Embraer E190', economyPrice: 2300, businessPrice: 5400, stops: 0 },
  { origin: 'NBO', destination: 'EDL', airline: 'Kenya Airways', flightNumber: 'KQ630', departureTime: '08:30', arrivalTime: '10:00', duration: '1h 30m', aircraft: 'Boeing 737-800', economyPrice: 2700, businessPrice: 6600, stops: 0 },
  { origin: 'EDL', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ631', departureTime: '10:30', arrivalTime: '12:00', duration: '1h 30m', aircraft: 'Boeing 737-800', economyPrice: 2700, businessPrice: 6600, stops: 0 },

  // NBO ↔ ACC — West Africa
  { origin: 'NBO', destination: 'ACC', airline: 'Kenya Airways', flightNumber: 'KQ490', departureTime: '21:00', arrivalTime: '01:00+1', duration: '6h 00m', aircraft: 'Boeing 787-8', economyPrice: 21600, businessPrice: 85500, stops: 0 },

  // NBO ↔ LOS — Nigeria
  { origin: 'NBO', destination: 'LOS', airline: 'Kenya Airways', flightNumber: 'KQ492', departureTime: '22:00', arrivalTime: '04:00+1', duration: '6h 00m', aircraft: 'Boeing 737-800', economyPrice: 22500, businessPrice: 88500, stops: 0 },

  // NBO ↔ FRA — Germany
  { origin: 'NBO', destination: 'FRA', airline: 'Kenya Airways', flightNumber: 'KQ117', departureTime: '21:30', arrivalTime: '05:30+1', duration: '8h 00m', aircraft: 'Boeing 787-8', economyPrice: 24000, businessPrice: 102000, stops: 0 },

  // NBO ↔ ZRH — Switzerland
  { origin: 'NBO', destination: 'ZRH', airline: 'Kenya Airways', flightNumber: 'KQ119', departureTime: '20:30', arrivalTime: '04:30+1', duration: '8h 00m', aircraft: 'Boeing 787-8', economyPrice: 24600, businessPrice: 103500, stops: 0 },

  // NBO ↔ FCO — Rome
  { origin: 'NBO', destination: 'FCO', airline: 'Kenya Airways', flightNumber: 'KQ121', departureTime: '22:00', arrivalTime: '06:00+1', duration: '8h 00m', aircraft: 'Boeing 787-8', economyPrice: 23700, businessPrice: 100500, stops: 0 },

  // NBO ↔ MAD — Madrid
  { origin: 'NBO', destination: 'MAD', airline: 'Kenya Airways', flightNumber: 'KQ123', departureTime: '21:00', arrivalTime: '05:00+1', duration: '8h 00m', aircraft: 'Boeing 787-8', economyPrice: 23100, businessPrice: 97500, stops: 0 },

  // NBO ↔ IST — Istanbul
  { origin: 'NBO', destination: 'IST', airline: 'Kenya Airways', flightNumber: 'KQ125', departureTime: '22:30', arrivalTime: '05:30+1', duration: '7h 00m', aircraft: 'Boeing 787-8', economyPrice: 20400, businessPrice: 82500, stops: 0 },

  // NBO ↔ YYZ — Toronto (seasonal)
  { origin: 'NBO', destination: 'YYZ', airline: 'Kenya Airways', flightNumber: 'KQ104', departureTime: '22:00', arrivalTime: '06:00+1', duration: '14h 00m', aircraft: 'Boeing 787-8', economyPrice: 46500, businessPrice: 186000, stops: 0 },

  // NBO ↔ CMN — Casablanca
  { origin: 'NBO', destination: 'CMN', airline: 'Kenya Airways', flightNumber: 'KQ130', departureTime: '20:00', arrivalTime: '03:30+1', duration: '7h 30m', aircraft: 'Boeing 787-8', economyPrice: 19500, businessPrice: 78000, stops: 0 },

  // NBO ↔ JED / RUH
  { origin: 'NBO', destination: 'JED', airline: 'Kenya Airways', flightNumber: 'KQ310', departureTime: '22:30', arrivalTime: '03:30+1', duration: '5h 00m', aircraft: 'Boeing 787-8', economyPrice: 16500, businessPrice: 64500, stops: 0 },
  { origin: 'NBO', destination: 'RUH', airline: 'Kenya Airways', flightNumber: 'KQ312', departureTime: '22:00', arrivalTime: '05:00+1', duration: '5h 00m', aircraft: 'Boeing 737-800', economyPrice: 15900, businessPrice: 61500, stops: 0 },

  // NBO ↔ AUH — Abu Dhabi
  { origin: 'NBO', destination: 'AUH', airline: 'Kenya Airways', flightNumber: 'KQ307', departureTime: '21:00', arrivalTime: '03:00+1', duration: '5h 00m', aircraft: 'Boeing 787-8', economyPrice: 16200, businessPrice: 62400, stops: 0 },

  // NBO ↔ HRE — Harare
  { origin: 'NBO', destination: 'HRE', airline: 'Kenya Airways', flightNumber: 'KQ470', departureTime: '08:00', arrivalTime: '10:00', duration: '2h 00m', aircraft: 'Boeing 737-800', economyPrice: 8700, businessPrice: 23400, stops: 0 },
  { origin: 'HRE', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ471', departureTime: '11:00', arrivalTime: '13:00', duration: '2h 00m', aircraft: 'Boeing 737-800', economyPrice: 8700, businessPrice: 23400, stops: 0 },

  // NBO ↔ LUN — Lusaka
  { origin: 'NBO', destination: 'LUN', airline: 'Kenya Airways', flightNumber: 'KQ480', departureTime: '08:30', arrivalTime: '11:30', duration: '3h 00m', aircraft: 'Boeing 737-800', economyPrice: 10500, businessPrice: 28500, stops: 0 },
  { origin: 'LUN', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ481', departureTime: '12:30', arrivalTime: '15:30', duration: '3h 00m', aircraft: 'Boeing 737-800', economyPrice: 10500, businessPrice: 28500, stops: 0 },

  // NBO ↔ FIH — Kinshasa
  { origin: 'NBO', destination: 'FIH', airline: 'Kenya Airways', flightNumber: 'KQ440', departureTime: '08:00', arrivalTime: '11:30', duration: '3h 30m', aircraft: 'Boeing 737-800', economyPrice: 12600, businessPrice: 34500, stops: 0 },
  { origin: 'FIH', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ441', departureTime: '12:30', arrivalTime: '16:00', duration: '3h 30m', aircraft: 'Boeing 737-800', economyPrice: 12600, businessPrice: 34500, stops: 0 },

  // NBO ↔ LLW — Lilongwe
  { origin: 'NBO', destination: 'LLW', airline: 'Kenya Airways', flightNumber: 'KQ486', departureTime: '09:00', arrivalTime: '12:00', duration: '3h 00m', aircraft: 'Boeing 737-800', economyPrice: 9900, businessPrice: 27000, stops: 0 },

  // NBO ↔ MPM — Maputo
  { origin: 'NBO', destination: 'MPM', airline: 'Kenya Airways', flightNumber: 'KQ488', departureTime: '08:00', arrivalTime: '13:00', duration: '4h 00m', aircraft: 'Boeing 737-800', economyPrice: 13500, businessPrice: 37500, stops: 1 },

  // NBO ↔ GBE — Gaborone
  { origin: 'NBO', destination: 'GBE', airline: 'Kenya Airways', flightNumber: 'KQ406', departureTime: '08:00', arrivalTime: '14:00', duration: '5h 00m', aircraft: 'Boeing 737-800', economyPrice: 15000, businessPrice: 54000, stops: 1 },

  // ══════════════════════════════════════════════════════════════════════════
  // MISSING RETURN FLIGHTS (existing outbound had no matching return)
  // ══════════════════════════════════════════════════════════════════════════

  // CPT → NBO return
  { origin: 'CPT', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ404', departureTime: '15:30', arrivalTime: '21:30', duration: '5h 00m', aircraft: 'Boeing 737-800', economyPrice: 14400, businessPrice: 58500, stops: 1 },
  // CAN → NBO return
  { origin: 'CAN', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ881', departureTime: '23:30', arrivalTime: '06:30+1', duration: '11h 00m', aircraft: 'Boeing 787-8', economyPrice: 28500, businessPrice: 114000, stops: 0 },
  // SIN → NBO return
  { origin: 'SIN', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ883', departureTime: '12:30', arrivalTime: '17:30', duration: '11h 00m', aircraft: 'Boeing 787-8', economyPrice: 33000, businessPrice: 126000, stops: 0 },
  // BKK → NBO return
  { origin: 'BKK', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ887', departureTime: '11:30', arrivalTime: '16:30', duration: '10h 00m', aircraft: 'Boeing 787-8', economyPrice: 29400, businessPrice: 117000, stops: 0 },
  // HKG → NBO return
  { origin: 'HKG', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ885', departureTime: '16:30', arrivalTime: '22:00', duration: '11h 30m', aircraft: 'Boeing 787-8', economyPrice: 31500, businessPrice: 123000, stops: 0 },
  // ACC → NBO return
  { origin: 'ACC', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ491', departureTime: '02:00', arrivalTime: '08:00', duration: '6h 00m', aircraft: 'Boeing 787-8', economyPrice: 21600, businessPrice: 85500, stops: 0 },
  // LOS → NBO return
  { origin: 'LOS', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ493', departureTime: '05:00', arrivalTime: '11:00', duration: '6h 00m', aircraft: 'Boeing 737-800', economyPrice: 22500, businessPrice: 88500, stops: 0 },
  // DOH → NBO return
  { origin: 'DOH', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ306', departureTime: '04:00', arrivalTime: '08:30', duration: '5h 30m', aircraft: 'Boeing 737-800', economyPrice: 16500, businessPrice: 60000, stops: 0 },
  // LLW → NBO return
  { origin: 'LLW', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ487', departureTime: '13:00', arrivalTime: '16:00', duration: '3h 00m', aircraft: 'Boeing 737-800', economyPrice: 9900, businessPrice: 27000, stops: 0 },
  // MPM → NBO return
  { origin: 'MPM', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ489', departureTime: '14:00', arrivalTime: '18:00', duration: '4h 00m', aircraft: 'Boeing 737-800', economyPrice: 13500, businessPrice: 37500, stops: 1 },
  // GBE → NBO return
  { origin: 'GBE', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ407', departureTime: '15:00', arrivalTime: '21:00', duration: '5h 00m', aircraft: 'Boeing 737-800', economyPrice: 15000, businessPrice: 54000, stops: 1 },
  // FRA → NBO return
  { origin: 'FRA', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ118', departureTime: '06:30', arrivalTime: '14:30', duration: '8h 00m', aircraft: 'Boeing 787-8', economyPrice: 24000, businessPrice: 102000, stops: 0 },
  // ZRH → NBO return
  { origin: 'ZRH', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ120', departureTime: '05:30', arrivalTime: '13:30', duration: '8h 00m', aircraft: 'Boeing 787-8', economyPrice: 24600, businessPrice: 103500, stops: 0 },
  // FCO → NBO return
  { origin: 'FCO', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ122', departureTime: '07:00', arrivalTime: '15:00', duration: '8h 00m', aircraft: 'Boeing 787-8', economyPrice: 23700, businessPrice: 100500, stops: 0 },
  // MAD → NBO return
  { origin: 'MAD', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ124', departureTime: '06:00', arrivalTime: '14:00', duration: '8h 00m', aircraft: 'Boeing 787-8', economyPrice: 23100, businessPrice: 97500, stops: 0 },
  // IST → NBO return
  { origin: 'IST', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ126', departureTime: '06:30', arrivalTime: '13:30', duration: '7h 00m', aircraft: 'Boeing 787-8', economyPrice: 20400, businessPrice: 82500, stops: 0 },
  // YYZ → NBO return
  { origin: 'YYZ', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ105', departureTime: '07:30', arrivalTime: '19:30', duration: '14h 00m', aircraft: 'Boeing 787-8', economyPrice: 46500, businessPrice: 186000, stops: 0 },
  // CMN → NBO return
  { origin: 'CMN', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ131', departureTime: '04:30', arrivalTime: '12:00', duration: '7h 30m', aircraft: 'Boeing 787-8', economyPrice: 19500, businessPrice: 78000, stops: 0 },
  // JED → NBO return
  { origin: 'JED', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ311', departureTime: '04:30', arrivalTime: '09:30', duration: '5h 00m', aircraft: 'Boeing 787-8', economyPrice: 16500, businessPrice: 64500, stops: 0 },
  // RUH → NBO return
  { origin: 'RUH', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ313', departureTime: '06:00', arrivalTime: '11:00', duration: '5h 00m', aircraft: 'Boeing 737-800', economyPrice: 15900, businessPrice: 61500, stops: 0 },
  // AUH → NBO return
  { origin: 'AUH', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ308', departureTime: '04:00', arrivalTime: '08:00', duration: '5h 00m', aircraft: 'Boeing 787-8', economyPrice: 16200, businessPrice: 62400, stops: 0 },
  // DAR → ZNZ regional
  { origin: 'DAR', destination: 'ZNZ', airline: 'Kenya Airways', flightNumber: 'KQ535', departureTime: '15:00', arrivalTime: '15:45', duration: '0h 45m', aircraft: 'Embraer E190', economyPrice: 3200, businessPrice: 7800, stops: 0 },
  // ZNZ → DAR regional
  { origin: 'ZNZ', destination: 'DAR', airline: 'Kenya Airways', flightNumber: 'KQ542', departureTime: '12:00', arrivalTime: '12:45', duration: '0h 45m', aircraft: 'Embraer E190', economyPrice: 3200, businessPrice: 7800, stops: 0 },
  // EBB → KGL regional
  { origin: 'EBB', destination: 'KGL', airline: 'Kenya Airways', flightNumber: 'KQ515', departureTime: '14:00', arrivalTime: '15:00', duration: '1h 00m', aircraft: 'Embraer E190', economyPrice: 5400, businessPrice: 13500, stops: 0 },
  // KGL → EBB regional
  { origin: 'KGL', destination: 'EBB', airline: 'Kenya Airways', flightNumber: 'KQ516', departureTime: '16:00', arrivalTime: '17:00', duration: '1h 00m', aircraft: 'Embraer E190', economyPrice: 5400, businessPrice: 13500, stops: 0 },

  // ══════════════════════════════════════════════════════════════════════════
  // NEW AIRPORTS — Kenya domestic (MYD, KTL, LAU)
  // ══════════════════════════════════════════════════════════════════════════

  // NBO ↔ MYD — Malindi, coastal
  { origin: 'NBO', destination: 'MYD', airline: 'Kenya Airways', flightNumber: 'KQ640', departureTime: '07:30', arrivalTime: '08:35', duration: '1h 05m', aircraft: 'Embraer E190', economyPrice: 3100, businessPrice: 7200, stops: 0 },
  { origin: 'NBO', destination: 'MYD', airline: 'Kenya Airways', flightNumber: 'KQ642', departureTime: '14:00', arrivalTime: '15:05', duration: '1h 05m', aircraft: 'Embraer E190', economyPrice: 2800, businessPrice: 6600, stops: 0 },
  { origin: 'MYD', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ641', departureTime: '09:15', arrivalTime: '10:20', duration: '1h 05m', aircraft: 'Embraer E190', economyPrice: 3100, businessPrice: 7200, stops: 0 },
  { origin: 'MYD', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ643', departureTime: '15:30', arrivalTime: '16:35', duration: '1h 05m', aircraft: 'Embraer E190', economyPrice: 2800, businessPrice: 6600, stops: 0 },
  // MBA ↔ MYD coastal shuttle
  { origin: 'MBA', destination: 'MYD', airline: 'Kenya Airways', flightNumber: 'KQ644', departureTime: '10:00', arrivalTime: '10:35', duration: '0h 35m', aircraft: 'Embraer E190', economyPrice: 2200, businessPrice: 5100, stops: 0 },
  { origin: 'MYD', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ645', departureTime: '11:00', arrivalTime: '11:35', duration: '0h 35m', aircraft: 'Embraer E190', economyPrice: 2200, businessPrice: 5100, stops: 0 },

  // NBO ↔ KTL — Kitale
  { origin: 'NBO', destination: 'KTL', airline: 'Kenya Airways', flightNumber: 'KQ650', departureTime: '08:00', arrivalTime: '09:20', duration: '1h 20m', aircraft: 'Embraer E190', economyPrice: 2500, businessPrice: 5800, stops: 0 },
  { origin: 'KTL', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ651', departureTime: '10:00', arrivalTime: '11:20', duration: '1h 20m', aircraft: 'Embraer E190', economyPrice: 2500, businessPrice: 5800, stops: 0 },
  // EDL ↔ KTL western circuit
  { origin: 'EDL', destination: 'KTL', airline: 'Kenya Airways', flightNumber: 'KQ652', departureTime: '12:30', arrivalTime: '13:00', duration: '0h 30m', aircraft: 'Embraer E190', economyPrice: 1800, businessPrice: 4200, stops: 0 },
  { origin: 'KTL', destination: 'EDL', airline: 'Kenya Airways', flightNumber: 'KQ653', departureTime: '13:30', arrivalTime: '14:00', duration: '0h 30m', aircraft: 'Embraer E190', economyPrice: 1800, businessPrice: 4200, stops: 0 },

  // NBO ↔ LAU — Lamu
  { origin: 'NBO', destination: 'LAU', airline: 'Kenya Airways', flightNumber: 'KQ660', departureTime: '07:00', arrivalTime: '08:20', duration: '1h 20m', aircraft: 'Embraer E190', economyPrice: 3400, businessPrice: 7800, stops: 0 },
  { origin: 'NBO', destination: 'LAU', airline: 'Kenya Airways', flightNumber: 'KQ662', departureTime: '13:30', arrivalTime: '14:50', duration: '1h 20m', aircraft: 'Embraer E190', economyPrice: 3100, businessPrice: 7200, stops: 0 },
  { origin: 'LAU', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ661', departureTime: '09:00', arrivalTime: '10:20', duration: '1h 20m', aircraft: 'Embraer E190', economyPrice: 3400, businessPrice: 7800, stops: 0 },
  { origin: 'LAU', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ663', departureTime: '15:30', arrivalTime: '16:50', duration: '1h 20m', aircraft: 'Embraer E190', economyPrice: 3100, businessPrice: 7200, stops: 0 },
  // MBA ↔ LAU coastal
  { origin: 'MBA', destination: 'LAU', airline: 'Kenya Airways', flightNumber: 'KQ664', departureTime: '09:30', arrivalTime: '10:10', duration: '0h 40m', aircraft: 'Embraer E190', economyPrice: 2600, businessPrice: 6000, stops: 0 },
  { origin: 'LAU', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ665', departureTime: '11:00', arrivalTime: '11:40', duration: '0h 40m', aircraft: 'Embraer E190', economyPrice: 2600, businessPrice: 6000, stops: 0 },

  // ══════════════════════════════════════════════════════════════════════════
  // NEW AIRPORTS — Tanzania (ARK, DOD, MWZ)
  // ══════════════════════════════════════════════════════════════════════════

  // NBO ↔ ARK — Arusha
  { origin: 'NBO', destination: 'ARK', airline: 'Kenya Airways', flightNumber: 'KQ550', departureTime: '07:00', arrivalTime: '08:00', duration: '1h 00m', aircraft: 'Embraer E190', economyPrice: 4200, businessPrice: 10500, stops: 0 },
  { origin: 'NBO', destination: 'ARK', airline: 'Kenya Airways', flightNumber: 'KQ552', departureTime: '14:00', arrivalTime: '15:00', duration: '1h 00m', aircraft: 'Embraer E190', economyPrice: 3900, businessPrice: 9600, stops: 0 },
  { origin: 'ARK', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ551', departureTime: '08:45', arrivalTime: '09:45', duration: '1h 00m', aircraft: 'Embraer E190', economyPrice: 4200, businessPrice: 10500, stops: 0 },
  { origin: 'ARK', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ553', departureTime: '15:30', arrivalTime: '16:30', duration: '1h 00m', aircraft: 'Embraer E190', economyPrice: 3900, businessPrice: 9600, stops: 0 },
  // JRO ↔ ARK shuttle
  { origin: 'JRO', destination: 'ARK', airline: 'Kenya Airways', flightNumber: 'KQ554', departureTime: '12:00', arrivalTime: '12:20', duration: '0h 20m', aircraft: 'Embraer E190', economyPrice: 2100, businessPrice: 5100, stops: 0 },
  { origin: 'ARK', destination: 'JRO', airline: 'Kenya Airways', flightNumber: 'KQ555', departureTime: '12:45', arrivalTime: '13:05', duration: '0h 20m', aircraft: 'Embraer E190', economyPrice: 2100, businessPrice: 5100, stops: 0 },
  // DAR ↔ ARK
  { origin: 'DAR', destination: 'ARK', airline: 'Kenya Airways', flightNumber: 'KQ556', departureTime: '09:00', arrivalTime: '10:00', duration: '1h 00m', aircraft: 'Embraer E190', economyPrice: 3600, businessPrice: 8700, stops: 0 },
  { origin: 'ARK', destination: 'DAR', airline: 'Kenya Airways', flightNumber: 'KQ557', departureTime: '10:30', arrivalTime: '11:30', duration: '1h 00m', aircraft: 'Embraer E190', economyPrice: 3600, businessPrice: 8700, stops: 0 },

  // NBO ↔ DOD — Dodoma
  { origin: 'NBO', destination: 'DOD', airline: 'Kenya Airways', flightNumber: 'KQ565', departureTime: '08:00', arrivalTime: '09:30', duration: '1h 30m', aircraft: 'Embraer E190', economyPrice: 4800, businessPrice: 11400, stops: 0 },
  { origin: 'DOD', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ566', departureTime: '10:15', arrivalTime: '11:45', duration: '1h 30m', aircraft: 'Embraer E190', economyPrice: 4800, businessPrice: 11400, stops: 0 },
  // DAR ↔ DOD
  { origin: 'DAR', destination: 'DOD', airline: 'Kenya Airways', flightNumber: 'KQ567', departureTime: '14:00', arrivalTime: '15:00', duration: '1h 00m', aircraft: 'Embraer E190', economyPrice: 3200, businessPrice: 7500, stops: 0 },
  { origin: 'DOD', destination: 'DAR', airline: 'Kenya Airways', flightNumber: 'KQ568', departureTime: '15:30', arrivalTime: '16:30', duration: '1h 00m', aircraft: 'Embraer E190', economyPrice: 3200, businessPrice: 7500, stops: 0 },

  // NBO ↔ MWZ — Mwanza
  { origin: 'NBO', destination: 'MWZ', airline: 'Kenya Airways', flightNumber: 'KQ575', departureTime: '07:30', arrivalTime: '09:30', duration: '2h 00m', aircraft: 'Boeing 737-800', economyPrice: 6900, businessPrice: 17400, stops: 0 },
  { origin: 'MWZ', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ576', departureTime: '10:15', arrivalTime: '12:15', duration: '2h 00m', aircraft: 'Boeing 737-800', economyPrice: 6900, businessPrice: 17400, stops: 0 },
  // DAR ↔ MWZ
  { origin: 'DAR', destination: 'MWZ', airline: 'Kenya Airways', flightNumber: 'KQ577', departureTime: '11:00', arrivalTime: '12:15', duration: '1h 15m', aircraft: 'Embraer E190', economyPrice: 4500, businessPrice: 11400, stops: 0 },
  { origin: 'MWZ', destination: 'DAR', airline: 'Kenya Airways', flightNumber: 'KQ578', departureTime: '12:45', arrivalTime: '14:00', duration: '1h 15m', aircraft: 'Embraer E190', economyPrice: 4500, businessPrice: 11400, stops: 0 },

  // ══════════════════════════════════════════════════════════════════════════
  // NEW AIRPORTS — Uganda, Rwanda, Burundi, South Sudan
  // ══════════════════════════════════════════════════════════════════════════

  // NBO ↔ KML — Kampala (via Entebbe)
  { origin: 'NBO', destination: 'KML', airline: 'Kenya Airways', flightNumber: 'KQ515', departureTime: '06:30', arrivalTime: '07:30', duration: '1h 00m', aircraft: 'Embraer E190', economyPrice: 5400, businessPrice: 13500, stops: 0 },
  { origin: 'KML', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ516', departureTime: '08:15', arrivalTime: '09:15', duration: '1h 00m', aircraft: 'Embraer E190', economyPrice: 5400, businessPrice: 13500, stops: 0 },
  // EBB ↔ KGL
  { origin: 'EBB', destination: 'KGL', airline: 'Kenya Airways', flightNumber: 'KQ517', departureTime: '14:00', arrivalTime: '15:00', duration: '1h 00m', aircraft: 'Embraer E190', economyPrice: 5400, businessPrice: 13500, stops: 0 },
  { origin: 'KGL', destination: 'EBB', airline: 'Kenya Airways', flightNumber: 'KQ518', departureTime: '16:00', arrivalTime: '17:00', duration: '1h 00m', aircraft: 'Embraer E190', economyPrice: 5400, businessPrice: 13500, stops: 0 },

  // NBO ↔ BJM — Bujumbura
  { origin: 'NBO', destination: 'BJM', airline: 'Kenya Airways', flightNumber: 'KQ525', departureTime: '07:30', arrivalTime: '09:00', duration: '1h 30m', aircraft: 'Embraer E190', economyPrice: 6300, businessPrice: 15600, stops: 0 },
  { origin: 'BJM', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ526', departureTime: '09:45', arrivalTime: '11:15', duration: '1h 30m', aircraft: 'Embraer E190', economyPrice: 6300, businessPrice: 15600, stops: 0 },
  // KGL ↔ BJM
  { origin: 'KGL', destination: 'BJM', airline: 'Kenya Airways', flightNumber: 'KQ527', departureTime: '13:00', arrivalTime: '13:45', duration: '0h 45m', aircraft: 'Embraer E190', economyPrice: 3900, businessPrice: 9600, stops: 0 },
  { origin: 'BJM', destination: 'KGL', airline: 'Kenya Airways', flightNumber: 'KQ528', departureTime: '14:30', arrivalTime: '15:15', duration: '0h 45m', aircraft: 'Embraer E190', economyPrice: 3900, businessPrice: 9600, stops: 0 },
  // EBB ↔ BJM
  { origin: 'EBB', destination: 'BJM', airline: 'Kenya Airways', flightNumber: 'KQ529', departureTime: '11:00', arrivalTime: '11:45', duration: '0h 45m', aircraft: 'Embraer E190', economyPrice: 3600, businessPrice: 8700, stops: 0 },
  { origin: 'BJM', destination: 'EBB', airline: 'Kenya Airways', flightNumber: 'KQ530', departureTime: '12:15', arrivalTime: '13:00', duration: '0h 45m', aircraft: 'Embraer E190', economyPrice: 3600, businessPrice: 8700, stops: 0 },

  // NBO ↔ JUB — Juba
  { origin: 'NBO', destination: 'JUB', airline: 'Kenya Airways', flightNumber: 'KQ455', departureTime: '07:00', arrivalTime: '09:30', duration: '2h 30m', aircraft: 'Boeing 737-800', economyPrice: 9900, businessPrice: 27000, stops: 0 },
  { origin: 'NBO', destination: 'JUB', airline: 'Kenya Airways', flightNumber: 'KQ457', departureTime: '15:00', arrivalTime: '17:30', duration: '2h 30m', aircraft: 'Boeing 737-800', economyPrice: 9000, businessPrice: 24000, stops: 0 },
  { origin: 'JUB', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ456', departureTime: '10:15', arrivalTime: '12:45', duration: '2h 30m', aircraft: 'Boeing 737-800', economyPrice: 9900, businessPrice: 27000, stops: 0 },
  { origin: 'JUB', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ458', departureTime: '18:15', arrivalTime: '20:45', duration: '2h 30m', aircraft: 'Boeing 737-800', economyPrice: 9000, businessPrice: 24000, stops: 0 },
  // EBB ↔ JUB
  { origin: 'EBB', destination: 'JUB', airline: 'Kenya Airways', flightNumber: 'KQ519', departureTime: '08:00', arrivalTime: '09:00', duration: '1h 00m', aircraft: 'Embraer E190', economyPrice: 5400, businessPrice: 13500, stops: 0 },
  { origin: 'JUB', destination: 'EBB', airline: 'Kenya Airways', flightNumber: 'KQ520', departureTime: '09:30', arrivalTime: '10:30', duration: '1h 00m', aircraft: 'Embraer E190', economyPrice: 5400, businessPrice: 13500, stops: 0 },

  // ══════════════════════════════════════════════════════════════════════════
  // NEW AIRPORTS — South Africa (DUR)
  // ══════════════════════════════════════════════════════════════════════════

  // NBO ↔ DUR — Durban
  { origin: 'NBO', destination: 'DUR', airline: 'Kenya Airways', flightNumber: 'KQ410', departureTime: '08:00', arrivalTime: '12:00', duration: '4h 00m', aircraft: 'Boeing 737-800', economyPrice: 13500, businessPrice: 51000, stops: 0 },
  { origin: 'DUR', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ411', departureTime: '13:00', arrivalTime: '17:00', duration: '4h 00m', aircraft: 'Boeing 737-800', economyPrice: 13500, businessPrice: 51000, stops: 0 },
  // JNB ↔ DUR domestic SA
  { origin: 'JNB', destination: 'DUR', airline: 'Kenya Airways', flightNumber: 'KQ412', departureTime: '07:00', arrivalTime: '08:15', duration: '1h 15m', aircraft: 'Embraer E190', economyPrice: 4200, businessPrice: 10500, stops: 0 },
  { origin: 'DUR', destination: 'JNB', airline: 'Kenya Airways', flightNumber: 'KQ413', departureTime: '09:00', arrivalTime: '10:15', duration: '1h 15m', aircraft: 'Embraer E190', economyPrice: 4200, businessPrice: 10500, stops: 0 },
  // CPT ↔ DUR
  { origin: 'CPT', destination: 'DUR', airline: 'Kenya Airways', flightNumber: 'KQ414', departureTime: '10:00', arrivalTime: '12:00', duration: '2h 00m', aircraft: 'Boeing 737-800', economyPrice: 5400, businessPrice: 13500, stops: 0 },
  { origin: 'DUR', destination: 'CPT', airline: 'Kenya Airways', flightNumber: 'KQ415', departureTime: '12:45', arrivalTime: '14:45', duration: '2h 00m', aircraft: 'Boeing 737-800', economyPrice: 5400, businessPrice: 13500, stops: 0 },

  // ══════════════════════════════════════════════════════════════════════════
  // NEW AIRPORTS — Ethiopia (DIR)
  // ══════════════════════════════════════════════════════════════════════════

  // NBO ↔ DIR — Dire Dawa
  { origin: 'NBO', destination: 'DIR', airline: 'Kenya Airways', flightNumber: 'KQ453', departureTime: '09:00', arrivalTime: '10:30', duration: '1h 30m', aircraft: 'Embraer E190', economyPrice: 6600, businessPrice: 17400, stops: 0 },
  { origin: 'DIR', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ454', departureTime: '11:15', arrivalTime: '12:45', duration: '1h 30m', aircraft: 'Embraer E190', economyPrice: 6600, businessPrice: 17400, stops: 0 },
  // ADD ↔ DIR
  { origin: 'ADD', destination: 'DIR', airline: 'Kenya Airways', flightNumber: 'KQ455', departureTime: '14:00', arrivalTime: '14:45', duration: '0h 45m', aircraft: 'Embraer E190', economyPrice: 3600, businessPrice: 8700, stops: 0 },
  { origin: 'DIR', destination: 'ADD', airline: 'Kenya Airways', flightNumber: 'KQ456', departureTime: '15:15', arrivalTime: '16:00', duration: '0h 45m', aircraft: 'Embraer E190', economyPrice: 3600, businessPrice: 8700, stops: 0 },

  // ══════════════════════════════════════════════════════════════════════════
  // NEW AIRPORTS — Indian Ocean (TNR, HAH)
  // ══════════════════════════════════════════════════════════════════════════

  // NBO ↔ TNR — Antananarivo, Madagascar
  { origin: 'NBO', destination: 'TNR', airline: 'Kenya Airways', flightNumber: 'KQ585', departureTime: '08:00', arrivalTime: '12:00', duration: '4h 00m', aircraft: 'Boeing 737-800', economyPrice: 16500, businessPrice: 54000, stops: 0 },
  { origin: 'TNR', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ586', departureTime: '13:00', arrivalTime: '17:00', duration: '4h 00m', aircraft: 'Boeing 737-800', economyPrice: 16500, businessPrice: 54000, stops: 0 },
  // MRU ↔ TNR
  { origin: 'MRU', destination: 'TNR', airline: 'Kenya Airways', flightNumber: 'KQ587', departureTime: '10:00', arrivalTime: '12:00', duration: '2h 00m', aircraft: 'Embraer E190', economyPrice: 8700, businessPrice: 23400, stops: 0 },
  { origin: 'TNR', destination: 'MRU', airline: 'Kenya Airways', flightNumber: 'KQ588', departureTime: '12:45', arrivalTime: '14:45', duration: '2h 00m', aircraft: 'Embraer E190', economyPrice: 8700, businessPrice: 23400, stops: 0 },

  // NBO ↔ HAH — Moroni, Comoros
  { origin: 'NBO', destination: 'HAH', airline: 'Kenya Airways', flightNumber: 'KQ590', departureTime: '09:00', arrivalTime: '12:00', duration: '3h 00m', aircraft: 'Boeing 737-800', economyPrice: 12600, businessPrice: 34500, stops: 0 },
  { origin: 'HAH', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ591', departureTime: '12:45', arrivalTime: '15:45', duration: '3h 00m', aircraft: 'Boeing 737-800', economyPrice: 12600, businessPrice: 34500, stops: 0 },
  // DAR ↔ HAH
  { origin: 'DAR', destination: 'HAH', airline: 'Kenya Airways', flightNumber: 'KQ592', departureTime: '14:00', arrivalTime: '15:30', duration: '1h 30m', aircraft: 'Embraer E190', economyPrice: 6300, businessPrice: 15600, stops: 0 },
  { origin: 'HAH', destination: 'DAR', airline: 'Kenya Airways', flightNumber: 'KQ593', departureTime: '16:00', arrivalTime: '17:30', duration: '1h 30m', aircraft: 'Embraer E190', economyPrice: 6300, businessPrice: 15600, stops: 0 },
  // SEZ ↔ HAH
  { origin: 'SEZ', destination: 'HAH', airline: 'Kenya Airways', flightNumber: 'KQ594', departureTime: '11:00', arrivalTime: '12:30', duration: '1h 30m', aircraft: 'Embraer E190', economyPrice: 5400, businessPrice: 13500, stops: 0 },
  { origin: 'HAH', destination: 'SEZ', airline: 'Kenya Airways', flightNumber: 'KQ595', departureTime: '13:00', arrivalTime: '14:30', duration: '1h 30m', aircraft: 'Embraer E190', economyPrice: 5400, businessPrice: 13500, stops: 0 },

  // ══════════════════════════════════════════════════════════════════════════
  // NEW AIRPORTS — Horn of Africa (JIB, MGQ)
  // ══════════════════════════════════════════════════════════════════════════

  // NBO ↔ JIB — Djibouti
  { origin: 'NBO', destination: 'JIB', airline: 'Kenya Airways', flightNumber: 'KQ465', departureTime: '08:00', arrivalTime: '10:30', duration: '2h 30m', aircraft: 'Boeing 737-800', economyPrice: 9900, businessPrice: 27000, stops: 0 },
  { origin: 'JIB', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ466', departureTime: '11:15', arrivalTime: '13:45', duration: '2h 30m', aircraft: 'Boeing 737-800', economyPrice: 9900, businessPrice: 27000, stops: 0 },
  // ADD ↔ JIB
  { origin: 'ADD', destination: 'JIB', airline: 'Kenya Airways', flightNumber: 'KQ467', departureTime: '14:00', arrivalTime: '15:00', duration: '1h 00m', aircraft: 'Embraer E190', economyPrice: 4500, businessPrice: 11400, stops: 0 },
  { origin: 'JIB', destination: 'ADD', airline: 'Kenya Airways', flightNumber: 'KQ468', departureTime: '15:30', arrivalTime: '16:30', duration: '1h 00m', aircraft: 'Embraer E190', economyPrice: 4500, businessPrice: 11400, stops: 0 },

  // NBO ↔ MGQ — Mogadishu
  { origin: 'NBO', destination: 'MGQ', airline: 'Kenya Airways', flightNumber: 'KQ475', departureTime: '07:00', arrivalTime: '09:00', duration: '2h 00m', aircraft: 'Boeing 737-800', economyPrice: 8400, businessPrice: 22500, stops: 0 },
  { origin: 'MGQ', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ476', departureTime: '09:45', arrivalTime: '11:45', duration: '2h 00m', aircraft: 'Boeing 737-800', economyPrice: 8400, businessPrice: 22500, stops: 0 },
  // EBB ↔ MGQ
  { origin: 'EBB', destination: 'MGQ', airline: 'Kenya Airways', flightNumber: 'KQ521', departureTime: '10:00', arrivalTime: '11:00', duration: '1h 00m', aircraft: 'Embraer E190', economyPrice: 4500, businessPrice: 11400, stops: 0 },
  { origin: 'MGQ', destination: 'EBB', airline: 'Kenya Airways', flightNumber: 'KQ522', departureTime: '11:30', arrivalTime: '12:30', duration: '1h 00m', aircraft: 'Embraer E190', economyPrice: 4500, businessPrice: 11400, stops: 0 },

  // ══════════════════════════════════════════════════════════════════════════
  // NEW AIRPORTS — West Africa (ABJ, DKR, ABV)
  // ══════════════════════════════════════════════════════════════════════════

  // NBO ↔ ABJ — Abidjan, Ivory Coast
  { origin: 'NBO', destination: 'ABJ', airline: 'Kenya Airways', flightNumber: 'KQ495', departureTime: '21:00', arrivalTime: '03:00+1', duration: '6h 00m', aircraft: 'Boeing 787-8', economyPrice: 22500, businessPrice: 88500, stops: 0 },
  { origin: 'ABJ', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ496', departureTime: '04:00', arrivalTime: '10:00', duration: '6h 00m', aircraft: 'Boeing 787-8', economyPrice: 22500, businessPrice: 88500, stops: 0 },
  // ACC ↔ ABJ
  { origin: 'ACC', destination: 'ABJ', airline: 'Kenya Airways', flightNumber: 'KQ497', departureTime: '14:00', arrivalTime: '15:00', duration: '1h 00m', aircraft: 'Embraer E190', economyPrice: 4500, businessPrice: 11400, stops: 0 },
  { origin: 'ABJ', destination: 'ACC', airline: 'Kenya Airways', flightNumber: 'KQ498', departureTime: '15:30', arrivalTime: '16:30', duration: '1h 00m', aircraft: 'Embraer E190', economyPrice: 4500, businessPrice: 11400, stops: 0 },
  // LOS ↔ ABJ
  { origin: 'LOS', destination: 'ABJ', airline: 'Kenya Airways', flightNumber: 'KQ499', departureTime: '11:00', arrivalTime: '12:30', duration: '1h 30m', aircraft: 'Embraer E190', economyPrice: 5400, businessPrice: 13500, stops: 0 },
  { origin: 'ABJ', destination: 'LOS', airline: 'Kenya Airways', flightNumber: 'KQ500', departureTime: '13:00', arrivalTime: '14:30', duration: '1h 30m', aircraft: 'Embraer E190', economyPrice: 5400, businessPrice: 13500, stops: 0 },

  // NBO ↔ DKR — Dakar, Senegal
  { origin: 'NBO', destination: 'DKR', airline: 'Kenya Airways', flightNumber: 'KQ505', departureTime: '20:00', arrivalTime: '04:00+1', duration: '8h 00m', aircraft: 'Boeing 787-8', economyPrice: 28500, businessPrice: 114000, stops: 0 },
  { origin: 'DKR', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ506', departureTime: '05:00', arrivalTime: '13:00', duration: '8h 00m', aircraft: 'Boeing 787-8', economyPrice: 28500, businessPrice: 114000, stops: 0 },
  // ACC ↔ DKR
  { origin: 'ACC', destination: 'DKR', airline: 'Kenya Airways', flightNumber: 'KQ507', departureTime: '16:00', arrivalTime: '18:00', duration: '2h 00m', aircraft: 'Boeing 737-800', economyPrice: 6900, businessPrice: 17400, stops: 0 },
  { origin: 'DKR', destination: 'ACC', airline: 'Kenya Airways', flightNumber: 'KQ508', departureTime: '18:45', arrivalTime: '20:45', duration: '2h 00m', aircraft: 'Boeing 737-800', economyPrice: 6900, businessPrice: 17400, stops: 0 },

  // NBO ↔ ABV — Abuja, Nigeria
  { origin: 'NBO', destination: 'ABV', airline: 'Kenya Airways', flightNumber: 'KQ501', departureTime: '21:30', arrivalTime: '02:30+1', duration: '5h 00m', aircraft: 'Boeing 737-800', economyPrice: 20400, businessPrice: 78000, stops: 0 },
  { origin: 'ABV', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ502', departureTime: '03:15', arrivalTime: '08:15', duration: '5h 00m', aircraft: 'Boeing 737-800', economyPrice: 20400, businessPrice: 78000, stops: 0 },
  // LOS ↔ ABV domestic Nigeria
  { origin: 'LOS', destination: 'ABV', airline: 'Kenya Airways', flightNumber: 'KQ503', departureTime: '08:00', arrivalTime: '09:15', duration: '1h 15m', aircraft: 'Embraer E190', economyPrice: 4200, businessPrice: 10500, stops: 0 },
  { origin: 'ABV', destination: 'LOS', airline: 'Kenya Airways', flightNumber: 'KQ504', departureTime: '10:00', arrivalTime: '11:15', duration: '1h 15m', aircraft: 'Embraer E190', economyPrice: 4200, businessPrice: 10500, stops: 0 },
  // ACC ↔ ABV
  { origin: 'ACC', destination: 'ABV', airline: 'Kenya Airways', flightNumber: 'KQ509', departureTime: '12:00', arrivalTime: '14:00', duration: '2h 00m', aircraft: 'Boeing 737-800', economyPrice: 6000, businessPrice: 15000, stops: 0 },
  { origin: 'ABV', destination: 'ACC', airline: 'Kenya Airways', flightNumber: 'KQ510', departureTime: '14:45', arrivalTime: '16:45', duration: '2h 00m', aircraft: 'Boeing 737-800', economyPrice: 6000, businessPrice: 15000, stops: 0 },

  // ══════════════════════════════════════════════════════════════════════════
  // NEW AIRPORTS — North Africa (TUN)
  // ══════════════════════════════════════════════════════════════════════════

  // NBO ↔ TUN — Tunis
  { origin: 'NBO', destination: 'TUN', airline: 'Kenya Airways', flightNumber: 'KQ135', departureTime: '21:30', arrivalTime: '04:30+1', duration: '7h 00m', aircraft: 'Boeing 787-8', economyPrice: 21600, businessPrice: 90000, stops: 0 },
  { origin: 'TUN', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ136', departureTime: '05:30', arrivalTime: '12:30', duration: '7h 00m', aircraft: 'Boeing 787-8', economyPrice: 21600, businessPrice: 90000, stops: 0 },
  // CAI ↔ TUN
  { origin: 'CAI', destination: 'TUN', airline: 'Kenya Airways', flightNumber: 'KQ137', departureTime: '10:00', arrivalTime: '12:00', duration: '2h 00m', aircraft: 'Boeing 737-800', economyPrice: 6000, businessPrice: 15000, stops: 0 },
  { origin: 'TUN', destination: 'CAI', airline: 'Kenya Airways', flightNumber: 'KQ138', departureTime: '12:45', arrivalTime: '16:45', duration: '2h 00m', aircraft: 'Boeing 737-800', economyPrice: 6000, businessPrice: 15000, stops: 0 },

  // ══════════════════════════════════════════════════════════════════════════
  // NEW AIRPORTS — India (BLR), Asia (PVG, CGK, DAC)
  // ══════════════════════════════════════════════════════════════════════════

  // NBO ↔ BLR — Bengaluru
  { origin: 'NBO', destination: 'BLR', airline: 'Kenya Airways', flightNumber: 'KQ205', departureTime: '21:00', arrivalTime: '04:30+1', duration: '5h 30m', aircraft: 'Boeing 787-8', economyPrice: 20400, businessPrice: 81000, stops: 0 },
  { origin: 'BLR', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ206', departureTime: '05:30', arrivalTime: '10:00', duration: '5h 30m', aircraft: 'Boeing 787-8', economyPrice: 20400, businessPrice: 81000, stops: 0 },
  // BOM ↔ BLR domestic India
  { origin: 'BOM', destination: 'BLR', airline: 'Kenya Airways', flightNumber: 'KQ207', departureTime: '14:00', arrivalTime: '15:30', duration: '1h 30m', aircraft: 'Boeing 737-800', economyPrice: 4500, businessPrice: 11400, stops: 0 },
  { origin: 'BLR', destination: 'BOM', airline: 'Kenya Airways', flightNumber: 'KQ208', departureTime: '16:00', arrivalTime: '17:30', duration: '1h 30m', aircraft: 'Boeing 737-800', economyPrice: 4500, businessPrice: 11400, stops: 0 },
  // DEL ↔ BLR
  { origin: 'DEL', destination: 'BLR', airline: 'Kenya Airways', flightNumber: 'KQ209', departureTime: '10:00', arrivalTime: '12:30', duration: '2h 30m', aircraft: 'Boeing 737-800', economyPrice: 5400, businessPrice: 13500, stops: 0 },
  { origin: 'BLR', destination: 'DEL', airline: 'Kenya Airways', flightNumber: 'KQ210', departureTime: '13:00', arrivalTime: '15:30', duration: '2h 30m', aircraft: 'Boeing 737-800', economyPrice: 5400, businessPrice: 13500, stops: 0 },

  // NBO ↔ PVG — Shanghai
  { origin: 'NBO', destination: 'PVG', airline: 'Kenya Airways', flightNumber: 'KQ890', departureTime: '22:00', arrivalTime: '14:00+1', duration: '12h 00m', aircraft: 'Boeing 787-8', economyPrice: 34500, businessPrice: 135000, stops: 0 },
  { origin: 'PVG', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ891', departureTime: '15:30', arrivalTime: '21:30', duration: '12h 00m', aircraft: 'Boeing 787-8', economyPrice: 34500, businessPrice: 135000, stops: 0 },
  // CAN ↔ PVG
  { origin: 'CAN', destination: 'PVG', airline: 'Kenya Airways', flightNumber: 'KQ892', departureTime: '09:00', arrivalTime: '11:30', duration: '2h 30m', aircraft: 'Boeing 737-800', economyPrice: 5400, businessPrice: 13500, stops: 0 },
  { origin: 'PVG', destination: 'CAN', airline: 'Kenya Airways', flightNumber: 'KQ893', departureTime: '12:00', arrivalTime: '14:30', duration: '2h 30m', aircraft: 'Boeing 737-800', economyPrice: 5400, businessPrice: 13500, stops: 0 },

  // NBO ↔ CGK — Jakarta
  { origin: 'NBO', destination: 'CGK', airline: 'Kenya Airways', flightNumber: 'KQ895', departureTime: '21:30', arrivalTime: '10:30+1', duration: '9h 00m', aircraft: 'Boeing 787-8', economyPrice: 31500, businessPrice: 126000, stops: 0 },
  { origin: 'CGK', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ896', departureTime: '11:30', arrivalTime: '17:30', duration: '9h 00m', aircraft: 'Boeing 787-8', economyPrice: 31500, businessPrice: 126000, stops: 0 },
  // SIN ↔ CGK
  { origin: 'SIN', destination: 'CGK', airline: 'Kenya Airways', flightNumber: 'KQ897', departureTime: '08:00', arrivalTime: '09:30', duration: '1h 30m', aircraft: 'Boeing 737-800', economyPrice: 4200, businessPrice: 10500, stops: 0 },
  { origin: 'CGK', destination: 'SIN', airline: 'Kenya Airways', flightNumber: 'KQ898', departureTime: '10:00', arrivalTime: '11:30', duration: '1h 30m', aircraft: 'Boeing 737-800', economyPrice: 4200, businessPrice: 10500, stops: 0 },

  // NBO ↔ DAC — Dhaka
  { origin: 'NBO', destination: 'DAC', airline: 'Kenya Airways', flightNumber: 'KQ215', departureTime: '22:00', arrivalTime: '05:00+1', duration: '7h 00m', aircraft: 'Boeing 787-8', economyPrice: 26400, businessPrice: 105000, stops: 0 },
  { origin: 'DAC', destination: 'NBO', airline: 'Kenya Airways', flightNumber: 'KQ216', departureTime: '06:00', arrivalTime: '11:00', duration: '7h 00m', aircraft: 'Boeing 787-8', economyPrice: 26400, businessPrice: 105000, stops: 0 },
  // DEL ↔ DAC
  { origin: 'DEL', destination: 'DAC', airline: 'Kenya Airways', flightNumber: 'KQ217', departureTime: '14:00', arrivalTime: '16:30', duration: '2h 30m', aircraft: 'Boeing 737-800', economyPrice: 5400, businessPrice: 13500, stops: 0 },
  { origin: 'DAC', destination: 'DEL', airline: 'Kenya Airways', flightNumber: 'KQ218', departureTime: '17:00', arrivalTime: '19:30', duration: '2h 30m', aircraft: 'Boeing 737-800', economyPrice: 5400, businessPrice: 13500, stops: 0 },
  // BKK ↔ DAC
  { origin: 'BKK', destination: 'DAC', airline: 'Kenya Airways', flightNumber: 'KQ888', departureTime: '11:00', arrivalTime: '13:30', duration: '2h 30m', aircraft: 'Boeing 737-800', economyPrice: 5400, businessPrice: 13500, stops: 0 },
  { origin: 'DAC', destination: 'BKK', airline: 'Kenya Airways', flightNumber: 'KQ889', departureTime: '14:00', arrivalTime: '16:30', duration: '2h 30m', aircraft: 'Boeing 737-800', economyPrice: 5400, businessPrice: 13500, stops: 0 },

  // ══════════════════════════════════════════════════════════════════════════
  // KISUMU (KIS) — ALL DESTINATIONS
  // ══════════════════════════════════════════════════════════════════════════

  // KIS ↔ MBA
  { origin: 'KIS', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ700', departureTime: '07:00', arrivalTime: '08:30', duration: '1h 30m', aircraft: 'Embraer E190', economyPrice: 3600, businessPrice: 8700, stops: 0 },
  { origin: 'KIS', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ702', departureTime: '14:00', arrivalTime: '15:30', duration: '1h 30m', aircraft: 'Embraer E190', economyPrice: 3200, businessPrice: 7500, stops: 0 },
  { origin: 'MBA', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ701', departureTime: '09:15', arrivalTime: '10:45', duration: '1h 30m', aircraft: 'Embraer E190', economyPrice: 3600, businessPrice: 8700, stops: 0 },
  { origin: 'MBA', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ703', departureTime: '16:00', arrivalTime: '17:30', duration: '1h 30m', aircraft: 'Embraer E190', economyPrice: 3200, businessPrice: 7500, stops: 0 },

  // KIS ↔ EDL
  { origin: 'KIS', destination: 'EDL', airline: 'Kenya Airways', flightNumber: 'KQ704', departureTime: '08:00', arrivalTime: '08:45', duration: '0h 45m', aircraft: 'Embraer E190', economyPrice: 2100, businessPrice: 5100, stops: 0 },
  { origin: 'EDL', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ705', departureTime: '09:30', arrivalTime: '10:15', duration: '0h 45m', aircraft: 'Embraer E190', economyPrice: 2100, businessPrice: 5100, stops: 0 },

  // KIS ↔ MYD
  { origin: 'KIS', destination: 'MYD', airline: 'Kenya Airways', flightNumber: 'KQ706', departureTime: '07:30', arrivalTime: '09:00', duration: '1h 30m', aircraft: 'Embraer E190', economyPrice: 3900, businessPrice: 9600, stops: 0 },
  { origin: 'MYD', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ707', departureTime: '09:45', arrivalTime: '11:15', duration: '1h 30m', aircraft: 'Embraer E190', economyPrice: 3900, businessPrice: 9600, stops: 0 },

  // KIS ↔ KTL
  { origin: 'KIS', destination: 'KTL', airline: 'Kenya Airways', flightNumber: 'KQ708', departureTime: '10:00', arrivalTime: '10:40', duration: '0h 40m', aircraft: 'Embraer E190', economyPrice: 1800, businessPrice: 4200, stops: 0 },
  { origin: 'KTL', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ709', departureTime: '11:15', arrivalTime: '11:55', duration: '0h 40m', aircraft: 'Embraer E190', economyPrice: 1800, businessPrice: 4200, stops: 0 },

  // KIS ↔ LAU
  { origin: 'KIS', destination: 'LAU', airline: 'Kenya Airways', flightNumber: 'KQ710', departureTime: '08:00', arrivalTime: '09:15', duration: '1h 15m', aircraft: 'Embraer E190', economyPrice: 3200, businessPrice: 7500, stops: 0 },
  { origin: 'LAU', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ711', departureTime: '09:45', arrivalTime: '11:00', duration: '1h 15m', aircraft: 'Embraer E190', economyPrice: 3200, businessPrice: 7500, stops: 0 },

  // KIS ↔ DAR
  { origin: 'KIS', destination: 'DAR', airline: 'Kenya Airways', flightNumber: 'KQ712', departureTime: '07:00', arrivalTime: '09:00', duration: '2h 00m', aircraft: 'Boeing 737-800', economyPrice: 6000, businessPrice: 15000, stops: 0 },
  { origin: 'DAR', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ713', departureTime: '09:45', arrivalTime: '11:45', duration: '2h 00m', aircraft: 'Boeing 737-800', economyPrice: 6000, businessPrice: 15000, stops: 0 },

  // KIS ↔ ZNZ
  { origin: 'KIS', destination: 'ZNZ', airline: 'Kenya Airways', flightNumber: 'KQ714', departureTime: '08:30', arrivalTime: '10:15', duration: '1h 45m', aircraft: 'Embraer E190', economyPrice: 5400, businessPrice: 13500, stops: 0 },
  { origin: 'ZNZ', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ715', departureTime: '11:00', arrivalTime: '12:45', duration: '1h 45m', aircraft: 'Embraer E190', economyPrice: 5400, businessPrice: 13500, stops: 0 },

  // KIS ↔ JRO
  { origin: 'KIS', destination: 'JRO', airline: 'Kenya Airways', flightNumber: 'KQ716', departureTime: '09:00', arrivalTime: '10:15', duration: '1h 15m', aircraft: 'Embraer E190', economyPrice: 4500, businessPrice: 11400, stops: 0 },
  { origin: 'JRO', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ717', departureTime: '10:45', arrivalTime: '12:00', duration: '1h 15m', aircraft: 'Embraer E190', economyPrice: 4500, businessPrice: 11400, stops: 0 },

  // KIS ↔ ARK
  { origin: 'KIS', destination: 'ARK', airline: 'Kenya Airways', flightNumber: 'KQ718', departureTime: '10:00', arrivalTime: '11:30', duration: '1h 30m', aircraft: 'Embraer E190', economyPrice: 4200, businessPrice: 10500, stops: 0 },
  { origin: 'ARK', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ719', departureTime: '12:00', arrivalTime: '13:30', duration: '1h 30m', aircraft: 'Embraer E190', economyPrice: 4200, businessPrice: 10500, stops: 0 },

  // KIS ↔ DOD
  { origin: 'KIS', destination: 'DOD', airline: 'Kenya Airways', flightNumber: 'KQ720', departureTime: '07:30', arrivalTime: '09:30', duration: '2h 00m', aircraft: 'Embraer E190', economyPrice: 5400, businessPrice: 13500, stops: 0 },
  { origin: 'DOD', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ721', departureTime: '10:00', arrivalTime: '12:00', duration: '2h 00m', aircraft: 'Embraer E190', economyPrice: 5400, businessPrice: 13500, stops: 0 },

  // KIS ↔ MWZ
  { origin: 'KIS', destination: 'MWZ', airline: 'Kenya Airways', flightNumber: 'KQ722', departureTime: '08:00', arrivalTime: '10:30', duration: '2h 30m', aircraft: 'Boeing 737-800', economyPrice: 7500, businessPrice: 19500, stops: 0 },
  { origin: 'MWZ', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ723', departureTime: '11:15', arrivalTime: '13:45', duration: '2h 30m', aircraft: 'Boeing 737-800', economyPrice: 7500, businessPrice: 19500, stops: 0 },

  // KIS ↔ EBB
  { origin: 'KIS', destination: 'EBB', airline: 'Kenya Airways', flightNumber: 'KQ724', departureTime: '07:00', arrivalTime: '08:30', duration: '1h 30m', aircraft: 'Embraer E190', economyPrice: 5100, businessPrice: 12600, stops: 0 },
  { origin: 'EBB', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ725', departureTime: '09:15', arrivalTime: '10:45', duration: '1h 30m', aircraft: 'Embraer E190', economyPrice: 5100, businessPrice: 12600, stops: 0 },

  // KIS ↔ KGL
  { origin: 'KIS', destination: 'KGL', airline: 'Kenya Airways', flightNumber: 'KQ726', departureTime: '08:00', arrivalTime: '09:30', duration: '1h 30m', aircraft: 'Embraer E190', economyPrice: 4800, businessPrice: 12000, stops: 0 },
  { origin: 'KGL', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ727', departureTime: '10:15', arrivalTime: '11:45', duration: '1h 30m', aircraft: 'Embraer E190', economyPrice: 4800, businessPrice: 12000, stops: 0 },

  // KIS ↔ BJM
  { origin: 'KIS', destination: 'BJM', airline: 'Kenya Airways', flightNumber: 'KQ728', departureTime: '09:00', arrivalTime: '11:00', duration: '2h 00m', aircraft: 'Embraer E190', economyPrice: 6000, businessPrice: 15000, stops: 0 },
  { origin: 'BJM', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ729', departureTime: '11:45', arrivalTime: '13:45', duration: '2h 00m', aircraft: 'Embraer E190', economyPrice: 6000, businessPrice: 15000, stops: 0 },

  // KIS ↔ JUB
  { origin: 'KIS', destination: 'JUB', airline: 'Kenya Airways', flightNumber: 'KQ730', departureTime: '07:00', arrivalTime: '09:00', duration: '2h 00m', aircraft: 'Boeing 737-800', economyPrice: 7800, businessPrice: 20400, stops: 0 },
  { origin: 'JUB', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ731', departureTime: '09:45', arrivalTime: '11:45', duration: '2h 00m', aircraft: 'Boeing 737-800', economyPrice: 7800, businessPrice: 20400, stops: 0 },

  // KIS ↔ JNB
  { origin: 'KIS', destination: 'JNB', airline: 'Kenya Airways', flightNumber: 'KQ732', departureTime: '08:00', arrivalTime: '12:00', duration: '4h 00m', aircraft: 'Boeing 737-800', economyPrice: 13500, businessPrice: 54000, stops: 1 },
  { origin: 'JNB', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ733', departureTime: '13:00', arrivalTime: '17:00', duration: '4h 00m', aircraft: 'Boeing 737-800', economyPrice: 13500, businessPrice: 54000, stops: 1 },

  // KIS ↔ CPT
  { origin: 'KIS', destination: 'CPT', airline: 'Kenya Airways', flightNumber: 'KQ734', departureTime: '07:30', arrivalTime: '14:30', duration: '6h 00m', aircraft: 'Boeing 737-800', economyPrice: 15600, businessPrice: 63000, stops: 1 },
  { origin: 'CPT', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ735', departureTime: '15:30', arrivalTime: '22:30', duration: '6h 00m', aircraft: 'Boeing 737-800', economyPrice: 15600, businessPrice: 63000, stops: 1 },

  // KIS ↔ DUR
  { origin: 'KIS', destination: 'DUR', airline: 'Kenya Airways', flightNumber: 'KQ736', departureTime: '08:00', arrivalTime: '13:00', duration: '4h 00m', aircraft: 'Boeing 737-800', economyPrice: 14400, businessPrice: 57000, stops: 1 },
  { origin: 'DUR', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ737', departureTime: '14:00', arrivalTime: '19:00', duration: '4h 00m', aircraft: 'Boeing 737-800', economyPrice: 14400, businessPrice: 57000, stops: 1 },

  // KIS ↔ ADD
  { origin: 'KIS', destination: 'ADD', airline: 'Kenya Airways', flightNumber: 'KQ738', departureTime: '08:00', arrivalTime: '10:30', duration: '2h 30m', aircraft: 'Boeing 737-800', economyPrice: 8700, businessPrice: 23400, stops: 0 },
  { origin: 'ADD', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ739', departureTime: '11:15', arrivalTime: '13:45', duration: '2h 30m', aircraft: 'Boeing 737-800', economyPrice: 8700, businessPrice: 23400, stops: 0 },

  // KIS ↔ DIR
  { origin: 'KIS', destination: 'DIR', airline: 'Kenya Airways', flightNumber: 'KQ740', departureTime: '09:00', arrivalTime: '11:00', duration: '2h 00m', aircraft: 'Embraer E190', economyPrice: 7200, businessPrice: 18600, stops: 0 },
  { origin: 'DIR', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ741', departureTime: '11:45', arrivalTime: '13:45', duration: '2h 00m', aircraft: 'Embraer E190', economyPrice: 7200, businessPrice: 18600, stops: 0 },

  // KIS ↔ CAI
  { origin: 'KIS', destination: 'CAI', airline: 'Kenya Airways', flightNumber: 'KQ742', departureTime: '21:00', arrivalTime: '03:30+1', duration: '5h 30m', aircraft: 'Boeing 787-8', economyPrice: 17400, businessPrice: 69000, stops: 1 },
  { origin: 'CAI', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ743', departureTime: '04:30', arrivalTime: '11:00', duration: '5h 30m', aircraft: 'Boeing 787-8', economyPrice: 17400, businessPrice: 69000, stops: 1 },

  // KIS ↔ HRE
  { origin: 'KIS', destination: 'HRE', airline: 'Kenya Airways', flightNumber: 'KQ744', departureTime: '08:00', arrivalTime: '11:00', duration: '3h 00m', aircraft: 'Boeing 737-800', economyPrice: 9600, businessPrice: 25500, stops: 0 },
  { origin: 'HRE', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ745', departureTime: '11:45', arrivalTime: '14:45', duration: '3h 00m', aircraft: 'Boeing 737-800', economyPrice: 9600, businessPrice: 25500, stops: 0 },

  // KIS ↔ LUN
  { origin: 'KIS', destination: 'LUN', airline: 'Kenya Airways', flightNumber: 'KQ746', departureTime: '07:30', arrivalTime: '11:00', duration: '3h 30m', aircraft: 'Boeing 737-800', economyPrice: 11400, businessPrice: 31500, stops: 0 },
  { origin: 'LUN', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ747', departureTime: '11:45', arrivalTime: '15:15', duration: '3h 30m', aircraft: 'Boeing 737-800', economyPrice: 11400, businessPrice: 31500, stops: 0 },

  // KIS ↔ LLW
  { origin: 'KIS', destination: 'LLW', airline: 'Kenya Airways', flightNumber: 'KQ748', departureTime: '08:00', arrivalTime: '11:00', duration: '3h 00m', aircraft: 'Boeing 737-800', economyPrice: 10800, businessPrice: 29400, stops: 0 },
  { origin: 'LLW', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ749', departureTime: '11:45', arrivalTime: '14:45', duration: '3h 00m', aircraft: 'Boeing 737-800', economyPrice: 10800, businessPrice: 29400, stops: 0 },

  // KIS ↔ MPM
  { origin: 'KIS', destination: 'MPM', airline: 'Kenya Airways', flightNumber: 'KQ750', departureTime: '07:00', arrivalTime: '12:00', duration: '4h 00m', aircraft: 'Boeing 737-800', economyPrice: 14400, businessPrice: 39600, stops: 1 },
  { origin: 'MPM', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ751', departureTime: '13:00', arrivalTime: '18:00', duration: '4h 00m', aircraft: 'Boeing 737-800', economyPrice: 14400, businessPrice: 39600, stops: 1 },

  // KIS ↔ GBE
  { origin: 'KIS', destination: 'GBE', airline: 'Kenya Airways', flightNumber: 'KQ752', departureTime: '08:00', arrivalTime: '14:00', duration: '5h 00m', aircraft: 'Boeing 737-800', economyPrice: 15900, businessPrice: 57000, stops: 1 },
  { origin: 'GBE', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ753', departureTime: '15:00', arrivalTime: '21:00', duration: '5h 00m', aircraft: 'Boeing 737-800', economyPrice: 15900, businessPrice: 57000, stops: 1 },

  // KIS ↔ SEZ
  { origin: 'KIS', destination: 'SEZ', airline: 'Kenya Airways', flightNumber: 'KQ754', departureTime: '08:00', arrivalTime: '11:00', duration: '3h 00m', aircraft: 'Boeing 737-800', economyPrice: 11400, businessPrice: 31500, stops: 0 },
  { origin: 'SEZ', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ755', departureTime: '11:45', arrivalTime: '14:45', duration: '3h 00m', aircraft: 'Boeing 737-800', economyPrice: 11400, businessPrice: 31500, stops: 0 },

  // KIS ↔ MRU
  { origin: 'KIS', destination: 'MRU', airline: 'Kenya Airways', flightNumber: 'KQ756', departureTime: '07:00', arrivalTime: '12:00', duration: '4h 00m', aircraft: 'Boeing 787-8', economyPrice: 21600, businessPrice: 84000, stops: 0 },
  { origin: 'MRU', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ757', departureTime: '13:00', arrivalTime: '18:00', duration: '4h 00m', aircraft: 'Boeing 787-8', economyPrice: 21600, businessPrice: 84000, stops: 0 },

  // KIS ↔ TNR
  { origin: 'KIS', destination: 'TNR', airline: 'Kenya Airways', flightNumber: 'KQ758', departureTime: '08:00', arrivalTime: '13:00', duration: '4h 00m', aircraft: 'Boeing 737-800', economyPrice: 17400, businessPrice: 57000, stops: 0 },
  { origin: 'TNR', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ759', departureTime: '14:00', arrivalTime: '19:00', duration: '4h 00m', aircraft: 'Boeing 737-800', economyPrice: 17400, businessPrice: 57000, stops: 0 },

  // KIS ↔ HAH
  { origin: 'KIS', destination: 'HAH', airline: 'Kenya Airways', flightNumber: 'KQ760', departureTime: '09:00', arrivalTime: '12:00', duration: '3h 00m', aircraft: 'Boeing 737-800', economyPrice: 13500, businessPrice: 36600, stops: 0 },
  { origin: 'HAH', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ761', departureTime: '12:45', arrivalTime: '15:45', duration: '3h 00m', aircraft: 'Boeing 737-800', economyPrice: 13500, businessPrice: 36600, stops: 0 },

  // KIS ↔ JIB
  { origin: 'KIS', destination: 'JIB', airline: 'Kenya Airways', flightNumber: 'KQ762', departureTime: '08:00', arrivalTime: '11:00', duration: '3h 00m', aircraft: 'Boeing 737-800', economyPrice: 10800, businessPrice: 29400, stops: 0 },
  { origin: 'JIB', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ763', departureTime: '11:45', arrivalTime: '14:45', duration: '3h 00m', aircraft: 'Boeing 737-800', economyPrice: 10800, businessPrice: 29400, stops: 0 },

  // KIS ↔ MGQ
  { origin: 'KIS', destination: 'MGQ', airline: 'Kenya Airways', flightNumber: 'KQ764', departureTime: '07:00', arrivalTime: '09:00', duration: '2h 00m', aircraft: 'Boeing 737-800', economyPrice: 9000, businessPrice: 24000, stops: 0 },
  { origin: 'MGQ', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ765', departureTime: '09:45', arrivalTime: '11:45', duration: '2h 00m', aircraft: 'Boeing 737-800', economyPrice: 9000, businessPrice: 24000, stops: 0 },

  // KIS ↔ FIH
  { origin: 'KIS', destination: 'FIH', airline: 'Kenya Airways', flightNumber: 'KQ766', departureTime: '07:00', arrivalTime: '11:00', duration: '4h 00m', aircraft: 'Boeing 737-800', economyPrice: 13500, businessPrice: 36600, stops: 0 },
  { origin: 'FIH', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ767', departureTime: '11:45', arrivalTime: '15:45', duration: '4h 00m', aircraft: 'Boeing 737-800', economyPrice: 13500, businessPrice: 36600, stops: 0 },

  // KIS ↔ ABJ
  { origin: 'KIS', destination: 'ABJ', airline: 'Kenya Airways', flightNumber: 'KQ768', departureTime: '21:00', arrivalTime: '04:00+1', duration: '6h 00m', aircraft: 'Boeing 787-8', economyPrice: 23400, businessPrice: 93000, stops: 1 },
  { origin: 'ABJ', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ769', departureTime: '05:00', arrivalTime: '12:00', duration: '6h 00m', aircraft: 'Boeing 787-8', economyPrice: 23400, businessPrice: 93000, stops: 1 },

  // KIS ↔ DKR
  { origin: 'KIS', destination: 'DKR', airline: 'Kenya Airways', flightNumber: 'KQ770', departureTime: '20:00', arrivalTime: '05:00+1', duration: '8h 00m', aircraft: 'Boeing 787-8', economyPrice: 29400, businessPrice: 117000, stops: 1 },
  { origin: 'DKR', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ771', departureTime: '06:00', arrivalTime: '15:00', duration: '8h 00m', aircraft: 'Boeing 787-8', economyPrice: 29400, businessPrice: 117000, stops: 1 },

  // KIS ↔ ACC
  { origin: 'KIS', destination: 'ACC', airline: 'Kenya Airways', flightNumber: 'KQ772', departureTime: '21:00', arrivalTime: '04:00+1', duration: '6h 00m', aircraft: 'Boeing 787-8', economyPrice: 22500, businessPrice: 90000, stops: 1 },
  { origin: 'ACC', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ773', departureTime: '05:00', arrivalTime: '12:00', duration: '6h 00m', aircraft: 'Boeing 787-8', economyPrice: 22500, businessPrice: 90000, stops: 1 },

  // KIS ↔ LOS
  { origin: 'KIS', destination: 'LOS', airline: 'Kenya Airways', flightNumber: 'KQ774', departureTime: '22:00', arrivalTime: '05:00+1', duration: '6h 00m', aircraft: 'Boeing 737-800', economyPrice: 23400, businessPrice: 93000, stops: 1 },
  { origin: 'LOS', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ775', departureTime: '06:00', arrivalTime: '13:00', duration: '6h 00m', aircraft: 'Boeing 737-800', economyPrice: 23400, businessPrice: 93000, stops: 1 },

  // KIS ↔ ABV
  { origin: 'KIS', destination: 'ABV', airline: 'Kenya Airways', flightNumber: 'KQ776', departureTime: '21:30', arrivalTime: '04:30+1', duration: '6h 00m', aircraft: 'Boeing 737-800', economyPrice: 21600, businessPrice: 84000, stops: 1 },
  { origin: 'ABV', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ777', departureTime: '05:30', arrivalTime: '12:30', duration: '6h 00m', aircraft: 'Boeing 737-800', economyPrice: 21600, businessPrice: 84000, stops: 1 },

  // KIS ↔ CMN
  { origin: 'KIS', destination: 'CMN', airline: 'Kenya Airways', flightNumber: 'KQ778', departureTime: '20:00', arrivalTime: '04:30+1', duration: '7h 30m', aircraft: 'Boeing 787-8', economyPrice: 20400, businessPrice: 81000, stops: 1 },
  { origin: 'CMN', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ779', departureTime: '05:30', arrivalTime: '14:00', duration: '7h 30m', aircraft: 'Boeing 787-8', economyPrice: 20400, businessPrice: 81000, stops: 1 },

  // KIS ↔ TUN
  { origin: 'KIS', destination: 'TUN', airline: 'Kenya Airways', flightNumber: 'KQ780', departureTime: '21:00', arrivalTime: '05:00+1', duration: '7h 00m', aircraft: 'Boeing 787-8', economyPrice: 22500, businessPrice: 93000, stops: 1 },
  { origin: 'TUN', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ781', departureTime: '06:00', arrivalTime: '14:00', duration: '7h 00m', aircraft: 'Boeing 787-8', economyPrice: 22500, businessPrice: 93000, stops: 1 },

  // KIS ↔ DXB
  { origin: 'KIS', destination: 'DXB', airline: 'Kenya Airways', flightNumber: 'KQ782', departureTime: '22:00', arrivalTime: '03:30+1', duration: '4h 30m', aircraft: 'Boeing 737-800', economyPrice: 15600, businessPrice: 57000, stops: 0 },
  { origin: 'DXB', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ783', departureTime: '04:15', arrivalTime: '08:45', duration: '4h 30m', aircraft: 'Boeing 737-800', economyPrice: 15600, businessPrice: 57000, stops: 0 },

  // KIS ↔ AUH
  { origin: 'KIS', destination: 'AUH', airline: 'Kenya Airways', flightNumber: 'KQ784', departureTime: '21:00', arrivalTime: '02:00+1', duration: '4h 00m', aircraft: 'Boeing 737-800', economyPrice: 15000, businessPrice: 55500, stops: 0 },
  { origin: 'AUH', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ785', departureTime: '02:45', arrivalTime: '06:45', duration: '4h 00m', aircraft: 'Boeing 737-800', economyPrice: 15000, businessPrice: 55500, stops: 0 },

  // KIS ↔ JED
  { origin: 'KIS', destination: 'JED', airline: 'Kenya Airways', flightNumber: 'KQ786', departureTime: '22:00', arrivalTime: '03:00+1', duration: '4h 00m', aircraft: 'Boeing 737-800', economyPrice: 15600, businessPrice: 60000, stops: 0 },
  { origin: 'JED', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ787', departureTime: '03:45', arrivalTime: '07:45', duration: '4h 00m', aircraft: 'Boeing 737-800', economyPrice: 15600, businessPrice: 60000, stops: 0 },

  // KIS ↔ RUH
  { origin: 'KIS', destination: 'RUH', airline: 'Kenya Airways', flightNumber: 'KQ788', departureTime: '22:00', arrivalTime: '04:00+1', duration: '5h 00m', aircraft: 'Boeing 737-800', economyPrice: 15000, businessPrice: 57000, stops: 0 },
  { origin: 'RUH', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ789', departureTime: '04:45', arrivalTime: '09:45', duration: '5h 00m', aircraft: 'Boeing 737-800', economyPrice: 15000, businessPrice: 57000, stops: 0 },

  // KIS ↔ DOH
  { origin: 'KIS', destination: 'DOH', airline: 'Kenya Airways', flightNumber: 'KQ790', departureTime: '22:30', arrivalTime: '03:00+1', duration: '3h 30m', aircraft: 'Boeing 737-800', economyPrice: 14400, businessPrice: 54000, stops: 0 },
  { origin: 'DOH', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ791', departureTime: '03:45', arrivalTime: '07:15', duration: '3h 30m', aircraft: 'Boeing 737-800', economyPrice: 14400, businessPrice: 54000, stops: 0 },

  // KIS ↔ BOM
  { origin: 'KIS', destination: 'BOM', airline: 'Kenya Airways', flightNumber: 'KQ792', departureTime: '20:00', arrivalTime: '03:30+1', duration: '6h 30m', aircraft: 'Boeing 787-8', economyPrice: 22500, businessPrice: 87000, stops: 1 },
  { origin: 'BOM', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ793', departureTime: '04:30', arrivalTime: '11:00', duration: '6h 30m', aircraft: 'Boeing 787-8', economyPrice: 22500, businessPrice: 87000, stops: 1 },

  // KIS ↔ DEL
  { origin: 'KIS', destination: 'DEL', airline: 'Kenya Airways', flightNumber: 'KQ794', departureTime: '21:00', arrivalTime: '05:00+1', duration: '7h 00m', aircraft: 'Boeing 787-8', economyPrice: 23400, businessPrice: 90000, stops: 1 },
  { origin: 'DEL', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ795', departureTime: '06:00', arrivalTime: '13:00', duration: '7h 00m', aircraft: 'Boeing 787-8', economyPrice: 23400, businessPrice: 90000, stops: 1 },

  // KIS ↔ BLR
  { origin: 'KIS', destination: 'BLR', airline: 'Kenya Airways', flightNumber: 'KQ796', departureTime: '21:00', arrivalTime: '04:30+1', duration: '6h 30m', aircraft: 'Boeing 787-8', economyPrice: 21600, businessPrice: 84000, stops: 1 },
  { origin: 'BLR', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ797', departureTime: '05:30', arrivalTime: '12:00', duration: '6h 30m', aircraft: 'Boeing 787-8', economyPrice: 21600, businessPrice: 84000, stops: 1 },

  // KIS ↔ DAC
  { origin: 'KIS', destination: 'DAC', airline: 'Kenya Airways', flightNumber: 'KQ798', departureTime: '22:00', arrivalTime: '06:00+1', duration: '7h 00m', aircraft: 'Boeing 787-8', economyPrice: 27300, businessPrice: 108000, stops: 1 },
  { origin: 'DAC', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ799', departureTime: '07:00', arrivalTime: '14:00', duration: '7h 00m', aircraft: 'Boeing 787-8', economyPrice: 27300, businessPrice: 108000, stops: 1 },

  // KIS ↔ LHR
  { origin: 'KIS', destination: 'LHR', airline: 'Kenya Airways', flightNumber: 'KQ150', departureTime: '23:00', arrivalTime: '06:30+1', duration: '9h 30m', aircraft: 'Boeing 787-8', economyPrice: 27600, businessPrice: 117000, stops: 1 },
  { origin: 'LHR', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ151', departureTime: '11:00', arrivalTime: '20:30', duration: '9h 30m', aircraft: 'Boeing 787-8', economyPrice: 27000, businessPrice: 114000, stops: 1 },

  // KIS ↔ CDG
  { origin: 'KIS', destination: 'CDG', airline: 'Kenya Airways', flightNumber: 'KQ152', departureTime: '22:00', arrivalTime: '06:30+1', duration: '9h 30m', aircraft: 'Boeing 787-8', economyPrice: 24300, businessPrice: 102000, stops: 1 },
  { origin: 'CDG', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ153', departureTime: '10:00', arrivalTime: '19:30', duration: '9h 30m', aircraft: 'Boeing 787-8', economyPrice: 23700, businessPrice: 99000, stops: 1 },

  // KIS ↔ AMS
  { origin: 'KIS', destination: 'AMS', airline: 'Kenya Airways', flightNumber: 'KQ154', departureTime: '21:00', arrivalTime: '05:30+1', duration: '9h 30m', aircraft: 'Boeing 787-8', economyPrice: 23400, businessPrice: 97500, stops: 1 },
  { origin: 'AMS', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ155', departureTime: '11:00', arrivalTime: '20:30', duration: '9h 30m', aircraft: 'Boeing 787-8', economyPrice: 22800, businessPrice: 94500, stops: 1 },

  // KIS ↔ FRA
  { origin: 'KIS', destination: 'FRA', airline: 'Kenya Airways', flightNumber: 'KQ156', departureTime: '21:30', arrivalTime: '06:30+1', duration: '9h 00m', aircraft: 'Boeing 787-8', economyPrice: 24900, businessPrice: 105000, stops: 1 },
  { origin: 'FRA', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ157', departureTime: '07:30', arrivalTime: '16:30', duration: '9h 00m', aircraft: 'Boeing 787-8', economyPrice: 24900, businessPrice: 105000, stops: 1 },

  // KIS ↔ ZRH
  { origin: 'KIS', destination: 'ZRH', airline: 'Kenya Airways', flightNumber: 'KQ158', departureTime: '20:30', arrivalTime: '05:30+1', duration: '9h 00m', aircraft: 'Boeing 787-8', economyPrice: 25500, businessPrice: 106500, stops: 1 },
  { origin: 'ZRH', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ159', departureTime: '06:30', arrivalTime: '15:30', duration: '9h 00m', aircraft: 'Boeing 787-8', economyPrice: 25500, businessPrice: 106500, stops: 1 },

  // KIS ↔ FCO
  { origin: 'KIS', destination: 'FCO', airline: 'Kenya Airways', flightNumber: 'KQ160', departureTime: '22:00', arrivalTime: '07:00+1', duration: '8h 00m', aircraft: 'Boeing 787-8', economyPrice: 24600, businessPrice: 103500, stops: 1 },
  { origin: 'FCO', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ161', departureTime: '08:00', arrivalTime: '17:00', duration: '8h 00m', aircraft: 'Boeing 787-8', economyPrice: 24600, businessPrice: 103500, stops: 1 },

  // KIS ↔ MAD
  { origin: 'KIS', destination: 'MAD', airline: 'Kenya Airways', flightNumber: 'KQ162', departureTime: '21:00', arrivalTime: '06:00+1', duration: '9h 00m', aircraft: 'Boeing 787-8', economyPrice: 24000, businessPrice: 100500, stops: 1 },
  { origin: 'MAD', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ163', departureTime: '07:00', arrivalTime: '16:00', duration: '9h 00m', aircraft: 'Boeing 787-8', economyPrice: 24000, businessPrice: 100500, stops: 1 },

  // KIS ↔ IST
  { origin: 'KIS', destination: 'IST', airline: 'Kenya Airways', flightNumber: 'KQ164', departureTime: '22:30', arrivalTime: '05:30+1', duration: '6h 00m', aircraft: 'Boeing 787-8', economyPrice: 21300, businessPrice: 85500, stops: 0 },
  { origin: 'IST', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ165', departureTime: '06:30', arrivalTime: '13:30', duration: '6h 00m', aircraft: 'Boeing 787-8', economyPrice: 21300, businessPrice: 85500, stops: 0 },

  // KIS ↔ JFK
  { origin: 'KIS', destination: 'JFK', airline: 'Kenya Airways', flightNumber: 'KQ166', departureTime: '23:30', arrivalTime: '08:30+1', duration: '16h 00m', aircraft: 'Boeing 787-8', economyPrice: 51000, businessPrice: 210000, stops: 1 },
  { origin: 'JFK', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ167', departureTime: '17:00', arrivalTime: '17:00+1', duration: '16h 00m', aircraft: 'Boeing 787-8', economyPrice: 50400, businessPrice: 207000, stops: 1 },

  // KIS ↔ YYZ
  { origin: 'KIS', destination: 'YYZ', airline: 'Kenya Airways', flightNumber: 'KQ168', departureTime: '22:00', arrivalTime: '08:00+1', duration: '15h 00m', aircraft: 'Boeing 787-8', economyPrice: 48000, businessPrice: 192000, stops: 1 },
  { origin: 'YYZ', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ169', departureTime: '09:00', arrivalTime: '19:00', duration: '15h 00m', aircraft: 'Boeing 787-8', economyPrice: 48000, businessPrice: 192000, stops: 1 },

  // KIS ↔ CAN
  { origin: 'KIS', destination: 'CAN', airline: 'Kenya Airways', flightNumber: 'KQ800', departureTime: '08:00', arrivalTime: '23:00', duration: '12h 00m', aircraft: 'Boeing 787-8', economyPrice: 29400, businessPrice: 117000, stops: 1 },
  { origin: 'CAN', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ801', departureTime: '00:00', arrivalTime: '12:00', duration: '12h 00m', aircraft: 'Boeing 787-8', economyPrice: 29400, businessPrice: 117000, stops: 1 },

  // KIS ↔ SIN
  { origin: 'KIS', destination: 'SIN', airline: 'Kenya Airways', flightNumber: 'KQ802', departureTime: '21:00', arrivalTime: '12:00+1', duration: '12h 00m', aircraft: 'Boeing 787-8', economyPrice: 34200, businessPrice: 129000, stops: 1 },
  { origin: 'SIN', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ803', departureTime: '13:00', arrivalTime: '20:00', duration: '12h 00m', aircraft: 'Boeing 787-8', economyPrice: 34200, businessPrice: 129000, stops: 1 },

  // KIS ↔ BKK
  { origin: 'KIS', destination: 'BKK', airline: 'Kenya Airways', flightNumber: 'KQ804', departureTime: '22:00', arrivalTime: '11:00+1', duration: '11h 00m', aircraft: 'Boeing 787-8', economyPrice: 30600, businessPrice: 120000, stops: 1 },
  { origin: 'BKK', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ805', departureTime: '12:00', arrivalTime: '19:00', duration: '11h 00m', aircraft: 'Boeing 787-8', economyPrice: 30600, businessPrice: 120000, stops: 1 },

  // KIS ↔ HKG
  { origin: 'KIS', destination: 'HKG', airline: 'Kenya Airways', flightNumber: 'KQ806', departureTime: '23:00', arrivalTime: '15:00+1', duration: '12h 00m', aircraft: 'Boeing 787-8', economyPrice: 32400, businessPrice: 126000, stops: 1 },
  { origin: 'HKG', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ807', departureTime: '16:00', arrivalTime: '23:00', duration: '12h 00m', aircraft: 'Boeing 787-8', economyPrice: 32400, businessPrice: 126000, stops: 1 },

  // KIS ↔ PVG
  { origin: 'KIS', destination: 'PVG', airline: 'Kenya Airways', flightNumber: 'KQ808', departureTime: '22:00', arrivalTime: '14:00+1', duration: '13h 00m', aircraft: 'Boeing 787-8', economyPrice: 35700, businessPrice: 138000, stops: 1 },
  { origin: 'PVG', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ809', departureTime: '15:00', arrivalTime: '23:00', duration: '13h 00m', aircraft: 'Boeing 787-8', economyPrice: 35700, businessPrice: 138000, stops: 1 },

  // KIS ↔ CGK
  { origin: 'KIS', destination: 'CGK', airline: 'Kenya Airways', flightNumber: 'KQ810', departureTime: '21:30', arrivalTime: '11:30+1', duration: '10h 00m', aircraft: 'Boeing 787-8', economyPrice: 32700, businessPrice: 129000, stops: 1 },
  { origin: 'CGK', destination: 'KIS', airline: 'Kenya Airways', flightNumber: 'KQ811', departureTime: '12:30', arrivalTime: '19:30', duration: '10h 00m', aircraft: 'Boeing 787-8', economyPrice: 32700, businessPrice: 129000, stops: 1 },

  // ══════════════════════════════════════════════════════════════════════════
  // MOMBASA (MBA) — ALL DESTINATIONS
  // ══════════════════════════════════════════════════════════════════════════

  // MBA ↔ EDL
  { origin: 'MBA', destination: 'EDL', airline: 'Kenya Airways', flightNumber: 'KQ670', departureTime: '08:00', arrivalTime: '09:45', duration: '1h 45m', aircraft: 'Embraer E190', economyPrice: 3200, businessPrice: 7500, stops: 0 },
  { origin: 'EDL', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ671', departureTime: '10:30', arrivalTime: '12:15', duration: '1h 45m', aircraft: 'Embraer E190', economyPrice: 3200, businessPrice: 7500, stops: 0 },

  // MBA ↔ KTL
  { origin: 'MBA', destination: 'KTL', airline: 'Kenya Airways', flightNumber: 'KQ672', departureTime: '07:30', arrivalTime: '09:15', duration: '1h 45m', aircraft: 'Embraer E190', economyPrice: 3400, businessPrice: 8100, stops: 0 },
  { origin: 'KTL', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ673', departureTime: '10:00', arrivalTime: '11:45', duration: '1h 45m', aircraft: 'Embraer E190', economyPrice: 3400, businessPrice: 8100, stops: 0 },

  // MBA ↔ DAR
  { origin: 'MBA', destination: 'DAR', airline: 'Kenya Airways', flightNumber: 'KQ674', departureTime: '07:00', arrivalTime: '08:30', duration: '1h 30m', aircraft: 'Boeing 737-800', economyPrice: 5100, businessPrice: 12600, stops: 0 },
  { origin: 'DAR', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ675', departureTime: '09:15', arrivalTime: '10:45', duration: '1h 30m', aircraft: 'Boeing 737-800', economyPrice: 5100, businessPrice: 12600, stops: 0 },

  // MBA ↔ ZNZ
  { origin: 'MBA', destination: 'ZNZ', airline: 'Kenya Airways', flightNumber: 'KQ676', departureTime: '08:00', arrivalTime: '09:15', duration: '1h 15m', aircraft: 'Embraer E190', economyPrice: 4500, businessPrice: 11400, stops: 0 },
  { origin: 'ZNZ', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ677', departureTime: '10:00', arrivalTime: '11:15', duration: '1h 15m', aircraft: 'Embraer E190', economyPrice: 4500, businessPrice: 11400, stops: 0 },

  // MBA ↔ JRO
  { origin: 'MBA', destination: 'JRO', airline: 'Kenya Airways', flightNumber: 'KQ678', departureTime: '09:00', arrivalTime: '10:30', duration: '1h 30m', aircraft: 'Embraer E190', economyPrice: 4800, businessPrice: 12000, stops: 0 },
  { origin: 'JRO', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ679', departureTime: '11:15', arrivalTime: '12:45', duration: '1h 30m', aircraft: 'Embraer E190', economyPrice: 4800, businessPrice: 12000, stops: 0 },

  // MBA ↔ ARK
  { origin: 'MBA', destination: 'ARK', airline: 'Kenya Airways', flightNumber: 'KQ680', departureTime: '10:00', arrivalTime: '11:45', duration: '1h 45m', aircraft: 'Embraer E190', economyPrice: 4500, businessPrice: 11400, stops: 0 },
  { origin: 'ARK', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ681', departureTime: '12:30', arrivalTime: '14:15', duration: '1h 45m', aircraft: 'Embraer E190', economyPrice: 4500, businessPrice: 11400, stops: 0 },

  // MBA ↔ DOD
  { origin: 'MBA', destination: 'DOD', airline: 'Kenya Airways', flightNumber: 'KQ682', departureTime: '07:00', arrivalTime: '09:00', duration: '2h 00m', aircraft: 'Embraer E190', economyPrice: 5100, businessPrice: 12600, stops: 0 },
  { origin: 'DOD', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ683', departureTime: '09:45', arrivalTime: '11:45', duration: '2h 00m', aircraft: 'Embraer E190', economyPrice: 5100, businessPrice: 12600, stops: 0 },

  // MBA ↔ MWZ
  { origin: 'MBA', destination: 'MWZ', airline: 'Kenya Airways', flightNumber: 'KQ684', departureTime: '08:00', arrivalTime: '10:30', duration: '2h 30m', aircraft: 'Boeing 737-800', economyPrice: 7200, businessPrice: 18600, stops: 0 },
  { origin: 'MWZ', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ685', departureTime: '11:15', arrivalTime: '13:45', duration: '2h 30m', aircraft: 'Boeing 737-800', economyPrice: 7200, businessPrice: 18600, stops: 0 },

  // MBA ↔ EBB
  { origin: 'MBA', destination: 'EBB', airline: 'Kenya Airways', flightNumber: 'KQ686', departureTime: '07:00', arrivalTime: '09:00', duration: '2h 00m', aircraft: 'Boeing 737-800', economyPrice: 6300, businessPrice: 15600, stops: 0 },
  { origin: 'EBB', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ687', departureTime: '09:45', arrivalTime: '11:45', duration: '2h 00m', aircraft: 'Boeing 737-800', economyPrice: 6300, businessPrice: 15600, stops: 0 },

  // MBA ↔ KGL
  { origin: 'MBA', destination: 'KGL', airline: 'Kenya Airways', flightNumber: 'KQ688', departureTime: '08:00', arrivalTime: '10:00', duration: '2h 00m', aircraft: 'Boeing 737-800', economyPrice: 5700, businessPrice: 14400, stops: 0 },
  { origin: 'KGL', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ689', departureTime: '10:45', arrivalTime: '12:45', duration: '2h 00m', aircraft: 'Boeing 737-800', economyPrice: 5700, businessPrice: 14400, stops: 0 },

  // MBA ↔ BJM
  { origin: 'MBA', destination: 'BJM', airline: 'Kenya Airways', flightNumber: 'KQ690', departureTime: '09:00', arrivalTime: '11:00', duration: '2h 00m', aircraft: 'Boeing 737-800', economyPrice: 6600, businessPrice: 16500, stops: 0 },
  { origin: 'BJM', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ691', departureTime: '11:45', arrivalTime: '13:45', duration: '2h 00m', aircraft: 'Boeing 737-800', economyPrice: 6600, businessPrice: 16500, stops: 0 },

  // MBA ↔ JUB
  { origin: 'MBA', destination: 'JUB', airline: 'Kenya Airways', flightNumber: 'KQ692', departureTime: '07:00', arrivalTime: '09:30', duration: '2h 30m', aircraft: 'Boeing 737-800', economyPrice: 8400, businessPrice: 22500, stops: 0 },
  { origin: 'JUB', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ693', departureTime: '10:15', arrivalTime: '12:45', duration: '2h 30m', aircraft: 'Boeing 737-800', economyPrice: 8400, businessPrice: 22500, stops: 0 },

  // MBA ↔ JNB
  { origin: 'MBA', destination: 'JNB', airline: 'Kenya Airways', flightNumber: 'KQ694', departureTime: '08:00', arrivalTime: '12:00', duration: '4h 00m', aircraft: 'Boeing 737-800', economyPrice: 13200, businessPrice: 52500, stops: 0 },
  { origin: 'JNB', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ695', departureTime: '13:00', arrivalTime: '17:00', duration: '4h 00m', aircraft: 'Boeing 737-800', economyPrice: 13200, businessPrice: 52500, stops: 0 },

  // MBA ↔ CPT
  { origin: 'MBA', destination: 'CPT', airline: 'Kenya Airways', flightNumber: 'KQ696', departureTime: '07:30', arrivalTime: '14:30', duration: '6h 00m', aircraft: 'Boeing 737-800', economyPrice: 15300, businessPrice: 61500, stops: 1 },
  { origin: 'CPT', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ697', departureTime: '15:30', arrivalTime: '22:30', duration: '6h 00m', aircraft: 'Boeing 737-800', economyPrice: 15300, businessPrice: 61500, stops: 1 },

  // MBA ↔ DUR
  { origin: 'MBA', destination: 'DUR', airline: 'Kenya Airways', flightNumber: 'KQ698', departureTime: '08:00', arrivalTime: '13:00', duration: '4h 00m', aircraft: 'Boeing 737-800', economyPrice: 14100, businessPrice: 55500, stops: 1 },
  { origin: 'DUR', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ699', departureTime: '14:00', arrivalTime: '19:00', duration: '4h 00m', aircraft: 'Boeing 737-800', economyPrice: 14100, businessPrice: 55500, stops: 1 },

  // MBA ↔ ADD
  { origin: 'MBA', destination: 'ADD', airline: 'Kenya Airways', flightNumber: 'KQ820', departureTime: '08:00', arrivalTime: '11:00', duration: '3h 00m', aircraft: 'Boeing 737-800', economyPrice: 9000, businessPrice: 24300, stops: 0 },
  { origin: 'ADD', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ821', departureTime: '11:45', arrivalTime: '14:45', duration: '3h 00m', aircraft: 'Boeing 737-800', economyPrice: 9000, businessPrice: 24300, stops: 0 },

  // MBA ↔ DIR
  { origin: 'MBA', destination: 'DIR', airline: 'Kenya Airways', flightNumber: 'KQ822', departureTime: '09:00', arrivalTime: '11:30', duration: '2h 30m', aircraft: 'Embraer E190', economyPrice: 7500, businessPrice: 19500, stops: 0 },
  { origin: 'DIR', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ823', departureTime: '12:15', arrivalTime: '14:45', duration: '2h 30m', aircraft: 'Embraer E190', economyPrice: 7500, businessPrice: 19500, stops: 0 },

  // MBA ↔ CAI
  { origin: 'MBA', destination: 'CAI', airline: 'Kenya Airways', flightNumber: 'KQ824', departureTime: '21:00', arrivalTime: '03:30+1', duration: '5h 30m', aircraft: 'Boeing 787-8', economyPrice: 17100, businessPrice: 67500, stops: 1 },
  { origin: 'CAI', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ825', departureTime: '04:30', arrivalTime: '11:00', duration: '5h 30m', aircraft: 'Boeing 787-8', economyPrice: 17100, businessPrice: 67500, stops: 1 },

  // MBA ↔ HRE
  { origin: 'MBA', destination: 'HRE', airline: 'Kenya Airways', flightNumber: 'KQ826', departureTime: '08:00', arrivalTime: '11:30', duration: '3h 30m', aircraft: 'Boeing 737-800', economyPrice: 9900, businessPrice: 26400, stops: 0 },
  { origin: 'HRE', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ827', departureTime: '12:15', arrivalTime: '15:45', duration: '3h 30m', aircraft: 'Boeing 737-800', economyPrice: 9900, businessPrice: 26400, stops: 0 },

  // MBA ↔ LUN
  { origin: 'MBA', destination: 'LUN', airline: 'Kenya Airways', flightNumber: 'KQ828', departureTime: '07:30', arrivalTime: '11:30', duration: '4h 00m', aircraft: 'Boeing 737-800', economyPrice: 11700, businessPrice: 32400, stops: 0 },
  { origin: 'LUN', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ829', departureTime: '12:15', arrivalTime: '16:15', duration: '4h 00m', aircraft: 'Boeing 737-800', economyPrice: 11700, businessPrice: 32400, stops: 0 },

  // MBA ↔ LLW
  { origin: 'MBA', destination: 'LLW', airline: 'Kenya Airways', flightNumber: 'KQ830', departureTime: '08:00', arrivalTime: '11:30', duration: '3h 30m', aircraft: 'Boeing 737-800', economyPrice: 11100, businessPrice: 30300, stops: 0 },
  { origin: 'LLW', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ831', departureTime: '12:15', arrivalTime: '15:45', duration: '3h 30m', aircraft: 'Boeing 737-800', economyPrice: 11100, businessPrice: 30300, stops: 0 },

  // MBA ↔ MPM
  { origin: 'MBA', destination: 'MPM', airline: 'Kenya Airways', flightNumber: 'KQ832', departureTime: '07:00', arrivalTime: '12:00', duration: '4h 00m', aircraft: 'Boeing 737-800', economyPrice: 14100, businessPrice: 38700, stops: 1 },
  { origin: 'MPM', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ833', departureTime: '13:00', arrivalTime: '18:00', duration: '4h 00m', aircraft: 'Boeing 737-800', economyPrice: 14100, businessPrice: 38700, stops: 1 },

  // MBA ↔ GBE
  { origin: 'MBA', destination: 'GBE', airline: 'Kenya Airways', flightNumber: 'KQ834', departureTime: '08:00', arrivalTime: '14:00', duration: '5h 00m', aircraft: 'Boeing 737-800', economyPrice: 15600, businessPrice: 55500, stops: 1 },
  { origin: 'GBE', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ835', departureTime: '15:00', arrivalTime: '21:00', duration: '5h 00m', aircraft: 'Boeing 737-800', economyPrice: 15600, businessPrice: 55500, stops: 1 },

  // MBA ↔ SEZ
  { origin: 'MBA', destination: 'SEZ', airline: 'Kenya Airways', flightNumber: 'KQ836', departureTime: '08:00', arrivalTime: '10:30', duration: '2h 30m', aircraft: 'Boeing 737-800', economyPrice: 11100, businessPrice: 30300, stops: 0 },
  { origin: 'SEZ', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ837', departureTime: '11:15', arrivalTime: '13:45', duration: '2h 30m', aircraft: 'Boeing 737-800', economyPrice: 11100, businessPrice: 30300, stops: 0 },

  // MBA ↔ MRU
  { origin: 'MBA', destination: 'MRU', airline: 'Kenya Airways', flightNumber: 'KQ838', departureTime: '07:00', arrivalTime: '11:00', duration: '4h 00m', aircraft: 'Boeing 787-8', economyPrice: 21000, businessPrice: 81000, stops: 0 },
  { origin: 'MRU', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ839', departureTime: '12:00', arrivalTime: '16:00', duration: '4h 00m', aircraft: 'Boeing 787-8', economyPrice: 21000, businessPrice: 81000, stops: 0 },

  // MBA ↔ TNR
  { origin: 'MBA', destination: 'TNR', airline: 'Kenya Airways', flightNumber: 'KQ840', departureTime: '08:00', arrivalTime: '12:00', duration: '4h 00m', aircraft: 'Boeing 737-800', economyPrice: 17100, businessPrice: 55500, stops: 0 },
  { origin: 'TNR', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ841', departureTime: '13:00', arrivalTime: '17:00', duration: '4h 00m', aircraft: 'Boeing 737-800', economyPrice: 17100, businessPrice: 55500, stops: 0 },

  // MBA ↔ HAH
  { origin: 'MBA', destination: 'HAH', airline: 'Kenya Airways', flightNumber: 'KQ842', departureTime: '09:00', arrivalTime: '12:00', duration: '3h 00m', aircraft: 'Boeing 737-800', economyPrice: 13200, businessPrice: 35700, stops: 0 },
  { origin: 'HAH', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ843', departureTime: '12:45', arrivalTime: '15:45', duration: '3h 00m', aircraft: 'Boeing 737-800', economyPrice: 13200, businessPrice: 35700, stops: 0 },

  // MBA ↔ JIB
  { origin: 'MBA', destination: 'JIB', airline: 'Kenya Airways', flightNumber: 'KQ844', departureTime: '08:00', arrivalTime: '11:00', duration: '3h 00m', aircraft: 'Boeing 737-800', economyPrice: 10500, businessPrice: 28500, stops: 0 },
  { origin: 'JIB', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ845', departureTime: '11:45', arrivalTime: '14:45', duration: '3h 00m', aircraft: 'Boeing 737-800', economyPrice: 10500, businessPrice: 28500, stops: 0 },

  // MBA ↔ MGQ
  { origin: 'MBA', destination: 'MGQ', airline: 'Kenya Airways', flightNumber: 'KQ846', departureTime: '07:00', arrivalTime: '09:00', duration: '2h 00m', aircraft: 'Boeing 737-800', economyPrice: 8700, businessPrice: 23400, stops: 0 },
  { origin: 'MGQ', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ847', departureTime: '09:45', arrivalTime: '11:45', duration: '2h 00m', aircraft: 'Boeing 737-800', economyPrice: 8700, businessPrice: 23400, stops: 0 },

  // MBA ↔ FIH
  { origin: 'MBA', destination: 'FIH', airline: 'Kenya Airways', flightNumber: 'KQ848', departureTime: '07:00', arrivalTime: '11:00', duration: '4h 00m', aircraft: 'Boeing 737-800', economyPrice: 13200, businessPrice: 35700, stops: 0 },
  { origin: 'FIH', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ849', departureTime: '11:45', arrivalTime: '15:45', duration: '4h 00m', aircraft: 'Boeing 737-800', economyPrice: 13200, businessPrice: 35700, stops: 0 },

  // MBA ↔ ABJ
  { origin: 'MBA', destination: 'ABJ', airline: 'Kenya Airways', flightNumber: 'KQ850', departureTime: '21:00', arrivalTime: '04:00+1', duration: '6h 00m', aircraft: 'Boeing 787-8', economyPrice: 23100, businessPrice: 91500, stops: 1 },
  { origin: 'ABJ', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ851', departureTime: '05:00', arrivalTime: '12:00', duration: '6h 00m', aircraft: 'Boeing 787-8', economyPrice: 23100, businessPrice: 91500, stops: 1 },

  // MBA ↔ DKR
  { origin: 'MBA', destination: 'DKR', airline: 'Kenya Airways', flightNumber: 'KQ852', departureTime: '20:00', arrivalTime: '05:00+1', duration: '8h 00m', aircraft: 'Boeing 787-8', economyPrice: 29100, businessPrice: 115500, stops: 1 },
  { origin: 'DKR', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ853', departureTime: '06:00', arrivalTime: '15:00', duration: '8h 00m', aircraft: 'Boeing 787-8', economyPrice: 29100, businessPrice: 115500, stops: 1 },

  // MBA ↔ ACC
  { origin: 'MBA', destination: 'ACC', airline: 'Kenya Airways', flightNumber: 'KQ854', departureTime: '21:00', arrivalTime: '04:00+1', duration: '6h 00m', aircraft: 'Boeing 787-8', economyPrice: 22200, businessPrice: 88500, stops: 1 },
  { origin: 'ACC', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ855', departureTime: '05:00', arrivalTime: '12:00', duration: '6h 00m', aircraft: 'Boeing 787-8', economyPrice: 22200, businessPrice: 88500, stops: 1 },

  // MBA ↔ LOS
  { origin: 'MBA', destination: 'LOS', airline: 'Kenya Airways', flightNumber: 'KQ856', departureTime: '22:00', arrivalTime: '05:00+1', duration: '6h 00m', aircraft: 'Boeing 737-800', economyPrice: 23100, businessPrice: 91500, stops: 1 },
  { origin: 'LOS', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ857', departureTime: '06:00', arrivalTime: '13:00', duration: '6h 00m', aircraft: 'Boeing 737-800', economyPrice: 23100, businessPrice: 91500, stops: 1 },

  // MBA ↔ ABV
  { origin: 'MBA', destination: 'ABV', airline: 'Kenya Airways', flightNumber: 'KQ858', departureTime: '21:30', arrivalTime: '04:30+1', duration: '6h 00m', aircraft: 'Boeing 737-800', economyPrice: 21300, businessPrice: 82500, stops: 1 },
  { origin: 'ABV', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ859', departureTime: '05:30', arrivalTime: '12:30', duration: '6h 00m', aircraft: 'Boeing 737-800', economyPrice: 21300, businessPrice: 82500, stops: 1 },

  // MBA ↔ CMN
  { origin: 'MBA', destination: 'CMN', airline: 'Kenya Airways', flightNumber: 'KQ860', departureTime: '20:00', arrivalTime: '04:30+1', duration: '7h 30m', aircraft: 'Boeing 787-8', economyPrice: 20100, businessPrice: 79500, stops: 1 },
  { origin: 'CMN', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ861', departureTime: '05:30', arrivalTime: '14:00', duration: '7h 30m', aircraft: 'Boeing 787-8', economyPrice: 20100, businessPrice: 79500, stops: 1 },

  // MBA ↔ TUN
  { origin: 'MBA', destination: 'TUN', airline: 'Kenya Airways', flightNumber: 'KQ862', departureTime: '21:00', arrivalTime: '05:00+1', duration: '7h 00m', aircraft: 'Boeing 787-8', economyPrice: 22200, businessPrice: 91500, stops: 1 },
  { origin: 'TUN', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ863', departureTime: '06:00', arrivalTime: '14:00', duration: '7h 00m', aircraft: 'Boeing 787-8', economyPrice: 22200, businessPrice: 91500, stops: 1 },

  // MBA ↔ DXB
  { origin: 'MBA', destination: 'DXB', airline: 'Kenya Airways', flightNumber: 'KQ864', departureTime: '22:00', arrivalTime: '03:30+1', duration: '4h 30m', aircraft: 'Boeing 737-800', economyPrice: 15300, businessPrice: 55500, stops: 0 },
  { origin: 'DXB', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ865', departureTime: '04:15', arrivalTime: '08:45', duration: '4h 30m', aircraft: 'Boeing 737-800', economyPrice: 15300, businessPrice: 55500, stops: 0 },

  // MBA ↔ AUH
  { origin: 'MBA', destination: 'AUH', airline: 'Kenya Airways', flightNumber: 'KQ866', departureTime: '21:00', arrivalTime: '02:00+1', duration: '4h 00m', aircraft: 'Boeing 737-800', economyPrice: 14700, businessPrice: 54000, stops: 0 },
  { origin: 'AUH', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ867', departureTime: '02:45', arrivalTime: '06:45', duration: '4h 00m', aircraft: 'Boeing 737-800', economyPrice: 14700, businessPrice: 54000, stops: 0 },

  // MBA ↔ JED
  { origin: 'MBA', destination: 'JED', airline: 'Kenya Airways', flightNumber: 'KQ868', departureTime: '22:00', arrivalTime: '03:00+1', duration: '4h 00m', aircraft: 'Boeing 737-800', economyPrice: 15300, businessPrice: 58500, stops: 0 },
  { origin: 'JED', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ869', departureTime: '03:45', arrivalTime: '07:45', duration: '4h 00m', aircraft: 'Boeing 737-800', economyPrice: 15300, businessPrice: 58500, stops: 0 },

  // MBA ↔ RUH
  { origin: 'MBA', destination: 'RUH', airline: 'Kenya Airways', flightNumber: 'KQ870', departureTime: '22:00', arrivalTime: '04:00+1', duration: '5h 00m', aircraft: 'Boeing 737-800', economyPrice: 14700, businessPrice: 55500, stops: 0 },
  { origin: 'RUH', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ871', departureTime: '04:45', arrivalTime: '09:45', duration: '5h 00m', aircraft: 'Boeing 737-800', economyPrice: 14700, businessPrice: 55500, stops: 0 },

  // MBA ↔ DOH
  { origin: 'MBA', destination: 'DOH', airline: 'Kenya Airways', flightNumber: 'KQ872', departureTime: '22:30', arrivalTime: '03:00+1', duration: '3h 30m', aircraft: 'Boeing 737-800', economyPrice: 14100, businessPrice: 52500, stops: 0 },
  { origin: 'DOH', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ873', departureTime: '03:45', arrivalTime: '07:15', duration: '3h 30m', aircraft: 'Boeing 737-800', economyPrice: 14100, businessPrice: 52500, stops: 0 },

  // MBA ↔ BOM
  { origin: 'MBA', destination: 'BOM', airline: 'Kenya Airways', flightNumber: 'KQ874', departureTime: '20:00', arrivalTime: '03:30+1', duration: '6h 30m', aircraft: 'Boeing 787-8', economyPrice: 22200, businessPrice: 85500, stops: 1 },
  { origin: 'BOM', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ875', departureTime: '04:30', arrivalTime: '11:00', duration: '6h 30m', aircraft: 'Boeing 787-8', economyPrice: 22200, businessPrice: 85500, stops: 1 },

  // MBA ↔ DEL
  { origin: 'MBA', destination: 'DEL', airline: 'Kenya Airways', flightNumber: 'KQ876', departureTime: '21:00', arrivalTime: '05:00+1', duration: '7h 00m', aircraft: 'Boeing 787-8', economyPrice: 23100, businessPrice: 88500, stops: 1 },
  { origin: 'DEL', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ877', departureTime: '06:00', arrivalTime: '13:00', duration: '7h 00m', aircraft: 'Boeing 787-8', economyPrice: 23100, businessPrice: 88500, stops: 1 },

  // MBA ↔ BLR
  { origin: 'MBA', destination: 'BLR', airline: 'Kenya Airways', flightNumber: 'KQ878', departureTime: '21:00', arrivalTime: '04:30+1', duration: '6h 30m', aircraft: 'Boeing 787-8', economyPrice: 21300, businessPrice: 82500, stops: 1 },
  { origin: 'BLR', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ879', departureTime: '05:30', arrivalTime: '12:00', duration: '6h 30m', aircraft: 'Boeing 787-8', economyPrice: 21300, businessPrice: 82500, stops: 1 },

  // MBA ↔ DAC
  { origin: 'MBA', destination: 'DAC', airline: 'Kenya Airways', flightNumber: 'KQ900', departureTime: '22:00', arrivalTime: '06:00+1', duration: '7h 00m', aircraft: 'Boeing 787-8', economyPrice: 27000, businessPrice: 106500, stops: 1 },
  { origin: 'DAC', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ901', departureTime: '07:00', arrivalTime: '14:00', duration: '7h 00m', aircraft: 'Boeing 787-8', economyPrice: 27000, businessPrice: 106500, stops: 1 },

  // MBA ↔ LHR
  { origin: 'MBA', destination: 'LHR', airline: 'Kenya Airways', flightNumber: 'KQ250', departureTime: '23:00', arrivalTime: '06:30+1', duration: '9h 30m', aircraft: 'Boeing 787-8', economyPrice: 27300, businessPrice: 115500, stops: 1 },
  { origin: 'LHR', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ251', departureTime: '11:00', arrivalTime: '20:30', duration: '9h 30m', aircraft: 'Boeing 787-8', economyPrice: 26700, businessPrice: 112500, stops: 1 },

  // MBA ↔ CDG
  { origin: 'MBA', destination: 'CDG', airline: 'Kenya Airways', flightNumber: 'KQ252', departureTime: '22:00', arrivalTime: '06:30+1', duration: '9h 30m', aircraft: 'Boeing 787-8', economyPrice: 24000, businessPrice: 100500, stops: 1 },
  { origin: 'CDG', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ253', departureTime: '10:00', arrivalTime: '19:30', duration: '9h 30m', aircraft: 'Boeing 787-8', economyPrice: 23400, businessPrice: 97500, stops: 1 },

  // MBA ↔ AMS
  { origin: 'MBA', destination: 'AMS', airline: 'Kenya Airways', flightNumber: 'KQ254', departureTime: '21:00', arrivalTime: '05:30+1', duration: '9h 30m', aircraft: 'Boeing 787-8', economyPrice: 23100, businessPrice: 96000, stops: 1 },
  { origin: 'AMS', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ255', departureTime: '11:00', arrivalTime: '20:30', duration: '9h 30m', aircraft: 'Boeing 787-8', economyPrice: 22500, businessPrice: 93000, stops: 1 },

  // MBA ↔ FRA
  { origin: 'MBA', destination: 'FRA', airline: 'Kenya Airways', flightNumber: 'KQ256', departureTime: '21:30', arrivalTime: '06:30+1', duration: '9h 00m', aircraft: 'Boeing 787-8', economyPrice: 24600, businessPrice: 103500, stops: 1 },
  { origin: 'FRA', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ257', departureTime: '07:30', arrivalTime: '16:30', duration: '9h 00m', aircraft: 'Boeing 787-8', economyPrice: 24600, businessPrice: 103500, stops: 1 },

  // MBA ↔ ZRH
  { origin: 'MBA', destination: 'ZRH', airline: 'Kenya Airways', flightNumber: 'KQ258', departureTime: '20:30', arrivalTime: '05:30+1', duration: '9h 00m', aircraft: 'Boeing 787-8', economyPrice: 25200, businessPrice: 105000, stops: 1 },
  { origin: 'ZRH', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ259', departureTime: '06:30', arrivalTime: '15:30', duration: '9h 00m', aircraft: 'Boeing 787-8', economyPrice: 25200, businessPrice: 105000, stops: 1 },

  // MBA ↔ FCO
  { origin: 'MBA', destination: 'FCO', airline: 'Kenya Airways', flightNumber: 'KQ260', departureTime: '22:00', arrivalTime: '07:00+1', duration: '8h 00m', aircraft: 'Boeing 787-8', economyPrice: 24300, businessPrice: 102000, stops: 1 },
  { origin: 'FCO', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ261', departureTime: '08:00', arrivalTime: '17:00', duration: '8h 00m', aircraft: 'Boeing 787-8', economyPrice: 24300, businessPrice: 102000, stops: 1 },

  // MBA ↔ MAD
  { origin: 'MBA', destination: 'MAD', airline: 'Kenya Airways', flightNumber: 'KQ262', departureTime: '21:00', arrivalTime: '06:00+1', duration: '9h 00m', aircraft: 'Boeing 787-8', economyPrice: 23700, businessPrice: 99000, stops: 1 },
  { origin: 'MAD', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ263', departureTime: '07:00', arrivalTime: '16:00', duration: '9h 00m', aircraft: 'Boeing 787-8', economyPrice: 23700, businessPrice: 99000, stops: 1 },

  // MBA ↔ IST
  { origin: 'MBA', destination: 'IST', airline: 'Kenya Airways', flightNumber: 'KQ264', departureTime: '22:30', arrivalTime: '05:30+1', duration: '6h 00m', aircraft: 'Boeing 787-8', economyPrice: 21000, businessPrice: 84000, stops: 1 },
  { origin: 'IST', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ265', departureTime: '06:30', arrivalTime: '13:30', duration: '6h 00m', aircraft: 'Boeing 787-8', economyPrice: 21000, businessPrice: 84000, stops: 1 },

  // MBA ↔ JFK
  { origin: 'MBA', destination: 'JFK', airline: 'Kenya Airways', flightNumber: 'KQ266', departureTime: '23:30', arrivalTime: '08:30+1', duration: '16h 00m', aircraft: 'Boeing 787-8', economyPrice: 50700, businessPrice: 207000, stops: 1 },
  { origin: 'JFK', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ267', departureTime: '17:00', arrivalTime: '17:00+1', duration: '16h 00m', aircraft: 'Boeing 787-8', economyPrice: 49800, businessPrice: 204000, stops: 1 },

  // MBA ↔ YYZ
  { origin: 'MBA', destination: 'YYZ', airline: 'Kenya Airways', flightNumber: 'KQ268', departureTime: '22:00', arrivalTime: '08:00+1', duration: '15h 00m', aircraft: 'Boeing 787-8', economyPrice: 47700, businessPrice: 189000, stops: 1 },
  { origin: 'YYZ', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ269', departureTime: '09:00', arrivalTime: '19:00', duration: '15h 00m', aircraft: 'Boeing 787-8', economyPrice: 47700, businessPrice: 189000, stops: 1 },

  // MBA ↔ CAN
  { origin: 'MBA', destination: 'CAN', airline: 'Kenya Airways', flightNumber: 'KQ910', departureTime: '08:00', arrivalTime: '23:00', duration: '12h 00m', aircraft: 'Boeing 787-8', economyPrice: 29100, businessPrice: 115500, stops: 1 },
  { origin: 'CAN', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ911', departureTime: '00:00', arrivalTime: '12:00', duration: '12h 00m', aircraft: 'Boeing 787-8', economyPrice: 29100, businessPrice: 115500, stops: 1 },

  // MBA ↔ SIN
  { origin: 'MBA', destination: 'SIN', airline: 'Kenya Airways', flightNumber: 'KQ912', departureTime: '21:00', arrivalTime: '12:00+1', duration: '12h 00m', aircraft: 'Boeing 787-8', economyPrice: 33900, businessPrice: 127500, stops: 1 },
  { origin: 'SIN', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ913', departureTime: '13:00', arrivalTime: '20:00', duration: '12h 00m', aircraft: 'Boeing 787-8', economyPrice: 33900, businessPrice: 127500, stops: 1 },

  // MBA ↔ BKK
  { origin: 'MBA', destination: 'BKK', airline: 'Kenya Airways', flightNumber: 'KQ914', departureTime: '22:00', arrivalTime: '11:00+1', duration: '11h 00m', aircraft: 'Boeing 787-8', economyPrice: 30300, businessPrice: 118500, stops: 1 },
  { origin: 'BKK', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ915', departureTime: '12:00', arrivalTime: '19:00', duration: '11h 00m', aircraft: 'Boeing 787-8', economyPrice: 30300, businessPrice: 118500, stops: 1 },

  // MBA ↔ HKG
  { origin: 'MBA', destination: 'HKG', airline: 'Kenya Airways', flightNumber: 'KQ916', departureTime: '23:00', arrivalTime: '15:00+1', duration: '12h 00m', aircraft: 'Boeing 787-8', economyPrice: 32100, businessPrice: 124500, stops: 1 },
  { origin: 'HKG', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ917', departureTime: '16:00', arrivalTime: '23:00', duration: '12h 00m', aircraft: 'Boeing 787-8', economyPrice: 32100, businessPrice: 124500, stops: 1 },

  // MBA ↔ PVG
  { origin: 'MBA', destination: 'PVG', airline: 'Kenya Airways', flightNumber: 'KQ918', departureTime: '22:00', arrivalTime: '14:00+1', duration: '13h 00m', aircraft: 'Boeing 787-8', economyPrice: 35400, businessPrice: 136500, stops: 1 },
  { origin: 'PVG', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ919', departureTime: '15:00', arrivalTime: '23:00', duration: '13h 00m', aircraft: 'Boeing 787-8', economyPrice: 35400, businessPrice: 136500, stops: 1 },

  // MBA ↔ CGK
  { origin: 'MBA', destination: 'CGK', airline: 'Kenya Airways', flightNumber: 'KQ920', departureTime: '21:30', arrivalTime: '11:30+1', duration: '10h 00m', aircraft: 'Boeing 787-8', economyPrice: 32400, businessPrice: 127500, stops: 1 },
  { origin: 'CGK', destination: 'MBA', airline: 'Kenya Airways', flightNumber: 'KQ921', departureTime: '12:30', arrivalTime: '19:30', duration: '10h 00m', aircraft: 'Boeing 787-8', economyPrice: 32400, businessPrice: 127500, stops: 1 },
];

// Assign unique IDs
const EXPLICIT_FLIGHTS: Flight[] = CORE_FLIGHTS.map((f, i) => ({
  ...f,
  id: `FL-${f.origin}-${f.destination}-${i.toString().padStart(3, '0')}`,
}));

// Build a set of all explicitly defined route keys for fast lookup
const explicitRouteKeys = new Set<string>();
for (const f of EXPLICIT_FLIGHTS) {
  explicitRouteKeys.add(`${f.origin}-${f.destination}`);
}

// ── Approximate distances (km) between airport pairs for synthetic flights ──
// Used to generate realistic duration/price when no explicit flight exists.
const DISTANCE_KM: Record<string, number> = {
  // Kenya domestic
  'NBO-MBA': 440, 'NBO-KIS': 310, 'NBO-EDL': 260, 'NBO-MYD': 410, 'NBO-KTL': 320, 'NBO-LAU': 490,
  // Tanzania
  'NBO-DAR': 730, 'NBO-ZNZ': 680, 'NBO-JRO': 830, 'NBO-ARK': 810, 'NBO-DOD': 930, 'NBO-MWZ': 1100,
  // EAC
  'NBO-EBB': 510, 'NBO-KGL': 560, 'NBO-BJM': 620, 'NBO-JUB': 730, 'NBO-KML': 530,
  // Southern Africa
  'NBO-JNB': 2550, 'NBO-CPT': 3900, 'NBO-DUR': 3100, 'NBO-HRE': 1700, 'NBO-LUN': 1900,
  'NBO-LLW': 1600, 'NBO-MPM': 2400, 'NBO-GBE': 2800,
  // Indian Ocean
  'NBO-SEZ': 1600, 'NBO-MRU': 3000, 'NBO-TNR': 1400, 'NBO-HAH': 1200,
  // Horn of Africa
  'NBO-ADD': 1150, 'NBO-DIR': 1300, 'NBO-JIB': 1400, 'NBO-MGQ': 1100,
  // West Africa
  'NBO-FIH': 2100, 'NBO-ABJ': 4200, 'NBO-DKR': 5600, 'NBO-ACC': 4100, 'NBO-LOS': 3600, 'NBO-ABV': 3400,
  // North Africa
  'NBO-CAI': 3000, 'NBO-CMN': 5200, 'NBO-TUN': 4800,
  // Middle East
  'NBO-DXB': 4300, 'NBO-AUH': 4200, 'NBO-JED': 3300, 'NBO-RUH': 3400, 'NBO-DOH': 3800, 'NBO-IST': 4100,
  // South Asia
  'NBO-BOM': 4700, 'NBO-DEL': 5000, 'NBO-BLR': 4600, 'NBO-DAC': 5800,
  // East Asia
  'NBO-CAN': 8200, 'NBO-PVG': 8600, 'NBO-BKK': 7100, 'NBO-SIN': 7500, 'NBO-HKG': 7900, 'NBO-CGK': 7300,
  // Europe
  'NBO-LHR': 6800, 'NBO-LGW': 6800, 'NBO-CDG': 6500, 'NBO-AMS': 6700, 'NBO-FRA': 6400, 'NBO-ZRH': 6300,
  'NBO-FCO': 5600, 'NBO-MAD': 6100,
  // Americas
  'NBO-JFK': 11800, 'NBO-YYZ': 12100,
};

function getDistance(origin: string, dest: string): number {
  const key1 = `${origin}-${dest}`;
  const key2 = `${dest}-${origin}`;
  return DISTANCE_KM[key1] || DISTANCE_KM[key2] || estimateDistance(origin, dest);
}

function estimateDistance(a: string, b: string): number {
  // Fallback: hash-based pseudo-random distance between 500–13000 km
  let h = 0;
  const s = a + b;
  for (let i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i); h |= 0; }
  return 500 + ((h >>> 0) % 12500);
}

function generateSyntheticFlight(origin: string, destination: string, index: number): Flight {
  const distKm = getDistance(origin, destination);
  const durationMin = Math.round((distKm / 750) * 60); // ~750 km/h avg
  const hours = Math.floor(durationMin / 60);
  const mins = durationMin % 60;
  const duration = mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  const stops = distKm > 5000 ? 1 : 0;
  // Price: ~KES 2.5/km economy, 4x business
  const economyBase = Math.round(distKm * 2.5 / 100) * 100;
  const businessBase = economyBase * 4;
  // Departure time varies by index
  const depHour = 6 + (index * 3) % 18;
  const depMin = (index * 17) % 60;
  const departureTime = `${String(depHour).padStart(2, '0')}:${String(depMin).padStart(2, '0')}`;
  const arrHour = (depHour + hours + (mins > 30 ? 1 : 0)) % 24;
  const nextDay = (depHour + hours) >= 24;
  const arrivalTime = nextDay
    ? `${String(arrHour).padStart(2, '0')}:${String(depMin).padStart(2, '0')}+1`
    : `${String(arrHour).padStart(2, '0')}:${String(depMin).padStart(2, '0')}`;
  const aircraft = distKm < 1500 ? 'Embraer E190'
    : distKm < 5000 ? 'Boeing 737-800'
    : 'Boeing 787-8';
  const flightNum = `KQ${900 + (index % 100)}`;

  return {
    id: `FL-${origin}-${destination}-gen-${index}`,
    origin,
    destination,
    airline: 'Kenya Airways',
    flightNumber: flightNum,
    departureTime,
    arrivalTime,
    duration,
    aircraft,
    economyPrice: economyBase,
    businessPrice: businessBase,
    stops,
  };
}

const ALL_FLIGHTS: Flight[] = [...EXPLICIT_FLIGHTS];

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

  const explicit = ALL_FLIGHTS.filter(f => {
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

  // If no explicit flights found, generate synthetic ones
  if (explicit.length === 0) {
    const count = 2 + (seededRandom(origin + destination, 0) > 0.5 ? 1 : 0); // 2-3 flights
    const synthetic: Flight[] = [];
    for (let i = 0; i < count; i++) {
      const f = generateSyntheticFlight(origin.toUpperCase(), destination.toUpperCase(), i);
      const dateSeed = `${date}-${origin}-${destination}`;
      const variance = Math.round(f.economyPrice * 0.15);
      synthetic.push({
        ...f,
        economyPrice: randomPrice(f.economyPrice, variance, dateSeed, i),
        businessPrice: Math.round(randomPrice(f.economyPrice, variance, dateSeed, i) * (f.businessPrice / f.economyPrice)),
      });
    }
    return synthetic;
  }

  return explicit;
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