/**
 * Integration Tests — GET /api/dashboard
 * Response shape: { success, data: { activeFlights, totalFlights, flights:[], trains:[], ... } }
 */

const request = require('supertest')
const { app } = require('../../server')

describe('Dashboard API — Integration Tests', () => {

  describe('GET /api/dashboard/summary', () => {
    test('responds 200 OK', async () => {
      const res = await request(app).get('/api/dashboard/summary')
      expect(res.statusCode).toBe(200)
    })

    test('returns JSON', async () => {
      const res = await request(app).get('/api/dashboard/summary')
      expect(res.headers['content-type']).toMatch(/json/)
    })

    test('body has success:true', async () => {
      const res = await request(app).get('/api/dashboard/summary')
      expect(res.body.success).toBe(true)
    })

    test('body.data has activeFlights', async () => {
      const res = await request(app).get('/api/dashboard/summary')
      expect(res.body.data).toHaveProperty('activeFlights')
      expect(typeof res.body.data.activeFlights).toBe('number')
    })

    test('body.data has activeTrains', async () => {
      const res = await request(app).get('/api/dashboard/summary')
      expect(res.body.data).toHaveProperty('activeTrains')
      expect(typeof res.body.data.activeTrains).toBe('number')
    })

    test('body.data has totalFlights > 0', async () => {
      const res = await request(app).get('/api/dashboard/summary')
      expect(res.body.data.totalFlights).toBeGreaterThan(0)
    })

    test('body.data has totalTrains > 0', async () => {
      const res = await request(app).get('/api/dashboard/summary')
      expect(res.body.data.totalTrains).toBeGreaterThan(0)
    })

    test('body.data.flights is an array', async () => {
      const res = await request(app).get('/api/dashboard/summary')
      expect(Array.isArray(res.body.data.flights)).toBe(true)
    })

    test('body.data.trains is an array', async () => {
      const res = await request(app).get('/api/dashboard/summary')
      expect(Array.isArray(res.body.data.trains)).toBe(true)
    })

    test('body.data.recentEvents is an array', async () => {
      const res = await request(app).get('/api/dashboard/summary')
      expect(Array.isArray(res.body.data.recentEvents)).toBe(true)
    })

    test('body.data.busiestAirports is an array', async () => {
      const res = await request(app).get('/api/dashboard/summary')
      expect(Array.isArray(res.body.data.busiestAirports)).toBe(true)
    })
  })
})
