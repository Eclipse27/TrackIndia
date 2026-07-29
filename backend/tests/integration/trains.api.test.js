/**
 * Integration Tests — GET /api/trains
 * Response shape: { success, count, data: [...] }
 */

const request = require('supertest')
const { app } = require('../../server')

describe('Trains API — Integration Tests', () => {

  describe('GET /api/trains', () => {
    test('responds 200 OK', async () => {
      const res = await request(app).get('/api/trains')
      expect(res.statusCode).toBe(200)
    })

    test('returns JSON content type', async () => {
      const res = await request(app).get('/api/trains')
      expect(res.headers['content-type']).toMatch(/json/)
    })

    test('body has success:true', async () => {
      const res = await request(app).get('/api/trains')
      expect(res.body.success).toBe(true)
    })

    test('body.data is an array', async () => {
      const res = await request(app).get('/api/trains')
      expect(Array.isArray(res.body.data)).toBe(true)
    })

    test('body.data is non-empty', async () => {
      const res = await request(app).get('/api/trains')
      expect(res.body.data.length).toBeGreaterThan(0)
    })

    test('body.count matches data length', async () => {
      const res = await request(app).get('/api/trains')
      expect(res.body.count).toBe(res.body.data.length)
    })

    test('each train has id, number, name, status', async () => {
      const res = await request(app).get('/api/trains')
      for (const train of res.body.data) {
        expect(train).toHaveProperty('id')
        expect(train).toHaveProperty('number')
        expect(train).toHaveProperty('name')
        expect(train).toHaveProperty('status')
      }
    })
  })

  describe('GET /api/trains/:id', () => {
    test('returns train by valid ID', async () => {
      const allRes = await request(app).get('/api/trains')
      const firstId = allRes.body.data[0].id
      const res = await request(app).get(`/api/trains/${firstId}`)
      expect(res.statusCode).toBe(200)
      expect(res.body.success).toBe(true)
      const train = res.body.data || res.body
      expect(train.id).toBe(firstId)
    })

    test('returns train by train number', async () => {
      const allRes = await request(app).get('/api/trains')
      const number = allRes.body.data[0].number
      const res = await request(app).get(`/api/trains/${number}`)
      expect(res.statusCode).toBe(200)
      const train = res.body.data || res.body
      expect(train.number).toBe(number)
    })

    test('returns 404 for non-existent ID', async () => {
      const res = await request(app).get('/api/trains/NONEXISTENT-0000')
      expect(res.statusCode).toBe(404)
    })

    test('404 response has error field', async () => {
      const res = await request(app).get('/api/trains/FAKE-0')
      expect(res.body).toHaveProperty('error')
    })

    test('returned train has route array', async () => {
      const allRes = await request(app).get('/api/trains')
      const firstId = allRes.body.data[0].id
      const res = await request(app).get(`/api/trains/${firstId}`)
      const train = res.body.data || res.body
      expect(Array.isArray(train.route)).toBe(true)
    })

    test('returned train has origin/destination', async () => {
      const allRes = await request(app).get('/api/trains')
      const firstId = allRes.body.data[0].id
      const res = await request(app).get(`/api/trains/${firstId}`)
      const train = res.body.data || res.body
      expect(train).toHaveProperty('origin')
      expect(train).toHaveProperty('destination')
    })
  })
})
