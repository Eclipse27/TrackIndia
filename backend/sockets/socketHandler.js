const { SOCKET_EVENTS } = require('../utils/constants')
const { startTrainEngine, stopTrainEngine } = require('../simulation/trainEngine')
const { startFlightEngine, stopFlightEngine } = require('../simulation/flightEngine')

let enginesStarted = false

/**
 * Initialise all Socket.io event handlers and start simulation engines.
 *
 * @param {import('socket.io').Server} io
 */
function initSocketHandlers(io) {
  // Start simulation engines once on first connection
  io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id} (total: ${io.engine.clientsCount})`)

    // Start engines on first connection
    if (!enginesStarted) {
      startTrainEngine(io)
      startFlightEngine(io)
      enginesStarted = true
    }

    // ─── Subscription handlers ──────────────────────────────────────────
    socket.on(SOCKET_EVENTS.SUBSCRIBE_TRAIN, (trainId) => {
      socket.join(`train:${trainId}`)
      console.log(`[Socket] ${socket.id} subscribed to train:${trainId}`)
    })

    socket.on(SOCKET_EVENTS.UNSUBSCRIBE_TRAIN, (trainId) => {
      socket.leave(`train:${trainId}`)
    })

    socket.on(SOCKET_EVENTS.SUBSCRIBE_FLIGHT, (flightId) => {
      socket.join(`flight:${flightId}`)
      console.log(`[Socket] ${socket.id} subscribed to flight:${flightId}`)
    })

    socket.on(SOCKET_EVENTS.UNSUBSCRIBE_FLIGHT, (flightId) => {
      socket.leave(`flight:${flightId}`)
    })

    socket.on('disconnect', (reason) => {
      console.log(`[Socket] Client disconnected: ${socket.id} — ${reason} (remaining: ${io.engine.clientsCount})`)
    })

    socket.on('error', (err) => {
      console.error(`[Socket] Error from ${socket.id}:`, err.message)
    })
  })
}

module.exports = initSocketHandlers
