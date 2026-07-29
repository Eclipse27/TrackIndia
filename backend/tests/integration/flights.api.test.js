/**
 * Integration Tests — GET /api/flights
 * Response shape: { success, count, data: [...] }
 */

const request = require('supertest')
const { app } = require('../../server')

describe('Flights API — Integration Tests', () => {

  describe('GET /api/flights', () => {
    test('responds 200 OK', async () => {
      const res = await request(app).get('/api/flights')
      expect(res.statusCode).toBe(200)
    })

    test('returns JSON content type', async () => {
      const res = await request(app).get('/api/flights')
      expect(res.headers['content-type']).toMatch(/json/)
    })

    test('body has success:true', async () => {
      const res = await request(app).get('/api/flights')
      expect(res.body.success).toBe(true)
    })

    test('body.data is an array', async () => {
      const res = await request(app).get('/api/flights')
      expect(Array.isArray(res.body.data)).toBe(true)
    })

    test('body.data is non-empty', async () => {
      const res = await request(app).get('/api/flights')
      expect(res.body.data.length).toBeGreaterThan(0)
    })

    test('body.count matches data length', async () => {
      const res = await request(app).get('/api/flights')
      expect(res.body.count).toBe(res.body.data.length)
    })

    test('each flight has id, flightNumber, airline, status', async () => {
      const res = await request(app).get('/api/flights')
      for (const flight of res.body.data) {
        expect(flight).toHaveProperty('id')
        expect(flight).toHaveProperty('flightNumber')
        expect(flight).toHaveProperty('airline')
        expect(flight).toHaveProperty('status')
      }
    })
  })

  describe('GET /api/flights/:id', () => {
    test('returns flight by valid ID (success:true, data has flight)', async () => {
      const allRes = await request(app).get('/api/flights')
      const firstId = allRes.body.data[0].id
      const res = await request(app).get(`/api/flights/${firstId}`)
      expect(res.statusCode).toBe(200)
      expect(res.body.success).toBe(true)
      // Controller wraps in data OR returns directly — check both
      const flight = res.body.data || res.body
      expect(flight.id).toBe(firstId)
    })

    test('returns 404 for non-existent ID', async () => {
      const res = await request(app).get('/api/flights/NONEXISTENT-0000')
      expect(res.statusCode).toBe(404)
    })

    test('404 response has error field', async () => {
      const res = await request(app).get('/api/flights/FAKE-999')
      expect(res.statusCode).toBe(404)
      expect(res.body).toHaveProperty('error')
    })

    test('returned flight has origin and destination', async () => {
      const allRes = await request(app).get('/api/flights')
      const firstId = allRes.body.data[0].id
      const res = await request(app).get(`/api/flights/${firstId}`)
      const flight = res.body.data || res.body
      expect(flight).toHaveProperty('origin')
      expect(flight).toHaveProperty('destination')
      expect(flight.origin).toHaveProperty('code')
      expect(flight.destination).toHaveProperty('code')
    })

    test('returned flight has telemetry', async () => {
      const allRes = await request(app).get('/api/flights')
      const firstId = allRes.body.data[0].id
      const res = await request(app).get(`/api/flights/${firstId}`)
      const flight = res.body.data || res.body
      expect(flight).toHaveProperty('telemetry')
    })
  })

  describe('GET /health', () => {
    test('responds 200', async () => {
      const res = await request(app).get('/health')
      expect(res.statusCode).toBe(200)
    })

    test('returns status ok', async () => {
      const res = await request(app).get('/health')
      expect(res.body.status).toBe('ok')
    })

    test('returns timestamp', async () => {
      const res = await request(app).get('/health')
      expect(res.body).toHaveProperty('timestamp')
    })
  })
})
