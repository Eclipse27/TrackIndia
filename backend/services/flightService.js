/**
 * Backend mock flight dataset.
 * Matches frontend schema exactly for seamless Phase 7 FlightAware integration.
 */

const MOCK_FLIGHTS = [
  {
    id: 'AI-101',
    flightNumber: 'AI 101',
    airline: 'Air India',
    aircraftType: 'Boeing 787-8',
    registration: 'VT-ANA',
    status: 'EN_ROUTE',
    origin: { code: 'DEL', name: 'Indira Gandhi Intl', city: 'New Delhi', lat: 28.5562, lng: 77.1000 },
    destination: { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj Intl', city: 'Mumbai', lat: 19.0896, lng: 72.8656 },
    departure: { scheduled: '2026-05-22T08:00:00+05:30', actual: '2026-05-22T08:12:00+05:30' },
    arrival: { scheduled: '2026-05-22T10:15:00+05:30', estimated: '2026-05-22T10:28:00+05:30' },
    telemetry: { lat: 25.3, lng: 75.4, altitude: 35000, speed: 820, heading: 215, progress: 42 },
    route: [
      { lat: 28.5562, lng: 77.1000 }, { lat: 27.2, lng: 76.2 }, { lat: 25.3, lng: 75.4 },
      { lat: 23.8, lng: 74.8 }, { lat: 22.1, lng: 74.1 }, { lat: 20.5, lng: 73.5 },
      { lat: 19.0896, lng: 72.8656 },
    ],
    delay: 13, gate: 'D14', terminal: '2',
  },
  {
    id: 'IX-441',
    flightNumber: 'IX 441',
    airline: 'IndiGo',
    aircraftType: 'Airbus A320neo',
    registration: 'VT-ITZ',
    status: 'EN_ROUTE',
    origin: { code: 'BLR', name: 'Kempegowda Intl', city: 'Bengaluru', lat: 13.1986, lng: 77.7066 },
    destination: { code: 'HYD', name: 'Rajiv Gandhi Intl', city: 'Hyderabad', lat: 17.2403, lng: 78.4294 },
    departure: { scheduled: '2026-05-22T09:30:00+05:30', actual: '2026-05-22T09:30:00+05:30' },
    arrival: { scheduled: '2026-05-22T10:45:00+05:30', estimated: '2026-05-22T10:45:00+05:30' },
    telemetry: { lat: 15.1, lng: 78.1, altitude: 28000, speed: 790, heading: 25, progress: 58 },
    route: [
      { lat: 13.1986, lng: 77.7066 }, { lat: 14.0, lng: 77.9 }, { lat: 15.1, lng: 78.1 },
      { lat: 16.2, lng: 78.3 }, { lat: 17.2403, lng: 78.4294 },
    ],
    delay: 0, gate: 'C8', terminal: '1',
  },
  {
    id: 'SG-102',
    flightNumber: 'SG 102',
    airline: 'SpiceJet',
    aircraftType: 'Boeing 737 MAX 8',
    registration: 'VT-SZR',
    status: 'EN_ROUTE',
    origin: { code: 'MAA', name: 'Chennai Intl', city: 'Chennai', lat: 12.9900, lng: 80.1693 },
    destination: { code: 'CCU', name: 'Netaji Subhas Chandra Bose Intl', city: 'Kolkata', lat: 22.6547, lng: 88.4467 },
    departure: { scheduled: '2026-05-22T07:15:00+05:30', actual: '2026-05-22T07:35:00+05:30' },
    arrival: { scheduled: '2026-05-22T09:45:00+05:30', estimated: '2026-05-22T10:05:00+05:30' },
    telemetry: { lat: 17.8, lng: 83.9, altitude: 33000, speed: 845, heading: 42, progress: 65 },
    route: [
      { lat: 12.9900, lng: 80.1693 }, { lat: 14.5, lng: 81.2 }, { lat: 17.8, lng: 83.9 },
      { lat: 20.2, lng: 85.8 }, { lat: 22.6547, lng: 88.4467 },
    ],
    delay: 20, gate: 'A3', terminal: '1',
  },
  {
    id: 'UK-971',
    flightNumber: 'UK 971',
    airline: 'Vistara',
    aircraftType: 'Airbus A321',
    registration: 'VT-TNB',
    status: 'BOARDING',
    origin: { code: 'DEL', name: 'Indira Gandhi Intl', city: 'New Delhi', lat: 28.5562, lng: 77.1000 },
    destination: { code: 'COK', name: 'Cochin Intl', city: 'Kochi', lat: 10.1520, lng: 76.4019 },
    departure: { scheduled: '2026-05-22T11:00:00+05:30', actual: '2026-05-22T11:00:00+05:30' },
    arrival: { scheduled: '2026-05-22T13:30:00+05:30', estimated: '2026-05-22T13:30:00+05:30' },
    telemetry: { lat: 28.5562, lng: 77.1000, altitude: 0, speed: 0, heading: 0, progress: 0 },
    route: [
      { lat: 28.5562, lng: 77.1000 }, { lat: 25.0, lng: 76.5 }, { lat: 21.5, lng: 76.2 },
      { lat: 16.8, lng: 75.9 }, { lat: 13.0, lng: 76.1 }, { lat: 10.1520, lng: 76.4019 },
    ],
    delay: 0, gate: 'B22', terminal: '3',
  },
  {
    id: 'G8-201',
    flightNumber: 'G8 201',
    airline: 'GoAir',
    aircraftType: 'Airbus A320',
    registration: 'VT-WAF',
    status: 'DELAYED',
    origin: { code: 'PNQ', name: 'Pune Airport', city: 'Pune', lat: 18.5822, lng: 73.9197 },
    destination: { code: 'GOI', name: 'Goa Intl', city: 'Goa', lat: 15.3808, lng: 73.8314 },
    departure: { scheduled: '2026-05-22T10:30:00+05:30', actual: '2026-05-22T11:15:00+05:30' },
    arrival: { scheduled: '2026-05-22T11:15:00+05:30', estimated: '2026-05-22T12:00:00+05:30' },
    telemetry: { lat: 18.5822, lng: 73.9197, altitude: 0, speed: 0, heading: 180, progress: 0 },
    route: [
      { lat: 18.5822, lng: 73.9197 }, { lat: 17.4, lng: 73.85 }, { lat: 15.3808, lng: 73.8314 },
    ],
    delay: 45, gate: 'A1', terminal: '1',
  },
]

async function getMockFlights() {
  return MOCK_FLIGHTS
}

async function getMockFlightById(id) {
  return MOCK_FLIGHTS.find((f) => f.id === id) || null
}

module.exports = { getMockFlights, getMockFlightById, MOCK_FLIGHTS }
