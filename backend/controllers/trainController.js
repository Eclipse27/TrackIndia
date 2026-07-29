// Phase 1 stub — Phase 5 will add full implementation
const { getMockTrains, getMockTrainById } = require('../services/trainService')

async function getTrains(req, res, next) {
  try {
    const trains = await getMockTrains()
    res.json({ success: true, count: trains.length, data: trains })
  } catch (err) {
    next(err)
  }
}

async function getTrainById(req, res, next) {
  try {
    const train = await getMockTrainById(req.params.id)
    if (!train) {
      const err = new Error(`Train not found: ${req.params.id}`)
      err.status = 404
      throw err
    }
    res.json({ success: true, data: train })
  } catch (err) {
    next(err)
  }
}

module.exports = { getTrains, getTrainById }
