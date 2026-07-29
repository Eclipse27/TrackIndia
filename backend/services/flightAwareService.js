/**
 * FlightAware AeroAPI Integration — Phase 7
 *
 * Uses FLIGHTAWARE_API_KEY env var.
 * If key is missing or request fails, silently falls back to mock data.
 * Rate limited to max 1 request/second using a token bucket.
 */

const axios = require('axios')
const { getMockFlights: getMock, getMockFlightById: getMockById, MOCK_FLIGHTS } = require('./flightService')

const API_KEY = process.env.FLIGHTAWARE_API_KEY
const BASE_URL = 'https://aeroapi.flightaware.com/aeroapi'
const RATE_LIMIT_MS = parseInt(process.env.FLIGHTAWARE_RATE_LIMIT_MS || '1000', 10)

// ─── Simple token bucket rate limiter ────────────────────────────────────────
let lastRequestAt = 0

async function enforceRateLimit() {
  const now = Date.now()
  const timeSinceLast = now - lastRequestAt
  if (timeSinceLast < RATE_LIMIT_MS) {
    await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_MS - timeSinceLast))
  }
  lastRequestAt = Date.now()
}

// ─── FlightAware API client ───────────────────────────────────────────────────
const faClient = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
  headers: {
    'x-apikey': API_KEY || '',
    'Accept': 'application/json; charset=UTF-8',
  },
})

/**
 * Map FlightAware AeroAPI flight object to our internal schema.
 */
function mapFAFlight(fa) {
  return {
    id: fa.ident || fa.fa_flight_id,
    flightNumber: fa.ident,
    airline: fa.operator || 'Unknown',
    aircraftType: fa.aircraft_type || 'Unknown',
    registration: fa.registration || '—',
    status: mapFAStatus(fa.status),
    origin: {
      code: fa.origin?.code_iata || '???',
      name: fa.origin?.name || '',
      city: fa.origin?.city || '',
      lat: fa.origin?.latitude || 0,
      lng: fa.origin?.longitude || 0,
    },
    destination: {
      code: fa.destination?.code_iata || '???',
      name: fa.destination?.name || '',
      city: fa.destination?.city || '',
      lat: fa.destination?.latitude || 0,
      lng: fa.destination?.longitude || 0,
    },
    departure: {
      scheduled: fa.scheduled_out,
      actual: fa.actual_out,
    },
    arrival: {
      scheduled: fa.scheduled_in,
      estimated: fa.estimated_in,
    },
    telemetry: {
      lat: fa.last_position?.latitude || 0,
      lng: fa.last_position?.longitude || 0,
      altitude: fa.last_position?.altitude || 0,
      speed: fa.last_position?.groundspeed || 0,
      heading: fa.last_position?.heading || 0,
      progress: fa.progress_percent || 0,
    },
    route: [],
    delay: fa.departure_delay ? Math.round(fa.departure_delay / 60) : 0,
    gate: fa.gate_origin || '—',
    terminal: fa.terminal_origin || '—',
  }
}

function mapFAStatus(status) {
  const map = {
    'En Route / On Time': 'EN_ROUTE',
    'En Route / Late': 'EN_ROUTE',
    'Arrived': 'LANDED',
    'Scheduled': 'SCHEDULED',
    'Cancelled': 'CANCELLED',
  }
  return map[status] || 'EN_ROUTE'
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Get all tracked domestic Indian flights.
 * Returns FlightAware data if key is set, else mock data.
 */
async function getFlights() {
  if (!API_KEY) {
    return getMock()
  }

  try {
    await enforceRateLimit()
    // Query IndiGo + Air India operating in India
    const response = await faClient.get('/flights/search', {
      params: { query: '-origin VOMM -destination VIDP -airline AI', max_pages: 1 },
    })
    const flights = (response.data?.flights || []).map(mapFAFlight)
    return flights.length > 0 ? flights : getMock()
  } catch (err) {
    console.warn(`[FlightAware] API error, falling back to mock: ${err.message}`)
    return getMock()
  }
}

/**
 * Get a single flight by ID.
 * Returns FlightAware data if key is set, else mock data.
 */
async function getFlightById(id) {
  if (!API_KEY) {
    return getMockById(id)
  }

  try {
    await enforceRateLimit()
    const response = await faClient.get(`/flights/${id}`)
    const fa = response.data?.flights?.[0]
    if (!fa) return getMockById(id)
    return mapFAFlight(fa)
  } catch (err) {
    console.warn(`[FlightAware] API error for ${id}, falling back to mock: ${err.message}`)
    return getMockById(id)
  }
}

module.exports = { getFlights, getFlightById }
