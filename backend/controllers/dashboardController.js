const { getMockFlights } = require('../services/flightService')
const { getMockTrains } = require('../services/trainService')

async function getDashboardSummary(req, res, next) {
  try {
    const [flights, trains] = await Promise.all([getMockFlights(), getMockTrains()])

    const activeFlights = flights.filter((f) => f.status === 'EN_ROUTE' || f.status === 'BOARDING').length
    const activeTrains = trains.filter((t) => t.status === 'RUNNING' || t.status === 'ON_TIME').length
    const delayedRoutes = [...flights, ...trains].filter((v) => v.delay > 0).length

    const busiestAirports = [
      { code: 'DEL', name: 'New Delhi', flights: 312 },
      { code: 'BOM', name: 'Mumbai', flights: 298 },
      { code: 'BLR', name: 'Bengaluru', flights: 241 },
      { code: 'MAA', name: 'Chennai', flights: 198 },
      { code: 'HYD', name: 'Hyderabad', flights: 187 },
      { code: 'CCU', name: 'Kolkata', flights: 165 },
    ]

    const busiestStations = [
      { code: 'NDLS', name: 'New Delhi', trains: 420 },
      { code: 'BCT', name: 'Mumbai Central', trains: 387 },
      { code: 'MAS', name: 'Chennai Central', trains: 312 },
      { code: 'HWH', name: 'Howrah', trains: 298 },
      { code: 'BLR', name: 'Bengaluru City', trains: 254 },
      { code: 'ADI', name: 'Ahmedabad', trains: 221 },
    ]

    // Generate recent activity events
    const recentEvents = [
      { id: 1, type: 'flight', event: 'AI 101 departed New Delhi', time: '2 min ago', severity: 'info' },
      { id: 2, type: 'train', event: 'Shatabdi Express delayed by 12 min', time: '4 min ago', severity: 'warning' },
      { id: 3, type: 'flight', event: 'SG 102 en route to Kolkata', time: '6 min ago', severity: 'info' },
      { id: 4, type: 'train', event: 'Vande Bharat arrived at Agra Cantt', time: '8 min ago', severity: 'success' },
      { id: 5, type: 'flight', event: 'G8 201 delayed by 45 min at Pune', time: '12 min ago', severity: 'warning' },
      { id: 6, type: 'train', event: 'Rajdhani Express on schedule', time: '15 min ago', severity: 'success' },
      { id: 7, type: 'flight', event: 'IX 441 approaching Hyderabad', time: '18 min ago', severity: 'info' },
      { id: 8, type: 'train', event: 'Gatimaan Express departed Nizamuddin', time: '20 min ago', severity: 'info' },
      { id: 9, type: 'flight', event: 'UK 971 boarding at Terminal 3', time: '22 min ago', severity: 'info' },
      { id: 10, type: 'train', event: 'Duronto Express cleared Bhubaneswar', time: '25 min ago', severity: 'success' },
    ]

    res.json({
      success: true,
      data: {
        activeFlights,
        activeTrains,
        delayedRoutes,
        totalFlights: flights.length,
        totalTrains: trains.length,
        recentEvents,
        busiestAirports,
        busiestStations,
        flights: flights.map(({ id, flightNumber, telemetry, status, airline, origin, destination }) => ({
          id, flightNumber, telemetry, status, airline, origin, destination
        })),
        trains: trains.map(({ id, name, number, position, status, type, speed, origin, destination }) => ({
          id, name, number, position, status, type, speed, origin, destination
        })),
      },
    })
  } catch (err) {
    next(err)
  }
}

module.exports = { getDashboardSummary }
