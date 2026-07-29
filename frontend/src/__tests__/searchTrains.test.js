/**
 * Frontend Unit Tests — searchTrains utility
 */

import { describe, test, expect } from 'vitest'
import {
  MOCK_TRAINS,
  searchTrains,
  getTrainById,
  getTrainTypeCounts,
  getTrainStatusCounts,
  TRAIN_TYPE_LABELS,
  TRAIN_TYPE_COLORS,
} from '../services/mockTrains'

describe('searchTrains() — Unit Tests', () => {
  test('returns all trains with no query', () => {
    expect(searchTrains('').length).toBe(MOCK_TRAINS.length)
  })

  test('searches by train name', () => {
    const results = searchTrains('vande bharat')
    expect(results.length).toBeGreaterThan(0)
    expect(results.every(t => t.name.toLowerCase().includes('vande bharat'))).toBe(true)
  })

  test('searches by train number', () => {
    const results = searchTrains('22435')
    expect(results.some(t => t.number === '22435')).toBe(true)
  })

  test('searches by origin station name', () => {
    const results = searchTrains('Howrah')
    expect(results.length).toBeGreaterThan(0)
  })

  test('searches by destination code', () => {
    const results = searchTrains('NDLS')
    expect(results.length).toBeGreaterThan(0)
  })

  test('returns empty for no match', () => {
    const results = searchTrains('ZZZUNKNOWN999')
    expect(results.length).toBe(0)
  })

  test('filters by VANDE_BHARAT type', () => {
    const results = searchTrains('', { type: 'VANDE_BHARAT' })
    expect(results.every(t => t.type === 'VANDE_BHARAT')).toBe(true)
    expect(results.length).toBeGreaterThan(0)
  })

  test('filters by RAJDHANI type', () => {
    const results = searchTrains('', { type: 'RAJDHANI' })
    expect(results.every(t => t.type === 'RAJDHANI')).toBe(true)
    expect(results.length).toBeGreaterThan(0)
  })

  test('filters by DELAYED status', () => {
    const results = searchTrains('', { status: 'DELAYED' })
    expect(results.every(t => t.status === 'DELAYED')).toBe(true)
  })

  test('filters by RUNNING status', () => {
    const results = searchTrains('', { status: 'RUNNING' })
    expect(results.every(t => t.status === 'RUNNING')).toBe(true)
    expect(results.length).toBeGreaterThan(0)
  })

  test('filters by CANCELLED status', () => {
    const results = searchTrains('', { status: 'CANCELLED' })
    expect(results.every(t => t.status === 'CANCELLED')).toBe(true)
  })

  test('ALL type returns all trains', () => {
    expect(searchTrains('', { type: 'ALL' }).length).toBe(MOCK_TRAINS.length)
  })

  test('ALL status returns all trains', () => {
    expect(searchTrains('', { status: 'ALL' }).length).toBe(MOCK_TRAINS.length)
  })

  test('combined type + status filter', () => {
    const results = searchTrains('', { type: 'RAJDHANI', status: 'RUNNING' })
    expect(results.every(t => t.type === 'RAJDHANI' && t.status === 'RUNNING')).toBe(true)
  })
})

describe('getTrainById() — Unit Tests', () => {
  test('finds by id', () => {
    const t = getTrainById('VB-22435')
    expect(t).not.toBeNull()
    expect(t.id).toBe('VB-22435')
  })

  test('finds by train number', () => {
    const t = getTrainById('22435')
    expect(t).not.toBeNull()
    expect(t.number).toBe('22435')
  })

  test('returns null for unknown', () => {
    expect(getTrainById('UNKNOWN-000')).toBeNull()
  })

  test('works for all trains', () => {
    for (const t of MOCK_TRAINS) {
      expect(getTrainById(t.id)).not.toBeNull()
    }
  })
})

describe('getTrainTypeCounts() — Unit Tests', () => {
  test('ALL count equals MOCK_TRAINS.length', () => {
    expect(getTrainTypeCounts().ALL).toBe(MOCK_TRAINS.length)
  })

  test('VANDE_BHARAT count > 0', () => {
    expect(getTrainTypeCounts().VANDE_BHARAT).toBeGreaterThan(0)
  })
})

describe('getTrainStatusCounts() — Unit Tests', () => {
  test('ALL count equals MOCK_TRAINS.length', () => {
    expect(getTrainStatusCounts().ALL).toBe(MOCK_TRAINS.length)
  })
})

describe('MOCK_TRAINS — Data Integrity', () => {
  test('dataset has 32 trains', () => {
    expect(MOCK_TRAINS.length).toBe(32)
  })

  test('all IDs unique', () => {
    const ids = MOCK_TRAINS.map(t => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('all train numbers unique', () => {
    const nums = MOCK_TRAINS.map(t => t.number)
    expect(new Set(nums).size).toBe(nums.length)
  })

  test('multiple zones represented', () => {
    const zones = new Set(MOCK_TRAINS.map(t => t.zone).filter(Boolean))
    expect(zones.size).toBeGreaterThanOrEqual(4)
  })

  test('multiple types represented', () => {
    const types = new Set(MOCK_TRAINS.map(t => t.type))
    expect(types.size).toBeGreaterThanOrEqual(6)
  })

  test('multiple statuses represented', () => {
    const statuses = new Set(MOCK_TRAINS.map(t => t.status))
    expect(statuses.has('RUNNING')).toBe(true)
    expect(statuses.has('DELAYED')).toBe(true)
  })

  test('all routes have at least 2 stations', () => {
    for (const t of MOCK_TRAINS) {
      expect(t.route.length).toBeGreaterThanOrEqual(2)
    }
  })

  test('journey progress 0-100', () => {
    for (const t of MOCK_TRAINS) {
      expect(t.journeyProgress).toBeGreaterThanOrEqual(0)
      expect(t.journeyProgress).toBeLessThanOrEqual(100)
    }
  })

  test('TRAIN_TYPE_LABELS covers all types in dataset', () => {
    for (const t of MOCK_TRAINS) {
      expect(TRAIN_TYPE_LABELS).toHaveProperty(t.type)
    }
  })

  test('TRAIN_TYPE_COLORS covers all types in dataset', () => {
    for (const t of MOCK_TRAINS) {
      expect(TRAIN_TYPE_COLORS).toHaveProperty(t.type)
    }
  })
})
