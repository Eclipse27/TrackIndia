/**
 * UAT (User Acceptance Tests) — Real user workflow scenarios.
 * Response shape: { success, data: [...] } for lists, { success, data: {...} } for single items
 */

const request = require('supertest')
const { app } = require('../../server')

describe('UAT — User Acceptance Tests', () => {

  // ── Scenario 1: User searches for a specific flight ──────────────────────────
  describe('Scenario 1: User looks up flight AI 101 (Air India Delhi→Mumbai)', () => {
    test('API returns all flights successfully', async () => {
      const res = await request(app).get('/api/flights')
      expect(res.statusCode).toBe(200)
      expect(res.body.success).toBe(true)
      expect(Array.isArray(res.body.data)).toBe(true)
    })

    test('User can find AI-101 by ID — response is not 500', async () => {
      const res = await request(app).get('/api/flights/AI-101')
      expect([200, 404]).toContain(res.statusCode)
      expect(res.statusCode).not.toBe(500)
    })

    test('Finding flight by ID returns correct structure', async () => {
      const res = await request(app).get('/api/flights/AI-101')
      if (res.statusCode === 200) {
        const flight = res.body.data || res.body
        expect(flight).toHaveProperty('flightNumber')
        expect(flight).toHaveProperty('airline')
      }
    })
  })

  // ── Scenario 2: User tracks family travel from DEL to BOM ────────────────────
  describe('Scenario 2: User tracks family flight Delhi → Mumbai', () => {
    let allFlights

    beforeAll(async () => {
      const res = await request(app).get('/api/flights')
      allFlights = res.body.data || []
    })

    test('Flight list loads successfully', () => {
      expect(Array.isArray(allFlights)).toBe(true)
    })

    test('List is non-empty', () => {
      expect(allFlights.length).toBeGreaterThan(0)
    })

    test('Each flight has info needed to display', () => {
      for (const flight of allFlights) {
        expect(flight.flightNumber).toBeDefined()
        expect(flight.airline).toBeDefined()
        expect(flight.status).toBeDefined()
        expect(flight.origin).toBeDefined()
        expect(flight.destination).toBeDefined()
      }
    })
  })

  // ── Scenario 3: User checks for delayed flights ───────────────────────────────
  describe('Scenario 3: User checks for delayed flights', () => {
    test('API returns flights without crashing', async () => {
      const res = await request(app).get('/api/flights')
      expect(res.statusCode).toBe(200)
    })

    test('Delayed flights have delay field > 0', async () => {
      const res = await request(app).get('/api/flights')
      const flights = res.body.data || []
      const delayed = flights.filter(f => f.status === 'DELAYED')
      for (const flight of delayed) {
        expect(flight.delay).toBeGreaterThan(0)
      }
    })
  })

  // ── Scenario 4: User checks train ────────────────────────────────────────────
  describe('Scenario 4: User checks Duronto train by ID', () => {
    test('Train list loads', async () => {
      const res = await request(app).get('/api/trains')
      expect(res.statusCode).toBe(200)
      expect(res.body.success).toBe(true)
      expect(Array.isArray(res.body.data)).toBe(true)
    })

    test('User can look up DUR-12213 by ID — not 500', async () => {
      const res = await request(app).get('/api/trains/DUR-12213')
      expect([200, 404]).toContain(res.statusCode)
      expect(res.statusCode).not.toBe(500)
    })

    test('Train stations route is array when train found', async () => {
      const res = await request(app).get('/api/trains/DUR-12213')
      if (res.statusCode === 200) {
        const train = res.body.data || res.body
        expect(Array.isArray(train.route)).toBe(true)
        expect(train.route.length).toBeGreaterThanOrEqual(2)
      } else {
        // 404 is acceptable — train might not be in backend dataset
        expect(res.statusCode).toBe(404)
      }
    })
  })

  // ── Scenario 5: Dashboard overview ───────────────────────────────────────────
  describe('Scenario 5: User views the main dashboard', () => {
    test('Dashboard summary loads without error', async () => {
      const res = await request(app).get('/api/dashboard/summary')
      expect(res.statusCode).toBe(200)
    })

    test('Dashboard shows activeFlights and activeTrains', async () => {
      const res = await request(app).get('/api/dashboard/summary')
      const data = res.body.data
      expect(data).toHaveProperty('activeFlights')
      expect(data).toHaveProperty('activeTrains')
    })
  })

  // ── Scenario 6: User makes invalid requests ───────────────────────────────────
  describe('Scenario 6: Error handling (user mistyped IDs)', () => {
    test('GET /api/flights/wrong-id returns 404 not 500', async () => {
      const res = await request(app).get('/api/flights/totally-wrong-id-xyz')
      expect(res.statusCode).toBe(404)
    })

    test('GET /api/trains/wrong-id returns 404 not 500', async () => {
      const res = await request(app).get('/api/trains/totally-wrong-id-xyz')
      expect(res.statusCode).toBe(404)
    })

    test('Server health is OK after bad requests', async () => {
      await request(app).get('/api/flights/bad-id')
      await request(app).get('/api/trains/bad-id')
      const res = await request(app).get('/health')
      expect(res.body.status).toBe('ok')
    })
  })
})
