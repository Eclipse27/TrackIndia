/**
 * Flight Simulation Engine — Phase 6
 * Emits `flight:update` socket events every 5 seconds.
 *
 * Payload: { flightId, telemetry: {lat,lng,altitude,speed,heading,progress}, status, delay }
 */

const { SOCKET_EVENTS, SIM_CONFIG } = require('../utils/constants')
const { MOCK_FLIGHTS } = require('../services/flightService')

const flightStates = {}

function initFlightStates() {
  MOCK_FLIGHTS.forEach((flight) => {
    flightStates[flight.id] = {
      ...flight,
      progress: flight.telemetry.progress / 100,
      startedAt: Date.now() - (flight.telemetry.progress / 100) * estimateFlightMs(flight),
    }
  })
}

function estimateFlightMs(flight) {
  const dist = haversineKm(flight.origin, flight.destination)
  return (dist / (flight.telemetry.speed || 800)) * 3600 * 1000
}

function haversineKm(a, b) {
  const R = 6371
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s))
}

function toRad(deg) { return (deg * Math.PI) / 180 }

function lerp(a, b, t) { return a + (b - a) * t }

function interpolatePosition(flight, progress) {
  const route = flight.route
  if (!route || route.length < 2) {
    return { lat: flight.origin.lat, lng: flight.origin.lng }
  }
  if (progress <= 0) return { lat: route[0].lat, lng: route[0].lng }
  if (progress >= 1) return { lat: route[route.length - 1].lat, lng: route[route.length - 1].lng }

  const routeLen = route.length - 1
  const segT = progress * routeLen
  const segIdx = Math.min(Math.floor(segT), routeLen - 1)
  const localT = segT - segIdx
  const from = route[segIdx]
  const to = route[Math.min(segIdx + 1, routeLen)]

  return {
    lat: from.lat + (to.lat - from.lat) * localT,
    lng: from.lng + (to.lng - from.lng) * localT,
  }
}

function tickFlight(flightId) {
  const state = flightStates[flightId]
  if (!state) return null

  const elapsed = Date.now() - state.startedAt
  const journeyMs = estimateFlightMs(state)
  state.progress = Math.min((elapsed / journeyMs) % 1, 1)

  if (state.progress >= 0.98) {
    // Restart for demo looping
    state.startedAt = Date.now()
    state.progress = 0
  }

  const position = interpolatePosition(state, state.progress)

  // Altitude: parabolic arc (cruise at 35000 ft)
  const altitudeFactor = Math.sin(Math.PI * state.progress)
  const altitude = state.status === 'BOARDING' ? 0 : Math.round(altitudeFactor * 36000)

  // Speed variation
  const baseSpeed = state.telemetry.speed || 800
  const speed = state.status === 'BOARDING' ? 0 : Math.round(baseSpeed + (Math.random() - 0.5) * 40)

  return {
    flightId: state.id,
    flightNumber: state.flightNumber,
    airline: state.airline,
    telemetry: {
      lat: position.lat,
      lng: position.lng,
      altitude,
      speed,
      heading: state.telemetry.heading,
      progress: Math.round(state.progress * 100),
    },
    status: state.status,
    delay: state.delay,
    origin: state.origin,
    destination: state.destination,
  }
}

let flightInterval = null

function startFlightEngine(io) {
  if (flightInterval) clearInterval(flightInterval)
  initFlightStates()

  flightInterval = setInterval(() => {
    MOCK_FLIGHTS.forEach((flight) => {
      const update = tickFlight(flight.id)
      if (update) {
        io.emit(SOCKET_EVENTS.FLIGHT_UPDATE, update)
        io.to(`flight:${flight.id}`).emit(SOCKET_EVENTS.FLIGHT_UPDATE, update)
      }
    })
  }, SIM_CONFIG.FLIGHT_UPDATE_INTERVAL_MS)

  console.log(`[FlightEngine] ✈️  Simulation started — ${MOCK_FLIGHTS.length} flights active, updating every ${SIM_CONFIG.FLIGHT_UPDATE_INTERVAL_MS}ms`)
}

function stopFlightEngine() {
  if (flightInterval) {
    clearInterval(flightInterval)
    flightInterval = null
    console.log('[FlightEngine] 🛑 Simulation stopped')
  }
}

module.exports = { startFlightEngine, stopFlightEngine }
