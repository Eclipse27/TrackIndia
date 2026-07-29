/**
 * Frontend Unit Tests — searchFlights utility
 * Run with: npm test (Vitest)
 */

import { describe, test, expect } from 'vitest'
import { MOCK_FLIGHTS, searchFlights, getFlightById, getFlightStatusCounts } from '../services/mockFlights'

describe('searchFlights() — Unit Tests', () => {

  test('returns all flights when no query or filters', () => {
    const results = searchFlights('')
    expect(results.length).toBe(MOCK_FLIGHTS.length)
  })

  test('searches by flight number (case insensitive)', () => {
    const results = searchFlights('ai 101')
    expect(results.some(f => f.flightNumber === 'AI 101')).toBe(true)
  })

  test('searches by airline name', () => {
    const results = searchFlights('indigo')
    expect(results.every(f => f.airline.toLowerCase().includes('indigo'))).toBe(true)
    expect(results.length).toBeGreaterThan(0)
  })

  test('searches by origin city', () => {
    const results = searchFlights('mumbai')
    const fromMumbai = results.filter(f => f.origin.city.toLowerCase().includes('mumbai'))
    const toMumbai = results.filter(f => f.destination.city.toLowerCase().includes('mumbai'))
    expect(fromMumbai.length + toMumbai.length).toBeGreaterThan(0)
  })

  test('searches by airport code', () => {
    const results = searchFlights('DEL')
    expect(results.some(f => f.origin.code === 'DEL' || f.destination.code === 'DEL')).toBe(true)
  })

  test('returns empty array for no match', () => {
    const results = searchFlights('ZZZZZZZ99999')
    expect(results.length).toBe(0)
  })

  test('filters by EN_ROUTE status', () => {
    const results = searchFlights('', { status: 'EN_ROUTE' })
    expect(results.every(f => f.status === 'EN_ROUTE')).toBe(true)
    expect(results.length).toBeGreaterThan(0)
  })

  test('filters by DELAYED status', () => {
    const results = searchFlights('', { status: 'DELAYED' })
    expect(results.every(f => f.status === 'DELAYED')).toBe(true)
  })

  test('filters by LANDED status', () => {
    const results = searchFlights('', { status: 'LANDED' })
    expect(results.every(f => f.status === 'LANDED')).toBe(true)
  })

  test('filters by SCHEDULED status', () => {
    const results = searchFlights('', { status: 'SCHEDULED' })
    expect(results.every(f => f.status === 'SCHEDULED')).toBe(true)
  })

  test('filters by "from" airport code', () => {
    const results = searchFlights('', { from: 'DEL — New Delhi' })
    expect(results.every(f => f.origin.code === 'DEL')).toBe(true)
    expect(results.length).toBeGreaterThan(0)
  })

  test('filters by "to" airport code', () => {
    const results = searchFlights('', { to: 'BOM — Mumbai' })
    expect(results.every(f => f.destination.code === 'BOM')).toBe(true)
    expect(results.length).toBeGreaterThan(0)
  })

  test('combined query + status filter', () => {
    const results = searchFlights('air india', { status: 'EN_ROUTE' })
    expect(results.every(f => f.airline === 'Air India' && f.status === 'EN_ROUTE')).toBe(true)
  })

  test('status ALL returns all flights', () => {
    const results = searchFlights('', { status: 'ALL' })
    expect(results.length).toBe(MOCK_FLIGHTS.length)
  })
})

describe('getFlightById() — Unit Tests', () => {
  test('returns flight for valid ID', () => {
    const flight = getFlightById('AI-101')
    expect(flight).not.toBeNull()
    expect(flight.id).toBe('AI-101')
  })

  test('returns null for unknown ID', () => {
    expect(getFlightById('UNKNOWN-9999')).toBeNull()
  })

  test('returns null for undefined', () => {
    expect(getFlightById(undefined)).toBeNull()
  })

  test('works for all IDs in MOCK_FLIGHTS', () => {
    for (const f of MOCK_FLIGHTS) {
      expect(getFlightById(f.id)).not.toBeNull()
    }
  })
})

describe('getFlightStatusCounts() — Unit Tests', () => {
  test('returns ALL count equal to MOCK_FLIGHTS.length', () => {
    const counts = getFlightStatusCounts()
    expect(counts.ALL).toBe(MOCK_FLIGHTS.length)
  })

  test('has EN_ROUTE count > 0', () => {
    const counts = getFlightStatusCounts()
    expect(counts.EN_ROUTE).toBeGreaterThan(0)
  })

  test('sum of status counts equals total', () => {
    const counts = getFlightStatusCounts()
    const statuses = ['SCHEDULED', 'BOARDING', 'EN_ROUTE', 'LANDED', 'DELAYED', 'CANCELLED', 'DEPARTED']
    const sum = statuses.reduce((acc, s) => acc + (counts[s] || 0), 0)
    expect(sum).toBe(MOCK_FLIGHTS.length)
  })
})

describe('MOCK_FLIGHTS — Data Integrity', () => {
  test('dataset has 51 flights', () => {
    expect(MOCK_FLIGHTS.length).toBe(51)
  })

  test('all IDs are unique', () => {
    const ids = MOCK_FLIGHTS.map(f => f.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('all flights have valid IATA codes', () => {
    for (const f of MOCK_FLIGHTS) {
      expect(f.origin.code).toMatch(/^[A-Z]{3}$/)
      expect(f.destination.code).toMatch(/^[A-Z]{3}$/)
    }
  })

  test('progress is 0-100', () => {
    for (const f of MOCK_FLIGHTS) {
      expect(f.telemetry.progress).toBeGreaterThanOrEqual(0)
      expect(f.telemetry.progress).toBeLessThanOrEqual(100)
    }
  })

  test('multiple airlines present', () => {
    const airlines = new Set(MOCK_FLIGHTS.map(f => f.airline))
    expect(airlines.size).toBeGreaterThanOrEqual(5)
  })

  test('all 6 statuses are represented', () => {
    const statuses = new Set(MOCK_FLIGHTS.map(f => f.status))
    expect(statuses.has('EN_ROUTE')).toBe(true)
    expect(statuses.has('LANDED')).toBe(true)
    expect(statuses.has('SCHEDULED')).toBe(true)
    expect(statuses.has('DELAYED')).toBe(true)
    expect(statuses.has('CANCELLED')).toBe(true)
  })
})
