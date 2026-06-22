export interface Airport {
  city: string;
  country: string;
  name: string;
  iata: string;
  nearby?: boolean;
}

export const AIRPORTS: Airport[] = [
  { city: "Nairobi", country: "Kenya", name: "Jomo Kenyatta International Airport", iata: "NBO", nearby: true },
  { city: "Mombasa", country: "Kenya", name: "Moi International Airport", iata: "MBA", nearby: true },
  { city: "Kisumu", country: "Kenya", name: "Kisumu International Airport", iata: "KIS", nearby: true },
  { city: "Eldoret", country: "Kenya", name: "Eldoret International Airport", iata: "EDL", nearby: true },
  { city: "Dubai", country: "United Arab Emirates", name: "Dubai International Airport", iata: "DXB" },
  { city: "Mumbai", country: "India", name: "Chhatrapati Shivaji Maharaj Airport", iata: "BOM" },
  { city: "Mauritius", country: "Mauritius", name: "Sir Seewoosagur Ramgoolam Airport", iata: "MRU" },
  { city: "London", country: "United Kingdom", name: "Heathrow Airport", iata: "LHR" },
  { city: "New York", country: "United States", name: "John F. Kennedy International Airport", iata: "JFK" },
  { city: "Johannesburg", country: "South Africa", name: "O.R. Tambo International Airport", iata: "JNB" },
  { city: "Paris", country: "France", name: "Charles de Gaulle Airport", iata: "CDG" },
  { city: "Guangzhou", country: "China", name: "Baiyun International Airport", iata: "CAN" },
  { city: "Amsterdam", country: "Netherlands", name: "Schiphol Airport", iata: "AMS" },
  { city: "Zanzibar", country: "Tanzania", name: "Abeid Amani Karume Airport", iata: "ZNZ" },
  { city: "Dar es Salaam", country: "Tanzania", name: "Julius Nyerere International Airport", iata: "DAR" },
  { city: "Entebbe", country: "Uganda", name: "Entebbe International Airport", iata: "EBB" },
  { city: "Kigali", country: "Rwanda", name: "Kigali International Airport", iata: "KGL" }
];
