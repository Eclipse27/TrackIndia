const { getFlights, getFlightById } = require('../services/flightAwareService')

async function getFlightsHandler(req, res, next) {
  try {
    const flights = await getFlights()
    res.json({ success: true, count: flights.length, data: flights })
  } catch (err) {
    next(err)
  }
}

async function getFlightByIdHandler(req, res, next) {
  try {
    const flight = await getFlightById(req.params.id)
    if (!flight) {
      const err = new Error(`Flight not found: ${req.params.id}`)
      err.status = 404
      throw err
    }
    res.json({ success: true, data: flight })
  } catch (err) {
    next(err)
  }
}

module.exports = { getFlights: getFlightsHandler, getFlightById: getFlightByIdHandler }
