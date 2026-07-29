/**
 * Unit Tests — flightService.js
 * Tests: getAllFlights, getFlightById, data schema validation
 */

const { getMockFlights, getMockFlightById, MOCK_FLIGHTS } = require('../../services/flightService')

describe('flightService — Unit Tests', () => {

  // ── getMockFlights ───────────────────────────────────────────────────────────
  describe('getMockFlights()', () => {
    test('returns an array', async () => {
      const flights = await getMockFlights()
      expect(Array.isArray(flights)).toBe(true)
    })

    test('returns at least 1 flight', async () => {
      const flights = await getMockFlights()
      expect(flights.length).toBeGreaterThan(0)
    })

    test('every flight has required fields', async () => {
      const flights = await getMockFlights()
      for (const flight of flights) {
        expect(flight).toHaveProperty('id')
        expect(flight).toHaveProperty('flightNumber')
        expect(flight).toHaveProperty('airline')
        expect(flight).toHaveProperty('status')
        expect(flight).toHaveProperty('origin')
        expect(flight).toHaveProperty('destination')
        expect(flight).toHaveProperty('telemetry')
        expect(flight).toHaveProperty('route')
      }
    })

    test('every flight origin has code, name, city, lat, lng', async () => {
      const flights = await getMockFlights()
      for (const flight of flights) {
        expect(flight.origin).toMatchObject({
          code: expect.any(String),
          name: expect.any(String),
          city: expect.any(String),
          lat: expect.any(Number),
          lng: expect.any(Number),
        })
      }
    })

    test('every flight telemetry has numeric fields', async () => {
      const flights = await getMockFlights()
      for (const flight of flights) {
        expect(typeof flight.telemetry.lat).toBe('number')
        expect(typeof flight.telemetry.lng).toBe('number')
        expect(typeof flight.telemetry.altitude).toBe('number')
        expect(typeof flight.telemetry.speed).toBe('number')
        expect(typeof flight.telemetry.heading).toBe('number')
        expect(typeof flight.telemetry.progress).toBe('number')
      }
    })

    test('flight status is one of the valid statuses', async () => {
      const VALID_STATUSES = ['SCHEDULED', 'BOARDING', 'DEPARTED', 'EN_ROUTE', 'LANDED', 'DELAYED', 'CANCELLED']
      const flights = await getMockFlights()
      for (const flight of flights) {
        expect(VALID_STATUSES).toContain(flight.status)
      }
    })

    test('flight route is a non-empty array', async () => {
      const flights = await getMockFlights()
      for (const flight of flights) {
        expect(Array.isArray(flight.route)).toBe(true)
        expect(flight.route.length).toBeGreaterThan(0)
      }
    })
  })

  // ── getMockFlightById ────────────────────────────────────────────────────────
  describe('getMockFlightById()', () => {
    test('returns correct flight by ID', async () => {
      const firstFlight = MOCK_FLIGHTS[0]
      const found = await getMockFlightById(firstFlight.id)
      expect(found).not.toBeNull()
      expect(found.id).toBe(firstFlight.id)
      expect(found.flightNumber).toBe(firstFlight.flightNumber)
    })

    test('returns null for non-existent ID', async () => {
      const result = await getMockFlightById('NONEXISTENT-9999')
      expect(result).toBeNull()
    })

    test('returns null for empty string', async () => {
      const result = await getMockFlightById('')
      expect(result).toBeNull()
    })

    test('returns null for undefined', async () => {
      const result = await getMockFlightById(undefined)
      expect(result).toBeNull()
    })

    test('lookup works for all flights in dataset', async () => {
      for (const flight of MOCK_FLIGHTS) {
        const found = await getMockFlightById(flight.id)
        expect(found).not.toBeNull()
        expect(found.id).toBe(flight.id)
      }
    })
  })

  // ── Data integrity ───────────────────────────────────────────────────────────
  describe('Data integrity', () => {
    test('all flight IDs are unique', () => {
      const ids = MOCK_FLIGHTS.map(f => f.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    test('delayed flights have delay > 0', () => {
      const delayedFlights = MOCK_FLIGHTS.filter(f => f.status === 'DELAYED')
      for (const flight of delayedFlights) {
        expect(flight.delay).toBeGreaterThan(0)
      }
    })

    test('en-route flights have altitude > 0', () => {
      const enRouteFlights = MOCK_FLIGHTS.filter(f => f.status === 'EN_ROUTE')
      for (const flight of enRouteFlights) {
        expect(flight.telemetry.altitude).toBeGreaterThan(0)
      }
    })

    test('en-route flights have speed > 0', () => {
      const enRouteFlights = MOCK_FLIGHTS.filter(f => f.status === 'EN_ROUTE')
      for (const flight of enRouteFlights) {
        expect(flight.telemetry.speed).toBeGreaterThan(0)
      }
    })

    test('progress is between 0 and 100', () => {
      for (const flight of MOCK_FLIGHTS) {
        expect(flight.telemetry.progress).toBeGreaterThanOrEqual(0)
        expect(flight.telemetry.progress).toBeLessThanOrEqual(100)
      }
    })

    test('IATA codes are 3 uppercase characters', () => {
      for (const flight of MOCK_FLIGHTS) {
        expect(flight.origin.code).toMatch(/^[A-Z]{3}$/)
        expect(flight.destination.code).toMatch(/^[A-Z]{3}$/)
      }
    })

    test('Indian coordinates are in valid range', () => {
      // India approx: lat 8–37, lng 68–97
      for (const flight of MOCK_FLIGHTS) {
        expect(flight.origin.lat).toBeGreaterThan(5)
        expect(flight.origin.lat).toBeLessThan(40)
        expect(flight.origin.lng).toBeGreaterThan(65)
        expect(flight.origin.lng).toBeLessThan(100)
      }
    })
  })
})
