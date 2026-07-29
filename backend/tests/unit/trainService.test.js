/**
 * Unit Tests — trainService.js
 */

const { getMockTrains, getMockTrainById, MOCK_TRAINS } = require('../../services/trainService')

describe('trainService — Unit Tests', () => {

  describe('getMockTrains()', () => {
    test('returns an array', async () => {
      const trains = await getMockTrains()
      expect(Array.isArray(trains)).toBe(true)
    })

    test('returns at least 1 train', async () => {
      const trains = await getMockTrains()
      expect(trains.length).toBeGreaterThan(0)
    })

    test('every train has required fields', async () => {
      const trains = await getMockTrains()
      for (const train of trains) {
        expect(train).toHaveProperty('id')
        expect(train).toHaveProperty('number')
        expect(train).toHaveProperty('name')
        expect(train).toHaveProperty('type')
        expect(train).toHaveProperty('status')
        expect(train).toHaveProperty('origin')
        expect(train).toHaveProperty('destination')
        expect(train).toHaveProperty('route')
        expect(train).toHaveProperty('position')
        expect(train).toHaveProperty('coaches')
        expect(train).toHaveProperty('classes')
      }
    })

    test('every train has at least 2 stations in route', async () => {
      const trains = await getMockTrains()
      for (const train of trains) {
        expect(Array.isArray(train.route)).toBe(true)
        expect(train.route.length).toBeGreaterThanOrEqual(2)
      }
    })

    test('every train station has lat/lng', async () => {
      const trains = await getMockTrains()
      for (const train of trains) {
        for (const station of train.route) {
          expect(typeof station.lat).toBe('number')
          expect(typeof station.lng).toBe('number')
          expect(station).toHaveProperty('code')
          expect(station).toHaveProperty('name')
        }
      }
    })

    test('train status is valid', async () => {
      const VALID = ['RUNNING', 'ON_TIME', 'DELAYED', 'EARLY', 'CANCELLED', 'SCHEDULED', 'ARRIVED']
      const trains = await getMockTrains()
      for (const train of trains) {
        expect(VALID).toContain(train.status)
      }
    })

    test('journeyProgress is between 0 and 100', async () => {
      const trains = await getMockTrains()
      for (const train of trains) {
        expect(train.journeyProgress).toBeGreaterThanOrEqual(0)
        expect(train.journeyProgress).toBeLessThanOrEqual(100)
      }
    })
  })

  describe('getMockTrainById()', () => {
    test('finds train by id', async () => {
      const first = MOCK_TRAINS[0]
      const found = await getMockTrainById(first.id)
      expect(found).not.toBeNull()
      expect(found.id).toBe(first.id)
    })

    test('finds train by train number', async () => {
      const first = MOCK_TRAINS[0]
      const found = await getMockTrainById(first.number)
      expect(found).not.toBeNull()
      expect(found.number).toBe(first.number)
    })

    test('returns null for unknown id', async () => {
      const result = await getMockTrainById('UNKNOWN-0000')
      expect(result).toBeNull()
    })

    test('returns null for empty string', async () => {
      const result = await getMockTrainById('')
      expect(result).toBeNull()
    })

    test('lookup works for all trains in dataset', async () => {
      for (const train of MOCK_TRAINS) {
        const found = await getMockTrainById(train.id)
        expect(found).not.toBeNull()
        expect(found.id).toBe(train.id)
      }
    })
  })

  describe('Data integrity', () => {
    test('all train IDs are unique', () => {
      const ids = MOCK_TRAINS.map(t => t.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    test('all train numbers are unique', () => {
      const numbers = MOCK_TRAINS.map(t => t.number)
      const unique = new Set(numbers)
      expect(unique.size).toBe(numbers.length)
    })

    test('delayed trains have delay > 0', () => {
      const delayed = MOCK_TRAINS.filter(t => t.status === 'DELAYED')
      for (const train of delayed) {
        expect(train.delay).toBeGreaterThan(0)
      }
    })

    test('position lat/lng are numbers', () => {
      for (const train of MOCK_TRAINS) {
        expect(typeof train.position.lat).toBe('number')
        expect(typeof train.position.lng).toBe('number')
      }
    })

    test('coaches is positive number', () => {
      for (const train of MOCK_TRAINS) {
        expect(train.coaches).toBeGreaterThan(0)
      }
    })

    test('classes is non-empty array', () => {
      for (const train of MOCK_TRAINS) {
        expect(Array.isArray(train.classes)).toBe(true)
        expect(train.classes.length).toBeGreaterThan(0)
      }
    })

    test('currentStationIndex within route bounds', () => {
      for (const train of MOCK_TRAINS) {
        expect(train.currentStationIndex).toBeGreaterThanOrEqual(0)
        expect(train.currentStationIndex).toBeLessThan(train.route.length)
      }
    })
  })
})
